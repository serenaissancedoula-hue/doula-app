/* Sérénaissance — tableau de la propriétaire de l'appli : qui l'utilise (doulas, familles, activité).
   Elle reçoit aussi une notification quand une doula s'inscrit, quand une famille est ajoutée et quand une famille finalise son inscription. */
DSUB.proprio=function(){if(!MOI.admin)return '<p class="small">Réservé à la propriétaire de l\'appli.</p>';
  setTimeout(async()=>{const el=$('#statsProprio');if(!el)return;const {data:s,error}=await sb.rpc('fam_admin_stats');if(error||!s){el.innerHTML='<p class="small muted">Statistiques indisponibles : '+esc(error?error.message:'')+'</p>';return}
    const D=s.doulas||[],qd=d=>d?fmtD(new Date(d),{day:'numeric',month:'short'})+' à '+hm(new Date(d).getTime()):'jamais';
    el.innerHTML='<div class="grid3"><div class="stat acc"><b>'+D.filter(d=>d.finalisee&&!d.test).length+'</b><span>doulas inscrites</span></div><div class="stat"><b>'+s.familles_actives+' / '+s.familles+'</b><span>familles actives / inscrites</span></div><div class="stat ok"><b>'+s.parents_7j+'</b><span>parents connectés (7 jours)</span></div><div class="stat"><b>'+s.messages_7j+'</b><span>messages (7 jours)</span></div><div class="stat"><b>'+s.documents_signes+'</b><span>documents signés</span></div></div>'+
      '<span class="eyebrow acc">Les doulas</span><div class="list">'+D.map(d=>'<div class="li"><div class="ic">'+icon(d.finalisee?'fa-user-check':'fa-user-clock')+'</div><div class="tx"><b>'+esc(d.nom||d.courriel)+(d.entreprise?' · '+esc(d.entreprise):'')+(d.test?' <span class="pill">'+(String(d.courriel||'').toLowerCase()==='sc@academiesere.ca'?'propriétaire, non comptée':'compte test, non compté')+'</span>':'')+'</b><span>'+esc(d.courriel)+(d.region?' · '+esc(d.region):'')+'</span><span>'+d.familles+' famille'+(d.familles>1?'s':'')+' ('+d.actives+' active'+(d.actives>1?'s':'')+') · '+d.documents+' document'+(d.documents>1?'s':'')+' · '+d.rdv+' rendez-vous</span><span class="xs muted">Inscrite le '+fmtD(new Date(d.inscrite),{day:'numeric',month:'short',year:'numeric'})+' · dernière connexion : '+qd(d.derniere)+(d.actif?'':' · désactivée')+'</span></div></div>').join('')+'</div>'},0);
  return sh('Qui utilise l\'appli','Votre tableau de propriétaire. Vous recevez aussi une notification à chaque nouvelle doula et nouvelle famille.')+'<div class="card" id="statsProprio"><p class="small muted">Chargement…</p></div><button class="btn ghost" data-act="dsub" data-v="doulas">'+icon('fa-users-gear')+'Gérer et inviter des doulas</button>'};
if(!DOUT.find(x=>x[0]==='proprio'))DOUT.unshift(['proprio','fa-chart-simple','Qui utilise l\'appli (propriétaire)','Doulas, familles, activité']);
const _dOutP=dOutils;dOutils=function(){if(!S.dsub&&!(MOI&&MOI.admin)){const k=DOUT.findIndex(x=>x[0]==='proprio');if(k>=0)DOUT.splice(k,1)}return _dOutP()};
const _routeP=routeHash;routeHash=function(){if(location.hash==='#admin'&&S.role==='doula'&&MOI&&MOI.admin){S.dtab='outils';S.dsub='proprio';return}return _routeP()};
window.addEventListener('hashchange',()=>{if(!MOI||!S.role)return;routeHash();render()});

