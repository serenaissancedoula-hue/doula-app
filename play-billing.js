/* Sérénaissance — paiement Google Play (appli Android seulement).
   Dans l'appli installée depuis Google Play, les abonnements passent par Google (règle de la boutique) au lieu de Stripe.
   Sur le site web et sur iPhone, rien ne change : les liens Stripe restent.
   Les boutons de paiement portent data-play="identifiant-du-produit" ; ici on les relie à Google, puis le serveur (play-achat) vérifie l'achat.
   Produits à créer dans la Play Console : doula_mensuel, doula_annuel, annuaire_annuel (appli Doula) ; famille_mensuel, famille_annuel (appli Famille). */
(function(){
  const PAQUET={doula:'ca.academiesere.doula',parent:'ca.academiesere.famille'}[window.ESPACE];
  let twa=false;
  try{if(/^android-app:\/\//.test(document.referrer||''))localStorage.setItem('sere-twa','1');twa=localStorage.getItem('sere-twa')==='1'}catch(e){twa=/^android-app:\/\//.test(document.referrer||'')}
  if(!twa||!PAQUET||!('getDigitalGoodsService' in window))return;
  window.PLAY_ACTIF=true;
  let svc=null,DET={};
  const service=async()=>svc||(svc=await window.getDigitalGoodsService('https://play.google.com/billing'));
  const SKUS=['doula_mensuel','doula_annuel','annuaire_annuel','famille_mensuel','famille_annuel'];
  async function details(){try{const s=await service();const L=await s.getDetails(SKUS.filter(k=>window.ESPACE==='doula'?/^(doula|annuaire)/.test(k):/^famille/.test(k)));L.forEach(d=>{DET[d.itemId]=d})}catch(e){}}
  const prix=d=>{try{return new Intl.NumberFormat('fr-CA',{style:'currency',currency:d.price.currency}).format(+d.price.value)}catch(e){return ''}};
  /* envoie l'achat au serveur, qui le vérifie auprès de Google */
  async function verifier(produit,token){
    const {data,error}=await sb.functions.invoke('play-achat',{body:{produit,token,paquet:PAQUET}});
    return !error&&data&&data.ok}
  async function acheter(sku){
    try{
      const s=await service();
      const req=new PaymentRequest([{supportedMethods:'https://play.google.com/billing',data:{sku}}],{total:{label:'Total',amount:{currency:(DET[sku]&&DET[sku].price.currency)||'CAD',value:(DET[sku]&&DET[sku].price.value)||'0'}}});
      const r=await req.show();
      const token=r.details&&r.details.purchaseToken;
      const ok=token?await verifier(sku,token):false;
      await r.complete(ok?'success':'fail');
      if(ok){toast('Merci ! Votre abonnement est activé.');try{if(window.ESPACE==='doula'&&typeof chargerDoula==='function')await chargerDoula();else if(typeof cpVerifierFamille==='function')await cpVerifierFamille();else if(typeof load==='function')await load()}catch(e){}try{render()}catch(e){}}
      else toast('Le paiement n\'a pas pu être vérifié. Réessayez dans une minute.');
    }catch(e){if(!/abort|cancel/i.test(String(e&&e.name)+String(e&&e.message)))toast('Paiement impossible pour le moment.')}}
  /* au démarrage : retrouve les achats déjà faits (renouvellements, nouvel appareil) */
  let synchro=false;
  async function synchroniser(){if(synchro||typeof sb==='undefined')return;synchro=true;
    try{const s=await service();const L=await s.listPurchases();for(const a of L)await verifier(a.itemId,a.purchaseToken)}catch(e){synchro=false}}
  /* remplace les liens Stripe par des boutons Google */
  function adapter(){
    document.querySelectorAll('a[data-play]').forEach(a=>{
      if(a.dataset.pok)return;a.dataset.pok='1';a.removeAttribute('href');a.removeAttribute('target');a.style.cursor='pointer';
      const d=DET[a.dataset.play];if(d&&a.dataset.play.indexOf('annuaire')<0)a.firstChild&&(a.firstChild.nodeType===3)&&(a.firstChild.textContent=prix(d)+(/mensuel/.test(a.dataset.play)?' par mois':' par an'));
    });
    document.querySelectorAll('p.xs.muted').forEach(p=>{if(/Stripe/.test(p.textContent)&&!p.dataset.pok){p.dataset.pok='1';p.textContent='Paiement sécurisé par Google Play. Annulable en tout temps dans Google Play.'}});
  }
  document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[data-play]');if(!a)return;e.preventDefault();e.stopPropagation();acheter(a.dataset.play)},true);
  const obs=new MutationObserver(()=>{clearTimeout(obs.t);obs.t=setTimeout(adapter,80)});
  const go=()=>{obs.observe(document.body,{childList:true,subtree:true});details().then(adapter);setTimeout(synchroniser,4000)};
  if(document.body)go();else document.addEventListener('DOMContentLoaded',go);
})();
