/* Sérénaissance — « Mon bébé » : illustration originale du bébé qui grandit semaine après semaine,
   cœur qui bat (et qu'on peut écouter), bébé qu'on peut faire tourner du doigt.
   La semaine suit la date prévue : elle change seulement quand la date change, comme dans les applis de grossesse.
   Après la naissance, les étapes de bébé semaine par semaine. */
function bpm(w){return w<6?0:w<=9?Math.round(110+(w-6)*20):Math.max(140,Math.round(170-(w-9)*1.5))}
function infoSemaine(w){return SEMAINES.find(s=>s[0]===Math.max(4,Math.min(42,w)))}
function echelle(w){return 1.55*Math.max(.14,Math.min(1,.14+.86*Math.pow((Math.max(4,w)-4)/36,.75)))}
/* Illustration : embryon (avant 9 semaines), puis fœtus de plus en plus potelé. */
function dessinBebe(w){const peau='#f3c6b1',ombre='#e2a58d',trait='#b5715c',coeur='#c8463a';
  if(w<9){const t=(w-4)/5;return '<g><path d="M62 20 C88 30 86 70 56 82 C44 87 34 80 38 70" fill="none" stroke="'+peau+'" stroke-width="'+(16+t*4)+'" stroke-linecap="round"/><path d="M62 20 C88 30 86 70 56 82 C44 87 34 80 38 70" fill="none" stroke="'+ombre+'" stroke-width="2" stroke-linecap="round" opacity=".5"/><circle cx="60" cy="24" r="'+(13+t*5)+'" fill="'+peau+'"/><circle cx="54" cy="24" r="2" fill="'+trait+'" opacity="'+(.3+t*.6)+'"/>'+(w>=6?'<ellipse cx="78" cy="52" rx="'+(3+t*4)+'" ry="'+(2.5+t*2.5)+'" fill="'+ombre+'"/><ellipse cx="64" cy="76" rx="'+(3+t*4)+'" ry="'+(2.5+t*2.5)+'" fill="'+ombre+'"/>':'')+(w>=6?'<circle class="coeur" cx="70" cy="40" r="4.5" fill="'+coeur+'"/>':'')+'</g>'}
  const c=Math.min(1,(w-9)/31),rh=21-5*c,k=.86+.24*c,o=' stroke="'+ombre+'" stroke-width=".9"';
  const el=(cx,cy,rx,ry,rot)=>'<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" transform="rotate('+rot+' '+cx+' '+cy+')" fill="url(#peau)"'+o+'/>';
  return '<g><path d="M52 72 C46 86 30 92 22 104" fill="none" stroke="#e7b4a2" stroke-width="4.5" stroke-linecap="round"/>'+
   '<g transform="translate(60 68) scale('+k+') translate(-60 -68)"><path d="M36 50 C48 40 76 42 82 64 C86 80 74 94 58 92 C46 90 39 79 36 66 Z" fill="url(#peau)"'+o+'/>'+
   el(56,80,18*k,8.5*k,-18)+el(40,88,13,5.6*k,22)+el(27,82,6,4,-35)+'</g>'+
   '<circle cx="40" cy="'+(34-(21-rh)*.6)+'" r="'+rh+'" fill="url(#peau)"'+o+'/>'+
   '<path d="M'+(40-rh+1)+' '+(36-(21-rh)*.6)+' q -3 2 -.5 4.5" fill="url(#peau)"'+o+'/>'+
   '<path d="M'+(40-rh*.42)+' '+(31-(21-rh)*.6)+' q 3 2.4 6 0" fill="none" stroke="'+trait+'" stroke-width="1.3" stroke-linecap="round"/>'+
   '<path d="M'+(40-rh*.45)+' '+(27-(21-rh)*.6)+' q 3 -1.2 6 0" fill="none" stroke="'+ombre+'" stroke-width=".9" stroke-linecap="round" opacity=".8"/>'+
   '<path d="M'+(40-rh*.78)+' '+(43-(21-rh)*.6)+' q 2.5 1.2 5 0" fill="none" stroke="'+trait+'" stroke-width="1.1" stroke-linecap="round" opacity=".75"/>'+
   '<path d="M'+(40+rh*.35)+' '+(31-(21-rh)*.6)+' c 3 -1 5 2 3 5 c -1 1.5 -3 1 -3 0" fill="none" stroke="'+ombre+'" stroke-width="1.2" stroke-linecap="round"/>'+
   '<circle cx="'+(40-rh*.62)+'" cy="'+(39-(21-rh)*.6)+'" r="2.4" fill="#efb1a0" opacity=".45"/>'+
   el(45,54,11,4.6*k,8)+'<circle cx="'+(33)+'" cy="51" r="'+(4+c)+'" fill="url(#peau)"'+o+'/>'+
   '<circle class="coeur" cx="52" cy="60" r="'+(2.6+c)+'" fill="'+coeur+'" opacity=".85"/></g>'}
