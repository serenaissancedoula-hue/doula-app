/* Sérénaissance — « Mon bébé en 3D » : vrai modèle 3D (Sketchfab, « Human Fetus / Stages of fetal development » par arloopa),
   affiché avec le lecteur officiel de Sketchfab. Chaque semaine, on montre le stade le plus proche
   et bébé grossit un peu jusqu'au stade suivant. Le texte de la semaine vient de SEMAINES (bebe-donnees.js).
   Ajoutez ?bebe3d=debug à l'adresse pour voir la liste des stades trouvés dans le modèle. */
/* Modèle choisi : « Fetus (animated) » par Ebers (un seul bébé). Pour une série par stades, mettre BEBE3D_STADES=true. */
/* Modèle : « Human Fetus / Stages of fetal development » par arloopa. Son animation fait grandir bébé :
   on l'arrête au moment qui correspond à la semaine (image fixe, qu'on peut faire tourner).
   BEBE3D_TEMPS permet d'ajuster le moment exact de chaque semaine après un essai : [[semaine, secondes], ...]. */
const BEBE3D_UID='db86ba90c4d3400f8fada9ffa8bf3c55';
const BEBE3D_STADES=false;
const BEBE3D_ANIM=true;
const BEBE3D_TEMPS=null;
/* Teintes de peau : multiplient la couleur d'origine du modèle. */
const BEBE3D_PEAUX=[['Naturelle',[1,1,1],'#efb6a6'],['Dorée',[.93,.8,.66],'#d9a37f'],['Mate',[.78,.6,.46],'#b9825f'],['Brune',[.6,.43,.31],'#8e5d40'],['Foncée',[.44,.3,.21],'#63402c']];
const BEBE3D_SENS=[
  [4,8,'Ses sens ne fonctionnent pas encore : le cerveau, le cœur et la moelle épinière se mettent en place.'],
  [9,13,'Il réagit au toucher : quand sa main frôle sa bouche, il bouge. Il ne voit et n\'entend pas encore.'],
  [14,17,'Ses papilles se forment. Il perçoit une lumière forte à travers ses paupières fermées.'],
  [18,22,'Il commence à entendre : votre cœur, votre respiration, les bruits de votre ventre, puis votre voix.'],
  [23,27,'Il entend de mieux en mieux et peut sursauter à un bruit fort. Il goûte le liquide amniotique, qui change selon ce que vous mangez.'],
  [28,31,'Il reconnaît votre voix et celle de vos proches. Ses yeux s\'ouvrent : il perçoit la lumière à travers le ventre.'],
  [32,35,'Le langage s\'installe : il s\'habitue à la mélodie et au rythme de votre langue, et peut se souvenir d\'une chanson souvent entendue.'],
  [36,42,'Tous ses sens sont prêts. À la naissance, il reconnaîtra votre voix, votre odeur et le battement de votre cœur.']];
