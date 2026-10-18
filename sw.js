const CACHE='daily-word-v11';
const ASSETS=['./','./index.html','./data.js','./connections.js','./guidance.json','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
 self.skipWaiting();
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('daily-word-')&&key!==CACHE).map(key=>caches.delete(key)))));
 self.clients.claim();
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 // Large Bible downloads should never be intercepted or cached by the service worker.
 if(url.pathname.endsWith('/bible.json'))return;
 event.respondWith((async()=>{
  try{
   const response=await fetch(event.request);
   if(response.ok&&url.origin===self.location.origin){
    const copy=response.clone();
    event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{}));
   }
   return response;
  }catch(err){
   const cached=await caches.match(event.request);
   if(cached)return cached;
   return Response.error();
  }
 })());
});
