/* Sérénaissance — pendant la grossesse : « Mon poids de grossesse » (poids d'avant, IMC, prise de poids recommandée et courbe)
   et « Ma grossesse : particularités et antécédents » (grossesses précédentes, césariennes, conditions, autre chose d'important).
   La doula voit ces informations dans le suivi de la famille.
   Repères de prise de poids : Santé Canada (Lignes directrices canadiennes sur la nutrition prénatale, reprenant l'Institute of Medicine 2009),
   MyHealth Alberta (grossesse simple et jumeaux). Activité : Lignes directrices canadiennes 2019 sur l'activité physique pendant la grossesse. */
(function(){
const CAT=[[0,18.5,'Poids insuffisant',12.5,18,.44,.58,null],[18.5,25,'Poids santé',11.5,16,.35,.5,[17,25]],[25,30,'Embonpoint',7,11.5,.23,.33,[14,23]],[30,99,'Obésité',5,9,.17,.27,[11,19]]];
const cm=x=>String(x).replace('.',',');
const f1=x=>cm((Math.round(x*10)/10).toFixed(1));
const COND=[['diabete','Diabète de grossesse'],['tension','Hypertension ou prééclampsie'],['placenta','Placenta bas ou praevia'],['siege','Bébé en siège'],['pma','Grossesse par PMA ou FIV'],['rh','Rhésus négatif'],['anemie','Anémie'],['hyper','Nausées et vomissements sévères'],['thyroide','Problème de thyroïde'],['avac','Projet d\'accouchement vaginal après césarienne'],['retard','Croissance de bébé à surveiller'],['col','Col court ou risque de prématurité'],['sante','Condition de santé connue (asthme, épilepsie, autre)'],['deuil','Deuil périnatal vécu avant'],['peur','Peur de l\'accouchement']];
function infos(p){p=p||S.parent;return p.grossesseInfos||{}}
function imc(p){const kg=+p.poidsAvant,t=+p.taille;if(!(kg>30&&t>120))return null;return kg/Math.pow(t/100,2)}
function cat(b){return CAT.find(c=>b>=c[0]&&b<c[1])||CAT[1]}
function nbB(p){return Math.max(1,Math.min(3,+p.nbBebesGrossesse||1))}
const fdt=d=>{try{return new Date(d).toLocaleDateString('fr-CA',{day:'numeric',month:'short'})}catch(e){return ''}};
/* ---------- côté famille ---------- */
if(window.ESPACE==='parent'){
  const sauver=()=>{try{if(typeof saveParent==='function')saveParent();else save()}catch(e){}};
  const enceinte=()=>{try{return stage().k==='preg'}catch(e){return false}};
  function debut(){try{const g=stage().g;return +addD(g.dpa,-280)}catch(e){return 0}}
  function pesees(){const t0=debut();return (S.logs||[]).filter(l=>l.type==='maman'&&l.kg&&l.t>=t0-3*864e5).sort((a,b)=>a.t-b.t)}
  function semaine(t){try{const g=stage().g;return (280-diffD(g.dpa,new Date(t)))/7}catch(e){return 0}}
  /* fourchette attendue à une semaine donnée (grossesse simple) : 0,5 à 2 kg au 1er trimestre, puis le rythme hebdomadaire selon l'IMC */
  function attendu(c,w){if(w<=13)return [.5*w/13,2*w/13];return [Math.min(c[4],.5+(w-13)*c[5]),Math.min(c[4],2+(w-13)*c[6])]}
  function courbe(c,P,av,jum){const W=320,H=170,X=w=>18+w/40*(W-44),mx=Math.max(jum?jum[1]:c[4],...P.map(l=>l.kg-av))+1,mn=Math.min(-1,...P.map(l=>l.kg-av)),Y=v=>H-18-(v-mn)/(mx-mn)*(H-30);
    let s='<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto" role="img" aria-label="Ma prise de poids pendant la grossesse comparée aux repères">';
    if(!jum){let haut='',bas='';for(let w=0;w<=40;w++){const a=attendu(c,w);haut+=(w?' L':'M')+X(w).toFixed(1)+' '+Y(a[1]).toFixed(1);bas=' L'+X(w).toFixed(1)+' '+Y(a[0]).toFixed(1)+bas}
      s+='<path d="'+haut+bas+' Z" fill="var(--sage,#8fb59a)" opacity=".25"/>'}
    else s+='<rect x="'+X(38)+'" width="'+(X(40)-X(38))+'" y="'+Y(jum[1])+'" height="'+(Y(jum[0])-Y(jum[1]))+'" fill="var(--sage,#8fb59a)" opacity=".3"/>';
    [0,13,27,40].forEach(w=>{s+='<line x1="'+X(w)+'" x2="'+X(w)+'" y1="8" y2="'+(H-18)+'" stroke="var(--line,#e6d9d0)" stroke-dasharray="3 3"/><text x="'+X(w)+'" y="'+(H-4)+'" text-anchor="middle" font-size="10" fill="var(--muted)">'+w+' sem.</text>'});
    s+='<line x1="'+X(0)+'" x2="'+X(40)+'" y1="'+Y(0)+'" y2="'+Y(0)+'" stroke="var(--line,#e6d9d0)"/>';
    const pts=P.map(l=>[X(Math.max(0,Math.min(40,semaine(l.t)))),Y(l.kg-av)]);
    if(pts.length>1)s+='<polyline fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" points="'+pts.map(p=>p.map(x=>x.toFixed(1)).join(',')).join(' ')+'"/>';
    s+=pts.map(p=>'<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="3.8" fill="var(--accent)"/>').join('');
    return s+'</svg>'}
  function cartePoids(){const p=S.parent,b=imc(p),P=pesees(),der=P[P.length-1],n=nbB(p),g=(stage().g||{}),w=g.w||0;
    let h='<div class="card gm-poids"><div class="row between"><span class="eyebrow acc">Mon poids de grossesse</span><button class="btn sm" data-gm-pese="1">'+icon('fa-plus')+'Me peser</button></div>';
    if(!b){return h+'<p class="small" style="margin:6px 0 10px">Indiquez votre poids d\'avant la grossesse et votre taille : l\'appli calcule votre IMC, la prise de poids recommandée pour vous et trace votre courbe semaine après semaine.</p><button class="btn ghost" data-gm-base="1">'+icon('fa-ruler-vertical')+'Mon poids d\'avant et ma taille</button></div>'}
    const c=cat(b),jum=n>1?c[7]:null,av=+p.poidsAvant,gain=der?der.kg-av:null,rec=n>1?(jum?jum[0]+' à '+jum[1]+' kg':'à voir avec votre professionnel'):cm(c[3])+' à '+cm(c[4])+' kg';
    const st=(l,v)=>'<div class="jb-stat"><b>'+v+'</b><span>'+l+'</span></div>';
    h+='<div class="jb-stats" style="margin-top:8px">'+st('avant la grossesse',f1(av)+' kg')+st(der?'pris depuis le début':'dernière pesée',der?(gain>=0?'+':'')+f1(gain)+' kg':'—')+st('IMC d\'avant',f1(b))+'</div>';
    h+='<p class="small" style="margin:10px 0 4px">IMC d\'avant la grossesse : <b>'+c[2]+'</b>. Prise de poids totale recommandée '+(n>1?'pour une grossesse de '+(n===2?'jumeaux':'triplés'):'')+' : <b>'+rec+'</b>'+(n===1?' (environ '+cm(c[5])+' à '+cm(c[6])+' kg par semaine à partir du 2e trimestre)':'')+'.</p>';
    if(der&&n===1&&w>=4){const a=attendu(c,semaine(der.t));const msg=gain<a[0]-1?'Un peu sous le repère pour '+Math.round(semaine(der.t))+' semaines. Ça arrive (nausées, fatigue) : parlez-en à votre professionnel, il pourra vous orienter vers une nutritionniste au besoin.':gain>a[1]+1?'Un peu au-dessus du repère pour '+Math.round(semaine(der.t))+' semaines. Pas de panique, et surtout pas de régime : votre professionnel ou une nutritionniste peut vous aider à ajuster.':'Dans les repères pour '+Math.round(semaine(der.t))+' semaines 💗';
      h+='<div class="banner '+(/repères pour/.test(msg)&&!/sous|au-dessus/.test(msg)?'sage':'acc')+'" style="margin:8px 0">'+icon('fa-heart')+'<div class="small">'+msg+'</div></div>'}
    h+=courbe(c,P,av,jum);
    h+='<p class="xs muted" style="margin:2px 0 8px">Zone verte : prise de poids recommandée selon votre IMC'+(n>1?' (à terme)':'')+' · points : vos pesées.</p>';
    if(P.length)h+='<details class="gm-det"><summary class="small">Mes pesées ('+P.length+')</summary><div class="list">'+P.slice().reverse().map(l=>'<div class="li"><div class="ic">'+icon('fa-weight-scale')+'</div><div class="tx"><b>'+f1(l.kg)+' kg · '+(l.kg-av>=0?'+':'')+f1(l.kg-av)+' kg</b><span>'+fdt(l.t)+' · '+Math.max(0,Math.floor(semaine(l.t)))+' semaines</span></div><button class="icon-btn" data-act="delLog" data-id="'+l.id+'" aria-label="Supprimer">'+icon('fa-trash')+'</button></div>').join('')+'</div></details>';
    h+='<details class="gm-det"><summary class="small">Bien comprendre sa prise de poids</summary><ul class="clean dv-l small">'+
      '<li><b>Où vont ces kilos ?</b> Bébé (environ 3,5 kg), le placenta, le liquide amniotique, l\'utérus, les seins, le volume de sang et de liquides qui augmente, et des réserves pour l\'allaitement.</li>'+
      '<li><b>Au 1er trimestre</b>, on prend peu : 0,5 à 2 kg. Avec les nausées, il est normal de ne rien prendre au début. C\'est surtout aux 2e et 3e trimestres que le poids monte.</li>'+
      '<li><b>Manger pour deux ?</b> Non : au 1er trimestre, pas besoin de plus. Environ 350 calories de plus par jour au 2e trimestre et 450 au 3e suffisent, par exemple une collation comme un yogourt et un fruit, ou un bol de céréales avec du lait.</li>'+
      '<li><b>Pas de régime pendant la grossesse</b>, même avec un IMC élevé : on vise des repas réguliers et variés, avec un supplément de multivitamines contenant de l\'acide folique (et du fer).</li>'+
      '<li><b>Bouger</b> : au moins 150 minutes d\'activité modérée par semaine (marche, natation, yoga prénatal), si votre grossesse le permet.</li>'+
      '<li>Une <b>prise de poids soudaine</b> (plus d\'un kilo en quelques jours), avec un gonflement du visage ou des mains, des maux de tête ou une vision embrouillée : appelez votre professionnel ou allez à l\'urgence.</li>'+
      '<li>Pesez-vous le matin, au même moment, sans vêtements lourds : une fois par semaine ou toutes les deux semaines suffit.</li></ul>'+
      '<p class="xs muted">Sources : <a href="https://www.canada.ca/fr/sante-canada/services/aliments-nutrition/saine-alimentation/poids-sante/lignes-directrices-pendant-grossesse-professionnels-gain-poids.html" target="_blank" rel="noopener">Santé Canada, gain de poids pendant la grossesse</a> · <a href="https://www.inspq.qc.ca/information-perinatale/fiches/alimentation-et-gain-de-poids/fiche-complete" target="_blank" rel="noopener">INSPQ, alimentation et gain de poids</a> · <a href="https://myhealth.alberta.ca/Alberta/Pages/healthy-weight-gain-during-pregnancy.aspx" target="_blank" rel="noopener">MyHealth Alberta</a> · <a href="https://csepguidelines.ca/guidelines/pregnancy/" target="_blank" rel="noopener">Lignes directrices canadiennes, activité physique et grossesse</a></p></details>';
    h+='<button class="btn sm ghost" data-gm-base="1" style="margin-top:6px">'+icon('fa-pen')+'Poids d\'avant et taille</button>';
    return h+'</div>'}
  function fBase(){const p=S.parent;sheet('Avant la grossesse','<p class="small muted">Votre poids juste avant la grossesse (environ) et votre taille servent à calculer votre IMC et la prise de poids recommandée pour vous.</p><div class="grid2"><label class="f">Poids d\'avant (kg)<input type="number" id="gm_av" inputmode="decimal" step="0.1" value="'+esc(p.poidsAvant||'')+'" placeholder="Ex. : 62"></label><label class="f">Taille (cm)<input type="number" id="gm_t" inputmode="numeric" value="'+esc(p.taille||'')+'" placeholder="Ex. : 165"></label></div><p class="xs muted">En livres : divisez par 2,2. En pieds : 5 pi 5 po = 165 cm.</p><button class="btn" data-gm-base-save="1">Enregistrer</button>')}
  function fPese(){sheet('Me peser','<label class="f">Poids (kg)<input type="number" id="gm_kg" inputmode="decimal" step="0.1" placeholder="Ex. : 66,4"></label>'+W()+'<p class="xs muted">Le matin, au même moment, de préférence. En livres : divisez par 2,2.</p><button class="btn" data-gm-pese-save="1">Enregistrer</button>')}
  /* particularités et antécédents */
  function resume(I){const a=I.ant||{},L=[];const n=(k,s,pl)=>+a[k]?L.push(a[k]+' '+(+a[k]>1?pl:s)):0;
    n('grossesses','grossesse avant','grossesses avant');n('vaginal','accouchement vaginal','accouchements vaginaux');n('cesar','césarienne','césariennes');n('fc','fausse couche','fausses couches');n('prema','bébé prématuré','bébés prématurés');return L}
  function carteInfos(){const I=infos(),C=(I.conds||[]).map(k=>(COND.find(c=>c[0]===k)||[0,k])[1]),A=resume(I),vide=!C.length&&!A.length&&!I.compl&&!I.notes;
    let h='<div class="card gm-inf"><div class="row between"><span class="eyebrow acc">Ma grossesse : particularités</span><button class="btn sm" data-gm-inf="1">'+icon(vide?'fa-plus':'fa-pen')+(vide?'Ajouter':'Modifier')+'</button></div>';
    if(vide)return h+'<p class="small muted" style="margin:6px 0 0">Votre grossesse a des particularités ? Vos grossesses précédentes, une césarienne, une condition de santé, une peur, autre chose d\'important ? Notez-le ici : votre doula le voit pour mieux vous accompagner.</p></div>';
    if(C.length)h+='<div class="gm-chips">'+C.map(x=>'<span class="pill line">'+esc(x)+'</span>').join('')+'</div>';
    if(A.length)h+='<p class="small" style="margin:8px 0 0"><b>Grossesses précédentes :</b> '+A.join(' · ')+'</p>';
    if(I.compl)h+='<p class="small" style="margin:6px 0 0"><b>À savoir des grossesses ou accouchements d\'avant :</b> '+esc(I.compl)+'</p>';
    if(I.notes)h+='<p class="small" style="margin:6px 0 0"><b>Autre chose d\'important :</b> '+esc(I.notes)+'</p>';
    return h+'<p class="xs muted" style="margin-top:8px">Visible par votre doula. Votre médecin ou sage-femme reste la référence pour votre suivi médical.</p></div>'}
  function fInfos(){const I=infos(),a=I.ant||{},num=(k,l)=>'<label class="f">'+l+'<input type="number" min="0" max="20" inputmode="numeric" id="gm_'+k+'" value="'+esc(a[k]||'')+'" placeholder="0"></label>';
    sheet('Ma grossesse','<span class="eyebrow acc">Cette grossesse</span><p class="xs muted" style="margin:2px 0 6px">Cochez ce qui s\'applique (selon ce que votre professionnel vous a dit).</p><div class="stack" style="gap:6px">'+COND.map(([k,l])=>'<label class="check"><input type="checkbox" data-gm-c="'+k+'" '+((I.conds||[]).includes(k)?'checked':'')+'><span>'+l+'</span></label>').join('')+'</div>'+
      '<span class="eyebrow acc" style="display:block;margin-top:14px">Mes grossesses précédentes</span><div class="grid2">'+num('grossesses','Grossesses avant celle-ci')+num('vaginal','Accouchements vaginaux')+num('cesar','Césariennes')+num('fc','Fausse(s) couche(s)')+num('prema','Bébés prématurés')+'</div>'+
      '<label class="f">Ce qui s\'est passé avant et qui compte pour vous (accouchement difficile, hémorragie, allaitement, dépression post-partum…)<textarea id="gm_compl" style="min-height:70px">'+esc(I.compl||'')+'</textarea></label>'+
      '<label class="f">Autre chose d\'important (allergies, médicaments, souhaits, craintes…)<textarea id="gm_notes" style="min-height:70px">'+esc(I.notes||'')+'</textarea></label>'+
      '<button class="btn" data-gm-inf-save="1">Enregistrer</button>')}
  /* Journal de grossesse : la carte de poids en haut */
  if(typeof pJournal==='function'){const _pj=pJournal;pJournal=function(){const h=_pj.apply(this,arguments);try{if(S.role==='parent'&&enceinte()&&!S.sub)return h+cartePoids()}catch(e){}return h}}
  /* Suivi de grossesse : particularités, et un rappel du poids */
  if(typeof pSuivi==='function'){const _ps=pSuivi;pSuivi=function(){const h=_ps.apply(this,arguments);try{if(S.role==='parent'&&enceinte()&&!S.sub)return h+carteInfos()}catch(e){}return h}}
  /* placer la carte de poids juste sous les boutons du journal */
  const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(S.tab==='journal'&&enceinte()){const app=document.getElementById('app'),c=app.querySelector(':scope>.gm-poids'),sh=app.querySelector(':scope>.sh');let ref=sh;while(ref&&ref.nextElementSibling&&!ref.nextElementSibling.classList.contains('card'))ref=ref.nextElementSibling;if(c&&ref&&ref.nextElementSibling!==c)ref.after(c)}
      if(S.tab==='suivi'&&enceinte()&&!S.sub){const app=document.getElementById('app'),c=app.querySelector(':scope>.gm-inf'),cards=[...app.querySelectorAll(':scope>.card')];if(c&&cards[0]&&cards[0]!==c)cards[0].after(c)}}catch(e){}return x};
  /* aussi dans Paramètres, pour la modifier en tout temps pendant la grossesse */
  if(typeof pParametres==='function'){const _pp=pParametres;pParametres=function(){const h=_pp.apply(this,arguments);try{if(S.role==='parent'&&(enceinte()||(window.pfSuivis&&window.pfSuivis().includes('grossesse'))))return h+carteInfos()}catch(e){}return h}}
  document.addEventListener('click',async e=>{let b;
    if(e.target.closest('[data-gm-base]')){e.stopPropagation();fBase();return}
    if(e.target.closest('[data-gm-pese]')){e.stopPropagation();fPese();return}
    if(e.target.closest('[data-gm-inf]')){e.stopPropagation();fInfos();return}
    if(e.target.closest('[data-gm-base-save]')){e.stopPropagation();const av=parseFloat(($('#gm_av').value||'').replace(',','.')),t=parseFloat(($('#gm_t').value||'').replace(',','.'));if(!(av>30&&av<250)||!(t>120&&t<220)){toast('Vérifiez le poids (kg) et la taille (cm)');return}
      S.parent.poidsAvant=av;S.parent.taille=t;sauver();close();render();toast('Enregistré');return}
    if(e.target.closest('[data-gm-pese-save]')){e.stopPropagation();const kg=parseFloat(($('#gm_kg').value||'').replace(',','.'));if(!(kg>30&&kg<250)){toast('Entrez votre poids en kg');return}
      await addLog({type:'maman',kg,t:getT()});if(!S.parent.poidsAvant)setTimeout(fBase,300);return}
    if(e.target.closest('[data-gm-inf-save]')){e.stopPropagation();const I={conds:[...document.querySelectorAll('[data-gm-c]')].filter(c=>c.checked).map(c=>c.dataset.gmC),ant:{},compl:$('#gm_compl').value.trim(),notes:$('#gm_notes').value.trim()};
      ['grossesses','vaginal','cesar','fc','prema'].forEach(k=>{const v=Math.round(+$('#gm_'+k).value);if(v>0)I.ant[k]=v});
      {const a=I.ant,fin=(a.vaginal||0)+(a.cesar||0)+(a.fc||0);if(a.prema&&a.prema>(a.vaginal||0)+(a.cesar||0)){toast('Le nombre de bébés prématurés dépasse le nombre d\'accouchements');return}
        if(fin&&!a.grossesses)a.grossesses=fin;else if(a.grossesses&&fin>a.grossesses){toast('Les accouchements et fausses couches ('+fin+') dépassent le nombre de grossesses ('+a.grossesses+'). Vérifiez, ou ajoutez des jumeaux dans « Ce qui s\'est passé avant ».');return}}S.parent.grossesseInfos=I;sauver();close();render();toast('Enregistré 💗');return}},true);
  (function(){const st=document.createElement('style');st.textContent='.gm-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.gm-det{margin-top:8px}.gm-det summary{cursor:pointer;font-weight:600;color:var(--accent);padding:6px 0}.gm-poids .jb-stat b{white-space:nowrap}';document.head.appendChild(st)})();
}
/* ---------- côté doula : ce que la famille a noté sur sa grossesse ---------- */
if(window.ESPACE!=='parent'&&typeof cSuivi==='function'){const _cs=cSuivi;cSuivi=function(c){const h=_cs.apply(this,arguments);try{const p=(c&&c.parent_data)||{},I=infos(p),b=imc(p);
    const C=(I.conds||[]).map(k=>(COND.find(x=>x[0]===k)||[0,k])[1]),a=I.ant||{},A=[];[['grossesses','grossesse avant','grossesses avant'],['vaginal','accouchement vaginal','accouchements vaginaux'],['cesar','césarienne','césariennes'],['fc','fausse couche','fausses couches'],['prema','bébé prématuré','bébés prématurés']].forEach(([k,l,pl])=>{if(+a[k])A.push(a[k]+' '+(+a[k]>1?pl:l))});
    if(!C.length&&!A.length&&!I.compl&&!I.notes&&!b)return h;
    let x='<div class="card"><span class="eyebrow acc">Sa grossesse : particularités et antécédents</span>';
    if(b){const k=cat(b),n=nbB(p);x+='<p class="small" style="margin:6px 0 0"><b>Poids d\'avant :</b> '+f1(+p.poidsAvant)+' kg · '+p.taille+' cm · IMC '+f1(b)+' ('+k[2].toLowerCase()+'). Prise de poids recommandée : '+(n>1?(k[7]?k[7][0]+' à '+k[7][1]+' kg':'à voir avec son professionnel'):cm(k[3])+' à '+cm(k[4])+' kg')+'.</p>'}
    if(C.length)x+='<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">'+C.map(t=>'<span class="pill line">'+esc(t)+'</span>').join('')+'</div>';
    if(A.length)x+='<p class="small" style="margin:8px 0 0"><b>Grossesses précédentes :</b> '+A.join(' · ')+'</p>';
    if(I.compl)x+='<p class="small" style="margin:6px 0 0"><b>Avant :</b> '+esc(I.compl)+'</p>';
    if(I.notes)x+='<p class="small" style="margin:6px 0 0"><b>Important :</b> '+esc(I.notes)+'</p>';
    return h+x+'<p class="xs muted">Informations inscrites par la famille dans son espace.</p></div>'}catch(e){return h}}}
})();
