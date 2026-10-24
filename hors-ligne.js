/* Sérénaissance — trousse hors ligne (famille) : à l'hôpital, le signal est souvent faible. L'appli garde une copie du plan de naissance, de la valise et des contacts,
   et l'affiche quand il n'y a pas de réseau. */
(function(){
if(window.ESPACE!=='parent')return;
const CLE='srn_hors_ligne';let dernier='';
function lire(){try{return JSON.parse(localStorage.getItem(CLE)||'null')}catch(e){return null}}
function copier(){try{if(S.role!=='parent'||!S.parent||!MOI)return;
  const o={t:Date.now(),parent:S.parent,doula:DOULA?{prenom:DOULA.prenom,nom:DOULA.nom,telephone:DOULA.telephone,courriel:DOULA.courriel,entreprise:DOULA.entreprise}:null,fam:FAM?{id:FAM.id,prenom:FAM.prenom}:null};
  const j=JSON.stringify(o.parent)+JSON.stringify(o.doula);if(j===dernier)return;dernier=j;localStorage.setItem(CLE,JSON.stringify(o))}catch(e){}}
const _r=render;render=function(){const r=_r.apply(this,arguments);setTimeout(copier,1500);return r};
function ecran(snap,msg){
  const prev={p:S.parent,d:DOULA,f:typeof FAM!=='undefined'?FAM:null};
  S.parent=snap.parent;DOULA=snap.doula||{};
  let plan='';try{plan=planCoup().replace(/<button[\s\S]*?<\/button>/g,'')}catch(e){plan='<p class="small muted">Plan indisponible.</p>'}
  let val='';try{const V=(snap.parent.valise)||{};val=Object.entries(VALISE).map(([k,l])=>'<div class="card"><span class="eyebrow acc">'+esc(k)+'</span><ul class="clean small" style="list-style:none;padding:0">'+l.map(x=>'<li>'+(V[x]?'☑':'☐')+' '+esc(x)+'</li>').join('')+'</ul></div>').join('')}catch(e){}
  const C=(snap.parent.contacts)||{};let ctc='<div class="card"><div class="banner bad"><div class="small"><b>Urgence : 911</b> · Info-Santé : <b>811</b> · Ligne de crise : <b>988</b></div></div><div class="list">'+
   (snap.doula&&snap.doula.telephone?'<div class="li"><div class="tx"><b>Ma doula · '+esc([snap.doula.prenom,snap.doula.nom].filter(Boolean).join(' '))+'</b><span><a href="tel:'+esc(String(snap.doula.telephone).replace(/[^\d+]/g,''))+'">'+esc(snap.doula.telephone)+'</a></span></div></div>':'')+
   (typeof CONTACTS!=='undefined'?CONTACTS.map(c=>C[c[0]]?'<div class="li"><div class="tx"><b>'+esc(c[1])+'</b><span>'+(c[0]==='adr'?esc(C[c[0]]):'<a href="tel:'+esc(String(C[c[0]]).replace(/[^\d+]/g,''))+'">'+esc(C[c[0]])+'</a>')+'</span></div></div>':'').join(''):'')+'</div></div>';
  S.parent=prev.p;DOULA=prev.d;
  const q=new Date(snap.t).toLocaleString('fr-CA',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'});
  $('#tabs').innerHTML='';try{$('#gear').hidden=true}catch(e){}
  $('#app').innerHTML='<div class="stack" style="gap:12px;max-width:560px;margin:0 auto"><div class="card"><span class="eyebrow acc">Mode hors ligne</span><h2>Ma trousse sans réseau</h2><p class="small muted">Pas de connexion pour le moment : voici la copie de votre plan, de votre valise et de vos contacts, enregistrée le '+esc(q)+'. Vous ne pouvez rien modifier tant que vous êtes hors ligne.</p><button class="btn" data-act="hlRetour">Réessayer la connexion</button></div>'+
   '<div class="seg"><button class="chip on" data-act="hlTab" data-v="c">Contacts</button><button class="chip" data-act="hlTab" data-v="p">Plan de naissance</button><button class="chip" data-act="hlTab" data-v="v">Valise</button></div>'+
   '<div data-hl="c">'+ctc+'</div><div data-hl="p" hidden>'+plan+'</div><div data-hl="v" hidden>'+val+'</div></div>'}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="hlTab"],[data-act="hlRetour"]');if(!b)return;e.stopPropagation();e.preventDefault();
  if(b.dataset.act==='hlRetour'){location.reload();return}
  document.querySelectorAll('[data-hl]').forEach(x=>x.hidden=x.dataset.hl!==b.dataset.v);document.querySelectorAll('[data-act="hlTab"]').forEach(x=>x.classList.toggle('on',x===b))},true);
const _ec=ecranConnexion;ecranConnexion=function(m){const s=lire();
  if(s&&s.parent&&(navigator.onLine===false||/fetch|network|r[ée]seau|connexion internet/i.test(String(m||''))))return ecran(s,m);
  return _ec.apply(this,arguments)};
window.addEventListener('online',()=>{if(document.querySelector('[data-act="hlRetour"]'))location.reload()});
})();
