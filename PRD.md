# Configuration Supabase - Guide de Démarrage Rapide

Une interface de configuration Supabase élégante et interactive avec un guide pas à pas, un testeur de connexion en temps réel, et des instructions visuelles.

**Experience Qualities**:
1. **Guidant** - L'interface accompagne l'utilisateur étape par étape avec des instructions claires et visuelles
2. **Rassurant** - Feedback immédiat sur l'état de la configuration avec des messages d'erreur constructifs
3. **Professionnel** - Design technique et moderne qui inspire confiance et crédibilité

**Complexity Level**: Light Application (multiple features with basic state)
L'application combine un guide multi-étapes, un formulaire de configuration, et un testeur de connexion en temps réel.

## Essential Features

### Guide de Configuration Étape par Étape
- **Functionality**: Affiche les 5 étapes de configuration Supabase avec progression visuelle
- **Purpose**: Simplifier le processus de configuration pour les développeurs
- **Trigger**: Au chargement de l'application
- **Progression**: Affichage des étapes → Sélection d'une étape → Affichage des instructions détaillées → Validation → Passage à l'étape suivante
- **Success criteria**: L'utilisateur peut naviguer entre les étapes et comprendre chaque action requise

### Testeur de Connexion en Temps Réel
- **Functionality**: Vérifie la validité des credentials Supabase et affiche le statut de connexion
- **Purpose**: Donner un feedback immédiat sur la configuration
- **Trigger**: Saisie des credentials ou clic sur "Test Connection"
- **Progression**: Saisie des credentials → Validation du format → Test de connexion → Affichage du résultat (succès/erreur)
- **Success criteria**: L'utilisateur voit immédiatement si sa configuration fonctionne

### Générateur de Script SQL
- **Functionality**: Affiche le script SQL nécessaire pour créer les tables Supabase
- **Purpose**: Faciliter la configuration de la base de données
- **Trigger**: Clic sur l'étape 2 "Créer les tables"
- **Progression**: Affichage du script → Copie dans le presse-papiers → Confirmation visuelle
- **Success criteria**: L'utilisateur peut copier facilement le script SQL complet

### Éditeur de Variables d'Environnement
- **Functionality**: Interface pour saisir et visualiser les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
- **Purpose**: Configurer les credentials de manière sécurisée
- **Trigger**: Navigation vers l'étape 4
- **Progression**: Saisie de l'URL → Saisie de la clé → Validation du format → Génération du fichier .env.local → Instructions de redémarrage
- **Success criteria**: Les variables sont formatées correctement et sauvegardées

### Visualisateur d'État de Configuration
- **Functionality**: Dashboard montrant l'état actuel de la configuration Supabase
- **Purpose**: Donner une vue d'ensemble rapide de la configuration
- **Trigger**: Au chargement de l'application
- **Progression**: Vérification des variables → Vérification de la connexion → Affichage du statut global → Actions recommandées
- **Success criteria**: L'utilisateur voit immédiatement si Supabase est configuré et fonctionnel

## Edge Case Handling

- **Variables manquantes**: Afficher un message clair indiquant quelles variables sont manquantes avec des liens vers les étapes appropriées
- **Format d'URL invalide**: Validation en temps réel avec message d'erreur spécifique (ex: "L'URL doit commencer par https://")
- **Clé API invalide**: Détection du format JWT et messages d'erreur descriptifs
- **Connexion échouée**: Afficher le message d'erreur exact et des suggestions de résolution
- **Copie échouée**: Fallback manuel si l'API clipboard n'est pas disponible

## Design Direction

Le design doit évoquer un tableau de bord technique moderne avec une esthétique de développeur, inspiré des outils DevOps et des interfaces de configuration cloud. L'interface doit être claire, structurée et inspirante, avec des éléments visuels qui guident naturellement l'œil à travers le processus de configuration.

## Color Selection

Palette technique et énergisante avec des accents vifs pour les états de succès et d'erreur.

- **Primary Color**: Violet profond `oklch(0.35 0.15 285)` - Évoque la technologie et l'innovation, utilisé pour les titres et éléments principaux
- **Secondary Colors**: 
  - Gris ardoise foncé `oklch(0.20 0.02 260)` pour les cartes et conteneurs
  - Gris moyen `oklch(0.40 0.02 260)` pour les bordures et séparateurs
