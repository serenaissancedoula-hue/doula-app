/* Sérénaissance — aide à la signature : bandeau « À remplir et signer » avec saut direct vers les champs et la signature. */
const _odGP=ouvrirDoc;ouvrirDoc=async function(id){await _odGP(id);try{
  const sh_=document.querySelector('.sheet');if(!sh_||S.role!=='parent')return;const fid=sh_.querySelector('.fid');
  const cible=sh_.querySelector('#sigNom,input.dch,select.dch,textarea.dch');if(!fid||!cible||sh_.querySelector('.gp-ban'))return;
  const ban=document.createElement('div');ban.className='banner gold gp-ban';ban.style.cssText='position:sticky;top:0;z-index:5;margin-bottom:8px';
  ban.innerHTML=icon('fa-pen-to-square')+'<div class="small"><b>À remplir et signer.</b> Les champs et la signature se trouvent dans le document, jusqu\'à la dernière page.</div><button class="btn sm" data-act="gpAller">Prochaine étape</button>';
  fid.parentNode.insertBefore(ban,fid)}catch(e){}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="gpAller"]');if(!b)return;e.stopPropagation();
  const s=document.querySelector('.sheet');if(!s)return;const vide=el=>!el.value||!String(el.value).trim();let c=null,msg='';
  const f=s.querySelector('input.dch[data-k=forfait_choisi]');
  if(f&&!f.value){c=s.querySelector('.gp-case');msg='Touchez le forfait choisi'}
  if(!c){const l=[...s.querySelectorAll('input.dch:not([type=hidden]),select.dch,textarea.dch')].find(el=>el.type==='checkbox'?false:vide(el));if(l){c=l;msg='Champ à remplir'}}
  const ini=s.querySelector('input.dch[data-k=initiales]');
  if(!c&&ini&&!ini.value){c=s.querySelector('#iniC');msg='Vos initiales au doigt'}
  if(!c){const n=s.querySelector('#sigNom');if(n){c=(n.value&&s.querySelector('#sigC'))?s.querySelector('#sigC'):n;msg='Votre signature'}}
  if(!c){toast('Tout est rempli : cochez « J\'ai lu » puis envoyez');const ok=s.querySelector('#sigOk');if(ok)ok.scrollIntoView({behavior:'smooth',block:'center'});return}
  c.scrollIntoView({behavior:'smooth',block:'center'});toast(msg);try{if(c.focus&&c.tagName!=='CANVAS')c.focus({preventScroll:true})}catch(x){}},true);

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

/* Contrat : la famille coche elle-même son forfait et met ses initiales au doigt (appliquées à chaque page) */
const _odGP2=ouvrirDoc;ouvrirDoc=async function(id){await _odGP2(id);try{
  const s=document.querySelector('.sheet');if(!s||S.role!=='parent'||s.querySelector('#iniC'))return;
  const d=(DOCS||[]).find(x=>x.id===id);if(!d||d.statut!=='a_remplir'||d.type!=='contrat')return;
  const cases=[...s.querySelectorAll('.fid .pap-case')].filter(p=>/ · \d[\d\s  ]*\$/.test(p.textContent));
  if(cases.length){cases.forEach(p=>{p.querySelector('.bx').textContent='';p.classList.add('gp-case');p.style.cursor='pointer';p.dataset.n=p.textContent.split(' · ')[0].trim()});
    const h=document.createElement('input');h.type='hidden';h.className='dch';h.dataset.k='forfait_choisi';h.value='';s.appendChild(h);
    const m=document.createElement('p');m.className='xs muted';m.textContent='Touchez la case du forfait que vous choisissez.';cases[0].parentNode.insertBefore(m,cases[0])}
  const ok=s.querySelector('#sigOk'),bloc=document.createElement('div');bloc.className='stack';bloc.style.gap='6px';
  bloc.innerHTML='<span class="eyebrow acc">Vos initiales</span><span class="xs muted">Écrivez vos initiales avec le doigt : elles seront placées au bas de chaque page du contrat.</span><canvas class="sig" id="iniC" width="300" height="120" style="height:90px;max-width:220px"></canvas><button class="btn sm ghost" data-act="gpIniEff" style="align-self:flex-start">Effacer</button><input type="hidden" class="dch" data-k="initiales" value="">';
  (ok?ok.closest('label'):s).parentNode.insertBefore(bloc,ok?ok.closest('label'):null);
  const cv=bloc.querySelector('#iniC');initSig(cv);cv.addEventListener('pointerup',()=>{bloc.querySelector('input.dch').value=cv._vide?'':cv.toDataURL('image/png')})
}catch(e){}};
document.addEventListener('click',e=>{const s=document.querySelector('.sheet');if(!s)return;
  const p=e.target.closest('.gp-case');if(p){e.stopPropagation();s.querySelectorAll('.gp-case').forEach(x=>x.querySelector('.bx').textContent='');p.querySelector('.bx').textContent='✕';s.querySelector('input.dch[data-k=forfait_choisi]').value=p.dataset.n;return}
  if(e.target.closest('[data-act="gpIniEff"]')){e.stopPropagation();const cv=s.querySelector('#iniC');cv.getContext('2d').clearRect(0,0,cv.width,cv.height);cv._vide=true;s.querySelector('input.dch[data-k=initiales]').value='';return}
  const b=e.target.closest('[data-act="docSignerP"]');if(!b||b._gp)return;const f=s.querySelector('input.dch[data-k=forfait_choisi]'),ini=s.querySelector('input.dch[data-k=initiales]');if(!f&&!ini)return;
  if(f&&!f.value){e.stopPropagation();toast('Touchez la case du forfait que vous choisissez');return}
  if(ini&&!ini.value){e.stopPropagation();toast('Mettez vos initiales avec le doigt');return}
  if(f&&f.value!==(FAM&&FAM.forfait)){e.stopPropagation();b.disabled=true;(async()=>{const {error}=await sb.rpc('fam_choisir_forfait',{p_famille:FAM.id,p_forfait:f.value});b.disabled=false;if(error){toast(error.message);return}FAM.forfait=f.value;b._gp=1;b.click();b._gp=0})()}
},true);
/* initiales de la famille affichées au bas de chaque page une fois le contrat signé */
const _dvGP=docVue;docVue=function(d,doula){let h=_dvGP(d,doula);const I=d&&d.reponses&&d.reponses.initiales;
  if(I&&/^data:image\/png;base64,[A-Za-z0-9+\/=]+$/.test(I))h=h.replace(/Parents _{3,}/g,'Parents <img src="'+I+'" alt="initiales" style="height:22px;vertical-align:middle">');return h};
