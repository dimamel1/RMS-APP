/**
 * Parse Homepage Structure from Figma Node
 * Analyzes the node structure and creates a component structure
 */

const fs = require('fs');
const path = require('path');

const nodeFile = path.resolve(__dirname, '..', 'src', 'data', 'figma', 'homepage-node.json');
const nodeData = JSON.parse(fs.readFileSync(nodeFile, 'utf8'));

/**
 * Extract component structure
 */
function analyzeNode(node, depth = 0) {
  const indent = '  '.repeat(depth);
  const info = {
    id: node.id,
    name: node.name,
    type: node.type,
    bounds: node.absoluteBoundingBox,
    style: {},
    children: [],
  };
  
  // Extract styles
  if (node.fills && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
      info.style.backgroundColor = `rgba(${Math.round(fill.color.r * 255)}, ${Math.round(fill.color.g * 255)}, ${Math.round(fill.color.b * 255)}, ${fill.opacity || 1})`;
    } else if (fill.type === 'IMAGE') {
      info.style.backgroundImage = `image-${node.id.replace(/:/g, '-')}.png`;
    }
  }
  
  if (node.cornerRadius) {
    info.style.borderRadius = node.cornerRadius;
  }
  
  if (node.type === 'TEXT') {
    info.text = node.characters;
    if (node.style) {
      info.style.fontSize = node.style.fontSize;
      info.style.fontWeight = node.style.fontWeight;
      info.style.color = node.fills?.[0]?.color 
        ? `rgba(${Math.round(node.fills[0].color.r * 255)}, ${Math.round(node.fills[0].color.g * 255)}, ${Math.round(node.fills[0].color.b * 255)}, ${node.fills[0].opacity || 1})`
        : '#000';
    }
  }
  
  // Analyze children (limit depth to avoid too much data)
  if (node.children && depth < 5) {
    node.children.forEach(child => {
      const childInfo = analyzeNode(child, depth + 1);
      info.children.push(childInfo);
    });
  }
  
  return info;
}

const structure = analyzeNode(nodeData);
const outputFile = path.resolve(__dirname, '..', 'src', 'data', 'figma', 'homepage-structure.json');
fs.writeFileSync(outputFile, JSON.stringify(structure, null, 2), 'utf8');

console.log('✅ Structure analysis complete!');
console.log(`📁 Saved to: ${outputFile}`);

