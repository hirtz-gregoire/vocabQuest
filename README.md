# VocabQuest
Grégoire HIRTZ
Adrien NAIGEON

## Accès à l'application

- **En local** : [http://localhost:3000/](http://localhost:3000/) (après démarrage avec Docker Compose)

## Présentation

VocabQuest est une application interactive d'apprentissage des langues conçue pour rendre l'acquisition de vocabulaire amusante et efficace. L'application propose différents modes d'apprentissage adaptés à diverses méthodes pédagogiques, permettant aux utilisateurs d'apprendre à leur rythme et selon leur style d'apprentissage préféré.

## Fonctionnalités

### Modes d'apprentissage

1. **Mode Galerie** : Explorez visuellement le vocabulaire thématique avec des images et leurs traductions dans différentes langues. Cliquez sur une image pour entendre sa prononciation.

2. **Mode Compréhension** : Testez votre compréhension en écoutant un mot et en identifiant l'image correspondante parmi plusieurs choix.

3. **Mode Prononciation** : Améliorez votre prononciation en répétant les mots affichés. La reconnaissance vocale vérifie l'exactitude de votre prononciation.

### Gestion des thèmes

- **Thèmes variés** : L'application propose divers thèmes de vocabulaire (animaux, nourriture, etc.).
- **Création automatisée de thèmes** : Les administrateurs peuvent créer de nouveaux thèmes via l'interface d'administration en saisissant simplement un nom de thème. Le système utilise l'IA pour générer automatiquement tout le contenu.
- **Génération de contenu par IA** : L'application utilise l'API OpenAI pour générer automatiquement :
  - Une description du thème
  - Une liste d'éléments pertinents pour le thème
  - Des traductions dans plusieurs langues pour chaque élément
- **Recherche d'images automatique** : Pour chaque élément du thème, l'application utilise l'API Pexels pour rechercher et récupérer automatiquement des images pertinentes.
- **Vérification intelligente de similarité** : Le système vérifie automatiquement si un thème similaire existe déjà, même si :
  - Le nom contient des fautes d'orthographe
  - La formulation ou la tournure de phrase est différente
  - Des synonymes sont utilisés
  Cette vérification sémantique par IA empêche la création de doublons et maintient une base de données cohérente.
- **Multilingue** : Chaque thème prend en charge plusieurs langues, générées automatiquement lors de la création.

## Architecture technique

### Frontend
- **Framework** : Next.js 15.1.6 avec React 19 et TypeScript
- **Styles** : Tailwind CSS et CSS modules
- **Composants** : React Select, React Switch
- **Fonctionnalités** :
  - Interface utilisateur réactive
  - Synthèse vocale pour la prononciation
  - Reconnaissance vocale pour les exercices de prononciation

### Backend
- **Framework** : Java Spring Boot 3.4.2 avec Java 23
- **Base de données** : MongoDB
- **Services** :
  - API RESTful pour la gestion des thèmes
  - Intégration avec OpenAI pour la génération de contenu
  - Intégration avec Pexels pour les images

### Infrastructure
- **Conteneurisation** : Docker et Docker Compose
- **Services conteneurisés** :
  - MongoDB : Base de données NoSQL
  - API : Backend Spring Boot
  - Client : Frontend Next.js

## Configuration requise

### Prérequis
- Docker et Docker Compose
- Un navigateur moderne (Chrome recommandé pour une meilleure compatibilité avec l'API Web Speech)

### Variables d'environnement
Créez un fichier `.env` à la racine du projet avec les variables suivantes : (fournie dans le zip du rendu)
```
OPENAI_API_KEY=votre_clé_api_openai
PEXELS_API_KEY=votre_clé_api_pexels
```

Un fichier `.env.example` est fourni comme modèle.

## Installation et démarrage avec Docker Compose

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/hirtz-gregoire/vocabQuest.git
   cd vocabQuest
   ```

2. Créez le fichier `.env` avec vos clés API (fournie avec le zip du rendu)

3. Démarrez l'application avec Docker Compose :
   ```bash
   docker-compose up -d
   ```

4. Accédez à l'application :
   - Frontend : [http://localhost:3000](http://localhost:3000)
   - API : [http://localhost:8080/api](http://localhost:8080/api)

## Résolution des problèmes courants

- **Erreurs liées à l'API Web Speech** : Certains navigateurs, notamment Firefox, peuvent avoir des limitations avec l'API Web Speech. Pour une expérience optimale, utilisez Google Chrome.
  
- **Erreur "Cannot read properties of undefined (reading 'translations')"** : Cette erreur peut survenir si vous cliquez sur des éléments avant que les données ne soient complètement chargées. Attendez que le chargement soit terminé avant d'interagir avec l'application.

- **Problèmes de connexion à MongoDB** : Si vous rencontrez des problèmes de connexion à MongoDB, vérifiez que le conteneur MongoDB est bien démarré avec `docker ps`. Si nécessaire, redémarrez le conteneur avec `docker-compose restart mongodb`.

- **Problèmes d'API OpenAI ou Pexels** : Vérifiez que vos clés API sont correctement configurées dans le fichier `.env` et qu'elles sont valides.

## Utilisation

1. **Page d'accueil** : Sélectionnez l'un des trois modes d'apprentissage.

2. **Mode Galerie** :
   - Choisissez un thème et une langue
   - Parcourez les images et leurs traductions
   - Cliquez sur une image pour entendre sa prononciation

3. **Mode Compréhension** :
   - Écoutez le mot prononcé
   - Sélectionnez l'image correspondante
   - Recevez un retour immédiat sur votre réponse

4. **Mode Prononciation** :
   - Observez l'image et sa traduction
   - Prononcez le mot à voix haute
   - L'application vérifie votre prononciation et donne un retour

5. **Création de thème** :
   - Accédez à la section d'administration
   - Entrez le nom du nouveau thème
   - Le système génère automatiquement le contenu et récupère les images appropriées
