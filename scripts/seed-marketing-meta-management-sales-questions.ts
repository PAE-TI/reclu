import { PrismaClient, TechnicalDifficulty } from '@prisma/client';
import dotenv from 'dotenv';
import { JOB_POSITIONS } from '../lib/job-positions';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

type Difficulty = TechnicalDifficulty;

type GeneratedQuestion = {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  difficulty: Difficulty;
  category: string;
};

type SeedQuestion = GeneratedQuestion & {
  questionTextEn: string;
  optionAEn: string;
  optionBEn: string;
  optionCEn: string;
  optionDEn: string;
  categoryEn: string;
};

type Topic = {
  category: string;
  tool: string;
  focus: string;
  goal: string;
  problem: string;
  outcome: string;
  metric: string;
  correctPractice: string;
};

const STANDARD_WRONGS = [
  'Hacerlo sin métricas ni trazabilidad.',
  'Copiar tácticas sin adaptarlas al contexto.',
  'Priorizar velocidad sobre control y aprendizaje.',
] as const;

const SALES_WRONGS = [
  'Vender sin discovery ni seguimiento estructurado.',
  'Priorizar volumen sobre calidad del pipeline.',
  'Cerrar sin entender el problema real del cliente.',
] as const;

const STRATEGIC_PROMPTS = [
  (topic: Topic) => `En ${topic.tool}, ¿qué práctica es más correcta para ${topic.focus}?`,
  (topic: Topic) => `Si el objetivo es ${topic.goal}, ¿qué decisión priorizarías en ${topic.tool}?`,
  (topic: Topic) => `Ante el problema de ${topic.problem}, ¿cuál es la respuesta más profesional?`,
  (topic: Topic) => `Para asegurar ${topic.outcome}, ¿qué control deberías implementar?`,
  (topic: Topic) => `¿Qué acción protege mejor ${topic.metric} en este contexto?`,
  (topic: Topic) => `¿Qué enfoque mantendría mejor la consistencia al trabajar con ${topic.tool}?`,
  (topic: Topic) => `¿Qué paso evitaría un error recurrente relacionado con ${topic.focus}?`,
  (topic: Topic) => `¿Qué decisión aporta más trazabilidad y control sobre ${topic.problem}?`,
  (topic: Topic) => `¿Qué práctica ayuda más a sostener ${topic.outcome}?`,
  (topic: Topic) => `¿Qué ajuste reduce mejor el riesgo al trabajar con ${topic.tool}?`,
] as const;

const SALES_PROMPTS = [
  (topic: Topic) => `En una operación comercial moderna, ¿qué práctica es más correcta para ${topic.focus}?`,
  (topic: Topic) => `Si el objetivo es ${topic.goal}, ¿qué decisión priorizarías para el equipo de ventas?`,
  (topic: Topic) => `Ante el problema de ${topic.problem}, ¿cuál es la respuesta más profesional?`,
  (topic: Topic) => `Para asegurar ${topic.outcome}, ¿qué control deberías reforzar en el pipeline?`,
  (topic: Topic) => `¿Qué acción protege mejor ${topic.metric} en un equipo de setters y closers?`,
  (topic: Topic) => `Cuando una oportunidad avanza, ¿qué práctica evita perder el foco en ${topic.focus}?`,
  (topic: Topic) => `Si el lead se enfría, ¿qué rutina ayuda más a recuperarlo?`,
  (topic: Topic) => `¿Qué decisión mejora la calidad del follow-up y la conversión?`,
  (topic: Topic) => `¿Qué rutina da más visibilidad al forecast y al CRM?`,
  (topic: Topic) => `¿Qué ajuste reduce mejor la fricción en el cierre comercial?`,
] as const;

const HIGH_DIFFICULTY_RATIO: Difficulty[] = [
  'EASY',
  'MEDIUM',
  'HARD',
  'HARD',
  'HARD',
  'HARD',
  'HARD',
  'HARD',
  'HARD',
  'HARD',
];

function rotateOptions(
  correct: string,
  wrongs: readonly [string, string, string],
  rotation: number
): { optionA: string; optionB: string; optionC: string; optionD: string; correctAnswer: 'A' | 'B' | 'C' | 'D' } {
  const options = [correct, ...wrongs];
  const normalized = rotation % options.length;
  const rotated = [...options.slice(normalized), ...options.slice(0, normalized)];
  const correctIndex = rotated.indexOf(correct);
  return {
    optionA: rotated[0],
    optionB: rotated[1],
    optionC: rotated[2],
    optionD: rotated[3],
    correctAnswer: ['A', 'B', 'C', 'D'][correctIndex] as 'A' | 'B' | 'C' | 'D',
  };
}

