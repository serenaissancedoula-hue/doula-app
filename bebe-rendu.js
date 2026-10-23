/* Sérénaissance — rendu réaliste de bébé dans le liquide amniotique (dessin original, peint en dégradés).
   Lumière chaude qui traverse le ventre, liquide qui ondule, particules, cordon et placenta.
   Les bras, les jambes et le corps bougent selon le stade (tressaillements, coups de pied, hoquet, étirements). */
const MOUV=[
  [4,7,'Pas encore de mouvements : le cœur, lui, bat déjà dès 6 semaines.',''],
  [8,12,'Bébé fait de petits tressaillements et étire son corps tout entier. Vous ne le sentez pas encore.','tressaille'],
  [13,17,'Il bouge bras et jambes, porte les mains à son visage et fait des culbutes dans le liquide.','culbute'],
  [18,24,'Coups de pied, étirements et hoquet : vous commencez à sentir de petits papillons, puis de vrais petits coups.','coups'],
  [25,31,'Coups de pied plus forts, poings, hoquet rythmé. Il dort et s\'éveille par cycles.','coups fort'],
  [32,36,'Il a moins de place : roulades, étirements et poussées plutôt que grands coups. Les mouvements ne doivent pas diminuer.','roule'],
  [37,42,'Bébé est tassé : il s\'étire, pousse et se tortille. Il doit bouger chaque jour autant qu\'avant.','roule']];
