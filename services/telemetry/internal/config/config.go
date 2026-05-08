package config

import "os"

type Config struct {
	Port       string
	DBPath     string
	APIKey     string
	AllowedOrigins string
}

func Load() *Config {
	return &Config{
		Port:           getenv("TELEMETRY_PORT", "7000"),
		DBPath:         getenv("TELEMETRY_DB", "/var/lib/6dainas-telemetry/telemetry.db"),
		APIKey:         os.Getenv("TELEMETRY_KEY"),
		AllowedOrigins: getenv("TELEMETRY_CORS_ORIGINS", "*"),
	}
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
