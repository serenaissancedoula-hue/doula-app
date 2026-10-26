/* Sérénaissance — codes promo (6 mois gratuits) et abonnement des mamans.
   - Le lien envoyé peut contenir le code : …/doula-app/?code=DOULA6MOIS ou …/parents/?code=MAMAN6MOIS. Il est gardé jusqu'à la connexion.
   - Un champ « Code promo » apparaît à l'inscription; le code est appliqué dès que le compte est ouvert (fam_utiliser_coupon).
   - Chaque code a un nombre d'utilisations limité (10) et n'est valide que pour son espace (doula ou maman).
   - Famille : gratuite si sa doula est abonnée (ou en essai). Sinon : essai avec code, puis 4 $/mois ou 40 $/an.
   - Au 6e mois : bandeau + message « votre 7e mois commence le … ». À la fin : écran d'abonnement (les données sont gardées). */
(function(){
const CLE='sere-code-promo';
const lire=()=>{try{return localStorage.getItem(CLE)||''}catch(e){return ''}};
const garder=v=>{try{v?localStorage.setItem(CLE,v.trim().toUpperCase()):localStorage.removeItem(CLE)}catch(e){}};
const fdl=d=>new Date(d).toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'});
/* 1. code dans le lien */
try{const u=new URL(location.href),c=u.searchParams.get('code')||(location.hash.match(/code=([\w-]+)/)||[])[1];if(c){garder(c);u.searchParams.delete('code');history.replaceState(null,'',u.pathname+u.search+(location.hash.replace(/#?code=[\w-]+/,'')||''))}}catch(e){}
/* 2. champ à l'inscription (doula : #sCourriel; maman : #fCourriel ou formulaire d'inscription famille) */
function champ(){['sCourriel','fCourriel','anCourriel'].forEach(id=>{const i=document.getElementById(id);if(!i||document.getElementById('cpCode_'+id))return;const l=i.closest('label')||i;
  const t=document.createElement('label');t.className='f';t.innerHTML='Code promo (facultatif)<input id="cpCode_'+id+'" class="cp-code" autocapitalize="characters" autocomplete="off" placeholder="Ex. : '+(window.ESPACE==='parent'?'MAMAN6MOIS':'DOULA6MOIS')+'">';l.after(t);const c=t.querySelector('input');c.value=lire();c.addEventListener('input',()=>garder(c.value))})}
new MutationObserver(()=>{try{champ()}catch(e){}}).observe(document.documentElement,{childList:true,subtree:true});
/* 3. appliquer le code une fois connectée */
async function appliquer(){const c=lire();if(!c||typeof sb==='undefined')return null;
  try{const {data,error}=await sb.rpc('fam_utiliser_coupon',{p_code:c});if(error)return null;
    if(data&&data.ok){garder('');toast('Code promo accepté 🎁 '+data.mois+' mois gratuits, jusqu\'au '+fdl(data.fin));return data}
    if(data&&data.msg){if(/déjà été utilisé pour ce compte|réservé/.test(data.msg))garder('');toast(data.msg)}}catch(e){}return null}
window.cpAppliquer=async function(code){if(code)garder(code);return appliquer()};
const fenetre=(id,html)=>{if(document.getElementById(id))return;const o=document.createElement('div');o.id=id;o.className='cp-pop';o.innerHTML='<div class="cp-fond"></div><div class="cp-boite">'+html+'<button class="btn" data-cp-ok="1" style="width:100%;margin-top:10px">OK</button></div>';document.body.appendChild(o);o.querySelector('[data-cp-ok]').onclick=()=>o.remove()};
/* rappel au 6e mois, une seule fois */
function rappel7(fin,cle,boutonHtml){const j=Math.ceil((new Date(fin)-Date.now())/864e5);if(j>30||j<=0)return;const k='sere-rappel7-'+cle+'-'+String(fin).slice(0,10);try{if(localStorage.getItem(k))return;localStorage.setItem(k,'1')}catch(e){}
  setTimeout(()=>fenetre('cpRappel','<div style="font-size:40px">🌿</div><h2 style="margin:0">Votre 6e mois gratuit est commencé</h2><p class="small">Votre <b>7e mois commence le '+fdl(fin)+'</b>. Pour continuer sans interruption, choisissez votre abonnement d\'ici là. Vos données restent toujours gardées.</p>'+boutonHtml),1500)}
/* =============== ESPACE DOULA =============== */
if(window.ESPACE!=='parent'){
  if(typeof chargerDoula==='function'){const _cd=chargerDoula;chargerDoula=async function(){await _cd.apply(this,arguments);try{if(lire()&&ME_DOULA&&!(MOI&&MOI.admin)){const r=await appliquer();if(r){await _cd.apply(this,arguments)}}
      const D=ME_DOULA||{};if(D.essai_fin&&!D.acces_gratuit&&!['actif','impaye'].includes(D.abonnement_statut)&&!(MOI&&MOI.admin))rappel7(D.essai_fin,'d'+D.id,'<button class="btn ghost" data-act="aboVoir" style="width:100%" onclick="this.closest(\'.cp-pop\').remove()">Voir les abonnements</button>')}catch(e){}}}
  /* code promo sur l'écran d'abonnement */
  new MutationObserver(()=>{const o=document.getElementById('ecranAbo');if(!o||o.querySelector('.cp-zone'))return;const z=document.createElement('div');z.className='cp-zone';z.style.cssText='width:100%;max-width:340px';
    z.innerHTML='<details><summary class="small" style="cursor:pointer;color:var(--accent);font-weight:600">J\'ai un code promo</summary><div class="row" style="gap:6px;margin-top:6px"><input id="cpAbo" placeholder="Code" autocapitalize="characters" style="flex:1"><button class="btn sm" data-cp-abo="1">Valider</button></div></details>';
    const ref=o.querySelector('[data-act="aboRecharger"]');if(ref)ref.before(z);else o.appendChild(z)}).observe(document.body,{childList:true});
  document.addEventListener('click',async e=>{if(!e.target.closest('[data-cp-abo]'))return;const v=(document.getElementById('cpAbo').value||'').trim();if(!v){toast('Entrez votre code');return}garder(v);const r=await appliquer();if(r&&typeof chargerDoula==='function')await chargerDoula()});
  /* propriétaire : suivi des codes */
  if(typeof pParametres==='function'){const _pp=pParametres;pParametres=function(){const h=_pp.apply(this,arguments);try{if(S.role==='doula'&&MOI&&MOI.admin)return h+'<div class="card" id="cpAdmin"><span class="eyebrow acc">Codes promo</span><div id="cpListe"><p class="small muted">Chargement…</p></div>'+
      '<details style="margin-top:8px"><summary class="small" style="cursor:pointer;color:var(--accent);font-weight:600">Créer un code</summary><div class="grid2" style="margin-top:6px"><label class="f">Code<input id="cpN" autocapitalize="characters" placeholder="Ex. : PRINTEMPS"></label><label class="f">Pour<select id="cpP"><option value="doula">Doulas</option><option value="famille">Mamans</option></select></label><label class="f">Mois gratuits<input id="cpM" type="number" min="1" max="24" value="6"></label><label class="f">Nombre d\'utilisations<input id="cpX" type="number" min="1" max="1000" value="10"></label></div><button class="btn sm" data-cp-creer="1">Créer</button></details></div>'}catch(e){}return h}}
  async function listeAdmin(){const el=document.getElementById('cpListe');if(!el||el.dataset.ok)return;el.dataset.ok='1';
    const [{data:C,error},{data:U},{data:FM},{data:DT}]=await Promise.all([sb.from('fam_coupons').select('*').order('created_at'),sb.from('fam_coupons_util').select('*').order('le',{ascending:false}),sb.from('fam_familles').select('id,prenom,nom,doula_id,test'),sb.from('fam_doulas').select('id,test')]);
    /* une maman ajoutée par une doula prend une place maman, en plus de la place de la doula (sans compter deux fois celles qui ont aussi utilisé le code) */
    const dejaC=new Set((U||[]).map(x=>x.compte)),viaDoula=(FM||[]).filter(f=>f.doula_id&&!f.test&&!dejaC.has(f.id));
    if(error){el.innerHTML='<p class="small muted">Les codes promo ne sont pas encore installés (fichier mise-a-jour.sql à coller dans Supabase).</p>';return}
    const base=location.origin+location.pathname.replace(/parents\/?$/,'').replace(/[^/]*$/,'');
    el.innerHTML=(C||[]).map(c=>{const u=(U||[]).filter(x=>x.code===c.code),lien=base+(c.pour==='famille'?'parents/':'')+'?code='+encodeURIComponent(c.code);
      return '<div class="soft" style="margin:6px 0;gap:4px"><div class="row between"><b>'+esc(c.code)+'</b><span class="pill '+(c.actif?'sage':'line')+'">'+(c.pour==='doula'?'Doulas':'Mamans')+' · '+(c.utilisations+(c.pour==='famille'?viaDoula.length:0))+' / '+c.max_utilisations+'</span></div><span class="xs muted">'+c.mois+' mois gratuits'+(c.actif?'':' · désactivé')+'</span>'+
      (c.pour==='famille'&&viaDoula.length?'<span class="xs">Ajoutées par une doula (comptent aussi comme place maman) : '+viaDoula.map(f=>esc([f.prenom,f.nom].filter(Boolean).join(' ')||'Sans nom')).join(', ')+'</span>':'')+
      (u.length?'<span class="xs">'+u.map(x=>esc(x.nom||'Sans nom')+' ('+new Date(x.le).toLocaleDateString('fr-CA',{day:'numeric',month:'short'})+')').join(', ')+'</span>':'')+
      '<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:4px"><button class="btn sm ghost" data-cp-copie="'+esc(lien)+'">Copier le lien avec le code</button><button class="btn sm ghost" data-cp-actif="'+esc(c.code)+'" data-v="'+(c.actif?0:1)+'">'+(c.actif?'Désactiver':'Réactiver')+'</button></div></div>'}).join('')||'<p class="small muted">Aucun code.</p>'}
  new MutationObserver(()=>{if(document.getElementById('cpListe'))listeAdmin()}).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',async e=>{let b;
    if(b=e.target.closest('[data-cp-copie]')){const t=b.dataset.cpCopie;try{await navigator.clipboard.writeText(t);toast('Lien copié : collez-le dans votre message')}catch(x){prompt('Copiez le lien :',t)}return}
    if(b=e.target.closest('[data-cp-actif]')){await sb.from('fam_coupons').update({actif:b.dataset.v==='1'}).eq('code',b.dataset.cpActif);const el=document.getElementById('cpListe');if(el)delete el.dataset.ok;listeAdmin();return}
    if(e.target.closest('[data-cp-creer]')){const code=(document.getElementById('cpN').value||'').trim().toUpperCase().replace(/[^A-Z0-9-]/g,'');if(code.length<4){toast('Code d\'au moins 4 lettres ou chiffres');return}
      const {error}=await sb.from('fam_coupons').insert({code,pour:document.getElementById('cpP').value,mois:Math.max(1,Math.min(24,+document.getElementById('cpM').value||6)),max_utilisations:Math.max(1,+document.getElementById('cpX').value||10)});
      if(error){toast(/duplicate/.test(error.message)?'Ce code existe déjà':error.message);return}toast('Code créé');const el=document.getElementById('cpListe');if(el)delete el.dataset.ok;listeAdmin()}});
}
/* =============== ESPACE FAMILLE =============== */
if(window.ESPACE==='parent'){
  const LIENS={mensuel:'https://buy.stripe.com/3cIfZa2j63sQ98w1Z8ffy0t',annuel:'https://buy.stripe.com/00w28k7Dq3sQgAY5bkffy0u'};
  const lien=k=>((PRIX.info('maman').liens||{})[k]||LIENS[k])+'?client_reference_id='+encodeURIComponent((FAM&&FAM.id)||'')+'&prefilled_email='+encodeURIComponent((FAM&&FAM.courriel)||'');
  const boutons=()=>{const pI=PRIX.info('maman');return '<a class="btn" style="width:100%;text-align:center;margin:6px 0;text-decoration:none" target="_blank" rel="noopener" href="'+lien('mensuel')+'">'+pI.fmt(pI.p.m)+' par mois</a><a class="btn ghost" style="width:100%;text-align:center;margin:6px 0;text-decoration:none" target="_blank" rel="noopener" href="'+lien('annuel')+'">'+pI.fmt(pI.p.a)+' par année <span class="xs">(économisez '+pI.fmt(pI.p.e)+')</span></a><p class="xs muted">'+(pI.reg==='CA'?'Taxes en sus':'Taxes éventuelles en sus')+'. Paiement sécurisé par Stripe. Annulable en tout temps.'+(pI.note?' '+pI.note:'')+'</p>';}
  window.cpBoutonsFamille=boutons;
  let ACC=null;
  async function verifier(){if(!FAM||typeof sb==='undefined')return;
    if(lire()){await appliquer()}
    try{const {data,error}=await sb.rpc('fam_acces_famille');if(error)return;ACC=data}catch(e){return}
    document.getElementById('ecranAboF')?.remove();document.getElementById('bandeauAboF')?.remove();
    if(!ACC)return;
    if(ACC.ok&&ACC.type==='essai'){const j=Math.ceil((new Date(ACC.fin)-Date.now())/864e5);if(j<=30){const b=document.createElement('div');b.id='bandeauAboF';b.className='bandeau-maj';b.innerHTML='<span>Votre 7e mois commence dans <b>'+j+' jour'+(j>1?'s':'')+'</b>.</span><button class="btn sm" data-cp-voir="1">S\'abonner</button>';document.body.appendChild(b);
      rappel7(ACC.fin,'f'+FAM.id,'<button class="btn ghost" style="width:100%" data-cp-voir="1">Voir les abonnements</button>')}return}
    if(ACC.ok)return;
    const o=document.createElement('div');o.id='ecranAboF';o.style.cssText='position:fixed;inset:0;z-index:99990;background:var(--bg,#faf5ef);overflow:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;gap:10px';
    o.innerHTML='<div style="font-size:44px">🌸</div>'+(ACC.type==='sansEssai'?'<h2 style="margin:0">Bienvenue dans Sérénaissance</h2><p style="max-width:340px" class="small">Votre compte est créé. Pour ouvrir votre espace (grossesse, bébé, cycle), choisissez votre abonnement, ou entrez le code promo reçu.</p>':'<h2 style="margin:0">Vos mois gratuits sont terminés</h2><p style="max-width:340px" class="small">Merci d\'avoir utilisé l\'appli ! Pour continuer, choisissez un abonnement. <b>Toutes vos données sont gardées</b> : tout revient dès le paiement.</p>')+
      '<div style="width:100%;max-width:340px">'+boutons()+'</div><p class="xs muted" style="max-width:340px">Si votre doula utilise Sérénaissance, l\'appli est gratuite pour vous : demandez-lui de vous inviter.</p>'+
      '<div style="width:100%;max-width:340px"><details'+(ACC.type==='sansEssai'?' open':'')+'><summary class="small" style="cursor:pointer;color:var(--accent);font-weight:600">J\'ai un code promo</summary><div class="row" style="gap:6px;margin-top:6px"><input id="cpFam" placeholder="Code" autocapitalize="characters" style="flex:1"><button class="btn sm" data-cp-fam="1">Valider</button></div></details></div>'+
      '<button class="btn sm ghost" data-cp-verif="1">J\'ai payé : vérifier</button><button class="btn sm ghost" data-act="deconnexion">Me déconnecter</button>';
    document.body.appendChild(o)}
  window.cpVerifierFamille=verifier;
  if(typeof chargerParent==='function'){const _cp=chargerParent;chargerParent=async function(){const r=await _cp.apply(this,arguments);try{await verifier()}catch(e){}return r}}
  /* carte dans Paramètres */
  if(typeof pParametres==='function'){const _pp=pParametres;pParametres=function(){const h=_pp.apply(this,arguments);try{if(S.role!=='parent'||!ACC)return h;const a=ACC;
    const t=a.type==='doula'?'Gratuit grâce à votre doula 💗':a.type==='abonnee'?'Abonnement actif'+(a.fin?' · renouvelé jusqu\'au '+fdl(a.fin):'')+'.':a.type==='essai'?'Mois gratuits jusqu\'au '+fdl(a.fin)+'. Votre 7e mois commence ce jour-là.':a.type==='proprio'?'Accès complet.':'';
    if(!t)return h;return h+'<div class="card"><span class="eyebrow acc">Mon abonnement</span><p class="small">'+t+'</p>'+(a.type==='essai'?boutons():'')+'</div>'}catch(e){}return h}}
  document.addEventListener('click',async e=>{
    if(e.target.closest('[data-cp-voir]')){document.getElementById('cpRappel')?.remove();S.vue=null;S.tab='parametres';try{render()}catch(x){}window.scrollTo(0,document.body.scrollHeight);return}
    if(e.target.closest('[data-cp-fam]')){const v=(document.getElementById('cpFam').value||'').trim();if(!v){toast('Entrez votre code');return}garder(v);await verifier();return}
    if(e.target.closest('[data-cp-verif]')){await verifier();if(document.getElementById('ecranAboF'))toast('Paiement pas encore reçu. Réessayez dans une minute.');return}});
  if(/abonnement-paye/.test(location.hash))setTimeout(()=>{verifier();toast('Merci 💗 Votre abonnement est activé.')},2500);
}
(function(){const st=document.createElement('style');st.textContent='.cp-pop{position:fixed;inset:0;z-index:99995;display:flex;align-items:center;justify-content:center;padding:20px}.cp-fond{position:absolute;inset:0;background:rgba(40,25,20,.45)}.cp-boite{position:relative;background:var(--card,#fff);border-radius:22px;padding:24px;max-width:360px;width:100%;text-align:center;display:flex;flex-direction:column;gap:8px;box-shadow:0 20px 50px rgba(0,0,0,.25)}.cp-code{text-transform:uppercase}';document.head.appendChild(st)})();
})();
