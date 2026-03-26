# Système de Sauvegarde Cloud - Codes Promo

## Vue d'ensemble

Le système de sauvegarde cloud synchronise automatiquement les codes promo entre tous les administrateurs de l'application. Toutes les modifications sont instantanément partagées et visibles par tous les admins connectés.

## Fonctionnalités

### Synchronisation Automatique
- **Intervalle de synchronisation** : Toutes les 2 secondes
- **Synchronisation bidirectionnelle** : Les modifications sont envoyées et reçues automatiquement
- **Détection de conflits** : Le système détecte quand une nouvelle version est disponible

### Indicateurs Visuels

L'icône cloud dans l'interface indique l'état de synchronisation :

- 🔄 **Animation rebondissante** : Synchronisation en cours
- ☁️ **Cloud vert** : Données synchronisées
- ⚠️ **Cloud orange** : Nouvelle version disponible
- ❌ **Cloud rouge** : Erreur de synchronisation

### Métadonnées de Synchronisation

Chaque modification enregistre :
- **Qui** : L'email ou identifiant de l'administrateur
- **Quand** : L'horodatage de la dernière modification
- **Version** : Un numéro de version incrémental pour détecter les changements

## Utilisation

### Pour les Administrateurs

1. **Créer un code promo** :
   - Remplissez le formulaire
   - Cliquez sur "Ajouter le code promo"
   - Le code est automatiquement synchronisé avec le cloud
   - Tous les autres administrateurs verront le nouveau code en ~2 secondes

2. **Modifier l'état d'un code** :
   - Activez/désactivez le switch
   - La modification est synchronisée instantanément

3. **Supprimer un code** :
   - Cliquez sur l'icône poubelle
   - La suppression est propagée à tous les administrateurs

### Surveillance de la Synchronisation

- **En haut à droite** de la section "Codes Promo", vous voyez l'indicateur de sync
- **Survolez l'indicateur** pour voir qui a fait la dernière modification et quand
- **Si "Nouvelle version disponible"** apparaît, les données seront récupérées automatiquement

## Architecture Technique

### Hook `useCloudSync`

Le système utilise un hook React personnalisé qui :
- Synchronise les données avec le KV store Spark
- Maintient un système de versioning
- Détecte automatiquement les changements distants
- Gère les conflits avec une stratégie "last-write-wins"

### Stockage

Les données sont stockées dans deux clés KV :
- `promo-codes` : Les codes promo eux-mêmes
- `promo-codes-sync-meta` : Les métadonnées de synchronisation (version, timestamp, auteur)

### Fonctionnement

```
Admin A modifie un code promo
    ↓
Écriture locale + incrémentation version
    ↓
Synchronisation vers KV cloud
    ↓ (2 secondes max)
Admin B détecte la nouvelle version
    ↓
Téléchargement automatique des nouvelles données
    ↓
Mise à jour de l'interface Admin B
```

## Avantages

✅ **Temps réel** : Synchronisation quasi-instantanée (2s)
✅ **Automatique** : Aucune action manuelle requise
✅ **Fiable** : Détection et récupération automatique des erreurs
✅ **Transparent** : Indicateurs visuels clairs
✅ **Traçable** : Historique de qui a modifié quoi

## Dépannage

### Les codes ne se synchronisent pas

1. Vérifiez l'indicateur cloud - s'il montre une erreur, rafraîchissez la page
2. Vérifiez votre connexion internet
3. Assurez-vous que vous êtes bien connecté en tant qu'administrateur

### "Nouvelle version disponible" reste affiché

- C'est normal ! Le système récupérera automatiquement les données dans les 2 prochaines secondes
- Si le message persiste après 10 secondes, rafraîchissez la page

### Conflit de modifications simultanées

- Le système utilise "last-write-wins" : la dernière modification écrase les précédentes
- Recommandation : Coordonnez-vous avec les autres admins pour les modifications importantes

## Extension Future

Ce système peut être étendu à d'autres modules :
- Configuration des tarifs
- Gestion des circuits touristiques
- Configuration des zones forfaitaires
- Paramètres Stripe
- Flotte de véhicules

Il suffit d'utiliser le hook `useCloudSync` avec une clé différente pour chaque module.
