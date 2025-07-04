import { BaseGameClass, type GameConfig } from './BaseGameClass.js';
import { ScoreCalculator } from './ScoreCalculator.js';

interface MathProblem {
  question: string;
  correctAnswer: number;
  options: number[];
  operation: string;
  previousAnswer?: number;
}

interface Distraction {
  text: string;
  x: number;
  y: number;
  id: string;
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
  MAX_LIVES: 15
};

export class MathFlowGameClass extends BaseGameClass {
  private currentProblem: MathProblem | null = null;
  private previousAnswer: number = 0;
  private streak: number = 0;
  private distractions: Distraction[] = [];
  private scoreCalculator: ScoreCalculator;
  private questionStartTime: number = 0;
  private totalCorrect: number = 0;
  private totalMistakes: number = 0;
  private currentDifficulty: GameDifficulty = DIFFICULTY_SETTINGS[0];
  private gameInitialized: boolean = false;
  private lives: number = GAME_CONSTANTS.STARTING_LIVES;

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
      
      // Validate starting state
      this.previousAnswer = this.validateNumber(this.previousAnswer, 'starting number');
      
      // Update display
      this.updateGameStatus(`Get ready!`);
      this.updateLivesDisplay();
      
      // Start first problem after a short delay
      setTimeout(() => {
        try {
          this.generateNewProblem();
          this.generateDistractions();
        } catch (error) {
          console.error('Error generating first problem:', error);
          this.handleGameError("Error starting game. Please try again.");
        }
      }, 2000);
    } catch (error) {
      console.error('Error in startGameLogic:', error);
      this.handleGameError("Error starting game. Please refresh and try again.");
    }
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
      
      this.generateNewProblem();
      this.generateDistractions();
    } catch (error) {
      console.error('Error in newRound:', error);
      this.handleGameError("Error generating new round. Please restart.");
    }
  }

  private generateNewProblem(): void {
    try {
      // Validate and sanitize previous answer
      this.previousAnswer = this.validateNumber(this.previousAnswer, 'problem generation previous answer');
      
      const availableOperations = this.currentDifficulty.operations;
      const operation = availableOperations[Math.floor(Math.random() * availableOperations.length)];
      
      let operand: number;
      let correctAnswer: number;
      let finalOperation = operation;
      
      // Generate safe operand and answer based on operation
      switch (operation) {
        case '+':
          operand = this.generateAdditionOperand();
          correctAnswer = this.previousAnswer + operand;
          break;
        case '-':
          // Check if subtraction is safe
          if (this.previousAnswer <= 2) {
            // Fallback to addition for very small numbers
            operand = this.generateAdditionOperand();
            correctAnswer = this.previousAnswer + operand;
            finalOperation = '+';
          } else {
            operand = this.generateSubtractionOperand();
            correctAnswer = this.previousAnswer - operand;
            // Double check result is positive
            if (correctAnswer <= 0) {
              operand = this.generateAdditionOperand();
              correctAnswer = this.previousAnswer + operand;
              finalOperation = '+';
            }
          }
          break;
        case '*':
          operand = this.generateMultiplicationOperand();
          correctAnswer = this.previousAnswer * operand;
          break;
        case '/':
          operand = this.generateDivisionOperand();
          correctAnswer = this.previousAnswer / operand;
          break;
        default:
          // Fallback to safe addition
          operand = 1;
          correctAnswer = this.previousAnswer + operand;
          finalOperation = '+';
      }
      
      // Final validation and capping
      correctAnswer = this.validateNumber(correctAnswer, 'correct answer');
      
      // Generate options
      const options = this.generateSafeOptions(correctAnswer);
      
      // Create question display
      const questionDisplay = this.gameState.round === 1 
        ? `${this.previousAnswer} ${finalOperation} ${operand} = ?`
        : `? ${finalOperation} ${operand} = ?`;
      
      this.currentProblem = {
        question: questionDisplay,
        correctAnswer,
        options,
        operation: finalOperation,
        previousAnswer: this.previousAnswer
      };

      this.questionStartTime = Date.now();
      this.displayProblem();
    } catch (error) {
      console.error('Error generating new problem:', error);
      this.generateFallbackProblem();
    }
  }

  private generateAdditionOperand(): number {
    const maxOperand = Math.min(this.currentDifficulty.maxOperand, GAME_CONSTANTS.MAX_RESULT - this.previousAnswer);
    return Math.floor(Math.random() * Math.max(maxOperand, 1)) + 1;
  }

  private generateSubtractionOperand(): number {
    // Ensure we have a safe range for subtraction
    const maxOperand = Math.min(this.currentDifficulty.maxOperand, this.previousAnswer - 1);
    if (maxOperand <= 0 || this.previousAnswer <= 2) {
      // Can't subtract safely, return 1 as fallback
      return 1;
    }
    return Math.floor(Math.random() * maxOperand) + 1;
  }

  private generateMultiplicationOperand(): number {
    const maxOperand = Math.min(this.currentDifficulty.maxOperand, Math.floor(GAME_CONSTANTS.MAX_RESULT / this.previousAnswer));
    return Math.floor(Math.random() * Math.max(maxOperand, 1)) + 2;
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
      this.currentProblem = {
        question: `${this.previousAnswer} + 1 = ?`,
        correctAnswer: this.previousAnswer + 1,
        options: [
          this.previousAnswer + 1,
          this.previousAnswer + 2,
          this.previousAnswer + 3,
          this.previousAnswer + 4
        ],
        operation: '+',
        previousAnswer: this.previousAnswer
      };
      this.questionStartTime = Date.now();
      this.displayProblem();
    } catch (fallbackError) {
      console.error('Error in fallback problem generation:', fallbackError);
      this.handleGameError("Critical error. Please restart game.");
    }
  }

  private generateSafeOptions(correctAnswer: number): number[] {
    // Safety check: ensure correctAnswer is positive
    if (correctAnswer <= 0) {
      console.warn(`Invalid correctAnswer: ${correctAnswer}, using 1`);
      correctAnswer = 1;
    }
    
    const options = [correctAnswer];
    
    // Scale the range of wrong answers based on round difficulty
    const difficultyMultiplier = Math.min(Math.floor(this.gameState.round / 3) + 1, 5);
    const baseRange = Math.max(Math.abs(correctAnswer * 0.3), 2);
    const range = baseRange * difficultyMultiplier;
    
    // Generate 3 plausible wrong integer answers
    while (options.length < 4) {
      const wrongAnswer = Math.round(correctAnswer + (Math.random() - 0.5) * range * 2);
      // Ensure wrong answers are positive and under 1000
      if (!options.includes(wrongAnswer) && wrongAnswer > 0 && wrongAnswer <= 1000) {
        options.push(wrongAnswer);
      }
    }
    
    // If we couldn't generate enough options under 1000, fill with smaller alternatives
    while (options.length < 4) {
      const smallerWrong = Math.round(correctAnswer + (Math.random() - 0.5) * Math.min(range, 50));
      if (!options.includes(smallerWrong) && smallerWrong > 0 && smallerWrong <= 1000) {
        options.push(smallerWrong);
      }
    }
    
    // Final safety: if we still don't have enough options, add simple alternatives
    while (options.length < 4) {
      const safeOption = Math.max(1, correctAnswer + options.length - 2);
      if (!options.includes(safeOption) && safeOption <= 1000) {
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

  private generateDistractions(): void {
    this.distractions = [];
    const distractionTexts = [
      '🎯', '⭐', '🔥', '💫', '✨', '🌟', '💎', '🎪',
      '123', '456', '789', '999', '000', '555',
      'X', 'Y', 'Z', 'A', 'B', 'C', 'D'
    ];

    // Generate 15-20 distractions randomly across the grid
    const numDistractions = Math.floor(Math.random() * 6) + 15;
    
    for (let i = 0; i < numDistractions; i++) {
      const text = distractionTexts[Math.floor(Math.random() * distractionTexts.length)];
      
      // Random position anywhere in the grid (5-95% to avoid edges)
      const x = Math.random() * 90 + 5;  // 5-95%
      const y = Math.random() * 90 + 5;  // 5-95%
      
      this.distractions.push({
        text,
        x,
        y,
        id: `distraction-${i}`
      });
    }
    
    this.displayDistractions();
  }

  private displayProblem(): void {
    try {
      if (!this.currentProblem) return;

      const problemContainer = document.getElementById('mathProblem');
      const optionsContainer = document.getElementById('mathOptions');
      
      if (problemContainer) {
        problemContainer.innerHTML = `
          <div class="text-center mb-8">
            <div class="text-3xl font-bold text-purple-300 mb-2 text-center">
              ${this.currentProblem.question}
            </div>
          </div>
        `;
        // Remove any existing animation classes and add new-problem class
        problemContainer.classList.remove('new-problem');
        setTimeout(() => problemContainer.classList.add('new-problem'), 10);
      }

      if (optionsContainer) {
        optionsContainer.innerHTML = `
          <div class="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto text-center">
            ${this.currentProblem.options.map((option, index) => `
              <button 
                class="math-option bg-slate-900/10 hover:bg-slate-900/20 border-2 border-slate-300/30 hover:border-purple-400 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all duration-200 transform hover:scale-105 min-w-[120px] text-center"
                data-answer="${option}"
                onclick="window.mathFlowGame.selectAnswer(${option})"
              >
                ${option}
              </button>
            `).join('')}
          </div>
        `;
        // Remove any existing animation classes and add new-problem class
        optionsContainer.classList.remove('new-problem');
        setTimeout(() => optionsContainer.classList.add('new-problem'), 10);
      }
    } catch (error) {
      console.error('Error displaying problem:', error);
      this.updateGameStatus("Error displaying problem. Please restart game.");
    }
  }

  private displayDistractions(): void {
    const gameArea = document.getElementById('distractionArea');
    if (!gameArea) return;

    // Clear existing distractions
    const existingDistractions = gameArea.querySelectorAll('.distraction');
    existingDistractions.forEach(d => d.remove());

    // Add new distractions
    this.distractions.forEach(distraction => {
      const distractionEl = document.createElement('div');
      distractionEl.className = 'distraction absolute text-gray-400 text-lg font-bold pointer-events-none select-none opacity-50';
      distractionEl.style.left = `${distraction.x}%`;
      distractionEl.style.top = `${distraction.y}%`;
      distractionEl.textContent = distraction.text;
      distractionEl.id = distraction.id;
      
      gameArea.appendChild(distractionEl);
    });
  }

  public selectAnswer(selectedAnswer: number | string): void {
    try {
      // Convert to number if it's a string
      const selectedNum = typeof selectedAnswer === 'string' ? parseInt(selectedAnswer) : selectedAnswer;
      
      // Validate inputs
      if (typeof selectedNum !== 'number' || isNaN(selectedNum)) {
        console.error('Invalid selected answer after conversion:', selectedAnswer, '->', selectedNum);
        return;
      }
      
      if (!this.currentProblem || !this.gameState.gameActive) {
        return;
      }

      const timeElapsed = (Date.now() - this.questionStartTime) / 1000;
      const isCorrect = selectedNum === this.currentProblem.correctAnswer;

      if (isCorrect) {
        this.handleCorrectAnswer(timeElapsed);
      } else {
        this.handleWrongAnswer();
      }
      
      this.updateDisplay();
    } catch (error) {
      console.error('Error in selectAnswer:', error);
      this.handleGameError("Error processing answer. Please try again.");
    }
  }

  private handleCorrectAnswer(timeElapsed: number): void {
    try {
      if (!this.currentProblem) return;
      
      this.totalCorrect++;
      this.streak++;
      
      // Add 1 life for correct answer (up to maximum of 15)
      if (this.lives < GAME_CONSTANTS.MAX_LIVES) {
        this.lives++;
      }
      
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
      
      this.updateGameStatus(`Correct!`);
      this.updateLivesDisplay();
      
      // Generate next problem after short delay
      setTimeout(() => {
        try {
          this.newRound();
        } catch (error) {
          console.error('Error generating next round:', error);
          this.handleGameError("Error continuing game. Please restart.");
        }
      }, 1000);
    } catch (error) {
      console.error('Error handling correct answer:', error);
      this.handleGameError("Error processing correct answer.");
    }
  }

  private handleWrongAnswer(): void {
    try {
      if (!this.currentProblem) return;
      
      this.totalMistakes++;
      this.streak = 0;
      
      // Reduce lives by 1 (can go negative)
      this.lives--;
      
      // Check if game should end due to no lives (when lives go below 0)
      if (this.lives < 0) {
        this.updateGameStatus(`Game Over! No lives remaining. Final score: ${this.gameState.score}`);
        this.updateLivesDisplay();
        setTimeout(() => {
          this.endGame();
        }, 2000);
        return;
      }
      
      this.updateGameStatus(`Wrong! The correct answer was ${this.currentProblem.correctAnswer}.`);
      this.updateLivesDisplay();
      
      // Continue with next problem after showing correct answer
      setTimeout(() => {
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
        }
      }, 2000);
    } catch (error) {
      console.error('Error handling wrong answer:', error);
      this.handleGameError("Error processing wrong answer.");
    }
  }

  private updateLivesDisplay(): void {
    const livesCount = document.getElementById('livesCount');
    if (livesCount) {
      livesCount.textContent = this.lives.toString();
    }
  }

  private clearGameArea(): void {
    const problemContainer = document.getElementById('mathProblem');
    const optionsContainer = document.getElementById('mathOptions');
    const gameArea = document.getElementById('distractionArea');
    
    if (problemContainer) problemContainer.innerHTML = '';
    if (optionsContainer) optionsContainer.innerHTML = '';
    if (gameArea) {
      const distractions = gameArea.querySelectorAll('.distraction');
      distractions.forEach(d => d.remove());
    }
  }
}
