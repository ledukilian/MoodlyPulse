package csrfmiddleware

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/moodlypulse/bff/internal/models"
	csrfsvc "github.com/moodlypulse/bff/internal/services/csrf"
)

type csrfPayload struct {
	Token string `json:"csrfToken"`
}

// Verify ensures the provided CSRF token matches the cookie value.
func Verify(service *csrfsvc.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		cookieToken, err := c.Cookie(csrfsvc.CookieName)
		if err != nil {
			c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "CSRF token missing"})
			c.Abort()
			return
		}

		providedToken := c.GetHeader("X-CSRF-Token")
		if providedToken == "" {
			var payload csrfPayload
			if err := c.ShouldBindJSON(&payload); err == nil {
				providedToken = payload.Token
			}
		}

		if !service.Validate(cookieToken, providedToken) {
			c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "CSRF token missing or invalid"})
			c.Abort()
			return
		}

		c.Next()
	}
}
