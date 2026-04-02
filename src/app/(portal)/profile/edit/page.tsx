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
      details={[
        "Conectar guardado en DB.",
        "Agregar feedback de cambios exitosos.",
      ]}
      badge="Editar Perfil"
      title="Editar perfil"
    />
  );
}
