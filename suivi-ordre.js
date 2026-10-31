/* Sérénaissance — page Suivi (Espace Famille) : « Trouver mon suivi » et la fiche à imprimer pour le médecin en premier ;
   la carte « Résultat » est retirée (déjà sur l'accueil) ; le calendrier de la page reste semaine par semaine. */
(function(){
if(window.ESPACE!=='parent'||typeof pSuivi!=='function'||typeof render!=='function')return;
/* 1. la carte « Résultat » fait doublon avec l'accueil */
const _p=pSuivi;
pSuivi=function(){const h=_p.apply(this,arguments);
  try{if(S.role!=='parent'||typeof stage!=='function'||stage().k!=='preg')return h;
    const t=document.createElement('div');t.innerHTML=h;
    [...t.children].forEach(x=>{if(x.classList.contains('card')&&/^\s*Résultat/.test(x.textContent))x.remove()});
    return t.innerHTML}catch(e){return h}};
/* 2. après l'affichage : « Trouver mon suivi » et la fiche pour le médecin remontent en haut */
function ordonner(){try{
  if(S.role!=='parent'||S.tab!=='suivi'||S.sub)return;
  const app=document.getElementById('app')||document.querySelector('#app');if(!app)return;
  const sh=app.querySelector(':scope>.sh');
  const place=n=>{if(!n)return;if(sh)sh.after(n);else{const f=[...app.children].find(x=>!x.classList.contains('mod-prep')&&!x.classList.contains('seg'));if(f)f.before(n);else app.append(n)}};
  let fiche=app.querySelector('.gp-fiche');
  if(!fiche){const bt=app.querySelector('.gp-tests [data-gp-resume]');
    if(bt){bt.remove();bt.classList.remove('sm');bt.style.cssText='width:100%;margin:0';
      fiche=document.createElement('div');fiche.className='card gp-fiche';
      fiche.innerHTML='<span class="eyebrow acc">Pour mon médecin</span><p class="xs muted" style="margin:4px 0 8px">Un résumé de votre grossesse et de vos tests, prêt à imprimer ou à montrer à votre rendez-vous.</p>';
      fiche.appendChild(bt)}}
  const suivi=app.querySelector('.gp-suivi');
  if(fiche)place(fiche);
  if(suivi)place(suivi);
}catch(e){}}
const _r=render;render=function(){const x=_r.apply(this,arguments);try{ordonner();setTimeout(ordonner,400)}catch(e){}return x};
})();
