# Sérénaissance — notes pour travailler dans ce dépôt

- Deux espaces : `index.html` (Espace Doula) et `parents/index.html` (Espace Parents, `<base href="../">`).
- Les fichiers `.js` à la racine sont les **sources**. Les pages chargent un seul fichier assemblé par espace :
  `dist/app-doula.js` et `dist/app-parents.js`, entre `<!--app-->` et `<!--/app-->`.
- Ordre de chargement : `build/doula.txt` et `build/parents.txt` (ajouter un nouveau fichier ici, à la bonne place).
- **Après toute modification d'un .js**, reconstruire avec le nouveau numéro de version :
  1. `maj.js` : `APP_VERSION='AAAA.MM.JJ-N'` ; `version.json` : même version + « nouveautes »
  2. `sw.js` : incrémenter `VERSION` (`sere-app-vNN`)
  3. `node build.js N` (met aussi à jour tous les `?v=` des deux pages)
- Le service worker prend les fichiers `?v=` dans le cache du téléphone : sans nouveau numéro, les changements n'arrivent pas.
- Une demande pour l'Espace Doula ne doit pas changer l'Espace Parents (et l'inverse).
- **Deux sites séparés (Google Play)** : `node build-sites.js` (après `node build.js N`) produit `sites/doula/` et `sites/famille/`,
  chacun avec son `index.html`, son manifeste et son `sw.js` à la racine. Adresses, identifiants Android et empreintes : `sites.json`.
  `window.SITES` est posé dans les pages par ce script; sans lui (ancien site unique), les liens entre espaces restent comme avant.
  Le dossier `sites/` est généré (non versionné). Cloudflare Pages : commande `node build-sites.js doula` (ou `famille`), sortie `sites/doula` (ou `sites/famille`).
- Pas de fichier de plus de 25 Mo dans le dépôt (limite de Cloudflare Pages). La 3D de bébé a été retirée : seulement des images fixes.
