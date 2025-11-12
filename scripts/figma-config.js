/**
 * Figma API Configuration
 * 
 * To get your Figma API token:
 * 1. Go to https://www.figma.com/
 * 2. Account Settings > Personal Access Tokens
 * 3. Create a new token
 * 
 * To get your Figma File Key:
 * 1. Open your Figma file
 * 2. The file key is in the URL: https://www.figma.com/file/FILE_KEY/...
 */

module.exports = {
  // Your Figma Personal Access Token
  // Set this as an environment variable: FIGMA_ACCESS_TOKEN
  // Or replace with your token directly (not recommended for production)
  accessToken: process.env.FIGMA_ACCESS_TOKEN || '',
  
  // Your Figma File Key (from the file URL)
  // Extracted from: https://www.figma.com/design/ftLz98RDbInVkrRBLTHc8r/REVMED-APP
  // Set this as an environment variable: FIGMA_FILE_KEY
  fileKey: process.env.FIGMA_FILE_KEY || '',
  
  // Node IDs to extract (optional - leave empty to extract all)
  // You can find node IDs by selecting elements in Figma and checking the URL
  nodeIds: [],
  
  // Output paths
  output: {
    tokens: './src/theme/designTokens.js',
    components: './src/components/figma',
  },
};

