/* Sérénaissance — la famille envoie une fiche à sa doula (peurs, plan de naissance, valise…), la modifie quand elle veut et la renvoie. */
(function(){
const TITRES={plan:'Mon plan de naissance',peurs:'Mes peurs et mes besoins',situations:'Situations particulières',cahier:'Mon cahier de préparation',prep:'Ma préparation',valise:'Ma valise',contacts:'Mes contacts importants',qpro:'Questions à mon professionnel',quarante:'Mon plan des 40 jours'};
function lib(l){const n=[...l.childNodes].find(x=>x.nodeType===3&&x.textContent.trim());return n?n.textContent.trim():''}
function instantane(){const app=document.getElementById('app');if(!app)return '';const L=[],vus=new Set();
  app.querySelectorAll('.eyebrow,.tri,label.f,label.check,.check').forEach(el=>{
    if(el.closest('#nrCarte,.env-doula'))return;
    if(el.matches('.eyebrow')){const t=el.textContent.trim();if(t&&!vus.has('e'+t)){vus.add('e'+t);L.push('\n'+t.toUpperCase())}return}
    if(el.matches('.tri')){const c=el.querySelector('.chip.on'),p=el.previousElementSibling;if(c&&p)L.push('• '+p.textContent.trim()+' : '+c.textContent.trim()+' / 4');return}
    if(el.matches('label.check,.check')){const i=el.querySelector('input[type=checkbox]');if(i&&i.checked){const t=el.textContent.trim();if(!vus.has(t)){vus.add(t);L.push('☑ '+t)}}return}
    const f=el.querySelector('textarea,input:not([type=checkbox]):not([type=hidden]):not([disabled]),select');if(!f)return;const v=(f.value||'').trim();if(!v)return;L.push('• '+lib(el)+' : '+v)});
  return L.join('\n').replace(/^\n+/,'').replace(/\n{3,}/g,'\n\n')}
function carte(k){const E=((S.parent||{}).envois||{})[k],d=E&&E.t?new Date(E.t).toLocaleDateString('fr-CA',{day:'numeric',month:'long'})+' à '+new Date(E.t).toLocaleTimeString('fr-CA',{hour:'2-digit',minute:'2-digit'}):'';
  return '<div class="card env-doula"><span class="eyebrow acc">Pour ma doula</span><p class="small" style="margin:6px 0">Envoyez cette fiche à votre doula. Vous pouvez la modifier quand vous voulez et la lui renvoyer.</p>'+(d?'<p class="xs muted">Dernier envoi : '+d+'</p>':'')+'<button type="button" class="btn" data-act="envDoula" data-v="'+k+'">'+(d?'Renvoyer à ma doula':'Envoyer à ma doula')+'</button></div>'}
Object.keys(TITRES).forEach(k=>{if(!PSUB[k])return;const o=PSUB[k];PSUB[k]=function(){return o.apply(this,arguments)+(k==='plan'&&(S.planV||'edit')==='coup'?'':carte(k))}});
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act="envDoula"]');if(!b)return;e.stopPropagation();e.preventDefault();
  const k=b.dataset.v,txt=instantane();if(!txt){toast('Rien à envoyer pour l\'instant : remplissez d\'abord la fiche');return}
  b.disabled=true;
  const {error}=await sb.from('fam_messages').insert({famille_id:FAM.id,de_doula:false,texte:'📨 '+TITRES[k]+(((S.parent.envois||{})[k])?' (mise à jour)':'')+'\n\n'+txt});
  b.disabled=false;if(error){toast('Pas envoyé : '+error.message);return}
  S.parent.envois=Object.assign({},S.parent.envois||{},{[k]:{t:Date.now()}});try{save()}catch(x){}
  try{await chargerEchanges()}catch(x){}render();toast('Envoyé à votre doula')},true);
})();
