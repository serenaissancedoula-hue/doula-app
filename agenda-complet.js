/* Sérénaissance — Agenda : familles en garde, calendrier complet du mois, puis l'agenda habituel et Mes vacances. */
(function(){
const MO=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],JR=['L','M','M','J','V','S','D'];
let cur=new Date(),sel=new Date();cur.setDate(1);
const K=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
function evts(){const E={},add=(d,e)=>{if(!d||isNaN(d))return;(E[K(d)]=E[K(d)]||[]).push(e)};
  const nom=id=>{const c=(S.clients||[]).find(x=>x.id===id);return c?cName(c):'Famille'};
  (CRDV||[]).filter(r=>r.statut!=='annule').forEach(r=>{const d=new Date(r.debut);add(d,{t:'rdv',txt:(r.statut==='demande'?'Demande · ':'')+(r.type||'Rendez-vous')+' · '+nom(r.famille_id),h:d.toLocaleTimeString('fr-CA',{hour:'2-digit',minute:'2-digit'}),fam:r.famille_id})});
  (S.clients||[]).forEach(c=>{const dp=parseD(c.dpa),nb=parseD(c.naiss);
    if(dp&&!nb){add(dp,{t:'dpa',txt:'Date prévue · '+cName(c),fam:c.id});for(let i=-14;i<=14;i++)if(i)add(addD(dp,i),{t:'garde',txt:'En garde · '+cName(c),fam:c.id})}
    if(nb)add(nb,{t:'nais',txt:'Naissance · '+cName(c),fam:c.id});
    (c.rdv||[]).forEach(r=>{const d=parseD(r.prochaine);if(d)add(d,{t:'rdv',txt:'Rencontre prévue · '+cName(c),fam:c.id})})});
  try{const V=(typeof dispoDe==='function'?dispoDe(ME_DOULA.modeles).vacances:[]);V.forEach(v=>{for(let d=parseD(v.du),f=parseD(v.au);d&&f&&d<=f;d=addD(d,1))add(d,{t:'vac',txt:'Vacances / absence'})})}catch(e){}
  return E}
function enGardeBloc(){const L=(S.clients||[]).filter(c=>{try{return enGarde(c)}catch(e){return false}});
  return '<div class="card"><span class="eyebrow acc">Familles en garde</span>'+(L.length?'<div class="list">'+L.map(c=>{const s=cStage(c);return '<button class="li" data-act="clientOpen" data-id="'+c.id+'" style="background:none;border-left:0;border-right:0;border-top:0;width:100%;text-align:left;cursor:pointer;color:inherit"><div class="ic">'+icon('fa-phone')+'</div><div class="tx"><b>'+esc(cName(c))+'</b><span>'+s.w+' sem. + '+s.d+' j · terme prévu dans '+s.left+' j</span></div></button>'}).join('')+'</div>':'<p class="small muted">Aucune famille en garde pour le moment (garde = de 38 semaines à l\'accouchement).</p>')+'</div>'}
function grille(){const E=evts(),y=cur.getFullYear(),m=cur.getMonth(),pr=(new Date(y,m,1).getDay()+6)%7,nb=new Date(y,m+1,0).getDate(),auj=K(new Date());
  let c='';for(let i=0;i<pr;i++)c+='<div></div>';
  for(let d=1;d<=nb;d++){const k=K(new Date(y,m,d)),L=E[k]||[],es=k===K(sel),col={rdv:'var(--accent)',dpa:'var(--sage-dk,#5a7a52)',nais:'var(--warn,#b8860b)',vac:'#7a8fb8'};
    const pts=['rdv','dpa','nais','vac'].filter(t=>L.some(e=>e.t===t)).map(t=>'<i style="width:6px;height:6px;border-radius:50%;background:'+col[t]+'"></i>').join('');
    c+='<button data-act="agcJour" data-k="'+k+'" style="border:'+(k===auj?'2px solid var(--accent)':'1px solid transparent')+';background:'+(es?'var(--soft)':L.some(e=>e.t==='garde')?'var(--sage-soft,#eef3ec)':'var(--card,#fff)')+';border-radius:12px;min-height:46px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:inherit;font:inherit;cursor:pointer"><span style="font-weight:'+(es?800:500)+'">'+d+'</span><span style="display:flex;gap:3px;min-height:6px">'+pts+'</span></button>'}
  const J=(E[K(sel)]||[]).sort((a,b)=>(a.h||'').localeCompare(b.h||'')),dot=(c,t)=>'<span class="xs muted"><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+c+'"></i> '+t+'</span>';
  return '<div class="card"><div class="row between" style="margin-bottom:10px"><button class="btn sm ghost" data-act="agcMois" data-v="-1" aria-label="Mois précédent">'+icon('fa-chevron-left')+'</button><b style="text-transform:capitalize;font-size:1.1em">'+MO[m]+' '+y+'</b><button class="btn sm ghost" data-act="agcMois" data-v="1" aria-label="Mois suivant">'+icon('fa-chevron-right')+'</button></div>'+
   '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center"><div class="xs muted">'+JR.join('</div><div class="xs muted">')+'</div>'+c+'</div>'+
   '<div class="row" style="gap:12px;flex-wrap:wrap;margin:12px 0">'+dot('var(--accent)','rendez-vous')+dot('var(--sage-dk,#5a7a52)','date prévue')+dot('var(--warn,#b8860b)','naissance')+dot('#7a8fb8','vacances')+'<span class="xs muted"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--sage-soft,#eef3ec)"></i> en garde</span></div>'+
   '<span class="eyebrow acc" style="text-transform:capitalize">'+sel.toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long'})+'</span>'+(J.length?J.map(e=>'<div class="li"'+(e.fam?' data-act="clientOpen" data-id="'+e.fam+'" style="cursor:pointer"':'')+'><div class="tx"><b>'+esc(e.txt)+'</b>'+(e.h?'<span>'+e.h+'</span>':'')+'</div></div>').join(''):'<p class="small muted">Rien de prévu ce jour-là.</p>')+
   '<div class="row" style="margin-top:8px"><button class="btn sm ghost" data-act="agcAuj">Aujourd\'hui</button></div></div>'}
function vacBloc(){try{const h=carteDispos(),i=h.indexOf('<div class="card"><span class="eyebrow acc">Mes vacances et absences');return i<0?'':h.slice(i)}catch(e){return ''}}
const _d=dAgenda;dAgenda=function(){const h=_d(),i=h.indexOf('</div>')+6;/* garde + calendrier juste sous le titre */
  const k=h.indexOf('class="sh"')>=0?h.indexOf('</div>',h.indexOf('class="sh"'))+6:0;
  return h.slice(0,k)+enGardeBloc()+grille()+h.slice(k)+vacBloc()};
document.addEventListener('click',e=>{const x=e.target.closest('[data-act]');if(!x)return;const a=x.dataset.act;
  if(a==='agcMois'){e.stopPropagation();cur=new Date(cur.getFullYear(),cur.getMonth()+(+x.dataset.v),1);render()}
  else if(a==='agcAuj'){e.stopPropagation();sel=new Date();cur=new Date();cur.setDate(1);render()}
  else if(a==='agcJour'){e.stopPropagation();const [y,m,d]=x.dataset.k.split('-').map(Number);sel=new Date(y,m-1,d);render()}},true);
})();
