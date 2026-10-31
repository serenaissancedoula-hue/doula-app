/* Sérénaissance — mises à jour de l'appli.
   À chaque ouverture (et toutes les 30 minutes), l'appli compare sa version à version.json.
   Si une nouvelle version existe, l'appli propose un message « Mettre à jour / Plus tard » (jamais de mise à jour automatique),
   sinon un bandeau propose « Mettre à jour ». Le bouton de Paramètres force la mise à jour.
   À chaque publication : changer APP_VERSION ici ET dans version.json, et le ?v= des scripts dans index.html et parents/index.html (sinon le téléphone garde les anciens fichiers). */
/* Comptes autorisés à passer l'écran de maintenance pour tester (en plus de la propriétaire). */
const MAINT_OK=['sabrinac9779@gmail.com'];
const APP_VERSION='2026.10.31-339';
async function versionEnLigne(){try{const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return null;return await r.json()}catch(e){return null}}
async function majForcer(){try{toast('Mise à jour en cours…')}catch(e){}
  try{sessionStorage.setItem('sere-maj-ok','1')}catch(e){}
  try{const h=await (await fetch(location.pathname,{cache:'reload'})).text();const refs=[...h.matchAll(/(?:src|href)="([^"]+\.(?:js|css)[^"]*)"/g)].map(m=>m[1]).filter(u=>!/^https?:/.test(u));await Promise.all(refs.map(u=>fetch(new URL(u,document.baseURI),{cache:'reload'}).catch(()=>0)))}catch(e){}
  try{const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();if(reg){await reg.update();if(reg.waiting)reg.waiting.postMessage('skipWaiting')}}catch(e){}
  try{if(window.caches){const k=await caches.keys();await Promise.all(k.map(x=>caches.delete(x)))}}catch(e){}
  const u=new URL(location.href);u.searchParams.set('maj',Date.now());location.replace(u.pathname+u.search+u.hash)}
/* Nouvelle version : on le dit et c'est la personne qui choisit (jamais de mise à jour toute seule). */
function afficherMaj(v){try{
  if(document.getElementById('msgMaj'))return;
  try{if(sessionStorage.getItem('sere-maj-plustard')===v.version)return}catch(e){}
  const N=(v.nouveautes||[]).slice(0,3).map(x=>'<li>'+String(x).replace(/</g,'&lt;')+'</li>').join('');
  const d=document.createElement('div');d.id='msgMaj';d.dataset.v=v.version;d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
  d.style.cssText='position:fixed;inset:0;z-index:99998;display:grid;place-items:center;padding:20px;background:rgba(20,12,10,.55)';
  d.innerHTML='<div style="width:min(100%,360px);background:var(--card,#fffaf6);color:var(--ink,#2c221e);border-radius:24px;padding:22px 20px;box-shadow:0 18px 50px rgba(0,0,0,.4);text-align:center;display:grid;gap:10px"><div style="font-size:36px">✨</div><h2 style="margin:0">Une nouvelle version est prête</h2>'+(N?'<ul style="text-align:left;margin:0;padding-left:20px;font-size:.92rem">'+N+'</ul>':'<p class="small" style="margin:0">Des améliorations ont été ajoutées à l\'appli.</p>')+'<p class="xs muted" style="margin:0">Voulez-vous la mettre à jour maintenant ? L\'appli va se recharger.</p><button class="btn" data-act="majMaintenant" style="width:100%">Mettre à jour</button><button class="btn sm ghost" data-act="majPlusTard" style="width:100%">Plus tard</button></div>';
  document.body.appendChild(d)}catch(e){}}
async function verifierMaj(auto){const v=await versionEnLigne();if(!v||!v.version){if(!auto)toast('Impossible de vérifier pour l\'instant');return}
  try{maintenanceAffiche(v.maintenance)}catch(e){}
  if(v.version===APP_VERSION){if(!auto)toast('Votre appli est à jour ('+APP_VERSION+')');document.getElementById('bandeauMaj')?.remove();return}
  let deja=false;try{deja=sessionStorage.getItem('sere-maj')===v.version;sessionStorage.setItem('sere-maj',v.version)}catch(e){}
  if(auto&&!deja){afficherMaj(v);return}
  if(!auto){majForcer();return}
  afficherMaj(v)}
