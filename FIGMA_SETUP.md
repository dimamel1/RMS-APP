# Figma Integration Setup Guide

This guide explains how to connect your Figma project and extract styles, components, fonts, and assets into your React Native app.

## Prerequisites

1. A Figma account with access to the design file
2. Node.js installed
3. Access to the REVMED-APP Figma file

## Step 1: Get Your Figma Access Token

1. Go to [Figma.com](https://www.figma.com/)
2. Click on your profile icon (top right)
3. Go to **Settings** → **Account**
4. Scroll down to **Personal Access Tokens**
5. Click **Create a new personal access token**
6. Give it a name (e.g., "RMS App POC")
7. Copy the token (you won't be able to see it again!)

## Step 2: Get Your Figma File Key

1. Open your Figma file: `https://www.figma.com/design/ftLz98RDbInVkrRBLTHc8r/REVMED-APP`
2. The file key is: `ftLz98RDbInVkrRBLTHc8r` (from the URL)

## Step 3: Configure the Integration

### Option A: Using Environment Variables (Recommended)

Create a `.env` file in the project root:

```bash
FIGMA_ACCESS_TOKEN=your_token_here
FIGMA_FILE_KEY=ftLz98RDbInVkrRBLTHc8r
```

**Note:** Add `.env` to your `.gitignore` to keep your token secure!

### Option B: Edit Config File Directly

Edit `scripts/figma-config.js` and replace the values:

```javascript
module.exports = {
  accessToken: 'your_token_here',
  fileKey: 'ftLz98RDbInVkrRBLTHc8r',
  // ...
};
```

## Available Extraction Scripts

### Core Extraction Scripts

#### 1. Extract All Design Tokens
```bash
npm run figma:all
```
Extracts colors, typography, spacing, and other design tokens from the entire Figma file and generates `src/theme/designTokens.js`.

#### 2. Extract Styles Only
```bash
npm run figma:styles
```
Extracts only design tokens (colors, typography) from published Figma styles.

#### 3. Extract Fonts Information
```bash
npm run figma:fonts
```
Extracts all font information from the Figma project and saves to `src/data/figma/fonts.json` and `src/data/figma/font-mapping.json`.

### Component-Specific Extraction Scripts

These scripts extract specific components from Figma with their images and icons:

#### Extract Home Page
```bash
node scripts/extract-homepage.js
```
- Extracts the home page node (ID: `1:4612`)
- Downloads all images
- Saves to `src/data/figma/homepage-node.json` and `homepage-summary.json`
- Images saved to `assets/figma/`

#### Extract Bottom Menu
```bash
node scripts/extract-bottom-menu.js
```
- Extracts the bottom menu component (ID: `21:4256`)
- Saves menu structure and data

#### Extract Menu Icons
```bash
node scripts/extract-menu-icons.js
```
- Extracts all bottom menu icons (active and inactive variants)
- Downloads icon images to `assets/figma/icons/`

#### Extract Header
```bash
node scripts/extract-header.js
```
- Extracts the header component (ID: `21:4173`)
- Downloads logo and account icon
- Saves to `src/data/figma/header-node.json`

#### Extract Header Logo
```bash
node scripts/extract-header-logo.js
```
- Downloads the header logo specifically
- Saves to `assets/figma/header/logo-revmed.png`

#### Extract Article Bar
```bash
node scripts/extract-article-bar.js
```
- Extracts the article bar component (ID: `21:4431`)
- Saves component structure

#### Extract Article Bar Icons
```bash
node scripts/extract-article-bar-icons.js
```
- Downloads article bar icons (close, share, audio)
- Saves to `assets/figma/article-bar-icons/`

#### Extract Section Title
```bash
node scripts/extract-section-title.js
```
- Extracts the section-title component (ID: `21:4877`)
- Saves component structure and styling

### Utility Scripts

#### Extract Text Fonts Usage
```bash
node scripts/extract-text-fonts.js
```
- Analyzes all text nodes in the home page
- Extracts font usage information
- Saves to `src/data/figma/text-fonts-usage.json`
- Helps identify which fonts are used for different text elements

#### Extract Specific Node
```bash
node scripts/extract-figma-node.js <node-id>
```
- Extracts any specific node by ID
- Example: `node scripts/extract-figma-node.js 21:4173`

#### Parse Homepage Structure
```bash
node scripts/parse-homepage-structure.js
```
- Parses the raw homepage node data
- Generates a simplified structure for easier reference

## Output Files

### Design Tokens
- `src/theme/designTokens.js` - All colors, typography, spacing, and design tokens

### Font Information
- `src/data/figma/fonts.json` - List of all fonts used in Figma
- `src/data/figma/font-mapping.json` - Mapping of PostScript names to font families
- `src/data/figma/text-fonts-usage.json` - Font usage analysis from text nodes

### Component Data
- `src/data/figma/homepage-node.json` - Raw home page node data
- `src/data/figma/homepage-summary.json` - Home page extraction summary
- `src/data/figma/bottom-menu-node.json` - Bottom menu node data
- `src/data/figma/bottom-menu-summary.json` - Bottom menu summary
- `src/data/figma/header-node.json` - Header node data
- `src/data/figma/header-summary.json` - Header summary
- `src/data/figma/article-bar-node.json` - Article bar node data
- `src/data/figma/article-bar-summary.json` - Article bar summary
- `src/data/figma/section-title-node.json` - Section title node data
- `src/data/figma/section-title-summary.json` - Section title summary

### Assets
- `assets/figma/` - All extracted images and icons
  - `header/` - Header logo
  - `header-icons/` - Header icons (account, etc.)
  - `icons/` - Bottom menu icons (active/inactive variants)
  - `article-bar-icons/` - Article bar icons
  - `image-*.png` - Various images from the design

## Using Extracted Data in Your App

### Design Tokens

```javascript
import { colors, typography, spacing } from '../theme/designTokens';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.base,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
});
```

### Fonts

```javascript
import { getFontFamilyFromPostScript } from '../theme/fonts';

const styles = StyleSheet.create({
  title: {
    fontFamily: getFontFamilyFromPostScript('Neusa-Bold'),
    fontSize: 22,
  },
});
```

### Images

```javascript
import { Image } from 'react-native';

<Image
  source={require('../../assets/figma/header/logo-revmed.png')}
  style={styles.logo}
/>
```

## Finding Node IDs

To extract a specific component from Figma:

1. Open the Figma file
2. Select the element you want to extract
3. Check the URL - the node ID appears after `?node-id=`
   - Example: `https://www.figma.com/design/ftLz98RDbInVkrRBLTHc8r/REVMED-APP?node-id=21-4173`
   - Node ID: `21:4173` (replace `-` with `:`)

## Troubleshooting

### Error: "FIGMA_ACCESS_TOKEN is required"
- Make sure you've set the access token in `.env` or `figma-config.js`
- Check that the token is valid and hasn't expired

### Error: "FIGMA_FILE_KEY is required"
- Make sure you've set the file key in `.env` or `figma-config.js`
- Verify the file key is correct from the Figma URL

### Error: "Figma API error: 403"
- Your access token might not have permission to access the file
- Make sure you have access to the Figma file
- Try regenerating your access token

### Error: "Figma API error: 404"
- The file key might be incorrect
- Make sure the file exists and you have access to it
- Check that the node ID is correct (if extracting a specific node)

### Images Not Downloading
- Check your internet connection
- Verify the image URLs in the node data
- Some images might be embedded and need manual extraction

## Re-running Extraction

You can re-run any extraction script anytime your Figma designs change:

```bash
# Extract all design tokens
npm run figma:all

# Extract specific components
node scripts/extract-homepage.js
node scripts/extract-header.js
# etc.
```

**Note:** The generated files will be overwritten, so don't manually edit them if you plan to re-extract.

## Workflow Recommendations

1. **Initial Setup:**
   - Run `npm run figma:all` to get all design tokens
   - Run `npm run figma:fonts` to get font information
   - Extract all major components (homepage, header, menu, etc.)

2. **When Designs Change:**
   - Re-run the specific extraction script for the changed component
   - Update your React Native components accordingly

3. **Adding New Components:**
   - Find the node ID in Figma
   - Use `extract-figma-node.js` to extract it
   - Or create a custom extraction script following the existing patterns

## Current Project Status

✅ **Extracted Components:**
- Home page (with all images)
- Bottom menu (with icons)
- Header (with logo and icons)
- Article bar (with icons)
- Section title component

✅ **Extracted Assets:**
- All home page images
- Bottom menu icons (active/inactive)
- Header logo and icons
- Article bar icons

✅ **Design Tokens:**
- Colors
- Typography
- Spacing
- Border radius

✅ **Font Information:**
- All fonts used in the project
- Font mapping (PostScript names)
- Text font usage analysis

## Resources

- [Figma API Documentation](https://www.figma.com/developers/api)
- [Figma Personal Access Tokens](https://www.figma.com/developers/api#access-tokens)
- [React Native Styling Guide](https://reactnative.dev/docs/style)
- [Expo Font Loading](https://docs.expo.dev/versions/latest/sdk/font/)

## Next Steps

1. Review extracted design tokens in `src/theme/designTokens.js`
2. Check font information in `src/data/figma/fonts.json`
3. Review component data in `src/data/figma/`
4. Use extracted assets in your components
5. Set up custom fonts (see `FONTS_INSTALLATION.md`)
