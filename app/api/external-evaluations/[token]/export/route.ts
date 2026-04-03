
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PDFGenerator } from '@/lib/pdf-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Buscar evaluación por token
    const evaluation = await prisma.externalEvaluation.findUnique({
      where: { token },
      include: {
        result: true,
        senderUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!evaluation) {
      return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 });
    }

    // Verificar que esté completada
    if (evaluation.status !== 'COMPLETED' || !evaluation.result) {
      return NextResponse.json({ error: 'Evaluación no completada' }, { status: 400 });
    }

    const result = evaluation.result;

    // Generar interpretación simplificada
    const getInterpretation = (primaryStyle: string) => {
      const interpretations = {
        'D': {
          title: 'Dominante',
          description: 'Orientado a resultados, directo y decisivo. Le gusta liderar y tomar el control de las situaciones.',
          strengths: ['Orientado a resultados', 'Toma decisiones rápidamente', 'Liderazgo natural', 'Competitivo', 'Independiente'],
          challenges: ['Puede ser impaciente', 'Tendencia a dominar', 'Menos atento a detalles', 'Puede parecer agresivo'],
          motivators: ['Lograr metas', 'Autoridad', 'Desafíos', 'Control', 'Reconocimiento por logros'],
          stressors: ['Pérdida de control', 'Rutinas repetitivas', 'Micro-gestión', 'Indecisión', 'Inactividad']
        },
        'I': {
          title: 'Influyente',
          description: 'Sociable, optimista y expresivo. Disfruta interactuando con otros y creando un ambiente positivo.',
          strengths: ['Comunicación efectiva', 'Entusiasmo', 'Optimismo', 'Persuasión', 'Trabajo en equipo'],
          challenges: ['Puede hablar demasiado', 'Desorganizado', 'Impulsivo', 'Evita conflictos'],
          motivators: ['Reconocimiento social', 'Variedad', 'Interacción con personas', 'Libertad de expresión', 'Ambiente divertido'],
          stressors: ['Aislamiento', 'Críticas personales', 'Ambientes hostiles', 'Trabajar solo', 'Rutinas estrictas']
        },
        'S': {
          title: 'Estable',
          description: 'Paciente, leal y confiable. Valora la estabilidad y mantiene un enfoque constante en sus tareas.',
          strengths: ['Confiabilidad', 'Paciencia', 'Lealtad', 'Trabajo en equipo', 'Consistencia'],
          challenges: ['Resistencia al cambio', 'Dificultad para decir no', 'Evita confrontaciones', 'Lento para decidir'],
          motivators: ['Estabilidad', 'Seguridad laboral', 'Reconocimiento por lealtad', 'Ambiente armonioso', 'Tradiciones'],
          stressors: ['Cambios súbitos', 'Presión de tiempo', 'Conflictos', 'Ambigüedad', 'Múltiples prioridades']
        },
        'C': {
          title: 'Concienzudo',
          description: 'Analítico, preciso y orientado a la calidad. Se enfoca en hacer las cosas correctamente y con atención al detalle.',
          strengths: ['Atención al detalle', 'Análisis sistemático', 'Calidad', 'Organización', 'Pensamiento crítico'],
          challenges: ['Perfeccionismo', 'Análisis excesivo', 'Crítico', 'Rígido', 'Evita riesgos'],
          motivators: ['Calidad', 'Precisión', 'Reconocimiento por expertise', 'Tiempo para analizar', 'Estándares claros'],
          stressors: ['Cambios sin explicación', 'Decisiones apresuradas', 'Ambigüedad', 'Críticas al trabajo', 'Estándares poco claros']
        }
      };

      return interpretations[primaryStyle as keyof typeof interpretations] || interpretations['D'];
    };

    const interpretation = getInterpretation(result.primaryStyle);

    // Generar HTML para PDF
    const htmlContent = generateExternalReportHTML(evaluation, result, interpretation);

    // Generar PDF
    const pdfBlob = await PDFGenerator.getPDFBlob(htmlContent, {
      format: 'a4',
      orientation: 'portrait'
    });

    // Retornar PDF como respuesta
    return new Response(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="reporte-disc-${evaluation.recipientName.toLowerCase().replace(/\s+/g, '-')}.pdf"`
      }
    });

  } catch (error) {
    console.error('Error generating external evaluation PDF:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

function generateExternalReportHTML(evaluation: any, result: any, interpretation: any): string {
  const completedDate = new Date(evaluation.completedAt!).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getDimensionColor = (dimension: string) => {
    switch (dimension) {
      case 'D': return { bg: '#fee2e2', color: '#dc2626', border: '#fecaca' };
      case 'I': return { bg: '#fef3c7', color: '#d97706', border: '#fde68a' };
      case 'S': return { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' };
      case 'C': return { bg: '#dbeafe', color: '#2563eb', border: '#bfdbfe' };
      default: return { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' };
    }
  };

  const primaryColor = getDimensionColor(result.primaryStyle);

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reporte DISC - ${evaluation.title}</title>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
          font-size: 12px;
        }
        
        .report-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          border-bottom: 3px solid #4f46e5;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          color: #4f46e5;
          font-size: 24px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        
        .header .subtitle {
          color: #6b7280;
          font-size: 16px;
          margin-bottom: 5px;
        }
        
        .header .date {
          color: #9ca3af;
          font-size: 14px;
        }
        
        .section {
          margin-bottom: 30px;
          break-inside: avoid;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 15px;
          padding-bottom: 5px;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .personality-card {
          background: ${primaryColor.bg};
          border: 2px solid ${primaryColor.border};
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .personality-type {
          font-size: 22px;
          font-weight: bold;
          color: ${primaryColor.color};
          margin-bottom: 10px;
        }
        
        .personality-description {
          color: ${primaryColor.color};
          font-size: 14px;
          margin-bottom: 15px;
        }
        
        .scores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .score-item {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid transparent;
        }
        
        .score-item.d { border-left-color: #dc2626; }
        .score-item.i { border-left-color: #d97706; }
        .score-item.s { border-left-color: #16a34a; }
        .score-item.c { border-left-color: #2563eb; }
        
        .score-label {
          font-weight: bold;
          margin-bottom: 5px;
          font-size: 14px;
        }
        
        .score-value {
          font-size: 20px;
          font-weight: bold;
          color: #1f2937;
        }
        
        .score-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          margin-top: 8px;
          overflow: hidden;
        }
        
        .score-fill {
          height: 100%;
          border-radius: 4px;
        }
        
        .score-fill.d { background: #dc2626; }
        .score-fill.i { background: #d97706; }
        .score-fill.s { background: #16a34a; }
        .score-fill.c { background: #2563eb; }
        
        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .strengths-card, .challenges-card {
          padding: 20px;
          border-radius: 8px;
          border: 2px solid;
        }
        
        .strengths-card {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }
        
        .challenges-card {
          background: #fffbeb;
          border-color: #fde68a;
        }
        
        .card-title {
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .strengths-card .card-title {
          color: #166534;
        }
        
        .challenges-card .card-title {
          color: #92400e;
        }
        
        .list-item {
          margin-bottom: 8px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        
        .list-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }
        
        .strengths-card .list-bullet {
          background: #16a34a;
        }
        
        .challenges-card .list-bullet {
          background: #d97706;
        }
        
        .summary-stats {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 20px;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 10px;
        }
        
        @media print {
          body { font-size: 11px; }
          .report-container { padding: 10px; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="report-container">
        <!-- Header -->
        <div class="header">
          <h1>Reporte de Evaluación DISC</h1>
          <div class="subtitle">MotivaIQ System - Evaluación Externa</div>
          <div class="subtitle">${evaluation.title}</div>
          <div class="date">Completado el ${completedDate}</div>
          <div class="date">Evaluado: ${evaluation.recipientName}</div>
          <div class="date">Enviado por: ${evaluation.senderUser.firstName} ${evaluation.senderUser.lastName}</div>
        </div>

        <!-- Personality Type Section -->
        <div class="section">
          <h2 class="section-title">Perfil de Personalidad</h2>
          <div class="personality-card">
            <div class="personality-type">
              ${interpretation.title}
            </div>
            <div class="personality-description">
              ${interpretation.description}
            </div>
            <div>
              <strong>Estilo Principal:</strong> ${result.primaryStyle}
              ${result.secondaryStyle ? `<br><strong>Estilo Secundario:</strong> ${result.secondaryStyle}` : ''}
              <br><strong>Intensidad:</strong> ${result.styleIntensity.toFixed(1)}%
            </div>
          </div>
        </div>

        <!-- DISC Scores -->
        <div class="section">
          <h2 class="section-title">Puntuaciones DISC</h2>
          <div class="scores-grid">
            <div class="score-item d">
              <div class="score-label">D - Dominante</div>
              <div class="score-value">${result.percentileD.toFixed(1)}%</div>
              <div class="score-bar">
                <div class="score-fill d" style="width: ${result.percentileD}%"></div>
              </div>
            </div>
            <div class="score-item i">
              <div class="score-label">I - Influyente</div>
              <div class="score-value">${result.percentileI.toFixed(1)}%</div>
              <div class="score-bar">
                <div class="score-fill i" style="width: ${result.percentileI}%"></div>
              </div>
            </div>
            <div class="score-item s">
              <div class="score-label">S - Estable</div>
              <div class="score-value">${result.percentileS.toFixed(1)}%</div>
              <div class="score-bar">
                <div class="score-fill s" style="width: ${result.percentileS}%"></div>
              </div>
            </div>
            <div class="score-item c">
              <div class="score-label">C - Concienzudo</div>
              <div class="score-value">${result.percentileC.toFixed(1)}%</div>
              <div class="score-bar">
                <div class="score-fill c" style="width: ${result.percentileC}%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Qualitative Analysis Section -->
        <div class="section" style="page-break-before: always;">
          <h2 class="section-title">📊 Análisis Cualitativo del Perfil</h2>
          
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #cbd5e1;">
            <h3 style="color: #1e293b; font-size: 16px; margin-bottom: 12px; font-weight: bold;">Estilo de Comportamiento General</h3>
            <p style="color: #475569; font-size: 13px; line-height: 1.7; text-align: justify;">
              ${getGeneralBehaviorDescription(result.primaryStyle, result.secondaryStyle)}
            </p>
          </div>

          <div style="background: #fefce8; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #fde047;">
            <h3 style="color: #854d0e; font-size: 16px; margin-bottom: 12px; font-weight: bold;">Comunicación</h3>
            <p style="color: #713f12; font-size: 13px; line-height: 1.7; text-align: justify;">
              ${getCommunicationStyle(result.primaryStyle)}
            </p>
          </div>

          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #86efac;">
            <h3 style="color: #166534; font-size: 16px; margin-bottom: 12px; font-weight: bold;">En el Entorno Laboral</h3>
            <p style="color: #15803d; font-size: 13px; line-height: 1.7; text-align: justify;">
              ${getWorkEnvironmentDescription(result.primaryStyle)}
            </p>
          </div>

          <div style="background: #eff6ff; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #93c5fd;">
            <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 12px; font-weight: bold;">Toma de Decisiones</h3>
            <p style="color: #1d4ed8; font-size: 13px; line-height: 1.7; text-align: justify;">
              ${getDecisionMakingStyle(result.primaryStyle)}
            </p>
          </div>

          <div style="background: #fdf4ff; padding: 20px; border-radius: 12px; border: 1px solid #e879f9;">
            <h3 style="color: #86198f; font-size: 16px; margin-bottom: 12px; font-weight: bold;">Relaciones Interpersonales</h3>
            <p style="color: #a21caf; font-size: 13px; line-height: 1.7; text-align: justify;">
              ${getInterpersonalRelationsDescription(result.primaryStyle)}
            </p>
          </div>
        </div>

        <!-- Strengths & Challenges -->
        <div class="section">
          <h2 class="section-title">Fortalezas y Áreas de Desarrollo</h2>
          <div class="two-column">
            <div class="strengths-card">
              <div class="card-title">✓ Fortalezas</div>
              ${interpretation.strengths.map((strength: string) => `
                <div class="list-item">
                  <div class="list-bullet"></div>
                  <div>${strength}</div>
                </div>
              `).join('')}
            </div>
            <div class="challenges-card">
              <div class="card-title">→ Áreas de Desarrollo</div>
              ${interpretation.challenges.map((challenge: string) => `
                <div class="list-item">
                  <div class="list-bullet"></div>
                  <div>${challenge}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Motivators & Stressors -->
        <div class="section">
          <h2 class="section-title">Motivadores y Estresores</h2>
          <div class="two-column">
            <div class="strengths-card">
              <div class="card-title">⚡ Motivadores Principales</div>
              ${interpretation.motivators.slice(0, 5).map((motivator: string) => `
                <div class="list-item">
                  <div class="list-bullet"></div>
                  <div>${motivator}</div>
                </div>
              `).join('')}
            </div>
            <div class="challenges-card">
              <div class="card-title">⚠️ Estresores Potenciales</div>
              ${interpretation.stressors.slice(0, 5).map((stressor: string) => `
                <div class="list-item">
                  <div class="list-bullet"></div>
                  <div>${stressor}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Recommendations Section -->
        <div class="section">
          <h2 class="section-title">📋 Recomendaciones de Desarrollo</h2>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; border-left: 4px solid #4f46e5;">
            ${getRecommendations(result.primaryStyle).map((rec: string, index: number) => `
              <div style="margin-bottom: 12px; padding-left: 10px;">
                <strong style="color: #4f46e5;">${index + 1}.</strong>
                <span style="color: #334155; margin-left: 8px;">${rec}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="section">
          <h2 class="section-title">Resumen de la Evaluación</h2>
          <div class="summary-stats">
            <div><strong>Evaluación Externa:</strong> ${evaluation.title}</div>
            <div><strong>Tipo de Personalidad:</strong> ${result.personalityType}</div>
            <div><strong>Intensidad del Estilo:</strong> ${result.styleIntensity.toFixed(1)}%</div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Este reporte fue generado por el Sistema MotivaIQ - ${new Date().toLocaleDateString('es-ES')}</p>
          <p>Evaluación Externa - Enviado por: ${evaluation.senderUser.firstName} ${evaluation.senderUser.lastName}</p>
          <p>Confidencial - Solo para uso del evaluado y profesionales autorizados</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Helper functions for qualitative analysis
function getGeneralBehaviorDescription(primaryStyle: string, secondaryStyle: string | null): string {
  const descriptions: Record<string, string> = {
    'D': 'Las personas con estilo Dominante se caracterizan por ser directas, decididas y orientadas a resultados. Tienden a tomar el control de las situaciones, buscan desafíos y son competitivas por naturaleza. Su enfoque está en lograr objetivos de manera eficiente y superar obstáculos. Prefieren un ritmo rápido y pueden sentirse frustradas con procesos lentos o cuando perciben falta de acción.',
    'I': 'Las personas con estilo Influyente se distinguen por su entusiasmo, optimismo y habilidades sociales. Son comunicadores naturales que disfrutan interactuar con otros y tienden a ser persuasivos. Su energía positiva y carisma les permite conectar fácilmente con las personas. Valoran el reconocimiento y buscan ambientes de trabajo colaborativos y dinámicos.',
    'S': 'Las personas con estilo Estable se caracterizan por su paciencia, lealtad y enfoque en la armonía. Son excelentes oyentes y prefieren ambientes predecibles y seguros. Valoran las relaciones a largo plazo y trabajan de manera consistente y metódica. Su naturaleza servicial los convierte en excelentes compañeros de equipo que priorizan el bienestar del grupo.',
    'C': 'Las personas con estilo Concienzudo se distinguen por su precisión, pensamiento analítico y atención al detalle. Son sistemáticos en su enfoque y buscan la calidad en todo lo que hacen. Prefieren basar sus decisiones en datos y hechos, y tienden a ser perfeccionistas. Valoran la exactitud y los estándares altos en el trabajo.'
  };
  
  let description = descriptions[primaryStyle] || descriptions['D'];
  
  if (secondaryStyle) {
    const secondary: Record<string, string> = {
      'D': ' Su estilo secundario Dominante añade determinación y enfoque en resultados.',
      'I': ' Su estilo secundario Influyente complementa con habilidades sociales y persuasión.',
      'S': ' Su estilo secundario Estable aporta paciencia y orientación al equipo.',
      'C': ' Su estilo secundario Concienzudo contribuye con precisión y pensamiento analítico.'
    };
    description += secondary[secondaryStyle] || '';
  }
  
  return description;
}

function getCommunicationStyle(primaryStyle: string): string {
  const styles: Record<string, string> = {
    'D': 'Su estilo de comunicación es directo y conciso. Prefiere ir al grano y valora la eficiencia en las conversaciones. Puede ser percibido como franco o incluso brusco en ocasiones, ya que prioriza la claridad sobre la diplomacia. Es efectivo comunicando expectativas y plazos, y prefiere recibir información de manera estructurada y orientada a la acción.',
    'I': 'Su estilo de comunicación es expresivo y entusiasta. Utiliza historias y ejemplos para transmitir sus ideas, y su lenguaje corporal es animado. Es hábil para inspirar y motivar a otros a través de la conversación. Prefiere interacciones cara a cara y disfruta de las conversaciones informales que construyen relaciones.',
    'S': 'Su estilo de comunicación es cálido y considerado. Escucha activamente antes de responder y prefiere un ritmo conversacional pausado. Es diplomático y busca evitar conflictos en sus interacciones. Valora la comunicación sincera y genuina, y es excelente creando un ambiente de confianza en las conversaciones.',
    'C': 'Su estilo de comunicación es preciso y detallado. Prefiere proporcionar información completa y bien documentada. Tiende a hacer preguntas específicas para asegurar comprensión y puede necesitar tiempo para procesar información antes de responder. Valora la comunicación escrita y las presentaciones bien estructuradas.'
  };
  return styles[primaryStyle] || styles['D'];
}

function getWorkEnvironmentDescription(primaryStyle: string): string {
  const environments: Record<string, string> = {
    'D': 'En el trabajo, busca autonomía y oportunidades para liderar proyectos desafiantes. Es más productivo cuando tiene control sobre su trabajo y puede ver resultados tangibles. Prospera en ambientes competitivos y dinámicos donde puede tomar decisiones rápidas. Puede frustrarse con exceso de burocracia o microgestión.',
    'I': 'En el trabajo, busca un ambiente colaborativo y socialmente estimulante. Es más productivo cuando puede interactuar con colegas y participar en proyectos de equipo. Prospera en culturas organizacionales abiertas y positivas donde se reconocen los logros. Puede encontrar difícil trabajar en aislamiento prolongado.',
    'S': 'En el trabajo, busca estabilidad y un ambiente armonioso. Es más productivo cuando tiene claridad en sus responsabilidades y puede trabajar a un ritmo constante. Prospera en equipos colaborativos donde hay respeto mutuo. Puede encontrar estresantes los cambios frecuentes o ambientes altamente competitivos.',
    'C': 'En el trabajo, busca estructura y oportunidades para aplicar su expertise técnico. Es más productivo cuando tiene acceso a información completa y tiempo para análisis. Prospera en ambientes donde se valora la calidad y la precisión. Puede frustrarse con decisiones impulsivas o falta de planificación.'
  };
  return environments[primaryStyle] || environments['D'];
}

function getDecisionMakingStyle(primaryStyle: string): string {
  const decisionStyles: Record<string, string> = {
    'D': 'Toma decisiones de manera rápida y decisiva, basándose en la evaluación del panorama general más que en detalles minuciosos. Prefiere la acción sobre el análisis prolongado y está dispuesto a asumir riesgos calculados. Una vez que toma una decisión, avanza con determinación y puede frustrarse si otros tardan en decidir.',
    'I': 'Toma decisiones considerando el impacto en las personas y las relaciones. Puede buscar consenso y valora las opiniones de otros en el proceso. Su optimismo natural puede llevarle a subestimar riesgos potenciales. Prefiere decisiones que generen entusiasmo y apoyo del equipo.',
    'S': 'Toma decisiones de manera deliberada y considerada, prefiriendo tener tiempo para evaluar opciones. Considera cómo las decisiones afectarán a otros y busca soluciones que mantengan la armonía. Puede ser reacio a tomar decisiones que impliquen cambios significativos o riesgos altos.',
    'C': 'Toma decisiones basándose en datos, análisis y evidencia. Prefiere evaluar todas las opciones disponibles antes de comprometerse con una dirección. Puede parecer indeciso cuando no tiene suficiente información, pero una vez que decide, sus elecciones suelen estar bien fundamentadas y documentadas.'
  };
  return decisionStyles[primaryStyle] || decisionStyles['D'];
}

function getInterpersonalRelationsDescription(primaryStyle: string): string {
  const relations: Record<string, string> = {
    'D': 'En las relaciones, tiende a ser directo y orientado a objetivos. Respeta a las personas que demuestran competencia y eficiencia. Puede ser impaciente con quienes no cumplen expectativas y prefiere relaciones profesionales claras. Construye confianza a través de resultados y cumplimiento de compromisos.',
    'I': 'En las relaciones, es cálido, accesible y genuinamente interesado en los demás. Forma conexiones fácilmente y disfruta construyendo redes amplias de contactos. Valora la amistad y busca ambientes sociales positivos. Puede ser generoso con su tiempo y energía para ayudar a otros.',
    'S': 'En las relaciones, es leal, confiable y solidario. Prefiere círculos cercanos de amigos y colegas de confianza sobre redes amplias pero superficiales. Es paciente y comprensivo con los demás, y prioriza mantener relaciones armoniosas. Puede tener dificultad expresando desacuerdo para evitar conflictos.',
    'C': 'En las relaciones, es reservado pero leal una vez que se establece confianza. Prefiere interacciones significativas sobre conversaciones superficiales. Valora la consistencia y la fiabilidad en los demás. Puede ser percibido como distante inicialmente, pero desarrolla relaciones profundas y duraderas.'
  };
  return relations[primaryStyle] || relations['D'];
}

function getRecommendations(primaryStyle: string): string[] {
  const recommendations: Record<string, string[]> = {
    'D': [
      'Practique la escucha activa y permita que otros expresen sus opiniones completamente antes de responder.',
      'Desarrolle paciencia con procesos que requieren tiempo y atención al detalle.',
      'Busque oportunidades para reconocer y valorar las contribuciones de otros.',
      'Equilibre su enfoque en resultados con atención a las relaciones interpersonales.',
      'Considere el impacto emocional de sus decisiones en los demás.'
    ],
    'I': [
      'Desarrolle sistemas para dar seguimiento a compromisos y plazos.',
      'Practique la escucha sin interrumpir y permita momentos de silencio en conversaciones.',
      'Equilibre el optimismo con análisis realista de riesgos y desafíos.',
      'Trabaje en documentar decisiones y procesos importantes.',
      'Busque feedback constructivo y use la crítica como oportunidad de crecimiento.'
    ],
    'S': [
      'Practique expresar desacuerdos de manera constructiva y directa.',
      'Desarrolle flexibilidad para adaptarse a cambios y nuevas situaciones.',
      'Busque oportunidades para tomar iniciativa y liderar cuando sea apropiado.',
      'Establezca límites claros para proteger su tiempo y energía.',
      'Celebre sus logros y comparta sus éxitos con otros.'
    ],
    'C': [
      'Practique tomar decisiones con información incompleta cuando sea necesario.',
      'Desarrolle tolerancia hacia diferentes estándares de calidad en situaciones apropiadas.',
      'Busque oportunidades para compartir su expertise y colaborar con otros.',
      'Equilibre el perfeccionismo con la necesidad de avanzar y entregar resultados.',
      'Trabaje en comunicar ideas de manera más concisa y accesible.'
    ]
  };
  return recommendations[primaryStyle] || recommendations['D'];
}
