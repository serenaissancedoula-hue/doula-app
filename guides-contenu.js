/* Sérénaissance — guides pour les parents (bienvenue, prénatal, postnatal) + rapport d'accouchement et fiches de rencontre.
   Même mise en page que la trousse de modèles (pages à bandeau, cartes terracotta / sauge). Les guides restent modifiables dans « Mes modèles ». */
const PIED_G = 'Guide de {{doula_entreprise}} · Contenu © Académie Sérénaissance · Reproduction interdite';

const GUIDE_BIENVENUE = `@page Bienvenue, {{prenom}}{{partenaire_et}} | Page 1 de 4 | GUIDE DE BIENVENUE AUX PARENTS | ${PIED_G}
Je suis très heureuse de vous accompagner dans cette grande aventure. Ce guide vous explique simplement ce qu'est une doula, ce que vous pouvez attendre de moi, et comment nous allons travailler ensemble.
## Qu'est-ce qu'une doula ?
Une doula est une personne formée pour offrir un soutien émotionnel, physique et informationnel non médical pendant la grossesse, l'accouchement et les premières semaines avec bébé. Elle est présente pour vous, avec constance et sans jugement.
Elle ne remplace ni votre médecin, ni votre sage-femme, ni votre infirmière : elle les complète. Votre équipe de soins s'occupe de la santé; la doula s'occupe de vous soutenir, de vous rassurer et de vous aider à vivre cette expérience à votre façon.
>~ En un mot || Une présence calme, informée et bienveillante, qui reste à vos côtés du début à la fin, et qui vous aide à prendre des décisions éclairées.
## Mon engagement
- Écouter vos souhaits et respecter vos choix, quels qu'ils soient.
- Rester présente et disponible selon notre entente.
- Garder tout ce que vous me confiez confidentiel.
- Vous référer à un professionnel de la santé dès que votre situation le demande.
@page Ce qu'une doula fait, et ne fait pas | Page 2 de 4 | GUIDE DE BIENVENUE AUX PARENTS | ${PIED_G}
@cols
## Une doula peut
- Vous écouter, vous rassurer et vous aider à exprimer vos besoins.
- Vous expliquer, en mots simples, ce qui se passe et les options possibles.
- Vous aider à préparer votre plan de naissance.
- Offrir des mesures de confort : respiration, positions, massage, contre-pression, présence.
- Soutenir votre partenaire pour qu'il ou elle trouve sa place.
- Rester avec vous pendant le travail et après la naissance.
- Vous aider à démarrer l'allaitement ou l'alimentation de bébé, et à vous reposer.
- Vous orienter vers les bonnes ressources.
@col
## Une doula ne peut pas
- Poser un diagnostic, examiner, donner des soins médicaux ou infirmiers.
- Recommander ou arrêter un médicament ou un traitement.
- Prendre une décision à votre place.
- Parler en votre nom auprès de l'équipe soignante : c'est vous qui décidez et qui parlez.
- Remplacer votre professionnel de la santé.
@endcols
>! Observer et référer || Si je remarque quelque chose qui m'inquiète pour votre santé ou celle de bébé, je vous le dis et je vous invite à consulter votre professionnel de la santé. En cas d'urgence, composez le 911.
_Ce rôle est précisé à l'annexe B de votre contrat de services._
@page Les bienfaits d'un soutien continu | Page 3 de 4 | GUIDE DE BIENVENUE AUX PARENTS | ${PIED_G}
Avoir une personne de soutien qui reste auprès de la maman pendant le travail est l'une des mesures de soutien les plus étudiées en périnatalité. Une grande revue de la recherche (Cochrane, 2017) associe le soutien continu à plusieurs bienfaits.
## Ce que les études associent à un soutien continu
- Plus de chances d'un accouchement vaginal spontané.
- Un travail légèrement plus court.
- Moins de recours à la césarienne et aux interventions.
- Moins de sentiments négatifs envers l'expérience de l'accouchement.
## Au-delà de la naissance
- Un sentiment de sécurité et de confiance.
- Des parents mieux informés, qui osent poser leurs questions.
- Un partenaire plus à l'aise et plus présent.
- Un démarrage plus doux avec bébé.
>~ Bon à savoir || Ces résultats sont des tendances observées dans des groupes de personnes : ils ne sont pas des garanties. Chaque naissance est unique, et mon rôle est de vous soutenir quelle que soit la façon dont votre bébé arrive.
@page Notre parcours ensemble | Page 4 de 4 | GUIDE DE BIENVENUE AUX PARENTS | ${PIED_G}
@card 1 · Avant la naissance || Rencontres prénatales pour apprendre à vous connaître, préparer votre plan de naissance et pratiquer des outils de confort. Messages possibles entre les rencontres.
@card 2 · Le jour J || Je vous rejoins quand le travail est bien commencé, selon notre entente, et je reste auprès de vous pendant le travail et l'accouchement.
@card 3 · Après la naissance || Un soutien dans les premières heures, puis une ou plusieurs visites postnatales : récit de la naissance, alimentation, repos, émotions.
## Comment me joindre
Doula | {{doula_nom}}
Téléphone | {{doula_tel}}
Courriel | {{doula_courriel}}
## Votre appli
Tout se passe dans votre appli : messages, rendez-vous, documents à signer, listes à cocher et guides. Vous pouvez aussi me parler en direct avec le bouton « Chat avec ma doula ».
_Si vous avez une question, aussi petite soit-elle, écrivez-moi : c'est pour ça que je suis là._`;

