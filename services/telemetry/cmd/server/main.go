package main

import (
	"fmt"
	"log"

	"github.com/iampmpksamy/6dainas-web/services/telemetry/internal/config"
	"github.com/iampmpksamy/6dainas-web/services/telemetry/internal/db"
	"github.com/iampmpksamy/6dainas-web/services/telemetry/internal/router"
	"github.com/labstack/echo/v4"
)

func main() {
	cfg := config.Load()

	db.Init(cfg.DBPath)
	log.Printf("telemetry: db at %s", cfg.DBPath)

	e := echo.New()
	e.HideBanner = true
	router.Setup(e, cfg.APIKey, cfg.AllowedOrigins)

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("telemetry: listening on %s", addr)
	if err := e.Start(addr); err != nil {
		e.Logger.Fatal(err)
	}
}
