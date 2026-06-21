package redisclient

import (
    "context"
    "encoding/json"
    "fmt"

    "github.com/redis/go-redis/v9"
)

type Client struct {
    rdb *redis.Client
}

func New(addr string) *Client {
    return &Client{
        rdb: redis.NewClient(&redis.Options{Addr: addr}),
    }
}

func (c *Client) Ping(ctx context.Context) error {
    return c.rdb.Ping(ctx).Err()
}

// RecordSwipe stores a user swipe and returns true if ALL members have liked this item.
func (c *Client) RecordSwipe(ctx context.Context, roomID, userID, itemID, status string) (bool, error) {
    if status != "LIKE" && status != "SUPERLIKE" {
        return false, nil
    }

    likeKey := fmt.Sprintf("room:%s:item:%s:likes", roomID, itemID)
    c.rdb.SAdd(ctx, likeKey, userID)
    c.rdb.Expire(ctx, likeKey, 24*60*60*1000000000)

    membersKey := fmt.Sprintf("room:%s:members", roomID)
    members, err := c.rdb.SMembers(ctx, membersKey).Result()
    if err != nil || len(members) == 0 {
        return false, err
    }

    likes, err := c.rdb.SCard(ctx, likeKey).Result()
    if err != nil {
        return false, err
    }

    return likes >= int64(len(members)), nil
}

// AddMember registers a user to a room in Redis.
func (c *Client) AddMember(ctx context.Context, roomID, userID string) error {
    key := fmt.Sprintf("room:%s:members", roomID)
    return c.rdb.SAdd(ctx, key, userID).Err()
}

// GetRoomMembers returns all member IDs for a room.
func (c *Client) GetRoomMembers(ctx context.Context, roomID string) ([]string, error) {
    key := fmt.Sprintf("room:%s:members", roomID)
    return c.rdb.SMembers(ctx, key).Result()
}

// SetJSON stores an arbitrary JSON-serialisable value.
func (c *Client) SetJSON(ctx context.Context, key string, value interface{}) error {
    b, err := json.Marshal(value)
    if err != nil {
        return err
    }
    return c.rdb.Set(ctx, key, b, 0).Err()
}