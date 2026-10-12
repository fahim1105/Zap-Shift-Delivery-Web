const fs = require('fs');

// Read the current index.js
let content = fs.readFileSync('./index.js', 'utf8');

// Find where routes start (after verifyAdmin function)
// We need to remove the async function run() wrapper and close it properly

// Step 1: Remove "async function run() {" and its try block
content = content.replace(/async function run\(\) \{\s+try \{/, '// Routes are now at the top level for Vercel serverless');

// Step 2: Move all routes outside and add getCollections() to each
// Replace collection references with await getCollections()
const replacements = [
    { from: /const db = client\.db\('zap_shift_db'\);[\s\S]*?const ridersCollection = db\.collection\('riders'\);/g, to: '' },
    { from: /usersCollection\./g, to: '(await getCollections()).usersCollection.' },
    { from: /parcelCollection\./g, to: '(await getCollections()).parcelCollection.' },
    { from: /paymentCollection\./g, to: '(await getCollections()).paymentCollection.' },
    { from: /ridersCollection\./g, to: '(await getCollections()).ridersCollection.' },
];

replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
});

// Step 3: Remove the closing of run() function and its call
content = content.replace(/\/\/ Send a ping[\s\S]*?run\(\)\.catch\(console\.dir\);/g, '');

// Step 4: Remove extra try-finally blocks
content = content.replace(/} finally \{[\s\S]*?\}/g, '');

// Step 5: Clean up extra closing braces
content = content.replace(/\n\s*\}\s*\n\s*\}\s*\napp\.get\('\/'/g, '\n\napp.get(\'/');

// Write the refactored content
fs.writeFileSync('./index-refactored.js', content, 'utf8');
console.log('✅ Refactored code written to index-refactored.js');
console.log('Please review it before replacing index.js');
