import { ExternalModulePage } from "@/components/portal/external-module-page";

export default function ValuesPage() {
  return (
    <ExternalModulePage
      completed={1}
      expired={14}
      manageCount={15}
      pending={0}
      sent={15}
      subtitle="Envia evaluaciones de Valores e Integridad por correo electronico."
      title="Evaluaciones de Valores e Integridad"
    />
  );
}

