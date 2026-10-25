/* Sérénaissance — « Ma doula » (famille) : la fiche de la doula en haut (photo, nom, entreprise, appeler, écrire, courriel),
   puis les sections en grands carrés (Messages, Rendez-vous, Documents, Mes questions, Forfaits et paiements).
   « Messages » ouvre la bulle de chat; les autres carrés ouvrent leur page, avec un retour vers Ma doula. */
(function(){
if(window.ESPACE!=='parent'||typeof pMaDoula!=='function')return;
const SEGS=['rdv','docs','questions','forfaits'];
const tel=x=>String(x||'').replace(/[^0-9+]/g,'');
function mdTete(compact){const D=DOULA||{},nm=doulaNomP(),ph=D.photo;
  const av=ph?'<img class="md-av" src="'+esc(ph)+'" alt="">':'<span class="md-av">'+esc((nm||'D')[0].toUpperCase())+'</span>';
  if(compact)return '<div class="md-tete compact">'+av+'<div class="md-id"><span class="eyebrow acc">Ma doula</span><b>'+esc(nm)+'</b>'+(D.entreprise?'<small>'+esc(D.entreprise)+'</small>':'')+'</div></div>';
  return '<div class="md-tete">'+av+'<div class="md-id"><span class="eyebrow acc">Ma doula</span><h1>'+esc(nm)+'</h1>'+(D.entreprise?'<small>'+esc(D.entreprise)+'</small>':'')+'</div>'+
    '<div class="md-actions">'+(D.telephone?'<a class="md-act" href="tel:'+esc(tel(D.telephone))+'">'+icon('fa-phone')+'<span>Appeler</span></a>':'')+
    '<button class="md-act" data-act="chatOuvrir">'+icon('fa-comment-dots')+'<span>Écrire</span></button>'+
    (D.courriel?'<a class="md-act" href="mailto:'+esc(D.courriel)+'">'+icon('fa-envelope')+'<span>Courriel</span></a>':'')+'</div>'+
    '<div class="md-infos">'+(D.telephone?'<div>'+icon('fa-phone')+'<a class="num" href="tel:'+esc(tel(D.telephone))+'">'+esc(D.telephone)+'</a></div>':'')+
    (D.courriel?'<div>'+icon('fa-envelope')+'<a href="mailto:'+esc(D.courriel)+'">'+esc(D.courriel)+'</a></div>':'')+
    (D.remplacante_nom?'<div>'+icon('fa-user-group')+'<span>Remplaçante : '+esc(D.remplacante_nom)+(D.remplacante_tel?' · <a class="num" href="tel:'+esc(tel(D.remplacante_tel))+'">'+esc(D.remplacante_tel)+'</a>':'')+'</span></div>':'')+'</div>'+
    '<p class="xs muted md-urg">Le travail commence ou les eaux ont crevé : <b>appelez</b> votre doula (pas seulement un texto). Urgence : 911 ou votre hôpital d\'abord (France : 15 ou 112).</p></div>'}
function mdGrille(){const nl=MSGS.filter(m=>m.de_doula&&!m.lu).length,ar=DOCS.filter(d=>d.statut==='a_remplir').length;
  const fut=RDV.filter(r=>r.statut!=='annule'&&new Date(r.debut)>Date.now()-3600e3).sort((a,b)=>new Date(a.debut)-new Date(b.debut)),prop=fut.filter(r=>r.statut==='propose').length;
  const Q=(S.parent.questions||[]).filter(q=>!q.fait).length;
  let pr='';try{pr=fut[0]?new Date(fut[0].debut).toLocaleDateString('fr-CA',{weekday:'short',day:'numeric',month:'short'}):''}catch(e){}
  const T=[['messages','fa-comments','#f3d5c9','Messages',nl?nl+' non lu'+(nl>1?'s':''):'Écrire à ma doula',nl],
    ['rdv','fa-calendar-check','#dbe2f0','Rendez-vous',prop?prop+' date'+(prop>1?'s':'')+' à confirmer':pr?'Prochain : '+pr:'Demander un rendez-vous',prop],
    ['docs','fa-file-signature','#d9e6d4','Documents',ar?ar+' à remplir':DOCS.length?DOCS.length+' document'+(DOCS.length>1?'s':''):'Contrat et formulaires',ar],
    ['questions','fa-circle-question','#f2e3c4','Mes questions',Q?Q+' à poser':'Pour ma doula ou mon médecin',0],
    ['forfaits','fa-receipt','#ecdcea','Forfait et paiements',FAM&&FAM.forfait?FAM.forfait:'Voir les forfaits',0]];
  return '<div class="md-grille">'+T.map(t=>'<button class="md-carre" '+(t[0]==='messages'?'data-act="chatOuvrir"':'data-act="seg" data-v="'+t[0]+'"')+'><span class="md-ic" data-dk="1" data-dt="1" style="background:'+t[2]+'">'+icon(t[1])+'</span>'+(t[5]?'<span class="md-badge">'+t[5]+'</span>':'')+'<b>'+t[3]+'</b><small>'+esc(t[4])+'</small></button>').join('')+'</div>'}
const _m=pMaDoula;
pMaDoula=function(){if(typeof FAM==='undefined'||!FAM||!FAM.doula_id)return _m.apply(this,arguments);
  if(S.seg==='messages'){S.seg='hub';setTimeout(()=>{try{if(window.CB&&CB.ouvert)return;chatBulleBasculer()}catch(e){}},60)}
  if(!SEGS.includes(S.seg)){S.seg='hub';return mdTete(false)+mdGrille()}
  const h=_m.apply(this,arguments),t=document.createElement('template');t.innerHTML=h;
  [...t.content.children].forEach(x=>{if(x.classList.contains('seg')||x.classList.contains('sh'))x.remove()});
  const titre={rdv:'Rendez-vous',docs:'Documents',questions:'Mes questions',forfaits:'Forfait et paiements'}[S.seg];
  return back('seg','hub','Ma doula')+mdTete(true)+'<h2 class="md-titre">'+titre+'</h2>'+[...t.content.childNodes].map(n=>n.outerHTML||n.textContent||'').join('')};
/* la barre du bas ramène toujours aux carrés */
document.addEventListener('click',e=>{const b=e.target.closest('#tabs [data-v="madoula"]');if(b)S.seg='hub'},true);
(function(){const st=document.createElement('style');st.textContent=
  '.md-tete{background:var(--card);border-radius:26px;padding:20px 18px 16px;margin:4px 0 16px;box-shadow:var(--shadow);text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}'+
  '.md-av{width:92px;height:92px;border-radius:50%;object-fit:cover;display:grid;place-items:center;background:var(--soft);color:var(--accent);font-size:2.2rem;font-weight:700;border:4px solid var(--card);box-shadow:0 6px 18px rgba(70,45,30,.16)}'+
  '.md-id{display:flex;flex-direction:column;align-items:center;gap:2px}.md-id h1{margin:2px 0 0;font-size:1.7rem}.md-id small{color:var(--muted)}'+
  '.md-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:4px}.md-act{display:flex;flex-direction:column;align-items:center;gap:4px;min-width:74px;padding:10px 8px;border:0;border-radius:16px;background:var(--soft);color:var(--accent);font:600 .78rem/1.1 inherit;text-decoration:none;cursor:pointer}.md-act i,.md-act svg{font-size:1.1rem}'+
  '.md-infos{display:flex;flex-direction:column;gap:6px;width:100%;text-align:left;font-size:.88rem;border-top:1px solid var(--line);padding-top:12px;margin-top:2px}.md-infos>div{display:flex;align-items:center;gap:10px}.md-infos i,.md-infos svg{color:var(--accent);width:16px}.md-infos a{color:inherit;word-break:break-all}'+
  '.md-urg{margin:2px 0 0;text-align:left}'+
  '.md-tete.compact{flex-direction:row;text-align:left;padding:12px 14px;gap:12px;border-radius:20px;margin-bottom:12px}.md-tete.compact .md-av{width:48px;height:48px;font-size:1.2rem;border-width:2px}.md-tete.compact .md-id{align-items:flex-start}.md-tete.compact b{font-size:1.05rem}'+
  '.md-titre{margin:4px 2px 12px;font-size:1.4rem}'+
  '.md-grille{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}'+
  '.md-carre{position:relative;aspect-ratio:1;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;gap:3px;padding:14px;border:0;border-radius:22px;background:var(--card);color:var(--ink);box-shadow:var(--shadow);font:inherit;text-align:left;cursor:pointer}'+
  '.md-carre .md-ic{position:absolute;top:14px;left:14px;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;color:#7a4a3a;font-size:1.15rem}'+
  '.md-carre b{font-size:1rem;line-height:1.2}.md-carre small{color:var(--muted);font-size:.78rem;line-height:1.25}'+
  '.md-badge{position:absolute;top:12px;right:12px;min-width:22px;height:22px;padding:0 6px;border-radius:11px;background:var(--accent);color:#fff;font-size:.75rem;font-weight:700;display:grid;place-items:center}'+
  '[data-theme=dark] .md-carre .md-ic{background:rgba(232,150,125,.2)!important;color:#f4cdbd!important}';
  document.head.appendChild(st)})();
})();
