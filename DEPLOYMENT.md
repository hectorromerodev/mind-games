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
- **Settings**:
  - `site`: Your GitHub Pages URL
  - `base`: Repository name (for subdirectory deployment)

## 📝 Configuration Details

### Site URL Structure
```
https://hectorromerodev.github.io/mind-games/
```

- **Domain**: `hectorromerodev.github.io`
- **Base Path**: `/mind-games`

### Build Process
1. **Dependencies**: Installed using Bun
2. **Build**: `bun run build` creates production files
3. **Output**: Static files in `./dist` directory
4. **Deploy**: Files uploaded to GitHub Pages

## 🔍 Troubleshooting

### Common Issues

**Build Failures**:
- Check Actions tab for error details
- Ensure all dependencies are in `package.json`
- Verify TypeScript/build errors locally first

**404 Errors**:
- Verify `base` path in `astro.config.mjs`
- Check internal links use relative paths
- Ensure asset paths are correctly resolved

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

## 🌐 Live Site

Once deployed, your site will be available at:
**https://hectorromerodev.github.io/mind-games/**

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

- **Custom Domain**: Add custom domain in Pages settings
- **Environment Variables**: Use GitHub Secrets for sensitive data
- **Build Optimization**: Add caching to speed up builds
- **Branch Protection**: Require PR reviews before main branch merges
- **Staging Environment**: Deploy feature branches to preview environments
