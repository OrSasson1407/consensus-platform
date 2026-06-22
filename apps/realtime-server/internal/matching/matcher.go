package matching

import (
    "context"
    "encoding/json"
    "log"
    "sync"
    "github.com/gorilla/websocket"
)

type Client struct {
    Conn   *websocket.Conn
    UserID string
}

type Hub struct {
    sync.RWMutex
    Rooms  map[string]map[*Client]bool
    Swipes map[string]map[string]int // RoomID -> ItemID -> Like Count
}

func NewHub() *Hub {
    return &Hub{
        Rooms:  make(map[string]map[*Client]bool),
        Swipes: make(map[string]map[string]int),
    }
}

func (h *Hub) JoinRoom(roomID, userID string, conn *websocket.Conn) {
    h.Lock()
    defer h.Unlock()
    if _, ok := h.Rooms[roomID]; !ok {
        h.Rooms[roomID] = make(map[*Client]bool)
        h.Swipes[roomID] = make(map[string]int)
    }
    client := &Client{Conn: conn, UserID: userID}
    h.Rooms[roomID][client] = true
    log.Printf("User %s joined room %s", userID, roomID)
}

func (h *Hub) LeaveRoom(roomID, userID string) {
    h.Lock()
    defer h.Unlock()
    if clients, ok := h.Rooms[roomID]; ok {
        for c := range clients {
            if c.UserID == userID {
                delete(clients, c)
                c.Conn.Close()
            }
        }
        if len(h.Rooms[roomID]) == 0 {
            delete(h.Rooms, roomID)
            delete(h.Swipes, roomID)
        }
    }
}

func (h *Hub) HandleSwipe(ctx context.Context, roomID, userID, itemID, status string) {
    h.Lock()
    defer h.Unlock()

    if status == "LIKE" {
        if h.Swipes[roomID] == nil {
            h.Swipes[roomID] = make(map[string]int)
        }
        h.Swipes[roomID][itemID]++

        activeUsers := len(h.Rooms[roomID])
        
        // Broadcast standard update
        updateMsg := map[string]interface{}{
            "event_type": "ROOM_UPDATE",
            "payload": map[string]interface{}{
                "room_id": roomID,
                "swipe_counts": h.Swipes[roomID],
            },
        }
        h.broadcast(roomID, updateMsg)

        // Check for Consensus
        if h.Swipes[roomID][itemID] >= activeUsers && activeUsers > 0 {
            matchMsg := map[string]interface{}{
                "event_type": "DECISION_MATCH",
                "payload": map[string]interface{}{
                    "room_id": roomID,
                    "matched_item": map[string]string{"id": itemID},
                },
            }
            h.broadcast(roomID, matchMsg)
            log.Printf("CONSENSUS REACHED in room %s for item %s", roomID, itemID)
        }
    }
}

func (h *Hub) broadcast(roomID string, message interface{}) {
    if clients, ok := h.Rooms[roomID]; ok {
        msgBytes, _ := json.Marshal(message)
        for client := range clients {
            err := client.Conn.WriteMessage(websocket.TextMessage, msgBytes)
            if err != nil {
                client.Conn.Close()
                delete(clients, client)
            }
        }
    }
}
