// Stress & Resilience Calculator

export interface StressResponse {
  questionNumber: number;
  selectedValue: number;
  dimension?: string;
  category?: string;
  isReversed?: boolean;
}

export interface StressResult {
  // 5 Dimension Scores (0-100)
  estresLaboralScore: number;
  capacidadRecuperacionScore: number;
  manejoEmocionalScore: number;
  equilibrioVidaScore: number;
  resilienciaScore: number;
  
  // Overall Indicators
  nivelEstresGeneral: number;
  indiceResiliencia: number;
  capacidadAdaptacion: number;
  
  // Aggregate
  totalStressScore: number;
  
  // Classifications
  stressLevel: string;
  resilienceLevel: string;
  stressProfile: string;
  
  // Factors
  riskFactors: string[];
  protectiveFactors: string[];
  primaryStrengths: string[];
  developmentAreas: string[];
}

// Question mapping to dimensions (30 questions, 6 per dimension)
const DIMENSION_QUESTIONS: Record<string, number[]> = {
  ESTRES_LABORAL: [1, 2, 3, 4, 5, 6],
  CAPACIDAD_RECUPERACION: [7, 8, 9, 10, 11, 12],
  MANEJO_EMOCIONAL: [13, 14, 15, 16, 17, 18],
  EQUILIBRIO_VIDA: [19, 20, 21, 22, 23, 24],
  RESILIENCIA: [25, 26, 27, 28, 29, 30],
};

// Questions that are reversed (higher value = less stress/more resilience)
const REVERSED_QUESTIONS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 25, 26, 27, 28, 29, 30];

export const STRESS_DIMENSION_LABELS: Record<string, string> = {
  estresLaboralScore: 'Estrés Laboral',
  capacidadRecuperacionScore: 'Capacidad de Recuperación',
  manejoEmocionalScore: 'Manejo Emocional',
  equilibrioVidaScore: 'Equilibrio Vida-Trabajo',
  resilienciaScore: 'Resiliencia',
};

