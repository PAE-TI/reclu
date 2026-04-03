import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const eqQuestions = [
  // AUTOCONCIENCIA (SELF_AWARENESS) - 5 preguntas
  {
    questionNumber: 1,
    questionText: "Cuando me siento frustrado en el trabajo, soy capaz de identificar exactamente qué está causando mi frustración.",
    questionType: "SELF_REPORT",
    dimension: "SELF_AWARENESS",
    subdimension: "Conciencia Emocional",
    optionA: "Totalmente en desacuerdo - Raramente sé qué me frustra",
    optionB: "En desacuerdo - A veces identifico la causa",
    optionC: "Neutral - Depende de la situación",
    optionD: "De acuerdo - Generalmente identifico la causa",
    optionE: "Totalmente de acuerdo - Siempre sé exactamente qué me frustra"
  },
  {
    questionNumber: 2,
    questionText: "Reconozco cómo mis emociones afectan mi rendimiento y mis decisiones laborales.",
    questionType: "SELF_REPORT",
    dimension: "SELF_AWARENESS",
    subdimension: "Autoconciencia Precisa",
    optionA: "Totalmente en desacuerdo - No veo la conexión",
    optionB: "En desacuerdo - Rara vez lo noto",
    optionC: "Neutral - A veces lo reconozco",
    optionD: "De acuerdo - Frecuentemente lo noto",
    optionE: "Totalmente de acuerdo - Siempre soy consciente de esta conexión"
  },
  {
    questionNumber: 3,
    questionText: "Soy consciente de mis fortalezas y limitaciones personales.",
    questionType: "SELF_REPORT",
    dimension: "SELF_AWARENESS",
    subdimension: "Autoconfianza",
    optionA: "Totalmente en desacuerdo - No conozco bien mis capacidades",
    optionB: "En desacuerdo - Tengo una idea vaga",
    optionC: "Neutral - Conozco algunas",
    optionD: "De acuerdo - Las conozco bien",
    optionE: "Totalmente de acuerdo - Tengo claridad total sobre mis capacidades"
  },
  {
    questionNumber: 4,
    questionText: "Puedo describir con precisión lo que estoy sintiendo en cualquier momento.",
    questionType: "SELF_REPORT",
    dimension: "SELF_AWARENESS",
    subdimension: "Vocabulario Emocional",
    optionA: "Totalmente en desacuerdo - Me cuesta expresar mis emociones",
    optionB: "En desacuerdo - Solo identifico emociones básicas",
    optionC: "Neutral - Puedo describir algunas emociones",
    optionD: "De acuerdo - Tengo buen vocabulario emocional",
    optionE: "Totalmente de acuerdo - Puedo describir matices sutiles"
  },
  {
    questionNumber: 5,
    questionText: "Entiendo cómo mi comportamiento impacta a las personas que me rodean.",
    questionType: "SELF_REPORT",
    dimension: "SELF_AWARENESS",
    subdimension: "Impacto Personal",
    optionA: "Totalmente en desacuerdo - No considero mi impacto en otros",
    optionB: "En desacuerdo - Rara vez lo pienso",
    optionC: "Neutral - A veces lo considero",
    optionD: "De acuerdo - Frecuentemente soy consciente",
    optionE: "Totalmente de acuerdo - Siempre considero mi impacto"
  },

  // AUTORREGULACIÓN (SELF_REGULATION) - 5 preguntas
  {
    questionNumber: 6,
    questionText: "Cuando estoy bajo presión, mantengo la calma y pienso con claridad.",
    questionType: "SELF_REPORT",
    dimension: "SELF_REGULATION",
    subdimension: "Control Emocional",
    optionA: "Totalmente en desacuerdo - La presión me paraliza",
    optionB: "En desacuerdo - Me cuesta mantener la calma",
    optionC: "Neutral - Depende de la situación",
    optionD: "De acuerdo - Generalmente mantengo el control",
    optionE: "Totalmente de acuerdo - La presión no afecta mi claridad mental"
  },
  {
    questionNumber: 7,
    questionText: "Puedo controlar impulsos y postergar la gratificación cuando es necesario.",
    questionType: "SELF_REPORT",
    dimension: "SELF_REGULATION",
    subdimension: "Autocontrol",
    optionA: "Totalmente en desacuerdo - Actúo impulsivamente",
    optionB: "En desacuerdo - Me cuesta esperar",
    optionC: "Neutral - A veces puedo controlarme",
    optionD: "De acuerdo - Generalmente controlo mis impulsos",
    optionE: "Totalmente de acuerdo - Tengo excelente autocontrol"
  },
  {
    questionNumber: 8,
    questionText: "Me adapto fácilmente a situaciones nuevas o cambios inesperados.",
    questionType: "SELF_REPORT",
    dimension: "SELF_REGULATION",
    subdimension: "Adaptabilidad",
    optionA: "Totalmente en desacuerdo - Los cambios me generan mucha ansiedad",
    optionB: "En desacuerdo - Me cuesta adaptarme",
    optionC: "Neutral - Depende del cambio",
    optionD: "De acuerdo - Me adapto con relativa facilidad",
    optionE: "Totalmente de acuerdo - Disfruto y abrazo los cambios"
  },
  {
    questionNumber: 9,
    questionText: "Acepto responsabilidad por mis errores sin buscar excusas o culpar a otros.",
    questionType: "SELF_REPORT",
    dimension: "SELF_REGULATION",
    subdimension: "Responsabilidad",
    optionA: "Totalmente en desacuerdo - Tiendo a justificarme",
    optionB: "En desacuerdo - A veces busco excusas",
    optionC: "Neutral - Depende de la situación",
    optionD: "De acuerdo - Generalmente acepto mis errores",
    optionE: "Totalmente de acuerdo - Siempre asumo mi responsabilidad"
  },
  {
    questionNumber: 10,
    questionText: "Mantengo mis compromisos y cumplo con lo que prometo.",
    questionType: "SELF_REPORT",
    dimension: "SELF_REGULATION",
    subdimension: "Integridad",
    optionA: "Totalmente en desacuerdo - Frecuentemente incumplo",
    optionB: "En desacuerdo - A veces no cumplo",
    optionC: "Neutral - Cumplo cuando puedo",
    optionD: "De acuerdo - Generalmente cumplo",
    optionE: "Totalmente de acuerdo - Siempre cumplo mis compromisos"
  },

  // MOTIVACIÓN (MOTIVATION) - 5 preguntas
  {
    questionNumber: 11,
    questionText: "Persisto en mis objetivos incluso cuando enfrento obstáculos o fracasos.",
    questionType: "SELF_REPORT",
    dimension: "MOTIVATION",
    subdimension: "Orientación al Logro",
    optionA: "Totalmente en desacuerdo - Me rindo fácilmente",
    optionB: "En desacuerdo - Los obstáculos me desaniman",
    optionC: "Neutral - Depende de la dificultad",
    optionD: "De acuerdo - Persisto a pesar de dificultades",
    optionE: "Totalmente de acuerdo - Los obstáculos aumentan mi determinación"
  },
  {
    questionNumber: 12,
    questionText: "Me fijo metas desafiantes y trabajo constantemente para alcanzarlas.",
    questionType: "SELF_REPORT",
    dimension: "MOTIVATION",
    subdimension: "Impulso de Logro",
    optionA: "Totalmente en desacuerdo - Prefiero metas fáciles",
    optionB: "En desacuerdo - Evito desafíos grandes",
    optionC: "Neutral - A veces me reto",
    optionD: "De acuerdo - Busco desafíos frecuentemente",
    optionE: "Totalmente de acuerdo - Siempre busco superarme"
  },
  {
    questionNumber: 13,
    questionText: "Encuentro satisfacción intrínseca en mi trabajo, más allá de las recompensas externas.",
    questionType: "SELF_REPORT",
    dimension: "MOTIVATION",
    subdimension: "Motivación Intrínseca",
    optionA: "Totalmente en desacuerdo - Solo trabajo por el salario",
    optionB: "En desacuerdo - Las recompensas son mi principal motivación",
    optionC: "Neutral - Ambos factores importan igual",
    optionD: "De acuerdo - El trabajo en sí me satisface",
    optionE: "Totalmente de acuerdo - Mi trabajo es mi pasión"
  },
  {
    questionNumber: 14,
    questionText: "Mantengo una actitud optimista incluso en situaciones difíciles.",
    questionType: "SELF_REPORT",
    dimension: "MOTIVATION",
    subdimension: "Optimismo",
    optionA: "Totalmente en desacuerdo - Tiendo al pesimismo",
    optionB: "En desacuerdo - Me cuesta ver el lado positivo",
    optionC: "Neutral - Depende de la situación",
    optionD: "De acuerdo - Generalmente soy optimista",
    optionE: "Totalmente de acuerdo - Siempre veo oportunidades en los problemas"
  },
  {
    questionNumber: 15,
    questionText: "Busco constantemente formas de mejorar mi desempeño y habilidades.",
    questionType: "SELF_REPORT",
    dimension: "MOTIVATION",
    subdimension: "Mejora Continua",
    optionA: "Totalmente en desacuerdo - Estoy satisfecho como estoy",
    optionB: "En desacuerdo - Rara vez busco mejorar",
    optionC: "Neutral - Mejoro cuando es necesario",
    optionD: "De acuerdo - Frecuentemente busco mejorar",
    optionE: "Totalmente de acuerdo - La mejora continua es mi prioridad"
  },

  // EMPATÍA (EMPATHY) - 5 preguntas
  {
    questionNumber: 16,
    questionText: "Puedo percibir las emociones de otros incluso cuando no las expresan verbalmente.",
    questionType: "SELF_REPORT",
    dimension: "EMPATHY",
    subdimension: "Percepción Emocional",
    optionA: "Totalmente en desacuerdo - No detecto emociones sutiles",
    optionB: "En desacuerdo - Me cuesta leer a las personas",
    optionC: "Neutral - A veces lo percibo",
    optionD: "De acuerdo - Generalmente percibo las emociones",
    optionE: "Totalmente de acuerdo - Soy muy perceptivo emocionalmente"
  },
  {
    questionNumber: 17,
    questionText: "Escucho activamente a los demás, tratando de entender su perspectiva.",
    questionType: "SELF_REPORT",
    dimension: "EMPATHY",
    subdimension: "Escucha Activa",
    optionA: "Totalmente en desacuerdo - Me distraigo fácilmente",
    optionB: "En desacuerdo - A veces interrumpo",
    optionC: "Neutral - Escucho según la situación",
    optionD: "De acuerdo - Presto atención genuina",
    optionE: "Totalmente de acuerdo - Escucho con total atención y comprensión"
  },
  {
    questionNumber: 18,
    questionText: "Me preocupo genuinamente por el bienestar de mis compañeros de trabajo.",
    questionType: "SELF_REPORT",
    dimension: "EMPATHY",
    subdimension: "Preocupación por Otros",
    optionA: "Totalmente en desacuerdo - Me enfoco solo en mí",
    optionB: "En desacuerdo - Rara vez pienso en su bienestar",
    optionC: "Neutral - Me preocupo ocasionalmente",
    optionD: "De acuerdo - Frecuentemente me preocupo por ellos",
    optionE: "Totalmente de acuerdo - Su bienestar es importante para mí"
  },
  {
    questionNumber: 19,
    questionText: "Respeto y valoro las perspectivas diferentes a las mías.",
    questionType: "SELF_REPORT",
    dimension: "EMPATHY",
    subdimension: "Respeto a la Diversidad",
    optionA: "Totalmente en desacuerdo - Creo que mi perspectiva es la correcta",
    optionB: "En desacuerdo - Me cuesta aceptar otras opiniones",
    optionC: "Neutral - Depende del tema",
    optionD: "De acuerdo - Valoro otras perspectivas",
    optionE: "Totalmente de acuerdo - Busco activamente diferentes puntos de vista"
  },
  {
    questionNumber: 20,
    questionText: "Puedo ponerme en el lugar de otros y entender sus sentimientos.",
    questionType: "SELF_REPORT",
    dimension: "EMPATHY",
    subdimension: "Toma de Perspectiva",
    optionA: "Totalmente en desacuerdo - Me cuesta entender a otros",
    optionB: "En desacuerdo - Rara vez considero sus sentimientos",
    optionC: "Neutral - Lo intento a veces",
    optionD: "De acuerdo - Frecuentemente entiendo sus sentimientos",
    optionE: "Totalmente de acuerdo - Comprendo profundamente a los demás"
  },

  // HABILIDADES SOCIALES (SOCIAL_SKILLS) - 5 preguntas
  {
    questionNumber: 21,
    questionText: "Comunico mis ideas de manera clara y efectiva.",
    questionType: "SELF_REPORT",
    dimension: "SOCIAL_SKILLS",
    subdimension: "Comunicación",
    optionA: "Totalmente en desacuerdo - Me cuesta expresarme",
    optionB: "En desacuerdo - A veces no me entienden",
    optionC: "Neutral - Depende del contexto",
    optionD: "De acuerdo - Generalmente me comunico bien",
    optionE: "Totalmente de acuerdo - Soy un comunicador excelente"
  },
  {
    questionNumber: 22,
    questionText: "Puedo resolver conflictos de manera constructiva y encontrar soluciones ganar-ganar.",
    questionType: "SELF_REPORT",
    dimension: "SOCIAL_SKILLS",
    subdimension: "Manejo de Conflictos",
    optionA: "Totalmente en desacuerdo - Evito los conflictos",
    optionB: "En desacuerdo - Los conflictos me generan estrés",
    optionC: "Neutral - A veces los manejo bien",
    optionD: "De acuerdo - Generalmente resuelvo conflictos efectivamente",
    optionE: "Totalmente de acuerdo - Soy hábil negociando soluciones"
  },
  {
    questionNumber: 23,
    questionText: "Colaboro efectivamente con otros para lograr objetivos comunes.",
    questionType: "SELF_REPORT",
    dimension: "SOCIAL_SKILLS",
    subdimension: "Trabajo en Equipo",
    optionA: "Totalmente en desacuerdo - Prefiero trabajar solo",
    optionB: "En desacuerdo - Me cuesta colaborar",
    optionC: "Neutral - Colaboro cuando es necesario",
    optionD: "De acuerdo - Disfruto el trabajo en equipo",
    optionE: "Totalmente de acuerdo - Soy un excelente colaborador"
  },
  {
    questionNumber: 24,
    questionText: "Construyo y mantengo relaciones de confianza con colegas y clientes.",
    questionType: "SELF_REPORT",
    dimension: "SOCIAL_SKILLS",
    subdimension: "Construcción de Relaciones",
    optionA: "Totalmente en desacuerdo - Me cuesta conectar con otros",
    optionB: "En desacuerdo - Mis relaciones son superficiales",
    optionC: "Neutral - Tengo algunas relaciones sólidas",
    optionD: "De acuerdo - Construyo buenas relaciones",
    optionE: "Totalmente de acuerdo - Tengo relaciones profundas y duraderas"
  },
  {
    questionNumber: 25,
    questionText: "Puedo influir positivamente en otros e inspirarlos hacia metas compartidas.",
    questionType: "SELF_REPORT",
    dimension: "SOCIAL_SKILLS",
    subdimension: "Influencia e Inspiración",
    optionA: "Totalmente en desacuerdo - No tengo influencia en otros",
    optionB: "En desacuerdo - Rara vez inspiro a otros",
    optionC: "Neutral - A veces influyo positivamente",
    optionD: "De acuerdo - Frecuentemente inspiro a otros",
    optionE: "Totalmente de acuerdo - Soy un líder inspirador"
  }
];

async function seedEQQuestions() {
  console.log('Seeding EQ questions...');
  
  // Delete existing questions
  await prisma.eQQuestion.deleteMany({});
  console.log('Deleted existing EQ questions');
  
  // Create new questions
  for (const q of eqQuestions) {
    await prisma.eQQuestion.create({
      data: {
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        questionType: q.questionType as any,
        dimension: q.dimension as any,
        subdimension: q.subdimension,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        optionE: q.optionE,
        isActive: true
      }
    });
    console.log(`Created question ${q.questionNumber}: ${q.dimension}`);
  }
  
  const count = await prisma.eQQuestion.count();
  console.log(`\n✅ Successfully seeded ${count} EQ questions!`);
}

seedEQQuestions()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
