/* Sérénaissance — documents « page par page », identiques à la trousse de modèles (contrat, annexes A et B).
   Le texte reste modifiable dans « Mes modèles ». Mini-langage : @page titre | page | catégorie | pied · ## section · « libellé | valeur » (ligne à remplir)
   · « - » puce · « [ ] » case · « > » encadré · « @card » carte · @cols / @col / @endcols (deux colonnes) · {{signatures}} {{champ:x}} */
const FID_RE=/^@page /m;
function fidForfaits(d){const nomF=(typeof forfaitDe==='function')?forfaitDe(d):null;
  const cases=Object.entries(FORFAITS).map(([n,f])=>'['+(n===nomF?'x':' ')+'] '+n+' · '+money(f.prix)).join('\n');
  const cartes=Object.entries(FORFAITS).map(([n,f])=>{const r=f.renc===f.acc?'rencontre ':'chaque rencontre ';
    const vers=['1 × '+money(f.prix),'2 × '+money(f.prix/2)].concat(/^Accompagnement/.test(n)?['4 × '+money(f.prix/4)]:[]).join(' · ');
    return '@card '+n+' · '+money(f.prix)+' || '+f.desc+'. || **Valeur :** accouchement '+money(f.acc)+' · '+r+money(f.renc)+' || **Versements :** '+vers}).join('\n');
  return {cases,cartes}}
