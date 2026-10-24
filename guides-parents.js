/* Sérénaissance — aide à la signature : bandeau « À remplir et signer » avec saut direct vers les champs et la signature. */
const _odGP=ouvrirDoc;ouvrirDoc=async function(id){await _odGP(id);try{
  const sh_=document.querySelector('.sheet');if(!sh_||S.role!=='parent')return;const fid=sh_.querySelector('.fid');
  const cible=sh_.querySelector('#sigNom,input.dch,select.dch,textarea.dch');if(!fid||!cible||sh_.querySelector('.gp-ban'))return;
  const ban=document.createElement('div');ban.className='banner gold gp-ban';ban.style.cssText='position:sticky;top:0;z-index:5;margin-bottom:8px';
  ban.innerHTML=icon('fa-pen-to-square')+'<div class="small"><b>À remplir et signer.</b> Les champs et la signature se trouvent dans le document, jusqu\'à la dernière page.</div><button class="btn sm" data-act="gpAller">Aller aux champs</button>';
  fid.parentNode.insertBefore(ban,fid)}catch(e){}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="gpAller"]');if(!b)return;e.stopPropagation();
  const s=document.querySelector('.sheet');const c=s&&s.querySelector('input.dch:not([type=hidden]),select.dch,#sigNom');if(c){c.scrollIntoView({behavior:'smooth',block:'center'});try{c.focus({preventScroll:true})}catch(x){}}},true);

/* Listes à cocher : la famille peut ajouter ses propres éléments (valise, préparer ma naissance) */
function gpPerso(cle){const P=(S.parent=S.parent||{});P.perso=P.perso||{};return (P.perso[cle]=P.perso[cle]||[])}
function gpBloc(cle,chemin){const L=gpPerso(cle),C=getP(chemin)||{};
  return (L.length?'<div class="checks">'+L.map((x,i)=>'<div class="row between" style="flex-wrap:nowrap;gap:8px">'+ui.check(chemin,x)+'<button class="btn sm ghost" data-act="gpDel" data-c="'+esc(cle)+'" data-i="'+i+'" title="Retirer" aria-label="Retirer">'+icon('fa-xmark')+'</button></div>').join('')+'</div>':'')+
   '<div class="row" style="flex-wrap:nowrap;gap:8px;margin-top:8px"><input type="text" class="gp-in" data-c="'+esc(cle)+'" placeholder="Ajouter mon propre élément" maxlength="120" style="flex:1;min-width:0"><button class="btn sm" data-act="gpAdd" data-c="'+esc(cle)+'">'+icon('fa-plus')+'Ajouter</button></div>'}
function gpNb(cle,chemin,base){const C=getP(chemin)||{};return base.filter(x=>C[x]).length+gpPerso(cle).filter(x=>C[x]).length}
if(typeof PSUB!=='undefined'&&typeof VALISE!=='undefined'){
  PSUB.valise=function(){return sh('Ma valise','Prête vers 35-36 semaines · ajoutez vos propres éléments dans chaque liste')+Object.entries(VALISE).map(([k,v])=>{const cle='valise|'+k;
    return '<div class="card"><div class="row between"><span class="eyebrow acc">'+k+'</span><span class="pill acc">'+gpNb(cle,'parent.valise',v)+'/'+(v.length+gpPerso(cle).length)+'</span></div>'+ui.checks('parent.valise',v)+gpBloc(cle,'parent.valise')+'</div>'}).join('')};
  if(PSUB.prep&&typeof PREP!=='undefined')PSUB.prep=function(){return sh('Préparer ma naissance','Cochez au fur et à mesure · ajoutez vos propres éléments')+'<div class="card">'+ui.checks('parent.prep',PREP)+gpBloc('prep','parent.prep')+'</div>'};
  document.addEventListener('click',e=>{const b=e.target.closest('[data-act="gpAdd"],[data-act="gpDel"]');if(!b)return;e.stopPropagation();const c=b.dataset.c,L=gpPerso(c);
    if(b.dataset.act==='gpAdd'){const inp=b.parentNode.querySelector('.gp-in'),v=(inp.value||'').trim().slice(0,120);if(!v)return;if(!L.includes(v))L.push(v)}
    else L.splice(+b.dataset.i,1);
    try{save()}catch(x){}render()},true);
  document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList&&e.target.classList.contains('gp-in')){e.preventDefault();const b=e.target.parentNode.querySelector('[data-act="gpAdd"]');if(b)b.click()}},true)}
