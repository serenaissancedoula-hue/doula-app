/* Sérénaissance — Espace propriétaire : conditions d'utilisation signées (doulas et parents) + accès aux avis.
   Chaque acceptation est gardée dans fam_cgu_signatures (nom tapé, courriel, version, date) ;
   le texte exact de chaque version est gardé dans fam_cgu_textes. Lecture réservée à la propriétaire. */
(function(){
if(window.ESPACE==='parent')return;
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let SIG=null,FILTRE='tous',TXT={};
const dateL=d=>{try{return new Date(d).toLocaleString('fr-CA',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}catch(e){return d||''}};
const qui=s=>s.doula&&s.parent?'Doula et parent':s.doula?'Doula':s.parent?'Parent':'Compte sans espace';
/* garde le texte de la version actuelle (la propriétaire seule peut l'écrire) */
async function garderTexte(){try{const C=window.CGU_ACTUEL;if(!C)return;
  const ex=await sb.from('fam_cgu_textes').select('version').eq('version',C.V).limit(1);if(ex.data&&ex.data.length)return;
  await sb.from('fam_cgu_textes').upsert(['fr','en'].map(l=>({version:C.V,langue:l,titre:C.T[l].titre,corps:C.T[l].corps,ok:C.T[l].ok})))}catch(e){}}
async function charger(){const el=document.getElementById('cguListe');if(!el)return;
  await garderTexte();
  const {data,error}=await sb.rpc('fam_admin_cgu');
  if(error){el.innerHTML='<p class="small muted">Impossible de lire les signatures : '+E(error.message)+'</p>';return}
  SIG=data||[];afficher()}
function afficher(){const el=document.getElementById('cguListe');if(!el||!SIG)return;
  const L=SIG.filter(s=>FILTRE==='tous'||(FILTRE==='doula'?s.doula:FILTRE==='parent'?s.parent:false));
  const q=(document.getElementById('cguQ')||{}).value;const qq=(q||'').trim().toLowerCase();
  const V=L.filter(s=>!qq||[s.nom,s.courriel,s.nom_doula,s.nom_parent].join(' ').toLowerCase().includes(qq));
  const nb=k=>SIG.filter(s=>k==='tous'||s[k]).length;
  const btn=(k,t)=>'<button class="chip'+(FILTRE===k?' on':'')+'" data-act="cguFiltre" data-v="'+k+'" style="'+(FILTRE===k?'background:var(--accent);color:#fff;border-color:var(--accent)':'')+'">'+t+' ('+nb(k)+')</button>';
  const actuelle=(window.CGU_ACTUEL||{}).V;
  el.innerHTML='<div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:8px">'+btn('tous','Toutes')+btn('doula','Doulas')+btn('parent','Parents')+'</div>'+
    (V.length?V.map(s=>'<div class="cl dh-row" style="align-items:flex-start"><div class="av" style="background:'+(s.doula?'#f3d5c9':'#d9e6d4')+'">'+icon(s.doula?'fa-user-nurse':'fa-baby')+'</div><div style="flex:1;min-width:0">'+
      '<b>'+E(s.nom||'(sans nom)')+'</b>'+(s.test?' <span class="pill line">test</span>':'')+'<div class="xs muted">'+E(qui(s))+' · '+E(s.courriel||'')+'</div>'+
      '<div class="xs">Signé le '+E(dateL(s.signe_le))+' · version du '+E(s.version||'?')+(actuelle&&s.version!==actuelle?' <span class="pill">ancienne version</span>':'')+'</div></div>'+
      '<button class="btn sm ghost" data-act="cguVoir" data-id="'+s.id+'">'+icon('fa-file-signature')+'Voir</button></div>').join(''):'<p class="small muted">Aucune signature'+(qq?' pour cette recherche':'')+'.</p>')}
async function texte(v){if(TXT[v])return TXT[v];const {data}=await sb.from('fam_cgu_textes').select('*').eq('version',v).eq('langue','fr').limit(1);
  let t=data&&data[0];if(!t&&window.CGU_ACTUEL&&window.CGU_ACTUEL.V===v){const T=window.CGU_ACTUEL.T.fr;t={titre:T.titre,corps:T.corps,ok:T.ok}}
  return TXT[v]=t||null}
async function voir(id){const s=(SIG||[]).find(x=>String(x.id)===String(id));if(!s)return;const t=await texte(s.version);
  const doc='<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Conditions signées — '+E(s.nom||'')+'</title><style>'+
   'body{font:11pt/1.55 Georgia,"Times New Roman",serif;color:#3b2a24;max-width:720px;margin:0 auto;padding:96px 28px 40px}h1{font-size:18pt;margin:0 0 4px;color:#a0614a}h2{font-size:11.5pt;margin:16px 0 4px;color:#7a4a3a}p{margin:0 0 6px}'+
   '.ent{display:flex;align-items:center;gap:12px;border-bottom:2px solid #e8c9bb;padding-bottom:10px;margin-bottom:14px}.ent img{width:54px;height:54px}.sig{margin-top:22px;border:1.5px solid #e8c9bb;border-radius:12px;padding:14px 16px;background:#fdf7f3;break-inside:avoid}.sig b{font-size:13pt}.pet{font-size:9pt;color:#7d6a62}'+
   '.barre-imp{position:fixed;top:0;left:0;right:0;z-index:99;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:calc(10px + env(safe-area-inset-top,0px)) 12px 10px;background:rgba(255,255,255,.97);box-shadow:0 2px 14px rgba(0,0,0,.12)}.barre-imp button{font:700 15px/1 system-ui,sans-serif;border-radius:50px;padding:13px 22px;border:2px solid #a0614a;cursor:pointer}.barre-imp .p{background:#a0614a;color:#fff}.barre-imp .f{background:#fff;color:#a0614a}'+
   '@media(max-width:560px){body{padding-top:170px}}@media print{.barre-imp{display:none!important}body{padding-top:0}}</style></head><body>'+
   '<div class="barre-imp"><button class="f" onclick="try{close()}catch(e){};setTimeout(function(){if(!window.closed)history.length>1?history.back():location.href=RETOUR},300)">← Retour à l\'appli</button><button class="p" onclick="window.print()">🖨 Imprimer ou enregistrer en PDF</button></div>'+
   '<div class="ent"><img src="'+E(new URL('img/logo-icone.png',location.href).href)+'" alt=""><div><h1>'+E((t&&t.titre)||'Conditions d\'utilisation et confidentialité')+'</h1><div class="pet">Sérénaissance · Académie Sérénaissance · version du '+E(s.version||'?')+'</div></div></div>'+
   (t?(t.corps||[]).map(c=>'<h2>'+E(c[0])+'</h2><p>'+E(c[1])+'</p>').join(''):'<p><i>Le texte de cette version n\'a pas été retrouvé.</i></p>')+
   '<div class="sig"><p>☑ '+E((t&&t.ok)||'J\'ai lu et j\'accepte les conditions d\'utilisation et la politique de confidentialité.')+'</p>'+
   '<p>Signature (nom tapé) : <b>'+E(s.nom||'')+'</b></p><p>Courriel du compte : '+E(s.courriel||'')+'</p><p>Espace : '+E(qui(s))+((s.nom_doula||s.nom_parent)?' · nom au dossier : '+E(s.nom_doula||s.nom_parent):'')+'</p>'+
   '<p>Date et heure : '+E(dateL(s.signe_le))+'</p><p class="pet">Acceptation électronique enregistrée dans l\'appli Sérénaissance au moment de la création ou de la mise à jour du compte.</p></div>'+
   '<script>var RETOUR='+JSON.stringify(location.href.split('#')[0])+'<\/script></body></html>';
  const w=window.open('','_blank');if(w){w.document.open();w.document.write(doc);w.document.close()}
  else{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([doc],{type:'text/html'}));a.download='conditions-'+String(s.nom||'signees').replace(/\W+/g,'-')+'.html';a.click()}}

DSUB.cguSignes=function(){if(!MOI||!MOI.admin)return '<p class="small">Réservé à la propriétaire de l\'appli.</p>';
  setTimeout(charger,0);
  return sh('Conditions signées','Les conditions d\'utilisation acceptées et signées par les doulas et les parents, avec le texte exact de chaque version.')+
    '<input id="cguQ" type="search" placeholder="Chercher un nom ou un courriel…" autocomplete="off" style="border-radius:20px;margin-bottom:8px">'+
    '<div class="card" id="cguListe"><p class="small muted">Chargement…</p></div>'};
/* Une page qui regroupe les documents signés et tous les avis */
DSUB.signesAvis=function(){if(!MOI||!MOI.admin)return '<p class="small">Réservé à la propriétaire de l\'appli.</p>';
  const t=(v,i,b,s)=>'<button class="tile" data-act="dsub" data-v="'+v+'"><span class="ti">'+icon(i)+'</span><b>'+b+'</b><span>'+s+'</span></button>';
  return sh('Documents signés et avis','Tout ce que les doulas et les parents ont signé ou nous ont dit.')+
    '<div class="tiles">'+t('cguSignes','fa-file-signature','Conditions signées','Doulas et parents, avec la date')+t('avisTab','fa-star','Avis des doulas','Questionnaire de satisfaction')+t('avisFam','fa-heart','Avis des mamans','Questionnaire de satisfaction')+t('avisEtoiles','fa-star-half-stroke','Avis sur l\'appli','Étoiles et commentaires')+'</div>'};
DSUB.avisEtoiles=function(){if(!MOI||!MOI.admin)return '<p class="small">Réservé à la propriétaire de l\'appli.</p>';
  setTimeout(async()=>{const el=document.getElementById('aeListe');if(!el)return;
    const {data,error}=await sb.from('fam_avis_appli').select('*').order('created_at',{ascending:false});
    if(error){el.innerHTML='<p class="small muted">Impossible de lire les avis : '+E(error.message)+'</p>';return}
    const R=(data||[]).filter(x=>x.etoiles),ref=(data||[]).filter(x=>x.refuse).length;
    if(!R.length){el.innerHTML='<p class="small muted">Aucun avis pour l\'instant. La demande s\'affiche aux doulas et aux parents à leur prochaine ouverture de l\'appli.'+(ref?' ('+ref+' ne veulent pas être sollicités.)':'')+'</p>';return}
    const moy=L=>L.length?(L.reduce((a,b)=>a+b.etoiles,0)/L.length):0,et=n=>'<span style="color:#e0a43c;letter-spacing:1px">'+'★'.repeat(n)+'<span style="color:#e3d6cf">'+'★'.repeat(5-n)+'</span></span>';
    const D=R.filter(x=>x.espace==='doula'),P=R.filter(x=>x.espace==='parent');
    const barre=k=>{const c=R.filter(x=>x.etoiles===k).length;return '<div class="row" style="gap:8px;align-items:center;margin:3px 0"><span class="xs" style="width:28px">'+k+' ★</span><div style="flex:1;height:8px;border-radius:8px;background:var(--soft2)"><div style="height:8px;border-radius:8px;background:#e0a43c;width:'+Math.round(100*c/R.length)+'%"></div></div><b class="xs" style="width:20px;text-align:right">'+c+'</b></div>'};
    el.innerHTML='<div class="grid3"><div class="stat acc"><b>'+moy(R).toFixed(1)+'</b><span>sur 5 · '+R.length+' avis</span></div><div class="stat"><b>'+(D.length?moy(D).toFixed(1):'–')+'</b><span>doulas ('+D.length+')</span></div><div class="stat"><b>'+(P.length?moy(P).toFixed(1):'–')+'</b><span>parents ('+P.length+')</span></div></div>'+
      '<div class="card">'+[5,4,3,2,1].map(barre).join('')+'</div>'+
      '<div class="card">'+R.map(x=>'<div class="cl dh-row" style="align-items:flex-start;display:block"><div class="row between"><b>'+E(x.nom||x.courriel||'Anonyme')+'</b><span class="xs muted">'+E(x.espace==='doula'?'Doula':'Parent')+' · '+E(fmtS(new Date(x.created_at)))+'</span></div><div>'+et(x.etoiles)+'</div>'+(x.commentaire?'<p class="small" style="margin:4px 0 0">« '+E(x.commentaire)+' »</p>':'')+'</div>').join('')+'</div>'+
      (ref?'<p class="xs muted">'+ref+' personne'+(ref>1?'s ont':' a')+' choisi « Ne plus me demander ».</p>':'')},0);
  return sh('Avis sur l\'appli','Les étoiles et commentaires des doulas et des parents.')+'<div id="aeListe"><p class="small muted">Chargement…</p></div>'};
const _dO=dOutils;dOutils=function(){if(MOI&&MOI.admin){if(!DOUT.find(x=>x[0]==='signesAvis'))DOUT.splice(1,0,['signesAvis','fa-file-signature','Documents signés et avis (propriétaire)','Conditions acceptées, avis des doulas et des mamans']);
  if(!DOUT.find(x=>x[0]==='cguSignes'))DOUT.splice(2,0,['cguSignes','fa-signature','Conditions signées (propriétaire)','Qui a accepté, quand, quelle version'])}return _dO()};
/* raccourci en haut de l'Espace propriétaire */
const _pp=DSUB.proprio;if(_pp)DSUB.proprio=function(){const h=_pp();if(!MOI||!MOI.admin)return h;
  return h.replace('<div class="card" id="boiteSup">','<div class="card"><span class="eyebrow acc">Documents signés et avis</span><div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px"><button class="btn sm" data-act="dsub" data-v="cguSignes">'+icon('fa-file-signature')+'Conditions signées</button><button class="btn sm ghost" data-act="dsub" data-v="avisTab">'+icon('fa-star')+'Avis des doulas</button><button class="btn sm ghost" data-act="dsub" data-v="avisFam">'+icon('fa-heart')+'Avis des mamans</button><button class="btn sm ghost" data-act="dsub" data-v="avisEtoiles">'+icon('fa-star-half-stroke')+'Avis sur l\'appli</button></div></div><div class="card" id="boiteSup">')};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='cguFiltre'){FILTRE=b.dataset.v;afficher()}else if(a==='cguVoir'){voir(b.dataset.id)}});
document.addEventListener('input',e=>{if(e.target.id==='cguQ')afficher()});
})();
