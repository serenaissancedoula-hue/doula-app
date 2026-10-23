/* Sérénaissance — Ma boîte à outils rangée par thèmes, avec recherche. Rien n'est retiré : tous les outils restent là. */
if(window.ESPACE==='doula'){
const GROUPES=[
 ['Chaque jour',['contr','calc','sac','couleurs']],
 ['Documents et messages',['modeles','messages','lettre','temoignages']],
 ['Rencontres',['rencontres','approche','retour']],
 ['Guides pour accompagner',['positions','confort','partenaire']],
 ['Mon compte',['profil','support','probleme','avis','doulas']],
 ['Propriétaire',['proprio','support','avisTab']]];
const _dOutE=dOutils;
dOutils=function(){if(S.dsub&&DSUB[S.dsub])return _dOutE();
  _dOutE(); /* laisse les autres modules ajouter leurs tuiles */
  const T=DOUT.slice(),vus={};
  const tuile=t=>'<button class="tile" data-act="dsub" data-v="'+t[0]+'" data-nom="'+esc((t[2]+' '+t[3]).toLowerCase())+'"><span class="ti">'+icon(t[1])+'</span><b>'+t[2]+'</b><span>'+t[3]+'</span></button>';
  let h=sh('Ma boîte à outils','Tout est là, rangé par thème')+'<input id="outSearch" type="search" placeholder="Chercher un outil…" autocomplete="off">';
  const bloc=(nom,L,ouvert)=>L.length?'<details class="acc grpOutils"'+(ouvert?' open':'')+'><summary>'+nom+' <span class="xs">('+L.length+')</span><i class="fa-solid fa-chevron-down chev"></i></summary><div class="body"><div class="tiles">'+L.map(tuile).join('')+'</div></div></details>':'';
  GROUPES.forEach((g,i)=>{const L=g[1].map(id=>T.find(t=>t[0]===id)).filter(Boolean);L.forEach(t=>vus[t[0]]=1);h+=bloc(g[0],L,i===0)});
  h+=bloc('Autres outils',T.filter(t=>!vus[t[0]]),false);
  return h};
document.addEventListener('input',e=>{if(e.target.id!=='outSearch')return;const q=e.target.value.trim().toLowerCase();
  document.querySelectorAll('.grpOutils').forEach(g=>{let n=0;g.querySelectorAll('.tile').forEach(t=>{const ok=!q||t.dataset.nom.includes(q);t.hidden=!ok;if(ok)n++});g.hidden=!n;if(q)g.open=true})});
}
