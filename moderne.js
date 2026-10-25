/* Sérénaissance — Espace Famille moderne : bébé en premier sur l'accueil, puis les raccourcis ;
   la langue passe dans Paramètres (plus de bouton flottant une fois connectée). */
(function(){
/* Barre du bas : « Journal bébé » à la place de « Préparer » (Préparer reste accessible depuis Infos et l'accueil) */
try{const k=PTABS2.findIndex(x=>x[0]==='preparer');if(k>=0)PTABS2.splice(k,1,['journal','fa-baby','Journal bébé'])}catch(e){}
if(typeof pInfos==='function'){const _pi=pInfos;pInfos=function(){const h=_pi.apply(this,arguments);if(S.sub)return h;
  return '<button class="tile" data-act="tab" data-v="preparer" style="width:100%;margin-bottom:14px"><span class="ti">'+icon('fa-clipboard-list')+'</span><b>Préparer ma naissance</b><span>Plan de naissance, valise, partenaire, 40 jours</span></button>'+h}}
const _r=render;render=function(){const x=_r.apply(this,arguments);try{
  if(S.tab==='journal'){const sv=document.querySelector('#tabs [data-v=suivi]');if(sv)sv.classList.remove('on')}
  document.body.classList.toggle('connecte',!!(typeof MOI!=='undefined'&&MOI&&S.role));
  const app=document.getElementById('app');
  /* Journal bébé : le titre dit l'âge de bébé (« Nolan a 3 jours ») et passe en premier */
  if(app&&S.role==='parent'&&!S.vue&&S.tab==='journal'){try{const st=stage(),sh=[...app.querySelectorAll(':scope>.sh')].find(x=>/mon journal/i.test(x.textContent));
    if(st.k==='pp'&&sh){const n=((S.parent.naissance||{}).prenomBebe||'').trim()||'Bébé',d=Math.max(0,st.day|0),s=Math.floor(d/7),j=d%7;
      const h=sh.querySelector('h1');if(h)h.textContent=d===0?n+' est arrivé(e) aujourd\'hui 🩷':n+' a '+d+' jour'+(d>1?'s':'');
      let e=sh.querySelector('.b3j-age');if(d>=7){if(!e){e=document.createElement('span');e.className='eyebrow acc b3j-age';sh.prepend(e)}e.textContent=s+' semaine'+(s>1?'s':'')+(j?' et '+j+' jour'+(j>1?'s':''):'')}
      if(app.firstElementChild!==sh)app.prepend(sh)}}catch(e){}}
  /* Journal bébé a son propre onglet : plus besoin du choix « Mon suivi / Mon journal » */
  if(app&&S.role==='parent'&&(S.tab==='suivi'||S.tab==='journal')){const sg=[...app.querySelectorAll(':scope>.seg')].find(x=>x.querySelector('[data-act=spv]'));if(sg)sg.remove()}
  /* Suivi : le calendrier en premier, juste sous « Mon suivi / Mon journal » */
  if(S.role==='parent'&&!S.vue&&S.tab==='suivi'&&app){const cal=[...app.querySelectorAll(':scope>.card')].find(c=>{const e=c.querySelector('.eyebrow');return e&&/^mon calendrier$/i.test(e.textContent.trim())});
    if(cal){const seg=app.querySelector(':scope>.seg');if(seg){if(seg.nextElementSibling!==cal)seg.after(cal)}else if(app.firstElementChild!==cal)app.prepend(cal)}
    /* les vaccins de bébé tout en haut, avant le calendrier */
    const vac=[...app.querySelectorAll(':scope>.card')].find(c=>{const e=c.querySelector('.eyebrow');return e&&/^vaccins de bébé$/i.test(e.textContent.trim())});
    if(vac){const seg=app.querySelector(':scope>.seg');if(seg){if(seg.nextElementSibling!==vac)seg.after(vac)}else if(app.firstElementChild!==vac)app.prepend(vac)}}
  /* Accueil : bébé tout en haut (grossesse et après la naissance), puis les raccourcis */
  if(S.role==='parent'&&!S.vue&&(S.tab||'accueil')==='accueil'){const bc=app&&(app.querySelector(':scope>.b3h-carte')||app.querySelector(':scope>.bebe-carte'));
    if(bc){const sh=app.querySelector(':scope>.sh');if(sh)sh.remove();if(app.firstElementChild!==bc)app.prepend(bc);const q=app.querySelector(':scope>.quick');if(q&&bc.nextElementSibling!==q)bc.after(q);
      /* au-dessus de bébé : d'abord le mot du jour, puis la prochaine rencontre */
      const rdv=[...app.querySelectorAll(':scope>.card')].find(c=>{const e=c.querySelector('.eyebrow');return e&&/^(prochain rendez-vous|rendez-vous demandé|nouvelle date proposée)/i.test(e.textContent.trim())});
      const mot=app.querySelector(':scope>.card.mot');
      if(rdv)app.insertBefore(rdv,bc);if(mot)app.insertBefore(mot,rdv||bc)}}}catch(e){}return x};
if(typeof pParametres==='function'){const _pp=pParametres;pParametres=function(){let h=_pp.apply(this,arguments);if(S.role!=='parent')return h;
  const en=window.LANG==='en';return h+'<div class="card"><span class="eyebrow acc">'+(en?'Language':'Langue')+'</span><button class="btn ghost" data-mod-lang="1">'+(en?'Passer en français':'Switch to English')+'</button></div>'}}
document.addEventListener('click',e=>{if(e.target.closest('[data-mod-lang]')){const b=document.getElementById('langBtn');if(b)b.click()}});
})();
