/**
 * Search for the heart image asset in Figma file
 * Looking for nodes that might contain just the heart image
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
 * Search for nodes with the heart image reference
 */
function findNodesWithImageRef(node, imageRef, matches = []) {
  // Check fills
  if (node.fills && node.fills.length > 0) {
    for (const fill of node.fills) {
      if (fill.type === 'IMAGE' && fill.imageRef === imageRef) {
        matches.push({
          id: node.id,
          name: node.name,
          type: node.type,
          absoluteBoundingBox: node.absoluteBoundingBox,
        });
      }
    }
  }
  
  // Check background
  if (node.background && node.background.length > 0) {
    for (const bg of node.background) {
      if (bg.type === 'IMAGE' && bg.imageRef === imageRef) {
        matches.push({
          id: node.id,
          name: node.name,
          type: node.type,
          absoluteBoundingBox: node.absoluteBoundingBox,
          isBackground: true,
        });
      }
    }
  }
  
  // Recursively check children
  if (node.children) {
    for (const child of node.children) {
      findNodesWithImageRef(child, imageRef, matches);
    }
  }
  
  return matches;
}

/**
 * Main function
 */
async function findHeartImageAsset() {
  try {
    console.log('🔍 Fetching entire Figma file...');
    const fileResponse = await figmaRequest(`/files/${config.fileKey}`);
    
    const imageRef = '92a9675e20d392ba5e20ce1fdd4008cd009a67f2';
    console.log(`🔍 Searching for nodes with image reference: ${imageRef}...`);
    
    const matches = findNodesWithImageRef(fileResponse.document, imageRef);
    
    console.log(`\n📸 Found ${matches.length} node(s) with this image:`);
    matches.forEach((match, index) => {
      console.log(`\n${index + 1}. Node ID: ${match.id}`);
      console.log(`   Name: ${match.name}`);
      console.log(`   Type: ${match.type}`);
      console.log(`   Is Background: ${match.isBackground || false}`);
      if (match.absoluteBoundingBox) {
        console.log(`   Size: ${match.absoluteBoundingBox.width}x${match.absoluteBoundingBox.height}`);
      }
    });
    
    // Try to find a node that's just an image (not a component with children)
    const imageOnlyNodes = matches.filter(m => 
      m.type === 'RECTANGLE' || 
      (m.type === 'FRAME' && !m.isBackground) ||
      m.name.toLowerCase().includes('image') ||
      m.name.toLowerCase().includes('heart') ||
      m.name.toLowerCase().includes('coeur')
    );
    
    if (imageOnlyNodes.length > 0) {
      console.log(`\n🎯 Found ${imageOnlyNodes.length} potential image-only node(s):`);
      imageOnlyNodes.forEach((node, index) => {
        console.log(`\n${index + 1}. Node ID: ${node.id}`);
        console.log(`   Name: ${node.name}`);
        
        // Try to export this node
        console.log(`   Attempting to export...`);
        extractNodeImage(node.id, node.name);
      });
    } else {
      console.log('\n⚠️  No image-only nodes found. The image is embedded in component backgrounds.');
      console.log('ℹ️  You may need to manually export the background image from Figma.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Extract image from a specific node
 */
async function extractNodeImage(nodeId, nodeName) {
  try {
    const imageResponse = await figmaRequest(`/images/${config.fileKey}?ids=${nodeId}&format=png&scale=2`);
    
    if (!imageResponse.images || !imageResponse.images[nodeId]) {
      console.log(`   ⚠️  Could not export image from node ${nodeId}`);
      return;
    }
    
    const imageUrl = imageResponse.images[nodeId];
    const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'article-main');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const fileName = `image-${nodeId.replace(/:/g, '-')}-clean.png`;
    const outputPath = path.join(outputDir, fileName);
    await downloadImage(imageUrl, outputPath);
    
    console.log(`   ✅ Downloaded to: ${fileName}`);
    
  } catch (error) {
    console.log(`   ⚠️  Error: ${error.message}`);
  }
}

// Run if called directly
if (require.main === module) {
  findHeartImageAsset();
}

module.exports = { findHeartImageAsset };

