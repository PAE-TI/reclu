import { PrismaClient, TechnicalDifficulty } from '@prisma/client';
import { JOB_POSITIONS } from '../lib/job-positions';

const prisma = new PrismaClient();

// EASY question templates - basic concepts and fundamentals
const easyTemplates = [
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cuál es la principal responsabilidad de un/a ${pos}?`,
      questionTextEn: `What is the main responsibility of a ${pos}?`,
      category: 'Conocimientos Básicos'
    }),
    options: {
      optionA: { es: 'Planificar, ejecutar y supervisar las actividades del área de manera efectiva', en: 'Plan, execute and supervise area activities effectively' },
      optionB: { es: 'Realizar únicamente tareas administrativas básicas', en: 'Perform only basic administrative tasks' },
      optionC: { es: 'Delegar todas las responsabilidades a subordinados', en: 'Delegate all responsibilities to subordinates' },
      optionD: { es: 'Enfocarse exclusivamente en la documentación', en: 'Focus exclusively on documentation' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Qué habilidad es fundamental para desempeñarse como ${pos}?`,
      questionTextEn: `What skill is fundamental to perform as a ${pos}?`,
      category: 'Habilidades Básicas'
    }),
    options: {
      optionA: { es: 'Conocimiento técnico del área y capacidad de aprendizaje continuo', en: 'Technical knowledge of the area and continuous learning capacity' },
      optionB: { es: 'Solo habilidades de comunicación verbal', en: 'Only verbal communication skills' },
      optionC: { es: 'Experiencia exclusiva en un solo tema', en: 'Exclusive experience in a single topic' },
      optionD: { es: 'Únicamente conocimientos informáticos básicos', en: 'Only basic computer knowledge' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cuál es la mejor forma de organizar el trabajo diario como ${pos}?`,
      questionTextEn: `What is the best way to organize daily work as a ${pos}?`,
      category: 'Organización'
    }),
    options: {
      optionA: { es: 'Priorizar tareas según importancia y urgencia', en: 'Prioritize tasks by importance and urgency' },
      optionB: { es: 'Atender las tareas en el orden que llegan', en: 'Address tasks in the order they arrive' },
      optionC: { es: 'Trabajar solo en lo que resulta más fácil', en: 'Work only on what is easiest' },
      optionD: { es: 'Esperar instrucciones para cada tarea', en: 'Wait for instructions for each task' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cómo debe manejar la información confidencial un/a ${pos}?`,
      questionTextEn: `How should a ${pos} handle confidential information?`,
      category: 'Ética Profesional'
    }),
    options: {
      optionA: { es: 'Seguir los protocolos de seguridad establecidos y compartir solo con autorizados', en: 'Follow established security protocols and share only with authorized personnel' },
      optionB: { es: 'Compartir libremente con colegas de confianza', en: 'Share freely with trusted colleagues' },
      optionC: { es: 'Guardar copias personales por seguridad', en: 'Keep personal copies for security' },
      optionD: { es: 'Discutir abiertamente en áreas comunes', en: 'Discuss openly in common areas' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Qué debe hacer un/a ${pos} al recibir una tarea con instrucciones poco claras?`,
      questionTextEn: `What should a ${pos} do when receiving a task with unclear instructions?`,
      category: 'Comunicación'
    }),
    options: {
      optionA: { es: 'Solicitar clarificación antes de comenzar para evitar errores', en: 'Request clarification before starting to avoid errors' },
      optionB: { es: 'Interpretar las instrucciones por cuenta propia', en: 'Interpret the instructions on your own' },
      optionC: { es: 'Ignorar la tarea hasta recibir mejores instrucciones', en: 'Ignore the task until better instructions are received' },
      optionD: { es: 'Quejarse con otros colegas sobre las instrucciones', en: 'Complain to other colleagues about the instructions' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cuál es la actitud correcta de un/a ${pos} ante el trabajo en equipo?`,
      questionTextEn: `What is the correct attitude of a ${pos} towards teamwork?`,
      category: 'Trabajo en Equipo'
    }),
    options: {
      optionA: { es: 'Colaborar activamente y apoyar a los compañeros cuando sea necesario', en: 'Actively collaborate and support colleagues when needed' },
      optionB: { es: 'Trabajar de forma aislada para evitar conflictos', en: 'Work in isolation to avoid conflicts' },
      optionC: { es: 'Competir con los compañeros por destacar', en: 'Compete with colleagues to stand out' },
      optionD: { es: 'Delegar todo el trabajo a otros miembros', en: 'Delegate all work to other members' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cómo debe responder un/a ${pos} ante una crítica constructiva?`,
      questionTextEn: `How should a ${pos} respond to constructive criticism?`,
      category: 'Desarrollo Profesional'
    }),
    options: {
      optionA: { es: 'Escuchar atentamente y buscar formas de mejorar', en: 'Listen carefully and look for ways to improve' },
      optionB: { es: 'Defender su posición sin considerar la crítica', en: 'Defend your position without considering the criticism' },
      optionC: { es: 'Ignorar la crítica si viene de alguien de menor rango', en: 'Ignore criticism if it comes from someone of lower rank' },
      optionD: { es: 'Tomarlo como un ataque personal', en: 'Take it as a personal attack' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Qué debe hacer un/a ${pos} para mantenerse actualizado en su campo?`,
      questionTextEn: `What should a ${pos} do to stay updated in their field?`,
      category: 'Aprendizaje Continuo'
    }),
    options: {
      optionA: { es: 'Participar en capacitaciones y seguir las tendencias del sector', en: 'Participate in training and follow industry trends' },
      optionB: { es: 'Confiar únicamente en la experiencia acumulada', en: 'Rely only on accumulated experience' },
      optionC: { es: 'Esperar que la empresa proporcione toda la formación', en: 'Wait for the company to provide all training' },
      optionD: { es: 'Leer noticias generales ocasionalmente', en: 'Occasionally read general news' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cuál es la importancia de la puntualidad para un/a ${pos}?`,
      questionTextEn: `What is the importance of punctuality for a ${pos}?`,
      category: 'Profesionalismo'
    }),
    options: {
      optionA: { es: 'Demuestra compromiso, respeto y profesionalismo', en: 'Demonstrates commitment, respect and professionalism' },
      optionB: { es: 'Solo importa cuando hay reuniones importantes', en: 'Only matters when there are important meetings' },
      optionC: { es: 'Es irrelevante si se cumple con las tareas', en: 'It is irrelevant if tasks are completed' },
      optionD: { es: 'Depende del tipo de trabajo', en: 'Depends on the type of work' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cómo debe documentar su trabajo un/a ${pos}?`,
      questionTextEn: `How should a ${pos} document their work?`,
      category: 'Documentación'
    }),
    options: {
      optionA: { es: 'De forma clara, organizada y accesible para el equipo', en: 'Clearly, organized and accessible for the team' },
      optionB: { es: 'Solo cuando sea obligatorio por auditoría', en: 'Only when required by audit' },
      optionC: { es: 'En correos electrónicos personales', en: 'In personal emails' },
      optionD: { es: 'Confiar en la memoria del equipo', en: 'Trust team memory' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Qué debe priorizar un/a ${pos} al iniciar un nuevo proyecto?`,
      questionTextEn: `What should a ${pos} prioritize when starting a new project?`,
      category: 'Gestión de Proyectos'
    }),
    options: {
      optionA: { es: 'Entender los objetivos, requisitos y expectativas claramente', en: 'Understand objectives, requirements and expectations clearly' },
      optionB: { es: 'Comenzar a trabajar inmediatamente sin planificar', en: 'Start working immediately without planning' },
      optionC: { es: 'Esperar a que otros definan el alcance', en: 'Wait for others to define the scope' },
      optionD: { es: 'Asumir que conoce todos los detalles', en: 'Assume you know all the details' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cuál es la mejor manera de comunicarse con superiores como ${pos}?`,
      questionTextEn: `What is the best way to communicate with superiors as a ${pos}?`,
      category: 'Comunicación'
    }),
    options: {
      optionA: { es: 'De forma clara, concisa y profesional', en: 'Clearly, concisely and professionally' },
      optionB: { es: 'Solo cuando hay problemas graves', en: 'Only when there are serious problems' },
      optionC: { es: 'A través de terceros para evitar confrontaciones', en: 'Through third parties to avoid confrontations' },
      optionD: { es: 'Con el mayor detalle posible sin importar el tiempo', en: 'With as much detail as possible regardless of time' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Qué debe hacer un/a ${pos} cuando comete un error en su trabajo?`,
      questionTextEn: `What should a ${pos} do when making a mistake at work?`,
      category: 'Responsabilidad'
    }),
    options: {
      optionA: { es: 'Reconocerlo, comunicarlo y buscar la solución', en: 'Acknowledge it, communicate it and seek a solution' },
      optionB: { es: 'Ocultarlo esperando que nadie lo note', en: 'Hide it hoping no one notices' },
      optionC: { es: 'Culpar a factores externos', en: 'Blame external factors' },
      optionD: { es: 'Esperar a que otro lo descubra', en: 'Wait for someone else to discover it' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cómo debe manejar las interrupciones un/a ${pos} durante tareas importantes?`,
      questionTextEn: `How should a ${pos} handle interruptions during important tasks?`,
      category: 'Productividad'
    }),
    options: {
      optionA: { es: 'Evaluar la urgencia y establecer límites apropiados', en: 'Evaluate urgency and set appropriate boundaries' },
      optionB: { es: 'Atender todas las interrupciones inmediatamente', en: 'Address all interruptions immediately' },
      optionC: { es: 'Ignorar completamente todas las interrupciones', en: 'Completely ignore all interruptions' },
      optionD: { es: 'Quejarse de las interrupciones constantemente', en: 'Constantly complain about interruptions' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cuál es el primer paso que debe dar un/a ${pos} ante un problema técnico?`,
      questionTextEn: `What is the first step a ${pos} should take when facing a technical problem?`,
      category: 'Resolución de Problemas'
    }),
    options: {
      optionA: { es: 'Identificar y analizar el problema antes de actuar', en: 'Identify and analyze the problem before acting' },
      optionB: { es: 'Escalar inmediatamente sin intentar resolver', en: 'Escalate immediately without trying to resolve' },
      optionC: { es: 'Ignorar el problema esperando que se resuelva solo', en: 'Ignore the problem hoping it resolves itself' },
      optionD: { es: 'Aplicar la primera solución que venga a la mente', en: 'Apply the first solution that comes to mind' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Qué actitud debe mantener un/a ${pos} ante los cambios en la empresa?`,
      questionTextEn: `What attitude should a ${pos} maintain towards changes in the company?`,
      category: 'Adaptabilidad'
    }),
    options: {
      optionA: { es: 'Apertura y disposición para adaptarse positivamente', en: 'Openness and willingness to adapt positively' },
      optionB: { es: 'Resistencia hasta que sea absolutamente necesario', en: 'Resistance until absolutely necessary' },
      optionC: { es: 'Crítica abierta frente al equipo', en: 'Open criticism in front of the team' },
      optionD: { es: 'Indiferencia total ante los cambios', en: 'Total indifference to changes' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cómo debe establecer prioridades un/a ${pos} cuando tiene múltiples tareas?`,
      questionTextEn: `How should a ${pos} set priorities when having multiple tasks?`,
      category: 'Gestión del Tiempo'
    }),
    options: {
      optionA: { es: 'Evaluar urgencia, importancia y deadline de cada tarea', en: 'Evaluate urgency, importance and deadline of each task' },
      optionB: { es: 'Hacer primero las tareas más fáciles', en: 'Do the easiest tasks first' },
      optionC: { es: 'Trabajar en todas simultáneamente', en: 'Work on all simultaneously' },
      optionD: { es: 'Elegir según preferencia personal', en: 'Choose according to personal preference' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cuál es la importancia del respeto en el ambiente laboral para un/a ${pos}?`,
      questionTextEn: `What is the importance of respect in the work environment for a ${pos}?`,
      category: 'Valores Profesionales'
    }),
    options: {
      optionA: { es: 'Fundamental para mantener un ambiente productivo y armonioso', en: 'Fundamental to maintain a productive and harmonious environment' },
      optionB: { es: 'Importante solo con superiores', en: 'Important only with superiors' },
      optionC: { es: 'Relevante únicamente en situaciones formales', en: 'Relevant only in formal situations' },
      optionD: { es: 'Secundario si se cumplen los objetivos', en: 'Secondary if objectives are met' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Qué debe hacer un/a ${pos} para garantizar la calidad de su trabajo?`,
      questionTextEn: `What should a ${pos} do to ensure the quality of their work?`,
      category: 'Calidad'
    }),
    options: {
      optionA: { es: 'Revisar su trabajo antes de entregarlo y seguir estándares establecidos', en: 'Review work before delivery and follow established standards' },
      optionB: { es: 'Entregar rápido asumiendo que otros corregirán errores', en: 'Deliver quickly assuming others will correct errors' },
      optionC: { es: 'Revisar solo cuando se lo soliciten', en: 'Review only when requested' },
      optionD: { es: 'Confiar en que la experiencia evita errores', en: 'Trust that experience prevents errors' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cómo debe un/a ${pos} manejar el estrés laboral?`,
      questionTextEn: `How should a ${pos} handle work stress?`,
      category: 'Bienestar'
    }),
    options: {
      optionA: { es: 'Identificar las causas y aplicar técnicas de manejo del estrés', en: 'Identify causes and apply stress management techniques' },
      optionB: { es: 'Ignorarlo y continuar trabajando intensamente', en: 'Ignore it and continue working intensely' },
      optionC: { es: 'Transferir el estrés a los compañeros', en: 'Transfer stress to colleagues' },
      optionD: { es: 'Quejarse constantemente sin buscar soluciones', en: 'Constantly complain without seeking solutions' },
      correctAnswer: 'A'
    }
  }
];

