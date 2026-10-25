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
/* visuel façon appli de bébé : grand chiffre (semaine / mois / ans), photo d'un bébé de cet âge et mesures moyennes (OMS, filles et garçons, 3e au 97e percentile, arrondi) */
const DV_MES=[[0,46,54,2.5,4.4],[1,50.5,58.5,3.2,5.6],[2,54,62,4,6.9],[3,57,65,4.6,7.8],[4,59,67.5,5,8.5],[5,61,69.5,5.4,9.1],[6,62.5,71.5,5.7,9.5],[7,64,73,6,9.9],[8,65.5,74.5,6.3,10.3],[9,66.5,76,6.5,10.6],[10,68,77.5,6.7,10.9],[11,69,78.5,6.9,11.2],[12,70,80,7,11.5],[15,73,83.5,7.6,12.3],[18,76,87,8.1,13],[21,78.5,90,8.6,13.7],[24,81,92.5,9,14.3],[30,85,97.5,10,15.5],[36,88.5,102,10.8,16.9],[42,92,106,11.6,18.2],[48,95,110,12.2,19.5],[54,98,113,12.9,20.8],[60,100,116,13.7,22]];
function dvMes(d){const m=d/30.44;let r=DV_MES[0];DV_MES.forEach(x=>{if(m>=x[0]-.25)r=x});return r}
/* photos de bébés libres de droits (Unsplash), une par âge ; une photo locale img/dev/<clé>.jpg peut les remplacer */
/* une photo différente pour chaque période de la bande (12 semaines, puis mois et années) : photos libres de droits Unsplash */
const DV_PH=["photo-1662670629059-4772ec99b720", "photo-1679919996303-1824ae520235", "photo-1596034640116-a68045d257fe", "photo-1583007054045-800d870b8249", "photo-1610901137736-d7cc46657b11", "photo-1582486225644-aeacf6aa0b1b", "photo-1608039649006-df579ad70c64", "photo-1780965101452-5b1d929e26e9", "photo-1629368337026-ff53d3975c6d", "photo-1533483595632-c5f0e57a1936", "photo-1608365151231-7dbed3034787", "photo-1649880210584-3365f4c4c08b", "photo-1617331140180-e8262094733a", "photo-1552788960-65fcafe071a5", "photo-1578668577946-2f84638d344f", "photo-1550831858-3c2581fed470", "photo-1697751228979-ca968ceabe02", "photo-1503284116362-30c49f508156", "photo-1697751228877-9c430a90dc7a", "photo-1495131292899-bc096577e8f5", "photo-1526864972308-bf02b0c2ab8c", "photo-1608093602519-ccd31f515f83", "photo-1476089194965-888edb96d2dc", "photo-1507077630565-b23bbbe732ec", "photo-1512846947153-55eb89716f77", "flagged/photo-1556776124-2f0ebdaef26b", "photo-1574704530833-d47190a0d92f", "photo-1560130958-0ea787c275de", "photo-1501686637-b7aa9c48a882", "flagged/photo-1572818640942-05bbb70c9089", "photo-1544773088-d142e38f5793"];
function dvPhotoUrl(k){return 'https://images.unsplash.com/'+DV_PH[Math.max(0,Math.min(DV_PH.length-1,k))]+'?w=640&h=640&fit=crop&crop=faces,entropy&auto=format&q=70'}
function dvPhoto(d){const m=d/30.44;return d<14?'nouveau-ne':d<28?'sem-3-4':d<56?'sem-5-8':d<84?'sem-9-12':m<6?'4-5-mois':m<8?'6-7-mois':m<10?'8-9-mois':m<12?'10-11-mois':m<15?'1-an':m<21?'15-18-mois':m<30?'21-24-mois':m<42?'2-3-ans':m<54?'3-4-ans':'4-5-ans'}
function dvVisuel(P,avecNum,ic,etat){const mid=Math.round((P.d0+P.d1)/2),M=dvMes(mid),c=x=>String(x).replace('.',','),k=DV.indexOf(P),st=stage();
  const f=x=>x.toLocaleDateString('fr-CA',{day:'numeric',month:'short',year:P.d0>300?'numeric':undefined}),E=dvPer(mid)||{};
  return (avecNum?'<div class="dvx-num"><i></i><div><b>'+P.lab+'</b><span>'+P.u+'</span></div><i></i></div>':'')+
    '<div class="dvx-row"><div class="dvx-img"><span>'+(ic||'🌱')+'</span><img src="'+dvPhotoUrl(k)+'" alt="" loading="lazy" onerror="if(this.nextSibling)this.nextSibling.remove();this.remove()"><small>Photo : Unsplash</small></div>'+
    '<div class="dvx-mes"><span class="eyebrow">'+(etat||'')+'</span><b class="dvx-t">'+P.t+'</b><span class="dvx-d">du '+f(addD(st.birth,P.d0))+' au '+f(addD(st.birth,P.d1))+'</span>'+
    '<div class="dvx-m"><small>Taille moyenne</small><b>'+c(M[1])+'–'+c(M[2])+' cm</b></div><div class="dvx-m"><small>Poids moyen</small><b>'+c(M[3])+'–'+c(M[4])+' kg</b></div>'+(E.t?'<span class="pill acc dvx-p">'+E.t+'</span>':'')+'</div></div>'}
