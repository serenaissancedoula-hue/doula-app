/* Sérénaissance — mode clair, sombre ou automatique (suit le téléphone). Gardé sur l'appareil. */
(function(){'use strict';
if(typeof appliquerCoul!=='function')return;
const CLE='sere-theme';
/* Le choix est gardé à trois endroits (appareil, cookie, compte) : une mise à jour ou un nettoyage du navigateur ne le fait plus perdre. */
const ok=v=>v==='clair'||v==='sombre'||v==='auto';
const lCook=()=>{try{const m=document.cookie.match(/(?:^|; )sere-theme=(\w+)/);return m&&ok(m[1])?m[1]:null}catch(e){return null}};
const eCook=v=>{try{document.cookie='sere-theme='+v+'; max-age=31536000; path=/; SameSite=Lax'}catch(e){}};
const lire=()=>{try{const v=localStorage.getItem(CLE);if(ok(v))return v}catch(e){}return lCook()||'auto'};
const duCompte=()=>{try{const v=ESPACE==='parent'?(S.parent&&S.parent.theme):(ME_DOULA&&ME_DOULA.modeles&&ME_DOULA.modeles.theme);return ok(v)?v:null}catch(e){return null}};
function versCompte(v){try{if(ESPACE==='parent'){if(S.parent&&S.parent.theme!==v){S.parent.theme=v;save()}}else if(ME_DOULA){const m=Object.assign({},ME_DOULA.modeles||{});if(m.theme!==v){m.theme=v;ME_DOULA.modeles=m;saveDoula()}}}catch(e){}}
function retrouver(){let loc=null;try{loc=localStorage.getItem(CLE)}catch(e){}if(ok(loc)){eCook(loc);return}
  const v=lCook()||duCompte();if(v){try{localStorage.setItem(CLE,v)}catch(e){}eCook(v);try{appliquerCoul()}catch(e){}}}
const mq=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):null;
const sombre=()=>{const m=lire();return m==='sombre'||(m==='auto'&&!!(mq&&mq.matches))};
const VARS=['--white','--soft2','--line','--ink','--muted','--accent-lt','--sage-soft','--gold-soft','--bad','--bad-soft','--warn','--sage-dk','--shadow'];
function aplique(){try{const r=document.documentElement,s=r.style,d=sombre();r.dataset.theme=d?'dark':'light';
  if(!d){VARS.forEach(k=>s.removeProperty(k));s.colorScheme='';return}
  const set=(k,v)=>s.setProperty(k,v);
  set('--bg','#1c1714');set('--card','#262019');set('--white','#2d2620');set('--soft','#332a23');set('--soft2','#3a2f27');set('--line','#4a3c32');
  set('--ink','#f4ebe3');set('--muted','#bcab9f');set('--sage-soft','#2c3a2a');set('--gold-soft','#3b3220');set('--bad','#f08a7c');set('--bad-soft','#44221d');set('--warn','#e0b060');set('--sage-dk','#9fd197');set('--sage','#8fb089');
  set('--shadow','0 12px 32px rgba(0,0,0,.35)');s.colorScheme='dark';
  const acc=(getComputedStyle(r).getPropertyValue('--accent')||'#a85743').trim();
  if(/^#[0-9a-f]{6}$/i.test(acc)&&typeof _hx==='function'){set('--accent',_hx(acc,.12));set('--accent-dk',_hx(acc,.3));set('--accent-lt',_hx(acc,-.6))}
  if(document.body)document.body.style.backgroundImage='';
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content='#1c1714'}catch(e){}}
const _a=appliquerCoul;appliquerCoul=function(){_a.apply(this,arguments);aplique()};
if(mq)(mq.addEventListener?mq.addEventListener('change',()=>{aplique();try{appliquerCoul()}catch(e){}}):mq.addListener&&mq.addListener(aplique));
retrouver();aplique();

/* ---- Mode sombre : adoucit les fonds clairs écrits « en dur » et les textes foncés sans variable ---- */
const lumRgb=(r,g,b)=>{const f=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
const cols=t=>(t.match(/rgba?\([^)]*\)/g)||[]).map(x=>x.match(/[\d.]+/g).map(Number)).filter(a=>a.length<4||a[3]>.5);
const EXC='.papier,.fid-pg,#docImp,canvas,.pad-zone,.sigbox,.ph,#bebePE,#bhPE,.bh-hero,#felic,svg,img,figure.illu';
function fondAncetre(el){for(let e=el.parentElement;e;e=e.parentElement){const c=cols(getComputedStyle(e).backgroundColor);if(c.length)return c[0]}return [28,23,20]}
function adoucir(){if(!sombre())return;try{
  document.querySelectorAll('#app *,#layer *').forEach(el=>{if(el.dataset.dk||el.closest(EXC))return;const cs=getComputedStyle(el);if(cs.backgroundImage==='none'&&cs.backgroundColor==='rgba(0, 0, 0, 0)')return;const r=el.getBoundingClientRect();if(r.width<30||r.height<30)return;
    const L=cols(cs.backgroundImage).concat(cols(cs.backgroundColor));if(!L.length)return;
    if(L.every(a=>lumRgb(a[0],a[1],a[2])>.55)){el.dataset.dk='1';el.style.setProperty('background','linear-gradient(160deg,var(--card),var(--soft))','important');
      /* le texte très foncé (écrit en dur dans le CSS) devient clair sur ce fond désormais sombre; les couleurs d'accent ne sont pas touchées */
      el.querySelectorAll('*').forEach(x=>{if(x.dataset.dt||x.closest(EXC))return;const c=cols(getComputedStyle(x).color)[0];if(c&&lumRgb(c[0],c[1],c[2])<.08){x.dataset.dt='1';x.style.setProperty('color','var(--ink)','important')}});
      {const c=cols(cs.color)[0];if(c&&lumRgb(c[0],c[1],c[2])<.08&&!el.dataset.dt){el.dataset.dt='1';el.style.setProperty('color','var(--ink)','important')}}}});
  document.querySelectorAll('#app [style*="color"],#layer [style*="color"]').forEach(el=>{if(el.closest(EXC)||el.dataset.dt)return;const c=cols(getComputedStyle(el).color)[0];if(!c||lumRgb(c[0],c[1],c[2])>.25)return;
    const b=fondAncetre(el);if(lumRgb(b[0],b[1],b[2])<.2){el.dataset.dt='1';el.style.setProperty('color','var(--ink)','important')}})}catch(e){}}
let tm=0;const prog=()=>{clearTimeout(tm);tm=setTimeout(adoucir,60)};
/* adoucir tout de suite (avant que l'écran se redessine) : plus de flash blanc quand une page se rafraîchit */
try{new MutationObserver(()=>{adoucir()}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
const _rr=render;render=function(){const x=_rr.apply(this,arguments);retrouver();adoucir();prog();return x};
prog();
const NOMS={auto:['Auto','Suit votre téléphone'],clair:['Clair','Fond clair'],sombre:['Sombre','Fond sombre, plus doux le soir']};
function carte(){const c=lire();return '<div class="card"><span class="eyebrow acc">Mode clair ou sombre</span><div class="row" style="gap:8px;flex-wrap:wrap;margin-top:6px">'+Object.keys(NOMS).map(k=>'<button class="chip '+(c===k?'on':'')+'" data-act="thTheme" data-v="'+k+'">'+NOMS[k][0]+'</button>').join('')+'</div><p class="xs muted" style="margin-top:6px">'+NOMS[c][1]+'. Les documents à signer restent clairs pour rester lisibles.</p></div>'}
const _pp=pParametres;pParametres=function(){let h=_pp.apply(this,arguments);try{
  let i=h.indexOf('<details class="acc" data-sec="Notifications'),det=true;if(i<0){i=h.indexOf('<div class="card"><span class="eyebrow acc">Notifications, son');det=false}
  if(i>=0){let c=carte();if(det)c='<details class="acc" data-sec="Mode clair ou sombre"><summary>Mode clair ou sombre<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body">'+c.replace('<div class="card"><span class="eyebrow acc">Mode clair ou sombre</span>','<div>')+'</div></details>';h=h.slice(0,i)+c+h.slice(i)}}catch(e){}return h};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="thTheme"]');if(!b)return;e.stopPropagation();e.preventDefault();
  try{localStorage.setItem(CLE,b.dataset.v)}catch(x){}eCook(b.dataset.v);versCompte(b.dataset.v);appliquerCoul();render();const d=document.querySelector('details[data-sec="Mode clair ou sombre"]');if(d){d.open=true;d.scrollIntoView({block:'center'})}},true);
})();
