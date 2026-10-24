/* Sérénaissance — mode clair, sombre ou automatique (suit le téléphone). Gardé sur l'appareil. */
(function(){'use strict';
if(typeof appliquerCoul!=='function')return;
const CLE='sere-theme';
const lire=()=>{try{const v=localStorage.getItem(CLE);return v==='clair'||v==='sombre'?v:'auto'}catch(e){return'auto'}};
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
aplique();
const NOMS={auto:['Auto','Suit votre téléphone'],clair:['Clair','Fond clair'],sombre:['Sombre','Fond sombre, plus doux le soir']};
function carte(){const c=lire();return '<div class="card"><span class="eyebrow acc">Mode clair ou sombre</span><div class="row" style="gap:8px;flex-wrap:wrap;margin-top:6px">'+Object.keys(NOMS).map(k=>'<button class="chip '+(c===k?'on':'')+'" data-act="thTheme" data-v="'+k+'">'+NOMS[k][0]+'</button>').join('')+'</div><p class="xs muted" style="margin-top:6px">'+NOMS[c][1]+'. Les documents à signer restent clairs pour rester lisibles.</p></div>'}
const _pp=pParametres;pParametres=function(){let h=_pp.apply(this,arguments);try{
  let i=h.indexOf('<details class="acc" data-sec="Notifications'),det=true;if(i<0){i=h.indexOf('<div class="card"><span class="eyebrow acc">Notifications, son');det=false}
  if(i>=0){let c=carte();if(det)c='<details class="acc" data-sec="Mode clair ou sombre"><summary>Mode clair ou sombre<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body">'+c.replace('<div class="card"><span class="eyebrow acc">Mode clair ou sombre</span>','<div>')+'</div></details>';h=h.slice(0,i)+c+h.slice(i)}}catch(e){}return h};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="thTheme"]');if(!b)return;e.stopPropagation();e.preventDefault();
  try{localStorage.setItem(CLE,b.dataset.v)}catch(x){}appliquerCoul();render();const d=document.querySelector('details[data-sec="Mode clair ou sombre"]');if(d){d.open=true;d.scrollIntoView({block:'center'})}},true);
})();
