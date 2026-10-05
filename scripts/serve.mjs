// A minimal static server for dist/, used by the tests and the benchmark. Like a production
// server it compresses text responses (brotli quality 11, else gzip level 9, the same settings
// as the size tables) but sends no-store, so every startup sample downloads everything.
// `node scripts/serve.mjs` serves on PORT (default 4321).
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';
import { DIST } from './lib/config.mjs';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const cache = new Map();

/** The file's bytes in the best encoding the client accepts, compressed once and cached. */
function encoded(path, accept) {
  const encoding = /\bbr\b/.test(accept) ? 'br' : /\bgzip\b/.test(accept) ? 'gzip' : 'identity';
  const key = `${encoding}:${path}`;
  let body = cache.get(key);
  if (body === undefined) {
    const raw = readFileSync(path);
    body =
      encoding === 'br'
        ? brotliCompressSync(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } })
        : encoding === 'gzip'
          ? gzipSync(raw, { level: 9 })
          : raw;
    cache.set(key, body);
  }
  return { encoding, body };
}

export function startServer(port = 0) {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let path = normalize(join(DIST, decodeURIComponent(url.pathname)));
    if (!path.startsWith(DIST)) {
      res.writeHead(403).end();
      return;
    }
    if (url.pathname === '/') {
      res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end('gyral-benchmarks');
      return;
    }
    if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
    if (!existsSync(path)) {
      res.writeHead(404).end('Not found');
      return;
    }
    const { encoding, body } = encoded(path, String(req.headers['accept-encoding'] ?? ''));
    res.writeHead(200, {
      'content-type': TYPES[extname(path)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
      'content-length': body.length,
      ...(encoding === 'identity' ? {} : { 'content-encoding': encoding, vary: 'accept-encoding' }),
    });
    res.end(body);
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      const address = server.address();
      resolve({
        url: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { url } = await startServer(Number(process.env.PORT ?? 4321));
  console.log(`serving dist/ at ${url}`);
}
