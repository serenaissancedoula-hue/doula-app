/* Sérénaissance — espace famille : quand un menu déroulant s'ouvre, les autres du même groupe se ferment (comme dans Paramètres). */
document.addEventListener('toggle',e=>{const d=e.target;if(!d||!d.matches||!d.matches('details.acc')||!d.open)return;
  if(!(typeof S!=='undefined'&&S.role==='parent'))return;const p=d.parentElement;if(!p)return;
  const fr=[...p.children].filter(x=>x.matches&&x.matches('details.acc'));if(fr.length<3)return;
  fr.forEach(x=>{if(x!==d&&x.open)x.open=false})},true);
