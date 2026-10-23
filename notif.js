/* Sérénaissance — courriel à la famille (via la fonction fam-notifier, envoyée depuis le Gmail de la doula). Silencieux si la fonction n'est pas encore en place. */
async function notifierFamille(famille,type,titre){try{const {data}=await sb.functions.invoke('fam-notifier',{body:{famille,type,titre:titre||null}});return !!(data&&data.ok)}catch(e){return false}}
/* reçu d'abonnement de la doula */
const _pNo=pParametres;pParametres=function(){const h=_pNo();try{if(S.role!=='doula'||!ME_DOULA||!ME_DOULA.abonnement_recu)return h;
  const c='<div class="card"><span class="eyebrow acc">Mon reçu d\'abonnement</span><p class="small">Dernier paiement'+(ME_DOULA.abonnement_recu_le?' · '+new Date(ME_DOULA.abonnement_recu_le).toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'}):'')+'. Un reçu vous est aussi envoyé par courriel à chaque paiement.</p><a class="btn ghost" style="text-align:center;text-decoration:none" target="_blank" rel="noopener" href="'+esc(ME_DOULA.abonnement_recu)+'">'+icon('fa-receipt')+'Voir et télécharger mon reçu</a></div>';
  const i=h.lastIndexOf('<div class="card flat">');return i<0?h+c:h.slice(0,i)+c+h.slice(i)}catch(e){return h}};
/* partenaire : repère « Pour le partenaire » */
const estPart=d=>/^(Aide-mémoire : )?Pour le partenaire/.test(String(d&&d.titre||''));
const _dlN=docLigne;docLigne=function(d,doula){const h=_dlN(d,doula);return estPart(d)?h.replace(/(<b>[^<]*<\/b>)/,'$1<span class="pill gold" style="margin-left:6px">Pour le partenaire</span>'):h};
