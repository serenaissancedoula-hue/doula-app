/* Sérénaissance — le modèle « Rappel de paiement » se remplit seul : montant, date et mode de paiement viennent du contrat signé, du forfait choisi et des paiements déjà reçus. */
(function(){
function prochain(c){try{
  const docs=(typeof CDOCS!=='undefined'&&CDOCS[c.id])||[];
  const ct=docs.filter(d=>d.type==='contrat'&&d.statut==='signe').sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)))[0];
  if(!ct)return null;
  const R=ct.reponses||{},n=parseInt(R.paiement);if(!n)return null;
  const price=cPrice(c);if(!(price>0))return null;
  const m=Math.round(price/n*100)/100,paye=cPaid(c),fr=String(R.frequence||'');
  const d0=new Date((ct.signature_parent&&ct.signature_parent.le)||ct.created_at);
  const cap=c.dpa?new Date(new Date(c.dpa+'T12:00:00').getTime()-28*864e5):null;
  for(let k=1;k<=n;k++){
    if(paye>=k*m-0.01)continue;
    let d=new Date(d0);
    if(/mois/i.test(fr))d.setMonth(d.getMonth()+k-1);else d=new Date(d0.getTime()+(k-1)*(/2 semaines/i.test(fr)?14:/semaine/i.test(fr)?7:30)*864e5);
    if(cap&&d>cap)d=new Date(Math.max(cap,d0));
    const du=Math.round((k*m-paye)*100)/100;
    return {k,montant:Math.min(m,du),date:d}}
  return {fini:true}}catch(e){return null}}
function modes(){const C=((typeof ME_DOULA!=='undefined'&&ME_DOULA&&ME_DOULA.modeles)||{}).paiement||{};const L=[];
  if(C.interac)L.push('virement Interac à '+C.interac);
  if(C.lienCarte)L.push('carte, dans l\'appli (Ma doula › Forfaits)');
  if(!L.length)L.push('l\'appli (Ma doula › Forfaits)');
  return L.join(' ou ')}
const _fm=fillMsg;fillMsg=function(t,c){let r=_fm(t,c);
  if(c&&/\[montant\]|\[date\]|\[mode\]/.test(r)){const p=prochain(c);
    if(p&&p.fini){r='Bonjour '+cFirst(c)+', tous vos versements sont à jour. Merci beaucoup !'}
    else if(p){const f=x=>(Math.round(x*100)/100).toLocaleString('fr-CA',{minimumFractionDigits:(x%1?2:0),maximumFractionDigits:2});
      r=r.replace(/\[montant\]/g,f(p.montant)).replace(/\[date\]/g,p.date.toLocaleDateString('fr-CA',{day:'numeric',month:'long'})).replace(/\[mode\]/g,modes())}
    else r=r.replace(/\[mode\]/g,modes())}
  return r};
})();
