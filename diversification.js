/* Sérénaissance — Journal bébé : « Diversification alimentaire », à partir de 6 mois.
   Un onglet de plus dans le Journal bébé : noter les aliments (nouvel aliment, allergène, quantité, réaction),
   les aliments déjà essayés, les allergènes déjà présentés, et un guide : quand commencer, par quoi, textures, allergènes,
   aliments à éviter, combien, boissons. Repères de Santé Canada et de la Société canadienne de pédiatrie (note pour la France). */
(function(){
if(window.ESPACE!=='parent'||typeof pJournal!=='function')return;
const J=864e5,j0=t=>{const d=new Date(t);d.setHours(0,0,0,0);return +d};
function mois(b){const n=new Date(),B=new Date(b);let m=(n.getFullYear()-B.getFullYear())*12+n.getMonth()-B.getMonth();if(n.getDate()<B.getDate())m--;return Math.max(0,m)}
function actif(){try{const st=stage();return st.k==='pp'&&mois(st.birth)>=6}catch(e){return false}}
const ALLERG=[['oeuf','Œuf'],['arachide','Arachides'],['lait','Produits laitiers'],['noix','Noix'],['soya','Soya'],['ble','Blé'],['poisson','Poisson'],['crustaces','Crustacés et fruits de mer'],['sesame','Sésame'],['moutarde','Moutarde']];
const FER=['Bœuf haché','Poulet','Œuf bien cuit','Tofu','Lentilles','Saumon','Céréales enrichies de fer','Pois chiches','Dinde','Haricots'];
const AUTRES=['Patate douce','Avocat','Banane','Brocoli','Courge','Pomme','Poire','Carotte','Yogourt nature','Beurre d\'arachide dilué'];
const QTE={gout:'Quelques goûts',cuil:'Quelques cuillères',petit:'Petite portion',bon:'Bonne portion'};
const REAC={aime:'A aimé',neutre:'Bof',refus:'A refusé',reaction:'Réaction (rougeurs, vomissements…)'};
const nom=()=>{try{return esc(((S.parent.naissance||{}).prenomBebe||'').trim()||'bébé')}catch(e){return 'bébé'}};
/* type de note « solide » dans le journal */
try{LOGMETA.solide=['fa-utensils','Diversification']}catch(e){}
if(typeof logText==='function'){const _lt=logText;logText=function(l){if(l&&l.type==='solide')return esc(l.aliment||'Aliment')+(l.nouveau?' · nouveau':'')+(l.allerg&&l.allerg.length?' · allergène : '+l.allerg.map(k=>(ALLERG.find(a=>a[0]===k)||[,k])[1].toLowerCase()).join(', '):'')+(l.qte?' · '+(QTE[l.qte]||'').toLowerCase():'')+(l.reac?' · '+(REAC[l.reac]||'').toLowerCase():'')+(l.note?' · '+esc(l.note):'');return _lt.apply(this,arguments)}}
function dvLogs(){return (S.logs||[]).filter(l=>l.type==='solide')}
function dejaEssayes(){const m=new Map();dvLogs().sort((a,b)=>a.t-b.t).forEach(l=>{const k=(l.aliment||'').trim().toLowerCase();if(!k)return;const o=m.get(k)||{n:l.aliment.trim(),c:0,reac:false};o.c++;if(l.reac==='reaction')o.reac=true;m.set(k,o)});return [...m.values()]}
function allergVus(){const v={};dvLogs().forEach(l=>(l.allerg||[]).forEach(k=>{v[k]=(v[k]||0)+1}));return v}
function formSolide(){const deja=dejaEssayes().map(x=>x.n.toLowerCase());
  const puce=x=>'<button type="button" class="chip dvs-p'+(deja.includes(x.toLowerCase())?' deja':'')+'" data-dvs-al="'+esc(x)+'">'+esc(x)+'</button>';
  sheet('Diversification · noter un aliment','<label class="f">Aliment<input id="dv_al" placeholder="Ex. : lentilles en purée" autocomplete="off"></label>'+
    '<p class="xs muted" style="margin:-4px 0 4px">Riches en fer, à offrir en premier :</p><div class="dvs-ps">'+FER.map(puce).join('')+'</div>'+
    '<p class="xs muted" style="margin:8px 0 4px">Autres idées :</p><div class="dvs-ps">'+AUTRES.map(puce).join('')+'</div>'+
    '<label class="check" style="margin-top:10px"><input type="checkbox" id="dv_nouv"><span>Premier essai de cet aliment</span></label>'+
    '<p class="small" style="margin:10px 0 4px"><b>Contient un allergène fréquent ?</b></p><div class="dvs-ps">'+ALLERG.map(a=>'<button type="button" class="chip" data-act="toggleChip" data-dv-allerg="'+a[0]+'">'+a[1]+'</button>').join('')+'</div>'+
    '<div class="grid2" style="margin-top:10px"><label class="f">Quantité<select id="dv_q">'+Object.entries(QTE).map(([k,v])=>'<option value="'+k+'"'+(k==='cuil'?' selected':'')+'>'+v+'</option>').join('')+'</select></label>'+
    '<label class="f">Réaction<select id="dv_r">'+Object.entries(REAC).map(([k,v])=>'<option value="'+k+'"'+(k==='aime'?' selected':'')+'>'+v+'</option>').join('')+'</select></label></div>'+
    '<label class="f">Note (texture, préparation…)<input id="dv_n" placeholder="Ex. : en purée lisse, avec cuillère"></label>'+W()+
    '<p class="xs muted">Difficulté à respirer, enflure du visage ou de la langue, vomissements répétés ou bébé très mou après un aliment : <b>911</b>.</p>'+
    '<button class="btn" data-dvs-save="1">Enregistrer</button>')}
async function sauverSolide(){const al=($('#dv_al').value||'').trim();if(!al){toast('Écrivez l\'aliment');return}
  const allerg=[...document.querySelectorAll('.sheet [data-dv-allerg].on')].map(x=>x.dataset.dvAllerg);const reac=$('#dv_r').value;
  await addLog({type:'solide',aliment:al,nouveau:$('#dv_nouv').checked,allerg,qte:$('#dv_q').value,reac,note:$('#dv_n').value,t:getT()});
  if(reac==='reaction')setTimeout(()=>toast('Réaction notée : parlez-en à votre médecin avant de le réoffrir. Urgence : 911'),400)}
document.addEventListener('click',e=>{const p=e.target.closest('[data-dvs-al]');if(p){e.stopPropagation();const i=$('#dv_al');if(i)i.value=p.dataset.dvsAl;
    const lc=p.dataset.dvsAl.toLowerCase(),c=$('#dv_nouv');if(c)c.checked=!dejaEssayes().some(x=>x.n.toLowerCase()===lc);
    const auto={'œuf bien cuit':'oeuf','saumon':'poisson','tofu':'soya','yogourt nature':'lait','beurre d\'arachide dilué':'arachide','céréales enrichies de fer':'ble'}[lc];
    if(auto){const b=document.querySelector('.sheet [data-dv-allerg="'+auto+'"]');if(b&&!b.classList.contains('on'))b.classList.add('on')}return}
  if(e.target.closest('[data-dvs-save]')){e.stopPropagation();sauverSolide();return}
  if(e.target.closest('[data-dvs-add]')){e.stopPropagation();formSolide();return}},true);
/* la page */
const acc=(t,body,ouvert)=>'<details class="acc"'+(ouvert?' open':'')+'><summary>'+t+'<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body">'+body+'</div></details>';
const ul=a=>'<ul class="clean dv-l">'+a.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
function guide(m){const n=nom();
  return '<div class="card"><span class="eyebrow acc">Guide</span><h2>Bien commencer les aliments</h2><p class="small muted">Le lait maternel ou la préparation reste la base jusqu\'à 1 an : les aliments s\'ajoutent, ils ne remplacent pas.</p>'+
  acc('Quand commencer ?',ul(['<b>Vers 6 mois</b> pour la plupart des bébés, quand '+n+' montre qu\'il est prêt. Jamais avant 4 mois.',
    'Il se tient assis avec peu d\'appui et tient bien sa tête.','Il ouvre la bouche quand la cuillère approche et s\'intéresse à ce que vous mangez.','Il ne repousse plus systématiquement la nourriture avec la langue et peut la prendre avec ses mains.',
    'Bébé prématuré : parlez-en avec votre professionnel pour le bon moment.']),m<7)+
  acc('Par quoi commencer : le fer d\'abord',ul(['Ses réserves de fer baissent vers 6 mois : offrez un <b>aliment riche en fer au moins 2 fois par jour</b>.',
    'Viande, volaille ou poisson bien cuits et hachés finement, œuf bien cuit, tofu, lentilles, haricots ou pois chiches en purée, céréales pour bébé enrichies de fer.',
    'Ensuite, ajoutez légumes, fruits, produits céréaliers et produits laitiers (yogourt nature, fromage), sans ordre précis.',
    'Pas besoin d\'attendre plusieurs jours entre chaque nouvel aliment (sauf allergènes : un à la fois).']),m<7)+
  acc('Les textures selon l\'âge',ul(['<b>6 mois</b> : purées lisses ou écrasées à la fourchette, et petits morceaux tendres qu\'il prend avec ses doigts.',
    '<b>7-8 mois</b> : écrasé avec grumeaux, haché, morceaux mous (banane, avocat, légumes bien cuits).','<b>9 mois au plus tard</b> : textures avec morceaux. Attendre plus tard rend souvent la transition difficile.',
    '<b>Vers 12 mois</b> : la plupart des aliments de la famille, coupés en petits morceaux tendres.','Toujours assis, surveillé, jamais en marchant ou en auto.'],m>=7))+
  acc('Les allergènes',ul(['Offrez les allergènes fréquents <b>vers 6 mois</b>, sans les retarder : œuf cuit, arachides (beurre d\'arachide dilué, jamais d\'arachides entières), produits laitiers, poisson, blé, soya, sésame, noix moulues…',
    '<b>Un nouvel allergène à la fois</b>, à la maison, idéalement le matin, pour bien observer.','Une fois toléré, <b>continuez à l\'offrir régulièrement</b> (quelques fois par semaine) pour garder la tolérance.',
    'Eczéma sévère ou allergie déjà connue : parlez-en au médecin avant.','Urgence (difficulté à respirer, enflure, vomissements répétés, bébé mou) : <b>911</b>.']))+
  acc('À éviter',ul(['<b>Miel</b> (même cuit) avant 1 an : risque de botulisme.','<b>Lait de vache</b> comme boisson principale avant 9 à 12 mois. Ensuite, lait 3,25 % dans un verre ouvert, au plus 750 ml par jour. Les boissons végétales ne le remplacent pas.',
    'Aliments à risque d\'étouffement : noix et arachides entières, maïs soufflé, raisins et tomates cerises entiers (coupez en 4), saucisses en rondelles, bonbons, morceaux durs crus (carotte, pomme).',
    'Sel et sucre ajoutés, jus (même 100 %), boissons sucrées, aliments ultra-transformés.','Poissons riches en mercure (espadon, requin, thon frais ou albacore en grande quantité), lait et fromages non pasteurisés, œuf ou viande pas assez cuits.']))+
  acc('Combien et à quelle fréquence ?',ul(['<b>6-8 mois</b> : 2 à 3 repas par jour, en commençant par quelques cuillères.','<b>9-12 mois</b> : 3 repas et 1 à 2 collations.','<b>12 mois et plus</b> : 3 repas et 2 à 3 collations, au rythme de la famille.',
    'Vous décidez quoi, quand et où ; '+n+' décide <b>combien</b>. Suivez ses signes de faim et de satiété, sans insister ni forcer.','Un refus est normal : un nouvel aliment peut demander 10 à 15 essais.']))+
  acc('Boissons',ul(['Allaitement : continuez aussi longtemps que vous le souhaitez, jusqu\'à 2 ans et plus.','Bébé allaité : vitamine D (400 UI) chaque jour.','Un peu d\'eau dans un verre ouvert dès 6 mois, aux repas.','Pas de jus ni de boisson sucrée.']))+
  '<p class="xs muted" style="margin-top:8px">En France, la diversification commence entre 4 et 6 mois, comme recommandé par Santé publique France ; les grands principes restent les mêmes.</p>'+
  '<p class="xs muted">Sources : <a href="https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/infant-feeding/nutrition-healthy-term-infants-recommendations-birth-six-months/6-24-months.html" target="_blank" rel="noopener">Santé Canada</a> · <a href="https://soinsdenosenfants.cps.ca/handouts/pregnancy-and-babies/feeding_your_baby_in_the_first_year" target="_blank" rel="noopener">Soins de nos enfants (SCP)</a> · <a href="https://www.inspq.qc.ca/mieux-vivre" target="_blank" rel="noopener">Mieux vivre avec notre enfant</a></p></div>'}
function page(st){const m=mois(st.birth),L=dvLogs().sort((a,b)=>b.t-a.t),auj=j0(Date.now()),A=L.filter(l=>l.t>=auj),E=dejaEssayes(),V=allergVus();
  let h='<div class="jb-ajout"><button class="btn" data-dvs-add="1">'+icon('fa-plus')+'Noter un aliment</button></div>';
  h+='<div class="card"><div class="jb-stats"><div class="jb-stat"><b>'+A.length+'</b><span>repas aujourd\'hui</span></div><div class="jb-stat"><b>'+E.length+'</b><span>aliments essayés</span></div><div class="jb-stat"><b>'+Object.keys(V).length+' / '+ALLERG.length+'</b><span>allergènes présentés</span></div></div></div>';
  if(!L.length)h+='<div class="card tint"><span class="eyebrow acc">'+m+' mois</span><h2>Prêt pour les premières cuillères ?</h2><p class="small">Commencez par un aliment riche en fer : viande, œuf bien cuit, tofu, lentilles ou céréales enrichies de fer. Touchez « Noter un aliment » après chaque essai : l\'appli garde la liste des aliments et des allergènes déjà présentés.</p></div>';
  if(E.length)h+='<div class="card"><span class="eyebrow acc">Déjà essayés</span><div class="dvs-ps" style="margin-top:6px">'+E.map(x=>'<span class="chip'+(x.reac?' dvs-reac':'')+'">'+(x.reac?'⚠️ ':'')+esc(x.n)+(x.c>1?' <small>×'+x.c+'</small>':'')+'</span>').join('')+'</div>'+(E.some(x=>x.reac)?'<p class="xs muted" style="margin-top:6px">⚠️ = une réaction a été notée : parlez-en à votre médecin avant de le réoffrir.</p>':'')+'</div>';
  h+='<div class="card"><span class="eyebrow acc">Allergènes fréquents</span><p class="xs muted">À présenter un à la fois vers 6 mois, puis à garder au menu régulièrement.</p><div class="dvs-al">'+ALLERG.map(a=>{const n=V[a[0]]||0;return '<div class="dvs-ali'+(n?' ok':'')+'"><span>'+(n?'✓':'')+'</span><b>'+a[1]+'</b><small>'+(n?n+' fois':'pas encore')+'</small></div>'}).join('')+'</div></div>';
  if(L.length)h+='<div class="card"><span class="eyebrow acc">Derniers repas</span><div class="list">'+L.slice(0,15).map(l=>'<div class="li"><div class="ic">'+icon('fa-utensils')+'</div><div class="tx"><b>'+esc(l.aliment||'Aliment')+' · '+fmtD(new Date(l.t),{day:'numeric',month:'short'})+' '+fmtT(l.t)+'</b><span>'+logText(l)+'</span></div><button class="icon-btn" data-act="delLog" data-id="'+l.id+'" aria-label="Supprimer">'+icon('fa-trash')+'</button></div>').join('')+'</div></div>';
  return h+guide(m)}
const _pJ=pJournal;
pJournal=function(){if(S.jbTab==='solides'&&!actif())S.jbTab='repas';
  if(S.jbTab!=='solides'){const h=_pJ.apply(this,arguments);if(!actif())return h;return ajoutOnglet(h,false)}
  S.jbTab='repas';let h;try{h=_pJ.apply(this,arguments)}finally{S.jbTab='solides'}
  const t=document.createElement('template');t.innerHTML=ajoutOnglet(h,true);const tabs=t.content.querySelector('.jb-tabs');let keep=[];
  [...t.content.childNodes].forEach(n=>{if(n.nodeType===1&&(n.classList.contains('jb-tete')||n===tabs))keep.push(n)});
  return keep.map(n=>n.outerHTML).join('')+page(stage())};
function ajoutOnglet(h,sel){const t=document.createElement('template');t.innerHTML=h;const tabs=t.content.querySelector('.jb-tabs');if(!tabs)return h;
  if(sel)tabs.querySelectorAll('[aria-selected]').forEach(b=>b.setAttribute('aria-selected','false'));
  const r=tabs.querySelector('[data-jb="repas"]'),b=document.createElement('template');b.innerHTML='<button role="tab" aria-selected="'+sel+'" data-jb="solides">'+icon('fa-utensils')+'<span>Diversification</span></button>';
  if(r)r.after(b.content);else tabs.prepend(b.content);
  if(!sel&&(S.jbTab||'repas')==='repas'){const aj=t.content.querySelector('.jb-ajout');if(aj){const x=document.createElement('template');x.innerHTML='<button class="btn" data-dvs-add="1">'+icon('fa-plus')+'Aliment</button>';aj.append(x.content)}}
  return [...t.content.childNodes].map(n=>n.outerHTML||n.textContent||'').join('')}
(function(){const st=document.createElement('style');st.textContent=
  '.dvs-ps{display:flex;flex-wrap:wrap;gap:6px}.dvs-ps .chip{font-size:.8rem}.dvs-p.deja{opacity:.6}.dvs-reac{border-color:var(--warn,#c9822b)!important}'+
  '.dvs-al{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin-top:8px}.dvs-ali{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:14px;background:var(--soft);flex-wrap:wrap}'+
  '.dvs-ali span{width:22px;height:22px;border-radius:50%;border:2px solid var(--line);display:grid;place-items:center;font-size:.75rem;font-weight:700;flex:none}.dvs-ali.ok span{background:var(--sage);border-color:var(--sage);color:#fff}'+
  '.dvs-ali b{font-size:.82rem;flex:1;min-width:0}.dvs-ali small{width:100%;padding-left:30px;font-size:.7rem;color:var(--muted);margin-top:-4px}'+
  '.dv-l li{padding:5px 0 5px 20px;position:relative}.dv-l li::before{content:"";position:absolute;left:4px;top:13px;width:7px;height:7px;border-radius:50%;background:var(--accent-lt,#f2c9b9)}';
  document.head.appendChild(st)})();
})();
