import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import ArticleList from '../components/ArticleList';
import SectionHeader from '../components/SectionHeader';
import { useAppSelector } from '../store/hooks';
import { selectArticles } from '../store/slices/articlesSlice';
import { selectIssueById } from '../store/slices/issuesSlice';

const IssueDetailScreen = ({ route, navigation }) => {
  const { issueId } = route.params ?? {};
  const issue = useAppSelector(selectIssueById(issueId));
  const articles = useAppSelector(selectArticles);

  if (!issue) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Numéro introuvable</Text>
        <Text style={styles.emptySubtitle}>Veuillez revenir en arrière et sélectionner un autre numéro.</Text>
      </View>
    );
  }

  const issueArticles = issue.articleIds
    .map((articleId) => articles.find((article) => article.id === articleId))
    .filter(Boolean);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.issueNumber}>{`Numéro ${issue.issueNumber}`}</Text>
        <Text style={styles.title}>{issue.title}</Text>
        <Text style={styles.date}>{new Date(issue.publishedAt).toLocaleDateString()}</Text>
      </View>

      <SectionHeader title="Articles du numéro" />
      <ArticleList
        data={issueArticles}
        onPress={(article) => navigation.navigate('ArticleDetail', { articleId: article.id })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 24,
    gap: 24,
    paddingBottom: 80,
  },
  header: {
    gap: 8,
  },
  issueNumber: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    fontWeight: '700',
    color: '#2563eb',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  date: {
    fontSize: 14,
    color: '#475569',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: 32,
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
    textAlign: 'center',
  },
});

export default IssueDetailScreen;

