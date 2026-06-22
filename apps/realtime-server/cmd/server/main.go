package main

import (
    "context"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "consensus-realtime/internal/config"
    "consensus-realtime/internal/handlers"
    "consensus-realtime/internal/matching"
    redisclient "consensus-realtime/internal/redis"
)

func main() {
    cfg := config.Load()

    rc := redisclient.New(cfg.RedisAddr)
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := rc.Ping(ctx); err != nil {
        log.Fatalf("[Main] Redis unavailable at %s: %v", cfg.RedisAddr, err)
    }
    log.Printf("[Main] Redis connected at %s", cfg.RedisAddr)

    hub := matching.NewHub(rc)

    mux := http.NewServeMux()
    mux.HandleFunc("/ws", handlers.WebSocketHandler(hub))
    mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(`{"status":"ok"}`))
    })

    srv := &http.Server{
        Addr:         ":" + cfg.Port,
        Handler:      mux,
        ReadTimeout:  10 * time.Second,
        WriteTimeout: 10 * time.Second,
    }

    go func() {
        log.Printf("[Main] Realtime server on :%s", cfg.Port)
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("[Main] Server error: %v", err)
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    log.Println("[Main] Shutting down...")
    shutCtx, shutCancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer shutCancel()
    srv.Shutdown(shutCtx)
}