function dvPage(dansSuivi){const st=stage();if(st.k!=='pp')return '';const nom=esc(((S.parent.naissance||{}).prenomBebe||'').trim()||'Bébé'),cur=dvIndex(st.day);
  const i=S.devSel==null?cur:Math.max(0,Math.min(DV.length-1,S.devSel)),P=DV[i],mid=Math.round((P.d0+P.d1)/2),I=dvInfoPP(P.d0)||[],E=dvPer(mid)||{};
  const deb=addD(st.birth,P.d0),fin=addD(st.birth,P.d1),f=x=>x.toLocaleDateString('fr-CA',{day:'numeric',month:'short',year:P.d0>300?'numeric':undefined});
  const ph=S.parent.photoBebe;
  let h=dansSuivi?'':back('sub','','Suivi')+'<div class="sh"><span class="eyebrow acc">De la naissance à 5 ans</span><h1>Développement</h1></div>';
  h+='<div class="dv-bande" role="tablist">'+DV.map((p,k)=>'<button role="tab" data-dv="'+k+'" aria-selected="'+(k===i)+'"'+(k===cur?' class="actu"':'')+'><b>'+p.lab+'</b><span>'+p.u+'</span></button>').join('')+'</div>';
  h+=dvVisuel(P,false,E.ic,i===cur?'Maintenant':i<cur?'Déjà passé':'À venir');
  const R=(window.DV_RICHE||[])[i]||null;
  if(I[2])h+='<div class="card"><h2>'+esc(I[2])+'</h2><h3 class="dv-h">'+icon('fa-baby')+' '+nom+'</h3><p>'+I[3]+'</p>'+(I[4]&&!(R&&R.vous)?'<h3 class="dv-h">'+icon('fa-spa')+' Vous</h3><p>'+I[4]+'</p>':'')+(I[5]?'<div class="banner sage">'+icon('fa-lightbulb')+'<div class="small"><b>Ce que disent les études :</b> '+I[5]+'</div></div>':'')+'</div>';
  if(E.ph)h+='<div class="card"><h3 class="dv-h">'+icon('fa-star')+' Ce qu\'il apprend vers cet âge</h3><ul class="clean dv-l">'+E.ph.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p class="xs muted">Des repères, pas des examens : chaque enfant va à son rythme.</p></div>';
  if(R){const T=[['repas',i<14?'🍼 Boires et couches':'🍽️ Les repas'],['sommeil','🌙 Le sommeil'],['soins','🛁 Les soins au quotidien'],['eveil','🧸 Jouer ensemble'],['sante','🩺 Sa santé : quand appeler'],['vous','💛 Pour vous'],['prevoir','📅 À prévoir'],['astuce','✨ Astuce de parent']];
    h+=T.filter(t=>R[t[0]]).map(t=>'<div class="card dv-r dv-r-'+t[0]+'"><h3 class="dv-rt">'+t[1]+'</h3><p>'+R[t[0]]+'</p>'+(t[0]==='sante'?'<p class="xs muted" style="margin:6px 0 0">Info-Santé 811 · Urgence 911</p>':'')+'</div>').join('')}
  if(E.tips&&!(R&&R.eveil))h+='<div class="card"><h3 class="dv-h">'+icon('fa-hand-holding-heart')+' Comment l\'accompagner</h3><ul class="clean dv-l">'+E.tips.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>';
  if(E.watch)h+='<div class="card"><h3 class="dv-h">'+icon('fa-circle-exclamation')+' À en parler avec votre professionnel si…</h3><ul class="clean dv-l">'+E.watch.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p class="xs muted">Une perte d\'habiletés à tout âge, ou une inquiétude : parlez-en sans attendre.</p></div>';
  if(E.src)h+='<p class="xs muted" style="margin:0 4px 14px">Sources : '+E.src.map(s=>'<a href="'+s[1]+'" target="_blank" rel="noopener">'+esc(s[0])+'</a>').join(' · ')+'</p>';
  h+='<div class="row between" style="margin-bottom:14px">'+(i>0?'<button class="btn ghost" data-dv="'+(i-1)+'">'+icon('fa-chevron-left')+DV[i-1].t+'</button>':'<span></span>')+(i<DV.length-1?'<button class="btn ghost" data-dv="'+(i+1)+'">'+DV[i+1].t+icon('fa-chevron-right')+'</button>':'')+'</div>';
  return h}
