![MoodlyPulse Banner](../MoodlyPulse_ReadMe_Header.png)


### [⬅️ Retour au ReadMe principal](README.md)

## 🚀 Démarrage rapide

### Prérequis
- **Node.js 18+** et npm
- **Angular CLI** (installé globalement)
- **Backend MoodlyPulse** en cours d'exécution sur le port 8080

### Installation

1. Cloner le projet
```bash
git clone <repository-url>
cd MoodlyPulse
cd frontend
```

2. Installer les dépendances
```bash
npm install
```

3. Démarrer le serveur de développement
```bash
npm start
# ou
ng serve
```

L'application démarre sur `http://localhost:4200` et se recharge automatiquement lors des modifications.

### Configuration

#### Variables d'environnement

Créez un fichier `src/environments/environment.ts` pour la configuration :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

#### Configuration Tailwind CSS

Le fichier `tailwind.config.js` est déjà configuré avec :
- Couleurs personnalisées pour le thème MoodlyPulse
- Breakpoints responsive
- Animations et transitions

## 🛠️ Scripts disponibles

```bash
# Démarrage en mode développement
npm start

# Build pour la production
npm run build

# Tests unitaires
npm test

# Linting
npm run lint

# Formatage du code
npm run format
```

## 🔧 Configuration de développement

### IDE recommandé
- **Visual Studio Code** avec les extensions :
  - Angular Language Service
  - TypeScript Importer
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter

### Configuration TypeScript
Le fichier `tsconfig.json` est configuré pour :
- Strict mode activé
- ES2022 target
- Module resolution node
- Path mapping pour les imports

### Configuration Angular
Le fichier `angular.json` définit :
- Build targets (development/production)
- Assets et styles globaux
- Optimisations de production
- Configuration des tests

## 🌐 Communication avec le backend

### Configuration API
L'application se connecte automatiquement au backend sur `http://localhost:8080`.

**Important** : Assurez-vous que le backend est démarré avant de lancer le frontend.

### CORS
Le backend doit être configuré pour accepter les requêtes depuis `http://localhost:4200`.

### Authentification
- Les tokens JWT sont stockés dans le localStorage
- L'intercepteur HTTP ajoute automatiquement le token aux requêtes
- Redirection automatique vers la page de connexion si non authentifié

## 📱 Test de l'application

### Test manuel
1. Ouvrir `http://localhost:4200`
2. Créer un compte ou se connecter
3. Ajouter une entrée quotidienne
4. Vérifier les statistiques
5. Tester la responsivité sur mobile

### Test des fonctionnalités
- ✅ Inscription/Connexion
- ✅ Ajout d'entrée quotidienne
- ✅ Modification d'entrée
- ✅ Suppression d'entrée
- ✅ Affichage des statistiques
- ✅ Responsive design
- ✅ Gestion des erreurs

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

Les fichiers de production sont générés dans le dossier `dist/moodly-pulse/`.

### Configuration serveur
- Serveur web (nginx, Apache)
- Configuration pour les routes Angular (SPA)
- Headers de sécurité appropriés

### Variables d'environnement de production
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.moodlypulse.com'
};
```

## 🐛 Dépannage

### Problèmes courants

#### Erreur de connexion au backend
- Vérifier que le backend est démarré sur le port 8080
- Vérifier la configuration CORS du backend
- Vérifier les logs de la console navigateur

#### Erreurs de build
- Vérifier la version de Node.js (18+)
- Supprimer `node_modules` et `package-lock.json`
- Réinstaller avec `npm install`

#### Problèmes de style
- Vérifier que Tailwind CSS est correctement configuré
- Redémarrer le serveur de développement
- Vérifier les imports SCSS

### Logs utiles
```bash
# Logs détaillés du serveur Angular
ng serve --verbose

# Logs de build
npm run build --verbose
```

### [⬅️ Retour au ReadMe principal](README.md) 