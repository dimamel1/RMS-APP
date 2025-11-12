/**
 * Extract font information from all text nodes in Figma homepage
 * This will help us identify which fonts are used for different text elements
 */

const fs = require('fs');
const path = require('path');

const homepageNodePath = path.resolve(__dirname, '..', 'src', 'data', 'figma', 'homepage-node.json');

function extractTextFonts(node, results = []) {
  if (node.type === 'TEXT') {
    const style = node.style || {};
    results.push({
      nodeId: node.id,
      nodeName: node.name,
      characters: node.characters ? node.characters.substring(0, 50) : '', // First 50 chars
      fontFamily: style.fontFamily || null,
      fontPostScriptName: style.fontPostScriptName || null,
      fontWeight: style.fontWeight || null,
      fontStyle: style.fontStyle || null,
      fontSize: style.fontSize || null,
    });
  }
  
  if (node.children) {
    for (const child of node.children) {
      extractTextFonts(child, results);
    }
  }
  
  return results;
}

try {
  console.log('📖 Reading homepage node data...');
  const homepageData = JSON.parse(fs.readFileSync(homepageNodePath, 'utf8'));
  
  console.log('🔍 Extracting font information from text nodes...');
  const textFonts = extractTextFonts(homepageData);
  
  // Group by font family and style
  const fontUsage = {};
  textFonts.forEach((text) => {
    const key = `${text.fontFamily || 'Unknown'}-${text.fontPostScriptName || text.fontWeight || 'default'}`;
    if (!fontUsage[key]) {
      fontUsage[key] = {
        fontFamily: text.fontFamily,
        fontPostScriptName: text.fontPostScriptName,
        fontWeight: text.fontWeight,
        fontStyle: text.fontStyle,
        examples: [],
      };
    }
    fontUsage[key].examples.push({
      nodeName: text.nodeName,
      characters: text.characters,
      fontSize: text.fontSize,
    });
  });
  
  // Save results
  const outputPath = path.resolve(__dirname, '..', 'src', 'data', 'figma', 'text-fonts-usage.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    totalTextNodes: textFonts.length,
    uniqueFonts: Object.keys(fontUsage).length,
    fontUsage: fontUsage,
    allTextNodes: textFonts,
  }, null, 2), 'utf8');
  
  console.log(`✅ Extracted font information from ${textFonts.length} text nodes`);
  console.log(`📊 Found ${Object.keys(fontUsage).length} unique font combinations`);
  console.log(`📁 Saved to: ${outputPath}`);
  
  // Print summary
  console.log('\n📋 Font Usage Summary:');
  Object.entries(fontUsage).forEach(([key, info]) => {
    console.log(`\n${info.fontFamily || 'Unknown'} (${info.fontPostScriptName || info.fontWeight || 'default'})`);
    console.log(`  Examples: ${info.examples.length} text nodes`);
    info.examples.slice(0, 3).forEach((ex) => {
      console.log(`    - "${ex.characters}" (${ex.nodeName}, ${ex.fontSize}px)`);
    });
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

