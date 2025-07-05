# 🧠 Mind Games - Cognitive Challenge Platform

A modern, interactive web platform featuring brain-training games built with Astro, Tailwind CSS, and TypeScript. Challenge your memory, reaction time, and problem-solving skills with our growing collection of scientifically-inspired cognitive games.

![Mind Games Platform](https://github.com/hectorromerodev/mind-games/blob/master/src/assets/preview.png)

## 🎮 **Featured Games**

### Simon Says
Test your working memory with increasingly complex sequences. Features:
- Progressive difficulty scaling
- Performance-based scoring system
- Real-time feedback and statistics

### Math Flow
Test your arithmetic skills with chained calculations. Features:
- Sequential number operations
- Multiple-choice answers with distractors
- Visual distractions to test focus
- Speed-based scoring system

### Coming Soon
- Memory Matrix
- Speed Math
- Pattern Recognition
- Logic Puzzles

## 🏗️ **Architecture**

### Modern Component System
Mind Games features a component system:

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

**Benefits:**
- 🎯 **BEM Methodology**: Professional naming conventions
- 🔍 **Easy to Find**: Component-specific CSS files
- 📈 **Maintainable**: Clear separation of concerns
- ⚡ **Performance**: Optimized imports and minimal CSS
- 🚀 **Developer Experience**: Comprehensive documentation

### Tech Stack
- **Framework**: Astro 5.0
- **Styling**: Tailwind CSS 4.0 + Custom Component System
- **Language**: TypeScript
- **Package Manager**: Bun
- **Deployment**: GitHub Pages

## 🚀 **Quick Start**

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun build

# Preview production build
bun preview
```

Visit `http://localhost:4321` to start playing!

## 🌐 **Live Demo**

Experience Mind Games online at: **https://hectorromerodev.github.io/mind-games/**

The application is automatically deployed to GitHub Pages on every push to the main branch.

## 🏗️ **Architecture**

Mind Games features a modular, reusable component architecture:

- **Universal Scoring System**: Consistent performance evaluation across all games
- **Standardized Components**: Reusable UI elements and game layouts
- **Unified Game Options**: Single button system for all interactive game elements
- **Type-Safe Game Logic**: TypeScript-based game classes with inheritance
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **BEM Methodology**: Maintainable CSS architecture with component-based styling

## 📊 **Scoring System**

All games use a standardized scoring framework that evaluates:
- **Accuracy**: Precision and attention to detail
- **Speed**: Reaction time and processing efficiency
- **Progression**: Learning rate and adaptation
- **Consistency**: Performance stability over time

Performance levels range from "Practice More" to "Outstanding Master" with detailed feedback.

## 🛠️ **Tech Stack**

- **Framework**: Astro 4.x
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Runtime**: Bun
- **Build**: Vite (via Astro)

## 📁 **Project Structure**

```
src/
├── components/
│   ├── game/              # Game-specific components
│   │   ├── BaseGame.astro       # Main game layout
│   │   ├── GameControls.astro   # Standard controls
│   │   └── GameGrid.astro       # Grid component
│   ├── ui/                # UI primitives
│   │   └── Button.astro         # Consistent buttons
│   ├── GameStats.astro    # Score/timer display
│   └── StartGame.astro    # Start screen
├── layouts/               # Page layouts
├── pages/                 # Routes and games
├── utils/                 # Game logic and scoring
└── styles/               # Global styles
```

## 🎯 **Adding New Games**

1. **Create Game Class**: Extend `BaseGameClass` for game logic
2. **Design UI**: Use `BaseGame.astro` layout with standardized components
3. **Implement Scoring**: Configure `ScoreCalculator` for your game type
4. **Add Navigation**: Update games listing and navigation

See [GAME_ARCHITECTURE.md](./GAME_ARCHITECTURE.md) for detailed instructions.

## 📖 **Documentation**

- [Game Architecture](./GAME_ARCHITECTURE.md) - Component system and development guide
- [Scoring System](./SCORING_SYSTEM.md) - Universal scoring framework
- [Component IDs](./COMPONENT_IDS.md) - Standardized element identification
- [Deployment Guide](./DEPLOYMENT.md) - GitHub Pages deployment setup and configuration

## 📚 **Component System Documentation**

### Using Components
```html
<!-- Buttons -->
<button class="btn btn--primary btn--lg">Play Game</button>
<button class="btn btn--start btn--xl">Start Game</button>

<!-- Game Cards -->
<div class="game-card">
  <div class="game-card__header">
    <h3 class="game-card__title">Math Challenge</h3>
  </div>
  <div class="game-card__body">
    <p class="game-card__description">Test your skills...</p>
  </div>
</div>

<!-- Game Statistics -->
<div class="game-stats">
  <div class="game-stats__card">
    <div class="game-stats__value">42</div>
    <div class="game-stats__label">Score</div>
  </div>
</div>
```

### Component Reference
- **[Component System Guide](docs/COMPONENT_SYSTEM.md)**: Complete component reference
- **[Migration Plan](docs/MIGRATION_PLAN.md)**: Migration documentation
- **[Component Classes](docs/COMPONENT_CLASSES.md)**: Detailed API documentation

### Development Guidelines
1. **Follow BEM methodology**: `block__element--modifier`
2. **Use component-specific files**: Keep styles organized
3. **Document new components**: Update documentation
4. **Test thoroughly**: Ensure cross-browser compatibility

## 🛠️ **Development**

### Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Basic UI elements
│   ├── game/          # Game-specific components
│   └── GameCard.astro # Game listing cards
├── layouts/           # Page layouts
├── pages/             # Route pages
├── styles/            # CSS and component styles
│   └── components/    # Modular component CSS
├── utils/             # Utility functions
└── assets/           # Static assets
```

### Adding New Games
1. Create game component in `src/components/game/`
2. Add game page in `src/pages/games/`
3. Update game listing in `src/pages/games/index.astro`
4. Follow scoring system patterns
5. Use existing UI components

### CSS Architecture
- **Modular Components**: Each component has its own CSS file
- **BEM Methodology**: Professional naming conventions
- **Tailwind Integration**: Custom components extend Tailwind
- **Performance Optimized**: Tree-shaking and minimal output

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Follow the established component patterns
4. Add appropriate tests and documentation
5. Submit a pull request

## 📄 **License**

MIT License - see [LICENSE](./LICENSE) for details.

---

Built with ❤️ for cognitive enhancement and brain training.
