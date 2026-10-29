/* Sérénaissance — modifier une entrée du journal (heure, durée, quantité, note…) avec le crayon, à côté de la corbeille. */
(function(){
if(window.ESPACE!=='parent'||typeof logPush!=='function')return;
const loc=t=>{const d=new Date(t);d.setSeconds(0,0);const p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes())};
const durT=s=>{const m=Math.round(s/60);return m<60?m+' min':Math.floor(m/60)+' h '+String(m%60).padStart(2,'0')};
const val=id=>{const e=document.getElementById(id);return e?e.value:''};
const opt=(v,cur,t)=>'<option value="'+v+'"'+(v===cur?' selected':'')+'>'+t+'</option>';
const MODIFIABLES=['sein','biberon','tirage','couche','sommeil','poids','soin','note','humeur','symptome','mvt','contraction'];
function champs(l){
  const T='<label class="f">Date et heure<input type="datetime-local" id="jm_t" value="'+loc(l.t)+'"></label>';
  switch(l.type){
   case 'sommeil':{const fin=l.fin||(l.t+(+l.sec||0)*1000);return T.replace('Date et heure','Heure de début')+'<label class="f">Heure de fin<input type="datetime-local" id="jm_fin" value="'+loc(fin)+'"></label><div class="seg" id="jmGenre"><button type="button" class="chip'+(l.genre!=='nuit'?' on':'')+'" data-jm="genre" data-v="sieste">☀️ Sieste</button><button type="button" class="chip'+(l.genre==='nuit'?' on':'')+'" data-jm="genre" data-v="nuit">🌙 Nuit</button></div><label class="f">Note<input type="text" id="jm_note" value="'+esc(l.note||'')+'"></label>'}
   case 'sein':return T+'<div class="grid2"><label class="f">Sein<select id="jm_side">'+opt('G',l.side,'Gauche')+opt('D',l.side,'Droit')+'</select></label><label class="f">Durée (minutes)<input type="number" id="jm_min" inputmode="numeric" value="'+Math.round((+l.sec||0)/60)+'"></label></div>';
   case 'biberon':return T+'<div class="grid2"><label class="f">Quantité (ml)<input type="number" id="jm_ml" inputmode="numeric" value="'+(+l.ml||0)+'"></label><label class="f">Lait<select id="jm_lait">'+opt('maternel',l.lait,'Lait maternel frais')+opt('congele',l.lait,'Lait maternel congelé')+opt('preparation',l.lait,'Préparation commerciale')+'</select></label></div>';
   case 'tirage':return T+'<div class="grid2"><label class="f">Quantité (ml)<input type="number" id="jm_ml" inputmode="numeric" value="'+(+l.ml||0)+'"></label><label class="f">Destination<input type="text" id="jm_dest" value="'+esc(l.dest||'')+'"></label></div>';
   case 'couche':return T+'<div class="seg"><button type="button" class="chip'+(l.pipi?' on':'')+'" data-jm="tog" id="jm_pipi">💧 Pipi</button><button type="button" class="chip'+(l.selle?' on':'')+'" data-jm="tog" id="jm_selle">💩 Selle</button></div><label class="f">Couleur de la selle<input type="text" id="jm_col" value="'+esc(l.couleur||'')+'"></label>';
   case 'poids':return T+'<label class="f">Poids (grammes)<input type="number" id="jm_g" inputmode="numeric" value="'+(+l.g||0)+'"></label>';
   case 'humeur':case 'symptome':case 'soin':case 'note':return T+'<label class="f">Note<input type="text" id="jm_note" value="'+esc(l.note||'')+'"></label>';
   default:return T}}
function ouvrir(id){const l=(S.logs||[]).find(x=>String(x.id)===String(id));if(!l)return;
  sheet('Modifier · '+((typeof LOGMETA==='object'&&LOGMETA[l.type])?LOGMETA[l.type][1]:'entrée'),champs(l)+'<button class="btn" data-jm="save" data-id="'+esc(String(id))+'">Enregistrer les changements</button>')}
async function sauver(id){const l=(S.logs||[]).find(x=>String(x.id)===String(id));if(!l)return;
  const t=+new Date(val('jm_t'));if(!t){toast('Date invalide');return}
  const n=Object.assign({},l);n.t=t;
  switch(l.type){
   case 'sommeil':{const f=+new Date(val('jm_fin')),s=Math.round((f-t)/1000);if(!(s>0)){toast('L\'heure de fin doit venir après le début');return}n.fin=f;n.sec=s;const g=document.querySelector('#jmGenre .chip.on');n.genre=g?g.dataset.v:l.genre;n.note=val('jm_note');break}
   case 'sein':n.side=val('jm_side');n.sec=(+val('jm_min')||0)*60;break;
   case 'biberon':n.ml=+val('jm_ml')||0;n.lait=val('jm_lait');break;
   case 'tirage':n.ml=+val('jm_ml')||0;n.dest=val('jm_dest');break;
   case 'couche':{const p=document.getElementById('jm_pipi').classList.contains('on'),s=document.getElementById('jm_selle').classList.contains('on');if(!p&&!s){toast('Choisissez pipi ou selle');return}n.pipi=p;n.selle=s;n.couleur=s?val('jm_col'):'';break}
   case 'poids':{const g=+val('jm_g');if(!g){toast('Entrez le poids en grammes');return}n.g=g;break}
   case 'humeur':case 'symptome':case 'soin':case 'note':n.note=val('jm_note');break}
  const {id:_i,t:_t,type,...data}=n;
  const {error}=await sb.from('fam_journal').update({t:new Date(t).toISOString(),data}).eq('id',id);
  if(error){toast('Modification non enregistrée : vérifiez votre connexion');return}
  Object.assign(l,n);try{close()}catch(e){}render();toast('Modifié ✓')}
const _r=render;render=function(){const x=_r.apply(this,arguments);try{
  if(S.role==='parent')document.querySelectorAll('#app .li > [data-act="delLog"]').forEach(d=>{
    const li=d.parentElement,l=(S.logs||[]).find(y=>String(y.id)===String(d.dataset.id));
    if(!l||!MODIFIABLES.includes(l.type)||li.querySelector('[data-jm="edit"]'))return;
    const b=document.createElement('button');b.type='button';b.className='icon-btn';b.setAttribute('data-jm','edit');b.setAttribute('data-id',d.dataset.id);b.setAttribute('aria-label','Modifier');b.innerHTML=icon('fa-pen');d.before(b)})
 }catch(e){}return x};
document.addEventListener('click',e=>{const b=e.target.closest('[data-jm]');if(!b)return;e.stopPropagation();e.preventDefault();const a=b.dataset.jm;
  if(a==='edit'){ouvrir(b.dataset.id);return}
  if(a==='save'){sauver(b.dataset.id);return}
  if(a==='tog'){b.classList.toggle('on');return}
  if(a==='genre'){document.querySelectorAll('#jmGenre .chip').forEach(c=>c.classList.toggle('on',c===b));return}},true);
})();
