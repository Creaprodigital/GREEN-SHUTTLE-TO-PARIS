# 🚗 ELGOH - Chauffeur Privé Premium en Île-de-France

Application web complète de réservation de chauffeur privé avec système de gestion administrateur avancé. Conçue pour offrir une expérience premium aux clients et des outils puissants aux administrateurs.

## 🎯 Fonctionnalités

### Pour les clients
- 📅 **Réservation intuitive** - Processus simplifié en quelques clics
- 🗺️ **Calcul d'itinéraire en temps réel** - Tarification automatique basée sur Google Maps
- 💳 **Paiement sécurisé** - Intégration Stripe pour paiements en ligne
- 📱 **Tableau de bord personnel** - Suivi de vos réservations
- 🎫 **Codes promotionnels** - Réductions et offres spéciales
- 🚗 **Choix du véhicule** - Berline, Van, SUV selon vos besoins
- 📧 **Confirmations par email** - Notifications automatiques

### Pour les administrateurs
- 📊 **Dashboard complet** - Vue d'ensemble des réservations et statistiques
- 🚗 **Gestion de la flotte** - CRUD complet avec upload et édition d'images
- 💰 **Tarification dynamique** - Prix par km/minute/heure + modes haute/basse saison
- 🎟️ **Codes promotionnels** - Création et gestion des offres
- 📍 **Zones et forfaits** - Définition de tarifs forfaitaires entre zones
- 🗺️ **Circuits touristiques** - Packages prédéfinis (Versailles, Normandie, etc.)
- 👥 **Gestion des réservations** - Mise à jour des statuts et prix
- ⚙️ **Paramètres système** - Configuration Email, Telegram, Stripe
- 🔔 **Notifications multi-canaux** - Email client + Telegram admin

## 🛠️ Technologies

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Shadcn/ui
- **Icons**: Phosphor Icons
- **Animations**: Framer Motion
- **Persistence**: Spark KV (système de stockage local)
- **Maps**: Google Maps API
- **Paiement**: Stripe
- **Notifications**: Email (SMTP) + Telegram Bot

## 🚀 Installation & Démarrage

```bash
# Installer les dépendances
npm install

# Lancer l'application en développement
npm run dev
```

L'application démarre sur `http://localhost:5173`

## ⚙️ Configuration

### Google Maps API (Obligatoire pour le calcul d'itinéraire)

Créez un fichier `.env.local` à la racine du projet :

```env
VITE_GOOGLE_MAPS_API_KEY=votre_clé_api_google_maps
```

Pour obtenir une clé API :
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un projet ou sélectionnez-en un existant
3. Activez les APIs : Maps JavaScript API, Directions API, Places API
4. Créez des credentials (API Key)
5. Copiez la clé dans `.env.local`

### Stripe (Optionnel - pour les paiements)

Ajoutez dans `.env.local` :

```env
VITE_STRIPE_PUBLIC_KEY=votre_clé_publique_stripe
```

Configuration dans l'admin → Onglet "Paramètres" → Section Stripe

Voir `STRIPE_SETUP_GUIDE.md` pour plus de détails.

### Email (Optionnel - pour les confirmations)

Configuration dans l'admin → Onglet "Paramètres" → Section Email

Voir `SMTP_SETUP_GUIDE.md` pour plus de détails.

### Telegram (Optionnel - pour les notifications admin)

Configuration dans l'admin → Onglet "Paramètres" → Section Telegram

## 👤 Connexion Administrateur

**Compte par défaut** :
- Email : `admin@greenshuttle.com`
- Mot de passe : `admin123`

⚠️ **Important** : Créez un nouveau compte admin et supprimez le compte par défaut pour la production.

## 📁 Structure du Projet

```
src/
├── components/          # Composants React
│   ├── ui/             # Composants Shadcn
│   ├── Header.tsx      # En-tête de navigation
│   ├── Hero.tsx        # Section hero page d'accueil
│   ├── BookingForm.tsx # Formulaire de réservation
│   ├── AdminDashboard.tsx  # Dashboard administrateur
│   └── ...
├── types/              # Définitions TypeScript
├── lib/                # Utilitaires et services
├── hooks/              # Custom React hooks
├── styles/             # Fichiers CSS
└── App.tsx             # Composant racine
```

## 📖 Documentation Complète

- **`PRD.md`** - Product Requirements Document complet
- **`TARIFICATION.md`** - Détails du système de tarification
- **`STRIPE_SETUP_GUIDE.md`** - Configuration des paiements Stripe
- **`SMTP_SETUP_GUIDE.md`** - Configuration des emails
- **`RESPONSIVE_GUIDE.md`** - Guide du design responsive
- **`TROUBLESHOOTING.md`** - Résolution de problèmes courants
- **`SECURITY.md`** - Recommandations de sécurité

## ✨ Fonctionnalités Avancées

### Tarification Intelligente
- Calcul automatique basé sur la distance et la durée
- Tarifs différenciés par véhicule
- Modes haute/basse saison
- Forfaits zones (aéroports, gares)
- Réductions aller-retour automatiques
- Codes promotionnels flexibles

### Gestion de Flotte Complète
- Upload d'images avec prévisualisation
- Éditeur visuel (zoom, position, fit)
- Ordre personnalisable par drag & drop
- Tarification individuelle par véhicule
- Capacité passagers et bagages

### Circuits Touristiques
- Versailles, Normandie, Mont-Saint-Michel, Wine Tour...
- Tarifs packagés par circuit
- Étapes multiples avec descriptions
- Réservation directe depuis les pages de service

### Système de Notifications
- Email de confirmation client (via SMTP)
- Notifications Telegram pour l'admin
- Mises à jour de statut automatiques
- Templates personnalisables

## 🔒 Sécurité

- Validation côté client ET serveur
- Sanitization des inputs utilisateur
- Gestion sécurisée des tokens Stripe
- Variables d'environnement pour les secrets
- Pas d'exposition de clés API dans le code

Voir `SECURITY.md` pour les recommandations complètes.

## 🐛 Résolution de Problèmes

### L'itinéraire ne se calcule pas
→ Vérifiez que votre clé Google Maps API est valide et que les APIs nécessaires sont activées

### Les données ne se sauvegardent pas
→ Le système utilise Spark KV (localStorage). Vérifiez que le localStorage n'est pas désactivé dans votre navigateur

### Erreur de paiement Stripe
→ Vérifiez la configuration Stripe dans l'admin et que votre clé publique est correcte

Voir `TROUBLESHOOTING.md` pour plus d'informations.

## 🚀 Déploiement en Production

1. **Variables d'environnement** - Configurez toutes les clés API nécessaires
2. **Compte admin** - Créez un nouveau compte et supprimez le compte par défaut
3. **Build** - `npm run build`
4. **Sécurité** - Activez HTTPS et configurez les CORS si nécessaire
5. **Tests** - Testez toutes les fonctionnalités critiques

## 📝 Licence

Propriétaire - ELGOH

## 🤝 Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement.

---

**Fait avec ❤️ en France** 🇫🇷
