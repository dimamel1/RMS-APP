/**
 * Extract only the background image from article/main component
 * Node ID: 21-4892
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
async function extractArticleMainImage() {
  try {
    console.log('🔍 Fetching article/main node from Figma...');
    
    // Get the node to find the image reference
    const nodeResponse = await figmaRequest(`/files/${config.fileKey}/nodes?ids=21:4892`);
    
    if (!nodeResponse.nodes || !nodeResponse.nodes['21:4892']) {
      throw new Error('Node not found');
    }
    
    const node = nodeResponse.nodes['21:4892'].document;
    
    // Find the image reference in the background
    let imageRef = null;
    if (node.background && node.background.length > 0) {
      for (const bg of node.background) {
        if (bg.type === 'IMAGE' && bg.imageRef) {
          imageRef = bg.imageRef;
          break;
        }
      }
    }
    
    if (!imageRef) {
      // Try to find image in fills
      if (node.fills && node.fills.length > 0) {
        for (const fill of node.fills) {
          if (fill.type === 'IMAGE' && fill.imageRef) {
            imageRef = fill.imageRef;
            break;
          }
        }
      }
    }
    
    if (!imageRef) {
      throw new Error('No image reference found in node');
    }
    
    console.log(`✅ Found image reference: ${imageRef}`);
    
    // Export the image
    console.log('📸 Exporting image...');
    const imageResponse = await figmaRequest(`/images/${config.fileKey}?ids=21:4892&format=png&scale=2`);
    
    if (!imageResponse.images || !imageResponse.images['21:4892']) {
      throw new Error('Failed to get image URL');
    }
    
    const imageUrl = imageResponse.images['21:4892'];
    console.log(`✅ Got image URL: ${imageUrl.substring(0, 50)}...`);
    
    // Download the image
    const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'article-main');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'image-21-4892-background.png');
    await downloadImage(imageUrl, outputPath);
    
    console.log(`✅ Downloaded image to: ${outputPath}`);
    console.log('\n✅ Extraction complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  extractArticleMainImage();
}

module.exports = { extractArticleMainImage };

