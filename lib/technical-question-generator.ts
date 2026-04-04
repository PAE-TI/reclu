import { JOB_POSITIONS, JobPosition, JOB_CATEGORIES } from './job-positions';
import { getZohoDataAnalystQuestions } from './technical-questions';

export interface GeneratedQuestion {
  questionText: string;
  questionTextEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionAEn: string;
  optionBEn: string;
  optionCEn: string;
  optionDEn: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  categoryEn: string;
}

export async function generateQuestionsForPosition(
  jobPositionId: string,
  count: number = 20
): Promise<GeneratedQuestion[]> {
  const position = JOB_POSITIONS.find(p => p.id === jobPositionId);
  
  if (!position) {
    throw new Error(`Job position not found: ${jobPositionId}`);
  }

  if (position.id === 'data_analyst') {
    return generateZohoDataAnalystQuestions(count);
  }

  return generateFallbackQuestions(position, count);
}

function generateZohoDataAnalystQuestions(count: number): GeneratedQuestion[] {
  const baseQuestions = getZohoDataAnalystQuestions();
  const questions = baseQuestions.slice(0, count).map(q => ({
    questionText: q.questionText,
    questionTextEn: q.questionText,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    optionAEn: q.optionA,
    optionBEn: q.optionB,
    optionCEn: q.optionC,
    optionDEn: q.optionD,
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty,
    category: q.category,
    categoryEn: q.category,
  }));

  if (questions.length === count) {
    return questions;
  }

  const fallback = baseQuestions.map(q => ({
    questionText: q.questionText,
    questionTextEn: q.questionText,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    optionAEn: q.optionA,
    optionBEn: q.optionB,
    optionCEn: q.optionC,
    optionDEn: q.optionD,
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty,
    category: q.category,
    categoryEn: q.category,
  }));

  while (questions.length < count) {
    const next = fallback[questions.length % fallback.length];
    questions.push({
      ...next,
      questionText: `${next.questionText} (variante ${questions.length + 1})`,
      questionTextEn: `${next.questionTextEn} (variant ${questions.length + 1})`,
    });
  }

  return questions;
}

function generateFallbackQuestions(position: JobPosition, count: number): GeneratedQuestion[] {
  const categoryInfo = JOB_CATEGORIES[position.category];
  const questions: GeneratedQuestion[] = [];
  
  // Generate 20+ fallback questions specific to common job types
  const templates = getFallbackTemplates(position, categoryInfo);
  
  // Distribution: 15% easy (3), 25% medium (5), 60% hard (12) for 20 questions
  const easyCount = Math.round(count * 0.15);
  const mediumCount = Math.round(count * 0.25);
  
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    // First 3 easy, next 5 medium, remaining 12 hard
    const difficulty: 'EASY' | 'MEDIUM' | 'HARD' = i < easyCount ? 'EASY' : i < (easyCount + mediumCount) ? 'MEDIUM' : 'HARD';
    
    questions.push({
      questionText: template.questionText.replace('{TITLE}', position.title).replace('{CATEGORY}', categoryInfo.name),
      questionTextEn: template.questionTextEn.replace('{TITLE}', position.title).replace('{CATEGORY}', categoryInfo.name),
      optionA: template.optionA,
      optionB: template.optionB,
      optionC: template.optionC,
      optionD: template.optionD,
      optionAEn: template.optionAEn,
      optionBEn: template.optionBEn,
      optionCEn: template.optionCEn,
      optionDEn: template.optionDEn,
      correctAnswer: template.correctAnswer,
      difficulty,
      category: template.category,
      categoryEn: template.categoryEn,
    });
  }
  
  return questions;
}

