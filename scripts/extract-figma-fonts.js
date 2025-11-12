/**
 * Extract Fonts from Figma
 * This script extracts font information from the Figma project
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
 * Extract font information from node
 */
function extractFonts(node, fontMap = new Map()) {
  if (node.type === 'TEXT') {
    const style = node.style;
    if (style) {
      const fontFamily = style.fontFamily;
      const fontPostScriptName = style.fontPostScriptName;
      const fontWeight = style.fontWeight;
      const fontSize = style.fontSize;
      
      if (fontFamily) {
        const fontKey = `${fontFamily}-${fontPostScriptName || 'Regular'}-${fontWeight || 400}`;
        if (!fontMap.has(fontKey)) {
          fontMap.set(fontKey, {
            fontFamily: fontFamily,
            fontPostScriptName: fontPostScriptName,
            fontWeight: fontWeight || 400,
            fontStyle: style.fontStyle || 'normal',
            fontSize: fontSize,
            examples: [],
          });
        }
        const fontInfo = fontMap.get(fontKey);
        if (node.characters && !fontInfo.examples.includes(node.characters.substring(0, 20))) {
          fontInfo.examples.push(node.characters.substring(0, 20));
        }
      }
    }
  }
  
  if (node.children) {
    for (const child of node.children) {
      extractFonts(child, fontMap);
    }
  }
  
  return fontMap;
}

/**
 * Main extraction
 */
async function extractFigmaFonts() {
  try {
    console.log('🔍 Fetching Figma file...');
    const fileResponse = await figmaRequest(`/files/${config.fileKey}`);
    
    console.log('📝 Extracting font information...');
    const fontMap = extractFonts(fileResponse.document);
    
    const fonts = Array.from(fontMap.values()).map(font => ({
      fontFamily: font.fontFamily,
      fontPostScriptName: font.fontPostScriptName,
      fontWeight: font.fontWeight,
      fontStyle: font.fontStyle,
      exampleText: font.examples[0] || '',
    }));
    
    // Save font information
    const dataDir = path.resolve(__dirname, '..', 'src', 'data', 'figma');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const fontsFile = path.join(dataDir, 'fonts.json');
    fs.writeFileSync(fontsFile, JSON.stringify(fonts, null, 2), 'utf8');
    
    console.log('\n✅ Font extraction complete!');
    console.log(`📁 Fonts data saved to: ${fontsFile}`);
    console.log(`\n📊 Found ${fonts.length} unique fonts:\n`);
    
    fonts.forEach((font, index) => {
      console.log(`${index + 1}. ${font.fontFamily}`);
      console.log(`   PostScript: ${font.fontPostScriptName || 'N/A'}`);
      console.log(`   Weight: ${font.fontWeight}`);
      console.log(`   Style: ${font.fontStyle}`);
      console.log(`   Example: "${font.exampleText}"`);
      console.log('');
    });
    
    // Generate font mapping for React Native
    const fontMapping = {};
    fonts.forEach(font => {
      const key = font.fontPostScriptName || font.fontFamily;
      if (!fontMapping[key]) {
        fontMapping[key] = {
          fontFamily: font.fontFamily,
          fontWeight: font.fontWeight,
          fontStyle: font.fontStyle,
        };
      }
    });
    
    const mappingFile = path.join(dataDir, 'font-mapping.json');
    fs.writeFileSync(mappingFile, JSON.stringify(fontMapping, null, 2), 'utf8');
    console.log(`📁 Font mapping saved to: ${mappingFile}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  extractFigmaFonts();
}

module.exports = { extractFigmaFonts };

