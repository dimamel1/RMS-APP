/**
 * Extract Loading Page as Image from Figma
 * Node ID: 1-5007
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
async function extractLoadingPageImage() {
  try {
    console.log('🔍 Exporting loading page as image from Figma...');
    
    // Export the entire loading page node
    const imageResponse = await figmaRequest(`/images/${config.fileKey}?ids=1:5007&format=png&scale=2`);
    
    if (!imageResponse.images || !imageResponse.images['1:5007']) {
      throw new Error('Failed to get image URL');
    }
    
    const imageUrl = imageResponse.images['1:5007'];
    console.log(`✅ Got image URL`);
    
    // Download the image
    const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'loading-page');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'loading-page.png');
    await downloadImage(imageUrl, outputPath);
    
    console.log(`✅ Downloaded loading page image to: ${outputPath}`);
    console.log('\n✅ Extraction complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  extractLoadingPageImage();
}

module.exports = { extractLoadingPageImage };

