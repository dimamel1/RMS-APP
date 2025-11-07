import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PatientDetailsScreen = ({ route }) => {
  const { patient } = route.params ?? {};

  if (!patient) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Patient information is unavailable.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{patient.name}</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{patient.status}</Text>
      </View>
      {patient.notes ? (
        <View style={styles.section}>
          <Text style={styles.label}>Notes</Text>
          <Text style={styles.value}>{patient.notes}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.8,
  },
  value: {
    fontSize: 18,
    color: '#111827',
  },
  message: {
    fontSize: 16,
    color: '#4b5563',
  },
});

export default PatientDetailsScreen;

