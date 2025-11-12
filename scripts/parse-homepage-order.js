/**
 * Parse homepage structure to understand component order
 */

const fs = require('fs');
const path = require('path');

const homepageNodePath = path.resolve(__dirname, '..', 'src', 'data', 'figma', 'homepage-node.json');

function findTopLevelChildren(node, children = []) {
  if (node.children) {
    for (const child of node.children) {
      // Skip filter-bar as it's a special component
      if (child.name && !child.name.includes('filter-bar')) {
        children.push({
          id: child.id,
          name: child.name,
          type: child.type,
          y: child.absoluteBoundingBox?.y || 0,
          height: child.absoluteBoundingBox?.height || 0,
        });
      }
      // Also check nested children for main sections
      if (child.children && child.name && (
        child.name.includes('article') || 
        child.name.includes('ad') || 
        child.name.includes('section') ||
        child.name.includes('issue') ||
        child.name.includes('infographic')
      )) {
        children.push({
          id: child.id,
          name: child.name,
          type: child.type,
          y: child.absoluteBoundingBox?.y || 0,
          height: child.absoluteBoundingBox?.height || 0,
        });
      }
    }
  }
  
  return children.sort((a, b) => a.y - b.y);
}

try {
  console.log('📖 Reading homepage node data...');
  const nodeData = JSON.parse(fs.readFileSync(homepageNodePath, 'utf8'));
  
  console.log('🔍 Finding main sections in order...');
  const sections = findTopLevelChildren(nodeData);
  
  console.log('\n📋 Homepage structure (in order):');
  sections.forEach((section, index) => {
    console.log(`${index + 1}. ${section.name} (${section.type}) - y: ${section.y}, height: ${section.height}`);
  });
  
  const outputPath = path.resolve(__dirname, '..', 'src', 'data', 'figma', 'homepage-structure.json');
  fs.writeFileSync(outputPath, JSON.stringify({ sections }, null, 2), 'utf8');
  
  console.log(`\n✅ Saved structure to ${outputPath}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

