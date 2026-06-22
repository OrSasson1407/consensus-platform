export interface CodeFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const EXPO_CODE_FILES: CodeFile[] = [
  {
    name: 'App.tsx',
    path: 'App.tsx',
    language: 'typescript',
    content: `import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0a0a0f" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}`
  },
  {
    name: 'types.ts',
    path: 'src/types.ts',
    language: 'typescript',
    content: `export interface User {
  id: string;
  phone_number: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type CategoryType = 'MOVIES' | 'RESTAURANTS' | 'ACTIVITIES';
export type RoomStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
export type SwipeStatus = 'LIKE' | 'DISLIKE' | 'SUPERLIKE';

export interface Room {
  id: string;
  creator_id: string;
  category_type: CategoryType;
  room_status: RoomStatus;
  created_at: string;
  expires_at: string;
}

export interface ContentItem {
  id: string;
  category_type: CategoryType;
  title: string;
  image_url?: string;
  meta_data?: Record<string, unknown>; // { year, rating, cuisine, price_range }
  created_at: string;
}

export interface MatchedItem {
  id: string;
  title: string;
  image_url?: string;
  action_link?: string;
}`
  },
  {
    name: 'api.ts',
    path: 'src/services/api.ts',
    language: 'typescript',
    content: `import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Room, ContentItem } from '../types';

const BASE_URL = 'http://localhost:3001';

async function request(path: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem('@consensus_token');
  const res = await fetch(\`\${BASE_URL}\${path}\`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': \`Bearer \${token}\` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'API request failed');
  }
  return res.json();
}

export const api = {
  register: (body: { phone_number: string; display_name: string }): Promise<{ token: string; user: User }> =>
    request('/api/users/register', { method: 'POST', body: JSON.stringify(body) }),
    
  getMe: (): Promise<User> =>
    request('/api/users/me'),
    
  updateMe: (body: { display_name?: string; avatar_url?: string }): Promise<User> =>
    request('/api/users/me', { method: 'PATCH', body: JSON.stringify(body) }),
    
  createRoom: (body: { category_type: string }): Promise<Room> =>
    request('/api/rooms', { method: 'POST', body: JSON.stringify(body) }),
    
  joinRoom: (id: string): Promise<Room> =>
    request(\`/api/rooms/\${id}/join\`, { method: 'POST' }),
    
  getRoom: (id: string): Promise<Room> =>
    request(\`/api/rooms/\${id}\`),
    
  getRoomContent: (id: string): Promise<ContentItem[]> =>
    request(\`/api/rooms/\${id}/content\`),
    
  getMembers: (id: string): Promise<User[]> =>
    request(\`/api/rooms/\${id}/members\`),
    
  swipe: (id: string, body: { content_item_id: string; swipe_status: 'LIKE' | 'DISLIKE' | 'SUPERLIKE' }): Promise<{ isMatch: boolean }> =>
    request(\`/api/rooms/\${id}/swipe\`, { method: 'POST', body: JSON.stringify(body) }),
};`
  },
  {
    name: 'roomStore.ts',
    path: 'src/store/roomStore.ts',
    language: 'typescript',
    content: `import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Room, ContentItem, MatchedItem } from '../types';

const TOKEN_KEY = '@consensus_token';
const USER_KEY  = '@consensus_user';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: async (token, user) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user });
  },
  clearAuth: async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    set({ token: null, user: null });
  },
}));

interface RoomState {
  currentRoom: Room | null;
  contentItems: ContentItem[];
  members: User[];
  matchedItem: MatchedItem | null;
  setRoom: (room: Room | null) => void;
  setContent: (items: ContentItem[]) => void;
  setMembers: (members: User[]) => void;
  setMatch: (item: MatchedItem | null) => void;
  resetRoom: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  contentItems: [],
  members: [],
  matchedItem: null,
  setRoom: (room) => set({ currentRoom: room }),
  setContent: (items) => set({ contentItems: items }),
  setMembers: (members) => set({ members }),
  setMatch: (item) => set({ matchedItem: item }),
  resetRoom: () => set({ currentRoom: null, contentItems: [], members: [], matchedItem: null }),
}));`
  },
  {
    name: 'useRoomSocket.ts',
    path: 'src/hooks/useRoomSocket.ts',
    language: 'typescript',
    content: `import { useEffect, useRef } from 'react';
import { MatchedItem } from '../types';

export function useRoomSocket(
  roomId: string,
  userId: string,
  onMatch: (matchedItem: MatchedItem) => void
) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket backend
    const ws = new WebSocket('ws://localhost:8080/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        event_type: 'JOIN_ROOM',
        payload: { room_id: roomId, user_id: userId }
      }));
    };

    ws.onmessage = (e) => {
      try {
        const ev = JSON.parse(e.data);
        if (ev.event_type === 'DECISION_MATCH') {
          onMatch(ev.payload.matched_item);
        }
      } catch (err) {
        console.error('Error parsing WebSocket event:', err);
      }
    };

    ws.onerror = (e) => {
      console.warn('WebSocket error:', e);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [roomId, userId, onMatch]);

  const sendSwipe = (contentItemId: string, status: 'LIKE' | 'DISLIKE' | 'SUPERLIKE') => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        event_type: 'USER_SWIPE',
        payload: {
          room_id: roomId,
          user_id: userId,
          content_item_id: contentItemId,
          status
        }
      }));
    }
  };

  return { sendSwipe };
}`
  },
  {
    name: 'AppNavigator.tsx',
    path: 'src/navigation/AppNavigator.tsx',
    language: 'typescript',
    content: `import React, { useEffect, useState } from 'react';
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
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RoomCreate" component={RoomCreateScreen} options={{ title: 'ConsensuS Hub' }} />
        <Stack.Screen name="SwipeDeck" component={SwipeDeckScreen} options={{ title: 'Swiping Deck' }} />
        <Stack.Screen name="Match" component={MatchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`
  },
  {
    name: 'OnboardingScreen.tsx',
    path: 'src/screens/OnboardingScreen.tsx',
    language: 'typescript',
    content: `// ... Onboarding Screen Implementation with Registration and Storage`
  },
  {
    name: 'SwipeDeckScreen.tsx',
    path: 'src/screens/SwipeDeckScreen.tsx',
    language: 'typescript',
    content: `// ... Card Deck Swiper with overlay visual cues and user state synchronizations`
  }
];

