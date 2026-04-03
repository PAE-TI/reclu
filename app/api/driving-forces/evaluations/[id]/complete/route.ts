
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface Context {
  params: { id: string };
}

interface DrivingForceScores {
  [key: string]: number;
}

// POST - Completar evaluación y calcular resultados
export async function POST(req: NextRequest, { params }: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener todas las respuestas de la evaluación
    const responses = await prisma.drivingForcesResponse.findMany({
      where: {
        evaluationId: params.id,
        userId: session.user.id,
      },
      include: {
        question: true,
      },
    });

    if (responses.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron respuestas para calcular' },
        { status: 400 }
      );
    }

    // Inicializar scores y contadores para cada driving force
    const scores: DrivingForceScores = {
      INTELECTUAL: 0,
      INSTINTIVO: 0,
      PRACTICO: 0,
      ALTRUISTA: 0,
      ARMONIOSO: 0,
      OBJETIVO: 0,
      BENEVOLO: 0,
      INTENCIONAL: 0,
      DOMINANTE: 0,
      COLABORATIVO: 0,
      ESTRUCTURADO: 0,
      RECEPTIVO: 0,
    };

    // Contador de apariciones de cada fuerza
    const forceCounts: DrivingForceScores = {
      INTELECTUAL: 0,
      INSTINTIVO: 0,
      PRACTICO: 0,
      ALTRUISTA: 0,
      ARMONIOSO: 0,
      OBJETIVO: 0,
      BENEVOLO: 0,
      INTENCIONAL: 0,
      DOMINANTE: 0,
      COLABORATIVO: 0,
      ESTRUCTURADO: 0,
      RECEPTIVO: 0,
    };

    // Procesar cada respuesta - sumar rankings y contar apariciones
    responses.forEach(response => {
      const question = response.question;
      
      // Sumar los rankings (1=más como tú, 4=menos como tú)
      scores[question.forceA] += response.rankingA;
      scores[question.forceB] += response.rankingB;
      scores[question.forceC] += response.rankingC;
      scores[question.forceD] += response.rankingD;
      
      // Contar apariciones
      forceCounts[question.forceA]++;
      forceCounts[question.forceB]++;
      forceCounts[question.forceC]++;
      forceCounts[question.forceD]++;
    });

    // Calcular percentiles normalizados por fuerza
    // Sistema: ranking 1=más como tú (alta preferencia), 4=menos como tú (baja preferencia)
    // Por lo tanto: puntaje bajo = percentil alto
    const percentiles: DrivingForceScores = {};
    
    Object.entries(scores).forEach(([force, totalScore]) => {
      const count = forceCounts[force];
      
      if (count === 0) {
        // Si la fuerza no apareció en ninguna pregunta, usar 50%
        percentiles[force] = 50;
        return;
      }
      
      // Para cada fuerza:
      // - Puntaje mínimo posible = count * 1 (todos los 1s)
      // - Puntaje máximo posible = count * 4 (todos los 4s)
      const minPossible = count * 1;
      const maxPossible = count * 4;
      
      // Normalizar: puntaje bajo = percentil alto
      const rawPercentile = ((maxPossible - totalScore) / (maxPossible - minPossible)) * 100;
      
      // Clamp entre 0 y 100, redondear a 1 decimal
      percentiles[force] = Math.round(Math.max(0, Math.min(100, rawPercentile)) * 10) / 10;
    });

    // Ordenar por percentil para determinar jerarquía
    const sortedForces = Object.entries(percentiles)
      .sort(([, a], [, b]) => b - a)
      .map(([force]) => force);

    // Determinar clusters
    const primaryMotivators = sortedForces.slice(0, 4);
    const situationalMotivators = sortedForces.slice(4, 8);
    const indifferentMotivators = sortedForces.slice(8, 12);

    // Crear resultado
    const result = await prisma.drivingForcesResult.create({
      data: {
        userId: session.user.id,
        evaluationId: params.id,
        
        // Raw scores
        intelectualScore: scores.INTELECTUAL,
        instintivoScore: scores.INSTINTIVO,
        practicoScore: scores.PRACTICO,
        altruistaScore: scores.ALTRUISTA,
        armoniosoScore: scores.ARMONIOSO,
        objetivoScore: scores.OBJETIVO,
        benevoloScore: scores.BENEVOLO,
        intencionalScore: scores.INTENCIONAL,
        dominanteScore: scores.DOMINANTE,
        colaborativoScore: scores.COLABORATIVO,
        estructuradoScore: scores.ESTRUCTURADO,
        receptivoScore: scores.RECEPTIVO,
        
        // Percentiles
        intelectualPercentile: percentiles.INTELECTUAL,
        instintivoPercentile: percentiles.INSTINTIVO,
        practicoPercentile: percentiles.PRACTICO,
        altruistaPercentile: percentiles.ALTRUISTA,
        armoniosoPercentile: percentiles.ARMONIOSO,
        objetivoPercentile: percentiles.OBJETIVO,
        benevoloPercentile: percentiles.BENEVOLO,
        intencionalPercentile: percentiles.INTENCIONAL,
        dominantePercentile: percentiles.DOMINANTE,
        colaborativoPercentile: percentiles.COLABORATIVO,
        estructuradoPercentile: percentiles.ESTRUCTURADO,
        receptivoPercentile: percentiles.RECEPTIVO,
        
        // Clusters
        primaryMotivators,
        situationalMotivators,
        indifferentMotivators,
        
        // Top motivators
        topMotivator: sortedForces[0] as any,
        secondMotivator: sortedForces[1] as any,
        thirdMotivator: sortedForces[2] as any,
        fourthMotivator: sortedForces[3] as any,
      },
    });

    // Marcar evaluación como completada
    await prisma.drivingForcesEvaluation.update({
      where: { id: params.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Generar interpretación
    await generateInterpretation(result.id, primaryMotivators);

    return NextResponse.json({ 
      result, 
      message: 'Evaluación completada exitosamente' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error al completar evaluación:', error);
    return NextResponse.json(
      { error: 'Error al completar evaluación' },
      { status: 500 }
    );
  }
}

// Función auxiliar para generar interpretación
async function generateInterpretation(resultId: string, primaryMotivators: string[]) {
  try {
    const motivationalProfile = primaryMotivators.slice(0, 2).join('-');
    
    // Mapeo de interpretaciones básicas
    const interpretations = getInterpretations();
    
    const topMotivator = primaryMotivators[0];
    const interpretation = (interpretations as any)[topMotivator] || (interpretations as any).DEFAULT;
    
    await prisma.drivingForcesInterpretation.create({
      data: {
        resultId,
        motivationalProfile,
        title: interpretation.title,
        description: interpretation.description,
        strengths: interpretation.strengths,
        challenges: interpretation.challenges,
        energizers: interpretation.energizers,
        stressors: interpretation.stressors,
        idealEnvironment: interpretation.idealEnvironment,
        workPreferences: interpretation.workPreferences,
        avoidanceAreas: interpretation.avoidanceAreas,
        developmentTips: interpretation.developmentTips,
        careerAlignment: interpretation.careerAlignment,
      },
    });
  } catch (error) {
    console.error('Error al generar interpretación:', error);
  }
}

// Interpretaciones por tipo motivacional
function getInterpretations() {
  return {
    INTELECTUAL: {
      title: "El Pensador Estratégico",
      description: "Impulsado por oportunidades de aprendizaje y desarrollo intelectual. Busca constantemente nueva información y disfruta resolviendo problemas complejos.",
      strengths: ["Aprendizaje rápido", "Pensamiento analítico", "Resolución de problemas", "Investigación profunda"],
      challenges: ["Puede sobre-analizar", "Impaciencia con rutinas", "Necesidad constante de estímulo intelectual"],
      energizers: ["Nuevos desafíos", "Oportunidades de aprendizaje", "Problemas complejos", "Debates intelectuales"],
      stressors: ["Rutinas repetitivas", "Falta de estímulo mental", "Decisiones sin análisis", "Ambientes anti-intelectuales"],
      idealEnvironment: "Entornos que fomenten el aprendizaje continuo, la investigación y el análisis profundo de problemas complejos.",
      workPreferences: "Proyectos desafiantes que requieran investigación, análisis y pensamiento estratégico. Prefiere autonomía para explorar soluciones.",
      avoidanceAreas: ["Trabajos repetitivos", "Ambientes que desalientan preguntas", "Roles sin oportunidades de crecimiento intelectual"],
      developmentTips: ["Buscar oportunidades de formación continua", "Desarrollar paciencia con procesos más lentos", "Compartir conocimientos con otros"],
      careerAlignment: ["Investigación y desarrollo", "Consultoría estratégica", "Academia", "Análisis de datos", "Innovación tecnológica"]
    },
    INSTINTIVO: {
      title: "El Decisor Intuitivo",
      description: "Confía en la experiencia pasada y la intuición para tomar decisiones. Prefiere enfoques probados y confía en su instinto natural.",
      strengths: ["Toma de decisiones rápida", "Intuición desarrollada", "Aplicación de experiencias", "Sentido común práctico"],
      challenges: ["Resistencia a nuevos métodos", "Dificultad para explicar decisiones intuitivas", "Puede desestimar datos analíticos"],
      energizers: ["Confianza en su experiencia", "Reconocimiento de su intuición", "Autonomía en decisiones", "Situaciones familiares"],
      stressors: ["Presión para justificar decisiones", "Cambios constantes de método", "Micro-gestión", "Ambientes muy estructurados"],
      idealEnvironment: "Espacios que valoren la experiencia y permitan tomar decisiones basadas en intuición y conocimiento práctico.",
      workPreferences: "Roles que requieran toma de decisiones rápida y donde la experiencia sea valorada. Prefiere cierta autonomía.",
      avoidanceAreas: ["Análisis excesivo sin acción", "Procesos muy burocráticos", "Ambientes que desvalorizan la experiencia"],
      developmentTips: ["Documentar el proceso detrás de decisiones intuitivas", "Estar abierto a nuevas metodologías", "Combinar intuición con datos"],
      careerAlignment: ["Gestión operativa", "Ventas", "Liderazgo de equipos", "Roles de crisis", "Emprendimiento"]
    },
    PRACTICO: {
      title: "El Optimizador de Resultados",
      description: "Enfocado en obtener resultados prácticos y eficiencia máxima. Busca el retorno de inversión en todas las actividades.",
      strengths: ["Eficiencia operativa", "Enfoque en resultados", "Optimización de recursos", "Pragmatismo"],
      challenges: ["Puede priorizar eficiencia sobre calidad", "Impaciencia con procesos largos", "Enfoque excesivo en ROI"],
      energizers: ["Resultados medibles", "Eficiencia mejorada", "Objetivos claros", "Recursos optimizados"],
      stressors: ["Procesos ineficientes", "Falta de métricas claras", "Desperdicio de recursos", "Objetivos ambiguos"],
      idealEnvironment: "Organizaciones orientadas a resultados con métricas claras y enfoque en eficiencia operativa.",
      workPreferences: "Proyectos con objetivos medibles y plazos definidos. Prefiere autonomía para optimizar procesos.",
      avoidanceAreas: ["Proyectos sin métricas claras", "Ambientes burocráticos", "Roles puramente teóricos"],
      developmentTips: ["Balancear eficiencia con calidad", "Desarrollar paciencia con procesos estratégicos", "Considerar impacto a largo plazo"],
      careerAlignment: ["Operaciones", "Gestión de proyectos", "Consultoría de eficiencia", "Finanzas", "Supply chain"]
    },
    DEFAULT: {
      title: "Perfil Motivacional Único",
      description: "Combinación única de fuerzas motivacionales que crea un perfil personalizado de energizadores y preferencias.",
      strengths: ["Versatilidad motivacional", "Adaptabilidad", "Múltiples fuentes de energía"],
      challenges: ["Necesidad de equilibrar múltiples motivadores", "Complejidad en la toma de decisiones"],
      energizers: ["Variedad en actividades", "Múltiples fuentes de satisfacción", "Flexibilidad en enfoques"],
      stressors: ["Conflictos entre motivadores", "Falta de variedad", "Ambientes monótonos"],
      idealEnvironment: "Entornos diversos que permitan expresar múltiples facetas motivacionales.",
      workPreferences: "Roles variados que ofrezcan diferentes tipos de satisfacción y desafíos.",
      avoidanceAreas: ["Roles muy especializados", "Ambientes inflexibles"],
      developmentTips: ["Identificar prioridades motivacionales", "Buscar equilibrio entre diferentes necesidades"],
      careerAlignment: ["Gestión general", "Consultoría", "Roles híbridos", "Liderazgo multifuncional"]
    }
  };
}
