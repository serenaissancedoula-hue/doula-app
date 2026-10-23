/* Sérénaissance — envoi groupé à une famille (lettre personnelle, contrat, forfaits, formulaires, témoignage),
   forfaits choisis par la famille (et changés en cours de route, versements pris en compte), témoignages reçus. */
let PAIE=[];
const ENVOI_ITEMS=[
  ['merci','Lettre de remerciement personnelle','fa-envelope-open-text','Part toujours avec le contrat'],
  ['forfaits','Lettre : mes forfaits et mes prix','fa-tags','La famille choisit son forfait dans l\'appli'],
  ['contrat','Contrat de services','fa-file-contract','Signé par la famille, puis par vous'],
  ['accueil','Formulaire d\'accueil confidentiel','fa-clipboard-user','Rempli et signé par la famille'],
  ['consentement','Consentement aux renseignements personnels','fa-user-shield','Rempli et signé par la famille'],
  ['photos','Autorisation photos et témoignages','fa-camera','Facultative pour la famille'],
  ['satisfaction','Questionnaire de satisfaction et témoignage','fa-star','Les réponses arrivent dans votre espace'],
  ['fin','Lettre de fin d\'accompagnement','fa-feather','Un merci personnel']];
const ENVOI_MOMENTS=[
  ['approche','Après la rencontre d\'approche',['forfaits'],'Bonjour {p} ! Merci pour notre belle rencontre. Comme promis, voici mes forfaits et mes prix. Vous pouvez choisir celui qui vous convient directement dans l\'appli.'],
  ['bienvenue','Pochette de bienvenue',['merci','forfaits','contrat','accueil','consentement','photos'],'Bonjour {p} ! Votre pochette de bienvenue est arrivée : une petite lettre de ma part, votre contrat et quelques formulaires. Tout se lit, se remplit et se signe dans l\'appli.'],
  ['fin','Fin de l\'accompagnement',['fin','satisfaction'],'Bonjour {p} ! Une lettre de ma part vous attend dans l\'appli, avec un court questionnaire. Votre avis compte beaucoup pour moi.']];

/* ---------- variables et prix toujours à jour ---------- */
function forfaitsTexte(){return Object.entries(FORFAITS).map(([n,f])=>n+' · '+money(f.prix)+(f.desc?' : '+f.desc:'')+'.').join('\n')}
function prixVivants(t,nomForfait){const F=FORFAITS[nomForfait];return String(t||'').replace(/\{\{forfaits\}\}/g,forfaitsTexte()||'[mes forfaits]').replace(/\{\{forfait\}\}/g,nomForfait||'[forfait à choisir]').replace(/\{\{prix\}\}/g,F?money(F.prix):'[prix]')}
function remplirModele(t,c,o){const D=S.doula;o=o||{};const bebe=c.bebe||'votre bébé';
  const v={doula_entreprise:D.entreprise||D.nom,doula_nom:D.nom,doula_prenom:D.prenomD||String(D.nom||'').split(' ')[0],doula_adresse:D.adresse||'[adresse]',doula_tel:D.tel||'',doula_courriel:D.courriel,doula_region:D.region||'[ma région]',
    prenom:c.prenom||cFirst(c),parent_nom:c.nom,partenaire:c.partenaire||'',partenaire_et:c.partenaire?' et '+c.partenaire:'',parent_courriel:c.courriel,parent_tel:c.tel||'',bebe,
    dpa:c.dpa?fmtD(parseD(c.dpa)):'[date prévue]',dpa_mois:c.dpa?fmtD(parseD(c.dpa),{month:'long',year:'numeric'}):'',lieu:c.lieu||'[lieu]',professionnel:c.prof||'[professionnel]',date:fmtD(new Date()),assurance:D.assurance||'aucune pour le moment'};
  const sp=c.prixSpecial!==undefined&&c.prixSpecial!==null&&c.prixSpecial!=='';if(sp)v.prix=money(+c.prixSpecial);
  let r=String(t||'').replace(/\{\{(\w+)\}\}/g,(m,k)=>(['forfaits','forfait','prix'].includes(k)&&!(k==='prix'&&sp))?m:(v[k]!=null?v[k]:m));
  return o.prixVivants?r:prixVivants(r,c.forfait)}
const MODELES_DEFAUT=()=>{const m={lettre_forfaits:LETTRE_FORFAITS_DEFAUT,lettre_fin:LETTRE_FIN_DEFAUT};LETTRES_MERCI.forEach((l,i)=>m['merci'+(i+1)]=l.texte);Object.keys(DOC_TYPES).forEach(k=>m[k]=DOC_TYPES[k].texte);return m};
function modeleTexte(k){const m=(ME_DOULA&&ME_DOULA.modeles||{}).docs||{};return m[k]!=null?m[k]:MODELES_DEFAUT()[k]}
function forfaitDe(d){if(S.role==='parent')return FAM&&FAM.forfait;const c=S.clients.find(x=>x.id===d.famille_id);return c&&c.forfait}
function docResolu(d){if(!d||!/\{\{(forfaits|forfait|prix)\}\}/.test(d.contenu||''))return d;return Object.assign({},d,{contenu:prixVivants(d.contenu,forfaitDe(d))})}

