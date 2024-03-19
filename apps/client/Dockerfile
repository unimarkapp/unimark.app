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

FROM base as final
  
# Set the working directory inside the container
WORKDIR /dist
  
# Copy the built Vite React app from the previous stage to the container root
COPY --from=installer /app/apps/client/dist .