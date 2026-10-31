/* Page de connexion : note totale donnée par celles qui ont évalué l'appli (RPC avis_appli_resume). */
(function(){
  var _e=ecranConnexion;
  function ligne(r){
    if(!r||!r.n||r.n<5)return'';
    var m=Number(r.moyenne)||0,pl=Math.round(m),e='';
    for(var i=1;i<=5;i++)e+='<span style="color:'+(i<=pl?'#d9a441':'#d8cfc6')+'">★</span>';
    return '<div id="avisNote" style="text-align:center;margin:10px 0 2px"><div style="font-size:1.35rem;letter-spacing:2px;line-height:1">'+e+'</div><div class="small muted" style="margin-top:4px"><b>'+String(m.toFixed(1)).replace('.',',')+' / 5</b> · '+r.n+' avis de mamans</div></div>';
  }
  function poser(r){var h=ligne(r),c=document.querySelector('#app .card .lang-choix');if(!h||!c||document.getElementById('avisNote'))return;c.insertAdjacentHTML('beforebegin',h)}
  var cache=null;
  ecranConnexion=function(){
    var x=_e.apply(this,arguments);
    try{
      if(cache)poser(cache);
      else sb.rpc('avis_appli_resume').then(function(q){if(q&&q.data){cache=q.data;poser(cache)}}).catch(function(){});
    }catch(e){}
    return x;
  };
})();