export function calculateStressResults(responses: StressResponse[]): StressResult {
  // Calculate raw scores per dimension
  const dimensionScores: Record<string, number[]> = {
    ESTRES_LABORAL: [],
    CAPACIDAD_RECUPERACION: [],
    MANEJO_EMOCIONAL: [],
    EQUILIBRIO_VIDA: [],
    RESILIENCIA: [],
  };
  
  responses.forEach(response => {
    for (const [dimension, questions] of Object.entries(DIMENSION_QUESTIONS)) {
      if (questions.includes(response.questionNumber)) {
        let value = response.selectedValue;
        // For reversed questions, invert the score (1->5, 2->4, etc.)
        if (REVERSED_QUESTIONS.includes(response.questionNumber)) {
          value = 6 - value;
        }
        dimensionScores[dimension].push(value);
        break;
      }
    }
  });
  
  // Calculate percentile scores (0-100) for each dimension
  const calculateDimensionPercentile = (scores: number[]): number => {
    if (scores.length === 0) return 0;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    // Convert 1-5 scale to 0-100 percentile
    return Math.round(((avg - 1) / 4) * 100);
  };
  
  // Stress dimensions: higher score = MORE stress (bad)
  // For stress laboral and equilibrio vida, we want higher raw scores to mean more stress
  const estresLaboralScore = calculateDimensionPercentile(dimensionScores.ESTRES_LABORAL);
  const equilibrioVidaScore = 100 - calculateDimensionPercentile(dimensionScores.EQUILIBRIO_VIDA); // Inverted: low balance = high stress
  
  // Resilience dimensions: higher score = BETTER (good)
  const capacidadRecuperacionScore = calculateDimensionPercentile(dimensionScores.CAPACIDAD_RECUPERACION);
  const manejoEmocionalScore = calculateDimensionPercentile(dimensionScores.MANEJO_EMOCIONAL);
  const resilienciaScore = calculateDimensionPercentile(dimensionScores.RESILIENCIA);
  
  // Calculate overall indicators
  // Stress level: average of stress indicators (lower is better)
  const nivelEstresGeneral = Math.round((estresLaboralScore + (100 - equilibrioVidaScore)) / 2);
  
  // Resilience index: average of resilience indicators (higher is better)
  const indiceResiliencia = Math.round(
    (capacidadRecuperacionScore + manejoEmocionalScore + resilienciaScore) / 3
  );
  
  // Adaptation capacity: balance between stress and resilience
  const capacidadAdaptacion = Math.round(
    (indiceResiliencia * 0.6) + ((100 - nivelEstresGeneral) * 0.4)
  );
  
  // Total stress score (lower is better for stress management)
  const totalStressScore = Math.round(
    (100 - nivelEstresGeneral + indiceResiliencia + capacidadAdaptacion) / 3
  );
  
  // Determine levels
  const stressLevel = getStressLevel(nivelEstresGeneral);
  const resilienceLevel = getResilienceLevel(indiceResiliencia);
  
  // Generate profile
  const stressProfile = generateStressProfile(stressLevel, resilienceLevel);
  
  // Identify risk and protective factors
  const { riskFactors, protectiveFactors } = identifyFactors({
    estresLaboralScore,
    capacidadRecuperacionScore,
    manejoEmocionalScore,
    equilibrioVidaScore,
    resilienciaScore,
  });
  
  // Identify strengths and development areas
  const { primaryStrengths, developmentAreas } = identifyStrengthsAndAreas({
    estresLaboralScore,
    capacidadRecuperacionScore,
    manejoEmocionalScore,
    equilibrioVidaScore,
    resilienciaScore,
  });
  
  return {
    estresLaboralScore,
    capacidadRecuperacionScore,
    manejoEmocionalScore,
    equilibrioVidaScore,
    resilienciaScore,
    nivelEstresGeneral,
    indiceResiliencia,
    capacidadAdaptacion,
    totalStressScore,
    stressLevel,
    resilienceLevel,
    stressProfile,
    riskFactors,
    protectiveFactors,
    primaryStrengths,
    developmentAreas,
  };
}

export function getStressLevel(score: number): string {
  if (score >= 80) return 'Muy Alto';
  if (score >= 60) return 'Alto';
  if (score >= 40) return 'Moderado';
  if (score >= 20) return 'Bajo';
  return 'Muy Bajo';
}

export function getResilienceLevel(score: number): string {
  if (score >= 80) return 'Muy Alta';
  if (score >= 60) return 'Alta';
  if (score >= 40) return 'Moderada';
  if (score >= 20) return 'Baja';
  return 'Muy Baja';
}

function generateStressProfile(stressLevel: string, resilienceLevel: string): string {
  if (stressLevel === 'Muy Bajo' && (resilienceLevel === 'Muy Alta' || resilienceLevel === 'Alta')) {
    return 'Equilibrado y Resiliente';
  }
  if (stressLevel === 'Bajo' && resilienceLevel === 'Alta') {
    return 'Adaptativo Estable';
  }
  if (stressLevel === 'Moderado' && resilienceLevel === 'Moderada') {
    return 'En Desarrollo';
  }
  if ((stressLevel === 'Alto' || stressLevel === 'Muy Alto') && (resilienceLevel === 'Alta' || resilienceLevel === 'Muy Alta')) {
    return 'Resiliente bajo Presión';
  }
  if ((stressLevel === 'Alto' || stressLevel === 'Muy Alto') && (resilienceLevel === 'Baja' || resilienceLevel === 'Muy Baja')) {
    return 'Necesita Apoyo';
  }
  if (stressLevel === 'Moderado' && (resilienceLevel === 'Alta' || resilienceLevel === 'Muy Alta')) {
    return 'Bien Equipado';
  }
  return 'Perfil Mixto';
}

