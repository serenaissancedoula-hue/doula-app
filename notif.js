/* Sérénaissance — notification dans l'appli de la famille : un message de la doula apparaît dans la cloche (et en push si activé). */
async function notifierFamille(famille,type,titre){try{if(type==='recu')return true;
  const t=type==='signe'?'Votre document « '+(titre||'')+' » est signé par votre doula. Vous le retrouvez dans vos Documents, et vous pouvez l\'enregistrer en PDF.':'Nouveau document de votre doula : « '+(titre||'')+' ». Vous le retrouvez dans vos Documents, et vous pouvez l\'enregistrer en PDF.';
  const {error}=await sb.from('fam_messages').insert({famille_id:famille,de_doula:true,texte:t});return !error}catch(e){return false}}
/* reçu d'abonnement de la doula */
const _pNo=pParametres;pParametres=function(){const h=_pNo();try{if(S.role!=='doula'||!ME_DOULA||!ME_DOULA.abonnement_recu)return h;
  const c='<div class="card"><span class="eyebrow acc">Mon reçu d\'abonnement</span><p class="small">Dernier paiement'+(ME_DOULA.abonnement_recu_le?' · '+new Date(ME_DOULA.abonnement_recu_le).toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'}):'')+'. Un reçu vous est aussi envoyé par courriel à chaque paiement.</p><a class="btn ghost" style="text-align:center;text-decoration:none" target="_blank" rel="noopener" href="'+esc(ME_DOULA.abonnement_recu)+'">'+icon('fa-receipt')+'Voir et télécharger mon reçu</a></div>';
  const i=h.lastIndexOf('<div class="card flat">');return i<0?h+c:h.slice(0,i)+c+h.slice(i)}catch(e){return h}};
/* partenaire : repère « Pour le partenaire » */
const estPart=d=>/^(Aide-mémoire : )?Pour le partenaire/.test(String(d&&d.titre||''));
const _dlN=docLigne;docLigne=function(d,doula){const h=_dlN(d,doula);return estPart(d)?h.replace(/(<b>[^<]*<\/b>)/,'$1<span class="pill gold" style="margin-left:6px">Pour le partenaire</span>'):h};