function bebe3dSens(w){const s=BEBE3D_SENS.find(x=>w>=x[0]&&w<=x[1]);return s?s[2]:''}
function bebe3dEsc(t){return String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

/* Lecteur Sketchfab */
let _b3={api:null,stades:[],pret:false,w:20,dernier:-1,cb:[]};
function bebe3dChargerAPI(){return new Promise((ok,ko)=>{if(window.Sketchfab)return ok();
  const s=document.createElement('script');s.src='https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';s.onload=()=>ok();s.onerror=ko;document.head.appendChild(s)})}
function bebe3dNum(n){const m=String(n||'').match(/(\d+(?:[.,]\d+)?)/);return m?parseFloat(m[1].replace(',','.')):null}
/* Trouve les stades : le premier niveau du modèle qui contient plusieurs groupes. */
function bebe3dStades(map){
  const nodes=Object.values(map),enfants=new Set();nodes.forEach(n=>(n.children||[]).forEach(c=>enfants.add(c.instanceID)));
  let n=nodes.find(x=>!enfants.has(x.instanceID));let garde=0;
  while(n&&n.children&&n.children.length===1&&garde++<12)n=map[n.children[0].instanceID]||n.children[0];
  let st=(n&&n.children||[]).map(c=>map[c.instanceID]||c).filter(c=>c.type!=='Geometry'||true);
  // tri par numéro dans le nom (ex. « Week 12 »), sinon ordre du modèle
  const nums=st.map(s=>bebe3dNum(s.name));
  if(nums.every(v=>v!==null))st=st.map((s,i)=>({s,v:nums[i]})).sort((a,b)=>a.v-b.v).map(o=>o.s);
  return st.map((s,i)=>{const v=bebe3dNum(s.name);return{id:s.instanceID,nom:s.name,sem:(v!==null&&v>=4&&v<=42)?v:null}})}
function bebe3dSemainesStades(){const S=_b3.stades;if(!S.length)return;
  if(S.some(s=>s.sem===null)){const a=8,b=40;S.forEach((s,i)=>s.sem=S.length===1?20:Math.round(a+(b-a)*i/(S.length-1)))}}
function bebe3dChoix(w){const S=_b3.stades;let i=0;for(let k=0;k<S.length;k++)if(S[k].sem<=w)i=k;
  const cur=S[i],nxt=S[i+1];let f=1;
  if(nxt&&w<nxt.sem){const t=(w-cur.sem)/(nxt.sem-cur.sem);f=1+.18*Math.max(0,Math.min(1,t))} // il grossit un peu chaque semaine
  else if(!nxt&&w>cur.sem)f=1+.03*Math.min(4,w-cur.sem);
  if(w<cur.sem)f=Math.max(.75,1-.06*(cur.sem-w));
  return{i,f:1}} // bébé reste fixe : il change seulement quand on passe à un autre stade
function bebe3dMontrer(w){_b3.w=w;const api=_b3.api;if(api&&_b3.anim)bebe3dTemps(w);if(!api||!_b3.stades.length)return;
  const {i,f}=bebe3dChoix(w),S=_b3.stades;
  const echelle=()=>{const s=S[i];if(!s.base)return;const m=s.base.slice();for(const k of[0,1,2,4,5,6,8,9,10])m[k]*=f;api.setMatrix(s.id,m)};
  if(i!==_b3.dernier){S.forEach((s,k)=>{k===i?api.show(s.id):api.hide(s.id)});
    const s=S[i];const go=()=>{if(s.base)api.setMatrix(s.id,s.base);setTimeout(()=>{try{api.focusOnVisibleGeometries(()=>setTimeout(echelle,250))}catch(e){echelle()}},120)};
    if(!s.base)api.getMatrix(s.id,(e,mat)=>{if(!e&&mat)s.base=Array.from(mat.local);go()});else go();
    _b3.dernier=i}else echelle();
  const d=document.getElementById('b3Debug');if(d)d.textContent='Stade affiché : '+S[i].nom+' (semaine '+S[i].sem+') · taille ×'+f.toFixed(2)}
function bebe3dMonter(conteneur,w){
  conteneur.innerHTML='<iframe title="Bébé en 3D" class="b3-iframe" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen></iframe><div class="b3-charge">Chargement de bébé…</div>';
  const fr=conteneur.querySelector('iframe'),charge=conteneur.querySelector('.b3-charge');_b3.w=w;_b3.dernier=-1;
  bebe3dChargerAPI().then(()=>{
    const client=new Sketchfab('1.12.1',fr);
    client.init(BEBE3D_UID,{autostart:1,animation_autoplay:0,preload:1,transparent:1,camera:0,dnt:1,ui_hint:0,ui_infos:0,ui_controls:0,ui_stop:0,ui_inspector:0,ui_help:0,ui_settings:0,ui_vr:0,ui_ar:0,ui_fullscreen:0,ui_annotations:0,ui_loading:0,ui_theme:'dark',
      success(api){_b3.api=api;api.start();api.addEventListener('viewerready',()=>{charge.hidden=true;
        api.getMaterialList((e,mats)=>{if(!e&&mats){_b3.mats=mats;const dbg=document.getElementById('b3Liste');if(dbg)dbg.textContent+=' · Matériaux : '+mats.map(m=>m.name).join(', ');bebe3dPeau(_b3.peau||0)}});
        if(BEBE3D_ANIM)api.getAnimations((e,an)=>{if(e||!an||!an.length){const d=document.getElementById('b3Liste');if(d)d.textContent+=' · Aucune animation dans ce modèle';return}
          an.sort((a,b)=>b[2]-a[2]);_b3.anim={uid:an[0][0],nom:an[0][1],duree:an[0][2]};
          const d=document.getElementById('b3Liste');if(d)d.textContent+=' · Animations : '+an.map(a=>a[1]+' ('+a[2].toFixed(1)+' s)').join(', ');
          api.setCurrentAnimationByUID(_b3.anim.uid,()=>{api.pause();bebe3dTemps(_b3.w)})});
        if(!BEBE3D_STADES)return;
        api.getNodeMap((e,map)=>{if(e||!map)return;_b3.stades=bebe3dStades(map);bebe3dSemainesStades();
          const dbg=document.getElementById('b3Liste');if(dbg)dbg.textContent='Stades trouvés ('+_b3.stades.length+') : '+_b3.stades.map(s=>s.nom+' → sem. '+s.sem).join(' | ');
          if(_b3.stades.length>1)bebe3dMontrer(_b3.w)})})},
      error(){charge.textContent='Impossible de charger bébé en 3D. Vérifiez votre connexion Internet.'}})
  }).catch(()=>{charge.textContent='Impossible de charger bébé en 3D. Vérifiez votre connexion Internet.'})}

/* Texte de la semaine */
function bebe3dTexte(w){
  const I=(typeof SEMAINES!=='undefined')?SEMAINES.find(s=>s[0]===Math.max(4,Math.min(42,w))):null;
  const M=(typeof mouvement==='function')?mouvement(w):null;
  let f=null;try{if(typeof fruit==='function')f=fruit(w)}catch(e){}
  const em=f&&typeof FRUIT_EMOJI!=='undefined'?(FRUIT_EMOJI[f[0]]||'🌱'):'';
  const bloc=(t,x)=>x?'<div class="b3-bloc"><b>'+t+'</b><p>'+bebe3dEsc(x)+'</p></div>':'';
  return (f?'<p class="b3-taille">'+em+' Grosseur '+(typeof art==='function'?art(f[0]):'d\'un·e ')+bebe3dEsc(f[0])+' · environ '+String(f[1]).replace('.',',')+' cm</p>':'')+
    (w<4?'<p class="b3-taille">Votre grossesse commence : bébé n\'est pas encore visible.</p>':'')+
    bloc('Ce que bébé fait cette semaine',I?I[1]:'')+
    bloc('Ses mouvements',M?M[2]:'')+
    bloc('Ce qu\'il entend et ressent',bebe3dSens(w))+
    bloc('À quoi vous attendre',I?I[2]:'')+
    bloc('Petit conseil',I?I[3]:'')}

/* Couleur de peau : on teinte les matériaux du bébé (pas le placenta ni le cordon). */
function bebe3dPeau(i){_b3.peau=i;const api=_b3.api,mats=_b3.mats;if(!api||!mats)return;
  const c=BEBE3D_PEAUX[i][1],exclu=/placenta|cord|umbil|uter|amnio|sac|vein|arter|blood|eye|oeil|nail|ongle/i;
  let cibles=mats.filter(m=>/skin|body|fetus|foetus|baby|peau|bebe/i.test(m.name));if(!cibles.length)cibles=mats.filter(m=>!exclu.test(m.name));
  cibles.forEach(m=>{const ch=m.channels||{};
    for(const k of['AlbedoPBR','DiffusePBR','DiffuseColor','SubsurfaceScattering']){if(ch[k]){if(!m._orig)m._orig={};if(!m._orig[k])m._orig[k]=(ch[k].color||[1,1,1]).slice();const o=m._orig[k];ch[k].color=[o[0]*c[0],o[1]*c[1],o[2]*c[2]]}}
    api.setMaterial(m,()=>{})})}

/* Animation : moment de l'animation pour une semaine donnée, puis pause (bébé fixe). */
function bebe3dTemps(w){const api=_b3.api,A=_b3.anim;if(!api||!A)return;
  let t;const T=BEBE3D_TEMPS;
  if(T&&T.length){let a=T[0],b=T[T.length-1];for(let k=0;k<T.length-1;k++)if(w>=T[k][0]&&w<=T[k+1][0]){a=T[k];b=T[k+1];break}
    t=b[0]===a[0]?a[1]:a[1]+(b[1]-a[1])*(w-a[0])/(b[0]-a[0])}
  else t=A.duree*Math.max(0,Math.min(1,(w-4)/36));
  t=Math.max(0,Math.min(A.duree-.05,t));
  api.pause();api.seekTo(t);setTimeout(()=>{try{api.pause()}catch(e){}},150);
  const d=document.getElementById('b3Debug');if(d)d.textContent='Semaine '+w+' → '+t.toFixed(2)+' s sur '+A.duree.toFixed(1)+' s ('+A.nom+')'}
