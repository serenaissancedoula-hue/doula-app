/* Sérénaissance — chat en bulle flottante (comme Messenger sur Android).
   La bulle « Chat » en bas à droite ouvre une petite fenêtre de conversation par-dessus l'écran, sans changer de page.
   Parents : la conversation avec leur doula. Doula : la liste des familles, puis la conversation choisie (flèche pour revenir). */
const CB={ouvert:false,fid:null};
function cbFid(){return S.role==='parent'?(FAM&&FAM.id):CB.fid}
function cbMsgs(){const L=S.role==='parent'?(MSGS||[]):(CMSGS[CB.fid]||[]);return cbVisibles(L,cbFid())}
/* conversation effacée par cette personne : on cache les messages d'avant (l'autre personne garde sa copie) */
let CB_EFF=null;
async function cbChargerEff(){try{const {data}=await sb.auth.getUser();CB_EFF=((data&&data.user&&data.user.user_metadata)||{}).chat_efface||{}}catch(e){CB_EFF=CB_EFF||{}}return CB_EFF}
function cbVisibles(L,fid){const d=CB_EFF&&fid&&CB_EFF[fid];return d?L.filter(m=>new Date(m.created_at)>new Date(d)):L}
/* pièces jointes */
const CB_URL={};
function cbTexte(m){let s=String(m.texte||'');if(String(m.lien||'').startsWith('chat:'))s=s.replace(/^(📷 Photo|📎 [^\n]*)\n?/,'');return s}
function cbPJ(m){const l=String(m.lien||'');if(!l.startsWith('chat:'))return '';const ch=l.slice(5),nom=ch.split('/').pop().replace(/^\d+-/,'');
  const img=/\.(jpe?g|png|webp|gif|heic)$/i.test(ch);return '<div class="cb-pj-zone'+(img?' img':'')+'" data-chemin="'+esc(ch)+'" data-nom="'+esc(nom)+'">'+(img?'<span class="cb-pj-att">'+icon('fa-image')+' Photo…</span>':'<span class="cb-pj-att">'+icon('fa-paperclip')+' '+esc(nom)+'</span>')+'</div>'}
async function cbRemplirPJ(){const Z=[...document.querySelectorAll('.cb-pj-zone:not([data-ok])')];if(!Z.length)return;
  const manque=[...new Set(Z.map(z=>z.dataset.chemin).filter(c=>!CB_URL[c]))];
  if(manque.length){try{const {data}=await sb.storage.from('chat').createSignedUrls(manque,3600);(data||[]).forEach(x=>{if(x.signedUrl)CB_URL[x.path]=x.signedUrl})}catch(e){}}
  Z.forEach(z=>{const u=CB_URL[z.dataset.chemin];if(!u)return;z.dataset.ok='1';
    z.innerHTML=z.classList.contains('img')?'<a href="'+u+'" target="_blank" rel="noopener"><img src="'+u+'" alt="Photo envoyée" loading="lazy"></a>':'<a class="cb-doc" href="'+u+'" target="_blank" rel="noopener">'+icon('fa-file-arrow-down')+' '+esc(z.dataset.nom)+'</a>'})}
function cbReduire(f){return new Promise(ok=>{if(!/^image\/(jpeg|png|webp|heic|heif)/.test(f.type)){ok(f);return}
  const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{const k=Math.min(1,1600/Math.max(im.width,im.height)),c=document.createElement('canvas');
    c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
    c.toBlob(b=>ok(b?new File([b],f.name.replace(/\.[^.]+$/,'')+'.jpg',{type:'image/jpeg'}):f),'image/jpeg',.82)};im.onerror=()=>{URL.revokeObjectURL(u);ok(f)};im.src=u})}
