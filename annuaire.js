/* Sérénaissance — annuaire « Trouver ma doula » : les familles créent un compte, cherchent une doula près d'elles et lui écrivent;
   la doula choisit d'être listée (profil public optionnel), reçoit les demandes dans l'appli et peut inviter la famille en un geste. */
(function(){
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
const A={liste:null,q:'',dem:[],charge:false};
const STAT={nouvelle:['Envoyée','line'],vue:['Vue','line'],acceptee:['Acceptée','acc'],declinee:['Non disponible','line']};
let DEMANDES=[];

const VILLES={'Nouveau-Brunswick':[['Campbellton',48.0,-66.67],['Atholville',48.07,-66.7],['Dalhousie',48.06,-66.37],['Balmoral',47.98,-66.43],['Belledune',47.9,-65.84],['Bathurst',47.62,-65.65],['Caraquet',47.79,-64.95],['Shippagan',47.74,-64.71],['Tracadie',47.51,-64.91],['Miramichi',47.03,-65.5],['Edmundston',47.37,-68.33],['Grand-Sault',47.03,-67.74],['Saint-Quentin',47.51,-67.4],['Kedgwick',47.65,-67.34],['Moncton',46.09,-64.78],['Dieppe',46.08,-64.69],['Riverview',46.06,-64.8],['Shediac',46.22,-64.54],['Bouctouche',46.47,-64.74],['Richibucto',46.68,-64.87],['Sackville',45.9,-64.37],['Fredericton',45.96,-66.64],['Oromocto',45.85,-66.48],['Saint-Jean',45.27,-66.06],['Sussex',45.72,-65.51]],
'Québec':[['Pointe-à-la-Croix',48.01,-66.63],['Matapédia',48.0,-66.98],['Amqui',48.46,-67.43],['Mont-Joli',48.58,-68.19],['Matane',48.85,-67.53],['Rimouski',48.45,-68.52],['Rivière-du-Loup',47.84,-69.54],['Carleton-sur-Mer',48.1,-66.13],['Maria',48.17,-66.0],['New Richmond',48.17,-65.86],['Bonaventure',48.05,-65.49],['Chandler',48.35,-64.68],['Gaspé',48.83,-64.49],['Sainte-Anne-des-Monts',49.12,-66.49],['Québec',46.81,-71.21],['Lévis',46.8,-71.18],['Trois-Rivières',46.35,-72.55],['Sherbrooke',45.4,-71.9],['Montréal',45.5,-73.57],['Laval',45.6,-73.71],['Longueuil',45.53,-73.52],['Gatineau',45.48,-75.7]],
'Nouvelle-Écosse':[['Halifax',44.65,-63.57],['Sydney',46.14,-60.19],['Truro',45.37,-63.28],['Amherst',45.83,-64.21],['Yarmouth',43.84,-66.12]],
'Île-du-Prince-Édouard':[['Charlottetown',46.24,-63.13],['Summerside',46.4,-63.79]],
'Terre-Neuve-et-Labrador':[['St. John\'s',47.56,-52.71]],
'Ontario':[['Ottawa',45.42,-75.7],['Toronto',43.65,-79.38],['Sudbury',46.49,-81.0]]};
const TOUTES_C=Object.values(VILLES).flat();const TOUTES=TOUTES_C.map(x=>x[0]);
const coord=n=>{const t=TOUTES_C.find(x=>norm(x[0])===norm(n));return t?{lat:t[1],lng:t[2],nom:t[0]}:null};
const dist=(a,b)=>{const R=6371,r=x=>x*Math.PI/180,dl=r(b.lat-a.lat),dn=r(b.lng-a.lng),h=Math.sin(dl/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))};
let SEL=null;const selInit=()=>{if(SEL===null)SEL=String((ME_DOULA&&ME_DOULA.zones)||'').split(',').map(x=>x.trim()).filter(Boolean)};
function villesHtml(){selInit();const extra=SEL.filter(v=>!TOUTES.includes(v));
  const chip=v=>'<button type="button" class="pill '+(SEL.includes(v)?'acc':'line')+'" style="cursor:pointer;border:0;font:inherit" data-act="anVille" data-v="'+esc(v)+'">'+(SEL.includes(v)?icon('fa-check')+' ':'')+esc(v)+'</button>';
  return (SEL.length?'<p class="xs muted" style="margin:0 0 6px">'+SEL.length+' ville'+(SEL.length>1?'s':'')+' choisie'+(SEL.length>1?'s':'')+'</p>':'')
   +Object.entries(VILLES).map(([pr,L],i)=>'<details class="acc"'+(i===0||L.some(v=>SEL.includes(v[0]))?' open':'')+'><summary>'+esc(pr)+'<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body"><div class="row" style="gap:6px;flex-wrap:wrap">'+L.map(v=>chip(v[0])).join('')+'</div></div></details>').join('')
   +(extra.length?'<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px">'+extra.map(chip).join('')+'</div>':'')
   +'<div class="row" style="gap:8px;margin-top:8px"><input type="text" id="pfAutre" placeholder="Une autre ville ?" style="flex:1"><button type="button" class="btn sm ghost" data-act="anAjoutVille">Ajouter</button></div>'}
/* ---------- carte publique d'une doula (même rendu pour les familles et l'aperçu de la doula) ---------- */
function carte(d,bouton){
  const nom=esc((d.prenom||'')+(d.nom_initiale?' '+d.nom_initiale+'.':''));
  const ph=d.photo?'<img src="'+esc(d.photo)+'" alt="" style="width:64px;height:64px;border-radius:50%;object-fit:cover;flex:none">':'<span class="ic" style="width:64px;height:64px;border-radius:50%;flex:none;display:grid;place-items:center">'+icon('fa-user')+'</span>';
  const lieux=[d.ville_base?d.ville_base+(d.rayon_km?' · jusqu\'à '+d.rayon_km+' km':''):d.region,d.zones].filter(Boolean).join(' · ');
  return '<div class="card"><div class="row" style="gap:14px;align-items:flex-start">'+ph+'<div style="min-width:0;flex:1"><b style="font-size:17px">'+nom+'</b>'+(d.entreprise?'<div class="small muted">'+esc(d.entreprise)+'</div>':'')+(d._km!=null&&d._km>0?'<div class="xs muted">À environ '+d._km+' km de vous</div>':'')+(lieux?'<div class="small" style="margin-top:4px">'+icon('fa-location-dot')+' '+esc(lieux)+'</div>':'')+'</div></div>'
    +(d.bio?'<p class="small" style="margin:12px 0 0;white-space:pre-line">'+esc(d.bio)+'</p>':'')
    +'<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:10px">'+(d.langues?'<span class="pill line">'+icon('fa-language')+' '+esc(d.langues)+'</span>':'')+(d.certification?'<span class="pill line">'+icon('fa-award')+' '+esc(d.certification)+'</span>':'')+'</div>'
    +(bouton?'<button class="btn" style="margin-top:14px;width:100%" data-act="anEcrire" data-id="'+esc(d.id)+'">'+icon('fa-envelope')+'Écrire à '+esc(d.prenom||'cette doula')+'</button>':'')+'</div>'}

/* ---------- côté famille ---------- */
async function chargerAnnuaire(){
  const [r,m]=await Promise.all([sb.rpc('fam_annuaire2',{p_q:null}),sb.from('fam_demandes').select('*').order('created_at',{ascending:false}).limit(30)]);
  A.liste=r.data||[];A.dem=m.data||[];A.charge=true}
function filtrer(){const q=norm(A.q);if(!q)return A.liste;const c=coord(A.q);
  if(c){const L=[];A.liste.forEach(d=>{let k=null;if(d.lat!=null&&d.rayon_km){const x=dist(c,{lat:d.lat,lng:d.lng});if(x<=d.rayon_km)k=Math.round(x)}
    const inZ=norm(d.zones).split(',').some(z=>z.trim()===norm(c.nom));if(k!==null||inZ){L.push(Object.assign({},d,{_km:k===null?0:k}))}});return L.sort((a,b)=>a._km-b._km)}
  return A.liste.filter(d=>norm([d.region,d.zones,d.ville_base,d.prenom,d.entreprise].join(' ')).includes(q))}
function listeHtml(){const L=filtrer();
  if(!L.length)return '<div class="card tint"><p class="small" style="margin:0">'+(A.q?'Aucune doula inscrite dans ce secteur pour le moment. Essayez une ville voisine ou votre région.':'Aucune doula n\'est encore inscrite dans l\'annuaire. Revenez bientôt !')+'</p></div>';
  return '<p class="xs muted">'+L.length+' doula'+(L.length>1?'s':'')+(A.q?' pour « '+esc(A.q)+' »':'')+'</p>'+L.map(d=>carte(d,true)).join('')}
function demandesHtml(){if(!A.dem.length)return '';
  return '<div class="card"><span class="eyebrow acc">Mes demandes</span><div class="list">'+A.dem.map(x=>{const s=STAT[x.statut]||STAT.nouvelle;return '<div class="li"><div class="ic">'+icon(x.statut==='acceptee'?'fa-circle-check':'fa-paper-plane')+'</div><div class="tx"><b>'+esc(x.doula_nom||'Une doula')+'</b><span>'+new Date(x.created_at).toLocaleDateString('fr-CA',{day:'numeric',month:'short'})+(x.statut==='acceptee'?' · surveillez vos courriels : une invitation arrive':'')+'</span></div><span class="pill '+s[1]+'">'+s[0]+'</span></div>'}).join('')+'</div></div>'}
async function ecranChercheuse(){
  $('#tabs').innerHTML='';$('#gear').hidden=true;
  $('#app').innerHTML='<div style="max-width:640px;margin:0 auto;width:100%" class="stack"><p class="small muted" style="text-align:center;padding:40px">Chargement…</p></div>';
  try{await chargerAnnuaire()}catch(e){A.liste=[];A.dem=[]}
  const sansMdp=!S.mdpOk&&!(S.meta&&S.meta.mdp);
  const m=S.meta||{};
  $('#app').innerHTML='<div style="max-width:640px;margin:0 auto;width:100%" class="stack"><div class="card"><div class="stack" style="gap:6px"><span class="script">Bonjour'+(m.prenom?' '+esc(m.prenom):'')+'</span><h1>Trouver ma doula</h1><p class="small">Cherchez une doula près de chez vous, lisez sa présentation et écrivez-lui directement. Elle vous répond, puis vous invite dans votre espace Famille.</p></div>'
    +'<form id="anForm" class="row" style="gap:8px;margin-top:12px"><label class="f" style="flex:1;margin:0">Ville ou région<input type="text" enterkeyhint="search" list="anVilles" id="anQ" placeholder="Ex. Campbellton, Moncton, Gaspésie…" value="'+esc(A.q)+'"></label><button class="btn" type="submit" style="align-self:flex-end">'+icon('fa-magnifying-glass')+'Chercher</button></form></div>'
    +'<datalist id="anVilles">'+TOUTES.map(v=>'<option value="'+esc(v)+'">').join('')+'</datalist><div id="anListe" class="stack">'+listeHtml()+'</div><div id="anDem">'+demandesHtml()+'</div>'
    +'<p class="xs muted" style="text-align:center">Connectée avec <b>'+esc(MOI.courriel)+'</b> · <button class="btn sm ghost" data-act="anMdp">Mon mot de passe</button> <button class="btn sm ghost" data-act="deconnexion">Me déconnecter</button></p></div>'+pied();
  const f=document.getElementById('anForm');
  if(f)f.addEventListener('submit',e=>{e.preventDefault();A.q=document.getElementById('anQ').value;document.getElementById('anListe').innerHTML=listeHtml()});
  const q=document.getElementById('anQ');if(q)q.addEventListener('input',()=>{A.q=q.value;document.getElementById('anListe').innerHTML=listeHtml()});
  if(sansMdp&&typeof motDePasseSheet==='function')motDePasseSheet(true)}

const _autre=ecranAutreEspace;
ecranAutreEspace=function(estDoula){if(ESPACE==='parent'&&!estDoula){ecranChercheuse();return}_autre.apply(this,arguments)};

/* inscription d'une famille depuis l'écran de connexion */
const _cx=ecranConnexion;
ecranConnexion=function(msg){
  if(ESPACE==='parent'&&S.vueCx==='famille'){
    $('#tabs').innerHTML='';$('#gear').hidden=true;
    $('#app').innerHTML='<div class="card" style="max-width:480px;margin:0 auto;width:100%"><span class="script">Bienvenue</span><h1>Créer mon compte famille</h1><p class="small">Pour chercher une doula près de chez vous et lui écrire. C\'est gratuit.</p><div class="stack"><div class="grid2 resp"><label class="f">Prénom<input type="text" id="fPrenom" autocomplete="given-name"></label><label class="f">Nom<input type="text" id="fNom" autocomplete="family-name"></label></div><label class="f">Courriel<input type="email" id="fCourriel" autocomplete="email"></label><button class="btn" data-act="anInscrire">'+icon('fa-paper-plane')+'Recevoir mon lien d\'inscription</button><button class="btn sm ghost" data-act="vueCx" data-v="connexion">'+icon('fa-arrow-left')+'J\'ai déjà un compte</button></div><p class="xs muted" style="margin-top:12px">Votre doula vous a déjà inscrite ? Utilisez plutôt le courriel d\'invitation qu\'elle vous a envoyé.</p></div>'+pied();return}
  _cx.apply(this,arguments);
  if(ESPACE!=='parent')return;
  const p=[...document.querySelectorAll('#app p.xs')].find(x=>/Pas encore de compte/.test(x.textContent));
  if(p){p.insertAdjacentHTML('afterend','<div class="card tint" style="margin:10px 0 0"><b>Vous cherchez une doula ?</b><p class="small" style="margin:6px 0 10px">Créez un compte gratuit, trouvez une doula près de chez vous et écrivez-lui directement.</p><button class="btn" data-act="vueCx" data-v="famille">'+icon('fa-magnifying-glass')+'Trouver ma doula</button></div>')}};

/* ---------- côté doula ---------- */
async function chargerDemandes(){try{const {data}=await sb.from('fam_demandes').select('*').order('created_at',{ascending:false}).limit(60);DEMANDES=data||[]}catch(e){}}
const nouvelles=()=>DEMANDES.filter(d=>d.statut==='nouvelle').length;
const _cd=chargerDoula;
chargerDoula=async function(){await _cd.apply(this,arguments);try{if(localStorage.getItem('an-vu'))ME_DOULA.annuaire_vu=true}catch(x){}await chargerDemandes()};

function profilHtml(){const D=ME_DOULA||{};
  const apercu=carte({ville_base:D.ville_base,rayon_km:D.rayon_km,id:D.id,prenom:D.prenom,nom_initiale:(D.nom||'').slice(0,1),entreprise:D.entreprise,photo:D.photo,region:D.region,zones:D.zones,bio:D.bio,langues:D.langues,certification:D.certification},false);
  return back('dsub','','Outils')+sh('Mon profil dans l\'annuaire','Les familles de votre région vous trouvent et vous écrivent')
   +'<div class="card"><label class="check"><input type="checkbox" id="pfOn" '+(D.annuaire?'checked':'')+'><span><b>Apparaître dans l\'annuaire « Trouver ma doula »</b><br><span class="xs muted">Optionnel. Seuls votre prénom, l\'initiale de votre nom, votre photo et le texte ci-dessous sont visibles. Votre courriel et votre téléphone ne le sont jamais : c\'est vous qui décidez de répondre.</span></span></label>'
   +'<label class="check" style="margin-top:8px"><input type="checkbox" id="pfAcc" '+(D.accepte_nouvelles===false?'':'checked')+'><span>J\'accepte de nouvelles familles en ce moment</span></label>'
   +'<div class="stack" style="margin-top:12px"><label class="f">Ma région<input type="text" id="pfRegion" value="'+esc(D.region||'')+'" placeholder="Ex. Restigouche (N.-B.)"></label>'
   +'<div class="grid2 resp"><label class="f">Ma ville de départ<select id="pfBase"><option value="">— Choisir —</option>'+TOUTES.map(v=>'<option'+(v===D.ville_base?' selected':'')+'>'+esc(v)+'</option>').join('')+'</select></label><label class="f">Je me déplace jusqu\'à<select id="pfRayon">'+[10,25,40,50,75,100,150,200].map(k=>'<option value="'+k+'"'+(+D.rayon_km===k?' selected':'')+'>'+k+' km</option>').join('')+'</select></label></div><div><span class="small"><b>Autres villes précises que je dessers (facultatif)</b></span><div id="pfVilles" class="stack" style="gap:6px;margin-top:6px">'+villesHtml()+'</div></div>'
   +'<div class="grid2 resp"><label class="f">Langues<input type="text" id="pfLangues" value="'+esc(D.langues||'')+'" placeholder="Français, anglais"></label><label class="f">Formation / certification<input type="text" id="pfCert" value="'+esc(D.certification||'')+'" placeholder="Ex. Académie Sérénaissance"></label></div>'
   +'<label class="f">Ma présentation (600 caractères)<textarea id="pfBio" rows="6" maxlength="600" placeholder="Qui êtes-vous ? Comment accompagnez-vous les familles ?">'+esc(D.bio||'')+'</textarea></label>'
   +'<p class="xs muted">Ajoutez une belle photo de vous dans Paramètres : elle s\'affiche ici.</p>'
   +'<button class="btn" data-act="anSauverProfil">'+icon('fa-check')+'Enregistrer mon profil</button></div></div>'
   +'<div class="eyebrow acc" style="margin:14px 0 6px">Ce que les familles verront</div>'+apercu+'<p class="xs muted">Votre abonnement doit être actif pour apparaître dans l\'annuaire.</p>'}

function demandesPage(){
  const dejaClient=c=>(S.clients||[]).some(x=>String(x.courriel||'').toLowerCase()===String(c||'').toLowerCase());
  const on=!!(ME_DOULA&&ME_DOULA.annuaire);
  const h=back('dsub','','Outils')+sh('Demandes de familles','Des familles de l\'annuaire souhaitent vous rencontrer')+'<div class="card '+(on?'':'tint')+'"><div class="row between" style="gap:10px"><span><b>'+icon(on?'fa-eye':'fa-eye-slash')+' '+(on?'Vous êtes visible dans l\'annuaire':'Vous n\'êtes pas dans l\'annuaire')+'</b><br><span class="xs muted">'+(on?'Les familles peuvent vous trouver et vous écrire.':'Personne ne peut vous trouver. Vous choisissez.')+'</span></span><button class="btn sm '+(on?'ghost':'')+'" data-act="anBascule">'+(on?'Me retirer':'Activer')+'</button></div><button class="btn sm ghost" style="margin-top:8px" data-act="dgo" data-v="outils|annuaire">Modifier mon profil public</button></div>';
  if(!DEMANDES.length)return h+'<div class="card tint"><p class="small" style="margin:0">Aucune demande pour l\'instant. Activez votre profil dans « Mon profil dans l\'annuaire » pour être trouvée par les familles.</p></div>';
  return h+DEMANDES.map(d=>{const s=STAT[d.statut]||STAT.nouvelle,cree=dejaClient(d.courriel);
    return '<div class="card"><div class="row between" style="gap:8px"><b>'+esc(d.nom)+'</b><span class="pill '+(d.statut==='nouvelle'?'acc':s[1])+'">'+(d.statut==='nouvelle'?'Nouvelle':s[0])+'</span></div>'
    +'<div class="small muted">'+new Date(d.created_at).toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'})+(d.ville?' · '+esc(d.ville):'')+(d.dpa?' · DPA '+esc(d.dpa):'')+'</div>'
    +(d.message?'<p class="small" style="white-space:pre-line;margin:10px 0 0">'+esc(d.message)+'</p>':'')
    +'<div class="small" style="margin-top:10px">'+icon('fa-envelope')+' '+esc(d.courriel)+(d.telephone?' · '+icon('fa-phone')+' '+esc(d.telephone):'')+'</div>'
    +'<div class="row" style="gap:8px;flex-wrap:wrap;margin-top:12px">'
    +(d.statut==='declinee'||cree?'':'<button class="btn sm" data-act="anAccepter" data-id="'+esc(d.id)+'">'+icon('fa-user-plus')+(d.statut==='acceptee'?'Créer le dossier':'Accepter et inviter')+'</button>')
    +(d.statut==='nouvelle'||d.statut==='vue'?'<button class="btn sm ghost" data-act="anDecliner" data-id="'+esc(d.id)+'">Décliner</button>':'')
    +(cree?'<span class="pill acc">'+icon('fa-check')+' Dans vos familles</span>':'')+'</div></div>'}).join('')}

DSUB.annuaire=profilHtml;DSUB.demandes=demandesPage;
if(typeof DOUT!=='undefined'){DOUT.unshift(['demandes','fa-inbox','Demandes de familles','Familles qui souhaitent vous rencontrer'],['annuaire','fa-location-dot','Mon profil dans l\'annuaire','Soyez trouvée par les familles près de vous'])}

const _da=dAccueil;
dAccueil=function(){let h=_da.apply(this,arguments);const n=nouvelles();
  if(ME_DOULA&&!ME_DOULA.annuaire&&!ME_DOULA.annuaire_vu)h='<div class="card tint"><b>'+icon('fa-location-dot')+' Être trouvée par des familles ?</b><p class="small" style="margin:6px 0 10px">Facultatif : activez votre profil dans l\'annuaire « Trouver ma doula ». Vous pouvez le retirer à tout moment.</p><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="dgo" data-v="outils|annuaire">Configurer mon profil</button><button class="btn sm ghost" data-act="anPlusTard">Non merci</button></div></div>'+h;
  if(n)h='<button class="card tint" data-act="dgo" data-v="outils|demandes" style="width:100%;text-align:left;cursor:pointer;border:0;color:inherit;font:inherit"><div class="row between"><span><b>'+icon('fa-inbox')+' '+n+' nouvelle'+(n>1?'s':'')+' demande'+(n>1?'s':'')+' de famille</b><br><span class="small">Touchez pour les lire et répondre</span></span>'+icon('fa-chevron-right')+'</div></button>'+h;
  return h};

const _rh=routeHash;
routeHash=function(){if(S.role==='doula'&&location.hash==='#demandes'){S.dtab='outils';S.dsub='demandes';return}return _rh.apply(this,arguments)};

/* ---------- actions ---------- */
function ecrireSheet(id){const d=(A.liste||[]).find(x=>x.id===id);if(!d)return;const m=S.meta||{};
  sheet('Écrire à '+esc(d.prenom||'cette doula'),'<p class="small">Votre message est envoyé à la doula avec vos coordonnées. Elle vous répond directement.</p><div class="stack">'
   +'<label class="f">Votre nom<input type="text" id="deNom" value="'+esc(((m.prenom||'')+' '+(m.nom||'')).trim())+'" autocomplete="name"></label>'
   +'<div class="grid2 resp"><label class="f">Téléphone (facultatif)<input type="tel" id="deTel" autocomplete="tel"></label><label class="f">Votre ville<input type="text" id="deVille" autocomplete="address-level2"></label></div>'
   +'<label class="f">Date prévue d\'accouchement (si enceinte)<input type="date" id="deDpa"></label>'
   +'<label class="f">Votre message<textarea id="deMsg" rows="5" maxlength="1500" placeholder="Parlez-lui de vous, de ce que vous recherchez, de vos questions…"></textarea></label>'
   +'<label class="check"><input type="checkbox" id="deOk"><span>J\'accepte que cette doula voie mon nom, mon courriel et les informations ci-dessus pour me répondre.</span></label>'
   +'<button class="btn" data-act="anEnvoyer" data-id="'+esc(id)+'">'+icon('fa-paper-plane')+'Envoyer ma demande</button></div>')}

document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,id=b.dataset.id;
  if(a.slice(0,2)!=='an')return;
  try{switch(a){
  case 'anInscrire':{const em=(document.getElementById('fCourriel').value||'').trim(),pr=(document.getElementById('fPrenom').value||'').trim();
    if(!pr){toast('Entrez votre prénom');return}if(!/^\S+@\S+\.\S+$/.test(em)){toast('Entrez un courriel valide');return}b.disabled=true;
    const {data}=await sb.functions.invoke('fam-acces',{body:{type:'famille',courriel:em,prenom:pr,nom:(document.getElementById('fNom').value||'').trim()}});
    if(data&&data.ok){$('#app').innerHTML='<div class="card" style="max-width:480px;margin:0 auto"><span class="script">Merci</span><h2>Regardez vos courriels</h2><p class="small">Un lien vient de partir à <b>'+esc(em)+'</b>. Touchez-le pour confirmer votre courriel et choisir votre mot de passe. Pensez à vérifier vos courriels indésirables.</p></div>'+pied()}
    else{b.disabled=false;toast((data&&data.erreur)||'Réessayez dans un moment')}return}
  case 'anPlusTard':{ME_DOULA.annuaire_vu=true;try{localStorage.setItem('an-vu','1')}catch(x){}render();return}
  case 'anBascule':{const on=!ME_DOULA.annuaire;if(on&&(!ME_DOULA.bio||!(ME_DOULA.region||ME_DOULA.zones))){toast('Ajoutez d\'abord votre région et une présentation');S.dsub='annuaire';render();return}
    const {error}=await sb.from('fam_doulas').update({annuaire:on}).eq('id',ME_DOULA.id);if(error){toast(error.message);return}ME_DOULA.annuaire=on;toast(on?'Vous êtes dans l\'annuaire':'Vous êtes retirée de l\'annuaire');render();return}
  case 'anVille':{selInit();const v=b.dataset.v;SEL=SEL.includes(v)?SEL.filter(x=>x!==v):SEL.concat(v);const el=document.getElementById('pfVilles');if(el)el.innerHTML=villesHtml();return}
  case 'anAjoutVille':{selInit();const i=document.getElementById('pfAutre'),v=(i.value||'').trim().slice(0,60);if(!v)return;if(!SEL.includes(v))SEL.push(v);document.getElementById('pfVilles').innerHTML=villesHtml();return}
  case 'anMdp':motDePasseSheet(false);return;
  case 'anEcrire':ecrireSheet(id);return;
  case 'anEnvoyer':{const nom=document.getElementById('deNom').value.trim();if(!nom){toast('Entrez votre nom');return}if(!document.getElementById('deOk').checked){toast('Cochez la case pour que la doula puisse vous répondre');return}
    b.disabled=true;const {data,error}=await sb.rpc('fam_demander_doula',{p_doula:id,p_nom:nom,p_tel:document.getElementById('deTel').value.trim(),p_ville:document.getElementById('deVille').value.trim(),p_dpa:document.getElementById('deDpa').value||null,p_message:document.getElementById('deMsg').value.trim()});
    if(error||!data||!data.ok){b.disabled=false;toast((data&&data.erreur)||(error&&error.message)||'Pas envoyé, réessayez');return}
    close();toast('Demande envoyée ! La doula vous répondra par courriel.');await chargerAnnuaire();const el=document.getElementById('anDem');if(el)el.innerHTML=demandesHtml();return}
  case 'anSauverProfil':{const g=k=>(document.getElementById(k)||{}).value||'';const patch={annuaire:document.getElementById('pfOn').checked,accepte_nouvelles:document.getElementById('pfAcc').checked,region:g('pfRegion').trim()||null,ville_base:g('pfBase')||null,rayon_km:g('pfBase')?+g('pfRayon'):null,lat:(coord(g('pfBase'))||{}).lat??null,lng:(coord(g('pfBase'))||{}).lng??null,zones:(SEL&&SEL.length?SEL.join(', '):null),langues:g('pfLangues').trim()||null,certification:g('pfCert').trim()||null,bio:g('pfBio').trim()||null};
    if(patch.annuaire&&(!patch.bio||!(patch.ville_base||patch.region||patch.zones))){toast('Ajoutez votre région (ou vos villes) et une courte présentation pour apparaître');return}
    const {error}=await sb.from('fam_doulas').update(patch).eq('id',ME_DOULA.id);if(error){toast('Pas enregistré : '+error.message);return}Object.assign(ME_DOULA,patch);SEL=null;try{S.doula.region=patch.region||''}catch(x){}toast(patch.annuaire?'Votre profil est dans l\'annuaire':'Profil enregistré (non affiché dans l\'annuaire)');render();return}
  case 'anDecliner':{if(b.dataset.c!=='1'){b.dataset.c='1';toast('Touchez encore pour décliner');return}await sb.from('fam_demandes').update({statut:'declinee'}).eq('id',id);await chargerDemandes();render();return}
  case 'anAccepter':{const d=DEMANDES.find(x=>x.id===id);if(!d)return;if(d.statut!=='acceptee'){await sb.from('fam_demandes').update({statut:'acceptee'}).eq('id',id);d.statut='acceptee'}
    const mots=String(d.nom||'').trim().split(/\s+/);S.dtab='clientes';S.openClient=null;render();
    clientForm({prenom:mots[0]||'',nomFamille:mots.slice(1).join(' '),courriel:d.courriel,tel:d.telephone||'',dpa:d.dpa||'',notes:(d.ville?'Ville : '+d.ville+'\n':'')+(d.message||'')});return}
  }}catch(err){console.error(err);toast('Une erreur est survenue. Réessayez.')}});
})();
