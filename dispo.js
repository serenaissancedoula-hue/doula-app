/* Sérénaissance — disponibilités de la doula (jours et heures de rendez-vous), vacances avec avis aux familles,
   choix d'un créneau libre par la famille, et accueil guidé d'une nouvelle doula. */
const JOURS=[[1,'Lundi'],[2,'Mardi'],[3,'Mercredi'],[4,'Jeudi'],[5,'Vendredi'],[6,'Samedi'],[0,'Dimanche']];
function dispoDe(m){const d=(m||{}).dispo||{};return {jours:d.jours||{},vacances:d.vacances||[],duree:d.duree||90}}
function mesModeles(){return S.role==='doula'?(ME_DOULA&&ME_DOULA.modeles)||{}:(DOULA&&DOULA.modeles)||{}}
function aDesDispos(m){return Object.values(dispoDe(m).jours).some(j=>j&&j.on)}
function enVacances(jour,m){const k=iso(jour);return dispoDe(m).vacances.find(v=>v.du<=k&&k<=v.au)}
async function sauverModeles(m){const {error}=await sb.from('fam_doulas').update({modeles:m}).eq('id',ME_DOULA.id);if(error){toast(error.message);return false}ME_DOULA.modeles=m;return true}

/* ---------- Paramètres de la doula ---------- */
function carteDispos(){const D=dispoDe(ME_DOULA.modeles);
  let h='<div class="card" id="cDispo"><span class="eyebrow acc">Mes disponibilités pour les rendez-vous</span><p class="xs muted">Vos familles ne peuvent demander un rendez-vous que dans ces plages, et jamais pendant vos vacances ni sur un rendez-vous déjà pris.</p><div class="stack" style="gap:6px">'+
    JOURS.map(([d,n])=>{const j=D.jours[d]||{};return '<div class="row" style="flex-wrap:nowrap;gap:8px"><label class="check" style="min-width:118px;padding:4px 0"><input type="checkbox" class="dj" data-d="'+d+'" '+(j.on?'checked':'')+'><span>'+n+'</span></label><input type="time" class="dde" data-d="'+d+'" value="'+(j.de||'09:00')+'" style="max-width:120px" aria-label="'+n+', de"><span class="xs muted">à</span><input type="time" class="da" data-d="'+d+'" value="'+(j.a||'17:00')+'" style="max-width:120px" aria-label="'+n+', à"></div>'}).join('')+
    '</div><label class="f" style="max-width:260px">Durée habituelle d\'une rencontre<select id="dDuree">'+[30,45,60,90,120].map(x=>'<option value="'+x+'" '+(D.duree===x?'selected':'')+'>'+(x<60?x+' min':x/60+' h'+(x%60?' '+x%60:''))+'</option>').join('')+'</select></label><button class="btn sm" data-act="dispoSave">'+icon('fa-check')+'Enregistrer mes disponibilités</button></div>';
  const fut=D.vacances.filter(v=>v.au>=iso(new Date())).sort((a,b)=>a.du<b.du?-1:1);
  h+='<div class="card"><span class="eyebrow acc">Mes vacances et absences</span><p class="xs muted">Vos familles sont avisées par une notification et voient vos dates dans leur appli. Aucun rendez-vous ne peut être demandé pendant ces journées.</p>'+
    (fut.length?'<div class="list">'+fut.map(v=>'<div class="li"><div class="ic">'+icon('fa-umbrella-beach')+'</div><div class="tx"><b>Du '+fmtD(parseD(v.du),{day:'numeric',month:'long'})+' au '+fmtD(parseD(v.au),{day:'numeric',month:'long',year:'numeric'})+'</b><span>'+(v.avise?'Familles avisées le '+fmtS(new Date(v.avise)):'Familles pas encore avisées')+'</span></div><button class="icon-btn" data-act="vacSuppr" data-v="'+v.id+'" aria-label="Retirer">'+icon('fa-trash')+'</button></div>').join('')+'</div>':'<p class="small muted">Aucune absence prévue.</p>')+
    '<div class="soft"><div class="grid2"><label class="f">Du<input type="date" id="vDu" value="'+iso(addD(new Date(),14))+'"></label><label class="f">Au<input type="date" id="vAu" value="'+iso(addD(new Date(),21))+'"></label></div><label class="f">Message à mes familles<textarea id="vMsg" style="min-height:90px">'+esc(msgVacancesDefaut())+'</textarea></label><label class="check"><input type="checkbox" id="vAvis" checked><span>Aviser mes familles maintenant</span></label><button class="btn sm" data-act="vacAjout">'+icon('fa-plus')+'Ajouter cette absence</button></div></div>';
  return h}
