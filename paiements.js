/* Sérénaissance — paiements des familles : la famille déclare un paiement (carte ou virement), la doula le valide, modifie, émet le reçu;
   rappel 48 h avant l'échéance et suspension du suivi le lendemain d'un retard (automatique, côté serveur). */
let DECL=[];const CDECL={};
const pvEsc=s=>esc(String(s==null?'':s));
const pvUrl=u=>/^https:\/\/[^\s"'<>]+$/i.test(String(u||'').trim())?String(u).trim():'';
const pvCfg=()=>((typeof DOULA!=='undefined'&&DOULA&&DOULA.modeles)||{}).paiement||{};

/* ---------------- côté famille ---------------- */
if(typeof chargerEchanges!=='undefined'){const _ceP=chargerEchanges;chargerEchanges=async function(){await _ceP();try{if(!FAM)return;const {data}=await sb.from('fam_versements_declares').select('*').eq('famille_id',FAM.id).order('created_at',{ascending:false});DECL=data||[]}catch(e){DECL=[]}}}
function pvEcheances(){try{const ct=(DOCS||[]).find(d=>d.type==='contrat'&&d.statut==='signe');if(!ct||!FAM||!FORFAITS[FAM.forfait])return null;
  const R=ct.reponses||{},n=parseInt(R.paiement);if(!n)return null;const F=FORFAITS[FAM.forfait],m=Math.round(F.prix/n*100)/100,fr=R.frequence||'';
  const d0=new Date((ct.signature_parent&&ct.signature_parent.le)||ct.created_at);const cap=FAM.dpa?new Date(new Date(FAM.dpa+'T12:00:00').getTime()-28*864e5):null;
  const paye=payeTotal();return Array.from({length:n},(_,k)=>{let d=new Date(d0);if(/mois/i.test(fr))d.setMonth(d.getMonth()+k);else d=new Date(d0.getTime()+k*(/2 semaines/i.test(fr)?14:/semaine/i.test(fr)?7:30)*864e5);if(cap&&d>cap)d=new Date(Math.max(cap,d0));
    return {k:k+1,m,d,ok:paye>=(k+1)*m-0.01,tard:paye<(k+1)*m-0.01&&Date.now()>d.getTime()+864e5}})}catch(e){return null}}
function blocPaiement(){const C=pvCfg(),carte=pvUrl(C.lienCarte),ow=typeof PAIE_PROPRIO!=='undefined'&&DOULA&&PAIE_PROPRIO.courriels.includes(String(DOULA.courriel||'').toLowerCase());
  let h='<div class="card"><span class="eyebrow acc">Payer et suivre mes paiements</span>';
  if(FAM.suivi_suspendu)h+='<div class="banner gold">'+icon('fa-pause')+'<div class="small"><b>Suivi suspendu : paiement en retard.</b> Conformément au contrat, le suivi reprend dès que votre versement est reçu.</div></div>';
  const E=pvEcheances();
  if(E&&!ow)h+='<div class="list">'+E.map(x=>'<div class="li"><div class="tx"><b>Versement '+x.k+' · '+money(x.m)+'</b><span>'+(x.k===1?'À la signature':fmtD(x.d,{day:'numeric',month:'long'}))+'</span></div><span class="pill '+(x.ok?'sage':x.tard?'warn':'acc')+'">'+(x.ok?'Payé':x.tard?'En retard':'À venir')+'</span></div>').join('')+'</div><p class="xs muted">Un rappel vous est envoyé 48 h avant chaque échéance. Sans paiement au plus tard le lendemain de l\'échéance, le suivi est suspendu jusqu\'au paiement.</p>';
  if(carte&&!ow)h+='<a class="btn" style="display:block;text-align:center;text-decoration:none;margin:8px 0" target="_blank" rel="noopener" href="'+pvEsc(carte)+'">'+icon('fa-credit-card')+'Payer par carte (paiement sécurisé)</a><p class="xs muted">Vous entrez vos informations de carte sur la page sécurisée du fournisseur de paiement : l\'appli ne les voit ni ne les garde.</p>';
  if(C.interac&&!ow)h+='<div class="soft"><b>Ou par virement Interac</b><p class="small" style="margin:4px 0">Envoyez votre virement à :</p><div class="row between"><b>'+pvEsc(C.interac)+'</b><button class="btn sm ghost" data-act="copierTel" data-v="'+pvEsc(C.interac)+'">'+icon('fa-copy')+'Copier</button></div>'+(C.consigne?'<p class="xs muted">'+pvEsc(C.consigne)+'</p>':'')+'</div>';
  h+='<button class="btn ghost" data-act="pvNouveau" style="margin-top:8px">'+icon('fa-circle-check')+'J\'ai effectué un paiement</button><p class="xs muted">Après votre paiement, touchez ce bouton : votre doula le valide et vous remet un reçu dans l\'appli.</p>';
  const att=(DECL||[]).filter(d=>d.statut==='a_valider'),ref=(DECL||[]).filter(d=>d.statut==='refuse');
  if(att.length||ref.length)h+='<div class="list">'+att.concat(ref).map(d=>'<div class="li"><div class="tx"><b>'+money(d.montant)+' · '+pvEsc(d.mode)+'</b><span>'+fmtD(parseD(d.date))+'</span></div><span class="pill '+(d.statut==='refuse'?'warn':'gold')+'">'+(d.statut==='refuse'?'Non retrouvé : écrivez à votre doula':'En attente de validation')+'</span></div>').join('')+'</div>';
  return h+'</div>'}
if(typeof blocForfaits!=='undefined'){const _bfPV=blocForfaits;blocForfaits=function(){const h=_bfPV();try{return h+blocPaiement()}catch(e){return h}}}
if(typeof hautAccueil!=='undefined'){const _haPV=hautAccueil;hautAccueil=function(){let h=_haPV.apply(this,arguments);try{if(FAM&&FAM.suivi_suspendu&&S.role==='parent')h+='<div class="banner gold" style="margin-bottom:10px">'+icon('fa-pause')+'<div class="small"><b>Suivi suspendu : paiement en retard.</b> Réglez votre versement dans Ma doula › Forfaits : le suivi reprend dès sa réception.</div></div>'}catch(e){}return h}}

/* ---------------- côté doula ---------------- */
const pvProprio=()=>typeof PAIE_PROPRIO!=='undefined'&&ME_DOULA&&PAIE_PROPRIO.courriels.includes(String(ME_DOULA.courriel||'').toLowerCase());
if(typeof chargerClientDetail!=='undefined'){const _ccPV=chargerClientDetail;chargerClientDetail=async function(id){await _ccPV(id);try{
  const [d,f]=await Promise.all([sb.from('fam_versements_declares').select('*').eq('famille_id',id).order('created_at',{ascending:false}),sb.from('fam_familles').select('suivi_suspendu').eq('id',id).maybeSingle()]);
  CDECL[id]=d.data||[];const c=(S.clients||[]).find(x=>x.id===id);if(c)c.suivi_suspendu=!!(f.data&&f.data.suivi_suspendu)}catch(e){}}}
if(typeof cPaie!=='undefined'){const _cpPV=cPaie;cPaie=function(c){let h=_cpPV.apply(this,arguments);try{
  h=h.replace(/(<button class="btn sm ghost" data-act="recu" data-id="[^"]+" data-r="([^"]+)">Reçu<\/button>)/g,'<button class="btn sm ghost" data-act="paieEdit" data-id="'+c.id+'" data-r="$2">Modifier</button>$1');
  let top='';
  if(c.suivi_suspendu)top+='<div class="banner gold">'+icon('fa-pause')+'<div class="small"><b>Suivi suspendu (paiement en retard).</b> Il reprend automatiquement quand le versement est enregistré.</div><button class="btn sm" data-act="pvReprendre" data-id="'+c.id+'">Reprendre maintenant</button></div>';
  const att=(CDECL[c.id]||[]).filter(d=>d.statut==='a_valider');
  if(att.length)top+='<div class="card"><span class="eyebrow acc">Paiements déclarés par la famille</span><div class="list">'+att.map(d=>'<div class="li"><div class="tx"><b>'+money(d.montant)+' · '+pvEsc(d.mode)+'</b><span>'+fmtD(parseD(d.date))+(d.note?' · '+pvEsc(d.note):'')+'</span></div><button class="btn sm" data-act="pvOk" data-id="'+c.id+'" data-r="'+d.id+'">Valider + reçu</button><button class="btn sm ghost" data-act="pvNo" data-id="'+c.id+'" data-r="'+d.id+'">Non reçu</button></div>').join('')+'</div><p class="xs muted">Vérifiez dans votre compte avant de valider : le reçu est envoyé tout de suite à la famille.</p></div>';
  return top+h}catch(e){return h}}}

/* Outil « Paiements » : mon lien de paiement, mon virement Interac, soldes de toutes les familles */
DSUB.paiements=function(){const C=((ME_DOULA&&ME_DOULA.modeles)||{}).paiement||{};
  let h=back('dsub','','Outils')+sh('Paiements','Soldes de vos familles, et comment elles vous paient');
  h+='<div class="card"><span class="eyebrow acc">Comment mes familles me paient</span>'+
    (pvProprio()?'<div class="banner sage">'+icon('fa-circle-check')+'<div class="small"><b>Vos liens Stripe sont déjà dans l\'appli.</b> Vous en avez un par forfait et par nombre de versements : la famille voit automatiquement le bon lien (selon son forfait et ce qu\'elle a choisi dans son contrat). Rien à ajouter ici.</div></div>':'<label class="f">Mon lien de paiement par carte (Stripe, PayPal, Square…)<input id="pvLien" type="url" placeholder="https://buy.stripe.com/…" value="'+pvEsc(C.lienCarte)+'"></label><p class="xs muted">Créez un lien de paiement dans votre compte Stripe (ou autre) et collez-le ici : la famille paie sur la page sécurisée du fournisseur, l\'argent va directement dans votre compte, et l\'appli ne voit jamais de numéro de carte.</p>')+
    '<label class="f">Mon virement Interac (courriel ou téléphone)<input id="pvInterac" value="'+pvEsc(C.interac)+'" placeholder="vous@exemple.ca"></label>'+
    '<label class="f">Consigne pour la famille (facultatif)<input id="pvConsigne" value="'+pvEsc(C.consigne)+'" placeholder="Inscrivez votre nom dans le message"></label>'+
    '<button class="btn" data-act="pvSauver">'+icon('fa-check')+'Enregistrer</button></div>';
  const L=(S.clients||[]).filter(c=>c.forfait&&!c.archivee_le);
  h+='<div class="card"><span class="eyebrow acc">Soldes</span>'+(L.length?'<div class="list">'+L.map(c=>{const pr=cPrice(c),pd=cPaid(c);return '<div class="li" data-act="pvOuvrir" data-id="'+c.id+'" style="cursor:pointer"><div class="tx"><b>'+pvEsc(cName(c))+(c.suivi_suspendu?' ⏸️':'')+'</b><span>'+pvEsc(c.forfait)+' · payé '+money(pd)+' sur '+money(pr)+'</span></div><span class="pill '+(pr-pd>0.005?'gold':'sage')+'">'+(pr-pd>0.005?'Solde '+money(pr-pd):'Payé')+'</span></div>'}).join('')+'</div>':'<p class="small muted">Aucune famille avec un forfait pour le moment.</p>')+
    '<p class="xs muted">Touchez une famille pour ajouter un versement, valider un paiement, modifier ou émettre un reçu.</p></div>';
  h+='<div class="card"><span class="eyebrow acc">Rappels automatiques</span><p class="small">Chaque famille reçoit un rappel (notification et courriel) <b>48 h avant</b> chaque versement. Si le versement n\'est pas reçu le <b>lendemain de l\'échéance</b>, le suivi est suspendu : la famille et vous êtes avisées. Il reprend automatiquement dès que le versement est enregistré.</p></div>';
  return h};
if(typeof DOUT!=='undefined'&&!DOUT.find(x=>x[0]==='paiements')){DOUT.unshift(['paiements','fa-sack-dollar','Paiements','Soldes, reçus, lien de paiement']);
  try{if(typeof GROUPES!=='undefined'&&GROUPES[0]&&!GROUPES[0][1].includes('paiements'))GROUPES[0][1].unshift('paiements')}catch(e){}}

/* ---------------- actions ---------------- */
function pvProchainNo(){return String((S.clients||[]).reduce((n,x)=>n+(x.paie||[]).length,0)+1).padStart(3,'0')}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act^="pv"],[data-act="paieEdit"],[data-act="paieEditSave"]');if(!b)return;const a=b.dataset.act;e.stopPropagation();
  try{
  if(a==='pvNouveau'){sheet('J\'ai effectué un paiement','<label class="f">Montant ($)<input id="pvM" type="number" inputmode="decimal" step="0.01" min="0"></label><label class="f">Mode<select id="pvMode"><option>Virement Interac</option><option>Carte</option><option>Autre</option></select></label><label class="f">Date<input id="pvDate" type="date" value="'+iso(new Date())+'"></label><label class="f">Note (facultatif)<input id="pvNote" maxlength="200" placeholder="Ex. versement 2 de 3"></label><button class="btn" data-act="pvDecl">'+icon('fa-paper-plane')+'Envoyer à ma doula</button>');return}
  if(a==='pvDecl'){const m=parseFloat(($('#pvM').value||'').replace(',','.'));if(!(m>0)){toast('Entrez le montant');return}b.disabled=true;
    const row={famille_id:FAM.id,montant:m,mode:$('#pvMode').value,date:$('#pvDate').value||iso(new Date()),note:($('#pvNote').value||'').trim()||null};
    const {error}=await sb.from('fam_versements_declares').insert(row);if(error){toast(error.message);b.disabled=false;return}
    await sb.from('fam_messages').insert({famille_id:FAM.id,de_doula:false,type:'message',texte:'💳 J\'ai effectué un paiement de '+money(m)+' ('+row.mode+') le '+fmtD(parseD(row.date))+'. Pouvez-vous le valider ? Merci !'});
    close();await chargerEchanges();render();toast('Envoyé : votre doula valide et vous remet un reçu');return}
  if(a==='pvSauver'){const C=Object.assign({},((ME_DOULA.modeles||{}).paiement)||{});const lienEl=$('#pvLien'),l=lienEl?(lienEl.value||'').trim():(C.lienCarte||'');if(l&&!pvUrl(l)){toast('Le lien doit commencer par https://');return}
    C.lienCarte=l;C.interac=($('#pvInterac').value||'').trim();C.consigne=($('#pvConsigne').value||'').trim();ME_DOULA.modeles=Object.assign({},ME_DOULA.modeles||{},{paiement:C});
    const ok=await saveDoula();if(ok){toast('Enregistré : vos familles voient ces options');render()}return}
  if(a==='pvOuvrir'){S.dtab='clientes';S.dsub='';S.openClient=b.dataset.id;S.ctab='paiements';await chargerClientDetail(b.dataset.id);render();scrollTo(0,0);return}
  if(a==='pvOk'){const c=S.clients.find(x=>x.id===b.dataset.id),d=(CDECL[c.id]||[]).find(x=>x.id===b.dataset.r);if(!c||!d)return;b.disabled=true;
    const p={id:uid(),date:d.date,montant:+d.montant,mode:d.mode,no:pvProchainNo(),recuAuto:true};(c.paie=c.paie||[]).push(p);(c.docs=c.docs||{})['Reçus de paiement']=true;
    await saveClient(c.id);const {error}=await sb.from('fam_versements_declares').update({statut:'valide'}).eq('id',d.id);if(error){toast(error.message);return}
    await sb.from('fam_messages').insert({famille_id:c.id,de_doula:true,type:'document',texte:recuTexte(c,p,c.paie.length)});try{notifierFamille(c.id,'recu')}catch(x){}
    try{await sb.rpc('fam_echeances_run',{p_famille:c.id})}catch(x){}
    await chargerClientDetail(c.id);render();toast('Validé : reçu envoyé à la famille');return}
  if(a==='pvNo'){const c=S.clients.find(x=>x.id===b.dataset.id);const {error}=await sb.from('fam_versements_declares').update({statut:'refuse'}).eq('id',b.dataset.r);if(error){toast(error.message);return}
    await sb.from('fam_messages').insert({famille_id:b.dataset.id,de_doula:true,type:'message',texte:'Je n\'ai pas retrouvé votre paiement dans mon compte pour l\'instant. Pouvez-vous me donner plus de détails (date, montant, mode) ? Merci !'});
    await chargerClientDetail(b.dataset.id);render();toast('La famille est avisée');return}
  if(a==='pvReprendre'){const {error}=await sb.from('fam_familles').update({suivi_suspendu:false,suspendu_le:null}).eq('id',b.dataset.id);if(error){toast(error.message);return}
    await sb.from('fam_messages').insert({famille_id:b.dataset.id,de_doula:true,type:'message',texte:'✅ Le suivi reprend. Merci !'});await chargerClientDetail(b.dataset.id);render();toast('Suivi repris');return}
  if(a==='paieEdit'){const c=S.clients.find(x=>x.id===b.dataset.id),p=(c.paie||[]).find(x=>x.id===b.dataset.r);if(!p)return;
    sheet('Modifier le versement','<label class="f">Date<input id="peD" type="date" value="'+pvEsc(p.date)+'"></label><label class="f">Montant ($)<input id="peM" type="number" step="0.01" value="'+pvEsc(p.montant)+'"></label><label class="f">Mode<select id="peMode">'+['Stripe','Carte','Virement Interac','Autre'].map(o=>'<option'+(o===p.mode?' selected':'')+'>'+o+'</option>').join('')+'</select></label><label class="f">No de reçu<input id="peNo" value="'+pvEsc(p.no)+'"></label><label class="check"><input type="checkbox" id="peRecu"><span>Renvoyer un reçu corrigé à la famille</span></label><button class="btn" data-act="paieEditSave" data-id="'+c.id+'" data-r="'+p.id+'">'+icon('fa-check')+'Enregistrer</button>');return}
  if(a==='paieEditSave'){const c=S.clients.find(x=>x.id===b.dataset.id),i=(c.paie||[]).findIndex(x=>x.id===b.dataset.r);if(i<0)return;const m=parseFloat($('#peM').value);if(!(m>0)){toast('Entrez le montant');return}
    Object.assign(c.paie[i],{date:$('#peD').value||c.paie[i].date,montant:m,mode:$('#peMode').value,no:($('#peNo').value||'').trim()||c.paie[i].no});const renvoi=$('#peRecu').checked;
    await saveClient(c.id);if(renvoi){await sb.from('fam_messages').insert({famille_id:c.id,de_doula:true,type:'document',texte:'REÇU CORRIGÉ\n'+recuTexte(c,c.paie[i],i+1)});try{notifierFamille(c.id,'recu')}catch(x){}}
    try{await sb.rpc('fam_echeances_run',{p_famille:c.id})}catch(x){}
    await chargerClientDetail(c.id);close();render();toast(renvoi?'Modifié : reçu corrigé envoyé':'Versement modifié');return}
  }catch(err){console.error(err);toast('Une erreur est survenue. Réessayez.')}},true);

/* Accueil doula : la carte « Paiements » mène à l'outil Paiements */
if(typeof dAccueil!=='undefined'){const _daPV=dAccueil;dAccueil=function(){const h=_daPV.apply(this,arguments);try{
  return String(h).replace('<div class="card"><span class="eyebrow acc">Paiements</span>','<div class="card" data-act="dgo" data-v="outils|paiements" style="cursor:pointer" role="button" tabindex="0"><div class="row between"><span class="eyebrow acc">Paiements</span><span class="xs muted">Voir les paiements '+icon('fa-chevron-right')+'</span></div>')}catch(e){return h}}}
