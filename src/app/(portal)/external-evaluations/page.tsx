import { ExternalModulePage } from "@/components/portal/external-module-page";

export default function DiscEvaluationsPage() {
  return (
    <ExternalModulePage
      completed={8}
      expired={9}
      manageCount={17}
      pending={0}
      sent={17}
      subtitle="Envia evaluaciones DISC por correo electronico a candidatos y colaboradores."
      title="Evaluaciones DISC Externas"
    />
  );
}

