/* Sérénaissance — Journal bébé, onglet « Dents » : schéma des 20 dents de lait avec l'âge habituel de leur sortie,
   et la maman touche une dent quand elle sort pour noter la date.
   Âges : American Dental Association (tableau d'éruption des dents primaires); conseils : HealthLinkBC, Relevé postnatal Rourke. */
(function(){
if(window.ESPACE!=='parent'||typeof pJournal!=='function')return;
const T={ci:['Incisive centrale','#f2a7a0','Incisives centrales'],li:['Incisive latérale','#7ec8b8','Incisives latérales'],c:['Canine','#c9d98f','Canines'],m1:['Première molaire','#f1d4ae','Premières molaires'],m2:['Deuxième molaire','#cbb6e3','Deuxièmes molaires']};
const AGE={h:{ci:[8,12],li:[9,13],c:[16,22],m1:[13,19],m2:[25,33]},b:{ci:[6,10],li:[10,16],c:[17,23],m1:[14,18],m2:[23,31]}};
const ORDRE=['m2','m1','c','li','ci','ci','li','c','m1','m2'];
const DENTS=[];['h','b'].forEach(m=>ORDRE.forEach((t,i)=>DENTS.push({id:m+i,m,t,cote:i<5?'droite':'gauche'})));
function sauver(){try{if(typeof saveParent==='function')saveParent();else save()}catch(e){}}
function cleBb(){try{return window.pfNbBebe&&window.pfNbBebe()>1?String(Math.max(0,+S.bbSel||0)):''}catch(e){return ''}}
function dents(){const p=S.parent;const k=cleBb();if(k===''){p.dents=p.dents||{};return p.dents}p.dentsMulti=p.dentsMulti||{};p.dentsMulti[k]=p.dentsMulti[k]||{};return p.dentsMulti[k]}
function moisBebe(){try{const st=stage(),B=new Date(st.birth),N=new Date();let m=(N.getFullYear()-B.getFullYear())*12+N.getMonth()-B.getMonth();if(N.getDate()<B.getDate())m--;return Math.max(0,m)}catch(e){return 0}}
const nomDent=d=>T[d.t][0]+' '+(d.m==='h'?'du haut':'du bas')+(d.t==='ci'||d.t==='li'?'':'')+', côté '+d.cote;
function pos(d){const i=+d.id.slice(1),haut=d.m==='h',a=haut?(200+140*i/9):(160-140*i/9),r=a*Math.PI/180;return [160+118*Math.cos(r),(haut?178:162)+132*Math.sin(r)]}
function schema(){const D=dents();let s='<svg viewBox="0 0 320 340" class="dt-svg" role="img" aria-label="Schéma des dents de lait. Touchez une dent pour noter sa sortie.">';
  s+='<text x="160" y="14" text-anchor="middle" class="dt-t">Haut</text><text x="160" y="170" text-anchor="middle" class="dt-t dt-c">Touchez une dent</text><text x="160" y="336" text-anchor="middle" class="dt-t">Bas</text>';
  DENTS.forEach(d=>{const [x,y]=pos(d);
    const r=d.t==='m1'||d.t==='m2'?15.5:d.t==='c'?13.5:12.5,sortie=!!D[d.id],col=T[d.t][1];
    s+='<g class="dt-d'+(sortie?' ok':'')+'" data-dent="'+d.id+'" tabindex="0" role="button" aria-label="'+esc(nomDent(d))+(sortie?', sortie le '+D[d.id]:'')+'"><ellipse cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" rx="'+r+'" ry="'+(r*1.08).toFixed(1)+'" fill="'+(sortie?col:'transparent')+'" stroke="'+col+'" stroke-width="'+(sortie?2:2.5)+'"'+(sortie?'':' stroke-dasharray="4 3"')+'/>'+
      (sortie?'<text x="'+x.toFixed(1)+'" y="'+(y+4.5).toFixed(1)+'" text-anchor="middle" class="dt-ok">✓</text>':'')+'</g>'});
  return s+'</svg>'}
function legende(){return '<div class="dt-leg">'+Object.entries(T).map(([k,v])=>'<div><i style="background:'+v[1]+'"></i><b>'+v[2]+'</b><small>haut '+AGE.h[k][0]+' à '+AGE.h[k][1]+' mois · bas '+AGE.b[k][0]+' à '+AGE.b[k][1]+' mois</small></div>').join('')+'</div>'}
function page(){const D=dents(),n=Object.keys(D).length,m=moisBebe(),L=Object.entries(D).sort((a,b)=>a[1]<b[1]?-1:1),prem=L[0];
  const attendues=DENTS.filter(d=>!D[d.id]&&AGE[d.m][d.t][0]<=m+2&&AGE[d.m][d.t][1]>=m-1);
  let h='<div class="card"><div class="jb-stats"><div class="jb-stat"><b>'+n+' / 20</b><span>dents sorties</span></div><div class="jb-stat"><b>'+(prem?fmtD(parseD(prem[1]),{day:'numeric',month:'short',year:'numeric'}):'—')+'</b><span>première dent</span></div></div></div>';
  h+='<div class="card dt-card"><span class="eyebrow acc">Les dents de lait</span><p class="small muted" style="margin:2px 0 6px">Touchez une dent quand elle sort pour noter la date. Pointillé : pas encore sortie.</p>'+schema()+legende()+
    '<p class="xs muted" style="margin-top:8px">Âges habituels, à titre indicatif : chaque enfant a son rythme. Les 20 dents de lait sont en général sorties vers 3 ans.</p></div>';
  if(attendues.length&&n<20)h+='<div class="card"><span class="eyebrow acc">Celles qui pourraient arriver bientôt</span><ul class="clean dv-l">'+[...new Set(attendues.map(d=>T[d.t][2]+' du '+(d.m==='h'?'haut':'bas')))].map(x=>'<li>'+x+'</li>').join('')+'</ul></div>';
  if(L.length)h+='<div class="card"><span class="eyebrow acc">Historique</span><div class="list">'+L.map(([id,dt])=>{const d=DENTS.find(x=>x.id===id);return d?'<div class="li"><div class="ic" style="color:'+T[d.t][1]+'">🦷</div><div class="tx"><b>'+esc(nomDent(d))+'</b><span>'+fmtD(parseD(dt),{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'</span></div></div>':''}).join('')+'</div></div>';
  h+='<div class="card"><span class="eyebrow acc">Soulager et prendre soin</span><ul class="clean dv-l"><li>Les premières dents sortent souvent vers 6 mois, d\'abord celles du bas en avant, puis celles du haut.</li><li>Pour soulager : un anneau de dentition propre et frais, un jouet de dentition ou une débarbouillette propre et mouillée à mâchouiller. Évitez les biscuits de dentition, qui collent aux dents.</li><li><b>Les dents ne causent pas de fièvre.</b> Fièvre ou diarrhée : traitez-les comme d\'habitude, et appelez le 811 ou votre professionnel au besoin.</li><li>Brossez dents et gencives 2 fois par jour avec une brosse souple : de l\'eau seulement, ou un grain de riz de dentifrice fluoré si le dentiste voit un risque de caries.</li><li>Premier rendez-vous chez le dentiste : dans les 6 mois après la première dent, au plus tard à 1 an.</li><li>Aucune dent à 18 mois ? Parlez-en à votre dentiste ou médecin.</li></ul>'+
    '<p class="xs muted">Sources : <a href="https://www.mouthhealthy.org/-/media/project/ada-organization/ada/mouthhealthy/files/activity-sheets/adaprimarytoothdev_eng.pdf" target="_blank" rel="noopener">American Dental Association, éruption des dents</a> · <a href="https://www.healthlinkbc.ca/healthlinkbc-files/dental-care-your-infant-and-toddler" target="_blank" rel="noopener">HealthLinkBC</a> · <a href="https://www.rourkebabyrecord.ca/notes-evidence-summary/oral-health" target="_blank" rel="noopener">Relevé postnatal Rourke</a></p></div>';
  return h}
function fiche(id){const d=DENTS.find(x=>x.id===id);if(!d)return;const D=dents(),v=D[id],a=AGE[d.m][d.t];
  sheet('🦷 '+nomDent(d),'<p class="small muted">Sort habituellement entre '+a[0]+' et '+a[1]+' mois.</p><label class="f">Date de sortie<input type="date" id="dt_d" max="'+iso(new Date())+'" value="'+esc(v||iso(new Date()))+'"></label><button class="btn" data-dt-save="'+id+'">'+(v?'Mettre à jour':'Elle est sortie !')+'</button>'+(v?'<button class="btn ghost" data-dt-del="'+id+'" style="margin-top:8px">Retirer cette date</button>':''))}
/* onglet */
const _pJ=pJournal;
pJournal=function(){let st;try{st=stage()}catch(e){}if(!st||st.k!=='pp')return _pJ.apply(this,arguments);
  if(S.jbTab!=='dents'){const h0=_pJ.apply(this,arguments);if(moisBebe()<3&&!Object.keys(dents()).length)return h0;return onglet(h0,false)}
  S.jbTab='repas';let h;try{h=_pJ.apply(this,arguments)}finally{S.jbTab='dents'}
  const t=document.createElement('template');t.innerHTML=onglet(h,true);const keep=[...t.content.children].filter(n=>n.classList.contains('jb-tete')||n.classList.contains('jb-tabs'));
  return keep.map(n=>n.outerHTML).join('')+page()};
function onglet(h,sel){const t=document.createElement('template');t.innerHTML=h;const tabs=t.content.querySelector('.jb-tabs');if(!tabs)return h;
  if(sel)tabs.querySelectorAll('[aria-selected]').forEach(b=>b.setAttribute('aria-selected','false'));
  const ref=tabs.querySelector('[data-jb="croissance"]'),b=document.createElement('template');b.innerHTML='<button role="tab" aria-selected="'+sel+'" data-jb="dents"><span>🦷</span><span>Dents</span></button>';
  if(ref)ref.after(b.content);else tabs.append(b.content);return [...t.content.childNodes].map(n=>n.outerHTML||n.textContent||'').join('')}
document.addEventListener('click',e=>{let b=e.target.closest('[data-dent]');if(b){e.stopPropagation();fiche(b.dataset.dent);return}
  if(b=e.target.closest('[data-dt-save]')){e.stopPropagation();const v=$('#dt_d').value;if(!v){toast('Choisissez la date');return}dents()[b.dataset.dtSave]=v;sauver();close();render();toast('Dent notée 🦷');return}
  if(b=e.target.closest('[data-dt-del]')){e.stopPropagation();delete dents()[b.dataset.dtDel];sauver();close();render();return}},true);
document.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const b=e.target.closest&&e.target.closest('[data-dent]');if(b){e.preventDefault();fiche(b.dataset.dent)}});
(function(){const st=document.createElement('style');st.textContent=
 '.dt-svg{display:block;width:100%;max-width:340px;margin:0 auto;height:auto}.dt-d{cursor:pointer}.dt-d:focus{outline:none}.dt-d:focus ellipse,.dt-d:hover ellipse{stroke-width:3.5}.dt-t{font:600 11px var(--f-body);fill:var(--muted);text-transform:uppercase;letter-spacing:.1em}.dt-c{text-transform:none;letter-spacing:0;font-weight:500;font-size:10px}.dt-ok{font:700 13px var(--f-body);fill:#4a3029}'+
 '.dt-leg{display:grid;grid-template-columns:1fr;gap:6px;margin-top:10px}.dt-leg div{display:grid;grid-template-columns:16px 1fr;column-gap:8px;align-items:center}.dt-leg i{width:14px;height:14px;border-radius:50%;grid-row:1/3}.dt-leg b{font-size:.85rem}.dt-leg small{font-size:.74rem;color:var(--muted)}';
 document.head.appendChild(st)})();
})();
