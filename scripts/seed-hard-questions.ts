import { PrismaClient, TechnicalDifficulty } from '@prisma/client';
import { JOB_POSITIONS } from '../lib/job-positions';

const prisma = new PrismaClient();

// Templates for hard questions - complex scenarios requiring deep expertise
const hardQuestionTemplates = [
  {
    template: (pos: string) => ({
      questionTextEs: `En un escenario donde múltiples sistemas críticos de ${pos} fallan simultáneamente durante un período de alta demanda, ¿cuál sería la estrategia más efectiva para la recuperación y continuidad del negocio?`,
      questionTextEn: `In a scenario where multiple critical ${pos} systems fail simultaneously during a high-demand period, what would be the most effective strategy for recovery and business continuity?`,
      category: 'Crisis Management'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como ${pos} senior, debe diseñar una arquitectura de solución que integre sistemas heredados con nuevas tecnologías emergentes manteniendo la eficiencia operativa. ¿Qué enfoque metodológico aplicaría?`,
      questionTextEn: `As a senior ${pos}, you must design a solution architecture that integrates legacy systems with new emerging technologies while maintaining operational efficiency. What methodological approach would you apply?`,
      category: 'Strategic Planning'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Un cliente estratégico amenaza con terminar un contrato multimillonario debido a problemas recurrentes en su área de ${pos}. Con recursos limitados y plazos ajustados, ¿cómo estructuraría un plan de recuperación?`,
      questionTextEn: `A strategic client threatens to terminate a multi-million dollar contract due to recurring issues in your ${pos} area. With limited resources and tight deadlines, how would you structure a recovery plan?`,
      category: 'Client Relations'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `En el contexto de ${pos}, debe implementar un cambio organizacional significativo que afectará a múltiples departamentos y encontrará resistencia. ¿Cuál es la secuencia óptima de acciones para garantizar una transición exitosa?`,
      questionTextEn: `In the context of ${pos}, you must implement a significant organizational change that will affect multiple departments and encounter resistance. What is the optimal sequence of actions to ensure a successful transition?`,
      category: 'Change Management'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como ${pos}, identifica una oportunidad de mercado disruptiva que requiere pivotar la estrategia actual de la empresa. ¿Cómo presentaría y defendería esta propuesta ante la junta directiva considerando los riesgos asociados?`,
      questionTextEn: `As a ${pos}, you identify a disruptive market opportunity that requires pivoting the company's current strategy. How would you present and defend this proposal to the board of directors considering the associated risks?`,
      category: 'Strategic Innovation'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Se detecta una violación de seguridad de datos en su departamento de ${pos} que potencialmente afecta información sensible de clientes. ¿Cuáles son los pasos críticos en las primeras 24 horas y cómo priorizaría las acciones?`,
      questionTextEn: `A data security breach is detected in your ${pos} department that potentially affects sensitive customer information. What are the critical steps in the first 24 hours and how would you prioritize actions?`,
      category: 'Security & Compliance'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `En su rol de ${pos}, debe optimizar un proceso que involucra múltiples stakeholders con intereses conflictivos y métricas de éxito diferentes. ¿Qué framework de negociación y alineación aplicaría?`,
      questionTextEn: `In your role as ${pos}, you must optimize a process involving multiple stakeholders with conflicting interests and different success metrics. What negotiation and alignment framework would you apply?`,
      category: 'Stakeholder Management'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como líder de ${pos}, enfrenta una situación donde debe reducir el presupuesto en un 30% manteniendo los objetivos de rendimiento. ¿Cómo realizaría el análisis de costo-beneficio y qué criterios usaría para las decisiones de recorte?`,
      questionTextEn: `As a ${pos} leader, you face a situation where you must reduce the budget by 30% while maintaining performance objectives. How would you conduct the cost-benefit analysis and what criteria would you use for cutting decisions?`,
      category: 'Financial Management'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Un competidor acaba de lanzar una innovación disruptiva que amenaza directamente su línea de negocio como ${pos}. Con un plazo de 6 meses para responder, ¿cuál sería su estrategia de contraataque?`,
      questionTextEn: `A competitor has just launched a disruptive innovation that directly threatens your business line as ${pos}. With a 6-month deadline to respond, what would be your counter-attack strategy?`,
      category: 'Competitive Strategy'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `En el área de ${pos}, debe diseñar un sistema de métricas y KPIs que predigan problemas antes de que ocurran, no solo que los reporten después. ¿Qué indicadores adelantados implementaría y cómo los integraría en la toma de decisiones?`,
      questionTextEn: `In the ${pos} area, you must design a metrics and KPI system that predicts problems before they occur, not just reports them afterward. What leading indicators would you implement and how would you integrate them into decision-making?`,
      category: 'Predictive Analytics'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como ${pos}, debe liderar un equipo distribuido globalmente en diferentes zonas horarias con barreras culturales y lingüísticas significativas. ¿Qué modelo de gobernanza y comunicación establecería para maximizar la efectividad?`,
      questionTextEn: `As a ${pos}, you must lead a globally distributed team across different time zones with significant cultural and linguistic barriers. What governance and communication model would you establish to maximize effectiveness?`,
      category: 'Global Leadership'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `En su posición de ${pos}, descubre que un proceso crítico ha estado generando errores sistemáticos durante meses sin ser detectado. ¿Cómo abordaría la remediación, la comunicación a stakeholders y la prevención futura?`,
      questionTextEn: `In your position as ${pos}, you discover that a critical process has been generating systematic errors for months without being detected. How would you approach remediation, stakeholder communication, and future prevention?`,
      category: 'Quality Assurance'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como experto en ${pos}, debe evaluar y seleccionar entre tres proveedores estratégicos que ofrecen soluciones con diferentes fortalezas y debilidades. ¿Qué matriz de decisión multi-criterio aplicaría y cómo ponderaría los factores?`,
      questionTextEn: `As an expert in ${pos}, you must evaluate and select among three strategic vendors offering solutions with different strengths and weaknesses. What multi-criteria decision matrix would you apply and how would you weight the factors?`,
      category: 'Vendor Management'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `En el contexto de ${pos}, debe diseñar un programa de desarrollo de talento que prepare a su equipo para roles que aún no existen debido a la evolución tecnológica. ¿Qué competencias futuras priorizaría y cómo las desarrollaría?`,
      questionTextEn: `In the context of ${pos}, you must design a talent development program that prepares your team for roles that don't yet exist due to technological evolution. What future competencies would you prioritize and how would you develop them?`,
      category: 'Talent Development'
    })
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como ${pos}, debe tomar una decisión crítica con información incompleta y alta incertidumbre que afectará significativamente los resultados del próximo año. ¿Qué framework de toma de decisiones bajo incertidumbre aplicaría?`,
      questionTextEn: `As a ${pos}, you must make a critical decision with incomplete information and high uncertainty that will significantly affect next year's results. What decision-making framework under uncertainty would you apply?`,
      category: 'Decision Making'
    })
  }
];

