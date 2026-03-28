# Guide d'utilisation de la base de données (useKV)

## Vue d'ensemble

Cette application utilise le système de persistance `useKV` fourni par Spark pour enregistrer toutes les données de manière persistante entre les sessions.

## Données enregistrées avec useKV

### 1. Véhicules (Flotte)
- **Clé**: `'fleet'`
- **Type**: `VehicleClass[]`
- **Localisation**: `AdminDashboard.tsx` (ligne 70)
- **Utilisation**:
  ```typescript
  const [fleetData, setFleetData] = useKV<VehicleClass[]>('fleet', DEFAULT_FLEET)
  ```

### 2. Réservations
- **Clé**: `'bookings'`
- **Type**: `Booking[]`
- **Localisation**: `App.tsx` et `AdminDashboard.tsx`
- **Utilisation**:
  ```typescript
  const [bookings, setBookings] = useKV<Booking[]>('bookings', [])
  ```

### 3. Utilisateur actuel
- **Clé**: `'current-user'`
- **Type**: `{ email: string; isAdmin: boolean } | null`
- **Localisation**: `App.tsx`
- **Utilisation**:
  ```typescript
  const [currentUser, setCurrentUser] = useKV<{ email: string; isAdmin: boolean } | null>('current-user', null)
  ```

### 4. Comptes administrateurs
- **Clé**: `'admin-accounts'`
- **Type**: `AdminAccount[]`
- **Localisation**: `AdminDashboard.tsx`
- **Utilisation**:
  ```typescript
  const [adminAccounts, setAdminAccounts] = useKV<AdminAccount[]>('admin-accounts', [...])
  ```

### 5. Tarification
- **Clé**: `'pricing'`
- **Type**: `VehiclePricing[]`
- **Localisation**: `AdminDashboard.tsx`
- **Utilisation**:
  ```typescript
  const [pricingData, setPricingData] = useKV<VehiclePricing[]>('pricing', DEFAULT_PRICING)
  ```

### 6. Options de service
- **Clé**: `'service-options'`
- **Type**: `ServiceOption[]`
- **Localisation**: `AdminDashboard.tsx`
- **Utilisation**:
  ```typescript
  const [optionsData, setOptionsData] = useKV<ServiceOption[]>('service-options', DEFAULT_OPTIONS)
  ```

### 7. Mode de tarification actif
- **Clé**: `'active-pricing-mode'`
- **Type**: `'high-demand' | 'low-season'`
- **Localisation**: `AdminDashboard.tsx`
- **Utilisation**:
  ```typescript
  const [activePricingMode, setActivePricingMode] = useKV<'high-demand' | 'low-season'>('active-pricing-mode', 'high-demand')
  ```

### 8. Paramètres de tarification
- **Clé**: `'pricing-settings'`
- **Type**: `PricingSettings`
- **Localisation**: `AdminDashboard.tsx`
- **Utilisation**:
  ```typescript
  const [pricingSettings, setPricingSettings] = useKV<PricingSettings>('pricing-settings', { roundToWholeEuro: false })
  ```

### 9. Paramètres Telegram
- **Clé**: `'telegram-settings'`
- **Type**: `TelegramSettings`
- **Localisation**: `AdminDashboard.tsx`
- **Utilisation**:
  ```typescript
  const [telegramSettings, setTelegramSettings] = useKV<TelegramSettings>('telegram-settings', DEFAULT_TELEGRAM_SETTINGS)
  ```

### 10. Réduction aller-retour
- **Clé**: `'roundtrip-discount'`
- **Type**: `RoundTripDiscount`
- **Localisation**: `AdminDashboard.tsx`
- **Utilisation**:
  ```typescript
  const [roundTripDiscount, setRoundTripDiscount] = useKV<RoundTripDiscount>('roundtrip-discount', DEFAULT_ROUNDTRIP_DISCOUNT)
  ```

### 11. Paramètres Email
- **Clé**: `'email-settings'`
- **Type**: `EmailSettings`
- **Localisation**: `AdminDashboard.tsx`
- **Utilisation**:
  ```typescript
  const [emailSettings, setEmailSettings] = useKV<EmailSettings>('email-settings', DEFAULT_EMAIL_SETTINGS)
  ```

