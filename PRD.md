# ELGOH - Plateforme de Réservation de Chauffeur Privé Premium

Application web complète de réservation de chauffeur privé avec système d'administration avancé pour la gestion de flotte, tarification dynamique et réservations en Île-de-France.

**Experience Qualities**:
1. **Premium** - Design élégant et professionnel qui inspire confiance et luxe
2. **Intuitif** - Navigation fluide et processus de réservation simplifié en quelques clics
3. **Transparent** - Tarification claire et visible, sans frais cachés

**Complexity Level**: Complex Application (advanced functionality with multiple views)
L'application combine un système de réservation client complet, un tableau de bord administrateur sophistiqué avec gestion de flotte, tarification dynamique, circuits touristiques, zones tarifaires, codes promo, et notifications multi-canaux.

## Essential Features

### Réservation Client
- **Functionality**: Système de réservation avec calcul d'itinéraire en temps réel et tarification automatique
- **Purpose**: Permettre aux clients de réserver facilement un chauffeur privé
- **Trigger**: Clic sur "Réserver" depuis la page d'accueil ou un service
- **Progression**: Sélection du service → Saisie des adresses (pickup/destination) → Choix de la date/heure → Sélection du véhicule → Application code promo → Paiement Stripe → Confirmation
- **Success criteria**: Le client reçoit une confirmation par email et peut suivre sa réservation

### Dashboard Administrateur
- **Functionality**: Interface complète de gestion des réservations, flotte, tarifs, et paramètres
- **Purpose**: Centraliser la gestion de l'entreprise de chauffeur
- **Trigger**: Connexion avec compte administrateur
- **Progression**: Login admin → Accès au dashboard → Gestion des modules (réservations, flotte, tarifs, etc.)
- **Success criteria**: L'admin peut gérer toutes les données en temps réel avec sauvegarde automatique

### Gestion de Flotte
- **Functionality**: CRUD complet des véhicules avec photos, descriptions et tarification
- **Purpose**: Gérer le parc de véhicules disponibles
- **Trigger**: Onglet "Flotte" dans l'admin
- **Progression**: Liste des véhicules → Ajout/Modification → Upload d'image → Ajustement visuel → Sauvegarde
- **Success criteria**: Les modifications sont sauvegardées et visibles immédiatement côté client

### Tarification Dynamique
- **Functionality**: Système de tarification par kilomètre, minute et heure avec modes haute/basse saison
- **Purpose**: Adapter les prix selon la demande et optimiser la rentabilité
- **Trigger**: Onglet "Tarification" dans l'admin
- **Progression**: Sélection du véhicule → Modification des tarifs → Bascule haute/basse saison → Sauvegarde
- **Success criteria**: Les nouveaux tarifs s'appliquent immédiatement aux nouvelles réservations

### Circuits Touristiques
- **Functionality**: Création de circuits prédéfinis (Versailles, Normandie, etc.) avec étapes et tarifs
- **Purpose**: Proposer des offres packagées pour les touristes
- **Trigger**: Onglet "Circuits" dans l'admin
- **Progression**: Création circuit → Ajout d'étapes → Configuration des tarifs par véhicule → Publication
- **Success criteria**: Les circuits sont réservables depuis les pages de services

### Zones Tarifaires et Forfaits
- **Functionality**: Définition de zones géographiques avec tarifs forfaitaires entre zones
- **Purpose**: Simplifier la tarification pour les trajets récurrents (aéroports, gares)
- **Trigger**: Onglet "Zones & Forfaits" dans l'admin
- **Progression**: Création de zones → Définition des forfaits inter-zones → Configuration par véhicule
- **Success criteria**: Les forfaits s'appliquent automatiquement lors de la réservation

