/* Sérénaissance — champs de mot de passe : œil pour voir ce qu'on écrit, et jauge de force pour les nouveaux mots de passe. */
(function(){
const OEIL='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const BARRE='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.9 17.9A10.9 10.9 0 0 1 12 19C5 19 1 12 1 12a18.5 18.5 0 0 1 5.1-5.9M9.9 4.2A9.1 9.1 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.2 3.2M1 1l22 22"/><path d="M14.1 14.1a3 3 0 1 1-4.2-4.2"/></svg>';
const T=s=>(window.tr?window.tr(s):s);
function force(v){let n=0;if(v.length>=8)n++;if(v.length>=12)n++;if(/[a-zà-ÿ]/.test(v)&&/[A-ZÀ-Ý]/.test(v))n++;if(/\d/.test(v))n++;if(/[^A-Za-z0-9À-ÿ]/.test(v))n++;if(v.length<8)n=Math.min(n,1);
  const niv=!v?0:v.length<8?1:n<=2?2:n===3?3:4;return niv}
const NOMS=['','Trop court','Faible','Bon','Excellent'],COUL=['','#c0503c','#d9953b','#8aa37b','#4f8a5b'];
function ameliorer(i){if(i.dataset.oeil||i.type!=='password')return;i.dataset.oeil='1';
  const w=document.createElement('span');w.className='pw-wrap';i.parentNode.insertBefore(w,i);w.appendChild(i);
  const b=document.createElement('button');b.type='button';b.className='pw-eye';b.setAttribute('aria-label',T('Voir le mot de passe'));b.setAttribute('data-notr','1');b.innerHTML=OEIL;w.appendChild(b);
  /* sur iPhone, le clic se perdait quand le clavier se fermait : on réagit dès le toucher, sans enlever le curseur du champ */
  let tch=0;const bascule=()=>{const v=i.type==='password',f=document.activeElement===i,a=i.selectionStart,z=i.selectionEnd;i.type=v?'text':'password';b.innerHTML=v?BARRE:OEIL;b.setAttribute('aria-label',T(v?'Cacher le mot de passe':'Voir le mot de passe'));b.setAttribute('aria-pressed',v?'true':'false');if(f){try{i.focus();i.setSelectionRange(a,z)}catch(x){}}};
  b.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();tch=Date.now();bascule()},{passive:false});
  b.addEventListener('mousedown',e=>e.preventDefault());
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(Date.now()-tch<800)return;bascule()});
  if((i.getAttribute('autocomplete')||'')==='new-password'&&!/2$|conf/i.test(i.id)){
    const f=document.createElement('div');f.className='pw-force';f.innerHTML='<div class="pw-barre"><i></i><i></i><i></i><i></i></div><span class="xs"></span>';w.insertAdjacentElement('afterend',f);
    const maj=()=>{const n=force(i.value),segs=f.querySelectorAll('i');segs.forEach((s,k)=>{s.style.background=k<n?COUL[n]:''});const t=f.querySelector('span');t.textContent=i.value?T(NOMS[n]):'';t.style.color=COUL[n]||''};
    i.addEventListener('input',maj);maj()}}
function balayer(r){(r.querySelectorAll?r.querySelectorAll('input[type=password]'):[]).forEach(ameliorer)}
new MutationObserver(m=>{for(const x of m)x.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches&&n.matches('input[type=password]'))ameliorer(n);else balayer(n)}})}).observe(document.documentElement,{childList:true,subtree:true});
balayer(document);
})();
