// Lista extensa de cargos con sinónimos, categorías y perfiles ideales
// Para el buscador de Campañas de Selección

export interface JobPosition {
  id: string;
  title: string;
  titleEn?: string;
  category: JobCategory;
  subcategory: string;
  synonyms: string[];
  keywords: string[];
  // Perfil ideal basado en evaluaciones (pesos de 0-100)
  idealProfile: {
    disc?: { D: number; I: number; S: number; C: number };
    drivingForces?: { [key: string]: number };
    eqFocus?: string[];
    dnaCompetencies?: string[];
  };
}

export type JobCategory = 
  | 'DIRECCION_EJECUTIVA'
  | 'ADMINISTRACION_FINANZAS'
  | 'RECURSOS_HUMANOS'
  | 'VENTAS_COMERCIAL'
  | 'MARKETING_COMUNICACION'
  | 'TECNOLOGIA_IT'
  | 'OPERACIONES_PRODUCCION'
  | 'LOGISTICA_CADENA'
  | 'LEGAL_CUMPLIMIENTO'
  | 'SALUD_MEDICINA'
  | 'EDUCACION_FORMACION'
  | 'INGENIERIA'
  | 'ATENCION_CLIENTE'
  | 'CREATIVOS_DISENO'
  | 'INVESTIGACION_DESARROLLO'
  | 'CALIDAD_PROCESOS'
  | 'SEGURIDAD'
  | 'CONSTRUCCION_INMOBILIARIA'
  | 'AGRICULTURA_AGROINDUSTRIA'
  | 'TURISMO_HOTELERIA';

export const JOB_CATEGORIES: Record<JobCategory, { name: string; icon: string }> = {
  DIRECCION_EJECUTIVA: { name: 'Dirección Ejecutiva', icon: 'Crown' },
  ADMINISTRACION_FINANZAS: { name: 'Administración y Finanzas', icon: 'Calculator' },
  RECURSOS_HUMANOS: { name: 'Recursos Humanos', icon: 'Users' },
  VENTAS_COMERCIAL: { name: 'Ventas y Comercial', icon: 'TrendingUp' },
  MARKETING_COMUNICACION: { name: 'Marketing y Comunicación', icon: 'Megaphone' },
  TECNOLOGIA_IT: { name: 'Tecnología e IT', icon: 'Code' },
  OPERACIONES_PRODUCCION: { name: 'Operaciones y Producción', icon: 'Factory' },
  LOGISTICA_CADENA: { name: 'Logística y Cadena de Suministro', icon: 'Truck' },
  LEGAL_CUMPLIMIENTO: { name: 'Legal y Cumplimiento', icon: 'Scale' },
  SALUD_MEDICINA: { name: 'Salud y Medicina', icon: 'Heart' },
  EDUCACION_FORMACION: { name: 'Educación y Formación', icon: 'GraduationCap' },
  INGENIERIA: { name: 'Ingeniería', icon: 'Wrench' },
  ATENCION_CLIENTE: { name: 'Atención al Cliente', icon: 'Headphones' },
  CREATIVOS_DISENO: { name: 'Creativos y Diseño', icon: 'Palette' },
  INVESTIGACION_DESARROLLO: { name: 'Investigación y Desarrollo', icon: 'FlaskConical' },
  CALIDAD_PROCESOS: { name: 'Calidad y Procesos', icon: 'CheckCircle' },
  SEGURIDAD: { name: 'Seguridad', icon: 'Shield' },
  CONSTRUCCION_INMOBILIARIA: { name: 'Construcción e Inmobiliaria', icon: 'Building' },
  AGRICULTURA_AGROINDUSTRIA: { name: 'Agricultura y Agroindustria', icon: 'Leaf' },
  TURISMO_HOTELERIA: { name: 'Turismo y Hotelería', icon: 'Hotel' },
};

