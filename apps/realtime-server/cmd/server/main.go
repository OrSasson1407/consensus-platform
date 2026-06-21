package main

import (
    "log"
    "net/http"

    "consensus-platform/apps/realtime-server/internal/config"
    "consensus-platform/apps/realtime-server/internal/handlers"
    "consensus-platform/apps/realtime-server/internal/matching"
    redisclient "consensus-platform/apps/realtime-server/internal/redis"
    "context"
)

func main() {
    cfg := config.Load()

    rc := redisclient.New(cfg.RedisAddr)
    if err := rc.Ping(context.Background()); err != nil {
        log.Fatalf("Redis connection failed: %v", err)
    }
    log.Println("Connected to Redis")

    hub := matching.NewHub(rc)

    http.HandleFunc("/ws", handlers.WebSocketHandler(hub))
    http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte(`{"status":"ok"}`))
    })

    log.Printf("Realtime server listening on :%s", cfg.Port)
    log.Fatal(http.ListenAndServe(":"+cfg.Port, nil))
}