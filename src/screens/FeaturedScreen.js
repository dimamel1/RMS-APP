import React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ArticleList from '../components/ArticleList';
import InfographicsCarousel from '../components/InfographicsCarousel';
import IssueCarousel from '../components/IssueCarousel';
import SectionHeader from '../components/SectionHeader';
import { colors, spacing, typography, borderRadius } from '../theme/designTokens';
import { getFontFamilyFromPostScript } from '../theme/fonts';
import { useAppSelector } from '../store/hooks';
import { selectFavorites, selectFeaturedArticles, selectLatestArticles } from '../store/slices/articlesSlice';
import { selectIssues, selectLatestIssue } from '../store/slices/issuesSlice';
import { selectEditorial, selectInfographics } from '../store/slices/uiSlice';
import { selectThemes } from '../store/slices/themesSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FeaturedScreen = ({ navigation }) => {
  const editorial = useAppSelector(selectEditorial);
  const featuredArticles = useAppSelector(selectFeaturedArticles);
  const latestArticles = useAppSelector(selectLatestArticles);
  const favorites = useAppSelector(selectFavorites);
  const latestIssue = useAppSelector(selectLatestIssue);
  const issues = useAppSelector(selectIssues);
  const infographics = useAppSelector(selectInfographics);
  const themes = useAppSelector(selectThemes);

  const handleArticlePress = (article) => {
    navigation.navigate('ArticleDetail', { articleId: article.id });
  };

  const handleIssuePress = (issue) => {
    navigation.navigate('IssueDetail', { issueId: issue.id });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Article/Main Hero Section - From Figma (First) */}
      <TouchableOpacity 
        style={styles.articleMainCard}
        onPress={() => handleArticlePress(featuredArticles[0] || {})}
        activeOpacity={0.9}
      >
        <ImageBackground 
          source={require('../../assets/figma/article-main/image-1-1190-clean.png')} 
          style={styles.articleMainImage}
          imageStyle={styles.articleMainImageStyle}
        >
          <View style={styles.articleMainOverlay}>
            {/* Content Container */}
            <View style={styles.articleMainContent}>
              {/* Category Tag */}
              <View style={styles.articleMainCategoryTag}>
                <Text style={styles.articleMainCategoryText}>Cardiologie</Text>
              </View>
              
              {/* Title and Summary Container */}
              <View style={styles.articleMainTextContainer}>
                {/* Title */}
                <Text style={styles.articleMainTitle}>
                  LE CŒUR A SES RAISONS{'\n'}QUE LA RAISON NE CONNAÎT POINT
                </Text>
                
                {/* Summary */}
                <Text style={styles.articleMainSummary} numberOfLines={3}>
                  La prise en charge des patients atteints de maladies rhumatismales inflammatoires a connu des changements majeurs...
                </Text>
              </View>
            </View>
            
            {/* Bottom Row: Editorial Badge and Icons */}
            <View style={styles.articleMainBottomRow}>
              {/* Editorial Badge */}
              <View style={styles.articleMainEditorialBadge}>
                <Text style={styles.articleMainEditorialText}>Éditorial</Text>
              </View>
              
              {/* Icons */}
              <View style={styles.articleMainIcons}>
                <TouchableOpacity 
                  style={[styles.articleMainIconButton, styles.articleMainIconButtonFirst]}
                  onPress={() => {}}
                  activeOpacity={0.7}
                >
                  <Ionicons name="heart-outline" size={24} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.articleMainIconButton}
                  onPress={() => {}}
                  activeOpacity={0.7}
                >
                  <Image
                    source={require('../../assets/figma/article-main/icon-audio.png')}
                    style={styles.articleMainAudioIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* Listed Articles Section - From Figma */}
      <View style={styles.listedArticlesSection}>
        {latestArticles.slice(0, 4).map((article, index) => {
          const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();
          const theme = themes.find((t) => t.slug === article.themeSlug);
          
          return (
            <TouchableOpacity
              key={article.id}
              style={[styles.listedArticleItem, index < 3 && styles.listedArticleItemWithBorder]}
              onPress={() => handleArticlePress(article)}
              activeOpacity={0.7}
            >
              <View style={styles.listedArticleContent}>
                <Text style={styles.listedArticleTitle} numberOfLines={2}>
                  {article.title}
                </Text>
                <View style={styles.listedArticleMetaRow}>
                  <Text style={styles.listedArticleDate}>
                    {publishedDate.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })} | numéro{' '}
                  </Text>
                  <Text style={styles.listedArticleNumber}>{article.issueNumber || '863'}</Text>
                </View>
              </View>
              <View style={styles.listedArticleRightContainer}>
                {theme && (
                  <View style={styles.listedArticleCategory}>
                    <Text style={styles.listedArticleCategoryText}>{theme.name}</Text>
                  </View>
                )}
                <View style={styles.listedArticleIcons}>
                  <TouchableOpacity 
                    style={[styles.listedArticleIconButton, styles.listedArticleIconButtonFirst]}
                    onPress={(e) => {
                      e.stopPropagation();
                      // Handle favorite toggle
                    }}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={require('../../assets/figma/listed-articles-icons/icon-heart.png')}
                      style={styles.listedArticleIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.listedArticleIconButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      // Handle audio play
                    }}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={require('../../assets/figma/listed-articles-icons/icon-audio.png')}
                      style={styles.listedArticleIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Advertisement Banner */}
      <View style={styles.adSection}>
        <Text style={styles.adLabel}>PUBLICITÉ</Text>
        <View style={styles.adBanner}>
          <Image
            source={require('../../assets/figma/image-1-4622.png')}
            style={styles.adImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Featured Articles Section */}
      <View style={styles.section}>
        <SectionHeader title="Sélection éditoriale" />
        <ArticleList data={featuredArticles.slice(0, 4)} onPress={handleArticlePress} />
      </View>

      {/* Latest Issue Hero */}
      {latestIssue ? (
        <View style={styles.section}>
          <SectionHeader 
            title="Dernier numéro" 
            actionLabel="Voir tout" 
            onPressAction={() => navigation.navigate('all-issues')} 
          />
          <TouchableOpacity 
            style={styles.issueHero}
            onPress={() => handleIssuePress(latestIssue)}
            activeOpacity={0.9}
          >
            <ImageBackground 
              source={{ uri: latestIssue.coverImage }} 
              style={styles.issueHeroImage}
              imageStyle={styles.issueHeroImageStyle}
            >
              <View style={styles.issueOverlay}>
                <Text style={styles.issueNumber}>{`Numéro ${latestIssue.issueNumber}`}</Text>
                <Text style={styles.issueTitle}>{latestIssue.title}</Text>
                <Text style={styles.issueDate}>
                  {new Date(latestIssue.publishedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
                <View style={styles.issueArrow}>
                  <Ionicons name="arrow-forward" size={20} color={colors.iconioniciosarrowforward || '#ca121e'} />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Previous Issues Carousel */}
      <View style={styles.section}>
        <SectionHeader title="Numéros précédents" />
        <IssueCarousel issues={issues.slice(1, 6)} onSelect={handleIssuePress} />
      </View>

      {/* Infographics Section */}
      <View style={styles.section}>
        <SectionHeader title="Infographies patients" />
        <InfographicsCarousel data={infographics} />
      </View>

      {/* Recent Articles */}
      <View style={styles.section}>
        <SectionHeader title="Articles récents" />
        <ArticleList data={latestArticles.slice(0, 6)} onPress={handleArticlePress} />
      </View>

      {/* My Selection */}
      {favorites.length > 0 && (
        <View style={styles.section}>
          <SectionHeader 
            title="Ma sélection" 
            actionLabel="Tout voir" 
            onPressAction={() => navigation.navigate('my-selection')} 
          />
          <ArticleList data={favorites.slice(0, 4)} onPress={handleArticlePress} />
        </View>
      )}

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingTop: spacing.base || 16,
    paddingBottom: spacing['3xl'] || 48,
    gap: spacing.xl || 24,
  },
  section: {
    paddingHorizontal: spacing.lg || 20, // Add padding to sections
    gap: spacing.base || 16,
  },
  // Advertisement Section
  adSection: {
    paddingHorizontal: spacing.lg || 20, // Add padding only to ad section
    marginBottom: spacing.sm || 8,
  },
  adLabel: {
    fontSize: typography.fontSize.sm || 13,
    color: colors.textSecondary || 'rgba(31, 32, 36, 0.5)',
    marginBottom: spacing.xs || 4,
    fontWeight: typography.fontWeight.normal || '400',
    fontFamily: getFontFamilyFromPostScript('Inter-Regular'), // Inter 400 from Figma
  },
  adBanner: {
    width: '100%',
    height: 91,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: colors.surface || '#f1f5f9',
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
  // Editorial Card
  editorialCard: {
    height: 400,
    borderRadius: 0,
    overflow: 'hidden',
    marginBottom: spacing.base || 16,
  },
  editorialImage: {
    width: '100%',
    height: '100%',
  },
  editorialImageStyle: {
    borderRadius: 0,
  },
  editorialOverlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 32, 36, 0.6)',
    padding: spacing.xl || 24,
    justifyContent: 'flex-end',
  },
  editorialBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(202, 18, 30, 0.9)',
    paddingHorizontal: spacing.md || 12,
    paddingVertical: spacing.xs || 4,
    borderRadius: 0,
    marginBottom: spacing.base || 16,
  },
  editorialBadgeText: {
    color: colors.text || '#ffffff',
    fontSize: typography.fontSize.xs || 12,
    fontWeight: typography.fontWeight.bold || '700',
    letterSpacing: 1.5,
    fontFamily: getFontFamilyFromPostScript('FreightSansProSemibold-Regular'), // FreightSans Pro Semibold from Figma
  },
  editorialTitle: {
    fontSize: typography.fontSize['3xl'] || 30,
    fontWeight: typography.fontWeight.extrabold || '800',
    color: colors.text || '#ffffff',
    marginBottom: spacing.sm || 8,
    lineHeight: 36,
    fontFamily: getFontFamilyFromPostScript('FreightTextProBold-Regular'), // FreightText Pro Bold from Figma
  },
  editorialAuthor: {
    fontSize: typography.fontSize.sm || 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.md || 12,
    fontWeight: typography.fontWeight.medium || '500',
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  editorialSummary: {
    fontSize: typography.fontSize.base || 16,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 22,
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  // Issue Hero
  issueHero: {
    borderRadius: 0,
    overflow: 'hidden',
    height: 280,
  },
  issueHeroImage: {
    width: '100%',
    height: '100%',
  },
  issueHeroImageStyle: {
    borderRadius: 0,
  },
  issueOverlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 32, 36, 0.55)',
    padding: spacing.xl || 24,
    justifyContent: 'flex-end',
  },
  issueNumber: {
    color: colors.iconioniciosarrowforward || '#ca121e',
    fontSize: typography.fontSize.xs || 12,
    fontWeight: typography.fontWeight.bold || '700',
    marginBottom: spacing.xs || 4,
    letterSpacing: 1,
    fontFamily: getFontFamilyFromPostScript('FreightSansProBold-Regular'), // FreightSans Pro Bold from Figma
  },
  issueTitle: {
    color: colors.text || '#ffffff',
    fontSize: typography.fontSize['2xl'] || 24,
    fontWeight: typography.fontWeight.bold || '700',
    marginBottom: spacing.sm || 8,
    lineHeight: 28,
    fontFamily: getFontFamilyFromPostScript('FreightTextProBold-Regular'), // FreightText Pro Bold from Figma
  },
  issueDate: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: typography.fontSize.sm || 14,
    marginBottom: spacing.sm || 8,
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  issueArrow: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(202, 18, 30, 0.2)',
    borderRadius: 0,
    padding: spacing.sm || 8,
    marginTop: spacing.base || 16,
  },
  // Article/Main Hero Section
  articleMainCard: {
    width: '100%', // Full width
    height: 440, // From Figma: height: 440
    borderRadius: 0,
    overflow: 'hidden',
    marginBottom: spacing.base || 16,
  },
  articleMainImage: {
    width: '100%',
    height: '100%',
  },
  articleMainImageStyle: {
    borderRadius: 0,
  },
  articleMainOverlay: {
    flex: 1,
    // Gradient overlay: transparent at top to dark at bottom
    backgroundColor: 'rgba(31, 32, 36, 0.6)', // Base dark overlay
    padding: 24, // From Figma: paddingLeft: 24, paddingRight: 24, paddingTop: 24, paddingBottom: 24
    justifyContent: 'flex-end',
  },
  articleMainContent: {
    marginBottom: 24, // From Figma: itemSpacing: 24
  },
  articleMainCategoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff', // From Figma: white background
    paddingLeft: 4, // From Figma: paddingLeft: 4
    paddingRight: 4, // From Figma: paddingRight: 4
    paddingTop: 10, // From Figma: paddingTop: 10
    paddingBottom: 10, // From Figma: paddingBottom: 10
    borderRadius: 0,
    marginBottom: 6, // From Figma: itemSpacing: 6 (between category tag and Frame 9)
    // From Figma: layoutMode: HORIZONTAL, counterAxisAlignItems: CENTER, primaryAxisAlignItems: CENTER
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 18, // From Figma: height: 18
  },
  articleMainCategoryText: {
    color: '#ca121e', // From Figma: r: 0.7921568751335144, g: 0.07058823853731155, b: 0.11764705926179886
    fontSize: 12, // From Figma
    fontWeight: '700', // Bold from Figma
    fontFamily: getFontFamilyFromPostScript('FreightSansProBold-Regular'), // FreightSans Pro Bold from Figma
    lineHeight: 15.936, // From Figma: lineHeightPx: 15.935998916625977
  },
  articleMainTextContainer: {
    // Spacing handled by marginBottom on title
  },
  articleMainTitle: {
    fontSize: 26, // From Figma
    fontWeight: '700', // Bold from Figma
    color: '#ffffff', // From Figma: white text
    lineHeight: 27, // From Figma: lineHeightPx: 27
    marginBottom: 7, // From Figma: itemSpacing: 7 (between title and summary)
    fontFamily: getFontFamilyFromPostScript('Neusa-Bold'), // Neusa Bold from Figma
  },
  articleMainSummary: {
    fontSize: 16, // From Figma
    fontWeight: '350', // Book from Figma
    color: '#ffffff', // From Figma: white text
    lineHeight: 18, // From Figma: lineHeightPx: 18
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  articleMainBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // From Figma: primaryAxisAlignItems: "SPACE_BETWEEN"
    alignItems: 'center',
    width: '100%',
  },
  articleMainEditorialBadge: {
    // No additional styling needed, just the text
  },
  articleMainEditorialText: {
    fontSize: 14, // From Figma
    fontWeight: '600', // Semibold from Figma
    color: '#ffffff', // From Figma: white text
    lineHeight: 18.34, // From Figma: lineHeightPx: 18.34000015258789
    fontFamily: getFontFamilyFromPostScript('FreightSansProSemibold-Regular'), // FreightSans Pro Semibold from Figma
  },
  articleMainIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleMainIconButton: {
    width: 24, // From Figma: icon width: 24
    height: 24, // From Figma: icon height: 24
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6, // From Figma: itemSpacing: 6 (between icons)
  },
  articleMainIconButtonFirst: {
    marginLeft: 0, // No margin on first icon
  },
  articleMainAudioIcon: {
    width: 24, // From Figma: icon size 24x24
    height: 24,
    tintColor: '#ffffff', // White color for icon
  },
  // Listed Articles Section - From Figma (21:10523)
  listedArticlesSection: {
    paddingHorizontal: spacing.lg || 20,
    marginBottom: spacing.base || 16,
  },
  listedArticleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.md || 12,
    paddingHorizontal: 0,
  },
  listedArticleItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31, 32, 36, 0.1)', // Light border between items
  },
  listedArticleContent: {
    flex: 1,
    marginRight: spacing.md || 12,
  },
  listedArticleTitle: {
    fontSize: 16, // From Figma
    fontWeight: '700', // Bold from Figma
    color: '#000000', // From Figma: black
    lineHeight: 20, // From Figma: lineHeightPx: 20
    marginBottom: 4, // From Figma: itemSpacing: 4
    fontFamily: getFontFamilyFromPostScript('FreightTextProBold-Regular'), // FreightText Pro Bold from Figma
  },
  listedArticleMetaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  listedArticleDate: {
    fontSize: 13, // From Figma
    fontWeight: '350', // Book from Figma
    color: '#1f1f1f', // From Figma: r: 0.12156862765550613, g: 0.12156862765550613, b: 0.12156862765550613
    lineHeight: 16.65, // From Figma: lineHeightPx: 16.652999877929688
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  listedArticleNumber: {
    fontSize: 13, // From Figma
    fontWeight: '700', // Bold from Figma
    color: '#1f1f1f', // From Figma: dark gray
    lineHeight: 17.26, // From Figma: lineHeightPx: 17.263999938964844
    fontFamily: getFontFamilyFromPostScript('FreightSansProBold-Regular'), // FreightSans Pro Bold from Figma
  },
  listedArticleRightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 54, // From Figma: container right height
  },
  listedArticleCategory: {
    alignSelf: 'flex-end',
    paddingLeft: 4, // From Figma category-tag: paddingLeft: 4
    paddingRight: 4, // From Figma category-tag: paddingRight: 4
    paddingTop: 10, // From Figma category-tag: paddingTop: 10
    paddingBottom: 10, // From Figma category-tag: paddingBottom: 10
    backgroundColor: '#ffffff', // From Figma: white background
    borderRadius: 0,
    minHeight: 18, // From Figma category-tag: height: 18
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16, // From Figma: itemSpacing: 16 between category and icons
  },
  listedArticleCategoryText: {
    fontSize: 12, // From Figma
    fontWeight: '700', // Bold from Figma
    color: '#ca121e', // From Figma: r: 0.7921568751335144, g: 0.07058823853731155, b: 0.11764705926179886
    lineHeight: 12.6, // From Figma: lineHeightPx: 12.59999942779541
    fontFamily: getFontFamilyFromPostScript('FreightSansProBold-Regular'), // FreightSans Pro Bold from Figma
  },
  listedArticleIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listedArticleIconButton: {
    width: 24, // From Figma: icon width: 24
    height: 24, // From Figma: icon height: 24
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6, // From Figma: itemSpacing: 6 between icons
  },
  listedArticleIconButtonFirst: {
    marginLeft: 0, // No margin on first icon
  },
  listedArticleIcon: {
    width: 24, // From Figma: icon size 24x24
    height: 24,
    tintColor: '#1f1f1f', // From Figma: dark gray color
  },
  bottomSpacing: {
    height: spacing.xl || 24,
  },
});

export default FeaturedScreen;
