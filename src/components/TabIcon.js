import React from 'react';
import { Image, StyleSheet } from 'react-native';

/**
 * Tab Icon Component using Figma icons
 */
const TabIcon = ({ routeName, focused, size = 22 }) => {
  const iconSource = getIconSource(routeName, focused);
  
  if (!iconSource) {
    console.warn(`TabIcon: No icon source found for ${routeName}, focused: ${focused}`);
    return null;
  }
  
  return (
    <Image
      key={`${routeName}-${focused ? 'active' : 'inactive'}`} // Force re-render on state change
      source={iconSource}
      style={[styles.icon, { width: size, height: size }]}
      resizeMode="contain"
    />
  );
};

/**
 * Get icon source based on route and focus state
 * Uses Figma-extracted icons
 */
const getIconSource = (routeName, focused) => {
  // Map route names to icon names
  const iconMap = {
    'featured': 'alaune',
    'my-selection': 'myselection',
    'all-issues': 'numeros',
    'menu': 'menu',
  };
  
  const iconName = iconMap[routeName];
  if (!iconName) return null;
  
  // Icon file naming pattern:
  // Inactive: {iconName}-I21-{variantId};21-4035.png (from Default variant)
  // Active: {iconName}-I21-{activeVariantId};21-4035.png (from active variant)
  
  // Variant IDs from Figma structure (verified from bottom-menu-node.json and extracted files):
  // Inactive (Default variant): I21:4048 (featured), I21:4053 (my-selection), I21:4058 (numeros), I21:4063 (menu)
  // Active variants (from component variants where each tab is active):
  // - Featured active: I21:4258 (from "Property 1=a la une" - first tab active)
  // - My Selection active: I21:4287 (from "Property 1=ma selection" - second tab active)
  // - Numeros active: I21:4316 (from "Property 1=tous les numeros" - third tab active)
  // - Menu active: I21:4345 (from "Property 1=Variant5" - fourth tab active)
  
  const variantMap = {
    'featured': {
      inactive: 'I21-4048;21-4035',
      active: 'I21-4258;21-4035', // From "Property 1=a la une" - first tab active
    },
    'my-selection': {
      inactive: 'I21-4053;21-4035',
      active: 'I21-4287;21-4035', // From "Property 1=ma selection" - second tab active
    },
    'all-issues': {
      inactive: 'I21-4058;21-4035',
      active: 'I21-4316;21-4035', // From "Property 1=tous les numeros" - third tab active
    },
    'menu': {
      inactive: 'I21-4063;21-4035',
      active: 'I21-4345;21-4035', // From "Property 1=Variant5" - fourth tab active
    },
  };
  
  const variant = focused 
    ? variantMap[routeName]?.active 
    : variantMap[routeName]?.inactive;
  
  if (!variant) return null;
  
  const iconPath = `${iconName}-${variant}.png`;
  
  try {
    // Use require with dynamic path - React Native requires static paths
    // So we'll use a switch statement instead
    return getIconRequire(iconName, variant);
  } catch (error) {
    console.warn(`Icon not found: ${iconPath}`, error);
    return null;
  }
};

/**
 * Get require statement for icon (React Native requires static paths)
 */
const getIconRequire = (iconName, variant) => {
  const iconMap = {
    // Featured (alaune)
    'alaune-I21-4048;21-4035': require('../../assets/figma/icons/alaune-I21-4048;21-4035.png'),
    'alaune-I21-4258;21-4035': require('../../assets/figma/icons/alaune-I21-4258;21-4035.png'),
    // My Selection (myselection)
    'myselection-I21-4053;21-4035': require('../../assets/figma/icons/myselection-I21-4053;21-4035.png'),
    'myselection-I21-4287;21-4035': require('../../assets/figma/icons/myselection-I21-4287;21-4035.png'), // Active from "Property 1=ma selection"
    // All Issues (numeros)
    'numeros-I21-4058;21-4035': require('../../assets/figma/icons/numeros-I21-4058;21-4035.png'),
    'numeros-I21-4316;21-4035': require('../../assets/figma/icons/numeros-I21-4316;21-4035.png'), // Active from "Property 1=tous les numeros" - third tab
    // Menu
    'menu-I21-4063;21-4035': require('../../assets/figma/icons/menu-I21-4063;21-4035.png'),
    'menu-I21-4345;21-4035': require('../../assets/figma/icons/menu-I21-4345;21-4035.png'), // Active from "Property 1=Variant5" - fourth tab
  };
  
  const key = `${iconName}-${variant}`;
  const icon = iconMap[key];
  
  if (!icon) {
    console.warn(`TabIcon: Icon not found in map: ${key}`);
    console.warn(`Available keys:`, Object.keys(iconMap));
  }
  
  return icon || null;
};

const styles = StyleSheet.create({
  icon: {
    // No tintColor - use original icon colors from Figma
    // Ensure icon is properly contained and doesn't overflow
    overflow: 'hidden',
  },
});

export default TabIcon;

