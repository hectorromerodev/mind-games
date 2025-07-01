/**
 * Generic Score Calculator - Reusable scoring system for all games
 */

export interface ScoreConfig {
  basePoints: number;
  timeBonus: boolean;
  accuracyWeight: number;
  difficultyMultiplier: number;
  roundBonus: number;
  streakBonus: number;
}

export interface GamePerformance {
  round: number;
  score: number;
  timeElapsed: number;
  mistakes: number;
  accuracy: number;
  averageResponseTime: number;
  streak: number;
}

export interface PerformanceResult {
  score: number;
  level: string;
  color: string;
  feedback: string;
}

export class ScoreCalculator {
  private config: ScoreConfig;

  constructor(config: ScoreConfig) {
    this.config = config;
  }

  calculateRoundScore(
    correctAnswers: number,
    mistakes: number,
    timeElapsed: number,
    roundNumber: number,
    streak: number = 0
  ): number {
    let score = 0;

    // Base points for correct answers
    score += correctAnswers * this.config.basePoints;

    // Round bonus (escalating difficulty)
    score += roundNumber * this.config.roundBonus;

    // Streak bonus
    if (streak > 0) {
      score += Math.floor(streak / 3) * this.config.streakBonus;
    }

    // Time bonus (if enabled)
    if (this.config.timeBonus && timeElapsed > 0) {
      const timeBonusMultiplier = Math.max(0.5, 2 - (timeElapsed / 1000) * 0.1);
      score *= timeBonusMultiplier;
    }

    // Accuracy penalty
    if (mistakes > 0) {
      const accuracyPenalty = mistakes * this.config.accuracyWeight;
      score = Math.max(0, score - accuracyPenalty);
    }

    // Difficulty multiplier
    score *= this.config.difficultyMultiplier;

    return Math.floor(score);
  }

  calculatePerformanceLevel(
    totalScore: number,
    rounds: number,
    totalTime: number,
    mistakes: number
  ): PerformanceResult {
    // Calculate normalized metrics
    const averageScorePerRound = totalScore / Math.max(1, rounds);
    const accuracy = rounds > 0 ? Math.max(0, (rounds - mistakes) / rounds) : 0;
    const efficiency = totalTime > 0 ? totalScore / (totalTime / 1000) : 0;

    // Composite performance score
    const performanceScore = 
      (averageScorePerRound * 0.4) + 
      (accuracy * 1000 * 0.3) + 
      (efficiency * 0.2) + 
      (rounds * 10 * 0.1);

    // Determine performance level
    if (performanceScore >= 800) {
      return {
        score: totalScore,
        level: 'Outstanding Master',
        color: 'text-purple-400',
        feedback: 'Exceptional performance! You have mastered this game with outstanding skill and precision.'
      };
    } else if (performanceScore >= 600) {
      return {
        score: totalScore,
        level: 'Excellent Expert',
        color: 'text-blue-400',
        feedback: 'Excellent work! Your performance shows great skill and consistency.'
      };
    } else if (performanceScore >= 450) {
      return {
        score: totalScore,
        level: 'Great Performer',
        color: 'text-green-400',
        feedback: 'Great job! You demonstrate good understanding and solid performance.'
      };
    } else if (performanceScore >= 300) {
      return {
        score: totalScore,
        level: 'Good Player',
        color: 'text-cyan-400',
        feedback: 'Good performance! Keep practicing to improve your skills further.'
      };
    } else if (performanceScore >= 150) {
      return {
        score: totalScore,
        level: 'Solid Beginner',
        color: 'text-gray-300',
        feedback: 'Nice start! With more practice, you can achieve better results.'
      };
    } else if (performanceScore >= 50) {
      return {
        score: totalScore,
        level: 'Learning Player',
        color: 'text-orange-400',
        feedback: 'Keep learning! Focus on accuracy and try to complete more rounds.'
      };
    } else {
      return {
        score: totalScore,
        level: 'Practice More',
        color: 'text-red-400',
        feedback: 'Practice makes perfect! Take your time and focus on understanding the game mechanics.'
      };
    }
  }

  // Predefined configs for different game types
  static getMemoryGameConfig(): ScoreConfig {
    return {
      basePoints: 100,
      timeBonus: true,
      accuracyWeight: 50,
      difficultyMultiplier: 1.5,
      roundBonus: 25,
      streakBonus: 50
    };
  }

  static getReactionGameConfig(): ScoreConfig {
    return {
      basePoints: 50,
      timeBonus: true,
      accuracyWeight: 100,
      difficultyMultiplier: 2.0,
      roundBonus: 10,
      streakBonus: 25
    };
  }

  static getPuzzleGameConfig(): ScoreConfig {
    return {
      basePoints: 200,
      timeBonus: false,
      accuracyWeight: 150,
      difficultyMultiplier: 1.2,
      roundBonus: 50,
      streakBonus: 100
    };
  }
}
