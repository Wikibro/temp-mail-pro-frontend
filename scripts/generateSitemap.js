// scripts/generateSitemap.js
import fs from "fs";
import path from "path";
import { SitemapStream, streamToPromise } from "sitemap";
import { Feed } from "feed";

const SITE_URL = "https://tempmailpk.com";
const publicDir = path.resolve("public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// ALL YOUR PAGES - INCLUDE EVERYTHING
const routes = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/app", changefreq: "daily", priority: 0.9 },
  { url: "/about", changefreq: "monthly", priority: 0.8 },
  { url: "/blog", changefreq: "daily", priority: 0.9 },
  { url: "/blog/tech-behind-disposable-emails", changefreq: "monthly", priority: 0.7 },
  { url: "/blog/receive-sms-otp-online", changefreq: "monthly", priority: 0.7 },
  { url: "/blog/private-domains-temp-email", changefreq: "monthly", priority: 0.7 },
  { url: "/blog/burner-email-for-social-media", changefreq: "monthly", priority: 0.7 },
];

async function generateSitemap() {
  const sitemapStream = new SitemapStream({ hostname: SITE_URL });

  routes.forEach((route) => sitemapStream.write(route));
  sitemapStream.end();

  const sitemap = await streamToPromise(sitemapStream).then((data) =>
    data.toString()
  );

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
  console.log("✅ sitemap.xml generated");
}

// Run it
(async () => {
  await generateSitemap();
})();
