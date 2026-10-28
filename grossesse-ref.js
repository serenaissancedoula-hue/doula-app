/* Sérénaissance — accueil de la grossesse (famille) : frise « semaine par semaine » à glisser, suivi des symptômes en icônes,
   guides classés par catégories. S'appuie sur les données déjà dans l'appli (SEMAINES, FRUITS, FICHES) : aucun nouveau texte médical. */
(function(){
if(window.ESPACE!=='parent')return;
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const emo=w=>{try{return FRUIT_EMOJI[fruit(w)[0]]||'🌱'}catch(e){return '🌱'}};
const cm=x=>String(x).replace('.',',');
const SYM=[['Nausées','🤢'],['Fatigue','😴'],['Brûlures d\'estomac','🔥'],['Maux de dos','🦴'],['Crampes','⚡'],['Contractions','🌀'],['Enflure','🦶'],['Maux de tête','🤕'],['Insomnie','🌙'],['Constipation','💨'],['Essoufflement','😮‍💨'],['Pertes vaginales','💧'],['Étourdissements','😵‍💫'],['Seins sensibles','🤱'],['Jambes lourdes','🦵'],['Appétit changé','🍽️']];
const CATS={'Préparation':['🎒','Se préparer à la naissance'],'Allaitement':['🤱','Allaitement'],'Nouveau-né':['👶','Prendre soin de bébé'],'Post-partum':['🌸','Après la naissance']};
/* le prénom de bébé, quand la maman l'a choisi, remplace « Bébé » / « Votre bébé » */
function prenomB(){try{return ((S.parent.naissance||{}).prenomBebe||'').trim()}catch(e){return ''}}
function nomme(h){const n=prenomB();if(!n)return h;const e=E(n);return h.replace(/<h2 class="bb2-h">Votre bébé<\/h2>/g,'<h2 class="bb2-h">'+e+'</h2>').replace(/(^|>|[.!?:] |<\/b> )Bébé (?=[a-zéèêàâ'])/g,'$1'+e+' ').replace(/Votre bébé<\/span>/g,e+'</span>')}
function cur(){try{const st=stage();return st.k==='preg'?Math.max(4,Math.min(42,st.g.w)):null}catch(e){return null}}

/* ---------- frise des semaines ---------- */
function frise(w0){let s='';for(let w=4;w<=42;w++)s+='<button class="gr-w'+(w===w0?' on':'')+(w<w0?' pas':'')+'" data-gr="sem" data-w="'+w+'" aria-label="Semaine '+w+'"><small>sem.</small><b>'+w+'</b><i>'+emo(w)+'</i></button>';
  return '<div class="card gr-fr"><div class="row between"><span class="eyebrow acc">Semaine par semaine</span><span class="xs muted">Glissez pour explorer</span></div><div class="gr-strip" id="grStrip">'+s+'</div></div>'}
function feuilleSemaine(w){w=Math.max(4,Math.min(42,w));const c=cur(),f=fruit(w),I=infoSemaine(w)||[],g=f[2];
  const rel=c==null?'':w===c?'Cette semaine':w>c?'Dans '+(w-c)+' semaine'+(w-c>1?'s':''):'Il y a '+(c-w)+' semaine'+(c-w>1?'s':'');
  let h='<div class="gr-sem"><div class="gr-hero"><span class="gr-big">'+emo(w)+'</span><div><b>Bébé a la taille de : '+E(f[0])+'</b><p class="small muted">Environ '+cm(f[1])+' cm'+(g?' · '+(g>=1000?cm((g/1000).toFixed(1))+' kg':g+' g'):'')+(bpm(w)?' · cœur : environ '+bpm(w)+' battements par minute':'')+'</p></div></div>';
  if(rel)h+='<p class="xs muted" style="margin:0">'+rel+'</p>';
  if(I[1])h+='<div class="card"><span class="eyebrow acc">'+(prenomB()?E(prenomB()):'Votre bébé')+'</span><p class="small" style="margin:6px 0 0">'+E(I[1])+'</p></div>';
  if(I[2])h+='<div class="card"><span class="eyebrow acc">Vous</span><p class="small" style="margin:6px 0 0">'+E(I[2])+'</p></div>';
  if(I[3])h+='<div class="banner sage" style="margin:0"><div class="small"><b>Petit conseil :</b> '+E(I[3])+'</div></div>';
  h+='<div class="row between"><button class="btn sm ghost" data-gr="sem" data-w="'+(w-1)+'"'+(w<=4?' disabled':'')+'>← Semaine '+(w-1)+'</button><button class="btn sm ghost" data-gr="sem" data-w="'+(w+1)+'"'+(w>=42?' disabled':'')+'>Semaine '+(w+1)+' →</button></div>'+
    '<p class="xs muted" style="margin:0">Les mesures sont des moyennes : chaque bébé grandit à son rythme. Ça ne remplace pas l\'avis de votre équipe de soins.</p></div>';
  sheet('Semaine '+w,nomme(h))}

/* ---------- symptômes en icônes ---------- */
function recent(){const t0=Date.now()-7*864e5,m={};(S.logs||[]).filter(l=>l.type==='symptome'&&l.t>t0).forEach(l=>(l.list||[]).forEach(x=>m[x]=(m[x]||0)+1));return Object.entries(m).sort((a,b)=>b[1]-a[1])}
function feuilleSymptomes(){const r=recent();
  sheet('Mes symptômes','<div class="stack" style="gap:10px"><p class="small muted" style="margin:0">Touchez ce que vous ressentez aujourd\'hui. Ça se garde dans votre journal, et votre doula peut le voir.</p>'+
   (r.length?'<div class="gr-rec"><span class="xs muted">Cette semaine :</span> '+r.slice(0,5).map(x=>'<span class="chip">'+E(x[0])+' × '+x[1]+'</span>').join(' ')+'</div>':'')+
   '<div class="gr-sy-g">'+SYM.map(s=>'<button class="gr-sy" data-gr="sy" data-n="'+E(s[0])+'"><span>'+s[1]+'</span><b>'+E(s[0])+'</b></button>').join('')+'</div>'+
   '<label class="f">Une note (facultatif)<input type="text" id="m_note"></label>'+(typeof W==='function'?W():'')+
   '<div class="banner" style="margin:0"><div class="xs">Un symptôme nouveau, intense ou qui vous inquiète : appelez votre professionnel de la santé ou le 811 (Info-Santé). Saignements, perte de liquide, douleur forte ou bébé qui bouge moins : consultez sans attendre.</div></div>'+
   '<button class="btn" data-gr="sysave">Enregistrer</button></div>')}
try{FORMS.symptome=feuilleSymptomes}catch(e){}

/* ---------- guides par catégories ---------- */
function guides(){let F=[];try{F=FICHES}catch(e){}if(!F.length)return '';const pp=(()=>{try{return stage().k==='pp'}catch(e){return false}})();
  const ordre=pp?['Nouveau-né','Allaitement','Post-partum','Préparation']:['Préparation','Allaitement','Nouveau-né','Post-partum'];
  return '<div class="card gr-gd"><div class="row between"><span class="eyebrow acc">Trouvez des réponses</span><button class="btn sm ghost" data-gr="biblio">Tout voir</button></div><div class="gr-cats">'+
   ordre.filter(c=>F.some(f=>f.cat===c)).map(c=>{const m=CATS[c]||['📖',c];return '<button class="gr-cat" data-gr="cat" data-c="'+E(c)+'"><span>'+m[0]+'</span><b>'+E(m[1])+'</b><small>'+F.filter(f=>f.cat===c).length+' fiches</small></button>'}).join('')+'</div></div>'}
function feuilleCat(c){const m=CATS[c]||['📖',c];sheet(m[0]+' '+E(m[1]),'<div class="list">'+FICHES.filter(f=>f.cat===c).map(f=>'<button class="li" data-gr="fiche" data-id="'+E(f.id)+'" style="background:none;border-left:0;border-right:0;border-top:0;width:100%;text-align:left;cursor:pointer;color:inherit"><div class="ic">'+icon(f.ic)+'</div><div class="tx"><b>'+E(f.t)+'</b><span>Fiche '+E(f.id)+'</span></div>'+icon('fa-chevron-right','var(--muted)')+'</button>').join('')+'</div><p class="xs muted">Fiches d\'information générale appuyées sur des sources reconnues. Elles ne remplacent pas l\'avis de votre équipe de soins.</p>')}
function aller(sub){try{close()}catch(e){}S.tab='infos';S.sub=sub||'';try{scrollTo(0,0)}catch(e){}render()}

/* ---------- « Mes repères du jour » : cartes à glisser, comme sur les applis de référence ---------- */
const INS={symptome:['Noter mes symptômes','🩺','#ffffff','plus'],humeur:['Mon humeur','😊','#fdf3d6','plus'],kickStart:['Les mouvements de bébé','👣','#fde8e0','plus'],contr:['Mes contractions','⏱️','#e6eefc','plus']};
function insights(h,w){const i=h.indexOf('<div class="quick">');if(i<0)return h;const j=h.indexOf('</div>',i);if(j<0)return h;
  const acts=[...h.slice(i,j+6).matchAll(/data-act="([a-zA-Z]+)"/g)].map(m=>m[1]);if(!acts.length||acts.some(a=>!INS[a]))return h;
  const nom=prenomB()||'Mon bébé';
  const carte=(att,t,em,bg,plus)=>'<button class="gr-ins" '+att+' style="background:'+bg+'"><small>'+t+'</small><span>'+em+'</span>'+(plus?'<i>+</i>':'')+'</button>';
  let c=[];
  ['symptome'].filter(a=>acts.includes(a)).forEach(a=>c.push(carte('data-act="'+a+'"',INS[a][0],INS[a][1],INS[a][2],1)));
  c.push(carte('data-gr="sem" data-w="'+w+'"',(prenomB()?E(nom):'Mon bébé')+' à '+w+' sem.',emo(w),'linear-gradient(160deg,#f3e6e2,#ead7d2)'));
  c.push(carte('data-gr="sem" data-w="'+w+'"','Mon corps à '+w+' sem.','🤰','linear-gradient(160deg,#dbe9f8,#c9dcf2)'));
  acts.filter(a=>a!=='symptome').forEach(a=>c.push(carte('data-act="'+a+'"',INS[a][0],INS[a][1],INS[a][2],1)));
  return h.slice(0,i)+'<div class="gr-insw"><div class="gr-ins-h">Mes repères du jour</div><div class="gr-ins-row">'+c.join('')+'</div></div>'+h.slice(j+6)}
/* ---------- accueil ---------- */
const _pA=pAccueil;
pAccueil=function(){let h=_pA.apply(this,arguments);try{const w=cur(),st=stage();
  if(w!=null){h=insights(h,w);const i=h.indexOf('<div class="gr-insw">');if(i>=0)h=h.slice(0,i)+frise(w)+h.slice(i)}
  if(st.k==='preg'){h=h.replace(/<div class="soft" style="margin:8px 0"><div class="grid2 resp">[\s\S]*?(?=<div class="prog">)/,'');h=nomme(h)}
  if(st.k==='preg'||st.k==='pp'){const k='<button class="btn ghost" data-act="go" data-v="infos|alertes">',j=h.indexOf(k);if(j>=0)h=h.slice(0,j)+guides()+h.slice(j)}
 }catch(e){}return h};
/* nom et sexe de bébé : dans « Mon journal » plutôt que sur l'accueil */
function carteNom(){try{return '<div class="card gr-nom"><span class="eyebrow acc">Mon bébé</span><p class="small muted" style="margin:4px 0 8px">Si vous le savez déjà : son prénom remplacera « Bébé » dans toute l\'appli.</p><div class="grid2 resp">'+ui.text('parent.naissance.prenomBebe','Nom de bébé (facultatif)','text','Si vous le connaissez')+'<div class="f"><span>Sexe de bébé (facultatif)</span>'+ui.pick('parent.naissance.sexe',['Fille','Garçon','Surprise'])+'</div></div></div>'}catch(e){return ''}}
const _pJr=pJournal;pJournal=function(){const h=_pJr.apply(this,arguments);try{if(S.role==='parent'&&stage().k==='preg'&&!S.sub&&S.vue!=='params')return h+carteNom()}catch(e){}return h};
function remettreEnOrdre(){try{const hero=document.querySelector('.bebe-carte');if(!hero||hero.closest('.sheet'))return;const box=hero.parentElement;if(!box||document.getElementById('grStrip')==null)return;
  if(!hero.dataset.gr){hero.dataset.gr=1;const h2=hero.querySelector('.bb2-h');if(h2){const d=document.createElement('details');d.className='gr-det';d.innerHTML='<summary>Tout lire sur cette semaine</summary>';let n=h2;const lot=[];while(n){lot.push(n);n=n.nextElementSibling}lot.forEach(x=>d.appendChild(x));hero.appendChild(d)}}
  const ins=box.querySelector('.gr-insw'),fr=box.querySelector('.gr-fr');
  const prem=[...box.children].find(x=>x!==hero&&/(^|\s)card(\s|$)/.test(x.className));if(prem&&prem!==hero&&!(hero.compareDocumentPosition(prem)&4))box.insertBefore(hero,prem);
  if(ins&&hero.nextElementSibling!==ins)hero.after(ins);
  if(fr&&ins&&ins.nextElementSibling!==fr)ins.after(fr)}catch(e){}}
const _r=render;
render=function(){const r=_r.apply(this,arguments);try{remettreEnOrdre();requestAnimationFrame(()=>{const s=document.getElementById('grStrip'),o=s&&s.querySelector('.on');if(s&&o&&!s.dataset.ok){s.dataset.ok=1;s.scrollLeft=o.offsetLeft-s.clientWidth/2+o.offsetWidth/2}})}catch(e){}return r};

document.addEventListener('click',async e=>{const b=e.target.closest&&e.target.closest('[data-gr]');if(!b||b.disabled)return;e.stopPropagation();e.preventDefault();
  const a=b.dataset.gr;
  if(a==='sem')feuilleSemaine(+b.dataset.w);
  else if(a==='sy')b.classList.toggle('on');
  else if(a==='sysave'){const l=[...document.querySelectorAll('.sheet .gr-sy.on')].map(x=>x.dataset.n),n=(document.getElementById('m_note')||{}).value||'';
    if(!l.length&&!n){toast('Choisissez au moins un symptôme');return}
    await addLog({type:'symptome',list:l,note:n,t:getT()})}
  else if(a==='cat')feuilleCat(b.dataset.c);
  else if(a==='fiche')aller(b.dataset.id);
  else if(a==='biblio')aller('');
},true);

const css=document.createElement('style');css.textContent=`
.gr-insw{margin:2px 0 12px}.gr-ins-h{font-family:var(--serif,inherit);font-size:1.15rem;font-weight:700;margin:0 4px 8px}
.gr-ins-row{display:flex;gap:12px;overflow-x:auto;padding:4px 2px 10px;scrollbar-width:none;scroll-snap-type:x proximity}.gr-ins-row::-webkit-scrollbar{display:none}
.gr-ins{flex:0 0 138px;height:150px;border:0;border-radius:22px;padding:14px 12px;display:flex;flex-direction:column;justify-content:space-between;text-align:left;cursor:pointer;color:#3b2a24;font:inherit;position:relative;box-shadow:0 4px 14px rgba(120,70,50,.12);scroll-snap-align:start}
.gr-ins small{font-size:.86rem;font-weight:700;line-height:1.2}.gr-ins span{font-size:2.8rem;line-height:1;align-self:center}.gr-ins i{position:absolute;right:12px;bottom:12px;width:34px;height:34px;border-radius:50%;background:#e8607f;color:#fff;font-style:normal;font-size:1.4rem;display:grid;place-items:center}
.gr-ins:active{transform:scale(.97)}
.gr-det{margin-top:10px}.gr-det>summary{cursor:pointer;font-weight:700;color:var(--accent,#a85743);padding:8px 2px;list-style:none}.gr-det>summary::before{content:'▸ '}.gr-det[open]>summary::before{content:'▾ '}
.gr-fr{background:linear-gradient(135deg,#fdf0e6,#fbe6ec)!important;border:0!important}.gr-gd{background:linear-gradient(135deg,#f3f7ee,#eef3fb)!important;border:0!important}
.gr-cat:nth-child(1){background:linear-gradient(135deg,#fde8e0,#f9d3c6)}.gr-cat:nth-child(2){background:linear-gradient(135deg,#fdf3d6,#f8e7ab)}.gr-cat:nth-child(3){background:linear-gradient(135deg,#e6eefc,#d3e2f8)}.gr-cat:nth-child(4){background:linear-gradient(135deg,#f6e4f3,#ecd0e8)}
.gr-cat b,.gr-cat small{color:#3b2a24}.gr-cat small{opacity:.7}.gr-cat{border-radius:22px!important;box-shadow:0 4px 14px rgba(120,70,50,.08)}
.gr-w{border-radius:18px!important;background:#fff!important}.gr-w.on{background:var(--accent,#a85743)!important}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .gr-fr,:root:not([data-theme=light]) .gr-gd{background:#2c2523!important}:root:not([data-theme=light]) .gr-w{background:#3a2f2c!important}}:root[data-theme=dark] .gr-fr,:root[data-theme=dark] .gr-gd{background:#2c2523!important}:root[data-theme=dark] .gr-w{background:#3a2f2c!important}

.gr-strip{display:flex;gap:8px;overflow-x:auto;padding:10px 2px 6px;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;scrollbar-width:none}.gr-strip::-webkit-scrollbar{display:none}
.gr-w{flex:0 0 auto;width:58px;border:1px solid var(--line,#e6d9d0);background:var(--card,#fffaf6);border-radius:16px;padding:8px 4px;display:grid;justify-items:center;gap:1px;cursor:pointer;color:inherit;font:inherit;scroll-snap-align:center}
.gr-w small{font-size:.6rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}.gr-w b{font-size:1.15rem;font-family:var(--serif,inherit)}.gr-w i{font-style:normal;font-size:1.3rem}
.gr-w.pas{opacity:.65}.gr-w.on{background:var(--accent,#a85743);border-color:var(--accent,#a85743);color:#fff;opacity:1;transform:scale(1.06)}.gr-w.on small{color:#ffe9e0}
.gr-sem{display:grid;gap:10px}.gr-hero{display:flex;gap:14px;align-items:center}.gr-big{font-size:3.2rem;line-height:1}
.gr-sy-g{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.gr-sy{border:1px solid var(--line,#e6d9d0);background:var(--card,#fffaf6);border-radius:16px;padding:10px 2px 8px;display:grid;justify-items:center;gap:4px;cursor:pointer;color:inherit;font:inherit}
.gr-sy span{font-size:1.6rem;line-height:1}.gr-sy b{font-size:.66rem;font-weight:600;text-align:center;line-height:1.15}.gr-sy.on{background:var(--accent,#a85743);border-color:var(--accent,#a85743);color:#fff}
.gr-cats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}.gr-cat{border:0;border-radius:18px;padding:14px 10px;display:grid;gap:3px;justify-items:start;text-align:left;cursor:pointer;color:inherit;font:inherit;background:linear-gradient(135deg,#fdf0e6,#fbe6ec)}
.gr-cat span{font-size:1.8rem;line-height:1}.gr-cat b{font-size:.86rem}.gr-cat small{font-size:.7rem;color:var(--muted)}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .gr-cat{background:linear-gradient(135deg,#3a2c28,#3a2830)}}:root[data-theme=dark] .gr-cat{background:linear-gradient(135deg,#3a2c28,#3a2830)}
`;document.head.appendChild(css);
})();
