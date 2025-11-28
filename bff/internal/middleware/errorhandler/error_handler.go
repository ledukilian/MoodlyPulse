package errorhandler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/moodlypulse/bff/internal/models"
)

// Middleware converts unhandled errors into consistent JSON responses.
func Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		err := c.Errors.Last()
		if err == nil || c.Writer.Written() {
			return
		}

		status := c.Writer.Status()
		if status < http.StatusBadRequest {
			status = http.StatusInternalServerError
		}

		log.Printf("[BFF][error] %v", err.Err)
		c.JSON(status, models.ErrorResponse{Error: "Internal Server Error", Details: err.Error()})
	}
}
