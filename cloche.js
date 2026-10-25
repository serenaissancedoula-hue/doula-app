/* Sérénaissance — cloche de notifications en haut (rendez-vous, documents ; les messages vont dans la bulle de chat) ; Paramètres est dans la barre du bas. */
(function(){
const g=document.getElementById('gear');if(!g)return;
g.setAttribute('data-act','cloche');g.setAttribute('aria-label','Notifications');g.innerHTML='<i class="fa-solid fa-bell"></i><span class="badge" id="clocheN" hidden style="top:-3px;left:auto;right:-3px"></span>';g.style.position='relative';
let ADMIN_N=0;
function items(){const L=[];
  try{const proche=r=>r.statut!=='annule'&&r.statut!=='demande'&&new Date(r.debut)>Date.now()&&new Date(r.debut)-Date.now()<=24*3600e3;
    const quand=r=>{const d=new Date(r.debut);return (d.toDateString()===new Date().toDateString()?'aujourd\'hui':'demain')+' à '+String(d.getHours()).padStart(2,'0')+'h'+String(d.getMinutes()).padStart(2,'0')};
    if(S.role==='parent')RDV.filter(proche).forEach(r=>L.push(['fa-bell','Rappel : '+r.type+' '+quand(r),'tab','madoula']));
    else CRDV.filter(proche).forEach(r=>{const c=(S.clients||[]).find(x=>x.id===r.famille_id);L.push(['fa-bell','Rappel : '+r.type+' '+quand(r)+' · '+(c?(c.nom||c.prenom||'une famille'):'une famille'),'client',r.famille_id,'rdvs'])})}catch(e){}
  try{if(S.role==='parent'){/* les messages s'affichent seulement dans la bulle de chat (en bas à droite), pas dans la cloche */
      const d=DOCS.filter(x=>x.statut==='a_remplir').length;if(d)L.push(['fa-file-signature',d+' document'+(d>1?'s':'')+' à remplir','tab','madoula'])}
    else{const nom=id=>{const c=(S.clients||[]).find(x=>x.id===id);return c?(c.nom||c.prenom||'une famille'):'une famille'};
      CRDV.filter(r=>r.statut==='demande'&&new Date(r.debut)>Date.now()).forEach(r=>L.push(['fa-calendar-plus','Demande de rendez-vous · '+nom(r.famille_id)+' · à accepter, refuser ou déplacer','client',r.famille_id,'rdvs']));
      Object.values(CDOCS).flat().filter(d=>d.statut==='a_signer_doula').forEach(d=>L.push(['fa-signature','Document à signer · '+nom(d.famille_id),'client',d.famille_id,'docs']));
      if(typeof SUP_NONLUS!=='undefined'&&SUP_NONLUS&&!(MOI&&MOI.admin))L.push(['fa-headset','Réponse de Sérénaissance','dgo','outils|support']);
      if(MOI&&MOI.admin&&ADMIN_N)L.push(['fa-inbox',ADMIN_N+' message'+(ADMIN_N>1?'s':'')+' reçu'+(ADMIN_N>1?'s':'')+' (support, problèmes)','dgo','outils|proprio'])}}catch(e){}
  return L}
function maj(){const n=items().length;try{const R=(S.role==='parent'?RDV:CRDV)||[];const pr=R.filter(r=>r.statut!=='annule'&&r.statut!=='demande'&&new Date(r.debut)>Date.now()&&new Date(r.debut)-Date.now()<=24*3600e3&&!sessionStorage.getItem('rap'+r.id));if(pr.length){pr.forEach(r=>sessionStorage.setItem('rap'+r.id,1));toast('Rappel : vous avez un rendez-vous dans les prochaines 24 h')}}catch(e){}const b=document.getElementById('clocheN');if(b){b.hidden=!n;b.textContent=n>9?'9+':n}}
async function adminN(){try{if(!(MOI&&MOI.admin))return;const {count}=await sb.from('fam_support').select('id',{count:'exact',head:true}).eq('de_admin',false).eq('lu',false);ADMIN_N=count||0;maj()}catch(e){}}
function panneau(){document.getElementById('panCloche')?.remove();const L=items();
  const p=document.createElement('div');p.id='panCloche';p.style.cssText='position:fixed;top:calc(env(safe-area-inset-top,0px) + 58px);right:12px;left:12px;max-width:380px;margin-left:auto;z-index:70;background:var(--card,#fff);border:1px solid var(--line);border-radius:18px;padding:8px 14px;box-shadow:0 12px 36px rgba(0,0,0,.18)';
  p.innerHTML='<div class="eyebrow acc" style="padding:8px 0">Notifications</div>'+(L.length?L.map((x,i)=>'<button class="li" data-act="clocheGo" data-i="'+i+'" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line);text-align:left;cursor:pointer;color:inherit;font:inherit"><span class="ic">'+icon(x[0])+'</span><span class="tx"><b>'+esc(x[1])+'</b></span></button>').join(''):'<p class="small muted" style="padding:6px 0 12px">Rien de nouveau pour l\'instant.</p>');
  document.body.appendChild(p);p._L=L}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');
  if(b&&b.dataset.act==='cloche'){e.stopPropagation();const o=document.getElementById('panCloche');if(o){o.remove();return}adminN();panneau();return}
  if(b&&b.dataset.act==='clocheGo'){const p=document.getElementById('panCloche'),x=p._L[+b.dataset.i];p.remove();
    if(x[2]==='client'){S.vue=null;S.dtab='clientes';S.dsub='';S.openClient=x[3];S.ctab=x[4]||'messages';chargerClientDetail(x[3]).then(render)}
    else if(x[2]==='tab'){S.vue=null;S.tab=x[3];S.sub='';render()}
    else if(x[2]==='dgo'){const [t,s]=x[3].split('|');S.vue=null;S.dtab=t;S.dsub=s;S.openClient=null;render()}
    scrollTo(0,0);return}
  if(!e.target.closest('#panCloche'))document.getElementById('panCloche')?.remove()},true);
const _r=render;render=function(){_r.apply(this,arguments);try{g.classList.remove('on');maj()}catch(e){}};
window.addEventListener('load',()=>setTimeout(adminN,3000));
})();
