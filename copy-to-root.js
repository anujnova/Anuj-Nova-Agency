const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const publicDir = path.join(rootDir, 'public');

// 1. Copy style.css
const cssSrc = path.join(publicDir, 'css', 'style.css');
const cssDst = path.join(rootDir, 'style.css');
if (fs.existsSync(cssSrc)) {
  fs.copyFileSync(cssSrc, cssDst);
  console.log('✓ Copied style.css to root directory');
}

// 2. Copy and adapt main.js
const jsSrc = path.join(publicDir, 'js', 'main.js');
const jsDst = path.join(rootDir, 'main.js');
if (fs.existsSync(jsSrc)) {
  fs.copyFileSync(jsSrc, jsDst);
  console.log('✓ Copied main.js to root directory');
}

// 3. Adapt and copy index.html
const htmlSrc = path.join(publicDir, 'index.html');
const htmlDst = path.join(rootDir, 'index.html');
if (fs.existsSync(htmlSrc)) {
  let html = fs.readFileSync(htmlSrc, 'utf8');
  // Update stylesheet and script references so they work in root
  html = html.replace('href="css/style.css"', 'href="style.css"');
  html = html.replace('src="js/main.js"', 'src="main.js"');
  fs.writeFileSync(htmlDst, html, 'utf8');
  console.log('✓ Created index.html in root directory pointing to style.css and main.js');
}

// 4. Ensure inquiries.json and inquiries.csv also exist in root
const dataDir = path.join(rootDir, 'data');
const jsonSrc = path.join(dataDir, 'inquiries.json');
const jsonDst = path.join(rootDir, 'inquiries.json');
if (fs.existsSync(jsonSrc)) {
  fs.copyFileSync(jsonSrc, jsonDst);
  console.log('✓ Copied inquiries.json to root directory');
} else {
  fs.writeFileSync(jsonDst, '[]', 'utf8');
}

const csvSrc = path.join(dataDir, 'inquiries.csv');
const csvDst = path.join(rootDir, 'inquiries.csv');
if (fs.existsSync(csvSrc)) {
  fs.copyFileSync(csvSrc, csvDst);
  console.log('✓ Copied inquiries.csv to root directory');
} else {
  fs.writeFileSync(csvDst, 'ID,Timestamp,Name,Email,Phone,Service,Message,IP\n', 'utf8');
}

console.log('\n🎉 ALL FILES ARE NOW IN ONE SINGLE FOLDER:');
console.log(rootDir);
