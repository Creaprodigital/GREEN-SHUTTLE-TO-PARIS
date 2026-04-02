# 🔧 Configuration Supabase

## Vue d'ensemble

Cette application utilise **Supabase** comme base de données backend pour stocker toutes les données de manière persistante et synchronisée.

## 📋 Étapes de configuration

   - **Région**: Choisissez la 



2. Copiez les valeurs suivan
   - **anon public**: `eyJhbGc.
### 3. Configurer les variables d'environnement
Créez un fichier `.env.local` à la racine du projet:
```env
VITE_SUPABASE_ANON_KEY=votre-cle-an





  id TEXT PRIMARY KEY,
  description TEXT,
  "order" INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()

CREATE TABLE bookings (

  dropoff_location TEXT NOT NULL,

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon
```

⚠️ **Important**: Ne commitez jamais ce fichier dans Git!

### 4. Créer les tables

Dans le tableau de bord Supabase, allez dans **SQL Editor** et exécutez ce script:

```sql
-- Table pour les véhicules
CREATE TABLE fleet (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  "order" INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les réservations
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  pickup_date TEXT NOT NULL,
  pickup_time TEXT NOT NULL,
  service_type TEXT NOT NULL,
  passengers INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending',
  duration TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()


-- Table pour la tarification
CREATE TABLE pricing (
  color TEXT,
  vehicle_id TEXT NOT NULL,
  price_per_km NUMERIC NOT NULL,
  price_per_minute NUMERIC NOT NULL,
  price_per_hour NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les options de service
CREATE TABLE service_options (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  discount_value NUMERIC 
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
  

-- Table pour les circuits
CREATE TABLE circuits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration TEXT,
);
  pricing JSONB,
CREATE TABLE system_settings (
  updated_at TIMESTAMPTZ DEFAULT NOW()
  

-- Table pour les zones de tarification
CREATE TABLE pricing_zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
-- Activer RLS (Row 
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
AL

-- Table pour les forfaits zones
CREATE TABLE zone_forfaits (
-- Politiques RLS - Le
  from_zone TEXT NOT NULL,
CREATE POLICY "Public re
  vehicle_id TEXT NOT NULL,
CREATE POLICY "Public rea
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les codes promo
- ✅ RLS activé sur toutes 
- ⚠️ Pour la productio
## 📚 Documentation
- [Documentation Supabase](htt
- [Row Level Security](https://sup



























































































































- ✅ RLS activé sur toutes les tables
- ✅ Politiques configurées pour lecture publique / écriture contrôlée
- ⚠️ Pour la production, configurez l'authentification Supabase pour les admins

## 📚 Documentation

- [Documentation Supabase](https://supabase.com/docs)
- [JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
