import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicHeader from '@/components/public-header';
import EvaluationDetailClient from '@/components/evaluation-detail-client';

// SEO metadata for each evaluation
const metaData: Record<string, { title: string; description: string }> = {
  'disc': {
    title: 'Evaluación DISC - Análisis de Comportamiento | MotivaIQ',
    description: 'Descubre tu estilo de comportamiento con la evaluación DISC de MotivaIQ. Mide Dominancia, Influencia, Estabilidad y Cumplimiento. Mejora comunicación y liderazgo.'
  },
  'fuerzas-motivadoras': {
    title: 'Fuerzas Motivadoras - Qué Te Impulsa | MotivaIQ',
    description: 'Descubre tus 12 fuerzas motivadoras internas con MotivaIQ. Entiende por qué actúas como actúas y alinea tu carrera con tus pasiones naturales.'
  },
  'inteligencia-emocional': {
    title: 'Inteligencia Emocional (EQ) - Evaluación Completa | MotivaIQ',
    description: 'Evalúa tu Inteligencia Emocional con MotivaIQ. Mide autoconciencia, autorregulación, motivación, empatía y habilidades sociales.'
  },
  'dna-25': {
    title: 'DNA-25 - Evaluación de 25 Competencias | MotivaIQ',
    description: 'Evalúa 25 competencias profesionales clave con DNA-25 de MotivaIQ. Identifica fortalezas, brechas y oportunidades de desarrollo.'
  },
  'acumen': {
    title: 'Acumen ACI - Índice de Capacidad de Juicio | MotivaIQ',
    description: 'Evalúa tu claridad de pensamiento con el Índice de Capacidad Acumen de MotivaIQ. Identifica sesgos y mejora tu toma de decisiones.'
  },
  'valores-integridad': {
    title: 'Valores e Integridad - Evaluación de Valores | MotivaIQ',
    description: 'Descubre tus valores fundamentales con MotivaIQ. Evalúa 6 dimensiones de valores y la consistencia entre lo que valoras y cómo actúas.'
  },
  'estres-resiliencia': {
    title: 'Estrés y Resiliencia - Evaluación de Bienestar | MotivaIQ',
    description: 'Evalúa tus niveles de estrés y resiliencia con MotivaIQ. Identifica factores de riesgo y protectores. Previene el burnout en tu equipo.'
  },
  'pruebas-tecnicas': {
    title: 'Pruebas Técnicas - Evaluación por Cargo | MotivaIQ',
    description: 'Evalúa conocimientos técnicos específicos para +225 cargos con MotivaIQ. 13,700+ preguntas clasificadas por dificultad. Encuentra al candidato ideal.'
  }
};

const validSlugs = Object.keys(metaData);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = metaData[slug];
  
  if (!meta) {
    return {
      title: 'Evaluación no encontrada | MotivaIQ',
    };
  }
  
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export default async function EvaluacionPage({ params }: PageProps) {
  const { slug } = await params;
  
  if (!validSlugs.includes(slug)) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <EvaluationDetailClient slug={slug} />
    </div>
  );
}