export const JOB_POSITIONS: JobPosition[] = [
  // ============================================
  // DIRECCIÓN EJECUTIVA
  // ============================================
  {
    id: 'ceo',
    title: 'Director General / CEO',
    titleEn: 'Chief Executive Officer',
    category: 'DIRECCION_EJECUTIVA',
    subcategory: 'Alta Dirección',
    synonyms: ['CEO', 'Gerente General', 'Director Ejecutivo', 'Presidente Ejecutivo', 'Chief Executive Officer', 'Máximo Ejecutivo', 'Director Gerente'],
    keywords: ['liderazgo', 'estrategia', 'dirección', 'ejecutivo', 'gestión', 'empresa'],
    idealProfile: {
      disc: { D: 85, I: 70, S: 40, C: 55 },
      drivingForces: { dominante: 80, intelectual: 70, practico: 85 },
      eqFocus: ['liderazgo', 'influencia', 'vision estrategica'],
      dnaCompetencies: ['STRATEGIC_THINKING', 'LEADERSHIP', 'DECISION_MAKING'],
    },
  },
  {
    id: 'coo',
    title: 'Director de Operaciones / COO',
    titleEn: 'Chief Operating Officer',
    category: 'DIRECCION_EJECUTIVA',
    subcategory: 'Alta Dirección',
    synonyms: ['COO', 'Gerente de Operaciones', 'Director Operativo', 'VP Operaciones', 'Chief Operating Officer'],
    keywords: ['operaciones', 'eficiencia', 'procesos', 'ejecución', 'gestión operativa'],
    idealProfile: {
      disc: { D: 75, I: 50, S: 55, C: 80 },
      drivingForces: { practico: 90, estructurado: 75, dominante: 65 },
      eqFocus: ['gestión de equipos', 'resolución de problemas'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'RESULTS_ORIENTATION', 'LEADERSHIP'],
    },
  },
  {
    id: 'cfo',
    title: 'Director Financiero / CFO',
    titleEn: 'Chief Financial Officer',
    category: 'DIRECCION_EJECUTIVA',
    subcategory: 'Alta Dirección',
    synonyms: ['CFO', 'Gerente Financiero', 'Director de Finanzas', 'VP Finanzas', 'Chief Financial Officer', 'Tesorero Corporativo'],
    keywords: ['finanzas', 'contabilidad', 'inversiones', 'presupuesto', 'análisis financiero'],
    idealProfile: {
      disc: { D: 60, I: 40, S: 50, C: 95 },
      drivingForces: { practico: 95, intelectual: 80, estructurado: 85 },
      eqFocus: ['análisis', 'toma de decisiones', 'control'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'STRATEGIC_THINKING'],
    },
  },
  {
    id: 'cto',
    title: 'Director de Tecnología / CTO',
    titleEn: 'Chief Technology Officer',
    category: 'DIRECCION_EJECUTIVA',
    subcategory: 'Alta Dirección',
    synonyms: ['CTO', 'Gerente de Tecnología', 'Director IT', 'VP Tecnología', 'Chief Technology Officer', 'Director de Sistemas'],
    keywords: ['tecnología', 'innovación', 'sistemas', 'digital', 'infraestructura'],
    idealProfile: {
      disc: { D: 70, I: 55, S: 45, C: 90 },
      drivingForces: { intelectual: 95, practico: 75, receptivo: 80 },
      eqFocus: ['innovación', 'liderazgo técnico'],
      dnaCompetencies: ['STRATEGIC_THINKING', 'CREATIVITY', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'cmo',
    title: 'Director de Marketing / CMO',
    titleEn: 'Chief Marketing Officer',
    category: 'DIRECCION_EJECUTIVA',
    subcategory: 'Alta Dirección',
    synonyms: ['CMO', 'Gerente de Marketing', 'Director Comercial', 'VP Marketing', 'Chief Marketing Officer'],
    keywords: ['marketing', 'marca', 'publicidad', 'comunicación', 'mercadeo'],
    idealProfile: {
      disc: { D: 65, I: 90, S: 45, C: 60 },
      drivingForces: { receptivo: 85, intelectual: 70, dominante: 65 },
      eqFocus: ['creatividad', 'comunicación', 'influencia'],
      dnaCompetencies: ['CREATIVITY', 'INFLUENCE', 'STRATEGIC_THINKING'],
    },
  },
  {
    id: 'chro',
    title: 'Director de Recursos Humanos / CHRO',
    titleEn: 'Chief Human Resources Officer',
    category: 'DIRECCION_EJECUTIVA',
    subcategory: 'Alta Dirección',
    synonyms: ['CHRO', 'Gerente de RRHH', 'Director de Personal', 'VP Recursos Humanos', 'Chief People Officer', 'CPO', 'Director de Talento'],
    keywords: ['recursos humanos', 'talento', 'cultura', 'personas', 'desarrollo organizacional'],
    idealProfile: {
      disc: { D: 55, I: 80, S: 70, C: 65 },
      drivingForces: { altruista: 85, benevolo: 80, armonioso: 75 },
      eqFocus: ['empatía', 'desarrollo de personas', 'liderazgo'],
      dnaCompetencies: ['DEVELOPING_OTHERS', 'CONFLICT_MANAGEMENT', 'RELATIONSHIP_BUILDING'],
    },
  },
  {
    id: 'managing_director',
    title: 'Director General Adjunto',
    titleEn: 'Managing Director',
    category: 'DIRECCION_EJECUTIVA',
    subcategory: 'Alta Dirección',
    synonyms: ['Subdirector General', 'Director Adjunto', 'Managing Director', 'Deputy CEO'],
    keywords: ['dirección', 'gestión', 'liderazgo', 'estrategia'],
    idealProfile: {
      disc: { D: 75, I: 65, S: 50, C: 70 },
      drivingForces: { dominante: 75, practico: 80, intelectual: 65 },
      eqFocus: ['liderazgo', 'toma de decisiones'],
      dnaCompetencies: ['LEADERSHIP', 'STRATEGIC_THINKING', 'DECISION_MAKING'],
    },
  },
  {
    id: 'country_manager',
    title: 'Gerente de País',
    titleEn: 'Country Manager',
    category: 'DIRECCION_EJECUTIVA',
    subcategory: 'Gerencia Regional',
    synonyms: ['Country Manager', 'Director País', 'Gerente Nacional', 'Director Regional'],
    keywords: ['gestión país', 'liderazgo regional', 'estrategia local'],
    idealProfile: {
      disc: { D: 80, I: 70, S: 45, C: 65 },
      drivingForces: { dominante: 80, practico: 85, intelectual: 65 },
      eqFocus: ['liderazgo', 'adaptabilidad cultural'],
      dnaCompetencies: ['LEADERSHIP', 'BUSINESS_ACUMEN', 'RELATIONSHIP_BUILDING'],
    },
  },
  {
    id: 'regional_director',
    title: 'Director Regional',
    titleEn: 'Regional Director',
    category: 'DIRECCION_EJECUTIVA',
    subcategory: 'Gerencia Regional',
    synonyms: ['Gerente Regional', 'Director de Zona', 'Director de Área'],
    keywords: ['región', 'zona', 'área', 'territorial'],
    idealProfile: {
      disc: { D: 75, I: 65, S: 50, C: 70 },
      drivingForces: { dominante: 70, practico: 80, colaborativo: 60 },
      eqFocus: ['liderazgo', 'gestión de equipos'],
      dnaCompetencies: ['LEADERSHIP', 'RESULTS_ORIENTATION', 'TEAMWORK'],
    },
  },
  {
    id: 'branch_manager',
    title: 'Gerente de Sucursal',
    titleEn: 'Branch Manager',
    category: 'DIRECCION_EJECUTIVA',
    subcategory: 'Gerencia de Unidad',
    synonyms: ['Director de Sucursal', 'Administrador de Sucursal', 'Jefe de Oficina', 'Encargado de Sucursal'],
    keywords: ['sucursal', 'oficina', 'punto de venta', 'local'],
    idealProfile: {
      disc: { D: 65, I: 70, S: 60, C: 65 },
      drivingForces: { practico: 80, colaborativo: 70, dominante: 55 },
      eqFocus: ['servicio', 'liderazgo operativo'],
      dnaCompetencies: ['LEADERSHIP', 'CUSTOMER_SERVICE', 'RESULTS_ORIENTATION'],
    },
  },

  // ============================================
  // ADMINISTRACIÓN Y FINANZAS
  // ============================================
  {
    id: 'controller',
    title: 'Controller Financiero',
    titleEn: 'Financial Controller',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Control Financiero',
    synonyms: ['Contralor', 'Controller', 'Controlador Financiero', 'Gerente de Control'],
    keywords: ['control', 'finanzas', 'contabilidad', 'presupuesto', 'auditoría'],
    idealProfile: {
      disc: { D: 55, I: 35, S: 55, C: 95 },
      drivingForces: { practico: 90, estructurado: 90, intelectual: 75 },
      eqFocus: ['precisión', 'análisis'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING', 'ACCOUNTABILITY'],
    },
  },
  {
    id: 'accountant',
    title: 'Contador',
    titleEn: 'Accountant',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Contabilidad',
    synonyms: ['Contador Público', 'Contador General', 'Contable', 'Contador Fiscal', 'Contador Senior', 'Contador Junior'],
    keywords: ['contabilidad', 'impuestos', 'fiscal', 'estados financieros', 'balance'],
    idealProfile: {
      disc: { D: 40, I: 30, S: 70, C: 95 },
      drivingForces: { practico: 85, estructurado: 90, intelectual: 70 },
      eqFocus: ['precisión', 'organización'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING', 'PLANNING_ORGANIZATION'],
    },
  },
  {
    id: 'accounts_payable',
    title: 'Analista de Cuentas por Pagar',
    titleEn: 'Accounts Payable Analyst',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Contabilidad',
    synonyms: ['Encargado de Pagos', 'Auxiliar de Cuentas por Pagar', 'Tesorería Pagos'],
    keywords: ['pagos', 'proveedores', 'facturas', 'tesorería'],
    idealProfile: {
      disc: { D: 35, I: 35, S: 75, C: 90 },
      drivingForces: { practico: 85, estructurado: 85 },
      eqFocus: ['organización', 'precisión'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'PLANNING_ORGANIZATION', 'TIME_MANAGEMENT'],
    },
  },
  {
    id: 'accounts_receivable',
    title: 'Analista de Cuentas por Cobrar',
    titleEn: 'Accounts Receivable Analyst',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Contabilidad',
    synonyms: ['Encargado de Cobranza', 'Auxiliar de Cuentas por Cobrar', 'Gestor de Cobros'],
    keywords: ['cobranza', 'clientes', 'cartera', 'crédito'],
    idealProfile: {
      disc: { D: 50, I: 55, S: 60, C: 80 },
      drivingForces: { practico: 85, dominante: 55 },
      eqFocus: ['negociación', 'comunicación'],
      dnaCompetencies: ['NEGOTIATION', 'ATTENTION_TO_DETAIL', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'financial_analyst',
    title: 'Analista Financiero',
    titleEn: 'Financial Analyst',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Análisis Financiero',
    synonyms: ['Analista de Finanzas', 'Analista de Inversiones', 'Financial Analyst', 'Analista FP&A'],
    keywords: ['análisis', 'proyecciones', 'inversiones', 'modelos financieros', 'valoración'],
    idealProfile: {
      disc: { D: 50, I: 40, S: 50, C: 90 },
      drivingForces: { intelectual: 90, practico: 85 },
      eqFocus: ['análisis crítico', 'resolución de problemas'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'PROBLEM_SOLVING', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'treasurer',
    title: 'Tesorero',
    titleEn: 'Treasurer',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Tesorería',
    synonyms: ['Gerente de Tesorería', 'Director de Tesorería', 'Jefe de Tesorería'],
    keywords: ['tesorería', 'liquidez', 'flujo de caja', 'bancos', 'inversiones'],
    idealProfile: {
      disc: { D: 55, I: 45, S: 55, C: 90 },
      drivingForces: { practico: 90, estructurado: 85 },
      eqFocus: ['toma de decisiones', 'gestión de riesgos'],
      dnaCompetencies: ['DECISION_MAKING', 'ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'auditor_interno',
    title: 'Auditor Interno',
    titleEn: 'Internal Auditor',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Auditoría',
    synonyms: ['Auditor', 'Auditor Financiero', 'Auditor de Control Interno'],
    keywords: ['auditoría', 'control interno', 'riesgos', 'cumplimiento', 'procesos'],
    idealProfile: {
      disc: { D: 50, I: 40, S: 50, C: 95 },
      drivingForces: { intelectual: 85, estructurado: 90, practico: 80 },
      eqFocus: ['objetividad', 'análisis'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'ACCOUNTABILITY'],
    },
  },
  {
    id: 'admin_assistant',
    title: 'Asistente Administrativo',
    titleEn: 'Administrative Assistant',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Administración',
    synonyms: ['Auxiliar Administrativo', 'Secretaria Administrativa', 'Asistente de Oficina', 'Asistente Ejecutivo'],
    keywords: ['administrativo', 'oficina', 'soporte', 'documentos', 'agenda'],
    idealProfile: {
      disc: { D: 35, I: 55, S: 80, C: 75 },
      drivingForces: { colaborativo: 85, estructurado: 75, altruista: 70 },
      eqFocus: ['servicio', 'organización', 'comunicación'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'VERBAL_COMMUNICATION', 'TIME_MANAGEMENT'],
    },
  },
  {
    id: 'office_manager',
    title: 'Gerente de Oficina',
    titleEn: 'Office Manager',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Administración',
    synonyms: ['Administrador de Oficina', 'Coordinador de Oficina', 'Jefe de Administración'],
    keywords: ['oficina', 'administración', 'instalaciones', 'servicios generales'],
    idealProfile: {
      disc: { D: 55, I: 60, S: 70, C: 70 },
      drivingForces: { practico: 80, colaborativo: 75, estructurado: 70 },
      eqFocus: ['organización', 'coordinación'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'TEAMWORK', 'TIME_MANAGEMENT'],
    },
  },
  {
    id: 'payroll_specialist',
    title: 'Especialista en Nómina',
    titleEn: 'Payroll Specialist',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Nómina',
    synonyms: ['Analista de Nómina', 'Encargado de Nómina', 'Coordinador de Nómina', 'Auxiliar de Nómina'],
    keywords: ['nómina', 'sueldos', 'salarios', 'prestaciones', 'seguridad social'],
    idealProfile: {
      disc: { D: 40, I: 40, S: 70, C: 90 },
      drivingForces: { practico: 85, estructurado: 90 },
      eqFocus: ['precisión', 'confidencialidad'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'PLANNING_ORGANIZATION', 'ACCOUNTABILITY'],
    },
  },
  {
    id: 'purchasing_manager',
    title: 'Gerente de Compras',
    titleEn: 'Purchasing Manager',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Compras',
    synonyms: ['Director de Compras', 'Jefe de Adquisiciones', 'Gerente de Adquisiciones', 'Comprador Senior'],
    keywords: ['compras', 'adquisiciones', 'proveedores', 'negociación', 'abastecimiento'],
    idealProfile: {
      disc: { D: 70, I: 55, S: 50, C: 80 },
      drivingForces: { practico: 90, dominante: 65, intelectual: 60 },
      eqFocus: ['negociación', 'análisis de costos'],
      dnaCompetencies: ['NEGOTIATION', 'ANALYTICAL_THINKING', 'RELATIONSHIP_BUILDING'],
    },
  },
  {
    id: 'buyer',
    title: 'Comprador',
    titleEn: 'Buyer',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Compras',
    synonyms: ['Analista de Compras', 'Auxiliar de Compras', 'Comprador Junior'],
    keywords: ['compras', 'cotizaciones', 'proveedores', 'órdenes de compra'],
    idealProfile: {
      disc: { D: 55, I: 50, S: 55, C: 80 },
      drivingForces: { practico: 85, estructurado: 70 },
      eqFocus: ['negociación', 'análisis'],
      dnaCompetencies: ['NEGOTIATION', 'ATTENTION_TO_DETAIL', 'VERBAL_COMMUNICATION'],
    },
  },

  // ============================================
  // RECURSOS HUMANOS
  // ============================================
  {
    id: 'hr_manager',
    title: 'Gerente de Recursos Humanos',
    titleEn: 'HR Manager',
    category: 'RECURSOS_HUMANOS',
    subcategory: 'Gestión de RRHH',
    synonyms: ['Jefe de RRHH', 'Director de Personal', 'Gerente de Gestión Humana', 'HR Manager'],
    keywords: ['recursos humanos', 'personal', 'talento', 'gestión humana', 'people'],
    idealProfile: {
      disc: { D: 60, I: 75, S: 65, C: 60 },
      drivingForces: { altruista: 85, benevolo: 75, armonioso: 70 },
      eqFocus: ['empatía', 'desarrollo de personas', 'comunicación'],
      dnaCompetencies: ['DEVELOPING_OTHERS', 'CONFLICT_MANAGEMENT', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'recruiter',
    title: 'Reclutador',
    titleEn: 'Recruiter',
    category: 'RECURSOS_HUMANOS',
    subcategory: 'Selección',
    synonyms: ['Especialista en Selección', 'Analista de Reclutamiento', 'Headhunter', 'Talent Acquisition', 'Consultor de Selección'],
    keywords: ['reclutamiento', 'selección', 'talento', 'entrevistas', 'candidatos'],
    idealProfile: {
      disc: { D: 55, I: 85, S: 55, C: 55 },
      drivingForces: { altruista: 75, dominante: 60, intelectual: 65 },
      eqFocus: ['comunicación', 'evaluación de personas'],
      dnaCompetencies: ['VERBAL_COMMUNICATION', 'INFLUENCE', 'RELATIONSHIP_BUILDING'],
    },
  },
  {
    id: 'training_manager',
    title: 'Gerente de Capacitación',
    titleEn: 'Training Manager',
    category: 'RECURSOS_HUMANOS',
    subcategory: 'Desarrollo',
    synonyms: ['Jefe de Capacitación', 'Director de Formación', 'Gerente de Desarrollo', 'Learning Manager'],
    keywords: ['capacitación', 'formación', 'desarrollo', 'entrenamiento', 'learning'],
    idealProfile: {
      disc: { D: 55, I: 80, S: 60, C: 60 },
      drivingForces: { intelectual: 85, altruista: 80, benevolo: 75 },
      eqFocus: ['desarrollo de personas', 'comunicación'],
      dnaCompetencies: ['DEVELOPING_OTHERS', 'PRESENTATION_SKILLS', 'CREATIVITY'],
    },
  },
  {
    id: 'compensation_analyst',
    title: 'Analista de Compensaciones',
    titleEn: 'Compensation Analyst',
    category: 'RECURSOS_HUMANOS',
    subcategory: 'Compensación',
    synonyms: ['Especialista en Compensaciones', 'Analista de Beneficios', 'Compensation & Benefits'],
    keywords: ['compensaciones', 'beneficios', 'salarios', 'bonos', 'incentivos'],
    idealProfile: {
      disc: { D: 45, I: 45, S: 60, C: 90 },
      drivingForces: { practico: 85, intelectual: 75, estructurado: 80 },
      eqFocus: ['análisis', 'equidad'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'BUSINESS_ACUMEN'],
    },
  },
  {
    id: 'hr_business_partner',
    title: 'HR Business Partner',
    titleEn: 'HR Business Partner',
    category: 'RECURSOS_HUMANOS',
    subcategory: 'Gestión de RRHH',
    synonyms: ['HRBP', 'Socio de Negocio RRHH', 'Consultor Interno RRHH'],
    keywords: ['business partner', 'consultoría interna', 'alineación estratégica'],
    idealProfile: {
      disc: { D: 60, I: 70, S: 55, C: 65 },
      drivingForces: { altruista: 75, practico: 75, intelectual: 70 },
      eqFocus: ['consultoría', 'influencia', 'comunicación'],
      dnaCompetencies: ['INFLUENCE', 'BUSINESS_ACUMEN', 'CONFLICT_MANAGEMENT'],
    },
  },
  {
    id: 'organizational_development',
    title: 'Especialista en Desarrollo Organizacional',
    titleEn: 'Organizational Development Specialist',
    category: 'RECURSOS_HUMANOS',
    subcategory: 'Desarrollo',
    synonyms: ['Consultor DO', 'Analista de Desarrollo Organizacional', 'OD Specialist'],
    keywords: ['desarrollo organizacional', 'cultura', 'cambio organizacional', 'clima laboral'],
    idealProfile: {
      disc: { D: 55, I: 75, S: 60, C: 65 },
      drivingForces: { intelectual: 85, altruista: 80, receptivo: 75 },
      eqFocus: ['facilitación', 'cambio', 'análisis organizacional'],
      dnaCompetencies: ['CREATIVITY', 'INFLUENCE', 'DEVELOPING_OTHERS'],
    },
  },
  {
    id: 'labor_relations',
    title: 'Especialista en Relaciones Laborales',
    titleEn: 'Labor Relations Specialist',
    category: 'RECURSOS_HUMANOS',
    subcategory: 'Relaciones Laborales',
    synonyms: ['Gerente de Relaciones Laborales', 'Abogado Laboral', 'Jefe de Relaciones Industriales'],
    keywords: ['relaciones laborales', 'sindicatos', 'negociación colectiva', 'conflictos laborales'],
    idealProfile: {
      disc: { D: 65, I: 60, S: 55, C: 80 },
      drivingForces: { intelectual: 75, estructurado: 80, dominante: 60 },
      eqFocus: ['negociación', 'resolución de conflictos'],
      dnaCompetencies: ['NEGOTIATION', 'CONFLICT_MANAGEMENT', 'VERBAL_COMMUNICATION'],
    },
  },

  // ============================================
  // VENTAS Y COMERCIAL
  // ============================================
  {
    id: 'sales_director',
    title: 'Director de Ventas',
    titleEn: 'Sales Director',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Dirección Comercial',
    synonyms: ['Gerente de Ventas', 'Director Comercial', 'VP Ventas', 'Chief Sales Officer'],
    keywords: ['ventas', 'comercial', 'revenue', 'ingresos', 'metas'],
    idealProfile: {
      disc: { D: 90, I: 80, S: 35, C: 50 },
      drivingForces: { dominante: 90, practico: 85, intencional: 70 },
      eqFocus: ['liderazgo', 'motivación de equipos', 'resultados'],
      dnaCompetencies: ['LEADERSHIP', 'INFLUENCE', 'RESULTS_ORIENTATION'],
    },
  },
  {
    id: 'sales_manager',
    title: 'Gerente de Ventas',
    titleEn: 'Sales Manager',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Gestión Comercial',
    synonyms: ['Jefe de Ventas', 'Supervisor de Ventas', 'Coordinador de Ventas'],
    keywords: ['ventas', 'equipo comercial', 'cuotas', 'pipeline'],
    idealProfile: {
      disc: { D: 80, I: 75, S: 40, C: 55 },
      drivingForces: { dominante: 85, practico: 80, intencional: 65 },
      eqFocus: ['liderazgo', 'coaching', 'resultados'],
      dnaCompetencies: ['LEADERSHIP', 'DEVELOPING_OTHERS', 'RESULTS_ORIENTATION'],
    },
  },
  {
    id: 'sales_executive',
    title: 'Ejecutivo de Ventas',
    titleEn: 'Sales Executive',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Ventas Directas',
    synonyms: ['Vendedor', 'Asesor Comercial', 'Representante de Ventas', 'Sales Representative', 'Account Executive'],
    keywords: ['ventas', 'clientes', 'prospectos', 'cierre', 'negociación'],
    idealProfile: {
      disc: { D: 75, I: 85, S: 45, C: 50 },
      drivingForces: { dominante: 80, practico: 75, intencional: 65 },
      eqFocus: ['persuasión', 'comunicación', 'resiliencia'],
      dnaCompetencies: ['INFLUENCE', 'VERBAL_COMMUNICATION', 'NEGOTIATION'],
    },
  },
  {
    id: 'account_manager',
    title: 'Gerente de Cuentas',
    titleEn: 'Account Manager',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Gestión de Cuentas',
    synonyms: ['Key Account Manager', 'KAM', 'Ejecutivo de Cuentas', 'Gestor de Cuentas Clave'],
    keywords: ['cuentas clave', 'clientes estratégicos', 'retención', 'upselling'],
    idealProfile: {
      disc: { D: 65, I: 80, S: 60, C: 55 },
      drivingForces: { practico: 80, benevolo: 70, dominante: 60 },
      eqFocus: ['relaciones', 'servicio', 'negociación'],
      dnaCompetencies: ['RELATIONSHIP_BUILDING', 'CUSTOMER_SERVICE', 'NEGOTIATION'],
    },
  },
  {
    id: 'business_development',
    title: 'Gerente de Desarrollo de Negocios',
    titleEn: 'Business Development Manager',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Desarrollo de Negocios',
    synonyms: ['BDM', 'Director de Desarrollo de Negocios', 'Ejecutivo de Nuevos Negocios'],
    keywords: ['desarrollo de negocios', 'nuevos mercados', 'alianzas', 'oportunidades'],
    idealProfile: {
      disc: { D: 80, I: 75, S: 40, C: 55 },
      drivingForces: { dominante: 85, receptivo: 75, intelectual: 70 },
      eqFocus: ['networking', 'visión estratégica', 'iniciativa'],
      dnaCompetencies: ['STRATEGIC_THINKING', 'INFLUENCE', 'RELATIONSHIP_BUILDING'],
    },
  },
  {
    id: 'inside_sales',
    title: 'Ejecutivo de Ventas Internas',
    titleEn: 'Inside Sales Representative',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Ventas Internas',
    synonyms: ['Inside Sales', 'Televentas', 'Ventas Telefónicas', 'SDR', 'Sales Development Rep'],
    keywords: ['ventas internas', 'televentas', 'llamadas', 'prospección'],
    idealProfile: {
      disc: { D: 65, I: 85, S: 50, C: 55 },
      drivingForces: { dominante: 70, practico: 75, intencional: 65 },
      eqFocus: ['comunicación', 'persistencia'],
      dnaCompetencies: ['VERBAL_COMMUNICATION', 'RESILIENCE', 'INFLUENCE'],
    },
  },
  {
    id: 'retail_sales',
    title: 'Vendedor de Tienda',
    titleEn: 'Retail Sales Associate',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Ventas Retail',
    synonyms: ['Vendedor de Piso', 'Asesor de Tienda', 'Dependiente', 'Sales Associate'],
    keywords: ['retail', 'tienda', 'mostrador', 'atención al cliente'],
    idealProfile: {
      disc: { D: 50, I: 85, S: 65, C: 55 },
      drivingForces: { altruista: 75, armonioso: 70, colaborativo: 70 },
      eqFocus: ['servicio', 'empatía', 'comunicación'],
      dnaCompetencies: ['CUSTOMER_SERVICE', 'VERBAL_COMMUNICATION', 'TEAMWORK'],
    },
  },
  {
    id: 'pre_sales',
    title: 'Ingeniero de Preventa',
    titleEn: 'Pre-Sales Engineer',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Preventa',
    synonyms: ['Consultor de Preventa', 'Solution Engineer', 'Technical Sales', 'Sales Engineer'],
    keywords: ['preventa', 'soluciones', 'demos', 'técnico comercial'],
    idealProfile: {
      disc: { D: 55, I: 70, S: 50, C: 80 },
      drivingForces: { intelectual: 85, practico: 75, dominante: 55 },
      eqFocus: ['comunicación técnica', 'solución de problemas'],
      dnaCompetencies: ['PRESENTATION_SKILLS', 'PROBLEM_SOLVING', 'VERBAL_COMMUNICATION'],
    },
  },

  // ============================================
  // MARKETING Y COMUNICACIÓN
  // ============================================
  {
    id: 'marketing_manager',
    title: 'Gerente de Marketing',
    titleEn: 'Marketing Manager',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Gestión de Marketing',
    synonyms: ['Jefe de Marketing', 'Director de Mercadeo', 'Marketing Lead'],
    keywords: ['marketing', 'mercadeo', 'campañas', 'marca', 'estrategia'],
    idealProfile: {
      disc: { D: 65, I: 80, S: 45, C: 65 },
      drivingForces: { receptivo: 85, intelectual: 75, dominante: 60 },
      eqFocus: ['creatividad', 'liderazgo', 'comunicación'],
      dnaCompetencies: ['CREATIVITY', 'LEADERSHIP', 'STRATEGIC_THINKING'],
    },
  },
  {
    id: 'digital_marketing',
    title: 'Especialista en Marketing Digital',
    titleEn: 'Digital Marketing Specialist',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Marketing Digital',
    synonyms: ['Marketing Digital', 'Growth Hacker', 'Especialista SEM/SEO', 'Performance Marketing'],
    keywords: ['digital', 'online', 'SEM', 'SEO', 'redes sociales', 'analytics'],
    idealProfile: {
      disc: { D: 55, I: 65, S: 45, C: 80 },
      drivingForces: { intelectual: 85, receptivo: 80, practico: 70 },
      eqFocus: ['análisis', 'creatividad', 'adaptabilidad'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'CREATIVITY', 'ADAPTABILITY'],
    },
  },
  {
    id: 'content_manager',
    title: 'Gerente de Contenido',
    titleEn: 'Content Manager',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Contenido',
    synonyms: ['Content Manager', 'Content Strategist', 'Editor de Contenido', 'Head of Content'],
    keywords: ['contenido', 'copy', 'redacción', 'editorial', 'storytelling'],
    idealProfile: {
      disc: { D: 50, I: 70, S: 60, C: 75 },
      drivingForces: { intelectual: 85, armonioso: 75, receptivo: 80 },
      eqFocus: ['creatividad', 'comunicación escrita'],
      dnaCompetencies: ['WRITTEN_COMMUNICATION', 'CREATIVITY', 'PLANNING_ORGANIZATION'],
    },
  },
  {
    id: 'community_manager',
    title: 'Community Manager',
    titleEn: 'Community Manager',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Redes Sociales',
    synonyms: ['Social Media Manager', 'Gestor de Redes Sociales', 'Especialista en Redes'],
    keywords: ['redes sociales', 'social media', 'comunidad', 'engagement', 'followers'],
    idealProfile: {
      disc: { D: 45, I: 90, S: 55, C: 55 },
      drivingForces: { armonioso: 80, receptivo: 85, altruista: 65 },
      eqFocus: ['comunicación', 'empatía', 'creatividad'],
      dnaCompetencies: ['VERBAL_COMMUNICATION', 'CREATIVITY', 'CUSTOMER_SERVICE'],
    },
  },
  {
    id: 'brand_manager',
    title: 'Gerente de Marca',
    titleEn: 'Brand Manager',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Gestión de Marca',
    synonyms: ['Brand Manager', 'Gerente de Producto', 'Product Manager Marketing'],
    keywords: ['marca', 'branding', 'posicionamiento', 'identidad de marca'],
    idealProfile: {
      disc: { D: 60, I: 75, S: 50, C: 70 },
      drivingForces: { intelectual: 80, armonioso: 80, dominante: 60 },
      eqFocus: ['estrategia', 'creatividad'],
      dnaCompetencies: ['STRATEGIC_THINKING', 'CREATIVITY', 'INFLUENCE'],
    },
  },
  {
    id: 'public_relations',
    title: 'Especialista en Relaciones Públicas',
    titleEn: 'Public Relations Specialist',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Comunicación',
    synonyms: ['PR Manager', 'Director de Comunicación', 'Relacionista Público', 'Jefe de Prensa'],
    keywords: ['relaciones públicas', 'PR', 'medios', 'comunicación corporativa', 'prensa'],
    idealProfile: {
      disc: { D: 55, I: 90, S: 55, C: 55 },
      drivingForces: { armonioso: 85, altruista: 70, dominante: 55 },
      eqFocus: ['comunicación', 'networking', 'influencia'],
      dnaCompetencies: ['VERBAL_COMMUNICATION', 'INFLUENCE', 'RELATIONSHIP_BUILDING'],
    },
  },
  {
    id: 'events_coordinator',
    title: 'Coordinador de Eventos',
    titleEn: 'Events Coordinator',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Eventos',
    synonyms: ['Gerente de Eventos', 'Event Manager', 'Productor de Eventos', 'Organizador de Eventos'],
    keywords: ['eventos', 'ferias', 'conferencias', 'activaciones', 'logística de eventos'],
    idealProfile: {
      disc: { D: 60, I: 80, S: 55, C: 70 },
      drivingForces: { armonioso: 85, practico: 75, receptivo: 70 },
      eqFocus: ['organización', 'coordinación', 'comunicación'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'TEAMWORK', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'market_research',
    title: 'Analista de Investigación de Mercado',
    titleEn: 'Market Research Analyst',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Investigación',
    synonyms: ['Investigador de Mercado', 'Consumer Insights', 'Analista de Mercado'],
    keywords: ['investigación de mercado', 'estudios', 'insights', 'consumidor', 'datos'],
    idealProfile: {
      disc: { D: 45, I: 50, S: 55, C: 90 },
      drivingForces: { intelectual: 95, practico: 75 },
      eqFocus: ['análisis', 'objetividad'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'PROBLEM_SOLVING', 'WRITTEN_COMMUNICATION'],
    },
  },

  // ============================================
  // TECNOLOGÍA E IT
  // ============================================
  {
    id: 'software_engineer',
    title: 'Ingeniero de Software',
    titleEn: 'Software Engineer',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Desarrollo',
    synonyms: ['Desarrollador', 'Programador', 'Developer', 'Software Developer', 'Ingeniero de Desarrollo'],
    keywords: ['software', 'código', 'programación', 'desarrollo', 'aplicaciones'],
    idealProfile: {
      disc: { D: 55, I: 45, S: 55, C: 90 },
      drivingForces: { intelectual: 95, practico: 75, receptivo: 70 },
      eqFocus: ['resolución de problemas', 'trabajo independiente'],
      dnaCompetencies: ['PROBLEM_SOLVING', 'ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'frontend_developer',
    title: 'Desarrollador Frontend',
    titleEn: 'Frontend Developer',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Desarrollo',
    synonyms: ['Frontend Dev', 'UI Developer', 'Desarrollador Web', 'React Developer', 'Vue Developer'],
    keywords: ['frontend', 'UI', 'web', 'JavaScript', 'React', 'interfaces'],
    idealProfile: {
      disc: { D: 50, I: 55, S: 55, C: 85 },
      drivingForces: { intelectual: 90, armonioso: 75, receptivo: 75 },
      eqFocus: ['creatividad técnica', 'atención al detalle'],
      dnaCompetencies: ['CREATIVITY', 'ATTENTION_TO_DETAIL', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'backend_developer',
    title: 'Desarrollador Backend',
    titleEn: 'Backend Developer',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Desarrollo',
    synonyms: ['Backend Dev', 'Server Developer', 'API Developer', 'Node Developer', 'Python Developer'],
    keywords: ['backend', 'servidor', 'API', 'bases de datos', 'infraestructura'],
    idealProfile: {
      disc: { D: 55, I: 40, S: 55, C: 95 },
      drivingForces: { intelectual: 95, practico: 80, estructurado: 75 },
      eqFocus: ['análisis', 'resolución de problemas'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'PROBLEM_SOLVING', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'fullstack_developer',
    title: 'Desarrollador Full Stack',
    titleEn: 'Full Stack Developer',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Desarrollo',
    synonyms: ['Full Stack Dev', 'Desarrollador Integral', 'Desarrollador Completo'],
    keywords: ['fullstack', 'frontend', 'backend', 'web', 'aplicaciones'],
    idealProfile: {
      disc: { D: 60, I: 50, S: 50, C: 85 },
      drivingForces: { intelectual: 90, practico: 80, receptivo: 75 },
      eqFocus: ['versatilidad', 'aprendizaje continuo'],
      dnaCompetencies: ['ADAPTABILITY', 'PROBLEM_SOLVING', 'CREATIVITY'],
    },
  },
  {
    id: 'mobile_developer',
    title: 'Desarrollador Mobile',
    titleEn: 'Mobile Developer',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Desarrollo',
    synonyms: ['iOS Developer', 'Android Developer', 'React Native Developer', 'Flutter Developer'],
    keywords: ['mobile', 'iOS', 'Android', 'apps', 'aplicaciones móviles'],
    idealProfile: {
      disc: { D: 55, I: 50, S: 55, C: 85 },
      drivingForces: { intelectual: 90, receptivo: 80, practico: 75 },
      eqFocus: ['creatividad', 'UX'],
      dnaCompetencies: ['CREATIVITY', 'PROBLEM_SOLVING', 'ADAPTABILITY'],
    },
  },
  {
    id: 'devops_engineer',
    title: 'Ingeniero DevOps',
    titleEn: 'DevOps Engineer',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Infraestructura',
    synonyms: ['DevOps', 'SRE', 'Site Reliability Engineer', 'Platform Engineer', 'Cloud Engineer'],
    keywords: ['DevOps', 'CI/CD', 'automatización', 'infraestructura', 'cloud'],
    idealProfile: {
      disc: { D: 60, I: 45, S: 50, C: 90 },
      drivingForces: { intelectual: 90, practico: 85, estructurado: 70 },
      eqFocus: ['resolución de problemas', 'automatización'],
      dnaCompetencies: ['PROBLEM_SOLVING', 'ANALYTICAL_THINKING', 'ADAPTABILITY'],
    },
  },
  {
    id: 'data_engineer',
    title: 'Ingeniero de Datos',
    titleEn: 'Data Engineer',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Datos',
    synonyms: ['Data Engineer', 'ETL Developer', 'Big Data Engineer', 'Ingeniero de Big Data'],
    keywords: ['datos', 'ETL', 'pipelines', 'big data', 'data warehouse'],
    idealProfile: {
      disc: { D: 55, I: 40, S: 55, C: 95 },
      drivingForces: { intelectual: 95, practico: 80, estructurado: 75 },
      eqFocus: ['análisis', 'precisión'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'data_scientist',
    title: 'Científico de Datos',
    titleEn: 'Data Scientist',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Datos',
    synonyms: ['Data Scientist', 'Machine Learning Engineer', 'ML Engineer', 'AI Engineer'],
    keywords: ['data science', 'machine learning', 'IA', 'modelos', 'estadística'],
    idealProfile: {
      disc: { D: 55, I: 50, S: 50, C: 90 },
      drivingForces: { intelectual: 98, practico: 70, receptivo: 80 },
      eqFocus: ['análisis', 'curiosidad', 'investigación'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'CREATIVITY', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'data_analyst',
    title: 'Analista de Datos',
    titleEn: 'Data Analyst',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Datos',
    synonyms: ['Business Intelligence Analyst', 'BI Analyst', 'Analista BI', 'Reporting Analyst'],
    keywords: ['análisis de datos', 'reportes', 'dashboards', 'BI', 'métricas'],
    idealProfile: {
      disc: { D: 45, I: 50, S: 55, C: 90 },
      drivingForces: { intelectual: 90, practico: 80 },
      eqFocus: ['análisis', 'comunicación de insights'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'WRITTEN_COMMUNICATION'],
    },
  },
  {
    id: 'qa_engineer',
    title: 'Ingeniero QA',
    titleEn: 'QA Engineer',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Calidad',
    synonyms: ['QA', 'Tester', 'Quality Assurance', 'QA Automation', 'SDET'],
    keywords: ['QA', 'testing', 'pruebas', 'calidad de software', 'automatización'],
    idealProfile: {
      disc: { D: 50, I: 40, S: 60, C: 95 },
      drivingForces: { intelectual: 85, estructurado: 90, practico: 75 },
      eqFocus: ['atención al detalle', 'meticulosidad'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'product_manager_tech',
    title: 'Product Manager',
    titleEn: 'Product Manager',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Producto',
    synonyms: ['PM', 'Gerente de Producto', 'Product Owner', 'PO'],
    keywords: ['producto', 'roadmap', 'requisitos', 'backlog', 'user stories'],
    idealProfile: {
      disc: { D: 70, I: 70, S: 45, C: 70 },
      drivingForces: { intelectual: 80, practico: 85, dominante: 65 },
      eqFocus: ['comunicación', 'liderazgo', 'visión'],
      dnaCompetencies: ['STRATEGIC_THINKING', 'VERBAL_COMMUNICATION', 'DECISION_MAKING'],
    },
  },
  {
    id: 'scrum_master',
    title: 'Scrum Master',
    titleEn: 'Scrum Master',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Gestión Ágil',
    synonyms: ['Agile Coach', 'Facilitador Ágil', 'Delivery Lead'],
    keywords: ['scrum', 'agile', 'metodologías ágiles', 'facilitación', 'sprints'],
    idealProfile: {
      disc: { D: 50, I: 75, S: 65, C: 65 },
      drivingForces: { altruista: 80, benevolo: 75, armonioso: 75 },
      eqFocus: ['facilitación', 'resolución de conflictos', 'comunicación'],
      dnaCompetencies: ['CONFLICT_MANAGEMENT', 'TEAMWORK', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'tech_lead',
    title: 'Tech Lead',
    titleEn: 'Tech Lead',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Liderazgo Técnico',
    synonyms: ['Líder Técnico', 'Technical Lead', 'Engineering Lead', 'Lead Developer'],
    keywords: ['liderazgo técnico', 'arquitectura', 'mentoring', 'código'],
    idealProfile: {
      disc: { D: 65, I: 55, S: 50, C: 85 },
      drivingForces: { intelectual: 90, practico: 80, dominante: 60 },
      eqFocus: ['liderazgo técnico', 'mentoring'],
      dnaCompetencies: ['LEADERSHIP', 'DEVELOPING_OTHERS', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'solutions_architect',
    title: 'Arquitecto de Soluciones',
    titleEn: 'Solutions Architect',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Arquitectura',
    synonyms: ['Solution Architect', 'Enterprise Architect', 'Technical Architect', 'Cloud Architect'],
    keywords: ['arquitectura', 'soluciones', 'diseño de sistemas', 'enterprise'],
    idealProfile: {
      disc: { D: 60, I: 55, S: 50, C: 90 },
      drivingForces: { intelectual: 95, practico: 80, estructurado: 75 },
      eqFocus: ['visión técnica', 'comunicación'],
      dnaCompetencies: ['STRATEGIC_THINKING', 'ANALYTICAL_THINKING', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'it_support',
    title: 'Soporte Técnico',
    titleEn: 'IT Support Specialist',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Soporte',
    synonyms: ['Help Desk', 'Technical Support', 'IT Help Desk', 'Service Desk'],
    keywords: ['soporte', 'help desk', 'tickets', 'usuarios', 'incidentes'],
    idealProfile: {
      disc: { D: 45, I: 65, S: 70, C: 75 },
      drivingForces: { altruista: 80, colaborativo: 75, practico: 70 },
      eqFocus: ['servicio', 'paciencia', 'comunicación'],
      dnaCompetencies: ['CUSTOMER_SERVICE', 'PROBLEM_SOLVING', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'systems_administrator',
    title: 'Administrador de Sistemas',
    titleEn: 'Systems Administrator',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Infraestructura',
    synonyms: ['Sysadmin', 'IT Admin', 'Administrador de Servidores', 'Network Administrator'],
    keywords: ['sistemas', 'servidores', 'redes', 'infraestructura', 'administración'],
    idealProfile: {
      disc: { D: 55, I: 40, S: 60, C: 90 },
      drivingForces: { intelectual: 85, practico: 85, estructurado: 80 },
      eqFocus: ['resolución de problemas', 'meticulosidad'],
      dnaCompetencies: ['PROBLEM_SOLVING', 'ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING'],
    },
  },
  {
    id: 'cybersecurity',
    title: 'Especialista en Ciberseguridad',
    titleEn: 'Cybersecurity Specialist',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Seguridad',
    synonyms: ['Security Analyst', 'Information Security', 'Pentester', 'Security Engineer', 'CISO'],
    keywords: ['ciberseguridad', 'seguridad informática', 'penetration testing', 'vulnerabilidades'],
    idealProfile: {
      disc: { D: 60, I: 40, S: 50, C: 95 },
      drivingForces: { intelectual: 95, estructurado: 85, practico: 75 },
      eqFocus: ['análisis', 'atención al detalle'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'ux_designer',
    title: 'Diseñador UX',
    titleEn: 'UX Designer',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Diseño',
    synonyms: ['UX/UI Designer', 'Product Designer', 'Interaction Designer', 'User Experience Designer'],
    keywords: ['UX', 'experiencia de usuario', 'interfaces', 'usabilidad', 'diseño'],
    idealProfile: {
      disc: { D: 50, I: 70, S: 55, C: 75 },
      drivingForces: { armonioso: 90, intelectual: 80, altruista: 70 },
      eqFocus: ['empatía', 'creatividad', 'investigación'],
      dnaCompetencies: ['CREATIVITY', 'CUSTOMER_SERVICE', 'ANALYTICAL_THINKING'],
    },
  },
  {
    id: 'ui_designer',
    title: 'Diseñador UI',
    titleEn: 'UI Designer',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Diseño',
    synonyms: ['Visual Designer', 'Interface Designer', 'Diseñador de Interfaces'],
    keywords: ['UI', 'interfaces', 'visual', 'diseño gráfico digital'],
    idealProfile: {
      disc: { D: 45, I: 65, S: 55, C: 80 },
      drivingForces: { armonioso: 95, intelectual: 70, receptivo: 80 },
      eqFocus: ['creatividad', 'estética'],
      dnaCompetencies: ['CREATIVITY', 'ATTENTION_TO_DETAIL', 'ADAPTABILITY'],
    },
  },

  // ============================================
  // OPERACIONES Y PRODUCCIÓN
  // ============================================
  {
    id: 'operations_manager',
    title: 'Gerente de Operaciones',
    titleEn: 'Operations Manager',
    category: 'OPERACIONES_PRODUCCION',
    subcategory: 'Gestión de Operaciones',
    synonyms: ['Director de Operaciones', 'Jefe de Operaciones', 'Operations Lead'],
    keywords: ['operaciones', 'eficiencia', 'procesos', 'producción', 'gestión'],
    idealProfile: {
      disc: { D: 75, I: 50, S: 55, C: 80 },
      drivingForces: { practico: 90, estructurado: 80, dominante: 70 },
      eqFocus: ['liderazgo', 'eficiencia'],
      dnaCompetencies: ['RESULTS_ORIENTATION', 'LEADERSHIP', 'PLANNING_ORGANIZATION'],
    },
  },
  {
    id: 'plant_manager',
    title: 'Gerente de Planta',
    titleEn: 'Plant Manager',
    category: 'OPERACIONES_PRODUCCION',
    subcategory: 'Manufactura',
    synonyms: ['Director de Planta', 'Jefe de Fábrica', 'Manufacturing Manager'],
    keywords: ['planta', 'fábrica', 'manufactura', 'producción industrial'],
    idealProfile: {
      disc: { D: 80, I: 50, S: 50, C: 80 },
      drivingForces: { practico: 95, dominante: 75, estructurado: 80 },
      eqFocus: ['liderazgo', 'toma de decisiones'],
      dnaCompetencies: ['LEADERSHIP', 'RESULTS_ORIENTATION', 'DECISION_MAKING'],
    },
  },
  {
    id: 'production_supervisor',
    title: 'Supervisor de Producción',
    titleEn: 'Production Supervisor',
    category: 'OPERACIONES_PRODUCCION',
    subcategory: 'Producción',
    synonyms: ['Jefe de Producción', 'Encargado de Línea', 'Supervisor de Línea', 'Coordinador de Producción'],
    keywords: ['producción', 'línea', 'turno', 'operarios', 'manufactura'],
    idealProfile: {
      disc: { D: 70, I: 55, S: 55, C: 70 },
      drivingForces: { practico: 85, dominante: 65, colaborativo: 65 },
      eqFocus: ['liderazgo operativo', 'gestión de equipos'],
      dnaCompetencies: ['LEADERSHIP', 'TEAMWORK', 'RESULTS_ORIENTATION'],
    },
  },
  {
    id: 'maintenance_manager',
    title: 'Gerente de Mantenimiento',
    titleEn: 'Maintenance Manager',
    category: 'OPERACIONES_PRODUCCION',
    subcategory: 'Mantenimiento',
    synonyms: ['Jefe de Mantenimiento', 'Supervisor de Mantenimiento', 'Director de Mantenimiento'],
    keywords: ['mantenimiento', 'equipos', 'preventivo', 'correctivo', 'maquinaria'],
    idealProfile: {
      disc: { D: 65, I: 45, S: 60, C: 85 },
      drivingForces: { practico: 90, estructurado: 85, intelectual: 70 },
      eqFocus: ['planificación', 'resolución de problemas'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'PROBLEM_SOLVING', 'LEADERSHIP'],
    },
  },
  {
    id: 'maintenance_technician',
    title: 'Técnico de Mantenimiento',
    titleEn: 'Maintenance Technician',
    category: 'OPERACIONES_PRODUCCION',
    subcategory: 'Mantenimiento',
    synonyms: ['Mecánico de Mantenimiento', 'Técnico Electromecánico', 'Técnico Industrial'],
    keywords: ['mantenimiento', 'reparación', 'mecánica', 'eléctrica', 'equipos'],
    idealProfile: {
      disc: { D: 50, I: 40, S: 65, C: 85 },
      drivingForces: { practico: 90, intelectual: 75, estructurado: 75 },
      eqFocus: ['resolución de problemas', 'trabajo manual'],
      dnaCompetencies: ['PROBLEM_SOLVING', 'ATTENTION_TO_DETAIL', 'ADAPTABILITY'],
    },
  },
  {
    id: 'production_planner',
    title: 'Planificador de Producción',
    titleEn: 'Production Planner',
    category: 'OPERACIONES_PRODUCCION',
    subcategory: 'Planificación',
    synonyms: ['Programador de Producción', 'Planning Specialist', 'Analista de Producción'],
    keywords: ['planificación', 'programación', 'capacidad', 'demanda', 'scheduling'],
    idealProfile: {
      disc: { D: 50, I: 40, S: 55, C: 90 },
      drivingForces: { practico: 90, estructurado: 90, intelectual: 75 },
      eqFocus: ['organización', 'análisis'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'ANALYTICAL_THINKING', 'TIME_MANAGEMENT'],
    },
  },

  // ============================================
  // LOGÍSTICA Y CADENA DE SUMINISTRO
  // ============================================
  {
    id: 'supply_chain_manager',
    title: 'Gerente de Cadena de Suministro',
    titleEn: 'Supply Chain Manager',
    category: 'LOGISTICA_CADENA',
    subcategory: 'Cadena de Suministro',
    synonyms: ['Director de Supply Chain', 'SCM Manager', 'Gerente de Abastecimiento'],
    keywords: ['cadena de suministro', 'supply chain', 'abastecimiento', 'logística integral'],
    idealProfile: {
      disc: { D: 70, I: 50, S: 50, C: 85 },
      drivingForces: { practico: 95, intelectual: 75, dominante: 65 },
      eqFocus: ['visión estratégica', 'coordinación'],
      dnaCompetencies: ['STRATEGIC_THINKING', 'PLANNING_ORGANIZATION', 'LEADERSHIP'],
    },
  },
  {
    id: 'logistics_manager',
    title: 'Gerente de Logística',
    titleEn: 'Logistics Manager',
    category: 'LOGISTICA_CADENA',
    subcategory: 'Logística',
    synonyms: ['Director de Logística', 'Jefe de Logística', 'Coordinador de Logística'],
    keywords: ['logística', 'distribución', 'transporte', 'almacén', 'entregas'],
    idealProfile: {
      disc: { D: 70, I: 50, S: 55, C: 80 },
      drivingForces: { practico: 90, estructurado: 80, dominante: 60 },
      eqFocus: ['coordinación', 'eficiencia'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'RESULTS_ORIENTATION', 'LEADERSHIP'],
    },
  },
  {
    id: 'warehouse_manager',
    title: 'Gerente de Almacén',
    titleEn: 'Warehouse Manager',
    category: 'LOGISTICA_CADENA',
    subcategory: 'Almacén',
    synonyms: ['Jefe de Almacén', 'Supervisor de Bodega', 'Director de Almacén', 'Encargado de Bodega'],
    keywords: ['almacén', 'bodega', 'inventario', 'picking', 'almacenamiento'],
    idealProfile: {
      disc: { D: 65, I: 50, S: 60, C: 80 },
      drivingForces: { practico: 90, estructurado: 85, dominante: 55 },
      eqFocus: ['organización', 'liderazgo operativo'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'LEADERSHIP', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'inventory_analyst',
    title: 'Analista de Inventarios',
    titleEn: 'Inventory Analyst',
    category: 'LOGISTICA_CADENA',
    subcategory: 'Inventarios',
    synonyms: ['Controlador de Inventarios', 'Especialista en Inventarios', 'Inventory Controller'],
    keywords: ['inventarios', 'stock', 'control de existencias', 'rotación'],
    idealProfile: {
      disc: { D: 45, I: 40, S: 60, C: 90 },
      drivingForces: { practico: 90, estructurado: 90 },
      eqFocus: ['precisión', 'análisis'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING', 'PLANNING_ORGANIZATION'],
    },
  },
  {
    id: 'transportation_coordinator',
    title: 'Coordinador de Transporte',
    titleEn: 'Transportation Coordinator',
    category: 'LOGISTICA_CADENA',
    subcategory: 'Transporte',
    synonyms: ['Jefe de Transporte', 'Fleet Manager', 'Coordinador de Flota', 'Despachador'],
    keywords: ['transporte', 'flota', 'rutas', 'entregas', 'distribución'],
    idealProfile: {
      disc: { D: 60, I: 55, S: 55, C: 75 },
      drivingForces: { practico: 85, estructurado: 75, colaborativo: 65 },
      eqFocus: ['coordinación', 'comunicación'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'VERBAL_COMMUNICATION', 'TIME_MANAGEMENT'],
    },
  },
  {
    id: 'import_export',
    title: 'Especialista en Comercio Exterior',
    titleEn: 'Import/Export Specialist',
    category: 'LOGISTICA_CADENA',
    subcategory: 'Comercio Internacional',
    synonyms: ['Coordinador de Importaciones', 'Analista de Exportaciones', 'Trade Compliance', 'Agente Aduanal'],
    keywords: ['importación', 'exportación', 'aduanas', 'comercio exterior', 'incoterms'],
    idealProfile: {
      disc: { D: 55, I: 50, S: 55, C: 85 },
      drivingForces: { intelectual: 80, practico: 85, estructurado: 80 },
      eqFocus: ['atención al detalle', 'regulaciones'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING', 'VERBAL_COMMUNICATION'],
    },
  },

  // ============================================
  // LEGAL Y CUMPLIMIENTO
  // ============================================
  {
    id: 'legal_counsel',
    title: 'Director Jurídico',
    titleEn: 'General Counsel',
    category: 'LEGAL_CUMPLIMIENTO',
    subcategory: 'Dirección Legal',
    synonyms: ['General Counsel', 'Chief Legal Officer', 'CLO', 'Director Legal', 'Gerente Legal'],
    keywords: ['legal', 'jurídico', 'abogado', 'derecho', 'asesoría legal'],
    idealProfile: {
      disc: { D: 65, I: 55, S: 50, C: 90 },
      drivingForces: { intelectual: 90, estructurado: 85, dominante: 60 },
      eqFocus: ['análisis', 'negociación', 'ética'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'NEGOTIATION', 'DECISION_MAKING'],
    },
  },
  {
    id: 'corporate_lawyer',
    title: 'Abogado Corporativo',
    titleEn: 'Corporate Lawyer',
    category: 'LEGAL_CUMPLIMIENTO',
    subcategory: 'Legal Corporativo',
    synonyms: ['Abogado de Empresa', 'In-house Counsel', 'Asesor Legal', 'Abogado Interno'],
    keywords: ['contratos', 'corporativo', 'sociedades', 'fusiones', 'adquisiciones'],
    idealProfile: {
      disc: { D: 55, I: 50, S: 50, C: 90 },
      drivingForces: { intelectual: 90, estructurado: 85, practico: 70 },
      eqFocus: ['análisis', 'atención al detalle'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'WRITTEN_COMMUNICATION'],
    },
  },
  {
    id: 'compliance_officer',
    title: 'Director de Cumplimiento',
    titleEn: 'Compliance Officer',
    category: 'LEGAL_CUMPLIMIENTO',
    subcategory: 'Cumplimiento',
    synonyms: ['Compliance Manager', 'Chief Compliance Officer', 'CCO', 'Oficial de Cumplimiento'],
    keywords: ['cumplimiento', 'compliance', 'regulaciones', 'normativa', 'ética'],
    idealProfile: {
      disc: { D: 60, I: 50, S: 55, C: 90 },
      drivingForces: { estructurado: 95, intelectual: 85, practico: 70 },
      eqFocus: ['ética', 'atención al detalle', 'comunicación'],
      dnaCompetencies: ['ACCOUNTABILITY', 'ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING'],
    },
  },
  {
    id: 'contract_manager',
    title: 'Gerente de Contratos',
    titleEn: 'Contract Manager',
    category: 'LEGAL_CUMPLIMIENTO',
    subcategory: 'Contratos',
    synonyms: ['Administrador de Contratos', 'Contract Administrator', 'Coordinador de Contratos'],
    keywords: ['contratos', 'negociación', 'acuerdos', 'licitaciones'],
    idealProfile: {
      disc: { D: 55, I: 50, S: 55, C: 90 },
      drivingForces: { intelectual: 85, estructurado: 85, practico: 75 },
      eqFocus: ['negociación', 'atención al detalle'],
      dnaCompetencies: ['NEGOTIATION', 'ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING'],
    },
  },

  // ============================================
  // SALUD Y MEDICINA
  // ============================================
  {
    id: 'medical_director',
    title: 'Director Médico',
    titleEn: 'Medical Director',
    category: 'SALUD_MEDICINA',
    subcategory: 'Dirección',
    synonyms: ['Chief Medical Officer', 'CMO', 'Director de Salud', 'Gerente Médico'],
    keywords: ['médico', 'salud', 'hospital', 'clínica', 'healthcare'],
    idealProfile: {
      disc: { D: 70, I: 60, S: 55, C: 80 },
      drivingForces: { intelectual: 90, altruista: 85, dominante: 60 },
      eqFocus: ['liderazgo', 'ética médica', 'toma de decisiones'],
      dnaCompetencies: ['LEADERSHIP', 'DECISION_MAKING', 'STRATEGIC_THINKING'],
    },
  },
  {
    id: 'doctor',
    title: 'Médico General',
    titleEn: 'General Practitioner',
    category: 'SALUD_MEDICINA',
    subcategory: 'Medicina',
    synonyms: ['Doctor', 'Médico', 'Physician', 'GP', 'Médico de Familia'],
    keywords: ['medicina', 'pacientes', 'diagnóstico', 'tratamiento', 'consulta'],
    idealProfile: {
      disc: { D: 55, I: 65, S: 70, C: 75 },
      drivingForces: { altruista: 90, intelectual: 85, benevolo: 80 },
      eqFocus: ['empatía', 'comunicación', 'toma de decisiones'],
      dnaCompetencies: ['DECISION_MAKING', 'VERBAL_COMMUNICATION', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'nurse',
    title: 'Enfermero/a',
    titleEn: 'Registered Nurse',
    category: 'SALUD_MEDICINA',
    subcategory: 'Enfermería',
    synonyms: ['Enfermera', 'Enfermero', 'RN', 'Nurse', 'Auxiliar de Enfermería'],
    keywords: ['enfermería', 'cuidado de pacientes', 'hospital', 'atención médica'],
    idealProfile: {
      disc: { D: 45, I: 65, S: 80, C: 70 },
      drivingForces: { altruista: 95, benevolo: 90, colaborativo: 80 },
      eqFocus: ['empatía', 'cuidado', 'trabajo en equipo'],
      dnaCompetencies: ['CUSTOMER_SERVICE', 'TEAMWORK', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'pharmacist',
    title: 'Farmacéutico',
    titleEn: 'Pharmacist',
    category: 'SALUD_MEDICINA',
    subcategory: 'Farmacia',
    synonyms: ['Químico Farmacéutico', 'QF', 'Farmacéutica', 'Regente de Farmacia'],
    keywords: ['farmacia', 'medicamentos', 'prescripción', 'dispensación'],
    idealProfile: {
      disc: { D: 45, I: 55, S: 65, C: 90 },
      drivingForces: { intelectual: 85, altruista: 80, estructurado: 80 },
      eqFocus: ['precisión', 'servicio', 'conocimiento técnico'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'CUSTOMER_SERVICE', 'ANALYTICAL_THINKING'],
    },
  },
  {
    id: 'psychologist',
    title: 'Psicólogo',
    titleEn: 'Psychologist',
    category: 'SALUD_MEDICINA',
    subcategory: 'Salud Mental',
    synonyms: ['Psicóloga', 'Psicólogo Clínico', 'Terapeuta', 'Psicoterapeuta'],
    keywords: ['psicología', 'terapia', 'salud mental', 'evaluación psicológica'],
    idealProfile: {
      disc: { D: 45, I: 70, S: 80, C: 65 },
      drivingForces: { altruista: 95, intelectual: 85, benevolo: 85 },
      eqFocus: ['empatía', 'escucha activa', 'análisis'],
      dnaCompetencies: ['VERBAL_COMMUNICATION', 'ANALYTICAL_THINKING', 'DEVELOPING_OTHERS'],
    },
  },
  {
    id: 'nutritionist',
    title: 'Nutricionista',
    titleEn: 'Nutritionist',
    category: 'SALUD_MEDICINA',
    subcategory: 'Nutrición',
    synonyms: ['Nutrióloga', 'Dietista', 'Nutriólogo Clínico'],
    keywords: ['nutrición', 'dieta', 'alimentación', 'salud'],
    idealProfile: {
      disc: { D: 45, I: 70, S: 70, C: 70 },
      drivingForces: { altruista: 90, intelectual: 80, benevolo: 80 },
      eqFocus: ['empatía', 'educación', 'motivación'],
      dnaCompetencies: ['VERBAL_COMMUNICATION', 'DEVELOPING_OTHERS', 'CUSTOMER_SERVICE'],
    },
  },

  // ============================================
  // EDUCACIÓN Y FORMACIÓN
  // ============================================
  {
    id: 'school_principal',
    title: 'Director de Colegio',
    titleEn: 'School Principal',
    category: 'EDUCACION_FORMACION',
    subcategory: 'Administración Educativa',
    synonyms: ['Rector', 'Director Académico', 'Principal', 'Director de Escuela'],
    keywords: ['educación', 'colegio', 'escuela', 'administración educativa'],
    idealProfile: {
      disc: { D: 65, I: 70, S: 60, C: 65 },
      drivingForces: { altruista: 90, intelectual: 80, dominante: 55 },
      eqFocus: ['liderazgo', 'comunicación', 'gestión de conflictos'],
      dnaCompetencies: ['LEADERSHIP', 'CONFLICT_MANAGEMENT', 'DEVELOPING_OTHERS'],
    },
  },
  {
    id: 'teacher',
    title: 'Profesor',
    titleEn: 'Teacher',
    category: 'EDUCACION_FORMACION',
    subcategory: 'Docencia',
    synonyms: ['Docente', 'Maestro', 'Maestra', 'Educador', 'Instructor'],
    keywords: ['enseñanza', 'docencia', 'educación', 'clases', 'estudiantes'],
    idealProfile: {
      disc: { D: 50, I: 75, S: 70, C: 60 },
      drivingForces: { altruista: 95, intelectual: 85, benevolo: 80 },
      eqFocus: ['empatía', 'comunicación', 'paciencia'],
      dnaCompetencies: ['DEVELOPING_OTHERS', 'VERBAL_COMMUNICATION', 'PRESENTATION_SKILLS'],
    },
  },
  {
    id: 'university_professor',
    title: 'Profesor Universitario',
    titleEn: 'University Professor',
    category: 'EDUCACION_FORMACION',
    subcategory: 'Educación Superior',
    synonyms: ['Catedrático', 'Profesor de Universidad', 'Académico', 'Investigador Docente'],
    keywords: ['universidad', 'cátedra', 'investigación', 'academia'],
    idealProfile: {
      disc: { D: 55, I: 65, S: 55, C: 80 },
      drivingForces: { intelectual: 98, altruista: 80, receptivo: 75 },
      eqFocus: ['conocimiento', 'investigación', 'comunicación'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'PRESENTATION_SKILLS', 'DEVELOPING_OTHERS'],
    },
  },
  {
    id: 'corporate_trainer',
    title: 'Capacitador Empresarial',
    titleEn: 'Corporate Trainer',
    category: 'EDUCACION_FORMACION',
    subcategory: 'Formación Empresarial',
    synonyms: ['Trainer', 'Facilitador', 'Instructor Corporativo', 'Consultor de Capacitación'],
    keywords: ['capacitación', 'entrenamiento', 'talleres', 'formación empresarial'],
    idealProfile: {
      disc: { D: 55, I: 85, S: 55, C: 60 },
      drivingForces: { altruista: 85, intelectual: 80, benevolo: 75 },
      eqFocus: ['comunicación', 'presentación', 'facilitación'],
      dnaCompetencies: ['PRESENTATION_SKILLS', 'DEVELOPING_OTHERS', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'instructional_designer',
    title: 'Diseñador Instruccional',
    titleEn: 'Instructional Designer',
    category: 'EDUCACION_FORMACION',
    subcategory: 'Diseño de Aprendizaje',
    synonyms: ['Learning Designer', 'E-learning Developer', 'Diseñador de Cursos'],
    keywords: ['diseño instruccional', 'e-learning', 'contenido educativo', 'LMS'],
    idealProfile: {
      disc: { D: 50, I: 60, S: 55, C: 80 },
      drivingForces: { intelectual: 90, armonioso: 80, altruista: 75 },
      eqFocus: ['creatividad', 'organización'],
      dnaCompetencies: ['CREATIVITY', 'PLANNING_ORGANIZATION', 'WRITTEN_COMMUNICATION'],
    },
  },

  // ============================================
  // INGENIERÍA
  // ============================================
  {
    id: 'civil_engineer',
    title: 'Ingeniero Civil',
    titleEn: 'Civil Engineer',
    category: 'INGENIERIA',
    subcategory: 'Ingeniería Civil',
    synonyms: ['Ing. Civil', 'Ingeniero de Obras', 'Ingeniero Estructural'],
    keywords: ['construcción', 'estructuras', 'obras civiles', 'infraestructura'],
    idealProfile: {
      disc: { D: 60, I: 45, S: 55, C: 90 },
      drivingForces: { intelectual: 90, practico: 85, estructurado: 80 },
      eqFocus: ['análisis', 'planificación'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'PLANNING_ORGANIZATION', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'mechanical_engineer',
    title: 'Ingeniero Mecánico',
    titleEn: 'Mechanical Engineer',
    category: 'INGENIERIA',
    subcategory: 'Ingeniería Mecánica',
    synonyms: ['Ing. Mecánico', 'Ingeniero de Máquinas', 'Ingeniero de Manufactura'],
    keywords: ['mecánica', 'máquinas', 'diseño mecánico', 'manufactura'],
    idealProfile: {
      disc: { D: 55, I: 45, S: 55, C: 90 },
      drivingForces: { intelectual: 90, practico: 85, estructurado: 75 },
      eqFocus: ['resolución de problemas', 'análisis técnico'],
      dnaCompetencies: ['PROBLEM_SOLVING', 'ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'electrical_engineer',
    title: 'Ingeniero Eléctrico',
    titleEn: 'Electrical Engineer',
    category: 'INGENIERIA',
    subcategory: 'Ingeniería Eléctrica',
    synonyms: ['Ing. Eléctrico', 'Ingeniero Electrónico', 'Ingeniero de Potencia'],
    keywords: ['electricidad', 'circuitos', 'potencia', 'electrónica'],
    idealProfile: {
      disc: { D: 55, I: 45, S: 55, C: 90 },
      drivingForces: { intelectual: 92, practico: 85, estructurado: 75 },
      eqFocus: ['análisis técnico', 'precisión'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'industrial_engineer',
    title: 'Ingeniero Industrial',
    titleEn: 'Industrial Engineer',
    category: 'INGENIERIA',
    subcategory: 'Ingeniería Industrial',
    synonyms: ['Ing. Industrial', 'Ingeniero de Procesos', 'Ingeniero de Productividad'],
    keywords: ['procesos', 'productividad', 'eficiencia', 'mejora continua', 'lean'],
    idealProfile: {
      disc: { D: 60, I: 50, S: 50, C: 85 },
      drivingForces: { practico: 90, intelectual: 85, estructurado: 75 },
      eqFocus: ['optimización', 'análisis de procesos'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'PROBLEM_SOLVING', 'RESULTS_ORIENTATION'],
    },
  },
  {
    id: 'chemical_engineer',
    title: 'Ingeniero Químico',
    titleEn: 'Chemical Engineer',
    category: 'INGENIERIA',
    subcategory: 'Ingeniería Química',
    synonyms: ['Ing. Químico', 'Ingeniero de Procesos Químicos'],
    keywords: ['química', 'procesos químicos', 'plantas', 'refinería'],
    idealProfile: {
      disc: { D: 55, I: 45, S: 55, C: 90 },
      drivingForces: { intelectual: 95, practico: 80, estructurado: 80 },
      eqFocus: ['análisis', 'seguridad', 'precisión'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'project_engineer',
    title: 'Ingeniero de Proyectos',
    titleEn: 'Project Engineer',
    category: 'INGENIERIA',
    subcategory: 'Gestión de Proyectos',
    synonyms: ['Coordinador de Proyectos', 'Project Manager Técnico', 'Líder de Proyectos'],
    keywords: ['proyectos', 'coordinación técnica', 'ejecución', 'ingeniería de proyectos'],
    idealProfile: {
      disc: { D: 65, I: 55, S: 50, C: 80 },
      drivingForces: { practico: 85, intelectual: 80, dominante: 60 },
      eqFocus: ['coordinación', 'liderazgo técnico'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'LEADERSHIP', 'DECISION_MAKING'],
    },
  },

  // ============================================
  // ATENCIÓN AL CLIENTE
  // ============================================
  {
    id: 'customer_service_manager',
    title: 'Gerente de Servicio al Cliente',
    titleEn: 'Customer Service Manager',
    category: 'ATENCION_CLIENTE',
    subcategory: 'Gestión de Servicio',
    synonyms: ['Director de Atención al Cliente', 'Jefe de Servicio al Cliente', 'Customer Experience Manager'],
    keywords: ['servicio al cliente', 'atención', 'experiencia', 'satisfacción'],
    idealProfile: {
      disc: { D: 60, I: 75, S: 65, C: 60 },
      drivingForces: { altruista: 85, benevolo: 80, armonioso: 75 },
      eqFocus: ['empatía', 'liderazgo', 'resolución de conflictos'],
      dnaCompetencies: ['CUSTOMER_SERVICE', 'LEADERSHIP', 'CONFLICT_MANAGEMENT'],
    },
  },
  {
    id: 'customer_service_rep',
    title: 'Representante de Servicio al Cliente',
    titleEn: 'Customer Service Representative',
    category: 'ATENCION_CLIENTE',
    subcategory: 'Atención Directa',
    synonyms: ['Agente de Servicio', 'Asesor de Servicio', 'Ejecutivo de Atención', 'CSR'],
    keywords: ['atención', 'clientes', 'soporte', 'consultas', 'reclamos'],
    idealProfile: {
      disc: { D: 45, I: 80, S: 70, C: 60 },
      drivingForces: { altruista: 90, colaborativo: 80, armonioso: 75 },
      eqFocus: ['empatía', 'paciencia', 'comunicación'],
      dnaCompetencies: ['CUSTOMER_SERVICE', 'VERBAL_COMMUNICATION', 'CONFLICT_MANAGEMENT'],
    },
  },
  {
    id: 'call_center_agent',
    title: 'Agente de Call Center',
    titleEn: 'Call Center Agent',
    category: 'ATENCION_CLIENTE',
    subcategory: 'Call Center',
    synonyms: ['Operador de Call Center', 'Telefonista', 'Contact Center Agent'],
    keywords: ['call center', 'llamadas', 'teléfono', 'contact center'],
    idealProfile: {
      disc: { D: 45, I: 75, S: 70, C: 65 },
      drivingForces: { altruista: 85, colaborativo: 80, armonioso: 70 },
      eqFocus: ['paciencia', 'comunicación', 'manejo del estrés'],
      dnaCompetencies: ['VERBAL_COMMUNICATION', 'CUSTOMER_SERVICE', 'RESILIENCE'],
    },
  },
  {
    id: 'customer_success',
    title: 'Customer Success Manager',
    titleEn: 'Customer Success Manager',
    category: 'ATENCION_CLIENTE',
    subcategory: 'Éxito del Cliente',
    synonyms: ['CSM', 'Gerente de Éxito del Cliente', 'Client Success Manager'],
    keywords: ['customer success', 'retención', 'éxito del cliente', 'onboarding'],
    idealProfile: {
      disc: { D: 55, I: 80, S: 60, C: 60 },
      drivingForces: { altruista: 85, benevolo: 80, practico: 70 },
      eqFocus: ['empatía', 'proactividad', 'relaciones'],
      dnaCompetencies: ['RELATIONSHIP_BUILDING', 'CUSTOMER_SERVICE', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'receptionist',
    title: 'Recepcionista',
    titleEn: 'Receptionist',
    category: 'ATENCION_CLIENTE',
    subcategory: 'Recepción',
    synonyms: ['Secretaria de Recepción', 'Front Desk', 'Auxiliar de Recepción'],
    keywords: ['recepción', 'atención', 'visitantes', 'llamadas', 'front desk'],
    idealProfile: {
      disc: { D: 40, I: 80, S: 75, C: 60 },
      drivingForces: { altruista: 80, colaborativo: 85, armonioso: 80 },
      eqFocus: ['amabilidad', 'comunicación', 'organización'],
      dnaCompetencies: ['CUSTOMER_SERVICE', 'VERBAL_COMMUNICATION', 'PLANNING_ORGANIZATION'],
    },
  },

  // ============================================
  // CREATIVOS Y DISEÑO
  // ============================================
  {
    id: 'creative_director',
    title: 'Director Creativo',
    titleEn: 'Creative Director',
    category: 'CREATIVOS_DISENO',
    subcategory: 'Dirección Creativa',
    synonyms: ['Director de Arte', 'Chief Creative Officer', 'Head of Creative'],
    keywords: ['creatividad', 'dirección artística', 'concepto', 'campañas'],
    idealProfile: {
      disc: { D: 65, I: 80, S: 45, C: 60 },
      drivingForces: { armonioso: 95, receptivo: 90, dominante: 60 },
      eqFocus: ['creatividad', 'liderazgo', 'visión'],
      dnaCompetencies: ['CREATIVITY', 'LEADERSHIP', 'INFLUENCE'],
    },
  },
  {
    id: 'graphic_designer',
    title: 'Diseñador Gráfico',
    titleEn: 'Graphic Designer',
    category: 'CREATIVOS_DISENO',
    subcategory: 'Diseño Gráfico',
    synonyms: ['Diseñador Visual', 'Diseñador de Comunicación Visual', 'Graphic Artist'],
    keywords: ['diseño gráfico', 'visual', 'logos', 'branding', 'ilustración'],
    idealProfile: {
      disc: { D: 45, I: 65, S: 55, C: 80 },
      drivingForces: { armonioso: 95, intelectual: 70, receptivo: 85 },
      eqFocus: ['creatividad', 'atención al detalle'],
      dnaCompetencies: ['CREATIVITY', 'ATTENTION_TO_DETAIL', 'ADAPTABILITY'],
    },
  },
  {
    id: 'video_editor',
    title: 'Editor de Video',
    titleEn: 'Video Editor',
    category: 'CREATIVOS_DISENO',
    subcategory: 'Producción Audiovisual',
    synonyms: ['Post Productor', 'Montajista', 'Editor Audiovisual'],
    keywords: ['video', 'edición', 'postproducción', 'audiovisual'],
    idealProfile: {
      disc: { D: 50, I: 55, S: 55, C: 85 },
      drivingForces: { armonioso: 90, intelectual: 75, receptivo: 80 },
      eqFocus: ['creatividad técnica', 'atención al detalle'],
      dnaCompetencies: ['CREATIVITY', 'ATTENTION_TO_DETAIL', 'TIME_MANAGEMENT'],
    },
  },
  {
    id: 'photographer',
    title: 'Fotógrafo',
    titleEn: 'Photographer',
    category: 'CREATIVOS_DISENO',
    subcategory: 'Fotografía',
    synonyms: ['Fotógrafo Profesional', 'Fotógrafo Comercial', 'Fotógrafo de Producto'],
    keywords: ['fotografía', 'imagen', 'producción fotográfica', 'retoque'],
    idealProfile: {
      disc: { D: 50, I: 65, S: 55, C: 75 },
      drivingForces: { armonioso: 95, receptivo: 85, intelectual: 70 },
      eqFocus: ['creatividad', 'visión artística'],
      dnaCompetencies: ['CREATIVITY', 'ATTENTION_TO_DETAIL', 'ADAPTABILITY'],
    },
  },
  {
    id: 'copywriter',
    title: 'Copywriter',
    titleEn: 'Copywriter',
    category: 'CREATIVOS_DISENO',
    subcategory: 'Redacción',
    synonyms: ['Redactor Creativo', 'Redactor Publicitario', 'Content Writer'],
    keywords: ['copywriting', 'redacción', 'textos publicitarios', 'contenido'],
    idealProfile: {
      disc: { D: 50, I: 70, S: 55, C: 75 },
      drivingForces: { intelectual: 85, armonioso: 80, receptivo: 80 },
      eqFocus: ['creatividad', 'comunicación escrita'],
      dnaCompetencies: ['WRITTEN_COMMUNICATION', 'CREATIVITY', 'INFLUENCE'],
    },
  },
  {
    id: 'interior_designer',
    title: 'Diseñador de Interiores',
    titleEn: 'Interior Designer',
    category: 'CREATIVOS_DISENO',
    subcategory: 'Diseño de Espacios',
    synonyms: ['Interiorista', 'Decorador de Interiores', 'Diseñador de Espacios'],
    keywords: ['interiores', 'espacios', 'decoración', 'diseño de espacios'],
    idealProfile: {
      disc: { D: 55, I: 70, S: 55, C: 75 },
      drivingForces: { armonioso: 95, practico: 70, receptivo: 80 },
      eqFocus: ['creatividad', 'comunicación con clientes'],
      dnaCompetencies: ['CREATIVITY', 'CUSTOMER_SERVICE', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'industrial_designer',
    title: 'Diseñador Industrial',
    titleEn: 'Industrial Designer',
    category: 'CREATIVOS_DISENO',
    subcategory: 'Diseño de Producto',
    synonyms: ['Product Designer', 'Diseñador de Productos', 'Diseñador 3D'],
    keywords: ['diseño industrial', 'productos', '3D', 'prototipado'],
    idealProfile: {
      disc: { D: 55, I: 60, S: 50, C: 85 },
      drivingForces: { armonioso: 85, intelectual: 85, practico: 75 },
      eqFocus: ['creatividad', 'resolución de problemas'],
      dnaCompetencies: ['CREATIVITY', 'PROBLEM_SOLVING', 'ANALYTICAL_THINKING'],
    },
  },

  // ============================================
  // INVESTIGACIÓN Y DESARROLLO
  // ============================================
  {
    id: 'rd_manager',
    title: 'Gerente de I+D',
    titleEn: 'R&D Manager',
    category: 'INVESTIGACION_DESARROLLO',
    subcategory: 'Gestión de I+D',
    synonyms: ['Director de Investigación', 'Gerente de Desarrollo', 'Head of R&D'],
    keywords: ['investigación', 'desarrollo', 'I+D', 'innovación', 'R&D'],
    idealProfile: {
      disc: { D: 65, I: 55, S: 50, C: 85 },
      drivingForces: { intelectual: 95, receptivo: 85, dominante: 55 },
      eqFocus: ['innovación', 'liderazgo técnico'],
      dnaCompetencies: ['STRATEGIC_THINKING', 'LEADERSHIP', 'CREATIVITY'],
    },
  },
  {
    id: 'researcher',
    title: 'Investigador',
    titleEn: 'Researcher',
    category: 'INVESTIGACION_DESARROLLO',
    subcategory: 'Investigación',
    synonyms: ['Científico', 'Research Scientist', 'Analista de Investigación'],
    keywords: ['investigación', 'ciencia', 'estudios', 'laboratorio', 'análisis'],
    idealProfile: {
      disc: { D: 50, I: 50, S: 55, C: 90 },
      drivingForces: { intelectual: 98, receptivo: 85 },
      eqFocus: ['curiosidad', 'análisis', 'metodología'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'PROBLEM_SOLVING', 'WRITTEN_COMMUNICATION'],
    },
  },
  {
    id: 'product_developer',
    title: 'Desarrollador de Productos',
    titleEn: 'Product Developer',
    category: 'INVESTIGACION_DESARROLLO',
    subcategory: 'Desarrollo de Productos',
    synonyms: ['Product Development Specialist', 'Ingeniero de Producto', 'NPD Specialist'],
    keywords: ['desarrollo de producto', 'NPD', 'innovación de producto', 'prototipo'],
    idealProfile: {
      disc: { D: 60, I: 55, S: 50, C: 85 },
      drivingForces: { intelectual: 90, practico: 80, receptivo: 80 },
      eqFocus: ['innovación', 'creatividad técnica'],
      dnaCompetencies: ['CREATIVITY', 'PROBLEM_SOLVING', 'ADAPTABILITY'],
    },
  },

  // ============================================
  // CALIDAD Y PROCESOS
  // ============================================
  {
    id: 'quality_manager',
    title: 'Gerente de Calidad',
    titleEn: 'Quality Manager',
    category: 'CALIDAD_PROCESOS',
    subcategory: 'Gestión de Calidad',
    synonyms: ['Director de Calidad', 'Jefe de Calidad', 'Quality Assurance Manager'],
    keywords: ['calidad', 'control de calidad', 'aseguramiento', 'ISO', 'certificaciones'],
    idealProfile: {
      disc: { D: 60, I: 50, S: 55, C: 90 },
      drivingForces: { estructurado: 95, intelectual: 80, practico: 80 },
      eqFocus: ['atención al detalle', 'mejora continua'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING', 'LEADERSHIP'],
    },
  },
  {
    id: 'quality_inspector',
    title: 'Inspector de Calidad',
    titleEn: 'Quality Inspector',
    category: 'CALIDAD_PROCESOS',
    subcategory: 'Control de Calidad',
    synonyms: ['Analista de Calidad', 'QC Inspector', 'Técnico de Calidad'],
    keywords: ['inspección', 'control', 'muestreo', 'defectos', 'especificaciones'],
    idealProfile: {
      disc: { D: 50, I: 40, S: 60, C: 95 },
      drivingForces: { estructurado: 95, practico: 85 },
      eqFocus: ['precisión', 'meticulosidad'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING', 'ACCOUNTABILITY'],
    },
  },
  {
    id: 'process_engineer',
    title: 'Ingeniero de Procesos',
    titleEn: 'Process Engineer',
    category: 'CALIDAD_PROCESOS',
    subcategory: 'Mejora de Procesos',
    synonyms: ['Process Improvement Specialist', 'Lean Engineer', 'Six Sigma Specialist'],
    keywords: ['procesos', 'mejora continua', 'lean', 'six sigma', 'optimización'],
    idealProfile: {
      disc: { D: 60, I: 50, S: 50, C: 90 },
      drivingForces: { intelectual: 90, practico: 90, estructurado: 80 },
      eqFocus: ['análisis', 'mejora continua'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'PROBLEM_SOLVING', 'RESULTS_ORIENTATION'],
    },
  },

  // ============================================
  // SEGURIDAD
  // ============================================
  {
    id: 'security_manager',
    title: 'Gerente de Seguridad',
    titleEn: 'Security Manager',
    category: 'SEGURIDAD',
    subcategory: 'Gestión de Seguridad',
    synonyms: ['Director de Seguridad', 'Jefe de Seguridad', 'Chief Security Officer'],
    keywords: ['seguridad', 'protección', 'vigilancia', 'riesgos', 'prevención'],
    idealProfile: {
      disc: { D: 75, I: 50, S: 50, C: 80 },
      drivingForces: { estructurado: 90, dominante: 75, practico: 80 },
      eqFocus: ['liderazgo', 'toma de decisiones', 'gestión de crisis'],
      dnaCompetencies: ['LEADERSHIP', 'DECISION_MAKING', 'ACCOUNTABILITY'],
    },
  },
  {
    id: 'hse_manager',
    title: 'Gerente de HSE',
    titleEn: 'HSE Manager',
    category: 'SEGURIDAD',
    subcategory: 'Salud y Seguridad',
    synonyms: ['EHS Manager', 'Director de Seguridad Industrial', 'Jefe de Seguridad y Salud'],
    keywords: ['HSE', 'seguridad industrial', 'salud ocupacional', 'medio ambiente'],
    idealProfile: {
      disc: { D: 65, I: 55, S: 55, C: 85 },
      drivingForces: { estructurado: 90, altruista: 75, intelectual: 75 },
      eqFocus: ['prevención', 'comunicación', 'liderazgo'],
      dnaCompetencies: ['LEADERSHIP', 'ANALYTICAL_THINKING', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'security_guard',
    title: 'Oficial de Seguridad',
    titleEn: 'Security Guard',
    category: 'SEGURIDAD',
    subcategory: 'Vigilancia',
    synonyms: ['Guardia de Seguridad', 'Vigilante', 'Security Officer'],
    keywords: ['vigilancia', 'custodia', 'patrullaje', 'acceso'],
    idealProfile: {
      disc: { D: 60, I: 50, S: 70, C: 70 },
      drivingForces: { estructurado: 85, dominante: 60, colaborativo: 70 },
      eqFocus: ['vigilancia', 'observación', 'protocolo'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ACCOUNTABILITY', 'RESILIENCE'],
    },
  },

  // ============================================
  // CONSTRUCCIÓN E INMOBILIARIA
  // ============================================
  {
    id: 'construction_manager',
    title: 'Gerente de Construcción',
    titleEn: 'Construction Manager',
    category: 'CONSTRUCCION_INMOBILIARIA',
    subcategory: 'Gestión de Construcción',
    synonyms: ['Director de Obra', 'Project Manager Construcción', 'Jefe de Obra'],
    keywords: ['construcción', 'obra', 'proyecto constructivo', 'edificación'],
    idealProfile: {
      disc: { D: 75, I: 55, S: 50, C: 80 },
      drivingForces: { practico: 90, dominante: 75, estructurado: 75 },
      eqFocus: ['liderazgo', 'coordinación', 'toma de decisiones'],
      dnaCompetencies: ['LEADERSHIP', 'PLANNING_ORGANIZATION', 'DECISION_MAKING'],
    },
  },
  {
    id: 'site_supervisor',
    title: 'Supervisor de Obra',
    titleEn: 'Site Supervisor',
    category: 'CONSTRUCCION_INMOBILIARIA',
    subcategory: 'Supervisión',
    synonyms: ['Residente de Obra', 'Encargado de Obra', 'Maestro de Obra'],
    keywords: ['obra', 'supervisión', 'campo', 'trabajadores', 'avance'],
    idealProfile: {
      disc: { D: 70, I: 50, S: 55, C: 75 },
      drivingForces: { practico: 90, dominante: 70, estructurado: 70 },
      eqFocus: ['liderazgo operativo', 'resolución de problemas'],
      dnaCompetencies: ['LEADERSHIP', 'PROBLEM_SOLVING', 'TEAMWORK'],
    },
  },
  {
    id: 'architect',
    title: 'Arquitecto',
    titleEn: 'Architect',
    category: 'CONSTRUCCION_INMOBILIARIA',
    subcategory: 'Diseño',
    synonyms: ['Arquitecta', 'Arquitecto de Proyectos', 'Diseñador Arquitectónico'],
    keywords: ['arquitectura', 'diseño', 'planos', 'construcción', 'espacios'],
    idealProfile: {
      disc: { D: 55, I: 60, S: 50, C: 85 },
      drivingForces: { armonioso: 90, intelectual: 85, practico: 70 },
      eqFocus: ['creatividad', 'visión espacial'],
      dnaCompetencies: ['CREATIVITY', 'ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'real_estate_agent',
    title: 'Agente Inmobiliario',
    titleEn: 'Real Estate Agent',
    category: 'CONSTRUCCION_INMOBILIARIA',
    subcategory: 'Ventas Inmobiliarias',
    synonyms: ['Asesor Inmobiliario', 'Corredor de Bienes Raíces', 'Real Estate Broker'],
    keywords: ['inmobiliario', 'propiedades', 'ventas', 'arriendos', 'bienes raíces'],
    idealProfile: {
      disc: { D: 70, I: 85, S: 45, C: 55 },
      drivingForces: { dominante: 80, practico: 80, intencional: 65 },
      eqFocus: ['persuasión', 'networking', 'negociación'],
      dnaCompetencies: ['INFLUENCE', 'NEGOTIATION', 'RELATIONSHIP_BUILDING'],
    },
  },
  {
    id: 'property_manager',
    title: 'Administrador de Propiedades',
    titleEn: 'Property Manager',
    category: 'CONSTRUCCION_INMOBILIARIA',
    subcategory: 'Administración',
    synonyms: ['Property Manager', 'Gerente de Edificio', 'Administrador de Edificios'],
    keywords: ['administración', 'propiedades', 'edificios', 'mantenimiento', 'inquilinos'],
    idealProfile: {
      disc: { D: 55, I: 60, S: 65, C: 75 },
      drivingForces: { practico: 85, colaborativo: 70, estructurado: 75 },
      eqFocus: ['servicio', 'organización', 'resolución de conflictos'],
      dnaCompetencies: ['CUSTOMER_SERVICE', 'PLANNING_ORGANIZATION', 'CONFLICT_MANAGEMENT'],
    },
  },

  // ============================================
  // AGRICULTURA Y AGROINDUSTRIA
  // ============================================
  {
    id: 'farm_manager',
    title: 'Administrador de Finca',
    titleEn: 'Farm Manager',
    category: 'AGRICULTURA_AGROINDUSTRIA',
    subcategory: 'Gestión Agrícola',
    synonyms: ['Gerente de Finca', 'Administrador Agrícola', 'Mayordomo'],
    keywords: ['finca', 'agricultura', 'cultivos', 'producción agrícola'],
    idealProfile: {
      disc: { D: 70, I: 50, S: 60, C: 75 },
      drivingForces: { practico: 95, estructurado: 75, dominante: 60 },
      eqFocus: ['liderazgo', 'toma de decisiones'],
      dnaCompetencies: ['LEADERSHIP', 'DECISION_MAKING', 'RESULTS_ORIENTATION'],
    },
  },
  {
    id: 'agronomist',
    title: 'Agrónomo',
    titleEn: 'Agronomist',
    category: 'AGRICULTURA_AGROINDUSTRIA',
    subcategory: 'Agronomía',
    synonyms: ['Ingeniero Agrónomo', 'Especialista Agrícola', 'Asesor Agrícola'],
    keywords: ['agronomía', 'cultivos', 'suelos', 'producción agrícola', 'fitosanidad'],
    idealProfile: {
      disc: { D: 55, I: 55, S: 60, C: 80 },
      drivingForces: { intelectual: 85, practico: 85, altruista: 65 },
      eqFocus: ['análisis técnico', 'asesoría técnica'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'PROBLEM_SOLVING', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'veterinarian',
    title: 'Veterinario',
    titleEn: 'Veterinarian',
    category: 'AGRICULTURA_AGROINDUSTRIA',
    subcategory: 'Veterinaria',
    synonyms: ['Médico Veterinario', 'Vet', 'Zootecnista'],
    keywords: ['veterinaria', 'animales', 'ganadería', 'sanidad animal'],
    idealProfile: {
      disc: { D: 55, I: 60, S: 70, C: 75 },
      drivingForces: { altruista: 90, intelectual: 85, benevolo: 80 },
      eqFocus: ['empatía', 'diagnóstico', 'atención'],
      dnaCompetencies: ['DECISION_MAKING', 'PROBLEM_SOLVING', 'VERBAL_COMMUNICATION'],
    },
  },

  // ============================================
  // TURISMO Y HOTELERÍA
  // ============================================
  {
    id: 'hotel_manager',
    title: 'Gerente de Hotel',
    titleEn: 'Hotel Manager',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Gerencia Hotelera',
    synonyms: ['Director de Hotel', 'General Manager Hotel', 'Administrador de Hotel'],
    keywords: ['hotel', 'hospitalidad', 'gestión hotelera', 'alojamiento'],
    idealProfile: {
      disc: { D: 70, I: 75, S: 55, C: 65 },
      drivingForces: { practico: 85, altruista: 75, dominante: 65 },
      eqFocus: ['liderazgo', 'servicio', 'gestión de equipos'],
      dnaCompetencies: ['LEADERSHIP', 'CUSTOMER_SERVICE', 'RESULTS_ORIENTATION'],
    },
  },
  {
    id: 'front_desk_manager',
    title: 'Jefe de Recepción Hotelera',
    titleEn: 'Front Desk Manager',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Recepción',
    synonyms: ['Front Office Manager', 'Supervisor de Recepción', 'Guest Services Manager'],
    keywords: ['recepción hotel', 'check-in', 'huéspedes', 'front desk'],
    idealProfile: {
      disc: { D: 55, I: 80, S: 65, C: 60 },
      drivingForces: { altruista: 85, armonioso: 80, colaborativo: 75 },
      eqFocus: ['servicio', 'comunicación', 'liderazgo'],
      dnaCompetencies: ['CUSTOMER_SERVICE', 'LEADERSHIP', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'tour_guide',
    title: 'Guía Turístico',
    titleEn: 'Tour Guide',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Turismo',
    synonyms: ['Guía de Turismo', 'Tour Conductor', 'Guía Local'],
    keywords: ['turismo', 'tours', 'viajes', 'destinos', 'excursiones'],
    idealProfile: {
      disc: { D: 50, I: 90, S: 55, C: 55 },
      drivingForces: { altruista: 85, armonioso: 80, intelectual: 75 },
      eqFocus: ['comunicación', 'entusiasmo', 'conocimiento'],
      dnaCompetencies: ['VERBAL_COMMUNICATION', 'PRESENTATION_SKILLS', 'CUSTOMER_SERVICE'],
    },
  },
  {
    id: 'chef',
    title: 'Chef',
    titleEn: 'Chef',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Gastronomía',
    synonyms: ['Chef Ejecutivo', 'Head Chef', 'Jefe de Cocina', 'Cocinero Principal'],
    keywords: ['cocina', 'gastronomía', 'restaurante', 'menú', 'culinario'],
    idealProfile: {
      disc: { D: 70, I: 60, S: 50, C: 75 },
      drivingForces: { armonioso: 90, dominante: 70, practico: 75 },
      eqFocus: ['creatividad', 'liderazgo', 'trabajo bajo presión'],
      dnaCompetencies: ['CREATIVITY', 'LEADERSHIP', 'RESILIENCE'],
    },
  },
  {
    id: 'restaurant_manager',
    title: 'Gerente de Restaurante',
    titleEn: 'Restaurant Manager',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Restaurantes',
    synonyms: ['Administrador de Restaurante', 'Encargado de Restaurante', 'F&B Manager'],
    keywords: ['restaurante', 'alimentos', 'bebidas', 'servicio de mesa'],
    idealProfile: {
      disc: { D: 65, I: 75, S: 55, C: 65 },
      drivingForces: { practico: 85, altruista: 75, dominante: 60 },
      eqFocus: ['liderazgo', 'servicio', 'manejo del estrés'],
      dnaCompetencies: ['LEADERSHIP', 'CUSTOMER_SERVICE', 'RESILIENCE'],
    },
  },
  {
    id: 'travel_agent',
    title: 'Agente de Viajes',
    titleEn: 'Travel Agent',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Agencias de Viaje',
    synonyms: ['Consultor de Viajes', 'Asesor de Viajes', 'Travel Consultant'],
    keywords: ['viajes', 'turismo', 'reservas', 'paquetes turísticos', 'destinos'],
    idealProfile: {
      disc: { D: 55, I: 85, S: 55, C: 60 },
      drivingForces: { altruista: 80, armonioso: 80, practico: 70 },
      eqFocus: ['servicio', 'comunicación', 'organización'],
      dnaCompetencies: ['CUSTOMER_SERVICE', 'VERBAL_COMMUNICATION', 'PLANNING_ORGANIZATION'],
    },
  },
  {
    id: 'event_planner',
    title: 'Organizador de Eventos',
    titleEn: 'Event Planner',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Eventos',
    synonyms: ['Wedding Planner', 'Planificador de Eventos', 'Coordinador de Banquetes'],
    keywords: ['eventos', 'bodas', 'conferencias', 'banquetes', 'celebraciones'],
    idealProfile: {
      disc: { D: 60, I: 80, S: 50, C: 70 },
      drivingForces: { armonioso: 85, practico: 80, altruista: 70 },
      eqFocus: ['organización', 'creatividad', 'coordinación'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'CREATIVITY', 'VERBAL_COMMUNICATION'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - TECNOLOGÍA AVANZADA
  // ============================================
  {
    id: 'machine_learning_engineer',
    title: 'Ingeniero de Machine Learning',
    titleEn: 'Machine Learning Engineer',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Inteligencia Artificial',
    synonyms: ['ML Engineer', 'Ingeniero ML', 'AI Engineer', 'Ingeniero de IA'],
    keywords: ['machine learning', 'inteligencia artificial', 'modelos', 'python', 'tensorflow'],
    idealProfile: {
      disc: { D: 55, I: 45, S: 50, C: 95 },
      drivingForces: { intelectual: 95, practico: 75, receptivo: 80 },
      eqFocus: ['análisis', 'resolución de problemas'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'CREATIVITY', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'cloud_architect',
    title: 'Arquitecto de Cloud',
    titleEn: 'Cloud Architect',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Infraestructura',
    synonyms: ['Cloud Solutions Architect', 'AWS Architect', 'Azure Architect', 'GCP Architect'],
    keywords: ['cloud', 'aws', 'azure', 'infraestructura', 'nube'],
    idealProfile: {
      disc: { D: 65, I: 50, S: 55, C: 90 },
      drivingForces: { intelectual: 90, practico: 85, estructurado: 75 },
      eqFocus: ['visión técnica', 'planificación'],
      dnaCompetencies: ['STRATEGIC_THINKING', 'ANALYTICAL_THINKING', 'PLANNING_ORGANIZATION'],
    },
  },
  {
    id: 'product_owner',
    title: 'Product Owner',
    titleEn: 'Product Owner',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Producto',
    synonyms: ['PO', 'Dueño de Producto', 'Propietario de Producto'],
    keywords: ['producto', 'backlog', 'agile', 'scrum', 'user stories'],
    idealProfile: {
      disc: { D: 70, I: 70, S: 50, C: 70 },
      drivingForces: { practico: 85, dominante: 70, receptivo: 75 },
      eqFocus: ['comunicación', 'priorización', 'negociación'],
      dnaCompetencies: ['DECISION_MAKING', 'INFLUENCE', 'STRATEGIC_THINKING'],
    },
  },
  {
    id: 'blockchain_developer',
    title: 'Desarrollador Blockchain',
    titleEn: 'Blockchain Developer',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Desarrollo',
    synonyms: ['Smart Contract Developer', 'Web3 Developer', 'Crypto Developer'],
    keywords: ['blockchain', 'ethereum', 'solidity', 'web3', 'cripto'],
    idealProfile: {
      disc: { D: 60, I: 45, S: 50, C: 90 },
      drivingForces: { intelectual: 95, practico: 75, receptivo: 85 },
      eqFocus: ['innovación', 'análisis técnico'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'CREATIVITY', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'site_reliability_engineer',
    title: 'Ingeniero SRE',
    titleEn: 'Site Reliability Engineer',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Infraestructura',
    synonyms: ['SRE', 'Platform Engineer', 'Infrastructure Engineer'],
    keywords: ['sre', 'kubernetes', 'docker', 'monitoreo', 'disponibilidad'],
    idealProfile: {
      disc: { D: 60, I: 45, S: 60, C: 90 },
      drivingForces: { practico: 90, intelectual: 80, estructurado: 85 },
      eqFocus: ['resolución de problemas', 'trabajo bajo presión'],
      dnaCompetencies: ['PROBLEM_SOLVING', 'ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'ai_product_manager',
    title: 'Product Manager de IA',
    titleEn: 'AI Product Manager',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Producto',
    synonyms: ['PM de Inteligencia Artificial', 'AI PM', 'ML Product Manager'],
    keywords: ['ia', 'producto', 'machine learning', 'estrategia'],
    idealProfile: {
      disc: { D: 70, I: 65, S: 45, C: 80 },
      drivingForces: { intelectual: 90, practico: 80, dominante: 70 },
      eqFocus: ['visión estratégica', 'comunicación técnica'],
      dnaCompetencies: ['STRATEGIC_THINKING', 'INFLUENCE', 'ANALYTICAL_THINKING'],
    },
  },
  {
    id: 'security_analyst',
    title: 'Analista de Seguridad',
    titleEn: 'Security Analyst',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Seguridad',
    synonyms: ['SOC Analyst', 'Cybersecurity Analyst', 'Information Security Analyst'],
    keywords: ['seguridad', 'ciberseguridad', 'soc', 'incidentes', 'amenazas'],
    idealProfile: {
      disc: { D: 55, I: 40, S: 55, C: 95 },
      drivingForces: { intelectual: 90, estructurado: 85, practico: 75 },
      eqFocus: ['análisis', 'atención al detalle'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'database_administrator',
    title: 'Administrador de Base de Datos',
    titleEn: 'Database Administrator',
    category: 'TECNOLOGIA_IT',
    subcategory: 'Infraestructura',
    synonyms: ['DBA', 'Data Administrator', 'Database Engineer'],
    keywords: ['base de datos', 'sql', 'oracle', 'postgresql', 'mysql'],
    idealProfile: {
      disc: { D: 50, I: 40, S: 65, C: 95 },
      drivingForces: { practico: 90, estructurado: 85, intelectual: 75 },
      eqFocus: ['precisión', 'organización'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING', 'PLANNING_ORGANIZATION'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - MARKETING DIGITAL
  // ============================================
  {
    id: 'seo_specialist',
    title: 'Especialista SEO',
    titleEn: 'SEO Specialist',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Marketing Digital',
    synonyms: ['SEO Manager', 'Consultor SEO', 'SEO Analyst'],
    keywords: ['seo', 'posicionamiento', 'google', 'keywords', 'orgánico'],
    idealProfile: {
      disc: { D: 55, I: 50, S: 55, C: 85 },
      drivingForces: { intelectual: 85, practico: 80, receptivo: 70 },
      eqFocus: ['análisis', 'adaptabilidad'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'CREATIVITY'],
    },
  },
  {
    id: 'sem_specialist',
    title: 'Especialista SEM',
    titleEn: 'SEM Specialist',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Marketing Digital',
    synonyms: ['PPC Specialist', 'Paid Media Specialist', 'Google Ads Specialist'],
    keywords: ['sem', 'google ads', 'ppc', 'publicidad pagada', 'campañas'],
    idealProfile: {
      disc: { D: 60, I: 55, S: 50, C: 85 },
      drivingForces: { practico: 85, intelectual: 80, dominante: 65 },
      eqFocus: ['optimización', 'análisis de datos'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'RESULTS_ORIENTATION', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'growth_hacker',
    title: 'Growth Hacker',
    titleEn: 'Growth Hacker',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Growth',
    synonyms: ['Growth Manager', 'Growth Marketer', 'Growth Specialist'],
    keywords: ['growth', 'crecimiento', 'experimentación', 'métricas', 'startup'],
    idealProfile: {
      disc: { D: 75, I: 65, S: 40, C: 80 },
      drivingForces: { receptivo: 90, intelectual: 85, practico: 80 },
      eqFocus: ['creatividad', 'experimentación', 'adaptabilidad'],
      dnaCompetencies: ['CREATIVITY', 'ANALYTICAL_THINKING', 'RESULTS_ORIENTATION'],
    },
  },
  {
    id: 'influencer_marketing',
    title: 'Especialista en Marketing de Influencers',
    titleEn: 'Influencer Marketing Manager',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Redes Sociales',
    synonyms: ['Influencer Relations', 'Creator Partnerships', 'Brand Partnerships'],
    keywords: ['influencers', 'colaboraciones', 'instagram', 'tiktok', 'youtube'],
    idealProfile: {
      disc: { D: 55, I: 85, S: 50, C: 60 },
      drivingForces: { altruista: 80, receptivo: 85, armonioso: 70 },
      eqFocus: ['relaciones', 'negociación', 'creatividad'],
      dnaCompetencies: ['RELATIONSHIP_BUILDING', 'INFLUENCE', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'email_marketing',
    title: 'Especialista en Email Marketing',
    titleEn: 'Email Marketing Specialist',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Marketing Digital',
    synonyms: ['CRM Marketing', 'Marketing Automation Specialist', 'Email Marketer'],
    keywords: ['email', 'crm', 'automatización', 'mailchimp', 'hubspot'],
    idealProfile: {
      disc: { D: 50, I: 55, S: 60, C: 80 },
      drivingForces: { practico: 85, estructurado: 75, intelectual: 70 },
      eqFocus: ['análisis', 'creatividad', 'organización'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'CREATIVITY'],
    },
  },
  {
    id: 'social_media_manager',
    title: 'Social Media Manager',
    titleEn: 'Social Media Manager',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Redes Sociales',
    synonyms: ['Gerente de Redes Sociales', 'SMM', 'Digital Content Manager'],
    keywords: ['redes sociales', 'facebook', 'instagram', 'linkedin', 'tiktok'],
    idealProfile: {
      disc: { D: 55, I: 85, S: 50, C: 65 },
      drivingForces: { receptivo: 90, altruista: 75, armonioso: 70 },
      eqFocus: ['creatividad', 'comunicación', 'tendencias'],
      dnaCompetencies: ['CREATIVITY', 'VERBAL_COMMUNICATION', 'INFLUENCE'],
    },
  },
  {
    id: 'ecommerce_manager',
    title: 'Gerente de E-commerce',
    titleEn: 'E-commerce Manager',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Comercio Digital',
    synonyms: ['Digital Commerce Manager', 'Online Sales Manager', 'Marketplace Manager'],
    keywords: ['ecommerce', 'tienda online', 'shopify', 'amazon', 'mercadolibre'],
    idealProfile: {
      disc: { D: 70, I: 60, S: 50, C: 75 },
      drivingForces: { practico: 90, dominante: 75, intelectual: 70 },
      eqFocus: ['resultados', 'análisis', 'innovación'],
      dnaCompetencies: ['RESULTS_ORIENTATION', 'ANALYTICAL_THINKING', 'STRATEGIC_THINKING'],
    },
  },
  {
    id: 'performance_marketing',
    title: 'Especialista en Performance Marketing',
    titleEn: 'Performance Marketing Manager',
    category: 'MARKETING_COMUNICACION',
    subcategory: 'Marketing Digital',
    synonyms: ['Digital Performance Manager', 'Paid Acquisition', 'Media Buyer'],
    keywords: ['performance', 'roi', 'cpa', 'conversiones', 'paid media'],
    idealProfile: {
      disc: { D: 65, I: 50, S: 45, C: 90 },
      drivingForces: { practico: 95, intelectual: 80, dominante: 70 },
      eqFocus: ['análisis', 'optimización', 'resultados'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'RESULTS_ORIENTATION', 'ATTENTION_TO_DETAIL'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - SALUD Y BIENESTAR
  // ============================================
  {
    id: 'physical_therapist',
    title: 'Fisioterapeuta',
    titleEn: 'Physical Therapist',
    category: 'SALUD_MEDICINA',
    subcategory: 'Rehabilitación',
    synonyms: ['Terapeuta Físico', 'Kinesiólogo', 'Rehabilitador'],
    keywords: ['fisioterapia', 'rehabilitación', 'terapia física', 'lesiones'],
    idealProfile: {
      disc: { D: 45, I: 65, S: 80, C: 70 },
      drivingForces: { altruista: 90, benevolo: 85, practico: 75 },
      eqFocus: ['empatía', 'paciencia', 'comunicación'],
      dnaCompetencies: ['INTERPERSONAL_SKILLS', 'PATIENCE', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'dentist',
    title: 'Odontólogo',
    titleEn: 'Dentist',
    category: 'SALUD_MEDICINA',
    subcategory: 'Especialidades',
    synonyms: ['Dentista', 'Cirujano Dental', 'Doctor Dental'],
    keywords: ['odontología', 'dientes', 'dental', 'ortodoncia'],
    idealProfile: {
      disc: { D: 55, I: 60, S: 65, C: 85 },
      drivingForces: { practico: 85, altruista: 80, estructurado: 75 },
      eqFocus: ['precisión', 'comunicación con pacientes'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'INTERPERSONAL_SKILLS', 'MANUAL_DEXTERITY'],
    },
  },
  {
    id: 'occupational_therapist',
    title: 'Terapeuta Ocupacional',
    titleEn: 'Occupational Therapist',
    category: 'SALUD_MEDICINA',
    subcategory: 'Rehabilitación',
    synonyms: ['TO', 'Terapeuta Laboral'],
    keywords: ['terapia ocupacional', 'rehabilitación', 'discapacidad', 'autonomía'],
    idealProfile: {
      disc: { D: 45, I: 70, S: 80, C: 65 },
      drivingForces: { altruista: 95, benevolo: 85, armonioso: 80 },
      eqFocus: ['empatía', 'creatividad', 'paciencia'],
      dnaCompetencies: ['INTERPERSONAL_SKILLS', 'CREATIVITY', 'PATIENCE'],
    },
  },
  {
    id: 'radiologist',
    title: 'Radiólogo',
    titleEn: 'Radiologist',
    category: 'SALUD_MEDICINA',
    subcategory: 'Diagnóstico',
    synonyms: ['Médico Radiólogo', 'Especialista en Imagen'],
    keywords: ['radiología', 'imagen', 'diagnóstico', 'rayos x', 'resonancia'],
    idealProfile: {
      disc: { D: 50, I: 40, S: 60, C: 95 },
      drivingForces: { intelectual: 90, practico: 85, estructurado: 80 },
      eqFocus: ['análisis', 'precisión'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'DIAGNOSTIC_SKILLS'],
    },
  },
  {
    id: 'speech_therapist',
    title: 'Fonoaudiólogo',
    titleEn: 'Speech Therapist',
    category: 'SALUD_MEDICINA',
    subcategory: 'Rehabilitación',
    synonyms: ['Logopeda', 'Terapeuta del Habla', 'Terapeuta de Lenguaje'],
    keywords: ['fonoaudiología', 'lenguaje', 'habla', 'comunicación', 'deglución'],
    idealProfile: {
      disc: { D: 45, I: 75, S: 80, C: 65 },
      drivingForces: { altruista: 90, benevolo: 85, intelectual: 70 },
      eqFocus: ['paciencia', 'empatía', 'comunicación'],
      dnaCompetencies: ['INTERPERSONAL_SKILLS', 'PATIENCE', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'lab_technician',
    title: 'Técnico de Laboratorio',
    titleEn: 'Lab Technician',
    category: 'SALUD_MEDICINA',
    subcategory: 'Laboratorio',
    synonyms: ['Laboratorista', 'Técnico Clínico', 'Analista de Laboratorio'],
    keywords: ['laboratorio', 'análisis', 'muestras', 'sangre', 'diagnóstico'],
    idealProfile: {
      disc: { D: 40, I: 45, S: 70, C: 95 },
      drivingForces: { practico: 90, estructurado: 85, intelectual: 75 },
      eqFocus: ['precisión', 'metodología'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING', 'ACCURACY'],
    },
  },
  {
    id: 'paramedic',
    title: 'Paramédico',
    titleEn: 'Paramedic',
    category: 'SALUD_MEDICINA',
    subcategory: 'Emergencias',
    synonyms: ['Técnico en Emergencias', 'EMT', 'Socorrista'],
    keywords: ['emergencias', 'ambulancia', 'primeros auxilios', 'trauma'],
    idealProfile: {
      disc: { D: 75, I: 55, S: 50, C: 80 },
      drivingForces: { altruista: 95, practico: 85, dominante: 70 },
      eqFocus: ['manejo del estrés', 'toma de decisiones rápida'],
      dnaCompetencies: ['STRESS_MANAGEMENT', 'DECISION_MAKING', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'surgeon',
    title: 'Cirujano',
    titleEn: 'Surgeon',
    category: 'SALUD_MEDICINA',
    subcategory: 'Cirugía',
    synonyms: ['Médico Cirujano', 'Especialista en Cirugía'],
    keywords: ['cirugía', 'operación', 'quirófano', 'intervención'],
    idealProfile: {
      disc: { D: 80, I: 45, S: 45, C: 90 },
      drivingForces: { practico: 95, dominante: 85, intelectual: 80 },
      eqFocus: ['precisión', 'liderazgo', 'manejo del estrés'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'STRESS_MANAGEMENT', 'LEADERSHIP'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - FINANZAS Y BANCA
  // ============================================
  {
    id: 'investment_analyst',
    title: 'Analista de Inversiones',
    titleEn: 'Investment Analyst',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Inversiones',
    synonyms: ['Research Analyst', 'Equity Analyst', 'Analista Financiero de Inversiones'],
    keywords: ['inversiones', 'acciones', 'fondos', 'análisis', 'portafolio'],
    idealProfile: {
      disc: { D: 60, I: 45, S: 50, C: 95 },
      drivingForces: { intelectual: 95, practico: 85, estructurado: 80 },
      eqFocus: ['análisis', 'pensamiento crítico'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'STRATEGIC_THINKING'],
    },
  },
  {
    id: 'risk_manager',
    title: 'Gerente de Riesgos',
    titleEn: 'Risk Manager',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Gestión de Riesgos',
    synonyms: ['Risk Analyst', 'Director de Riesgos', 'Especialista en Riesgos'],
    keywords: ['riesgos', 'análisis', 'mitigación', 'compliance', 'control'],
    idealProfile: {
      disc: { D: 60, I: 45, S: 55, C: 95 },
      drivingForces: { estructurado: 90, intelectual: 85, practico: 80 },
      eqFocus: ['análisis', 'previsión', 'pensamiento crítico'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'STRATEGIC_THINKING'],
    },
  },
  {
    id: 'credit_analyst',
    title: 'Analista de Crédito',
    titleEn: 'Credit Analyst',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Banca',
    synonyms: ['Oficial de Crédito', 'Evaluador de Crédito'],
    keywords: ['crédito', 'préstamos', 'riesgo crediticio', 'análisis'],
    idealProfile: {
      disc: { D: 55, I: 45, S: 55, C: 95 },
      drivingForces: { practico: 90, estructurado: 85, intelectual: 75 },
      eqFocus: ['análisis', 'objetividad'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'DECISION_MAKING'],
    },
  },
  {
    id: 'tax_specialist',
    title: 'Especialista en Impuestos',
    titleEn: 'Tax Specialist',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Tributario',
    synonyms: ['Tax Advisor', 'Asesor Fiscal', 'Consultor Tributario'],
    keywords: ['impuestos', 'tributario', 'fiscal', 'declaraciones', 'DIAN'],
    idealProfile: {
      disc: { D: 50, I: 45, S: 60, C: 95 },
      drivingForces: { estructurado: 95, practico: 85, intelectual: 80 },
      eqFocus: ['precisión', 'actualización constante'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING', 'TECHNICAL_KNOWLEDGE'],
    },
  },
  {
    id: 'wealth_manager',
    title: 'Gestor de Patrimonio',
    titleEn: 'Wealth Manager',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Banca Privada',
    synonyms: ['Private Banker', 'Financial Advisor', 'Asesor Patrimonial'],
    keywords: ['patrimonio', 'inversiones', 'banca privada', 'clientes'],
    idealProfile: {
      disc: { D: 65, I: 75, S: 55, C: 75 },
      drivingForces: { practico: 85, altruista: 75, dominante: 70 },
      eqFocus: ['relaciones', 'confianza', 'asesoría'],
      dnaCompetencies: ['RELATIONSHIP_BUILDING', 'INFLUENCE', 'ANALYTICAL_THINKING'],
    },
  },
  {
    id: 'collections_specialist',
    title: 'Especialista en Cobranza',
    titleEn: 'Collections Specialist',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Cobranzas',
    synonyms: ['Gestor de Cobranzas', 'Collector', 'Analista de Cartera'],
    keywords: ['cobranza', 'cartera', 'recuperación', 'clientes morosos'],
    idealProfile: {
      disc: { D: 75, I: 65, S: 45, C: 70 },
      drivingForces: { practico: 85, dominante: 80, estructurado: 70 },
      eqFocus: ['negociación', 'persistencia', 'comunicación'],
      dnaCompetencies: ['NEGOTIATION', 'PERSISTENCE', 'VERBAL_COMMUNICATION'],
    },
  },
  {
    id: 'budget_analyst',
    title: 'Analista de Presupuesto',
    titleEn: 'Budget Analyst',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Planeación Financiera',
    synonyms: ['Financial Planning Analyst', 'Budget Planner'],
    keywords: ['presupuesto', 'planeación', 'forecast', 'proyecciones'],
    idealProfile: {
      disc: { D: 50, I: 40, S: 60, C: 95 },
      drivingForces: { estructurado: 95, practico: 85, intelectual: 75 },
      eqFocus: ['precisión', 'planificación'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'PLANNING_ORGANIZATION'],
    },
  },
  {
    id: 'billing_specialist',
    title: 'Especialista en Facturación',
    titleEn: 'Billing Specialist',
    category: 'ADMINISTRACION_FINANZAS',
    subcategory: 'Facturación',
    synonyms: ['Facturador', 'Billing Clerk', 'Coordinador de Facturación'],
    keywords: ['facturación', 'facturas', 'cobros', 'clientes'],
    idealProfile: {
      disc: { D: 45, I: 50, S: 70, C: 90 },
      drivingForces: { estructurado: 90, practico: 85, armonioso: 70 },
      eqFocus: ['precisión', 'organización'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ACCURACY', 'TIME_MANAGEMENT'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - RECURSOS HUMANOS
  // ============================================
  {
    id: 'talent_acquisition',
    title: 'Especialista en Adquisición de Talento',
    titleEn: 'Talent Acquisition Specialist',
    category: 'RECURSOS_HUMANOS',
    subcategory: 'Reclutamiento',
    synonyms: ['Headhunter', 'Technical Recruiter', 'Sourcer'],
    keywords: ['talento', 'reclutamiento', 'headhunting', 'candidatos'],
    idealProfile: {
      disc: { D: 65, I: 80, S: 55, C: 60 },
      drivingForces: { altruista: 80, receptivo: 75, practico: 70 },
      eqFocus: ['comunicación', 'networking', 'evaluación'],
      dnaCompetencies: ['RELATIONSHIP_BUILDING', 'INFLUENCE', 'INTERVIEWING_SKILLS'],
    },
  },
  {
    id: 'hris_specialist',
    title: 'Especialista HRIS',
    titleEn: 'HRIS Specialist',
    category: 'RECURSOS_HUMANOS',
    subcategory: 'Sistemas de RH',
    synonyms: ['HR Systems Analyst', 'People Analytics', 'HR Tech Specialist'],
    keywords: ['hris', 'sistemas rh', 'workday', 'sap hr', 'analytics'],
    idealProfile: {
      disc: { D: 55, I: 50, S: 60, C: 90 },
      drivingForces: { intelectual: 85, practico: 80, estructurado: 80 },
      eqFocus: ['análisis', 'tecnología'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'TECHNICAL_KNOWLEDGE', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'diversity_inclusion',
    title: 'Especialista en Diversidad e Inclusión',
    titleEn: 'Diversity & Inclusion Specialist',
    category: 'RECURSOS_HUMANOS',
    subcategory: 'Cultura Organizacional',
    synonyms: ['DEI Manager', 'D&I Specialist', 'Inclusion Manager'],
    keywords: ['diversidad', 'inclusión', 'equidad', 'cultura'],
    idealProfile: {
      disc: { D: 55, I: 80, S: 70, C: 55 },
      drivingForces: { altruista: 95, benevolo: 90, armonioso: 85 },
      eqFocus: ['empatía', 'comunicación', 'influencia'],
      dnaCompetencies: ['INTERPERSONAL_SKILLS', 'INFLUENCE', 'CONFLICT_MANAGEMENT'],
    },
  },
  {
    id: 'employee_experience',
    title: 'Especialista en Experiencia del Empleado',
    titleEn: 'Employee Experience Specialist',
    category: 'RECURSOS_HUMANOS',
    subcategory: 'Bienestar',
    synonyms: ['EX Manager', 'People Experience', 'Employee Engagement'],
    keywords: ['experiencia', 'engagement', 'bienestar', 'satisfacción'],
    idealProfile: {
      disc: { D: 55, I: 80, S: 70, C: 55 },
      drivingForces: { altruista: 90, armonioso: 85, receptivo: 80 },
      eqFocus: ['empatía', 'creatividad', 'comunicación'],
      dnaCompetencies: ['INTERPERSONAL_SKILLS', 'CREATIVITY', 'RELATIONSHIP_BUILDING'],
    },
  },
  {
    id: 'benefits_administrator',
    title: 'Administrador de Beneficios',
    titleEn: 'Benefits Administrator',
    category: 'RECURSOS_HUMANOS',
    subcategory: 'Compensación',
    synonyms: ['Benefits Coordinator', 'Compensation Administrator'],
    keywords: ['beneficios', 'seguros', 'prestaciones', 'compensación'],
    idealProfile: {
      disc: { D: 45, I: 55, S: 75, C: 85 },
      drivingForces: { estructurado: 85, altruista: 80, practico: 75 },
      eqFocus: ['servicio', 'organización'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'INTERPERSONAL_SKILLS', 'ACCURACY'],
    },
  },
  {
    id: 'onboarding_specialist',
    title: 'Especialista en Onboarding',
    titleEn: 'Onboarding Specialist',
    category: 'RECURSOS_HUMANOS',
    subcategory: 'Integración',
    synonyms: ['Induction Coordinator', 'Orientation Specialist'],
    keywords: ['onboarding', 'inducción', 'integración', 'nuevos empleados'],
    idealProfile: {
      disc: { D: 50, I: 80, S: 70, C: 60 },
      drivingForces: { altruista: 85, armonioso: 80, benevolo: 75 },
      eqFocus: ['comunicación', 'organización', 'empatía'],
      dnaCompetencies: ['VERBAL_COMMUNICATION', 'INTERPERSONAL_SKILLS', 'PLANNING_ORGANIZATION'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - VENTAS
  // ============================================
  {
    id: 'key_account_manager',
    title: 'Key Account Manager',
    titleEn: 'Key Account Manager',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Cuentas Clave',
    synonyms: ['KAM', 'Gerente de Cuentas Clave', 'Strategic Account Manager'],
    keywords: ['cuentas clave', 'clientes estratégicos', 'ventas b2b'],
    idealProfile: {
      disc: { D: 70, I: 80, S: 55, C: 60 },
      drivingForces: { practico: 85, dominante: 75, altruista: 70 },
      eqFocus: ['relaciones', 'negociación', 'servicio'],
      dnaCompetencies: ['RELATIONSHIP_BUILDING', 'NEGOTIATION', 'STRATEGIC_THINKING'],
    },
  },
  {
    id: 'sales_engineer',
    title: 'Ingeniero de Ventas',
    titleEn: 'Sales Engineer',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Ventas Técnicas',
    synonyms: ['Technical Sales', 'Solution Sales', 'Consultor Técnico Comercial'],
    keywords: ['ventas técnicas', 'soluciones', 'tecnología', 'demos'],
    idealProfile: {
      disc: { D: 65, I: 70, S: 50, C: 80 },
      drivingForces: { intelectual: 85, practico: 80, dominante: 70 },
      eqFocus: ['comunicación técnica', 'persuasión'],
      dnaCompetencies: ['TECHNICAL_KNOWLEDGE', 'INFLUENCE', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'channel_manager',
    title: 'Gerente de Canal',
    titleEn: 'Channel Manager',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Canales',
    synonyms: ['Partner Manager', 'Alliance Manager', 'Distribution Manager'],
    keywords: ['canales', 'distribuidores', 'partners', 'alianzas'],
    idealProfile: {
      disc: { D: 70, I: 75, S: 50, C: 65 },
      drivingForces: { practico: 85, dominante: 80, altruista: 65 },
      eqFocus: ['relaciones', 'negociación', 'estrategia'],
      dnaCompetencies: ['RELATIONSHIP_BUILDING', 'NEGOTIATION', 'STRATEGIC_THINKING'],
    },
  },
  {
    id: 'field_sales',
    title: 'Vendedor de Campo',
    titleEn: 'Field Sales Representative',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Ventas Externas',
    synonyms: ['Outside Sales', 'Sales Rep', 'Representante Comercial'],
    keywords: ['ventas campo', 'visitas', 'clientes', 'territorio'],
    idealProfile: {
      disc: { D: 75, I: 80, S: 45, C: 55 },
      drivingForces: { practico: 90, dominante: 85, receptivo: 65 },
      eqFocus: ['autonomía', 'persistencia', 'relaciones'],
      dnaCompetencies: ['PERSISTENCE', 'RELATIONSHIP_BUILDING', 'RESULTS_ORIENTATION'],
    },
  },
  {
    id: 'telemarketer',
    title: 'Televendedor',
    titleEn: 'Telemarketer',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Televentas',
    synonyms: ['Telesales', 'Inside Sales Rep', 'Ventas por Teléfono'],
    keywords: ['televentas', 'llamadas', 'teléfono', 'ventas'],
    idealProfile: {
      disc: { D: 70, I: 85, S: 45, C: 55 },
      drivingForces: { practico: 85, dominante: 80, armonioso: 65 },
      eqFocus: ['comunicación verbal', 'resiliencia'],
      dnaCompetencies: ['VERBAL_COMMUNICATION', 'PERSISTENCE', 'RESILIENCE'],
    },
  },
  {
    id: 'sales_operations',
    title: 'Especialista en Sales Operations',
    titleEn: 'Sales Operations Specialist',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Operaciones',
    synonyms: ['Sales Ops', 'Revenue Operations', 'Commercial Operations'],
    keywords: ['operaciones ventas', 'crm', 'reportes', 'procesos'],
    idealProfile: {
      disc: { D: 55, I: 50, S: 60, C: 90 },
      drivingForces: { practico: 90, estructurado: 85, intelectual: 75 },
      eqFocus: ['análisis', 'organización'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'PLANNING_ORGANIZATION', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'territory_manager',
    title: 'Gerente de Territorio',
    titleEn: 'Territory Manager',
    category: 'VENTAS_COMERCIAL',
    subcategory: 'Gerencia',
    synonyms: ['Area Manager', 'District Manager', 'Gerente de Zona'],
    keywords: ['territorio', 'zona', 'equipo ventas', 'región'],
    idealProfile: {
      disc: { D: 80, I: 70, S: 45, C: 65 },
      drivingForces: { dominante: 85, practico: 85, colaborativo: 70 },
      eqFocus: ['liderazgo', 'estrategia', 'motivación'],
      dnaCompetencies: ['LEADERSHIP', 'STRATEGIC_THINKING', 'DEVELOPING_OTHERS'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - OPERACIONES Y PRODUCCIÓN
  // ============================================
  {
    id: 'lean_specialist',
    title: 'Especialista Lean',
    titleEn: 'Lean Specialist',
    category: 'OPERACIONES_PRODUCCION',
    subcategory: 'Mejora Continua',
    synonyms: ['Lean Six Sigma', 'Continuous Improvement', 'Kaizen Specialist'],
    keywords: ['lean', 'mejora continua', 'eficiencia', 'procesos'],
    idealProfile: {
      disc: { D: 65, I: 60, S: 55, C: 85 },
      drivingForces: { practico: 95, intelectual: 80, estructurado: 80 },
      eqFocus: ['análisis', 'cambio', 'colaboración'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'CHANGE_MANAGEMENT', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'shift_supervisor',
    title: 'Supervisor de Turno',
    titleEn: 'Shift Supervisor',
    category: 'OPERACIONES_PRODUCCION',
    subcategory: 'Supervisión',
    synonyms: ['Jefe de Turno', 'Shift Leader', 'Coordinador de Turno'],
    keywords: ['turno', 'supervisión', 'personal', 'producción'],
    idealProfile: {
      disc: { D: 70, I: 60, S: 55, C: 75 },
      drivingForces: { practico: 90, dominante: 75, estructurado: 75 },
      eqFocus: ['liderazgo', 'resolución de conflictos'],
      dnaCompetencies: ['LEADERSHIP', 'CONFLICT_MANAGEMENT', 'DECISION_MAKING'],
    },
  },
  {
    id: 'packaging_operator',
    title: 'Operador de Empaque',
    titleEn: 'Packaging Operator',
    category: 'OPERACIONES_PRODUCCION',
    subcategory: 'Producción',
    synonyms: ['Empacador', 'Packing Operator', 'Line Operator'],
    keywords: ['empaque', 'línea', 'producción', 'manual'],
    idealProfile: {
      disc: { D: 45, I: 50, S: 80, C: 75 },
      drivingForces: { practico: 90, estructurado: 80, armonioso: 70 },
      eqFocus: ['consistencia', 'trabajo en equipo'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'TEAMWORK', 'MANUAL_DEXTERITY'],
    },
  },
  {
    id: 'cnc_operator',
    title: 'Operador CNC',
    titleEn: 'CNC Operator',
    category: 'OPERACIONES_PRODUCCION',
    subcategory: 'Manufactura',
    synonyms: ['Maquinista CNC', 'CNC Machinist', 'Programador CNC'],
    keywords: ['cnc', 'torno', 'fresadora', 'mecanizado'],
    idealProfile: {
      disc: { D: 50, I: 40, S: 65, C: 95 },
      drivingForces: { practico: 95, estructurado: 85, intelectual: 70 },
      eqFocus: ['precisión', 'concentración'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'TECHNICAL_KNOWLEDGE', 'ACCURACY'],
    },
  },
  {
    id: 'forklift_operator',
    title: 'Operador de Montacargas',
    titleEn: 'Forklift Operator',
    category: 'LOGISTICA_CADENA',
    subcategory: 'Almacén',
    synonyms: ['Montacarguista', 'Forklift Driver', 'Material Handler'],
    keywords: ['montacargas', 'almacén', 'carga', 'materiales'],
    idealProfile: {
      disc: { D: 55, I: 45, S: 75, C: 80 },
      drivingForces: { practico: 95, estructurado: 80, armonioso: 65 },
      eqFocus: ['seguridad', 'precisión'],
      dnaCompetencies: ['SAFETY_AWARENESS', 'ATTENTION_TO_DETAIL', 'SPATIAL_AWARENESS'],
    },
  },
  {
    id: 'production_engineer',
    title: 'Ingeniero de Producción',
    titleEn: 'Production Engineer',
    category: 'OPERACIONES_PRODUCCION',
    subcategory: 'Ingeniería',
    synonyms: ['Manufacturing Engineer', 'Process Production Engineer'],
    keywords: ['producción', 'manufactura', 'procesos', 'optimización'],
    idealProfile: {
      disc: { D: 65, I: 50, S: 55, C: 90 },
      drivingForces: { practico: 95, intelectual: 80, estructurado: 80 },
      eqFocus: ['análisis', 'solución de problemas'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'PROBLEM_SOLVING', 'TECHNICAL_KNOWLEDGE'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - LOGÍSTICA
  // ============================================
  {
    id: 'dispatch_coordinator',
    title: 'Coordinador de Despachos',
    titleEn: 'Dispatch Coordinator',
    category: 'LOGISTICA_CADENA',
    subcategory: 'Distribución',
    synonyms: ['Despachador', 'Shipping Coordinator', 'Distribution Coordinator'],
    keywords: ['despachos', 'envíos', 'distribución', 'rutas'],
    idealProfile: {
      disc: { D: 60, I: 55, S: 60, C: 80 },
      drivingForces: { practico: 90, estructurado: 85, armonioso: 70 },
      eqFocus: ['organización', 'coordinación'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'COORDINATION', 'TIME_MANAGEMENT'],
    },
  },
  {
    id: 'customs_broker',
    title: 'Agente de Aduanas',
    titleEn: 'Customs Broker',
    category: 'LOGISTICA_CADENA',
    subcategory: 'Comercio Exterior',
    synonyms: ['Despachante de Aduanas', 'Customs Agent', 'Trade Compliance'],
    keywords: ['aduanas', 'importación', 'exportación', 'aranceles'],
    idealProfile: {
      disc: { D: 55, I: 55, S: 55, C: 95 },
      drivingForces: { estructurado: 95, practico: 85, intelectual: 75 },
      eqFocus: ['conocimiento técnico', 'relaciones'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'TECHNICAL_KNOWLEDGE', 'RELATIONSHIP_BUILDING'],
    },
  },
  {
    id: 'fleet_manager',
    title: 'Gerente de Flota',
    titleEn: 'Fleet Manager',
    category: 'LOGISTICA_CADENA',
    subcategory: 'Transporte',
    synonyms: ['Fleet Coordinator', 'Transportation Manager', 'Vehicle Manager'],
    keywords: ['flota', 'vehículos', 'transporte', 'mantenimiento'],
    idealProfile: {
      disc: { D: 70, I: 55, S: 55, C: 80 },
      drivingForces: { practico: 95, estructurado: 85, dominante: 70 },
      eqFocus: ['gestión', 'organización'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'LEADERSHIP', 'COST_MANAGEMENT'],
    },
  },
  {
    id: 'procurement_specialist',
    title: 'Especialista en Compras',
    titleEn: 'Procurement Specialist',
    category: 'LOGISTICA_CADENA',
    subcategory: 'Compras',
    synonyms: ['Strategic Buyer', 'Sourcing Specialist', 'Purchasing Agent'],
    keywords: ['compras', 'proveedores', 'negociación', 'abastecimiento'],
    idealProfile: {
      disc: { D: 65, I: 60, S: 50, C: 80 },
      drivingForces: { practico: 90, dominante: 75, estructurado: 75 },
      eqFocus: ['negociación', 'análisis'],
      dnaCompetencies: ['NEGOTIATION', 'ANALYTICAL_THINKING', 'RELATIONSHIP_BUILDING'],
    },
  },
  {
    id: 'demand_planner',
    title: 'Planificador de Demanda',
    titleEn: 'Demand Planner',
    category: 'LOGISTICA_CADENA',
    subcategory: 'Planeación',
    synonyms: ['Demand Forecaster', 'Supply Planner', 'S&OP Planner'],
    keywords: ['demanda', 'forecast', 'planeación', 's&op'],
    idealProfile: {
      disc: { D: 55, I: 45, S: 55, C: 95 },
      drivingForces: { intelectual: 90, practico: 85, estructurado: 85 },
      eqFocus: ['análisis', 'precisión'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'FORECASTING', 'ATTENTION_TO_DETAIL'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - LEGAL
  // ============================================
  {
    id: 'paralegal',
    title: 'Paralegal',
    titleEn: 'Paralegal',
    category: 'LEGAL_CUMPLIMIENTO',
    subcategory: 'Asistencia Legal',
    synonyms: ['Asistente Legal', 'Legal Assistant', 'Legal Secretary'],
    keywords: ['paralegal', 'documentos legales', 'investigación', 'contratos'],
    idealProfile: {
      disc: { D: 45, I: 50, S: 70, C: 95 },
      drivingForces: { estructurado: 95, practico: 85, intelectual: 75 },
      eqFocus: ['organización', 'atención al detalle'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ACCURACY', 'RESEARCH_SKILLS'],
    },
  },
  {
    id: 'data_privacy_officer',
    title: 'Oficial de Privacidad de Datos',
    titleEn: 'Data Privacy Officer',
    category: 'LEGAL_CUMPLIMIENTO',
    subcategory: 'Privacidad',
    synonyms: ['DPO', 'Privacy Manager', 'GDPR Officer'],
    keywords: ['privacidad', 'datos', 'gdpr', 'protección'],
    idealProfile: {
      disc: { D: 60, I: 55, S: 55, C: 90 },
      drivingForces: { estructurado: 95, intelectual: 85, practico: 75 },
      eqFocus: ['análisis', 'comunicación'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ANALYTICAL_THINKING', 'INFLUENCE'],
    },
  },
  {
    id: 'ip_attorney',
    title: 'Abogado de Propiedad Intelectual',
    titleEn: 'IP Attorney',
    category: 'LEGAL_CUMPLIMIENTO',
    subcategory: 'Propiedad Intelectual',
    synonyms: ['Patent Attorney', 'Trademark Attorney', 'IP Counsel'],
    keywords: ['patentes', 'marcas', 'propiedad intelectual', 'derechos de autor'],
    idealProfile: {
      disc: { D: 60, I: 55, S: 50, C: 95 },
      drivingForces: { intelectual: 95, estructurado: 90, practico: 75 },
      eqFocus: ['análisis', 'creatividad legal'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'CREATIVITY'],
    },
  },
  {
    id: 'ethics_officer',
    title: 'Oficial de Ética',
    titleEn: 'Ethics Officer',
    category: 'LEGAL_CUMPLIMIENTO',
    subcategory: 'Ética Corporativa',
    synonyms: ['Chief Ethics Officer', 'Integrity Officer'],
    keywords: ['ética', 'integridad', 'valores', 'conducta'],
    idealProfile: {
      disc: { D: 60, I: 65, S: 60, C: 80 },
      drivingForces: { benevolo: 95, altruista: 90, estructurado: 80 },
      eqFocus: ['integridad', 'comunicación', 'influencia'],
      dnaCompetencies: ['INTEGRITY', 'INFLUENCE', 'CONFLICT_MANAGEMENT'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - EDUCACIÓN
  // ============================================
  {
    id: 'academic_coordinator',
    title: 'Coordinador Académico',
    titleEn: 'Academic Coordinator',
    category: 'EDUCACION_FORMACION',
    subcategory: 'Gestión Educativa',
    synonyms: ['Academic Director', 'Curriculum Coordinator'],
    keywords: ['académico', 'currículo', 'profesores', 'programas'],
    idealProfile: {
      disc: { D: 60, I: 70, S: 65, C: 70 },
      drivingForces: { altruista: 90, intelectual: 85, estructurado: 75 },
      eqFocus: ['liderazgo', 'comunicación'],
      dnaCompetencies: ['LEADERSHIP', 'PLANNING_ORGANIZATION', 'DEVELOPING_OTHERS'],
    },
  },
  {
    id: 'elearning_developer',
    title: 'Desarrollador E-Learning',
    titleEn: 'E-Learning Developer',
    category: 'EDUCACION_FORMACION',
    subcategory: 'Tecnología Educativa',
    synonyms: ['LMS Administrator', 'Learning Technology Specialist', 'Course Developer'],
    keywords: ['elearning', 'cursos online', 'lms', 'moodle'],
    idealProfile: {
      disc: { D: 50, I: 55, S: 60, C: 85 },
      drivingForces: { intelectual: 85, receptivo: 80, practico: 75 },
      eqFocus: ['creatividad', 'tecnología'],
      dnaCompetencies: ['CREATIVITY', 'TECHNICAL_KNOWLEDGE', 'INSTRUCTIONAL_DESIGN'],
    },
  },
  {
    id: 'school_counselor',
    title: 'Orientador Escolar',
    titleEn: 'School Counselor',
    category: 'EDUCACION_FORMACION',
    subcategory: 'Orientación',
    synonyms: ['Student Counselor', 'Academic Advisor', 'Guidance Counselor'],
    keywords: ['orientación', 'estudiantes', 'consejería', 'apoyo'],
    idealProfile: {
      disc: { D: 45, I: 75, S: 80, C: 60 },
      drivingForces: { altruista: 95, benevolo: 90, armonioso: 85 },
      eqFocus: ['empatía', 'escucha activa'],
      dnaCompetencies: ['INTERPERSONAL_SKILLS', 'EMPATHY', 'CONFLICT_MANAGEMENT'],
    },
  },
  {
    id: 'tutoring_specialist',
    title: 'Tutor Académico',
    titleEn: 'Tutoring Specialist',
    category: 'EDUCACION_FORMACION',
    subcategory: 'Apoyo Académico',
    synonyms: ['Academic Tutor', 'Private Tutor', 'Subject Tutor'],
    keywords: ['tutoría', 'refuerzo', 'enseñanza', 'estudiantes'],
    idealProfile: {
      disc: { D: 45, I: 70, S: 80, C: 70 },
      drivingForces: { altruista: 95, intelectual: 85, benevolo: 80 },
      eqFocus: ['paciencia', 'comunicación'],
      dnaCompetencies: ['PATIENCE', 'VERBAL_COMMUNICATION', 'DEVELOPING_OTHERS'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - INGENIERÍA
  // ============================================
  {
    id: 'environmental_engineer',
    title: 'Ingeniero Ambiental',
    titleEn: 'Environmental Engineer',
    category: 'INGENIERIA',
    subcategory: 'Ambiental',
    synonyms: ['Environmental Consultant', 'Sustainability Engineer'],
    keywords: ['ambiental', 'sostenibilidad', 'medio ambiente', 'residuos'],
    idealProfile: {
      disc: { D: 55, I: 55, S: 60, C: 90 },
      drivingForces: { intelectual: 90, altruista: 85, practico: 75 },
      eqFocus: ['análisis', 'responsabilidad social'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ENVIRONMENTAL_AWARENESS', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'biomedical_engineer',
    title: 'Ingeniero Biomédico',
    titleEn: 'Biomedical Engineer',
    category: 'INGENIERIA',
    subcategory: 'Biomédica',
    synonyms: ['Clinical Engineer', 'Medical Device Engineer'],
    keywords: ['biomédica', 'dispositivos médicos', 'equipos', 'salud'],
    idealProfile: {
      disc: { D: 55, I: 50, S: 55, C: 95 },
      drivingForces: { intelectual: 95, practico: 85, altruista: 75 },
      eqFocus: ['precisión', 'innovación'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'CREATIVITY'],
    },
  },
  {
    id: 'automation_engineer',
    title: 'Ingeniero de Automatización',
    titleEn: 'Automation Engineer',
    category: 'INGENIERIA',
    subcategory: 'Control y Automatización',
    synonyms: ['PLC Programmer', 'Controls Engineer', 'Industrial Automation'],
    keywords: ['automatización', 'plc', 'scada', 'control', 'robótica'],
    idealProfile: {
      disc: { D: 60, I: 45, S: 55, C: 95 },
      drivingForces: { intelectual: 95, practico: 90, estructurado: 80 },
      eqFocus: ['resolución de problemas', 'análisis'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'TECHNICAL_KNOWLEDGE', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'structural_engineer',
    title: 'Ingeniero Estructural',
    titleEn: 'Structural Engineer',
    category: 'INGENIERIA',
    subcategory: 'Estructural',
    synonyms: ['Structural Designer', 'Bridge Engineer'],
    keywords: ['estructural', 'cálculo', 'edificios', 'puentes'],
    idealProfile: {
      disc: { D: 55, I: 40, S: 55, C: 95 },
      drivingForces: { intelectual: 95, practico: 85, estructurado: 85 },
      eqFocus: ['precisión', 'análisis'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'TECHNICAL_KNOWLEDGE'],
    },
  },
  {
    id: 'petroleum_engineer',
    title: 'Ingeniero de Petróleos',
    titleEn: 'Petroleum Engineer',
    category: 'INGENIERIA',
    subcategory: 'Petróleo y Gas',
    synonyms: ['Oil & Gas Engineer', 'Reservoir Engineer', 'Drilling Engineer'],
    keywords: ['petróleo', 'gas', 'perforación', 'yacimientos'],
    idealProfile: {
      disc: { D: 65, I: 45, S: 50, C: 95 },
      drivingForces: { intelectual: 90, practico: 90, dominante: 70 },
      eqFocus: ['análisis técnico', 'toma de decisiones'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'DECISION_MAKING', 'TECHNICAL_KNOWLEDGE'],
    },
  },
  {
    id: 'robotics_engineer',
    title: 'Ingeniero en Robótica',
    titleEn: 'Robotics Engineer',
    category: 'INGENIERIA',
    subcategory: 'Robótica',
    synonyms: ['Robot Programmer', 'Automation Robotics Engineer'],
    keywords: ['robótica', 'robots', 'automatización', 'programación'],
    idealProfile: {
      disc: { D: 60, I: 50, S: 50, C: 95 },
      drivingForces: { intelectual: 95, practico: 85, receptivo: 85 },
      eqFocus: ['innovación', 'resolución de problemas'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'CREATIVITY', 'TECHNICAL_KNOWLEDGE'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - ATENCIÓN AL CLIENTE
  // ============================================
  {
    id: 'technical_support',
    title: 'Soporte Técnico',
    titleEn: 'Technical Support Specialist',
    category: 'ATENCION_CLIENTE',
    subcategory: 'Soporte',
    synonyms: ['Help Desk', 'IT Support', 'Technical Support Agent'],
    keywords: ['soporte', 'técnico', 'help desk', 'tickets'],
    idealProfile: {
      disc: { D: 50, I: 60, S: 70, C: 80 },
      drivingForces: { practico: 85, altruista: 80, intelectual: 70 },
      eqFocus: ['paciencia', 'comunicación técnica'],
      dnaCompetencies: ['TECHNICAL_KNOWLEDGE', 'VERBAL_COMMUNICATION', 'PATIENCE'],
    },
  },
  {
    id: 'customer_experience',
    title: 'Especialista en Experiencia del Cliente',
    titleEn: 'Customer Experience Specialist',
    category: 'ATENCION_CLIENTE',
    subcategory: 'Experiencia',
    synonyms: ['CX Specialist', 'Client Experience Manager', 'Journey Specialist'],
    keywords: ['experiencia cliente', 'cx', 'journey', 'satisfacción'],
    idealProfile: {
      disc: { D: 55, I: 80, S: 65, C: 65 },
      drivingForces: { altruista: 90, receptivo: 85, armonioso: 80 },
      eqFocus: ['empatía', 'creatividad', 'análisis'],
      dnaCompetencies: ['INTERPERSONAL_SKILLS', 'ANALYTICAL_THINKING', 'CREATIVITY'],
    },
  },
  {
    id: 'customer_retention',
    title: 'Especialista en Retención de Clientes',
    titleEn: 'Customer Retention Specialist',
    category: 'ATENCION_CLIENTE',
    subcategory: 'Retención',
    synonyms: ['Retention Agent', 'Loyalty Specialist', 'Churn Prevention'],
    keywords: ['retención', 'fidelización', 'clientes', 'churn'],
    idealProfile: {
      disc: { D: 65, I: 80, S: 55, C: 60 },
      drivingForces: { altruista: 85, practico: 80, dominante: 70 },
      eqFocus: ['persuasión', 'empatía', 'negociación'],
      dnaCompetencies: ['INFLUENCE', 'INTERPERSONAL_SKILLS', 'NEGOTIATION'],
    },
  },
  {
    id: 'chat_support',
    title: 'Agente de Chat',
    titleEn: 'Chat Support Agent',
    category: 'ATENCION_CLIENTE',
    subcategory: 'Soporte Digital',
    synonyms: ['Live Chat Agent', 'Online Support', 'Digital Support'],
    keywords: ['chat', 'soporte online', 'mensajería', 'clientes'],
    idealProfile: {
      disc: { D: 50, I: 70, S: 70, C: 70 },
      drivingForces: { altruista: 85, armonioso: 80, practico: 75 },
      eqFocus: ['comunicación escrita', 'multitasking'],
      dnaCompetencies: ['WRITTEN_COMMUNICATION', 'MULTITASKING', 'PATIENCE'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - CREATIVOS
  // ============================================
  {
    id: 'motion_designer',
    title: 'Diseñador de Motion Graphics',
    titleEn: 'Motion Designer',
    category: 'CREATIVOS_DISENO',
    subcategory: 'Animación',
    synonyms: ['Motion Graphics Artist', 'Animator', 'After Effects Artist'],
    keywords: ['motion graphics', 'animación', 'after effects', 'video'],
    idealProfile: {
      disc: { D: 50, I: 65, S: 55, C: 85 },
      drivingForces: { receptivo: 95, intelectual: 80, practico: 75 },
      eqFocus: ['creatividad', 'atención al detalle'],
      dnaCompetencies: ['CREATIVITY', 'ATTENTION_TO_DETAIL', 'TECHNICAL_KNOWLEDGE'],
    },
  },
  {
    id: 'art_director',
    title: 'Director de Arte',
    titleEn: 'Art Director',
    category: 'CREATIVOS_DISENO',
    subcategory: 'Dirección Creativa',
    synonyms: ['Visual Director', 'AD', 'Creative Lead'],
    keywords: ['arte', 'dirección visual', 'creatividad', 'campañas'],
    idealProfile: {
      disc: { D: 70, I: 75, S: 45, C: 70 },
      drivingForces: { receptivo: 95, dominante: 75, intelectual: 75 },
      eqFocus: ['visión creativa', 'liderazgo'],
      dnaCompetencies: ['CREATIVITY', 'LEADERSHIP', 'INFLUENCE'],
    },
  },
  {
    id: 'product_designer',
    title: 'Diseñador de Producto',
    titleEn: 'Product Designer',
    category: 'CREATIVOS_DISENO',
    subcategory: 'Diseño Digital',
    synonyms: ['Digital Product Designer', 'UX/UI Designer'],
    keywords: ['producto digital', 'ux', 'ui', 'diseño', 'apps'],
    idealProfile: {
      disc: { D: 55, I: 65, S: 55, C: 85 },
      drivingForces: { receptivo: 90, intelectual: 85, practico: 75 },
      eqFocus: ['empatía con usuario', 'creatividad'],
      dnaCompetencies: ['CREATIVITY', 'ANALYTICAL_THINKING', 'USER_EMPATHY'],
    },
  },
  {
    id: 'brand_designer',
    title: 'Diseñador de Marca',
    titleEn: 'Brand Designer',
    category: 'CREATIVOS_DISENO',
    subcategory: 'Identidad Visual',
    synonyms: ['Identity Designer', 'Logo Designer', 'Visual Identity Designer'],
    keywords: ['marca', 'branding', 'identidad', 'logotipos'],
    idealProfile: {
      disc: { D: 55, I: 65, S: 55, C: 85 },
      drivingForces: { receptivo: 95, intelectual: 80, practico: 70 },
      eqFocus: ['creatividad', 'visión estratégica'],
      dnaCompetencies: ['CREATIVITY', 'STRATEGIC_THINKING', 'ATTENTION_TO_DETAIL'],
    },
  },
  {
    id: 'sound_designer',
    title: 'Diseñador de Sonido',
    titleEn: 'Sound Designer',
    category: 'CREATIVOS_DISENO',
    subcategory: 'Audio',
    synonyms: ['Audio Designer', 'Sound Engineer', 'Audio Producer'],
    keywords: ['sonido', 'audio', 'música', 'podcast', 'efectos'],
    idealProfile: {
      disc: { D: 45, I: 55, S: 60, C: 90 },
      drivingForces: { receptivo: 95, intelectual: 85, practico: 70 },
      eqFocus: ['creatividad', 'atención al detalle'],
      dnaCompetencies: ['CREATIVITY', 'ATTENTION_TO_DETAIL', 'TECHNICAL_KNOWLEDGE'],
    },
  },
  {
    id: 'three_d_artist',
    title: 'Artista 3D',
    titleEn: '3D Artist',
    category: 'CREATIVOS_DISENO',
    subcategory: 'Modelado 3D',
    synonyms: ['3D Modeler', 'CGI Artist', '3D Designer'],
    keywords: ['3d', 'modelado', 'render', 'blender', 'maya'],
    idealProfile: {
      disc: { D: 50, I: 50, S: 60, C: 90 },
      drivingForces: { receptivo: 95, intelectual: 85, practico: 75 },
      eqFocus: ['creatividad', 'paciencia'],
      dnaCompetencies: ['CREATIVITY', 'ATTENTION_TO_DETAIL', 'TECHNICAL_KNOWLEDGE'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - CONSTRUCCIÓN
  // ============================================
  {
    id: 'safety_officer',
    title: 'Oficial de Seguridad en Obra',
    titleEn: 'Construction Safety Officer',
    category: 'CONSTRUCCION_INMOBILIARIA',
    subcategory: 'Seguridad',
    synonyms: ['HSE Officer', 'Site Safety Coordinator', 'Safety Inspector'],
    keywords: ['seguridad', 'obra', 'construcción', 'prevención'],
    idealProfile: {
      disc: { D: 65, I: 55, S: 55, C: 90 },
      drivingForces: { estructurado: 95, practico: 85, altruista: 75 },
      eqFocus: ['comunicación', 'firmeza'],
      dnaCompetencies: ['SAFETY_AWARENESS', 'ATTENTION_TO_DETAIL', 'INFLUENCE'],
    },
  },
  {
    id: 'bim_coordinator',
    title: 'Coordinador BIM',
    titleEn: 'BIM Coordinator',
    category: 'CONSTRUCCION_INMOBILIARIA',
    subcategory: 'Tecnología',
    synonyms: ['BIM Manager', 'BIM Modeler', 'Revit Specialist'],
    keywords: ['bim', 'revit', 'modelado', 'construcción digital'],
    idealProfile: {
      disc: { D: 55, I: 50, S: 55, C: 95 },
      drivingForces: { intelectual: 90, practico: 85, estructurado: 85 },
      eqFocus: ['análisis', 'coordinación'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'TECHNICAL_KNOWLEDGE', 'COORDINATION'],
    },
  },
  {
    id: 'quantity_surveyor',
    title: 'Analista de Costos de Construcción',
    titleEn: 'Quantity Surveyor',
    category: 'CONSTRUCCION_INMOBILIARIA',
    subcategory: 'Costos',
    synonyms: ['Cost Estimator', 'Presupuestista', 'Construction Estimator'],
    keywords: ['costos', 'presupuesto', 'construcción', 'cantidades'],
    idealProfile: {
      disc: { D: 55, I: 45, S: 55, C: 95 },
      drivingForces: { practico: 95, estructurado: 90, intelectual: 75 },
      eqFocus: ['precisión', 'análisis'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'ATTENTION_TO_DETAIL', 'ACCURACY'],
    },
  },
  {
    id: 'land_surveyor',
    title: 'Topógrafo',
    titleEn: 'Land Surveyor',
    category: 'CONSTRUCCION_INMOBILIARIA',
    subcategory: 'Topografía',
    synonyms: ['Surveyor', 'Geomatics Technician', 'Survey Engineer'],
    keywords: ['topografía', 'medición', 'terrenos', 'levantamiento'],
    idealProfile: {
      disc: { D: 50, I: 40, S: 60, C: 95 },
      drivingForces: { practico: 95, estructurado: 85, intelectual: 75 },
      eqFocus: ['precisión', 'trabajo de campo'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'TECHNICAL_KNOWLEDGE', 'ACCURACY'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - TURISMO Y HOTELERÍA
  // ============================================
  {
    id: 'concierge',
    title: 'Concierge',
    titleEn: 'Concierge',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Atención al Huésped',
    synonyms: ['Guest Services', 'Bell Captain', 'Guest Relations'],
    keywords: ['concierge', 'huéspedes', 'recomendaciones', 'servicio'],
    idealProfile: {
      disc: { D: 50, I: 85, S: 70, C: 55 },
      drivingForces: { altruista: 95, armonioso: 85, receptivo: 80 },
      eqFocus: ['servicio', 'comunicación', 'conocimiento local'],
      dnaCompetencies: ['INTERPERSONAL_SKILLS', 'VERBAL_COMMUNICATION', 'PROBLEM_SOLVING'],
    },
  },
  {
    id: 'housekeeping_supervisor',
    title: 'Supervisor de Housekeeping',
    titleEn: 'Housekeeping Supervisor',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Habitaciones',
    synonyms: ['Ama de Llaves', 'Rooms Supervisor', 'Housekeeping Manager'],
    keywords: ['housekeeping', 'limpieza', 'habitaciones', 'supervisión'],
    idealProfile: {
      disc: { D: 65, I: 55, S: 65, C: 80 },
      drivingForces: { practico: 90, estructurado: 85, armonioso: 70 },
      eqFocus: ['liderazgo', 'organización'],
      dnaCompetencies: ['LEADERSHIP', 'ATTENTION_TO_DETAIL', 'TIME_MANAGEMENT'],
    },
  },
  {
    id: 'sommelier',
    title: 'Sommelier',
    titleEn: 'Sommelier',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Alimentos y Bebidas',
    synonyms: ['Wine Expert', 'Wine Steward', 'Wine Director'],
    keywords: ['vino', 'sommelier', 'maridaje', 'cata'],
    idealProfile: {
      disc: { D: 50, I: 80, S: 60, C: 75 },
      drivingForces: { receptivo: 95, intelectual: 85, armonioso: 75 },
      eqFocus: ['conocimiento', 'servicio', 'comunicación'],
      dnaCompetencies: ['TECHNICAL_KNOWLEDGE', 'VERBAL_COMMUNICATION', 'INTERPERSONAL_SKILLS'],
    },
  },
  {
    id: 'revenue_manager',
    title: 'Revenue Manager',
    titleEn: 'Revenue Manager',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Comercial',
    synonyms: ['Yield Manager', 'Pricing Manager', 'Revenue Analyst'],
    keywords: ['revenue', 'tarifas', 'ocupación', 'pricing'],
    idealProfile: {
      disc: { D: 65, I: 50, S: 50, C: 95 },
      drivingForces: { practico: 95, intelectual: 85, estructurado: 80 },
      eqFocus: ['análisis', 'estrategia'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'STRATEGIC_THINKING', 'DECISION_MAKING'],
    },
  },
  {
    id: 'spa_manager',
    title: 'Gerente de Spa',
    titleEn: 'Spa Manager',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Bienestar',
    synonyms: ['Wellness Manager', 'Spa Director', 'Spa Supervisor'],
    keywords: ['spa', 'bienestar', 'wellness', 'relajación'],
    idealProfile: {
      disc: { D: 60, I: 75, S: 70, C: 60 },
      drivingForces: { altruista: 90, armonioso: 85, practico: 75 },
      eqFocus: ['servicio', 'liderazgo', 'bienestar'],
      dnaCompetencies: ['LEADERSHIP', 'INTERPERSONAL_SKILLS', 'CUSTOMER_FOCUS'],
    },
  },
  {
    id: 'bartender',
    title: 'Bartender',
    titleEn: 'Bartender',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Alimentos y Bebidas',
    synonyms: ['Barman', 'Mixologist', 'Coctelero'],
    keywords: ['bar', 'cócteles', 'bebidas', 'mixología'],
    idealProfile: {
      disc: { D: 55, I: 85, S: 55, C: 65 },
      drivingForces: { receptivo: 90, armonioso: 80, altruista: 75 },
      eqFocus: ['creatividad', 'servicio', 'comunicación'],
      dnaCompetencies: ['CREATIVITY', 'INTERPERSONAL_SKILLS', 'MANUAL_DEXTERITY'],
    },
  },
  {
    id: 'catering_manager',
    title: 'Gerente de Catering',
    titleEn: 'Catering Manager',
    category: 'TURISMO_HOTELERIA',
    subcategory: 'Eventos',
    synonyms: ['Banquet Manager', 'Events Catering Manager'],
    keywords: ['catering', 'banquetes', 'eventos', 'alimentos'],
    idealProfile: {
      disc: { D: 70, I: 70, S: 55, C: 70 },
      drivingForces: { practico: 90, armonioso: 80, dominante: 70 },
      eqFocus: ['organización', 'liderazgo', 'servicio'],
      dnaCompetencies: ['PLANNING_ORGANIZATION', 'LEADERSHIP', 'CUSTOMER_FOCUS'],
    },
  },

  // ============================================
  // NUEVOS CARGOS - AGRICULTURA
  // ============================================
  {
    id: 'agricultural_technician',
    title: 'Técnico Agrícola',
    titleEn: 'Agricultural Technician',
    category: 'AGRICULTURA_AGROINDUSTRIA',
    subcategory: 'Producción',
    synonyms: ['Farm Technician', 'Crop Technician', 'Field Technician'],
    keywords: ['agricultura', 'cultivos', 'campo', 'siembra'],
    idealProfile: {
      disc: { D: 50, I: 45, S: 70, C: 85 },
      drivingForces: { practico: 95, estructurado: 80, intelectual: 70 },
      eqFocus: ['trabajo de campo', 'conocimiento técnico'],
      dnaCompetencies: ['TECHNICAL_KNOWLEDGE', 'ATTENTION_TO_DETAIL', 'PHYSICAL_STAMINA'],
    },
  },
  {
    id: 'food_scientist',
    title: 'Científico de Alimentos',
    titleEn: 'Food Scientist',
    category: 'AGRICULTURA_AGROINDUSTRIA',
    subcategory: 'Investigación',
    synonyms: ['Food Technologist', 'R&D Food Scientist', 'Product Developer Food'],
    keywords: ['alimentos', 'desarrollo', 'investigación', 'nutrición'],
    idealProfile: {
      disc: { D: 55, I: 50, S: 55, C: 95 },
      drivingForces: { intelectual: 95, practico: 85, receptivo: 75 },
      eqFocus: ['innovación', 'análisis'],
      dnaCompetencies: ['ANALYTICAL_THINKING', 'CREATIVITY', 'TECHNICAL_KNOWLEDGE'],
    },
  },
  {
    id: 'quality_control_food',
    title: 'Control de Calidad Alimentos',
    titleEn: 'Food Quality Control Specialist',
    category: 'AGRICULTURA_AGROINDUSTRIA',
    subcategory: 'Calidad',
    synonyms: ['QC Analyst Food', 'Food Safety Specialist', 'HACCP Coordinator'],
    keywords: ['calidad', 'alimentos', 'haccp', 'seguridad alimentaria'],
    idealProfile: {
      disc: { D: 55, I: 45, S: 60, C: 95 },
      drivingForces: { estructurado: 95, practico: 85, intelectual: 75 },
      eqFocus: ['precisión', 'cumplimiento'],
      dnaCompetencies: ['ATTENTION_TO_DETAIL', 'ACCURACY', 'REGULATORY_COMPLIANCE'],
    },
  },
  {
    id: 'sustainability_manager',
    title: 'Gerente de Sostenibilidad',
    titleEn: 'Sustainability Manager',
    category: 'AGRICULTURA_AGROINDUSTRIA',
    subcategory: 'Sostenibilidad',
    synonyms: ['CSR Manager', 'Environmental Manager', 'ESG Manager'],
    keywords: ['sostenibilidad', 'medio ambiente', 'esg', 'responsabilidad social'],
    idealProfile: {
      disc: { D: 60, I: 70, S: 55, C: 75 },
      drivingForces: { altruista: 95, intelectual: 85, benevolo: 80 },
      eqFocus: ['visión estratégica', 'influencia', 'comunicación'],
      dnaCompetencies: ['STRATEGIC_THINKING', 'INFLUENCE', 'ENVIRONMENTAL_AWARENESS'],
    },
  },
];

// ============================================
// FUNCIONES DE BÚSQUEDA Y UTILIDADES
// ============================================

/**
 * Normaliza texto para búsqueda (elimina acentos y convierte a minúsculas)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Busca cargos con autocompletado y sinónimos
 */
export function searchJobPositions(query: string, limit: number = 20): JobPosition[] {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = normalizeText(query);
  const terms = normalizedQuery.split(/\s+/);
  
  const scored = JOB_POSITIONS.map(position => {
    let score = 0;
    
    const normalizedTitle = normalizeText(position.title);
    const normalizedTitleEn = position.titleEn ? normalizeText(position.titleEn) : '';
    const normalizedSynonyms = position.synonyms.map(s => normalizeText(s));
    const normalizedKeywords = position.keywords.map(k => normalizeText(k));
    
    // Exact match on title (highest priority)
    if (normalizedTitle === normalizedQuery) score += 100;
    else if (normalizedTitle.startsWith(normalizedQuery)) score += 80;
    else if (normalizedTitle.includes(normalizedQuery)) score += 60;
    
    // English title match
    if (normalizedTitleEn === normalizedQuery) score += 90;
    else if (normalizedTitleEn.startsWith(normalizedQuery)) score += 70;
    else if (normalizedTitleEn.includes(normalizedQuery)) score += 50;
    
    // Synonym match
    for (const synonym of normalizedSynonyms) {
      if (synonym === normalizedQuery) score += 85;
      else if (synonym.startsWith(normalizedQuery)) score += 65;
      else if (synonym.includes(normalizedQuery)) score += 45;
    }
    
    // Keyword match
    for (const keyword of normalizedKeywords) {
      if (keyword === normalizedQuery) score += 40;
      else if (keyword.startsWith(normalizedQuery)) score += 30;
      else if (keyword.includes(normalizedQuery)) score += 20;
    }
    
    // Multi-term search (all terms must match somewhere)
    if (terms.length > 1) {
      const allText = [
        normalizedTitle,
        normalizedTitleEn,
        ...normalizedSynonyms,
        ...normalizedKeywords,
      ].join(' ');
      
      const allTermsMatch = terms.every(term => allText.includes(term));
      if (allTermsMatch) score += 50;
    }
    
    return { position, score };
  });
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.position);
}

/**
 * Obtiene cargos por categoría
 */
export function getJobPositionsByCategory(category: JobCategory): JobPosition[] {
  return JOB_POSITIONS.filter(p => p.category === category);
}

/**
 * Obtiene un cargo por ID
 */
export function getJobPositionById(id: string): JobPosition | undefined {
  return JOB_POSITIONS.find(p => p.id === id);
}

/**
 * Obtiene sugerencias de cargos relacionados
 */
export function getSuggestedPositions(position: JobPosition, limit: number = 5): JobPosition[] {
  return JOB_POSITIONS
    .filter(p => p.id !== position.id && p.category === position.category)
    .slice(0, limit);
}

/**
 * Obtiene las categorías más populares
 */
export function getPopularCategories(): { category: JobCategory; count: number }[] {
  const counts: Record<string, number> = {};
  
  for (const position of JOB_POSITIONS) {
    counts[position.category] = (counts[position.category] || 0) + 1;
  }
  
  return Object.entries(counts)
    .map(([category, count]) => ({ category: category as JobCategory, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Obtiene todos los cargos agrupados por categoría
 */
export function getAllJobPositionsGrouped(): Record<JobCategory, JobPosition[]> {
  const grouped: Partial<Record<JobCategory, JobPosition[]>> = {};
  
  for (const position of JOB_POSITIONS) {
    if (!grouped[position.category]) {
      grouped[position.category] = [];
    }
    grouped[position.category]!.push(position);
  }
  
  return grouped as Record<JobCategory, JobPosition[]>;
}
