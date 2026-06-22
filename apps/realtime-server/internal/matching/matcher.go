package matching

import (
    "context"
    "encoding/json"
    "log"
    "sync"

    "github.com/gorilla/websocket"
    redisclient "consensus-realtime/internal/redis"
)

type connection struct {
    conn *websocket.Conn
    mu   sync.Mutex
}

func (c *connection) send(data []byte) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.conn.WriteMessage(websocket.TextMessage, data)
}

type Hub struct {
    mu    sync.RWMutex
    rooms map[string]map[string]*connection
    redis *redisclient.Client
}

func NewHub(rc *redisclient.Client) *Hub {
    return &Hub{
        rooms: make(map[string]map[string]*connection),
        redis: rc,
    }
}

func (h *Hub) JoinRoom(roomID, userID string, conn *websocket.Conn) {
    h.mu.Lock()
    if h.rooms[roomID] == nil {
        h.rooms[roomID] = make(map[string]*connection)
    }
    h.rooms[roomID][userID] = &connection{conn: conn}
    h.mu.Unlock()

    if err := h.redis.AddMember(context.Background(), roomID, userID); err != nil {
        log.Printf("[Hub] Redis AddMember error: %v", err)
    }
    log.Printf("[Hub] %s joined room %s", userID, roomID)
}

func (h *Hub) LeaveRoom(roomID, userID string) {
    h.mu.Lock()
    if h.rooms[roomID] != nil {
        delete(h.rooms[roomID], userID)
        if len(h.rooms[roomID]) == 0 {
            delete(h.rooms, roomID)
        }
    }
    h.mu.Unlock()

    h.redis.RemoveMember(context.Background(), roomID, userID)
    log.Printf("[Hub] %s left room %s", userID, roomID)
}

func (h *Hub) HandleSwipe(ctx context.Context, roomID, userID, itemID, status string) {
    isMatch, err := h.redis.RecordSwipe(ctx, roomID, userID, itemID, status)
    if err != nil {
        log.Printf("[Hub] Redis RecordSwipe error: %v", err)
        return
    }

    // Broadcast update to room
    updateMsg, _ := json.Marshal(map[string]interface{}{
        "event_type": "ROOM_UPDATE",
        "payload": map[string]interface{}{
            "room_id": roomID,
            "last_swipe": map[string]string{
                "user_id": userID,
                "item_id": itemID,
                "status":  status,
            },
        },
    })
    h.broadcast(roomID, updateMsg)

    if isMatch {
        matchMsg, _ := json.Marshal(map[string]interface{}{
            "event_type": "DECISION_MATCH",
            "payload": map[string]interface{}{
                "room_id":      roomID,
                "matched_item": map[string]string{"id": itemID},
            },
        })
        h.broadcast(roomID, matchMsg)
        log.Printf("[Hub] MATCH in room %s for item %s", roomID, itemID)
    }
}

// broadcast sends to all conns in a room WITHOUT holding any lock.
func (h *Hub) broadcast(roomID string, data []byte) {
    h.mu.RLock()
    conns := make([]*connection, 0, len(h.rooms[roomID]))
    for _, c := range h.rooms[roomID] {
        conns = append(conns, c)
    }
    h.mu.RUnlock()

    for _, c := range conns {
        go c.send(data)
    }
}