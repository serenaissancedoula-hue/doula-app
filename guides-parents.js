/* Sérénaissance — aide à la signature : bandeau « À remplir et signer » avec saut direct vers les champs et la signature. */
const _odGP=ouvrirDoc;ouvrirDoc=async function(id){await _odGP(id);try{
  const sh_=document.querySelector('.sheet');if(!sh_||S.role!=='parent')return;const fid=sh_.querySelector('.fid');
  const cible=sh_.querySelector('#sigNom,input.dch,select.dch,textarea.dch');if(!fid||!cible||sh_.querySelector('.gp-ban'))return;
  const ban=document.createElement('div');ban.className='banner gold gp-ban';ban.style.cssText='position:sticky;top:0;z-index:5;margin-bottom:8px';
  ban.innerHTML=icon('fa-pen-to-square')+'<div class="small"><b>À remplir et signer.</b> Les champs et la signature se trouvent dans le document, jusqu\'à la dernière page.</div><button class="btn sm" data-act="gpAller">Aller aux champs</button>';
  fid.parentNode.insertBefore(ban,fid)}catch(e){}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="gpAller"]');if(!b)return;e.stopPropagation();
  const s=document.querySelector('.sheet');const c=s&&s.querySelector('input.dch:not([type=hidden]),select.dch,#sigNom');if(c){c.scrollIntoView({behavior:'smooth',block:'center'});try{c.focus({preventScroll:true})}catch(x){}}},true);
