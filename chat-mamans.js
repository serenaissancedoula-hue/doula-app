/* Sérénaissance — Cercle des mamans : discussions en direct entre mamans seulement (salons par thème + messages privés).
   Sécurité : charte à l'entrée, pseudo (jamais le courriel), signalement, blocage, suspension possible par la propriétaire.
   Les liens et les courriels sont refusés. Les papas n'y ont pas accès. */
(function(){
if(window.ESPACE!=='parent')return;
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const EMOJIS=['🌸','🌿','🌙','☀️','🦋','🍃','🌷','🕊️','⭐','🐚','🌻','🫶'];
const CM={uid:null,prof:null,profs:{},salons:[],bloques:new Set(),ch:null,inbox:null,msgs:[],cur:null,tab:'salons',ok:false,nonlus:{},ecrit:null};
const URLS={};
const $o=()=>document.getElementById('cm');
const peut=()=>!!(typeof FAM!=='undefined'&&FAM&&!window.PAPA&&S&&S.role==='parent');

/* ---------- carte d'entrée (accueil) ---------- */
function carte(){const n=Object.values(CM.nonlus||{}).reduce((a,b)=>a+(+b||0),0);return '<button class="card cm-entree" data-cm="ouvrir" style="width:100%;text-align:left;cursor:pointer;border:0;font:inherit"><span class="eyebrow acc">💬 Messages entre mamans'+(n?' <span class="cm-pastille">'+n+'</span>':'')+'</span><h2 class="papa-t" style="margin:2px 0 4px">Écrire à d\'autres mamans</h2><p class="small" style="margin:0">Comme Messenger, mais entre mamans seulement : discussions privées et salons en direct.</p></button>'}
const _pA=pAccueil;
pAccueil=function(){try{if(S.tab==='fil'&&!S.vue&&peut())return filHtml()}catch(e){}return _pA.apply(this,arguments)};
const _r=render;
function placer(){try{const app=document.getElementById('app');if(!app)return;const c=app.querySelector(':scope>.cm-entree');if(!c)return;
  let ref=[...app.querySelectorAll(':scope>.papa-b,:scope>.papa-rel,:scope>.papa-cs')].pop()||app.querySelector(':scope>.ab-top')||app.querySelector(':scope>.sh')||app.querySelector(':scope>.card.mot');if(ref)ref.after(c)}catch(e){}}
function onglet(){if(typeof PTABS2==='undefined')return;const i=PTABS2.findIndex(t=>t[0]==='fil');
  if(peut()){if(i<0){const k=PTABS2.findIndex(t=>t[0]==='madoula');PTABS2.splice(k>=0?k+1:PTABS2.length,0,['fil','fa-newspaper','Fil'])}}
  else{if(i>=0)PTABS2.splice(i,1);if(S.tab==='fil')S.tab='accueil'}}
let nlFait=false;
async function badge(){try{if(!peut()||$o())return;await moi();await majNonlus();majBadgeFil()}catch(e){}}
function majBadgeFil(){const n=Object.values(CM.nonlus||{}).reduce((a,b)=>a+(+b||0),0);const b=document.getElementById('flBadge');if(b){b.textContent=n||'';b.hidden=!n}document.querySelectorAll('#tabs button[data-v="fil"]').forEach(t=>{let s=t.querySelector('.badge');if(n){if(!s){s=document.createElement('span');s.className='badge';t.appendChild(s)}s.textContent=n}else if(s)s.remove()})}
render=function(){try{onglet()}catch(e){}const x=_r.apply(this,arguments);setTimeout(placer,30);try{if(S.tab==='fil'&&!S.vue&&peut())setTimeout(filInit,20)}catch(e){}if(!nlFait&&peut()){nlFait=true;setTimeout(badge,1500)}else setTimeout(majBadgeFil,60);return x};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')badge()});

/* ---------- données ---------- */
async function moi(){if(CM.uid)return;const {data:{session}}=await sb.auth.getSession();CM.uid=session&&session.user&&session.user.id}
async function profs(ids){const m=[...new Set(ids)].filter(i=>i&&!CM.profs[i]);if(!m.length)return;const {data}=await sb.from('chat_profils').select('user_id,pseudo,emoji,photo').in('user_id',m);(data||[]).forEach(p=>CM.profs[p.user_id]=p);await urlsProfils()}
async function urlsProfils(){const l=[...new Set(Object.values(CM.profs).map(p=>p&&p.photo).filter(x=>x&&!URLS[x]))];if(!l.length)return;try{const {data}=await sb.storage.from('chat-photos').createSignedUrls(l,3600);(data||[]).forEach(x=>{if(x.signedUrl)URLS[x.path]=x.signedUrl})}catch(e){}}
const avi=q=>{const pr=typeof q==='string'?CM.profs[q]:q;if(!pr)return '🌸';const u=pr.photo&&URLS[pr.photo];return u?'<img src="'+u+'" alt="">':E(pr.emoji||'🌸')}
const nom=id=>{const p=CM.profs[id];return p?(p.emoji||'🌸')+' '+E(p.pseudo):'🌸 Une maman'};
const heure=t=>new Date(t).toLocaleTimeString('fr-CA',{hour:'2-digit',minute:'2-digit'});
const jour=t=>new Date(t).toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long'});

/* ---------- ouverture ---------- */
async function ouvrir(apres){
  if(!peut())return;
  let o=$o();if(!o){o=document.createElement('div');o.id='cm';document.body.appendChild(o);document.body.classList.add('cm-ouvert')}
  o.innerHTML='<div class="cm-vide">Chargement…</div>';
  try{
    await moi();
    const {data:p}=await sb.from('chat_profils').select('*').eq('user_id',CM.uid).maybeSingle();CM.prof=p||null;CM.profLu=true;
    if(!p){vCharte();return}
    if(p.suspendu){vSuspendu();return}
    const [s,b]=await Promise.all([sb.from('chat_salons').select('*').eq('actif',true).order('ordre'),sb.from('chat_blocages').select('bloque')]);
    CM.salons=s.data||[];CM.bloques=new Set((b.data||[]).map(x=>x.bloque));CM.ok=true;
    CM.profs[CM.uid]=Object.assign({},p);await urlsProfils();
    await majNonlus();abonnerInbox();majBadgeFil();
    if(typeof apres==='function')await apres();else vAccueil();
  }catch(e){fermer();toast('Le cercle est indisponible pour le moment')}
}
function fermer(){CM.depuisFil=false;desabonner();if(CM.inbox){try{sb.removeChannel(CM.inbox)}catch(e){}CM.inbox=null}const o=$o();if(o)o.remove();document.body.classList.remove('cm-ouvert');CM.cur=null;CM.msgs=[];setTimeout(badge,300);if(S.tab==='fil'&&!S.vue){FIL.pret=false;try{render()}catch(e){}}}
function desabonner(){if(CM.ch){try{sb.removeChannel(CM.ch)}catch(e){}CM.ch=null}}

/* ---------- vues ---------- */
function entete(titre,retour,droite){return '<div class="cm-h">'+(retour?'<button class="cm-ic" data-cm="'+retour+'" aria-label="Retour">←</button>':'<span style="width:36px"></span>')+'<div class="cm-t">'+titre+'</div>'+(droite||'<button class="cm-ic" data-cm="fermer" aria-label="Fermer">✕</button>')+'</div>'}
function ageTxt(d){const x=new Date(String(d)+'T12:00');if(isNaN(x))return '';const j=Math.floor((Date.now()-x)/864e5);if(j<0)return '';if(j<56)return Math.max(1,Math.floor(j/7))+' semaine'+(Math.floor(j/7)>1?'s':'');const m=Math.floor(j/30.44);if(m<24)return m+' mois';const a=Math.floor(j/365.25);return a+' an'+(a>1?'s':'')}
function apropos(){const r={situation:'',enfants:[]};try{const g=typeof grossesseActive==='function'?grossesseActive():null;const n=(S.parent&&S.parent.naissance)||{};
  if(g)r.situation='Enceinte de '+g.w+' semaine'+(g.w>1?'s':'');
  if(n.date){const a=ageTxt(n.date);if(a){const nb=Math.max(1,Math.min(3,+n.nb||1));r.enfants.push((nb>1?(nb===2?'Jumeaux de ':'Triplés de '):'Bébé de ')+a)}}
  (S.parent.enfants||[]).forEach(e=>{if(e&&e.date){const a=ageTxt(e.date);if(a)r.enfants.push(a)}})}catch(e){}return r}
function champsProfil(p){p=p||{};return '<label class="f" style="margin-top:8px">Un petit mot sur vous (facultatif)<textarea id="cmBio" rows="2" maxlength="160" placeholder="Ex. : maman de 2, fan de café et de siestes">'+E(p.bio||'')+'</textarea></label><label class="check" style="margin-top:6px"><input type="checkbox" id="cmMontrer"'+(p.montrer_enfants===false?'':' checked')+'><span>Montrer l\'âge de mon bébé et de mes enfants sur mon profil (jamais leurs prénoms ni leurs dates de naissance).</span></label>'}
function chooserAv(p){
  const cur=p||{};const prev=CM.avPend?'<img src="'+CM.avPend.url+'" alt="">':avi(cur.user_id?cur:{emoji:cur.emoji||'🌸',photo:cur.photo});
  return '<div class="cm-avch"><span class="cm-av big" id="cmAvPrev">'+prev+'</span><div style="display:grid;gap:6px"><button type="button" class="btn sm ghost" data-cm="av-photo">📷 Utiliser ma photo</button><small class="muted">ou choisissez un emoji :</small></div><input type="file" id="cmAvFile" accept="image/*" hidden></div><div class="cm-em" id="cmEm">'+EMOJIS.map(e=>'<button type="button" class="cm-e'+((!CM.avPend&&!cur.photo&&(cur.emoji||'🌸')===e)?' on':'')+'" data-cm="emoji" data-e="'+e+'">'+e+'</button>').join('')+'</div>'}
async function avUpload(){if(!CM.avPend)return null;const chemin=CM.uid+'/avatar-'+Date.now()+'.jpg';const up=await sb.storage.from('chat-photos').upload(chemin,CM.avPend.blob,{contentType:'image/jpeg'});if(up.error)throw up.error;URLS[chemin]=CM.avPend.url;return chemin}
function vCharte(){CM.avPend=null;
  const pre=((S.parent&&S.parent.prenom)||'').trim().split(/\s+/)[0];
  $o().innerHTML=entete('Bienvenue dans le cercle','','<button class="cm-ic" data-cm="fermer" aria-label="Fermer">✕</button>')+'<div class="cm-c"><div class="cm-carte"><h2>🌸 Un espace de mamans, tout en douceur</h2><ul class="cm-ch">'+
   '<li>Ici, on se parle <b>avec bienveillance</b> : pas de jugement, chaque maman fait de son mieux.</li>'+
   '<li>Ce qui s\'écrit <b>ne remplace pas votre équipe de soins</b>. En cas d\'urgence : 911.</li>'+
   '<li>Pas de liens, de courriel, de téléphone ni de publicité.</li><li><b>Photos</b> : seulement les vôtres ou celles de votre bébé. Jamais d\'enfants ou de personnes qui ne sont pas à vous, ni de photos intimes.</li>'+
   '<li>Les salons peuvent être lus par toutes les mamans du cercle. Vous êtes vue par votre <b>pseudo</b> seulement, jamais par votre courriel.</li>'+
   '<li>Vous pouvez <b>signaler</b> un message ou <b>bloquer</b> une personne à tout moment. L\'équipe lit les signalements et peut suspendre l\'accès au cercle.</li></ul></div>'+
   '<div class="cm-carte"><label class="f">Votre pseudo (2 à 24 caractères)<input id="cmPseudo" maxlength="24" value="'+E(pre)+'" autocomplete="off"></label>'+chooserAv({emoji:'🌸'})+champsProfil({})+
   '<label class="check" style="margin-top:10px"><input type="checkbox" id="cmOk"><span>J\'ai lu la charte et je m\'engage à la respecter.</span></label><button class="btn" data-cm="creer" style="margin-top:10px">Entrer dans le cercle</button></div></div>';
}
function vProfil(){CM.avPend=null;const p=CM.prof||{};
  $o().innerHTML=entete('Mon profil','retourprof')+'<div class="cm-c"><div class="cm-carte"><label class="f">Votre pseudo<input id="cmPseudo" maxlength="24" value="'+E(p.pseudo||'')+'" autocomplete="off"></label><p class="small muted" style="margin:8px 0 0">Votre avatar : une photo de vous ou un emoji.</p>'+chooserAv(Object.assign({user_id:CM.uid},p))+champsProfil(p)+'<button class="btn" data-cm="profil-ok" style="margin-top:12px">Enregistrer</button></div></div>'}
async function vMaman(id,retour){
  const o=$o();if(!o)return;o.innerHTML=entete('Profil','retourprof')+'<div class="cm-c"><p class="small muted" style="text-align:center">Chargement…</p></div>';
  const [r,f]=await Promise.all([sb.from('chat_profils').select('*').eq('user_id',id).maybeSingle(),sb.rpc('feed_charger_de',{p_auteur:id,p_limite:20})]);
  const q=r.data;if(!q){o.innerHTML=entete('Profil','retourprof')+'<div class="cm-c"><div class="cm-carte"><p>Ce profil n\'est pas disponible.</p></div></div>';return}
  CM.profs[id]=Object.assign({},CM.profs[id],q);await urlsProfils();
  const L=Array.isArray(f.data)?f.data:[];await urlsFil(L);
  const moiP=id===CM.uid;
  o.innerHTML=entete('Profil','retourprof')+'<div class="cm-c"><div class="cm-carte cm-pf"><span class="cm-av big2">'+avi(id)+'</span><h2>'+E(q.pseudo)+'</h2>'+(q.montrer_enfants&&(q.situation||(q.enfants||[]).length)?'<div class="cm-chips">'+(q.situation?'<span>🤰 '+E(q.situation)+'</span>':'')+(q.enfants||[]).map(x=>'<span>👶 '+E(x)+'</span>').join('')+'</div>':'')+(q.bio?'<p class="small" style="margin:10px 0 0">'+lisible(q.bio)+'</p>':'')+
    (moiP?'<button class="btn sm" data-cm="profil" style="margin-top:12px">Modifier mon profil</button>':'<button class="btn" data-cm="prive" data-u="'+id+'" style="margin-top:12px">✉️ Écrire un message</button><button class="btn sm ghost" data-cm="bloquer" data-u="'+id+'" style="margin-top:8px">⛔ Bloquer</button>')+'</div>'+
    '<h3 style="margin:14px 4px 4px">Ses publications</h3>'+(L.length?L.map(x=>'<div class="card fl-p"><small class="muted">'+quand(x.created_at)+'</small>'+(x.texte?'<p class="fl-tx">'+lisible(x.texte.length>600?x.texte.slice(0,600)+'…':x.texte)+'</p>':'')+mediaHtml(x)+'<div class="fl-st"><span>'+(x.aimes>0?'❤️ '+x.aimes:'')+'</span><span>'+(x.coms>0?x.coms+' commentaire'+(x.coms>1?'s':''):'')+'</span></div></div>').join(''):'<p class="small muted" style="margin:0 4px">Pas encore de publication.</p>')+'</div>';
}
async function voirProfil(id){CM.pileCur=$o()&&CM.cur?{type:CM.cur.type,id:CM.cur.id,autre:CM.cur.autre}:null;
  if($o()){CM.depuisFil=false;await vMaman(id);return}
  CM.depuisFil=true;await ouvrir(()=>vMaman(id))}
function vSuspendu(){$o().innerHTML=entete('Cercle des mamans','','<button class="cm-ic" data-cm="fermer" aria-label="Fermer">✕</button>')+'<div class="cm-c"><div class="cm-carte"><h2>Accès en pause</h2><p>Votre accès au cercle est suspendu pour le moment. Vous gardez tout le reste de votre appli.</p><p class="small muted">Pour en parler avec douceur : <a href="mailto:sc@academiesere.ca">sc@academiesere.ca</a></p></div></div>'}
function vAccueil(){
  CM.cur=null;desabonner();
  const o=$o();
  const tot=Object.values(CM.nonlus).reduce((a,b)=>a+(+b||0),0);
  o.innerHTML=entete('Cercle des mamans','','<button class="cm-ic" data-cm="profil" aria-label="Mon profil">👤</button><button class="cm-ic" data-cm="nouveau" aria-label="Nouveau message">✏️</button><button class="cm-ic" data-cm="fermer" aria-label="Fermer">✕</button>')+'<div class="cm-tabs"><button class="'+(CM.tab==='salons'?'on':'')+'" data-cm="tab" data-v="salons">Salons</button><button class="'+(CM.tab==='prives'?'on':'')+'" data-cm="tab" data-v="prives">Messages'+(tot?' <span class="cm-pastille">'+tot+'</span>':'')+'</button></div><div class="cm-c" id="cmListe"></div>';
  if(CM.tab==='salons')lSalons();else lPrives();
}
function lSalons(){
  $o().querySelector('#cmListe').innerHTML=CM.salons.map(s=>'<button class="cm-li" data-cm="salon" data-id="'+E(s.id)+'"><span class="cm-av">'+E(s.emoji||'💬')+'</span><span class="cm-tx"><b>'+E(s.titre)+'</b><small>'+E(s.description||'')+'</small></span></button>').join('')+'<p class="xs muted" style="text-align:center;margin:14px 0">Bienveillance, respect, aucune publicité. 🌿</p>';
}
function quand(t){const d=new Date(t),n=new Date();if(d.toDateString()===n.toDateString())return heure(t);if(n-d<6*864e5)return d.toLocaleDateString('fr-CA',{weekday:'short'});return d.toLocaleDateString('fr-CA',{day:'numeric',month:'short'})}
async function majNonlus(){try{const {data}=await sb.rpc('chat_nonlus');CM.nonlus=(data&&typeof data==='object')?data:{}}catch(e){CM.nonlus={}}}
async function lireConv(id){try{await sb.rpc('chat_marquer_lu',{p_conv:id});delete CM.nonlus[id]}catch(e){}}
async function lPrives(){
  const box=$o().querySelector('#cmListe');box.innerHTML='<p class="small muted" style="text-align:center">Chargement…</p>';
  const {data:cs}=await sb.from('chat_convs').select('*');const L=cs||[];
  const autres=L.map(c=>({c,o:c.a===CM.uid?c.b:c.a}));await profs(autres.map(x=>x.o));
  let der={};if(L.length){const {data:ms}=await sb.from('chat_messages').select('conv_id,texte,created_at,auteur').in('conv_id',L.map(c=>c.id)).order('created_at',{ascending:false}).limit(100);(ms||[]).forEach(m=>{if(!der[m.conv_id])der[m.conv_id]=m})}
  const vis=autres.filter(x=>!CM.bloques.has(x.o)&&der[x.c.id]).sort((a,b)=>new Date(der[b.c.id].created_at)-new Date(der[a.c.id].created_at));
  if(!$o()||CM.tab!=='prives')return;
  box.innerHTML=(vis.length?vis.map(x=>{const m=der[x.c.id],n=+CM.nonlus[x.c.id]||0;return '<button class="cm-li'+(n?' nonlu':'')+'" data-cm="conv" data-id="'+x.c.id+'" data-o="'+x.o+'"><span class="cm-av">'+avi(x.o)+'</span><span class="cm-tx"><b>'+E((CM.profs[x.o]||{}).pseudo||'Une maman')+'</b><small>'+(m.auteur===CM.uid?'Vous : ':'')+(m.texte==='📷'?'📷 Photo':E(m.texte.slice(0,60)))+'</small></span><span class="cm-dr"><span>'+quand(m.created_at)+'</span>'+(n?'<i class="cm-pastille">'+n+'</i>':'')+'</span></button>'}).join(''):'<div class="cm-carte" style="text-align:center"><div style="font-size:2.2rem">💌</div><h2>Aucune discussion pour l\'instant</h2><p class="small muted">Touchez ✏️ en haut pour écrire à une maman, ou passez par les salons pour rencontrer d\'autres mamans.</p><button class="btn" data-cm="nouveau">Écrire à une maman</button></div>')
   +(CM.bloques.size?'<button class="btn sm ghost" data-cm="bloques" style="margin:12px auto;display:block">Personnes bloquées ('+CM.bloques.size+')</button>':'');
}
let TOUS=null;
async function vNouveau(){
  $o().innerHTML=entete('Nouveau message','retourpriv')+'<div class="cm-rech"><input id="cmRech" placeholder="Chercher une maman par pseudo…" autocomplete="off" aria-label="Chercher une maman"></div><div class="cm-c" id="cmRes"><p class="small muted" style="text-align:center">Chargement…</p></div>';
  if(!TOUS){const {data}=await sb.from('chat_profils').select('user_id,pseudo,emoji,photo,suspendu').order('pseudo').limit(500);TOUS=(data||[]).filter(x=>x.user_id!==CM.uid&&!x.suspendu);TOUS.forEach(x=>CM.profs[x.user_id]=x);await urlsProfils()}
  filtrerRes('');const i=document.getElementById('cmRech');if(i)i.focus();
}
function filtrerRes(q){
  const r=document.getElementById('cmRes');if(!r)return;q=q.trim().toLowerCase();
  const L=(TOUS||[]).filter(x=>!CM.bloques.has(x.user_id)&&(!q||x.pseudo.toLowerCase().includes(q))).slice(0,60);
  r.innerHTML=L.length?L.map(x=>'<button class="cm-li" data-cm="prive" data-u="'+x.user_id+'"><span class="cm-av">'+avi(x)+'</span><span class="cm-tx"><b>'+E(x.pseudo)+'</b><small>Envoyer un message</small></span></button>').join(''):'<p class="small muted" style="text-align:center;margin-top:20px">'+(TOUS&&TOUS.length?'Aucune maman avec ce pseudo.':'Personne d\'autre dans le cercle pour l\'instant : invitez vos amies mamans, ou dites bonjour dans un salon 💗')+'</p>';
}
function abonnerInbox(){
  if(CM.inbox)return;
  try{CM.inbox=sb.channel('cm-inbox').on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_messages'},async p=>{
    const m=p.new;if(!m||!m.conv_id||m.auteur===CM.uid||CM.bloques.has(m.auteur))return;
    if(CM.cur&&CM.cur.type==='conv'&&CM.cur.id===m.conv_id){lireConv(m.conv_id);return}
    CM.nonlus[m.conv_id]=(+CM.nonlus[m.conv_id]||0)+1;
    if($o()&&!CM.cur){await profs([m.auteur]);vAccueil()}}).subscribe()}catch(e){}
}
async function vBloques(){
  await profs([...CM.bloques]);
  $o().innerHTML=entete('Personnes bloquées','retourpriv')+'<div class="cm-c">'+[...CM.bloques].map(i=>'<div class="cm-li"><span class="cm-av">'+avi(i)+'</span><span class="cm-tx"><b>'+E((CM.profs[i]||{}).pseudo||'Une maman')+'</b></span><button class="btn sm ghost" data-cm="debloquer" data-id="'+i+'">Débloquer</button></div>').join('')+'</div>';
}

