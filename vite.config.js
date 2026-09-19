import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import markdownPlugin from "vite-plugin-markdown";
import { resolve } from "path"

function tempMailDevApiPlugin() {
  const accounts = new Map();
  const messagesByToken = new Map();

  function handleApi(req, res, next) {
    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname;

    if (!pathname.startsWith('/api/')) {
      return next();
    }

    res.setHeader('Content-Type', 'application/json');

    // GET /api/accounts/domains
    if (req.method === 'GET' && pathname === '/api/accounts/domains') {
      res.statusCode = 200;
      res.end(JSON.stringify({
        domains: ['uberip.com', 'mailto.plus', 'fexpost.com', 'rover.info']
      }));
      return;
    }

    // POST /api/accounts/create
    if (req.method === 'POST' && pathname === '/api/accounts/create') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        let parsed = {};
        try { parsed = JSON.parse(body); } catch (_) {}
        const username = parsed.username
          ? parsed.username.toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 24)
          : null;
        const domain = parsed.domain || 'uberip.com';

        const randomStr = Math.random().toString(36).substring(2, 8);
        const address = username
          ? `${username}@${domain}`
          : `temp_${randomStr}@${domain}`;
        const token = `tok_${Date.now()}_${randomStr}`;

        const newAccount = {
          address,
          email: address,
          token,
          createdAt: new Date().toISOString()
        };
        accounts.set(token, newAccount);

        const welcomeId = `msg_${Date.now()}`;
        const welcomeMsg = {
          id: welcomeId,
          token,
          from: { address: 'support@tempmailpk.com', name: 'TempMail Pro Team' },
          to: [{ address }],
          subject: 'Welcome to TempMail Pro!',
          intro: 'Your temporary email inbox is ready to use.',
          text: `Welcome to TempMail Pro!\n\nYour temporary mailbox (${address}) is active and ready to receive emails.\n\nYou can use this address to receive verification codes and protect your real email from spam.`,
          html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #1e293b;">
            <h2 style="color: #4361ee; margin-top: 0;">Welcome to TempMail Pro!</h2>
            <p>Your temporary email inbox is active and ready: <strong>${address}</strong></p>
            <div style="background-color: #f8fafc; border-left: 4px solid #4361ee; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #475569;">
                TempMail Pro protects your personal inbox from unwanted spam, promotional newsletters, and trackers.
              </p>
            </div>
            <p>Any incoming messages to this address will automatically appear in your inbox list.</p>
          </div>`,
          createdAt: new Date().toISOString(),
          date: new Date().toISOString(),
          hasAttachments: true,
          attachments: [
            {
              id: 'att_sample_quickstart',
              filename: 'QuickStart_Guide.txt',
              contentType: 'text/plain',
              size: 1420
            }
          ]
        };
        messagesByToken.set(token, [welcomeMsg]);

        res.statusCode = 200;
        res.end(JSON.stringify(newAccount));
      });
      return;
    }

    // GET /api/inbox/content/:token/:id
    const contentMatch = pathname.match(/^\/api\/inbox\/content\/([^/]+)\/([^/]+)$/);
    if (req.method === 'GET' && contentMatch) {
      const [, token, id] = contentMatch;
      const msgs = messagesByToken.get(token) || [];
      const msg = msgs.find(m => String(m.id) === String(id));
      if (!msg) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Message not found' }));
        return;
      }
      res.statusCode = 200;
      res.end(JSON.stringify(msg));
      return;
    }

    // GET /api/inbox/:token
    const inboxMatch = pathname.match(/^\/api\/inbox\/([^/]+)$/);
    if (req.method === 'GET' && inboxMatch) {
      const [, token] = inboxMatch;
      const msgs = messagesByToken.get(token) || [];
      res.statusCode = 200;
      res.end(JSON.stringify(msgs));
      return;
    }

    next();
  }

  return {
    name: 'temp-mail-dev-api',
    configureServer(server) {
      server.middlewares.use(handleApi);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleApi);
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    markdownPlugin.default({
      mode: ["html", "toc"],
    }),
    tempMailDevApiPlugin(),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
    proxy: process.env.VITE_API_PROXY ? {
      "/api": {
        target: process.env.VITE_API_PROXY,
        changeOrigin: true,
      },
    } : undefined,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
  },
  build: {
    target: "ES2020",
    minify: "esbuild",
    reportCompressedSize: false,
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks(id) {
          // Core vendor chunks - small, always needed
          if (id.includes("node_modules/react-dom")) {
            return "vendor-react-dom";
          }
          if (id.includes("node_modules/react/")) {
            return "vendor-react";
          }
          
          // Router - needed early for navigation
          if (id.includes("node_modules/react-router-dom")) {
            return "vendor-router";
          }
          
          // Blog-only: markdown rendering (lazy loaded)
          if (id.includes("node_modules/react-markdown") || 
              id.includes("node_modules/remark") || 
              id.includes("node_modules/rehype")) {
            return "vendor-markdown";
          }
          
          // HTTP client
          if (id.includes("node_modules/axios")) {
            return "vendor-axios";
          }
          
          // SEO - keep in main bundle to avoid init order issues
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  base: "/",
});


// import { defineConfig } from "vite"
// import react from "@vitejs/plugin-react"
// import markdownPlugin from "vite-plugin-markdown";

// import { resolve } from "path"
// import fs from "fs"

// // --- Collect blog routes from Markdown files ---
// function generateRoutesFromMarkdown() {
//   const articlesDir = resolve(__dirname, "src/content/articles")
//   if (!fs.existsSync(articlesDir)) return []

//   const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"))
//   return files.map((file) => `/blog/${file.replace(".md", "")}`)
// }

// // --- Generate Sitemap + RSS ---
// function generateSitemapAndRSS() {
//   const routes = generateRoutesFromMarkdown()
//   // const siteUrl = "http://localhost:5173" // ✅ for local testing
//   const siteUrl = "https://tempmailpk.com" // ✅ for local testing
//   // 🔴 change to your actual domain when deploying

//   // --- Sitemap ---
//   const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// ${routes
//       .map(
//         (r) => `<url>
//   <loc>${siteUrl}${r}</loc>
//   <changefreq>weekly</changefreq>
// </url>`
//       )
//       .join("\n")}
// </urlset>`

//   fs.writeFileSync(resolve(__dirname, "public", "sitemap.xml"), sitemap)

//   // --- RSS ---
//   const rssItems = routes
//     .map(
//       (r) => `
// <item>
//   <title>${r.replace("/blog/", "").replace(/-/g, " ")}</title>
//   <link>${siteUrl}${r}</link>
//   <description>Read about ${r.replace("/blog/", "").replace(/-/g, " ")}</description>
// </item>`
//     )
//     .join("\n")

//   const rss = `<?xml version="1.0" encoding="UTF-8" ?>
// <rss version="2.0">
// <channel>
//   <title>Your Blog Feed</title>
//   <link>${siteUrl}</link>
//   <description>Latest blog posts</description>
//   ${rssItems}
// </channel>
// </rss>`

//   fs.writeFileSync(resolve(__dirname, "public", "rss.xml"), rss)
// }

// // --- Final Vite Config ---
// export default defineConfig({
//   plugins: [
//     react(),
//     markdownPlugin.default({
//       mode: ["html", "toc"], // parses markdown into HTML + table of contents
//     }),
//   ],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
//       },
//     },
//   },
//   build: {
//     rollupOptions: {
//       input: {
//         main: resolve(__dirname, "index.html"),
//       },
//     },
//   },
//   base: "/",  // ✅ Add this
//   closeBundle() {
//     generateSitemapAndRSS();
//   },
// });
