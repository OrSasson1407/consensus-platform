import { create } from 'zustand';

interface RoomState {
  activeRoomId: string | null;
  activeCategory: string | null;
  create: (category: string) => void;
  reset: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  activeRoomId: null,
  activeCategory: null,
  create: (category) => set({ activeRoomId: 'room_7721', activeCategory: category }),
  reset: () => set({ activeRoomId: null, activeCategory: null }),
}));
