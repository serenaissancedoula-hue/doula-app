/* Sérénaissance — « Du soutien près de chez vous » (famille) : selon le pays ou la province choisi à l'inscription,
   les bons numéros et organismes : ligne santé, santé mentale périnatale, allaitement, soutien aux parents, fertilité, urgence.
   La région se choisit dès le choix du parcours (et peut se changer dans Paramètres).
   Vérifié : Cœur + AVC (lignes santé par province), GNWT (811 T.N.-O.), 988.ca, HRSA (1-833-TLC-MAMA), Postpartum Support International,
   INSPQ (allaitement au Québec), CIUSSS Capitale-Nationale (Ligne Parents), Santé.fr (3114), Enfance et Partage (Allô Parents Bébé), LLL Canada. */
(function(){
if(window.ESPACE!=='parent')return;
const NOMS={NB:'Nouveau-Brunswick',QC:'Québec',ON:'Ontario',NS:'Nouvelle-Écosse',PE:'Île-du-Prince-Édouard',NL:'Terre-Neuve-et-Labrador',MB:'Manitoba',SK:'Saskatchewan',AB:'Alberta',BC:'Colombie-Britannique',YT:'Yukon',NT:'Territoires du Nord-Ouest',NU:'Nunavut',FR:'France',US:'États-Unis'};
/* Tous les autres pays du monde : code « W-XX » (XX = code ISO du pays) */
const PAYS_ISO='AF AX AL DZ AS AD AO AI AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BA BW BR VG BN BG BF BI KH CM CV KY CF TD CL CN CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI PF GA GM GE DE GH GI GR GL GD GU GT GG GN GW GY HT HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI XK KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU KP MK MP NO OM PK PW PS PA PG PY PE PH PL PT PR QA RE RO RU RW WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA KR SS ES LK BL SH KN LC MF PM VC SD SR SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB UY UZ VU VA VE VN WF EH YE ZM ZW GP GF'.split(' ');
let DN=null;try{DN=new Intl.DisplayNames(['fr'],{type:'region'})}catch(e){}
const PAYS_W=PAYS_ISO.filter(c=>c!=='CA'&&c!=='FR'&&c!=='US').map(c=>{let n=c;try{n=(DN&&DN.of(c))||c}catch(e){}return ['W-'+c,n]}).sort((a,b)=>a[1].localeCompare(b[1],'fr'));
PAYS_W.forEach(p=>{NOMS[p[0]]=p[1]});
const estW=r=>typeof r==='string'&&r.indexOf('W-')===0;
const LIGNE={NB:['Télé-Soins','811'],QC:['Info-Santé et Info-Social','811'],ON:['Santé811','811'],NS:['811 Nouvelle-Écosse','811'],PE:['811 Île-du-Prince-Édouard','811'],NL:['HealthLine','811'],MB:['Health Links – Info Santé','1-888-315-9257'],SK:['HealthLine','811'],AB:['Health Link','811'],BC:['HealthLinkBC','811'],YT:['Yukon HealthLine','811'],NT:['Ligne de conseils santé','811']};
const sauver=()=>{try{if(typeof saveParent==='function')saveParent();else save()}catch(e){}};
function region(){const p=S.parent||{};return NOMS[p.region]?p.region:NOMS[p.vacRegion]&&p.regionChoisie?p.vacRegion:''}
window.maRegion=region;

function choisir(r){if(!NOMS[r])return;S.parent.region=r;S.parent.regionChoisie=true;S.parent.vacRegion=r;sauver()}
const sel=(id,v)=>'<select '+id+'><option value="">Choisir…</option><optgroup label="Canada">'+Object.keys(NOMS).filter(k=>k!=='FR'&&k!=='US').map(k=>'<option value="'+k+'"'+(v===k?' selected':'')+'>'+NOMS[k]+'</option>').join('')+'</optgroup><option value="FR"'+(v==='FR'?' selected':'')+'>France</option><option value="US"'+(v==='US'?' selected':'')+'>États-Unis</option><optgroup label="Autres pays">'+PAYS_W.map(p=>'<option value="'+p[0]+'"'+(v===p[0]?' selected':'')+'>'+p[1]+'</option>').join('')+'</optgroup></select>';
const tel=(n,lab)=>'<a class="so-tel" href="tel:'+n.replace(/[^\d+]/g,'')+'">'+icon('fa-phone')+(lab||n)+'</a>';
const web=(u,lab)=>'<a class="so-web" href="'+u+'" target="_blank" rel="noopener">'+icon('fa-arrow-up-right-from-square')+lab+'</a>';
/* une ressource : [icône, titre, description, liens html] */
function ressources(r,k){const R=[],CA=r&&r!=='FR'&&r!=='US'&&!estW(r);
  const ur=r==='FR'?['🚑','Urgence','SAMU, accouchement qui commence vite, saignement abondant, bébé qui respire mal.',tel('15','15')+tel('112','112')]:['🚑','Urgence','Saignement abondant, difficulté à respirer, douleur à la poitrine, bébé bleuté ou très mou, pensées de vous faire du mal.',tel('911','911')];
  const PR={'W-CH':{u:['SAMU suisse : ambulance 144, police 117, pompiers 118; le 112 fonctionne aussi.',[['144','144'],['112','112']]],g:['Médecin de garde et conseil santé 24 h','Soir, nuit et fin de semaine : appelez le médecin de garde de votre canton ou la ligne de conseil de votre assurance (numéro au dos de votre carte).',''],m:[['La Main Tendue','Écoute 24 h sur 24, gratuite et anonyme, quand ça ne va pas.',tel('143')+web('https://www.143.ch/','143.ch')]],sf:[['Trouver une sage-femme','La Fédération suisse des sages-femmes tient une liste des sages-femmes indépendantes près de chez vous (suivi de grossesse, accouchement, retour à la maison).',web('https://www.sage-femme.ch/','sage-femme.ch')]]},
    'W-BE':{u:['Urgences en Belgique : 112 (ambulance, pompiers) ou 101 (police).',[['112','112']]],g:['Médecin de garde','Soir, nuit et fin de semaine, quand le cabinet est fermé et que ce n\'est pas une urgence vitale : le 1733.',tel('1733','1733')],m:[['Centre de prévention du suicide','Écoute 24 h sur 24, gratuite, quand la détresse devient trop lourde.',tel('0800 32 123')+web('https://www.preventionsuicide.be/','preventionsuicide.be')]],sf:[['ONE (Fédération Wallonie-Bruxelles)','L\'Office de la Naissance et de l\'Enfance accompagne les futurs parents et les familles : consultations, visites à domicile.',web('https://www.one.be/','one.be')]]},
    'W-GB':{u:['Urgences au Royaume-Uni : 999 (ambulance, police, pompiers).',[['999','999']]],g:['NHS 111','Pas une urgence vitale mais besoin d\'un avis médical rapide, jour et nuit : appelez le 111 (gratuit) ou allez sur 111.nhs.uk.',tel('111','111')+web('https://111.nhs.uk/','111.nhs.uk')],m:[['PANDAS Foundation','Soutien gratuit pour la dépression et l\'anxiété pendant la grossesse et après la naissance.',tel('0808 1961 776')+web('https://pandasfoundation.org.uk/','pandasfoundation.org.uk')],['Samaritans','Écoute 24 h sur 24, gratuite, quand ça ne va pas.',tel('116 123')]],sf:[['Suivi de grossesse (NHS)','Vous pouvez vous adresser directement au service de maternité de votre hôpital local, sans passer par un médecin, ou demander à votre médecin de famille (GP).','']]}}[r];
  R.push(PR?['🚑','Urgence',PR.u[0],PR.u[1].map(x=>tel(x[0],x[1])).join('')]:estW(r)?['🚑','Urgence','Appelez le numéro d\'urgence de votre pays (le 112 fonctionne dans toute l\'Union européenne et dans beaucoup d\'autres pays). Demandez-le à votre clinique ou à votre doula si vous ne le connaissez pas.','']:ur);
  if(PR){R.push(['🩺',PR.g[0],PR.g[1],PR.g[2]]);PR.sf.forEach(x=>R.push(['👩‍⚕️',x[0],x[1],x[2]]))}
  if(CA){const L=LIGNE[r];if(L)R.push(['🩺',L[0]+' ('+L[1]+')','Une infirmière vous répond 24 h sur 24, gratuitement : fièvre, saignements, allaitement, bébé qui pleure beaucoup, inquiétude de grossesse.'+(r==='QC'?' Faites l\'option Info-Social pour parler de ce que vous vivez.':''),tel(L[1])]);
    else if(r==='NU')R.push(['🩺','Votre centre de santé communautaire','Au Nunavut, il n\'y a pas de 811 : appelez votre centre de santé. Pour parler à quelqu\'un en tout temps : Kamatsiaqtut Help Line.',tel('1-800-265-3333','1-800-265-3333')])}
  if(r==='FR')R.push(['🩺','Médecin de garde','Soir, nuit et fin de semaine, quand le cabinet est fermé et que ce n\'est pas une urgence vitale.',tel('116117','116 117')]);
  if(r==='US')R.push(['🩺','Ligne infirmière de votre assurance','La plupart des assurances et des hôpitaux ont une ligne infirmière 24 h : le numéro est au dos de votre carte. Sinon, appelez votre clinique.','']);
  /* moral et santé mentale */
  if(k!=='conception'){
    if(CA)R.push(['💛','Postpartum Support International','Écoute et références pour l\'anxiété ou la déprime pendant la grossesse et après la naissance (pas une ligne de crise). Appel ou texto, partout au Canada et aux États-Unis, en anglais et en espagnol.',tel('1-800-944-4773')+web('https://postpartum.net/','postpartum.net')]);
    if(r==='US')R.push(['💛','National Maternal Mental Health Hotline','Gratuit, confidentiel, 24 h sur 24 : appel ou texto, en anglais et en espagnol, pendant la grossesse et après.',tel('1-833-852-6262','1-833-TLC-MAMA')+web('https://mchb.hrsa.gov/national-maternal-mental-health-hotline','Site')]);
    if(PR)PR.m.forEach(x=>R.push(['💛',x[0],x[1],x[2]]));
    if(r==='FR')R.push(['💛','Maman Blues','Association de soutien aux mamans qui vivent une difficulté maternelle (baby blues, dépression du post-partum) : témoignages, forums, rencontres.',web('https://www.maman-blues.fr/','maman-blues.fr')])}
  if(CA||r==='US')R.push(['🆘','988 : ligne de crise','Si vous avez des pensées suicidaires ou vous sentez en détresse : appelez ou textez le 988, 24 h sur 24'+(CA?', en français ou en anglais':'')+'.',tel('988')]);
  if(r==='FR')R.push(['🆘','3114 : prévention du suicide','Gratuit, 24 h sur 24, partout en France : pour vous ou pour un proche. Des infirmiers et psychologues vous répondent.',tel('3114')]);
  /* allaitement */
  if(k==='bebe'||k==='grossesse'){
    if(r==='QC')R.push(['🤱','Allaitement au Québec','Ligue La Leche : 1 866 255-2483 · Nourri-Source (jumelage avec une marraine d\'allaitement) : 1 866 948-5160 · Votre CLSC pour une infirmière ou une consultante.',tel('1-866-255-2483','Ligue La Leche')+tel('1-866-948-5160','Nourri-Source')]);
    else if(CA)R.push(['🤱','Allaitement','La Leche League Canada : des monitrices bénévoles répondent par téléphone et en ligne. Votre santé publique offre aussi souvent des cliniques d\'allaitement gratuites.',web('https://lllc.ca/','lllc.ca')]);
    if(r==='FR')R.push(['🤱','Allaitement','La Leche League France : écoute téléphonique et réunions près de chez vous. Votre PMI et votre sage-femme peuvent aussi vous accompagner.',web('https://www.lllfrance.org/','lllfrance.org')]);
    if(r==='US')R.push(['🤱','Allaitement','La Leche League USA, et le programme WIC (conseillères en allaitement, aliments et tire-lait selon le revenu).',web('https://lllusa.org/','LLL USA')+web('https://www.fns.usda.gov/wic','WIC')])}
  /* parents */
  if(k==='bebe'||k==='grossesse'){
    if(r==='QC')R.push(['👨‍👩‍👧','Ligne Parents','Une intervenante vous écoute et vous conseille, gratuitement, 24 h sur 24 : fatigue, pleurs, colère, couple, questions sur bébé.',tel('1-800-361-5085')]);
    if(r==='FR')R.push(['👨‍👩‍👧','Allô Parents Bébé','Numéro vert pour les questions de la grossesse aux 3 ans de l\'enfant : pleurs, sommeil, fatigue, doutes.',tel('0800003456','0 800 00 3456')+web('https://www.1000-premiers-jours.fr/','1000 premiers jours')]);
    if(CA||r==='US')R.push(['🏡','211 : services près de chez vous','Pour trouver gratuitement les ressources de votre quartier : maisons de la famille, haltes-garderies, banques alimentaires, aide au logement, groupes de parents.',tel('211')])}
  /* fertilité */
  if(k==='conception'){
    if(CA)R.push(['🌱','Fertility Matters Canada','Information, groupes de soutien et défense des droits pour les personnes en parcours de fertilité.',web('https://fertilitymatters.ca/','fertilitymatters.ca')]);
    if(r==='QC')R.push(['🌱','Procréation assistée au Québec','Le programme public couvre certains services (évaluation, insémination, FIV selon les critères). Parlez-en à votre médecin ou à une clinique.',web('https://www.quebec.ca/sante/conseils-et-prevention/sante-sexuelle-et-reproductive/procreation-medicalement-assistee','Québec.ca')]);
    if(r==='FR')R.push(['🌱','Associations fertilité','BAMP et Collectif Fertilité France : écoute, information et groupes de parole pour les parcours de PMA.',web('https://www.bamp.fr/','BAMP')]);
    if(r==='US')R.push(['🌱','RESOLVE','L\'association nationale de l\'infertilité : groupes de soutien gratuits, information sur les traitements et les assurances.',web('https://resolve.org/','resolve.org')]);
    R.push(['💛','Le moral pendant les essais','Les mois d\'attente pèsent. Parlez-en à votre médecin, à une psychologue spécialisée en fertilité ou à votre doula : vous n\'avez pas à porter ça seule.',''])}
  return R}
function etape(){try{const s=stage();if(s.k==='pp')return 'bebe';if(s.k==='preg')return 'grossesse'}catch(e){}return 'conception'}
function carte(complet){const r=region(),k=etape();
  if(!r)return '<div class="card so"><span class="eyebrow acc">Du soutien près de chez vous</span><p class="small" style="margin:4px 0 8px">Où habitez-vous ? On vous montre les bons numéros et les organismes de votre région.</p><label class="f">Ma province, mon territoire ou mon pays'+sel('data-so-reg="1"','')+'</label></div>';
  const R=ressources(r,k);
  return '<div class="card so"><div class="row between"><span class="eyebrow acc">Du soutien près de chez vous</span><span class="xs muted">'+NOMS[r]+'</span></div><p class="small muted" style="margin:2px 0 8px">'+(k==='conception'?'Pendant les essais, vous n\'êtes pas seule.':k==='grossesse'?'Une question, une inquiétude, un coup de fatigue : demandez de l\'aide, c\'est fait pour ça.':'Les premiers mois sont exigeants : demander de l\'aide, c\'est prendre soin de bébé aussi.')+'</p>'+
    '<div class="so-l">'+R.map(x=>'<div class="so-i"><span class="so-ic">'+x[0]+'</span><div><b>'+x[1]+'</b><p>'+x[2]+'</p>'+(x[3]?'<div class="so-a">'+x[3]+'</div>':'')+'</div></div>').join('')+'</div>'+
    (S.parent.doulaId||S.parent.famille_id||(window.ME_FAM)?'':'<button class="btn ghost sm" data-en-reg="1" style="margin-top:8px">'+icon('fa-location-dot')+'Trouver une doula près de chez moi</button>')+
    '<p class="xs muted" style="margin-top:8px">Numéros vérifiés auprès des sources officielles. Pas votre région ? <a href="#" data-so-chg="1">Changer</a></p></div>'}
window.soutienCarte=carte;
/* au choix du parcours : on demande aussi la région */
const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(S.role!=='parent')return x;const app=document.getElementById('app');
    const ch=app.querySelector('.ft-choix');if(ch&&!app.querySelector('.so-ins')){const t=document.createElement('template');t.innerHTML='<div class="card so-ins"><label class="f" style="margin:0">Où habitez-vous ?'+sel('data-so-reg="1"',region())+'</label><p class="xs muted" style="margin:6px 0 0">Pour vous montrer les bons calendriers de vaccins, les démarches et le soutien de votre région.</p></div>';ch.before(t.content)}
    if(S.vue||S.sub)return x;
    /* Suivi : la carte de soutien en bas ; Accueil : on demande la région si elle manque */
    if(S.tab==='suivi'&&!app.querySelector('.so')){const t=document.createElement('template');t.innerHTML=carte();const ft=app.querySelector(':scope>.foot');if(ft)ft.before(t.content);else app.append(t.content)}
    if((S.tab||'accueil')==='accueil'&&!region()&&!ch&&!app.querySelector('.so')){const t=document.createElement('template');t.innerHTML=carte();const c=app.querySelectorAll(':scope>.card');(c[1]||c[0]||app.lastElementChild).after(t.content)}
    if(S.tab==='journal'&&S.jbTab==='maman'&&!app.querySelector('.so')){const t=document.createElement('template');t.innerHTML=carte();const ft=app.querySelector(':scope>.foot');if(ft)ft.before(t.content);else app.append(t.content)}}catch(e){}return x};
