/* Sérénaissance — Espace Doula : « mes propres contrats et fiches ».
   1) Mes modèles de documents : un encadré bien visible en haut pour téléverser ses propres contrats / formulaires
      (bibliothèque de la doula, envoyés ensuite à signer dans l'appli).
   2) Dossier de suivi d'une famille : « Mes propres fiches » — la doula joint ses fiches (PDF ou photo d'une fiche remplie).
      Privées : gardées dans le dossier de la doula (fam_dossiers), la famille ne les voit pas. */
(function(){
if(window.ESPACE==='parent')return;
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MAX=3*1024*1024;
/* 1) en haut de « Mes modèles de documents » */
if(DSUB.modeles){const _m=DSUB.modeles;DSUB.modeles=function(){const h=_m.apply(this,arguments);const nb=((ME_DOULA&&ME_DOULA.biblio)||[]).length;
  const bloc='<div class="card tint fp-propres"><span class="eyebrow acc">Vous avez déjà vos propres contrats ?</span><p class="small" style="margin:4px 0 8px">Utilisez-les tels quels : téléversez vos documents (PDF ou image) une seule fois, puis envoyez-les à n\'importe quelle famille, à lire ou à signer avec son doigt dans l\'appli.</p>'+
    '<div class="row" style="gap:8px;flex-wrap:wrap"><label class="btn sm" style="cursor:pointer">'+icon('fa-upload')+'Téléverser mes documents<input type="file" id="mqBibUp" accept="application/pdf,image/*" multiple hidden></label><button class="btn sm ghost" data-act="dsub" data-v="biblio">'+icon('fa-folder-open')+'Ma bibliothèque'+(nb?' ('+nb+')':'')+'</button></div></div>';
  const i=h.indexOf('</div>',h.indexOf('class="sh"'));return i<0?bloc+h:h.slice(0,i+6)+bloc+h.slice(i+6)}}
/* 2) fiches privées dans le dossier de suivi */
function fichesCarte(c){const L=c.fichesPerso||[];
  return '<div class="card fp-fiches"><span class="eyebrow acc">Mes propres fiches</span><p class="xs muted">Vous utilisez déjà vos fiches de suivi ? Joignez-les ici (PDF, ou photo d\'une fiche remplie). Elles restent dans votre dossier : la famille ne les voit pas. Pour adapter les fiches de l\'appli à votre façon, touchez « Adapter mon modèle » plus haut.</p>'+
   (L.length?'<div class="list">'+L.map((f,k)=>'<div class="li"><div class="ic">'+icon(/^data:image/.test(f.url)?'fa-image':'fa-file-pdf')+'</div><div class="tx"><b>'+E(f.titre)+'</b><span>'+E(f.date||'')+'</span></div><a class="btn sm ghost" href="'+f.url+'" download="'+E(f.titre)+'" target="_blank" rel="noopener">Ouvrir</a><button class="icon-btn" data-fp-del="'+k+'" aria-label="Retirer">'+icon('fa-trash')+'</button></div>').join('')+'</div>':'')+
   '<label class="btn ghost" style="cursor:pointer;text-align:center">'+icon('fa-paperclip')+'Joindre une fiche<input type="file" id="fpUp" accept="application/pdf,image/*" multiple hidden></label></div>'}
if(typeof cResume==='function'){const _d=cResume;cResume=function(c){const h=_d.apply(this,arguments);if(S.ctab!=='dossier'||S.dsEdit)return h;return h+fichesCarte(c)}}
const cli=()=>(S.clients||[]).find(x=>x.id===S.openClient);
const lire=f=>new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(f)});
document.addEventListener('change',async e=>{const i=e.target.closest&&e.target.closest('#fpUp');if(!i||!i.files.length)return;const c=cli();if(!c)return;
  c.fichesPerso=c.fichesPerso||[];let n=0;
  for(const f of [...i.files]){if(!/^(application\/pdf|image\/)/.test(f.type)){toast('PDF ou image seulement');continue}
    let url;if(/^image\//.test(f.type)){try{url=await shrinkTo(f,1600)}catch(x){url=await lire(f)}}else{if(f.size>MAX){toast(f.name+' : trop gros (3 Mo max)');continue}url=await lire(f)}
    c.fichesPerso.push({titre:f.name.replace(/\.[a-z0-9]+$/i,''),url,date:new Date().toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'})});n++}
  i.value='';if(!n)return;try{await saveClient(c.id);toast(n>1?n+' fiches jointes':'Fiche jointe')}catch(x){toast('Pas enregistré')}render()});
document.addEventListener('click',async e=>{const b=e.target.closest&&e.target.closest('[data-fp-del]');if(!b)return;e.stopPropagation();const c=cli();if(!c)return;
  if(b.dataset.c!=='1'){b.dataset.c='1';b.innerHTML=icon('fa-check');toast('Touchez encore pour retirer');return}
  c.fichesPerso.splice(+b.dataset.fpDel,1);await saveClient(c.id);render()},true);
})();