function buildBank(
  topics: Topic[],
  prompts: readonly ((topic: Topic) => string)[],
  wrongs: readonly [string, string, string],
  correctPracticeSuffix: string = ''
): GeneratedQuestion[] {
  return topics.flatMap((topic, topicIndex) =>
    prompts.map((promptFn, promptIndex) => {
      const prompt = promptFn(topic);
      const difficulty = HIGH_DIFFICULTY_RATIO[promptIndex] || 'HARD';
      const { optionA, optionB, optionC, optionD, correctAnswer } = rotateOptions(
        `${topic.correctPractice}${correctPracticeSuffix}`.trim(),
        wrongs,
        topicIndex + promptIndex
      );

      return {
        questionText: prompt,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        difficulty,
        category: topic.category,
      };
    })
  );
}

const AI_MARKETING_TOPICS: Topic[] = [
  {
    category: 'IA en Marketing - Estrategia',
    tool: 'IA aplicada al marketing',
    focus: 'definir campañas con contexto comercial y datos',
    goal: 'priorizar mensajes y audiencias con mejor probabilidad de conversión',
    problem: 'se generan piezas creativas sin una estrategia clara detrás',
    outcome: 'alinear creatividad, segmentación y objetivo de negocio',
    metric: 'la calidad de conversión por segmento',
    correctPractice: 'Usar IA para apoyar la estrategia, no para reemplazarla, validando mensajes con datos reales.',
  },
  {
    category: 'IA en Marketing - Segmentación',
    tool: 'IA aplicada al marketing',
    focus: 'segmentar audiencias y personalizar mensajes',
    goal: 'mejorar relevancia y respuesta por segmento',
    problem: 'la misma propuesta se envía a toda la base sin ajuste',
    outcome: 'aumentar la precisión de la comunicación',
    metric: 'la conversión por audiencia',
    correctPractice: 'Usar IA para detectar patrones de comportamiento y adaptar mensajes por intención y etapa.',
  },
  {
    category: 'IA en Marketing - Contenido',
    tool: 'IA aplicada al marketing',
    focus: 'crear contenido con tono de marca consistente',
    goal: 'producir más piezas sin perder calidad',
    problem: 'el equipo publica contenido rápido pero inconsistente',
    outcome: 'mantener una voz homogénea y profesional',
    metric: 'la coherencia de marca y el engagement',
    correctPractice: 'Usar IA con guías de tono, ejemplos aprobados y revisión editorial antes de publicar.',
  },
  {
    category: 'IA en Marketing - Automatización',
    tool: 'IA aplicada al marketing',
    focus: 'automatizar flujos de nurturing y follow-up',
    goal: 'reducir tiempos operativos y mantener continuidad comercial',
    problem: 'se pierden leads por falta de seguimiento',
    outcome: 'activar secuencias inteligentes según comportamiento',
    metric: 'la tasa de respuesta y velocidad de contacto',
    correctPractice: 'Combinar IA con reglas de automatización y validación de disparadores por comportamiento real.',
  },
  {
    category: 'IA en Marketing - Analítica',
    tool: 'IA aplicada al marketing',
    focus: 'interpretar métricas y detectar oportunidades',
    goal: 'tomar decisiones con menos sesgo y más evidencia',
    problem: 'hay demasiado dato y poca lectura accionable',
    outcome: 'convertir métricas en decisiones de negocio',
    metric: 'la precisión del análisis y la velocidad de acción',
    correctPractice: 'Usar IA para resumir patrones, pero validar siempre con fuentes y contexto de negocio.',
  },
  {
    category: 'IA en Marketing - Lead Scoring',
    tool: 'IA aplicada al marketing',
    focus: 'calificar leads con señales de intención',
    goal: 'enviar mejores oportunidades al equipo comercial',
    problem: 'el scoring manual no refleja el comportamiento real',
    outcome: 'priorizar contactos con mayor potencial',
    metric: 'la conversión de MQL a SQL',
    correctPractice: 'Entrenar el scoring con comportamiento histórico y revisar periódicamente los pesos de intención.',
  },
  {
    category: 'IA en Marketing - Experimentos',
    tool: 'IA aplicada al marketing',
    focus: 'probar variantes creativas y de mensaje',
    goal: 'mejorar performance sin perder control experimental',
    problem: 'se lanzan cambios sin pruebas comparables',
    outcome: 'aprender de cada iteración con evidencia',
    metric: 'la tasa de mejora por experimento',
    correctPractice: 'Usar IA para proponer hipótesis, pero medir resultados con experimentos controlados.',
  },
  {
    category: 'IA en Marketing - Marca',
    tool: 'IA aplicada al marketing',
    focus: 'proteger la identidad y el tono de marca',
    goal: 'escalar producción sin erosionar percepción',
    problem: 'las piezas generadas suenan genéricas o fuera de marca',
    outcome: 'mantener consistencia y confianza',
    metric: 'la alineación de tono y posicionamiento',
    correctPractice: 'Definir guardrails de marca, ejemplos aprobados y revisión humana antes de publicar.',
  },
  {
    category: 'IA en Marketing - Lifecycle',
    tool: 'IA aplicada al marketing',
    focus: 'orquestar mensajes según etapa del ciclo',
    goal: 'mejorar activación, conversión y retención',
    problem: 'el mismo mensaje se usa en todo el journey',
    outcome: 'personalizar la comunicación por etapa',
    metric: 'la retención y el valor por ciclo',
    correctPractice: 'Diseñar mensajes y secuencias por etapa del lifecycle con señales de intención reales.',
  },
  {
    category: 'IA en Marketing - Gobernanza',
    tool: 'IA aplicada al marketing',
    focus: 'controlar calidad, privacidad y uso responsable',
    goal: 'evitar riesgos de marca y cumplimiento',
    problem: 'se usan herramientas de IA sin lineamientos claros',
    outcome: 'operar con trazabilidad y control',
    metric: 'la reducción de errores y exposición de riesgo',
    correctPractice: 'Establecer políticas de uso, revisión y control de datos para cada flujo de IA.',
  },
];

