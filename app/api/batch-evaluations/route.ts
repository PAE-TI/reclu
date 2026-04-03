import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';
import { emailService } from '@/lib/email';
import { TokenUtils } from '@/lib/token-utils';
import { deductCreditsForEvaluation, getCreditSettings, getCreditOwnerId, getCreditOwnerInfo } from '@/lib/credits';
import { EvaluationType } from '@prisma/client';

const generateToken = () => randomBytes(32).toString('hex');
const getBaseUrl = () => process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Configuración de evaluaciones para el email combinado
const EVALUATION_CONFIG: Record<string, { name: string; description: string; icon: string; color: string; questions: number; time: string; pathPrefix: string }> = {
  DISC: { name: 'DISC', description: 'Perfil de comportamiento y estilo de comunicación', icon: '🧠', color: '#3b82f6', questions: 24, time: '10-15 min', pathPrefix: '/external-evaluation/' },
  DRIVING_FORCES: { name: 'Fuerzas Motivadoras', description: 'Motivaciones internas y valores personales', icon: '🎯', color: '#8b5cf6', questions: 12, time: '8-10 min', pathPrefix: '/external-driving-forces-evaluation/' },
  EQ: { name: 'Inteligencia Emocional', description: 'Competencias emocionales y sociales', icon: '❤️', color: '#ec4899', questions: 25, time: '10-12 min', pathPrefix: '/external-eq-evaluation/' },
  DNA: { name: 'DNA-25 Competencias', description: 'Habilidades y competencias profesionales', icon: '🧬', color: '#14b8a6', questions: 25, time: '10-12 min', pathPrefix: '/external-dna-evaluation/' },
  ACUMEN: { name: 'Acumen (ACI)', description: 'Capacidad de juicio y toma de decisiones', icon: '✨', color: '#f59e0b', questions: 30, time: '12-15 min', pathPrefix: '/external-acumen-evaluation/' },
  VALUES: { name: 'Valores e Integridad', description: 'Principios y ética profesional', icon: '⚖️', color: '#7c3aed', questions: 25, time: '10-12 min', pathPrefix: '/external-values-evaluation/' },
  STRESS: { name: 'Estrés y Resiliencia', description: 'Manejo del estrés y capacidad de recuperación', icon: '🧘', color: '#f97316', questions: 25, time: '10-12 min', pathPrefix: '/external-stress-evaluation/' },
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { recipientName, recipientEmail, evaluations, singleEmail = true } = body;

    if (!recipientName || !recipientEmail || !evaluations || evaluations.length === 0) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // Verificar créditos totales necesarios (usando créditos del owner si es facilitador)
    const settings = await getCreditSettings();
    const totalCreditsNeeded = evaluations.length * settings.creditsPerEvaluation;
    
    // Obtener info del propietario de créditos (owner si es facilitador, el mismo usuario si no)
    const creditInfo = await getCreditOwnerInfo(session.user.id);
    const availableCredits = creditInfo.credits;
    
    if (availableCredits < totalCreditsNeeded) {
      const creditSource = creditInfo.isFacilitator 
        ? `La cuenta principal (${creditInfo.creditOwnerName}) tiene` 
        : 'Tienes';
      return NextResponse.json(
        { error: `Créditos insuficientes. Necesitas ${totalCreditsNeeded} créditos (${settings.creditsPerEvaluation} por evaluación × ${evaluations.length} evaluaciones). ${creditSource} ${availableCredits}.` },
        { status: 400 }
      );
    }

    const results: { type: string; success: boolean; error?: string }[] = [];
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 30);
    
    const senderName = session.user.firstName 
      ? `${session.user.firstName} ${session.user.lastName || ''}`.trim()
      : session.user.name || 'Evaluador';
    const companyName = session.user.company || 'Reclu';

    // Para el email combinado, recopilamos los datos de cada evaluación
    const combinedEmailData: Array<{
      type: string;
      name: string;
      description: string;
      link: string;
      questions: number;
      time: string;
      icon: string;
      color: string;
    }> = [];

    // Crear evaluaciones seleccionadas
    for (const evalType of evaluations) {
      try {
        const token = generateToken();
        const config = EVALUATION_CONFIG[evalType];
        
        switch (evalType) {
          case 'DISC': {
            const title = `Evaluación DISC para ${recipientName}`;
            const discEval = await prisma.externalEvaluation.create({
              data: {
                title,
                description: '',
                token,
                tokenExpiry,
                recipientName,
                recipientEmail,
                senderUserId: session.user.id,
                status: 'PENDING',
              },
            });
            
            await deductCreditsForEvaluation(session.user.id, 'DISC', discEval.id, recipientName);
            
            const evaluationLink = `${getBaseUrl()}/external-evaluation/${token}`;
            
            if (singleEmail) {
              combinedEmailData.push({ ...config, type: evalType, link: evaluationLink });
            } else {
              const emailContent = emailService.generateEvaluationInvitationEmail(
                recipientName,
                senderName,
                title,
                evaluationLink
              );
              await emailService.sendEmail({ to: recipientEmail, subject: emailContent.subject, html: emailContent.html });
            }
            results.push({ type: 'DISC', success: true });
            break;
          }
          
          case 'DRIVING_FORCES': {
            const title = `Evaluación Fuerzas Motivadoras para ${recipientName}`;
            const dfEval = await prisma.externalDrivingForcesEvaluation.create({
              data: {
                title,
                description: '',
                token,
                tokenExpiry,
                recipientName,
                recipientEmail,
                senderUserId: session.user.id,
                status: 'PENDING',
              },
            });
            
            await deductCreditsForEvaluation(session.user.id, 'DRIVING_FORCES', dfEval.id, recipientName);
            
            const evaluationLink = `${getBaseUrl()}/external-driving-forces-evaluation/${token}`;
            
            if (singleEmail) {
              combinedEmailData.push({ ...config, type: evalType, link: evaluationLink });
            } else {
              const { subject, html } = emailService.generateDrivingForcesInvitationEmail(
                recipientName,
                senderName,
                title,
                evaluationLink,
                30
              );
              await emailService.sendEmail({ to: recipientEmail, subject, html });
            }
            results.push({ type: 'DRIVING_FORCES', success: true });
            break;
          }
          
          case 'EQ': {
            const title = `Evaluación EQ para ${recipientName}`;
            const eqEval = await prisma.externalEQEvaluation.create({
              data: {
                title,
                token,
                tokenExpiry,
                recipientName,
                recipientEmail,
                senderUserId: session.user.id,
                status: 'PENDING',
              },
            });
            
            await deductCreditsForEvaluation(session.user.id, 'EQ', eqEval.id, recipientName);
            
            const evaluationLink = `${getBaseUrl()}/external-eq-evaluation/${token}`;
            
            if (singleEmail) {
              combinedEmailData.push({ ...config, type: evalType, link: evaluationLink });
            } else {
              await emailService.sendEQEvaluationInvitation({
                recipientEmail,
                recipientName,
                senderName,
                companyName,
                evaluationToken: token,
              });
            }
            results.push({ type: 'EQ', success: true });
            break;
          }
          
          case 'DNA': {
            const title = `Evaluación DNA-25 para ${recipientName}`;
            const dnaEval = await prisma.externalDNAEvaluation.create({
              data: {
                title,
                description: '',
                token,
                tokenExpiry,
                recipientName,
                recipientEmail,
                senderUserId: session.user.id,
                status: 'PENDING',
              },
            });
            
            await deductCreditsForEvaluation(session.user.id, 'DNA', dnaEval.id, recipientName);
            
            const evaluationLink = `${getBaseUrl()}/external-dna-evaluation/${token}`;
            
            if (singleEmail) {
              combinedEmailData.push({ ...config, type: evalType, link: evaluationLink });
            } else {
              await emailService.sendDNAEvaluationInvitation({
                recipientEmail,
                recipientName,
                senderName,
                companyName,
                evaluationToken: token,
              });
            }
            results.push({ type: 'DNA', success: true });
            break;
          }
          
          case 'ACUMEN': {
            const title = `Evaluación Acumen para ${recipientName}`;
            const acuEval = await prisma.externalAcumenEvaluation.create({
              data: {
                title,
                description: '',
                token,
                tokenExpiry,
                recipientName,
                recipientEmail,
                senderUserId: session.user.id,
                status: 'PENDING',
              },
            });
            
            await deductCreditsForEvaluation(session.user.id, 'ACUMEN', acuEval.id, recipientName);
            
            const evaluationLink = `${getBaseUrl()}/external-acumen-evaluation/${token}`;
            
            if (singleEmail) {
              combinedEmailData.push({ ...config, type: evalType, link: evaluationLink });
            } else {
              await emailService.sendAcumenInvitation({
                to: recipientEmail,
                recipientName,
                senderName,
                evaluationLink,
                expiryDate: tokenExpiry,
              });
            }
            results.push({ type: 'ACUMEN', success: true });
            break;
          }
          
          case 'VALUES': {
            const title = `Evaluación Valores e Integridad para ${recipientName}`;
            const valEval = await prisma.externalValuesEvaluation.create({
              data: {
                title,
                description: '',
                token,
                tokenExpiry,
                recipientName,
                recipientEmail,
                senderUserId: session.user.id,
                status: 'PENDING',
              },
            });
            
            await deductCreditsForEvaluation(session.user.id, 'VALUES', valEval.id, recipientName);
            
            const evaluationLink = `${getBaseUrl()}/external-values-evaluation/${token}`;
            
            if (singleEmail) {
              combinedEmailData.push({ ...config, type: evalType, link: evaluationLink });
            } else {
              await emailService.sendValuesInvitation({
                to: recipientEmail,
                recipientName,
                senderName,
                evaluationLink,
                expiryDate: tokenExpiry,
              });
            }
            results.push({ type: 'VALUES', success: true });
            break;
          }
          
          case 'STRESS': {
            const title = `Evaluación Estrés y Resiliencia para ${recipientName}`;
            const strEval = await prisma.externalStressEvaluation.create({
              data: {
                title,
                description: '',
                token,
                tokenExpiry,
                recipientName,
                recipientEmail,
                senderUserId: session.user.id,
                status: 'PENDING',
              },
            });
            
            await deductCreditsForEvaluation(session.user.id, 'STRESS', strEval.id, recipientName);
            
            const evaluationLink = `${getBaseUrl()}/external-stress-evaluation/${token}`;
            
            if (singleEmail) {
              combinedEmailData.push({ ...config, type: evalType, link: evaluationLink });
            } else {
              await emailService.sendStressInvitation({
                to: recipientEmail,
                recipientName,
                senderName,
                evaluationLink,
                expiryDate: tokenExpiry,
              });
            }
            results.push({ type: 'STRESS', success: true });
            break;
          }
        }
      } catch (error) {
        console.error(`Error creating ${evalType} evaluation:`, error);
        results.push({ type: evalType, success: false, error: 'Error al crear evaluación' });
      }
    }

    // Si es modo de email único, enviar el email combinado
    if (singleEmail && combinedEmailData.length > 0) {
      try {
        const { subject, html } = emailService.generateCombinedEvaluationsEmail({
          recipientName,
          senderName,
          evaluations: combinedEmailData,
          expiryDays: 30,
        });
        await emailService.sendEmail({ to: recipientEmail, subject, html });
      } catch (error) {
        console.error('Error sending combined email:', error);
        // No marcamos como fallido porque las evaluaciones ya se crearon
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `${successCount} evaluación(es) enviada(s) correctamente${failCount > 0 ? `, ${failCount} fallida(s)` : ''}`,
      results,
    });
  } catch (error) {
    console.error('Error in batch evaluations:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
