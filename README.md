# Sérénaissance · l'appli des doulas et des familles

Appli web (installable sur le téléphone) créée par l'Académie Sérénaissance.
Les données sont dans Supabase (tables `fam_*`, protégées par RLS); les invitations et liens de connexion passent par les fonctions `fam-inviter` et `fam-acces`.

## Publier une nouvelle version
Changer `APP_VERSION` dans `maj.js` et `version` dans `version.json` (même valeur). Les applis ouvertes se mettent à jour toutes seules.

## Deux sites, deux applis Android
L'Espace Doula et l'Espace Famille se publient chacun sur leur propre adresse (voir `sites.json`) pour avoir chacun leur fiche Google Play.
`node build-sites.js` produit `sites/doula` et `sites/famille` à partir des fichiers assemblés (`dist/`).
Pour Google Play : une fois l'appli créée dans la console, mettre l'empreinte SHA-256 de la clé de signature dans `sites.json` (`android.sha256`),
relancer le build : le fichier `.well-known/assetlinks.json` est alors ajouté au site.
