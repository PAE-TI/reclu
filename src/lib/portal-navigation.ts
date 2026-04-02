export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Panel de control", href: "/dashboard" },
  { label: "Analisis avanzado", href: "/analytics" },
  { label: "Campanas de seleccion", href: "/campaigns" },
  { label: "Mi equipo", href: "/team" },
  { label: "Administracion", href: "/admin" },
];

export const moduleNav: NavItem[] = [
  { label: "DISC", href: "/external-evaluations" },
  {
    label: "Fuerzas motivadoras",
    href: "/external-driving-forces-evaluations",
  },
  { label: "Inteligencia emocional", href: "/external-eq-evaluations" },
  { label: "Competencias DNA-25", href: "/external-dna-evaluations" },
  { label: "Acumen (ACI)", href: "/external-acumen-evaluations" },
  { label: "Valores e integridad", href: "/external-values-evaluations" },
  { label: "Estres y resiliencia", href: "/external-stress-evaluations" },
  { label: "Envio masivo", href: "/batch-evaluations" },
  { label: "Pruebas tecnicas", href: "/external-technical-evaluations" },
];

export const supportNav: NavItem[] = [
  { label: "Guia de evaluaciones", href: "/evaluations-guide" },
  { label: "Guia de plataforma", href: "/guia-plataforma" },
  { label: "Perfil empresarial", href: "/profile" },
  { label: "Configuracion", href: "/settings" },
];

