/* Sérénaissance — Espace Famille moderne : bébé en premier sur l'accueil, puis les raccourcis ;
   la langue passe dans Paramètres (plus de bouton flottant une fois connectée). */
(function(){
const _r=render;render=function(){const x=_r.apply(this,arguments);try{
  document.body.classList.toggle('connecte',!!(typeof MOI!=='undefined'&&MOI&&S.role));
  const app=document.getElementById('app');
  /* Suivi : le calendrier en premier, juste sous « Mon suivi / Mon journal » */
  if(S.role==='parent'&&!S.vue&&S.tab==='suivi'&&app){const cal=[...app.querySelectorAll(':scope>.card')].find(c=>{const e=c.querySelector('.eyebrow');return e&&/^mon calendrier$/i.test(e.textContent.trim())});
    if(cal){const seg=app.querySelector(':scope>.seg');if(seg){if(seg.nextElementSibling!==cal)seg.after(cal)}else if(app.firstElementChild!==cal)app.prepend(cal)}
    /* les vaccins de bébé tout en haut, avant le calendrier */
    const vac=[...app.querySelectorAll(':scope>.card')].find(c=>{const e=c.querySelector('.eyebrow');return e&&/^vaccins de bébé$/i.test(e.textContent.trim())});
    if(vac){const seg=app.querySelector(':scope>.seg');if(seg){if(seg.nextElementSibling!==vac)seg.after(vac)}else if(app.firstElementChild!==vac)app.prepend(vac)}}
  /* Accueil : bébé tout en haut (grossesse et après la naissance), puis les raccourcis */
  if(S.role==='parent'&&!S.vue&&(S.tab||'accueil')==='accueil'){const bc=app&&(app.querySelector(':scope>.b3h-carte')||app.querySelector(':scope>.bebe-carte'));
    if(bc){const sh=app.querySelector(':scope>.sh');if(sh)sh.remove();if(app.firstElementChild!==bc)app.prepend(bc);const q=app.querySelector(':scope>.quick');if(q&&bc.nextElementSibling!==q)bc.after(q)}}}catch(e){}return x};
if(typeof pParametres==='function'){const _pp=pParametres;pParametres=function(){let h=_pp.apply(this,arguments);if(S.role!=='parent')return h;
  const en=window.LANG==='en';return h+'<div class="card"><span class="eyebrow acc">'+(en?'Language':'Langue')+'</span><button class="btn ghost" data-mod-lang="1">'+(en?'Passer en français':'Switch to English')+'</button></div>'}}
document.addEventListener('click',e=>{if(e.target.closest('[data-mod-lang]')){const b=document.getElementById('langBtn');if(b)b.click()}});
})();
