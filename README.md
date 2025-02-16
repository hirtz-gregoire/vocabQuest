# VocabQuest

## Présentation

VocabQuest est une application interactive d'apprentissage des langues conçue pour rendre l'acquisition de vocabulaire amusante et efficace. L'application propose différents modes d'apprentissage adaptés à diverses méthodes pédagogiques, permettant aux utilisateurs d'apprendre à leur rythme et selon leur style d'apprentissage préféré.

## Fonctionnalités

### Modes d'apprentissage

1. **Mode Galerie** : Explorez visuellement le vocabulaire thématique avec des images et leurs traductions dans différentes langues. Cliquez sur une image pour entendre sa prononciation.

2. **Mode Compréhension** : Testez votre compréhension en écoutant un mot et en identifiant l'image correspondante parmi plusieurs choix.

3. **Mode Prononciation** : Améliorez votre prononciation en répétant les mots affichés. La reconnaissance vocale vérifie l'exactitude de votre prononciation.

### Gestion des thèmes

- **Thèmes variés** : L'application propose divers thèmes de vocabulaire (animaux, nourriture, etc.).
- **Création de thèmes** : Les administrateurs peuvent créer de nouveaux thèmes via l'interface d'administration.
- **Multilingue** : Chaque thème prend en charge plusieurs langues.

## Architecture technique

### Frontend
- **Framework** : Next.js (React) avec TypeScript
- **Styles** : CSS avec composants stylisés
- **Fonctionnalités** :
  - Interface utilisateur réactive
  - Synthèse vocale pour la prononciation
  - Reconnaissance vocale pour les exercices de prononciation

### Backend
- **Framework** : Java Spring Boot
- **Base de données** : MongoDB
- **Services** :
  - API RESTful pour la gestion des thèmes
  - Intégration avec OpenAI pour la génération de contenu
  - Intégration avec Pexels pour les images

## Installation et démarrage

### Prérequis
- Java 17+
- Node.js 18+
- Docker et Docker Compose
- Un navigateur moderne (Chrome recommandé pour une meilleure compatibilité avec l'API Web Speech)

### Configuration

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/vocabquest.git
   cd vocabquest
   ```

2. Démarrez MongoDB avec Docker :
   ```bash
   docker-compose up -d
   ```
   
   Vérifiez que le conteneur MongoDB est bien démarré :
   ```bash
   docker ps
   ```

### Démarrage du backend

1. Ouvrez un nouveau terminal et naviguez vers le dossier api :
   ```bash
   cd api
   ```

2. Lancez l'application Spring Boot :
   ```bash
   ./gradlew bootRun
   ```
   
   Sur Windows, utilisez :
   ```bash
   gradlew.bat bootRun
   ```

### Démarrage du frontend

1. Ouvrez un nouveau terminal et naviguez vers le dossier client :
   ```bash
   cd client
   ```

2. Installez les dépendances et lancez le serveur :
   ```bash
   npm install
   npm run dev
   ```

L'application sera accessible à l'adresse : http://localhost:3000

### Résolution des problèmes courants

- **Erreurs liées à l'API Web Speech** : Certains navigateurs, notamment Firefox, peuvent avoir des limitations avec l'API Web Speech. Pour une expérience optimale, utilisez Google Chrome.
  
- **Erreur "Cannot read properties of undefined (reading 'translations')"** : Cette erreur peut survenir si vous cliquez sur des éléments avant que les données ne soient complètement chargées. Attendez que le chargement soit terminé avant d'interagir avec l'application.

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


