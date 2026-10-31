/* Sérénaissance — « Mon bébé » : grande carte d'accueil et plein écran (Espace Famille).
   Carte : grande image de la semaine, « Bonjour, <prénom> », bouton Ouvrir, puis un rectangle « Vous et <bébé> » avec les semaines de cohabitation qui restent.
   Plein écran : le cœur de bébé s'entend, on glisse le doigt vers la gauche ou la droite pour voir les autres semaines.
   Le prénom est celui de la personne connectée (maman ou papa); « bébé » est remplacé par son prénom s'il est choisi. */
(function(){
if(typeof carteBebe!=='function'||typeof stage!=='function'||typeof coeurDemarrer!=='function')return;
const SEM_MIN=4,SEM_MAX=42;
const cl=w=>Math.max(SEM_MIN,Math.min(SEM_MAX,w));
const VID=[];const vid=w=>'img/bebe/semaine-'+String(cl(w)).padStart(2,'0')+'.mp4';
const img=w=>'img/bebe/semaine-'+String(cl(w)).padStart(2,'0')+'.jpg?v=11';
const nomBebe=()=>{try{return ((S.parent.naissance||{}).prenomBebe||'').trim()}catch(e){return ''}};
function prenomMoi(){try{let p=(typeof PAPA!=='undefined'&&PAPA)?(PAPA.prenom||'Papa'):((S.parent&&S.parent.prenom)||'');return p&&p!=='Exemple'?p:''}catch(e){return ''}}
const salut=()=>{const h=new Date().getHours();return h>=5&&h<18?'Bonjour':'Bonsoir'};
function cohab(g){
  if(g.left<=0)return 'Votre bébé peut arriver à tout moment 💗';
  const s=Math.floor(g.left/7),j=g.left%7;
  const sem=s>0?'<b>'+s+' semaine'+(s>1?'s':'')+'</b>':'',jr=j>0?(s>0?' et ':'')+'<b>'+j+' jour'+(j>1?'s':'')+'</b>':'';
  return 'Il vous reste '+sem+jr+' de cohabitation';
}
function rectangle(g){
  const n=nomBebe(),tri=g.w<14?'1er trimestre':g.w<28?'2e trimestre':'3e trimestre';
  const dpa=g.dpa?(' · prévu le '+g.dpa.toLocaleDateString('fr-CA',{day:'numeric',month:'long'})):'';
  return '<div class="bh-bas"><div class="bh-v">Vous et '+(n?esc(n):'bébé')+'</div><div class="bh-c">'+cohab(g)+'</div>'+
    '<div class="prog"><i style="width:'+Math.min(100,Math.max(0,g.gaDays/280*100))+'%"></i></div><div class="xs muted">'+tri+dpa+'</div></div>';
}
function hero(g){
  const w=cl(g.w),pr=prenomMoi();
  return '<button type="button" class="bh-hero" data-bh="ouvrir" aria-label="Voir bébé en grand et entendre son cœur">'+
    '<img src="'+img(w)+'" alt="Bébé à '+w+' semaines" decoding="async">'+
    '<span class="bh-haut"><small>'+salut()+(pr?',':'')+'</small>'+(pr?'<b>'+esc(pr)+'</b>':'')+'</span>'+
    '<span class="bh-bs"><span class="bh-sem">Semaine '+w+(g.d?' + '+g.d+' j':'')+'</span><span class="bh-ouvrir">Ouvrir '+icon('fa-expand')+'</span></span></button>'+rectangle(g);
}
const _cb=carteBebe;
carteBebe=function(g){let h=_cb(g);
  try{const st=stage();if(st.k!=='preg')return h;
    if(!/<div class="bb2-tete">/.test(h)||!/<h2 class="bb2-h">/.test(h))return h;
    h=h.replace(/<div class="bb2-tete">[\s\S]*?(?=<h2 class="bb2-h">)/,hero(g))}catch(e){}
  return h};

/* ---------- plein écran ---------- */
let SEM=0;
function vue(w){const f=fruit(w),I=infoSemaine(w)||[],M=mouvement(w),b=bpm(w),st=stage(),g=st.g,cur=cl(g.w);
  const rel=w===cur?'Cette semaine':w<cur?'Il y a '+(cur-w)+' semaine'+(cur-w>1?'s':''):'Dans '+(w-cur)+' semaine'+(w-cur>1?'s':'');
  const poids=f[2]?(f[2]>=1000?cm((f[2]/1000).toFixed(2))+' kg':f[2]+' g'):'< 1 g';
  const pr=prenomMoi();
  return '<div class="bh-top"><span class="bh-sal">'+salut()+(pr?', <b>'+esc(pr)+'</b>':'')+'</span><button type="button" class="bh-x" data-bh="fermer" aria-label="Fermer">'+icon('fa-xmark')+'</button></div>'+
    '<div class="bh-img" id="bhImg"'+(w>=28?' data-k="2"':w>=20?' data-k="1"':'')+'><div class="bh-fond" style="background-image:url(\''+img(w)+'\')"></div><div class="bh-spin'+(VID.indexOf(w)>=0?' vid':'')+'">'+(VID.indexOf(w)>=0?'<video src="'+vid(w)+'" poster="'+img(w)+'" autoplay muted loop playsinline webkit-playsinline disablepictureinpicture draggable="false"></video>':'<img src="'+img(w)+'" alt="Bébé à '+w+' semaines" draggable="false">')+'</div>'+(b?'<button type="button" class="bh-coeur'+(S.sonCoeur?'':' off')+'" data-bh="son" aria-label="Arrêter ou remettre le son du cœur" style="animation-duration:'+(60/b*2).toFixed(2)+'s">'+icon('fa-heart')+'</button>':'')+'</div>'+
    '<div class="bh-nav"><button type="button" data-bh="prev" aria-label="Semaine précédente"'+(w<=SEM_MIN?' disabled':'')+'>'+icon('fa-chevron-left')+'</button><span class="bh-rel">'+rel+'</span><button type="button" data-bh="next" aria-label="Semaine suivante"'+(w>=SEM_MAX?' disabled':'')+'>'+icon('fa-chevron-right')+'</button></div>'+
    '<div class="bh-mes"><div><small>Poids</small><b>≈ '+poids+'</b></div><div><small>Longueur</small><b>≈ '+cm(f[1])+' cm</b></div><div class="bh-gs"><b>'+w+'</b><small>semaines</small></div></div>'+
    '<div class="bh-pan"><div class="bh-pt"><b>'+esc((((window.SEM_PLUS||{})[w])||[])[0]||'Votre bébé cette semaine')+'</b></div>'+
    '<p>'+esc(I[1]||'')+'</p><p>'+(w>=7?'<b>Ses mouvements :</b> ':'')+esc(M[2])+'</p><p class="bh-note">'+(b?'Son du cœur : une illustration, pas le vrai cœur de votre bébé.':'Le cœur de bébé commence à battre très tôt, mais on ne l\'entend pas encore à cette étape.')+' Glissez le doigt à gauche ou à droite pour changer de semaine.</p></div>'+
    rectangle(g)};
function coeur(w){try{coeurArreter()}catch(e){}const b=bpm(w);if(b&&S.sonCoeur){try{coeurDemarrer(b)}catch(e){}}}
function dessiner(){const d=document.getElementById('bhPE');if(!d)return;d.innerHTML=vue(SEM);coeur(SEM);d.scrollTop=0}
function aller(w){w=cl(w);if(w===SEM)return;SEM=w;dessiner()}
function ouvrir(){const st=stage();if(st.k!=='preg')return;fermer();SEM=cl(st.g.w);
  const d=document.createElement('div');d.id='bhPE';d.setAttribute('role','dialog');d.setAttribute('aria-label','Mon bébé en plein écran');
  document.body.appendChild(d);document.body.style.overflow='hidden';S.sonCoeur=true;dessiner()}
function fermer(){try{coeurArreter()}catch(e){}S.sonCoeur=false;const d=document.getElementById('bhPE');if(d)d.remove();document.body.style.overflow=''}
ouvrirBebePE=ouvrir;fermerBebePE=fermer;
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-bh]');if(!b)return;if(e.target.closest('[data-act]'))return;e.stopPropagation();e.preventDefault();
  const a=b.dataset.bh;
  if(a==='ouvrir')ouvrir();else if(a==='fermer')fermer();else if(a==='prev')aller(SEM-1);else if(a==='next')aller(SEM+1);
  else if(a==='son'){if(S.sonCoeur){try{coeurArreter()}catch(x){}S.sonCoeur=false}else{S.sonCoeur=true;coeur(SEM)}const bt=document.querySelector('#bhPE .bh-coeur');if(bt){bt.classList.toggle('off',!S.sonCoeur);bt.innerHTML=icon('fa-heart')}}},true);
