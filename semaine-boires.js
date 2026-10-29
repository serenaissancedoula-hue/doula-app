/* Sérénaissance — Journal bébé : la semaine de bébé, jour par jour (lun, mar, mer…) côte à côte, avec le nombre de boires
   et la quantité bue au biberon. Des flèches pour passer d'une semaine à l'autre (Semaine 1 = la semaine de la naissance).
   Le tableau « première semaine » (jours 1 à 7) disparaît une fois la semaine terminée. */
(function(){
if(window.ESPACE!=='parent'||typeof pJournal!=='function')return;
const J=864e5,j0=t=>{const d=new Date(t);d.setHours(0,0,0,0);return +d};
function sbCarte(st,mode){const CO=mode==='couches',SO=mode==='sommeil';const b0=j0(st.birth),cur=Math.max(0,Math.floor((j0(Date.now())-b0)/J/7));
  let w=S.sbSem==null?cur:Math.max(0,Math.min(cur,S.sbSem));const deb=b0+w*7*J,fin=deb+6*J;
  const f=t=>new Date(t).toLocaleDateString('fr-CA',{day:'numeric',month:'short'});
  const aujT=j0(Date.now());let sel=S.sbJour;if(!(sel>=deb&&sel<=fin))sel=aujT>=deb&&aujT<=fin?aujT:fin>aujT?deb:fin;
  let tB=0,tM=0,cols='';
  for(let i=0;i<7;i++){const a=deb+i*J,e=a+J,fut=a>Date.now(),auj=a===j0(Date.now());
    if(SO){const Z=sbSom(a),D=new Date(a);tB+=Z.n;tM+=Z.tot;
      cols+='<button class="sb-j'+(fut?' fut':'')+(auj?' auj':'')+(a===sel?' sel':'')+'" data-sbj="'+a+'"'+(fut?' disabled':'')+' aria-pressed="'+(a===sel)+'"><span class="sb-jn">'+D.toLocaleDateString('fr-CA',{weekday:'short'}).replace('.','')+'</span><span class="sb-jd">'+D.getDate()+'</span><span class="sb-jv">J'+(w*7+i+1)+'</span>'+(fut?'<b>·</b>':'<b>'+Z.n+'</b><small>sieste'+(Z.n>1?'s':'')+'</small><span class="sb-ml">'+hm(Z.tot,1)+'</span>')+'</button>';continue}
    if(CO){const C=(S.logs||[]).filter(l=>l.t>=a&&l.t<e&&l.type==='couche'),pp=C.filter(l=>l.pipi).length,ss=C.filter(l=>l.selle).length;tB+=pp;tM+=ss;const D=new Date(a);
      cols+='<button class="sb-j'+(fut?' fut':'')+(auj?' auj':'')+(a===sel?' sel':'')+'" data-sbj="'+a+'"'+(fut?' disabled':'')+' aria-pressed="'+(a===sel)+'"><span class="sb-jn">'+D.toLocaleDateString('fr-CA',{weekday:'short'}).replace('.','')+'</span><span class="sb-jd">'+D.getDate()+'</span><span class="sb-jv">J'+(w*7+i+1)+'</span>'+(fut?'<b>·</b>':'<b>'+pp+'</b><small>pipi</small><b class="sb-b2">'+ss+'</b><small>souill.</small>')+'</button>';continue}
    const L=(S.logs||[]).filter(l=>l.t>=a&&l.t<e&&(l.type==='sein'||l.type==='biberon')),n=L.length,ml=L.filter(l=>l.type==='biberon').reduce((s,l)=>s+(+l.ml||0),0),se=L.filter(l=>l.type==='sein').length;
    tB+=n;tM+=ml;const D=new Date(a);
    cols+='<button class="sb-j'+(fut?' fut':'')+(auj?' auj':'')+(a===sel?' sel':'')+'" data-sbj="'+a+'"'+(fut?' disabled':'')+' aria-pressed="'+(a===sel)+'"><span class="sb-jn">'+D.toLocaleDateString('fr-CA',{weekday:'short'}).replace('.','')+'</span><span class="sb-jd">'+D.getDate()+'</span><span class="sb-jv">J'+(w*7+i+1)+'</span>'+
      (fut?'<b>·</b>':'<b>'+n+'</b><small>boire'+(n>1?'s':'')+'</small>'+(ml?'<span class="sb-ml">'+ml+'<br>ml</span>':se?'<span class="sb-ml">'+se+'<br>sein</span>':'<span class="sb-ml">&nbsp;</span>'))+'</button>'}
  const jours=Math.max(1,Math.min(7,Math.floor((j0(Date.now())-deb)/J)+1));
  return '<div class="card sb"><div class="sb-tete"><button class="sb-fl" data-sb="'+(w-1)+'"'+(w<=0?' disabled':'')+' aria-label="Semaine précédente">'+icon('fa-chevron-left')+'</button>'+
    '<div class="sb-titre"><b>Semaine '+(w+1)+'</b><span>du '+f(deb)+' au '+f(fin)+'</span></div>'+
    '<button class="sb-fl" data-sb="'+(w+1)+'"'+(w>=cur?' disabled':'')+' aria-label="Semaine suivante">'+icon('fa-chevron-right')+'</button></div>'+
    '<div class="sb-jours">'+cols+'</div>'+(SO?sbDetSom(sel,b0):sbDetail(sel,CO,b0))+
    (SO?'<div class="sb-tot"><span><b>'+tB+'</b> siestes cette semaine</span><span>moy. <b>'+hm(tM/jours)+'</b> de sommeil par jour</span></div></div>':CO?'<div class="sb-tot"><span><b>'+tB+'</b> pipi</span><span><b>'+tM+'</b> souillées</span><span>moy. <b>'+(Math.round(tB/jours*10)/10).toString().replace('.',',')+'</b> pipi / <b>'+(Math.round(tM/jours*10)/10).toString().replace('.',',')+'</b> souillées par jour</span></div></div>':'<div class="sb-tot"><span><b>'+tB+'</b> boires cette semaine</span>'+(tM?'<span><b>'+tM+' ml</b> au biberon</span>':'')+'<span>moy. <b>'+(Math.round(tB/Math.max(1,Math.min(7,jours))*10)/10).toString().replace('.',',')+'</b> / jour</span></div></div>')}
function sbDetail(a,CO,b0){if(a>Date.now())return '';const L=(S.logs||[]).filter(l=>l.t>=a&&l.t<a+J&&(CO?l.type==='couche':(l.type==='sein'||l.type==='biberon'||l.type==='tirage'))).sort((x,y)=>x.t-y.t);const jv=b0!=null?Math.round((a-b0)/J)+1:0;
  const D=new Date(a).toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long'}),bo=L.filter(l=>l.type!=='tirage'),ml=L.filter(l=>l.type==='biberon').reduce((s,l)=>s+(+l.ml||0),0),sec=L.filter(l=>l.type==='sein').reduce((s,l)=>s+(+l.sec||0),0);
  const lig=l=>{let m=['fa-droplet','Boire'];try{m=LOGMETA[l.type]}catch(e){}let tx='';try{tx=logText(l)}catch(e){}
    return '<div class="li"><div class="ic">'+icon(m[0])+'</div><div class="tx"><b>'+esc(m[1])+' · '+fmtT(l.t)+'</b><span>'+tx+'</span></div><button class="icon-btn" data-act="delLog" data-id="'+l.id+'" aria-label="Supprimer">'+icon('fa-trash')+'</button></div>'};
  const tt=(jv?'Jour '+jv+' de vie · ':'')+D.charAt(0).toUpperCase()+D.slice(1);
  const res=CO?L.filter(l=>l.pipi).length+' couche'+(L.filter(l=>l.pipi).length>1?'s':'')+' pipi · '+L.filter(l=>l.selle).length+' souillée'+(L.filter(l=>l.selle).length>1?'s':'')+(L.filter(l=>l.pipi&&l.selle).length?' (dont '+L.filter(l=>l.pipi&&l.selle).length+' les deux)':''):bo.length+' boire'+(bo.length>1?'s':'')+(ml?' · '+ml+' ml':'')+(sec?' · '+Math.round(sec/60)+' min au sein':'');
  return '<div class="sb-det"><div class="sb-det-t"><b>'+tt+'</b><span>'+res+'</span></div>'+
    (L.length?'<div class="list">'+L.map(lig).join('')+'</div>':'<p class="small muted" style="margin:6px 0 0">'+(CO?'Aucune couche notée ce jour-là.':'Aucun boire noté ce jour-là.')+'</p>')+'</div>'}
function hm(sec,court){sec=Math.round(sec||0);const h=Math.floor(sec/3600),m=Math.round(sec%3600/60);if(court)return sec?(h?h+'h'+(m?String(m).padStart(2,'0'):''):m+'<br>min'):'0';return h?h+' h'+(m?' '+String(m).padStart(2,'0'):''):m+' min'}
/* sommeil d'une journée : les siestes commencent entre 7 h et 19 h, le reste compte comme la nuit */
function sbSom(a){const L=(S.logs||[]).filter(l=>l.type==='sommeil'&&l.t>=a&&l.t<a+J).sort((x,y)=>x.t-y.t),sieste=l=>{const h=new Date(l.t).getHours();return h>=7&&h<19};
  const Si=L.filter(sieste),Nu=L.filter(l=>!sieste(l)),sum=A=>A.reduce((s,l)=>s+(+l.sec||0),0);return {L,n:Si.length,sie:sum(Si),nuit:sum(Nu),tot:sum(L)}}
function sbDetSom(a,b0){if(a>Date.now())return '';const Z=sbSom(a),jv=Math.round((a-b0)/J)+1,D=new Date(a).toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long'});
  const lig=l=>{const h=new Date(l.t).getHours(),si=h>=7&&h<19,fin=l.t+(+l.sec||0)*1000;return '<div class="li"><div class="ic">'+icon(si?'fa-sun':'fa-moon')+'</div><div class="tx"><b>'+(si?'Sieste':'Nuit')+' · '+fmtT(l.t)+(l.sec?' à '+fmtT(fin):'')+'</b><span>'+hm(l.sec)+(l.note?' · '+esc(l.note):'')+'</span></div><button class="icon-btn" data-act="delLog" data-id="'+l.id+'" aria-label="Supprimer">'+icon('fa-trash')+'</button></div>'};
  return '<div class="sb-det"><div class="sb-det-t"><b>Jour '+jv+' de vie · '+D.charAt(0).toUpperCase()+D.slice(1)+'</b><span><b>'+Z.n+' sieste'+(Z.n>1?'s':'')+'</b> pour un total de <b>'+hm(Z.sie)+'</b>'+(Z.nuit?' · nuit '+hm(Z.nuit):'')+' · en tout '+hm(Z.tot)+'</span></div>'+
    (Z.L.length?'<div class="list">'+Z.L.map(lig).join('')+'</div>':'<p class="small muted" style="margin:6px 0 0">Aucun sommeil noté ce jour-là.</p>')+'</div>'}
const _pJ=pJournal;
pJournal=function(){const h=_pJ.apply(this,arguments);try{const st=stage();const tb=S.jbTab||'repas';if(st.k!=='pp'||!['repas','resume','couches','sommeil'].includes(tb))return h;
  const t=document.createElement('template');t.innerHTML=h;const c=t.content.querySelector('.jb-stats');const card=c&&c.closest('.card');
  const x=document.createElement('template');x.innerHTML=sbCarte(st,tb==='couches'||tb==='sommeil'?tb:'');
  if(tb==='couches'){const aj=t.content.querySelector('.jb-ajout');if(aj){aj.innerHTML='<button class="btn sb-cq" data-cq="p">💧 Pipi</button><button class="btn sb-cq" data-cq="s">💩 Souillée</button><button class="btn sb-cq" data-cq="ps">💧💩 Les deux</button><button class="btn ghost sb-cq2" data-act="couche">'+icon('fa-clock')+'Autre heure ou couleur</button>'}}if(card)card.after(x.content);else t.content.prepend(x.content);
  return [...t.content.childNodes].map(n=>n.outerHTML||n.textContent||'').join('')}catch(e){return h}};
document.addEventListener('click',async e=>{const q=e.target.closest('[data-cq]');if(q){e.stopPropagation();const v=q.dataset.cq;q.disabled=true;try{const o={type:'couche',pipi:v!=='s',selle:v!=='p',couleur:'',t:Date.now()};await logPush(o);if(!o.id){q.disabled=false;return}render();toast(v==='p'?'Couche pipi notée':v==='s'?'Couche souillée notée':'Pipi + souillée notée')}catch(x){toast('Non enregistré')}return}const j=e.target.closest('[data-sbj]');if(j){e.stopPropagation();if(!j.disabled){S.sbJour=+j.dataset.sbj;render()}return}const b=e.target.closest('[data-sb]');if(!b||b.disabled)return;e.stopPropagation();S.sbSem=+b.dataset.sb;render()},true);
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
  '.sb-b2{font-size:1.05rem!important;margin-top:6px!important;color:#9a7b4f}.sb-j.sel .sb-b2{color:#fff}.sb-cq{flex:1 1 30%!important;min-width:0!important;padding-left:6px;padding-right:6px}.sb-cq2{flex:1 1 100%!important}'+
  '.sb-jv{font-size:.56rem;color:var(--muted);font-weight:600}.sb-j.sel .sb-jv{color:#fff}'+
  '.sb-ml{font-size:.66rem;font-weight:600;color:var(--accent);margin-top:3px;line-height:1.1}'+
  '.sb-tot{display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:center;margin-top:12px;font-size:.82rem;color:var(--muted)}.sb-tot b{color:var(--ink)}';
  document.head.appendChild(st)})();
})();
