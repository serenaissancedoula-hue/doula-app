/* Sérénaissance — outils de la propriétaire (avis des doulas, places des testeuses) + « Signaler un problème » pour les doulas. */

/* ---------- Mémoire des erreurs récentes (jointes aux problèmes signalés) ---------- */
window.__ERRS=window.__ERRS||[];
const _noterErr=m=>{try{window.__ERRS.push(new Date().toLocaleTimeString('fr-CA')+' '+String(m).slice(0,160));if(window.__ERRS.length>10)window.__ERRS.shift()}catch(e){}};
window.addEventListener('error',e=>_noterErr(e.message||'erreur'));
window.addEventListener('unhandledrejection',e=>_noterErr((e.reason&&e.reason.message)||e.reason||'promesse rejetée'));
const _toast0=toast;toast=function(m){_noterErr('message : '+m);return _toast0(m)};

/* ---------- Avis des doulas (propriétaire) ---------- */
const _avisParse=t=>{const o={};String(t).split('\n').forEach(l=>{const i=l.indexOf(' : ');if(i>0)o[l.slice(0,i).trim()]=l.slice(i+3).trim()});return o};
DSUB.avisTab=function(){if(!MOI||!MOI.admin)return '<p class="small">Réservé à la propriétaire de l\'appli.</p>';
  setTimeout(async()=>{const el=$('#avisTab');if(!el)return;
    const [r1,r2]=await Promise.all([sb.from('fam_support').select('*').like('texte','📋 Questionnaire%').eq('de_admin',false).order('created_at',{ascending:false}),sb.rpc('fam_admin_stats')]);
    if(r1.error){el.innerHTML='<p class="small muted">Impossible de lire les avis : '+esc(r1.error.message)+'</p>';return}
    const noms={};((r2.data&&r2.data.doulas)||[]).forEach(d=>noms[d.id]=d.nom||d.courriel);
    const R=(r1.data||[]).map(m=>({m,o:_avisParse(m.texte)}));
    if(!R.length){el.innerHTML='<p class="small muted">Aucun questionnaire reçu pour l\'instant. Les doulas le trouvent dans « Questionnaire de satisfaction » et sur leur tableau de bord.</p>';return}
    const moy=lab=>{const v=R.map(x=>parseInt(x.o[lab])).filter(n=>n>0);return v.length?v.reduce((a,b)=>a+b,0)/v.length:0};
    const tally=(cle,sep)=>{const t={};R.forEach(x=>{const v=x.o[cle];if(!v||v==='–')return;(sep?v.split(', '):[v]).forEach(k=>t[k]=(t[k]||0)+1)});return Object.entries(t).sort((a,b)=>b[1]-a[1])};
    const barre=(txt,n,tot)=>'<div style="margin:6px 0"><div class="row between small"><span>'+esc(txt)+'</span><b>'+n+'</b></div><div style="height:8px;border-radius:8px;background:var(--soft2)"><div style="height:8px;border-radius:8px;background:var(--accent);width:'+Math.round(100*n/tot)+'%"></div></div></div>';
    const notes=AVQ.notes.map(n=>{const m=moy(n[1]);return '<div style="margin:8px 0"><div class="row between small"><span>'+esc(n[1])+'</span><b>'+(m?m.toFixed(1)+' / 5':'–')+'</b></div><div style="height:8px;border-radius:8px;background:var(--soft2)"><div style="height:8px;border-radius:8px;background:var(--accent);width:'+Math.round(m*20)+'%"></div></div></div>'}).join('');
    const bloc=(t,L)=>'<div class="card"><span class="eyebrow acc">'+t+'</span>'+(L.length?L.map(x=>barre(x[0],x[1],R.length)).join(''):'<p class="small muted">–</p>')+'</div>';
    const textes=R.filter(x=>(x.o["Ce que j'aime le plus"]&&x.o["Ce que j'aime le plus"]!=='–')||(x.o['Ce qui manque ou me dérange']&&x.o['Ce qui manque ou me dérange']!=='–'));
    el.innerHTML='<div class="grid3"><div class="stat acc"><b>'+R.length+'</b><span>réponse'+(R.length>1?'s':'')+'</span></div><div class="stat ok"><b>'+(moy(AVQ.notes[0][1])?moy(AVQ.notes[0][1]).toFixed(1):'–')+'</b><span>satisfaction / 5</span></div><div class="stat"><b>'+R.filter(x=>/^Oui/.test(x.o['Recommanderait à une collègue']||'')).length+'</b><span>recommandent</span></div></div>'+
      '<div class="card"><span class="eyebrow acc">Les notes</span>'+notes+'</div>'+
      bloc('Prix qui semble juste',tally('Prix qui semble juste'))+bloc('Ce qu\'elles utilisent le plus',tally('Ce que j\'utilise le plus',true))+
      '<div class="card"><span class="eyebrow acc">Leurs mots</span>'+textes.map(x=>'<div class="soft" style="margin:8px 0"><b class="small">'+esc(noms[x.m.doula_id]||'Doula')+'</b> <span class="xs muted">'+fmtS(new Date(x.m.created_at))+'</span>'+(x.o['Ce que j\'aime le plus']&&x.o['Ce que j\'aime le plus']!=='–'?'<p class="small">👍 '+esc(x.o['Ce que j\'aime le plus'])+'</p>':'')+(x.o['Ce qui manque ou me dérange']&&x.o['Ce qui manque ou me dérange']!=='–'?'<p class="small">🔧 '+esc(x.o['Ce qui manque ou me dérange'])+'</p>':'')+(x.o['Témoignage autorisé']==='Oui'?'<span class="pill ok">Témoignage autorisé</span>':'')+'</div>').join('')+'</div>'},0);
  return sh('Avis des doulas','Les réponses au questionnaire de satisfaction, regroupées.')+'<div id="avisTab"><p class="small muted">Chargement…</p></div>'};