/* Suivi après la naissance : seulement la carte de la semaine (ce que bébé pourrait faire en ce moment) et les vaccins */
function dvAge(st){const d=Math.max(0,st.day|0),B=new Date(st.birth),N=new Date();let m=(N.getFullYear()-B.getFullYear())*12+N.getMonth()-B.getMonth();if(N.getDate()<B.getDate())m--;m=Math.max(0,m);
  const pl=(x,u,us)=>x+' '+(x>1?us:u);if(d<7)return pl(d,'jour','jours');if(d<91)return pl(Math.floor(d/7),'semaine','semaines')+(d%7?' et '+pl(d%7,'jour','jours'):'');
  if(m<24){const r=new Date(B);r.setMonth(B.getMonth()+m);const w=Math.floor((N-r)/864e5/7);return m+' mois'+(w?' et '+pl(w,'semaine','semaines'):'')}return pl(Math.floor(m/12),'an','ans')+(m%12?' et '+m%12+' mois':'')}
function dvSuivi(st){const nom=esc(((S.parent.naissance||{}).prenomBebe||'').trim()||'Bébé'),fille=/^f/i.test((S.parent.naissance||{}).sexe||'');
  const ttl=st.day<1?nom+' est arrivé'+(fille?'e':'')+' aujourd\'hui 🩷':nom+' a '+dvAge(st);
  return '<div class="sh"><span class="eyebrow acc">Développement de '+nom+'</span><h1>'+ttl+'</h1></div>'+dvPage(true)+(window.bbVaccins?window.bbVaccins(st):'')}
