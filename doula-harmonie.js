/* Sérénaissance — l'Espace Doula prend la même allure que l'espace famille « bébé est né » (la base) :
   en-tête « Aujourd'hui » avec la date et la photo en rond, grande carte douce avec le prénom et deux grands chiffres,
   listes à icônes rondes de couleurs douces, thèmes d'outils en tuiles pastel, titres de page toujours en haut.
   On ne retire rien : on harmonise seulement l'apparence. */
(function(){
if(window.ESPACE==='parent')return;
document.documentElement.classList.add('esp-doula');
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function chiffres(){const L=S.clients||[];let nbF=0,garde=0,jours=null;
  L.forEach(c=>{if(c.statut==='active'||c.statut==='invitee'||!c.statut)nbF++;try{if(enGarde(c))garde++;const st=cStage(c);if(st.k==='preg'&&st.left>=0&&(jours==null||st.left<jours))jours=st.left}catch(e){}});
  return {nbF,garde,jours}}
function enTete(){const D=S.doula||{},prenom=String(D.prenomD||D.nom||'').split(' ')[0],C=chiffres();
  const auj=new Date().toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long'});
  const rond=D.photo?'<img class="ab-av" src="'+E(D.photo)+'" alt="">':'<span class="ab-av">'+E((prenom||'S')[0].toUpperCase())+'</span>';
  const h=new Date().getHours(),salut=h>=18||h<4?'Bonsoir,':'Bonjour,';
  const droite=C.garde?[C.garde,'En garde']:C.jours!=null?[C.jours,C.jours>1?'Jours avant la prochaine naissance':'Jour avant la prochaine naissance']:[0,'Naissance prévue'];
  return '<div class="ab-top dh-top"><div class="ab-tete"><div><span class="ab-date">'+auj+'</span><h1>Aujourd\'hui</h1></div><button class="ab-avs dh-av" data-act="params" aria-label="Mon profil">'+rond+'</button></div>'+
    '<div class="ab-hero dh-hero"><div class="ab-salut"><span>'+salut+'</span><b>'+E(prenom||'vous')+'</b>'+(D.entreprise?'<small>'+E(D.entreprise)+'</small>':'')+'</div>'+
    '<div class="dh-logo" aria-hidden="true"><img src="img/logo-icone.png" alt=""></div>'+
    '<div class="ab-age g"><b>'+C.nbF+'</b><span>'+(C.nbF>1?'Familles':'Famille')+'</span></div><div class="ab-age d"><b>'+droite[0]+'</b><span>'+droite[1]+'</span></div></div></div>'}
const PASTEL=['#f3d5c9','#d9e6d4','#dbe2f0','#f2e3c4','#ecdcea','#fbe0e6'];
function harmoniser(){try{
  if(S.role!=='doula')return;const app=document.getElementById('app');if(!app)return;
  const accueil=!S.vue&&(S.dtab||'accueil')==='accueil'&&!S.openClient;
  if(accueil){const hero=app.querySelector(':scope>.ad-hero');if(hero&&!app.querySelector(':scope>.dh-top')){const d=document.createElement('div');d.innerHTML=enTete();const t=d.firstElementChild;
      const mot=hero.querySelector('.xs');if(mot&&mot.textContent.trim()){const p=document.createElement('p');p.className='dh-mot';p.textContent=mot.textContent.trim();t.appendChild(p)}
      hero.replaceWith(t);if(app.firstElementChild!==t)app.prepend(t)}}
  /* listes : icônes rondes de couleurs douces, comme « Activités » chez la famille */
  app.querySelectorAll('.card .cl, .ad-ann .cl, .ad-feat .cl').forEach((b,i)=>{if(b.dataset.dh)return;b.dataset.dh=1;b.classList.add('dh-row');const av=b.querySelector('.av');if(av)av.style.background=PASTEL[i%PASTEL.length]});
  app.querySelectorAll(':scope>.cl, :scope>.list>.cl, :scope>div>.cl').forEach((b,i)=>{if(b.dataset.dhf)return;b.dataset.dhf=1;b.classList.add('dh-fam');const av=b.querySelector('.av');if(av&&!av.querySelector('img'))av.style.background=PASTEL[i%PASTEL.length]});
  /* le titre de la page passe toujours en premier (ex. Agenda) */
  const sh=app.querySelector(':scope>.sh');if(sh&&!accueil&&app.firstElementChild!==sh){const avant=[...app.children].slice(0,[...app.children].indexOf(sh));if(avant.length&&avant.every(x=>x.matches('.btn,.row,button')))app.prepend(sh)}
  /* thèmes de la boîte à outils en tuiles pastel */
  app.querySelectorAll('details.grpOutils').forEach((d,i)=>{d.style.setProperty('--dh-c',PASTEL[i%PASTEL.length])});
}catch(e){}}
/* Retour en arrière : chaque page se rappelle les menus ouverts et l'endroit où on était rendu */
const MEM={};let cle0=null,retour=0;
function cle(){return [S.dtab||'accueil',S.vue||'',S.dsub||'',S.openClient||'',S.ctab||''].join('|')}
function nomD(d){const s=d.querySelector(':scope>summary');return s?s.textContent.replace(/\(\d+\)/,'').trim():''}
function noter(sansY){if(retour||!cle0)return;const app=document.getElementById('app');if(!app)return;const m=MEM[cle0]||{y:0};
  MEM[cle0]={y:sansY?m.y:window.scrollY,ouverts:[...app.querySelectorAll('details')].filter(d=>d.open).map(nomD)}}
window.addEventListener('scroll',()=>{noter()},{passive:true});
document.addEventListener('toggle',e=>{if(e.target.tagName==='DETAILS')setTimeout(noter,0)},true);
function restaurer(m){const app=document.getElementById('app');if(!app)return;retour=1;
  app.querySelectorAll('details').forEach(d=>{const n=nomD(d);if(!n)return;const o=m.ouverts.includes(n);if(d.open!==o)d.open=o});
  const aller=()=>window.scrollTo(0,m.y);aller();requestAnimationFrame(aller);setTimeout(aller,60);setTimeout(()=>{aller();retour=0},180)}
const _r=render;render=function(){noter(1);const r=_r.apply(this,arguments);try{harmoniser();requestAnimationFrame(harmoniser);
  const k=cle();if(k!==cle0){const m=MEM[k];cle0=k;if(m)restaurer(m)}}catch(e){}return r};
const css=document.createElement('style');css.textContent=`
.esp-doula .ab-top{margin-bottom:14px}.esp-doula .ab-tete{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin:4px 2px 12px}
.esp-doula .ab-date{display:block;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}.esp-doula .ab-tete h1{font-size:2rem;margin:0}
.esp-doula .dh-av{border:0;background:none;padding:0;cursor:pointer}.esp-doula .ab-av{width:54px;height:54px;border-radius:50%;object-fit:cover;border:3px solid var(--card);box-shadow:0 4px 12px rgba(70,45,30,.15);display:grid;place-items:center;font-weight:700;color:var(--accent);background:var(--soft);font-size:1.2rem}
.esp-doula .ab-hero{position:relative;aspect-ratio:1/.78;border-radius:26px;overflow:hidden;background:linear-gradient(160deg,#f6e3d8,#ecd2c4 55%,#e4c2b3);box-shadow:0 10px 28px rgba(70,45,30,.12);color:#5b3a2e}
.esp-doula .ab-salut{position:absolute;left:18px;top:16px;z-index:2;display:flex;flex-direction:column}.esp-doula .ab-salut span{font-size:.95rem;opacity:.9}.esp-doula .ab-salut b{font-family:var(--f-display);font-size:1.6rem;line-height:1.15}.esp-doula .ab-salut small{font-size:.8rem;opacity:.8;margin-top:2px}
.esp-doula .dh-logo{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none}.esp-doula .dh-logo img{width:46%;max-width:190px;opacity:.28;mix-blend-mode:multiply}
.esp-doula .ab-age{position:absolute;bottom:14px;z-index:2;display:flex;flex-direction:column;line-height:1;max-width:48%}.esp-doula .ab-age b{font-size:3.4rem;font-weight:700;font-family:var(--f-body)}.esp-doula .ab-age span{font-size:.9rem;margin-top:4px;line-height:1.2}
.esp-doula .ab-age.g{left:18px}.esp-doula .ab-age.d{right:18px;align-items:flex-end;text-align:right}
.esp-doula .dh-mot{margin:10px 4px 0;font-family:var(--f-display);font-style:italic;color:var(--accent);font-size:.95rem;line-height:1.45}
/* lignes de liste : comme « Activités » */
.esp-doula .dh-row{border:0!important;border-bottom:1px solid color-mix(in srgb,var(--line) 70%,transparent)!important;border-radius:0!important;background:none!important;box-shadow:none!important;padding:12px 2px!important;gap:12px!important}
.esp-doula .dh-row:last-child{border-bottom:0!important}
.esp-doula .dh-row .av,.esp-doula .dh-fam .av{width:42px!important;height:42px!important;border-radius:50%!important;color:#7a4a3a!important;border:0!important;flex:none}
/* fiches des familles : cartes douces */
.esp-doula .dh-fam{border:0!important;border-radius:22px!important;background:var(--card)!important;box-shadow:0 4px 16px rgba(70,45,30,.07)!important}
/* thèmes de la boîte à outils */
.esp-doula details.grpOutils{border:0!important;border-radius:22px!important;background:var(--dh-c,#f3d5c9)!important;box-shadow:0 4px 14px rgba(120,70,50,.08)!important;overflow:hidden}
.esp-doula details.grpOutils>summary{text-transform:none!important;letter-spacing:0!important;font-family:var(--f-display)!important;font-size:1.08rem!important;color:#3b2a24!important;font-weight:600!important}
.esp-doula details.grpOutils>.body{background:var(--card);border-radius:18px;margin:0 8px 8px;padding:10px}
.esp-doula #outSearch{border-radius:20px}
:root[data-theme=dark].esp-doula .ab-hero{background:linear-gradient(160deg,#4a332b,#36261f)!important;color:#f2d3c4}
:root[data-theme=dark].esp-doula details.grpOutils{background:#2c2523!important}:root[data-theme=dark].esp-doula details.grpOutils>summary{color:#f2d3c4!important}
:root[data-theme=dark].esp-doula .dh-row .av,:root[data-theme=dark].esp-doula .dh-fam .av{background:rgba(232,150,125,.2)!important;color:#f4cdbd!important}
`;document.head.appendChild(css);
})();
