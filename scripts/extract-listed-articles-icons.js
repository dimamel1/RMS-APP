/**
 * Extract Icons from Listed Articles Component
 * Node IDs: I21:10524;21:5472 (heart), I21:10524;21:5473 (audio)
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
async function extractIcons() {
  try {
    console.log('🔍 Fetching icons from listed articles component...');
    
    // Extract heart icon (myselection)
    const heartNodeId = 'I21:10524;21:5472';
    const audioNodeId = 'I21:10524;21:5473';
    
    const nodeResponse = await figmaRequest(`/files/${config.fileKey}/nodes?ids=${heartNodeId},${audioNodeId}`);
    
    const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'listed-articles-icons');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Extract heart icon
    if (nodeResponse.nodes && nodeResponse.nodes[heartNodeId]) {
      console.log('📸 Exporting heart icon...');
      const imageResponse = await figmaRequest(`/images/${config.fileKey}?ids=${heartNodeId}&format=png&scale=2`);
      
      if (imageResponse.images && imageResponse.images[heartNodeId]) {
        const outputPath = path.join(outputDir, 'icon-heart.png');
        await downloadImage(imageResponse.images[heartNodeId], outputPath);
        console.log(`✅ Downloaded heart icon to: ${outputPath}`);
      }
    }
    
    // Extract audio icon
    if (nodeResponse.nodes && nodeResponse.nodes[audioNodeId]) {
      console.log('📸 Exporting audio icon...');
      const imageResponse = await figmaRequest(`/images/${config.fileKey}?ids=${audioNodeId}&format=png&scale=2`);
      
      if (imageResponse.images && imageResponse.images[audioNodeId]) {
        const outputPath = path.join(outputDir, 'icon-audio.png');
        await downloadImage(imageResponse.images[audioNodeId], outputPath);
        console.log(`✅ Downloaded audio icon to: ${outputPath}`);
      }
    }
    
    console.log('\n✅ Extraction complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  extractIcons();
}

module.exports = { extractIcons };

