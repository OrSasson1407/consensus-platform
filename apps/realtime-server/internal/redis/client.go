package redis

import (
    "context"
    "log"
    "os"
    "github.com/redis/go-redis/v9"
)

var Client *redis.Client
var Ctx = context.Background()

func InitRedis() {
    redisURL := os.Getenv("REDIS_URL")
    if redisURL == "" {
        redisURL = "localhost:6379"
    }
    Client = redis.NewClient(&redis.Options{
        Addr: redisURL,
    })

    _, err := Client.Ping(Ctx).Result()
    if err != nil {
        log.Printf("Redis not detected, using in-memory fallback. (Error: %v)", err)
        return
    }
    log.Println("Connected to Redis successfully")
}
