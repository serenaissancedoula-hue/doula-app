/* Sérénaissance — changement de forfait à la baisse (rétrogradation).
   Quand une famille passe à un forfait moins cher (elle-même dans son appli, ou la doula dans le dossier),
   l'appli calcule la différence avec ce qui est déjà payé :
     - déjà payé plus que le nouveau prix → remboursement à faire ;
     - sinon → nouveau solde à payer.
   Rien n'est émis ni envoyé avant que la doula valide (elle peut corriger le montant).
   À la validation : le remboursement est inscrit dans les versements (montant négatif), le changement est
   gardé dans l'historique du dossier, et la famille reçoit le détail dans son appli. */
function faRef(c){if(!c.forfaitRef&&c.forfait)c.forfaitRef={nom:c.forfait,prix:cPrice(c)};return c.forfaitRef}
function faEnAttente(c){const r=faRef(c);if(!r||!c.forfait)return null;const nouveau=cPrice(c);
  if(r.nom===c.forfait&&+r.prix===+nouveau)return null;
  if(nouveau>=+r.prix){c.forfaitRef={nom:c.forfait,prix:nouveau};return null} // hausse : rien à rembourser, le solde se met à jour seul
  const paye=cPaid(c),remb=Math.max(0,Math.round((paye-nouveau)*100)/100),solde=Math.max(0,Math.round((nouveau-paye)*100)/100);
  return {ancien:r.nom,prixAncien:+r.prix,nouveau:c.forfait,prixNouveau:nouveau,diff:Math.round((+r.prix-nouveau)*100)/100,paye,remb,solde}}
function faMessage(c,A,montant){
  return 'Changement de forfait\n\n'+
    'Ancien forfait : '+A.ancien+' ('+money(A.prixAncien)+')\nNouveau forfait : '+A.nouveau+' ('+money(A.prixNouveau)+')\n'+
    'Déjà payé : '+money(A.paye)+'\n\n'+
    (montant>0?'Remboursement : '+money(montant)+'\nIl vous sera remboursé dans les 10 jours, par le même moyen que votre paiement.'
      :'Nouveau solde à payer : '+money(Math.max(0,A.prixNouveau-A.paye))+'\nVos prochains versements sont ajustés en conséquence.')}
function faCarte(c){const A=faEnAttente(c);if(!A)return '';const m=c._faMontant!=null?+c._faMontant:A.remb;
  return '<div class="card" style="border-color:var(--accent)"><span class="eyebrow acc">'+icon('fa-scale-balanced')+' Changement de forfait à valider</span>'+
    '<div class="list"><div class="li"><div class="tx"><b>'+esc(A.ancien)+'</b><span>Ancien forfait · '+money(A.prixAncien)+'</span></div></div>'+
    '<div class="li"><div class="tx"><b>'+esc(A.nouveau)+'</b><span>Nouveau forfait · '+money(A.prixNouveau)+'</span></div></div></div>'+
    '<div class="grid3"><div class="stat"><b>'+money(A.diff)+'</b><span>différence</span></div><div class="stat ok"><b>'+money(A.paye)+'</b><span>déjà payé</span></div>'+
    (A.remb>0?'<div class="stat acc"><b>'+money(A.remb)+'</b><span>à rembourser</span></div>':'<div class="stat warn"><b>'+money(A.solde)+'</b><span>nouveau solde</span></div>')+'</div>'+
    (A.remb>0?'<label class="f">Montant que je rembourse ($) — modifiable<input type="number" step="0.01" min="0" id="faMontant" value="'+m+'"></label>'
      :'<p class="small">La famille a payé moins que le nouveau prix : rien à rembourser, son solde passe à <b>'+money(A.solde)+'</b>.</p>')+
    '<p class="small muted" style="margin-top:6px">Message qui sera envoyé à la famille :</p><pre class="msg" id="faApercu">'+esc(faMessage(c,A,A.remb>0?m:0))+'</pre>'+
    '<div class="row" style="flex-wrap:wrap"><button class="btn" data-act="faValider" data-id="'+c.id+'">'+icon('fa-check')+'Valider et envoyer à la famille</button>'+
    '<button class="btn ghost" data-act="faAnnuler" data-id="'+c.id+'">Garder l\'ancien forfait</button></div>'+
    '<p class="xs muted">Rien n\'est envoyé ni inscrit avant que vous validiez.</p></div>'}
