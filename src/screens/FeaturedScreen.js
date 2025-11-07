import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ArticleList from '../components/ArticleList';
import InfographicsCarousel from '../components/InfographicsCarousel';
import IssueCarousel from '../components/IssueCarousel';
import SectionHeader from '../components/SectionHeader';
import { useAppSelector } from '../store/hooks';
import { selectFavorites, selectFeaturedArticles, selectLatestArticles } from '../store/slices/articlesSlice';
import { selectIssues, selectLatestIssue } from '../store/slices/issuesSlice';
import { selectEditorial, selectInfographics } from '../store/slices/uiSlice';

const FeaturedScreen = ({ navigation }) => {
  const editorial = useAppSelector(selectEditorial);
  const featuredArticles = useAppSelector(selectFeaturedArticles);
  const latestArticles = useAppSelector(selectLatestArticles);
  const favorites = useAppSelector(selectFavorites);
  const latestIssue = useAppSelector(selectLatestIssue);
  const issues = useAppSelector(selectIssues);
  const infographics = useAppSelector(selectInfographics);

  const handleArticlePress = (article) => {
    navigation.navigate('ArticleDetail', { articleId: article.id });
  };

  const handleIssuePress = (issue) => {
    navigation.navigate('IssueDetail', { issueId: issue.id });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="dark-content" />

      {editorial ? (
        <ImageBackground source={{ uri: editorial.image }} style={styles.editorialCard} imageStyle={styles.editorialImage}>
          <View style={styles.editorialOverlay}>
            <Text style={styles.editorialEyebrow}>Éditorial</Text>
            <Text style={styles.editorialTitle}>{editorial.title}</Text>
            <Text style={styles.editorialAuthor}>{editorial.author}</Text>
            <Text style={styles.editorialSummary}>{editorial.summary}</Text>
          </View>
        </ImageBackground>
      ) : null}

      <View style={styles.section}>
        <SectionHeader title="Sélection éditoriale" />
        <ArticleList data={featuredArticles.slice(0, 4)} onPress={handleArticlePress} />
      </View>

      {latestIssue ? (
        <View style={styles.section}>
        <SectionHeader title="Dernier numéro" actionLabel="Voir tout" onPressAction={() => navigation.navigate('all-issues')} />
          <TouchableOpacity style={styles.issueHero} onPress={() => handleIssuePress(latestIssue)}>
            <ImageBackground source={{ uri: latestIssue.coverImage }} style={styles.issueHeroImage} imageStyle={styles.issueHeroImageStyle}>
              <View style={styles.issueOverlay}>
                <Text style={styles.issueNumber}>{`Numéro ${latestIssue.issueNumber}`}</Text>
                <Text style={styles.issueTitle}>{latestIssue.title}</Text>
                <Text style={styles.issueDate}>{new Date(latestIssue.publishedAt).toLocaleDateString()}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionHeader title="Numéros précédents" />
        <IssueCarousel issues={issues.slice(1, 6)} onSelect={handleIssuePress} />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Infographies patients" />
        <InfographicsCarousel data={infographics} />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Articles récents" />
        <ArticleList data={latestArticles.slice(0, 6)} onPress={handleArticlePress} />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Ma sélection" actionLabel="Tout voir" onPressAction={() => navigation.navigate('my-selection')} />
        <ArticleList data={favorites.slice(0, 4)} onPress={handleArticlePress} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    padding: 20,
    gap: 24,
    paddingBottom: 48,
  },
  section: {
    gap: 16,
  },
  editorialCard: {
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
  },
  editorialImage: {
    borderRadius: 24,
  },
  editorialOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    padding: 24,
    justifyContent: 'flex-end',
  },
  editorialEyebrow: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  editorialTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  editorialAuthor: {
    fontSize: 14,
    color: '#bae6fd',
    marginBottom: 12,
  },
  editorialSummary: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  issueHero: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  issueHeroImage: {
    height: 200,
    borderRadius: 24,
  },
  issueHeroImageStyle: {
    borderRadius: 24,
  },
  issueOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    padding: 24,
    justifyContent: 'flex-end',
  },
  issueNumber: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  issueTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  issueDate: {
    color: '#e2e8f0',
    fontSize: 14,
  },
});

export default FeaturedScreen;

