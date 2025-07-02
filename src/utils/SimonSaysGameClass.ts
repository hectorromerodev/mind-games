/**
 * Simon Says Game
 */

import { BaseGameClass, type GameConfig } from '../utils/BaseGameClass.js';
import { ScoreCalculator } from '../utils/ScoreCalculator.js';

export class SimonSaysGame extends BaseGameClass {
  private sequence: number[] = [];
  private currentStep: number = 0;
  private showingSequence: boolean = false;
  private sequenceTimeout: ReturnType<typeof setTimeout> | null = null;
  private scorer: ScoreCalculator;
  private consecutiveCorrect: number = 0;
  private roundStartTime: number = 0;

  constructor() {
    const config: GameConfig = {
      maxTime: 90,
      showStats: true,
      showReset: true,
      showPause: false
    };

    super(config);
    this.scorer = new ScoreCalculator(ScoreCalculator.getMemoryGameConfig());
    this.setupEventListeners();
  }

  setupEventListeners(): void {
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    startBtn?.addEventListener('click', () => this.startGame());
    resetBtn?.addEventListener('click', () => this.resetGame());
  }

  startGameLogic(): void {
    // ALWAYS ensure clean state when starting game logic
    this.sequence = [];
    this.currentStep = 0;
    this.showingSequence = false;
    this.consecutiveCorrect = 0;
    this.roundStartTime = 0;
    
    this.updateGameStatus('Get ready...');
    
    // Ensure display is updated with correct round number
    this.updateDisplay();
    
    // Wait for transition, then start first round
    setTimeout(() => {
      this.createGrid();
      this.newRound();
    }, 1000);
  }

  endGameLogic(): void {
    if (this.sequenceTimeout) {
      clearTimeout(this.sequenceTimeout);
      this.sequenceTimeout = null;
    }

    const performance = this.scorer.calculatePerformanceLevel(
      this.gameState.score,
      this.gameState.round - 1,
      Date.now() - this.gameState.gameStartTime,
      0 // We'd track mistakes in a more comprehensive implementation
    );

    this.gameState.level = performance.level;
    this.showGameOverResults(performance);
  }

  newRound(): void {
    this.currentStep = 0;
    this.roundStartTime = Date.now();

    // Ensure sequence length matches round number
    // For round N, we should have N cells in the sequence
    while (this.sequence.length < this.gameState.round) {
      const randomCell = Math.floor(Math.random() * 9);
      this.sequence.push(randomCell);
    }
    
    this.updateGameStatus(`Round ${this.gameState.round}`);
    this.updateDisplay();
    
    setTimeout(() => this.showSequence(), 800);
  }

