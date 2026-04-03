// Values & Integrity Calculator
// Based on Spranger/Allport Values Model

export interface ValuesResponse {
  questionNumber: number;
  selectedValue: number; // 1-5 scale
  dimension: string;
  category: string;
}

export interface ValuesResult {
  // 6 Values Dimensions Scores (0-100 percentile)
  teoricoScore: number;         // Theoretical - Knowledge seeking
  utilitarioScore: number;      // Utilitarian - ROI focused
  esteticoScore: number;        // Aesthetic - Form and harmony
  socialScore: number;          // Social - Helping others
  individualistaScore: number;  // Individualistic - Power/control
  tradicionalScore: number;     // Traditional - Order/system
  
  // Integrity Indicators
  integrityScore: number;       // Overall integrity index (0-100)
  consistencyScore: number;     // Response consistency (0-100)
  authenticityScore: number;    // Authenticity indicator (0-100)
  
  // Aggregate scores
  totalValuesScore: number;
  
  // Level and profile
  valuesLevel: string;
  valuesProfile: string;
  
  // Value categorization
  primaryValues: string[];      // Top 2 values
  situationalValues: string[];  // Middle values
  indifferentValues: string[];  // Lower priority values
  
  // Strengths and development
  primaryStrengths: string[];
  developmentAreas: string[];
}

export const DIMENSION_LABELS: Record<string, string> = {
  TEORICO: 'Teórico',
  UTILITARIO: 'Utilitario',
  ESTETICO: 'Estético',
  SOCIAL: 'Social',
  INDIVIDUALISTA: 'Individualista',
  TRADICIONAL: 'Tradicional',
};

export const DIMENSION_DESCRIPTIONS: Record<string, string> = {
  TEORICO: 'Pasión por el conocimiento y la búsqueda de la verdad',
  UTILITARIO: 'Enfoque en el retorno de inversión y resultados prácticos',
  ESTETICO: 'Apreciación por la forma, armonía y experiencias creativas',
  SOCIAL: 'Motivación por ayudar y contribuir al bienestar de otros',
  INDIVIDUALISTA: 'Búsqueda de poder, reconocimiento e influencia',
  TRADICIONAL: 'Valoración del orden, sistemas y tradiciones',
};

export const DIMENSION_ICONS: Record<string, string> = {
  TEORICO: '📚',
  UTILITARIO: '💰',
  ESTETICO: '🎨',
  SOCIAL: '🤝',
  INDIVIDUALISTA: '👑',
  TRADICIONAL: '⚖️',
};

// Calculate dimension score from raw responses (0-100 scale)
function calculateDimensionScore(responses: ValuesResponse[], dimension: string): number {
  const dimensionResponses = responses.filter(r => r.dimension === dimension);
  if (dimensionResponses.length === 0) return 50.0;
  
  const avgValue = dimensionResponses.reduce((sum, r) => sum + r.selectedValue, 0) / dimensionResponses.length;
  // Convert 1-5 scale to 0-100 scale
  return Math.round(((avgValue - 1) / 4) * 100 * 10) / 10;
}

// Calculate consistency from response patterns
function calculateConsistency(responses: ValuesResponse[]): number {
  if (responses.length < 2) return 100;
  
  // Group by dimension and check variance
  const dimensionGroups: Record<string, number[]> = {};
  responses.forEach(r => {
    if (!dimensionGroups[r.dimension]) dimensionGroups[r.dimension] = [];
    dimensionGroups[r.dimension].push(r.selectedValue);
  });
  
  let totalVariance = 0;
  let groupCount = 0;
  
  Object.values(dimensionGroups).forEach(values => {
    if (values.length > 1) {
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
      totalVariance += variance;
      groupCount++;
    }
  });
  
  if (groupCount === 0) return 100;
  
  const avgVariance = totalVariance / groupCount;
  // Lower variance = higher consistency (max variance is 4 for 1-5 scale)
  return Math.round((1 - (avgVariance / 4)) * 100);
}

// Calculate authenticity based on response patterns
function calculateAuthenticity(responses: ValuesResponse[]): number {
  if (responses.length === 0) return 50;
  
  // Check for extreme responses (shows conviction)
  const extremeCount = responses.filter(r => r.selectedValue === 1 || r.selectedValue === 5).length;
  const extremeRatio = extremeCount / responses.length;
  
  // Check for middle responses (can indicate uncertainty)
  const middleCount = responses.filter(r => r.selectedValue === 3).length;
  const middleRatio = middleCount / responses.length;
  
  // Higher extreme ratio with lower middle ratio = higher authenticity
  const authenticityBase = (extremeRatio * 0.6 + (1 - middleRatio) * 0.4) * 100;
  return Math.round(Math.min(100, Math.max(0, authenticityBase)) * 10) / 10;
}

// Get level from score
function getValuesLevel(score: number): string {
  if (score >= 85) return 'MUY_ALTO';
  if (score >= 70) return 'ALTO';
  if (score >= 50) return 'MODERADO';
  if (score >= 35) return 'BAJO';
  return 'MUY_BAJO';
}

export function getValuesLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    MUY_ALTO: 'Muy Alto',
    ALTO: 'Alto',
    MODERADO: 'Moderado',
    BAJO: 'Bajo',
    MUY_BAJO: 'Muy Bajo',
  };
  return labels[level] || level;
}