async function cbEnvoyerFichier(f){const fid=cbFid();if(!f||!fid)return;
  if(f.size>10*1024*1024){toast('Fichier trop lourd (10 Mo maximum)');return}
  toast('Envoi en cours…');const g=await cbReduire(f);if(g.size>10*1024*1024){toast('Fichier trop lourd (10 Mo maximum)');return}
  const nom=(g.name||'fichier').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\w.-]+/g,'_').slice(-60),chemin=fid+'/'+Date.now()+'-'+nom;
  const up=await sb.storage.from('chat').upload(chemin,g,{contentType:g.type||'application/octet-stream',upsert:false});
  if(up.error){toast('Pas envoyé : '+(up.error.message||'erreur'));return}
  const t=document.getElementById('cbTxt'),leg=t?t.value.trim():'',img=/^image\//.test(g.type);
  const {error}=await sb.from('fam_messages').insert({famille_id:fid,de_doula:S.role!=='parent',texte:(img?'📷 Photo':'📎 '+(f.name||'Fichier'))+(leg?'\n'+leg:''),lien:'chat:'+chemin});
  if(error){toast('Pas envoyé : '+(error.message||'erreur'));return}if(t)t.value='';
  try{if(S.role==='parent')await chargerEchanges();else await chargerClientDetail(fid)}catch(e){}cbDessiner(true);toast(img?'Photo envoyée':'Fichier envoyé')}
document.addEventListener('change',e=>{if(e.target&&e.target.id==='cbFichier'){const f=e.target.files&&e.target.files[0];e.target.value='';cbEnvoyerFichier(f)}});
function cbTitre(){if(S.role==='parent')return (DOULA&&DOULA.prenom)?DOULA.prenom:'Ma doula';
  const c=(S.clients||[]).find(x=>x.id===CB.fid);return c?cName(c):'Mes familles'}
function cbListeFamilles(){const L=(S.clients||[]).filter(c=>!c.archivee_le&&c.statut!=='archivee')
    .sort((a,b)=>((NONLUS[b.id]||0)-(NONLUS[a.id]||0))||cName(a).localeCompare(cName(b)));
  if(!L.length)return '<p class="small muted" style="padding:16px">Aucune famille pour l\'instant.</p>';
  return '<div class="cb-fams">'+L.map(c=>{const n=NONLUS[c.id]||0;return '<button class="cb-fam" data-cb="fam" data-id="'+c.id+'">'+avatar((c.parent_data||{}).photo,cFirst(c))+
    '<span class="cb-fam-tx"><b>'+esc(cName(c))+'</b><small>'+(c.parent_user?'Dans l\'appli':'Pas encore inscrite')+'</small></span>'+(n?'<span class="cb-n">'+n+'</span>':'')+'</button>'}).join('')+'</div>'}
function cbFil(){const L=cbMsgs(),doula=S.role==='doula';
  if(!L.length)return '<p class="small muted cb-vide">Aucun message pour l\'instant. Écrivez le premier !</p>';
  return L.map(m=>{const moi=doula?m.de_doula:!m.de_doula,d=new Date(m.created_at);
    return '<div class="cb-b'+(moi?' moi':'')+'">'+cbPJ(m)+'<div>'+esc(cbTexte(m)).replace(/\n/g,'<br>')+'</div><span>'+(m.type==='document'?'📄 ':m.type==='rdv'?'📅 ':'')+fmtS(d)+' · '+hm(d.getTime())+'</span></div>'}).join('')}
