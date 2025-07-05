import { BaseGameClass, type GameConfig } from './BaseGameClass.js';
import { ScoreCalculator } from './ScoreCalculator.js';

interface MathProblem {
  question: string;
  correctAnswer: number;
  options: number[];
  operation: string;
  previousAnswer?: number;
  operand?: number;
}

interface GameDifficulty {
  level: number;
  multiplier: number;
  maxOperand: number;
  maxResult: number;
  operations: string[];
}

// Global difficulty settings
const DIFFICULTY_SETTINGS: GameDifficulty[] = [
  { level: 1, multiplier: 1, maxOperand: 5, maxResult: 50, operations: ['+', '-'] },
  { level: 2, multiplier: 1.5, maxOperand: 10, maxResult: 100, operations: ['+', '-', '*'] },
  { level: 3, multiplier: 2, maxOperand: 15, maxResult: 200, operations: ['+', '-', '*', '/'] },
  { level: 4, multiplier: 2.5, maxOperand: 20, maxResult: 500, operations: ['+', '-', '*', '/'] },
  { level: 5, multiplier: 3, maxOperand: 25, maxResult: 1000, operations: ['+', '-', '*', '/'] }
];

// Global game constants
const GAME_CONSTANTS = {
  MAX_RESULT: 1000,
  MIN_RESULT: 1,
  STARTING_NUMBER_MIN: 1,
  STARTING_NUMBER_MAX: 10,
  ROUNDS_PER_DIFFICULTY: 3,
  MAX_DIFFICULTY_LEVEL: 5,
  OPTION_COUNT: 4,
  STARTING_LIVES: 0,
  MAX_LIVES: 5
};

export class MathFlowGameClass extends BaseGameClass {
  private currentProblem: MathProblem | null = null;
  private previousAnswer: number = 0;
  private streak: number = 0;
  private scoreCalculator: ScoreCalculator;
  private questionStartTime: number = 0;
  private totalCorrect: number = 0;
  private totalMistakes: number = 0;
  private currentDifficulty: GameDifficulty = DIFFICULTY_SETTINGS[0];
  private gameInitialized: boolean = false;
  private lives: number = GAME_CONSTANTS.STARTING_LIVES;
  private lastAnswerWasWrong: boolean = false;

  // Performance: Track active timeouts for cleanup
  private activeTimeouts: Set<NodeJS.Timeout> = new Set();
  
  // Performance: Cache DOM elements to avoid repeated queries
  private domCache: Map<string, HTMLElement> = new Map();
  
  // Stability: Track operation state to prevent double-execution
  private isProcessingAnswer: boolean = false;
  private isGeneratingProblem: boolean = false;

  constructor() {
    const config: GameConfig = {
      maxTime: 120, // 2 minutes
      showStats: true,
      showReset: true
    };
    super(config);
    this.scoreCalculator = new ScoreCalculator(ScoreCalculator.getReactionGameConfig());
    this.initializeGame();
  }

  private initializeGame(): void {
    try {
      this.currentDifficulty = DIFFICULTY_SETTINGS[0];
      this.previousAnswer = this.generateSafeStartingNumber();
      this.gameInitialized = true;
    } catch (error) {
      console.error('Error initializing Math Flow game:', error);
      this.gameInitialized = false;
    }
  }

  private updateDifficulty(): void {
    try {
      const difficultyLevel = Math.min(
        Math.floor(this.gameState.round / GAME_CONSTANTS.ROUNDS_PER_DIFFICULTY),
        GAME_CONSTANTS.MAX_DIFFICULTY_LEVEL - 1
      );
      
      this.currentDifficulty = DIFFICULTY_SETTINGS[difficultyLevel];
    } catch (error) {
      console.error('Error updating difficulty:', error);
      this.currentDifficulty = DIFFICULTY_SETTINGS[0]; // fallback to easiest
    }
  }

  private generateSafeStartingNumber(): number {
    return Math.floor(Math.random() * (GAME_CONSTANTS.STARTING_NUMBER_MAX - GAME_CONSTANTS.STARTING_NUMBER_MIN + 1)) + GAME_CONSTANTS.STARTING_NUMBER_MIN;
  }

  private validateNumber(num: number, context: string = 'number'): number {
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
      console.warn(`Invalid ${context}: ${num}, using safe default`);
      return GAME_CONSTANTS.MIN_RESULT;
    }
    
    if (num < GAME_CONSTANTS.MIN_RESULT) {
      console.warn(`${context} too small: ${num}, using minimum`);
      return GAME_CONSTANTS.MIN_RESULT;
    }
    
    if (num > GAME_CONSTANTS.MAX_RESULT) {
      console.warn(`${context} too large: ${num}, using maximum`);
      return GAME_CONSTANTS.MAX_RESULT;
    }
    