function msgVacancesDefaut(){const D=S.doula||{};return 'Je serai en vacances du {du} au {au}. '+(D.rempNom?'Pendant ce temps, ma remplaçante '+D.rempNom+(D.rempTel?' ('+D.rempTel+')':'')+' prend le relais si vous en avez besoin.':'Vous pouvez m\'écrire dans l\'appli : je vous répondrai à mon retour.')+' En cas d\'urgence, appelez le 911 ou votre professionnel de santé.'}
const _pParamD=pParametres;
pParametres=function(){let h=_pParamD();if(S.role!=='doula')return h;const i=h.indexOf('<div class="card"><span class="eyebrow acc">Mon courriel</span>');const c=carteDispos();return i<0?h+c:h.slice(0,i)+c+h.slice(i)};

async function dispoSave(){const m=Object.assign({},ME_DOULA.modeles||{}),D=dispoDe(m);const jours={};
  document.querySelectorAll('.dj').forEach(el=>{const d=el.dataset.d;const de=$('.dde[data-d="'+d+'"]').value,a=$('.da[data-d="'+d+'"]').value;jours[d]={on:el.checked,de,a}});
  if(Object.values(jours).some(j=>j.on&&j.de>=j.a)){toast('L\'heure de fin doit être après l\'heure de début');return}
  m.dispo={jours,vacances:D.vacances,duree:+$('#dDuree').value||90};if(await sauverModeles(m))toast('Disponibilités enregistrées')}
async function vacAjout(b){const du=$('#vDu').value,au=$('#vAu').value;if(!du||!au||au<du){toast('Vérifiez les dates');return}const avis=$('#vAvis').checked;b.disabled=true;
  const m=Object.assign({},ME_DOULA.modeles||{}),D=dispoDe(m);const v={id:String(Date.now()),du,au,avise:avis?new Date().toISOString():null};
  m.dispo={jours:D.jours,vacances:D.vacances.concat([v]),duree:D.duree};if(!await sauverModeles(m)){b.disabled=false;return}
  if(avis){const txt='🌴 '+$('#vMsg').value.replace('{du}',fmtD(parseD(du),{weekday:'long',day:'numeric',month:'long'})).replace('{au}',fmtD(parseD(au),{weekday:'long',day:'numeric',month:'long'}));
    const L=S.clients.filter(c=>c.statut==='active'||c.statut==='invitee');let n=0;for(const c of L){const {error}=await sb.from('fam_messages').insert({famille_id:c.id,de_doula:true,texte:txt});if(!error)n++}
    toast(n?n+' famille'+(n>1?'s':'')+' avisée'+(n>1?'s':''):'Absence ajoutée (aucune famille active)')}else toast('Absence ajoutée');render()}
async function vacSuppr(id){const m=Object.assign({},ME_DOULA.modeles||{}),D=dispoDe(m);m.dispo={jours:D.jours,vacances:D.vacances.filter(v=>v.id!==id),duree:D.duree};if(await sauverModeles(m)){toast('Absence retirée');render()}}

