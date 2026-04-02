import { PageTemplate } from "@/components/portal/page-template";

export default function TeamPage() {
  return (
    <PageTemplate
      description="Gestion de facilitadores del equipo y niveles de acceso sobre evaluaciones."
      highlights={[
        "Listado de miembros activos y pendientes",
        "Invitacion de facilitadores",
        "Niveles: acceso completo o solo sus evaluaciones",
      ]}
      nextMilestones={[
        "Invitaciones reales por correo con token seguro.",
        "Asignacion persistente de roles y permisos.",
        "Metrica real de evaluaciones por usuario.",
      ]}
      phase="Etapa 1"
      title="Mi equipo"
    />
  );
}

