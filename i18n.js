/* Sérénaissance — français / English. Le français reste la langue d'origine; l'anglais est chargé seulement à la demande.
   La traduction se fait à l'affichage (texte, placeholders, infobulles) : les données des utilisatrices ne sont jamais modifiées. */
(function(){
  var CLE='sere-lang',lang='fr';
  try{lang=localStorage.getItem(CLE)||'fr'}catch(e){}
  window.LANG=lang;
  if(lang==='en'){
    /* dates, heures et montants : formats canadiens-anglais */
    ['toLocaleDateString','toLocaleTimeString','toLocaleString'].forEach(function(m){
      [Date.prototype,Number.prototype].forEach(function(P){
        var o=P[m];if(!o)return;
        P[m]=function(loc,opt){return o.call(this,(typeof loc==='string'&&/^fr/i.test(loc))?'en-CA':loc,opt)};
      });
    });
  }
  var FILES=['tr/en-9.js','tr/en-8.js','tr/en-1.js','tr/en-2.js','tr/en-3.js','tr/en-4.js','tr/en-5.js','tr/en-6.js','tr/en-7.js'];
  var EX={},SUB=[],RX=null,cache=Object.create(null),vus=new WeakMap();
  var SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,CODE:1,NOSCRIPT:1};
  function prep(){
    var T=window.TR_EN||{},k,subs=[];
    for(k in T){EX[k]=T[k];if(k.length>=9)subs.push(k)}
    subs.sort(function(a,b){return b.length-a.length});
    SUB=subs;
    if(subs.length)RX=new RegExp(subs.map(function(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}).join('|'),'g');
  }
  function tr(s){
    if(lang!=='en'||!s||typeof s!=='string')return s;
    if(cache[s]!==undefined)return cache[s];
    var m=s.match(/^(\s*)([\s\S]*?)(\s*)$/),core=m[2],out=core,SN=/Sérénaissance/g,prot=false;
    if(!core)return s;
    if(EX[core]!==undefined)out=EX[core];
    else if(RX){if(SN.test(core)){prot=true;out=core.replace(SN,'\u0001')}out=out.replace(RX,function(x){return EX[x]});if(prot)out=out.replace(/\u0001/g,'Sérénaissance')}
    if(out===core)out=core.replace(/^Bonjour( [^\s,.!?:;]+( [^\s,.!?:;]+)?)?$/,'Hello$1');
    out=out.replace(/(\d{1,2}) h (\d{2})/g,'$1:$2').replace(/ à (?=\d)/g,' at ');
    out=out.replace(/(\d+) jours\b/g,'$1 days').replace(/(\d+) jour\b/g,'$1 day').replace(/(\d+) semaines\b/g,'$1 weeks').replace(/(\d+) semaine\b/g,'$1 week').replace(/(\d+) mois\b/g,'$1 months').replace(/(\d+) sem\./g,'$1 wk').replace(/^du (.+ \d+) au (.+ \d+)$/,'from $1 to $2').replace(/L'équipe Sérénaissance/g,'The Sérénaissance team').replace(/^Règles · /,'Period · ').replace(/^([A-ZÉ]\S*) et ([A-ZÉ]\S*)$/,'$1 and $2').replace(/per day (\d+) de vie/g,'on day $1 of life').replace(/week (\d+) de vie/g,'week $1 of life').replace(/\(prévus\)/g,'(planned)').replace(/^prévue le /,'expected on ').replace(/(^|\s)de (\d+) days/g,'$1of $2 days').replace(/^Semaine (\d+)$/,'Week $1').replace(/semaine (\d+) de vie/g,'week $1 of life').replace(/\b[Vv]ers le /g,function(x){return x[0]==='V'?'Around ':'around '}).replace(/ à (?=\d)/g,' at ');
    out=m[1]+out+m[3];
    if(Object.keys(cache).length>6000)cache=Object.create(null);
    cache[s]=out;return out;
  }
  window.tr=tr;
  var ATTR=['placeholder','title','aria-label','alt'];
  function noeud(n){
    if(n.nodeType===3){
      var p=n.parentNode;if(!p||SKIP[p.nodeName]||(p.closest&&p.closest('[data-notr]')))return;
      var v=n.data;if(vus.get(n)===v)return;
      var t=tr(v);if(t!==v){n.data=t}vus.set(n,n.data);
    }else if(n.nodeType===1){
      if(SKIP[n.nodeName]||n.hasAttribute('data-notr'))return;
      for(var i=0;i<ATTR.length;i++){var a=n.getAttribute(ATTR[i]);if(a){var t2=tr(a);if(t2!==a)n.setAttribute(ATTR[i],t2)}}
      if(n.nodeName==='INPUT'&&/^(button|submit)$/.test(n.type)&&n.value){var t3=tr(n.value);if(t3!==n.value)n.value=t3}
      for(var c=n.firstChild;c;c=c.nextSibling)noeud(c);
    }
  }
  var plan=false;
  function appliquer(){plan=false;if(document.body)noeud(document.body);document.title=tr(document.title)}
  function demander(){if(!plan){plan=true;(window.requestAnimationFrame||setTimeout)(appliquer)}}
  function bouton(){
    var b=document.createElement('button');b.type='button';b.id='langBtn';b.setAttribute('data-notr','1');
    b.textContent=lang==='en'?'FR':'EN';b.setAttribute('aria-label',lang==='en'?'Passer en français':'Switch to English');
    b.style.cssText='display:none!important;position:fixed;right:max(10px,env(safe-area-inset-right,0px));bottom:calc(env(safe-area-inset-bottom,0px) + 136px);z-index:55;border:1px solid var(--line,#ddd);background:var(--card,#fff);color:var(--ink,#333);border-radius:50px;padding:6px 12px;font:700 12px var(--f-body,sans-serif);opacity:.85;box-shadow:0 4px 12px rgba(0,0,0,.12)';
    b.onclick=function(){try{localStorage.setItem(CLE,lang==='en'?'fr':'en')}catch(e){}location.reload()};
    document.body.appendChild(b);
  }
  function demarrer(){
    bouton();
    if(lang!=='en')return;
    document.documentElement.lang='en';
    var i=0;(function suite(){
      if(i<FILES.length){var s=document.createElement('script');s.src=FILES[i++]+'?v=1';s.onload=s.onerror=suite;document.head.appendChild(s);return}
      prep();appliquer();
      new MutationObserver(demander).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTR});
    })();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',demarrer);else demarrer();
})();
