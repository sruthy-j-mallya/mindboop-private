# Dockerizing the application

This note lists the files added or changed to run Mindboop’s web UI in Docker, and why each change exists.

## Scope

- **In scope:** package the React/Vite frontend as a container and serve it with nginx.
- **Out of scope:** running the Tauri desktop window, Android, or iOS inside Docker. Those need a native OS, GPU/display, and (for mobile) SDKs that do not belong in a simple web image.

The greet form still calls `@tauri-apps/api` `invoke("greet")`. In a browser-only container that IPC is unavailable, so Greet will fail until a web fallback exists. The rest of the template UI loads normally.

## Files added

| File | Purpose |
| --- | --- |
| `Dockerfile` | Multi-stage image: Node 22.14.0 + pnpm 11.11.0 (same pins as `mise.toml`) build `pnpm build`, then copy `dist/` into `nginx:1.27-alpine`. Exposes port 80 and includes an HTTP healthcheck. |
| `.dockerignore` | Keeps the build context small and avoids sending `node_modules`, `src-tauri`, git metadata, and docs into the daemon. |
| `nginx.conf` | Serves the SPA with `try_files` so client-side routes fall back to `index.html`. Gzip for common static types. |
| `docker-compose.yml` | Builds image `mindboop-web:local` and maps host **8080** → container **80**. |
| `docs/dockerize-the-application.md` | This changelog. |

## Files changed

| File | Change |
| --- | --- |
| `README.md` | New **Docker (web UI)** section: Compose and `docker build`/`docker run` commands, URL, and the Tauri limitation. |

## How to run

```bash
docker compose up --build
```

Open http://localhost:8080.

Without Compose:

```bash
docker build -t mindboop-web .
docker run --rm -p 8080:80 mindboop-web
```

## Image layout

1. **build** stage: `corepack` enables pnpm 11.11.0 (`COREPACK_ENABLE_AUTO_PIN=0` so Corepack does not rewrite `package.json`), `pnpm install --frozen-lockfile`, then `pnpm build` (`tsc` + `vite build`).
2. **runtime** stage: nginx only; no Node, no Rust, no Tauri CLI. Image size stays small and the attack surface is the static files plus nginx.

## Test plan

- [ ] `docker compose up --build` completes without install or TypeScript errors.
- [ ] http://localhost:8080 shows the Tauri + React welcome page (logos and greet form).
- [ ] `docker build -t mindboop-web .` then `docker run --rm -p 8080:80 mindboop-web` behaves the same.
- [ ] Native workflows are unchanged: `pnpm tauri dev`, `pnpm tauri android dev`, `pnpm tauri ios dev`, `pnpm dev`.
