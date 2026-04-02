import { PageTemplate } from "@/components/portal/page-template";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const mode = params.mode ?? "overview";
  const modeTitle =
    mode === "compare" ? "Comparar candidatos" : mode === "individual" ? "Analisis individual" : "Vista general";

  return (
    <PageTemplate
      description="Modulo de inteligencia de talento con modos general, individual y comparativo."
      highlights={[
        `Modo activo: ${modeTitle}`,
        "Estructura de indicadores del equipo",
        "Base para perfil 360 por persona",
        "Base para matriz de compatibilidad",
      ]}
      nextMilestones={[
        "Conectar resultados reales por modulo.",
        "Implementar comparador de 2 a 4 personas.",
        "Agregar graficas de distribucion y tendencias.",
      ]}
      phase="Etapa 1"
      title="Analisis avanzado"
    />
  );
}

