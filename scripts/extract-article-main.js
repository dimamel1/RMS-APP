/**
 * Extract Article/Main Component from Figma
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
 * Extract text content from node
 */
function extractText(node, texts = []) {
  if (node.type === 'TEXT' && node.characters) {
    texts.push({
      name: node.name || '',
      text: node.characters,
      fontSize: node.style?.fontSize || node.fontSize,
      fontFamily: node.style?.fontFamily || node.fontFamily,
      fontWeight: node.style?.fontWeight || node.fontWeight,
      lineHeight: node.style?.lineHeight || node.lineHeight,
      color: node.fills?.[0]?.color,
    });
  }
  if (node.children) {
    node.children.forEach(child => extractText(child, texts));
  }
  return texts;
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
        const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'article-main');
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
              localPath: `./assets/figma/article-main/${fileName}`,
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
async function extractArticleMain() {
  try {
    console.log('🔍 Fetching Figma file...');
    const fileResponse = await figmaRequest(`/files/${config.fileKey}`);
    
    // Find the article/main node (21-4892)
    const targetId = '21:4892';
    let articleMainNode = findNodeById(fileResponse.document, targetId);
    
    // If not found, try searching by name
    if (!articleMainNode) {
      function searchByName(node, name) {
        const nodeName = node.name ? node.name.toLowerCase() : '';
        if (nodeName.includes('article') && nodeName.includes('main')) {
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
      articleMainNode = searchByName(fileResponse.document, 'article main');
    }
    
    if (!articleMainNode) {
      throw new Error('Could not find article/main node');
    }
    
    console.log(`✅ Found article/main: ${articleMainNode.name} (${articleMainNode.id})`);
    
    // Save node data
    const dataDir = path.resolve(__dirname, '..', 'src', 'data', 'figma');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const nodeFile = path.join(dataDir, 'article-main-node.json');
    fs.writeFileSync(nodeFile, JSON.stringify(articleMainNode, null, 2), 'utf8');
    console.log(`✅ Saved node data to ${nodeFile}`);
    
    // Extract text content
    const texts = extractText(articleMainNode);
    console.log(`📝 Extracted ${texts.length} text elements`);
    
    // Save texts
    const textsFile = path.join(dataDir, 'article-main-texts.json');
    fs.writeFileSync(textsFile, JSON.stringify(texts, null, 2), 'utf8');
    console.log(`✅ Saved texts to ${textsFile}`);
    
    // Extract images
    const images = await extractImages(articleMainNode, targetId);
    
    // Save extraction summary
    const summary = {
      nodeId: articleMainNode.id,
      nodeName: articleMainNode.name,
      extractedAt: new Date().toISOString(),
      texts: texts,
      images: images.map(img => ({
        id: img.id,
        name: `Image ${img.id}`,
        localPath: img.localPath,
      })),
    };
    
    const summaryFile = path.join(dataDir, 'article-main-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
    console.log(`✅ Saved summary to ${summaryFile}`);
    
    console.log('\n✅ Extraction complete!');
    console.log(`📝 Found ${texts.length} text elements`);
    console.log(`📸 Found ${images.length} images`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  extractArticleMain();
}

module.exports = { extractArticleMain };

