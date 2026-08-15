import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputArgument = process.argv.slice(2).find((value) => value !== "--");
const distDir = path.resolve(
  projectRoot,
  outputArgument || ".vercel/output/static",
);
const canonicalOrigin = "https://devstoremx.xyz";
const errors = [];

try {
  await fs.access(distDir);
} catch {
  throw new Error(`Static output folder not found: ${distDir}`);
}

const readFilesRecursively = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? readFilesRecursively(entryPath) : entryPath;
    }),
  );
  return files.flat();
};

const attribute = (tag, name) =>
  tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, "i"))?.[1];

const tags = (html, name) =>
  html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) || [];

const routeExists = async (pathname) => {
  const decodedPath = decodeURIComponent(pathname).replace(/\/+$/, "") || "/";
  const relativePath = decodedPath === "/" ? "" : decodedPath.slice(1);
  const candidates = path.extname(relativePath)
    ? [path.join(distDir, relativePath)]
    : [
        path.join(distDir, relativePath, "index.html"),
        path.join(distDir, `${relativePath}.html`),
      ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return true;
    } catch {
      // Try the next generated-path convention.
    }
  }
  return false;
};

const htmlFiles = (await readFilesRecursively(distDir)).filter((file) =>
  file.endsWith(".html"),
);
const indexableFiles = htmlFiles.filter(
  (file) => path.basename(file) !== "404.html",
);
const seenTitles = new Map();
const seenDescriptions = new Map();

