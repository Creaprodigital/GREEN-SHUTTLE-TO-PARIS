# Guide de Configuration SMTP - Green Shuttle To Paris

Ce guide vous aidera à configurer l'envoi d'emails automatiques pour votre application de réservation.

## 📧 Fonctionnalités Email

Une fois configuré, le système envoie automatiquement :

1. **Confirmation au client** - Email envoyé immédiatement après une nouvelle réservation
2. **Notification à l'admin** - Alerte pour chaque nouvelle réservation
3. **Mises à jour de statut** - Email envoyé lorsque le statut d'une réservation change
4. **Notifications trajets partagés** - Alertes quand d'autres passagers rejoignent un trajet

## 🔧 Configuration dans l'Admin

Accédez à **Admin > Paramètres** et remplissez les champs suivants :

### Informations de Base

- **Email Admin** : Votre adresse email pour recevoir les notifications
- **Email Expéditeur** : L'adresse email qui apparaîtra comme expéditeur (ex: noreply@votredomaine.com)
- **Nom de l'expéditeur** : Le nom affiché comme expéditeur (ex: Green Shuttle To Paris)

### Paramètres SMTP

Les paramètres SMTP varient selon votre fournisseur. Voici les configurations les plus courantes :

## 📮 Services SMTP Recommandés

### 1. Gmail SMTP (Gratuit pour usage modéré)

**Configuration :**
```
Serveur SMTP : smtp.gmail.com
Port SMTP : 587
Nom d'utilisateur : votre.email@gmail.com
Mot de passe : [Mot de passe d'application]
```

**Important pour Gmail :**
1. Activez la validation en 2 étapes sur votre compte Google
2. Créez un "Mot de passe d'application" :
   - Allez sur https://myaccount.google.com/security
   - Cliquez sur "Validation en 2 étapes"
   - Faites défiler jusqu'à "Mots de passe des applications"
   - Créez un nouveau mot de passe pour "Mail"
   - Utilisez ce mot de passe de 16 caractères dans le champ "Mot de passe SMTP"

**Limites :**
- 500 emails par jour pour les comptes gratuits
- 2000 emails par jour pour Google Workspace

---

### 2. SendGrid (Professionnel)

**Configuration :**
```
Serveur SMTP : smtp.sendgrid.net
Port SMTP : 587
Nom d'utilisateur : apikey
Mot de passe : [Votre clé API SendGrid]
```

