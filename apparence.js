/* Sérénaissance — « Mon apparence » (famille) : couleurs, couleur du texte, fond d'écran. Enregistré dans le compte de la famille; la photo de fond reste sur l'appareil. */
(function(){'use strict';
if(window.ESPACE!=='parent'||typeof appliquerCoul!=='function')return;
const CLE='sere-apparence',CF='sere-fond-photo';
const GRAD={aurore:['Aurore','linear-gradient(160deg,#fbe3d6 0%,#f6d5df 45%,#e3dcf5 100%)'],nuage:['Nuage','linear-gradient(180deg,#eef4f8 0%,#f9f6f1 100%)'],prairie:['Prairie','linear-gradient(170deg,#e6f0df 0%,#f6f3e2 100%)'],ocean:['Océan','linear-gradient(170deg,#d9ebf2 0%,#eef6f6 100%)'],creme:['Crème','linear-gradient(180deg,#fff7ec 0%,#f6eadb 100%)']};
const lum=h=>{const n=parseInt(h.slice(1),16),f=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};return .2126*f(n>>16&255)+.7152*f(n>>8&255)+.0722*f(n&255)};
const ctr=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const hex=v=>/^#[0-9a-f]{6}$/i.test(v||'');
function lire(){let a=null;try{a=S&&S.parent&&S.parent.apparence}catch(e){}if(a&&Object.keys(a).length)return a;try{return JSON.parse(localStorage.getItem(CLE)||'{}')}catch(e){return{}}}
function ecrire(a){try{S.parent.apparence=a}catch(e){}try{localStorage.setItem(CLE,JSON.stringify(a))}catch(e){}try{save()}catch(e){}}
function photo(){try{return localStorage.getItem(CF)||''}catch(e){return''}}
const _ac=appliquerCoul;
appliquerCoul=function(){_ac.apply(this,arguments);try{const a=lire(),r=document.documentElement.style,b=document.body;if(!a)return;
  if(a.pal&&PALETTES[a.pal]&&!hex(a.acc)){const p=PALETTES[a.pal];r.setProperty('--accent',p.accent);r.setProperty('--accent-dk',_hx(p.accent,-.18));r.setProperty('--accent-lt',_hx(p.accent,.65));r.setProperty('--bg',p.bg);r.setProperty('--card',p.card);r.setProperty('--soft',p.soft);r.setProperty('--sage',p.sage);r.setProperty('--shadow-btn','0 8px 20px '+p.accent+'38')}
  if(hex(a.acc)){r.setProperty('--accent',a.acc);r.setProperty('--accent-dk',_hx(a.acc,-.18));r.setProperty('--accent-lt',_hx(a.acc,.65));r.setProperty('--shadow-btn','0 8px 20px '+a.acc+'38')}
  if(hex(a.ink)){r.setProperty('--ink',a.ink);r.setProperty('--muted',_hx(a.ink,.38))}else{r.removeProperty('--ink');r.removeProperty('--muted')}
  if(hex(a.bg)){r.setProperty('--bg',a.bg)}
  let img='';if(a.fond==='photo'&&photo())img='linear-gradient(rgba(255,255,255,.35),rgba(255,255,255,.35)),url('+photo()+')';else if(GRAD[a.fond])img=GRAD[a.fond][1];
  if(b){if(img){b.style.backgroundImage=img;b.style.backgroundSize='cover';b.style.backgroundAttachment='fixed';b.style.backgroundPosition='center'}else{b.style.backgroundImage='';b.style.backgroundAttachment=''}}
  const m=document.querySelector('meta[name=theme-color]');if(m&&hex(a.bg))m.content=a.bg}catch(e){}};
function carte(){const a=lire(),cs=getComputedStyle(document.documentElement),g=(k,d)=>hex(a[k])?a[k]:(k==='acc'?(cs.getPropertyValue('--accent').trim()||d):k==='ink'?(cs.getPropertyValue('--ink').trim()||d):(cs.getPropertyValue('--bg').trim()||d));
  const col=v=>hex(v)?v:'#a85743';
  return '<div class="card"><span class="eyebrow acc">Mon apparence</span><p class="xs muted">Choisissez les couleurs et le fond d’écran de votre appli. Ça ne change rien pour les autres.</p>'+
   '<span class="small"><b>Palette</b></span><div class="row" style="gap:8px;flex-wrap:wrap">'+Object.keys(PALETTES).map(k=>'<button class="chip '+(a.pal===k&&!hex(a.acc)?'on':'')+'" data-act="apPal" data-v="'+k+'"><i style="display:inline-block;width:14px;height:14px;border-radius:50%;background:'+PALETTES[k].accent+'"></i>'+PALETTES[k].n+'</button>').join('')+'</div>'+
   '<div class="grid2 resp" style="margin-top:8px"><label class="f">Couleur des boutons<input type="color" id="apAcc" value="'+col(g('acc','#a85743'))+'" style="width:100%;height:42px;padding:2px"></label><label class="f">Couleur du texte<input type="color" id="apInk" value="'+col(g('ink','#2c221e'))+'" style="width:100%;height:42px;padding:2px"></label><label class="f">Couleur du fond<input type="color" id="apBg" value="'+col(g('bg','#f7f1ea'))+'" style="width:100%;height:42px;padding:2px"></label></div>'+
   '<span class="small" style="margin-top:8px;display:block"><b>Fond d’écran</b></span><div class="row" style="gap:8px;flex-wrap:wrap"><button class="chip '+(!a.fond?'on':'')+'" data-act="apFond" data-v="">Uni</button>'+Object.keys(GRAD).map(k=>'<button class="chip '+(a.fond===k?'on':'')+'" data-act="apFond" data-v="'+k+'"><i style="display:inline-block;width:14px;height:14px;border-radius:50%;background:'+GRAD[k][1]+';border:1px solid var(--line)"></i>'+GRAD[k][0]+'</button>').join('')+'<label class="chip '+(a.fond==='photo'?'on':'')+'" style="cursor:pointer">'+icon('fa-image')+'Ma photo<input type="file" id="apPhoto" accept="image/*" hidden></label></div>'+
   '<button class="btn sm ghost" data-act="apReset" style="margin-top:10px">'+icon('fa-rotate-left')+'Revenir aux couleurs de départ</button></div>'}
const _pp=pParametres;pParametres=function(){let h=_pp.apply(this,arguments);try{if(S.role==='parent'){let i=h.indexOf('<details class="acc" data-sec="Notifications'),det=true;if(i<0){i=h.indexOf('<div class="card"><span class="eyebrow acc">Notifications, son');det=false}
  if(i>=0){let c=carte();if(det)c='<details class="acc" data-sec="Mon apparence"><summary>Mon apparence<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body">'+c.replace('<div class="card"><span class="eyebrow acc">Mon apparence</span>','<div>')+'</div></details>';h=h.slice(0,i)+c+h.slice(i)}}}catch(e){}return h};
function refus(a){const cs=getComputedStyle(document.documentElement),ink=hex(a.ink)?a.ink:cs.getPropertyValue('--ink').trim(),bg=hex(a.bg)?a.bg:cs.getPropertyValue('--bg').trim(),card=cs.getPropertyValue('--card').trim();
  if(hex(ink)&&hex(bg)&&ctr(ink,bg)<3.2)return 'Texte difficile à lire sur ce fond : choisissez des couleurs plus contrastées.';
  if(hex(ink)&&hex(card)&&ctr(ink,card)<3.2)return 'Texte difficile à lire sur les cartes : choisissez un texte plus foncé.';return ''}
function rouvrir(){const d=document.querySelector('details[data-sec="Mon apparence"]');if(d){d.open=true;d.scrollIntoView({block:'center'})}}
function maj(p){const a=Object.assign({},lire(),p),m=refus(a);if(m){toast(m);render();rouvrir();return}ecrire(a);appliquerCoul();render();rouvrir()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act^="ap"]');if(!b)return;const a=b.dataset.act;if(!/^ap(Pal|Fond|Reset)$/.test(a))return;e.stopPropagation();e.preventDefault();
  if(a==='apPal')maj({pal:b.dataset.v,acc:'',bg:''});
  else if(a==='apFond')maj({fond:b.dataset.v});
  else if(a==='apReset'){try{localStorage.removeItem(CF)}catch(x){}ecrire({});appliquerCoul();render();rouvrir();toast('Couleurs de départ rétablies')}},true);
document.addEventListener('change',e=>{const t=e.target;if(!t||!t.id)return;
  if(t.id==='apAcc')maj({acc:t.value,pal:''});else if(t.id==='apInk')maj({ink:t.value});else if(t.id==='apBg')maj({bg:t.value});
  else if(t.id==='apPhoto'&&t.files&&t.files[0]){const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1000/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);try{localStorage.setItem(CF,c.toDataURL('image/jpeg',.7))}catch(x){toast('Photo trop grande pour cet appareil');return}maj({fond:'photo'})};im.src=fr.result};fr.readAsDataURL(t.files[0])}},true);
try{appliquerCoul()}catch(e){}
})();