### 12. Paramètres Stripe
- **Clé**: `'stripe-settings'`
- **Type**: `StripeSettings`
- **Localisation**: `AdminDashboard.tsx`
- **Utilisation**:
  ```typescript
  const [stripeSettings, setStripeSettings] = useKV<StripeSettings>('stripe-settings', DEFAULT_STRIPE_SETTINGS)
  ```

## Règles importantes pour useKV

### ❌ ERREUR - NE JAMAIS FAIRE CECI:
```typescript
// ❌ MAUVAIS - Référence à une valeur potentiellement obsolète
setFleetData([...fleetData, newVehicle])

// ❌ MAUVAIS - Même problème
setFleetData(fleetData.map(v => v.id === id ? updated : v))
```

### ✅ CORRECT - TOUJOURS FAIRE CECI:
```typescript
// ✅ BON - Mise à jour fonctionnelle avec la valeur actuelle
setFleetData((currentFleetData) => [...currentFleetData, newVehicle])

// ✅ BON - Map avec fonction
setFleetData((currentFleetData) => 
  currentFleetData.map(v => v.id === id ? updated : v)
)

// ✅ BON - Filter avec fonction
setFleetData((currentFleetData) => 
  currentFleetData.filter(v => v.id !== id)
)
```

## Pourquoi les mises à jour fonctionnelles sont essentielles

Les mises à jour fonctionnelles garantissent que vous travaillez toujours avec la **valeur la plus récente** stockée dans la base de données, évitant ainsi:

1. **Perte de données**: Si deux modifications se produisent rapidement, la seconde écrasera la première
2. **État incohérent**: Les données affichées peuvent ne pas correspondre aux données enregistrées
3. **Bugs de synchronisation**: Les modifications peuvent ne pas être persistées correctement

## Modifications des véhicules - Exemples

### Ajouter un véhicule
```typescript
const handleAddVehicle = () => {
  setFleetData((current) => {
    const data = Array.isArray(current) ? current : DEFAULT_FLEET
    const maxOrder = Math.max(...data.map(v => v.order), 0)
    const newId = `vehicle-${Date.now()}`
    
    return [
      ...data,
      {
        id: newId,
        title: newVehicleTitle,
        description: newVehicleDescription,
        image: '',
        order: maxOrder + 1
      }
    ]
  })
}
```

### Mettre à jour un véhicule
```typescript
const handleUpdateVehicle = (vehicleId: string, updates: Partial<VehicleClass>) => {
  setFleetData((current) => {
    const data = Array.isArray(current) ? current : DEFAULT_FLEET
    return data.map((vehicle) =>
      vehicle.id === vehicleId
        ? { ...vehicle, ...updates }
        : vehicle
    )
  })
}
```

### Supprimer un véhicule
```typescript
const handleDeleteVehicle = (vehicleId: string) => {
  setFleetData((current) => {
    const data = Array.isArray(current) ? current : DEFAULT_FLEET
    return data.filter((vehicle) => vehicle.id !== vehicleId)
  })
}
```

### Upload d'image
```typescript
const handleImageUpload = async (vehicleId: string, file: File) => {
  // ... lecture du fichier ...
  
  setFleetData((currentData) => {
    const data = Array.isArray(currentData) ? currentData : DEFAULT_FLEET
    return data.map((vehicle) => {
      if (vehicle.id === vehicleId) {
        return { ...vehicle, image: result, imageName: uniqueFileName }
      }
      return vehicle
    })
  })
}
```

## Vérification de la persistance

Pour vérifier que les données sont bien enregistrées:

1. **Modifiez un véhicule** dans l'admin
2. **Déconnectez-vous** de l'admin
3. **Reconnectez-vous**
4. Les modifications doivent être **toujours présentes**

Si les modifications ne persistent pas, vérifiez:
- ✅ Utilisez-vous des mises à jour fonctionnelles?
- ✅ Appelez-vous bien `setFleetData` et non une autre fonction?
- ✅ Avez-vous des erreurs dans la console?

## Résumé

✅ **Toujours utiliser `useKV` pour les données persistantes**  
✅ **Toujours utiliser des mises à jour fonctionnelles**  
✅ **Ne jamais référencer directement la valeur du state dans un setter**  
✅ **Vérifier la console pour les erreurs de synchronisation**