function cbDessiner(garderTexte){let p=document.getElementById('chatPan');if(!CB.ouvert){if(p)p.remove();return}
  const enListe=S.role==='doula'&&!CB.fid;
  if(!p){p=document.createElement('div');p.id='chatPan';p.setAttribute('role','dialog');p.setAttribute('aria-label','Chat');document.body.appendChild(p)}
  const ta=p.querySelector('textarea'),brouillon=garderTexte&&ta?ta.value:'',foc=ta&&document.activeElement===ta;
  p.innerHTML='<div class="cb-tete">'+(S.role==='doula'&&CB.fid?'<button class="cb-ic" data-cb="retour" aria-label="Toutes les familles">'+icon('fa-arrow-left')+'</button>':'<span class="cb-ic cb-logo">'+icon('fa-comments')+'</span>')+
    '<b>'+esc(cbTitre())+'</b><button class="cb-ic" data-cb="fermer" aria-label="Fermer le chat">'+icon('fa-xmark')+'</button></div>'+
    (enListe?cbListeFamilles():'<div class="cb-fil" id="cbFil">'+cbFil()+'</div><div class="cb-bas"><label class="cb-ic cb-pj" aria-label="Joindre une photo ou un fichier">'+icon('fa-paperclip')+'<input type="file" id="cbFichier" accept="image/*,application/pdf,.doc,.docx,.txt" hidden></label><textarea id="cbTxt" rows="1" placeholder="Votre message…"></textarea><button class="cb-env" data-cb="envoyer" aria-label="Envoyer">'+icon('fa-paper-plane')+'</button></div>');
  const t=p.querySelector('textarea');if(t){t.value=brouillon;if(foc)try{t.focus({preventScroll:true})}catch(e){}}
  const f=document.getElementById('cbFil');if(f)f.scrollTop=f.scrollHeight;cbLus();cbRemplirPJ().then(()=>{const f2=document.getElementById('cbFil');if(f2)f2.scrollTop=f2.scrollHeight})}
function cbLus(){try{if(!CB.ouvert)return;if(S.role==='parent'){if(MSGS.some(m=>m.de_doula&&!m.lu)){sb.rpc('fam_marquer_lus',{p_famille:FAM.id}).then(()=>{},()=>{});MSGS.forEach(m=>{if(m.de_doula)m.lu=true})}}
  else if(CB.fid&&NONLUS[CB.fid]){sb.rpc('fam_marquer_lus',{p_famille:CB.fid}).then(()=>{},()=>{});NONLUS[CB.fid]=0}
  if(typeof majBoutonChat==='function')majBoutonChat()}catch(e){}}
async function cbOuvrirFamille(id){CB.fid=id;cbDessiner();try{await chargerClientDetail(id)}catch(e){}if(CB.fid===id)cbDessiner();
  setTimeout(()=>{const t=document.getElementById('cbTxt');if(t)try{t.focus({preventScroll:true})}catch(e){}},80)}
function cbOuvrir(){CB.ouvert=true;if(!CB_EFF)cbChargerEff().then(()=>cbDessiner(true));cbDessiner();if(S.role==='doula'&&CB.fid)cbOuvrirFamille(CB.fid);
  else setTimeout(()=>{const t=document.getElementById('cbTxt');if(t)try{t.focus({preventScroll:true})}catch(e){}},80)}
async function cbEnvoyer(b){const t=document.getElementById('cbTxt'),v=t&&t.value.trim();if(!v)return;b.disabled=true;
  const row=S.role==='parent'?{famille_id:FAM.id,de_doula:false,texte:v}:{famille_id:CB.fid,de_doula:true,texte:v};
  const {error}=await sb.from('fam_messages').insert(row);b.disabled=false;if(error){toast('Pas envoyé : '+(error.message||'erreur'));return}
  t.value='';try{if(S.role==='parent')await chargerEchanges();else await chargerClientDetail(CB.fid)}catch(e){}cbDessiner(true)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-cb]');if(!b)return;e.stopPropagation();const a=b.dataset.cb;
  if(a==='fermer'){CB.ouvert=false;cbDessiner();return}
  if(a==='retour'){CB.fid=null;cbDessiner();return}
  if(a==='fam'){cbOuvrirFamille(b.dataset.id);return}
  if(a==='envoyer')cbEnvoyer(b)},true);
document.addEventListener('keydown',e=>{if(e.target&&e.target.id==='cbTxt'&&e.key==='Enter'&&!e.shiftKey&&matchMedia('(pointer:fine)').matches){e.preventDefault();const b=document.querySelector('[data-cb=envoyer]');if(b)cbEnvoyer(b)}
  if(e.key==='Escape'&&CB.ouvert){CB.ouvert=false;cbDessiner()}});
