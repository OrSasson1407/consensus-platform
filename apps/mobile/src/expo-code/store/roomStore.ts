import { create } from 'zustand';
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
}));
