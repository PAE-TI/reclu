// DNA-25 Calculator - Competencies Scoring System

export interface DNAScores {
  // Competency scores (raw)
  analyticalThinkingScore: number;
  problemSolvingScore: number;
  creativityScore: number;
  adaptabilityScore: number;
  achievementOrientationScore: number;
  timeManagementScore: number;
  planningOrganizationScore: number;
  attentionToDetailScore: number;
  customerServiceScore: number;
  writtenCommunicationScore: number;
  verbalCommunicationScore: number;
  influenceScore: number;
  negotiationScore: number;
  presentationSkillsScore: number;
  teamworkScore: number;
  leadershipScore: number;
  developingOthersScore: number;
  conflictManagementScore: number;
  decisionMakingScore: number;
  strategicThinkingScore: number;
  relationshipBuildingScore: number;
  businessAcumenScore: number;
  resultsOrientationScore: number;
  resilienceScore: number;
  accountabilityScore: number;
  
  // Competency percentiles (0-100)
  analyticalThinkingPercentile: number;
  problemSolvingPercentile: number;
  creativityPercentile: number;
  adaptabilityPercentile: number;
  achievementOrientationPercentile: number;
  timeManagementPercentile: number;
  planningOrganizationPercentile: number;
  attentionToDetailPercentile: number;
  customerServicePercentile: number;
  writtenCommunicationPercentile: number;
  verbalCommunicationPercentile: number;
  influencePercentile: number;
  negotiationPercentile: number;
  presentationSkillsPercentile: number;
  teamworkPercentile: number;
  leadershipPercentile: number;
  developingOthersPercentile: number;
  conflictManagementPercentile: number;
  decisionMakingPercentile: number;
  strategicThinkingPercentile: number;
  relationshipBuildingPercentile: number;
  businessAcumenPercentile: number;
  resultsOrientationPercentile: number;
  resiliencePercentile: number;
  accountabilityPercentile: number;
  
  // Category averages
  thinkingCategoryScore: number;
  communicationCategoryScore: number;
  leadershipCategoryScore: number;
  resultsCategoryScore: number;
  relationshipCategoryScore: number;
  
  // Overall DNA
  totalDNAScore: number;
  totalDNAPercentile: number;
  
  // Classification
  dnaLevel: string;
  dnaProfile: string;
  primaryStrengths: string[];
  developmentAreas: string[];
}

export interface DNAResponse {
  questionId: string;
  selectedValue: number; // 1-5
  competency: string;
  category: string;
  isReversed: boolean;
  weight: number;
}

// Competency names in Spanish
export const DNA_COMPETENCY_NAMES: Record<string, string> = {
  ANALYTICAL_THINKING: 'Pensamiento Analítico',
  PROBLEM_SOLVING: 'Resolución de Problemas',
  CREATIVITY: 'Creatividad',
  ADAPTABILITY: 'Adaptabilidad',
  ACHIEVEMENT_ORIENTATION: 'Orientación al Logro',
  TIME_MANAGEMENT: 'Gestión del Tiempo',
  PLANNING_ORGANIZATION: 'Planificación',
  ATTENTION_TO_DETAIL: 'Atención al Detalle',
  CUSTOMER_SERVICE: 'Servicio al Cliente',
  WRITTEN_COMMUNICATION: 'Comunicación Escrita',
  VERBAL_COMMUNICATION: 'Comunicación Verbal',
  INFLUENCE: 'Influencia',
  NEGOTIATION: 'Negociación',
  PRESENTATION_SKILLS: 'Presentaciones',
  TEAMWORK: 'Trabajo en Equipo',
  LEADERSHIP: 'Liderazgo',
  DEVELOPING_OTHERS: 'Desarrollo de Personas',
  CONFLICT_MANAGEMENT: 'Gestión de Conflictos',
  DECISION_MAKING: 'Toma de Decisiones',
  STRATEGIC_THINKING: 'Pensamiento Estratégico',
  RELATIONSHIP_BUILDING: 'Relaciones',
  BUSINESS_ACUMEN: 'Visión de Negocio',
  RESULTS_ORIENTATION: 'Orientación a Resultados',
  RESILIENCE: 'Resiliencia',
  ACCOUNTABILITY: 'Responsabilidad',
};

