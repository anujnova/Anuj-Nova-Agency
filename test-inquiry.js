/**
 * Automated Verification Test for Anuj Nova Agency Server & Inquiry API
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', err => reject(err));

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING VERIFICATION TESTS ---');

  // Test 1: Health check
  console.log('Test 1: Checking /api/health ...');
  const healthRes = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/api/health',
    method: 'GET'
  });
  console.log(`Health status: ${healthRes.statusCode}, body: ${healthRes.body}`);
  if (healthRes.statusCode !== 200) throw new Error('Health check failed');

  // Test 2: Static file serving (index.html)
  console.log('Test 2: Checking static file serving /index.html ...');
  const indexRes = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/',
    method: 'GET'
  });
  if (indexRes.statusCode !== 200 || !indexRes.body.includes('Anuj Nova Agency')) {
    throw new Error('Static index.html serving failed');
  }
  console.log('✓ index.html successfully served.');

  // Test 3: Static CSS serving
  console.log('Test 3: Checking static file serving /css/style.css ...');
  const cssRes = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/css/style.css',
    method: 'GET'
  });
  if (cssRes.statusCode !== 200 || !cssRes.body.includes('--accent-gradient')) {
    throw new Error('Static css/style.css serving failed');
  }
  console.log('✓ style.css successfully served.');

  // Test 4: Inquiry validation failure on empty/invalid payload
  console.log('Test 4: Checking validation failure on invalid inquiry payload ...');
  const invalidPayload = JSON.stringify({
    name: 'A', // too short
    email: 'not-an-email',
    phone: '12', // too short
    service: 'Invalid Service',
    message: 'hi' // too short
  });
  const invalidRes = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/api/inquiry',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(invalidPayload)
    }
  }, invalidPayload);

  console.log(`Validation failure test status: ${invalidRes.statusCode}, body: ${invalidRes.body}`);
  if (invalidRes.statusCode !== 400) {
    throw new Error(`Expected 400 validation error, got ${invalidRes.statusCode}`);
  }
  console.log('✓ Validation correctly rejected bad inputs.');

  // Test 5: Valid Inquiry Submission
  console.log('Test 5: Submitting a valid test inquiry ...');
  const testEmail = `test_${Date.now()}@example.com`;
  const validPayload = JSON.stringify({
    name: 'Rohan Sharma',
    email: testEmail,
    phone: '+91 9876543210',
    service: 'E-Commerce Website',
    message: 'Hi Anuj, I am launching an apparel store and need a custom e-commerce website with product catalog and WhatsApp order integration.'
  });

  const validRes = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/api/inquiry',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(validPayload)
    }
  }, validPayload);

  console.log(`Valid submission response: ${validRes.statusCode}, body: ${validRes.body}`);
  if (validRes.statusCode !== 200) {
    throw new Error(`Expected 200 OK, got ${validRes.statusCode}`);
  }
  const resultJson = JSON.parse(validRes.body);
  if (!resultJson.success || !resultJson.inquiryId) {
    throw new Error('Expected success: true and inquiryId');
  }
  console.log(`✓ Inquiry successfully saved with ID: ${resultJson.inquiryId}`);

  // Test 6: Duplicate Prevention
  console.log('Test 6: Testing duplicate submission rejection ...');
  const dupRes = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/api/inquiry',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(validPayload)
    }
  }, validPayload);

  console.log(`Duplicate test status: ${dupRes.statusCode}, body: ${dupRes.body}`);
  if (dupRes.statusCode !== 429) {
    throw new Error(`Expected 429 for duplicate submission, got ${dupRes.statusCode}`);
  }
  console.log('✓ Duplicate submission successfully detected and blocked.');

  // Test 7: Verify inquiries saved on disk
  console.log('Test 7: Verifying data persistence on disk ...');
  const jsonFilePath = path.join(__dirname, 'data', 'inquiries.json');
  const csvFilePath = path.join(__dirname, 'data', 'inquiries.csv');
  
  const savedData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  const found = savedData.find(item => item.email === testEmail);
  if (!found) {
    throw new Error('Test inquiry not found in inquiries.json');
  }
  console.log(`✓ Inquiry persisted in inquiries.json: ${found.name} (${found.service})`);

  const csvContent = fs.readFileSync(csvFilePath, 'utf8');
  if (!csvContent.includes(testEmail)) {
    throw new Error('Test inquiry not found in inquiries.csv');
  }
  console.log('✓ Inquiry persisted in inquiries.csv.');

  console.log('\n========================================');
  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! (7/7)');
  console.log('========================================');
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
