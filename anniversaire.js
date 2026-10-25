/* Sérénaissance — « mois-niversaire » : à 1, 2, 3… 12 mois, puis à 18 mois, 2 ans, 2 ans ½… jusqu'à 5 ans,
   un petit mot s'affiche à l'ouverture de l'appli (le jour même ou dans les 3 jours suivants), une seule fois. Les parents touchent OK pour fermer. */
(function(){
if(window.ESPACE!=='parent')return;
const MOTS={1:'Un mois déjà ! Un mois de nuits courtes, de premières fois et de tout petits progrès. Vous apprenez à vous connaître, et c\'est exactement ce qu\'il fallait faire.',
  2:'Deux mois ! Les premiers vrais sourires sont souvent là. Prenez le temps de les savourer : vous les avez bien mérités.',
  3:'Trois mois : la fin du 4e trimestre ! Bébé découvre ses mains, sa voix, votre visage. Bravo pour ce premier grand bout de chemin.',
  4:'Quatre mois ! Les rires, les gazouillis, les mains qui attrapent tout. Chaque jour, un petit quelque chose de nouveau.',
  5:'Cinq mois ! Bébé se retourne peut-être, babille de plus en plus. Votre complicité grandit avec lui.',
  6:'Six mois, une demi-année ! Bientôt les premières cuillères : l\'onglet Diversification vous attend dans le Journal bébé.',
  7:'Sept mois ! Assis, curieux, il explore tout avec ses mains et sa bouche. Le monde devient son terrain de jeu.',
  8:'Huit mois ! Il reconnaît bien ses personnes préférées… et ce sont vous. Normal qu\'il proteste quand vous partez.',
  9:'Neuf mois : autant de temps dehors que dedans ! Il rampe, se hisse, découvre. Quel chemin parcouru ensemble.',
  10:'Dix mois ! Pointer, imiter, dire « ba-ba » ou « ma-ma »… il a tant à vous raconter.',
  11:'Onze mois ! Debout en se tenant, peut-être quelques pas… La première année tire à sa fin, prenez une photo de ce moment.',
  12:'Joyeux 1er anniversaire ! Une année entière d\'amour, de fatigue, de fierté. Vous avez fait un travail immense : soufflez la bougie avec lui.',
  18:'Un an et demi ! Il marche, dit ses premiers mots, veut tout faire « tout seul ». Bravo pour votre patience.',
  24:'Joyeux 2e anniversaire ! Des phrases qui commencent, une personnalité qui s\'affirme. Quelle belle personne il devient.',
  30:'Deux ans et demi ! Les « pourquoi ? » arrivent, l\'imagination déborde. Profitez de ces conversations.',
  36:'Joyeux 3e anniversaire ! Il raconte, il joue à faire semblant, il se fait des amis. Trois ans de vous deux… et de lui.',
  42:'Trois ans et demi ! Dessins, histoires, grandes questions : il comprend le monde un peu plus chaque jour.',
  48:'Joyeux 4e anniversaire ! Curieux, drôle, plein d\'idées. Vous l\'accompagnez si bien.',
  54:'Quatre ans et demi ! Il se prépare doucement pour la grande école. Quelle fierté de le voir grandir.',
  60:'Joyeux 5e anniversaire ! Cinq ans d\'aventures, du premier souffle à aujourd\'hui. Merci d\'avoir fait ce chemin avec Sérénaissance.'};
const ETAPES=[1,2,3,4,5,6,7,8,9,10,11,12,18,24,30,36,42,48,54,60];
function plusMois(b,m){const d=new Date(b);const j=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+m);const fin=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(j,fin));d.setHours(0,0,0,0);return d}
function titre(m,nom,p){const v=p?' a eu ':' a ';if(m<12)return nom+v+m+' mois'+(p?' !':' aujourd\'hui !');if(m===12)return nom+v+'1 an !';if(m%12===0)return nom+v+(m/12)+' ans !';const a=Math.floor(m/12);return nom+v+a+' an'+(a>1?'s':'')+' et demi !'}
function vus(){try{return (S.parent.annivVus||[]).concat(JSON.parse(localStorage.getItem('sere-anniv-vus')||'[]'))}catch(e){return S.parent.annivVus||[]}}
function marquer(k){try{S.parent.annivVus=Array.from(new Set((S.parent.annivVus||[]).concat([k])));localStorage.setItem('sere-anniv-vus',JSON.stringify(S.parent.annivVus));if(typeof save==='function')save()}catch(e){}}
function verifier(){try{if(S.role!=='parent'||document.getElementById('anniv')||document.getElementById('felic'))return;const l=document.getElementById('layer');if(l&&l.innerHTML)return;
  const st=stage();if(st.k!=='pp')return;const auj=new Date();auj.setHours(0,0,0,0);const V=vus();
  for(const m of ETAPES){const d=plusMois(st.birth,m),k=new Date(st.birth).toISOString().slice(0,10)+'+'+m;if(V.includes(k))continue;
    if(+auj>=+d&&+auj<=+d+3*864e5){montrer(m,k,st,+auj>+d);return}}}catch(e){}}
