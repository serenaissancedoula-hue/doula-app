/* Sérénaissance — annuaire « Trouver ma doula » : les familles créent un compte, cherchent une doula près d'elles et lui écrivent;
   la doula choisit d'être listée (profil public optionnel), reçoit les demandes dans l'appli et peut inviter la famille en un geste. */
(function(){
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
const A={liste:null,q:'',dem:[],charge:false};
const STAT={nouvelle:['Envoyée','line'],vue:['Vue','line'],acceptee:['Acceptée','acc'],declinee:['Non disponible','line']};
let DEMANDES=[];

const TOUTES_C=window.VILLES_CA||[];const TOUTES=TOUTES_C.map(x=>x[0]);
const coord=n=>{const q=norm(n);if(!q)return null;const t=TOUTES_C.find(x=>norm(x[0])===q)||TOUTES_C.find(x=>norm(x[3])===q);return t?{lat:t[1],lng:t[2],nom:t[0]}:null};
const dist=(a,b)=>{const R=6371,r=x=>x*Math.PI/180,dl=r(b.lat-a.lat),dn=r(b.lng-a.lng),h=Math.sin(dl/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))};
const LIEN_ANNUAIRE='https://buy.stripe.com/14AaEQg9Wfby1G40V4ffy0s';
const SERV=[['naissance','Accompagnement à la naissance'],['prenatal','Préparation prénatale'],['postnatal','Post-partum'],['allaitement','Allaitement'],['deuil','Deuil périnatal'],['fertilite','Fertilité']];
const servDe=d=>String(d.services||'').split(',').map(x=>x.trim()).filter(Boolean);
const FAV_K='sere-doulas-fav';
const favs=()=>{try{if(window.ESPACE==='parent'&&S.parent&&S.role==='parent')return S.parent.favDoulas||(S.parent.favDoulas=[]);return JSON.parse(localStorage.getItem(FAV_K)||'[]')}catch(e){return []}};
const favSet=L=>{try{if(window.ESPACE==='parent'&&S.parent&&S.role==='parent'){S.parent.favDoulas=L;if(typeof saveParent==='function')saveParent();else save()}else localStorage.setItem(FAV_K,JSON.stringify(L))}catch(e){}};
const VUS=new Set();function compterVues(ids,type){ids=ids.filter(i=>!VUS.has(type+i));if(!ids.length)return;ids.forEach(i=>VUS.add(type+i));try{Promise.resolve(sb.rpc('fam_annuaire_vue',{p_doulas:ids,p_type:type})).then(()=>{},()=>{})}catch(e){}}
const etoiles=d=>d.avis_n?'<span class="an-et">★ '+String(d.avis_moy||'').replace('.',',')+' <small>('+d.avis_n+' avis)</small></span>':'';
const CHAMPS=['entreprise','photo','region','zones','bio','langues','certification','ville_base','rayon_km','lat','lng','site_web','dispo_mois','services','prix_min'];
const brouillon=()=>{const D=ME_DOULA||{};return Object.assign({},{entreprise:D.entreprise,photo:D.photo,region:D.region},D.annuaire_pub||{},D.annuaire_brouillon||{})};
const exemptee=()=>!!((typeof MOI!=='undefined'&&MOI&&MOI.admin)||(ME_DOULA&&ME_DOULA.acces_gratuit));
const payeJusque=()=>ME_DOULA&&ME_DOULA.annuaire_fin?new Date(ME_DOULA.annuaire_fin):null;
const payee=()=>exemptee()||(payeJusque()&&payeJusque()>new Date());
const fr=d=>new Date(d).toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'});
let PEND=[],TOUS=[];
let SEL=null;const selInit=()=>{if(SEL===null)SEL=String(brouillon().zones||'').split(',').map(x=>x.trim()).filter(Boolean)};
function villesHtml(){selInit();
  const chip=v=>'<button type="button" class="pill acc" style="cursor:pointer;border:0;font:inherit" data-act="anVille" data-v="'+esc(v)+'">'+esc(v)+' '+icon('fa-xmark')+'</button>';
  return (SEL.length?'<div class="row" style="gap:6px;flex-wrap:wrap">'+SEL.map(chip).join('')+'</div>':'<p class="xs muted" style="margin:0">Aucune ville ajoutée.</p>')
   +'<div class="row" style="gap:8px;margin-top:8px"><input type="text" id="pfAutre" list="pfVillesDL" placeholder="Tapez une ville…" style="flex:1"><button type="button" class="btn sm ghost" data-act="anAjoutVille">Ajouter</button></div>'}
/* ---------- carte publique d'une doula (même rendu pour les familles et l'aperçu de la doula) ---------- */
const MOIS=['janv.','févr.','mars','avril','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const moisLib=k=>{const [y,m]=k.split('-');return MOIS[+m-1]+' '+y};
const moisProchains=()=>{const L=[],d=new Date();d.setDate(1);for(let i=0;i<12;i++){L.push(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'));d.setMonth(d.getMonth()+1)}return L};
const moisDe=d=>{const cur=moisProchains()[0];return String(d.dispo_mois||'').split(',').filter(k=>/^\d{4}-\d{2}$/.test(k)&&k>=cur).sort()};
const siteUrl=u=>{u=String(u||'').trim();if(!u)return '';if(!/^https?:\/\//i.test(u))u='https://'+u;return /^https?:\/\/[^\s<>"']+$/i.test(u)?u:''};
const court=(t,n)=>{t=String(t||'').replace(/\s+/g,' ').trim();if(t.length<=n)return t;return t.slice(0,n).replace(/\s+\S*$/,'')+'…'};
function enTete(d){
  const nom=esc((d.prenom||'')+(d.nom_initiale?' '+d.nom_initiale+'.':''));
  const ph=d.photo?'<img src="'+esc(d.photo)+'" alt="" style="width:64px;height:64px;border-radius:50%;object-fit:cover;flex:none">':'<span class="ic" style="width:64px;height:64px;border-radius:50%;flex:none;display:grid;place-items:center">'+icon('fa-user')+'</span>';
  const lieu=d.ville_base?d.ville_base+(d.rayon_km?' · jusqu\'à '+d.rayon_km+' km':''):d.region;
  const fv=d.id&&favs().includes(d.id);
  return '<div class="row" style="gap:14px;align-items:center">'+ph+'<div style="min-width:0;flex:1"><b style="font-size:17px">'+nom+'</b>'+(d.id&&d.prenom&&A.liste&&A.liste.some(x=>x.id===d.id)?'<button class="an-fav'+(fv?' on':'')+'" data-an-fav="'+esc(d.id)+'" aria-label="'+(fv?'Retirer de mes favorites':'Ajouter à mes favorites')+'">'+(fv?'♥':'♡')+'</button>':'')+(d.avis_n?'<div class="small">'+etoiles(d)+'</div>':'')+(d.entreprise?'<div class="small muted">'+esc(d.entreprise)+'</div>':'')+(lieu?'<div class="small" style="margin-top:2px">'+icon('fa-location-dot')+' '+esc(lieu)+'</div>':'')+(d._km!=null&&d._km>0?'<div class="xs muted">À environ '+d._km+' km de vous</div>':'')+'</div></div>'}
const moisCible=()=>{try{if(window.ESPACE!=='parent'||!S.parent)return '';const st=stage();if(st.k!=='preg'||!st.g||!st.g.dpa)return '';const x=new Date(st.g.dpa);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')}catch(e){return ''}};
function carte(d,bouton){
  const mo=moisDe(d),mc=moisCible(),dispo=mc&&mo.length?(mo.includes(mc)?'<div class="xs" style="margin-top:6px;color:#2f855a;font-weight:700">'+icon('fa-circle-check')+' Disponible pour votre mois prévu ('+moisLib(mc)+')</div>':'<div class="xs muted" style="margin-top:6px">'+icon('fa-circle-info')+' Pas de place indiquée pour '+moisLib(mc)+' : écrivez-lui quand même, ça peut changer.</div>'):'';
  return '<div class="card">'+enTete(d)
    +(servDe(d).length?'<div class="an-serv">'+servDe(d).map(k=>'<span class="pill line">'+esc((SERV.find(x=>x[0]===k)||[0,k])[1])+'</span>').join('')+'</div>':'')
    +(d.prix_min?'<div class="xs" style="margin-top:6px">'+icon('fa-tag')+' Forfaits à partir de <b>'+(+d.prix_min).toLocaleString('fr-CA')+' $</b></div>':'')
    +(d.bio?'<p class="small" style="margin:10px 0 0">'+esc(court(d.bio,150))+'</p>':'')
    +dispo+(mo.length?'<div class="xs" style="margin-top:8px">'+icon('fa-calendar-check')+' <b>Places pour des naissances :</b> '+esc(mo.slice(0,4).map(moisLib).join(' · '))+(mo.length>4?' …':'')+'</div>':'')
    +(bouton?'<div class="row" style="gap:8px;margin-top:12px"><button class="btn sm ghost" style="flex:1" data-act="anPlus" data-id="'+esc(d.id)+'">En savoir plus</button><button class="btn sm" style="flex:1" data-act="anEcrire" data-id="'+esc(d.id)+'">'+icon('fa-calendar-plus')+'Prendre rendez-vous</button></div>':'')+'</div>'}
function ficheSheet(id){const d=(A.liste||[]).find(x=>x.id===id);if(!d)return;compterVues([id],'fiche');const mo=moisDe(d),site=siteUrl(d.site_web);
  const lignes=[d.zones?['fa-map-location-dot','Autres villes',d.zones]:null,d.langues?['fa-language','Langues',d.langues]:null,d.certification?['fa-award','Formation',d.certification]:null,servDe(d).length?['fa-hand-holding-heart','Services',servDe(d).map(k=>(SERV.find(x=>x[0]===k)||[0,k])[1]).join(', ')]:null,d.prix_min?['fa-tag','Forfaits','À partir de '+(+d.prix_min).toLocaleString('fr-CA')+' $']:null].filter(Boolean);
  sheet(esc((d.prenom||'')+(d.nom_initiale?' '+d.nom_initiale+'.':'')),enTete(d)
   +(d.bio?'<p class="small" style="white-space:pre-line;margin:14px 0 0">'+esc(d.bio)+'</p>':'')
   +(lignes.length?'<div class="list" style="margin-top:12px">'+lignes.map(l=>'<div class="li"><div class="ic">'+icon(l[0])+'</div><div class="tx"><b>'+l[1]+'</b><span>'+esc(l[2])+'</span></div></div>').join('')+'</div>':'')
   +(mo.length?'<div class="card tint" style="margin-top:12px"><b>'+icon('fa-calendar-check')+' Disponibilités pour l\'accouchement</b><div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px">'+mo.map(k=>'<span class="pill acc">'+esc(moisLib(k))+'</span>').join('')+'</div><p class="xs muted" style="margin:8px 0 0">Mois de date prévue pour lesquels elle prend encore des familles.</p></div>':'')
   +((d.temoignages||[]).length?'<div class="card tint" style="margin-top:12px"><b>'+icon('fa-quote-left')+' Ce que disent ses familles</b>'+d.temoignages.map(t=>'<p class="small" style="margin:8px 0 0">« '+esc(t.t)+' »<br><span class="xs muted">— '+esc(t.s)+'</span></p>').join('')+'<p class="xs muted" style="margin:8px 0 0">Témoignages de familles accompagnées dans l\'appli, publiés avec leur accord.</p></div>':'')
   +(site?'<p style="margin:12px 0 0"><a href="'+esc(site)+'" target="_blank" rel="noopener noreferrer">'+icon('fa-globe')+' Visiter son site web</a></p>':'')
   +'<button class="btn" style="margin-top:14px;width:100%" data-act="anEcrire" data-id="'+esc(id)+'">'+icon('fa-calendar-plus')+'Prendre rendez-vous</button>')}

/* ---------- côté famille ---------- */
async function chargerAnnuaire(){
  let r5=null;try{r5=await sb.rpc('fam_annuaire5',{p_q:null});if(r5&&r5.error)r5=null}catch(e){r5=null}
  const [r,m]=await Promise.all([r5?Promise.resolve(r5):sb.rpc('fam_annuaire4',{p_q:null}),sb.from('fam_demandes').select('*').order('created_at',{ascending:false}).limit(30).then(x=>x,()=>({data:[]}))]);
  A.liste=r.data||[];A.dem=(m&&m.data)||[];A.charge=true}
function filtrer(){return filtrer0().filter(d=>{const F=A.f||{};if(F.fav&&!favs().includes(d.id))return false;if(F.langue&&!norm(d.langues).includes(norm(F.langue)))return false;if((F.serv||[]).length&&!F.serv.every(k=>servDe(d).includes(k)))return false;return true})}
function filtrer0(){if(A.pos){const L=[];A.liste.forEach(d=>{if(d.lat==null)return;const x=Math.round(dist(A.pos,{lat:d.lat,lng:d.lng}));if(x<=(d.rayon_km||50))L.push(Object.assign({},d,{_km:x}))});return L.sort((a,b)=>a._km-b._km)}
  const q=norm(A.q);if(!q)return A.liste;const c=coord(A.q);
  if(c){const L=[];A.liste.forEach(d=>{let k=null;if(d.lat!=null&&d.rayon_km){const x=dist(c,{lat:d.lat,lng:d.lng});if(x<=d.rayon_km)k=Math.round(x)}
    const inZ=norm(d.zones).split(',').some(z=>z.trim()===norm(c.nom)||z.trim()===norm(c.nom.replace(/ \(\w+\)$/,'')));if(k!==null||inZ){L.push(Object.assign({},d,{_km:k===null?0:k}))}});return L.sort((a,b)=>a._km-b._km)}
  return A.liste.filter(d=>norm([d.region,d.zones,d.ville_base,d.prenom,d.entreprise].join(' ')).includes(q))}
function filtresHtml(){const F=A.f=A.f||{serv:[]},nf=favs().length;
  return '<div class="an-filt"><button type="button" class="chip'+(A.pos?' on':'')+'" data-an-pres="1">'+icon('fa-location-crosshairs')+(A.pos?'Près de moi ✓':'Près de moi')+'</button>'+(nf?'<button type="button" class="chip'+(F.fav?' on':'')+'" data-an-ff="fav">♥ Mes favorites ('+nf+')</button>':'')+['Français','Anglais'].map(l=>'<button type="button" class="chip'+(F.langue===l?' on':'')+'" data-an-fl="'+l+'">'+l+'</button>').join('')+SERV.map(([k,t])=>'<button type="button" class="chip'+((F.serv||[]).includes(k)?' on':'')+'" data-an-fs="'+k+'">'+t+'</button>').join('')+'</div>'}
function listeHtml(){const mc=moisCible();let L=filtrer();setTimeout(()=>compterVues(L.map(d=>d.id),'vue'),0);if(mc&&L)L=L.slice().sort((a,b)=>(moisDe(b).includes(mc)?1:0)-(moisDe(a).includes(mc)?1:0));
  if(!L.length)return filtresHtml()+'<div class="card tint"><p class="small" style="margin:0">'+((A.f&&(A.f.fav||A.f.langue||(A.f.serv||[]).length))?'Aucune doula ne correspond à ces filtres. Retirez-en un pour voir plus de doulas.':A.pos?'Aucune doula ne se déplace jusqu\'à votre position pour le moment. Essayez avec le nom d\'une ville voisine.':A.q?'Aucune doula inscrite dans ce secteur pour le moment. Essayez une ville voisine ou votre région.':'Aucune doula n\'est encore inscrite dans l\'annuaire. Revenez bientôt !')+'</p></div>';
  return filtresHtml()+'<p class="xs muted">'+L.length+' doula'+(L.length>1?'s':'')+(A.q?' pour « '+esc(A.q)+' »':'')+'</p>'+L.map(d=>carte(d,true)).join('')}
function demandesHtml(){if(!A.dem.length)return '';
  return '<div class="card"><span class="eyebrow acc">Mes demandes</span><div class="list">'+A.dem.map(x=>{const s=STAT[x.statut]||STAT.nouvelle;return '<div class="li"><div class="ic">'+icon(x.statut==='acceptee'?'fa-circle-check':'fa-paper-plane')+'</div><div class="tx"><b>'+esc(x.doula_nom||'Une doula')+'</b><span>'+new Date(x.created_at).toLocaleDateString('fr-CA',{day:'numeric',month:'short'})+(x.statut==='acceptee'?' · surveillez vos courriels : une invitation arrive':'')+'</span></div><span class="pill '+s[1]+'">'+s[0]+'</span></div>'}).join('')+'</div></div>'}
window.ecranChercheuse=(...a)=>ecranChercheuse(...a);
/* l'annuaire DANS l'appli de la famille (onglet « Doulas ») : on garde les onglets, pas besoin de quitter son espace */
window.anDansApp=function(){if(!A.charge){if(!A.enCours){A.enCours=true;chargerAnnuaire().catch(()=>{A.liste=[];A.dem=[];A.charge=true}).then(()=>{A.enCours=false;if(S.tab==='madoula'&&!S.vue)render()})}return '<p class="small muted" style="text-align:center;padding:20px">Chargement des doulas…</p>'}
  return '<div class="card an-app"><span class="eyebrow acc">Trouver ma doula</span><p class="small" style="margin:4px 0 8px">Cherchez une doula près de chez vous, lisez sa présentation et demandez une rencontre. Elle vous répond, puis vous ajoute : tout ce que vous avez noté reste.</p><form id="anFormApp" class="row" style="gap:8px"><label class="f" style="flex:1;margin:0">Ville ou région<input type="text" enterkeyhint="search" list="anVilles" id="anQApp" placeholder="Ex. Campbellton, Moncton, Gaspésie…" value="'+esc(A.q)+'"></label><button class="btn" type="submit" style="align-self:flex-end">'+icon('fa-magnifying-glass')+'Chercher</button></form><datalist id="anVilles">'+TOUTES.map(v=>'<option value="'+esc(v)+'">').join('')+'</datalist></div><div id="anListeApp" class="stack">'+listeHtml()+'</div>'+demandesHtml()};
document.addEventListener('input',e=>{if(e.target&&e.target.id==='anQApp'){A.q=e.target.value;const l=document.getElementById('anListeApp');if(l)l.innerHTML=listeHtml()}});
document.addEventListener('submit',e=>{if(e.target&&e.target.id==='anFormApp'){e.preventDefault();A.q=document.getElementById('anQApp').value;const l=document.getElementById('anListeApp');if(l)l.innerHTML=listeHtml()}});
async function ecranChercheuse(pub){
  $('#tabs').innerHTML='';$('#gear').hidden=true;
  $('#app').innerHTML='<div style="max-width:640px;margin:0 auto;width:100%" class="stack"><p class="small muted" style="text-align:center;padding:40px">Chargement…</p></div>';
  try{await chargerAnnuaire()}catch(e){A.liste=[];A.dem=[]}
  const sansMdp=!pub&&!S.mdpOk&&!(S.meta&&S.meta.mdp);
  const m=pub?{}:(S.meta||{});
  $('#app').innerHTML='<div style="max-width:640px;margin:0 auto;width:100%" class="stack"><div class="card"><div class="stack" style="gap:6px"><span class="script">'+(pub?'Sérénaissance':'Bonjour')+(m.prenom?' '+esc(m.prenom):'')+'</span><h1>Trouver ma doula</h1><p class="small">Cherchez une doula près de chez vous, lisez sa présentation et écrivez-lui directement. Elle vous répond, puis vous invite dans votre espace Famille.</p></div>'
    +'<form id="anForm" class="row" style="gap:8px;margin-top:12px"><label class="f" style="flex:1;margin:0">Ville ou région<input type="text" enterkeyhint="search" list="anVilles" id="anQ" placeholder="Ex. Campbellton, Moncton, Gaspésie…" value="'+esc(A.q)+'"></label><button class="btn" type="submit" style="align-self:flex-end">'+icon('fa-magnifying-glass')+'Chercher</button></form></div>'
    +'<datalist id="anVilles">'+TOUTES.map(v=>'<option value="'+esc(v)+'">').join('')+'</datalist><div id="anListe" class="stack">'+listeHtml()+'</div><div id="anDem">'+demandesHtml()+'</div>'
    +(pub?'<div class="card tint"><b>Vous voulez écrire à une doula ?</b><p class="small" style="margin:6px 0 10px">Créez un compte gratuit : c\'est rapide, et la doula reçoit votre message directement.</p><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="vueCx" data-v="famille">Créer mon compte</button><button class="btn sm ghost" data-act="vueCx" data-v="connexion">J\'ai déjà un compte</button></div></div>':'<p class="xs muted" style="text-align:center">Connectée avec <b>'+esc(MOI.courriel)+'</b> · <button class="btn sm ghost" data-act="anMdp">Mon mot de passe</button> <button class="btn sm ghost" data-act="deconnexion">Me déconnecter</button></p>')+'</div>'+pied();
  const f=document.getElementById('anForm');
  if(f)f.addEventListener('submit',e=>{e.preventDefault();A.q=document.getElementById('anQ').value;document.getElementById('anListe').innerHTML=listeHtml()});
  const q=document.getElementById('anQ');if(q)q.addEventListener('input',()=>{A.q=q.value;document.getElementById('anListe').innerHTML=listeHtml()});
  if(sansMdp&&typeof motDePasseSheet==='function')motDePasseSheet(true)}

const _autre=ecranAutreEspace;
ecranAutreEspace=function(estDoula){if(ESPACE==='parent'&&!estDoula){ecranChercheuse();return}_autre.apply(this,arguments)};

/* inscription d'une famille depuis l'écran de connexion */
const _cx=ecranConnexion;
ecranConnexion=function(msg){
  if(ESPACE==='parent'&&S.vueCx!=='famille'&&S.vueCx!=='annuaire'&&!S.anVu&&location.hash==='#annuaire'){S.anVu=1;S.vueCx='annuaire'}
  if(ESPACE==='parent'&&S.vueCx==='annuaire'){ecranChercheuse(true);return}
  if(ESPACE==='parent'&&S.vueCx==='famille'){
    $('#tabs').innerHTML='';$('#gear').hidden=true;
    $('#app').innerHTML='<div class="card" style="max-width:480px;margin:0 auto;width:100%"><span class="script">Bienvenue</span><h1>Créer mon compte famille</h1><p class="small">Gratuit, avec ou sans doula : suivi de grossesse semaine par semaine, journal, bilan du moral, puis l\'espace de bébé après la naissance. Et si vous voulez une doula, vous pouvez en trouver une près de chez vous.</p><div class="stack"><div class="grid2 resp"><label class="f">Prénom<input type="text" id="fPrenom" autocomplete="given-name"></label><label class="f">Nom<input type="text" id="fNom" autocomplete="family-name"></label></div><label class="f">Courriel<input type="email" id="fCourriel" autocomplete="email"></label><button class="btn" data-act="anInscrire">'+icon('fa-paper-plane')+'Recevoir mon code d\'inscription</button><button class="btn sm ghost" data-act="vueCx" data-v="connexion">'+icon('fa-arrow-left')+'J\'ai déjà un compte</button></div><p class="xs muted" style="margin-top:12px">Votre doula vous a déjà inscrite ? Utilisez plutôt le courriel d\'invitation qu\'elle vous a envoyé.</p></div>'+pied();return}
  _cx.apply(this,arguments);
  if(ESPACE!=='parent')return;
  const p=[...document.querySelectorAll('#app p.xs')].find(x=>/Pas encore de compte/.test(x.textContent));
  if(p){p.insertAdjacentHTML('afterend','<div class="card tint" style="margin:10px 0 0"><b>Pas de doula ? Vous pouvez quand même vous inscrire.</b><p class="small" style="margin:6px 0 10px">Créez un compte gratuit : suivi de grossesse et de bébé tout de suite. Si vous trouvez une doula plus tard, elle vous ajoute avec votre courriel et rien n\'est perdu.</p><div class="stack" style="gap:8px"><button class="btn" data-act="vueCx" data-v="famille">'+icon('fa-user-plus')+'Créer mon compte</button><button class="btn ghost" data-act="vueCx" data-v="annuaire">'+icon('fa-magnifying-glass')+'Voir les doulas près de chez moi</button></div></div>')}};

/* ---------- côté doula ---------- */
async function chargerDemandes(){try{const {data}=await sb.from('fam_demandes').select('*').order('created_at',{ascending:false}).limit(60);DEMANDES=data||[]}catch(e){}}
const nouvelles=()=>DEMANDES.filter(d=>d.statut==='nouvelle').length;
const _cd=chargerDoula;
chargerDoula=async function(){await _cd.apply(this,arguments);await chargerApprob();try{if(localStorage.getItem('an-vu'))ME_DOULA.annuaire_vu=true}catch(x){}await chargerDemandes()};

let MSEL=null;const moisInit=()=>{if(MSEL===null)MSEL=moisDe(brouillon())};
function moisHtml(){moisInit();return moisProchains().map(k=>'<button type="button" class="pill '+(MSEL.includes(k)?'acc':'line')+'" style="cursor:pointer;border:0;font:inherit" data-act="anMois" data-v="'+k+'">'+(MSEL.includes(k)?icon('fa-check')+' ':'')+esc(moisLib(k))+'</button>').join('')}
const AUT=[
 'J\'autorise Sérénaissance à afficher publiquement mon prénom, l\'initiale de mon nom, ma photo, ma présentation, mes villes, mon site web et mes disponibilités dans l\'annuaire « Trouver ma doula ».',
 'J\'autorise Sérénaissance à me transmettre, par courriel et dans l\'appli, le nom, le courriel et les informations que les familles inscrivent dans leur demande de rendez-vous.',
 'Je confirme que les informations et formations que j\'indique sont exactes et que j\'exerce mon rôle de doula sans poser d\'actes médicaux, en référant la famille à son équipe de soins au besoin.',
 'Je comprends que mon profil est approuvé par Sérénaissance avant d\'être affiché (24 à 48 h), que chaque modification est aussi approuvée, que l\'inscription est de 25 $ par année et que Sérénaissance peut retirer un profil non conforme.'];
const patch0=(cases,sig)=>cases.length>0&&cases.every(x=>x.checked)&&sig.trim().split(/\s+/).length>=2;
function autorisationHtml(){const a=(ME_DOULA&&brouillon().autorisation)||null;
  if(a)return '<div class="card tint" style="margin-top:12px"><b>'+icon('fa-file-signature')+' Autorisation de publication signée</b><p class="xs muted" style="margin:4px 0 0">Signée par '+esc(a.nom)+' le '+fr(a.date)+'.</p></div>';
  return '<div class="card tint" style="margin-top:12px"><b>'+icon('fa-file-signature')+' Autorisation de publication</b><p class="xs muted" style="margin:4px 0 8px">À signer une seule fois pour apparaître dans l\'annuaire.</p>'+AUT.map((t,i)=>'<label class="check"><input type="checkbox" class="pfAut"><span class="small">'+t+'</span></label>').join('')+'<label class="f" style="margin-top:8px">Signature : tapez votre nom complet<input type="text" id="pfSig" autocomplete="name" placeholder="Prénom Nom"></label></div>'}
function etatHtml(){const D=ME_DOULA||{},st=D.annuaire_statut||'aucun',paye=payee(),fin=payeJusque();
  const vis=D.annuaire&&D.accepte_nouvelles!==false&&st==='approuve'&&paye;
  const pill=vis?'<span class="pill acc">'+icon('fa-eye')+' Visible des familles</span>':'<span class="pill line">'+icon('fa-eye-slash')+' Pas visible</span>';
  const etapes=[
   [st==='approuve','Profil approuvé par Sérénaissance',st==='en_attente'?'En attente d\'approbation'+(D.annuaire_pub?' (votre version précédente reste affichée)':''):st==='refuse'?'À modifier : '+esc(D.annuaire_note||'voir le message de Sérénaissance'):D.annuaire_brouillon?'':'Remplissez le profil puis enregistrez : il sera envoyé pour approbation'],
   [paye,'Inscription annuelle',exemptee()?'Offerte':paye?'Payée jusqu\'au '+fr(fin):'25 $ par année'],
   [!!D.annuaire,'Option « Apparaître dans l\'annuaire » cochée',D.annuaire?'':'Cochez-la ci-dessous']];
  const proche=!exemptee()&&paye&&fin&&(fin-new Date())<45*864e5;
  return '<div class="card '+(vis?'':'tint')+'"><div class="row between" style="gap:8px"><b>Mon inscription</b>'+pill+'</div><div class="list" style="margin-top:8px">'+etapes.map(e=>'<div class="li"><div class="ic">'+icon(e[0]?'fa-circle-check':'fa-circle')+'</div><div class="tx"><b>'+e[1]+'</b>'+(e[2]?'<span>'+e[2]+'</span>':'')+'</div></div>').join('')+'</div>'
   +(exemptee()||(paye&&!proche)?'':'<a class="btn" style="margin-top:10px;width:100%" target="_blank" rel="noopener noreferrer" href="'+LIEN_ANNUAIRE+'?client_reference_id='+esc(D.id)+'&prefilled_email='+encodeURIComponent(D.courriel||'')+'">'+icon('fa-credit-card')+(paye?'Renouveler pour 25 $':'Payer mon inscription : 25 $ / an')+'</a><p class="xs muted" style="margin:6px 0 0">Paiement sécurisé par Stripe. Votre inscription est activée automatiquement après le paiement (rechargez l\'appli).</p>')+'</div>'}
function profilHtml(){const D0=ME_DOULA||{},D=Object.assign({},brouillon(),{id:D0.id,prenom:D0.prenom,nom:D0.nom,annuaire:D0.annuaire,accepte_nouvelles:D0.accepte_nouvelles});
  const apercu=carte({services:D.services,prix_min:D.prix_min,site_web:D.site_web,dispo_mois:D.dispo_mois,ville_base:D.ville_base,rayon_km:D.rayon_km,id:D.id,prenom:D.prenom,nom_initiale:(D.nom||'').slice(0,1),entreprise:D.entreprise,photo:D.photo,region:D.region,zones:D.zones,bio:D.bio,langues:D.langues,certification:D.certification},false);
  return sh('Mon profil dans l\'annuaire','Les familles de votre région vous trouvent et vous écrivent')+statsHtml()+etatHtml()
   +'<div class="card"><label class="check"><input type="checkbox" id="pfOn" '+(D.annuaire?'checked':'')+'><span><b>Apparaître dans l\'annuaire « Trouver ma doula »</b><br><span class="xs muted">Optionnel. Inscription annuelle de 25 $ et approbation de votre profil par Sérénaissance. Seuls votre prénom, l\'initiale de votre nom, votre photo et le texte ci-dessous sont visibles. Votre courriel et votre téléphone ne le sont jamais : c\'est vous qui décidez de répondre.</span></span></label>'
   +'<label class="check" style="margin-top:8px"><input type="checkbox" id="pfAcc" '+(D.accepte_nouvelles===false?'':'checked')+'><span>J\'accepte de nouvelles familles en ce moment</span></label>'
   +'<div class="stack" style="margin-top:12px"><label class="f">Ma région<input type="text" id="pfRegion" value="'+esc(D.region||'')+'" placeholder="Ex. Restigouche (N.-B.)"></label>'
   +'<div class="grid2 resp"><label class="f">Ma ville de départ<input type="text" id="pfBase" list="pfVillesDL" value="'+esc(D.ville_base||'')+'" placeholder="Tapez votre ville…" autocomplete="off"></label><datalist id="pfVillesDL">'+TOUTES.map(v=>'<option value="'+esc(v)+'">').join('')+'</datalist><label class="f">Je me déplace jusqu\'à<select id="pfRayon">'+[10,25,40,50,75,100,150,200].map(k=>'<option value="'+k+'"'+(+D.rayon_km===k?' selected':'')+'>'+k+' km</option>').join('')+'</select></label></div><div><span class="small"><b>Autres villes que je dessers (facultatif)</b></span><p class="xs muted" style="margin:2px 0 6px">Votre rayon couvre déjà les villes autour de votre ville de départ. Ajoutez ici une ville plus loin.</p><div id="pfVilles" class="stack" style="gap:6px;margin-top:6px">'+villesHtml()+'</div></div>'
   +'<div class="grid2 resp"><label class="f">Langues<input type="text" id="pfLangues" value="'+esc(D.langues||'')+'" placeholder="Français, anglais"></label><label class="f">Formation / certification<input type="text" id="pfCert" value="'+esc(D.certification||'')+'" placeholder="Ex. Académie Sérénaissance"></label></div>'
   +'<div><span class="small"><b>Mes services</b></span><div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px">'+SERV.map(([k,t])=>'<label class="check" style="margin:0"><input type="checkbox" class="pfServ" value="'+k+'" '+(servDe(D).includes(k)?'checked':'')+'><span class="small">'+t+'</span></label>').join('')+'</div></div>'
   +'<label class="f">Mes forfaits à partir de ($, facultatif)<input type="number" id="pfPrix" inputmode="numeric" min="0" value="'+esc(D.prix_min||'')+'" placeholder="Ex. 650"></label>'
   +'<label class="f">Mon site web<input type="text" id="pfSite" value="'+esc(D.site_web||'')+'" placeholder="academiesere.ca"></label><div><span class="small"><b>Mes disponibilités pour accoucher</b></span><p class="xs muted" style="margin:2px 0 6px">Touchez les mois de date prévue pour lesquels vous prenez encore des familles.</p><div id="pfMois" class="row" style="gap:6px;flex-wrap:wrap">'+moisHtml()+'</div></div><label class="f">Ma présentation (jusqu\'à 2000 caractères)<textarea id="pfBio" rows="12" maxlength="2000" placeholder="Qui êtes-vous ? Comment accompagnez-vous les familles ?">'+esc(D.bio||'')+'</textarea></label>'
   +'<p class="xs muted">Ajoutez une belle photo de vous dans Paramètres : elle s\'affiche ici.</p>'
   +autorisationHtml()
   +'<button class="btn" data-act="anSauverProfil">'+icon('fa-check')+'Enregistrer mon profil</button></div></div>'
   +'<div class="eyebrow acc" style="margin:14px 0 6px">Ce que les familles verront</div>'+apercu+'<p class="xs muted">Vous pouvez modifier votre profil en tout temps. Chaque modification est approuvée par Sérénaissance avant d\'être affichée.</p>'}

let STATS=null;function statsHtml(){if(STATS===null){STATS=false;try{Promise.resolve(sb.rpc('fam_annuaire_stats')).then(r=>{STATS=(r&&r.data&&typeof r.data==='object')?r.data:{};if(S.dsub==='annuaire'||S.dsub==='demandes')render()},()=>{STATS={}})}catch(e){STATS={}}}const t=STATS||{};if(!STATS||t.vues==null)return '';
  return '<div class="card"><span class="eyebrow acc">Mon profil · 30 derniers jours</span><div class="jb-stats" style="margin-top:6px"><div class="jb-stat"><b>'+(t.vues30||0)+'</b><span>fois dans les résultats</span></div><div class="jb-stat"><b>'+(t.fiches30||0)+'</b><span>ont ouvert ma fiche</span></div><div class="jb-stat"><b>'+(t.demandes30||0)+'</b><span>m\'ont écrit</span></div></div><p class="xs muted" style="margin:6px 0 0">Depuis le début : '+(t.vues||0)+' affichages, '+(t.fiches||0)+' fiches ouvertes, '+(t.demandes||0)+' demandes.</p></div>'}
const REP_MODELE=(d)=>'Bonjour '+String(d.nom||'').split(' ')[0]+',\n\nMerci pour votre message ! Je serais heureuse de vous rencontrer pour une rencontre de connaissance, sans engagement.\n\nVoici mes disponibilités :\n• \n• \n\nDites-moi ce qui vous convient le mieux.\n\nAu plaisir,\n'+((ME_DOULA&&ME_DOULA.prenom)||'');
function repondreSheet(id){const d=DEMANDES.find(x=>x.id===id);if(!d)return;sheet('Répondre à '+esc(d.nom),'<label class="f">Mon message<textarea id="anRep" style="min-height:220px">'+esc(REP_MODELE(d))+'</textarea></label><div class="stack" style="gap:8px"><button class="btn" data-an-mail="'+esc(id)+'">'+icon('fa-envelope')+'Ouvrir dans mon courriel</button><button class="btn ghost" data-an-copie="1">'+icon('fa-copy')+'Copier le message</button>'+(d.telephone?'<a class="btn ghost" href="sms:'+esc(String(d.telephone).replace(/[^\d+]/g,''))+'">'+icon('fa-comment-sms')+'Lui écrire un texto</a>':'')+'</div><p class="xs muted">Ajoutez vos disponibilités avant d\'envoyer.</p>')}
function demandesPage(){
  const dejaClient=c=>(S.clients||[]).some(x=>String(x.courriel||'').toLowerCase()===String(c||'').toLowerCase());
  const on=!!(ME_DOULA&&ME_DOULA.annuaire);
  const h=sh('Demandes de familles','Des familles de l\'annuaire souhaitent vous rencontrer')+'<div class="card '+(on?'':'tint')+'"><div class="row between" style="gap:10px"><span><b>'+icon(on?'fa-eye':'fa-eye-slash')+' '+(on?'Vous êtes visible dans l\'annuaire':'Vous n\'êtes pas dans l\'annuaire')+'</b><br><span class="xs muted">'+(on?'Les familles peuvent vous trouver et vous écrire.':'Personne ne peut vous trouver. Vous choisissez.')+'</span></span><button class="btn sm '+(on?'ghost':'')+'" data-act="anBascule">'+(on?'Me retirer':'Activer')+'</button></div><button class="btn sm ghost" style="margin-top:8px" data-act="dgo" data-v="outils|annuaire">Modifier mon profil public</button></div>';
  if(!DEMANDES.length)return h+statsHtml()+'<div class="card tint"><p class="small" style="margin:0">Aucune demande pour l\'instant. Activez votre profil dans « Mon profil dans l\'annuaire » pour être trouvée par les familles.</p></div>';
  return h+statsHtml()+DEMANDES.map(d=>{const s=STAT[d.statut]||STAT.nouvelle,cree=dejaClient(d.courriel);
    return '<div class="card"><div class="row between" style="gap:8px"><b>'+esc(d.nom)+'</b><span class="pill '+(d.statut==='nouvelle'?'acc':s[1])+'">'+(d.statut==='nouvelle'?'Nouvelle':s[0])+'</span></div>'
    +'<div class="small muted">'+new Date(d.created_at).toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'})+(d.ville?' · '+esc(d.ville):'')+(d.dpa?' · DPA '+esc(d.dpa):'')+'</div>'
    +(d.message?'<p class="small" style="white-space:pre-line;margin:10px 0 0">'+esc(d.message)+'</p>':'')
    +'<div class="small" style="margin-top:10px">'+icon('fa-envelope')+' '+esc(d.courriel)+(d.telephone?' · '+icon('fa-phone')+' '+esc(d.telephone):'')+'</div>'
    +'<div class="row" style="gap:8px;flex-wrap:wrap;margin-top:12px">'
    +(d.statut==='declinee'||cree?'':'<button class="btn sm" data-act="anAccepter" data-id="'+esc(d.id)+'">'+icon('fa-user-plus')+(d.statut==='acceptee'?'Créer le dossier':'Accepter et inviter')+'</button>')
    +(d.statut!=='declinee'?'<button class="btn sm ghost" data-an-rep="'+esc(d.id)+'">'+icon('fa-reply')+'Répondre</button>':'')
    +(d.statut==='nouvelle'||d.statut==='vue'?'<button class="btn sm ghost" data-act="anDecliner" data-id="'+esc(d.id)+'">Décliner</button>':'')
    +(cree?'<span class="pill acc">'+icon('fa-check')+' Dans vos familles</span>':'')+'</div></div>'}).join('')}

async function chargerApprob(){try{if(!(MOI&&MOI.admin))return;const {data}=await sb.from('fam_doulas').select('id,prenom,nom,courriel,photo,entreprise,annuaire,annuaire_brouillon,annuaire_pub,annuaire_statut,annuaire_note,annuaire_fin,acces_gratuit').in('annuaire_statut',['en_attente','approuve','refuse']).order('created_at');TOUS=data||[];PEND=TOUS.filter(d=>d.annuaire_statut==='en_attente')}catch(e){}}
function approbationsPage(){const lig=d=>{const c=Object.assign({},d.annuaire_brouillon||{},{id:d.id,prenom:d.prenom,nom_initiale:(d.nom||'').slice(0,1)});return c};
  const att=PEND.map(d=>'<div class="stack" style="gap:6px">'+carte(lig(d),false)+'<div class="card tint"><p class="xs muted" style="margin:0 0 8px">'+esc(d.courriel)+(d.annuaire_brouillon&&d.annuaire_brouillon.autorisation?' · autorisation signée par '+esc(d.annuaire_brouillon.autorisation.nom)+' le '+fr(d.annuaire_brouillon.autorisation.date):' · SANS autorisation signée')+(d.annuaire_pub?' · modification d\'un profil déjà approuvé':' · première demande')+'</p>'+(d.annuaire_brouillon&&d.annuaire_brouillon.bio?'<details class="acc"><summary>Voir toute la présentation<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body"><p class="small" style="white-space:pre-line">'+esc(d.annuaire_brouillon.bio)+'</p><p class="xs muted">'+[d.annuaire_brouillon.zones&&'Villes : '+d.annuaire_brouillon.zones,d.annuaire_brouillon.site_web&&'Site : '+d.annuaire_brouillon.site_web].filter(Boolean).map(esc).join('<br>')+'</p></div></details>':'')+'<input type="text" id="apNote'+esc(d.id)+'" placeholder="Raison (seulement si vous refusez)" style="width:100%;margin:8px 0"><div class="row" style="gap:8px"><button class="btn sm" data-act="anOk" data-id="'+esc(d.id)+'">'+icon('fa-check')+'Approuver</button><button class="btn sm ghost" data-act="anNon" data-id="'+esc(d.id)+'">Refuser</button></div></div></div>').join('');
  const ok=TOUS.filter(d=>d.annuaire_statut==='approuve');
  return sh('Approbations de l\'annuaire','Les profils de doulas à valider avant d\'être affichés')
   +(att||'<div class="card tint"><p class="small" style="margin:0">Aucun profil en attente.</p></div>')
   +(ok.length?'<div class="card"><span class="eyebrow acc">Profils approuvés</span><div class="list">'+ok.map(d=>'<div class="li"><div class="tx"><b>'+esc((d.prenom||'')+' '+(d.nom||''))+'</b><span>'+(d.acces_gratuit||String(d.courriel).toLowerCase()==='sc@academiesere.ca'?'Inscription offerte':d.annuaire_fin&&new Date(d.annuaire_fin)>new Date()?'Payé jusqu\'au '+fr(d.annuaire_fin):'Inscription non payée : non visible')+(d.annuaire?'':' · désactivé par la doula')+'</span></div></div>').join('')+'</div></div>':'')}
DSUB.annuaire=profilHtml;DSUB.demandes=demandesPage;DSUB.approbations=approbationsPage;
if(typeof DOUT!=='undefined'){DOUT.push(['approbations','fa-user-check','Approbations de l\'annuaire','Profils de doulas à valider']);DOUT.unshift(['demandes','fa-inbox','Demandes de familles','Familles qui souhaitent vous rencontrer'],['annuaire','fa-location-dot','Mon profil dans l\'annuaire','Soyez trouvée par les familles près de vous'])}

const _dOA=dOutils;dOutils=function(){if(!S.dsub&&!(MOI&&MOI.admin)){const k=DOUT.findIndex(x=>x[0]==='approbations');if(k>=0)DOUT.splice(k,1)}return _dOA.apply(this,arguments)};
const _da=dAccueil;
dAccueil=function(){let h=_da.apply(this,arguments);const n=nouvelles();
  if(MOI&&MOI.admin&&PEND.length)h='<button class="card tint" data-act="dgo" data-v="outils|approbations" style="width:100%;text-align:left;cursor:pointer;border:0;color:inherit;font:inherit"><div class="row between"><span><b>'+icon('fa-user-check')+' '+PEND.length+' profil'+(PEND.length>1?'s':'')+' d\'annuaire à approuver</b></span>'+icon('fa-chevron-right')+'</div></button>'+h;
  if(ME_DOULA&&!ME_DOULA.annuaire&&!ME_DOULA.annuaire_vu)h='<div class="card tint"><b>'+icon('fa-location-dot')+' Être trouvée par des familles ?</b><p class="small" style="margin:6px 0 10px">Facultatif : activez votre profil dans l\'annuaire « Trouver ma doula ». Vous pouvez le retirer à tout moment.</p><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="dgo" data-v="outils|annuaire">Configurer mon profil</button><button class="btn sm ghost" data-act="anPlusTard">Non merci</button></div></div>'+h;
  if(n)h='<button class="card tint" data-act="dgo" data-v="outils|demandes" style="width:100%;text-align:left;cursor:pointer;border:0;color:inherit;font:inherit"><div class="row between"><span><b>'+icon('fa-inbox')+' '+n+' nouvelle'+(n>1?'s':'')+' demande'+(n>1?'s':'')+' de famille</b><br><span class="small">Touchez pour les lire et répondre</span></span>'+icon('fa-chevron-right')+'</div></button>'+h;
  return h};

const _rh=routeHash;
routeHash=function(){if(S.role==='doula'&&location.hash==='#demandes'){S.dtab='outils';S.dsub='demandes';return}return _rh.apply(this,arguments)};

/* ---------- actions ---------- */
function ecrireSheet(id){const d=(A.liste||[]).find(x=>x.id===id);if(!d)return;const m=Object.assign({},S.meta||{});let dpa='',bb='';
  try{if(window.ESPACE==='parent'&&S.parent){if(!m.prenom&&S.parent.prenom&&S.parent.prenom!=='Exemple')m.prenom=S.parent.prenom;const st=stage();if(st.k==='preg'&&st.g&&st.g.dpa)dpa=iso(st.g.dpa);if(st.k==='pp')bb=(S.parent.naissance||{}).date||''}}catch(e){}
  sheet('Rendez-vous avec '+esc(d.prenom||'cette doula'),'<p class="small">Votre demande est envoyée par courriel à la doula, avec vos coordonnées. Elle vous répond directement pour fixer une rencontre de connaissance.</p><div class="stack">'
   +'<label class="f">Votre nom<input type="text" id="deNom" value="'+esc(((m.prenom||'')+' '+(m.nom||'')).trim())+'" autocomplete="name"></label>'
   +'<div class="grid2 resp"><label class="f">Téléphone (facultatif)<input type="tel" id="deTel" autocomplete="tel"></label><label class="f">Votre ville<input type="text" id="deVille" autocomplete="address-level2"></label></div>'
   +(bb?'<p class="small" style="margin:0">Bébé est né le <b>'+esc(new Date(bb+'T12:00').toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'}))+'</b> : la doula le verra dans votre demande.</p><input type="hidden" id="deDpa" value="">':'<label class="f">Date prévue d\'accouchement (si enceinte)<input type="date" id="deDpa" value="'+esc(dpa)+'"></label>')
   +'<label class="f">Votre message<textarea id="deMsg" rows="5" maxlength="1500" placeholder="Parlez-lui de vous, de ce que vous recherchez, de vos questions…"></textarea></label>'
   +'<label class="check"><input type="checkbox" id="deOk"><span>J\'accepte que cette doula voie mon nom, mon courriel et les informations ci-dessus pour me répondre.</span></label>'
   +'<button class="btn" data-act="anEnvoyer" data-id="'+esc(id)+'">'+icon('fa-paper-plane')+'Envoyer ma demande de rendez-vous</button></div>')}

document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,id=b.dataset.id;
  if(a.slice(0,2)!=='an')return;
  try{switch(a){
  case 'anInscrire':{const em=(document.getElementById('fCourriel').value||'').trim(),pr=(document.getElementById('fPrenom').value||'').trim();
    if(!pr){toast('Entrez votre prénom');return}if(!/^\S+@\S+\.\S+$/.test(em)){toast('Entrez un courriel valide');return}b.disabled=true;
    const {data}=await sb.functions.invoke('fam-acces',{body:{type:'famille',courriel:em,prenom:pr,nom:(document.getElementById('fNom').value||'').trim()}});
    if(data&&data.ok){ecranCode(em,{type:'famille',courriel:em,prenom:pr,nom:(document.getElementById('fNom').value||'').trim()})}
    else{b.disabled=false;toast((data&&data.erreur)||'Réessayez dans un moment')}return}
  case 'anPlusTard':{ME_DOULA.annuaire_vu=true;try{localStorage.setItem('an-vu','1')}catch(x){}render();return}
  case 'anBascule':{const on=!ME_DOULA.annuaire;if(on&&!ME_DOULA.annuaire_brouillon){toast('Remplissez d\'abord votre profil');S.dsub='annuaire';render();return}
    const {error}=await sb.from('fam_doulas').update({annuaire:on}).eq('id',ME_DOULA.id);if(error){toast(error.message);return}ME_DOULA.annuaire=on;toast(on?'Vous êtes dans l\'annuaire':'Vous êtes retirée de l\'annuaire');render();return}
  case 'anMois':{moisInit();const v=b.dataset.v;MSEL=MSEL.includes(v)?MSEL.filter(x=>x!==v):MSEL.concat(v);document.getElementById('pfMois').innerHTML=moisHtml();return}
  case 'anVille':{selInit();const v=b.dataset.v;SEL=SEL.includes(v)?SEL.filter(x=>x!==v):SEL.concat(v);const el=document.getElementById('pfVilles');if(el)el.innerHTML=villesHtml();return}
  case 'anAjoutVille':{selInit();const i=document.getElementById('pfAutre'),v=(i.value||'').trim().slice(0,60);if(!v)return;if(!SEL.includes(v))SEL.push(v);document.getElementById('pfVilles').innerHTML=villesHtml();return}
  case 'anMdp':motDePasseSheet(false);return;
  case 'anPlus':ficheSheet(id);return;
  case 'anEcrire':{const {data:{session}}=await sb.auth.getSession();if(!session){sheet('Créez votre compte','<p class="small">Pour écrire à cette doula, créez un compte gratuit. Ça prend une minute, puis vous reviendrez ici.</p><button class="btn" data-act="anCompte">Créer mon compte</button>');return}ecrireSheet(id);return}
  case 'anCompte':close();S.vueCx='famille';ecranConnexion();return;
  case 'anEnvoyer':{const nom=document.getElementById('deNom').value.trim();if(!nom){toast('Entrez votre nom');return}if(!document.getElementById('deOk').checked){toast('Cochez la case pour que la doula puisse vous répondre');return}
    b.disabled=true;const {data,error}=await sb.functions.invoke('fam-contact',{body:{doula:id,nom:nom,tel:document.getElementById('deTel').value.trim(),ville:document.getElementById('deVille').value.trim(),dpa:document.getElementById('deDpa').value||null,message:document.getElementById('deMsg').value.trim()}});
    if(error||!data||!data.ok){b.disabled=false;toast((data&&data.erreur)||(error&&error.message)||'Pas envoyé, réessayez');return}
    close();toast('Demande envoyée ! La doula vous répondra bientôt.');await chargerAnnuaire();const el=document.getElementById('anDem');if(el)el.innerHTML=demandesHtml();return}
  case 'anSauverProfil':{const g=k=>(document.getElementById(k)||{}).value||'';let base=(g('pfBase')||'').trim()||null;if(base){const cb=coord(base);if(!cb){toast('Choisissez votre ville dans la liste qui apparaît en tapant (la plus proche de chez vous)');return}base=cb.nom}
    const c={entreprise:ME_DOULA.entreprise||null,photo:ME_DOULA.photo||null,region:g('pfRegion').trim()||null,zones:(SEL&&SEL.length?SEL.join(', '):null),bio:g('pfBio').trim()||null,langues:g('pfLangues').trim()||null,certification:g('pfCert').trim()||null,ville_base:base,rayon_km:base?+g('pfRayon'):null,lat:(coord(base)||{}).lat??null,lng:(coord(base)||{}).lng??null,site_web:g('pfSite').trim()||null,dispo_mois:(MSEL&&MSEL.length?MSEL.join(','):null),services:[...document.querySelectorAll('.pfServ:checked')].map(x=>x.value).join(',')||null,prix_min:(+g('pfPrix')>0?Math.round(+g('pfPrix')):null)};
    let aut=brouillon().autorisation||null;
    if(!aut){const cases=[...document.querySelectorAll('.pfAut')],sig=(document.getElementById('pfSig')||{}).value||'';
      if(patch0(cases,sig)){aut={nom:sig.trim(),date:new Date().toISOString(),v:1}}else{toast('Cochez les 4 autorisations et signez avec votre nom complet pour continuer');return}}
    c.autorisation=aut;
    const patch={annuaire:document.getElementById('pfOn').checked,accepte_nouvelles:document.getElementById('pfAcc').checked,annuaire_brouillon:c};
    if(!c.bio||!(c.ville_base||c.region||c.zones)){toast('Ajoutez votre ville de départ (ou votre région) et une présentation');return}
    const {error}=await sb.from('fam_doulas').update(patch).eq('id',ME_DOULA.id);if(error){toast('Pas enregistré : '+error.message);return}
    const chg=JSON.stringify(c)!==JSON.stringify(ME_DOULA.annuaire_brouillon||null);Object.assign(ME_DOULA,patch);if(chg)ME_DOULA.annuaire_statut='en_attente';
    if(chg&&MOI&&MOI.admin){await sb.rpc('fam_annuaire_decider',{p_doula:ME_DOULA.id,p_ok:true});ME_DOULA.annuaire_pub=c;ME_DOULA.annuaire_statut='approuve'}
    SEL=null;MSEL=null;toast(chg&&!(MOI&&MOI.admin)?'Enregistré. Votre profil est envoyé pour approbation (24 à 48 h).':'Profil enregistré');render();return}
  case 'anOk':case 'anNon':{const note=a==='anNon'?(document.getElementById('apNote'+id)||{}).value||'':'';if(a==='anNon'&&!note.trim()){toast('Écrivez une courte raison pour la doula');return}
    const {data}=await sb.rpc('fam_annuaire_decider',{p_doula:id,p_ok:a==='anOk',p_note:note});if(!data||!data.ok){toast((data&&data.erreur)||'Erreur');return}await chargerApprob();toast(a==='anOk'?'Profil approuvé':'Profil refusé');render();return}
  case 'anDecliner':{if(b.dataset.c!=='1'){b.dataset.c='1';toast('Touchez encore pour décliner');return}await sb.from('fam_demandes').update({statut:'declinee'}).eq('id',id);await chargerDemandes();render();return}
  case 'anAccepter':{const d=DEMANDES.find(x=>x.id===id);if(!d)return;if(d.statut!=='acceptee'){await sb.from('fam_demandes').update({statut:'acceptee'}).eq('id',id);d.statut='acceptee'}
    const mots=String(d.nom||'').trim().split(/\s+/);S.dtab='clientes';S.openClient=null;render();
    clientForm({prenom:mots[0]||'',nomFamille:mots.slice(1).join(' '),courriel:d.courriel,tel:d.telephone||'',dpa:d.dpa||'',notes:(d.ville?'Ville : '+d.ville+'\n':'')+(d.message||'')});return}
  }}catch(err){console.error(err);toast('Une erreur est survenue. Réessayez.')}});
/* filtres, favorites, près de moi, réponses */
const rafraichir=()=>{['anListe','anListeApp'].forEach(i=>{const l=document.getElementById(i);if(l)l.innerHTML=listeHtml()})};
document.addEventListener('click',e=>{let b;const G=q=>e.target.closest(q);
  if(b=G('[data-an-fav]')){e.preventDefault();e.stopPropagation();const id=b.dataset.anFav,L=favs().slice(),k=L.indexOf(id);if(k>=0)L.splice(k,1);else L.push(id);favSet(L);rafraichir();const lay=document.getElementById('layer');if(lay&&lay.innerHTML&&lay.querySelector('[data-an-fav="'+id+'"]'))ficheSheet(id);toast(k>=0?'Retirée de vos favorites':'Ajoutée à vos favorites ♥');return}
  if(b=G('[data-an-ff]')){e.stopPropagation();A.f=A.f||{serv:[]};A.f.fav=!A.f.fav;rafraichir();return}
  if(b=G('[data-an-fl]')){e.stopPropagation();A.f=A.f||{serv:[]};A.f.langue=A.f.langue===b.dataset.anFl?'':b.dataset.anFl;rafraichir();return}
  if(b=G('[data-an-fs]')){e.stopPropagation();A.f=A.f||{serv:[]};const k=b.dataset.anFs,L=A.f.serv=A.f.serv||[];const i=L.indexOf(k);if(i>=0)L.splice(i,1);else L.push(k);rafraichir();return}
  if(b=G('[data-an-pres]')){e.stopPropagation();if(A.pos){A.pos=null;rafraichir();return}if(!navigator.geolocation){toast('Votre téléphone ne permet pas la localisation : tapez votre ville');return}
    toast('Recherche de votre position…');navigator.geolocation.getCurrentPosition(p=>{A.pos={lat:p.coords.latitude,lng:p.coords.longitude};A.q='';['anQ','anQApp'].forEach(i=>{const x=document.getElementById(i);if(x)x.value=''});rafraichir()},()=>toast('Position non disponible : tapez plutôt votre ville'),{enableHighAccuracy:false,timeout:10000,maximumAge:600000});return}
  if(b=G('[data-an-rep]')){e.stopPropagation();repondreSheet(b.dataset.anRep);return}
  if(b=G('[data-an-mail]')){e.stopPropagation();const d=DEMANDES.find(x=>x.id===b.dataset.anMail);if(!d)return;location.href='mailto:'+encodeURIComponent(d.courriel)+'?subject='+encodeURIComponent('Notre rencontre · '+((ME_DOULA&&ME_DOULA.prenom)||'votre doula'))+'&body='+encodeURIComponent(document.getElementById('anRep').value);return}
  if(G('[data-an-copie]')){e.stopPropagation();const t=document.getElementById('anRep').value;try{navigator.clipboard.writeText(t).then(()=>toast('Message copié'),()=>toast('Sélectionnez le texte pour le copier'))}catch(x){toast('Sélectionnez le texte pour le copier')}return}},true);
document.addEventListener('input',e=>{if(e.target&&(e.target.id==='anQ'||e.target.id==='anQApp')&&A.pos){A.pos=null}},true);
(function(){const st=document.createElement('style');st.textContent='.an-filt{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px 0 8px}.an-filt::-webkit-scrollbar{display:none}.an-filt .chip{flex:none}.an-fav{float:right;border:0;background:transparent;font-size:1.4rem;line-height:1;color:var(--accent);cursor:pointer;padding:0 2px}.an-et{color:#b7791f;font-weight:700}.an-et small{color:var(--muted);font-weight:500}.an-serv{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}.an-serv .pill{font-size:.68rem}';document.head.appendChild(st)})();
})();
