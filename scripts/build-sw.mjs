import { readdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../dist/", import.meta.url);
const rootPath = root.pathname.replace(/^\/(?:([A-Za-z]):)/, "$1:");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return files.flat();
}

const files = (await walk(rootPath))
  .map((path) => relative(rootPath, path).replaceAll("\\", "/"))
  .filter((path) => path !== "sw.js" && path !== "og.png")
  .map((path) => `./${path}`)
  .sort();

const cacheKey = `liftlog-${Date.now().toString(36)}`;
const source = `const CACHE = ${JSON.stringify(cacheKey)};
const PRECACHE = ${JSON.stringify(files, null, 2)};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith("liftlog-") && key !== CACHE).map((key) => caches.delete(key)),
  )));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok && new URL(event.request.url).origin === self.location.origin) {
      caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
    }
    return response;
  }).catch(() => caches.match("./index.html"))));
});
`;

await writeFile(join(rootPath, "sw.js"), source);
console.log(`Generated offline cache with ${files.length} files.`);
