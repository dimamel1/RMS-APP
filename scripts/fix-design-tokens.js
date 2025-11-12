/**
 * Fix Design Tokens - Wrap numeric keys in quotes
 */

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'src', 'theme', 'designTokens.js');
let content = fs.readFileSync(filePath, 'utf8');

// Fix keys that start with numbers by wrapping them in quotes
// Match pattern: whitespace + number(s) + non-colon chars + colon
content = content.replace(/(\s+)([0-9][^:]*?):/g, (match, indent, key) => {
  return indent + '"' + key + '":';
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed all numeric keys in designTokens.js');

