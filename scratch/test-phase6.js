/**
 * Hall Khoj Finder — Phase 6 Verification Test Suite
 * Admin Panel: Platform Metrics, Owner KYC, User Suspension, Listing Moderation, Audit Logs & Strict RBAC
 */

const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 3000;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    let body = options.body;
    if (body && typeof body === 'object') {
      body = JSON.stringify(body);
    }

    const req = http.request({
      host: API_HOST,
      port: API_PORT,
      path: `/api${path}`,
      method: options.method || 'GET',
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n🚀 ========================================================');
  console.log('   HALL KHOJ FINDER — PHASE 6 TEST SUITE (ADMIN PANEL)');
  console.log('========================================================\n');

  const timestamp = Date.now();
  const customerEmail = `cust_p6_${timestamp}@hallkhoj.com`;
  const ownerEmail = `owner_p6_${timestamp}@hallkhoj.com`;
  let adminToken = null;
  let customerToken = null;
  let ownerToken = null;
  let testCustomerId = null;
  let testOwnerId = null;
  let testListingId = null;

  try {
    // 1. Authenticate Admin and Register Test Accounts
    console.log('--- 1. Admin Authentication & User Setup ---');
    const adminLoginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@hallkhoj.com',
        password: 'AdminPass@123'
      }
    });
    assert(adminLoginRes.status === 200, 'Master Admin logs in with 200 OK');
    assert(adminLoginRes.data?.data?.user?.role === 'admin', 'Master Admin role verified as "admin"');
    adminToken = adminLoginRes.data?.data?.token;

    // Register test customer
    const custRegRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Target Customer',
        email: customerEmail,
        mobile: '9888877777',
        password: 'Password@123',
        role: 'user',
        city: 'Lucknow'
      }
    });
    assert(custRegRes.status === 201, 'Test customer registered');
    customerToken = custRegRes.data?.data?.token;
    testCustomerId = custRegRes.data?.data?.user?.id;

    // Register test owner
    const ownerRegRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Pradeep Tiwari',
        email: ownerEmail,
        mobile: '9777766666',
        password: 'Password@123',
        role: 'owner',
        city: 'Lucknow',
        businessName: 'Tiwari Grand Lawn',
        businessType: 'Banquet Lawns'
      }
    });
    assert(ownerRegRes.status === 201, 'Test owner registered');
    ownerToken = ownerRegRes.data?.data?.token;
    testOwnerId = ownerRegRes.data?.data?.user?.id;

    // 2. Strict RBAC Protection Tests
    console.log('\n--- 2. Strict RBAC Authorization Tests ---');
    // Customer calling admin endpoints -> 403 Forbidden
    const custVerQueue = await request('/admin/verifications', {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(custVerQueue.status === 403, 'Customer rejected from /api/admin/verifications (403 Forbidden)');

    const custUsersList = await request('/admin/users', {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(custUsersList.status === 403, 'Customer rejected from /api/admin/users (403 Forbidden)');

    const custSuspend = await request(`/admin/users/${testCustomerId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { status: 'SUSPENDED' }
    });
    assert(custSuspend.status === 403, 'Customer rejected from suspending users (403 Forbidden)');

    // Owner calling admin endpoints -> 403 Forbidden
    const ownerVerAction = await request('/admin/verify-owner', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { ownerId: `owner_${testOwnerId}`, status: 'APPROVED' }
    });
    assert(ownerVerAction.status === 403, 'Owner rejected from /api/admin/verify-owner (403 Forbidden)');

    const ownerListingsMod = await request('/admin/listings', {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(ownerListingsMod.status === 403, 'Owner rejected from /api/admin/listings (403 Forbidden)');

    const ownerAudit = await request('/admin/audit-logs', {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(ownerAudit.status === 403, 'Owner rejected from /api/admin/audit-logs (403 Forbidden)');

    // 3. Platform Metrics & Telemetry
    console.log('\n--- 3. Platform Metrics & Telemetry ---');
    const metricsRes = await request('/admin/metrics', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(metricsRes.status === 200, 'GET /api/admin/metrics returns 200 OK');
    assert(typeof metricsRes.data?.data?.totalUsers === 'number', 'Metrics includes totalUsers');
    assert(typeof metricsRes.data?.data?.activeListings === 'number', 'Metrics includes activeListings');
    assert(typeof metricsRes.data?.data?.pendingVerifications === 'number', 'Metrics includes pendingVerifications');
    assert(typeof metricsRes.data?.data?.totalGmv === 'number', 'Metrics includes totalGmv calculation');

    // 4. Owner KYC Verification Workflow
    console.log('\n--- 4. Owner KYC Verification Workflow ---');
    const verQueueRes = await request('/admin/verifications', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(verQueueRes.status === 200, 'GET /api/admin/verifications returns 200 OK');
    assert(Array.isArray(verQueueRes.data?.data), 'Verification queue returns array of pending partners');

    // Approve owner KYC
    const verifyActionRes = await request('/admin/verify-owner', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        ownerId: `owner_${testOwnerId}`,
        status: 'APPROVED'
      }
    });
    assert(verifyActionRes.status === 200, 'POST /api/admin/verify-owner returns 200 OK');
    assert(verifyActionRes.data?.data?.verifiedBadgeGranted === true, 'Verified Badge granted upon approval');

    // 5. User Management & Account Suspension Lifecycle
    console.log('\n--- 5. User Management & Account Suspension ---');
    const usersListRes = await request('/admin/users', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(usersListRes.status === 200, 'GET /api/admin/users returns 200 OK');
    assert(Array.isArray(usersListRes.data?.data), 'Users endpoint returns array');
    const foundCust = usersListRes.data?.data?.find(u => u.id === testCustomerId);
    assert(foundCust !== undefined, 'Target customer found in directory');
    assert(foundCust.password === undefined, 'Security: Password hash omitted from user directory');

    // Suspend Customer Account
    const suspendRes = await request(`/admin/users/${testCustomerId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        status: 'SUSPENDED',
        reason: 'Repeated cancellation of confirmed venues'
      }
    });
    assert(suspendRes.status === 200, 'PATCH /api/admin/users/:id/status suspends customer account');
    assert(suspendRes.data?.data?.accountStatus === 'SUSPENDED', 'User accountStatus is SUSPENDED');
    assert(suspendRes.data?.data?.isSuspended === true, 'User isSuspended is true');

    // Verify Suspended Account Login Rejection
    const rejectedLoginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: customerEmail,
        password: 'Password@123'
      }
    });
    assert(rejectedLoginRes.status === 403, 'Suspended user cannot log in (403 Forbidden)');
    assert(rejectedLoginRes.data?.code === 'ACCOUNT_SUSPENDED', 'Error code matches ACCOUNT_SUSPENDED');

    // Restore Customer Account
    const restoreRes = await request(`/admin/users/${testCustomerId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'ACTIVE' }
    });
    assert(restoreRes.status === 200, 'Admin can restore customer account to ACTIVE');
    assert(restoreRes.data?.data?.accountStatus === 'ACTIVE', 'User accountStatus is ACTIVE');

    // Verify Restored Account Login Success
    const restoredLoginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: customerEmail,
        password: 'Password@123'
      }
    });
    assert(restoredLoginRes.status === 200, 'Restored customer can log in successfully');

    // 6. Listing Moderation Lifecycle
    console.log('\n--- 6. Listing Moderation Lifecycle ---');
    // Owner creates a new listing submitted for approval
    const createListingRes = await request('/halls', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: {
        name: 'Tiwari Grand Banquet & Lawns',
        category: 'Banquet Lawns',
        city: 'Lucknow',
        capacityMax: 700,
        startingPrice: 60000
      }
    });
    assert(createListingRes.status === 201, 'Owner creates listing pending approval');
    testListingId = createListingRes.data?.data?.id;

    // Admin lists all listings
    const adminListingsRes = await request('/admin/listings', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminListingsRes.status === 200, 'GET /api/admin/listings returns 200 OK');
    const targetListing = adminListingsRes.data?.data?.find(l => l.id === testListingId);
    assert(targetListing !== undefined, 'Pending listing found in admin moderation pool');

    // Admin approves the listing
    const approveListingRes = await request(`/admin/listings/${testListingId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        status: 'APPROVED',
        moderationNote: 'Verified high quality venue photos and premises'
      }
    });
    assert(approveListingRes.status === 200, 'Admin approves listing (200 OK)');
    assert(approveListingRes.data?.data?.status === 'APPROVED', 'Listing status updated to APPROVED');
    assert(approveListingRes.data?.data?.verified === true, 'Listing marked as verified');

    // Admin flags a listing
    const flagListingRes = await request(`/admin/listings/${testListingId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        status: 'FLAGGED',
        moderationNote: 'Incomplete fire safety certificate submitted'
      }
    });
    assert(flagListingRes.status === 200, 'Admin flags listing (200 OK)');
    assert(flagListingRes.data?.data?.status === 'FLAGGED', 'Listing status updated to FLAGGED');

    // 7. System Audit Trail Verification
    console.log('\n--- 7. System Audit Trail Verification ---');
    const auditRes = await request('/admin/audit-logs', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(auditRes.status === 200, 'GET /api/admin/audit-logs returns 200 OK');
    assert(Array.isArray(auditRes.data?.data), 'Audit logs returns array');
    const actions = auditRes.data?.data?.map(l => l.action) || [];
    assert(actions.includes('VERIFY_OWNER'), 'Audit trail recorded VERIFY_OWNER event');
    assert(actions.includes('SUSPEND_USER'), 'Audit trail recorded SUSPEND_USER event');
    assert(actions.includes('ACTIVATE_USER'), 'Audit trail recorded ACTIVATE_USER event');
    assert(actions.includes('MODERATE_LISTING'), 'Audit trail recorded MODERATE_LISTING event');

  } catch (err) {
    console.error('Fatal Test Error:', err);
    failed++;
  }

  console.log('\n========================================================');
  console.log(`📊 PHASE 6 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
