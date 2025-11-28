package csrf

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/hex"
)

const CookieName = "XSRF-TOKEN"

// Service encapsulates CSRF helpers. The secret is reserved for future HMAC-based tokens.
type Service struct {
	secret string
}

func New(secret string) *Service {
	return &Service{secret: secret}
}

// Generate returns a random 32-byte token encoded as hex.
func (s *Service) Generate() (string, error) {
	var bytes [32]byte
	if _, err := rand.Read(bytes[:]); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes[:]), nil
}

// Validate performs a timing-safe comparison.
func (s *Service) Validate(expected, provided string) bool {
	if expected == "" || provided == "" {
		return false
	}
	if len(expected) != len(provided) {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(expected), []byte(provided)) == 1
}
