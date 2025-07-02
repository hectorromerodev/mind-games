# Path Management System

## Overview

This document describes the path management system implemented for the Mind Games application. This system provides a centralized, type-safe, and maintainable approach to handling URLs across different deployment environments.

## Architecture

### Core Utility (`src/utils/paths.ts`)

The path management system is built around a central utility module that provides:

- **Environment Detection**: Automatically adapts to local development, GitHub Pages, and custom domain deployments
- **Type Safety**: Predefined route constants prevent typos and provide IntelliSense support
- **Consistency**: Unified path generation across all components
- **Maintainability**: Single source of truth for all application routes

### Key Functions

#### `createRoute(route: keyof typeof ROUTES): string`
Type-safe route creation using predefined route constants.

```typescript
// ✅ Type-safe and consistent
createRoute('GAMES')        // Returns correct path for current environment
createRoute('SIMON_SAYS')   // Returns correct path for current environment
```

#### `createPath(route: string): string`
Generic path creation for custom routes.

```typescript
// ✅ Flexible for dynamic routes
createPath('/games/new-game')  // Handles base path automatically
```

#### `createAssetPath(assetPath: string): string`
Specialized function for static assets.

```typescript
// ✅ Proper asset handling
createAssetPath('/favicon.svg')  // Correct path in all environments
```

## Route Constants

All application routes are defined in the `ROUTES` constant:

```typescript
export const ROUTES = {
  HOME: '/',
  GAMES: '/games',
  ABOUT: '/about',
  SIMON_SAYS: '/games/simon-says',
} as const;
```

### Benefits

1. **Prevents Typos**: TypeScript will catch invalid route references
2. **Refactoring Safe**: Change a route in one place, updates everywhere
3. **IntelliSense Support**: Auto-completion for all available routes
4. **Documentation**: Routes are self-documenting through the constant names

## Usage Examples

### In Astro Components

```astro
---
import { createRoute } from '../utils/paths';
---

<nav>
  <a href={createRoute('HOME')}>Home</a>
  <a href={createRoute('GAMES')}>Games</a>
  <a href={createRoute('ABOUT')}>About</a>
</nav>
```

### In Game Cards

```astro
---
import { createRoute } from '../utils/paths';
---

<GameCard 
  title="Simon Says"
  href={createRoute('SIMON_SAYS')}
/>
```

## Environment Handling

The system automatically adapts to different deployment environments:

### Local Development
- `BASE_URL = '/'`
- `createRoute('GAMES')` → `/games`

### GitHub Pages
- `BASE_URL = '/mind-games/'`
- `createRoute('GAMES')` → `/mind-games/games`

### Custom Domain
- `BASE_URL = '/'`
- `createRoute('GAMES')` → `/games`


## Best Practices

1. **Always use `createRoute()`** for predefined routes
2. **Add new routes to `ROUTES` constant** for consistency
3. **Use `createPath()`** only for dynamic or temporary routes
4. **Use `createAssetPath()`** for static assets
5. **Import paths utility** at the component level, not globally

## Adding New Routes

To add a new route:

1. Add it to the `ROUTES` constant in `src/utils/paths.ts`
2. Use `createRoute()` with the new route key
3. TypeScript will ensure type safety across the application

```typescript
// 1. Add to ROUTES constant
export const ROUTES = {
  // ...existing routes
  MEMORY_GAME: '/games/memory-game',
} as const;

// 2. Use in components
<a href={createRoute('MEMORY_GAME')}>Memory Game</a>
```