document.addEventListener('input',e=>{if(e.target&&e.target.id==='cbTxt'){const t=e.target;t.style.height='auto';t.style.height=Math.min(120,t.scrollHeight)+'px'}});
/* la bulle « Chat » ouvre ou ferme la fenêtre */
function chatBulleBasculer(){if(CB.ouvert){CB.ouvert=false;cbDessiner()}else cbOuvrir()}
/* nouveau message en direct : la conversation ouverte se met à jour */
if(typeof chatReleve==='function'){const _crCB=chatReleve;chatReleve=function(){_crCB.apply(this,arguments);
  if(CB.ouvert)setTimeout(async()=>{try{if(S.role==='doula'&&CB.fid)await chargerClientDetail(CB.fid);else if(S.role==='parent')await chargerEchanges()}catch(e){}cbDessiner(true)},700)}}
const _rCB=render;render=function(){const r=_rCB.apply(this,arguments);if(CB.ouvert&&!(MOI))CB.ouvert=false;if(CB.ouvert)cbDessiner(true);else{const p=document.getElementById('chatPan');if(p)p.remove()}return r};
(function(){const st=document.createElement('style');st.textContent=
  '#chatPan{position:fixed;right:max(12px,env(safe-area-inset-right,0px));bottom:calc(136px + env(safe-area-inset-bottom,0px));z-index:60;width:min(calc(100vw - 24px),380px);height:min(64vh,540px);'+
    'display:flex;flex-direction:column;background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:22px;box-shadow:0 18px 44px rgba(44,34,30,.28);overflow:hidden;animation:cbIn .22s ease-out}'+
  '@keyframes cbIn{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}'+
  '.cb-tete{display:flex;align-items:center;gap:10px;padding:10px 10px 10px 12px;border-bottom:1px solid var(--line);background:var(--soft)}.cb-tete b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:1rem}'+
  '.cb-ic{flex:none;width:36px;height:36px;border-radius:50%;border:0;background:transparent;color:var(--accent);display:grid;place-items:center;font-size:1rem;cursor:pointer}.cb-logo{background:var(--card)}'+
  '.cb-fil{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;-webkit-overflow-scrolling:touch}'+
  '.cb-b{max-width:80%;align-self:flex-start;background:var(--soft);border-radius:18px 18px 18px 6px;padding:8px 12px;font-size:.95rem;line-height:1.35;word-wrap:break-word}'+
  '.cb-b.moi{align-self:flex-end;background:var(--accent);color:#fff;border-radius:18px 18px 6px 18px}.cb-b span{display:block;font-size:.68rem;opacity:.7;margin-top:3px}'+
  '.cb-vide{text-align:center;margin:auto 0}'+
  '.cb-bas{display:flex;align-items:flex-end;gap:8px;padding:8px 10px calc(8px + env(safe-area-inset-bottom,0px)*0);border-top:1px solid var(--line)}'+
  '.cb-bas textarea{flex:1;resize:none;min-height:40px;max-height:120px;border:1px solid var(--line);border-radius:20px;padding:9px 14px;font:inherit;background:var(--bg);color:var(--ink)}'+
  '.cb-env{flex:none;width:42px;height:42px;border-radius:50%;border:0;background:var(--accent);color:#fff;font-size:1rem;cursor:pointer}'+
  '.cb-fams{flex:1;overflow-y:auto}.cb-fam{display:flex;align-items:center;gap:12px;width:100%;padding:10px 14px;border:0;border-bottom:1px solid var(--line);background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}'+
  '.cb-fam .av,.cb-fam .avimg{width:40px;height:40px;flex:none}.cb-fam-tx{flex:1;min-width:0;display:flex;flex-direction:column}.cb-fam-tx small{color:var(--muted);font-size:.78rem}'+
  '.cb-pj{cursor:pointer;color:var(--muted)}.cb-pj-zone{margin:-2px -6px 6px}.cb-pj-zone img{display:block;max-width:100%;max-height:240px;border-radius:12px}.cb-pj-att{font-size:.8rem;opacity:.8}'+
  '.cb-doc{display:inline-flex;gap:8px;align-items:center;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.25);color:inherit;font-weight:600;text-decoration:none}.cb-b:not(.moi) .cb-doc{background:var(--card)}'+
  '.cb-n{background:var(--accent);color:#fff;border-radius:99px;min-width:22px;padding:2px 7px;font-size:.75rem;font-weight:700;text-align:center}';
  document.head.appendChild(st)})();

