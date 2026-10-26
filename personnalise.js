/* Sérénaissance — conseils personnalisés selon la situation de la maman (diabète, SOPK, tension, nausées sévères, placenta bas,
   siège, Rh négatif, peur de l'accouchement, grossesse après une perte, col court, croissance surveillée, PMA…).
   1. Carte « Pour moi cette semaine » sur l'accueil : conseils adaptés à SA situation et à SA semaine (et après la naissance).
   2. Les conseils généraux qui ne lui conviennent pas sont ajustés (ex. collations et activité avec un diabète; activité avec un placenta bas).
   3. Côté doula : « Points d'attention pour l'accompagner » dans le suivi de la famille.
   Sources : CHU de Québec (diabète gestationnel : glycémies, marche après les repas, glycémie de bébé et allaitement dans les 2 premières heures,
   test 6 semaines à 6 mois), Santé Nouvelle-Écosse, March of Dimes (prééclampsie après la naissance, jusqu'à 6 semaines),
   INSPQ (siège), Manuel MSD (placenta prævia, Rhésus), NHS Wales (peur de l'accouchement), PAIL. */
(function(){
const L=(t,u)=>'<a href="'+u+'" target="_blank" rel="noopener">'+t+'</a>';
const SRC={chuq:L('CHU de Québec, diabète de grossesse','https://www.chudequebec.ca/getattachment/0d2c8760-1aad-4f76-a5b0-dd3e5555634e/Le-diabete-gestationnel-(diabete-de-grossesse).aspx'),
  nsdg:L('Santé N.-É., après un diabète de grossesse','https://www.nshealth.ca/sites/default/files/documents/FF2339-2025.11.06.pdf'),
  mod:L('March of Dimes, prééclampsie après la naissance','https://www.marchofdimes.org/find-support/blog/preeclampsia-can-also-happen-after-youve-given-birth'),
  siege:L('INSPQ, siège','https://www.inspq.qc.ca/node/16209'),pp:L('Manuel MSD, placenta prævia','https://www.msdmanuals.com/fr/accueil/les-faits-en-bref-problèmes-de-santé-de-la-femme/complications-de-la-grossesse/placenta-prævia'),
  rh:L('Manuel MSD, Rhésus','https://www.msdmanuals.com/fr/accueil/probl%C3%A8mes-de-sant%C3%A9-de-la-femme/complications-de-la-grossesse/incompatibilit%C3%A9-rh%C3%A9sus'),
  peur:L('NHS Wales, peur de l\'accouchement','https://performanceandimprovement.nhs.wales/functions/strategic-programme-for-mental-health/perinatal-mental-health/support-and-advice-leaflets/pnmh-support-leaflets/leaflet-12-what-is-tokophobia/'),
  nsfc:L('Santé N.-É., après une fausse couche','https://www.nshealth.ca/sites/default/files/documents/pamphlets/ff2201.pdf'),pail:L('PAIL Network','https://pailnetwork.sunnybrook.ca/')};
const fdl=d=>new Date(d).toLocaleDateString('fr-CA',{day:'numeric',month:'long'});
function conds(p){p=p||S.parent||{};const I=p.grossesseInfos||{},K=new Set(I.conds||[]);if(+(I.ant||{}).fc)K.add('fc');if((p.pertes||[]).length)K.add('deuil');
  const f=(p.ftProfil||{}).conds||[];if(f.includes('sopk'))K.add('sopk');if(f.includes('thyro'))K.add('thyroide');return K}
window.mesConditions=conds;
/* ---------- conseils par situation : g(semaine) pendant la grossesse, pp(jour) après ---------- */
const T={
 diabete:{n:'Diabète de grossesse',src:['chuq','nsdg'],
   g:w=>[w>=20&&'Vos glycémies : souvent 4 fois par jour (à jeun et après les repas), selon ce que votre équipe vous a montré. Notez-les pour vos rendez-vous.',
     w>=20&&'Une marche de 20 à 30 minutes après les repas aide à faire baisser le sucre, à un rythme où vous pouvez parler.',
     w>=34&&'Dans votre valise : lecteur de glycémie, bandelettes, collations, et votre insuline si vous en prenez.',
     w>=34&&'Dans votre plan de naissance : la glycémie de bébé sera vérifiée après la naissance. Mettre bébé au sein dans les 2 premières heures l\'aide à la stabiliser.'],
   pp:d=>[d<=7&&'Vos glycémies redeviennent habituellement normales très vite après l\'accouchement.',
     d<=7&&'Bébé : sa glycémie est surveillée les premières heures. Des tétées fréquentes l\'aident.',
     'Prévoyez votre test de glycémie (hyperglycémie provoquée) entre le '+fdl(Date.now()-d*864e5+42*864e5)+' et le '+fdl(Date.now()-d*864e5+182*864e5)+' : vous pouvez le faire même si vous allaitez.']},
 diabeteav:{n:'Diabète de type 1 ou 2',src:['chuq'],
   g:w=>['Gardez une collation de secours et votre lecteur toujours sur vous.',w>=34&&'Dans votre valise : lecteur, bandelettes, collations, insuline ou médicaments, et la liste de vos doses.',w>=34&&'Demandez d\'avance à votre équipe comment se passera la gestion de votre glycémie pendant le travail.'],
   pp:d=>[d<=14&&'Votre traitement est ajusté après la naissance : suivez le plan de votre équipe.',d<=60&&'Pendant les tétées de nuit, gardez une collation et votre lecteur à portée de main.']},
 sopk:{n:'SOPK',src:[],g:w=>[w<=28&&'Le dépistage du diabète de grossesse est important pour vous : demandez à votre équipe le bon moment pour le faire.','Votre moral compte : si l\'anxiété prend de la place, parlez-en à votre équipe ou à votre doula.'],pp:d=>[]},
 tension:{n:'Tension élevée',src:['mod'],
   g:w=>['Notez vos mesures de tension au même moment de la journée, si on vous l\'a demandé.','Maux de tête qui ne passent pas, vision embrouillée, douleur sous les côtes à droite, enflure soudaine : appelez tout de suite.'],
   pp:d=>[d<=42&&'La prééclampsie peut aussi arriver <b>jusqu\'à 6 semaines après la naissance</b>, même sans tension élevée pendant la grossesse. Mal de tête qui ne passe pas, vision embrouillée, essoufflement, enflure, douleur sous les côtes : appelez tout de suite ou le 911.',d<=42&&'Allez à votre rendez-vous de contrôle après la naissance, même si vous vous sentez bien.']},
 hyper:{n:'Nausées et vomissements sévères',src:[],
   g:w=>[w<=20&&'Petites gorgées et petites collations souvent : garder les liquides est la priorité, pas « bien manger » pour l\'instant.',w<=20&&'Votre prise de poids peut être plus basse au début : c\'est attendu, votre équipe la suit.',w<=20&&'Acceptez l\'aide : le repos fait partie du traitement.'],pp:d=>[]},
 placenta:{n:'Placenta bas',src:['pp'],
   g:w=>[w>=20&&'Évitez les rapports sexuels et les activités intenses tant que votre équipe ne vous a pas dit que c\'est correct.',w>=20&&'Tout saignement, même léger et sans douleur : appelez tout de suite.',w>=32&&'Une échographie de contrôle vérifie si le placenta est remonté. S\'il reste bas, une césarienne planifiée est souvent prévue : préparez aussi un plan de naissance pour une césarienne.'],
   pp:d=>[d<=42&&'Après une césarienne : pas de charge plus lourde que bébé les premières semaines, et demandez de l\'aide.']},
 siege:{n:'Bébé en siège',src:['siege'],
   g:w=>[w>=32&&w<36&&'Plusieurs bébés se retournent encore d\'ici 36 semaines.',w>=34&&'Demandez à votre équipe si une version (aider bébé à se retourner) vous sera proposée vers 36-37 semaines.',w>=34&&'Préparez votre plan de naissance pour les deux possibilités : accouchement vaginal ou césarienne.'],pp:d=>[]},
 rh:{n:'Rhésus négatif',src:['rh'],
   g:w=>[w>=24&&w<=30&&'Votre injection d\'anti-D se fait vers 28 semaines : vérifiez qu\'elle est prévue.','Après un saignement, une chute ou un coup au ventre : dites à l\'équipe que vous êtes Rh négatif.'],
   pp:d=>[d<=3&&'Si bébé est Rh positif, une injection d\'anti-D vous est donnée dans les 72 heures : vérifiez qu\'elle a été faite.']},
 peur:{n:'Peur de l\'accouchement',src:['peur'],
   g:w=>[w>=20&&'Remplissez « Mes peurs et mes besoins » : votre doula pourra en parler avec vous.',w>=28&&w<=34&&'Parlez maintenant de vos souhaits avec votre équipe : les décisions sur l\'accouchement se prennent souvent vers 32 semaines.',w>=30&&'Visiter le lieu de naissance d\'avance rend le jour J plus familier.'],
   pp:d=>[d<=60&&'Si la naissance vous a laissé des images difficiles, un « retour sur la naissance » avec votre doula ou votre équipe peut aider.']},
 fc:{n:'Grossesse après une perte',src:['nsfc','pail'],
   g:w=>[w<14&&'Les premières semaines peuvent être stressantes. Vous pouvez demander à être vue plus tôt.',w<14&&'Chaque journée compte, à votre rythme. Vous n\'avez pas à vous réjouir « comme il faut ».',w>=20&&'Si les mouvements de bébé vous rassurent, notez-les : vous apprendrez son rythme.'],
   pp:d=>[d<=30&&'Il est normal de ressentir à la fois une grande joie et de la tristesse pour le bébé d\'avant.']},
 col:{n:'Col court',src:[],g:w=>[w<37&&'Contractions régulières, pression dans le bassin, mal de dos inhabituel, perte de liquide ou saignement : appelez tout de suite.',w<37&&'Suivez les consignes de repos de votre équipe et acceptez l\'aide pour les tâches lourdes.'],pp:d=>[]},
 retard:{n:'Croissance de bébé surveillée',src:[],g:w=>[w>=26&&'Comptez les mouvements de bébé chaque jour. S\'il bouge moins, appelez sans attendre le lendemain.'],pp:d=>[]},
 pma:{n:'Grossesse par PMA',src:[],g:w=>[w<=12&&'Demandez à votre clinique quand votre suivi passe à votre médecin ou sage-femme.'],pp:d=>[]},
 anemie:{n:'Anémie',src:[],g:w=>['Fer avec un aliment riche en vitamine C, loin du thé, du café et du lait.'],pp:d=>[d<=42&&'Après la naissance, demandez si vous devez continuer le fer.']}
};
T.deuil=T.fc;
function liste(K,w,d){const out=[],src=new Set(),vus=new Set();K.forEach(k=>{const t=T[k];if(!t||vus.has(t))return;vus.add(t);const L2=(d==null?t.g(w):t.pp(d)).filter(Boolean);if(L2.length){out.push([t.n,L2]);t.src.forEach(s=>src.add(s))}});return [out,src]}
function carte(){if(S.role!=='parent')return '';let st=null;try{st=stage()}catch(e){}if(!st||(st.k!=='preg'&&!(st.k==='pp'&&st.day<=182)))return '';
  const K=conds();if(!K.size)return '';const [out,src]=st.k==='preg'?liste(K,st.g.w,null):liste(K,0,st.day);if(!out.length)return '';
  return '<div class="card ps-carte"><span class="eyebrow acc">Pour moi '+(st.k==='preg'?'cette semaine':'en ce moment')+'</span><p class="xs muted" style="margin:2px 0 6px">Adapté à ce que vous avez noté dans « Ma grossesse »</p>'+
    out.map(([n,L2])=>'<div class="ps-bloc"><b class="small">'+n+'</b><ul class="clean dv-l small">'+L2.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>').join('')+
    (src.size?'<p class="xs muted" style="margin:6px 0 0">Sources : '+[...src].map(s=>SRC[s]).join(' · ')+'. Votre équipe de soins reste votre référence.</p>':'<p class="xs muted" style="margin:6px 0 0">Votre équipe de soins reste votre référence.</p>')+'</div>'}
window.psCarte=carte;
if(window.ESPACE==='parent'){
  /* textes généraux à ajuster selon la situation */
  const DIA=K=>K.has('diabete')||K.has('diabeteav');
  const AJ=[
    [DIA,'<b>Manger pour deux',h=>'<b>Manger pour deux ?</b> Non. Avec votre diabète, suivez plutôt le plan fait avec votre nutritionniste : des repas et collations réguliers, avec des protéines à chaque fois.'],
    [K=>K.has('placenta')||K.has('col'),'<b>Bouger</b>',h=>'<b>Bouger</b> : seulement les activités que votre équipe vous a permises (placenta bas ou col court).'],
    [DIA,'<b>Bouger</b>',h=>h+' Avec votre diabète, une marche de 20 à 30 minutes après les repas aide aussi vos glycémies.'],
    [K=>K.has('hyper'),'<b>Au 1er trimestre</b>',h=>'<b>Au 1er trimestre</b>, avec des nausées sévères, il est fréquent de ne pas prendre de poids, ou même d\'en perdre un peu : votre équipe le suit. Gardez surtout les liquides.']];
  const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(S.role!=='parent')return x;const app=document.getElementById('app');const K=conds();
    if(K.size){app.querySelectorAll('.gm-poids li').forEach(li=>{if(li.dataset.ps)return;const h=li.innerHTML;for(const [ok,deb,f] of AJ){if(ok(K)&&h.startsWith(deb)){li.innerHTML=f(h);li.dataset.ps='1';break}}})}
    if((S.tab||'accueil')==='accueil'&&!S.vue&&!app.querySelector('.ps-carte')){const c=carte();if(c){const t=document.createElement('template');t.innerHTML=c;const ref=app.querySelector(':scope>.quick')||app.querySelector(':scope>.card');if(ref)ref.after(t.content);else app.append(t.content)}}
  }catch(e){}return x};
}
/* ---------- côté doula ---------- */
const DT={diabete:'Diabète de grossesse : collations et lecteur dans la valise; bébé au sein dans les 2 premières heures aide sa glycémie; rappeler le test de glycémie 6 semaines à 6 mois après.',
  diabeteav:'Diabète de type 1 ou 2 : demander à l\'avance le plan de gestion de la glycémie pendant le travail; collation à portée pour les tétées de nuit.',
  sopk:'SOPK : anxiété plus fréquente, prendre des nouvelles du moral.',
  tension:'Tension élevée : connaître les signes d\'alerte; après la naissance, prééclampsie possible jusqu\'à 6 semaines.',
  hyper:'Nausées sévères : priorité aux liquides, offrir de l\'aide concrète (repas, enfants).',
  placenta:'Placenta bas : pas de rapports ni d\'efforts intenses sans accord; tout saignement = appel immédiat; préparer aussi un plan de césarienne.',
  siege:'Siège : version possible vers 36-37 semaines; plan de naissance pour les deux possibilités.',
  rh:'Rh négatif : anti-D vers 28 semaines et dans les 72 h après la naissance si bébé Rh+.',
  peur:'Peur de l\'accouchement : prendre le temps de « Mes peurs et mes besoins », visite du lieu de naissance, proposer un retour sur la naissance.',
  fc:'Grossesse après une perte : vocabulaire doux, ne pas minimiser; dates anniversaires à surveiller.',deuil:'Deuil périnatal vécu : vocabulaire doux, dates anniversaires à surveiller.',
  col:'Col court : signes de travail prématuré; aide concrète pour respecter le repos.',retard:'Croissance surveillée : encourager le décompte des mouvements.',
  pma:'Parcours de PMA : beaucoup d\'émotions accumulées, l\'inquiétude est normale.',anemie:'Anémie : fatigue; collations riches en fer.',peur2:''};
if(window.ESPACE!=='parent'&&typeof cSuivi==='function'){const _cs=cSuivi;cSuivi=function(c){const h=_cs.apply(this,arguments);try{const K=conds((c&&c.parent_data)||{});const L2=[...K].map(k=>DT[k]).filter(Boolean);if(!L2.length)return h;
  return h+'<div class="card"><span class="eyebrow acc">Points d\'attention pour l\'accompagner</span><ul class="clean dv-l small">'+L2.map(x=>'<li>'+x+'</li>').join('')+'</ul><p class="xs muted">Selon ce que la famille a noté. Son équipe de soins reste la référence médicale.</p></div>'}catch(e){return h}}}
(function(){const st=document.createElement('style');st.textContent='.ps-carte .ps-bloc+.ps-bloc{margin-top:8px;padding-top:8px;border-top:1px solid var(--line,#eadfd6)}.ps-carte ul{margin:4px 0 0}';document.head.appendChild(st)})();
})();
