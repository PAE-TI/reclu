import { PageTemplate } from "@/components/portal/page-template";

export default function ValuesPage() {
  return (
    <PageTemplate
      description="Envio y administracion de evaluaciones de valores e integridad."
      highlights={[
        "Flujo de evaluacion etica por candidato",
        "Base para medicion de fit cultural",
        "Seguimiento de historial y evidencias",
      ]}
      nextMilestones={[
        "Definir escala de consistencia etica.",
        "Integrar resultados en score de compatibilidad.",
      ]}
      phase="Etapa 1"
      title="Valores e integridad"
    />
  );
}

