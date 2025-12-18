# Projet Vapeur

Application web de gestion de jeux vidéo développée avec Node.js, Express et Prisma.

## Description

Projet Vapeur est une plateforme de gestion de bibliothèque de jeux vidéo qui permet de consulter, ajouter, modifier et supprimer des jeux, ainsi que de les organiser par genres et éditeurs.

### Fonctionnalités principales

- Consultation de la liste complète des jeux
- Mise en avant de jeux sélectionnés sur la page d'accueil
- Gestion des jeux (ajout, modification, suppression)
- Gestion des éditeurs
- Organisation par genres (Action, Aventure, RPG, Simulation, Sport)
- Filtrage des jeux par genre ou éditeur

## Technologies utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **Express 5** - Framework web
- **Prisma** - ORM pour la gestion de base de données
- **SQLite** - Base de données
- **Handlebars (HBS)** - Moteur de templates
- **Body-parser** - Middleware pour le traitement des formulaires

## Prérequis

- Node.js (version 14 ou supérieure)
- npm (inclus avec Node.js)

## Installation

1. Cloner le dépôt
```bash
git clone https://github.com/Aqald/Vapeur.git
cd Vapeur
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer la base de données

Le fichier `.env` doit contenir :
```
DATABASE_URL="file:./database.db"
```

4. Initialiser la base de données avec Prisma
```bash
npx prisma migrate dev
npx prisma generate
```

## Lancement

Pour démarrer le serveur :
```bash
node script.js
```

L'application sera accessible à l'adresse : `http://localhost:3008`

## Structure du projet

```
projet-vapeur/
├── prisma/
│   ├── schema.prisma       # Schéma de base de données
│   └── migrations/         # Migrations de la base de données
├── views/
│   ├── jeux/              # Templates pour les jeux
│   ├── editeurs/          # Templates pour les éditeurs
│   ├── genres/            # Templates pour les genres
│   ├── partials/          # Composants réutilisables
│   └── layout.hbs         # Template principal
├── public/
│   └── css/               # Feuilles de style
├── script.js              # Point d'entrée de l'application
├── package.json           # Dépendances du projet
└── .env                   # Variables d'environnement
```

## Routes principales

### Jeux
- `GET /` - Page d'accueil avec les jeux mis en avant
- `GET /jeux` - Liste de tous les jeux
- `GET /jeux/:id` - Détails d'un jeu
- `GET /jeux/form` - Formulaire d'ajout d'un jeu
- `POST /jeux/form` - Création d'un nouveau jeu
- `GET /jeux/edit/:id` - Formulaire de modification d'un jeu
- `POST /jeux/edit/:id` - Mise à jour d'un jeu
- `GET /jeux/delete/:id` - Suppression d'un jeu

### Éditeurs
- `GET /editeurs` - Liste des éditeurs
- `GET /editeurs/:editeur` - Jeux d'un éditeur spécifique
- `GET /editeurs/form` - Formulaire d'ajout d'un éditeur
- `POST /editeurs/form` - Création d'un nouvel éditeur
- `GET /editeurs/edit/:id` - Formulaire de modification d'un éditeur
- `POST /editeurs/edit/:id` - Mise à jour d'un éditeur
- `GET /editeurs/delete/:id` - Suppression d'un éditeur

### Genres
- `GET /genres` - Liste des genres
- `GET /genres/:genre` - Jeux d'un genre spécifique

## Modèle de données

### Jeux
- `id` : Identifiant unique (auto-incrémenté)
- `titre` : Titre du jeu
- `description` : Description du jeu
- `date` : Date de sortie
- `genre` : Genre du jeu
- `editeur` : Éditeur du jeu
- `misenavant` : Mise en avant (booléen)
- `image` : URL de l'image du jeu

### Genres
- `id` : Identifiant unique
- `nom` : Nom du genre

### Éditeurs
- `id` : Identifiant unique
- `nom` : Nom de l'éditeur
- `pays` : Pays de l'éditeur

## Configuration

Le port du serveur peut être modifié dans `script.js` :
```javascript
const PORT = 3008; // Port par défaut
```

## Notes

- Les genres par défaut (Action, Aventure, RPG, Simulation, Sport) sont créés automatiquement au premier lancement
- La suppression d'un éditeur entraîne la suppression de tous ses jeux associés


## Auteur

Mael Mace - Lucas Colombet

## Licence

Projet réalisé dans un cadre éducatif.