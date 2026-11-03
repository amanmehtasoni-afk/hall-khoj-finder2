/**
 * Hall Khoj Finder — SEO & Sitemap Generator (Phase 16)
 * Generates dynamic sitemap.xml and robots.txt for search engine indexing.
 */

const { getCollection } = require('./data.service');
const CATEGORIES = require('../data/categories.json');

const BASE_URL = process.env.FRONTEND_URL || 'https://hallkhoj.in';

const TOP_CITIES = ['Lucknow', 'Varanasi', 'Patna', 'Delhi', 'Kanpur', 'Prayagraj', 'Gorakhpur', 'Agra', 'Noida'];

async function generateSitemapXml() {
  const urls = [];
  const today = new Date().toISOString().split('T')[0];

  // 1. Core High-Priority Pages
  const corePages = [
    { loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${BASE_URL}/search.html`, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/gallery.html`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${BASE_URL}/3d-preview.html`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${BASE_URL}/compare.html`, changefreq: 'weekly', priority: '0.75' },
    { loc: `${BASE_URL}/support.html`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${BASE_URL}/contact.html`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/about.html`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/help.html`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/privacy.html`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/terms.html`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/login.html`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${BASE_URL}/register.html`, changefreq: 'monthly', priority: '0.6' }
  ];

  corePages.forEach(p => {
    urls.push({
      loc: p.loc,
      lastmod: today,
      changefreq: p.changefreq,
      priority: p.priority
    });
  });

  // 2. 19 Category Pages
  if (Array.isArray(CATEGORIES)) {
    CATEGORIES.forEach(cat => {
      urls.push({
        loc: `${BASE_URL}/search.html?category=${encodeURIComponent(cat.name)}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.85'
      });
    });
  }

  // 3. Top Cities Landing URLs
  TOP_CITIES.forEach(city => {
    urls.push({
      loc: `${BASE_URL}/search.html?city=${encodeURIComponent(city)}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  // 4. Dynamic Verified Listings
  try {
    const halls = await getCollection('halls');
    const activeHalls = (halls || []).filter(h => h.status !== 'SUSPENDED' && h.status !== 'DELETED');
    activeHalls.slice(0, 100).forEach(h => {
      const updatedAt = h.updatedAt ? new Date(h.updatedAt).toISOString().split('T')[0] : today;
      urls.push({
        loc: `${BASE_URL}/hall-details.html?id=${encodeURIComponent(h.id)}`,
        lastmod: updatedAt,
        changefreq: 'weekly',
        priority: '0.75'
      });
    });
  } catch (err) {
    console.warn('[SEO Service] Could not pull dynamic halls for sitemap:', err.message);
  }

  // Build XML String
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(u => {
    xml += '  <url>\n';
    xml += `    <loc>${u.loc}</loc>\n`;
    xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
    xml += `    <priority>${u.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
}

function generateRobotsTxt() {
  return [
    '# Hall Khoj Finder — Robots Exclusion Directives',
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /admin/',
    'Disallow: /dashboard.html',
    'Disallow: /owner/',
    'Disallow: /scratch/',
    '',
    `Sitemap: ${BASE_URL}/sitemap.xml`
  ].join('\n');
}

module.exports = {
  generateSitemapXml,
  generateRobotsTxt
};
