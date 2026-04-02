import { PageTemplate } from "@/components/portal/page-template";

export default function ProfileEditPage() {
  return (
    <PageTemplate
      description="Edicion de datos personales y datos de la empresa."
      highlights={[
        "Campos base de nombre, apellido y cargo",
        "Base para validaciones de perfil",
        "Botones de guardar y cancelar",
      ]}
      nextMilestones={[
        "Conectar guardado en DB.",
        "Agregar feedback de cambios exitosos.",
      ]}
      phase="Etapa 1"
      title="Editar perfil"
    />
  );
}

