import type { SwipeStatus, MatchedItem, CategoryType } from './models';

// Client -> Server
export interface UserSwipeEvent {
  event_type: 'USER_SWIPE';
  payload: {
    room_id: string;
    user_id: string;
    content_item_id: string;
    status: SwipeStatus;
  };
}

export interface JoinRoomEvent {
  event_type: 'JOIN_ROOM';
  payload: {
    room_id: string;
    user_id: string;
  };
}

// Server -> Client
export interface DecisionMatchEvent {
  event_type: 'DECISION_MATCH';
  payload: {
    room_id: string;
    matched_item: MatchedItem;
  };
}

export interface RoomUpdateEvent {
  event_type: 'ROOM_UPDATE';
  payload: {
    room_id: string;
    swipe_counts: Record<string, number>;
  };
}

export interface ErrorEvent {
  event_type: 'ERROR';
  payload: {
    message: string;
  };
}

export type ClientEvent = UserSwipeEvent | JoinRoomEvent;
export type ServerEvent = DecisionMatchEvent | RoomUpdateEvent | ErrorEvent;

export const WS_EVENTS = {
  USER_SWIPE: 'USER_SWIPE',
  JOIN_ROOM: 'JOIN_ROOM',
  DECISION_MATCH: 'DECISION_MATCH',
  ROOM_UPDATE: 'ROOM_UPDATE',
  ERROR: 'ERROR',
} as const;

export interface CreateRoomPayload {
  category_type: CategoryType;
  filters?: Record<string, unknown>;
}