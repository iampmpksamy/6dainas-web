package router

import (
	"github.com/iampmpksamy/6dainas-web/services/telemetry/internal/handler"
	mw "github.com/iampmpksamy/6dainas-web/services/telemetry/internal/middleware"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Setup(e *echo.Echo, apiKey string, allowedOrigins string) {
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{allowedOrigins},
		AllowMethods: []string{"GET", "POST", "OPTIONS"},
		AllowHeaders: []string{"Content-Type", "X-API-Key"},
	}))
	e.Use(middleware.RequestID())

	// ── Health (always open) ──────────────────────────────────────────────
	e.GET("/health", handler.Health)

	// ── Open ingest endpoints ─────────────────────────────────────────────
	v1 := e.Group("/api/v1")
	v1.POST("/os/register", handler.PostOSRegister)
	v1.POST("/web/event", handler.PostWebEvent)
	v1.POST("/web/lead", handler.PostWebLead)

	// ── Protected read endpoints ──────────────────────────────────────────
	protected := v1.Group("", mw.APIKey(apiKey))
	protected.GET("/stats", handler.GetStats)
	protected.GET("/os/registrations", handler.GetOSRegistrations)
	protected.GET("/web/events", handler.GetWebEvents)
	protected.GET("/web/leads", handler.GetWebLeads)
}
