/**
 * Anuj Nova Agency - Official Web Server & Backend API
 * Built with vanilla Node.js (Zero external dependencies required)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_JSON_FILE = path.join(DATA_DIR, 'inquiries.json');
const INQUIRIES_CSV_FILE = path.join(DATA_DIR, 'inquiries.csv');

// Ensure data directory and storage files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(INQUIRIES_JSON_FILE)) {
  fs.writeFileSync(INQUIRIES_JSON_FILE, JSON.stringify([], null, 2), 'utf8');
}

if (!fs.existsSync(INQUIRIES_CSV_FILE)) {
  const csvHeaders = 'ID,Timestamp,Name,Email,Phone,Service,Message,IP\n';
  fs.writeFileSync(INQUIRIES_CSV_FILE, csvHeaders, 'utf8');
}

// In-memory cache of recent submissions to strictly prevent duplicate spam (5 minutes)
const recentSubmissions = new Map();

// Clean up recent submission cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [hash, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > 5 * 60 * 1000) {
      recentSubmissions.delete(hash);
    }
  }
}, 60 * 1000);

// MIME type dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=UTF-8'
};

// Helper to escape CSV values
function escapeCsv(field) {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""').replace(/[\r\n]+/g, ' ');
  return `"${str}"`;
}

// Validation helper
function validateInquiry(body) {
  const errors = [];
  
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.push('Please provide a valid full name (at least 2 characters).');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!body.email || typeof body.email !== 'string' || !emailRegex.test(body.email.trim())) {
    errors.push('Please provide a valid email address.');
  }

  // Allow numbers with optional country code, +91, spaces, hyphens (minimum 7 digits)
  const phoneDigits = (body.phone || '').replace(/\D/g, '');
  if (!body.phone || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.push('Please provide a valid contact phone number.');
  }

  const validServices = [
    'Portfolio Website',
    'E-Commerce Website',
    'Business Website',
    'Education Website',
    'Custom Web Development'
  ];
  if (!body.service || typeof body.service !== 'string' || !validServices.includes(body.service.trim())) {
    errors.push('Please select a valid service from the dropdown list.');
  }

  if (!body.message || typeof body.message !== 'string' || body.message.trim().length < 10) {
    errors.push('Please write a brief description of your project (at least 10 characters).');
  }

  return errors;
}

// Read body helper
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1e6) { // 1MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(data || '{}');
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', err => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Set standard CORS & security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API ROUTE: Health check ---
  if (req.method === 'GET' && pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    let inquiryCount = 0;
    try {
      const data = JSON.parse(fs.readFileSync(INQUIRIES_JSON_FILE, 'utf8'));
      inquiryCount = data.length;
    } catch (_) {}
    res.end(JSON.stringify({
      status: 'healthy',
      brand: 'Anuj Nova Agency',
      tagline: 'Building Modern Digital Experiences',
      inquiriesCount: inquiryCount,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // --- API ROUTE: Submit Inquiry (POST /api/inquiry) ---
  if (req.method === 'POST' && pathname === '/api/inquiry') {
    try {
      const body = await parseJsonBody(req);
      const errors = validateInquiry(body);

      if (errors.length > 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: errors.join(' ')
        }));
        return;
      }

      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      
      // Calculate submission fingerprint for duplicate detection
      const fingerprint = crypto
        .createHash('sha256')
        .update(`${body.email.trim().toLowerCase()}_${body.phone.trim()}_${body.message.trim().toLowerCase()}`)
        .digest('hex');

      if (recentSubmissions.has(fingerprint)) {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Duplicate inquiry detected. You have recently sent this exact request. Anuj will reach out to you shortly!'
        }));
        return;
      }

      // Record submission
      recentSubmissions.set(fingerprint, Date.now());

      const inquiryId = 'ANA-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
      const now = new Date();
      const newInquiry = {
        id: inquiryId,
        timestamp: now.toISOString(),
        formattedTime: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        service: body.service.trim(),
        message: body.message.trim(),
        ip: clientIp,
        status: 'NEW_LEAD'
      };

      // Persist to JSON database safely
      let existingInquiries = [];
      try {
        const fileContent = fs.readFileSync(INQUIRIES_JSON_FILE, 'utf8');
        existingInquiries = JSON.parse(fileContent);
      } catch (e) {
        existingInquiries = [];
      }

      existingInquiries.unshift(newInquiry);
      fs.writeFileSync(INQUIRIES_JSON_FILE, JSON.stringify(existingInquiries, null, 2), 'utf8');

      // Append to CSV for instant spreadsheet viewing
      const csvRow = [
        escapeCsv(newInquiry.id),
        escapeCsv(newInquiry.timestamp),
        escapeCsv(newInquiry.name),
        escapeCsv(newInquiry.email),
        escapeCsv(newInquiry.phone),
        escapeCsv(newInquiry.service),
        escapeCsv(newInquiry.message),
        escapeCsv(newInquiry.ip)
      ].join(',') + '\n';
      fs.appendFileSync(INQUIRIES_CSV_FILE, csvRow, 'utf8');

      // Console logging for verification
      console.log(`[INQUIRY RECEIVED] [${newInquiry.formattedTime}] ID: ${newInquiry.id} | From: ${newInquiry.name} (${newInquiry.phone}, ${newInquiry.email}) | Service: ${newInquiry.service}`);

      // Respond with verified success
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: "Your inquiry has been sent successfully. I'll contact you soon.",
        inquiryId: newInquiry.id,
        receivedAt: newInquiry.timestamp
      }));
      return;

    } catch (err) {
      console.error('Error processing inquiry:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Unable to submit your inquiry at this moment. Please reach out directly on WhatsApp (+91 9794030388) or email.'
      }));
      return;
    }
  }

  // --- API ROUTE: Get Inquiries (for verification & client administration) ---
  if (req.method === 'GET' && pathname === '/api/inquiries') {
    try {
      const fileContent = fs.readFileSync(INQUIRIES_JSON_FILE, 'utf8');
      const inquiries = JSON.parse(fileContent);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        total: inquiries.length,
        inquiries
      }));
      return;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to read inquiries.' }));
      return;
    }
  }

  // --- STATIC FILE SERVING ---
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  // Security: prevent path traversal outside PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback for SPA or return 404
      const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
      if (fs.existsSync(fallbackPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        fs.createReadStream(fallbackPath).pipe(res);
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Anuj Nova Agency Web Server Running!`);
  console.log(`🌐 Website URL: http://localhost:${PORT}`);
  console.log(`📨 Inquiry API: http://localhost:${PORT}/api/inquiry`);
  console.log(`📋 Storage: ${INQUIRIES_JSON_FILE}`);
  console.log(`====================================================`);
});
