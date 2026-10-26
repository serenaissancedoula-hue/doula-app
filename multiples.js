/* Sérénaissance — grossesse multiple et ménage entre Accueil et Suivi (espace famille).
   - Jumeaux / triplés : un prénom et un sexe pour CHAQUE bébé, et les textes au pluriel (« vos bébés », « ils vous entendent »…).
   - Accueil = aujourd'hui (bébé cette semaine, mot du jour, à faire, prochain repère).
     Suivi = organiser (dates, particularités, rendez-vous, tests, semaines À VENIR) : rien n'est affiché deux fois. */
(function(){
if(window.ESPACE!=='parent')return;
const nb=()=>{try{return window.pfActif&&window.pfActif()==='grossesse'?(window.pfNbGrossesse?window.pfNbGrossesse():1):1}catch(e){return 1}};
const enceinte=()=>{try{return stage().k==='preg'}catch(e){return false}};
/* le curseur de semaines garde la semaine choisie tant qu'on reste dans Suivi */
const _r0=render;render=function(){if(S.tab!=='suivi')S._svVu=false;return _r0.apply(this,arguments)};
/* ---------- prénom et sexe de chaque bébé ---------- */
if(typeof carteBebe==='function'){const _cb=carteBebe;carteBebe=function(g){let h=_cb.apply(this,arguments);try{const n=nb();if(n<2)return h;const p=S.parent;
  if(!Array.isArray(p.prenomsGrossesse))p.prenomsGrossesse=[];if(!Array.isArray(p.sexesGrossesse))p.sexesGrossesse=[];
  const lettres=['A','B','C'];
  const bloc='<div class="soft mu-bebes" style="margin:8px 0"><span class="eyebrow acc">'+(n===2?'Vos jumeaux':'Vos triplés')+'</span>'+Array.from({length:n},(_,i)=>{const sx=p.sexesGrossesse[i]||'';
    return '<div class="mu-l"><label class="f" style="margin:0">Bébé '+lettres[i]+' (prénom, facultatif)<input type="text" value="'+esc(p.prenomsGrossesse[i]||'')+'" data-mu-nom="'+i+'" placeholder="Si vous le connaissez"></label><div class="tri">'+['Fille','Garçon','Surprise'].map(o=>'<button class="chip '+(sx===o?'on':'')+'" data-mu-sexe="'+i+'" data-v="'+o+'">'+(o==='Fille'?'💗 ':o==='Garçon'?'💙 ':'')+o+'</button>').join('')+'</div></div>'}).join('')+'</div>';
  h=h.replace(/<div class="soft" style="margin:8px 0"><div class="grid2 resp">[\s\S]*?Sexe de bébé \(facultatif\)[\s\S]*?<\/div><\/div><\/div><\/div>/,bloc)}catch(e){}return h}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-mu-sexe]');if(!b)return;e.stopPropagation();const i=+b.dataset.muSexe,p=S.parent;if(!Array.isArray(p.sexesGrossesse))p.sexesGrossesse=[];
  p.sexesGrossesse[i]=p.sexesGrossesse[i]===b.dataset.v?'':b.dataset.v;try{save()}catch(x){}b.parentNode.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c===b&&p.sexesGrossesse[i]===b.dataset.v))},true);
document.addEventListener('change',e=>{const t=e.target.closest('[data-mu-nom]');if(!t)return;const p=S.parent;if(!Array.isArray(p.prenomsGrossesse))p.prenomsGrossesse=[];p.prenomsGrossesse[+t.dataset.muNom]=t.value.trim();try{save()}catch(x){}},true);
/* ---------- textes au pluriel ---------- */
const PL=[[/\bVotre bébé(?![a-zàâçéèêëîïôûùüÿ])/g,'Vos bébés'],[/\bvotre bébé(?![a-zàâçéèêëîïôûùüÿ])/g,'vos bébés'],[/\bMon bébé(?![a-zàâçéèêëîïôûùüÿ])/g,'Mes bébés'],[/\bBébé a la taille\b/g,'Chaque bébé a la taille'],[/tourner bébé/g,'tourner vos bébés'],
  [/\bIl vous entend\b/g,'Ils vous entendent'],[/\bElle vous entend\b/g,'Ils vous entendent'],[/\bSes mouvements\b/g,'Leurs mouvements'],[/\bses organes\b/g,'leurs organes'],[/\bSon cœur\b/g,'Leur cœur'],[/\bson cœur\b/g,'leur cœur'],
  [/\bBébé grandit\b/g,'Vos bébés grandissent'],[/\bbébé bouge\b/g,'vos bébés bougent'],[/\bBébé bouge\b/g,'Vos bébés bougent'],[/Mouvements de bébé/g,'Mouvements de vos bébés'],[/\bSexe de bébé(?![a-zàâçéèêëîïôûùüÿ])/g,'Sexe de chaque bébé']];
function pluriel(root){if(!root||nb()<2||!enceinte())return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let t;while((t=w.nextNode())){if(t.parentElement&&t.parentElement.closest('input,textarea,select,.mu-bebes'))continue;let v=t.nodeValue,o=v;PL.forEach(([a,b])=>{v=v.replace(a,b)});if(v!==o)t.nodeValue=v}}
new MutationObserver(()=>{const pe=document.getElementById('bebePE');if(pe&&!pe.dataset.mu&&nb()>1){pe.dataset.mu='1';pluriel(pe)}}).observe(document.body,{childList:true,subtree:false});
/* ---------- ménage Accueil / Suivi ---------- */
const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(S.role!=='parent'||S.vue)return x;const app=document.getElementById('app');if(!app)return x;
  if(enceinte()&&!S.sub){const tab=S.tab||'accueil';
    if(tab==='accueil'){app.querySelectorAll(':scope>.pf-mult').forEach(n=>n.remove())}
    if(tab==='suivi'){app.querySelectorAll(':scope>.pf-echo').forEach(n=>n.remove());
      /* « Examens et repères » répète « Mes tests et vaccins » : on garde la liste à cocher, avec les dates dans un repli */
      const ex=[...app.querySelectorAll(':scope>.card')].find(c=>/^\s*Examens et repères/.test(c.textContent));const tests=app.querySelector(':scope>.gp-tests');
      if(ex&&tests&&!tests.querySelector('.mu-dates')){const d=document.createElement('details');d.className='mu-dates';d.innerHTML='<summary class="small" style="cursor:pointer;color:var(--accent);font-weight:600;padding:6px 0">Voir les dates prévues</summary>';const corps=ex.cloneNode(true);corps.querySelector('.eyebrow')?.remove();corps.className='';d.append(corps);tests.append(d);ex.remove()}}}
  /* sans doula : pas de « première rencontre » dans les repères de la semaine */
  if(typeof FAM!=='undefined'&&FAM&&!FAM.doula_id){const w=document.createTreeWalker(app,NodeFilter.SHOW_TEXT);let t;while((t=w.nextNode())){if(/Première rencontre\s*:[^.]*\./.test(t.nodeValue))t.nodeValue=t.nodeValue.replace(/\s*Première rencontre\s*:[^.]*\./,'')}}
  pluriel(app)}catch(e){}return x};
(function(){const st=document.createElement('style');st.textContent='.mu-bebes{display:flex;flex-direction:column;gap:10px}.mu-l{display:flex;flex-direction:column;gap:6px;padding-top:8px;border-top:1px solid var(--line,#eadfd6)}.mu-l:first-of-type{border-top:0}.mu-dates .card{padding:0;box-shadow:none;background:none;border:0}';document.head.appendChild(st)})();
})();
