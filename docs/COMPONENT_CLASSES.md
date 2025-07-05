# Mind Games - Component System Documentation

## Overview

This document describes the **new modular component system** for the Mind Games platform. The system has been refactored from a single large CSS file to a BEM-based modular architecture.

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

### Import System
The new system uses a centralized import approach:
```css
/* In src/styles/components/index.css */
@import './button.css';
@import './game-stats.css';
@import './glass.css';
/* ... other imports */
```

## Philosophy

- **BEM Methodology**: Block__Element--Modifier naming convention
- **Modular Architecture**: Each component has its own CSS file
- **Professional Naming**: Clear, semantic class names
- **Maintainability**: Easy to find and modify component styles
- **Layer-based**: Uses `@layer components` for proper CSS cascade
- **Performance**: Optimized imports and minimal CSS output

## Component Categories

### 1. Button System (`button.css`)

**Base Button**
```css
.btn                  /* Base button styles */
```

**Button Variants**
```css
.btn--primary         /* Primary action buttons */
.btn--secondary       /* Secondary action buttons */
.btn--success         /* Success state buttons */
.btn--warning         /* Warning state buttons */
.btn--danger          /* Danger/delete buttons */
.btn--neutral         /* Neutral action buttons */
.btn--reset           /* Reset/clear buttons */
.btn--start           /* Game start buttons */
.btn--back            /* Back navigation buttons */
```

**Button Sizes**
```css
.btn--sm              /* Small buttons */
.btn--md              /* Medium buttons (default) */
.btn--lg              /* Large buttons */
.btn--xl              /* Extra large buttons */
```

**Button States**
```css
.btn--disabled        /* Disabled state */
.btn--loading         /* Loading state with spinner */
```

**Game-Specific Buttons - UNIFIED SYSTEM**
```css
.btn--game-option               /* Universal game option button */
.btn--game-option--rect         /* Rectangular variant (for text/numbers) */
.btn--game-option--square       /* Square variant (for cells/icons) */

/* Game Option States */
.btn--game-option--selected     /* Selected state */
.btn--game-option--correct      /* Correct answer state */
.btn--game-option--wrong        /* Wrong answer state */
.btn--game-option--disabled     /* Disabled state */
.btn--game-option--active       /* Active/highlighted state (for sequences) */
.btn--game-option--clickable    /* Clickable feedback state */
```

**Usage Examples**
```html
<!-- Math Flow Answer Options -->
<button class="btn btn--game-option btn--game-option--rect">42</button>

<!-- Simon Says Game Cells -->
<div class="btn btn--game-option btn--game-option--square"></div>

<!-- Future Game Options -->
<button class="btn btn--game-option btn--game-option--rect">Option A</button>
```

### 2. Game Statistics (`game-stats.css`)

**Container**
```css
.game-stats           /* Main stats container */
```

**Stats Cards**
```css
.game-stats__card     /* Individual stat card */
.game-stats__card--wide /* Wide stat card */
```

**Stats Values**
```css
.game-stats__value    /* Main stat value */
.game-stats__value--sm /* Small stat value */
.game-stats__label    /* Stat label */
```

**Value States**
```css
.game-stats__value--danger    /* Red/danger values */
.game-stats__value--warning   /* Yellow/warning values */
.game-stats__value--success   /* Green/success values */
.game-stats__value--info      /* Blue/info values */
```

### 3. Glass Morphism (`glass.css`)

**Base Glass Effects**
```css
.glass-card           /* Basic glass card */
.glass-card--interactive /* Interactive glass card */
.glass-card--hover    /* Hover-only glass card */
.glass-card--instructions /* Instructions container */
.glass-card--game     /* Game container */
```

**Glass Overlays**
```css
.glass-overlay        /* Semi-transparent overlays */
.glass-overlay--dark  /* Dark overlays */
.glass-nav           /* Navigation glass effect */
.glass-modal         /* Modal backdrop */
```

### 4. Game UI Components (`game-ui.css`)

**Game Containers**
```css
.game-container       /* Main game area */
.game-container--compact /* Compact game area */
```

