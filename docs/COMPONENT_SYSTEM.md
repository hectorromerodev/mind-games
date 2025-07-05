# Mind Games - Component System

## Overview

This is the **new modular component system** for Mind Games, built with BEM methodology and modern CSS architecture.

## Quick Start

### Installation
The component system is automatically imported via the global CSS:

```css
/* src/styles/global.css */
@import "tailwindcss";
@import "./components/index.css";
```

### Basic Usage

#### Buttons
```html
<!-- Primary button -->
<button class="btn btn--primary btn--lg">Play Game</button>

<!-- Start game button -->
<button class="btn btn--start btn--xl">Start Game</button>
```

#### Game Cards
```html
<div class="game-card">
  <div class="game-card__header">
    <h3 class="game-card__title">Math Challenge</h3>
  </div>
  <div class="game-card__body">
    <p class="game-card__description">Test your math skills...</p>
  </div>
  <div class="game-card__footer">
    <a href="/game" class="game-card__button game-card__button--primary">
      Play Now
    </a>
  </div>
</div>
```

#### Game Statistics
```html
<div class="game-stats">
  <div class="game-stats__card">
    <div class="game-stats__value">42</div>
    <div class="game-stats__label">Score</div>
  </div>
  <div class="game-stats__card">
    <div class="game-stats__value game-stats__value--warning">30</div>
    <div class="game-stats__label">Time Left</div>
  </div>
</div>
```

## Architecture

### File Structure
```
src/styles/components/
├── index.css           # Main import file
├── button.css          # Button system (BEM)
├── game-stats.css      # Game statistics (BEM)
├── glass.css           # Glass morphism effects
├── game-ui.css         # Game UI components
├── game-card.css       # Game card components
├── navigation.css      # Navigation components
├── typography.css      # Typography system
├── layout.css          # Layout and grid system
├── animations.css      # Animation utilities
└── states.css          # State management classes
```

### BEM Methodology
We use Block__Element--Modifier naming:

```css
/* Block */
.game-card { ... }

/* Element */
.game-card__title { ... }
.game-card__description { ... }

/* Modifier */
.game-card--featured { ... }
.game-card__button--primary { ... }
```

## Component Reference

### Buttons (`button.css`)
- **Base**: `.btn`
- **Variants**: `.btn--primary`, `.btn--secondary`, `.btn--start`, etc.
- **Sizes**: `.btn--sm`, `.btn--md`, `.btn--lg`, `.btn--xl`
- **States**: `.btn--disabled`, `.btn--loading`

### Game Statistics (`game-stats.css`)
- **Container**: `.game-stats`
- **Cards**: `.game-stats__card`, `.game-stats__card--wide`
- **Values**: `.game-stats__value`, `.game-stats__value--sm`
- **Labels**: `.game-stats__label`

### Glass Effects (`glass.css`)
- **Cards**: `.glass-card`, `.glass-card--interactive`
- **Overlays**: `.glass-overlay`, `.glass-overlay--dark`
- **Navigation**: `.glass-nav`

### Game UI (`game-ui.css`)
- **Containers**: `.game-container`, `.game-container--compact`
- **Layout**: `.game-layout`, `.start-game-container`
- **Elements**: `.game-status-overlay`, `.game-results-container`

### Game Cards (`game-card.css`)
- **Structure**: `.game-card`, `.game-card__header`, `.game-card__body`
- **Content**: `.game-card__title`, `.game-card__description`
- **Actions**: `.game-card__button`, `.game-card__button--primary`

### Navigation (`navigation.css`)
- **Structure**: `.nav`, `.nav__container`, `.nav__brand`
- **Links**: `.nav__links`, `.nav__link`, `.nav__link--active`

### Typography (`typography.css`)
- **Headings**: `.heading-primary`, `.heading-secondary`, `.heading-tertiary`
- **Text**: `.text-brand`, `.text-muted`, `.text-description`

### Layout (`layout.css`)
- **Containers**: `.container-main`, `.container-game`, `.container-narrow`
- **Grids**: `.grid-games`, `.grid-game-options`, `.grid-stats`
- **Flex**: `.flex-nav`, `.flex-center`, `.flex-game-controls`

### Animations (`animations.css`)
- **Transitions**: `.transition-smooth`, `.transition-game`, `.transition-quick`
- **Animations**: `.animate-fade-in`, `.animate-slide-up`, `.animate-bounce-subtle`

### States (`states.css`)
- **Game States**: `.state-ready`, `.state-playing`, `.state-game-over`
- **UI States**: `.state-success`, `.state-error`, `.state-warning`
- **Difficulty**: `.difficulty-easy`, `.difficulty-medium`, `.difficulty-hard`

## Game Option Buttons - Unified System

### Overview
All interactive game elements (answer options, game cells, etc.) now use a single, unified button system.

### Base Class
```html
<button class="btn btn--game-option">Base Game Option</button>
```

### Variants

