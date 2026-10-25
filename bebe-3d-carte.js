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
/* En-tête de la carte : la semaine actuelle alterne avec le temps qui reste ; sur bébé, le nombre de jours de grossesse. */
const _carteBebe3D=carteBebe;
carteBebe=function(g){let h=_carteBebe3D(g);
  const w=g.w,d=g.d||0,reste=Math.max(0,g.left||0),rs=Math.floor(reste/7),rj=reste%7;
  const pr=(S.parent&&S.parent.prenom||'').trim(),sj=(n,m)=>n+' '+m+(n>1?'s':'');
  const duree=(s,j)=>(s?sj(s,'semaine'):'')+(s&&j?' et ':'')+(j?sj(j,'jour'):'');
  const actu=(pr?'Bonjour '+esc(pr)+', vous':'Vous')+' êtes à '+(duree(w,d)||'0 jour');
  const fin=reste>0?'Encore '+duree(rs,rj)+' avant la date prévue':'Votre date prévue est arrivée';
  h=h.replace(/<b class="bb2-sem">[\s\S]*?<\/b>/,'<b class="bb2-sem b3c-alt" aria-label="'+actu+', '+fin+'"><span>'+actu+'</span><span aria-hidden="true">'+fin+'</span></b>');
  const jours=Math.max(0,g.gaDays|0);
  h=h.replace('<div class="bb2-img" aria-label="Touchez pour voir bébé en grand">','<div class="bb2-img" aria-label="Touchez pour voir bébé en grand"><span class="b3c-jours"><b>'+jours+'</b> jour'+(jours>1?'s':'')+'</span>');
  return h};
(function(){const st=document.createElement('style');st.textContent=
  '.b3c-alt{display:grid;font-size:1.3rem;line-height:1.25}.b3c-alt span{grid-area:1/1;animation:b3cAlt 8s ease-in-out infinite}.b3c-alt span+span{animation-delay:-4s}'+
  '@keyframes b3cAlt{0%,42%{opacity:1}50%,92%{opacity:0}100%{opacity:1}}'+
  '.b3c-jours{position:absolute;left:10px;top:10px;z-index:3;pointer-events:none;background:rgba(18,13,16,.55);color:#fff;border-radius:99px;padding:3px 10px;font-size:.78rem;font-variant-numeric:tabular-nums;backdrop-filter:blur(4px)}'+
  '.b3c-jours b{font-size:.95rem}'+
  '@media (prefers-reduced-motion:reduce){.b3c-alt span{animation:none}.b3c-alt span+span{display:none}}';
  document.head.appendChild(st)})();
