/* Sérénaissance — accueil de la doula : accueillant, orienté « aujourd'hui », raccourcis clairs, et guide de démarrage quand c'est vide. */
if(typeof DTABS!=='undefined'&&DTABS[0]&&DTABS[0][0]==='accueil')DTABS[0][2]='Accueil';
const MOTS_DOULA=['Votre présence calme est déjà un soutien.','Observer, rassurer, référer : vous savez exactement quoi faire.','Chaque famille garde en mémoire la façon dont vous l\'avez fait sentir en sécurité.','Prenez soin de vous aussi : une doula reposée accompagne mieux.','Une question, un doute ? Vos collègues et vos guides sont à portée de main.','Ce que vous offrez ne se mesure pas : une main, une voix, une présence.','Respirez. Vous êtes exactement où vous devez être.'];
function adSalut(){const h=new Date().getHours();return h>=18||h<4?'Bonsoir':'Bonjour'}
function adMot(){const d=new Date();return MOTS_DOULA[(d.getFullYear()*372+d.getMonth()*31+d.getDate())%MOTS_DOULA.length]}
window._pvAtt=window._pvAtt||{n:null};
async function adChargerAtt(){try{if(window._pvAtt.n!==null&&Date.now()-(window._pvAtt.t||0)<60000)return;const {data}=await sb.from('fam_versements_declares').select('famille_id').eq('statut','a_valider');{const ok=new Set((S.clients||[]).filter(c=>!['archivee','non_retenue'].includes(c.statut)).map(c=>c.id)),L=(data||[]).filter(x=>ok.has(x.famille_id));window._pvAtt={n:L.length,t:Date.now(),f:L[0]&&L[0].famille_id}}if(S.role==='doula'&&S.dtab==='accueil'&&!S.vue&&!S.dsub&&!S.openClient&&!(document.getElementById('layer')||{}).innerHTML)render()}catch(e){window._pvAtt={n:0,t:Date.now()}}}
window._adDem=window._adDem||{n:null,t:0};
async function adChargerDem(){try{if(window._adDem.n!==null&&Date.now()-(window._adDem.t||0)<60000)return;const {data}=await sb.from('fam_demandes').select('id').eq('statut','nouvelle');const n=(data||[]).length,ch=window._adDem.n!==n;window._adDem={n,t:Date.now()};if(ch&&S.role==='doula'&&S.dtab==='accueil'&&!S.vue&&!S.openClient)render()}catch(e){window._adDem={n:window._adDem.n||0,t:Date.now()}}}
/* répertoire « Trouver ma doula » : où j'en suis, et quoi faire ensuite */
function adAnnuaire(nbDem){const D=ME_DOULA||{},st=D.annuaire_statut||'aucun',opte=!!D.annuaire;
  const exempt=!!((typeof MOI!=='undefined'&&MOI&&MOI.admin)||D.acces_gratuit),fin=D.annuaire_fin?new Date(D.annuaire_fin):null,paye=exempt||!!(fin&&fin>new Date());
  const vis=opte&&D.accepte_nouvelles!==false&&st==='approuve'&&paye;
  const btn=(t,cl)=>'<button class="btn'+(cl?' '+cl:'')+'" data-act="dgo" data-v="outils|annuaire" style="align-self:flex-start">'+t+'</button>';
  const dem=nbDem?'<div class="banner acc" style="margin:0"><div class="small"><b>'+nbDem+' demande'+(nbDem>1?'s':'')+' de famille'+(nbDem>1?'s':'')+'</b> à traiter : une famille souhaite vous rencontrer.</div></div>':'';
  let titre,txt,act,ton='';
  if(vis){titre='Vous êtes dans « Trouver ma doula » 🎉';txt='Les familles de votre région peuvent vous trouver et vous écrire. Vous choisissez toujours qui vous rencontrez. Votre courriel et votre téléphone ne sont jamais affichés.';act=btn('Voir mon profil','ghost sm');ton='ok'}
  else if(opte&&st==='approuve'&&!paye){titre='Dernière étape : activer mon inscription';txt='Votre profil est approuvé. Il ne reste que l\'inscription annuelle (25 $) pour apparaître auprès des familles.';act=btn('Activer mon inscription')}
  else if(opte&&st==='approuve'&&paye){titre='Vous n\'êtes pas visible pour l\'instant';txt='Vous avez indiqué que vous n\'acceptez pas de nouvelles familles. Réactivez l\'option quand vous êtes disponible.';act=btn('Changer ma disponibilité','ghost sm')}
  else if(opte&&st==='en_attente'){titre='Votre profil est en cours d\'approbation';txt='Sérénaissance le valide, puis vous serez visible. Vous pouvez le modifier en attendant.';act=btn('Voir mon profil','ghost sm');ton='ok'}
  else if(st==='refuse'){titre='Votre profil est à modifier';txt=D.annuaire_note?esc(D.annuaire_note):'Sérénaissance vous a laissé un message : ouvrez votre profil pour voir quoi corriger.';act=btn('Corriger mon profil')}
  else if(opte){titre='Terminez votre profil';txt='Remplissez votre profil et enregistrez-le : il sera envoyé pour approbation.';act=btn('Terminer mon profil')}
  else{titre='Soyez trouvée par les familles';txt='Inscrivez-vous au répertoire « Trouver ma doula » : les familles de votre région vous trouvent par ville, langue et disponibilités, puis vous envoient une demande. Seuls votre prénom, la première lettre de votre nom, votre photo et votre présentation sont affichés.';act=btn('M\'inscrire au répertoire')}
  return {vis,html:(dem?dem:'')+'<div class="ad-ann'+(ton?' '+ton:'')+'"><span class="eyebrow">Trouver ma doula</span><b class="ad-ann-t">'+titre+'</b><p class="small" style="margin:0">'+txt+'</p>'+act+'</div>'}}
