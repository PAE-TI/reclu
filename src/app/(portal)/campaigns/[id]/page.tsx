import { PageTemplate } from "@/components/portal/page-template";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PageTemplate
      description={`Detalle inicial de campana (${id}) con estructura de candidatos, score y progreso.`}
      highlights={[
        "Resumen de estado y progreso",
        "Top candidato y score",
        "Listado de candidatos evaluados",
        "Acciones: agregar candidatos y analizar",
      ]}
      nextMilestones={[
        "Cargar data real de campana por id.",
        "Sincronizar estado de evaluaciones por candidato.",
        "Conectar boton analizar con ranking real.",
      ]}
      phase="Etapa 1"
      title="Detalle de campana"
    />
  );
}

