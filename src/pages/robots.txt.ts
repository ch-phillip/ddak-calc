import type { APIRoute } from 'astro';
export const GET: APIRoute = () => new Response('User-agent: *\nAllow: /\nSitemap: https://justclickfor.me/sitemap-index.xml\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
