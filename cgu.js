/* Sérénaissance — conditions d'utilisation et confidentialité à accepter (et signer par son nom) avant d'utiliser l'appli.
   Doulas : acceptation demandée avant de s'inscrire ; familles et doulas invitées : à la création du compte seulement.
   L'acceptation est gardée dans le compte (métadonnées) avec la version, la date et le nom tapé. */
(function(){
const V='2026-10-26',EN=window.LANG==='en',LS='sere-cgu-ok';
const T={
 fr:{titre:'Conditions d\'utilisation et confidentialité',intro:'Avant de continuer, veuillez lire et accepter ce qui suit.',maj:'<b>Nos conditions d\'utilisation ont changé.</b> Veuillez les relire et les accepter de nouveau pour continuer à utiliser l\'appli.',
  corps:[
  ['Ce qu\'est l\'appli','L\'appli Sérénaissance réunit un Espace Doula (dossiers, documents, rendez-vous, messages, paiements) et un Espace Famille (cycle et essais bébé, grossesse, bébé), avec ou sans doula. Les informations de santé qu\'elle contient sont générales, vérifiées auprès de sources officielles, et ne remplacent jamais un médecin, une sage-femme ou les services d\'urgence. Elle ne pose aucun diagnostic. En cas d\'urgence, composez le 911.'],
  ['Vos renseignements','Vous nous confiez des renseignements personnels, dont des renseignements de santé (dates de grossesse, cycle, tests, rendez-vous, particularités de grossesse, messages, documents signés, photos). Ils servent seulement à faire fonctionner l\'appli et à vous donner des conseils adaptés. Ils sont conservés de façon sécurisée, ne sont jamais vendus et ne sont partagés qu\'avec la doula ou la famille concernée, selon ce que vous choisissez, et avec les services techniques nécessaires (hébergement, courriels, paiements). Les photos de vos tests restent dans votre espace.'],
  ['Confidentialité','Chaque utilisatrice s\'engage à garder confidentiels les renseignements des autres, sauf si une vie est en danger ou si la sécurité d\'un enfant est menacée. Ne partagez pas vos accès et déconnectez-vous d\'un appareil qui n\'est pas le vôtre.'],
  ['Les doulas','La doula est responsable des dossiers de ses familles et de l\'exactitude de ce qu\'elle y inscrit, de ses contrats, de ses tarifs (y compris ses frais de déplacement) et de ses services. Elle obtient le consentement de chaque famille avant d\'y inscrire ses renseignements. L\'Académie Sérénaissance offre l\'outil, mais n\'est pas partie à la relation entre la doula et sa famille. La doula est seule responsable des logos, images et documents qu\'elle téléverse : elle déclare avoir le droit de les utiliser et de les faire signer. Les modèles de documents fournis ne sont que des exemples et ne constituent pas un avis juridique.'],
  ['Annuaire « Trouver ma doula »','Le profil public est optionnel. Il coûte 25 $ par année et il est approuvé par Sérénaissance avant d\'être publié. La doula déclare que ses formations et ses services sont exacts. Une demande de rendez-vous envoyée par une famille transmet à la doula les renseignements que la famille a choisi d\'y écrire.'],
  ['Les familles','Vous contrôlez ce que vous inscrivez et ce que votre doula voit. Vous pouvez consulter, corriger ou supprimer vos renseignements en tout temps. Vous devez avoir 18 ans ou plus.'],
  ['Abonnements et codes promo','Espace Doula : 8 $ par mois ou 90 $ par année. Espace Famille : gratuit si votre doula est abonnée à Sérénaissance; sinon 4 $ par mois ou 40 $ par année. Taxes en sus, paiement par Stripe, annulable en tout temps. Un code promo peut offrir une période gratuite (par exemple 6 mois), en nombre limité. Un message vous avertit avant la fin de la période gratuite. Sans abonnement, l\'accès est suspendu, mais vos données sont conservées.'],
  ['Supprimer mon compte','Vous pouvez supprimer votre compte dans Paramètres. Famille sans doula : votre espace et vos données sont supprimés définitivement. Famille avec doula : votre accès est retiré, et votre dossier reste chez votre doula pour la durée prévue à votre contrat. Doula : votre accès est fermé et vos familles sont archivées (conservées au moins un an).'],
  ['Utilisation correcte','Utilisez l\'appli de bonne foi, sans contenu illégal, trompeur ou offensant. Nous pouvons suspendre un compte qui ne respecte pas ces conditions. L\'appli est offerte telle quelle : nous faisons de notre mieux pour qu\'elle soit disponible et sécuritaire, mais ne pouvons garantir l\'absence d\'interruption ou d\'erreur. Une mise à jour importante est annoncée au moins 7 jours d\'avance.'],
  ['Questions','Pour toute question ou demande sur vos renseignements, écrivez-nous depuis l\'appli (« Écrire à Sérénaissance » ou « Signaler un problème ») ou à sc@academiesere.ca.']],
  ok:'J\'ai lu et j\'accepte les conditions d\'utilisation et la politique de confidentialité.',nom:'Votre nom complet (signature)',btn:'Accepter et continuer',sortir:'Me déconnecter',fermer:'Annuler',nomOb:'Tapez votre nom complet pour signer.',caseOb:'Cochez la case pour accepter.'},
 en:{titre:'Terms of use and privacy',intro:'Before continuing, please read and accept the following.',maj:'<b>Our terms of use have changed.</b> Please read and accept them again to keep using the app.',
  corps:[
  ['What the app is','The Sérénaissance app combines a Doula Space (files, documents, appointments, messages, payments) and a Family Space (cycle and trying to conceive, pregnancy, baby), with or without a doula. Its health information is general, checked against official sources, and never replaces a physician, midwife or emergency services. It makes no diagnosis. In an emergency, call 911.'],
  ['Your information','You entrust us with personal information, including health information (pregnancy dates, cycle, tests, appointments, pregnancy conditions, messages, signed documents, photos). It is used only to run the app and give you suited advice. It is stored securely, never sold, and shared only with the doula or family concerned, as you choose, and with the technical services required (hosting, email, payments). Photos of your tests stay in your space.'],
  ['Confidentiality','Each user agrees to keep other people\'s information confidential, except if a life is in danger or a child\'s safety is threatened. Do not share your access and log out of any device that is not yours.'],
  ['Doulas','The doula is responsible for her families\' files and the accuracy of what she enters, and for her contracts, rates (including travel fees) and services. She obtains each family\'s consent before entering their information. Académie Sérénaissance provides the tool but is not a party to the relationship between the doula and her family. The doula is solely responsible for the logos, images and documents she uploads: she declares she has the right to use them and have them signed. The document templates provided are examples only and are not legal advice.'],
  ['"Find my doula" directory','The public profile is optional. It costs $25 per year and is approved by Sérénaissance before publication. The doula declares that her training and services are accurate. An appointment request sent by a family gives the doula the information the family chose to write in it.'],
  ['Families','You control what you enter and what your doula sees. You may view, correct or delete your information at any time. You must be 18 or older.'],
  ['Subscriptions and promo codes','Doula Space: $8 per month or $90 per year. Family Space: free if your doula subscribes to Sérénaissance; otherwise $4 per month or $40 per year. Taxes extra, paid through Stripe, cancellable at any time. A promo code may offer a free period (for example 6 months), in limited number. A message warns you before the free period ends. Without a subscription, access is suspended but your data is kept.'],
  ['Deleting my account','You can delete your account in Settings. Family without a doula: your space and data are permanently deleted. Family with a doula: your access is removed and your file stays with your doula for the period set in your contract. Doula: your access is closed and your families are archived (kept at least one year).'],
  ['Proper use','Use the app in good faith, without illegal, misleading or offensive content. We may suspend an account that does not respect these terms. The app is provided as is: we do our best to keep it available and secure but cannot guarantee it will be free of interruption or error. A major update is announced at least 7 days in advance.'],
  ['Questions','For any question or request about your information, write to us from the app ("Write to Sérénaissance" or "Report a problem") or at sc@academiesere.ca.']],
  ok:'I have read and accept the terms of use and privacy policy.',nom:'Your full name (signature)',btn:'Accept and continue',sortir:'Log out',fermer:'Cancel',nomOb:'Type your full name to sign.',caseOb:'Tick the box to accept.'}};
const L=()=>EN?T.en:T.fr;
const sauve=nom=>{try{localStorage.setItem(LS,JSON.stringify({v:V,nom,date:new Date().toISOString()}))}catch(e){}};
const local=()=>{try{const o=JSON.parse(localStorage.getItem(LS)||'null');return o&&o.v===V?o:null}catch(e){return null}};
function ecran(opts){document.getElementById('cguOv')?.remove();const t=L(),o=document.createElement('div');o.id='cguOv';
  o.style.cssText='position:fixed;inset:0;z-index:99995;background:var(--bg,#faf5ef);overflow:auto;padding:calc(env(safe-area-inset-top,0px) + 16px) 16px calc(env(safe-area-inset-bottom,0px) + 24px)';
  o.setAttribute('data-notr','1');
  o.innerHTML='<div style="max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:12px"><h2 style="margin:0">'+t.titre+'</h2><p class="small muted">'+(opts.maj?t.maj:t.intro)+'</p>'+
   '<div class="card" style="gap:12px">'+t.corps.map(c=>'<div><b class="small">'+c[0]+'</b><p class="small" style="margin:4px 0 0">'+c[1]+'</p></div>').join('')+'</div>'+
   '<label class="check" style="display:flex;gap:10px;align-items:flex-start"><input type="checkbox" id="cguCase" style="margin-top:4px;accent-color:var(--accent)"><span class="small">'+t.ok+'</span></label>'+
   '<label class="f">'+t.nom+'<input id="cguNom" type="text" autocomplete="name" value="'+((opts.nom||'').replace(/"/g,'&quot;'))+'"></label>'+
   '<button class="btn" id="cguOk">'+t.btn+'</button>'+
   (opts.bloquant?'<button class="btn sm ghost" id="cguSortir">'+t.sortir+'</button>':'<button class="btn sm ghost" id="cguFermer">'+t.fermer+'</button>')+'</div>';
  document.body.appendChild(o);
  o.querySelector('#cguOk').onclick=async()=>{const nom=o.querySelector('#cguNom').value.trim();
    if(!o.querySelector('#cguCase').checked){toast(t.caseOb);return}if(nom.length<3){toast(t.nomOb);return}
    sauve(nom);o.remove();opts.ok&&opts.ok(nom)};
  const s=o.querySelector('#cguSortir');if(s)s.onclick=()=>{try{o.remove()}catch(e){}document.querySelector('[data-act="deconnexion"]')?.click()||(()=>{try{Object.keys(localStorage).filter(k=>k.indexOf(CLE_AUTH)===0).forEach(k=>localStorage.removeItem(k))}catch(e){}location.replace(location.pathname)})()};
  const f=o.querySelector('#cguFermer');if(f)f.onclick=()=>o.remove()}
/* 1) Avant de s'inscrire (formulaires de doulas) */
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if((a==='inscriptionDoula'||a==='devenirDoula')&&!local()&&!b._cguOk){e.stopImmediatePropagation();e.preventDefault();
    ecran({bloquant:false,ok:()=>{b._cguOk=true;b.click()}})}},true);
/* 2) À la création du compte par invitation (mamans invitées par leur doula, doulas invitées) */
let verifie=false;
async function gate(){if(verifie||typeof MOI==='undefined'||!MOI)return;if(document.getElementById('mdp1'))return; /* d'abord le mot de passe, puis les conditions */
  verifie=true;
  try{const {data}=await sb.auth.getUser();const u=data&&data.user;if(!u)return;const c=(u.user_metadata||{}).cgu;if(c&&c.v===V)return;
    const l=local();
    const enregistrer=async nom=>{try{await sb.auth.updateUser({data:{cgu:{v:V,nom,date:new Date().toISOString()}}})}catch(e){}};
    if(l){await enregistrer(l.nom);return}
    /* tout compte sans acceptation à jour doit accepter : nouveau compte, ou conditions modifiées depuis sa dernière signature */ /* familles : toujours à la première connexion, même si le lien du courriel n'est pas reconnu comme une invitation */ /* seulement à la création du compte (lien d'invitation) ; les comptes existants ne sont pas dérangés */
    const nomDefaut=(MOI.prenom?MOI.prenom+' '+(MOI.nom||''):'');
    ecran({bloquant:true,maj:!!(c&&c.v),nom:(c&&c.nom)||nomDefaut.trim(),ok:enregistrer})}catch(e){verifie=false}}
window.cguVerifier=()=>{verifie=false;gate()};
const _r=render;render=function(){_r.apply(this,arguments);gate()};
})();
