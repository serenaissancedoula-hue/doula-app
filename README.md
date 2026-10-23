# Sérénaissance · l'appli des doulas et des familles

Appli web (installable sur le téléphone) créée par l'Académie Sérénaissance.
Les données sont dans Supabase (tables `fam_*`, protégées par RLS); les invitations et liens de connexion passent par les fonctions `fam-inviter` et `fam-acces`.

## Publier une nouvelle version
Changer `APP_VERSION` dans `maj.js` et `version` dans `version.json` (même valeur). Les applis ouvertes se mettent à jour toutes seules.
