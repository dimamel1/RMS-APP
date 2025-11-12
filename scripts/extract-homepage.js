/**
 * Extract Home Page from Figma
 * Extracts the home page design, images, icons, and structure
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
        const outputDir = path.resolve(__dirname, '..', 'assets', 'figma');
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
              localPath: `./assets/figma/${fileName}`,
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
async function extractHomePage() {
  try {
    console.log('🔍 Fetching Figma file...');
    const fileResponse = await figmaRequest(`/files/${config.fileKey}`);
    
    // Try to find the home page node (1-4612 or search for it)
    const targetId = '1:4612';
    let homePageNode = findNodeById(fileResponse.document, targetId);
    
    // If not found, try searching for common home page names
    if (!homePageNode) {
      function searchByName(node, name) {
        if (node.name && (node.name.toLowerCase().includes('home') || node.name.toLowerCase().includes('accueil'))) {
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
      homePageNode = searchByName(fileResponse.document, 'home');
    }
    
    if (!homePageNode) {
      // Use the first canvas/frame as fallback
      if (fileResponse.document.children && fileResponse.document.children[0]) {
        homePageNode = fileResponse.document.children[0];
        console.log('ℹ️  Using first canvas as home page');
      } else {
        throw new Error('Could not find home page node');
      }
    }
    
    console.log(`✅ Found home page: ${homePageNode.name} (${homePageNode.id})`);
    
    // Save node data
    const dataDir = path.resolve(__dirname, '..', 'src', 'data', 'figma');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const nodeFile = path.join(dataDir, 'homepage-node.json');
    fs.writeFileSync(nodeFile, JSON.stringify(homePageNode, null, 2), 'utf8');
    console.log(`✅ Saved node data to ${nodeFile}`);
    
    // Extract images
    const images = await extractImages(homePageNode, targetId);
    
    // Save extraction summary
    const summary = {
      nodeId: homePageNode.id,
      nodeName: homePageNode.name,
      extractedAt: new Date().toISOString(),
      images: images,
    };
    
    const summaryFile = path.join(dataDir, 'homepage-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
    
    console.log('\n✅ Home page extraction complete!');
    console.log(`📁 Node data: ${nodeFile}`);
    console.log(`📁 Summary: ${summaryFile}`);
    console.log(`🖼️  Images: ${images.length} downloaded`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  extractHomePage();
}

module.exports = { extractHomePage };

