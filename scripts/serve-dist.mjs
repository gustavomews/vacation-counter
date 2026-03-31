import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");
const port = Number.parseInt(process.env.PORT ?? "5500", 10);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".env": "text/plain; charset=utf-8"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const cleanPath = decoded === "/" ? "/index.html" : decoded;
  const normalized = normalize(cleanPath).replace(/^\.\.(\/|\\|$)+/, "");
  return join(distDir, normalized);
}

const server = createServer((req, res) => {
  const method = req.method ?? "GET";

  if (method !== "GET" && method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method Not Allowed");
    return;
  }

  const path = safePath(req.url ?? "/");

  if (!path.startsWith(distDir)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  if (!existsSync(path) || statSync(path).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  const ext = extname(path).toLowerCase();
  const contentType = contentTypes[ext] ?? "application/octet-stream";
  const file = readFileSync(path);

  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });

  if (method === "HEAD") {
    res.end();
    return;
  }

  res.end(file);
});

server.listen(port, () => {
  console.log(`Servidor local em http://localhost:${port}`);
  console.log("Servindo arquivos de ./dist");
});