    return Math.round(num);
  }

  startGameLogic(): void {
    try {
      // Stability: Clear any previous state
      this.clearAllTimeouts();
      this.resetStateFlags();
      this.clearDOMCache();

      // Safety check: ensure game is properly initialized
      if (!this.gameInitialized) {
        this.initializeGame();
      }
      
      // Clear any existing game content first
      this.clearGameArea();
      
      // Reset game state with validated values
      this.previousAnswer = this.generateSafeStartingNumber();
      this.streak = 0;
      this.totalCorrect = 0;
      this.totalMistakes = 0;
      this.gameState.round = 1;
      this.gameState.score = 0;
      this.currentDifficulty = DIFFICULTY_SETTINGS[0];
      this.lives = GAME_CONSTANTS.STARTING_LIVES;
      this.lastAnswerWasWrong = false;
      
      // Validate starting state
      this.previousAnswer = this.validateNumber(this.previousAnswer, 'starting number');
      
      // Update display
      this.updateGameStatus(`Get ready!`);
      this.updateLivesDisplay();
      
      // Show "Get ready!" for 1.5 seconds, then show round for 1 second, then generate first problem
      this.safeSetTimeout(() => {
        if (!this.gameState.gameActive) return; // Stability: Check game is still active
        
        this.updateGameStatus(`Round ${this.gameState.round}`);
        
        this.safeSetTimeout(() => {
          if (!this.gameState.gameActive) return; // Stability: Check game is still active
          
          try {
            this.generateNewProblem();
          } catch (error) {
            console.error('Error generating first problem:', error);
            this.handleGameError("Error starting game. Please try again.");
          }
        }, 1000);
      }, 1500);
    } catch (error) {
      console.error('Error in startGameLogic:', error);
      this.handleGameError("Error starting game. Please refresh and try again.");
    }
  }

  // Override endGame to ensure proper cleanup
  endGame(): void {
    // Clear all timeouts and reset flags
    this.clearAllTimeouts();
    this.resetStateFlags();
    
    // Call parent endGame
    super.endGame();
  }

  endGameLogic(): void {
    // Calculate final performance level
    const avgScore = this.totalCorrect > 0 ? this.gameState.score / this.gameState.round : 0;
    const accuracy = this.totalCorrect > 0 ? (this.totalCorrect / (this.totalCorrect + this.totalMistakes)) * 100 : 0;
    const totalTime = this.config.maxTime - this.gameState.timeLeft;
    const efficiency = totalTime > 0 ? this.gameState.score / totalTime : 0;
    
    const performanceLevel = this.scoreCalculator.calculatePerformanceLevel(
      avgScore,
      this.gameState.round,
      totalTime,
      this.totalMistakes
    );

    this.gameState.level = performanceLevel.level;
    this.updateDisplay();
    
    // Show game over results similar to Simon Says
    this.showGameOverResults(performanceLevel, accuracy);
  }

  showGameOverResults(performance: any, accuracy: number): void {
    const startSection = document.getElementById('startSection');
    const gameSection = document.getElementById('gameSection');

    if (gameSection) {
      gameSection.classList.add('fade-out');
      
      setTimeout(() => {
        gameSection.style.display = 'none';
        
        if (startSection) {
          startSection.style.display = 'block';
          startSection.classList.remove('fade-out');
          startSection.classList.add('fade-in');

          // Update title using standardized ID
          const startGameTitle = document.getElementById('startGameTitle');
          if (startGameTitle) {
            startGameTitle.textContent = 'Game Over!';
          }

          // Update button using standardized ID
          const startGameBtn = document.getElementById('startBtn');
          if (startGameBtn) {
            startGameBtn.textContent = 'Play Again';
            (startGameBtn as HTMLButtonElement).disabled = false;
          }

          // Update instructions container using standardized ID
          const instructionsContainer = document.getElementById('instructionsContainer');
          if (instructionsContainer) {
            instructionsContainer.innerHTML = `
              <div class="text-center space-y-4">
                <div class="text-2xl mb-4">Your Results</div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div class="bg-white/10 rounded-lg p-4">
                    <div class="text-2xl font-bold text-purple-400">${this.gameState.round - 1}</div>
                    <div class="text-sm text-gray-300">Problems Solved</div>
                  </div>
                  <div class="bg-white/10 rounded-lg p-4">
                    <div class="text-2xl font-bold text-blue-400">${this.gameState.score.toLocaleString()}</div>
                    <div class="text-sm text-gray-300">Score</div>
                  </div>
                  <div class="bg-white/10 rounded-lg p-4">
                    <div class="text-2xl font-bold text-green-400">${accuracy.toFixed(1)}%</div>
                    <div class="text-sm text-gray-300">Accuracy</div>
                  </div>
                </div>
                <div class="bg-white/10 rounded-lg p-4">
                  <div class="text-lg font-bold ${performance.color || 'text-yellow-400'}">${performance.level}</div>
                  <div class="text-sm text-gray-300">Performance Level</div>
                </div>
                <div class="mt-6 p-4 bg-purple-500/20 rounded-lg">
                  <div class="text-gray-300">${performance.feedback || 'Great job on mental math!'}</div>
                </div>
              </div>
            `;
          }
        }
      }, 500);
    }
  }

  private handleGameError(message: string): void {
    console.error('Game Error:', message);
    this.updateGameStatus(message);
    
    // Try to recover with a safe state
    try {
      this.previousAnswer = this.validateNumber(this.previousAnswer, 'recovery previous answer');
      if (this.previousAnswer === GAME_CONSTANTS.MIN_RESULT) {
        this.previousAnswer = this.generateSafeStartingNumber();
      }
    } catch (error) {
      console.error('Error in recovery:', error);
      this.previousAnswer = GAME_CONSTANTS.STARTING_NUMBER_MIN;
    }
  }

  newRound(): void {
    try {
      // Check if game is still active before generating new round
      if (!this.gameState.gameActive) {
        return;
      }
      
      // Update difficulty based on current round
      this.updateDifficulty();
      
      // Validate previous answer before continuing
      this.previousAnswer = this.validateNumber(this.previousAnswer, 'round previous answer');
      
      this.updateGameStatus(`Round ${this.gameState.round}`);
      
      // Give time for the round status to be visible before generating problem
      this.safeSetTimeout(() => {
        if (!this.gameState.gameActive) {
          return;
        }
        this.generateNewProblem();
      }, 1000);
    } catch (error) {
      console.error('Error in newRound:', error);
      this.handleGameError("Error generating new round. Please restart.");
    }
  }

  private generateNewProblem(): void {
    try {
      // Stability: Prevent concurrent problem generation
      if (this.isGeneratingProblem || !this.gameState.gameActive) {
        return;
      }

      this.isGeneratingProblem = true;

      // Validate and sanitize previous answer
      this.previousAnswer = this.validateNumber(this.previousAnswer, 'problem generation previous answer');
      
      // Select a safe operation
      const operation = this.selectSafeOperation();
      
      let operand: number;
      let correctAnswer: number;
      let finalOperation = operation;
      
      // Generate safe operand and answer based on operation
      const result = this.generateOperationResult(operation);
      operand = result.operand;
      correctAnswer = result.correctAnswer;
      finalOperation = result.operation;
      
      // Final validation - ensure we're within bounds
      correctAnswer = this.validateNumber(correctAnswer, 'correct answer');
      
      // Generate options
      const options = this.generateSafeOptions(correctAnswer);
      
      // Create question display - show the previous answer if the last answer was wrong (to help user remember)
      const questionDisplay = this.gameState.round === 1 
        ? `${this.previousAnswer} ${finalOperation} ${operand} = ?`  // First round always shows the starting number
        : (this.lastAnswerWasWrong 
          ? `${this.previousAnswer} ${finalOperation} ${operand} = ?`  // Show previous answer when last was wrong
          : `? ${finalOperation} ${operand} = ?`);  // Hide previous answer when last was correct
      
      this.currentProblem = {
        question: questionDisplay,
        correctAnswer,
        options,
        operation: finalOperation,
        previousAnswer: this.previousAnswer,
        operand: operand
      };

      this.questionStartTime = Date.now();
      this.displayProblem();
      
      this.isGeneratingProblem = false;
    } catch (error) {
      console.error('Error generating new problem:', error);
      this.isGeneratingProblem = false;
      this.generateFallbackProblem();
    }
  }

  private generateAdditionOperand(): number {
    // Ensure the result won't exceed MAX_RESULT
    const maxSafeOperand = GAME_CONSTANTS.MAX_RESULT - this.previousAnswer;
    const maxOperand = Math.min(this.currentDifficulty.maxOperand, maxSafeOperand);
    
    // Ensure we have a valid range
    if (maxOperand < 1) {
      return 1; // Fallback, but this should trigger a fallback to different operation
    }
    
    return Math.floor(Math.random() * maxOperand) + 1;
  }

  private generateSubtractionOperand(): number {
    // Ensure we have a safe range for subtraction (result must be positive)
    const maxOperand = Math.min(this.currentDifficulty.maxOperand, this.previousAnswer - 1);
    if (maxOperand <= 0 || this.previousAnswer <= 2) {
      // Can't subtract safely, return 1 as fallback
      return 1;
    }
    return Math.floor(Math.random() * maxOperand) + 1;
  }

  private generateMultiplicationOperand(): number {
    // Ensure the result won't exceed MAX_RESULT
    const maxSafeOperand = Math.floor(GAME_CONSTANTS.MAX_RESULT / this.previousAnswer);
    const maxOperand = Math.min(this.currentDifficulty.maxOperand, maxSafeOperand);
    
    // Ensure we have a valid range and minimum of 2 for multiplication
    if (maxOperand < 2) {
      return 2; // Fallback, but this should trigger a fallback to different operation
    }
    
    return Math.floor(Math.random() * (maxOperand - 1)) + 2;
  }

  private generateDivisionOperand(): number {
    const divisors = this.findSafeDivisors(this.previousAnswer);
    if (divisors.length === 0) {
      return 1; // fallback
    }
    return divisors[Math.floor(Math.random() * divisors.length)];
  }

  private findSafeDivisors(num: number): number[] {
    const divisors: number[] = [];
    const maxDivisor = Math.min(num, this.currentDifficulty.maxOperand);
    
    for (let i = 1; i <= maxDivisor; i++) {
      if (num % i === 0) {
        divisors.push(i);
      }
    }
    return divisors.length > 0 ? divisors : [1];
  }

  private generateFallbackProblem(): void {
    try {
      // Use the safest possible operation based on current previousAnswer
      let operand: number;
      let correctAnswer: number;
      let operation: string;
      
      if (this.previousAnswer > 2 && this.previousAnswer <= GAME_CONSTANTS.MAX_RESULT) {
        // Use subtraction - always safe and keeps numbers manageable
        operation = '-';
        operand = Math.min(2, this.previousAnswer - 1);
        correctAnswer = this.previousAnswer - operand;
      } else if (this.previousAnswer < GAME_CONSTANTS.MAX_RESULT - 10) {
        // Use addition for small numbers
        operation = '+';
        operand = Math.min(3, GAME_CONSTANTS.MAX_RESULT - this.previousAnswer);
        correctAnswer = this.previousAnswer + operand;
      } else {
        // Use division for large numbers
        operation = '/';
        operand = 2;
        correctAnswer = Math.floor(this.previousAnswer / operand);
      }
      
      // Ensure the result is valid
      correctAnswer = this.validateNumber(correctAnswer, 'fallback correct answer');
      
      const questionDisplay = this.gameState.round === 1 
        ? `${this.previousAnswer} ${operation} ${operand} = ?`
        : (this.lastAnswerWasWrong 
          ? `${this.previousAnswer} ${operation} ${operand} = ?`
          : `? ${operation} ${operand} = ?`);
        
      // Generate safe options around the correct answer
      const options = [correctAnswer];
      const range = Math.max(3, Math.floor(correctAnswer * 0.2));
      
      for (let i = 1; i <= 3; i++) {
        let wrongAnswer: number;
        if (i === 1) {
          wrongAnswer = Math.max(1, correctAnswer - range);
        } else if (i === 2) {
          wrongAnswer = Math.min(GAME_CONSTANTS.MAX_RESULT, correctAnswer + range);
        } else {
          wrongAnswer = Math.max(1, Math.min(GAME_CONSTANTS.MAX_RESULT, correctAnswer + (i - 2) * Math.floor(range / 2)));
        }
        
        if (!options.includes(wrongAnswer)) {
          options.push(wrongAnswer);
        }
      }
      
      // Fill any missing options
      while (options.length < 4) {
        const filler = Math.max(1, Math.min(GAME_CONSTANTS.MAX_RESULT, correctAnswer + options.length - 1));
        if (!options.includes(filler)) {
          options.push(filler);
        } else {
          options.push(Math.max(1, correctAnswer - options.length + 1));
        }
      }
      
      // Shuffle options
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
        
      this.currentProblem = {
        question: questionDisplay,
        correctAnswer: correctAnswer,
        options: options,
        operation: operation,
        previousAnswer: this.previousAnswer,
        operand: operand
      };
      this.questionStartTime = Date.now();
      this.displayProblem();
    } catch (fallbackError) {
      console.error('Error in fallback problem generation:', fallbackError);
      this.handleGameError("Critical error. Please restart game.");
    }
  }

  private generateSafeOptions(correctAnswer: number): number[] {
    // Safety check: ensure correctAnswer is positive and within bounds
    if (correctAnswer <= 0) {
      console.warn(`Invalid correctAnswer: ${correctAnswer}, using 1`);
      correctAnswer = 1;
    }
    if (correctAnswer > GAME_CONSTANTS.MAX_RESULT) {
      console.warn(`correctAnswer exceeds maximum: ${correctAnswer}, using maximum`);
      correctAnswer = GAME_CONSTANTS.MAX_RESULT;
    }
    
    const options = [correctAnswer];
    
    // Scale the range of wrong answers based on round difficulty
    const difficultyMultiplier = Math.min(Math.floor(this.gameState.round / 3) + 1, 5);
    const baseRange = Math.max(Math.abs(correctAnswer * 0.3), 2);
    const range = baseRange * difficultyMultiplier;
    
    // Generate 3 plausible wrong integer answers within bounds
    while (options.length < 4) {
      const wrongAnswer = Math.round(correctAnswer + (Math.random() - 0.5) * range * 2);
      // Ensure wrong answers are positive and within bounds
      if (!options.includes(wrongAnswer) && wrongAnswer > 0 && wrongAnswer <= GAME_CONSTANTS.MAX_RESULT) {
        options.push(wrongAnswer);
      }
    }
    
    // If we couldn't generate enough options within bounds, fill with smaller alternatives
    while (options.length < 4) {
      const smallerRange = Math.min(range, 50);
      const smallerWrong = Math.round(correctAnswer + (Math.random() - 0.5) * smallerRange);
      if (!options.includes(smallerWrong) && smallerWrong > 0 && smallerWrong <= GAME_CONSTANTS.MAX_RESULT) {
        options.push(smallerWrong);
      }
    }
    
    // Final safety: if we still don't have enough options, add simple alternatives
    while (options.length < 4) {
      const safeOption = Math.max(1, Math.min(correctAnswer + options.length - 2, GAME_CONSTANTS.MAX_RESULT));
      if (!options.includes(safeOption)) {
        options.push(safeOption);
      }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    return options;
  }

  private displayProblem(): void {
    try {
      if (!this.currentProblem) return;

      // Performance: Use cached DOM elements
      const problemContainer = this.getCachedElement('mathProblem');
      const optionsContainer = this.getCachedElement('mathOptions');
      
      // Remove animation classes from both containers first
      if (problemContainer) {
        problemContainer.classList.remove('new-problem');
      }
      if (optionsContainer) {
        optionsContainer.classList.remove('new-problem');
      }
      
      // Performance: Batch DOM updates
      if (problemContainer) {
        problemContainer.innerHTML = `
          <div class="text-center mb-8">
            <div class="text-3xl font-bold text-purple-300 mb-2 text-center transition-all duration-300">
              ${this.currentProblem.question}
            </div>
          </div>
        `;
      }

      if (optionsContainer) {
        // Performance: Use template literals efficiently
        const optionsHTML = this.currentProblem.options
          .map((option) => `
            <button 
              class="btn btn--game-option btn--game-option--rect"
              data-answer="${option}"
              onclick="window.mathFlowGame.selectAnswer(${option})"
            >
              ${option}
            </button>
          `).join('');

        optionsContainer.innerHTML = `
          <div class="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto text-center">
            ${optionsHTML}
          </div>
        `;
      }
      
      // Performance: Use requestAnimationFrame for smooth animations
      requestAnimationFrame(() => {
        if (problemContainer) {
          problemContainer.classList.add('new-problem');
        }
        if (optionsContainer) {
          optionsContainer.classList.add('new-problem');
        }
      });
    } catch (error) {
      console.error('Error displaying problem:', error);
      this.updateGameStatus("Error displaying problem. Please restart game.");
    }
  }

  public selectAnswer(selectedAnswer: number | string): void {
    try {
      // Stability: Prevent race conditions and double-processing
      if (this.isProcessingAnswer || !this.currentProblem || !this.gameState.gameActive) {
        return;
      }

      this.isProcessingAnswer = true;

      // Convert to number if it's a string
      const selectedNum = typeof selectedAnswer === 'string' ? parseInt(selectedAnswer) : selectedAnswer;
      
      // Validate inputs
      if (typeof selectedNum !== 'number' || isNaN(selectedNum)) {
        console.error('Invalid selected answer after conversion:', selectedAnswer, '->', selectedNum);
        this.isProcessingAnswer = false;
        return;
      }

      const timeElapsed = (Date.now() - this.questionStartTime) / 1000;
      const isCorrect = selectedNum === this.currentProblem.correctAnswer;

      // Add visual feedback to the selected button
      this.highlightSelectedAnswer(selectedNum, isCorrect);

      if (isCorrect) {
        this.handleCorrectAnswer(timeElapsed);
      } else {
        this.handleWrongAnswer();
      }
      
      this.updateDisplay();
      
      // Note: isProcessingAnswer is reset in handle methods after completion
    } catch (error) {
      console.error('Error in selectAnswer:', error);
      this.isProcessingAnswer = false;
      this.handleGameError("Error processing answer. Please try again.");
    }
  }

  private highlightSelectedAnswer(selectedAnswer: number, isCorrect: boolean): void {
    try {
      const optionsContainer = document.getElementById('mathOptions');
      if (!optionsContainer) return;

      const buttons = optionsContainer.querySelectorAll('.btn--game-option');
      buttons.forEach(button => {
        const buttonElement = button as HTMLButtonElement;
        const buttonAnswer = parseInt(buttonElement.dataset.answer || '0');
        
        if (buttonAnswer === selectedAnswer) {
          // Add BEM modifier classes for selection state
          buttonElement.classList.add('btn--game-option--selected');
          buttonElement.disabled = true;
          
          if (isCorrect) {
            buttonElement.classList.add('btn--game-option--correct');
          } else {
            buttonElement.classList.add('btn--game-option--wrong');
          }
        } else {
          // Dim other buttons using BEM modifier class
          buttonElement.classList.add('btn--game-option--disabled');
          buttonElement.disabled = true;
          
          // If wrong answer, highlight the correct answer in green
          if (!isCorrect && this.currentProblem && buttonAnswer === this.currentProblem.correctAnswer) {
            this.safeSetTimeout(() => {
              buttonElement.classList.remove('btn--game-option--disabled');
              buttonElement.classList.add('btn--game-option--correct');
            }, 200);
          }
        }
      });
    } catch (error) {
      console.error('Error highlighting selected answer:', error);
    }
  }

  private handleCorrectAnswer(timeElapsed: number): void {
    try {
      if (!this.currentProblem) {
        this.isProcessingAnswer = false;
        return;
      }
      
      this.totalCorrect++;
      this.streak++;
      
      // Add 1 life for correct answer (up to maximum)
      if (this.lives < GAME_CONSTANTS.MAX_LIVES) {
        this.lives++;
      }
      
      // Show the correct answer in the equation (for correct answers, don't reveal operands)
      this.showCorrectAnswerInEquation(true);
      
      // Mark that the last answer was correct
      this.lastAnswerWasWrong = false;
      
      // Validate and update previous answer
      const newPreviousAnswer = this.validateNumber(this.currentProblem.correctAnswer, 'correct answer update');
      this.previousAnswer = newPreviousAnswer;
      
      // Calculate round score
      const roundScore = this.scoreCalculator.calculateRoundScore(
        1, // correct answers (1 for this round)
        0, // mistakes (0 for this round)
        timeElapsed,
        this.gameState.round,
        this.streak
      );
      
      this.gameState.score += roundScore;
      this.gameState.round++;
      
      // Show round status similar to Simon Says
      this.updateGameStatus(`Round ${this.gameState.round - 1} - Correct!`);
      this.updateLivesDisplay();
      
      // Add subtle success animation to the status
      this.animateStatusMessage('success');
      
      // Generate next problem after short delay
      this.safeSetTimeout(() => {
        if (!this.gameState.gameActive) {
          this.isProcessingAnswer = false;
          return;
        }
        
        try {
          this.newRound();
        } catch (error) {
          console.error('Error generating next round:', error);
          this.handleGameError("Error continuing game. Please restart.");
        } finally {
          this.isProcessingAnswer = false;
        }
      }, 1000);
    } catch (error) {
      console.error('Error handling correct answer:', error);
      this.isProcessingAnswer = false;
      this.handleGameError("Error processing correct answer.");
    }
  }

  private handleWrongAnswer(): void {
    try {
      if (!this.currentProblem) {
        this.isProcessingAnswer = false;
        return;
      }
      
      this.totalMistakes++;
      this.streak = 0;
      
      // Reduce lives by 1, but don't go below 0
      this.lives = Math.max(0, this.lives - 1);
      
      // Show the correct answer in the equation (for wrong answers, reveal operands)
      this.showCorrectAnswerInEquation(false);
      
      // Mark that the last answer was wrong
      this.lastAnswerWasWrong = true;
      
      // Check if game should end due to no lives (when lives reach 0)
      if (this.lives === 0) {
        this.updateGameStatus('Game Over!');
        this.updateLivesDisplay();
        this.safeSetTimeout(() => {
          this.endGame();
        }, 2000);
        this.isProcessingAnswer = false;
        return;
      }
      
      this.updateGameStatus(`Wrong!`);
      this.updateLivesDisplay();
      
      // Add subtle error animation to the status
      this.animateStatusMessage('error');
      
      // Continue with next problem after showing correct answer
      this.safeSetTimeout(() => {
        if (!this.gameState.gameActive) {
          this.isProcessingAnswer = false;
          return;
        }
        
        try {
          // Validate and update previous answer with the correct answer
          if (this.currentProblem && typeof this.currentProblem.correctAnswer === 'number') {
            const newPreviousAnswer = this.validateNumber(this.currentProblem.correctAnswer, 'wrong answer update');
            this.previousAnswer = newPreviousAnswer;
          } else {
            this.previousAnswer = this.generateSafeStartingNumber();
          }
          
          this.newRound();
        } catch (error) {
          console.error('Error generating next round after wrong answer:', error);
          this.handleGameError("Error continuing game. Please restart.");
        } finally {
          this.isProcessingAnswer = false;
        }
      }, 2000);
    } catch (error) {
      console.error('Error handling wrong answer:', error);
      this.isProcessingAnswer = false;
      this.handleGameError("Error processing wrong answer.");
    }
  }

  private updateLivesDisplay(): void {
    const livesCount = document.getElementById('livesCount');
    if (livesCount) {
      // Ensure lives are never displayed as negative
      const displayLives = Math.max(0, this.lives);
      const previousLives = parseInt(livesCount.textContent || '0');
      
      livesCount.textContent = displayLives.toString();
      
      // Add subtle animation when lives change
      if (displayLives !== previousLives) {
        const livesDisplay = document.getElementById('livesDisplay');
        if (livesDisplay) {
          livesDisplay.style.transition = 'all 0.3s ease-in-out';
          
          if (displayLives > previousLives) {
            // Lives increased (correct answer)
            livesDisplay.style.transform = 'scale(1.1)';
            livesDisplay.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
            livesDisplay.style.borderColor = 'rgb(34, 197, 94)';
          } else {
            // Lives decreased (wrong answer)
            livesDisplay.style.transform = 'scale(0.9)';
            livesDisplay.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            livesDisplay.style.borderColor = 'rgb(239, 68, 68)';
          }
          
          // Reset after animation
          this.safeSetTimeout(() => {
            livesDisplay.style.transform = 'scale(1)';
            livesDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            livesDisplay.style.borderColor = 'transparent';
          }, 400);
        }
      }
    }
  }

  private clearGameArea(): void {
    const problemContainer = document.getElementById('mathProblem');
    const optionsContainer = document.getElementById('mathOptions');
    const gameArea = document.getElementById('distractionArea');
    
    if (problemContainer) {
      problemContainer.innerHTML = '';
      // Clear any inline styles that might cause conflicts
      problemContainer.style.opacity = '';
      problemContainer.style.transition = '';
      problemContainer.classList.remove('new-problem');
    }
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      // Clear any inline styles that might cause conflicts
      optionsContainer.style.opacity = '';
      optionsContainer.style.transition = '';
      optionsContainer.classList.remove('new-problem');
    }
    if (gameArea) {
      const distractions = gameArea.querySelectorAll('.distraction');
      distractions.forEach(d => d.remove());
    }
  }

  private showCorrectAnswerInEquation(isCorrectAnswer: boolean = false): void {
    try {
      if (!this.currentProblem) return;

      const problemContainer = document.getElementById('mathProblem');
      if (problemContainer) {
        // Create the equation showing the complete equation with all values revealed
        let equationDisplay: string;
        
        if (isCorrectAnswer) {
          // For correct answers, show the equation as it was originally presented (don't reveal hidden operands)
          if (this.gameState.round === 1) {
            // First round: was "A + B = ?", now show "A + B = result"
            equationDisplay = `${this.currentProblem.previousAnswer} ${this.currentProblem.operation} ${this.currentProblem.operand} = ${this.currentProblem.correctAnswer}`;
          } else {
            // Later rounds: was "? + B = ?", for correct answers still show "? + B = result" (don't reveal the ?)
            equationDisplay = `? ${this.currentProblem.operation} ${this.currentProblem.operand} = ${this.currentProblem.correctAnswer}`;
          }
        } else {
          // For wrong answers, ALWAYS show the complete equation with all operands revealed
          // This reveals the hidden "?" from the original question, showing what the correct equation should have been
          equationDisplay = `${this.currentProblem.previousAnswer} ${this.currentProblem.operation} ${this.currentProblem.operand} = ${this.currentProblem.correctAnswer}`;
        }
        
        // Add smooth transition by fading out, changing content, then fading in
        problemContainer.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
        problemContainer.style.opacity = '0.7';
        problemContainer.style.transform = 'scale(1.05)';
        
        this.safeSetTimeout(() => {
          problemContainer.innerHTML = `
            <div class="text-center mb-8">
              <div class="text-3xl font-bold ${isCorrectAnswer ? 'text-green-400' : 'text-red-400'} mb-2 text-center transition-all duration-300">
                ${equationDisplay}
              </div>
            </div>
          `;
          
          // Fade back in with slightly larger scale
          problemContainer.style.opacity = '1';
          problemContainer.style.transform = 'scale(1)';
          
          // Add a subtle glow effect for correct answers
          const equationElement = problemContainer.querySelector('div > div');
          if (equationElement) {
            equationElement.classList.add('animate-pulse');
            this.safeSetTimeout(() => {
              equationElement.classList.remove('animate-pulse');
            }, 1000);
          }
        }, 150);
      }
    } catch (error) {
      console.error('Error showing correct answer in equation:', error);
    }
  }

  private animateStatusMessage(type: 'success' | 'error'): void {
    try {
      // Try to find the status message element (this depends on your BaseGameClass implementation)
      const statusElement = document.querySelector('.game-status, #gameStatus, .status-message');
      if (statusElement) {
        const element = statusElement as HTMLElement;
        
        // Reset any existing animations
        element.style.transition = 'all 0.3s ease-in-out';
        element.style.transform = 'scale(1)';
        
        if (type === 'success') {
          // Subtle green glow and slight scale
          element.style.color = 'rgb(34, 197, 94)';
          element.style.textShadow = '0 0 10px rgba(34, 197, 94, 0.5)';
          element.style.transform = 'scale(1.05)';
        } else {
          // Subtle red glow and slight shake
          element.style.color = 'rgb(239, 68, 68)';
          element.style.textShadow = '0 0 10px rgba(239, 68, 68, 0.5)';
          element.style.transform = 'scale(1.02)';
          
          // Add a very subtle shake animation
          element.style.animation = 'shakeSubtle 0.5s ease-in-out';
        }
        
        // Reset after animation
        this.safeSetTimeout(() => {
          element.style.transform = 'scale(1)';
          element.style.textShadow = 'none';
          element.style.animation = '';
        }, 500);
      }
    } catch (error) {
      console.error('Error animating status message:', error);
    }
  }

  private isOperationViable(operation: string): boolean {
    switch (operation) {
      case '+':
        return this.previousAnswer < GAME_CONSTANTS.MAX_RESULT;
      case '-':
        return this.previousAnswer > 2;
      case '*':
        return this.previousAnswer * 2 <= GAME_CONSTANTS.MAX_RESULT;
      case '/':
        return this.previousAnswer > 1 && this.findSafeDivisors(this.previousAnswer).length > 1;
      default:
        return false;
    }
  }

  private selectSafeOperation(): string {
    const availableOperations = this.currentDifficulty.operations;
    const viableOperations = availableOperations.filter(op => this.isOperationViable(op));
    
    // If no operations are viable, force a safe fallback
    if (viableOperations.length === 0) {
      if (this.previousAnswer > 2) {
        return '-'; // Subtraction is almost always safe
      } else if (this.previousAnswer < GAME_CONSTANTS.MAX_RESULT) {
        return '+'; // Addition with small numbers
      } else {
        return '/'; // Division as last resort
      }
    }
    
    // Return a random viable operation
    return viableOperations[Math.floor(Math.random() * viableOperations.length)];
  }

  // Performance: DOM element caching system
  private getCachedElement(id: string): HTMLElement | null {
    if (this.domCache.has(id)) {
      const element = this.domCache.get(id)!;
      // Verify element is still in DOM
      if (document.body.contains(element)) {
        return element;
      } else {
        this.domCache.delete(id);
      }
    }
    
    const element = document.getElementById(id);
    if (element) {
      this.domCache.set(id, element);
    }
    return element;
  }

  // Performance: Timeout management
  private safeSetTimeout(callback: () => void, delay: number): NodeJS.Timeout {
    const timeoutId = setTimeout(() => {
      this.activeTimeouts.delete(timeoutId);
      callback();
    }, delay);
    this.activeTimeouts.add(timeoutId);
    return timeoutId;
  }

  // Stability: Clear all active timeouts
  private clearAllTimeouts(): void {
    this.activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.activeTimeouts.clear();
  }

  // Stability: Reset all state flags
  private resetStateFlags(): void {
    this.isProcessingAnswer = false;
    this.isGeneratingProblem = false;
  }

  // Performance: Clear DOM cache
  private clearDOMCache(): void {
    this.domCache.clear();
  }

  // Performance: Refactored operation generation for better maintainability
  private generateOperationResult(operation: string): { operand: number; correctAnswer: number; operation: string } {
    let operand: number;
    let correctAnswer: number;
    let finalOperation = operation;

    switch (operation) {
      case '+':
        // Check if addition is possible without exceeding MAX_RESULT
        if (this.previousAnswer >= GAME_CONSTANTS.MAX_RESULT) {
          // Fallback to subtraction if possible, otherwise division
          if (this.previousAnswer > 2) {
            operand = this.generateSubtractionOperand();
            correctAnswer = this.previousAnswer - operand;
            finalOperation = '-';
          } else {
            operand = 2;
            correctAnswer = Math.floor(this.previousAnswer / operand);
            finalOperation = '/';
          }
        } else {
          operand = this.generateAdditionOperand();
          correctAnswer = this.previousAnswer + operand;
          // Double-check the result
          if (correctAnswer > GAME_CONSTANTS.MAX_RESULT) {
            operand = GAME_CONSTANTS.MAX_RESULT - this.previousAnswer;
            correctAnswer = this.previousAnswer + operand;
          }
        }
        break;
      case '-':
        // Check if subtraction is safe
        if (this.previousAnswer <= 2) {
          // Fallback to addition for very small numbers
          if (this.previousAnswer < GAME_CONSTANTS.MAX_RESULT) {
            operand = this.generateAdditionOperand();
            correctAnswer = this.previousAnswer + operand;
            finalOperation = '+';
          } else {
            // Use division as last resort
            operand = 2;
            correctAnswer = Math.floor(this.previousAnswer / operand);
            finalOperation = '/';
          }
        } else {
          operand = this.generateSubtractionOperand();
          correctAnswer = this.previousAnswer - operand;
          // Double check result is positive
          if (correctAnswer <= 0) {
            if (this.previousAnswer < GAME_CONSTANTS.MAX_RESULT) {
              operand = this.generateAdditionOperand();
              correctAnswer = this.previousAnswer + operand;
              finalOperation = '+';
            } else {
              operand = 2;
              correctAnswer = Math.floor(this.previousAnswer / operand);
              finalOperation = '/';
            }
          }
        }
        break;
      case '*':
        // Check if multiplication is safe
        if (this.previousAnswer * 2 > GAME_CONSTANTS.MAX_RESULT) {
          // Fallback to addition or subtraction
          if (this.previousAnswer < GAME_CONSTANTS.MAX_RESULT) {
            operand = this.generateAdditionOperand();
            correctAnswer = this.previousAnswer + operand;
            finalOperation = '+';
          } else if (this.previousAnswer > 2) {
            operand = this.generateSubtractionOperand();
            correctAnswer = this.previousAnswer - operand;
            finalOperation = '-';
          } else {
            operand = 2;
            correctAnswer = Math.floor(this.previousAnswer / operand);
            finalOperation = '/';
          }
        } else {
          operand = this.generateMultiplicationOperand();
          correctAnswer = this.previousAnswer * operand;
          // Double-check the result
          if (correctAnswer > GAME_CONSTANTS.MAX_RESULT) {
            // Try smaller operand
            operand = Math.max(2, Math.floor(GAME_CONSTANTS.MAX_RESULT / this.previousAnswer));
            correctAnswer = this.previousAnswer * operand;
            // If still too large, fallback to addition
            if (correctAnswer > GAME_CONSTANTS.MAX_RESULT) {
              if (this.previousAnswer < GAME_CONSTANTS.MAX_RESULT) {
                operand = this.generateAdditionOperand();
                correctAnswer = this.previousAnswer + operand;
                finalOperation = '+';
              } else {
                operand = this.generateSubtractionOperand();
                correctAnswer = this.previousAnswer - operand;
                finalOperation = '-';
              }
            }
          }
        }
        break;
      case '/':
        operand = this.generateDivisionOperand();
        correctAnswer = this.previousAnswer / operand;
        // Division should never exceed the previous answer, so it's naturally safe
        // But ensure we get an integer result
        correctAnswer = Math.floor(correctAnswer);
        if (correctAnswer < 1) {
          correctAnswer = 1;
        }
        break;
      default:
        // Fallback to safe addition
        if (this.previousAnswer < GAME_CONSTANTS.MAX_RESULT) {
          operand = 1;
          correctAnswer = this.previousAnswer + operand;
          finalOperation = '+';
        } else {
          operand = 1;
          correctAnswer = this.previousAnswer - operand;
          finalOperation = '-';
        }
    }

    return { operand, correctAnswer, operation: finalOperation };
  }
}
