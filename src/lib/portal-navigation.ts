export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Panel de Control", href: "/dashboard" },
  { label: "Analisis Avanzado", href: "/analytics" },
  { label: "Campanas de Seleccion", href: "/campaigns" },
  { label: "Mi equipo", href: "/team" },
  { label: "Administracion", href: "/admin" },
];

export const moduleNav: NavItem[] = [
  { label: "DISC", href: "/external-evaluations" },
  {
    label: "Fuerzas Motivadoras",
    href: "/external-driving-forces-evaluations",
  },
  { label: "Inteligencia Emocional", href: "/external-eq-evaluations" },
  { label: "Competencias (DNA-25)", href: "/external-dna-evaluations" },
  { label: "Acumen (ACI)", href: "/external-acumen-evaluations" },
  { label: "Valores e Integridad", href: "/external-values-evaluations" },
  { label: "Estres y Resiliencia", href: "/external-stress-evaluations" },
  { label: "Envio Masivo", href: "/batch-evaluations" },
  { label: "Pruebas Tecnicas", href: "/external-technical-evaluations" },
];

export const supportNav: NavItem[] = [
  { label: "Guia de Evaluaciones", href: "/evaluations-guide" },
  { label: "Guia de Plataforma", href: "/guia-plataforma" },
  { label: "Perfil empresarial", href: "/profile" },
  { label: "Configuracion", href: "/settings" },
];