### Codes Promotionnels
- **Functionality**: Système de codes promo avec pourcentage ou montant fixe, validité et usage limité
- **Purpose**: Fidéliser les clients et créer des campagnes marketing
- **Trigger**: Onglet "Codes Promo" dans l'admin
- **Progression**: Création du code → Configuration (type, valeur, dates, limite) → Activation
- **Success criteria**: Les codes sont applicables lors de la réservation et le compteur d'usage se met à jour

### Notifications Multi-Canaux
- **Functionality**: Envoi automatique de confirmations et mises à jour par Email et Telegram
- **Purpose**: Tenir informés clients et administrateurs
- **Trigger**: Nouvelle réservation ou changement de statut
- **Progression**: Événement → Envoi email client → Notification Telegram admin → Confirmation
- **Success criteria**: Tous les acteurs reçoivent les notifications pertinentes en temps réel

## Edge Case Handling

- **Adresse introuvable**: Message d'erreur clair avec suggestions de reformulation
- **Trajet impossible**: Calcul échoue → affichage d'un message invitant à contacter le service
- **Code promo invalide**: Message d'erreur spécifique (expiré, limite atteinte, non existant)
- **Paiement échoué**: Redirection vers formulaire avec message d'erreur Stripe
- **Image de véhicule manquante**: Placeholder par défaut avec icône de voiture
- **Données admin non sauvegardées**: Utilisation de `useKV` pour persistance automatique locale
- **Conflits de réservations**: Affichage de toutes les réservations dans l'admin pour éviter les doublons

## Design Direction

Le design doit évoquer le luxe, la fiabilité et le professionnalisme d'un service de chauffeur premium. Ambiance sombre et élégante avec des accents lumineux pour guider l'utilisateur. Typographie moderne et lisible, animations subtiles pour fluidifier les transitions.

## Color Selection

Palette sombre et sophistiquée avec des accents cyan lumineux pour un look technologique et premium.

- **Primary Color**: Violet profond `oklch(0.35 0.15 285)` - Évoque le luxe et la sophistication
- **Secondary Color**: Gris foncé `oklch(0.40 0.02 260)` - Équilibre et professionnalisme
- **Accent Color**: Cyan vif `oklch(0.70 0.20 200)` - Dynamisme et modernité pour les CTA
- **Success**: Vert lumineux `oklch(0.75 0.20 140)` - Confirmations et validations
- **Destructive**: Rouge corail `oklch(0.65 0.22 25)` - Actions de suppression et erreurs
- **Background**: Bleu-gris très sombre `oklch(0.12 0.02 260)` - Fond principal élégant
- **Foreground**: Blanc cassé `oklch(0.98 0 0)` - Texte principal haute lisibilité

**Foreground/Background Pairings**:
- Background (oklch(0.12 0.02 260)): Foreground blanc (oklch(0.98 0 0)) - Ratio 15.8:1 ✓
- Primary (oklch(0.35 0.15 285)): Foreground blanc (oklch(0.98 0 0)) - Ratio 6.2:1 ✓
- Accent (oklch(0.70 0.20 200)): Background sombre (oklch(0.12 0.02 260)) - Ratio 8.1:1 ✓
- Card (oklch(0.20 0.02 260)): Foreground blanc (oklch(0.98 0 0)) - Ratio 12.5:1 ✓

## Font Selection

Combinaison moderne et professionnelle alliant lisibilité et caractère technique.

- **Primary Font**: Inter - Police sans-serif moderne, optimale pour l'interface et le contenu
- **Monospace Font**: JetBrains Mono - Pour les codes promo, prix et éléments techniques

**Typographic Hierarchy**:
- H1 (Titres principaux): Inter Bold/48px/tight - Pages Hero
- H2 (Titres sections): Inter Semibold/36px/tight - En-têtes de sections
- H3 (Sous-titres): Inter Semibold/24px/normal - Cards et modules
- Body (Texte courant): Inter Regular/16px/relaxed (1.6) - Descriptions et contenus
- Small (Texte secondaire): Inter Regular/14px/normal - Labels et métadonnées
- Code (Prix, codes): JetBrains Mono Medium/18px/tight - Éléments monospace

