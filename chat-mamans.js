/* Sérénaissance — Cercle des mamans : discussions en direct entre mamans seulement (salons par thème + messages privés).
   Sécurité : charte à l'entrée, pseudo (jamais le courriel), signalement, blocage, suspension possible par la propriétaire.
   Les liens et les courriels sont refusés. Les papas n'y ont pas accès. */
(function(){
if(window.ESPACE!=='parent')return;
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const EMOJIS=['🌸','🌿','🌙','☀️','🦋','🍃','🌷','🕊️','⭐','🐚','🌻','🫶'];
const CM={uid:null,prof:null,profs:{},salons:[],bloques:new Set(),ch:null,inbox:null,msgs:[],cur:null,tab:'prives',ok:false,nonlus:{},ecrit:null};
const $o=()=>document.getElementById('cm');
const peut=()=>!!(typeof FAM!=='undefined'&&FAM&&!window.PAPA&&S&&S.role==='parent');

/* ---------- carte d'entrée (accueil) ---------- */
function carte(){const n=Object.values(CM.nonlus||{}).reduce((a,b)=>a+(+b||0),0);return '<button class="card cm-entree" data-cm="ouvrir" style="width:100%;text-align:left;cursor:pointer;border:0;font:inherit"><span class="eyebrow acc">💬 Messages entre mamans'+(n?' <span class="cm-pastille">'+n+'</span>':'')+'</span><h2 class="papa-t" style="margin:2px 0 4px">Écrire à d\'autres mamans</h2><p class="small" style="margin:0">Comme Messenger, mais entre mamans seulement : discussions privées et salons en direct.</p></button>'}
const _pA=pAccueil;
pAccueil=function(){const h=_pA.apply(this,arguments);try{return peut()?carte()+h:h}catch(e){return h}};
const _r=render;
function placer(){try{const app=document.getElementById('app');if(!app)return;const c=app.querySelector(':scope>.cm-entree');if(!c)return;
  let ref=[...app.querySelectorAll(':scope>.papa-b,:scope>.papa-rel,:scope>.papa-cs')].pop()||app.querySelector(':scope>.ab-top')||app.querySelector(':scope>.sh')||app.querySelector(':scope>.card.mot');if(ref)ref.after(c)}catch(e){}}
let nlFait=false;
async function badge(){try{if(!peut()||$o())return;await moi();await majNonlus();const c=document.querySelector('.cm-entree');if(c){c.outerHTML=carte();placer()}}catch(e){}}
render=function(){const x=_r.apply(this,arguments);setTimeout(placer,30);if(!nlFait&&peut()){nlFait=true;setTimeout(badge,1500)}return x};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')badge()});

/* ---------- données ---------- */
async function moi(){if(CM.uid)return;const {data:{session}}=await sb.auth.getSession();CM.uid=session&&session.user&&session.user.id}
async function profs(ids){const m=[...new Set(ids)].filter(i=>i&&!CM.profs[i]);if(!m.length)return;const {data}=await sb.from('chat_profils').select('user_id,pseudo,emoji').in('user_id',m);(data||[]).forEach(p=>CM.profs[p.user_id]=p)}
const nom=id=>{const p=CM.profs[id];return p?(p.emoji||'🌸')+' '+E(p.pseudo):'🌸 Une maman'};
const heure=t=>new Date(t).toLocaleTimeString('fr-CA',{hour:'2-digit',minute:'2-digit'});
const jour=t=>new Date(t).toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long'});

/* ---------- ouverture ---------- */
async function ouvrir(){
  if(!peut())return;
  let o=$o();if(!o){o=document.createElement('div');o.id='cm';document.body.appendChild(o);document.body.classList.add('cm-ouvert')}
  o.innerHTML='<div class="cm-vide">Chargement…</div>';
  try{
    await moi();
    const {data:p}=await sb.from('chat_profils').select('*').eq('user_id',CM.uid).maybeSingle();CM.prof=p||null;
    if(!p){vCharte();return}
    if(p.suspendu){vSuspendu();return}
    const [s,b]=await Promise.all([sb.from('chat_salons').select('*').eq('actif',true).order('ordre'),sb.from('chat_blocages').select('bloque')]);
    CM.salons=s.data||[];CM.bloques=new Set((b.data||[]).map(x=>x.bloque));CM.ok=true;
    CM.profs[CM.uid]={user_id:CM.uid,pseudo:p.pseudo,emoji:p.emoji};
    await majNonlus();abonnerInbox();
    vAccueil();
  }catch(e){fermer();toast('Le cercle est indisponible pour le moment')}
}
function fermer(){desabonner();if(CM.inbox){try{sb.removeChannel(CM.inbox)}catch(e){}CM.inbox=null}const o=$o();if(o)o.remove();document.body.classList.remove('cm-ouvert');CM.cur=null;CM.msgs=[];setTimeout(badge,300)}
function desabonner(){if(CM.ch){try{sb.removeChannel(CM.ch)}catch(e){}CM.ch=null}}

/* ---------- vues ---------- */
function entete(titre,retour,droite){return '<div class="cm-h">'+(retour?'<button class="cm-ic" data-cm="'+retour+'" aria-label="Retour">←</button>':'<span style="width:36px"></span>')+'<div class="cm-t">'+titre+'</div>'+(droite||'<button class="cm-ic" data-cm="fermer" aria-label="Fermer">✕</button>')+'</div>'}
function vCharte(){
  const pre=((S.parent&&S.parent.prenom)||'').trim().split(/\s+/)[0];
  $o().innerHTML=entete('Bienvenue dans le cercle','','<button class="cm-ic" data-cm="fermer" aria-label="Fermer">✕</button>')+'<div class="cm-c"><div class="cm-carte"><h2>🌸 Un espace de mamans, tout en douceur</h2><ul class="cm-ch">'+
   '<li>Ici, on se parle <b>avec bienveillance</b> : pas de jugement, chaque maman fait de son mieux.</li>'+
   '<li>Ce qui s\'écrit <b>ne remplace pas votre équipe de soins</b>. En cas d\'urgence : 911.</li>'+
   '<li>Pas de liens, de courriel, de téléphone ni de publicité.</li><li><b>Photos</b> : seulement les vôtres ou celles de votre bébé. Jamais d\'enfants ou de personnes qui ne sont pas à vous, ni de photos intimes.</li>'+
   '<li>Les salons peuvent être lus par toutes les mamans du cercle. Vous êtes vue par votre <b>pseudo</b> seulement, jamais par votre courriel.</li>'+
   '<li>Vous pouvez <b>signaler</b> un message ou <b>bloquer</b> une personne à tout moment. L\'équipe lit les signalements et peut suspendre l\'accès au cercle.</li></ul></div>'+
   '<div class="cm-carte"><label class="f">Votre pseudo (2 à 24 caractères)<input id="cmPseudo" maxlength="24" value="'+E(pre)+'" autocomplete="off"></label><div class="cm-em" id="cmEm">'+EMOJIS.map((e,i)=>'<button type="button" class="cm-e'+(i===0?' on':'')+'" data-cm="emoji" data-e="'+e+'">'+e+'</button>').join('')+'</div>'+
   '<label class="check" style="margin-top:10px"><input type="checkbox" id="cmOk"><span>J\'ai lu la charte et je m\'engage à la respecter.</span></label><button class="btn" data-cm="creer" style="margin-top:10px">Entrer dans le cercle</button></div></div>';
}
function vSuspendu(){$o().innerHTML=entete('Cercle des mamans','','<button class="cm-ic" data-cm="fermer" aria-label="Fermer">✕</button>')+'<div class="cm-c"><div class="cm-carte"><h2>Accès en pause</h2><p>Votre accès au cercle est suspendu pour le moment. Vous gardez tout le reste de votre appli.</p><p class="small muted">Pour en parler avec douceur : <a href="mailto:sc@academiesere.ca">sc@academiesere.ca</a></p></div></div>'}
function vAccueil(){
  CM.cur=null;desabonner();
  const o=$o();
  const tot=Object.values(CM.nonlus).reduce((a,b)=>a+(+b||0),0);
  o.innerHTML=entete('Discussions','','<button class="cm-ic" data-cm="nouveau" aria-label="Nouveau message">✏️</button><button class="cm-ic" data-cm="fermer" aria-label="Fermer">✕</button>')+'<div class="cm-tabs"><button class="'+(CM.tab==='prives'?'on':'')+'" data-cm="tab" data-v="prives">Discussions'+(tot?' <span class="cm-pastille">'+tot+'</span>':'')+'</button><button class="'+(CM.tab==='salons'?'on':'')+'" data-cm="tab" data-v="salons">Salons</button></div><div class="cm-c" id="cmListe"></div>';
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
  box.innerHTML=(vis.length?vis.map(x=>{const m=der[x.c.id],n=+CM.nonlus[x.c.id]||0;return '<button class="cm-li'+(n?' nonlu':'')+'" data-cm="conv" data-id="'+x.c.id+'" data-o="'+x.o+'"><span class="cm-av">'+E((CM.profs[x.o]||{}).emoji||'🌸')+'</span><span class="cm-tx"><b>'+E((CM.profs[x.o]||{}).pseudo||'Une maman')+'</b><small>'+(m.auteur===CM.uid?'Vous : ':'')+(m.texte==='📷'?'📷 Photo':E(m.texte.slice(0,60)))+'</small></span><span class="cm-dr"><span>'+quand(m.created_at)+'</span>'+(n?'<i class="cm-pastille">'+n+'</i>':'')+'</span></button>'}).join(''):'<div class="cm-carte" style="text-align:center"><div style="font-size:2.2rem">💌</div><h2>Aucune discussion pour l\'instant</h2><p class="small muted">Touchez ✏️ en haut pour écrire à une maman, ou passez par les salons pour rencontrer d\'autres mamans.</p><button class="btn" data-cm="nouveau">Écrire à une maman</button></div>')
   +(CM.bloques.size?'<button class="btn sm ghost" data-cm="bloques" style="margin:12px auto;display:block">Personnes bloquées ('+CM.bloques.size+')</button>':'');
}
let TOUS=null;
async function vNouveau(){
  $o().innerHTML=entete('Nouveau message','retourpriv')+'<div class="cm-rech"><input id="cmRech" placeholder="Chercher une maman par pseudo…" autocomplete="off" aria-label="Chercher une maman"></div><div class="cm-c" id="cmRes"><p class="small muted" style="text-align:center">Chargement…</p></div>';
  if(!TOUS){const {data}=await sb.from('chat_profils').select('user_id,pseudo,emoji,suspendu').order('pseudo').limit(500);TOUS=(data||[]).filter(x=>x.user_id!==CM.uid&&!x.suspendu);TOUS.forEach(x=>CM.profs[x.user_id]=x)}
  filtrerRes('');const i=document.getElementById('cmRech');if(i)i.focus();
}
function filtrerRes(q){
  const r=document.getElementById('cmRes');if(!r)return;q=q.trim().toLowerCase();
  const L=(TOUS||[]).filter(x=>!CM.bloques.has(x.user_id)&&(!q||x.pseudo.toLowerCase().includes(q))).slice(0,60);
  r.innerHTML=L.length?L.map(x=>'<button class="cm-li" data-cm="prive" data-u="'+x.user_id+'"><span class="cm-av">'+E(x.emoji||'🌸')+'</span><span class="cm-tx"><b>'+E(x.pseudo)+'</b><small>Envoyer un message</small></span></button>').join(''):'<p class="small muted" style="text-align:center;margin-top:20px">'+(TOUS&&TOUS.length?'Aucune maman avec ce pseudo.':'Personne d\'autre dans le cercle pour l\'instant : invitez vos amies mamans, ou dites bonjour dans un salon 💗')+'</p>';
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
  $o().innerHTML=entete('Personnes bloquées','retourpriv')+'<div class="cm-c">'+[...CM.bloques].map(i=>'<div class="cm-li"><span class="cm-av">'+E((CM.profs[i]||{}).emoji||'🌸')+'</span><span class="cm-tx"><b>'+E((CM.profs[i]||{}).pseudo||'Une maman')+'</b></span><button class="btn sm ghost" data-cm="debloquer" data-id="'+i+'">Débloquer</button></div>').join('')+'</div>';
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
    h+='<div class="cm-m'+(moi?' moi':'')+(suite?' suite':'')+(!moi&&CM.cur.type==='conv'?' conv':'')+'">'+(!moi&&!suite&&CM.cur.type==='salon'?'<div class="cm-n">'+nom(m.auteur)+'</div>':'')+'<button class="cm-b'+(m.photo?' ph':'')+'" data-cm="msg" data-id="'+m.id+'">'+(m.photo?'<img data-p="'+E(m.photo)+'" data-cm="photo" alt="Photo" '+(URLS[m.photo]?'src="'+URLS[m.photo]+'"':'')+'>':'')+(m.photo&&m.texte==='📷'?'':E(m.texte).replace(/\n/g,'<br>'))+'</button><span class="cm-hr">'+heure(m.created_at)+'</span></div>'});
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
const URLS={};
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
    (CM.cur.type==='salon'?'<button data-cm="prive" data-u="'+m.auteur+'">💌 Écrire en privé</button>':'')+
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
    if(a==='ouvrir')await ouvrir();
    else if(a==='fermer')fermer();
    else if(a==='emoji'){document.querySelectorAll('#cmEm .cm-e').forEach(x=>x.classList.toggle('on',x===b))}
    else if(a==='creer'){
      const ps=((document.getElementById('cmPseudo')||{}).value||'').trim(),em=(document.querySelector('#cmEm .cm-e.on')||{}).dataset;
      if(ps.length<2||ps.length>24){toast('Choisissez un pseudo de 2 à 24 caractères');return}
      if(refuse(ps)){toast('Le pseudo ne peut pas contenir de lien ni de courriel');return}
      if(!document.getElementById('cmOk').checked){toast('Cochez la charte pour continuer');return}
      const {error}=await sb.from('chat_profils').insert({user_id:CM.uid,pseudo:ps,emoji:em?em.e:'🌸',charte_le:new Date().toISOString()});
      if(error){toast('Pseudo non enregistré');return}
      await ouvrir()}
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
      CM.bloques.add(b.dataset.u);CM.msgs=CM.msgs.filter(x=>!CM.bloques.has(x.auteur));document.getElementById('cmMenu').hidden=true;
      if(CM.cur.type==='conv'){CM.tab='prives';vAccueil()}else dessiner(false);toast('Maman bloquée')}
    else if(a==='debloquer'){const {error}=await sb.from('chat_blocages').delete().eq('bloqueur',CM.uid).eq('bloque',b.dataset.id);if(error){toast('Déblocage impossible');return}CM.bloques.delete(b.dataset.id);CM.tab='prives';vAccueil()}
  }catch(err){toast('Une erreur est survenue')}
},true);
document.addEventListener('change',e=>{if(e.target&&e.target.id==='cmFile'){choisirPhoto(e.target.files&&e.target.files[0]);e.target.value=''}},true);
document.addEventListener('submit',e=>{if(e.target&&e.target.id==='cmForm'){e.preventDefault();envoyer()}},true);
document.addEventListener('keydown',e=>{if(e.target&&e.target.id==='cmTxt'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();envoyer()}},true);
document.addEventListener('input',e=>{if(e.target&&e.target.id==='cmRech'){filtrerRes(e.target.value);return}if(e.target&&e.target.id==='cmTxt'&&CM.cur&&CM.cur.type==='conv'&&CM.cur.canal&&Date.now()-(CM.cur.tt||0)>2000){CM.cur.tt=Date.now();try{CM.cur.canal.send({type:'broadcast',event:'ecrit',payload:{u:CM.uid}})}catch(x){}}if(e.target&&e.target.id==='cmTxt'){e.target.style.height='auto';e.target.style.height=Math.min(120,e.target.scrollHeight)+'px'}},true);

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
'.cm-fil{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:4px}.cm-j{align-self:center;font-size:.72rem;color:#7a685e;margin:10px 0 4px;text-transform:capitalize}.cm-m{display:flex;flex-direction:column;align-items:flex-start;max-width:82%;margin-top:8px}.cm-m.suite{margin-top:1px}.cm-m.moi{align-self:flex-end;align-items:flex-end}.cm-n{font-size:.74rem;color:#7a685e;margin:0 0 2px 10px}.cm-b{border:0;text-align:left;font:inherit;font-size:.95rem;line-height:1.4;padding:9px 13px;border-radius:20px 20px 20px 6px;background:var(--card,#fffbf8);border:1px solid var(--line,#e6d9d0);color:inherit;cursor:pointer;word-break:break-word}.cm-m.moi .cm-b{background:var(--accent,#a85743);border-color:var(--accent,#a85743);color:#fff;border-radius:20px 20px 6px 20px}.cm-hr{font-size:.65rem;color:#9a8a80;margin:2px 8px 0}'+
'.cm-bar{display:flex;gap:8px;align-items:flex-end;padding:8px 10px calc(8px + env(safe-area-inset-bottom));border-top:1px solid var(--line,#e6d9d0);background:var(--card,#fffbf8)}.cm-bar textarea{flex:1;resize:none;border:1px solid var(--line,#e6d9d0);border-radius:22px;padding:10px 14px;font:inherit;font-size:1rem;background:var(--bg,#faf5ef);color:inherit;max-height:120px}.cm-send{width:42px;height:42px;border-radius:50%;border:0;background:var(--accent,#a85743);color:#fff;font-size:1.1rem;cursor:pointer;flex:none}.cm-note{margin:0;padding:6px 14px;font-size:.78rem;color:#7a685e;text-align:center}'+
'.cm-menu{position:absolute;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:flex-end;z-index:2}.cm-menu[hidden]{display:none}.cm-mi{width:100%;background:var(--card,#fffbf8);border-radius:22px 22px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom));display:grid;gap:8px}.cm-mi button{border:1px solid var(--line,#e6d9d0);background:transparent;border-radius:14px;padding:13px;font:inherit;color:inherit;text-align:left;cursor:pointer}';
document.head.appendChild(st);
})();
