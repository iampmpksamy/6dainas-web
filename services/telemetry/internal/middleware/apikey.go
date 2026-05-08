package middleware

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// APIKey returns a middleware that enforces X-API-Key authentication.
// If key is empty the middleware is a no-op (useful during local dev).
func APIKey(key string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if key == "" {
				return next(c)
			}
			if c.Request().Header.Get("X-API-Key") != key {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
			}
			return next(c)
		}
	}
}
