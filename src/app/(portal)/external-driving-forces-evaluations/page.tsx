import { PageTemplate } from "@/components/portal/page-template";

export default function DrivingForcesPage() {
  return (
    <PageTemplate
      description="Envio y gestion de evaluaciones de fuerzas motivadoras."
      highlights={[
        "Invitaciones por correo para motivadores",
        "Trazabilidad del estado por candidato",
        "Base para resultados en analytics 360",
      ]}
      details={[
        "Motor de envio por modulo con expiracion de enlace.",
        "Normalizar respuestas y scoring interno.",
      ]}
      badge="Fuerzas Motivadoras"
      title="Fuerzas motivadoras"
    />
  );
}
