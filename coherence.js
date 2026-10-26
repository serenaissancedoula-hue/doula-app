/* Sérénaissance — cohérence de l'espace famille avec ses choix :
   - sans doula : pas de « ta doula », pas de « garde de la doula », pas de messages écrits au nom d'une doula;
   - le nom de l'onglet Journal suit l'étape (Mon journal pendant la grossesse, Journal bébé après la naissance);
   - les boutons Mouvements et Contractions apparaissent quand ils ont du sens (mouvements souvent sentis vers 16 à 22 semaines);
   - les notes propres à la France ne s'affichent qu'en France; l'ordre des pages reste logique (titre en haut, pied de page en bas). */
(function(){
if(window.ESPACE!=='parent')return;
const sansDoula=()=>{try{return typeof FAM!=='undefined'&&FAM&&!FAM.doula_id}catch(e){return false}};
const region=()=>{try{return (window.maRegion&&window.maRegion())||S.parent.region||''}catch(e){return ''}};
function etape(){try{return stage()}catch(e){return {k:'none'}}}
/* mots du jour sans doula : au « vous », signés par l'équipe */
const SG=['{p}, prenez un moment aujourd\'hui pour poser vos mains sur votre ventre et respirer avec votre bébé.','Votre corps fait un travail immense, même quand vous vous reposez. Vous avez le droit de ralentir aujourd\'hui.','Une question vous trotte dans la tête ? Notez-la pour votre prochain rendez-vous : aucune question n\'est de trop.','Buvez un grand verre d\'eau et prenez une collation nourrissante : prendre soin de vous, c\'est prendre soin de votre bébé.','Vous n\'avez pas à tout savoir d\'avance. Une étape à la fois.','Offrez-vous quelque chose qui vous fait du bien aujourd\'hui : une marche, un bain tiède, une sieste.','Votre intuition compte. Si quelque chose ne vous semble pas normal, appelez votre professionnel ou le 811 : mieux vaut appeler pour rien.','Respirez lentement : inspirez par le nez en comptant 4, expirez longuement en comptant 6. Trois fois. Voilà.','Parlez à votre bébé aujourd\'hui : il reconnaît déjà votre voix.','Les émotions en montagnes russes sont normales pendant la grossesse. Parlez-en à une personne de confiance.','Allongez-vous sur le côté pour vous reposer : c\'est souvent plus confortable.','Qui pourra vous aider après la naissance ? Pensez à une personne à qui confier un repas ou une lessive.','Il n\'y a pas de façon parfaite d\'attendre un enfant. Vous faites de votre mieux, et c\'est beaucoup.','Un petit pas aujourd\'hui : cochez un élément de votre liste « Préparer ma naissance ».'],
  SF=['On approche, {p}. Gardez près de vous les numéros de votre lieu de naissance et de votre professionnel.','Votre corps sait comment faire. Une contraction à la fois, une respiration à la fois.','Votre valise est-elle prête ? Ajoutez votre plan de naissance.','Reposez-vous le plus possible ces jours-ci : chaque sieste est une réserve d\'énergie.','Eaux qui coulent, saignement, bébé qui bouge moins : appelez votre lieu de naissance sans attendre.'],
  SP=['Bonjour {p} ! Comment s\'est passée la nuit ? Notez les boires et les couches de {b}.','Le repos n\'est pas un luxe, c\'est un besoin. Dormez quand {b} dort, même 20 minutes.','Acceptez l\'aide qu\'on vous offre : un repas, une lessive, une promenade avec {b}.','Les pleurs de {b} ne veulent pas dire que vous faites quelque chose de travers. Vous apprenez à vous connaître.','Mangez et buvez bien, surtout si vous allaitez. Une collation près de vous pendant les boires aide.','Le baby blues passe en général en 2 semaines. Tristesse qui dure ou idées noires : parlez-en à votre professionnel.','Une petite marche dehors fait du bien au moral, quand vous vous sentez prête.','Vous êtes la bonne personne pour {b}.'];
if(typeof motDuJour==='function'){const _m=motDuJour;motDuJour=function(){if(!sansDoula())return _m.apply(this,arguments);try{const st=etape(),p=S.parent,n=Math.floor(Date.now()/864e5);const L=st.k==='pp'?SP:(st.k==='preg'&&st.g.w>=37)?SF:SG;
  return L[n%L.length].replace(/\{p\}/g,p.prenom||'').replace(/\{b\}/g,(p.naissance||{}).prenomBebe||'bébé').replace(/^, /,'').replace(/^([a-zà-ÿ])/,c=>c.toUpperCase())}catch(e){return _m.apply(this,arguments)}}}
/* remplacements de texte quand il n'y a pas de doula */
const SANS=[['— ta doula','— L\'équipe Sérénaissance'],['puis en parler avec la doula','puis en parler ensemble'],[', à revoir avec la doula et votre professionnel',', à revoir avec votre professionnel'],['à revoir avec la doula et votre','à revoir avec votre'],[' : votre doula les voit et ils apparaissent',' : ils apparaissent'],['Notez-le ici : votre doula le voit pour mieux vous accompagner.','Notez-le ici : si vous êtes accompagnée par une doula, elle le verra.']];
function textes(root,paires){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),L=[];while(w.nextNode())L.push(w.currentNode);L.forEach(n=>{let v=n.nodeValue,o=v;paires.forEach(([a,b])=>{if(typeof a==='string'){if(v.includes(a))v=v.split(a).join(b)}else v=v.replace(a,b)});if(v!==o)n.nodeValue=v})}
const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(S.role!=='parent')return x;const app=document.getElementById('app'),st=etape();
  /* onglet Journal selon l'étape */
  const tj=document.querySelector('#tabs [data-v="journal"]');if(tj&&!(window.ftMode&&window.ftMode())){const lab=st.k==='preg'?'Mon journal':'Journal bébé',ic=st.k==='preg'?'fa-book-open':'fa-baby';const sp=tj.querySelector('span');if(sp&&sp.textContent!==lab){sp.textContent=lab;tj.setAttribute('aria-label',lab);const i=tj.querySelector('i');if(i)i.className='fa-solid '+ic}}
  if(S.vue&&S.vue!=='params')return x;
  /* sans doula */
  if(sansDoula()){textes(app,SANS);app.querySelectorAll('.stat span').forEach(s=>{if(/garde de la doula/.test(s.textContent)){s.textContent='38 SA'}});
    app.querySelectorAll('.card').forEach(c=>{if(/Effacer ma conversation avec ma doula/.test(c.textContent))c.remove()})}
  /* notes propres à la France */
  if(region()!=='FR')textes(app,[[/(^|[.!?]\s+)France\s*:\s*[^.]*\.\s*/g,'$1']]);
  /* grossesse : mouvements et contractions au bon moment */
  if(st.k==='preg'){const w=st.g.w,has=t=>(S.logs||[]).some(l=>l.type===t);
    if(w<16&&!has('mvt'))app.querySelectorAll('[data-act="kickStart"],[data-act="jf"][data-v="mvt"]').forEach(b=>b.remove());
    if(w<20&&!has('contraction'))app.querySelectorAll('[data-act="contr"],[data-act="jf"][data-v="contraction"]').forEach(b=>b.remove());
    if(w<20)app.querySelectorAll(':scope>.btn.sage').forEach(b=>{if(/Bébé est né/.test(b.textContent))b.remove()});
    if(!S.vue&&(S.tab==='journal'&&!S.sub)){const p=app.querySelector(':scope>.sh');if(/Mouvements, contractions/.test((p||{}).textContent||'')&&w<16)p.querySelector('.sub').textContent='Humeur, symptômes et notes'}
    /* le titre de la page en haut */
    if(!S.vue&&['suivi','journal'].includes(S.tab)&&!S.sub){const t=app.querySelector(':scope>.sh');if(t){const ref=app.querySelector(':scope>.pf-sw, :scope>.en-dev');const avant=ref?ref.nextElementSibling:app.firstElementChild;if(avant!==t){const echo=t.nextElementSibling&&t.nextElementSibling.classList.contains('pf-echo')?t.nextElementSibling:null;if(ref)ref.after(t);else app.prepend(t);if(echo)t.after(echo)}}}}
  /* le pied de page toujours en dernier */
  const ft=app.querySelector(':scope>.foot');if(ft&&ft!==app.lastElementChild)app.append(ft)}catch(e){}return x};
})();