const META_MARKETING_TOPICS: Topic[] = [
  {
    category: 'META - Estructura de Campañas',
    tool: 'Meta Ads',
    focus: 'organizar campañas, conjuntos y anuncios',
    goal: 'mantener control de presupuesto y aprendizaje',
    problem: 'se mezclan objetivos distintos en una sola campaña',
    outcome: 'separar claramente prospecting, retargeting y testing',
    metric: 'la lectura correcta del rendimiento',
    correctPractice: 'Estructurar campañas por objetivo y etapa del funnel para analizar resultados con claridad.',
  },
  {
    category: 'META - Pixel y CAPI',
    tool: 'Meta Ads',
    focus: 'medir conversiones de forma confiable',
    goal: 'reducir pérdida de señal por cambios de privacidad',
    problem: 'las conversiones se atribuyen de forma incompleta',
    outcome: 'mejorar la calidad de medición',
    metric: 'la cobertura de eventos y atribución',
    correctPractice: 'Combinar Pixel, CAPI y validación de eventos para mejorar la calidad de datos.',
  },
  {
    category: 'META - Creativos',
    tool: 'Meta Ads',
    focus: 'probar anuncios y mensajes visuales',
    goal: 'evitar fatiga creativa y mejorar CTR',
    problem: 'las piezas pierden rendimiento rápidamente',
    outcome: 'rotar creatividades de forma inteligente',
    metric: 'el CTR y el costo por resultado',
    correctPractice: 'Planificar ciclos de creatividad con testing y refresh antes de que se deteriore el rendimiento.',
  },
  {
    category: 'META - Audiencias',
    tool: 'Meta Ads',
    focus: 'segmentar con precisión por intención y comportamiento',
    goal: 'encontrar audiencias con mejor probabilidad de conversión',
    problem: 'se usan públicos demasiado amplios o genéricos',
    outcome: 'priorizar señales fuertes y lookalikes útiles',
    metric: 'la conversión por audiencia',
    correctPractice: 'Construir audiencias por comportamiento real, fuentes de calidad y exclusiones bien definidas.',
  },
  {
    category: 'META - Retargeting',
    tool: 'Meta Ads',
    focus: 'recuperar usuarios que ya interactuaron',
    goal: 'aumentar conversión de tráfico ya tibio',
    problem: 'se hace retargeting a todos sin distinguir intención',
    outcome: 'activar mensajes según nivel de interacción',
    metric: 'la tasa de conversión de remarketing',
    correctPractice: 'Segmentar retargeting por eventos y recencia para evitar saturación y desperdicio de presupuesto.',
  },
  {
    category: 'META - WhatsApp',
    tool: 'WhatsApp Business y Meta Ads',
    focus: 'convertir conversaciones en oportunidades',
    goal: 'acelerar respuesta y cierre comercial',
    problem: 'los chats se quedan sin seguimiento o contexto',
    outcome: 'entregar leads calificados al equipo correcto',
    metric: 'la velocidad de respuesta y la tasa de cierre',
    correctPractice: 'Conectar formularios, WhatsApp y CRM con reglas claras de routing y seguimiento.',
  },
  {
    category: 'META - Lead Ads',
    tool: 'Meta Ads',
    focus: 'capturar leads con formularios nativos',
    goal: 'reducir fricción en la generación de demanda',
    problem: 'los formularios traen volumen pero poca calidad',
    outcome: 'equilibrar facilidad de captura y calidad',
    metric: 'la tasa de contacto efectivo',
    correctPractice: 'Diseñar formularios con campos estratégicos y validación posterior de calidad.',
  },
  {
    category: 'META - Instagram',
    tool: 'Instagram y Meta Ads',
    focus: 'aprovechar reels, stories y contenido nativo',
    goal: 'mejorar alcance y atención en móvil',
    problem: 'las piezas parecen anuncios tradicionales y se ignoran',
    outcome: 'lograr anuncios nativos y atractivos',
    metric: 'la retención y el engagement',
    correctPractice: 'Adaptar el creativo al formato y comportamiento de consumo de Instagram.',
  },
  {
    category: 'META - Bidding',
    tool: 'Meta Ads',
    focus: 'asignar presupuesto y pujas con disciplina',
    goal: 'optimizar costo por resultado',
    problem: 'se cambia la puja sin suficiente volumen para aprender',
    outcome: 'estabilizar performance sin destruir aprendizaje',
    metric: 'el costo por adquisición',
    correctPractice: 'Ajustar presupuesto y bidding con ventanas de aprendizaje claras y suficiente data.',
  },
  {
    category: 'META - Atribución',
    tool: 'Meta Ads',
    focus: 'leer conversiones sin sobreinterpretar la señal',
    goal: 'entender impacto real en negocio',
    problem: 'se compara solo el último clic sin contexto',
    outcome: 'atribuir con criterio y consistencia',
    metric: 'la calidad de la atribución',
    correctPractice: 'Definir ventanas, reglas y comparaciones con otras fuentes para interpretar resultados correctamente.',
  },
];

