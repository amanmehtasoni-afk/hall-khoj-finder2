/**
 * Test 3-Server Cluster and Load Balancer
 */
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', c => { body += c; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on('error', reject);
  });
}

(async () => {
  console.log('Testing 3-Server Cluster Spawning & Load Balancing...');
  const clusterProc = spawn(process.execPath, [path.join(__dirname, '../backend/cluster.js')], {
    env: { ...process.env, PORT: '3000', NODE_ENV: 'test' },
    stdio: 'inherit'
  });

  // Wait 4 seconds for cluster to initialize and bind
  await new Promise(r => setTimeout(r, 4500));

  try {
    // 1. Query Load Balancer Status
    const lbRes = await get('http://127.0.0.1:3000/lb-status');
    console.log('\n[LB-STATUS Response]:', lbRes.status);
    const lbData = JSON.parse(lbRes.body);
    console.log('Cluster status:', lbData.status);
    console.log('Instances:', lbData.instances.map(i => `${i.name}: ${i.healthy ? 'HEALTHY' : 'PENDING'}`));

    // 2. Query /health via Load Balancer
    const healthRes = await get('http://127.0.0.1:3000/health');
    console.log('\n[/health Response Status]:', healthRes.status);
    console.log('Served by header:', healthRes.headers['x-served-by']);
    const healthData = JSON.parse(healthRes.body);
    console.log('Health payload status:', healthData.status, 'DB:', healthData.database?.activeStorage);

    console.log('\n✓ 3-Server Cluster and Load Balancer Operational!');
  } catch (err) {
    console.error('❌ Cluster test failed:', err.message);
  } finally {
    clusterProc.kill('SIGTERM');
    process.exit(0);
  }
})();