  createGrid(): void {
    const grid = document.getElementById('gameGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const innerGrid = document.createElement('div');
    innerGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      max-width: 300px;
      margin: 0 auto;
    `;

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'simon-cell game-cell';
      cell.style.cssText = `
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        transition: all 0.2s ease-in-out;
      `;
      cell.dataset.index = i.toString();
      cell.addEventListener('click', () => this.cellClick(i));
      innerGrid.appendChild(cell);
    }
    
    grid.appendChild(innerGrid);
  }

  showSequence(): void {
    this.showingSequence = true;
    let index = 0;
    
    const showNextCell = () => {
      if (index >= this.sequence.length) {
        this.showingSequence = false;
        this.updateGameStatus('Your turn!');
        return;
      }
      
      const cellIndex = this.sequence[index];
      const cells = document.querySelectorAll('.simon-cell');
      const cell = cells[cellIndex] as HTMLElement;
      
      if (cell) {
        cell.classList.add('active');
        cell.style.background = 'linear-gradient(45deg, #10b981, #34d399)';
        cell.style.borderColor = '#10b981';
        
        setTimeout(() => {
          cell.classList.remove('active');
          cell.style.background = 'rgba(255, 255, 255, 0.1)';
          cell.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          
          index++;
          setTimeout(showNextCell, 200);
        }, 400);
      }
    };
    
    showNextCell();
  }

  cellClick(index: number): void {
    if (this.showingSequence || !this.gameState.gameActive) return;

    const cells = document.querySelectorAll('.simon-cell');
    const cell = cells[index] as HTMLElement;

    // Visual feedback
    if (cell) {
      cell.style.background = 'linear-gradient(45deg, #3b82f6, #60a5fa)';
      cell.style.borderColor = '#3b82f6';
      
      setTimeout(() => {
        cell.style.background = 'rgba(255, 255, 255, 0.1)';
        cell.style.borderColor = 'rgba(255, 255, 255, 0.3)';
      }, 200);
    }

    // Check if correct
    if (index === this.sequence[this.currentStep]) {
      this.currentStep++;
      
      // Check if sequence completed
      if (this.currentStep >= this.sequence.length) {
        this.consecutiveCorrect++;
        
        // Calculate round score
        const roundTime = Date.now() - this.roundStartTime;
        const roundScore = this.scorer.calculateRoundScore(
          1, // One correct sequence
          0, // No mistakes in this implementation
          roundTime,
          this.gameState.round,
          this.consecutiveCorrect
        );
        
        this.gameState.score += roundScore;
        this.gameState.round++;
        
        this.updateGameStatus('Correct!');
        this.updateDisplay();
        
        setTimeout(() => this.newRound(), 1500);
      }
    } else {
      // Wrong cell - for this simple implementation, just end game
      this.consecutiveCorrect = 0;
      this.updateGameStatus('Wrong sequence! Game Over');
      setTimeout(() => this.endGame(), 1500);
    }
  }

  resetGame(): void {
    // Clear any running timeouts
    if (this.sequenceTimeout) {
      clearTimeout(this.sequenceTimeout);
      this.sequenceTimeout = null;
    }

    // Reset Simon Says specific state
    this.sequence = [];
    this.currentStep = 0;
    this.showingSequence = false;
    this.consecutiveCorrect = 0;
    this.roundStartTime = 0;

    // Clear the game grid
    const grid = document.getElementById('gameGrid');
    if (grid) {
      grid.innerHTML = '';
    }

    // Call base class reset first (this resets round to 1)
    super.resetGame();

    // Then reset UI elements to initial state (after base class resets)
    setTimeout(() => {
      this.resetStartSectionUI();
      this.updateGameStatus('Ready to start!');
      
      // Force update display to ensure round shows correctly
      this.updateDisplay();
    }, 100);
  }

  private resetStartSectionUI(): void {
    // Reset the title using standardized ID
    const startGameTitle = document.getElementById('startGameTitle');
    if (startGameTitle) {
      startGameTitle.textContent = 'Ready to start?';
    }

    // Reset the button using standardized ID
    const startGameBtn = document.getElementById('startBtn');
    if (startGameBtn) {
      startGameBtn.textContent = 'Start Game';
      (startGameBtn as HTMLButtonElement).disabled = false;
    }

    // Reset instructions content using standardized ID
    const instructionsContainer = document.getElementById('instructionsContainer');
    if (instructionsContainer) {
      instructionsContainer.innerHTML = `
        <h3 class="text-lg font-bold text-white mb-3">
          How to Play Simon Says:
        </h3>
        <div class="text-gray-300">
          <ul class="text-gray-300 space-y-2">
            <li class="flex items-start gap-2">
              <span class="text-purple-400 mt-1">•</span>
              <span>Watch as cells light up in sequence</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-400 mt-1">•</span>
              <span>Repeat the sequence by clicking the cells in order</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-400 mt-1">•</span>
              <span>Each round adds one more cell to the sequence</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-yellow-400 mt-1">•</span>
              <span>Complete the sequence correctly to advance</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400 mt-1">•</span>
              <span>Try to remember longer and longer sequences!</span>
            </li>
          </ul>
        </div>
      `;
    }
  }

  showGameOverResults(performance: any): void {
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
                    <div class="text-sm text-gray-300">Rounds</div>
                  </div>
                  <div class="bg-white/10 rounded-lg p-4">
                    <div class="text-2xl font-bold text-blue-400">${this.gameState.score.toLocaleString()}</div>
                    <div class="text-sm text-gray-300">Score</div>
                  </div>
                  <div class="bg-white/10 rounded-lg p-4">
                    <div class="text-lg font-bold ${performance.color}">${performance.level}</div>
                    <div class="text-sm text-gray-300">Performance</div>
                  </div>
                </div>
                <div class="mt-6 p-4 bg-purple-500/20 rounded-lg">
                  <div class="text-gray-300">${performance.feedback}</div>
                </div>
              </div>
            `;
          }
        }
      }, 500);
    }
  }

  startGame(): void {
    // Check if this is a restart after game over by looking at button text
    const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
    const isRestart = startBtn?.textContent === 'Play Again';
    
    if (isRestart) {
      // If this is a restart, ensure clean state first
      this.sequence = [];
      this.currentStep = 0;
      this.showingSequence = false;
      this.consecutiveCorrect = 0;
      this.roundStartTime = 0;
      
      // Clear any timeouts
      if (this.sequenceTimeout) {
        clearTimeout(this.sequenceTimeout);
        this.sequenceTimeout = null;
      }
    }
    
    // Call parent startGame which will reset round to 1
    super.startGame();
  }
}
