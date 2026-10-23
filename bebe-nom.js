/* Sérénaissance — bébé : mesures et battements indiqués comme approximatifs ; la maman peut ajouter le nom et le sexe de bébé. */
const _cbN=carteBebe;carteBebe=function(g){let h=_cbN(g);try{
  const n=S.parent.naissance||{},nom=(n.prenomBebe||'').trim(),sx=n.sexe||'';
  const ico=sx==='Fille'?' 💗':sx==='Garçon'?' 💙':'';
  h=h.replace('<span class="eyebrow acc">Mon bébé</span>','<span class="eyebrow acc">'+(nom?esc(nom):'Mon bébé')+ico+'</span>');
  h=h.replace('<span class="eyebrow">Taille</span>','<span class="eyebrow">Taille ≈ approximative</span>');
  h=h.replace('<span>Cœur<small>bpm</small></span>','<span>Cœur ≈<small>bpm</small></span>');
  h=h.replace(/(<div class="bb2-l"><span>(?:Longueur|Poids)<small>[^<]*<\/small><\/span><b class="num">)/g,'$1≈ ').replace(/(<span>Cœur ≈<small>bpm<\/small><\/span><b class="num">)/,'$1≈ ');
  h=h.replace('<div class="prog">','<div class="soft" style="margin:8px 0"><div class="grid2 resp">'+ui.text('parent.naissance.prenomBebe','Nom de bébé (facultatif)','text','Si vous le connaissez')+'<div class="f"><span>Sexe de bébé (facultatif)</span>'+ui.pick('parent.naissance.sexe',['Fille','Garçon','Surprise'])+'</div></div></div><div class="prog">');
  h=h.replace(/Mesures moyennes : chaque bébé grandit à son rythme\./,'Les mesures et les battements du cœur sont toujours approximatifs : ce sont des moyennes pour cette semaine, et chaque bébé grandit à son rythme.')}catch(e){}return h};
const _opN=ouvrirBebePE;ouvrirBebePE=function(){_opN.apply(this,arguments);try{
  document.querySelectorAll('.pe-taille').forEach(e=>{if(!/^≈/.test(e.textContent))e.textContent='≈ '+e.textContent});
  document.querySelectorAll('.mesures .num').forEach(e=>{if(!/^≈/.test(e.textContent))e.textContent='≈ '+e.textContent});
  const m=document.querySelector('.mesures');if(m&&!document.getElementById('apprxN'))m.insertAdjacentHTML('afterend','<p class="xs muted" id="apprxN">Mesures et battements approximatifs (moyennes de la semaine).</p>')}catch(e){}};
