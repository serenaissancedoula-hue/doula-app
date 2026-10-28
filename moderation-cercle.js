/* Sérénaissance — modération du Cercle des mamans (propriétaire seulement).
   Signalements à traiter : masquer le message, suspendre l'accès au cercle, ou ignorer. Liste des accès suspendus (rétablir). */
(function(){
if(window.ESPACE!=='doula'||typeof DSUB==='undefined')return;
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let MOD=null,charge=false;
const admin=()=>!!(typeof MOI!=='undefined'&&MOI&&MOI.admin);
async function chargerMod(){
  if(!admin()||charge)return;charge=true;
  try{
    const [s,p]=await Promise.all([sb.from('chat_signalements').select('*').eq('traite',false).order('created_at'),sb.from('chat_profils').select('user_id,pseudo,emoji,suspendu')]);
    const profs={};(p.data||[]).forEach(x=>profs[x.user_id]=x);
    MOD={sig:s.data||[],profs,susp:(p.data||[]).filter(x=>x.suspendu)};
  }catch(e){MOD=MOD||{sig:[],profs:{},susp:[]}}
  charge=false;
}
const nom=id=>{const p=(MOD&&MOD.profs[id])||null;return p?E((p.emoji||'🌸')+' '+p.pseudo):'Une maman'};
function page(){
  if(!MOD){chargerMod().then(()=>{if(S.dsub==='cercle')render()});return sh('Cercle des mamans','Chargement…')}
  const sig=MOD.sig.map(x=>'<div class="card"><p class="xs muted" style="margin:0">'+E(new Date(x.created_at).toLocaleString('fr-CA',{dateStyle:'medium',timeStyle:'short'}))+' · Motif : '+E(x.motif||'—')+'</p><p style="margin:6px 0"><b>'+nom(x.auteur)+'</b> :</p><p class="papa-note" style="font-style:normal">« '+E(x.extrait||'(message supprimé)')+' »</p>'+(x.photo?'<img data-pm="'+E(x.photo)+'" alt="Photo signalée" style="max-width:100%;border-radius:12px;margin:0 0 8px">':'')+
    '<div class=\"row\" style="gap:6px;flex-wrap:wrap"><button class="btn sm" data-cmod="masquer" data-id="'+x.id+'">Masquer le message</button><button class="btn sm danger" data-cmod="suspendre" data-id="'+x.id+'">Masquer + suspendre l\'accès</button><button class="btn sm ghost" data-cmod="ignorer" data-id="'+x.id+'">Ignorer</button></div></div>').join('');
  const sus=MOD.susp.map(x=>'<div class="pf-l"><div><b>'+nom(x.user_id)+'</b></div><button class="btn sm ghost" data-cmod="retablir" data-u="'+x.user_id+'">Rétablir</button></div>').join('');
  return sh('Cercle des mamans','Signalements à lire et décisions')+
    (sig||'<div class="card tint"><p class="small" style="margin:0">Aucun signalement à traiter 🌿</p></div>')+
    (sus?'<div class="card"><span class="eyebrow acc">Accès suspendus</span>'+sus+'</div>':'')+
    '<button class="btn sm ghost" data-cmod="actualiser">Actualiser</button>';
}
DSUB.cercle=page;
async function photosMod(){const L=[...document.querySelectorAll('img[data-pm]')];for(const i of L){if(i.src)continue;const {data}=await sb.storage.from('chat-photos').createSignedUrl(i.dataset.pm,600);if(data&&data.signedUrl)i.src=data.signedUrl}}
const _rM=render;render=function(){const x=_rM.apply(this,arguments);if(S.dsub==='cercle')setTimeout(photosMod,50);return x};
if(typeof DOUT!=='undefined')DOUT.push(['cercle','fa-comments','Cercle des mamans','Signalements et modération']);
const _dOA=dOutils;dOutils=function(){if(!S.dsub&&!admin()){const k=DOUT.findIndex(x=>x[0]==='cercle');if(k>=0)DOUT.splice(k,1)}return _dOA.apply(this,arguments)};
const _da=dAccueil;
dAccueil=function(){let h=_da.apply(this,arguments);
  if(admin()){if(!MOD)chargerMod().then(()=>render());
    const n=MOD?MOD.sig.length:0;if(n)h='<button class="card tint" data-act="dgo" data-v="outils|cercle" style="width:100%;text-align:left;cursor:pointer;border:0;color:inherit;font:inherit"><div class="row between"><span><b>🚩 '+n+' signalement'+(n>1?'s':'')+' dans le cercle des mamans</b></span>'+icon('fa-chevron-right')+'</div></button>'+h}
  return h};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&admin()){MOD=null}});
document.addEventListener('click',async e=>{
  const b=e.target.closest&&e.target.closest('[data-cmod]');if(!b)return;e.preventDefault();e.stopPropagation();
  const a=b.dataset.cmod;let err=null;
  try{
    if(a==='masquer'||a==='suspendre'||a==='ignorer'){const r=await sb.rpc('chat_traiter',{p_signalement:b.dataset.id,p_masquer:a!=='ignorer',p_suspendre:a==='suspendre'});err=r.error;if(!err)toast(a==='suspendre'?'Message masqué, accès suspendu':a==='masquer'?'Message masqué':'Signalement classé')}
    else if(a==='retablir'){const r=await sb.rpc('chat_suspendre',{p_user:b.dataset.u,p_oui:false});err=r.error;if(!err)toast('Accès rétabli')}
    if(err){toast('Action impossible : '+err.message);return}
    MOD=null;await chargerMod();render();
  }catch(x){toast('Une erreur est survenue')}
},true);
})();
