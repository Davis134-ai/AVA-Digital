const CACHE_NAME = "ava-cache-v2";

// Files to cache on install
const FILES_TO_CACHE = [
  "/home.html",
  "/index.html",
  "/profile.html",
  "/task.html",
  "/level.html",
  "/invest.html",
  "/style.css",
  "/supabase.js",
  "/auth.js",
  "/icon-192.png",
  "/icon-512.png"
];

// Install - cache files safely
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use Promise.allSettled to avoid failing if one file is missing
      return Promise.allSettled(
        FILES_TO_CACHE.map(file => cache.add(file))
      );
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch - network first for navigation, cache first for assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Bypass service worker for Supabase API calls
  if (url.hostname.includes("supabase.co")) {
    return;
  }

  // For navigation (HTML pages) - network first, cache fallback
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the fresh response
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(async () => {
          // Network failed - try cache
          const cached = await caches.match(event.request);
          if (cached) return cached;
          // If no cache, return offline fallback
          return caches.match("/home.html");
        })
    );
    return;
  }

  // For assets (CSS, JS, images) - cache first, network fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});