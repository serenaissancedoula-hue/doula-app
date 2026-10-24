/* Sérénaissance — rappel d'activer les notifications (doula et famille) : sans abonnement, aucun message n'arrive en push. */
(function(){
let etat=null;
const KEY='srn_nr_off';
function ios(){return /iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
function installee(){return window.navigator.standalone===true||(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)}
function masque(){try{const t=+localStorage.getItem(KEY)||0;return Date.now()-t<14*864e5}catch(e){return false}}
function carte(){
  if(etat!==false||masque()||document.getElementById('nrCarte'))return;
  if(typeof S==='undefined'||!S.role||S.vue)return;
  const accueil=S.role==='doula'?(S.dtab||'accueil')==='accueil':S.tab==='accueil';if(!accueil)return;
  const app=document.getElementById('app');if(!app)return;
  const aide=ios()&&!installee()?'<p class="xs muted">Sur iPhone et iPad : ouvrez le menu de partage de Safari, choisissez « Sur l\'écran d\'accueil », puis ouvrez l\'appli depuis cette icône avant d\'activer.</p>':'';
  const d=document.createElement('div');d.id='nrCarte';d.className='card';
  d.innerHTML='<div class="row between" style="align-items:flex-start;gap:10px"><div><span class="eyebrow acc">Notifications</span><p class="small" style="margin:6px 0 0">Activez-les pour être avertie des messages, des rendez-vous et des documents, même quand l\'appli est fermée.</p></div><button type="button" class="icon-btn" data-nr="non" aria-label="Plus tard">✕</button></div>'+aide+'<div class="row" style="margin-top:8px"><button type="button" class="btn sm" data-nr="go">Activer</button></div>';
  app.insertBefore(d,app.firstChild)}
function verifier(){if(etat!==null||!('serviceWorker' in navigator)||!('PushManager' in window)){return}
  navigator.serviceWorker.ready.then(r=>r.pushManager.getSubscription()).then(s=>{etat=!!s;carte()}).catch(()=>{})}
const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(etat===null)verifier();else carte()}catch(e){}return x};
document.addEventListener('click',e=>{const b=e.target.closest('[data-nr]');if(!b)return;e.stopPropagation();
  if(b.dataset.nr==='non'){try{localStorage.setItem(KEY,String(Date.now()))}catch(x){}const c=document.getElementById('nrCarte');if(c)c.remove();return}
  const c=document.getElementById('nrCarte');if(c)c.remove();S.vue='params';render()},true);
})();
