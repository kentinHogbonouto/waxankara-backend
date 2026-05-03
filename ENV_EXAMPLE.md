# Exemples de variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` avec le contenu suivant :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/waxankaarra?schema=public"

# Configuration du serveur
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Configuration Fedapay
FEDAPAY_API_URL=https://api.fedapay.com
FEDAPAY_API_KEY=your_fedapay_api_key_here
```

## Instructions

1. Copiez ce fichier et créez un `.env` dans le dossier `backend/`
2. Remplacez les valeurs par vos propres configurations :
   - `DATABASE_URL` : URL de connexion à votre base de données PostgreSQL
   - `FEDAPAY_API_KEY` : Votre clé API Fedapay (obtenez-la sur https://fedapay.com)
   - `FRONTEND_URL` : URL de votre frontend (pour la configuration CORS)

## Exemple de DATABASE_URL

```
postgresql://username:password@localhost:5432/waxankaarra?schema=public
```

Remplacez :
- `username` : votre nom d'utilisateur PostgreSQL
- `password` : votre mot de passe PostgreSQL
- `localhost:5432` : l'adresse et le port de votre serveur PostgreSQL
- `waxankaarra` : le nom de votre base de données

