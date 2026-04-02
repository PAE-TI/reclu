import { PageTemplate } from "@/components/portal/page-template";

export default function NewCampaignPage() {
  return (
    <PageTemplate
      description="Formulario base para crear una campana, seleccionar cargo, definir visibilidad y modulos."
      highlights={[
        "Campos base de campana y cargo",
        "Control de visibilidad publica/privada",
        "Seleccion de modulos con costo en creditos",
        "CTA para crear campana",
      ]}
      nextMilestones={[
        "Conectar catalogo real de cargos tecnicos.",
        "Guardar campana en DB y redirigir al detalle.",
        "Activar calculo dinamico de creditos por modulo.",
      ]}
      phase="Etapa 1"
      title="Nueva campana de seleccion"
    />
  );
}

