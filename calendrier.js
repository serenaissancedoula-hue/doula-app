/* Sérénaissance — calendrier mensuel en haut (bouton à côté de la cloche) : rendez-vous, dates prévues, périodes de garde, naissances. */
(function(){
const g=document.getElementById('gear');if(!g)return;
const b=document.createElement('button');b.className='gear';b.id='calBtn';b.hidden=true;b.setAttribute('data-act','calOuvrir');b.setAttribute('aria-label','Calendrier');b.innerHTML='<i class="fa-solid fa-calendar-days"></i>';b.style.cssText='margin-left:auto;margin-right:8px';
g.parentNode.insertBefore(b,g);g.style.marginLeft='0';
const MOIS=window.LANG==='en'?['January','February','March','April','May','June','July','August','September','October','November','December']:['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],JRS=window.LANG==='en'?['M','T','W','T','F','S','S']:['L','M','M','J','V','S','D'];
let cur=new Date(),sel=new Date();cur.setDate(1);
const cle=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const hh=d=>d.toLocaleTimeString('fr-CA',{hour:'2-digit',minute:'2-digit'});
function evenements(){const E={};const add=(d,e)=>{if(!d||isNaN(d))return;(E[cle(d)]=E[cle(d)]||[]).push(e)};
  try{if(S.role==='parent'){(RDV||[]).forEach(r=>{const d=new Date(r.debut);add(d,{t:'rdv',txt:(r.statut==='demande'?'Demande · ':'')+(r.type||'Rendez-vous'),h:hh(d)})});
      ((S.parent&&S.parent.rdvsMed)||[]).forEach(r=>{const d=parseD(r.date);add(d,{t:'rdv',txt:(r.type||'Rendez-vous médical')+(r.pro?' · '+r.pro:''),h:r.heure||'',mid:r.id})});
      (window.vacPrevus?window.vacPrevus():[]).forEach(v=>add(v.d,{t:'rdv',txt:v.txt,h:''}));const dp=(()=>{try{return preg(S.parent).dpa}catch(e){return null}})();if(dp)add(dp,{t:'dpa',txt:'Date prévue de l\'accouchement'});
      const nb=parseD(S.parent&&S.parent.naissance&&S.parent.naissance.date);if(nb)add(nb,{t:'nais',txt:'Naissance'})}
    else{const nom=id=>{const c=(S.clients||[]).find(x=>x.id===id);return c?cName(c):'Famille'};
      (CRDV||[]).forEach(r=>{const d=new Date(r.debut);add(d,{t:'rdv',txt:(r.statut==='demande'?'Demande · ':'')+(r.type||'Rendez-vous')+' · '+nom(r.famille_id),h:hh(d),fam:r.famille_id})});
      (S.clients||[]).forEach(c=>{const dp=parseD(c.dpa),nb=parseD(c.naiss);
        if(dp&&!nb){add(dp,{t:'dpa',txt:'Date prévue · '+cName(c),fam:c.id});for(let i=-14;i<=14;i++)if(i)add(addD(dp,i),{t:'garde',txt:'En garde · '+cName(c),fam:c.id,sec:1})}
        if(nb)add(nb,{t:'nais',txt:'Naissance · '+cName(c),fam:c.id});
        (c.rdv||[]).forEach(r=>{const d=parseD(r.prochaine);if(d)add(d,{t:'rdv',txt:'Rencontre prévue · '+cName(c),fam:c.id})});((c.parent_data||{}).rdvsMed||[]).forEach(r=>{const d=parseD(r.date);if(d)add(d,{t:'rdv',txt:(r.type||'Rendez-vous médical')+' · '+cName(c),h:r.heure||'',fam:c.id})})})}}catch(e){}
  return E}
function ouvrir(){fermer();const o=document.createElement('div');o.id='calOv';o.style.cssText='position:fixed;inset:0;z-index:80;background:var(--bg,#faf5ef);overflow:auto;padding:calc(env(safe-area-inset-top,0px) + 12px) 16px calc(env(safe-area-inset-bottom,0px) + 20px)';document.body.appendChild(o);dessiner()}
function fermer(){document.getElementById('calOv')?.remove()}
function dessiner(){const o=document.getElementById('calOv');if(o)o.innerHTML=contenu(false);const i=document.getElementById('calInline');if(i)i.innerHTML=contenu(true)}
function contenu(inline){const E=evenements(),y=cur.getFullYear(),m=cur.getMonth();
  const premier=(new Date(y,m,1).getDay()+6)%7,nb=new Date(y,m+1,0).getDate(),auj=cle(new Date());
  let cases='';for(let i=0;i<premier;i++)cases+='<div></div>';
  for(let d=1;d<=nb;d++){const dt=new Date(y,m,d),k=cle(dt),L=E[k]||[],est=k===cle(sel);
    const pts=['rdv','dpa','nais'].filter(t=>L.some(e=>e.t===t)).map(t=>'<i style="width:6px;height:6px;border-radius:50%;background:'+(t==='rdv'?'var(--accent)':t==='dpa'?'var(--sage-dk,#5a7a52)':'var(--warn,#b8860b)')+'"></i>').join('');
    const garde=L.some(e=>e.t==='garde'),isDpa=L.some(e=>e.t==='dpa'&&S.role==='parent'),isNais=L.some(e=>e.t==='nais'&&S.role==='parent');
    cases+='<button data-act="calJour" data-k="'+k+'" style="border:'+(k===auj?'2px solid var(--accent)':'1px solid transparent')+';background:'+(isDpa?'var(--sage-dk,#5a7a52)':isNais?'var(--warn,#b8860b)':est?'var(--soft)':garde?'var(--sage-soft,#eef3ec)':'var(--card,#fff)')+';border-radius:12px;min-height:48px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:'+(isDpa||isNais?'#fff':'inherit')+';font:inherit;cursor:pointer"><span style="font-weight:'+(est||isDpa?800:500)+'">'+d+'</span>'+(isDpa?'<span style="font-size:.6rem;line-height:1">👶 prévue</span>':'')+'<span style="display:flex;gap:3px;min-height:6px">'+pts+'</span></button>'}
  const jour=(E[cle(sel)]||[]).filter(e=>!e.sec||true).sort((a,b)=>(a.h||'').localeCompare(b.h||''));
  const jl=sel.toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long'});
  let dpaB='';if(S.role==='parent'){try{const g=preg(S.parent);if(g&&g.dpa&&!parseD(S.parent.naissance.date)){const n=Math.ceil((+g.dpa-+new Date())/864e5);dpaB='<div class="banner sage" style="margin-bottom:10px">'+icon('fa-baby')+'<div><b>Date prévue d\'accouchement : '+g.dpa.toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'</b><br><span class="small">'+(n>0?'Dans '+n+' jour'+(n>1?'s':''):n===0?'C\'est aujourd\'hui !':'Dépassée de '+(-n)+' jour'+(n<-1?'s':''))+' · la plupart des bébés naissent entre 37 et 42 semaines.</span></div></div>'}}catch(e){}}
  return '<div style="max-width:520px;margin:0 auto">'+dpaB+'<div class="row between" style="margin-bottom:10px"><button class="btn sm ghost" data-act="calMois" data-v="-1" aria-label="Mois précédent">'+icon('fa-chevron-left')+'</button><h2 style="margin:0;text-transform:capitalize">'+MOIS[m]+' '+y+'</h2><button class="btn sm ghost" data-act="calMois" data-v="1" aria-label="Mois suivant">'+icon('fa-chevron-right')+'</button></div>'+
   '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center"><div class="xs muted">'+JRS.join('</div><div class="xs muted">')+'</div>'+cases+'</div>'+
   '<div class="row" style="gap:12px;flex-wrap:wrap;margin:12px 0" ><span class="xs muted"><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--accent)"></i> rendez-vous</span><span class="xs muted"><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--sage-dk,#5a7a52)"></i> date prévue</span><span class="xs muted"><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--warn,#b8860b)"></i> naissance</span>'+(S.role!=='parent'?'<span class="xs muted"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--sage-soft,#eef3ec)"></i> en garde</span>':'')+'</div>'+
   '<div class="card"><span class="eyebrow acc" style="text-transform:capitalize">'+jl+'</span>'+(jour.length?jour.map(e=>'<div class="li"'+(e.fam?' data-act="calFam" data-id="'+e.fam+'" style="cursor:pointer"':'')+'><div class="tx"><b>'+esc(e.txt)+'</b>'+(e.h?'<span>'+e.h+'</span>':'')+'</div>'+(e.mid&&S.role==='parent'?'<button class="icon-btn" data-act="rmDel" data-id="'+e.mid+'" aria-label="Retirer">'+icon('fa-trash')+'</button>':'')+'</div>').join(''):'<p class="small muted">Rien de prévu ce jour-là.</p>')+(S.role==='parent'?'<button class="btn" style="margin-top:10px" data-act="rmNew" data-k="'+cle(sel)+'">'+icon('fa-plus')+'Inscrire un rendez-vous ce jour-là</button>':'')+'</div>'+
   '<div class="row" style="gap:8px;margin-top:12px"><button class="btn sm ghost" data-act="calAuj">Aujourd\'hui</button>'+(inline?'':'<button class="btn sm" data-act="calFermer" style="margin-left:auto">Fermer</button>')+'</div></div>'}
document.addEventListener('click',e=>{const x=e.target.closest('[data-act]');if(!x)return;const a=x.dataset.act;
  if(a==='rmNew'&&x.closest('#calOv'))fermer();
  if(a==='calOuvrir'){e.stopPropagation();sel=new Date();cur=new Date();cur.setDate(1);ouvrir()}
  else if(a==='calFermer')fermer();
  else if(a==='calMois'){cur=new Date(cur.getFullYear(),cur.getMonth()+(+x.dataset.v),1);dessiner()}
  else if(a==='calAuj'){sel=new Date();cur=new Date();cur.setDate(1);dessiner()}
  else if(a==='calJour'){const [y,m,d]=x.dataset.k.split('-').map(Number);sel=new Date(y,m-1,d);dessiner()}
  else if(a==='calFam'){fermer();S.vue=null;S.dtab='clientes';S.dsub='';S.openClient=x.dataset.id;S.ctab='messages';chargerClientDetail(x.dataset.id).then(render)}},true);
const _r=render;render=function(){_r.apply(this,arguments);try{b.hidden=g.hidden}catch(e){}try{dessiner()}catch(e){}};
window.calEvt=evenements;window.calOpen=function(){sel=new Date();cur=new Date();cur.setDate(1);ouvrir()};
})();
