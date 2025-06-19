### [⬅️ Retour au ReadMe principal](README.md)


## 🏗️ Structure du projet

```
moodlypulse-backend/
├── main.go                 # Point d'entrée
├── .env.example           # Exemple de configuration
├── config/
│   └── db.go              # Configuration PostgreSQL
├── controllers/
│   ├── auth_controller.go # Contrôleur authentification
│   └── entry_controller.go# Contrôleur entrées
├── models/
│   ├── user.go           # Modèle utilisateur
│   └── entry.go          # Modèle entrée quotidienne
├── routes/
│   └── router.go         # Configuration des routes
├── middleware/
│   └── auth.go           # Middleware d'authentification
├── utils/
│   └── jwt.go            # Utilitaires JWT
└── go.mod                # Dépendances Go
```

## 📝 Modèle de données

### User
- `id` (uint) - Clé primaire
- `email` (string) - Email unique
- `password` (string) - Mot de passe haché
- `created_at` (time) - Date de création

### DailyEntry
- `id` (uint) - Clé primaire
- `user_id` (uint) - Référence utilisateur
- `date` (time) - Date de l'entrée (unique par utilisateur)
- `mood` (int) - Humeur (1-5)
- `sleep_hours` (float32) - Heures de sommeil
- `water_cups` (int) - Verres d'eau
- `sport_min` (int) - Minutes de sport
- `note` (string) - Note libre (optionnelle)
- `created_at` / `updated_at` (time) - Timestamps


## 🔒 Sécurité

- Les mots de passe sont hachés avec bcrypt
- Authentification JWT avec expiration (24h)
- Middleware d'authentification sur toutes les routes protégées
- Vérification que chaque entrée appartient à l'utilisateur connecté
- CORS configuré pour les appels cross-origin


## 📚 Routes API

### Authentification

#### POST /auth/register
Inscription d'un nouvel utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /auth/login
Connexion utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Endpoints protégés

**Toutes les routes suivantes nécessitent un header d'authentification:**
```
Authorization: Bearer <jwt-token>
```

#### GET /me
Récupère les informations de l'utilisateur connecté.

#### GET /entries
Récupère la liste des entrées de l'utilisateur.

**Query parameters:**
- `date`: Filtre par date (format: YYYY-MM-DD)
- `start_date`: Date de début (format: YYYY-MM-DD)
- `end_date`: Date de fin (format: YYYY-MM-DD)

#### GET /entries/:id
Récupère une entrée spécifique.

#### POST /entries
Crée ou met à jour l'entrée du jour.

**Body:**
```json
{
  "date": "2024-01-15",
  "mood": 4,
  "sleep_hours": 7.5,
  "water_cups": 8,
  "sport_min": 30,
  "note": "Bonne journée !"
}
```

#### DELETE /entries/:id
Supprime une entrée.

#### GET /stats/summary
Récupère les statistiques de l'utilisateur.

**Response:**
```json
{
  "total_entries": 10,
  "average_mood": 3.8,
  "average_sleep": 7.2,
  "total_water_cups": 80,
  "total_sport_min": 300,
  "weekly_stats": {
    "average_mood": 4.0,
    "average_sleep": 7.5,
    "total_water_cups": 56,
    "total_sport_min": 210,
    "entries_count": 7
  },
  "monthly_stats": {
    "average_mood": 3.9,
    "average_sleep": 7.3,
    "total_water_cups": 240,
    "total_sport_min": 900,
    "entries_count": 30
  }
}
```

### [⬅️ Retour au ReadMe principal](README.md)