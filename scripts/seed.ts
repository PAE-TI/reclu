
import { PrismaClient, QuestionType, DiscDimension, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// 24 preguntas DISC basadas en la investigación metodológica
const discQuestions = [
  // Preguntas 1-12: Basadas en Adjetivos
  {
    questionNumber: 1,
    questionText: "Selecciona la palabra que mejor te describe:",
    questionType: QuestionType.ADJECTIVE,
    optionA: "Decidido",
    optionB: "Persuasivo", 
    optionC: "Paciente",
    optionD: "Preciso"
  },
  {
    questionNumber: 2,
    questionText: "¿Cuál de estas características te define más?",
    questionType: QuestionType.ADJECTIVE,
    optionA: "Competitivo",
    optionB: "Entusiasta",
    optionC: "Leal",
    optionD: "Sistemático"
  },
  {
    questionNumber: 3,
    questionText: "En tu trabajo prefieres ser:",
    questionType: QuestionType.ADJECTIVE,
    optionA: "Directo",
    optionB: "Inspirador",
    optionC: "Confiable",
    optionD: "Metódico"
  },
  {
    questionNumber: 4,
    questionText: "Los demás te ven como alguien:",
    questionType: QuestionType.ADJECTIVE,
    optionA: "Audaz",
    optionB: "Sociable",
    optionC: "Estable",
    optionD: "Analítico"
  },
  {
    questionNumber: 5,
    questionText: "Tu fortaleza principal es ser:",
    questionType: QuestionType.ADJECTIVE,
    optionA: "Independiente",
    optionB: "Carismático",
    optionC: "Colaborativo",
    optionD: "Detallista"
  },
  {
    questionNumber: 6,
    questionText: "En situaciones difíciles eres:",
    questionType: QuestionType.ADJECTIVE,
    optionA: "Determinado",
    optionB: "Optimista",
    optionC: "Calmado",
    optionD: "Cauteloso"
  },
  {
    questionNumber: 7,
    questionText: "Tu estilo de comunicación es:",
    questionType: QuestionType.ADJECTIVE,
    optionA: "Franco",
    optionB: "Expresivo",
    optionC: "Diplomático",
    optionD: "Reservado"
  },
  {
    questionNumber: 8,
    questionText: "Cuando lideras un equipo eres:",
    questionType: QuestionType.ADJECTIVE,
    optionA: "Asertivo",
    optionB: "Motivador",
    optionC: "Comprensivo",
    optionD: "Organizado"
  },
  {
    questionNumber: 9,
    questionText: "Ante los cambios eres:",
    questionType: QuestionType.ADJECTIVE,
    optionA: "Agresivo",
    optionB: "Adaptable",
    optionC: "Resistente",
    optionD: "Prudente"
  },
  {
    questionNumber: 10,
    questionText: "Tu mayor motivación es:",
    questionType: QuestionType.ADJECTIVE,
    optionA: "Ganar",
    optionB: "Reconocimiento",
    optionC: "Armonía",
    optionD: "Exactitud"
  },
  {
    questionNumber: 11,
    questionText: "En el trabajo valoras más:",
    questionType: QuestionType.ADJECTIVE,
    optionA: "Resultados",
    optionB: "Relaciones",
    optionC: "Estabilidad",
    optionD: "Calidad"
  },
  {
    questionNumber: 12,
    questionText: "Tu personalidad se caracteriza por ser:",
    questionType: QuestionType.ADJECTIVE,
    optionA: "Enérgica",
    optionB: "Extrovertida",
    optionC: "Serena",
    optionD: "Reflexiva"
  },

  // Preguntas 13-24: Basadas en Escenarios
  {
    questionNumber: 13,
    questionText: "En una reunión de equipo, típicamente:",
    questionType: QuestionType.SCENARIO,
    optionA: "Tomo el control y dirijo la discusión",
    optionB: "Mantengo la energía alta y motivo a otros",
    optionC: "Escucho atentamente y apoyo las ideas del grupo",
    optionD: "Analizo los datos antes de contribuir"
  },
  {
    questionNumber: 14,
    questionText: "Cuando enfrento un problema complejo:",
    questionType: QuestionType.SCENARIO,
    optionA: "Actúo rápidamente para resolverlo",
    optionB: "Busco input de otros para encontrar la solución",
    optionC: "Trabajo paso a paso sistemáticamente",
    optionD: "Investigo a fondo antes de decidir"
  },
  {
    questionNumber: 15,
    questionText: "Al trabajar en equipo prefiero:",
    questionType: QuestionType.SCENARIO,
    optionA: "Ser el líder del proyecto",
    optionB: "Ser el generador de ideas creativas",
    optionC: "Ser el mediador y facilitador",
    optionD: "Ser el experto técnico"
  },
  {
    questionNumber: 16,
    questionText: "Cuando hay conflictos en el equipo:",
    questionType: QuestionType.SCENARIO,
    optionA: "Confronto directamente el problema",
    optionB: "Trato de mantener un ambiente positivo",
    optionC: "Busco una solución que satisfaga a todos",
    optionD: "Analizo las causas objetivamente"
  },
  {
    questionNumber: 17,
    questionText: "Al recibir feedback crítico:",
    questionType: QuestionType.SCENARIO,
    optionA: "Lo uso como motivación para mejorar",
    optionB: "Me enfoco en mantener las relaciones positivas",
    optionC: "Lo proceso calmadamente antes de reaccionar",
    optionD: "Analizo cada punto detalladamente"
  },
  {
    questionNumber: 18,
    questionText: "Cuando tengo que tomar una decisión importante:",
    questionType: QuestionType.SCENARIO,
    optionA: "Decido rápidamente y me mantengo firme",
    optionB: "Consulto con otros y considero el impacto en las personas",
    optionC: "Tomo el tiempo necesario para evaluar todas las opciones",
    optionD: "Recopilo toda la información relevante antes de decidir"
  },
  {
    questionNumber: 19,
    questionText: "En situaciones de alta presión:",
    questionType: QuestionType.SCENARIO,
    optionA: "Prospero y doy lo mejor de mí",
    optionB: "Mantengo la moral alta del equipo",
    optionC: "Me mantengo calmado y centrado",
    optionD: "Me enfoco en seguir procedimientos establecidos"
  },
  {
    questionNumber: 20,
    questionText: "Al presentar una propuesta nueva:",
    questionType: QuestionType.SCENARIO,
    optionA: "Presento los beneficios y presiono por una decisión",
    optionB: "Hago una presentación persuasiva y entretenida",
    optionC: "Explico calmadamente y respondo todas las preguntas",
    optionD: "Proporciono datos detallados y análisis completo"
  },
  {
    questionNumber: 21,
    questionText: "Cuando diriges un proyecto prefieres:",
    questionType: QuestionType.SCENARIO,
    optionA: "Establecer metas ambiciosas y exigir resultados",
    optionB: "Crear un ambiente colaborativo y divertido",
    optionC: "Asegurarme de que todos se sientan incluidos",
    optionD: "Seguir metodologías probadas y procesos estructurados"
  },
  {
    questionNumber: 22,
    questionText: "Al manejar las fechas límite:",
    questionType: QuestionType.SCENARIO,
    optionA: "Presiono para cumplirlas antes de tiempo",
    optionB: "Mantengo al equipo motivado durante el proceso",
    optionC: "Planifico cuidadosamente para evitar el estrés",
    optionD: "Me aseguro de que todo esté perfecto antes de entregar"
  },
  {
    questionNumber: 23,
    questionText: "Cuando algo sale mal en un proyecto:",
    questionType: QuestionType.SCENARIO,
    optionA: "Tomo acción inmediata para solucionarlo",
    optionB: "Me enfoco en mantener la motivación del equipo",
    optionC: "Trabajo para restablecer la estabilidad",
    optionD: "Analizo qué salió mal para evitarlo en el futuro"
  },
  {
    questionNumber: 24,
    questionText: "En tu ambiente de trabajo ideal:",
    questionType: QuestionType.SCENARIO,
    optionA: "Hay desafíos constantes y oportunidades de liderazgo",
    optionB: "Hay interacción social y reconocimiento por los logros",
    optionC: "Hay estabilidad, cooperación y un ambiente armonioso",
    optionD: "Hay tiempo para hacer las cosas correctamente y con precisión"
  }
];

// Interpretaciones para cada tipo de personalidad DISC
const discInterpretations = [
  {
    personalityType: "D",
    title: "El Conductor - Dominante",
    description: "Personas orientadas a resultados que aceptan desafíos, toman acciones rápidas y asumen responsabilidades. Tienden a ser directas, decisivas y orientadas a objetivos.",
    strengths: ["Liderazgo natural", "Toma decisiones rápidas", "Orientado a resultados", "Acepta desafíos", "Independiente", "Competitivo"],
    challenges: ["Puede ser muy directo", "Impaciencia con detalles", "Tendencia a dominar", "Puede ignorar sentimientos", "Resistencia a seguir reglas"],
    motivators: ["Desafíos nuevos", "Autoridad y control", "Reconocimiento por logros", "Libertad para actuar", "Competencia"],
    stressors: ["Pérdida de control", "Rutinas rígidas", "Análisis excesivo", "Inactividad", "Micromanagement"],
    workStyle: "Trabaja rápidamente, toma iniciativa, busca eficiencia y se enfoca en el resultado final. Prefiere autonomía y autoridad para tomar decisiones.",
    communicationStyle: "Directo, conciso y al punto. Prefiere comunicación cara a cara y se enfoca en los hechos y resultados más que en los detalles.",
    leadershipStyle: "Líder autoritativo que establece metas claras y espera resultados. Delega responsabilidades y toma decisiones firmes.",
    teamRole: "Líder natural, iniciador de proyectos, solucionador de problemas y motor del equipo.",
    developmentTips: ["Desarrollar paciencia", "Mejorar habilidades de escucha", "Considerar impacto en otros", "Aprender a delegar efectivamente"],
    careerSuggestions: ["CEO/Ejecutivo", "Emprendedor", "Director de ventas", "Gerente de proyecto", "Consultor", "Abogado litigante"]
  },
  {
    personalityType: "I",
    title: "El Promotor - Influyente",
    description: "Personas extrovertidas y entusiastas que influencian y persuaden a otros. Son optimistas, sociables y se enfocan en las personas y en crear relaciones positivas.",
    strengths: ["Habilidades de comunicación", "Entusiasmo contagioso", "Persuasión natural", "Optimismo", "Networking", "Creatividad"],
    challenges: ["Puede ser desorganizado", "Tendencia a ser impulsivo", "Dificultad con detalles", "Puede sobre-prometer", "Sensible a la crítica"],
    motivators: ["Reconocimiento público", "Interacción social", "Variedad en el trabajo", "Oportunidades de influir", "Ambiente positivo"],
    stressors: ["Aislamiento", "Trabajo rutinario", "Crítica personal", "Ambientes hostiles", "Falta de reconocimiento"],
    workStyle: "Trabaja mejor en equipo, busca variedad, se motiva con interacción social y prefiere tareas que involucren persuasión o presentaciones.",
    communicationStyle: "Expresivo, entusiasta y personal. Disfruta las conversaciones y prefiere comunicación verbal sobre escrita.",
    leadershipStyle: "Líder inspirador que motiva a través del entusiasmo. Crea visión compartida y fomenta la colaboración.",
    teamRole: "Motivador del equipo, generador de ideas, embajador externo y facilitador de relaciones.",
    developmentTips: ["Mejorar organización", "Enfocarse en seguimiento", "Desarrollar atención al detalle", "Aprender a manejar críticas constructivamente"],
    careerSuggestions: ["Ventas", "Marketing", "Relaciones públicas", "Capacitación/Entrenamiento", "Recursos humanos", "Consultoría"]
  },
  {
    personalityType: "S",
    title: "El Colaborador - Estable",
    description: "Personas pacientes, leales y orientadas al equipo. Valoran la estabilidad, la cooperación y prefieren ambientes armoniosos y predecibles.",
    strengths: ["Paciencia", "Lealtad", "Habilidades de escucha", "Trabajo en equipo", "Confiabilidad", "Diplomacia"],
    challenges: ["Resistencia al cambio", "Dificultad para decir 'no'", "Evita conflictos", "Puede ser muy cauteloso", "Toma decisiones lentamente"],
    motivators: ["Estabilidad laboral", "Reconocimiento por contribución", "Ambiente armonioso", "Trabajo en equipo", "Procedimientos claros"],
    stressors: ["Cambios súbitos", "Conflictos interpersonales", "Presión de tiempo", "Competencia agresiva", "Ambigüedad"],
    workStyle: "Trabaja de manera constante y metódica, prefiere rutinas establecidas y se enfoca en la calidad sobre la velocidad.",
    communicationStyle: "Diplomático, considerado y paciente. Prefiere escuchar antes de hablar y evita la confrontación.",
    leadershipStyle: "Líder servidor que apoya y desarrolla a otros. Crea consenso y mantiene la armonía del equipo.",
    teamRole: "Mediador, soporte del equipo, implementador confiable y mantiene la moral grupal.",
    developmentTips: ["Desarrollar adaptabilidad", "Aprender a manejar conflictos", "Ser más asertivo", "Tomar decisiones más rápido"],
    careerSuggestions: ["Recursos humanos", "Consejería", "Enfermería", "Educación", "Administración", "Servicio al cliente"]
  },
  {
    personalityType: "C",
    title: "El Analista - Concienzudo",
    description: "Personas analíticas, precisas y orientadas a la calidad. Valoran la exactitud, siguen procedimientos establecidos y se enfocan en hacer las cosas correctamente.",
    strengths: ["Atención al detalle", "Análisis sistemático", "Calidad del trabajo", "Seguimiento de estándares", "Precisión", "Planificación"],
    challenges: ["Perfeccionismo excesivo", "Análisis paralítico", "Resistencia a plazos ajustados", "Dificultad con ambigüedad", "Crítico consigo mismo"],
    motivators: ["Estándares de calidad", "Tiempo suficiente", "Reconocimiento por expertise", "Procedimientos claros", "Trabajo independiente"],
    stressors: ["Fechas límite apretadas", "Cambios inesperados", "Críticas al trabajo", "Ambigüedad en instrucciones", "Presión social"],
    workStyle: "Trabaja de manera sistemática y cuidadosa, requiere información completa antes de actuar y se enfoca en la precisión y calidad.",
    communicationStyle: "Diplomático, preciso y basado en hechos. Prefiere comunicación escrita y preparada sobre improvisación.",
    leadershipStyle: "Líder experto que guía a través del conocimiento. Establece estándares altos y procesos estructurados.",
    teamRole: "Especialista técnico, controlador de calidad, planificador estratégico y guardián de estándares.",
    developmentTips: ["Desarrollar flexibilidad", "Aprender a tomar decisiones con información incompleta", "Mejorar habilidades interpersonales", "Gestionar perfeccionismo"],
    careerSuggestions: ["Analista financiero", "Ingeniero", "Investigador", "Contador", "Analista de sistemas", "Arquitecto"]
  },
  {
    personalityType: "DI",
    title: "El Inspirador - Dominante e Influyente",
    description: "Combinación de liderazgo enérgico con habilidades persuasivas. Son líderes carismáticos que pueden motivar e inspirar a otros hacia objetivos ambiciosos.",
    strengths: ["Liderazgo carismático", "Visión inspiradora", "Habilidades de persuasión", "Energía alta", "Orientación a resultados", "Networking efectivo"],
    challenges: ["Puede ser impaciente", "Tendencia a dominar conversaciones", "Dificultad con detalles rutinarios", "Puede ser muy competitivo"],
    motivators: ["Desafíos emocionantes", "Reconocimiento y prestigio", "Oportunidades de liderazgo", "Variedad en el trabajo", "Influencia sobre otros"],
    stressors: ["Rutinas monótonas", "Micromanagement", "Falta de reconocimiento", "Ambientes muy estructurados"],
    workStyle: "Combina eficiencia orientada a resultados con habilidades interpersonales. Trabaja mejor en roles que requieren liderazgo y persuasión.",
    communicationStyle: "Directo pero persuasivo, entusiasta y convincente. Combina hechos con inspiración.",
    leadershipStyle: "Líder visionario que inspira con energía y entusiasmo. Establece metas ambiciosas y motiva al equipo.",
    teamRole: "Líder inspirador, motor del cambio, generador de visión y embajador del equipo.",
    developmentTips: ["Desarrollar paciencia", "Mejorar habilidades de escucha", "Enfocarse en desarrollo de otros", "Gestionar la intensidad"],
    careerSuggestions: ["Director ejecutivo", "Emprendedor", "Director de ventas", "Consultor senior", "Político", "Orador motivacional"]
  },
  {
    personalityType: "DC",
    title: "El Solucionador - Dominante y Concienzudo",
    description: "Combinación de orientación a resultados con análisis sistemático. Son solucionadores independientes que buscan eficiencia y calidad.",
    strengths: ["Análisis objetivo", "Independencia", "Solución eficiente de problemas", "Estándares altos", "Pensamiento crítico", "Orientación a resultados"],
    challenges: ["Puede ser muy crítico", "Resistencia a compromisos", "Impaciencia con ineficiencias", "Tendencia a trabajar solo"],
    motivators: ["Proyectos desafiantes", "Autonomía", "Reconocimiento por expertise", "Oportunidades de mejora", "Trabajo independiente"],
    stressors: ["Incompetencia de otros", "Procesos ineficientes", "Decisiones emocionales", "Ambientes caóticos"],
    workStyle: "Combina eficiencia con precisión. Prefiere trabajar independientemente en proyectos complejos que requieren análisis y resultados.",
    communicationStyle: "Directo y basado en hechos, preciso pero conciso. Prefiere comunicación estructurada y preparada.",
    leadershipStyle: "Líder experto que guía a través del conocimiento y resultados. Establece estándares altos y espera competencia.",
    teamRole: "Solucionador de problemas complejos, especialista técnico, estratega y controlador de calidad.",
    developmentTips: ["Desarrollar paciencia con otros", "Mejorar habilidades interpersonales", "Aprender a delegar", "Ser más flexible"],
    careerSuggestions: ["Ingeniero en jefe", "Arquitecto de sistemas", "Consultor técnico", "Director de operaciones", "Investigador senior"]
  },
  {
    personalityType: "IS",
    title: "El Consejero - Influyente y Estable",
    description: "Combinación de habilidades interpersonales con paciencia y lealtad. Son excelentes para mantener relaciones y crear ambientes positivos y cooperativos.",
    strengths: ["Excelentes relaciones interpersonales", "Habilidades de consejería", "Paciencia", "Lealtad", "Trabajo en equipo", "Comunicación efectiva"],
    challenges: ["Evita conflictos necesarios", "Puede ser indeciso", "Dificultad para establecer límites", "Sensible a críticas"],
    motivators: ["Relaciones armoniosas", "Reconocimiento por contribución", "Ambiente de equipo", "Estabilidad", "Ayudar a otros"],
    stressors: ["Conflictos interpersonales", "Cambios súbitos", "Crítica personal", "Competencia agresiva", "Aislamiento"],
    workStyle: "Se enfoca en relaciones y colaboración. Trabaja mejor en ambientes estables donde puede ayudar y apoyar a otros.",
    communicationStyle: "Cálido, empático y considerado. Excelente para escuchar y hacer que otros se sientan valorados.",
    leadershipStyle: "Líder servant que desarrolla y apoya a otros. Crea consenso y mantiene la moral alta.",
    teamRole: "Facilitador de relaciones, consejero del equipo, mediador y promotor de la colaboración.",
    developmentTips: ["Desarrollar asertividad", "Aprender a manejar conflictos", "Ser más decisivo", "Establecer límites claros"],
    careerSuggestions: ["Recursos humanos", "Consejería", "Trabajo social", "Enfermería", "Educación", "Mediación"]
  },
  {
    personalityType: "SC",
    title: "El Especialista - Estable y Concienzudo",
    description: "Combinación de paciencia con precisión y calidad. Son especialistas confiables que se enfocan en hacer las cosas correctamente con consistencia.",
    strengths: ["Consistencia", "Confiabilidad", "Atención al detalle", "Paciencia", "Calidad del trabajo", "Seguimiento de procedimientos"],
    challenges: ["Resistencia al cambio", "Muy cauteloso", "Puede ser lento para decidir", "Evita riesgos"],
    motivators: ["Estabilidad", "Procedimientos claros", "Tiempo suficiente", "Reconocimiento por calidad", "Ambiente predecible"],
    stressors: ["Cambios inesperados", "Presión de tiempo", "Ambigüedad", "Conflictos", "Toma de riesgos"],
    workStyle: "Trabaja de manera sistemática y cuidadosa. Se enfoca en la calidad y consistencia, prefiere rutinas establecidas.",
    communicationStyle: "Diplomático, preciso y considerado. Prefiere comunicación estructurada y evita confrontaciones.",
    leadershipStyle: "Líder estable que mantiene estándares y procesos. Guía a través del ejemplo y la consistencia.",
    teamRole: "Especialista confiable, guardián de la calidad, implementador de procesos y estabilizador del equipo.",
    developmentTips: ["Desarrollar adaptabilidad", "Ser más asertivo", "Acelerar toma de decisiones", "Aceptar cambios graduales"],
    careerSuggestions: ["Especialista técnico", "Analista de calidad", "Bibliotecario", "Contador", "Administrador", "Técnico especializado"]
  },
  {
    personalityType: "CD",
    title: "El Perfeccionista - Concienzudo y Dominante",  
    description: "Combinación de análisis sistemático con orientación a resultados. Son perfeccionistas que buscan la excelencia y controlan la calidad de los resultados.",
    strengths: ["Estándares muy altos", "Análisis crítico", "Orientación a resultados", "Independencia", "Solución sistemática de problemas", "Control de calidad"],
    challenges: ["Perfeccionismo excesivo", "Crítico con otros", "Impaciencia con errores", "Tendencia al aislamiento"],
    motivators: ["Proyectos de alta calidad", "Reconocimiento por expertise", "Autonomía", "Estándares de excelencia", "Trabajo independiente"],
    stressors: ["Trabajo de baja calidad", "Decisiones apresuradas", "Incompetencia", "Compromisos de calidad"],
    workStyle: "Combina análisis sistemático con orientación a resultados. Busca perfección y eficiencia simultáneamente.",
    communicationStyle: "Preciso y directo, basado en hechos y análisis. Puede ser crítico cuando los estándares no se cumplen.",
    leadershipStyle: "Líder exigente que establece estándares muy altos. Espera competencia y resultados de calidad.",
    teamRole: "Controlador de calidad, auditor interno, especialista crítico y guardián de estándares.",
    developmentTips: ["Desarrollar tolerancia", "Mejorar habilidades interpersonales", "Ser más flexible", "Gestionar perfeccionismo"],
    careerSuggestions: ["Auditor", "Ingeniero de calidad", "Investigador", "Arquitecto", "Consultor técnico", "Analista senior"]
  }
];

async function main() {
  console.log('🌱 Iniciando seed del sistema Reclu...');

  try {
    // Crear usuario administrador de prueba
    const hashedPassword = await bcrypt.hash('johndoe123', 12);
    
    const testUser = await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        role: UserRole.ADMIN,
      },
    });

    console.log('✅ Usuario administrador creado:', testUser.email);

    // Crear usuario johnwainer@gmail.com
    const hashedPasswordJW = await bcrypt.hash('123456', 12);
    
    const johnWainerUser = await prisma.user.upsert({
      where: { email: 'johnwainer@gmail.com' },
      update: { password: hashedPasswordJW },
      create: {
        email: 'johnwainer@gmail.com',
        password: hashedPasswordJW,
        firstName: 'John',
        lastName: 'Wainer',
        name: 'John Wainer',
        role: UserRole.ADMIN,
      },
    });

    console.log('✅ Usuario johnwainer@gmail.com creado:', johnWainerUser.email);

    // Limpiar preguntas existentes
    await prisma.discQuestion.deleteMany();
    console.log('🧹 Preguntas existentes eliminadas');

    // Crear las 24 preguntas DISC
    for (const question of discQuestions) {
      await prisma.discQuestion.create({
        data: question,
      });
    }

    console.log('✅ 24 preguntas DISC creadas exitosamente');

    // Las interpretaciones se crearán dinámicamente cuando se generen resultados
    // Por ahora solo guardamos las interpretaciones en memoria para usar cuando sea necesario
    console.log('✅ Interpretaciones DISC preparadas para uso dinámico');

    // Mostrar estadísticas finales
    const questionCount = await prisma.discQuestion.count();
    const interpretationCount = await prisma.discInterpretation.count();
    const userCount = await prisma.user.count();

    console.log('\n📊 Estadísticas del seed:');
    console.log(`👥 Usuarios: ${userCount}`);
    console.log(`❓ Preguntas DISC: ${questionCount}`);
    console.log(`📖 Interpretaciones: ${interpretationCount}`);
    console.log('\n🎉 ¡Seed completado exitosamente!');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('❌ Error fatal:', e);
  process.exit(1);
});
