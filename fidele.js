/* Sérénaissance — documents « page par page », identiques à la trousse de modèles (contrat, annexes A et B).
   Le texte reste modifiable dans « Mes modèles ». Mini-langage : @page titre | page | catégorie | pied · ## section · « libellé | valeur » (ligne à remplir)
   · « - » puce · « [ ] » case · « > » encadré · « @card » carte · @cols / @col / @endcols (deux colonnes) · {{signatures}} {{champ:x}} */
const FID_RE=/^@page /m;
function fidForfaits(d){const nomF=(typeof forfaitDe==='function')?forfaitDe(d):null;
  const cases=Object.entries(FORFAITS).map(([n,f])=>'['+(n===nomF?'x':' ')+'] '+n+' · '+money(f.prix)).join('\n');
  const cartes=Object.entries(FORFAITS).map(([n,f])=>{const r=f.renc===f.acc?'rencontre ':'chaque rencontre ';
    const vers=versPour(n).map(k=>k+' × '+money(Math.round(f.prix/k*100)/100)).join(' · ');
    return '@card '+n+' · '+money(f.prix)+' || '+f.desc+'. || **Valeur :** accouchement '+money(f.acc)+' · '+r+money(f.renc)+' || **Versements :** '+vers}).join('\n');
  return {cases,cartes}}
