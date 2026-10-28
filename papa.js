/* Sérénaissance — mode papa / partenaire.
   La maman invite son partenaire (Paramètres > Mon partenaire). Il a son propre compte, voit la même grossesse
   et le même bébé, peut noter boires, couches et sommeil, reçoit des conseils pour papas, et la maman peut lui « passer le relais ». */
(function(){
if(window.ESPACE!=='parent')return;
window.PAPA=null;window.COP=[];
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const HEURE=36e5;
function ago(t){const m=Math.max(0,Math.round((Date.now()-t)/6e4));if(m<2)return 'à l\'instant';if(m<60)return 'il y a '+m+' min';const h=Math.floor(m/60);if(h<24)return 'il y a '+h+' h'+(m%60>=10?' '+String(m%60).padStart(2,'0'):'');const j=Math.floor(h/24);return 'il y a '+j+' jour'+(j>1?'s':'')}
const nomMere=()=>((FAM&&FAM.prenom)||'maman');
const nomPapa=()=>PAPA?(PAPA.prenom||'Papa'):((COP.find(c=>c.user_id)||COP[0]||{}).prenom||'son partenaire');
const moi=()=>PAPA?(PAPA.prenom||'Papa'):(nomMere());
const actifs=()=>COP.filter(c=>!c.retire_le);

/* ---------- chargement ---------- */
async function lireCop(){try{const r=await sb.from('fam_coparents').select('id,courriel,prenom,user_id,retire_le,invite_envoyee').eq('famille_id',FAM.id).is('retire_le',null);COP=r.data||[]}catch(e){COP=[]}}
const _cp=chargerParent;
chargerParent=async function(){
  await _cp.apply(this,arguments);
  try{
    PAPA=(MOI&&MOI.coparent||[]).find(c=>c.famille===FAM.id)||null;
    await lireCop();abonner();
  }catch(e){}
};

/* ---------- le papa ne se fait pas appeler du prénom de la maman ---------- */
const _r=render;
function placer(){try{const app=document.getElementById('app');if(!app)return;const cs=[...app.querySelectorAll(':scope>.papa-b,:scope>.papa-rel,:scope>.papa-cs')];if(!cs.length)return;
  let ref=app.querySelector(':scope>.ab-top')||app.querySelector(':scope>.sh')||app.querySelector(':scope>.card.mot');
  cs.forEach(c=>{if(ref){ref.after(c);ref=c}})}catch(e){}}
render=function(){
  const x=rendre.apply(this,arguments);setTimeout(placer,0);return x};
function rendre(){
  if(!PAPA||!S.parent)return _r.apply(this,arguments);
  const vrai=S.parent.prenom;S.parent.prenom=PAPA.prenom||'Papa';
  /* les félicitations « une seule fois » restent pour la maman */
  /* papa a droit aux siennes : une fois, sur son appareil */
  const cle='papa-felic-'+(FAM&&FAM.id);let vu=false;try{vu=!!localStorage.getItem(cle)}catch(e){}
  const n=S.parent.naissance,fel=n?n.felicite:undefined;if(n){if(vu)n.felicite=1;else delete n.felicite}
  try{const x=_r.apply(this,arguments);
    const o=document.getElementById('felic');if(o&&!vu){try{localStorage.setItem(cle,'1')}catch(e){}const h=o.querySelector('h1');if(h)h.textContent='Félicitations, '+(PAPA.prenom||'Papa')+' et '+nomMere()+' !'}
    return x}finally{S.parent.prenom=vrai;if(n){if(fel===undefined)delete n.felicite;else n.felicite=fel}}
};
if(typeof sauverProfil==='function'){const _sp=sauverProfil;sauverProfil=function(){if(PAPA){toast('Ce profil est celui de '+nomMere()+'. Votre accès partage son suivi.');return}return _sp.apply(this,arguments)}}

/* ---------- qui a noté quoi ---------- */
const _lp=logPush;
logPush=function(o){try{if(o&&!o.par){if(PAPA)o.par=PAPA.prenom||'Papa';else if(actifs().length)o.par=(S.parent.prenom||'Maman')}}catch(e){}return _lp.apply(this,arguments)};

/* ---------- temps réel : journal + relais ---------- */
let ch=null,tMaj=null;
function maj(){clearTimeout(tMaj);tMaj=setTimeout(()=>{try{const a=document.activeElement;if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))return;const L=document.getElementById('layer');if(L&&L.innerHTML.trim())return;render()}catch(e){}},350)}
const lire=r=>Object.assign({},r.data,{id:r.id,t:new Date(r.t).getTime(),type:r.type});
function abonner(){
  if(ch||!FAM||!sb.channel)return;
  try{
    ch=sb.channel('fam-'+FAM.id)
    .on('postgres_changes',{event:'*',schema:'public',table:'fam_journal',filter:'famille_id=eq.'+FAM.id},p=>{
      setTimeout(()=>{try{
        if(p.eventType==='DELETE'){const id=p.old&&p.old.id;if(id){S.logs=S.logs.filter(l=>l.id!==id);maj()}return}
        const r=p.new;if(!r)return;const i=S.logs.findIndex(l=>l.id===r.id);
        if(i>=0)S.logs[i]=lire(r);else S.logs.push(lire(r));
        maj()}catch(e){}},p.eventType==='INSERT'?700:0)})
    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'fam_familles',filter:'id=eq.'+FAM.id},p=>{
      try{const pd=p.new&&p.new.parent_data;if(!pd)return;
        if(JSON.stringify(pd.relais||null)!==JSON.stringify(S.parent.relais||null)){S.parent.relais=pd.relais||null;maj()}}catch(e){}})
    .subscribe();
  }catch(e){}
}
async function recharger(){
  try{if(!FAM||S.role!=='parent')return;
    const depuis=new Date(Date.now()-120*864e5).toISOString();
    const {data:j}=await sb.from('fam_journal').select('*').eq('famille_id',FAM.id).gte('t',depuis).order('t');
    if(j)S.logs=j.map(lire);
    const {data:f}=await sb.from('fam_familles').select('parent_data').eq('id',FAM.id).single();
    if(f&&f.parent_data)S.parent.relais=f.parent_data.relais||null;
    await lireCop();maj()}catch(e){}
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')recharger()});

/* ---------- carte Relais (accueil) ---------- */
function resume(depuis){
  const L=(S.logs||[]).filter(l=>l.t>=depuis&&l.type!=='relais');
  const n=t=>L.filter(l=>l.type===t).length;
  const p=[];if(n('biberon'))p.push(n('biberon')+' biberon'+(n('biberon')>1?'s':''));if(n('sein'))p.push(n('sein')+' tétée'+(n('sein')>1?'s':''));
  if(n('couche'))p.push(n('couche')+' couche'+(n('couche')>1?'s':''));if(n('sommeil'))p.push(n('sommeil')+' sommeil');if(n('tirage'))p.push(n('tirage')+' tirage'+(n('tirage')>1?'s':''));
  return p;
}
function dernier(){
  const f=(S.logs||[]).filter(l=>l.type==='biberon'||l.type==='sein').sort((a,b)=>b.t-a.t)[0];
  const c=(S.logs||[]).filter(l=>l.type==='couche').sort((a,b)=>b.t-a.t)[0];
  const x=[];if(f)x.push('Dernier boire '+ago(f.t)+(f.par?' ('+E(f.par)+')':''));if(c)x.push('dernière couche '+ago(c.t)+(c.par?' ('+E(c.par)+')':''));
  return x.join(' · ');
}
function carteRelais(){
  if(!PAPA&&!actifs().length)return '';
  if(typeof stage==='function'){const k=stage().k;if(k!=='pp'&&!PAPA)return ''}
  const R=S.parent.relais||{a:'maman',t:0};const dePapa=R.a==='papa';
  const autre=PAPA?nomMere():nomPapa();
  const enService=dePapa?nomPapa():nomMere();
  const jeSuis=(PAPA&&dePapa)||(!PAPA&&!dePapa);
  let h='<div class="card papa-rel"><span class="eyebrow acc">🤝 Relais</span>';
  h+='<h2 class="papa-t">'+(jeSuis?'C\'est vous qui êtes de service':E(enService)+' est de service')+'</h2>';
  if(R.t){h+='<p class="small muted" style="margin:2px 0 8px">'+(R.par?E(R.par)+' a passé le relais ':'Relais passé ')+ago(R.t)+'.</p>';
    if(R.note)h+='<p class="papa-note">« '+E(R.note)+' »</p>';
    const rs=resume(R.t);if(rs.length)h+='<p class="small"><b>Depuis le relais :</b> '+rs.join(', ')+'.</p>'}
  const d=dernier();if(d)h+='<p class="xs muted">'+d+'.</p>';
  const txt=PAPA?(dePapa?'Rendre le relais à '+E(nomMere()):'Prendre le relais'):(dePapa?'Reprendre le relais':'Passer le relais à '+E(nomPapa()));
  h+='<button class="btn" data-papa="relais" style="margin-top:8px">'+txt+'</button></div>';
  return h;
}
function feuilleRelais(){
  const R=S.parent.relais||{a:'maman',t:0};const verPapa=!(R.a==='papa');
  const vers=PAPA?(R.a==='papa'?'maman':'papa'):(R.a==='papa'?'maman':'papa');
  const pourPapa=vers==='papa';
  const titre=pourPapa?'Passer le relais à '+E(nomPapa()):(PAPA?'Rendre le relais à '+E(nomMere()):'Reprendre le relais');
  const d=dernier();
  sheet(titre,'<p class="small muted">Laissez un petit mot pour que la personne qui prend le relais sache où vous en êtes (facultatif).</p>'+
    (d?'<p class="xs">'+d+'.</p>':'')+
    '<label class="f">Petit mot<textarea id="papaNote" rows="3" maxlength="240" placeholder="Ex. : dernier boire à 21 h, il s\'endort mieux sur le côté de ton épaule."></textarea></label>'+
    '<button class="btn" data-papa="relais-ok" data-vers="'+(pourPapa?'papa':'maman')+'">C\'est fait 💗</button>');
}
function confirmerRelais(vers){
  const note=((document.getElementById('papaNote')||{}).value||'').trim().slice(0,240);
  S.parent.relais={a:vers,t:Date.now(),note,par:moi()};
  save();close();render();toast(vers==='papa'?'Le relais est passé 💗':'Relais repris 💗');
}

/* ---------- conseils pour papas (sources officielles) ---------- */
const SRC={
 inspq_acc:['INSPQ — Préparation à l\'accouchement','https://www.inspq.qc.ca/mieux-vivre/grossesse/preparation-accouchement'],
 inspq_all:['INSPQ — Importance du réseau de soutien pendant l\'allaitement','https://www.inspq.qc.ca/mieux-vivre/grossesse/preparation-l-allaitement/l-importance-d-reseau-soutien'],
 inspq_dor:['INSPQ — Dormir en sécurité','https://www.inspq.qc.ca/mieux-vivre/nouveau-ne/sommeil/dormir-en-securite'],
 cps_pl:['Société canadienne de pédiatrie — Les coliques et les pleurs','https://www.soinsdenosenfants.cps.ca/handouts/colic_and_crying'],
 aspc:['Agence de la santé publique du Canada — Les sentiments après la naissance d\'un bébé','https://www.canada.ca/content/dam/phac-aspc/documents/services/publications/healthy-living/for-fathers/sentiments-apres-naissance-bebe-ya-personne-parfait.pdf']
};
const CONSEILS={
 preg:[
  {e:'🧳',t:'Le sac, quelques semaines avant',c:'Dans les semaines qui précèdent la date prévue, planifiez ensemble ce que vous apportez au lieu de naissance et préparez le sac.',s:'inspq_acc'},
  {e:'📞',t:'Quand partir ?',c:'Demandez à l\'équipe qui suit la grossesse à quel moment vous rendre au lieu de naissance. Certains lieux permettent même de joindre directement la salle d\'accouchement pour poser des questions dès 20 semaines.',s:'inspq_acc'},
  {e:'👧',t:'Les autres enfants',c:'Sachez à l\'avance qui s\'occupera des enfants quand vous partirez, et informez cette personne de leur routine et de leurs préférences. Vous partirez plus serein.',s:'inspq_acc'},
  {e:'🤱',t:'Réfléchir à l\'allaitement ensemble',c:'Le ou la partenaire joue un rôle important dans l\'allaitement : vous pouvez participer à la réflexion et à la décision, puis aider concrètement dès les premiers jours.',s:'inspq_all'}
 ],
 pp:[
  {e:'🌙',t:'Un sommeil sécuritaire',c:'Bébé dort sur le dos, dans son propre lit, sur un matelas ferme. Rien d\'autre qu\'un drap-housse dans le lit (pas de couette, d\'oreiller ni de bordure). S\'il a froid, une couverture légère ou une grenouillère de sommeil de sa taille. Il ne faut pas qu\'il ait trop chaud. Durant les six premiers mois, son lit est dans la chambre des parents.',s:'inspq_dor'},
  {e:'🤱',t:'Soutenir l\'allaitement',c:'Apportez à boire ou une collation à la personne qui allaite, encouragez-la avec des mots positifs, offrez du réconfort dans les moments de doute et protégez-la des commentaires de l\'entourage. Entre les tétées : peau à peau, bercer, changer la couche, faire faire le rot.',s:'inspq_all'},
  {e:'😮‍💨',t:'Quand les pleurs dépassent tout le monde',c:'Si vous vous sentez dépassé : déposez bébé dans un endroit sûr (son lit), éloignez-vous quelques minutes, respirez profondément. Ne secouez, ne frappez et ne lancez jamais un bébé : cela peut causer des blessures graves, même la mort. Demandez de l\'aide à un proche de confiance. Si vous craignez de lui faire du mal, parlez-en à un médecin tout de suite.',s:'cps_pl'},
  {e:'💛',t:'Vous aussi, vous comptez',c:'Le manque de sommeil, le changement de rôle et la pression financière sont des défis courants. Certains pères vivent une dépression postnatale : tristesse, colère, irritabilité ou désespoir, changements du sommeil ou de l\'appétit, difficulté à créer un lien avec bébé. Parlez-en à votre partenaire, à un proche ou à un professionnel de la santé. Prendre soin de vous aide aussi votre enfant.',s:'aspc'}
 ]
};
function listeConseils(){const k=typeof stage==='function'?stage().k:'preg';return k==='pp'?CONSEILS.pp:CONSEILS.preg}
function carteConseil(){
  const L=listeConseils();if(!L.length)return '';
  const j=Math.floor(Date.now()/864e5);const c=L[j%L.length];const s=SRC[c.s];
  return '<div class="card papa-cs"><span class="eyebrow acc">💡 Conseil pour papa</span><h2 class="papa-t">'+c.e+' '+E(c.t)+'</h2><p class="small">'+E(c.c)+'</p><p class="xs muted">Source : <a href="'+s[1]+'" target="_blank" rel="noopener">'+E(s[0])+'</a></p><button class="btn sm ghost" data-papa="conseils">Tous les conseils</button></div>';
}
function feuilleConseils(){
  const L=listeConseils();
  sheet('Conseils pour papa','<div class="stack" style="gap:12px">'+L.map(c=>{const s=SRC[c.s];return '<div class="papa-li"><b>'+c.e+' '+E(c.t)+'</b><p class="small" style="margin:4px 0">'+E(c.c)+'</p><p class="xs muted" style="margin:0">Source : <a href="'+s[1]+'" target="_blank" rel="noopener">'+E(s[0])+'</a></p></div>'}).join('')+'</div><p class="xs muted" style="margin-top:12px">Ces conseils informent mais ne remplacent pas l\'avis de votre équipe de soins.</p>');
}
function banniere(){
  return '<div class="card papa-b"><b>👋 Bonjour '+E(PAPA.prenom||'Papa')+'</b><p class="small" style="margin:4px 0 0">Vous suivez ce parcours avec '+E(nomMere())+'. Ce que vous notez apparaît aussi chez elle, en direct.</p></div>';
}
const _pA=pAccueil;
pAccueil=function(){
  const h=_pA.apply(this,arguments);
  try{let av='';if(PAPA)av+=banniere();av+=carteRelais();if(PAPA)av+=carteConseil();return av+h}catch(e){return h}
};

/* ---------- Paramètres : Mon partenaire ---------- */
function cartePartenaire(){
  if(PAPA){return '<div class="card"><span class="eyebrow acc">Mon accès</span><p class="small">Vous suivez la grossesse et bébé avec <b>'+E(nomMere())+'</b>. Vous pouvez noter boires, couches et sommeil, et voir le suivi.</p></div>'}
  const L=actifs();
  let h='<div class="card"><span class="eyebrow acc">💞 Mon partenaire</span><p class="small muted">Invitez votre partenaire : il aura son propre compte, suivra la même grossesse et le même bébé, pourra noter les boires et les couches quand vous vous reposez, et recevra des conseils pour papas. Vous pouvez lui « passer le relais » à tout moment.</p>';
  h+=L.map(c=>'<div class="pf-l"><div><b>'+E(c.prenom||c.courriel)+'</b><small>'+E(c.courriel)+' · '+(c.user_id?'a rejoint':'invitation envoyée')+'</small></div><div class="row" style="gap:6px"><button class="btn sm ghost" data-papa="renvoyer" data-id="'+c.id+'">Renvoyer</button><button class="btn sm ghost" data-papa="retirer" data-id="'+c.id+'">Retirer</button></div></div>').join('');
  if(L.length<2)h+='<button class="btn sm" data-papa="inviter" style="margin-top:8px">+ Inviter mon partenaire</button>';
  return h+'</div>';
}
const _pP=pParametres;
pParametres=function(){const h=_pP.apply(this,arguments);try{return h+cartePartenaire()}catch(e){return h}};
function feuilleInvite(c){
  sheet('Inviter mon partenaire','<p class="small muted">Un courriel doux lui sera envoyé avec un bouton pour créer son accès.</p><label class="f">Prénom<input id="papaPre" value="'+E(c&&c.prenom||'')+'" autocomplete="off"></label><label class="f">Courriel<input id="papaMail" type="email" inputmode="email" autocapitalize="none" value="'+E(c&&c.courriel||'')+'"></label><button class="btn" data-papa="envoyer">Envoyer l\'invitation</button>');
}
async function envoyerInvite(){
  const mail=((document.getElementById('papaMail')||{}).value||'').trim().toLowerCase(),pre=((document.getElementById('papaPre')||{}).value||'').trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){toast('Entrez un courriel valide');return}
  toast('Envoi de l\'invitation…');
  const {data,error}=await sb.functions.invoke('fam-inviter-papa',{body:{famille:FAM.id,courriel:mail,prenom:pre}});
  let msg=data&&data.erreur;
  if(error&&!msg){try{const j=await error.context.json();msg=j&&j.erreur}catch(e){}msg=msg||error.message}
  if(msg){toast(msg);return}
  await lireCop();close();render();toast('Invitation envoyée 💌');
}

