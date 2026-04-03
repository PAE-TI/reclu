
import { DiscDimension } from '@prisma/client';

export interface DiscResponse {
  questionId: string;
  questionNumber: number;
  selectedOption: DiscDimension;
}

export interface DiscScores {
  scoreD: number;
  scoreI: number;
  scoreS: number;
  scoreC: number;
  percentileD: number;
  percentileI: number;
  percentileS: number;
  percentileC: number;
}

export interface DiscResult extends DiscScores {
  primaryStyle: DiscDimension;
  secondaryStyle?: DiscDimension | null;
  personalityType: string;
  styleIntensity: number;
  isOvershift: boolean;
  isUndershift: boolean;
  isTightPattern: boolean;
}

/**
 * Calcula las puntuaciones DISC basado en las respuestas del usuario
 */
export function calculateDiscScores(responses: DiscResponse[]): DiscResult {
  // Inicializar contadores de puntuaciones
  let scoreD = 0;
  let scoreI = 0;
  let scoreS = 0;
  let scoreC = 0;

  // Contar respuestas por dimensión
  responses.forEach((response) => {
    switch (response.selectedOption) {
      case 'D':
        scoreD++;
        break;
      case 'I':
        scoreI++;
        break;
      case 'S':
        scoreS++;
        break;
      case 'C':
        scoreC++;
        break;
    }
  });

  // Normalizar a percentiles (0-100)
  const totalQuestions = responses.length;
  const percentileD = (scoreD / totalQuestions) * 100;
  const percentileI = (scoreI / totalQuestions) * 100;
  const percentileS = (scoreS / totalQuestions) * 100;
  const percentileC = (scoreC / totalQuestions) * 100;

  // Determinar estilo primario (mayor puntuación)
  const scores = { D: percentileD, I: percentileI, S: percentileS, C: percentileC };
  const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
  
  const primaryStyle = sortedScores[0][0] as DiscDimension;
  const primaryScore = sortedScores[0][1];
  
  // Determinar estilo secundario (si la diferencia es pequeña)
  let secondaryStyle: DiscDimension | null = null;
  const secondaryScore = sortedScores[1][1];
  
  if (primaryScore - secondaryScore < 15) {
    secondaryStyle = sortedScores[1][0] as DiscDimension;
  }

  // Generar tipo de personalidad
  const personalityType = secondaryStyle ? 
    `${primaryStyle}${secondaryStyle}` : primaryStyle;

  // Calcular intensidad del estilo (qué tan marcado es el perfil)
  const variance = calculateVariance([percentileD, percentileI, percentileS, percentileC]);
  const styleIntensity = Math.min(100, variance * 2);

  // Detectar patrones especiales
  const isOvershift = detectOvershift([percentileD, percentileI, percentileS, percentileC]);
  const isUndershift = detectUndershift([percentileD, percentileI, percentileS, percentileC]);
  const isTightPattern = detectTightPattern([percentileD, percentileI, percentileS, percentileC]);

  return {
    scoreD,
    scoreI,
    scoreS,
    scoreC,
    percentileD: Math.round(percentileD * 100) / 100,
    percentileI: Math.round(percentileI * 100) / 100,
    percentileS: Math.round(percentileS * 100) / 100,
    percentileC: Math.round(percentileC * 100) / 100,
    primaryStyle,
    secondaryStyle,
    personalityType,
    styleIntensity: Math.round(styleIntensity * 100) / 100,
    isOvershift,
    isUndershift,
    isTightPattern,
  };
}

/**
 * Calcula la varianza de un array de números
 */
function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((a, b) => a + b) / numbers.length;
  const squaredDifferences = numbers.map(x => Math.pow(x - mean, 2));
  return squaredDifferences.reduce((a, b) => a + b) / numbers.length;
}

/**
 * Detecta patrón de Overshift (puntuaciones muy altas o muy bajas)
 */
function detectOvershift(percentiles: number[]): boolean {
  const extremeCount = percentiles.filter(p => p > 80 || p < 20).length;
  return extremeCount >= 2;
}

/**
 * Detecta patrón de Undershift (falta de consistencia)
 */
function detectUndershift(percentiles: number[]): boolean {
  const variance = calculateVariance(percentiles);
  return variance < 100; // Muy poca variación
}

/**
 * Detecta patrón Tight (todas las puntuaciones cerca del promedio)
 */
function detectTightPattern(percentiles: number[]): boolean {
  return percentiles.every(p => Math.abs(p - 25) < 10);
}

/**
 * Obtiene la interpretación del tipo de personalidad
 */
