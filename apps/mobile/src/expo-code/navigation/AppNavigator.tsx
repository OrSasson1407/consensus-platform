import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import { useAuthStore } from '../store/roomStore';
import OnboardingScreen from '../screens/OnboardingScreen';
import RoomCreateScreen from '../screens/RoomCreateScreen';
import SwipeDeckScreen from '../screens/SwipeDeckScreen';
import MatchScreen from '../screens/MatchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MatchedItem } from '../types';

export type RootStackParamList = {
  Onboarding: undefined;
  RoomCreate: undefined;
  SwipeDeck: { roomId: string; categoryType: string };
  Match: { matchedItem: MatchedItem };
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { token, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check storage for existing session
    const bootstrapAsync = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@consensus_token');
        const storedUser = await AsyncStorage.getItem('@consensus_user');
        if (storedToken && storedUser) {
          await setAuth(storedToken, JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn('Failed to restore session:', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, [setAuth]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={token ? 'RoomCreate' : 'Onboarding'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#111118',
            borderBottomWidth: 1,
            borderBottomColor: '#1f1f35',
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTintColor: '#f9fafb',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: { backgroundColor: '#0a0a0f' },
        }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="RoomCreate" 
          component={RoomCreateScreen} 
          options={{ title: 'ConsensuS Hub' }}
        />
        <Stack.Screen 
          name="SwipeDeck" 
          component={SwipeDeckScreen} 
          options={{ title: 'Swiping Deck' }}
        />
        <Stack.Screen 
          name="Match" 
          component={MatchScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'My Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
