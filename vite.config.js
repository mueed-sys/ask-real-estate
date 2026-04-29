import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SITE_URL = 'https://irebahrain.com'

// Generate sitemap.xml from the live JSON datasets at build time so adding a
// property / blog post / area / agent automatically produces a fresh sitemap.
function sitemapPlugin() {
  return {
    name: 'ire-sitemap',
    apply: 'build',
    closeBundle() {
      const root = process.cwd()
      const properties = JSON.parse(fs.readFileSync(path.join(root, 'src/data/properties.json'), 'utf-8'))
      const agents = JSON.parse(fs.readFileSync(path.join(root, 'src/data/agents.json'), 'utf-8'))
      const areas = JSON.parse(fs.readFileSync(path.join(root, 'src/data/areas.json'), 'utf-8'))
      const blog = JSON.parse(fs.readFileSync(path.join(root, 'src/data/blog.json'), 'utf-8'))

      const today = new Date().toISOString().slice(0, 10)

      const urls = [
        { loc: '/', priority: '1.0', changefreq: 'weekly' },
        { loc: '/properties', priority: '0.9', changefreq: 'daily' },
        { loc: '/areas', priority: '0.8', changefreq: 'monthly' },
        { loc: '/agents', priority: '0.7', changefreq: 'monthly' },
        { loc: '/about', priority: '0.6', changefreq: 'monthly' },
        { loc: '/contact', priority: '0.6', changefreq: 'monthly' },
        { loc: '/blog', priority: '0.7', changefreq: 'weekly' },
        { loc: '/list-property', priority: '0.6', changefreq: 'monthly' },
        ...properties.map((p) => ({
          loc: `/properties/${p.id}`, priority: '0.7', changefreq: 'weekly', lastmod: p.created_at,
        })),
        ...agents.map((a) => ({ loc: `/agents/${a.id}`, priority: '0.5', changefreq: 'monthly' })),
        ...areas.map((a) => ({ loc: `/areas/${a.slug}`, priority: '0.6', changefreq: 'weekly' })),
        ...blog.map((p) => ({ loc: `/blog/${p.slug}`, priority: '0.6', changefreq: 'monthly', lastmod: p.date })),
      ]

      const xml =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
          .map(
            (u) =>
              `  <url>\n` +
              `    <loc>${SITE_URL}${u.loc}</loc>\n` +
              `    <lastmod>${u.lastmod || today}</lastmod>\n` +
              `    <changefreq>${u.changefreq}</changefreq>\n` +
              `    <priority>${u.priority}</priority>\n` +
              `  </url>`
          )
          .join('\n') +
        `\n</urlset>\n`

      const outDir = path.resolve(root, 'dist')
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf-8')
      console.log(`[sitemap] wrote ${urls.length} URLs to dist/sitemap.xml`)
    },
  }
}

export default defineConfig({
  resolve: {
    alias: {
      // Redirect react-i18next to our English-only shim so we can keep
      // useTranslation() calls intact without bundling i18next.
      'react-i18next': path.resolve(__dirname, 'src/lib/i18n-shim.js'),
    },
  },
  plugins: [react(), sitemapPlugin()],
  build: {
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-router')) return 'react-vendor'
          if (id.includes('react-dom') || /\/react\//.test(id)) return 'react-vendor'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('zustand')) return 'state'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('react-helmet-async')) return 'helmet'
        },
      },
    },
  },
})
