import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';

import FeaturedScreen from '../screens/FeaturedScreen';
import MySelectionScreen from '../screens/MySelectionScreen';
import AllIssuesScreen from '../screens/AllIssuesScreen';
import MenuScreen from '../screens/MenuScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import IssueDetailScreen from '../screens/IssueDetailScreen';
import Header from '../components/Header';
import TabIcon from '../components/TabIcon';
import { colors, typography } from '../theme/designTokens';
import { getFontFamilyFromPostScript } from '../theme/fonts';
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
        header: () => <Header />,
        // Colors only affect icons (but our custom icons have baked-in colors)
        tabBarActiveTintColor: '#ca121e', // Red for active state (for icons)
        tabBarInactiveTintColor: '#1f1f1f', // Dark gray for inactive state (for icons)
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel, // Label color is fixed in styles
        tabBarShowLabel: true, // Always show labels
        tabBarIcon: ({ focused }) => {
          return <TabIcon routeName={route.name} focused={focused} size={25.3} />; // Icons have baked-in colors from Figma (increased by 15%)
        },
        tabBarLabel: getLabelForRoute(route.name),
        tabBarItemStyle: {
          paddingVertical: 4, // Add vertical padding to each tab item
        },
        tabBarHideOnKeyboard: false, // Keep visible when keyboard is open
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
        <Stack.Screen 
          name="ArticleDetail" 
          component={ArticleDetailScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="IssueDetail" component={IssueDetailScreen} options={{ title: 'Numéro' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

/**
 * Get label for route based on Figma design
 */
const getLabelForRoute = (routeName) => {
  switch (routeName) {
    case 'featured':
      return 'À la une';
    case 'my-selection':
      return 'Ma sélection';
    case 'all-issues':
      return 'Tous les numéros';
    case 'menu':
      return 'Menu';
    default:
      return routeName;
  }
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 72, // Increased height to accommodate icons and text without clipping
    paddingBottom: 16, // Increased by 15% (12 * 1.15 = 13.8) for safe area (especially for devices with home indicator)
    paddingTop: 6,
    paddingHorizontal: 2, // Minimal horizontal padding to maximize space for labels
    // Tab bar is always visible by default in React Navigation
  },
  tabBarLabel: {
    fontSize: 11, // Smaller font to fit longer labels like "Tous les numéros"
    fontWeight: typography.fontWeight.normal || '400',
    fontFamily: getFontFamilyFromPostScript('FreightSansCndPro-Book'), // From Figma bottom menu
    marginTop: 2,
    marginBottom: 0,
    color: '#1f1f1f', // Fixed dark gray color for all labels (active and inactive)
    // No horizontal padding on labels to maximize space
  },
});

export default RootNavigator;

