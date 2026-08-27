# Build the Vite frontend, then serve the static files with nginx.
# The native Tauri shell is not included; this image is the web UI only.

FROM node:22.14.0-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.11.0 --activate
ENV COREPACK_ENABLE_AUTO_PIN=0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY index.html vite.config.ts tsconfig.json tsconfig.node.json ./
COPY src ./src
COPY public ./public

RUN pnpm build

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
