/* Sérénaissance — options de paiement des familles de la propriétaire seulement : liens Stripe par forfait + virement Interac au téléphone.
   Les autres doulas gèrent leurs paiements elles-mêmes (aucun lien affiché pour elles). */
const PAIE_PROPRIO={courriels:['sc@academiesere.ca','materniteenconfiance@gmail.com','serenaissance.doula@gmail.com'],
  liens:{'Accompagnement des Parents':{1:'https://buy.stripe.com/9B63cocXK9ReacA6foffy0a',2:'https://buy.stripe.com/8x23co7Dq7J684sfPYffy0b',4:'https://buy.stripe.com/bJe6oA3na3sQesQ0V4ffy0k'},
    'Soutien au Couple':{1:'https://buy.stripe.com/7sY00c4re3sQ70o8nwffy0d',2:'https://buy.stripe.com/dRmdR2cXK1kI3Oc1Z8ffy0e'},
    'Arrivée de Bébé':{1:'https://buy.stripe.com/3cI00cbTG9Re98wcDMffy0f',2:'https://buy.stripe.com/14A3co9Ly8Na70o9rAffy0g'}}};
const _bfPP=blocForfaits;
blocForfaits=function(){let h=_bfPP();try{
  const D=typeof DOULA!=='undefined'?DOULA:null;if(!D||!PAIE_PROPRIO.courriels.includes(String(D.courriel||'').toLowerCase()))return h;
  const L=PAIE_PROPRIO.liens[FAM.forfait];const tel=D.telephone||'';
  let p='<div class="card"><span class="eyebrow acc">Payer mon versement</span>';
  const signe=(DOCS||[]).some(d=>d.type==='contrat'&&d.statut==='signe');
  if(!signe)return h+'<div class="card"><span class="eyebrow acc">Payer mon versement</span><p class="small">Vos options de paiement apparaissent ici dès que votre contrat est signé par vous et par votre doula.</p></div>';
  if(!L)p+='<p class="small">Choisissez d\'abord votre forfait ci-dessus pour voir les options de paiement.</p>';
  else{const F=FORFAITS[FAM.forfait];const opt=[[1,'En un seul paiement',F?money(F.prix):''],[2,'En 2 versements',F?money(F.prix/2)+' chacun':''],[4,'En 4 versements',F?money(F.prix/4)+' chacun':'']].filter(o=>L[o[0]]);
    p+='<p class="small">Paiement sécurisé par carte (Stripe). Votre premier paiement se fait à la signature du contrat.</p>'+opt.map(o=>'<a class="btn" style="display:block;width:100%;text-align:center;margin:6px 0;text-decoration:none;box-sizing:border-box" target="_blank" rel="noopener" href="'+L[o[0]]+'">'+icon('fa-credit-card')+o[1]+(o[2]?' · '+o[2]:'')+'</a>').join('')}
  if(tel)p+='<div class="soft" style="margin-top:8px"><b>Ou par virement Interac</b><p class="small" style="margin:4px 0">Envoyez votre virement au numéro de téléphone de votre doula :</p><div class="row between"><b style="font-size:1.05rem">'+esc(tel)+'</b><button class="btn sm ghost" data-act="copierTel" data-v="'+esc(tel)+'">'+icon('fa-copy')+'Copier</button></div><p class="xs muted">Inscrivez votre nom dans le message. Votre doula vous remet un reçu.</p></div>';
  return h+p+'</div>'}catch(e){return h}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="copierTel"]');if(!b)return;try{navigator.clipboard.writeText(b.dataset.v).then(()=>toast('Numéro copié'),()=>toast(b.dataset.v))}catch(x){toast(b.dataset.v)}});
/* courriel officiel de la propriétaire : affiché dans les contrats, reçus et le virement Interac */
const _idPP=infoDoula;infoDoula=function(){const I=_idPP.apply(this,arguments);try{
  const c=String(I.courriel||'').toLowerCase();const proprio=PAIE_PROPRIO.courriels.includes(c)||(S.role!=='parent'&&typeof MOI!=='undefined'&&MOI&&MOI.admin);
  if(proprio)I.courriel='sc@academiesere.ca'}catch(e){}return I};