for (const file of htmlFiles) {
  const relativeFile = path.relative(distDir, file);
  const html = await fs.readFile(file, "utf8");
  const is404 = relativeFile === "404.html";
  const titleValues = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map(
    (match) => match[1].trim(),
  );
  const metaTags = tags(html, "meta");
  const descriptionTags = metaTags.filter(
    (tag) => attribute(tag, "name")?.toLowerCase() === "description",
  );
  const robots = metaTags.find(
    (tag) => attribute(tag, "name")?.toLowerCase() === "robots",
  );
  const canonicalTags = tags(html, "link").filter(
    (tag) => attribute(tag, "rel")?.toLowerCase() === "canonical",
  );
  const alternateTags = tags(html, "link").filter(
    (tag) =>
      attribute(tag, "rel")?.toLowerCase() === "alternate" &&
      attribute(tag, "hreflang"),
  );
  const h1Count = (html.match(/<h1\b/gi) || []).length;

  if (titleValues.length !== 1 || !titleValues[0]) {
    errors.push(`${relativeFile}: expected exactly one non-empty title`);
  }
  if (
    descriptionTags.length !== 1 ||
    !attribute(descriptionTags[0], "content")
  ) {
    errors.push(
      `${relativeFile}: expected exactly one non-empty meta description`,
    );
  }
  if (
    !is404 &&
    titleValues[0] &&
    (titleValues[0].length < 25 || titleValues[0].length > 65)
  ) {
    errors.push(
      `${relativeFile}: title length is ${titleValues[0].length}; expected 25-65`,
    );
  }
  const descriptionValue = attribute(descriptionTags[0] || "", "content") || "";
  if (
    !is404 &&
    descriptionValue &&
    (descriptionValue.length < 80 || descriptionValue.length > 170)
  ) {
    errors.push(
      `${relativeFile}: description length is ${descriptionValue.length}; expected 80-170`,
    );
  }
  if (h1Count !== 1)
    errors.push(`${relativeFile}: expected one h1, found ${h1Count}`);
  if (
    metaTags.some((tag) => attribute(tag, "name")?.toLowerCase() === "keywords")
  ) {
    errors.push(`${relativeFile}: obsolete meta keywords tag found`);
  }

  if (is404) {
    if (!attribute(robots || "", "content")?.includes("noindex")) {
      errors.push(`${relativeFile}: 404 page must be noindex`);
    }
    if (canonicalTags.length > 0)
      errors.push(`${relativeFile}: 404 page must not be canonicalized`);
    if (alternateTags.length > 0)
      errors.push(`${relativeFile}: 404 page must not emit hreflang`);
  } else {
    if (canonicalTags.length !== 1) {
      errors.push(`${relativeFile}: expected exactly one canonical`);
    } else {
      const canonical = attribute(canonicalTags[0], "href");
      if (!canonical?.startsWith(canonicalOrigin)) {
        errors.push(
          `${relativeFile}: canonical has the wrong origin: ${canonical}`,
        );
      }
      if (canonical && !(await routeExists(new URL(canonical).pathname))) {
        errors.push(
          `${relativeFile}: canonical target does not exist: ${canonical}`,
        );
      }
    }
    if (attribute(robots || "", "content")?.includes("noindex")) {
      errors.push(`${relativeFile}: indexable page unexpectedly has noindex`);
    }
    if (alternateTags.length !== 3) {
      errors.push(
        `${relativeFile}: expected es, en and x-default hreflang links`,
      );
    }

    for (const alternateTag of alternateTags) {
      const href = attribute(alternateTag, "href");
      if (
        !href?.startsWith(canonicalOrigin) ||
        !(await routeExists(new URL(href).pathname))
      ) {
        errors.push(`${relativeFile}: invalid hreflang target: ${href}`);
      }
    }

    const title = titleValues[0];
    const description = attribute(descriptionTags[0], "content");
    if (seenTitles.has(title)) {
      errors.push(
        `${relativeFile}: duplicate title also used by ${seenTitles.get(title)}`,
      );
    } else {
      seenTitles.set(title, relativeFile);
    }
    if (seenDescriptions.has(description)) {
      errors.push(
        `${relativeFile}: duplicate description also used by ${seenDescriptions.get(description)}`,
      );
    } else {
      seenDescriptions.set(description, relativeFile);
    }
  }

  for (const match of html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      JSON.parse(match[1]);
      if (match[1].includes("devstoremx.vercel.app")) {
        errors.push(`${relativeFile}: JSON-LD contains the retired origin`);
      }
    } catch (error) {
      errors.push(`${relativeFile}: invalid JSON-LD (${error.message})`);
    }
  }

  const hrefs = [...html.matchAll(/\shref=["']([^"']+)["']/gi)].map(
    (match) => match[1],
  );
  for (const href of hrefs) {
    if (/^(#|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    const url = new URL(href, canonicalOrigin);
    if (url.origin !== canonicalOrigin) continue;
    if (!(await routeExists(url.pathname))) {
      errors.push(`${relativeFile}: broken internal link ${href}`);
    }
  }
}

const sitemapFiles = (await fs.readdir(distDir))
  .filter((file) => /^sitemap-\d+\.xml$/.test(file))
  .map((file) => path.join(distDir, file));
const sitemapUrls = [];
for (const sitemapFile of sitemapFiles) {
  const xml = await fs.readFile(sitemapFile, "utf8");
  sitemapUrls.push(
    ...[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]),
  );
}

if (sitemapUrls.length !== indexableFiles.length) {
  errors.push(
    `sitemap: expected ${indexableFiles.length} indexable URLs, found ${sitemapUrls.length}`,
  );
}
for (const sitemapUrl of sitemapUrls) {
  if (!sitemapUrl.startsWith(canonicalOrigin)) {
    errors.push(`sitemap: wrong origin ${sitemapUrl}`);
  } else if (!(await routeExists(new URL(sitemapUrl).pathname))) {
    errors.push(`sitemap: URL does not exist ${sitemapUrl}`);
  }
}

const robots = await fs.readFile(path.join(distDir, "robots.txt"), "utf8");
if (!robots.includes(`${canonicalOrigin}/sitemap-index.xml`)) {
  errors.push("robots.txt: canonical sitemap URL is missing");
}

for (const asset of [
  "media/favicon.svg",
  "media/favicon-48.png",
  "media/apple-touch-icon.png",
  "media/icon-192.png",
  "media/icon-512.png",
  "media/og-devstoremx.png",
  "site.webmanifest",
  "llms.txt",
]) {
  try {
    await fs.access(path.join(distDir, asset));
  } catch {
    errors.push(`asset missing from build: /${asset}`);
  }
}

if (errors.length > 0) {
  console.error(`SEO validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `SEO validation passed for ${indexableFiles.length} indexable pages.`,
  );
}
