package controllers

import (
	"moodlypulse-backend/config"
	"moodlypulse-backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetEntries(c *gin.Context) {
	userID := c.GetUint("user_id")

	var entries []models.DailyEntry
	query := config.DB.Where("user_id = ?", userID)

	// Filter by date if provided
	if dateStr := c.Query("date"); dateStr != "" {
		if date, err := time.Parse("2006-01-02", dateStr); err == nil {
			query = query.Where("DATE(date) = DATE(?)", date)
		}
	}

	// Filter by date range if provided
	if startDate := c.Query("start_date"); startDate != "" {
		if date, err := time.Parse("2006-01-02", startDate); err == nil {
			query = query.Where("date >= ?", date)
		}
	}

	if endDate := c.Query("end_date"); endDate != "" {
		if date, err := time.Parse("2006-01-02", endDate); err == nil {
			query = query.Where("date <= ?", date)
		}
	}

	if err := query.Order("date DESC").Find(&entries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch entries"})
		return
	}

	c.JSON(http.StatusOK, entries)
}

func GetEntry(c *gin.Context) {
	userID := c.GetUint("user_id")
	entryID := c.Param("id")

	var entry models.DailyEntry
	if err := config.DB.Where("id = ? AND user_id = ?", entryID, userID).First(&entry).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Entry not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch entry"})
		return
	}

	c.JSON(http.StatusOK, entry)
}

func CreateOrUpdateEntry(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req models.CreateEntryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse date
	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	// Check if entry exists for this date
	var entry models.DailyEntry
	err = config.DB.Where("user_id = ? AND DATE(date) = DATE(?)", userID, date).First(&entry).Error

	if err == gorm.ErrRecordNotFound {
		// Create new entry
		entry = models.DailyEntry{
			UserID:     userID,
			Date:       date,
			Mood:       req.Mood,
			SleepHours: req.SleepHours,
			WaterCups:  req.WaterCups,
			SportMin:   req.SportMin,
			Note:       req.Note,
		}

		if err := config.DB.Create(&entry).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create entry"})
			return
		}

		c.JSON(http.StatusCreated, entry)
	} else if err == nil {
		// Update existing entry
		entry.Mood = req.Mood
		entry.SleepHours = req.SleepHours
		entry.WaterCups = req.WaterCups
		entry.SportMin = req.SportMin
		entry.Note = req.Note

		if err := config.DB.Save(&entry).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update entry"})
			return
		}

		c.JSON(http.StatusOK, entry)
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
	}
}

func DeleteEntry(c *gin.Context) {
	userID := c.GetUint("user_id")
	entryID := c.Param("id")

	var entry models.DailyEntry
	if err := config.DB.Where("id = ? AND user_id = ?", entryID, userID).First(&entry).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Entry not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch entry"})
		return
	}

	if err := config.DB.Delete(&entry).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete entry"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Entry deleted successfully"})
}

func GetStats(c *gin.Context) {
	userID := c.GetUint("user_id")

	var stats models.StatsResponse

	// Get all time stats
	var totalEntries int64
	var totalMood, totalSleep float64
	var totalWater, totalSport int64

	config.DB.Model(&models.DailyEntry{}).Where("user_id = ?", userID).Count(&totalEntries)

	if totalEntries > 0 {
		config.DB.Model(&models.DailyEntry{}).Where("user_id = ?", userID).
			Select("AVG(mood) as avg_mood, AVG(sleep_hours) as avg_sleep, SUM(water_cups) as total_water, SUM(sport_min) as total_sport").
			Scan(&struct {
				AvgMood    float64 `json:"avg_mood"`
				AvgSleep   float64 `json:"avg_sleep"`
				TotalWater int64   `json:"total_water"`
				TotalSport int64   `json:"total_sport"`
			}{
				AvgMood:    totalMood,
				AvgSleep:   totalSleep,
				TotalWater: totalWater,
				TotalSport: totalSport,
			})
	}

	stats.TotalEntries = totalEntries
	stats.AverageMood = totalMood
	stats.AverageSleep = totalSleep
	stats.TotalWaterCups = totalWater
	stats.TotalSportMin = totalSport

	// Get weekly stats (last 7 days)
	weekAgo := time.Now().AddDate(0, 0, -7)
	var weeklyStats models.Stats
	var weeklyEntries int64

	config.DB.Model(&models.DailyEntry{}).Where("user_id = ? AND date >= ?", userID, weekAgo).Count(&weeklyEntries)

	if weeklyEntries > 0 {
		config.DB.Model(&models.DailyEntry{}).Where("user_id = ? AND date >= ?", userID, weekAgo).
			Select("AVG(mood) as avg_mood, AVG(sleep_hours) as avg_sleep, SUM(water_cups) as total_water, SUM(sport_min) as total_sport").
			Scan(&struct {
				AvgMood    float64 `json:"avg_mood"`
				AvgSleep   float64 `json:"avg_sleep"`
				TotalWater int64   `json:"total_water"`
				TotalSport int64   `json:"total_sport"`
			}{
				AvgMood:    weeklyStats.AverageMood,
				AvgSleep:   weeklyStats.AverageSleep,
				TotalWater: weeklyStats.TotalWaterCups,
				TotalSport: weeklyStats.TotalSportMin,
			})
	}

	weeklyStats.EntriesCount = weeklyEntries
	stats.WeeklyStats = weeklyStats

	// Get monthly stats (last 30 days)
	monthAgo := time.Now().AddDate(0, 0, -30)
	var monthlyStats models.Stats
	var monthlyEntries int64

	config.DB.Model(&models.DailyEntry{}).Where("user_id = ? AND date >= ?", userID, monthAgo).Count(&monthlyEntries)

	if monthlyEntries > 0 {
		config.DB.Model(&models.DailyEntry{}).Where("user_id = ? AND date >= ?", userID, monthAgo).
			Select("AVG(mood) as avg_mood, AVG(sleep_hours) as avg_sleep, SUM(water_cups) as total_water, SUM(sport_min) as total_sport").
			Scan(&struct {
				AvgMood    float64 `json:"avg_mood"`
				AvgSleep   float64 `json:"avg_sleep"`
				TotalWater int64   `json:"total_water"`
				TotalSport int64   `json:"total_sport"`
			}{
				AvgMood:    monthlyStats.AverageMood,
				AvgSleep:   monthlyStats.AverageSleep,
				TotalWater: monthlyStats.TotalWaterCups,
				TotalSport: monthlyStats.TotalSportMin,
			})
	}

	monthlyStats.EntriesCount = monthlyEntries
	stats.MonthlyStats = monthlyStats

	c.JSON(http.StatusOK, stats)
}
