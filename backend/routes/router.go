package routes

import (
	"moodlypulse-backend/controllers"
	"moodlypulse-backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Add CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	})

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"message": "MoodlyPulse API is running",
		})
	})

	// Auth routes (no authentication required)
	auth := r.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
	}

	// Protected routes (authentication required)
	api := r.Group("/")
	api.Use(middleware.AuthMiddleware())
	{
		api.GET("/me", controllers.GetMe)
		api.GET("/entries", controllers.GetEntries)
		api.GET("/entries/:id", controllers.GetEntry)
		api.POST("/entries", controllers.CreateOrUpdateEntry)
		api.DELETE("/entries/:id", controllers.DeleteEntry)
		api.GET("/stats/summary", controllers.GetStats)
	}

	return r
}