const _dOutAT=dOutils;dOutils=function(){if(MOI&&MOI.admin&&!DOUT.find(x=>x[0]==='avisTab'))DOUT.splice(1,0,['avisTab','fa-star','Avis des doulas (propriétaire)','Notes, prix et témoignages']);return _dOutAT()};

/* ---------- Places des testeuses (propriétaire) ---------- */
async function carteInscriptions(){const el=$('#placesCard');if(!el)return;
  const [{data:CP},{data:UT},{data:DL},{data:FM}]=await Promise.all([sb.from('fam_coupons').select('code,pour,max_utilisations,utilisations'),sb.from('fam_coupons_util').select('compte,pour'),sb.from('fam_doulas').select('id,prenom,nom,test,essai_fin,abonnement_statut,acces_gratuit'),sb.from('fam_familles').select('id,doula_id,test')]);
  const mxD=((CP||[]).find(c=>c.pour==='doula')||{}).max_utilisations||5,mxM=((CP||[]).find(c=>c.pour==='famille')||{}).max_utilisations||5;
  const code=new Set((UT||[]).map(x=>x.compte)),maint=Date.now();
  const D=(DL||[]).filter(d=>!d.test),prD=D.filter(d=>code.has(d.id)).length;
  const payees=D.filter(d=>['actif','impaye'].includes(d.abonnement_statut)),offertes=D.filter(d=>d.acces_gratuit&&!code.has(d.id));
  const bloquees=D.filter(d=>!code.has(d.id)&&!d.acces_gratuit&&!['actif','impaye'].includes(d.abonnement_statut)&&!(d.essai_fin&&new Date(d.essai_fin)>maint));
  const prM=(UT||[]).filter(x=>x.pour==='famille').length,viaDoula=(FM||[]).filter(f=>!f.test&&f.doula_id&&!code.has(f.id)).length;
  const nom=d=>esc([d.prenom,d.nom].filter(Boolean).join(' ')||'Doula');
  const barre=(n,m)=>'<div style="height:10px;border-radius:10px;background:var(--soft2);margin:6px 0 12px"><div style="height:10px;border-radius:10px;background:var(--accent);width:'+Math.min(100,Math.round(100*n/m))+'%"></div></div>';
  const ligne=(t,n,m)=>'<div class="row between"><b>'+t+' : '+n+' sur '+m+'</b><span class="pill '+(n<m?'ok':'')+'">'+(n<m?'Places libres':'Complètes')+'</span></div>'+barre(n,m);
  el.innerHTML='<span class="eyebrow acc">Places d\'essai gratuit (codes promo)</span>'+ligne('Doulas',prD,mxD)+ligne('Mamans',prM,mxM)+
   '<div class="list" style="margin-top:4px"><div class="li"><div class="tx"><b>'+payees.length+' doula'+(payees.length>1?'s':'')+' abonnée'+(payees.length>1?'s':'')+' (payante'+(payees.length>1?'s':'')+')</b></div></div>'+
   (offertes.length?'<div class="li"><div class="tx"><b>'+offertes.length+' accès offert'+(offertes.length>1?'s':'')+' par vous</b><span>'+offertes.map(nom).join(', ')+'</span></div></div>':'')+
   (bloquees.length?'<div class="li"><div class="tx"><b>'+bloquees.length+' inscrite'+(bloquees.length>1?'s':'')+' sans accès : elle'+(bloquees.length>1?'s doivent':' doit')+' s\'abonner</b><span>'+bloquees.map(nom).join(', ')+' · elles voient l\'écran d\'abonnement et ne peuvent pas utiliser l\'appli</span></div></div>':'')+
   '<div class="li"><div class="tx"><b>'+viaDoula+' maman'+(viaDoula>1?'s':'')+' gratuite'+(viaDoula>1?'s':'')+' grâce à leur doula</b><span>Ne prennent pas de place</span></div></div></div>'+
   '<p class="xs muted">Votre compte et les comptes test ne sont pas comptés.</p>'}
