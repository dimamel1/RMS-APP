import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PatientList = ({ patients, onSelect }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => onSelect?.(item)}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Status:</Text>
        <Text style={styles.metaValue}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={patients}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={<Text style={styles.emptyText}>No patients available.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontWeight: '500',
    marginRight: 4,
  },
  metaValue: {
    color: '#2563eb',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 60,
  },
});

export default PatientList;

