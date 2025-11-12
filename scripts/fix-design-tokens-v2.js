/**
 * Fix Design Tokens - Wrap numeric keys in quotes (improved version)
 */

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'src', 'theme', 'designTokens.js');
let content = fs.readFileSync(filePath, 'utf8');

// First, fix the date string that got broken
content = content.replace(/Auto-generated on "([^"]+)":/, 'Auto-generated on $1');

// Fix keys that start with numbers - be more specific to only match object property keys
// Match: start of line + whitespace + number(s) + alphanumeric chars + colon
// But exclude hex colors and other values
content = content.replace(/(\n\s+)([0-9][a-zA-Z0-9]*?):/g, (match, indent, key) => {
  // Only quote if it's not already quoted
  if (!key.startsWith('"') && !key.endsWith('"')) {
    return indent + '"' + key + '":';
  }
  return match;
});

// Also fix keys that are just numbers
content = content.replace(/(\n\s+)("?)([0-9]+)("?):/g, (match, indent, quote1, num, quote2) => {
  if (!quote1 && !quote2) {
    return indent + '"' + num + '":';
  }
  return match;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed design tokens file');

