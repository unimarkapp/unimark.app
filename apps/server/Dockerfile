# base node image
FROM node:20-bullseye-slim as base
 
FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @unimark/server --docker
 
FROM base AS runner
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

RUN turbo run build --filter=@unimark/server
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 trpc
USER trpc

WORKDIR /app/apps/server
 
CMD ["pnpm", "run", "start"]