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
const genreAuto=t=>{const h=new Date(t).getHours();return h>=19||h<6?'nuit':'sieste'};
const loc=t=>{const d=new Date(t);d.setSeconds(0,0);const p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes())};
FORMS.sommeil=function(){
  const fin=Date.now(),deb=fin-3600e3;
  const haut=SL?'<p class="small">Le chrono est en marche depuis '+fmtT(SL.start)+'.</p><button class="btn" data-sl="stop" style="width:100%">'+icon('fa-sun')+'Il se réveille</button>':'<button class="btn" data-sl="go" style="width:100%">'+icon('fa-moon')+'Bébé s\'endort : démarrer le chrono</button>';
  sheet('Sommeil',haut+'<p class="xs muted" style="text-align:center;margin:10px 0">— ou noter un sommeil déjà passé —</p>'+
   '<div class="seg" id="slGenre"><button type="button" class="chip on" data-sl="genre" data-v="sieste">☀️ Sieste</button><button type="button" class="chip" data-sl="genre" data-v="nuit">🌙 Nuit</button></div>'+
   '<div class="grid2"><label class="f">Heure de début<input type="datetime-local" id="sl_deb" value="'+loc(deb)+'"></label><label class="f">Heure de fin<input type="datetime-local" id="sl_fin" value="'+loc(fin)+'"></label></div>'+
   '<p class="small" id="slDuree" style="text-align:center;margin:4px 0 8px"><b>Durée : 1 h 00</b></p>'+
   '<label class="f">Note<input type="text" id="sl_note"></label><p class="xs muted">Sur le dos, dans son lit, rien d\'autre dans le lit.</p><button class="btn" data-sl="save">Enregistrer</button>');
  maj()};
function maj(){const d=document.getElementById('sl_deb'),f=document.getElementById('sl_fin'),o=document.getElementById('slDuree');if(!d||!f||!o)return;
  let s=(new Date(f.value)-new Date(d.value))/1000;if(!(s>0)){o.innerHTML='<b style="color:var(--danger,#b3412e)">L\'heure de fin doit venir après le début</b>';return}
  o.innerHTML='<b>Durée : '+dur(s)+'</b>';
  const g=document.querySelector('#slGenre .chip.on');if(g&&!g.dataset.manuel){const au=genreAuto(d.value);document.querySelectorAll('#slGenre .chip').forEach(c=>c.classList.toggle('on',c.dataset.v===au))}}
document.addEventListener('input',e=>{if(e.target&&(e.target.id==='sl_deb'||e.target.id==='sl_fin'))maj()});
if(typeof logText==='function'){const _lt=logText;logText=function(l){try{if(l&&l.type==='sommeil'&&l.fin)return (l.genre==='nuit'?'Nuit':'Sieste')+' · '+dur(l.sec)+' ('+fmtT(l.t)+' à '+fmtT(l.fin)+')'+(l.note?' · '+esc(l.note):'')}catch(e){}return _lt.apply(this,arguments)}}
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
  if(a==='genre'){document.querySelectorAll('#slGenre .chip').forEach(c=>{c.classList.toggle('on',c===b);if(c===b)c.dataset.manuel=1});return}
  if(a==='save'){const d=new Date(document.getElementById('sl_deb').value),f=new Date(document.getElementById('sl_fin').value),sec=Math.round((f-d)/1000);
    if(!(sec>0)){toast('L\'heure de fin doit venir après le début');return}
    const g=document.querySelector('#slGenre .chip.on');
    try{await addLog({type:'sommeil',sec,fin:+f,genre:g?g.dataset.v:genreAuto(+d),note:document.getElementById('sl_note').value,t:+d});toast('Sommeil enregistré · '+dur(sec))}catch(x){}return}
  if(a==='cancel'){SL=null;ecrire(null);render();return}
  if(a==='stop'&&SL){const sec=Math.max(60,Math.round((Date.now()-SL.start)/1000)),t0=SL.start;SL=null;ecrire(null);
    try{await addLog({type:'sommeil',sec,fin:Date.now(),genre:genreAuto(t0),note:'',t:t0});toast((genreAuto(t0)==='nuit'?'Nuit':'Sieste')+' enregistrée · '+dur(sec))}catch(x){render()}}},true);
render&&setTimeout(()=>{try{if(SL)render()}catch(e){}},800);
})();
