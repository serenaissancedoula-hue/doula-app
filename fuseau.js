/* Fuseau horaire : suit la région de la famille (Espace Famille) ou de la doula (Espace Doula).
   Sans région choisie : le fuseau du téléphone. Les dates seules (sans heure, ex. date prévue) ne sont jamais décalées. */
(function(){
const FUSEAUX={NB:'America/Moncton',NS:'America/Halifax',PE:'America/Halifax',QC:'America/Toronto',ON:'America/Toronto',NL:'America/St_Johns',MB:'America/Winnipeg',SK:'America/Regina',AB:'America/Edmonton',BC:'America/Vancouver',YT:'America/Whitehorse',NT:'America/Yellowknife',NU:'America/Iqaluit',FR:'Europe/Paris',US:'America/New_York'};
function region(){try{
  if(window.ESPACE==='doula')return (typeof ME_DOULA!=='undefined'&&ME_DOULA&&ME_DOULA.region)||(typeof S!=='undefined'&&S.doula&&S.doula.region)||'';
  return (window.maRegion&&window.maRegion())||(typeof S!=='undefined'&&S.parent&&S.parent.region)||(typeof FAM!=='undefined'&&FAM&&FAM.region)||'';
}catch(e){return ''}}
window.fuseauApp=function(){try{const z=FUSEAUX[region()];if(z){new Intl.DateTimeFormat('fr-CA',{timeZone:z});
  /* Région et appareil sur deux continents différents (ex. France choisie, téléphone au Canada) : on garde l'heure de l'appareil */
  const ap=Intl.DateTimeFormat().resolvedOptions().timeZone||'';if(ap&&ap.split('/')[0]!==z.split('/')[0])return undefined;return z}}catch(e){}return undefined};
const P=Date.prototype,D=P.toLocaleDateString,T=P.toLocaleTimeString,L=P.toLocaleString;
const seule=d=>d.getHours()===0&&d.getMinutes()===0&&d.getSeconds()===0&&d.getMilliseconds()===0;
const avec=(o,force,d)=>{const z=window.fuseauApp();if(!z||(o&&o.timeZone))return o;if(!force&&seule(d))return o;return Object.assign({},o||{},{timeZone:z})};
P.toLocaleDateString=function(l,o){return D.call(this,l,avec(o,false,this))};
P.toLocaleTimeString=function(l,o){return T.call(this,l,avec(o,true,this))};
P.toLocaleString=function(l,o){return L.call(this,l,avec(o,false,this))};
})();
