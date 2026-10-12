const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

// Match all IDs
const ids = new Set();
const idRegex = /id=["']([^"']+)["']/g;
let match;
while ((match = idRegex.exec(html)) !== null) {
  ids.add(match[1]);
}

// Match all hash hrefs
const hrefRegex = /href=["']#([^"']+)["']/g;
const missing = [];
const validHrefs = [];
while ((match = hrefRegex.exec(html)) !== null) {
  const targetId = match[1];
  if (!ids.has(targetId)) {
    missing.push(targetId);
  } else {
    validHrefs.push(targetId);
  }
}

console.log('Total IDs found in HTML:', ids.size);
console.log('Verified internal anchor targets:', Array.from(new Set(validHrefs)));
if (missing.length > 0) {
  console.error('❌ Missing target IDs:', missing);
  process.exit(1);
} else {
  console.log('✅ ALL internal anchor links match valid section IDs in index.html!');
}
