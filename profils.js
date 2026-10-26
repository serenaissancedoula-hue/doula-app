/* Sérénaissance — plusieurs suivis en même temps (espace famille) :
   - « Mes suivis » dans Paramètres : suivi du cycle / essais bébé, grossesse (avec jumeaux ou triplés), bébé (jumeaux ou triplés aussi).
   - Une nouvelle grossesse peut s'ajouter quand on a déjà un enfant; on peut suivre son cycle avec un bébé.
   - Quand plusieurs suivis sont actifs, des onglets en haut permettent de passer de l'un à l'autre.
   - Jumeaux et triplés : la 3D montre 2 ou 3 bébés, les textes s'accordent, et le Journal bébé se tient par bébé. */
(function(){
if(window.ESPACE!=='parent'||typeof stage!=='function')return;
const P=()=>S.parent||{};
const sauver=()=>{try{if(typeof saveParent==='function')saveParent();else save()}catch(e){}};
const NB={1:'Un bébé',2:'Des jumeaux',3:'Des triplés'};
/* une grossesse compte si elle est en cours (et plus récente que la naissance déjà inscrite) */
function grossesseActive(){try{const p=P();if(p.grossesseFinie)return null;const g=preg(p);if(!g||g.gaDays>44*7||g.gaDays<0)return null;const b=parseD((p.naissance||{}).date);if(b&&g.dpa&&+g.dpa<=+b+60*864e5)return null;return g}catch(e){return null}}
function bebeActif(){return !!parseD((P().naissance||{}).date)}
function cycleActif(){const p=P();return !!p.suiviCycle||(p.parcours==='conception'&&!bebeActif()&&!grossesseActive())}
function suivis(){const L=[];if(cycleActif())L.push('cycle');if(grossesseActive())L.push('grossesse');if(bebeActif())L.push('bebe');return L}
function actif(){const L=suivis(),p=P();if(p.profil&&L.includes(p.profil))return p.profil;return L.includes('grossesse')?'grossesse':L.includes('bebe')?'bebe':L[0]||''}
window.pfActif=actif;window.pfSuivis=suivis;
{const _rM=render;render=function(){const x=_rM.apply(this,arguments);try{if(S.role!=='parent'||S.vue||S.sub)return x;const app=document.getElementById('app'),a=actif();if(app.querySelector('.pf-mod'))return x;
  let bt='';if(S.tab==='suivi'&&a==='grossesse'&&grossesseActive())bt='<button class="pf-mod" data-pf-gr="edit">'+icon('fa-pen')+'Modifier mes dates (règles, échographie, date prévue)</button>';
  else if((S.tab==='suivi'||S.tab==='journal')&&a==='bebe'&&bebeActif()&&S.sub!=='devE')bt='<button class="pf-mod" data-pf-bb="edit">'+icon('fa-pen')+'Modifier la date de naissance'+(nbBebe()>1?' ou les prénoms':'')+'</button>';
  if(bt){const sh=app.querySelector(':scope>.sh, :scope>.jb-tete');const t=document.createElement('template');t.innerHTML=bt;if(sh)sh.append(t.content)}}catch(e){}return x}}
/* stage() suit l'onglet choisi */
const _st=stage;stage=function(){const r=_st.apply(this,arguments);try{if(S.role!=='parent')return r;const a=actif();
  if(a==='cycle')return {k:'none'};if(a==='grossesse'){const g=grossesseActive();if(g)return {k:'preg',g}}if(a==='bebe'&&bebeActif())return r;}catch(e){}return r};
/* noms */
function joindre(L){L=L.filter(Boolean);return L.length<2?(L[0]||''):L.slice(0,-1).join(', ')+' et '+L[L.length-1]}
function nbGrossesse(){return Math.max(1,Math.min(3,+P().nbBebesGrossesse||1))}
function nbBebe(){return Math.max(1,Math.min(3,+(P().naissance||{}).nb||1))}
function nomGrossesse(){const n=nbGrossesse(),L=(P().prenomsGrossesse||[]).slice(0,n).filter(Boolean);return L.length?joindre(L):n===2?'Vos jumeaux':n===3?'Vos triplés':'Bébé'}
window.pfNbGrossesse=nbGrossesse;setTimeout(()=>{window.pfFormGrossesse=fGrossesse;window.pfFormBebe=fBebe},0);window.pfNbBebe=nbBebe;
function nbAffiche(){const a=actif();return a==='grossesse'?nbGrossesse():a==='bebe'?nbBebe():1}
/* ---------- onglets en haut ---------- */
function bandeau(){const L=suivis();if(L.length<2)return '';const a=actif(),nb=esc(((P().naissance||{}).prenomBebe||'').trim()||'Bébé');
  const lab={cycle:['🌱','Mon cycle'],grossesse:['🤰',nbGrossesse()>1?(nbGrossesse()===2?'Jumeaux':'Triplés'):'Grossesse'],bebe:['👶',nb]};
  return '<div class="pf-sw" role="tablist">'+L.map(k=>'<button role="tab" aria-selected="'+(k===a)+'" data-pf="'+k+'"><span>'+lab[k][0]+'</span>'+lab[k][1]+'</button>').join('')+'</div>'}
/* ---------- grossesse multiple : informations ---------- */
function carteMultiple(){const n=nbGrossesse();if(n<2)return '';return '<div class="card pf-mult"><span class="eyebrow acc">'+(n===2?'Grossesse gémellaire':'Grossesse de triplés')+'</span><h2>'+(n===2?'Deux bébés, deux fois plus d\'amour':'Trois bébés en route')+'</h2>'+
  '<ul class="clean dv-l"><li>Votre suivi est plus rapproché : plus de rendez-vous et d\'échographies, selon que les bébés partagent ou non le même placenta (chorionicité). Demandez-la à votre équipe : c\'est elle qui guide le suivi.</li>'+
  '<li>Plus de la moitié des bébés de naissances multiples naissent avant 37 semaines : la date et le lieu de l\'accouchement sont décidés avec votre équipe, au cas par cas.</li>'+
  '<li>Contractions régulières avant 37 semaines, écoulement de liquide, saignements, pression dans le bassin ou mal de dos inhabituel : appelez tout de suite votre équipe ou rendez-vous à l\'hôpital.</li>'+
  '<li>Prévoyez de l\'aide pour après la naissance, le matériel en double (sièges d\'auto, lits) et du soutien pour l\'allaitement : allaiter des jumeaux est possible.</li></ul>'+
  '<p class="xs muted">Sources : <a href="https://health-infobase.canada.ca/datalab/multiple-births-blog.html" target="_blank" rel="noopener">Agence de la santé publique du Canada</a> · <a href="https://www.ottawahospital.on.ca/en/departments-and-services/obstetrics-gynecology-and-newborn-care/multiple-pregnancy" target="_blank" rel="noopener">L\'Hôpital d\'Ottawa, grossesse multiple</a> · <a href="https://multiplebirthscanada.org/" target="_blank" rel="noopener">Naissances multiples Canada</a></p></div>'}
/* ---------- Paramètres : Mes suivis ---------- */
function carteSuivis(){const p=P(),g=grossesseActive(),n=p.naissance||{};
  let h='<div class="card pf-set"><span class="eyebrow acc">Mes suivis</span><p class="small muted">Activez ce que vous voulez suivre. Si plusieurs suivis sont actifs, des onglets en haut de l\'appli permettent de passer de l\'un à l\'autre.</p>';
  h+='<div class="pf-l"><div><b>🌱 Mon cycle · essais bébé</b><small>Règles, ovulation, tests, température, conseils de fertilité</small></div>'+(cycleActif()?'<button class="btn sm ghost" data-pf-cycle="0">Retirer</button>':'<button class="btn sm" data-pf-cycle="1">Activer</button>')+'</div>';
  h+='<div class="pf-l"><div><b>🤰 Grossesse</b><small>'+(g?(g.w+' semaines + '+g.d+' jours · '+NB[nbGrossesse()]):'Inscrire une grossesse en cours, même si vous avez déjà un enfant')+'</small></div>'+(g?'<button class="btn sm ghost" data-pf-gr="edit">Modifier</button>':'<button class="btn sm" data-pf-gr="new">Inscrire</button>')+'</div>';
  h+='<div class="pf-l"><div><b>👶 '+(bebeActif()?esc(n.prenomBebe||'Bébé'):'Bébé est né')+'</b><small>'+(bebeActif()?('Né'+(nbBebe()>1?'s':'')+' le '+fmtD(parseD(n.date),{day:'numeric',month:'long',year:'numeric'})+' · '+NB[nbBebe()]):'Inscrire la naissance')+'</small></div>'+(bebeActif()?'<button class="btn sm ghost" data-pf-bb="edit">Modifier</button>':'<button class="btn sm" data-pf-bb="new">Inscrire</button>')+'</div>';
  if(bebeActif()&&g)h+='<button class="btn sm ghost" data-pf-bb="new" style="margin-top:8px">'+icon('fa-baby')+'Le nouveau bébé est né</button>';
  return h+'</div>'}
const nbSel=(id,v)=>'<label class="f">Nombre de bébés<select id="'+id+'">'+[1,2,3].map(k=>'<option value="'+k+'"'+(+v===k?' selected':'')+'>'+NB[k]+'</option>').join('')+'</select></label>';
const noms=(pref,L,n)=>'<div id="'+pref+'_noms">'+[0,1,2].map(i=>'<label class="f pf-nom" data-i="'+i+'"'+(i<n?'':' hidden')+'>Prénom '+(n>1?'du bébé '+(i+1):'de bébé')+' (facultatif)<input id="'+pref+'_n'+i+'" value="'+esc((L||[])[i]||'')+'"></label>').join('')+'</div>';
function fGrossesse(edit){const p=P(),g=edit&&grossesseActive();
  sheet(edit?'Ma grossesse':'Inscrire une grossesse','<p class="small muted">Une seule date suffit : l\'appli calcule la semaine et la date prévue.</p><label class="f">Premier jour des dernières règles<input type="date" id="pf_ddr" value="'+(edit?esc(p.ddr||''):'')+'"></label><label class="f">ou date prévue d\'accouchement (donnée par votre équipe)<input type="date" id="pf_dpa" value="'+(edit?esc(p.dpaEquipe||''):'')+'"></label>'+
   '<details class="acc"'+(edit&&p.echoDate?' open':'')+'><summary>Selon mon échographie (facultatif)<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body"><p class="xs muted" style="margin:0 0 6px">L\'échographie de datation (souvent vers 11 à 14 semaines) est la plus précise : si elle donne une autre date, c\'est elle qui compte.</p><label class="f">Date de l\'échographie<input type="date" id="pf_ed" value="'+(edit?esc(p.echoDate||''):'')+'"></label><div class="grid2"><label class="f">Semaines ce jour-là<input type="number" id="pf_es" inputmode="numeric" min="4" max="42" value="'+(edit?esc(p.echoSA??''):'')+'" placeholder="Ex. : 12"></label><label class="f">et jours<input type="number" id="pf_ej" inputmode="numeric" min="0" max="6" value="'+(edit?esc(p.echoJ??''):'')+'" placeholder="0 à 6"></label></div></div></details>'+
   nbSel('pf_nb',edit?nbGrossesse():1)+noms('pf',edit?p.prenomsGrossesse:[],edit?nbGrossesse():1)+'<button class="btn" data-pf-gsave="'+(edit?1:0)+'">Enregistrer</button>'+(edit?'<button class="btn ghost" data-pf-gfin="1" style="margin-top:8px">Retirer cette grossesse</button>':''))}
function fBebe(edit){const n=edit?(P().naissance||{}):{};const L=edit?(n.prenoms||(n.prenomBebe?[n.prenomBebe]:[])):(P().prenomsGrossesse||[]);const nb=edit?nbBebe():nbGrossesse();
  sheet(edit?'Mon bébé':'Bébé est né 💗','<label class="f">Date de naissance<input type="date" id="pf_bd" max="'+iso(new Date())+'" value="'+esc(edit?(n.date||''):iso(new Date()))+'"></label>'+nbSel('pfb_nb',nb)+noms('pfb',L,nb)+
   '<label class="f">Sexe'+(nb>1?' (du premier bébé)':'')+'<select id="pf_bs"><option value="">—</option>'+['Fille','Garçon'].map(x=>'<option'+((n.sexe||'')===x?' selected':'')+'>'+x+'</option>').join('')+'</select></label>'+
   (!edit&&bebeActif()?'<p class="xs muted">'+esc((P().naissance||{}).prenomBebe||'Votre premier enfant')+' reste dans vos souvenirs : le suivi passe au nouveau bébé.</p>':'')+'<button class="btn" data-pf-bsave="'+(edit?1:0)+'">Enregistrer</button>')}
(function(){const st=document.createElement('style');st.textContent='.pf-mod{display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:6px 12px;border:1px solid var(--line,#e6d9d0);border-radius:999px;background:var(--card);color:var(--accent);font:600 .78rem var(--f-body);cursor:pointer}';document.head.appendChild(st)})();
function lireNoms(pref,n){return [0,1,2].slice(0,n).map(i=>(($('#'+pref+'_n'+i)||{}).value||'').trim())}
/* ---------- jumeaux / triplés après la naissance : un journal par bébé ---------- */
const TYPES_BB=['sein','biberon','tirage','couche','sommeil','poids','solide'];
function nomsBebes(){const n=P().naissance||{},k=nbBebe();const L=(n.prenoms||[]).slice(0,k);return [0,1,2].slice(0,k).map(i=>L[i]||('Bébé '+(i+1)))}
function selBebe(){const k=nbBebe();if(k<2)return null;return Math.max(0,Math.min(k-1,+S.bbSel||0))}
function filtrer(fn){return function(){const k=selBebe();if(k==null||actif()!=='bebe')return fn.apply(this,arguments);const tous=S.logs;
  S.logs=(tous||[]).filter(l=>!TYPES_BB.includes(l.type)||(l.bb==null?k===0:l.bb===k));try{return fn.apply(this,arguments)}finally{const vus=new Set(S.logs);(S.logs||[]).forEach(l=>{if(!tous.includes(l))tous.push(l)});S.logs=tous}}}
if(typeof pJournal==='function')pJournal=filtrer(pJournal);
if(typeof pAccueil==='function')pAccueil=filtrer(pAccueil);
if(typeof logPush==='function'){const _lp=logPush;logPush=function(o){try{const k=selBebe();if(k!=null&&actif()==='bebe'&&o&&TYPES_BB.includes(o.type)&&o.bb==null)o.bb=k}catch(e){}return _lp.apply(this,arguments)}}
function choixBebe(){const k=selBebe();if(k==null||actif()!=='bebe')return '';return '<div class="pf-bb">'+nomsBebes().map((n,i)=>'<button class="chip'+(i===k?' on':'')+'" data-pf-sel="'+i+'">'+esc(n)+'</button>').join('')+'</div>'}
/* ---------- 3D : 2 ou 3 bébés ---------- */
window.b3cMulti=function(o){try{const n=nbAffiche();if(n<2||!window.THREE)return o;B3C.multi=B3C.multi||{};const cle=o.userData.cle+'x'+n;if(B3C.multi[cle])return B3C.multi[cle];
  const G=new THREE.Group(),k=n===2?.68:.55,dx=n===2?1.05:1.15;for(let i=0;i<n;i++){const c=i?o.clone():o.clone();c.scale.multiplyScalar(k);c.position.x=(i-(n-1)/2)*dx*1.4;c.position.y=n===3&&i===1?.35:0;c.rotation.y=(i-(n-1)/2)*.35;G.add(c)}
  G.userData.cle=o.userData.cle;return B3C.multi[cle]=G}catch(e){return o}};
/* ---------- textes au pluriel pour jumeaux / triplés, et prénom de la nouvelle grossesse ---------- */
function corrigerTextes(){const a=actif(),app=document.body;if(!app)return;const rep=[];
  if(a==='grossesse'&&bebeActif()){const ancien=((P().naissance||{}).prenomBebe||'').trim();if(ancien)rep.push([ancien,nomGrossesse()])}
  const nom=a==='grossesse'?nomGrossesse():a==='bebe'?((P().naissance||{}).prenomBebe||''):'';const plur=nbAffiche()>1&&nom;
  if(!rep.length&&!plur)return;const w=document.createTreeWalker(document.getElementById('app')||app,NodeFilter.SHOW_TEXT);let t;
  while((t=w.nextNode())){if(t.parentElement&&t.parentElement.closest('input,textarea,select,.pf-sw,.pf-set'))continue;let v=t.nodeValue,o=v;
    rep.forEach(([x,y])=>{v=v.split(x).join(y)});
    if(plur){v=v.split(nom+' a ').join(nom+' ont ').split(nom+' est arrivé(e)').join(nom+' sont arrivés').split(nom+' est arrivée').join(nom+' sont arrivées').split(nom+' est arrivé').join(nom+' sont arrivés').split('Bonjour, '+nom).join('Bonjour, '+nom)}
    if(v!==o)t.nodeValue=v}}
/* ---------- branchements ---------- */
if(typeof pParametres==='function'){const _pp=pParametres;pParametres=function(){const h=_pp.apply(this,arguments);if(S.role!=='parent')return h;return h+carteSuivis()}}
const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(S.role==='parent'&&!S.vue&&['accueil','suivi','journal'].includes(S.tab||'accueil')){const app=document.getElementById('app');
    const b=bandeau();if(b){const t=document.createElement('template');t.innerHTML=b;app.prepend(t.content)}
    if(actif()==='grossesse'&&nbGrossesse()>1&&(S.tab==='accueil'||S.tab==='suivi')&&!S.sub){const c=document.createElement('template');c.innerHTML=carteMultiple();const ref=app.querySelector('.b3h-carte,.bebe-carte')||app.querySelector(':scope>.pf-sw');if(ref)ref.after(c.content);else app.prepend(c.content)}
    if(S.tab==='journal'){const cb=choixBebe();if(cb){const t=document.createElement('template');t.innerHTML=cb;const tabs=app.querySelector('.jb-tabs');if(tabs)tabs.before(t.content)}}
    corrigerTextes()}}catch(e){}return x};
