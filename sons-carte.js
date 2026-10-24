/* Sérénaissance — carte « Sons de l'appli » (Paramètres) : sons des touches, son des messages, volume. */
(function(){'use strict';
if(typeof pParametres!=='function'||!window.Reglages)return;
const EN=()=>/^en/i.test(document.documentElement.lang||'')&&false;
function carte(){const d=Reglages.lire(),Ls=Reglages.listes,sel=(cls,L,cur)=>'<select class="'+cls+'" style="max-width:160px">'+L.map(x=>'<option value="'+x[0]+'"'+(cur===x[0]?' selected':'')+'>'+x[1]+'</option>').join('')+'</select>';
  const lg=(t,s,c)=>'<label style="display:flex;align-items:center;justify-content:space-between;gap:14px;padding:6px 0"><span><b class="small">'+t+'</b><br><span class="xs muted">'+s+'</span></span>'+c+'</label>';
  return '<div class="card"><span class="eyebrow acc">Sons de l’appli</span><div class="stack" style="gap:2px">'+
   lg('Son quand on touche un bouton','Désactivez-le pour un appli silencieux','<input type="checkbox" role="switch" class="sc-tch"'+(d.touches===false?'':' checked')+'>')+
   lg('Choix du son des touches','Écoutez en changeant',sel('sc-stch',Ls.touche,d.sonTouche||'goutte'))+
   lg('Son d’un nouveau message','Écoutez en changeant',sel('sc-smsg',Ls.msg,d.sonMsg||'carillon'))+
   lg('Vibration','À chaque touche et à chaque message (Android)','<input type="checkbox" role="switch" class="sc-vib"'+(d.vibration===false?'':' checked')+'>')+
   lg('Volume','Touches et messages','<input type="range" min="0" max="100" step="5" class="sc-vol" value="'+(d.volume==null?70:d.volume)+'" style="max-width:150px">')+
   '</div></div>'}
const _pp=pParametres;pParametres=function(){let h=_pp.apply(this,arguments);try{
  let i=h.indexOf('<details class="acc" data-sec="Notifications'),det=true;if(i<0){i=h.indexOf('<div class="card"><span class="eyebrow acc">Notifications, son');det=false}
  if(i>=0){let c=carte();if(det)c='<details class="acc" data-sec="Sons de l’appli"><summary>Sons de l’appli<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body">'+c.replace('<div class="card"><span class="eyebrow acc">Sons de l’appli</span>','<div>')+'</div></details>';h=h.slice(0,i)+c+h.slice(i)}}catch(e){}return h};
document.addEventListener('change',e=>{const t=e.target;if(!t||!t.classList)return;
  if(t.classList.contains('sc-tch')){Reglages.regler({touches:t.checked});if(t.checked)Reglages.tap(true)}
  else if(t.classList.contains('sc-stch')){Reglages.regler({sonTouche:t.value});Reglages.tap(true)}
  else if(t.classList.contains('sc-smsg')){Reglages.regler({sonMsg:t.value});Reglages.sonner(true,t.value)}
  else if(t.classList.contains('sc-vib')){Reglages.regler({vibration:t.checked});if(t.checked&&navigator.vibrate)try{navigator.vibrate([200,100,200])}catch(x){}}
  else if(t.classList.contains('sc-vol')){Reglages.regler({volume:+t.value});Reglages.tap(true)}},true);
})();
