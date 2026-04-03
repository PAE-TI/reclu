import { Metadata } from 'next';
import EvaluacionesClient from '@/components/evaluaciones-client';

export const metadata: Metadata = {
  title: 'Evaluaciones de Talento | MotivaIQ - DISC, EQ, DNA-25, Acumen, Valores',
  description: 'Descubre las 8 evaluaciones científicas de MotivaIQ: DISC, Fuerzas Motivadoras, Inteligencia Emocional, DNA-25, Acumen, Valores y Estrés. Análisis completo del talento humano.',
  keywords: 'evaluaciones talento, DISC, inteligencia emocional, EQ, DNA-25, competencias, acumen, valores, estrés laboral, evaluación psicométrica, recursos humanos',
  openGraph: {
    title: 'Evaluaciones de Talento | MotivaIQ',
    description: 'Las 8 evaluaciones científicas más completas para entender el comportamiento, motivaciones, emociones, competencias y valores de tu equipo.',
    type: 'website',
  },
};

export default function EvaluacionesPage() {
  return <EvaluacionesClient />;
}
