# Système de Tarification - Green Shuttle To Paris

## Vue d'ensemble

Le système de tarification calcule automatiquement le prix de chaque réservation selon le type de service sélectionné. Le prix est calculé en temps réel lors de la sélection du véhicule (étape 2) et sauvegardé avec la réservation lors de la confirmation.

## Règles de Calcul par Type de Service

### 1. Transfert (Transfer)
**Formule:** Prix = (Distance en km × Prix/km) + (Durée en minutes × Prix/minute)

- Le système utilise l'API Google Maps Distance Matrix pour calculer automatiquement:
  - La distance en kilomètres entre le point de départ et la destination
  - La durée estimée en minutes
  
- **Prix minimum:** Le prix par heure (pricePerHour) sert de prix minimum pour les courts trajets

- **Aller-Retour:** Si le client sélectionne "Aller-Retour", le prix est multiplié par 2

**Exemple:**
- Distance: 50 km
- Durée: 45 minutes
- Véhicule Business: Prix/km = 2.0€, Prix/minute = 0.8€
- Calcul: (50 × 2.0) + (45 × 0.8) = 100€ + 36€ = 136€
- Si aller-retour: 136€ × 2 = 272€

### 2. Mise à Disposition (Hourly)
**Formule:** Prix = Nombre d'heures × Prix par heure

- Le client sélectionne le nombre d'heures souhaité (2 à 24 heures)
- Le prix par heure (pricePerHour) est multiplié par le nombre d'heures

**Exemple:**
- Durée: 4 heures
- Véhicule Business: Prix/heure = 45€
- Calcul: 4 × 45€ = 180€

### 3. Circuit Touristique (Tour)
**Formule:** Prix = Prix de base du circuit (tourBasePrice)

- Le prix est fixe et défini dans la configuration tarifaire admin
- C'est le prix configuré dans l'administration pour chaque véhicule

**Exemple:**
- Véhicule Business: Prix circuit = 250€
- Prix total: 250€

## Modes Tarifaires

Le système dispose de 2 modes tarifaires que l'administrateur peut basculer en 1 clic:

### Mode Forte Demande (High Demand) - Par défaut 🔥
Tarifs appliqués pendant les périodes de forte affluence:
- `pricePerKm`: Prix au kilomètre standard
- `pricePerMinute`: Prix à la minute standard  
- `pricePerHour`: Prix à l'heure standard
- `tourBasePrice`: Prix de base circuit standard

### Mode Basse Saison (Low Season) ❄️
Tarifs réduits pendant les périodes creuses:
- `lowSeasonPricePerKm`: Prix au kilomètre réduit
- `lowSeasonPricePerMinute`: Prix à la minute réduit
- `lowSeasonPricePerHour`: Prix à l'heure réduit
- `lowSeasonTourBasePrice`: Prix de base circuit réduit

L'administrateur bascule entre les modes via le bouton dans l'onglet "Tarifs" du tableau de bord admin.

## Tarifs par Défaut (Mode Forte Demande)

### Eco
- Prix/km: 1.5€
- Prix/minute: 0.5€
- Prix/heure: 30€
- Circuit: 150€

### Business
- Prix/km: 2.0€
- Prix/minute: 0.8€
- Prix/heure: 45€
- Circuit: 250€

### Van
- Prix/km: 2.5€
- Prix/minute: 1.0€
- Prix/heure: 55€
- Circuit: 300€

### First Class
- Prix/km: 3.5€
- Prix/minute: 1.5€
- Prix/heure: 80€
- Circuit: 500€

## Options Supplémentaires

Les options sélectionnées s'ajoutent au prix de base:

| Option | Prix |
|--------|------|
| Siège Enfant | +10€ |
| Rehausseur | +8€ |
| Bouteilles d'eau | +5€ |
| Wi-Fi à bord | +15€ |
| Chargeur téléphone | Inclus |
| Journaux | Inclus |

**Calcul final:** Prix total = Prix du service + Somme des options

## Affichage des Prix

### Étape 2 - Sélection du Véhicule
- Le prix est affiché sur chaque carte véhicule
- Le prix se met à jour automatiquement quand:
  - L'utilisateur change le type de service
  - La distance est calculée (pour les transferts)
  - Des options sont sélectionnées/désélectionnées
  - Le nombre d'heures change (mise à disposition)

- Un récapitulatif détaillé apparaît en bas avec:
  - Distance et durée (pour transferts)
  - Nombre d'heures (pour mise à disposition)
  - Liste des options avec leurs prix
  - Prix total

### Étape 4 - Confirmation et Paiement
Le récapitulatif final affiche:
- Tous les détails de la réservation
- Le véhicule sélectionné
- La distance et durée (transferts)
- Les options choisies avec leurs prix
- **Le prix total en gros et en gras**

### Dashboard Admin
- L'administrateur voit le prix calculé automatiquement
- Il peut modifier manuellement le prix si nécessaire
- Le prix sauvegardé apparaît dans les détails de chaque réservation

## Configuration Admin

L'administrateur peut:

1. **Gérer les tarifs** (Onglet "Tarifs"):
   - Modifier le prix/km pour chaque véhicule
   - Modifier le prix/minute pour chaque véhicule
   - Modifier le prix/heure (utilisé aussi comme minimum)
   - Modifier le prix de base des circuits
   - Configurer les tarifs basse saison
   - Basculer entre mode forte demande et basse saison

2. **Gérer les options** (Onglet "Options"):
   - Ajouter de nouvelles options
   - Modifier le nom, description et prix des options
   - Supprimer des options

3. **Gérer la flotte** (Onglet "Our Fleet"):
   - Ajouter/modifier/supprimer des véhicules
   - Chaque nouveau véhicule nécessite une configuration tarifaire

## Logs de Debug

Le système affiche des logs détaillés dans la console pour le debugging:
- Tous les paramètres utilisés pour le calcul
- Le prix de base calculé
- Les options appliquées
- Le prix final
- Les ajustements (minimum, aller-retour)

Pour voir les logs: Ouvrez la console développeur (F12) et naviguez dans le formulaire de réservation.

## Persistance des Données

- **Les tarifs** sont sauvegardés dans `localStorage` via `useKV('pricing')`
- **Les options** sont sauvegardées dans `localStorage` via `useKV('service-options')`
- **Le mode actif** est sauvegardé dans `localStorage` via `useKV('active-pricing-mode')`
- **Les réservations** incluent le prix calculé dans le champ `price`

Toutes les modifications admin sont persistées automatiquement et appliquées immédiatement.
