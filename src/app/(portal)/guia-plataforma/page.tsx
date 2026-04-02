import { PageTemplate } from "@/components/portal/page-template";

export default function PlatformGuidePage() {
  return (
    <PageTemplate
      description="Guia paso a paso de uso de plataforma para headhunters y equipo interno."
      highlights={[
        "Ruta recomendada desde envio hasta analisis",
        "Bloques de ayuda operativa",
        "Base para onboarding guiado",
      ]}
      nextMilestones={[
        "Expandir contenido con capturas y flujos reales.",
        "Sincronizar guia con el tour in-app.",
      ]}
      phase="Etapa 1"
      title="Guia de plataforma"
    />
  );
}

