import { ExternalModulePage } from "@/components/portal/external-module-page";

export default function AcumenPage() {
  return (
    <ExternalModulePage
      completed={1}
      expired={13}
      manageCount={14}
      pending={0}
      sent={14}
      subtitle="Envia evaluaciones de Capacidad Acumen por correo electronico."
      title="Evaluaciones Acumen (ACI) Externas"
    />
  );
}

