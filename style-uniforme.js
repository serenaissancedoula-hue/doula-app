/* Sérénaissance — même allure partout dans l'espace famille : fertilité (repères du jour), bébé né (étape par étape),
   journaux (grossesse et naissance) avec des boutons de couleurs douces. On garde tout ce qui existe (chat, Fil, salons, journaux) :
   on ajuste seulement l'apparence et on ajoute quelques repères. */
(function(){
if(window.ESPACE!=='parent')return;
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const prenomB=()=>{try{return ((S.parent.naissance||{}).prenomBebe||'').trim()}catch(e){return ''}};
const stg=()=>{try{return stage()}catch(e){return {k:'none'}}};

/* ---------- fertilité : « Noter aujourd'hui » ---------- */
const FT=[['regles','Début de mes règles','🩸','#fde8e0'],['rapport','Rapport','❤️','#fbe0e6'],['ovul','Test d\'ovulation','🧪','#e6eefc'],['temp','Température','🌡️','#fdf3d6'],['symp','Mes symptômes','✨','#f3e6f6'],['testg','Test de grossesse','🤰','#e3f3e6']];
function insightsFT(){return '<div class="gr-insw gr-insft"><div class="gr-ins-h">Noter aujourd\'hui</div><div class="gr-ins-row">'+
  FT.map(c=>'<button class="gr-ins" data-ft-add="'+c[0]+'" style="background:'+c[3]+'"><small>'+c[1]+'</small><span>'+c[2]+'</span><i>+</i></button>').join('')+'</div></div>'}

/* ---------- bébé né : étape par étape ---------- */
const EMO=['👶','🍼','🌙','👀','😊','🤲','🪑','🧸','🚼','🦶','🗣️','🚶','🎈','🧩'];
function etapes(){try{return BEBE_PP}catch(e){return []}}
function courante(day){const L=etapes();let k=L.findIndex(x=>day>=x[0]&&day<=x[1]);return k<0?L.length-1:k}
function friseEtapes(day){const L=etapes();if(!L.length)return '';const c=courante(day);
  return '<div class="card gr-fr gr-frpp"><div class="row between"><span class="eyebrow acc">Étape par étape</span><span class="xs muted">Glissez pour explorer</span></div><div class="gr-strip">'+
   L.map((x,i)=>'<button class="gr-w gr-et'+(i===c?' on':'')+(i<c?' pas':'')+'" data-su="etape" data-i="'+i+'"><i>'+EMO[i%EMO.length]+'</i><b>'+E(x[2])+'</b></button>').join('')+'</div></div>'}
function nom(t){const n=prenomB();return n?String(t).replace(/(^|[.!?] )Bébé /g,'$1'+n+' '):t}
function feuilleEtape(i){const L=etapes(),x=L[i];if(!x)return;const c=(()=>{const st=stg();return st.k==='pp'?courante(st.day):-1})();const n=prenomB()||'Bébé';
  const par=t=>'<p class="gr-p">'+E(nom(t))+'</p>';
  let sel='<div class="gr-selw"><div class="gr-selr" id="suSel">'+L.map((y,k)=>'<button class="gr-sel gr-selt'+(k===i?' on':'')+'" data-su="etape" data-i="'+k+'">'+E(y[2])+'</button>').join('')+'</div></div>';
  sheet(E(x[2]),sel+'<div class="gr-sem">'+(c===i?'<p class="xs muted" style="margin:0">C\'est l\'étape de '+E(n)+' en ce moment</p>':'')+
   '<h3 class="gr-h">'+E(n)+' à cette étape</h3>'+par(x[3])+
   (x[4]?'<h3 class="gr-h">Vous à cette étape</h3>'+par(x[4]):'')+
   (x[5]?'<div class="banner sage" style="margin:6px 0 0"><div class="small"><b>Petit conseil :</b> '+E(nom(x[5]))+'</div></div>':'')+
   (()=>{const a=x[0]/30.44,b=x[1]/30.44,J=(window.JALONS||[]).filter(j=>j[2]<=b+0.01&&j[3]>=a);return J.length?'<h3 class="gr-h">À cet âge, souvent</h3><ul class="gr-ul">'+J.map(j=>'<li>'+j[0]+' '+E(nom(j[1]))+' <small class="muted">('+fmt(j[2])+' à '+fmt(j[3])+')</small></li>').join('')+'</ul><button class="btn sm ghost" data-su="regle">📏 Voir la règle du développement</button>':''})()+
   (()=>{const P=(window.ETAPE_PLUS||[])[i];return P?'<div class="gr-sav">💡 <b>Le saviez-vous ?</b> '+E(nom(P[0]))+'</div>'+(P[1]?'<div class="gr-dem">🗣️ <b>À demander à mon équipe :</b> '+E(P[1])+'</div>':''):''})()+
   '<p class="xs muted" style="margin:10px 0 0">Information générale : chaque bébé a son rythme. En cas de doute, parlez-en à votre professionnel de la santé ou appelez le 811 (France : 15).</p></div>');
  setTimeout(()=>{const s=document.getElementById('suSel'),o=s&&s.querySelector('.on');if(s&&o)s.scrollLeft=o.offsetLeft-s.clientWidth/2+o.offsetWidth/2},30)}

/* ---------- journal de grossesse : ma semaine en un coup d'œil ---------- */
function resumeJournal(){const t0=Date.now()-7*864e5,L=(S.logs||[]).filter(l=>l.t>t0),n=ty=>L.filter(l=>ty.includes(l.type)).length;
  const T=[['🩺','Symptômes',n(['symptome']),'#e3f3e6'],['😊','Humeurs',n(['humeur']),'#fdf3d6'],['👣','Mouvements',n(['mvt']),'#fde8e0'],['📝','Notes',n(['note']),'#f3e6f6']];
  return '<div class="gr-insw"><div class="gr-ins-h">Ma semaine en un coup d\'œil</div><div class="su-res">'+T.map(x=>'<div style="background:'+x[3]+'"><span>'+x[0]+'</span><b>'+x[2]+'</b><small>'+x[1]+'</small></div>').join('')+'</div></div>'}


/* ---------- fertilité : mon cycle en 5 phases ---------- */
const PH_MAP={regles:'regles',avant:'avant',fenetre:'fenetre',ovul:'fenetre',lh:'fenetre',attente:'attente',test:'test'};
function phaseCourante(){try{const el=document.querySelector('[class*="ft-mom-"]');if(!el)return -1;const m=(el.className.match(/ft-mom-(\w+)/)||[])[1];const k=PH_MAP[m]||'avant';return (window.PHASES_FT||[]).findIndex(x=>x.k===k)}catch(e){return -1}}
function friseCycle(){const L=window.PHASES_FT||[];if(!L.length)return '';const c=phaseCourante();
  return '<div class="card gr-fr gr-frft"><div class="row between"><span class="eyebrow acc">Mon cycle en 5 phases</span><span class="xs muted">Touchez pour comprendre</span></div><div class="gr-strip">'+
   L.map((x,i)=>'<button class="gr-w gr-et'+(i===c?' on':'')+(c>=0&&i<c?' pas':'')+'" data-su="phase" data-i="'+i+'"><i>'+x.ic+'</i><b>'+E(x.court)+'</b></button>').join('')+'</div></div>'}
function feuillePhase(i){const L=window.PHASES_FT||[],x=L[i];if(!x)return;const c=phaseCourante();
  const li=a=>'<ul class="gr-ul">'+a.map(t=>'<li>'+E(t)+'</li>').join('')+'</ul>';
  const sel='<div class="gr-selw"><div class="gr-selr" id="suSel">'+L.map((y,k)=>'<button class="gr-sel gr-selt'+(k===i?' on':'')+'" data-su="phase" data-i="'+k+'">'+y.ic+' '+E(y.court)+'</button>').join('')+'</div></div>';
  sheet(E(x.t),sel+'<div class="gr-sem">'+(c===i?'<p class="xs muted" style="margin:0">C\'est votre phase en ce moment</p>':'')+
   '<h3 class="gr-h">Ce qui se passe</h3>'+li(x.s)+'<h3 class="gr-h">Pour vous</h3>'+li(x.v)+
   '<div class="gr-sav">💡 <b>Le saviez-vous ?</b> '+E(x.sv)+'</div><div class="gr-dem">🗣️ <b>À demander à mon équipe :</b> '+E(x.q)+'</div>'+
   '<p class="xs muted" style="margin:10px 0 0">Information générale : chaque cycle est unique. Sources : Agence de la santé publique du Canada, SOGC. Ne remplace pas l\'avis de votre professionnel de la santé.</p></div>');
  setTimeout(()=>{const s=document.getElementById('suSel'),o=s&&s.querySelector('.on');if(s&&o)s.scrollLeft=o.offsetLeft-s.clientWidth/2+o.offsetWidth/2},30)}

/* ---------- Explorer : accès rapide à toutes les sections ---------- */
const EXP={suivi:['📅','Suivi','Rendez-vous, tâches'],journal:['📖','Journal','Mes notes et mon vécu'],madoula:['💬','Ma doula','Écrire, rencontrer'],fil:['📰','Fil','Cercle des mamans'],preparer:['📋','Préparer','Plan, valise, listes'],infos:['📚','Infos','Articles et guides']};
function explorer(){let T=[];try{T=PTABS2.filter(t=>EXP[t[0]])}catch(e){}if(!T.length)return '';
  return '<div class="gr-insw gr-expl"><div class="gr-ins-h">Explorer</div><div class="su-exp">'+T.map(t=>{const e=EXP[t[0]];return '<button class="su-ex" data-act="tab" data-v="'+t[0]+'"><span>'+e[0]+'</span><b>'+e[1]+'</b><small>'+e[2]+'</small></button>'}).join('')+'</div></div>'}


/* ---------- bébé né : règle des repères du développement ---------- */
const MAX_M=24;
function moisBebe(){const st=stg();return st.k==='pp'?st.day/30.44:null}
function fmt(m){return m<2?Math.round(m*4.345)+' sem.':Math.round(m)+' mois'}
function barre(j,m){const a=j[2]/MAX_M*100,b=Math.min(MAX_M,j[3])/MAX_M*100;const dedans=m!=null&&m>=j[2]&&m<=j[3];const pas=m!=null&&m>j[3];
  return '<div class="su-jl'+(dedans?' now':'')+(pas?' pas':'')+'"><div class="su-jt"><span>'+j[0]+'</span><b>'+E(nom(j[1]))+'</b></div><div class="su-jr"><i style="left:'+a+'%;width:'+Math.max(2,b-a)+'%"></i>'+(m!=null&&m<=MAX_M?'<u style="left:'+(m/MAX_M*100)+'%"></u>':'')+'</div><small>'+fmt(j[2])+' à '+fmt(j[3])+'</small></div>'}
function feuilleRegle(){const m=moisBebe(),J=window.JALONS||[];const n=prenomB()||'Bébé';
  const now=J.filter(j=>m!=null&&m>=j[2]&&m<=j[3]);
  sheet('Ce que bébé peut apprendre','<div class="gr-sem">'+(m!=null?'<p class="gr-p">'+E(n)+' a '+(m<2?Math.round(m*4.345)+' semaines':Math.round(m)+' mois')+'. Le trait bleu montre où vous êtes sur la règle.</p>':'')+
   (now.length?'<div class="gr-sav">⭐ <b>En ce moment, il peut commencer à :</b> '+now.map(j=>E(j[1].toLowerCase())).join(' · ')+'</div>':'')+
   '<div class="su-axe"><span>0</span><span>6 mois</span><span>1 an</span><span>18 mois</span><span>2 ans</span></div>'+J.map(j=>barre(j,m)).join('')+
   '<p class="xs muted" style="margin:10px 0 0">Chaque barre montre la période où la plupart des enfants y arrivent. Arriver avant ou après est très courant. Si un repère tarde beaucoup ou si vous avez un doute, parlez-en à votre professionnel de la santé : plus on observe tôt, mieux on accompagne. Sources : CDC, Société canadienne de pédiatrie, Naître et grandir.</p></div>')}
function carteRegle(){const m=moisBebe(),J=window.JALONS||[];if(m==null||!J.length)return '';const now=J.filter(j=>m>=j[2]&&m<=j[3]).slice(0,3);
  return '<div class="gr-insw gr-regle"><div class="gr-ins-h">Ce que bébé apprend en ce moment</div><button class="su-reglebtn" data-su="regle">'+(now.length?now.map(j=>'<span>'+j[0]+' '+E(j[1])+'</span>').join(''):'<span>Voir tous les repères</span>')+'<em>Voir la règle complète ›</em></button></div>'}

/* ---------- branchements ---------- */
const _pA=pAccueil;
pAccueil=function(){let h=_pA.apply(this,arguments);try{const st=stg();
  if(st.k==='none'&&h.indexOf('class="card ft-hero"')>=0&&h.indexOf('Pour commencer')<0&&h.indexOf('gr-insft')<0)h+=insightsFT();
  if(st.k==='pp')h+=friseEtapes(st.day)}catch(e){}return h};
if(typeof pJournal==='function'){const _pJ=pJournal;pJournal=function(){let h=_pJ.apply(this,arguments);try{
  if(S.role==='parent'&&stg().k==='preg'&&!S.sub&&S.vue!=='params'){const i=h.indexOf('</div>');if(i>=0)h=h.slice(0,i+6)+resumeJournal()+h.slice(i+6)}}catch(e){}return h}}
function ranger(){try{
  let ft=document.querySelector('.gr-insft');const hero=document.querySelector('.card.ft-hero');
  if(!ft&&hero&&stg().k==='none'&&!/Pour commencer/.test(hero.innerText||'')){const d=document.createElement('div');d.innerHTML=insightsFT();ft=d.firstElementChild;hero.after(ft)}
  if(ft&&hero&&hero.nextElementSibling!==ft)hero.after(ft);
  if(ft&&hero&&!document.querySelector('.gr-frft')){const d=document.createElement('div');d.innerHTML=friseCycle();if(d.firstElementChild)ft.after(d.firstElementChild)}
  const fc=document.querySelector('.gr-frft .gr-strip'),fo=fc&&fc.querySelector('.on');if(fc&&fo&&!fc.dataset.ok){fc.dataset.ok=1;fc.scrollLeft=fo.offsetLeft-fc.clientWidth/2+fo.offsetWidth/2}
  const anc=document.querySelector('.gr-frft')||document.querySelector('.gr-frpp')||document.querySelector('.gr-fr')||document.querySelector('.bebe-carte')||hero;
  if(!document.querySelector('.gr-expl')&&S.role==='parent'&&S.tab==='accueil'&&!S.vue&&anc&&!anc.closest('.sheet')&&!/Pour commencer/.test((hero&&hero.innerText)||'')){const d=document.createElement('div');d.innerHTML=explorer();const e=d.firstElementChild;if(e){const box=anc.parentElement;const pied=[...box.children].find(c=>/L.appli des doulas et des familles/.test(c.innerText||''));pied?box.insertBefore(e,pied):box.appendChild(e)}}
  const fq=document.querySelector('.gr-frpp');if(fq&&!document.querySelector('.gr-regle')&&!fq.closest('.sheet')){const d=document.createElement('div');d.innerHTML=carteRegle();if(d.firstElementChild)fq.after(d.firstElementChild)}
  try{if(stg().k==='pp'){document.querySelectorAll('#app .card,#app section').forEach(c=>{if(c.classList.contains('su-hide')||c.closest('.sheet'))return;const t=(c.innerText||'').trim().slice(0,60);if(/^(NOLAN|BÉBÉ|[A-ZÉ][\wÉéèï-]+)\s*·\s*SEMAINE\s+\d+\s+DE VIE/i.test(t)||/^TROUVEZ DES RÉPONSES/i.test(t))c.classList.add('su-hide')})}}catch(e){}
  const rg=document.querySelector('.gr-regle'),fz=document.querySelector('.gr-frpp');if(rg&&fz&&fz.nextElementSibling!==rg)fz.after(rg);
  const fp=document.querySelector('.gr-frpp'),top=document.querySelector('.ab-top');
  if(fp&&top&&top.nextElementSibling!==fp)top.after(fp);
  {const rg2=document.querySelector(".gr-regle"),fz2=document.querySelector(".gr-frpp");if(rg2&&fz2&&fz2.nextElementSibling!==rg2)fz2.after(rg2)}
  document.querySelectorAll('.card:not(.su-pastel),.tile:not(.su-pastel)').forEach(c=>{const t=(c.innerText||'').trim().slice(0,40);if(/Mon livre souvenir/.test(t))c.classList.add('su-pastel')});
  const s=document.querySelector('.gr-frpp .gr-strip'),o=s&&s.querySelector('.on');if(s&&o&&!s.dataset.ok){s.dataset.ok=1;s.scrollLeft=o.offsetLeft-s.clientWidth/2+o.offsetWidth/2}
}catch(e){}}
const _r=render;render=function(){const r=_r.apply(this,arguments);try{ranger();requestAnimationFrame(ranger)}catch(e){}return r};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-su="etape"],[data-su="phase"],[data-su="regle"]');if(!b)return;e.stopPropagation();e.preventDefault();if(b.dataset.su==='regle'){feuilleRegle();return}b.dataset.su==='phase'?feuillePhase(+b.dataset.i):feuilleEtape(+b.dataset.i)},true);

const css=document.createElement('style');css.textContent=`
.gr-et{width:104px!important;padding:10px 6px!important;gap:4px!important}.gr-et i{font-size:1.5rem}.gr-et b{font-size:.74rem!important;line-height:1.15;font-family:inherit!important;text-align:center}
.su-exp{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.su-ex{border:0;border-radius:18px;padding:12px 6px;display:grid;justify-items:center;gap:2px;color:#3b2a24;font:inherit;cursor:pointer;box-shadow:0 3px 10px rgba(120,70,50,.08)}.su-ex span{font-size:1.5rem}.su-ex b{font-size:.86rem}.su-ex small{font-size:.66rem;opacity:.75;text-align:center}
.su-ex:nth-child(6n+1){background:#e3f3e6}.su-ex:nth-child(6n+2){background:#fdf3d6}.su-ex:nth-child(6n+3){background:#fde8e0}.su-ex:nth-child(6n+4){background:#e6eefc}.su-ex:nth-child(6n+5){background:#f3e6f6}.su-ex:nth-child(6n+6){background:#fbe0e6}
.su-hide{display:none!important}.su-exp .su-ex:last-child:nth-child(3n+1){grid-column:span 3}
.su-jl{margin:10px 0;display:grid;gap:3px}.su-jl.pas{opacity:.55}.su-jl.now .su-jt b{color:var(--accent,#a85743)}.su-jt{display:flex;gap:8px;align-items:center;font-size:.88rem}.su-jt span{font-size:1.2rem}.su-jr{position:relative;height:12px;border-radius:8px;background:#f1e7e2}.su-jr i{position:absolute;top:0;bottom:0;border-radius:8px;background:linear-gradient(90deg,#f6c9b8,#e9a58f)}.su-jl.now .su-jr i{background:linear-gradient(90deg,#8fc9a0,#5fae7c)}.su-jr u{position:absolute;top:-3px;bottom:-3px;width:3px;background:#3b6fd6;border-radius:2px;text-decoration:none}.su-jl small{font-size:.7rem;opacity:.7}
.su-axe{display:flex;justify-content:space-between;font-size:.68rem;opacity:.65;margin-top:6px}
.su-reglebtn{width:100%;border:0;border-radius:18px;padding:12px;background:linear-gradient(135deg,#e3f3e6,#cbe8d1);color:#3b2a24;font:inherit;text-align:left;display:grid;gap:4px;cursor:pointer}.su-reglebtn span{font-size:.9rem}.su-reglebtn em{font-style:normal;font-weight:700;font-size:.8rem;color:var(--accent,#a85743)}
.gr-selt{font-size:.8rem;white-space:nowrap}
.su-res{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.su-res div{border-radius:18px;padding:10px 4px;display:grid;justify-items:center;gap:1px;color:#3b2a24}.su-res span{font-size:1.4rem}.su-res b{font-size:1.4rem;font-family:var(--serif,inherit)}.su-res small{font-size:.66rem;opacity:.75;text-align:center}
.su-pastel{background:linear-gradient(135deg,#fdf0e6,#fbe6ec)!important;border:0!important}
/* boutons de saisie : couleurs douces, partout dans l'espace famille */
.qbtn[data-act],.btn[data-act=feed],.btn[data-act=biberon],.btn[data-act=tirage],.btn[data-act=couche],.btn[data-act=sommeil]{color:#3b2a24!important;border:0!important;border-radius:20px!important;box-shadow:0 3px 10px rgba(120,70,50,.10)}
[data-act=humeur].qbtn{background:linear-gradient(145deg,#fdf3d6,#f8e7ab)!important}[data-act=symptome].qbtn{background:linear-gradient(145deg,#e3f3e6,#cbe8d1)!important}[data-act=note].qbtn{background:linear-gradient(145deg,#f3e6f6,#e5d0ea)!important}
[data-act=kickStart].qbtn{background:linear-gradient(145deg,#fde8e0,#f9d3c6)!important}[data-act=contr].qbtn{background:linear-gradient(145deg,#e6eefc,#d3e2f8)!important}
.btn[data-act=feed]{background:linear-gradient(145deg,#fde8e0,#f9d3c6)!important}.btn[data-act=biberon]{background:linear-gradient(145deg,#e6eefc,#d3e2f8)!important}.btn[data-act=tirage]{background:linear-gradient(145deg,#f3e6f6,#e5d0ea)!important}
.btn[data-act=couche]{background:linear-gradient(145deg,#e3f3e6,#cbe8d1)!important}.btn[data-act=sommeil]{background:linear-gradient(145deg,#e4e6f6,#d0d4ee)!important}
.ft-b{border-radius:20px!important}.ft-g{border-radius:22px!important;box-shadow:0 4px 14px rgba(120,70,50,.08)}
.ft-g:nth-child(1){background:linear-gradient(135deg,#fde8e0,#f9d3c6)!important}.ft-g:nth-child(2){background:linear-gradient(135deg,#e3f3e6,#cbe8d1)!important}.ft-g b,.ft-g small{color:#3b2a24!important}
.ab-row{border-radius:18px!important}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .su-pastel{background:#2c2523!important}}:root[data-theme=dark] .su-pastel{background:#2c2523!important}
`;document.head.appendChild(css);
})();
