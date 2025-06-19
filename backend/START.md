
### [⬅️ Retour au ReadMe principal](README.md)

## 🚀 Démarrage rapide

### Prérequis
- Go 1.20 ou supérieur
- PostgreSQL 12+ (installé et en cours d'exécution)

### Installation

1. Cloner le projet
```bash
git clone <repository-url>
cd moodlypulse-backend
```

2. Configurer PostgreSQL
```bash
# Créer la base de données
createdb moodlypulse

# Ou via psql
psql -U postgres
CREATE DATABASE moodlypulse;
\q
```

3. Configurer les variables d'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos paramètres PostgreSQL
```

4. Installer les dépendances
```bash
go mod download
```

5. Démarrer le serveur
```bash
go run main.go
```

Le serveur démarre sur le port 8080.


## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=moodlypulse
DB_SSLMODE=disable

# JWT Secret (IMPORTANT: changez cette valeur en production)
JWT_SECRET=your-super-secret-jwt-key
```

### Configuration PostgreSQL

L'application se connecte automatiquement à PostgreSQL avec les paramètres définis dans les variables d'environnement. Si aucune variable n'est définie, les valeurs par défaut sont utilisées :

- **Host**: localhost
- **Port**: 5432
- **User**: postgres
- **Password**: password
- **Database**: moodlypulse
- **SSL Mode**: disable


## 🧪 Tester l'API

Vous pouvez tester l'API avec curl ou Postman :

```bash
# Health check
curl http://localhost:8080/health

# Inscription
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Connexion
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Créer une entrée (remplacez TOKEN par le JWT reçu)
curl -X POST http://localhost:8080/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"date":"2024-01-15","mood":4,"sleep_hours":7.5,"water_cups":8,"sport_min":30,"note":"Bonne journée!"}'
```


### [⬅️ Retour au ReadMe principal](README.md)