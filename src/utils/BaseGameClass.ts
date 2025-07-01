/**
 * Base Game Class - Abstract foundation for all Mind Games
 * 
 * This class provides common functionality that all games share:
 * - Timer management
 * - Score tracking
 * - Game state handling
 * - Display updates
 * - Smooth transitions
 */

export interface GameState {
  round: number;
  score: number;
  timeLeft: number;
  gameActive: boolean;
  level: string;
  gameStartTime: number;
}

export interface GameConfig {
  maxTime: number;
  showStats: boolean;
  showReset: boolean;
  showPause?: boolean;
}

export abstract class BaseGameClass {
  protected gameState: GameState;
  protected config: GameConfig;
  protected timer: ReturnType<typeof setInterval> | null = null;

  constructor(config: GameConfig) {
    this.config = config;
    this.gameState = {
      round: 1,
      score: 0,
      timeLeft: config.maxTime,
      gameActive: false,
      level: 'Ready to Start',
      gameStartTime: 0
    };
  }

  // Abstract methods that each game must implement
  abstract startGameLogic(): void;
  abstract endGameLogic(): void;
  abstract newRound(): void;

  // Common game functionality
  startGame(): void {
    const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
    
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.textContent = 'Starting...';
    }

    setTimeout(() => {
      this.gameState.gameActive = true;
      this.gameState.timeLeft = this.config.maxTime;
      this.gameState.gameStartTime = Date.now();
      this.gameState.round = 1;
      this.gameState.score = 0;
      this.gameState.level = 'Playing...';

      this.startTimer();
      this.startGameLogic();
      this.showGameSection();
      this.updateDisplay();
    }, 300);
  }

  endGame(): void {
    this.gameState.gameActive = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.endGameLogic();
    this.showStartSection();
  }

  resetGame(): void {
    this.gameState = {
      round: 1,
      score: 0,
      timeLeft: this.config.maxTime,
      gameActive: false,
      level: 'Ready to Start',
      gameStartTime: 0
    };

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.showStartSection();
    this.updateDisplay();
  }

  protected startTimer(): void {
    this.timer = setInterval(() => {
      this.gameState.timeLeft--;
      this.updateDisplay();

      if (this.gameState.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  protected updateDisplay(): void {
    const roundElement = document.getElementById('round');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const levelElement = document.getElementById('level');

    if (roundElement) roundElement.textContent = this.gameState.round.toString();
    if (scoreElement) scoreElement.textContent = this.gameState.score.toLocaleString();
    if (timerElement) {
      const minutes = Math.floor(this.gameState.timeLeft / 60);
      const seconds = this.gameState.timeLeft % 60;
      timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    if (levelElement) levelElement.textContent = this.gameState.level;
  }

  protected showGameSection(): void {
    const startSection = document.getElementById('startSection');
    const gameSection = document.getElementById('gameSection');

    if (startSection) {
      startSection.classList.add('fade-out');
      
      setTimeout(() => {
        startSection.style.display = 'none';
        
        if (gameSection) {
          gameSection.style.display = 'block';
          gameSection.offsetHeight; // Force reflow
          gameSection.classList.remove('opacity-0', 'translate-y-8');
          gameSection.classList.add('fade-in');
        }
      }, 500);
    }
  }

  protected showStartSection(): void {
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

          const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
          if (startBtn) {
            startBtn.disabled = false;
            startBtn.textContent = 'Start Game';
          }
        }
      }, 500);
    }
  }

  protected updateGameStatus(message: string): void {
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) statusMessage.textContent = message;
  }

  // Getters for game state
  get round() { return this.gameState.round; }
  get score() { return this.gameState.score; }
  get timeLeft() { return this.gameState.timeLeft; }
  get gameActive() { return this.gameState.gameActive; }
  get level() { return this.gameState.level; }
}
