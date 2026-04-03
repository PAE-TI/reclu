import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { token, type } = await request.json();
    
    if (!token || !type) {
      return NextResponse.json({ error: 'Token y tipo son requeridos' }, { status: 400 });
    }

    // Get user info for sender name
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const senderName = user?.name || 'Reclu';
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    let evaluation: any;
    let evaluationLink: string;
    let emailContent: { subject: string; html: string };

    switch (type) {
      case 'DISC':
        evaluation = await prisma.externalEvaluation.findUnique({
          where: { token }
        });
        if (!evaluation) {
          return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 });
        }
        evaluationLink = `${baseUrl}/external-evaluation/${token}`;
        emailContent = emailService.generateEvaluationInvitationEmail(
          evaluation.recipientName,
          senderName,
          evaluation.title || 'Evaluación DISC',
          evaluationLink
        );
        break;

      case 'DRIVING_FORCES':
        evaluation = await prisma.externalDrivingForcesEvaluation.findUnique({
          where: { token }
        });
        if (!evaluation) {
          return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 });
        }
        evaluationLink = `${baseUrl}/external-driving-forces-evaluation/${token}`;
        emailContent = emailService.generateDrivingForcesInvitationEmail(
          evaluation.recipientName,
          senderName,
          evaluation.title || 'Evaluación Fuerzas Motivadoras',
          evaluationLink,
          30
        );
        break;

      case 'EQ':
        evaluation = await prisma.externalEQEvaluation.findUnique({
          where: { token }
        });
        if (!evaluation) {
          return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 });
        }
        evaluationLink = `${baseUrl}/external-eq-evaluation/${token}`;
        emailContent = emailService.generateEQInvitationEmail(
          evaluation.recipientName,
          senderName,
          evaluation.title || 'Evaluación Inteligencia Emocional',
          evaluationLink,
          30
        );
        break;

      case 'DNA':
        evaluation = await prisma.externalDNAEvaluation.findUnique({
          where: { token }
        });
        if (!evaluation) {
          return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 });
        }
        evaluationLink = `${baseUrl}/external-dna-evaluation/${token}`;
        emailContent = emailService.generateDNAInvitationEmail(
          evaluation.recipientName,
          senderName,
          evaluation.title || 'Evaluación DNA-25',
          evaluationLink,
          30
        );
        break;

      case 'ACUMEN':
        evaluation = await prisma.externalAcumenEvaluation.findUnique({
          where: { token }
        });
        if (!evaluation) {
          return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 });
        }
        evaluationLink = `${baseUrl}/external-acumen-evaluation/${token}`;
        emailContent = emailService.generateAcumenInvitationEmail({
          recipientName: evaluation.recipientName,
          senderName,
          evaluationTitle: evaluation.title || 'Evaluación Acumen',
          evaluationLink,
          expiryDays: 30
        });
        break;

      case 'VALUES':
        evaluation = await prisma.externalValuesEvaluation.findUnique({
          where: { token }
        });
        if (!evaluation) {
          return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 });
        }
        evaluationLink = `${baseUrl}/external-values-evaluation/${token}`;
        emailContent = emailService.generateValuesInvitationEmail({
          recipientName: evaluation.recipientName,
          senderName,
          evaluationTitle: evaluation.title || 'Evaluación Valores',
          evaluationLink,
          expiryDays: 30
        });
        break;

      case 'STRESS':
        evaluation = await prisma.externalStressEvaluation.findUnique({
          where: { token }
        });
        if (!evaluation) {
          return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 });
        }
        evaluationLink = `${baseUrl}/external-stress-evaluation/${token}`;
        emailContent = emailService.generateStressInvitationEmail({
          recipientName: evaluation.recipientName,
          senderName,
          evaluationTitle: evaluation.title || 'Evaluación Estrés',
          evaluationLink,
          expiryDays: 30
        });
        break;

      default:
        return NextResponse.json({ error: 'Tipo de evaluación no válido' }, { status: 400 });
    }

    // Verify evaluation is pending
    if (evaluation.status !== 'PENDING') {
      return NextResponse.json({ error: 'Solo se puede reenviar evaluaciones pendientes' }, { status: 400 });
    }

    // Check token not expired
    if (new Date() > new Date(evaluation.tokenExpiry)) {
      return NextResponse.json({ error: 'El enlace ha expirado. Elimina la evaluación y crea una nueva.' }, { status: 400 });
    }

    // Send the email
    const emailSent = await emailService.sendEmail({
      to: evaluation.recipientEmail,
      subject: emailContent.subject,
      html: emailContent.html
    });

    if (!emailSent) {
      return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Correo reenviado a ${evaluation.recipientEmail}` 
    });

  } catch (error: any) {
    console.error('Error resending evaluation email:', error);
    return NextResponse.json(
      { error: error.message || 'Error al reenviar correo' },
      { status: 500 }
    );
  }
}
