import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Room, ContentItem } from '../types';

const BASE_URL = 'http://localhost:3001';

async function request(path: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem('@consensus_token');
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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
    request(`/api/rooms/${id}/join`, { method: 'POST' }),
    
  getRoom: (id: string): Promise<Room> =>
    request(`/api/rooms/${id}`),
    
  getRoomContent: (id: string): Promise<ContentItem[]> =>
    request(`/api/rooms/${id}/content`),
    
  getMembers: (id: string): Promise<User[]> =>
    request(`/api/rooms/${id}/members`),
    
  swipe: (id: string, body: { content_item_id: string; swipe_status: 'LIKE' | 'DISLIKE' | 'SUPERLIKE' }): Promise<{ isMatch: boolean }> =>
    request(`/api/rooms/${id}/swipe`, { method: 'POST', body: JSON.stringify(body) }),
};
