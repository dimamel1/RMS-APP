/**
 * Extract Category Tag Component from Figma
 * Node ID: 21-4576
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const config = require('./figma-config');

/**
 * Make a request to Figma API
 */
function figmaRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.figma.com',
      path: `/v1${endpoint}`,
      method: 'GET',
      headers: {
        'X-Figma-Token': config.accessToken,
      },
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`API error: ${res.statusCode} - ${data}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Extract text content from node
 */
function extractText(node, texts = []) {
  if (node.type === 'TEXT' && node.characters) {
    const style = node.style || {};
    texts.push({
      id: node.id,
      name: node.name || '',
      text: node.characters,
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      fontPostScriptName: style.fontPostScriptName,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      lineHeight: style.lineHeightPx,
      color: node.fills?.[0]?.color,
      absoluteBoundingBox: node.absoluteBoundingBox,
    });
  }
  if (node.children) {
    node.children.forEach(child => extractText(child, texts));
  }
  return texts;
}

/**
 * Main extraction
 */
async function extractCategoryTag() {
  try {
    console.log('🔍 Fetching category tag from Figma...');
    
    const nodeResponse = await figmaRequest(`/files/${config.fileKey}/nodes?ids=21:4576`);
    
    if (!nodeResponse.nodes || !nodeResponse.nodes['21:4576']) {
      throw new Error('Node not found');
    }
    
    const node = nodeResponse.nodes['21:4576'].document;
    console.log(`✅ Found category tag: ${node.name} (${node.id})`);
    
    // Save node data
    const dataDir = path.resolve(__dirname, '..', 'src', 'data', 'figma');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const nodeFile = path.join(dataDir, 'category-tag-node.json');
    fs.writeFileSync(nodeFile, JSON.stringify(node, null, 2), 'utf8');
    console.log(`✅ Saved node data to ${nodeFile}`);
    
    // Extract text content
    const texts = extractText(node);
    console.log(`📝 Extracted ${texts.length} text elements`);
    
    // Save summary
    const summary = {
      nodeId: node.id,
      nodeName: node.name,
      extractedAt: new Date().toISOString(),
      texts: texts,
      absoluteBoundingBox: node.absoluteBoundingBox,
      backgroundColor: node.backgroundColor,
      fills: node.fills,
      background: node.background,
    };
    
    const summaryFile = path.join(dataDir, 'category-tag-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
    console.log(`✅ Saved summary to ${summaryFile}`);
    
    console.log('\n✅ Extraction complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  extractCategoryTag();
}

module.exports = { extractCategoryTag };

