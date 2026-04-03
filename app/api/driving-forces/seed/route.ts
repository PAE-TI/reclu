
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST - Crear preguntas de ejemplo para Driving Forces
export async function POST(req: NextRequest) {
  try {
    // Verificar si ya existen preguntas
    const existingQuestions = await prisma.drivingForcesQuestion.findMany();
    
    if (existingQuestions.length > 0) {
      return NextResponse.json(
        { message: 'Las preguntas ya existen' },
        { status: 200 }
      );
    }

    const sampleQuestions = [
      {
        questionNumber: 1,
        questionText: "¿Cuál de estas afirmaciones describe mejor cómo prefieres abordar las situaciones laborales?",
        statementA: "Me gusta investigar a fondo antes de actuar y busco comprender todos los aspectos del problema.",
        statementB: "Confío en mi experiencia previa e intuición para tomar decisiones rápidas.",
        statementC: "Me enfoco en encontrar la solución más eficiente que genere los mejores resultados.",
        statementD: "Prefiero actuar sin buscar reconocimiento personal, enfocándome en completar la tarea.",
        forceA: "INTELECTUAL",
        forceB: "INSTINTIVO", 
        forceC: "PRACTICO",
        forceD: "ALTRUISTA",
        category: "Estilo de Trabajo"
      },
      {
        questionNumber: 2,
        questionText: "En un ambiente de trabajo, ¿qué tipo de entorno te resulta más motivador?",
        statementA: "Un espacio equilibrado donde puedo mantener armonía con mis colegas y el ambiente.",
        statementB: "Un entorno objetivo donde las decisiones se basan en hechos y funcionalidad.",
        statementC: "Un lugar donde puedo ayudar a otros y encontrar satisfacción personal en hacerlo.",
        statementD: "Un ambiente donde ayudo a otros con propósitos específicos y objetivos claros.",
        forceA: "ARMONIOSO",
        forceB: "OBJETIVO",
        forceC: "BENEVOLO", 
        forceD: "INTENCIONAL",
        category: "Ambiente de Trabajo"
      },
      {
        questionNumber: 3,
        questionText: "¿Qué tipo de reconocimiento o posición te resulta más atractiva?",
        statementA: "Busco estatus, reconocimiento y posiciones de control e influencia.",
        statementB: "Prefiero roles de apoyo donde no necesito estar en el centro de atención.",
        statementC: "Me atraen enfoques tradicionales y métodos que han sido probados en el tiempo.",
        statementD: "Me emocionan las nuevas ideas y oportunidades fuera de los sistemas establecidos.",
        forceA: "DOMINANTE",
        forceB: "COLABORATIVO",
        forceC: "ESTRUCTURADO",
        forceD: "RECEPTIVO",
        category: "Liderazgo y Posición"
      },
      {
        questionNumber: 4,
        questionText: "Al enfrentar un nuevo proyecto, ¿cuál es tu primera inclinación?",
        statementA: "Busco aprender todo lo que pueda sobre el tema antes de comenzar.",
        statementB: "Confío en lo que he aprendido de experiencias similares anteriores.",
        statementC: "Me enfoco en qué resultados tangibles puedo lograr y cómo medirlos.",
        statementD: "Me pregunto cómo puedo completar esto sin crear expectativas de reconocimiento.",
        forceA: "INTELECTUAL",
        forceB: "INSTINTIVO",
        forceC: "PRACTICO", 
        forceD: "ALTRUISTA",
        category: "Enfoque de Proyectos"
      },
      {
        questionNumber: 5,
        questionText: "¿Qué te motiva más en tu desarrollo profesional?",
        statementA: "Crear un ambiente de trabajo armonioso y equilibrado para todos.",
        statementB: "Tomar decisiones basadas en datos objetivos y funcionalidad práctica.",
        statementC: "Ayudar a otros porque me genera satisfacción personal genuina.",
        statementD: "Ayudar a otros cuando hay objetivos específicos y propósitos claros que cumplir.",
        forceA: "ARMONIOSO",
        forceB: "OBJETIVO",
        forceC: "BENEVOLO",
        forceD: "INTENCIONAL", 
        category: "Desarrollo Profesional"
      },
      {
        questionNumber: 6,
        questionText: "¿Cómo prefieres que se estructuren tus responsabilidades laborales?",
        statementA: "Con autoridad clara y reconocimiento por mis contribuciones y liderazgo.",
        statementB: "En un rol de apoyo donde puedo contribuir sin necesidad de destacar.",
        statementC: "Siguiendo métodos estructurados y enfoques tradicionales que funcionan.",
        statementD: "Con flexibilidad para explorar nuevas ideas y oportunidades innovadoras.",
        forceA: "DOMINANTE",
        forceB: "COLABORATIVO",
        forceC: "ESTRUCTURADO",
        forceD: "RECEPTIVO",
        category: "Estructura de Trabajo"
      },
      {
        questionNumber: 7,
        questionText: "¿Qué tipo de desafíos laborales te resultan más energizantes?",
        statementA: "Problemas complejos que requieren investigación profunda y análisis detallado.",
        statementB: "Situaciones donde puedo aplicar mi experiencia previa y tomar decisiones instintivas.",
        statementC: "Desafíos donde puedo optimizar procesos y generar resultados eficientes.",
        statementD: "Tareas que puedo completar bien sin necesidad de reconocimiento externo.",
        forceA: "INTELECTUAL",
        forceB: "INSTINTIVO", 
        forceC: "PRACTICO",
        forceD: "ALTRUISTA",
        category: "Desafíos Laborales"
      },
      {
        questionNumber: 8,
        questionText: "En las interacciones con colegas, ¿qué valoras más?",
        statementA: "Mantener relaciones armoniosas y un ambiente equilibrado para todos.",
        statementB: "Interacciones basadas en objetividad, hechos y funcionalidad práctica.",
        statementC: "Oportunidades de ayudar a otros que me generen satisfacción personal.",
        statementD: "Ayudar a colegas cuando hay objetivos específicos y resultados claros que alcanzar.",
        forceA: "ARMONIOSO",
        forceB: "OBJETIVO",
        forceC: "BENEVOLO",
        forceD: "INTENCIONAL",
        category: "Relaciones Interpersonales"
      },
      {
        questionNumber: 9,
        questionText: "¿Qué tipo de cultura organizacional prefieres?",
        statementA: "Una donde se reconozca el estatus y se valore el liderazgo con autoridad.",
        statementB: "Una cultura colaborativa donde puedo apoyar sin necesidad de protagonismo.",
        statementC: "Una organización que valore los métodos probados y la estabilidad estructural.",
        statementD: "Una cultura abierta a nuevas ideas y enfoques innovadores fuera de lo convencional.",
        forceA: "DOMINANTE",
        forceB: "COLABORATIVO",
        forceC: "ESTRUCTURADO", 
        forceD: "RECEPTIVO",
        category: "Cultura Organizacional"
      },
      {
        questionNumber: 10,
        questionText: "Al tomar decisiones importantes, ¿qué proceso prefieres seguir?",
        statementA: "Investigar exhaustivamente todas las opciones y analizar cada alternativa.",
        statementB: "Confiar en mi intuición y experiencias pasadas para guiar la decisión.",
        statementC: "Evaluar cuál opción generará los resultados más prácticos y eficientes.",
        statementD: "Elegir la opción que me permita contribuir sin crear expectativas personales.",
        forceA: "INTELECTUAL",
        forceB: "INSTINTIVO",
        forceC: "PRACTICO",
        forceD: "ALTRUISTA",
        category: "Toma de Decisiones"
      }
    ];

    // Crear las preguntas
    const createdQuestions = await prisma.drivingForcesQuestion.createMany({
      data: sampleQuestions as any,
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: `Se crearon ${createdQuestions.count} preguntas de Driving Forces`,
      count: createdQuestions.count
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear preguntas de ejemplo:', error);
    return NextResponse.json(
      { error: 'Error al crear preguntas de ejemplo' },
      { status: 500 }
    );
  }
}
