/* Sérénaissance — accueil après la naissance, inspiré des grandes applis de bébé, dans le style Sérénaissance :
   la date et « Aujourd'hui » avec les photos de bébé et de maman en ronds, une grande carte avec la photo de bébé,
   « Bonjour, Nancy et Nolan » et son âge en gros (mois et semaines), puis les activités du jour à noter. */
(function(){
if(window.ESPACE!=='parent'||typeof pAccueil!=='function')return;
const ab0=t=>{const d=new Date(t);d.setHours(0,0,0,0);return +d};
function abAge(b){const n=new Date(),B=new Date(b);let m=(n.getFullYear()-B.getFullYear())*12+n.getMonth()-B.getMonth();if(n.getDate()<B.getDate())m--;m=Math.max(0,m);
  const rep=new Date(B);rep.setMonth(B.getMonth()+m);const jr=Math.max(0,Math.floor((ab0(n)-ab0(rep))/864e5)),jours=Math.max(0,Math.floor((ab0(n)-ab0(B))/864e5));
  if(m>=24){const a=Math.floor(m/12),r=m%12;return [a,'Ans',r,'Mois']}
  return m===0?[jours,jours>1?'Jours':'Jour',Math.floor(jours/7),Math.floor(jours/7)>1?'Semaines':'Semaine']:[m,'Mois',Math.floor(jr/7),Math.floor(jr/7)>1?'Semaines':'Semaine']}
const il=t=>{if(!t)return null;const m=Math.round((Date.now()-t)/60000);return m<60?'il y a '+m+' min':m<1440?'il y a '+Math.floor(m/60)+' h '+String(m%60).padStart(2,'0'):'il y a '+Math.floor(m/1440)+' j'};
function abActivites(st){const auj=ab0(Date.now()),L=S.logs||[],A=L.filter(l=>l.t>=auj);
  const der=ty=>L.filter(l=>ty.includes(l.type)).sort((a,b)=>b.t-a.t)[0];
  const rep=der(['sein','biberon']),poi=der(['poids']),som=A.filter(l=>l.type==='sommeil').reduce((s,l)=>s+(+l.sec||0),0);
  const co=A.filter(l=>l.type==='couche');
  let vac=null;try{const v=(window.vacPrevus&&window.vacPrevus())||[];vac=v.filter(x=>+x.d>=auj-14*864e5).sort((a,b)=>a.d-b.d)[0]}catch(e){}
  const R=[['repas','fa-person-breastfeeding','#f3d5c9','Noter un repas',rep?'Tétée ou biberon · dernier '+il(rep.t):'Saisir la tétée ou le biberon'],
    ['couches','fa-droplet','#d9e6d4','Noter une couche',co.length?'Aujourd\'hui : '+co.filter(l=>l.pipi).length+' mouillée(s), '+co.filter(l=>l.selle).length+' selle(s)':'Pipi, selle, couleur'],
    ['sommeil','fa-moon','#dbe2f0','Noter le sommeil',som?'Aujourd\'hui : '+Math.floor(som/3600)+' h '+String(Math.round(som%3600/60)).padStart(2,'0'):'Siestes et nuits'],
    ['croissance','fa-weight-scale','#f2e3c4','Suivre la croissance',poi?'Dernière pesée : '+cm((poi.g/1000).toFixed(2))+' kg':'Noter une pesée']];
  if(vac)R.push(['vaccins','fa-syringe','#ecdcea','Vaccins',vac.txt.replace(/^Vaccins de /,'')+' · '+fmtS(vac.d)]);
  return '<div class="card ab-act"><span class="eyebrow">Programme</span><h2>Activités</h2><div class="ab-liste">'+R.map(r=>'<button class="ab-row" data-ab="'+r[0]+'"><span class="ab-ic" data-dk="1" data-dt="1" style="background:'+r[2]+'">'+icon(r[1])+'</span><span class="ab-tx"><b>'+r[3]+'</b><small>'+esc(r[4])+'</small></span>'+icon('fa-chevron-right')+'</button>').join('')+'</div></div>'}
function abHaut(st){const p=S.parent,n=(p.naissance||{}),nom=(n.prenomBebe||'').trim(),mom=(p.prenom&&p.prenom!=='Exemple'?p.prenom:'').trim(),A=abAge(st.birth);
  const auj=new Date().toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long'});
  const rond=(src,txt,cls)=>src?'<img class="ab-av '+cls+'" src="'+esc(src)+'" alt="">':'<span class="ab-av '+cls+'">'+esc((txt||'?')[0].toUpperCase())+'</span>';
  const ph=p.photoBebe;
  return '<div class="ab-top"><div class="ab-tete"><div><span class="ab-date">'+auj+'</span><h1>Aujourd\'hui</h1></div><div class="ab-avs">'+rond(ph,nom||'B','b')+rond(p.photo,mom||'M','m')+'</div></div>'+
    '<div class="ab-hero'+(ph?' photo':'')+'">'+(ph?'<img src="'+esc(ph)+'" alt="Photo de '+esc(nom||'bébé')+'">':'<label class="ab-ajout" for="abPhoto">'+icon('fa-camera')+'<span>Ajouter une photo de '+esc(nom||'bébé')+'</span></label>')+
    '<input type="file" id="abPhoto" accept="image/*" hidden>'+
    '<div class="ab-salut"><span>Bonjour,</span><b>'+esc([mom,nom].filter(Boolean).join(' et ')||'vous deux')+'</b></div>'+
    '<div class="ab-age g"><b>'+A[0]+'</b><span>'+A[1]+'</span></div><div class="ab-age d"><b>'+A[2]+'</b><span>'+A[3]+'</span></div>'+
    (ph?'<label class="ab-chg" for="abPhoto" aria-label="Changer la photo">'+icon('fa-camera')+'</label>':'')+'</div>'+abActivites(st)+'</div>'}
/* plus de dessin de bébé : la vraie photo est dans la grande carte en haut */
if(typeof svgNouveauNe==='function')svgNouveauNe=function(){return ''};
const _pA=pAccueil;
pAccueil=function(){const h=_pA.apply(this,arguments);try{const st=stage();if(st.k!=='pp')return h;return abHaut(st)+h}catch(e){return h}};
/* l'en-tête de bébé reste tout en haut, au-dessus du mot du jour et du reste */
const _rAB=render;render=function(){const x=_rAB.apply(this,arguments);try{if(S.role==='parent'&&!S.vue&&(S.tab||'accueil')==='accueil'){const app=document.getElementById('app'),t=app&&app.querySelector(':scope>.ab-top');
  if(t){if(app.firstElementChild!==t)app.prepend(t);const d24=[...app.querySelectorAll(':scope>.card')].find(c=>/^dernières 24 heures/i.test(((c.querySelector('.eyebrow')||{}).textContent||'').trim()));const act=t.querySelector('.ab-act');if(d24&&act)t.insertBefore(d24,act);const sh=app.querySelector(':scope>.sh');if(sh)sh.remove();const mot=app.querySelector(':scope>.card.mot');if(mot)app.insertBefore(mot,t)
    /* pas de doublons : ce qui se trouve déjà dans le Journal bébé, Suivi ou Ma doula n'est pas répété ici */
    app.querySelectorAll(':scope>.quick').forEach(x=>x.remove());
    [...app.querySelectorAll(':scope>.card')].forEach(c=>{const e=((c.querySelector('.eyebrow')||{}).textContent||'').trim();
      if(/^\d+\s*jours?\s*de vie/i.test(c.textContent.trim())||/jours? de vie$|^comment va le moral|^petites lectures|^ma doula$/i.test(e)||(c.classList.contains('tint')&&/ma doula/i.test(e)))c.remove()})}}}catch(e){}return x};
document.addEventListener('click',e=>{const b=e.target.closest('[data-ab]');if(!b)return;e.stopPropagation();const v=b.dataset.ab;
  if(v==='dev'&&window.dvOuvrir){dvOuvrir();return}
  /* raccourcis : la fiche s'ouvre ici, sans changer de page (comme en grossesse et en fertilité) */
  const F=(typeof FORMS==='object'&&FORMS)||{};
  if(v==='couches'&&F.couche){F.couche();return}
  if(v==='sommeil'&&F.sommeil){F.sommeil();return}
  if(v==='croissance'&&F.poids){F.poids();return}
  if(v==='repas'&&typeof sheet==='function'){sheet('Noter un repas','<div class="stack" style="gap:10px"><button class="btn" data-act="feed">'+icon('fa-person-breastfeeding')+'Tétée</button><button class="btn ghost" data-act="biberon">'+icon('fa-bottle-droplet')+'Biberon</button><button class="btn ghost" data-act="tirage">'+icon('fa-pump-medical')+'Tirage de lait</button></div>');return}
  S.vue=null;S.sub='';
  if(v==='vaccins'){S.tab='suivi'}else{S.tab='journal';S.jbTab=v}scrollTo(0,0);render()},true);
document.addEventListener('change',async e=>{if(!e.target||e.target.id!=='abPhoto')return;const f=e.target.files&&e.target.files[0];if(!f)return;
  try{S.parent.photoBebe=await shrinkTo(f,900);await saveParent();render();toast('Photo ajoutée')}catch(x){toast('Photo non ajoutée')}});
(function(){const st=document.createElement('style');st.textContent=
  '.ab-top{margin-bottom:14px}.ab-tete{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin:4px 2px 12px}'+
  '.ab-date{display:block;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}.ab-tete h1{font-size:2rem;margin:0}'+
  '.ab-avs{display:flex}.ab-av{width:54px;height:54px;border-radius:50%;object-fit:cover;border:3px solid var(--card);box-shadow:0 4px 12px rgba(70,45,30,.15);display:grid;place-items:center;font-weight:700;color:var(--accent);background:var(--soft)}.ab-av.m{margin-left:-14px}'+
  '.ab-hero{position:relative;aspect-ratio:1/1.05;border-radius:26px;overflow:hidden;background:linear-gradient(160deg,#f6e3d8,#ecd2c4 55%,#e4c2b3);box-shadow:0 10px 28px rgba(70,45,30,.12);color:#fff}'+
  '.ab-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.ab-hero.photo::after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.28),transparent 30%,transparent 62%,rgba(0,0,0,.38))}'+
  '.ab-ajout{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--accent);font-weight:600;cursor:pointer}.ab-ajout i,.ab-ajout svg{font-size:2rem;width:72px;height:72px;display:grid!important;place-items:center;border-radius:50%;background:rgba(255,255,255,.7)}'+
  '.ab-salut{position:absolute;left:18px;top:16px;z-index:2;display:flex;flex-direction:column;text-shadow:0 1px 8px rgba(0,0,0,.25)}.ab-salut span{font-size:.95rem;opacity:.9}.ab-salut b{font-family:var(--f-display);font-size:1.6rem;line-height:1.15}'+
  '.ab-hero:not(.photo) .ab-salut,.ab-hero:not(.photo) .ab-age{color:#5b3a2e;text-shadow:none}'+
  '.ab-age{position:absolute;bottom:14px;z-index:2;display:flex;flex-direction:column;line-height:1;text-shadow:0 1px 10px rgba(0,0,0,.3)}.ab-age b{font-size:3.4rem;font-weight:700;font-family:var(--f-body)}.ab-age span{font-size:.95rem;margin-top:4px}'+
  '.ab-age.g{left:18px}.ab-age.d{right:18px;align-items:flex-end}'+
  '.ab-chg{position:absolute;right:12px;top:12px;z-index:3;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.75);color:var(--accent);display:grid;place-items:center;cursor:pointer}'+
  '.ab-top>.card{margin-top:14px}.ab-act{margin-top:14px}.ab-act h2{margin:-6px 0 2px}.ab-liste{display:flex;flex-direction:column}.ab-row{display:flex;align-items:center;gap:12px;width:100%;padding:12px 0;border:0;border-bottom:1px solid color-mix(in srgb,var(--line) 70%,transparent);background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.ab-row:last-child{border-bottom:0}'+
  '.ab-ic{width:42px;height:42px;flex:none;border-radius:50%;display:grid;place-items:center;color:#7a4a3a;font-size:1rem}.ab-tx{flex:1;min-width:0;display:flex;flex-direction:column}.ab-tx b{font-size:.95rem}.ab-tx small{color:var(--muted);font-size:.8rem}.ab-row>i:last-child,.ab-row>svg:last-child{color:var(--muted);font-size:.8rem}'+
  '[data-theme=dark] .ab-hero:not(.photo){background:linear-gradient(160deg,#4a332b,#36261f)!important}[data-theme=dark] .ab-hero:not(.photo) .ab-salut,[data-theme=dark] .ab-hero:not(.photo) .ab-age,[data-theme=dark] .ab-ajout{color:#f2d3c4!important}[data-theme=dark] .ab-ajout svg,[data-theme=dark] .ab-ajout i{background:rgba(255,255,255,.12)!important}'+
  '[data-theme=dark] .ab-ic{background:rgba(232,150,125,.2)!important;color:#f4cdbd!important}';
  document.head.appendChild(st)})();
})();
