// Service worker de TBScanner : l'appli fonctionne hors ligne après une première ouverture en ligne.
// - Page et icônes : RÉSEAU D'ABORD (sans le cache HTTP, sinon GitHub Pages ressert l'ancienne version
//   pendant 10 min), copie gardée pour le hors ligne ; si le réseau ne répond pas en 4 s → copie en cache.
// - Requêtes « no-store » (vérification de mise à jour par la page) : réseau direct, jamais mises en cache.
// - Moteur ONNX Runtime (jsDelivr, version épinglée = fichiers immuables) : cache d'abord.
// - Modèles PaddleOCR : déjà gardés par la page elle-même (cache « tbModeles.v1 »), on n'y touche pas.
const VERSION = 'tbscanner-v2';
const ORT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.1/dist/';
const PRECACHE = ['./', 'index.html', 'manifest.json', 'icone-192.png', 'icone-512.png',
  ORT + 'ort.wasm.min.js', ORT + 'ort-wasm-simd-threaded.mjs', ORT + 'ort-wasm-simd-threaded.wasm'];
const DELAI_RESEAU = 4000;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(PRECACHE.map(u => new Request(u, { cache:'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('tbscanner-') && k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.pathname.includes('/ocr-models@') || req.cache === 'no-store') return;
  if (url.origin === location.origin) {
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      const reseau = fetch(req, { cache:'no-cache' })
        .then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
      const delai = new Promise(ok => setTimeout(() => ok(null), DELAI_RESEAU));
      const r = await Promise.race([reseau, delai]);
      if (r) return r;
      e.waitUntil(reseau);                      // le réseau finira peut-être : la copie sera à jour la prochaine fois
      return (await c.match(req, { ignoreSearch:true })) || (req.mode === 'navigate' && await c.match('index.html'))
          || (await reseau) || Response.error();
    })());
  } else if (url.href.startsWith(ORT)) {
    e.respondWith(caches.open(VERSION).then(async c => (await c.match(req)) || fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; })));
  }
});
