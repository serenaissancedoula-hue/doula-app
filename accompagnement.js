/* Sérénaissance — accompagner avec douceur les mamans qui vivent une situation particulière (espace famille),
   et prévenir la doula (espace doula).
   1. « J'ai vécu une perte » : arrête tout de suite le suivi de grossesse (dates mises de côté, rien d'effacé), remplace l'accueil
      par un espace de soutien (soins du corps, émotions, ressources de sa région), propose de prévenir sa doula (son choix),
      et propose de reprendre le suivi du cycle seulement quand elle se dit prête.
   2. « Pour vous accompagner » : selon ce qu'elle a coché (diabète, SOPK, fausses couches avant, deuil, hypertension, nausées sévères,
      placenta bas, siège, Rh négatif, peur de l'accouchement…) : un mot d'accueil, des conseils, le suivi à prévoir, quand appeler.
   3. Grossesse après une perte : ton plus doux, option « moins d'images de bébé au début ».
   Sources vérifiées : Santé Nouvelle-Écosse (après une fausse couche; diabète de grossesse : test après la naissance),
   INSPQ (deuil périnatal, ressources; accouchement du siège), GNB (ressources de deuil au N.-B.), PAIL Network (Sunnybrook),
   Agapa (France), Share (États-Unis), HSE (hyperémèse), Manuel MSD (placenta prævia, incompatibilité Rhésus),
   NHS Wales (peur de l'accouchement), ligne directrice internationale sur le SOPK (2023), SOGC (grossesse-info). */
