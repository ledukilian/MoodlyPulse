
### [⬅️ Retour au ReadMe principal](README.md)

## 🚀 Démarrage rapide

### Prérequis
- Go 1.20 ou supérieur
- PostgreSQL 12+ (installé et en cours d'exécution)

### Installation

1. Cloner le projet
```bash
git clone <repository-url>
cd MoodlyPulse
cd backend
```

2. Configurer PostgreSQL
```bash
# Créer la base de données
createdb moodlypulse

# Ou via psql
psql -U postgres
CREATE DATABASE moodlypulse;
\q

# Ou manuellement via PgAdmin
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


## 🧪 Tester si l'API fonctionne

Vous pouvez tester l'API avec curl ou Postman :

```bash
# Health check
curl http://localhost:8080/health

# Ou via simple requête GET http://localhost:8080/health
```


### [⬅️ Retour au ReadMe principal](README.md)