- **Accent Color**: Cyan électrique `oklch(0.70 0.20 200)` - Pour les boutons d'action, états actifs et focus
- **Success Color**: Vert néon `oklch(0.75 0.20 140)` - Confirmation de connexion réussie
- **Error Color**: Rouge corail `oklch(0.65 0.22 25)` - Erreurs et avertissements

**Foreground/Background Pairings**:
- Background principal (Noir profond `oklch(0.12 0.02 260)`): Texte blanc `oklch(0.98 0 0)` - Ratio 16.8:1 ✓
- Cartes (Gris ardoise `oklch(0.20 0.02 260)`): Texte blanc `oklch(0.98 0 0)` - Ratio 13.2:1 ✓
- Accent (Cyan `oklch(0.70 0.20 200)`): Texte noir `oklch(0.12 0.02 260)` - Ratio 10.5:1 ✓
- Success (Vert néon `oklch(0.75 0.20 140)`): Texte noir `oklch(0.12 0.02 260)` - Ratio 11.8:1 ✓

## Font Selection

Typo technique et moderne qui évoque les éditeurs de code et les interfaces de développement.

- **Primary Font**: JetBrains Mono - Police monospace élégante pour les codes et identifiants techniques
- **Secondary Font**: Inter - Sans-serif moderne pour le texte courant et les instructions

**Typographic Hierarchy**:
- H1 (Titre principal): JetBrains Mono Bold/36px/tight letter spacing
- H2 (Titres d'étapes): Inter SemiBold/24px/normal spacing
- H3 (Sous-titres): Inter Medium/18px/normal spacing
- Body (Instructions): Inter Regular/16px/relaxed line-height (1.6)
- Code (Credentials): JetBrains Mono Regular/14px/monospace spacing
- Labels (Formulaires): Inter Medium/14px/uppercase tracking-wide

## Animations

Les animations doivent renforcer la progression dans le guide et donner du feedback immédiat sur les interactions.

- **Progression des étapes**: Transition fluide avec effet de slide horizontal lors du changement d'étape
- **Test de connexion**: Animation de pulse sur le bouton pendant le test, puis transition vers l'icône de succès/erreur
- **Copie dans le presse-papiers**: Micro-interaction avec bounce léger et changement d'icône
- **Validation de formulaire**: Shake subtil sur les champs invalides, glow sur les champs valides
- **Accordéons**: Expansion/collapse fluide avec ease-in-out pour les sections d'instructions

## Component Selection

- **Components**: 
  - Card pour chaque étape de configuration
  - Accordion pour les sections détaillées d'instructions
  - Input pour les champs de credentials avec validation en temps réel
  - Button avec variants (primary pour actions, outline pour secondaire, ghost pour copier)
  - Badge pour afficher les statuts (configuré/non configuré)
  - Alert pour les messages d'erreur et de succès
  - Separator pour diviser les sections logiques
  - Tabs pour naviguer entre "Guide", "Test" et "Status"
  - Progress pour afficher la progression dans le guide (1/5, 2/5, etc.)
  - Code block (custom) pour afficher le SQL et les variables d'environnement
  
- **Customizations**: 
  - Composant CodeBlock personnalisé avec syntax highlighting (SQL, bash, env)
  - StepIndicator personnalisé avec numéros et lignes de connexion
  - ConnectionStatus personnalisé avec animation de pulse
  
- **States**: 
  - Boutons: hover avec glow subtle, active avec scale légère, disabled avec opacity 50%
  - Inputs: focus avec border cyan brillant, error avec border rouge et shake, success avec border verte
  - Cards: hover avec subtle lift (shadow), active step avec border accent
  
- **Icon Selection**: 
  - CheckCircle pour succès et étapes complétées
  - XCircle pour erreurs
  - Copy pour copier dans le presse-papiers
  - Database pour les tables
  - Key pour les credentials
  - ArrowRight pour navigation suivante
  - Lightning pour test de connexion
  - Eye/EyeSlash pour afficher/masquer les clés API
  
- **Spacing**: 
  - Padding des cards: p-6
  - Gap entre éléments: gap-4 (1rem)
  - Gap entre sections: gap-8 (2rem)
  - Margin entre composants majeurs: mb-8
  
- **Mobile**: 
  - Stack vertical sur mobile (<768px)
  - Réduction du padding des cards à p-4
  - Font sizes légèrement réduits (H1: 28px, Body: 15px)
  - Boutons full-width sur mobile
  - Navigation par onglets collapsible
  - Code blocks avec scroll horizontal
