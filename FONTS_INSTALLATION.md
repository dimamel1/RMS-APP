# Font Installation Guide

This guide explains how to add the custom fonts to your React Native app.

## ✅ What's Already Set Up

- ✅ Font loading infrastructure (`expo-font` installed)
- ✅ Font configuration files (`src/config/fonts.js`, `src/theme/fonts.js`)
- ✅ App.js updated to load fonts on startup
- ✅ All components configured to use custom fonts
- ✅ Fonts directory created (`assets/fonts/`)

## 📥 Step 1: Download Inter Fonts (FREE)

Inter fonts are free and can be downloaded from Google Fonts:

1. Visit: https://fonts.google.com/specimen/Inter
2. Click the **"Download family"** button
3. Extract the ZIP file
4. Navigate to the `static` folder in the extracted files
5. Copy these files to `assets/fonts/`:
   - `Inter-Regular.ttf`
   - `Inter-Medium.ttf`
   - `Inter-SemiBold.ttf`
   - `Inter-Bold.ttf`
   - `Inter-ExtraBold.ttf`
   - `Inter-Black.ttf`

## 📥 Step 2: Obtain Commercial Fonts

The following fonts are commercial and need to be purchased or obtained from your design team:

### Neusa Fonts
- `Neusa-Regular.ttf`
- `Neusa-SemiBold.ttf`
- `Neusa-Bold.ttf`

**Where to get:**
- Contact your design team
- Purchase from the font foundry
- Check if your organization has a font license

### FreightSansCndPro Fonts
- `FreightSansCndPro-Book.ttf`

**Where to get:**
- Contact your design team
- Purchase from the font foundry

### FreightSans Pro Fonts
- `FreightSansProBook-Regular.ttf`
- `FreightSansProSemibold-Regular.ttf`
- `FreightSansProBold-Regular.ttf`

**Where to get:**
- Contact your design team
- Purchase from the font foundry

### FreightText Pro Fonts
- `FreightTextProBook-Regular.ttf`
- `FreightTextProBold-Regular.ttf`

**Where to get:**
- Contact your design team
- Purchase from the font foundry

## 📁 Step 3: Place Font Files

Once you have all the font files, place them in:
```
assets/fonts/
```

The directory structure should look like:
```
assets/fonts/
├── Inter-Regular.ttf
├── Inter-Medium.ttf
├── Inter-SemiBold.ttf
├── Inter-Bold.ttf
├── Inter-ExtraBold.ttf
├── Inter-Black.ttf
├── Neusa-Regular.ttf
├── Neusa-SemiBold.ttf
├── Neusa-Bold.ttf
├── FreightSansCndPro-Book.ttf
├── FreightSansProBook-Regular.ttf
├── FreightSansProSemibold-Regular.ttf
├── FreightSansProBold-Regular.ttf
├── FreightTextProBook-Regular.ttf
└── FreightTextProBold-Regular.ttf
```

## ✅ Step 4: Verify Installation

1. Restart your Expo development server:
   ```bash
   npm start
   ```

2. The app will automatically load fonts on startup
3. If fonts are missing, the app will use system font fallbacks (still functional, but not matching Figma exactly)

## 🔍 Troubleshooting

### Fonts not loading?
- Check that font files are in `assets/fonts/` directory
- Verify file names match exactly (case-sensitive)
- Restart the Expo development server
- Clear cache: `npx expo start -c`

### Font files not found error?
- Make sure file names match exactly what's in `src/config/fonts.js`
- Check file extensions are `.ttf` or `.otf`
- Verify files are not corrupted

### App crashes on startup?
- Check the console for font loading errors
- Temporarily comment out missing fonts in `src/config/fonts.js`
- The app will continue to work with system fallbacks

## 📝 Current Status

- ✅ Font infrastructure ready
- ✅ Inter fonts: Need to download (free)
- ⏳ Neusa fonts: Need to obtain (commercial)
- ⏳ FreightSansCndPro fonts: Need to obtain (commercial)
- ⏳ FreightSans Pro fonts: Need to obtain (commercial)
- ⏳ FreightText Pro fonts: Need to obtain (commercial)

## 💡 Note

The app will continue to work with system font fallbacks if custom fonts are not present. However, to match the exact Figma design, all font files need to be added.

