# Font Files Directory

This directory contains the custom font files used in the app.

## Required Font Files

Place the following font files (`.ttf` or `.otf` format) in this directory:

### Neusa Fonts
- `Neusa-Regular.ttf`
- `Neusa-SemiBold.ttf`
- `Neusa-Bold.ttf`

### FreightSansCndPro Fonts
- `FreightSansCndPro-Book.ttf`

### FreightSans Pro Fonts
- `FreightSansProBook-Regular.ttf`
- `FreightSansProSemibold-Regular.ttf`
- `FreightSansProBold-Regular.ttf`

### FreightText Pro Fonts
- `FreightTextProBook-Regular.ttf`
- `FreightTextProBold-Regular.ttf`

### Inter Fonts (Free - Download from Google Fonts)
- `Inter-Regular.ttf`
- `Inter-Medium.ttf`
- `Inter-SemiBold.ttf`
- `Inter-Bold.ttf`
- `Inter-ExtraBold.ttf`
- `Inter-Black.ttf`

## Where to Get Fonts

### Inter Fonts (FREE)
Download from Google Fonts: https://fonts.google.com/specimen/Inter

**Method 1: Direct Download**
1. Visit https://fonts.google.com/specimen/Inter
2. Click "Download family" button
3. Extract the ZIP file
4. Navigate to the `static` folder in the extracted files
5. Copy the following `.ttf` files to this directory:
   - `Inter-Regular.ttf`
   - `Inter-Medium.ttf`
   - `Inter-SemiBold.ttf`
   - `Inter-Bold.ttf`
   - `Inter-ExtraBold.ttf`
   - `Inter-Black.ttf`

**Method 2: Using npm package**
```bash
npm install @fontsource/inter
```
Then copy the font files from `node_modules/@fontsource/inter/files/` to this directory.

### Commercial Fonts (Neusa, FreightSans, FreightText)
These fonts are commercial and need to be purchased or obtained from:
- The design team
- The original font foundries
- Font licensing services

**Note:** The app will continue to work with system font fallbacks if these files are not present, but the exact Figma design will not be matched.

## Font Loading

Fonts are automatically loaded when the app starts. See `src/config/fonts.js` for the font loading configuration.

