import { PageTemplate } from "@/components/portal/page-template";

export default function EqPage() {
  return (
    <PageTemplate
      description="Envio y gestion de evaluaciones de inteligencia emocional."
      highlights={[
        "Formulario de invitacion EQ",
        "Historial y estados de respuesta",
        "Base para integracion con analisis individual",
      ]}
      nextMilestones={[
        "Scoring real por dimension emocional.",
        "Reporte de competencias emocionales.",
      ]}
      phase="Etapa 1"
      title="Inteligencia emocional"
    />
  );
}

