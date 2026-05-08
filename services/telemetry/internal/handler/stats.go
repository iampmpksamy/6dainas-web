package handler

import (
	"net/http"
	"time"

	"github.com/iampmpksamy/6dainas-web/services/telemetry/internal/db"
	"github.com/iampmpksamy/6dainas-web/services/telemetry/internal/model"
	"github.com/labstack/echo/v4"
)

type kv struct {
	Key   string
	Count int64
}

func groupBy(m interface{}, field string) map[string]int64 {
	var rows []kv
	db.DB.Model(m).
		Select(field + " as key, count(*) as count").
		Group(field).
		Scan(&rows)
	out := make(map[string]int64, len(rows))
	for _, r := range rows {
		out[r.Key] = r.Count
	}
	return out
}

func countSince(m interface{}, since time.Time) int64 {
	var n int64
	db.DB.Model(m).Where("created_at >= ?", since).Count(&n)
	return n
}

func countOSSince(since time.Time) int64 {
	var n int64
	db.DB.Model(&model.OSRegistration{}).Where("installed_at >= ?", since).Count(&n)
	return n
}

// GetStats returns combined stats for OS installs, web events, and leads.
func GetStats(c echo.Context) error {
	now := time.Now().UTC()
	weekAgo := now.AddDate(0, 0, -7)
	monthAgo := now.AddDate(0, -1, 0)

	// ── OS stats ──────────────────────────────────────────────────────────
	var osTotal int64
	db.DB.Model(&model.OSRegistration{}).Count(&osTotal)

	osStats := map[string]interface{}{
		"total":         osTotal,
		"this_week":     countOSSince(weekAgo),
		"this_month":    countOSSince(monthAgo),
		"by_source":     groupBy(&model.OSRegistration{}, "source"),
		"by_experience": groupBy(&model.OSRegistration{}, "experience"),
		"by_payment":    groupBy(&model.OSRegistration{}, "payment"),
		"by_version":    groupBy(&model.OSRegistration{}, "version"),
	}

	// ── Web event stats ───────────────────────────────────────────────────
	var totalEvents int64
	db.DB.Model(&model.WebEvent{}).Count(&totalEvents)

	var totalPageviews int64
	db.DB.Model(&model.WebEvent{}).Where("event_type = ?", "pageview").Count(&totalPageviews)

	var uniqueSessions int64
	db.DB.Raw("SELECT COUNT(DISTINCT session_id) FROM web_events WHERE session_id != ''").Scan(&uniqueSessions)

	webStats := map[string]interface{}{
		"total_events":    totalEvents,
		"total_pageviews": totalPageviews,
		"unique_sessions": uniqueSessions,
		"this_week":       countSince(&model.WebEvent{}, weekAgo),
		"by_page":         groupBy(&model.WebEvent{}, "page"),
		"by_type":         groupBy(&model.WebEvent{}, "event_type"),
	}

	// ── Lead stats ────────────────────────────────────────────────────────
	var totalLeads int64
	db.DB.Model(&model.WebLead{}).Count(&totalLeads)

	leadStats := map[string]interface{}{
		"total":     totalLeads,
		"by_type":   groupBy(&model.WebLead{}, "lead_type"),
		"this_week": countSince(&model.WebLead{}, weekAgo),
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"os":    osStats,
		"web":   webStats,
		"leads": leadStats,
	})
}
