import { PageTemplate } from "@/components/portal/page-template";

export default function TechnicalQuestionsPage() {
  return (
    <PageTemplate
      description="Banco de preguntas tecnicas por cargo, categoria y dificultad."
      highlights={[
        "Listado inicial de preguntas por pagina",
        "Filtros por cargo y dificultad",
        "Flujo para crear/editar preguntas",
      ]}
      nextMilestones={[
        "Modelar tablas tecnicas y semilla de cargos.",
        "Habilitar CRUD real de preguntas.",
        "Conectar con el envio de evaluaciones tecnicas.",
      ]}
      phase="Etapa 1"
      title="Banco tecnico"
    />
  );
}

