/* Sérénaissance — questionnaire d'avis des mamans (après 7 jours) + lecture par la propriétaire.
   La notification « Ton avis compte » est envoyée par la base (fam_demande_avis, chaque jour) ;
   les réponses vont dans fam_avis_famille (lisible seulement par la propriétaire). */
(function(){
const NOTES=[['global','Dans l\'ensemble, je suis satisfaite de l\'appli'],['facile','L\'appli est facile à utiliser'],['utile','L\'appli m\'aide dans ma grossesse ou mon post-partum']];
const RECO=['Oui, sûrement','Peut-être','Non'];
const chips=(nom,vals)=>vals.map(v=>'<label class="chip"><input type="radio" name="'+nom+'" value="'+esc(v)+'" style="accent-color:var(--accent)"> '+esc(v)+'</label>').join('');
const fait=()=>{try{return !!(S.parent&&S.parent.avisFait)}catch(e){return false}};
if(window.ESPACE==='parent'){
  function ouvrir(){
    if(fait()){sheet('Merci 💗','<p class="small">Tes réponses ont bien été envoyées. Merci de nous aider à améliorer l\'appli.</p>');return}
    let h='<p class="small">5 minutes. Tes réponses vont directement à Sabrina, la créatrice de l\'appli.</p>';
    NOTES.forEach(n=>{h+='<div class="card"><b class="small">'+esc(n[1])+'</b><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">'+chips('avf_'+n[0],['1','2','3','4','5'])+'</div><p class="xs muted">1 = pas du tout · 5 = tout à fait</p></div>'});
    h+='<div class="card"><label class="f">Ce que j\'aime le plus<textarea id="avfPlus" rows="2"></textarea></label><label class="f">Ce qui manque ou me dérange<textarea id="avfMoins" rows="2"></textarea></label></div>';
    h+='<div class="card"><b class="small">Je recommanderais l\'appli à une amie enceinte ou nouvelle maman</b><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">'+chips('avf_reco',RECO)+'</div></div>';
    h+='<label class="chip" style="margin:6px 0"><input type="checkbox" id="avfTemoin" style="accent-color:var(--accent)"> Tu peux utiliser mes mots comme témoignage (sans mon nom de famille)</label>';
    h+='<button class="btn" data-avf="envoyer" style="width:100%;margin-top:8px">Envoyer mes réponses</button>';
    sheet('Ton avis compte',h)}
  document.addEventListener('click',async e=>{const b=e.target.closest('[data-avf]');if(!b)return;e.preventDefault();e.stopPropagation();
    if(b.dataset.avf==='ouvrir'){ouvrir();return}
    const val=n=>{const x=document.querySelector('input[name="'+n+'"]:checked');return x?x.value:''};
    if(!val('avf_global')||!val('avf_facile')){toast('Réponds au moins aux deux premières questions');return}
    const txt=['⭐ Questionnaire de satisfaction (maman)','',...NOTES.map(n=>n[1]+' : '+(val('avf_'+n[0])||'–')+' / 5'),'',
      'Ce que j\'aime le plus : '+(((document.getElementById('avfPlus')||{}).value||'').trim()||'–'),
      'Ce qui manque ou me dérange : '+(((document.getElementById('avfMoins')||{}).value||'').trim()||'–'),
      'Recommanderait : '+(val('avf_reco')||'–'),
      'Témoignage autorisé : '+((document.getElementById('avfTemoin')||{}).checked?'Oui':'Non')].join('\n');
    b.disabled=true;
    try{const {data,error}=await sb.rpc('fam_envoyer_avis_famille',{p_texte:txt});
      if(error||!data||!data.ok){toast((error&&error.message)||(data&&data.erreur)||'Pas envoyé. Réessaie.');b.disabled=false;return}
      S.parent.avisFait=new Date().toISOString().slice(0,10);try{save()}catch(x){}
      toast('Merci 💗 Tes réponses sont envoyées');try{render()}catch(x){}
      sheet('Merci 💗','<p class="small">Tes réponses ont bien été envoyées.</p>')
    }catch(err){console.error(err);toast('Une erreur est survenue');b.disabled=false}},true);
  /* carte discrète sur l'accueil, 7 jours après l'inscription, tant que ce n'est pas rempli */
  if(typeof pAccueil==='function'){const _pa=pAccueil;pAccueil=function(){const h=_pa.apply(this,arguments);
    try{if(fait()||typeof FAM==='undefined'||!FAM||!FAM.created_at)return h;if(Date.now()-new Date(FAM.created_at)<7*864e5)return h;
      return '<button class="cl" data-avf="ouvrir" style="border-color:var(--accent);width:100%;text-align:left"><div class="av">'+icon('fa-clipboard-check')+'</div><div style="flex:1;min-width:0"><b>Ton avis compte</b><p class="xs muted">Questionnaire de satisfaction · 5 minutes</p></div>'+icon('fa-chevron-right','var(--muted)')+'</button>'+h}catch(e){return h}}}
  window.addEventListener('hashchange',()=>{if(location.hash==='#avis')setTimeout(ouvrir,300)});
  window.__ouvrirAvisFamille=ouvrir;
}
if(window.ESPACE==='doula'){
  const parse=t=>{const o={};String(t).split('\n').forEach(l=>{const i=l.indexOf(' : ');if(i>0)o[l.slice(0,i).trim()]=l.slice(i+3).trim()});return o};
  DSUB.avisFam=function(){if(!MOI||!MOI.admin)return '<p class="small">Réservé à la propriétaire de l\'appli.</p>';
    setTimeout(async()=>{const el=$('#avisFam');if(!el)return;
      const {data,error}=await sb.from('fam_avis_famille').select('*').order('created_at',{ascending:false});
      if(error){el.innerHTML='<p class="small muted">Impossible de lire les avis : '+esc(error.message)+'</p>';return}
      if(!(data||[]).length){el.innerHTML='<p class="small muted">Aucune réponse pour l\'instant. Les mamans reçoivent la demande 7 jours après leur inscription.</p>';return}
      const R=data.map(m=>({m,o:parse(m.texte)}));
      const moy=lab=>{const v=R.map(x=>parseInt(x.o[lab])).filter(n=>n>0);return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1):'–'};
      el.innerHTML='<div class="grid3"><div class="stat acc"><b>'+R.length+'</b><span>réponse'+(R.length>1?'s':'')+'</span></div><div class="stat ok"><b>'+moy(NOTES[0][1])+'</b><span>satisfaction / 5</span></div><div class="stat"><b>'+R.filter(x=>/^Oui/.test(x.o['Recommanderait']||'')).length+'</b><span>recommandent</span></div></div>'+
        R.map(x=>'<div class="card"><span class="xs muted">'+fmtS(new Date(x.m.created_at))+'</span>'+NOTES.map(n=>'<p class="small">'+esc(n[1])+' : <b>'+esc(x.o[n[1]]||'–')+'</b></p>').join('')+
          (x.o["Ce que j'aime le plus"]&&x.o["Ce que j'aime le plus"]!=='–'?'<p class="small">👍 '+esc(x.o["Ce que j'aime le plus"])+'</p>':'')+
          (x.o['Ce qui manque ou me dérange']&&x.o['Ce qui manque ou me dérange']!=='–'?'<p class="small">🔧 '+esc(x.o['Ce qui manque ou me dérange'])+'</p>':'')+
          '<p class="xs muted">Recommanderait : '+esc(x.o['Recommanderait']||'–')+(x.o['Témoignage autorisé']==='Oui'?' · <span class="pill ok">Témoignage autorisé</span>':'')+'</p></div>').join('')},0);
    return sh('Avis des mamans','Les réponses au questionnaire de satisfaction des mamans.')+'<div id="avisFam"><p class="small muted">Chargement…</p></div>'};
  const _dOutAF=dOutils;dOutils=function(){if(MOI&&MOI.admin&&!DOUT.find(x=>x[0]==='avisFam'))DOUT.splice(2,0,['avisFam','fa-heart','Avis des mamans (propriétaire)','Notes et témoignages des familles']);return _dOutAF()};
}
})();
