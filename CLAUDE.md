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
