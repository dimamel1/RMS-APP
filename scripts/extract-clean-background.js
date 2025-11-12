/**
 * Try to find and extract just the background image layer
 * by searching for RECTANGLE nodes with image fills
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
 * Find RECTANGLE nodes with image fills (potential background layers)
 */
function findImageRectangles(node, rectangles = []) {
  if (node.type === 'RECTANGLE' && node.fills && node.fills.length > 0) {
    for (const fill of node.fills) {
      if (fill.type === 'IMAGE' && fill.imageRef) {
        rectangles.push({
          id: node.id,
          name: node.name,
          type: node.type,
          imageRef: fill.imageRef,
          absoluteBoundingBox: node.absoluteBoundingBox,
        });
      }
    }
  }
  
  if (node.children) {
    for (const child of node.children) {
      findImageRectangles(child, rectangles);
    }
  }
  
  return rectangles;
}

/**
 * Main extraction
 */
async function extractCleanBackground() {
  try {
    console.log('🔍 Fetching article/main node from Figma...');
    
    const nodeResponse = await figmaRequest(`/files/${config.fileKey}/nodes?ids=21:4892`);
    
    if (!nodeResponse.nodes || !nodeResponse.nodes['21:4892']) {
      throw new Error('Node not found');
    }
    
    const node = nodeResponse.nodes['21:4892'].document;
    
    console.log('🔍 Searching for RECTANGLE nodes with image fills...');
    const rectangles = findImageRectangles(node);
    
    if (rectangles.length === 0) {
      console.log('⚠️  No RECTANGLE nodes with image fills found.');
      console.log('ℹ️  The background image is likely in the component background, not a child node.');
      console.log('ℹ️  You may need to manually export just the background layer from Figma.');
      return;
    }
    
    console.log(`\n📸 Found ${rectangles.length} RECTANGLE node(s) with image fills:`);
    rectangles.forEach((rect, index) => {
      console.log(`\n${index + 1}. Node ID: ${rect.id}`);
      console.log(`   Name: ${rect.name}`);
      console.log(`   Image Ref: ${rect.imageRef}`);
      if (rect.absoluteBoundingBox) {
        console.log(`   Size: ${rect.absoluteBoundingBox.width}x${rect.absoluteBoundingBox.height}`);
      }
    });
    
    // Try to export the first rectangle (likely the background)
    if (rectangles.length > 0) {
      const bgRect = rectangles[0];
      console.log(`\n📸 Exporting background image from node ${bgRect.id}...`);
      
      const imageResponse = await figmaRequest(`/images/${config.fileKey}?ids=${bgRect.id}&format=png&scale=2`);
      
      if (!imageResponse.images || !imageResponse.images[bgRect.id]) {
        console.log('⚠️  Could not export image from this node.');
        return;
      }
      
      const imageUrl = imageResponse.images[bgRect.id];
      console.log(`✅ Got image URL`);
      
      const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'article-main');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const outputPath = path.join(outputDir, 'image-background-clean.png');
      await downloadImage(imageUrl, outputPath);
      
      console.log(`✅ Downloaded clean background to: ${outputPath}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  extractCleanBackground();
}

module.exports = { extractCleanBackground };

