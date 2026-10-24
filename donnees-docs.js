/* Académie Sérénaissance — appli Famille : modèles de documents à signer et mots du jour.
   Les modèles sont ceux de Sabrina, à titre d'exemple : chaque doula peut modifier le texte dans « Mes modèles ».
   Variables remplacées à l'envoi : {{doula_entreprise}} {{doula_nom}} {{doula_adresse}} {{doula_tel}} {{doula_courriel}} {{doula_region}}
   {{parent_nom}} {{partenaire}} {{parent_courriel}} {{parent_tel}} {{dpa}} {{lieu}} {{professionnel}} {{forfait}} {{prix}} {{date}} */

const CONTRAT_DEFAUT = `@page Contrat de services de doula | Page 1 de 3 | CONTRATS ET CONSENTEMENTS | Initiales : Parents ______ Doula ______
## Les parties
**ENTRE :** {{doula_nom}}, faisant affaire sous le nom {{doula_entreprise}}, {{doula_adresse}}, {{doula_region}} (Nouveau-Brunswick), {{doula_tel}}, {{doula_courriel}} (ci-après « la Doula »);
ET (nom de la personne enceinte) | {{parent_nom}}
Adresse · téléphone · courriel | {{champ:adresse}}  {{parent_courriel}} · {{parent_tel}}
Partenaire, s'il y a lieu (ensemble « les Parents ») | {{partenaire}}
Date prévue d'accouchement · lieu prévu | {{dpa}} · {{lieu}}
Professionnel de santé responsable | {{professionnel}}
## Article 1 · Objet
La Doula offre aux Parents un soutien émotionnel, physique et informationnel non médical pendant la grossesse, l'accouchement et le post-partum, selon le forfait choisi à l'annexe A.
## Article 2 · Forfait choisi
{{cases_forfaits}}
Le détail des services, des prix et des modalités de paiement figure à l'annexe A, qui fait partie du présent contrat.
## Article 3 · Nature et limites du rôle
La Doula n'est pas une professionnelle de la santé et n'effectue aucun acte médical, clinique ou infirmier. Elle ne pose aucun diagnostic, ne prend aucune décision médicale et ne parle pas au nom des Parents auprès de l'équipe soignante. Les Parents demeurent seuls responsables de leurs décisions et de leur suivi médical. L'annexe B précise ces limites et doit être signée.
## Article 4 · Période de garde
À partir de 38 semaines de grossesse et jusqu'à l'accouchement, la Doula est de garde 24 heures sur 24, 7 jours sur 7. Les Parents l'appellent (et non par texto seulement) dès le début du travail, à la rupture des membranes, ou lorsqu'ils partent vers le lieu de naissance. Si l'accouchement survient avant 37 semaines, la Doula fera tous les efforts raisonnables pour être présente, sans garantie.
@page Contrat de services de doula | Page 2 de 3 | CONTRATS ET CONSENTEMENTS | Initiales : Parents ______ Doula ______
## Article 5 · Présence à l'accouchement
La Doula se rend auprès des Parents dans un délai raisonnable après l'appel, selon la distance et les conditions routières. Elle reste jusqu'à environ 2 heures après la naissance pour le post-partum immédiat. Après 18 heures de présence continue, elle peut faire appel à sa doula remplaçante pour se reposer, afin de garder un soutien sécuritaire. Les règles de l'établissement (nombre d'accompagnants, mesures sanitaires) priment; si elles empêchent la présence de la Doula, le soutien se poursuit à distance et la portion accouchement est traitée selon l'article 9.
## Article 6 · Communications
Les Parents peuvent joindre la Doula par courriel, texto, Messenger ou téléphone. Hors période de garde, la Doula répond habituellement en moins de 24 heures. En cas d'urgence, les Parents composent d'abord le 911 ou joignent leur professionnel de santé.
## Article 7 · Doula remplaçante
Si la Doula ne peut être présente (maladie, deux naissances simultanées, force majeure), elle propose une doula remplaçante de confiance, liée par une entente de confidentialité. Les Parents sont libres de l'accepter ou non. S'ils refusent, ou si aucune remplaçante n'est disponible, la portion accouchement leur est remboursée.
## Article 8 · Accouchement rapide ou non signalé
Si les Parents n'ont pas appelé la Doula à temps pour qu'elle puisse se rendre, la portion accouchement reste due. La Doula offre alors une rencontre postnatale supplémentaire.
## Article 9 · Annulation et remboursement
Les Parents peuvent résilier le contrat en tout temps par avis écrit (un courriel suffit).
- Avant la première rencontre : remboursement complet, sans frais.
- Après la première rencontre : les Parents paient la valeur des services rendus, plus une pénalité égale au plus petit de 50 $ ou de 10 % de la valeur des services non rendus.
- La valeur de chaque service est indiquée à l'annexe A.
- Le remboursement est fait dans les 10 jours suivant l'avis écrit, par le même moyen de paiement.
La Doula peut mettre fin au contrat, avec un avis écrit motivé, si sa sécurité est menacée, en cas de comportement abusif, de non-paiement après rappel écrit, ou si les Parents demandent un acte hors de son rôle. Les sommes payées pour des services non rendus sont alors remboursées, sans pénalité.
@page Contrat de services de doula | Page 3 de 3 | CONTRATS ET CONSENTEMENTS | En deux exemplaires
## Article 10 · Perte de grossesse ou situation imprévue
En cas de deuil périnatal, de césarienne planifiée ou de transfert de soins, la Doula offre de poursuivre son accompagnement sous une forme adaptée. Si les Parents préfèrent mettre fin au contrat, seuls les services rendus sont payables, sans pénalité.
## Article 11 · Confidentialité
La Doula garde confidentiels tous les renseignements reçus, conformément au formulaire de consentement signé. Elle ne peut les communiquer qu'avec le consentement des Parents, sauf si la loi l'exige (notamment l'obligation de signaler une situation où la sécurité d'un enfant est compromise) ou en cas de danger grave et imminent pour la vie d'une personne.
## Article 12 · Responsabilité et assurance
La Doula indique ci-dessous son assurance responsabilité professionnelle et civile, le cas échéant. Elle n'est pas responsable des décisions médicales, des résultats de l'accouchement ni des actes de l'équipe soignante. Rien dans le présent contrat ne limite la responsabilité de la Doula pour sa propre faute, ni les droits que la loi accorde aux Parents.
Assureur et no de police | {{assurance}}
## Article 13 · Déplacements
Les déplacements sont inclus dans un rayon de 50 km de {{doula_region}}. Au-delà, des frais de 0,55 $/km aller-retour s'appliquent, annoncés avant la signature.
## Article 14 · Dispositions générales
Le présent contrat, avec ses annexes, constitue l'entente complète entre les parties. Toute modification doit être faite par écrit et signée. Il est régi par les lois du Nouveau-Brunswick et les lois fédérales du Canada; il n'enlève aucun droit accordé par la loi de la province de résidence des Parents, notamment la Loi sur la protection du consommateur du Québec. Les parties tentent d'abord de régler tout différend à l'amiable.
## Signatures
{{signatures}}
@page Annexe A · Forfaits et paiement | Fait partie du contrat | CONTRATS ET CONSENTEMENTS | Annexe A
@cols
{{cartes_forfaits}}
@card Inclus dans tous les forfaits || Plan de naissance, liste d'hôpital, cahier de naissance, soutien illimité par courriel, texto, Messenger ou téléphone, garde 24/7 dès 38 semaines. À la carte : relation d'aide (1 h) 60 $; bloc prénatal ou postnatal (3 h) 120 $, annulable sans frais jusqu'à 24 h avant.
@col
## Mon calendrier de paiement
Nombre de versements | {{champ:paiement}}
Fréquence des versements | {{champ:frequence}}
Début du calendrier | Date de signature du contrat
Date limite du dernier versement | 36 semaines de grossesse : {{date36}}
>! Premier versement obligatoire || Le premier versement est dû à la signature du contrat. Si la Doula ne l'a pas reçu, la première rencontre n'a pas lieu et la garde ne commence pas.
- Les versements suivants se calculent à partir de la date de signature, chaque semaine, aux 2 semaines ou chaque mois, selon le choix de la famille.
- Le montant total doit être payé en totalité avant 36 semaines de grossesse.
## Modalités
No de TVH (ou « non inscrite ») | 
- Prix en dollars canadiens. TVH de 15 % ajoutée seulement si la Doula est inscrite (voir ci-dessous).
- Paiement par virement Interac à {{doula_courriel}} ou autre mode convenu avec la Doula.
- Aucuns frais de crédit ni intérêts.
- Un rappel est envoyé aux Parents 48 heures avant chaque échéance (dans l'appli et par courriel).
- Un rappel est envoyé 48 heures avant chaque échéance. Si un versement n'est pas reçu 7 jours après son échéance, le suivi et les services de la Doula cessent (sont suspendus) jusqu'au paiement; ils reprennent dès la réception du versement. Le montant total du forfait demeure dû.
- Un reçu est remis pour chaque paiement.
_La présence à l'accouchement vaut 50 % du forfait; l'autre 50 % est réparti entre les rencontres. Ces valeurs servent au calcul en cas d'annulation._
## Initiales
Parents ______________   Doula ______________
@endcols
@page Annexe B · Rôle et limites de la doula | Fait partie du contrat | CONTRATS ET CONSENTEMENTS | Annexe B
_Les Parents reconnaissent que la Doula offre un soutien non médical et applique le principe « Observer et référer »._
@cols
## La doula peut
- Offrir un soutien émotionnel, du réconfort et de l'écoute
- Proposer des positions, la respiration, des massages et des mesures de confort
- Fournir de l'information fondée sur des sources reconnues
- Aider les Parents à formuler leurs questions à l'équipe soignante
- Soutenir l'allaitement et les premiers soins au bébé
- Reconnaître des signaux d'alerte et orienter vers les ressources
>~ Précision || Même si la Doula est aussi naturothérapeute et intervenante en relation d'aide, ces services ne sont pas inclus dans l'accompagnement de doula et ne remplacent aucun traitement médical ou psychologique.
## Nos engagements
[ ] Nous avons un suivi médical ou sage-femme régulier pendant la grossesse.
[ ] Nous informerons la Doula de tout élément de santé pouvant influencer l'accompagnement.
[ ] En cas d'urgence, nous appelons d'abord le 911 ou notre professionnel de santé.
[ ] Nous restons seuls responsables de nos décisions médicales.
@col
## La doula ne peut pas
- Faire un examen vaginal, prendre la tension ou écouter le cœur du bébé
- Poser un diagnostic ou interpréter un résultat médical
- Recommander ou administrer un médicament, une plante ou un produit naturel
- Parler ou décider à la place des Parents
- Remplacer une sage-femme, une infirmière, une IBCLC ou un médecin
- Retarder une consultation ou un appel au 911
>! Appeler l'hôpital ou le 911 sans attendre || Saignement abondant, maux de tête intenses ou troubles de la vue, fièvre de 38 °C ou plus, bébé qui bouge moins, liquide vert ou brun, douleur intense et constante, idées de se faire du mal ou de faire du mal au bébé.
## Signatures
Parent 1 |
Parent 2 |
Doula · date |
@endcols`;