function identifyFactors(scores: Record<string, number>): { riskFactors: string[]; protectiveFactors: string[] } {
  const riskFactors: string[] = [];
  const protectiveFactors: string[] = [];
  
  // Risk factors (high stress, low resilience indicators)
  if (scores.estresLaboralScore >= 60) {
    riskFactors.push('Alto nivel de estrés laboral');
  }
  if (scores.equilibrioVidaScore <= 40) {
    riskFactors.push('Desequilibrio vida-trabajo');
  }
  if (scores.capacidadRecuperacionScore <= 40) {
    riskFactors.push('Dificultad para recuperarse del estrés');
  }
  if (scores.manejoEmocionalScore <= 40) {
    riskFactors.push('Gestión emocional limitada');
  }
  if (scores.resilienciaScore <= 40) {
    riskFactors.push('Resiliencia reducida');
  }
  
  // Protective factors (low stress, high resilience indicators)
  if (scores.estresLaboralScore <= 40) {
    protectiveFactors.push('Manejo efectivo del estrés laboral');
  }
  if (scores.equilibrioVidaScore >= 60) {
    protectiveFactors.push('Buen equilibrio vida-trabajo');
  }
  if (scores.capacidadRecuperacionScore >= 60) {
    protectiveFactors.push('Alta capacidad de recuperación');
  }
  if (scores.manejoEmocionalScore >= 60) {
    protectiveFactors.push('Buena gestión emocional');
  }
  if (scores.resilienciaScore >= 60) {
    protectiveFactors.push('Alta resiliencia general');
  }
  
  return { riskFactors, protectiveFactors };
}

function identifyStrengthsAndAreas(scores: Record<string, number>): { primaryStrengths: string[]; developmentAreas: string[] } {
  const dimensionLabels: Record<string, string> = {
    estresLaboralScore: 'Gestión del Estrés Laboral',
    capacidadRecuperacionScore: 'Capacidad de Recuperación',
    manejoEmocionalScore: 'Manejo Emocional',
    equilibrioVidaScore: 'Equilibrio Vida-Trabajo',
    resilienciaScore: 'Resiliencia General',
  };
  
  // For strengths: high resilience scores, low stress scores
  const strengthScores = [
    { key: 'estresLaboralScore', score: 100 - scores.estresLaboralScore }, // Inverted: low stress = strength
    { key: 'capacidadRecuperacionScore', score: scores.capacidadRecuperacionScore },
    { key: 'manejoEmocionalScore', score: scores.manejoEmocionalScore },
    { key: 'equilibrioVidaScore', score: scores.equilibrioVidaScore },
    { key: 'resilienciaScore', score: scores.resilienciaScore },
  ];
  
  // Sort by score descending for strengths
  const sortedForStrengths = [...strengthScores].sort((a, b) => b.score - a.score);
  const primaryStrengths = sortedForStrengths
    .slice(0, 3)
    .filter(s => s.score >= 50)
    .map(s => dimensionLabels[s.key]);
  
  // Sort by score ascending for development areas
  const sortedForAreas = [...strengthScores].sort((a, b) => a.score - b.score);
  const developmentAreas = sortedForAreas
    .slice(0, 2)
    .filter(s => s.score < 60)
    .map(s => dimensionLabels[s.key]);
  
  return { primaryStrengths, developmentAreas };
}

export function getStressLevelColor(level: string): string {
  switch (level) {
    case 'Muy Bajo': return 'text-green-600 bg-green-100';
    case 'Bajo': return 'text-emerald-600 bg-emerald-100';
    case 'Moderado': return 'text-yellow-600 bg-yellow-100';
    case 'Alto': return 'text-orange-600 bg-orange-100';
    case 'Muy Alto': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

export function getResilienceLevelColor(level: string): string {
  switch (level) {
    case 'Muy Alta': return 'text-green-600 bg-green-100';
    case 'Alta': return 'text-emerald-600 bg-emerald-100';
    case 'Moderada': return 'text-yellow-600 bg-yellow-100';
    case 'Baja': return 'text-orange-600 bg-orange-100';
    case 'Muy Baja': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}
