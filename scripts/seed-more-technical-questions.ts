import { PrismaClient, TechnicalDifficulty } from '@prisma/client';
import { JOB_POSITIONS, JOB_CATEGORIES, JobCategory } from '../lib/job-positions';

const prisma = new PrismaClient();

interface QuestionData {
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
  difficulty: TechnicalDifficulty;
  category: string;
  categoryEn: string;
}

// Question templates by category - generic questions that work across positions
const QUESTION_TEMPLATES: Record<string, { es: string; en: string; answers: { correct: { es: string; en: string }; wrong: { es: string; en: string }[] }; category: string; categoryEn: string; difficulty: TechnicalDifficulty }[]> = {
  general: [
    { es: '¿Cuál es la mejor práctica para priorizar tareas en {position}?', en: 'What is the best practice for prioritizing tasks in {position}?', answers: { correct: { es: 'Evaluar urgencia e importancia usando matriz de priorización', en: 'Evaluate urgency and importance using prioritization matrix' }, wrong: [{ es: 'Hacer las más fáciles primero', en: 'Do the easiest ones first' }, { es: 'Esperar instrucciones del jefe', en: 'Wait for boss instructions' }, { es: 'Trabajar en orden de llegada', en: 'Work in order of arrival' }] }, category: 'Toma de Decisiones', categoryEn: 'Decision Making', difficulty: 'EASY' },
    { es: 'En {position}, ¿qué habilidad es fundamental para el trabajo en equipo?', en: 'In {position}, what skill is fundamental for teamwork?', answers: { correct: { es: 'Comunicación efectiva y colaboración', en: 'Effective communication and collaboration' }, wrong: [{ es: 'Trabajar de forma independiente', en: 'Working independently' }, { es: 'Evitar conflictos siempre', en: 'Always avoiding conflicts' }, { es: 'Seguir solo sus propias ideas', en: 'Following only your own ideas' }] }, category: 'Habilidades Blandas', categoryEn: 'Soft Skills', difficulty: 'EASY' },
    { es: '¿Cómo debe un {position} manejar un error en su trabajo?', en: 'How should a {position} handle an error in their work?', answers: { correct: { es: 'Identificar, corregir, documentar y aprender del error', en: 'Identify, correct, document, and learn from the error' }, wrong: [{ es: 'Ocultar el error', en: 'Hide the error' }, { es: 'Culpar a otros', en: 'Blame others' }, { es: 'Ignorarlo y continuar', en: 'Ignore it and continue' }] }, category: 'Resolución de Problemas', categoryEn: 'Problem Solving', difficulty: 'MEDIUM' },
    { es: '¿Qué indica un buen desempeño profesional en {position}?', en: 'What indicates good professional performance in {position}?', answers: { correct: { es: 'Cumplir objetivos con calidad y mejora continua', en: 'Meeting objectives with quality and continuous improvement' }, wrong: [{ es: 'Solo cumplir horarios', en: 'Only meeting schedules' }, { es: 'Trabajar muchas horas', en: 'Working many hours' }, { es: 'Evitar responsabilidades extra', en: 'Avoiding extra responsibilities' }] }, category: 'Mejores Prácticas', categoryEn: 'Best Practices', difficulty: 'EASY' },
    { es: 'Como {position}, ¿cuál es la importancia de la documentación?', en: 'As a {position}, what is the importance of documentation?', answers: { correct: { es: 'Facilita continuidad, trazabilidad y transferencia de conocimiento', en: 'Facilitates continuity, traceability, and knowledge transfer' }, wrong: [{ es: 'Solo es requerida por auditorías', en: 'Only required for audits' }, { es: 'No es importante en la práctica', en: 'Not important in practice' }, { es: 'Solo para cumplir normativas', en: 'Only for regulatory compliance' }] }, category: 'Mejores Prácticas', categoryEn: 'Best Practices', difficulty: 'MEDIUM' },
    { es: '¿Cómo debe un {position} gestionar múltiples proyectos simultáneos?', en: 'How should a {position} manage multiple simultaneous projects?', answers: { correct: { es: 'Planificar, establecer prioridades y comunicar avances', en: 'Plan, set priorities, and communicate progress' }, wrong: [{ es: 'Trabajar en todos a la vez sin orden', en: 'Work on all at once without order' }, { es: 'Terminar uno y luego empezar otro', en: 'Finish one then start another' }, { es: 'Delegar todo sin seguimiento', en: 'Delegate everything without follow-up' }] }, category: 'Gestión del Tiempo', categoryEn: 'Time Management', difficulty: 'MEDIUM' },
    { es: 'En una situación de presión como {position}, ¿qué es recomendable?', en: 'In a pressure situation as a {position}, what is recommended?', answers: { correct: { es: 'Mantener la calma, priorizar y buscar apoyo si es necesario', en: 'Stay calm, prioritize, and seek support if needed' }, wrong: [{ es: 'Trabajar más rápido sin pensar', en: 'Work faster without thinking' }, { es: 'Quejarse con el equipo', en: 'Complain to the team' }, { es: 'Abandonar las tareas difíciles', en: 'Abandon difficult tasks' }] }, category: 'Resolución de Problemas', categoryEn: 'Problem Solving', difficulty: 'HARD' },
    { es: '¿Qué importancia tiene la actualización profesional para un {position}?', en: 'How important is professional updating for a {position}?', answers: { correct: { es: 'Es fundamental para mantenerse competitivo y relevante', en: 'It is fundamental to stay competitive and relevant' }, wrong: [{ es: 'Solo es necesaria para ascender', en: 'Only necessary for promotion' }, { es: 'La experiencia es suficiente', en: 'Experience is enough' }, { es: 'No es prioritaria', en: 'It is not a priority' }] }, category: 'Desarrollo Profesional', categoryEn: 'Professional Development', difficulty: 'EASY' },
    { es: 'Un cliente o colega está insatisfecho con el trabajo de un {position}. ¿Qué hacer primero?', en: 'A client or colleague is dissatisfied with a {position}\'s work. What to do first?', answers: { correct: { es: 'Escuchar activamente, comprender el problema y proponer soluciones', en: 'Listen actively, understand the problem, and propose solutions' }, wrong: [{ es: 'Defenderse inmediatamente', en: 'Defend yourself immediately' }, { es: 'Ignorar la queja', en: 'Ignore the complaint' }, { es: 'Transferir el problema a otro', en: 'Transfer the problem to someone else' }] }, category: 'Servicio al Cliente', categoryEn: 'Customer Service', difficulty: 'MEDIUM' },
    { es: '¿Cuál es la responsabilidad ética principal de un {position}?', en: 'What is the main ethical responsibility of a {position}?', answers: { correct: { es: 'Actuar con integridad, honestidad y profesionalismo', en: 'Act with integrity, honesty, and professionalism' }, wrong: [{ es: 'Maximizar ganancias a cualquier costo', en: 'Maximize profits at any cost' }, { es: 'Seguir las instrucciones sin cuestionar', en: 'Follow instructions without questioning' }, { es: 'Priorizar el beneficio personal', en: 'Prioritize personal benefit' }] }, category: 'Ética Profesional', categoryEn: 'Professional Ethics', difficulty: 'MEDIUM' },
    { es: '¿Cómo debe un {position} abordar la innovación en su área?', en: 'How should a {position} approach innovation in their area?', answers: { correct: { es: 'Buscar mejoras continuas y estar abierto a nuevas ideas', en: 'Seek continuous improvements and be open to new ideas' }, wrong: [{ es: 'Mantener los métodos tradicionales', en: 'Maintain traditional methods' }, { es: 'Esperar que otros innoven', en: 'Wait for others to innovate' }, { es: 'Resistir cambios por ser riesgosos', en: 'Resist changes for being risky' }] }, category: 'Innovación', categoryEn: 'Innovation', difficulty: 'HARD' },
    { es: '¿Qué debe hacer un {position} cuando no tiene certeza sobre una decisión?', en: 'What should a {position} do when uncertain about a decision?', answers: { correct: { es: 'Buscar información adicional y consultar con expertos', en: 'Seek additional information and consult with experts' }, wrong: [{ es: 'Tomar la decisión al azar', en: 'Make the decision randomly' }, { es: 'Evitar tomar la decisión', en: 'Avoid making the decision' }, { es: 'Decidir basado solo en intuición', en: 'Decide based only on intuition' }] }, category: 'Toma de Decisiones', categoryEn: 'Decision Making', difficulty: 'HARD' },
    { es: '¿Cuál es el rol de la retroalimentación para un {position}?', en: 'What is the role of feedback for a {position}?', answers: { correct: { es: 'Herramienta para mejorar el desempeño continuamente', en: 'Tool to continuously improve performance' }, wrong: [{ es: 'Solo sirve para críticas', en: 'Only serves for criticism' }, { es: 'Es irrelevante si ya tiene experiencia', en: 'Irrelevant if already experienced' }, { es: 'Solo es útil de jefes', en: 'Only useful from bosses' }] }, category: 'Desarrollo Profesional', categoryEn: 'Professional Development', difficulty: 'EASY' },
  ]
};

