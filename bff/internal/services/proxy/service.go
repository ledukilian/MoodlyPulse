package proxy

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"path"
)

// Result mirrors the upstream payload and metadata.
type Result struct {
	StatusCode  int
	ContentType string
	Body        []byte
}

// Service proxies calls to the Go backend.
type Service struct {
	client     *http.Client
	backendURL string
}

func New(client *http.Client, backendURL string) *Service {
	return &Service{client: client, backendURL: backendURL}
}

// DemoProxy performs the GET request to /private/demo.
func (s *Service) DemoProxy(ctx context.Context, authHeader string) (*Result, error) {
	endpoint := s.backendURL + path.Clean("/private/demo")
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}
	if authHeader != "" {
		req.Header.Set("Authorization", authHeader)
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	contentType := resp.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	if resp.StatusCode >= 400 {
		return nil, &UpstreamError{StatusCode: resp.StatusCode, Body: string(body)}
	}

	return &Result{StatusCode: resp.StatusCode, ContentType: contentType, Body: body}, nil
}

// UpstreamError captures non-2xx responses.
type UpstreamError struct {
	StatusCode int
	Body       string
}

func (e *UpstreamError) Error() string {
	return fmt.Sprintf("upstream error (%d): %s", e.StatusCode, e.Body)
}

// IsUpstreamError helps with error assertions.
func IsUpstreamError(err error) (*UpstreamError, bool) {
	var upstreamErr *UpstreamError
	if errors.As(err, &upstreamErr) {
		return upstreamErr, true
	}
	return nil, false
}
