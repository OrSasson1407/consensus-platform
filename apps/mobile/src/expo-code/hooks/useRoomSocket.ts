import { useEffect, useRef } from 'react';
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
}
