/* Sérénaissance — produit les deux sites à publier séparément : l'Espace Doula et l'Espace Famille.
   Utilisation :  node build-sites.js            (les deux)
                  node build-sites.js doula      (un seul : doula ou famille)
   Avant : les fichiers assemblés dist/app-*.js doivent être à jour (node build.js N, voir CLAUDE.md).
   Sortie : sites/doula/ et sites/famille/. Chaque site a son index.html, son manifeste et son sw.js à la racine,
   donc sa propre adresse (doula.… / famille.…) et sa propre appli Android.
   Réglages (adresses, identifiants Android, empreintes) : sites.json.
   Aucune dépendance : seulement Node (Cloudflare Pages : « node build-sites.js doula », dossier de sortie sites/doula). */
const fs = require('fs'), path = require('path');

const CFG = JSON.parse(fs.readFileSync('sites.json', 'utf8'));
const ADRESSES = { doula: CFG.doula.url, famille: CFG.famille.url };

const COMMUN_FICHIERS = ['style.css', 'moderne.css', 'polissage.css', 'logo.png', 'reglages.js', 'sw.js', 'version.json', 'couple.jpg', 'doula.jpg', 'parents.jpg', 'logo-famille.png', 'logo-doula.png'];
const COMMUN_DOSSIERS = ['icones', 'img', 'lib', 'tr'];
const SITES = {
  doula: { html: 'index.html', manifeste: 'manifest.webmanifest', bundle: 'app-doula.js', en_plus: [] },
  famille: { html: 'parents/index.html', manifeste: 'parents/manifest.webmanifest', bundle: 'app-parents.js', en_plus: ['couleurs.js', 'i18n.js', 'contenu-riche-en.js'] }
};

/* Entêtes Cloudflare Pages : le service worker et la page ne doivent jamais rester dans un cache (sinon les mises à jour n'arrivent pas). */
const ENTETES = [
  '/', '  Cache-Control: no-cache', '',
  '/index.html', '  Cache-Control: no-cache', '',
  '/sw.js', '  Cache-Control: no-cache', '',
  '/version.json', '  Cache-Control: no-cache', '',
  '/.well-known/assetlinks.json', '  Content-Type: application/json', '  Access-Control-Allow-Origin: *', ''
].join('\n');

function copier(src, dest) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(src, dest); }

function page(nom, def) {
  let h = fs.readFileSync(def.html, 'utf8');
  if (nom === 'famille') { /* la page vivait dans /parents/ : à la racine de son propre site, plus de <base> ni de chemin parents/ */
    h = h.replace(/<base href="\.\.\/">\s*\n?/, '').replace('href="parents/manifest.webmanifest"', 'href="manifest.webmanifest"');
  }
  const posee = '<script>window.SITES=' + JSON.stringify(ADRESSES) + '</script>';
  if (!/<script>window\.ESPACE=/.test(h)) throw new Error(def.html + ' : repère window.ESPACE introuvable');
  return h.replace(/<script>window\.ESPACE=/, posee + '\n<script>window.ESPACE=');
}

function manifeste(nom, def) {
  const m = JSON.parse(fs.readFileSync(def.manifeste, 'utf8'));
  m.icons = (m.icons || []).map(i => ({ ...i, src: i.src.replace(/^\.\.\//, '') }));
  return JSON.stringify(m, null, 2) + '\n';
}

/* Contrôle : chaque fichier nommé dans la page, le service worker et le fichier assemblé existe dans le site. */
function controle(nom, dir, textes) {
  const re = /['"`(]((?:\.\/)?(?:(?:img|tr|lib|icones)\/[A-Za-z0-9_\-./]+|[A-Za-z0-9_-]+)\.(?:js|css|png|jpg|jpeg|webp|svg|webmanifest|mp3))(?:\?[^'"`)]*)?['"`)]/g;
  const manque = new Set(), vus = new Set();
  for (const t of textes) for (const m of t.matchAll(re)) {
    const f = m[1].replace(/^\.\//, ''); if (vus.has(f)) continue; vus.add(f);
    if (!fs.existsSync(path.join(dir, f))) manque.add(f);
  }
  return { verifies: vus.size, manque: [...manque] };
}

const demandes = process.argv.slice(2).filter(a => SITES[a]);
const aFaire = demandes.length ? demandes : Object.keys(SITES);
let echec = false;
for (const nom of aFaire) {
  const def = SITES[nom], dir = path.join('sites', nom), bundle = path.join('dist', def.bundle);
  if (!fs.existsSync(bundle)) { console.error(bundle + ' manque : lancez d\'abord node build.js N'); process.exit(1); }
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  for (const f of COMMUN_FICHIERS.concat(def.en_plus)) copier(f, path.join(dir, f));
  for (const d of COMMUN_DOSSIERS) fs.cpSync(d, path.join(dir, d), { recursive: true });
  if (nom === 'doula' && fs.existsSync('icones-doula')) fs.cpSync('icones-doula', path.join(dir, 'icones'), { recursive: true }); /* icône propre à l'Espace Doula */
  if (nom === 'famille' && fs.existsSync('icones-famille')) fs.cpSync('icones-famille', path.join(dir, 'icones'), { recursive: true }); /* icône propre à l'Espace Famille */
  copier(bundle, path.join(dir, 'dist', def.bundle));
  fs.writeFileSync(path.join(dir, 'index.html'), page(nom, def));
  fs.writeFileSync(path.join(dir, 'manifest.webmanifest'), manifeste(nom, def));
  fs.writeFileSync(path.join(dir, '_headers'), ENTETES);
  /* Android (Google Play) : le fichier assetlinks.json n'est écrit que lorsque l'empreinte de la clé est dans sites.json */
  const a = CFG[nom].android;
  if (a && a.sha256 && a.sha256.length) {
    fs.mkdirSync(path.join(dir, '.well-known'), { recursive: true });
    fs.writeFileSync(path.join(dir, '.well-known', 'assetlinks.json'), JSON.stringify([{ relation: ['delegate_permission/common.handle_all_urls'], target: { namespace: 'android_app', package_name: a.package, sha256_cert_fingerprints: a.sha256 } }], null, 2) + '\n');
  }
  const lire = f => fs.readFileSync(path.join(dir, f), 'utf8');
  const r = controle(nom, dir, [lire('index.html'), lire('manifest.webmanifest'), lire('sw.js'), lire('dist/' + def.bundle)]);
  let n = 0, octets = 0;
  (function parcourir(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) parcourir(p); else { n++; octets += fs.statSync(p).size; } } })(dir);
  console.log(nom + ' : ' + n + ' fichiers, ' + (octets / 1048576).toFixed(1) + ' Mo → ' + dir + '/  (' + r.verifies + ' références contrôlées' + (r.manque.length ? ', MANQUE : ' + r.manque.join(', ') : ', rien ne manque') + ')');
  if (r.manque.length) echec = true;
}
if (echec) process.exit(1);
