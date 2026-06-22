import { useEffect, useRef, useCallback } from "react";

const WS_URL = process.env.EXPO_PUBLIC_WS_URL ?? "ws://localhost:8080";

interface WSOptions {
  roomId: string;
  userId: string;
  onMatch?: (payload: { room_id: string; matched_item: object }) => void;
  onRoomUpdate?: (payload: { room_id: string; swipe_counts: Record<string, number> }) => void;
}

export function useRoomWebSocket({ roomId, userId, onMatch, onRoomUpdate }: WSOptions) {
  const ws = useRef<WebSocket | null>(null);

  const send = useCallback((data: object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(`${WS_URL}/ws`);

    ws.current.onopen = () => {
      send({ event_type: "JOIN_ROOM", payload: { room_id: roomId, user_id: userId } });
    };

    ws.current.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.event_type === "DECISION_MATCH") onMatch?.(msg.payload);
        if (msg.event_type === "ROOM_UPDATE") onRoomUpdate?.(msg.payload);
      } catch {}
    };

    return () => { ws.current?.close(); };
  }, [roomId, userId]);

  const sendSwipe = useCallback(
    (content_item_id: string, status: "LIKE" | "DISLIKE" | "SUPERLIKE") => {
      send({
        event_type: "USER_SWIPE",
        payload: { room_id: roomId, user_id: userId, content_item_id, status },
      });
    },
    [roomId, userId, send]
  );

  return { sendSwipe };
}