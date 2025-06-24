package main

import (
	"moodlypulse-backend/config"
	"moodlypulse-backend/routes"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	config.InitDB()

	// Set Gin mode
	gin.SetMode(gin.ReleaseMode)

	// Initialize router
	r := routes.SetupRouter()

	// Start server
	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}