/* glisser : à gauche = semaine suivante, à droite = semaine précédente */
let x0=null,y0=null;
document.addEventListener('touchstart',e=>{if(!e.target.closest||!e.target.closest('#bhPE .bh-img'))return;const t=e.touches[0];x0=t.clientX;y0=t.clientY},{passive:true});
document.addEventListener('touchend',e=>{if(x0==null)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)aller(SEM+(dx<0?1:-1))},{passive:true});
document.addEventListener('keydown',e=>{if(!document.getElementById('bhPE'))return;if(e.key==='Escape')fermer();else if(e.key==='ArrowRight')aller(SEM+1);else if(e.key==='ArrowLeft')aller(SEM-1)});

const st=document.createElement('style');st.textContent=
'.bh-hero{position:relative;display:block;width:100%;padding:0;border:0;border-radius:28px;overflow:hidden;aspect-ratio:4/5;max-height:68vh;cursor:pointer;background:#2a1f1b;color:#fff;font:inherit;text-align:left;box-shadow:0 8px 24px rgba(60,30,20,.22)}'+
'.bh-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}'+
'.bh-hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 62%,rgba(0,0,0,.55) 100%);pointer-events:none}'+
'.bh-haut{position:absolute;left:18px;top:16px;z-index:1;display:grid;gap:0;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.45)}.bh-haut small{font-size:.95rem;opacity:.95}.bh-haut b{font-family:var(--serif,inherit);font-size:1.5rem;line-height:1.15}'+
'.bh-bs{position:absolute;left:18px;right:16px;bottom:16px;z-index:1;display:flex;justify-content:space-between;align-items:center;gap:10px}.bh-sem{font-weight:700;font-size:1.05rem;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.5)}'+
'.bh-ouvrir{display:inline-flex;gap:8px;align-items:center;background:rgba(255,255,255,.92);color:#3b2a24;border-radius:999px;padding:9px 16px;font-weight:700;font-size:.92rem}'+
'.bh-bas{margin-top:12px;border-radius:22px;padding:14px 16px;background:var(--card,#fffaf6);border:1px solid var(--line,#e6d9d0);display:grid;gap:8px;color:var(--ink,#2c221e)}.bh-v{font-family:var(--serif,inherit);font-size:1.2rem;font-weight:700}.bh-c{font-size:.98rem;line-height:1.4}.bh-bas .prog{margin:0}'+
'#bhPE{position:fixed;inset:0;z-index:99990;overflow-y:auto;-webkit-overflow-scrolling:touch;background:linear-gradient(180deg,#e8cdbd 0%,#3b2a24 46%,#1c1714 100%);color:#fff;padding:max(14px,env(safe-area-inset-top)) 16px max(24px,env(safe-area-inset-bottom));display:grid;gap:14px;align-content:start}'+
'.bh-top{display:flex;justify-content:space-between;align-items:center}.bh-sal{font-size:1rem;color:#3b2a24}.bh-sal b{font-family:var(--serif,inherit);font-size:1.25rem}'+
'.bh-x,.bh-nav button,.bh-son{border:0;cursor:pointer;display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.9);color:#3b2a24;font-size:1.05rem}.bh-nav button:disabled{opacity:.35}'+
'.bh-btns{display:flex;gap:8px;align-items:center}.bh-img{perspective:900px}.bh-spin{width:100%;height:100%;transition:transform .9s cubic-bezier(.4,.1,.2,1);transform-style:preserve-3d}.bh-spin.flip{transform:rotateY(180deg)}'+
'@keyframes bhCoup{0%,62%,100%{transform:none}66%{transform:translate(1.4%,-1.6%) scale(1.035) rotate(1.2deg)}70%{transform:none}75%{transform:translate(-1%,1.2%) scale(1.025) rotate(-.8deg)}80%{transform:none}}@keyframes bhCoupF{0%,40%,100%{transform:none}44%{transform:translate(2%,-2.4%) scale(1.05) rotate(1.8deg)}48%{transform:none}53%{transform:translate(-1.6%,1.8%) scale(1.04) rotate(-1.4deg)}57%{transform:none}84%{transform:translate(1.2%,-1.2%) scale(1.03)}88%{transform:none}}@keyframes bhFlotte{0%,100%{transform:translate(0,0) rotate(0)}25%{transform:translate(-1.2%,-1.6%) rotate(-1.4deg)}50%{transform:translate(.8%,-.4%) rotate(1deg)}75%{transform:translate(1.2%,1.4%) rotate(1.6deg)}}@keyframes bhBat{0%,100%{transform:scale(1);opacity:.85}12%{transform:scale(1.35);opacity:1}24%{transform:scale(1);opacity:.85}36%{transform:scale(1.2);opacity:1}50%{transform:scale(1)}}.bh-img{position:relative}.bh-img[data-k="1"] img{animation:bhCoup 7s ease-out infinite}.bh-img[data-k="2"] img{animation:bhCoupF 6s ease-out infinite}.bh-img img{transform-origin:50% 55%}.bh-spin{animation:bhFlotte 9s ease-in-out infinite}.bh-coeur{position:absolute;right:16px;top:14px;color:#ff6b86;font-size:24px;filter:drop-shadow(0 0 6px rgba(255,80,110,.8));animation:bhBat .86s ease-in-out infinite;border:0;background:rgba(0,0,0,.28);width:46px;height:46px;border-radius:50%;display:grid;place-items:center;cursor:pointer;z-index:4}.bh-coeur.off{animation:none;opacity:.7;color:#fff;filter:none;position:absolute}.bh-coeur.off::after{content:"";position:absolute;width:30px;height:3px;background:#fff;border-radius:2px;transform:rotate(-40deg);box-shadow:0 0 0 1.5px rgba(0,0,0,.4)}@media (prefers-reduced-motion:reduce){.bh-img img,.bh-coeur,.bh-spin{animation:none!important}}'+
'.bh-img{width:calc(100% + 32px);height:100vh;height:100dvh;margin:calc(-1*max(14px,env(safe-area-inset-top))) -16px 0;border-radius:0;overflow:hidden;background:#120d10;display:grid;place-items:center;touch-action:pan-y}.bh-img::after{content:"";position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(180deg,transparent,rgba(20,12,10,.85));pointer-events:none}.bh-fond{position:absolute;inset:-30px;background-size:cover;background-position:center;filter:blur(28px) brightness(.75) saturate(1.1)}.bh-spin{position:relative;width:100%;height:auto!important;aspect-ratio:1;-webkit-mask-image:linear-gradient(180deg,transparent,#000 14%,#000 86%,transparent);mask-image:linear-gradient(180deg,transparent,#000 14%,#000 86%,transparent)}#bhPE .bh-top{position:absolute;left:16px;right:16px;top:max(14px,env(safe-area-inset-top));z-index:3}#bhPE .bh-sal{color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.6)}#bhPE .bh-nav,#bhPE .bh-mes{position:absolute;left:16px;right:16px;z-index:3}#bhPE .bh-nav{top:calc(100dvh - 168px)}#bhPE .bh-mes{top:calc(100dvh - 108px);text-shadow:0 1px 6px rgba(0,0,0,.7)}.bh-coeur{top:calc(max(14px,env(safe-area-inset-top)) + 58px)!important}.bh-img video{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}.bh-spin.vid{animation:none}.bh-img img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;user-select:none;-webkit-user-select:none}'+
'.bh-nav{display:flex;justify-content:space-between;align-items:center}.bh-rel{font-weight:700;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.4)}'+
'.bh-mes{display:grid;grid-template-columns:1fr 1fr auto;gap:12px;align-items:end;color:#fff}.bh-mes small{display:block;font-size:.8rem;opacity:.8}.bh-mes b{font-size:1.25rem}.bh-gs{text-align:right}.bh-gs b{font-family:var(--serif,inherit);font-size:2.6rem;line-height:1;display:block}'+
'.bh-pan{border-radius:24px;padding:16px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.12);display:grid;gap:8px;color:#fff}.bh-pt{display:flex;justify-content:space-between;align-items:center;gap:10px}.bh-pt b{font-family:var(--serif,inherit);font-size:1.2rem}.bh-pan p{margin:0;line-height:1.5}.bh-note{font-size:.78rem;opacity:.75}'+
'#bhPE .bh-bas{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.12);color:#fff;margin-top:0}#bhPE .bh-bas .xs{color:rgba(255,255,255,.75)}';
document.head.appendChild(st);
})();
