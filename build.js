/* Sérénaissance — assemblage des fichiers de l'appli en un seul fichier par espace (plus rapide à ouvrir).
   Les fichiers sources restent tels quels ; la liste et l'ordre sont dans build/doula.txt et build/parents.txt.
   Utilisation : node build.js 277   (le numéro de version)
   - assemble les fichiers dans l'ordre, dans dist/app-doula.js et dist/app-parents.js
   - une fonction déclarée deux fois (dans deux fichiers) devient une affectation dans le 2e fichier,
     pour garder exactement le même comportement qu'avec des fichiers séparés
   - remplace, dans index.html et parents/index.html, le bloc entre <!--app--> et <!--/app--> */
const fs = require('fs'), path = require('path');
const acorn = require(fs.existsSync('/opt/npm-tools/node_modules/acorn') ? '/opt/npm-tools/node_modules/acorn' : 'acorn');
let esbuild = null; try { esbuild = require(fs.existsSync('/opt/npm-tools/node_modules/esbuild') ? '/opt/npm-tools/node_modules/esbuild' : 'esbuild'); } catch (e) {}
const V = process.argv[2]; if (!V) { console.error('Donnez le numéro de version : node build.js 277'); process.exit(1); }
const ESPACES = [['doula', 'index.html', 'app-doula.js'], ['parents', 'parents/index.html', 'app-parents.js']];
fs.mkdirSync('dist', { recursive: true });
for (const [nom, html, sortie] of ESPACES) {
  const liste = fs.readFileSync('build/' + nom + '.txt', 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'));
  const vus = {}; let morceaux = [];
  for (const f of liste) {
    let src = fs.readFileSync(f, 'utf8');
    const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true });
    const rempl = [];
    for (const n of ast.body) if (n.type === 'FunctionDeclaration') {
      if (vus[n.id.name]) rempl.push(n); else vus[n.id.name] = f;
    }
    rempl.sort((a, b) => b.start - a.start).forEach(n => {
      src = src.slice(0, n.start) + n.id.name + '=' + src.slice(n.start, n.end) + ';' + src.slice(n.end);
    });
    morceaux.push('/* ---- ' + f + ' ---- */\n' + src + '\n;');
  }
  let code = morceaux.join('\n');
  if (esbuild) code = esbuild.transformSync(code, { loader: 'js', minifyWhitespace: true, legalComments: 'none', charset: 'utf8' }).code;
  acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script' }); /* vérifie que le tout se lit */
  fs.writeFileSync('dist/' + sortie, '/* Sérénaissance ' + V + ' — fichier assemblé (sources dans le dépôt, liste dans build/' + nom + '.txt) */\n' + code);
  let h = fs.readFileSync(html, 'utf8');
  h = h.replace(/<!--app-->[\s\S]*?<!--\/app-->/, '<!--app--><script src="dist/' + sortie + '?v=' + V + '"></script><!--/app-->');
  h = h.replace(/\?v=\d+/g, '?v=' + V);
  fs.writeFileSync(html, h);
  console.log(nom + ' : ' + liste.length + ' fichiers → dist/' + sortie + ' (' + Math.round(code.length / 1024) + ' Ko)');
}
