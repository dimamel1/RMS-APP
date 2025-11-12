/**
 * Loading Screen Component
 * Based on Figma design: LOADING PAGE – 1 (1:5007)
 */

import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoadingScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.content}>
        {/* Full loading page image from Figma */}
        <Image
          source={require('../../assets/figma/loading-page/loading-page.png')}
          style={styles.loadingImage}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // From Figma: white background
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingImage: {
    width: SCREEN_WIDTH, // From Figma: width: 390
    height: SCREEN_HEIGHT, // From Figma: height: 844
    // Maintain aspect ratio while fitting screen
  },
});

export default LoadingScreen;
