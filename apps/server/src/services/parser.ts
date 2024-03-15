import { parse } from "node-html-parser";
import z from "zod";

const META_TAGS = [
  "title",
  "description",
  "icon",
  "shortcut icon",
  "apple-touch-icon",
  "og:title",
  "og:description",
  "og:image",
  "twitter:title",
  "twitter:description",
  "twitter:image",
];

export async function parser(url: string) {
  try {
    const html = await fetchHTML(url);
    if (!html) {
      return createEmptyMetadata();
    }

    const document = parse(html);
    const metadata = parseMetadata(document);

    return createMetadata(metadata, document, url);
  } catch (error) {
    return createEmptyMetadata();
  }
}

async function fetchHTML(url: string) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "text/html",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });

  return response.text();
}

function parseMetadata(document: ReturnType<typeof parse>) {
  const metadata: Record<string, string> = {};

  document.querySelectorAll("meta").forEach(({ attributes }) => {
    const property = attributes.property || attributes.name || attributes.href;
    if (!metadata[property] && META_TAGS.includes(property)) {
      metadata[property] = attributes.content;
    }
  });

  document.querySelectorAll("link").forEach(({ attributes }) => {
    const { rel, href } = attributes;
    if (rel && href && META_TAGS.includes(rel)) {
      metadata[rel] = href;
    }
  });

  return metadata;
}

function createMetadata(
  metadata: Record<string, string>,
  document: ReturnType<typeof parse>,
  url: string
) {
  const title =
    metadata["og:title"] ||
    metadata["twitter:title"] ||
    document.querySelector("title")?.innerText ||
    url;

  const description =
    metadata["og:description"] || metadata["description"] || "";

  const cover = getCover(metadata);

  const favicon = getFavIconImage(metadata);

  return {
    title,
    description,
    favicon: favicon ? generateFaviconURL(url, favicon) : "",
    cover: cover || "",
  };
}

function getCover(metadata: Record<string, string>) {
  return metadata["og:image"] || metadata["twitter:image"];
}

function getFavIconImage(metadata: Record<string, string>) {
  return (
    metadata["apple-touch-icon"] ||
    metadata["icon"] ||
    metadata["shortcut icon"]
  );
}

function createEmptyMetadata() {
  return { title: "", description: "", cover: "", favicon: "" };
}

function generateFaviconURL(url: string, faviconPath: string) {
  const isFaviconPathURL = z.string().url().safeParse(faviconPath);

  if (isFaviconPathURL.success) {
    return faviconPath;
  }

  const { origin } = new URL(url);

  return `${origin}${faviconPath}`;
}