/* La page Messages (onglets) montre aussi les pièces jointes et respecte une conversation effacée */
if(typeof filMessages==='function'){filMessages=function(L,doula){const fid=doula?S.openClient:(FAM&&FAM.id);L=cbVisibles(L||[],fid);
  if(!L.length)return '<div class="card dash small muted" style="text-align:center">Aucun message pour l\'instant.</div>';
  setTimeout(cbRemplirPJ,0);
  return '<div class="card fil" id="fil">'+L.map(m=>{const moi=doula?m.de_doula:!m.de_doula;return '<div class="bulle '+(moi?'moi':'')+'">'+cbPJ(m)+'<div>'+esc(cbTexte(m)).replace(/\n/g,'<br>')+'</div><span class="xs">'+(m.type==='document'?'📄 ':m.type==='rdv'?'📅 ':'')+fmtS(new Date(m.created_at))+' · '+hm(new Date(m.created_at).getTime())+'</span></div>'}).join('')+'</div>'}}
/* Paramètres : effacer une conversation (seulement de son appli à soi) */
async function cbEffacer(fid,b){if(b.dataset.c!=='1'){b.dataset.c='1';b.innerHTML=icon('fa-trash')+' Confirmer : effacer';return}
  b.disabled=true;await cbChargerEff();const eff=Object.assign({},CB_EFF,{[fid]:new Date().toISOString()});
  const {error}=await sb.auth.updateUser({data:{chat_efface:eff}});if(error){b.disabled=false;toast('Pas effacé : '+(error.message||'erreur'));return}
  CB_EFF=eff;try{sb.rpc('fam_marquer_lus',{p_famille:fid}).then(()=>{},()=>{});if(S.role==='parent')MSGS.forEach(m=>{if(m.de_doula)m.lu=true});else NONLUS[fid]=0}catch(e){}
  render();toast(S.role==='parent'?'Conversation effacée de votre appli. Votre doula garde sa copie.':'Conversation effacée de votre appli. La famille garde sa copie.')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-cb-eff]');if(!b)return;e.stopPropagation();cbEffacer(b.dataset.cbEff,b)},true);
if(typeof pParametres==='function'){const _ppCB=pParametres;pParametres=function(){let h=_ppCB.apply(this,arguments);try{
  let c='<div class="card"><span class="eyebrow acc">Mes conversations</span><p class="xs muted">Effacer une conversation la retire de votre appli seulement. '+(S.role==='parent'?'Votre doula':'La famille')+' garde sa copie. Les nouveaux messages s\'afficheront normalement.</p>';
  if(S.role==='parent'){if(FAM)c+='<button class="btn ghost" data-cb-eff="'+FAM.id+'">'+icon('fa-trash')+' Effacer ma conversation avec ma doula</button>'}
  else{const L=(S.clients||[]).filter(x=>!x.archivee_le);c+=L.length?'<div class="list">'+L.map(x=>'<div class="li"><div class="tx"><b>'+esc(cName(x))+'</b></div><button class="btn sm ghost" data-cb-eff="'+x.id+'">'+icon('fa-trash')+' Effacer</button></div>').join('')+'</div>':'<p class="small muted">Aucune conversation.</p>'}
  h+=c+'</div>'}catch(e){}return h}}
setTimeout(function rep(){if(typeof MOI!=='undefined'&&MOI){cbChargerEff().then(()=>{try{render()}catch(e){}})}else setTimeout(rep,1500)},1500);
