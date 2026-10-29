/* Sérénaissance — demande d'avis sur l'appli (5 étoiles + commentaire), à la prochaine ouverture.
   Doulas et parents. Une seule réponse par campagne (table fam_avis_appli) ; « Plus tard » redemande à l'ouverture suivante. */
(function(){
const CAMP='appli-2026-10',EN=window.LANG==='en',SS='sere-avis-plustard-'+CAMP,LS='sere-avis-fait-'+CAMP;
const T=EN?{t:'How do you like the app?',s:'Your opinion helps us improve Sérénaissance. It only takes a few seconds.',c:'A comment? (optional)',ph:'What you like, what is missing…',env:'Send',tard:'Later',jamais:'Don\'t ask me again',merci:'Thank you for your review! 💛',choisir:'Choose 1 to 5 stars',n:['Very disappointed','Disappointed','Okay','Very good','Excellent!']}
 :{t:'Comment trouvez-vous l\'appli ?',s:'Votre avis nous aide à améliorer Sérénaissance. Ça ne prend que quelques secondes.',c:'Un commentaire ? (facultatif)',ph:'Ce que vous aimez, ce qui manque…',env:'Envoyer',tard:'Plus tard',jamais:'Ne plus me demander',merci:'Merci pour votre avis ! 💛',choisir:'Choisissez de 1 à 5 étoiles',n:['Très déçue','Déçue','Correct','Très bien','Excellent !']};
const get=(s,k)=>{try{return s.getItem(k)}catch(e){return null}},set=(s,k,v)=>{try{s.setItem(k,v)}catch(e){}};
let essais=0,verifie=false;
function bloque(){return ['cguOv','mdp1','profilReq','ecranAbo','abPaywall','felic','avisEtoiles'].some(i=>document.getElementById(i))||document.querySelector('.sheet,.modal.open,#cguOv')}
async function moiU(){try{const {data}=await sb.auth.getSession();return data&&data.session&&data.session.user}catch(e){return null}}
async function deja(){try{const us=await moiU();const id=us&&us.id;if(!id)return true;
  const {data,error}=await sb.from('fam_avis_appli').select('id').eq('user_id',id).eq('campagne',CAMP).limit(1);if(error)return true;return !!(data&&data.length)}catch(e){return true}}
function nomMoi(){try{if(window.ESPACE!=='parent'&&typeof ME_DOULA!=='undefined'&&ME_DOULA)return [ME_DOULA.prenom,ME_DOULA.nom].filter(Boolean).join(' ');
  if(typeof S!=='undefined'&&S.parent)return [S.parent.prenom,S.parent.nom].filter(Boolean).join(' ')}catch(e){}return ''}
async function enregistrer(o){const us=await moiU();
  return sb.from('fam_avis_appli').insert(Object.assign({campagne:CAMP,espace:window.ESPACE==='parent'?'parent':'doula',nom:nomMoi()||null,courriel:us&&us.email||null},o))}
function ouvrir(){if(document.getElementById('avisEtoiles'))return;const o=document.createElement('div');o.id='avisEtoiles';o.setAttribute('role','dialog');
  o.innerHTML='<div class="ae-fond"></div><div class="ae-carte"><img class="ae-logo" src="img/logo-icone.png" alt=""><h2>'+T.t+'</h2><p class="small muted">'+T.s+'</p>'+
    '<div class="ae-etoiles" role="radiogroup">'+[1,2,3,4,5].map(n=>'<button type="button" data-n="'+n+'" aria-label="'+n+'">★</button>').join('')+'</div><div class="ae-lib xs muted">'+T.choisir+'</div>'+
    '<label class="f" style="text-align:left">'+T.c+'<textarea id="aeTxt" rows="3" placeholder="'+T.ph+'"></textarea></label>'+
    '<button class="btn" id="aeEnv" disabled>'+T.env+'</button><button class="btn sm ghost" id="aeTard">'+T.tard+'</button><button class="ae-jamais" id="aeJamais">'+T.jamais+'</button></div>';
  document.body.appendChild(o);let n=0;
  const maj=()=>{o.querySelectorAll('.ae-etoiles button').forEach(b=>b.classList.toggle('on',+b.dataset.n<=n));o.querySelector('.ae-lib').textContent=n?T.n[n-1]:T.choisir;o.querySelector('#aeEnv').disabled=!n};
  o.querySelectorAll('.ae-etoiles button').forEach(b=>b.onclick=()=>{n=+b.dataset.n;maj()});
  const fermer=()=>{o.classList.add('sort');setTimeout(()=>o.remove(),200)};
  o.querySelector('#aeTard').onclick=()=>{set(sessionStorage,SS,'1');fermer()};
  o.querySelector('.ae-fond').onclick=()=>{set(sessionStorage,SS,'1');fermer()};
  o.querySelector('#aeJamais').onclick=async()=>{set(localStorage,LS,'1');fermer();try{await enregistrer({refuse:true})}catch(e){}};
  o.querySelector('#aeEnv').onclick=async e=>{const b=e.currentTarget;b.disabled=true;
    const {error}=await enregistrer({etoiles:n,commentaire:(o.querySelector('#aeTxt').value||'').trim()||null});
    if(error&&!/duplicate|unique/i.test(error.message)){b.disabled=false;try{toast((EN?'Not sent: ':'Pas envoyé : ')+error.message)}catch(x){}return}
    set(localStorage,LS,'1');fermer();try{toast(T.merci)}catch(x){}}}
async function verifier(){if(verifie)return;if(get(localStorage,LS)||get(sessionStorage,SS)){verifie=true;return}
  if(typeof MOI==='undefined'||!MOI||typeof S==='undefined'||!S.role){if(++essais<60)setTimeout(verifier,2000);return}
  if(MOI.admin){verifie=true;return}
  if(bloque()){if(++essais<90)setTimeout(verifier,3000);return}
  verifie=true;if(await deja()){set(localStorage,LS,'1');return}
  setTimeout(()=>{if(bloque()){verifie=false;essais=0;setTimeout(verifier,4000);return}ouvrir()},2500)}
setTimeout(verifier,4000);
const st=document.createElement('style');st.textContent=
 '#avisEtoiles{position:fixed;inset:0;z-index:99990;display:flex;align-items:center;justify-content:center;padding:20px;animation:aeIn .25s ease}#avisEtoiles.sort{opacity:0;transition:opacity .2s}'+
 '.ae-fond{position:absolute;inset:0;background:rgba(40,25,20,.45)}.ae-carte{position:relative;width:100%;max-width:380px;background:var(--card,#fff);border-radius:26px;padding:22px 20px 14px;box-shadow:0 18px 50px rgba(40,25,20,.25);display:flex;flex-direction:column;gap:10px;text-align:center}'+
 '.ae-logo{width:58px;height:58px;margin:0 auto;opacity:.9}.ae-carte h2{margin:0;font-size:1.35rem}.ae-etoiles{display:flex;justify-content:center;gap:6px;margin-top:4px}'+
 '.ae-etoiles button{border:0;background:none;font-size:2.6rem;line-height:1;color:#e3d6cf;cursor:pointer;padding:2px;transition:transform .15s,color .15s}.ae-etoiles button.on{color:#e0a43c}.ae-etoiles button:active{transform:scale(1.2)}'+
 '.ae-lib{min-height:1.2em;font-weight:600}.ae-carte textarea{width:100%;border-radius:14px}.ae-jamais{border:0;background:none;color:var(--muted,#8a7a72);font-size:.78rem;text-decoration:underline;cursor:pointer;padding:4px}'+
 '@keyframes aeIn{from{opacity:0}to{opacity:1}}';
document.head.appendChild(st);
})();
