/* Académie Sérénaissance — réglages des notifications (appli Admin et comptes étudiantes).
   Reglages.monter(element, { sb, vapid, admin, surPush })
   Reglages.sonner()  → petit carillon au volume choisi (quand l'appli est ouverte) + vibration */
(function () {
  'use strict';
  var CLE = 'sere-reglages';
  var opts = null, racine = null, audio = null;
  var APPLI = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  function L(fr, en) { return EN ? en : fr; }
  var IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  function lire() {
    var d = { son: true, vibration: true, volume: 70, touches: true };
    try { var x = JSON.parse(localStorage.getItem(CLE) || '{}'); for (var k in x) d[k] = x[k]; } catch (e) {}
    return d;
  }
  function ecrire(d) { try { localStorage.setItem(CLE, JSON.stringify(d)); } catch (e) {} }
  function cleVapid(b) {
    var p = '='.repeat((4 - b.length % 4) % 4), s = atob((b + p).replace(/-/g, '+').replace(/_/g, '/')), u = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
    return u;
  }

  /* Abonnement lié à la clé VAPID actuelle : si l'appareil en garde un ancien (autre clé, après le transfert des serveurs), on le remplace. */
  function memeCle(ab) {
    try {
      var k = ab.options && ab.options.applicationServerKey; if (!k) return false;
      var a = new Uint8Array(k), b = cleVapid(opts.vapid); if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
      return true;
    } catch (e) { return false; }
  }
  function abonner(reg) {
    return reg.pushManager.getSubscription().then(function (ab) {
      if (ab && memeCle(ab)) return ab;
      var p = ab ? ab.unsubscribe().catch(function () {}) : Promise.resolve();
      return p.then(function () { return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: cleVapid(opts.vapid) }); });
    });
  }
  /* Au démarrage : si les notifications sont déjà permises, on remet l'abonnement à jour sans rien demander. */
  window.srnReabonner = function () {
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window) || Notification.permission !== 'granted') return Promise.resolve();
    var tmp = false;
    if (!opts) { try { opts = { sb: sb, vapid: VAPID }; tmp = true; } catch (x) { return Promise.resolve(); } }
    return navigator.serviceWorker.ready.then(function (reg) { return abonner(reg); }).then(enregistrer).catch(function () {}).then(function () { if (tmp) opts = null; });
  };
  function q(sel) { return racine.querySelector(sel); }

  /* ---- Contexte audio partagé : débloqué dès le premier toucher (exigé par iOS/Android) ---- */
  function ctx(carillon) {
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      if (!audio) audio = new AC();
      /* le cœur de bébé joue : on ne repasse pas en mode « discret », sinon iOS coupe son son */
      var coeur = false; try { coeur = !!((typeof B3S !== 'undefined' && B3S) || (typeof AUD !== 'undefined' && AUD)); } catch (e) {}
      try { if (navigator.audioSession) navigator.audioSession.type = (carillon || coeur) ? 'playback' : 'ambient'; } catch (e) {}
      if (audio.state !== 'running') audio.resume();
      return audio;
    } catch (e) { return null; }
  }
  function debloquer() {
    var a = ctx(false);
    if (a && a.state === 'running' || (a && a.state === 'suspended')) {
      try { var b = a.createBuffer(1, 1, 22050), s = a.createBufferSource(); s.buffer = b; s.connect(a.destination); s.start(0); } catch (e) {}
    }
  }
  ['touchstart', 'pointerdown', 'keydown', 'click'].forEach(function (n) { document.addEventListener(n, debloquer, { capture: true, passive: true }); });
  /* ---- Petit « tic » doux à chaque bouton touché ---- */
  var dernierTap = 0;
  var SONS_TOUCHE = [['goutte', 'Goutte', 'Drop'], ['bulle', 'Bulle', 'Bubble'], ['bois', 'Bois', 'Wood'], ['cristal', 'Cristal', 'Crystal'], ['clic', 'Clic sec', 'Dry click'], ['clochette', 'Clochette', 'Little bell'], ['aucun', 'Aucun', 'None']];
  var SONS_MSG = [['carillon', 'Carillon', 'Chime'], ['harpe', 'Harpe', 'Harp'], ['cristal', 'Cristal', 'Crystal'], ['berceuse', 'Berceuse', 'Lullaby'], ['cloche', 'Cloche douce', 'Soft bell'], ['goutte', 'Gouttes', 'Drops'], ['aucun', 'Aucun', 'None']];
  function note(a, t, f, f2, dur, type, vol, att) {
    var o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur * 0.8);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0002), t + (att || 0.01)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.03);
  }
  function jouerTouche(a, nom, vol) {
    var t = a.currentTime;
    if (nom === 'goutte') note(a, t, 1200, 600, 0.09, 'sine', vol);
    else if (nom === 'bulle') note(a, t, 380, 900, 0.1, 'sine', vol * 1.2);
    else if (nom === 'bois') { note(a, t, 520, 260, 0.06, 'triangle', vol * 1.5, 0.003); }
    else if (nom === 'cristal') { note(a, t, 2093, 0, 0.16, 'sine', vol * 0.8); note(a, t, 3136, 0, 0.1, 'sine', vol * 0.4); }
    else if (nom === 'clic') {
      var n = Math.floor(a.sampleRate * 0.012), buf = a.createBuffer(1, n, a.sampleRate), dd = buf.getChannelData(0);
      for (var i = 0; i < n; i++) dd[i] = (Math.random() * 2 - 1) * (1 - i / n);
      var s = a.createBufferSource(), g = a.createGain(), h = a.createBiquadFilter(); h.type = 'highpass'; h.frequency.value = 1800; g.gain.value = vol * 3;
      s.buffer = buf; s.connect(h); h.connect(g); g.connect(a.destination); s.start(t);
    } else if (nom === 'clochette') { note(a, t, 1760, 0, 0.22, 'sine', vol * 0.9); note(a, t, 2637, 0, 0.14, 'sine', vol * 0.35); }
  }
  function tap(forcer) {
    var d = lire(); if (!forcer && d.touches === false) return;
    var nom = d.sonTouche || 'goutte'; if (nom === 'aucun') return;
    var now = Date.now(); if (now - dernierTap < 60) return; dernierTap = now;
    var a = ctx(false); if (!a) return;
    try { jouerTouche(a, nom, Math.max(0, Math.min(1, (d.volume || 0) / 100)) * 0.22); } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest && e.target.closest('button, [data-act], .chip, .tile, .qbtn, a[href], summary, [role=tab], [role=switch], label.btn');
    if (!t || t.disabled || t.classList.contains('rg-test')) return;
    try { if (lire().vibration !== false && navigator.vibrate) navigator.vibrate(8); } catch (x) {}
    tap();
  }, true);

  /* ---- Son dans l'appli (volume réglable) ---- */
  function sonner(forcer, nom) {
    var d = lire();
    nom = nom || d.sonMsg || 'carillon';
    if (d.son && nom !== 'aucun' || (forcer && nom !== 'aucun')) try {
      var a = ctx(true), vol = Math.max(0, Math.min(1, (d.volume || 0) / 100)) * 0.5, t = a.currentTime;
      var Z = {
        carillon: [[880, 0, .5, 'sine'], [1318.5, .14, .5, 'sine']],
        harpe: [[523.3, 0, .7, 'triangle'], [659.3, .1, .7, 'triangle'], [784, .2, .7, 'triangle'], [1046.5, .3, .9, 'triangle']],
        cristal: [[1568, 0, .8, 'sine'], [2093, .12, .8, 'sine'], [2637, .24, 1, 'sine']],
        berceuse: [[659.3, 0, .5, 'triangle'], [587.3, .3, .5, 'triangle'], [523.3, .6, .9, 'triangle']],
        cloche: [[784, 0, 1.3, 'sine'], [1568, 0, .9, 'sine'], [2349, 0, .5, 'sine']],
        goutte: [[988, 0, .35, 'sine'], [740, .18, .45, 'sine']]
      };
      (Z[nom] || Z.carillon).forEach(function (n, i) { note(a, t + n[1], n[0], 0, n[2], n[3], vol * (nom === 'cloche' && i > 0 ? 0.4 : 1), 0.02); });
    } catch (e) {}
    if (d.vibration !== false && navigator.vibrate) try { navigator.vibrate([200, 100, 200]); } catch (e) {}
  }

  /* ---- Abonnement de cet appareil ---- */
  function abonnementActuel() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return Promise.resolve(null);
    return navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); }).catch(function () { return null; });
  }
  function enregistrer(ab) {
    var d = lire();
    var p = { p_endpoint: ab.endpoint, p_abonnement: ab.toJSON(), p_appareil: navigator.userAgent, p_prefs: { son: !!d.son, vibration: !!d.vibration } };
    /* l'Espace Doula et l'Espace Parents s'identifient : les avis de la propriétaire n'arrivent plus dans l'appli de l'Académie */
    if (window.ESPACE) { p.p_app = window.ESPACE === 'parent' ? 'parents-app' : 'doula-app'; return opts.sb.rpc('enregistrer_abonnement_app', p).then(function (r) { return r && r.error ? opts.sb.rpc('enregistrer_abonnement', { p_endpoint: p.p_endpoint, p_abonnement: p.p_abonnement, p_appareil: p.p_appareil, p_prefs: p.p_prefs }) : r; }); }
    return opts.sb.rpc('enregistrer_abonnement', p);
  }

  /* Activation directe (carte « Notifications » de l'accueil) : sans changer de page */
  window.srnActiverNotifs = function () {
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) return Promise.resolve('indisponible');
    var tmp = false;
    if (!opts) { try { opts = { sb: sb, vapid: VAPID }; tmp = true; } catch (x) { return Promise.resolve('indisponible'); } }
    return Notification.requestPermission().then(function (p) {
      if (p !== 'granted') return p;
      return navigator.serviceWorker.ready.then(function (reg) {
        return abonner(reg);
      }).then(enregistrer).then(function (r) { return r && r.error ? 'erreur' : 'granted'; });
    }).catch(function () { return 'erreur'; }).then(function (r) { if (tmp) opts = null; return r; });
  };

  function etat() {
    var e = q('.rg-etat'), act = q('.rg-activer'), reg = q('.rg-reglages'), off = q('.rg-desactiver');
    act.hidden = true; off.hidden = true; reg.hidden = false;
    var nom = opts.admin ? 'l\'appli Admin' : L('l\'appli Sérénaissance', 'the Sérénaissance app');
    if (IOS && !APPLI) {
      e.innerHTML = L('Sur iPhone et iPad, les notifications fonctionnent seulement dans <strong>' + nom + ' installée</strong> sur ton écran d\'accueil. Installe-la (voir plus bas), ouvre-la, puis reviens ici.',
        'On iPhone and iPad, notifications only work in <strong>' + nom + ' installed</strong> on your Home Screen. Install it (see below), open it, then come back here.');
      return;
    }
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) { e.textContent = L('Cet appareil ou ce navigateur ne permet pas les notifications. Les réglages de son s\'appliquent quand l\'appli est ouverte.', 'This device or browser does not support notifications. Sound settings apply while the app is open.'); return; }
    if (Notification.permission === 'denied') { e.innerHTML = L('Les notifications sont <strong>bloquées</strong> pour cet appareil. Sur iPhone : Réglages → Notifications → ' + (opts.admin ? 'Admin Séré' : 'Académie') + ' → Autoriser. Sur Android ou ordinateur : réglages du site dans le navigateur.',
      'Notifications are <strong>blocked</strong> on this device. On iPhone: Settings → Notifications → Sérénaissance → Allow. On Android or a computer: the site settings in your browser.'); return; }
    abonnementActuel().then(function (ab) {
      if (ab && Notification.permission === 'granted') {
        e.innerHTML = opts.admin ? '✅ <strong>Activées sur cet appareil.</strong> Tu es avertie des inscriptions, documents de stage, examens, fiches de marraine et messages.'
          : L('✅ <strong>Activées sur cet appareil.</strong> Tu es avertie quand Sabrina t\'écrit.', '✅ <strong>On for this device.</strong> You are notified when Sabrina writes to you.');
        off.hidden = false; enregistrer(ab);
      } else {
        e.textContent = opts.admin
          ? 'Reçois une alerte à chaque inscription, document de stage, examen, fiche de marraine ou message.'
          : L('Reçois une alerte sur ton cellulaire quand Sabrina te répond.', 'Get an alert on your phone when Sabrina replies.');
        act.hidden = false;
      }
    });
  }

  function monter(el, o) {
    opts = o; racine = el;
    var d = lire();
    el.innerHTML =
      '<h3 style="margin-bottom:6px;">🔔 Notifications</h3>' +
      '<p class="rg-etat" style="font-size:.88rem;color:var(--doux,#7a685e);margin-bottom:10px;"></p>' +
      '<div class="rg-actions" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px;"><button type="button" class="btn rg-activer" hidden>' + L('Activer les notifications', 'Turn on notifications') + '</button></div>' +
      '<div class="rg-reglages" style="display:flex;flex-direction:column;gap:12px;margin-top:8px;">' +
        '<label class="rg-ligne"><span><strong>' + L('Son', 'Sound') + '</strong><small>' + L('Un petit carillon à chaque notification', 'A little chime with each notification') + '</small></span><input type="checkbox" class="rg-son" role="switch"' + (d.son ? ' checked' : '') + '></label>' +
        '<label class="rg-ligne rg-vol"><span><strong>' + L('Volume dans l\'appli', 'In-app volume') + '</strong><small>' + L('Quand l\'appli est ouverte', 'While the app is open') + '</small></span><input type="range" class="rg-volume" min="0" max="100" step="5" value="' + (d.volume == null ? 70 : d.volume) + '"></label>' +
        '<p style="font-size:.78rem;color:var(--doux,#7a685e);">' + L('Appli fermée : le volume suit celui de ton téléphone. ', 'When the app is closed, the volume follows your phone. ') + (IOS ? L('Sur iPhone, tu peux aussi choisir le style d\'alerte dans Réglages → Notifications.', 'On iPhone, you can also choose the alert style in Settings → Notifications.') : '') + '</p>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;"><button type="button" class="btn gris rg-test">' + L('Essayer', 'Test') + '</button><button type="button" class="btn gris rg-desactiver" hidden>' + L('Désactiver sur cet appareil', 'Turn off on this device') + '</button></div>' +
      '</div>';
    // Carte repliable comme les autres sections (on clique sur « Notifications » pour la dérouler)
    if (window.SereRepliable && el.id) setTimeout(function () { SereRepliable.appliquer('#' + el.id); }, 0);
    if (!document.getElementById('rg-style')) {
      var st = document.createElement('style'); st.id = 'rg-style';
      st.textContent = '.rg-actions [hidden],.rg-reglages [hidden],.rg-reglages[hidden]{display:none!important}.rg-ligne{display:flex;align-items:center;justify-content:space-between;gap:14px;cursor:pointer}.rg-ligne span{display:flex;flex-direction:column;font-size:.92rem}.rg-ligne small{color:var(--doux,#7a685e);font-size:.78rem}' +
        '.rg-ligne input[type=checkbox]{appearance:none;-webkit-appearance:none;width:48px;height:28px;border-radius:50px;background:#d8cbbf;position:relative;cursor:pointer;flex-shrink:0;transition:background .2s;padding:0;border:0}' +
        '.rg-ligne input[type=checkbox]::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:left .2s}' +
        '.rg-ligne input[type=checkbox]:checked{background:var(--terra,#a85743)}.rg-ligne input[type=checkbox]:checked::after{left:23px}' +
        '.rg-ligne input[type=range]{width:45%;max-width:200px;accent-color:var(--terra,#a85743);padding:0;border:0;background:none}';
      document.head.appendChild(st);
    }
    function sauver(ch) {
      var x = lire(); for (var k in ch) x[k] = ch[k]; ecrire(x);
      abonnementActuel().then(function (ab) { if (ab && Notification.permission === 'granted') enregistrer(ab); });
    }
    q('.rg-son').addEventListener('change', function () { sauver({ son: this.checked }); if (this.checked) sonner(true); });
    q('.rg-volume').addEventListener('change', function () { sauver({ volume: +this.value }); sonner(true); });
    q('.rg-activer').addEventListener('click', function () {
      Notification.requestPermission().then(function (p) {
        if (p !== 'granted') { etat(); return; }
        return navigator.serviceWorker.ready.then(function (reg) {
          return abonner(reg);
        }).then(enregistrer).then(function (r) {
          if (r && r.error) alert(L('Abonnement non enregistré : ', 'Subscription not saved: ') + r.error.message);
          etat();
        });
      }).catch(function (e) { alert(L('Impossible d\'activer : ', 'Could not turn on: ') + e.message); });
    });
    q('.rg-desactiver').addEventListener('click', function () {
      abonnementActuel().then(function (ab) {
        if (!ab) return etat();
        return opts.sb.rpc('retirer_abonnement', { p_endpoint: ab.endpoint }).then(function () { return ab.unsubscribe(); }).then(etat);
      });
    });
    q('.rg-test').addEventListener('click', function () {
      var x = lire();
      sonner();
      if ('Notification' in window && Notification.permission === 'granted' && navigator.serviceWorker) {
        var icone = opts.admin ? 'icones/icone-192.png' : 'icones/icone-192.png', o = { body: L('Voici à quoi ressemblent tes notifications.', 'This is what your notifications look like.'), icon: icone, badge: icone, silent: !x.son };
        if (x.vibration) o.vibrate = [120, 60, 120];
        navigator.serviceWorker.ready.then(function (reg) { reg.showNotification('🌸 Test', o); });
      }
    });
    if (navigator.serviceWorker) navigator.serviceWorker.addEventListener('message', function (ev) {
      if (ev.data && ev.data.type === 'push') { if (document.visibilityState === 'visible') sonner(); else if (lire().vibration !== false && navigator.vibrate) try { navigator.vibrate([200, 100, 200]); } catch (x) {} if (opts.surPush) opts.surPush(ev.data.donnees || {}); }
    });
    etat();
  }

  window.Reglages = { monter: monter, sonner: sonner, lire: lire, tap: tap, regler: function (ch) { var x = lire(); for (var k in ch) x[k] = ch[k]; ecrire(x); }, listes: { touche: SONS_TOUCHE, msg: SONS_MSG } };
})();
