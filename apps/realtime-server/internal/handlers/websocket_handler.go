package handlers

import (
    "context"
    "encoding/json"
    "log"
    "net/http"

    "github.com/gorilla/websocket"
    "consensus-realtime/internal/matching"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin:     func(r *http.Request) bool { return true },
}

type rawEvent struct {
    EventType string          `json:"event_type"`
    Payload   json.RawMessage `json:"payload"`
}

type swipePayload struct {
    RoomID        string `json:"room_id"`
    UserID        string `json:"user_id"`
    ContentItemID string `json:"content_item_id"`
    Status        string `json:"status"`
}

type joinPayload struct {
    RoomID string `json:"room_id"`
    UserID string `json:"user_id"`
}

func WebSocketHandler(hub *matching.Hub) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        conn, err := upgrader.Upgrade(w, r, nil)
        if err != nil {
            log.Printf("[WS] Upgrade error: %v", err)
            return
        }

        var currentRoom, currentUser string

        defer func() {
            conn.Close()
            if currentRoom != "" && currentUser != "" {
                hub.LeaveRoom(currentRoom, currentUser)
            }
        }()

        for {
            _, msg, err := conn.ReadMessage()
            if err != nil {
                if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseNormalClosure) {
                    log.Printf("[WS] Unexpected close: %v", err)
                }
                break
            }

            var ev rawEvent
            if err := json.Unmarshal(msg, &ev); err != nil {
                log.Printf("[WS] Parse error: %v", err)
                continue
            }

            switch ev.EventType {
            case "JOIN_ROOM":
                var p joinPayload
                if err := json.Unmarshal(ev.Payload, &p); err != nil {
                    log.Printf("[WS] Bad JOIN_ROOM payload: %v", err)
                    continue
                }
                currentRoom = p.RoomID
                currentUser = p.UserID
                hub.JoinRoom(p.RoomID, p.UserID, conn)
                ack, _ := json.Marshal(map[string]interface{}{
                    "event_type": "ROOM_JOINED",
                    "payload":    map[string]string{"room_id": p.RoomID, "user_id": p.UserID},
                })
                conn.WriteMessage(websocket.TextMessage, ack)

            case "USER_SWIPE":
                var p swipePayload
                if err := json.Unmarshal(ev.Payload, &p); err != nil {
                    log.Printf("[WS] Bad USER_SWIPE payload: %v", err)
                    continue
                }
                hub.HandleSwipe(context.Background(), p.RoomID, p.UserID, p.ContentItemID, p.Status)

            default:
                log.Printf("[WS] Unknown event_type: %s", ev.EventType)
            }
        }
    }
}