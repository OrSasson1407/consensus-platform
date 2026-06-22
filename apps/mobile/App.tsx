import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import SwipeDeckScreen from './src/screens/SwipeDeckScreen';
import MatchCelebrationScreen from './src/screens/MatchCelebrationScreen';
import ProfileScreen from './src/screens/ProfileScreen';

type ScreenName = 'Onboarding' | 'Explore' | 'SwipeDeck' | 'MatchCelebration' | 'Profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Onboarding');
  const [navigationHistory, setNavigationHistory] = useState<ScreenName[]>(['Onboarding']);

  // Custom high fidelity navigation simulator
  const navigation = {
    navigate: (screen: ScreenName) => {
      setCurrentScreen(screen);
      setNavigationHistory((prev) => [...prev, screen]);
    },
    replace: (screen: ScreenName) => {
      setCurrentScreen(screen);
      setNavigationHistory([screen]);
    },
    goBack: () => {
      if (navigationHistory.length > 1) {
        const nextHistory = [...navigationHistory];
        nextHistory.pop(); // Remove active
        const previous = nextHistory[nextHistory.length - 1];
        setNavigationHistory(nextHistory);
        setCurrentScreen(previous);
      } else {
        setCurrentScreen('Onboarding');
      }
    },
    openDrawer: () => {
      // Direct user straight to Profile setting drawer!
      setCurrentScreen('Profile');
    }
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'Onboarding':
        return <OnboardingScreen navigation={navigation} />;
      case 'Explore':
        return <ExploreScreen navigation={navigation} />;
      case 'SwipeDeck':
        return <SwipeDeckScreen navigation={navigation} />;
      case 'MatchCelebration':
        return <MatchCelebrationScreen navigation={navigation} />;
      case 'Profile':
        return <ProfileScreen navigation={navigation} />;
      default:
        return <OnboardingScreen navigation={navigation} />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.appContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
        {renderActiveScreen()}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
});
