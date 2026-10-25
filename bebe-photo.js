/* Sérénaissance — « Mon bébé » côté parents : vraie image réaliste du stade de la grossesse (série Adobe Firefly,
   même style du début à la fin). L'image change toute seule avec la semaine calculée à partir de la date prévue.
   Les semaines sans image gardent le dessin animé de bebe-rendu.js. Voir img/bebe-serie/LISEZ-MOI.txt. */
const BEBE_SERIE_V=1;
/* [dernière semaine couverte, fichier] — en semaines d'aménorrhée (comme le reste de l'appli). null = dessin. */
const BEBE_SERIE=[[4,'stade-03'],[6,null],[8,'stade-04'],[11,'stade-05'],[15,'stade-06'],[21,'stade-07'],[27,'stade-08'],[35,'stade-09'],[42,'stade-10']];
function bebeSerieImage(w){const e=BEBE_SERIE.find(x=>w<=x[0]);return e&&e[1]?'img/bebe-serie/'+e[1]+'.jpg?v='+BEBE_SERIE_V:null}
const _svgBebeDessin=svgBebe;
function bebeSerieSecours(img,w,id){const z=img.closest('.bebe-zone');if(z)z.outerHTML=_svgBebeDessin(w,id)}
svgBebe=function(w,id){const src=bebeSerieImage(w);if(!src)return _svgBebeDessin(w,id);
  const M=mouvement(w),b=bpm(w),zid=id||'bebeZone';
  const tr='rotate('+(S.bebeRot||0)+'deg) scaleX('+(S.bebeMiroir?-1:1)+')';
  return '<div class="bebe-zone reel photo '+M[3]+'" id="'+zid+'" style="--bpm:'+(b?60/b:1)+'s">'+
    '<div class="tourne photo-rond" style="transform:'+tr+'"><img src="'+src+'" alt="Bébé à '+w+' semaines" decoding="async" draggable="false" onerror="bebeSerieSecours(this,'+w+',\''+zid+'\')"></div></div>'};
/* Le bouton « Tourner » et le glissement du doigt (bebe.js) tournent aussi l'image. */
const _tournerVisuelDessin=typeof tournerVisuel==='function'?tournerVisuel:null;
tournerVisuel=function(){if(_tournerVisuelDessin)_tournerVisuelDessin();
  document.querySelectorAll('.bebe-zone.photo .tourne').forEach(d=>{d.style.transform='rotate('+(S.bebeRot||0)+'deg) scaleX('+(S.bebeMiroir?-1:1)+')'})};
(function(){const st=document.createElement('style');st.textContent=
  '.bebe-zone.photo{position:relative}'+
  '.bebe-zone.photo .photo-rond{width:100%;height:100%;border-radius:50%;overflow:hidden;background:#120d10;box-shadow:0 0 0 2px rgba(244,199,179,.55),inset 0 0 30px rgba(0,0,0,.5);transition:transform .35s ease}'+
  '.bebe-zone.photo img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;user-select:none;-webkit-user-select:none;animation:bebeFlotte 7s ease-in-out infinite}'+
  '.bb2-img .bebe-zone.photo{transform:none}.bb2-img .bebe-zone.photo .photo-rond{border-radius:0;box-shadow:none}'+
  '@keyframes bebeFlotte{0%,100%{transform:scale(1.04) translateY(0)}50%{transform:scale(1.06) translateY(-1.5%)}}'+
  '@media (prefers-reduced-motion:reduce){.bebe-zone.photo img{animation:none}.bebe-zone.photo .photo-rond{transition:none}}';
  document.head.appendChild(st)})();