/* ---------- fil de discussion ---------- */
async function ouvrirFil(type,id,autre){
  CM.cur={type,id,autre:autre||null};CM.msgs=[];desabonner();
  const salon=type==='salon'?CM.salons.find(s=>s.id===id):null;
  await profs(autre?[autre]:[]);
  const titre=salon?E((salon.emoji||'')+' '+salon.titre):nom(autre);
  $o().innerHTML=entete(titre,type==='salon'?'retoursal':'retourpriv')+'<div class="cm-fil" id="cmFil"><p class="small muted" style="text-align:center">Chargement…</p></div><div class="cm-ecrit" id="cmEcrit" hidden></div><div class="cm-menu" id="cmMenu" hidden></div>'+
   (salon&&salon.id==='deuil'?'<p class="cm-note">Un lieu tendre : prenez soin de vous et des autres. Si c\'est trop lourd, écrivez-nous.</p>':'')+
   '<div class="cm-pend" id="cmPend" hidden></div><form class="cm-bar" id="cmForm"><label class="cm-cam" aria-label="Ajouter une photo">📷<input type="file" id="cmFile" accept="image/*" hidden></label><textarea id="cmTxt" rows="1" maxlength="1000" placeholder="Écrire un message…" aria-label="Message"></textarea><button class="cm-send" type="submit" aria-label="Envoyer">➤</button></form>';
  const col=type==='salon'?'salon_id':'conv_id';
  const {data,error}=await sb.from('chat_messages').select('*').eq(col,id).order('created_at',{ascending:false}).limit(60);
  if(error){toast('Impossible de charger les messages');return}
  CM.msgs=(data||[]).reverse().filter(m=>!CM.bloques.has(m.auteur));await profs(CM.msgs.map(m=>m.auteur));dessiner(true);
  if(type==='conv')lireConv(id);
  CM.ch=sb.channel('cm-'+id,{config:{broadcast:{self:false}}}).on('broadcast',{event:'ecrit'},()=>{const e=document.getElementById('cmEcrit');if(!e)return;e.hidden=false;e.textContent=((CM.profs[CM.cur&&CM.cur.autre]||{}).pseudo||'Elle')+' écrit…';clearTimeout(CM.ecrit);CM.ecrit=setTimeout(()=>{e.hidden=true},3000)}).on('postgres_changes',{event:'*',schema:'public',table:'chat_messages',filter:col+'=eq.'+id},async p=>{
    const m=p.new;if(!m||!m.id)return;
    if(m.masque){CM.msgs=CM.msgs.filter(x=>x.id!==m.id);dessiner(false);return}
    if(p.eventType!=='INSERT'||CM.msgs.some(x=>x.id===m.id)||CM.bloques.has(m.auteur))return;
    await profs([m.auteur]);CM.msgs.push(m);const e=document.getElementById('cmEcrit');if(e)e.hidden=true;dessiner(true);if(type==='conv'&&m.auteur!==CM.uid)lireConv(id)}).subscribe();
  if(CM.cur)CM.cur.canal=CM.ch;
}
function dessiner(bas){
  const f=document.getElementById('cmFil');if(!f)return;
  const pres=f.scrollHeight-f.scrollTop-f.clientHeight<140;let j='',h='';
  if(!CM.msgs.length)h='<div class="cm-carte" style="margin:auto"><p style="text-align:center">C\'est calme ici pour l\'instant. Soyez la première à dire bonjour 💗</p></div>';
  CM.msgs.forEach((m,i)=>{const d=jour(m.created_at);if(d!==j){j=d;h+='<div class="cm-j">'+E(d)+'</div>'}
    const moi=m.auteur===CM.uid,prev=CM.msgs[i-1],suite=prev&&prev.auteur===m.auteur&&jour(prev.created_at)===d;
    h+='<div class="cm-m'+(moi?' moi':'')+(suite?' suite':'')+(!moi&&CM.cur.type==='conv'?' conv':'')+'">'+(!moi&&!suite&&CM.cur.type==='salon'?'<div class="cm-n" data-cm="voir" data-u="'+m.auteur+'" style="cursor:pointer">'+nom(m.auteur)+'</div>':'')+'<button class="cm-b'+(m.photo?' ph':'')+'" data-cm="msg" data-id="'+m.id+'">'+(m.photo?'<img data-p="'+E(m.photo)+'" data-cm="photo" alt="Photo" '+(URLS[m.photo]?'src="'+URLS[m.photo]+'"':'')+'>':'')+(m.photo&&m.texte==='📷'?'':E(m.texte).replace(/\n/g,'<br>'))+'</button><span class="cm-hr">'+heure(m.created_at)+'</span></div>'});
  f.innerHTML=h;if(bas||pres)f.scrollTop=f.scrollHeight;chargerUrls().then(()=>{if(bas||pres)f.scrollTop=f.scrollHeight});
}
function refuse(t){if(/https?:|www\.|\.(com|ca|fr|net|org)\b/i.test(t))return 'Les liens ne sont pas permis dans le cercle.';if(/[^\s@]+@[^\s@]+\.[^\s@]+/.test(t))return 'Les courriels ne sont pas permis dans le cercle.';if(/(\d[\s.\-()]*){9,}/.test(t))return 'Les numéros de téléphone ne sont pas permis dans le cercle.';return ''}
async function envoyer(){
  const a=document.getElementById('cmTxt');const t=(a.value||'').trim();if(!CM.cur||(!t&&!CM.pend))return;
  const r=t?refuse(t):'';if(r){toast(r);return}
  const row={auteur:CM.uid,texte:t||'📷'};if(CM.cur.type==='salon')row.salon_id=CM.cur.id;else row.conv_id=CM.cur.id;
  const pend=CM.pend;
  if(pend){const chemin=CM.uid+'/'+(crypto.randomUUID?crypto.randomUUID():Date.now()+''+Math.random().toString(36).slice(2))+'.jpg';
    document.getElementById('cmPend').textContent='Envoi de la photo…';
    const up=await sb.storage.from('chat-photos').upload(chemin,pend.blob,{contentType:'image/jpeg'});
    if(up.error){toast('Photo non envoyée');vPend();return}row.photo=chemin;URLS[chemin]=pend.url}
  a.value='';a.style.height='auto';CM.pend=null;vPend();
  const {data,error}=await sb.from('chat_messages').insert(row).select('*').single();
  if(error){a.value=t;toast(/Doucement/.test(error.message)?'Doucement : un petit instant avant le prochain message.':'Message non envoyé');return}
  if(!CM.msgs.some(x=>x.id===data.id)){CM.msgs.push(data);dessiner(true)}
}
function vPend(){const e=document.getElementById('cmPend');if(!e)return;if(!CM.pend){e.hidden=true;e.innerHTML='';return}e.hidden=false;e.innerHTML='<img src="'+CM.pend.url+'" alt="Photo à envoyer"><button type="button" data-cm="pend-x" aria-label="Retirer la photo">✕</button>'}
async function choisirPhoto(f){
  if(!f||!/^image\//.test(f.type)){toast('Choisissez une image');return}
  try{const d=await shrinkTo(f,1280);const b=await (await fetch(d)).blob();CM.pend={blob:b,url:d};vPend()}catch(e){toast('Photo illisible')}
}
async function chargerUrls(){
  const manque=[...new Set(CM.msgs.filter(m=>m.photo&&!URLS[m.photo]).map(m=>m.photo))];
  if(manque.length){const {data}=await sb.storage.from('chat-photos').createSignedUrls(manque,3600);(data||[]).forEach(x=>{if(x.signedUrl)URLS[x.path]=x.signedUrl})}
  document.querySelectorAll('#cmFil img[data-p]').forEach(i=>{const u=URLS[i.dataset.p];if(u&&i.getAttribute('src')!==u)i.src=u})
}
/* ---------- menu d'un message : écrire en privé, signaler, bloquer ---------- */
function menuMsg(id){
  const m=CM.msgs.find(x=>x.id===id);if(!m)return;const mn=document.getElementById('cmMenu');if(!mn)return;
  const moi=m.auteur===CM.uid;
  mn.innerHTML='<div class="cm-mi"><p class="small muted" style="margin:0 0 8px">'+(moi?'Votre message':nom(m.auteur))+'</p>'+
   (moi?'<button data-cm="retirer" data-id="'+id+'">Retirer mon message</button>':
    '<button data-cm="voir" data-u="'+m.auteur+'">👤 Voir son profil</button>'+(CM.cur.type==='salon'?'<button data-cm="prive" data-u="'+m.auteur+'">💌 Écrire en privé</button>':'')+
    '<button data-cm="signaler" data-id="'+id+'">🚩 Signaler</button><button data-cm="bloquer" data-u="'+m.auteur+'">⛔ Bloquer cette maman</button>')+
   '<button data-cm="menu-x">Annuler</button></div>';mn.hidden=false;
}
function menuSignal(id){
  const mn=document.getElementById('cmMenu');
  mn.innerHTML='<div class="cm-mi"><p class="small muted" style="margin:0 0 8px">Pourquoi signaler ?</p>'+['Propos irrespectueux ou blessants','Information qui peut être dangereuse','Publicité, lien ou coordonnées','Autre'].map(x=>'<button data-cm="signal-ok" data-id="'+id+'" data-m="'+E(x)+'">'+E(x)+'</button>').join('')+'<button data-cm="menu-x">Annuler</button></div>';
}

/* ---------- clics ---------- */
document.addEventListener('click',async e=>{
  const b=e.target.closest&&e.target.closest('[data-cm]');
  if(!b){const mn=document.getElementById('cmMenu');if(mn&&!mn.hidden&&!e.target.closest('#cmMenu'))mn.hidden=true;return}
  e.preventDefault();e.stopPropagation();const a=b.dataset.cm;
  try{
    if(a==='voir')await voirProfil(b.dataset.u);
    else if(a==='retourprof'){if(CM.depuisFil)fermer();else if(CM.pileCur){const c=CM.pileCur;CM.pileCur=null;await ouvrirFil(c.type,c.id,c.autre)}else vAccueil()}
    else if(a==='ouvrir-salons'){CM.tab='salons';await ouvrir()}
    else if(a==='ouvrir-msgs'){CM.tab='prives';await ouvrir()}
    else if(a==='profil-fil'){CM.depuisFil=true;await ouvrir(()=>vProfil())}
    else if(a.startsWith('fl-'))await flAct(a,b);
    else if(a==='ouvrir')await ouvrir();
    else if(a==='fermer')fermer();
    else if(a==='emoji'){CM.avPend=null;CM.avGarde=false;document.querySelectorAll('#cmEm .cm-e').forEach(x=>x.classList.toggle('on',x===b));const pv=document.getElementById('cmAvPrev');if(pv)pv.textContent=b.dataset.e}
    else if(a==='av-photo'){const f=document.getElementById('cmAvFile');if(f)f.click()}
    else if(a==='creer'){
      const ps=((document.getElementById('cmPseudo')||{}).value||'').trim(),em=(document.querySelector('#cmEm .cm-e.on')||{}).dataset;
      if(ps.length<2||ps.length>24){toast('Choisissez un pseudo de 2 à 24 caractères');return}
      if(refuse(ps)){toast('Le pseudo ne peut pas contenir de lien ni de courriel');return}
      if(!document.getElementById('cmOk').checked){toast('Cochez la charte pour continuer');return}
      let ph=null;try{ph=await avUpload()}catch(x){toast('Photo non enregistrée');return}
      const mt=!!(document.getElementById('cmMontrer')||{}).checked,ap=apropos();const {error}=await sb.from('chat_profils').insert({user_id:CM.uid,pseudo:ps,emoji:em?em.e:'🌸',photo:ph,bio:((document.getElementById('cmBio')||{}).value||'').trim().slice(0,160)||null,montrer_enfants:mt,situation:mt?ap.situation:'',enfants:mt?ap.enfants:[],charte_le:new Date().toISOString()});
      if(error){toast('Pseudo non enregistré');return}
      CM.avPend=null;await ouvrir()}
    else if(a==='profil')vProfil();
    else if(a==='profil-ok'){
      const ps=((document.getElementById('cmPseudo')||{}).value||'').trim(),em=(document.querySelector('#cmEm .cm-e.on')||{}).dataset;
      if(ps.length<2||ps.length>24){toast('Choisissez un pseudo de 2 à 24 caractères');return}
      if(refuse(ps)){toast('Le pseudo ne peut pas contenir de lien ni de courriel');return}
      let ph=CM.prof.photo||null;if(CM.avPend){try{ph=await avUpload()}catch(x){toast('Photo non enregistrée');return}}else if(em)ph=null;
      const mt=!!(document.getElementById('cmMontrer')||{}).checked,ap=apropos();const upd={pseudo:ps,emoji:em?em.e:(CM.prof.emoji||'🌸'),photo:ph,bio:((document.getElementById('cmBio')||{}).value||'').trim().slice(0,160)||null,montrer_enfants:mt,situation:mt?ap.situation:'',enfants:mt?ap.enfants:[]};
      const {error}=await sb.from('chat_profils').update(upd).eq('user_id',CM.uid);if(error){toast('Profil non enregistré');return}
      Object.assign(CM.prof,upd);CM.profs[CM.uid]=Object.assign({},CM.profs[CM.uid],CM.prof);CM.avPend=null;toast('Profil enregistré 💗');if(CM.depuisFil){fermer();if(S.tab==='fil')FIL.pret=false}else vAccueil()}
    else if(a==='tab'){CM.tab=b.dataset.v;vAccueil()}
    else if(a==='nouveau')await vNouveau();
    else if(a==='salon')await ouvrirFil('salon',b.dataset.id);
    else if(a==='conv')await ouvrirFil('conv',b.dataset.id,b.dataset.o);
    else if(a==='retoursal'){CM.tab='salons';vAccueil()}
    else if(a==='retourpriv'){CM.tab='prives';vAccueil()}
    else if(a==='bloques')await vBloques();
    else if(a==='photo'){const u=URLS[b.dataset.p];if(u){const v=document.createElement('div');v.className='cm-vue';v.innerHTML='<img src="'+u+'" alt="Photo"><button aria-label="Fermer">✕</button>';v.onclick=()=>v.remove();$o().appendChild(v)}}
    else if(a==='pend-x'){CM.pend=null;vPend()}
    else if(a==='msg')menuMsg(b.dataset.id);
    else if(a==='menu-x'){document.getElementById('cmMenu').hidden=true}
    else if(a==='retirer'){await sb.rpc('chat_retirer_message',{p_message:b.dataset.id});CM.msgs=CM.msgs.filter(x=>x.id!==b.dataset.id);document.getElementById('cmMenu').hidden=true;dessiner(false)}
    else if(a==='prive'){const {data,error}=await sb.rpc('chat_ouvrir_conv',{p_autre:b.dataset.u});if(error){toast('Conversation impossible');return}await ouvrirFil('conv',data,b.dataset.u)}
    else if(a==='signaler')menuSignal(b.dataset.id);
    else if(a==='signal-ok'){const {error}=await sb.rpc('chat_signaler',{p_message:b.dataset.id,p_motif:b.dataset.m});document.getElementById('cmMenu').hidden=true;toast(error?'Signalement non envoyé':'Merci. L\'équipe va lire ce message 💗')}
    else if(a==='bloquer'){if(!confirm('Bloquer cette maman ? Vous ne verrez plus ses messages et elle ne pourra plus vous écrire.'))return;
      const {error}=await sb.from('chat_blocages').insert({bloqueur:CM.uid,bloque:b.dataset.u});if(error){toast('Blocage impossible');return}
      CM.bloques.add(b.dataset.u);CM.msgs=CM.msgs.filter(x=>!CM.bloques.has(x.auteur));{const mn=document.getElementById('cmMenu');if(mn)mn.hidden=true}
      if(CM.cur&&CM.cur.type==='conv'){CM.tab='prives';vAccueil()}else if(CM.cur&&CM.cur.type==='salon')dessiner(false);else if(CM.depuisFil)fermer();else vAccueil();toast('Maman bloquée')}
    else if(a==='debloquer'){const {error}=await sb.from('chat_blocages').delete().eq('bloqueur',CM.uid).eq('bloque',b.dataset.id);if(error){toast('Déblocage impossible');return}CM.bloques.delete(b.dataset.id);CM.tab='prives';vAccueil()}
  }catch(err){toast('Une erreur est survenue')}
},true);
document.addEventListener('change',async e=>{if(e.target&&e.target.id==='cmAvFile'){const f=e.target.files&&e.target.files[0];e.target.value='';if(!f||!/^image\//.test(f.type)){toast('Choisissez une image');return}try{const d=await shrinkTo(f,420);const b=await (await fetch(d)).blob();CM.avPend={blob:b,url:d};const pv=document.getElementById('cmAvPrev');if(pv)pv.innerHTML='<img src="'+d+'" alt="">';document.querySelectorAll('#cmEm .cm-e').forEach(x=>x.classList.remove('on'))}catch(x){toast('Photo illisible')}return}if(e.target&&e.target.id==='cmFile'){choisirPhoto(e.target.files&&e.target.files[0]);e.target.value=''}},true);
document.addEventListener('submit',e=>{if(e.target&&e.target.id==='cmForm'){e.preventDefault();envoyer()}},true);
document.addEventListener('keydown',e=>{if(e.target&&e.target.id==='cmTxt'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();envoyer()}},true);
document.addEventListener('input',e=>{if(e.target&&e.target.id==='cmRech'){filtrerRes(e.target.value);return}if(e.target&&e.target.id==='cmTxt'&&CM.cur&&CM.cur.type==='conv'&&CM.cur.canal&&Date.now()-(CM.cur.tt||0)>2000){CM.cur.tt=Date.now();try{CM.cur.canal.send({type:'broadcast',event:'ecrit',payload:{u:CM.uid}})}catch(x){}}if(e.target&&e.target.id==='cmTxt'){e.target.style.height='auto';e.target.style.height=Math.min(120,e.target.scrollHeight)+'px'}},true);


/* =====================  FIL D'ACTUALITÉ  ===================== */
const FIL={etendu:{},posts:[],coms:{},ouv:null,fin:false,ch:null,pret:false,nouveau:0,brouillon:''};FIL.pend=[];
const mediasDe=x=>Array.isArray(x.medias)&&x.medias.length?x.medias:(x.photo?[{p:x.photo,t:'image'}]:[]);
const estVideo=m=>m&&(m.t==='video'||/\.(mp4|mov|webm)$/i.test(m.p||''));
function mediaHtml(x){const L=mediasDe(x).slice(0,4);if(!L.length)return '';return '<div class="fl-md n'+L.length+'">'+L.map(m=>estVideo(m)?'<video class="fl-vid" data-p="'+E(m.p)+'" controls playsinline preload="metadata" '+(URLS[m.p]?'src="'+URLS[m.p]+'"':'')+'></video>':'<img class="fl-img" data-p="'+E(m.p)+'" data-cm="fl-photo" alt="Photo" '+(URLS[m.p]?'src="'+URLS[m.p]+'"':'')+'>').join('')+'</div>'}
const lisible=t=>E(t).replace(/\n/g,'<br>');
function filHtml(){return sh('Fil des mamans','Partagez, encouragez, échangez, entre mamans seulement')+'<div class="fl-nav"><button class="on">📰 Fil</button><button data-cm="ouvrir-salons">💬 Salons</button><button data-cm="ouvrir-msgs">✉️ Messages <i class="cm-pastille" id="flBadge" hidden></i></button><button data-cm="profil-fil">👤 Mon profil</button></div><div id="filBox"></div>'}
async function profilMoi(){await moi();if(CM.profLu)return;const {data}=await sb.from('chat_profils').select('*').eq('user_id',CM.uid).maybeSingle();CM.prof=data||null;CM.profLu=true;if(data){CM.profs[CM.uid]=Object.assign({},data);await urlsProfils();majApropos()}}
async function majApropos(){try{const d=CM.prof;if(!d||!d.montrer_enfants)return;const ap=apropos();if(ap.situation===(d.situation||'')&&JSON.stringify(ap.enfants)===JSON.stringify(d.enfants||[]))return;const {error}=await sb.from('chat_profils').update({situation:ap.situation,enfants:ap.enfants}).eq('user_id',CM.uid);if(!error){d.situation=ap.situation;d.enfants=ap.enfants}}catch(e){}}
function carteRejoindre(){return '<div class="card"><span class="eyebrow acc">🌸 Le cercle des mamans</span><h2 class="papa-t">Rejoignez les autres mamans</h2><p class="small">Un fil doux pour partager, s\'encourager et poser vos questions, et des messages privés entre mamans. Vous choisissez un pseudo et une photo ou un emoji. Votre courriel n\'est jamais montré.</p><button class="btn" data-cm="ouvrir">Rejoindre le cercle</button></div>'}
async function filInit(){
  const box=document.getElementById('filBox');if(!box||!peut())return;
  box.innerHTML='<p class="small muted" style="text-align:center">Chargement…</p>';
  try{await profilMoi()}catch(e){box.innerHTML='<div class="card"><p class="small">Le fil est indisponible pour le moment.</p></div>';return}
  if(!CM.prof){box.innerHTML=carteRejoindre();return}
  if(CM.prof.suspendu){box.innerHTML='<div class="card"><h2>Accès en pause</h2><p class="small">Votre accès au cercle est suspendu pour le moment. Pour en parler avec douceur : <a href="mailto:sc@academiesere.ca">sc@academiesere.ca</a></p></div>';return}
  box.innerHTML='<div id="filCompo"></div><div id="filNew"></div><div id="filListe"></div><div id="filPlus"></div>';
  filCompo();await filCharger(true);abonnerFil();
}
function filCompo(){
  const c=document.getElementById('filCompo');if(!c)return;
  c.innerHTML='<div class="card fl-compo"><div class="fl-h"><button class="cm-av" data-cm="voir" data-u="'+CM.uid+'">'+avi(CM.uid)+'</button><textarea id="flTxt" rows="2" maxlength="6000" placeholder="Quoi de neuf, '+E((CM.prof||{}).pseudo||'')+' ?">'+E(FIL.brouillon)+'</textarea></div><div id="flPrev"></div><div class="fl-ac" style="justify-content:space-between"><label class="fl-btn">📷 Photos / vidéo<input type="file" id="flFile" accept="image/*,video/*" multiple hidden></label><button class="btn sm" data-cm="fl-pub">Publier</button></div></div>';
  flPrev();
}
function flPrev(){const e=document.getElementById('flPrev');if(!e)return;e.innerHTML=FIL.pend.length?'<div class="fl-pv">'+FIL.pend.map((m,i)=>'<div class="fl-pi">'+(m.t==='video'?'<video src="'+m.url+'" muted playsinline preload="metadata"></video><span class="fl-play">▶</span>':'<img src="'+m.url+'" alt="Aperçu">')+'<button type="button" data-cm="fl-pend-x" data-i="'+i+'" aria-label="Retirer">✕</button></div>').join('')+'</div>':''}
async function urlsFil(L){
  const m=[...new Set(L.flatMap(x=>mediasDe(x).map(y=>y.p)).filter(x=>x&&!URLS[x]))];
  if(m.length){try{const {data}=await sb.storage.from('chat-photos').createSignedUrls(m,3600);(data||[]).forEach(x=>{if(x.signedUrl)URLS[x.path]=x.signedUrl})}catch(e){}}
}
async function filCharger(reset){
  const avant=reset||!FIL.posts.length?null:FIL.posts[FIL.posts.length-1].created_at;
  const {data,error}=await sb.rpc('feed_charger',{p_avant:avant,p_limite:15});
  if(error){const l=document.getElementById('filListe');if(l)l.innerHTML='<p class="small muted" style="text-align:center">Impossible de charger le fil.</p>';return}
  const L=Array.isArray(data)?data:[];
  if(reset){FIL.posts=L;FIL.nouveau=0;FIL.coms={}}else FIL.posts=FIL.posts.concat(L.filter(x=>!FIL.posts.some(y=>y.id===x.id)));
  FIL.fin=L.length<15;
  await profs(L.map(x=>x.auteur));await urlsFil(L);FIL.pret=true;filDessiner();
}
function filDessiner(){
  const l=document.getElementById('filListe');if(!l)return;
  const n=document.getElementById('filNew');if(n)n.innerHTML=FIL.nouveau?'<button class="fl-nouv" data-cm="fl-nouv">↑ '+FIL.nouveau+' nouvelle'+(FIL.nouveau>1?'s':'')+' publication'+(FIL.nouveau>1?'s':'')+'</button>':'';
  l.innerHTML=FIL.posts.length?FIL.posts.map(postHtml).join(''):'<div class="card" style="text-align:center"><div style="font-size:2.2rem">🌿</div><h2>Le fil est encore calme</h2><p class="small muted">Soyez la première à partager quelque chose de doux ou à poser une question.</p></div>';
  const pl=document.getElementById('filPlus');if(pl)pl.innerHTML=(!FIL.fin&&FIL.posts.length)?'<button class="btn sm ghost" data-cm="fl-plus" style="margin:10px auto;display:block">Voir plus</button>':'';
  chargerPhotos();
}
function chargerPhotos(){document.querySelectorAll('#filListe img[data-p],#filListe video[data-p]').forEach(i=>{const u=URLS[i.dataset.p];if(u&&i.getAttribute('src')!==u)i.src=u})}
function postHtml(x){
  const moiP=x.auteur===CM.uid,ouv=FIL.ouv===x.id;
  return '<article class="card fl-p" data-id="'+x.id+'"><div class="fl-h"><button class="cm-av" data-cm="voir" data-u="'+x.auteur+'">'+avi(x.auteur)+'</button><div class="fl-who"><b data-cm="voir" data-u="'+x.auteur+'" style="cursor:pointer">'+E((CM.profs[x.auteur]||{}).pseudo||'Une maman')+'</b><small>'+quand(x.created_at)+'</small></div><button class="fl-mn" data-cm="fl-menu" data-t="post" data-id="'+x.id+'" data-u="'+x.auteur+'" aria-label="Options">⋯</button></div>'+
   (x.texte?(x.texte.length>420&&!FIL.etendu[x.id]?'<p class="fl-tx">'+lisible(x.texte.slice(0,420))+'… <button class="fl-lien" data-cm="fl-lire" data-id="'+x.id+'">Lire la suite</button></p>':'<p class="fl-tx">'+lisible(x.texte)+'</p>'):'')+mediaHtml(x)+
   '<div class="fl-st"><span>'+(x.aimes>0?'❤️ '+x.aimes:'')+'</span><span>'+(x.coms>0?x.coms+' commentaire'+(x.coms>1?'s':''):'')+'</span></div>'+
   '<div class="fl-ac"><button class="fl-btn'+(x.moi_aime?' on':'')+'" data-cm="fl-aime" data-id="'+x.id+'">'+(x.moi_aime?'❤️':'🤍')+' J\'aime</button><button class="fl-btn" data-cm="fl-com" data-id="'+x.id+'">💬 Commenter</button></div>'+
   (ouv?comsHtml(x.id):'')+'</article>';
}
function comsHtml(id){
  const L=FIL.coms[id];
  return '<div class="fl-cs">'+(L?L.map(c=>'<div class="fl-c"><button class="cm-av sm" data-cm="voir" data-u="'+c.auteur+'">'+avi(c.auteur)+'</button><div class="fl-cb"><div class="fl-cm"><b data-cm="voir" data-u="'+c.auteur+'" style="cursor:pointer">'+E((CM.profs[c.auteur]||{}).pseudo||'Une maman')+'</b><br>'+lisible(c.texte)+'</div><small>'+quand(c.created_at)+' · <button class="fl-lien" data-cm="fl-menu" data-t="com" data-id="'+c.id+'" data-u="'+c.auteur+'">Options</button></small></div></div>').join(''):'<p class="small muted">Chargement…</p>')+
   '<form class="fl-cf" data-id="'+id+'"><input class="fl-ci" id="flc-'+id+'" maxlength="600" placeholder="Écrire un commentaire…" autocomplete="off"><button class="cm-send" type="submit" aria-label="Envoyer" style="width:38px;height:38px">➤</button></form></div>';
}
async function chargerComs(id){
  const {data}=await sb.from('feed_commentaires').select('*').eq('post_id',id).order('created_at').limit(150);
  FIL.coms[id]=data||[];await profs(FIL.coms[id].map(c=>c.auteur));filDessiner();
}
function abonnerFil(){
  if(FIL.ch)return;
  try{FIL.ch=sb.channel('cm-fil').on('postgres_changes',{event:'INSERT',schema:'public',table:'feed_posts'},p=>{const m=p.new;if(m&&m.auteur!==CM.uid&&!CM.bloques.has(m.auteur)){clearTimeout(FIL.tt);FIL.tt=setTimeout(()=>{if(document.getElementById('filListe'))filCharger(true)},600)}})
   .on('postgres_changes',{event:'*',schema:'public',table:'feed_aimes'},p=>{const r=p.eventType==='DELETE'?p.old:p.new;if(!r||r.user_id===CM.uid)return;const x=FIL.posts.find(y=>y.id===r.post_id);if(!x)return;x.aimes=Math.max(0,(+x.aimes||0)+(p.eventType==='DELETE'?-1:1));if(document.getElementById('filListe'))filDessiner()})
   .on('postgres_changes',{event:'INSERT',schema:'public',table:'feed_commentaires'},p=>{const m=p.new;if(!m||m.auteur===CM.uid)return;const x=FIL.posts.find(y=>y.id===m.post_id);if(!x)return;x.coms=(+x.coms||0)+1;if(FIL.ouv===m.post_id)chargerComs(m.post_id);else filDessiner()}).subscribe()}catch(e){}
}
async function filPublier(){
  const a=document.getElementById('flTxt');const t=(a.value||'').trim();if(!t&&!FIL.pend.length){toast('Écrivez quelque chose ou ajoutez une photo');return}
  const r=t?refuse(t):'';if(r){toast(r);return}
  const btn=document.querySelector('[data-cm="fl-pub"]');if(btn){if(btn.disabled)return;btn.disabled=true}
  const row={auteur:CM.uid,texte:t},medias=[];
  try{
    for(let i=0;i<FIL.pend.length;i++){const m=FIL.pend[i];if(btn)btn.textContent='Envoi '+(i+1)+'/'+FIL.pend.length+'…';
      const chemin=CM.uid+'/'+(crypto.randomUUID?crypto.randomUUID():Date.now()+''+Math.random().toString(36).slice(2))+'.'+(m.ext||'jpg');
      const up=await sb.storage.from('chat-photos').upload(chemin,m.blob,{contentType:m.mime||'image/jpeg'});if(up.error)throw up.error;
      medias.push({p:chemin,t:m.t});URLS[chemin]=m.url}
    if(medias.length){row.medias=medias;row.photo=(medias.find(x=>x.t==='image')||medias[0]).p}
    const {data,error}=await sb.from('feed_posts').insert(row).select('*').single();
    if(error)throw error;
    FIL.brouillon='';FIL.pend=[];a.value='';flPrev();
    FIL.posts.unshift(Object.assign({aimes:0,moi_aime:false,coms:0},data));filDessiner();toast('Publié 💗');
  }catch(e){toast(/Doucement/.test(String(e&&e.message))?'Doucement : un petit instant avant la prochaine publication.':'Publication non envoyée. Vérifiez votre connexion et la taille des fichiers.')}
  if(btn){btn.disabled=false;btn.textContent='Publier'}
}
function filMenu(t,id,u){
  const o=document.getElementById('flMenu');if(o)o.remove();
  const d=document.createElement('div');d.id='flMenu';d.className='fl-sheet';
  const moiP=u===CM.uid;
  d.innerHTML='<div class="cm-mi"><p class="small muted" style="margin:0 0 8px">'+(moiP?'Votre '+(t==='post'?'publication':'commentaire'):E((CM.profs[u]||{}).pseudo||'Une maman'))+'</p>'+
   (moiP?'<button data-cm="fl-retirer" data-t="'+t+'" data-id="'+id+'">Retirer</button>':'<button data-cm="fl-signaler" data-t="'+t+'" data-id="'+id+'">🚩 Signaler</button><button data-cm="voir" data-u="'+u+'">👤 Voir son profil</button><button data-cm="fl-bloquer" data-u="'+u+'">⛔ Bloquer cette maman</button><button data-cm="fl-ecrire" data-u="'+u+'">💌 Lui écrire en privé</button>')+'<button data-cm="fl-menu-x">Annuler</button></div>';
  document.body.appendChild(d);
}
function filSignal(t,id){
  const d=document.getElementById('flMenu');if(!d)return;
  d.innerHTML='<div class="cm-mi"><p class="small muted" style="margin:0 0 8px">Pourquoi signaler ?</p>'+['Propos irrespectueux ou blessants','Information qui peut être dangereuse','Publicité, lien ou coordonnées','Photo inappropriée','Autre'].map(x=>'<button data-cm="fl-signal-ok" data-t="'+t+'" data-id="'+id+'" data-m="'+E(x)+'">'+E(x)+'</button>').join('')+'<button data-cm="fl-menu-x">Annuler</button></div>';
}
async function flAct(a,b){
  const fermerMenu=()=>{const m=document.getElementById('flMenu');if(m)m.remove()};
  if(a==='fl-pub')await filPublier();
  else if(a==='fl-pend-x'){FIL.pend.splice(+b.dataset.i,1);flPrev()}
  else if(a==='fl-lire'){FIL.etendu[b.dataset.id]=true;filDessiner()}
  else if(a==='fl-nouv'){await filCharger(true)}
  else if(a==='fl-plus'){await filCharger(false)}
  else if(a==='fl-photo'){const u=URLS[b.dataset.p];if(u){const v=document.createElement('div');v.className='fl-vue';v.innerHTML='<img src="'+u+'" alt="Photo"><button aria-label="Fermer">✕</button>';v.onclick=()=>v.remove();document.body.appendChild(v)}}
  else if(a==='fl-aime'){const x=FIL.posts.find(y=>y.id===b.dataset.id);if(!x)return;const avant=x.moi_aime;x.moi_aime=!avant;x.aimes=Math.max(0,(+x.aimes||0)+(avant?-1:1));filDessiner();
    const r=avant?await sb.from('feed_aimes').delete().eq('post_id',x.id).eq('user_id',CM.uid):await sb.from('feed_aimes').insert({post_id:x.id,user_id:CM.uid});
    if(r.error&&!/duplicate/.test(r.error.message||'')){x.moi_aime=avant;x.aimes=Math.max(0,(+x.aimes||0)+(avant?1:-1));filDessiner()}}
  else if(a==='fl-com'){const id=b.dataset.id;if(FIL.ouv===id){FIL.ouv=null;filDessiner();return}FIL.ouv=id;filDessiner();await chargerComs(id);const i=document.getElementById('flc-'+id);if(i)i.focus()}
  else if(a==='fl-menu')filMenu(b.dataset.t,b.dataset.id,b.dataset.u);
  else if(a==='fl-menu-x')fermerMenu();
  else if(a==='fl-retirer'){await sb.rpc('feed_retirer',{p_type:b.dataset.t,p_id:b.dataset.id});fermerMenu();if(b.dataset.t==='post')FIL.posts=FIL.posts.filter(x=>x.id!==b.dataset.id);else if(FIL.ouv){FIL.coms[FIL.ouv]=(FIL.coms[FIL.ouv]||[]).filter(c=>c.id!==b.dataset.id);const x=FIL.posts.find(y=>y.id===FIL.ouv);if(x)x.coms=Math.max(0,x.coms-1)}filDessiner();toast('Retiré')}
  else if(a==='fl-signaler')filSignal(b.dataset.t,b.dataset.id);
  else if(a==='fl-signal-ok'){const {error}=await sb.rpc('feed_signaler',{p_type:b.dataset.t==='post'?'post':'com',p_id:b.dataset.id,p_motif:b.dataset.m});fermerMenu();toast(error?'Signalement non envoyé':'Merci. L\'équipe va lire ceci 💗')}
  else if(a==='fl-bloquer'){if(!confirm('Bloquer cette maman ? Vous ne verrez plus ses publications ni ses messages, et elle ne verra plus les vôtres.'))return;
    const {error}=await sb.from('chat_blocages').insert({bloqueur:CM.uid,bloque:b.dataset.u});if(error){toast('Blocage impossible');return}
    CM.bloques.add(b.dataset.u);FIL.posts=FIL.posts.filter(x=>x.auteur!==b.dataset.u);Object.keys(FIL.coms).forEach(k=>FIL.coms[k]=FIL.coms[k].filter(c=>c.auteur!==b.dataset.u));fermerMenu();filDessiner();toast('Maman bloquée')}
  else if(a==='fl-ecrire'){fermerMenu();const {data,error}=await sb.rpc('chat_ouvrir_conv',{p_autre:b.dataset.u});if(error){toast('Conversation impossible');return}await ouvrir();await ouvrirFil('conv',data,b.dataset.u)}
}
document.addEventListener('input',e=>{if(e.target&&e.target.id==='flTxt')FIL.brouillon=e.target.value},true);
document.addEventListener('change',async e=>{if(!(e.target&&e.target.id==='flFile'))return;const fs=[...(e.target.files||[])];e.target.value='';
  for(const f of fs){
    if(FIL.pend.length>=4){toast('4 éléments au maximum par publication');break}
    try{
      if(/^image\//.test(f.type)){const d=await shrinkTo(f,1280);const b=await (await fetch(d)).blob();FIL.pend.push({blob:b,url:d,t:'image',ext:'jpg',mime:'image/jpeg'})}
      else if(/^video\//.test(f.type)){
        if(FIL.pend.some(x=>x.t==='video')){toast('Une seule vidéo par publication');continue}
        if(f.size>45*1048576){toast('Cette vidéo est trop lourde (45 Mo au maximum). Filmez-en une plus courte.');continue}
        const url=URL.createObjectURL(f);const dur=await new Promise(res=>{const v=document.createElement('video');v.preload='metadata';v.onloadedmetadata=()=>res(v.duration);v.onerror=()=>res(0);v.src=url});
        if(dur>75){toast('Vidéo de 75 secondes au maximum');URL.revokeObjectURL(url);continue}
        const ext=/webm/.test(f.type)?'webm':/quicktime/.test(f.type)?'mov':'mp4';FIL.pend.push({blob:f,url,t:'video',ext,mime:f.type||'video/mp4'})}
      else toast('Choisissez une photo ou une vidéo')
    }catch(x){toast('Fichier illisible')}
  }
  flPrev()},true);
document.addEventListener('submit',async e=>{const f=e.target;if(!f||!f.classList||!f.classList.contains('fl-cf'))return;e.preventDefault();
  const id=f.dataset.id,i=document.getElementById('flc-'+id),t=(i.value||'').trim();if(!t)return;const r=refuse(t);if(r){toast(r);return}
  const {data,error}=await sb.from('feed_commentaires').insert({post_id:id,auteur:CM.uid,texte:t}).select('*').single();
  if(error){toast(/Doucement/.test(error.message)?'Doucement : un petit instant avant le prochain commentaire.':'Commentaire non envoyé');return}
  i.value='';(FIL.coms[id]=FIL.coms[id]||[]).push(data);const x=FIL.posts.find(y=>y.id===id);if(x)x.coms=(+x.coms||0)+1;filDessiner();const ni=document.getElementById('flc-'+id);if(ni)ni.focus()},true);
document.addEventListener('click',e=>{const m=document.getElementById('flMenu');if(m&&!e.target.closest('#flMenu')&&!e.target.closest('[data-cm="fl-menu"]'))m.remove()},true);

/* ---------- style ---------- */
const st=document.createElement('style');
st.textContent='#cm{position:fixed;inset:0;z-index:8000;background:var(--bg,#faf5ef);display:flex;flex-direction:column;color:var(--ink,#2c221e)}body.cm-ouvert{overflow:hidden}'+
'.cm-h{display:flex;align-items:center;gap:8px;padding:calc(10px + env(safe-area-inset-top)) 12px 10px;border-bottom:1px solid var(--line,#e6d9d0);background:var(--card,#fffbf8)}.cm-t{flex:1;text-align:center;font:700 1rem var(--f-display,Georgia,serif)}.cm-ic{width:36px;height:36px;border-radius:50%;border:0;background:rgba(0,0,0,.05);font-size:1.05rem;cursor:pointer;color:inherit}'+
'.cm-tabs{display:flex;gap:6px;padding:8px 12px;background:var(--card,#fffbf8)}.cm-tabs button{flex:1;border:0;border-radius:999px;padding:9px;font:600 .85rem inherit;background:rgba(0,0,0,.05);color:inherit;cursor:pointer}.cm-tabs button.on{background:var(--accent,#a85743);color:#fff}'+
'.cm-c{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:8px}.cm-vide{margin:auto;color:#7a685e}.cm-carte{background:var(--card,#fffbf8);border:1px solid var(--line,#e6d9d0);border-radius:18px;padding:16px}.cm-carte h2{margin:0 0 8px;font-size:1.1rem}.cm-ch{margin:0;padding-left:18px;display:grid;gap:8px;font-size:.9rem}'+
'.cm-li{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1px solid var(--line,#e6d9d0);background:var(--card,#fffbf8);border-radius:18px;padding:12px;font:inherit;color:inherit;cursor:pointer}.cm-av{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#fdf0e6,#fbe6ec);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex:none}.cm-tx{display:grid;gap:2px;min-width:0;flex:1}.cm-tx small{color:#7a685e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.cm-em{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.cm-e{width:42px;height:42px;border-radius:50%;border:2px solid transparent;background:rgba(0,0,0,.05);font-size:1.3rem;cursor:pointer}.cm-e.on{border-color:var(--accent,#a85743);background:#fff}'+
'.cm-pastille{display:inline-block;min-width:20px;padding:1px 6px;border-radius:999px;background:#d1495b;color:#fff;font:700 .72rem inherit;text-align:center;font-style:normal}.cm-dr{display:grid;gap:4px;justify-items:end;font-size:.72rem;color:#9a8a80;flex:none}.cm-li.nonlu b{font-weight:800}.cm-li.nonlu .cm-tx small{color:inherit;font-weight:600}.cm-rech{padding:8px 12px;background:var(--card,#fffbf8)}.cm-rech input{width:100%;border:1px solid var(--line,#e6d9d0);border-radius:999px;padding:11px 16px;font:inherit;background:var(--bg,#faf5ef);color:inherit}.cm-ecrit{padding:2px 16px 6px;font-size:.78rem;color:#7a685e;font-style:italic}.cm-ecrit[hidden]{display:none}'+
'.cm-cam{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.25rem;cursor:pointer;flex:none;background:rgba(0,0,0,.05)}.cm-pend{padding:8px 12px 0;display:flex;gap:8px;align-items:center;background:var(--card,#fffbf8)}.cm-pend[hidden]{display:none}.cm-pend img{height:64px;border-radius:12px}.cm-pend button{border:0;background:rgba(0,0,0,.08);border-radius:50%;width:28px;height:28px;cursor:pointer}.cm-b.ph{padding:4px}.cm-b.ph img{display:block;max-width:230px;max-height:300px;border-radius:16px;min-width:120px;min-height:80px;background:rgba(0,0,0,.06)}.cm-b.ph:not(:has(img+*)) {padding:4px}.cm-vue{position:absolute;inset:0;z-index:5;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center}.cm-vue img{max-width:100%;max-height:100%}.cm-vue button{position:absolute;top:calc(12px + env(safe-area-inset-top));right:12px;width:40px;height:40px;border-radius:50%;border:0;font-size:1.1rem}'+
'.cm-av.big2{width:84px;height:84px;font-size:2.6rem;margin:0 auto}.cm-pf{text-align:center}.cm-pf h2{margin:8px 0 4px}.cm-chips{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:6px}.cm-chips span{background:rgba(168,87,67,.1);color:var(--accent,#a85743);border-radius:999px;padding:5px 11px;font-size:.82rem;font-weight:600}button.cm-av{border:0;cursor:pointer;padding:0;font:inherit;flex:none}.fl-nav{display:flex;gap:6px;overflow-x:auto;padding:2px 0 10px}.fl-nav button{flex:none;border:1px solid var(--line,#e6d9d0);background:var(--card,#fffbf8);color:inherit;border-radius:999px;padding:8px 13px;font:600 .82rem inherit;cursor:pointer}.fl-nav button.on{background:var(--accent,#a85743);border-color:var(--accent,#a85743);color:#fff}'+
'.fl-md{display:grid;gap:3px;margin:8px 0;border-radius:14px;overflow:hidden}.fl-md.n2{grid-template-columns:1fr 1fr}.fl-md.n3{grid-template-columns:1fr 1fr}.fl-md.n3>:first-child{grid-column:1/3}.fl-md.n4{grid-template-columns:1fr 1fr}.fl-md .fl-img{margin:0;border-radius:0;height:100%;max-height:340px;min-height:120px}.fl-md.n1 .fl-img{max-height:460px}.fl-vid{width:100%;max-height:460px;background:#000;display:block}.fl-pv{display:flex;gap:8px;flex-wrap:wrap;padding:0 0 8px}.fl-pi{position:relative;width:84px;height:84px;border-radius:12px;overflow:hidden;background:rgba(0,0,0,.08)}.fl-pi img,.fl-pi video{width:100%;height:100%;object-fit:cover}.fl-pi button{position:absolute;top:3px;right:3px;width:24px;height:24px;border-radius:50%;border:0;background:rgba(0,0,0,.6);color:#fff;cursor:pointer}.fl-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.4rem;text-shadow:0 1px 4px rgba(0,0,0,.6);pointer-events:none}'+
'.fl-p,.fl-compo{padding:14px}.fl-h{display:flex;gap:10px;align-items:flex-start}.fl-who{flex:1;display:grid;gap:1px}.fl-who small{color:#7a685e}.fl-mn{border:0;background:transparent;font-size:1.3rem;cursor:pointer;color:inherit;padding:0 6px}.fl-tx{margin:10px 0 6px;font-size:.98rem;line-height:1.5;word-break:break-word}.fl-img{display:block;width:100%;max-height:420px;object-fit:cover;border-radius:14px;margin:8px 0;background:rgba(0,0,0,.06);min-height:120px;cursor:pointer}.fl-st{display:flex;justify-content:space-between;font-size:.8rem;color:#7a685e;padding:4px 2px;min-height:22px}.fl-ac{display:flex;gap:6px;border-top:1px solid var(--line,#e6d9d0);padding-top:6px}.fl-btn{flex:1;border:0;background:transparent;border-radius:12px;padding:9px;font:600 .85rem inherit;color:inherit;cursor:pointer;text-align:center}.fl-btn.on{color:#d1495b}.fl-btn:active{background:rgba(0,0,0,.05)}.fl-compo textarea{flex:1;border:0;background:var(--bg,#faf5ef);border-radius:16px;padding:10px 12px;font:inherit;color:inherit;resize:none}.fl-nouv{display:block;margin:0 auto 10px;border:0;border-radius:999px;padding:9px 16px;background:var(--accent,#a85743);color:#fff;font:600 .85rem inherit;cursor:pointer}.fl-cs{border-top:1px solid var(--line,#e6d9d0);margin-top:6px;padding-top:10px;display:grid;gap:10px}.fl-c{display:flex;gap:8px}.fl-cb{min-width:0}.fl-cm{background:var(--bg,#faf5ef);border-radius:16px;padding:8px 12px;font-size:.9rem;line-height:1.4;word-break:break-word}.fl-cb small{color:#9a8a80;margin-left:8px}.fl-lien{border:0;background:none;color:inherit;font:inherit;text-decoration:underline;cursor:pointer;padding:0}.fl-cf{display:flex;gap:6px;align-items:center}.fl-ci{flex:1;border:1px solid var(--line,#e6d9d0);border-radius:999px;padding:10px 14px;font:inherit;background:var(--bg,#faf5ef);color:inherit}.fl-sheet{position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.35);display:flex;align-items:flex-end}.fl-vue{position:fixed;inset:0;z-index:9600;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center}.fl-vue img{max-width:100%;max-height:100%}.fl-vue button{position:absolute;top:calc(12px + env(safe-area-inset-top));right:12px;width:40px;height:40px;border-radius:50%;border:0;font-size:1.1rem}.cm-av{overflow:hidden}.cm-av img{width:100%;height:100%;object-fit:cover}.cm-av.big{width:64px;height:64px;font-size:2rem}.cm-av.sm{width:30px;height:30px;font-size:1rem}.cm-avch{display:flex;gap:12px;align-items:center;margin:10px 0}'+
'.cm-fil{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:4px}.cm-j{align-self:center;font-size:.72rem;color:#7a685e;margin:10px 0 4px;text-transform:capitalize}.cm-m{display:flex;flex-direction:column;align-items:flex-start;max-width:82%;margin-top:8px}.cm-m.suite{margin-top:1px}.cm-m.moi{align-self:flex-end;align-items:flex-end}.cm-n{font-size:.74rem;color:#7a685e;margin:0 0 2px 10px}.cm-b{border:0;text-align:left;font:inherit;font-size:.95rem;line-height:1.4;padding:9px 13px;border-radius:20px 20px 20px 6px;background:var(--card,#fffbf8);border:1px solid var(--line,#e6d9d0);color:inherit;cursor:pointer;word-break:break-word}.cm-m.moi .cm-b{background:var(--accent,#a85743);border-color:var(--accent,#a85743);color:#fff;border-radius:20px 20px 6px 20px}.cm-hr{font-size:.65rem;color:#9a8a80;margin:2px 8px 0}'+
'.cm-bar{display:flex;gap:8px;align-items:flex-end;padding:8px 10px calc(8px + env(safe-area-inset-bottom));border-top:1px solid var(--line,#e6d9d0);background:var(--card,#fffbf8)}.cm-bar textarea{flex:1;resize:none;border:1px solid var(--line,#e6d9d0);border-radius:22px;padding:10px 14px;font:inherit;font-size:1rem;background:var(--bg,#faf5ef);color:inherit;max-height:120px}.cm-send{width:42px;height:42px;border-radius:50%;border:0;background:var(--accent,#a85743);color:#fff;font-size:1.1rem;cursor:pointer;flex:none}.cm-note{margin:0;padding:6px 14px;font-size:.78rem;color:#7a685e;text-align:center}'+
'.cm-menu{position:absolute;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:flex-end;z-index:2}.cm-menu[hidden]{display:none}.cm-mi{width:100%;background:var(--card,#fffbf8);border-radius:22px 22px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom));display:grid;gap:8px}.cm-mi button{border:1px solid var(--line,#e6d9d0);background:transparent;border-radius:14px;padding:13px;font:inherit;color:inherit;text-align:left;cursor:pointer}';
document.head.appendChild(st);
})();