// Let's add full code references for key components inside!
EXPO_CODE_FILES.find(f => f.name === 'OnboardingScreen.tsx')!.content = `import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuthStore } from '../store/roomStore';
import { api } from '../services/api';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!phoneNumber.trim() || !displayName.trim()) return;
    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await api.register({
        phone_number: phoneNumber.trim(),
        display_name: displayName.trim(),
      });
      await setAuth(response.token, response.user);
      navigation.navigate('RoomCreate');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.brandingContainer}>
          <Text style={styles.appName}>ConsensuS</Text>
          <Text style={styles.tagline}>"Tinder for group decisions"</Text>
        </View>

        <View style={styles.formContainer}>
          {errorMsg && <View style={styles.errorBox}><Text style={styles.errorText}>{errorMsg}</Text></View>}

          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={phoneNumber} onChangeText={setPhoneNumber} />

          <Text style={styles.label}>Display Name</Text>
          <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} maxLength={20} />

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Get Started</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}`;

EXPO_CODE_FILES.find(f => f.name === 'SwipeDeckScreen.tsx')!.content = `import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Platform, SafeAreaView } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuthStore, useRoomStore } from '../store/roomStore';
import { api } from '../services/api';
import { useRoomSocket } from '../hooks/useRoomSocket';
import { ContentItem, MatchedItem } from '../types';

type RoutePropType = RouteProp<RootStackParamList, 'SwipeDeck'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'SwipeDeck'>;

export default function SwipeDeckScreen() {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavigationProp>();
  const { roomId, categoryType } = route.params;
  const user = useAuthStore((state) => state.user);

  const { contentItems, setContent, members, setMembers, setMatch } = useRoomStore();
  const [loading, setLoading] = useState(true);
  const [cardsSwiped, setCardsSwiped] = useState(0);
  const swiperRef = useRef<Swiper<ContentItem>>(null);

  useEffect(() => {
    Promise.all([api.getRoomContent(roomId), api.getMembers(roomId)])
      .then(([items, m]) => {
        setContent(items);
        setMembers(m);
        setLoading(false);
      });
  }, [roomId]);

  const onMatch = (item: MatchedItem) => {
    setMatch(item);
    navigation.navigate('Match', { matchedItem: item });
  };

  const { sendSwipe } = useRoomSocket(roomId, user?.id || '', onMatch);

  const handleSwipeRight = async (idx: number) => {
    const item = contentItems[idx];
    const res = await api.swipe(roomId, { content_item_id: item.id, swipe_status: 'LIKE' });
    sendSwipe(item.id, 'LIKE');
    if (res.isMatch) onMatch({ id: item.id, title: item.title, image_url: item.image_url });
  };

  const handleSwipeLeft = async (idx: number) => {
    await api.swipe(roomId, { content_item_id: contentItems[idx].id, swipe_status: 'DISLIKE' });
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#7c3aed" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roomText}>Room: {roomId.slice(0, 8)}</Text>
        <Text style={styles.membersCount}>{members.length} Swiping</Text>
      </View>
      <View style={styles.deck}>
        <Swiper
          ref={swiperRef}
          cards={contentItems}
          renderCard={(card) => (
            <View style={styles.card}>
              <Image source={{ uri: card.image_url }} style={styles.img} />
              <Text style={styles.title}>{card.title}</Text>
            </View>
          )}
          onSwipedLeft={handleSwipeLeft}
          onSwipedRight={handleSwipeRight}
          cardIndex={cardsSwiped}
          stackSize={3}
        />
      </View>
    </SafeAreaView>
  );
}`;