/* ---------- affichage des documents ---------- */
/* Présentation « papier », comme les documents de la trousse */
function papier(d,doula){const I=infoDoula(),R=d.reponses||{},lect=doula||d.statut!=='a_remplir',C=d.champs||[];
  let h='<div class="doc papier" id="docImp"><div class="pap-bar"></div><div class="pap-tete"><img src="img/logo-icone.png" alt=""><span class="pap-marque">'+esc(I.ent||'Sérénaissance')+'</span><span class="pap-cat">'+(CATEGORIE[d.type]||'DOCUMENTS')+'</span></div><div class="pap-titre"><h2>'+esc(d.titre)+'</h2></div>';
  h+=String(d.contenu||'').split('\n').map(l=>l.startsWith('## ')?'<h3 class="pap-sec">'+esc(l.slice(3))+'</h3>':l.trim()?'<p>'+esc(l)+'</p>':'').join('');
  h+=C.map(c=>{if(c.g)return '<h3 class="pap-sec">'+esc(c.g)+'</h3>';const v=R[c.k];
    if(lect)return c.type==='case'?'<p class="pap-case"><span class="bx">'+(v?'✕':'')+'</span>'+esc(c.t)+'</p>':'<div class="pap-ligne'+(c.type==='area'?' bloc':'')+'"><span>'+esc(c.t)+'</span><b>'+(v?esc(v).replace(/\n/g,'<br>'):'&nbsp;')+'</b></div>';
    if(c.type==='case')return '<label class="pap-case check"><input type="checkbox" class="dch" data-k="'+c.k+'"><span>'+esc(c.t)+'</span></label>';
    if(c.type==='area')return '<label class="pap-ligne bloc"><span>'+esc(c.t)+'</span><textarea class="dch" data-k="'+c.k+'" rows="2"></textarea></label>';
    if(c.type==='choix')return '<label class="pap-ligne"><span>'+esc(c.t)+'</span><select class="dch" data-k="'+c.k+'"><option value="">Choisir…</option>'+c.o.map(o=>'<option>'+esc(o)+'</option>').join('')+'</select></label>';
    return '<label class="pap-ligne"><span>'+esc(c.t)+(c.req?' *':'')+'</span><input type="'+(c.type==='date'?'date':'text')+'" class="dch" data-k="'+c.k+'"></label>'}).join('');
  const rangs=[];if(d.sig_doula_requise||d.signature_doula)rangs.push([d.signature_doula,'Doula']);if(d.sig_parent_requise||d.signature_parent)rangs.push([d.signature_parent,'Parent']);
  if(rangs.length)h+='<h3 class="pap-sec">Signatures</h3><div class="pap-sigs">'+rangs.map(([s,q])=>'<div>'+(s?esc(s.nom):'')+'</div><div>'+(s&&s.image?'<img src="'+esc(s.image)+'" alt="Signature">':'')+'</div><div>'+(s?fmtD(new Date(s.le),{day:'numeric',month:'short',year:'numeric'}):'')+'</div><small>Nom en lettres moulées : '+q+'</small><small>Signature</small><small>Date</small>').join('')+'</div>';
  return h+'<div class="pap-pied">'+esc([I.ent,I.nom,I.tel,I.courriel].filter(Boolean).join(' · '))+'</div></div>'}
