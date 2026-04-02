# 🔄 Migration vers Supabase - Guide Complet

## 🎯 Objectif

Migrer toutes les données de `spark.kv` (stockage local navigateur) vers **Supabase** (base de données cloud PostgreSQL) pour résoudre les problèmes de persistance et permettre une synchronisation multi-utilisateurs.

## ✅ Avantages de Supabase

- **Persistance garantie**: Les données survivent aux nettoyages du cache navigateur
- **Synchronisation temps réel**: Mise à jour automatique entre plusieurs onglets/utilisateurs
- **Sauvegarde automatique**: Supabase sauvegarde automatiquement vos données
- **Scalabilité**: Supporte des milliers de réservations sans problème
- **Sécurité**: Row Level Security (RLS) pour protéger les données sensibles

## 📋 Étapes de migration

### Étape 1: Configurer Supabase

Suivez le guide `SUPABASE_SETUP.md` pour:
1. Créer un compte Supabase
2. Créer un nouveau projet
3. Récupérer vos clés API
4. Créer les tables avec le script SQL fourni

### Étape 2: Configurer les variables d'environnement

1. Copiez `.env.local.example` vers `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Modifiez `.env.local` avec vos vraies clés:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Étape 3: Redémarrer l'application

```bash
npm run dev
```

L'application détectera automatiquement la configuration Supabase.

### Étape 4: Vérifier la migration

1. **Ouvrez la console du navigateur** (F12)
2. Vous devriez voir: `✅ Supabase configuré et connecté`
3. **Ajoutez un véhicule** dans l'admin
4. **Vérifiez dans Supabase**:
   - Allez sur [supabase.com](https://supabase.com)
   - Ouvrez votre projet
   - Allez dans **Table Editor** → **fleet**
   - Le véhicule devrait apparaître

### Étape 5: Migrer les données existantes (si nécessaire)

Si vous avez déjà des données dans `spark.kv`:

#### A. Exporter depuis spark.kv

Ouvrez la console navigateur et exécutez:

```javascript
// Exporter toutes les données
const exportData = async () => {
  const keys = await spark.kv.keys()
  const data = {}
  
  for (const key of keys) {
    data[key] = await spark.kv.get(key)
  }
  
  console.log('📦 Données exportées:')
  console.log(JSON.stringify(data, null, 2))
  
  // Copier dans le presse-papiers
  await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
  console.log('✅ Copié dans le presse-papiers!')
}

exportData()
```

#### B. Importer dans Supabase

##### Option 1: Via l'interface admin (Recommandé)

L'application détecte automatiquement les anciennes données et propose de les migrer.

##### Option 2: Manuellement via SQL

1. Allez dans **SQL Editor** sur Supabase
2. Utilisez ce template pour chaque table:

```sql
-- Exemple pour la table fleet
INSERT INTO fleet (id, title, description, image, "order")
VALUES 
  ('business', 'BUSINESS CLASS', 'Berline premium', '', 1),
  ('first-class', 'FIRST CLASS', 'Berline de luxe', '', 2),
  ('suv', 'SUV PREMIUM', 'SUV haut de gamme', '', 3);

-- Exemple pour la table promo_codes
INSERT INTO promo_codes (id, code, discount_type, discount_value, active)
VALUES 
  ('promo-1', 'WELCOME10', 'percentage', 10, true);
