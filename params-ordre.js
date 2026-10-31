/* Sérénaissance — ordre de la page Paramètres (chargé en dernier). */
/* Paramètres : « Mes suivis » en premier, « Me déconnecter / Mon compte » en dernier */
(function(){const _rP=render;render=function(){const x=_rP.apply(this,arguments);try{if(S.vue!=='params')return x;setTimeout(ordonner,0);return x}catch(e){}return x};function ordonner(){try{const app=document.getElementById('app');if(!app)return;
  const enfants=[...app.children],pf=app.querySelector(':scope>.pf-set');
  if(pf){const sh=app.querySelector(':scope>.sh');if(sh)sh.after(pf);else app.prepend(pf)}
  const compte=enfants.filter(c=>c.matches('.card')&&(c.querySelector('[data-act="deconnexion"],[data-act="cptSuppr"]')||(c.matches('.flat')&&c.querySelector('[data-act="params"]'))));const pied=app.querySelector(':scope>.foot');
  compte.sort((a,b)=>(a.querySelector('[data-act="cptSuppr"]')?1:0)-(b.querySelector('[data-act="cptSuppr"]')?1:0)).forEach(c=>{if(pied)app.insertBefore(c,pied);else app.append(c)})}catch(e){}}})();
/* Rester au même endroit : quand on change quelque chose sur la même page, l'appli ne remonte plus en haut. */
/* Changer de page avec un bouton : on arrive toujours en haut de la nouvelle page. */
window.__nav=0;window.__navRecent=()=>Date.now()-window.__nav<1500;
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-act],#tabs button,#tabs [data-v]');if(!b)return;const a=b.dataset&&b.dataset.act;
  if(['tab','go','sub','dgo','dsub','params','clientOpen','ctab','seg','role'].includes(a)||(b.closest('#tabs')&&!a)){if((a==='sub'||a==='dsub')&&!b.dataset.v)return;window.__nav=Date.now()}},true);
(function(){const page=()=>{try{return JSON.stringify([S.role,S.vue,S.tab,S.sub,S.seg,S.jbTab,S.dtab,S.dsub,S.openClient,S.ctab,S.devSel,S.devEnfant,(S.parent||{}).profil])}catch(e){return ''}};
  const _rY=render;render=function(){const k0=page(),y=window.scrollY,nav=window.__navRecent();const x=_rY.apply(this,arguments);
    if(nav){const haut=()=>window.scrollTo(0,0);haut();requestAnimationFrame(haut);setTimeout(haut,120);return x}
    if(y>0&&page()===k0){const remettre=()=>{if(page()===k0&&Math.abs(window.scrollY-y)>2)window.scrollTo(0,y)};remettre();requestAnimationFrame(remettre);setTimeout(remettre,120)}
    return x}})();