/* ---------- Messagerie doula ↔ propriétaire ---------- */
let SUPPORT=[],SUP_NONLUS=0;
async function chargerSupport(doulaId){const {data}=await sb.from('fam_support').select('*').eq('doula_id',doulaId).order('created_at');return data||[]}
function filSupport(L,admin){if(!L.length)return '<div class="card dash small muted" style="text-align:center">Aucun message pour l\'instant.</div>';
  return '<div class="card fil" id="fil">'+L.map(m=>{const moi=admin?m.de_admin:!m.de_admin;return '<div class="bulle '+(moi?'moi':'')+'"><div>'+esc(m.texte).replace(/\n/g,'<br>')+'</div><span class="xs">'+fmtS(new Date(m.created_at))+' · '+hm(new Date(m.created_at).getTime())+'</span></div>'}).join('')+'</div>'}
DSUB.support=function(){setTimeout(async()=>{if(!ME_DOULA)return;SUPPORT=await chargerSupport(ME_DOULA.id);const el=$('#supFil');if(el){el.innerHTML=filSupport(SUPPORT,false);const f=$('#fil');if(f)f.scrollTop=f.scrollHeight}
    if(SUPPORT.some(m=>m.de_admin&&!m.lu)){await sb.from('fam_support').update({lu:true}).eq('doula_id',ME_DOULA.id).eq('de_admin',true).eq('lu',false);SUP_NONLUS=0}},0);
  return sh('Écrire à Sérénaissance','Une question, un problème, une idée pour l\'appli ? Sabrina vous répond ici.')+'<div id="supFil"><p class="small muted">Chargement…</p></div><div class="card"><label class="f">Votre message<textarea id="supTxt" style="min-height:90px"></textarea></label><button class="btn" data-act="supEnvoyer">'+icon('fa-paper-plane')+'Envoyer</button><p class="xs muted">Sabrina reçoit une notification. Vous en recevez une quand elle répond.</p></div>'};
if(!DOUT.find(x=>x[0]==='support'))DOUT.splice(1,0,['support','fa-headset','Écrire à Sérénaissance','Questions, idées, problèmes']);
/* Pastille de messages non lus de Sabrina sur le tableau de bord de la doula */
const _cdSup=chargerDoula;chargerDoula=async function(){await _cdSup();try{const {count}=await sb.from('fam_support').select('id',{count:'exact',head:true}).eq('doula_id',ME_DOULA.id).eq('de_admin',true).eq('lu',false);SUP_NONLUS=count||0}catch(e){}};
const _dAccSup=dAccueil;dAccueil=function(){let h=_dAccSup();if(SUP_NONLUS&&!(MOI&&MOI.admin))h='<button class="cl" data-act="dgo" data-v="outils|support" style="border-color:var(--accent)"><div class="av">'+icon('fa-headset')+'</div><div style="flex:1;min-width:0"><b>'+SUP_NONLUS+' message'+(SUP_NONLUS>1?'s':'')+' de Sérénaissance</b><p class="xs muted">Réponse de Sabrina</p></div>'+icon('fa-chevron-right','var(--muted)')+'</button>'+h;return h};
/* Doula désactivée : accès suspendu */
const _renderSusp=render;render=function(){if(S.role==='doula'&&MOI&&MOI.doula&&MOI.doula.actif===false&&!MOI.admin&&S.dsub!=='support'){$('#tabs').innerHTML='';$('#app').innerHTML='<div class="card" style="max-width:480px;margin:0 auto"><span class="script">Bonjour</span><h2>Votre accès est suspendu</h2><p class="small">Votre Espace Doula a été mis en pause. Vos dossiers sont conservés.</p><button class="btn" data-act="dgo" data-v="outils|support">'+icon('fa-headset')+'Écrire à Sérénaissance</button><button class="btn sm ghost" data-act="deconnexion">Me déconnecter</button></div>'+pied();return}return _renderSusp()};

