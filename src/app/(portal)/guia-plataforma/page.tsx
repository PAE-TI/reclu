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
      details={[
        "Expandir contenido con capturas y flujos reales.",
        "Sincronizar guia con el tour in-app.",
      ]}
      badge="Guia Completa de MotivaIQ"
      title="Guia de plataforma"
    />
  );
}
