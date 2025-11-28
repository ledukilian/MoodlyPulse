package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/moodlypulse/bff/internal/models"
)

// Health returns metadata describing this BFF implementation.
func Health() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, models.HealthResponse{
			Status:    "ok",
			Tech:      "go",
			Timestamp: time.Now().UTC().Format(time.RFC3339),
		})
	}
}
