package models

// HealthResponse mirrors the Express health endpoint payload.
type HealthResponse struct {
	Status    string `json:"status"`
	Tech      string `json:"tech"`
	Timestamp string `json:"timestamp"`
}

// ErrorResponse standardizes JSON errors.
type ErrorResponse struct {
	Error   string      `json:"error"`
	Details interface{} `json:"details,omitempty"`
}

// CSRFTokenResponse carries a freshly-minted token.
type CSRFTokenResponse struct {
	Token string `json:"csrfToken"`
}

// CSRFVerificationResponse is returned when the CSRF demo passes.
type CSRFVerificationResponse struct {
	Message    string `json:"message"`
	ReceivedAt string `json:"receivedAt"`
}
