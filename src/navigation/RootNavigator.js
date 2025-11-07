import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import FeaturedScreen from '../screens/FeaturedScreen';
import MySelectionScreen from '../screens/MySelectionScreen';
import AllIssuesScreen from '../screens/AllIssuesScreen';
import MenuScreen from '../screens/MenuScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import IssueDetailScreen from '../screens/IssueDetailScreen';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchArticles } from '../store/slices/articlesSlice';
import { selectBottomTabs } from '../store/slices/uiSlice';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  const bottomTabs = useAppSelector(selectBottomTabs);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: { paddingBottom: 6, height: 60 },
        tabBarIcon: ({ color, size }) => {
          const config = bottomTabs.find((tab) => tab.key === route.name) ?? { icon: 'ellipse' };
          return <Ionicons name={mapIcon(config.icon)} size={size} color={color} />;
        },
        tabBarLabel: bottomTabs.find((tab) => tab.key === route.name)?.label ?? route.name,
      })}
    >
      <Tab.Screen name="featured" component={FeaturedScreen} />
      <Tab.Screen name="my-selection" component={MySelectionScreen} />
      <Tab.Screen name="all-issues" component={AllIssuesScreen} />
      <Tab.Screen name="menu" component={MenuScreen} />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} options={{ title: 'Article' }} />
        <Stack.Screen name="IssueDetail" component={IssueDetailScreen} options={{ title: 'Numéro' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapIcon = (iconKey) => {
  switch (iconKey) {
    case 'star':
      return 'star-outline';
    case 'bookmark':
      return 'bookmark-outline';
    case 'book':
      return 'book-outline';
    case 'menu':
      return 'grid-outline';
    default:
      return 'ellipse-outline';
  }
};

export default RootNavigator;