function getFallbackTemplates(position: JobPosition, categoryInfo: { name: string }): GeneratedQuestion[] {
  return [
    {
      questionText: `¿Cuál es la principal responsabilidad de un/a {TITLE} en el área de {CATEGORY}?`,
      questionTextEn: `What is the main responsibility of a {TITLE} in the {CATEGORY} area?`,
      optionA: 'Planificar, ejecutar y supervisar las actividades del área de manera efectiva',
      optionAEn: 'Plan, execute and supervise area activities effectively',
      optionB: 'Realizar únicamente tareas administrativas básicas',
      optionBEn: 'Perform only basic administrative tasks',
      optionC: 'Delegar todas las responsabilidades a subordinados',
      optionCEn: 'Delegate all responsibilities to subordinates',
      optionD: 'Enfocarse exclusivamente en la documentación',
      optionDEn: 'Focus exclusively on documentation',
      correctAnswer: 'A',
      difficulty: 'EASY',
      category: 'Conocimientos Básicos',
      categoryEn: 'Basic Knowledge',
    },
    {
      questionText: `¿Qué competencia es más crítica para desempeñarse exitosamente como {TITLE}?`,
      questionTextEn: `What competency is most critical to perform successfully as a {TITLE}?`,
      optionA: 'Conocimiento técnico especializado y capacidad de análisis',
      optionAEn: 'Specialized technical knowledge and analytical capacity',
      optionB: 'Únicamente habilidades de comunicación verbal',
      optionBEn: 'Only verbal communication skills',
      optionC: 'Experiencia exclusiva en ventas',
      optionCEn: 'Exclusive sales experience',
      optionD: 'Conocimientos básicos de ofimática',
      optionDEn: 'Basic office software knowledge',
      correctAnswer: 'A',
      difficulty: 'EASY',
      category: 'Habilidades del Cargo',
      categoryEn: 'Job Skills',
    },
    {
      questionText: `Al enfrentar un problema complejo en su área, ¿cuál debería ser el primer paso de un/a {TITLE}?`,
      questionTextEn: `When facing a complex problem in your area, what should be the first step for a {TITLE}?`,
      optionA: 'Analizar la situación, identificar la causa raíz y evaluar opciones de solución',
      optionAEn: 'Analyze the situation, identify the root cause and evaluate solution options',
      optionB: 'Escalar inmediatamente el problema sin intentar solucionarlo',
      optionBEn: 'Immediately escalate the problem without attempting to solve it',
      optionC: 'Ignorar el problema esperando que se resuelva solo',
      optionCEn: 'Ignore the problem hoping it will resolve itself',
      optionD: 'Culpar a otros departamentos por la situación',
      optionDEn: 'Blame other departments for the situation',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Resolución de Problemas',
      categoryEn: 'Problem Solving',
    },
    {
      questionText: `¿Cómo debe manejar un/a {TITLE} un conflicto con un colega o stakeholder?`,
      questionTextEn: `How should a {TITLE} handle a conflict with a colleague or stakeholder?`,
      optionA: 'Buscar una solución colaborativa mediante diálogo profesional y enfocado en resultados',
      optionAEn: 'Seek a collaborative solution through professional dialogue focused on results',
      optionB: 'Evitar completamente a la persona involucrada',
      optionBEn: 'Completely avoid the person involved',
      optionC: 'Escalar directamente a recursos humanos sin intentar resolver',
      optionCEn: 'Directly escalate to HR without attempting to resolve',
      optionD: 'Confrontar públicamente al colega en una reunión',
      optionDEn: 'Publicly confront the colleague in a meeting',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Trabajo en Equipo',
      categoryEn: 'Teamwork',
    },
    {
      questionText: `¿Cuál es la mejor práctica para la gestión del tiempo en el rol de {TITLE}?`,
      questionTextEn: `What is the best practice for time management in the {TITLE} role?`,
      optionA: 'Priorizar tareas según urgencia e importancia, usando métodos de planificación efectivos',
      optionAEn: 'Prioritize tasks by urgency and importance, using effective planning methods',
      optionB: 'Atender todas las solicitudes en orden de llegada sin priorizar',
      optionBEn: 'Address all requests in order of arrival without prioritizing',
      optionC: 'Trabajar únicamente en tareas que son personalmente interesantes',
      optionCEn: 'Work only on tasks that are personally interesting',
      optionD: 'Delegar todas las tareas urgentes a otros',
      optionDEn: 'Delegate all urgent tasks to others',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Mejores Prácticas',
      categoryEn: 'Best Practices',
    },
    {
      questionText: `Cuando se presenta una situación que requiere una decisión urgente, ¿qué debe considerar un/a {TITLE}?`,
      questionTextEn: `When a situation requiring an urgent decision arises, what should a {TITLE} consider?`,
      optionA: 'Evaluar el impacto en stakeholders, recursos disponibles y alineación con objetivos estratégicos',
      optionAEn: 'Evaluate impact on stakeholders, available resources and alignment with strategic objectives',
      optionB: 'Tomar la primera opción disponible sin análisis',
      optionBEn: 'Take the first available option without analysis',
      optionC: 'Postergar la decisión indefinidamente',
      optionCEn: 'Postpone the decision indefinitely',
      optionD: 'Consultar únicamente con colegas cercanos ignorando datos',
      optionDEn: 'Consult only with close colleagues ignoring data',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Toma de Decisiones',
      categoryEn: 'Decision Making',
    },
    {
      questionText: `¿Cómo debe un/a {TITLE} comunicar resultados negativos a la dirección?`,
      questionTextEn: `How should a {TITLE} communicate negative results to management?`,
      optionA: 'Presentar los hechos con claridad, analizar las causas y proponer un plan de acción correctivo',
      optionAEn: 'Present the facts clearly, analyze the causes and propose a corrective action plan',
      optionB: 'Ocultar la información negativa el mayor tiempo posible',
      optionBEn: 'Hide the negative information as long as possible',
      optionC: 'Minimizar la importancia de los resultados',
      optionCEn: 'Minimize the importance of the results',
      optionD: 'Culpar a factores externos sin proponer soluciones',
      optionDEn: 'Blame external factors without proposing solutions',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Comunicación Profesional',
      categoryEn: 'Professional Communication',
    },
    {
      questionText: `En un proyecto con múltiples stakeholders, ¿cómo debe un/a {TITLE} gestionar las expectativas?`,
      questionTextEn: `In a project with multiple stakeholders, how should a {TITLE} manage expectations?`,
      optionA: 'Establecer comunicación clara, definir alcance realista y mantener actualizaciones periódicas',
      optionAEn: 'Establish clear communication, define realistic scope and maintain periodic updates',
      optionB: 'Prometer todo lo que soliciten sin evaluar viabilidad',
      optionBEn: 'Promise everything requested without evaluating feasibility',
      optionC: 'Ignorar a los stakeholders de menor jerarquía',
      optionCEn: 'Ignore stakeholders of lower hierarchy',
      optionD: 'Comunicarse únicamente al final del proyecto',
      optionDEn: 'Communicate only at the end of the project',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Gestión de Proyectos',
      categoryEn: 'Project Management',
    },
    {
      questionText: `¿Qué indicadores debe monitorear principalmente un/a {TITLE} para evaluar su desempeño?`,
      questionTextEn: `What indicators should a {TITLE} primarily monitor to evaluate their performance?`,
      optionA: 'KPIs alineados con objetivos estratégicos, métricas de calidad y eficiencia',
      optionAEn: 'KPIs aligned with strategic objectives, quality and efficiency metrics',
      optionB: 'Únicamente el número de horas trabajadas',
      optionBEn: 'Only the number of hours worked',
      optionC: 'La cantidad de reuniones atendidas',
      optionCEn: 'The number of meetings attended',
      optionD: 'Solo la satisfacción personal con el trabajo',
      optionDEn: 'Only personal satisfaction with work',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Análisis y Datos',
      categoryEn: 'Analysis & Data',
    },
    {
      questionText: `¿Cómo debe un/a {TITLE} mantenerse actualizado en su área profesional?`,
      questionTextEn: `How should a {TITLE} stay updated in their professional area?`,
      optionA: 'Participar en capacitaciones, seguir tendencias del sector y aplicar aprendizaje continuo',
      optionAEn: 'Participate in training, follow industry trends and apply continuous learning',
      optionB: 'Confiar únicamente en la experiencia acumulada',
      optionBEn: 'Rely only on accumulated experience',
      optionC: 'Esperar a que la empresa proporcione toda la formación',
      optionCEn: 'Wait for the company to provide all training',
      optionD: 'Leer únicamente noticias generales ocasionalmente',
      optionDEn: 'Only occasionally read general news',
      correctAnswer: 'A',
      difficulty: 'EASY',
      category: 'Mejores Prácticas',
      categoryEn: 'Best Practices',
    },
    // Add more fallback questions for variety
    {
      questionText: `¿Cuál es el enfoque correcto para la documentación de procesos como {TITLE}?`,
      questionTextEn: `What is the correct approach to process documentation as a {TITLE}?`,
      optionA: 'Mantener documentación actualizada, clara y accesible para el equipo',
      optionAEn: 'Maintain updated, clear and accessible documentation for the team',
      optionB: 'Documentar solo cuando sea obligatorio por auditoría',
      optionBEn: 'Document only when required by audit',
      optionC: 'Guardar la información solo en correos electrónicos',
      optionCEn: 'Store information only in emails',
      optionD: 'Confiar en la memoria del equipo',
      optionDEn: 'Rely on team memory',
      correctAnswer: 'A',
      difficulty: 'EASY',
      category: 'Mejores Prácticas',
      categoryEn: 'Best Practices',
    },
    {
      questionText: `Ante un error cometido en su trabajo, ¿cómo debe actuar un/a {TITLE}?`,
      questionTextEn: `When a mistake is made in their work, how should a {TITLE} act?`,
      optionA: 'Reconocer el error, analizar la causa, implementar corrección y prevenir recurrencia',
      optionAEn: 'Acknowledge the error, analyze the cause, implement correction and prevent recurrence',
      optionB: 'Ocultar el error esperando que nadie lo note',
      optionBEn: 'Hide the error hoping no one notices',
      optionC: 'Culpar a otros por el error cometido',
      optionCEn: 'Blame others for the error made',
      optionD: 'Minimizar la importancia del error ante superiores',
      optionDEn: 'Minimize the importance of the error to superiors',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Resolución de Problemas',
      categoryEn: 'Problem Solving',
    },
    {
      questionText: `¿Cómo debe un/a {TITLE} priorizar cuando tiene múltiples tareas urgentes?`,
      questionTextEn: `How should a {TITLE} prioritize when having multiple urgent tasks?`,
      optionA: 'Evaluar impacto, deadline y recursos, luego crear un plan de ejecución ordenado',
      optionAEn: 'Evaluate impact, deadline and resources, then create an ordered execution plan',
      optionB: 'Trabajar en todas simultáneamente sin terminar ninguna',
      optionBEn: 'Work on all simultaneously without completing any',
      optionC: 'Elegir solo las tareas más fáciles de completar',
      optionCEn: 'Choose only the easiest tasks to complete',
      optionD: 'Esperar a que otros tomen las decisiones',
      optionDEn: 'Wait for others to make the decisions',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Toma de Decisiones',
      categoryEn: 'Decision Making',
    },
    {
      questionText: `¿Qué debe hacer un/a {TITLE} al recibir feedback negativo sobre su trabajo?`,
      questionTextEn: `What should a {TITLE} do when receiving negative feedback about their work?`,
      optionA: 'Escuchar activamente, reflexionar objetivamente y desarrollar un plan de mejora',
      optionAEn: 'Listen actively, reflect objectively and develop an improvement plan',
      optionB: 'Defender su posición sin considerar el feedback',
      optionBEn: 'Defend their position without considering the feedback',
      optionC: 'Ignorar el feedback si proviene de alguien con menos experiencia',
      optionCEn: 'Ignore feedback if it comes from someone with less experience',
      optionD: 'Tomar el feedback como ataque personal',
      optionDEn: 'Take the feedback as a personal attack',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Comunicación Profesional',
      categoryEn: 'Professional Communication',
    },
    {
      questionText: `¿Cómo debe un/a {TITLE} manejar información confidencial?`,
      questionTextEn: `How should a {TITLE} handle confidential information?`,
      optionA: 'Seguir protocolos de seguridad, compartir solo con autorizados y documentar accesos',
      optionAEn: 'Follow security protocols, share only with authorized persons and document access',
      optionB: 'Compartir libremente con colegas de confianza',
      optionBEn: 'Share freely with trusted colleagues',
      optionC: 'Guardar copias personales por seguridad',
      optionCEn: 'Keep personal copies for security',
      optionD: 'Discutir abiertamente en espacios comunes',
      optionDEn: 'Discuss openly in common spaces',
      correctAnswer: 'A',
      difficulty: 'EASY',
      category: 'Normativas y Regulaciones',
      categoryEn: 'Regulations & Compliance',
    },
    {
      questionText: `En una situación de cambio organizacional, ¿cuál es el rol de un/a {TITLE}?`,
      questionTextEn: `In an organizational change situation, what is the role of a {TITLE}?`,
      optionA: 'Ser agente de cambio, comunicar beneficios y apoyar la transición del equipo',
      optionAEn: 'Be a change agent, communicate benefits and support team transition',
      optionB: 'Resistir el cambio hasta que sea absolutamente necesario',
      optionBEn: 'Resist change until absolutely necessary',
      optionC: 'Esperar instrucciones sin tomar iniciativa',
      optionCEn: 'Wait for instructions without taking initiative',
      optionD: 'Criticar abiertamente los cambios frente al equipo',
      optionDEn: 'Openly criticize changes in front of the team',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Liderazgo',
      categoryEn: 'Leadership',
    },
    {
      questionText: `¿Cómo debe un/a {TITLE} colaborar con otros departamentos?`,
      questionTextEn: `How should a {TITLE} collaborate with other departments?`,
      optionA: 'Mantener comunicación proactiva, entender sus necesidades y buscar sinergias',
      optionAEn: 'Maintain proactive communication, understand their needs and seek synergies',
      optionB: 'Trabajar de forma aislada para evitar conflictos',
      optionBEn: 'Work in isolation to avoid conflicts',
      optionC: 'Competir por recursos sin colaborar',
      optionCEn: 'Compete for resources without collaborating',
      optionD: 'Comunicarse solo cuando hay problemas',
      optionDEn: 'Communicate only when there are problems',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Trabajo en Equipo',
      categoryEn: 'Teamwork',
    },
    {
      questionText: `¿Cuál es la mejor estrategia para un/a {TITLE} al presentar una propuesta a la dirección?`,
      questionTextEn: `What is the best strategy for a {TITLE} when presenting a proposal to management?`,
      optionA: 'Preparar análisis de costo-beneficio, anticipar objeciones y presentar alternativas',
      optionAEn: 'Prepare cost-benefit analysis, anticipate objections and present alternatives',
      optionB: 'Presentar solo los aspectos positivos de la propuesta',
      optionBEn: 'Present only the positive aspects of the proposal',
      optionC: 'Solicitar aprobación sin documentación de respaldo',
      optionCEn: 'Request approval without supporting documentation',
      optionD: 'Presionar para aprobación inmediata sin dar tiempo de análisis',
      optionDEn: 'Push for immediate approval without allowing analysis time',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Comunicación Profesional',
      categoryEn: 'Professional Communication',
    },
    {
      questionText: `¿Qué debe hacer un/a {TITLE} para garantizar la calidad de su trabajo?`,
      questionTextEn: `What should a {TITLE} do to ensure the quality of their work?`,
      optionA: 'Implementar revisiones sistemáticas, seguir estándares y solicitar retroalimentación',
      optionAEn: 'Implement systematic reviews, follow standards and request feedback',
      optionB: 'Entregar rápido asumiendo que otros corregirán errores',
      optionBEn: 'Deliver quickly assuming others will correct errors',
      optionC: 'Revisar solo cuando se lo soliciten específicamente',
      optionCEn: 'Review only when specifically requested',
      optionD: 'Confiar en que la experiencia evita errores',
      optionDEn: 'Trust that experience prevents errors',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Mejores Prácticas',
      categoryEn: 'Best Practices',
    },
    {
      questionText: `Ante recursos limitados, ¿cómo debe actuar un/a {TITLE}?`,
      questionTextEn: `When faced with limited resources, how should a {TITLE} act?`,
      optionA: 'Optimizar uso de recursos, priorizar actividades críticas y comunicar restricciones',
      optionAEn: 'Optimize resource use, prioritize critical activities and communicate constraints',
      optionB: 'Solicitar más recursos sin intentar optimizar',
      optionBEn: 'Request more resources without attempting to optimize',
      optionC: 'Reducir calidad para cumplir con los plazos',
      optionCEn: 'Reduce quality to meet deadlines',
      optionD: 'Quejarse sin proponer alternativas',
      optionDEn: 'Complain without proposing alternatives',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Gestión de Proyectos',
      categoryEn: 'Project Management',
    },
  ];
}

export function getPositionById(jobPositionId: string): JobPosition | undefined {
  return JOB_POSITIONS.find(p => p.id === jobPositionId);
}

export function getAllPositions(): JobPosition[] {
  return JOB_POSITIONS;
}
