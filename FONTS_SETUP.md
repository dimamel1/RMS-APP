# Font Setup Guide

This document explains how to set up custom fonts from Figma in your React Native app.

## Fonts Extracted from Figma

The following fonts are used in the Figma design:

1. **Neusa** (Neusa-SemiBold, Neusa-Bold)
2. **FreightSansCndPro** (FreightSansCndPro-Book)
3. **FreightSans Pro** (Book, Semibold, Bold)
4. **FreightText Pro** (Book, Bold)
5. **Inter** (Regular, Medium, Semibold, Bold, ExtraBold, Black)
6. **SF Pro** (System fonts - iOS only)
7. **Roboto** (System font - Android only)

## Current Implementation

The app currently uses **system font fallbacks** for all custom fonts. The font mapping is configured in `src/theme/fonts.js`.

## Adding Custom Fonts

To use the actual Figma fonts, you need to:

### 1. Obtain Font Files

You'll need to obtain the font files (.ttf or .otf) for:
- Neusa (Regular, SemiBold, Bold)
- FreightSansCndPro (Book)
- FreightSans Pro (Book, Semibold, Bold)
- FreightText Pro (Book, Bold)
- Inter (Regular, Medium, Semibold, Bold, ExtraBold, Black)

**Note:** Figma API does not provide direct font file downloads. You'll need to:
- Purchase/download fonts from the original font foundries
- Or use Google Fonts for Inter (free)
- Or contact the design team for font files

### 2. Install Font Files

1. Create a `assets/fonts/` directory in your project root
2. Place font files in this directory with the following naming convention:
   - `Neusa-Regular.ttf`
   - `Neusa-SemiBold.ttf`
   - `Neusa-Bold.ttf`
   - `FreightSansCndPro-Book.ttf`
   - `FreightSansProBook-Regular.ttf`
   - `FreightSansProSemibold-Regular.ttf`
   - `FreightSansProBold-Regular.ttf`
   - `FreightTextProBook-Regular.ttf`
   - `FreightTextProBold-Regular.ttf`
   - `Inter-Regular.ttf`
   - `Inter-Medium.ttf`
   - `Inter-SemiBold.ttf`
   - `Inter-Bold.ttf`
   - `Inter-ExtraBold.ttf`
   - `Inter-Black.ttf`

### 3. Configure Font Loading

Install `expo-font` if not already installed:

```bash
npm install expo-font
```

### 4. Update Font Configuration

Once fonts are added, update `src/theme/fonts.js` to use the actual font names instead of system fallbacks.

For example, change:
```javascript
neusa: {
  regular: 'System', // Change this
  semibold: 'System', // Change this
  bold: 'System', // Change this
}
```

To:
```javascript
neusa: {
  regular: 'Neusa-Regular',
  semibold: 'Neusa-SemiBold',
  bold: 'Neusa-Bold',
}
```

### 5. Load Fonts in App.js

Add font loading in your `App.js`:

```javascript
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Neusa-Regular': require('./assets/fonts/Neusa-Regular.ttf'),
    'Neusa-SemiBold': require('./assets/fonts/Neusa-SemiBold.ttf'),
    'Neusa-Bold': require('./assets/fonts/Neusa-Bold.ttf'),
    'FreightSansCndPro-Book': require('./assets/fonts/FreightSansCndPro-Book.ttf'),
    // ... add all other fonts
  });

  if (!fontsLoaded) {
    return null; // Or show a loading screen
  }

  // Rest of your app
}
```

## Using Fonts in Components

Use the font helpers in your components:

```javascript
import { getFontFamilyFromPostScript } from '../theme/fonts';

const styles = StyleSheet.create({
  text: {
    fontFamily: getFontFamilyFromPostScript('Neusa-SemiBold'),
    fontSize: 15,
  },
});
```

Or use the font family directly:

```javascript
import { getFontFamily } from '../theme/fonts';

const styles = StyleSheet.create({
  text: {
    fontFamily: getFontFamily('Neusa', 600), // Neusa, weight 600 (SemiBold)
    fontSize: 15,
  },
});
```

## Font Files Location

Font files should be placed in: `assets/fonts/`

## Current Status

✅ Font extraction script created
✅ Font mapping configuration created
✅ Font helpers implemented
✅ Components updated to use font helpers
⏳ Custom font files need to be added
⏳ Font loading needs to be configured

