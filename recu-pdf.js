/* Sérénaissance — vrai reçu en PDF : logo, couleurs et entreprise de la doula, service, prix, mode de paiement, solde, no de TVH. Déposé dans les Documents de la famille. */
(function(){
const hexc=(P,h)=>P.rgb(parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255);
const mnt=n=>(Math.round((+n||0)*100)/100).toLocaleString('fr-CA',{minimumFractionDigits:2,maximumFractionDigits:2}).replace(/ | /g,' ')+' $';
async function recuPdf(c,p,k,corrige){await chargerScript('lib/pdf-lib.min.js');const P=window.PDFLib,I=infoDoula(),D=S.doula||{};
  if(!LOGO_BYTES&&!window.SANS_LOGO){try{const r=await fetch('img/logo-icone.png');LOGO_BYTES=new Uint8Array(await r.arrayBuffer())}catch(e){}}
  let acc=(getComputedStyle(document.documentElement).getPropertyValue('--accent')||'').trim();if(!/^#[0-9a-f]{6}$/i.test(acc))acc='#b5644d';
  const pdf=await P.PDFDocument.create();pdf.setTitle('Reçu '+(p.no||''));pdf.setCreator('Sérénaissance');
  const F=await pdf.embedFont(P.StandardFonts.Helvetica),FB=await pdf.embedFont(P.StandardFonts.HelveticaBold),TI=await pdf.embedFont(P.StandardFonts.TimesRomanItalic);
  const W=612,H=792,M=54,pg=pdf.addPage([W,H]),A=hexc(P,acc),encre=hexc(P,'#2c221e'),gris=hexc(P,'#7a6a60'),filet=hexc(P,'#e6d9d0'),clair=hexc(P,'#f7f1ec'),blanc=P.rgb(1,1,1);
  const RC=(((ME_DOULA||{}).modeles||{}).marque||{}).recu||{},mod=['classique','epure','doux'].includes(RC.modele)?RC.modele:'classique';
  const mix=(h,k)=>{const n=parseInt(h.slice(1),16),f=c=>(c+(255-c)*k)/255;return P.rgb(f((n>>16)&255),f((n>>8)&255),f(n&255))},tint=k=>mix(acc,k);
  const T=(t,x,y,s,f,col)=>pg.drawText(pdfTxt(t),{x,y,size:s,font:f,color:col||encre}),TR=(t,xr,y,s,f,col)=>T(t,xr-f.widthOfTextAtSize(pdfTxt(t),s),y,s,f,col);
  if(mod==='classique')pg.drawRectangle({x:0,y:H-8,width:W,height:8,color:A});if(mod==='doux')pg.drawRectangle({x:0,y:H-142,width:W,height:142,color:tint(.9)});if(mod==='epure')pg.drawRectangle({x:0,y:H-4,width:W,height:4,color:A});
  let logo=null;if(!window.SANS_LOGO){try{logo=await pdf.embedPng(LOGO_BYTES)}catch(e){try{logo=await pdf.embedJpg(LOGO_BYTES)}catch(x){}}}
  let x0=M;if(logo){const lh=52,lw=Math.min(120,lh*logo.width/logo.height),lh2=lw/(logo.width/logo.height);pg.drawImage(logo,{x:M,y:H-40-lh2,width:lw,height:lh2});x0=M+lw+12}
  T(I.ent||I.nom||'Sérénaissance',x0,H-58,19,TI,A);
  let y=H-74;[I.nom&&I.nom!==I.ent?I.nom:'',[D.adresse,D.region].filter(Boolean).join(', '),[I.tel,I.courriel].filter(Boolean).join(' · ')].filter(Boolean).forEach(l=>{T(l,x0,y,9,F,gris);y-=12});
  if(mod==='doux')TR(RC.titre||'Reçu',W-M,H-64,30,TI,A);else if(mod==='epure')TR(RC.titre||'REÇU',W-M,H-60,20,FB,A);else TR(RC.titre||'REÇU',W-M,H-62,28,FB,A);TR('No '+(p.no||('R-'+k)),W-M,H-80,10,FB);TR(fmtD(parseD(p.date)),W-M,H-94,10,F,gris);if(corrige)TR('REÇU CORRIGÉ',W-M,H-108,9,FB,A);
  y=H-150;if(mod!=='doux')pg.drawLine({start:{x:M,y},end:{x:W-M,y},thickness:mod==='epure'?1.2:.8,color:mod==='epure'?A:filet});
  y-=26;T('REÇU DE',M,y,8,FB,gris);y-=16;T(cName(c)+(c.partenaire?' et '+c.partenaire:''),M,y,13,FB);if(c.courriel){y-=14;T(c.courriel,M,y,9.5,F,gris)}
  y-=44;const th=mod==='classique'?blanc:A;if(mod==='classique')pg.drawRectangle({x:M,y:y-8,width:W-2*M,height:26,color:A});else if(mod==='doux')pg.drawRectangle({x:M,y:y-8,width:W-2*M,height:26,color:tint(.85)});else pg.drawLine({start:{x:M,y:y-8},end:{x:W-M,y:y-8},thickness:.8,color:A});
  T('DESCRIPTION',M+10,y+1,9,FB,th);TR('MONTANT',W-M-10,y+1,9,FB,th);
  y-=36;const n=(c.paie||[]).length;T('Accompagnement : forfait '+(c.forfait||'doula'),M+10,y,11.5,FB);TR(mnt(p.montant),W-M-10,y,11.5,FB);
  y-=15;T('Versement no '+k+' · '+fmtD(parseD(p.date)),M+10,y,9.5,F,gris);y-=14;pg.drawLine({start:{x:M,y},end:{x:W-M,y},thickness:.6,color:filet});
  const prix=cPrice(c),paye=(c.paie||[]).slice(0,k).reduce((s,x)=>s+(+x.montant||0),0),solde=Math.max(0,prix-paye);
  y-=30;const bx=W-M-240;if(mod==='classique')pg.drawRectangle({x:bx,y:y-62,width:240,height:80,color:clair});else if(mod==='doux')pg.drawRectangle({x:bx,y:y-62,width:240,height:80,color:tint(.9)});else pg.drawLine({start:{x:bx,y:y-41},end:{x:W-M,y:y-41},thickness:.8,color:A});
  const ligne=(l,v,yy,b)=>{T(l,bx+12,yy,b?11:9.5,b?FB:F,b?encre:gris);TR(v,W-M-12,yy,b?13:9.5,b?FB:F,b?A:encre)};
  const VT=window.taxesVentiler?window.taxesVentiler(p.montant):{inscrite:false,total:+p.montant,avant:+p.montant,lignes:[]};ligne('Prix du forfait'+(VT.inscrite?' (taxes incluses)':''),mnt(prix),y,false);ligne('Total payé à ce jour',mnt(paye),y-16,false);ligne('Solde restant',mnt(solde),y-32,false);ligne('Montant reçu'+(VT.inscrite?' (taxes incl.)':''),mnt(VT.total),y-54,true);
  T('Mode de paiement',M,y,8,FB,gris);T(p.mode||'—',M,y-14,11,F);
  T('TAXES',M,y-40,8,FB,gris);if(VT.inscrite){let yy=y-54;T('Montant avant taxes : '+mnt(VT.avant),M,yy,9.5,F);VT.lignes.forEach(l=>{yy-=13;T(l.k+' ('+String(l.p).replace('.',',')+' %) : '+mnt(l.montant)+(l.no?'  ·  No '+l.no:''),M,yy,9.5,F)})}else T(window.taxesTexte?window.taxesTexte():'Non inscrite aux taxes (aucune taxe perçue)',M,y-54,10,F);
  y-=120;T(RC.merci||'Merci de votre confiance',M,y,13,TI,A);y-=16;String(RC.note||'Ce reçu confirme la réception du paiement ci-dessus. Conservez-le pour vos dossiers.').split('\n').slice(0,6).forEach(l=>{T(l,M,y,9,F,gris);y-=12});
  pg.drawLine({start:{x:M,y:50},end:{x:W-M,y:50},thickness:.5,color:filet});T([I.ent,I.nom,I.tel,I.courriel].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(' · '),M,36,8,F,gris);
  return await pdf.save()}
function b64(u8){let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s)}
window.recuPdf=recuPdf;
window.deposerRecu=async function(c,p,k,corrige){try{const u8=await recuPdf(c,p,k,corrige),nom='Recu-'+String(p.no||k).replace(/[^\w-]/g,'')+'.pdf',titre='Reçu '+(p.no||k)+(corrige?' (corrigé)':'');
    const {error}=await sb.from('fam_documents').insert({famille_id:c.id,type:'autre',titre,contenu:'@fichier '+nom+'|data:application/pdf;base64,'+b64(u8),champs:[],sig_parent_requise:false,sig_doula_requise:false,statut:'signe'});if(error)throw error;
    await sb.from('fam_messages').insert({famille_id:c.id,de_doula:true,type:'document',texte:'🧾 '+(corrige?'Reçu corrigé':'Reçu')+' no '+(p.no||k)+' · '+mnt(p.montant)+'. Vous le trouvez dans Ma doula › Documents (PDF à télécharger).'});return true}
  catch(e){try{await sb.from('fam_messages').insert({famille_id:c.id,de_doula:true,type:'document',texte:(corrige?'REÇU CORRIGÉ\n':'')+recuTexte(c,p,k)})}catch(x){}return false}};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act="recu"],[data-act="recuPdfDepot"],[data-act="recuPdfDl"]');if(!b)return;e.stopPropagation();e.preventDefault();
  const c=(S.clients||[]).find(x=>x.id===(b.dataset.id||S.openClient));if(!c)return;
  if(b.dataset.act==='recu'){const p=c.paie.find(x=>x.id===b.dataset.r);if(!p)return;window._recuC=[c.id,p.id];
    sheet('Reçu','<p class="small">Reçu PDF avec votre logo, vos couleurs et le détail du service.</p><div class="stack" style="gap:8px"><button class="btn" data-act="recuPdfDl" data-id="'+c.id+'">'+icon('fa-file-pdf')+'Enregistrer ou partager le PDF</button><button class="btn ghost" data-act="recuPdfDepot" data-id="'+c.id+'">'+icon('fa-paper-plane')+'Déposer dans l\'appli de la famille</button></div>');return}
  const p=c.paie.find(x=>x.id===(window._recuC||[])[1]);if(!p)return;const k=c.paie.indexOf(p)+1;b.disabled=true;
  try{if(b.dataset.act==='recuPdfDl'){const u8=await recuPdf(c,p,k),blob=new Blob([u8],{type:'application/pdf'}),nom='Recu-'+String(p.no||k).replace(/[^\w-]/g,'')+'.pdf';let f=null;try{f=new File([blob],nom,{type:'application/pdf'})}catch(x){}
      if(f&&navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:nom}).catch(err=>{if(err&&err.name!=='AbortError')telecharger(blob,nom)});else telecharger(blob,nom)}
    else{const ok=await deposerRecu(c,p,k,false);$('#layer').innerHTML='';await chargerClientDetail(c.id);render();toast(ok?'Reçu PDF déposé dans l\'appli de la famille':'Reçu déposé (en texte)')}}catch(x){toast('Reçu impossible : '+(x&&x.message||x))}b.disabled=false},true);
})();