function fidTokens(d){const F=fidForfaits(d);return String(d.contenu||'').replace(/\{\{cases_forfaits\}\}/g,F.cases).replace(/\{\{cartes_forfaits\}\}/g,F.cartes)}
/* lignes et cases libres du document : chacune a une clé stable (cx1, ln1…) pour que la famille et la doula puissent les remplir */
const FID_DOULA=/^Doula · date|TVH|Total payé|Valeur des services|Pénalité|Remboursement dû|Remboursé le|Date limite/,FID_FORF=/ · \d[\d\s\u00a0\u202f]*\s?\$/,FID_SIG=/^\u0000$/;
window._fid={n:0,ed:null,R:{}};
function fidKey(p){return p+(++window._fid.n)}
function fidEd(d){if(!d||!d.id)return null;if(S.role==='parent'&&d.statut==='a_remplir')return 'p';if(S.role==='doula'&&d.statut==='a_signer_doula')return 'd';return null}
function fidVals(d){return Object.assign({},d.reponses||{},((d.signature_doula||{}).champs)||{})}
function fidInline(s){return esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')}
function fidChamp(d,k,lect){const R=d.reponses||{},c=(d.champs||[]).find(x=>x.k===k);const v=R[k];
  if(lect||!c)return v?esc(v):'&nbsp;';
  const opts=k==='paiement'?versPour(forfaitDe(d)).map(n=>n+(n>1?' versements':' versement')):c.o;
  if(c.type==='choix'&&(k==='paiement'||k==='frequence'))return '<span class="fid-opts"><input type="hidden" class="dch" data-k="'+k+'" value="">'+opts.map(o=>'<label class="fid-opt"><input type="checkbox" data-opt="'+k+'" data-val="'+esc(o)+'"><span>'+esc(o)+'</span></label>').join('')+'</span>';
  if(c.type==='choix')return '<select class="dch" data-k="'+k+'"><option value="">Choisir…</option>'+opts.map(o=>'<option>'+esc(o)+'</option>').join('')+'</select>';
  return '<input type="text" class="dch" data-k="'+k+'" placeholder="'+esc(c.t)+'">'}
window.sigInline=function(q,d,s){if(s)return null;const ok=((q==='Parent'||q==='Parent 1')&&S.role==='parent'&&d.statut==='a_remplir'&&d.sig_parent_requise)||(q==='Doula'&&S.role==='doula'&&d.statut==='a_signer_doula');if(!ok)return null;
  return {nom:'<input type="text" id="sigNom" class="sig-nom" placeholder="Votre nom complet">',sig:'<canvas class="sig" id="sigC" width="600" height="180"></canvas><button type="button" class="btn sm ghost" data-act="sigEff">Effacer</button>'}};
function fidSig2(d){try{const r=fidVals(d).sig2;const o=r?(typeof r==='string'?JSON.parse(r):r):null;return o&&o.image&&/^data:image\/png;base64,[A-Za-z0-9+\/=]+$/.test(o.image)?o:null}catch(e){return null}}
function fidSigs(d){const I=infoDoula();const rangs=[['Doula',d.signature_doula,I.nom],['Parent 1',d.signature_parent,''],['Parent 2',fidSig2(d),'']];
  const F=window._fid,sa=F.ed?'<input type="text" class="'+(F.ed==='d'?'dchd':'dch')+'" data-k="'+(F.ed==='d'?'signe_a_d':'signe_a')+'" placeholder="Ville, date" aria-label="Signé à · le">':esc([F.R.signe_a,F.R.signe_a_d].filter(Boolean).join(' / '))||'&nbsp;';
  return '<div class="fid-row"><span>Signé à · le</span><b>'+sa+'</b></div><div class="pap-sigs">'+rangs.map(([q,s,n])=>{const ins=(q==='Parent 2'&&!s&&F.ed==='p')?{nom:'<input type="text" id="sigNom2" class="sig-nom" placeholder="Nom du parent 2 (facultatif)">',sig:'<button type="button" class="pad-zone" data-act="padOpen" data-t="sig2">✎ Toucher pour signer</button><input type="hidden" class="dch" data-k="sig2" id="sig2v"><canvas id="sigC2" width="600" height="180" hidden></canvas>'}:sigInline(q,d,s);return '<div>'+(ins?ins.nom:esc(s?s.nom:n))+'</div><div class="'+(ins?(q==='Parent 2'?'sig-cell2':'sig-cell'):'')+'">'+(ins?ins.sig:(s&&s.image?'<img src="'+esc(s.image)+'" alt="Signature">':''))+'</div><div>'+(s&&s.le?fmtD(new Date(s.le),{day:'numeric',month:'short',year:'numeric'}):'')+'</div><small>Nom en lettres moulées : '+q+'</small><small>Signature</small><small>Date</small>'}).join('')+'</div>'}
function fidBloc(l,d,lect,st){
  if(l.startsWith('## '))return '<h3 class="pap-sec">'+esc(l.slice(3))+'</h3>';
  if(l==='{{signatures}}')return fidSigs(d);
  if(l.startsWith('@card ')){const p=l.slice(6).split(' || ');return '<div class="fid-card"><h4>'+fidInline(p[0])+'</h4>'+p.slice(1).map(x=>'<p>'+fidInline(x)+'</p>').join('')+'</div>'}
  if(l.startsWith('>! ')||l.startsWith('>~ ')){const p=l.slice(3).split(' || ');return '<div class="fid-call '+(l[1]==='!'?'rouge':'sauge')+'"><h4>'+fidInline(p[0])+'</h4><p>'+fidInline(p[1]||'')+'</p></div>'}
  if(l.startsWith('[ ] ')||l.startsWith('[x] ')){
    if(!FID_FORF.test(l)){const k=fidKey('cx'),F=window._fid,on=l[1]==='x'||!!F.R[k];
      if(F.ed==='p')return '<label class="pap-case fid-cx"><input type="checkbox" class="dch" data-k="'+k+'"><span>'+fidInline(l.slice(4))+'</span></label>';
      return '<p class="pap-case"><span class="bx">'+(on?'✕':'')+'</span>'+fidInline(l.slice(4))+'</p>'}
    return '<p class="pap-case"><span class="bx">'+(l[1]==='x'?'✕':'')+'</span>'+fidInline(l.slice(4))+'</p>'}
  if(l.startsWith('- '))return '<li>'+fidInline(l.slice(2))+'</li>';
  if(/^_.+_$/.test(l))return '<p class="fid-note">'+fidInline(l.slice(1,-1))+'</p>';
  if(l.includes(' | ')||/ \|$/.test(l)){const i=l.indexOf(' |');const lab=l.slice(0,i),val=l.slice(i+2).trim();
    let vh=esc(val).replace(/\{\{champ:(\w+)\}\}/g,(m,k)=>fidChamp(d,k,lect));
    if(val===''&&!FID_SIG.test(lab)){const k=fidKey('ln'),F=window._fid,dou=FID_DOULA.test(lab),mine=(F.ed==='p'&&!dou)||(F.ed==='d'&&dou);
      vh=mine?'<input type="text" class="'+(F.ed==='d'?'dchd':'dch')+'" data-k="'+k+'" aria-label="'+esc(lab)+'">':(F.R[k]?esc(F.R[k]):'')}
    return '<div class="fid-row"><span>'+fidInline(lab)+'</span><b>'+(vh.trim()||'&nbsp;')+'</b></div>'}
  return '<p>'+fidInline(l).replace(/\{\{champ:(\w+)\}\}/g,(m,k)=>fidChamp(d,k,lect))+'</p>'}
function fidBlocs(lines,d,lect){let h='',ul=false;const fermeUl=()=>{if(ul){h+='</ul>';ul=false}};
  lines.forEach(l=>{if(l.startsWith('- ')){if(!ul){h+='<ul class="fid-ul">';ul=true}}else fermeUl();h+=fidBloc(l,d,lect)});fermeUl();return h}
function fidHtml(d,lect){window._fid={n:0,ed:fidEd(d),R:fidVals(d)};const I=infoDoula(),L=fidTokens(d).split('\n').map(x=>x.replace(/\s+$/,'')).filter(x=>x.trim()),pages=[];
  L.forEach(l=>{if(l.startsWith('@page ')){const p=l.slice(6).split(' | ');pages.push({t:p[0],pg:p[1]||'',cat:p[2]||'',pied:p[3]||'',lines:[]})}else if(pages.length)pages[pages.length-1].lines.push(l)});
  return '<div class="fid" id="docImp">'+pages.map(p=>{
    let corps='',cols=null;const plain=[];const flush=()=>{if(plain.length){corps+=fidBlocs(plain.splice(0),d,lect)}};
    p.lines.forEach(l=>{if(l==='@cols'){flush();cols=[[]]}else if(l==='@col'){cols.push([])}else if(l==='@endcols'){corps+='<div class="fid-cols">'+cols.map(c=>'<div>'+fidBlocs(c,d,lect)+'</div>').join('')+'</div>';cols=null}else if(cols)cols[cols.length-1].push(l);else plain.push(l)});flush();
    return '<section class="fid-pg"><div class="pap-bar"></div><div class="pap-tete"><img src="img/logo-icone.png" alt=""><span class="pap-marque">'+esc(I.ent||'Sérénaissance')+'</span><span class="pap-cat">'+esc(p.cat)+'</span></div>'+
      '<div class="fid-titre"><h2>'+esc(p.t)+'</h2><span>'+esc(p.pg)+'</span></div>'+corps+
      '<div class="fid-pied"><span>'+esc([I.ent,I.nom,I.tel,I.courriel].filter(Boolean).join(' · '))+'</span><span>'+esc(p.pied)+'</span></div></section>'}).join('')+'</div>'}
/* texte à plat pour le PDF */
window.fidPlat=function(d){const R=fidVals(d);let N=0;return fidTokens(d).split('\n').map(l=>{
  if(l.startsWith('@page '))return '## '+l.slice(6).split(' | ')[0];
  if(l==='{{signatures}}'){const sa=[R.signe_a,R.signe_a_d].filter(Boolean).join(' / ');return sa?'Signé à · le : '+sa:''}if(/^@(cols|col|endcols)$/.test(l)||l==='## Signatures')return '';
  if(l.startsWith('@card '))return '## '+l.slice(6).split(' || ')[0]+'\n'+l.slice(6).split(' || ').slice(1).join('\n').replace(/\*\*/g,'');
  if(l.startsWith('>! ')||l.startsWith('>~ '))return '## '+l.slice(3).split(' || ')[0]+'\n'+(l.slice(3).split(' || ')[1]||'');
  if((l.startsWith('[x] ')||l.startsWith('[ ] '))&&!FID_FORF.test(l)){const on=l[1]==='x'||!!R['cx'+(++N)];return (on?'☑ ':'☐ ')+l.slice(4)}if(l.startsWith('[x] '))return '☑ '+l.slice(4);if(l.startsWith('[ ] '))return '☐ '+l.slice(4);
  if(l.startsWith('- '))return '• '+l.slice(2);
  if(/^_.+_$/.test(l))return l.slice(1,-1);
  const orig=l;  l=l.replace(/\{\{champ:(\w+)\}\}/g,(m,k)=>R[k]||'').replace(/\*\*/g,'');
  if(l.includes(' | ')||/ \|$/.test(l)){const i=l.indexOf(' |'),lab=l.slice(0,i),rawv=l.slice(i+2).trim(),rawo=orig.slice(orig.indexOf(' |')+2).trim();if(rawo===''&&!FID_SIG.test(lab)){return lab+' : '+(R['ln'+(++N)]||'')}return lab+' : '+rawv}
  return l}).join('\n')};
const _dvF=docVue;docVue=function(d,doula){if(FID_RE.test(d.contenu||'')){const lect=doula||d.statut!=='a_remplir';return fidHtml(d,lect)}return _dvF(d,doula)};
const _rtF=rendreTexte;rendreTexte=function(t){if(FID_RE.test(t||''))return fidHtml({contenu:t,type:S.modK||'contrat',reponses:{},champs:[],statut:'signe'},true);return _rtF(t)};
const _mtF=modeleTexte;modeleTexte=function(k){const v=_mtF(k);if(k==='contrat'&&!FID_RE.test(v||''))return MODELES_DEFAUT()[k];return v};
const _dmF=DSUB.modeles;DSUB.modeles=function(){if(S.modApercu===undefined)S.modApercu=1;return _dmF()};
/* aperçu d'un modèle tel que la famille le verra (même mise en page que le document envoyé) */
window.apercuDoc=function(k,txt,ex){const T=DOC_TYPES[k]||{};const type=/^merci/.test(k)?'merci':k.startsWith('lettre_')?(k==='lettre_fin'?'fin':'forfaits'):k;
  try{return docVue({type,titre:T.titre||((MOD_LISTE.find(x=>x[0]===k)||[k,k])[1]),contenu:remplirModele(txt,ex),champs:T.champs||[],statut:'signe',reponses:{}},true)}catch(e){return '<div class="doc">'+rendreTexte(remplirModele(txt,ex))+'</div>'}};

/* une seule case cochée par choix ; la valeur va dans le champ caché lu à l'envoi */
document.addEventListener('change',e=>{const c=e.target.closest('input[data-opt]');if(!c)return;const g=c.dataset.opt;
  document.querySelectorAll('input[data-opt="'+g+'"]').forEach(x=>{if(x!==c)x.checked=false});
  const h=document.querySelector('input.dch[data-k="'+g+'"]');if(h)h.value=c.checked?c.dataset.val:''});
/* la signature se fait sur le document : on retire le cadre séparé en dessous */
const _odFid=ouvrirDoc;ouvrirDoc=async function(id){await _odFid(id);try{if(document.querySelector('.sheet .fid #sigNom, .sheet .papier #sigNom'))document.querySelectorAll('.sheet #sigNom').forEach(n=>{if(!n.closest('.fid,.papier')){const st=n.closest('.stack');if(st)st.remove()}})}catch(e){}};
