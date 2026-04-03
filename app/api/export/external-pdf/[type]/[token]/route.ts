import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const validTypes = ['disc', 'driving-forces', 'eq', 'dna', 'acumen', 'values', 'stress'];

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; token: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { type, token } = params;

    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Tipo de evaluación no válido' }, { status: 400 });
    }

    // Get evaluation data based on type using direct Prisma queries
    let evaluation: any;
    let htmlContent: string;

    switch (type) {
      case 'disc':
        evaluation = await prisma.externalEvaluation.findUnique({
          where: { token },
          include: { senderUser: true, result: true },
        });
        if (!evaluation || evaluation.status !== 'COMPLETED') {
          return NextResponse.json({ error: 'Evaluación no encontrada o no completada' }, { status: 404 });
        }
        htmlContent = generateDISCPDF(evaluation);
        break;

      case 'driving-forces':
        evaluation = await prisma.externalDrivingForcesEvaluation.findUnique({
          where: { token },
          include: { senderUser: true, result: true },
        });
        if (!evaluation || evaluation.status !== 'COMPLETED') {
          return NextResponse.json({ error: 'Evaluación no encontrada o no completada' }, { status: 404 });
        }
        htmlContent = generateDrivingForcesPDF(evaluation);
        break;

      case 'eq':
        evaluation = await prisma.externalEQEvaluation.findUnique({
          where: { token },
          include: { senderUser: true, result: true },
        });
        if (!evaluation || evaluation.status !== 'COMPLETED') {
          return NextResponse.json({ error: 'Evaluación no encontrada o no completada' }, { status: 404 });
        }
        htmlContent = generateEQPDF(evaluation);
        break;

      case 'dna':
        evaluation = await prisma.externalDNAEvaluation.findUnique({
          where: { token },
          include: { senderUser: true, result: true },
        });
        if (!evaluation || evaluation.status !== 'COMPLETED') {
          return NextResponse.json({ error: 'Evaluación no encontrada o no completada' }, { status: 404 });
        }
        htmlContent = generateDNAPDF(evaluation);
        break;

      case 'acumen':
        evaluation = await prisma.externalAcumenEvaluation.findUnique({
          where: { token },
          include: { senderUser: true, result: true },
        });
        if (!evaluation || evaluation.status !== 'COMPLETED') {
          return NextResponse.json({ error: 'Evaluación no encontrada o no completada' }, { status: 404 });
        }
        htmlContent = generateAcumenPDF(evaluation);
        break;

      case 'values':
        evaluation = await prisma.externalValuesEvaluation.findUnique({
          where: { token },
          include: { senderUser: true, result: true },
        });
        if (!evaluation || evaluation.status !== 'COMPLETED') {
          return NextResponse.json({ error: 'Evaluación no encontrada o no completada' }, { status: 404 });
        }
        htmlContent = generateValuesPDF(evaluation);
        break;

      case 'stress':
        evaluation = await prisma.externalStressEvaluation.findUnique({
          where: { token },
          include: { senderUser: true, result: true },
        });
        if (!evaluation || evaluation.status !== 'COMPLETED') {
          return NextResponse.json({ error: 'Evaluación no encontrada o no completada' }, { status: 404 });
        }
        htmlContent = generateStressPDF(evaluation);
        break;

      default:
        return NextResponse.json({ error: 'Tipo no soportado' }, { status: 400 });
    }

    return NextResponse.json({
      html: htmlContent,
      evaluation: {
        recipientName: evaluation.recipientName,
        recipientEmail: evaluation.recipientEmail,
        completedAt: evaluation.completedAt,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Base styles for all PDFs
function getBaseStyles(): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #fff; font-size: 12px; }
    .report-container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; border-bottom: 3px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #4f46e5; font-size: 24px; margin-bottom: 10px; font-weight: bold; }
    .header .subtitle { color: #6b7280; font-size: 16px; margin-bottom: 5px; }
    .header .date { color: #9ca3af; font-size: 14px; }
    .section { margin-bottom: 30px; break-inside: avoid; }
    .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 2px solid #e5e7eb; }
    .card { background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e5e7eb; }
    .score-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 20px; }
    .score-item { background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #4f46e5; }
    .score-label { font-weight: bold; margin-bottom: 5px; font-size: 14px; }
    .score-value { font-size: 20px; font-weight: bold; color: #1f2937; }
    .score-bar { width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; margin-top: 8px; overflow: hidden; }
    .score-fill { height: 100%; border-radius: 4px; }
    .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .strengths-card { padding: 20px; border-radius: 8px; border: 2px solid #bbf7d0; background: #f0fdf4; }
    .challenges-card { padding: 20px; border-radius: 8px; border: 2px solid #fde68a; background: #fffbeb; }
    .card-title { font-weight: bold; margin-bottom: 10px; font-size: 16px; }
    .strengths-card .card-title { color: #166534; }
    .challenges-card .card-title { color: #92400e; }
    .list-item { margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px; }
    .list-bullet { width: 6px; height: 6px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
    .strengths-card .list-bullet { background: #16a34a; }
    .challenges-card .list-bullet { background: #d97706; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 10px; }
    @media print { body { font-size: 11px; } .report-container { padding: 10px; } .section { page-break-inside: avoid; } }
  `;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// DISC PDF Generator
function generateDISCPDF(evaluation: any): string {
  const result = evaluation.result;
  const getDimensionColor = (dimension: string) => {
    const colors: Record<string, { bg: string; color: string; border: string }> = {
      'D': { bg: '#fee2e2', color: '#dc2626', border: '#fecaca' },
      'I': { bg: '#fef3c7', color: '#d97706', border: '#fde68a' },
      'S': { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
      'C': { bg: '#dbeafe', color: '#2563eb', border: '#bfdbfe' },
    };
    return colors[dimension] || colors['D'];
  };

  const primaryColor = getDimensionColor(result?.primaryStyle || 'D');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte DISC - ${evaluation.recipientName}</title>
      <style>${getBaseStyles()}</style>
    </head>
    <body>
      <div class="report-container">
        <div class="header">
          <h1>Reporte de Evaluación DISC</h1>
          <div class="subtitle">Reclu System</div>
          <div class="subtitle">${evaluation.recipientName}</div>
          <div class="date">Completado el ${formatDate(evaluation.completedAt)}</div>
        </div>

        <div class="section">
          <h2 class="section-title">Perfil de Personalidad</h2>
          <div style="background: ${primaryColor.bg}; border: 2px solid ${primaryColor.border}; border-radius: 12px; padding: 20px; text-align: center;">
            <div style="font-size: 22px; font-weight: bold; color: ${primaryColor.color}; margin-bottom: 10px;">
              ${result?.interpretation?.title || `Tipo ${result?.personalityType || 'N/A'}`}
            </div>
            <div style="color: ${primaryColor.color}; font-size: 14px; margin-bottom: 15px;">
              ${result?.interpretation?.description || 'Tu perfil de personalidad dominante'}
            </div>
            <div>
              <strong>Estilo Principal:</strong> ${result?.primaryStyle || 'N/A'}
              ${result?.secondaryStyle ? `<br><strong>Estilo Secundario:</strong> ${result.secondaryStyle}` : ''}
              <br><strong>Intensidad:</strong> ${result?.styleIntensity?.toFixed(1) || 0}%
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Puntuaciones DISC</h2>
          <div class="score-grid">
            <div class="score-item" style="border-left-color: #dc2626;">
              <div class="score-label">D - Dominante</div>
              <div class="score-value">${result?.percentileD?.toFixed(1) || 0}%</div>
              <div class="score-bar"><div class="score-fill" style="width: ${result?.percentileD || 0}%; background: #dc2626;"></div></div>
            </div>
            <div class="score-item" style="border-left-color: #d97706;">
              <div class="score-label">I - Influyente</div>
              <div class="score-value">${result?.percentileI?.toFixed(1) || 0}%</div>
              <div class="score-bar"><div class="score-fill" style="width: ${result?.percentileI || 0}%; background: #d97706;"></div></div>
            </div>
            <div class="score-item" style="border-left-color: #16a34a;">
              <div class="score-label">S - Estable</div>
              <div class="score-value">${result?.percentileS?.toFixed(1) || 0}%</div>
              <div class="score-bar"><div class="score-fill" style="width: ${result?.percentileS || 0}%; background: #16a34a;"></div></div>
            </div>
            <div class="score-item" style="border-left-color: #2563eb;">
              <div class="score-label">C - Concienzudo</div>
              <div class="score-value">${result?.percentileC?.toFixed(1) || 0}%</div>
              <div class="score-bar"><div class="score-fill" style="width: ${result?.percentileC || 0}%; background: #2563eb;"></div></div>
            </div>
          </div>
        </div>

        ${result?.interpretation ? `
        <div class="section">
          <h2 class="section-title">Fortalezas y Áreas de Desarrollo</h2>
          <div class="two-column">
            <div class="strengths-card">
              <div class="card-title">✓ Fortalezas</div>
              ${(result.interpretation.strengths || []).map((s: string) => `<div class="list-item"><div class="list-bullet"></div><div>${s}</div></div>`).join('')}
            </div>
            <div class="challenges-card">
              <div class="card-title">→ Áreas de Desarrollo</div>
              ${(result.interpretation.challenges || []).map((c: string) => `<div class="list-item"><div class="list-bullet"></div><div>${c}</div></div>`).join('')}
            </div>
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Este reporte fue generado por Reclu - ${formatDate(new Date())}</p>
          <p>Confidencial - Solo para uso del evaluado y profesionales autorizados</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Driving Forces PDF Generator
function generateDrivingForcesPDF(evaluation: any): string {
  const result = evaluation.result;
  const motivators = [
    { key: 'theoretical', name: 'Teórico', color: '#6366f1' },
    { key: 'utilitarian', name: 'Utilitario', color: '#f59e0b' },
    { key: 'aesthetic', name: 'Estético', color: '#ec4899' },
    { key: 'social', name: 'Social', color: '#10b981' },
    { key: 'individualistic', name: 'Individualista', color: '#8b5cf6' },
    { key: 'traditional', name: 'Tradicional', color: '#3b82f6' },
  ];

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte Fuerzas Motivadoras - ${evaluation.recipientName}</title>
      <style>${getBaseStyles()}</style>
    </head>
    <body>
      <div class="report-container">
        <div class="header" style="border-bottom-color: #8b5cf6;">
          <h1 style="color: #8b5cf6;">Reporte de Fuerzas Motivadoras</h1>
          <div class="subtitle">Reclu System</div>
          <div class="subtitle">${evaluation.recipientName}</div>
          <div class="date">Completado el ${formatDate(evaluation.completedAt)}</div>
        </div>

        <div class="section">
          <h2 class="section-title">Perfil de Motivadores</h2>
          <div class="card">
            ${motivators.map(m => {
              const value = result?.[m.key] || 0;
              return `
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: bold; color: ${m.color};">${m.name}</span>
                    <span style="font-weight: bold;">${value.toFixed(1)}%</span>
                  </div>
                  <div class="score-bar">
                    <div class="score-fill" style="width: ${value}%; background: ${m.color};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        ${result?.topMotivators ? `
        <div class="section">
          <h2 class="section-title">Principales Motivadores</h2>
          <div class="strengths-card">
            <div class="card-title">🎯 Top Motivadores</div>
            ${result.topMotivators.slice(0, 3).map((m: any, i: number) => `
              <div class="list-item">
                <div style="background: #8b5cf6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">${i + 1}</div>
                <div><strong>${m.name}</strong> - ${m.value?.toFixed(1) || 0}%</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Este reporte fue generado por Reclu - ${formatDate(new Date())}</p>
          <p>Confidencial - Solo para uso del evaluado y profesionales autorizados</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// EQ PDF Generator
function generateEQPDF(evaluation: any): string {
  const result = evaluation.result;
  const dimensions = [
    { key: 'selfAwareness', name: 'Autoconciencia', color: '#f43f5e' },
    { key: 'selfRegulation', name: 'Autorregulación', color: '#8b5cf6' },
    { key: 'motivation', name: 'Motivación', color: '#f59e0b' },
    { key: 'empathy', name: 'Empatía', color: '#10b981' },
    { key: 'socialSkills', name: 'Habilidades Sociales', color: '#3b82f6' },
  ];

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte Inteligencia Emocional - ${evaluation.recipientName}</title>
      <style>${getBaseStyles()}</style>
    </head>
    <body>
      <div class="report-container">
        <div class="header" style="border-bottom-color: #f43f5e;">
          <h1 style="color: #f43f5e;">Reporte de Inteligencia Emocional</h1>
          <div class="subtitle">Reclu System</div>
          <div class="subtitle">${evaluation.recipientName}</div>
          <div class="date">Completado el ${formatDate(evaluation.completedAt)}</div>
        </div>

        <div class="section">
          <h2 class="section-title">Índice EQ General</h2>
          <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); padding: 30px; border-radius: 12px; text-align: center; border: 2px solid #fbcfe8;">
            <div style="font-size: 48px; font-weight: bold; color: #be185d;">${result?.overallEQ?.toFixed(0) || 0}</div>
            <div style="color: #9d174d; font-size: 14px;">Puntuación General de Inteligencia Emocional</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Dimensiones EQ</h2>
          <div class="card">
            ${dimensions.map(d => {
              const value = result?.[d.key] || 0;
              return `
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: bold; color: ${d.color};">${d.name}</span>
                    <span style="font-weight: bold;">${value.toFixed(0)}/100</span>
                  </div>
                  <div class="score-bar">
                    <div class="score-fill" style="width: ${value}%; background: ${d.color};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        ${result?.strengths && result.strengths.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Fortalezas y Áreas de Desarrollo</h2>
          <div class="two-column">
            <div class="strengths-card">
              <div class="card-title">✓ Fortalezas</div>
              ${result.strengths.slice(0, 5).map((s: string) => `<div class="list-item"><div class="list-bullet"></div><div>${s}</div></div>`).join('')}
            </div>
            <div class="challenges-card">
              <div class="card-title">→ Áreas de Desarrollo</div>
              ${(result.developmentAreas || []).slice(0, 5).map((d: string) => `<div class="list-item"><div class="list-bullet"></div><div>${d}</div></div>`).join('')}
            </div>
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Este reporte fue generado por Reclu - ${formatDate(new Date())}</p>
          <p>Confidencial - Solo para uso del evaluado y profesionales autorizados</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// DNA-25 PDF Generator
function generateDNAPDF(evaluation: any): string {
  const result = evaluation.result;
  const categories = [
    { key: 'thinking', name: 'Pensamiento', color: '#6366f1' },
    { key: 'communication', name: 'Comunicación', color: '#f59e0b' },
    { key: 'leadership', name: 'Liderazgo', color: '#ef4444' },
    { key: 'results', name: 'Resultados', color: '#10b981' },
    { key: 'relationship', name: 'Relaciones', color: '#ec4899' },
  ];

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte DNA-25 - ${evaluation.recipientName}</title>
      <style>${getBaseStyles()}</style>
    </head>
    <body>
      <div class="report-container">
        <div class="header" style="border-bottom-color: #14b8a6;">
          <h1 style="color: #14b8a6;">Reporte DNA-25 Competencias</h1>
          <div class="subtitle">Reclu System</div>
          <div class="subtitle">${evaluation.recipientName}</div>
          <div class="date">Completado el ${formatDate(evaluation.completedAt)}</div>
        </div>

        <div class="section">
          <h2 class="section-title">Perfil de Competencias</h2>
          <div class="card">
            ${categories.map(c => {
              const value = result?.[c.key] || 0;
              return `
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: bold; color: ${c.color};">${c.name}</span>
                    <span style="font-weight: bold;">${value.toFixed(1)}%</span>
                  </div>
                  <div class="score-bar">
                    <div class="score-fill" style="width: ${value}%; background: ${c.color};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        ${result?.topCompetencies ? `
        <div class="section">
          <h2 class="section-title">Top Competencias</h2>
          <div class="strengths-card">
            <div class="card-title">🏆 Competencias Destacadas</div>
            ${result.topCompetencies.slice(0, 5).map((c: any, i: number) => `
              <div class="list-item">
                <div style="background: #14b8a6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">${i + 1}</div>
                <div><strong>${c.name}</strong> - ${c.level || 'Alto'}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Este reporte fue generado por Reclu - ${formatDate(new Date())}</p>
          <p>Confidencial - Solo para uso del evaluado y profesionales autorizados</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Acumen PDF Generator
function generateAcumenPDF(evaluation: any): string {
  const result = evaluation.result;
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte Acumen (ACI) - ${evaluation.recipientName}</title>
      <style>${getBaseStyles()}</style>
    </head>
    <body>
      <div class="report-container">
        <div class="header" style="border-bottom-color: #f59e0b;">
          <h1 style="color: #f59e0b;">Reporte Acumen (ACI)</h1>
          <div class="subtitle">Índice de Capacidad de Juicio</div>
          <div class="subtitle">${evaluation.recipientName}</div>
          <div class="date">Completado el ${formatDate(evaluation.completedAt)}</div>
        </div>

        <div class="section">
          <h2 class="section-title">Puntuación Acumen Total</h2>
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 30px; border-radius: 12px; text-align: center; border: 2px solid #fcd34d;">
            <div style="font-size: 48px; font-weight: bold; color: #b45309;">${result?.totalAcumenScore?.toFixed(1) || 0}</div>
            <div style="color: #92400e; font-size: 14px;">Índice de Capacidad de Juicio</div>
            <div style="margin-top: 10px; background: #fbbf24; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; font-weight: bold;">
              ${result?.acumenLevel || 'MODERADO'}
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Índices de Claridad</h2>
          <div class="two-column">
            <div class="card" style="text-align: center;">
              <div style="font-size: 36px; font-weight: bold; color: #3b82f6;">${result?.externalClarityScore?.toFixed(1) || 0}</div>
              <div style="color: #1e40af;">Claridad Externa</div>
              <div class="score-bar" style="margin-top: 10px;"><div class="score-fill" style="width: ${(result?.externalClarityScore || 0) * 10}%; background: #3b82f6;"></div></div>
            </div>
            <div class="card" style="text-align: center;">
              <div style="font-size: 36px; font-weight: bold; color: #8b5cf6;">${result?.internalClarityScore?.toFixed(1) || 0}</div>
              <div style="color: #5b21b6;">Claridad Interna</div>
              <div class="score-bar" style="margin-top: 10px;"><div class="score-fill" style="width: ${(result?.internalClarityScore || 0) * 10}%; background: #8b5cf6;"></div></div>
            </div>
          </div>
        </div>

        ${result?.strengths && result.strengths.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Fortalezas y Áreas de Desarrollo</h2>
          <div class="two-column">
            <div class="strengths-card">
              <div class="card-title">✓ Fortalezas</div>
              ${result.strengths.slice(0, 5).map((s: string) => `<div class="list-item"><div class="list-bullet"></div><div>${s}</div></div>`).join('')}
            </div>
            <div class="challenges-card">
              <div class="card-title">→ Áreas de Desarrollo</div>
              ${(result.developmentAreas || []).slice(0, 5).map((d: string) => `<div class="list-item"><div class="list-bullet"></div><div>${d}</div></div>`).join('')}
            </div>
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Este reporte fue generado por Reclu - ${formatDate(new Date())}</p>
          <p>Confidencial - Solo para uso del evaluado y profesionales autorizados</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Values PDF Generator
function generateValuesPDF(evaluation: any): string {
  const result = evaluation.result;
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte Valores e Integridad - ${evaluation.recipientName}</title>
      <style>${getBaseStyles()}</style>
    </head>
    <body>
      <div class="report-container">
        <div class="header" style="border-bottom-color: #8b5cf6;">
          <h1 style="color: #8b5cf6;">Reporte de Valores e Integridad</h1>
          <div class="subtitle">Reclu System</div>
          <div class="subtitle">${evaluation.recipientName}</div>
          <div class="date">Completado el ${formatDate(evaluation.completedAt)}</div>
        </div>

        <div class="section">
          <h2 class="section-title">Índice de Integridad</h2>
          <div style="background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); padding: 30px; border-radius: 12px; text-align: center; border: 2px solid #d8b4fe;">
            <div style="font-size: 48px; font-weight: bold; color: #7c3aed;">${result?.integrityIndex?.toFixed(0) || 0}%</div>
            <div style="color: #6d28d9; font-size: 14px;">Índice General de Integridad</div>
          </div>
        </div>

        ${result?.coreValues ? `
        <div class="section">
          <h2 class="section-title">Valores Fundamentales</h2>
          <div class="strengths-card" style="border-color: #d8b4fe; background: #faf5ff;">
            <div class="card-title" style="color: #7c3aed;">🎯 Valores Principales</div>
            ${result.coreValues.slice(0, 5).map((v: any, i: number) => `
              <div class="list-item">
                <div style="background: #8b5cf6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">${i + 1}</div>
                <div><strong>${v.name || v}</strong>${v.score ? ` - ${v.score}%` : ''}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${result?.ethicalDimensions ? `
        <div class="section">
          <h2 class="section-title">Dimensiones Éticas</h2>
          <div class="card">
            ${Object.entries(result.ethicalDimensions).map(([key, value]: [string, any]) => `
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span style="font-weight: bold;">${key}</span>
                  <span style="font-weight: bold;">${typeof value === 'number' ? value.toFixed(0) : value}%</span>
                </div>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${typeof value === 'number' ? value : 0}%; background: #8b5cf6;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Este reporte fue generado por Reclu - ${formatDate(new Date())}</p>
          <p>Confidencial - Solo para uso del evaluado y profesionales autorizados</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Stress PDF Generator
function generateStressPDF(evaluation: any): string {
  const result = evaluation.result;
  const dimensions = [
    { key: 'workStress', name: 'Estrés Laboral', color: '#ef4444' },
    { key: 'emotionalManagement', name: 'Manejo Emocional', color: '#f59e0b' },
    { key: 'recoveryCapacity', name: 'Capacidad de Recuperación', color: '#10b981' },
    { key: 'socialSupport', name: 'Apoyo Social', color: '#3b82f6' },
    { key: 'copingStrategies', name: 'Estrategias de Afrontamiento', color: '#8b5cf6' },
  ];

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte Estrés y Resiliencia - ${evaluation.recipientName}</title>
      <style>${getBaseStyles()}</style>
    </head>
    <body>
      <div class="report-container">
        <div class="header" style="border-bottom-color: #f97316;">
          <h1 style="color: #f97316;">Reporte de Estrés y Resiliencia</h1>
          <div class="subtitle">Reclu System</div>
          <div class="subtitle">${evaluation.recipientName}</div>
          <div class="date">Completado el ${formatDate(evaluation.completedAt)}</div>
        </div>

        <div class="section">
          <h2 class="section-title">Índice de Resiliencia</h2>
          <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); padding: 30px; border-radius: 12px; text-align: center; border: 2px solid #fed7aa;">
            <div style="font-size: 48px; font-weight: bold; color: #c2410c;">${result?.resilienceIndex?.toFixed(0) || result?.indiceResiliencia?.toFixed(0) || 0}%</div>
            <div style="color: #9a3412; font-size: 14px;">Índice General de Resiliencia</div>
            <div style="margin-top: 10px; background: ${(result?.resilienceIndex || result?.indiceResiliencia || 0) >= 70 ? '#22c55e' : (result?.resilienceIndex || result?.indiceResiliencia || 0) >= 40 ? '#f59e0b' : '#ef4444'}; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; font-weight: bold;">
              ${(result?.resilienceIndex || result?.indiceResiliencia || 0) >= 70 ? 'Alta Resiliencia' : (result?.resilienceIndex || result?.indiceResiliencia || 0) >= 40 ? 'Resiliencia Moderada' : 'Baja Resiliencia'}
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Nivel de Estrés General</h2>
          <div class="card" style="text-align: center;">
            <div style="font-size: 36px; font-weight: bold; color: ${(result?.generalStressLevel || result?.nivelEstresGeneral || 0) <= 30 ? '#22c55e' : (result?.generalStressLevel || result?.nivelEstresGeneral || 0) <= 60 ? '#f59e0b' : '#ef4444'};">
              ${result?.generalStressLevel?.toFixed(0) || result?.nivelEstresGeneral?.toFixed(0) || 0}%
            </div>
            <div style="color: #6b7280; font-size: 14px;">Nivel de Estrés</div>
            <div class="score-bar" style="margin-top: 10px; max-width: 300px; margin-left: auto; margin-right: auto;">
              <div class="score-fill" style="width: ${result?.generalStressLevel || result?.nivelEstresGeneral || 0}%; background: ${(result?.generalStressLevel || result?.nivelEstresGeneral || 0) <= 30 ? '#22c55e' : (result?.generalStressLevel || result?.nivelEstresGeneral || 0) <= 60 ? '#f59e0b' : '#ef4444'};"></div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Dimensiones de Estrés</h2>
          <div class="card">
            ${dimensions.map(d => {
              const value = result?.[d.key] || result?.dimensiones?.[d.key] || 0;
              return `
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: bold; color: ${d.color};">${d.name}</span>
                    <span style="font-weight: bold;">${typeof value === 'number' ? value.toFixed(0) : 0}%</span>
                  </div>
                  <div class="score-bar">
                    <div class="score-fill" style="width: ${typeof value === 'number' ? value : 0}%; background: ${d.color};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        ${result?.protectiveFactors || result?.factoresProtectores ? `
        <div class="section">
          <h2 class="section-title">Factores Protectores</h2>
          <div class="strengths-card">
            <div class="card-title">🛡️ Factores de Protección</div>
            ${(result.protectiveFactors || result.factoresProtectores || []).slice(0, 5).map((f: string) => `<div class="list-item"><div class="list-bullet"></div><div>${f}</div></div>`).join('')}
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Este reporte fue generado por Reclu - ${formatDate(new Date())}</p>
          <p>Confidencial - Solo para uso del evaluado y profesionales autorizados</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