**Game Layout**
```css
.game-layout          /* Game page layout */
.game-body           /* Game body styles */
.start-game-container /* Start game section */
```

**Game Elements**
```css
.game-status-overlay  /* Status overlay */
.game-results-container /* Results container */
.game-instruction-section /* Instructions */
.game-lives-display   /* Lives display */
```

### 5. Game Cards (`game-card.css`)

**Card Structure**
```css
.game-card            /* Main game card */
.game-card__header    /* Card header */
.game-card__body      /* Card body */
.game-card__footer    /* Card footer */
```

**Card Content**
```css
.game-card__title     /* Card title */
.game-card__description /* Card description */
.game-card__badges    /* Badge container */
.game-card__skills    /* Skills container */
```

**Card Actions**
```css
.game-card__actions   /* Action buttons container */
.game-card__button    /* Card button */
.game-card__button--primary   /* Primary card button */
.game-card__button--secondary /* Secondary card button */
```

### 6. Navigation (`navigation.css`)

**Navigation Structure**
```css
.nav                  /* Main navigation */
.nav__container       /* Navigation container */
.nav__brand          /* Brand/logo */
.nav__links          /* Navigation links */
.nav__link           /* Individual link */
.nav__link--active   /* Active link */
```

**Back Button**
```css
.btn-back            /* Back button */
.btn-back__icon      /* Back button icon */
```

### 7. Typography (`typography.css`)

**Headings**
```css
.heading-primary      /* Main headings */
.heading-primary--mobile /* Mobile headings */
.heading-secondary    /* Secondary headings */
.heading-tertiary     /* Tertiary headings */
.heading-game-status  /* Game status headings */
.heading-game-title   /* Game title headings */
```

**Brand Text**
```css
.text-brand          /* Brand gradient text */
.text-brand--alt     /* Alternative brand text */
```

**Text Variants**
```css
.text-muted          /* Muted text */
.text-muted--lg      /* Large muted text */
.text-description    /* Description text */
.text-description--lg /* Large description text */
```

### 8. Layout System (`layout.css`)

**Containers**
```css
.container-main      /* Main page container */
.container-game      /* Game page container */
.container-narrow    /* Narrow container */
.layout-body         /* Body layout styles */
```

**Grid Systems**
```css
.grid-games          /* Games grid */
.grid-game-options   /* Game options grid */
.grid-game-options--4 /* 4-column options grid */
.grid-stats          /* Statistics grid */
```

**Flex Systems**
```css
.flex-nav            /* Navigation flex */
.flex-center         /* Center flex */
.flex-game-controls  /* Game controls flex */
.flex-between        /* Space between flex */
.flex-wrap-center    /* Wrap center flex */
```

### 9. Animations (`animations.css`)

**Transitions**
```css
.transition-game     /* Game transitions */
.transition-smooth   /* Smooth transitions */
.transition-quick    /* Quick transitions */
.transition-slow     /* Slow transitions */
```

**Animations**
```css
.animate-fade-in     /* Fade in animation */
.animate-fade-out    /* Fade out animation */
.animate-slide-up    /* Slide up animation */
.animate-slide-down  /* Slide down animation */
.animate-scale-in    /* Scale in animation */
.animate-bounce-subtle /* Subtle bounce */
.animate-shake-subtle  /* Subtle shake */
```

### 10. States (`states.css`)

**Game States**
```css
.state-ready         /* Ready state */
.state-playing       /* Playing state */
.state-paused        /* Paused state */
.state-game-over     /* Game over state */
.state-success       /* Success state */
.state-error         /* Error state */
.state-warning       /* Warning state */
.state-info          /* Info state */
```

**Difficulty Indicators**
```css
.difficulty-easy     /* Easy difficulty badge */
.difficulty-medium   /* Medium difficulty badge */
.difficulty-hard     /* Hard difficulty badge */
```

**Skill Tags**
```css
.skill-tag           /* Basic skill tag */
.skill-tag--hover    /* Hoverable skill tag */
```

## Usage Examples

