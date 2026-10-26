/* Sérénaissance — annuaire et outils de la doula.
   1. Listes longues (filtres, mois, années) : une seule ligne qu'on fait défiler, avec des flèches ‹ ›, et la position est gardée quand on touche un filtre.
   2. Profil d'annuaire : services offerts et formations obligatoires (sinon les filtres ne peuvent pas la trouver).
   3. Nombre de familles par mois : les mois disponibles se calculent tout seuls selon les dates prévues de ses familles (ou à la main).
   4. Kilométrage facturé : oui ou non, combien par km, combien de km inclus (par déplacement ou par famille), et le montant à facturer par famille. */
(function(){
/* ---------- 1. défilement avec flèches ---------- */
const CIBLES='.an-filt,#pfMois,.seg,.ft-btns-l';
const MEM={};
function cle(el){return el.id||[...el.classList].join('.')}
function fleches(el){if(el.dataset.fl)return;el.dataset.fl='1';const w=document.createElement('div');w.className='fl-wrap';el.parentNode.insertBefore(w,el);w.appendChild(el);el.classList.add('fl-piste');
  const g=document.createElement('button'),d=document.createElement('button');g.type=d.type='button';g.className='fl-b fl-g';d.className='fl-b fl-d';g.setAttribute('aria-label','Défiler vers la gauche');d.setAttribute('aria-label','Défiler vers la droite');g.innerHTML='‹';d.innerHTML='›';w.append(g,d);
  const maj=()=>{const m=el.scrollWidth-el.clientWidth;g.hidden=el.scrollLeft<=4;d.hidden=el.scrollLeft>=m-4||m<=4};
  g.onclick=e=>{e.stopPropagation();el.scrollBy({left:-el.clientWidth*.7,behavior:'smooth'})};d.onclick=e=>{e.stopPropagation();el.scrollBy({left:el.clientWidth*.7,behavior:'smooth'})};
  el.addEventListener('scroll',()=>{MEM[cle(el)]=el.scrollLeft;maj()},{passive:true});
  if(MEM[cle(el)])el.scrollLeft=MEM[cle(el)];setTimeout(maj,30)}
function appliquer(){document.querySelectorAll(CIBLES).forEach(el=>{if(el.children.length>3)fleches(el)})}
new MutationObserver(()=>{try{appliquer()}catch(e){}}).observe(document.documentElement,{childList:true,subtree:true});
/* ---------- 2 à 4 : espace doula ---------- */
if(window.ESPACE==='parent'){injecterStyle();return}
const QUAL=[['doula','Doula certifiée'],['ibclc','Consultante en lactation (IBCLC)'],['marraine','Marraine d\'allaitement'],['deuil','Formation en deuil périnatal'],['aide','Relation d\'aide'],['yoga','Yoga prénatal / postnatal'],['rcr','Premiers soins / RCR']];
const brou=()=>Object.assign({},(ME_DOULA||{}).annuaire_pub||{},(ME_DOULA||{}).annuaire_brouillon||{});
const reglages=()=>((ME_DOULA||{}).modeles||{});
async function sauverModeles(patch){const m=Object.assign({},ME_DOULA.modeles||{},patch);const {error}=await sb.from('fam_doulas').update({modeles:m}).eq('id',ME_DOULA.id);if(error){toast('Pas enregistré : '+error.message);return false}ME_DOULA.modeles=m;return true}
/* capacité et mois disponibles */
function moisSuivants(){const L=[],d=new Date();d.setDate(1);for(let i=0;i<12;i++){L.push(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'));d.setMonth(d.getMonth()+1)}return L}
function parMois(){const N={};(S.clients||[]).forEach(c=>{if(c.archive||c.naiss)return;const d=parseD(c.dpa);if(!d)return;const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');N[k]=(N[k]||0)+1});return N}
function moisAuto(){const cap=+reglages().capacite||0;if(!cap)return null;const N=parMois();return moisSuivants().filter(k=>(N[k]||0)<cap)}
window.anMoisAuto=moisAuto;
async function synchroDispo(){try{const R=reglages();if(R.dispoMode!=='auto'||!ME_DOULA||!ME_DOULA.annuaire_pub)return;const L=moisAuto();if(!L)return;const v=L.join(',');if(v===(ME_DOULA.annuaire_pub.dispo_mois||''))return;
  const {data,error}=await sb.rpc('fam_maj_dispo',{p_mois:v});if(!error&&data&&data.ok){ME_DOULA.annuaire_pub.dispo_mois=v;if(ME_DOULA.annuaire_brouillon)ME_DOULA.annuaire_brouillon.dispo_mois=v}}catch(e){}}
if(typeof chargerDoula==='function'){const _cd=chargerDoula;chargerDoula=async function(){const r=await _cd.apply(this,arguments);setTimeout(synchroDispo,1500);return r}}
/* ajouts au formulaire de profil d'annuaire */
const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(S.role!=='doula')return x;const app=document.getElementById('app');
  const serv=app.querySelector('.pfServ');if(serv&&!app.querySelector('.ad-qual')){const B=brou(),q=String(B.qualifs||'').split(',');const bloc=serv.closest('div').parentNode;
    const t=document.createElement('template');t.innerHTML='<div class="ad-qual"><span class="small"><b>Mes formations et qualifications *</b></span><p class="xs muted" style="margin:2px 0 6px">Cochez au moins une : les familles filtrent les doulas avec ces informations.</p><div class="row" style="gap:6px;flex-wrap:wrap">'+QUAL.map(([k,l])=>'<label class="check" style="margin:0"><input type="checkbox" class="pfQual" value="'+k+'" '+(q.includes(k)?'checked':'')+'><span class="small">'+l+'</span></label>').join('')+'</div></div>';bloc.after(t.content);
    const titre=[...bloc.querySelectorAll('b')].find(b=>/Mes services/.test(b.textContent));if(titre&&!/\*/.test(titre.textContent))titre.textContent='Mes services *'}
  const mo=app.querySelector('#pfMois');if(mo&&!app.querySelector('.ad-cap')){const R=reglages();const t=document.createElement('template');
    t.innerHTML='<div class="ad-cap soft" style="margin:8px 0;gap:8px"><label class="f" style="margin:0">Combien de familles prenez-vous par mois (date prévue) ?<input type="number" id="adCap" min="1" max="30" inputmode="numeric" value="'+esc(R.capacite||'')+'" placeholder="Ex. : 3"></label><div class="tri"><button type="button" class="chip '+(R.dispoMode==='auto'?'on':'')+'" data-ad-mode="auto">Mise à jour automatique</button><button type="button" class="chip '+(R.dispoMode!=='auto'?'on':'')+'" data-ad-mode="manuel">Je choisis moi-même</button></div><p class="xs muted" style="margin:0" id="adCapTxt">'+capTexte()+'</p></div>';
    mo.closest('.fl-wrap')?mo.closest('.fl-wrap').before(t.content):mo.before(t.content)}
  if(S.dsub==='km'&&!app.querySelector('.ad-km'))kmCarte(app);
  if(S.dsub==='annuaire'&&ME_DOULA&&ME_DOULA.annuaire_pub&&!ME_DOULA.annuaire_pub.services&&!app.querySelector('.ad-alerte')){const t=document.createElement('template');t.innerHTML='<div class="banner acc ad-alerte" style="margin:0 0 12px">'+icon('fa-circle-exclamation')+'<div class="small">Votre profil n\'a pas encore de <b>services</b> ni de <b>formations</b> : les familles qui utilisent les filtres ne vous voient pas. Cochez-les plus bas, puis enregistrez.</div></div>';const sh=app.querySelector(':scope>.sh');if(sh)sh.after(t.content)}
}catch(e){}return x};
function capTexte(){const R=reglages();if(!R.capacite)return 'Indiquez un nombre pour que vos mois disponibles se calculent selon vos familles.';const N=parMois(),L=moisSuivants().slice(0,6);
  return 'Vos familles par mois : '+L.map(k=>{const[a,m]=k.split('-');return new Date(+a,+m-1,1).toLocaleDateString('fr-CA',{month:'short'}).replace('.','')+' '+(N[k]||0)+'/'+R.capacite}).join(' · ')+(R.dispoMode==='auto'?'. Les mois complets disparaissent de l\'annuaire tout seuls.':'')}
document.addEventListener('click',async e=>{let b;
  if(b=e.target.closest('[data-ad-mode]')){e.stopPropagation();const cap=+((document.getElementById('adCap')||{}).value||0);const mode=b.dataset.adMode;if(mode==='auto'&&!cap){toast('Indiquez d\'abord combien de familles vous prenez par mois');return}
    if(!(await sauverModeles({capacite:cap||null,dispoMode:mode})))return;b.parentNode.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c===b));
    if(mode==='auto'){const L=moisAuto()||[];if(window.anSetMois)window.anSetMois(L);toast('Vos mois disponibles suivent maintenant vos familles')}
    const t=document.getElementById('adCapTxt');if(t)t.textContent=capTexte();return}
  /* enregistrement du profil : services et formations obligatoires */
  if(b=e.target.closest('[data-act="anSauverProfil"]')){const s=document.querySelectorAll('.pfServ:checked').length,q=[...document.querySelectorAll('.pfQual:checked')].map(x=>x.value);
    if(!s){e.stopImmediatePropagation();e.preventDefault();toast('Cochez au moins un service offert');document.querySelector('.pfServ')?.scrollIntoView({block:'center'});return}
    if(!q.length){e.stopImmediatePropagation();e.preventDefault();toast('Cochez au moins une formation ou qualification');document.querySelector('.pfQual')?.scrollIntoView({block:'center'});return}
    const cap=+((document.getElementById('adCap')||{}).value||0);if(cap&&cap!==+reglages().capacite)await sauverModeles({capacite:cap});
    if(reglages().dispoMode==='auto'){const L=moisAuto();if(L&&window.anSetMois)window.anSetMois(L)}
    /* les qualifications voyagent avec le profil */
    window._adQual=q.join(',')}
},true);
/* ajouter les qualifications au brouillon envoyé */
if(typeof sb!=='undefined'){const _from=sb.from.bind(sb);sb.from=function(t){const q=_from(t);if(t!=='fam_doulas'||!window._adQual)return q;const _u=q.update.bind(q);q.update=function(patch){try{if(patch&&patch.annuaire_brouillon&&window._adQual!=null){patch.annuaire_brouillon.qualifs=window._adQual;window._adQual=null}}catch(e){}return _u(patch)};return q}}
/* ---------- 4. kilométrage facturé ---------- */
function kmCarte(app){const R=reglages().km||{};const sh=app.querySelector(':scope>.sh');const t=document.createElement('template');
  const fact=R.facture===true;
  t.innerHTML='<div class="card ad-km"><span class="eyebrow acc">Mes frais de déplacement</span><div class="tri" style="margin:6px 0"><button type="button" class="chip '+(fact?'on':'')+'" data-ad-kmf="1">Je facture les km</button><button type="button" class="chip '+(!fact?'on':'')+'" data-ad-kmf="0">Je ne facture pas</button></div>'+
   (fact?'<div class="grid2"><label class="f">Prix par km ($)<input type="number" id="adKt" step="0.01" min="0" inputmode="decimal" value="'+esc(R.taux??'')+'" placeholder="Ex. : 0,50"></label><label class="f">Km inclus (gratuits)<input type="number" id="adKi" min="0" inputmode="numeric" value="'+esc(R.inclus??'')+'" placeholder="Ex. : 30"></label></div><div class="tri" style="margin:4px 0 8px"><button type="button" class="chip '+(R.par!=='famille'?'on':'')+'" data-ad-kmp="deplacement">Inclus à chaque déplacement</button><button type="button" class="chip '+(R.par==='famille'?'on':'')+'" data-ad-kmp="famille">Inclus pour tout l\'accompagnement</button></div><button class="btn sm" data-ad-kms="1">Enregistrer</button>'+aFacturer(R):'<p class="xs muted" style="margin:0">Vos déplacements sont quand même notés pour vos impôts.</p>')+'</div>';
  if(sh)sh.after(t.content);else app.prepend(t.content)}
function aFacturer(R){if(!R.taux)return '';const L=(S.clients||[]).filter(c=>!c.archive&&(c.km||[]).length);if(!L.length)return '<p class="xs muted" style="margin:8px 0 0">Notez vos déplacements : le montant à facturer à chaque famille s\'affiche ici.</p>';
  const lignes=L.map(c=>{const K=(c.km||[]).map(k=>+k.km||0);let fac=0;if(R.par==='famille')fac=Math.max(0,K.reduce((a,b)=>a+b,0)-(+R.inclus||0));else fac=K.reduce((a,k)=>a+Math.max(0,k-(+R.inclus||0)),0);
    return '<div class="li"><div class="ic">'+icon('fa-car')+'</div><div class="tx"><b>'+esc((typeof cName==='function'?cName(c):c.nom)||'Famille')+'</b><span>'+Math.round(K.reduce((a,b)=>a+b,0))+' km notés · '+Math.round(fac)+' km facturables</span></div><b>'+(fac*R.taux).toFixed(2).replace('.',',')+' $</b></div>'}).join('');
  return '<span class="eyebrow acc" style="display:block;margin-top:12px">À facturer par famille</span><div class="list">'+lignes+'</div><p class="xs muted">Ajoutez ce montant au solde de la famille dans Paiements, et indiquez vos frais de déplacement dans votre contrat.</p>'}
document.addEventListener('click',async e=>{let b;
  if(b=e.target.closest('[data-ad-kmf]')){e.stopPropagation();const km=Object.assign({},reglages().km||{},{facture:b.dataset.adKmf==='1'});if(await sauverModeles({km})){document.querySelector('.ad-km')?.remove();render()}return}
  if(b=e.target.closest('[data-ad-kmp]')){e.stopPropagation();const km=Object.assign({},reglages().km||{},{par:b.dataset.adKmp});if(await sauverModeles({km})){document.querySelector('.ad-km')?.remove();render()}return}
  if(e.target.closest('[data-ad-kms]')){e.stopPropagation();const t=parseFloat(String(document.getElementById('adKt').value).replace(',','.')),i=parseInt(document.getElementById('adKi').value||'0',10);if(!(t>=0)){toast('Entrez votre prix par km');return}
    const km=Object.assign({},reglages().km||{},{taux:t,inclus:i||0});if(await sauverModeles({km})){toast('Frais de déplacement enregistrés');document.querySelector('.ad-km')?.remove();render()}return}},true);
injecterStyle();
function injecterStyle(){const st=document.createElement('style');st.textContent='.fl-wrap{position:relative;margin:4px 0}.fl-piste{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto;scroll-behavior:smooth;scrollbar-width:none;gap:6px;padding:2px 30px 4px 2px}.fl-piste::-webkit-scrollbar{display:none}.fl-piste>*{flex:none}'+
  '.fl-b{position:absolute;top:50%;transform:translateY(-50%);width:30px;height:30px;border-radius:50%;border:1px solid var(--line,#e3d3c6);background:var(--card,#fff);color:var(--accent);font-size:20px;line-height:1;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.12);z-index:2;cursor:pointer;padding:0}.fl-b[hidden]{display:none}.fl-g{left:-4px}.fl-d{right:-4px}.ad-qual{margin-top:10px}';document.head.appendChild(st)}
})();
