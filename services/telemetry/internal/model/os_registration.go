package model

import "time"

// OSRegistration stores 6DAiNAS-OS onboarding data synced from the local machine.
// Upserted by device_id so re-installs update the existing row rather than duplicate.
type OSRegistration struct {
	ID          uint      `gorm:"primaryKey;autoIncrement"   json:"id"`
	DeviceID    string    `gorm:"uniqueIndex;size:64"         json:"device_id"`
	Name        string    `gorm:"size:255"                    json:"name"`
	Email       string    `gorm:"size:255;index"              json:"email"`
	Profession  string    `gorm:"size:512"                    json:"profession"`
	Experience  string    `gorm:"size:255"                    json:"experience"`
	Source      string    `gorm:"size:255"                    json:"source"`
	Usage       string    `gorm:"size:512"                    json:"usage"`
	Payment     string    `gorm:"size:255"                    json:"payment"`
	Feature     string    `gorm:"size:1024"                   json:"feature"`
	Version     string    `gorm:"size:64"                     json:"version"`
	IPAddress   string    `gorm:"size:64"                     json:"ip_address"`
	InstalledAt time.Time `                                   json:"installed_at"`
	SyncedAt    time.Time `gorm:"autoUpdateTime"              json:"synced_at"`
}
