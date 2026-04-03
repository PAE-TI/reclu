// Acumen Capacity Index (ACI) Calculator

export interface AcumenResponse {
  questionNumber: number;
  selectedValue: number; // 1-5 scale
  dimension: string;
  factor: string;
}

export interface AcumenResult {
  // External Factors Clarity (0-10 scale)
  understandingOthersClarity: number;
  practicalThinkingClarity: number;
  systemsJudgmentClarity: number;
  
  // Internal Factors Clarity (0-10 scale)
  senseOfSelfClarity: number;
  roleAwarenessClarity: number;
  selfDirectionClarity: number;
  
  // Bias indicators (-1 undervalue, 0 neutral, 1 overvalue)
  understandingOthersBias: number;
  practicalThinkingBias: number;
  systemsJudgmentBias: number;
  senseOfSelfBias: number;
  roleAwarenessBias: number;
  selfDirectionBias: number;
  
  // Aggregate scores
  externalClarityScore: number;
  internalClarityScore: number;
  totalAcumenScore: number;
  
  // Level and profile
  acumenLevel: string;
  acumenProfile: string;
  
  // Strengths and development
  primaryStrengths: string[];
  developmentAreas: string[];
}

const DIMENSION_LABELS: Record<string, string> = {
  UNDERSTANDING_OTHERS: 'Comprensión de Otros',
  PRACTICAL_THINKING: 'Pensamiento Práctico',
  SYSTEMS_JUDGMENT: 'Juicio de Sistemas',
  SENSE_OF_SELF: 'Sentido de Sí Mismo',
  ROLE_AWARENESS: 'Conciencia del Rol',
  SELF_DIRECTION: 'Auto-dirección',
};

const FACTOR_LABELS: Record<string, string> = {
  EXTERNAL: 'Factores Externos',
  INTERNAL: 'Factores Internos',
};

// Calculate clarity score from raw responses (0-10 scale)
function calculateClarityScore(responses: AcumenResponse[], dimension: string): number {
  const dimensionResponses = responses.filter(r => r.dimension === dimension);
  if (dimensionResponses.length === 0) return 5.0;
  
  const avgValue = dimensionResponses.reduce((sum, r) => sum + r.selectedValue, 0) / dimensionResponses.length;
  // Convert 1-5 scale to 0-10 scale
  return Math.round(((avgValue - 1) / 4) * 10 * 10) / 10;
}

// Calculate bias from responses
function calculateBias(responses: AcumenResponse[], dimension: string): number {
  const dimensionResponses = responses.filter(r => r.dimension === dimension);
  if (dimensionResponses.length === 0) return 0;
  
  const avgValue = dimensionResponses.reduce((sum, r) => sum + r.selectedValue, 0) / dimensionResponses.length;
  
  // Determine bias based on average
  if (avgValue >= 4.0) return 1;  // Overvalue
  if (avgValue <= 2.0) return -1; // Undervalue
  return 0; // Neutral
}

// Get level from score
function getAcumenLevel(score: number): string {
  if (score >= 8.5) return 'MUY_ALTO';
  if (score >= 7.0) return 'ALTO';
  if (score >= 5.0) return 'MODERADO';
  if (score >= 3.5) return 'BAJO';
  return 'MUY_BAJO';
}

