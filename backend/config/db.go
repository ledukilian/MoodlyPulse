package config

import (
	"fmt"
	"log"
	"moodlypulse-backend/models"
	"os"
	"strings"

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

	// Manual migration to handle the username to nom/prenom transition
	migrateUsernameToNomPrenom()

	// Auto migrate the schemas
	err = DB.AutoMigrate(&models.User{}, &models.DailyEntry{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Migrate existing users to have nom and prenom
	migrateExistingUsers()

	log.Println("PostgreSQL database connected and migrated successfully")
}

// migrateExistingUsers adds nom and prenom to existing users based on their email
func migrateExistingUsers() {
	var users []models.User
	if err := DB.Where("nom = '' OR nom IS NULL").Find(&users).Error; err != nil {
		log.Printf("Error finding users without nom: %v", err)
		return
	}

	for _, user := range users {
		// Generate nom and prenom from email
		nom, prenom := generateNomPrenomFromEmail(user.Email)

		// Update user with nom and prenom
		if err := DB.Model(&user).Updates(map[string]interface{}{
			"nom":    nom,
			"prenom": prenom,
		}).Error; err != nil {
			log.Printf("Error updating user %d with nom/prenom: %v", user.ID, err)
		} else {
			log.Printf("Updated user %d with nom: %s, prenom: %s", user.ID, nom, prenom)
		}
	}
}

// generateNomPrenomFromEmail creates nom and prenom from email
func generateNomPrenomFromEmail(email string) (string, string) {
	// Remove domain part
	localPart := strings.Split(email, "@")[0]

	// Split by common separators
	parts := strings.FieldsFunc(localPart, func(r rune) bool {
		return r == '.' || r == '_' || r == '-' || r == '+'
	})

	var nom, prenom string

	if len(parts) >= 2 {
		// Use first part as prenom, second as nom
		prenom = strings.Title(strings.ToLower(parts[0]))
		nom = strings.Title(strings.ToLower(parts[1]))
	} else if len(parts) == 1 {
		// Use the single part as prenom, set nom to "Utilisateur"
		prenom = strings.Title(strings.ToLower(parts[0]))
		nom = "Utilisateur"
	} else {
		// Fallback
		prenom = "Utilisateur"
		nom = "Utilisateur"
	}

	// Ensure reasonable length
	if len(prenom) > 50 {
		prenom = prenom[:50]
	}
	if len(nom) > 50 {
		nom = nom[:50]
	}

	return nom, prenom
}

// Helper function to get environment variables with default values
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// migrateUsernameToNomPrenom handles the transition from username to nom/prenom
func migrateUsernameToNomPrenom() {
	// Check if username column exists
	var count int64
	DB.Raw("SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'username'").Scan(&count)

	if count > 0 {
		log.Println("Migrating from username to nom/prenom...")

		// Add nom and prenom columns if they don't exist
		DB.Exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS nom VARCHAR(50)")
		DB.Exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS prenom VARCHAR(50)")

		// Update existing users with nom and prenom based on username
		DB.Exec(`
			UPDATE users 
			SET nom = 'Utilisateur', prenom = username 
			WHERE (nom IS NULL OR nom = '') AND username IS NOT NULL
		`)

		// Remove the username column
		DB.Exec("ALTER TABLE users DROP COLUMN IF EXISTS username")

		log.Println("Migration from username to nom/prenom completed")
	}
}
