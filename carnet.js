/* Sérénaissance — Journaux écrits : « Journal de grossesse » et « Journal de naissance de bébé » (famille). */
(function(){'use strict';
if(window.ESPACE!=='parent'||typeof pJournal!=='function')return;
const K={grossesse:{t:'Journal de grossesse',ic:'fa-feather-pointed',inv:'Écrivez à votre bébé ou à vous-même : ce que vous ressentez, ce qui vous marque cette semaine…',ph:'Aujourd’hui, je ressens…'},
 bebe:{t:'Journal de naissance de bébé',ic:'fa-baby',inv:'Les premiers jours, les premières fois, les mots que vous voulez garder pour toujours.',ph:'Aujourd’hui, bébé…'}};
const list=k=>((S.parent.carnet=S.parent.carnet||[]).filter(e=>e.k===k)).sort((a,b)=>b.d.localeCompare(a.d)||b.t-a.t);
const sem=d=>{try{const st=stage();if(st.k==='preg'&&st.g&&st.g.w!=null&&d===iso(new Date()))return st.g.w}catch(e){}return ''};
const fd=d=>fmtD(parseD(d),{weekday:'long',day:'numeric',month:'long',year:'numeric'});
function item(e){return '<div class="li" style="align-items:flex-start"><div class="tx" style="min-width:0"><b>'+fd(e.d)+(e.sa?' · '+e.sa+' sem.':'')+'</b><span style="white-space:pre-wrap;overflow-wrap:anywhere">'+esc(e.txt)+'</span></div><button class="icon-btn" data-act="cnEdit" data-id="'+e.id+'" aria-label="Modifier">'+icon('fa-pen')+'</button></div>'}
function carte(k,full){const L=list(k),m=K[k];
  return '<div class="card"><div class="row between"><span class="eyebrow acc">'+m.t+'</span><button class="btn sm" data-act="cnNew" data-k="'+k+'">'+icon('fa-plus')+'Écrire</button></div>'+
   (L.length?'<div class="list">'+L.slice(0,full?999:2).map(item).join('')+'</div>'+(!full&&L.length>2?'<button class="btn sm ghost" data-act="cnAll" data-k="'+k+'">Tout relire ('+L.length+')</button>':''):'<p class="small muted">'+m.inv+'</p>')+'</div>'}
window.carnetCartes=function(){const pp=stage().k==='pp';return pp?carte('bebe')+(list('grossesse').length?carte('grossesse'):''):carte('grossesse')};
window.carnetCarte=carte;
const _pJ=pJournal;pJournal=function(){let h=_pJ.apply(this,arguments);try{const a=h.indexOf('<div class="seg">');const e=a>=0?h.indexOf('</div>',a)+6:0;h=h.slice(0,e)+carnetCartes()+h.slice(e)}catch(x){}return h};
function form(k,e){e=e||{};sheet(e.id?'Modifier mon texte':K[k].t,'<div class="stack" style="gap:10px"><label class="f">Date<input type="date" id="cnD" value="'+esc(e.d||iso(new Date()))+'"></label><label class="f">Mon texte<textarea id="cnT" rows="8" placeholder="'+K[k].ph+'" style="width:100%">'+esc(e.txt||'')+'</textarea></label><p class="xs muted">Vous seule (et votre doula, si vous le lui montrez) lisez ce texte. Vous pouvez l’écrire à la main ou le dicter avec le micro de votre clavier.</p><button class="btn" data-act="cnSave" data-k="'+k+'" data-id="'+esc(e.id||'')+'">Enregistrer</button>'+(e.id?'<button class="btn ghost" data-act="cnDel" data-id="'+e.id+'">Supprimer</button>':'')+'</div>')}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-act="cnNew"],[data-act="cnEdit"],[data-act="cnSave"],[data-act="cnDel"],[data-act="cnAll"]');if(!b)return;ev.stopPropagation();ev.preventDefault();
  const a=b.dataset.act,k=b.dataset.k,id=b.dataset.id,C=S.parent.carnet=S.parent.carnet||[];
  if(a==='cnNew')return form(k);
  if(a==='cnEdit'){const e=C.find(x=>x.id===id);return e&&form(e.k,e)}
  if(a==='cnAll')return sheet(K[k].t,'<div class="stack" style="gap:10px">'+carte(k,true)+'</div>');
  if(a==='cnSave'){const txt=($('#cnT').value||'').trim(),d=$('#cnD').value||iso(new Date());if(!txt){toast('Écrivez quelques mots');return}
    const e=id&&C.find(x=>x.id===id);if(e){e.txt=txt;e.d=d}else C.push({id:uid(),k,d,t:Date.now(),txt,sa:k==='grossesse'?sem(d):''});save();close();render();toast('Enregistré');return}
  if(a==='cnDel'){if(b.dataset.c!=='1'){b.dataset.c='1';toast('Touchez encore pour supprimer');return}S.parent.carnet=C.filter(x=>x.id!==id);save();close();render()}},true);
})();
