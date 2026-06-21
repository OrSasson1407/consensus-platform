package config

import "os"

type Config struct {
    Port      string
    RedisAddr string
    JWTSecret string
}

func Load() *Config {
    return &Config{
        Port:      getEnv("PORT", "8080"),
        RedisAddr: getEnv("REDIS_ADDR", "localhost:6379"),
        JWTSecret: getEnv("JWT_SECRET", "consensus-dev-secret-change-in-prod"),
    }
}

func getEnv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return fallback
}