const GUIDE_PRENATAL = `@page Préparer votre naissance | Page 1 de 4 | GUIDE PRÉNATAL | ${PIED_G}
La préparation, ce n'est pas tout prévoir : c'est vous donner des repères, des outils et la confiance de choisir. Voici comment profiter de vos rencontres prénatales.
## Avant chaque rencontre
- Notez vos questions dans votre appli (Préparer › Mes questions).
- Pensez à ce qui vous rassure et à ce qui vous inquiète.
- Si vous avez un partenaire, invitez-le à participer.
## Sujets que nous pouvons explorer
- Les étapes du travail et de l'accouchement.
- Les mesures de confort : respiration, positions, eau, massage, contre-pression.
- Les options et les décisions à prendre (en parler avec votre équipe de soins).
- Le rôle de votre partenaire le jour J.
- Les premières heures avec bébé et l'alimentation.
>~ Poser des questions || Votre médecin ou votre sage-femme est la meilleure personne pour répondre aux questions médicales. Je vous aide à les formuler et à vous y retrouver.
@page Votre plan de naissance | Page 2 de 4 | GUIDE PRÉNATAL | ${PIED_G}
Un plan de naissance est une feuille d'une page qui dit à l'équipe ce qui compte pour vous. Il se prépare à deux, se discute avec votre professionnel de la santé, et reste flexible.
## À réfléchir
- L'ambiance : lumière, musique, intimité, qui est présent dans la pièce.
- Le confort : bouger librement, bain ou douche, positions, respiration.
- Vos souhaits pour la douleur : ce que vous aimeriez essayer, et ce que vous préférez éviter.
- Le moment de la naissance : contact peau à peau, coupe du cordon, première tétée.
- Si les choses ne se passent pas comme prévu : césarienne, transfert, séparation de bébé.
>~ Le meilleur plan || Le meilleur plan est celui qui garde de la place pour l'imprévu. Écrivez des préférences plutôt que des exigences, et gardez-en une copie dans votre sac d'hôpital.
@page Reconnaître le travail | Page 3 de 4 | GUIDE PRÉNATAL | ${PIED_G}
@cols
## Début du travail
- Contractions irrégulières, plus ou moins fortes.
- Mal de dos ou crampes, perte du bouchon muqueux.
- Il est souvent possible de parler, de manger, de se reposer.
- À faire : vous reposer, boire, manger léger, bouger doucement, m'écrire.
@col
## Travail actif
- Contractions plus fortes, régulières et de plus en plus rapprochées.
- Vous devez vous concentrer et respirer pendant les contractions.
- À faire : m'appeler, suivre les consignes de votre professionnel de la santé pour savoir quand vous rendre à l'hôpital ou à la maison de naissance.
@endcols
>! Appelez votre professionnel de la santé || Si vos eaux crèvent, si vous avez des saignements, si bébé bouge beaucoup moins, si vous avez de la fièvre ou une douleur intense qui ne passe pas, appelez tout de suite votre équipe de soins ou rendez-vous à l'urgence (911 en cas d'urgence).
_Votre professionnel vous dira quand venir : suivez ses consignes avant toute autre._
@page Soutien, confort et valise | Page 4 de 4 | GUIDE PRÉNATAL | ${PIED_G}
## Pour vous soutenir pendant le travail
- Respirer lentement : inspirer par le nez, expirer longuement.
- Changer de position souvent : debout, à quatre pattes, assise sur le ballon.
- Eau chaude, chaleur, lumière douce, musique.
- Massage et contre-pression dans le bas du dos.
- Boire, uriner souvent, se reposer entre les contractions.
## Pour votre partenaire
- Rester proche, parler doucement, offrir de l'eau.
- Rappeler les souhaits du plan de naissance.
- Prendre soin de soi aussi : manger, s'asseoir, respirer.
## Votre valise
Retrouvez la liste complète dans votre appli (Préparer › Ma valise). Vous pouvez y ajouter vos propres éléments. Prévoyez-la vers 35 à 36 semaines.
_N'oubliez pas : le siège d'auto installé et vérifié est obligatoire pour ramener bébé à la maison._`;