/* ---------- clics ---------- */
document.addEventListener('click',async e=>{
  const b=e.target.closest&&e.target.closest('[data-papa]');if(!b)return;
  e.preventDefault();e.stopPropagation();
  const a=b.dataset.papa;
  try{
    if(a==='relais')feuilleRelais();
    else if(a==='relais-ok')confirmerRelais(b.dataset.vers);
    else if(a==='conseils')feuilleConseils();
    else if(a==='inviter')feuilleInvite();
    else if(a==='envoyer')await envoyerInvite();
    else if(a==='renvoyer'){const c=COP.find(x=>x.id===b.dataset.id);if(c)feuilleInvite(c)}
    else if(a==='retirer'){const c=COP.find(x=>x.id===b.dataset.id);if(c&&confirm('Retirer l\'accès de '+(c.prenom||c.courriel)+' ?')){const {error}=await sb.rpc('fam_retirer_coparent',{p_id:c.id});if(error){toast(error.message);return}await lireCop();render();toast('Accès retiré')}}
  }catch(err){toast('Une erreur est survenue')}
},true);

/* ---------- style ---------- */
const st=document.createElement('style');
st.textContent='.papa-rel,.papa-cs{background:linear-gradient(135deg,#fdf0e6,#fbe6ec)!important;color:#4a2c25}.papa-rel .eyebrow,.papa-cs .eyebrow{color:#a85743}.papa-t{font-size:1.15rem;margin:2px 0 4px}.papa-note{margin:4px 0 8px;padding:8px 12px;border-left:3px solid #b5644d;background:rgba(255,255,255,.6);border-radius:8px;font-style:italic}.papa-b{background:#eef5f1!important;color:#2f4a3e}.papa-li{padding:10px 12px;border:1px solid var(--line,#e6d9d0);border-radius:14px}.papa-cs a{color:#a85743}:root[data-theme=dark] .papa-rel,:root[data-theme=dark] .papa-cs{background:#3a2a28!important;color:#f3e4de}:root[data-theme=dark] .papa-b{background:#22332b!important;color:#d9ebe1}:root[data-theme=dark] .papa-note{background:rgba(255,255,255,.08)}:root[data-theme=dark] .papa-t{color:inherit}';
document.head.appendChild(st);
})();