function montrer(m,k,st,passe){const nom=esc(((S.parent.naissance||{}).prenomBebe||'').trim()||'Bébé'),ph=S.parent.photoBebe;
  const o=document.createElement('div');o.id='anniv';o.setAttribute('role','dialog');o.setAttribute('aria-label','Mois-niversaire');
  const conf=Array.from({length:18},(_,i)=>'<i style="left:'+(5+i*5.3)+'%;animation-delay:'+(i%6)*.25+'s;background:'+['#f2b8a2','#e8c37a','#a9c79f','#c9a0c4','#f0d0c0'][i%5]+'"></i>').join('');
  o.innerHTML='<div class="an-fond"></div><div class="an-boite">'+conf+'<div class="an-rond">'+(ph?'<img src="'+esc(ph)+'" alt="">':'<span>'+(m<12?'🎈':'🎂')+'</span>')+'</div>'+
    '<span class="an-sur">'+(m<12?'Joyeux mois-niversaire':m%12===0?'Joyeux anniversaire':'Joyeux demi-anniversaire')+'</span><h2>'+titre(m,nom,passe)+'</h2><p>'+MOTS[m]+'</p><button class="an-ok">OK</button></div>';
  document.body.appendChild(o);try{navigator.vibrate&&navigator.vibrate([60,40,60])}catch(e){}
  const fermer=()=>{marquer(k);o.classList.add('fin');setTimeout(()=>o.remove(),250)};o.querySelector('.an-ok').onclick=fermer}
const _r=render;render=function(){const x=_r.apply(this,arguments);clearTimeout(window._annivT);window._annivT=setTimeout(verifier,1500);return x};
(function(){const st=document.createElement('style');st.textContent=
  '#anniv{position:fixed;inset:0;z-index:200;display:grid;place-items:center;padding:20px;animation:anIn .25s ease-out}#anniv.fin{opacity:0;transition:opacity .25s}'+
  '.an-fond{position:absolute;inset:0;background:rgba(40,25,20,.55);backdrop-filter:blur(3px)}'+
  '.an-boite{position:relative;overflow:hidden;width:min(360px,100%);background:#fff8f3;color:#2b1b17;border-radius:28px;padding:28px 22px 20px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.3);animation:anPop .35s cubic-bezier(.2,1.4,.4,1)}'+
  '.an-boite>:not(i){position:relative;z-index:1}.an-boite>i{z-index:0;position:absolute;top:-12px;width:8px;height:14px;border-radius:2px;animation:anTombe 2.6s linear infinite;opacity:.9}'+
  '.an-rond{width:110px;height:110px;margin:0 auto 12px;border-radius:50%;overflow:hidden;background:linear-gradient(150deg,#f6e3d8,#e8cdbf);display:grid;place-items:center;font-size:3.2rem;border:4px solid #fff;box-shadow:0 6px 18px rgba(168,87,67,.25)}.an-rond img{width:100%;height:100%;object-fit:cover}'+
  '.an-sur{font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#a85743}.an-boite h2{font-family:var(--f-display);font-size:1.6rem;margin:6px 0 10px;color:#2b1b17}.an-boite p{font-size:.95rem;line-height:1.5;color:#5b463d;margin:0 0 18px}'+
  '.an-ok{width:100%;border:0;border-radius:16px;padding:14px;background:#a85743;color:#fff;font:700 1rem var(--f-body);cursor:pointer}'+
  '@keyframes anIn{from{opacity:0}}@keyframes anPop{from{transform:scale(.85);opacity:0}}@keyframes anTombe{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(520px) rotate(540deg)}}'+
  '@media (prefers-reduced-motion:reduce){.an-boite>i{display:none}.an-boite{animation:none}}';
  document.head.appendChild(st)})();
})();
