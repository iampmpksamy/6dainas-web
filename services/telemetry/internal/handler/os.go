package handler

import (
	"net/http"

	"github.com/iampmpksamy/6dainas-web/services/telemetry/internal/db"
	"github.com/iampmpksamy/6dainas-web/services/telemetry/internal/model"
	"github.com/labstack/echo/v4"
)

// PostOSRegister receives onboarding data synced from 6DAiNAS-OS.
// Open endpoint — no API key required (data is non-sensitive registration info).
func PostOSRegister(c echo.Context) error {
	var r model.OSRegistration
	if err := c.Bind(&r); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
	}
	r.IPAddress = c.RealIP()

	if err := db.UpsertOSRegistration(&r); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "db error"})
	}
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}

// GetOSRegistrations returns all OS install registrations (protected).
func GetOSRegistrations(c echo.Context) error {
	rows, err := db.ListOSRegistrations()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "db error"})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":  rows,
		"total": len(rows),
	})
}
