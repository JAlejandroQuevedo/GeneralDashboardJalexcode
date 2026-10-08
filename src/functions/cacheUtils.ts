export const clearMediaCache = async (messages: any[], cacheName: string) => {
  if (!("caches" in window)) return;

  const cache = await caches.open(cacheName);

  for (const msg of messages) {
    if (msg.media_id) {
      const requestUrl = `/api/media/${msg.media_id}`;
      const matchedResponse = await cache.match(requestUrl);

      if (matchedResponse) {
        await cache.delete(requestUrl);
        console.log(`Caché liberado para media_id: ${msg.media_id}`);
      }
    }
  }
};