function getAcumenLevelLabel(level: string): string {
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
function generateAcumenProfile(result: Partial<AcumenResult>): string {
  const externalScore = result.externalClarityScore || 0;
  const internalScore = result.internalClarityScore || 0;
  
  let profile = '';
  
  if (externalScore >= 7 && internalScore >= 7) {
    profile = 'Perfil equilibrado con alta claridad tanto en la percepción del mundo externo como del interno. Excelente capacidad de juicio en situaciones diversas.';
  } else if (externalScore >= 7) {
    profile = 'Mayor claridad en la percepción del mundo externo. Buena capacidad para evaluar personas, situaciones prácticas y sistemas.';
  } else if (internalScore >= 7) {
    profile = 'Mayor claridad en la percepción interna. Fuerte autoconocimiento y claridad en roles y dirección personal.';
  } else if (externalScore >= 5 || internalScore >= 5) {
    profile = 'Claridad moderada con oportunidades de desarrollo en algunas áreas de percepción y juicio.';
  } else {
    profile = 'Áreas de oportunidad identificadas para desarrollar mayor claridad perceptual y capacidad de juicio.';
  }
  
  return profile;
}

// Identify strengths and development areas
function identifyStrengthsAndDevelopment(result: Partial<AcumenResult>): { strengths: string[], development: string[] } {
  const scores = [
    { dimension: 'UNDERSTANDING_OTHERS', score: result.understandingOthersClarity || 0, label: DIMENSION_LABELS.UNDERSTANDING_OTHERS },
    { dimension: 'PRACTICAL_THINKING', score: result.practicalThinkingClarity || 0, label: DIMENSION_LABELS.PRACTICAL_THINKING },
    { dimension: 'SYSTEMS_JUDGMENT', score: result.systemsJudgmentClarity || 0, label: DIMENSION_LABELS.SYSTEMS_JUDGMENT },
    { dimension: 'SENSE_OF_SELF', score: result.senseOfSelfClarity || 0, label: DIMENSION_LABELS.SENSE_OF_SELF },
    { dimension: 'ROLE_AWARENESS', score: result.roleAwarenessClarity || 0, label: DIMENSION_LABELS.ROLE_AWARENESS },
    { dimension: 'SELF_DIRECTION', score: result.selfDirectionClarity || 0, label: DIMENSION_LABELS.SELF_DIRECTION },
  ];
  
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  
  const strengths = sorted.filter(s => s.score >= 7).slice(0, 3).map(s => s.label);
  const development = sorted.filter(s => s.score < 5).slice(0, 3).map(s => s.label);
  
  return { strengths, development };
}

export function calculateAcumenResults(responses: AcumenResponse[]): AcumenResult {
  // Calculate clarity scores for each dimension
  const understandingOthersClarity = calculateClarityScore(responses, 'UNDERSTANDING_OTHERS');
  const practicalThinkingClarity = calculateClarityScore(responses, 'PRACTICAL_THINKING');
  const systemsJudgmentClarity = calculateClarityScore(responses, 'SYSTEMS_JUDGMENT');
  const senseOfSelfClarity = calculateClarityScore(responses, 'SENSE_OF_SELF');
  const roleAwarenessClarity = calculateClarityScore(responses, 'ROLE_AWARENESS');
  const selfDirectionClarity = calculateClarityScore(responses, 'SELF_DIRECTION');
  
  // Calculate bias for each dimension
  const understandingOthersBias = calculateBias(responses, 'UNDERSTANDING_OTHERS');
  const practicalThinkingBias = calculateBias(responses, 'PRACTICAL_THINKING');
  const systemsJudgmentBias = calculateBias(responses, 'SYSTEMS_JUDGMENT');
  const senseOfSelfBias = calculateBias(responses, 'SENSE_OF_SELF');
  const roleAwarenessBias = calculateBias(responses, 'ROLE_AWARENESS');
  const selfDirectionBias = calculateBias(responses, 'SELF_DIRECTION');
  
  // Calculate aggregate scores
  const externalClarityScore = Math.round(
    ((understandingOthersClarity + practicalThinkingClarity + systemsJudgmentClarity) / 3) * 10
  ) / 10;
  
  const internalClarityScore = Math.round(
    ((senseOfSelfClarity + roleAwarenessClarity + selfDirectionClarity) / 3) * 10
  ) / 10;
  
  const totalAcumenScore = Math.round(
    ((externalClarityScore + internalClarityScore) / 2) * 10
  ) / 10;
  
  // Build partial result for helper functions
  const partialResult = {
    understandingOthersClarity,
    practicalThinkingClarity,
    systemsJudgmentClarity,
    senseOfSelfClarity,
    roleAwarenessClarity,
    selfDirectionClarity,
    externalClarityScore,
    internalClarityScore,
    totalAcumenScore,
  };
  
  const acumenLevel = getAcumenLevel(totalAcumenScore);
  const acumenProfile = generateAcumenProfile(partialResult);
  const { strengths, development } = identifyStrengthsAndDevelopment(partialResult);
  
  return {
    understandingOthersClarity,
    practicalThinkingClarity,
    systemsJudgmentClarity,
    senseOfSelfClarity,
    roleAwarenessClarity,
    selfDirectionClarity,
    understandingOthersBias,
    practicalThinkingBias,
    systemsJudgmentBias,
    senseOfSelfBias,
    roleAwarenessBias,
    selfDirectionBias,
    externalClarityScore,
    internalClarityScore,
    totalAcumenScore,
    acumenLevel,
    acumenProfile,
    primaryStrengths: strengths,
    developmentAreas: development,
  };
}

export { DIMENSION_LABELS, FACTOR_LABELS, getAcumenLevelLabel };
