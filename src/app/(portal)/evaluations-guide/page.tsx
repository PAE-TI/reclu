import { PageTemplate } from "@/components/portal/page-template";

export default function EvaluationsGuidePage() {
  return (
    <PageTemplate
      description="Guia funcional de los ocho modulos de evaluacion de Reclu."
      highlights={[
        "Fichas base por modulo psicometrico",
        "Duraciones y alcance por evaluacion",
        "Conexion esperada con analisis 360",
      ]}
      nextMilestones={[
        "Agregar contenido completo por modulo.",
        "Incluir ejemplos de interpretacion de resultados.",
      ]}
      phase="Etapa 1"
      title="Guia de evaluaciones"
    />
  );
}

