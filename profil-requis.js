/* Sérénaissance — on n'entre pas dans l'appli sans ses informations de base.
   Après la première connexion (code par courriel), un écran obligatoire demande :
   - Famille : prénom, nom, région (et le code promo si elle en a un).
   - Doula : prénom, nom, téléphone, région (et le code promo).
   Ensuite seulement, l'accès est vérifié (abonnement, essai par code promo, ou doula abonnée pour la famille). */
(function(){
const REG={NB:'Nouveau-Brunswick',QC:'Québec',ON:'Ontario',NS:'Nouvelle-Écosse',PE:'Île-du-Prince-Édouard',NL:'Terre-Neuve-et-Labrador',MB:'Manitoba',SK:'Saskatchewan',AB:'Alberta',BC:'Colombie-Britannique',YT:'Yukon',NT:'Territoires du Nord-Ouest',NU:'Nunavut',FR:'France',US:'États-Unis'};
const sel=(id,v)=>'<select id="'+id+'"><option value="">Choisir…</option>'+Object.entries(REG).map(([k,n])=>'<option value="'+k+'"'+(v===k||v===n?' selected':'')+'>'+n+'</option>').join('')+'<optgroup label="Autres pays">'+(window.PAYS_MONDE||[]).map(p=>'<option value="'+p[0]+'"'+(v===p[0]?' selected':'')+'>'+p[1]+'</option>').join('')+'</optgroup></select>';
const code=()=>{try{return localStorage.getItem('sere-code-promo')||''}catch(e){return ''}};
const vide=v=>!v||!String(v).trim()||String(v).trim()==='Exemple';
function ecran(titre,txt,champs){document.getElementById('profilReq')?.remove();const o=document.createElement('div');o.id='profilReq';
  o.style.cssText='position:fixed;inset:0;z-index:99996;background:var(--bg,#faf5ef);overflow:auto;display:flex;justify-content:center;padding:28px 18px';
  o.innerHTML='<div style="width:100%;max-width:420px;display:flex;flex-direction:column;gap:10px"><div style="text-align:center;font-size:40px">🌸</div><h2 style="margin:0;text-align:center">'+titre+'</h2><p class="small" style="text-align:center;margin:0 0 6px">'+txt+'</p>'+champs+
   '<label class="f">Code promo (si vous en avez un)<input id="prCode" autocapitalize="characters" autocomplete="off" value="'+esc(code())+'" style="text-transform:uppercase"></label>'+
   '<button class="btn" id="prOk" style="width:100%">Continuer</button><button class="btn sm ghost" data-act="deconnexion">Me déconnecter</button></div>';
  document.body.appendChild(o);return o}
const req=(id,lab)=>{const el=document.getElementById(id);const v=(el&&el.value||'').trim();if(!v){toast(lab);el&&el.focus();throw 0}return v};
/* ---------- famille ---------- */
if(window.ESPACE==='parent'&&typeof chargerParent==='function'){const _cp=chargerParent;chargerParent=async function(){const r=await _cp.apply(this,arguments);try{verifierF()}catch(e){}return r};
  function verifierF(){if(!FAM||!S.parent)return;const p=S.parent;const reg=(window.maRegion&&window.maRegion())||'';
    if(!vide(FAM.prenom)&&!vide(FAM.nom)&&reg)return;
    const o=ecran('Bienvenue !','Quelques informations pour créer votre espace. Elles restent privées.',
      '<div class="grid2"><label class="f">Prénom *<input id="prP" autocomplete="given-name" value="'+esc(vide(FAM.prenom)?(vide(p.prenom)?'':p.prenom):FAM.prenom)+'"></label><label class="f">Nom *<input id="prN" autocomplete="family-name" value="'+esc(FAM.nom||'')+'"></label></div>'+
      '<label class="f">Où habitez-vous ? *'+sel('prR',reg)+'</label><label class="f">Ville (facultatif)<input id="prV" autocomplete="address-level2" value="'+esc(p.ville||'')+'"></label>'+'<div id="prEnf" style="display:grid;gap:8px"><b class="small">Vos autres enfants (facultatif)</b><p class="xs muted" style="margin:0">Si vous avez déjà des enfants, ajoutez-les : vous pourrez suivre leur développement jusqu\'à 5 ans.</p><div class="prEn" style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><input class="prEp" placeholder="Prénom" aria-label="Prénom de l\'enfant"><input class="prEd" type="date" max="'+iso(new Date())+'" aria-label="Date de naissance"></div><button type="button" class="btn sm ghost" id="prEnAdd">+ Ajouter un autre enfant</button></div>'+'<p class="xs muted" style="margin:-4px 0 0">Pour vous montrer le bon suivi, les vaccins et le soutien de votre région.</p>');
    const ad=o.querySelector('#prEnAdd');if(ad)ad.onclick=()=>{const r=o.querySelector('.prEn').cloneNode(true);r.querySelectorAll('input').forEach(i=>i.value='');ad.before(r)};
    o.querySelector('#prOk').onclick=async()=>{try{const pr=req('prP','Entrez votre prénom'),no=req('prN','Entrez votre nom'),rg=req('prR','Choisissez votre région');
      const b=o.querySelector('#prOk');b.disabled=true;
      p.prenom=pr;p.nom=no;p.region=rg;
      try{const liste=[...o.querySelectorAll('.prEn')].map(r=>({prenom:(r.querySelector('.prEp').value||'').trim(),date:r.querySelector('.prEd').value||''})).filter(x=>x.prenom||x.date);
        if(liste.length){p.enfants=Array.isArray(p.enfants)?p.enfants:[];liste.forEach(x=>{if(!p.enfants.some(e=>e&&e.prenom===x.prenom&&e.date===x.date))p.enfants.push({prenom:x.prenom,date:x.date,sexe:'',notes:''})})}}catch(e){}p.ville=((o.querySelector('#prV')||{}).value||'').trim();p.regionChoisie=true;p.vacRegion=rg;
      try{await sb.from('fam_familles').update({prenom:pr,nom:no}).eq('id',FAM.id)}catch(e){}FAM.prenom=pr;FAM.nom=no;
      try{await saveParent()}catch(e){}
      const c=(o.querySelector('#prCode').value||'').trim();o.remove();
      if(c&&window.cpAppliquer)await window.cpAppliquer(c);
      if(window.cpVerifierFamille)await window.cpVerifierFamille();render()}catch(e){}}}
  window.verifierProfilFamille=verifierF;
}
/* ---------- doula ---------- */
if(window.ESPACE!=='parent'&&typeof chargerDoula==='function'){const _cd=chargerDoula;chargerDoula=async function(){const r=await _cd.apply(this,arguments);try{verifierD()}catch(e){}return r};
  function verifierD(){const D=ME_DOULA;if(!D||(typeof MOI!=='undefined'&&MOI&&MOI.admin))return;
    if(!vide(D.prenom)&&!vide(D.nom)&&!vide(D.telephone)&&!vide(D.region))return;
    const o=ecran('Bienvenue dans votre Espace Doula','Ces informations apparaissent sur vos documents et pour vos familles.',
      '<div class="grid2"><label class="f">Prénom *<input id="prP" autocomplete="given-name" value="'+esc(D.prenom||'')+'"></label><label class="f">Nom *<input id="prN" autocomplete="family-name" value="'+esc(D.nom||'')+'"></label></div>'+
      '<label class="f">Téléphone *<input id="prT" type="tel" autocomplete="tel" value="'+esc(D.telephone||'')+'" placeholder="506 555-1234"></label>'+
      '<label class="f">Province ou pays *'+sel('prR',D.region||'')+'</label>');
    o.querySelector('#prOk').onclick=async()=>{try{const pr=req('prP','Entrez votre prénom'),no=req('prN','Entrez votre nom'),te=req('prT','Entrez votre téléphone'),rg=req('prR','Choisissez votre province ou pays');
      if(te.replace(/\D/g,'').length<10){toast('Numéro de téléphone incomplet');return}
      const b=o.querySelector('#prOk');b.disabled=true;
      const {error}=await sb.from('fam_doulas').update({prenom:pr,nom:no,telephone:te,region:REG[rg]||rg}).eq('id',D.id);
      if(error){b.disabled=false;toast('Pas enregistré : '+error.message);return}
      const c=(o.querySelector('#prCode').value||'').trim();o.remove();
      if(c&&window.cpAppliquer)await window.cpAppliquer(c);
      await _cd();render()}catch(e){}}}
}
})();
