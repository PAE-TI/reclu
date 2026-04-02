import { PageTemplate } from "@/components/portal/page-template";

export default function DnaPage() {
  return (
    <PageTemplate
      description="Envio y gestion de evaluaciones DNA-25 de competencias profesionales."
      highlights={[
        "Flujo de envio por correo",
        "Seguimiento de completitud por candidato",
        "Base para perfil de competencias 360",
      ]}
      details={[
        "Modelo de competencias por categoria.",
        "Calculo de gaps contra perfil ideal de cargo.",
      ]}
      badge="DNA-25"
      title="Competencias DNA-25"
    />
  );
}
