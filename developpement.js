/* Sérénaissance — page « Développement » (famille), de la naissance à 5 ans, inspirée des applis de bébé :
   une barre de périodes à faire défiler (semaines 1 à 12, puis mois, puis années), la période actuelle choisie
   d'avance, et pour chaque période : bébé, ce qu'il apprend, comment l'aider, vous, ce que disent les études, à surveiller. */
(function(){
if(window.ESPACE!=='parent')return;
const DV=[];for(let w=1;w<=12;w++)DV.push({d0:(w-1)*7,d1:w*7-1,lab:String(w),u:w>1?'semaines':'semaine',t:'Semaine '+w});
[[4,'4 mois'],[5,'5 mois'],[6,'6 mois'],[7,'7 mois'],[8,'8 mois'],[9,'9 mois'],[10,'10 mois'],[11,'11 mois'],[12,'1 an'],[15,'15 mois'],[18,'18 mois'],[21,'21 mois'],[24,'2 ans'],[30,'2 ans ½'],[36,'3 ans'],[42,'3 ans ½'],[48,'4 ans'],[54,'4 ans ½'],[60,'5 ans']]
  .forEach(([m,t],i,A)=>{const d0=i===0?84:Math.round(m*30.44),nx=A[i+1];DV.push({d0,d1:nx?Math.round(nx[0]*30.44)-1:1830,lab:t.replace(/ (mois|ans?).*/,''),u:/an/.test(t)?(t.includes('½')?'ans ½':(m>=24?'ans':'an')):'mois',t})});
function dvIndex(day){const i=DV.findIndex(p=>day>=p.d0&&day<=p.d1);return i<0?(day<0?0:DV.length-1):i}
function dvInfoPP(d){try{return (typeof BEBE_PP!=='undefined'&&BEBE_PP.find(x=>d>=x[0]&&d<=x[1]))||BEBE_PP[BEBE_PP.length-1]}catch(e){return null}}
function dvPer(d){try{const P=window.bbPER||[];return P.find(x=>d<=x.max)||P[P.length-1]||null}catch(e){return null}}
function dvPage(){const st=stage();if(st.k!=='pp')return '';const nom=esc(((S.parent.naissance||{}).prenomBebe||'').trim()||'Bébé'),cur=dvIndex(st.day);
  const i=S.devSel==null?cur:Math.max(0,Math.min(DV.length-1,S.devSel)),P=DV[i],mid=Math.round((P.d0+P.d1)/2),I=dvInfoPP(P.d0)||[],E=dvPer(mid)||{};
  const deb=addD(st.birth,P.d0),fin=addD(st.birth,P.d1),f=x=>x.toLocaleDateString('fr-CA',{day:'numeric',month:'short',year:P.d0>300?'numeric':undefined});
  const ph=S.parent.photoBebe;
  let h=back('sub','','Suivi')+'<div class="sh"><span class="eyebrow acc">De la naissance à 5 ans</span><h1>Développement</h1></div>';
  h+='<div class="dv-bande" role="tablist">'+DV.map((p,k)=>'<button role="tab" data-dv="'+k+'" aria-selected="'+(k===i)+'"'+(k===cur?' class="actu"':'')+'><b>'+p.lab+'</b><span>'+p.u+'</span></button>').join('')+'</div>';
  h+='<div class="dv-haut"><div class="dv-img'+(ph?' ph':'')+'">'+(ph?'<img src="'+esc(ph)+'" alt="">':'<span>'+(E.ic||'🌱')+'</span>')+'</div>'+
    '<div class="dv-info"><span class="eyebrow">'+(k=>k===cur?'Maintenant':k<cur?'Déjà passé':'À venir')(i)+'</span><b>'+P.t+'</b><span class="small muted">du '+f(deb)+' au '+f(fin)+'</span>'+(E.t?'<span class="pill acc">'+E.t+'</span>':'')+'</div></div>';
  if(I[2])h+='<div class="card"><h2>'+esc(I[2])+'</h2><h3 class="dv-h">'+icon('fa-baby')+' '+nom+'</h3><p>'+I[3]+'</p>'+(I[4]?'<h3 class="dv-h">'+icon('fa-spa')+' Vous</h3><p>'+I[4]+'</p>':'')+(I[5]?'<div class="banner sage">'+icon('fa-lightbulb')+'<div class="small"><b>Ce que disent les études :</b> '+I[5]+'</div></div>':'')+'</div>';
  if(E.ph)h+='<div class="card"><h3 class="dv-h">'+icon('fa-star')+' Ce qu\'il apprend vers cet âge</h3><ul class="clean dv-l">'+E.ph.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p class="xs muted">Des repères, pas des examens : chaque enfant va à son rythme.</p></div>';
  if(E.tips)h+='<div class="card"><h3 class="dv-h">'+icon('fa-hand-holding-heart')+' Comment l\'accompagner</h3><ul class="clean dv-l">'+E.tips.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>';
  if(E.watch)h+='<div class="card"><h3 class="dv-h">'+icon('fa-circle-exclamation')+' À en parler avec votre professionnel si…</h3><ul class="clean dv-l">'+E.watch.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p class="xs muted">Une perte d\'habiletés à tout âge, ou une inquiétude : parlez-en sans attendre.</p></div>';
  if(E.src)h+='<p class="xs muted" style="margin:0 4px 14px">Sources : '+E.src.map(s=>'<a href="'+s[1]+'" target="_blank" rel="noopener">'+esc(s[0])+'</a>').join(' · ')+'</p>';
  h+='<div class="row between" style="margin-bottom:14px">'+(i>0?'<button class="btn ghost" data-dv="'+(i-1)+'">'+icon('fa-chevron-left')+DV[i-1].t+'</button>':'<span></span>')+(i<DV.length-1?'<button class="btn ghost" data-dv="'+(i+1)+'">'+DV[i+1].t+icon('fa-chevron-right')+'</button>':'')+'</div>';
  return h}
/* Suivi après la naissance : seulement la carte de la semaine (ce que bébé pourrait faire en ce moment) et les vaccins */
function dvAge(st){const d=Math.max(0,st.day|0),B=new Date(st.birth),N=new Date();let m=(N.getFullYear()-B.getFullYear())*12+N.getMonth()-B.getMonth();if(N.getDate()<B.getDate())m--;m=Math.max(0,m);
  const pl=(x,u,us)=>x+' '+(x>1?us:u);if(d<7)return pl(d,'jour','jours');if(d<91)return pl(Math.floor(d/7),'semaine','semaines')+(d%7?' et '+pl(d%7,'jour','jours'):'');
  if(m<24){const r=new Date(B);r.setMonth(B.getMonth()+m);const w=Math.floor((N-r)/864e5/7);return m+' mois'+(w?' et '+pl(w,'semaine','semaines'):'')}return pl(Math.floor(m/12),'an','ans')+(m%12?' et '+m%12+' mois':'')}
function dvSuivi(st){const nom=esc(((S.parent.naissance||{}).prenomBebe||'').trim()||'Bébé'),cur=dvIndex(st.day),P=DV[cur],I=dvInfoPP(st.day)||[],E=dvPer(st.day)||{},ph=S.parent.photoBebe;
  const f=x=>x.toLocaleDateString('fr-CA',{day:'numeric',month:'long'}),deb=addD(st.birth,P.d0),fin=addD(st.birth,P.d1),wk=Math.floor(Math.max(0,st.day)/7)+1;
  const gros=st.day<84?['Semaine',wk]:st.day<730?['Mois',Math.floor(st.day/30.44)]:['Ans',Math.floor(st.day/365.25)];
  let h='<div class="sh"><span class="eyebrow acc">Suivi de '+nom+'</span><h1>'+nom+' a '+dvAge(st)+'</h1></div>';
  h+='<div class="card dvs-sem"><div class="dvs-haut"><div class="dvs-num"><span>'+gros[0]+'</span><b>'+gros[1]+'</b></div><div class="dvs-img'+(ph?' ph':'')+'">'+(ph?'<img src="'+esc(ph)+'" alt="">':'<span>'+(E.ic||'🌱')+'</span>')+'</div></div>'+
    '<span class="eyebrow">'+P.t+' · du '+f(deb)+' au '+f(fin)+'</span>'+(I[2]?'<h2 style="margin:4px 0 6px">'+esc(I[2])+'</h2>':'')+(I[3]?'<p>'+I[3]+'</p>':'')+
    (E.ph&&E.ph.length?'<h3 class="dv-h">'+icon('fa-star')+' Ce que '+nom+' pourrait faire en ce moment</h3><ul class="clean dv-l">'+E.ph.slice(0,4).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'')+
    '<p class="xs muted">Des repères, pas des examens : chaque bébé va à son rythme.</p>'+
    '<button class="btn" data-dvgo="1" style="width:100%">'+icon('fa-book-open')+'Lire la suite</button></div>';
  return h+(window.bbVaccins?window.bbVaccins(st):'')}
if(typeof pSuivi==='function'){const _ps=pSuivi;pSuivi=function(){if(S.sub==='dev')return dvPage();try{const st=stage();if(st.k==='pp'&&!S.sub)return dvSuivi(st)}catch(e){}return _ps.apply(this,arguments)}}
document.addEventListener('click',e=>{const g=e.target.closest('[data-dvgo]');if(g){e.stopPropagation();S.vue=null;S.tab='suivi';S.sub='dev';S.devSel=null;scrollTo(0,0);render();dvCentrer();return}
  const b=e.target.closest('[data-dv]');if(!b)return;e.stopPropagation();S.devSel=+b.dataset.dv;render();dvCentrer()},true);
function dvCentrer(){setTimeout(()=>{try{const s=document.querySelector('.dv-bande [aria-selected=true]');if(s)s.scrollIntoView({inline:'center',block:'nearest'})}catch(e){}},30)}
const _rDV=render;render=function(){const x=_rDV.apply(this,arguments);try{if(S.tab==='suivi'&&S.sub==='dev'&&!document.querySelector('.dv-bande').dataset.c){document.querySelector('.dv-bande').dataset.c='1';dvCentrer()}}catch(e){}return x};
(function(){const st=document.createElement('style');st.textContent=
  '.dv-bande{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:4px 2px 14px;scroll-snap-type:x proximity}.dv-bande::-webkit-scrollbar{display:none}'+
  '.dv-bande button{flex:none;min-width:62px;scroll-snap-align:center;display:flex;flex-direction:column;align-items:center;gap:0;border:0;border-radius:16px;padding:8px 10px;background:var(--card);color:var(--muted);box-shadow:0 1px 3px rgba(70,45,30,.08);cursor:pointer;position:relative}'+
  '.dv-bande b{font-size:1.15rem;color:var(--ink);line-height:1.2}.dv-bande span{font-size:.62rem;text-transform:uppercase;letter-spacing:.06em}'+
  '.dv-bande button.actu::after{content:"";position:absolute;bottom:5px;left:50%;width:5px;height:5px;margin-left:-2.5px;border-radius:50%;background:var(--sage)}'+
  '.dv-bande button[aria-selected=true]{background:var(--accent);color:#fff}.dv-bande button[aria-selected=true] b{color:#fff}'+
  '.li .tx .pill{white-space:normal;display:inline-block;max-width:100%;margin-top:4px;line-height:1.3;text-align:left}'+
  '.dvs-haut{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:stretch;margin-bottom:12px}.dvs-num{display:flex;flex-direction:column;justify-content:center;align-items:center;min-width:96px;border-radius:20px;background:var(--accent);color:#fff;padding:12px}.dvs-num span{font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;opacity:.9}.dvs-num b{font-size:3rem;line-height:1;font-family:var(--f-display)}'+
  '.dvs-img{border-radius:20px;overflow:hidden;min-height:120px;max-height:170px;background:linear-gradient(150deg,#f6e3d8,#e8cdbf);display:grid;place-items:center;font-size:3rem}.dvs-img img{width:100%;height:100%;object-fit:cover}'+
  '.dv-haut{display:grid;grid-template-columns:1.1fr 1fr;gap:12px;margin-bottom:14px}.dv-img{aspect-ratio:1;border-radius:22px;overflow:hidden;background:linear-gradient(150deg,#f6e3d8,#e8cdbf);display:grid;place-items:center;font-size:3.4rem}'+
  '.dv-img img{width:100%;height:100%;object-fit:cover}.dv-info{background:var(--card);border-radius:22px;padding:14px;display:flex;flex-direction:column;gap:6px;justify-content:center;box-shadow:var(--shadow)}.dv-info b{font-family:var(--f-display);font-size:1.35rem}'+
  '.dv-h{display:flex;align-items:center;gap:8px;font-family:var(--f-body);font-size:1rem;margin:4px 0 2px;color:var(--accent)}.dv-l{list-style:none;padding-left:0;margin-left:0}.dv-l li{padding:5px 0 5px 20px;position:relative;list-style:none}.dv-l li::before{content:"";position:absolute;left:4px;top:13px;width:7px;height:7px;border-radius:50%;background:var(--accent-lt,#f2c9b9)}';
  document.head.appendChild(st)})();
window.dvOuvrir=()=>{S.vue=null;S.tab='suivi';S.sub='dev';S.devSel=null;scrollTo(0,0);render();dvCentrer()};
})();