/* ---------- Côté propriétaire : conversations et gestion des doulas ---------- */
async function adminFil(doulaId,nom){const L=await chargerSupport(doulaId);
  sheet('Conversation avec '+esc(nom),filSupport(L,true)+'<label class="f">Répondre<textarea id="supAdminTxt" style="min-height:80px"></textarea></label><button class="btn" data-act="supRepondre" data-id="'+doulaId+'" data-v="'+esc(nom)+'">'+icon('fa-paper-plane')+'Envoyer</button>');
  const f=$('.sheet #fil');if(f)f.scrollTop=f.scrollHeight;
  if(L.some(m=>!m.de_admin&&!m.lu))await sb.from('fam_support').update({lu:true}).eq('doula_id',doulaId).eq('de_admin',false).eq('lu',false)}
const _proprio=DSUB.proprio;
DSUB.proprio=function(){const h=_proprio();if(!MOI||!MOI.admin)return h;
  setTimeout(async()=>{const {data:nl}=await sb.from('fam_support').select('doula_id').eq('de_admin',false).eq('lu',false);const cpt={};(nl||[]).forEach(x=>cpt[x.doula_id]=(cpt[x.doula_id]||0)+1);
    const tenter=()=>{const L=document.querySelectorAll('#statsProprio .li');if(!L.length)return setTimeout(tenter,250);
      sb.rpc('fam_admin_stats').then(({data:s})=>{if(!s)return;(s.doulas||[]).forEach((d,i)=>{const li=L[i];if(!li)return;const n=cpt[d.id]||0;
        li.insertAdjacentHTML('beforeend','<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px;width:100%"><button class="btn sm" data-act="supOuvrir" data-id="'+d.id+'" data-v="'+esc(d.nom||d.courriel)+'">'+icon('fa-comments')+(n?n+' nouveau'+(n>1?'x':''):'Messages')+'</button>'+(d.finalisee?'':'<button class="btn sm ghost" data-act="doulaInviter" data-id="'+d.id+'">Renvoyer l\'invitation</button>')+'<button class="btn sm ghost" data-act="doulaActif2" data-id="'+d.id+'" data-v="'+(d.actif?'0':'1')+'">'+(d.actif?'Suspendre l\'accès':'Réactiver')+'</button></div>');li.style.flexWrap='wrap'})})};tenter()},0);
  return h};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  try{
  if(a==='supEnvoyer'){const t=$('#supTxt').value.trim();if(!t)return;b.disabled=true;const {error}=await sb.from('fam_support').insert({doula_id:ME_DOULA.id,de_admin:false,texte:t});if(error){toast(error.message);b.disabled=false;return}toast('Message envoyé à Sabrina');render()}
  else if(a==='supOuvrir')await adminFil(b.dataset.id,b.dataset.v);
  else if(a==='supRepondre'){const t=$('#supAdminTxt').value.trim();if(!t)return;b.disabled=true;const {error}=await sb.from('fam_support').insert({doula_id:b.dataset.id,de_admin:true,texte:t});if(error){toast(error.message);b.disabled=false;return}toast('Réponse envoyée');await adminFil(b.dataset.id,b.dataset.v)}
  else if(a==='doulaActif2'){if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent=b.dataset.v==='0'?'Confirmer la suspension':'Confirmer';return}const {error}=await sb.rpc('fam_admin_doula_actif',{p_doula:b.dataset.id,p_actif:b.dataset.v==='1'});if(error){toast(error.message);return}toast(b.dataset.v==='1'?'Doula réactivée':'Accès suspendu');render()}
  }catch(err){console.error(err);toast('Une erreur est survenue')}});
const _routeSup=routeHash;routeHash=function(){if(location.hash==='#support'&&S.role==='doula'){S.dtab='outils';S.dsub='support';return}return _routeSup()};
const _dOutSup=dOutils;dOutils=function(){if(!S.dsub&&MOI&&MOI.admin){const k=DOUT.findIndex(x=>x[0]==='support');if(k>=0)DOUT.splice(k,1)}return _dOutSup()};
