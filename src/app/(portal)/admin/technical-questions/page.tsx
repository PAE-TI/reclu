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
      details={[
        "Modelar tablas tecnicas y semilla de cargos.",
        "Habilitar CRUD real de preguntas.",
        "Conectar con el envio de evaluaciones tecnicas.",
      ]}
      badge="Banco de Preguntas Tecnicas"
      title="Banco tecnico"
    />
  );
}