const CONSENTEMENT_DEFAUT = `## Ce que je recueille et pourquoi
Vos coordonnées et des renseignements sur votre grossesse, votre santé et votre famille, uniquement pour vous accompagner, tenir un dossier et vous facturer. Ils sont conservés dans l'appli Sérénaissance (accès protégé par mot de passe). Certains outils peuvent conserver des données à l'extérieur du Canada, notamment aux États-Unis.

## Combien de temps
Le temps de l'accompagnement, puis au moins un an, avant une destruction sécuritaire, sauf les documents de paiement conservés 6 ans pour l'impôt.

## Exceptions prévues par la loi
La Doula doit communiquer certains renseignements sans consentement lorsque la sécurité ou le développement d'un enfant peut être compromis (obligation de signalement au N.-B. et au Québec), ou en cas de danger grave et imminent pour la vie d'une personne.

## Mes droits
Consulter, corriger ou faire supprimer mes renseignements, et retirer mon consentement, en écrivant à {{doula_courriel}} (réponse en 30 jours). Plainte possible au Commissariat à la protection de la vie privée du Canada ou, au Québec, à la Commission d'accès à l'information. Conforme à la LPRPDE (Canada) et, pour les résidentes du Québec, à la Loi 25. Chaque autorisation est distincte et peut être retirée en tout temps.`;

