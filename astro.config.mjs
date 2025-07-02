// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://hectorromerodev.github.io',
    base: '/mind-games',
    vite: {
        plugins: [tailwindcss()],
    },
});
