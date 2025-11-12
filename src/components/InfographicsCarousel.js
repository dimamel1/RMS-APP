import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getFontFamilyFromPostScript } from '../theme/fonts';

const InfographicsCarousel = ({ data }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
    {data.map((item) => (
      <ImageBackground key={item.id} source={{ uri: item.image }} style={styles.card} imageStyle={styles.image}>
        <View style={styles.overlay}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.summary} numberOfLines={2}>
            {item.summary}
          </Text>
        </View>
      </ImageBackground>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
  },
  card: {
    width: 220,
    height: 160,
    marginRight: 12,
    borderRadius: 0,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    fontFamily: getFontFamilyFromPostScript('FreightTextProBold-Regular'), // FreightText Pro Bold from Figma
  },
  summary: {
    fontSize: 12,
    color: '#e2e8f0',
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
});

export default InfographicsCarousel;

