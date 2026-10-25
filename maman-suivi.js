/* Sérénaissance — Journal bébé, onglet Maman : « Mon suivi » pour la maman après la naissance :
   poids, tension artérielle, saignements, douleur, avec la dernière valeur, l'évolution du poids et des repères pour savoir quand appeler. */
(function(){
if(window.ESPACE!=='parent'||typeof pJournal!=='function')return;
try{LOGMETA.maman=['fa-heart-pulse','Mon suivi']}catch(e){}
const SAIGN={aucun:'Aucun',leger:'Léger',moyen:'Moyen',abondant:'Abondant (1 serviette ou plus par heure)'};
const cm=x=>String(x).replace('.',',');
if(typeof logText==='function'){const _lt=logText;logText=function(l){if(l&&l.type==='maman'){const p=[];if(l.kg)p.push(cm(l.kg)+' kg');if(l.sys&&l.dia)p.push('tension '+l.sys+'/'+l.dia);if(l.saign&&l.saign!=='aucun')p.push('saignements '+(SAIGN[l.saign]||'').toLowerCase().replace(/ \(.*/,''));if(l.douleur!=null&&l.douleur!=='')p.push('douleur '+l.douleur+'/10');if(l.note)p.push(esc(l.note));return p.join(' · ')||'Mesures notées'}return _lt.apply(this,arguments)}}
function L(){return (S.logs||[]).filter(l=>l.type==='maman').sort((a,b)=>a.t-b.t)}
function alerte(l){if(!l)return '';const a=[];
  if(l.saign==='abondant')a.push('<b>Saignements abondants</b> (une serviette ou plus par heure, ou gros caillots) : <b>911 ou l\'urgence</b> tout de suite.');
  if(l.sys>=160||l.dia>=110)a.push('<b>Tension très élevée ('+l.sys+'/'+l.dia+')</b> : allez à l\'urgence maintenant, surtout avec mal de tête, vision embrouillée ou douleur sous les côtes.');
  else if(l.sys>=140||l.dia>=90)a.push('<b>Tension élevée ('+l.sys+'/'+l.dia+')</b> : appelez votre médecin ou sage-femme aujourd\'hui (la prééclampsie peut survenir jusqu\'à 6 semaines après la naissance).');
  if(+l.douleur>=7)a.push('<b>Douleur forte</b> : parlez-en à votre professionnel ou appelez le 811.');
  return a.length?'<div class="banner bad" style="margin-top:10px">'+icon('fa-triangle-exclamation')+'<div class="small">'+a.join('<br>')+'</div></div>':''}
function courbe(P){if(P.length<2)return '';const W=300,H=90,v=P.map(l=>+l.kg),mn=Math.min(...v)-.5,mx=Math.max(...v)+.5,t0=P[0].t,t1=P[P.length-1].t||t0+1;
  const pts=P.map(l=>[(l.t-t0)/Math.max(1,t1-t0)*(W-20)+10,H-10-((+l.kg-mn)/(mx-mn))*(H-20)]);
  return '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;margin-top:8px" role="img" aria-label="Évolution de mon poids"><polyline fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" points="'+pts.map(p=>p.map(x=>x.toFixed(1)).join(',')).join(' ')+'"/>'+pts.map(p=>'<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="3.5" fill="var(--accent)"/>').join('')+'</svg>'}
function carte(){const A=L(),P=A.filter(l=>l.kg),der=A[A.length-1],dp=P[P.length-1],d0=P[0];
  const c=(lab,val)=>'<div class="jb-stat"><b>'+val+'</b><span>'+lab+'</span></div>';
  let h='<div class="card ms"><div class="row between"><span class="eyebrow acc">Mon suivi</span><button class="btn sm" data-ms="1">'+icon('fa-plus')+'Noter</button></div>';
  h+='<div class="jb-stats" style="margin-top:8px">'+c('mon poids',dp?cm(dp.kg)+' kg':'—')+c('depuis le début',dp&&d0&&dp!==d0?((dp.kg-d0.kg>=0?'+':'')+cm((dp.kg-d0.kg).toFixed(1))+' kg'):'—')+c('dernière tension',(A.filter(l=>l.sys).slice(-1)[0]||{}).sys?(A.filter(l=>l.sys).slice(-1)[0].sys+'/'+A.filter(l=>l.sys).slice(-1)[0].dia):'—')+'</div>';
  h+=courbe(P.slice(-12));
  if(!A.length)h+='<p class="small muted" style="margin:8px 0 0">Notez votre poids, votre tension (si vous avez un tensiomètre), vos saignements et votre douleur. Vous verrez l\'évolution ici, et pourrez montrer ces notes à votre médecin ou à votre doula.</p>';
  else h+='<p class="xs muted" style="margin:8px 0 0">Après la naissance, le poids baisse souvent de 4 à 6 kg tout de suite, puis lentement sur plusieurs mois : allaiter, bien manger et bouger doucement aident. Pas de régime strict pendant l\'allaitement.</p>';
  return h+alerte(der)+'</div>'}
function form(){const D=L().slice(-1)[0]||{};
  sheet('Mon suivi','<div class="grid2"><label class="f">Poids (kg)<input type="number" id="ms_kg" inputmode="decimal" step="0.1" placeholder="'+(D.kg?cm(D.kg):'Ex. : 68,5')+'"></label><label class="f">Douleur (0 à 10)<input type="number" id="ms_dl" inputmode="numeric" min="0" max="10" placeholder="0"></label></div>'+
    '<div class="grid2"><label class="f">Tension : haut<input type="number" id="ms_sys" inputmode="numeric" placeholder="Ex. : 118"></label><label class="f">Tension : bas<input type="number" id="ms_dia" inputmode="numeric" placeholder="Ex. : 76"></label></div>'+
    '<label class="f">Saignements<select id="ms_sg"><option value="">—</option>'+Object.entries(SAIGN).map(([k,v])=>'<option value="'+k+'">'+v+'</option>').join('')+'</select></label>'+
    '<label class="f">Note (cicatrice, seins, sommeil, énergie…)<input id="ms_n"></label>'+W()+
    '<p class="xs muted">Remplissez seulement ce que vous voulez. Saignements abondants, tension très élevée, fièvre, douleur au mollet ou difficulté à respirer : 911.</p><button class="btn" data-ms-save="1">Enregistrer</button>')}
async function sauver(){const n=x=>{const v=($(x).value||'').replace(',','.').trim();return v===''?null:+v};
  const o={type:'maman',kg:n('#ms_kg'),sys:n('#ms_sys'),dia:n('#ms_dia'),douleur:n('#ms_dl'),saign:$('#ms_sg').value||'',note:$('#ms_n').value,t:getT()};
  if(o.kg==null&&o.sys==null&&o.douleur==null&&!o.saign&&!o.note){toast('Remplissez au moins une mesure');return}
  if((o.sys==null)!==(o.dia==null)){toast('Entrez les deux chiffres de la tension');return}
  await addLog(o)}
/* « Mon suivi » juste sous les chiffres de l'onglet Maman */
const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(S.tab==='journal'&&S.jbTab==='maman'){const app=document.getElementById('app'),ms=app.querySelector(':scope>.card.ms'),st=app.querySelector(':scope>.card .jb-stats');const c=st&&st.closest('.card');if(ms&&c&&c.nextElementSibling!==ms)c.after(ms)}}catch(e){}return x};
(function(){const st=document.createElement('style');st.textContent='.ms .jb-stat b{font-size:1.05rem;white-space:nowrap}';document.head.appendChild(st)})();
document.addEventListener('click',e=>{if(e.target.closest('[data-ms]')){e.stopPropagation();form();return}if(e.target.closest('[data-ms-save]')){e.stopPropagation();sauver()}},true);
const _pJ=pJournal;
pJournal=function(){const h=_pJ.apply(this,arguments);try{if(stage().k!=='pp'||S.jbTab!=='maman')return h;
  const t=document.createElement('template');t.innerHTML=h;const st=t.content.querySelector('.jb-stats'),card=st&&st.closest('.card');const x=document.createElement('template');x.innerHTML=carte();
  if(card)card.after(x.content);else t.content.append(x.content);return [...t.content.childNodes].map(n=>n.outerHTML||n.textContent||'').join('')}catch(e){return h}};
})();