// Generate profile description
function generateValuesProfile(result: Partial<ValuesResult>): string {
  const primaryValues = result.primaryValues || [];
  const integrityScore = result.integrityScore || 0;
  
  let profile = '';
  
  if (primaryValues.length >= 2) {
    const v1 = DIMENSION_LABELS[primaryValues[0]] || primaryValues[0];
    const v2 = DIMENSION_LABELS[primaryValues[1]] || primaryValues[1];
    
    profile = `Perfil caracterizado por valores ${v1} y ${v2} como principales motivadores. `;
    
    if (integrityScore >= 80) {
      profile += 'Muestra alta consistencia y autenticidad en sus respuestas, indicando un sistema de valores bien definido.';
    } else if (integrityScore >= 60) {
      profile += 'Presenta un sistema de valores equilibrado con buena consistencia general.';
    } else {
      profile += 'El perfil sugiere oportunidades para mayor claridad en la definición de prioridades de valores.';
    }
  } else {
    profile = 'Perfil de valores en desarrollo. Se recomienda reflexionar sobre las prioridades personales y profesionales.';
  }
  
  return profile;
}

// Categorize values into primary, situational, and indifferent
function categorizeValues(result: Partial<ValuesResult>): { primary: string[], situational: string[], indifferent: string[] } {
  const scores = [
    { dimension: 'TEORICO', score: result.teoricoScore || 0 },
    { dimension: 'UTILITARIO', score: result.utilitarioScore || 0 },
    { dimension: 'ESTETICO', score: result.esteticoScore || 0 },
    { dimension: 'SOCIAL', score: result.socialScore || 0 },
    { dimension: 'INDIVIDUALISTA', score: result.individualistaScore || 0 },
    { dimension: 'TRADICIONAL', score: result.tradicionalScore || 0 },
  ];
  
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  
  return {
    primary: sorted.slice(0, 2).map(s => s.dimension),
    situational: sorted.slice(2, 4).map(s => s.dimension),
    indifferent: sorted.slice(4).map(s => s.dimension),
  };
}

// Identify strengths and development areas
function identifyStrengthsAndDevelopment(result: Partial<ValuesResult>): { strengths: string[], development: string[] } {
  const categories = categorizeValues(result);
  const integrityScore = result.integrityScore || 0;
  
  const strengths: string[] = [];
  const development: string[] = [];
  
  // Primary values are strengths
  categories.primary.forEach(v => {
    strengths.push(`${DIMENSION_ICONS[v]} ${DIMENSION_LABELS[v]}: ${DIMENSION_DESCRIPTIONS[v]}`);
  });
  
  // Add integrity as strength if high
  if (integrityScore >= 75) {
    strengths.push('✅ Alta integridad y consistencia en valores');
  }
  
  // Indifferent values may need attention
  if (categories.indifferent.length > 0) {
    const lowestValue = categories.indifferent[categories.indifferent.length - 1];
    development.push(`Considerar el desarrollo del valor ${DIMENSION_LABELS[lowestValue]}`);
  }
  
  // Low integrity is an area for development
  if (integrityScore < 60) {
    development.push('Trabajar en la clarificación y consistencia del sistema de valores');
  }
  
  return { strengths: strengths.slice(0, 3), development: development.slice(0, 3) };
}

export function calculateValuesResults(responses: ValuesResponse[]): ValuesResult {
  // Calculate scores for each dimension
  const teoricoScore = calculateDimensionScore(responses, 'TEORICO');
  const utilitarioScore = calculateDimensionScore(responses, 'UTILITARIO');
  const esteticoScore = calculateDimensionScore(responses, 'ESTETICO');
  const socialScore = calculateDimensionScore(responses, 'SOCIAL');
  const individualistaScore = calculateDimensionScore(responses, 'INDIVIDUALISTA');
  const tradicionalScore = calculateDimensionScore(responses, 'TRADICIONAL');
  
  // Calculate integrity indicators
  const consistencyScore = calculateConsistency(responses);
  const authenticityScore = calculateAuthenticity(responses);
  const integrityScore = Math.round((consistencyScore * 0.6 + authenticityScore * 0.4) * 10) / 10;
  
  // Calculate total score (average of all dimensions weighted by integrity)
  const avgDimensionScore = (teoricoScore + utilitarioScore + esteticoScore + 
                            socialScore + individualistaScore + tradicionalScore) / 6;
  const totalValuesScore = Math.round((avgDimensionScore * 0.7 + integrityScore * 0.3) * 10) / 10;
  
  // Build partial result for helper functions
  const partialResult = {
    teoricoScore,
    utilitarioScore,
    esteticoScore,
    socialScore,
    individualistaScore,
    tradicionalScore,
    integrityScore,
    consistencyScore,
    authenticityScore,
    totalValuesScore,
  };
  
  const valuesLevel = getValuesLevel(totalValuesScore);
  const { primary, situational, indifferent } = categorizeValues(partialResult);
  
  const partialWithCategories = {
    ...partialResult,
    primaryValues: primary,
    situationalValues: situational,
    indifferentValues: indifferent,
  };
  
  const valuesProfile = generateValuesProfile(partialWithCategories);
  const { strengths, development } = identifyStrengthsAndDevelopment(partialWithCategories);
  
  return {
    teoricoScore,
    utilitarioScore,
    esteticoScore,
    socialScore,
    individualistaScore,
    tradicionalScore,
    integrityScore,
    consistencyScore,
    authenticityScore,
    totalValuesScore,
    valuesLevel,
    valuesProfile,
    primaryValues: primary,
    situationalValues: situational,
    indifferentValues: indifferent,
    primaryStrengths: strengths,
    developmentAreas: development,
  };
}