const PHOTOS_DEFAUT = `Entièrement facultative : la refuser ne change rien à votre accompagnement.

## Conditions
Aucune nudité ni image intime ne sera publiée. La Doula vous montre chaque image ou texte avant publication. Aucune rémunération n'est versée. Vous pouvez retirer cette autorisation en tout temps par écrit; le contenu est retiré dans les 7 jours des plateformes de {{doula_entreprise}} (les partages déjà faits par d'autres ne peuvent être garantis). Les règles de l'établissement sur les photos sont toujours respectées. Endroits possibles : mon site Web, Facebook, Instagram, infolettre.`;

const ACCUEIL_DEFAUT = `Ce formulaire m'aide à adapter mon soutien. Répondez seulement à ce que vous êtes à l'aise de partager; chaque question est facultative sauf les coordonnées.`;

const RESILIATION_DEFAUT = `@page Résiliation et remboursement | Article 9 du contrat | CONTRATS ET CONSENTEMENTS | Résiliation
@cols
## Formulaire de résiliation (remis aux parents)
À | {{doula_nom}}, {{doula_entreprise}}, {{doula_courriel}}
Nous (noms) | {{champ:noms}}
Résilions le contrat signé le | {{champ:datecontrat}}
Forfait | {{forfait}}
Date de l'avis | {{champ:dateavis}}
{{signatures}}
_Un simple courriel suffit aussi : ce formulaire n'est pas obligatoire._
@col
## Calcul du remboursement (rempli par la doula)
Total payé ($) |
Valeur des services rendus, annexe A ($) |
Valeur des services non rendus ($) |
Pénalité : plus petit de 50 $ ou 10 % des non rendus ($) |
Remboursement dû : payé − rendus − pénalité ($) |
Remboursé le · par |
Date limite (10 jours après l'avis) |
>~ Exemple || Forfait Accompagnement des Parents (1 450 $) payé en entier, annulation après 2 rencontres prénatales. Services rendus : 290 $. Non rendus : 1 160 $. Pénalité : 50 $ (moins que 116 $). Remboursement : 1 110 $.
@endcols`;

