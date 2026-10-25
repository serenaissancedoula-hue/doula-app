/* Sérénaissance — bébé en 3D directement dans la carte « Mon bébé » (côté parents).
   Les modèles Meshy d'origine (img/bebe3d/serie) s'affichent à la place de l'image dès qu'ils sont chargés.
   Dans la carte, bébé est immobile, vu de face. En appuyant dessus, il passe en plein écran :
   on le tourne avec le doigt et on pince pour zoomer. Semaine 4 : sphère avec l'image du blastocyste.
   Si la 3D ne peut pas s'afficher (pas d'Internet, vieux téléphone), l'image Firefly reste. */
const B3C_SERIE=[[5,'04a'],[6,'04b'],[8,'04'],[11,'05'],[15,'06'],[21,'07'],[27,'08'],[35,'09'],[42,'10']];
const B3C_DEVANT=['07','10']; // l'arrière de ces modèles est la poche : on tourne seulement devant
const B3C_V=1;
function b3cFichier(w){if(w<=4)return null;const e=B3C_SERIE.find(x=>w<=x[0]);return e?e[1]:'10'}
const B3C={pret:null,ren:null,scene:null,cam:null,ctl:null,obj:null,cle:null,cache:{},plein:false,boucle:false,attente:false,ro:null};
function b3cScript(src){return new Promise((ok,ko)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=ko;document.head.appendChild(s)})}
function b3cLibs(){if(!B3C.pret)B3C.pret=(window.THREE?Promise.resolve():b3cScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'))
  .then(()=>Promise.all([THREE.OrbitControls?0:b3cScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js'),
    THREE.GLTFLoader?0:b3cScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js')]))
  .then(()=>{const r=new THREE.WebGLRenderer({antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.outputEncoding=THREE.sRGBEncoding;
    r.toneMapping=THREE.ACESFilmicToneMapping;r.domElement.className='b3c-toile';B3C.ren=r;
    const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,1,.05,50);cam.position.set(0,0,4.4);B3C.scene=sc;B3C.cam=cam;
    sc.add(new THREE.HemisphereLight(0xfff0ea,0x4a1f28,.75));
    const k1=new THREE.DirectionalLight(0xfff2e8,1.35);k1.position.set(2,3,4);sc.add(k1);
    const k2=new THREE.DirectionalLight(0xff8f7a,1.1);k2.position.set(-3,1,-3);sc.add(k2);
    const k3=new THREE.DirectionalLight(0xffe4da,.3);k3.position.set(0,-3,2);sc.add(k3);
    const c=new THREE.OrbitControls(cam,r.domElement);c.enableDamping=true;c.enablePan=false;c.minDistance=2.2;c.maxDistance=8;c.autoRotate=false;c.enabled=false;
    c.addEventListener('change',b3cDessiner);B3C.ctl=c;
    /* les gestes sur bébé en plein écran ne doivent pas déclencher les autres actions de la carte */
    ['pointerdown','click'].forEach(ev=>r.domElement.addEventListener(ev,e=>{if(B3C.plein)e.stopPropagation()}));
    B3C.ro=new ResizeObserver(b3cTaille);return true});
  return B3C.pret}
function b3cTaille(){const t=B3C.ren&&B3C.ren.domElement,p=t&&t.parentNode;if(!p)return;const r=p.getBoundingClientRect();if(!r.width)return;
  B3C.ren.setSize(r.width,r.height,false);B3C.cam.aspect=r.width/r.height;B3C.cam.updateProjectionMatrix();b3cDessiner()}
function b3cDessiner(){if(B3C.ren&&B3C.ren.domElement.parentNode)B3C.ren.render(B3C.scene,B3C.cam)}
function b3cMatiere(o){o.traverse(n=>{if(n.isMesh){const a=n.material;
  const m=new THREE.MeshPhysicalMaterial({map:a.map,normalMap:a.normalMap,metalness:0,roughness:.68,reflectivity:.3,
    sheen:new THREE.Color(.18,.09,.08),emissive:a.map?new THREE.Color(.05,.016,.012):new THREE.Color(0,0,0),emissiveMap:a.map||null,side:THREE.DoubleSide});
  if(!a.map)m.color.set('#e8b09c');n.material=m}})}
function b3cCentrer(o,taille){const box=new THREE.Box3().setFromObject(o),sz=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3());
  const g=new THREE.Group();o.position.sub(c);g.add(o);g.scale.setScalar(taille/Math.max(sz.x,sz.y,sz.z));return g}
function b3cCharger(w){const f=b3cFichier(w),cle=f||'sphere-04';if(B3C.cache[cle])return B3C.cache[cle];
  return B3C.cache[cle]=new Promise((ok,ko)=>{
    if(f){new THREE.GLTFLoader().load('img/bebe3d/serie/stade-'+f+'.glb?v='+B3C_V,g=>{b3cMatiere(g.scene);const o=b3cCentrer(g.scene,2.1);o.userData.cle=cle;ok(o)},undefined,ko);return}
    new THREE.TextureLoader().load('img/bebe3d/sphere-04.jpg?v=2',tx=>{tx.encoding=THREE.sRGBEncoding;
      const geo=new THREE.SphereGeometry(.95,96,64),p=geo.attributes.position,uv=geo.attributes.uv;
      for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),sx=z>=0?x:-x;uv.setXY(i,.5+sx/1.9*.98,.5+y/1.9*.98)}
      const s=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:tx,roughness:.55,metalness:0,emissive:new THREE.Color(.12,.06,.05),emissiveMap:tx}));
      const o=new THREE.Group();o.add(s);o.scale.setScalar(1.05);o.userData.cle=cle;ok(o)},undefined,ko)})}
