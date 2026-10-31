/* Sérénaissance — « Liste de naissance de bébé » (Espace Famille) : quoi acheter, quoi emprunter, quoi recevoir en cadeau.
   Se trouve dans Préparer, à côté de « Ma valise ». Les cases cochées et les notes sont gardées avec le reste du dossier (parent_data). */
(function(){
if(typeof PREP_TILES==='undefined'||typeof PSUB==='undefined'||typeof ui==='undefined')return;
const LISTE_BEBE={
 'Dormir':['Lit de bébé, berceau ou moïse conforme aux normes canadiennes','Matelas ferme qui s\'ajuste bien au lit','2 ou 3 draps-housses','Sacs de nuit ou couvertures d\'emmaillotage','Veilleuse douce','Moniteur pour bébé (facultatif)','Machine à bruit blanc (facultatif)'],
 'Boire et manger':['Allaitement : 2 ou 3 soutiens-gorge d\'allaitement','Coussinets d\'allaitement','Coussin d\'allaitement','Contenants pour conserver le lait','Tire-lait (au besoin, souvent inutile les premières semaines)','Biberons et tétines nouveau-né (2 à 4)','Goupillon et égouttoir ou stérilisateur','Préparation commerciale (seulement si nécessaire)','Bavoirs et petits linges à rot'],
 'Change et bain':['Couches nouveau-né et taille 1 (pas trop au début)','Lingettes douces ou débarbouillettes','Crème pour les fesses','Table ou matelas à langer','Poubelle à couches','Baignoire de bébé','Serviettes à capuchon et débarbouillettes','Savon doux sans parfum','Thermomètre numérique','Coupe-ongles ou lime pour bébé','Sérum physiologique et poire nasale'],
 'Vêtements':['6 à 8 combinaisons ou bodys (nouveau-né et 0-3 mois)','4 ou 5 pyjamas','Bonnets et mitaines','Chaussettes ou petits chaussons','Tenue de sortie douce','Habit de neige ou chapeau de soleil selon la saison','Couverture légère pour la poussette'],
 'Sorties et auto':['Siège d\'auto pour nouveau-né, installé à l\'arrière face à la route','Vérification de l\'installation du siège (par une personne formée)','Poussette ou landau','Porte-bébé ou écharpe de portage','Sac à langer'],
 'Éveil et confort':['Tapis d\'éveil','Premiers hochets et jouets doux','Livres cartonnés','Sucette (facultatif)','Un petit cadeau de bienvenue pour bébé'],
 'Pour moi, après la naissance':['Serviettes hygiéniques post-partum et culottes confortables','Bouteille de lavage pour le périnée','Compresses froides ou chaudes','Vêtements amples et confortables','Collations et plats au congélateur','Papiers à portée de main : carte d\'assurance maladie, carnet de vaccination']
};
const TOUT=()=>Object.values(LISTE_BEBE).flat();
PREP_TILES.splice(Math.max(0,PREP_TILES.findIndex(t=>t[0]==='valise')+1),0,['registre','fa-baby-carriage','Liste de naissance de bébé','Quoi acheter, emprunter ou recevoir',()=>ui.count('parent.registre',TOUT())+'/'+TOUT().length]);
PSUB.registre=function(){
  return sh('Liste de naissance de bébé','Cochez au fur et à mesure : acheté, emprunté ou reçu en cadeau')+
   '<div class="banner sage">'+icon('fa-lightbulb')+'<div class="small"><b>Pas besoin de tout acheter neuf.</b> Empruntez, achetez usagé ou demandez en cadeau. Seule exception : le siège d\'auto, à acheter neuf ou d\'une personne de confiance dont vous connaissez l\'histoire (jamais accidenté, non expiré). Pour le sommeil, bébé dort sur le dos, sur une surface ferme, sans oreiller ni toutou dans le lit.</div></div>'+
   Object.entries(LISTE_BEBE).map(([k,v])=>'<div class="card"><div class="row between"><span class="eyebrow acc">'+k+'</span><span class="pill acc">'+ui.count('parent.registre',v)+'/'+v.length+'</span></div>'+ui.checks('parent.registre',v)+'</div>').join('')+
   '<div class="card"><span class="eyebrow acc">Mes idées et mes liens</span>'+ui.area('parent.registreN.idees','Autres articles, magasins, liens à garder','',90)+'</div>'};
})();