const VERS_DEF = { 'Accompagnement des Parents': [1, 3, 6], 'Soutien au Couple': [1, 3], 'Arrivée de Bébé': [1, 2] };
function versPour(n) { return (typeof FORFAITS !== 'undefined' && FORFAITS[n] && FORFAITS[n].vers) || VERS_DEF[n] || [1, 2, 3]; }

/* Types de documents : champs fixes, texte modifiable par la doula */
const DOC_TYPES = {
  contrat: { titre: 'Contrat de services de doula', texte: CONTRAT_DEFAUT, sigP: true, sigD: true,
    champs: [{ k: 'adresse', t: 'Adresse des parents', type: 'text' }, { k: 'paiement', t: 'Nombre de versements', req: true, type: 'choix', o: ['1 versement', '2 versements', '3 versements', '6 versements'] }, { k: 'frequence', t: 'Fréquence des versements', req: true, type: 'choix', o: ['Chaque semaine', 'Aux 2 semaines', 'Chaque mois'] }] },
  accueil: { titre: 'Formulaire d\'accueil confidentiel', texte: ACCUEIL_DEFAUT, sigP: true, sigD: false,
    champs: [
      { g: 'Coordonnées' }, { k: 'nom', t: 'Nom de la personne enceinte', type: 'text', req: true }, { k: 'pronoms', t: 'Pronoms (facultatif)', type: 'text' }, { k: 'partenaire', t: 'Partenaire / personne de soutien', type: 'text' }, { k: 'adresse', t: 'Adresse', type: 'text' }, { k: 'tel', t: 'Téléphone · courriel', type: 'text', req: true }, { k: 'urgence', t: 'Personne à joindre en cas d\'urgence', type: 'text' }, { k: 'langue', t: 'Langue préférée', type: 'text' },
      { g: 'Grossesse et suivi' }, { k: 'dpa', t: 'Date prévue d\'accouchement', type: 'date' }, { k: 'anterieurs', t: 'Grossesses et accouchements antérieurs', type: 'area' }, { k: 'prof', t: 'Professionnel de suivi (nom, clinique)', type: 'text' }, { k: 'lieu', t: 'Lieu de naissance prévu', type: 'text' }, { k: 'grossesse', t: 'Grossesse', type: 'choix', o: ['Simple', 'Multiple'] }, { k: 'sante', t: 'Conditions de santé à signaler', type: 'area' }, { k: 'allergies', t: 'Allergies (dont huiles essentielles, latex)', type: 'text' },
      { g: 'Vécu et préférences' }, { k: 'precedent', t: 'Comment s\'est passé votre accouchement précédent ?', type: 'area' }, { k: 'peurs', t: 'Peurs ou expériences difficiles à connaître', type: 'area' }, { k: 'apaise', t: 'Ce qui vous apaise (toucher, musique, silence, encouragements)', type: 'area' }, { k: 'eviter', t: 'Touchers ou mots à éviter', type: 'area' }, { k: 'alim', t: 'Projet d\'alimentation', type: 'choix', o: ['Allaitement', 'Préparation commerciale', 'Mixte', 'À décider'] }, { k: 'culture', t: 'Pratiques culturelles, spirituelles ou familiales', type: 'area' }, { k: 'presents', t: 'Qui sera présent à la naissance et au retour à la maison ?', type: 'area' }, { k: 'attentes', t: 'Ce que vous attendez le plus de votre doula', type: 'area' },
      { g: 'Santé mentale (facultatif)' }, { k: 'mental', t: 'Avez-vous déjà vécu de l\'anxiété, une dépression ou un autre défi de santé mentale ? Cette information aide à repérer plus tôt les signes post-partum.', type: 'area' }, { k: 'vivevoix', t: 'Je préfère en parler de vive voix', type: 'case' }
    ] },
  consentement: { titre: 'Consentement aux renseignements personnels', texte: CONSENTEMENT_DEFAUT, sigP: true, sigD: false,
    champs: [{ g: 'Mes autorisations' }, { k: 'a1', t: 'Recueillir et conserver les renseignements de mon formulaire d\'accueil', type: 'case' }, { k: 'a2', t: 'Communiquer avec moi par l\'appli, texto, Messenger et courriel', type: 'case' }, { k: 'a3', t: 'Échanger avec mon équipe soignante, à ma demande seulement', type: 'case' }, { k: 'a3n', t: 'Nom du professionnel', type: 'text' }, { k: 'a4', t: 'Transmettre mon dossier à la doula remplaçante si elle me remplace', type: 'case' }, { k: 'a5', t: 'Discuter de mon accompagnement, de façon anonyme, en supervision', type: 'case' }] },
  photos: { titre: 'Autorisation photos, vidéos et témoignages', texte: PHOTOS_DEFAUT, sigP: true, sigD: false,
    champs: [{ g: 'J\'autorise ma doula à…' }, { k: 'p1', t: 'Prendre des photos pendant le travail ou la naissance, pour nous seulement', type: 'case' }, { k: 'p2', t: 'Publier une photo où personne n\'est reconnaissable (mains, pieds du bébé)', type: 'case' }, { k: 'p3', t: 'Publier une photo où notre famille est reconnaissable', type: 'case' }, { k: 'p4', t: 'Publier notre témoignage avec nos prénoms', type: 'case' }, { k: 'p5', t: 'Publier notre témoignage de façon anonyme (initiales)', type: 'case' }, { k: 'p6', t: 'Utiliser notre histoire, anonymisée, dans de la formation de doulas', type: 'case' }, { k: 'parent2', t: 'Nom du 2e parent (s\'il y a lieu)', type: 'text' }] },
  resiliation: { titre: 'Résiliation et remboursement', texte: RESILIATION_DEFAUT, sigP: true, sigD: false,
    champs: [{ k: 'noms', t: 'Nous (noms)', type: 'text' }, { k: 'datecontrat', t: 'Contrat signé le', type: 'date' }, { k: 'dateavis', t: 'Date de l\'avis', type: 'date' }] },
  autre: { titre: 'Document', texte: '', sigP: true, sigD: true, champs: [] }
};

