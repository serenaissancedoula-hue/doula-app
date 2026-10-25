/* Sérénaissance — Journal bébé : la semaine de bébé, jour par jour (lun, mar, mer…) côte à côte, avec le nombre de boires
   et la quantité bue au biberon. Des flèches pour passer d'une semaine à l'autre (Semaine 1 = la semaine de la naissance).
   Le tableau « première semaine » (jours 1 à 7) disparaît une fois la semaine terminée. */
(function(){
if(window.ESPACE!=='parent'||typeof pJournal!=='function')return;
const J=864e5,j0=t=>{const d=new Date(t);d.setHours(0,0,0,0);return +d};
function sbCarte(st){const b0=j0(st.birth),cur=Math.max(0,Math.floor((j0(Date.now())-b0)/J/7));
  let w=S.sbSem==null?cur:Math.max(0,Math.min(cur,S.sbSem));const deb=b0+w*7*J,fin=deb+6*J;
  const f=t=>new Date(t).toLocaleDateString('fr-CA',{day:'numeric',month:'short'});
  const aujT=j0(Date.now());let sel=S.sbJour;if(!(sel>=deb&&sel<=fin))sel=aujT>=deb&&aujT<=fin?aujT:fin>aujT?deb:fin;
  let tB=0,tM=0,cols='';
  for(let i=0;i<7;i++){const a=deb+i*J,e=a+J,fut=a>Date.now(),auj=a===j0(Date.now());
    const L=(S.logs||[]).filter(l=>l.t>=a&&l.t<e&&(l.type==='sein'||l.type==='biberon')),n=L.length,ml=L.filter(l=>l.type==='biberon').reduce((s,l)=>s+(+l.ml||0),0),se=L.filter(l=>l.type==='sein').length;
    tB+=n;tM+=ml;const D=new Date(a);
    cols+='<button class="sb-j'+(fut?' fut':'')+(auj?' auj':'')+(a===sel?' sel':'')+'" data-sbj="'+a+'"'+(fut?' disabled':'')+' aria-pressed="'+(a===sel)+'"><span class="sb-jn">'+D.toLocaleDateString('fr-CA',{weekday:'short'}).replace('.','')+'</span><span class="sb-jd">'+D.getDate()+'</span>'+
      (fut?'<b>·</b>':'<b>'+n+'</b><small>boire'+(n>1?'s':'')+'</small>'+(ml?'<span class="sb-ml">'+ml+'<br>ml</span>':se?'<span class="sb-ml">'+se+'<br>sein</span>':'<span class="sb-ml">&nbsp;</span>'))+'</button>'}
  const jours=Math.max(1,Math.min(7,Math.floor((j0(Date.now())-deb)/J)+1));
  return '<div class="card sb"><div class="sb-tete"><button class="sb-fl" data-sb="'+(w-1)+'"'+(w<=0?' disabled':'')+' aria-label="Semaine précédente">'+icon('fa-chevron-left')+'</button>'+
    '<div class="sb-titre"><b>Semaine '+(w+1)+'</b><span>du '+f(deb)+' au '+f(fin)+'</span></div>'+
    '<button class="sb-fl" data-sb="'+(w+1)+'"'+(w>=cur?' disabled':'')+' aria-label="Semaine suivante">'+icon('fa-chevron-right')+'</button></div>'+
    '<div class="sb-jours">'+cols+'</div>'+sbDetail(sel)+
    '<div class="sb-tot"><span><b>'+tB+'</b> boires cette semaine</span>'+(tM?'<span><b>'+tM+' ml</b> au biberon</span>':'')+'<span>moy. <b>'+(Math.round(tB/Math.max(1,Math.min(7,jours))*10)/10).toString().replace('.',',')+'</b> / jour</span></div></div>'}
function sbDetail(a){if(a>Date.now())return '';const L=(S.logs||[]).filter(l=>l.t>=a&&l.t<a+J&&(l.type==='sein'||l.type==='biberon'||l.type==='tirage')).sort((x,y)=>x.t-y.t);
  const D=new Date(a).toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long'}),bo=L.filter(l=>l.type!=='tirage'),ml=L.filter(l=>l.type==='biberon').reduce((s,l)=>s+(+l.ml||0),0),sec=L.filter(l=>l.type==='sein').reduce((s,l)=>s+(+l.sec||0),0);
  const lig=l=>{let m=['fa-droplet','Boire'];try{m=LOGMETA[l.type]}catch(e){}let tx='';try{tx=logText(l)}catch(e){}
    return '<div class="li"><div class="ic">'+icon(m[0])+'</div><div class="tx"><b>'+esc(m[1])+' · '+fmtT(l.t)+'</b><span>'+tx+'</span></div><button class="icon-btn" data-act="delLog" data-id="'+l.id+'" aria-label="Supprimer">'+icon('fa-trash')+'</button></div>'};
  return '<div class="sb-det"><div class="sb-det-t"><b>'+D.charAt(0).toUpperCase()+D.slice(1)+'</b><span>'+bo.length+' boire'+(bo.length>1?'s':'')+(ml?' · '+ml+' ml':'')+(sec?' · '+Math.round(sec/60)+' min au sein':'')+'</span></div>'+
    (L.length?'<div class="list">'+L.map(lig).join('')+'</div>':'<p class="small muted" style="margin:6px 0 0">Aucun boire noté ce jour-là.</p>')+'</div>'}
const _pJ=pJournal;
pJournal=function(){const h=_pJ.apply(this,arguments);try{const st=stage();if(st.k!=='pp'||!['repas','resume'].includes(S.jbTab||'repas'))return h;
  const t=document.createElement('template');t.innerHTML=h;const c=t.content.querySelector('.jb-stats');const card=c&&c.closest('.card');
  const x=document.createElement('template');x.innerHTML=sbCarte(st);if(card)card.after(x.content);else t.content.prepend(x.content);
  return [...t.content.childNodes].map(n=>n.outerHTML||n.textContent||'').join('')}catch(e){return h}};
document.addEventListener('click',e=>{const j=e.target.closest('[data-sbj]');if(j){e.stopPropagation();if(!j.disabled){S.sbJour=+j.dataset.sbj;render()}return}const b=e.target.closest('[data-sb]');if(!b||b.disabled)return;e.stopPropagation();S.sbSem=+b.dataset.sb;render()},true);
/* le tableau des 7 premiers jours s'efface une fois la première semaine terminée */
if(typeof firstWeek==='function'){const _fw=firstWeek;firstWeek=function(birth){try{if(Math.floor((j0(Date.now())-j0(birth))/J)>=7)return ''}catch(e){}return _fw.apply(this,arguments)}}
(function(){const st=document.createElement('style');st.textContent=
  '.sb-tete{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}.sb-titre{display:flex;flex-direction:column;align-items:center}.sb-titre b{font-family:var(--f-display);font-size:1.2rem}.sb-titre span{font-size:.8rem;color:var(--muted)}'+
  '.sb-fl{width:40px;height:40px;border-radius:50%;border:0;background:var(--soft);color:var(--accent);display:grid;place-items:center;cursor:pointer}.sb-fl:disabled{opacity:.3;cursor:default}'+
  '.sb-jours{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}'+
  '.sb-j{display:flex;flex-direction:column;align-items:center;gap:1px;padding:8px 2px;border-radius:14px;background:var(--soft);text-align:center;min-width:0}'+
  '.sb-j{border:0;font:inherit;color:inherit;cursor:pointer;box-shadow:inset 0 0 0 0 transparent}.sb-j.auj{box-shadow:inset 0 0 0 2px var(--accent)}.sb-j.sel{background:var(--accent);color:#fff}.sb-j.sel .sb-jn,.sb-j.sel small,.sb-j.sel .sb-ml{color:#fff}.sb-j.fut{opacity:.45;cursor:default}'+
  '.sb-det{margin-top:14px;padding-top:12px;border-top:1px solid var(--line)}.sb-det-t{display:flex;flex-direction:column;gap:2px;margin-bottom:4px}.sb-det-t b{font-size:1rem}.sb-det-t span{font-size:.82rem;color:var(--muted)}'+
  '.sb-jn{font-size:.62rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}.sb-jd{font-size:.8rem;font-weight:700}.sb-j b{font-size:1.25rem;line-height:1.1;margin-top:4px}.sb-j small{font-size:.58rem;color:var(--muted)}'+
  '.sb-ml{font-size:.66rem;font-weight:600;color:var(--accent);margin-top:3px;line-height:1.1}'+
  '.sb-tot{display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:center;margin-top:12px;font-size:.82rem;color:var(--muted)}.sb-tot b{color:var(--ink)}';
  document.head.appendChild(st)})();
})();