// Category names in Spanish
export const DNA_CATEGORY_NAMES: Record<string, string> = {
  THINKING: 'Pensamiento',
  COMMUNICATION: 'Comunicación',
  LEADERSHIP: 'Liderazgo',
  RESULTS: 'Resultados',
  RELATIONSHIP: 'Relacionamiento',
};

// Competencies by category
export const DNA_CATEGORIES: Record<string, string[]> = {
  THINKING: ['ANALYTICAL_THINKING', 'PROBLEM_SOLVING', 'CREATIVITY', 'STRATEGIC_THINKING', 'DECISION_MAKING'],
  COMMUNICATION: ['WRITTEN_COMMUNICATION', 'VERBAL_COMMUNICATION', 'PRESENTATION_SKILLS', 'INFLUENCE', 'NEGOTIATION'],
  LEADERSHIP: ['LEADERSHIP', 'DEVELOPING_OTHERS', 'CONFLICT_MANAGEMENT', 'ADAPTABILITY', 'BUSINESS_ACUMEN'],
  RESULTS: ['ACHIEVEMENT_ORIENTATION', 'TIME_MANAGEMENT', 'PLANNING_ORGANIZATION', 'ATTENTION_TO_DETAIL', 'RESULTS_ORIENTATION'],
  RELATIONSHIP: ['TEAMWORK', 'CUSTOMER_SERVICE', 'RELATIONSHIP_BUILDING', 'RESILIENCE', 'ACCOUNTABILITY'],
};

// Category descriptions
export const DNA_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  THINKING: 'Capacidades cognitivas para analizar, resolver problemas y pensar estratégicamente.',
  COMMUNICATION: 'Habilidades para transmitir ideas, influir y negociar efectivamente.',
  LEADERSHIP: 'Competencias para guiar equipos, desarrollar personas y gestionar cambios.',
  RESULTS: 'Orientación hacia el logro, planificación y ejecución efectiva.',
  RELATIONSHIP: 'Habilidades interpersonales y de colaboración.',
};

// Competency descriptions
export const DNA_COMPETENCY_DESCRIPTIONS: Record<string, string> = {
  ANALYTICAL_THINKING: 'Capacidad de descomponer problemas complejos en partes manejables y analizar información objetivamente.',
  PROBLEM_SOLVING: 'Habilidad para identificar problemas, generar alternativas y encontrar soluciones efectivas.',
  CREATIVITY: 'Capacidad de generar ideas originales e innovadoras y pensar fuera de lo convencional.',
  ADAPTABILITY: 'Flexibilidad para ajustarse a cambios y nuevas situaciones de manera efectiva.',
  ACHIEVEMENT_ORIENTATION: 'Impulso para alcanzar y superar metas establecidas con excelencia.',
  TIME_MANAGEMENT: 'Habilidad para priorizar tareas y gestionar el tiempo de manera eficiente.',
  PLANNING_ORGANIZATION: 'Capacidad de planificar, organizar recursos y establecer prioridades.',
  ATTENTION_TO_DETAIL: 'Precisión y cuidado en la ejecución de tareas y revisión de trabajo.',
  CUSTOMER_SERVICE: 'Orientación hacia satisfacer las necesidades de clientes internos y externos.',
  WRITTEN_COMMUNICATION: 'Habilidad para expresar ideas claramente por escrito.',
  VERBAL_COMMUNICATION: 'Capacidad de comunicar ideas verbalmente de forma clara y persuasiva.',
  INFLUENCE: 'Habilidad para impactar las opiniones y acciones de otros.',
  NEGOTIATION: 'Capacidad de llegar a acuerdos mutuamente beneficiosos.',
  PRESENTATION_SKILLS: 'Habilidad para presentar información de manera clara y convincente.',
  TEAMWORK: 'Capacidad de colaborar efectivamente con otros hacia metas comunes.',
  LEADERSHIP: 'Habilidad para inspirar, guiar y motivar a otros.',
  DEVELOPING_OTHERS: 'Compromiso con el crecimiento y desarrollo de las personas.',
  CONFLICT_MANAGEMENT: 'Capacidad de manejar y resolver conflictos de manera constructiva.',
  DECISION_MAKING: 'Habilidad para tomar decisiones oportunas y fundamentadas.',
  STRATEGIC_THINKING: 'Capacidad de ver el panorama completo y planificar a largo plazo.',
  RELATIONSHIP_BUILDING: 'Habilidad para establecer y mantener relaciones profesionales sólidas.',
  BUSINESS_ACUMEN: 'Comprensión del negocio y capacidad de tomar decisiones comerciales.',
  RESULTS_ORIENTATION: 'Enfoque consistente en lograr resultados medibles.',
  RESILIENCE: 'Capacidad de recuperarse de adversidades y mantener la efectividad.',
  ACCOUNTABILITY: 'Responsabilidad personal por acciones y resultados.',
};