/* Paramètres : ma région */
if(typeof pParametres==='function'){const _pp=pParametres;pParametres=function(){const h=_pp.apply(this,arguments);if(S.role!=='parent')return h;return h+'<div class="card so-set"><span class="eyebrow acc">Ma région</span><label class="f">Province, territoire ou pays'+sel('data-so-reg="1"',region())+'</label><p class="xs muted">Sert aux vaccins, aux démarches et au soutien près de chez vous.</p></div>'}}
document.addEventListener('change',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.soReg&&t.value){choisir(t.value);if(!document.querySelector('.ft-choix'))render();toast('Région : '+NOMS[t.value])}});
document.addEventListener('click',e=>{if(e.target.closest('[data-so-chg]')){e.preventDefault();e.stopPropagation();sheet('Ma région','<label class="f">Province, territoire ou pays'+sel('id="so_r"',region())+'</label><button class="btn" data-so-ok="1">Enregistrer</button>');return}
  if(e.target.closest('[data-so-ok]')){e.stopPropagation();const v=$('#so_r').value;if(!v){toast('Choisissez votre région');return}choisir(v);close();render();return}
  const b=e.target.closest('[data-ft-parcours]');if(b&&!region()){e.stopPropagation();e.preventDefault();toast('Choisissez d\'abord où vous habitez');const s=document.querySelector('.so-ins select');if(s)s.focus();return}},true);
(function(){const st=document.createElement('style');st.textContent='.so-l{display:flex;flex-direction:column;gap:12px}.so-i{display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:start}.so-ic{font-size:1.4rem;line-height:1.2;text-align:center}.so-i b{font-size:.92rem}.so-i p{margin:2px 0 0;font-size:.84rem;color:var(--muted);line-height:1.4}.so-a{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.so-tel,.so-web{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;font:600 .8rem var(--f-body);text-decoration:none}.so-tel{background:var(--accent);color:#fff}.so-web{background:var(--card);color:var(--accent);border:1px solid var(--line,#e6d9d0)}.so-ins{margin-bottom:14px}';document.head.appendChild(st)})();
})();