function adLigne(ic,titre,sous,act,v,ton){return '<button class="cl" data-act="'+act+'"'+(v?' data-v="'+v+'"':'')+' style="box-shadow:none'+(ton?';border-color:var(--accent)':'')+'"><div class="av">'+icon(ic)+'</div><div style="flex:1;min-width:0;text-align:left"><b>'+titre+'</b><p class="xs muted">'+sous+'</p></div>'+icon('fa-chevron-right')+'</button>'}
dAccueil=function(){const D=S.doula,L=S.clients||[];const prenom=esc(String(D.nom||'').split(' ')[0]||'');
  const garde=L.filter(enGarde),pp=L.filter(c=>cStage(c).k==='pp'&&cStage(c).day<=42),pre=L.filter(c=>cStage(c).k==='preg'&&!enGarde(c)),ov=overlaps();
  const total=L.reduce((s,c)=>s+cPrice(c),0),paid=L.reduce((s,c)=>s+cPaid(c),0);
  const next=L.filter(c=>cStage(c).k==='preg').sort((a,b)=>parseD(a.dpa)-parseD(b.dpa)).slice(0,3);
  const rdvs=L.flatMap(c=>(c.rdv||[]).filter(r=>r.prochaine&&diffD(parseD(r.prochaine),new Date())>=0).map(r=>[c,r.prochaine])).sort((a,b)=>a[1].localeCompare(b[1])).slice(0,3);
  const nonlus=Object.values(NONLUS||{}).reduce((a,b)=>a+(+b||0),0),att=(v=>typeof v==='number'?v:0)((window._pvAtt||{}).n),susp=L.filter(c=>c.suivi_suspendu);
  adChargerAtt();
  const nbF=L.filter(c=>c.statut==='active'||c.statut==='invitee'||!c.statut).length;
  const proche=L.filter(c=>cStage(c).k==='preg'&&cStage(c).left>=0).sort((a,b)=>cStage(a).left-cStage(b).left)[0];
  const phrase=(nbF?'Vous accompagnez '+nbF+' famille'+(nbF>1?'s':'')+'.':'Votre espace est prêt : ajoutez votre première famille quand vous voulez.');
  let h='<div class="ad-hero"><div class="ad-av">'+avatar(D.photo,prenom||'S','avxl')+'</div><div class="ad-tx"><span class="script">'+adSalut()+' '+prenom+'</span><b class="ad-ent">'+esc(D.entreprise||'Votre espace doula')+'</b><p class="ad-ph">'+phrase+'</p><span class="xs">'+esc(adMot())+'</span></div></div>';
  adChargerDem();const nbDem=(window._adDem||{}).n||0,AN=adAnnuaire(nbDem);
  if(!AN.vis)h+=AN.html;
  /* aujourd'hui */
  const todo=[];
  if(garde.length)todo.push(adLigne('fa-phone','En garde : '+garde.map(c=>esc(cFirst(c))).join(', '),'Téléphone chargé, sac prêt','clientOpen" data-id="'+garde[0].id,'',1));
  if(nonlus)todo.push(adLigne('fa-comments',nonlus+' nouveau'+(nonlus>1?'x':'')+' message'+(nonlus>1?'s':''),'Répondez en direct','chatOuvrir','',1));
  if(nbDem)todo.push(adLigne('fa-envelope-open-text',nbDem+' demande'+(nbDem>1?'s':'')+' de famille'+(nbDem>1?'s':''),'Une famille souhaite vous rencontrer','dgo','outils|annuaire',1));
  if(att)todo.push(adLigne('fa-circle-check',att+' paiement'+(att>1?'s':'')+' à valider','Validez et envoyez le reçu','dgo','outils|paiements',1));
  if(susp.length)todo.push(adLigne('fa-pause','Suivi suspendu : '+susp.map(c=>esc(cFirst(c))).join(', '),'Paiement en retard','dgo','outils|paiements'));
  rdvs.slice(0,2).forEach(r=>todo.push(adLigne('fa-calendar-check','Rencontre avec '+esc(cName(r[0])),esc(fmtD(parseD(r[1]),{weekday:'long',day:'numeric',month:'long'})),'clientOpen" data-id="'+r[0].id,'')));
  h+='<div class="card"><span class="eyebrow acc">Aujourd\'hui</span>'+(todo.length?'<div class="stack" style="gap:8px">'+todo.join('')+'</div>':'<p class="small" style="margin:6px 0">Tout est calme pour l\'instant 🌿 Profitez-en pour vous reposer ou préparer votre prochaine rencontre.</p>')+'</div>';
  if(proche){const st=cStage(proche);h+='<div class="ad-feat"><span class="eyebrow">Prochaine naissance</span><div class="row" style="flex-wrap:nowrap;gap:14px;align-items:center">'+avatar((proche.parent_data||{}).photo,cFirst(proche),'avxl')+'<div style="min-width:0;flex:1"><b style="font-family:var(--f-display);font-size:1.2rem">'+esc(cName(proche))+'</b><p class="small" style="margin:2px 0">'+st.w+' semaines · prévue le '+fmtD(parseD(proche.dpa),{day:'numeric',month:'long'})+'</p><span class="pill '+(st.left<=14?'warn':'sage')+'">'+(st.left<=0?'Terme atteint':'Dans '+st.left+' jours')+'</span></div></div><button class="btn sm ghost" data-act="clientOpen" data-id="'+proche.id+'" style="align-self:flex-start">Ouvrir le dossier</button></div>'}
  if(ov.length)h+='<div class="banner gold">'+icon('fa-triangle-exclamation')+'<div class="small"><b>Dates prévues à moins de 2 semaines d\'écart :</b> '+ov.map(o=>esc(cName(o[0]))+' et '+esc(cName(o[1]))+' ('+o[2]+' j)').join(' · ')+'. Confirmez votre remplaçante.</div></div>';
  /* démarrage guidé quand c'est encore vide */
  const etapes=[['Compléter mon profil',!!(D.tel&&D.region),'params',''],['Entrer mes forfaits et mes prix',Object.keys(FORFAITS||{}).length>0,'params',''],['Mon logo, mes couleurs et mes documents',!!(((ME_DOULA||{}).modeles||{}).marque||{}).docs||!!(((ME_DOULA||{}).modeles||{}).marque||{}).logo,'dgo','outils|couleurs'],['Ajouter ma première famille',L.length>0,'clientNew',''],['Configurer mes paiements',!!(((ME_DOULA||{}).modeles||{}).paiement||{}).interac||!!(((ME_DOULA||{}).modeles||{}).paiement||{}).lienCarte||(typeof pvProprio==='function'&&pvProprio()),'dgo','outils|paiements'],['Paraître dans « Trouver ma doula »',!!(ME_DOULA&&ME_DOULA.annuaire),'dgo','outils|annuaire']];
  const fait=etapes.filter(e=>e[1]).length;
  if(fait<etapes.length)h+='<div class="card"><div class="row between"><span class="eyebrow acc">Pour bien démarrer</span><span class="pill acc">'+fait+'/'+etapes.length+'</span></div><div class="stack" style="gap:6px;margin-top:6px">'+etapes.map(e=>'<button class="cl" data-act="'+e[2]+'"'+(e[3]?' data-v="'+e[3]+'"':'')+' style="box-shadow:none;opacity:'+(e[1]?'.6':'1')+'"><div class="av">'+icon(e[1]?'fa-check':'fa-circle')+'</div><div style="flex:1;text-align:left"><b'+(e[1]?' style="text-decoration:line-through"':'')+'>'+e[0]+'</b></div>'+(e[1]?'':icon('fa-chevron-right'))+'</button>').join('')+'</div></div>';
  /* raccourcis */
  h+='<div class="tiles ad-tiles">'+[['fa-user-plus','Nouvelle famille','Ouvrir un dossier','clientNew','clientes|'],['fa-book-open','Guides et modèles','Documents pour les familles','dgo','outils|modeles'],['fa-calendar-days','Agenda','Mes rendez-vous','dgo','agenda|'],['fa-comments','Messages','Parler aux familles','chatOuvrir','']].map((t,i)=>'<button class="tile ad-t'+(i%4)+'" data-act="'+t[3]+'"'+(t[4]?' data-v="'+t[4]+'"':'')+'><span class="ti">'+icon(t[0])+'</span><b>'+t[1]+'</b><span>'+t[2]+'</span></button>').join('')+'</div>';
  /* cette semaine */
  const nbRdv7=L.reduce((n,c)=>n+(c.rdv||[]).filter(r=>{if(!r.prochaine)return false;const j=diffD(parseD(r.prochaine),new Date());return j>=0&&j<=7}).length,0),nbNaiss30=L.filter(c=>{const st=cStage(c);return st.k==='preg'&&st.left>=0&&st.left<=30}).length;
  const SEM=[['📅','Rencontres',nbRdv7,'#e6eefc','agenda|','dgo'],['💬','Messages',nonlus,'#fde8e0','','chatOuvrir'],['💳','À valider',att,'#fdf3d6','outils|paiements','dgo'],['👶','Naissances',nbNaiss30,'#e3f3e6','clientes|','dgo']];
  h+='<div class="ad-semw"><div class="ad-sem-h">Cette semaine <small>(naissances : 30 jours)</small></div><div class="ad-sem">'+SEM.map(x=>'<button class="ad-sem-t" data-act="'+x[5]+'"'+(x[4]?' data-v="'+x[4]+'"':'')+' style="background:'+x[3]+'"><span>'+x[0]+'</span><b>'+x[2]+'</b><small>'+x[1]+'</small></button>').join('')+'</div></div>';
  if(AN.vis)h+=AN.html;
  /* étape par étape : où en sont mes familles */
  if(L.length)h+=aeFrise(L);
  /* mes familles en un coup d'œil */
  h+='<div class="card"><span class="eyebrow acc">Mes familles en un coup d\'œil</span><div class="grid3"><div class="stat acc"><b>'+pre.length+'</b><span>en prénatal</span></div><div class="stat '+(garde.length?'warn':'')+'"><b>'+garde.length+'</b><span>en garde</span></div><div class="stat ok"><b>'+pp.length+'</b><span>en post-partum</span></div></div>'+
    (next.length?'<div class="list" style="margin-top:8px">'+next.map(c=>'<div class="li"><div class="ic">'+icon('fa-baby')+'</div><div class="tx"><b>'+esc(cName(c))+'</b><span>Prévu le '+fmtD(parseD(c.dpa),{day:'numeric',month:'long'})+' · garde dès le '+fmtS(addD(parseD(c.dpa),-(40-gardeSA().de)*7))+'</span></div></div>').join('')+'</div>':'<p class="small muted" style="margin-top:6px">Vos prochaines naissances prévues apparaîtront ici.</p>')+'</div>';
  h+='<div class="card" data-act="dgo" data-v="outils|paiements" style="cursor:pointer" role="button" tabindex="0"><div class="row between"><span class="eyebrow acc">Paiements</span><span class="xs muted">Voir les paiements '+icon('fa-chevron-right')+'</span></div><div class="grid3"><div class="stat"><b>'+money(total)+'</b><span>forfaits signés</span></div><div class="stat ok"><b>'+money(paid)+'</b><span>reçus</span></div><div class="stat '+(total-paid>0?'warn':'')+'"><b>'+money(total-paid)+'</b><span>solde à recevoir</span></div></div></div>';
  return h};

