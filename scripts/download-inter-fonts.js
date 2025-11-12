/**
 * Script to download Inter fonts from Google Fonts
 * This script downloads Inter font files and saves them to assets/fonts/
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.resolve(__dirname, '..', 'assets', 'fonts');

// Inter font files from Google Fonts CDN
const interFonts = {
  'Inter-Regular': 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.ttf',
  'Inter-Medium': 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Medium.ttf',
  'Inter-SemiBold': 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-SemiBold.ttf',
  'Inter-Bold': 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.ttf',
  'Inter-ExtraBold': 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-ExtraBold.ttf',
  'Inter-Black': 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Black.ttf',
};

/**
 * Download a file from URL
 */
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

/**
 * Main function
 */
async function downloadInterFonts() {
  // Create fonts directory if it doesn't exist
  if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
  }
  
  console.log('📥 Downloading Inter fonts from Google Fonts...\n');
  
  for (const [fontName, url] of Object.entries(interFonts)) {
    const filepath = path.join(fontsDir, `${fontName}.ttf`);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  ${fontName}.ttf already exists, skipping...`);
      continue;
    }
    
    try {
      console.log(`⬇️  Downloading ${fontName}.ttf...`);
      await downloadFile(url, filepath);
      console.log(`✅ Downloaded ${fontName}.ttf`);
    } catch (error) {
      console.error(`❌ Failed to download ${fontName}.ttf:`, error.message);
      console.log(`💡 You can manually download Inter fonts from: https://fonts.google.com/specimen/Inter`);
    }
  }
  
  console.log('\n✅ Inter font download complete!');
  console.log(`📁 Fonts saved to: ${fontsDir}`);
  console.log('\n⚠️  Note: You still need to add the commercial fonts (Neusa, FreightSans, FreightText) manually.');
}

if (require.main === module) {
  downloadInterFonts().catch(console.error);
}

module.exports = { downloadInterFonts };

