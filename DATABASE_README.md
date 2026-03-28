# 🗄️ Base de Données - Système de Persistance

## Vue d'ensemble

Cette application utilise **`useKV`** de Spark comme système de base de données persistante. Toutes les données sont automatiquement enregistrées et survivent aux rechargements de page et aux déconnexions.

## 📦 Données stockées

### Véhicules (Flotte)
- **Clé**: `fleet`
- **Données**: Informations sur les véhicules (titre, description, images)
- **Gestion**: Onglet "Véhicules" dans l'admin

### Réservations
- **Clé**: `bookings`
- **Données**: Toutes les réservations clients
- **Gestion**: Onglet "Réservations" dans l'admin

### Tarification
- **Clé**: `pricing`
- **Données**: Tarifs au km/minute/heure pour chaque véhicule
- **Gestion**: Onglet "Tarifs" dans l'admin

### Options de service
- **Clé**: `service-options`
- **Données**: Options supplémentaires (siège bébé, Wi-Fi, etc.)
- **Gestion**: Onglet "Options" dans l'admin

### Circuits touristiques
- **Clé**: `circuits`
- **Données**: Circuits prédéfinis avec tarifs
- **Gestion**: Onglet "Circuits" dans l'admin

### Zones de tarification
- **Clés**: `pricing-zones` et `zone-forfaits`
- **Données**: Zones géographiques et tarifs forfaitaires
- **Gestion**: Section "Forfaits Zone à Zone" dans l'onglet "Tarifs"

### Codes promo
- **Clé**: `promo-codes`
- **Données**: Codes promotionnels et réductions
- **Gestion**: Onglet "Promos" dans l'admin

### Paramètres système
- **Clés**: `telegram-settings`, `email-settings`, `stripe-settings`
- **Données**: Configuration des notifications et paiements
- **Gestion**: Onglet "Paramètres" dans l'admin

### Comptes administrateurs
- **Clé**: `admin-accounts`
- **Données**: Liste des comptes admin avec mots de passe
- **Gestion**: Onglet "Admins" dans l'admin

## 🔧 Utilisation de la base de données

### Dans React (avec useKV)

```typescript
import { useKV } from '@github/spark/hooks'

// Lecture et écriture
const [vehicles, setVehicles] = useKV<VehicleClass[]>('fleet', DEFAULT_FLEET)

// ✅ CORRECT - Mise à jour fonctionnelle
setVehicles((current) => [...current, newVehicle])

// ❌ INCORRECT - Ne jamais faire ça
setVehicles([...vehicles, newVehicle])  // Risque de perte de données!
```

### Hors React (API directe)

```typescript
// Lire une valeur
const fleet = await spark.kv.get<VehicleClass[]>('fleet')

// Écrire une valeur
await spark.kv.set('fleet', newFleetData)

// Supprimer une valeur
await spark.kv.delete('fleet')

// Lister toutes les clés
const allKeys = await spark.kv.keys()
```

## 📋 Toutes les clés de la base de données

| Clé | Type | Description |
|-----|------|-------------|
| `fleet` | `VehicleClass[]` | Véhicules de la flotte |
| `bookings` | `Booking[]` | Réservations clients |
| `pricing` | `VehiclePricing[]` | Tarifs au km/min/h |
| `service-options` | `ServiceOption[]` | Options supplémentaires |
| `circuits` | `Circuit[]` | Circuits touristiques |
| `pricing-zones` | `PricingZone[]` | Zones géographiques |
| `zone-forfaits` | `ZoneForfait[]` | Forfaits zone à zone |
| `promo-codes` | `PromoCode[]` | Codes promotionnels |
| `roundtrip-discount` | `RoundTripDiscount` | Réduction aller-retour |
| `active-pricing-mode` | `'high-demand' \| 'low-season'` | Mode tarifaire actif |
| `pricing-settings` | `PricingSettings` | Paramètres de tarification |
| `admin-accounts` | `AdminAccount[]` | Comptes administrateurs |
| `telegram-settings` | `TelegramSettings` | Config Telegram |
| `email-settings` | `EmailSettings` | Config Email |
| `stripe-settings` | `StripeSettings` | Config Stripe |
| `current-user` | `User \| null` | Utilisateur connecté |

## 🚨 Règles importantes

### ✅ À FAIRE

1. **Toujours utiliser des mises à jour fonctionnelles**
```typescript
setData((current) => {
  // Travailler avec 'current'
  return newData
})
```

2. **Vérifier que les données sont un tableau avant de mapper**
```typescript
setVehicles((current) => {
  const data = Array.isArray(current) ? current : DEFAULT_FLEET
  return data.map(/* ... */)
})
```

3. **Enregistrer immédiatement après une modification**
```typescript
setVehicles((current) => [...current, newVehicle])
toast.success('Véhicule ajouté')  // Confirmation immédiate
```

### ❌ À NE PAS FAIRE

1. **Ne jamais référencer directement la valeur du state**
```typescript
// ❌ MAUVAIS
setVehicles([...vehicles, newVehicle])
```

2. **Ne pas retarder l'enregistrement avec setTimeout**
```typescript
// ❌ MAUVAIS
setTimeout(() => {
  setVehicles(newData)
}, 100)
```

3. **Ne pas oublier le callback dans les mises à jour**
```typescript
// ❌ MAUVAIS
setVehicles(vehicles.map(v => v.id === id ? updated : v))

// ✅ BON
setVehicles((current) => current.map(v => v.id === id ? updated : v))
```

## 🔍 Debugging

### Console du navigateur

```javascript
// Voir toutes les clés
await spark.kv.keys()

// Voir la flotte
await spark.kv.get('fleet')

// Voir les réservations
await spark.kv.get('bookings')

// Supprimer une clé
await spark.kv.delete('fleet')

// Réinitialiser les véhicules
await spark.kv.set('fleet', [
  {
    id: 'business',
    title: 'BUSINESS CLASS',
    description: 'Berline premium',
    image: '',
    order: 1
  }
])
```

## 📚 Documentation complémentaire

- **`DATABASE_USAGE.md`** - Guide détaillé d'utilisation de useKV
- **`TROUBLESHOOTING.md`** - Résolution des problèmes de persistance
- **Types dans `/src/types/`** - Définitions TypeScript de toutes les structures de données

## 💾 Sauvegarde et export

Les données sont stockées dans le navigateur. Pour exporter:

```javascript
// Exporter toutes les données
const allKeys = await spark.kv.keys()
const allData = {}
for (const key of allKeys) {
  allData[key] = await spark.kv.get(key)
}
console.log(JSON.stringify(allData, null, 2))
```

## 🔄 Migration et import

Pour importer des données:

```javascript
const importData = {
  fleet: [ /* vos données */ ],
  bookings: [ /* vos données */ ]
}

for (const [key, value] of Object.entries(importData)) {
  await spark.kv.set(key, value)
}
```

## ✅ Tests de persistance

1. **Modifier une donnée** (véhicule, tarif, etc.)
2. **Recharger la page** (F5)
3. **Vérifier que la modification est toujours là**
4. **Se déconnecter** (si applicable)
5. **Se reconnecter**
6. **Vérifier à nouveau**

Si les données ne persistent pas, consultez `TROUBLESHOOTING.md`.
