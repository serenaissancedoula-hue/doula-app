/* Sérénaissance — abonnement des doulas : 6 mois gratuits dès l'inscription, puis 8 $/mois ou 90 $/an (paiement Stripe, hors des boutiques d'applis).
   Le statut vient de fam_doulas (rempli par le webhook Stripe). La propriétaire n'est jamais suspendue. */
if(window.ESPACE==='doula'){
const ABO_LIENS={mensuel:'https://buy.stripe.com/aFabIUaPC7J6doM7jsffy0m',annuel:'https://buy.stripe.com/3cI8wI4regfCgAY47gffy0n'};
const aboLien=k=>ABO_LIENS[k]+'?client_reference_id='+encodeURIComponent(ME_DOULA.id)+'&prefilled_email='+encodeURIComponent(ME_DOULA.courriel||'');
function aboStatut(){const D=ME_DOULA;if(!D)return {ok:true,type:'inconnu'};
  if(MOI&&MOI.admin)return {ok:true,type:'proprio'};
  if(D.acces_gratuit)return {ok:true,type:'offert'};
  if(D.abonnement_statut==='actif'||D.abonnement_statut==='impaye')return {ok:true,type:'abonnee',fin:D.abonnement_fin};
  if(D.essai_fin){const fin=new Date(D.essai_fin),jours=Math.ceil((fin-Date.now())/864e5);return jours>0?{ok:true,type:'essai',jours,fin}:{ok:false,type:'expire',fin}}
  if(D.essai_gratuit===false)return {ok:false,type:'sansEssai'};
  const debut=new Date(D.created_at||Date.now()),fin=new Date(debut);fin.setMonth(fin.getMonth()+6);
  const jours=Math.ceil((fin-Date.now())/864e5);
  return jours>0?{ok:true,type:'essai',jours,fin}:{ok:false,type:'expire',fin}}
const aboBoutons=()=>'<a class="btn" style="width:100%;text-align:center;margin:6px 0;text-decoration:none" target="_blank" rel="noopener" href="'+aboLien('mensuel')+'">8 $ par mois</a><a class="btn ghost" style="width:100%;text-align:center;margin:6px 0;text-decoration:none" target="_blank" rel="noopener" href="'+aboLien('annuel')+'">90 $ par an <span class="xs">(économisez 6 $)</span></a><p class="xs muted">Taxes en sus. Paiement sécurisé par Stripe. Annulable en tout temps.</p>';
function aboVerifier(){['ecranAbo','bandeauAbo'].forEach(i=>document.getElementById(i)?.remove());
  const s=aboStatut();if(s.ok&&s.type==='essai'&&s.jours<=30){const b=document.createElement('div');b.id='bandeauAbo';b.className='bandeau-maj';
    b.innerHTML='<span>Il vous reste <b>'+s.jours+' jour'+(s.jours>1?'s':'')+'</b> gratuits : votre 7e mois commence le '+new Date(s.fin).toLocaleDateString('fr-CA',{day:'numeric',month:'long'})+'.</span><button class="btn sm" data-act="aboVoir">S\'abonner</button>';document.body.appendChild(b);return}
  if(s.ok)return;
  const o=document.createElement('div');o.id='ecranAbo';o.style.cssText='position:fixed;inset:0;z-index:99990;background:var(--bg,#faf5ef);overflow:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;gap:10px';
  o.innerHTML='<div style="font-size:44px">🌿</div>'+(s.type==='sansEssai'?'<h2 style="margin:0">Bienvenue ! Choisissez votre abonnement</h2><p style="max-width:340px" class="small">Votre compte est créé. Pour ouvrir votre Espace Doula, choisissez l\'offre qui vous convient, ou entrez le code promo reçu. Vous pouvez annuler en tout temps.</p>':'<h2 style="margin:0">Votre essai gratuit est terminé</h2><p style="max-width:340px" class="small">Merci d\'avoir testé l\'appli. Pour continuer à l\'utiliser, choisissez un abonnement. <b>Vos données sont gardées</b> : tout revient dès le paiement.</p>')+'<div style="width:100%;max-width:340px">'+aboBoutons()+'</div><button class="btn sm ghost" data-act="aboRecharger">J\'ai payé : vérifier</button><button class="btn sm ghost" data-act="deconnexion">Me déconnecter</button>';
  document.body.appendChild(o)}
const _cdAbo=chargerDoula;chargerDoula=async function(){await _cdAbo.apply(this,arguments);try{aboVerifier()}catch(e){}};
const _pAbo=pParametres;pParametres=function(){const h=_pAbo();if(S.role!=='doula')return h;const s=aboStatut();
  const t=s.type==='proprio'?'Propriétaire : accès complet.'+(ME_DOULA.abonnement_statut==='actif'?' ✅ Paiement Stripe reçu (test réussi).':''):s.type==='offert'?'Accès offert par Sabrina.':s.type==='abonnee'?'Abonnement actif'+(s.fin?' · renouvelé jusqu\'au '+new Date(s.fin).toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'}):'')+'.':s.type==='essai'?'Essai gratuit : encore '+s.jours+' jours (jusqu\'au '+new Date(s.fin).toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'})+').':s.type==='sansEssai'?'Abonnement requis.':'Essai terminé.';
  const carte='<div class="card"><span class="eyebrow acc">Mon abonnement</span><p class="small">'+t+'</p>'+(s.type==='essai'||s.type==='expire'||s.type==='sansEssai'||s.type==='proprio'?aboBoutons():'')+'</div>';
  const i=h.lastIndexOf('<div class="card flat">');return i<0?h+carte:h.slice(0,i)+carte+h.slice(i)};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b)return;
  if(b.dataset.act==='aboVoir'){S.vue='params';try{render()}catch(x){}}
  else if(b.dataset.act==='aboRecharger'){b.disabled=true;await chargerDoula();b.disabled=false;if(document.getElementById('ecranAbo'))toast('Paiement pas encore reçu. Réessayez dans une minute.')}});
}