document.addEventListener('change',e=>{const s=e.target;if(!s||!/^(pf_nb|pfb_nb)$/.test(s.id))return;const pref=s.id==='pf_nb'?'pf':'pfb',n=+s.value;document.querySelectorAll('#'+pref+'_noms .pf-nom').forEach(l=>{l.hidden=+l.dataset.i>=n;const lb=l.firstChild;if(lb&&lb.nodeType===3)lb.nodeValue='Prénom '+(n>1?'du bébé '+(+l.dataset.i+1):'de bébé')+' (facultatif)'})});
document.addEventListener('click',e=>{const g=s=>e.target.closest(s);let b;
  if(b=g('[data-pf]')){e.stopPropagation();S.parent.profil=b.dataset.pf;sauver();S.sub='';render();scrollTo(0,0);return}
  if(b=g('[data-pf-sel]')){e.stopPropagation();S.bbSel=+b.dataset.pfSel;render();return}
  if(b=g('[data-pf-cycle]')){e.stopPropagation();const on=b.dataset.pfCycle==='1';S.parent.suiviCycle=on;if(!on&&S.parent.parcours==='conception')S.parent.parcours=bebeActif()?'bebe':grossesseActive()?'grossesse':'';if(on)S.parent.profil='cycle';sauver();render();toast(on?'Suivi du cycle activé':'Suivi du cycle retiré');return}
  if(b=g('[data-pf-gr]')){e.stopPropagation();fGrossesse(b.dataset.pfGr==='edit');return}
  if(b=g('[data-pf-bb]')){e.stopPropagation();fBebe(b.dataset.pfBb==='edit');return}
  if(b=g('[data-pf-gsave]')){e.stopPropagation();const ddr=$('#pf_ddr').value,dpa=$('#pf_dpa').value,edit=b.dataset.pfGsave==='1',ed=($('#pf_ed')||{}).value||'',es=($('#pf_es')||{}).value,ej=($('#pf_ej')||{}).value;
    if(ed&&(es===''||!(+es>=4&&+es<=42))){toast('Indiquez les semaines à l\'échographie (entre 4 et 42)');return}if(ej!==''&&ej!=null&&!(+ej>=0&&+ej<=6)){toast('Les jours vont de 0 à 6');return}if(!ed&&es!==''&&es!=null){toast('Ajoutez la date de l\'échographie');return}
    if(!ddr&&!dpa&&!ed){toast('Entrez une date : dernières règles, date prévue ou échographie');return}const p=S.parent;
    p.echoDate=ed;p.echoSA=ed?String(+es):'';p.echoJ=ed?String(+(ej||0)):'';p.ddr=ddr||'';p.dpaEquipe=dpa||'';const n=+$('#pf_nb').value||1;p.nbBebesGrossesse=n;p.prenomsGrossesse=lireNoms('pf',n);p.grossesseFinie=false;p.suiviCycle=edit?p.suiviCycle:false;p.profil='grossesse';
    if(!bebeActif()){p.naissance=Object.assign({},p.naissance||{},{prenomBebe:joindre(p.prenomsGrossesse.filter(Boolean))||(n===2?'Vos jumeaux':n===3?'Vos triplés':(p.naissance||{}).prenomBebe||'')})}
    if(!grossesseActive()){toast('Cette date ne correspond pas à une grossesse en cours');return}sauver();close();S.vue=null;S.tab='accueil';render();toast(edit?'Grossesse mise à jour':'Grossesse inscrite 💗');return}
  if(g('[data-pf-gfin]')){e.stopPropagation();S.parent.grossesseFinie=true;S.parent.profil='';sauver();close();render();toast('Grossesse retirée');return}
  if(b=g('[data-pf-bsave]')){e.stopPropagation();const d=$('#pf_bd').value,edit=b.dataset.pfBsave==='1';if(!d){toast('Choisissez la date de naissance');return}const p=S.parent,n=+$('#pfb_nb').value||1,L=lireNoms('pfb',n);
    if(!edit&&bebeActif()){p.enfants=(p.enfants||[]).concat([Object.assign({},p.naissance)])}
    p.naissance=Object.assign({},edit?p.naissance:{},{date:d,nb:n,prenoms:L,prenomBebe:joindre(L.filter(Boolean))||(n===2?'Vos jumeaux':n===3?'Vos triplés':(edit?(p.naissance||{}).prenomBebe:'')||''),sexe:$('#pf_bs').value||''});
    if(!edit){p.grossesseFinie=true;p.parcours='bebe'}p.profil='bebe';sauver();close();S.vue=null;S.tab='accueil';render();toast(edit?'Informations mises à jour':'Bienvenue au monde 💗');return}
},true);
(function(){const st=document.createElement('style');st.textContent=
 '.pf-sw{display:flex;gap:6px;padding:5px;margin:0 0 14px;border-radius:999px;background:var(--soft);overflow-x:auto;scrollbar-width:none}.pf-sw::-webkit-scrollbar{display:none}'+
 '.pf-sw button{flex:1 0 auto;display:flex;align-items:center;justify-content:center;gap:6px;border:0;border-radius:999px;padding:9px 14px;background:transparent;color:var(--muted);font:600 .86rem var(--f-body);cursor:pointer;white-space:nowrap}.pf-sw button[aria-selected=true]{background:var(--card);color:var(--ink);box-shadow:0 2px 8px rgba(70,45,30,.12)}'+
 '.pf-set .pf-l{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-top:1px solid var(--line)}.pf-set .pf-l div{display:flex;flex-direction:column;min-width:0}.pf-set small{color:var(--muted);font-size:.8rem}'+
 '.pf-bb{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px}.pf-mult{border-left:4px solid var(--accent)}';
 document.head.appendChild(st)})();
})();
