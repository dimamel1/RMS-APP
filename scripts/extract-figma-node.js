/**
 * Extract Specific Node from Figma
 * 
 * Usage:
 *   node scripts/extract-figma-node.js <node-id>
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
    if (!config.accessToken) {
      reject(new Error('FIGMA_ACCESS_TOKEN is required'));
      return;
    }

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

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Figma API error: ${res.statusCode} - ${data}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Extract node data
 */
async function extractNode(nodeId) {
  try {
    console.log(`🔍 Fetching node ${nodeId} from Figma...`);
    
    const response = await figmaRequest(`/files/${config.fileKey}/nodes?ids=${nodeId}`);
    
    if (!response.nodes || !response.nodes[nodeId]) {
      throw new Error('Node not found');
    }
    
    const node = response.nodes[nodeId].document;
    
    // Save the full node data
    const outputDir = path.resolve(__dirname, '..', 'src', 'data', 'figma');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, `node-${nodeId.replace(/:/g, '-')}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(node, null, 2), 'utf8');
    
    console.log(`✅ Node data saved to ${outputFile}`);
    
    return node;
    
  } catch (error) {
    console.error('❌ Error extracting node:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const nodeId = process.argv[2] || '1-4612';
  extractNode(nodeId);
}

module.exports = { extractNode };