const _pp2=DSUB.proprio;DSUB.proprio=function(){const h=_pp2();if(!MOI||!MOI.admin)return h;setTimeout(async()=>{await chargerPlaces();carteInscriptions();boiteSupport()},0);return h.replace('<div class="card" id="statsProprio">','<div class="card" id="boiteSup"><p class="small muted">Chargement…</p></div><div class="card" id="placesCard"><p class="small muted">Chargement…</p></div><div class="card" id="statsProprio">')};
async function boiteSupport(){const el=$('#boiteSup');if(!el)return;
  const [r1,r2]=await Promise.all([sb.from('fam_support').select('*').eq('de_admin',false).order('created_at',{ascending:false}).limit(15),sb.rpc('fam_admin_stats')]);
  const noms={};((r2.data&&r2.data.doulas)||[]).forEach(d=>noms[d.id]=d.nom||d.courriel);if(ME_DOULA)noms[ME_DOULA.id]=noms[ME_DOULA.id]||'Moi';
  const L=r1.data||[];const nl=L.filter(m=>!m.lu).length;
  el.innerHTML='<span class="eyebrow acc">Messages reçus'+(nl?' · '+nl+' nouveau'+(nl>1?'x':''):'')+'</span>'+(L.length?L.map(m=>'<button class="btn sm ghost" style="width:100%;text-align:left;margin:4px 0;white-space:normal" data-act="supOuvrir" data-id="'+m.doula_id+'" data-v="'+esc(noms[m.doula_id]||'Doula')+'"><b>'+esc(noms[m.doula_id]||'Doula')+'</b>'+(m.lu?'':' <span class="pill ok">nouveau</span>')+'<br><span class="xs muted">'+esc(String(m.texte).split('\n').slice(0,2).join(' ').slice(0,90))+' · '+fmtS(new Date(m.created_at))+'</span></button>').join(''):'<p class="small muted">Aucun message pour l\'instant.</p>')}

/* ---------- Signaler un problème (doulas) ---------- */
DSUB.probleme=function(){return sh('Signaler un problème','Décrivez ce qui ne marche pas. Nous joignons automatiquement la version de l\'appli et les erreurs récentes : vous n\'avez rien à copier.')+'<div class="card"><label class="f">Qu\'est-ce qui ne fonctionne pas ?<textarea id="probTxt" style="min-height:110px" placeholder="Ex. : je touche Enregistrer et rien ne se passe"></textarea></label><button class="btn" data-act="probEnvoyer">'+icon('fa-paper-plane')+'Envoyer</button><p class="xs muted">Votre message arrive à Sabrina, avec une notification.</p></div>'};
if(!DOUT.find(x=>x[0]==='probleme'))DOUT.splice(2,0,['probleme','fa-bug','Signaler un problème','Envoi automatique des détails']);

document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  try{
  if(a==='probEnvoyer'){const t=($('#probTxt').value||'').trim();if(!t){toast('Décrivez le problème en quelques mots');return}
    b.disabled=true;
    const standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
    const txt='🛠 Problème signalé\n'+t+'\n\n— Détails automatiques —\nVersion de l\'appli : '+(typeof APP_VERSION!=='undefined'?APP_VERSION:'?')+'\nAppli installée : '+(standalone?'oui':'non')+'\nLangue : '+(window.LANG||'fr')+'\nÉcran : '+(S.dtab||'')+(S.dsub?' / '+S.dsub:'')+'\nAppareil : '+navigator.userAgent+'\nErreurs récentes :\n'+(window.__ERRS.length?window.__ERRS.join('\n'):'aucune');
    const {error}=await sb.from('fam_support').insert({doula_id:ME_DOULA.id,de_admin:false,texte:txt});
    if(error){toast('Pas envoyé : '+error.message);b.disabled=false;return}
    toast('Merci ! Votre message est envoyé');S.dsub=null;render()}
  else if(a==='placesSave'||a==='placesFermer'){const pr=(PLACES&&PLACES.prises)||0;const n=a==='placesFermer'?pr:parseInt($('#placesMax').value);
    if(!(n>=pr)){toast('Le total ne peut pas être sous le nombre de places prises ('+pr+')');return}
    b.disabled=true;const {error}=await sb.rpc('fam_admin_places',{p_max:n});
    if(error){toast(/function|exist|schema/i.test(error.message)?'Exécutez d\'abord le SQL « places-modifiables » dans Supabase':'Pas enregistré : '+error.message);b.disabled=false;return}
    await chargerPlaces();carteInscriptions();toast(n===pr?'Places gratuites terminées':'Limite : '+n+' places')}
  }catch(err){console.error(err);toast('Une erreur est survenue')}});
