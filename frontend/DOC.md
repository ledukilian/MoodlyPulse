![MoodlyPulse Banner](../MoodlyPulse_ReadMe_Header.png)

### [⬅️ Retour au ReadMe principal](README.md)

## 🏗️ Structure du projet

```
moodlypulse-frontend/
├── src/
│   ├── main.ts                 # Point d'entrée de l'application
│   ├── index.html              # Template HTML principal
│   ├── styles.scss             # Styles globaux
│   ├── components/             # Composants Angular
│   │   ├── header/             # En-tête de l'application
│   │   ├── entry-form/         # Formulaire d'entrée quotidienne
│   │   ├── login-form/         # Formulaire de connexion
│   │   ├── register-form/      # Formulaire d'inscription
│   │   ├── recent-entries/     # Liste des entrées récentes
│   │   └── stats-grid/         # Grille de statistiques
│   ├── services/               # Services Angular
│   │   ├── auth.service.ts     # Service d'authentification
│   │   └── entries.service.ts  # Service de gestion des entrées
│   ├── models/                 # Modèles TypeScript
│   │   ├── user.model.ts       # Interface utilisateur
│   │   └── entry.model.ts      # Interface entrée quotidienne
│   ├── interceptors/           # Intercepteurs HTTP
│   │   └── auth.interceptor.ts # Intercepteur d'authentification
│   └── assets/                 # Ressources statiques
│       └── logo.png            # Logo de l'application
├── angular.json                # Configuration Angular CLI
├── tailwind.config.js          # Configuration Tailwind CSS
├── package.json                # Dépendances npm
└── tsconfig.json               # Configuration TypeScript
```

## 📝 Modèles de données

### User
```typescript
interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  created_at: string;
}
```

### Entry
```typescript
interface Entry {
  id: number;
  user_id: number;
  date: string;
  mood: number;           // 1-5
  sleep_hours: number;    // Heures de sommeil
  water_cups: number;     // Verres d'eau
  sport_min: number;      // Minutes de sport
  note?: string;          // Note optionnelle
  created_at: string;
  updated_at: string;
}
```

## 🔒 Authentification

- **JWT Token** : Stocké dans le localStorage
- **Intercepteur HTTP** : Ajoute automatiquement le token aux requêtes
- **Gestion d'état** : Service AuthService avec observables RxJS
- **Protection des routes** : Redirection automatique si non authentifié
- **Expiration** : Gestion automatique de l'expiration du token

## 🎨 Interface utilisateur

### Design System
- **Tailwind CSS** : Framework utilitaire pour le styling
- **Responsive Design** : Adaptation mobile, tablette et desktop
- **Thème cohérent** : Couleurs et typographie harmonisées
- **Animations** : Transitions fluides et micro-interactions

### Composants principaux

#### HeaderComponent
- Navigation principale
- Informations utilisateur
- Bouton de déconnexion

#### EntryFormComponent
- Formulaire modal pour ajouter/modifier une entrée
- Validation en temps réel
- Interface intuitive avec sliders et inputs

#### LoginFormComponent / RegisterFormComponent
- Formulaires d'authentification
- Validation côté client
- Messages d'erreur contextuels

#### RecentEntriesComponent
- Liste des entrées récentes
- Tri par date
- Actions rapides (modifier/supprimer)

#### StatsGridComponent
- Statistiques visuelles
- Graphiques et métriques
- Vue d'ensemble des données

## 🔄 Gestion d'état

### Services principaux

#### AuthService
```typescript
class AuthService {
  isAuthenticated$: Observable<boolean>;
  authMode$: Observable<'login' | 'register'>;
  
  login(email: string, password: string): Observable<any>;
  register(userData: RegisterData): Observable<any>;
  logout(): void;
  getToken(): string | null;
}
```

#### EntriesService
```typescript
class EntriesService {
  entries$: Observable<Entry[]>;
  todayEntry: Signal<Entry | null>;
  stats$: Observable<Stats>;
  
  loadEntries(): Observable<Entry[]>;
  createEntry(entry: CreateEntryData): Observable<Entry>;
  updateEntry(id: number, entry: UpdateEntryData): Observable<Entry>;
  deleteEntry(id: number): Observable<void>;
  loadStats(): Observable<Stats>;
}
```

## 🌐 Communication avec l'API

### Configuration HTTP
- **Base URL** : `http://localhost:8080` (développement)
- **Intercepteur** : Ajout automatique du token JWT
- **Gestion d'erreurs** : Messages d'erreur centralisés
- **Retry logic** : Tentatives automatiques en cas d'échec

### Endpoints utilisés
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription
- `GET /entries` - Liste des entrées
- `POST /entries` - Créer/modifier une entrée
- `DELETE /entries/:id` - Supprimer une entrée
- `GET /stats/summary` - Statistiques

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px

### Adaptations
- Navigation adaptative
- Formulaires optimisés mobile
- Grilles flexibles
- Touch-friendly interactions

## 🚀 Performance

### Optimisations
- **Lazy Loading** : Chargement à la demande
- **OnPush Strategy** : Détection de changements optimisée
- **TrackBy Functions** : Optimisation des listes
- **Bundle Splitting** : Séparation du code
- **Tree Shaking** : Élimination du code inutilisé

### Métriques
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1

### [⬅️ Retour au ReadMe principal](README.md) 