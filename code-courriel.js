/* Sérénaissance — inscription et connexion avec un CODE reçu par courriel (au lieu d'un lien) :
   la personne reste dans l'appli, entre le code à 6 chiffres, et son espace s'ouvre. Fonctionne aussi dans l'appli installée sur l'écran d'accueil. */
(function(){
let DEM=null;
window.ecranCode=function(courriel,corps){DEM={courriel:String(courriel||'').trim().toLowerCase(),corps};
  try{$('#tabs').innerHTML='';const g=$('#gear');if(g)g.hidden=true}catch(e){}
  $('#app').innerHTML='<div class="card cc-carte" style="max-width:480px;margin:0 auto;width:100%"><span class="script">Presque fini</span><h2>Entrez votre code</h2>'+
    '<p class="small">Un code vient de partir à <b>'+esc(DEM.courriel)+'</b>. Ouvrez vos courriels (regardez aussi les indésirables) et entrez-le ici. Pas besoin de toucher de lien.</p>'+
    '<input id="ccCode" class="cc-code" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="••••••" aria-label="Code reçu par courriel">'+
    '<button class="btn" id="ccOk">Valider</button><p class="xs muted" id="ccMsg" style="min-height:1.2em;margin:6px 0 0"></p>'+
    '<div class="row between" style="margin-top:6px;gap:8px;flex-wrap:wrap"><button class="btn sm ghost" id="ccRenv">Renvoyer un code</button><button class="btn sm ghost" id="ccRetour">Changer de courriel</button></div></div>';
  const i=$('#ccCode');setTimeout(()=>i&&i.focus(),100);
  i.addEventListener('input',()=>{i.value=i.value.replace(/\D/g,'');if(i.value.length>=6&&i.value.length===(+i.dataset.n||6))valider()});
  i.addEventListener('keydown',e=>{if(e.key==='Enter')valider()});
  $('#ccOk').onclick=valider;
  $('#ccRetour').onclick=()=>{DEM=null;try{ecranConnexion('')}catch(e){location.reload()}};
  $('#ccRenv').onclick=async()=>{const b=$('#ccRenv');b.disabled=true;const {data}=await sb.functions.invoke('fam-acces',{body:DEM.corps});$('#ccMsg').textContent=data&&data.ok?'Un nouveau code est parti. Utilisez le plus récent.':((data&&data.erreur)||'Réessayez dans un moment');setTimeout(()=>{b.disabled=false},20000)}};
async function valider(){const i=$('#ccCode'),b=$('#ccOk'),m=$('#ccMsg'),code=(i.value||'').replace(/\D/g,'');if(code.length<6){m.textContent='Le code a 6 chiffres.';return}
  if(b.disabled)return;b.disabled=true;b.textContent='Vérification…';m.textContent='';let ok=null;
  for(const type of ['invite','magiclink','email','signup']){try{const {data,error}=await sb.auth.verifyOtp({email:DEM.courriel,token:code,type});if(!error&&data&&data.session){ok=type;break}}catch(e){}}
  if(!ok){b.disabled=false;b.textContent='Valider';m.textContent='Ce code ne fonctionne pas ou a expiré. Vérifiez les chiffres, ou touchez « Renvoyer un code ».';i.select();return}
  S.nouveauCompte=ok==='invite'||ok==='signup';DEM=null;$('#app').innerHTML='<p class="small muted" style="text-align:center;padding:40px">Ouverture de votre espace…</p>';
  try{await demarrer()}catch(e){location.reload()}}
const st=document.createElement('style');st.textContent='.cc-carte{display:flex;flex-direction:column;gap:10px}.cc-code{font:700 1.9rem/1 ui-monospace,Menlo,monospace!important;letter-spacing:.45em;text-align:center;padding:14px 8px!important;border-radius:16px!important}';document.head.appendChild(st);
})();
