package handlers

import (
    "context"
    "encoding/json"
    "log"
    "net/http"

    "github.com/gorilla/websocket"
    "consensus-platform/apps/realtime-server/internal/matching"
)

var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool { return true },
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
            log.Printf("Upgrade error: %v", err)
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
                break
            }

            var ev rawEvent
            if err := json.Unmarshal(msg, &ev); err != nil {
                log.Printf("Invalid message: %v", err)
                continue
            }

            switch ev.EventType {
            case "JOIN_ROOM":
                var p joinPayload
                json.Unmarshal(ev.Payload, &p)
                currentRoom = p.RoomID
                currentUser = p.UserID
                hub.JoinRoom(p.RoomID, p.UserID, conn)

            case "USER_SWIPE":
                var p swipePayload
                json.Unmarshal(ev.Payload, &p)
                hub.HandleSwipe(context.Background(), p.RoomID, p.UserID, p.ContentItemID, p.Status)
            }
        }
    }
}