function b3cVueFace(){const c=B3C.ctl;B3C.cam.position.set(0,0,4.4);c.target.set(0,0,0);c.update()}
function b3cLimites(cle){const d=B3C_DEVANT.includes(cle);B3C.ctl.minAzimuthAngle=d?-1.2:-Infinity;B3C.ctl.maxAzimuthAngle=d?1.2:Infinity}
function b3cAnimer(){if(B3C.boucle)return;B3C.boucle=true;(function f(){if(!B3C.plein){B3C.boucle=false;return}B3C.ctl.update();b3cDessiner();requestAnimationFrame(f)})()}
/* Trouve où bébé doit s'afficher (plein écran en priorité, sinon la carte) et y place la 3D. */
function b3cPlacer(){B3C.attente=false;
  const pe=document.querySelector('#bebePE .bebe-zone.photo'),carte=document.querySelector('.bebe-carte .bebe-zone.photo'),z=pe||carte;
  if(!z)return;const w=+z.dataset.w;if(!w)return;
  b3cLibs().then(()=>b3cCharger(w)).then(o=>{
    const z2=document.querySelector('#bebePE .bebe-zone.photo')||document.querySelector('.bebe-carte .bebe-zone.photo');if(z2!==z)return;
    const rond=z.querySelector('.photo-rond'),t=B3C.ren.domElement,plein=!!pe;
    if(B3C.obj!==o){if(B3C.obj)B3C.scene.remove(B3C.obj);B3C.scene.add(o);B3C.obj=o;b3cLimites(o.userData.cle);b3cVueFace()}
    if(t.parentNode!==rond){if(B3C.rond)B3C.rond.classList.remove('b3c-ok');rond.appendChild(t);B3C.rond=rond;B3C.ro.disconnect();B3C.ro.observe(rond)}
    if(B3C.plein&&!plein)b3cVueFace();B3C.plein=plein;B3C.ctl.enabled=plein;rond.classList.add('b3c-ok');
    b3cTaille();if(plein)b3cAnimer()}).catch(()=>{}) /* la photo reste affichée */}
function b3cSurveiller(){if(B3C.attente)return;B3C.attente=true;requestAnimationFrame(b3cPlacer)}
new MutationObserver(b3cSurveiller).observe(document.body,{childList:true,subtree:true});
(function(){const st=document.createElement('style');st.textContent=
  '.bebe-zone.photo .photo-rond{position:relative}'+
  '.b3c-toile{position:absolute;inset:0;width:100%!important;height:100%!important;display:block;opacity:0;transition:opacity .5s ease;pointer-events:none}'+
  '.b3c-ok .b3c-toile{opacity:1}.b3c-ok img{visibility:hidden}'+
  '#bebePE .b3c-toile{pointer-events:auto;touch-action:none;cursor:grab}'+
  '@media (prefers-reduced-motion:reduce){.b3c-toile{transition:none}}';
  document.head.appendChild(st)})();
b3cSurveiller();
/* Accueil « Mon bébé » : grande carte avec bébé en 3D, salutation et jour de grossesse,
   puis la carte des semaines (semaine actuelle qui alterne avec le temps restant, trimestre, date prévue, progression). */