#### Rectangular Options (for text/numbers)
```html
<!-- Math Flow answer options -->
<button class="btn btn--game-option btn--game-option--rect">42</button>
<button class="btn btn--game-option btn--game-option--rect">17</button>
```

#### Square Options (for cells/icons)
```html
<!-- Simon Says game cells -->
<div class="btn btn--game-option btn--game-option--square"></div>
<div class="btn btn--game-option btn--game-option--square">🎯</div>
```

### States

#### Selection and Feedback
```html
<!-- Selected state -->
<button class="btn btn--game-option btn--game-option--selected">Selected</button>

<!-- Correct answer -->
<button class="btn btn--game-option btn--game-option--correct">Correct!</button>

<!-- Wrong answer -->
<button class="btn btn--game-option btn--game-option--wrong">Wrong</button>

<!-- Disabled state -->
<button class="btn btn--game-option btn--game-option--disabled">Disabled</button>
```

#### Interactive States
```html
<!-- Active state (for sequences) -->
<div class="btn btn--game-option btn--game-option--active">Active</div>

<!-- Clickable feedback -->
<div class="btn btn--game-option btn--game-option--clickable">Click Me</div>
```

### JavaScript Integration

#### Math Flow Example
```javascript
// Create option buttons
const button = document.createElement('button');
button.className = 'btn btn--game-option btn--game-option--rect';
button.textContent = '42';

// Add state classes
button.classList.add('btn--game-option--selected');
button.classList.add('btn--game-option--correct');
```

#### Simon Says Example
```javascript
// Create game cells
const cell = document.createElement('div');
cell.className = 'btn btn--game-option btn--game-option--square';

// Add active state for sequence
cell.classList.add('btn--game-option--active');

// Add clickable state for user interaction
cell.classList.add('btn--game-option--clickable');
```

## Development Guide

### Adding New Components

1. **Create Component File**
   ```bash
   touch src/styles/components/my-component.css
   ```

2. **Follow BEM Structure**
   ```css
   @layer components {
     .my-component {
       /* Block styles */
     }
     
     .my-component__element {
       /* Element styles */
     }
     
     .my-component--modifier {
       /* Modifier styles */
     }
   }
   ```

3. **Add to Index**
   ```css
   /* src/styles/components/index.css */
   @import './my-component.css';
   ```

### Best Practices

1. **Use BEM naming consistently**
2. **Keep components focused on single responsibility**
3. **Document new components with examples**
4. **Test components across different screen sizes**
5. **Follow existing patterns and conventions**

### Code Examples

#### Custom Button Variant
```css
/* In button.css */
.btn--special {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
}

.btn--special:hover {
  background: linear-gradient(45deg, #ff5252, #26a69a);
}
```

#### Custom Game Card Type
```css
/* In game-card.css */
.game-card--featured {
  border: 2px solid #ffd700;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
}

.game-card--featured .game-card__title {
  color: #ffd700;
}
```

## Performance

### Optimizations
- **Tree-shaking**: Unused CSS is automatically removed
- **Layered architecture**: Proper CSS cascade with `@layer components`
- **Minimal imports**: Only import what you need
- **Efficient selectors**: BEM methodology ensures low specificity

### Build Size
- **Before**: 1,163 lines monolithic file
- **After**: ~1,200 lines across 10 focused files
- **Benefit**: Better maintainability with similar size

## Migration Guide

### From Old System
```html
<!-- OLD -->
<button class="btn-primary">Primary</button>
<div class="game-stat-card">...</div>
<div class="glass-card-hover">...</div>

<!-- NEW -->
<button class="btn btn--primary">Primary</button>
<div class="game-stats__card">...</div>
<div class="glass-card--hover">...</div>
```

### Common Migrations
- `btn-*` → `btn btn--*`
- `game-stat-*` → `game-stats__*`
- `glass-card-*` → `glass-card--*`
- `heading-*` → `heading-*` (unchanged)

## Testing

### Component Testing
```bash
# Build test
npm run build

# Development server
npm run dev

# Linting
npm run lint
```

### Visual Testing
- Test all components in isolation
- Verify responsive behavior
- Check dark/light mode compatibility
- Validate accessibility features

### Debug Tips
- Use browser dev tools to inspect applied styles
- Check import order in `index.css`
- Verify BEM naming conventions
- Test in isolation before integration

## Contributing

### Guidelines
1. Follow BEM methodology
2. Document all new components
3. Test thoroughly before submitting
4. Update this README with new components
5. Maintain consistent code style

### Review Process
1. Create component in separate file
2. Add comprehensive documentation
3. Include usage examples
4. Test across browsers and devices
5. Update migration guide if needed

## Support

For questions or issues with the component system:
- Check the documentation in `/docs/`
- Review examples in component files
- Test in browser dev tools
- Follow BEM naming conventions

---

**Component System Version**: 2.0.0  
**Last Updated**: July 4, 2025  
**Maintained by**: Mind Games Development Team
