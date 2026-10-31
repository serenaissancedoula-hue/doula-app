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

/* Liste de tous les pays du monde (hors Canada, France, États-Unis, déjà offerts) : codes « W-XX », noms en français */
(function(){
const ISO='AF AX AL DZ AS AD AO AI AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BA BW BR VG BN BG BF BI KH CM CV KY CF TD CL CN CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI PF GA GM GE DE GH GI GR GL GD GU GT GG GN GW GY HT HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI XK KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU KP MK MP NO OM PK PW PS PA PG PY PE PH PL PT PR QA RE RO RU RW WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA KR SS ES LK BL SH KN LC MF PM VC SD SR SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB UY UZ VU VA VE VN WF EH YE ZM ZW GP GF'.split(' ');
let DN=null;try{DN=new Intl.DisplayNames(['fr'],{type:'region'})}catch(e){}
window.PAYS_MONDE=ISO.filter(c=>c!=='CA'&&c!=='FR'&&c!=='US').map(c=>{let n=c;try{n=(DN&&DN.of(c))||c}catch(e){}return ['W-'+c,n]}).sort((a,b)=>a[1].localeCompare(b[1],'fr'));
})();