/* ---------- étape par étape : un bandeau qui défile, un toucher ouvre la liste des familles de l'étape ---------- */
function aeEtapes(L){const E=[
  {ico:'🤰',t:'Prénatal',s:'Avant '+gardeSA().de+' sem.',c:'#e3f3e6',f:c=>{const x=cStage(c);return x.k==='preg'&&x.w<gardeSA().de}},
  {ico:'🔔',t:'En garde',s:'Dès '+gardeSA().de+' sem.',c:'#fdf3d6',f:c=>{const x=cStage(c);return x.k==='preg'&&x.w>=gardeSA().de}},
  {ico:'🍼',t:'Post-partum',s:'0 à 6 sem.',c:'#fbe0e6',f:c=>{const x=cStage(c);return x.k==='pp'&&x.day<=42}},
  {ico:'🌿',t:'Suivi',s:'Après 6 sem.',c:'#e6eefc',f:c=>{const x=cStage(c);return x.k==='pp'&&x.day>42}}];
  E.forEach(e=>{e.l=L.filter(c=>{try{return e.f(c)}catch(x){return false}})});return E}
function aeFrise(L){const E=aeEtapes(L);
  return '<div class="ad-etw"><div class="row between"><span class="ad-sem-h">Étape par étape</span><span class="xs muted">Touchez une étape</span></div><div class="ad-strip">'+
   E.map((e,i)=>'<button class="ad-et'+(e.l.length?' on':'')+'" data-ae-st="'+i+'" style="background:'+e.c+'"><i>'+e.ico+'</i><b>'+esc(e.t)+'</b><small>'+esc(e.s)+'</small><em>'+e.l.length+'</em></button>').join('')+'</div></div>'}