function svgBebe(w,id){const s=echelle(w),b=bpm(w);
  return '<div class="bebe-zone" id="'+(id||'bebeZone')+'" style="--bpm:'+(b?60/b:1)+'s"><svg viewBox="0 0 200 200" role="img" aria-label="Illustration de bébé à '+w+' semaines"><defs><radialGradient id="ventre" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#fde9df"/><stop offset="70%" stop-color="#f6cdbb"/><stop offset="100%" stop-color="#eab19c"/></radialGradient><radialGradient id="peau" cx="35%" cy="30%" r="80%"><stop offset="0%" stop-color="#f9dccd"/><stop offset="100%" stop-color="#eeb8a1"/></radialGradient><radialGradient id="lueur" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff6f1" stop-opacity=".9"/><stop offset="100%" stop-color="#fff6f1" stop-opacity="0"/></radialGradient></defs>'+
   '<circle cx="100" cy="100" r="94" fill="url(#ventre)"/><circle class="lueur" cx="100" cy="96" r="70" fill="url(#lueur)"/>'+
   '<circle cx="40" cy="60" r="2" fill="#fff" opacity=".6" class="bulle b1"/><circle cx="160" cy="130" r="2.5" fill="#fff" opacity=".5" class="bulle b2"/><circle cx="140" cy="44" r="1.6" fill="#fff" opacity=".6" class="bulle b3"/>'+
   '<g class="flotte"><g class="tourne" transform="rotate('+(S.bebeRot||0)+' 100 100)"><g transform="translate(100 100) scale('+(S.bebeMiroir?-s:s)+' '+s+') translate(-56 -63)">'+dessinBebe(w)+'</g></g></g></svg></div>'}
