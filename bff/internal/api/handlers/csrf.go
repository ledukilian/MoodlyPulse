package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/moodlypulse/bff/configs"
	"github.com/moodlypulse/bff/internal/models"
	csrfsvc "github.com/moodlypulse/bff/internal/services/csrf"
)

// CSRFToken issues a cookie + JSON payload containing the new CSRF token.
func CSRFToken(service *csrfsvc.Service, cfg configs.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := service.Generate()
		if err != nil {
			c.Error(err)
			return
		}

		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie(
			csrfsvc.CookieName,
			token,
			60*60,
			"/",
			"",
			cfg.IsProduction(),
			true,
		)

		c.JSON(http.StatusOK, models.CSRFTokenResponse{Token: token})
	}
}

// CSRFDemo echoes the success payload used by the Express implementation.
func CSRFDemo() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, models.CSRFVerificationResponse{
			Message:    "CSRF OK",
			ReceivedAt: time.Now().UTC().Format(time.RFC3339),
		})
	}
}