function aeOuvrirEtape(i){try{const L=S.clients||[],e=aeEtapes(L)[i];if(!e)return;
  const lig=c=>{const x=cStage(c);const d=x.k==='preg'?'Semaine '+x.w+' · prévue le '+fmtD(parseD(c.dpa),{day:'numeric',month:'long'}):'Bébé de '+x.day+' jour'+(x.day>1?'s':'');
    return '<button class="cl" data-ae-open="'+esc(String(c.id))+'" style="box-shadow:none"><div class="av">'+avatar((c.parent_data||{}).photo,cFirst(c),'av')+'</div><div style="flex:1;text-align:left"><b>'+esc(cName(c))+'</b><div class="xs muted">'+d+'</div></div>'+icon('fa-chevron-right')+'</button>'};
  sheet(e.ico+' '+esc(e.t),e.l.length?'<div class="stack" style="gap:8px">'+e.l.map(lig).join('')+'</div>':'<p class="small muted">Aucune famille à cette étape pour l\'instant.</p>')}catch(x){}}
document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('[data-ae-st],[data-ae-open]');if(!t)return;
  if(t.dataset.aeSt!==undefined){aeOuvrirEtape(+t.dataset.aeSt);return}
  const id=t.dataset.aeOpen;try{close()}catch(e){}S.vue=null;S.openClient=id;S.dtab='clientes';S.ctab='resume';scrollTo(0,0);render();try{Promise.resolve(chargerClientDetail(id)).then(()=>render()).catch(()=>{})}catch(e){}});

