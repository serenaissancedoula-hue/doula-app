/* Sérénaissance — une notification de message disparaît dès que le message est ouvert (lu) dans l'appli.
   Pas besoin de répondre. Si on n'ouvre pas le message, la notification reste.
   On se branche sur les deux appels qui marquent « lu » : fam_marquer_lus (doula ↔ famille) et chat_marquer_lu (cercle des mamans). */
(function(){
  if(typeof sb==='undefined'||!sb.rpc||!navigator.serviceWorker)return;
  function effacer(garde){try{navigator.serviceWorker.ready.then(r=>r.getNotifications?r.getNotifications():[]).then(l=>l.forEach(n=>{if(garde(n.tag||''))n.close()})).catch(()=>{})}catch(e){}}
  const o=sb.rpc.bind(sb);
  sb.rpc=function(nom,args){
    if(nom==='fam_marquer_lus')effacer(t=>t==='famille');
    else if(nom==='chat_marquer_lu'&&args&&args.p_conv)effacer(t=>t==='chat-'+args.p_conv);
    return o.apply(null,arguments);
  };
})();
