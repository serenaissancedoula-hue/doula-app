/* Sérénaissance — « Mon bébé en 3D » : vrai modèle 3D (Sketchfab, « Human Fetus / Stages of fetal development » par arloopa),
   affiché avec le lecteur officiel de Sketchfab. Chaque semaine, on montre le stade le plus proche
   et bébé grossit un peu jusqu'au stade suivant. Le texte de la semaine vient de SEMAINES (bebe-donnees.js).
   Ajoutez ?bebe3d=debug à l'adresse pour voir la liste des stades trouvés dans le modèle. */
/* Modèle choisi : « Fetus (animated) » par Ebers (un seul bébé). Pour une série par stades, mettre BEBE3D_STADES=true. */
/* Modèle : « Human Fetus / Stages of fetal development » par arloopa. Son animation fait grandir bébé :
   on l'arrête au moment qui correspond à la semaine (image fixe, qu'on peut faire tourner).
   BEBE3D_TEMPS permet d'ajuster le moment exact de chaque semaine après un essai : [[semaine, secondes], ...]. */
const BEBE3D_UID='db86ba90c4d3400f8fada9ffa8bf3c55';
const BEBE3D_STADES=false;
const BEBE3D_ANIM=true;
const BEBE3D_TEMPS=null;
/* Teintes de peau : multiplient la couleur d'origine du modèle. */
const BEBE3D_PEAUX=[['Naturelle',[1,1,1],'#efb6a6'],['Dorée',[.93,.8,.66],'#d9a37f'],['Mate',[.78,.6,.46],'#b9825f'],['Brune',[.6,.43,.31],'#8e5d40'],['Foncée',[.44,.3,.21],'#63402c']];
const BEBE3D_SENS=[
  [4,8,'Ses sens ne fonctionnent pas encore : le cerveau, le cœur et la moelle épinière se mettent en place.'],
  [9,13,'Il réagit au toucher : quand sa main frôle sa bouche, il bouge. Il ne voit et n\'entend pas encore.'],
  [14,17,'Ses papilles se forment. Il perçoit une lumière forte à travers ses paupières fermées.'],
  [18,22,'Il commence à entendre : votre cœur, votre respiration, les bruits de votre ventre, puis votre voix.'],
  [23,27,'Il entend de mieux en mieux et peut sursauter à un bruit fort. Il goûte le liquide amniotique, qui change selon ce que vous mangez.'],
  [28,31,'Il reconnaît votre voix et celle de vos proches. Ses yeux s\'ouvrent : il perçoit la lumière à travers le ventre.'],
  [32,35,'Le langage s\'installe : il s\'habitue à la mélodie et au rythme de votre langue, et peut se souvenir d\'une chanson souvent entendue.'],
  [36,42,'Tous ses sens sont prêts. À la naissance, il reconnaîtra votre voix, votre odeur et le battement de votre cœur.']];