const B3H_MOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const _carteBebe3D=carteBebe;
carteBebe=function(g){let h=_carteBebe3D(g);
  const w=Math.max(4,Math.min(42,g.w)),d=g.d||0,reste=Math.max(0,g.left||0),rs=Math.floor(reste/7),rj=reste%7,jours=Math.max(0,g.gaDays|0);
  const pr=(S.parent&&S.parent.prenom||'').trim(),sj=(n,m)=>n+' '+m+(n>1?'s':''),duree=(s,j)=>(s?sj(s,'semaine'):'')+(s&&j?' et ':'')+(j?sj(j,'jour'):'');
  const actu='Vous êtes à '+(duree(g.w,d)||'0 jour'),fin=reste>0?'Encore '+duree(rs,rj):'Votre date prévue est arrivée';
  const tri=jours<98?'1er trimestre':jours<196?'2e trimestre':'3e trimestre',x=g.dpa instanceof Date?g.dpa:null;
  const dp=x?'Date prévue le '+x.getDate()+(x.getDate()===1?'er':'')+' '+B3H_MOIS[x.getMonth()]:'';
  const pct=Math.min(100,Math.max(0,jours/280*100));
  const hero='<div class="b3h" role="button" tabindex="0" aria-label="Voir bébé en plein écran et le tourner">'+
    '<div class="b3h-bebe">'+svgBebe(w)+'</div>'+
    '<div class="b3h-salut"><span>Bonjour'+(pr?',':'')+'</span>'+(pr?'<b>'+esc(pr)+'</b>':'')+'</div>'+
    '<div class="b3h-bas"><span class="b3h-jour">Jour <b>'+jours+'</b></span><span class="b3h-btn">'+icon('fa-expand')+' Voir en grand</span></div></div>';
  const info='<div class="b3h-info"><b class="b3c-alt" aria-label="'+actu+'. '+fin+'"><span>'+actu+'</span><span aria-hidden="true">'+fin+'</span></b>'+
    '<div class="b3h-ligne"><span class="xs muted">'+tri+(dp?' · '+dp:'')+'</span><button class="b3h-mod" data-act="params">Modifier</button></div>'+
    '<div class="prog b3h-prog"><i style="width:'+pct+'%"></i></div></div><div class="prog"></div>';
  h=h.replace(/<div class="bb2-tete">[\s\S]*?<\/div>(?=<div class="bb2-haut">)/,'');
  h=h.replace(/<div class="bb2-img"[\s\S]*?<\/span><\/div>/,'');
  h=h.replace(/<div class="prog"><i style="width:[^"]*"><\/i><\/div>/,'');
  return h.replace('<div class="card bebe-carte bb2">','<div class="card bebe-carte bb2 b3h-carte">'+hero+info)};