### Button Usage
```html
<!-- Primary button -->
<button class="btn btn--primary btn--lg">Play Game</button>

<!-- Game start button -->
<button class="btn btn--start btn--xl">Start Game</button>

<!-- Game option button -->
<button class="btn--game-option">Answer A</button>
```

### Game Stats Usage
```html
<div class="game-stats">
  <div class="game-stats__card">
    <div class="game-stats__value">42</div>
    <div class="game-stats__label">Score</div>
  </div>
</div>
```

### Game Card Usage
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

## Benefits

1. **Easy to Find**: Each component has its own file
2. **Professional Naming**: BEM methodology ensures consistency
3. **Maintainable**: Clear separation of concerns
4. **Scalable**: Easy to add new components
5. **Performance**: Optimized imports and minimal CSS
6. **Developer Experience**: Clear documentation and examples

## Best Practices

1. **Use BEM naming**: `block__element--modifier`
2. **Keep components focused**: One responsibility per file
3. **Document new classes**: Update this documentation
4. **Test thoroughly**: Ensure all components work together
5. **Follow existing patterns**: Maintain consistency

## Future Enhancements

- Component-specific JavaScript modules
- CSS custom properties for theming
- Advanced animation sequences
- Interactive component demos
- Automated component testing
.game-stats-display   /* Individual stat display */
.game-stats-grid      /* Grid layout for stats */
.game-stat-card       /* Individual stat card */
.game-lives-display   /* Lives counter styling */
```

**Game Overlays**
```css
.game-status-overlay  /* Full-screen status overlay */
.game-results-container /* Results display container */
.game-instruction-section /* Instruction sections */
```

### 3. Button System

**Base Button**
```css
.btn-base            /* Base button styling */
```

**Button Variants**
```css
.btn-primary         /* Primary actions */
.btn-secondary       /* Secondary actions */
.btn-success         /* Success/confirm actions */
.btn-warning         /* Warning/caution actions */
.btn-danger          /* Dangerous/destructive actions */
.btn-neutral         /* Neutral/cancel actions */
.btn-reset           /* Reset/restart actions (orange-red gradient) */
```

**Game-Specific Buttons**
```css
.btn-game-option     /* Game answer options */
.btn-game-option-selected /* Selected option */
.btn-game-option-correct  /* Correct answer feedback */
.btn-game-option-wrong    /* Wrong answer feedback */
.btn-game-option-dimmed   /* Dimmed non-selected options */
```

**Button Sizes**
```css
.btn-sm              /* Small buttons */
.btn-md              /* Medium buttons (default) */
.btn-lg              /* Large buttons */
.btn-xl              /* Extra large buttons */
```

### 4. Typography System

**Headings**
```css
.heading-primary     /* Main page headings */
.heading-secondary   /* Section headings */
.heading-tertiary    /* Subsection headings */
.heading-game-status /* Game status messages */
.heading-game-title  /* Game title displays */
```

**Brand Text**
```css
.text-brand          /* Purple-pink gradient */
.text-brand-alt      /* Blue-purple gradient */
```

**Content Text**
```css
.text-muted          /* Muted text (small) */
.text-muted-lg       /* Muted text (large) */
.text-description    /* Description text with line clamp */
```

**Game-Specific Text**
```css
.text-game-problem   /* Math problem display */
.text-game-equation  /* Equation display */
.text-game-equation-correct /* Correct equation styling */
.text-game-equation-wrong   /* Wrong equation styling */
```

### 5. Layout & Grid Systems

**Containers**
```css
.container-main      /* Main content container */
.container-game      /* Game-specific container */
.container-narrow    /* Narrow content container */
```

**Grid Systems**
```css
.grid-games          /* Game card grid */
.grid-game-options   /* 2x2 game options grid */
.grid-game-options-4 /* 4-option flexible grid */
.grid-stats          /* Statistics grid */
```

**Flex Layouts**
```css
.flex-nav            /* Navigation flex layout */
.flex-center         /* Center content */
.flex-game-controls  /* Game control button layout */
.flex-between        /* Space between items */
.flex-wrap-center    /* Centered wrapping flex */
```

### 6. Animation & Transitions

**Transition Timing**
```css
.transition-game     /* Slow transitions for game states */
.transition-smooth   /* Standard smooth transitions */
.transition-quick    /* Quick interactions */
.transition-slow     /* Slow, deliberate transitions */
```

**Animation Classes**
```css
.animate-fade-in     /* Fade in animation */
.animate-fade-out    /* Fade out animation */
.animate-slide-up    /* Slide up from bottom */
.animate-slide-down  /* Slide down from top */
.animate-scale-in    /* Scale in animation */
.animate-bounce-subtle /* Subtle bounce effect */
.animate-shake-subtle  /* Subtle shake effect */
```

### 7. State-Based Classes

**Game States**
```css
.state-ready         /* Ready/waiting state */
.state-playing       /* Active playing state */
.state-paused        /* Paused state */
.state-game-over     /* Game over state */
```

**Feedback States**
```css
.state-success       /* Success feedback */
.state-error         /* Error feedback */
.state-warning       /* Warning feedback */
.state-info          /* Information feedback */
```

### 8. Utility Classes

**Difficulty Indicators**
```css
.difficulty-easy     /* Easy difficulty badge */
.difficulty-medium   /* Medium difficulty badge */
.difficulty-hard     /* Hard difficulty badge */
```

**Skill Tags**
```css
.skill-tag           /* Basic skill tag */
.skill-tag-hover     /* Interactive skill tag */
```

**Aspect Ratios**
```css
.aspect-square       /* 1:1 aspect ratio */
.aspect-video        /* 16:9 aspect ratio */
```

**Backdrop Effects**
```css
.backdrop-game       /* Game backdrop */
.backdrop-modal      /* Modal backdrop */
.backdrop-overlay    /* Overlay backdrop */
```

**Z-Index Layers**
```css
.z-game-ui          /* Game UI elements */
.z-game-overlay     /* Game overlays */
.z-modal            /* Modal elements */
.z-nav              /* Navigation */
```

## Usage Examples

### Basic Game Card
```html
<div class="glass-card-hover">
  <h3 class="heading-tertiary">Math Flow</h3>
  <p class="text-description">Mental arithmetic game...</p>
  <button class="btn-start btn-md">Play Now</button>
