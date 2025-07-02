# Standardized Component IDs

This document defines the standardized IDs used across all game components for reliable DOM manipulation.

## Game Layout Structure

### Main Sections
- `startSection` - The initial start/instructions section
- `gameSection` - The active game play section
- `gameStatus` - Container for game status information
- `gameContent` - Container for game-specific content
- `gameGrid` - Container for game grids (Simon Says, Memory Matrix, etc.)

### Start Game Components
- `startGameContainer` - Container for the start game area
- `startGameTitle` - The main title in the start section
- `startBtn` - The primary start/play again button
- `instructionsContainer` - Container for game instructions

### Game Controls
- `resetBtn` - Reset game button
- `pauseBtn` - Pause game button (when applicable)

### Game Stats
- `statusMessage` - Current game status text
- `round` - Round number display (in GameStats)
- `score` - Score display (in GameStats)
- `timer` - Timer display (in GameStats)
- `level` - Performance level display (in GameStats)

## Usage Guidelines

### For Game Classes
Always use `document.getElementById()` with these standardized IDs instead of query selectors:

```typescript
// ✅ Good - Use standardized IDs
const startBtn = document.getElementById('startBtn');
const instructionsContainer = document.getElementById('instructionsContainer');

// ❌ Avoid - Complex query selectors
const startBtn = startSection.querySelector('button');
const instructionsDiv = startSection.querySelector('.bg-white\\/10');
```

### For Components
When creating new components, use these IDs consistently:

```astro
<!-- ✅ Good - Standardized ID -->
<div id="instructionsContainer">
  <!-- content -->
</div>

<!-- ❌ Avoid - Generic classes only -->
<div class="instructions">
  <!-- content -->
</div>
```

## Benefits of Standardized IDs

1. **Reliability**: IDs are unique and won't change due to CSS updates
2. **Performance**: `getElementById()` is faster than query selectors
3. **Maintainability**: Clear, predictable element targeting
4. **Debugging**: Easy to inspect and test specific elements
5. **Consistency**: All games use the same structure and IDs

## Implementation Checklist

When creating or updating a game:

- [ ] Use `startBtn` for the main action button
- [ ] Use `instructionsContainer` for game instructions
- [ ] Use `startGameTitle` for the start section title
- [ ] Use `gameGrid` for game play areas
- [ ] Use `statusMessage` for game status updates
- [ ] Use `resetBtn` and `pauseBtn` for game controls
- [ ] Avoid complex query selectors in game logic
- [ ] Test all ID-based DOM manipulation

## Current Implementation

The following games and components currently use this standardized approach:

### Games
- ✅ Simon Says (refactored)

### Components
- ✅ BaseGame.astro
- ✅ StartGame.astro
- ✅ GameStats.astro (uses data binding, IDs for display)

### To Be Updated
- [ ] Any future games should follow this pattern
- [ ] Legacy components (if any)

## Recent Improvements

### Reset State Management (Fixed)
- ✅ **Sequence Reset**: Games now properly reset their state when restarting
- ✅ **Round Counter**: Round numbers correctly reset to 1 after game over
- ✅ **Play Again Flow**: "Play Again" button properly initializes clean game state

### Best Practices Established
- ✅ **Double Reset Pattern**: Critical state is reset in both `startGame()` and `startGameLogic()`
- ✅ **State Validation**: Sequence length always matches round number in memory games
- ✅ **Robust Element Selection**: Uses standardized IDs instead of complex selectors

### Testing Checklist
When implementing new games, verify:
- [ ] Round resets to 1 after wrong answer → Play Again
- [ ] Score resets to 0 on new game
- [ ] Game-specific state (sequences, selections, etc.) properly clears
- [ ] Timer resets to full duration
- [ ] Performance level shows correctly after reset