/* Mots du jour : un mot personnel, différent chaque jour, selon l'étape. {p} = prénom de la maman, {b} = bébé */
const MOTS_GROSSESSE = [
  '{p}, prends un moment aujourd\'hui pour poser tes mains sur ton ventre et respirer avec ton bébé. Ce lien se construit déjà.',
  'Ton corps fait un travail immense, même quand tu te reposes. Tu as le droit de ralentir aujourd\'hui, {p}.',
  'Une question te trotte dans la tête ? Note-la dans « Mes questions » : on en parle à la prochaine rencontre.',
  'Bois un grand verre d\'eau et mange une collation nourrissante. Prendre soin de toi, c\'est prendre soin de ton bébé.',
  'Tu n\'as pas à tout savoir d\'avance, {p}. On avance une étape à la fois, ensemble.',
  'Pense à quelque chose qui te fait du bien et offre-le-toi aujourd\'hui : une marche, un bain tiède, une sieste.',
  'Ton intuition compte. Si quelque chose ne te semble pas normal, appelle ton professionnel : il vaut mieux appeler pour rien.',
  'Respire lentement : inspire par le nez en comptant 4, expire longuement en comptant 6. Trois fois. Voilà.',
  'Parle à ton bébé aujourd\'hui. Il reconnaît déjà ta voix et celle des gens qui l\'attendent.',
  'Les émotions en montagnes russes sont normales pendant la grossesse. Tu peux m\'écrire quand tu veux, {p}.',
  'Repose-toi sur le côté quand tu t\'allonges. Ton bébé et toi serez plus confortables.',
  'Qui peut t\'aider après la naissance ? Pense à une personne à qui tu pourrais confier un repas ou une lessive.',
  'Tu es la bonne mère pour ce bébé, {p}. Il n\'y a pas de façon parfaite d\'attendre un enfant.',
  'Un petit pas aujourd\'hui : coche un élément de ta liste « Préparer ma naissance ».',
  'Ton partenaire a peut-être des questions aussi. Prenez cinq minutes ensemble ce soir pour en parler.'
];
const MOTS_FIN = [
  'On approche, {p}. Garde mon numéro près de toi et appelle-moi dès les premiers signes, aux eaux ou au départ.',
  'Ton corps sait comment faire. Une contraction à la fois, une respiration à la fois.',
  'Ta valise est-elle prête ? Ajoute ton plan de naissance et tes cartes d\'affirmations.',
  'Repose-toi le plus possible ces jours-ci. Chaque sieste est une réserve d\'énergie pour le grand jour.',
  'Je suis de garde pour toi, jour et nuit. Tu n\'es pas seule, {p}.'
];
const MOTS_POSTPARTUM = [
  'Bonjour {p} ! Comment s\'est passée la nuit ? Note les tétées et les couches de {b}, et écris-moi si quelque chose t\'inquiète.',
  'Le repos n\'est pas un luxe, c\'est un besoin. Dors quand {b} dort, même 20 minutes.',
  'Accepte l\'aide qu\'on t\'offre aujourd\'hui. Laisser quelqu\'un faire la vaisselle, c\'est te permettre de prendre soin de toi.',
  'Les larmes faciles des premiers jours sont fréquentes. Si la tristesse dure plus de deux semaines, parle-m\'en, {p}.',
  'Peau à peau avec {b} : ça calme, ça réchauffe et ça aide l\'allaitement. Profite de ces moments.',
  'Mange chaud et nourrissant. Un bouillon, une soupe, un repas simple : ton corps récupère.',
  'Tu apprends à connaître {b}, et {b} apprend à te connaître. Il n\'y a pas d\'examen à réussir.',
  'Une douleur qui dure à l\'allaitement n\'est pas normale. Demande de l\'aide : je suis là, et les marraines aussi.',
  'Garde les visites courtes et choisies. Ta bulle avec {b} est précieuse.',
  'Bois un grand verre d\'eau à chaque tétée. Ton corps travaille fort.',
  'Tu fais un travail extraordinaire, {p}, même dans les moments où tu doutes.',
  'Comment va ton moral, vraiment ? Tu peux me répondre ici, sans filtre.'
];

