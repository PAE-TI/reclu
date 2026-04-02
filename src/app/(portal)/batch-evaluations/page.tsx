import { PageTemplate } from "@/components/portal/page-template";

export default function BatchEvaluationsPage() {
  return (
    <PageTemplate
      description="Envio masivo de multiples modulos en un solo flujo para un candidato."
      highlights={[
        "Seleccion multiple de evaluaciones",
        "Calculo de creditos y tiempo estimado",
        "Opcion de un correo o correo por evaluacion",
      ]}
      nextMilestones={[
        "Persistir lotes de envio por candidato.",
        "Aplicar validaciones de creditos disponibles.",
        "Integrar notificaciones de completitud por modulo.",
      ]}
      phase="Etapa 1"
      title="Envio masivo"
    />
  );
}

