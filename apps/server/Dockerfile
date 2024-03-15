# base node image
FROM node:20-bullseye-slim as base
 
FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @bookmark/server --docker
 
FROM base AS installer
WORKDIR /app

RUN npm install -g pnpm
RUN npm install -g turbo
 
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install
 
# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN turbo run build --filter=@bookmark/server
 
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 trpc
USER trpc

COPY --from=installer --chown=trpc:nodejs /app .
 
CMD ["node", "apps/server/dist/index.js"]