const GUIDE_POSTNATAL = `@page Le quatrième trimestre | Page 1 de 4 | GUIDE POSTNATAL | ${PIED_G}
Les trois premiers mois avec bébé sont souvent appelés le quatrième trimestre : bébé s'adapte à la vie hors du ventre, et vous vous remettez de l'accouchement tout en apprenant à devenir parent. C'est une période intense, belle, et parfois fatigante.
## À quoi s'attendre
- Beaucoup de sommeil fractionné et des boires fréquents.
- Un corps qui récupère : saignements, courbatures, fatigue.
- Des émotions qui montent et qui descendent.
- Des questions sur tout, et c'est normal.
>~ Vous n'êtes pas seule || Demander de l'aide est une force. Acceptez les repas, les mains en plus, les moments de repos. Je suis là pour vous soutenir dans cette transition.
@page Repos, alimentation et bébé | Page 2 de 4 | GUIDE POSTNATAL | ${PIED_G}
## Vous reposer
- Dormez quand bébé dort, même un peu.
- Limitez les visites : un petit nombre de personnes qui aident, pas qui reçoivent.
- Mangez et buvez régulièrement : gardez des collations à portée de main.
## Nourrir bébé
- Allaitement ou biberon : le plus important, c'est que bébé soit nourri et que vous soyez soutenue.
- Les premières semaines demandent de la patience : positions, prise du sein, rythme.
- Si l'allaitement est douloureux ou difficile, parlez-en tôt à votre doula, à une infirmière ou à une consultante en lactation.
## Le sommeil sécuritaire
- Santé Canada recommande de coucher bébé sur le dos, sur une surface ferme et plane, dans un lit conçu pour bébé, sans oreiller ni couverture épaisse ni toutous.
- Le plus sûr est de dormir dans la même pièce que bébé, mais pas dans le même lit.
@page Vos émotions | Page 3 de 4 | GUIDE POSTNATAL | ${PIED_G}
Après la naissance, il est fréquent d'être à fleur de peau pendant les premiers jours.
@cols
## Le baby blues
- Larmes faciles, sautes d'humeur, inquiétude.
- Apparaît dans les premiers jours.
- S'estompe en une à deux semaines.
@col
## À surveiller
- Tristesse, anxiété ou irritabilité qui durent plus de deux semaines ou s'aggravent.
- Perte d'intérêt, difficulté à dormir même quand bébé dort, pensées envahissantes.
- Impression de ne pas être capable ou de ne pas être attachée à bébé.
@endcols
>! Demandez de l'aide || Parlez-en à votre professionnel de la santé ou composez le 811 (Info-Santé ou Info-Social). Si vous avez des pensées de vous faire du mal ou de faire du mal à votre bébé, rendez-vous à l'urgence, composez le 911 ou le 988 (ligne d'aide en cas de crise ou de suicide, 24 h sur 24). Ce n'est pas votre faute, et ça se soigne.
_Les papas et les partenaires peuvent aussi vivre une période difficile : parlez-en aussi._
@page Quand consulter, et ressources | Page 4 de 4 | GUIDE POSTNATAL | ${PIED_G}
@cols
## Pour vous : consultez sans tarder
- Saignements très abondants ou gros caillots.
- Fièvre, frissons ou douleur qui augmente.
- Douleur ou gonflement à une jambe, douleur à la poitrine ou essoufflement.
- Maux de tête intenses ou troubles de la vue.
@col
## Pour bébé : consultez sans tarder
- Fièvre (38 °C et plus, surtout chez un bébé de moins de 3 mois).
- Refus de boire, très peu de couches mouillées, grande somnolence.
- Respiration difficile, teint jaune qui s'accentue.
@endcols
>! En cas d'urgence || Composez le 911. Pour une question de santé non urgente : 811.
## Votre soutien
Doula | {{doula_nom}}
Téléphone | {{doula_tel}}
_Même après nos rencontres, n'hésitez pas à m'écrire : je suis heureuse de prendre de vos nouvelles._`;

