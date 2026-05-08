package db

import (
	"fmt"
	"sync"
	"time"

	"github.com/glebarez/sqlite"
	"github.com/iampmpksamy/6dainas-web/services/telemetry/internal/model"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	DB   *gorm.DB
	once sync.Once
)

func Init(dbPath string) {
	once.Do(func() {
		db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Warn),
		})
		if err != nil {
			panic(fmt.Sprintf("telemetry: failed to open db at %s: %v", dbPath, err))
		}

		sql, _ := db.DB()
		sql.SetMaxOpenConns(1)
		db.Exec("PRAGMA journal_mode=WAL")
		db.Exec("PRAGMA busy_timeout=5000")

		if err := db.AutoMigrate(
			&model.OSRegistration{},
			&model.WebEvent{},
			&model.WebLead{},
		); err != nil {
			panic(fmt.Sprintf("telemetry: AutoMigrate failed: %v", err))
		}

		DB = db
	})
}

// UpsertOSRegistration inserts or updates by device_id.
// When device_id is empty a new row is always inserted.
func UpsertOSRegistration(r *model.OSRegistration) error {
	if r.DeviceID != "" {
		var existing model.OSRegistration
		if DB.Where("device_id = ?", r.DeviceID).First(&existing).Error == nil {
			r.ID = existing.ID
			r.InstalledAt = existing.InstalledAt
			return DB.Save(r).Error
		}
	}
	r.InstalledAt = time.Now().UTC()
	return DB.Create(r).Error
}

// ListOSRegistrations returns all rows newest-first.
func ListOSRegistrations() ([]model.OSRegistration, error) {
	var rows []model.OSRegistration
	err := DB.Order("installed_at desc").Find(&rows).Error
	return rows, err
}

// SaveWebEvent inserts a new web analytics event.
func SaveWebEvent(e *model.WebEvent) error {
	e.CreatedAt = time.Now().UTC()
	return DB.Create(e).Error
}

// ListWebEvents returns recent events newest-first.
func ListWebEvents(limit int) ([]model.WebEvent, error) {
	var rows []model.WebEvent
	err := DB.Order("created_at desc").Limit(limit).Find(&rows).Error
	return rows, err
}

// SaveWebLead inserts a new lead capture.
func SaveWebLead(l *model.WebLead) error {
	l.CreatedAt = time.Now().UTC()
	return DB.Create(l).Error
}

// ListWebLeads returns all leads newest-first.
func ListWebLeads() ([]model.WebLead, error) {
	var rows []model.WebLead
	err := DB.Order("created_at desc").Find(&rows).Error
	return rows, err
}
