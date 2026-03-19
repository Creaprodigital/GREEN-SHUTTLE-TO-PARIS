# Guide de Configuration Stripe

Ce guide vous aidera à configurer le système de paiement Stripe pour accepter les paiements par carte bancaire de manière sécurisée.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Création d'un compte Stripe](#création-dun-compte-stripe)
3. [Configuration des clés API](#configuration-des-clés-api)
4. [Configuration des Webhooks](#configuration-des-webhooks)
5. [Configuration dans l'Application](#configuration-dans-lapplication)
6. [Mode Test vs Mode Production](#mode-test-vs-mode-production)
7. [Dépannage](#dépannage)

---

## Prérequis

- Un compte Stripe (gratuit pour commencer)
- Accès à l'interface d'administration de votre application
- Une adresse email valide pour recevoir les notifications

---

## Création d'un Compte Stripe

1. **Visitez le site Stripe**
   - Allez sur [stripe.com](https://stripe.com)
   - Cliquez sur "S'inscrire" (Sign up)

2. **Créez votre compte**
   - Entrez votre adresse email
   - Choisissez un mot de passe sécurisé
   - Confirmez votre adresse email

3. **Complétez votre profil**
   - Renseignez les informations de votre entreprise
   - Indiquez le type d'activité
   - Fournissez les informations bancaires (pour recevoir les paiements)

---

## Configuration des Clés API

### Étape 1 : Accéder au Tableau de Bord Stripe

1. Connectez-vous à votre compte Stripe
2. Accédez au tableau de bord : [dashboard.stripe.com](https://dashboard.stripe.com)

### Étape 2 : Obtenir les Clés API

1. Dans le menu de gauche, cliquez sur **"Développeurs"** (Developers)
2. Cliquez sur **"Clés API"** (API Keys)
3. Vous verrez deux types de clés :
   - **Clé publique** (Publishable key) - commence par `pk_test_` ou `pk_live_`
   - **Clé secrète** (Secret key) - commence par `sk_test_` ou `sk_live_`

### Étape 3 : Copier les Clés

Pour le **mode test** :
- Clé publique : `pk_test_...` (visible directement)
- Clé secrète : `sk_test_...` (cliquez sur "Révéler la clé test" pour la voir)

⚠️ **Important** : Ne partagez JAMAIS votre clé secrète publiquement !

---

## Configuration des Webhooks

Les webhooks permettent à Stripe de notifier votre application en temps réel des événements de paiement.

### Étape 1 : Créer un Point de Terminaison Webhook

1. Dans le tableau de bord Stripe, allez dans **Développeurs** → **Webhooks**
2. Cliquez sur **"Ajouter un point de terminaison"** (Add endpoint)
3. Entrez l'URL de votre webhook :
   ```
   https://votre-domaine.com/api/stripe/webhook
   ```

### Étape 2 : Sélectionner les Événements

Sélectionnez les événements suivants (recommandés) :
- ✅ `payment_intent.succeeded` - Paiement réussi
- ✅ `payment_intent.payment_failed` - Paiement échoué
- ✅ `charge.succeeded` - Charge réussie
- ✅ `charge.failed` - Charge échouée

### Étape 3 : Obtenir le Secret de Signature

1. Après avoir créé le webhook, cliquez dessus
2. Trouvez la section **"Secret de signature"** (Signing secret)
3. Cliquez sur **"Révéler"** (Reveal)
4. Copiez le secret qui commence par `whsec_...`

---

## Configuration dans l'Application

### Étape 1 : Accéder aux Paramètres

1. Connectez-vous à l'interface d'administration
2. Allez dans **Admin** → **Paramètres**
3. Faites défiler jusqu'à la section **"Paiement Stripe"**

### Étape 2 : Activer Stripe

1. Activez le commutateur **"Activer les paiements Stripe"**

### Étape 3 : Entrer les Clés

1. **Clé Publique** : Collez votre clé `pk_test_...` ou `pk_live_...`
2. **Clé Secrète** : Collez votre clé `sk_test_...` ou `sk_live_...`
3. **Webhook Secret** : Collez votre secret `whsec_...`

### Étape 4 : Enregistrer

1. Cliquez sur **"Enregistrer les paramètres"**
2. Vérifiez que le statut indique **"API Configurée"** et **"Activé"**

---

## Mode Test vs Mode Production

### Mode Test (Développement)

- Utilisez les clés commençant par `pk_test_` et `sk_test_`
- Aucun vrai argent n'est transféré
- Testez avec les cartes de test Stripe

**Cartes de Test Stripe** :
- Succès : `4242 4242 4242 4242`
- Échec : `4000 0000 0000 0002`
- 3D Secure : `4000 0025 0000 3155`
- Date d'expiration : N'importe quelle date future (ex: 12/25)
- CVC : N'importe quel code à 3 chiffres (ex: 123)

### Mode Production (Live)

⚠️ **Avant de passer en production** :

1. Complétez toutes les informations de votre compte Stripe
2. Vérifiez votre identité (requis par Stripe)
3. Configurez vos informations bancaires pour recevoir les paiements
4. Changez vos clés test par les clés live :
   - Clé publique : `pk_live_...`
   - Clé secrète : `sk_live_...`
5. Mettez à jour l'URL du webhook pour pointer vers votre domaine de production
6. Testez avec de petits montants réels

---

## Dépannage

### Problème : "Stripe non configuré"

**Solution** :
- Vérifiez que vous avez bien activé Stripe dans les paramètres
- Assurez-vous d'avoir entré les deux clés (publique et secrète)
- Vérifiez qu'il n'y a pas d'espaces avant ou après les clés

### Problème : "Paiement refusé"

**Solution** :
- En mode test, utilisez uniquement les cartes de test Stripe
- Vérifiez que la carte n'est pas expirée
- Assurez-vous que le CVC est correct
- Vérifiez que vous avez suffisamment de fonds (en production)

### Problème : "Webhook non reçu"

**Solution** :
- Vérifiez que l'URL du webhook est correcte
- Assurez-vous que votre serveur est accessible depuis internet
- Vérifiez que vous avez copié le bon secret de signature
- Testez le webhook depuis le tableau de bord Stripe (bouton "Envoyer un événement test")

### Problème : "Erreur d'API"

**Solution** :
- Vérifiez que vos clés API ne sont pas expirées
- Assurez-vous d'utiliser les bonnes clés (test vs live)
- Consultez les logs dans le tableau de bord Stripe pour plus de détails

---

## 🔐 Sécurité

### Bonnes Pratiques

1. **Ne partagez jamais vos clés secrètes** (`sk_test_` ou `sk_live_`)
2. **Utilisez HTTPS** pour toutes les communications
3. **Validez les webhooks** avec le secret de signature
4. **Limitez l'accès** aux clés API dans votre équipe
5. **Activez l'authentification 2FA** sur votre compte Stripe
6. **Surveillez régulièrement** les transactions dans le tableau de bord

### Conformité

Stripe est conforme aux normes :
- ✅ **PCI DSS Level 1** - Plus haut niveau de sécurité des paiements
- ✅ **3D Secure** - Authentification forte pour les paiements européens
- ✅ **RGPD** - Protection des données personnelles

---

## 📞 Support

### Stripe

- Documentation : [docs.stripe.com](https://docs.stripe.com)
- Support : [support.stripe.com](https://support.stripe.com)
- Status : [status.stripe.com](https://status.stripe.com)

### Application

- Pour toute question sur la configuration dans l'application, contactez votre administrateur système

---

## 📝 Notes Importantes

- Les frais Stripe sont de **1,4% + 0,25€** par transaction réussie en Europe
- Les paiements sont généralement disponibles sous **2 jours ouvrés**
- Stripe gère automatiquement les remboursements et les litiges
- Les webhooks sont essentiels pour une expérience utilisateur optimale

---

**Dernière mise à jour** : Janvier 2025
