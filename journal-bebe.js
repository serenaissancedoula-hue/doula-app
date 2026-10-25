/* Sérénaissance — Journal bébé (après la naissance), inspiré des applis de suivi de bébé, dans le style Sérénaissance :
   l'âge de bébé en titre, des onglets en pastilles (Repas, Couches, Sommeil, Croissance, Maman, Résumé),
   et pour chaque onglet : bouton d'ajout, chiffres du jour, ligne du temps des 7 derniers jours (24 h) et liste.
   Pendant la grossesse, le journal d'avant reste le même. */
(function(){
if(window.ESPACE!=='parent'||typeof pJournal!=='function')return;
const JB_TABS=[['repas','fa-person-breastfeeding','Repas',['sein','biberon','tirage']],['couches','fa-droplet','Couches',['couche']],['sommeil','fa-moon','Sommeil',['sommeil']],
  ['croissance','fa-weight-scale','Croissance',['poids']],['maman','fa-spa','Maman',['humeur','soin','note']],['resume','fa-chart-simple','Résumé',['sein','biberon','tirage','couche','sommeil']]];
const JB_COUL={sein:'var(--accent)',biberon:'#d79a6a',tirage:'#b98ab0',couche:'var(--sage)',sommeil:'#8aa0c8',poids:'var(--gold)',humeur:'var(--gold)',soin:'var(--sage)',note:'var(--muted)'};
const JB_AJOUT={sein:['feed','Tétée'],biberon:['biberon','Biberon'],tirage:['tirage','Tirage'],couche:['couche','Couche'],sommeil:['sommeil','Sommeil'],poids:['poids','Pesée'],humeur:['humeur','Humeur'],soin:['soin','Soins'],note:['note','Note']};
const J0=t=>{const d=new Date(t);d.setHours(0,0,0,0);return +d};
const dureeTxt=s=>{s=Math.round(s||0);const h=Math.floor(s/3600),m=Math.round((s%3600)/60);return h?h+' h'+(m?' '+String(m).padStart(2,'0'):''):m+' min'};
function jbIl(t){if(!t)return '—';const m=Math.round((Date.now()-t)/60000);return m<60?'il y a '+m+' min':'il y a '+dureeTxt(m*60)}
function jbStats(tab,L){const auj=J0(Date.now()),A=L.filter(l=>l.t>=auj),c=(lab,val)=>'<div class="jb-stat"><b>'+val+'</b><span>'+lab+'</span></div>';
  if(tab==='repas'){const b=A.filter(l=>l.type==='sein'||l.type==='biberon'),ml=A.filter(l=>l.type==='biberon').reduce((s,l)=>s+(+l.ml||0),0),dern=L.filter(l=>l.type==='sein'||l.type==='biberon').sort((a,b)=>b.t-a.t)[0];
    return c('boires aujourd\'hui',b.length)+c('au biberon',ml+' ml')+c('dernier boire',dern?jbIl(dern.t):'—')}
  if(tab==='couches'){const m=A.filter(l=>l.pipi).length,s=A.filter(l=>l.selle).length,dern=L.sort((a,b)=>b.t-a.t)[0];return c('mouillées aujourd\'hui',m)+c('selles aujourd\'hui',s)+c('dernière couche',dern?jbIl(dern.t):'—')}
  if(tab==='sommeil'){const tot=A.reduce((s,l)=>s+(+l.sec||0),0),n=A.length,lg=A.reduce((m,l)=>Math.max(m,+l.sec||0),0);const Si=A.filter(l=>{const h=new Date(l.t).getHours();return h>=7&&h<19}),si=Si.reduce((s,l)=>s+(+l.sec||0),0);return c('sieste'+(Si.length>1?'s':'')+' aujourd\'hui',Si.length)+c('de siestes au total',si?dureeTxt(si):'—')+c('dormi en tout',tot?dureeTxt(tot):'—')}
  if(tab==='croissance'){const W=L.slice().sort((a,b)=>a.t-b.t);if(!W.length)return c('pesées',0);const b0=+((S.parent.naissance||{}).poids)||W[0].g,last=W[W.length-1],dv=last.g-b0;
    return c('à la naissance',cm((b0/1000).toFixed(2))+' kg')+c('actuel',cm((last.g/1000).toFixed(2))+' kg')+c('variation',(dv>=0?'+':'')+cm((dv/1000).toFixed(2))+' kg')}
  if(tab==='maman'){const h=L.filter(l=>l.type==='humeur').sort((a,b)=>b.t-a.t)[0];return c('notes cette semaine',L.filter(l=>l.t>=auj-6*864e5).length)+c('dernière humeur',h&&MOODS[h.v]?MOODS[h.v][1]:'—')}
  const b=A.filter(l=>l.type==='sein'||l.type==='biberon').length,co=A.filter(l=>l.type==='couche').length,so=A.filter(l=>l.type==='sommeil').reduce((s,l)=>s+(+l.sec||0),0);
  return c('boires aujourd\'hui',b)+c('couches aujourd\'hui',co)+c('sommeil aujourd\'hui',so?dureeTxt(so):'—')}
/* ligne du temps : 7 colonnes (jours), 24 h de haut en bas */
function jbLigne(L){const auj=J0(Date.now()),H=210,jours=[];for(let i=6;i>=0;i--)jours.push(auj-i*864e5);
  const col=d=>{const E=L.filter(l=>l.t>=d&&l.t<d+864e5||(l.type==='sommeil'&&l.t<d+864e5&&l.t+(+l.sec||0)*1000>d));
    return '<div class="jb-col">'+E.map(l=>{const deb=Math.max(l.t,d),fin=l.type==='sommeil'?Math.min(l.t+(+l.sec||0)*1000,d+864e5):deb;
      const top=(deb-d)/864e5*H,h=l.type==='sommeil'?Math.max(4,(fin-deb)/864e5*H):4;
      return '<i style="top:'+top.toFixed(1)+'px;height:'+h.toFixed(1)+'px;background:'+(JB_COUL[l.type]||'var(--accent)')+'" title="'+esc(LOGMETA[l.type][1]+' · '+fmtT(l.t))+'"></i>'}).join('')+'</div>'};
  return '<div class="jb-ligne"><div class="jb-h">'+['00:00','06:00','12:00','18:00'].map((x,i)=>'<span style="top:'+(i*H/4)+'px">'+x+'</span>').join('')+'</div>'+
    '<div class="jb-cols"><div class="jb-tetes">'+jours.map(d=>{const x=new Date(d);return '<span>'+x.toLocaleDateString('fr-CA',{weekday:'short'}).replace('.','')+'<b>'+x.getDate()+'</b></span>'}).join('')+'</div>'+
    '<div class="jb-grille" style="height:'+H+'px">'+jours.map(col).join('')+'</div></div></div>'}
function jbListe(L){const auj=J0(Date.now()),R=L.filter(l=>l.t>=auj-2*864e5).sort((a,b)=>b.t-a.t);
  if(!R.length)return '<p class="small muted" style="text-align:center;padding:8px 0">Rien de noté ces derniers jours. Touchez un bouton ci-dessus.</p>';
  const g={};R.forEach(l=>{const k=J0(l.t);(g[k]=g[k]||[]).push(l)});
  return Object.keys(g).sort((a,b)=>b-a).map(k=>'<p class="eyebrow" style="margin:10px 0 2px">'+(+k===auj?'Aujourd\'hui':+k===auj-864e5?'Hier':fmtD(new Date(+k),{weekday:'long',day:'numeric',month:'long'}))+'</p><div class="list">'+
    g[k].map(l=>'<div class="li"><div class="ic" style="color:'+(JB_COUL[l.type]||'var(--accent)')+'">'+icon(LOGMETA[l.type][0])+'</div><div class="tx"><b>'+LOGMETA[l.type][1]+' · '+fmtT(l.t)+'</b><span>'+logText(l)+'</span></div><button class="icon-btn" data-act="delLog" data-id="'+l.id+'" aria-label="Supprimer">'+icon('fa-trash')+'</button></div>').join('')+'</div>').join('')}
const _pJ=pJournal;
pJournal=function(){const st=stage();if(st.k!=='pp')return _pJ.apply(this,arguments);
  let avant='';try{const o=_pJ.apply(this,arguments),a=o.indexOf('</div>',o.indexOf('<div class="seg">'))+6,b=o.indexOf('<div class="sh">');if(a>5&&b>a)avant=o.slice(a,b)}catch(e){}
  const n=((S.parent.naissance||{}).prenomBebe||'').trim()||'Bébé',d=Math.max(0,st.day|0),s=Math.floor(d/7),j=d%7;
  const tab=JB_TABS.find(t=>t[0]===S.jbTab)||JB_TABS[0],types=tab[3],L=S.logs.filter(l=>types.includes(l.type));
  const B=new Date(st.birth),N=new Date();let mo=(N.getFullYear()-B.getFullYear())*12+N.getMonth()-B.getMonth();if(N.getDate()<B.getDate())mo--;mo=Math.max(0,mo);
  const pl=(x,u,us)=>x+' '+(x>1?us:u);
  const titre=d===0?esc(n)+' est arrivé(e) aujourd\'hui 🩷':d<90?esc(n)+' a '+pl(d,'jour','jours'):mo<24?esc(n)+' a '+mo+' mois':esc(n)+' a '+pl(Math.floor(mo/12),'an','ans')+(mo%12?' et '+mo%12+' mois':'');
  const sous=d<7?'':d<90?pl(s,'semaine','semaines')+(j?' et '+pl(j,'jour','jours'):''):pl(d,'jour','jours')+' de vie';
  let h='<div class="sh jb-tete">'+(sous?'<span class="eyebrow acc">'+sous+'</span>':'')+'<h1>'+titre+'</h1><p class="sub">Repas, couches, sommeil et croissance</p></div>';
  h+='<div class="jb-tabs" role="tablist">'+JB_TABS.map(t=>'<button role="tab" aria-selected="'+(t===tab)+'" data-jb="'+t[0]+'">'+icon(t[1])+'<span>'+t[2]+'</span></button>').join('')+'</div>';
  h+=typeof timerCard==='function'?timerCard():'';
  const aj=tab[0]==='resume'?[]:types;
  if(aj.length)h+='<div class="jb-ajout">'+aj.map(t=>'<button class="btn" data-act="'+JB_AJOUT[t][0]+'">'+icon('fa-plus')+JB_AJOUT[t][1]+'</button>').join('')+'</div>';
  h+='<div class="card"><div class="jb-stats">'+jbStats(tab[0],L)+'</div></div>';
  if(tab[0]==='couches'&&d<=10&&typeof firstWeek==='function')h+=firstWeek(st.birth);
  if(tab[0]==='croissance'){h+=typeof weightCard==='function'?weightCard(st):'';h+='<button class="btn ghost" data-act="tab" data-v="suivi" style="width:100%;margin-bottom:14px">'+icon('fa-chart-line')+'Voir la courbe de poids (Suivi)</button>'}
  else h+='<div class="card"><div class="row between"><span class="eyebrow acc">7 derniers jours</span><span class="xs muted">'+(tab[0]==='resume'?'<i class="jb-pt" style="background:var(--accent)"></i>boires <i class="jb-pt" style="background:var(--sage)"></i>couches <i class="jb-pt" style="background:#8aa0c8"></i>sommeil':'')+'</span></div>'+jbLigne(L)+'</div>';
  if(tab[0]==='resume'&&typeof weekChart==='function')h+=weekChart();
  if(tab[0]==='maman')h+=avant;
  if(tab[0]!=='resume')h+='<div class="card"><span class="eyebrow acc">Derniers jours</span>'+jbListe(L)+'</div>';
  return h};
/* le titre (âge de bébé) en premier ; le « Journal de naissance de bébé » va dans l'onglet Maman */
const _rJB=render;render=function(){const x=_rJB.apply(this,arguments);try{if(S.role==='parent'&&!S.vue&&S.tab==='journal'&&stage().k==='pp'){const app=document.getElementById('app'),tete=app.querySelector(':scope>.jb-tete');
  if(tete&&app.firstElementChild!==tete)app.prepend(tete);
  const car=[...app.querySelectorAll(':scope>.card')].filter(c=>/journal de naissance de bébé/i.test((c.querySelector('.eyebrow')||{}).textContent||''));
  car.forEach(c=>{if((S.jbTab||'repas')!=='maman')c.remove();else{const st=app.querySelector(':scope>.card .jb-stats');const ref=st&&st.closest('.card');if(ref)ref.after(c)}})}}catch(e){}return x};
document.addEventListener('click',e=>{const b=e.target.closest('[data-jb]');if(!b)return;e.stopPropagation();S.jbTab=b.dataset.jb;render();try{document.querySelector('.jb-tabs [aria-selected=true]').scrollIntoView({inline:'center',block:'nearest'})}catch(x){}},true);
(function(){const st=document.createElement('style');st.textContent=
  '.jb-tabs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:2px 2px 12px;margin:0 -2px}.jb-tabs::-webkit-scrollbar{display:none}'+
  '.jb-tabs button{flex:none;display:inline-flex;align-items:center;gap:7px;border:0;border-radius:99px;padding:9px 14px;background:var(--card);color:var(--muted);font:600 .86rem var(--f-body);box-shadow:0 1px 3px rgba(70,45,30,.08);cursor:pointer}'+
  '.jb-tabs button[aria-selected=true]{background:var(--accent);color:#fff}'+
  '.jb-ajout{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.jb-ajout .btn{flex:1 1 0;min-width:96px}'+
  '.jb-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:10px}.jb-stat{background:var(--soft);border-radius:16px;padding:10px 12px;display:flex;flex-direction:column;gap:2px}'+
  '.jb-stat b{font-size:1.25rem;font-variant-numeric:tabular-nums;color:var(--ink)}.jb-stat span{font-size:.72rem;color:var(--muted)}'+
  '.jb-ligne{display:flex;gap:6px;margin-top:6px}.jb-h{position:relative;width:38px;flex:none;margin-top:34px;font-size:.62rem;color:var(--muted)}.jb-h span{position:absolute;left:0;transform:translateY(-50%)}'+
  '.jb-cols{flex:1;min-width:0}.jb-tetes{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:.62rem;color:var(--muted);text-transform:uppercase;height:34px}.jb-tetes b{display:block;font-size:.8rem;color:var(--ink)}'+
  '.jb-grille{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 52.4px,var(--line) 52.4px,var(--line) 53px)}'+
  '.jb-col{position:relative;background:color-mix(in srgb,var(--soft) 70%,transparent);border-radius:6px}.jb-col i{position:absolute;left:2px;right:2px;border-radius:3px;opacity:.9}'+
  '.jb-pt{display:inline-block;width:9px;height:9px;border-radius:3px;margin:0 3px 0 8px;vertical-align:-1px}';
  document.head.appendChild(st)})();
})();
