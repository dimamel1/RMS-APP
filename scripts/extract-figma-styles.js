/**
 * Extract Styles from Figma
 * 
 * Usage:
 *   node scripts/extract-figma-styles.js
 * 
 * Or with environment variables:
 *   FIGMA_ACCESS_TOKEN=your_token FIGMA_FILE_KEY=your_file_key node scripts/extract-figma-styles.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const config = require('./figma-config');

const FIGMA_API_BASE = 'https://api.figma.com/v1';

/**
 * Make a request to Figma API
 */
function figmaRequest(endpoint) {
  return new Promise((resolve, reject) => {
    if (!config.accessToken) {
      reject(new Error('FIGMA_ACCESS_TOKEN is required. Set it as an environment variable or in figma-config.js'));
      return;
    }

    const options = {
      hostname: 'api.figma.com',
      path: endpoint,
      method: 'GET',
      headers: {
        'X-Figma-Token': config.accessToken,
      },
    };

    https.get(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Figma API error: ${res.statusCode} - ${data}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Extract colors from Figma styles
 */
function extractColors(styles) {
  const colors = {};
  
  Object.values(styles).forEach((style) => {
    if (style.styleType === 'FILL' && style.paints && style.paints.length > 0) {
      const paint = style.paints[0];
      if (paint.type === 'SOLID') {
        const r = Math.round(paint.color.r * 255);
        const g = Math.round(paint.color.g * 255);
        const b = Math.round(paint.color.b * 255);
        const a = paint.opacity !== undefined ? paint.opacity : 1;
        
        const hex = `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
        const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
        
        // Use style name as key (sanitized)
        const key = style.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/[^a-z0-9]/g, '');
        
        colors[key] = a < 1 ? rgba : hex;
      }
    }
  });
  
  return colors;
}

/**
 * Extract typography from Figma styles
 */
function extractTypography(styles) {
  const typography = {
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    letterSpacing: {},
  };
  
  Object.values(styles).forEach((style) => {
    if (style.styleType === 'TEXT') {
      const key = style.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '');
      
      if (style.fontSize) {
        typography.fontSize[key] = style.fontSize;
      }
      if (style.fontWeight) {
        typography.fontWeight[key] = style.fontWeight;
      }
      if (style.lineHeightPx) {
        typography.lineHeight[key] = style.lineHeightPx / style.fontSize;
      }
      if (style.letterSpacing) {
        typography.letterSpacing[key] = style.letterSpacing;
      }
    }
  });
  
  return typography;
}

/**
 * Generate design tokens file
 */
function generateTokensFile(colors, typography) {
  const filePath = path.resolve(__dirname, '..', config.output.tokens);
  const dir = path.dirname(filePath);
  
  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const content = `/**
 * Design Tokens extracted from Figma
 * Auto-generated on ${new Date().toISOString()}
 * DO NOT EDIT MANUALLY - This file is auto-generated
 */

export const colors = ${JSON.stringify(colors, null, 2).replace(/"([^"]+)":/g, '$1:')};

export const typography = ${JSON.stringify(typography, null, 2).replace(/"([^"]+)":/g, '$1:')};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
};
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Design tokens saved to ${filePath}`);
}

/**
 * Main extraction function
 */
async function extractStyles() {
  try {
    if (!config.fileKey) {
      throw new Error('FIGMA_FILE_KEY is required. Set it as an environment variable or in figma-config.js');
    }

    console.log('🔍 Fetching styles from Figma...');
    
    // Get file styles
    const stylesResponse = await figmaRequest(`/files/${config.fileKey}/styles`);
    
    if (!stylesResponse.meta || !stylesResponse.meta.styles) {
      console.log('⚠️  No styles found in this Figma file');
      return;
    }
    
    console.log(`📦 Found ${Object.keys(stylesResponse.meta.styles).length} styles`);
    
    // Get style details
    const styleIds = Object.keys(stylesResponse.meta.styles);
    const styleDetails = {};
    
    for (const styleId of styleIds) {
      try {
        const styleResponse = await figmaRequest(`/styles/${styleId}`);
        styleDetails[styleId] = styleResponse.meta;
      } catch (error) {
        console.warn(`⚠️  Could not fetch style ${styleId}:`, error.message);
      }
    }
    
    // Extract colors and typography
    const colors = extractColors(styleDetails);
    const typography = extractTypography(styleDetails);
    
    console.log(`🎨 Extracted ${Object.keys(colors).length} colors`);
    console.log(`📝 Extracted typography styles`);
    
    // Generate tokens file
    generateTokensFile(colors, typography);
    
    console.log('✅ Style extraction complete!');
    
  } catch (error) {
    console.error('❌ Error extracting styles:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  extractStyles();
}

module.exports = { extractStyles };