document.addEventListener('click',e=>{if(e.target.closest('#tabs [data-v="suivi"]'))S.devSel=null},true);
if(typeof pSuivi==='function'){const _ps=pSuivi;pSuivi=function(){if(S.sub==='dev')return dvPage();try{const st=stage();if(st.k==='pp'&&!S.sub)return dvSuivi(st)}catch(e){}return _ps.apply(this,arguments)}}
document.addEventListener('click',e=>{const g=e.target.closest('[data-dvgo]');if(g){e.stopPropagation();S.vue=null;S.tab='suivi';S.sub='dev';S.devSel=null;scrollTo(0,0);render();dvCentrer();return}
  const b=e.target.closest('[data-dv]');if(!b)return;e.stopPropagation();S.devSel=+b.dataset.dv;render();dvCentrer()},true);
function dvCentrer(){setTimeout(()=>{try{const s=document.querySelector('.dv-bande [aria-selected=true]');if(s){const b=s.parentElement;b.scrollLeft=s.offsetLeft-(b.clientWidth-s.offsetWidth)/2}}catch(e){}},30)}
const _rDV=render;render=function(){const x=_rDV.apply(this,arguments);try{if(S.tab==='suivi'&&(S.sub==='dev'||!S.sub)&&document.querySelector('.dv-bande')&&!document.querySelector('.dv-bande').dataset.c){document.querySelector('.dv-bande').dataset.c='1';dvCentrer()}}catch(e){}return x};
(function(){const st=document.createElement('style');st.textContent=
  '.dv-bande{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:4px 2px 14px;scroll-snap-type:x proximity}.dv-bande::-webkit-scrollbar{display:none}'+
  '.dv-bande button{flex:none;min-width:62px;scroll-snap-align:center;display:flex;flex-direction:column;align-items:center;gap:0;border:0;border-radius:16px;padding:8px 10px;background:var(--card);color:var(--muted);box-shadow:0 1px 3px rgba(70,45,30,.08);cursor:pointer;position:relative}'+
  '.dv-bande b{font-size:1.15rem;color:var(--ink);line-height:1.2}.dv-bande span{font-size:.62rem;text-transform:uppercase;letter-spacing:.06em}'+
  '.dv-bande button.actu::after{content:"";position:absolute;bottom:5px;left:50%;width:5px;height:5px;margin-left:-2.5px;border-radius:50%;background:var(--sage)}'+
  '.dv-bande button[aria-selected=true]{background:var(--accent);color:#fff}.dv-bande button[aria-selected=true] b{color:#fff}'+
  '.li .tx .pill{white-space:normal;display:inline-block;max-width:100%;margin-top:4px;line-height:1.3;text-align:left}'+
  '.dv-rt{font-family:var(--f-body);font-size:1.02rem;margin:0 0 6px;color:var(--ink)}.dv-r p{margin:0;line-height:1.6}.dv-r-sante{border-left:4px solid #d98a6a}.dv-r-astuce{background:var(--soft)}'+
  '.dvx-num{display:flex;align-items:center;gap:14px;margin:0 0 14px}.dvx-num i{flex:1;height:2px;background:var(--accent);opacity:.35;border-radius:2px}.dvx-num div{display:flex;flex-direction:column;align-items:center;line-height:1}.dvx-num b{font-size:1.5rem;color:var(--accent);font-weight:700}.dvx-num span{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-top:4px}'+
  '.dvx-row{display:grid;grid-template-columns:1.1fr 1fr;gap:12px;margin-bottom:14px}.dvx-img{position:relative;aspect-ratio:3/4;border-radius:22px;overflow:hidden;background:linear-gradient(150deg,#f6e3d8,#e8cdbf);display:grid;place-items:center;font-size:3.2rem}.dvx-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.dvx-img small{position:absolute;right:8px;bottom:6px;font-size:.55rem;color:#fff;opacity:.75;text-shadow:0 1px 3px rgba(0,0,0,.5)}'+
  '.dvx-mes{display:flex;flex-direction:column;justify-content:center;gap:4px;padding:14px;border-radius:22px;background:var(--card);box-shadow:var(--shadow);min-width:0}.dvx-t{font-family:var(--f-display);font-size:1.3rem;line-height:1.15}.dvx-d{font-size:.8rem;color:var(--muted);margin-bottom:6px}'+
  '.dvx-m{display:flex;flex-direction:column;padding:6px 0;border-top:1px solid var(--line)}.dvx-m small{font-size:.68rem;color:var(--muted)}.dvx-m b{font-size:.92rem}.dvx-p{align-self:flex-start;margin-top:6px;font-size:.7rem;white-space:normal;max-width:100%;line-height:1.3}'+
  '.dv-quand{font-size:.82rem;color:var(--muted);margin:-4px 2px 14px}.dv-quand b{color:var(--ink)}'+
  '.dvs-haut{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:stretch;margin-bottom:12px}.dvs-num{display:flex;flex-direction:column;justify-content:center;align-items:center;min-width:96px;border-radius:20px;background:var(--accent);color:#fff;padding:12px}.dvs-num span{font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;opacity:.9}.dvs-num b{font-size:3rem;line-height:1;font-family:var(--f-display)}'+
  '.dvs-img{border-radius:20px;overflow:hidden;min-height:120px;max-height:170px;background:linear-gradient(150deg,#f6e3d8,#e8cdbf);display:grid;place-items:center;font-size:3rem}.dvs-img img{width:100%;height:100%;object-fit:cover}'+
  '.dv-haut{display:grid;grid-template-columns:1.1fr 1fr;gap:12px;margin-bottom:14px}.dv-img{aspect-ratio:1;border-radius:22px;overflow:hidden;background:linear-gradient(150deg,#f6e3d8,#e8cdbf);display:grid;place-items:center;font-size:3.4rem}'+
  '.dv-img img{width:100%;height:100%;object-fit:cover}.dv-info{background:var(--card);border-radius:22px;padding:14px;display:flex;flex-direction:column;gap:6px;justify-content:center;box-shadow:var(--shadow)}.dv-info b{font-family:var(--f-display);font-size:1.35rem}'+
  '.dv-h{display:flex;align-items:center;gap:8px;font-family:var(--f-body);font-size:1rem;margin:4px 0 2px;color:var(--accent)}.dv-l{list-style:none;padding-left:0;margin-left:0}.dv-l li{padding:5px 0 5px 20px;position:relative;list-style:none}.dv-l li::before{content:"";position:absolute;left:4px;top:13px;width:7px;height:7px;border-radius:50%;background:var(--accent-lt,#f2c9b9)}';
  document.head.appendChild(st)})();
