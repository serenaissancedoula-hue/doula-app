/* Sérénaissance — ajouter un rendez-vous confirmé à l'agenda du téléphone (Apple ou Android/Google).
   Quand un rendez-vous devient confirmé, la doula et la famille se font proposer une seule fois de l'ajouter.
   Un bouton « Agenda » reste aussi sur chaque rendez-vous confirmé. */
function agFmt(d){return new Date(d).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}
function agInfos(r){const deb=new Date(r.debut),fin=new Date(deb.getTime()+(+r.duree_min||60)*60e3);let titre,details;
  if(S.role==='parent'){const dn=(typeof DOULA!=='undefined'&&DOULA&&DOULA.prenom)?DOULA.prenom:'ma doula';titre=(r.type||'Rendez-vous')+' avec '+dn;details='Rendez-vous avec '+dn+' (Sérénaissance).'}
  else{const c=(S.clients||[]).find(x=>x.id===r.famille_id);const nom=c?cName(c):'une famille';titre=(r.type||'Rendez-vous')+' · '+nom;details='Rendez-vous avec '+nom+' (Sérénaissance).'}
  if(r.note)details+='\n'+r.note;return {deb,fin,titre,details,lieu:r.lieu||''}}
function agIcs(r){const I=agInfos(r),e=s=>String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/[,;]/g,m=>'\\'+m);
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Serenaissance//Rendez-vous//FR','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT','UID:rdv-'+r.id+'@serenaissance',
    'DTSTAMP:'+agFmt(Date.now()),'DTSTART:'+agFmt(I.deb),'DTEND:'+agFmt(I.fin),'SUMMARY:'+e(I.titre),'DESCRIPTION:'+e(I.details),(I.lieu?'LOCATION:'+e(I.lieu):''),
    'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+e(I.titre),'TRIGGER:-PT1H','END:VALARM','END:VEVENT','END:VCALENDAR'].filter(Boolean).join('\r\n')}
function agGoogle(r){const I=agInfos(r);return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(I.titre)+'&dates='+agFmt(I.deb)+'/'+agFmt(I.fin)+'&details='+encodeURIComponent(I.details)+(I.lieu?'&location='+encodeURIComponent(I.lieu):'')}
function agTrouver(id){return ((S.role==='parent'?RDV:CRDV)||[]).find(x=>String(x.id)===String(id))}
function agProposer(r){const I=agInfos(r);
  sheet('Ajouter à votre agenda ?','<p class="small"><b>'+esc(I.titre)+'</b><br>'+quand(r.debut)+(I.lieu?' · '+esc(I.lieu):'')+'</p>'+
    '<p class="small muted">Ajoutez ce rendez-vous à l\'agenda de votre téléphone, avec un rappel 1 heure avant.</p>'+
    '<div class="stack" style="gap:8px"><a class="btn" style="text-align:center;text-decoration:none" href="data:text/calendar;charset=utf-8,'+encodeURIComponent(agIcs(r))+'" target="_blank" rel="noopener" data-ag-fin="1">'+icon('fa-mobile-screen')+'iPhone ou iPad (Calendrier Apple)</a>'+
    '<a class="btn" style="text-align:center;text-decoration:none" href="'+agGoogle(r)+'" target="_blank" rel="noopener" data-ag-fin="1">'+icon('fa-calendar-plus')+'Android (Google Agenda)</a>'+
    '<button class="btn ghost" data-ag-fin="1">Non merci</button></div>')}
/* une seule proposition par rendez-vous et par personne (gardé sur ce téléphone) */
function agCle(){return 'sere-agenda-vu-'+(S.role||'')}
function agVus(){try{return JSON.parse(localStorage.getItem(agCle())||'null')}catch(e){return null}}
function agGarder(L){try{localStorage.setItem(agCle(),JSON.stringify(L.slice(-300)))}catch(e){}}
function agVerifier(){try{if(!S.role||!MOI||window._agSession)return;const R=((S.role==='parent'?RDV:CRDV)||[]).filter(r=>r.statut==='confirme'&&new Date(r.debut)>Date.now());
  let vus=agVus();if(vus===null){agGarder(R.map(r=>String(r.id)));return} // première fois : on ne propose pas les anciens rendez-vous
  const l=document.getElementById('layer');if(l&&l.innerHTML)return;
  const r=R.find(x=>!vus.includes(String(x.id)));if(!r)return;/* une seule fenêtre : tous les rendez-vous confirmés sont marqués vus (le bouton Agenda reste sur chacun) */R.forEach(x=>{if(!vus.includes(String(x.id)))vus.push(String(x.id))});agGarder(vus);window._agSession=1;agProposer(r)}catch(e){}}
let _agT=null;const _rAG=render;render=function(){const x=_rAG.apply(this,arguments);clearTimeout(_agT);_agT=setTimeout(agVerifier,600);return x};
document.addEventListener('click',e=>{const f=e.target.closest('[data-ag-fin]');if(f){setTimeout(()=>{try{close()}catch(x){}},f.tagName==='A'?400:0);if(f.tagName!=='A')e.preventDefault();return}
  const b=e.target.closest('[data-ag]');if(!b)return;e.stopPropagation();const r=agTrouver(b.dataset.ag);if(r)agProposer(r)},true);
/* bouton « Agenda » sur les rendez-vous confirmés */
if(typeof cRdvs==='function'){const _crAG=cRdvs;cRdvs=function(c){return _crAG(c).replace(/<button class="btn sm ghost" data-act="rdvModifier" data-id="(\d+)">Changer l'heure<\/button>/g,(m,id)=>{const r=agTrouver(id);return (r&&r.statut==='confirme'?'<button class="btn sm ghost" data-ag="'+id+'">'+icon('fa-calendar-plus')+'Agenda</button>':'')+m})}}

/* parcours de la famille (doula) : petit « x » pour effacer une date mise par erreur */
document.addEventListener('click',e=>{const b=e.target.closest('[data-pclr]');if(!b)return;e.stopPropagation();e.preventDefault();const i=b.parentElement.querySelector('input[type=date]');if(!i)return;i.value='';i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}));toast('Date effacée')},true);
/* les sections dépliables restent ouvertes quand on coche une case (le rendu ne les referme plus) */
(function(){const cle=d=>{const s=d.querySelector('summary');return s?s.textContent.replace(/[\d\/()]+/g,'').replace(/\s+/g,' ').trim():''};
  const page=()=>{try{return JSON.stringify([S.role,S.vue,S.tab,S.sub,S.seg,S.jbTab,S.dtab,S.dsub,S.openClient,S.ctab,S.devSel,S.devEnfant,(S.parent||{}).profil])}catch(e){return ''}};
  const _rD=render;render=function(){let ouverts=[];try{ouverts=[...document.querySelectorAll('#app details[open]')].map(cle).filter(Boolean)}catch(e){}
    const y=window.scrollY,k0=page();const x=_rD.apply(this,arguments);
    /* seulement sur la même page : quand on change de page, on arrive en haut */
    try{if(ouverts.length&&page()===k0&&!(window.__navRecent&&window.__navRecent())){document.querySelectorAll('#app details').forEach(d=>{if(!d.open&&ouverts.includes(cle(d)))d.open=true});window.scrollTo(0,y)}}catch(e){}return x}})();
