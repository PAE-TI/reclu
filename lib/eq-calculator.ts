// EQ Calculator - Emotional Intelligence Scoring System

export interface EQScores {
  // Main dimension scores (raw)
  selfAwarenessScore: number;
  selfRegulationScore: number;
  motivationScore: number;
  empathyScore: number;
  socialSkillsScore: number;
  
  // Main dimension percentiles (0-100)
  selfAwarenessPercentile: number;
  selfRegulationPercentile: number;
  motivationPercentile: number;
  empathyPercentile: number;
  socialSkillsPercentile: number;
  
  // Overall EQ
  totalEQScore: number;
  totalEQPercentile: number;
  
  // Classification
  eqLevel: string;
  eqProfile: string;
  primaryStrengths: string[];
  developmentAreas: string[];
}

export interface EQResponse {
  questionId: string;
  selectedValue: number; // 1-5
  dimension: string;
  subdimension?: string;
  isReversed: boolean;
  weight: number;
}

// Dimension names in Spanish
export const EQ_DIMENSION_NAMES: Record<string, string> = {
  SELF_AWARENESS: 'Autoconciencia',
  SELF_REGULATION: 'Autorregulación',
  MOTIVATION: 'Motivación',
  EMPATHY: 'Empatía',
  SOCIAL_SKILLS: 'Habilidades Sociales',
};

// Dimension descriptions
export const EQ_DIMENSION_DESCRIPTIONS: Record<string, string> = {
  SELF_AWARENESS: 'Capacidad de reconocer y entender tus propias emociones, fortalezas, debilidades, valores y motivaciones.',
  SELF_REGULATION: 'Habilidad para controlar o redirigir impulsos y estados de ánimo disruptivos, y la tendencia a pensar antes de actuar.',
  MOTIVATION: 'Pasión por el trabajo que va más allá del dinero o el estatus; tendencia a perseguir metas con energía y persistencia.',
  EMPATHY: 'Capacidad de entender las emociones de otras personas y tratarlas de acuerdo con sus reacciones emocionales.',
  SOCIAL_SKILLS: 'Competencia en el manejo de relaciones y construcción de redes; habilidad para encontrar terreno común y construir rapport.',
};

// Subdimension mapping
export const EQ_SUBDIMENSIONS: Record<string, string[]> = {
  SELF_AWARENESS: ['Autoconciencia Emocional', 'Autoevaluación Precisa', 'Autoconfianza'],
  SELF_REGULATION: ['Autocontrol', 'Confiabilidad', 'Adaptabilidad', 'Innovación'],
  MOTIVATION: ['Impulso de Logro', 'Compromiso', 'Iniciativa', 'Optimismo'],
  EMPATHY: ['Comprensión de Otros', 'Desarrollo de Otros', 'Orientación al Servicio', 'Conciencia Política'],
  SOCIAL_SKILLS: ['Influencia', 'Comunicación', 'Manejo de Conflictos', 'Liderazgo', 'Trabajo en Equipo'],
};

// Color coding for dimensions
export const EQ_DIMENSION_COLORS: Record<string, string> = {
  SELF_AWARENESS: '#ef4444', // red
  SELF_REGULATION: '#f97316', // orange
  MOTIVATION: '#eab308', // yellow
  EMPATHY: '#22c55e', // green
  SOCIAL_SKILLS: '#3b82f6', // blue
};

// EQ Level thresholds
const EQ_LEVELS = [
  { min: 85, label: 'Muy Alto', description: 'Inteligencia emocional excepcional' },
  { min: 70, label: 'Alto', description: 'Inteligencia emocional por encima del promedio' },
  { min: 50, label: 'Moderado', description: 'Inteligencia emocional en el rango promedio' },
  { min: 30, label: 'Bajo', description: 'Inteligencia emocional por debajo del promedio' },
  { min: 0, label: 'Muy Bajo', description: 'Área significativa de desarrollo' },
];

// EQ Profiles based on dimension combinations
const EQ_PROFILES: Record<string, { name: string; description: string }> = {
  'EMPATHY_HIGH_SOCIAL_SKILLS_HIGH': {
    name: 'Líder Empático',
    description: 'Conecta profundamente con otros y construye relaciones sólidas.',
  },
  'SELF_AWARENESS_HIGH_SELF_REGULATION_HIGH': {
    name: 'Maestro del Autocontrol',
    description: 'Alto autoconocimiento combinado con excelente regulación emocional.',
  },
  'MOTIVATION_HIGH_SOCIAL_SKILLS_HIGH': {
    name: 'Influenciador Motivado',
    description: 'Combina alta motivación personal con habilidades sociales excepcionales.',
  },
  'SELF_AWARENESS_HIGH_EMPATHY_HIGH': {
    name: 'Intérprete Emocional',
    description: 'Entiende tanto sus propias emociones como las de los demás.',
  },
  'MOTIVATION_HIGH_SELF_REGULATION_HIGH': {
    name: 'Ejecutor Resiliente',
    description: 'Altamente motivado con excelente capacidad de autocontrol.',
  },
  'DEFAULT': {
    name: 'Perfil Equilibrado',
    description: 'Muestra un balance entre las diferentes dimensiones de inteligencia emocional.',
  },
};

