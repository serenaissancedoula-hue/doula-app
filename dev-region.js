/* Sérénaissance — adapte la page Développement (enfants et bébé) au pays choisi :
   numéros d'urgence, démarches et organismes ne sont plus ceux du Canada quand la famille habite ailleurs. */
(function(){
  const reg=()=>{try{return (window.maRegion&&window.maRegion())||''}catch(e){return ''}};
  const info={
    FR:{ligne:'le 15 (SAMU) ou votre médecin',pied:'SAMU 15 · Urgence 112',pmi:'la PMI (protection maternelle et infantile)',carte:'carte Vitale et allocations familiales (CAF)',gard:'crèche',vue:'ophtalmologiste ou orthoptiste',n:'15'},
    US:{ligne:'la ligne infirmière de votre assurance ou votre pédiatre',pied:'Urgence 911',pmi:'votre pédiatre ou le département de santé de votre comté',carte:'numéro de sécurité sociale et assurance santé de l\'enfant',gard:'garderie',vue:'optométriste',n:'911'},
    'W-CH':{ligne:'le 144 ou votre médecin',pied:'Urgence 144 · 112',pmi:'votre pédiatre ou le service de santé de votre commune',carte:'assurance maladie et allocations familiales',gard:'crèche',vue:'ophtalmologue',n:'144'},
    'W-BE':{ligne:'le 112 ou votre médecin',pied:'Urgence 112 · Médecin de garde',pmi:'l\'ONE (Wallonie, Bruxelles) ou Kind en Gezin (Flandre)',carte:'mutuelle et allocations familiales',gard:'crèche',vue:'ophtalmologue',n:'112'},
    'W-GB':{ligne:'le 111 (NHS) ou votre médecin',pied:'NHS 111 · Urgence 999',pmi:'votre health visitor ou votre médecin généraliste (GP)',carte:'enregistrement chez un GP et Child Benefit',gard:'nursery',vue:'opticien (examen de la vue gratuit pour les enfants)',n:'111'}
  };
  const defW={ligne:'le numéro d\'urgence de votre pays ou votre médecin',pied:'Urgence : numéro de votre pays (112 en Europe)',pmi:'votre médecin ou le service de santé de votre région',carte:'couverture santé et allocations familiales',gard:'garderie',vue:'professionnel de la vue',n:'112'};
  function adapter(h){
    const r=reg();if(!r||(r!=='FR'&&r!=='US'&&r.indexOf('W-')!==0))return h;
    const I=info[r]||defW;
    return h
      .replace(/une goutte de vitamine D \(400 UI\) par jour est recommandée par Santé Canada/g,'de la vitamine D chaque jour est généralement recommandée : demandez la dose à votre médecin')
      .replace(/ \((?:Société canadienne de pédiatrie|Santé Canada)[^)]*\)/g,'')
      .replace(/ \(directives canadiennes\)/g,'')
      .replace(/ est recommandée par Santé Canada/g,' est généralement recommandée')
      .replace(/<a [^>]*>[^<]*(?:canadienne|Canada|INSPQ)[^<]*<\/a>(?: · )?/g,'')
      .replace(/ · (<\/p>)/g,'$1')
      .replace(/<p class="xs muted" style="margin:6px 0 0">Info-Santé 811 · Urgence 911<\/p>/g,'<p class="xs muted" style="margin:6px 0 0">'+I.pied+'</p>')
      .replace(/Info-Santé 811, votre doula, le CLSC ou la santé publique/g,I.pied+', votre doula, '+I.pmi)
      .replace(/Appelez le jour même ou Info-Santé 811 si/g,'Appelez le jour même '+I.ligne.replace(/^le /,'le ')+' si')
      .replace(/appelez le 811 ou votre médecin/g,'appelez '+I.ligne)
      .replace(/Info-Santé 811 au besoin/g,I.ligne.charAt(0).toUpperCase()+I.ligne.slice(1)+' au besoin')
      .replace(/prenez rendez-vous au CLSC, à la santé publique ou chez votre médecin/g,'prenez rendez-vous chez votre médecin ou à '+I.pmi)
      .replace(/carte d'assurance maladie et Allocation canadienne pour enfants/g,I.carte)
      .replace(/chez l'optométriste entre 2 et 5 ans \(Association des optométristes du Canada\)/g,'chez le '+I.vue+' entre 2 et 5 ans')
      .replace(/garderie/g,I.gard)
      .replace(/<p class="xs muted" style="margin:0 4px 14px">Repères vérifiés auprès de :[\s\S]*?<\/p>/,'<p class="xs muted" style="margin:0 4px 14px">Repères généraux sur le développement de l\'enfant. Chaque enfant va à son rythme : votre médecin ou votre pédiatre a toujours le dernier mot.</p>')
  }
  window.dvAdapt=adapter;
})();
