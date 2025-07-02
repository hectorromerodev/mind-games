# 🎮 Mind Games - Reusable Component Architecture

This document outlines the reusable component system for creating new games efficiently.

## 🏗️ Architecture Overview

### Component Structure
```
src/
├── components/
│   ├── game/              # Game-specific components
│   │   ├── BaseGame.astro       # Main game layout
│   │   ├── GameControls.astro   # Standard controls
│   │   └── GameGrid.astro       # Grid component
│   ├── ui/                # UI primitives
│   │   └── Button.astro         # Consistent button
│   ├── GameStats.astro    # Score/timer display
│   └── StartGame.astro    # Start screen
├── utils/
│   ├── BaseGameClass.ts   # Abstract game logic
│   └── ScoreCalculator.ts # Generic scoring
└── pages/games/           # Individual games
```

## 🚀 Creating a New Game

### 1. Basic Game Structure

```astro
---
import BaseGame from '../../components/game/BaseGame.astro';
import GameControls from '../../components/game/GameControls.astro';
---

<BaseGame 
  gameTitle="Your Game Name"
  gameIcon="🎮"
  description="Brief description"
  maxTime={90}
>
  <div slot="instructions-content">
    <!-- Game instructions -->
  </div>
  
  <div slot="game-content">
    <!-- Your game interface -->
  </div>
  
  <div slot="game-controls">
    <GameControls showReset={true} />
  </div>
</BaseGame>
```

### 2. Game Logic Class

```typescript
import { BaseGameClass, type GameConfig } from '../../utils/BaseGameClass.js';

class YourGame extends BaseGameClass {
  constructor() {
    const config: GameConfig = {
      maxTime: 90,
      showStats: true,
      showReset: true
    };
    super(config);
  }

  startGameLogic(): void {
    // Initialize your game
  }

  endGameLogic(): void {
    // Handle game over
  }

  newRound(): void {
    // Start new round
  }
}
```

## 🧩 Available Components

### BaseGame.astro
Main game wrapper with standard layout and transitions.

**Props:**
- `gameTitle` - Game name
- `gameIcon` - Emoji icon
- `description` - Brief description
- `maxTime` - Game duration in seconds
- `showStats` - Show score/timer (default: true)
- `showInstructions` - Show instructions panel (default: true)

**Slots:**
- `instructions-content` - Game instructions
- `game-content` - Main game interface
- `game-controls` - Control buttons
- `modals` - Custom overlays

### GameControls.astro
Standard control buttons.

**Props:**
- `showReset` - Show reset button (default: true)
- `showPause` - Show pause button (default: false)
- `customButtons` - Array of custom buttons

### GameGrid.astro
Generic grid component for grid-based games.

**Props:**
- `gridSize` - [rows, cols] array
- `cellSize` - Cell size in pixels (default: 80)
- `cellClass` - CSS class for cells
- `onCellClick` - Click handler function name
- `gap` - Grid gap in pixels (default: 8)
- `maxWidth` - Maximum grid width (default: 400)

### Button.astro
Consistent button component.

**Props:**
- `variant` - 'primary' | 'secondary' | 'reset' | 'pause' | 'start'
- `size` - 'sm' | 'md' | 'lg'
- `disabled` - Boolean
- `id` - Element ID
- `onClick` - Click handler

## 🎯 BaseGameClass Methods

### Required Methods (Abstract)
- `startGameLogic()` - Initialize game-specific logic
- `endGameLogic()` - Handle game over
- `newRound()` - Start new round/level

### Available Methods
- `startGame()` - Common start sequence
- `endGame()` - Common end sequence  
- `resetGame()` - Reset to initial state
- `updateDisplay()` - Update score/timer display
- `updateGameStatus(message)` - Update status message

### Game State Properties
- `this.gameState.round` - Current round
- `this.gameState.score` - Current score
- `this.gameState.timeLeft` - Time remaining
- `this.gameState.gameActive` - Game running state
- `this.gameState.level` - Performance level

## 📊 Scoring System

### Score Calculator
Generic scoring with configurable parameters:

```typescript
const scorer = new ScoreCalculator(ScoreCalculator.getMemoryGameConfig());

// Calculate round score
const score = scorer.calculateRoundScore(
  correctAnswers,
  mistakes,
  timeElapsed,
  roundNumber,
  streak
);

// Get performance level
const performance = scorer.calculatePerformanceLevel(
  totalScore,
  rounds,
  totalTime,
  mistakes
);
```

### Predefined Configs
- `getMemoryGameConfig()` - For memory-based games
- `getReactionGameConfig()` - For reaction-time games
- `getPuzzleGameConfig()` - For puzzle/strategy games

## 🎨 Styling Guidelines

### CSS Classes
- `.game-cell` - Standard cell styling
- `.fade-in` / `.fade-out` - Transition animations
- Use Tailwind CSS utilities for consistency

### Colors
- Purple: Primary actions
- Blue: Secondary actions
- Green: Success states
- Red: Danger/reset actions
- Orange: Warning states

## 📝 Examples

See these example implementations:
### Current Games

- `simon-says.astro` - Main Simon Says game using the architecture

## 🔧 Best Practices

1. **Use BaseGameClass** - Extend for all games
2. **Consistent Controls** - Use GameControls component
3. **Standard Layout** - Use BaseGame wrapper
4. **Generic Scoring** - Use ScoreCalculator
5. **Smooth Transitions** - Leverage built-in animations
6. **Mobile-First** - Design for all screen sizes

## 🚀 Development Speed

With this architecture:
- **New games take ~1-2 hours** instead of full days
- **Consistent UX** across all games
- **Shared bug fixes** improve all games
- **Easy maintenance** and updates
- **Rapid prototyping** for game ideas