```

## 🔍 Vérification post-migration

### Checklist

- [ ] Les véhicules s'affichent sur la page d'accueil
- [ ] Les tarifs sont corrects dans le calculateur
- [ ] Les options de service sont disponibles
- [ ] Les codes promo fonctionnent
- [ ] Les circuits touristiques s'affichent
- [ ] Les réservations peuvent être créées
- [ ] Les réservations apparaissent dans le tableau de bord admin
- [ ] Les modifications admin sont sauvegardées immédiatement
- [ ] Après un rechargement de page, les données sont toujours là
- [ ] Dans Supabase Table Editor, toutes les tables contiennent les données

### Tests de persistance

1. **Test véhicule**:
   - Ajoutez un nouveau véhicule
   - Rechargez la page (F5)
   - Le véhicule doit être toujours là
   - Vérifiez dans Supabase → fleet

2. **Test code promo**:
   - Créez un code promo "TEST20" avec 20% de réduction
   - Rechargez la page
   - Le code doit toujours exister
   - Vérifiez dans Supabase → promo_codes

3. **Test réservation**:
   - Créez une réservation sur la page d'accueil
   - Connectez-vous en admin
   - La réservation doit apparaître
   - Vérifiez dans Supabase → bookings

## 🐛 Dépannage

### Problème: "Supabase non configuré"

**Solution**: Vérifiez que `.env.local` existe et contient les bonnes clés.

```bash
cat .env.local
```

### Problème: "Failed to fetch"

**Solution**: 
1. Vérifiez que l'URL Supabase est correcte
2. Vérifiez que le projet Supabase est démarré
3. Vérifiez votre connexion internet

### Problème: "Row Level Security policy violation"

**Solution**: Vérifiez que vous avez bien exécuté toutes les politiques RLS dans le script SQL.

```sql
-- Vérifier les politiques
SELECT * FROM pg_policies WHERE tablename = 'fleet';
```

### Problème: Les données n'apparaissent pas

**Solution**:
1. Ouvrez la console navigateur (F12)
2. Regardez l'onglet Network
3. Cherchez les requêtes vers Supabase
4. Vérifiez s'il y a des erreurs (code 400, 401, 500)

### Problème: "duplicate key value violates unique constraint"

**Solution**: Il y a un conflit d'ID. Supprimez les anciennes données:

```sql
-- Dans SQL Editor de Supabase
TRUNCATE TABLE fleet CASCADE;
TRUNCATE TABLE pricing CASCADE;
-- etc.
```

## 📊 Structure des données

### Tables créées

| Table | Description | Nombre d'enregistrements typique |
|-------|-------------|----------------------------------|
| `fleet` | Véhicules de la flotte | 3-10 |
| `bookings` | Réservations clients | 0-∞ |
| `pricing` | Tarifs par véhicule | 3-10 |
| `service_options` | Options supplémentaires | 5-20 |
| `circuits` | Circuits touristiques | 5-15 |
| `pricing_zones` | Zones géographiques | 10-50 |
| `zone_forfaits` | Forfaits zone à zone | 50-500 |
| `promo_codes` | Codes promotionnels | 0-100 |
| `admin_accounts` | Comptes administrateurs | 1-10 |
| `system_settings` | Paramètres système | 10-20 |

## 🔄 Synchronisation temps réel

L'application écoute les changements en temps réel. Si un admin modifie une donnée:

1. **Supabase envoie une notification** via WebSocket
2. **L'application recharge automatiquement** les données
3. **Tous les utilisateurs voient la mise à jour** immédiatement

Test:
1. Ouvrez 2 onglets de l'admin
2. Dans l'onglet 1, modifiez un véhicule
3. L'onglet 2 devrait se mettre à jour automatiquement

## 🔒 Sécurité

### Données sensibles

Les **mots de passe admin** sont hashés avant stockage:
- ✅ Jamais stockés en clair
- ✅ Hashés avec bcrypt
- ✅ Non réversibles

### Row Level Security (RLS)

- **Lecture publique**: fleet, pricing, service_options, circuits, zones
- **Lecture/écriture publique**: bookings (pour les clients)
- **Admin seulement**: promo_codes, admin_accounts, system_settings

### Variables d'environnement

- ✅ `.env.local` dans `.gitignore`
- ✅ Jamais commité dans Git
- ✅ Clés régénérables depuis Supabase

## 📈 Performance

### Optimisations appliquées

- **Indexes** sur les colonnes fréquemment recherchées
- **Triggers** pour mettre à jour `updated_at` automatiquement
- **Subscriptions WebSocket** pour le temps réel
- **Cache local** dans les hooks React

### Limites

- **Supabase Free Tier**:
  - 500 Mo de base de données
  - 1 Go de bande passante
  - 50 000 utilisateurs actifs mensuels
  - 500 000 requêtes edge functions

Pour cette application, c'est largement suffisant même pour des centaines de réservations par mois.

## 🆘 Support

### Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [API Reference](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Discord](https://discord.supabase.com/)

### Logs

Pour débugger, activez les logs détaillés:

```typescript
// Dans src/lib/supabase.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  // ... config existante
  global: {
    headers: {
      'x-application': 'elgoh-chauffeur'
    }
  },
  // Ajoutez ceci pour débugger
  log: {
    level: 'debug'
  }
})
```

## ✅ Checklist finale

Avant de déployer en production:

- [ ] Toutes les tables sont créées dans Supabase
- [ ] Les politiques RLS sont configurées
- [ ] Les variables d'environnement sont configurées
- [ ] Les données de test ont été migrées
- [ ] Les tests de persistance passent
- [ ] La synchronisation temps réel fonctionne
- [ ] Les performances sont satisfaisantes
- [ ] Les sauvegardes automatiques sont actives (Supabase)
- [ ] La documentation est à jour

## 🚀 Prochaines étapes

Après la migration réussie:

1. **Activer l'authentification Supabase** pour les admins
2. **Configurer les emails transactionnels** via Supabase
3. **Ajouter des webhooks** pour les notifications
4. **Configurer un backup quotidien** supplémentaire
5. **Monitorer les performances** via le dashboard Supabase

Bonne migration! 🎉
