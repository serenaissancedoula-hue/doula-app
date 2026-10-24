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
function rdvProchain(c){try{const L=(typeof CRDV!=='undefined'?CRDV:[]).filter(r=>r.famille_id===c.id&&r.statut!=='annule'&&new Date(r.debut)>Date.now()-36e5).sort((a,b)=>new Date(a.debut)-new Date(b.debut));
  if(L[0]){const r=L[0],d=new Date(r.debut);return {d,heure:d.toLocaleTimeString('fr-CA',{hour:'2-digit',minute:'2-digit'}).replace(':',' h '),lieu:r.lieu||''}}
  const R=(c.rdv||[]).filter(r=>r.prochaine&&new Date(r.prochaine+'T12:00:00')>=new Date(new Date().toDateString())).sort((a,b)=>a.prochaine.localeCompare(b.prochaine))[0];
  if(R)return {d:new Date(R.prochaine+'T12:00:00'),heure:'',lieu:R.lieu||''}}catch(e){}return null}
function quand(d){const a=new Date(new Date().toDateString()),b=new Date(d.toDateString()),n=Math.round((b-a)/864e5);
  if(n===0)return 'aujourd\'hui';if(n===1)return 'demain';return 'le '+d.toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long'})}
const jolie=d=>d.toLocaleDateString('fr-CA',{day:'numeric',month:'long'});
const _fm=fillMsg;fillMsg=function(t,c){let r=_fm(t,c);
  try{
  if(c&&/\[(montant|date\+7|mode)\]/.test(r)){const p=prochain(c);
    if(p&&p.fini){r='Bonjour '+cFirst(c)+', tous vos versements sont à jour. Merci beaucoup !'}
    else if(p){const f=x=>(Math.round(x*100)/100).toLocaleString('fr-CA',{minimumFractionDigits:(x%1?2:0),maximumFractionDigits:2});
      r=r.replace(/\[montant\]/g,f(p.montant)).replace(/\[date\+7\]/g,jolie(new Date(p.date.getTime()+7*864e5))).replace(/\[date\]/g,jolie(p.date)).replace(/\[mode\]/g,modes())}
    else r=r.replace(/\[mode\]/g,modes())}
  if(c&&/\[(quand|heure|lieu \/ lien|lieu|date)\]/.test(r)){const v=rdvProchain(c);
    if(v){r=r.replace(/\[quand\]/g,quand(v.d)).replace(/\[date\]/g,jolie(v.d));if(v.heure)r=r.replace(/\[heure\]/g,v.heure);else r=r.replace(/ à \[heure\]/g,'');if(v.lieu)r=r.replace(/\[lieu \/ lien\]/g,v.lieu);else r=r.replace(/, \[lieu \/ lien\]/g,'')}
    else if(typeof toast==='function'&&/\[quand\]/.test(r))toast('Aucune rencontre prévue au dossier de cette famille : ajoutez-en une pour que la date se remplisse seule')}
  if(/\[(nom|Nom|numéro)\]|\[nom, numéro\]/.test(r)&&typeof toast==='function')toast('Ajoutez le nom et le numéro de votre remplaçante dans Paramètres : ils se rempliront seuls')
  }catch(e){}
  return r};
})();
