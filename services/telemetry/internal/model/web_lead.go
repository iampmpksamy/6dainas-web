package model

import "time"

// WebLead captures newsletter signups, contact form submissions, and
// other opt-in actions from the 6dainas.cloud website.
// LeadType: "newsletter" | "contact" | "waitlist" | "demo"
type WebLead struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	LeadType  string    `gorm:"size:32;index"            json:"lead_type"`
	Name      string    `gorm:"size:255"                 json:"name"`
	Email     string    `gorm:"size:255;index"           json:"email"`
	Message   string    `gorm:"type:text"                json:"message"`
	IPAddress string    `gorm:"size:64"                  json:"ip_address"`
	CreatedAt time.Time `gorm:"index"                    json:"created_at"`
}