**Comment obtenir une clé API :**
1. Créez un compte sur https://sendgrid.com
2. Allez dans Settings > API Keys
3. Créez une nouvelle clé API avec les permissions "Mail Send"
4. Copiez la clé (elle ne sera affichée qu'une fois)
5. Utilisez "apikey" comme nom d'utilisateur et votre clé comme mot de passe

**Avantages :**
- Plan gratuit : 100 emails/jour
- Plans payants : à partir de 19.95$/mois pour 40,000 emails
- Excellente délivrabilité
- Statistiques détaillées

---

### 3. Mailgun (Professionnel)

**Configuration :**
```
Serveur SMTP : smtp.mailgun.org
Port SMTP : 587
Nom d'utilisateur : postmaster@votredomaine.mailgun.org
Mot de passe : [Votre mot de passe Mailgun]
```

**Comment configurer :**
1. Créez un compte sur https://www.mailgun.com
2. Vérifiez votre domaine ou utilisez un sous-domaine Mailgun
3. Allez dans Sending > Domain Settings
4. Copiez les identifiants SMTP fournis

**Avantages :**
- Plan gratuit : 5,000 emails/mois pendant 3 mois
- Très fiable pour l'envoi transactionnel
- API puissante

---

### 4. AWS SES (Amazon Simple Email Service)

**Configuration :**
```
Serveur SMTP : email-smtp.eu-west-1.amazonaws.com (selon votre région)
Port SMTP : 587
Nom d'utilisateur : [SMTP Username from AWS]
Mot de passe : [SMTP Password from AWS]
```

**Comment configurer :**
1. Créez un compte AWS
2. Activez Amazon SES dans votre région
3. Vérifiez votre adresse email ou domaine
4. Créez des identifiants SMTP dans SES Console > SMTP Settings
5. Demandez la sortie du "Sandbox Mode" pour envoyer à n'importe quelle adresse

**Avantages :**
- Très économique : 0.10$ pour 1,000 emails
- 62,000 emails gratuits/mois si hébergé sur EC2
- Excellente infrastructure

---

### 5. Brevo (anciennement Sendinblue)

**Configuration :**
```
Serveur SMTP : smtp-relay.brevo.com
Port SMTP : 587
Nom d'utilisateur : [Votre email de connexion]
Mot de passe : [Clé API SMTP]
```

**Comment configurer :**
1. Créez un compte sur https://www.brevo.com
2. Allez dans Settings > SMTP & API
3. Créez une nouvelle clé SMTP
4. Utilisez votre email de connexion comme nom d'utilisateur

**Avantages :**
- Plan gratuit : 300 emails/jour
- Interface française
- Facile à configurer

---

## ⚙️ Ports SMTP Courants

- **Port 587** (TLS) - **Recommandé** - Standard moderne et sécurisé
- **Port 465** (SSL) - Ancien standard, toujours supporté
- **Port 25** - Non recommandé, souvent bloqué par les FAI

## ✅ Tester Votre Configuration

1. Remplissez tous les champs SMTP dans Admin > Paramètres
2. Activez les notifications email avec le switch
3. Cliquez sur le bouton **"Tester l'email"**
4. Vérifiez votre boîte de réception (et spam/courrier indésirable)

## 🔒 Sécurité

- **Ne partagez jamais** vos mots de passe SMTP
- Utilisez des **mots de passe d'application** plutôt que votre mot de passe principal
- Pour Gmail, activez la **validation en 2 étapes**
- Changez vos clés API régulièrement

## 🐛 Dépannage

### Les emails n'arrivent pas

1. **Vérifiez le dossier spam** - Les emails peuvent être marqués comme spam
2. **Confirmez les identifiants** - Username et password corrects
3. **Vérifiez le port** - 587 est généralement le bon choix
4. **Domaine vérifié** - Certains services exigent la vérification du domaine
5. **Limites de taux** - Vérifiez que vous n'avez pas dépassé votre quota

### Erreur d'authentification

- Gmail : Utilisez un mot de passe d'application, pas votre mot de passe principal
- SendGrid : Le nom d'utilisateur doit être exactement "apikey"
- Vérifiez qu'il n'y a pas d'espaces avant/après vos identifiants

### Emails marqués comme spam

1. Configurez SPF, DKIM et DMARC pour votre domaine
2. Utilisez une adresse email avec votre propre domaine
3. Évitez les mots "spam" dans vos emails
4. Demandez aux destinataires de vous ajouter à leurs contacts

## 📱 Mode Simulation vs Production

**Mode Actuel :** L'application fonctionne en mode simulation car elle s'exécute dans le navigateur.

**Pour l'envoi réel d'emails :**
- Les paramètres SMTP sont stockés et configurés
- Pour une utilisation en production, vous devrez intégrer un backend serveur qui utilisera ces paramètres pour envoyer les emails via SMTP
- Le backend récupérera les paramètres depuis le stockage KV et utilisera une bibliothèque comme `nodemailer` (Node.js) pour l'envoi

## 💡 Conseils

1. **Commencez avec Gmail** si vous débutez - c'est gratuit et facile à configurer
2. **Passez à un service professionnel** (SendGrid, Mailgun) pour un usage intensif
3. **Surveillez vos quotas** pour éviter les interruptions de service
4. **Personnalisez vos emails** via les templates dans le code
5. **Testez régulièrement** pour vous assurer que tout fonctionne

## 📞 Support

Si vous rencontrez des problèmes :
1. Consultez la documentation de votre fournisseur SMTP
2. Vérifiez les logs dans la console du navigateur (F12)
3. Testez avec un service SMTP alternatif pour isoler le problème

---

**Dernière mise à jour :** 2024
**Application :** Green Shuttle To Paris - Système de Réservation
