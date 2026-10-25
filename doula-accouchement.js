/* Sérénaissance — onglet « Accouchement » du dossier (espace doula) : le dossier complet tenu pendant la naissance.
   Arrivée et équipe, déroulement du travail (tel que rapporté par l'équipe soignante), mesures de confort et positions,
   poussée et naissance, bébé, après la naissance, durée de présence, notes pour le retour sur la naissance, et compte rendu à copier.
   La doula note des faits observés ou rapportés : aucune évaluation clinique. */
(function(){
if(window.ESPACE==='parent'||typeof cTravail!=='function')return;
const CONF=['Respiration guidée','Massage','Contre-pression (bas du dos)','Compression des hanches','Rebozo','Ballon','Bain ou douche','Chaleur (bouillotte, compresse)','Froid (débarbouillette)','Aromathérapie','Musique, ambiance tamisée','Visualisation, affirmations','Marche, mouvement','Hydratation, collations','Encouragements','Soutien et pauses pour le partenaire','Aide à la communication avec l\'équipe'];
const POS=['Debout, marche','Penchée vers l\'avant','Sur le ballon','À quatre pattes','Sur le côté','Accroupie','Dans le bain','Semi-assise','À genoux','Sur la chaise d\'accouchement'];
const ANALG=['Aucune','Péridurale','Protoxyde d\'azote (gaz)','Opioïdes','Rachianesthésie','Bain, TENS ou autre méthode non médicamenteuse'];
const INTERV=['Monitoring continu','Ocytocine (Pitocin)','Ventouse','Forceps','Épisiotomie','Déchirure','Césarienne','Clampage tardif du cordon','Délivrance dirigée'];
const sec=(ic,t,body,ouvert)=>'<details class="acc da-sec"'+(ouvert?' open':'')+'><summary>'+icon(ic,'var(--accent)')+t+'<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body">'+body+'</div></details>';
const g=(o,k)=>(o||{})[k]||'';
const on=o=>Object.keys(o||{}).filter(k=>o[k]);
function duree(M){const a=M.m1||M.m0,b=M.m9;if(!a||!b)return '';const [h1,m1]=a.split(':').map(Number),[h2,m2]=b.split(':').map(Number);let d=(h2*60+m2)-(h1*60+m1);if(d<0)d+=1440;return Math.floor(d/60)+' h '+String(d%60).padStart(2,'0')}
function infosFam(c){const p=c.parent_data||{},I=p.grossesseInfos||{},L=[];if((I.conds||[]).length)L.push((I.conds||[]).length+' particularité(s) notée(s)');if(I.notes)L.push(esc(I.notes));const pl=p.plan&&Object.keys(p.plan).length;return {L,pl}}
const _ct=cTravail;
cTravail=function(c,i,P){let h=_ct.apply(this,arguments);try{const A=c.acc||{},Q=P+'.acc',M=c.moments||{},F=infosFam(c);
  let x='<div class="card da-intro"><span class="eyebrow acc">Dossier de l\'accouchement</span><p class="xs muted" style="margin:2px 0 0">Ouvrez chaque section au fil de la naissance. Notez les faits observés et ce que l\'équipe vous rapporte, sans interprétation clinique. Tout s\'enregistre automatiquement.</p>'+
    (F.L.length?'<div class="banner acc" style="margin-top:8px">'+icon('fa-circle-info')+'<div class="small"><b>À garder en tête :</b> '+F.L.join(' · ')+'</div></div>':'')+'</div>';
  x+=sec('fa-hospital','Arrivée et équipe',
    '<span class="small"><b>Lieu de naissance</b></span>'+ui.pick(Q+'.lieu',['Hôpital','Maison de naissance','Domicile'])+
    '<div class="grid2 resp">'+ui.text(Q+'.lieuNom','Nom du lieu, chambre')+ui.text(Q+'.presents','Personnes présentes')+ui.text(Q+'.medecin','Médecin ou sage-femme')+ui.text(Q+'.inf','Infirmière(s)')+'</div>'+
    '<span class="small"><b>Plan de naissance remis à l\'équipe</b></span>'+ui.pick(Q+'.plan',['Oui','Non','Pas de plan'])+
    ui.area(Q+'.arrivee','À mon arrivée (comment elle allait, rythme des contractions rapporté, ambiance)','',60),true);
  x+=sec('fa-wave-square','Déroulement du travail',
    '<span class="small"><b>Début du travail</b></span>'+ui.pick(Q+'.debut',['Spontané','Provoqué'])+
    '<div class="grid2 resp">'+ui.text(Q+'.induction','Si provoqué : méthode et heure (rapportées)')+ui.text(Q+'.contr','Début des contractions (date et heure)','datetime-local')+'</div>'+
    '<span class="small"><b>Rupture des membranes</b></span>'+ui.pick(Q+'.rupture',['Spontanée','Artificielle','Pas encore'])+
    '<div class="grid2 resp">'+ui.text(Q+'.eauxH','Heure des eaux','time')+'</div><span class="small"><b>Liquide (rapporté)</b></span>'+ui.pick(Q+'.eauxA',['Clair','Teinté','Inconnu'])+
    '<span class="small" style="display:block;margin-top:8px"><b>Soulagement de la douleur</b></span>'+ui.checks(Q+'.analg',ANALG)+
    '<div class="grid2 resp">'+ui.text(Q+'.peridH','Heure de la péridurale','time')+'</div>'+
    ui.area(Q+'.examens','Examens et nouvelles rapportés par l\'équipe (heure, dilatation, décisions)','Ex. : 14 h 10, 6 cm selon l\'infirmière',60));
  x+=sec('fa-hand-holding-heart','Confort et positions',
    '<span class="small"><b>Mesures de confort offertes</b></span>'+ui.checks(Q+'.conf',CONF)+
    '<span class="small" style="display:block;margin-top:8px"><b>Positions utilisées</b></span>'+ui.checks(Q+'.pos',POS)+
    ui.area(Q+'.aide','Ce qui l\'a le plus aidée','',50)+ui.area(Q+'.besoins','Ses demandes et ses mots pendant le travail','',50));
  x+=sec('fa-person-pregnant','Poussée et naissance',
    '<div class="grid2 resp">'+ui.text(Q+'.pousseeH','Début de la poussée','time')+ui.text(Q+'.naissH','Heure de naissance','time')+ui.text(Q+'.posNaiss','Position à la naissance')+ui.text(Q+'.placentaH','Heure de la délivrance (placenta)','time')+'</div>'+
    '<span class="small"><b>Interventions (rapportées)</b></span>'+ui.checks(Q+'.interv',INTERV)+
    ui.text(Q+'.motif','Si césarienne ou instruments : raison donnée par l\'équipe')+ui.area(Q+'.naissNotes','Le moment de la naissance (qui a accueilli bébé, premiers mots, émotions)','',60));
  x+=sec('fa-baby','Bébé',
    '<span class="small"><b>Sexe</b></span>'+ui.pick(Q+'.sexe',['Fille','Garçon'])+
    '<div class="grid2 resp">'+ui.text(Q+'.poids','Poids (g)','number')+ui.text(Q+'.taille','Taille (cm)','number')+ui.text(Q+'.pc','Tour de tête (cm)','number')+ui.text(Q+'.apgar','Apgar rapporté (1 min / 5 min)','text','Ex. : 8 / 9')+ui.text(Q+'.tetee','Première tétée','time')+'</div>'+
    '<span class="small"><b>Peau à peau</b></span>'+ui.pick(Q+'.pap',['Immédiat','Différé','Avec le partenaire'])+
    '<span class="small"><b>Alimentation</b></span>'+ui.pick(Q+'.alim',['Sein','Biberon','Mixte'])+ui.area(Q+'.bebeNotes','Notes (soins, observations rapportées)','',40));
  x+=sec('fa-heart','Après la naissance',
    ui.area(Q+'.maman','Comment va la maman (rapporté, émotions, besoins)','',50)+ui.area(Q+'.partenaire','Le partenaire','',40)+ui.area(Q+'.suite','À faire ensuite (appel du lendemain, visite, référence)','',40)+
    '<p class="small" style="margin:6px 0 0"><b>Présence de la doula :</b> '+(duree(M)?duree(M)+' (de '+(M.m1||M.m0)+' à '+M.m9+')':'notez « Arrivée de la doula » et « Départ de la doula » dans les grands moments')+'</p>');
  x+=sec('fa-feather','Pour le retour sur la naissance',ui.area(Q+'.recit','Mots marquants, citations, petits détails à lui raconter plus tard','',90)+
    '<button class="btn sm ghost" data-da-copie="'+c.id+'">'+icon('fa-copy')+'Copier le compte rendu</button><p class="xs muted">Le compte rendu reprend les grands moments et ce dossier, pour votre remplaçante, la famille ou vos archives.</p>');
  /* le dossier se place avant la section Naissance d'origine (qui reste pour la date et le type) */
  const k=h.indexOf('<div class="card"><span class="eyebrow acc">Naissance</span>');h=k>0?h.slice(0,k)+x+h.slice(k):h+x}catch(e){}return h};
function texte(c){const A=c.acc||{},M=c.moments||{},L=[];const add=(l,v)=>{if(v&&String(v).trim())L.push(l+' : '+v)};
  L.push('COMPTE RENDU DE L\'ACCOUCHEMENT'+(c.nom?' · '+c.nom:''));if(c.naiss)L.push('Naissance le '+c.naiss+(c.bebe?' · '+c.bebe:'')+(c.typeNaiss?' · '+c.typeNaiss:''));L.push('');
  L.push('Grands moments');MOMENTS.forEach((m,k)=>{if(M['m'+k])L.push('• '+M['m'+k]+' : '+m)});L.push('');
  add('Lieu',[A.lieu,A.lieuNom].filter(Boolean).join(', '));add('Équipe',[A.medecin,A.inf].filter(Boolean).join(', '));add('Présents',A.presents);add('Plan de naissance remis',A.plan);add('À l\'arrivée',A.arrivee);
  add('Début du travail',A.debut+(A.induction?' ('+A.induction+')':''));add('Contractions depuis',(A.contr||'').replace('T',' '));add('Membranes',[A.rupture,A.eauxH,A.eauxA].filter(Boolean).join(', '));
  add('Soulagement',on(A.analg).join(', ')+(A.peridH?' · péridurale à '+A.peridH:''));add('Examens et nouvelles',A.examens);
  add('Confort offert',on(A.conf).join(', '));add('Positions',on(A.pos).join(', '));add('Ce qui a aidé',A.aide);add('Ses mots',A.besoins);
  add('Poussée',A.pousseeH);add('Naissance',[A.naissH,A.posNaiss].filter(Boolean).join(', '));add('Interventions',on(A.interv).join(', ')+(A.motif?' ('+A.motif+')':''));add('Placenta',A.placentaH);add('Le moment',A.naissNotes);
  add('Bébé',[A.sexe,A.poids?A.poids+' g':'',A.taille?A.taille+' cm':'',A.pc?'TC '+A.pc+' cm':'',A.apgar?'Apgar '+A.apgar:''].filter(Boolean).join(' · '));add('Peau à peau',A.pap);add('Première tétée',A.tetee);add('Alimentation',A.alim);add('Notes bébé',A.bebeNotes);
  add('Maman',A.maman);add('Partenaire',A.partenaire);add('Suite',A.suite);add('Présence de la doula',duree(M));add('Pour le retour sur la naissance',A.recit);
  return L.join('\n')}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-da-copie]');if(!b)return;e.stopPropagation();const c=(S.clients||[]).find(x=>String(x.id)===b.dataset.daCopie);if(!c)return;
  try{await navigator.clipboard.writeText(texte(c));toast('Compte rendu copié')}catch(x){sheet('Compte rendu','<textarea style="min-height:300px" readonly>'+esc(texte(c))+'</textarea>')}},true);
(function(){const st=document.createElement('style');st.textContent='.da-sec .checks{display:grid;grid-template-columns:1fr;gap:4px;margin:4px 0 8px}@media(min-width:560px){.da-sec .checks{grid-template-columns:1fr 1fr}}.da-sec .tri{margin:4px 0 10px}';document.head.appendChild(st)})();
})();
