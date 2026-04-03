import { prisma } from '../lib/db';

async function main() {
  const count = await prisma.eQQuestion.count();
  console.log('Total EQ Questions:', count);
  
  if (count > 0) {
    const questions = await prisma.eQQuestion.findMany({
      take: 3,
      orderBy: { questionNumber: 'asc' }
    });
    console.log('Sample questions:', JSON.stringify(questions, null, 2));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