/**
 * Calculate EQ scores from responses
 */
export function calculateEQScores(responses: EQResponse[]): EQScores {
  // Initialize dimension scores
  const dimensionScores: Record<string, { total: number; count: number; maxPossible: number }> = {
    SELF_AWARENESS: { total: 0, count: 0, maxPossible: 0 },
    SELF_REGULATION: { total: 0, count: 0, maxPossible: 0 },
    MOTIVATION: { total: 0, count: 0, maxPossible: 0 },
    EMPATHY: { total: 0, count: 0, maxPossible: 0 },
    SOCIAL_SKILLS: { total: 0, count: 0, maxPossible: 0 },
  };
  
  // Process each response
  responses.forEach((response) => {
    const dimension = response.dimension;
    if (!dimensionScores[dimension]) return;
    
    // Handle reverse-scored items
    let score = response.selectedValue;
    if (response.isReversed) {
      score = 6 - score; // Reverse the score (1->5, 2->4, 3->3, 4->2, 5->1)
    }
    
    // Apply weight
    score = score * response.weight;
    
    dimensionScores[dimension].total += score;
    dimensionScores[dimension].count += 1;
    dimensionScores[dimension].maxPossible += 5 * response.weight; // Max score is 5
  });
  
  // Calculate percentiles for each dimension
  const calculatePercentile = (total: number, maxPossible: number): number => {
    if (maxPossible === 0) return 0;
    // Convert to 0-100 scale
    return Math.round((total / maxPossible) * 100);
  };
  
  const selfAwarenessPercentile = calculatePercentile(
    dimensionScores.SELF_AWARENESS.total,
    dimensionScores.SELF_AWARENESS.maxPossible
  );
  const selfRegulationPercentile = calculatePercentile(
    dimensionScores.SELF_REGULATION.total,
    dimensionScores.SELF_REGULATION.maxPossible
  );
  const motivationPercentile = calculatePercentile(
    dimensionScores.MOTIVATION.total,
    dimensionScores.MOTIVATION.maxPossible
  );
  const empathyPercentile = calculatePercentile(
    dimensionScores.EMPATHY.total,
    dimensionScores.EMPATHY.maxPossible
  );
  const socialSkillsPercentile = calculatePercentile(
    dimensionScores.SOCIAL_SKILLS.total,
    dimensionScores.SOCIAL_SKILLS.maxPossible
  );
  
  // Calculate total EQ score (weighted average)
  const totalEQPercentile = Math.round(
    (selfAwarenessPercentile + selfRegulationPercentile + motivationPercentile + 
     empathyPercentile + socialSkillsPercentile) / 5
  );
  
  // Determine EQ level
  const eqLevel = EQ_LEVELS.find((level) => totalEQPercentile >= level.min)?.label || 'Moderado';
  
  // Determine strengths and development areas
  const dimensionResults = [
    { name: 'SELF_AWARENESS', percentile: selfAwarenessPercentile, label: 'Autoconciencia' },
    { name: 'SELF_REGULATION', percentile: selfRegulationPercentile, label: 'Autorregulación' },
    { name: 'MOTIVATION', percentile: motivationPercentile, label: 'Motivación' },
    { name: 'EMPATHY', percentile: empathyPercentile, label: 'Empatía' },
    { name: 'SOCIAL_SKILLS', percentile: socialSkillsPercentile, label: 'Habilidades Sociales' },
  ].sort((a, b) => b.percentile - a.percentile);
  
  const primaryStrengths = dimensionResults.slice(0, 3).map((d) => d.label);
  const developmentAreas = dimensionResults.slice(-2).map((d) => d.label);
  
  // Determine EQ profile based on top 2 dimensions
  const top2 = dimensionResults.slice(0, 2);
  let profileKey = 'DEFAULT';
  
  if (top2[0].percentile >= 70 && top2[1].percentile >= 70) {
    const key1 = `${top2[0].name}_HIGH_${top2[1].name}_HIGH`;
    const key2 = `${top2[1].name}_HIGH_${top2[0].name}_HIGH`;
    if (EQ_PROFILES[key1]) profileKey = key1;
    else if (EQ_PROFILES[key2]) profileKey = key2;
  }
  
  const eqProfile = EQ_PROFILES[profileKey].name;
  
  return {
    selfAwarenessScore: Math.round(dimensionScores.SELF_AWARENESS.total),
    selfRegulationScore: Math.round(dimensionScores.SELF_REGULATION.total),
    motivationScore: Math.round(dimensionScores.MOTIVATION.total),
    empathyScore: Math.round(dimensionScores.EMPATHY.total),
    socialSkillsScore: Math.round(dimensionScores.SOCIAL_SKILLS.total),
    selfAwarenessPercentile,
    selfRegulationPercentile,
    motivationPercentile,
    empathyPercentile,
    socialSkillsPercentile,
    totalEQScore: Math.round(
      dimensionScores.SELF_AWARENESS.total +
      dimensionScores.SELF_REGULATION.total +
      dimensionScores.MOTIVATION.total +
      dimensionScores.EMPATHY.total +
      dimensionScores.SOCIAL_SKILLS.total
    ),
    totalEQPercentile,
    eqLevel,
    eqProfile,
    primaryStrengths,
    developmentAreas,
  };
}