document.addEventListener('click',e=>{const z=e.target.closest('.b3h');if(z&&!e.target.closest('[data-act]')&&!document.getElementById('bebePE')&&typeof ouvrirBebePE==='function')ouvrirBebePE()});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('b3h')){e.preventDefault();ouvrirBebePE()}});
(function(){const st=document.createElement('style');st.textContent=
  '.b3h{position:relative;width:100%;aspect-ratio:1/1.08;border-radius:26px;overflow:hidden;cursor:pointer;color:#fff7f2;'+
    'background:radial-gradient(ellipse at 60% 45%,#6b3238 0%,#3a1a20 48%,#1b0d11 100%);box-shadow:0 14px 34px rgba(80,30,25,.22)}'+
  '.b3h-bebe{position:absolute;inset:0}.b3h .bebe-zone{position:absolute;inset:0;max-width:none!important;width:100%;height:100%;aspect-ratio:auto;margin:0;filter:none}'+
  '.b3h .bebe-zone.photo .photo-rond{border-radius:0;background:transparent;box-shadow:none}'+
  '.b3h .bebe-zone.photo img{object-fit:contain;padding:12% 6% 14%;box-sizing:border-box;-webkit-mask-image:radial-gradient(circle,#000 55%,transparent 72%);mask-image:radial-gradient(circle,#000 55%,transparent 72%)}'+
  '.b3h-salut{position:absolute;left:18px;top:16px;display:flex;flex-direction:column;pointer-events:none;text-shadow:0 1px 8px rgba(0,0,0,.35)}'+
  '.b3h-salut span{font-size:.95rem;opacity:.85}.b3h-salut b{font-family:var(--f-display);font-size:1.7rem;line-height:1.1}'+
  '.b3h-bas{position:absolute;left:14px;right:14px;bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:10px;pointer-events:none}'+
  '.b3h-jour{font-family:var(--f-display);font-size:1.15rem;text-shadow:0 1px 8px rgba(0,0,0,.4)}.b3h-jour b{font-size:1.9rem;margin-left:4px}'+
  '.b3h-btn{display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:99px;background:rgba(255,244,238,.16);border:1px solid rgba(255,235,228,.35);font-weight:700;font-size:.85rem;backdrop-filter:blur(6px)}'+
  '.b3h-info{background:var(--soft);border-radius:20px;padding:14px 16px;display:flex;flex-direction:column;gap:6px}'+
  '.b3h-ligne{display:flex;align-items:center;justify-content:space-between;gap:10px}'+
  '.b3h-mod{border:0;background:none;color:var(--accent);font-weight:700;font-size:.85rem;padding:4px 0;cursor:pointer}'+
  '.b3h-carte .bb2-haut{grid-template-columns:1fr}.b3h-carte>.prog:empty{display:none}'+
  '.b3c-alt{display:grid;font-family:var(--f-display);font-size:1.2rem;line-height:1.25;color:var(--ink)}.b3c-alt span{grid-area:1/1;animation:b3cAlt 8s ease-in-out infinite}.b3c-alt span+span{animation-delay:-4s}'+
  '@keyframes b3cAlt{0%,42%{opacity:1}50%,92%{opacity:0}100%{opacity:1}}'+
  '#bebePE{background:radial-gradient(ellipse at 50% 45%,#6b3238 0%,#3a1a20 48%,#1b0d11 100%)!important}'+
  '#bebePE .bebe-zone.photo{width:min(100vw,600px)!important;max-width:none!important;height:min(62vh,600px);aspect-ratio:auto!important;margin:0 auto;filter:none!important}'+
  '#bebePE .bebe-zone.photo .photo-rond{border-radius:0;background:transparent;box-shadow:none}'+
  '#bebePE .bebe-zone.photo img{object-fit:contain;-webkit-mask-image:radial-gradient(circle,#000 55%,transparent 72%);mask-image:radial-gradient(circle,#000 55%,transparent 72%)}'+
  '@media (prefers-reduced-motion:reduce){.b3c-alt span{animation:none}.b3c-alt span+span{display:none}}';
  document.head.appendChild(st)})();
/* Plein écran : bébé en très grand qu'on tourne au doigt, poids et longueur à gauche, semaines à droite,
   et dessous une carte « ce que bébé fait cette semaine ». */
const B3F_MOMENTS=[[5,'Tout commence','Le cœur, le cerveau et la moelle épinière se mettent en place. Bébé a la taille d\'une graine.'],
  [7,'Son cœur bat','Le petit cœur bat déjà très vite, environ deux fois plus vite que le vôtre.'],
  [12,'Premiers tressaillements','Bébé s\'étire et fait de petits sursauts. Vous ne le sentez pas encore.'],
  [17,'Des culbutes','Il bouge bras et jambes, porte les mains à son visage et fait des culbutes dans le liquide.'],
  [22,'Il vous entend','Votre cœur, votre respiration, puis votre voix : il commence à entendre le monde à travers vous.'],
  [24,'Premiers coups de pied','Les petits papillons deviennent de vrais petits coups. Posez la main sur votre ventre.'],
  [27,'Le hoquet','Il avale du liquide et a parfois le hoquet : de petites secousses régulières, tout à fait normales.'],
  [31,'Ses yeux s\'ouvrent','Il ouvre les yeux et perçoit la lumière à travers votre ventre. Il dort et s\'éveille par cycles.'],
  [36,'Il prend des forces','Il prend du poids pour bien se garder au chaud. Ses mouvements deviennent des roulades et des poussées.'],
  [42,'Prêt à vous rencontrer','Bébé est bien tassé. Il doit bouger chaque jour autant qu\'avant : au moindre doute, appelez.']];