const HIGH_MANAGEMENT_TOPICS: Topic[] = [
  {
    category: 'Alta Gerencia - Estrategia',
    tool: 'Alta gerencia',
    focus: 'alinear estrategia, ejecución y foco',
    goal: 'priorizar lo que realmente mueve el negocio',
    problem: 'la organización trabaja en demasiadas iniciativas a la vez',
    outcome: 'concentrar recursos en pocas apuestas de alto impacto',
    metric: 'el avance real contra los OKR',
    correctPractice: 'Traducir estrategia en prioridades concretas, responsables y métricas visibles.',
  },
  {
    category: 'Alta Gerencia - Gobernanza',
    tool: 'Alta gerencia',
    focus: 'establecer controles y seguimiento ejecutivo',
    goal: 'tomar decisiones con evidencia y disciplina',
    problem: 'se ejecuta sin tableros ni accountability',
    outcome: 'dar visibilidad a resultados y riesgos',
    metric: 'la calidad del seguimiento ejecutivo',
    correctPractice: 'Usar tableros, cadencias y roles claros para gobernar la ejecución.',
  },
  {
    category: 'Alta Gerencia - Cambio',
    tool: 'Alta gerencia',
    focus: 'liderar transformaciones organizacionales',
    goal: 'mover a la compañía sin perder compromiso',
    problem: 'el cambio se comunica sin contexto ni beneficios',
    outcome: 'alinear cultura, procesos y adopción',
    metric: 'la velocidad de adopción',
    correctPractice: 'Gestionar cambio con narrativa, sponsors, entrenamiento y seguimiento de adopción.',
  },
  {
    category: 'Alta Gerencia - Crisis',
    tool: 'Alta gerencia',
    focus: 'responder a una crisis reputacional u operativa',
    goal: 'proteger confianza y continuidad del negocio',
    problem: 'la reacción llega tarde o sin un mensaje unificado',
    outcome: 'responder con claridad, rapidez y control',
    metric: 'el tiempo de contención del incidente',
    correctPractice: 'Definir vocería, mensaje y plan de acción antes de que el incidente escale.',
  },
  {
    category: 'Alta Gerencia - Finanzas',
    tool: 'Alta gerencia',
    focus: 'tomar decisiones con disciplina financiera',
    goal: 'proteger margen y caja',
    problem: 'se prioriza crecimiento sin revisar rentabilidad',
    outcome: 'equilibrar expansión y sostenibilidad',
    metric: 'el margen operativo y la caja disponible',
    correctPractice: 'Revisar P&L, cash flow y escenarios antes de comprometer nuevas inversiones.',
  },
  {
    category: 'Alta Gerencia - Cultura',
    tool: 'Alta gerencia',
    focus: 'fortalecer cultura y liderazgo',
    goal: 'alinear comportamiento con la estrategia',
    problem: 'la cultura declarada no coincide con la real',
    outcome: 'reforzar hábitos y decisiones coherentes',
    metric: 'el compromiso y la retención de talento',
    correctPractice: 'Modelar la cultura con ejemplos, rituales y decisiones consistentes desde la dirección.',
  },
  {
    category: 'Alta Gerencia - Sucesión',
    tool: 'Alta gerencia',
    focus: 'preparar líderes para posiciones críticas',
    goal: 'reducir riesgo de continuidad',
    problem: 'no existe plan para reemplazos clave',
    outcome: 'desarrollar una cantera de liderazgo',
    metric: 'la cobertura de posiciones críticas',
    correctPractice: 'Definir sucesores, planes de desarrollo y revisiones periódicas de talento.',
  },
  {
    category: 'Alta Gerencia - Riesgo',
    tool: 'Alta gerencia',
    focus: 'gestionar riesgo operativo y estratégico',
    goal: 'evitar sorpresas costosas',
    problem: 'los riesgos se detectan tarde o sin owner',
    outcome: 'anticipar impactos antes de que escalen',
    metric: 'la exposición y probabilidad del riesgo',
    correctPractice: 'Mantener un mapa de riesgos con mitigaciones, responsables y seguimiento frecuente.',
  },
  {
    category: 'Alta Gerencia - Ejecución',
    tool: 'Alta gerencia',
    focus: 'convertir planes en resultados',
    goal: 'evitar que la estrategia se quede en presentaciones',
    problem: 'hay muchas ideas pero poca entrega concreta',
    outcome: 'instalar ritmo de ejecución y accountability',
    metric: 'el porcentaje de iniciativas cumplidas',
    correctPractice: 'Definir dueños, fechas, entregables y rituales de seguimiento ejecutivo.',
  },
  {
    category: 'Alta Gerencia - Transformación Digital',
    tool: 'Alta gerencia',
    focus: 'impulsar transformación y uso de IA',
    goal: 'mejorar productividad y competitividad',
    problem: 'se adoptan herramientas sin rediseñar procesos',
    outcome: 'capturar valor real de la tecnología',
    metric: 'el impacto en eficiencia y crecimiento',
    correctPractice: 'Alinear tecnología, procesos y adopción para que la transformación genere resultados medibles.',
  },
];