/* ---------- Côté famille : bandeau de vacances et choix d'un créneau libre ---------- */
function bandeauVacances(){const m=mesModeles(),auj=iso(new Date()),lim=iso(addD(new Date(),30));const v=dispoDe(m).vacances.filter(x=>x.au>=auj&&x.du<=lim).sort((a,b)=>a.du<b.du?-1:1)[0];if(!v)return '';
  const enCours=v.du<=auj;return '<div class="banner gold">'+icon('fa-umbrella-beach')+'<div class="small"><b>'+esc(DOULA&&DOULA.prenom||'Votre doula')+(enCours?' est en vacances':' sera en vacances')+'</b> du '+fmtD(parseD(v.du),{day:'numeric',month:'long'})+' au '+fmtD(parseD(v.au),{day:'numeric',month:'long'})+'.'+(DOULA&&DOULA.remplacante_nom?' Remplaçante : '+esc(DOULA.remplacante_nom)+(DOULA.remplacante_tel?' · '+esc(DOULA.remplacante_tel):''):'')+' Urgence : 911.</div></div>'}
const _hautAcc=hautAccueil;hautAccueil=function(){return bandeauVacances()+_hautAcc()};
let OCCUPE=[];
function creneauxDuJour(jour){const m=mesModeles(),D=dispoDe(m),j=D.jours[jour.getDay()];if(!j||!j.on||enVacances(jour,m))return [];const out=[];const [h1,m1]=j.de.split(':').map(Number),[h2,m2]=j.a.split(':').map(Number);
  const debut=new Date(jour);debut.setHours(h1,m1,0,0);const fin=new Date(jour);fin.setHours(h2,m2,0,0);const dur=D.duree*60000,min=Date.now()+20*3600e3;
  for(let t=debut.getTime();t+dur<=fin.getTime();t+=30*60000){if(t<min)continue;const libre=!OCCUPE.some(o=>t<o.f&&t+dur>o.d);if(libre)out.push(new Date(t))}return out}
async function creneauSheet(){const {data}=await sb.rpc('fam_occupe',{p_famille:FAM.id});OCCUPE=(data||[]).map(o=>({d:new Date(o.debut).getTime(),f:new Date(o.fin).getTime()}));
  const jours=[];for(let i=1;i<=28;i++){const d=addD(new Date(),i);d.setHours(0,0,0,0);const c=creneauxDuJour(d);if(c.length)jours.push([d,c])}
  if(!S.cr||!jours.find(x=>iso(x[0])===S.cr.j))S.cr={j:jours[0]?iso(jours[0][0]):null,t:null};
  const cur=jours.find(x=>iso(x[0])===S.cr.j);
  let b='<label class="f">Type<select id="rvType">'+['Rencontre avec ma doula','Appel téléphonique','Visio','Visite postnatale'].map(x=>'<option>'+x+'</option>').join('')+'</select></label>';
  if(!jours.length)b+='<div class="banner gold">'+icon('fa-calendar-xmark')+'<div class="small">Aucune plage libre dans les 4 prochaines semaines. Écrivez à votre doula pour trouver un moment.</div></div>';
  else b+='<span class="eyebrow acc">Choisissez une journée</span><div class="seg">'+jours.map(([d])=>'<button class="chip '+(iso(d)===S.cr.j?'on':'')+'" data-act="crJour" data-v="'+iso(d)+'">'+fmtD(d,{weekday:'short',day:'numeric',month:'short'})+'</button>').join('')+'</div><span class="eyebrow acc">Puis une heure</span><div class="seg">'+cur[1].map(t=>'<button class="chip '+(S.cr.t===t.getTime()?'on':'')+'" data-act="crHeure" data-v="'+t.getTime()+'">'+pad(t.getHours())+' h '+pad(t.getMinutes())+'</button>').join('')+'</div>';
  b+='<label class="f">Message pour ma doula<input type="text" id="rvNote" value="'+esc(S.cr.note||'')+'"></label><button class="btn" data-act="crEnvoyer" '+(jours.length?'':'disabled')+'>Envoyer la demande</button><p class="xs muted">Seules les plages libres de votre doula sont proposées. Elle confirme votre demande. Heure de l\'Atlantique.</p>';
  const ty=$('#rvType')&&$('#rvType').value;sheet('Demander un rendez-vous',b);if(ty)$('#rvType').value=ty}
