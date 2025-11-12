/**
 * Extract Loading Page from Figma
 * Node ID: 1-5007
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
 * Extract text content from node
 */
function extractText(node, texts = []) {
  if (node.type === 'TEXT' && node.characters) {
    const style = node.style || {};
    texts.push({
      id: node.id,
      name: node.name || '',
      text: node.characters,
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      fontPostScriptName: style.fontPostScriptName,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      lineHeight: style.lineHeightPx,
      color: node.fills?.[0]?.color,
      absoluteBoundingBox: node.absoluteBoundingBox,
    });
  }
  if (node.children) {
    node.children.forEach(child => extractText(child, texts));
  }
  return texts;
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
        const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'loading-page');
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
              localPath: `./assets/figma/loading-page/${fileName}`,
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
async function extractLoadingPage() {
  try {
    console.log('🔍 Fetching loading page from Figma...');
    
    const nodeResponse = await figmaRequest(`/files/${config.fileKey}/nodes?ids=1:5007`);
    
    if (!nodeResponse.nodes || !nodeResponse.nodes['1:5007']) {
      throw new Error('Node not found');
    }
    
    const node = nodeResponse.nodes['1:5007'].document;
    console.log(`✅ Found loading page: ${node.name} (${node.id})`);
    
    // Save node data
    const dataDir = path.resolve(__dirname, '..', 'src', 'data', 'figma');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const nodeFile = path.join(dataDir, 'loading-page-node.json');
    fs.writeFileSync(nodeFile, JSON.stringify(node, null, 2), 'utf8');
    console.log(`✅ Saved node data to ${nodeFile}`);
    
    // Extract text content
    const texts = extractText(node);
    console.log(`📝 Extracted ${texts.length} text elements`);
    
    // Extract images
    const images = await extractImages(node, '1:5007');
    
    // Save summary
    const summary = {
      nodeId: node.id,
      nodeName: node.name,
      extractedAt: new Date().toISOString(),
      texts: texts,
      images: images.map(img => ({
        id: img.id,
        name: `Image ${img.id}`,
        localPath: img.localPath,
      })),
      absoluteBoundingBox: node.absoluteBoundingBox,
      backgroundColor: node.backgroundColor,
      fills: node.fills,
      background: node.background,
    };
    
    const summaryFile = path.join(dataDir, 'loading-page-summary.json');
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
  extractLoadingPage();
}

module.exports = { extractLoadingPage };