(function(){
const L=(t,u)=>'<a href="'+u+'" target="_blank" rel="noopener">'+t+'</a>';
const ul=a=>'<ul class="clean dv-l small">'+a.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
const tel=(n,lab)=>'<a class="so-tel" href="tel:'+n.replace(/[^\d+]/g,'')+'">'+icon('fa-phone')+(lab||n)+'</a>';
const web=(u,lab)=>'<a class="so-web" href="'+u+'" target="_blank" rel="noopener">'+icon('fa-arrow-up-right-from-square')+lab+'</a>';
const SRC={
  nsfc:['Santé Nouvelle-Écosse, après une fausse couche','https://www.nshealth.ca/sites/default/files/documents/pamphlets/ff2201.pdf'],
  nsdg:['Santé Nouvelle-Écosse, après un diabète de grossesse','https://www.nshealth.ca/sites/default/files/documents/FF2339-2025.11.06.pdf'],
  dc:['Diabète Canada, diabète et grossesse','https://Diabetes.ca/DiabetesCanadaWebsite/media/Health-care-providers/2018%20Clinical%20Practice%20Guidelines/2018-CPG%20French/36-Pregnancy-FR.pdf'],
  inspqd:['INSPQ, deuil périnatal : ressources','https://www.inspq.qc.ca/information-perinatale/fiches/deces-et-deuil-perinatal/ressources'],
  gnb:['Gouvernement du N.-B., ressources de deuil','https://www.gnb.ca/fr/sujet/sante-mieux-etre/gestion-sante-maladies/soins-palliatifs/ressources-deuil.html'],
  pail:['PAIL Network','https://pailnetwork.sunnybrook.ca/'],
  sopk:['Ligne directrice internationale sur le SOPK','https://www.monash.edu/medicine/mchri/pcos/guideline'],
  hg:['HSE, hyperémèse gravidique','https://www.hse.ie/conditions/hyperemesis-gravidarum/'],
  pp:['Manuel MSD, placenta prævia','https://www.msdmanuals.com/fr/accueil/les-faits-en-bref-problèmes-de-santé-de-la-femme/complications-de-la-grossesse/placenta-prævia'],
  rh:['Manuel MSD, incompatibilité Rhésus','https://www.msdmanuals.com/fr/accueil/probl%C3%A8mes-de-sant%C3%A9-de-la-femme/complications-de-la-grossesse/incompatibilit%C3%A9-rh%C3%A9sus'],
  siege:['INSPQ, accouchement du siège','https://www.inspq.qc.ca/node/16209'],
  peur:['NHS Wales, la peur de l\'accouchement','https://performanceandimprovement.nhs.wales/functions/strategic-programme-for-mental-health/perinatal-mental-health/support-and-advice-leaflets/pnmh-support-leaflets/leaflet-12-what-is-tokophobia/'],
  sogc:['SOGC, grossesse-info','https://www.pregnancyinfo.ca/fr/']};
const srcs=k=>'<p class="xs muted" style="margin:4px 0 0">Sources : '+k.map(x=>L(SRC[x][0],SRC[x][1])).join(' · ')+'. Votre équipe de soins reste votre référence.</p>';
/* ---------- contenu : un mot doux, ce qui aide, le suivi, quand appeler ---------- */
const ACC={
 diabete:{ic:'🍎',t:'Avec un diabète de grossesse',m:'Ce n\'est pas de votre faute : ce sont les hormones du placenta qui rendent le sucre plus difficile à gérer. Avec un bon suivi, la grande majorité des mamans ont un bébé en santé.',
   aide:['Des repas et collations à heures régulières, avec des protéines à chaque fois : une nutritionniste peut vous aider à composer vos assiettes sans vous priver.','Bouger un peu après les repas (une marche de 10 à 15 minutes) aide à faire baisser le sucre.','Notez vos glycémies dans votre carnet ou dans votre journal : vous verrez vite ce qui vous convient.'],
   suivi:['Votre équipe vous montrera à mesurer votre glycémie et vous dira vos cibles. Si l\'alimentation ne suffit pas, de l\'insuline ou un médicament peut être proposé : ce n\'est pas un échec.','Après la naissance : un test de glycémie (souvent l\'hyperglycémie provoquée) <b>entre 6 semaines et 6 mois</b>. Vous pouvez le faire même si vous allaitez.','Ensuite, un dépistage du diabète tous les 1 à 3 ans, et un test avant une prochaine grossesse.'],src:['nsdg','dc']},
 diabeteav:{ic:'💙',t:'Avec un diabète de type 1 ou 2',m:'Vous connaissez votre corps et votre diabète : la grossesse demande simplement plus d\'attention, et vous ne serez pas seule.',
   aide:['Gardez vos lecteurs et votre collation de secours toujours sur vous : les hypoglycémies peuvent être plus fréquentes au début.','Écrivez vos questions entre les rendez-vous : votre équipe ajuste souvent vos doses tout au long de la grossesse.'],
   suivi:['Un suivi plus rapproché avec une équipe spécialisée (diabète et grossesse), et des examens des yeux et des reins.','Votre traitement est revu au fil des semaines; après la naissance, il est ajusté de nouveau.'],src:['dc']},
 sopk:{ic:'🌷',t:'Avec un SOPK',m:'Vous êtes enceinte, et c\'est une belle nouvelle. Le SOPK demande juste un peu plus d\'attention pendant la grossesse.',
   aide:['Une alimentation régulière et de l\'activité douce, comme pour toutes les grossesses : pas de régime.','Prenez soin de votre moral : l\'anxiété est plus fréquente avec le SOPK. Parlez-en, c\'est fréquent et ça se soigne.'],
   suivi:['Le SOPK augmente le risque de diabète de grossesse : demandez à votre équipe si un dépistage plus tôt est indiqué pour vous.','Votre tension artérielle est aussi surveillée à chaque rendez-vous.'],src:['sopk']},
 tension:{ic:'🩺',t:'Avec une tension élevée ou une prééclampsie',m:'Cette surveillance est là pour vous protéger, vous et bébé. Vous faites déjà beaucoup en étant attentive.',
   aide:['Si on vous a prêté ou conseillé un tensiomètre, notez vos mesures au même moment de la journée.','Prenez seulement les médicaments prescrits par votre équipe (y compris l\'aspirine, si on vous l\'a proposée).'],
   suivi:['Des rendez-vous plus fréquents, des prises de sang et parfois des échographies pour suivre la croissance de bébé.'],
   appel:'Maux de tête qui ne passent pas, vision embrouillée, douleur sous les côtes à droite, enflure soudaine du visage ou des mains, essoufflement : appelez tout de suite ou allez à l\'urgence.',src:['sogc']},
 hyper:{ic:'🫶',t:'Avec des nausées et vomissements sévères',m:'Ce que vous vivez est réel et épuisant. Ce n\'est pas « dans votre tête », et il existe des traitements sécuritaires pendant la grossesse.',
   aide:['Petites gorgées souvent, petites collations fréquentes, ce qui passe le mieux : l\'important est de garder des liquides.','Acceptez l\'aide pour les repas, la maison et les enfants. Le repos fait partie du traitement.'],
   suivi:['Parlez-en tôt à votre équipe : des médicaments contre les nausées peuvent être prescrits, et des solutés si vous vous déshydratez.'],
   appel:'Impossible de garder les liquides pendant 24 heures, vomissements plusieurs fois par jour ou avec du sang, étourdissements, perte de poids, urine foncée ou rare : appelez votre équipe ou allez à l\'hôpital.',src:['hg']},
 placenta:{ic:'🌙',t:'Avec un placenta bas',m:'Souvent, le placenta remonte de lui-même au fil des semaines. On le surveille simplement.',
   aide:['Évitez les rapports sexuels jusqu\'à ce que votre équipe vous dise que c\'est correct : ils peuvent faire saigner.','Gardez votre sac prêt à partir à partir du 3e trimestre.'],
   suivi:['Une échographie de contrôle au 3e trimestre. S\'il reste bas, la naissance se fait en général par césarienne planifiée.'],
   appel:'Tout saignement, même sans douleur : appelez tout de suite ou allez à l\'hôpital.',src:['pp']},
 siege:{ic:'🔄',t:'Avec bébé en siège',m:'Plusieurs bébés se retournent tard. Vous avez des options, et c\'est vous qui choisissez avec votre équipe.',
   aide:['Votre doula peut vous proposer des positions de confort; demandez toujours l\'accord de votre équipe avant d\'essayer quoi que ce soit.'],
   suivi:['Une version (on aide bébé à se retourner de l\'extérieur) est souvent proposée vers 36 ou 37 semaines; elle réussit dans environ 40 à 50 % des cas.','Selon la position de bébé, un accouchement vaginal ou une césarienne planifiée peut être discuté.'],src:['siege']},
 rh:{ic:'🩸',t:'Avec un Rhésus négatif',m:'C\'est fréquent et très bien suivi : une simple injection protège vos prochains bébés.',
   aide:['Gardez votre carte de groupe sanguin ou une photo de votre résultat dans votre téléphone.'],
   suivi:['Une injection d\'immunoglobulines anti-D vers 28 semaines, puis dans les 72 heures après la naissance si bébé est Rh positif.'],
   appel:'Saignement, chute ou coup au ventre : dites à votre équipe que vous êtes Rh négatif, une injection peut être nécessaire.',src:['rh']},
 anemie:{ic:'🌿',t:'Avec de l\'anémie',m:'La fatigue que vous ressentez a une explication, et elle se traite.',
   aide:['Prenez votre fer comme prescrit, avec un aliment riche en vitamine C (agrume, poivron), et à distance du thé, du café et du lait.','Viandes, poissons, légumineuses, tofu et céréales enrichies aident aussi.'],
   suivi:['Une prise de sang de contrôle pour voir si le traitement fonctionne.'],src:['sogc']},
 thyroide:{ic:'🦋',t:'Avec un problème de thyroïde',m:'Bien suivie, la thyroïde ne vous empêchera pas de vivre une belle grossesse.',
   aide:['Prenez votre médicament à jeun, à la même heure, loin du fer et du calcium (environ 4 heures).'],
   suivi:['Des prises de sang régulières : la dose change souvent pendant la grossesse.'],src:['sogc']},
 pma:{ic:'✨',t:'Après un parcours de PMA ou de FIV',m:'Vous avez traversé beaucoup pour arriver ici. Il est normal d\'avoir du mal à croire que tout va bien.',
   aide:['Vous avez le droit d\'être à la fois heureuse et inquiète. Parlez-en avec votre doula ou une personne de confiance.'],
   suivi:['Votre clinique vous suit souvent au début, puis passe le relais à votre médecin ou sage-femme : demandez quand se fait le transfert.'],src:['sogc']},
 col:{ic:'🤍',t:'Avec un col court ou un risque de naissance prématurée',m:'Cette surveillance donne du temps à bébé. Vous n\'êtes pas responsable de ce qui arrive à votre col.',
   aide:['Suivez les consignes de repos ou de traitement de votre équipe, et demandez de l\'aide autour de vous.'],
   suivi:['Des échographies du col et parfois un traitement (progestérone, cerclage) selon votre situation.'],
   appel:'Avant 37 semaines : contractions régulières, pression dans le bassin, mal de dos inhabituel, perte de liquide ou saignement : appelez tout de suite.',src:['sogc']},
 retard:{ic:'🌱',t:'Quand la croissance de bébé est surveillée',m:'Vous n\'avez rien fait de mal. Ces examens servent à prendre les meilleures décisions pour bébé.',
   aide:['Continuez à compter les mouvements de bébé chaque jour : vous êtes celle qui le connaît le mieux.'],
   suivi:['Des échographies plus fréquentes pour suivre sa croissance et le placenta.'],
   appel:'Bébé bouge moins que d\'habitude : appelez tout de suite, sans attendre le lendemain.',src:['sogc']},
 deuil:{ic:'🕊️',t:'Une grossesse après une perte',m:'Votre bébé d\'avant compte, et ce nouveau bébé aussi. Il est normal de ressentir à la fois de l\'espoir et de la peur.',
   aide:['Vous pouvez choisir de voir moins d\'images de bébé au début (option ci-dessous).','Dites à votre équipe ce que vous avez vécu : on peut vous proposer d\'être vue plus tôt ou une échographie de réassurance.','Les dates anniversaires peuvent être difficiles : prévoyez de la douceur ces jours-là.'],
   suivi:['Des groupes de soutien existent pour les grossesses après une perte (ressources ci-dessous).'],src:['pail','inspqd']},
 peur:{ic:'🫂',t:'Avec la peur de l\'accouchement',m:'Vous n\'êtes pas seule : environ une femme sur sept vit une grande peur de l\'accouchement. Elle se travaille, avec du soutien.',
   aide:['Dites-le à votre médecin ou sage-femme et demandez plus de temps pour en parler.','Préparez votre plan de naissance avec votre doula, et visitez le lieu de naissance d\'avance.','Une thérapie (comme la TCC) peut beaucoup aider : demandez une référence.','Vous pouvez demander à rencontrer un anesthésiste pour connaître vos options contre la douleur.'],
   suivi:['Parlez tôt de vos souhaits pour l\'accouchement : les décisions se prennent souvent vers 32 semaines.'],src:['peur']},
 fc:{ic:'🕊️',t:'Après une ou des fausses couches',m:'Votre perte compte, peu importe le moment où elle est arrivée. Il est normal que l\'inquiétude soit plus grande au début de cette grossesse.',
   aide:['Vous n\'avez pas à attendre 12 semaines pour demander du soutien : parlez-en à votre équipe et à votre doula.','La plupart des femmes ont ensuite une grossesse qui se passe bien, même après plusieurs fausses couches.'],
   suivi:['On peut vous proposer une échographie tôt. Après 2 fausses couches ou plus, un bilan peut être fait : demandez-le.'],src:['nsfc']}
};
function carteAcc(keys,titre){keys=keys.filter(k=>ACC[k]);if(!keys.length)return '';const S2=new Set();
  return '<div class="card acc-doux"><span class="eyebrow acc">'+(titre||'Pour vous accompagner')+'</span><p class="small" style="margin:4px 0 8px">Vous nous avez confié ce que vous vivez. Voici ce qui peut vous aider, à votre rythme 💗</p>'+
    keys.map(k=>{const a=ACC[k];a.src.forEach(x=>S2.add(x));return '<details class="acc"><summary><span style="margin-right:6px">'+a.ic+'</span>'+a.t+'<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body"><p class="small acc-mot">'+a.m+'</p>'+
      '<b class="small">Ce qui peut aider</b>'+ul(a.aide)+(a.suivi?'<b class="small">Votre suivi</b>'+ul(a.suivi):'')+(a.appel?'<div class="banner acc" style="margin-top:6px">'+icon('fa-phone')+'<div class="small">'+a.appel+'</div></div>':'')+'</div></details>'}).join('')+srcs([...S2])+'</div>'}
window.accCarte=carteAcc;
/* ---------- ressources de deuil selon la région ---------- */
function ressourcesDeuil(){const r=(window.maRegion&&window.maRegion())||'',R=[],CA=r&&r!=='FR'&&r!=='US'&&r.indexOf('W-')!==0;
  if(r==='QC')R.push(['Parents Orphelins','Écoute et accompagnement des parents après la perte d\'un bébé, à toute étape de la grossesse.',tel('1-844-338-4522','1 844 DEUILBB')+web('https://www.parentsorphelins.org/','parentsorphelins.org')],['Nos Petits Anges au Paradis','Groupe de soutien en ligne entre parents.',web('https://www.nospetitsangesauparadis.com/','Site')]);
  if(r==='NB')R.push(['Big Hearts / Little Stars','Soutien local aux familles qui vivent un deuil périnatal (Moncton et Sud-Est, en anglais).',web('https://www.facebook.com/BigHeartsLittleStars','Facebook')],['ACSM Nouveau-Brunswick','Programmes gratuits sur le deuil, en français et en anglais (Moncton, Richibucto).',web('https://cmhanb.ca/fr','cmhanb.ca')]);
  if(r==='ON'||CA)R.push(['PAIL Network','Soutien gratuit entre parents après une perte de grossesse, en groupe ou au téléphone, et un groupe « grossesse après une perte »'+(r==='ON'?'.':' (les groupes sont offerts aux familles de l\'Ontario; l\'information est pour tous).'),(r==='ON'?tel('1-888-303-7245'):'')+web('https://pailnetwork.sunnybrook.ca/','pailnetwork.sunnybrook.ca')]);
  if(CA)R.push(['MonDeuil.ca','Modules gratuits, en français et en anglais, sur le deuil d\'une grossesse ou d\'un nouveau-né.',web('https://www.mondeuil.ca/','mondeuil.ca')]);
  if(r==='FR')R.push(['Agapa','Écoute et accompagnement après une fausse couche ou un deuil périnatal, partout en France.',tel('0140450636','01 40 45 06 36')+web('https://association-agapa.fr/','association-agapa.fr')]);
  if(r==='US')R.push(['Share Pregnancy & Infant Loss Support','Soutien aux familles après une perte de grossesse : groupes en ligne, écoute (en anglais).',tel('1-800-821-6819')+web('https://nationalshare.org/','nationalshare.org')]);
  if(CA&&r!=='NU')R.push(['811','Une infirmière vous répond 24 h sur 24 pour vos questions sur votre corps après la perte.'+(r==='QC'?' Option Info-Social pour parler de ce que vous vivez.':''),tel('811')]);
  if(CA||r==='US')R.push(['988','Si la peine devient trop lourde ou si vous avez des idées de vous faire du mal : appel ou texto, 24 h sur 24.',tel('988')]);
  if(!r)R.push(['Votre région','Choisissez votre région dans Paramètres pour voir les ressources près de chez vous.','']);
  return '<div class="list">'+R.map(x=>'<div class="li" style="align-items:flex-start"><div class="ic">'+icon('fa-dove')+'</div><div class="tx"><b>'+x[0]+'</b><span>'+x[1]+'</span>'+(x[2]?'<div class="so-l" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">'+x[2]+'</div>':'')+'</div></div>').join('')+'</div>'}
/* ---------- ESPACE FAMILLE ---------- */
if(window.ESPACE==='parent'){
  const sauver=()=>{try{if(typeof saveParent==='function')saveParent();else save()}catch(e){}};
  const P=()=>S.parent||{};
  const perteActive=()=>{const p=P().perte;return !!(p&&!p.pret&&!grossesseEnCours())};
  function grossesseEnCours(){try{const p=P();return !!(typeof preg==='function'&&preg(p)&&!p.grossesseFinie)}catch(e){return false}}
  const doula=()=>typeof FAM!=='undefined'&&FAM&&FAM.doula_id;
  /* formulaire */
  function fPerte(){const g=(()=>{try{return stage().g}catch(e){return null}})();
    sheet('Je suis tellement désolée 🕊️','<p class="small">Prenez tout votre temps. Ce que vous inscrivez ici reste dans votre espace. L\'appli arrête tout de suite le suivi de grossesse et ne vous enverra plus de messages sur bébé. <b>Rien n\'est effacé</b> : vos notes et vos souvenirs restent gardés.</p>'+
      '<label class="f">Quand est-ce arrivé ? (facultatif)<input type="date" id="pt_d" max="'+iso(new Date())+'" value="'+iso(new Date())+'"></label>'+
      '<label class="f">Un prénom ou un mot pour votre bébé, si vous le souhaitez (facultatif)<input id="pt_n" placeholder="Facultatif"></label>'+
      (doula()?'<label class="check"><input type="checkbox" id="pt_dl" checked><span>Prévenir ma doula avec un court message (elle saura comment vous accompagner)</span></label>':'')+
      '<input type="hidden" id="pt_w" value="'+(g?g.w:'')+'"><button class="btn" data-pt-ok="1">Enregistrer</button><button class="btn ghost" data-pt-annul="1">Pas maintenant</button>')}
  async function enregistrer(){const p=P(),d=$('#pt_d').value||iso(new Date()),n=$('#pt_n').value.trim(),w=+$('#pt_w').value||null,dl=$('#pt_dl')&&$('#pt_dl').checked;
    p.perte={date:d,sem:w,nom:n,dates:{ddr:p.ddr||'',echoDate:p.echoDate||'',echoSA:p.echoSA||'',echoJ:p.echoJ||'',dpaEquipe:p.dpaEquipe||''},doulaAvisee:!!dl,le:Date.now()};
    p.pertes=(p.pertes||[]).concat([{date:d,sem:w,nom:n}]);
    ['ddr','echoDate','echoSA','echoJ','dpaEquipe'].forEach(k=>{p[k]=''});p.profil='';if(p.parcours==='grossesse')p.parcours='perte';
    const I=p.grossesseInfos||(p.grossesseInfos={});I.ant=I.ant||{};I.ant.fc=(+I.ant.fc||0)+1;I.ant.grossesses=Math.max(+I.ant.grossesses||0,I.ant.fc+(+I.ant.vaginal||0)+(+I.ant.cesar||0));
    sauver();close();
    if(dl&&doula()){try{await sb.from('fam_messages').insert({famille_id:FAM.id,de_doula:false,texte:'🕊️ Je voulais vous dire que j\'ai vécu une perte de grossesse'+(d?' le '+fmtD(parseD(d)):'')+'. Le suivi de grossesse est arrêté dans mon appli.'})}catch(e){}}
    S.vue=null;S.sub=null;S.tab='accueil';render();window.scrollTo(0,0)}
  /* l'accueil pendant le deuil */
  function accueilPerte(){const p=P(),pt=p.perte,nm=p.prenom&&p.prenom!=='Exemple'?' '+esc(p.prenom):'';
    return '<div class="sh"><span class="script">Avec vous'+nm+'</span><h1>Prendre soin de vous</h1><p class="sub">Il n\'y a pas de bonne façon de vivre une perte. Allez à votre rythme.</p></div>'+
     '<div class="card acc-doux"><p class="small acc-mot" style="margin:0">'+(pt.nom?'<b>'+esc(pt.nom)+'</b> a existé, et votre peine est réelle.':'Votre bébé a existé, et votre peine est réelle')+', peu importe le moment de la perte. Une fausse couche n\'est presque jamais causée par ce que vous avez fait ou pas fait 💗</p></div>'+
     '<div class="card"><span class="eyebrow acc">Votre corps, les prochains jours</span>'+ul(['Des saignements et des crampes sont normaux; de légers saignements peuvent durer environ <b>2 semaines</b>. Vos seins peuvent rester gonflés quelques jours.','Vos <b>règles reviennent souvent 4 à 6 semaines</b> après, parfois plus abondantes. Une grossesse est possible avant leur retour.','Si vous êtes <b>Rh négatif</b>, demandez à votre équipe si une injection d\'anti-D est nécessaire.','Pas de règles 6 semaines après ? Un test de grossesse peut être fait, et parlez-en à votre médecin.'])+
      '<div class="banner acc" style="margin-top:6px">'+icon('fa-hospital')+'<div class="small"><b>Allez à l\'urgence</b> si : plus d\'une serviette imbibée à l\'heure, douleur forte au ventre, étourdissements ou grande faiblesse, palpitations, pertes qui sentent mauvais.<br><b>Appelez votre médecin</b> si : fièvre de plus de 38 °C, frissons, saignements ou douleur qui augmentent.</div></div>'+srcs(['nsfc'])+'</div>'+
     '<div class="card"><span class="eyebrow acc">Votre cœur</span>'+ul(['Tristesse, colère, culpabilité, vide, soulagement parfois : toutes ces émotions sont normales et peuvent revenir par vagues.','Votre partenaire peut vivre la perte autrement : parlez-en ensemble, à votre façon.','La date prévue d\'accouchement et la date de la perte peuvent être difficiles : prévoyez de la douceur ces jours-là.','Si la tristesse vous empêche de fonctionner, parlez-en à votre médecin : de l\'aide existe.'])+'</div>'+
     '<div class="card"><span class="eyebrow acc">Du soutien près de chez vous</span>'+ressourcesDeuil()+srcs(['inspqd','gnb','pail'])+'</div>'+
     (doula()?'<div class="card"><span class="eyebrow acc">Votre doula</span><p class="small" style="margin:4px 0 8px">'+(pt.doulaAvisee?'Votre doula a été prévenue. Elle peut vous accompagner autrement, si vous le souhaitez.':'Vous pouvez écrire à votre doula quand vous serez prête.')+'</p><button class="btn sm ghost" data-act="tab" data-v="madoula">Écrire à ma doula</button></div>':'')+
     '<div class="card"><span class="eyebrow acc">Quand vous serez prête</span><p class="small" style="margin:4px 0 8px">Rien ne presse. Le jour où vous le voudrez, vous pourrez reprendre le suivi de votre cycle, ou une nouvelle grossesse.</p><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm ghost" data-pt-pret="cycle">Suivre mon cycle</button><button class="btn sm ghost" data-pt-pret="grossesse">Je suis enceinte de nouveau</button></div>'+
      '<p class="xs muted" style="margin-top:8px">Il est souvent conseillé d\'attendre vos premières règles avant de concevoir, pour mieux dater la grossesse; parlez-en avec votre médecin.</p></div>'}
  if(typeof pAccueil==='function'){const _pa=pAccueil;pAccueil=function(){try{if(S.role==='parent'&&perteActive())return accueilPerte()}catch(e){}return _pa.apply(this,arguments)}}
  if(typeof pSuivi==='function'){const _ps=pSuivi;pSuivi=function(){try{if(S.role==='parent'&&perteActive()&&!S.sub)return accueilPerte().replace('<h1>Prendre soin de vous</h1>','<h1>Mon suivi</h1>')}catch(e){}
    const h=_ps.apply(this,arguments);try{if(S.role!=='parent'||S.sub)return h;let st=null;try{st=stage()}catch(e){}if(!st||st.k!=='preg')return h;
      const I=P().grossesseInfos||{},K=(I.conds||[]).slice();if(+(I.ant||{}).fc&&!K.includes('deuil'))K.push('fc');if(P().pertes&&P().pertes.length&&!K.includes('deuil'))K.push('deuil');
      let x=carteAcc(K);if(K.includes('deuil')||K.includes('fc'))x+=carteDouceur();
      x+='<div class="acc-perte"><button class="btn sm ghost" data-pt-ouvrir="1">'+icon('fa-dove')+'J\'ai vécu une perte</button></div>';
      return h+x}catch(e){}return h}}
  /* option : moins d'images de bébé au début */
  function carteDouceur(){const on=!!P().douceImages;return '<div class="card"><label class="check"><input type="checkbox" data-pt-douce="1"'+(on?' checked':'')+'><span><b>Mode douceur</b> : moins d\'images de bébé jusqu\'à 14 semaines. Les repères restent écrits.</span></label></div>'}
  const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(S.role!=='parent')return x;const app=document.getElementById('app');
      if(P().douceImages){let w=0;try{const st=stage();if(st.k==='preg')w=st.g.w}catch(e){}if(w&&w<14)app.querySelectorAll('.bebe-carte .b3c-vue, .bebe-carte img, .bebe-carte canvas, .bebe-carte model-viewer').forEach(n=>{n.style.display='none'})}
      if(perteActive()){app.querySelectorAll('.pf-echo,.pf-mod').forEach(n=>n.remove())}
      /* Paramètres : la carte « Ma grossesse » propose aussi « J'ai vécu une perte » */
      if((S.tab==='parametres'||S.vue==='params')&&!app.querySelector('.acc-perte')){let st=null;try{st=stage()}catch(e){}if(st&&st.k==='preg'){const c=app.querySelector('.gm-inf');if(c){const t=document.createElement('template');t.innerHTML='<div class="acc-perte" style="margin-top:8px"><button class="btn sm ghost" data-pt-ouvrir="1">'+icon('fa-dove')+'J\'ai vécu une perte</button></div>';c.append(t.content)}}}
    }catch(e){}return x};
  /* aucun message joyeux de grossesse pendant le deuil */
  const _toast=window.toast;if(typeof _toast==='function'){window.toast=function(m){try{if(perteActive()&&/bébé|grossesse|semaine/i.test(m)&&/💗|🎉|Félicitations|Bonne/i.test(m))return}catch(e){}return _toast.apply(this,arguments)};try{toast=window.toast}catch(e){}}
  document.addEventListener('click',async e=>{let b;
    if(e.target.closest('[data-pt-ouvrir]')){e.stopPropagation();fPerte();return}
    if(e.target.closest('[data-pt-annul]')){e.stopPropagation();close();return}
    if(e.target.closest('[data-pt-ok]')){e.stopPropagation();await enregistrer();return}
    if(b=e.target.closest('[data-pt-douce]')){S.parent.douceImages=b.checked;sauver();render();return}
    if(b=e.target.closest('[data-pt-pret]')){e.stopPropagation();const p=P();p.perte.pret=true;
      if(b.dataset.ptPret==='cycle'){p.parcours='conception';p.suiviCycle=true;p.profil='cycle';sauver();S.vue=null;S.tab='accueil';render()}
      else{p.parcours='grossesse';p.grossesseFinie=false;sauver();S.vue=null;S.tab='suivi';render();if(window.pfFormGrossesse)setTimeout(()=>window.pfFormGrossesse(false),200)}return}
  },true);
  /* une nouvelle grossesse inscrite : le suivi de grossesse reprend (la perte reste dans l'historique) */
  setInterval(()=>{try{const p=P();if(p.perte&&!p.perte.pret&&p.ddr&&p.ddr!==p.perte.dates.ddr&&grossesseEnCours()){p.perte.pret=true;sauver()}}catch(e){}},4000);
  /* Essais bébé : accompagnement selon la situation (SOPK, endométriose, fausses couches, thyroïde) */
  if(typeof pSuivi==='function'){const _ps2=pSuivi;pSuivi=function(){const h=_ps2.apply(this,arguments);try{if(S.role!=='parent'||S.sub||!h.includes('Fertilité et préconception'))return h;
    const c=((P().ftProfil||{}).conds||[]);const K=[];if(c.includes('fc')||(P().pertes||[]).length)K.push('fcEssais');if(c.includes('sopk'))K.push('sopkEssais');if(c.includes('endo'))K.push('endoEssais');
    if(!K.length)return h;return h+carteAcc(K,'Pour vous accompagner')}catch(e){}return h}}
  Object.assign(ACC,{
    fcEssais:{ic:'🕊️',t:'Essayer de nouveau après une perte',m:'Recommencer à essayer demande du courage. Chaque émotion a sa place : l\'espoir, la peur, la tristesse.',
      aide:['Concevoir dès le premier cycle après une fausse couche n\'augmente pas le risque : attendre les premières règles aide surtout à dater la grossesse.','Si les tests et le calendrier deviennent trop lourds, faites une pause : votre bien-être passe avant les graphiques.'],
      suivi:['Après 2 fausses couches ou plus, un bilan est recommandé : parlez-en à votre médecin.'],src:['nsfc']},
    sopkEssais:{ic:'🌷',t:'Essais bébé avec un SOPK',m:'Le SOPK rend le chemin parfois plus long, mais beaucoup de femmes avec un SOPK deviennent enceintes.',
      aide:['Fiez-vous à plusieurs signes : les tests d\'ovulation peuvent être positifs plusieurs jours sans ovulation.','De petits changements de mode de vie (bouger, bien dormir, manger régulièrement) peuvent aider l\'ovulation.'],
      suivi:['Parlez-en à votre médecin sans attendre 12 mois : des traitements simples (comme le létrozole) aident l\'ovulation.'],src:['sopk']},
    endoEssais:{ic:'🌸',t:'Essais bébé avec de l\'endométriose',m:'Votre douleur est réelle et mérite d\'être prise au sérieux.',
      aide:['Notez vos douleurs dans le calendrier (bouton Symptômes) : c\'est précieux pour votre médecin.'],
      suivi:['Il est recommandé de consulter sans attendre les 12 mois habituels.'],src:['sogc']}});
}
/* ---------- ESPACE DOULA : la famille a vécu une perte ---------- */
if(window.ESPACE!=='parent'&&typeof cSuivi==='function'){const _cs=cSuivi;cSuivi=function(c){const h=_cs.apply(this,arguments);try{const p=(c&&c.parent_data)||{},pt=p.perte;if(!pt||pt.pret)return h;
  return '<div class="card" style="border-left:4px solid var(--accent)"><span class="eyebrow acc">🕊️ Cette famille a vécu une perte</span><p class="small" style="margin:6px 0">'+(pt.date?'Le '+fmtD(parseD(pt.date))+'. ':'')+(pt.nom?'Bébé : <b>'+esc(pt.nom)+'</b>. ':'')+'Le suivi de grossesse est arrêté dans son appli; elle voit maintenant un espace de soutien et des ressources de deuil de sa région.</p>'+
    ul(['Utilisez le mot « bébé » et le prénom s\'il a été choisi; évitez « au moins », « vous êtes jeune », « c\'était tôt ».','Offrez votre présence sans pression : un message court, une visite si elle le souhaite.','Pensez aux dates sensibles : date prévue d\'accouchement, anniversaire de la perte.','Votre fiche « Deuil périnatal » (Outils) se remet en personne seulement.','Le contrat prévoit une adaptation sans pénalité (article sur la perte de grossesse).'])+'</div>'+h}catch(e){return h}}}
(function(){const st=document.createElement('style');st.textContent='.acc-doux{background:linear-gradient(160deg,var(--card,#fff),var(--soft,#f7ece3))}.acc-mot{font-style:italic;color:var(--ink,#3b2a24);margin:6px 0 10px}.acc-doux details.acc summary{font-weight:600}.acc-perte{text-align:center;margin:6px 0 18px}.acc-perte .btn{opacity:.85}';document.head.appendChild(st)})();
})();
