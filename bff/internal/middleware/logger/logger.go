package logger

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

// Middleware logs the lifecycle of each request including latency and status.
func Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		duration := time.Since(start)
		log.Printf("[BFF][req] %s %s -> %d (%.2f ms)", c.Request.Method, c.Request.URL.Path, c.Writer.Status(), float64(duration.Microseconds())/1000)
	}
}
