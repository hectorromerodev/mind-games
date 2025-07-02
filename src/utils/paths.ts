/**
 * Path utility functions for handling Astro base paths across different deployment environments
 */

/**
 * Gets the base URL from Astro's environment configuration
 * @returns The base URL with proper trailing slash handling
 */
export function getBaseUrl(): string {
  return import.meta.env.BASE_URL || '/';
}

/**
 * Constructs a proper URL path by joining the base URL with a route
 * Handles trailing/leading slashes correctly for all deployment scenarios
 * 
 * @param route - The route path (e.g., '/games', '/about', '/games/simon-says')
 * @returns Properly formatted URL path
 * 
 * @example
 * // Local development (BASE_URL = '/')
 * createPath('/games') // returns '/games'
 * 
 * // GitHub Pages (BASE_URL = '/mind-games/')
 * createPath('/games') // returns '/mind-games/games'
 * 
 * // Custom domain (BASE_URL = '/')
 * createPath('/games') // returns '/games'
 */
export function createPath(route: string): string {
  const base = getBaseUrl();
  
  // Handle root path
  if (route === '' || route === '/') {
    return base;
  }
  
  // Clean up base URL (remove trailing slash if present)
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  
  // Ensure route starts with slash
  const cleanRoute = route.startsWith('/') ? route : '/' + route;
  
  return cleanBase + cleanRoute;
}

/**
 * Creates an asset path for static files (images, favicon, etc.)
 * @param assetPath - Path to the asset (e.g., '/favicon.svg', '/images/logo.png')
 * @returns Properly formatted asset URL
 */
export function createAssetPath(assetPath: string): string {
  return createPath(assetPath);
}

/**
 * Navigation route definitions for consistent routing across the application
 */
export const ROUTES = {
  HOME: '/',
  GAMES: '/games',
  ABOUT: '/about',
  SIMON_SAYS: '/games/simon-says',
} as const;

/**
 * Type-safe route creation using predefined routes
 * @param route - Route key from ROUTES constant
 * @returns Properly formatted URL path
 */
export function createRoute(route: keyof typeof ROUTES): string {
  return createPath(ROUTES[route]);
}
