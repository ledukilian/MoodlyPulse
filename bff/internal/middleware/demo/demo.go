package demo

import "github.com/gin-gonic/gin"

const demoFlagKey = "demoFlag"

// Middleware tags the request context similar to the Express demo middleware.
func Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set(demoFlagKey, true)
		c.Next()
	}
}
