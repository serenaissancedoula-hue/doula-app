/* Sérénaissance — documents en PDF (contrats, formulaires, lettres).
   Un vrai fichier PDF construit dans le téléphone (bibliothèque pdf-lib, licence MIT, dans lib/) :
   on peut l'enregistrer, l'imprimer ou l'envoyer. Le PDF est préparé dès l'ouverture du document,
   pour que le bouton « Partager » réponde tout de suite (l'iPhone l'exige). */
const PDF_CACHE={};let LOGO_BYTES=null;
function chargerScript(src){return new Promise((ok,ko)=>{if(document.querySelector('script[src="'+src+'"]')&&window.PDFLib)return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=ko;document.head.appendChild(s)})}
/* Les polices standard du PDF ne connaissent que l'alphabet latin : on remplace le reste. */
function pdfTxt(t){return String(t??'').replace(/[   \t]/g,' ').replace(/[☑✅]/g,'[x]').replace(/☐/g,'[ ]').replace(/[‐‑]/g,'-').replace(/[^\x20-\x7e\xa1-\xff–—‘’“”…•€Œœ]/g,'')}
function octets(dataUrl){const b=atob(dataUrl.split(',')[1]);const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
async function construirePDF(d){const {PDFDocument,StandardFonts,rgb}=window.PDFLib;
  const pdf=await PDFDocument.create();pdf.setTitle(pdfTxt(d.titre));pdf.setCreator('Sérénaissance');
  const F=await pdf.embedFont(StandardFonts.Helvetica),FB=await pdf.embedFont(StandardFonts.HelveticaBold);
  const W=612,H=792,M=54,L=W-2*M;let pg=pdf.addPage([W,H]),y=H-M;
  const brun=rgb(.17,.13,.12),terra=rgb(.66,.34,.26),gris=rgb(.48,.41,.37);
  const coupe=(t,f,s,w)=>{const out=[];String(t).split(/\n/).forEach(par=>{let l='';par.split(' ').forEach(m=>{const essai=l?l+' '+m:m;if(f.widthOfTextAtSize(essai,s)<=w)l=essai;else{if(l)out.push(l);l=m;while(f.widthOfTextAtSize(l,s)>w){let k=l.length;while(k>1&&f.widthOfTextAtSize(l.slice(0,k),s)>w)k--;out.push(l.slice(0,k));l=l.slice(k)}}});out.push(l)});return out};
  const place=h=>{if(y-h<M+24){pg=pdf.addPage([W,H]);y=H-M}};
  const para=(t,o={})=>{const f=o.b?FB:F,s=o.s||10.5,lh=s*1.42;coupe(pdfTxt(t),f,s,o.w||L).forEach(l=>{place(lh);y-=lh;pg.drawText(l,{x:o.x||M,y:y+3,size:s,font:f,color:o.c||brun})});y-=(o.apres??4)};
  if(LOGO_BYTES){try{const im=await pdf.embedPng(LOGO_BYTES);const lw=130,lh=lw*im.height/im.width;pg.drawImage(im,{x:W-M-lw,y:y-lh+6,width:lw,height:lh})}catch(e){}}
  para(d.titre,{b:1,s:17,w:L-150,apres:8});
  pg.drawLine({start:{x:M,y},end:{x:W-M,y},thickness:1.2,color:terra});y-=16;
  String(d.contenu||'').split(/\n/).forEach(l=>{if(l.startsWith('## ')){y-=6;para(l.slice(3),{b:1,s:12,c:terra,apres:2})}else if(l.trim())para(l);else y-=4});
  const R=d.reponses||{},C=d.champs||[];
  if(C.length){y-=8;C.forEach(c=>{if(c.g){y-=4;para(c.g,{b:1,s:11.5,c:terra,apres:2});return}const v=R[c.k];para(c.type==='case'?(v?'[x] ':'[ ] ')+c.t:c.t+' : '+(v||'—'))})}
  const sigs=[[d.signature_parent,'Parent'],[d.signature_doula,'Doula']].filter(x=>x[0]);
  if(sigs.length){y-=14;place(120);for(let i=0;i<sigs.length;i++){const [s,qui]=sigs[i],x=M+i*(L/2+6);
    try{const im=await pdf.embedPng(octets(s.image));pg.drawImage(im,{x,y:y-62,width:200,height:60})}catch(e){}
    pg.drawLine({start:{x,y:y-64},end:{x:x+220,y:y-64},thickness:.6,color:gris});
    coupe(pdfTxt(s.nom+' · '+qui+' · signé le '+fmtD(new Date(s.le))+' à '+hm(new Date(s.le).getTime())),F,8.5,225).forEach((l,k)=>pg.drawText(l,{x,y:y-76-k*11,size:8.5,font:F,color:gris}))}
    y-=110}
  const P=pdf.getPages();P.forEach((p,i)=>{p.drawText(pdfTxt(d.titre+' · page '+(i+1)+' de '+P.length),{x:M,y:28,size:8,font:F,color:gris});const t='Sérénaissance';p.drawText(pdfTxt(t),{x:W-M-F.widthOfTextAtSize(pdfTxt(t),8),y:28,size:8,font:F,color:gris})});
  return new Blob([await pdf.save()],{type:'application/pdf'})}
function cleDoc(d){return d.id+'|'+d.statut+'|'+(d.contenu||'').length}
async function preparerPDF(d){try{await chargerScript('lib/pdf-lib.min.js');
  if(!LOGO_BYTES){const r=await fetch('logo.png');LOGO_BYTES=new Uint8Array(await r.arrayBuffer())}
  if(d&&!PDF_CACHE[cleDoc(d)])PDF_CACHE[cleDoc(d)]=await construirePDF(d)}catch(e){console.error(e)}}
function nomFichier(d){return pdfTxt(d.titre).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^\w]+/g,'-').replace(/^-|-$/g,'').toLowerCase()+'.pdf'}
/* Appelé directement au toucher du bouton. */
function partagerPDF(d){const blob=PDF_CACHE[cleDoc(d)];if(!blob){toast('Le PDF se prépare… touchez encore dans une seconde');preparerPDF(d);return}
  const nom=nomFichier(d);let f=null;try{f=new File([blob],nom,{type:'application/pdf'})}catch(e){}
  if(f&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:d.titre}).catch(err=>{if(err&&err.name!=='AbortError')telecharger(blob,nom)});return}
  telecharger(blob,nom)}
function telecharger(blob,nom){const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=nom;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(u)},4000);toast('PDF enregistré')}