function b3fMoment(w){return B3F_MOMENTS.find(m=>w<=m[0])||B3F_MOMENTS[B3F_MOMENTS.length-1]}
const _ouvrirBebePE3D=ouvrirBebePE;
ouvrirBebePE=function(){_ouvrirBebePE3D();const d=document.getElementById('bebePE');if(!d)return;
  const st=stage();if(st.k!=='preg')return;const w=Math.max(4,Math.min(42,st.g.w)),f=fruit(w),b=bpm(w),mo=b3fMoment(w);
  const poids=f[2]?(f[2]>=1000?['≈ '+cm((f[2]/1000).toFixed(1)),'kg']:['≈ '+f[2],'grammes']):['< 1','gramme'];
  d.classList.add('b3f');
  d.innerHTML='<div class="b3f-scene">'+svgBebe(w,'bebeZonePE')+
    '<div class="b3f-chiffres"><div><b>'+poids[0]+'</b> '+poids[1]+'<span>Poids</span></div><div><b>≈ '+cm(f[1])+'</b> cm<span>Longueur</span></div></div>'+
    '<div class="b3f-sem"><b>'+w+'</b><span>semaine'+(w>1?'s':'')+'</span></div>'+
    '<span class="b3f-aide">Glissez le doigt pour tourner bébé</span></div>'+
    '<button class="pe-fermer b3f-fermer" data-act="bebePEFermer" aria-label="Fermer">'+icon('fa-xmark')+'</button>'+
    '<div class="b3f-carte"><div class="b3f-titre"><h2>'+esc(mo[1])+'</h2>'+(b?'<button class="b3f-son" data-act="bebePESon" aria-label="Couper ou remettre le son du cœur">'+icon(S.sonCoeur?'fa-volume-high':'fa-volume-xmark')+'</button>':'')+'</div>'+
    '<p>'+esc(mo[2])+'</p>'+(b?'<p class="b3f-note">Son du cœur : une illustration, pas le vrai cœur de votre bébé.</p>':'')+'</div>';
  b3cSurveiller()};
(function(){const st=document.createElement('style');st.textContent=
  '#bebePE.b3f{display:block;padding:0;overflow:hidden;background:radial-gradient(ellipse at 50% 38%,#6b3238 0%,#3a1a20 45%,#1b0d11 100%)!important}'+
  '.b3f-scene{position:absolute;left:0;right:0;top:0;bottom:var(--b3f-h,190px)}'+
  '#bebePE.b3f .bebe-zone.photo{position:absolute;inset:0;width:100%!important;height:100%!important;max-width:none!important;aspect-ratio:auto!important;margin:0}'+
  '.b3f-chiffres{position:absolute;left:18px;bottom:18px;display:flex;flex-direction:column;gap:10px;pointer-events:none;color:#fff7f2;text-shadow:0 1px 10px rgba(0,0,0,.45)}'+
  '.b3f-chiffres div{font-size:.9rem}.b3f-chiffres b{font-size:1.55rem;font-variant-numeric:tabular-nums}.b3f-chiffres span{display:block;font-size:.75rem;opacity:.8;margin-top:-2px}'+
  '.b3f-sem{position:absolute;right:18px;bottom:18px;text-align:right;pointer-events:none;color:#fff7f2;text-shadow:0 1px 10px rgba(0,0,0,.45)}'+
  '.b3f-sem b{display:block;font-family:var(--f-display);font-size:3.4rem;line-height:1}.b3f-sem span{font-size:1rem}'+
  '.b3f-aide{position:absolute;left:0;right:0;top:calc(env(safe-area-inset-top,0px) + 22px);text-align:center;font-size:.75rem;color:#f3dde2;opacity:.7;pointer-events:none}'+
  '#bebePE .b3f-fermer{position:absolute;top:calc(env(safe-area-inset-top,0px) + 12px);right:14px;z-index:5}'+
  '.b3f-carte{position:absolute;left:0;right:0;bottom:0;min-height:var(--b3f-h,190px);box-sizing:border-box;background:var(--card,#fff);color:var(--ink);border-radius:26px 26px 0 0;padding:20px 20px calc(18px + env(safe-area-inset-bottom,0px));box-shadow:0 -10px 30px rgba(0,0,0,.25)}'+
  '.b3f-titre{display:flex;align-items:center;justify-content:space-between;gap:12px}.b3f-titre h2{margin:0;font-size:1.45rem}'+
  '.b3f-son{flex:none;width:46px;height:40px;border-radius:12px;border:0;background:var(--accent);color:#fff;font-size:1.05rem;cursor:pointer}'+
  '.b3f-carte p{margin:8px 0 0;color:var(--muted);line-height:1.45}.b3f-carte .b3f-note{font-size:.72rem;margin-top:10px}';
  document.head.appendChild(st)})();
