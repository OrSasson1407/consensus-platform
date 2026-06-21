package matching

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "sync"

    "github.com/gorilla/websocket"
    redisclient "consensus-platform/apps/realtime-server/internal/redis"
    "consensus-platform/apps/realtime-server/internal/models"
)

type Hub struct {
    mu      sync.RWMutex
    rooms   map[string]map[string]*websocket.Conn // roomID -> userID -> conn
    redis   *redisclient.Client
}

func NewHub(rc *redisclient.Client) *Hub {
    return &Hub{
        rooms: make(map[string]map[string]*websocket.Conn),
        redis: rc,
    }
}

func (h *Hub) JoinRoom(roomID, userID string, conn *websocket.Conn) {
    h.mu.Lock()
    defer h.mu.Unlock()
    if h.rooms[roomID] == nil {
        h.rooms[roomID] = make(map[string]*websocket.Conn)
    }
    h.rooms[roomID][userID] = conn
    h.redis.AddMember(context.Background(), roomID, userID)
    log.Printf("User %s joined room %s", userID, roomID)
}

func (h *Hub) LeaveRoom(roomID, userID string) {
    h.mu.Lock()
    defer h.mu.Unlock()
    if h.rooms[roomID] != nil {
        delete(h.rooms[roomID], userID)
    }
}

func (h *Hub) HandleSwipe(ctx context.Context, roomID, userID, itemID, status string) {
    isMatch, err := h.redis.RecordSwipe(ctx, roomID, userID, itemID, status)
    if err != nil {
        log.Printf("Redis error: %v", err)
        return
    }
    if isMatch {
        h.broadcastMatch(roomID, itemID)
    }
}

func (h *Hub) broadcastMatch(roomID, itemID string) {
    event := models.OutgoingEvent{
        EventType: "DECISION_MATCH",
        Payload: models.MatchPayload{
            RoomID: roomID,
            MatchedItem: models.MatchedItem{
                ID:    itemID,
                Title: fmt.Sprintf("Item %s", itemID),
            },
        },
    }
    b, _ := json.Marshal(event)

    h.mu.RLock()
    defer h.mu.RUnlock()
    for _, conn := range h.rooms[roomID] {
        conn.WriteMessage(websocket.TextMessage, b)
    }
    log.Printf("Match in room %s for item %s", roomID, itemID)
}

func (h *Hub) Broadcast(roomID string, event models.OutgoingEvent) {
    b, _ := json.Marshal(event)
    h.mu.RLock()
    defer h.mu.RUnlock()
    for _, conn := range h.rooms[roomID] {
        conn.WriteMessage(websocket.TextMessage, b)
    }
}