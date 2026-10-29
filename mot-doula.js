/* Sérénaissance — mot du jour de la doula : une petite fenêtre à la première ouverture de la journée (10 secondes, se ferme seule). */
(function(){
if(window.ESPACE==='parent')return;
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const jourCle=()=>{const d=new Date();return 'mot-doula-vu-'+d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
let vuSession=null;
function dejaVu(){try{return !!localStorage.getItem(jourCle())}catch(e){return vuSession===jourCle()}}
function marquer(){vuSession=jourCle();try{localStorage.setItem(jourCle(),'1')}catch(e){}}
function visible(el){return !!(el&&(el.offsetWidth||el.offsetHeight||el.getClientRects().length))}
function fermer(){const m=document.getElementById('motDoula');if(!m)return;m.style.transition='opacity .4s';m.style.opacity=0;setTimeout(()=>m.remove(),420)}
function afficher(){try{
  if(S.role!=='doula'||S.dtab!=='accueil'||S.vue==='params'||S.openClient||dejaVu()||document.getElementById('motDoula'))return;
  if(typeof adMot!=='function'||typeof adSalut!=='function')return;
  if(['#cguOv','#ecranMaint','#layer .modal','#cm','#chatPan'].some(q=>visible(document.querySelector(q))))return;
  const pr=String((S.doula&&S.doula.nom)||'').split(' ')[0];
  const o=document.createElement('div');o.id='motDoula';o.setAttribute('role','dialog');o.setAttribute('aria-label','Mot du jour');
  o.innerHTML='<div class="md-b"><div class="md-h">'+E(adSalut())+(pr?' '+E(pr):'')+' 🌸</div><p class="md-t">'+E(adMot())+'</p><button class="btn" data-md-ok="1">Merci 💗</button><i class="md-bar"></i></div>';
  document.body.appendChild(o);marquer();setTimeout(fermer,10000)}catch(e){}}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-md-ok]'))fermer()});
if(typeof render==='function'){const _r=render;render=function(){const r=_r.apply(this,arguments);try{setTimeout(afficher,700)}catch(e){}return r}}
const st=document.createElement('style');st.textContent='#motDoula{position:fixed;inset:0;z-index:90;background:rgba(40,25,20,.55);display:grid;place-items:center;padding:20px;animation:mdIn .35s ease}@keyframes mdIn{from{opacity:0}to{opacity:1}}.md-b{position:relative;overflow:hidden;background:var(--bg,#faf4ef);border-radius:26px;padding:22px 20px;max-width:420px;width:100%;display:grid;gap:14px;box-shadow:0 20px 60px rgba(0,0,0,.35);animation:mdUp .4s ease}@keyframes mdUp{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}.md-h{font-family:var(--serif,inherit);font-size:1.5rem;text-align:center}.md-t{margin:0;text-align:center;font-size:1.05rem;line-height:1.5}.md-bar{position:absolute;left:0;bottom:0;height:4px;background:var(--accent,#a85743);width:100%;animation:mdBar 10s linear forwards}@keyframes mdBar{to{width:0}}';
document.head.appendChild(st);
})();
