/* Sérénaissance — déconnexion automatique après 10 minutes sans toucher l'appli (doulas et familles).
   Le minuteur de contractions, de tétée ou de mouvements en cours empêche la déconnexion. */
(function(){
const DELAI=10*60*1000,CLE='sere-derniere-activite';
const lire=()=>{try{return +localStorage.getItem(CLE)||0}catch(e){return 0}};
const noter=()=>{try{localStorage.setItem(CLE,String(Date.now()))}catch(e){}};
const connectee=()=>{try{return typeof MOI!=='undefined'&&!!MOI}catch(e){return false}};
const occupee=()=>{try{return !!(S&&(S.contrActive||S.timer||S.kick))}catch(e){return false}};
/* Fermeture de l'appli : un nouveau lancement (sessionStorage vide) efface la connexion, donc il faut se reconnecter. */
try{if(!sessionStorage.getItem('sere-lancee')){sessionStorage.setItem('sere-lancee','1');
  const ks=Object.keys(localStorage).filter(k=>k.indexOf(CLE_AUTH)===0);
  if(ks.length){ks.forEach(k=>localStorage.removeItem(k));localStorage.removeItem('sere-app-derniere');location.reload()}}}catch(e){}
let enCours=false;
async function sortir(){if(enCours)return;enCours=true;
  try{localStorage.setItem('sere-deco-inactif','1')}catch(e){}
  try{await Promise.race([sb.auth.signOut({scope:'local'}),new Promise(r=>setTimeout(r,3000))])}catch(e){}
  try{Object.keys(localStorage).filter(k=>k.indexOf(CLE_AUTH)===0||k==='sere-app-derniere').forEach(k=>localStorage.removeItem(k))}catch(e){}
  location.replace(location.pathname)}
function verifier(){if(!connectee()||enCours)return;if(occupee()){noter();return}
  const t=lire();if(t&&Date.now()-t>=DELAI)sortir()}
let dernier=0;
const actif=()=>{const n=Date.now();if(n-dernier<5000)return;dernier=n;if(connectee())noter()};
['touchstart','click','keydown','scroll','input'].forEach(ev=>document.addEventListener(ev,actif,{passive:true,capture:true}));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')verifier()});
setInterval(verifier,30000);
/* À l'ouverture : si la dernière activité date de plus de 10 min, on repart de zéro */
window.addEventListener('load',()=>{setTimeout(()=>{
  try{if(localStorage.getItem('sere-deco-inactif')){localStorage.removeItem('sere-deco-inactif');toast('Vous avez été déconnectée après 10 minutes d\'inactivité.')}}catch(e){}
  if(connectee()){verifier();if(!enCours)noter()}},2500)});
})();
