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
  const cv=bloc.querySelector('#iniC');initSig(cv);cv.addEventListener('pointerup',()=>{const h=document.querySelector('.sheet input.dch[data-k=initiales]');if(h)h.value=cv._vide?'':cv.toDataURL('image/png')})
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

/* Ordinateur ou tablette/cellulaire : on adapte les consignes (doigt / souris) et on offre aussi de taper sa signature au clavier */
const GP_TACTILE=(navigator.maxTouchPoints>0)&&!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
const _odGP3=ouvrirDoc;ouvrirDoc=async function(id){await _odGP3(id);try{
  const s=document.querySelector('.sheet');if(!s||S.role!=='parent'||s.querySelector('.gp-clav'))return;
  const outil=GP_TACTILE?'avec le doigt':'avec la souris ou le pavé tactile (maintenez le clic enfoncé et tracez)';
  s.querySelectorAll('.xs.muted').forEach(x=>{if(/doigt/.test(x.textContent))x.textContent=x.textContent.replace(/avec le doigt/g,outil).replace(/Signez avec le doigt dans le cadre/,'Signez '+outil+' dans le cadre')});
  s.querySelectorAll('.gp-case').forEach(()=>{});const m=[...s.querySelectorAll('p.xs.muted')].find(p=>/Touchez la case/.test(p.textContent));if(m)m.textContent=GP_TACTILE?'Touchez la case du forfait que vous choisissez.':'Cliquez sur la case du forfait que vous choisissez.';
  [['#sigC','Taper ma signature au clavier'],['#iniC','Taper mes initiales au clavier']].forEach(([sel,t])=>{const cv=s.querySelector(sel);if(!cv)return;
    const b=document.createElement('button');b.type='button';b.className='btn sm ghost gp-clav';b.dataset.act='gpClavier';b.dataset.c=sel;b.style.alignSelf='flex-start';b.innerHTML=icon('fa-keyboard')+t;
    const eff=cv.parentNode.querySelector('button[data-act=sigEff],button[data-act=gpIniEff]');(eff||cv).insertAdjacentElement('afterend',b)})
}catch(e){}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="gpClavier"]');if(!b)return;e.stopPropagation();
  const s=document.querySelector('.sheet'),cv=s.querySelector(b.dataset.c),nom=((s.querySelector('#sigNom')||{}).value||'').trim();
  if(!nom){toast('Écrivez d\'abord votre nom complet');const n=s.querySelector('#sigNom');if(n){n.scrollIntoView({block:'center'});n.focus()}return}
  const txt=b.dataset.c==='#iniC'?nom.split(/\s+/).map(w=>w[0]).join('').toUpperCase().slice(0,4):nom;
  const x=cv.getContext('2d');x.clearRect(0,0,cv.width,cv.height);x.fillStyle='#2c221e';x.textBaseline='middle';
  let px=Math.round(cv.height*.6);x.font='italic '+px+'px "Segoe Script","Brush Script MT","Snell Roundhand",cursive';while(x.measureText(txt).width>cv.width-30&&px>14){px-=2;x.font='italic '+px+'px "Segoe Script","Brush Script MT","Snell Roundhand",cursive'}
  x.fillText(txt,15,cv.height/2);cv._vide=false;
  if(b.dataset.c==='#iniC')s.querySelector('input.dch[data-k=initiales]').value=cv.toDataURL('image/png');toast('Ajouté : vous pouvez effacer et recommencer')},true);

