# ⚡ DÉMARRAGE RAPIDE - Migration Supabase

## 🎯 En 5 minutes

### Étape 1: Créer un projet Supabase (2 min)

1. **Allez sur** [https://supabase.com](https://supabase.com)
2. **Créez un compte** (GitHub ou email)
3. **Nouveau projet**:
   - Nom: `elgoh-chauffeur`
   - Mot de passe BDD: choisissez un mot de passe fort (notez-le quelque part)
   - Région: `Europe West` (ou la plus proche)
4. **Attendez** ~2 minutes (le projet se crée)

### Étape 2: Créer les tables (1 min)

1. Dans votre projet Supabase, cliquez sur **SQL Editor** (icône </> à gauche)
2. Cliquez sur **+ New query**
3. **Copiez-collez** ce script et cliquez **Run**:

```sql
-- Créer toutes les tables
CREATE TABLE fleet (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, image TEXT, "order" INTEGER, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE bookings (id TEXT PRIMARY KEY, email TEXT NOT NULL, pickup_location TEXT NOT NULL, dropoff_location TEXT NOT NULL, pickup_date TEXT NOT NULL, pickup_time TEXT NOT NULL, service_type TEXT NOT NULL, passengers INTEGER DEFAULT 1, status TEXT DEFAULT 'pending', price NUMERIC, notes TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE pricing (id TEXT PRIMARY KEY, vehicle_id TEXT NOT NULL, price_per_km NUMERIC NOT NULL, price_per_minute NUMERIC NOT NULL, price_per_hour NUMERIC NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE service_options (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, price NUMERIC NOT NULL, icon TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE circuits (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, duration TEXT, stops JSONB, pricing JSONB, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE pricing_zones (id TEXT PRIMARY KEY, name TEXT NOT NULL, coordinates JSONB, color TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE zone_forfaits (id TEXT PRIMARY KEY, from_zone TEXT NOT NULL, to_zone TEXT NOT NULL, vehicle_id TEXT NOT NULL, price NUMERIC NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE promo_codes (id TEXT PRIMARY KEY, code TEXT UNIQUE NOT NULL, discount_type TEXT NOT NULL, discount_value NUMERIC NOT NULL, valid_from TIMESTAMPTZ, valid_until TIMESTAMPTZ, max_uses INTEGER, current_uses INTEGER DEFAULT 0, active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE admin_accounts (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE system_settings (key TEXT PRIMARY KEY, value JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());

-- Indexes
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_status ON bookings(status);

-- RLS
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

-- Politiques (accès public pour simplifier)
CREATE POLICY "Public access" ON fleet FOR ALL USING (true);
CREATE POLICY "Public access" ON pricing FOR ALL USING (true);
CREATE POLICY "Public access" ON service_options FOR ALL USING (true);
CREATE POLICY "Public access" ON circuits FOR ALL USING (true);
CREATE POLICY "Public access" ON pricing_zones FOR ALL USING (true);
CREATE POLICY "Public access" ON zone_forfaits FOR ALL USING (true);
CREATE POLICY "Public access" ON bookings FOR ALL USING (true);
CREATE POLICY "Public access" ON promo_codes FOR ALL USING (true);
CREATE POLICY "Public access" ON admin_accounts FOR ALL USING (true);
CREATE POLICY "Public access" ON system_settings FOR ALL USING (true);
```

✅ Vous devriez voir "Success. No rows returned"

### Étape 3: Récupérer les clés API (30 sec)

1. Cliquez sur **Settings** (⚙️ en bas à gauche)
2. Cliquez sur **API** dans la sidebar
3. **Copiez** ces 2 valeurs:
   - `Project URL` → exemple: `https://abcdefgh.supabase.co`
   - `anon public` → exemple: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Étape 4: Configurer l'application (1 min)

1. **Dans votre projet**, créez le fichier `.env.local`:

```bash
# Depuis le terminal
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=COLLEZ_ICI_VOTRE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=COLLEZ_ICI_VOTRE_ANON_KEY
EOF
```

2. **Éditez** `.env.local` et remplacez par vos vraies valeurs

Exemple de résultat:
```env
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjY0NDQwMDAsImV4cCI6MTk0MjAyMDAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Étape 5: Redémarrer l'app (30 sec)

```bash
# Ctrl+C pour arrêter si elle tourne
npm run dev
```

Vous devriez voir dans la console navigateur (F12):
```
✅ Supabase configuré et connecté
```

## ✅ Test de validation

1. **Allez dans l'admin** (bouton "Client / Admin" → cocher "Admin" → entrer un email)
2. **Onglet "Véhicules"** → Ajoutez un véhicule test
3. **Rechargez la page** (F5)
4. Le véhicule est toujours là? ✅ **Ça marche!**
5. **Vérifiez dans Supabase**: Table Editor → fleet → le véhicule apparaît

## 🎉 C'est terminé!

Votre application utilise maintenant Supabase. Tous les problèmes de sauvegarde sont résolus.

### Ce qui a changé

- ✅ Les véhicules ajoutés **persistent** même après rechargement
- ✅ Les codes promo **se sauvegardent** correctement
- ✅ Les paramètres admin **sont conservés**
- ✅ Les réservations **ne se perdent plus**
- ✅ Synchronisation **temps réel** entre onglets

## 🐛 Ça ne marche pas?

### Vérifiez `.env.local`

```bash
cat .env.local
```

Devrait afficher vos 2 variables. Si vide ou erreur → refaites l'étape 4.

### Vérifiez la console navigateur

Appuyez sur F12, onglet Console. Vous devriez voir:

```
✅ Supabase configuré et connecté
```

Si vous voyez:
```
⚠️ Variables Supabase manquantes...
```

➡️ Le fichier `.env.local` n'est pas bon ou n'existe pas.

### Le véhicule ne se sauvegarde toujours pas

1. F12 → Onglet Network
2. Ajoutez un véhicule
3. Regardez les requêtes vers Supabase
4. S'il y a une erreur rouge → notez le message et consultez `SUPABASE_MIGRATION.md`

### Supabase dit "relation does not exist"

➡️ Les tables ne sont pas créées. Refaites l'étape 2 (script SQL).

## 📚 Documentation complète

- **`SUPABASE_README.md`** - Vue d'ensemble
- **`SUPABASE_SETUP.md`** - Configuration détaillée
- **`SUPABASE_MIGRATION.md`** - Guide de migration complet

## 🎓 Utilisation

### Ajouter des données initiales

Exemple: Ajouter 3 véhicules de base

Dans Supabase → SQL Editor:

```sql
INSERT INTO fleet (id, title, description, "order") VALUES
  ('business', 'BUSINESS CLASS', 'Berline premium Mercedes Classe E', 1),
  ('first', 'FIRST CLASS', 'Berline luxe Mercedes Classe S', 2),
  ('van', 'VAN PREMIUM', 'Van Mercedes Classe V 7 places', 3);
  
INSERT INTO pricing (id, vehicle_id, price_per_km, price_per_minute, price_per_hour) VALUES
  ('pricing-business', 'business', 1.80, 0.50, 45.00),
  ('pricing-first', 'first', 2.50, 0.70, 65.00),
  ('pricing-van', 'van', 2.20, 0.60, 55.00);
```

Rechargez l'application → les 3 véhicules apparaissent!

## 💡 Conseils

### Sauvegarder vos données

Supabase fait des backups automatiques, mais vous pouvez aussi exporter:

1. Supabase → Table Editor
2. Sélectionnez une table (ex: fleet)
3. En haut à droite → bouton "..." → Export to CSV

### Voir les logs en temps réel

Supabase → Logs → sélectionnez la table → voyez toutes les opérations

### Monitorer les performances

Supabase → Dashboard → voyez le nombre de requêtes, la bande passante, etc.

## 🚀 Prochaines étapes recommandées

1. Ajoutez vos véhicules dans l'admin
2. Configurez vos tarifs
3. Créez des codes promo
4. Testez une réservation
5. Explorez le dashboard Supabase

---

**Besoin d'aide?** Consultez `SUPABASE_MIGRATION.md` pour des détails ou ouvrez un issue.

**Migration réussie!** 🎉 Tous les modules du site utilisent désormais Supabase.