function bebe3dSens(w){const s=BEBE3D_SENS.find(x=>w>=x[0]&&w<=x[1]);return s?s[2]:''}
function bebe3dEsc(t){return String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

/* Lecteur Sketchfab */
let _b3={api:null,stades:[],pret:false,w:20,dernier:-1,cb:[]};
function bebe3dChargerAPI(){return new Promise((ok,ko)=>{if(window.Sketchfab)return ok();
  const s=document.createElement('script');s.src='https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';s.onload=()=>ok();s.onerror=ko;document.head.appendChild(s)})}
function bebe3dNum(n){const m=String(n||'').match(/(\d+(?:[.,]\d+)?)/);return m?parseFloat(m[1].replace(',','.')):null}
/* Trouve les stades : le premier niveau du modèle qui contient plusieurs groupes. */
function bebe3dStades(map){
  const nodes=Object.values(map),enfants=new Set();nodes.forEach(n=>(n.children||[]).forEach(c=>enfants.add(c.instanceID)));
  let n=nodes.find(x=>!enfants.has(x.instanceID));let garde=0;
  while(n&&n.children&&n.children.length===1&&garde++<12)n=map[n.children[0].instanceID]||n.children[0];
  let st=(n&&n.children||[]).map(c=>map[c.instanceID]||c).filter(c=>c.type!=='Geometry'||true);
  // tri par numéro dans le nom (ex. « Week 12 »), sinon ordre du modèle
  const nums=st.map(s=>bebe3dNum(s.name));
  if(nums.every(v=>v!==null))st=st.map((s,i)=>({s,v:nums[i]})).sort((a,b)=>a.v-b.v).map(o=>o.s);
  return st.map((s,i)=>{const v=bebe3dNum(s.name);return{id:s.instanceID,nom:s.name,sem:(v!==null&&v>=4&&v<=42)?v:null}})}
function bebe3dSemainesStades(){const S=_b3.stades;if(!S.length)return;
  if(S.some(s=>s.sem===null)){const a=8,b=40;S.forEach((s,i)=>s.sem=S.length===1?20:Math.round(a+(b-a)*i/(S.length-1)))}}
function bebe3dChoix(w){const S=_b3.stades;let i=0;for(let k=0;k<S.length;k++)if(S[k].sem<=w)i=k;
  const cur=S[i],nxt=S[i+1];let f=1;
  if(nxt&&w<nxt.sem){const t=(w-cur.sem)/(nxt.sem-cur.sem);f=1+.18*Math.max(0,Math.min(1,t))} // il grossit un peu chaque semaine
  else if(!nxt&&w>cur.sem)f=1+.03*Math.min(4,w-cur.sem);
  if(w<cur.sem)f=Math.max(.75,1-.06*(cur.sem-w));
  return{i,f:1}} // bébé reste fixe : il change seulement quand on passe à un autre stade
function bebe3dMontrer(w){_b3.w=w;const api=_b3.api;if(api&&_b3.anim)bebe3dTemps(w);if(!api||!_b3.stades.length)return;
  const {i,f}=bebe3dChoix(w),S=_b3.stades;
  const echelle=()=>{const s=S[i];if(!s.base)return;const m=s.base.slice();for(const k of[0,1,2,4,5,6,8,9,10])m[k]*=f;api.setMatrix(s.id,m)};
  if(i!==_b3.dernier){S.forEach((s,k)=>{k===i?api.show(s.id):api.hide(s.id)});
    const s=S[i];const go=()=>{if(s.base)api.setMatrix(s.id,s.base);setTimeout(()=>{try{api.focusOnVisibleGeometries(()=>setTimeout(echelle,250))}catch(e){echelle()}},120)};
    if(!s.base)api.getMatrix(s.id,(e,mat)=>{if(!e&&mat)s.base=Array.from(mat.local);go()});else go();
    _b3.dernier=i}else echelle();
  const d=document.getElementById('b3Debug');if(d)d.textContent='Stade affiché : '+S[i].nom+' (semaine '+S[i].sem+') · taille ×'+f.toFixed(2)}
function bebe3dMonter(conteneur,w){
  conteneur.innerHTML='<iframe title="Bébé en 3D" class="b3-iframe" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen></iframe><div class="b3-charge">Chargement de bébé…</div>';
  const fr=conteneur.querySelector('iframe'),charge=conteneur.querySelector('.b3-charge');_b3.w=w;_b3.dernier=-1;
  bebe3dChargerAPI().then(()=>{
    const client=new Sketchfab('1.12.1',fr);
    client.init(BEBE3D_UID,{autostart:1,animation_autoplay:0,preload:1,transparent:1,camera:0,dnt:1,ui_hint:0,ui_infos:0,ui_controls:0,ui_stop:0,ui_inspector:0,ui_help:0,ui_settings:0,ui_vr:0,ui_ar:0,ui_fullscreen:0,ui_annotations:0,ui_loading:0,ui_theme:'dark',
      success(api){_b3.api=api;api.start();api.addEventListener('viewerready',()=>{charge.hidden=true;
        api.getMaterialList((e,mats)=>{if(!e&&mats){_b3.mats=mats;const dbg=document.getElementById('b3Liste');if(dbg)dbg.textContent+=' · Matériaux : '+mats.map(m=>m.name).join(', ');bebe3dPeau(_b3.peau||0)}});
        if(BEBE3D_ANIM)api.getAnimations((e,an)=>{if(e||!an||!an.length){const d=document.getElementById('b3Liste');if(d)d.textContent+=' · Aucune animation dans ce modèle';return}
          an.sort((a,b)=>b[2]-a[2]);_b3.anim={uid:an[0][0],nom:an[0][1],duree:an[0][2]};
          const d=document.getElementById('b3Liste');if(d)d.textContent+=' · Animations : '+an.map(a=>a[1]+' ('+a[2].toFixed(1)+' s)').join(', ');
          api.setCurrentAnimationByUID(_b3.anim.uid,()=>{api.pause();bebe3dTemps(_b3.w)})});
        if(!BEBE3D_STADES)return;
        api.getNodeMap((e,map)=>{if(e||!map)return;_b3.stades=bebe3dStades(map);bebe3dSemainesStades();
          const dbg=document.getElementById('b3Liste');if(dbg)dbg.textContent='Stades trouvés ('+_b3.stades.length+') : '+_b3.stades.map(s=>s.nom+' → sem. '+s.sem).join(' | ');
          if(_b3.stades.length>1)bebe3dMontrer(_b3.w)})})},
      error(){charge.textContent='Impossible de charger bébé en 3D. Vérifiez votre connexion Internet.'}})
  }).catch(()=>{charge.textContent='Impossible de charger bébé en 3D. Vérifiez votre connexion Internet.'})}

/* Texte de la semaine */
function bebe3dTexte(w){
  const I=(typeof SEMAINES!=='undefined')?SEMAINES.find(s=>s[0]===Math.max(4,Math.min(42,w))):null;
  const M=(typeof mouvement==='function')?mouvement(w):null;
  let f=null;try{if(typeof fruit==='function')f=fruit(w)}catch(e){}
  const em=f&&typeof FRUIT_EMOJI!=='undefined'?(FRUIT_EMOJI[f[0]]||'🌱'):'';
  const bloc=(t,x)=>x?'<div class="b3-bloc"><b>'+t+'</b><p>'+bebe3dEsc(x)+'</p></div>':'';
  return (f?'<p class="b3-taille">'+em+' Grosseur '+(typeof art==='function'?art(f[0]):'d\'un·e ')+bebe3dEsc(f[0])+' · environ '+String(f[1]).replace('.',',')+' cm</p>':'')+
    (w<4?'<p class="b3-taille">Votre grossesse commence : bébé n\'est pas encore visible.</p>':'')+
    bloc('Ce que bébé fait cette semaine',I?I[1]:'')+
    bloc('Ses mouvements',M?M[2]:'')+
    bloc('Ce qu\'il entend et ressent',bebe3dSens(w))+
    bloc('À quoi vous attendre',I?I[2]:'')+
    bloc('Petit conseil',I?I[3]:'')}

/* Couleur de peau : on teinte les matériaux du bébé (pas le placenta ni le cordon). */
function bebe3dPeau(i){_b3.peau=i;const api=_b3.api,mats=_b3.mats;if(!api||!mats)return;
  const c=BEBE3D_PEAUX[i][1],exclu=/placenta|cord|umbil|uter|amnio|sac|vein|arter|blood|eye|oeil|nail|ongle/i;
  let cibles=mats.filter(m=>/skin|body|fetus|foetus|baby|peau|bebe/i.test(m.name));if(!cibles.length)cibles=mats.filter(m=>!exclu.test(m.name));
  cibles.forEach(m=>{const ch=m.channels||{};
    for(const k of['AlbedoPBR','DiffusePBR','DiffuseColor','SubsurfaceScattering']){if(ch[k]){if(!m._orig)m._orig={};if(!m._orig[k])m._orig[k]=(ch[k].color||[1,1,1]).slice();const o=m._orig[k];ch[k].color=[o[0]*c[0],o[1]*c[1],o[2]*c[2]]}}
    api.setMaterial(m,()=>{})})}

/* Animation : moment de l'animation pour une semaine donnée, puis pause (bébé fixe). */
function bebe3dTemps(w){const api=_b3.api,A=_b3.anim;if(!api||!A)return;
  let t;const T=BEBE3D_TEMPS;
  if(T&&T.length){let a=T[0],b=T[T.length-1];for(let k=0;k<T.length-1;k++)if(w>=T[k][0]&&w<=T[k+1][0]){a=T[k];b=T[k+1];break}
    t=b[0]===a[0]?a[1]:a[1]+(b[1]-a[1])*(w-a[0])/(b[0]-a[0])}
  else t=A.duree*Math.max(0,Math.min(1,(w-4)/36));
  t=Math.max(0,Math.min(A.duree-.05,t));
  api.pause();api.seekTo(t);setTimeout(()=>{try{api.pause()}catch(e){}},150);
  const d=document.getElementById('b3Debug');if(d)d.textContent='Semaine '+w+' → '+t.toFixed(2)+' s sur '+A.duree.toFixed(1)+' s ('+A.nom+')'}

/* ---- Données pour la page « Mon bébé en 3D » (taille, trimestre, semaines 0 à 3) ---- */
const B3_FRUITS={4:['graine de pavot',.1,0],5:['graine de sésame',.2,0],6:['lentille',.4,0],7:['bleuet',1,0],8:['framboise',1.6,1],9:['cerise',2.3,2],10:['fraise',3.1,4],11:['figue',4.1,7],12:['lime',5.4,14],13:['citron',7.4,23],14:['nectarine',8.7,43],15:['pomme',10.1,70],16:['avocat',11.6,100],17:['poire',13,140],18:['poivron',14.2,190],19:['mangue',15.3,240],20:['banane',25.6,300],21:['carotte',26.7,360],22:['papaye',27.8,430],23:['pamplemousse',28.9,500],24:['épi de maïs',30,600],25:['chou-fleur',34.6,660],26:['laitue romaine',35.6,760],27:['brocoli',36.6,875],28:['aubergine',37.6,1000],29:['courge musquée',38.6,1150],30:['chou',39.9,1300],31:['noix de coco',41.1,1500],32:['céleri-rave',42.4,1700],33:['ananas',43.7,1900],34:['cantaloup',45,2100],35:['melon miel',46.2,2400],36:['laitue pommée',47.4,2600],37:['bette à carde',48.6,2900],38:['poireau',49.8,3100],39:['mini melon d\'eau',50.7,3300],40:['citrouille',51.2,3500],41:['melon d\'eau',51.5,3600],42:['grosse citrouille',51.7,3700]};
const B3_MASC=['melon','bleuet','citron','avocat','poivron','pamplemousse','épi','chou-fleur','brocoli','chou','céleri-rave','ananas','cantaloup','melon','poireau','mini'];
function b3Trimestre(w){return w<=13?'1er trimestre':w<=27?'2e trimestre':'3e trimestre'}
const B3_DEBUT={
 0:['Semaine des dernières règles : la grossesse se compte à partir du premier jour de vos dernières règles, avant même la conception.','Vos règles : le corps se prépare à une nouvelle ovulation.','Si vous planifiez une grossesse, commencez l\'acide folique (au moins 0,4 mg par jour) dès maintenant.'],
 1:['Un ovule mûrit dans l\'un de vos ovaires et l\'utérus prépare une muqueuse épaisse pour l\'accueillir.','Fin des règles. Vous ne remarquez encore rien de particulier.','Continuez l\'acide folique, limitez l\'alcool et le tabac.'],
 2:['L\'ovulation a lieu : l\'ovule est libéré et peut être fécondé dans les 24 heures. La fécondation se fait souvent à la fin de cette semaine.','Certaines femmes sentent une petite douleur d\'ovulation ou remarquent des pertes plus claires.','Les jours autour de l\'ovulation sont les plus fertiles.'],
 3:['L\'œuf fécondé se divise en plusieurs cellules (la morula, puis le blastocyste) et voyage vers l\'utérus pour s\'y implanter.','Rien de visible encore. Un petit saignement d\'implantation est possible.','Le test de grossesse est encore trop tôt : attendez la date de vos règles.']};
function b3Mouvement(w){return w<4?'':(B3_MV[w]||'')}
function b3Taille(w){if(w<4)return'';const f=B3_FRUITS[Math.min(42,w)];if(!f)return'';const art=B3_MASC.includes(f[0].split(' ')[0])?'d\'un ':'d\'une ';
  const cm=String(f[1]).replace('.',','),g=f[2]?(f[2]>=1000?String((f[2]/1000).toFixed(1)).replace('.',',')+' kg':f[2]+' g'):'moins de 1 g';
  return'<div class="b3-chiffres"><div><span>Grosseur</span><b>'+(({'melon d\'eau':'🍉','grosse citrouille':'🎃'})[f[0]]||(typeof FRUIT_EMOJI!=='undefined'&&FRUIT_EMOJI[f[0]])?(({'melon d\'eau':'🍉','grosse citrouille':'🎃'})[f[0]]||FRUIT_EMOJI[f[0]])+' ':'')+art+bebe3dEsc(f[0])+'</b></div><div><span>Taille</span><b>'+cm+' cm</b></div><div><span>Poids</span><b>'+g+'</b></div></div>'}
function bebe3dTextePage(w){
  const I=w<4?[w].concat(B3_DEBUT[w]):((typeof SEMAINES!=='undefined')?SEMAINES.find(s=>s[0]===Math.min(42,w)):null);
  const bloc=(t,x)=>x?'<div class="b3-bloc"><b>'+t+'</b><p>'+bebe3dEsc(x)+'</p></div>':'';
  return b3Taille(w)+bloc(w<4?'Ce qui se passe cette semaine':'Ce que bébé fait cette semaine',I?I[1]:'')+
    bloc('Ses mouvements',b3Mouvement(w))+bloc('Ce qu\'il entend et ressent',w<4?'':(B3_SE[w]||''))+
    bloc('À quoi vous attendre',I?I[2]:'')+bloc('Petit conseil',I?I[3]:'')}

const B3_MOUV=[
  [4,7,'Pas encore de mouvements : le cœur, lui, bat déjà dès 6 semaines.',''],
  [8,12,'Bébé fait de petits tressaillements et étire son corps tout entier. Vous ne le sentez pas encore.','tressaille'],
  [13,17,'Il bouge bras et jambes, porte les mains à son visage et fait des culbutes dans le liquide.','culbute'],
  [18,24,'Coups de pied, étirements et hoquet : vous commencez à sentir de petits papillons, puis de vrais petits coups.','coups'],
  [25,31,'Coups de pied plus forts, poings, hoquet rythmé. Il dort et s\'éveille par cycles.','coups fort'],
  [32,36,'Il a moins de place : roulades, étirements et poussées plutôt que grands coups. Les mouvements ne doivent pas diminuer.','roule'],
  [37,42,'Bébé est tassé : il s\'étire, pousse et se tortille. Il doit bouger chaque jour autant qu\'avant.','roule']];


const B3_MV={"4": "Il n'y a pas encore de mouvements : l'embryon mesure à peine 1 mm.", "5": "Pas encore de mouvements. Le petit tube qui deviendra le cœur se forme.", "6": "Pas de mouvements visibles, mais le cœur fait ses premiers battements.", "7": "Les bourgeons des bras et des jambes s'allongent, sans encore bouger.", "8": "Premiers tressaillements : tout le petit corps se contracte d'un coup. Personne ne peut encore les sentir.", "9": "Il plie les bras et les jambes et fait de petits sursauts, invisibles de l'extérieur.", "10": "Il bouge la tête et commence à porter les mains vers son visage.", "11": "Il ouvre et ferme les mains, s'étire et fait de petites culbutes.", "12": "Il a le hoquet, bâille et peut sucer. À l'échographie, on le voit gigoter.", "13": "Ses mouvements sont plus coordonnés : il pousse avec les pieds sur la paroi de l'utérus.", "14": "Il fait des grimaces et plisse le front. Ses mouvements restent trop légers pour vous.", "15": "Il bouge les doigts un à un et peut toucher son cordon.", "16": "Certaines mamans, surtout celles qui ont déjà eu un bébé, sentent de petites bulles.", "17": "Il s'étire, se retourne et donne ses premiers petits coups.", "18": "Vous pourriez sentir comme des papillons ou des bulles dans le bas du ventre.", "19": "Les papillons deviennent plus réguliers, souvent quand vous êtes au repos.", "20": "Vous sentez probablement bébé bouger. Votre partenaire pourrait bientôt le sentir aussi.", "21": "Ses mouvements sont plus francs : petits coups et roulades, surtout le soir.", "22": "Il saisit son cordon, touche son visage et donne des coups plus nets.", "23": "Vous remarquez peut-être ses moments d'activité et ses moments de calme.", "24": "Ses coups de pied peuvent se voir sous la peau de votre ventre.", "25": "Il réagit au toucher : quand vous appuyez doucement sur votre ventre, il peut répondre.", "26": "Il a souvent le hoquet : de petites secousses régulières que vous pouvez sentir.", "27": "Il alterne périodes d'éveil et de sommeil, avec des coups forts au réveil.", "28": "Prenez l'habitude de remarquer ses mouvements chaque jour : vous apprenez à connaître son rythme.", "29": "Ses coups sont plus forts. Il peut vous donner un coup dans les côtes ou la vessie.", "30": "Il bouge souvent quand vous êtes couchée ou après un repas.", "31": "Il a moins de place : plus de roulades et de poussées, moins de grands coups.", "32": "Les mouvements changent de forme mais ne doivent pas diminuer.", "33": "Vous sentez ses étirements : un pied ou une fesse peut faire une bosse sous la peau.", "34": "Il se tortille et pousse avec force. S'il bouge moins que d'habitude, appelez votre équipe de soins.", "35": "Il a peu de place, mais il doit continuer de bouger chaque jour comme avant.", "36": "S'il descend dans votre bassin, vous sentirez ses mouvements plus bas.", "37": "Bébé est à terme et bouge encore régulièrement : des poussées et des étirements.", "38": "Il serre, s'étire et pousse. Ses mouvements ne ralentissent pas avant la naissance.", "39": "Il est bien installé. Un bébé qui bouge moins à cette période n'est pas normal : appelez sans attendre.", "40": "Il continue de bouger jusqu'au travail. Comptez sur vos repères habituels.", "41": "Votre équipe de soins vérifie souvent son bien-être, notamment ses mouvements.", "42": "Restez attentive à ses mouvements chaque jour jusqu'à la naissance."};
const B3_SE={"4": "Ses sens n'existent pas encore : le cerveau et la moelle épinière commencent à se former.", "5": "Le tube neural, futur système nerveux, se referme.", "6": "Les premières ébauches des yeux et des oreilles apparaissent.", "7": "Les fosses nasales et le cristallin de l'œil se forment.", "8": "L'oreille interne, qui servira à l'équilibre et à l'audition, se développe.", "9": "Les paupières recouvrent les yeux, qui resteront fermés jusqu'à environ 26 semaines.", "10": "Les récepteurs du toucher apparaissent autour de la bouche.", "11": "Le toucher s'étend aux mains et aux pieds.", "12": "Il réagit quand ses mains frôlent son visage.", "13": "Ses cordes vocales se forment. Le toucher se développe sur tout le corps.", "14": "Ses papilles gustatives se mettent en place.", "15": "Il perçoit une forte lumière à travers vos tissus et ses paupières fermées.", "16": "Les petits os de l'oreille se forment : l'audition se prépare.", "17": "Ses premières réserves de graisse l'aident à garder sa chaleur.", "18": "Il commence à entendre les bruits de votre corps : votre cœur, votre respiration, votre digestion.", "19": "Il commence à percevoir les sons de l'extérieur, encore étouffés.", "20": "Il entend votre voix, surtout quand vous parlez ou chantez.", "21": "Il goûte le liquide amniotique, qui change selon ce que vous mangez.", "22": "Il sent vos caresses sur le ventre et votre façon de bouger.", "23": "Il reconnaît de plus en plus votre voix.", "24": "Il peut sursauter à un bruit fort, comme une porte qui claque.", "25": "Il reconnaît la voix des personnes qui vous entourent souvent.", "26": "Ses yeux commencent à s'ouvrir.", "27": "Il cligne des yeux et réagit à une lumière forte sur votre ventre.", "28": "Il rêve probablement : il a des phases de sommeil comme les nôtres.", "29": "Il distingue mieux les sons graves et aigus.", "30": "Le langage s'installe : il s'habitue au rythme et à la mélodie de votre langue.", "31": "Ses cinq sens fonctionnent. Il tourne la tête vers la lumière.", "32": "Il peut se souvenir d'une chanson ou d'une histoire souvent entendue.", "33": "Il perçoit les différences de lumière entre le jour et la nuit.", "34": "Il réagit différemment à votre voix et à une voix inconnue.", "35": "Son ouïe est presque aussi fine que celle d'un nouveau-né.", "36": "Il connaît votre odeur par le liquide amniotique : il la reconnaîtra à la naissance.", "37": "Il reconnaît les voix de sa famille.", "38": "Il serre fort tout ce qui touche sa paume : c'est le réflexe d'agrippement.", "39": "Tous ses sens sont prêts pour la naissance.", "40": "À la naissance, il cherchera votre voix, votre odeur et votre peau.", "41": "Il continue d'entendre et de sentir tout ce qui se passe autour de vous.", "42": "Bientôt, il découvrira votre visage. Les nouveau-nés voient bien à 20-30 cm, la distance de vos bras."};
