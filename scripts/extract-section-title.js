/**
 * Extract Section Title from Figma
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
          reject(new Error(`API error: ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Find node by ID in the document tree
 */
function findNodeById(node, targetId) {
  if (node.id === targetId) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, targetId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Main extraction
 */
async function extractSectionTitle() {
  try {
    console.log('🔍 Fetching Figma file...');
    const fileResponse = await figmaRequest(`/files/${config.fileKey}`);
    
    // Find the section-title node (21-4877)
    const targetId = '21:4877';
    let titleNode = findNodeById(fileResponse.document, targetId);
    
    // If not found, try searching by name
    if (!titleNode) {
      function searchByName(node, name) {
        const nodeName = node.name ? node.name.toLowerCase() : '';
        if (nodeName.includes('section') && nodeName.includes('title')) {
          return node;
        }
        if (node.children) {
          for (const child of node.children) {
            const found = searchByName(child, name);
            if (found) return found;
          }
        }
        return null;
      }
      titleNode = searchByName(fileResponse.document, 'section-title');
    }
    
    if (!titleNode) {
      throw new Error('Could not find section-title node');
    }
    
    console.log(`✅ Found section-title: ${titleNode.name} (${titleNode.id})`);
    
    // Save node data
    const dataDir = path.resolve(__dirname, '..', 'src', 'data', 'figma');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const nodeFile = path.join(dataDir, 'section-title-node.json');
    fs.writeFileSync(nodeFile, JSON.stringify(titleNode, null, 2), 'utf8');
    console.log(`✅ Saved node data to ${nodeFile}`);
    
    // Save extraction summary
    const summary = {
      nodeId: titleNode.id,
      nodeName: titleNode.name,
      extractedAt: new Date().toISOString(),
    };
    
    const summaryFile = path.join(dataDir, 'section-title-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
    
    console.log('\n✅ Section title extraction complete!');
    console.log(`📁 Node data: ${nodeFile}`);
    console.log(`📁 Summary: ${summaryFile}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  extractSectionTitle();
}

module.exports = { extractSectionTitle };

