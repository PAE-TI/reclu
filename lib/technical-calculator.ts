// Technical Evaluation Calculator
// Calculates scores from technical evaluation responses

export interface TechnicalResponse {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  responseTime?: number;
  difficulty?: string;
  category?: string;
}

export interface TechnicalResult {
  totalScore: number;
  correctAnswers: number;
  totalQuestions: number;
  performanceLevel: string;
  categoryScores: Record<string, number>;
  easyCorrect: number;
  easyTotal: number;
  mediumCorrect: number;
  mediumTotal: number;
  hardCorrect: number;
  hardTotal: number;
  totalTimeTaken: number;
  averageTimePerQuestion: number;
  strengths: string[];
  weaknesses: string[];
}

// Performance level thresholds
const PERFORMANCE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  AVERAGE: 60,
  BELOW_AVERAGE: 40,
  POOR: 0,
};

export function getPerformanceLevel(score: number): string {
  if (score >= PERFORMANCE_THRESHOLDS.EXCELLENT) return 'EXCELLENT';
  if (score >= PERFORMANCE_THRESHOLDS.GOOD) return 'GOOD';
  if (score >= PERFORMANCE_THRESHOLDS.AVERAGE) return 'AVERAGE';
  if (score >= PERFORMANCE_THRESHOLDS.BELOW_AVERAGE) return 'BELOW_AVERAGE';
  return 'POOR';
}

export function getPerformanceLevelLabel(level: string, language: string = 'es'): string {
  const labels: Record<string, Record<string, string>> = {
    es: {
      EXCELLENT: 'Excelente',
      GOOD: 'Bueno',
      AVERAGE: 'Promedio',
      BELOW_AVERAGE: 'Por debajo del promedio',
      POOR: 'Necesita mejorar',
    },
    en: {
      EXCELLENT: 'Excellent',
      GOOD: 'Good',
      AVERAGE: 'Average',
      BELOW_AVERAGE: 'Below Average',
      POOR: 'Needs improvement',
    },
  };
  return labels[language]?.[level] || labels['es'][level] || level;
}

export function getPerformanceLevelColor(level: string): string {
  const colors: Record<string, string> = {
    EXCELLENT: 'text-emerald-600',
    GOOD: 'text-blue-600',
    AVERAGE: 'text-amber-600',
    BELOW_AVERAGE: 'text-orange-600',
    POOR: 'text-red-600',
  };
  return colors[level] || 'text-gray-600';
}

export function getPerformanceLevelBgColor(level: string): string {
  const colors: Record<string, string> = {
    EXCELLENT: 'bg-emerald-100',
    GOOD: 'bg-blue-100',
    AVERAGE: 'bg-amber-100',
    BELOW_AVERAGE: 'bg-orange-100',
    POOR: 'bg-red-100',
  };
  return colors[level] || 'bg-gray-100';
}

export function calculateTechnicalResult(
  responses: TechnicalResponse[],
  questions: Array<{ id: string; difficulty: string; category?: string | null }>
): TechnicalResult {
  // Create a map for quick question lookup
  const questionMap = new Map(questions.map(q => [q.id, q]));
  
  // Initialize counters
  let correctAnswers = 0;
  let totalTimeTaken = 0;
  let easyCorrect = 0, easyTotal = 0;
  let mediumCorrect = 0, mediumTotal = 0;
  let hardCorrect = 0, hardTotal = 0;
  const categoryCorrect: Record<string, number> = {};
  const categoryTotal: Record<string, number> = {};

  // Process each response
  for (const response of responses) {
    const question = questionMap.get(response.questionId);
    if (!question) continue;

    // Count correct answers
    if (response.isCorrect) {
      correctAnswers++;
    }

    // Track time
    if (response.responseTime) {
      totalTimeTaken += response.responseTime;
    }

    // Track by difficulty
    const difficulty = question.difficulty || 'MEDIUM';
    switch (difficulty) {
      case 'EASY':
        easyTotal++;
        if (response.isCorrect) easyCorrect++;
        break;
      case 'MEDIUM':
        mediumTotal++;
        if (response.isCorrect) mediumCorrect++;
        break;
      case 'HARD':
        hardTotal++;
        if (response.isCorrect) hardCorrect++;
        break;
    }

    // Track by category
    const category = question.category || 'General';
    if (!categoryTotal[category]) {
      categoryTotal[category] = 0;
      categoryCorrect[category] = 0;
    }
    categoryTotal[category]++;
    if (response.isCorrect) {
      categoryCorrect[category]++;
    }
  }

  // Calculate scores
  const totalQuestions = responses.length;
  const totalScore = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const performanceLevel = getPerformanceLevel(totalScore);
  const averageTimePerQuestion = totalQuestions > 0 ? totalTimeTaken / totalQuestions : 0;

  // Calculate category scores
  const categoryScores: Record<string, number> = {};
  for (const category of Object.keys(categoryTotal)) {
    categoryScores[category] = categoryTotal[category] > 0
      ? Math.round((categoryCorrect[category] / categoryTotal[category]) * 100)
      : 0;
  }

  // Determine strengths and weaknesses
  const sortedCategories = Object.entries(categoryScores)
    .sort(([, a], [, b]) => b - a);
  
  const strengths = sortedCategories
    .filter(([, score]) => score >= 70)
    .slice(0, 3)
    .map(([cat]) => cat);
  
  const weaknesses = sortedCategories
    .filter(([, score]) => score < 60)
    .slice(-3)
    .map(([cat]) => cat);

  return {
    totalScore: Math.round(totalScore * 10) / 10,
    correctAnswers,
    totalQuestions,
    performanceLevel,
    categoryScores,
    easyCorrect,
    easyTotal,
    mediumCorrect,
    mediumTotal,
    hardCorrect,
    hardTotal,
    totalTimeTaken,
    averageTimePerQuestion: Math.round(averageTimePerQuestion * 10) / 10,
    strengths,
    weaknesses,
  };
}

// Get difficulty label
export function getDifficultyLabel(difficulty: string, language: string = 'es'): string {
  const labels: Record<string, Record<string, string>> = {
    es: {
      EASY: 'Fácil',
      MEDIUM: 'Medio',
      HARD: 'Difícil',
    },
    en: {
      EASY: 'Easy',
      MEDIUM: 'Medium',
      HARD: 'Hard',
    },
  };
  return labels[language]?.[difficulty] || labels['es'][difficulty] || difficulty;
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    EASY: 'text-green-600 bg-green-100',
    MEDIUM: 'text-amber-600 bg-amber-100',
    HARD: 'text-red-600 bg-red-100',
  };
  return colors[difficulty] || 'text-gray-600 bg-gray-100';
}
