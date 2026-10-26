/* Sérénaissance — on n'entre pas dans l'appli sans ses informations de base.
   Après la première connexion (code par courriel), un écran obligatoire demande :
   - Famille : prénom, nom, région (et le code promo si elle en a un).
   - Doula : prénom, nom, téléphone, région (et le code promo).
   Ensuite seulement, l'accès est vérifié (abonnement, essai par code promo, ou doula abonnée pour la famille). */
(function(){
const REG={NB:'Nouveau-Brunswick',QC:'Québec',ON:'Ontario',NS:'Nouvelle-Écosse',PE:'Île-du-Prince-Édouard',NL:'Terre-Neuve-et-Labrador',MB:'Manitoba',SK:'Saskatchewan',AB:'Alberta',BC:'Colombie-Britannique',YT:'Yukon',NT:'Territoires du Nord-Ouest',NU:'Nunavut',FR:'France',US:'États-Unis'};
const sel=(id,v)=>'<select id="'+id+'"><option value="">Choisir…</option>'+Object.entries(REG).map(([k,n])=>'<option value="'+k+'"'+(v===k||v===n?' selected':'')+'>'+n+'</option>').join('')+'</select>';
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
      '<label class="f">Où habitez-vous ? *'+sel('prR',reg)+'</label><p class="xs muted" style="margin:-4px 0 0">Pour vous montrer le bon suivi, les vaccins et le soutien de votre région.</p>');
    o.querySelector('#prOk').onclick=async()=>{try{const pr=req('prP','Entrez votre prénom'),no=req('prN','Entrez votre nom'),rg=req('prR','Choisissez votre région');
      const b=o.querySelector('#prOk');b.disabled=true;
      p.prenom=pr;p.nom=no;p.region=rg;p.regionChoisie=true;p.vacRegion=rg;
      try{await sb.from('fam_familles').update({prenom:pr,nom:no}).eq('id',FAM.id)}catch(e){}FAM.prenom=pr;FAM.nom=no;
      try{await saveParent()}catch(e){}
      const c=(o.querySelector('#prCode').value||'').trim();o.remove();
      if(c&&window.cpAppliquer)await window.cpAppliquer(c);
      if(window.cpVerifierFamille)await window.cpVerifierFamille();render()}catch(e){}}}
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
