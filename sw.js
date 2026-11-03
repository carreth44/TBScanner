// Service worker de TBScanner : l'appli fonctionne hors ligne après une première ouverture en ligne.
// - Page et icônes : servies depuis le cache tout de suite, mises à jour en arrière-plan
//   (une nouvelle version s'affiche donc à l'ouverture suivante).
// - Moteur ONNX Runtime (jsDelivr, version épinglée = fichiers immuables) : cache d'abord.
// - Modèles PaddleOCR : déjà gardés par la page elle-même (cache « tbModeles.v1 »), on n'y touche pas.
const VERSION = 'tbscanner-v1';
const ORT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.1/dist/';
const PRECACHE = ['./', 'index.html', 'manifest.json', 'icone-192.png', 'icone-512.png',
  ORT + 'ort.wasm.min.js', ORT + 'ort-wasm-simd-threaded.mjs', ORT + 'ort-wasm-simd-threaded.wasm'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('tbscanner-') && k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.pathname.includes('/ocr-models@')) return;
  if (url.origin === location.origin) {
    // cache tout de suite + mise à jour en arrière-plan
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      const enCache = await c.match(req, { ignoreSearch: true });
      const reseau = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
      if (enCache) { e.waitUntil(reseau); return enCache; }
      return (await reseau) || (req.mode === 'navigate' && await c.match('index.html')) || Response.error();
    })());
  } else if (url.href.startsWith(ORT)) {
    e.respondWith(caches.open(VERSION).then(async c => (await c.match(req)) || fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; })));
  }
});
