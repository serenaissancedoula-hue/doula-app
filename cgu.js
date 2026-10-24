/* Sérénaissance — conditions d'utilisation et confidentialité à accepter (et signer par son nom) avant d'utiliser l'appli.
   Doulas : acceptation demandée avant de s'inscrire ; familles et doulas invitées : à la création du compte seulement.
   L'acceptation est gardée dans le compte (métadonnées) avec la version, la date et le nom tapé. */
(function(){
const V='2026-10-24',EN=window.LANG==='en',LS='sere-cgu-ok';
const T={
 fr:{titre:'Conditions d\'utilisation et confidentialité',intro:'Avant de continuer, veuillez lire et accepter ce qui suit.',maj:'<b>Nos conditions d\'utilisation ont changé.</b> Veuillez les relire et les accepter de nouveau pour continuer à utiliser l\'appli.',
  corps:[
  ['Ce qu\'est l\'appli','L\'appli Sérénaissance est un outil de suivi et de communication entre une doula et les familles qu\'elle accompagne. Elle ne donne aucun avis médical, ne remplace jamais un médecin, une sage-femme ou les services d\'urgence. En cas d\'urgence, composez le 911.'],
  ['Vos renseignements','Vous nous confiez des renseignements personnels (nom, courriel, téléphone, dates de grossesse, rendez-vous, messages, documents signés, photos). Ils servent seulement à faire fonctionner l\'appli. Ils sont conservés de façon sécurisée, ne sont jamais vendus et ne sont partagés qu\'avec la doula ou la famille concernée et avec les services techniques nécessaires (hébergement, courriels, paiements).'],
  ['Confidentialité','Chaque utilisatrice s\'engage à garder confidentiels les renseignements des autres, sauf si une vie est en danger ou si la sécurité d\'un enfant est menacée. Ne partagez pas vos accès et déconnectez-vous d\'un appareil qui n\'est pas le vôtre.'],
  ['Les doulas','La doula est responsable des dossiers de ses familles et de l\'exactitude de ce qu\'elle y inscrit, de ses contrats et de ses services. Elle obtient le consentement de chaque famille avant d\'y inscrire ses renseignements. L\'Académie Sérénaissance offre l\'outil, mais n\'est pas partie à la relation entre la doula et sa famille. La doula est seule responsable des logos, images et documents qu\'elle téléverse (contrats, formulaires, etc.) : elle déclare avoir le droit de les utiliser et de les faire signer, et leur contenu n\'est ni vérifié ni approuvé par l\'Académie. Les modèles de documents fournis ne sont que des exemples et ne constituent pas un avis juridique.'],
  ['Les familles','Vous contrôlez ce que vous inscrivez. Vous pouvez demander à votre doula, ou à nous, de consulter, corriger ou supprimer vos renseignements. Vous devez avoir 18 ans ou plus.'],
  ['Abonnement','Après la période d\'essai de 6 mois offerte à certaines doulas, l\'accès à l\'Espace Doula demande un abonnement (8 $ par mois ou 90 $ par an, taxes en sus), payé par Stripe et annulable en tout temps. Sans abonnement, l\'accès est suspendu, mais les données sont conservées.'],
  ['Utilisation correcte','Utilisez l\'appli de bonne foi, sans contenu illégal, trompeur ou offensant. Nous pouvons suspendre un compte qui ne respecte pas ces conditions. L\'appli est offerte telle quelle : nous faisons de notre mieux pour qu\'elle soit disponible et sécuritaire, mais ne pouvons garantir l\'absence d\'interruption ou d\'erreur.'],
  ['Questions','Pour toute question ou demande sur vos renseignements, écrivez-nous depuis l\'appli (« Écrire à Sérénaissance » ou « Signaler un problème »).']],
  ok:'J\'ai lu et j\'accepte les conditions d\'utilisation et la politique de confidentialité.',nom:'Votre nom complet (signature)',btn:'Accepter et continuer',sortir:'Me déconnecter',fermer:'Annuler',nomOb:'Tapez votre nom complet pour signer.',caseOb:'Cochez la case pour accepter.'},
 en:{titre:'Terms of use and privacy',intro:'Before continuing, please read and accept the following.',maj:'<b>Our terms of use have changed.</b> Please read and accept them again to keep using the app.',
  corps:[
  ['What the app is','The Sérénaissance app is a tracking and communication tool between a doula and the families she supports. It gives no medical advice and never replaces a physician, midwife or emergency services. In an emergency, call 911.'],
  ['Your information','You entrust us with personal information (name, email, phone, pregnancy dates, appointments, messages, signed documents, photos). It is used only to run the app. It is stored securely, never sold, and shared only with the doula or family concerned and with the technical services required (hosting, email, payments).'],
  ['Confidentiality','Each user agrees to keep other people\'s information confidential, except if a life is in danger or a child\'s safety is threatened. Do not share your access and log out of any device that is not yours.'],
  ['Doulas','The doula is responsible for her families\' files and the accuracy of what she enters, and for her contracts and services. She obtains each family\'s consent before entering their information. Académie Sérénaissance provides the tool but is not a party to the relationship between the doula and her family. The doula is solely responsible for the logos, images and documents she uploads (contracts, forms, etc.): she declares she has the right to use them and have them signed, and their content is neither verified nor approved by the Académie. The document templates provided are examples only and are not legal advice.'],
  ['Families','You control what you enter. You may ask your doula, or us, to view, correct or delete your information. You must be 18 or older.'],
  ['Subscription','After the 6-month trial offered to some doulas, access to the Doula Space requires a subscription ($8 per month or $90 per year, taxes extra), paid through Stripe and cancellable at any time. Without a subscription, access is suspended but data is kept.'],
  ['Proper use','Use the app in good faith, without illegal, misleading or offensive content. We may suspend an account that does not respect these terms. The app is provided as is: we do our best to keep it available and secure but cannot guarantee it will be free of interruption or error.'],
  ['Questions','For any question or request about your information, write to us from the app ("Write to Sérénaissance" or "Report a problem").']],
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