window.addEventListener('load',()=>{try{if(sessionStorage.getItem('sere-maj-ok')){sessionStorage.removeItem('sere-maj-ok');setTimeout(()=>toast('✓ Appli mise à jour (version '+APP_VERSION+')'),1200)}}catch(e){}});
/* Maintenance annoncée : bandeau dès l'annonce, écran « en maintenance » pendant la période. Se règle dans version.json : "maintenance":{"debut":"2026-11-01T20:00","fin":"2026-11-01T22:00","message":""} (heure de l'Atlantique, annoncer au moins 7 jours avant). */
function maintenanceAffiche(m){const f=d=>new Date(d).toLocaleString('fr-CA',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'});
  document.getElementById('bandeauMaint')?.remove();document.getElementById('ecranMaint')?.remove();
  try{if(/[?&]test=sabrina\b/.test(location.search))localStorage.setItem('sere-maint-test','1');if(localStorage.getItem('sere-maint-test')){document.getElementById('bandeauMaint')?.remove();return}}catch(x){}
  if(!m||!m.debut||!m.fin)return;const now=Date.now(),d=new Date(m.debut).getTime(),e=new Date(m.fin).getTime();if(isNaN(d)||isNaN(e)||now>e)return;
  if(now>=d){const o=document.createElement('div');o.id='ecranMaint';o.style.cssText='position:fixed;inset:0;z-index:99999;background:var(--bg,#faf5ef);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:32px;gap:12px';
    o.innerHTML='<div style="font-size:48px">🛠️</div><h2 style="margin:0">Appli en maintenance</h2><p style="max-width:320px">'+(m.message||'Nous améliorons l\'appli. Vos données sont en sécurité.')+'</p><p class="small"><b>Retour prévu : '+f(m.fin)+'</b></p><button class="btn sm ghost" id="maintFermer" hidden>Continuer quand même (propriétaire)</button>';
    document.body.appendChild(o);try{if(typeof MOI!=='undefined'&&MOI&&MOI.admin)document.getElementById('maintFermer').hidden=false}catch(x){}
    const peutPasser=()=>{try{return !!(MOI&&(MOI.admin||MAINT_OK.includes(String(MOI.courriel||'').toLowerCase())))}catch(x){return false}};
    const btn=document.getElementById('maintFermer');const w=setInterval(()=>{if(!document.getElementById('ecranMaint')){clearInterval(w);return}if(peutPasser()){btn.hidden=false;clearInterval(w)}},1500);
    btn.onclick=()=>o.remove();
    let taps=0;const em=o.firstChild;if(em)em.onclick=()=>{if(++taps>=5){try{localStorage.setItem('sere-maint-test','1')}catch(x){}o.remove()}};setTimeout(()=>maintenanceAffiche(m),Math.min(e-now+1000,600000));return}
  const b=document.createElement('div');b.id='bandeauMaint';b.className='bandeau-maj';b.innerHTML='<span>🛠️ Mise à jour prévue le <b>'+f(m.debut)+'</b>. L\'appli sera en maintenance jusqu\'à '+new Date(m.fin).toLocaleTimeString('fr-CA',{hour:'2-digit',minute:'2-digit'})+'.</span><button class="btn sm ghost" id="maintOk">OK</button>';
  document.body.appendChild(b);document.getElementById('maintOk').onclick=()=>b.remove();setTimeout(()=>maintenanceAffiche(m),Math.min(d-now+500,600000))}
/* Nettoie le ?maj= de l'adresse après la mise à jour */
try{const u=new URL(location.href);if(u.searchParams.has('maj')){u.searchParams.delete('maj');history.replaceState(null,'',u.pathname+u.search+u.hash)}}catch(e){}
window.addEventListener('load',()=>setTimeout(()=>verifierMaj(true),1500));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')verifierMaj(true)});
setInterval(()=>{if(document.visibilityState==='visible')verifierMaj(true)},30*60000);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;if(b.dataset.act==='majMaintenant'){document.getElementById('msgMaj')?.remove();majForcer()}else if(b.dataset.act==='majPlusTard'){try{sessionStorage.setItem('sere-maj-plustard',(document.getElementById('msgMaj')||{dataset:{}}).dataset.v||'')}catch(x){}document.getElementById('msgMaj')?.remove()}else if(b.dataset.act==='majVerifier')verifierMaj(false)});
/* Carte dans Paramètres (doula et parents) */
const _pParamMaj=pParametres;
pParametres=function(){const h=_pParamMaj();const carte='<div class="card"><span class="eyebrow acc">Mise à jour de l\'appli</span><p class="small">Version installée : <b>'+APP_VERSION+'</b></p><p class="xs muted">Quand une nouvelle version est prête, l\'appli vous le demande : c\'est vous qui choisissez. Si quelque chose semble ancien, touchez le bouton.</p><button class="btn sm" data-act="majVerifier">'+icon('fa-rotate')+'Mettre l\'appli à jour</button></div>';
  const i=h.lastIndexOf('<div class="card flat">');return i<0?h+carte:h.slice(0,i)+carte+h.slice(i)};
