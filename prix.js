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
/* Conversion approximative dans la monnaie du pays (taux du jour si le réseau répond, sinon taux de repli) */
const DEV={CH:'CHF',LI:'CHF',GB:'GBP',BE:'EUR',DE:'EUR',ES:'EUR',IT:'EUR',PT:'EUR',NL:'EUR',LU:'EUR',IE:'EUR',AT:'EUR',FI:'EUR',GR:'EUR',MC:'EUR',HR:'EUR',SK:'EUR',SI:'EUR',EE:'EUR',LV:'EUR',LT:'EUR',MT:'EUR',CY:'EUR',DK:'DKK',SE:'SEK',NO:'NOK',PL:'PLN',CZ:'CZK',HU:'HUF',RO:'RON',AU:'AUD',NZ:'NZD',JP:'JPY',KR:'KRW',CN:'CNY',HK:'HKD',SG:'SGD',IN:'INR',MX:'MXN',BR:'BRL',AR:'ARS',CL:'CLP',CO:'COP',PE:'PEN',MA:'MAD',DZ:'DZD',TN:'TND',SN:'XOF',CI:'XOF',CM:'XAF',MG:'MGA',HT:'HTG',LB:'LBP',IL:'ILS',TR:'TRY',AE:'AED',SA:'SAR',ZA:'ZAR',NG:'NGN',KE:'KES',EG:'EGP',TH:'THB',VN:'VND',PH:'PHP',ID:'IDR',MY:'MYR',UA:'UAH',RU:'RUB'};
const REPLI={CHF:.64,GBP:.56,EUR:.65,DKK:4.85,SEK:7.4,NOK:7.8,PLN:2.8,CZK:16,HUF:260,RON:3.3,AUD:1.1,NZD:1.2,JPY:108,KRW:980,CNY:5.2,HKD:5.6,SGD:.96,INR:60,MXN:13,BRL:4,ARS:700,CLP:660,COP:2900,PEN:2.7,MAD:7.1,DZD:96,TND:2.2,XOF:430,XAF:430,MGA:3200,HTG:95,LBP:64000,ILS:2.6,TRY:24,AED:2.6,SAR:2.7,ZAR:13,NGN:1100,KES:92,EGP:35,THB:25,VND:18000,PHP:41,IDR:11500,MYR:3.4,UAH:29,RUB:65};
let TAUX=null;try{TAUX=JSON.parse(localStorage.getItem('sere-taux')||'null')}catch(e){}
function rafraichirTaux(){try{if(TAUX&&Date.now()-TAUX.t<864e5)return;fetch('https://open.er-api.com/v6/latest/CAD').then(r=>r.ok?r.json():null).then(j=>{if(j&&j.rates){TAUX={t:Date.now(),r:j.rates};try{localStorage.setItem('sere-taux',JSON.stringify(TAUX))}catch(e){}}}).catch(()=>{})}catch(e){}}
setTimeout(rafraichirTaux,3000);
function devise(){try{let r='';if(window.ESPACE==='doula'){r=(typeof ME_DOULA!=='undefined'&&ME_DOULA&&ME_DOULA.region)||(S.doula&&S.doula.region)||''}else{r=(S.parent&&S.parent.region)||(typeof FAM!=='undefined'&&FAM&&FAM.region)||''}return /^W-/.test(r)?DEV[r.slice(2)]||'':''}catch(e){return ''}}
function local(montant,d){try{const t=(TAUX&&TAUX.r&&TAUX.r[d])||REPLI[d];if(!t)return '';const v=montant*t;return new Intl.NumberFormat('fr-CA',{style:'currency',currency:d,maximumFractionDigits:v>=1000?0:2}).format(v)}catch(e){return ''}}
function monde(){try{let r='';if(window.ESPACE==='doula'){r=(typeof ME_DOULA!=='undefined'&&ME_DOULA&&ME_DOULA.region)||(S.doula&&S.doula.region)||''}else{r=(S.parent&&S.parent.region)||(typeof FAM!=='undefined'&&FAM&&FAM.region)||''}return /^W-/.test(r)||(r&&!NOMS[r]&&!/^(NB|QC|ON|NS|PE|NL|MB|SK|AB|BC|YT|NT|NU|CA)$/.test(r))}catch(e){return false}}
function info(type){const r=reg(),c=P[r],lk=c.liens&&c.liens!==true?c.liens[type]:null;
  const ok=r==='CA'||(lk&&lk.mensuel&&lk.annuel),use=ok?c:P.CA,p=use[type];
  return {reg:r,ok,p,fmt:use.fmt,liens:ok&&r!=='CA'?lk:null,note:((!ok&&r!=='CA')||monde())?'Le paiement se fait en dollars canadiens ($ CA). Au moment de payer, le montant est converti dans votre monnaie (par le service de paiement ou par votre banque).'+(devise()?' Environ <b>'+local(use[type].m,devise())+'</b> par mois ou <b>'+local(use[type].a,devise())+'</b> par an (taux approximatif).':''):''}}
window.PRIX={reg,info,
  tous(type){return ['CA','FR','US'].map(r=>P[r].fmt(P[r][type].m)+'/mois ou '+P[r].fmt(P[r][type].a)+'/an')},
  phrase(type){const i=info(type);return '<b>'+i.fmt(i.p.m)+' par mois</b> ou <b>'+i.fmt(i.p.a)+' par an</b>'}};
})();
