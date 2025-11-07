import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import ArticleList from '../components/ArticleList';
import SectionHeader from '../components/SectionHeader';
import { useAppSelector } from '../store/hooks';
import { selectFavorites } from '../store/slices/articlesSlice';

const MySelectionScreen = ({ navigation }) => {
  const favorites = useAppSelector(selectFavorites);

  const handleArticlePress = (article) => {
    navigation.navigate('ArticleDetail', { articleId: article.id });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionHeader title="Ma sélection" />
      {favorites.length ? (
        <ArticleList data={favorites} onPress={handleArticlePress} />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={styles.emptyTitle}>Aucun favori pour le moment</Text>
          <Text style={styles.emptySubtitle}>
            Ajoutez des articles à votre sélection pour les retrouver rapidement.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    gap: 20,
    paddingBottom: 80,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default MySelectionScreen;

