import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';

import ArticleBar from '../components/ArticleBar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { markAsRead, selectArticleById } from '../store/slices/articlesSlice';
import { selectThemes } from '../store/slices/themesSlice';
import { getFontFamilyFromPostScript } from '../theme/fonts';

// Example article content from Figma
const EXAMPLE_ARTICLE_CONTENT = `Cet article présente des exemples d'approches non pharmacologiques en santé mentale, notamment la thérapie cognitivocomportementale pour l'insomnie, la pleine conscience, l'autohypnose, la relaxation, les remèdes traditionnels, l'activité physique et le contact avec la nature. L'article fournit aussi une synthèse des compétences et des ressources pratiques pour enrichir la boîte à outils des médecins de famille.`;

const EXAMPLE_AUTHORS = `Nguyen Toan Tran 
Département de médecine de famille, Unisanté, Université de Lausanne
1011 Lausanne
nguyen-toan.tran@unisante.ch

The Australian Centre for Public and Population Health Research (ACPPHR), Faculty of Health, University of Technology Sydney
235 Jones St, Ultimo NSW 2007 (PO Box 123), Australie
nguyen-toan.tran@unisante.ch

Françoise Jermann 
Service des spécialités psychiatriques, Département de psychiatrie, Hôpitaux universitaires de Genève
1211 Genève 14
francoise.jermann@hug.ch

Hubert Maisonneuve 
Institut universitaire de médecine de famille et de l'enfance, Faculté de médecine, Université de Genève
1211 Genève 4
hubert.maisonneuve@unige.ch

Matteo Coen 
Service de médecine interne générale, Département de médecine, Hôpitaux universitaires de Genève
1211 Genève 14
matteo.coen@hug.ch

Unité de développement et de recherche en éducation médicale, Faculté de médecine, Université de Genève
1211 Genève 4
matteo.coen@hug.ch`;

const EXAMPLE_REFERENCES = `* à lire

** à lire absolument

1 World Health Organization. Integrating mental health into primary care: a global perspective [En ligne]. 14 janvier 2008. Disponible sur: www.who.int/publications/i/item/9789241563680

2 King M, Sibbald B, Ward E, et al. . Randomised controlled trial of non-directive counselling, cognitive-behaviour therapy and usual general practitioner care in the management of depression as well as mixed anxiety and depression in primary care. Health Technol Assess. 2000;4(19):1-83. [Medline]

3 Aiarzaguena JM, Grandes G, Gaminde I, et al. . A randomized controlled clinical trial of a psychosocial and communication intervention carried out by GPs for patients with medically unexplained symptoms. Psychol Med. 2007 Feb;37(2):283-94. [Medline]

4 Singh B, Olds T, Curtis R, et al. . Effectiveness of physical activity interventions for improving depression, anxiety and distress: an overview of systematic reviews. Br J Sports Med. 2023 Sep;57(18):1203-9. [Medline]

5 Firth J, Marx W, Dash S, et al. . The Effects of Dietary Improvement on Symptoms of Depression and Anxiety: A Meta-Analysis of Randomized Controlled Trials. Psychosom Med. 2019 Apr;81(3):265-80. [Medline]

6 *Tanner LM, Wildman JM, Stoniute A, et al. . Non-pharmaceutical primary care interventions to improve mental health in deprived populations: a systematic review. Br J Gen Pract. 2023 Mar 30;73(729):e242-e248. [Medline]`;

