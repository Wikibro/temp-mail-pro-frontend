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

function renderInlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)\s]+)\)/g, (match, label, href) => {
      if (href.startsWith('/')) {
        return `<a href="${href}">${label}</a>`;
      }

      return `<a href="${href}" target="_blank" rel="noopener noreferrer sponsored">${label}</a>`;
    });
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
    htmlParts.push(`<p>${renderInlineMarkdown(text)}</p>`);
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
  const publishedDate = article.date || '';
  const bodyHtml = renderSimpleMarkdown(article.content || '');
  const articleSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      '@type': 'Organization',
      name: 'TempMail Pro Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TempMail Pro',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  });

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} | TempMail Pro Blog</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="TempMail Pro Team" />
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
    <script type="application/ld+json">${articleSchema}</script>
  </head>
  <body>
    <header>
      <nav aria-label="Primary navigation">
        <a href="${siteUrl}/">TempMail Pro</a>
        <a href="${siteUrl}/app">Use the app</a>
        <a href="${siteUrl}/blog">All articles</a>
        <a href="${siteUrl}/privacy">Privacy</a>
        <a href="${siteUrl}/about">About</a>
      </nav>
    </header>
    <main>
      <nav aria-label="Breadcrumb">
        <a href="${siteUrl}/">Home</a> &rsaquo;
        <a href="${siteUrl}/blog">Blog</a> &rsaquo;
        <span>${escapeHtml(title)}</span>
      </nav>
      <h1>${escapeHtml(title)}</h1>
      ${publishedDate ? `<time datetime="${escapeHtml(publishedDate)}">Published ${escapeHtml(publishedDate)}</time>` : ''}
      <p>${escapeHtml(description)}</p>
      <article>${bodyHtml}</article>
      <aside aria-label="Continue reading">
        <h2>Continue with TempMail Pro</h2>
        <p>Use a temporary inbox for suitable low-risk signups, or read more privacy guidance.</p>
        <a href="${siteUrl}/app">Create a temporary email</a>
        <a href="${siteUrl}/privacy-stack">Read the Privacy Stack guide</a>
        <a href="${siteUrl}/blog">Browse more articles</a>
      </aside>
    </main>
    <footer>
      <a href="${siteUrl}/privacy">Privacy Policy</a>
      <a href="${siteUrl}/about">About TempMail Pro</a>
    </footer>
  </body>
</html>`;
}