</div>
```

### Game Option Buttons
```html
<div class="grid-game-options-4">
  <button class="btn-game-option">42</button>
  <button class="btn-game-option">35</button>
  <button class="btn-game-option">28</button>
  <button class="btn-game-option">51</button>
</div>
```

### Game Stats Display
```html
<div class="game-stats-grid">
  <div class="game-stat-card">
    <div class="text-2xl font-bold text-purple-400">15</div>
    <div class="text-muted">Round</div>
  </div>
  <div class="game-stat-card">
    <div class="text-2xl font-bold text-blue-400">2,450</div>
    <div class="text-muted">Score</div>
  </div>
  <div class="game-stat-card">
    <div class="text-2xl font-bold text-green-400">98%</div>
    <div class="text-muted">Accuracy</div>
  </div>
</div>
```

### Game Status with Animation
```html
<div class="game-status-overlay animate-fade-in">
  <div class="text-center">
    <h2 class="heading-game-status state-success">Correct!</h2>
    <p class="text-muted-lg">Great job!</p>
  </div>
</div>
```

## Best Practices

1. **Use component classes for repeated patterns**
2. **Combine with utility classes for customization**
3. **Maintain semantic class names**
4. **Keep specificity low for easy overrides**
5. **Test accessibility with screen readers**
6. **Verify responsive behavior**

## Accessibility Features

- Focus states for keyboard navigation
- Reduced motion support
- High contrast text combinations
- Screen reader friendly structures

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Backdrop-filter support for glass effects
- CSS custom properties support
- Modern animation support

## Performance Considerations

- Minimal CSS output through Tailwind's purging
- Efficient animations using transform/opacity
- Optimized for 60fps animations
- Minimal reflows and repaints

## Maintenance

- Regular audits for unused classes
- Performance monitoring
- Accessibility testing
- Cross-browser compatibility checks