const MODERN_SALES_TOPICS: Topic[] = [
  {
    category: 'Ventas Modernas - Prospección',
    tool: 'Equipo comercial',
    focus: 'abrir conversaciones con prospectos nuevos',
    goal: 'aumentar reuniones calificadas sin perder calidad',
    problem: 'el outbound se vuelve spam y baja la respuesta',
    outcome: 'obtener atención real de prospectos correctos',
    metric: 'la tasa de respuesta y reunión agendada',
    correctPractice: 'Hacer prospección con investigación previa, mensaje relevante y secuencia multicanal.',
  },
  {
    category: 'Ventas Modernas - Discovery',
    tool: 'Equipo comercial',
    focus: 'descubrir dolor, contexto y urgencia real',
    goal: 'evitar demos genéricas que no avanzan',
    problem: 'se presenta demasiado pronto sin entender al cliente',
    outcome: 'calificar mejor la oportunidad',
    metric: 'la calidad de la oportunidad creada',
    correctPractice: 'Guiar discovery con preguntas abiertas, hipótesis y validación del impacto del problema.',
  },
  {
    category: 'Ventas Modernas - Qualification',
    tool: 'Equipo comercial',
    focus: 'calificar oportunidades con criterio',
    goal: 'invertir tiempo solo en deals con potencial real',
    problem: 'se persiguen leads sin presupuesto, necesidad o urgencia',
    outcome: 'priorizar oportunidades ganables',
    metric: 'la tasa de conversión a cierre',
    correctPractice: 'Usar frameworks de calificación y descartar oportunidades sin señales claras de compra.',
  },
  {
    category: 'Ventas Modernas - Propuesta de Valor',
    tool: 'Equipo comercial',
    focus: 'conectar solución con impacto de negocio',
    goal: 'evitar competir solo por precio',
    problem: 'el vendedor habla de características y no de resultados',
    outcome: 'posicionar valor antes que descuento',
    metric: 'la relación valor/precio percibida',
    correctPractice: 'Traducir la solución a impacto operativo, financiero o estratégico para el cliente.',
  },
  {
    category: 'Ventas Modernas - Objeciones',
    tool: 'Equipo comercial',
    focus: 'manejar objeciones sin fricción',
    goal: 'mantener avance de la negociación',
    problem: 'la objeción se responde defensivamente o con presión',
    outcome: 'reencuadrar la conversación con valor',
    metric: 'la conversión después de la objeción',
    correctPractice: 'Escuchar, profundizar y responder con evidencia, contexto y alternativas.',
  },
  {
    category: 'Ventas Modernas - Cierre',
    tool: 'Equipo comercial',
    focus: 'cerrar con claridad y sin manipulación',
    goal: 'acortar ciclos sin perder confianza',
    problem: 'el deal se estanca por falta de siguiente paso concreto',
    outcome: 'cerrar acuerdos con compromiso real',
    metric: 'la tasa de cierre y tiempo de ciclo',
    correctPractice: 'Proponer próximos pasos claros, validar decisiones y resolver bloqueos antes de pedir la firma.',
  },
  {
    category: 'Ventas Modernas - Seguimiento',
    tool: 'Equipo comercial',
    focus: 'dar seguimiento consistente a oportunidades',
    goal: 'evitar fugas por falta de persistencia',
    problem: 'no hay cadencia y el lead se enfría',
    outcome: 'mantener el ritmo de avance',
    metric: 'la velocidad de seguimiento',
    correctPractice: 'Usar cadencias con propósito, contexto y siguiente acción definida.',
  },
  {
    category: 'Ventas Modernas - Pipeline Hygiene',
    tool: 'Equipo comercial',
    focus: 'mantener el pipeline limpio y realista',
    goal: 'mejorar forecast y foco del equipo',
    problem: 'hay oportunidades infladas o sin actividad',
    outcome: 'tener un embudo confiable',
    metric: 'la precisión del forecast',
    correctPractice: 'Higienizar pipeline con criterios de avance, fecha, próxima acción y probabilidad real.',
  },
  {
    category: 'Ventas Modernas - Forecast',
    tool: 'Equipo comercial',
    focus: 'pronosticar ventas con criterio',
    goal: 'dar visibilidad confiable a dirección',
    problem: 'las proyecciones cambian sin base sólida',
    outcome: 'estimar ingresos con disciplina',
    metric: 'la desviación del forecast',
    correctPractice: 'Anclar forecast en evidencia de avance, etapas y señales de compra verificables.',
  },
  {
    category: 'Ventas Modernas - CRM',
    tool: 'Equipo comercial',
    focus: 'registrar actividad y datos de forma consistente',
    goal: 'evitar pérdidas de información y contexto',
    problem: 'el CRM está incompleto y sin actualizaciones',
    outcome: 'mejorar trazabilidad y gestión',
    metric: 'la calidad del pipeline en CRM',
    correctPractice: 'Registrar actividad relevante, próximos pasos y cambios de estado de forma disciplinada.',
  },
  {
    category: 'Ventas Modernas - Social Selling',
    tool: 'Equipo comercial',
    focus: 'construir confianza en redes y comunidad',
    goal: 'abrir puertas sin depender solo del cold call',
    problem: 'se publica contenido sin intención comercial',
    outcome: 'posicionar autoridad y generar conversaciones',
    metric: 'la tasa de engagement útil',
    correctPractice: 'Combinar contenido útil, conexión genuina y conversación orientada a valor.',
  },
  {
    category: 'Ventas Modernas - Secuencias',
    tool: 'Equipo comercial',
    focus: 'diseñar secuencias multicanal efectivas',
    goal: 'aumentar respuesta con menos fricción',
    problem: 'los contactos reciben mensajes repetitivos o desconectados',
    outcome: 'crear un journey comercial coherente',
    metric: 'la tasa de respuesta por secuencia',
    correctPractice: 'Usar secuencias con valor progresivo, distintos canales y personalización real.',
  },
  {
    category: 'Ventas Modernas - WhatsApp',
    tool: 'Equipo comercial',
    focus: 'usar WhatsApp como canal de cierre y avance',
    goal: 'acelerar conversaciones sin perder profesionalismo',
    problem: 'los mensajes son improvisados o demasiado invasivos',
    outcome: 'mantener velocidad y confianza',
    metric: 'la respuesta efectiva y avance de etapa',
    correctPractice: 'Usar mensajes cortos, contexto claro y próximos pasos concretos en WhatsApp.',
  },
  {
    category: 'Ventas Modernas - Video Outreach',
    tool: 'Equipo comercial',
    focus: 'usar video o audio personalizado para prospectos',
    goal: 'destacar en bandejas saturadas',
    problem: 'el primer contacto pasa desapercibido',
    outcome: 'humanizar la prospección',
    metric: 'la tasa de respuesta inicial',
    correctPractice: 'Enviar piezas breves, específicas y centradas en el problema real del prospecto.',
  },
  {
    category: 'Ventas Modernas - Appointment Setting',
    tool: 'Equipo comercial',
    focus: 'agendar reuniones con decisores',
    goal: 'calificar antes de invertir tiempo del closer',
    problem: 'se agenda con leads poco comprometidos',
    outcome: 'entregar reuniones realmente valiosas',
    metric: 'la tasa de show y calificación',
    correctPractice: 'Validar interés, necesidad y fit antes de confirmar la reunión.',
  },
  {
    category: 'Ventas Modernas - Demo',
    tool: 'Equipo comercial',
    focus: 'presentar demos relevantes',
    goal: 'mostrar solución sin caer en discurso genérico',
    problem: 'la demo no conecta con el dolor del cliente',
    outcome: 'aumentar intención de compra',
    metric: 'la conversión post-demo',
    correctPractice: 'Personalizar la demo al caso de uso, rol del stakeholder y objetivos del negocio.',
  },
  {
    category: 'Ventas Modernas - Negociación',
    tool: 'Equipo comercial',
    focus: 'negociar precio y condiciones con criterio',
    goal: 'proteger margen y cerrar valor',
    problem: 'se descuenta demasiado rápido',
    outcome: 'sostener rentabilidad sin perder la venta',
    metric: 'el margen final cerrado',
    correctPractice: 'Negociar valor, alcance y condiciones antes de tocar precio.',
  },
  {
    category: 'Ventas Modernas - Upsell y Cross-sell',
    tool: 'Equipo comercial',
    focus: 'expandir cuentas con oportunidades adicionales',
    goal: 'crecer ingresos en clientes existentes',
    problem: 'se deja pasar potencial por falta de cadencia comercial',
    outcome: 'incrementar ticket y retención',
    metric: 'el revenue expansion',
    correctPractice: 'Detectar señales de uso, necesidad y expansión antes de proponer nuevas ofertas.',
  },
  {
    category: 'Ventas Modernas - Handoff',
    tool: 'Equipo comercial',
    focus: 'coordinar setter, closer y customer success',
    goal: 'evitar rupturas en la experiencia del cliente',
    problem: 'la información se pierde entre etapas',
    outcome: 'mantener continuidad comercial',
    metric: 'la tasa de transferencia sin fricción',
    correctPractice: 'Definir handoffs claros con contexto, acuerdos y próximos pasos compartidos.',
  },
  {
    category: 'Ventas Modernas - MEDDICC/SPIN',
    tool: 'Equipo comercial',
    focus: 'calificar y dirigir grandes oportunidades',
    goal: 'vender con método y precisión',
    problem: 'no se identifican decisores ni criterios de compra',
    outcome: 'mejorar la calidad del proceso',
    metric: 'la profundidad de la calificación',
    correctPractice: 'Usar un marco de calificación para entender métricas, dolor, proceso y poder de decisión.',
  },
  {
    category: 'Ventas Modernas - Revenue Operations',
    tool: 'Equipo comercial',
    focus: 'coordinar ventas, datos y procesos',
    goal: 'mejorar eficiencia y previsibilidad',
    problem: 'cada vendedor trabaja con su propio método',
    outcome: 'estandarizar la operación comercial',
    metric: 'la calidad de datos y eficiencia del equipo',
    correctPractice: 'Estandarizar procesos, métricas y cadencias con apoyo de operaciones y CRM.',
  },
];