function carteBebe(g){const w=Math.max(4,Math.min(42,g.w)),f=fruit(w),I=infoSemaine(w),b=bpm(w),em=FRUIT_EMOJI[f[0]]||'🌱';
  return '<div class="card bebe-carte"><div class="row between"><span class="eyebrow acc">Mon bébé · semaine '+w+'</span><span class="pill acc">'+g.w+' sem. + '+g.d+' j</span></div>'+svgBebe(w)+
   '<div class="row" style="justify-content:center;gap:8px;flex-wrap:wrap">'+(b?'<button class="btn sm" data-act="coeurSon">'+icon(S.sonCoeur?'fa-volume-xmark':'fa-volume-high')+(S.sonCoeur?'Arrêter':'Écouter son cœur')+'</button>':'')+'<button class="btn sm ghost" data-act="bebeTourner" aria-label="Faire tourner bébé">'+icon('fa-rotate-right')+'Tourner</button><button class="btn sm ghost" data-act="bebeMiroir">'+icon('fa-arrows-left-right')+'Retourner</button></div>'+
   '<p class="xs muted" style="text-align:center">Glissez le doigt sur bébé pour le faire tourner.'+(b?' Son cœur bat environ <b>'+b+'</b> fois par minute.':'')+'</p>'+
   '<div class="fruit-l"><span class="fruit-e" aria-hidden="true">'+em+'</span><div><b>Taille '+art(f[0])+esc(f[0])+'</b><p class="small muted num">Environ '+cm(f[1])+' cm'+(f[2]?' · '+(f[2]>=1000?cm((f[2]/1000).toFixed(1))+' kg':f[2]+' g'):'')+' (moyenne)</p></div></div>'+
   '<div class="prog" aria-label="Progression de la grossesse"><i style="width:'+Math.min(100,Math.max(0,g.gaDays/280*100))+'%"></i></div><p class="xs muted num" style="text-align:center">'+(g.left>0?g.left+' jours avant la date prévue':'Date prévue atteinte')+' · semaine '+w+' sur 40</p>'+
   (I?'<div class="grid2 resp"><div class="soft"><b>'+icon('fa-baby')+' Bébé cette semaine</b><p class="small">'+I[1]+'</p></div><div class="soft"><b>'+icon('fa-person-pregnant')+' Vous cette semaine</b><p class="small">'+I[2]+'</p></div></div><div class="banner sage">'+icon('fa-lightbulb')+'<div class="small"><b>Petit conseil :</b> '+I[3]+'</div></div>':'')+
   (w<42?'<details><summary class="small" style="cursor:pointer;color:var(--accent);font-weight:600">La semaine prochaine, en bref</summary><p class="small">'+(infoSemaine(w+1)||[])[1]+'</p></details>':'')+
   '<p class="xs muted">La semaine change toute seule avec votre date prévue. Le son est une illustration, pas le vrai cœur de votre bébé. Information générale : votre équipe de soins reste votre référence.</p></div>'}
/* Après la naissance */
function infoPP(day){return BEBE_PP.find(x=>day>=x[0]&&day<=x[1])||BEBE_PP[BEBE_PP.length-1]}
function svgNouveauNe(){return '<div class="bebe-zone nn"><svg viewBox="0 0 200 140" role="img" aria-label="Bébé endormi dans sa couverture"><ellipse cx="100" cy="122" rx="80" ry="10" fill="#ead9cc"/><g class="respire"><path d="M40 92 C40 60 70 48 112 50 C150 52 168 70 166 92 C164 112 140 118 104 118 C70 118 40 112 40 92 Z" fill="#f6e3d6" stroke="#d9b8a5" stroke-width="1.5"/><path d="M70 60 C95 72 120 74 150 66" fill="none" stroke="#e8c9b6" stroke-width="2"/><path d="M60 100 C90 96 120 96 158 100" fill="none" stroke="#e8c9b6" stroke-width="2"/></g><circle cx="58" cy="76" r="26" fill="#f3c6b1"/><path d="M40 62 C46 46 70 44 80 58" fill="#f6e3d6" stroke="#d9b8a5" stroke-width="1.5"/><path d="M48 78 q4 3 8 0" fill="none" stroke="#b5715c" stroke-width="1.6" stroke-linecap="round"/><path d="M62 78 q4 3 8 0" fill="none" stroke="#b5715c" stroke-width="1.6" stroke-linecap="round"/><circle cx="50" cy="86" r="3.5" fill="#efb1a0" opacity=".6"/><circle cx="72" cy="86" r="3.5" fill="#efb1a0" opacity=".6"/><path d="M57 90 q2 1.5 4 0" fill="none" stroke="#b5715c" stroke-width="1.3" stroke-linecap="round"/><text x="150" y="42" font-size="12" fill="#b5715c" opacity=".7" class="zzz">z</text><text x="160" y="30" font-size="9" fill="#b5715c" opacity=".5" class="zzz z2">z</text></svg></div>'}
function carteBebePP(day){const I=infoPP(day),bb=S.parent.naissance.prenomBebe||'Bébé',sem=Math.floor(day/7)+1,nx=BEBE_PP[BEBE_PP.indexOf(I)+1];
  return '<div class="card bebe-carte"><div class="row between"><span class="eyebrow acc">'+esc(bb)+' · '+(day<56?'semaine '+sem+' de vie':I[2])+'</span><span class="pill sage">'+day+' jour'+(day>1?'s':'')+'</span></div>'+svgNouveauNe()+
   '<h2 style="text-align:center">'+esc(I[2])+'</h2><div class="grid2 resp"><div class="soft"><b>'+icon('fa-baby')+' '+esc(bb)+' en ce moment</b><p class="small">'+I[3]+'</p></div><div class="soft"><b>'+icon('fa-spa')+' Vous</b><p class="small">'+I[4]+'</p></div></div><div class="banner sage">'+icon('fa-lightbulb')+'<div class="small"><b>Ce que disent les études :</b> '+I[5]+'</div></div>'+
   (nx?'<details><summary class="small" style="cursor:pointer;color:var(--accent);font-weight:600">Et ensuite ?</summary><p class="small"><b>'+esc(nx[2])+' :</b> '+nx[3]+'</p></details>':'')+
   '<details><summary class="xs muted" style="cursor:pointer">Sources</summary><ul class="clean xs">'+SOURCES_BEBE.map(s=>'<li><a href="'+s[1]+'" target="_blank" rel="noopener">'+esc(s[0])+'</a></li>').join('')+'</ul></details><p class="xs muted">Chaque bébé a son rythme. Une inquiétude ? Parlez-en à votre équipe, à votre doula, ou appelez Info-Santé 811.</p></div>'}

