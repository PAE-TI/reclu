import { PrismaClient, TechnicalDifficulty } from '@prisma/client';
import dotenv from 'dotenv';
import { JOB_POSITIONS } from '../lib/job-positions';
import { AI_DEVELOPER_POSITION_IDS, getQuestionsForPosition } from '../lib/technical-questions';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

type TargetPositionId = 'data_analyst' | typeof AI_DEVELOPER_POSITION_IDS extends Set<infer T> ? T : never;

const targetPositionIds = [
  'data_analyst',
  ...Array.from(AI_DEVELOPER_POSITION_IDS),
] as const;

function getWeight(difficulty: TechnicalDifficulty): number {
  if (difficulty === 'HARD') return 3;
  if (difficulty === 'MEDIUM') return 2;
  return 1;
}

function mapQuestion(question: any) {
  return {
    questionText: question.questionText,
    questionTextEn: question.questionTextEn || question.questionText,
    optionA: question.optionA,
    optionB: question.optionB,
    optionC: question.optionC,
    optionD: question.optionD,
    optionAEn: question.optionAEn || question.optionA,
    optionBEn: question.optionBEn || question.optionB,
    optionCEn: question.optionCEn || question.optionC,
    optionDEn: question.optionDEn || question.optionD,
    correctAnswer: question.correctAnswer,
    difficulty: question.difficulty,
    category: question.category,
    categoryEn: question.categoryEn || question.category,
  };
}

async function seedPosition(positionId: string) {
  const position = JOB_POSITIONS.find(p => p.id === positionId);
  if (!position) {
    console.warn(`Skipping unknown position: ${positionId}`);
    return { positionId, createdOrUpdated: 0, total: 0 };
  }

  const questions = getQuestionsForPosition(positionId);
  if (!questions.length) {
    console.warn(`No questions generated for ${positionId}`);
    return { positionId, createdOrUpdated: 0, total: 0 };
  }

  let affected = 0;

  for (let index = 0; index < questions.length; index++) {
    const question = questions[index];
    await prisma.technicalQuestion.upsert({
      where: {
        jobPositionId_questionNumber: {
          jobPositionId: positionId,
          questionNumber: index + 1,
        },
      },
      update: {
        ...mapQuestion(question),
        weight: getWeight(question.difficulty),
        isActive: true,
      },
      create: {
        jobPositionId: positionId,
        questionNumber: index + 1,
        ...mapQuestion(question),
        weight: getWeight(question.difficulty),
        isActive: true,
      },
    });
    affected++;
  }

  return { positionId, createdOrUpdated: affected, total: questions.length };
}

async function main() {
  console.log('Seeding Zoho CRM and AI developer technical questions...');

  const results = [];
  for (const positionId of targetPositionIds) {
    const result = await seedPosition(positionId);
    results.push(result);
    const position = JOB_POSITIONS.find(p => p.id === positionId);
    console.log(
      `${position?.title || positionId}: ${result.createdOrUpdated}/${result.total} preguntas creadas o actualizadas`
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

  console.log(
    `Listo. ${summary.questions} preguntas procesadas en ${summary.positions} cargos.`
  );
}

main()
  .catch((error) => {
    console.error('Error seeding AI/Zoho questions:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
