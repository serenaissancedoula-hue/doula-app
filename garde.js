/* Sérénaissance — Espace Doula : chaque doula choisit sa période de garde (ex. 37 à 41 semaines, 38 à 42…).
   Gardée dans ME_DOULA.modeles.garde = {de, a}. Utilisée partout par gardeSA() (doula.js).
   À l'enregistrement, « 38 semaines » dans ses modèles de documents (contrat, lettre des forfaits) est remplacé par sa période. */
(function(){
if(window.ESPACE==='parent'||typeof carteDispos!=='function')return;
const opt=(min,max,v)=>{let o='';for(let i=min;i<=max;i++)o+='<option value="'+i+'"'+(i===v?' selected':'')+'>'+i+' semaines</option>';return o};
function carteGarde(){const G=gardeSA();
  return '<div class="card" id="carteGarde"><span class="eyebrow acc">Ma période de garde</span><p class="xs muted">Les semaines où vous êtes disponible 24 h sur 24 pour la naissance. L\'appli s\'en sert pour « En garde », l\'agenda, l\'accueil et vos documents.</p>'+
   '<div class="grid2"><label class="f">Début<select id="gdDe">'+opt(34,41,G.de)+'</select></label><label class="f">Fin<select id="gdA">'+opt(39,43,G.a)+'</select></label></div>'+
   '<p class="xs muted" id="gdTxt">Garde de '+G.de+' à '+G.a+' semaines de grossesse.</p><button class="btn" data-act="gardeSave">'+icon('fa-check')+'Enregistrer ma garde</button></div>'}
const _cd=carteDispos;carteDispos=function(){return carteGarde()+_cd.apply(this,arguments)};
function majModeles(m,de,a){try{const docs=Object.assign({},m.docs||{});let n=0;
  Object.keys(DOC_TYPES||{}).forEach(k=>{const t=docs[k]!=null?docs[k]:(DOC_TYPES[k]&&DOC_TYPES[k].texte);if(typeof t!=='string')return;
    const t2=t.replace(/\b(3[4-9]|4[0-1]) (à|a) (39|4[0-3]) semaines/g,de+' à '+a+' semaines').replace(/(À partir de |à partir de |dès |Dès )(3[4-9]|4[0-1]) semaines/g,(x,p)=>p+de+' semaines');
    if(t2!==t){docs[k]=t2;n++}});m.docs=docs;return n}catch(e){return 0}}
document.addEventListener('change',e=>{if(e.target.id!=='gdDe'&&e.target.id!=='gdA')return;const de=+document.getElementById('gdDe').value,a=+document.getElementById('gdA').value,t=document.getElementById('gdTxt');
  if(t)t.textContent=a<=de?'La fin doit être après le début.':'Garde de '+de+' à '+a+' semaines de grossesse.'});
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act="gardeSave"]');if(!b)return;e.stopPropagation();
  const de=+document.getElementById('gdDe').value,a=+document.getElementById('gdA').value;if(!(a>de)){toast('La fin de la garde doit être après le début');return}
  b.disabled=true;const m=Object.assign({},ME_DOULA.modeles||{});m.garde={de,a};const n=majModeles(m,de,a);
  const {error}=await sb.from('fam_doulas').update({modeles:m}).eq('id',ME_DOULA.id);b.disabled=false;
  if(error){toast('Pas enregistré : '+error.message);return}ME_DOULA.modeles=m;toast('Garde : '+de+' à '+a+' semaines'+(n?' · contrat mis à jour':''));render()},true);
})();
