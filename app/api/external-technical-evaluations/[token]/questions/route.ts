import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateQuestionsForPosition } from '@/lib/technical-question-generator';
import { AI_DEVELOPER_POSITION_IDS } from '@/lib/technical-questions';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('lang') || 'es';

    // Get evaluation
    const evaluation = await prisma.externalTechnicalEvaluation.findUnique({
      where: { token },
      select: {
        id: true,
        status: true,
        jobPositionId: true,
        jobPositionTitle: true,
        questionSetConfig: true,
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: language === 'es' ? 'Evaluación no encontrada' : 'Evaluation not found' },
        { status: 404 }
      );
    }

    if (evaluation.status === 'COMPLETED') {
      return NextResponse.json(
        {
          error: language === 'es' ? 'Esta evaluación ya fue completada' : 'This evaluation has already been completed',
          alreadyCompleted: true,
          evaluation: {
            id: evaluation.id,
            jobPositionId: evaluation.jobPositionId,
            jobPositionTitle: evaluation.jobPositionTitle,
            status: evaluation.status,
          },
        },
        { status: 400 }
      );
    }

    const customQuestionIds = Array.isArray(evaluation.questionSetConfig)
      ? null
      : (evaluation.questionSetConfig as { questionIds?: string[] } | null)?.questionIds;

    if (customQuestionIds && customQuestionIds.length > 0) {
      const customQuestions = await prisma.technicalQuestion.findMany({
        where: {
          id: { in: customQuestionIds },
          isActive: true,
        },
        select: {
          id: true,
          questionNumber: true,
          questionText: true,
          questionTextEn: true,
          category: true,
          categoryEn: true,
          difficulty: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          optionAEn: true,
          optionBEn: true,
          optionCEn: true,
          optionDEn: true,
        },
      });

      const questionMap = new Map(customQuestions.map(question => [question.id, question]));
      const orderedQuestions = customQuestionIds
        .map(questionId => questionMap.get(questionId))
        .filter((question): question is NonNullable<typeof question> => Boolean(question));

      if (orderedQuestions.length === customQuestionIds.length) {
        const localizedCustomQuestions = orderedQuestions.map(q => {
          if (language === 'en') {
            return {
              id: q.id,
              questionNumber: q.questionNumber,
              questionText: q.questionTextEn || q.questionText,
              category: q.categoryEn || q.category,
              difficulty: q.difficulty,
              optionA: q.optionAEn || q.optionA,
              optionB: q.optionBEn || q.optionB,
              optionC: q.optionCEn || q.optionC,
              optionD: q.optionDEn || q.optionD,
            };
          }
          return {
            id: q.id,
            questionNumber: q.questionNumber,
            questionText: q.questionText,
            category: q.category,
            difficulty: q.difficulty,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
          };
        });

        return NextResponse.json({
          questions: localizedCustomQuestions,
          evaluation: {
            id: evaluation.id,
            jobPositionId: evaluation.jobPositionId,
            jobPositionTitle: evaluation.jobPositionTitle,
            status: evaluation.status,
          },
          customQuestionSet: true,
        });
      }
    }

    // Distribution: 60% hard, 25% medium, 15% easy (for 20 questions: 12H, 5M, 3E)
    const TOTAL_QUESTIONS = 20;
    const HARD_COUNT = 12;  // 60%
    const MEDIUM_COUNT = 5; // 25%
    const EASY_COUNT = 3;   // 15%

    // Get questions by difficulty for this job position
    const [hardQuestions, mediumQuestions, easyQuestions] = await Promise.all([
      prisma.technicalQuestion.findMany({
        where: { 
          jobPositionId: evaluation.jobPositionId,
          isActive: true,
          difficulty: 'HARD',
        },
        select: {
          id: true,
          questionNumber: true,
          questionText: true,
          questionTextEn: true,
          category: true,
          categoryEn: true,
          difficulty: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          optionAEn: true,
          optionBEn: true,
          optionCEn: true,
          optionDEn: true,
        },
      }),
      prisma.technicalQuestion.findMany({
        where: { 
          jobPositionId: evaluation.jobPositionId,
          isActive: true,
          difficulty: 'MEDIUM',
        },
        select: {
          id: true,
          questionNumber: true,
          questionText: true,
          questionTextEn: true,
          category: true,
          categoryEn: true,
          difficulty: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          optionAEn: true,
          optionBEn: true,
          optionCEn: true,
          optionDEn: true,
        },
      }),
      prisma.technicalQuestion.findMany({
        where: { 
          jobPositionId: evaluation.jobPositionId,
          isActive: true,
          difficulty: 'EASY',
        },
        select: {
          id: true,
          questionNumber: true,
          questionText: true,
          questionTextEn: true,
          category: true,
          categoryEn: true,
          difficulty: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          optionAEn: true,
          optionBEn: true,
          optionCEn: true,
          optionDEn: true,
        },
      }),
    ]);

    const totalAvailable = hardQuestions.length + mediumQuestions.length + easyQuestions.length;

    // Helper function to shuffle and pick random questions
    const shuffleAndPick = <T>(arr: T[], count: number): T[] => {
      const shuffled = [...arr].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    };

    let questions: typeof hardQuestions = [];

    // If we have enough questions, select with the desired distribution
    if (totalAvailable >= TOTAL_QUESTIONS && 
        hardQuestions.length >= HARD_COUNT && 
        mediumQuestions.length >= MEDIUM_COUNT && 
        easyQuestions.length >= EASY_COUNT) {
      
      // Pick random questions from each difficulty
      const selectedHard = shuffleAndPick(hardQuestions, HARD_COUNT);
      const selectedMedium = shuffleAndPick(mediumQuestions, MEDIUM_COUNT);
      const selectedEasy = shuffleAndPick(easyQuestions, EASY_COUNT);
      
      // Combine and shuffle the final set
      questions = [...selectedHard, ...selectedMedium, ...selectedEasy]
        .sort(() => Math.random() - 0.5);
    }

    // If no questions exist or not enough for proper distribution, generate them with LLM
    if (questions.length < TOTAL_QUESTIONS) {
      console.log(`Generating questions for position: ${evaluation.jobPositionId} (current count: ${questions.length})`);
      
      try {
        const needsLargeBank =
          evaluation.jobPositionId === 'data_analyst' ||
          AI_DEVELOPER_POSITION_IDS.has(evaluation.jobPositionId);

        const generatedQuestions = await generateQuestionsForPosition(
          evaluation.jobPositionId,
          needsLargeBank ? 100 : 20
        );

        // Delete old questions if regenerating
        const targetCount = needsLargeBank ? 100 : 20;
        if (questions.length > 0 && questions.length < targetCount) {
          await prisma.technicalQuestion.deleteMany({
            where: { jobPositionId: evaluation.jobPositionId },
          });
        }

        // Save generated questions to database
        const createdQuestions = await Promise.all(
          generatedQuestions.map(async (q, index) => {
            return prisma.technicalQuestion.create({
              data: {
                jobPositionId: evaluation.jobPositionId,
                questionNumber: index + 1,
                questionText: q.questionText,
                questionTextEn: q.questionTextEn,
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC,
                optionD: q.optionD,
                optionAEn: q.optionAEn,
                optionBEn: q.optionBEn,
                optionCEn: q.optionCEn,
                optionDEn: q.optionDEn,
                correctAnswer: q.correctAnswer,
                difficulty: q.difficulty,
                category: q.category,
                categoryEn: q.categoryEn,
                weight: q.difficulty === 'HARD' ? 3 : q.difficulty === 'MEDIUM' ? 2 : 1,
              },
              select: {
                id: true,
                questionNumber: true,
                questionText: true,
                questionTextEn: true,
                category: true,
                categoryEn: true,
                difficulty: true,
                optionA: true,
                optionB: true,
                optionC: true,
                optionD: true,
                optionAEn: true,
                optionBEn: true,
                optionCEn: true,
                optionDEn: true,
              },
            });
          })
        );

        questions = createdQuestions;
        console.log(`Created ${questions.length} bilingual questions for position: ${evaluation.jobPositionId}`);
      } catch (genError) {
        console.error('Error generating questions:', genError);
        return NextResponse.json(
          { error: language === 'es' 
              ? 'Error al generar las preguntas. Por favor intente de nuevo.' 
              : 'Error generating questions. Please try again.' 
          },
          { status: 500 }
        );
      }
    }

    // Return questions in the requested language
    const localizedQuestions = questions.map(q => {
      if (language === 'en') {
        return {
          id: q.id,
          questionNumber: q.questionNumber,
          questionText: q.questionTextEn || q.questionText,
          category: q.categoryEn || q.category,
          difficulty: q.difficulty,
          optionA: q.optionAEn || q.optionA,
          optionB: q.optionBEn || q.optionB,
          optionC: q.optionCEn || q.optionC,
          optionD: q.optionDEn || q.optionD,
        };
      }
      return {
        id: q.id,
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        category: q.category,
        difficulty: q.difficulty,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
      };
    });

    // Ensure no duplicate questions
    const uniqueQuestions = localizedQuestions.filter((q, index, self) =>
      index === self.findIndex(t => t.questionText === q.questionText)
    );

    return NextResponse.json(uniqueQuestions);
  } catch (error) {
    console.error('Error fetching technical questions:', error);
    return NextResponse.json(
      { error: 'Error al obtener las preguntas' },
      { status: 500 }
    );
  }
}
