/* Sérénaissance — taxes de la doula : inscrite ou non à la TPS / TVH / TVQ, ses numéros, et le détail sur ses reçus.
   Taux (Agence du revenu du Canada, depuis le 1er avril 2025) : TVH N.-B. 15 %, T.-N.-L. 15 %, Î.-P.-É. 15 %, N.-É. 14 %, Ont. 13 %;
   TPS 5 % ailleurs; Québec : TPS 5 % + TVQ 9,975 % (calculée sur le prix avant taxes).
   Les montants notés dans l'appli sont AVANT taxes : le reçu ajoute les taxes. Une doula sous le seuil du petit fournisseur (30 000 $) n'a pas à s'inscrire. */
(function(){
if(window.ESPACE==='parent')return;
const norm=t=>String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z]+/g,'');
const PROV=[['nouveaubrunswick','NB'],['nb','NB'],['novascotia','NS'],['nouvelleecosse','NS'],['ns','NS'],['ileduprinceedouard','PE'],['pe','PE'],['pei','PE'],['terreneuveetlabrador','NL'],['nl','NL'],['ontario','ON'],['on','ON'],['quebec','QC'],['qc','QC'],['manitoba','MB'],['mb','MB'],['saskatchewan','SK'],['sk','SK'],['alberta','AB'],['ab','AB'],['colombiebritannique','BC'],['bc','BC'],['yukon','YT'],['yt','YT'],['territoiresdunordouest','NT'],['nt','NT'],['nunavut','NU'],['nu','NU']];
const TAUX={NB:[['TVH',15]],NL:[['TVH',15]],PE:[['TVH',15]],NS:[['TVH',14]],ON:[['TVH',13]],QC:[['TPS',5],['TVQ',9.975]],MB:[['TPS',5]],SK:[['TPS',5]],AB:[['TPS',5]],BC:[['TPS',5]],YT:[['TPS',5]],NT:[['TPS',5]],NU:[['TPS',5]]};
const codeProv=r=>{const n=norm(r);const f=PROV.find(x=>x[0]===n);return f?f[1]:''};
const T=()=>{try{return ((ME_DOULA&&ME_DOULA.modeles)||{}).taxes||{}}catch(e){return {}}};
const pct=n=>String(n).replace('.',',')+' %';
const cents=n=>Math.round(n*100)/100;
function info(){let D={};try{D=S.doula||{}}catch(e){}const prov=codeProv(D.region),t=T(),taux=TAUX[prov]||[];
  const inscrite=!!t.inscrite&&taux.length>0&&!!String(D.tvh||'').trim();
  const lignes=taux.map(([k,p])=>({k,p,no:k==='TVQ'?(t.tvq||''):(D.tvh||'')}));
  return {prov,taux,inscrite,lignes,aTaxes:taux.length>0}}
/* Montant noté (avant taxes) → avant taxes, chaque taxe, total reçu */
function ventiler(avant){const I=info(),b=+avant||0;if(!I.inscrite)return {avant:b,lignes:[],total:b,inscrite:false};
  const L=I.lignes.map(l=>({k:l.k,p:l.p,no:l.no,montant:cents(b*l.p/100)}));
  const total=cents(b+L.reduce((s,x)=>s+x.montant,0));return {avant:b,lignes:L,total,inscrite:true}}
