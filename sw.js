/* Sérénaissance — appli des doulas et des familles (service worker).
   Toujours la version la plus récente quand il y a Internet; Supabase ne passe jamais par le cache.
   Reçoit les notifications (messages, rendez-vous, documents, rappels, mot du jour). */
var VERSION = 'sere-app-v125';
var BASE = self.registration.scope;
var BEBE3D = 'sere-bebe3d-v1'; /* gros modèles 3D de bébé : gardés sur le téléphone, téléchargés une seule fois */
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(['./', 'style.css', 'logo.png', 'icones/icone-192.png']).catch(function () {}); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (l) { return Promise.all(l.filter(function (k) { return k !== VERSION && k !== BEBE3D; }).map(function (k) { return caches.delete(k); })); })
    /* la 3D n'existe plus : on libère la place des anciens modèles .glb gardés sur le téléphone (les photos du cache restent) */
    .then(function () { return caches.open(BEBE3D).then(function (c) { return c.keys().then(function (ks) { return Promise.all(ks.filter(function (r) { return /\.glb(\?|$)/.test(r.url); }).map(function (r) { return c.delete(r); })); }); }).catch(function () {}); })
    .then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request; if (req.method !== 'GET') return;
  var url = new URL(req.url);
  var ok = url.origin === self.location.origin || /^(cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/.test(url.hostname);
  if (url.hostname === 'images.unsplash.com') ok = true;
  if (!ok || url.search.indexOf('token_hash') >= 0 || url.pathname.endsWith('version.json')) return;
  if (url.hostname === 'images.unsplash.com') { /* photos de bébés : gardées sur le téléphone après le premier affichage */
    e.respondWith(caches.open(BEBE3D).then(function (c) { return c.match(req).then(function (r) { return r || fetch(req).then(function (rep) { if (rep && (rep.ok || rep.type === 'opaque')) c.put(req, rep.clone()); return rep; }); }); }));
    return;
  }
  if (url.origin === self.location.origin && /\/img\/bebe3d\/(serie\/|sphere-)/.test(url.pathname)) {
    e.respondWith(caches.open(BEBE3D).then(function (c) { return c.match(req).then(function (r) { return r || fetch(req).then(function (rep) { if (rep && rep.ok) c.put(req, rep.clone()); return rep; }); }); }));
    return;
  }
  /* fichiers versionnés (?v=…) et bibliothèques à version fixe : pris sur le téléphone s'ils y sont déjà (ouverture rapide) */
  if ((url.origin === self.location.origin && /[?&]v=\d+/.test(url.search)) || url.hostname === 'cdnjs.cloudflare.com') {
    e.respondWith(caches.open(VERSION).then(function (c) { return c.match(req).then(function (r) { return r || fetch(req).then(function (rep) { if (rep && (rep.ok || rep.type === 'opaque')) c.put(req, rep.clone()); return rep; }); }); }));
    return;
  }
  e.respondWith(fetch(req.mode === 'navigate' || url.origin === self.location.origin ? new Request(req.url, { cache: 'no-store' }) : req).then(function (rep) {
    if (rep && (rep.ok || rep.type === 'opaque')) { var copie = rep.clone(); caches.open(VERSION).then(function (c) { c.put(req, copie); }); }
    return rep;
  }).catch(function () { return caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(function (r) { return r || caches.match('./'); }); }));
});
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { titre: 'Sérénaissance', message: e.data ? e.data.text() : '' }; }
  var url = d.url && /^https?:/.test(d.url) ? d.url : BASE;
  var options = { body: d.message || '', icon: 'icones/icone-192.png', badge: 'icones/icone-192.png', data: { url: url }, tag: d.tag || undefined, renotify: !!d.tag };
  if (d.vibration !== false) options.vibrate = [200, 100, 200, 100, 200];
  var avis = self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (l) { l.forEach(function (c) { c.postMessage({ type: 'push', donnees: d }); }); });
  e.waitUntil(Promise.all([avis, self.registration.showNotification(d.titre || 'Sérénaissance', options)]));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || BASE;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (l) {
    for (var i = 0; i < l.length; i++) { if (l[i].url.indexOf(BASE) === 0 && 'focus' in l[i]) { l[i].navigate(url); return l[i].focus(); } }
    return self.clients.openWindow(url);
  }));
});

self.addEventListener('message', function (e) { if (e.data === 'skipWaiting') self.skipWaiting(); });
