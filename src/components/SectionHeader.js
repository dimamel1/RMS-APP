import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SectionHeader = ({ title, actionLabel, onPressAction }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {actionLabel ? (
      <Text style={styles.action} onPress={onPressAction}>
        {actionLabel}
      </Text>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
});

export default SectionHeader;