/* Intégration dans l'accueil et le suivi */
const _pAccB=pAccueil;
pAccueil=function(){let h=_pAccB();const st=stage();
  if(st.k==='preg'){const a=h.indexOf('<div class="card"><div class="ring-wrap">'),q=h.indexOf('<div class="quick">');if(a>=0&&q>a)h=h.slice(0,a)+carteBebe(st.g)+h.slice(q);
    const c=h.indexOf('<div class="card"><span class="eyebrow acc">Cette semaine</span>');if(c>=0){const e=h.indexOf('</div></div></div>',c);if(e>0)h=h.slice(0,c)+h.slice(e+18)}}
  else if(st.k==='pp'){const q=h.indexOf('<div class="quick">');if(q>=0)h=h.slice(0,q)+carteBebePP(st.day)+h.slice(q)}
  return h};
/* Le suivi garde l'explorateur semaine par semaine / jour par jour ; la carte de bébé du jour est seulement à l'accueil (pas de doublon). */
const _pSuiviB=pSuivi;
pSuivi=function(){if(!S._svVu){S.wkSel=null;S.ppSel=null;S._svVu=true}return _pSuiviB()};

/* Le cœur qu'on entend (son synthétisé : un « toum-toum » doux et un souffle, comme au doppler) */
let AUD=null;
function coeurSynthese(b){
  /* Le son est fabriqué en fichier WAV puis joué avec un lecteur audio : sur iPhone, c'est entendu même si le commutateur silencieux est activé. */
  try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
  const SR=22050,per=60/b,N=Math.max(4,Math.round(4/per)),len=Math.round(SR*per*N),d=new Float32Array(len);
  let l1=0,l2=0;
  const coup=(at,fort,f0)=>{const i0=Math.round(at*SR),L=Math.round(SR*.25);let ph=0;
    for(let i=0;i<L&&i0+i<len;i++){const t=i/SR,f=f0*(1+.4*Math.exp(-t*25));ph+=2*Math.PI*f/SR;
      const env=Math.min(1,t/.006)*Math.exp(-t*16);
      const x=Math.random()*2-1;l1+=(x-l1)*.35;l2+=(x-l2)*.06;const bruit=(l1-l2)*Math.exp(-t*22)*1.6;
      d[i0+i]+=fort*env*(Math.sin(ph)*.6+Math.sin(ph*2)*.6+Math.sin(ph*3)*.35)+fort*bruit}};
  for(let k=0;k<N;k++){coup(k*per,1,230);coup(k*per+per*.3,.75,190)}
  let m=0;for(let i=0;i<len;i++)m=Math.max(m,Math.abs(d[i]));
  const buf=new ArrayBuffer(44+len*2),v=new DataView(buf),w=(o,t)=>{for(let i=0;i<t.length;i++)v.setUint8(o+i,t.charCodeAt(i))};
  w(0,'RIFF');v.setUint32(4,36+len*2,true);w(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,SR,true);v.setUint32(28,SR*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,len*2,true);
  for(let i=0;i<len;i++)v.setInt16(44+i*2,Math.max(-1,Math.min(1,d[i]/m*.95))*32767,true);
  const url=URL.createObjectURL(new Blob([buf],{type:'audio/wav'})),el=new Audio(url);el.loop=true;el.volume=1;el.setAttribute('playsinline','');
  const p=el.play();if(p&&p.catch)p.catch(()=>{});
  if(navigator.vibrate)try{navigator.vibrate(1)}catch(e){}
  AUD={el,url}}
