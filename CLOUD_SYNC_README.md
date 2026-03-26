# 🌥️ Système de Synchronisation Cloud des Codes Promo

## ✨ Fonctionnalités

Le système de sauvegarde cloud synchronise automatiquement les codes promo entre **tous les administrateurs** de l'application ELGOH.

### Ce qui est synchronisé :
- ✅ Création de nouveaux codes promo
- ✅ Activation/désactivation des codes
- ✅ Suppression des codes
- ✅ Toutes les modifications de configuration

### Avantages :
- 🔄 **Synchronisation en temps réel** (toutes les 2 secondes)
- 👥 **Multi-administrateurs** : tous les admins voient les mêmes données
- 🔔 **Notifications visuelles** quand un autre admin fait une modification
- 📊 **Indicateurs de statut** : voyez qui a fait la dernière modification et quand
- 🛡️ **Fiable** : gestion automatique des erreurs et récupération

## 🎯 Comment ça marche

### 1. Interface Utilisateur

Dans l'espace **Admin → Paramètres → Codes Promo**, vous verrez :

```
┌─────────────────────────────────────────┐
│ 🏷️ Codes Promo              ☁️ Synchronisé │
│ Dernière modif par admin@... • 14:23     │
└─────────────────────────────────────────┘
```

### 2. Indicateurs de Synchronisation

| Icône | Signification |
|-------|---------------|
| ☁️ (gris) | Données à jour |
| ☁️ (vert) | Synchronisé avec succès |
| ☁️ (rebond) | Synchronisation en cours... |
| ⚠️ (orange) | Nouvelle version disponible |
| ❌ (rouge) | Erreur de synchronisation |

### 3. Notifications

Quand un autre administrateur modifie les codes promo, vous recevez une notification :

```
┌──────────────────────────────────────┐
│ ☁️ Codes promo mis à jour par        │
│    admin@elgoh.com                   │
└──────────────────────────────────────┘
```

## 📝 Guide d'utilisation

### Créer un code promo

1. Remplissez le formulaire dans la section "Codes Promo"
2. Cliquez sur **"Ajouter le code promo"**
3. ☁️ L'icône cloud clignote pendant la synchronisation
4. ✅ Le code est maintenant disponible pour tous les admins

**Temps de propagation** : ~2 secondes maximum

### Modifier un code promo

1. Activez/désactivez le switch du code
2. ☁️ Synchronisation automatique
3. ✅ Tous les admins voient le changement

### Supprimer un code promo

1. Cliquez sur l'icône 🗑️
2. ☁️ Synchronisation automatique
3. ✅ Le code disparaît pour tous les admins

## 🔧 Configuration Technique

### Hook `useCloudSync`

Le système utilise un hook React personnalisé :

```typescript
const { 
  data,           // Les données synchronisées
  syncToCloud,    // Fonction pour envoyer au cloud
  syncMeta,       // Métadonnées (qui, quand)
  isLatestVersion // Version à jour ?
} = useCloudSync('promo-codes', defaultValue, {
  syncInterval: 2000  // Vérifier toutes les 2 secondes
})
```

### Stockage KV

Les données sont stockées dans le système KV de Spark :

- **Clé principale** : `promo-codes`
- **Métadonnées** : `promo-codes-sync-meta`

### Architecture

```
┌─────────────┐                    ┌─────────────┐
│  Admin A    │◄────────┐          │  Admin B    │
│             │         │          │             │
│ ☁️ Modifier  │         │          │ 👁️ Voir     │
└─────────────┘         │          └─────────────┘
       │                │                 ▲
       │                │                 │
       ▼                │                 │
┌─────────────────────────────────────────┐
│         Spark KV Cloud Storage          │
│  ┌─────────────────────────────────┐   │
│  │ promo-codes: [...]              │   │
│  │ promo-codes-sync-meta: {...}    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
       │                                  
       └──► Sync automatique toutes les 2s
```

## 🚀 Scénarios d'utilisation

### Scénario 1 : Création simultanée
**Situation** : Deux admins créent des codes en même temps

✅ **Résultat** : Les deux codes sont créés et synchronisés. Chaque admin voit les deux codes après ~2 secondes.

### Scénario 2 : Modification conflictuelle
**Situation** : Admin A désactive un code, Admin B le supprime simultanément

✅ **Résultat** : La dernière action (suppression) est appliquée. Le code est supprimé pour les deux.

### Scénario 3 : Perte de connexion
**Situation** : Un admin perd sa connexion internet

✅ **Résultat** : 
- Les modifications locales sont conservées
- Icône ❌ rouge s'affiche
- Dès la reconnexion, synchronisation automatique

## ⚡ Performance

- **Latence de sync** : < 2 secondes
- **Taille max des données** : Illimitée (KV Spark)
- **Nombre d'admins** : Illimité
- **Bande passante** : Optimisée (sync uniquement si changement)

## 🛠️ Dépannage

### Problème : Les codes ne se synchronisent pas

**Solutions** :
1. Vérifiez l'icône cloud - s'affiche-t-elle en rouge ?
2. Rafraîchissez la page (F5)
3. Vérifiez votre connexion internet
4. Déconnectez-vous et reconnectez-vous

### Problème : "Nouvelle version disponible" reste affiché

**C'est normal !** Le système va récupérer automatiquement les données dans les 2 prochaines secondes.

Si le message persiste > 10 secondes :
1. Rafraîchissez la page
2. Vérifiez votre connexion

### Problème : Erreur de synchronisation

**L'icône est rouge** :
1. Le système réessaiera automatiquement
2. Si l'erreur persiste, contactez le support technique

## 📚 Extension Future

Ce système peut être étendu à d'autres modules :

- [ ] Configuration des tarifs
- [ ] Gestion des circuits
- [ ] Zones forfaitaires
- [ ] Configuration Stripe
- [ ] Flotte de véhicules
- [ ] Paramètres généraux

Pour ajouter la sync à un autre module :

```typescript
import { useCloudSync } from '@/hooks/useCloudSync'

const { data, syncToCloud } = useCloudSync('mon-module', defaultValue)
```

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@elgoh.com
- 📱 Téléphone : +33 6 09 61 37 21

## 🔐 Sécurité

- ✅ Données chiffrées en transit
- ✅ Accès réservé aux administrateurs authentifiés
- ✅ Traçabilité complète (qui a modifié quoi et quand)
- ✅ Pas de perte de données en cas de conflit

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025  
**Auteur** : Système ELGOH
