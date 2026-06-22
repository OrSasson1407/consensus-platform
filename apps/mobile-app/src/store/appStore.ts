import { create } from "zustand";
import { setAuthToken } from "../services/api";

interface User {
  id: string;
  phone_number: string;
  display_name: string;
  avatar_url?: string;
}

interface Room {
  id: string;
  category_type: string;
  room_status: string;
  creator_id: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  currentRoom: Room | null;
  setAuth: (user: User, token: string) => void;
  setRoom: (room: Room | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: null,
  currentRoom: null,
  setAuth: (user, token) => {
    setAuthToken(token);
    set({ user, token });
  },
  setRoom: (room) => set({ currentRoom: room }),
  logout: () => set({ user: null, token: null, currentRoom: null }),
}));