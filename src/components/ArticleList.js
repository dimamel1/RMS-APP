import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { selectThemes } from '../store/slices/themesSlice';
import { useAppSelector } from '../store/hooks';
import { getFontFamilyFromPostScript } from '../theme/fonts';

const ArticleList = ({ data, onPress }) => {
  const themes = useAppSelector(selectThemes);
  const themeMap = React.useMemo(() => new Map(themes.map((theme) => [theme.slug, theme])), [themes]);

  const renderItem = ({ item }) => {
    const theme = themeMap.get(item.themeSlug);
    return (
      <TouchableOpacity style={styles.card} onPress={() => onPress?.(item)}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.content}>
          {theme ? (
            <Text style={[styles.themeBadge, { backgroundColor: `${theme.color}22`, color: theme.color }]}>
              {theme.name}
            </Text>
          ) : null}
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {item.excerpt}
          </Text>
          <View style={styles.metaRow}>
            {item.isSubscriberOnly ? <Text style={styles.badge}>A</Text> : null}
            <Text style={styles.metaText}>{item.duration} min read</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 0,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 16,
  },
  themeBadge: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 0,
    marginBottom: 8,
    fontFamily: getFontFamilyFromPostScript('FreightSansProBold-Regular'), // FreightSans Pro Bold from Figma
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    fontFamily: getFontFamilyFromPostScript('FreightTextProBold-Regular'), // FreightText Pro Bold from Figma
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: getFontFamilyFromPostScript('Inter-Regular'), // Inter 400 from Figma
  },
  badge: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 0,
    fontFamily: getFontFamilyFromPostScript('FreightSansProBold-Regular'), // FreightSans Pro Bold from Figma
  },
  separator: {
    height: 16,
  },
});

export default ArticleList;

