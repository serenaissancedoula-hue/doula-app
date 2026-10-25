/* Sérénaissance — « Mes enfants » : la maman inscrit ses autres enfants (prénom, date de naissance, notes de santé).
   Sa doula voit ces informations dans le suivi de la famille. La maman peut aussi ouvrir le registre des doulas près de chez elle. */
(function(){
const fdt=d=>{try{return new Date(d+'T12:00').toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'})}catch(e){return d}};
function age(d){const B=new Date(d+'T12:00'),N=new Date();if(isNaN(B))return '';let m=(N.getFullYear()-B.getFullYear())*12+N.getMonth()-B.getMonth();if(N.getDate()<B.getDate())m--;
  if(m<0)return '';if(m<1){const j=Math.floor((N-B)/864e5);return j+' jour'+(j>1?'s':'')}if(m<24)return m+' mois';const a=Math.floor(m/12),r=m%12;return a+' ans'+(r?' et '+r+' mois':'')}
const nomE=e=>(e.prenom||e.prenomBebe||'').trim()||'Enfant';
function liste(p){return (p.enfants||[]).filter(e=>e&&(e.date||e.prenom||e.prenomBebe))}
/* ---------- côté famille ---------- */
if(window.ESPACE==='parent'){
  const sauver=()=>{try{if(typeof saveParent==='function')saveParent();else save()}catch(e){}};
  function carte(){const L=liste(S.parent);
    return '<div class="card en-set"><div class="row between"><span class="eyebrow acc">Mes enfants</span><button class="btn sm" data-en-add="1">'+icon('fa-plus')+'Ajouter</button></div><p class="small muted" style="margin:4px 0 8px">Vos autres enfants. Si vous êtes accompagnée par une doula, elle voit ces informations pour mieux vous accompagner.</p>'+
      (L.length?'<div class="list">'+L.map((e,i)=>'<div class="li"><div class="ic">'+(e.sexe==='Fille'?'👧':e.sexe==='Garçon'?'👦':'🧒')+'</div><div class="tx"><b>'+esc(nomE(e))+(e.date?' · '+age(e.date):'')+'</b><span>'+(e.date?'Né'+(e.sexe==='Fille'?'e':'')+' le '+fdt(e.date):'')+(e.notes?' · '+esc(e.notes):'')+'</span></div><button class="icon-btn" data-en-edit="'+i+'" aria-label="Modifier">'+icon('fa-pen')+'</button></div>').join('')+'</div>':'<p class="small muted">Aucun enfant inscrit pour l\'instant.</p>')+'</div>'+
      '<div class="card"><span class="eyebrow acc">Registre des doulas</span><p class="small muted" style="margin:4px 0 8px">Trouvez les doulas près de chez vous et écrivez-leur directement depuis votre compte.</p><button class="btn ghost" data-en-reg="1">'+icon('fa-magnifying-glass')+'Voir les doulas près de moi</button></div>'}
  function fiche(i){const L=S.parent.enfants||[],e=i!=null?L[i]||{}:{};
    sheet(i!=null?'Modifier · '+esc(nomE(e)):'Ajouter un enfant','<label class="f">Prénom<input id="en_p" value="'+esc(e.prenom||e.prenomBebe||'')+'"></label><label class="f">Date de naissance<input type="date" id="en_d" max="'+iso(new Date())+'" value="'+esc(e.date||'')+'"></label>'+
      '<label class="f">Sexe<select id="en_s"><option value="">—</option>'+['Fille','Garçon'].map(x=>'<option'+(e.sexe===x?' selected':'')+'>'+x+'</option>').join('')+'</select></label>'+
      '<label class="f">Notes pour la doula (allergies, santé, naissance, particularités)<textarea id="en_n" style="min-height:70px">'+esc(e.notes||'')+'</textarea></label>'+
      '<button class="btn" data-en-save="'+(i!=null?i:'')+'">Enregistrer</button>'+(i!=null?'<button class="btn ghost" data-en-del="'+i+'" style="margin-top:8px">Retirer</button>':''))}
  /* développement des enfants de moins de 5 ans : on choisit l'enfant en haut de Suivi */
  const moisDe=d=>{const B=new Date(d+'T12:00'),N=new Date();let m=(N.getFullYear()-B.getFullYear())*12+N.getMonth()-B.getMonth();if(N.getDate()<B.getDate())m--;return m};
  const petits=()=>liste(S.parent).map((e,i)=>({e,i})).filter(x=>x.e.date&&moisDe(x.e.date)>=0&&moisDe(x.e.date)<60);
  if(typeof pSuivi==='function'){const _ps=pSuivi;pSuivi=function(){if(S.sub!=='devE')return _ps.apply(this,arguments);const x=petits().find(y=>y.i===S.devEnfant);if(!x){S.sub='';return _ps.apply(this,arguments)}
    const B=new Date(x.e.date+'T00:00');B.setHours(0,0,0,0);const day=Math.floor((Date.now()-B)/864e5),st0=stage,n0=S.parent.naissance;let h='';
    try{stage=()=>({k:'pp',day,birth:B});S.parent.naissance=Object.assign({},n0||{},{date:x.e.date,prenomBebe:nomE(x.e),sexe:x.e.sexe||'',nb:1});S.sub='';h=_ps.apply(this,arguments)}finally{stage=st0;S.parent.naissance=n0;S.sub='devE'}
    const t=document.createElement('template');t.innerHTML=h;[...t.content.children].forEach(c=>{const e=((c.querySelector('.eyebrow')||{}).textContent||'');if(/vaccins de bébé/i.test(e)||c.classList.contains('dm-tuile'))c.remove()});
    return [...t.content.childNodes].map(n=>n.outerHTML||n.textContent||'').join('')}}
  const _rS=render;render=function(){const x=_rS.apply(this,arguments);try{if(S.role!=='parent'||S.vue||S.tab!=='suivi'||(S.sub&&S.sub!=='devE'))return x;const P=petits();if(!P.length)return x;
      let bb='';try{if(window.pfSuivis&&window.pfSuivis().includes('bebe'))bb=((S.parent.naissance||{}).prenomBebe||'Bébé')}catch(e){}
      const sel=S.sub==='devE'?S.devEnfant:-1,app=document.getElementById('app'),t=document.createElement('template');
      t.innerHTML='<div class="en-dev"><span class="eyebrow acc">Suivre le développement de</span><div class="en-chips">'+(bb||!P.length?'<button class="chip'+(sel===-1?' on':'')+'" data-en-dev="-1">'+esc(bb||'Mon suivi')+'</button>':'<button class="chip'+(sel===-1?' on':'')+'" data-en-dev="-1">Mon suivi</button>')+P.map(y=>'<button class="chip'+(sel===y.i?' on':'')+'" data-en-dev="'+y.i+'">'+esc(nomE(y.e))+' · '+age(y.e.date)+'</button>').join('')+'</div></div>';
      const sw=app.querySelector(':scope>.pf-sw');if(sw)sw.after(t.content);else app.prepend(t.content)}catch(e){}return x};
  if(typeof pParametres==='function'){const _pp=pParametres;pParametres=function(){const h=_pp.apply(this,arguments);if(S.role!=='parent')return h;return h+carte()}}
  /* une tuile « Doulas près de moi » dans Ma doula */
  const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(S.role==='parent'&&S.tab==='madoula'&&!S.vue){const g=document.querySelector('#app .md-grille');if(g&&!g.querySelector('[data-en-reg]')){const t=document.createElement('template');
      t.innerHTML='<button class="md-carre" data-en-reg="1"><span class="md-ic" data-dk="1" data-dt="1" style="background:#e3ecd9">'+icon('fa-location-dot')+'</span><b>Doulas près de moi</b><small>Le registre des doulas de votre région</small></button>';g.append(t.content)}}}catch(e){}return x};
  document.addEventListener('click',e=>{let b;
    if(e.target.closest('[data-en-reg]')){e.stopPropagation();e.preventDefault();S.vueCx='annuaire';S.retourEspace=true;try{ecranChercheuse(false)}catch(x){toast('Registre indisponible')}return}
    if(b=e.target.closest('[data-en-dev]')){e.stopPropagation();const v=+b.dataset.enDev;S.devSel=null;if(v<0){S.sub='';S.devEnfant=null}else{S.sub='devE';S.devEnfant=v}scrollTo(0,0);render();return}
    if(e.target.closest('[data-en-add]')){e.stopPropagation();fiche(null);return}
    if(b=e.target.closest('[data-en-edit]')){e.stopPropagation();fiche(+b.dataset.enEdit);return}
    if(b=e.target.closest('[data-en-save]')){e.stopPropagation();const p=$('#en_p').value.trim();if(!p){toast('Entrez le prénom');return}
      const o={prenom:p,date:$('#en_d').value||'',sexe:$('#en_s').value||'',notes:$('#en_n').value.trim()},L=S.parent.enfants=S.parent.enfants||[];
      if(b.dataset.enSave!=='')L[+b.dataset.enSave]=Object.assign({},L[+b.dataset.enSave],o);else L.push(o);sauver();close();render();toast('Enregistré');return}
    if(b=e.target.closest('[data-en-del]')){e.stopPropagation();if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Touchez encore pour retirer';return}(S.parent.enfants||[]).splice(+b.dataset.enDel,1);sauver();close();render();return}},true);
}
/* ---------- côté doula : la famille et ses enfants dans le suivi ---------- */
if(window.ESPACE!=='parent'&&typeof cSuivi==='function'){const _cs=cSuivi;cSuivi=function(c){const h=_cs.apply(this,arguments);try{const p=(c&&c.parent_data)||{},L=liste(p),n=p.naissance||{};
    const suivis=[];if(p.suiviCycle||p.parcours==='conception')suivis.push('🌱 suit son cycle (essais bébé)');if(+p.nbBebesGrossesse>1)suivis.push('🤰 grossesse de '+(+p.nbBebesGrossesse===2?'jumeaux':'triplés'));if(+n.nb>1)suivis.push('👶 '+(+n.nb===2?'jumeaux':'triplés')+' nés le '+fdt(n.date));
    if(!L.length&&!suivis.length)return h;
    return h+'<div class="card"><span class="eyebrow acc">La famille</span>'+(suivis.length?'<p class="small" style="margin:4px 0 8px">'+suivis.join(' · ')+'</p>':'')+
      (L.length?'<div class="list">'+L.map(e=>'<div class="li"><div class="ic">'+(e.sexe==='Fille'?'👧':e.sexe==='Garçon'?'👦':'🧒')+'</div><div class="tx"><b>'+esc(nomE(e))+(e.date?' · '+age(e.date):'')+'</b><span>'+(e.date?'Né'+(e.sexe==='Fille'?'e':'')+' le '+fdt(e.date):'')+(e.notes?' · '+esc(e.notes):'')+'</span></div></div>').join('')+'</div>':'')+
      '<p class="xs muted">Informations inscrites par la famille dans son espace.</p></div>'}catch(e){return h}}}
(function(){const st=document.createElement('style');st.textContent='.en-set .li .tx span{white-space:normal}.en-dev{margin:0 0 14px}.en-chips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:6px 0 2px}.en-chips::-webkit-scrollbar{display:none}.en-chips .chip{flex:none}';document.head.appendChild(st)})();
})();
