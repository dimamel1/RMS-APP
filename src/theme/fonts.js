/**
 * Font Configuration
 * Maps Figma fonts to React Native font names
 * 
 * Note: Custom fonts (Neusa, FreightSansCndPro, etc.) need to be added to the project.
 * For now, we use system font fallbacks.
 */

import { Platform } from 'react-native';

/**
 * Font families used in the Figma design
 */
export const fonts = {
  // Primary fonts from Figma
  neusa: {
    regular: 'Neusa-Regular',
    semibold: 'Neusa-SemiBold',
    bold: 'Neusa-Bold',
  },
  
  freightSansCndPro: {
    book: 'FreightSansCndPro-Book',
  },
  
  freightSansPro: {
    book: 'FreightSansProBook-Regular',
    semibold: 'FreightSansProSemibold-Regular',
    bold: 'FreightSansProBold-Regular',
  },
  
  freightTextPro: {
    book: 'FreightTextProBook-Regular',
    bold: 'FreightTextProBold-Regular',
  },
  
  inter: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    extrabold: 'Inter-ExtraBold',
    black: 'Inter-Black',
  },
  
  // System fonts (SF Pro for iOS, Roboto for Android)
  system: {
    regular: Platform.select({
      ios: 'System',
      android: 'sans-serif',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
    }),
    semibold: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'sans-serif-bold',
    }),
  },
};

/**
 * Get font family based on Figma font name
 */
export const getFontFamily = (fontFamily, fontWeight = 400, fontStyle = 'normal') => {
  const weight = fontWeight || 400;
  
  // Map Figma font families to our font configuration
  switch (fontFamily) {
    case 'Neusa':
      if (weight >= 700) return fonts.neusa.bold;
      if (weight >= 600) return fonts.neusa.semibold;
      return fonts.neusa.regular;
    
    case 'FreightSansCndPro':
      return fonts.freightSansCndPro.book;
    
    case 'FreightSans Pro':
      if (weight >= 700) return fonts.freightSansPro.bold;
      if (weight >= 600) return fonts.freightSansPro.semibold;
      return fonts.freightSansPro.book;
    
    case 'FreightText Pro':
    case 'FreightText Pro Bold':
      if (weight >= 700) return fonts.freightTextPro.bold;
      return fonts.freightTextPro.book;
    
    case 'Inter':
      if (weight >= 900) return fonts.inter.black;
      if (weight >= 800) return fonts.inter.extrabold;
      if (weight >= 700) return fonts.inter.bold;
      if (weight >= 600) return fonts.inter.semibold;
      if (weight >= 500) return fonts.inter.medium;
      return fonts.inter.regular;
    
    case 'Roboto':
    case 'SF Pro':
    case 'SF Pro Text':
    case 'SF Pro Display':
    default:
      // Use system fonts as fallback
      if (weight >= 700) return fonts.system.bold;
      if (weight >= 500) return fonts.system.medium;
      return fonts.system.regular;
  }
};

/**
 * Get font family from PostScript name
 */
export const getFontFamilyFromPostScript = (postScriptName) => {
  if (!postScriptName) return fonts.system.regular;
  
  // Neusa
  if (postScriptName.includes('Neusa')) {
    if (postScriptName.includes('Bold')) return fonts.neusa.bold;
    if (postScriptName.includes('SemiBold') || postScriptName.includes('Semibold')) return fonts.neusa.semibold;
    return fonts.neusa.regular;
  }
  
  // FreightSansCndPro
  if (postScriptName.includes('FreightSansCndPro')) {
    return fonts.freightSansCndPro.book;
  }
  
  // FreightSans Pro
  if (postScriptName.includes('FreightSansPro')) {
    if (postScriptName.includes('Bold')) return fonts.freightSansPro.bold;
    if (postScriptName.includes('Semibold') || postScriptName.includes('SemiBold')) return fonts.freightSansPro.semibold;
    return fonts.freightSansPro.book;
  }
  
  // FreightText Pro
  if (postScriptName.includes('FreightTextPro')) {
    if (postScriptName.includes('Bold')) return fonts.freightTextPro.bold;
    return fonts.freightTextPro.book;
  }
  
  // Inter
  if (postScriptName.includes('Inter')) {
    if (postScriptName.includes('Black')) return fonts.inter.black;
    if (postScriptName.includes('ExtraBold') || postScriptName.includes('Extrabold')) return fonts.inter.extrabold;
    if (postScriptName.includes('Bold')) return fonts.inter.bold;
    if (postScriptName.includes('SemiBold') || postScriptName.includes('Semibold')) return fonts.inter.semibold;
    if (postScriptName.includes('Medium')) return fonts.inter.medium;
    return fonts.inter.regular;
  }
  
  // SF Pro (system fonts)
  if (postScriptName.includes('SFPro')) {
    if (postScriptName.includes('Bold')) return fonts.system.bold;
    if (postScriptName.includes('Semibold') || postScriptName.includes('SemiBold')) return fonts.system.semibold;
    return fonts.system.regular;
  }
  
  return fonts.system.regular;
};

export default fonts;

