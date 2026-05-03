# Waxankaarra Backend

Backend API pour la plateforme e-commerce Waxankaarra.

## Technologies

- NestJS
- PostgreSQL avec Prisma ORM
- Fedapay pour les paiements
- Swagger pour la documentation API

## Installation

1. Installer les dépendances :
```bash
npm install
# ou
yarn install
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

3. Configurer la base de données :
```bash
# Générer le client Prisma
npm run prisma:generate

# Exécuter les migrations
npm run prisma:migrate

# Seed la base de données
npm run seed
```

4. Démarrer le serveur :
```bash
# Développement
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Documentation API

Une fois le serveur démarré, la documentation Swagger est disponible à :
- http://localhost:3001/api

## Structure

```
src/
├── cart/           # Module panier
├── favorites/      # Module favoris
├── orders/         # Module commandes
├── payment/        # Module paiement (Fedapay)
├── products/       # Module produits
└── shared/         # Modules partagés (Prisma, etc.)
```

# waxankara-backend
