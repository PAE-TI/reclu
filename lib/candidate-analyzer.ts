// Algoritmo de análisis y ranking de candidatos para Campañas de Selección
// Basado en datos y algoritmos, sin IA

import { getJobPositionById, JobPosition } from './job-positions';

export type Language = 'es' | 'en';

// Translations for analyzer texts
const analyzerTranslations: Record<Language, Record<string, string>> = {
  es: {
    // DISC
    'disc.noData': 'No hay datos DISC disponibles',
    'disc.excellentDominance': 'Excelente nivel de Dominancia para el cargo',
    'disc.lowDominance': 'El nivel de Dominancia está por debajo del ideal para este cargo',
    'disc.excellentInfluence': 'Excelente capacidad de Influencia y comunicación',
    'disc.developInfluence': 'Podría necesitar desarrollar habilidades de Influencia',
    'disc.highStability': 'Alta Estabilidad, ideal para entornos que requieren consistencia',
    'disc.excellentCompliance': 'Excelente atención al detalle y Cumplimiento',
    'disc.needsDetail': 'El cargo requiere mayor orientación al detalle',
    // Driving Forces
    'df.noData': 'No hay datos de Fuerzas Motivadoras',
    'df.highMotivation': 'Alta motivación en {area}',
    'df.leadership': 'Liderazgo y control',
    'df.knowledge': 'Aprendizaje y conocimiento',
    'df.efficiency': 'Eficiencia y resultados',
    'df.altruism': 'Ayuda desinteresada',
    'df.harmony': 'Equilibrio y estética',
    'df.structure': 'Orden y tradición',
    'df.openness': 'Apertura a nuevas ideas',
    // EQ
    'eq.noData': 'No hay datos de EQ',
    'eq.exceptional': 'Inteligencia Emocional excepcional',
    'eq.high': 'Alta Inteligencia Emocional',
    'eq.excellentEmpathy': 'Excelente capacidad de empatía',
    'eq.strongSelfRegulation': 'Fuerte autorregulación emocional',
    'eq.outstandingSocialSkills': 'Habilidades sociales destacadas',
    // DNA
    'dna.noData': 'No hay datos de DNA-25',
    'dna.strengthsIn': 'Fortalezas en: {categories}',
    'dna.strengthIn': 'Fortaleza en: {categories}',
    'dna.keyCompetencies': 'Competencias clave alineadas con el cargo',
    'dna.thinking': 'Pensamiento',
    'dna.communication': 'Comunicación',
    'dna.leadership': 'Liderazgo',
    'dna.results': 'Resultados',
    'dna.relationship': 'Relacionamiento',
    // Acumen
    'acumen.noData': 'No hay datos de Acumen',
    'acumen.excellentExternal': 'Excelente claridad en la evaluación del mundo externo',
    'acumen.strongInternal': 'Fuerte autoconocimiento y claridad interna',
    'acumen.exceptionalJudgment': 'Capacidad de juicio excepcional',
    // Values
    'values.noData': 'No hay datos de Valores',
    'values.primary': 'Valores primarios: {values}',
    'values.teorico': 'Teórico (Conocimiento)',
    'values.utilitario': 'Utilitario (ROI)',
    'values.estetico': 'Estético (Armonía)',
    'values.social': 'Social (Ayuda)',
    'values.individualista': 'Individualista (Poder)',
    'values.tradicional': 'Tradicional (Orden)',
    // Stress
    'stress.noData': 'No hay datos de Estrés',
    'stress.exceptionalResilience': 'Resiliencia excepcional',
    'stress.highResilience': 'Alta capacidad de resiliencia',
    'stress.excellentManagement': 'Excelente manejo del estrés',
    'stress.highStress': '⚠️ Nivel de estrés elevado',
    // Recommendations
    'rec.highlyRecommended': 'Candidato altamente recomendado para el cargo',
    'rec.proceedFinal': 'Proceder con entrevista final y verificación de referencias',
    'rec.goodPotential': 'Candidato con buen potencial',
    'rec.considerDevelopment': 'Considerar para el cargo con plan de desarrollo en áreas identificadas',
    'rec.moderatePotential': 'Candidato con potencial moderado',
    'rec.evaluateCritical': 'Evaluar si las áreas de mejora son críticas para el cargo',
    'rec.significantGaps': 'Perfil con brechas significativas respecto al cargo',
    'rec.considerOther': 'Considerar para otros roles más alineados con su perfil',
    // Categories
    'cat.behavior': 'Comportamiento (DISC)',
    'cat.behaviorDesc': 'Estilo de comportamiento y comunicación',
    'cat.motivations': 'Motivaciones',
    'cat.motivationsDesc': 'Fuerzas que impulsan sus decisiones',
    'cat.emotionalIntelligence': 'Inteligencia Emocional',
    'cat.emotionalIntelligenceDesc': 'Capacidad de gestionar emociones',
    'cat.competencies': 'Competencias (DNA-25)',
    'cat.competenciesDesc': 'Habilidades y competencias profesionales',
    'cat.judgment': 'Capacidad de Juicio',
    'cat.judgmentDesc': 'Claridad en la toma de decisiones',
    'cat.values': 'Valores',
    'cat.valuesDesc': 'Motivadores personales y profesionales',
    'cat.resilience': 'Resiliencia',
    'cat.resilienceDesc': 'Capacidad de manejar el estrés',
    // Summary
    'summary.excellent': 'Excelente grupo de candidatos para {job}. Hay {count} candidatos altamente calificados.',
    'summary.oneExcellent': 'Se identificó un candidato excepcional para {job}: {name}.',
    'summary.goodPotential': 'Hay {count} candidatos con buen potencial para {job}. Considerar desarrollo adicional.',
    'summary.noEvaluations': 'Aún no hay evaluaciones completadas para analizar.',
    'summary.gaps': 'Los candidatos actuales presentan brechas respecto al perfil de {job}. Considerar ampliar la búsqueda.',
  },
  en: {
    // DISC
    'disc.noData': 'No DISC data available',
    'disc.excellentDominance': 'Excellent Dominance level for this role',
    'disc.lowDominance': 'Dominance level is below ideal for this role',
    'disc.excellentInfluence': 'Excellent Influence and communication skills',
    'disc.developInfluence': 'May need to develop Influence skills',
    'disc.highStability': 'High Stability, ideal for environments requiring consistency',
    'disc.excellentCompliance': 'Excellent attention to detail and Compliance',
    'disc.needsDetail': 'Role requires greater detail orientation',
    // Driving Forces
    'df.noData': 'No Driving Forces data available',
    'df.highMotivation': 'High motivation in {area}',
    'df.leadership': 'Leadership and control',
    'df.knowledge': 'Learning and knowledge',
    'df.efficiency': 'Efficiency and results',
    'df.altruism': 'Selfless helping',
    'df.harmony': 'Balance and aesthetics',
    'df.structure': 'Order and tradition',
    'df.openness': 'Openness to new ideas',
    // EQ
    'eq.noData': 'No EQ data available',
    'eq.exceptional': 'Exceptional Emotional Intelligence',
    'eq.high': 'High Emotional Intelligence',
    'eq.excellentEmpathy': 'Excellent empathy capacity',
    'eq.strongSelfRegulation': 'Strong emotional self-regulation',
    'eq.outstandingSocialSkills': 'Outstanding social skills',
    // DNA
    'dna.noData': 'No DNA-25 data available',
    'dna.strengthsIn': 'Strengths in: {categories}',
    'dna.strengthIn': 'Strength in: {categories}',
    'dna.keyCompetencies': 'Key competencies aligned with the role',
    'dna.thinking': 'Thinking',
    'dna.communication': 'Communication',
    'dna.leadership': 'Leadership',
    'dna.results': 'Results',
    'dna.relationship': 'Relationship',
    // Acumen
    'acumen.noData': 'No Acumen data available',
    'acumen.excellentExternal': 'Excellent clarity in external world assessment',
    'acumen.strongInternal': 'Strong self-awareness and internal clarity',
    'acumen.exceptionalJudgment': 'Exceptional judgment capacity',
    // Values
    'values.noData': 'No Values data available',
    'values.primary': 'Primary values: {values}',
    'values.teorico': 'Theoretical (Knowledge)',
    'values.utilitario': 'Utilitarian (ROI)',
    'values.estetico': 'Aesthetic (Harmony)',
    'values.social': 'Social (Helping)',
    'values.individualista': 'Individualistic (Power)',
    'values.tradicional': 'Traditional (Order)',
    // Stress
    'stress.noData': 'No Stress data available',
    'stress.exceptionalResilience': 'Exceptional resilience',
    'stress.highResilience': 'High resilience capacity',
    'stress.excellentManagement': 'Excellent stress management',
    'stress.highStress': '⚠️ High stress level',
    // Recommendations
    'rec.highlyRecommended': 'Highly recommended candidate for this role',
    'rec.proceedFinal': 'Proceed with final interview and reference verification',
    'rec.goodPotential': 'Candidate with good potential',
    'rec.considerDevelopment': 'Consider for role with development plan for identified areas',
    'rec.moderatePotential': 'Candidate with moderate potential',
    'rec.evaluateCritical': 'Evaluate if improvement areas are critical for the role',
    'rec.significantGaps': 'Profile with significant gaps for the role',
    'rec.considerOther': 'Consider for other roles better aligned with their profile',
    // Categories
    'cat.behavior': 'Behavior (DISC)',
    'cat.behaviorDesc': 'Behavioral and communication style',
    'cat.motivations': 'Motivations',
    'cat.motivationsDesc': 'Forces driving their decisions',
    'cat.emotionalIntelligence': 'Emotional Intelligence',
    'cat.emotionalIntelligenceDesc': 'Ability to manage emotions',
    'cat.competencies': 'Competencies (DNA-25)',
    'cat.competenciesDesc': 'Professional skills and competencies',
    'cat.judgment': 'Judgment Capacity',
    'cat.judgmentDesc': 'Clarity in decision making',
    'cat.values': 'Values',
    'cat.valuesDesc': 'Personal and professional motivators',
    'cat.resilience': 'Resilience',
    'cat.resilienceDesc': 'Ability to manage stress',
    // Summary
    'summary.excellent': 'Excellent group of candidates for {job}. There are {count} highly qualified candidates.',
    'summary.oneExcellent': 'One exceptional candidate identified for {job}: {name}.',
    'summary.goodPotential': 'There are {count} candidates with good potential for {job}. Consider additional development.',
    'summary.noEvaluations': 'No completed evaluations to analyze yet.',
    'summary.gaps': 'Current candidates show gaps compared to the {job} profile. Consider expanding the search.',
  },
};