const _stA=document.createElement('style');_stA.textContent=`
.ad-hero{display:flex;gap:16px;align-items:center;padding:22px 18px;border-radius:26px;background:linear-gradient(135deg,#f6d9cc 0%,#f8ecd6 55%,#dcebd9 100%);box-shadow:var(--shadow);border:1px solid var(--line)}
.ad-av .avxl{width:92px;height:92px;border:3px solid #fff;box-shadow:0 6px 16px rgba(44,34,30,.15);object-fit:cover;font-size:2.2rem}
.ad-tx{min-width:0;display:flex;flex-direction:column;gap:3px}.ad-tx .script{font-size:2.3rem;line-height:1.1;color:var(--accent-dk)}
.ad-ent{font-family:var(--f-display);font-size:1.12rem;color:var(--ink)}.ad-ph{margin:2px 0 4px;font-size:.95rem;color:var(--ink)}.ad-tx .xs{font-style:italic;color:var(--accent-dk)}
.ad-feat{padding:18px;border-radius:24px;background:linear-gradient(160deg,#fffbf8,#f7ece5);border:1px solid var(--accent-lt);box-shadow:var(--shadow);display:flex;flex-direction:column;gap:10px}.ad-feat .eyebrow{color:var(--accent)}
.ad-semw{display:grid;gap:8px}.ad-sem-h{font-family:var(--f-display);font-size:1.05rem;color:var(--ink)}.ad-sem-h small{font-family:inherit;font-size:.72rem;color:var(--muted,#8a7a72)}.ad-sem{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.ad-sem-t{border:1px solid var(--line);border-radius:18px;padding:10px 4px;display:grid;gap:2px;justify-items:center;cursor:pointer;color:#2c221e;box-shadow:none;min-width:0}.ad-sem-t span{font-size:1.2rem}.ad-sem-t b{font-size:1.35rem;line-height:1.1}.ad-sem-t small{font-size:.72rem}
.ad-etw{display:grid;gap:8px}.ad-strip{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 6px;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}.ad-et{flex:0 0 118px;scroll-snap-align:start;border:1px solid var(--line);border-radius:20px;padding:12px 8px;display:grid;gap:2px;justify-items:center;cursor:pointer;color:#2c221e;box-shadow:none;position:relative;opacity:.72}.ad-et.on{opacity:1;border-color:var(--accent)}.ad-et i{font-style:normal;font-size:1.5rem}.ad-et b{font-size:.95rem}.ad-et small{font-size:.72rem}.ad-et em{font-style:normal;font-weight:700;font-size:1.2rem;margin-top:2px}
.ad-ann{padding:18px;border-radius:24px;background:linear-gradient(160deg,#fff6ef,#f8ecd6);border:1px solid var(--accent-lt);box-shadow:var(--shadow);display:flex;flex-direction:column;gap:8px;color:#2c221e}.ad-ann.ok{background:linear-gradient(160deg,#f1f8ef,#fffbf8)}.ad-ann .eyebrow{color:var(--accent)}.ad-ann-t{font-family:var(--f-display);font-size:1.2rem}
.ad-tiles .tile{border:1px solid var(--line);box-shadow:none}.ad-tiles .ad-t0{background:var(--card)}.ad-tiles .ad-t1{background:var(--card)}.ad-tiles .ad-t2{background:linear-gradient(160deg,#f8ecd6,#fffbf8)}.ad-tiles .ad-t3{background:linear-gradient(160deg,#ecdfe6,#fffbf8)}
.ad-tiles .ti{background:#fff;box-shadow:0 4px 10px rgba(44,34,30,.08);width:46px;height:46px;font-size:1.15rem}.ad-t0 .ti{color:var(--accent)}.ad-t1 .ti{color:var(--sage-dk)}.ad-t2 .ti{color:var(--warn)}.ad-t3 .ti{color:#8a5a7a}`;document.head.appendChild(_stA);