const GUIDES_DOC = {
  guide_bienvenue: { titre: 'Guide de bienvenue aux parents', texte: GUIDE_BIENVENUE, ic: 'fa-heart', sous: 'Ce qu\'est une doula, son rôle, les bienfaits, notre parcours' },
  guide_prenatal: { titre: 'Guide prénatal', texte: GUIDE_PRENATAL, ic: 'fa-person-pregnant', sous: 'Préparer la naissance, plan de naissance, reconnaître le travail' },
  guide_postnatal: { titre: 'Guide postnatal', texte: GUIDE_POSTNATAL, ic: 'fa-baby', sous: 'Quatrième trimestre, repos, émotions, quand consulter' }
};
Object.entries(GUIDES_DOC).forEach(([k, g]) => { if (typeof MOD_LISTE !== 'undefined' && !MOD_LISTE.find(x => x[0] === k)) MOD_LISTE.push([k, g.titre]) });
const _mtG = modeleTexte; modeleTexte = function (k) { if (GUIDES_DOC[k]) { const m = (ME_DOULA && ME_DOULA.modeles || {}).docs || {}; return m[k] != null ? m[k] : GUIDES_DOC[k].texte } return _mtG(k) };

/* ---------- rapport d'accouchement et fiches de rencontre : la doula remplit, la famille reçoit un beau document ---------- */
const FICHES_DOC = {
  rapport: { titre: 'Rapport d\'accouchement', ic: 'fa-heart-pulse', cat: 'RAPPORT D\'ACCOUCHEMENT', sous: 'Le récit de la naissance, remis aux parents', champs: [
    ['bebe', 'Prénom de bébé', 'text'], ['date', 'Date de naissance', 'date'], ['heure', 'Heure de naissance', 'text'], ['lieu', 'Lieu', 'text'], ['pro', 'Professionnel(s) présent(s)', 'text'],
    ['debut', 'Début du travail (date et heure)', 'text'], ['arrivee', 'Mon arrivée auprès de vous', 'text'], ['depart', 'Mon départ', 'text'], ['duree', 'Durée approximative du travail', 'text'],
    ['mode', 'Façon dont bébé est arrivé', 'text'], ['poids', 'Poids et taille (si les parents le souhaitent)', 'text'],
    ['recit', 'Le récit de la naissance', 'area'], ['soutien', 'Le soutien offert (confort, positions, présence…)', 'area'], ['moments', 'Moments marquants', 'area'],
    ['premieres', 'Les premières heures (peau à peau, première tétée…)', 'area'], ['suite', 'À suivre : prochaine visite, ressources', 'area']] },
  prenatale: { titre: 'Fiche de rencontre prénatale', ic: 'fa-person-pregnant', cat: 'RENCONTRE PRÉNATALE', sous: 'Résumé de notre rencontre', champs: [
    ['date', 'Date de la rencontre', 'date'], ['no', 'Numéro de la rencontre', 'text'], ['sujets', 'Sujets abordés', 'area'], ['outils', 'Outils pratiqués', 'area'],
    ['questions', 'Vos questions à poser à votre professionnel', 'area'], ['devoirs', 'À pratiquer d\'ici la prochaine rencontre', 'area'], ['prochaine', 'Prochaine rencontre', 'text']] },
  postnatale: { titre: 'Fiche de visite postnatale', ic: 'fa-baby', cat: 'VISITE POSTNATALE', sous: 'Résumé de notre visite', champs: [
    ['date', 'Date de la visite', 'date'], ['recit', 'Récit de la naissance : ce que vous avez partagé', 'area'], ['aliment', 'Alimentation de bébé : ce que nous avons vu', 'area'],
    ['repos', 'Repos et récupération', 'area'], ['emotions', 'Émotions et soutien', 'area'], ['ressources', 'Ressources recommandées', 'area'], ['prochaine', 'Prochaine visite ou prise de nouvelles', 'text']] }
};
function fichePropre(v) { return String(v || '').split('\n').map(l => l.trim().replace(/^[@#>\[_]+\s*/, '').replace(/ \| /g, ' / ')).filter(Boolean) }
function ficheTexte(k, F) {
  const T = FICHES_DOC[k], pied = 'Document de {{doula_entreprise}} · Confidentiel, remis aux parents';
  const dt = v => v ? fmtD(parseD(v), { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const rows = T.champs.filter(c => c[2] !== 'area' && F[c[0]]).map(c => c[1] + ' | ' + (c[2] === 'date' ? dt(F[c[0]]) : F[c[0]].replace(/ \| /g, ' / ')));
  const areas = T.champs.filter(c => c[2] === 'area' && fichePropre(F[c[0]]).length).map(c => '## ' + c[1] + '\n' + fichePropre(F[c[0]]).join('\n'));
  let t = '@page ' + T.titre + ' | Page 1 | ' + T.cat + ' | ' + pied + '\nPour {{prenom}}{{partenaire_et}}\n' + (rows.length ? '## Les détails\n' + rows.join('\n') + '\n' : '');
  t += areas.join('\n');
  if (k === 'rapport') t += '\n>~ Merci || Merci de m\'avoir fait confiance pour vous accompagner. Quelle belle naissance : prenez le temps de vous reposer et de savourer ces premiers moments.';
  return t;
}
function ficheDocSheet(id, k) {
  const c = S.clients.find(x => x.id === id), T = FICHES_DOC[k];
  const pre = { bebe: c.bebe || '', date: k === 'rapport' ? (c.naiss || '') : iso(new Date()), lieu: c.lieu || '', pro: c.prof || '' };
  const champ = ([n, l, t]) => t === 'area' ? '<label class="f">' + esc(l) + '<textarea class="fiche-in" data-k="' + n + '" style="min-height:90px"></textarea></label>'
    : '<label class="f">' + esc(l) + '<input class="fiche-in" data-k="' + n + '" type="' + (t === 'date' ? 'date' : 'text') + '" value="' + esc(pre[n] || '') + '"></label>';
  sheet(T.titre, '<p class="small">Remplissez ce que vous voulez : les champs laissés vides ne s\'affichent pas. La famille reçoit un document propre dans son appli (elle peut l\'enregistrer en PDF).</p>' + T.champs.map(champ).join('') +
    '<button class="btn" data-act="ficheEnvoyer" data-id="' + id + '" data-v="' + k + '">' + icon('fa-paper-plane') + 'Envoyer à la famille</button>');
}
async function docInfoEnvoyer(c, k, titre, contenu) {
  const { error } = await sb.from('fam_documents').insert({ famille_id: c.id, type: 'autre', titre, contenu, champs: [], sig_parent_requise: false, sig_doula_requise: false, statut: 'signe' });
  return error;
}
/* carte dans l'onglet Documents d'une famille */
const _cdGC = cDocs; cDocs = function (c) {
  return _cdGC(c) + '<div class="card"><span class="eyebrow acc">Guides et documents pour la famille</span><p class="small muted">Des documents à lire et à garder, sans signature. Ils se remplissent avec les informations de la famille.</p>' +
    '<button class="btn" data-act="guidesEnvoi" data-id="' + c.id + '">' + icon('fa-book-open') + 'Envoyer un guide (bienvenue, prénatal, postnatal)</button>' +
    '<div class="row" style="flex-wrap:wrap;gap:8px;margin-top:8px">' + Object.entries(FICHES_DOC).map(([k, t]) => '<button class="btn sm ghost" data-act="ficheNouvelle" data-id="' + c.id + '" data-v="' + k + '">' + icon(t.ic) + t.titre + '</button>').join('') + '</div></div>';
};
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-act="guidesEnvoi"],[data-act="guidesEnvoyer"],[data-act="ficheNouvelle"],[data-act="ficheEnvoyer"]'); if (!b) return; e.stopPropagation(); const a = b.dataset.act;
  try {
    if (a === 'guidesEnvoi') { const c = S.clients.find(x => x.id === b.dataset.id); const deja = CDOCS[c.id] || [];
      sheet('Envoyer un guide à ' + esc(c.prenom || cName(c)), '<p class="small">Cochez les guides à envoyer. Ils sont personnalisés avec les informations de la famille.</p><div class="stack" style="gap:6px">' +
        Object.entries(GUIDES_DOC).map(([k, g]) => '<label class="check" style="align-items:flex-start"><input type="checkbox" class="gsel" data-k="' + k + '"><span>' + icon(g.ic, 'var(--accent)') + ' <b>' + g.titre + '</b><br><span class="xs muted">' + g.sous + (deja.some(d => d.titre === g.titre) ? ' · déjà envoyé' : '') + '</span></span></label>').join('') +
        '</div><button class="btn" data-act="guidesEnvoyer" data-id="' + c.id + '">' + icon('fa-paper-plane') + 'Envoyer</button><p class="xs muted">Vous pouvez adapter le texte de chaque guide dans Outils › Mes modèles.</p>'); return }
    if (a === 'guidesEnvoyer') { const c = S.clients.find(x => x.id === b.dataset.id), ks = [...document.querySelectorAll('.gsel:checked')].map(x => x.dataset.k); if (!ks.length) { toast('Cochez au moins un guide'); return } b.disabled = true;
      for (const k of ks) { const g = GUIDES_DOC[k], err = await docInfoEnvoyer(c, k, g.titre, remplirModele(modeleTexte(k), c, { prixVivants: true })); if (err) { toast(err.message); b.disabled = false; return } }
      const titres = ks.map(k => GUIDES_DOC[k].titre);
      await sb.from('fam_messages').insert({ famille_id: c.id, de_doula: true, type: 'document', texte: (ks.length > 1 ? 'Je vous envoie des guides pour vous accompagner' : 'Je vous envoie un guide pour vous accompagner') + ' :\n• ' + titres.join('\n• ') + '\n\n📎 Dans votre appli (Ma doula › Documents).' });
      close(); await chargerClientDetail(c.id); render(); toast('Envoyé : la famille est avisée'); return }
    if (a === 'ficheNouvelle') { ficheDocSheet(b.dataset.id, b.dataset.v); return }
    if (a === 'ficheEnvoyer') { const c = S.clients.find(x => x.id === b.dataset.id), k = b.dataset.v, F = {}; document.querySelectorAll('.fiche-in').forEach(x => F[x.dataset.k] = (x.value || '').trim());
      if (!Object.values(F).some(Boolean)) { toast('Remplissez au moins un champ'); return } b.disabled = true;
      const T = FICHES_DOC[k], titre = T.titre + (F.date ? ' · ' + fmtD(parseD(F.date), { day: 'numeric', month: 'short', year: 'numeric' }) : ''), err = await docInfoEnvoyer(c, k, titre, remplirModele(ficheTexte(k, F), c, { prixVivants: true }));
      if (err) { toast(err.message); b.disabled = false; return }
      await sb.from('fam_messages').insert({ famille_id: c.id, de_doula: true, type: 'document', texte: 'Nouveau document de votre doula : « ' + titre + ' ».\n\n📎 Dans votre appli (Ma doula › Documents), vous pouvez l\'enregistrer en PDF.' });
      close(); await chargerClientDetail(c.id); render(); toast('Envoyé : la famille est avisée'); return }
  } catch (err) { console.error(err); toast('Une erreur est survenue. Réessayez.') }
}, true);
/* ces documents s'affichent « Document » plutôt que « Signé » */
const _dlGC = docLigne; docLigne = function (d, doula) { const h = _dlGC(d, doula); return (GUIDES_DOC[d.type] || FICHES_DOC[d.type] || /^(Guide |Rapport d'acc|Fiche de )/.test(d.titre || '')) && d.statut === 'signe' ? h.replace('>Signé<', '>Document<') : h };