/* ===== Lettres personnelles (envoi groupé) =====
   Variables de plus : {{prenom}} (prénom de la maman), {{doula_prenom}}, {{bebe}} (prénom du bébé ou « votre bébé »), {{dpa_mois}} */
const LETTRES_MERCI = [
  { nom: 'Chaleureuse', texte: `Chère {{prenom}}{{partenaire_et}},

Merci de m'avoir choisie pour vous accompagner dans l'arrivée de votre bébé. C'est un vrai privilège que vous m'ouvriez la porte de cette période si précieuse de votre vie.

Notre rencontre m'a beaucoup touchée. J'ai hâte d'apprendre à mieux vous connaître et de préparer avec vous une naissance qui vous ressemble.

Vous trouverez dans votre appli votre contrat et quelques formulaires à remplir. Prenez le temps de les lire : je réponds avec plaisir à toutes vos questions, directement dans l'appli.

D'ici notre prochaine rencontre, prenez bien soin de vous.

Avec douceur,
{{doula_prenom}}
{{doula_entreprise}}` },
  { nom: 'Douce', texte: `Bonjour {{prenom}}{{partenaire_et}},

Une naissance se prépare un pas à la fois, et vous venez d'en faire un très beau : choisir d'être entourés. Merci de me faire confiance pour marcher à vos côtés jusqu'à l'arrivée de {{bebe}}, et pendant les premières semaines qui suivront.

Je serai là pour vous écouter, vous informer et vous soutenir, dans le respect de vos choix. Il n'y a pas de bonne ou de mauvaise façon de vivre cette aventure : il y a la vôtre.

Votre pochette de bienvenue vous attend dans l'appli. Lisez-la à votre rythme, et écrivez-moi dès qu'une question se présente.

Tendrement,
{{doula_prenom}}` },
  { nom: 'Simple et claire', texte: `Bonjour {{prenom}}{{partenaire_et}},

Merci de m'avoir choisie comme doula ! Je suis très heureuse de vous accompagner.

Voici les prochaines étapes :
1. Lire et signer votre contrat dans l'appli (Ma doula › Documents).
2. Remplir le formulaire d'accueil confidentiel et le consentement.
3. Demander le moment de notre première rencontre prénatale (Ma doula › Rendez-vous).

Vous pouvez m'écrire dans l'appli en tout temps.

Au plaisir,
{{doula_prenom}} · {{doula_tel}}` },
  { nom: 'Pour les deux parents', texte: `Bonjour {{prenom}}{{partenaire_et}},

Merci de m'accueillir dans votre équipe. Mon rôle est de vous soutenir tous les deux : la maman, bien sûr, mais aussi la personne qui l'accompagne, qui a souvent besoin de repères, de petits gestes concrets et d'un moment pour souffler.

Ensemble, nous allons préparer l'arrivée de {{bebe}} : vos souhaits, vos questions, vos peurs aussi, sans jugement. Le jour venu, je serai à vos côtés pour vous aider à vivre ce moment avec confiance.

Votre contrat et vos documents sont dans l'appli. On se reparle très bientôt.

Avec toute ma reconnaissance,
{{doula_prenom}}` },
  { nom: 'Courte', texte: `{{prenom}}, merci de m'avoir choisie !

C'est un honneur de faire partie de votre histoire. Votre pochette de bienvenue est dans l'appli : contrat, formulaire d'accueil et quelques documents à lire et signer.

On se reparle très bientôt.
{{doula_prenom}}` }
];
/* Morceaux pour « Générer une nouvelle version » de la lettre de remerciement */
const MERCI_OUV = [
  'Merci de m\'avoir choisie pour vous accompagner jusqu\'à l\'arrivée de {{bebe}}.',
  'Je tenais à vous dire merci, simplement et sincèrement, de m\'avoir fait confiance.',
  'Quelle joie d\'apprendre que vous avez choisi de vivre cette aventure avec moi !',
  'Merci pour notre belle rencontre et pour la confiance que vous m\'accordez.',
  'Être choisie pour accompagner une famille est toujours un grand privilège : merci.'
];
const MERCI_MIL = [
  'Je serai là pour vous écouter, vous informer et vous soutenir, dans le respect de vos choix.',
  'Ensemble, nous allons préparer une naissance qui vous ressemble, à votre rythme.',
  'Mon rôle est de vous offrir du soutien, de l\'information et du réconfort, avant, pendant et après la naissance.',
  'Vos questions, vos souhaits et même vos peurs ont toute leur place dans nos rencontres.',
  'Je vous accompagnerai pas à pas, pour que vous vous sentiez prêts et entourés le jour venu.'
];
const MERCI_FIN = [
  'Votre pochette de bienvenue vous attend dans l\'appli. Prenez le temps de la lire, et écrivez-moi au besoin.',
  'Vous trouverez votre contrat et vos documents dans l\'appli, sous « Ma doula ». Je reste disponible pour toute question.',
  'Tout est dans votre appli : contrat, formulaires et prochaines étapes. Au plaisir de vous revoir très bientôt.',
  'D\'ici notre prochaine rencontre, prenez bien soin de vous. Je suis à un message près.',
  'J\'ai hâte de commencer notre préparation ensemble.'
];
const MERCI_SIGN = ['Avec douceur,', 'Tendrement,', 'Au plaisir,', 'Avec toute ma reconnaissance,', 'Chaleureusement,'];

