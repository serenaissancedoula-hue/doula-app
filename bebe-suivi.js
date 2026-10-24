/* Sérénaissance — Suivi de bébé (famille) : en-tête illustré, étapes selon l'âge, vaccins (calendrier du N.-B.), symptômes, sans doublons. */
(function(){
if(window.ESPACE!=='parent')return;
const U2='https://www.unicef.org/parenting/fr/developpement-enfant/les-grandes-etapes-du-developpement-de-votre-bebe-2-mois',
 U4='https://www.unicef.org/parenting/fr/developpement-enfant/les-grandes-etapes-du-developpement-de-votre-bebe-4-mois',
 U6='https://www.unicef.org/parenting/fr/developpement-enfant/les-grandes-etapes-du-developpement-de-votre-bebe-6-mois',
 NB='https://www.gnb.ca/fr/sujet/sante-mieux-etre/immunisation-vaccination/calendrier-immunisation.html',
 BC='https://healthlinkbc.ca/sites/default/files/documents/french_bccdc-immunization-aftercare-infants-young-children.pdf';
const lien=(t,u)=>'<a href="'+u+'" target="_blank" rel="noopener noreferrer">'+t+'</a>';
const PER=[
 {max:60,t:'De la naissance à 2 mois',ic:'🌙',ph:['Se calme en portant sa main à sa bouche','Premiers sourires, regarde ses parents','Tourne la tête vers les bruits, commence à gazouiller','Suit des yeux les visages et les objets','Sur le ventre, relève la tête et s\'appuie sur ses bras','Montre sa faim 8 à 12 fois par jour'],
  tips:['Peau à peau et câlins tant que vous voulez : on ne gâte pas un nouveau-né.','Parlez-lui, chantez, laissez-le vous regarder de près (20 à 30 cm).','Quelques minutes sur le ventre, éveillé et surveillé, plusieurs fois par jour.'],
  watch:['Il a du mal à téter ou recrache beaucoup','Il ne sourit pas, ne porte pas ses mains à sa bouche','Il ne réagit pas aux bruits forts, ne suit pas du regard','Il ne parvient pas à soulever la tête sur le ventre'],src:[['UNICEF : étapes à 2 mois',U2]]},
 {max:120,t:'De 2 à 4 mois',ic:'☀️',ph:['Sourit spontanément et imite vos expressions','Gazouille, babille, ses pleurs varient (faim, douleur, fatigue)','Tient sa tête seul, se redresse sur les avant-bras','Porte ses mains à sa bouche, tente d\'attraper les jouets','Pousse sur ses jambes sur une surface ferme','Peut commencer à se retourner'],
  tips:['Jouez face à face : grimaces, sons, comptines, miroir.','Offrez un hochet léger à saisir et à secouer.','Gardez une routine douce (bain, boire, berceuse) sans horaire strict.'],
  watch:['Il ne sourit pas aux personnes','Il ne tient pas sa tête de façon stable','Il ne gazouille pas, n\'émet aucun son','Il a du mal à bouger les yeux dans une direction','Il ne pousse pas sur ses jambes'],src:[['UNICEF : étapes à 4 mois',U4],['UNICEF : étapes à 2 mois',U2]]},
 {max:9999,t:'De 4 à 6 mois',ic:'🎈',ph:['Reconnaît son prénom, répète des voyelles','Distingue les proches des inconnus, rit','Passe un objet d\'une main à l\'autre','Roule dans plusieurs directions','Commence à tenir assis avec un peu d\'aide, puis sans','Intéressé par la nourriture : vers 6 mois, le lait seul ne suffit plus'],
  tips:['Laissez-le explorer au sol sur un tapis, avec des objets sûrs et propres.','Parlez de ce que vous faites : il répond par des sons.','Vers 6 mois, parlez à votre professionnel de l\'introduction des aliments solides (purées d\'un seul ingrédient, riches en fer).'],
  watch:['Il ne montre pas d\'affection à ses proches','Il ne réagit pas aux bruits, ne rit pas, ne gazouille pas','Il paraît trop mou ou trop raide','Il ne se retourne pas, n\'essaie pas d\'attraper les objets'],src:[['UNICEF : étapes à 6 mois',U6],['UNICEF : étapes à 4 mois',U4]]}];
const VAC=[['n','À la naissance',0,'Hépatite B · VRS (avant ou pendant la saison du VRS)'],
 ['2m','2 mois',2,'Hépatite B · DCaT-VPI-Hib · pneumocoque · rotavirus'],
 ['4m','4 mois',4,'DCaT-VPI-Hib · pneumocoque · rotavirus'],
 ['6m','6 mois',6,'Hépatite B · DCaT-VPI-Hib · rotavirus · grippe annuelle dès 6 mois'],
 ['12m','12 mois',12,'RROV (rougeole, rubéole, oreillons, varicelle) · méningocoque · pneumocoque'],
 ['18m','18 mois',18,'DCaT-VPI-Hib · RROV']];
const SYMP=['Fièvre','Rougeur ou enflure à l\'injection','Irritabilité, pleurs','Perte d\'appétit','Somnolence','Vomissements','Diarrhée','Éruption','Congestion, toux','Autre'];
function art(i){const c=['#c9d8e8','#f6d9a8','#d6e4d2'][i],a='var(--accent)';
  const sc=i===0?'<circle cx="300" cy="38" r="20" fill="#fff8e6"/><circle cx="309" cy="33" r="18" fill="'+c+'"/><g fill="#fff8e6"><circle cx="230" cy="26" r="2.5"/><circle cx="262" cy="60" r="2"/><circle cx="340" cy="78" r="2.5"/><circle cx="196" cy="62" r="2"/></g>'
   :i===1?'<circle cx="310" cy="42" r="22" fill="#fff3c4"/><g stroke="#fff3c4" stroke-width="3" stroke-linecap="round"><path d="M310 8v8M310 68v8M276 42h8M336 42h8"/></g><ellipse cx="230" cy="70" rx="34" ry="12" fill="#fff"/><ellipse cx="252" cy="60" rx="22" ry="12" fill="#fff"/>'
   :'<path d="M200 80a60 60 0 0 1 120 0" fill="none" stroke="#e8b4a0" stroke-width="7"/><path d="M212 80a48 48 0 0 1 96 0" fill="none" stroke="#f6d9a8" stroke-width="7"/><path d="M224 80a36 36 0 0 1 72 0" fill="none" stroke="#b8d0b0" stroke-width="7"/><ellipse cx="330" cy="30" rx="26" ry="11" fill="#fff"/>';
  return '<svg viewBox="0 0 380 100" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true"><rect width="380" height="100" fill="'+c+'"/>'+sc+'<path d="M0 100V84c60-16 120 6 190-4s130 8 190-6v26z" fill="rgba(255,255,255,.55)"/></svg>'}
function per(day){return day<=60?0:day<=120?1:2}
function hero(st){const p=S.parent.naissance,nom=esc(p.prenomBebe||'Bébé'),d=st.day,sem=Math.floor(d/7),j=d%7,i=per(d);
  return '<div class="card" style="position:relative;overflow:hidden;padding:0;min-height:150px"><div style="position:relative;height:104px">'+art(i)+'</div><div style="padding:14px 18px 18px"><span class="eyebrow acc">'+PER[i].t+'</span><h2 style="margin:2px 0">'+nom+' a '+(d<14?d+' jour'+(d>1?'s':''):sem+' semaine'+(sem>1?'s':'')+(j&&d>=14?' et '+j+' jour'+(j>1?'s':''):''))+'</h2><p class="small muted">Jour '+d+' · né(e) le '+fmtD(st.birth)+'</p></div></div>'}
function etapes(st){const cur=per(st.day);
  return '<div class="card"><span class="eyebrow acc">Ce que bébé apprend, selon son âge</span><p class="xs muted" style="margin:2px 0 8px">Chaque bébé va à son rythme : ce sont des repères, pas des examens.</p>'+PER.map((x,i)=>'<details class="acc"><summary><span style="font-size:1.2rem">'+x.ic+'</span> '+x.t+(i===cur?' <span class="pill acc">maintenant</span>':'')+'<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body"><b class="small">Il peut…</b><ul class="clean small">'+x.ph.map(t=>'<li>'+t+'</li>').join('')+'</ul><b class="small">Pour l\'accompagner</b><ul class="clean small">'+x.tips.map(t=>'<li>'+t+'</li>').join('')+'</ul><div class="banner bad">'+icon('fa-user-doctor')+'<div class="small"><b>À mentionner à votre professionnel</b><ul class="clean">'+x.watch.map(t=>'<li>'+t+'</li>').join('')+'</ul></div></div><p class="xs muted">Sources : '+x.src.map(s=>lien(s[0],s[1])).join(' · ')+'</p></div></details>').join('')+'</div>'}
function vacs(){return S.parent.vacBebe||(S.parent.vacBebe={})}
function dateVac(b,m){const d=new Date(b);d.setMonth(d.getMonth()+m);return d}
window.vacPrevus=function(){try{const b=parseD(S.parent.naissance.date);if(!b)return[];return VAC.filter(v=>!vacs()[v[0]]&&v[2]>0).map(v=>({d:dateVac(b,v[2]),txt:'Vaccins de '+v[1]+' (prévus)'}))}catch(e){return[]}};
function vaccins(st){const V=vacs(),now=new Date();
  const rows=VAC.map(v=>{const f=V[v[0]],due=dateVac(st.birth,v[2]),soon=!f&&+due-+now<14*864e5,late=!f&&+due<+now-14*864e5;
    return '<div class="li"><div class="ic" style="background:'+(f?'var(--sage-soft,#e3ede0)':'var(--soft)')+'">'+icon(f?'fa-circle-check':'fa-syringe')+'</div><div class="tx"><b>'+v[1]+' · '+(f?'fait le '+fmtD(parseD(f.date)):fmtS(due))+'</b><span>'+v[3]+(f&&f.note?' · '+esc(f.note):'')+'</span>'+(soon&&!late?'<span class="pill acc">à planifier bientôt</span>':late?'<span class="pill warn">à confirmer avec votre clinique</span>':'')+'</div>'+(f?'<button class="icon-btn" data-act="vacFait" data-id="'+v[0]+'" aria-label="Changer la date">'+icon('fa-pen')+'</button><button class="icon-btn" data-act="vacDel" data-id="'+v[0]+'" aria-label="Retirer">'+icon('fa-rotate-left')+'</button>':'<button class="btn sm ghost" data-act="vacFait" data-id="'+v[0]+'">Fait</button>')+'</div>'}).join('');
  return '<div class="card"><span class="eyebrow acc">Vaccins de bébé</span><p class="xs muted" style="margin:2px 0 8px">Calendrier systématique du Nouveau-Brunswick (gratuit). Votre bureau de santé publique ou votre clinique vous donnent les rendez-vous.</p><div class="list">'+rows+'</div>'+
   '<details class="acc" style="margin-top:8px"><summary>'+icon('fa-notes-medical')+' Après un vaccin : à quoi s\'attendre<i class="fa-solid fa-chevron-down chev"></i></summary><div class="body"><ul class="clean small"><li>Souvent légers, 1 à 2 jours : fièvre, rougeur ou enflure à l\'injection, irritabilité, pleurs, perte d\'appétit, somnolence.</li><li>Linge frais et humide sur le site; faire bouger le bras; boires fréquents; vêtements légers.</li><li>Acétaminophène (pour nourrissons) au besoin, selon l\'étiquette ou votre pharmacien. Jamais d\'AAS (Aspirine). Pas d\'ibuprofène avant 6 mois sans avis médical.</li><li>RROV : fièvre ou éruption possibles 1 à 2 semaines après.</li></ul><div class="banner bad">'+icon('fa-phone')+'<div class="small"><b>Consultez tout de suite si :</b> bébé a moins de 3 mois et de la fièvre; de 3 à 12 mois, fièvre de 39 °C ou plus ou plus d\'une journée; urticaire, difficulté à respirer ou gonflement du visage (911); convulsion (911 si moins de 6 mois ou plus de 3 minutes); après le rotavirus : vomissements répétés, ventre gonflé, selles sanglantes; pleurs inconsolables, difficulté à le réveiller, refus de boire.</div></div><p class="xs muted">Sources : '+lien('Calendrier du Nouveau-Brunswick',NB)+' · '+lien('BCCDC : après la vaccination',BC)+'. Information générale, elle ne remplace pas l\'avis de votre équipe de soins.</p></div></details></div>'}
function symptomes(){const L=(S.parent.bebeSymp||[]).slice().sort((a,b)=>b.t-a.t).slice(0,5);
  return '<div class="card"><div class="row between"><span class="eyebrow acc">Symptômes de bébé</span><button class="btn sm" data-act="sympNew">'+icon('fa-plus')+'Noter</button></div>'+
   (L.length?'<div class="list">'+L.map(s=>'<div class="li"><div class="ic">'+icon('fa-thermometer')+'</div><div class="tx"><b>'+fmtS(new Date(s.t))+' · '+fmtT(s.t)+(s.temp?' · '+String(s.temp).replace('.',',')+' °C':'')+'</b><span>'+esc((s.list||[]).join(', '))+(s.note?' · '+esc(s.note):'')+'</span></div><button class="icon-btn" data-act="sympDel" data-id="'+s.id+'" aria-label="Supprimer">'+icon('fa-trash')+'</button></div>').join('')+'</div>':'<p class="small muted">Fièvre, éruption, vomissements… Notez-les ici avec l\'heure : votre doula et votre professionnel s\'en serviront.</p>')+'</div>'}
function conseilSymp(temp,mode,age){const seuil=mode==='rect'?38.1:37.6;
  if(temp&&temp>=seuil){if(age<90)return 'Fièvre chez un bébé de moins de 3 mois : consultez immédiatement (811, urgence ou votre professionnel).';if(temp>=39)return 'Fièvre de 39 °C ou plus : consultez aujourd\'hui. Appelez le 811 si vous hésitez.';return 'Fièvre : surveillez, habillez-le légèrement, offrez à boire. Consultez si elle dure plus d\'une journée ou s\'il est inhabituellement endormi, pâle ou refuse de boire.'}
  return 'Notez bien l\'évolution. Si quelque chose vous inquiète, appelez le 811 : votre instinct compte.'}

/* ---- Courbe de poids (repères OMS, 3e–50e–97e percentile) ---- */
const OMS={G:[[2.5,3.3,4.3],[3.4,4.5,5.7],[4.4,5.6,7.0],[5.1,6.4,7.9],[5.6,7.0,8.6],[6.1,7.5,9.2],[6.4,7.9,9.7]],
 F:[[2.4,3.2,4.2],[3.2,4.2,5.4],[4.0,5.1,6.5],[4.6,5.8,7.4],[5.1,6.4,8.1],[5.5,6.9,8.7],[5.8,7.3,9.2]]};
const WG='https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/weight-for-age/sft-wfa-girls-p-0-5.pdf',WB='https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/weight-for-age/sft-wfa-boys-p-0-5.pdf';
function croissance(st){const n=S.parent.naissance||{},sx=/^f/i.test(n.sexe||'')?'F':/^g/i.test(n.sexe||'')?'G':'';
  if(!sx)return '<div class="card"><span class="eyebrow acc">Courbe de poids de bébé</span><p class="small muted">Pour comparer avec les repères de l\'OMS, indiquez le sexe de bébé (les courbes diffèrent).</p>'+ui.pick('parent.naissance.sexe',['Fille','Garçon'])+'</div>';
  const T=OMS[sx],mo=t=>(t-+st.birth)/864e5/30.44,pts=[];
  if(+n.poids)pts.push([0,+n.poids/1000]);
  (S.logs||[]).filter(l=>l.type==='poids'&&+l.g).forEach(l=>{const m=mo(l.t);if(m>=0&&m<=6.3)pts.push([m,l.g/1000])});
  pts.sort((a,b)=>a[0]-b[0]);
  const Wd=340,Ht=190,L=34,R=8,Tp=10,B=26,X=m=>L+m/6*(Wd-L-R),Y=k=>Ht-B-(k-2)/(10.4-2)*(Ht-B-Tp),line=i=>T.map((r,m)=>X(m).toFixed(1)+','+Y(r[i]).toFixed(1)).join(' ');
  const band=line(0)+' '+T.map((r,m)=>[X(6-m).toFixed(1),Y(T[6-m][2]).toFixed(1)].join(',')).join(' ');
  let svg='<svg viewBox="0 0 '+Wd+' '+Ht+'" style="width:100%;height:auto" role="img" aria-label="Courbe de poids de bébé">';
  for(let k=2;k<=10;k+=2)svg+='<line x1="'+L+'" x2="'+(Wd-R)+'" y1="'+Y(k)+'" y2="'+Y(k)+'" stroke="var(--line,#e6d2c6)" stroke-width=".6"/><text x="'+(L-4)+'" y="'+(Y(k)+3)+'" font-size="9" text-anchor="end" fill="var(--muted,#8a7a70)">'+k+'</text>';
  for(let m=0;m<=6;m++)svg+='<text x="'+X(m)+'" y="'+(Ht-8)+'" font-size="9" text-anchor="middle" fill="var(--muted,#8a7a70)">'+m+'</text>';
  svg+='<text x="'+(Wd/2)+'" y="'+(Ht-0)+'" font-size="8" text-anchor="middle" fill="var(--muted,#8a7a70)">mois</text><polygon points="'+band+'" fill="var(--sage,#8fa58a)" opacity=".22"/><polyline points="'+line(1)+'" fill="none" stroke="var(--sage-dk,#5a7a52)" stroke-width="1.4" stroke-dasharray="4 3"/>';
  if(pts.length>1)svg+='<polyline points="'+pts.map(p=>X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1)).join(' ')+'" fill="none" stroke="var(--accent)" stroke-width="2"/>';
  pts.forEach(p=>{svg+='<circle cx="'+X(p[0]).toFixed(1)+'" cy="'+Y(p[1]).toFixed(1)+'" r="3.6" fill="var(--accent)"/>'});
  svg+='</svg>';
  const dernier=pts[pts.length-1];
  return '<div class="card"><div class="row between"><span class="eyebrow acc">Courbe de poids de bébé</span><button class="btn sm" data-act="poids">'+icon('fa-plus')+'Une pesée</button></div>'+svg+
   '<p class="xs muted"><i style="display:inline-block;width:10px;height:10px;background:var(--sage,#8fa58a);opacity:.4"></i> zone où se trouvent 94 % des bébés (3e à 97e percentile) · ligne pointillée : la moyenne (50e) · points : '+(pts.length?'les pesées de votre bébé':'ajoutez une pesée')+'.</p>'+
   (dernier?'<p class="small">Dernière pesée : <b>'+String(dernier[1].toFixed(2)).replace('.',',')+' kg</b>. Un bébé peut suivre sa propre courbe, plus haut ou plus bas : c\'est la régularité qui compte, pas un point isolé.</p>':'')+
   '<p class="xs muted">Votre professionnel interprète la courbe. Repères : '+lien('OMS, '+(sx==='F'?'filles':'garçons'),sx==='F'?WG:WB)+' (0 à 6 mois). Information générale.</p></div>'}
/* ---- Résumé de la semaine ---- */
function semaine(st){const J=864e5,fin=Date.now(),L=S.logs||[],P=(a,b)=>L.filter(l=>l.t>=a&&l.t<b);
  const R=(a,b)=>{const x=P(a,b),jours=Math.max(1,Math.min(7,Math.ceil((b-Math.max(a,+st.birth))/J)));return {j:jours,b:x.filter(l=>l.type==='sein'||l.type==='biberon').length,m:x.filter(l=>l.type==='couche'&&l.pipi).length,s:x.filter(l=>l.type==='couche'&&l.selle).length,dor:x.filter(l=>l.type==='sommeil').reduce((c,l)=>c+(+l.sec||0),0),ml:x.filter(l=>l.type==='biberon').reduce((c,l)=>c+(+l.ml||0),0),sy:(S.parent.bebeSymp||[]).filter(y=>y.t>=a&&y.t<b).length,n:x.length}};
  const a=R(fin-7*J,fin),b=R(fin-14*J,fin-7*J);if(!a.n&&!b.n)return '';
  const m=(v,j)=>String(Math.round(v/j*10)/10).replace('.',','),h=s=>String(Math.round(s/360)/10).replace('.',',');
  const row=(lbl,v,w)=>'<div class="li"><div class="tx"><b>'+lbl+'</b><span>'+v+(w?' · semaine précédente : '+w:'')+'</span></div></div>';
  const txt='Résumé de la semaine de '+(S.parent.naissance.prenomBebe||'bébé')+' (jour '+st.day+')\nBoires par jour : '+m(a.b,a.j)+'\nCouches mouillées par jour : '+m(a.m,a.j)+' · selles par jour : '+m(a.s,a.j)+'\nSommeil noté : '+h(a.dor/a.j)+' h par jour'+(a.ml?'\nBiberon : '+Math.round(a.ml/a.j)+' ml par jour':'')+(a.sy?'\nSymptômes notés : '+a.sy:'');
  return '<div class="card"><span class="eyebrow acc">Ma semaine</span><div class="list">'+row('Boires par jour',m(a.b,a.j),b.n?m(b.b,b.j):'')+row('Couches mouillées par jour',m(a.m,a.j),b.n?m(b.m,b.j):'')+row('Selles par jour',m(a.s,a.j),b.n?m(b.s,b.j):'')+(a.dor?row('Sommeil noté par jour',h(a.dor/a.j)+' h',b.dor?h(b.dor/b.j)+' h':''):'')+(a.sy?row('Symptômes notés',String(a.sy),''):'')+'</div><p class="xs muted">Selon ce que vous avez noté : plus vous notez, plus c\'est juste. À montrer à votre doula ou à votre infirmière.</p><button class="btn sm ghost" data-act="copyTxt" data-t="'+esc(txt)+'">'+icon('fa-copy')+'Copier le résumé</button></div>'}
/* assemblage */
const _p=pSuivi;pSuivi=function(){let h=_p.apply(this,arguments);try{const st=stage();if(S.role!=='parent'||st.k!=='pp')return h;
  /* retire les doublons : titre + explorateur de jours déjà à l'accueil, vaccins répétés dans la ligne du temps */
  h=h.replace(/<div class="sh"><h1>Mon 4<sup>e<\/sup> trimestre<\/h1>.*?<\/div>/,'');
  {const a=h.indexOf('<div class="card"><h2>Jour ');if(a>=0){const e=h.indexOf('</p></div></div></div>',a);if(e>0)h=h.slice(0,a)+h.slice(e+22)}}
  /* vaccins de la liste « Examens » : remplacés par la carte Vaccins */
  h=h.replace(/<div class="tl[^"]*"><span class="w">[^<]*<\/span><b>Vaccins de[\s\S]*?<\/div>/g,'');
  h=h.replace(/<p class="xs muted">Information générale[^<]*<\/p>/,'');
  /* ordre : segment, en-tête, boires (déjà inséré), puis étapes, vaccins, symptômes */
  const kitEnd=h.indexOf('<div class="card"><span class="eyebrow acc">Mon calendrier</span>');
  const seg=h.indexOf('</div>',h.indexOf('<div class="seg">'))+6;
  h=h.slice(0,seg)+hero(st)+h.slice(seg);
  const cal=h.indexOf('<div class="card"><div class="row between"><span class="eyebrow acc">Mon calendrier</span>');
  if(cal>=0)h=h.slice(0,cal)+etapes(st)+croissance(st)+semaine(st)+vaccins(st)+symptomes()+h.slice(cal);else h+=etapes(st)+croissance(st)+semaine(st)+vaccins(st)+symptomes();
  return h}catch(e){return h}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="vacFait"],[data-act="vacSave"],[data-act="vacDel"],[data-act="sympNew"],[data-act="sympSave"],[data-act="sympDel"]');if(!b)return;e.stopPropagation();e.preventDefault();const a=b.dataset.act,id=b.dataset.id;
  if(a==='vacFait'){const v=VAC.find(x=>x[0]===id),old=vacs()[id]||{};sheet('Vaccins de '+v[1],'<div class="stack" style="gap:10px"><p class="small muted">'+v[3]+'</p><label class="f">Date où le vaccin a été donné<input type="date" id="vcD" value="'+esc(old.date||iso(new Date()))+'"></label><label class="f">Note (réaction, remarque)<input type="text" id="vcN" value="'+esc(old.note||'')+'"></label><button class="btn" data-act="vacSave" data-id="'+id+'">Enregistrer</button></div>');return}
  if(a==='vacSave'){vacs()[id]={date:$('#vcD').value||iso(new Date()),note:$('#vcN').value.trim()};save();close();render();toast('Vaccin noté');return}
  if(a==='vacDel'){if(b.dataset.c!=='1'){b.dataset.c='1';toast('Touchez encore pour retirer');return}delete vacs()[id];save();render();return}
  if(a==='sympNew'){sheet('Symptômes de bébé','<div class="stack" style="gap:10px"><div class="row">'+SYMP.map(x=>'<button class="chip" data-act="toggleChip">'+x+'</button>').join('')+'</div><div class="grid2"><label class="f">Température (°C)<input type="text" id="syT" inputmode="decimal" placeholder="ex. 38,2"></label><label class="f">Prise<select id="syM"><option value="ais">Aisselle ou bouche</option><option value="rect">Rectale ou oreille</option></select></label></div><label class="f">Note<input type="text" id="syN"></label><button class="btn" data-act="sympSave">Enregistrer</button></div>');return}
  if(a==='sympSave'){const list=[...document.querySelectorAll('#layer .chip.on')].map(x=>x.textContent.trim()),t=parseFloat(($('#syT').value||'').replace(',','.'))||0,mode=$('#syM').value,st=stage();
    (S.parent.bebeSymp=S.parent.bebeSymp||[]).push({id:uid(),t:Date.now(),list,temp:t||'',mode,note:$('#syN').value.trim()});save();
    const msg=conseilSymp(t,mode,st.day||999);sheet('C\'est noté','<div class="stack" style="gap:10px"><div class="banner '+(/immédiatement|aujourd/.test(msg)?'bad':'sage')+'">'+icon('fa-phone')+'<div>'+msg+'</div></div><p class="xs muted">Urgence : 911. Info-santé : 811. Information générale; elle ne remplace pas l\'avis d\'un professionnel.</p><button class="btn" data-act="closeSheet">Fermer</button></div>');render();return}
  if(a==='sympDel'){S.parent.bebeSymp=(S.parent.bebeSymp||[]).filter(s=>s.id!==id);save();render()}},true);
document.addEventListener('click',e=>{if(e.target.closest('[data-act="closeSheet"]')){close()}});
/* la doula voit les symptômes et vaccins */
if(typeof cSuivi==='function'){const _c=cSuivi;cSuivi=function(c){let h=_c.apply(this,arguments);try{const d=c.parent_data||{},S1=(d.bebeSymp||[]).slice(-3).reverse(),V=Object.keys(d.vacBebe||{});
  if(S1.length||V.length)h='<div class="card"><span class="eyebrow acc">Santé de bébé (notée par la famille)</span>'+(V.length?'<p class="small"><b>Vaccins faits :</b> '+V.map(k=>(VAC.find(x=>x[0]===k)||[0,k])[1]).join(', ')+'</p>':'')+S1.map(s=>'<p class="small">'+fmtS(new Date(s.t))+' · '+esc((s.list||[]).join(', '))+(s.temp?' · '+s.temp+' °C':'')+(s.note?' · '+esc(s.note):'')+'</p>').join('')+'</div>'+h}catch(e){}return h}}
})();
