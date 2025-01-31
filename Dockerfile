FROM oven/bun:latest AS base
WORKDIR /app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun install --frozen-lockfile && bun run build

FROM base AS runner
WORKDIR /app
RUN bun install drizzle-kit dotenv -D --frozen-lockfile && \
  bun install drizzle-orm --frozen-lockfile
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/database ./database
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

USER bun
ENV NODE_ENV=production
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["bun", "start"]