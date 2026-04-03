
import { notFound } from 'next/navigation';
import ExternalEvaluationClient from '@/components/external-evaluation-client';

interface ExternalEvaluationPageProps {
  params: {
    token: string;
  };
}

export default async function ExternalEvaluationPage({ params }: ExternalEvaluationPageProps) {
  const { token } = params;

  // Validar que el token tenga un formato básico válido
  if (!token || token.length < 10) {
    notFound();
  }

  return <ExternalEvaluationClient token={token} />;
}
