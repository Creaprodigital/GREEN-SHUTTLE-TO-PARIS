# 🚀 Migration Supabase - ELGOH Chauffeur

## 📌 Statut actuel

✅ **Supabase intégré** - L'application utilise désormais Supabase comme backend de persistance.

## 🎯 Problème résolu

Le système précédent (`spark.kv`) stockait les données dans le navigateur (localStorage), ce qui causait:
- ❌ Perte de données lors du nettoyage du cache
- ❌ Problèmes de synchronisation entre onglets
- ❌ Impossibilité de sauvegarder les paramètres admin de manière fiable

**Supabase résout tous ces problèmes** avec une base de données PostgreSQL cloud robuste et scalable.

## 🔧 Configuration rapide

### 1. Créer un projet Supabase

```bash
# 1. Allez sur https://supabase.com
# 2. Créez un compte (gratuit)
# 3. Créez un nouveau projet
# 4. Attendez 2 minutes que le projet soit prêt
```

### 2. Exécuter le script SQL

1. Dans Supabase, allez dans **SQL Editor**
2. Copiez le contenu du fichier `SUPABASE_SETUP.md` (section "Créer les tables")
3. Collez et exécutez le script SQL
4. Toutes les tables seront créées automatiquement

### 3. Configurer les clés API

```bash
# Copiez le fichier d'exemple
cp .env.local.example .env.local

# Éditez .env.local avec vos vraies clés
# (trouvables dans Settings > API de votre projet Supabase)
```

Fichier `.env.local`:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Redémarrer l'application

```bash
npm run dev
```

## ✅ Vérification

### Console navigateur

Vous devriez voir:
```
✅ Supabase configuré et connecté
🔄 Chargement des données depuis Supabase...
✅ Données chargées: fleet (3), bookings (0), pricing (3)...
```

### Test rapide

1. **Admin**: Allez dans l'admin et ajoutez un véhicule
2. **Rechargez** la page (F5)
3. **Vérifiez**: Le véhicule doit toujours être là
4. **Supabase**: Allez dans Table Editor > fleet, le véhicule doit apparaître

## 📦 Modules migrés vers Supabase

Tous les modules du site utilisent maintenant Supabase:

| Module | Table Supabase | Status |
|--------|----------------|--------|
| 🚗 Flotte de véhicules | `fleet` | ✅ Migré |
| 📅 Réservations | `bookings` | ✅ Migré |
| 💰 Tarification | `pricing` | ✅ Migré |
| 🎁 Options de service | `service_options` | ✅ Migré |
| 🗺️ Circuits touristiques | `circuits` | ✅ Migré |
| 📍 Zones géographiques | `pricing_zones` | ✅ Migré |
| 🎟️ Forfaits zones | `zone_forfaits` | ✅ Migré |
| 🏷️ Codes promo | `promo_codes` | ✅ Migré |
| 👤 Comptes admin | `admin_accounts` | ✅ Migré |
| ⚙️ Paramètres système | `system_settings` | ✅ Migré |

## 🔄 Migration des données existantes

Si vous avez déjà des données dans l'ancien système:

### Export automatique

Ouvrez la console navigateur (F12) et exécutez:

```javascript
const exportAll = async () => {
  const keys = [
    'fleet', 'bookings', 'pricing', 'service-options',
    'circuits', 'pricing-zones', 'zone-forfaits',
    'promo-codes', 'admin-accounts'
  ]
  
  const data = {}
  for (const key of keys) {
    const value = await spark.kv.get(key)
    if (value) data[key] = value
  }
  
  console.log('📦 Données exportées:')
  console.log(JSON.stringify(data, null, 2))
  
  // Copie dans le presse-papiers
  await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
  console.log('✅ Copié!')
}

exportAll()
```

### Import dans Supabase

L'application détectera automatiquement les données de l'ancien système et proposera de les migrer vers Supabase au premier lancement.

## 🎓 Utilisation

### Pour les développeurs

#### Avant (avec useKV)

```typescript
import { useKV } from '@github/spark/hooks'

const [vehicles, setVehicles] = useKV<VehicleClass[]>('fleet', [])
```

#### Maintenant (avec useSupabase)

```typescript
import { useSupabase } from '@/hooks/useSupabase'

const [vehicles, setVehicles] = useSupabase<VehicleClass[]>('fleet', [])
```