/* Présentation propre : nom, signature et initiales réunis dans un seul bloc, pleine largeur (cellulaire comme ordinateur) */
const _odGP4=ouvrirDoc;ouvrirDoc=async function(id){await _odGP4(id);try{
  const s=document.querySelector('.sheet');if(!s||S.role!=='parent'||s.querySelector('.gp-card'))return;
  const nom=s.querySelector('#sigNom'),sig=s.querySelector('#sigC'),ini=s.querySelector('#iniC');if(!nom||!sig)return;
  const card=document.createElement('div');card.className='card stack gp-card';card.style.gap='10px';
  const cap=t=>{const e=document.createElement('span');e.className='eyebrow acc';e.textContent=t;return e};
  const rang=()=>{const r=document.createElement('div');r.style.cssText='display:flex;flex-wrap:wrap;gap:8px';return r};
  const sigBtns=[...sig.parentNode.querySelectorAll('button')];
  const lab=document.createElement('label');lab.className='f';lab.append('Votre nom complet');nom.className='';nom.style.cssText='width:100%';lab.appendChild(nom);
  card.append(cap('Ma signature'),lab);
  sig.style.cssText='width:100%;height:130px;max-width:100%;display:block';card.appendChild(sig);
  const r1=rang();sigBtns.forEach(b=>r1.appendChild(b));card.appendChild(r1);
  if(ini){const bloc=ini.closest('.stack');if(bloc){const ib=[...bloc.querySelectorAll('button')],hid=bloc.querySelector('input.dch');
    const t=document.createElement('span');t.className='xs muted';t.textContent=(bloc.querySelector('.xs.muted')||{}).textContent||'';
    card.append(cap('Mes initiales'),t);ini.style.cssText='width:100%;max-width:240px;height:100px;display:block';card.appendChild(ini);
    const r2=rang();ib.forEach(b=>r2.appendChild(b));card.appendChild(r2);if(hid)card.appendChild(hid);bloc.remove()}}
  card.querySelectorAll('.btn').forEach(b=>{b.style.whiteSpace='nowrap';b.style.alignSelf='auto'});
  const okL=s.querySelector('#sigOk');const ref=okL?okL.closest('label'):null;
  if(ref)ref.parentNode.insertBefore(card,ref);else s.appendChild(card);
  s.querySelectorAll('.fid .sig-cell').forEach(c=>{c.innerHTML='<span class="xs muted">Voir « Ma signature » sous le document</span>'})
}catch(e){}};

/* Lignes vides du contrat (« Signé à · le », professionnel de santé, etc.) : la famille les remplit directement dans l'appli */
const _dvGP2=docVue;docVue=function(d,doula){let h=_dvGP2(d,doula);
  if(!d||d.type!=='contrat'||!/class="fid-row"/.test(h))return h;
  const edit=!doula&&S.role==='parent'&&d.statut==='a_remplir',R=d.reponses||{};
  const t=document.createElement('div');t.innerHTML=h;let i=0,ch=false;
  t.querySelectorAll('.fid-row').forEach(r=>{const b=r.querySelector('b');if(!b||b.querySelector('input,select,textarea'))return;
    const v=b.textContent.replace(/ /g,' ').trim();if(v&&!/^\[[^\]]*\]$/.test(v))return;
    const lab=(r.querySelector('span')||{}).textContent||'';if(/doula|TVH|^parent\s*\d/i.test(lab))return;const k='lib'+(i++);
    if(edit){b.innerHTML='<input type="text" class="dch" data-k="'+k+'" placeholder="'+esc(lab.replace(/\s*\(.*$/,'').trim()||'À remplir')+'" maxlength="160">';ch=true}
    else if(R[k]){b.textContent=R[k];ch=true}});
  return ch?t.innerHTML:h};

/* Paramètres : chaque section est repliée (flèche) ; une fois enregistré, la page se rafraîchit et la section se referme */
const _pPGP=pParametres;pParametres=function(){const h=_pPGP.apply(this,arguments);try{
  const t=document.createElement('div');t.innerHTML=h;let nb=0;
  [...t.children].forEach(c=>{if(!c.classList.contains('card')||c.classList.contains('flat'))return;
    const e=c.firstElementChild;if(!e||!e.classList.contains('eyebrow'))return;
    const det=document.createElement('details');det.className='acc';det.dataset.sec=e.textContent.trim();
    const sm=document.createElement('summary');sm.innerHTML=esc(e.textContent.trim())+'<i class="fa-solid fa-chevron-down chev"></i>';
    e.remove();const body=document.createElement('div');body.className='body';while(c.firstChild)body.appendChild(c.firstChild);
    det.append(sm,body);c.replaceWith(det);nb++});
  return nb?t.innerHTML:h}catch(e){return h}};
document.addEventListener('click',e=>{const b=e.target.closest('details.acc[data-sec] [data-act]');if(!b||!/^(save|sauver|changer|forf|ff)/i.test(b.dataset.act||''))return;const d=b.closest('details.acc');setTimeout(()=>{try{d.open=false}catch(x){}},500)},false);
