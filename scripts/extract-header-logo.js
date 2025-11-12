/**
 * Extract Header Logo from Figma
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
 * Extract logo from header
 */
async function extractHeaderLogo() {
  try {
    console.log('🔍 Extracting header logo...');
    
    // Logo instance ID from header-node.json: I21:4128 (logo_revmed)
    const logoId = 'I21:4128';
    
    const imageResponse = await figmaRequest(`/images/${config.fileKey}?ids=${logoId}&format=png&scale=2`);
    
    if (!imageResponse.images || !imageResponse.images[logoId]) {
      throw new Error('No logo image returned from API');
    }
    
    const outputDir = path.resolve(__dirname, '..', 'assets', 'figma', 'header');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const fileName = 'logo-revmed.png';
    const outputPath = path.join(outputDir, fileName);
    
    await downloadImage(imageResponse.images[logoId], outputPath);
    console.log(`✅ Downloaded: ${fileName}`);
    
    console.log('\n✅ Header logo extraction complete!');
    console.log(`📁 Logo saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  extractHeaderLogo();
}

module.exports = { extractHeaderLogo };

