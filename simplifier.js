/* Sérénaissance — navigation simplifiée (v62). Pour revenir en arrière : retirer ce fichier des pages (ou git revert). */
(function(){
if(window.ESPACE==='doula'){
  /* Un seul onglet « Outils » : les Ressources deviennent « Cadre de pratique » dans les outils */
  const k=DTABS.findIndex(t=>t[0]==='ressources');if(k>=0)DTABS.splice(k,1);
  DSUB.cadre=()=>dRessources();
  if(!DOUT.find(x=>x[0]==='cadre'))DOUT.push(['cadre','fa-book-medical','Cadre de pratique','Observer et référer, repérage, éthique, régions']);
  DSUB.aide=()=>sh('Aide et suggestions','Une seule porte pour écrire à Sérénaissance')+'<div class="tiles">'
    +[['support','fa-headset','Poser une question','Questions, idées, suggestions'],['probleme','fa-bug','Signaler un problème','Envoi automatique des détails'],['avis','fa-clipboard-check','Questionnaire de satisfaction','5 minutes pour améliorer l\'appli']]
      .map(t=>'<button class="tile" data-act="dsub" data-v="'+t[0]+'"><span class="ti">'+icon(t[1])+'</span><b>'+t[2]+'</b><span>'+t[3]+'</span></button>').join('')+'</div>';
  if(!DOUT.find(x=>x[0]==='aide'))DOUT.push(['aide','fa-life-ring','Aide et suggestions','Question, problème, questionnaire']);
}
if(window.ESPACE==='parent'){
  /* Journal dans Suivi */
  const k=PTABS2.findIndex(t=>t[0]==='journal');if(k>=0)PTABS2.splice(k,1);
  const s=PTABS2.find(t=>t[0]==='suivi');if(s)s[2]='Suivi';
  const seg=j=>'<div class="seg"><button class="chip '+(!j?'on':'')+'" data-act="spv" data-v="suivi">Mon suivi</button><button class="chip '+(j?'on':'')+'" data-act="spv" data-v="journal">Mon journal</button></div>';
  const _pS=pSuivi;pSuivi=function(){return seg(false)+_pS.apply(this,arguments)};
  const _pJ=pJournal;pJournal=function(){return seg(true)+_pJ.apply(this,arguments)};
  const _r=render;render=function(){_r.apply(this,arguments);try{if(S.tab==='journal'&&!S.vue){const b=document.querySelector('#tabs [data-v=suivi]');if(b)b.classList.add('on')}}catch(e){}};
  document.addEventListener('click',e=>{const b=e.target.closest('[data-act=spv]');if(!b)return;S.tab=b.dataset.v;S.sub='';scrollTo(0,0);render()});
  /* Préparer en 4 blocs */
  const GRP=[['Pour l\'accouchement','fa-person-walking',['plan','situations','peurs','positions','respiration','affirmations','prep']],
    ['Mon bébé et mes 40 jours','fa-mug-hot',['quarante','souv']],
    ['Avec mon partenaire','fa-people-arrows',['partenaire','cahier']],
    ['Ma valise et mes contacts','fa-suitcase-rolling',['valise','contacts','qpro']]];
  const _pP=pPreparer;
  pPreparer=function(){if(S.sub)return _pP.apply(this,arguments);
    const tile=t=>'<button class="tile" data-act="sub" data-v="'+t[0]+'"><span class="ti">'+icon(t[1])+'</span><b>'+t[2]+'</b><span>'+t[3]+'</span>'+(t[4]?'<span class="pill acc" style="align-self:flex-start">'+t[4]()+'</span>':'')+'</button>';
    const vus={};
    let h=sh('Préparer ma naissance','Tous les outils de votre pochette Sérénaissance');
    GRP.forEach((g,i)=>{const L=g[2].map(id=>PREP_TILES.find(t=>t[0]===id)).filter(Boolean);L.forEach(t=>vus[t[0]]=1);
      h+='<details class="acc"'+(i===0?' open':'')+'><summary>'+icon(g[1],'var(--accent)')+g[0]+' <span class="xs">('+L.length+')</span><i class="fa-solid fa-chevron-down chev"></i></summary><div class="body"><div class="tiles">'+L.map(tile).join('')+'</div></div></details>'});
    const R=PREP_TILES.filter(t=>!vus[t[0]]);if(R.length)h+='<div class="tiles">'+R.map(tile).join('')+'</div>';
    return h};
}
})();