function t(key: string, lang: Language, replacements?: Record<string, string | number>): string {
  let text = analyzerTranslations[lang][key] || analyzerTranslations['es'][key] || key;
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export interface CandidateEvaluationData {
  disc?: {
    primaryStyle: string;
    percentileD: number;
    percentileI: number;
    percentileS: number;
    percentileC: number;
  };
  drivingForces?: {
    intelectualPercentile: number;
    instintivoPercentile: number;
    practicoPercentile: number;
    altruistaPercentile: number;
    armoniosoPercentile: number;
    objetivoPercentile: number;
    benevoloPercentile: number;
    intencionalPercentile: number;
    dominantePercentile: number;
    colaborativoPercentile: number;
    estructuradoPercentile: number;
    receptivoPercentile: number;
    topMotivator: string;
  };
  eq?: {
    selfAwarenessPercentile: number;
    selfRegulationPercentile: number;
    motivationPercentile: number;
    empathyPercentile: number;
    socialSkillsPercentile: number;
    totalEQPercentile: number;
    eqLevel: string;
  };
  dna?: {
    thinkingCategoryScore: number;
    communicationCategoryScore: number;
    leadershipCategoryScore: number;
    resultsCategoryScore: number;
    relationshipCategoryScore: number;
    totalDNAPercentile: number;
    dnaLevel: string;
    primaryStrengths: string[];
  };
  acumen?: {
    externalClarityScore: number;
    internalClarityScore: number;
    totalAcumenScore: number;
    acumenLevel: string;
  };
  values?: {
    teoricoScore: number;
    utilitarioScore: number;
    esteticoScore: number;
    socialScore: number;
    individualistaScore: number;
    tradicionalScore: number;
    primaryValues: string[];
  };
  stress?: {
    nivelEstresGeneral: number;
    indiceResiliencia: number;
    stressLevel: string;
    resilienceLevel: string;
  };
}

export interface CandidateAnalysisResult {
  overallScore: number; // 0-100
  fitPercentage: number; // Porcentaje de ajuste al perfil ideal
  rankPosition: number;
  dimensionScores: {
    disc: number;
    drivingForces: number;
    eq: number;
    dna: number;
    acumen: number;
    values: number;
    stress: number;
  };
  strengths: string[];
  areasOfConcern: string[];
  recommendations: string[];
  compatibilityDetails: {
    category: string;
    description: string;
    score: number;
    status: 'excellent' | 'good' | 'moderate' | 'low';
  }[];
}

// Pesos por defecto para cada dimensión de evaluación
const DEFAULT_WEIGHTS = {
  disc: 0.20,
  drivingForces: 0.15,
  eq: 0.20,
  dna: 0.20,
  acumen: 0.10,
  values: 0.10,
  stress: 0.05,
};

/**
 * Calcula la puntuación de ajuste DISC
 */
function calculateDISCFit(
  candidateDisc: CandidateEvaluationData['disc'],
  idealDisc: { D: number; I: number; S: number; C: number },
  lang: Language
): { score: number; details: string[] } {
  if (!candidateDisc) return { score: 0, details: [t('disc.noData', lang)] };
  
  const dDiff = Math.abs(candidateDisc.percentileD - idealDisc.D);
  const iDiff = Math.abs(candidateDisc.percentileI - idealDisc.I);
  const sDiff = Math.abs(candidateDisc.percentileS - idealDisc.S);
  const cDiff = Math.abs(candidateDisc.percentileC - idealDisc.C);
  
  // Score is inversely proportional to difference (max diff = 100, so max total diff = 400)
  const avgDiff = (dDiff + iDiff + sDiff + cDiff) / 4;
  const score = Math.max(0, 100 - avgDiff);
  
  const details: string[] = [];
  
  // Identificar fortalezas y brechas
  if (dDiff <= 15 && candidateDisc.percentileD >= 60) {
    details.push(t('disc.excellentDominance', lang));
  } else if (dDiff > 30 && idealDisc.D > 60) {
    details.push(t('disc.lowDominance', lang));
  }
  
  if (iDiff <= 15 && candidateDisc.percentileI >= 60) {
    details.push(t('disc.excellentInfluence', lang));
  } else if (iDiff > 30 && idealDisc.I > 60) {
    details.push(t('disc.developInfluence', lang));
  }
  
  if (sDiff <= 15 && candidateDisc.percentileS >= 60) {
    details.push(t('disc.highStability', lang));
  }
  
  if (cDiff <= 15 && candidateDisc.percentileC >= 60) {
    details.push(t('disc.excellentCompliance', lang));
  } else if (cDiff > 30 && idealDisc.C > 60) {
    details.push(t('disc.needsDetail', lang));
  }
  
  return { score, details };
}

/**
 * Calcula la puntuación de ajuste de Fuerzas Motivadoras
 */
function calculateDrivingForcesFit(
  candidateDF: CandidateEvaluationData['drivingForces'],
  idealDF: { [key: string]: number },
  lang: Language
): { score: number; details: string[] } {
  if (!candidateDF) return { score: 0, details: [t('df.noData', lang)] };
  
  const dfMapping: Record<string, keyof typeof candidateDF> = {
    dominante: 'dominantePercentile',
    intelectual: 'intelectualPercentile',
    practico: 'practicoPercentile',
    altruista: 'altruistaPercentile',
    armonioso: 'armoniosoPercentile',
    estructurado: 'estructuradoPercentile',
    receptivo: 'receptivoPercentile',
    colaborativo: 'colaborativoPercentile',
    benevolo: 'benevoloPercentile',
    intencional: 'intencionalPercentile',
  };
  
  const labelKeys: Record<string, string> = {
    dominante: 'df.leadership',
    intelectual: 'df.knowledge',
    practico: 'df.efficiency',
    altruista: 'df.altruism',
    armonioso: 'df.harmony',
    estructurado: 'df.structure',
    receptivo: 'df.openness',
  };
  
  let totalDiff = 0;
  let count = 0;
  const details: string[] = [];
  
  for (const [key, idealValue] of Object.entries(idealDF)) {
    const candidateKey = dfMapping[key];
    if (candidateKey && typeof candidateDF[candidateKey] === 'number') {
      const candidateValue = candidateDF[candidateKey] as number;
      const diff = Math.abs(candidateValue - idealValue);
      totalDiff += diff;
      count++;
      
      if (idealValue >= 70 && candidateValue >= idealValue - 15) {
        if (labelKeys[key]) {
          details.push(t('df.highMotivation', lang, { area: t(labelKeys[key], lang) }));
        }
      }
    }
  }
  
  const avgDiff = count > 0 ? totalDiff / count : 50;
  const score = Math.max(0, 100 - avgDiff);
  
  return { score, details };
}

/**
 * Calcula la puntuación de EQ
 */
function calculateEQFit(
  candidateEQ: CandidateEvaluationData['eq'],
  idealEQFocus: string[],
  lang: Language
): { score: number; details: string[] } {
  if (!candidateEQ) return { score: 0, details: [t('eq.noData', lang)] };
  
  // Usar el percentil total de EQ como base
  let score = candidateEQ.totalEQPercentile;
  const details: string[] = [];
  
  // Bonus por nivel de EQ
  if (candidateEQ.eqLevel === 'Muy Alto' || candidateEQ.eqLevel === 'Very High') {
    score = Math.min(100, score + 10);
    details.push(t('eq.exceptional', lang));
  } else if (candidateEQ.eqLevel === 'Alto' || candidateEQ.eqLevel === 'High') {
    score = Math.min(100, score + 5);
    details.push(t('eq.high', lang));
  }
  
  // Evaluar dimensiones específicas
  if (candidateEQ.empathyPercentile >= 70) {
    details.push(t('eq.excellentEmpathy', lang));
  }
  if (candidateEQ.selfRegulationPercentile >= 70) {
    details.push(t('eq.strongSelfRegulation', lang));
  }
  if (candidateEQ.socialSkillsPercentile >= 70) {
    details.push(t('eq.outstandingSocialSkills', lang));
  }
  
  return { score, details };
}

/**
 * Calcula la puntuación de DNA-25
 */
function calculateDNAFit(
  candidateDNA: CandidateEvaluationData['dna'],
  idealCompetencies: string[],
  lang: Language
): { score: number; details: string[] } {
  if (!candidateDNA) return { score: 0, details: [t('dna.noData', lang)] };
  
  let score = candidateDNA.totalDNAPercentile;
  const details: string[] = [];
  
  // Evaluar categorías principales
  const categories = [
    { nameKey: 'dna.thinking', score: candidateDNA.thinkingCategoryScore },
    { nameKey: 'dna.communication', score: candidateDNA.communicationCategoryScore },
    { nameKey: 'dna.leadership', score: candidateDNA.leadershipCategoryScore },
    { nameKey: 'dna.results', score: candidateDNA.resultsCategoryScore },
    { nameKey: 'dna.relationship', score: candidateDNA.relationshipCategoryScore },
  ];
  
  const strongCategories = categories.filter(c => c.score >= 70);
  if (strongCategories.length >= 3) {
    score = Math.min(100, score + 10);
    details.push(t('dna.strengthsIn', lang, { categories: strongCategories.map(c => t(c.nameKey, lang)).join(', ') }));
  } else if (strongCategories.length >= 1) {
    details.push(t('dna.strengthIn', lang, { categories: strongCategories.map(c => t(c.nameKey, lang)).join(', ') }));
  }
  
  // Verificar competencias específicas del cargo
  if (candidateDNA.primaryStrengths && candidateDNA.primaryStrengths.length > 0) {
    const matchingCompetencies = candidateDNA.primaryStrengths.filter(
      s => idealCompetencies.some(ic => s.toLowerCase().includes(ic.toLowerCase().replace('_', ' ')))
    );
    if (matchingCompetencies.length > 0) {
      score = Math.min(100, score + 5);
      details.push(t('dna.keyCompetencies', lang));
    }
  }
  
  return { score, details };
}

/**
 * Calcula la puntuación de Acumen
 */
function calculateAcumenFit(
  candidateAcumen: CandidateEvaluationData['acumen'],
  lang: Language
): { score: number; details: string[] } {
  if (!candidateAcumen) return { score: 0, details: [t('acumen.noData', lang)] };
  
  // Normalizar score de 0-10 a 0-100
  const score = candidateAcumen.totalAcumenScore * 10;
  const details: string[] = [];
  
  if (candidateAcumen.externalClarityScore >= 7) {
    details.push(t('acumen.excellentExternal', lang));
  }
  if (candidateAcumen.internalClarityScore >= 7) {
    details.push(t('acumen.strongInternal', lang));
  }
  
  if (candidateAcumen.acumenLevel === 'Muy Alto' || candidateAcumen.acumenLevel === 'Very High') {
    details.push(t('acumen.exceptionalJudgment', lang));
  }
  
  return { score, details };
}

/**
 * Calcula la puntuación de Valores
 */
function calculateValuesFit(
  candidateValues: CandidateEvaluationData['values'],
  lang: Language
): { score: number; details: string[] } {
  if (!candidateValues) return { score: 0, details: [t('values.noData', lang)] };
  
  // Promedio de los scores de valores
  const avgScore = (
    candidateValues.teoricoScore +
    candidateValues.utilitarioScore +
    candidateValues.esteticoScore +
    candidateValues.socialScore +
    candidateValues.individualistaScore +
    candidateValues.tradicionalScore
  ) / 6;
  
  const details: string[] = [];
  
  // Identificar valores dominantes
  const valueLabelKeys: Record<string, string> = {
    teorico: 'values.teorico',
    utilitario: 'values.utilitario',
    estetico: 'values.estetico',
    social: 'values.social',
    individualista: 'values.individualista',
    tradicional: 'values.tradicional',
  };
  
  if (candidateValues.primaryValues && candidateValues.primaryValues.length > 0) {
    const primaryLabels = candidateValues.primaryValues
      .map(v => t(valueLabelKeys[v.toLowerCase()] || v, lang))
      .slice(0, 2);
    details.push(t('values.primary', lang, { values: primaryLabels.join(', ') }));
  }
  
  return { score: avgScore, details };
}

/**
 * Calcula la puntuación de Estrés/Resiliencia
 */
function calculateStressFit(
  candidateStress: CandidateEvaluationData['stress'],
  lang: Language
): { score: number; details: string[] } {
  if (!candidateStress) return { score: 0, details: [t('stress.noData', lang)] };
  
  // Combinar resiliencia (positivo) con bajo estrés
  // indiceResiliencia ya es 0-10, nivelEstresGeneral también
  const resilienceScore = candidateStress.indiceResiliencia * 10;
  const stressInverse = (10 - candidateStress.nivelEstresGeneral) * 10; // Invertir: menos estrés = mejor
  
  const score = (resilienceScore * 0.6 + stressInverse * 0.4);
  const details: string[] = [];
  
  if (candidateStress.resilienceLevel === 'Muy Alta' || candidateStress.resilienceLevel === 'Very High') {
    details.push(t('stress.exceptionalResilience', lang));
  } else if (candidateStress.resilienceLevel === 'Alta' || candidateStress.resilienceLevel === 'High') {
    details.push(t('stress.highResilience', lang));
  }
  
  if (candidateStress.stressLevel === 'Muy Bajo' || candidateStress.stressLevel === 'Very Low') {
    details.push(t('stress.excellentManagement', lang));
  } else if (candidateStress.stressLevel === 'Alto' || candidateStress.stressLevel === 'High') {
    details.push(t('stress.highStress', lang));
  }
  
  return { score, details };
}

/**
 * Función principal de análisis de candidato
 */
export function analyzeCandidate(
  candidateData: CandidateEvaluationData,
  jobPositionId: string,
  customWeights?: Partial<typeof DEFAULT_WEIGHTS>,
  lang: Language = 'es'
): CandidateAnalysisResult {
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };
  const jobPosition = getJobPositionById(jobPositionId);
  
  // Si no hay perfil ideal, usar perfil genérico
  const idealProfile = jobPosition?.idealProfile || {
    disc: { D: 50, I: 50, S: 50, C: 50 },
    drivingForces: {},
    eqFocus: [],
    dnaCompetencies: [],
  };
  
  // Calcular scores por dimensión
  const discResult = calculateDISCFit(candidateData.disc, idealProfile.disc || { D: 50, I: 50, S: 50, C: 50 }, lang);
  const dfResult = calculateDrivingForcesFit(candidateData.drivingForces, idealProfile.drivingForces || {}, lang);
  const eqResult = calculateEQFit(candidateData.eq, idealProfile.eqFocus || [], lang);
  const dnaResult = calculateDNAFit(candidateData.dna, idealProfile.dnaCompetencies || [], lang);
  const acumenResult = calculateAcumenFit(candidateData.acumen, lang);
  const valuesResult = calculateValuesFit(candidateData.values, lang);
  const stressResult = calculateStressFit(candidateData.stress, lang);
  
  const dimensionScores = {
    disc: discResult.score,
    drivingForces: dfResult.score,
    eq: eqResult.score,
    dna: dnaResult.score,
    acumen: acumenResult.score,
    values: valuesResult.score,
    stress: stressResult.score,
  };
  
  // Calcular score ponderado total
  let totalWeight = 0;
  let weightedScore = 0;
  
  if (candidateData.disc) { weightedScore += dimensionScores.disc * weights.disc; totalWeight += weights.disc; }
  if (candidateData.drivingForces) { weightedScore += dimensionScores.drivingForces * weights.drivingForces; totalWeight += weights.drivingForces; }
  if (candidateData.eq) { weightedScore += dimensionScores.eq * weights.eq; totalWeight += weights.eq; }
  if (candidateData.dna) { weightedScore += dimensionScores.dna * weights.dna; totalWeight += weights.dna; }
  if (candidateData.acumen) { weightedScore += dimensionScores.acumen * weights.acumen; totalWeight += weights.acumen; }
  if (candidateData.values) { weightedScore += dimensionScores.values * weights.values; totalWeight += weights.values; }
  if (candidateData.stress) { weightedScore += dimensionScores.stress * weights.stress; totalWeight += weights.stress; }
  
  const overallScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  
  // Recopilar fortalezas y áreas de preocupación
  const allDetails = [
    ...discResult.details,
    ...dfResult.details,
    ...eqResult.details,
    ...dnaResult.details,
    ...acumenResult.details,
    ...valuesResult.details,
    ...stressResult.details,
  ];
  
  // Language-aware filtering for strengths and concerns
  const strengthKeywords = lang === 'en' 
    ? ['Excellent', 'High', 'Strong', 'outstanding', 'Exceptional']
    : ['Excelente', 'Alta', 'Fuerte', 'destacad', 'excepcional'];
  
  const concernKeywords = lang === 'en'
    ? ['⚠️', 'below', 'need to develop', 'requires']
    : ['⚠️', 'por debajo', 'necesitar', 'requiere'];
  
  const strengths = allDetails.filter(d => 
    strengthKeywords.some(kw => d.toLowerCase().includes(kw.toLowerCase()))
  );
  
  const areasOfConcern = allDetails.filter(d => 
    concernKeywords.some(kw => d.toLowerCase().includes(kw.toLowerCase()))
  );
  
  // Generar recomendaciones
  const recommendations: string[] = [];
  
  if (overallScore >= 80) {
    recommendations.push(t('rec.highlyRecommended', lang));
    recommendations.push(t('rec.proceedFinal', lang));
  } else if (overallScore >= 65) {
    recommendations.push(t('rec.goodPotential', lang));
    recommendations.push(t('rec.considerDevelopment', lang));
  } else if (overallScore >= 50) {
    recommendations.push(t('rec.moderatePotential', lang));
    recommendations.push(t('rec.evaluateCritical', lang));
  } else {
    recommendations.push(t('rec.significantGaps', lang));
    recommendations.push(t('rec.considerOther', lang));
  }
  
  // Detalles de compatibilidad
  const compatibilityDetails = [
    {
      category: t('cat.behavior', lang),
      description: t('cat.behaviorDesc', lang),
      score: dimensionScores.disc,
      status: getStatus(dimensionScores.disc),
    },
    {
      category: t('cat.motivations', lang),
      description: t('cat.motivationsDesc', lang),
      score: dimensionScores.drivingForces,
      status: getStatus(dimensionScores.drivingForces),
    },
    {
      category: t('cat.emotionalIntelligence', lang),
      description: t('cat.emotionalIntelligenceDesc', lang),
      score: dimensionScores.eq,
      status: getStatus(dimensionScores.eq),
    },
    {
      category: t('cat.competencies', lang),
      description: t('cat.competenciesDesc', lang),
      score: dimensionScores.dna,
      status: getStatus(dimensionScores.dna),
    },
    {
      category: t('cat.judgment', lang),
      description: t('cat.judgmentDesc', lang),
      score: dimensionScores.acumen,
      status: getStatus(dimensionScores.acumen),
    },
    {
      category: t('cat.values', lang),
      description: t('cat.valuesDesc', lang),
      score: dimensionScores.values,
      status: getStatus(dimensionScores.values),
    },
    {
      category: t('cat.resilience', lang),
      description: t('cat.resilienceDesc', lang),
      score: dimensionScores.stress,
      status: getStatus(dimensionScores.stress),
    },
  ].filter(d => d.score > 0) as CandidateAnalysisResult['compatibilityDetails'];
  
  return {
    overallScore,
    fitPercentage: overallScore,
    rankPosition: 0, // Se calcula después al comparar con otros candidatos
    dimensionScores,
    strengths,
    areasOfConcern,
    recommendations,
    compatibilityDetails,
  };
}