function texte(){const I=info();if(!I.inscrite)return 'Non inscrite aux taxes (aucune taxe perçue)';return I.lignes.map(l=>(l.k==='TVQ'?'No de TVQ : ':'No de '+l.k+' : ')+l.no).join(' · ')}
window.taxesInfo=info;window.taxesVentiler=ventiler;window.taxesTexte=texte;
/* ---------- formats : espaces et casse corrigés, jamais inventés ---------- */
const fmtTps=v=>{v=String(v||'').toUpperCase().replace(/[^0-9A-Z]/g,'');const m=v.match(/^(\d{9})(?:RT)?(\d{4})?$/);return m?m[1]+(m[2]?' RT'+m[2]:''):null};
const fmtTvq=v=>{v=String(v||'').toUpperCase().replace(/[^0-9A-Z]/g,'');const m=v.match(/^(\d{10})(?:TQ)?(\d{4})?$/);return m?m[1]+(m[2]?' TQ'+m[2]:''):null};
/* ---------- carte « Mes taxes » (remplace le champ libre « No de TVH ») ---------- */
function carte(){const I=info(),t=T(),D=S.doula||{};
  if(!I.aTaxes)return '<div class="card tx-carte"><span class="eyebrow acc">Mes taxes</span><p class="small">Les taxes canadiennes (TPS, TVH, TVQ) ne s\'appliquent pas à votre région : vos reçus indiqueront « aucune taxe perçue ».</p></div>';
  const TV=I.taux.some(x=>x[0]==='TVH'),nomA=TV?'TVH':'TPS',insc=!!t.inscrite;
  let h='<div class="card tx-carte"><span class="eyebrow acc">Mes taxes</span><p class="small">Êtes-vous inscrite aux taxes ? Sous 30 000 $ de revenus taxables sur 4 trimestres, ce n\'est pas obligatoire.</p><div class="tri" style="margin:6px 0">'+
   '<button type="button" class="chip '+(!insc?'on':'')+'" data-tx-insc="0">Non inscrite</button><button type="button" class="chip '+(insc?'on':'')+'" data-tx-insc="1">Inscrite aux taxes</button></div>';
  if(insc){h+='<p class="xs muted">Taux appliqués sur vos reçus : '+I.taux.map(([k,p])=>k+' '+pct(p)).join(' + ')+'.</p>'+
    '<label class="f">No de '+nomA+' (ex. 123456789 RT0001)<input type="text" id="txTps" inputmode="text" autocomplete="off" value="'+esc(D.tvh||'')+'" placeholder="123456789 RT0001"></label>'+
    (I.taux.some(x=>x[0]==='TVQ')?'<label class="f">No de TVQ (ex. 1234567890 TQ0001)<input type="text" id="txTvq" autocomplete="off" value="'+esc(t.tvq||'')+'" placeholder="1234567890 TQ0001"></label>':'')+
    '<p class="xs muted">Les montants que vous notez pour vos versements sont <b>avant taxes</b> : le reçu ajoute les taxes et affiche vos numéros.</p>'}
  else h+='<p class="xs muted">Vos reçus indiqueront « non inscrite aux taxes (aucune taxe perçue) ».</p>';
  return h+'</div>'}
async function sauver(patchT,tvh){const D=S.doula;const m=Object.assign({},ME_DOULA.modeles||{}),t=Object.assign({},m.taxes||{},patchT);m.taxes=t;ME_DOULA.modeles=m;if(tvh!==undefined)D.tvh=tvh;
  try{const ok=await saveDoula();if(ok===false)return false}catch(e){return false}return true}
const maj=()=>{try{const h=document.getElementById('pfTvh')||document.getElementById('doula_tvh');if(h)h.value=(S.doula||{}).tvh||''}catch(e){}};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-tx-insc]');if(!b)return;e.stopPropagation();e.preventDefault();
  const on=b.dataset.txInsc==='1';
  if(await sauver({inscrite:on},on?undefined:'')){maj();render()}},true);
document.addEventListener('change',async e=>{const i=e.target.closest('#txTps,#txTvq');if(!i)return;e.stopPropagation();const q=i.id==='txTvq';const v=i.value.trim();
  if(!v){if(await sauver(q?{tvq:''}:{},q?undefined:'')){maj();toast('Numéro retiré')}return}
  const f=q?fmtTvq(v):fmtTps(v);
  if(!f){toast(q?'Numéro de TVQ : 10 chiffres, puis TQ0001 (ex. 1234567890 TQ0001)':'Numéro de '+(info().taux.some(x=>x[0]==='TVH')?'TVH':'TPS')+' : 9 chiffres, puis RT0001 (ex. 123456789 RT0001)');return}
  i.value=f;if(await sauver(q?{tvq:f}:{},q?undefined:f)){maj();toast('Numéro enregistré')}},true);
/* le champ libre d'origine reste en place, caché, pour que l'enregistrement du profil fonctionne toujours */
const _r=render;render=function(){const x=_r.apply(this,arguments);try{if(S.role!=='doula')return x;
  const h=document.getElementById('pfTvh')||document.getElementById('doula_tvh');if(h&&!h.dataset.tx){h.dataset.tx='1';const lab=h.closest('label');if(lab)lab.style.display='none';
    const host=(lab||h).parentNode;if(host&&!host.querySelector('.tx-carte')){const t=document.createElement('template');t.innerHTML=carte();const grid=lab&&lab.closest('.grid2');(grid||lab||h).insertAdjacentElement('afterend',t.content.firstElementChild)}}
  }catch(e){}return x};
})();
