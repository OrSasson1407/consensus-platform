import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001",
  timeout: 10000,
});

let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;

// --- Auth ---
export const register = (phone_number: string, display_name: string) =>
  api.post("/api/users/register", { phone_number, display_name });

// --- Rooms ---
export const createRoom = (category_type: string) =>
  api.post("/api/rooms", { category_type });

export const joinRoom = (roomId: string) =>
  api.post(`/api/rooms/${roomId}/join`);

export const getRoom = (roomId: string) =>
  api.get(`/api/rooms/${roomId}`);

export const getRoomContent = (roomId: string) =>
  api.get(`/api/rooms/${roomId}/content`);

export const getRoomMembers = (roomId: string) =>
  api.get(`/api/rooms/${roomId}/members`);

export const swipe = (roomId: string, content_item_id: string, swipe_status: string) =>
  api.post(`/api/rooms/${roomId}/swipe`, { content_item_id, swipe_status });

// --- QR ---
export const getRoomQR = (roomId: string) =>
  api.get<{ room_id: string; qr_data_url: string; join_url: string }>(`/api/rooms/${roomId}/qr`);