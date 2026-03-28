# Guide d'utilisation de la base de données (useKV)

## Vue d'ensemble

### 1. Véhicules (Flotte)

- **Utilisation**:

### 1. Véhicules (Flotte)
- **Clé**: `'fleet'`
- **Type**: `VehicleClass[]`
- **Localisation**: `AdminDashboard.tsx` (ligne 70)
- **Utilisation**:
  ```
  const [fleetData, setFleetData] = useKV<VehicleClass[]>('fleet', DEFAULT_FLEET)
- **C

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
  ```
- **Localisation**: `App.tsx`
- **Utilisation**:
  ```
  const [currentUser, setCurrentUser] = useKV<{ email: string; isAdmin: boolean } | null>('current-user', null)
- **C

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
  ```
- **Utilisation**:
- **Utilisation**:
  ```
  const [pricingData, setPricingData] = useKV<VehiclePricing[]>('pricing', DEFAULT_PRICING)
- **C

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
  ```
- **Localisation**: `AdminDashboard.tsx`
- **Utilisation**:
  ```typescript
  const [activePricingMode, setActivePricingMode] = useKV<'high-demand' | 'low-season'>('active-pricing-mode', 'high-demand')
  ```




2. **État incohérent**: Les données affi


```typescript
  set

    
      ...data,
        id: newId,
        description: newVehicleDescripti
        order: max
    ]
}


  setFleetData((current) => {
    return data.map((vehicle) =>
        ? { ...vehicle, ...upda
    )
}

```typescript
  set

}

```typescript
  // ... lecture du fichier ...
  setFleetData((cu
    return data
        return { ...vehicle, image: result, imageName: uniqueFileName }
     

```
## Vérification de la persista
Pour vérifier que les donnée
1. **Modifiez un véhicule** dans l'admin
3. **Reconnectez-v

- ✅ Utilisez-vous des mises à jour fonctionnelles?
- ✅ A

✅ **Toujours utiliser `useKV` po























































































