const _rdvSheet=rdvSheet;
rdvSheet=function(fid,r,parent){if(parent&&aDesDispos(mesModeles())){S.cr=null;creneauSheet();return}return _rdvSheet(fid,r,parent)};

/* ---------- Accueil guidé d'une nouvelle doula ---------- */
function etapesDoula(){const D=S.doula,m=ME_DOULA.modeles||{};return [
  ['photo','Ma photo',!!D.photo,'params'],['infos','Mon téléphone et ma compagnie',!!(D.tel&&D.entreprise),'params'],['forfaits','Mes forfaits et mes prix',(m.forfaits||[]).length>0,'params'],
  ['dispo','Mes disponibilités',aDesDispos(m),'params'],['modeles','Mon contrat à mon image',!!(m.docs&&m.docs.contrat),'modeles'],['famille','Ma première famille',S.clients.length>0,'famille']]}
const _dAcc2=dAccueil;
dAccueil=function(){const E=etapesDoula(),faites=E.filter(e=>e[2]).length;if(faites===E.length||(ME_DOULA.modeles||{}).accueilFini)return _dAcc2();
  return '<div class="card" style="border-color:var(--accent)"><span class="script">Bienvenue</span><h2>Préparez votre espace</h2><p class="small">'+faites+' étape'+(faites>1?'s':'')+' sur '+E.length+'. Vos familles verront ces informations dans leur appli.</p><div class="bar"><i style="width:'+Math.round(faites/E.length*100)+'%"></i></div><div class="list">'+
    E.map(e=>'<button class="li" data-act="etape" data-v="'+e[3]+'" style="background:none;border-left:0;border-right:0;border-top:0;width:100%;text-align:left;cursor:pointer;color:inherit"><div class="ic">'+icon(e[2]?'fa-circle-check':'fa-circle',e[2]?'var(--sage-dk)':'var(--muted)')+'</div><div class="tx"><b>'+e[1]+'</b><span>'+(e[2]?'Fait':'À faire')+'</span></div>'+icon('fa-chevron-right','var(--muted)')+'</button>').join('')+'</div><button class="btn sm ghost" data-act="accueilFini">C\'est bon, cacher ce guide</button></div>'+_dAcc2()};

document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b||['INPUT','SELECT','TEXTAREA'].includes(b.tagName))return;const a=b.dataset.act,v=b.dataset.v;
  try{switch(a){
  case 'dispoSave':await dispoSave();return;
  case 'vacAjout':await vacAjout(b);return;
  case 'vacSuppr':if(b.dataset.c!=='1'){b.dataset.c='1';toast('Touchez encore pour retirer');return}await vacSuppr(v);return;
  case 'crJour':S.cr.note=($('#rvNote')||{}).value;S.cr.j=v;S.cr.t=null;creneauSheet();return;
  case 'crHeure':S.cr.note=($('#rvNote')||{}).value;S.cr.t=+v;document.querySelectorAll('[data-act=crHeure]').forEach(x=>x.classList.toggle('on',x===b));return;
  case 'crEnvoyer':{if(!S.cr||!S.cr.t){toast('Choisissez une heure');return}b.disabled=true;const {error}=await sb.from('fam_rdv').insert({famille_id:FAM.id,debut:new Date(S.cr.t).toISOString(),duree_min:dispoDe(mesModeles()).duree,type:$('#rvType').value,note:$('#rvNote').value||null,statut:'demande',demande_par:'parent'});
    if(error){toast('Pas envoyé : '+error.message);b.disabled=false;return}close();S.cr=null;await chargerEchanges();render();toast('Demande envoyée à votre doula');return}
  case 'etape':if(v==='params'){S.vue='params'}else if(v==='modeles'){S.vue=null;S.dtab='outils';S.dsub='modeles'}else{S.vue=null;S.dtab='clientes';S.openClient=null;render();clientForm();return}scrollTo(0,0);render();return;
  case 'accueilFini':{const m=Object.assign({},ME_DOULA.modeles||{},{accueilFini:true});if(await sauverModeles(m))render();return}
  }}catch(err){console.error(err);toast('Une erreur est survenue. Réessayez.')}});