docVue=function(d,doula){if(d.type==='forfaits'&&!doula)return papier(Object.assign({},d,{contenu:String(d.contenu||'').replace(/## Mes forfaits\n?/,'').replace(/\{\{forfaits\}\}\n?/,'')}),doula)+blocForfaits();return papier(docResolu(d),doula)};
const _docLigne=docLigne;
docLigne=function(d,doula){if(!LETTRES_TYPES[d.type])return _docLigne(d,doula);
  return '<button class="cl" data-act="docOuvrir" data-id="'+d.id+'"><div class="av">'+icon(d.type==='forfaits'?'fa-tags':'fa-envelope-open-text')+'</div><div style="flex:1;min-width:0"><b>'+esc(d.titre)+'</b><p class="xs muted">'+(d.type==='forfaits'&&!doula&&!FAM.forfait?'Choisissez votre forfait · ':'')+'Reçue le '+fmtS(new Date(d.created_at))+'</p></div><span class="pill acc">'+(d.type==='forfaits'?'Forfaits':'Lettre')+'</span></button>'};
const _prepPDF=preparerPDF,_partPDF=partagerPDF;
const resoudre=d=>Array.isArray(d)?d.map(docResolu):d&&docResolu(d);
preparerPDF=d=>_prepPDF(resoudre(d));partagerPDF=d=>_partPDF(resoudre(d));

/* ---------- pochettes : les documents d'un même envoi restent ensemble, la lettre en premier ---------- */
function docsDuLot(lot,L){return (L||DOCS).filter(d=>d.lot===lot&&d.statut!=='annule').sort((a,b)=>(a.ordre||0)-(b.ordre||0))}
function lignePochette(lot){const L=docsDuLot(lot),ar=L.filter(d=>d.statut==='a_remplir').length;
  return '<button class="cl pochette" data-act="pochette" data-v="'+esc(lot)+'"><div class="av">'+icon('fa-envelope-open-text')+'</div><div style="flex:1;min-width:0"><b>'+esc(L[0].lot_titre||'Documents de votre doula')+'</b><p class="xs muted">'+L.length+' document'+(L.length>1?'s':'')+' · reçue le '+fmtS(new Date(L[0].created_at))+'</p></div><span class="pill '+(ar?'gold':'sage')+'">'+(ar?ar+' à remplir':'Complétée')+'</span></button>'}
function listeDocsParent(){const vus=new Set();let h='';DOCS.filter(d=>d.statut!=='annule').forEach(d=>{if(d.lot){if(vus.has(d.lot))return;vus.add(d.lot);h+=lignePochette(d.lot)}else h+=docLigne(d,false)});
  return h||'<div class="card dash small muted">Votre doula déposera ici votre pochette de bienvenue, votre contrat et vos formulaires. Ils restent toujours disponibles ici.</div>'}
function ouvrirPochette(lot){const L=docsDuLot(lot);if(!L.length)return;const lettre=L.find(d=>d.type==='merci'||d.type==='fin');
  let b=lettre?docVue(lettre,false).replace('id="docImp"',''):'';const autres=L.filter(d=>d!==lettre),ar=autres.filter(d=>d.statut==='a_remplir').length;
  b+='<span class="eyebrow acc">'+(ar?'À lire, remplir et signer ('+ar+')':'Vos documents')+'</span>'+autres.map(d=>docLigne(d,false)).join('');
  b+='<button class="btn ghost" data-act="pdfLot" data-v="'+esc(lot)+'">'+icon('fa-file-pdf')+'Enregistrer toute la pochette en PDF</button>';
  S.lotOuvert=lot;sheet(esc(L[0].lot_titre||'Pochette'),b);preparerPDF(L)}

/* ---------- forfaits côté famille ---------- */
const payeTotal=()=>(PAIE||[]).reduce((s,p)=>s+(+p.montant||0),0);
function blocForfaits(){const L=Object.entries(FORFAITS),cur=FAM.forfait,F=FORFAITS[cur],paye=payeTotal();
  let h='<div class="card"><span class="eyebrow acc">Les forfaits de '+esc(doulaNomP())+'</span>';
  if(cur)h+='<div class="grid3"><div class="stat"><b>'+(F?money(F.prix):'—')+'</b><span>'+esc(cur)+'</span></div><div class="stat ok"><b>'+money(paye)+'</b><span>déjà payé</span></div><div class="stat '+(F&&F.prix-paye>0?'warn':'')+'"><b>'+(F?money(Math.max(0,F.prix-paye)):'—')+'</b><span>solde</span></div></div>';
  else h+='<p class="small">Choisissez le forfait qui vous convient. Votre doula est avisée tout de suite.</p>';
  h+=L.length?L.map(([n,f])=>{const moi=n===cur,diff=f.prix-paye;return '<div class="soft"><div class="row between"><b>'+esc(n)+'</b><span class="pill acc">'+money(f.prix)+'</span></div>'+(f.desc?'<p class="small">'+esc(f.desc)+'</p>':'')+
    (moi?'<span class="pill sage">Mon forfait</span>':(paye>0?'<p class="xs muted">Avec ce forfait : '+(diff>=0?'solde de <b>'+money(diff)+'</b>':'crédit de <b>'+money(-diff)+'</b> en votre faveur')+' (vos '+money(paye)+' déjà payés sont gardés).</p>':'')+'<button class="btn sm" data-act="choisirForfait" data-v="'+esc(n)+'">'+icon('fa-check')+(cur?'Changer pour ce forfait':'Choisir ce forfait')+'</button>')+'</div>'}).join(''):'<p class="small muted">Votre doula n\'a pas encore inscrit ses forfaits.</p>';
  if(PAIE.length)h+='<details><summary class="xs muted" style="cursor:pointer">Mes versements ('+PAIE.length+')</summary><div class="list">'+PAIE.map(p=>'<div class="li"><div class="tx"><b>'+money(p.montant)+'</b><span>'+fmtD(parseD(p.date))+(p.mode?' · '+esc(p.mode):'')+(p.no?' · reçu no '+esc(p.no):'')+'</span></div></div>').join('')+'</div></details>';
  return h+'<p class="xs muted">Vous pouvez changer de forfait en cours de route : les versements déjà faits sont toujours comptés. Pour un remboursement, l\'article 9 du contrat s\'applique.</p></div>'}
const _ce=chargerEchanges;
chargerEchanges=async function(){await _ce();if(!FAM)return;try{const {data}=await sb.rpc('fam_paiements',{p_famille:FAM.id});PAIE=Array.isArray(data)?data:[]}catch(e){PAIE=[]}};
const _pm=pMaDoula;
pMaDoula=function(){const seg=S.seg||'messages';if(seg==='docs'){S.seg='__docs';let h=_pm();S.seg='docs';return h.replace('class="chip " data-act="seg" data-v="docs"','class="chip on" data-act="seg" data-v="docs"')+listeDocsParent()}let h=_pm();if(seg==='forfaits'){const i=h.indexOf('<div class="card"><span class="eyebrow acc">Les forfaits de ');if(i>=0)h=h.slice(0,i)+blocForfaits()}return h};

/* ---------- envoi groupé (doula) ---------- */
function lettreGeneree(c){const r=a=>a[Math.floor(Math.random()*a.length)];let det='';
  if(c.dpa)det=' D\'ici '+fmtD(parseD(c.dpa),{month:'long'})+', nous aurons le temps de bien nous préparer.';
  if(c.enfants)det+=' Je penserai aussi aux grands frères et grandes sœurs, qui vivent eux aussi un grand changement.';
  return 'Bonjour {{prenom}}{{partenaire_et}},\n\n'+r(MERCI_OUV)+det+'\n\n'+r(MERCI_MIL)+'\n\n'+r(MERCI_FIN)+'\n\n'+r(MERCI_SIGN)+'\n{{doula_prenom}}'}
function lireEnv(){const E=S.env;if(!E)return;const a=$('#envMerciTxt'),m=$('#envMsg');if(a)E.merciTxt=a.value;if(m)E.msg=m.value}
function envoiOuvrir(fid,moment){const c=S.clients.find(x=>x.id===fid);S.env={fid,sel:{},merciK:0,merciTxt:remplirModele(modeleTexte('merci1'),c),msg:''};envoiMoment(moment||'bienvenue');}
function envoiMoment(k){const E=S.env,c=S.clients.find(x=>x.id===E.fid),M=ENVOI_MOMENTS.find(x=>x[0]===k);E.moment=k;E.sel={};if(M){M[2].forEach(x=>E.sel[x]=true);E.msg=M[3].replace('{p}',c.prenom||cFirst(c))}envoiSheet()}
function envoiSheet(){const E=S.env,c=S.clients.find(x=>x.id===E.fid),deja=CDOCS[c.id]||[];if(E.sel.contrat)E.sel.merci=true;
  let h='<p class="small">Tout est rempli automatiquement avec les informations de '+esc(c.prenom||cName(c))+'. La famille reçoit <b>une seule notification</b> et retrouve tout dans son appli (Ma doula › Documents).</p>';
  h+='<span class="eyebrow acc">Moment</span><div class="seg">'+ENVOI_MOMENTS.map(m=>'<button class="chip '+(E.moment===m[0]?'on':'')+'" data-act="envMoment" data-v="'+m[0]+'">'+m[1]+'</button>').join('')+'<button class="chip '+(E.moment==='libre'?'on':'')+'" data-act="envMoment" data-v="libre">Mon choix</button></div>';
  h+='<span class="eyebrow acc">Quoi envoyer</span><div class="stack" style="gap:6px">'+ENVOI_ITEMS.map(([k,t,ic,sous])=>{const d=deja.filter(x=>x.type===k&&x.statut!=='annule')[0];const force=k==='merci'&&E.sel.contrat;
    return '<label class="check" style="align-items:flex-start"><input type="checkbox" data-act="envChk" data-k="'+k+'" '+(E.sel[k]?'checked':'')+(force?' disabled':'')+'><span>'+icon(ic,'var(--accent)')+' <b>'+t+'</b><br><span class="xs muted">'+(force?'Toujours envoyée avec le contrat':sous)+(d?' · déjà envoyé le '+fmtS(new Date(d.created_at)):'')+'</span></span></label>'}).join('')+'</div>';
  if(E.sel.merci){h+='<div class="soft"><span class="eyebrow acc">Ma lettre de remerciement</span><div class="seg">'+LETTRES_MERCI.map((l,i)=>'<button class="chip '+(E.merciK===i?'on':'')+'" data-act="envMerci" data-v="'+i+'">'+(i+1)+' · '+esc(l.nom)+'</button>').join('')+'<button class="chip '+(E.merciK==='gen'?'on':'')+'" data-act="envGen">'+icon('fa-wand-magic-sparkles')+'Générer une nouvelle version</button></div><label class="f">Votre lettre, personnelle à '+esc(c.prenom||'cette famille')+' (modifiez-la librement)<textarea id="envMerciTxt" style="min-height:240px;font-size:.88rem">'+esc(E.merciTxt)+'</textarea></label></div>'}
  if(E.sel.forfaits||E.sel.contrat){const L=Object.keys(FORFAITS);h+='<div class="soft"><span class="eyebrow acc">Mes forfaits (tirés de mes Paramètres)</span>'+(L.length?listeForfaits():'<div class="banner gold">'+icon('fa-triangle-exclamation')+'<div class="small">Ajoutez d\'abord vos forfaits et vos prix dans Paramètres.</div></div>')+'<p class="xs muted">Si vous changez vos prix dans Paramètres, ils changent partout : lettre de forfaits et contrats pas encore signés. Un contrat signé garde le prix du jour de la signature.</p></div>'}
  h+='<label class="f">Message qui accompagne l\'envoi<textarea id="envMsg" style="min-height:90px">'+esc(E.msg||'')+'</textarea></label>';
  h+='<button class="btn" data-act="envEnvoyer">'+icon('fa-paper-plane')+'Déposer dans l\'Espace Famille</button>'+(c.parent_user?'':'<p class="xs muted">'+esc(c.prenom||'La famille')+' n\'a pas encore finalisé son inscription : elle trouvera tout à sa première connexion.</p>');
  sheet('Envoyer à '+esc(c.prenom||cName(c)),h)}
async function envoiEnvoyer(b){lireEnv();const E=S.env,c=S.clients.find(x=>x.id===E.fid);if(E.sel.contrat)E.sel.merci=true;
  const k0=ENVOI_ITEMS.map(x=>x[0]).filter(k=>E.sel[k]);if(!k0.length){toast('Cochez au moins un document');return}
  if((E.sel.forfaits||E.sel.contrat)&&!Object.keys(FORFAITS).length){toast('Ajoutez d\'abord vos forfaits dans Paramètres');return}
  if(E.sel.merci&&!String(E.merciTxt||'').trim()){toast('Écrivez votre lettre de remerciement');return}
  b.disabled=true;b.textContent='Envoi…';const titres=[];const lot=(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random()),M=ENVOI_MOMENTS.find(x=>x[0]===E.moment);
  const lotTitre=E.moment==='bienvenue'?'Votre pochette de bienvenue':M?M[1]:'Documents de votre doula',ORD=['merci','fin','forfaits','contrat','accueil','consentement','photos','satisfaction'];
  const ordre=['satisfaction','photos','consentement','accueil','contrat','fin','forfaits','merci'];
  try{for(const k of ordre){if(!E.sel[k])continue;let row;
      if(LETTRES_TYPES[k])row={type:k,titre:LETTRES_TYPES[k],contenu:k==='merci'?E.merciTxt:remplirModele(modeleTexte(k==='forfaits'?'lettre_forfaits':'lettre_fin'),c,{prixVivants:true}),champs:[],sig_parent_requise:false,sig_doula_requise:false,statut:'signe'};
      else{const T=DOC_TYPES[k];row={type:k,titre:T.titre,contenu:remplirModele(modeleTexte(k),c,{prixVivants:true}),champs:T.champs,sig_parent_requise:T.sigP,sig_doula_requise:T.sigD,statut:'a_remplir'}}
      row.famille_id=c.id;row.silencieux=true;row.lot=lot;row.lot_titre=lotTitre==='Après la rencontre d\'approche'?'Mes forfaits et mes prix':lotTitre;row.ordre=ORD.indexOf(k);const {error}=await sb.from('fam_documents').insert(row);if(error)throw error;titres.unshift(row.titre)}
    const msg=(String(E.msg||'').trim()||'Du nouveau dans votre appli !')+'\n\n📎 Dans votre appli (Ma doula › Documents) :\n• '+titres.join('\n• ');
    await sb.from('fam_messages').insert({famille_id:c.id,de_doula:true,type:'document',texte:msg});
    close();S.env=null;await chargerClientDetail(c.id);await chargerDoula();S.ctab='docs';render();toast('Envoyé : la famille est avisée')}
  catch(e){b.disabled=false;b.textContent='Réessayer';toast('Pas envoyé : '+(e.message||'erreur'))}}

/* ---------- mes modèles (contrat, formulaires et lettres) ---------- */
const MOD_LISTE=[['contrat','Contrat'],['accueil','Formulaire d\'accueil'],['consentement','Consentement'],['photos','Photos'],['satisfaction','Satisfaction'],['merci1','Lettre merci 1'],['merci2','Lettre merci 2'],['merci3','Lettre merci 3'],['merci4','Lettre merci 4'],['merci5','Lettre merci 5'],['lettre_forfaits','Lettre forfaits'],['lettre_fin','Lettre de fin']];
const VARS=[['prenom','prénom de la maman'],['partenaire_et','« et » + partenaire'],['parent_nom','nom complet'],['bebe','prénom du bébé'],['dpa','date prévue'],['lieu','lieu de naissance'],['professionnel','professionnel de suivi'],['forfait','forfait choisi'],['prix','prix du forfait'],['forfaits','liste de mes forfaits et prix'],['doula_prenom','mon prénom'],['doula_nom','mon nom'],['doula_entreprise','ma compagnie'],['doula_tel','mon téléphone'],['doula_courriel','mon courriel'],['doula_adresse','mon adresse'],['doula_region','ma région'],['assurance','mon assurance'],['date','date du jour']];
DSUB.modeles=function(){const k=S.modK||'contrat';const nomK=(MOD_LISTE.find(x=>x[0]===k)||[k,k])[1];
  let h=sh('Mes modèles de documents','Écrivez-les une fois : ils se remplissent tout seuls pour chaque famille quand vous les envoyez.');
  h+='<div class="seg">'+MOD_LISTE.map(([kk,t])=>'<button class="chip '+(k===kk?'on':'')+'" data-act="modK" data-v="'+kk+'">'+t+'</button>').join('')+'</div>';
  const ex=S.clients[0]||{prenom:'Julie',nom:'Julie Tremblay',partenaire:'Marc',courriel:'julie@exemple.ca',dpa:iso(addD(new Date(),90)),forfait:Object.keys(FORFAITS)[0]};
  h+='<div class="card"><div class="seg"><button class="chip '+(S.modApercu?'':'on')+'" data-act="modApercu" data-v="0">'+icon('fa-pen')+'Modifier</button><button class="chip '+(S.modApercu?'on':'')+'" data-act="modApercu" data-v="1">'+icon('fa-eye')+'Aperçu avec '+esc(ex.prenom||cFirst(ex))+'</button></div>';
  const txt=(S.modBrouillon&&S.modBrouillon.k===k)?S.modBrouillon.t:modeleTexte(k);
  if(S.modApercu)h+='<div class="doc">'+rendreTexte(remplirModele(txt,ex))+'</div><p class="xs muted">Voilà ce que la famille verra : les champs automatiques sont remplacés par ses informations.</p>';
  else h+='<p class="xs muted">Les mots entre doubles accolades, comme <b>{{prenom}}</b>, sont normaux ici : ce sont des <b>champs automatiques</b>, remplacés par les informations de chaque famille à l\'envoi. Touchez-en un pour l\'ajouter. Un titre de section commence par « ## ».</p><div class="row" style="gap:6px;flex-wrap:wrap">'+VARS.map(v=>'<button class="chip" data-act="modVar" data-v="'+v[0]+'" title="'+v[1]+'" style="font-size:.72rem">'+v[1]+'</button>').join('')+'</div><textarea id="modTxt" style="min-height:380px;font-size:.85rem">'+esc(txt)+'</textarea>';
  if(!S.modApercu)h+='<div class="row"><button class="btn" data-act="modSave" data-v="'+k+'">Enregistrer « '+esc(nomK)+' »</button><button class="btn ghost sm" data-act="modReset" data-v="'+k+'">Revenir au modèle de départ</button></div>';h+=(DOC_TYPES[k]&&DOC_TYPES[k].champs.length?'<p class="xs muted">Champs remplis par la famille : '+DOC_TYPES[k].champs.filter(c=>!c.g).map(c=>c.t).join(' · ')+'</p>':'')+'</div>';return h};

/* ---------- témoignages reçus (doula) ---------- */
DSUB.temoignages=function(){setTimeout(async()=>{const ids=S.clients.map(c=>c.id);const el=$('#lstTem');if(!el)return;if(!ids.length){el.innerHTML='<p class="small muted">Aucune famille pour l\'instant.</p>';return}
  const {data}=await sb.from('fam_documents').select('*').eq('type','satisfaction').in('famille_id',ids).order('created_at',{ascending:false});const L=(data||[]).filter(d=>d.statut==='signe');
  if(!L.length){el.innerHTML='<p class="small muted">Aucune réponse pour l\'instant. Envoyez le questionnaire à la fin d\'un accompagnement (fiche de la famille › Envoyer à la famille › Fin de l\'accompagnement).</p>';return}
  const notes=L.flatMap(d=>['n1','n2','n3','n4','n5'].map(k=>parseInt((d.reponses||{})[k]))).filter(n=>n>0);const moy=notes.length?(notes.reduce((a,b)=>a+b,0)/notes.length):0;
  el.innerHTML='<div class="grid3"><div class="stat acc"><b>'+L.length+'</b><span>réponse'+(L.length>1?'s':'')+'</span></div><div class="stat ok"><b>'+(moy?moy.toFixed(1).replace('.',','):'—')+' / 5</b><span>moyenne</span></div></div>'+L.map(d=>{const R=d.reponses||{},c=S.clients.find(x=>x.id===d.famille_id);const pub=R.pubPrenom?'Publication avec le prénom':R.pubAnonyme?'Publication anonyme':'Ne pas publier';
    return '<div class="soft"><div class="row between"><b>'+esc(c?cName(c):'Famille')+'</b><span class="xs muted">'+fmtS(new Date(d.updated_at||d.created_at))+'</span></div><p class="small">'+['n1','n2','n3','n4','n5'].map(k=>parseInt(R[k])||'—').join(' · ')+' <span class="xs muted">(écoute · information · accouchement · après · recommande)</span></p>'+(R.temoignage?'<p class="mot-t" style="font-size:1rem">« '+esc(R.temoignage)+' »</p><p class="xs">— '+esc(R.signature||'')+'</p>':'')+(R.aide?'<p class="small"><b>Ce qui a aidé :</b> '+esc(R.aide)+'</p>':'')+(R.ameliorer?'<p class="small"><b>À améliorer :</b> '+esc(R.ameliorer)+'</p>':'')+'<div class="row"><span class="pill '+(R.pubPrenom||R.pubAnonyme?'sage':'line')+'">'+pub+'</span>'+(R.temoignage&&(R.pubPrenom||R.pubAnonyme)?'<button class="btn sm ghost" data-act="copyTxt" data-t="'+esc('« '+R.temoignage+' » — '+(R.signature||''))+'">'+icon('fa-copy')+'Copier</button>':'')+'</div></div>'}).join('')},0);
  return sh('Témoignages reçus','Les réponses au questionnaire de satisfaction arrivent ici, directement de l\'Espace Famille')+'<div class="card" id="lstTem"><p class="small muted">Chargement…</p></div>'};
if(!DOUT.find(x=>x[0]==='temoignages'))DOUT.splice(1,0,['temoignages','fa-star','Témoignages reçus','Satisfaction et avis des familles']);

/* ---------- événements ---------- */
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b||['INPUT','SELECT','TEXTAREA'].includes(b.tagName))return;const a=b.dataset.act,v=b.dataset.v;
  try{switch(a){
  case 'envoi':envoiOuvrir(b.dataset.id||S.openClient,v);return;
  case 'envMoment':lireEnv();if(v==='libre'){S.env.moment='libre';envoiSheet()}else envoiMoment(v);return;
  case 'envMerci':{lireEnv();const c=S.clients.find(x=>x.id===S.env.fid);S.env.merciK=+v;S.env.merciTxt=remplirModele(modeleTexte('merci'+(+v+1)),c);envoiSheet();return}
  case 'envGen':{lireEnv();const c=S.clients.find(x=>x.id===S.env.fid);S.env.merciK='gen';S.env.merciTxt=remplirModele(lettreGeneree(c),c);envoiSheet();return}
  case 'envEnvoyer':await envoiEnvoyer(b);return;
  case 'pochette':ouvrirPochette(v);return;
  case 'pdfLot':partagerPDF(docsDuLot(v));return;
  case 'modApercu':{const t=$('#modTxt');if(t)S.modBrouillon={k:S.modK||'contrat',t:t.value};S.modApercu=v==='1';render();return}
  case 'modVar':{const t=$('#modTxt');if(!t)return;const s=t.selectionStart??t.value.length;t.value=t.value.slice(0,s)+'{{'+v+'}}'+t.value.slice(t.selectionEnd??s);t.focus();t.selectionStart=t.selectionEnd=s+v.length+4;return}
  case 'choisirForfait':{if(b.dataset.c!=='1'){document.querySelectorAll('[data-act=choisirForfait][data-c="1"]').forEach(x=>{x.dataset.c='';x.innerHTML=icon('fa-check')+(FAM.forfait?'Changer pour ce forfait':'Choisir ce forfait')});b.dataset.c='1';b.innerHTML=icon('fa-check')+'Confirmer : '+esc(v);return}
    b.disabled=true;const {error}=await sb.rpc('fam_choisir_forfait',{p_famille:FAM.id,p_forfait:v});if(error){toast(error.message);b.disabled=false;return}
    const signe=DOCS.some(d=>d.type==='contrat'&&d.statut!=='a_remplir'&&d.statut!=='annule');FAM.forfait=v;await chargerEchanges();close();render();toast(signe?'Forfait changé : votre doula est avisée et vous enverra un contrat à jour':'Forfait choisi : votre doula est avisée');return}
  }}catch(err){console.error(err);toast('Une erreur est survenue. Réessayez.')}},false);
document.addEventListener('change',e=>{const t=e.target;if(t.dataset.act!=='envChk'||!S.env)return;lireEnv();S.env.sel[t.dataset.k]=t.checked;S.env.moment='libre';envoiSheet()});
/* La doula corrige elle-même la date de naissance : on la laisse enregistrer. */
document.addEventListener('change',e=>{const t=e.target;if(t.dataset.act==='txt'&&/\.(naiss|bebe)$/.test(t.dataset.p||'')&&S.openClient){const c=S.clients.find(x=>x.id===S.openClient);if(c)c._naissModif=true}});
document.addEventListener('input',e=>{const t=e.target;if(t.dataset.act==='txt'&&/\.(naiss|bebe)$/.test(t.dataset.p||'')&&S.openClient){const c=S.clients.find(x=>x.id===S.openClient);if(c)c._naissModif=true}});

/* ---------- invitation avec lettre de félicitations personnalisée ---------- */
function lettreInvDefaut(){const k=(ME_DOULA&&ME_DOULA.modeles||{}).lettreInvitation;return Number.isInteger(k)?k:0}
function inviteSheet(fid){const c=S.clients.find(x=>x.id===fid);if(!c)return;const k=lettreInvDefaut();S.inv={fid,k,txt:remplirModele(modeleTexte('merci'+(k+1)),c),depot:true};inviteRendu()}
function inviteRendu(){const I=S.inv,c=S.clients.find(x=>x.id===I.fid);
  sheet('Inviter '+esc(c.prenom||cName(c)),'<p class="small">'+esc(c.prenom||'La maman')+' reçoit un courriel à <b>'+esc(c.courriel)+'</b> avec votre lettre de félicitations et un bouton pour finaliser son inscription dans l\'appli Famille.</p><div class="seg">'+LETTRES_MERCI.map((l,i)=>'<button class="chip '+(I.k===i?'on':'')+'" data-act="invLettre" data-v="'+i+'">'+(i+1)+' · '+esc(l.nom)+'</button>').join('')+'<button class="chip '+(I.k==='gen'?'on':'')+'" data-act="invGen">'+icon('fa-wand-magic-sparkles')+'Générer</button></div><label class="f">Lettre de félicitations (personnelle, modifiable)<textarea id="invTxt" style="min-height:240px;font-size:.88rem">'+esc(I.txt)+'</textarea></label><label class="check"><input type="checkbox" id="invDepot" '+(I.depot?'checked':'')+'><span>La déposer aussi dans son appli (Ma doula › Documents)</span></label><button class="btn" data-act="invEnvoyer">'+icon('fa-paper-plane')+(c.invite_envoyee?'Renvoyer l\'invitation':'Envoyer l\'invitation')+'</button><p class="xs muted">Votre lettre par défaut se choisit dans Paramètres. Les textes se modifient dans Outils › Mes modèles.</p>')}
async function inviteEnvoyer(b){const I=S.inv,c=S.clients.find(x=>x.id===I.fid);I.txt=$('#invTxt').value;I.depot=$('#invDepot').checked;if(!I.txt.trim()){toast('Écrivez votre lettre');return}b.disabled=true;
  if(I.depot&&!(CDOCS[c.id]||[]).some(d=>d.type==='merci'&&d.titre==='Félicitations et bienvenue'))await sb.from('fam_documents').insert({famille_id:c.id,type:'merci',titre:'Félicitations et bienvenue',contenu:I.txt,champs:[],sig_parent_requise:false,sig_doula_requise:false,statut:'signe',silencieux:true,ordre:0});
  close();const ok=await inviter(c.id,I.txt);if(ok){S.inv=null;await chargerClientDetail(c.id);render()}}
const _pParam=pParametres;
pParametres=function(){let h=_pParam();if(S.role!=='doula')return h;const k=lettreInvDefaut();
  const carte='<div class="card"><span class="eyebrow acc">Ma lettre de félicitations (avec l\'invitation)</span><p class="xs muted">Chaque nouvelle maman la reçoit dans son courriel d\'invitation, remplie avec son prénom. Vous pouvez la modifier à chaque envoi.</p><div class="seg">'+LETTRES_MERCI.map((l,i)=>'<button class="chip '+(k===i?'on':'')+'" data-act="invDefaut" data-v="'+i+'">'+(i+1)+' · '+esc(l.nom)+'</button>').join('')+'</div><button class="btn sm ghost" data-act="dgo" data-v="outils|modeles">'+icon('fa-pen')+'Modifier les textes</button></div>';
  const i=h.indexOf('<div class="card"><span class="eyebrow acc">Mon courriel</span>');return i<0?h+carte:h.slice(0,i)+carte+h.slice(i)};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b||['INPUT','SELECT','TEXTAREA'].includes(b.tagName))return;const a=b.dataset.act,v=b.dataset.v;
  try{switch(a){
  case 'invLettre':{const c=S.clients.find(x=>x.id===S.inv.fid);S.inv.depot=$('#invDepot').checked;S.inv.k=+v;S.inv.txt=remplirModele(modeleTexte('merci'+(+v+1)),c);inviteRendu();return}
  case 'invGen':{const c=S.clients.find(x=>x.id===S.inv.fid);S.inv.depot=$('#invDepot').checked;S.inv.k='gen';S.inv.txt=remplirModele(lettreGeneree(c),c);inviteRendu();return}
  case 'invEnvoyer':await inviteEnvoyer(b);return;
  case 'invDefaut':{const m=Object.assign({},ME_DOULA.modeles||{},{lettreInvitation:+v});const {error}=await sb.from('fam_doulas').update({modeles:m}).eq('id',ME_DOULA.id);if(error){toast(error.message);return}ME_DOULA.modeles=m;render();toast('Lettre par défaut enregistrée');return}
  }}catch(err){console.error(err);toast('Une erreur est survenue. Réessayez.')}});

