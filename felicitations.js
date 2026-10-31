/* Sérénaissance — message de félicitations à chaque nouvelle semaine de grossesse (et mois) · Espace Famille
   S'affiche à l'ouverture de l'appli quand la semaine a changé depuis la dernière fois (la notification du téléphone amène ici).
   Boutons : lire la semaine, lire le mois. */
(function(){
if(window.ESPACE!=='parent'||typeof stage!=='function'||typeof render!=='function')return;
const DEBUTS={5:2,9:3,14:4,18:5,23:6,28:7,32:8,37:9};
const MOIS_TXT={2:'L\'embryon prend sa forme et son cœur commence à battre.',3:'Bébé devient un petit fœtus : doigts, orteils, organes formés.',4:'Bébé grandit vite, avale et suce son pouce.',5:'Vous allez peut-être sentir ses premiers mouvements.',6:'Ses sens s\'éveillent : il réagit aux bruits et à la lumière.',7:'Début du 3e trimestre : ses yeux s\'ouvrent.',8:'Bébé se prépare à la naissance.',9:'Bébé est à terme : il est prêt à naître quand il le décidera.'};
const sauver=()=>{try{if(typeof saveParent==='function')saveParent();else save()}catch(e){}};
const cl=w=>Math.max(4,Math.min(42,w));
let vu=false;
function fermer(){const d=document.getElementById('felPE');if(d)d.remove();document.body.style.overflow=''}
function ouvrir(w){
  const mois=DEBUTS[w],f=(typeof fruit==='function')?fruit(w):null;
  const taille=f?'Bébé a maintenant la taille '+(typeof art==='function'?art(f[0]):'')+esc(f[0])+' (environ '+String(f[1]).replace('.',',')+' cm).':'';
  const d=document.createElement('div');d.id='felPE';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','Félicitations');
  d.innerHTML='<div class="fel-bo"><img src="img/bebe/semaine-'+String(cl(w)).padStart(2,'0')+'.jpg?v=11" alt="" class="fel-im">'+
    '<div class="fel-tx"><div class="fel-ti">'+(mois?'🌟 Un nouveau mois commence !':'🎉 Félicitations !')+'</div>'+
    '<p class="fel-p"><b>Vous voilà à '+w+' semaines'+(mois?' · mois '+mois:'')+'.</b></p>'+(mois?'<p class="fel-p">'+MOIS_TXT[mois]+'</p>':'')+'<p class="fel-p fel-s">'+taille+'</p>'+
    '<button type="button" class="fel-b fel-b1" data-fel="sem" data-w="'+w+'">Lire la semaine '+w+'</button>'+
    (mois?'<button type="button" class="fel-b" data-fel="mois">Lire le mois '+mois+'</button>':'')+
    '<button type="button" class="fel-b fel-b3" data-fel="fermer">Plus tard</button></div></div>';
  document.body.appendChild(d);document.body.style.overflow='hidden'}
function cliquer(attrs){const b=document.createElement('button');Object.keys(attrs).forEach(k=>b.setAttribute(k,attrs[k]));b.style.display='none';document.body.appendChild(b);b.click();setTimeout(()=>b.remove(),50)}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-fel]');if(!b)return;e.stopPropagation();e.preventDefault();
  const a=b.dataset.fel,w=b.dataset.w;fermer();
  if(a==='sem')cliquer({'data-gr':'sem','data-w':w});
  else if(a==='mois'){S.etV='mois';S.sub='etapes';cliquer({'data-act':'go','data-v':'infos|etapes'})}},true);
function verifier(){try{
  if(vu||S.role!=='parent'||document.getElementById('felPE')||document.getElementById('bhPE'))return;
  const st=stage();if(st.k!=='preg')return;const w=cl(st.g.w),p=S.parent;
  if(typeof p.semVue!=='number'||w<p.semVue){p.semVue=w;sauver();return}
  if(w>p.semVue&&w>=5){vu=true;p.semVue=w;sauver();ouvrir(w)}
}catch(e){}}
const _r=render;render=function(){const x=_r.apply(this,arguments);try{setTimeout(verifier,1200)}catch(e){}return x};
const st=document.createElement('style');st.textContent='#felPE{position:fixed;inset:0;z-index:99995;display:grid;place-items:center;padding:20px;background:rgba(20,12,10,.72);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}'+
'.fel-bo{width:min(100%,380px);max-height:92vh;overflow:auto;border-radius:28px;background:var(--card,#fffaf6);color:var(--ink,#2c221e);box-shadow:0 20px 60px rgba(0,0,0,.45);text-align:center}'+
'.fel-im{width:100%;aspect-ratio:1;object-fit:cover;display:block;border-radius:28px 28px 0 0}.fel-tx{padding:16px 20px 20px;display:grid;gap:10px}'+
'.fel-ti{font-family:var(--serif,inherit);font-size:1.5rem;font-weight:700}.fel-p{margin:0;line-height:1.45}.fel-s{font-size:.9rem;opacity:.8}'+
'.fel-b{border:1px solid var(--line,#e6d9d0);background:transparent;color:inherit;border-radius:16px;padding:13px;font:inherit;font-weight:700;cursor:pointer}.fel-b1{background:var(--accent,#b0553f);border-color:transparent;color:#fff}.fel-b3{border:0;font-weight:500;opacity:.75}';
document.head.appendChild(st);
})();
