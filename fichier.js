/* Sérénaissance — la doula téléverse ses propres documents (PDF ou image) pour une famille. Ils s'affichent dans l'onglet Documents de la maman. */
const FICHIER_MAX=3*1024*1024;
const estFichier=d=>String(d&&d.contenu||'').startsWith('@fichier ');
function fichierInfo(d){const s=String(d.contenu).slice(9),i=s.indexOf('|');return {nom:s.slice(0,i),url:s.slice(i+1)}}
const _cdF=cDocs;cDocs=function(c){return _cdF(c)+'<div class="card"><span class="eyebrow acc">Mon propre document</span><p class="small muted">Téléversez un document à vous (PDF ou image, 3 Mo max) : votre contrat, une fiche, un aide-mémoire… La famille le voit dans ses Documents.</p><label class="btn ghost" style="cursor:pointer;text-align:center">'+icon('fa-upload')+'Téléverser un document<input type="file" id="fichUp" data-fam="'+c.id+'" accept="application/pdf,image/*" hidden></label><label class="check"><input type="checkbox" id="fichPart"><span>Ce document est pour le partenaire</span></label></div>'};
const _dvFi=docVue;docVue=function(d,doula){if(!estFichier(d))return _dvFi(d,doula);const f=fichierInfo(d);
  const vue=/^data:image\//.test(f.url)?'<img src="'+f.url+'" alt="" style="max-width:100%;border-radius:8px">':'<iframe src="'+f.url+'" style="width:100%;height:60vh;border:1px solid var(--line);border-radius:8px" title="'+esc(f.nom)+'"></iframe>';
  return '<div class="stack">'+vue+'<a class="btn ghost" style="text-align:center;text-decoration:none" href="'+f.url+'" download="'+esc(f.nom)+'">'+icon('fa-download')+'Télécharger '+esc(f.nom)+'</a></div>'};
const _odFi=ouvrirDoc;ouvrirDoc=async function(id){await _odFi(id);try{const d=(S.role==='parent'?DOCS:(CDOCS[S.openClient]||[])).find(x=>x.id===id);if(d&&d.titre!==undefined){const {data}=await sb.from('fam_documents').select('contenu').eq('id',id).maybeSingle();if(data&&estFichier(data))document.querySelectorAll('.sheet [data-act="pdf"]').forEach(b=>b.remove())}}catch(e){}};
document.addEventListener('change',async e=>{const i=e.target.closest('#fichUp');if(!i||!i.files[0])return;const f=i.files[0];
  if(!/^(application\/pdf|image\/)/.test(f.type)){toast('PDF ou image seulement');i.value='';return}
  if(f.type==='application/pdf'&&f.size>FICHIER_MAX){toast('PDF trop gros (3 Mo max)');i.value='';return}
  let url=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(f)});
  /* les images sont réduites (1600 px, JPEG) pour garder l'appli rapide */
  if(f.type.startsWith('image/')&&f.type!=='image/svg+xml'){try{url=await new Promise((ok,ko)=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1600/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.82))};im.onerror=ko;im.src=url})}catch(x){}}
  if(url.length>FICHIER_MAX*1.4){toast('Fichier trop gros');i.value='';return}
  const titre=(($('#fichPart')||{}).checked?'Pour le partenaire · ':'')+f.name.replace(/\.[^.]+$/,'').slice(0,80);
  const {error}=await sb.from('fam_documents').insert({famille_id:i.dataset.fam,type:'autre',titre,contenu:'@fichier '+f.name+'|'+url,champs:[],sig_parent_requise:false,sig_doula_requise:false,statut:'signe'});
  i.value='';if(error){toast(error.message);return}
  await chargerClientDetail(i.dataset.fam);render();notifierFamille(i.dataset.fam,'document',titre);toast('Document ajouté : la famille le voit dans ses Documents')});
const _dlFi=docLigne;docLigne=function(d,doula){const h=_dlFi(d,doula);return estFichier(d)?h.replace('>Signé<','>Document<'):h};