type BankConfig = {
  positionId: string;
  label: string;
  questions: GeneratedQuestion[];
  maxQuestions: number;
};

function seedQuestions(questions: GeneratedQuestion[]): SeedQuestion[] {
  return questions.map(question => ({
    questionText: question.questionText,
    questionTextEn: question.questionText,
    optionA: question.optionA,
    optionB: question.optionB,
    optionC: question.optionC,
    optionD: question.optionD,
    optionAEn: question.optionA,
    optionBEn: question.optionB,
    optionCEn: question.optionC,
    optionDEn: question.optionD,
    correctAnswer: question.correctAnswer,
    difficulty: question.difficulty,
    category: question.category,
    categoryEn: question.category,
  }));
}

const BANKS: BankConfig[] = [
  {
    positionId: 'marketing_manager',
    label: 'Marketing con IA',
    questions: buildBank(AI_MARKETING_TOPICS, STRATEGIC_PROMPTS, STANDARD_WRONGS),
    maxQuestions: 100,
  },
  {
    positionId: 'digital_marketing',
    label: 'Marketing en META',
    questions: buildBank(META_MARKETING_TOPICS, STRATEGIC_PROMPTS, STANDARD_WRONGS),
    maxQuestions: 100,
  },
  {
    positionId: 'ceo',
    label: 'Alta Gerencia',
    questions: buildBank(HIGH_MANAGEMENT_TOPICS, STRATEGIC_PROMPTS, STANDARD_WRONGS),
    maxQuestions: 100,
  },
  {
    positionId: 'sales_manager',
    label: 'Ventas Modernas',
    questions: buildBank(MODERN_SALES_TOPICS, SALES_PROMPTS, SALES_WRONGS).slice(0, 200),
    maxQuestions: 200,
  },
];

