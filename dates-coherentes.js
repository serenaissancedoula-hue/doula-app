/* Sérénaissance — des dates cohérentes partout (famille et doula) :
   dernières règles et échographie dans le passé (moins de 10 mois), date prévue d'accouchement dans les 10 prochains mois,
   naissance de bébé et premières fois dans le passé, etc. Une date impossible est refusée avec un message clair,
   et l'appli prévient si la date prévue ne concorde pas avec les dernières règles. */
(function(){
const J=864e5,auj=()=>{const d=new Date();d.setHours(0,0,0,0);return +d},iso=t=>{const d=new Date(t),p=x=>String(x).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())},
  lire=v=>{if(!v)return null;const d=new Date(v+'T00:00');return isNaN(d)?null:+d},fd=t=>new Date(t).toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'});
/* [min (jours depuis aujourd'hui), max, message] */
const DDR=[-301,0,'La date des dernières règles doit être dans le passé, il y a moins de 10 mois.'],
  REG=[-400,0,'La date des règles doit être aujourd\'hui ou dans le passé.'],
  ECHO=[-301,0,'La date de l\'échographie doit être aujourd\'hui ou dans le passé, pendant cette grossesse.'],
  DPA=[-42,301,'La date prévue d\'accouchement doit être dans les 10 prochains mois.'],
  NAISS=[-6*366,0,'La date de naissance de bébé doit être aujourd\'hui ou dans le passé.'],
  ENF=[-30*366,0,'La date de naissance doit être dans le passé.'],
  PASSE=[-6*366,0,'Cette date ne peut pas être dans le futur.'];
const PAR_ID={pf_ed:ECHO,pf_ddr:DDR,ft_d:REG,ft_p1:REG,ft_p2:REG,pf_dpa:DPA,deDpa:DPA,agDpa:DPA,pf_bd:NAISS,ft_nd:NAISS,b_date:NAISS,en_d:ENF,dt_d:PASSE,vcD:PASSE};
function regle(t){if(!t||t.type!=='date')return null;if(PAR_ID[t.id])return PAR_ID[t.id];const p=t.dataset.p||'';
  if(/(^|\.)ddr$/.test(p))return DDR;if(/echoDate$/.test(p))return ECHO;if(/(dpaEquipe|calc\.dpa|tmp\.dpa)$/.test(p))return DPA;
  if(/naissance\.date$|\.naiss$/.test(p))return NAISS;if(/firsts\./.test(p))return PASSE;return null}
function bornes(t){const r=regle(t);if(!r||t.dataset.dc)return;t.dataset.dc='1';t.min=iso(auj()+r[0]*J);t.max=iso(auj()+r[1]*J)}
function balayer(n){(n.querySelectorAll?n.querySelectorAll('input[type=date]'):[]).forEach(bornes)}
new MutationObserver(m=>{for(const x of m)x.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches&&n.matches('input[type=date]'))bornes(n);else balayer(n)}})}).observe(document.documentElement,{childList:true,subtree:true});
balayer(document);
document.addEventListener('focusin',e=>{const t=e.target;if(t&&t.type==='date')t.dataset.avant=t.value},true);
function msg(m){try{toast(m)}catch(e){alert(m)}}
/* refuser une date impossible avant qu'elle soit enregistrée */
window.addEventListener('change',e=>{const t=e.target,r=regle(t);if(!r||!t.value)return;const v=lire(t.value);if(v==null)return;
  if(v<auj()+r[0]*J||v>auj()+r[1]*J){e.stopImmediatePropagation();e.preventDefault();t.value=t.dataset.avant||'';msg(r[2]);t.classList.add('dc-err');setTimeout(()=>t.classList.remove('dc-err'),2500);return}
  /* date prévue et dernières règles qui ne concordent pas : on prévient, sans bloquer */
  try{const P=(typeof S!=='undefined'&&S&&S.parent)||{};const p=t.dataset.p||t.id;let ddr=null,dpa=null;
    if(/ddr$/.test(p)){ddr=v;dpa=lire(P.dpaEquipe||(document.getElementById('pf_dpa')||{}).value)}else if(/dpa/i.test(p)){dpa=v;ddr=lire(P.ddr||(document.getElementById('pf_ddr')||{}).value)}
    if(ddr&&dpa){const att=ddr+280*J,ec=Math.round((dpa-att)/J);if(Math.abs(ec)>21)setTimeout(()=>msg('Attention : d\'après vos dernières règles, la date prévue serait vers le '+fd(att)+' ('+Math.abs(ec)+' jours d\'écart). Vérifiez vos dates.'),300)}}catch(x){}},true);
/* semaines à l'échographie : entre 4 et 42 */
window.addEventListener('change',e=>{const t=e.target;if(!t||!/echoSA$/.test(t.dataset.p||''))return;const n=+t.value;if(t.value!==''&&(!(n>=4&&n<=42)||n!==Math.round(n))){e.stopImmediatePropagation();t.value='';msg('Le nombre de semaines à l\'échographie doit être entre 4 et 42.')}},true);
/* avant d'enregistrer une fenêtre : toutes ses dates doivent être possibles */
window.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.sheet .btn:not(.ghost), .sheet button[data-pf-gsave]');if(!b)return;const sh=b.closest('.sheet');
  for(const t of sh.querySelectorAll('input[type=date]')){const r=regle(t),v=lire(t.value);if(r&&v!=null&&(v<auj()+r[0]*J||v>auj()+r[1]*J)){e.stopImmediatePropagation();e.preventDefault();msg(r[2]);t.classList.add('dc-err');t.focus();return}}},true);
const st=document.createElement('style');st.textContent='.dc-err{outline:2px solid #c0503c!important;outline-offset:1px}';document.head.appendChild(st);
})();
