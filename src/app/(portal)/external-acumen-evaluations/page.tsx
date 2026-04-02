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
      details={[
        "Implementar parser de resultados ACI.",
        "Conectar graficas de claridad y sesgos.",
      ]}
      badge="Acumen (ACI)"
      title="Acumen (ACI)"
    />
  );
}
