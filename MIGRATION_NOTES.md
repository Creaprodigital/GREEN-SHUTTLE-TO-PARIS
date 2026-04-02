# Migration des Données - Résumé des Changements

## Problème Identifié
Les paramètres de l'admin (véhicules, tarifs, options, codes promo) n'étaient pas sauvegardés correctement lors de la déconnexion.

## Cause Racine
1. **Conflit de clés de stockage**: Différents composants utilisaient des clés différentes pour accéder aux mêmes données
   - AdminDashboard utilisait: `'fleet'`, `'pricing'`, `'service-options'`
   - BookingForm et autres utilisaient également ces clés mais avec des valeurs par défaut différentes
   - Cela causait des écrasements de données lors de la réinitialisation des composants

2. **Valeurs par défaut constantes**: Les valeurs par défaut (DEFAULT_FLEET, DEFAULT_PRICING, etc.) étaient passées directement dans `useKV`, ce qui pouvait réinitialiser les données modifiées

## Solution Implémentée

### 1. Nouvelles Clés de Stockage
Les données admin utilisent maintenant des clés dédiées:
- `'fleet'` → `'fleet-data'` (données des véhicules)
- `'pricing'` → `'pricing-data'` (données des tarifs)
- `'service-options'` → `'service-options-data'` (données des options)
- `'promo-codes'` → reste `'promo-codes'` (codes promo)
- `'admin-accounts'` → reste `'admin-accounts'` (comptes admin)

### 2. Initialisation Contrôlée
- Les `useKV` utilisent maintenant des tableaux vides `[]` comme valeur par défaut
- Un `useEffect` dans AdminDashboard initialise les données avec les valeurs par défaut UNIQUEMENT si elles n'existent pas encore
- Cela empêche l'écrasement des données existantes

### 3. Migration Automatique
- Un script de migration (`src/lib/migrate-data.ts`) copie automatiquement les anciennes données vers les nouvelles clés au démarrage de l'app
- Cela garantit que les données existantes ne sont pas perdues

### 4. Composants Mis à Jour
Les composants suivants ont été modifiés pour utiliser les nouvelles clés:
- ✅ `AdminDashboard.tsx` - Gestion complète des données admin
- ✅ `BookingForm.tsx` - Lecture des véhicules, tarifs, options
- ✅ `FleetShowcase.tsx` - Affichage de la flotte
- ✅ `OurFleet.tsx` - Déjà à jour avec `'fleet-data'`
- ✅ `App.tsx` - Appel de la migration au démarrage
- ✅ `PromoCodeManager.tsx` - Déjà correct

## Clés de Stockage - Table de Référence

| Donnée | Clé KV | Utilisé par | Type |
|--------|--------|-------------|------|
| Véhicules | `fleet-data` | Admin, BookingForm, FleetShowcase, OurFleet | `VehicleClass[]` |
| Tarifs | `pricing-data` | Admin, BookingForm | `VehiclePricing[]` |
| Options | `service-options-data` | Admin, BookingForm | `ServiceOption[]` |
| Codes Promo | `promo-codes` | Admin (via PromoCodeManager), BookingForm | `PromoCode[]` |
| Comptes Admin | `admin-accounts` | AdminDashboard | `AdminAccount[]` |
| Circuits | `circuits` | Admin (via CircuitManager), BookingForm | `Circuit[]` |
| Zones Tarifaires | `pricing-zones` | Admin (via ZoneForfaitManager), BookingForm | `PricingZone[]` |
| Forfaits Zones | `zone-forfaits` | Admin (via ZoneForfaitManager), BookingForm | `ZoneForfait[]` |
| Réservations | `bookings` | Admin, ClientDashboard, BookingForm | `Booking[]` |
| Mode Tarifaire | `active-pricing-mode` | Admin, BookingForm | `'high-demand' \| 'low-season'` |
| Paramètres Prix | `pricing-settings` | Admin, BookingForm | `PricingSettings` |
| Remise A/R | `roundtrip-discount` | Admin, BookingForm | `RoundTripDiscount` |
| Config Telegram | `telegram-settings` | Admin, BookingForm | `TelegramSettings` |
| Config Email | `email-settings` | Admin, BookingForm | `EmailSettings` |
| Config Stripe | `stripe-settings` | Admin, BookingForm | `StripeSettings` |

## Test de Validation
Pour vérifier que la correction fonctionne:
1. Se connecter en tant qu'admin
2. Créer un nouveau véhicule
3. Créer un code promo
4. Modifier les tarifs
5. Se déconnecter
6. Se reconnecter en tant qu'admin
7. Vérifier que tous les paramètres sont toujours présents ✅

## Notes Importantes
- ⚠️ Les anciennes données seront automatiquement migrées vers les nouvelles clés au premier chargement
- ⚠️ Ne pas mélanger les anciennes et nouvelles clés dans le code
- ⚠️ Toujours utiliser les mises à jour fonctionnelles avec `useKV`: `setData((current) => ...)`