/**
 * Get interpretation for EQ results
 */
export function getEQInterpretation(scores: EQScores) {
  const interpretations: Record<string, { high: string; low: string }> = {
    SELF_AWARENESS: {
      high: 'Excelente capacidad para reconocer cómo tus emociones afectan tu rendimiento. Tienes una imagen clara de tus fortalezas y limitaciones.',
      low: 'Área de desarrollo: Practicar la reflexión diaria sobre tus estados emocionales puede ayudarte a mejorar tu autoconocimiento.',
    },
    SELF_REGULATION: {
      high: 'Demuestras gran habilidad para manejar tus impulsos y emociones disruptivas. Eres visto como alguien confiable y adaptable.',
      low: 'Área de desarrollo: Técnicas como la respiración consciente y pausas antes de reaccionar pueden fortalecer tu autocontrol.',
    },
    MOTIVATION: {
      high: 'Alta motivación intrínseca que te impulsa a alcanzar metas más allá de recompensas externas. Mantienes el optimismo ante obstáculos.',
      low: 'Área de desarrollo: Conectar tus tareas diarias con tus valores personales puede aumentar tu motivación intrínseca.',
    },
    EMPATHY: {
      high: 'Capacidad sobresaliente para sintonizar con las emociones de otros. Esto te permite construir relaciones profundas y significativas.',
      low: 'Área de desarrollo: Practicar la escucha activa y observar el lenguaje no verbal puede mejorar tu conexión con otros.',
    },
    SOCIAL_SKILLS: {
      high: 'Habilidades interpersonales excepcionales que facilitan la colaboración, negociación y liderazgo efectivo.',
      low: 'Área de desarrollo: Participar en actividades grupales y practicar la comunicación asertiva fortalecerá estas habilidades.',
    },
  };
  
  const results: Record<string, string> = {};
  
  if (scores.selfAwarenessPercentile >= 60) {
    results.selfAwareness = interpretations.SELF_AWARENESS.high;
  } else {
    results.selfAwareness = interpretations.SELF_AWARENESS.low;
  }
  
  if (scores.selfRegulationPercentile >= 60) {
    results.selfRegulation = interpretations.SELF_REGULATION.high;
  } else {
    results.selfRegulation = interpretations.SELF_REGULATION.low;
  }
  
  if (scores.motivationPercentile >= 60) {
    results.motivation = interpretations.MOTIVATION.high;
  } else {
    results.motivation = interpretations.MOTIVATION.low;
  }
  
  if (scores.empathyPercentile >= 60) {
    results.empathy = interpretations.EMPATHY.high;
  } else {
    results.empathy = interpretations.EMPATHY.low;
  }
  
  if (scores.socialSkillsPercentile >= 60) {
    results.socialSkills = interpretations.SOCIAL_SKILLS.high;
  } else {
    results.socialSkills = interpretations.SOCIAL_SKILLS.low;
  }
  
  return results;
}

/**
 * Get EQ level description
 */
export function getEQLevelDescription(level: string): string {
  return EQ_LEVELS.find((l) => l.label === level)?.description || '';
}

/**
 * Get development tips based on lowest dimensions
 */
export function getEQDevelopmentTips(developmentAreas: string[]): string[] {
  const tips: Record<string, string[]> = {
    'Autoconciencia': [
      'Lleva un diario emocional donde registres cómo te sientes durante el día',
      'Pide retroalimentación honesta a personas de confianza sobre cómo te perciben',
      'Practica la meditación mindfulness para aumentar tu conciencia emocional',
    ],
    'Autorregulación': [
      'Cuenta hasta 10 antes de responder en situaciones emocionales',
      'Identifica tus disparadores emocionales y prepara estrategias de respuesta',
      'Practica técnicas de respiración profunda cuando sientas tensión',
    ],
    'Motivación': [
      'Establece metas pequeñas y celebra cada logro',
      'Conecta tus tareas con un propósito mayor',
      'Busca mentores o modelos a seguir que te inspiren',
    ],
    'Empatía': [
      'Practica la escucha activa sin interrumpir',
      'Antes de juzgar, intenta entender la perspectiva del otro',
      'Observa el lenguaje corporal y las señales no verbales',
    ],
    'Habilidades Sociales': [
      'Participa activamente en actividades de equipo',
      'Practica dar y recibir retroalimentación constructiva',
      'Desarrolla tu capacidad de comunicación asertiva',
    ],
  };
  
  const allTips: string[] = [];
  developmentAreas.forEach((area) => {
    if (tips[area]) {
      allTips.push(...tips[area]);
    }
  });
  
  return allTips;
}
