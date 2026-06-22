import { create } from 'zustand';

interface User {
  phone: string;
  name: string;
  handle: string;
  email?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (payload: { token?: string; user: Partial<User> } | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: 'mock-session-jwt-10924',
  user: {
    phone: '+1 (555) 012-3456',
    name: 'Jordan D.',
    email: 'jordan.d@example.com',
    handle: '@jordan_consensus',
  },
  setAuth: (payload) => set((state) => {
    if (!payload) return { token: null, user: null };
    return {
      token: payload.token !== undefined ? payload.token : state.token,
      user: payload.user ? { ...state.user, ...payload.user } as User : state.user,
    };
  }),
}));