// Color coding for categories
export const DNA_CATEGORY_COLORS: Record<string, string> = {
  THINKING: '#6366f1', // indigo
  COMMUNICATION: '#8b5cf6', // violet
  LEADERSHIP: '#ec4899', // pink
  RESULTS: '#f59e0b', // amber
  RELATIONSHIP: '#10b981', // emerald
};

// DNA Level thresholds
const DNA_LEVELS = [
  { min: 85, label: 'Muy Alto', description: 'Nivel de competencias excepcional' },
  { min: 70, label: 'Alto', description: 'Nivel de competencias por encima del promedio' },
  { min: 50, label: 'Moderado', description: 'Nivel de competencias en el rango promedio' },
  { min: 30, label: 'Bajo', description: 'Nivel de competencias por debajo del promedio' },
  { min: 0, label: 'Muy Bajo', description: 'Área significativa de desarrollo' },
];

// DNA Profiles based on top categories
const DNA_PROFILES: Record<string, { name: string; description: string }> = {
  'THINKING_HIGH': {
    name: 'Estratega Analítico',
    description: 'Destaca en análisis, resolución de problemas y pensamiento estratégico.',
  },
  'COMMUNICATION_HIGH': {
    name: 'Comunicador Influyente',
    description: 'Sobresale en comunicación, presentaciones e influencia.',
  },
  'LEADERSHIP_HIGH': {
    name: 'Líder Natural',
    description: 'Excelente en liderazgo, desarrollo de personas y gestión de cambios.',
  },
  'RESULTS_HIGH': {
    name: 'Ejecutor de Alto Impacto',
    description: 'Orientado a resultados con excelente planificación y gestión del tiempo.',
  },
  'RELATIONSHIP_HIGH': {
    name: 'Constructor de Relaciones',
    description: 'Experto en trabajo en equipo, servicio al cliente y relaciones.',
  },
  'BALANCED': {
    name: 'Perfil Versátil',
    description: 'Muestra un balance equilibrado entre las diferentes categorías de competencias.',
  },
  'DEFAULT': {
    name: 'Perfil en Desarrollo',
    description: 'Perfil con oportunidades de crecimiento en múltiples áreas.',
  },
};

/**
 * Calculate DNA scores from responses
 */
