/* Sérénaissance — sauvegarde des photos (famille) : un fichier .zip à garder (téléphone, courriel, nuage). Les photos restent d'abord sur l'appareil. */
(function(){
if(window.ESPACE!=='parent')return;
const CLE='srn_photos_sauv';
let T=null;const crc=b=>{if(!T){T=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;T[n]=c>>>0}}let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=T[(c^b[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0};
const u16=n=>[n&255,n>>8&255],u32=n=>[n&255,n>>8&255,n>>16&255,n>>>24&255];
function zip(files){const enc=new TextEncoder(),parts=[],cen=[];let off=0;
  files.forEach(f=>{const nm=enc.encode(f.name),c=crc(f.data),d=new Date(),dt=((d.getFullYear()-1980)<<9|(d.getMonth()+1)<<5|d.getDate()),tm=(d.getHours()<<11|d.getMinutes()<<5|d.getSeconds()>>1);
    const lh=new Uint8Array([0x50,0x4b,3,4,20,0,0,8,0,0,...u16(tm),...u16(dt),...u32(c),...u32(f.data.length),...u32(f.data.length),...u16(nm.length),0,0]);
    parts.push(lh,nm,f.data);
    cen.push(new Uint8Array([0x50,0x4b,1,2,20,0,20,0,0,8,0,0,...u16(tm),...u16(dt),...u32(c),...u32(f.data.length),...u32(f.data.length),...u16(nm.length),0,0,0,0,0,0,0,0,0,0,0,0,...u32(off)]),nm);
    off+=lh.length+nm.length+f.data.length});
  const cs=cen.reduce((a,b)=>a+b.length,0);
  const end=new Uint8Array([0x50,0x4b,5,6,0,0,0,0,...u16(files.length),...u16(files.length),...u32(cs),...u32(off),0,0]);
  return new Blob([...parts,...cen,end],{type:'application/zip'})}
function octets(src){const m=/^data:([^;]+);base64,(.*)$/.exec(src||'');if(!m)return null;const b=atob(m[2]),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return {u,ext:/png/.test(m[1])?'png':'jpg'}}
async function sauver(){const P=await allPhotos();if(!P.length){toast('Aucune photo à sauvegarder');return}
  const files=[];let lg='Légendes de mes photos\n\n';P.slice().reverse().forEach((p,i)=>{const o=octets(p.src);if(!o)return;const dt=new Date(p.t||Date.now()),nm='photo-'+String(i+1).padStart(3,'0')+'-'+iso(dt)+'.'+o.ext;files.push({name:nm,data:o.u});if(p.cap)lg+=nm+' : '+p.cap+'\n'});
  if(lg.length>30)files.push({name:'legendes.txt',data:new TextEncoder().encode(lg)});
  const blob=zip(files),nom='mes-photos-serenaissance.zip';let f=null;try{f=new File([blob],nom,{type:'application/zip'})}catch(e){}
  try{localStorage.setItem(CLE,String(Date.now()))}catch(e){}
  if(f&&navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:nom});toast('Sauvegarde prête');return}catch(e){if(e&&e.name==='AbortError')return}}
  const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=nom;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(u)},4000);toast('Sauvegarde enregistrée')}
window.sauverPhotos=sauver;
const _ps=pSouvenirs;pSouvenirs=function(){let h=_ps.apply(this,arguments);try{if(!S.sub||!SSUB[S.sub]){
  const vieux=(()=>{try{const t=+localStorage.getItem(CLE)||0;return !t||Date.now()-t>30*864e5}catch(e){return true}})();
  h=h.replace('<p class="xs muted">Les photos restent sur cet appareil.</p>','<p class="xs muted">Les photos restent sur cet appareil : si vous changez de téléphone, elles seraient perdues.</p>'+(vieux&&(photosCache||[]).length?'<div class="banner gold">'+icon('fa-triangle-exclamation')+'<div class="small">Pensez à sauvegarder vos photos.</div></div>':'')+'<button class="btn sm ghost" data-act="photosSauver">'+icon('fa-download')+'Sauvegarder mes photos (fichier .zip)</button>')}}catch(e){}return h};
document.addEventListener('click',e=>{if(!e.target.closest('[data-act="photosSauver"]'))return;e.stopPropagation();e.preventDefault();sauver()},true);
})();
