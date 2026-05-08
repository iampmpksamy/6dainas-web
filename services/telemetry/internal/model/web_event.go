package model

import "time"

// WebEvent records a single analytics event from the 6dainas.cloud website.
// EventType examples: pageview, download, click, signup, purchase.
// Props holds arbitrary JSON metadata (product name, variant, price, etc.).
type WebEvent struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	EventType string    `gorm:"size:64;index"            json:"event_type"`
	Page      string    `gorm:"size:512;index"           json:"page"`
	Referrer  string    `gorm:"size:512"                 json:"referrer"`
	SessionID string    `gorm:"size:64;index"            json:"session_id"`
	Country   string    `gorm:"size:8"                   json:"country"`
	IPAddress string    `gorm:"size:64"                  json:"ip_address"`
	UserAgent string    `gorm:"size:512"                 json:"user_agent"`
	Props     string    `gorm:"type:text"                json:"props"`
	CreatedAt time.Time `gorm:"index"                    json:"created_at"`
}