async function seedPosition(positionId: string, label: string, questions: GeneratedQuestion[], maxQuestions: number) {
  const position = JOB_POSITIONS.find(p => p.id === positionId);
  if (!position) {
    console.warn(`Skipping unknown position: ${positionId}`);
    return { positionId, label, createdOrUpdated: 0, total: questions.length };
  }

  await prisma.technicalQuestion.deleteMany({
    where: {
      jobPositionId: positionId,
      questionNumber: {
        gt: maxQuestions,
      },
    },
  });

  const mappedQuestions = seedQuestions(questions);
  let affected = 0;

  for (let index = 0; index < mappedQuestions.length; index++) {
    const question = mappedQuestions[index];
    await prisma.technicalQuestion.upsert({
      where: {
        jobPositionId_questionNumber: {
          jobPositionId: positionId,
          questionNumber: index + 1,
        },
      },
      update: {
        ...question,
        weight: question.difficulty === 'HARD' ? 3 : question.difficulty === 'MEDIUM' ? 2 : 1,
        isActive: true,
      },
      create: {
        jobPositionId: positionId,
        questionNumber: index + 1,
        ...question,
        weight: question.difficulty === 'HARD' ? 3 : question.difficulty === 'MEDIUM' ? 2 : 1,
        isActive: true,
      },
    });
    affected++;
  }

  return { positionId, label, createdOrUpdated: affected, total: mappedQuestions.length };
}

async function main() {
  console.log('Seeding advanced marketing, management, and sales question banks...');

  const results = [];
  for (const bank of BANKS) {
    const result = await seedPosition(bank.positionId, bank.label, bank.questions, bank.maxQuestions);
    results.push(result);
    const position = JOB_POSITIONS.find(p => p.id === bank.positionId);
    console.log(
      `${position?.title || bank.positionId}: ${result.createdOrUpdated}/${result.total} preguntas creadas o actualizadas`
    );
  }

  const summary = results.reduce(
    (acc, r) => {
      acc.positions += 1;
      acc.questions += r.total;
      acc.updated += r.createdOrUpdated;
      return acc;
    },
    { positions: 0, questions: 0, updated: 0 }
  );

  console.log(`Listo. ${summary.questions} preguntas procesadas en ${summary.positions} cargos.`);
}

main()
  .catch((error) => {
    console.error('Error seeding advanced marketing/sales questions:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
