import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// EQ Questions - 25 questions covering 5 dimensions (5 per dimension)
const EQ_QUESTIONS = [
  // SELF_AWARENESS (5 questions)
  {
    questionNumber: 1,
    questionText: 'Cuando experimento una emoción fuerte, soy capaz de identificar exactamente qué estoy sintiendo.',
    questionType: 'LIKERT',
    dimension: 'SELF_AWARENESS',
    subdimension: 'Autoconciencia Emocional',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 2,
    questionText: 'Conozco claramente cuáles son mis fortalezas y debilidades.',
    questionType: 'LIKERT',
    dimension: 'SELF_AWARENESS',
    subdimension: 'Autoevaluación Precisa',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 3,
    questionText: 'Me resulta difícil explicar a otros cómo me siento.',
    questionType: 'LIKERT',
    dimension: 'SELF_AWARENESS',
    subdimension: 'Autoconciencia Emocional',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: true,
  },
  {
    questionNumber: 4,
    questionText: 'Tengo confianza en mi capacidad para manejar situaciones difíciles.',
    questionType: 'LIKERT',
    dimension: 'SELF_AWARENESS',
    subdimension: 'Autoconfianza',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 5,
    questionText: 'Puedo reconocer cómo mis emociones afectan mi desempeño en el trabajo.',
    questionType: 'LIKERT',
    dimension: 'SELF_AWARENESS',
    subdimension: 'Autoconciencia Emocional',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  
  // SELF_REGULATION (5 questions)
  {
    questionNumber: 6,
    questionText: 'Cuando me enojo, puedo calmarme rápidamente.',
    questionType: 'LIKERT',
    dimension: 'SELF_REGULATION',
    subdimension: 'Autocontrol',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 7,
    questionText: 'Tiendo a actuar impulsivamente cuando estoy bajo presión.',
    questionType: 'LIKERT',
    dimension: 'SELF_REGULATION',
    subdimension: 'Autocontrol',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: true,
  },
  {
    questionNumber: 8,
    questionText: 'Cumplo mis compromisos y promesas de manera consistente.',
    questionType: 'LIKERT',
    dimension: 'SELF_REGULATION',
    subdimension: 'Confiabilidad',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 9,
    questionText: 'Me adapto fácilmente a los cambios en mi entorno de trabajo.',
    questionType: 'LIKERT',
    dimension: 'SELF_REGULATION',
    subdimension: 'Adaptabilidad',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 10,
    questionText: 'Estoy abierto a nuevas ideas y formas de hacer las cosas.',
    questionType: 'LIKERT',
    dimension: 'SELF_REGULATION',
    subdimension: 'Innovación',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  
  // MOTIVATION (5 questions)
  {
    questionNumber: 11,
    questionText: 'Me esfuerzo por mejorar mi desempeño constantemente, incluso cuando nadie me lo pide.',
    questionType: 'LIKERT',
    dimension: 'MOTIVATION',
    subdimension: 'Impulso de Logro',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 12,
    questionText: 'Me siento comprometido con los objetivos de mi equipo u organización.',
    questionType: 'LIKERT',
    dimension: 'MOTIVATION',
    subdimension: 'Compromiso',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 13,
    questionText: 'Ante un obstáculo, tiendo a rendirme fácilmente.',
    questionType: 'LIKERT',
    dimension: 'MOTIVATION',
    subdimension: 'Iniciativa',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: true,
  },
  {
    questionNumber: 14,
    questionText: 'Mantengo una actitud positiva incluso cuando enfrento dificultades.',
    questionType: 'LIKERT',
    dimension: 'MOTIVATION',
    subdimension: 'Optimismo',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 15,
    questionText: 'Busco activamente oportunidades para aprender y crecer profesionalmente.',
    questionType: 'LIKERT',
    dimension: 'MOTIVATION',
    subdimension: 'Impulso de Logro',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  
  // EMPATHY (5 questions)
  {
    questionNumber: 16,
    questionText: 'Puedo percibir cómo se sienten otras personas sin que me lo digan.',
    questionType: 'LIKERT',
    dimension: 'EMPATHY',
    subdimension: 'Comprensión de Otros',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 17,
    questionText: 'Me resulta difícil entender por qué otras personas reaccionan de ciertas maneras.',
    questionType: 'LIKERT',
    dimension: 'EMPATHY',
    subdimension: 'Comprensión de Otros',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: true,
  },
  {
    questionNumber: 18,
    questionText: 'Disfruto ayudar a otros a desarrollar sus habilidades.',
    questionType: 'LIKERT',
    dimension: 'EMPATHY',
    subdimension: 'Desarrollo de Otros',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 19,
    questionText: 'Me preocupo genuinamente por satisfacer las necesidades de los demás.',
    questionType: 'LIKERT',
    dimension: 'EMPATHY',
    subdimension: 'Orientación al Servicio',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 20,
    questionText: 'Soy sensible a las dinámicas de poder y relaciones en mi entorno laboral.',
    questionType: 'LIKERT',
    dimension: 'EMPATHY',
    subdimension: 'Conciencia Política',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  
  // SOCIAL_SKILLS (5 questions)
  {
    questionNumber: 21,
    questionText: 'Soy efectivo al persuadir a otros para que apoyen mis ideas.',
    questionType: 'LIKERT',
    dimension: 'SOCIAL_SKILLS',
    subdimension: 'Influencia',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 22,
    questionText: 'Comunico mis ideas de manera clara y efectiva.',
    questionType: 'LIKERT',
    dimension: 'SOCIAL_SKILLS',
    subdimension: 'Comunicación',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 23,
    questionText: 'Evito los conflictos a toda costa, incluso cuando sería mejor abordarlos.',
    questionType: 'LIKERT',
    dimension: 'SOCIAL_SKILLS',
    subdimension: 'Manejo de Conflictos',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: true,
  },
  {
    questionNumber: 24,
    questionText: 'Puedo inspirar y guiar a otros hacia una visión compartida.',
    questionType: 'LIKERT',
    dimension: 'SOCIAL_SKILLS',
    subdimension: 'Liderazgo',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
  {
    questionNumber: 25,
    questionText: 'Trabajo bien en equipo y contribuyo al éxito colectivo.',
    questionType: 'LIKERT',
    dimension: 'SOCIAL_SKILLS',
    subdimension: 'Trabajo en Equipo',
    optionA: 'Totalmente en desacuerdo',
    optionB: 'En desacuerdo',
    optionC: 'Neutral',
    optionD: 'De acuerdo',
    optionE: 'Totalmente de acuerdo',
    isReversed: false,
  },
];

export async function POST() {
  try {
    // Check if questions already exist
    const existingCount = await prisma.eQQuestion.count();
    
    if (existingCount > 0) {
      // Delete existing questions
      await prisma.eQQuestion.deleteMany();
    }
    
    // Create all questions
    const createdQuestions = await prisma.eQQuestion.createMany({
      data: EQ_QUESTIONS.map((q) => ({
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        questionType: q.questionType as 'SCENARIO' | 'LIKERT' | 'SELF_REPORT',
        dimension: q.dimension as 'SELF_AWARENESS' | 'SELF_REGULATION' | 'MOTIVATION' | 'EMPATHY' | 'SOCIAL_SKILLS',
        subdimension: q.subdimension,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        optionE: q.optionE,
        isReversed: q.isReversed,
        weight: 1.0,
        isActive: true,
      })),
    });
    
    return NextResponse.json({
      success: true,
      message: `${createdQuestions.count} EQ questions created successfully`,
      count: createdQuestions.count,
    });
  } catch (error) {
    console.error('Error seeding EQ questions:', error);
    return NextResponse.json(
      { error: 'Failed to seed EQ questions' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await prisma.eQQuestion.count();
    const questions = await prisma.eQQuestion.findMany({
      orderBy: { questionNumber: 'asc' },
    });
    
    return NextResponse.json({
      count,
      questions,
    });
  } catch (error) {
    console.error('Error fetching EQ questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch EQ questions' },
      { status: 500 }
    );
  }
}
