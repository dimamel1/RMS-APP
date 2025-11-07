import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const IssueCarousel = ({ issues, onSelect }) => {
  return (
    <FlatList
      horizontal
      data={issues}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => onSelect?.(item)}>
          <Image source={{ uri: item.coverImage }} style={styles.cover} />
          <Text style={styles.issueNumber}>{`N° ${item.issueNumber}`}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.date}>{new Date(item.publishedAt).toLocaleDateString()}</Text>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 4,
  },
  card: {
    width: 160,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cover: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  issueNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#64748b',
  },
  separator: {
    width: 12,
  },
});

export default IssueCarousel;

