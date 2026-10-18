self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{
const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('daily-word-')).map(k=>caches.delete(k)));
await self.registration.unregister();await self.clients.claim();
})()));
