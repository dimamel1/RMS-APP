/**
 * Extract Menu Icons from Figma Bottom Menu
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
 * Find all icon instances in the node
 */
function findIconInstances(node, icons = []) {
  if (node.name && node.name.startsWith('icon/')) {
    icons.push({
      id: node.id,
      name: node.name,
      type: node.type,
    });
  }
  
  if (node.children) {
    node.children.forEach(child => findIconInstances(child, icons));
  }
  
  return icons;
}

/**
 * Extract icons from bottom menu
 */
async function extractMenuIcons() {
  try {
    console.log('🔍 Fetching Figma file...');
    const fileResponse = await figmaRequest(`/files/${config.fileKey}`);
    
    // Find the bottom menu node
    const targetId = '21:4256';
    
    function findNodeById(node, id) {
      if (node.id === id) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNodeById(child, id);
          if (found) return found;
        }
      }
      return null;
    }
    
    const menuNode = findNodeById(fileResponse.document, targetId);
    
    if (!menuNode) {
      throw new Error('Could not find bottom menu node');
    }
    
    console.log(`✅ Found bottom menu: ${menuNode.name}`);
    
    // Find all icon instances
    const iconInstances = findIconInstances(menuNode);
    console.log(`📱 Found ${iconInstances.length} icon instances`);
    
    // Collect all icon node IDs (including nested vector paths)
    const iconIds = new Set();
    
    function collectIconIds(node) {
      if (node.name && node.name.startsWith('icon/')) {
        // Collect this node and all its children
        function collectAll(node) {
          iconIds.add(node.id);
          if (node.children) {
            node.children.forEach(collectAll);
          }
        }
        collectAll(node);
      }
      if (node.children) {
        node.children.forEach(collectIconIds);
      }
    }
    
    collectIconIds(menuNode);
    
    console.log(`📸 Collecting ${iconIds.size} icon nodes for export...`);
    
    // Export icons as images
    const iconIdArray = Array.from(iconIds);
    const images = [];
    
    if (iconIdArray.length > 0) {
      // Split into batches of 100 (Figma API limit)
      const batchSize = 100;
      for (let i = 0; i < iconIdArray.length; i += batchSize) {
        const batch = iconIdArray.slice(i, i + batchSize);
        console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} icons)...`);
        
        try {
          const imageResponse = await figmaRequest(
            `/images/${config.fileKey}?ids=${batch.join(',')}&format=png&scale=2`
          );
          
          if (imageResponse.images) {
            const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'icons');
            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
            }
            
            for (const [imageId, imageUrl] of Object.entries(imageResponse.images)) {
              // Find the icon name for this ID
              function findIconName(node, id) {
                if (node.id === id && node.name && node.name.startsWith('icon/')) {
                  return node.name.replace('icon/', '');
                }
                if (node.children) {
                  for (const child of node.children) {
                    const found = findIconName(child, id);
                    if (found) return found;
                  }
                }
                return null;
              }
              
              const iconName = findIconName(menuNode, imageId) || 'icon';
              const fileName = `${iconName}-${imageId.replace(/:/g, '-')}.png`;
              const outputPath = path.join(outputDir, fileName);
              
              try {
                await downloadImage(imageUrl, outputPath);
                images.push({
                  id: imageId,
                  name: iconName,
                  url: imageUrl,
                  localPath: `./assets/figma/icons/${fileName}`,
                });
                console.log(`✅ Downloaded: ${fileName}`);
              } catch (error) {
                console.warn(`⚠️  Failed to download ${imageId}:`, error.message);
              }
            }
          }
        } catch (error) {
          console.warn(`⚠️  Batch failed:`, error.message);
        }
      }
    }
    
    // Group icons by name
    const iconGroups = {};
    images.forEach(img => {
      if (!iconGroups[img.name]) {
        iconGroups[img.name] = [];
      }
      iconGroups[img.name].push(img);
    });
    
    // Save icon mapping
    const dataDir = path.resolve(__dirname, '..', 'src', 'data', 'figma');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const iconMapping = {
      extractedAt: new Date().toISOString(),
      icons: iconGroups,
      allIcons: images,
    };
    
    const mappingFile = path.join(dataDir, 'menu-icons-mapping.json');
    fs.writeFileSync(mappingFile, JSON.stringify(iconMapping, null, 2), 'utf8');
    
    console.log('\n✅ Icon extraction complete!');
    console.log(`📁 Icon mapping: ${mappingFile}`);
    console.log(`🖼️  Total icons downloaded: ${images.length}`);
    console.log(`📦 Icon groups: ${Object.keys(iconGroups).length}`);
    
    // Print icon groups
    console.log('\n📋 Icon groups:');
    Object.keys(iconGroups).forEach(name => {
      console.log(`   - ${name}: ${iconGroups[name].length} variant(s)`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  extractMenuIcons();
}

module.exports = { extractMenuIcons };

