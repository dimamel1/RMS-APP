/**
 * Extract Bottom Menu from Figma
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
 * Search for bottom menu by name
 */
function findBottomMenu(node) {
  const name = node.name ? node.name.toLowerCase() : '';
  if (name.includes('menu') && (name.includes('bottom') || name.includes('tab') || name.includes('navigation'))) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findBottomMenu(child);
      if (found) return found;
    }
  }
  return null;
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
 * Extract images from node
 */
async function extractImages(node, nodeId) {
  const images = [];
  const imageIds = [];
  
  function collectImageIds(n) {
    if (n.type === 'RECTANGLE' || n.type === 'VECTOR' || n.type === 'COMPONENT' || n.type === 'INSTANCE') {
      if (n.fills && n.fills.some(f => f.type === 'IMAGE')) {
        imageIds.push(n.id);
      }
    }
    if (n.children) {
      n.children.forEach(collectImageIds);
    }
  }
  
  collectImageIds(node);
  
  if (imageIds.length > 0) {
    console.log(`📸 Found ${imageIds.length} images to export`);
    
    try {
      const imageResponse = await figmaRequest(`/images/${config.fileKey}?ids=${imageIds.join(',')}&format=png`);
      
      if (imageResponse.images) {
        const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'bottom-menu');
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        for (const [imageId, imageUrl] of Object.entries(imageResponse.images)) {
          const fileName = `icon-${imageId.replace(/:/g, '-')}.png`;
          const outputPath = path.join(outputDir, fileName);
          
          try {
            await downloadImage(imageUrl, outputPath);
            images.push({
              id: imageId,
              url: imageUrl,
              localPath: `./assets/figma/bottom-menu/${fileName}`,
            });
            console.log(`✅ Downloaded: ${fileName}`);
          } catch (error) {
            console.warn(`⚠️  Failed to download ${imageId}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️  Could not export images:', error.message);
    }
  }
  
  return images;
}

/**
 * Main extraction
 */
async function extractBottomMenu() {
  try {
    console.log('🔍 Fetching Figma file...');
    const fileResponse = await figmaRequest(`/files/${config.fileKey}`);
    
    // Try to find the bottom menu node (21-4256 or search for it)
    const targetId = '21:4256';
    let menuNode = findNodeById(fileResponse.document, targetId);
    
    // If not found, try searching by name
    if (!menuNode) {
      menuNode = findBottomMenu(fileResponse.document);
    }
    
    if (!menuNode) {
      throw new Error('Could not find bottom menu node');
    }
    
    console.log(`✅ Found bottom menu: ${menuNode.name} (${menuNode.id})`);
    
    // Save node data
    const dataDir = path.resolve(__dirname, '..', 'src', 'data', 'figma');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const nodeFile = path.join(dataDir, 'bottom-menu-node.json');
    fs.writeFileSync(nodeFile, JSON.stringify(menuNode, null, 2), 'utf8');
    console.log(`✅ Saved node data to ${nodeFile}`);
    
    // Extract images
    const images = await extractImages(menuNode, targetId);
    
    // Save extraction summary
    const summary = {
      nodeId: menuNode.id,
      nodeName: menuNode.name,
      extractedAt: new Date().toISOString(),
      images: images,
    };
    
    const summaryFile = path.join(dataDir, 'bottom-menu-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
    
    console.log('\n✅ Bottom menu extraction complete!');
    console.log(`📁 Node data: ${nodeFile}`);
    console.log(`📁 Summary: ${summaryFile}`);
    console.log(`🖼️  Images: ${images.length} downloaded`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  extractBottomMenu();
}

module.exports = { extractBottomMenu };

