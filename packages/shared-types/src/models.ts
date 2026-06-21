export interface User {
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
  members?: User[];
}

export interface ContentItem {
  id: string;
  category_type: CategoryType;
  title: string;
  image_url?: string;
  meta_data?: Record<string, unknown>;
  created_at: string;
}

export interface Swipe {
  id: number;
  room_id: string;
  user_id: string;
  content_item_id: string;
  swipe_status: SwipeStatus;
  created_at: string;
}

export interface MatchedItem {
  id: string;
  title: string;
  image_url?: string;
  action_link?: string;
}