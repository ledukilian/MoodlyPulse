package handlers

import (
	"github.com/gin-gonic/gin"

	"github.com/moodlypulse/bff/internal/models"
	"github.com/moodlypulse/bff/internal/services/proxy"
)

// DemoProxy proxies the request to the Go backend's /private/demo endpoint.
func DemoProxy(service *proxy.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		result, err := service.DemoProxy(c.Request.Context(), authHeader)
		if err != nil {
			if upstreamErr, ok := proxy.IsUpstreamError(err); ok {
				c.JSON(upstreamErr.StatusCode, models.ErrorResponse{
					Error:   "Upstream service error",
					Details: upstreamErr.Body,
				})
				return
			}

			c.Error(err)
			return
		}

		c.Data(result.StatusCode, result.ContentType, result.Body)
	}
}
