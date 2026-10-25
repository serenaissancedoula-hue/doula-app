/* Sérénaissance — choix de la langue dans Paramètres (doula et famille) : plus de bouton « EN » flottant. */
(function(){
if(typeof pParametres!=='function')return;
const _pp=pParametres;pParametres=function(){let h=_pp.apply(this,arguments);if(h.indexOf('data-mod-lang')>=0)return h;
  const en=window.LANG==='en';return h+'<div class="card"><span class="eyebrow acc">'+(en?'Language':'Langue')+'</span><button class="btn ghost" data-mod-lang="1">'+(en?'Passer en français':'Switch to English')+'</button></div>'};
document.addEventListener('click',e=>{if(e.target.closest('[data-mod-lang]')&&window.ESPACE!=='parent'){const b=document.getElementById('langBtn');if(b)b.click()}});
})();
