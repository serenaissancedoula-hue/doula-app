/* Sérénaissance — chrono de sommeil de bébé : « Démarrer » quand bébé s'endort, « Il se réveille » pour enregistrer la durée.
   Se lance depuis la fiche Sommeil (accueil, journal, raccourcis). Le chrono continue même si on ferme l'appli. */
(function(){
if(window.ESPACE!=='parent'||typeof FORMS!=='object')return;
const KEY='sere-chrono-sommeil';
const lire=()=>{try{const o=JSON.parse(localStorage.getItem(KEY)||'null');return o&&o.start?o:null}catch(e){return null}};
const ecrire=o=>{try{if(o)localStorage.setItem(KEY,JSON.stringify(o));else localStorage.removeItem(KEY)}catch(e){}};
let SL=lire();
const dur=s=>{const m=Math.round(s/60);return m<60?m+' min':Math.floor(m/60)+' h '+String(m%60).padStart(2,'0')};
function carte(){if(!SL)return '';const s=(Date.now()-SL.start)/1000;
  return '<div class="card" id="slCarte" style="border-color:var(--accent)"><div class="row between"><span class="eyebrow acc"><span class="live"></span>&nbsp; Bébé dort</span><span class="xs muted">depuis '+fmtT(SL.start)+'</span></div><div class="timer" data-sltick="'+SL.start+'">'+mmss(s)+'</div><div class="row"><button class="btn" data-sl="stop">'+icon('fa-sun')+'Il se réveille</button><button class="btn ghost sm" data-sl="cancel">Annuler</button></div><p class="xs muted">Sur le dos, dans son lit, rien d\'autre dans le lit.</p></div>'}
const _f=FORMS.sommeil;
FORMS.sommeil=function(){_f.apply(this,arguments);try{
  const s=document.querySelector('.sheet');if(!s||s.querySelector('[data-sl="go"]'))return;
  const hd=s.querySelector('.sheet-h'),box=document.createElement('div');
  box.innerHTML=SL?'<p class="small">Le chrono est déjà en marche.</p><button class="btn" data-sl="stop" style="width:100%">'+icon('fa-sun')+'Il se réveille</button>':'<button class="btn" data-sl="go" style="width:100%">'+icon('fa-moon')+'Bébé s\'endort : démarrer le chrono</button><p class="xs muted" style="text-align:center;margin:6px 0 10px">ou noter un sommeil déjà passé :</p>';
  hd?hd.after(box):s.prepend(box)}catch(e){}};
const _r=render;render=function(){const x=_r.apply(this,arguments);try{
  document.getElementById('slCarte')&&document.getElementById('slCarte').remove();
  if(SL&&S.role==='parent'&&!S.vue&&['accueil','journal'].includes(S.tab||'accueil')){
    const app=document.getElementById('app');if(!app)return x;const t=document.createElement('template');t.innerHTML=carte();
    const ab=app.querySelector(':scope>.ab-top');
    if(ab){const act=ab.querySelector('.ab-act');act?ab.insertBefore(t.content,act):ab.appendChild(t.content)}
    else{const sh=app.querySelector(':scope>.sh');sh?sh.after(t.content):app.prepend(t.content)}}
 }catch(e){}return x};
setInterval(()=>{document.querySelectorAll('[data-sltick]').forEach(el=>{el.textContent=mmss((Date.now()-(+el.dataset.sltick))/1000)})},1000);
document.addEventListener('click',async e=>{const b=e.target.closest('[data-sl]');if(!b)return;e.stopPropagation();e.preventDefault();const a=b.dataset.sl;
  if(a==='go'){SL={start:Date.now()};ecrire(SL);try{close()}catch(x){}render();toast('Chrono démarré : bonne sieste 🌙');return}
  if(a==='cancel'){SL=null;ecrire(null);render();return}
  if(a==='stop'&&SL){const sec=Math.max(60,Math.round((Date.now()-SL.start)/1000)),t0=SL.start;SL=null;ecrire(null);
    try{await addLog({type:'sommeil',sec,note:'',t:t0});toast('Sommeil enregistré · '+dur(sec))}catch(x){render()}}},true);
render&&setTimeout(()=>{try{if(SL)render()}catch(e){}},800);
})();
