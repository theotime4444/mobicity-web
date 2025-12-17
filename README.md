# Mobicity Web - Back-Office

Application React SPA de type back-office pour la gestion de la plateforme Mobicity.

## 🚀 Démarrage Rapide avec Docker

### Prérequis

- Docker et Docker Compose installés

### Lancement

1. **Cloner ou extraire le projet**

2. **Lancer l'application** :
```bash
docker compose up --build
```

Ou simplement :
```bash
docker compose up
```

3. **Accéder à l'application** :
   - Ouvrir `http://localhost:5173` dans votre navigateur

4. **Se connecter** :
   - Email : `marie.martin@mail.com`
   - Mot de passe : `password456`

### Commandes Utiles

- **Démarrer en arrière-plan** : `docker compose up -d --build`
- **Arrêter** : `docker compose down`
- **Voir les logs** : `docker compose logs -f`
- **Rebuild complet** : `docker compose build --no-cache`

## 📋 Configuration

### Variables d'Environnement (Optionnel)

**En développement local** (sans Docker) :
- Le proxy Vite redirige automatiquement `/v1` vers `http://localhost:3001`
- Aucune configuration nécessaire si l'API est sur `localhost:3001`

**Avec Docker** :
- Le proxy pointe par défaut vers `http://localhost:3001`
- Si l'API est dans un autre container, modifier `vite.config.js` :
  ```js
  proxy: {
    '/v1': {
      target: 'http://host.docker.internal:3001', // ou l'URL de votre API
      changeOrigin: true,
      secure: false,
    },
  }
  ```

## 🏗️ Structure du Projet

```
src/
├── API/              # Client API avec exponential retry
│   ├── client.ts
│   ├── users.api.ts
│   ├── vehicles.api.ts
│   ├── categories.api.ts
│   ├── locations.api.ts
│   └── favorites.api.ts
├── components/       # Composants React
│   ├── common/      # Composants réutilisables
│   │   ├── DataTable.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Pagination.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   └── pages/       # Pages/Vues
│       ├── UserTable.tsx
│       ├── UserForm.tsx
│       └── ...
├── context/         # Contextes React
│   └── AuthContext.tsx
├── routes/          # Configuration du routing
│   ├── Router.tsx
│   └── ProtectedRoute.tsx
├── utils/           # Utilitaires
│   ├── constants.ts
│   ├── retry.ts
│   └── errorHandler.ts
└── model/           # Types TypeScript
    ├── IUser.ts
    ├── IVehicle.ts
    └── ...
```

## ✨ Fonctionnalités

- ✅ **Authentification** avec token JWT
- ✅ **Gestion complète** de 5 entités (Users, Vehicles, Categories, Locations, Favorites)
- ✅ **CRUD complet** pour chaque entité
- ✅ **Pagination** sur toutes les vues
- ✅ **Recherche** sur toutes les vues
- ✅ **Exponential retry** pour les requêtes API
- ✅ **Gestion d'erreurs** différenciée (4XX vs 5XX)
- ✅ **TypeScript** pour la sécurité des types
- ✅ **Interface moderne** avec Ant Design

## 🛠️ Technologies

- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool moderne
- **React Router DOM** - Routing
- **Ant Design** - Composants UI
- **Docker** - Containerisation

## 📝 Notes Importantes

- L'application nécessite que l'API backend soit accessible
- Par défaut, l'API est attendue sur `http://host.docker.internal:3001`
- Le proxy Vite redirige automatiquement `/v1` vers l'API backend
- Les tokens d'authentification sont stockés dans `localStorage`

## 🔧 Installation Manuelle (sans Docker)

Si vous préférez installer manuellement :

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build de production
npm run build
```

## 👤 Comptes de Test

- **Administrateur** :
  - Email : `marie.martin@mail.com`
  - Mot de passe : `password456`

- **Utilisateur standard** :
  - Email : `jean.dupont@mail.com`
  - Mot de passe : `password123`
