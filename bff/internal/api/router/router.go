package router

import (
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/moodlypulse/bff/configs"
	"github.com/moodlypulse/bff/internal/api/handlers"
	csrfmiddleware "github.com/moodlypulse/bff/internal/middleware/csrf"
	"github.com/moodlypulse/bff/internal/middleware/demo"
	"github.com/moodlypulse/bff/internal/middleware/errorhandler"
	"github.com/moodlypulse/bff/internal/middleware/logger"
	"github.com/moodlypulse/bff/internal/services/csrf"
	"github.com/moodlypulse/bff/internal/services/proxy"
	"github.com/moodlypulse/bff/pkg/httpclient"
)

// New wires the HTTP server, middleware, and handlers together.
func New(cfg configs.Config) *gin.Engine {
	if cfg.IsProduction() {
		gin.SetMode(gin.ReleaseMode)
	}

	engine := gin.New()
	engine.Use(gin.Recovery())

	corsConfig := cors.Config{
		AllowOrigins:     []string{cfg.CorsOrigin},
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodOptions},
		AllowHeaders:     []string{"Content-Type", "Authorization", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	engine.Use(cors.New(corsConfig))
	engine.Use(logger.Middleware())
	engine.Use(demo.Middleware())
	engine.Use(errorhandler.Middleware())

	httpClient := httpclient.New(10 * time.Second)
	proxyService := proxy.New(httpClient, cfg.BackendURL)
	csrfService := csrf.New(cfg.CSRFSecret)

	engine.GET("/health", handlers.Health())
	engine.GET("/api/demo/proxy", handlers.DemoProxy(proxyService))
	engine.GET("/csrf/token", handlers.CSRFToken(csrfService, cfg))
	engine.POST("/demo/csrf", csrfmiddleware.Verify(csrfService), handlers.CSRFDemo())
	engine.GET("/demo/error", handlers.DemoError())

	return engine
}
