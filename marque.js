/* Sérénaissance — image de marque de chaque doula : logo, couleurs, choix des documents. Enregistré dans son compte (suit la doula sur tous ses appareils) et vu par ses familles. */
(function(){
const parent=()=>window.ESPACE==='parent'||(typeof S!=='undefined'&&S.role==='parent');
const mq=()=>{try{const m=(parent()?(DOULA&&DOULA.modeles):(ME_DOULA&&ME_DOULA.modeles))||{};return m.marque||{}}catch(e){return {}}};
const logoOk=()=>{const l=mq().logo;return /^data:image\/(png|jpeg|webp);base64,/.test(l||'')?l:''};
if(typeof lireCoul==='function'){const _lc=lireCoul;lireCoul=function(){const m=mq();return (m.pal||m.perso)?{pal:m.pal,perso:m.perso}:_lc()}}
function appliquer(){try{appliquerCoul()}catch(e){}
  const l=logoOk();if(!l)return;
  document.querySelectorAll('img').forEach(i=>{const s=i.getAttribute('src')||'';if(/(^|\/)(logo|logo-icone)\.png$/.test(s)&&i.src!==l){i.setAttribute('src',l);i.style.objectFit='contain'}});
  try{if(typeof LOGO_BYTES!=='undefined'){const b=atob(l.split(',')[1]),u=new Uint8Array(b.length);for(let k=0;k<b.length;k++)u[k]=b.charCodeAt(k);LOGO_BYTES=u}}catch(e){}}
new MutationObserver(()=>{if(logoOk())appliquer()}).observe(document.documentElement,{childList:true,subtree:true});
const _r=render;render=function(){const x=_r.apply(this,arguments);try{appliquer();bienvenue()}catch(e){}return x};
async function sauver(patch){const m=Object.assign({},ME_DOULA.modeles||{});m.marque=Object.assign({},m.marque||{},patch);Object.keys(m.marque).forEach(k=>{if(m.marque[k]==null)delete m.marque[k]});if(await sauverModeles(m)){appliquer();return true}return false}
function reduire(f,max){return new Promise((ok,ko)=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*k));c.height=Math.max(1,Math.round(im.height*k));c.getContext('2d').drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/png'))};im.onerror=ko;im.src=fr.result};fr.onerror=ko;fr.readAsDataURL(f)})}
const MODES={modele:['Les modèles de l\'Académie','Contrat, formulaire d\'accueil, consentement… prêts à l\'emploi. Vous pouvez les modifier à votre goût dans « Mes modèles ». Ce sont des exemples basés sur les documents de l\'Académie Sérénaissance : faites-les valider pour votre pratique.'],
 perso:['Mes propres documents','Vous téléversez vos documents (PDF ou image) dans le dossier d\'une famille, avec « À faire signer dans l\'appli ». La famille les lit et les signe avec son doigt, comme les autres.']};
function choixDocs(cur){return Object.keys(MODES).map(k=>'<button class="cl" data-act="mqDocs" data-v="'+k+'" style="text-align:left;'+(cur===k?'border:2px solid var(--accent)':'')+'"><div class="av">'+icon(cur===k?'fa-check':'fa-file-lines')+'</div><div style="flex:1"><b>'+MODES[k][0]+'</b><p class="xs muted" style="margin:2px 0 0">'+MODES[k][1]+'</p></div></button>').join('')}
if(typeof DSUB!=='undefined'){DSUB.marque=function(){const m=mq(),l=logoOk(),c=lireCoul(),cur=PALETTES[c.pal]?c.pal:'terracotta',acc=c.perso||PALETTES[cur].accent;
  return sh('Mon image de marque','Votre logo, vos couleurs et vos documents : vos familles les voient dans leur appli.')+
  '<div class="card"><span class="eyebrow acc">Mon logo</span><div class="row" style="gap:14px;align-items:center;flex-wrap:nowrap"><div style="width:96px;height:64px;border:1px dashed var(--line);border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--card);flex:none">'+(l?'<img src="'+l+'" alt="" style="max-width:100%;max-height:100%;object-fit:contain">':'<span class="xs muted">Aucun</span>')+'</div><div class="stack" style="gap:6px"><label class="btn sm ghost" style="cursor:pointer">'+icon('fa-upload')+(l?'Changer':'Téléverser')+' mon logo<input type="file" id="mqLogo" accept="image/*" hidden></label>'+(l?'<button class="btn sm ghost" data-act="mqLogoDel">Retirer</button>':'')+'</div></div><p class="xs muted">Il remplace le logo de l\'Académie en haut de l\'appli, sur vos documents et sur vos PDF. Un fond transparent (PNG) est idéal.</p></div>'+
  '<div class="card"><span class="eyebrow acc">Mes couleurs</span><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:6px">'+Object.keys(PALETTES).map(k=>{const p=PALETTES[k];return '<button class="cl" data-act="mqPal" data-v="'+k+'" style="'+(k===cur&&!c.perso?'border:2px solid '+p.accent:'')+';background:'+p.bg+'"><span style="display:flex;gap:4px"><i style="width:22px;height:22px;border-radius:50%;background:'+p.accent+'"></i><i style="width:22px;height:22px;border-radius:50%;background:'+p.sage+'"></i></span><b>'+p.n+'</b></button>'}).join('')+'</div><label class="f" style="margin-top:10px">Ma couleur principale<input type="color" id="mqPerso" value="'+acc+'" style="height:48px;padding:4px"></label><div class="row" style="gap:8px"><button class="btn sm" data-act="mqCoul">Utiliser cette couleur</button><button class="btn sm ghost" data-act="mqReset">Revenir à la palette</button></div></div>'+
  '<div class="card"><span class="eyebrow acc">Mes documents</span><div class="stack" style="gap:8px;margin-top:6px">'+choixDocs(m.docs)+'</div>'+(m.docs==='perso'?'<p class="xs muted">Pour en envoyer un : ouvrez une famille › Documents › « Mon propre document ».</p>':'<button class="btn sm ghost" data-act="dgo" data-v="outils|modeles" style="margin-top:8px">'+icon('fa-pen')+'Modifier mes modèles</button>')+'</div>'+
  '<p class="xs muted" style="text-align:center">Cette appli est offerte par l\'Académie Sérénaissance. Le logo de l\'Académie reste au bas des pages.</p>'};
DSUB.couleurs=DSUB.marque;try{const o=DOUT.find(x=>x[0]==='couleurs');if(o){o[1]='fa-palette';o[2]='Mon image de marque';o[3]='Logo, couleurs et documents'}}catch(e){}}
function bienvenue(){if(parent()||S.role!=='doula'||!ME_DOULA||!(typeof MOI!=='undefined'&&MOI&&MOI.doula)||MOI.admin||mq().docs||window._mqVu||document.querySelector('.sheet'))return;
  try{if(localStorage.getItem('sere-mq-vu'))return}catch(e){}
  window._mqVu=1;sheet('Bienvenue 🌿','<p class="small">Deux choix pour que l\'appli soit vraiment à vous. Vous pourrez les changer en tout temps dans Outils › Mon image de marque.</p><div class="stack" style="gap:8px"><span class="eyebrow acc">Mes documents</span>'+choixDocs('')+'</div><button class="btn ghost" data-act="mqPlusTard">Plus tard</button>')}
document.addEventListener('click',async e=>{const x=e.target.closest('[data-act]');if(!x)return;const a=x.dataset.act;if(a.slice(0,2)!=='mq')return;e.stopPropagation();
  if(a==='mqPal'){if(await sauver({pal:x.dataset.v,perso:null}))render()}
  else if(a==='mqCoul'){const v=document.getElementById('mqPerso').value;if(await sauver({perso:v}))render()}
  else if(a==='mqReset'){if(await sauver({pal:null,perso:null}))render()}
  else if(a==='mqLogoDel'){if(await sauver({logo:null}))location.reload()}
  else if(a==='mqDocs'){if(await sauver({docs:x.dataset.v})){$('#layer').innerHTML='';toast('Choix enregistré');render()}}
  else if(a==='mqPlusTard'){try{localStorage.setItem('sere-mq-vu','1')}catch(e){}$('#layer').innerHTML=''}},true);
document.addEventListener('change',async e=>{const i=e.target.closest('#mqLogo');if(!i||!i.files[0])return;const f=i.files[0];
  if(!/^image\//.test(f.type)){toast('Choisissez une image');i.value='';return}
  try{let u=await reduire(f,480);if(u.length>400000)u=await reduire(f,300);if(u.length>400000){toast('Image trop lourde');return}
    if(await sauver({logo:u})){toast('Logo enregistré');render()}}catch(x){toast('Image illisible')}i.value=''});
})();
