package redisclient

import (
    "context"
    "fmt"
    "time"

    "github.com/redis/go-redis/v9"
)

const roomTTL = 24 * time.Hour

type Client struct {
    rdb *redis.Client
}

func New(addr string) *Client {
    return &Client{
        rdb: redis.NewClient(&redis.Options{
            Addr:         addr,
            DialTimeout:  5 * time.Second,
            ReadTimeout:  3 * time.Second,
            WriteTimeout: 3 * time.Second,
        }),
    }
}

func (c *Client) Ping(ctx context.Context) error {
    return c.rdb.Ping(ctx).Err()
}

func (c *Client) AddMember(ctx context.Context, roomID, userID string) error {
    key := fmt.Sprintf("room:%s:members", roomID)
    pipe := c.rdb.Pipeline()
    pipe.SAdd(ctx, key, userID)
    pipe.Expire(ctx, key, roomTTL)
    _, err := pipe.Exec(ctx)
    return err
}

func (c *Client) RemoveMember(ctx context.Context, roomID, userID string) error {
    return c.rdb.SRem(ctx, fmt.Sprintf("room:%s:members", roomID), userID).Err()
}

func (c *Client) GetMemberCount(ctx context.Context, roomID string) (int64, error) {
    return c.rdb.SCard(ctx, fmt.Sprintf("room:%s:members", roomID)).Result()
}

// RecordSwipe records a LIKE/SUPERLIKE and returns true when all members liked.
func (c *Client) RecordSwipe(ctx context.Context, roomID, userID, itemID, status string) (bool, error) {
    if status != "LIKE" && status != "SUPERLIKE" {
        return false, nil
    }
    likeKey := fmt.Sprintf("room:%s:item:%s:likes", roomID, itemID)
    membersKey := fmt.Sprintf("room:%s:members", roomID)

    pipe := c.rdb.Pipeline()
    pipe.SAdd(ctx, likeKey, userID)
    pipe.Expire(ctx, likeKey, roomTTL)
    if _, err := pipe.Exec(ctx); err != nil {
        return false, err
    }

    memberCount, err := c.rdb.SCard(ctx, membersKey).Result()
    if err != nil || memberCount == 0 {
        return false, err
    }
    likeCount, err := c.rdb.SCard(ctx, likeKey).Result()
    if err != nil {
        return false, err
    }
    return likeCount >= memberCount, nil
}