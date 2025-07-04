# Mind Games - Development Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Adding a New Game](#adding-a-new-game)
5. [Component Development](#component-development)
6. [Styling Guidelines](#styling-guidelines)
7. [Testing](#testing)
8. [Performance Guidelines](#performance-guidelines)
9. [Deployment](#deployment)

## Getting Started

### Prerequisites
- **Node.js**: Version 18 or higher
- **Bun**: Version 1.0 or higher (recommended package manager)
- **Git**: For version control
- **VS Code**: Recommended editor with Astro extension

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd mind-games

# Install dependencies
bun install

# Start development server
bun run dev

# Open browser
# Navigate to http://localhost:4321
```

### Environment Setup

#### VS Code Extensions (Recommended)
- Astro
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

#### VS Code Settings
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.astro": "astro"
  }
}
```

## Project Structure

```
mind-games/
├── docs/                    # Documentation
│   ├── SYSTEM_DESIGN.md
│   ├── API_DOCUMENTATION.md
│   └── DEVELOPMENT_GUIDE.md
├── public/                  # Static assets
│   └── favicon.svg
├── src/
│   ├── components/          # Reusable components
│   │   ├── game/           # Game-related components
│   │   ├── ui/             # Generic UI components
│   │   └── layout/         # Layout components
│   ├── layouts/            # Page layouts
│   │   └── Layout.astro
│   ├── pages/              # Route pages
│   │   ├── index.astro     # Home page
│   │   └── games/          # Game pages
│   ├── styles/             # Global styles
│   │   └── global.css
│   ├── utils/              # Utility functions and classes
│   │   ├── BaseGameClass.ts
│   │   ├── ScoreCalculator.ts
│   │   └── GameUtils.ts
│   └── types/              # TypeScript type definitions
├── astro.config.mjs        # Astro configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

### File Naming Conventions

- **Components**: PascalCase with `.astro` extension (`GameControls.astro`)
- **Pages**: kebab-case with `.astro` extension (`math-flow.astro`)
- **TypeScript files**: PascalCase for classes (`BaseGameClass.ts`)
- **Utility files**: camelCase for functions (`gameUtils.ts`)
- **Types**: PascalCase with `.ts` extension (`GameTypes.ts`)

## Development Workflow

### Branch Strategy
- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: Feature development branches
- **hotfix/**: Critical bug fixes

### Commit Conventions
```
type(scope): description

feat(math-flow): add difficulty progression
fix(simon-says): resolve button highlight issue
docs(api): update game class documentation
style(ui): improve button hover effects
refactor(scoring): simplify calculation logic
test(utils): add validation function tests
```

### Pull Request Process
1. Create feature branch from `develop`
2. Implement changes with tests
3. Update documentation if needed
4. Ensure all tests pass
5. Create pull request to `develop`
6. Request code review
7. Address feedback and merge

## Adding a New Game

### Step 1: Create Game Class

Create a new TypeScript file in `src/utils/`:

```typescript
// src/utils/NewGameClass.ts
import { BaseGameClass, type GameConfig } from './BaseGameClass.js';

export class NewGameClass extends BaseGameClass {
  // Game-specific properties
  private gameData: any = null;
  
  constructor() {
    const config: GameConfig = {
      maxTime: 120,
      showStats: true,
      showReset: true
    };
    super(config);
  }

  // Required abstract method implementations
  startGameLogic(): void {
    // Initialize game-specific logic
  }

  endGameLogic(): void {
    // Cleanup and show results
  }

  newRound(): void {
    // Generate new round
  }

  // Game-specific public methods
  public handleUserInput(input: any): void {
    // Process user interaction
  }
}
```

### Step 2: Create Game Page

Create a new Astro page in `src/pages/games/`:

```astro
---
// src/pages/games/new-game.astro
import Layout from '../../layouts/Layout.astro';
import BaseGame from '../../components/game/BaseGame.astro';
import GameInstructions from '../../components/game/GameInstructions.astro';

const gameTitle = "New Game";
const gameInstructions = [
  "Rule 1: Description of first rule",
  "Rule 2: Description of second rule",
  "Rule 3: Description of third rule"
];
---

<Layout title={gameTitle}>
  <BaseGame 
    gameTitle={gameTitle}
    gameId="new-game"
    instructions="Game instructions here"
  >
    <div slot="instructions">
      <GameInstructions 
        title="How to Play"
        rules={gameInstructions}
      />
    </div>
    
    <div slot="game-area">
      <!-- Game-specific UI -->
      <div id="gameArea" class="min-h-[400px] relative">
        <!-- Game content will be populated by JavaScript -->
      </div>
    </div>
  </BaseGame>

  <script>
    import { NewGameClass } from '../../utils/NewGameClass';
    
    // Initialize game
    const game = new NewGameClass();
    
    // Make game globally accessible
    (window as any).newGame = game;
    
    // Setup event listeners
    document.addEventListener('DOMContentLoaded', () => {
      // Additional setup if needed
    });
  </script>
</Layout>
```

### Step 3: Add Navigation

Update navigation to include the new game:

```astro
<!-- Add to navigation component -->
<a href="/games/new-game" class="nav-link">
  New Game
</a>
```

### Step 4: Create Game-Specific Components (if needed)

```astro
---
// src/components/game/NewGameControls.astro
export interface Props {
  onAction?: () => void;
}

const { onAction } = Astro.props;
---

<div class="game-controls">
  <button 
    class="btn btn-primary"
    onclick="window.newGame.handleUserInput('action')"
  >
    Action Button
  </button>
</div>
```

## Component Development

### Component Guidelines

1. **Single Responsibility**: Each component should have one clear purpose
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Accessibility**: Include proper ARIA labels and keyboard navigation
4. **Responsive**: Design for mobile-first approach
5. **Reusability**: Make components as reusable as possible

### Component Template

```astro
---
// Component script (TypeScript)
export interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const { 
  title, 
  variant = 'primary', 
  disabled = false 
} = Astro.props;

// Compute classes based on props
const baseClasses = 'btn transition-colors duration-200';
const variantClasses = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white'
};
const classes = `${baseClasses} ${variantClasses[variant]}`;
---

<!-- Component template (HTML) -->
<button 
  class={classes}
  disabled={disabled}
  aria-label={title}
>
  <slot>{title}</slot>
</button>

<!-- Component styles (CSS) -->
<style>
  .btn {
    @apply px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-blue-300;
  }
  
  .btn:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
</style>
```

### Slot Usage

```astro
<!-- Component with multiple slots -->
<div class="card">
  <header class="card-header">
    <slot name="header" />
  </header>
  
  <main class="card-content">
    <slot /> <!-- Default slot -->
  </main>
  
  <footer class="card-footer">
    <slot name="footer" />
  </footer>
</div>

<!-- Usage -->
<Card>
  <h2 slot="header">Card Title</h2>
  <p>Card content goes here</p>
  <button slot="footer">Action</button>
</Card>
```

## Styling Guidelines

### Tailwind CSS Best Practices

1. **Use Utility Classes**: Prefer utility classes over custom CSS
2. **Component Classes**: Use `@apply` for repeating patterns
3. **Responsive Design**: Use responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
4. **Dark Mode**: Consider dark mode variants (`dark:`)
5. **Custom Properties**: Use CSS custom properties for dynamic values

### Color Palette

```css
/* Primary Colors */
.text-primary { @apply text-blue-600; }
.bg-primary { @apply bg-blue-600; }

/* Secondary Colors */
.text-secondary { @apply text-gray-600; }
.bg-secondary { @apply bg-gray-600; }

/* Success/Error States */
.text-success { @apply text-green-600; }
.text-error { @apply text-red-600; }

/* Game-specific Colors */
.text-game-correct { @apply text-green-400; }
.text-game-wrong { @apply text-red-400; }
```

### Typography Scale

```css
/* Headings */
.heading-1 { @apply text-4xl font-bold; }
.heading-2 { @apply text-3xl font-bold; }
.heading-3 { @apply text-2xl font-semibold; }

/* Body Text */
.text-body { @apply text-base leading-relaxed; }
.text-small { @apply text-sm; }
.text-caption { @apply text-xs text-gray-500; }
```

### Animation Guidelines

```css
/* Standard Transitions */
.transition-standard { @apply transition-all duration-200 ease-in-out; }
.transition-slow { @apply transition-all duration-500 ease-in-out; }

/* Game Animations */
.game-fade-in { @apply animate-fadeIn; }
.game-bounce { @apply animate-bounce; }
.game-pulse { @apply animate-pulse; }
```

## Testing

### Unit Testing

```typescript
// Example test file: src/utils/__tests__/ScoreCalculator.test.ts
import { ScoreCalculator } from '../ScoreCalculator';

describe('ScoreCalculator', () => {
  let calculator: ScoreCalculator;

  beforeEach(() => {
    calculator = new ScoreCalculator(ScoreCalculator.getReactionGameConfig());
  });

  test('calculates round score correctly', () => {
    const score = calculator.calculateRoundScore(1, 0, 2.5, 1, 1);
    expect(score).toBeGreaterThan(0);
  });

  test('handles edge cases', () => {
    const score = calculator.calculateRoundScore(0, 1, 10, 1, 0);
    expect(score).toBe(0);
  });
});
```

### Integration Testing

```typescript
// Example integration test
import { fireEvent, render, screen } from '@testing-library/dom';
import { MathFlowGameClass } from '../MathFlowGameClass';

describe('MathFlowGame Integration', () => {
  test('starts game and shows first problem', async () => {
    const game = new MathFlowGameClass();
    
    // Mock DOM elements
    document.body.innerHTML = `
      <div id="mathProblem"></div>
      <div id="mathOptions"></div>
    `;
    
    game.startGame();
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const problemElement = document.getElementById('mathProblem');
    expect(problemElement?.textContent).toContain('=');
  });
});
```

### E2E Testing Guidelines

```javascript
// Example Playwright test
test('complete math flow game', async ({ page }) => {
  await page.goto('/games/math-flow');
  
  // Start game
  await page.click('[data-testid="start-button"]');
  
  // Wait for first problem
  await page.waitForSelector('[data-testid="math-problem"]');
  
  // Select first option
  await page.click('[data-testid="option-0"]');
  
  // Verify score updated
  const score = await page.textContent('[data-testid="score"]');
  expect(parseInt(score)).toBeGreaterThan(0);
});
```

## Performance Guidelines

### Code Splitting

```typescript
// Lazy load game classes
const loadMathFlow = () => import('./MathFlowGameClass.js');
const loadSimonSays = () => import('./SimonSaysGameClass.js');

// Use dynamic imports in game pages
document.addEventListener('DOMContentLoaded', async () => {
  const { MathFlowGameClass } = await import('../../utils/MathFlowGameClass.js');
  const game = new MathFlowGameClass();
});
```

### Asset Optimization

```astro
---
// Optimize images
import { Image } from 'astro:assets';
import gameImage from '../assets/game-image.png';
---

<Image 
  src={gameImage} 
  alt="Game screenshot"
  width={800}
  height={600}
  format="webp"
  loading="lazy"
/>
```

### Performance Monitoring

```typescript
// Performance timing
const startTime = performance.now();
// ... game logic ...
const endTime = performance.now();
console.log(`Operation took ${endTime - startTime} ms`);

// Memory usage monitoring
if ('memory' in performance) {
  console.log('Memory usage:', (performance as any).memory);
}
```

## Deployment

### Build Process

```bash
# Production build
bun run build

# Preview production build
bun run preview

# Build for specific environment
NODE_ENV=production bun run build
```

### Deployment Platforms

#### Netlify
1. Connect GitHub repository
2. Set build command: `bun run build`
3. Set publish directory: `dist`
4. Deploy

#### Vercel
1. Import project from GitHub
2. Framework preset: Astro
3. Deploy

#### GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - run: bun install
      - run: bun run build
      - uses: actions/upload-pages-artifact@v1
        with:
          path: ./dist
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v1
```

### Environment Variables

```bash
# .env.example
PUBLIC_SITE_URL=https://mind-games.example.com
PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Performance Checklist

- [ ] Bundle size < 100KB per game
- [ ] Images optimized (WebP format)
- [ ] Critical CSS inlined
- [ ] JavaScript lazy loaded
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing

---

*This development guide should be updated as the project evolves and new patterns emerge.*