export function calculateDNAScores(responses: DNAResponse[]): DNAScores {
  // Initialize competency scores
  const competencyScores: Record<string, { total: number; count: number; maxPossible: number }> = {
    ANALYTICAL_THINKING: { total: 0, count: 0, maxPossible: 0 },
    PROBLEM_SOLVING: { total: 0, count: 0, maxPossible: 0 },
    CREATIVITY: { total: 0, count: 0, maxPossible: 0 },
    ADAPTABILITY: { total: 0, count: 0, maxPossible: 0 },
    ACHIEVEMENT_ORIENTATION: { total: 0, count: 0, maxPossible: 0 },
    TIME_MANAGEMENT: { total: 0, count: 0, maxPossible: 0 },
    PLANNING_ORGANIZATION: { total: 0, count: 0, maxPossible: 0 },
    ATTENTION_TO_DETAIL: { total: 0, count: 0, maxPossible: 0 },
    CUSTOMER_SERVICE: { total: 0, count: 0, maxPossible: 0 },
    WRITTEN_COMMUNICATION: { total: 0, count: 0, maxPossible: 0 },
    VERBAL_COMMUNICATION: { total: 0, count: 0, maxPossible: 0 },
    INFLUENCE: { total: 0, count: 0, maxPossible: 0 },
    NEGOTIATION: { total: 0, count: 0, maxPossible: 0 },
    PRESENTATION_SKILLS: { total: 0, count: 0, maxPossible: 0 },
    TEAMWORK: { total: 0, count: 0, maxPossible: 0 },
    LEADERSHIP: { total: 0, count: 0, maxPossible: 0 },
    DEVELOPING_OTHERS: { total: 0, count: 0, maxPossible: 0 },
    CONFLICT_MANAGEMENT: { total: 0, count: 0, maxPossible: 0 },
    DECISION_MAKING: { total: 0, count: 0, maxPossible: 0 },
    STRATEGIC_THINKING: { total: 0, count: 0, maxPossible: 0 },
    RELATIONSHIP_BUILDING: { total: 0, count: 0, maxPossible: 0 },
    BUSINESS_ACUMEN: { total: 0, count: 0, maxPossible: 0 },
    RESULTS_ORIENTATION: { total: 0, count: 0, maxPossible: 0 },
    RESILIENCE: { total: 0, count: 0, maxPossible: 0 },
    ACCOUNTABILITY: { total: 0, count: 0, maxPossible: 0 },
  };
  
  // Process each response
  responses.forEach((response) => {
    const competency = response.competency;
    if (!competencyScores[competency]) return;
    
    // Handle reverse-scored items
    let score = response.selectedValue;
    if (response.isReversed) {
      score = 6 - score; // Reverse the score (1->5, 2->4, 3->3, 4->2, 5->1)
    }
    
    // Apply weight
    score = score * response.weight;
    
    competencyScores[competency].total += score;
    competencyScores[competency].count += 1;
    competencyScores[competency].maxPossible += 5 * response.weight; // Max score is 5
  });
  
  // Calculate percentile
  const calculatePercentile = (total: number, maxPossible: number): number => {
    if (maxPossible === 0) return 0;
    return Math.round((total / maxPossible) * 100);
  };
  
  // Calculate all competency percentiles
  const percentiles: Record<string, number> = {};
  Object.keys(competencyScores).forEach((key) => {
    percentiles[key] = calculatePercentile(
      competencyScores[key].total,
      competencyScores[key].maxPossible
    );
  });
  
  // Calculate category averages
  const calculateCategoryAverage = (competencies: string[]): number => {
    const validPercentiles = competencies
      .map((c) => percentiles[c])
      .filter((p) => p > 0);
    if (validPercentiles.length === 0) return 0;
    return Math.round(validPercentiles.reduce((a, b) => a + b, 0) / validPercentiles.length);
  };
  
  const thinkingCategoryScore = calculateCategoryAverage(DNA_CATEGORIES.THINKING);
  const communicationCategoryScore = calculateCategoryAverage(DNA_CATEGORIES.COMMUNICATION);
  const leadershipCategoryScore = calculateCategoryAverage(DNA_CATEGORIES.LEADERSHIP);
  const resultsCategoryScore = calculateCategoryAverage(DNA_CATEGORIES.RESULTS);
  const relationshipCategoryScore = calculateCategoryAverage(DNA_CATEGORIES.RELATIONSHIP);
  
  // Calculate total DNA percentile
  const allPercentiles = Object.values(percentiles).filter((p) => p > 0);
  const totalDNAPercentile = allPercentiles.length > 0
    ? Math.round(allPercentiles.reduce((a, b) => a + b, 0) / allPercentiles.length)
    : 0;
  
  // Determine DNA level
  const dnaLevel = DNA_LEVELS.find((level) => totalDNAPercentile >= level.min)?.label || 'Moderado';
  
  // Determine strengths and development areas
  const competencyResults = Object.entries(percentiles)
    .map(([name, percentile]) => ({
      name,
      percentile,
      label: DNA_COMPETENCY_NAMES[name] || name,
    }))
    .sort((a, b) => b.percentile - a.percentile);
  
  const primaryStrengths = competencyResults.slice(0, 5).map((d) => d.label);
  const developmentAreas = competencyResults.slice(-5).map((d) => d.label);
  
  // Determine DNA profile based on top category
  const categoryResults = [
    { name: 'THINKING', score: thinkingCategoryScore },
    { name: 'COMMUNICATION', score: communicationCategoryScore },
    { name: 'LEADERSHIP', score: leadershipCategoryScore },
    { name: 'RESULTS', score: resultsCategoryScore },
    { name: 'RELATIONSHIP', score: relationshipCategoryScore },
  ].sort((a, b) => b.score - a.score);
  
  let profileKey = 'DEFAULT';
  const topCategory = categoryResults[0];
  const secondCategory = categoryResults[1];
  
  // Check if balanced (top categories are within 10 points of each other)
  if (Math.abs(topCategory.score - secondCategory.score) <= 10 && topCategory.score >= 50) {
    profileKey = 'BALANCED';
  } else if (topCategory.score >= 60) {
    profileKey = `${topCategory.name}_HIGH`;
  }
  
  const dnaProfile = DNA_PROFILES[profileKey]?.name || DNA_PROFILES.DEFAULT.name;
  
  return {
    // Raw scores
    analyticalThinkingScore: Math.round(competencyScores.ANALYTICAL_THINKING.total),
    problemSolvingScore: Math.round(competencyScores.PROBLEM_SOLVING.total),
    creativityScore: Math.round(competencyScores.CREATIVITY.total),
    adaptabilityScore: Math.round(competencyScores.ADAPTABILITY.total),
    achievementOrientationScore: Math.round(competencyScores.ACHIEVEMENT_ORIENTATION.total),
    timeManagementScore: Math.round(competencyScores.TIME_MANAGEMENT.total),
    planningOrganizationScore: Math.round(competencyScores.PLANNING_ORGANIZATION.total),
    attentionToDetailScore: Math.round(competencyScores.ATTENTION_TO_DETAIL.total),
    customerServiceScore: Math.round(competencyScores.CUSTOMER_SERVICE.total),
    writtenCommunicationScore: Math.round(competencyScores.WRITTEN_COMMUNICATION.total),
    verbalCommunicationScore: Math.round(competencyScores.VERBAL_COMMUNICATION.total),
    influenceScore: Math.round(competencyScores.INFLUENCE.total),
    negotiationScore: Math.round(competencyScores.NEGOTIATION.total),
    presentationSkillsScore: Math.round(competencyScores.PRESENTATION_SKILLS.total),
    teamworkScore: Math.round(competencyScores.TEAMWORK.total),
    leadershipScore: Math.round(competencyScores.LEADERSHIP.total),
    developingOthersScore: Math.round(competencyScores.DEVELOPING_OTHERS.total),
    conflictManagementScore: Math.round(competencyScores.CONFLICT_MANAGEMENT.total),
    decisionMakingScore: Math.round(competencyScores.DECISION_MAKING.total),
    strategicThinkingScore: Math.round(competencyScores.STRATEGIC_THINKING.total),
    relationshipBuildingScore: Math.round(competencyScores.RELATIONSHIP_BUILDING.total),
    businessAcumenScore: Math.round(competencyScores.BUSINESS_ACUMEN.total),
    resultsOrientationScore: Math.round(competencyScores.RESULTS_ORIENTATION.total),
    resilienceScore: Math.round(competencyScores.RESILIENCE.total),
    accountabilityScore: Math.round(competencyScores.ACCOUNTABILITY.total),
    
    // Percentiles
    analyticalThinkingPercentile: percentiles.ANALYTICAL_THINKING,
    problemSolvingPercentile: percentiles.PROBLEM_SOLVING,
    creativityPercentile: percentiles.CREATIVITY,
    adaptabilityPercentile: percentiles.ADAPTABILITY,
    achievementOrientationPercentile: percentiles.ACHIEVEMENT_ORIENTATION,
    timeManagementPercentile: percentiles.TIME_MANAGEMENT,
    planningOrganizationPercentile: percentiles.PLANNING_ORGANIZATION,
    attentionToDetailPercentile: percentiles.ATTENTION_TO_DETAIL,
    customerServicePercentile: percentiles.CUSTOMER_SERVICE,
    writtenCommunicationPercentile: percentiles.WRITTEN_COMMUNICATION,
    verbalCommunicationPercentile: percentiles.VERBAL_COMMUNICATION,
    influencePercentile: percentiles.INFLUENCE,
    negotiationPercentile: percentiles.NEGOTIATION,
    presentationSkillsPercentile: percentiles.PRESENTATION_SKILLS,
    teamworkPercentile: percentiles.TEAMWORK,
    leadershipPercentile: percentiles.LEADERSHIP,
    developingOthersPercentile: percentiles.DEVELOPING_OTHERS,
    conflictManagementPercentile: percentiles.CONFLICT_MANAGEMENT,
    decisionMakingPercentile: percentiles.DECISION_MAKING,
    strategicThinkingPercentile: percentiles.STRATEGIC_THINKING,
    relationshipBuildingPercentile: percentiles.RELATIONSHIP_BUILDING,
    businessAcumenPercentile: percentiles.BUSINESS_ACUMEN,
    resultsOrientationPercentile: percentiles.RESULTS_ORIENTATION,
    resiliencePercentile: percentiles.RESILIENCE,
    accountabilityPercentile: percentiles.ACCOUNTABILITY,
    
    // Category scores
    thinkingCategoryScore,
    communicationCategoryScore,
    leadershipCategoryScore,
    resultsCategoryScore,
    relationshipCategoryScore,
    
    // Overall
    totalDNAScore: Object.values(competencyScores).reduce((sum, c) => sum + c.total, 0),
    totalDNAPercentile,
    
    // Classification
    dnaLevel,
    dnaProfile,
    primaryStrengths,
    developmentAreas,
  };
}

