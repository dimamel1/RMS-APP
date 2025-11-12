import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

/**
 * Article Bar Component
 * Displays action buttons for article page (close, share, audio)
 * Based on Figma design: article-bar (21:4431)
 * Positioned at the bottom of the screen
 */
const ArticleBar = ({ onClose, onShare, onAudio }) => {
  const navigation = useNavigation();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigation.goBack();
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share functionality - can be enhanced with expo-sharing later
      Alert.alert('Partager', 'Fonctionnalité de partage à venir');
    }
  };

  const handleAudio = () => {
    if (onAudio) {
      onAudio();
    }
    // Audio functionality can be implemented here
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left container - Close button with separator */}
        <View style={styles.leftContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/figma/article-bar-icons/icon-close.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* Vertical separator line */}
          <View style={styles.separator} />
        </View>

        {/* Right container - Share and Audio */}
        <View style={styles.rightContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/figma/article-bar-icons/icon-share.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleAudio}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/figma/article-bar-icons/icon-audio.png')}
              style={styles.icon}
              resizeMode="contain"
            />
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
    height: 55,
    paddingHorizontal: 20,
    width: '100%',
    // No shadow or border as per design
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Space between close icon and separator
  },
  separator: {
    width: 1,
    height: 40, // Height of separator line
    backgroundColor: '#a2a2a2', // Light gray color from Figma (rgb(0.635, 0.635, 0.635))
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20, // Spacing between share and audio icons
  },
  iconButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default ArticleBar;

