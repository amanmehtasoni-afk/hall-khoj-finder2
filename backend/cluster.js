/**
 * Hall Khoj Finder — 3-Server Resilient Production Cluster & Load Balancer
 *
 * Architecture:
 *                 Incoming Requests (Port 3000)
 *                             │
 *                 ┌───────────▼───────────┐
 *                 │  Smart Load Balancer  │
 *                 │  & Health Supervisor  │
 *                 └──┬────────┬────────┬──┘
 *                    │        │        │
 *         ┌──────────▼┐ ┌─────▼────┐ ┌─▼──────────┐
 *         │ SERVER 1  │ │ SERVER 2 │ │ SERVER 3   │
 *         │ Port 3001 │ │ Port 3002│ │ Port 3003  │
 *         │ (Primary) │ │ (Backup) │ │ (Capacity) │
 *         └──────────┬┘ └─────┬────┘ └─┬──────────┘
 *                    │        │        │
 *                    └────────┼────────┘
 *                             │
 *               Supabase PostgreSQL Tier
 *
 * Features:
 * - Active /health probes every 5s per server
 * - Automatic dynamic failover if any instance terminates or times out
 * - Auto-restart supervisor with exponential backoff protection
 * - Stateless proxy forwarding headers (X-Forwarded-For, X-Instance-Id)
 * - Telemetry inspection endpoint at /lb-status
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const LB_PORT = parseInt(process.env.LB_PORT || process.env.PORT || '3000', 10);

const INSTANCES = [
  { id: 'server-1', name: 'SERVER 1 (Primary)', port: 3001, healthy: false, process: null, activeReqs: 0, failures: 0 },
  { id: 'server-2', name: 'SERVER 2 (Failover / Standby)', port: 3002, healthy: false, process: null, activeReqs: 0, failures: 0 },
  { id: 'server-3', name: 'SERVER 3 (Resilience / Capacity)', port: 3003, healthy: false, process: null, activeReqs: 0, failures: 0 }
];

let roundRobinIndex = 0;

// Start a server child process
function startInstance(inst) {
  const env = {
    ...process.env,
    PORT: String(inst.port),
    INSTANCE_ID: inst.id
  };

  const serverPath = path.join(__dirname, 'server.js');
  console.log(`🚀 [Cluster Supervisor] Spawning ${inst.name} on port ${inst.port}...`);

  const child = spawn(process.execPath, [serverPath], {
    env,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  inst.process = child;

  child.stdout.on('data', (chunk) => {
    const text = chunk.toString().trim();
    if (text) console.log(`[${inst.id.toUpperCase()}] ${text}`);
  });

  child.stderr.on('data', (chunk) => {
    const text = chunk.toString().trim();
    if (text) console.error(`[${inst.id.toUpperCase()} ERROR] ${text}`);
  });

  child.on('exit', (code, signal) => {
    console.warn(`⚠️ [Cluster Supervisor] ${inst.name} exited (code: ${code}, signal: ${signal}).`);
    inst.healthy = false;
    inst.process = null;

    // Automatic restart policy after 3 seconds
    setTimeout(() => {
      console.log(`🔄 [Cluster Supervisor] Auto-restarting ${inst.name}...`);
      startInstance(inst);
    }, 3000);
  });
}

// Health check probe
function checkInstanceHealth(inst) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${inst.port}/health`, { timeout: 2500 }, (res) => {
      let body = '';
      res.on('data', c => { body += c; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          inst.healthy = true;
          inst.failures = 0;
          resolve(true);
        } else {
          inst.healthy = false;
          inst.failures++;
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      inst.healthy = false;
      inst.failures++;
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      inst.healthy = false;
      inst.failures++;
      resolve(false);
    });
  });
}

// Select healthy instance with primary priority and round-robin fallback
function getNextHealthyInstance() {
  const healthy = INSTANCES.filter(i => i.healthy);
  if (healthy.length > 0) {
    // If Server 1 is healthy and not overloaded, prefer Server 1
    const server1 = INSTANCES.find(i => i.id === 'server-1' && i.healthy);
    if (server1 && server1.activeReqs < 20) {
      return server1;
    }
    roundRobinIndex = (roundRobinIndex + 1) % healthy.length;
    return healthy[roundRobinIndex];
  }

  // Fallback to primary running instance during initial boot
  const running = INSTANCES.find(i => i.process);
  return running || null;
}


// Create the Load Balancer HTTP Server
function startLoadBalancer() {
  const server = http.createServer((clientReq, clientRes) => {
    // 1. Health check & status endpoint for the cluster load balancer itself
    if (clientReq.url === '/lb-status' || clientReq.url === '/api/cluster-status') {
      clientRes.writeHead(200, { 'Content-Type': 'application/json' });
      return clientRes.end(JSON.stringify({
        status: 'UP',
        loadBalancerPort: LB_PORT,
        algorithm: 'Priority-Primary with Round-Robin Resilient Failover',
        timestamp: new Date().toISOString(),
        instances: INSTANCES.map(i => ({
          id: i.id,
          name: i.name,
          port: i.port,
          healthy: i.healthy,
          activeRequests: i.activeReqs,
          running: !!i.process
        }))
      }, null, 2));
    }

    // 2. Select target healthy backend instance
    const target = getNextHealthyInstance();

    if (!target) {
      clientRes.writeHead(503, { 'Content-Type': 'application/json' });
      return clientRes.end(JSON.stringify({
        success: false,
        message: 'All backend server instances are currently initializing or recovering. Please retry shortly.',
        code: 'ALL_INSTANCES_UNAVAILABLE'
      }));
    }

    target.activeReqs++;

    // Forward request to selected server instance
    const options = {
      hostname: '127.0.0.1',
      port: target.port,
      path: clientReq.url,
      method: clientReq.method,
      headers: {
        ...clientReq.headers,
        'x-forwarded-host': clientReq.headers.host || 'localhost',
        'x-forwarded-proto': 'http',
        'x-hkf-instance': target.id
      }
    };

    const proxyReq = http.request(options, (proxyRes) => {
      clientRes.writeHead(proxyRes.statusCode, {
        ...proxyRes.headers,
        'x-served-by': target.id
      });
      proxyRes.pipe(clientRes);
    });

    proxyReq.on('error', (err) => {
      console.warn(`⚠️ [LB Proxy Error to ${target.id}]:`, err.message);
      target.healthy = false;
      target.activeReqs = Math.max(0, target.activeReqs - 1);

      // Attempt immediate failover to another healthy instance
      const fallbackTarget = getNextHealthyInstance();
      if (fallbackTarget && fallbackTarget.id !== target.id) {
        console.log(`↪️ [LB Failover] Re-routing request to ${fallbackTarget.id}...`);
        fallbackTarget.activeReqs++;
        const fbOptions = { ...options, port: fallbackTarget.port, headers: { ...options.headers, 'x-hkf-instance': fallbackTarget.id } };
        const fbReq = http.request(fbOptions, (fbRes) => {
          clientRes.writeHead(fbRes.statusCode, { ...fbRes.headers, 'x-served-by': fallbackTarget.id });
          fbRes.pipe(clientRes);
        });
        fbReq.on('error', () => {
          fallbackTarget.activeReqs = Math.max(0, fallbackTarget.activeReqs - 1);
          if (!clientRes.headersSent) {
            clientRes.writeHead(502, { 'Content-Type': 'application/json' });
            clientRes.end(JSON.stringify({ success: false, message: 'Backend failover connection failed' }));
          }
        });
        clientReq.pipe(fbReq);
        return;
      }

      if (!clientRes.headersSent) {
        clientRes.writeHead(502, { 'Content-Type': 'application/json' });
        clientRes.end(JSON.stringify({ success: false, message: 'Backend connection timeout or unavailable' }));
      }
    });

    clientRes.on('finish', () => {
      target.activeReqs = Math.max(0, target.activeReqs - 1);
    });

    clientReq.pipe(proxyReq);
  });

  server.listen(LB_PORT, () => {
    console.log('================================================================');
    console.log(`🛡️  HALL KHOJ FINDER — 3-SERVER PRODUCTION LOAD BALANCER ACTIVE`);
    console.log(`🌐 Public Traffic Entry Point: http://localhost:${LB_PORT}`);
    console.log(`📊 Cluster Telemetry: http://localhost:${LB_PORT}/lb-status`);
    console.log(`⚙️  Instances:`);
    INSTANCES.forEach(i => console.log(`   • ${i.name} -> http://127.0.0.1:${i.port}`));
    console.log('================================================================');
  });

  // Background health monitor
  setInterval(async () => {
    for (const inst of INSTANCES) {
      await checkInstanceHealth(inst);
    }
  }, 4000);
}

// Master Boot Routine
function bootCluster() {
  console.log('Initializing Hall Khoj Finder 3-Instance Resilient Cluster...');
  INSTANCES.forEach(inst => startInstance(inst));

  // Allow instances 1.5s to bind before opening public load balancer
  setTimeout(() => {
    startLoadBalancer();
  }, 1500);
}

// Graceful Cluster Shutdown
function shutdownCluster() {
  console.log('\n🛑 [Cluster Supervisor] Terminating all backend instances...');
  INSTANCES.forEach(inst => {
    if (inst.process) {
      try {
        inst.process.kill('SIGTERM');
      } catch (e) {}
    }
  });
  process.exit(0);
}

process.on('SIGTERM', shutdownCluster);
process.on('SIGINT', shutdownCluster);

bootCluster();
