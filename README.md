# unimark.app

Unimark makes it easy to manage all of your bookmarks. Use our cloud or as a self-hosted and own your data.

## Install locally

```bash
git clone https://github.com/unimarkapp/unimark.app.git
cd unimark
pnpm install
```

```bash
pnpm add turbo -g

dotenv -e .env.development -- turbo dev --filter @unimark/server
dotenv -e .env.development -- turbo dev --filter @unimark/client

// OR

dotenv -e .env.development -- turbo dev
```

## Install with docker

```bash
git clone https://github.com/unimarkapp/unimark.app.git
cd unimark
docker compose up -d --build
```
