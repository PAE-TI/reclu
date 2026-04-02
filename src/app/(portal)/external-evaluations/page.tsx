import { PageTemplate } from "@/components/portal/page-template";

export default function DiscEvaluationsPage() {
  return (
    <PageTemplate
      description="Envio de evaluaciones DISC externas y gestion del historial."
      highlights={[
        "Formulario de envio por nombre y correo",
        "Conteo de enviadas/completadas/pendientes/expiradas",
        "Acciones: ver resultado, PDF, notas, eliminar",
      ]}
      nextMilestones={[
        "Conectar plantilla de correo real.",
        "Persistir estado de invitaciones DISC.",
        "Generar reporte PDF de resultado.",
      ]}
      phase="Etapa 1"
      title="Evaluaciones DISC externas"
    />
  );
}

