/**
 * Find the background image node ID in article/main component
 * We need to find the actual image layer, not the component
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
 * Find image nodes recursively
 */
function findImageNodes(node, imageNodes = []) {
  // Check if this node has an image fill
  if (node.fills && node.fills.length > 0) {
    for (const fill of node.fills) {
      if (fill.type === 'IMAGE' && fill.imageRef) {
        imageNodes.push({
          id: node.id,
          name: node.name,
          type: node.type,
          imageRef: fill.imageRef,
          absoluteBoundingBox: node.absoluteBoundingBox,
        });
      }
    }
  }
  
  // Check background
  if (node.background && node.background.length > 0) {
    for (const bg of node.background) {
      if (bg.type === 'IMAGE' && bg.imageRef) {
        imageNodes.push({
          id: node.id,
          name: node.name,
          type: node.type,
          imageRef: bg.imageRef,
          absoluteBoundingBox: node.absoluteBoundingBox,
          isBackground: true,
        });
      }
    }
  }
  
  // Recursively check children
  if (node.children) {
    for (const child of node.children) {
      findImageNodes(child, imageNodes);
    }
  }
  
  return imageNodes;
}

/**
 * Main function
 */
async function findBackgroundImageNode() {
  try {
    console.log('🔍 Fetching article/main node from Figma...');
    
    const nodeResponse = await figmaRequest(`/files/${config.fileKey}/nodes?ids=21:4892`);
    
    if (!nodeResponse.nodes || !nodeResponse.nodes['21:4892']) {
      throw new Error('Node not found');
    }
    
    const node = nodeResponse.nodes['21:4892'].document;
    
    console.log('🔍 Searching for image nodes...');
    const imageNodes = findImageNodes(node);
    
    console.log(`\n📸 Found ${imageNodes.length} image node(s):`);
    imageNodes.forEach((imgNode, index) => {
      console.log(`\n${index + 1}. Node ID: ${imgNode.id}`);
      console.log(`   Name: ${imgNode.name}`);
      console.log(`   Type: ${imgNode.type}`);
      console.log(`   Image Ref: ${imgNode.imageRef}`);
      console.log(`   Is Background: ${imgNode.isBackground || false}`);
      if (imgNode.absoluteBoundingBox) {
        console.log(`   Size: ${imgNode.absoluteBoundingBox.width}x${imgNode.absoluteBoundingBox.height}`);
      }
    });
    
    // Save results
    const outputPath = path.resolve(__dirname, '..', 'src', 'data', 'figma', 'article-main-image-nodes.json');
    fs.writeFileSync(outputPath, JSON.stringify(imageNodes, null, 2), 'utf8');
    console.log(`\n✅ Saved results to ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  findBackgroundImageNode();
}

module.exports = { findBackgroundImageNode };

