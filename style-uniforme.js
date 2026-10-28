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
   '<p class="xs muted" style="margin:10px 0 0">Information générale : chaque bébé a son rythme. En cas de doute, parlez-en à votre professionnel de la santé ou appelez le 811 (France : 15).</p></div>');
  setTimeout(()=>{const s=document.getElementById('suSel'),o=s&&s.querySelector('.on');if(s&&o)s.scrollLeft=o.offsetLeft-s.clientWidth/2+o.offsetWidth/2},30)}

/* ---------- journal de grossesse : ma semaine en un coup d'œil ---------- */
function resumeJournal(){const t0=Date.now()-7*864e5,L=(S.logs||[]).filter(l=>l.t>t0),n=ty=>L.filter(l=>ty.includes(l.type)).length;
  const T=[['🩺','Symptômes',n(['symptome']),'#e3f3e6'],['😊','Humeurs',n(['humeur']),'#fdf3d6'],['👣','Mouvements',n(['mvt']),'#fde8e0'],['📝','Notes',n(['note']),'#f3e6f6']];
  return '<div class="gr-insw"><div class="gr-ins-h">Ma semaine en un coup d\'œil</div><div class="su-res">'+T.map(x=>'<div style="background:'+x[3]+'"><span>'+x[0]+'</span><b>'+x[2]+'</b><small>'+x[1]+'</small></div>').join('')+'</div></div>'}

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
  const fp=document.querySelector('.gr-frpp'),top=document.querySelector('.ab-top');
  if(fp&&top&&top.nextElementSibling!==fp)top.after(fp);
  document.querySelectorAll('.card:not(.su-pastel),.tile:not(.su-pastel)').forEach(c=>{const t=(c.innerText||'').trim().slice(0,40);if(/Mon livre souvenir/.test(t))c.classList.add('su-pastel')});
  const s=document.querySelector('.gr-frpp .gr-strip'),o=s&&s.querySelector('.on');if(s&&o&&!s.dataset.ok){s.dataset.ok=1;s.scrollLeft=o.offsetLeft-s.clientWidth/2+o.offsetWidth/2}
}catch(e){}}
const _r=render;render=function(){const r=_r.apply(this,arguments);try{ranger();requestAnimationFrame(ranger)}catch(e){}return r};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-su="etape"]');if(!b)return;e.stopPropagation();e.preventDefault();feuilleEtape(+b.dataset.i)},true);

const css=document.createElement('style');css.textContent=`
.gr-et{width:104px!important;padding:10px 6px!important;gap:4px!important}.gr-et i{font-size:1.5rem}.gr-et b{font-size:.74rem!important;line-height:1.15;font-family:inherit!important;text-align:center}
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
