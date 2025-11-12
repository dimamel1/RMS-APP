/**
 * Extract Article Bar Icons from Figma
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
 * Download image from Figma
 */
function downloadImage(imageUrl, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (res) => {
      const file = fs.createWriteStream(outputPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    }).on('error', reject);
  });
}

/**
 * Extract icons from article bar
 */
async function extractArticleBarIcons() {
  try {
    console.log('🔍 Extracting article bar icons...');
    
    // Icon instance IDs from article-bar-node.json:
    // Close: I21:4398;21:4035
    // Share: I21:4400;21:4035
    // Audio: I21:4401;21:4035
    
    const iconIds = [
      'I21:4398;21:4035', // Close
      'I21:4400;21:4035', // Share
      'I21:4401;21:4035', // Audio
    ];
    
    const imageResponse = await figmaRequest(`/images/${config.fileKey}?ids=${iconIds.join(',')}&format=png&scale=2`);
    
    if (!imageResponse.images) {
      throw new Error('No images returned from API');
    }
    
    const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'article-bar-icons');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const iconMap = {
      'I21:4398;21:4035': 'close',
      'I21:4400;21:4035': 'share',
      'I21:4401;21:4035': 'audio',
    };
    
    for (const [imageId, imageUrl] of Object.entries(imageResponse.images)) {
      const iconName = iconMap[imageId] || imageId.replace(/:/g, '-');
      const fileName = `icon-${iconName}.png`;
      const outputPath = path.join(outputDir, fileName);
      
      try {
        await downloadImage(imageUrl, outputPath);
        console.log(`✅ Downloaded: ${fileName}`);
      } catch (error) {
        console.warn(`⚠️  Failed to download ${imageId}:`, error.message);
      }
    }
    
    console.log('\n✅ Article bar icons extraction complete!');
    console.log(`📁 Icons saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  extractArticleBarIcons();
}

module.exports = { extractArticleBarIcons };

