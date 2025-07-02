// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Detect if we're building for GitHub Pages
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

// https://astro.build/config
export default defineConfig({
    // Only set site and base for GitHub Pages deployment
    site: isGitHubPages ? 'https://hectorromerodev.github.io' : undefined,
    base: isGitHubPages ? '/mind-games' : undefined,
    vite: {
        plugins: [tailwindcss()],
    },
});
