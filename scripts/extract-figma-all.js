/**
 * Extract All Design Data from Figma
 * Extracts styles, colors, typography, and components from your Figma file
 * 
 * Usage:
 *   node scripts/extract-figma-all.js
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
      reject(new Error('FIGMA_ACCESS_TOKEN is required'));
      return;
    }

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
 * Convert Figma color to hex/rgba
 */
function colorToHex(color, opacity = 1) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  
  if (opacity < 1) {
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Extract colors from file nodes recursively
 */
function extractColorsFromNodes(node, colors = {}) {
  if (node.fills && Array.isArray(node.fills)) {
    node.fills.forEach((fill) => {
      if (fill.type === 'SOLID' && fill.color) {
        const hex = colorToHex(fill.color, fill.opacity || 1);
        const key = node.name 
          ? node.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') || 'color'
          : 'color';
        
        if (!colors[key] || key !== 'color') {
          colors[key] = hex;
        }
      }
    });
  }
  
  if (node.strokes && Array.isArray(node.strokes)) {
    node.strokes.forEach((stroke) => {
      if (stroke.type === 'SOLID' && stroke.color) {
        const hex = colorToHex(stroke.color, stroke.opacity || 1);
        const key = `border${node.name ? node.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') : ''}`;
        colors[key] = hex;
      }
    });
  }
  
  if (node.children) {
    node.children.forEach(child => extractColorsFromNodes(child, colors));
  }
  
  return colors;
}

/**
 * Extract typography from file nodes recursively
 */
function extractTypographyFromNodes(node, typography = { fontSize: {}, fontWeight: {}, lineHeight: {} }) {
  if (node.type === 'TEXT' && node.style) {
    const key = node.name 
      ? node.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') || 'text'
      : 'text';
    
    if (node.style.fontSize) {
      typography.fontSize[key] = node.style.fontSize;
    }
    if (node.style.fontWeight) {
      typography.fontWeight[key] = node.style.fontWeight;
    }
    if (node.style.lineHeightPx && node.style.fontSize) {
      typography.lineHeight[key] = (node.style.lineHeightPx / node.style.fontSize).toFixed(2);
    }
  }
  
  if (node.children) {
    node.children.forEach(child => extractTypographyFromNodes(child, typography));
  }
  
  return typography;
}

/**
 * Generate design tokens file
 */
function generateTokensFile(colors, typography) {
  const filePath = path.resolve(__dirname, '..', config.output.tokens);
  const dir = path.dirname(filePath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Merge with default tokens
  const defaultColors = {
    primary: '#2563eb',
    primaryDark: '#1e40af',
    primaryLight: '#3b82f6',
    background: '#ffffff',
    surface: '#f1f5f9',
    text: '#1d191c',
    textSecondary: '#64748b',
    textLight: '#94a3b8',
    border: '#e2e8f0',
  };
  
  const mergedColors = { ...defaultColors, ...colors };
  
  // Format colors object with proper quoting for numeric keys
  const formatColors = (obj) => {
    const entries = Object.entries(obj);
    const formatted = entries.map(([key, value]) => {
      // Keep quotes for numeric keys or keys starting with numbers
      const quotedKey = /^[0-9]/.test(key) ? `"${key}"` : key;
      return `  ${quotedKey}: ${JSON.stringify(value)}`;
    });
    return `{\n${formatted.join(',\n')}\n}`;
  };
  
  const content = `/**
 * Design Tokens extracted from Figma
 * Auto-generated on ${new Date().toISOString()}
 * Source: REVMED-APP Figma file
 * DO NOT EDIT MANUALLY - This file is auto-generated
 */

export const colors = ${formatColors(mergedColors)};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: ${formatColors(typography.fontSize || {})},
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
${Object.entries(typography.fontWeight || {}).map(([key, value]) => {
    const quotedKey = /^[0-9]/.test(key) ? `"${key}"` : key;
    return `    ${quotedKey}: ${JSON.stringify(value)}`;
  }).join(',\n')},
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
${Object.entries(typography.lineHeight || {}).map(([key, value]) => {
    const quotedKey = /^[0-9]/.test(key) ? `"${key}"` : key;
    return `    ${quotedKey}: ${JSON.stringify(value)}`;
  }).join(',\n')},
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 1.5,
  },
};

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

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Design tokens saved to ${filePath}`);
}

/**
 * Main extraction function
 */
async function extractAll() {
  try {
    if (!config.fileKey) {
      throw new Error('FIGMA_FILE_KEY is required');
    }

    console.log('🔍 Fetching file data from Figma...');
    
    // Get file data
    const fileResponse = await figmaRequest(`/files/${config.fileKey}`);
    
    if (!fileResponse.document) {
      throw new Error('Invalid file response from Figma');
    }
    
    console.log(`📦 Analyzing file structure...`);
    
    // Extract colors from all nodes
    const colors = extractColorsFromNodes(fileResponse.document);
    console.log(`🎨 Extracted ${Object.keys(colors).length} colors`);
    
    // Extract typography from all nodes
    const typography = extractTypographyFromNodes(fileResponse.document);
    console.log(`📝 Extracted typography styles`);
    
    // Generate tokens file
    generateTokensFile(colors, typography);
    
    // Try to get styles if available
    try {
      console.log('🔍 Fetching published styles from Figma...');
      const stylesResponse = await figmaRequest(`/files/${config.fileKey}/styles`);
      if (stylesResponse.meta && stylesResponse.meta.styles) {
        console.log(`📦 Found ${Object.keys(stylesResponse.meta.styles).length} published styles`);
      }
    } catch (error) {
      console.log('ℹ️  No published styles found (this is okay - using colors from file)');
    }
    
    console.log('✅ Extraction complete!');
    console.log(`\n📁 Output: ${config.output.tokens}`);
    console.log(`\n💡 You can now import and use these tokens in your app:`);
    console.log(`   import { colors, typography } from './src/theme/designTokens';`);
    
  } catch (error) {
    console.error('❌ Error extracting data:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  extractAll();
}

module.exports = { extractAll };

