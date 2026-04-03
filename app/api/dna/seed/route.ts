import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const DNA_QUESTIONS = [
  // THINKING - Pensamiento Analítico (1-2)
  {
    questionNumber: 1,
    questionText: 'Cuando enfrento un problema complejo, analizo sistemáticamente cada componente antes de buscar una solución.',
    competency: 'ANALYTICAL_THINKING',
    category: 'THINKING',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  {
    questionNumber: 2,
    questionText: 'Identifico patrones y conexiones entre datos aparentemente no relacionados.',
    competency: 'PROBLEM_SOLVING',
    category: 'THINKING',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // THINKING - Creatividad (3)
  {
    questionNumber: 3,
    questionText: 'Genero ideas innovadoras y soluciones fuera de lo convencional.',
    competency: 'CREATIVITY',
    category: 'THINKING',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // THINKING - Pensamiento Estratégico (4)
  {
    questionNumber: 4,
    questionText: 'Considero las implicaciones a largo plazo antes de tomar decisiones importantes.',
    competency: 'STRATEGIC_THINKING',
    category: 'THINKING',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // THINKING - Toma de Decisiones (5)
  {
    questionNumber: 5,
    questionText: 'Tomo decisiones oportunas basadas en información disponible, incluso bajo incertidumbre.',
    competency: 'DECISION_MAKING',
    category: 'THINKING',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // COMMUNICATION - Comunicación Escrita (6)
  {
    questionNumber: 6,
    questionText: 'Expreso mis ideas por escrito de forma clara, concisa y bien estructurada.',
    competency: 'WRITTEN_COMMUNICATION',
    category: 'COMMUNICATION',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // COMMUNICATION - Comunicación Verbal (7)
  {
    questionNumber: 7,
    questionText: 'Comunico mis ideas verbalmente de manera clara y persuasiva.',
    competency: 'VERBAL_COMMUNICATION',
    category: 'COMMUNICATION',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // COMMUNICATION - Presentaciones (8)
  {
    questionNumber: 8,
    questionText: 'Realizo presentaciones efectivas que captan la atención y transmiten el mensaje clave.',
    competency: 'PRESENTATION_SKILLS',
    category: 'COMMUNICATION',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // COMMUNICATION - Influencia (9)
  {
    questionNumber: 9,
    questionText: 'Logro que otros adopten mis ideas o propuestas a través de la persuasión efectiva.',
    competency: 'INFLUENCE',
    category: 'COMMUNICATION',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // COMMUNICATION - Negociación (10)
  {
    questionNumber: 10,
    questionText: 'Alcanzo acuerdos beneficiosos para todas las partes en situaciones de negociación.',
    competency: 'NEGOTIATION',
    category: 'COMMUNICATION',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // LEADERSHIP - Liderazgo (11)
  {
    questionNumber: 11,
    questionText: 'Inspiro y motivo a otros para alcanzar metas compartidas.',
    competency: 'LEADERSHIP',
    category: 'LEADERSHIP',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // LEADERSHIP - Desarrollo de Personas (12)
  {
    questionNumber: 12,
    questionText: 'Dedico tiempo a desarrollar las habilidades y potencial de otros.',
    competency: 'DEVELOPING_OTHERS',
    category: 'LEADERSHIP',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // LEADERSHIP - Gestión de Conflictos (13)
  {
    questionNumber: 13,
    questionText: 'Manejo los conflictos de manera constructiva, buscando soluciones que satisfagan a todas las partes.',
    competency: 'CONFLICT_MANAGEMENT',
    category: 'LEADERSHIP',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // LEADERSHIP - Adaptabilidad (14)
  {
    questionNumber: 14,
    questionText: 'Me adapto rápidamente a cambios en el entorno o prioridades.',
    competency: 'ADAPTABILITY',
    category: 'LEADERSHIP',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // LEADERSHIP - Visión de Negocio (15)
  {
    questionNumber: 15,
    questionText: 'Comprendo cómo mis acciones impactan los resultados del negocio.',
    competency: 'BUSINESS_ACUMEN',
    category: 'LEADERSHIP',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // RESULTS - Orientación al Logro (16)
  {
    questionNumber: 16,
    questionText: 'Establezco metas ambiciosas y trabajo persistentemente para alcanzarlas.',
    competency: 'ACHIEVEMENT_ORIENTATION',
    category: 'RESULTS',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // RESULTS - Gestión del Tiempo (17)
  {
    questionNumber: 17,
    questionText: 'Priorizo efectivamente mis tareas y gestiono mi tiempo de manera eficiente.',
    competency: 'TIME_MANAGEMENT',
    category: 'RESULTS',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // RESULTS - Planificación (18)
  {
    questionNumber: 18,
    questionText: 'Planifico mis actividades con anticipación y organizo los recursos necesarios.',
    competency: 'PLANNING_ORGANIZATION',
    category: 'RESULTS',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // RESULTS - Atención al Detalle (19)
  {
    questionNumber: 19,
    questionText: 'Presto atención a los detalles y aseguro la calidad de mi trabajo.',
    competency: 'ATTENTION_TO_DETAIL',
    category: 'RESULTS',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // RESULTS - Orientación a Resultados (20)
  {
    questionNumber: 20,
    questionText: 'Me enfoco consistentemente en lograr resultados medibles y tangibles.',
    competency: 'RESULTS_ORIENTATION',
    category: 'RESULTS',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // RELATIONSHIP - Trabajo en Equipo (21)
  {
    questionNumber: 21,
    questionText: 'Colaboro efectivamente con otros y contribuyo al éxito del equipo.',
    competency: 'TEAMWORK',
    category: 'RELATIONSHIP',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // RELATIONSHIP - Servicio al Cliente (22)
  {
    questionNumber: 22,
    questionText: 'Anticipo y satisfago las necesidades de clientes internos y externos.',
    competency: 'CUSTOMER_SERVICE',
    category: 'RELATIONSHIP',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // RELATIONSHIP - Relaciones (23)
  {
    questionNumber: 23,
    questionText: 'Construyo y mantengo relaciones profesionales sólidas y de confianza.',
    competency: 'RELATIONSHIP_BUILDING',
    category: 'RELATIONSHIP',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // RELATIONSHIP - Resiliencia (24)
  {
    questionNumber: 24,
    questionText: 'Me recupero rápidamente de contratiempos y mantengo mi efectividad bajo presión.',
    competency: 'RESILIENCE',
    category: 'RELATIONSHIP',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
  // RELATIONSHIP - Responsabilidad (25)
  {
    questionNumber: 25,
    questionText: 'Asumo responsabilidad por mis acciones y cumplo mis compromisos.',
    competency: 'ACCOUNTABILITY',
    category: 'RELATIONSHIP',
    optionA: 'Nunca',
    optionB: 'Raramente',
    optionC: 'A veces',
    optionD: 'Frecuentemente',
    optionE: 'Siempre',
  },
];

export async function POST() {
  try {
    // Check if questions already exist
    const existingCount = await prisma.dNAQuestion.count();
    
    if (existingCount > 0) {
      return NextResponse.json({
        message: `Ya existen ${existingCount} preguntas DNA en la base de datos`,
        count: existingCount,
      });
    }
    
    // Create questions
    const createdQuestions = await prisma.dNAQuestion.createMany({
      data: DNA_QUESTIONS.map((q) => ({
        ...q,
        competency: q.competency as any,
        category: q.category as any,
        questionType: 'LIKERT' as any,
        isReversed: false,
        weight: 1.0,
        isActive: true,
      })),
    });
    
    return NextResponse.json({
      success: true,
      message: `${createdQuestions.count} preguntas DNA creadas exitosamente`,
      count: createdQuestions.count,
    });
  } catch (error) {
    console.error('Error seeding DNA questions:', error);
    return NextResponse.json(
      { error: 'Error al crear las preguntas DNA' },
      { status: 500 }
    );
  }
}
