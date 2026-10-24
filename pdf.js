/* Sérénaissance — documents en PDF, dans le style de la trousse (bande dégradée, marque en italique,
   titres de section espacés en terracotta, lignes à remplir, bloc de signatures, pied de page).
   Construit dans le téléphone avec pdf-lib (licence MIT, dans lib/). Le PDF est préparé dès l'ouverture
   du document, pour que le bouton « Partager » réponde tout de suite (l'iPhone l'exige).
   Plusieurs documents (une pochette) peuvent former un seul PDF, la lettre en premier. */
const PDF_CACHE={};let LOGO_BYTES=null;
function chargerScript(src){return new Promise((ok,ko)=>{if(window.PDFLib)return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=ko;document.head.appendChild(s)})}
function pdfTxt(t){return String(t??'').replace(/[   \t]/g,' ').replace(/[☑✅]/g,'[x]').replace(/☐/g,'[ ]').replace(/[‐‑]/g,'-').replace(/[^\x20-\x7e\xa1-\xff–—‘’“”…•€Œœ]/g,'')}
function octets(dataUrl){const b=atob(dataUrl.split(',')[1]);const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
const CATEGORIE={contrat:'CONTRATS ET CONSENTEMENTS',consentement:'CONTRATS ET CONSENTEMENTS',photos:'CONTRATS ET CONSENTEMENTS',accueil:'DOSSIER CLIENT',satisfaction:'OUTILS POUR LES PARENTS',merci:'ACCOMPAGNEMENT DE LA NAISSANCE',forfaits:'ACCOMPAGNEMENT DE LA NAISSANCE',fin:'ACCOMPAGNEMENT DE LA NAISSANCE'};
function infoDoula(){if(S.role==='parent'&&DOULA)return {ent:DOULA.entreprise||[DOULA.prenom,DOULA.nom].filter(Boolean).join(' '),nom:[DOULA.prenom,DOULA.nom].filter(Boolean).join(' '),tel:DOULA.telephone||'',courriel:DOULA.courriel||''};
  const D=S.doula||{};return {ent:D.entreprise||D.nom||'',nom:D.nom||'',tel:D.tel||'',courriel:D.courriel||''}}
async function construirePDF(liste){const {PDFDocument,StandardFonts,rgb}=window.PDFLib;liste=Array.isArray(liste)?liste:[liste];
  const pdf=await PDFDocument.create();pdf.setTitle(pdfTxt(liste[0].lot_titre&&liste.length>1?liste[0].lot_titre:liste[0].titre));pdf.setCreator('Sérénaissance');
  const F=await pdf.embedFont(StandardFonts.Helvetica),FB=await pdf.embedFont(StandardFonts.HelveticaBold),T=await pdf.embedFont(StandardFonts.TimesRoman),TI=await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const W=612,H=792,M=54,L=W-2*M;const hex=h=>rgb(parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255);
  const brun=hex('#3d312b'),encre=hex('#2c221e'),terra=hex((()=>{const v=window.MARQUE_ON?getComputedStyle(document.documentElement).getPropertyValue('--accent').trim():'';return /^#[0-9a-f]{6}$/i.test(v)?v:'#b5644d'})()),gris=hex('#8a7a70'),filet=hex('#e6d2c6'),ligne=hex('#d9a08a'),sauge=hex('#7f9a78');
  const I=infoDoula();let logo=null;if(LOGO_BYTES)try{logo=await pdf.embedPng(LOGO_BYTES)}catch(e){}
  let acad=null;if(window.MARQUE_ON){try{if(!window.ACAD_BYTES)window.ACAD_BYTES=new Uint8Array(await (await fetch('img/logo-icone.png')).arrayBuffer());acad=await pdf.embedPng(window.ACAD_BYTES)}catch(e){}}
  const espace=(t,x,y,s,f,c,sp)=>{let xx=x;for(const ch of pdfTxt(t)){pg.drawText(ch,{x:xx,y,size:s,font:f,color:c});xx+=f.widthOfTextAtSize(ch,s)+sp}return xx};
  const largEsp=(t,s,f,sp)=>[...pdfTxt(t)].reduce((a,ch)=>a+f.widthOfTextAtSize(ch,s)+sp,0);
  const coupe=(t,f,s,w)=>{const out=[];String(t).split(/\n/).forEach(par=>{let l='';par.split(' ').forEach(m=>{const e=l?l+' '+m:m;if(f.widthOfTextAtSize(e,s)<=w)l=e;else{if(l)out.push(l);l=m;while(f.widthOfTextAtSize(l,s)>w){let k=l.length;while(k>1&&f.widthOfTextAtSize(l.slice(0,k),s)>w)k--;out.push(l.slice(0,k));l=l.slice(k)}}});out.push(l)});return out};
  let pg,y;const pages=[];
  const nouvellePage=(di)=>{pg=pdf.addPage([W,H]);pages.push({pg,di});
    const a=[233,184,166],b=[181,113,92],c=[143,165,138];for(let i=0;i<120;i++){const t=i/119,u=t<.5?t*2:(t-.5)*2,A=t<.5?a:b,B=t<.5?b:c;pg.drawRectangle({x:i*W/120,y:H-7,width:W/120+1,height:7,color:rgb((A[0]+(B[0]-A[0])*u)/255,(A[1]+(B[1]-A[1])*u)/255,(A[2]+(B[2]-A[2])*u)/255)})}
    let lwx=0;if(logo){const lh=30,lw=Math.min(110,lh*logo.width/logo.height),lh2=lw/(logo.width/logo.height);lwx=lw;pg.drawImage(logo,{x:M,y:H-66+(lh-lh2)/2,width:lw,height:lh2})}
    pg.drawText(pdfTxt(I.ent||'Sérénaissance'),{x:M+(logo?lwx+12:0),y:H-58,size:16,font:TI,color:terra});
    const cat=CATEGORIE[liste[di].type]||'DOCUMENTS';pg.drawText('',{x:0,y:0,size:1,font:F});const lc=largEsp(cat,6.5,F,1.4);espace(cat,W-M-lc,H-56,6.5,F,gris,1.4);
    pg.drawLine({start:{x:M,y:H-72},end:{x:W-M,y:H-72},thickness:.6,color:filet});
    y=H-126;
    const pied=pdfTxt([I.ent,I.nom,I.tel,I.courriel].filter(Boolean).join(' · '));pg.drawLine({start:{x:M,y:50},end:{x:W-M,y:50},thickness:.5,color:filet});
    pg.drawText(pied,{x:M,y:38,size:7,font:F,color:gris});
    if(acad){const ah=15,aw=ah*acad.width/acad.height,tx="Modèle de l'Académie Sérénaissance",tw=F.widthOfTextAtSize(pdfTxt(tx),6.5);pg.drawImage(acad,{x:W-M-aw,y:30,width:aw,height:ah});pg.drawText(pdfTxt(tx),{x:W-M-aw-4-tw,y:35,size:6.5,font:F,color:gris})}};
  const place=h=>{if(y-h<66)nouvellePage(pages[pages.length-1].di)};
  const para=(t,o={})=>{const f=o.f||F,s=o.s||9.5,lh=s*1.5;coupe(pdfTxt(t),f,s,o.w||L).forEach(l=>{place(lh);y-=lh;pg.drawText(l,{x:o.x||M,y:y+3,size:s,font:f,color:o.c||brun})});y-=(o.apres??3)};
  const section=t=>{y-=10;place(30);y-=12;espace(String(t).toUpperCase(),M,y,8,FB,terra,1.3);y-=7;pg.drawLine({start:{x:M,y},end:{x:W-M,y},thickness:.5,color:filet});y-=6};
  const champ=(lbl,val)=>{const s=9,lw=Math.min(F.widthOfTextAtSize(pdfTxt(lbl),s)+10,L*.5);const vl=coupe(pdfTxt(val||''),F,s,L-lw-4);
    vl.forEach((l,k)=>{place(20);y-=18;if(k===0)pg.drawText(pdfTxt(lbl),{x:M,y:y+2,size:s,font:F,color:gris});pg.drawText(l,{x:M+lw,y:y+3,size:s,font:F,color:encre});pg.drawLine({start:{x:M+lw,y:y},end:{x:W-M,y:y},thickness:.6,color:ligne})})};
  for(let di=0;di<liste.length;di++){const d=liste[di];nouvellePage(di);
    (window.memoPlat&&/^@memo /.test(d.contenu||'')?memoPlat(d):window.fidPlat&&/^@page /m.test(d.contenu||'')?fidPlat(d):String(d.contenu||'')).split(/\n/).forEach(l=>{if(l.startsWith('## '))section(l.slice(3));else if(l.trim())para(l);else y-=5});
    const R=d.reponses||{},C=d.champs||[];
    if(C.length){y-=4;C.forEach(c=>{if(c.g){section(c.g);return}const v=R[c.k];
      if(c.type==='case'){place(16);y-=15;pg.drawRectangle({x:M,y:y+1,width:8,height:8,borderColor:terra,borderWidth:.8});if(v)pg.drawText('x',{x:M+1.6,y:y+2.2,size:8,font:FB,color:terra});coupe(pdfTxt(c.t),F,9,L-16).forEach((l,k)=>{if(k){place(13);y-=13}pg.drawText(l,{x:M+14,y:y+2,size:9,font:F,color:brun})})}
      else champ(c.t,v)})}
    const sigs=[[d.signature_doula,'Doula'],[d.signature_parent,'Parent']].filter(x=>x[0]);
    if(d.sig_parent_requise||d.sig_doula_requise||sigs.length){section('Signatures');
      const rangs=[];if(d.sig_doula_requise||d.signature_doula)rangs.push([d.signature_doula,'Doula']);if(d.sig_parent_requise||d.signature_parent)rangs.push([d.signature_parent,'Parent']);
      for(const [s,qui] of rangs){place(62);y-=52;const c1=M,c2=M+L*.42,c3=M+L*.8;
        if(s){try{const im=await pdf.embedPng(octets(s.image));const h=40,w=Math.min(L*.34,h*im.width/im.height);pg.drawImage(im,{x:c2,y:y+2,width:w,height:h})}catch(e){}
          pg.drawText(pdfTxt(s.nom),{x:c1,y:y+4,size:9.5,font:F,color:encre});pg.drawText(pdfTxt(fmtD(new Date(s.le))),{x:c3,y:y+4,size:9,font:F,color:encre})}
        [[c1,c2-14],[c2,c3-14],[c3,W-M]].forEach(([a,b])=>pg.drawLine({start:{x:a,y},end:{x:b,y},thickness:.7,color:ligne}));
        pg.drawText(pdfTxt('Nom en lettres moulées : '+qui),{x:c1,y:y-10,size:7,font:F,color:gris});pg.drawText('Signature',{x:c2,y:y-10,size:7,font:F,color:gris});pg.drawText('Date',{x:c3,y:y-10,size:7,font:F,color:gris})}}}
  const parDoc={};pages.forEach(p=>(parDoc[p.di]=parDoc[p.di]||[]).push(p.pg));
  Object.entries(parDoc).forEach(([di,L2])=>{const d=liste[di];L2.forEach((p,k)=>{const tl=coupe(pdfTxt(d.titre),T,22,L-90);p.drawText(tl[0],{x:M,y:H-106,size:22,font:T,color:encre});
    const pt=pdfTxt('Page '+(k+1)+' de '+L2.length);p.drawText(pt,{x:W-M-F.widthOfTextAtSize(pt,7.5),y:H-104,size:7.5,font:F,color:sauge})})});
  return new Blob([await pdf.save()],{type:'application/pdf'})}
function cleDoc(d){const L=Array.isArray(d)?d:[d];return L.map(x=>x.id+'|'+x.statut+'|'+(x.contenu||'').length).join(',')}
async function preparerPDF(d){try{await chargerScript('lib/pdf-lib.min.js');
  if(!LOGO_BYTES){const r=await fetch('img/logo-icone.png');LOGO_BYTES=new Uint8Array(await r.arrayBuffer())}
  if(d&&!PDF_CACHE[cleDoc(d)])PDF_CACHE[cleDoc(d)]=await construirePDF(d)}catch(e){console.error(e)}}
function nomFichier(d){const t=Array.isArray(d)?(d[0].lot_titre||d[0].titre):d.titre;return pdfTxt(t).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^\w]+/g,'-').replace(/^-|-$/g,'').toLowerCase()+'.pdf'}
function partagerPDF(d){const blob=PDF_CACHE[cleDoc(d)];if(!blob){toast('Le PDF se prépare… touchez encore dans une seconde');preparerPDF(d);return}
  const nom=nomFichier(d);let f=null;try{f=new File([blob],nom,{type:'application/pdf'})}catch(e){}
  if(f&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:nom}).catch(err=>{if(err&&err.name!=='AbortError')telecharger(blob,nom)});return}
  telecharger(blob,nom)}
function telecharger(blob,nom){const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=nom;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(u)},4000);toast('PDF enregistré')}
