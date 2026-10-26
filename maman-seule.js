/* Sérénaissance — maman sans doula (espace autonome), jumelage avec une doula, « Mon compte » : déconnexion et suppression. */
(function(){'use strict';
const P=window.ESPACE==='parent';
/* ---- Ma doula : pas encore de doula ---- */
if(P&&typeof pMaDoula==='function'){const _m=pMaDoula;pMaDoula=function(){
  if(typeof FAM!=='undefined'&&FAM&&!FAM.doula_id)return sh('Ma doula','Trouvez la doula qui vous accompagnera')+
   '<div class="card"><span class="eyebrow acc">Pas encore de doula</span><p class="small">Votre espace est déjà prêt : suivi de grossesse, journal, bilan du moral, bébé après la naissance… Quand vous trouverez votre doula, donnez-lui <b>le courriel de votre compte</b> ('+esc((typeof MOI!=='undefined'&&MOI&&MOI.courriel)||'')+'). Elle vous ajoute, et vos deux espaces se jumellent : <b>rien de ce que vous avez noté n’est effacé</b>.</p></div>'+(window.anDansApp?window.anDansApp():'<button class="btn" data-act="mcCherche">'+icon('fa-magnifying-glass')+'Trouver ma doula</button>');
  return _m.apply(this,arguments)}}
/* ---- Avis de jumelage (une fois) ---- */
function jumelage(){try{if(!P||!FAM||!FAM.doula_id||!S.parent.jumelage||S.parent.jumelage.vu||document.querySelector('#layer .sheet'))return;
  const j=S.parent.jumelage;j.vu=true;try{save()}catch(e){}
  sheet('Votre doula vous a ajoutée 🤝','<div class="stack" style="gap:10px"><p class="small"><b>'+esc(j.doula||'Votre doula')+'</b> vous accompagne maintenant dans l’appli.</p><p class="small">Tout ce que vous aviez déjà noté est <b>conservé</b>. Votre doula voit votre suivi (grossesse, bébé, journal du moral) pour mieux vous accompagner. Vous pouvez lui écrire dans l’onglet « Ma doula ».</p><button class="btn" data-act="closeSheet">Merci</button></div>')}catch(e){}}
if(P){const _r=render;render=function(){const x=_r.apply(this,arguments);try{jumelage()}catch(e){}return x}}
/* ---- Mon compte : déconnexion et suppression ---- */
const carte=()=>'<div class="card"><span class="eyebrow acc">Mon compte</span><div class="stack" style="gap:8px"><button class="btn ghost" data-act="deconnexion">'+icon('fa-right-from-bracket')+'Me déconnecter</button><button class="btn sm danger" data-act="cptSuppr">'+icon('fa-trash')+'Supprimer mon compte</button></div></div>';
if(typeof pParametres==='function'){const _pp=pParametres;pParametres=function(){let h=_pp.apply(this,arguments);try{const k='<div class="card flat"><div class="row"><button class="btn sm ghost" data-act="params">';const i=h.indexOf(k);if(i>=0)h=h.slice(0,i)+carte()+h.slice(i);else h+=carte();h=h.replace(/<button class="btn sm danger" data-act="deconnexion">[^<]*(?:<[^>]*>[^<]*)*?Me déconnecter<\/button>(?=<\/div><p class="xs muted">)/,'')}catch(e){}return h};}
function texteSuppr(){if(!P)return '<p class="small">Votre accès de doula sera fermé et vos familles seront <b>archivées</b> (leurs dossiers sont conservés au moins un an, comme prévu à vos conditions). Si vous avez un abonnement payant, annulez-le d’abord dans Paramètres.</p>';
  if(typeof FAM!=='undefined'&&FAM&&FAM.doula_id)return '<p class="small">Votre accès sera fermé. Votre dossier reste chez votre doula, qui doit le conserver (contrat, paiements) pendant la durée prévue. Votre doula n’aura plus accès à votre espace en direct.</p>';
  return '<p class="small">Votre espace, votre journal, votre suivi et vos données seront <b>supprimés définitivement</b>. Il n’y a aucun moyen de les récupérer.</p>'}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act="cptSuppr"],[data-act="cptSupprOk"],[data-act="mcCherche"]');if(!b)return;e.stopPropagation();e.preventDefault();const a=b.dataset.act;
  if(a==='mcCherche'){S.vue=null;S.tab='madoula';render();scrollTo(0,0);return}
  if(a==='cptSuppr'){sheet('Supprimer mon compte','<div class="stack" style="gap:10px">'+texteSuppr()+'<label class="f">Pour confirmer, écrivez SUPPRIMER<input type="text" id="cptTxt" autocomplete="off" autocapitalize="characters"></label><button class="btn danger" data-act="cptSupprOk">'+icon('fa-trash')+'Supprimer définitivement</button><button class="btn ghost" data-act="closeSheet">Annuler</button></div>');return}
  if(a==='cptSupprOk'){if(($('#cptTxt').value||'').trim().toUpperCase()!=='SUPPRIMER'){toast('Écrivez SUPPRIMER pour confirmer');return}
    b.disabled=true;const {error}=await sb.rpc('fam_supprimer_mon_compte');
    if(error){b.disabled=false;toast(/function|schema cache|PGRST202/i.test(error.message||'')?'La suppression n’est pas encore disponible. Écrivez à Sabrina.':(error.message||'Pas supprimé'));return}
    try{Object.keys(localStorage).filter(k=>/^(sere|an-)/.test(k)).forEach(k=>localStorage.removeItem(k))}catch(x){}
    try{await Promise.race([sb.auth.signOut({scope:'local'}),new Promise(r=>setTimeout(r,2500))])}catch(x){}
    close();document.body.innerHTML='<div class="card" style="max-width:480px;margin:40px auto"><span class="script">Au revoir</span><h2>Votre compte est supprimé</h2><p class="small">Merci d’avoir utilisé Sérénaissance. Vous pouvez fermer cette page.</p></div>'}},true);
/* retour depuis « Trouver ma doula » */
if(P&&typeof ecranChercheuse==='function'){const _ec=ecranChercheuse;ecranChercheuse=async function(){await _ec.apply(this,arguments);try{if(typeof FAM!=='undefined'&&FAM&&S.retourEspace){const r=document.querySelector('#app > div');if(r&&!r.querySelector('[data-act="mcRetour"]'))r.insertAdjacentHTML('afterbegin','<button class="btn sm ghost" data-act="mcRetour" style="align-self:flex-start">'+icon('fa-arrow-left')+'Retour à mon espace</button>')}}catch(e){}}
  document.addEventListener('click',e=>{const b=e.target.closest('[data-act="mcRetour"]');if(!b)return;e.stopPropagation();e.preventDefault();S.retourEspace=false;S.vueCx='connexion';S.tab='madoula';render()},true)}
})();
