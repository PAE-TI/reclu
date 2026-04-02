import { PageTemplate } from "@/components/portal/page-template";

export default function StressPage() {
  return (
    <PageTemplate
      description="Modulo de estres y resiliencia para identificar riesgo de burnout y bienestar."
      highlights={[
        "Invitacion de evaluacion por correo",
        "Estados y control de enlaces",
        "Base para recomendaciones de bienestar",
      ]}
      details={[
        "Implementar scoring de estres y resiliencia.",
        "Agregar alertas para niveles criticos.",
      ]}
      badge="Estres y Resiliencia"
      title="Estres y resiliencia"
    />
  );
}
