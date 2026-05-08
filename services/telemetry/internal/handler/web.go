package handler

import (
	"net/http"

	"github.com/iampmpksamy/6dainas-web/services/telemetry/internal/db"
	"github.com/iampmpksamy/6dainas-web/services/telemetry/internal/model"
	"github.com/labstack/echo/v4"
)

// PostWebEvent records a page view, download, click, or custom event
// fired from the 6dainas.cloud website. Open endpoint.
func PostWebEvent(c echo.Context) error {
	var e model.WebEvent
	if err := c.Bind(&e); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
	}
	if e.EventType == "" {
		e.EventType = "pageview"
	}
	e.IPAddress = c.RealIP()
	e.UserAgent = c.Request().UserAgent()

	if err := db.SaveWebEvent(&e); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "db error"})
	}
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}

// GetWebEvents returns recent web events (protected).
func GetWebEvents(c echo.Context) error {
	rows, err := db.ListWebEvents(500)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "db error"})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":  rows,
		"total": len(rows),
	})
}

// PostWebLead captures a newsletter signup, contact form, or waitlist entry. Open endpoint.
func PostWebLead(c echo.Context) error {
	var l model.WebLead
	if err := c.Bind(&l); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
	}
	if l.Email == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "email required"})
	}
	if l.LeadType == "" {
		l.LeadType = "newsletter"
	}
	l.IPAddress = c.RealIP()

	if err := db.SaveWebLead(&l); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "db error"})
	}
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}

// GetWebLeads returns all leads (protected).
func GetWebLeads(c echo.Context) error {
	rows, err := db.ListWebLeads()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "db error"})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":  rows,
		"total": len(rows),
	})
}