// Specific questions by job category
const CATEGORY_SPECIFIC: Partial<Record<JobCategory, { es: string; en: string; answers: { correct: { es: string; en: string }; wrong: { es: string; en: string }[] }; category: string; categoryEn: string; difficulty: TechnicalDifficulty }[]>> = {
  DIRECCION_EJECUTIVA: [
    { es: '¿Qué indicador financiero mide la rentabilidad sobre activos?', en: 'What financial indicator measures return on assets?', answers: { correct: { es: 'ROA (Return on Assets)', en: 'ROA (Return on Assets)' }, wrong: [{ es: 'ROI', en: 'ROI' }, { es: 'EBITDA', en: 'EBITDA' }, { es: 'P/E Ratio', en: 'P/E Ratio' }] }, category: 'Conocimientos Técnicos', categoryEn: 'Technical Knowledge', difficulty: 'MEDIUM' },
    { es: '¿Qué es la estrategia de océano azul?', en: 'What is blue ocean strategy?', answers: { correct: { es: 'Crear nuevos mercados sin competencia directa', en: 'Creating new markets without direct competition' }, wrong: [{ es: 'Competir agresivamente en mercados existentes', en: 'Competing aggressively in existing markets' }, { es: 'Reducir precios al mínimo', en: 'Reducing prices to minimum' }, { es: 'Copiar a líderes del mercado', en: 'Copying market leaders' }] }, category: 'Estrategia', categoryEn: 'Strategy', difficulty: 'HARD' },
  ],
  ADMINISTRACION_FINANZAS: [
    { es: '¿Qué es el estado de flujo de efectivo?', en: 'What is the cash flow statement?', answers: { correct: { es: 'Informe de entradas y salidas de efectivo', en: 'Report of cash inflows and outflows' }, wrong: [{ es: 'Balance de activos', en: 'Asset balance' }, { es: 'Estado de resultados', en: 'Income statement' }, { es: 'Informe de inventario', en: 'Inventory report' }] }, category: 'Conocimientos Técnicos', categoryEn: 'Technical Knowledge', difficulty: 'EASY' },
    { es: '¿Qué es el costo hundido?', en: 'What is sunk cost?', answers: { correct: { es: 'Costo ya incurrido que no se puede recuperar', en: 'Cost already incurred that cannot be recovered' }, wrong: [{ es: 'Costo bajo el agua', en: 'Underwater cost' }, { es: 'Costo oculto', en: 'Hidden cost' }, { es: 'Costo variable', en: 'Variable cost' }] }, category: 'Conocimientos Técnicos', categoryEn: 'Technical Knowledge', difficulty: 'MEDIUM' },
  ],
  RECURSOS_HUMANOS: [
    { es: '¿Qué es la curva de aprendizaje organizacional?', en: 'What is the organizational learning curve?', answers: { correct: { es: 'Tiempo que toma dominar nuevas habilidades o procesos', en: 'Time it takes to master new skills or processes' }, wrong: [{ es: 'Gráfico de calificaciones', en: 'Grades chart' }, { es: 'Curva de salarios', en: 'Salary curve' }, { es: 'Línea de crecimiento', en: 'Growth line' }] }, category: 'Conocimientos Técnicos', categoryEn: 'Technical Knowledge', difficulty: 'MEDIUM' },
  ],
  VENTAS_COMERCIAL: [
    { es: '¿Qué es el embudo de ventas?', en: 'What is the sales funnel?', answers: { correct: { es: 'Modelo de etapas desde prospecto hasta cliente', en: 'Stage model from prospect to customer' }, wrong: [{ es: 'Un utensilio de cocina', en: 'A kitchen utensil' }, { es: 'Un tipo de descuento', en: 'A type of discount' }, { es: 'El almacén de productos', en: 'Product warehouse' }] }, category: 'Conocimientos Técnicos', categoryEn: 'Technical Knowledge', difficulty: 'EASY' },
  ],
  MARKETING_COMUNICACION: [
    { es: '¿Qué es el engagement rate?', en: 'What is engagement rate?', answers: { correct: { es: 'Porcentaje de interacción con el contenido', en: 'Percentage of content interaction' }, wrong: [{ es: 'Tasa de compromiso laboral', en: 'Work commitment rate' }, { es: 'Número de seguidores', en: 'Number of followers' }, { es: 'Costo por clic', en: 'Cost per click' }] }, category: 'Conocimientos Técnicos', categoryEn: 'Technical Knowledge', difficulty: 'EASY' },
  ],
  TECNOLOGIA_IT: [
    { es: '¿Qué es el principio DRY en programación?', en: 'What is the DRY principle in programming?', answers: { correct: { es: 'Don\'t Repeat Yourself - evitar duplicación de código', en: 'Don\'t Repeat Yourself - avoid code duplication' }, wrong: [{ es: 'Secar el código', en: 'Dry the code' }, { es: 'Documento de requisitos', en: 'Requirements document' }, { es: 'Desarrollo rápido', en: 'Rapid development' }] }, category: 'Mejores Prácticas', categoryEn: 'Best Practices', difficulty: 'MEDIUM' },
  ],
  OPERACIONES_PRODUCCION: [
    { es: '¿Qué mide el indicador MTBF?', en: 'What does the MTBF indicator measure?', answers: { correct: { es: 'Tiempo medio entre fallas', en: 'Mean Time Between Failures' }, wrong: [{ es: 'Tiempo de manufactura', en: 'Manufacturing time' }, { es: 'Metros de producción', en: 'Production meters' }, { es: 'Materiales terminados', en: 'Finished materials' }] }, category: 'Conocimientos Técnicos', categoryEn: 'Technical Knowledge', difficulty: 'HARD' },
  ],
  LOGISTICA_CADENA: [
    { es: '¿Qué es el EOQ (Economic Order Quantity)?', en: 'What is EOQ (Economic Order Quantity)?', answers: { correct: { es: 'Cantidad óptima de pedido que minimiza costos totales', en: 'Optimal order quantity that minimizes total costs' }, wrong: [{ es: 'Cantidad de emergencia', en: 'Emergency quantity' }, { es: 'Pedido extraño', en: 'Strange order' }, { es: 'Calidad del equipo', en: 'Equipment quality' }] }, category: 'Conocimientos Técnicos', categoryEn: 'Technical Knowledge', difficulty: 'HARD' },
  ],
  LEGAL_CUMPLIMIENTO: [
    { es: '¿Qué es el principio de legalidad?', en: 'What is the principle of legality?', answers: { correct: { es: 'Solo se puede sancionar lo que la ley expresamente prohíbe', en: 'Only what the law expressly prohibits can be sanctioned' }, wrong: [{ es: 'Cumplir con el jefe', en: 'Complying with the boss' }, { es: 'Ser legal en todo', en: 'Being legal in everything' }, { es: 'Pagar impuestos', en: 'Paying taxes' }] }, category: 'Conocimientos Técnicos', categoryEn: 'Technical Knowledge', difficulty: 'MEDIUM' },
  ],
  SALUD_MEDICINA: [
    { es: '¿Qué significa SOAP en registros médicos?', en: 'What does SOAP mean in medical records?', answers: { correct: { es: 'Subjetivo, Objetivo, Análisis, Plan', en: 'Subjective, Objective, Assessment, Plan' }, wrong: [{ es: 'Un producto de limpieza', en: 'A cleaning product' }, { es: 'Sistema de atención', en: 'Care system' }, { es: 'Software médico', en: 'Medical software' }] }, category: 'Conocimientos Técnicos', categoryEn: 'Technical Knowledge', difficulty: 'MEDIUM' },
  ],
  EDUCACION_FORMACION: [
    { es: '¿Qué son las inteligencias múltiples de Gardner?', en: 'What are Gardner\'s multiple intelligences?', answers: { correct: { es: 'Teoría de que existen diferentes tipos de inteligencia', en: 'Theory that different types of intelligence exist' }, wrong: [{ es: 'IQ muy alto', en: 'Very high IQ' }, { es: 'Saber muchos idiomas', en: 'Knowing many languages' }, { es: 'Inteligencia artificial', en: 'Artificial intelligence' }] }, category: 'Conocimientos Técnicos', categoryEn: 'Technical Knowledge', difficulty: 'MEDIUM' },
  ],
  INGENIERIA: [
    { es: '¿Qué es el método de elementos finitos?', en: 'What is the finite element method?', answers: { correct: { es: 'Técnica numérica para resolver problemas de ingeniería', en: 'Numerical technique for solving engineering problems' }, wrong: [{ es: 'Contar piezas finales', en: 'Counting final pieces' }, { es: 'Método de producción', en: 'Production method' }, { es: 'Proceso de ensamblaje', en: 'Assembly process' }] }, category: 'Conocimientos Técnicos', categoryEn: 'Technical Knowledge', difficulty: 'HARD' },
  ],
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateQuestion(template: typeof QUESTION_TEMPLATES.general[0], positionTitle: string, positionTitleEn: string): QuestionData {
  const questionEs = template.es.replace(/{position}/g, positionTitle);
  const questionEn = template.en.replace(/{position}/g, positionTitleEn);
  
  const wrongAnswers = shuffleArray(template.answers.wrong).slice(0, 3);
  const correctPosition = Math.floor(Math.random() * 4);
  const answerLetters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  
  const options: { es: string; en: string }[] = [];
  let wrongIndex = 0;
  for (let i = 0; i < 4; i++) {
    if (i === correctPosition) {
      options.push(template.answers.correct);
    } else {
      options.push(wrongAnswers[wrongIndex++]);
    }
  }
  
  return {
    questionText: questionEs,
    questionTextEn: questionEn,
    optionA: options[0].es,
    optionB: options[1].es,
    optionC: options[2].es,
    optionD: options[3].es,
    optionAEn: options[0].en,
    optionBEn: options[1].en,
    optionCEn: options[2].en,
    optionDEn: options[3].en,
    correctAnswer: answerLetters[correctPosition],
    difficulty: template.difficulty,
    category: template.category,
    categoryEn: template.categoryEn,
  };
}

async function seedMoreQuestions() {
  console.log('Starting to seed 3000+ more technical questions...');
  
  const positions = JOB_POSITIONS;
  const questionsPerPosition = Math.ceil(3000 / positions.length); // ~13-14 questions per position
  
  let totalCreated = 0;
  const batchSize = 100;
  let batch: any[] = [];
  
  for (const position of positions) {
    // Get existing question count for this position
    const existingCount = await prisma.technicalQuestion.count({
      where: { jobPositionId: position.id }
    });
    
    let questionNumber = existingCount + 1;
    const categoryQuestions = CATEGORY_SPECIFIC[position.category] || [];
    const generalQuestions = QUESTION_TEMPLATES.general;
    
    // Combine templates
    const allTemplates = [...categoryQuestions, ...generalQuestions];
    const shuffledTemplates = shuffleArray(allTemplates);
    
    for (let i = 0; i < questionsPerPosition && i < shuffledTemplates.length; i++) {
      const template = shuffledTemplates[i];
      const questionData = generateQuestion(template, position.title, position.titleEn || position.title);
      
      batch.push({
        jobPositionId: position.id,
        questionNumber: questionNumber++,
        ...questionData,
        weight: 1.0,
      });
      
      if (batch.length >= batchSize) {
        await prisma.technicalQuestion.createMany({ data: batch });
        totalCreated += batch.length;
        console.log(`Created ${totalCreated} questions...`);
        batch = [];
      }
    }
  }
  
  // Insert remaining batch
  if (batch.length > 0) {
    await prisma.technicalQuestion.createMany({ data: batch });
    totalCreated += batch.length;
  }
  
  console.log(`\nCompleted! Total new questions created: ${totalCreated}`);
  
  // Show final stats
  const totalQuestions = await prisma.technicalQuestion.count();
  const positionStats = await prisma.technicalQuestion.groupBy({
    by: ['jobPositionId'],
    _count: { _all: true }
  });
  
  console.log(`\nFinal database stats:`);
  console.log(`Total questions: ${totalQuestions}`);
  console.log(`Positions with questions: ${positionStats.length}`);
}

seedMoreQuestions()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
