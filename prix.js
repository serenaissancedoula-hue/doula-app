/* Sérénaissance — prix des abonnements selon le pays (Canada $ CA, France €, États-Unis $ US).
   Liens Stripe créés le 2026-10-26 (EUR et USD). Si un lien manquait, repli sur le lien en $ CA. */
(function(){
const P={
  CA:{doula:{m:8,a:90,e:6},maman:{m:4,a:40,e:8},fmt:n=>n+' $',liens:true},
  FR:{doula:{m:5,a:57,e:3},maman:{m:3,a:26,e:10},fmt:n=>n+' €',liens:{doula:{mensuel:'https://buy.stripe.com/6oUaEQ3na9RefwUgU2ffy0B',annuel:'https://buy.stripe.com/14A00c2j6fby84seLUffy0C'},maman:{mensuel:'https://buy.stripe.com/6oUcMYaPCfby84s1Z8ffy0F',annuel:'https://buy.stripe.com/fZu9AM3na7J670o0V4ffy0G'}}},
  US:{doula:{m:6,a:64,e:8},maman:{m:3,a:28,e:8},fmt:n=>n+' $ US',liens:{doula:{mensuel:'https://buy.stripe.com/fZudR28Hu0gE84s7jsffy0D',annuel:'https://buy.stripe.com/cNi4gsf5S1kIdoM8nwffy0E'},maman:{mensuel:'https://buy.stripe.com/3cI9AMf5S2oM5Wk7jsffy0H',annuel:'https://buy.stripe.com/9B66oA2j68NackIfPYffy0I'}}}
};
const NOMS={'France':'FR','FR':'FR','États-Unis':'US','Etats-Unis':'US','US':'US','USA':'US'};
function reg(){try{let r='';if(window.ESPACE==='doula'){r=(typeof ME_DOULA!=='undefined'&&ME_DOULA&&ME_DOULA.region)||(S.doula&&S.doula.region)||''}else{r=(S.parent&&S.parent.region)||(typeof FAM!=='undefined'&&FAM&&FAM.region)||''}return NOMS[r]||'CA'}catch(e){return 'CA'}}
/* type = 'doula' | 'maman' ; k = 'mensuel' | 'annuel' ; retourne {texte, ext, lien, devise} */
function monde(){try{let r='';if(window.ESPACE==='doula'){r=(typeof ME_DOULA!=='undefined'&&ME_DOULA&&ME_DOULA.region)||(S.doula&&S.doula.region)||''}else{r=(S.parent&&S.parent.region)||(typeof FAM!=='undefined'&&FAM&&FAM.region)||''}return /^W-/.test(r)||(r&&!NOMS[r]&&!/^(NB|QC|ON|NS|PE|NL|MB|SK|AB|BC|YT|NT|NU|CA)$/.test(r))}catch(e){return false}}
function info(type){const r=reg(),c=P[r],lk=c.liens&&c.liens!==true?c.liens[type]:null;
  const ok=r==='CA'||(lk&&lk.mensuel&&lk.annuel),use=ok?c:P.CA,p=use[type];
  return {reg:r,ok,p,fmt:use.fmt,liens:ok&&r!=='CA'?lk:null,note:((!ok&&r!=='CA')||monde())?'Le paiement se fait en dollars canadiens ($ CA). Au moment de payer, le montant est converti dans votre monnaie (par le service de paiement ou par votre banque).':''}}
window.PRIX={reg,info,
  tous(type){return ['CA','FR','US'].map(r=>P[r].fmt(P[r][type].m)+'/mois ou '+P[r].fmt(P[r][type].a)+'/an')},
  phrase(type){const i=info(type);return '<b>'+i.fmt(i.p.m)+' par mois</b> ou <b>'+i.fmt(i.p.a)+' par an</b>'}};
})();
