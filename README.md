# 🚗 ELGOH - Chauffeur Privé en Île-de-France

Application de réservation de chauffeur privé premium avec système de gestion complet.

## 🆕 Migration Supabase

✅ **L'application utilise désormais Supabase comme backend de persistance.**

Cela résout tous les problèmes de sauvegarde des paramètres admin, véhicules, codes promo et autres données.

### 🚀 Démarrage rapide (5 minutes)

1. **Créez un projet Supabase** sur [https://supabase.com](https://supabase.com)
2. **Exécutez le script SQL** (voir `QUICKSTART_SUPABASE.md`)
3. **Configurez `.env.local`** avec vos clés API
4. **Redémarrez l'app**: `npm run dev`

➡️ **Guide complet**: `QUICKSTART_SUPABASE.md`

### 📚 Documentation Supabase

- **`QUICKSTART_SUPABASE.md`** - Démarrage rapide en 5 minutes ⚡
- **`SUPABASE_README.md`** - Vue d'ensemble et fonctionnalités
- **`SUPABASE_SETUP.md`** - Configuration détaillée
- **`SUPABASE_MIGRATION.md`** - Guide de migration complet

## 🎯 Fonctionnalités

### Pour les clients
- 📅 Réservation de chauffeur privé
- 🗺️ Calcul d'itinéraire et tarification
- 💳 Paiement en ligne (Stripe)
- 📱 Tableau de bord client
- 🎫 Application de codes promo
- 🚗 Choix du véhicule

### Pour les administrateurs
- 📊 Dashboard admin complet
- 🚗 Gestion de la flotte
- 💰 Configuration des tarifs
- 🎟️ Gestion des codes promo
- 📍 Zones et forfaits
- 🗺️ Circuits touristiques
- 👥 Gestion des réservations
- ⚙️ Paramètres système

## 🛠️ Technologies

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **UI**: Shadcn/ui + Phosphor Icons
- **Backend**: Supabase (PostgreSQL)
- **Cartes**: Google Maps API
- **Paiement**: Stripe
- **Notifications**: Email + Telegram

## 🚀 Installation

```bash
# Cloner le projet
git clone [votre-repo]

# Installer les dépendances
npm install

# Configurer Supabase
cp .env.local.example .env.local
# Éditez .env.local avec vos clés Supabase

# Lancer l'application
npm run dev
```

## 📖 Documentation

### Configuration
- `SUPABASE_SETUP.md` - Configuration Supabase
- `STRIPE_SETUP_GUIDE.md` - Configuration Stripe
- `SMTP_SETUP_GUIDE.md` - Configuration Email

### Architecture
- `PRD.md` - Product Requirements Document
- `DATABASE_README.md` - Structure de données
- `TARIFICATION.md` - Système de tarification

### Guides
- `RESPONSIVE_GUIDE.md` - Design responsive
- `TROUBLESHOOTING.md` - Dépannage
- `SECURITY.md` - Sécurité

## ✨ Nouveautés avec Supabase

- ✅ **Persistance garantie** - Plus de perte de données
- ✅ **Synchronisation temps réel** - Mise à jour automatique
- ✅ **Sauvegarde automatique** - Données sécurisées
- ✅ **Multi-utilisateurs** - Sync entre onglets/appareils
- ✅ **Scalabilité** - Supporte des milliers de réservations

## 🐛 Problèmes résolus

Le passage à Supabase résout:
- ❌ Problème de sauvegarde des véhicules dans l'admin
- ❌ Problème de sauvegarde des codes promo
- ❌ Perte de données après rechargement
- ❌ Problèmes de synchronisation

## 🔐 Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Authentification sécurisée
- Variables d'environnement pour les clés API
- Validation côté serveur

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