**C'est transparent!** L'API est identique, mais les données sont maintenant dans Supabase.

### Fallback automatique

Si Supabase n'est pas configuré, l'application utilise automatiquement `spark.kv` comme fallback. Aucune erreur!

## 🔧 Architecture

```
┌─────────────────┐
│  React App      │
│  (Frontend)     │
└────────┬────────┘
         │
         │ useSupabase hook
         │
         ├─── Supabase configuré?
         │         │
         │    ┌────┴────┐
         │   OUI       NON
         │    │         │
         │    ▼         ▼
         │  ┌──────┐  ┌──────┐
         │  │Supa  │  │ KV   │
         │  │base  │  │Local │
         └──┤Cloud │  │Store │
            └──────┘  └──────┘
```

## 📊 Synchronisation temps réel

Supabase envoie des notifications WebSocket quand les données changent.

**Test**:
1. Ouvrez 2 onglets de l'admin
2. Dans l'onglet 1, ajoutez un véhicule
3. L'onglet 2 se met à jour **automatiquement**! ⚡

## 🐛 Dépannage

### "Supabase non configuré"

➡️ Vérifiez `.env.local`:
```bash
cat .env.local
```

### "Failed to fetch"

➡️ Vérifiez:
1. L'URL Supabase est correcte
2. La clé API est correcte
3. Le projet Supabase est démarré (pas en pause)

### "Policy violation"

➡️ Exécutez à nouveau le script SQL complet (section RLS)

### Les données ne se sauvegardent pas

1. Ouvrez la console (F12)
2. Onglet **Network**
3. Filtrez par "supabase"
4. Cherchez les erreurs HTTP (400, 401, 500)

## 📚 Documentation complète

- `SUPABASE_SETUP.md` - Configuration détaillée de Supabase
- `SUPABASE_MIGRATION.md` - Guide de migration complet
- `DATABASE_README.md` - Documentation de la structure de données

## 🔒 Sécurité

### Row Level Security (RLS)

- ✅ Activé sur toutes les tables
- ✅ Lecture publique pour fleet, pricing, options, circuits
- ✅ Admin seulement pour promo_codes, admin_accounts
- ✅ Clients peuvent voir leurs propres réservations

### Variables d'environnement

- ✅ `.env.local` dans `.gitignore`
- ✅ Clés jamais commitées dans Git
- ✅ Régénérables depuis Supabase

## 🚀 Performance

### Optimisations

- **Indexes** sur colonnes fréquemment recherchées
- **Cache local** dans les hooks React
- **Subscriptions WebSocket** pour le temps réel
- **Requêtes optimisées** avec select spécifiques

### Limites Supabase (Gratuit)

- 500 Mo de base de données
- 1 Go de bande passante/mois
- 50 000 utilisateurs actifs/mois
- 500 000 requêtes/mois

**Largement suffisant** pour cette application! 🎉

## ✨ Fonctionnalités

### Nouvelles capacités

- 🔄 **Synchronisation temps réel** entre utilisateurs
- 💾 **Persistance garantie** même après nettoyage cache
- 📊 **Analytics** via le dashboard Supabase
- 🔍 **Recherche avancée** avec SQL
- 📈 **Scalabilité** illimitée
- 🔐 **Sécurité** renforcée avec RLS
- 📱 **Multi-appareils** - les données sont partout
- 🌍 **Accessible de n'importe où** (cloud)

## 🎯 Prochaines étapes

Après la migration:

1. [ ] Activer l'authentification Supabase pour les admins
2. [ ] Configurer les emails transactionnels
3. [ ] Ajouter des webhooks pour notifications externes
4. [ ] Monitorer les performances via Supabase Dashboard
5. [ ] Configurer un backup quotidien supplémentaire

## 🆘 Support

Besoin d'aide?

1. Consultez `SUPABASE_MIGRATION.md` pour des détails
2. Vérifiez les logs dans la console navigateur
3. Consultez [Documentation Supabase](https://supabase.com/docs)
4. Rejoignez [Supabase Discord](https://discord.supabase.com/)

---

**Migration réalisée avec succès!** 🎉

Tous les problèmes de persistance sont maintenant résolus. Les paramètres admin, véhicules, codes promo, et toutes les données sont sauvegardés de manière fiable dans Supabase.
