import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { getFontFamilyFromPostScript } from '../theme/fonts';

/**
 * Header Component
 * Based on Figma design: header (21:4173)
 * Contains: Logo, Account Icon, and Subscribe Button
 */
const Header = ({ onAccountPress, onSubscribePress }) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left container - Logo */}
        <View style={styles.leftContainer}>
          <Image
            source={require('../../assets/figma/header/logo-revmed.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Right container - Account Icon and Subscribe Button */}
        <View style={styles.rightContainer}>
          <TouchableOpacity
            style={styles.accountButton}
            onPress={onAccountPress}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/figma/header-icons/icon-21-4150.png')}
              style={styles.accountIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.spacer} />
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={onSubscribePress}
            activeOpacity={0.8}
          >
            <Text style={styles.subscribeText}>S'ABONNER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    height: 72, // From Figma
    paddingTop: 16, // From Figma: padding: 16px
    paddingBottom: 16,
    paddingLeft: 16.8, // Increased by 5% (16 * 1.05 = 16.8)
    paddingRight: 16, // From Figma: padding: 16px (all sides)
    width: '100%',
    // Gap: 144px between logo and right container (handled by space-between)
    // No shadow or border as per design
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 62.53, // Increased by 15% (54.37 * 1.15 = 62.5255)
    height: 50.6, // Increased by 15% (44 * 1.15 = 50.6)
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Remove fixed width to allow button to expand if needed
    height: 40, // Increased to accommodate larger button and icon
    // Gap: 15px between icon and button (handled by spacer)
  },
  accountButton: {
    width: 32, // From Figma: icon/account width
    height: 40, // Increased to match button height
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  accountIcon: {
    width: 32, // From Figma: icon/account width
    height: 32, // Keep icon size, but container is larger
  },
  spacer: {
    width: 15, // From Figma: gap: 15px
  },
  subscribeButton: {
    backgroundColor: '#ca121e', // #CA121E from Figma
    paddingHorizontal: 10, // Increased from 8px to give more space for text
    paddingVertical: 8, // Reduced vertical padding to give more space for text
    // No border radius from Figma
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90, // Increased to ensure text fits without being cut off
    height: 36, // Increased from 30px to accommodate text better
    flexShrink: 0,
  },
  subscribeText: {
    fontSize: 15, // From Figma
    fontWeight: '600', // SemiBold from Figma
    fontStyle: 'normal', // SemiBold style
    color: '#ffffff', // #FFFFFF from Figma
    letterSpacing: 0.6, // 4% = 0.04 * 15px = 0.6px
    textTransform: 'uppercase', // From Figma
    lineHeight: 15, // 100% = 15px (font-size * 1.0)
    // Ensure text is fully visible
    includeFontPadding: false, // Remove extra padding on Android
    textAlign: 'center',
    // Allow text to determine its natural width
    flexShrink: 1,
    // Use Neusa-SemiBold from Figma (with system fallback)
    fontFamily: getFontFamilyFromPostScript('Neusa-SemiBold'),
  },
});

export default Header;
