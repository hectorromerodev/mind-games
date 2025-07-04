# Mind Games - API Documentation

## Table of Contents
1. [BaseGameClass API](#basegameclass-api)
2. [ScoreCalculator API](#scorecalculator-api)
3. [Game-Specific APIs](#game-specific-apis)
4. [Component APIs](#component-apis)
5. [Utility APIs](#utility-apis)

## BaseGameClass API

### Overview
The `BaseGameClass` is an abstract base class that provides common functionality for all games in the Mind Games platform.

### Constructor
```typescript
constructor(config: GameConfig)
```

**Parameters:**
- `config: GameConfig` - Game configuration object

**GameConfig Interface:**
```typescript
interface GameConfig {
  maxTime: number;        // Maximum game time in seconds
  showStats: boolean;     // Whether to show statistics
  showReset: boolean;     // Whether to show reset button
}
```

### Properties

#### Protected Properties
```typescript
protected gameState: GameState;
protected config: GameConfig;
```

**GameState Interface:**
```typescript
interface GameState {
  gameActive: boolean;    // Whether game is currently active
  round: number;          // Current round number
  score: number;          // Current score
  timeLeft: number;       // Time remaining in seconds
  level: string;          // Performance level
}
```

### Methods

#### Abstract Methods
These methods must be implemented by concrete game classes:

```typescript
abstract startGameLogic(): void;
abstract endGameLogic(): void;
abstract newRound(): void;
```

#### Public Methods

##### `startGame(): void`
Starts the game session.
- Initializes game state
- Starts timer
- Calls `startGameLogic()`

##### `endGame(): void`
Ends the game session.
- Stops timer
- Calls `endGameLogic()`
- Shows results

##### `resetGame(): void`
Resets the game to initial state.
- Clears game state
- Resets timer
- Prepares for new game

##### `updateDisplay(): void`
Updates the game display with current state.
- Updates score display
- Updates timer display
- Updates round counter

#### Protected Methods

##### `updateGameStatus(message: string): void`
Updates the game status message.

**Parameters:**
- `message: string` - Status message to display

##### `validateInput(input: any): boolean`
Validates user input.

**Parameters:**
- `input: any` - User input to validate

**Returns:**
- `boolean` - True if input is valid

### Events

#### Game Lifecycle Events
```typescript
// Game started
window.dispatchEvent(new CustomEvent('gameStarted', { detail: { gameType: 'math-flow' } }));

// Game ended
window.dispatchEvent(new CustomEvent('gameEnded', { detail: { score: 1000, level: 'Expert' } }));

// Round completed
window.dispatchEvent(new CustomEvent('roundCompleted', { detail: { round: 5, score: 200 } }));
```

### Usage Example

```typescript
import { BaseGameClass } from './BaseGameClass';

class CustomGameClass extends BaseGameClass {
  constructor() {
    super({
      maxTime: 120,
      showStats: true,
      showReset: true
    });
  }

  startGameLogic(): void {
    // Custom game initialization logic
    console.log('Starting custom game...');
  }

  endGameLogic(): void {
    // Custom game cleanup logic
    console.log('Ending custom game...');
  }

  newRound(): void {
    // Custom round logic
    console.log('Starting new round...');
  }
}
```

---

## ScoreCalculator API

### Overview
The `ScoreCalculator` class provides unified scoring functionality across all games.

### Constructor
```typescript
constructor(config: ScoreConfig)
```

**ScoreConfig Interface:**
```typescript
interface ScoreConfig {
  baseScore: number;      // Base points per correct answer
  timeBonus: number;      // Bonus multiplier for quick responses
  streakBonus: number;    // Bonus multiplier for consecutive correct answers
  difficultyMultiplier: number; // Multiplier based on difficulty level
}
```

### Static Methods

##### `getReactionGameConfig(): ScoreConfig`
Returns default configuration for reaction-based games.

**Returns:**
- `ScoreConfig` - Default configuration object

##### `getMemoryGameConfig(): ScoreConfig`
Returns default configuration for memory-based games.

**Returns:**
- `ScoreConfig` - Default configuration object

### Instance Methods

##### `calculateRoundScore(correct: number, mistakes: number, timeElapsed: number, round: number, streak: number): number`
Calculates score for a single round.

**Parameters:**
- `correct: number` - Number of correct answers
- `mistakes: number` - Number of mistakes
- `timeElapsed: number` - Time taken in seconds
- `round: number` - Current round number
- `streak: number` - Current streak of correct answers

**Returns:**
- `number` - Calculated score for the round

##### `calculatePerformanceLevel(avgScore: number, totalRounds: number, totalTime: number, totalMistakes: number): PerformanceLevel`
Calculates overall performance level.

**Parameters:**
- `avgScore: number` - Average score per round
- `totalRounds: number` - Total rounds played
- `totalTime: number` - Total time played
- `totalMistakes: number` - Total mistakes made

**Returns:**
- `PerformanceLevel` - Performance assessment

**PerformanceLevel Interface:**
```typescript
interface PerformanceLevel {
  level: string;          // Performance level name
  color: string;          // Color for UI display
  feedback: string;       // Feedback message
  percentage: number;     // Performance percentage
}
```

### Usage Example

```typescript
import { ScoreCalculator } from './ScoreCalculator';

const calculator = new ScoreCalculator(ScoreCalculator.getReactionGameConfig());

// Calculate round score
const roundScore = calculator.calculateRoundScore(
  1,    // correct answers
  0,    // mistakes
  2.5,  // time elapsed
  3,    // round number
  5     // streak
);

// Calculate performance level
const performance = calculator.calculatePerformanceLevel(
  150,  // average score
  10,   // total rounds
  60,   // total time
  2     // total mistakes
);
```

---

## Game-Specific APIs

### MathFlowGameClass

#### Additional Properties
```typescript
private currentProblem: MathProblem | null;
private previousAnswer: number;
private streak: number;
private lives: number;
private lastAnswerWasWrong: boolean;
```

#### MathProblem Interface
```typescript
interface MathProblem {
  question: string;         // Display question
  correctAnswer: number;    // Correct answer
  options: number[];        // Multiple choice options
  operation: string;        // Math operation (+, -, *, /)
  previousAnswer?: number;  // Previous correct answer
  operand?: number;         // Current operand
}
```

#### Public Methods

##### `selectAnswer(selectedAnswer: number | string): void`
Processes user's answer selection.

**Parameters:**
- `selectedAnswer: number | string` - Selected answer

#### Private Methods

##### `generateNewProblem(): void`
Generates a new math problem based on current difficulty.

##### `validateNumber(num: number, context?: string): number`
Validates and sanitizes numeric values.

### SimonSaysGameClass

#### Additional Properties
```typescript
private sequence: number[];
private userSequence: number[];
private currentStep: number;
private showingSequence: boolean;
```

#### Public Methods

##### `selectButton(buttonId: number): void`
Handles button selection during gameplay.

**Parameters:**
- `buttonId: number` - ID of selected button (0-3)

---

## Component APIs

### BaseGame.astro

#### Props
```typescript
interface Props {
  gameTitle: string;      // Game title
  gameId: string;         // Unique game identifier
  instructions: string;   // Game instructions
  maxTime?: number;       // Maximum game time
  showLives?: boolean;    // Whether to show lives counter
}
```

#### Slots
- `instructions` - Custom instructions content
- `game-area` - Main game area content
- `controls` - Custom control buttons

### GameControls.astro

#### Props
```typescript
interface Props {
  showStart?: boolean;    // Show start button
  showReset?: boolean;    // Show reset button
  showPause?: boolean;    // Show pause button
  disabled?: boolean;     // Disable all controls
}
```

### GameInstructions.astro

#### Props
```typescript
interface Props {
  title: string;          // Instructions title
  rules: string[];        // Array of game rules
  tips?: string[];        // Array of tips (optional)
}
```

---

## Utility APIs

### Game Utilities

#### `formatTime(seconds: number): string`
Formats time in seconds to MM:SS format.

**Parameters:**
- `seconds: number` - Time in seconds

**Returns:**
- `string` - Formatted time string

#### `generateRandomNumber(min: number, max: number): number`
Generates random number within range.

**Parameters:**
- `min: number` - Minimum value (inclusive)
- `max: number` - Maximum value (inclusive)

**Returns:**
- `number` - Random number

#### `shuffleArray<T>(array: T[]): T[]`
Shuffles array elements randomly.

**Parameters:**
- `array: T[]` - Array to shuffle

**Returns:**
- `T[]` - Shuffled array

### Storage Utilities

#### `saveGameData(key: string, data: any): void`
Saves game data to localStorage.

**Parameters:**
- `key: string` - Storage key
- `data: any` - Data to save

#### `loadGameData(key: string): any | null`
Loads game data from localStorage.

**Parameters:**
- `key: string` - Storage key

**Returns:**
- `any | null` - Loaded data or null if not found

#### `clearGameData(key: string): void`
Clears specific game data.

**Parameters:**
- `key: string` - Storage key to clear

---

## Error Handling

### Common Error Types

#### `GameError`
```typescript
class GameError extends Error {
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'GameError';
    this.code = code;
  }
}
```

#### `ValidationError`
```typescript
class ValidationError extends GameError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
  }
}
```

### Error Handling Patterns

```typescript
try {
  // Game logic
} catch (error) {
  if (error instanceof GameError) {
    // Handle game-specific errors
    console.error('Game Error:', error.message);
    this.handleGameError(error.message);
  } else {
    // Handle unexpected errors
    console.error('Unexpected Error:', error);
    this.handleGameError('An unexpected error occurred');
  }
}
```

---

*This API documentation should be updated as new features are added or existing APIs are modified.*
