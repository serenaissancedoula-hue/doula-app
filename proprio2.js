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
function carteInscriptions(){const el=$('#placesCard');if(!el)return;const P=PLACES;
  if(!P){el.innerHTML='<span class="eyebrow acc">Inscriptions des doulas</span><p class="small muted">Limite non installée. Exécutez le SQL « places-modifiables » dans Supabase pour pouvoir la changer ici.</p>';return}
  const pr=P.prises||0,mx=P.max||10;
  el.innerHTML='<span class="eyebrow acc">Inscriptions des doulas</span><div class="row between"><b>'+pr+' sur '+mx+' places prises</b><span class="pill '+(P.ouvert?'ok':'')+'">'+(P.ouvert?'Ouvertes':'Fermées')+'</span></div><div style="height:10px;border-radius:10px;background:var(--soft2);margin:8px 0"><div style="height:10px;border-radius:10px;background:var(--accent);width:'+Math.min(100,Math.round(100*pr/mx))+'%"></div></div>'+
    '<label class="f">Nombre de places au total<input type="number" id="placesMax" min="'+pr+'" value="'+mx+'"></label><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="placesSave">Enregistrer</button><button class="btn sm ghost" data-act="placesFermer">Fermer maintenant</button></div><p class="xs muted">Votre propre espace compte parmi les places. À la limite, le bouton « Créer mon Espace Doula » disparaît.</p>'}
const _pp2=DSUB.proprio;DSUB.proprio=function(){const h=_pp2();if(!MOI||!MOI.admin)return h;setTimeout(async()=>{await chargerPlaces();carteInscriptions()},0);return h.replace('<div class="card" id="statsProprio">','<div class="card" id="placesCard"><p class="small muted">Chargement…</p></div><div class="card" id="statsProprio">')};

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
    await chargerPlaces();carteInscriptions();toast(n===pr?'Inscriptions fermées':'Limite : '+n+' places')}
  }catch(err){console.error(err);toast('Une erreur est survenue')}});
