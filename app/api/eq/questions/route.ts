import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const questions = await prisma.eQQuestion.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
    });
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching EQ questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch EQ questions' },
      { status: 500 }
    );
  }
}
