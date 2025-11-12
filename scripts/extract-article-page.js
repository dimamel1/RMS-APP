/**
 * Extract Article Page from Figma
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
 * Extract text content from a node recursively
 */
function extractText(node, texts = []) {
  if (node.type === 'TEXT' && node.characters) {
    texts.push({
      id: node.id,
      name: node.name,
      text: node.characters,
      style: node.style || {},
      absoluteBoundingBox: node.absoluteBoundingBox,
    });
  }
  
  if (node.children) {
    for (const child of node.children) {
      extractText(child, texts);
    }
  }
  
  return texts;
}

/**
 * Extract images from a node
 */
async function extractImages(node, nodeId) {
  const images = [];
  
  function findImageNodes(n) {
    if (n.type === 'RECTANGLE' || n.type === 'VECTOR' || n.type === 'COMPONENT' || n.type === 'INSTANCE') {
      if (n.fills && Array.isArray(n.fills)) {
        for (const fill of n.fills) {
          if (fill.type === 'IMAGE' && fill.imageRef) {
            images.push({
              id: n.id,
              name: n.name,
              imageRef: fill.imageRef,
              absoluteBoundingBox: n.absoluteBoundingBox,
            });
          }
        }
      }
    }
    
    if (n.children) {
      for (const child of n.children) {
        findImageNodes(child);
      }
    }
  }
  
  findImageNodes(node);
  
  // Download images
  if (images.length > 0) {
    console.log(`📥 Downloading ${images.length} images...`);
    const imagesDir = path.resolve(__dirname, '..', 'assets', 'figma', 'article-page');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      try {
        const imageResponse = await figmaRequest(`/images/${config.fileKey}?ids=${img.imageRef}&format=png`);
        if (imageResponse.images && imageResponse.images[img.imageRef]) {
          const imageUrl = imageResponse.images[img.imageRef];
          const imagePath = path.join(imagesDir, `image-${img.id.replace(/:/g, '-')}.png`);
          
          // Download image
          await new Promise((resolve, reject) => {
            https.get(imageUrl, (res) => {
              const file = fs.createWriteStream(imagePath);
              res.pipe(file);
              file.on('finish', () => {
                file.close();
                console.log(`✅ Downloaded: ${imagePath}`);
                resolve();
              });
            }).on('error', reject);
          });
          
          img.localPath = `assets/figma/article-page/image-${img.id.replace(/:/g, '-')}.png`;
        }
      } catch (error) {
        console.warn(`⚠️  Could not download image ${img.id}:`, error.message);
      }
    }
  }
  
  return images;
}

/**
 * Main extraction
 */
async function extractArticlePage() {
  try {
    console.log('🔍 Fetching Figma file...');
    const fileResponse = await figmaRequest(`/files/${config.fileKey}`);
    
    // Find the article page node (1-973)
    const targetId = '1:973';
    let articleNode = findNodeById(fileResponse.document, targetId);
    
    // If not found, try searching by name
    if (!articleNode) {
      function searchByName(node, name) {
        const nodeName = node.name ? node.name.toLowerCase() : '';
        if (nodeName.includes('article') || nodeName.includes('page')) {
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
      articleNode = searchByName(fileResponse.document, 'article');
    }
    
    if (!articleNode) {
      throw new Error('Could not find article page node');
    }
    
    console.log(`✅ Found article page: ${articleNode.name} (${articleNode.id})`);
    
    // Save node data
    const dataDir = path.resolve(__dirname, '..', 'src', 'data', 'figma');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const nodeFile = path.join(dataDir, 'article-page-node.json');
    fs.writeFileSync(nodeFile, JSON.stringify(articleNode, null, 2), 'utf8');
    console.log(`✅ Saved node data to ${nodeFile}`);
    
    // Extract text content
    const texts = extractText(articleNode);
    console.log(`📝 Extracted ${texts.length} text elements`);
    
    // Extract images
    const images = await extractImages(articleNode, targetId);
    
    // Save extraction summary
    const summary = {
      nodeId: articleNode.id,
      nodeName: articleNode.name,
      extractedAt: new Date().toISOString(),
      texts: texts.map(t => ({
        name: t.name,
        text: t.text.substring(0, 100), // First 100 chars
        fontSize: t.style.fontSize,
        fontFamily: t.style.fontFamily,
        fontWeight: t.style.fontWeight,
      })),
      images: images.map(img => ({
        id: img.id,
        name: img.name,
        localPath: img.localPath,
      })),
    };
    
    const summaryFile = path.join(dataDir, 'article-page-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
    
    // Save full text content for easy reference
    const textFile = path.join(dataDir, 'article-page-texts.json');
    fs.writeFileSync(textFile, JSON.stringify(texts, null, 2), 'utf8');
    
    console.log('\n✅ Article page extraction complete!');
    console.log(`📁 Node data: ${nodeFile}`);
    console.log(`📁 Summary: ${summaryFile}`);
    console.log(`📁 Texts: ${textFile}`);
    console.log(`\n📊 Summary:`);
    console.log(`   - ${texts.length} text elements`);
    console.log(`   - ${images.length} images`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  extractArticlePage();
}

module.exports = { extractArticlePage };