/**
 * Get DNA level description
 */
export function getDNALevelDescription(level: string): string {
  return DNA_LEVELS.find((l) => l.label === level)?.description || '';
}

/**
 * Get development tips based on lowest competencies
 */
export function getDNADevelopmentTips(developmentAreas: string[]): string[] {
  const tips: Record<string, string[]> = {
    'Pensamiento Analítico': [
      'Practica descomponer problemas complejos en partes más pequeñas',
      'Utiliza herramientas como diagramas de flujo y mapas mentales',
      'Cuestiona las suposiciones y busca datos para validar conclusiones',
    ],
    'Resolución de Problemas': [
      'Aprende técnicas estructuradas como los 5 Porqués o el diagrama de Ishikawa',
      'Practica brainstorming para generar múltiples soluciones',
      'Evalúa pros y contras antes de tomar decisiones',
    ],
    'Creatividad': [
      'Dedica tiempo a actividades creativas fuera del trabajo',
      'Exponte a nuevas experiencias y perspectivas',
      'Practica el pensamiento lateral y "qué pasaría si..."',
    ],
    'Adaptabilidad': [
      'Acepta el cambio como una oportunidad de crecimiento',
      'Desarrolla múltiples planes de contingencia',
      'Practica la flexibilidad en situaciones cotidianas',
    ],
    'Orientación al Logro': [
      'Establece metas SMART (Específicas, Medibles, Alcanzables, Relevantes, Temporales)',
      'Celebra los pequeños logros en el camino',
      'Busca retroalimentación regular sobre tu desempeño',
    ],
    'Gestión del Tiempo': [
      'Utiliza técnicas como Pomodoro o time-blocking',
      'Prioriza tareas usando la matriz de Eisenhower',
      'Elimina o delega tareas de bajo valor',
    ],
    'Planificación': [
      'Crea listas de tareas diarias y semanales',
      'Anticipa obstáculos y planifica cómo superarlos',
      'Revisa y ajusta tus planes regularmente',
    ],
    'Atención al Detalle': [
      'Desarrolla listas de verificación para tareas importantes',
      'Toma pausas antes de revisar tu trabajo',
      'Pide a otros que revisen tu trabajo cuando sea crítico',
    ],
    'Servicio al Cliente': [
      'Practica ponerte en el lugar del cliente',
      'Anticipa necesidades antes de que las expresen',
      'Sigue up con clientes para asegurar satisfacción',
    ],
    'Comunicación Escrita': [
      'Lee más para expandir tu vocabulario',
      'Practica escribir de forma clara y concisa',
      'Pide retroalimentación sobre tus escritos',
    ],
    'Comunicación Verbal': [
      'Practica presentaciones frente a un espejo o grabándote',
      'Escucha activamente y parafrasea para confirmar entendimiento',
      'Participa en grupos de oratoria como Toastmasters',
    ],
    'Influencia': [
      'Entiende las motivaciones de los demás antes de persuadir',
      'Construye credibilidad cumpliendo compromisos',
      'Usa historias y ejemplos para hacer tu punto',
    ],
    'Negociación': [
      'Prepárate thoroughly antes de negociar',
      'Busca soluciones ganar-ganar',
      'Practica técnicas de negociación en situaciones cotidianas',
    ],
    'Presentaciones': [
      'Conoce bien a tu audiencia antes de presentar',
      'Practica tu presentación múltiples veces',
      'Usa visuales efectivos y cuenta historias',
    ],
    'Trabajo en Equipo': [
      'Ofrece ayuda proactivamente a compañeros',
      'Celebra los éxitos del equipo, no solo los individuales',
      'Comunica claramente tus expectativas y compromisos',
    ],
    'Liderazgo': [
      'Busca oportunidades para liderar proyectos pequeños',
      'Desarrolla tu visión y comunícala claramente',
      'Inspira con el ejemplo, no solo con palabras',
    ],
    'Desarrollo de Personas': [
      'Dedica tiempo a mentorear a otros',
      'Ofrece retroalimentación constructiva regularmente',
      'Celebra el crecimiento y éxito de otros',
    ],
    'Gestión de Conflictos': [
      'Aborda conflictos temprano antes de que escalen',
      'Busca entender todas las perspectivas',
      'Enfócate en el problema, no en las personas',
    ],
    'Toma de Decisiones': [
      'Recopila información suficiente pero evita la parálisis por análisis',
      'Considera el impacto a corto y largo plazo',
      'Aprende de decisiones pasadas, tanto buenas como malas',
    ],
    'Pensamiento Estratégico': [
      'Lee sobre tendencias de la industria regularmente',
      'Practica pensar a 3-5 años vista',
      'Conecta acciones diarias con objetivos a largo plazo',
    ],
    'Relaciones': [
      'Invierte tiempo en conocer a las personas genuinamente',
      'Mantén contacto regular con tu red profesional',
      'Ofrece ayuda sin esperar nada a cambio',
    ],
    'Visión de Negocio': [
      'Aprende sobre finanzas y métricas de negocio',
      'Entiende cómo tu rol contribuye a los resultados',
      'Mantente informado sobre la competencia y el mercado',
    ],
    'Orientación a Resultados': [
      'Define métricas claras de éxito para cada proyecto',
      'Monitorea tu progreso regularmente',
      'Elimina actividades que no contribuyen a resultados',
    ],
    'Resiliencia': [
      'Practica técnicas de manejo del estrés',
      'Reencuadra los fracasos como oportunidades de aprendizaje',
      'Construye una red de apoyo sólida',
    ],
    'Responsabilidad': [
      'Cumple siempre lo que prometes',
      'Acepta responsabilidad por errores sin culpar a otros',
      'Comunica proactivamente sobre retrasos o problemas',
    ],
  };
  
  const allTips: string[] = [];
  developmentAreas.forEach((area) => {
    if (tips[area]) {
      allTips.push(...tips[area]);
    }
  });
  
  return allTips.slice(0, 9); // Return max 9 tips
}

/**
 * Get profile description
 */
export function getDNAProfileDescription(profile: string): string {
  const profileEntry = Object.values(DNA_PROFILES).find((p) => p.name === profile);
  return profileEntry?.description || DNA_PROFILES.DEFAULT.description;
}