export function getPersonalityInterpretation(personalityType: string) {
  const interpretations = {
    'D': {
      title: "El Conductor - Dominante",
      description: "Personas orientadas a resultados que aceptan desafíos, toman acciones rápidas y asumen responsabilidades.",
      strengths: ["Liderazgo natural", "Toma decisiones rápidas", "Orientado a resultados", "Acepta desafíos"],
      challenges: ["Puede ser muy directo", "Impaciencia con detalles", "Tendencia a dominar"],
      motivators: ["Desafíos nuevos", "Autoridad y control", "Reconocimiento por logros"],
      stressors: ["Pérdida de control", "Rutinas rígidas", "Análisis excesivo"],
    },
    'I': {
      title: "El Promotor - Influyente",
      description: "Personas extrovertidas y entusiastas que influencian y persuaden a otros.",
      strengths: ["Habilidades de comunicación", "Entusiasmo contagioso", "Persuasión natural", "Optimismo"],
      challenges: ["Puede ser desorganizado", "Tendencia a ser impulsivo", "Dificultad con detalles"],
      motivators: ["Reconocimiento público", "Interacción social", "Variedad en el trabajo"],
      stressors: ["Aislamiento", "Trabajo rutinario", "Crítica personal"],
    },
    'S': {
      title: "El Colaborador - Estable",
      description: "Personas pacientes, leales y orientadas al equipo que valoran la estabilidad y cooperación.",
      strengths: ["Paciencia", "Lealtad", "Habilidades de escucha", "Trabajo en equipo"],
      challenges: ["Resistencia al cambio", "Dificultad para decir 'no'", "Evita conflictos"],
      motivators: ["Estabilidad laboral", "Reconocimiento por contribución", "Ambiente armonioso"],
      stressors: ["Cambios súbitos", "Conflictos interpersonales", "Presión de tiempo"],
    },
    'C': {
      title: "El Analista - Concienzudo",
      description: "Personas analíticas, precisas y orientadas a la calidad que siguen procedimientos establecidos.",
      strengths: ["Atención al detalle", "Análisis sistemático", "Calidad del trabajo", "Precisión"],
      challenges: ["Perfeccionismo excesivo", "Análisis paralítico", "Dificultad con ambigüedad"],
      motivators: ["Estándares de calidad", "Tiempo suficiente", "Reconocimiento por expertise"],
      stressors: ["Fechas límite apretadas", "Cambios inesperados", "Críticas al trabajo"],
    },
    'DI': {
      title: "El Inspirador - Dominante e Influyente",
      description: "Combinación de liderazgo enérgico con habilidades persuasivas. Líderes carismáticos.",
      strengths: ["Liderazgo carismático", "Visión inspiradora", "Habilidades de persuasión", "Energía alta"],
      challenges: ["Puede ser impaciente", "Tendencia a dominar conversaciones", "Dificultad con detalles"],
      motivators: ["Desafíos emocionantes", "Reconocimiento y prestigio", "Oportunidades de liderazgo"],
      stressors: ["Rutinas monótonas", "Micromanagement", "Falta de reconocimiento"],
    },
    'DC': {
      title: "El Solucionador - Dominante y Concienzudo",
      description: "Combinación de orientación a resultados con análisis sistemático. Solucionadores independientes.",
      strengths: ["Análisis objetivo", "Independencia", "Solución eficiente de problemas", "Estándares altos"],
      challenges: ["Puede ser muy crítico", "Resistencia a compromisos", "Tendencia a trabajar solo"],
      motivators: ["Proyectos desafiantes", "Autonomía", "Reconocimiento por expertise"],
      stressors: ["Incompetencia de otros", "Procesos ineficientes", "Decisiones emocionales"],
    },
    'IS': {
      title: "El Consejero - Influyente y Estable",
      description: "Combinación de habilidades interpersonales con paciencia. Excelentes para mantener relaciones.",
      strengths: ["Excelentes relaciones interpersonales", "Habilidades de consejería", "Paciencia", "Lealtad"],
      challenges: ["Evita conflictos necesarios", "Puede ser indeciso", "Dificultad para establecer límites"],
      motivators: ["Relaciones armoniosas", "Reconocimiento por contribución", "Ambiente de equipo"],
      stressors: ["Conflictos interpersonales", "Cambios súbitos", "Crítica personal"],
    },
    'SC': {
      title: "El Especialista - Estable y Concienzudo",
      description: "Combinación de paciencia con precisión. Especialistas confiables enfocados en calidad.",
      strengths: ["Consistencia", "Confiabilidad", "Atención al detalle", "Paciencia"],
      challenges: ["Resistencia al cambio", "Muy cauteloso", "Puede ser lento para decidir"],
      motivators: ["Estabilidad", "Procedimientos claros", "Tiempo suficiente"],
      stressors: ["Cambios inesperados", "Presión de tiempo", "Ambigüedad"],
    },
    'CD': {
      title: "El Perfeccionista - Concienzudo y Dominante",
      description: "Combinación de análisis sistemático con orientación a resultados. Perfeccionistas exigentes.",
      strengths: ["Estándares muy altos", "Análisis crítico", "Orientación a resultados", "Independencia"],
      challenges: ["Perfeccionismo excesivo", "Crítico con otros", "Impaciencia con errores"],
      motivators: ["Proyectos de alta calidad", "Reconocimiento por expertise", "Autonomía"],
      stressors: ["Trabajo de baja calidad", "Decisiones apresuradas", "Incompetencia"],
    },
  };

  return interpretations[personalityType as keyof typeof interpretations] || interpretations['D'];
}
