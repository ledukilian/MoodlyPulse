package config

import (
	"fmt"
	"log"
	"moodlypulse-backend/models"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error

	// Configuration PostgreSQL
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "postgres")
	password := getEnv("DB_PASSWORD", "root")
	dbname := getEnv("DB_NAME", "moodlypulse")
	sslmode := getEnv("DB_SSLMODE", "disable")

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode)

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to PostgreSQL database:", err)
	}

	// Auto migrate the schemas
	err = DB.AutoMigrate(&models.User{}, &models.DailyEntry{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("PostgreSQL database connected and migrated successfully")
}

// Helper function to get environment variables with default values
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
