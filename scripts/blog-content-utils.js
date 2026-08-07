import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getMarkdownArticlesDir() {
  return path.join(__dirname, '../src/content/articles');
}

export function getMarkdownFiles(dir = getMarkdownArticlesDir()) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .sort()
    .map((file) => path.join(dir, file));
}

function stripWrappingQuotes(value) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

export function parseMarkdownFrontmatter(markdownText, slug) {
  const frontmatterMatch = markdownText.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n)?/);
  const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
  const body = frontmatterMatch ? markdownText.slice(frontmatterMatch[0].length) : markdownText;

  const metadata = {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    description: '',
    date: '',
    image: '',
  };

  for (const line of frontmatter.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.+)$/);
    if (!match) {
      continue;
    }

    const [, key, value] = match;
    metadata[key] = stripWrappingQuotes(value.trim());
  }

  return {
    ...metadata,
    slug,
    content: body.trim(),
  };
}

export function normalizeSlug(filePath) {
  return path.basename(filePath, '.md');
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderSimpleMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const htmlParts = [];
  let paragraphLines = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    const text = paragraphLines.join(' ').trim();
    htmlParts.push(`<p>${escapeHtml(text)}</p>`);
    paragraphLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      const level = headingMatch[1].length;
      htmlParts.push(`<h${level}>${escapeHtml(headingMatch[2])}</h${level}>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      htmlParts.push(`<p>• ${escapeHtml(line.replace(/^[-*]\s+/, ''))}</p>`);
      continue;
    }

    paragraphLines.push(line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1'));
  }

  flushParagraph();
  return htmlParts.join('\n');
}

export function buildStaticBlogPageHtml(article, siteUrl) {
  const canonicalUrl = `${siteUrl}/blog/${article.slug}`;
  const title = article.title || article.slug.replace(/-/g, ' ');
  const description = article.description || 'Read this blog post from TempMail Pk.';
  const bodyHtml = renderSimpleMarkdown(article.content || '');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} | TempMail Pro Blog</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="TempMail Pro" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
  </head>
  <body>
    <main>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(description)}</p>
      <article>${bodyHtml}</article>
    </main>
  </body>
</html>`;
}