// MEDIUM question templates - practical application and common scenarios
const mediumTemplates = [
  {
    template: (pos: string) => ({
      questionTextEs: `Como ${pos}, ¿cómo abordaría un desacuerdo con un colega sobre un proyecto?`,
      questionTextEn: `As a ${pos}, how would you approach a disagreement with a colleague about a project?`,
      category: 'Resolución de Conflictos'
    }),
    options: {
      optionA: { es: 'Escuchar su perspectiva, presentar argumentos objetivos y buscar un punto medio', en: 'Listen to their perspective, present objective arguments and seek middle ground' },
      optionB: { es: 'Insistir en su posición hasta convencer al otro', en: 'Insist on your position until convincing the other' },
      optionC: { es: 'Ceder inmediatamente para evitar conflictos', en: 'Yield immediately to avoid conflicts' },
      optionD: { es: 'Escalar el desacuerdo al supervisor sin intentar resolverlo', en: 'Escalate the disagreement to supervisor without trying to resolve it' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cómo debe un/a ${pos} manejar un proyecto con deadline ajustado?`,
      questionTextEn: `How should a ${pos} handle a project with a tight deadline?`,
      category: 'Gestión del Tiempo'
    }),
    options: {
      optionA: { es: 'Priorizar tareas críticas, comunicar avances y gestionar expectativas', en: 'Prioritize critical tasks, communicate progress and manage expectations' },
      optionB: { es: 'Trabajar horas extras sin comunicar el estado', en: 'Work overtime without communicating status' },
      optionC: { es: 'Reducir la calidad para cumplir con el plazo', en: 'Reduce quality to meet the deadline' },
      optionD: { es: 'Solicitar extensión sin intentar cumplir primero', en: 'Request extension without trying to meet it first' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Un cliente expresa insatisfacción con su trabajo como ${pos}. ¿Cómo debe responder?`,
      questionTextEn: `A client expresses dissatisfaction with your work as a ${pos}. How should you respond?`,
      category: 'Servicio al Cliente'
    }),
    options: {
      optionA: { es: 'Escuchar activamente, mostrar empatía y proponer soluciones concretas', en: 'Listen actively, show empathy and propose concrete solutions' },
      optionB: { es: 'Defender su trabajo justificando cada decisión', en: 'Defend your work justifying each decision' },
      optionC: { es: 'Derivar al cliente a otra persona inmediatamente', en: 'Refer the client to another person immediately' },
      optionD: { es: 'Minimizar la queja del cliente', en: 'Minimize the client complaint' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como ${pos}, ¿cómo priorizaría recursos limitados entre varios proyectos importantes?`,
      questionTextEn: `As a ${pos}, how would you prioritize limited resources among several important projects?`,
      category: 'Toma de Decisiones'
    }),
    options: {
      optionA: { es: 'Evaluar impacto estratégico, urgencia y ROI de cada proyecto', en: 'Evaluate strategic impact, urgency and ROI of each project' },
      optionB: { es: 'Atender primero al proyecto del cliente más importante', en: 'Attend first to the most important clients project' },
      optionC: { es: 'Dividir recursos equitativamente sin priorizar', en: 'Divide resources equally without prioritizing' },
      optionD: { es: 'Escalar la decisión sin proponer alternativas', en: 'Escalate the decision without proposing alternatives' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Qué debe hacer un/a ${pos} cuando identifica una ineficiencia en un proceso establecido?`,
      questionTextEn: `What should a ${pos} do when identifying an inefficiency in an established process?`,
      category: 'Mejora Continua'
    }),
    options: {
      optionA: { es: 'Documentar la ineficiencia, proponer mejoras y presentarlas al equipo', en: 'Document the inefficiency, propose improvements and present them to the team' },
      optionB: { es: 'Ignorarla ya que los procesos están aprobados', en: 'Ignore it since processes are approved' },
      optionC: { es: 'Cambiar el proceso por cuenta propia', en: 'Change the process on your own' },
      optionD: { es: 'Quejarse sin ofrecer soluciones', en: 'Complain without offering solutions' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como ${pos}, ¿cómo manejaría la delegación de tareas a un miembro junior del equipo?`,
      questionTextEn: `As a ${pos}, how would you handle task delegation to a junior team member?`,
      category: 'Liderazgo'
    }),
    options: {
      optionA: { es: 'Dar instrucciones claras, establecer checkpoints y ofrecer apoyo continuo', en: 'Give clear instructions, establish checkpoints and offer continuous support' },
      optionB: { es: 'Delegar sin seguimiento esperando autonomía', en: 'Delegate without follow-up expecting autonomy' },
      optionC: { es: 'Hacer la tarea usted mismo para asegurar calidad', en: 'Do the task yourself to ensure quality' },
      optionD: { es: 'Dar instrucciones mínimas para fomentar independencia', en: 'Give minimal instructions to encourage independence' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cómo debe un/a ${pos} prepararse para una reunión importante con stakeholders?`,
      questionTextEn: `How should a ${pos} prepare for an important meeting with stakeholders?`,
      category: 'Comunicación'
    }),
    options: {
      optionA: { es: 'Preparar datos relevantes, anticipar preguntas y definir objetivos claros', en: 'Prepare relevant data, anticipate questions and define clear objectives' },
      optionB: { es: 'Improvisar basándose en el conocimiento del tema', en: 'Improvise based on knowledge of the topic' },
      optionC: { es: 'Preparar solo una presentación visual', en: 'Prepare only a visual presentation' },
      optionD: { es: 'Esperar a conocer las preguntas en la reunión', en: 'Wait to know the questions in the meeting' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Un proyecto como ${pos} tiene resultados por debajo de lo esperado. ¿Cuál es su siguiente paso?`,
      questionTextEn: `A project as a ${pos} has results below expectations. What is your next step?`,
      category: 'Análisis de Resultados'
    }),
    options: {
      optionA: { es: 'Analizar las causas, identificar lecciones aprendidas y proponer ajustes', en: 'Analyze causes, identify lessons learned and propose adjustments' },
      optionB: { es: 'Culpar a factores externos por los resultados', en: 'Blame external factors for the results' },
      optionC: { es: 'Ocultar los resultados negativos', en: 'Hide negative results' },
      optionD: { es: 'Pasar rápidamente al siguiente proyecto', en: 'Quickly move on to the next project' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como ${pos}, ¿cómo gestionaría expectativas cuando un entregable se retrasará?`,
      questionTextEn: `As a ${pos}, how would you manage expectations when a deliverable will be delayed?`,
      category: 'Gestión de Expectativas'
    }),
    options: {
      optionA: { es: 'Comunicar proactivamente, explicar razones y proponer nueva fecha realista', en: 'Communicate proactively, explain reasons and propose realistic new date' },
      optionB: { es: 'Esperar hasta el último momento para informar', en: 'Wait until the last moment to inform' },
      optionC: { es: 'Entregar trabajo incompleto para cumplir la fecha', en: 'Deliver incomplete work to meet the date' },
      optionD: { es: 'Culpar a otros por el retraso', en: 'Blame others for the delay' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cómo debe un/a ${pos} integrar a un nuevo miembro al equipo?`,
      questionTextEn: `How should a ${pos} integrate a new member into the team?`,
      category: 'Trabajo en Equipo'
    }),
    options: {
      optionA: { es: 'Proporcionar contexto, presentar al equipo y asignar un mentor', en: 'Provide context, introduce the team and assign a mentor' },
      optionB: { es: 'Dejar que se integre por sí mismo con el tiempo', en: 'Let them integrate by themselves over time' },
      optionC: { es: 'Asignar tareas complejas para probar su capacidad', en: 'Assign complex tasks to test their capability' },
      optionD: { es: 'Limitarse a enviar documentación por email', en: 'Limit to sending documentation by email' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como ${pos}, ¿cómo abordaría la implementación de una nueva herramienta tecnológica?`,
      questionTextEn: `As a ${pos}, how would you approach the implementation of a new technological tool?`,
      category: 'Gestión del Cambio'
    }),
    options: {
      optionA: { es: 'Capacitar al equipo, establecer piloto y recopilar feedback', en: 'Train the team, establish pilot and gather feedback' },
      optionB: { es: 'Implementar inmediatamente para todos', en: 'Implement immediately for everyone' },
      optionC: { es: 'Esperar a que otros equipos la adopten primero', en: 'Wait for other teams to adopt it first' },
      optionD: { es: 'Usar la herramienta solo personalmente', en: 'Use the tool only personally' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cómo debe un/a ${pos} manejar información contradictoria de diferentes fuentes?`,
      questionTextEn: `How should a ${pos} handle contradictory information from different sources?`,
      category: 'Pensamiento Crítico'
    }),
    options: {
      optionA: { es: 'Verificar la fuente, analizar el contexto y buscar datos adicionales', en: 'Verify the source, analyze context and seek additional data' },
      optionB: { es: 'Confiar en la fuente de mayor autoridad', en: 'Trust the source of higher authority' },
      optionC: { es: 'Ignorar la contradicción y elegir una versión', en: 'Ignore the contradiction and choose one version' },
      optionD: { es: 'Esperar a que alguien más resuelva la discrepancia', en: 'Wait for someone else to resolve the discrepancy' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como ${pos}, ¿cómo balancearía múltiples solicitudes urgentes de diferentes superiores?`,
      questionTextEn: `As a ${pos}, how would you balance multiple urgent requests from different superiors?`,
      category: 'Priorización'
    }),
    options: {
      optionA: { es: 'Comunicar la situación, clarificar prioridades y negociar plazos', en: 'Communicate the situation, clarify priorities and negotiate deadlines' },
      optionB: { es: 'Atender primero al de mayor jerarquía', en: 'Attend first to the one with higher hierarchy' },
      optionC: { es: 'Intentar hacer todo simultáneamente', en: 'Try to do everything simultaneously' },
      optionD: { es: 'Elegir por cuenta propia sin comunicar', en: 'Choose on your own without communicating' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Qué debe hacer un/a ${pos} cuando no tiene los conocimientos necesarios para una tarea asignada?`,
      questionTextEn: `What should a ${pos} do when lacking the necessary knowledge for an assigned task?`,
      category: 'Desarrollo Profesional'
    }),
    options: {
      optionA: { es: 'Ser transparente, buscar recursos de aprendizaje y solicitar apoyo', en: 'Be transparent, seek learning resources and request support' },
      optionB: { es: 'Intentar hacer la tarea sin revelar la falta de conocimiento', en: 'Try to do the task without revealing lack of knowledge' },
      optionC: { es: 'Rechazar la tarea por falta de competencia', en: 'Reject the task due to lack of competence' },
      optionD: { es: 'Delegar la tarea a otra persona', en: 'Delegate the task to another person' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como ${pos}, ¿cómo mediría el éxito de un proyecto completado?`,
      questionTextEn: `As a ${pos}, how would you measure the success of a completed project?`,
      category: 'Evaluación de Resultados'
    }),
    options: {
      optionA: { es: 'Comparar resultados con objetivos iniciales, KPIs y satisfacción del cliente', en: 'Compare results with initial objectives, KPIs and customer satisfaction' },
      optionB: { es: 'Considerar exitoso si se completó dentro del plazo', en: 'Consider successful if completed within deadline' },
      optionC: { es: 'Basarse únicamente en la opinión del equipo', en: 'Base only on team opinion' },
      optionD: { es: 'Evaluar solo si hubo problemas reportados', en: 'Evaluate only if problems were reported' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cómo debe un/a ${pos} reaccionar cuando un compañero toma crédito por su trabajo?`,
      questionTextEn: `How should a ${pos} react when a colleague takes credit for their work?`,
      category: 'Ética Profesional'
    }),
    options: {
      optionA: { es: 'Abordar la situación directamente de forma profesional y documentar contribuciones', en: 'Address the situation directly professionally and document contributions' },
      optionB: { es: 'Quejarse con otros colegas sobre la situación', en: 'Complain to other colleagues about the situation' },
      optionC: { es: 'Ignorarlo para evitar conflictos', en: 'Ignore it to avoid conflicts' },
      optionD: { es: 'Hacer lo mismo con el trabajo de otros', en: 'Do the same with others work' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como ${pos}, ¿cómo fomentaría la colaboración en un equipo con miembros remotos?`,
      questionTextEn: `As a ${pos}, how would you foster collaboration in a team with remote members?`,
      category: 'Trabajo Remoto'
    }),
    options: {
      optionA: { es: 'Establecer reuniones regulares, usar herramientas colaborativas y comunicación asíncrona', en: 'Establish regular meetings, use collaborative tools and asynchronous communication' },
      optionB: { es: 'Comunicarse solo cuando sea necesario', en: 'Communicate only when necessary' },
      optionC: { es: 'Esperar que los remotos se adapten al equipo presencial', en: 'Expect remote workers to adapt to the on-site team' },
      optionD: { es: 'Mantener equipos separados por ubicación', en: 'Keep teams separated by location' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Qué debe hacer un/a ${pos} cuando recibe feedback contradictorio de diferentes stakeholders?`,
      questionTextEn: `What should a ${pos} do when receiving contradictory feedback from different stakeholders?`,
      category: 'Gestión de Stakeholders'
    }),
    options: {
      optionA: { es: 'Organizar una reunión para alinear expectativas y encontrar consenso', en: 'Organize a meeting to align expectations and find consensus' },
      optionB: { es: 'Seguir el feedback del stakeholder más importante', en: 'Follow the feedback of the most important stakeholder' },
      optionC: { es: 'Implementar ambos feedbacks por separado', en: 'Implement both feedbacks separately' },
      optionD: { es: 'Ignorar el feedback que no le conviene', en: 'Ignore feedback that doesnt suit you' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `Como ${pos}, ¿cómo abordaría un problema que afecta a múltiples departamentos?`,
      questionTextEn: `As a ${pos}, how would you approach a problem affecting multiple departments?`,
      category: 'Colaboración Interdepartamental'
    }),
    options: {
      optionA: { es: 'Convocar a representantes de cada área para análisis conjunto y plan de acción', en: 'Convene representatives from each area for joint analysis and action plan' },
      optionB: { es: 'Resolver solo la parte que afecta a su área', en: 'Resolve only the part affecting your area' },
      optionC: { es: 'Esperar a que otro departamento tome la iniciativa', en: 'Wait for another department to take the initiative' },
      optionD: { es: 'Reportar el problema sin proponer soluciones', en: 'Report the problem without proposing solutions' },
      correctAnswer: 'A'
    }
  },
  {
    template: (pos: string) => ({
      questionTextEs: `¿Cómo debe un/a ${pos} manejar una situación donde las prácticas del equipo contradicen las políticas de la empresa?`,
      questionTextEn: `How should a ${pos} handle a situation where team practices contradict company policies?`,
      category: 'Cumplimiento'
    }),
    options: {
      optionA: { es: 'Comunicar la discrepancia, entender las razones y buscar alineación', en: 'Communicate the discrepancy, understand the reasons and seek alignment' },
      optionB: { es: 'Seguir las prácticas del equipo sin cuestionar', en: 'Follow team practices without questioning' },
      optionC: { es: 'Reportar inmediatamente a recursos humanos', en: 'Report immediately to human resources' },
      optionD: { es: 'Ignorar las políticas si el equipo funciona bien', en: 'Ignore policies if the team works well' },
      correctAnswer: 'A'
    }
  }
];

async function completeQuestions() {
  console.log('🚀 Starting to complete questions to 20 per difficulty level...');
  
  let totalEasyCreated = 0;
  let totalMediumCreated = 0;
  
  for (const position of JOB_POSITIONS) {
    // Get current counts by difficulty
    const counts = await prisma.technicalQuestion.groupBy({
      by: ['difficulty'],
      where: { jobPositionId: position.id },
      _count: true
    });
    
    const currentCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
    counts.forEach(c => {
      currentCounts[c.difficulty] = c._count;
    });
    
    const easyNeeded = Math.max(0, 20 - currentCounts.EASY);
    const mediumNeeded = Math.max(0, 20 - currentCounts.MEDIUM);
    
    if (easyNeeded === 0 && mediumNeeded === 0) continue;
    
    // Get max question number for this position
    const maxQ = await prisma.technicalQuestion.findFirst({
      where: { jobPositionId: position.id },
      orderBy: { questionNumber: 'desc' },
      select: { questionNumber: true }
    });
    let nextNum = (maxQ?.questionNumber || 0) + 1;
    
    const questionsToCreate = [];
    
    // Add EASY questions
    for (let i = 0; i < easyNeeded; i++) {
      const tpl = easyTemplates[i % easyTemplates.length];
      const qData = tpl.template(position.title);
      questionsToCreate.push({
        questionNumber: nextNum++,
        jobPositionId: position.id,
        questionText: qData.questionTextEs,
        questionTextEn: qData.questionTextEn,
        optionA: tpl.options.optionA.es,
        optionAEn: tpl.options.optionA.en,
        optionB: tpl.options.optionB.es,
        optionBEn: tpl.options.optionB.en,
        optionC: tpl.options.optionC.es,
        optionCEn: tpl.options.optionC.en,
        optionD: tpl.options.optionD.es,
        optionDEn: tpl.options.optionD.en,
        correctAnswer: tpl.options.correctAnswer,
        difficulty: TechnicalDifficulty.EASY,
        category: qData.category,
        weight: 1.0
      });
    }
    
    // Add MEDIUM questions
    for (let i = 0; i < mediumNeeded; i++) {
      const tpl = mediumTemplates[i % mediumTemplates.length];
      const qData = tpl.template(position.title);
      questionsToCreate.push({
        questionNumber: nextNum++,
        jobPositionId: position.id,
        questionText: qData.questionTextEs,
        questionTextEn: qData.questionTextEn,
        optionA: tpl.options.optionA.es,
        optionAEn: tpl.options.optionA.en,
        optionB: tpl.options.optionB.es,
        optionBEn: tpl.options.optionB.en,
        optionC: tpl.options.optionC.es,
        optionCEn: tpl.options.optionC.en,
        optionD: tpl.options.optionD.es,
        optionDEn: tpl.options.optionD.en,
        correctAnswer: tpl.options.correctAnswer,
        difficulty: TechnicalDifficulty.MEDIUM,
        category: qData.category,
        weight: 1.0
      });
    }
    
    if (questionsToCreate.length > 0) {
      await prisma.technicalQuestion.createMany({ data: questionsToCreate });
      totalEasyCreated += easyNeeded;
      totalMediumCreated += mediumNeeded;
    }
    
    if ((totalEasyCreated + totalMediumCreated) % 500 === 0 && (totalEasyCreated + totalMediumCreated) > 0) {
      console.log(`✅ Progress: ${totalEasyCreated} EASY + ${totalMediumCreated} MEDIUM created...`);
    }
  }
  
  console.log(`\n🎉 Completed!`);
  console.log(`   EASY questions added: ${totalEasyCreated}`);
  console.log(`   MEDIUM questions added: ${totalMediumCreated}`);
  
  // Final stats
  const finalStats = await prisma.technicalQuestion.groupBy({
    by: ['difficulty'],
    _count: true
  });
  
  console.log('\n📊 Final distribution:');
  finalStats.forEach(s => {
    console.log(`   ${s.difficulty}: ${s._count}`);
  });
  
  const total = await prisma.technicalQuestion.count();
  console.log(`\n📊 Total questions: ${total}`);
}

completeQuestions()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