/* Accueil après la naissance : un court résumé de la semaine (le détail complet est dans Suivi) */
if(typeof carteBebePP==='function')carteBebePP=function(day){try{const I=dvInfoPP(day)||[],nom=esc(((S.parent.naissance||{}).prenomBebe||'').trim()||'Bébé'),sem=Math.floor(day/7)+1;
  const txt=String(I[3]||''),un=(txt.match(/^.*?[.!?](\s|$)/)||[txt])[0].trim();
  return '<div class="card bebe-carte dv-resume" data-dvsu="1" role="button" tabindex="0"><div class="row between"><span class="eyebrow acc">'+nom+' · '+(day<84?'semaine '+sem+' de vie':esc(I[2]||''))+'</span>'+icon('fa-chevron-right')+'</div>'+
    '<h3 style="margin:6px 0 4px">'+esc(I[2]||'')+'</h3><p class="small" style="margin:0">'+un+'</p><p class="xs" style="margin:8px 0 0;color:var(--accent);font-weight:600">Tout savoir sur cette semaine dans Suivi</p></div>'}catch(e){return ''}};
document.addEventListener('click',e=>{if(!e.target.closest('[data-dvsu]'))return;e.stopPropagation();S.vue=null;S.tab='suivi';S.sub='';S.devSel=null;scrollTo(0,0);render()},true);
window.dvOuvrir=()=>{S.vue=null;S.tab='suivi';S.sub='dev';S.devSel=null;scrollTo(0,0);render();dvCentrer()};
})();
