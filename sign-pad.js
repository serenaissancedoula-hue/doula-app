/* Sérénaissance — signer et mettre ses initiales « comme sur papier » : on touche la ligne dans le document, un grand cadre s'ouvre (doigt ou clavier). */
(function(){
const FONT='"Segoe Script","Brush Script MT","Snell Roundhand",cursive';
function zone(t){return '<button type="button" class="pad-zone" data-act="padOpen" data-t="'+t+'">'+(t==='sig'?'✎ Toucher pour signer':'✎ initiales')+'</button>'}
function previews(s){const sg=s.querySelector('#sigC'),ic=s.querySelector('#iniC'),id=s.querySelector('#iniD');
  s.querySelectorAll('.pad-zone[data-t=sig]').forEach(z=>{z.innerHTML=sg&&!sg._vide?'<img src="'+sg.toDataURL('image/png')+'" alt="Signature" style="max-height:44px;max-width:100%"><small>Toucher pour modifier</small>':'✎ Toucher pour signer';z.classList.toggle('fait',!!(sg&&!sg._vide))});
  s.querySelectorAll('.pad-zone[data-t=inid]').forEach(z=>{z.innerHTML=id&&!id._vide?'<img src="'+id.toDataURL('image/png')+'" alt="Initiales" style="height:20px">':'✎ initiales';z.classList.toggle('fait',!!(id&&!id._vide))});
  s.querySelectorAll('.pad-zone[data-t=ini]').forEach(z=>{z.innerHTML=ic&&!ic._vide?'<img src="'+ic.toDataURL('image/png')+'" alt="Initiales" style="height:20px">':'✎ initiales';z.classList.toggle('fait',!!(ic&&!ic._vide))})}
const _od=ouvrirDoc;ouvrirDoc=async function(id){await _od(id);try{
  const s=document.querySelector('.sheet');if(!s||s.querySelector('.pad-zone'))return;
  const sg=s.querySelector('#sigC'),ic=s.querySelector('#iniC');if(!sg&&!ic)return;
  if(sg&&S.role==='doula'&&!s.querySelector('#iniD')){const cv=document.createElement('canvas');cv.id='iniD';cv.width=300;cv.height=120;cv.hidden=true;cv._vide=true;s.appendChild(cv);s.querySelectorAll('.fid-pied span').forEach(sp=>{if(/Doula _{3,}/.test(sp.textContent))sp.innerHTML=sp.innerHTML.replace(/Doula _{3,}/,'Doula '+zone('inid'))})}
  if(ic)s.querySelectorAll('.fid-pied span').forEach(sp=>{if(/Parents _{3,}/.test(sp.textContent))sp.innerHTML=sp.innerHTML.replace(/Parents _{3,}/,'Parents '+zone('ini'))});
  if(sg){const cell=s.querySelector('.fid .sig-cell');if(cell){[...cell.children].forEach(c=>{c.style.display='none'});cell.insertAdjacentHTML('beforeend',zone('sig'))}}
  const b=s.querySelector('.gp-ban');if(b)b.querySelector('.small').innerHTML='<b>À remplir et signer</b> · touchez les lignes du document.';
  previews(s)}catch(e){}};
function pad(type){const s=document.querySelector('.sheet');if(!s)return;const cible=s.querySelector(type==='ini'?'#iniC':type==='inid'?'#iniD':'#sigC');if(!cible)return;const nomIn=s.querySelector('#sigNom'),ini=type==='ini'||type==='inid';
  const o=document.createElement('div');o.id='padOv';o.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(40,30,26,.5);display:flex;align-items:flex-end;justify-content:center;overscroll-behavior:contain';
  o.innerHTML='<div style="background:var(--bg,#faf5ef);width:100%;max-width:560px;border-radius:20px 20px 0 0;padding:16px 16px calc(env(safe-area-inset-bottom,0px) + 16px);display:flex;flex-direction:column;gap:10px;box-sizing:border-box"><div class="row between"><b style="font-size:1.1rem">'+(ini?'Mes initiales':'Ma signature')+'</b><button type="button" class="icon-btn" data-p="non" aria-label="Fermer">✕</button></div>'+
   '<label class="f">Votre nom complet<input type="text" id="padNom" autocomplete="name" placeholder="Prénom et nom" value="'+esc((nomIn&&nomIn.value)||'')+'"></label>'+
   '<span class="xs muted">'+(ini?'Écrivez vos initiales':'Signez')+' dans le cadre avec le doigt, ou tapez-les au clavier.</span>'+
   '<canvas id="padC" width="'+(ini?400:800)+'" height="'+(ini?220:300)+'" style="width:100%;height:'+(ini?150:190)+'px;border:2px dashed #d9a08a;border-radius:12px;background:#fffdfb;touch-action:none;display:block"></canvas>'+
   '<div style="display:flex;flex-wrap:wrap;gap:8px"><button type="button" class="btn sm ghost" data-p="eff">Effacer</button><button type="button" class="btn sm ghost" data-p="clav">⌨ Taper au clavier</button><button type="button" class="btn" data-p="ok" style="margin-left:auto">Valider</button></div></div>';
  document.body.appendChild(o);const cv=o.querySelector('#padC');initSig(cv);
  const ctx=cv.getContext('2d');ctx.lineWidth=4;
  o.addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(!b){if(e.target===o)o.remove();return}e.stopPropagation();const p=b.dataset.p,nom=o.querySelector('#padNom').value.trim();
    if(p==='non'){o.remove();return}
    if(p==='eff'){ctx.clearRect(0,0,cv.width,cv.height);cv._vide=true;return}
    if(p==='clav'){if(!nom){toast('Écrivez d\'abord votre nom');o.querySelector('#padNom').focus();return}
      const txt=ini?nom.split(/\s+/).map(w=>w[0]).join('').toUpperCase().slice(0,4):nom;ctx.clearRect(0,0,cv.width,cv.height);ctx.fillStyle='#2c221e';ctx.textBaseline='middle';
      let px=Math.round(cv.height*.5);ctx.font='italic '+px+'px '+FONT;while(ctx.measureText(txt).width>cv.width-40&&px>16){px-=2;ctx.font='italic '+px+'px '+FONT}ctx.fillText(txt,20,cv.height/2);cv._vide=false;return}
    if(p==='ok'){if(cv._vide){toast(ini?'Écrivez vos initiales':'Signez dans le cadre');return}
      if(!nom&&type==='sig'){toast('Écrivez votre nom');o.querySelector('#padNom').focus();return}
      if(nomIn&&nom&&type==='sig')nomIn.value=nom;
      const t=cible.getContext('2d');t.clearRect(0,0,cible.width,cible.height);t.drawImage(cv,0,0,cible.width,cible.height);cible._vide=false;
      if(type==='ini'){const h=s.querySelector('input.dch[data-k=initiales]');if(h)h.value=cible.toDataURL('image/png')}
      o.remove();previews(s);toast(ini?'Initiales ajoutées':'Signature ajoutée')}});
  setTimeout(()=>{if(!ini&&!o.querySelector('#padNom').value)o.querySelector('#padNom').focus()},50)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="padOpen"]');if(!b)return;e.stopPropagation();e.preventDefault();pad(b.dataset.t)},true);
/* effacer depuis les anciens boutons : garde les aperçus à jour */
document.addEventListener('click',e=>{if(e.target.closest('[data-act="sigEff"],[data-act="gpIniEff"]'))setTimeout(()=>{const s=document.querySelector('.sheet');if(s)previews(s)},50)});
const _ls=lireSig;lireSig=function(){const r=_ls.apply(this,arguments);try{if(r){const c=document.querySelector('.sheet #iniD');if(c&&!c._vide)r.initiales=c.toDataURL('image/png')}const ch={};document.querySelectorAll('.sheet .dchd').forEach(el=>{if(el.value.trim())ch[el.dataset.k]=el.value.trim()});if(Object.keys(ch).length)r.champs=ch}catch(e){}return r};
const _dv=docVue;docVue=function(d,doula){let h=_dv.apply(this,arguments);try{const I=d&&d.signature_doula&&d.signature_doula.initiales;if(I&&/^data:image\/png;base64,[A-Za-z0-9+\/=]+$/.test(I))h=h.replace(/Doula _{3,}/g,'Doula <img src="'+I+'" alt="initiales" style="height:22px;vertical-align:middle">')}catch(e){}return h};
})();
