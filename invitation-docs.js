/* Sérénaissance — invitation d'une nouvelle famille avec ses documents (espace doula) :
   après la rencontre d'approche, la doula choisit les documents à joindre (lettre, forfaits et méthodes de paiement, contrat, formulaires).
   Tout est déposé dans l'appli de la famille. La lettre précise : si vous allez de l'avant, remplissez les documents; sinon, rien à faire. */
(function(){
if(window.ESPACE==='parent'||typeof inviteRendu!=='function'||typeof inviteEnvoyer!=='function')return;
const CHOIX=['merci','forfaits','contrat','accueil','consentement','photos'];
const PRESETS=[['approche','Après la rencontre d\'approche',['merci','forfaits','contrat','accueil','consentement','photos']],['forfaits','Seulement mes forfaits',['merci','forfaits']],['aucun','Invitation seulement',[]]];
const PS='Si vous souhaitez aller de l\'avant avec moi, vous n\'avez qu\'à remplir et signer les documents dans l\'appli (Ma doula › Documents) : je les recevrai et nous planifierons ensemble nos rencontres. Si vous ne souhaitez pas poursuivre, vous n\'avez rien à remplir, tout simplement, et je vous souhaite une belle suite.';
/* méthodes de paiement ajoutées à la lettre des forfaits */
window.paiementTexte=function(){try{const C=((ME_DOULA&&ME_DOULA.modeles)||{}).paiement||{};let t='\n\n## Comment me payer\n• Directement dans l\'appli : Ma doula › Forfait et paiements (versements, reçus et rappels).';
  if(C.interac)t+='\n• Par virement Interac à '+C.interac+(C.consigne?' ('+C.consigne+')':'')+'.';return t}catch(e){return ''}};
function etat(){const I=S.inv;if(!I.docs){I.docs={};PRESETS[0][2].forEach(k=>I.docs[k]=true);I.preset='approche';I.ps=true}return I}
const _ir=inviteRendu;inviteRendu=function(){_ir.apply(this,arguments);try{const I=etat(),sh=document.querySelector('#layer .sheet');if(!sh)return;const btn=sh.querySelector('[data-act="invEnvoyer"]');if(!btn)return;
  const items=ENVOI_ITEMS.filter(x=>CHOIX.includes(x[0]));
  const bloc=document.createElement('div');bloc.className='soft inv-docs';bloc.innerHTML='<span class="eyebrow acc">2. Documents à joindre</span><p class="xs muted" style="margin:2px 0 8px">Déposés dans son appli : elle les trouve dès son inscription. Ce sont vos documents de base (Outils › Mes modèles), remplis avec ses informations.</p>'+
    '<div class="seg">'+PRESETS.map(p=>'<button type="button" class="chip '+(I.preset===p[0]?'on':'')+'" data-inv-preset="'+p[0]+'">'+p[1]+'</button>').join('')+'</div>'+
    '<div class="stack" style="gap:6px;margin-top:8px">'+items.map(([k,t,ic,sous])=>'<label class="check" style="align-items:flex-start"><input type="checkbox" data-inv-doc="'+k+'" '+(I.docs[k]?'checked':'')+'><span>'+icon(ic,'var(--accent)')+' <b>'+(k==='merci'?'Ma lettre ci-dessus (bienvenue et merci pour la rencontre)':k==='forfaits'?'Mes forfaits en détail et mes méthodes de paiement':t)+'</b><br><span class="xs muted">'+(k==='merci'?'Déposée dans son appli':k==='forfaits'?'Prix tirés de vos Paramètres, avec Interac et le paiement dans l\'appli':sous)+'</span></span></label>').join('')+'</div>'+
    '<label class="check" style="margin-top:8px"><input type="checkbox" data-inv-ps="1" '+(I.ps?'checked':'')+'><span><b>Ajouter à ma lettre :</b> <span class="xs muted">(seulement si tu joins des documents)</span><br><span class="xs">« '+PS+' »</span></span></label>';
  btn.before(bloc);const dep=sh.querySelector('#invDepot');if(dep){const l=dep.closest('label');if(l)l.hidden=true}}catch(e){}};
function lire(){const I=S.inv;if(!I)return;document.querySelectorAll('[data-inv-doc]').forEach(c=>{I.docs[c.dataset.invDoc]=c.checked});const p=document.querySelector('[data-inv-ps]');if(p)I.ps=p.checked;const t=$('#invTxt');if(t)I.txt=t.value}
document.addEventListener('click',e=>{const b=e.target.closest('[data-inv-preset]');if(!b)return;e.stopPropagation();e.preventDefault();lire();const I=etat(),P=PRESETS.find(x=>x[0]===b.dataset.invPreset);I.preset=P[0];I.docs={};P[2].forEach(k=>I.docs[k]=true);if(P[0]==='aucun')I.ps=false;inviteRendu()},true);
document.addEventListener('change',e=>{if(e.target.closest&&e.target.closest('.inv-docs')){lire();if(S.inv){S.inv.preset='libre';document.querySelectorAll('[data-inv-preset]').forEach(x=>x.classList.remove('on'))}}});
function avecPS(txt){if(!S.inv.ps||!Object.values(S.inv.docs).some(Boolean))return txt;if(txt.includes('aller de l\'avant avec moi'))return txt;return txt.replace(/\s*$/,'')+'\n\nP.-S. '+PS}
/* envoi : on dépose d'abord les documents, puis on envoie le courriel d'invitation */
inviteEnvoyer=async function(b){lire();const I=etat(),c=S.clients.find(x=>x.id===I.fid);if(!String(I.txt||'').trim()){toast('Écrivez votre lettre');return}
  const sel=CHOIX.filter(k=>I.docs[k]);if((sel.includes('forfaits')||sel.includes('contrat'))&&!Object.keys(FORFAITS||{}).length){toast('Ajoutez d\'abord vos forfaits dans Paramètres');return}
  if(sel.includes('contrat')&&!sel.includes('merci'))sel.push('merci');
  const txt=avecPS(I.txt);b.disabled=true;b.textContent='Envoi…';
  try{if(sel.length){const fait=(CDOCS[c.id]||[]).filter(d=>d.statut!=='annule').map(d=>d.type);const lot=(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random()),ORD=['merci','fin','forfaits','contrat','accueil','consentement','photos','satisfaction'],titres=[];
      for(const k of ['photos','consentement','accueil','contrat','forfaits','merci']){if(!sel.includes(k)||fait.includes(k))continue;let row;
        if(LETTRES_TYPES[k])row={type:k,titre:k==='merci'?'Bienvenue et merci pour notre rencontre':LETTRES_TYPES[k],contenu:k==='merci'?txt:remplirModele(modeleTexte('lettre_forfaits'),c,{prixVivants:true}).replace(/\n+Au plaisir,/,paiementTexte()+'\n\nAu plaisir,'),champs:[],sig_parent_requise:false,sig_doula_requise:false,statut:'signe'};
        else{const T=DOC_TYPES[k];row={type:k,titre:T.titre,contenu:remplirModele(modeleTexte(k),c,{prixVivants:true}),champs:T.champs,sig_parent_requise:T.sigP,sig_doula_requise:T.sigD,statut:'a_remplir'}}
        if(k==='forfaits'&&!row.contenu.includes('Comment me payer'))row.contenu+=paiementTexte();
        Object.assign(row,{famille_id:c.id,silencieux:true,lot,lot_titre:'Votre pochette après notre rencontre',ordre:ORD.indexOf(k)});const {error}=await sb.from('fam_documents').insert(row);if(error)throw error;titres.unshift(row.titre)}
      if(titres.length)await sb.from('fam_messages').insert({famille_id:c.id,de_doula:true,type:'document',texte:'Merci pour notre rencontre ! Vos documents vous attendent dans l\'appli (Ma doula › Documents) :\n• '+titres.join('\n• ')+'\n\n'+PS})}
    close();const ok=await inviter(c.id,txt);if(ok){S.inv=null;await chargerClientDetail(c.id);S.ctab='docs';render();toast(sel.length?'Invitation et documents envoyés':'Invitation envoyée')}}
  catch(e){b.disabled=false;b.textContent='Réessayer';toast('Pas envoyé : '+(e.message||'erreur'))}};
})();
/* dossier d'une famille : onglets avec icônes, toujours visibles en haut, l'onglet actif centré */
(function(){if(window.ESPACE==='parent')return;const st=document.createElement('style');st.textContent=
 '.ctabs{position:sticky;top:calc(env(safe-area-inset-top,0px) + 64px);z-index:20;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:8px 4px;margin:0 -4px 14px;background:var(--bg,#f7efe9);border-radius:0 0 16px 16px}.ctabs::-webkit-scrollbar{display:none}'+
 '.ctabs button{flex:none;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:74px;padding:8px 10px;border:0;border-radius:14px;background:var(--card);color:var(--muted);font:600 .72rem var(--f-body);cursor:pointer;box-shadow:0 1px 3px rgba(70,45,30,.08)}.ctabs button i,.ctabs button svg{font-size:1.05rem}'+
 '.ctabs button.on{background:var(--accent);color:#fff}.parcours-acc summary .pill{margin-left:8px}';document.head.appendChild(st);
 const _r=render;render=function(){const x=_r.apply(this,arguments);try{const n=document.querySelector('.ctabs'),b=n&&n.querySelector('.on'),tp=document.querySelector('.top');if(n&&tp)n.style.top=tp.offsetHeight+'px';if(b)n.scrollLeft=b.offsetLeft-(n.clientWidth-b.offsetWidth)/2}catch(e){}return x}})();
