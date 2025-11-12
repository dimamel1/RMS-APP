import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getFontFamilyFromPostScript } from '../theme/fonts';

/**
 * Section Header Component
 * Based on Figma design: section-title (21:4877)
 * Contains: Title text and a horizontal line
 */
const SectionHeader = ({ title, actionLabel, onPressAction }) => (
  <View style={styles.container}>
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title?.toUpperCase() || ''}</Text>
    </View>
    <View style={styles.line} />
    {actionLabel ? (
      <Text style={styles.action} onPress={onPressAction}>
        {actionLabel}
      </Text>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  titleContainer: {
    paddingRight: 6, // From Figma: paddingRight: 6
    // Gap: 10px between title and line (handled by line margin)
  },
  title: {
    fontSize: 22, // From Figma
    fontWeight: '700', // Bold from Figma
    fontStyle: 'normal',
    color: '#000000', // Black from Figma
    textTransform: 'uppercase', // From Figma textCase: "UPPER"
    letterSpacing: 0, // From Figma
    lineHeight: 26.4, // From Figma: lineHeightPx: 26.4 (120% of font-size)
    // Use Neusa-Bold from Figma (with system fallback)
    fontFamily: getFontFamilyFromPostScript('Neusa-Bold'),
  },
  line: {
    flex: 1, // From Figma: layoutGrow: 1
    height: 1, // From Figma: strokeWeight: 1
    backgroundColor: '#000000', // Black from Figma
    marginLeft: 10, // From Figma: itemSpacing: 10
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    marginLeft: 10,
  },
});

export default SectionHeader;