function faHistorique(c){const L=c.ajustements||[];if(!L.length)return '';
  return '<details class="acc"><summary>'+icon('fa-clock-rotate-left','var(--accent)')+'Changements de forfait ('+L.length+')<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body"><div class="list">'+
    L.slice().reverse().map(x=>'<div class="li"><div class="tx"><b>'+esc(x.ancien)+' → '+esc(x.nouveau)+'</b><span>'+fmtD(parseD(x.date),{day:'numeric',month:'short',year:'numeric'})+' · '+
      (x.remboursement>0?'remboursement '+money(x.remboursement):'nouveau solde '+money(x.nouveauSolde))+'</span></div></div>').join('')+'</div></div></details>'}
if(typeof cPaie==='function'){const _cPaieFA=cPaie;cPaie=function(c,i,P){return faCarte(c)+_cPaieFA(c,i,P)+faHistorique(c)}}
document.addEventListener('input',e=>{if(e.target.id!=='faMontant')return;const c=S.clients.find(x=>x.id===S.openClient);if(!c)return;
  c._faMontant=e.target.value;const A=faEnAttente(c),ap=document.getElementById('faApercu');if(A&&ap)ap.textContent=faMessage(c,A,+e.target.value||0)});
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act=faValider],[data-act=faAnnuler]');if(!b)return;e.stopPropagation();
  const c=S.clients.find(x=>x.id===b.dataset.id);if(!c)return;const A=faEnAttente(c);if(!A){render();return}
  if(b.dataset.act==='faAnnuler'){c.forfait=A.ancien;delete c._faMontant;await saveClient(c.id);render();toast('Ancien forfait conservé');return}
  const m=A.remb>0?Math.max(0,Math.round((+(c._faMontant!=null?c._faMontant:A.remb)||0)*100)/100):0;
  if(A.remb>0&&m>A.paye){toast('Le remboursement dépasse ce qui a été payé');return}
  if(b.dataset.c!=='1'){b.dataset.c='1';b.innerHTML=icon('fa-check')+(m>0?'Confirmer le remboursement de '+money(m):'Confirmer le nouveau solde');return}
  b.disabled=true;const date=iso(new Date());
  if(m>0)(c.paie=c.paie||[]).push({id:uid(),date,montant:-m,mode:'Remboursement',no:'',note:'Changement de forfait : '+A.ancien+' → '+A.nouveau});
  (c.ajustements=c.ajustements||[]).push({date,ancien:A.ancien,nouveau:A.nouveau,prixAncien:A.prixAncien,prixNouveau:A.prixNouveau,paye:A.paye,remboursement:m,nouveauSolde:Math.max(0,Math.round((A.prixNouveau-(A.paye-m))*100)/100)});
  c.forfaitRef={nom:c.forfait,prix:cPrice(c)};delete c._faMontant;
  await saveClient(c.id);
  const {error}=await sb.from('fam_messages').insert({famille_id:c.id,de_doula:true,type:'document',texte:faMessage(c,A,m)});
  try{await chargerClientDetail(c.id)}catch(x){}render();
  toast(error?'Inscrit au dossier, mais le message n\'est pas parti : '+(error.message||'erreur'):'Changement validé et envoyé à la famille')},true);
/* Dès le chargement, chaque dossier garde en mémoire son forfait validé : un changement fait plus tard par la famille sera repéré. */
if(typeof chargerDoula==='function'){const _cdFA=chargerDoula;chargerDoula=async function(){const r=await _cdFA.apply(this,arguments);
  try{for(const c of (S.clients||[]))if(c.forfait&&!c.forfaitRef){c.forfaitRef={nom:c.forfait,prix:cPrice(c)};saveClient(c.id)}}catch(e){}return r}}
