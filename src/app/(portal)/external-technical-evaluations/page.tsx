import { PageTemplate } from "@/components/portal/page-template";

export default function TechnicalEvaluationsPage() {
  return (
    <PageTemplate
      description="Envio de pruebas tecnicas por cargo usando biblioteca especializada de preguntas."
      highlights={[
        "Seleccion de cargo tecnico",
        "Estructura para categorias y subcategorias",
        "Historial de tecnicas enviadas y estados",
      ]}
      nextMilestones={[
        "Conectar catalogo de cargos desde DB.",
        "Generar pruebas segun dificultad y perfil.",
        "Persistir resultados tecnicos por intento.",
      ]}
      phase="Etapa 1"
      title="Pruebas tecnicas"
    />
  );
}

