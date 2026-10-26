/* Sérénaissance — « Dossier de suivi » de la doula, dans le dossier de chaque famille (espace doula seulement).
   Ouverture du dossier, 3 rencontres prénatales, rapport d'accouchement, 3 visites postnatales, bilan : se remplissent à l'écran
   (enregistrement automatique) et s'impriment avec le logo et le nom de la doula, en rempli ou en vierge.
   Le modèle de l'Académie n'est pas utilisable tel quel : chaque doula doit mettre son logo et son nom, puis l'adapter à sa pratique
   (retirer ou ajouter des questions et des sujets). Les notes restent privées : la famille ne lit jamais fam_dossiers.
   Les informations de santé sont notées telles que la famille ou l'équipe les rapporte : la doula n'examine pas et ne pose aucun diagnostic. */
(function(){
if(window.ESPACE==='parent'||typeof cResume!=='function'||!window.DSUIVI_MODELE||typeof CTABS==='undefined')return;
const M=window.DSUIVI_MODELE;
const ORDRE=[['ouverture','fa-folder-open','Dossier'],['pre1','fa-calendar-check','Prénatal'],['pre2','fa-calendar-check','Prénatal'],['pre3','fa-calendar-check','Prénatal'],['accouchement','fa-person-pregnant','Naissance'],['post1','fa-baby','Postnatal'],['post2','fa-baby','Postnatal'],['post3','fa-baby','Postnatal'],['bilan','fa-flag-checkered','Fermeture']];
const AVEC_NOTES=k=>/^(pre|post)\d$/.test(k);
if(!CTABS.some(x=>x[0]==='dossier')){const k=CTABS.findIndex(x=>x[0]==='rencontres');CTABS.splice(k>=0?k:CTABS.length,0,['dossier','Dossier de suivi'])}
const slug=t=>String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,36)||'x';
const sansTrait=t=>String(t||'').replace(/_{2,}/g,'').replace(/\s+([:,])/g,'$1').trim();
const aTrait=t=>/_{3,}/.test(t||'');
const mod=()=>(ME_DOULA&&ME_DOULA.modeles)||{};
const cfg=()=>mod().dossier||{};
const cf=fk=>{const f=(cfg().formes||{})[fk]||{};return {cache:f.cache||[],ajout:f.ajout||[],ajoutSuj:f.ajoutSuj||[]}};
const logoOk=()=>{const l=(mod().marque||{}).logo;return /^data:image\/(png|jpeg|webp);base64,/.test(l||'')?l:''};
const nomPro=()=>{const D=S.doula||{};return (D.entreprise||D.nom||'').trim()};
const proprio=()=>{try{return ((ME_DOULA.courriel||'').toLowerCase()==='sc@academiesere.ca')||!!(typeof MOI!=='undefined'&&MOI&&MOI.admin)}catch(e){return false}};
function nbModif(){const F=cfg().formes||{};let n=0;Object.keys(F).forEach(k=>{n+=(F[k].cache||[]).length+(F[k].ajout||[]).length+(F[k].ajoutSuj||[]).length});return n}
function etat(){const logo=!!logoOk(),nom=!!nomPro(),nm=nbModif(),relu=!!cfg().relu;
  const ok=proprio()?(nom):(logo&&nom&&nm>0&&relu);return {logo,nom,nm,relu,ok}}
async function sauverCfg(fn){const m=Object.assign({},mod()),d=JSON.parse(JSON.stringify(m.dossier||{}));d.formes=d.formes||{};fn(d);m.dossier=d;
  const {error}=await sb.from('fam_doulas').update({modeles:m}).eq('id',ME_DOULA.id);if(error){toast('Pas enregistré : '+error.message);return false}ME_DOULA.modeles=m;return true}
const F=(d,fk)=>{d.formes[fk]=d.formes[fk]||{};d.formes[fk].cache=d.formes[fk].cache||[];d.formes[fk].ajout=d.formes[fk].ajout||[];d.formes[fk].ajoutSuj=d.formes[fk].ajoutSuj||[];return d.formes[fk]};
const val=(c,fk,k)=>{const o=(c.dsuivi||{})[fk]||{};return o[k]};
function commence(c,fk){const o=(c.dsuivi||{})[fk]||{};return Object.keys(o).some(k=>k!=='valide'&&o[k]!==''&&o[k]!=null&&!(typeof o[k]==='object'&&!Object.values(o[k]).some(Boolean)))}
/* ---------- clés des champs (stables : elles viennent du texte de la question) ---------- */
function champsDe(fk){const out=[];let si=-1;(M[fk].blocks||[]).forEach(b=>{if(b.s!==undefined){si++;return}
  if(b.rows)b.rows.forEach(r=>out.push({k:'r'+si+'_'+slug(r.l),l:r.l,o:r.o}));
  if(b.suj)b.suj.forEach(x=>out.push({k:'j_'+slug(x),l:x,suj:1}))});return out}
/* ---------- affichage à l'écran ---------- */
function carteEntree(c,i,P){const e=etat();
  const pas=(ok,t,sub,act)=>'<div class="li"><div class="av" style="'+(ok?'background:var(--ok,#6f8f6a);color:#fff':'')+'">'+icon(ok?'fa-check':'fa-circle')+'</div><div class="tx"><b>'+t+'</b><span class="xs muted">'+sub+'</span></div>'+(act||'')+'</div>';
  return '<div class="card"><span class="eyebrow acc">Avant de commencer</span><h3>Faites-en votre dossier</h3><p class="small">Ces documents sont un modèle de l\'Académie. Ils ne peuvent pas être utilisés tels quels : ils doivent porter votre nom et votre logo, et refléter votre pratique.</p><div class="list">'+
   pas(e.logo&&e.nom,'Mon logo et mon nom',(e.logo?'Logo ajouté':'Logo à ajouter')+' · '+(e.nom?esc(nomPro()):'nom à entrer'),'<button class="btn sm" data-ds-marque="1">'+icon('fa-image')+'Ouvrir</button>')+
   pas(e.nm>0,'Adapter le modèle à ma pratique',e.nm>0?e.nm+' changement'+(e.nm>1?'s':'')+' fait'+(e.nm>1?'s':''):'Retirez ce que vous n\'utilisez pas, ajoutez vos propres questions','<button class="btn sm" data-ds-edit="ouverture">'+icon('fa-pen')+'Adapter</button>')+
   pas(e.relu,'Confirmer','Je l\'ai relu et je suis à l\'aise avec ce dossier','<button class="btn sm" data-ds-relu="1"'+(e.logo&&e.nom&&e.nm>0?'':' disabled')+'>Confirmer</button>')+'</div></div>'}
function liste(c,i,P){let h='<div class="card"><span class="eyebrow acc">Dossier de suivi</span><p class="small">Un compte rendu par rencontre, rempli le jour même. Faits observés ou rapportés, sans jugement. Tout s\'enregistre automatiquement. Ces notes sont pour vous seulement : la famille ne les voit pas.</p></div><div class="list">';
  ORDRE.forEach(([k,ic,cat])=>{const t=M[k].titre,fait=(c.dsuivi||{})[k]&&(c.dsuivi[k].valide);const st=fait?'Terminé le '+c.dsuivi[k].valide:commence(c,k)?'Commencé':'À remplir';
   h+='<button class="li" data-ds-ouvrir="'+k+'" style="text-align:left;width:100%"><div class="av">'+icon(fait?'fa-check':ic)+'</div><div class="tx"><b>'+esc(t)+'</b><span class="xs muted">'+st+'</span></div>'+icon('fa-chevron-right')+'</button>'});
  h+='</div><div class="card"><span class="eyebrow acc">Mon modèle</span><p class="xs muted">Retirez ou ajoutez des questions et des sujets : vos changements s\'appliquent à toutes vos familles.</p><div class="row" style="gap:8px"><button class="btn sm ghost" data-ds-edit="ouverture">'+icon('fa-pen')+'Adapter mon modèle</button><button class="btn sm ghost" data-ds-marque="1">'+icon('fa-image')+'Logo et nom</button></div></div>';
  return h}
function champ(c,i,P,fk,si,r,cch){const k='r'+si+'_'+slug(r.l);if(cch.includes(k))return '';const p=P+'.dsuivi.'+fk+'.'+k;
  if(r.o&&r.o.length){const cur=val(c,fk,k);let h='<div class="f"><span class="small"><b>'+esc(r.l)+'</b></span><div class="tri">'+r.o.map(o=>'<button class="chip '+(cur===o?'on':'')+'" data-act="pick" data-p="'+esc(p)+'" data-v="'+esc(o)+'" data-ds-r="1">'+esc(sansTrait(o)||o)+'</button>').join('')+'</div>';
    const sel=r.o.find(o=>o===cur&&aTrait(o));if(sel)h+='<input type="text" data-act="txt" data-p="'+esc(p+'_t')+'" value="'+esc(val(c,fk,k+'_t')||'')+'" placeholder="Précisez">';return h+'</div>'}
  return ui.text(p,r.l)}
function formulaire(c,i,P,fk){const f=M[fk],cch=cf(fk).cache,B=P+'.dsuivi.'+fk;let h=back('dsBack','','Dossier de suivi')+'<div class="card"><span class="eyebrow acc">'+esc(f.cat)+'</span><h2 style="margin:2px 0">'+esc(f.titre)+'</h2><p class="xs muted">'+esc(f.sous)+'</p><div class="row" style="gap:8px"><button class="btn sm" data-ds-print="'+fk+'">'+icon('fa-print')+'Imprimer</button><button class="btn sm ghost" data-ds-print="'+fk+'" data-vierge="1">Imprimer vierge</button><button class="btn sm ghost" data-ds-edit="'+fk+'">'+icon('fa-pen')+'Adapter</button></div></div>';
  let si=-1,ouv=false;const fin=()=>{if(ouv){h+='</div></div>';ouv=false}};
  const sec=t=>{fin();h+='<details class="acc da-sec" open><summary>'+esc(t.replace(/^[A-Z]\.\s*/,''))+'<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body">';ouv=true};
  if(!f.blocks.some(b=>b.s!==undefined)){sec('Remplir')}
  f.blocks.forEach((b,bi)=>{
   if(b.s!==undefined){si++;sec(b.s);return}
   if(b.rows)b.rows.forEach(r=>{h+=champ(c,i,P,fk,si,r,cch)});
   else if(b.chk){const k='c'+si+'_'+bi;h+=(b.lab?'<p class="small"><b>'+esc(b.lab)+'</b></p>':'')+ui.checks(B+'.'+k,b.chk.map(sansTrait))}
   else if(b.grid){const k='g'+si+'_'+bi,extra=+(val(c,fk,k+'_n')||0);for(let r=0;r<b.n+extra;r++){h+='<div class="soft" style="margin:6px 0"><span class="xs muted"><b>Ligne '+(r+1)+'</b></span>'+b.grid.map((hd,ci)=>ui.text(B+'.'+k+'_'+r+'_'+ci,hd)).join('')+'</div>'}
     h+='<button class="btn sm ghost" data-ds-ligne="'+fk+'|'+k+'_n">'+icon('fa-plus')+'Ajouter une ligne</button>'}
   else if(b.suj){const C=cf(fk),all=b.suj.map(x=>({l:x,k:'j_'+slug(x)})).concat(C.ajoutSuj.map(x=>({l:x.l,k:'j_'+x.id})));
     h+=all.filter(x=>!cch.includes(x.k)).map(x=>'<div class="stack" style="gap:2px;margin-bottom:6px">'+ui.check(B+'.sj',x.l)+'<input type="text" data-act="txt" data-p="'+esc(B+'.jn.'+x.k)+'" value="'+esc(val(c,fk,'jn')&&val(c,fk,'jn')[x.k]||'')+'" placeholder="Notes sur ce sujet" style="margin-left:26px;width:calc(100% - 26px)"></div>').join('')}
   else if(b.zone){h+=ui.area(B+'.z'+si+'_'+bi,'','',Math.max(60,b.zone*24))}
   else if(b.sig||b.sigP){}});
  const C=cf(fk);if(C.ajout.length){si++;sec('Mes questions');C.ajout.filter(x=>!cch.includes('q_'+x.id)).forEach(x=>{h+=ui.text(B+'.q_'+x.id,x.l)})}
  fin();
  if(AVEC_NOTES(fk)){h+='<details class="acc da-sec" open><summary>Notes personnelles (pour moi seulement)<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body">'+ui.area(B+'.notes_perso','','Impressions, détails à retenir, ce que je veux revoir à la prochaine rencontre',180)+'</div></details>'}
  const v=val(c,fk,'valide');
  h+='<div class="card tint"><p class="xs muted">Seule la doula signe ce document, à l\'impression. Les informations de santé sont notées telles que la famille ou l\'équipe les rapporte.</p><div class="row" style="gap:8px"><button class="btn" data-ds-valide="'+fk+'">'+icon('fa-check')+(v?'Terminé le '+esc(v)+' (changer)':'Marquer comme terminé')+'</button><button class="btn ghost" data-ds-print="'+fk+'">'+icon('fa-print')+'Imprimer</button></div></div>';
  return h}
function editeur(fk){const f=M[fk],C=cf(fk);let h=back('dsEditBack','','Retour')+'<div class="card"><span class="eyebrow acc">Adapter mon modèle</span><p class="small">Retirez ce que vous n\'utilisez pas et ajoutez vos propres questions. Les réponses déjà notées sont gardées. Ces changements valent pour toutes vos familles.</p><div class="seg" style="overflow-x:auto">'+ORDRE.map(([k])=>'<button class="chip '+(k===fk?'on':'')+'" data-ds-edit="'+k+'">'+esc(M[k].titre.replace(/ sur 3$/,''))+'</button>').join('')+'</div></div>';
  const cch=C.cache;h+='<div class="card"><span class="eyebrow acc">'+esc(f.titre)+'</span><div class="list">';
  champsDe(fk).forEach(x=>{const off=cch.includes(x.k);h+='<label class="li" style="gap:10px"><input type="checkbox" data-ds-garde="'+fk+'|'+x.k+'" '+(off?'':'checked')+'><div class="tx"><span class="small" style="'+(off?'text-decoration:line-through;opacity:.6':'')+'">'+esc(x.l)+'</span>'+(x.suj?'<span class="xs muted">Sujet abordé</span>':'')+'</div></label>'});
  C.ajoutSuj.forEach(x=>{const off=cch.includes('j_'+x.id);h+='<label class="li" style="gap:10px"><input type="checkbox" data-ds-garde="'+fk+'|j_'+x.id+'" '+(off?'':'checked')+'><div class="tx"><span class="small">'+esc(x.l)+'</span><span class="xs muted">Mon sujet</span></div></label>'});
  C.ajout.forEach(x=>{const off=cch.includes('q_'+x.id);h+='<label class="li" style="gap:10px"><input type="checkbox" data-ds-garde="'+fk+'|q_'+x.id+'" '+(off?'':'checked')+'><div class="tx"><span class="small">'+esc(x.l)+'</span><span class="xs muted">Ma question</span></div></label>'});
  h+='</div></div><div class="card"><span class="eyebrow acc">Ajouter</span><label class="f">Ma question<input type="text" id="dsNQ" maxlength="120" placeholder="Ex. : Allergies de la fratrie"></label><button class="btn sm" data-ds-ajout="'+fk+'|q">'+icon('fa-plus')+'Ajouter la question</button>'+
   (f.blocks.some(b=>b.suj)?'<label class="f" style="margin-top:8px">Mon sujet<input type="text" id="dsNS" maxlength="120" placeholder="Ex. : Portage physiologique"></label><button class="btn sm" data-ds-ajout="'+fk+'|s">'+icon('fa-plus')+'Ajouter le sujet</button>':'')+'</div>';
  return h}
function cDossier(c,i,P){const e=etat();if(S.dsEdit)return editeur(S.dsEdit);
  if(!e.ok)return carteEntree(c,i,P);
  if(S.dsForm&&M[S.dsForm])return formulaire(c,i,P,S.dsForm);return liste(c,i,P)}
const _cr=cResume;cResume=function(c,i,P){if(S.ctab==='dossier')return cDossier(c,i,P);return _cr.apply(this,arguments)};
/* icône de l'onglet */
const _r=render;render=function(){const x=_r.apply(this,arguments);try{const b=document.querySelector('.ctabs button[data-v="dossier"]');if(b&&!b.dataset.ds){b.dataset.ds='1';const ic=b.querySelector('i,svg');if(ic)ic.outerHTML=icon('fa-notes-medical')}}catch(e){}return x};
/* ---------- impression ---------- */
const E=t=>esc(t==null?'':String(t)).replace(/\n/g,'<br>');
const cb=on=>'<span class="cb">'+(on?'✓':'')+'</span>';
function ligneVal(t){return '<div class="vv">'+(t?E(t):'&nbsp;')+'</div>'}
function formeHtml(c,fk,vierge,entete){const f=M[fk],cch=cf(fk).cache,D=(c.dsuivi||{})[fk]||{},V=k=>vierge?undefined:D[k];let si=-1,h='';
  h+=entete(f.cat,f.titre,f.sous);let corps='';
  const sec=t=>'<h3>'+E(t)+'</h3>';
  f.blocks.forEach((b,bi)=>{
   if(b.s!==undefined){si++;corps+=sec(b.s);return}
   if(b.rows){corps+='<table class="ch">'+b.rows.filter(r=>!cch.includes('r'+si+'_'+slug(r.l))).map(r=>{const k='r'+si+'_'+slug(r.l),v=V(k);let cell='';
     if(r.o&&r.o.length)cell=r.o.map(o=>'<span class="o">'+cb(v===o)+(v===o&&aTrait(o)?E(sansTrait(o))+' '+E(V(k+'_t')||''):aTrait(o)?E(o):E(o))+'</span>').join(' &nbsp; ');else cell=v?E(v):'';
     return '<tr><td class="lb">'+E(r.l)+'</td><td class="v">'+cell+'</td></tr>'}).join('')+'</table>'}
   else if(b.chk){const k='c'+si+'_'+bi,o=V(k)||{};corps+=(b.lab?'<p class="lbl">'+E(b.lab)+'</p>':'')+'<p class="cs">'+b.chk.map(x=>'<span class="o">'+cb(!!o[sansTrait(x)])+E(x)+'</span>').join(' &nbsp; ')+'</p>'}
   else if(b.grid){const k='g'+si+'_'+bi,extra=vierge?0:+(D[k+'_n']||0);corps+='<table class="gr"><tr>'+b.grid.map(x=>'<th>'+E(x)+'</th>').join('')+'</tr>'+Array.from({length:b.n+extra},(_,r)=>'<tr>'+b.grid.map((_x,ci)=>'<td>'+E(V(k+'_'+r+'_'+ci)||'')+'</td>').join('')+'</tr>').join('')+'</table>'}
   else if(b.suj){const C=cf(fk),sj=V('sj')||{},jn=V('jn')||{};const all=b.suj.map(x=>({l:x,k:'j_'+slug(x)})).concat(C.ajoutSuj.map(x=>({l:x.l,k:'j_'+x.id}))).filter(x=>!cch.includes(x.k));
     corps+='<table class="gr"><tr><th style="width:22pt"></th><th style="width:45%">Sujet</th><th>Notes</th></tr>'+all.map(x=>'<tr><td class="c">'+cb(!!sj[x.l])+'</td><td>'+E(x.l)+'</td><td>'+E(jn[x.k]||'')+'</td></tr>').join('')+'</table>'}
   else if(b.zone){const t=V('z'+si+'_'+bi);corps+='<div class="zone" style="min-height:'+(b.zone*19)+'pt">'+(t?'<div class="zt">'+E(t)+'</div>':'')+'</div>'}
   else if(b.sigP){corps+='<div class="sig"><div><div class="sl"></div>Signature des parents</div><div><div class="sl"></div>Date</div></div>'}
   else if(b.sig){corps+='<div class="sig"><div><div class="sl"></div>Signature de la doula</div><div><div class="sl"></div>Date</div></div>'}});
  const C=cf(fk);const qs=C.ajout.filter(x=>!cch.includes('q_'+x.id));if(qs.length)corps+='<h3>Mes questions</h3><table class="ch">'+qs.map(x=>'<tr><td class="lb">'+E(x.l)+'</td><td class="v">'+E(V('q_'+x.id)||'')+'</td></tr>').join('')+'</table>';
  return {titre:f.titre,cat:f.cat,sous:f.sous,corps}}
const CSS='@page{size:letter;margin:0}*{box-sizing:border-box}body{margin:0;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;color:#3d312b;font-size:9.5pt;-webkit-print-color-adjust:exact;print-color-adjust:exact}'+
 'table.pg{width:100%;border-collapse:collapse;break-before:page}table.pg:first-child{break-before:auto}table.pg>thead td,table.pg>tfoot td,table.pg>tbody>tr>td{padding:0 54pt}'+
 '.band{height:7pt;margin:0 -54pt;background:linear-gradient(90deg,var(--a1),var(--a2) 50%,var(--a3))}.hd{display:flex;align-items:center;gap:12pt;padding-top:16pt;height:52pt}.hd img{height:30pt;max-width:140pt;object-fit:contain}.br{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-size:16pt;color:var(--a2)}'+
 '.cat{margin-left:auto;font-size:6.5pt;letter-spacing:1.4pt;color:#8a7a70}.fil{border-top:.6pt solid #e6d2c6;margin-bottom:22pt}.ft{border-top:.5pt solid #e6d2c6;margin-top:18pt;padding:7pt 0 24pt;font-size:7pt;color:#8a7a70;display:flex}.conf{margin-left:auto;letter-spacing:1pt;text-transform:uppercase}'+
 'h1{font-family:Georgia,"Times New Roman",serif;font-weight:normal;font-size:22pt;color:#2c221e;margin:0 0 4pt}.sous{margin:0 0 10pt;color:#8a7a70;font-size:9pt}'+
 'table.fam{width:100%;border-collapse:collapse;margin:0 0 6pt;background:#faf3ee}table.fam td{border:.6pt solid #e6d2c6;padding:4pt 6pt 5pt;font-size:7pt;color:#8a7a70;width:25%;text-transform:uppercase;letter-spacing:.8pt;vertical-align:top}table.fam td b{display:block;font-size:9pt;color:#3d312b;text-transform:none;letter-spacing:0;font-weight:normal;min-height:14pt}'+
 'h3{font-size:8pt;font-weight:bold;letter-spacing:1.3pt;text-transform:uppercase;color:var(--a2);margin:10pt 0 2pt;padding-bottom:3pt;border-bottom:.5pt solid #e6d2c6;break-after:avoid}'+
 'table.ch{width:100%;border-collapse:collapse}table.ch tr{break-inside:avoid}table.ch td{padding:4.5pt 0 1.5pt;vertical-align:bottom}table.ch td.lb{width:40%;color:#8a7a70;font-size:9pt;padding-right:8pt}table.ch td.v{border-bottom:.6pt solid var(--a1);font-size:9.5pt;min-height:14pt}'+
 '.cb{display:inline-block;width:8pt;height:8pt;border:.8pt solid var(--a2);margin-right:4pt;vertical-align:-1pt;font-size:7pt;line-height:7pt;text-align:center;color:var(--a2)}.lbl{color:#8a7a70;margin:10pt 0 2pt}.cs{line-height:2;margin:0}.o{white-space:nowrap}'+
 'table.gr{width:100%;border-collapse:collapse;margin-top:6pt}table.gr th{font-size:7pt;letter-spacing:.8pt;text-transform:uppercase;color:#8a7a70;text-align:left;font-weight:normal;padding:3pt 4pt;border-bottom:.8pt solid var(--a1)}table.gr td{border-bottom:.6pt solid var(--a1);padding:6pt 4pt;height:18pt;vertical-align:top}table.gr td.c{text-align:center}table.gr tr{break-inside:avoid}'+
 '.zone{background:repeating-linear-gradient(transparent 0 18.4pt,var(--a1) 18.4pt 19pt);min-height:38pt}.zt{line-height:19pt;padding:0 2pt}'+
 '.sig{display:flex;gap:30pt;margin-top:10pt;break-inside:avoid;font-size:8pt;color:#8a7a70}.sig>div:first-child{flex:2}.sig>div:last-child{flex:1}.sl{border-bottom:.8pt solid #3d312b;height:18pt;margin-bottom:3pt}';
function imprimer(c,fk,vierge){const lg=logoOk(),nm=nomPro(),D=S.doula||{};
  const pied='<div class="ft">'+E([nm,D.nom&&D.nom!==nm?D.nom:'',D.tel,D.courriel].filter(Boolean).join(' · '))+'<span class="conf">Confidentiel</span></div>';
  const fam='<table class="fam"><tr><td>Famille<b>'+E(c.nom||'')+'</b></td><td>No de dossier<b>'+E(c.no||'')+'</b></td><td>Date prévue<b>'+E(c.dpa||'')+'</b></td><td>Doula<b>'+E(D.nom||'')+'</b></td></tr></table>';
  const entete=(cat,titre,sous)=>({cat,titre,sous});
  const page=(cat,titre,sous,corps)=>'<table class="pg"><thead><tr><td><div class="band"></div><div class="hd">'+(lg?'<img src="'+lg+'" alt="">':'')+'<span class="br">'+E(nm)+'</span><span class="cat">'+E(cat)+'</span></div><div class="fil"></div></td></tr></thead><tfoot><tr><td>'+pied+'</td></tr></tfoot><tbody><tr><td><h1>'+E(titre)+'</h1><p class="sous">'+E(sous)+'</p>'+fam+corps+'</td></tr></tbody></table>';
  const r=formeHtml(c,fk,vierge,entete);let doc=page(r.cat,r.titre,r.sous,r.corps);
  if(AVEC_NOTES(fk)){const t=vierge?'':((c.dsuivi||{})[fk]||{}).notes_perso||'';
    const nt=(n,txt)=>page(r.cat,'Notes — '+r.titre,'Espace libre : impressions, détails à retenir, ce que je veux revoir à la prochaine rencontre.','<h3>Notes personnelles (pour moi seulement)</h3><div class="zone" style="min-height:'+(n*19)+'pt">'+(txt?'<div class="zt">'+E(txt)+'</div>':'')+'</div>');
    doc+=nt(25,t)+nt(25,'')}
  let a2='#b5644d';try{const q=lireCoul();a2=q.perso||PALETTES[q.pal].accent||a2}catch(x){}
  const html='<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>'+E(r.titre)+'</title><style>:root{--a1:#e9b8a6;--a2:'+a2+';--a3:#8fa58a}'+CSS+'</style></head><body>'+doc+'<script>onload=function(){setTimeout(function(){print()},500)}<\/script></body></html>';
  const w=window.open('','_blank');if(w){w.document.open();w.document.write(html);w.document.close()}else{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download=slug(r.titre)+'.html';a.click()}}
/* ---------- actions ---------- */
const cli=()=>(S.clients||[]).find(x=>x.id===S.openClient);
document.addEventListener('click',async e=>{const T=e.target;let b;
  if(b=T.closest('[data-ds-ouvrir]')){e.stopPropagation();S.dsForm=b.dataset.dsOuvrir;S.dsEdit=null;render();scrollTo(0,0);return}
  if(b=T.closest('[data-act="dsBack"]')){e.stopPropagation();S.dsForm=null;render();scrollTo(0,0);return}
  if(b=T.closest('[data-act="dsEditBack"]')){e.stopPropagation();S.dsEdit=null;render();scrollTo(0,0);return}
  if(b=T.closest('[data-ds-edit]')){e.stopPropagation();S.dsEdit=b.dataset.dsEdit;render();scrollTo(0,0);return}
  if(b=T.closest('[data-ds-marque]')){e.stopPropagation();S.openClient=null;S.dtab='outils';S.dsub='marque';render();scrollTo(0,0);return}
  if(b=T.closest('[data-ds-relu]')){e.stopPropagation();if(b.disabled)return;if(await sauverCfg(d=>{d.relu=new Date().toISOString().slice(0,10)})){toast('Dossier prêt : il porte votre nom et votre logo');render()}return}
  if(b=T.closest('[data-ds-garde]')){e.stopPropagation();const [fk,k]=b.dataset.dsGarde.split('|'),garde=b.checked;
    if(await sauverCfg(d=>{const f=F(d,fk);f.cache=f.cache.filter(x=>x!==k);if(!garde)f.cache.push(k)}))render();else b.checked=!garde;return}
  if(b=T.closest('[data-ds-ajout]')){e.stopPropagation();const [fk,t]=b.dataset.dsAjout.split('|'),inp=document.getElementById(t==='q'?'dsNQ':'dsNS'),l=(inp&&inp.value||'').trim();
    if(!l){toast('Écrivez d\'abord la question');return}
    if(await sauverCfg(d=>{const f=F(d,fk),o={id:Date.now().toString(36),l};(t==='q'?f.ajout:f.ajoutSuj).push(o)})){toast('Ajouté');render()}return}
  if(b=T.closest('[data-ds-valide]')){e.stopPropagation();const c=cli();if(!c)return;c.dsuivi=c.dsuivi||{};const fk=b.dataset.dsValide;c.dsuivi[fk]=c.dsuivi[fk]||{};
    c.dsuivi[fk].valide=c.dsuivi[fk].valide?'':new Date().toISOString().slice(0,10);await saveClient(c.id);render();return}
  if(b=T.closest('[data-ds-ligne]')){e.stopPropagation();const c=cli();if(!c)return;const [fk,k]=b.dataset.dsLigne.split('|');c.dsuivi=c.dsuivi||{};c.dsuivi[fk]=c.dsuivi[fk]||{};c.dsuivi[fk][k]=(+c.dsuivi[fk][k]||0)+1;await saveClient(c.id);render();return}
  if(b=T.closest('[data-ds-print]')){e.stopPropagation();const c=cli();if(!c)return;if(!etat().ok){toast('Ajoutez d\'abord votre logo et votre nom');return}try{await saveClient(c.id)}catch(x){}imprimer(c,b.dataset.dsPrint,!!b.dataset.vierge);return}},true);
/* le retour du formulaire repart au dossier de suivi quand on change de famille ou d'onglet */
const _go=render;render=function(){if(S.ctab!=='dossier'){S.dsForm=null;S.dsEdit=null}return _go.apply(this,arguments)};
})();
