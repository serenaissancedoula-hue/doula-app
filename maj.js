/* Sérénaissance — mises à jour de l'appli.
   À chaque ouverture (et toutes les 30 minutes), l'appli compare sa version à version.json.
   Si une nouvelle version existe, elle se met à jour toute seule (une fois par session),
   sinon un bandeau propose « Mettre à jour ». Le bouton de Paramètres force la mise à jour.
   À chaque publication : changer APP_VERSION ici ET dans version.json, et le ?v= des scripts dans index.html et parents/index.html (sinon le téléphone garde les anciens fichiers). */
const APP_VERSION='2026.10.23-20';
async function versionEnLigne(){try{const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return null;return await r.json()}catch(e){return null}}
async function majForcer(){try{toast('Mise à jour en cours…')}catch(e){}
  try{const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();if(reg){await reg.update();if(reg.waiting)reg.waiting.postMessage('skipWaiting')}}catch(e){}
  try{if(window.caches){const k=await caches.keys();await Promise.all(k.map(x=>caches.delete(x)))}}catch(e){}
  const u=new URL(location.href);u.searchParams.set('maj',Date.now());location.replace(u.pathname+u.search+u.hash)}
async function verifierMaj(auto){const v=await versionEnLigne();if(!v||!v.version){if(!auto)toast('Impossible de vérifier pour l\'instant');return}
  if(v.version===APP_VERSION){if(!auto)toast('Votre appli est à jour ('+APP_VERSION+')');document.getElementById('bandeauMaj')?.remove();return}
  let deja=false;try{deja=sessionStorage.getItem('sere-maj')===v.version;sessionStorage.setItem('sere-maj',v.version)}catch(e){}
  if(auto&&!deja){majForcer();return}
  if(!auto){majForcer();return}
  if(!document.getElementById('bandeauMaj')){const d=document.createElement('div');d.id='bandeauMaj';d.className='bandeau-maj';d.innerHTML='<span>Une nouvelle version de l\'appli est prête.</span><button class="btn sm" data-act="majMaintenant">Mettre à jour</button>';document.body.appendChild(d)}}
/* Nettoie le ?maj= de l'adresse après la mise à jour */
try{const u=new URL(location.href);if(u.searchParams.has('maj')){u.searchParams.delete('maj');history.replaceState(null,'',u.pathname+u.search+u.hash)}}catch(e){}
window.addEventListener('load',()=>setTimeout(()=>verifierMaj(true),1500));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')verifierMaj(true)});
setInterval(()=>{if(document.visibilityState==='visible')verifierMaj(true)},30*60000);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;if(b.dataset.act==='majMaintenant')majForcer();else if(b.dataset.act==='majVerifier')verifierMaj(false)});
/* Carte dans Paramètres (doula et parents) */
const _pParamMaj=pParametres;
pParametres=function(){const h=_pParamMaj();const carte='<div class="card"><span class="eyebrow acc">Mise à jour de l\'appli</span><p class="small">Version installée : <b>'+APP_VERSION+'</b></p><p class="xs muted">L\'appli se met à jour toute seule quand vous l\'ouvrez. Si quelque chose semble ancien, touchez le bouton.</p><button class="btn sm" data-act="majVerifier">'+icon('fa-rotate')+'Mettre l\'appli à jour</button></div>';
  const i=h.lastIndexOf('<div class="card flat">');return i<0?h+carte:h.slice(0,i)+carte+h.slice(i)};