function mouvement(w){return MOUV.find(m=>w>=m[0]&&w<=m[1])||MOUV[MOUV.length-1]}
function poidsTexte(g){return g>=1000?cm((g/1000).toFixed(1))+' kg':g+' g'}
function dessinReel(w){
  if(w<8){const t=(w-4)/4;return '<g filter="url(#doux)"><path d="M108 70 C138 80 140 128 104 142 C90 148 76 138 80 124" fill="none" stroke="url(#embryon)" stroke-width="'+(26+t*8)+'" stroke-linecap="round" opacity=".92"/><circle cx="104" cy="76" r="'+(22+t*7)+'" fill="url(#embryon)" opacity=".95"/>'+
    '<circle cx="96" cy="74" r="'+(3+t)+'" fill="#3a1410" opacity="'+(.25+t*.5)+'"/>'+(w>=6?'<ellipse cx="128" cy="112" rx="'+(5+t*6)+'" ry="'+(4+t*4)+'" fill="#e79b86" opacity=".9"/><ellipse cx="108" cy="136" rx="'+(5+t*6)+'" ry="'+(4+t*4)+'" fill="#e79b86" opacity=".9"/><circle class="coeur" cx="120" cy="94" r="7" fill="#b3261e" opacity=".85"/>':'')+'</g>'}
  const c=Math.min(1,(w-8)/32),gras=c,transl=Math.max(0,1-(w-8)/14); /* tôt : peau translucide et rosée; tard : potelé */
  const ombre='<g opacity=".38" filter="url(#flou3)">';
  return '<g>'+
  '<path d="M112 150 C100 172 72 182 52 172 C34 162 28 140 34 118" fill="none" stroke="#a24a3b" stroke-width="8" stroke-linecap="round" opacity=".85"/><path d="M112 150 C100 172 72 182 52 172 C34 162 28 140 34 118" fill="none" stroke="#e7a08c" stroke-width="4" stroke-dasharray="4 4" stroke-linecap="round" opacity=".65"/>'+
  '<g class="corps"><path d="M94 86 C128 90 154 114 154 142 C154 164 138 180 118 178 C100 176 90 162 84 148 C78 132 76 114 80 100 Z" fill="url(#peauR)"/>'+
  ombre+'<path d="M146 118 C156 140 152 164 134 176" fill="none" stroke="#7a2a1f" stroke-width="9"/></g></g>'+
  '<g class="jambe">'+ombre+'<path d="M134 168 C120 148 104 130 94 120" fill="none" stroke="#7a2a1f" stroke-width="7"/></g><path d="M142 170 C130 150 112 128 98 116 C90 110 82 116 86 124 C98 140 114 160 124 180 Z" fill="url(#peauR)" transform="scale('+(1+.06*gras)+')" transform-origin="142 170"/>'+
  '<g class="tibia"><path d="M90 114 C80 126 76 146 80 162 C82 168 90 169 92 163 C92 148 94 132 99 120 Z" fill="url(#peauR)"/><path d="M84 160 C76 160 68 166 70 172 C72 176 82 175 90 170 C93 167 91 161 84 160 Z" fill="url(#peauR)"/><path d="M72 170 L69 168 M74 172 L71 172 M77 173 L75 175" stroke="#b5604c" stroke-width=".9" stroke-linecap="round" opacity=".6"/></g></g>'+
  '<g class="tete"><path d="M80 32 C104 30 118 48 116 70 C114 88 100 100 82 100 C74 100 67 98 63 95 C59 93 57 90 58 88 C56 87 55 85 56 83 C54 81 53 79 54 77 C52 75 51 72 52 69 C52 58 55 46 63 40 C68 35 74 32 80 32 Z" fill="url(#peauR)"/>'+
  '<ellipse cx="72" cy="48" rx="14" ry="9" fill="#fff" opacity=".2" filter="url(#flou3)"/>'+ombre+'<path d="M110 56 C118 74 110 92 92 100" fill="none" stroke="#7a2a1f" stroke-width="8"/></g>'+
  '<path d="M94 64 C100 60 106 64 105 72 C104 78 99 80 96 77 C98 74 100 71 98 68" fill="none" stroke="#b5604c" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>'+
  '<path d="M58 62 C62 65 68 65 72 62" fill="none" stroke="#8a3a2e" stroke-width="1.5" stroke-linecap="round"/><path d="M59 62 C63 59 68 59 72 62" fill="#c9806b" opacity=".35"/>'+
  '<path d="M57 55 C62 52 68 52 73 55" fill="none" stroke="#b5604c" stroke-width=".9" opacity=".45"/>'+
  '<path d="M56 83 C58 85 60 85 61 84" fill="none" stroke="#9a3f31" stroke-width="1.3" stroke-linecap="round" opacity=".75"/>'+
  '<ellipse cx="68" cy="76" rx="7" ry="5" fill="#e98f7c" opacity=".3" filter="url(#flou3)"/>'+
  (w>=28?'<path d="M84 34 C98 33 110 40 114 52" fill="none" stroke="#9b5b45" stroke-width="2" stroke-dasharray="1 2.5" opacity=".4"/>':'')+
  '<g class="bras">'+ombre+'<path d="M100 104 C104 118 100 128 92 132" fill="none" stroke="#7a2a1f" stroke-width="7"/></g>'+
  '<path d="M106 98 C110 112 108 124 100 132 C95 136 89 133 91 127 C95 119 96 109 96 102 Z" fill="url(#peauR)"/>'+
  '<g class="avantbras"><path d="M98 134 C88 128 78 116 72 106 C69 101 73 97 77 99 C83 108 92 118 100 124 Z" fill="url(#peauR)"/>'+
  '<path d="M66 103 C62 100 62 94 66 92 C70 90 74 94 76 98 C78 102 76 106 72 107 C69 108 67 106 66 103 Z" fill="url(#peauR)"/><path d="M66 96 L62 93 M67 99 L62 98 M68 102 L64 103" stroke="#b5604c" stroke-width=".9" stroke-linecap="round" opacity=".6"/></g></g>'+
  '<circle class="coeur" cx="102" cy="118" r="'+(4+2*c)+'" fill="#c0392b" opacity="'+(.35+.4*transl)+'" filter="url(#flou1)"/>'+
  (transl>0?'<path d="M80 50 C90 60 88 80 98 90 M120 112 C128 130 134 146 130 166" fill="none" stroke="#c0392b" stroke-width="1" opacity="'+(.35*transl)+'"/>':'')+
  '</g>'}
