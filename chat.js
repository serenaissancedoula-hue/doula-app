/* Sérénaissance — chat en direct avec la doula : bouton flottant + mise à jour instantanée des messages (temps réel). */
function chatNonLus(){try{return S.role==='parent'?MSGS.filter(m=>m.de_doula&&!m.lu).length:Object.values(NONLUS||{}).reduce((a,b)=>a+(+b||0),0)}catch(e){return 0}}
function majBoutonChat(){try{let b=document.getElementById('chatFab');
  const parent=S.role==='parent'&&FAM&&!S.vue,doula=S.role==='doula'&&ME_DOULA&&!S.vue,surMsg=(parent&&S.tab==='madoula'&&(S.seg||'messages')==='messages')||(doula&&S.openClient&&S.ctab==='messages');
  if(!(parent||doula)||surMsg||document.getElementById('layer')&&document.getElementById('layer').innerHTML){if(b)b.remove();return}
  const n=chatNonLus();if(!b){b=document.createElement('button');b.id='chatFab';b.setAttribute('data-act','chatOuvrir');document.body.appendChild(b)}
  b.innerHTML='<i class="fa-solid fa-comments"></i><span>'+(doula?'Chat avec une famille':'Chat avec ma doula')+'</span>'+(n?'<b>'+n+'</b>':'')}catch(e){}}
const _rChat=render;render=function(){const r=_rChat.apply(this,arguments);majBoutonChat();return r};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="chatOuvrir"]');if(!b)return;e.stopPropagation();if(S.role==='doula'){chatListe();return}S.vue=null;S.tab='madoula';S.seg='messages';render();
  setTimeout(()=>{const t=document.getElementById('msgTxt');if(t){t.scrollIntoView({block:'center'});try{t.focus({preventScroll:true})}catch(x){}}},120)},true);
/* temps réel : un nouveau message apparaît tout de suite, sans effacer ce que la personne est en train d'écrire */
let _chatT=null;
function chatReleve(){clearTimeout(_chatT);_chatT=setTimeout(async()=>{try{const t=document.getElementById('msgTxt'),v=t?t.value:'',foc=document.activeElement===t;
  await rafraichir();const t2=document.getElementById('msgTxt');if(t2&&v){t2.value=v;if(foc)try{t2.focus()}catch(x){}}majBoutonChat()}catch(e){}},500)}
function chatAbonner(){try{if(window._chatCh||!MOI)return;window._chatCh=sb.channel('chat-live').on('postgres_changes',{event:'INSERT',schema:'public',table:'fam_messages'},p=>{
  try{const m=p.new||{};const mien=S.role==='parent'?!m.de_doula:!!m.de_doula;if(!mien){try{navigator.vibrate&&navigator.vibrate(60)}catch(x){}}chatReleve()}catch(e){}}).subscribe()}catch(e){}}
setInterval(chatAbonner,3000);
const _stF=document.createElement('style');_stF.textContent='#chatFab{position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:calc(86px + env(safe-area-inset-bottom,0px));z-index:30;display:flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:12px 16px;background:var(--accent);color:#fff;font:700 .88rem/1 inherit;box-shadow:0 6px 18px rgba(0,0,0,.22);cursor:pointer}#chatFab b{background:#fff;color:var(--accent);border-radius:999px;min-width:20px;padding:2px 6px;font-size:.75rem}@media(max-width:380px){#chatFab span{display:none}}';document.head.appendChild(_stF);

/* doula : choisir n'importe quelle famille pour démarrer ou continuer une conversation */
function chatListe(){const L=(S.clients||[]).filter(c=>!c.archivee_le&&c.statut!=='archivee');
  sheet('Chat avec une famille','<p class="small">Choisissez une famille : vous pouvez lui écrire ou répondre, en direct.</p>'+(L.length?'<div class="list">'+L.map(c=>{const n=(typeof NONLUS!=='undefined'&&NONLUS[c.id])||0;return '<button class="li" data-act="chatFam" data-id="'+c.id+'" style="width:100%;text-align:left;cursor:pointer"><div class="ic">'+icon('fa-comments')+'</div><div class="tx"><b>'+esc(cName(c))+'</b><span>'+(c.parent_user?'Dans l\'appli':'Pas encore inscrite')+(c.suivi_suspendu?' · suivi suspendu':'')+'</span></div>'+(n?'<span class="pill acc">'+n+' nouveau'+(n>1?'x':'')+'</span>':'')+'</button>'}).join('')+'</div>':'<p class="small muted">Aucune famille pour le moment.</p>'))}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act="chatFam"]');if(!b)return;e.stopPropagation();close();S.vue=null;S.dtab='clientes';S.dsub='';S.openClient=b.dataset.id;S.ctab='messages';
  try{await chargerClientDetail(b.dataset.id)}catch(x){}render();scrollTo(0,0);setTimeout(()=>{const t=document.querySelector('#app textarea');if(t){try{t.focus({preventScroll:true})}catch(x){}}},150)},true);
