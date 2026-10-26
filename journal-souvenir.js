/* Sérénaissance — « Mon journal souvenir » (espace famille) : un vrai journal de grossesse et de bébé,
   à remplir dans l'appli (textes et une photo par page), puis à imprimer joliment, ou à imprimer vierge pour l'écrire à la main. */
(function(){
if(window.ESPACE!=='parent')return;
const sauver=()=>{try{if(typeof saveParent==='function')saveParent();else save()}catch(e){}};
const PAGES=[
 ['g','histoire','💌','Notre histoire',[['date','Le jour où nous l\'avons appris','date'],['comment','Comment nous l\'avons appris','area'],['reaction','Nos premières réactions','area']]],
 ['g','t1','🌱','Premier trimestre',[['sens','Comment je me sens','area'],['envies','Mes envies (et ce que je ne supporte plus !)','area'],['rappel','Ce que je veux me rappeler','area']]],
 ['g','echo','🩻','Ma première échographie',[['date','Date','date'],['vu','Ce que nous avons vu','area'],['ressenti','Ce que j\'ai ressenti','area']],true],
 ['g','t2','🦋','Deuxième trimestre',[['mvt','Les premiers mouvements (date et sensation)','area'],['ventre','Mon ventre grandit','area'],['prep','Nos préparatifs','area']],true],
 ['g','prenoms','✏️','Les prénoms',[['liste','Les prénoms auxquels nous avons pensé','area'],['choix','Le prénom choisi, et pourquoi','area']]],
 ['g','t3','🌸','Troisième trimestre',[['prep','Comment je me prépare','area'],['espoirs','Mes espoirs et mes peurs','area'],['coin','Le coin de bébé','area']],true],
 ['g','lettre','✉️','Lettre à mon bébé',[['lettre','','grand']]],
 ['g','derniers','🧳','Les derniers jours',[['valise','Dans ma valise','area'],['hate','Ce que j\'ai hâte de vivre','area']]],
 ['b','naissance','👶','Ta naissance',[['quand','Date, heure et lieu','line'],['mesures','Ton poids et ta taille','line'],['presents','Qui était là','line'],['recit','Comment ça s\'est passé','area']],true],
 ['b','semaine1','🍼','Ta première semaine',[['nuits','Nos premières nuits','area'],['visites','Tes premières visites','area'],['rire','Ce qui nous a fait sourire','area']],true],
 ['b','premieres','⭐','Tes premières fois',[['sourire','Premier sourire','line'],['rire','Premier éclat de rire','line'],['bain','Premier bain','line'],['sortie','Première sortie','line'],['dent','Première dent','line'],['assis','Assis tout seul','line'],['pas','Premiers pas','line'],['mot','Premier mot','line']]],
 ['b','mois','📅','Mois par mois',Array.from({length:12},(_,i)=>['m'+(i+1),(i+1)+' mois','line'])],
 ['b','annee','🎂','Lettre pour tes 1 an',[['lettre','','grand']],true]];
const J=()=>{const p=S.parent;if(!p.souvenir||typeof p.souvenir!=='object')p.souvenir={};return p.souvenir};
const rempli=pg=>{const d=J()[pg[1]]||{};return pg[4].some(f=>(d[f[0]]||'').trim())||!!d.photo};
function tuile(){const n=PAGES.filter(rempli).length;return '<button class="tile js-tuile" data-js-ouvrir="1"><span style="font-size:1.6rem">📖</span><span><b>Mon journal souvenir</b><small>'+(n?n+' page'+(n>1?'s':'')+' remplie'+(n>1?'s':'')+' sur '+PAGES.length:'Grossesse et bébé : à remplir ici, puis à imprimer')+'</small></span></button>'}
function page(){const st=(()=>{try{return stage()}catch(e){return {k:'none'}}})();const bebe=st.k==='pp';
  const L=PAGES.filter(p=>bebe?true:p[0]==='g').concat(bebe?[]:PAGES.filter(p=>p[0]==='b'));
  let h='<div class="sh"><button class="btn sm ghost" data-js-retour="1" style="align-self:flex-start;width:auto">'+icon('fa-arrow-left')+'Retour</button><span class="script">Mon journal</span><h1>Mon journal souvenir</h1><p class="sub">Écrivez à votre rythme, ajoutez une photo, puis imprimez-le : un souvenir à garder pour toujours.</p></div>'+
   '<div class="card js-impr"><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn" data-js-print="rempli">'+icon('fa-print')+'Imprimer mon journal</button><button class="btn ghost" data-js-print="vierge">'+icon('fa-file')+'Imprimer un journal vierge</button></div><p class="xs muted" style="margin:8px 0 0">Choisissez « Enregistrer en PDF » dans la fenêtre d\'impression pour le garder sur votre téléphone ou l\'envoyer à imprimer.</p></div>';
  let sect='';L.forEach(pg=>{const s=pg[0]==='g'?'Ma grossesse':'Mon bébé';if(s!==sect){sect=s;h+='<span class="eyebrow acc" style="display:block;margin:18px 4px 6px">'+s+'</span>'}
    const d=J()[pg[1]]||{},ok=rempli(pg);
    h+='<details class="acc js-page"'+(S.jsOuvert===pg[1]?' open':'')+' data-js-pg="'+pg[1]+'"><summary><span style="margin-right:8px">'+pg[2]+'</span>'+pg[3]+(ok?' <span class="pill sage" style="margin-left:6px">✓</span>':'')+'<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body">'+
     pg[4].map(f=>{const v=esc(d[f[0]]||''),id='js_'+pg[1]+'_'+f[0];return f[2]==='area'||f[2]==='grand'?'<label class="f">'+(f[1]||'')+'<textarea id="'+id+'" data-js-f="'+pg[1]+'|'+f[0]+'" style="min-height:'+(f[2]==='grand'?220:90)+'px" placeholder="'+(f[2]==='grand'?'Mon bébé, …':'')+'">'+v+'</textarea></label>':'<label class="f">'+f[1]+'<input '+(f[2]==='date'?'type="date"':'type="text"')+' id="'+id+'" data-js-f="'+pg[1]+'|'+f[0]+'" value="'+v+'"></label>'}).join('')+
     (pg[5]?'<div class="js-photo">'+(d.photo?'<img src="'+d.photo+'" alt="Photo de la page"><button class="btn sm ghost" data-js-photodel="'+pg[1]+'">Retirer la photo</button>':'<label class="btn sm ghost" style="cursor:pointer">'+icon('fa-camera')+'Ajouter une photo<input type="file" accept="image/*" data-js-photo="'+pg[1]+'" hidden></label>')+'</div>':'')+
     '<button class="btn sm" data-js-ok="'+pg[1]+'" style="margin-top:8px">Enregistrer</button></div></details>'});
  return h}
/* impression */
function imprimer(vierge){const p=S.parent,nm=esc((p.naissance||{}).prenomBebe||(p.prenomsGrossesse||[]).filter(Boolean).join(' et ')||'');
  const lignes=n=>Array.from({length:n},()=>'<div class="ln"></div>').join('');
  const corps=PAGES.map(pg=>{const d=J()[pg[1]]||{};
    return '<section><div class="ic">'+pg[2]+'</div><h2>'+pg[3]+'</h2>'+pg[4].map(f=>{const v=vierge?'':(d[f[0]]||'').trim();
      return '<div class="ch">'+(f[1]?'<h3>'+f[1]+'</h3>':'')+(v?'<p>'+esc(f[2]==='date'?new Date(v+'T12:00').toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'}):v).replace(/\n/g,'<br>')+'</p>':lignes(f[2]==='grand'?16:f[2]==='area'?4:1))+'</div>'}).join('')+
      (pg[5]?(d.photo&&!vierge?'<img src="'+d.photo+'">':'<div class="cadre">Ma photo</div>'):'')+'</section>'}).join('');
  const doc='<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Mon journal souvenir</title><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,500&family=Plus+Jakarta+Sans:wght@400;600&display=swap" rel="stylesheet"><style>'+
   '@page{size:letter;margin:16mm}body{font-family:"Plus Jakarta Sans",Arial,sans-serif;color:#3b2a24;margin:0}section{page-break-after:always;padding:6mm 4mm}.couv{text-align:center;padding-top:40mm}.couv h1{font-family:"Playfair Display",Georgia,serif;font-size:40pt;margin:0;color:#a85743}.couv p{font-size:13pt;color:#7a685e}'+
   '.ic{font-size:26pt;text-align:center}h2{font-family:"Playfair Display",Georgia,serif;font-size:24pt;text-align:center;margin:4px 0 18px;color:#a85743}h3{font-size:11pt;color:#7a685e;margin:14px 0 4px;font-weight:600}p{font-size:12pt;line-height:1.6;margin:0}.ln{border-bottom:1px solid #d9c6b8;height:9mm}'+
   'img{display:block;max-width:100%;max-height:110mm;margin:14px auto 0;border-radius:10px}.cadre{border:1.5px dashed #d9c6b8;border-radius:12px;height:80mm;margin-top:14px;display:flex;align-items:center;justify-content:center;color:#b9a395;font-size:11pt}'+
   '</style></head><body><section class="couv"><div style="font-size:48pt">📖</div><h1>Mon journal souvenir</h1><p>'+(nm?'Pour '+nm:'De la grossesse à ta première année')+'</p><p style="margin-top:30mm;font-size:10pt">Sérénaissance</p></section>'+corps+'<script>setTimeout(function(){window.print()},700)<\/script></body></html>';
  const w=window.open('','_blank');if(w){w.document.open();w.document.write(doc);w.document.close()}else{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([doc],{type:'text/html'}));a.download='journal-souvenir.html';a.click()}}
/* branchements */
if(typeof pJournal==='function'){const _pj=pJournal;pJournal=function(){if(S.role==='parent'&&S.sub==='souvenir')return page();const h=_pj.apply(this,arguments);return h}}
const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(S.role!=='parent'||S.vue||S.tab!=='journal'||S.sub)return x;const app=document.getElementById('app');if(app.querySelector('.js-tuile'))return x;let k='none';try{k=stage().k}catch(e){}if(k!=='preg'&&k!=='pp')return x;
  const t=document.createElement('template');t.innerHTML=tuile();const sh=app.querySelector(':scope>.sh, :scope>.jb-tete');let ref=sh;if(ref&&ref.nextElementSibling&&ref.nextElementSibling.matches('.pf-sw'))ref=ref.nextElementSibling;if(ref)ref.after(t.content);else app.prepend(t.content)}catch(e){}return x};
function lireChamps(id){const d=J()[id]=J()[id]||{};document.querySelectorAll('[data-js-f^="'+id+'|"]').forEach(el=>{d[el.dataset.jsF.split('|')[1]]=el.value})}
document.addEventListener('click',async e=>{let b;
  if(e.target.closest('[data-js-ouvrir]')){e.stopPropagation();S.sub='souvenir';render();scrollTo(0,0);return}
  if(e.target.closest('[data-js-retour]')){e.stopPropagation();S.sub='';render();scrollTo(0,0);return}
  if(b=e.target.closest('[data-js-ok]')){e.stopPropagation();const id=b.dataset.jsOk;lireChamps(id);sauver();S.jsOuvert=null;render();toast('Page enregistrée 💗');return}
  if(b=e.target.closest('[data-js-print]')){e.stopPropagation();document.querySelectorAll('.js-page').forEach(d=>lireChamps(d.dataset.jsPg));sauver();imprimer(b.dataset.jsPrint==='vierge');return}
  if(b=e.target.closest('[data-js-photodel]')){e.stopPropagation();const id=b.dataset.jsPhotodel;lireChamps(id);delete J()[id].photo;sauver();S.jsOuvert=id;render();return}
},true);
document.addEventListener('change',async e=>{const i=e.target.closest('[data-js-photo]');if(!i||!i.files||!i.files[0])return;const id=i.dataset.jsPhoto;lireChamps(id);
  try{const img=await new Promise((ok,ko)=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,800/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.78))};im.onerror=ko;im.src=fr.result};fr.onerror=ko;fr.readAsDataURL(i.files[0])});
    J()[id].photo=img;sauver();S.jsOuvert=id;render();toast('Photo ajoutée')}catch(x){toast('Cette photo n\'a pas pu être ajoutée')}},true);
document.addEventListener('toggle',e=>{const d=e.target;if(d.matches&&d.matches('.js-page')&&d.open)S.jsOuvert=d.dataset.jsPg},true);
(function(){const st=document.createElement('style');st.textContent='.js-tuile{display:flex;gap:12px;align-items:center;text-align:left;width:100%;margin:0 0 12px}.js-tuile small{display:block;color:var(--muted);font-size:.8rem}.js-photo{margin-top:8px;display:flex;flex-direction:column;gap:6px;align-items:flex-start}.js-photo img{max-width:100%;border-radius:12px}';document.head.appendChild(st)})();
})();
