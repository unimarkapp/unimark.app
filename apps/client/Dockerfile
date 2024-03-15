# base node image
FROM node:20-bullseye-slim as base

FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @bookmark/client --docker

FROM base as installer
WORKDIR /app

RUN npm install -g pnpm
RUN npm install -g turbo

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN turbo run build --filter=@bookmark/client

# Use the official Caddy image as the base image
FROM caddy:2.6.4-alpine
  
# Set the working directory inside the container
WORKDIR /usr/share/caddy
  
# Copy the built Vite React app from the previous stage to the Caddy web root
COPY --from=installer /app/apps/client/dist .
  
# Expose port 80 for HTTP traffic
EXPOSE 80
  
# Set the command to start Caddy and serve the Vite React app
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]