## Animations

Animations subtiles et fluides pour renforcer la perception de qualité premium et guider l'utilisateur sans distraire.

- **Transitions de page**: Fade in/out doux (300ms) pour les changements de vues
- **Cards hover**: Élévation subtile avec glow cyan (200ms) pour signaler l'interactivité
- **Buttons**: Pulse lumineux au hover (150ms) pour les CTA principaux
- **Formulaires**: Slide-in progressif des champs (stagger 50ms) pour guider l'attention
- **Modals**: Scale + fade depuis le centre (300ms) pour apparition/disparition
- **Status badges**: Pulse subtil pour les statuts "pending"
- **Success states**: Checkmark avec scale bounce (400ms) après validation

## Component Selection

**Components**:
- **Cards**: Shadcn Card avec background `card` et subtle border pour toutes les sections de contenu
- **Buttons**: Shadcn Button avec variants (default pour primary actions, outline pour secondary, destructive pour suppression)
- **Forms**: Shadcn Form + Input + Label + Textarea avec focus ring accent
- **Selects**: Shadcn Select avec animation smooth pour dropdowns (véhicules, statuts)
- **Dialogs**: Shadcn Dialog pour modals de confirmation et édition
- **Tabs**: Shadcn Tabs pour navigation admin (Réservations, Flotte, Tarifs, etc.)
- **Tables**: Shadcn Table pour liste des réservations et données structurées
- **Toasts**: Sonner pour notifications (succès, erreurs, confirmations)
- **Sliders**: Shadcn Slider pour ajustement d'images dans l'admin flotte
- **Switches**: Shadcn Switch pour toggles (activation codes promo, paramètres)
- **Tooltips**: Shadcn Tooltip pour infos contextuelles

**Customizations**:
- **Hero section**: Dégradé background custom avec overlay sombre
- **Service cards**: Hover effect avec glow et élévation
- **Fleet showcase**: Grid responsive avec image optimization
- **Booking form**: Multi-step avec progress indicator custom
- **Admin dashboard**: Sidebar navigation avec active states distinctifs
- **Image editor**: Custom overlay avec controls de position/zoom pour photos de véhicules

**States**:
- **Buttons**: default (gradient subtil), hover (glow cyan), active (pressed), disabled (opacity 50%)
- **Inputs**: default (border muted), focus (ring accent + border accent), error (border destructive), success (border success)
- **Cards**: default (subtle border), hover (elevated + glow pour cartes interactives)
- **Status badges**: pending (yellow), confirmed (green), completed (blue), cancelled (red)

**Icon Selection** (Phosphor Icons):
- Car, MapPin: Navigation et localisation
- Calendar, Clock: Date et heure de réservation
- User, UsersThree: Gestion utilisateurs et passagers
- CurrencyCircleDollar, Sparkle: Tarification et promotions
- Plus, Trash, Check, X: Actions CRUD
- Upload, Image: Gestion des photos de véhicules
- EnvelopeSimple, CreditCard: Email et paiement
- ShieldCheck, Key: Sécurité et authentification

**Spacing**:
- Container: max-w-7xl mx-auto px-4 (mobile) / px-8 (desktop)
- Sections: py-16 (desktop) / py-8 (mobile)
- Cards: p-6 (desktop) / p-4 (mobile)
- Form fields: gap-4 pour espacement vertical cohérent
- Grid: gap-6 (desktop) / gap-4 (mobile)

**Mobile**:
- Navigation: Hamburger menu collapsible avec sidebar overlay
- Forms: Stack vertical avec full-width inputs
- Tables: Horizontal scroll wrapper ou card view pour réservations
- Admin tabs: Scroll horizontal ou select dropdown sur petit écran
- Fleet grid: 1 colonne mobile → 2 colonnes tablet → 3 colonnes desktop
- Buttons: Full width sur mobile pour faciliter le touch