function getStatus(score: number): 'excellent' | 'good' | 'moderate' | 'low' {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 50) return 'moderate';
  return 'low';
}

/**
 * Analiza y rankea múltiples candidatos
 */
export function rankCandidates(
  candidatesData: { id: string; name: string; data: CandidateEvaluationData }[],
  jobPositionId: string,
  customWeights?: Partial<typeof DEFAULT_WEIGHTS>,
  lang: Language = 'es'
): (CandidateAnalysisResult & { candidateId: string; candidateName: string })[] {
  // Analizar cada candidato
  const analyzed = candidatesData.map(candidate => ({
    candidateId: candidate.id,
    candidateName: candidate.name,
    ...analyzeCandidate(candidate.data, jobPositionId, customWeights, lang),
  }));
  
  // Ordenar por score descendente
  analyzed.sort((a, b) => b.overallScore - a.overallScore);
  
  // Asignar posiciones de ranking
  analyzed.forEach((candidate, index) => {
    candidate.rankPosition = index + 1;
  });
  
  return analyzed;
}

/**
 * Genera un resumen ejecutivo de la campaña
 */
export function generateCampaignSummary(
  rankedCandidates: (CandidateAnalysisResult & { candidateId: string; candidateName: string })[],
  jobTitle: string,
  lang: Language = 'es'
): {
  totalCandidates: number;
  completedEvaluations: number;
  topCandidate: { name: string; score: number } | null;
  averageScore: number;
  scoreDistribution: { excellent: number; good: number; moderate: number; low: number };
  recommendationSummary: string;
} {
  const completedCandidates = rankedCandidates.filter(c => c.overallScore > 0);
  
  const distribution = {
    excellent: completedCandidates.filter(c => c.overallScore >= 80).length,
    good: completedCandidates.filter(c => c.overallScore >= 65 && c.overallScore < 80).length,
    moderate: completedCandidates.filter(c => c.overallScore >= 50 && c.overallScore < 65).length,
    low: completedCandidates.filter(c => c.overallScore < 50).length,
  };
  
  const avgScore = completedCandidates.length > 0
    ? Math.round(completedCandidates.reduce((sum, c) => sum + c.overallScore, 0) / completedCandidates.length)
    : 0;
  
  const topCandidate = rankedCandidates[0] && rankedCandidates[0].overallScore > 0
    ? { name: rankedCandidates[0].candidateName, score: rankedCandidates[0].overallScore }
    : null;
  
  let recommendationSummary = '';
  if (distribution.excellent >= 2) {
    recommendationSummary = t('summary.excellent', lang, { job: jobTitle, count: distribution.excellent });
  } else if (distribution.excellent === 1) {
    recommendationSummary = t('summary.oneExcellent', lang, { job: jobTitle, name: topCandidate?.name || '' });
  } else if (distribution.good >= 2) {
    recommendationSummary = t('summary.goodPotential', lang, { job: jobTitle, count: distribution.good });
  } else if (completedCandidates.length === 0) {
    recommendationSummary = t('summary.noEvaluations', lang);
  } else {
    recommendationSummary = t('summary.gaps', lang, { job: jobTitle });
  }
  
  return {
    totalCandidates: rankedCandidates.length,
    completedEvaluations: completedCandidates.length,
    topCandidate,
    averageScore: avgScore,
    scoreDistribution: distribution,
    recommendationSummary,
  };
}
