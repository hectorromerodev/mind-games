# 🧠 Mind Games - Cognitive Challenge Platform

A modern, interactive web platform featuring brain-training games built with Astro, Tailwind CSS, and TypeScript. Challenge your memory, reaction time, and problem-solving skills with our growing collection of scientifically-inspired cognitive games.

![Mind Games Platform](https://github.com/hectorromerodev/mind-games/src/assets/preview.png)

## 🎮 **Featured Games**

### Simon Says
Test your working memory with increasingly complex sequences. Features:
- Progressive difficulty scaling
- Performance-based scoring system
- Real-time feedback and statistics

### Coming Soon
- Memory Matrix
- Speed Math
- Pattern Recognition
- Logic Puzzles

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

## 🏗️ **Architecture**

Mind Games features a modular, reusable component architecture:

- **Universal Scoring System**: Consistent performance evaluation across all games
- **Standardized Components**: Reusable UI elements and game layouts
- **Type-Safe Game Logic**: TypeScript-based game classes with inheritance
- **Responsive Design**: Mobile-first approach with Tailwind CSS

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