function fidTokens(d){const F=fidForfaits(d);return String(d.contenu||'').replace(/\{\{cases_forfaits\}\}/g,F.cases).replace(/\{\{cartes_forfaits\}\}/g,F.cartes)}
function fidInline(s){return esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')}
function fidChamp(d,k,lect){const R=d.reponses||{},c=(d.champs||[]).find(x=>x.k===k);const v=R[k];
  if(lect||!c)return v?esc(v):'&nbsp;';
  if(c.type==='choix')return '<select class="dch" data-k="'+k+'"><option value="">Choisir…</option>'+c.o.map(o=>'<option>'+esc(o)+'</option>').join('')+'</select>';
  return '<input type="text" class="dch" data-k="'+k+'" placeholder="'+esc(c.t)+'">'}
function fidSigs(d){const I=infoDoula();const rangs=[['Doula',d.signature_doula,I.nom],['Parent 1',d.signature_parent,''],['Parent 2',null,'']];
  return '<div class="fid-row"><span>Signé à · le</span><b>&nbsp;</b></div><div class="pap-sigs">'+rangs.map(([q,s,n])=>'<div>'+esc(s?s.nom:n)+'</div><div>'+(s&&s.image?'<img src="'+esc(s.image)+'" alt="Signature">':'')+'</div><div>'+(s&&s.le?fmtD(new Date(s.le),{day:'numeric',month:'short',year:'numeric'}):'')+'</div><small>Nom en lettres moulées : '+q+'</small><small>Signature</small><small>Date</small>').join('')+'</div>'}
function fidBloc(l,d,lect,st){
  if(l.startsWith('## '))return '<h3 class="pap-sec">'+esc(l.slice(3))+'</h3>';
  if(l==='{{signatures}}')return fidSigs(d);
  if(l.startsWith('@card ')){const p=l.slice(6).split(' || ');return '<div class="fid-card"><h4>'+fidInline(p[0])+'</h4>'+p.slice(1).map(x=>'<p>'+fidInline(x)+'</p>').join('')+'</div>'}
  if(l.startsWith('>! ')||l.startsWith('>~ ')){const p=l.slice(3).split(' || ');return '<div class="fid-call '+(l[1]==='!'?'rouge':'sauge')+'"><h4>'+fidInline(p[0])+'</h4><p>'+fidInline(p[1]||'')+'</p></div>'}
  if(l.startsWith('[ ] ')||l.startsWith('[x] '))return '<p class="pap-case"><span class="bx">'+(l[1]==='x'?'✕':'')+'</span>'+fidInline(l.slice(4))+'</p>';
  if(l.startsWith('- '))return '<li>'+fidInline(l.slice(2))+'</li>';
  if(/^_.+_$/.test(l))return '<p class="fid-note">'+fidInline(l.slice(1,-1))+'</p>';
  if(l.includes(' | ')||/ \|$/.test(l)){const i=l.indexOf(' |');const lab=l.slice(0,i),val=l.slice(i+2).trim();
    const vh=esc(val).replace(/\{\{champ:(\w+)\}\}/g,(m,k)=>fidChamp(d,k,lect));
    return '<div class="fid-row"><span>'+fidInline(lab)+'</span><b>'+(vh.trim()||'&nbsp;')+'</b></div>'}
  return '<p>'+fidInline(l).replace(/\{\{champ:(\w+)\}\}/g,(m,k)=>fidChamp(d,k,lect))+'</p>'}
function fidBlocs(lines,d,lect){let h='',ul=false;const fermeUl=()=>{if(ul){h+='</ul>';ul=false}};
  lines.forEach(l=>{if(l.startsWith('- ')){if(!ul){h+='<ul class="fid-ul">';ul=true}}else fermeUl();h+=fidBloc(l,d,lect)});fermeUl();return h}
function fidHtml(d,lect){const I=infoDoula(),L=fidTokens(d).split('\n').map(x=>x.replace(/\s+$/,'')).filter(x=>x.trim()),pages=[];
  L.forEach(l=>{if(l.startsWith('@page ')){const p=l.slice(6).split(' | ');pages.push({t:p[0],pg:p[1]||'',cat:p[2]||'',pied:p[3]||'',lines:[]})}else if(pages.length)pages[pages.length-1].lines.push(l)});
  return '<div class="fid" id="docImp">'+pages.map(p=>{
    let corps='',cols=null;const plain=[];const flush=()=>{if(plain.length){corps+=fidBlocs(plain.splice(0),d,lect)}};
    p.lines.forEach(l=>{if(l==='@cols'){flush();cols=[[]]}else if(l==='@col'){cols.push([])}else if(l==='@endcols'){corps+='<div class="fid-cols">'+cols.map(c=>'<div>'+fidBlocs(c,d,lect)+'</div>').join('')+'</div>';cols=null}else if(cols)cols[cols.length-1].push(l);else plain.push(l)});flush();
    return '<section class="fid-pg"><div class="pap-bar"></div><div class="pap-tete"><img src="img/logo-icone.png" alt=""><span class="pap-marque">'+esc(I.ent||'Sérénaissance')+'</span><span class="pap-cat">'+esc(p.cat)+'</span></div>'+
      '<div class="fid-titre"><h2>'+esc(p.t)+'</h2><span>'+esc(p.pg)+'</span></div>'+corps+
      '<div class="fid-pied"><span>'+esc([I.ent,I.nom,I.tel,I.courriel].filter(Boolean).join(' · '))+'</span><span>'+esc(p.pied)+'</span></div></section>'}).join('')+'</div>'}
/* texte à plat pour le PDF */
window.fidPlat=function(d){return fidTokens(d).split('\n').map(l=>{const R=d.reponses||{};
  if(l.startsWith('@page '))return '## '+l.slice(6).split(' | ')[0];
  if(/^@(cols|col|endcols)$/.test(l)||l==='{{signatures}}'||l==='## Signatures')return '';
  if(l.startsWith('@card '))return '## '+l.slice(6).split(' || ')[0]+'\n'+l.slice(6).split(' || ').slice(1).join('\n').replace(/\*\*/g,'');
  if(l.startsWith('>! ')||l.startsWith('>~ '))return '## '+l.slice(3).split(' || ')[0]+'\n'+(l.slice(3).split(' || ')[1]||'');
  if(l.startsWith('[x] '))return '☑ '+l.slice(4);if(l.startsWith('[ ] '))return '☐ '+l.slice(4);
  if(l.startsWith('- '))return '• '+l.slice(2);
  if(/^_.+_$/.test(l))return l.slice(1,-1);
  l=l.replace(/\{\{champ:(\w+)\}\}/g,(m,k)=>R[k]||'').replace(/\*\*/g,'');
  if(l.includes(' | ')||/ \|$/.test(l)){const i=l.indexOf(' |');return l.slice(0,i)+' : '+l.slice(i+2).trim()}
  return l}).join('\n')};
const _dvF=docVue;docVue=function(d,doula){if(FID_RE.test(d.contenu||'')){const lect=doula||d.statut!=='a_remplir';return fidHtml(d,lect)}return _dvF(d,doula)};
const _rtF=rendreTexte;rendreTexte=function(t){if(FID_RE.test(t||''))return fidHtml({contenu:t,type:S.modK||'contrat',reponses:{},champs:[],statut:'signe'},true);return _rtF(t)};
const _mtF=modeleTexte;modeleTexte=function(k){const v=_mtF(k);if(k==='contrat'&&!FID_RE.test(v||''))return MODELES_DEFAUT()[k];return v};
const _dmF=DSUB.modeles;DSUB.modeles=function(){if(S.modApercu===undefined)S.modApercu=1;return _dmF()};