/* ---------- Agenda : nouveau rendez-vous, avec une famille existante ou une nouvelle maman ---------- */
const TYPES_RDV=['Rencontre d\'approche','Prénatale 1 · Faire connaissance','Prénatale 2 · La naissance','Prénatale 3 · Préparer le jour J','Prénatale 4 · Allaitement et retour à la maison','Postnatale 1 · 3 à 7 jours','Postnatale 2 · 2 à 3 semaines','Postnatale 3 · 6 semaines','Séance de retour sur la naissance','Appel téléphonique','Visio','Rencontre'];
function agendaRdvSheet(){const L=S.clients.filter(c=>c.statut!=='archivee'&&c.statut!=='non_retenue').sort((a,b)=>cName(a).localeCompare(cName(b)));
  sheet('Nouveau rendez-vous','<label class="f">Famille<select id="agFam" data-act="agFam"><option value="">Choisir une famille…</option>'+L.map(c=>'<option value="'+c.id+'">'+esc(cName(c))+'</option>').join('')+'<option value="nouvelle">+ Nouvelle maman</option></select></label><div id="agNouv" hidden class="soft"><span class="eyebrow acc">Nouvelle maman</span><div class="grid2 resp"><label class="f">Prénom<input type="text" id="agPrenom"></label><label class="f">Nom<input type="text" id="agNom"></label><label class="f">Courriel<input type="email" id="agCourriel"></label><label class="f">Téléphone<input type="tel" id="agTel"></label><label class="f">Date prévue (si connue)<input type="date" id="agDpa"></label><label class="f">Partenaire<input type="text" id="agPart"></label></div><label class="check"><input type="checkbox" id="agInv" checked><span>Lui envoyer le lien d\'inscription par courriel (avec ma lettre de félicitations)</span></label></div><div class="grid2"><label class="f">Date<input type="date" id="rvDate" value="'+iso(addD(new Date(),3))+'"></label><label class="f">Heure<input type="time" id="rvHeure" value="10:00"></label></div><label class="f">Type<select id="rvType">'+TYPES_RDV.map(x=>'<option>'+x+'</option>').join('')+'</select></label><div class="grid2"><label class="f">Durée (minutes)<input type="number" id="rvDuree" value="90"></label><label class="f">Lieu ou lien<input type="text" id="rvLieu" placeholder="Domicile, bureau, lien visio…"></label></div><label class="f">Note<input type="text" id="rvNote"></label><button class="btn" data-act="agCreer">'+icon('fa-calendar-plus')+'Enregistrer le rendez-vous</button><p class="xs muted">La famille reçoit une notification et un courriel, puis un rappel 24 h avant.</p>')}