const ArticleDetailScreen = ({ route }) => {
  const { articleId } = route.params ?? {};
  const dispatch = useAppDispatch();
  const article = useAppSelector(selectArticleById(articleId));
  const themes = useAppSelector(selectThemes);
  const [showAuthorsRefs, setShowAuthorsRefs] = useState(false);

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
  
  // Use example content from Figma if article content is not available
  const articleContent = article.content || EXAMPLE_ARTICLE_CONTENT;
  const articleTitle = article.title || "Approches non pharmacologiques en santé mentale pour le médecin de famille";
  const articleAuthors = article.authors || "Nguyen Toan Tran, Françoise Jermann, Hubert Maisonneuve, Matteo Coen";
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date('2025-05-06');
  const issueNumber = article.issueNumber || 917;

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* Theme Badge */}
          <Text style={styles.themeBadge}>{theme ? theme.name : 'Médecine de famille'}</Text>
          
          {/* Date and Issue */}
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>
              {publishedDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} | Numéro{' '}
            </Text>
            <Text style={styles.issueNumber}>{issueNumber}</Text>
          </View>
          
          {/* Title */}
          <Text style={styles.title}>{articleTitle}</Text>
          
          {/* Authors */}
          <Text style={styles.authorsLine}>{articleAuthors}</Text>
          
          {/* Authors & References Link */}
          <TouchableOpacity 
            style={styles.authorsRefsLink}
            onPress={() => setShowAuthorsRefs(!showAuthorsRefs)}
            activeOpacity={0.7}
          >
            <Text style={styles.authorsRefsLinkText}>Auteurs & références</Text>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.contentText}>{articleContent}</Text>
        </View>

        {/* Authors & References Section (Collapsible) */}
        {showAuthorsRefs && (
          <View style={styles.authorsRefsSection}>
            {/* Authors */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Auteurs</Text>
              <Text style={styles.authorsText}>{EXAMPLE_AUTHORS}</Text>
            </View>

            {/* References */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Références</Text>
              <Text style={styles.referencesText}>{EXAMPLE_REFERENCES}</Text>
            </View>
          </View>
        )}

        {/* Subscription Prompt (if subscriber-only) */}
        {article.isSubscriberOnly && (
          <View style={styles.subscriptionPrompt}>
            <Text style={styles.subscriptionText}>
              Ce contenu est réservé aux abonnés.{'\n'}Vous souhaitez accéder à cet article?
            </Text>
            <TouchableOpacity style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Déjà abonné ? Connectez-vous</Text>
            </TouchableOpacity>
            <Text style={styles.subscriptionDescription}>
              Abonnez-vous à la Revue Médicale Suisse, le journal de formation continue leader en Suisse romande.
            </Text>
            <TouchableOpacity style={styles.subscribeButton}>
              <Text style={styles.subscribeButtonText}>DÉCOUVRIR NOS OFFRES</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      <ArticleBar />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 20, // From Figma: padding 20px
    paddingTop: 20,
    paddingBottom: 100, // Space for ArticleBar
  },
  header: {
    marginBottom: 24,
  },
  themeBadge: {
    fontSize: 12, // From Figma
    fontWeight: '700', // Bold from Figma
    color: '#1f1f1f', // From Figma
    marginBottom: 8,
    fontFamily: getFontFamilyFromPostScript('FreightSansProBold-Regular'), // FreightSans Pro Bold from Figma
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 13, // From Figma
    fontWeight: '350', // Book from Figma
    color: '#1f1f1f', // From Figma
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  issueNumber: {
    fontSize: 13, // From Figma
    fontWeight: '700', // Bold from Figma
    color: '#1f1f1f', // From Figma
    fontFamily: getFontFamilyFromPostScript('FreightSansProBold-Regular'), // FreightSans Pro Bold from Figma
  },
  title: {
    fontSize: 18, // From Figma
    fontWeight: '700', // Bold from Figma
    color: '#1f1f1f', // From Figma
    lineHeight: 23, // From Figma: lineHeightPx: 23
    marginBottom: 8,
    fontFamily: getFontFamilyFromPostScript('FreightTextProBold-Regular'), // FreightText Pro Bold from Figma
  },
  authorsLine: {
    fontSize: 13, // From Figma
    fontWeight: '350', // Book from Figma
    color: '#1f1f1f', // From Figma
    lineHeight: 16.65, // From Figma: lineHeightPx: 16.652999877929688
    marginBottom: 8,
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  authorsRefsLink: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  authorsRefsLinkText: {
    fontSize: 12, // From Figma
    fontWeight: '400', // Regular from Figma
    color: '#1f1f1f', // From Figma
    textDecorationLine: 'underline', // From Figma: textDecoration: "UNDERLINE"
    fontFamily: getFontFamilyFromPostScript('Inter-Regular'), // Inter from Figma
  },
  contentSection: {
    marginBottom: 32,
  },
  contentText: {
    fontSize: 14, // From Figma
    fontWeight: '350', // Book from Figma
    color: '#1f1f1f', // From Figma (r: 0.12156862765550613, g: 0.12156862765550613, b: 0.12156862765550613)
    lineHeight: 20, // From Figma: lineHeightPx: 20
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  authorsRefsSection: {
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: '#f8f9fe', // From Figma: background color
    padding: 20, // From Figma
    borderRadius: 0, // No border radius
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16, // From Figma
    fontWeight: '700', // Bold from Figma
    color: '#1f1f1f', // From Figma
    lineHeight: 20, // From Figma: lineHeightPx: 20
    marginBottom: 12,
    fontFamily: getFontFamilyFromPostScript('FreightTextProBold-Regular'), // FreightText Pro Bold from Figma
  },
  authorsText: {
    fontSize: 14, // From Figma
    fontWeight: '350', // Book from Figma
    color: '#1f1f1f', // From Figma
    lineHeight: 20, // From Figma: lineHeightPx: 20
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  referencesText: {
    fontSize: 14, // From Figma
    fontWeight: '400', // Regular from Figma
    color: '#1f1f1f', // From Figma
    lineHeight: 18, // From Figma: lineHeightPx: 18
    fontFamily: getFontFamilyFromPostScript('Inter-Regular'), // Inter from Figma
  },
  subscriptionPrompt: {
    marginTop: 32,
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#f8f9fe',
    alignItems: 'center',
    borderRadius: 0,
  },
  subscriptionText: {
    fontSize: 16, // From Figma
    fontWeight: '400', // Regular from Figma
    color: '#1f1f1f', // From Figma
    lineHeight: 20, // From Figma: lineHeightPx: 20
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: getFontFamilyFromPostScript('Inter-Regular'), // Inter from Figma
  },
  loginLink: {
    marginBottom: 16,
  },
  loginLinkText: {
    fontSize: 16, // From Figma
    fontWeight: '400', // Regular from Figma
    color: '#1f1f1f', // From Figma
    lineHeight: 20, // From Figma: lineHeightPx: 20
    textAlign: 'center',
    fontFamily: getFontFamilyFromPostScript('Inter-Regular'), // Inter from Figma
  },
  subscriptionDescription: {
    fontSize: 16, // From Figma
    fontWeight: '350', // Book from Figma
    color: '#1f1f1f', // From Figma
    lineHeight: 20.5, // From Figma: lineHeightPx: 20.496000289916992
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  subscribeButton: {
    backgroundColor: '#ca121e', // From Figma
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 0,
  },
  subscribeButtonText: {
    fontSize: 15, // From Figma
    fontWeight: '600', // SemiBold from Figma
    color: '#ffffff', // From Figma
    letterSpacing: 0.6, // From Figma: 0.6px
    textTransform: 'uppercase', // From Figma: textCase: "UPPER"
    lineHeight: 18, // From Figma: lineHeightPx: 18
    fontFamily: getFontFamilyFromPostScript('Neusa-SemiBold'), // Neusa SemiBold from Figma
  },
  bottomSpacing: {
    height: 20,
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
    fontFamily: getFontFamilyFromPostScript('FreightTextProBold-Regular'),
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 8,
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'),
  },
});

export default ArticleDetailScreen;