function svgBebe(w,id){const s=(w<8?.55+(w-4)*.06:.62+.48*Math.min(1,(w-8)/32)),b=bpm(w),M=mouvement(w);
  return '<div class="bebe-zone reel '+M[3]+'" id="'+(id||'bebeZone')+'" style="--bpm:'+(b?60/b:1)+'s"><svg viewBox="0 0 200 200" role="img" aria-label="Bébé à '+w+' semaines dans le liquide amniotique"><defs>'+
   '<radialGradient id="ventre" cx="45%" cy="40%" r="70%"><stop offset="0%" stop-color="#ffb98f"/><stop offset="35%" stop-color="#e8784f"/><stop offset="70%" stop-color="#a53b25"/><stop offset="100%" stop-color="#3d0e08"/></radialGradient>'+
   '<radialGradient id="peauR" cx="30%" cy="25%" r="85%"><stop offset="0%" stop-color="'+(w<16?'#ffd4c4':'#ffe0cf')+'"/><stop offset="45%" stop-color="'+(w<16?'#f19c88':'#f2b49a')+'"/><stop offset="80%" stop-color="'+(w<16?'#cf6650':'#d98468')+'"/><stop offset="100%" stop-color="#9c4231"/></radialGradient>'+
   '<radialGradient id="embryon" cx="35%" cy="30%" r="80%"><stop offset="0%" stop-color="#ffd9cc"/><stop offset="60%" stop-color="#ee9a85"/><stop offset="100%" stop-color="#c25a45"/></radialGradient>'+
   '<radialGradient id="placenta" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#b8402f"/><stop offset="100%" stop-color="#5e1810"/></radialGradient>'+
   '<filter id="flou1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter><filter id="flou3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter><filter id="doux" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".6"/></filter>'+
   '<filter id="eau" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".018 .03" numOctaves="2" seed="4"><animate attributeName="baseFrequency" dur="18s" values=".018 .03;.024 .022;.018 .03" repeatCount="indefinite"/></feTurbulence><feColorMatrix values="0 0 0 0 1  0 0 0 0 .85  0 0 0 0 .7  0 0 0 .55 -.18"/></filter>'+
   '<clipPath id="sac"><circle cx="100" cy="100" r="94"/></clipPath></defs>'+
   '<g clip-path="url(#sac)"><rect width="200" height="200" fill="url(#ventre)"/>'+
   '<path d="M150 -10 C200 10 214 60 196 92 C176 70 152 40 150 -10 Z" fill="url(#placenta)" opacity=".85"/><path d="M168 20 C176 40 186 56 196 70 M160 10 C166 30 174 46 186 60" stroke="#e05a44" stroke-width="1.2" fill="none" opacity=".5"/>'+
   '<rect width="200" height="200" filter="url(#eau)" opacity=".5"/>'+
   '<g class="flotte"><g class="tourne" transform="rotate('+(S.bebeRot||0)+' 100 100)"><g transform="translate(100 100) scale('+(S.bebeMiroir?-s:s)+' '+s+') translate(-102 -106)">'+dessinReel(w)+'</g></g></g>'+
   '<circle cx="46" cy="58" r="1.6" fill="#ffe7d6" opacity=".7" class="bulle b1"/><circle cx="150" cy="140" r="2.2" fill="#ffe7d6" opacity=".6" class="bulle b2"/><circle cx="64" cy="150" r="1.3" fill="#ffe7d6" opacity=".6" class="bulle b3"/><circle cx="132" cy="62" r="1" fill="#ffe7d6" opacity=".8" class="bulle b2"/><circle cx="30" cy="110" r="1.4" fill="#ffe7d6" opacity=".6" class="bulle b1"/>'+
   '<circle class="lueurR" cx="70" cy="56" r="60" fill="#fff3e6" opacity=".12" filter="url(#flou3)"/></g>'+
   '<circle cx="100" cy="100" r="94" fill="none" stroke="#f4c7b3" stroke-width="2" opacity=".6"/><circle cx="100" cy="100" r="91" fill="none" stroke="#fff" stroke-width="1" opacity=".15"/></svg></div>'}
const _carteBebeR=carteBebe;
carteBebe=function(g){const w=Math.max(4,Math.min(42,g.w)),f=fruit(w),M=mouvement(w);let h=_carteBebeR(g);
  const stats='<div class="mesures"><div><b class="num">'+cm(f[1])+' cm</b><span>taille</span></div><div><b class="num">'+(f[2]?poidsTexte(f[2]):'< 1 g')+'</b><span>poids</span></div><div><b class="num">'+(bpm(w)||'—')+'</b><span>battements / min</span></div></div>';
  const mv='<div class="banner acc">'+icon('fa-person-swimming')+'<div class="small"><b>Comment bébé bouge en ce moment :</b> '+M[2]+'</div></div>';
  const i=h.indexOf('<div class="fruit-l">');if(i>=0)h=h.slice(0,i)+stats+mv+h.slice(i);
  return h.replace(' (moyenne)</p>',' en moyenne. Chaque bébé grandit à son rythme.</p>')};
