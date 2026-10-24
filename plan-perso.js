/* Sérénaissance — plan de naissance (famille) : souhaits ajoutés par la maman + PDF aux couleurs et au logo de la doula. */
(function(){
if(window.ESPACE!=='parent')return;
const AUTRE='Mes autres souhaits';
const cats=()=>PLAN.flatMap(x=>x.groups).map(g=>g[0]).concat([AUTRE]);
const perso=()=>S.parent.planPerso||(S.parent.planPerso=[]);
function carte(){const L=perso();
  return '<div class="card"><span class="eyebrow acc">Ajouter mes propres souhaits</span><p class="xs muted" style="margin:2px 0 8px">Un souhait qui n\'est pas dans la liste ? Écrivez-le ici : il sera ajouté à votre plan et à votre PDF.</p>'+
   '<label class="f">Dans quelle section<select id="ppCat">'+cats().map(c=>'<option>'+esc(c)+'</option>').join('')+'</select></label><label class="f">Mon souhait<input type="text" id="ppTxt" maxlength="160" placeholder="Ex. Ma playlist de naissance, prier avant la poussée…"></label><button class="btn" data-act="ppAdd">'+icon('fa-plus')+'Ajouter à mon plan</button>'+
   (L.length?'<div class="list" style="margin-top:10px">'+L.map(x=>'<div class="li"><div class="ic">'+icon('fa-check')+'</div><div class="tx"><b>'+esc(x.t)+'</b><span>'+esc(x.g)+'</span></div><button class="icon-btn" data-act="ppDel" data-id="'+x.id+'" aria-label="Retirer">'+icon('fa-trash')+'</button></div>').join('')+'</div>':'')+'</div>'}
function groupes(){const p=S.parent,pl=p.plan||{};const G=PLAN.flatMap(x=>x.groups).map(g=>[g[0],g[1].filter(x=>pl[x])]);G.push([AUTRE,[]]);
  perso().forEach(x=>{let g=G.find(y=>y[0]===x.g);if(!g){g=[x.g,[]];G.push(g)}g[1].push(x.t)});return G.filter(g=>g[1].length)}
function texte(){const p=S.parent,F=p.planF||{},g=preg(p),D=infoDoula();
  const soins=(PLAN[1].soins||[]).map((s,j)=>[s,(p.soins||{})['s'+j]]).filter(x=>x[1]);
  let t='Nom : '+(p.prenom||'')+(p.partenaire?' · Partenaire : '+p.partenaire:'')+'\nDate prévue : '+(g?fmtD(g.dpa):'—')+' · Doula : '+(doulaNomP()||'')+'\nLieu : '+(p.lieu||'—')+' · Professionnel : '+(p.prof||'—')+' · Allergies : '+(p.allergies||'aucune')+'\n';
  groupes().forEach(x=>{t+='\n## '+x[0]+'\n'+x[1].map(i=>'•  '+i).join('\n')+'\n'});
  if(soins.length)t+='\n## Soins de bébé\n'+soins.map(s=>'•  '+s[0]+' : '+s[1]).join('\n')+'\n';
  if(F.codeword)t+='\n## Mot de code\n'+F.codeword+'\n';
  if(F.presents)t+='\n## Personnes présentes\n'+F.presents+'\n';
  if(F.important)t+='\n## Ce qui est important pour moi\n'+F.important+'\n';
  if(F.autres2)t+='\n## Autres souhaits\n'+F.autres2+'\n';
  t+='\nMerci de prendre le temps de lire mes souhaits et de m\'informer avant chaque décision.\n';return t}
function planDoc(){const c=texte();let h=0;for(let i=0;i<c.length;i++)h=(h*31+c.charCodeAt(i))|0;return {id:'plan'+h,titre:'Mon plan de naissance',type:'plan',statut:'',contenu:c,champs:[],reponses:{}}}
function prep(){try{if(typeof preparerPDF==='function')preparerPDF(planDoc())}catch(e){}}
const btn='<button class="btn" data-act="planPdf">'+'PDF_ICON'+'Enregistrer ou imprimer en PDF</button>';
const _pl=PSUB.plan;PSUB.plan=function(){let h=_pl.apply(this,arguments);try{
  if((S.planV||'edit')==='coup'){
    const a=h.indexOf('</div><div class="row"><button class="btn" data-act="copyTxt"');
    if(a>=0){const ex=perso();const extra=groupes().filter(g=>ex.some(x=>x.g===g[0])&&g[0]===AUTRE).map(g=>'<div class="soft"><b class="grp-t" style="margin:0">'+esc(g[0])+'</b><ul class="clean small">'+g[1].map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul></div>').join('');
      h=h.slice(0,a)+extra+h.slice(a);
      h=h.replace('Copier le texte</button></div>','Copier le texte</button>'+btn.replace('PDF_ICON',icon('fa-file-pdf'))+'</div>')}
    prep()}
  else{const i=h.lastIndexOf('<div class="banner acc">');h=i<0?h+carte():h.slice(0,i)+carte()+btn.replace('PDF_ICON',icon('fa-file-pdf')).replace('class="btn"','class="btn ghost" style="margin-bottom:12px"')+h.slice(i);prep()}
 }catch(e){}return h};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="ppAdd"],[data-act="ppDel"],[data-act="planPdf"]');if(!b)return;e.stopPropagation();e.preventDefault();const a=b.dataset.act;
  if(a==='ppAdd'){const t=($('#ppTxt').value||'').trim(),g=$('#ppCat').value;if(!t){toast('Écrivez votre souhait');return}perso().push({id:uid(),g,t});save();render();toast('Ajouté à votre plan');return}
  if(a==='ppDel'){S.parent.planPerso=perso().filter(x=>x.id!==b.dataset.id);save();render();return}
  if(a==='planPdf'){const d=planDoc();Promise.resolve(preparerPDF(d)).then(()=>partagerPDF(d))}},true);
})();
