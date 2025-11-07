import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import PatientList from '../components/PatientList';
import { useAppSelector } from '../store/hooks';

const HomeScreen = ({ navigation }) => {
  const { items, status } = useAppSelector((state) => state.patients);

  const handleSelect = (patient) => {
    navigation.navigate('PatientDetails', { patient });
  };

  if (status === 'loading' && items.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PatientList patients={items} onSelect={handleSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;

