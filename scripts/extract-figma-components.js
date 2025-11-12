/**
 * Extract Components from Figma
 * 
 * Usage:
 *   node scripts/extract-figma-components.js
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
 * Convert Figma color to hex
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
 * Convert Figma node to React Native component code
 */
function nodeToComponent(node, depth = 0) {
  const indent = '  '.repeat(depth);
  const name = node.name || 'View';
  const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '');
  
  // Handle different node types
  switch (node.type) {
    case 'TEXT':
      const textStyle = node.style || {};
      return `${indent}<Text style={${JSON.stringify({
        fontSize: textStyle.fontSize,
        fontWeight: textStyle.fontWeight?.toString(),
        color: node.fills?.[0]?.color ? colorToHex(node.fills[0].color, node.fills[0].opacity) : '#000',
      })}}>${node.characters || ''}</Text>`;
    
    case 'RECTANGLE':
    case 'FRAME':
    case 'COMPONENT':
    case 'INSTANCE':
      const fills = node.fills?.[0];
      const backgroundColor = fills && fills.type === 'SOLID' 
        ? colorToHex(fills.color, fills.opacity) 
        : 'transparent';
      
      const border = node.strokes?.[0];
      const borderColor = border && border.type === 'SOLID'
        ? colorToHex(border.color, border.opacity)
        : undefined;
      
      const style = {
        width: node.absoluteBoundingBox?.width,
        height: node.absoluteBoundingBox?.height,
        backgroundColor,
        ...(borderColor && { borderColor, borderWidth: node.strokeWeight || 1 }),
        ...(node.cornerRadius && { borderRadius: node.cornerRadius }),
      };
      
      const children = node.children 
        ? node.children.map(child => nodeToComponent(child, depth + 1)).join('\n')
        : '';
      
      return `${indent}<View style={${JSON.stringify(style)}}>
${children}
${indent}</View>`;
    
    default:
      return `${indent}<View>
${node.children?.map(child => nodeToComponent(child, depth + 1)).join('\n') || ''}
${indent}</View>`;
  }
}

/**
 * Generate React Native component file
 */
function generateComponentFile(componentName, code) {
  const filePath = path.resolve(__dirname, '..', config.output.components, `${componentName}.js`);
  const dir = path.dirname(filePath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const content = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * ${componentName}
 * Auto-generated from Figma
 * DO NOT EDIT MANUALLY - This file is auto-generated
 */
const ${componentName} = () => {
  return (
${code}
  );
};

const styles = StyleSheet.create({});

export default ${componentName};
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Component saved to ${filePath}`);
}

/**
 * Main extraction function
 */
async function extractComponents() {
  try {
    if (!config.fileKey) {
      throw new Error('FIGMA_FILE_KEY is required');
    }

    console.log('🔍 Fetching components from Figma...');
    
    // Get file
    const fileResponse = await figmaRequest(`/files/${config.fileKey}`);
    
    if (!fileResponse.document) {
      throw new Error('Invalid file response from Figma');
    }
    
    // Find components
    function findComponents(node, components = []) {
      if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
        components.push(node);
      }
      
      if (node.children) {
        node.children.forEach(child => findComponents(child, components));
      }
      
      return components;
    }
    
    const components = findComponents(fileResponse.document);
    
    console.log(`📦 Found ${components.length} components`);
    
    // Generate component files
    components.forEach((component, index) => {
      const componentName = component.name.replace(/[^a-zA-Z0-9]/g, '') || `Component${index + 1}`;
      const code = nodeToComponent(component, 2);
      generateComponentFile(componentName, code);
    });
    
    console.log('✅ Component extraction complete!');
    
  } catch (error) {
    console.error('❌ Error extracting components:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  extractComponents();
}

module.exports = { extractComponents };

