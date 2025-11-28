package handlers

import (
	"errors"

	"github.com/gin-gonic/gin"
)

var ErrDemo = errors.New("demo error")

// DemoError intentionally surfaces an error handled by the global middleware.
func DemoError() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Error(ErrDemo) //nolint:errcheck // best effort demo
	}
}