/* Vrai enregistrement (img/son/coeur-bebe.mp3, 136 battements/min) joué au rythme de la semaine ; si le fichier ne joue pas, le son fabriqué prend le relais. */
function coeurDemarrer(b){
  try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
  const el=new Audio('img/son/coeur-bebe.mp3?v=1');el.loop=true;el.volume=1;el.preload='auto';el.setAttribute('playsinline','');
  try{el.preservesPitch=true;el.webkitPreservesPitch=true}catch(e){}
  el.playbackRate=Math.min(1.3,Math.max(.75,(b||136)/136));
  const me={el,url:null};AUD=me;
  const secours=()=>{if(AUD!==me)return;try{el.pause()}catch(e){}AUD=null;try{coeurSynthese(b)}catch(e){}};
  el.addEventListener('error',secours);
  const p=el.play();if(p&&p.catch)p.catch(err=>{if(err&&err.name==='NotSupportedError')secours()});
  if(navigator.vibrate)try{navigator.vibrate(1)}catch(e){}}
function coeurArreter(){if(!AUD)return;try{AUD.el.pause();AUD.el.src=''}catch(e){}try{URL.revokeObjectURL(AUD.url)}catch(e){}AUD=null}
function lireReglageSon(){try{return JSON.parse(localStorage.getItem('sere-reglages')||'{}')}catch(e){return {}}}

document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='coeurSon'){if(S.sonCoeur){coeurArreter();S.sonCoeur=false}else{const st=stage();if(st.k!=='preg')return;try{coeurDemarrer(bpm(st.g.w));S.sonCoeur=true}catch(x){toast('Le son ne peut pas jouer sur cet appareil')}}render()}
  else if(a==='bebeTourner'){S.bebeRot=((S.bebeRot||0)+45)%360;tournerVisuel()}
  else if(a==='bebeMiroir'){S.bebeMiroir=!S.bebeMiroir;render()}});
function tournerVisuel(){document.querySelectorAll('.bebe-zone .tourne').forEach(g=>g.setAttribute('transform','rotate('+(S.bebeRot||0)+' 100 100)'))}
/* Tourner du doigt */
let glisse=null;
document.addEventListener('pointerdown',e=>{const z=e.target.closest('#bebePE .bebe-zone');if(!z)return;const r=z.getBoundingClientRect();glisse={cx:r.left+r.width/2,cy:r.top+r.height/2,a0:Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2)),rot0:S.bebeRot||0};z.setPointerCapture&&z.setPointerCapture(e.pointerId)});
document.addEventListener('pointermove',e=>{if(!glisse)return;const a=Math.atan2(e.clientY-glisse.cy,e.clientX-glisse.cx);S.bebeRot=Math.round(glisse.rot0+(a-glisse.a0)*180/Math.PI);tournerVisuel()});
['pointerup','pointercancel'].forEach(ev=>document.addEventListener(ev,()=>{glisse=null}));
/* Arrêter le son si on quitte l'onglet */
document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible'&&S.sonCoeur){coeurArreter();S.sonCoeur=false}});
