/* Sérénaissance — une seule fois par appareil : explique comment ajouter l'appli à l'écran d'accueil du cellulaire (doula et famille).
   iPhone/iPad : bouton Partager → « Sur l'écran d'accueil » (Apple). Android : menu de Chrome → « Installer l'application » ou « Ajouter à l'écran d'accueil ». */
(function(){
const CLE='sere-installer-vu';
const vu=()=>{try{if(localStorage.getItem(CLE))return true}catch(e){}try{return /(?:^|; )sere-installer-vu=1/.test(document.cookie)}catch(e){return false}};
const noter=()=>{try{localStorage.setItem(CLE,'1')}catch(e){}try{document.cookie='sere-installer-vu=1; max-age=63072000; path=/; SameSite=Lax'}catch(e){}};
const installee=()=>window.navigator.standalone===true||(window.matchMedia&&matchMedia('(display-mode: standalone)').matches);
const ios=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const mobile=()=>ios()||/Android/i.test(navigator.userAgent);
let evt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();evt=e});
let montre=false;
function contenu(){
  const pas=(n,t)=>'<div style="display:flex;flex-wrap:nowrap;gap:10px;align-items:flex-start"><span class="pill" style="flex:0 0 26px;width:26px;height:26px;padding:0;display:flex;align-items:center;justify-content:center">'+n+'</span><span class="small" style="flex:1;min-width:0">'+t+'</span></div>';
  let h='<div class="stack" style="gap:12px"><p class="small">Ajoutez Sérénaissance à l’écran d’accueil de votre cellulaire : elle s’ouvre comme une vraie appli, en plein écran, et vous recevez les notifications.</p>';
  if(ios())h+=pas(1,'Ouvrez cette page dans Safari.')+pas(2,'Touchez le bouton Partager (le carré avec une flèche vers le haut).')+pas(3,'Choisissez « Sur l’écran d’accueil », puis Ajouter.')+pas(4,'Ouvrez ensuite l’appli depuis la nouvelle icône.');
  else h+=pas(1,'Ouvrez cette page dans Chrome.')+pas(2,'Touchez le menu ⋮ en haut à droite.')+pas(3,'Choisissez « Installer l’application » (ou « Ajouter à l’écran d’accueil »), puis confirmez.')+(evt?'<button class="btn" data-act="instOk">Installer maintenant</button>':'');
  return h+'<button class="btn ghost" data-act="close">J’ai compris</button></div>'}
function montrer(){
  if(montre||vu()||installee()||!mobile())return;
  if(typeof S==='undefined'||!S.role||S.vue||(document.getElementById('layer')&&document.getElementById('layer').children.length))return;
  montre=true;noter();
  try{sheet('Ajouter l’appli à votre écran d’accueil',contenu())}catch(e){montre=false}}
const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(!montre&&!vu())setTimeout(montrer,2500)}catch(e){}return x};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act="instOk"]');if(!b||!evt)return;e.stopPropagation();e.preventDefault();
  try{evt.prompt();await evt.userChoice}catch(x){}evt=null;try{close()}catch(x){}},true);
})();
