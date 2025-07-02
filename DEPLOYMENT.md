# GitHub Pages Deployment Guide

This document explains how to deploy Mind Games to GitHub Pages.

## 🚀 Automatic Deployment

The project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Steps

1. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Source: Select "GitHub Actions"

2. **Push to Main Branch**:
   - Any push to the `main` branch will trigger automatic deployment
   - The workflow builds the site and deploys it to GitHub Pages

3. **Manual Deployment**:
   - Go to Actions tab in your GitHub repository
   - Select "Deploy to GitHub Pages" workflow
   - Click "Run workflow" to deploy manually

## 🔧 Configuration Files

### GitHub Actions Workflow
- **File**: `.github/workflows/deploy.yml`
- **Purpose**: Automated build and deployment
- **Triggers**: Push to main branch or manual dispatch

### Astro Configuration
- **File**: `astro.config.mjs`
- **Smart Configuration**: Automatically detects GitHub Actions environment
- **GitHub Pages**: Uses `site` and `base` path for subdirectory deployment
- **Custom Domain**: No base path when deployed elsewhere (e.g., your own domain)

**Environment Detection:**
```javascript
// Automatically detects GitHub Pages deployment
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

// Only applies GitHub Pages settings when deploying via GitHub Actions
site: isGitHubPages ? 'https://hectorromerodev.github.io' : undefined,
base: isGitHubPages ? '/mind-games' : undefined,
```

## 📝 Configuration Details

### Site URL Structure
```
https://hectorromerodev.github.io/mind-games/
```

- **Domain**: `hectorromerodev.github.io`
- **Base Path**: `/mind-games`

**Important**: All pages must include the base path `/mind-games/` in the URL:
- ✅ Correct: `https://hectorromerodev.github.io/mind-games/`
- ✅ Correct: `https://hectorromerodev.github.io/mind-games/games`
- ✅ Correct: `https://hectorromerodev.github.io/mind-games/games/simon-says`
- ❌ Wrong: `https://hectorromerodev.github.io/games` (missing base path)

### Build Process
1. **Environment Detection**: Automatically detects GitHub Pages vs. custom deployment
2. **Dependencies**: Installed using Bun
3. **Build**: `bun run build` creates production files
4. **Configuration**: 
   - **GitHub Pages**: Applies `/mind-games` base path automatically
   - **Custom Domain**: No base path, works at domain root
5. **Output**: Static files in `./dist` directory
6. **Deploy**: Files uploaded to GitHub Pages

## 🔍 Troubleshooting

### Common Issues

**Build Failures**:
- Check Actions tab for error details
- Ensure all dependencies are in `package.json`
- Verify TypeScript/build errors locally first

**404 Errors**:
- Verify `base` path in `astro.config.mjs`
- **Always use full URLs** with base path: `/mind-games/page-name`
- Check internal links use relative paths or include base path
- Ensure asset paths are correctly resolved
- Test URLs locally with `bun run preview` to match production behavior

**Styling Issues**:
- Tailwind CSS should build correctly with Vite plugin
- Check browser developer tools for missing assets

### Local Testing
Test the production build locally before deploying:

```bash
# Build the site
bun run build

# Preview the production build
bun run preview
```

The preview server will show you exactly how the site will behave on GitHub Pages, including the correct URL structure.

### URL Troubleshooting

**Common URL Issues:**

1. **Missing Base Path**: 
   - ❌ `https://hectorromerodev.github.io/games`
   - ✅ `https://hectorromerodev.github.io/mind-games/games`

2. **Direct Repository Access**:
   - If you want the site at the root (`https://hectorromerodev.github.io/`), you would need to:
     - Rename the repository to `hectorromerodev.github.io`
     - Remove the `base: '/mind-games'` from `astro.config.mjs`
     - This would make it your main GitHub Pages site

3. **Internal Links**:
   - Astro automatically handles the base path for internal navigation
   - External links to your site need the full URL with base path

## 🌐 Live Site

Once deployed, your site will be available at:
**https://hectorromerodev.github.io/mind-games/**

## 🏠 Custom Domain Deployment

The configuration automatically adapts for custom domain deployment:

### For Your Own Domain
When you're ready to deploy to your own domain (e.g., `yourdomain.com`):

1. **No Configuration Changes Needed**: The smart configuration will automatically:
   - Remove the `/mind-games` base path
   - Work at your domain root (`https://yourdomain.com/`)
   - Keep all internal links working correctly

2. **Deployment Options**:
   - **Netlify**: Connect your GitHub repo, build command: `bun run build`
   - **Vercel**: Connect your GitHub repo, framework preset: Astro
   - **Your Own Server**: Upload the `dist/` folder contents
   - **Custom GitHub Pages Domain**: Add CNAME file and configure DNS

### Local Development vs Production
- **Local**: `http://localhost:4321/` (no base path)
- **GitHub Pages**: `https://hectorromerodev.github.io/mind-games/` (with base path)
- **Custom Domain**: `https://yourdomain.com/` (no base path)

The same codebase works seamlessly across all environments!

## 🔄 Deployment Status

Check deployment status:
- **Actions Tab**: View build and deployment logs
- **Pages Settings**: See deployment history and current status
- **Repository Badge**: Add build status badge to README if desired

## 📋 Deployment Checklist

Before pushing to production:

- [ ] Test all games work correctly
- [ ] Verify responsive design on different screen sizes
- [ ] Check all navigation links function properly
- [ ] Ensure assets (images, icons) load correctly
- [ ] Test scoring system and game logic
- [ ] Verify documentation is up to date

## 🚀 Future Enhancements

Consider these deployment improvements:

### GitHub Pages Specific
- **Custom Domain**: Add custom domain in Pages settings (will automatically remove base path)
- **Environment Variables**: Use GitHub Secrets for sensitive data
- **Build Status Badge**: Add build status badge to README
- **Branch Protection**: Require PR reviews before main branch merges

### Multi-Environment Support
- **Staging Environment**: Deploy feature branches to preview environments
- **Build Optimization**: Add caching to speed up builds
- **Analytics**: Add tracking for both GitHub Pages and custom domain
- **Content Delivery**: Consider CDN for faster global access

### Migration to Custom Domain
When ready to move to your own domain:
1. **No code changes required** - configuration is environment-aware
2. **DNS Setup**: Point your domain to hosting provider
3. **SSL Certificate**: Most providers handle this automatically
4. **Redirect Setup**: Optionally redirect GitHub Pages to new domain