const LETTRE_FORFAITS_DEFAUT = `Bonjour {{prenom}}{{partenaire_et}},

Merci pour notre belle rencontre. Comme promis, voici mes forfaits et mes prix. Prenez le temps d'en discuter ensemble : il n'y a aucune pression, et je reste disponible pour répondre à toutes vos questions.

Quand vous serez prêts, touchez « Choisir ce forfait » sous celui qui vous convient. Je vous enverrai ensuite votre pochette de bienvenue avec votre contrat.

## Mes forfaits
{{forfaits}}

Au plaisir,
{{doula_prenom}}`;

const LETTRE_FIN_DEFAUT = `Chère {{prenom}}{{partenaire_et}},

Notre accompagnement se termine, et je tenais à vous dire merci. Merci de m'avoir ouvert la porte de votre histoire et de votre maison.

J'ai été témoin de votre courage, de votre douceur et de tout l'amour qui entoure {{bebe}}. Ces souvenirs resteront précieux pour moi.

Rappelez-vous que vous n'avez pas à tout savoir : demander de l'aide est un geste de force.

Ma porte reste ouverte. Si vous avez besoin de parler, d'une marraine d'allaitement ou d'une référence, écrivez-moi.

Si vous avez quelques minutes, votre avis m'aide beaucoup : un court questionnaire vous attend dans l'appli.

{{doula_prenom}}`;

