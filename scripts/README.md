# Figma Extraction Scripts

This directory contains scripts to extract styles, components, fonts, and assets from your Figma designs.

## Quick Start

1. **Set up your Figma credentials:**
   - Get your Figma Access Token from [Figma Settings](https://www.figma.com/settings)
   - Get your Figma File Key from your file URL (currently: `ftLz98RDbInVkrRBLTHc8r`)
   - Create a `.env` file in the project root:
     ```
     FIGMA_ACCESS_TOKEN=your_token_here
     FIGMA_FILE_KEY=ftLz98RDbInVkrRBLTHc8r
     ```

2. **Extract design tokens:**
   ```bash
   npm run figma:all
   ```

3. **Extract fonts information:**
   ```bash
   npm run figma:fonts
   ```

4. **Extract specific components:**
   ```bash
   node scripts/extract-homepage.js
   node scripts/extract-header.js
   node scripts/extract-bottom-menu.js
   ```

## Available Scripts

### Core Extraction Scripts

#### `extract-figma-all.js`
**Command:** `npm run figma:all`

Extracts all design tokens (colors, typography, spacing) from the entire Figma file and generates `src/theme/designTokens.js`.

**Output:**
- `src/theme/designTokens.js` - Complete design tokens file

#### `extract-figma-styles.js`
**Command:** `npm run figma:styles`

Extracts design tokens from published Figma styles (if available).

**Output:**
- `src/theme/designTokens.js` - Design tokens from published styles

#### `extract-figma-fonts.js`
**Command:** `npm run figma:fonts`

Extracts all font information from the Figma project.

**Output:**
- `src/data/figma/fonts.json` - List of all fonts used
- `src/data/figma/font-mapping.json` - PostScript name to font family mapping

#### `extract-figma-components.js`
**Command:** `npm run figma:components`

Extracts React components from Figma (legacy - use specific extraction scripts instead).

**Output:**
- `src/components/figma/*.js` - Generated React Native components

### Component-Specific Extraction Scripts

#### `extract-homepage.js`
**Command:** `node scripts/extract-homepage.js`

Extracts the home page component (node ID: `1:4612`) with all images.

**Output:**
- `src/data/figma/homepage-node.json` - Raw node data
- `src/data/figma/homepage-summary.json` - Extraction summary
- `assets/figma/image-*.png` - All images from the home page

#### `extract-bottom-menu.js`
**Command:** `node scripts/extract-bottom-menu.js`

Extracts the bottom menu component (node ID: `21:4256`).

**Output:**
- `src/data/figma/bottom-menu-node.json` - Raw node data
- `src/data/figma/bottom-menu-summary.json` - Extraction summary

#### `extract-menu-icons.js`
**Command:** `node scripts/extract-menu-icons.js`

Extracts all bottom menu icons (active and inactive variants).

**Output:**
- `assets/figma/icons/*.png` - All menu icons

#### `extract-header.js`
**Command:** `node scripts/extract-header.js`

Extracts the header component (node ID: `21:4173`).

**Output:**
- `src/data/figma/header-node.json` - Raw node data
- `src/data/figma/header-summary.json` - Extraction summary

#### `extract-header-logo.js`
**Command:** `node scripts/extract-header-logo.js`

Downloads the header logo specifically.

**Output:**
- `assets/figma/header/logo-revmed.png` - Header logo

#### `extract-article-bar.js`
**Command:** `node scripts/extract-article-bar.js`

Extracts the article bar component (node ID: `21:4431`).

**Output:**
- `src/data/figma/article-bar-node.json` - Raw node data
- `src/data/figma/article-bar-summary.json` - Extraction summary

#### `extract-article-bar-icons.js`
**Command:** `node scripts/extract-article-bar-icons.js`

Downloads article bar icons (close, share, audio).

**Output:**
- `assets/figma/article-bar-icons/icon-close.png`
- `assets/figma/article-bar-icons/icon-share.png`
- `assets/figma/article-bar-icons/icon-audio.png`

#### `extract-section-title.js`
**Command:** `node scripts/extract-section-title.js`

Extracts the section-title component (node ID: `21:4877`).

**Output:**
- `src/data/figma/section-title-node.json` - Raw node data
- `src/data/figma/section-title-summary.json` - Extraction summary

### Analysis Scripts

#### `extract-text-fonts.js`
**Command:** `node scripts/extract-text-fonts.js`

Analyzes all text nodes in the home page to identify font usage.

**Output:**
- `src/data/figma/text-fonts-usage.json` - Font usage analysis

#### `parse-homepage-structure.js`
**Command:** `node scripts/parse-homepage-structure.js`

Parses the raw homepage node data into a simplified structure.

**Output:**
- `src/data/figma/homepage-structure.json` - Simplified structure

### Utility Scripts

#### `extract-figma-node.js`
**Command:** `node scripts/extract-figma-node.js <node-id>`

Extracts any specific node by ID.

**Example:**
```bash
node scripts/extract-figma-node.js 21:4173
```

**Output:**
- Console output with node information

#### `fix-design-tokens.js` / `fix-design-tokens-v2.js`
Utility scripts to fix syntax errors in generated design tokens (e.g., numeric keys).

**Note:** These are legacy scripts. The main extraction script now handles these issues automatically.

## Configuration

### `figma-config.js`

Main configuration file for all Figma extraction scripts.

```javascript
module.exports = {
  // Your Figma Personal Access Token
  accessToken: process.env.FIGMA_ACCESS_TOKEN || 'your_token',
  
  // Your Figma File Key
  fileKey: process.env.FIGMA_FILE_KEY || 'ftLz98RDbInVkrRBLTHc8r',
  
  // Output paths
  output: {
    tokens: './src/theme/designTokens.js',
    components: './src/components/figma',
  },
};
```

## Output Structure

```
src/
├── theme/
│   └── designTokens.js          # All design tokens
├── data/
│   └── figma/
│       ├── fonts.json           # Font list
│       ├── font-mapping.json    # Font mapping
│       ├── text-fonts-usage.json # Font usage analysis
│       ├── homepage-node.json   # Home page data
│       ├── homepage-summary.json # Home page summary
│       ├── bottom-menu-node.json # Bottom menu data
│       ├── header-node.json     # Header data
│       ├── article-bar-node.json # Article bar data
│       └── section-title-node.json # Section title data
assets/
└── figma/
    ├── header/
    │   └── logo-revmed.png
    ├── header-icons/
    ├── icons/                    # Menu icons
    ├── article-bar-icons/
    └── image-*.png              # Various images
```

## Common Workflows

### Initial Project Setup
```bash
# 1. Extract all design tokens
npm run figma:all

# 2. Extract font information
npm run figma:fonts

# 3. Extract major components
node scripts/extract-homepage.js
node scripts/extract-header.js
node scripts/extract-bottom-menu.js
node scripts/extract-menu-icons.js
node scripts/extract-article-bar.js
node scripts/extract-article-bar-icons.js
```

### When a Component Changes
```bash
# Re-extract the specific component
node scripts/extract-homepage.js  # or whichever component changed
```

### Finding Font Usage
```bash
# Analyze which fonts are used where
node scripts/extract-text-fonts.js
```

## Tips

1. **Node IDs:** Find node IDs by selecting an element in Figma and checking the URL (`?node-id=21-4173` → use `21:4173`)

2. **Re-extraction:** You can safely re-run any extraction script - it will overwrite previous data

3. **Missing Assets:** If images fail to download, check the console output for URLs and download manually

4. **Font Files:** After extracting font information, see `FONTS_INSTALLATION.md` for adding actual font files

## Troubleshooting

- **403 Error:** Check your access token permissions
- **404 Error:** Verify the file key and node IDs
- **Missing Images:** Some images might need manual download
- **Syntax Errors:** Run `fix-design-tokens.js` if needed (shouldn't be necessary anymore)

## For More Details

See [FIGMA_SETUP.md](../FIGMA_SETUP.md) for complete setup instructions and detailed documentation.
