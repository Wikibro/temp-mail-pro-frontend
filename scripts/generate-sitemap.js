#!/usr/bin/env node

/**
 * Automated Sitemap Generator for Blog Posts
 * Generates public/sitemap.xml from src/content/articlesData.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesPath = path.join(__dirname, '../src/content/articlesData.js');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

// Import articles dynamically
const articlesModule = await import(articlesPath);
const articles = articlesModule.articles;

// Static pages (non-blog)
const staticPages = [
  { url: 'https://tempmailpk.com/', lastmod: '2026-04-17', changefreq: 'daily', priority: '1.0' },
  { url: 'https://tempmailpk.com/app', lastmod: '2026-04-17', changefreq: 'daily', priority: '0.9' },
  { url: 'https://tempmailpk.com/about', lastmod: '2026-04-08', changefreq: 'monthly', priority: '0.8' },
  { url: 'https://tempmailpk.com/blog', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: '0.9' },
];

// Generate blog URLs from articles
const blogUrls = articles.map(article => ({
  url: `https://tempmailpk.com/blog/${article.slug}`,
  lastmod: article.date,
  changefreq: 'monthly',
  priority: '0.7',
}));

// Combine all URLs
const allUrls = [...staticPages, ...blogUrls];

// Generate XML
const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
const xmlFooter = '</urlset>';

const xmlContent = allUrls
  .map(item => 
    `  <url>\n    <loc>${item.url}</loc>\n    <lastmod>${item.lastmod}</lastmod>\n    <changefreq>${item.changefreq}</changefreq>\n    <priority>${item.priority}</priority>\n  </url>`
  )
  .join('\n');

const xml = xmlHeader + xmlContent + '\n' + xmlFooter;

// Write sitemap
fs.writeFileSync(sitemapPath, xml);
console.log(`✓ Sitemap generated: ${sitemapPath}`);
console.log(`  Static pages: ${staticPages.length}`);
console.log(`  Blog posts: ${blogUrls.length}`);
console.log(`  Total URLs: ${allUrls.length}`);
