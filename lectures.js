/* Sérénaissance — Petites lectures sur la page d'accueil de la famille : textes courts, rédigés dans nos mots à partir de sources reconnues (liens cités). */
(function(){
const SRC={
 caph:['CAPWHN : Mouvements du bébé (fiche pour les patientes)','https://capwhn.ca/wp-content/uploads/2025/05/FetalMovementsPatientHadoutFinalwLogo-FRANCAIS.pdf'],
 guide:['Santé Canada : Guide alimentaire canadien, grossesse et allaitement','https://www.canada.ca/fr/sante-canada/services/guide-alimentaire/manger-favoriser/etapes-vie/grossesse-allaitement.html'],
 aspc:['Agence de la santé publique du Canada : Vos sentiments après la naissance de votre bébé','https://www.canada.ca/fr/sante-publique/services/publications/vie-saine/vos-sentiments-apres-la-naissance-ya-personne-parfait.html'],
 inspq:['INSPQ : Dormir en sécurité','https://www.inspq.qc.ca/mieux-vivre/nouveau-ne/sommeil/dormir-en-securite'],
 sommeil:['Agence de la santé publique du Canada : Sommeil sécuritaire','https://www.canada.ca/fr/sante-publique/services/sommeil-securitaire/semaine-sommeil-securitaire.html'],
 nourr:['Santé Canada : La nutrition du nourrisson né à terme et en santé, de la naissance à six mois','https://www.canada.ca/fr/sante-canada/services/guide-alimentaire-canadien/ressources/nutrition-nourrisson/nutrition-nourrisson-terme-sante-recommandations-naissance-six-mois.html']};
/* quand : [semaine min, semaine max] pendant la grossesse ; pp : [jour min, jour max] après la naissance */
const L=[
 {id:'mvt',t:'Sentir bébé bouger : à quoi s\'attendre',r:'Pas de chiffre magique, mais vous connaissez votre bébé.',min:2,preg:[18,42],pp:null,src:['caph'],
  c:['Vers 24 à 26 semaines (parfois avant), on sent de légères sensations : des bulles, des papillons. Plus tard, ce sont des coups plus nets. Le hoquet de bébé est normal, mais ce n\'est pas un mouvement.',
     'Il n\'existe pas de nombre fixe de mouvements, et chaque bébé est différent. Un bébé peut dormir jusqu\'à 40 minutes sans beaucoup bouger. On les sent souvent mieux au repos, assise ou allongée, les mains sur le ventre.',
     'En fin de grossesse, les mouvements changent : plus de roulements, moins de coups, parce que bébé a moins de place.',
     'S\'il bouge moins que d\'habitude ou différemment : installez-vous au calme, changez de position, buvez de l\'eau. Si la sensation persiste, ne tardez pas : appelez votre médecin, votre sage-femme ou l\'unité de triage obstétrical de l\'hôpital.']},
 {id:'alim',t:'Bien manger pendant la grossesse : les bases',r:'Acide folique, fer, vitamine D, poisson : ce que dit Santé Canada.',min:2,preg:[4,42],pp:[0,120],src:['guide'],
  c:['Santé Canada recommande une multivitamine par jour contenant 0,4 mg d\'acide folique, pendant la grossesse et si vous pourriez devenir enceinte. Pendant la grossesse, elle devrait aussi contenir de 16 à 20 mg de fer. La vitamine D (400 UI par jour) vient des aliments ou d\'un supplément.',
     'Chaque jour : des légumes et des fruits, des grains entiers et des aliments protéinés. Il faut un peu plus de nourriture pour la croissance de bébé et, plus tard, pour la production de lait. Buvez beaucoup d\'eau.',
     'Le poisson est utile, mais certaines espèces contiennent du mercure. Variez les types de poisson et suivez les avis de Santé Canada.',
     'Le risque d\'intoxication alimentaire est plus élevé pendant la grossesse : la salubrité des aliments compte. Pour les suppléments ou une situation particulière, parlez-en à votre professionnel de la santé.']},
 {id:'dodo',t:'Dormir en sécurité : les consignes pour bébé',r:'Sur le dos, lit vide, dans la chambre des parents.',min:3,preg:[28,42],pp:[0,300],src:['inspq','sommeil'],
  c:['Dès la naissance, bébé dort sur le dos. Une fois qu\'il se tourne seul, il peut garder la position qu\'il préfère.',
     'Il dort sur un matelas ferme, dans un lit, un berceau ou un moïse conforme aux normes de sécurité canadiennes.',
     'Pendant les six premiers mois, il dort dans son propre lit, installé dans la chambre des parents. Si ce n\'est pas possible, dans un lit sécuritaire situé dans une autre pièce.',
     'Le lit est vide, à part un drap-housse bien ajusté : pas de couette, d\'oreiller ni de bordure rembourrée. Pour le couvrir, une couverture légère ou un sac de sommeil à sa taille, en évitant qu\'il ait trop chaud.']},
 {id:'blues',t:'Baby blues ou dépression postnatale ?',r:'Ce qui est fréquent, et quand demander de l\'aide.',min:2,preg:[34,42],pp:[0,150],src:['aspc'],
  c:['Le « baby blues » est très fréquent après l\'accouchement : agitation, tristesse, envie de pleurer, impression d\'être dépassée. Il vient des changements physiques, émotionnels et hormonaux, et il disparaît généralement en quelques semaines.',
     'Ça aide de bien manger, de dormir le plus possible, d\'être moins exigeante envers soi-même et de demander de l\'aide à son entourage.',
     'Parlez à un professionnel de la santé si les symptômes ne disparaissent pas après quelques semaines, s\'ils s\'aggravent, si vous avez déjà eu une dépression ou si les symptômes ont commencé pendant la grossesse. La dépression postpartum peut aussi toucher les pères. Elle est réelle, il existe de l\'aide, et on peut s\'en sortir.',
     'Si vous pensez vous faire du mal ou en faire à bébé, appelez le 911 ou la ligne de crise 988 (appel ou texto).']},
 {id:'lait',t:'Nourrir bébé de 0 à 6 mois : les recommandations',r:'Allaitement, vitamine D, préparations pour nourrissons.',min:3,preg:[30,42],pp:[0,200],src:['nourr'],
  c:['Santé Canada recommande l\'allaitement exclusif pendant les six premiers mois, puis de le poursuivre jusqu\'à deux ans ou plus avec des aliments complémentaires adaptés.',
     'Un bébé allaité reçoit chaque jour un supplément de vitamine D de 10 µg (400 UI), dès la naissance.',
     'Vers six mois, les premiers aliments devraient être riches en fer : viande, œufs, tofu, légumineuses ou céréales enrichies.',
     'Si bébé n\'est pas exclusivement allaité, la préparation commerciale à base de lait de vache est la norme. On la prépare et la conserve de façon sécuritaire, on ne laisse jamais bébé boire seul au biberon, et on évite le lait de vache, de chèvre ou les boissons végétales avant un an. Dans tous les cas, on suit l\'appétit de bébé et ses signes de satiété, comme détourner la tête.',
     'Besoin d\'aide avec l\'allaitement ou le biberon ? Votre doula et votre équipe de soins peuvent vous guider.']}];
function pertinentes(){const st=stage();let sc=x=>0;
  if(st.k==='preg'){const w=st.g.w;return L.filter(a=>a.preg&&w>=a.preg[0]-6&&w<=a.preg[1]).sort((a,b)=>Math.abs(w-(a.preg[0]+6))-Math.abs(w-(b.preg[0]+6)))}
  if(st.k==='pp'){const d=st.day;return L.filter(a=>a.pp&&d>=a.pp[0]&&d<=a.pp[1]).sort((a,b)=>a.pp[0]-b.pp[0])}
  return L.slice()}
function carte(a){return '<button class="li" data-act="lecOuvrir" data-v="'+a.id+'" style="background:none;border-left:0;border-right:0;border-top:0;width:100%;text-align:left;cursor:pointer;color:inherit"><div class="ic">'+icon('fa-book-open')+'</div><div class="tx"><b>'+esc(a.t)+'</b><span>'+esc(a.r)+' · '+a.min+' min</span></div>'+icon('fa-chevron-right')+'</button>'}
window.lecturesCard=function(){try{const P=pertinentes().slice(0,3);if(!P.length)return '';return '<div class="card"><div class="row between"><span class="eyebrow acc">Petites lectures</span><button class="btn sm ghost" data-act="lecTous">Tout voir</button></div><div class="list">'+P.map(carte).join('')+'</div></div>'}catch(e){return ''}};
if(typeof doulaCard==='function'){const _dc=doulaCard;doulaCard=function(){return lecturesCard()+_dc.apply(this,arguments)}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="lecOuvrir"],[data-act="lecTous"]');if(!b)return;e.stopPropagation();e.preventDefault();
  if(b.dataset.act==='lecTous'){sheet('Petites lectures','<div class="list">'+L.map(carte).join('')+'</div><p class="xs muted">Textes d\'information générale, rédigés dans nos mots à partir de sources reconnues. Ils ne remplacent pas l\'avis de votre équipe de soins.</p>');return}
  const a=L.find(x=>x.id===b.dataset.v);if(!a)return;
  sheet(esc(a.t),'<div class="stack" style="gap:10px">'+a.c.map(p=>'<p class="small" style="margin:0">'+esc(p)+'</p>').join('')+'<div class="soft"><b class="small">Sources</b><ul class="clean xs">'+a.src.map(k=>'<li><a href="'+SRC[k][1]+'" target="_blank" rel="noopener noreferrer">'+esc(SRC[k][0])+'</a></li>').join('')+'</ul></div><p class="xs muted">Information générale, consultée en octobre 2026 : elle ne remplace pas l\'avis de votre médecin, de votre sage-femme ou de votre équipe de soins. En cas de doute, appelez-les.</p><button class="btn ghost" data-act="lecTous">Autres lectures</button></div>')},true);
})();
