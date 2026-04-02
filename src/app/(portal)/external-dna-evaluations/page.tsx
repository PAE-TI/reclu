import { ExternalModulePage } from "@/components/portal/external-module-page";

export default function DnaPage() {
  return (
    <ExternalModulePage
      completed={2}
      expired={14}
      manageCount={16}
      pending={0}
      sent={16}
      subtitle="Envia evaluaciones DNA-25 por correo electronico a candidatos y colaboradores."
      title="Evaluaciones DNA-25 Externas"
    />
  );
}

