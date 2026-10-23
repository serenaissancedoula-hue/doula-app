/* Sérénaissance — questionnaire de satisfaction des doulas testeuses.
   Les réponses arrivent dans la messagerie de la propriétaire (table fam_support) avec sa notification habituelle.
   « Fait » est gardé dans les modèles de la doula (fam_doulas.modeles.avis). */
const AVQ={
  notes:[['global','Dans l\'ensemble, je suis satisfaite de l\'appli'],['facile','L\'appli est facile à utiliser'],['temps','Elle me fait gagner du temps'],['familles','Mes familles l\'aiment']],
  utiles:['Dossiers des familles','Rendez-vous et rappels','Contrats et documents signés','Messages avec les familles','Fiches de rencontre','Outils de la trousse','Suivi de bébé et du 4e trimestre'],
  reco:['Oui, sans hésiter','Peut-être','Non'],
  prix:['Rien : je préfère la version gratuite','Moins de 10 $ par mois','10 à 20 $ par mois','20 à 35 $ par mois','Plus de 35 $ par mois']
};
const avisFait=()=>!!(((ME_DOULA||{}).modeles||{}).avis)&&!S.avisRefaire;
const avisRadios=(nom,vals)=>vals.map(v=>'<label class="chip"><input type="radio" name="'+nom+'" value="'+esc(v)+'" style="accent-color:var(--accent)"> '+esc(v)+'</label>').join('');

DSUB.avis=function(){
  if(avisFait()){const a=ME_DOULA.modeles.avis;
    return sh('Merci !','Votre questionnaire a été envoyé'+(a.date?' le '+fmtD(parseD(a.date)):'')+'.')+'<div class="card"><p class="small">Vos réponses aident à améliorer l\'appli. Une autre idée ou un problème ? Écrivez-nous.</p><button class="btn" data-act="dsub" data-v="support">'+icon('fa-headset')+'Écrire à Sérénaissance</button> <button class="btn sm ghost" data-act="avisRefaire">Répondre de nouveau</button></div>'}
  let h=sh('Votre avis sur l\'appli','5 minutes. Vos réponses vont directement à Sabrina.');
  h+='<div class="card"><p class="small"><b>Note de 1 à 5</b> : 1 = pas du tout, 5 = tout à fait.</p></div>';
  AVQ.notes.forEach(n=>{h+='<div class="card"><b class="small">'+n[1]+'</b><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">'+[1,2,3,4,5].map(i=>'<label class="chip"><input type="radio" name="av_'+n[0]+'" value="'+i+'" style="accent-color:var(--accent)"> '+i+'</label>').join('')+'</div></div>'});
  h+='<div class="card"><b class="small">Ce que j\'utilise le plus</b><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">'+AVQ.utiles.map(u=>'<label class="chip"><input type="checkbox" name="av_utiles" value="'+esc(u)+'" style="accent-color:var(--accent)"> '+esc(u)+'</label>').join('')+'</div></div>';
  h+='<div class="card"><label class="f">Ce que j\'aime le plus<textarea id="avPlus" style="min-height:80px"></textarea></label><label class="f">Ce qui manque ou me dérange<textarea id="avMoins" style="min-height:80px"></textarea></label></div>';
  h+='<div class="card"><b class="small">Je recommanderais l\'appli à une collègue doula</b><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">'+avisRadios('av_reco',AVQ.reco)+'</div></div>';
  h+='<div class="card"><b class="small">Si l\'appli devient payante, combien me semblerait juste ?</b><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">'+avisRadios('av_prix',AVQ.prix)+'</div></div>';
  h+='<div class="card"><label class="chip"><input type="checkbox" id="avTemoin" style="accent-color:var(--accent)"> Sabrina peut citer mon commentaire comme témoignage</label></div>';
  h+='<button class="btn" data-act="avisEnvoyer">'+icon('fa-paper-plane')+'Envoyer mes réponses</button>';
  return h};
if(!DOUT.find(x=>x[0]==='avis'))DOUT.splice(1,0,['avis','fa-clipboard-check','Questionnaire de satisfaction','5 minutes pour améliorer l\'appli']);
/* La propriétaire n'a pas à le remplir */
const _dOutAvis=dOutils;dOutils=function(){if(!S.dsub&&MOI&&MOI.admin){const k=DOUT.findIndex(x=>x[0]==='avis');if(k>=0)DOUT.splice(k,1)}return _dOutAvis()};
/* Rappel sur l'accueil tant que le questionnaire n'est pas rempli (dès qu'elle a une famille) */
const _dAccAvis=dAccueil;dAccueil=function(){const h=_dAccAvis();
  if(!ME_DOULA||(MOI&&MOI.admin)||avisFait()||!S.clients.length)return h;
  return '<button class="cl" data-act="dgo" data-v="outils|avis" style="border-color:var(--accent)"><div class="av">'+icon('fa-clipboard-check')+'</div><div style="flex:1;min-width:0"><b>Votre avis compte</b><p class="xs muted">Questionnaire de satisfaction · 5 minutes</p></div>'+icon('fa-chevron-right','var(--muted)')+'</button>'+h};

document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  try{
  if(a==='avisRefaire'){S.avisRefaire=true;render();return}
  if(a!=='avisEnvoyer')return;
  const val=n=>{const x=document.querySelector('input[name="'+n+'"]:checked');return x?x.value:''};
  if(!val('av_global')||!val('av_facile')){toast('Répondez au moins aux deux premières questions');return}
  const utiles=[...document.querySelectorAll('input[name="av_utiles"]:checked')].map(x=>x.value);
  const txt=['📋 Questionnaire de satisfaction','',
    ...AVQ.notes.map(n=>n[1]+' : '+(val('av_'+n[0])||'–')+' / 5'),'',
    'Ce que j\'utilise le plus : '+(utiles.join(', ')||'–'),
    'Ce que j\'aime le plus : '+($('#avPlus').value.trim()||'–'),
    'Ce qui manque ou me dérange : '+($('#avMoins').value.trim()||'–'),
    'Recommanderait à une collègue : '+(val('av_reco')||'–'),
    'Prix qui semble juste : '+(val('av_prix')||'–'),
    'Témoignage autorisé : '+($('#avTemoin').checked?'Oui':'Non')].join('\n');
  b.disabled=true;
  const r=await sb.from('fam_support').insert({doula_id:ME_DOULA.id,de_admin:false,texte:txt});
  if(r.error){toast(r.error.message);b.disabled=false;return}
  const mod=Object.assign({},ME_DOULA.modeles||{},{avis:{date:iso(new Date())}});
  const u=await sb.from('fam_doulas').update({modeles:mod}).eq('id',ME_DOULA.id);
  if(!u.error)ME_DOULA.modeles=mod;
  S.avisRefaire=false;toast('Merci ! Vos réponses sont envoyées');render()
  }catch(err){console.error(err);toast('Une erreur est survenue')}});
