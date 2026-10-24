/* Sérénaissance — retient la dernière section ouverte, referme les menus à flèche en changeant de page, un seul menu ouvert à la fois. */
(function(){'use strict';
const CLE='sere-nav-'+(window.ESPACE||'x'),P=window.ESPACE==='parent';
const TABS_P=['accueil','suivi','journal','madoula','preparer','souvenirs','infos'],TABS_D=['accueil','clientes','agenda','outils','ressources'];
try{const n=JSON.parse(localStorage.getItem(CLE)||'null');if(n&&typeof S!=='undefined'){
  if(P){if(TABS_P.includes(n.tab)){S.tab=n.tab;S.sub=typeof n.sub==='string'?n.sub:'';if(n.seg)S.seg=n.seg}}
  else if(TABS_D.includes(n.dtab)){S.dtab=n.dtab;S.dsub=typeof n.dsub==='string'?n.dsub:''}
  if(n.vue==='params')S.vue='params'}}catch(e){}
let derniere=null;
const cle=()=>JSON.stringify(P?[S.vue,S.tab,S.sub]:[S.vue,S.dtab,S.dsub,S.openClient,S.ctab]);
const _r=render;render=function(){const x=_r.apply(this,arguments);try{
  if(!S.role)return x;const k=cle();
  if(k!==derniere){derniere=k;document.querySelectorAll('#app details.acc[open]').forEach(d=>{d.open=false})}
  localStorage.setItem(CLE,JSON.stringify(P?{tab:S.tab,sub:S.sub,seg:S.seg||'',vue:S.vue||''}:{dtab:S.dtab,dsub:S.dsub,vue:S.vue||''}))}catch(e){}return x};
/* un seul menu à flèche ouvert à la fois, dans un même groupe */
document.addEventListener('toggle',e=>{const d=e.target;if(!d||!d.matches||!d.matches('details.acc')||!d.open)return;const p=d.parentElement;if(!p)return;
  [...p.children].forEach(x=>{if(x!==d&&x.matches&&x.matches('details.acc')&&x.open)x.open=false})},true);
})();
