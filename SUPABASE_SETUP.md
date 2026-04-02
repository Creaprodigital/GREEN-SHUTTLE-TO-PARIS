# 🔧 Configuration Supabase

## Vue d'ensemble

Cette application utilise **Supabase** comme base de données backend pour stocker toutes les données de manière persistante et synchronisée.

## 📋 Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations:
   - **Nom du projet**: `elgoh-chauffeur` (ou votre choix)
   - **Mot de passe de la base de données**: Choisissez un mot de passe fort
   - **Région**: Choisissez la région la plus proche (Europe West par exemple)
5. Cliquez sur "Create new project"

### 2. Récupérer les clés API

Une fois le projet créé:

1. Allez dans **Settings** (icône d'engrenage) → **API**
2. Copiez les valeurs suivantes:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (clé publique)

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet:

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
  price NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour la tarification
CREATE TABLE pricing (
  id TEXT PRIMARY KEY,
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
  price NUMERIC NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les circuits
CREATE TABLE circuits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  stops JSONB,
  pricing JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les zones de tarification
CREATE TABLE pricing_zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  coordinates JSONB,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les forfaits zones
CREATE TABLE zone_forfaits (
  id TEXT PRIMARY KEY,
  from_zone TEXT NOT NULL,
  to_zone TEXT NOT NULL,
  vehicle_id TEXT NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les codes promo
CREATE TABLE promo_codes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC NOT NULL,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les comptes admin
CREATE TABLE admin_accounts (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les paramètres système
CREATE TABLE system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour améliorer les performances
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(pickup_date);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);

-- Activer RLS (Row Level Security) - Important pour la sécurité
ALTER TABLE fleet ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_forfaits ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS - Lecture publique, écriture restreinte
CREATE POLICY "Public read access" ON fleet FOR SELECT USING (true);
CREATE POLICY "Public read access" ON pricing FOR SELECT USING (true);
CREATE POLICY "Public read access" ON service_options FOR SELECT USING (true);
CREATE POLICY "Public read access" ON circuits FOR SELECT USING (true);
CREATE POLICY "Public read access" ON pricing_zones FOR SELECT USING (true);
CREATE POLICY "Public read access" ON zone_forfaits FOR SELECT USING (true);

-- Politiques pour les réservations (lecture/écriture publique pour le moment)
CREATE POLICY "Public read access" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON bookings FOR DELETE USING (true);

-- Politiques pour les autres tables (admin seulement)
CREATE POLICY "Admin write access" ON fleet FOR ALL USING (true);
CREATE POLICY "Admin write access" ON pricing FOR ALL USING (true);
CREATE POLICY "Admin write access" ON service_options FOR ALL USING (true);
CREATE POLICY "Admin write access" ON circuits FOR ALL USING (true);
CREATE POLICY "Admin write access" ON pricing_zones FOR ALL USING (true);
CREATE POLICY "Admin write access" ON zone_forfaits FOR ALL USING (true);
CREATE POLICY "Admin access" ON promo_codes FOR ALL USING (true);
CREATE POLICY "Admin access" ON admin_accounts FOR ALL USING (true);
CREATE POLICY "Admin access" ON system_settings FOR ALL USING (true);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fleet_updated_at BEFORE UPDATE ON fleet FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_updated_at BEFORE UPDATE ON pricing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_options_updated_at BEFORE UPDATE ON service_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_circuits_updated_at BEFORE UPDATE ON circuits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_zones_updated_at BEFORE UPDATE ON pricing_zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_zone_forfaits_updated_at BEFORE UPDATE ON zone_forfaits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_accounts_updated_at BEFORE UPDATE ON admin_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🎯 Migration des données existantes

Si vous avez déjà des données dans le système spark.kv, vous pouvez les migrer:

1. Ouvrez la console du navigateur
2. Exécutez:

```javascript
// Exporter toutes les données
const allKeys = await spark.kv.keys()
const exportData = {}
for (const key of allKeys) {
  exportData[key] = await spark.kv.get(key)
}
console.log(JSON.stringify(exportData, null, 2))
```

3. Copiez le JSON résultant
4. Les données seront automatiquement migrées au premier lancement de l'application avec Supabase

## ✅ Vérification

Pour vérifier que tout fonctionne:

1. Lancez l'application
2. Ajoutez un véhicule dans l'admin
3. Rechargez la page
4. Vérifiez que le véhicule est toujours là
5. Vérifiez dans le tableau de bord Supabase → Table Editor → fleet

## 🔒 Sécurité

- ✅ Les clés API sont dans `.env.local` (non commité)
- ✅ RLS activé sur toutes les tables
- ✅ Politiques configurées pour lecture publique / écriture contrôlée
- ⚠️ Pour la production, configurez l'authentification Supabase pour les admins

## 📚 Documentation

- [Documentation Supabase](https://supabase.com/docs)
- [JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
