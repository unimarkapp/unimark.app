# bookmark.app

Bookmark is a self-hosted solution for your bookmark.

## Install locally

```bash
git clone https://github.com/romanslonov/bookmark.git
cd bookmark
pnpm install
```

```bash
pnpm add turbo -g

dotenv -e .env.development -- turbo dev --filter @bookmark/server
dotenv -e .env.development -- turbo dev --filter @bookmark/client

// OR

dotenv -e .env.development -- turbo dev
```

## Install with docker

```bash
git clone https://github.com/romanslonov/bookmark.git
cd bookmark
docker compose up -d --build
```