// Generate 4 options for each question
function generateOptions(category: string): { optionA: { es: string, en: string }, optionB: { es: string, en: string }, optionC: { es: string, en: string }, optionD: { es: string, en: string }, correctAnswer: string } {
  const optionSets: Record<string, any> = {
    'Crisis Management': {
      optionA: { es: 'Activar el plan de continuidad de negocio, priorizar sistemas críticos según impacto en ingresos, establecer comunicación transparente con stakeholders y realizar análisis post-mortem inmediato', en: 'Activate business continuity plan, prioritize critical systems by revenue impact, establish transparent stakeholder communication and conduct immediate post-mortem analysis' },
      optionB: { es: 'Intentar restaurar todos los sistemas simultáneamente para minimizar el tiempo de inactividad total', en: 'Attempt to restore all systems simultaneously to minimize total downtime' },
      optionC: { es: 'Esperar a que el equipo técnico identifique la causa raíz antes de tomar cualquier acción', en: 'Wait for the technical team to identify root cause before taking any action' },
      optionD: { es: 'Escalar inmediatamente a la alta dirección y esperar instrucciones', en: 'Immediately escalate to senior management and wait for instructions' },
      correctAnswer: 'A'
    },
    'Strategic Planning': {
      optionA: { es: 'Implementar todo de una vez para reducir el tiempo de transición', en: 'Implement everything at once to reduce transition time' },
      optionB: { es: 'Aplicar arquitectura de capas con APIs de abstracción, migración incremental con feature flags, y establecer métricas de paridad funcional antes de descomisionar sistemas legados', en: 'Apply layered architecture with abstraction APIs, incremental migration with feature flags, and establish functional parity metrics before decommissioning legacy systems' },
      optionC: { es: 'Reemplazar completamente los sistemas heredados con nuevas soluciones', en: 'Completely replace legacy systems with new solutions' },
      optionD: { es: 'Mantener los sistemas paralelos indefinidamente para evitar riesgos', en: 'Maintain parallel systems indefinitely to avoid risks' },
      correctAnswer: 'B'
    },
    'Client Relations': {
      optionA: { es: 'Ofrecer descuentos significativos para retener al cliente', en: 'Offer significant discounts to retain the client' },
      optionB: { es: 'Transferir la cuenta a otro equipo con mejor historial', en: 'Transfer the account to another team with better track record' },
      optionC: { es: 'Implementar war room con equipo dedicado, establecer SLAs revisados con penalidades, crear dashboard de transparencia para el cliente y programar revisiones ejecutivas semanales', en: 'Implement war room with dedicated team, establish revised SLAs with penalties, create transparency dashboard for client and schedule weekly executive reviews' },
      optionD: { es: 'Documentar los problemas y prepararse para la posible pérdida del contrato', en: 'Document the issues and prepare for possible contract loss' },
      correctAnswer: 'C'
    },
    'Change Management': {
      optionA: { es: 'Anunciar el cambio y establecer una fecha límite para la implementación', en: 'Announce the change and set a deadline for implementation' },
      optionB: { es: 'Comenzar con un piloto pequeño y expandir gradualmente', en: 'Start with a small pilot and expand gradually' },
      optionC: { es: 'Delegar la implementación a cada departamento para que adapten el cambio a sus necesidades', en: 'Delegate implementation to each department to adapt the change to their needs' },
      optionD: { es: 'Crear coalición de líderes de opinión, diseñar comunicación segmentada por audiencia, establecer quick wins visibles, implementar feedback loops continuos y celebrar hitos de adopción', en: 'Create coalition of opinion leaders, design audience-segmented communication, establish visible quick wins, implement continuous feedback loops and celebrate adoption milestones' },
      correctAnswer: 'D'
    },
    'Strategic Innovation': {
      optionA: { es: 'Presentar solo los beneficios potenciales para generar entusiasmo', en: 'Present only potential benefits to generate enthusiasm' },
      optionB: { es: 'Construir business case con análisis de escenarios, identificar early adopters internos para validación, proponer inversión por fases con gates de decisión y presentar estrategia de mitigación de riesgos con plan de reversión', en: 'Build business case with scenario analysis, identify internal early adopters for validation, propose phased investment with decision gates and present risk mitigation strategy with rollback plan' },
      optionC: { es: 'Esperar a que el mercado madure antes de proponer cambios significativos', en: 'Wait for the market to mature before proposing significant changes' },
      optionD: { es: 'Implementar el cambio primero y pedir perdón después si no funciona', en: 'Implement the change first and ask forgiveness later if it doesn\'t work' },
      correctAnswer: 'B'
    },
    'Security & Compliance': {
      optionA: { es: 'Activar protocolo de respuesta a incidentes, aislar sistemas afectados, notificar a autoridades regulatorias según requerimientos legales, establecer comunicación proactiva con clientes afectados y contratar forense digital externo', en: 'Activate incident response protocol, isolate affected systems, notify regulatory authorities per legal requirements, establish proactive communication with affected customers and hire external digital forensics' },
      optionB: { es: 'Investigar internamente antes de notificar a cualquier parte externa', en: 'Investigate internally before notifying any external party' },
      optionC: { es: 'Minimizar el alcance del incidente en las comunicaciones para evitar pánico', en: 'Minimize incident scope in communications to avoid panic' },
      optionD: { es: 'Restaurar sistemas desde backup y continuar operaciones normalmente', en: 'Restore systems from backup and continue normal operations' },
      correctAnswer: 'A'
    },
    'Stakeholder Management': {
      optionA: { es: 'Priorizar los intereses del stakeholder con mayor poder jerárquico', en: 'Prioritize interests of stakeholder with highest hierarchical power' },
      optionB: { es: 'Buscar un compromiso que satisfaga parcialmente a todos', en: 'Seek a compromise that partially satisfies everyone' },
      optionC: { es: 'Aplicar análisis de stakeholders con matriz poder-interés, facilitar sesiones de co-diseño para alinear objetivos, establecer métricas compartidas de éxito y crear governance board con representación balanceada', en: 'Apply stakeholder analysis with power-interest matrix, facilitate co-design sessions to align objectives, establish shared success metrics and create governance board with balanced representation' },
      optionD: { es: 'Escalar las decisiones conflictivas a un nivel superior para arbitraje', en: 'Escalate conflicting decisions to higher level for arbitration' },
      correctAnswer: 'C'
    },
    'Financial Management': {
      optionA: { es: 'Aplicar recortes uniformes del 30% en todas las áreas', en: 'Apply uniform 30% cuts across all areas' },
      optionB: { es: 'Eliminar primero los proyectos más recientes que aún no muestran ROI', en: 'First eliminate most recent projects that don\'t yet show ROI' },
      optionC: { es: 'Reducir personal como primera medida de ahorro', en: 'Reduce staff as first savings measure' },
      optionD: { es: 'Realizar análisis ABC de costos, aplicar zero-based budgeting, priorizar inversiones por ROI ajustado al riesgo, negociar con proveedores y explorar modelos operativos alternativos', en: 'Conduct ABC cost analysis, apply zero-based budgeting, prioritize investments by risk-adjusted ROI, negotiate with vendors and explore alternative operating models' },
      correctAnswer: 'D'
    },
    'Competitive Strategy': {
      optionA: { es: 'Copiar la innovación del competidor lo más rápido posible', en: 'Copy competitor\'s innovation as quickly as possible' },
      optionB: { es: 'Analizar diferenciadores propios, identificar segmentos donde la innovación competidora es menos relevante, desarrollar contra-narrativa de valor y acelerar roadmap de innovación propia con enfoque en fortalezas distintivas', en: 'Analyze own differentiators, identify segments where competitive innovation is less relevant, develop counter-value narrative and accelerate own innovation roadmap focusing on distinctive strengths' },
      optionC: { es: 'Reducir precios agresivamente para retener cuota de mercado', en: 'Aggressively reduce prices to retain market share' },
      optionD: { es: 'Esperar a ver cómo responde el mercado antes de actuar', en: 'Wait to see how the market responds before acting' },
      correctAnswer: 'B'
    },
    'Predictive Analytics': {
      optionA: { es: 'Implementar dashboards en tiempo real con todos los datos disponibles', en: 'Implement real-time dashboards with all available data' },
      optionB: { es: 'Contratar un equipo de data science para crear modelos predictivos', en: 'Hire a data science team to create predictive models' },
      optionC: { es: 'Diseñar leading indicators basados en correlaciones históricas, implementar alertas tempranas con umbrales dinámicos, crear modelos de propensión para eventos críticos e integrar predicciones en workflows de decisión automatizados', en: 'Design leading indicators based on historical correlations, implement early alerts with dynamic thresholds, create propensity models for critical events and integrate predictions into automated decision workflows' },
      optionD: { es: 'Aumentar la frecuencia de reporting de métricas existentes', en: 'Increase reporting frequency of existing metrics' },
      correctAnswer: 'C'
    },
    'Global Leadership': {
      optionA: { es: 'Establecer una zona horaria común para todas las reuniones de equipo', en: 'Establish a common time zone for all team meetings' },
      optionB: { es: 'Delegar completamente a líderes locales en cada región', en: 'Fully delegate to local leaders in each region' },
      optionC: { es: 'Usar principalmente comunicación asíncrona para respetar zonas horarias', en: 'Use primarily asynchronous communication to respect time zones' },
      optionD: { es: 'Implementar modelo follow-the-sun con handoffs estructurados, crear cultural playbook para el equipo, establecer rituales de conexión que roten por zonas horarias y usar herramientas de colaboración asíncrona con documentation-first culture', en: 'Implement follow-the-sun model with structured handoffs, create cultural playbook for team, establish connection rituals that rotate across time zones and use async collaboration tools with documentation-first culture' },
      correctAnswer: 'D'
    },
    'Quality Assurance': {
      optionA: { es: 'Corregir los errores silenciosamente para no alarmar a los stakeholders', en: 'Silently correct errors to not alarm stakeholders' },
      optionB: { es: 'Cuantificar impacto total, establecer comunicación transparente con stakeholders afectados, implementar remediación priorizada por severidad, diseñar controles preventivos multicapa y crear proceso de detección temprana', en: 'Quantify total impact, establish transparent communication with affected stakeholders, implement remediation prioritized by severity, design multi-layer preventive controls and create early detection process' },
      optionC: { es: 'Identificar y despedir a los responsables del error', en: 'Identify and terminate those responsible for the error' },
      optionD: { es: 'Implementar más checkpoints de revisión en el proceso', en: 'Implement more review checkpoints in the process' },
      correctAnswer: 'B'
    },
    'Vendor Management': {
      optionA: { es: 'Seleccionar al proveedor con el precio más bajo que cumpla requisitos mínimos', en: 'Select vendor with lowest price meeting minimum requirements' },
      optionB: { es: 'Elegir al proveedor más grande y establecido del mercado', en: 'Choose the largest and most established vendor in the market' },
      optionC: { es: 'Aplicar weighted scoring model con criterios técnicos, financieros, estratégicos y de riesgo; realizar due diligence con referencias de clientes similares; negociar términos de salida y SLAs; y establecer período de prueba con métricas de éxito', en: 'Apply weighted scoring model with technical, financial, strategic and risk criteria; conduct due diligence with similar customer references; negotiate exit terms and SLAs; and establish trial period with success metrics' },
      optionD: { es: 'Dividir el contrato entre múltiples proveedores para reducir riesgo', en: 'Split contract among multiple vendors to reduce risk' },
      correctAnswer: 'C'
    },
    'Talent Development': {
      optionA: { es: 'Enviar al equipo a cursos de certificación en tecnologías actuales', en: 'Send team to certification courses in current technologies' },
      optionB: { es: 'Contratar nuevos talentos con habilidades emergentes', en: 'Hire new talent with emerging skills' },
      optionC: { es: 'Esperar a que las necesidades se clarifiquen antes de invertir en formación', en: 'Wait for needs to clarify before investing in training' },
      optionD: { es: 'Identificar meta-competencias transferibles, crear learning paths personalizados con exposure a tecnologías emergentes, establecer rotation programs y mentoring cruzado, y fomentar proyectos de innovación como laboratorio de aprendizaje', en: 'Identify transferable meta-competencies, create personalized learning paths with exposure to emerging technologies, establish rotation programs and cross-mentoring, and foster innovation projects as learning laboratory' },
      correctAnswer: 'D'
    },
    'Decision Making': {
      optionA: { es: 'Aplicar framework de opciones reales con múltiples escenarios, identificar señales de validación temprana, diseñar decisión reversible cuando sea posible, establecer criterios de pivote predefinidos y documentar supuestos para revisión futura', en: 'Apply real options framework with multiple scenarios, identify early validation signals, design reversible decision when possible, establish predefined pivot criteria and document assumptions for future review' },
      optionB: { es: 'Esperar hasta tener más información disponible', en: 'Wait until more information is available' },
      optionC: { es: 'Confiar en la intuición basada en experiencia previa', en: 'Trust intuition based on prior experience' },
      optionD: { es: 'Delegar la decisión a un comité para distribuir la responsabilidad', en: 'Delegate decision to a committee to distribute responsibility' },
      correctAnswer: 'A'
    }
  };

  return optionSets[category] || optionSets['Decision Making'];
}

