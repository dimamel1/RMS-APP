import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { markAsRead, selectArticleById } from '../store/slices/articlesSlice';
import { selectThemes } from '../store/slices/themesSlice';

const ArticleDetailScreen = ({ route }) => {
  const { articleId } = route.params ?? {};
  const dispatch = useAppDispatch();
  const article = useAppSelector(selectArticleById(articleId));
  const themes = useAppSelector(selectThemes);

  useEffect(() => {
    if (article) {
      dispatch(markAsRead(article.id));
    }
  }, [article, dispatch]);

  if (!article) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Article introuvable</Text>
        <Text style={styles.emptySubtitle}>Veuillez revenir en arrière et réessayer.</Text>
      </View>
    );
  }

  const theme = themes.find((item) => item.slug === article.themeSlug);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>{theme ? theme.name : 'Article'}</Text>
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.subtitle}>{article.subtitle}</Text>
      <View style={styles.metaRow}>
        {article.isSubscriberOnly ? <Text style={styles.badge}>Contenu abonnés</Text> : null}
        <Text style={styles.meta}>{`${article.duration} min de lecture`}</Text>
        <Text style={styles.meta}>{new Date(article.publishedAt).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.contentText}>{article.content}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 24,
    gap: 16,
    paddingBottom: 80,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    backgroundColor: '#dc2626',
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  meta: {
    fontSize: 13,
    color: '#64748b',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1f2937',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#f8fafc',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 8,
  },
});

export default ArticleDetailScreen;