async function agendaCreer(b){let fid=$('#agFam').value;if(!fid){toast('Choisissez une famille ou « Nouvelle maman »');return}const t=lireRdv();if(!t)return;let inv=false;b.disabled=true;
  try{if(fid==='nouvelle'){const pr=$('#agPrenom').value.trim(),em=$('#agCourriel').value.trim().toLowerCase();if(!pr){toast('Entrez le prénom');b.disabled=false;return}if(!/^\S+@\S+\.\S+$/.test(em)){toast('Entrez un courriel valide');b.disabled=false;return}
      const {data:f,error}=await sb.from('fam_familles').insert({doula_id:ME_DOULA.id,courriel:em,prenom:pr,nom:$('#agNom').value.trim()||null,telephone:$('#agTel').value||null,partenaire:$('#agPart').value||null,dpa:$('#agDpa').value||null}).select('*').single();if(error)throw error;
      const dos={no:new Date().getFullYear()+'-'+pad(S.clients.length+1),parcours:{contact:iso(new Date())},docs:{},rdv:[],comms:[],paie:[]};await sb.from('fam_dossiers').insert({famille_id:f.id,data:dos});S.clients.unshift(buildClient(f,dos));fid=f.id;inv=$('#agInv').checked}
    const {error}=await sb.from('fam_rdv').insert({famille_id:fid,debut:t.toISOString(),type:$('#rvType').value,duree_min:+$('#rvDuree').value||90,lieu:$('#rvLieu').value||null,note:$('#rvNote').value||null,statut:'confirme',demande_par:'doula'});if(error)throw error;
    close();await chargerDoula();render();toast('Rendez-vous inscrit');if(inv)inviteSheet(fid)}
  catch(e){b.disabled=false;toast('Pas enregistré : '+(e.message||'erreur'))}}
const _dAg2=dAgenda;dAgenda=function(){return '<button class="btn" data-act="agNouveau">'+icon('fa-calendar-plus')+'Nouveau rendez-vous</button>'+_dAg2()};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b||['INPUT','SELECT','TEXTAREA'].includes(b.tagName))return;
  if(b.dataset.act==='agNouveau')agendaRdvSheet();else if(b.dataset.act==='agCreer')await agendaCreer(b)});
document.addEventListener('change',e=>{if(e.target.id==='agFam'){const n=$('#agNouv');if(n)n.hidden=e.target.value!=='nouvelle'}});
