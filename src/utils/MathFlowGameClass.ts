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

export class MathFlowGameClass extends BaseGameClass {
  private currentProblem: MathProblem | null = null;
  private previousAnswer: number = 0;
  private streak: number = 0;
  private distractions: Distraction[] = [];
  private scoreCalculator: ScoreCalculator;
  private questionStartTime: number = 0;
  private totalCorrect: number = 0;
  private totalMistakes: number = 0;

  constructor() {
    const config: GameConfig = {
      maxTime: 120, // 2 minutes
      showStats: true,
      showReset: true
    };
    super(config);
    this.scoreCalculator = new ScoreCalculator(ScoreCalculator.getReactionGameConfig());
  }

  startGameLogic(): void {
    console.log('Starting Math Flow game...');
    
    // Reset game state
    this.previousAnswer = this.generateStartingNumber();
    this.streak = 0;
    this.totalCorrect = 0;
    this.totalMistakes = 0;
    this.gameState.round = 1;
    this.gameState.score = 0;
    
    // Update display
    this.updateGameStatus("Get ready! Starting with: " + this.previousAnswer);
    
    // Start first problem after a short delay
    setTimeout(() => {
      this.generateNewProblem();
      this.generateDistractions();
    }, 2000);
  }

  endGameLogic(): void {
    console.log('Ending Math Flow game...');
    
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
    
    // Clear the game area
    this.clearGameArea();
    
    this.updateGameStatus(
      `Game Over! Final Score: ${this.gameState.score} | ` +
      `Accuracy: ${accuracy.toFixed(1)}% | ` +
      `Performance: ${performanceLevel}`
    );
  }

  newRound(): void {
    this.generateNewProblem();
    this.generateDistractions();
  }

  private generateStartingNumber(): number {
    // Generate a number between 10-50 for the starting value
    return Math.floor(Math.random() * 41) + 10;
  }

  private generateNewProblem(): void {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let operand: number;
    let correctAnswer: number;
    
    // Generate operand based on operation type and ensure reasonable results
    switch (operation) {
      case '+':
        operand = Math.floor(Math.random() * 20) + 1;
        correctAnswer = this.previousAnswer + operand;
        break;
      case '-':
        operand = Math.floor(Math.random() * Math.min(this.previousAnswer - 1, 20)) + 1;
        correctAnswer = this.previousAnswer - operand;
        break;
      case '*':
        operand = Math.floor(Math.random() * 5) + 2; // 2-6
        correctAnswer = this.previousAnswer * operand;
        break;
      case '/':
        // Find divisors of previousAnswer to ensure clean division
        const divisors = this.findDivisors(this.previousAnswer);
        operand = divisors[Math.floor(Math.random() * divisors.length)];
        correctAnswer = this.previousAnswer / operand;
        break;
      default:
        operand = 1;
        correctAnswer = this.previousAnswer;
    }

    // Generate wrong options
    const options = this.generateOptions(correctAnswer);
    
    this.currentProblem = {
      question: `${this.previousAnswer} ${operation} ${operand} = ?`,
      correctAnswer,
      options,
      operation,
      previousAnswer: this.previousAnswer
    };

    this.questionStartTime = Date.now();
    this.displayProblem();
  }

  private findDivisors(num: number): number[] {
    const divisors = [];
    for (let i = 2; i <= Math.min(num, 10); i++) {
      if (num % i === 0) {
        divisors.push(i);
      }
    }
    return divisors.length > 0 ? divisors : [2]; // Fallback to 2 if no divisors found
  }

  private generateOptions(correctAnswer: number): number[] {
    const options = [correctAnswer];
    
    // Generate 3 plausible wrong answers
    const range = Math.max(Math.abs(correctAnswer * 0.3), 5);
    
    while (options.length < 4) {
      const wrongAnswer = Math.round(correctAnswer + (Math.random() - 0.5) * range * 2);
      if (!options.includes(wrongAnswer) && wrongAnswer > 0) {
        options.push(wrongAnswer);
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

    // Generate 8-12 distractions around the edges
    const numDistractions = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < numDistractions; i++) {
      const text = distractionTexts[Math.floor(Math.random() * distractionTexts.length)];
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      
      let x, y;
      switch (side) {
        case 0: // top
          x = Math.random() * 80 + 10; // 10-90%
          y = Math.random() * 15 + 5;  // 5-20%
          break;
        case 1: // right
          x = Math.random() * 15 + 80; // 80-95%
          y = Math.random() * 60 + 20; // 20-80%
          break;
        case 2: // bottom
          x = Math.random() * 80 + 10; // 10-90%
          y = Math.random() * 15 + 80; // 80-95%
          break;
        case 3: // left
          x = Math.random() * 15 + 5;  // 5-20%
          y = Math.random() * 60 + 20; // 20-80%
          break;
        default:
          x = 50;
          y = 50;
      }
      
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
    if (!this.currentProblem) return;

    const problemContainer = document.getElementById('mathProblem');
    const optionsContainer = document.getElementById('mathOptions');
    
    if (problemContainer) {
      problemContainer.innerHTML = `
        <div class="text-center mb-8">
          <div class="text-2xl font-bold text-white mb-4">
            Previous Result: ${this.currentProblem.previousAnswer}
          </div>
          <div class="text-4xl font-bold text-purple-300 mb-6">
            ${this.currentProblem.question}
          </div>
        </div>
      `;
    }

    if (optionsContainer) {
      optionsContainer.innerHTML = `
        <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
          ${this.currentProblem.options.map((option, index) => `
            <button 
              class="math-option bg-slate-900/10 hover:bg-slate-900/20 border-2 border-slate-300/30 hover:border-purple-400 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all duration-200 transform hover:scale-105"
              data-answer="${option}"
              onclick="window.mathFlowGame.selectAnswer(${option})"
            >
              ${option}
            </button>
          `).join('')}
        </div>
      `;
    }
  }

  private displayDistractions(): void {
    const gameArea = document.getElementById('gameGrid');
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

  public selectAnswer(selectedAnswer: number): void {
    if (!this.currentProblem || !this.gameState.gameActive) return;

    const timeElapsed = (Date.now() - this.questionStartTime) / 1000;
    const isCorrect = selectedAnswer === this.currentProblem.correctAnswer;

    if (isCorrect) {
      this.totalCorrect++;
      this.streak++;
      this.previousAnswer = this.currentProblem.correctAnswer;
      
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
      
      this.updateGameStatus(`Correct! +${roundScore} points (Streak: ${this.streak})`);
      
      // Generate next problem after short delay
      setTimeout(() => {
        this.newRound();
      }, 1000);
      
    } else {
      this.totalMistakes++;
      this.streak = 0;
      
      this.updateGameStatus(`Wrong! The correct answer was ${this.currentProblem.correctAnswer}. Try the next one!`);
      
      // Continue with next problem after showing correct answer
      setTimeout(() => {
        this.previousAnswer = this.currentProblem!.correctAnswer; // Use correct answer to continue
        this.newRound();
      }, 2000);
    }
    
    this.updateDisplay();
  }

  private clearGameArea(): void {
    const problemContainer = document.getElementById('mathProblem');
    const optionsContainer = document.getElementById('mathOptions');
    const gameArea = document.getElementById('gameGrid');
    
    if (problemContainer) problemContainer.innerHTML = '';
    if (optionsContainer) optionsContainer.innerHTML = '';
    if (gameArea) {
      const distractions = gameArea.querySelectorAll('.distraction');
      distractions.forEach(d => d.remove());
    }
  }
}
