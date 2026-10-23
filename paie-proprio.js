/* Sérénaissance — options de paiement des familles de la propriétaire seulement : liens Stripe par forfait + virement Interac au téléphone.
   Les autres doulas gèrent leurs paiements elles-mêmes (aucun lien affiché pour elles). */
const PAIE_PROPRIO={courriels:['sc@academiesere.ca'],
  /* un lien par versement : forfait → nombre de versements → lien Stripe (montant d'un versement) */
  liens:{'Accompagnement des Parents':{1:'https://buy.stripe.com/9B63cocXK9ReacA6foffy0a',3:'https://buy.stripe.com/8x228kbTG1kI3Oc6foffy0o',6:'https://buy.stripe.com/28E5kw8Hu4wU98wdHQffy0p'},
    'Soutien au Couple':{1:'https://buy.stripe.com/7sY00c4re3sQ70o8nwffy0d',3:'https://buy.stripe.com/00wdR25vid3q84s47gffy0q'},
    'Arrivée de Bébé':{1:'https://buy.stripe.com/3cI00cbTG9Re98wcDMffy0f',2:'https://buy.stripe.com/14A8wI2j6aVi0C08nwffy0r'}}};
const _bfPP=blocForfaits;
blocForfaits=function(){let h=_bfPP();try{
  const D=typeof DOULA!=='undefined'?DOULA:null;if(!D||!PAIE_PROPRIO.courriels.includes(String(D.courriel||'').toLowerCase()))return h;
  const L=PAIE_PROPRIO.liens[FAM.forfait];const tel=D.telephone||'';
  const ct=(DOCS||[]).find(d=>d.type==='contrat'&&d.statut==='signe'),R=(ct&&ct.reponses)||{};
  const n=parseInt(R.paiement)||1,fr=R.frequence||'',F=FORFAITS[FAM.forfait];
  let p='<div class="card"><span class="eyebrow acc">Payer mon versement</span>';
  const signe=(DOCS||[]).some(d=>d.type==='contrat'&&d.statut==='signe');
  if(!signe)return h+p+'<p class="small">Vos options de paiement apparaissent ici dès que votre contrat est signé par vous et par votre doula.</p></div>';
  if(!F||!L)p+='<p class="small">Choisissez d\'abord votre forfait ci-dessus pour voir les options de paiement.</p>';
  else{const m=Math.round(F.prix/n*100)/100,pas={'Chaque semaine':7,'Aux 2 semaines':14,'Chaque mois':30}[fr]||30;
    const d0=new Date((ct.signature_parent&&ct.signature_parent.le)||ct.created_at||Date.now());
    const lim=FAM.dpa?new Date(new Date(FAM.dpa+'T12:00:00').getTime()-28*864e5):null;
    p+='<p class="small">Vous avez choisi : <b>'+n+' versement'+(n>1?'s':'')+'</b>'+(fr?' · '+esc(fr.toLowerCase()):'')+'. Chaque versement est de <b>'+money(m)+'</b>. Le premier est dû à la signature; sans lui, la rencontre n\'a pas lieu.</p>';
    p+='<div class="list">'+Array.from({length:n},(_,k)=>{const dt=new Date(d0.getTime()+k*pas*864e5),tard=lim&&dt>lim;return '<div class="li"><div class="tx"><b>Versement '+(k+1)+' · '+money(m)+'</b><span>'+(k?fmtD(dt,{day:'numeric',month:'long'}):'À la signature')+(tard?' · après 36 semaines : à devancer':'')+'</span></div></div>'}).join('')+'</div>';
    if(L[n])p+='<a class="btn" style="display:block;width:100%;text-align:center;margin:8px 0;text-decoration:none;box-sizing:border-box" target="_blank" rel="noopener" href="'+L[n]+'">'+icon('fa-credit-card')+'Payer un versement de '+money(m)+' par carte</a><p class="xs muted">Paiement sécurisé (Stripe). Refaites-le à chaque date du calendrier.</p>';
    else p+='<p class="small">Payez par virement Interac (ci-dessous).</p>'}
  if(tel)p+='<div class="soft" style="margin-top:8px"><b>Ou par virement Interac</b><p class="small" style="margin:4px 0">Envoyez votre virement au numéro de téléphone de votre doula :</p><div class="row between"><b style="font-size:1.05rem">'+esc(tel)+'</b><button class="btn sm ghost" data-act="copierTel" data-v="'+esc(tel)+'">'+icon('fa-copy')+'Copier</button></div><p class="xs muted">Inscrivez votre nom dans le message. Votre doula vous remet un reçu.</p></div>';
  return h+p+'</div>'}catch(e){return h}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="copierTel"]');if(!b)return;try{navigator.clipboard.writeText(b.dataset.v).then(()=>toast('Numéro copié'),()=>toast(b.dataset.v))}catch(x){toast(b.dataset.v)}});
/* courriel officiel de la propriétaire : affiché dans les contrats, reçus et le virement Interac */
const _idPP=infoDoula;infoDoula=function(){const I=_idPP.apply(this,arguments);try{
  const c=String(I.courriel||'').toLowerCase();const proprio=PAIE_PROPRIO.courriels.includes(c)||(S.role!=='parent'&&typeof MOI!=='undefined'&&MOI&&MOI.admin);
  if(proprio)I.courriel='sc@academiesere.ca'}catch(e){}return I};
