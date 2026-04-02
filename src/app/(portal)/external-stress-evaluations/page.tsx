import { ExternalModulePage } from "@/components/portal/external-module-page";

export default function StressPage() {
  return (
    <ExternalModulePage
      completed={1}
      expired={14}
      manageCount={15}
      pending={0}
      sent={15}
      subtitle="Envia evaluaciones de Estres y Resiliencia por correo electronico."
      title="Evaluaciones de Estres y Resiliencia"
    />
  );
}

