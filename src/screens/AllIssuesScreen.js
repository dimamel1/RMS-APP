import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAppSelector } from '../store/hooks';
import { selectIssues } from '../store/slices/issuesSlice';
import { getFontFamilyFromPostScript } from '../theme/fonts';

const AllIssuesScreen = ({ navigation }) => {
  const issues = useAppSelector(selectIssues);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('IssueDetail', { issueId: item.id })}>
      <Image source={{ uri: item.coverImage }} style={styles.cover} />
      <View style={styles.content}>
        <Text style={styles.issueNumber}>{`Numéro ${item.issueNumber}`}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{new Date(item.publishedAt).toLocaleDateString()}</Text>
        <Text style={styles.meta}>{`${item.articleIds.length} articles`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listContent}
      data={issues}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#ffffff',
    borderRadius: 0,
    padding: 16,
  },
  cover: {
    width: 120,
    height: 160,
    borderRadius: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  issueNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 8,
    fontFamily: getFontFamilyFromPostScript('FreightSansProBold-Regular'), // FreightSans Pro Bold from Figma
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    fontFamily: getFontFamilyFromPostScript('FreightTextProBold-Regular'), // FreightText Pro Bold from Figma
  },
  date: {
    fontSize: 14,
    color: '#475569',
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  meta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 12,
    fontFamily: getFontFamilyFromPostScript('Inter-Regular'), // Inter 400 from Figma
  },
  separator: {
    height: 16,
  },
});

export default AllIssuesScreen;

