/**
 * Extract Audio Icon from Figma
 * Node ID: 21-4030
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
 * Download image from URL
 */
function downloadImage(imageUrl, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(outputPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download image: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

/**
 * Main extraction
 */
async function extractAudioIcon() {
  try {
    console.log('🔍 Fetching audio icon from Figma...');
    
    const nodeResponse = await figmaRequest(`/files/${config.fileKey}/nodes?ids=21:4030`);
    
    if (!nodeResponse.nodes || !nodeResponse.nodes['21:4030']) {
      throw new Error('Node not found');
    }
    
    const node = nodeResponse.nodes['21:4030'].document;
    console.log(`✅ Found audio icon: ${node.name} (${node.id})`);
    
    // Export the icon
    console.log('📸 Exporting icon...');
    const imageResponse = await figmaRequest(`/images/${config.fileKey}?ids=21:4030&format=png&scale=2`);
    
    if (!imageResponse.images || !imageResponse.images['21:4030']) {
      throw new Error('Failed to get image URL');
    }
    
    const imageUrl = imageResponse.images['21:4030'];
    
    // Download the icon
    const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'article-main');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'icon-audio.png');
    await downloadImage(imageUrl, outputPath);
    
    console.log(`✅ Downloaded icon to: ${outputPath}`);
    
    // Save node data
    const dataDir = path.resolve(__dirname, '..', 'src', 'data', 'figma');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const nodeFile = path.join(dataDir, 'audio-icon-node.json');
    fs.writeFileSync(nodeFile, JSON.stringify(node, null, 2), 'utf8');
    console.log(`✅ Saved node data to ${nodeFile}`);
    
    console.log('\n✅ Extraction complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  extractAudioIcon();
}

module.exports = { extractAudioIcon };

