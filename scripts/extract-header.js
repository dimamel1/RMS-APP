/**
 * Extract Header from Figma
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
      const imageResponse = await figmaRequest(`/images/${config.fileKey}?ids=${imageIds.join(',')}&format=png&scale=2`);
      
      if (imageResponse.images) {
        const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'header');
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        for (const [imageId, imageUrl] of Object.entries(imageResponse.images)) {
          const fileName = `image-${imageId.replace(/:/g, '-')}.png`;
          const outputPath = path.join(outputDir, fileName);
          
          try {
            await downloadImage(imageUrl, outputPath);
            images.push({
              id: imageId,
              url: imageUrl,
              localPath: `./assets/figma/header/${fileName}`,
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
 * Extract icons from header
 */
async function extractIcons(node) {
  const icons = [];
  const iconIds = [];
  
  function collectIconIds(n) {
    // Look for icon instances or components
    if ((n.type === 'INSTANCE' || n.type === 'COMPONENT') && n.name && n.name.toLowerCase().includes('icon')) {
      iconIds.push(n.id);
    }
    if (n.children) {
      n.children.forEach(collectIconIds);
    }
  }
  
  collectIconIds(node);
  
  if (iconIds.length > 0) {
    console.log(`🎨 Found ${iconIds.length} icons to export`);
    
    try {
      const imageResponse = await figmaRequest(`/images/${config.fileKey}?ids=${iconIds.join(',')}&format=png&scale=2`);
      
      if (imageResponse.images) {
        const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'header-icons');
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        for (const [imageId, imageUrl] of Object.entries(imageResponse.images)) {
          const fileName = `icon-${imageId.replace(/:/g, '-')}.png`;
          const outputPath = path.join(outputDir, fileName);
          
          try {
            await downloadImage(imageUrl, outputPath);
            icons.push({
              id: imageId,
              url: imageUrl,
              localPath: `./assets/figma/header-icons/${fileName}`,
            });
            console.log(`✅ Downloaded icon: ${fileName}`);
          } catch (error) {
            console.warn(`⚠️  Failed to download icon ${imageId}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️  Could not export icons:', error.message);
    }
  }
  
  return icons;
}

/**
 * Main extraction
 */
async function extractHeader() {
  try {
    console.log('🔍 Fetching Figma file...');
    const fileResponse = await figmaRequest(`/files/${config.fileKey}`);
    
    // Find the header node (21-4173)
    const targetId = '21:4173';
    let headerNode = findNodeById(fileResponse.document, targetId);
    
    // If not found, try searching by name
    if (!headerNode) {
      function searchByName(node, name) {
        const nodeName = node.name ? node.name.toLowerCase() : '';
        if (nodeName.includes('header')) {
          return node;
        }
        if (node.children) {
          for (const child of node.children) {
            const found = searchByName(child, name);
            if (found) return found;
          }
        }
        return null;
      }
      headerNode = searchByName(fileResponse.document, 'header');
    }
    
    if (!headerNode) {
      throw new Error('Could not find header node');
    }
    
    console.log(`✅ Found header: ${headerNode.name} (${headerNode.id})`);
    
    // Save node data
    const dataDir = path.resolve(__dirname, '..', 'src', 'data', 'figma');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const nodeFile = path.join(dataDir, 'header-node.json');
    fs.writeFileSync(nodeFile, JSON.stringify(headerNode, null, 2), 'utf8');
    console.log(`✅ Saved node data to ${nodeFile}`);
    
    // Extract images
    const images = await extractImages(headerNode, targetId);
    
    // Extract icons
    const icons = await extractIcons(headerNode);
    
    // Save extraction summary
    const summary = {
      nodeId: headerNode.id,
      nodeName: headerNode.name,
      extractedAt: new Date().toISOString(),
      images: images,
      icons: icons,
    };
    
    const summaryFile = path.join(dataDir, 'header-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
    
    console.log('\n✅ Header extraction complete!');
    console.log(`📁 Node data: ${nodeFile}`);
    console.log(`📁 Summary: ${summaryFile}`);
    console.log(`🖼️  Images: ${images.length} downloaded`);
    console.log(`🎨 Icons: ${icons.length} downloaded`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  extractHeader();
}

module.exports = { extractHeader };

