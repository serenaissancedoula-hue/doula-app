/* Sérénaissance — palettes de couleurs au choix, personnalisables. Gardé sur l'appareil. */
const PALETTES={
  terracotta:{n:'Terracotta',accent:'#a85743',bg:'#f7f1ea',card:'#fffbf8',soft:'#f7ece5',sage:'#7f9a78'},
  sauge:{n:'Sauge',accent:'#5f7f5a',bg:'#f2f5ef',card:'#fbfdf9',soft:'#e6eee2',sage:'#a85743'},
  lavande:{n:'Lavande',accent:'#7a62a8',bg:'#f5f2fa',card:'#fdfcff',soft:'#ebe5f5',sage:'#7f9a78'},
  ocean:{n:'Océan',accent:'#2f6f8f',bg:'#eff5f8',card:'#fafdff',soft:'#e0edf3',sage:'#c99a4b'},
  rose:{n:'Rose poudré',accent:'#b4577a',bg:'#faf1f4',card:'#fffafc',soft:'#f6e3ea',sage:'#7f9a78'},
  sable:{n:'Sable doré',accent:'#9a7430',bg:'#f8f4ea',card:'#fffdf6',soft:'#f1e9d2',sage:'#5f7f5a'}
};
const CLE_COUL='sere-couleurs';
const _hx=(h,k)=>{const n=parseInt(h.slice(1),16),f=c=>Math.max(0,Math.min(255,Math.round(k>=0?c+(255-c)*k:c*(1+k))));return '#'+[(n>>16)&255,(n>>8)&255,n&255].map(f).map(v=>v.toString(16).padStart(2,'0')).join('')};
function lireCoul(){try{return JSON.parse(localStorage.getItem(CLE_COUL)||'{}')}catch(e){return{}}}
function appliquerCoul(){const c=lireCoul(),p=PALETTES[c.pal]||PALETTES.terracotta,acc=/^#[0-9a-f]{6}$/i.test(c.perso||'')?c.perso:p.accent,r=document.documentElement.style;
  r.setProperty('--accent',acc);r.setProperty('--accent-dk',_hx(acc,-.18));r.setProperty('--accent-lt',_hx(acc,.65));
  r.setProperty('--bg',p.bg);r.setProperty('--card',p.card);r.setProperty('--soft',p.soft);r.setProperty('--sage',p.sage);
  r.setProperty('--shadow-btn','0 8px 20px '+acc+'38');
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content=p.bg}
appliquerCoul();
if(typeof DSUB!=='undefined'){
DSUB.couleurs=function(){const c=lireCoul(),cur=PALETTES[c.pal]?c.pal:'terracotta',acc=c.perso||PALETTES[cur].accent;
  return sh('Couleurs de l\'appli','Choisissez une palette, puis ajustez la couleur principale à votre goût.')+
  '<div class="card"><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">'+Object.keys(PALETTES).map(k=>{const p=PALETTES[k];return '<button class="cl" data-act="coulPal" data-v="'+k+'" style="'+(k===cur?'border:2px solid '+p.accent:'')+';background:'+p.bg+'"><span style="display:flex;gap:4px"><i style="width:22px;height:22px;border-radius:50%;background:'+p.accent+'"></i><i style="width:22px;height:22px;border-radius:50%;background:'+p.sage+'"></i><i style="width:22px;height:22px;border-radius:50%;background:'+p.soft+';border:1px solid #0002"></i></span><b class="small">'+p.n+'</b></button>'}).join('')+'</div></div>'+
  '<div class="card"><label class="f">Ma couleur principale<input type="color" id="coulPerso" value="'+acc+'" style="height:48px;padding:4px"></label><button class="btn sm" data-act="coulPerso">Utiliser cette couleur</button> <button class="btn sm ghost" data-act="coulReset">Revenir à la palette</button></div>'};
if(!DOUT.find(x=>x[0]==='couleurs'))DOUT.push(['couleurs','fa-palette','Couleurs de l\'appli','Palettes au choix, personnalisables']);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='coulPal'){localStorage.setItem(CLE_COUL,JSON.stringify({pal:b.dataset.v}));appliquerCoul();render()}
  else if(a==='coulPerso'){const c=lireCoul();c.perso=document.getElementById('coulPerso').value;localStorage.setItem(CLE_COUL,JSON.stringify(c));appliquerCoul();render();toast('Couleur appliquée')}
  else if(a==='coulReset'){const c=lireCoul();delete c.perso;localStorage.setItem(CLE_COUL,JSON.stringify(c));appliquerCoul();render()}});
}
