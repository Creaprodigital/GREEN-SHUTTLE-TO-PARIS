# Fix: Visibility des codes promo et véhicules créés

## Problème identifié
Les codes promo et véhicules créés n'étaient pas visibles après leur création dans le tableau de bord administrateur.

## Cause
Le composant PromoCodeManager utilisait un rendu conditionnel qui cachait complètement la section de liste si aucun code promo n'existait. Cela créait une confusion car l'utilisateur ne voyait pas de confirmation visuelle après avoir créé un élément.

## Solution appliquée

### 1. PromoCodeManager.tsx
- **Avant**: La section de liste n'apparaissait que si `promoCodes && promoCodes.length > 0`
- **Après**: La section de liste apparaît toujours avec:
  - Un message "Aucun code promo créé pour le moment" quand la liste est vide
  - La liste des codes promo dès qu'ils sont créés
- Ajout de gestion robuste des cas null/undefined avec `(promoCodes || [])`

### 2. AdminDashboard.tsx (Section Véhicules)
- **Avant**: La section montrait toujours quelque chose (DEFAULT_FLEET), mais sans indication claire
- **Après**: Ajout d'un état vide explicite:
  - Message "Aucun véhicule créé pour le moment" quand aucun véhicule n'existe
  - Instructions "Utilisez le formulaire ci-dessus pour ajouter votre premier véhicule"
  - La liste apparaît immédiatement après la création d'un véhicule

## Résultat
Les utilisateurs peuvent maintenant:
1. Voir clairement quand aucun élément n'existe (état vide)
2. Voir immédiatement les éléments qu'ils créent apparaître dans la liste
3. Comprendre où se trouvent leurs créations avec un compteur `(X éléments)`