const SATISFACTION_DEFAUT = `Merci de prendre quelques minutes pour me dire comment vous avez vécu notre accompagnement. Vos réponses vont directement à moi et m'aident à m'améliorer. Le témoignage est facultatif : il n'est publié qu'avec votre autorisation.`;
const NOTE5 = ['5 · Tout à fait', '4 · Plutôt oui', '3 · Moyennement', '2 · Plutôt non', '1 · Pas du tout'];
DOC_TYPES.satisfaction = { titre: 'Votre avis et votre témoignage', texte: SATISFACTION_DEFAUT, sigP: false, sigD: false,
  champs: [
    { g: 'Votre expérience' },
    { k: 'n1', t: 'Je me suis sentie écoutée et respectée', type: 'choix', o: NOTE5 },
    { k: 'n2', t: 'L\'information reçue m\'a aidée à faire mes propres choix', type: 'choix', o: NOTE5 },
    { k: 'n3', t: 'Le soutien pendant l\'accouchement', type: 'choix', o: NOTE5 },
    { k: 'n4', t: 'Le soutien après la naissance', type: 'choix', o: NOTE5 },
    { k: 'n5', t: 'Je recommanderais ma doula à une amie', type: 'choix', o: NOTE5 },
    { k: 'aide', t: 'Ce qui vous a le plus aidée', type: 'area' },
    { k: 'ameliorer', t: 'Ce que je pourrais améliorer', type: 'area' },
    { g: 'Votre témoignage (facultatif)' },
    { k: 'temoignage', t: 'Quelques mots sur votre accompagnement', type: 'area' },
    { k: 'pubPrenom', t: 'J\'autorise ma doula à publier ce témoignage avec mon prénom', type: 'case' },
    { k: 'pubAnonyme', t: 'J\'autorise ma doula à le publier de façon anonyme (initiales)', type: 'case' },
    { k: 'signature', t: 'Prénom ou initiales à afficher', type: 'text' }
  ] };
/* Lettres (sans signature) : modèles modifiables dans « Mes modèles » */
const LETTRES_TYPES = { merci: 'Merci de m\'avoir choisie', forfaits: 'Mes forfaits et mes prix', fin: 'Merci et à bientôt' };