async function seedHardQuestions() {
  console.log('🚀 Starting to seed 15 HARD questions per job position...');
  
  let totalCreated = 0;
  
  console.log(`📊 Total positions: ${JOB_POSITIONS.length}`);
  console.log(`📊 Questions per position: 15`);
  console.log(`📊 Expected total: ${JOB_POSITIONS.length * 15}`);
  
  for (const position of JOB_POSITIONS) {
    // Get the current max question number for this position
    const maxQuestion = await prisma.technicalQuestion.findFirst({
      where: { jobPositionId: position.id },
      orderBy: { questionNumber: 'desc' },
      select: { questionNumber: true }
    });
    
    let nextQuestionNumber = (maxQuestion?.questionNumber || 0) + 1;
    const questionsToCreate = [];
    
    // Generate 15 hard questions for this position
    for (let i = 0; i < 15; i++) {
      const template = hardQuestionTemplates[i];
      const questionData = template.template(position.title);
      const options = generateOptions(questionData.category);
      
      questionsToCreate.push({
        questionNumber: nextQuestionNumber++,
        jobPositionId: position.id,
        questionText: questionData.questionTextEs,
        questionTextEn: questionData.questionTextEn,
        optionA: options.optionA.es,
        optionAEn: options.optionA.en,
        optionB: options.optionB.es,
        optionBEn: options.optionB.en,
        optionC: options.optionC.es,
        optionCEn: options.optionC.en,
        optionD: options.optionD.es,
        optionDEn: options.optionD.en,
        correctAnswer: options.correctAnswer,
        difficulty: TechnicalDifficulty.HARD,
        category: questionData.category,
        weight: 1.5 // Higher weight for hard questions
      });
    }
    
    // Batch create questions for this position
    await prisma.technicalQuestion.createMany({
      data: questionsToCreate
    });
    
    totalCreated += questionsToCreate.length;
    
    if (totalCreated % 300 === 0) {
      console.log(`✅ Progress: ${totalCreated} questions created...`);
    }
  }
  
  console.log(`\n🎉 Successfully created ${totalCreated} HARD questions!`);
  
  // Show final statistics
  const stats = await prisma.technicalQuestion.groupBy({
    by: ['difficulty'],
    _count: true
  });
  
  console.log('\n📈 Final question distribution by difficulty:');
  stats.forEach(s => {
    console.log(`   ${s.difficulty}: ${s._count} questions`);
  });
  
  const total = await prisma.technicalQuestion.count();
  console.log(`\n📊 Total questions in database: ${total}`);
}

seedHardQuestions()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
