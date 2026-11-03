/**
 * Hall Khoj Finder — Phase 3 Comprehensive Test Suite
 * Tests Authentication, RBAC, Database & Staff, and Image Upload (Multer)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
let serverProcess = null;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      if (Buffer.isBuffer(options.body)) {
        req.write(options.body);
      } else if (typeof options.body === 'string') {
        req.write(options.body);
      } else {
        req.write(JSON.stringify(options.body));
      }
    }
    req.end();
  });
}

// Multipart form-data builder for testing file upload without external dependencies
function createMultipartFormData(boundary, fields, file) {
  const parts = [];

  for (const [key, value] of Object.entries(fields)) {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`
      )
    );
  }

  if (file) {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${file.fieldname}"; filename="${file.filename}"\r\nContent-Type: ${file.mimetype}\r\n\r\n`
      )
    );
    parts.push(file.buffer);
    parts.push(Buffer.from('\r\n'));
  }

  parts.push(Buffer.from(`--${boundary}--\r\n`));
  return Buffer.concat(parts);
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING PHASE 3 INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  try {
    // 1. Health Endpoint
    console.log('TEST 1: API Health Check');
    const health = await request('/api/health');
    assert(health.status === 200, `Health status code is 200 (got ${health.status})`);
    assert(health.body.success === true, 'Health body success is true');
    assert(health.body.phase.includes('Phase 3'), 'Health confirms Phase 3 integration');

    // 2. Customer Registration
    console.log('\nTEST 2: Customer Registration & Authentication');
    const timestamp = Date.now();
    const customerEmail = `customer_${timestamp}@hallkhoj.com`;
    const regRes = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: 'Priya Sharma',
        email: customerEmail,
        mobile: '9876501234',
        password: 'Password@123',
        role: 'customer',
        city: 'Lucknow',
        state: 'Uttar Pradesh'
      }
    });
    assert(regRes.status === 201, `Customer registered with 201 (got ${regRes.status})`);
    assert(regRes.body.data && regRes.body.data.token, 'Customer received valid JWT token');
    assert(regRes.body.data.user.role === 'customer' || regRes.body.data.user.role === 'user', 'Customer role correctly set');
    assert(!regRes.body.data.user.password, 'Password omitted from returned user object');

    const customerToken = regRes.body.data?.token;

    // 3. Customer Profile Inspection
    console.log('\nTEST 3: Token Verification (/api/auth/me)');
    const meRes = await request('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert(meRes.status === 200, `Get profile status code is 200 (got ${meRes.status})`);
    assert(meRes.body.data?.email === customerEmail, 'Retrieved matching customer email');

    // 4. Owner Registration
    console.log('\nTEST 4: Owner Registration & Profile Document');
    const ownerEmail = `owner_${timestamp}@hallkhoj.com`;
    const ownerReg = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: 'Vikram Singh',
        email: ownerEmail,
        mobile: '9876509876',
        password: 'Owner@12345!',
        role: 'owner',
        businessName: 'Singh Grand Resort',
        businessType: 'Marriage Hall',
        city: 'Varanasi',
        state: 'Uttar Pradesh'
      }
    });
    assert(ownerReg.status === 201, `Owner registered with 201 (got ${ownerReg.status})`);
    assert(ownerReg.body.data?.user?.role === 'owner', 'Owner role correctly assigned');
    const ownerToken = ownerReg.body.data?.token;

    // 5. Customer Login
    console.log('\nTEST 5: Login Verification (/api/auth/login)');
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        email: customerEmail,
        password: 'Password@123'
      }
    });
    assert(loginRes.status === 200, `Login returns 200 (got ${loginRes.status})`);
    assert(loginRes.body.data?.token, 'Login returned valid JWT');

    // 6. Database Staff Operations (CRUD)
    console.log('\nTEST 6: Staff Management (/api/staff)');
    const staffList = await request('/api/staff');
    assert(staffList.status === 200, `List staff returns 200 (got ${staffList.status})`);
    assert(Array.isArray(staffList.body.data), 'Staff data is an array');

    // Add Staff
    const addStaffRes = await request('/api/staff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ownerToken}`
      },
      body: {
        name: 'Deepak Verma',
        mobile: '9415055555',
        role: 'Event Coordinator',
        experience: '4 years',
        description: 'Wedding setup and VIP hospitality specialist'
      }
    });
    assert(addStaffRes.status === 201, `Add staff returns 201 (got ${addStaffRes.status})`);
    assert(addStaffRes.body.data?.role === 'Event Coordinator', 'Staff role correctly set');
    const createdStaffId = addStaffRes.body.data?.id;

    // Remove Staff
    if (createdStaffId) {
      const deleteStaffRes = await request(`/api/staff/${createdStaffId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${ownerToken}` }
      });
      assert(deleteStaffRes.status === 200, `Delete staff returns 200 (got ${deleteStaffRes.status})`);
    }

    // 7. Image Upload Verification (Valid JPEG)
    console.log('\nTEST 7: Image Upload (/api/upload/image)');
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    // Minimal valid 1x1 JPEG buffer
    const minimalJpg = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
      0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
      0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20, 0x24, 0x2E, 0x27, 0x20,
      0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29, 0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27,
      0x39, 0x3D, 0x38, 0x32, 0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
      0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F,
      0x00, 0xBF, 0x00, 0xFF, 0xD9
    ]);

    const multipartBody = createMultipartFormData(
      boundary,
      { folder: 'venues' },
      {
        fieldname: 'image',
        filename: 'test-hall-photo.jpg',
        mimetype: 'image/jpeg',
        buffer: minimalJpg
      }
    );

    const uploadRes = await request('/api/upload/image', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': multipartBody.length,
        'Authorization': `Bearer ${ownerToken}`
      },
      body: multipartBody
    });

    assert(uploadRes.status === 201, `Upload image returns 201 (got ${uploadRes.status})`);
    assert(uploadRes.body.data && uploadRes.body.data.url, `Upload returned public/local URL: ${uploadRes.body.data?.url}`);
    assert(uploadRes.body.data?.storageProvider, `Storage provider indicated: ${uploadRes.body.data?.storageProvider}`);

    // Verify local file exists on disk
    if (uploadRes.body.data?.url?.startsWith('/assets/uploads/')) {
      const fileName = path.basename(uploadRes.body.data.url);
      const filePath = path.join(__dirname, '../frontend/assets/uploads', fileName);
      assert(fs.existsSync(filePath), `Uploaded image file verified on disk: ${filePath}`);
    }

    // 8. Image Upload Rejection (Invalid File Type)
    console.log('\nTEST 8: Upload File Type Rejection (.txt / text/plain)');
    const invalidBoundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const invalidBody = createMultipartFormData(
      invalidBoundary,
      { folder: 'venues' },
      {
        fieldname: 'image',
        filename: 'malicious.txt',
        mimetype: 'text/plain',
        buffer: Buffer.from('This is not an image')
      }
    );

    const rejectRes = await request('/api/upload/image', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${invalidBoundary}`,
        'Content-Length': invalidBody.length
      },
      body: invalidBody
    });

    assert(rejectRes.status === 400, `Invalid file type correctly rejected with 400 (got ${rejectRes.status})`);
    assert(rejectRes.body.code === 'INVALID_FILE_TYPE', `Error code matches INVALID_FILE_TYPE: ${rejectRes.body.code}`);

    // 9. Admin Metrics Verification
    console.log('\nTEST 9: Admin Metrics & Verifications');
    const adminMetrics = await request('/api/admin/metrics');
    assert(adminMetrics.status === 200, `Admin metrics returns 200 (got ${adminMetrics.status})`);
    assert(adminMetrics.body.data && adminMetrics.body.data.totalUsers !== undefined, 'Admin metrics contains totalUsers');

    console.log('\n====================================================');
    console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('====================================================');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
