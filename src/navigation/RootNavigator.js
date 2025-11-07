import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import PatientDetailsScreen from '../screens/PatientDetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useAppDispatch } from '../store/hooks';
import { loadPatients } from '../store/patientSlice';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Patients' }} />
    <Stack.Screen
      name="PatientDetails"
      component={PatientDetailsScreen}
      options={{ title: 'Patient Details' }}
    />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadPatients());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={DashboardStack} options={{ headerShown: false }} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

