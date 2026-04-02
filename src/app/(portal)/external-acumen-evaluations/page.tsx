import { PageTemplate } from "@/components/portal/page-template";

export default function AcumenPage() {
  return (
    <PageTemplate
      description="Envio y seguimiento de evaluaciones Acumen (ACI)."
      highlights={[
        "Invitaciones externas de Acumen",
        "Base para analisis de juicio interno/externo",
        "Integracion planificada con ranking",
      ]}
      nextMilestones={[
        "Implementar parser de resultados ACI.",
        "Conectar graficas de claridad y sesgos.",
      ]}
      phase="Etapa 1"
      title="Acumen (ACI)"
    />
  );
}

