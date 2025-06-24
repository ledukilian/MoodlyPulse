package models

import (
	"time"

	"gorm.io/gorm"
)

type DailyEntry struct {
	ID         uint           `json:"id" gorm:"primaryKey"`
	UserID     uint           `json:"user_id" gorm:"index;not null"`
	Date       time.Time      `json:"date" gorm:"not null;uniqueIndex:idx_user_date"`
	Mood       int            `json:"mood" gorm:"check:mood >= 1 AND mood <= 5"`
	SleepHours float32        `json:"sleep_hours" gorm:"not null"`
	WaterCups  int            `json:"water_cups" gorm:"not null"`
	SportMin   int            `json:"sport_min" gorm:"not null"`
	Note       string         `json:"note" gorm:"type:text"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`
	User       User           `json:"-" gorm:"foreignKey:UserID"`
}

type CreateEntryRequest struct {
	Date       string  `json:"date" binding:"required"` // Format: YYYY-MM-DD
	Mood       int     `json:"mood" binding:"required,min=1,max=5"`
	SleepHours float32 `json:"sleep_hours" binding:"required,min=0,max=24"`
	WaterCups  int     `json:"water_cups" binding:"required,min=0"`
	SportMin   int     `json:"sport_min" binding:"required,min=0"`
	Note       string  `json:"note"`
}

type StatsResponse struct {
	TotalEntries   int64   `json:"total_entries"`
	AverageMood    float64 `json:"average_mood"`
	AverageSleep   float64 `json:"average_sleep"`
	TotalWaterCups int64   `json:"total_water_cups"`
	TotalSportMin  int64   `json:"total_sport_min"`
	CurrentStreak  int     `json:"current_streak"`
	WeeklyStats    Stats   `json:"weekly_stats"`
	MonthlyStats   Stats   `json:"monthly_stats"`
}

type Stats struct {
	AverageMood    float64 `json:"average_mood"`
	AverageSleep   float64 `json:"average_sleep"`
	TotalWaterCups int64   `json:"total_water_cups"`
	TotalSportMin  int64   `json:"total_sport_min"`
	EntriesCount   int64   `json:"entries_count"`
}
