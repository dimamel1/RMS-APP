/**
 * Extract all text content and styling from homepage
 */

const fs = require('fs');
const path = require('path');

const homepageNodePath = path.resolve(__dirname, '..', 'src', 'data', 'figma', 'homepage-node.json');

function extractTexts(node, texts = []) {
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
    for (const child of node.children) {
      extractTexts(child, texts);
    }
  }
  
  return texts;
}

function findMainSections(node, sections = []) {
  // Look for main sections (frames/components with specific names)
  const sectionNames = [
    'article/main',
    'ad-banner',
    'editorial',
    'section-title',
    'article-card',
    'issue',
    'infographic',
  ];
  
  if (node.name && sectionNames.some(name => node.name.toLowerCase().includes(name.toLowerCase()))) {
    sections.push({
      id: node.id,
      name: node.name,
      type: node.type,
      absoluteBoundingBox: node.absoluteBoundingBox,
    });
  }
  
  if (node.children) {
    for (const child of node.children) {
      findMainSections(child, sections);
    }
  }
  
  return sections;
}

try {
  console.log('📖 Reading homepage node data...');
  const nodeData = JSON.parse(fs.readFileSync(homepageNodePath, 'utf8'));
  
  console.log('📝 Extracting text content...');
  const texts = extractTexts(nodeData);
  
  console.log('🔍 Finding main sections...');
  const sections = findMainSections(nodeData);
  
  const output = {
    extractedAt: new Date().toISOString(),
    texts: texts,
    sections: sections,
  };
  
  const outputPath = path.resolve(__dirname, '..', 'src', 'data', 'figma', 'homepage-texts.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
  
  console.log(`✅ Extracted ${texts.length} text elements`);
  console.log(`✅ Found ${sections.length} main sections`);
  console.log(`✅ Saved to ${outputPath}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

