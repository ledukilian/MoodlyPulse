package configs

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"sync"
)

// Config mirrors the previous Express configuration while remaining strongly typed.
type Config struct {
	Port       int
	BackendURL string
	CorsOrigin string
	CSRFSecret string
	Env        string
}

var (
	cached Config
	once   sync.Once
	cfgErr error
)

// Load reads environment variables only once to avoid repeated parsing.
func Load() (Config, error) {
	once.Do(func() {
		backendURL := strings.TrimSpace(os.Getenv("BACKEND_GO_URL"))
		if backendURL == "" {
			cfgErr = fmt.Errorf("BACKEND_GO_URL environment variable is required")
			return
		}

		backendURL = strings.TrimSuffix(backendURL, "/")

		port := parsePort(os.Getenv("BFF_PORT"))
		corsOrigin := os.Getenv("BFF_CORS_ORIGIN")
		if corsOrigin == "" {
			corsOrigin = "http://localhost:4200"
		}

		cached = Config{
			Port:       port,
			BackendURL: backendURL,
			CorsOrigin: corsOrigin,
			CSRFSecret: os.Getenv("CSRF_SECRET"),
			Env:        fallback(os.Getenv("NODE_ENV"), "development"),
		}
	})

	return cached, cfgErr
}

func parsePort(raw string) int {
	if raw == "" {
		return 4000
	}
	if port, err := strconv.Atoi(raw); err == nil && port > 0 {
		return port
	}
	return 4000
}

func fallback(value, defaultValue string) string {
	if strings.TrimSpace(value) == "" {
		return defaultValue
	}
	return value
}

// IsProduction returns true when NODE_ENV is set to production.
func (c Config) IsProduction() bool {
	return strings.EqualFold(c.Env, "production")
}
