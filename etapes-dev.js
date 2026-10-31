/* Sérénaissance — « Étapes du développement de bébé » (Espace Famille) : mois par mois et semaine par semaine.
   Dans la Bibliothèque (Infos) et depuis la carte de bébé de l'accueil. Les mesures viennent des mêmes tables que « Mon bébé » (moyennes). */
(function(){
if(typeof pInfos!=='function'||typeof fruit!=='function'||typeof stage!=='function')return;
const MOIS=[
 ['Mois 1',1,4,'L\'œuf fécondé devient un blastocyste et s\'installe dans l\'utérus.',['Fécondation, puis implantation dans la paroi de l\'utérus (vers la semaine 4).','Les cellules qui formeront bébé et le placenta s\'organisent.','Le test de grossesse devient positif vers la date des règles attendues.']],
 ['Mois 2',5,8,'L\'embryon prend sa forme allongée, un peu comme un petit hippocampe.',['Le tube neural se forme : c\'est le futur cerveau et la moelle épinière.','Le cœur commence à battre, souvent visible à l\'échographie vers la semaine 6.','Les bourgeons des bras et des jambes apparaissent, puis le visage se dessine.']],
 ['Mois 3',9,13,'Vers la semaine 10, l\'embryon devient officiellement un fœtus.',['Apparence humaine bien distincte : doigts et orteils séparés.','Les organes sont formés et continuent de mûrir.','Bébé commence à bouger, même si vous ne le sentez pas encore.','Échographie du 1er trimestre, entre 11 et 14 semaines.']],
 ['Mois 4',14,17,'Bébé grandit vite et sa peau est encore très fine.',['Il fait des grimaces, avale et suce son pouce.','Un fin duvet (lanugo) couvre sa peau.','Son ouïe se développe : il commence à percevoir les sons.']],
 ['Mois 5',18,22,'Vous commencez à sentir ses mouvements.',['Premiers « papillons », puis de vrais petits coups.','Le vernix caseosa, une substance qui protège sa peau, apparaît vers 20 semaines.','Échographie de la mi-grossesse (morphologique), vers 20 à 22 semaines.']],
 ['Mois 6',23,27,'Ses sens s\'éveillent.',['Il réagit aux bruits forts et à la lumière.','Ses poumons continuent de se préparer à respirer l\'air.','Il bouge, s\'étire et a parfois le hoquet.']],
 ['Mois 7',28,31,'Début du 3e trimestre (29 semaines).',['Ses yeux s\'ouvrent.','Des périodes de sommeil et d\'éveil s\'installent.','Il accumule du tissu graisseux et prend du poids rapidement.']],
 ['Mois 8',32,36,'Bébé se prépare à la naissance.',['Il se place souvent la tête en bas.','Il gagne environ 200 g par semaine.','Ses poumons mûrissent et ses os durcissent (sauf le crâne, qui reste souple).']],
 ['Mois 9',37,42,'Bébé est à terme dès 37 semaines.',['Il est prêt à naître, mesure autour de 50 cm et pèse souvent entre 3 et 3,5 kg.','Il descend dans le bassin quand le travail approche.','Chaque bébé arrive à son rythme, entre 37 et 42 semaines.']]
];
const cur=()=>{try{const st=stage();return st.k==='preg'?Math.max(4,Math.min(42,st.g.w)):null}catch(e){return null}};
const poids=g=>!g?'< 1 g':g>=1000?(g/1000).toFixed(1).replace('.',',')+' kg':g+' g';
function vueMois(c){
  return MOIS.map(m=>{const fin=fruit(m[2]),ici=c!=null&&c>=m[1]&&c<=m[2];
    return '<div class="card"><div class="row between"><span class="eyebrow acc">'+m[0]+' · semaines '+m[1]+' à '+m[2]+'</span>'+(ici?'<span class="pill acc">Vous êtes ici</span>':'')+'</div>'+
     '<div class="row" style="gap:12px;align-items:flex-start;flex-wrap:nowrap"><img src="img/bebe/semaine-'+String(m[2]).padStart(2,'0')+'.jpg?v=2" alt="Bébé à la semaine '+m[2]+'" loading="lazy" style="width:92px;height:92px;border-radius:16px;object-fit:cover;flex:0 0 auto"><div><p class="small" style="margin:0 0 4px"><b>'+m[3]+'</b></p><p class="xs muted" style="margin:0">À la fin du mois : environ '+(fin[1]).toString().replace('.',',')+' cm · '+poids(fin[2])+'</p></div></div>'+
     '<ul class="clean small" style="margin-top:10px">'+m[4].map(x=>'<li>'+x+'</li>').join('')+'</ul>'+
     '<button class="btn sm ghost" data-gr="sem" data-w="'+m[2]+'" style="margin-top:6px">Voir la semaine '+m[2]+'</button></div>'}).join('')}
function vueSemaines(c){
  const P=window.SEM_PLUS||{};let h='<div class="card"><span class="eyebrow acc">Touchez une semaine</span><p class="xs muted">Photo de bébé, mesures, ce qu\'il vit et ce que vous vivez.</p><div class="list">';
  for(let w=4;w<=42;w++){const t=(P[w]||[])[0]||'';h+='<button class="li" data-gr="sem" data-w="'+w+'" style="width:100%;text-align:left;background:none;border:0;border-bottom:1px solid var(--line,rgba(128,128,128,.25));border-radius:0;padding:12px 2px;display:flex;gap:10px;align-items:center;color:inherit;cursor:pointer"><span style="font-weight:700;min-width:64px;display:inline-block">Sem. '+w+'</span><span class="small">'+(t?String(t).replace(/</g,'&lt;'):'')+'</span>'+(c===w?' <span class="pill acc">Cette semaine</span>':'')+'</button>'}
  return h+'</div></div>'}
function page(){const c=cur(),v=S.etV||'mois';
  return back('sub','','Bibliothèque')+sh('Étapes du développement de bébé','Mois par mois et semaine par semaine')+
   '<div class="seg"><button class="chip '+(v==='mois'?'on':'')+'" data-et="mois">Mois par mois</button><button class="chip '+(v==='sem'?'on':'')+'" data-et="sem">Semaine par semaine</button></div>'+
   (v==='sem'?vueSemaines(c):vueMois(c))+'<p class="xs muted">Ce sont des moyennes : chaque bébé grandit à son rythme. Les semaines sont comptées en semaines d\'aménorrhée, comme sur vos échographies. Pour toute question, parlez-en à votre professionnel de santé ou à votre doula.</p>'}
const _pI=pInfos;
pInfos=function(){if(S.sub==='etapes')return page();let h=_pI.apply(this,arguments);
  const tuile='<button class="cl" data-act="sub" data-v="etapes"><div class="av" style="background:var(--accent-lt);color:var(--accent)">'+icon('fa-seedling')+'</div><div style="flex:1;min-width:0"><b>Étapes du développement de bébé</b><p class="xs muted">Mois par mois, semaine par semaine</p></div>'+icon('fa-chevron-right','var(--muted)')+'</button>';
  const i=h.indexOf('<button class="cl" data-act="sub" data-v="alertes"');return i>=0?h.slice(0,i)+tuile+h.slice(i):h+tuile};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-et]');if(!b)return;e.stopPropagation();e.preventDefault();S.etV=b.dataset.et;render()},true);
/* lien depuis la carte de bébé de l'accueil */
const _cb=carteBebe;
carteBebe=function(g){let h=_cb(g);try{if(h.indexOf('class="bh-bas"')>=0){const k=h.indexOf('<h2 class="bb2-h">');const lien='<button class="btn sm ghost" data-act="go" data-v="infos|etapes" style="margin:10px 0 2px;width:100%">'+icon('fa-seedling')+' Étapes du développement : mois par mois, semaine par semaine</button>';
  const j=h.indexOf('</div></div>',h.indexOf('class="bh-bas"'));if(j>=0)h=h.slice(0,j+12)+lien+h.slice(j+12)}}catch(e){}return h};
})();
