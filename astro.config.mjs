import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ site: 'https://ddak-calc.pages.dev', integrations: [react()], vite: { plugins: [tailwindcss()] }, output: 'static' });
