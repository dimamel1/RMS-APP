import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import RootNavigator from './src/navigation/RootNavigator';
import LoadingScreen from './src/components/LoadingScreen';
import store from './src/store';
import { fontFiles } from './src/config/fonts';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Use fontFiles if it has entries, otherwise use empty object
  const fontFilesToLoad = Object.keys(fontFiles).length > 0 ? fontFiles : {};
  const [fontsLoaded, fontError] = useFonts(fontFilesToLoad);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (fontsLoaded || fontError) {
          await SplashScreen.hideAsync();
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn('Error loading fonts:', e);
        // Continue even if fonts fail to load (will use system fallbacks)
        setAppIsReady(true);
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <LoadingScreen />; // Show loading screen while loading
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar style="dark" />
        <RootNavigator />
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
