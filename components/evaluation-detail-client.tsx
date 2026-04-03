'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language-context';
import {
  Target,
  Flame,
  Heart,
  Dna,
  Compass,
  Shield,
  Activity,
  Clock,
  FileText,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lightbulb,
  MessageSquare,
  Users,
  Briefcase,
  BarChart3,
  BookOpen,
  FileCode
} from 'lucide-react';

interface EvaluationDetailClientProps {
  slug: string;
}

const iconMap: Record<string, any> = {
  Target, Flame, Heart, Dna, Compass, Shield, Activity,
  Users, Briefcase, BarChart3, BookOpen, MessageSquare, Lightbulb, FileCode
};

// Evaluation data for both languages
const evaluationsData: Record<string, Record<'es' | 'en', any>> = {
  'disc': {
    es: {
      name: 'DISC',
      fullName: 'Análisis de Comportamiento DISC',
      icon: 'Target',
      color: 'indigo',
      gradient: 'from-indigo-500 to-blue-600',
      bgGradient: 'from-indigo-50 to-blue-50',
      duration: '10-15 minutos',
      questions: 24,
      description: 'Evalúa cómo las personas responden a problemas, influyen en otros, responden al ritmo del entorno y cómo responden a reglas y procedimientos.',
      longDescription: `El modelo DISC es una herramienta de evaluación del comportamiento que clasifica las tendencias conductuales en cuatro dimensiones principales. Desarrollado originalmente por William Moulton Marston en la década de 1920, ha evolucionado para convertirse en uno de los instrumentos más utilizados en el ámbito empresarial y del desarrollo personal.

Esta evaluación no mide inteligencia, aptitudes o valores, sino que identifica patrones de comportamiento observables que pueden ser adaptados según las circunstancias. Cada persona tiene una combinación única de las cuatro dimensiones, aunque generalmente una o dos son predominantes.

El DISC es especialmente útil para mejorar la comunicación interpersonal, formar equipos equilibrados y desarrollar estrategias de liderazgo adaptativas.`,
      dimensions: [
        { name: 'Dominancia (D)', color: 'bg-red-500', description: 'Énfasis en lograr resultados, confianza en sí mismo', traits: ['Directo', 'Decidido', 'Competitivo', 'Orientado a resultados'], characteristics: 'Las personas con alta D son directas, orientadas a resultados y les gusta tomar decisiones rápidas. Prefieren el control y los retos.' },
        { name: 'Influencia (I)', color: 'bg-yellow-500', description: 'Énfasis en influir o persuadir a otros, apertura', traits: ['Entusiasta', 'Optimista', 'Colaborativo', 'Expresivo'], characteristics: 'Las personas con alta I son entusiastas, optimistas y disfrutan trabajar con otros. Son excelentes comunicadores y motivadores.' },
        { name: 'Estabilidad (S)', color: 'bg-green-500', description: 'Énfasis en cooperación, sinceridad, dependencia', traits: ['Paciente', 'Confiable', 'Calmado', 'Buen oyente'], characteristics: 'Las personas con alta S son pacientes, confiables y excelentes oyentes. Valoran la estabilidad y el trabajo en equipo armonioso.' },
        { name: 'Cumplimiento (C)', color: 'bg-blue-500', description: 'Énfasis en calidad, precisión, experiencia', traits: ['Analítico', 'Preciso', 'Sistemático', 'Diplomático'], characteristics: 'Las personas con alta C son analíticas, precisas y orientadas a los detalles. Valoran la calidad y los procedimientos.' }
      ],
      useCases: [
        { title: 'Selección de Personal', description: 'Identificar candidatos cuyo estilo conductual se alinee con las demandas del puesto y la cultura organizacional.', icon: 'Users' },
        { title: 'Formación de Equipos', description: 'Crear equipos equilibrados combinando diferentes estilos para maximizar la efectividad grupal.', icon: 'Users' },
        { title: 'Desarrollo de Liderazgo', description: 'Ayudar a líderes a entender su estilo natural y adaptarlo según las necesidades del equipo.', icon: 'Briefcase' },
        { title: 'Mejora de Comunicación', description: 'Facilitar la comunicación efectiva al entender cómo cada persona prefiere recibir información.', icon: 'MessageSquare' }
      ],
      tips: [
        'No hay estilos "buenos" o "malos", cada uno tiene fortalezas únicas',
        'Las personas pueden adaptar su comportamiento según la situación',
        'Es más efectivo cuando se combina con otras evaluaciones de Reclu',
        'Los resultados deben usarse como punto de partida para conversaciones, no como etiquetas fijas'
      ],
      examples: [
        { scenario: 'Un gerente con alto D liderando un equipo de alto S', insight: 'Necesitará moderar su ritmo rápido y dar más tiempo al equipo para procesar cambios. Beneficiará de explicar el "por qué" detrás de las decisiones.' },
        { scenario: 'Un analista con alto C trabajando con ventas de alto I', insight: 'Pueden complementarse: C aporta rigor y datos, I aporta entusiasmo y relaciones. Clave: establecer expectativas claras de comunicación.' }
      ],
      faqs: [
        { question: '¿Cuánto tiempo toma completar la evaluación DISC?', answer: 'La evaluación DISC de Reclu toma entre 10-15 minutos. Consta de 24 preguntas diseñadas para capturar tus preferencias conductuales naturales.' },
        { question: '¿Puede cambiar mi perfil DISC con el tiempo?', answer: 'Tu perfil base tiende a ser estable, pero puedes desarrollar flexibilidad conductual. Las situaciones de estrés pueden revelar tu estilo más natural.' },
        { question: '¿El DISC mide inteligencia o competencias?', answer: 'No. El DISC mide preferencias de comportamiento, no capacidad intelectual ni competencias. Es cómo prefieres actuar, no qué puedes hacer.' }
      ]
    },
    en: {
      name: 'DISC',
      fullName: 'DISC Behavioral Analysis',
      icon: 'Target',
      color: 'indigo',
      gradient: 'from-indigo-500 to-blue-600',
      bgGradient: 'from-indigo-50 to-blue-50',
      duration: '10-15 minutes',
      questions: 24,
      description: 'Evaluates how people respond to problems, influence others, respond to the pace of the environment, and how they respond to rules and procedures.',
      longDescription: `The DISC model is a behavioral assessment tool that classifies behavioral tendencies into four main dimensions. Originally developed by William Moulton Marston in the 1920s, it has evolved to become one of the most widely used instruments in business and personal development.

This assessment does not measure intelligence, aptitudes, or values, but identifies observable behavior patterns that can be adapted according to circumstances. Each person has a unique combination of the four dimensions, although usually one or two are predominant.

DISC is especially useful for improving interpersonal communication, building balanced teams, and developing adaptive leadership strategies.`,
      dimensions: [
        { name: 'Dominance (D)', color: 'bg-red-500', description: 'Emphasis on achieving results, self-confidence', traits: ['Direct', 'Decisive', 'Competitive', 'Results-oriented'], characteristics: 'People with high D are direct, results-oriented and like to make quick decisions. They prefer control and challenges.' },
        { name: 'Influence (I)', color: 'bg-yellow-500', description: 'Emphasis on influencing or persuading others, openness', traits: ['Enthusiastic', 'Optimistic', 'Collaborative', 'Expressive'], characteristics: 'People with high I are enthusiastic, optimistic and enjoy working with others. They are excellent communicators and motivators.' },
        { name: 'Steadiness (S)', color: 'bg-green-500', description: 'Emphasis on cooperation, sincerity, dependability', traits: ['Patient', 'Reliable', 'Calm', 'Good listener'], characteristics: 'People with high S are patient, reliable and excellent listeners. They value stability and harmonious teamwork.' },
        { name: 'Conscientiousness (C)', color: 'bg-blue-500', description: 'Emphasis on quality, precision, expertise', traits: ['Analytical', 'Precise', 'Systematic', 'Diplomatic'], characteristics: 'People with high C are analytical, precise and detail-oriented. They value quality and procedures.' }
      ],
      useCases: [
        { title: 'Hiring', description: 'Identify candidates whose behavioral style aligns with job demands and organizational culture.', icon: 'Users' },
        { title: 'Team Building', description: 'Create balanced teams by combining different styles to maximize group effectiveness.', icon: 'Users' },
        { title: 'Leadership Development', description: 'Help leaders understand their natural style and adapt it to team needs.', icon: 'Briefcase' },
        { title: 'Communication Improvement', description: 'Facilitate effective communication by understanding how each person prefers to receive information.', icon: 'MessageSquare' }
      ],
      tips: [
        'There are no "good" or "bad" styles, each has unique strengths',
        'People can adapt their behavior depending on the situation',
        'It is more effective when combined with other Reclu assessments',
        'Results should be used as a starting point for conversations, not as fixed labels'
      ],
      examples: [
        { scenario: 'A high D manager leading a high S team', insight: 'Will need to moderate their fast pace and give more time for the team to process changes. Will benefit from explaining the "why" behind decisions.' },
        { scenario: 'A high C analyst working with high I sales', insight: 'They can complement each other: C brings rigor and data, I brings enthusiasm and relationships. Key: establish clear communication expectations.' }
      ],
      faqs: [
        { question: 'How long does the DISC assessment take?', answer: 'The Reclu DISC assessment takes between 10-15 minutes. It consists of 24 questions designed to capture your natural behavioral preferences.' },
        { question: 'Can my DISC profile change over time?', answer: 'Your base profile tends to be stable, but you can develop behavioral flexibility. Stressful situations may reveal your most natural style.' },
        { question: 'Does DISC measure intelligence or competencies?', answer: 'No. DISC measures behavioral preferences, not intellectual capacity or competencies. It is how you prefer to act, not what you can do.' }
      ]
    }
  },
  'fuerzas-motivadoras': {
    es: {
      name: 'Fuerzas Motivadoras',
      fullName: 'Análisis de Fuerzas Motivadoras',
      icon: 'Flame',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      duration: '15-20 minutos',
      questions: 36,
      description: 'Identifica los motivadores internos que impulsan las decisiones y acciones de una persona, revelando el "por qué" detrás del comportamiento.',
      longDescription: `Las Fuerzas Motivadoras van más allá del comportamiento observable para revelar las motivaciones internas que impulsan a las personas. Mientras que el DISC nos dice "cómo" actuamos, las Fuerzas Motivadoras revelan el "por qué" detrás de nuestras acciones.

Basado en la investigación del Dr. Eduard Spranger y refinado por TTI Success Insights, este modelo identifica 12 fuerzas motivadoras organizadas en 6 continuos. Cada continuo representa dos extremos de motivación opuestos pero igualmente válidos.

A diferencia de los valores tradicionales, las Fuerzas Motivadoras miden la intensidad de la pasión detrás de cada motivador. Una persona puede compartir el mismo valor que otra, pero estar motivada por él con diferente intensidad.

Esta evaluación es fundamental para entender qué impulsa el compromiso, la satisfacción laboral y las decisiones de carrera de cada persona.`,
      dimensions: [
        { name: 'Intelectual', color: 'bg-blue-600', description: 'Motivación por el conocimiento teórico, la investigación y el descubrimiento de la verdad', traits: ['Curiosidad intelectual', 'Investigación', 'Pensamiento abstracto', 'Aprendizaje continuo'], characteristics: 'Las personas con alta motivación Intelectual son impulsadas por la búsqueda del conocimiento por sí mismo. Disfrutan aprender, investigar y descubrir la verdad. Prefieren ambientes que estimulen el pensamiento y la reflexión.' },
        { name: 'Instintivo', color: 'bg-emerald-500', description: 'Motivación por la experiencia práctica, lo tangible y el conocimiento aplicado', traits: ['Pragmatismo', 'Experiencia directa', 'Intuición', 'Acción inmediata'], characteristics: 'Las personas con alta motivación Instintiva valoran el aprendizaje a través de la experiencia. Prefieren el conocimiento práctico y aplicable sobre la teoría abstracta. Confían en su intuición y experiencias pasadas.' },
        { name: 'Utilitario', color: 'bg-green-600', description: 'Motivación por el retorno de inversión, la eficiencia y los resultados económicos', traits: ['ROI', 'Eficiencia', 'Practicidad', 'Inversión estratégica'], characteristics: 'Las personas con alta motivación Utilitaria buscan maximizar el retorno de su tiempo, recursos y esfuerzos. Son conscientes del valor económico de las cosas y toman decisiones basadas en el beneficio tangible.' },
        { name: 'Altruista', color: 'bg-pink-500', description: 'Motivación por ayudar a otros sin esperar retribución, servicio desinteresado', traits: ['Servicio', 'Generosidad', 'Empatía', 'Impacto social'], characteristics: 'Las personas con alta motivación Altruista son impulsadas por el deseo de ayudar a otros. Encuentran satisfacción en el servicio desinteresado y se preocupan genuinamente por el bienestar de los demás.' },
        { name: 'Individualista', color: 'bg-amber-600', description: 'Motivación por destacar, liderar y ser reconocido como único o especial', traits: ['Liderazgo', 'Independencia', 'Reconocimiento', 'Singularidad'], characteristics: 'Las personas con alta motivación Individualista buscan destacar y ser reconocidas por sus logros únicos. Valoran la autonomía y la independencia, y disfrutan posiciones de influencia y liderazgo.' },
        { name: 'Igualitario', color: 'bg-cyan-500', description: 'Motivación por la equidad, la colaboración y el éxito compartido del grupo', traits: ['Colaboración', 'Equidad', 'Trabajo en equipo', 'Inclusión'], characteristics: 'Las personas con alta motivación Igualitaria valoran el trabajo en equipo y el éxito colectivo. Buscan eliminar barreras y crear ambientes donde todos tengan oportunidades iguales.' }
      ],
      useCases: [
        { title: 'Alineación de Roles', description: 'Asignar responsabilidades y proyectos que conecten con las pasiones naturales del colaborador, aumentando engagement y productividad.', icon: 'Target' },
        { title: 'Retención de Talento', description: 'Entender qué motiva a cada persona permite crear propuestas de valor personalizadas que aumentan la retención.', icon: 'Users' },
        { title: 'Diseño de Incentivos', description: 'Crear sistemas de recompensas efectivos al conocer qué tipo de reconocimiento realmente valora cada persona.', icon: 'Briefcase' },
        { title: 'Desarrollo de Carrera', description: 'Guiar las conversaciones de carrera hacia roles que satisfagan las motivaciones intrínsecas de la persona.', icon: 'BarChart3' }
      ],
      tips: [
        'Los motivadores no son "buenos" ni "malos" - cada uno tiene su valor en diferentes contextos',
        'Una persona puede tener múltiples motivadores fuertes que trabajan en conjunto',
        'Los motivadores pueden evolucionar con experiencias de vida significativas',
        'La frustración laboral a menudo surge cuando hay desalineación entre motivadores y el rol actual'
      ],
      examples: [
        { scenario: 'Vendedor con alto Utilitario y bajo Altruista', insight: 'Se motivará más por comisiones competitivas y rankings de ventas que por reconocimiento de su aporte al equipo. Establecer metas claras con incentivos económicos.' },
        { scenario: 'Líder de proyecto con alto Igualitario y alto Intelectual', insight: 'Prosperará en ambientes colaborativos donde pueda investigar mejores prácticas y compartir conocimientos con el equipo. Evitar roles solitarios de competencia individual.' }
      ],
      faqs: [
        { question: '¿Las Fuerzas Motivadoras son lo mismo que los valores?', answer: 'Están relacionadas pero son distintas. Los valores son creencias sobre lo que es importante; las Fuerzas Motivadoras miden la intensidad de la pasión que impulsa esas creencias hacia la acción.' },
        { question: '¿Pueden cambiar mis Fuerzas Motivadoras con el tiempo?', answer: 'Sí, experiencias de vida significativas (cambios de carrera, maternidad/paternidad, eventos de vida) pueden modificar la intensidad de ciertos motivadores.' },
        { question: '¿Qué pasa si tengo dos motivadores opuestos en el mismo continuo?', answer: 'Es inusual pero posible tener motivadores moderados en ambos extremos, lo que indica flexibilidad para adaptarte a diferentes situaciones según el contexto.' }
      ]
    },
    en: {
      name: 'Driving Forces',
      fullName: 'Driving Forces Analysis',
      icon: 'Flame',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      duration: '15-20 minutes',
      questions: 36,
      description: 'Identifies the internal motivators that drive a person\'s decisions and actions, revealing the "why" behind behavior.',
      longDescription: `Driving Forces go beyond observable behavior to reveal the internal motivations that drive people. While DISC tells us "how" we act, Driving Forces reveal the "why" behind our actions.

Based on Dr. Eduard Spranger's research and refined by TTI Success Insights, this model identifies 12 driving forces organized into 6 continuums. Each continuum represents two opposite but equally valid motivational extremes.

Unlike traditional values, Driving Forces measure the intensity of passion behind each motivator. A person may share the same value as another but be motivated by it with different intensity.

This assessment is fundamental to understanding what drives engagement, job satisfaction, and career decisions for each person.`,
      dimensions: [
        { name: 'Intellectual', color: 'bg-blue-600', description: 'Motivation for theoretical knowledge, research and discovering truth', traits: ['Intellectual curiosity', 'Research', 'Abstract thinking', 'Continuous learning'], characteristics: 'People with high Intellectual motivation are driven by the pursuit of knowledge for its own sake. They enjoy learning, researching and discovering truth. They prefer environments that stimulate thought and reflection.' },
        { name: 'Instinctive', color: 'bg-emerald-500', description: 'Motivation for practical experience, the tangible and applied knowledge', traits: ['Pragmatism', 'Direct experience', 'Intuition', 'Immediate action'], characteristics: 'People with high Instinctive motivation value learning through experience. They prefer practical and applicable knowledge over abstract theory. They trust their intuition and past experiences.' },
        { name: 'Utilitarian', color: 'bg-green-600', description: 'Motivation for return on investment, efficiency and economic results', traits: ['ROI', 'Efficiency', 'Practicality', 'Strategic investment'], characteristics: 'People with high Utilitarian motivation seek to maximize the return on their time, resources and efforts. They are aware of the economic value of things and make decisions based on tangible benefit.' },
        { name: 'Altruistic', color: 'bg-pink-500', description: 'Motivation to help others without expecting retribution, selfless service', traits: ['Service', 'Generosity', 'Empathy', 'Social impact'], characteristics: 'People with high Altruistic motivation are driven by the desire to help others. They find satisfaction in selfless service and genuinely care about the well-being of others.' },
        { name: 'Individualistic', color: 'bg-amber-600', description: 'Motivation to stand out, lead and be recognized as unique or special', traits: ['Leadership', 'Independence', 'Recognition', 'Uniqueness'], characteristics: 'People with high Individualistic motivation seek to stand out and be recognized for their unique achievements. They value autonomy and independence, and enjoy positions of influence and leadership.' },
        { name: 'Egalitarian', color: 'bg-cyan-500', description: 'Motivation for equity, collaboration and shared group success', traits: ['Collaboration', 'Equity', 'Teamwork', 'Inclusion'], characteristics: 'People with high Egalitarian motivation value teamwork and collective success. They seek to eliminate barriers and create environments where everyone has equal opportunities.' }
      ],
      useCases: [
        { title: 'Role Alignment', description: 'Assign responsibilities and projects that connect with the natural passions of the employee, increasing engagement and productivity.', icon: 'Target' },
        { title: 'Talent Retention', description: 'Understanding what motivates each person allows creating personalized value propositions that increase retention.', icon: 'Users' },
        { title: 'Incentive Design', description: 'Create effective reward systems by knowing what type of recognition each person truly values.', icon: 'Briefcase' },
        { title: 'Career Development', description: 'Guide career conversations toward roles that satisfy the person\'s intrinsic motivations.', icon: 'BarChart3' }
      ],
      tips: [
        'Motivators are not "good" or "bad" - each has its value in different contexts',
        'A person can have multiple strong motivators working together',
        'Motivators can evolve with significant life experiences',
        'Job frustration often arises when there is misalignment between motivators and the current role'
      ],
      examples: [
        { scenario: 'Salesperson with high Utilitarian and low Altruistic', insight: 'Will be more motivated by competitive commissions and sales rankings than by recognition of their contribution to the team. Establish clear goals with economic incentives.' },
        { scenario: 'Project leader with high Egalitarian and high Intellectual', insight: 'Will thrive in collaborative environments where they can research best practices and share knowledge with the team. Avoid solitary roles of individual competition.' }
      ],
      faqs: [
        { question: 'Are Driving Forces the same as values?', answer: 'They are related but distinct. Values are beliefs about what is important; Driving Forces measure the intensity of passion that drives those beliefs toward action.' },
        { question: 'Can my Driving Forces change over time?', answer: 'Yes, significant life experiences (career changes, parenthood, life events) can modify the intensity of certain motivators.' },
        { question: 'What if I have two opposite motivators on the same continuum?', answer: 'It is unusual but possible to have moderate motivators at both extremes, indicating flexibility to adapt to different situations depending on context.' }
      ]
    }
  },
  'inteligencia-emocional': {
    es: {
      name: 'Inteligencia Emocional',
      fullName: 'Evaluación de Inteligencia Emocional (EQ)',
      icon: 'Heart',
      color: 'rose',
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-50',
      duration: '12-18 minutos',
      questions: 25,
      description: 'Mide la capacidad de reconocer, entender y gestionar las propias emociones y las de los demás.',
      longDescription: `La Inteligencia Emocional (EQ) es la capacidad de percibir, comprender, gestionar y utilizar las emociones de manera efectiva tanto en uno mismo como en los demás. Popularizado por Daniel Goleman en los años 90, el concepto ha revolucionado nuestra comprensión del éxito personal y profesional.

A diferencia del IQ, que es relativamente estable a lo largo de la vida, la Inteligencia Emocional es altamente desarrollable con práctica intencional. Numerosos estudios demuestran que el EQ es mejor predictor del éxito profesional que el IQ solo, especialmente en roles de liderazgo y trabajo en equipo.

Nuestra evaluación mide cinco dimensiones clave del modelo de Goleman, proporcionando un mapa detallado de fortalezas emocionales y áreas de desarrollo. Cada dimensión contribuye de manera única a la efectividad interpersonal y el bienestar personal.

El EQ elevado se asocia con mejor manejo del estrés, relaciones más saludables, toma de decisiones más equilibrada y mayor satisfacción laboral.`,
      dimensions: [
        { name: 'Autoconciencia', color: 'bg-rose-500', description: 'Capacidad de reconocer las propias emociones y su impacto en pensamientos y comportamientos', traits: ['Conciencia emocional', 'Autoevaluación precisa', 'Autoconfianza', 'Reflexión'], characteristics: 'Las personas con alta autoconciencia reconocen sus emociones en el momento que surgen y entienden cómo afectan su desempeño. Son conscientes de sus fortalezas y limitaciones, y tienen un sentido sólido de su propio valor.' },
        { name: 'Autorregulación', color: 'bg-orange-500', description: 'Capacidad de manejar emociones e impulsos disruptivos de manera constructiva', traits: ['Autocontrol', 'Integridad', 'Adaptabilidad', 'Responsabilidad'], characteristics: 'Las personas con alta autorregulación mantienen la calma bajo presión, piensan antes de actuar y no toman decisiones impulsivas. Son capaces de adaptarse a circunstancias cambiantes y mantener estándares de honestidad.' },
        { name: 'Motivación', color: 'bg-amber-500', description: 'Tendencias emocionales que guían o facilitan el logro de metas', traits: ['Orientación al logro', 'Compromiso', 'Iniciativa', 'Optimismo'], characteristics: 'Las personas altamente motivadas tienen un fuerte impulso por mejorar y lograr metas. Están comprometidas con causas que van más allá de ellas mismas y son optimistas incluso frente a obstáculos.' },
        { name: 'Empatía', color: 'bg-pink-500', description: 'Capacidad de reconocer y comprender las emociones de los demás', traits: ['Comprensión emocional', 'Servicio', 'Desarrollo de otros', 'Diversidad'], characteristics: 'Las personas empáticas son sensibles a los sentimientos de otros y pueden ver las situaciones desde múltiples perspectivas. Son efectivas en desarrollar talentos y aprovechar la diversidad.' },
        { name: 'Habilidades Sociales', color: 'bg-purple-500', description: 'Competencia para gestionar relaciones y construir redes efectivas', traits: ['Influencia', 'Comunicación', 'Colaboración', 'Gestión de conflictos'], characteristics: 'Las personas con fuertes habilidades sociales son persuasivas, buenos comunicadores y excelentes colaboradores. Saben construir coaliciones y gestionar conflictos de manera constructiva.' }
      ],
      useCases: [
        { title: 'Desarrollo de Liderazgo', description: 'Los líderes con alto EQ crean ambientes psicológicamente seguros, inspirando compromiso y lealtad en sus equipos.', icon: 'Briefcase' },
        { title: 'Resolución de Conflictos', description: 'Identificar patrones emocionales que escalan conflictos y desarrollar estrategias de mediación efectivas.', icon: 'Users' },
        { title: 'Servicio al Cliente', description: 'Mejorar la capacidad de conectar emocionalmente con clientes, entendiendo sus necesidades no expresadas.', icon: 'MessageSquare' },
        { title: 'Bienestar Organizacional', description: 'Crear programas de desarrollo emocional que mejoren el clima laboral y reduzcan el estrés.', icon: 'Activity' }
      ],
      tips: [
        'El EQ es altamente desarrollable con práctica intencional y retroalimentación constante',
        'Comienza trabajando en autoconciencia - es la base de todas las demás competencias emocionales',
        'Llevar un diario emocional ayuda a identificar patrones y disparadores',
        'La empatía se puede desarrollar practicando la escucha activa y suspendiendo el juicio'
      ],
      examples: [
        { scenario: 'Gerente con alta Empatía pero baja Autorregulación', insight: 'Aunque conecta bien con su equipo, puede absorber demasiado el estrés de otros. Trabajar en establecer límites emocionales saludables mientras mantiene su capacidad de conexión.' },
        { scenario: 'Ejecutivo con alta Motivación pero bajas Habilidades Sociales', insight: 'Puede lograr metas individuales pero alienar a su equipo en el proceso. Enfocarse en desarrollar influencia positiva y comunicación colaborativa.' }
      ],
      faqs: [
        { question: '¿El EQ es más importante que el IQ?', answer: 'Depende del contexto. Para roles técnicos especializados, el IQ puede ser más relevante. Para roles de liderazgo, ventas y servicio, el EQ es a menudo el factor diferenciador del éxito.' },
        { question: '¿Se puede mejorar la Inteligencia Emocional?', answer: 'Absolutamente. A diferencia del IQ, el EQ es altamente maleable. Con práctica deliberada, coaching y retroalimentación, todas las dimensiones del EQ pueden desarrollarse significativamente.' },
        { question: '¿Hay un EQ "ideal" para todos los roles?', answer: 'No. Diferentes roles requieren diferentes perfiles de EQ. Un rol de ventas puede requerir más Habilidades Sociales, mientras que un analista puede beneficiarse más de alta Autorregulación.' }
      ]
    },
    en: {
      name: 'Emotional Intelligence',
      fullName: 'Emotional Intelligence Assessment (EQ)',
      icon: 'Heart',
      color: 'rose',
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-50',
      duration: '12-18 minutes',
      questions: 25,
      description: 'Measures the ability to recognize, understand and manage one\'s own emotions and those of others.',
      longDescription: `Emotional Intelligence (EQ) is the ability to perceive, understand, manage, and effectively use emotions both in oneself and in others. Popularized by Daniel Goleman in the 1990s, the concept has revolutionized our understanding of personal and professional success.

Unlike IQ, which is relatively stable throughout life, Emotional Intelligence is highly developable with intentional practice. Numerous studies show that EQ is a better predictor of professional success than IQ alone, especially in leadership and teamwork roles.

Our assessment measures five key dimensions of Goleman's model, providing a detailed map of emotional strengths and development areas. Each dimension contributes uniquely to interpersonal effectiveness and personal well-being.

High EQ is associated with better stress management, healthier relationships, more balanced decision-making, and greater job satisfaction.`,
      dimensions: [
        { name: 'Self-Awareness', color: 'bg-rose-500', description: 'Ability to recognize one\'s own emotions and their impact on thoughts and behaviors', traits: ['Emotional awareness', 'Accurate self-assessment', 'Self-confidence', 'Reflection'], characteristics: 'People with high self-awareness recognize their emotions as they arise and understand how they affect their performance. They are aware of their strengths and limitations, and have a solid sense of their own worth.' },
        { name: 'Self-Regulation', color: 'bg-orange-500', description: 'Ability to manage disruptive emotions and impulses constructively', traits: ['Self-control', 'Integrity', 'Adaptability', 'Accountability'], characteristics: 'People with high self-regulation stay calm under pressure, think before acting and don\'t make impulsive decisions. They can adapt to changing circumstances and maintain standards of honesty.' },
        { name: 'Motivation', color: 'bg-amber-500', description: 'Emotional tendencies that guide or facilitate achievement of goals', traits: ['Achievement orientation', 'Commitment', 'Initiative', 'Optimism'], characteristics: 'Highly motivated people have a strong drive to improve and achieve goals. They are committed to causes beyond themselves and remain optimistic even when facing obstacles.' },
        { name: 'Empathy', color: 'bg-pink-500', description: 'Ability to recognize and understand others\' emotions', traits: ['Emotional understanding', 'Service', 'Developing others', 'Diversity'], characteristics: 'Empathetic people are sensitive to others\' feelings and can see situations from multiple perspectives. They are effective at developing talent and leveraging diversity.' },
        { name: 'Social Skills', color: 'bg-purple-500', description: 'Competence in managing relationships and building effective networks', traits: ['Influence', 'Communication', 'Collaboration', 'Conflict management'], characteristics: 'People with strong social skills are persuasive, good communicators and excellent collaborators. They know how to build coalitions and manage conflicts constructively.' }
      ],
      useCases: [
        { title: 'Leadership Development', description: 'Leaders with high EQ create psychologically safe environments, inspiring commitment and loyalty in their teams.', icon: 'Briefcase' },
        { title: 'Conflict Resolution', description: 'Identify emotional patterns that escalate conflicts and develop effective mediation strategies.', icon: 'Users' },
        { title: 'Customer Service', description: 'Improve the ability to emotionally connect with customers, understanding their unexpressed needs.', icon: 'MessageSquare' },
        { title: 'Organizational Wellbeing', description: 'Create emotional development programs that improve workplace climate and reduce stress.', icon: 'Activity' }
      ],
      tips: [
        'EQ is highly developable with intentional practice and constant feedback',
        'Start by working on self-awareness - it\'s the foundation of all other emotional competencies',
        'Keeping an emotional journal helps identify patterns and triggers',
        'Empathy can be developed by practicing active listening and suspending judgment'
      ],
      examples: [
        { scenario: 'Manager with high Empathy but low Self-Regulation', insight: 'Although they connect well with their team, they may absorb too much of others\' stress. Work on establishing healthy emotional boundaries while maintaining their ability to connect.' },
        { scenario: 'Executive with high Motivation but low Social Skills', insight: 'May achieve individual goals but alienate their team in the process. Focus on developing positive influence and collaborative communication.' }
      ],
      faqs: [
        { question: 'Is EQ more important than IQ?', answer: 'It depends on the context. For specialized technical roles, IQ may be more relevant. For leadership, sales and service roles, EQ is often the differentiating factor of success.' },
        { question: 'Can Emotional Intelligence be improved?', answer: 'Absolutely. Unlike IQ, EQ is highly malleable. With deliberate practice, coaching and feedback, all dimensions of EQ can be developed significantly.' },
        { question: 'Is there an "ideal" EQ for all roles?', answer: 'No. Different roles require different EQ profiles. A sales role may require more Social Skills, while an analyst may benefit more from high Self-Regulation.' }
      ]
    }
  },
  'dna-25': {
    es: {
      name: 'DNA-25',
      fullName: 'Evaluación de Competencias DNA-25',
      icon: 'Dna',
      color: 'teal',
      gradient: 'from-teal-500 to-cyan-600',
      bgGradient: 'from-teal-50 to-cyan-50',
      duration: '20-25 minutos',
      questions: 25,
      description: 'Evalúa 25 competencias clave agrupadas en 5 categorías que determinan el potencial de desempeño.',
      longDescription: `El DNA-25 es un assessment de competencias conductuales que mide 25 habilidades fundamentales organizadas en cinco categorías críticas para el éxito profesional. A diferencia de las evaluaciones de personalidad, el DNA-25 mide comportamientos observables y desarrollables.

Cada competencia tiene un rango de 0 a 10, donde puntuaciones más altas no siempre son "mejores" - el perfil ideal depende del rol específico. Un rol de atención al detalle puede requerir alta competencia en "Precisión", mientras que un rol creativo puede beneficiarse de menor "Adherencia a Procesos".

Las competencias del DNA-25 son desarrollables a través de práctica intencional, coaching y experiencias de aprendizaje. El assessment identifica no solo el nivel actual, sino también el potencial de desarrollo basado en competencias relacionadas.

Esta herramienta es especialmente valiosa para análisis de brechas, planes de desarrollo individual, decisiones de promoción y diseño de programas de capacitación.`,
      dimensions: [
        { name: 'Pensamiento', color: 'bg-blue-500', description: 'Capacidades cognitivas y de procesamiento de información', traits: ['Pensamiento analítico', 'Creatividad', 'Planificación', 'Resolución de problemas', 'Visión estratégica'], characteristics: 'Las competencias de Pensamiento determinan cómo procesas información, generas ideas y planificas acciones. Incluye desde el análisis detallado hasta la visión estratégica de largo plazo.' },
        { name: 'Comunicación', color: 'bg-purple-500', description: 'Habilidades para transmitir y recibir información efectivamente', traits: ['Comunicación oral', 'Comunicación escrita', 'Presentación', 'Escucha activa', 'Negociación'], characteristics: 'Las competencias de Comunicación impactan tu capacidad de influir, persuadir y conectar con otros. Incluye habilidades verbales, escritas y de escucha activa.' },
        { name: 'Liderazgo', color: 'bg-amber-500', description: 'Capacidades para guiar, motivar e inspirar a otros', traits: ['Inspiración', 'Delegación', 'Desarrollo de otros', 'Toma de decisiones', 'Gestión del cambio'], characteristics: 'Las competencias de Liderazgo determinan tu efectividad para movilizar equipos hacia objetivos comunes. Incluye tanto liderazgo formal como influencia informal.' },
        { name: 'Resultados', color: 'bg-green-500', description: 'Orientación hacia el logro y la ejecución efectiva', traits: ['Orientación a resultados', 'Iniciativa', 'Persistencia', 'Calidad', 'Eficiencia'], characteristics: 'Las competencias de Resultados reflejan tu capacidad de ejecutar, entregar y mantener estándares de calidad. Incluye tanto velocidad como precisión en la entrega.' },
        { name: 'Relaciones', color: 'bg-rose-500', description: 'Habilidades interpersonales y de construcción de confianza', traits: ['Trabajo en equipo', 'Empatía', 'Servicio', 'Construcción de relaciones', 'Manejo de conflictos'], characteristics: 'Las competencias de Relaciones determinan tu efectividad para colaborar, servir y construir redes de confianza. Son fundamentales para roles con alto componente interpersonal.' }
      ],
      useCases: [
        { title: 'Análisis de Brechas', description: 'Comparar competencias actuales contra el perfil ideal del puesto para identificar áreas prioritarias de desarrollo.', icon: 'BarChart3' },
        { title: 'Planes de Desarrollo', description: 'Crear planes de desarrollo individual basados en competencias específicas con acciones concretas.', icon: 'Target' },
        { title: 'Decisiones de Promoción', description: 'Evaluar si un candidato tiene las competencias necesarias para roles de mayor responsabilidad.', icon: 'Users' },
        { title: 'Diseño de Capacitación', description: 'Identificar competencias comunes a desarrollar en equipos para diseñar programas de capacitación efectivos.', icon: 'BookOpen' }
      ],
      tips: [
        'Compara siempre los resultados con el perfil ideal del puesto - las competencias "ideales" varían según el rol',
        'Las competencias se desarrollan mejor a través de experiencias prácticas, no solo capacitación teórica',
        'Enfócate en máximo 2-3 competencias a la vez para lograr desarrollo real',
        'Busca oportunidades de práctica deliberada en las competencias que quieres desarrollar'
      ],
      examples: [
        { scenario: 'Analista técnico aspirando a rol de gerencia', insight: 'Puede tener altas competencias en Pensamiento pero brechas en Liderazgo y Comunicación. Plan de desarrollo: asignar liderazgo de proyectos pequeños con coaching de comunicación.' },
        { scenario: 'Representante de ventas con bajo cierre pero alta relación', insight: 'Fuerte en Relaciones pero brecha en competencias de Resultados como "Orientación a Resultados" y "Persistencia". Trabajar en técnicas de cierre y seguimiento sistemático.' }
      ],
      faqs: [
        { question: '¿Las competencias se pueden desarrollar o son innatas?', answer: 'Todas las competencias del DNA-25 son desarrollables. Algunas personas tienen aptitudes naturales que facilitan el desarrollo, pero con práctica intencional cualquier competencia puede mejorarse significativamente.' },
        { question: '¿Qué tan preciso es el DNA-25?', answer: 'El DNA-25 tiene alta validez predictiva del desempeño laboral cuando se usa correctamente. La precisión mejora cuando se combina con otras fuentes de información como entrevistas conductuales y referencias.' },
        { question: '¿Hay un perfil DNA-25 "ideal" universal?', answer: 'No. El perfil ideal varía dramáticamente según el rol, la industria y la cultura organizacional. Un rol de análisis requiere un perfil muy diferente a un rol de ventas o liderazgo.' }
      ]
    },
    en: {
      name: 'DNA-25',
      fullName: 'DNA-25 Competencies Assessment',
      icon: 'Dna',
      color: 'teal',
      gradient: 'from-teal-500 to-cyan-600',
      bgGradient: 'from-teal-50 to-cyan-50',
      duration: '20-25 minutes',
      questions: 25,
      description: 'Evaluates 25 key competencies grouped into 5 categories that determine performance potential.',
      longDescription: `DNA-25 is a behavioral competency assessment that measures 25 fundamental skills organized into five categories critical to professional success. Unlike personality assessments, DNA-25 measures observable and developable behaviors.

Each competency has a range of 0 to 10, where higher scores are not always "better" - the ideal profile depends on the specific role. A detail-oriented role may require high competency in "Precision", while a creative role may benefit from lower "Process Adherence".

DNA-25 competencies are developable through intentional practice, coaching and learning experiences. The assessment identifies not only the current level, but also the development potential based on related competencies.

This tool is especially valuable for gap analysis, individual development plans, promotion decisions and training program design.`,
      dimensions: [
        { name: 'Thinking', color: 'bg-blue-500', description: 'Cognitive and information processing capabilities', traits: ['Analytical thinking', 'Creativity', 'Planning', 'Problem solving', 'Strategic vision'], characteristics: 'Thinking competencies determine how you process information, generate ideas and plan actions. It includes everything from detailed analysis to long-term strategic vision.' },
        { name: 'Communication', color: 'bg-purple-500', description: 'Skills to transmit and receive information effectively', traits: ['Oral communication', 'Written communication', 'Presentation', 'Active listening', 'Negotiation'], characteristics: 'Communication competencies impact your ability to influence, persuade and connect with others. Includes verbal, written and active listening skills.' },
        { name: 'Leadership', color: 'bg-amber-500', description: 'Capabilities to guide, motivate and inspire others', traits: ['Inspiration', 'Delegation', 'Developing others', 'Decision making', 'Change management'], characteristics: 'Leadership competencies determine your effectiveness in mobilizing teams toward common goals. Includes both formal leadership and informal influence.' },
        { name: 'Results', color: 'bg-green-500', description: 'Orientation towards achievement and effective execution', traits: ['Results orientation', 'Initiative', 'Persistence', 'Quality', 'Efficiency'], characteristics: 'Results competencies reflect your ability to execute, deliver and maintain quality standards. Includes both speed and accuracy in delivery.' },
        { name: 'Relationships', color: 'bg-rose-500', description: 'Interpersonal and trust-building skills', traits: ['Teamwork', 'Empathy', 'Service', 'Relationship building', 'Conflict management'], characteristics: 'Relationship competencies determine your effectiveness in collaborating, serving and building networks of trust. They are fundamental for roles with high interpersonal component.' }
      ],
      useCases: [
        { title: 'Gap Analysis', description: 'Compare current competencies against the ideal job profile to identify priority development areas.', icon: 'BarChart3' },
        { title: 'Development Plans', description: 'Create individual development plans based on specific competencies with concrete actions.', icon: 'Target' },
        { title: 'Promotion Decisions', description: 'Evaluate whether a candidate has the necessary competencies for roles with greater responsibility.', icon: 'Users' },
        { title: 'Training Design', description: 'Identify common competencies to develop in teams to design effective training programs.', icon: 'BookOpen' }
      ],
      tips: [
        'Always compare results with the ideal job profile - "ideal" competencies vary by role',
        'Competencies develop best through practical experiences, not just theoretical training',
        'Focus on a maximum of 2-3 competencies at a time to achieve real development',
        'Look for opportunities for deliberate practice in the competencies you want to develop'
      ],
      examples: [
        { scenario: 'Technical analyst aspiring to management role', insight: 'May have high competencies in Thinking but gaps in Leadership and Communication. Development plan: assign leadership of small projects with communication coaching.' },
        { scenario: 'Sales representative with low closing but high relationship', insight: 'Strong in Relationships but gap in Results competencies like "Results Orientation" and "Persistence". Work on closing techniques and systematic follow-up.' }
      ],
      faqs: [
        { question: 'Can competencies be developed or are they innate?', answer: 'All DNA-25 competencies are developable. Some people have natural aptitudes that facilitate development, but with intentional practice any competency can be significantly improved.' },
        { question: 'How accurate is DNA-25?', answer: 'DNA-25 has high predictive validity for job performance when used correctly. Accuracy improves when combined with other information sources such as behavioral interviews and references.' },
        { question: 'Is there a universal "ideal" DNA-25 profile?', answer: 'No. The ideal profile varies dramatically depending on the role, industry and organizational culture. An analysis role requires a very different profile than a sales or leadership role.' }
      ]
    }
  },
  'acumen': {
    es: {
      name: 'Acumen (ACI)',
      fullName: 'Índice de Capacidad Acumen',
      icon: 'Compass',
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50',
      duration: '15-20 minutos',
      questions: 30,
      description: 'Mide la claridad de pensamiento y toma de decisiones en el mundo externo e interno.',
      longDescription: `El Índice de Capacidad Acumen (ACI) mide cómo una persona percibe, evalúa y toma decisiones sobre el mundo que la rodea y sobre sí misma. Basado en la ciencia de la axiología formal desarrollada por el Dr. Robert S. Hartman, el ACI proporciona insights únicos sobre la claridad de pensamiento.

A diferencia de las evaluaciones de personalidad o comportamiento, el Acumen mide la capacidad de juicio - qué tan claramente una persona puede evaluar situaciones, personas y conceptos. Identifica tanto fortalezas como "puntos ciegos" en la percepción.

El ACI distingue entre dos dimensiones principales: la claridad externa (cómo evaluamos el mundo fuera de nosotros) y la claridad interna (cómo nos evaluamos a nosotros mismos). Cada dimensión se subdivide en tres factores que revelan patrones específicos de valoración.

Esta herramienta es especialmente poderosa para desarrollo ejecutivo, coaching y comprensión de estilos de toma de decisiones.`,
      dimensions: [
        { name: 'Comprensión de Otros', color: 'bg-blue-500', description: 'Claridad al evaluar y entender a otras personas', traits: ['Lectura de personas', 'Intuición social', 'Evaluación de carácter', 'Empatía cognitiva'], characteristics: 'Alta claridad indica capacidad para evaluar correctamente las fortalezas, debilidades y motivaciones de otros. Baja claridad puede llevar a malinterpretar intenciones o sobreestimar/subestimar a personas.' },
        { name: 'Comprensión Práctica', color: 'bg-green-500', description: 'Claridad al evaluar situaciones, sistemas y procesos', traits: ['Análisis situacional', 'Evaluación de sistemas', 'Juicio práctico', 'Pensamiento operativo'], characteristics: 'Alta claridad indica capacidad para evaluar correctamente qué funciona y qué no en sistemas y procesos. Baja claridad puede llevar a decisiones operativas subóptimas.' },
        { name: 'Comprensión Conceptual', color: 'bg-purple-500', description: 'Claridad al evaluar ideas, teorías y conceptos abstractos', traits: ['Pensamiento abstracto', 'Evaluación de ideas', 'Visión estratégica', 'Juicio conceptual'], characteristics: 'Alta claridad indica capacidad para evaluar la validez y potencial de ideas y estrategias. Baja claridad puede llevar a perseguir conceptos poco viables.' },
        { name: 'Autoestima', color: 'bg-rose-500', description: 'Claridad al evaluar el propio valor como persona', traits: ['Autovaloración', 'Confianza en sí mismo', 'Sentido de identidad', 'Resiliencia personal'], characteristics: 'Refleja qué tan claramente una persona se ve a sí misma como individuo único y valioso. Impacta directamente la confianza y la resiliencia ante adversidades.' },
        { name: 'Claridad de Rol', color: 'bg-amber-500', description: 'Claridad al evaluar las propias competencias y desempeño', traits: ['Autoeficacia', 'Evaluación de competencias', 'Conciencia de desempeño', 'Realismo laboral'], characteristics: 'Indica qué tan claramente una persona evalúa sus propias habilidades y rendimiento en su rol. Impacta la capacidad de identificar áreas de desarrollo y recibir feedback.' },
        { name: 'Autodirección', color: 'bg-cyan-500', description: 'Claridad al evaluar las propias metas, valores y propósito', traits: ['Sentido de propósito', 'Claridad de valores', 'Dirección de vida', 'Coherencia interna'], characteristics: 'Refleja qué tan claramente una persona entiende sus propias metas, valores y lo que quiere lograr en la vida. Impacta motivación intrínseca y satisfacción vital.' }
      ],
      useCases: [
        { title: 'Desarrollo Ejecutivo', description: 'Identificar puntos ciegos en el juicio de líderes senior que puedan impactar decisiones estratégicas críticas.', icon: 'Briefcase' },
        { title: 'Coaching Personal', description: 'Proporcionar insights profundos sobre patrones de pensamiento que pueden estar limitando el potencial del coachee.', icon: 'Lightbulb' },
        { title: 'Selección Ejecutiva', description: 'Evaluar la claridad de juicio de candidatos a posiciones que requieren toma de decisiones complejas.', icon: 'Users' },
        { title: 'Desarrollo de Equipos', description: 'Entender cómo diferentes estilos de valoración impactan la dinámica del equipo y la toma de decisiones grupal.', icon: 'Target' }
      ],
      tips: [
        'Un sesgo no es inherentemente "malo" - simplemente indica una tendencia a sobrevalorar o subvalorar ciertos aspectos',
        'La claridad de pensamiento puede desarrollarse con práctica de reflexión y recepción de feedback',
        'Los sesgos en claridad externa a menudo se manifiestan en conflictos interpersonales recurrentes',
        'Trabajar con un coach puede acelerar el desarrollo de mayor claridad en áreas específicas'
      ],
      examples: [
        { scenario: 'Ejecutivo con alta claridad externa pero baja autoestima', insight: 'Excelente evaluando el negocio y a las personas, pero puede subestimar su propio valor, lo que afecta negociaciones salariales y autopromoción. Trabajar en reconocer logros propios.' },
        { scenario: 'Emprendedor con alta autodirección pero baja comprensión práctica', insight: 'Tiene visión clara de lo que quiere lograr pero puede fallar en evaluar la viabilidad operativa de sus planes. Complementar con socios o asesores con alta comprensión práctica.' }
      ],
      faqs: [
        { question: '¿Qué es un sesgo en Acumen?', answer: 'Un sesgo indica una tendencia a sistemáticamente sobre o subvalorar ciertos aspectos. Por ejemplo, un sesgo positivo hacia "Comprensión de Otros" puede llevar a confiar demasiado en las personas sin suficiente evidencia.' },
        { question: '¿El Acumen mide inteligencia?', answer: 'No mide IQ tradicional. Mide claridad de juicio - la capacidad de evaluar correctamente valor. Personas con alto IQ pueden tener sesgos significativos en su juicio.' },
        { question: '¿Se puede mejorar la claridad de pensamiento?', answer: 'Sí. Aunque los patrones de valoración son bastante estables, la práctica reflexiva, el coaching y la exposición a feedback pueden mejorar la claridad en áreas específicas.' }
      ]
    },
    en: {
      name: 'Acumen (ACI)',
      fullName: 'Acumen Capacity Index',
      icon: 'Compass',
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50',
      duration: '15-20 minutes',
      questions: 30,
      description: 'Measures clarity of thinking and decision-making in the external and internal world.',
      longDescription: `The Acumen Capacity Index (ACI) measures how a person perceives, evaluates, and makes decisions about the world around them and about themselves. Based on the science of formal axiology developed by Dr. Robert S. Hartman, the ACI provides unique insights into thinking clarity.

Unlike personality or behavior assessments, Acumen measures judgment capacity - how clearly a person can evaluate situations, people, and concepts. It identifies both strengths and "blind spots" in perception.

The ACI distinguishes between two main dimensions: external clarity (how we evaluate the world outside of us) and internal clarity (how we evaluate ourselves). Each dimension is subdivided into three factors that reveal specific valuation patterns.

This tool is especially powerful for executive development, coaching, and understanding decision-making styles.`,
      dimensions: [
        { name: 'Understanding Others', color: 'bg-blue-500', description: 'Clarity when evaluating and understanding other people', traits: ['Reading people', 'Social intuition', 'Character assessment', 'Cognitive empathy'], characteristics: 'High clarity indicates ability to correctly assess others\' strengths, weaknesses, and motivations. Low clarity can lead to misinterpreting intentions or over/underestimating people.' },
        { name: 'Practical Understanding', color: 'bg-green-500', description: 'Clarity when evaluating situations, systems and processes', traits: ['Situational analysis', 'Systems evaluation', 'Practical judgment', 'Operational thinking'], characteristics: 'High clarity indicates ability to correctly assess what works and what doesn\'t in systems and processes. Low clarity can lead to suboptimal operational decisions.' },
        { name: 'Conceptual Understanding', color: 'bg-purple-500', description: 'Clarity when evaluating ideas, theories and abstract concepts', traits: ['Abstract thinking', 'Idea evaluation', 'Strategic vision', 'Conceptual judgment'], characteristics: 'High clarity indicates ability to evaluate the validity and potential of ideas and strategies. Low clarity can lead to pursuing unviable concepts.' },
        { name: 'Self-Esteem', color: 'bg-rose-500', description: 'Clarity when evaluating one\'s own value as a person', traits: ['Self-valuation', 'Self-confidence', 'Sense of identity', 'Personal resilience'], characteristics: 'Reflects how clearly a person sees themselves as a unique and valuable individual. Directly impacts confidence and resilience in the face of adversity.' },
        { name: 'Role Clarity', color: 'bg-amber-500', description: 'Clarity when evaluating one\'s own competencies and performance', traits: ['Self-efficacy', 'Competency assessment', 'Performance awareness', 'Work realism'], characteristics: 'Indicates how clearly a person evaluates their own skills and performance in their role. Impacts ability to identify development areas and receive feedback.' },
        { name: 'Self-Direction', color: 'bg-cyan-500', description: 'Clarity when evaluating one\'s own goals, values and purpose', traits: ['Sense of purpose', 'Values clarity', 'Life direction', 'Internal coherence'], characteristics: 'Reflects how clearly a person understands their own goals, values, and what they want to achieve in life. Impacts intrinsic motivation and life satisfaction.' }
      ],
      useCases: [
        { title: 'Executive Development', description: 'Identify blind spots in senior leaders\' judgment that may impact critical strategic decisions.', icon: 'Briefcase' },
        { title: 'Personal Coaching', description: 'Provide deep insights into thinking patterns that may be limiting the coachee\'s potential.', icon: 'Lightbulb' },
        { title: 'Executive Selection', description: 'Evaluate judgment clarity of candidates for positions requiring complex decision-making.', icon: 'Users' },
        { title: 'Team Development', description: 'Understand how different valuation styles impact team dynamics and group decision-making.', icon: 'Target' }
      ],
      tips: [
        'A bias is not inherently "bad" - it simply indicates a tendency to overvalue or undervalue certain aspects',
        'Thinking clarity can be developed with reflection practice and receiving feedback',
        'Biases in external clarity often manifest in recurring interpersonal conflicts',
        'Working with a coach can accelerate the development of greater clarity in specific areas'
      ],
      examples: [
        { scenario: 'Executive with high external clarity but low self-esteem', insight: 'Excellent at evaluating business and people, but may underestimate their own worth, affecting salary negotiations and self-promotion. Work on recognizing their own achievements.' },
        { scenario: 'Entrepreneur with high self-direction but low practical understanding', insight: 'Has clear vision of what they want to achieve but may fail to assess operational viability of their plans. Complement with partners or advisors with high practical understanding.' }
      ],
      faqs: [
        { question: 'What is a bias in Acumen?', answer: 'A bias indicates a tendency to systematically over or undervalue certain aspects. For example, a positive bias toward "Understanding Others" can lead to trusting people too much without sufficient evidence.' },
        { question: 'Does Acumen measure intelligence?', answer: 'It does not measure traditional IQ. It measures judgment clarity - the ability to correctly evaluate value. People with high IQ can have significant biases in their judgment.' },
        { question: 'Can thinking clarity be improved?', answer: 'Yes. Although valuation patterns are quite stable, reflective practice, coaching and exposure to feedback can improve clarity in specific areas.' }
      ]
    }
  },
  'valores-integridad': {
    es: {
      name: 'Valores e Integridad',
      fullName: 'Evaluación de Valores e Integridad',
      icon: 'Shield',
      color: 'violet',
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-50 to-purple-50',
      duration: '12-15 minutos',
      questions: 30,
      description: 'Evalúa los valores fundamentales y el nivel de consistencia entre valores declarados y comportamientos.',
      longDescription: `La Evaluación de Valores e Integridad mide seis dimensiones fundamentales de valores basadas en la teoría del filósofo Eduard Spranger, adaptada para el contexto organizacional. Además de identificar qué valores son más importantes para una persona, evalúa la integridad - la consistencia entre valores declarados y comportamientos observados.

Los valores son creencias profundas sobre lo que es importante en la vida. A diferencia de las preferencias o gustos, los valores actúan como brújulas que guían decisiones importantes, especialmente en momentos de dilema o conflicto.

La integridad no significa perfección, sino la congruencia entre lo que decimos que valoramos y cómo realmente actuamos. La evaluación identifica áreas donde puede haber desalineación, proporcionando oportunidades para reflexión y desarrollo.

Comprender los valores es fundamental para evaluar el fit cultural, prevenir conflictos de valores en equipos y crear ambientes de trabajo auténticos.`,
      dimensions: [
        { name: 'Teórico', color: 'bg-blue-600', description: 'Valoración del conocimiento, la verdad y el aprendizaje por sí mismos', traits: ['Curiosidad intelectual', 'Búsqueda de verdad', 'Racionalidad', 'Objetividad'], characteristics: 'Personas con alto valor Teórico priorizan el conocimiento y la comprensión por encima de su utilidad práctica. Disfrutan aprender, investigar y descubrir la verdad de las cosas.' },
        { name: 'Utilitario', color: 'bg-green-600', description: 'Valoración de la practicidad, eficiencia y retorno de inversión', traits: ['Pragmatismo', 'Eficiencia', 'ROI', 'Recursos'], characteristics: 'Personas con alto valor Utilitario priorizan lo que funciona y produce resultados. Son conscientes del tiempo, dinero y esfuerzo invertido y esperan retornos tangibles.' },
        { name: 'Estético', color: 'bg-pink-500', description: 'Valoración de la belleza, armonía, forma y expresión artística', traits: ['Apreciación artística', 'Armonía', 'Creatividad', 'Experiencia sensorial'], characteristics: 'Personas con alto valor Estético aprecian la belleza en sus múltiples formas. Buscan ambientes armoniosos y experiencias que estimulen los sentidos.' },
        { name: 'Social', color: 'bg-rose-500', description: 'Valoración del servicio a otros, compasión y contribución social', traits: ['Servicio', 'Compasión', 'Altruismo', 'Impacto social'], characteristics: 'Personas con alto valor Social priorizan ayudar a otros y contribuir al bienestar de la sociedad. Encuentran significado en el servicio desinteresado.' },
        { name: 'Individualista', color: 'bg-amber-500', description: 'Valoración del poder, influencia, reconocimiento y liderazgo', traits: ['Liderazgo', 'Influencia', 'Autonomía', 'Reconocimiento'], characteristics: 'Personas con alto valor Individualista valoran posiciones de poder e influencia. Buscan destacar, liderar y ser reconocidas por sus logros únicos.' },
        { name: 'Tradicional', color: 'bg-purple-600', description: 'Valoración de la espiritualidad, tradiciones y un sistema de creencias unificador', traits: ['Espiritualidad', 'Tradición', 'Propósito', 'Trascendencia'], characteristics: 'Personas con alto valor Tradicional buscan un sistema de creencias que dé sentido a su vida. Valoran la tradición, la espiritualidad y el propósito trascendente.' }
      ],
      useCases: [
        { title: 'Fit Cultural', description: 'Evaluar qué tan bien se alinean los valores de un candidato con la cultura organizacional y del equipo.', icon: 'Users' },
        { title: 'Resolución de Conflictos', description: 'Entender conflictos de valores subyacentes que generan fricciones aparentemente inexplicables en equipos.', icon: 'MessageSquare' },
        { title: 'Desarrollo de Liderazgo', description: 'Ayudar a líderes a entender cómo sus valores impactan su estilo de liderazgo y las decisiones que toman.', icon: 'Briefcase' },
        { title: 'Coaching de Integridad', description: 'Identificar brechas entre valores declarados y comportamientos para trabajar en mayor congruencia.', icon: 'Lightbulb' }
      ],
      tips: [
        'Los valores no son "buenos" ni "malos" - son preferencias personales que funcionan en diferentes contextos',
        'Los conflictos de valores a menudo parecen conflictos de personalidad pero tienen raíces más profundas',
        'La integridad se construye a través de decisiones conscientes alineadas con tus valores declarados',
        'Conocer los valores de otros facilita la comunicación y reduce malentendidos'
      ],
      examples: [
        { scenario: 'Conflicto entre líder Utilitario y equipo Social', insight: 'El líder prioriza eficiencia y resultados; el equipo prioriza el impacto humano de las decisiones. Solución: incorporar métricas de impacto social junto con métricas de negocio.' },
        { scenario: 'Colaborador Teórico en rol muy Utilitario', insight: 'Puede frustrarse si no tiene tiempo para investigar a profundidad. Crear espacios para exploración intelectual dentro de proyectos prácticos.' }
      ],
      faqs: [
        { question: '¿Los valores pueden cambiar con el tiempo?', answer: 'Sí, los valores evolucionan con experiencias significativas de vida. Cambios de carrera, maternidad/paternidad, pérdidas y logros importantes pueden reordenar las prioridades de valores.' },
        { question: '¿Qué significa si mis valores son muy diferentes a los de mi organización?', answer: 'Puede generar fricción y insatisfacción a largo plazo. Es importante evaluar si las diferencias son manejables o si hay una desalineación fundamental que afecta tu bienestar.' },
        { question: '¿La integridad es blanco o negro?', answer: 'No. La integridad es un continuo y todos tenemos áreas donde somos más o menos congruentes. La evaluación ayuda a identificar áreas específicas donde trabajar.' }
      ]
    },
    en: {
      name: 'Values & Integrity',
      fullName: 'Values & Integrity Assessment',
      icon: 'Shield',
      color: 'violet',
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-50 to-purple-50',
      duration: '12-15 minutes',
      questions: 30,
      description: 'Evaluates fundamental values and the level of consistency between declared values and behaviors.',
      longDescription: `The Values & Integrity Assessment measures six fundamental value dimensions based on the theory of philosopher Eduard Spranger, adapted for the organizational context. In addition to identifying which values are most important to a person, it evaluates integrity - the consistency between declared values and observed behaviors.

Values are deep beliefs about what is important in life. Unlike preferences or tastes, values act as compasses that guide important decisions, especially in moments of dilemma or conflict.

Integrity does not mean perfection, but rather the congruence between what we say we value and how we actually act. The assessment identifies areas where there may be misalignment, providing opportunities for reflection and development.

Understanding values is essential for assessing cultural fit, preventing value conflicts in teams, and creating authentic work environments.`,
      dimensions: [
        { name: 'Theoretical', color: 'bg-blue-600', description: 'Valuing knowledge, truth and learning for their own sake', traits: ['Intellectual curiosity', 'Search for truth', 'Rationality', 'Objectivity'], characteristics: 'People with high Theoretical value prioritize knowledge and understanding above practical utility. They enjoy learning, researching and discovering the truth of things.' },
        { name: 'Utilitarian', color: 'bg-green-600', description: 'Valuing practicality, efficiency and return on investment', traits: ['Pragmatism', 'Efficiency', 'ROI', 'Resources'], characteristics: 'People with high Utilitarian value prioritize what works and produces results. They are aware of time, money and effort invested and expect tangible returns.' },
        { name: 'Aesthetic', color: 'bg-pink-500', description: 'Valuing beauty, harmony, form and artistic expression', traits: ['Artistic appreciation', 'Harmony', 'Creativity', 'Sensory experience'], characteristics: 'People with high Aesthetic value appreciate beauty in its multiple forms. They seek harmonious environments and experiences that stimulate the senses.' },
        { name: 'Social', color: 'bg-rose-500', description: 'Valuing service to others, compassion and social contribution', traits: ['Service', 'Compassion', 'Altruism', 'Social impact'], characteristics: 'People with high Social value prioritize helping others and contributing to the well-being of society. They find meaning in selfless service.' },
        { name: 'Individualistic', color: 'bg-amber-500', description: 'Valuing power, influence, recognition and leadership', traits: ['Leadership', 'Influence', 'Autonomy', 'Recognition'], characteristics: 'People with high Individualistic value value positions of power and influence. They seek to stand out, lead and be recognized for their unique achievements.' },
        { name: 'Traditional', color: 'bg-purple-600', description: 'Valuing spirituality, traditions and a unifying belief system', traits: ['Spirituality', 'Tradition', 'Purpose', 'Transcendence'], characteristics: 'People with high Traditional value seek a belief system that gives meaning to their lives. They value tradition, spirituality and transcendent purpose.' }
      ],
      useCases: [
        { title: 'Cultural Fit', description: 'Evaluate how well a candidate\'s values align with the organizational and team culture.', icon: 'Users' },
        { title: 'Conflict Resolution', description: 'Understand underlying value conflicts that generate seemingly inexplicable frictions in teams.', icon: 'MessageSquare' },
        { title: 'Leadership Development', description: 'Help leaders understand how their values impact their leadership style and the decisions they make.', icon: 'Briefcase' },
        { title: 'Integrity Coaching', description: 'Identify gaps between declared values and behaviors to work toward greater congruence.', icon: 'Lightbulb' }
      ],
      tips: [
        'Values are not "good" or "bad" - they are personal preferences that work in different contexts',
        'Value conflicts often appear as personality conflicts but have deeper roots',
        'Integrity is built through conscious decisions aligned with your declared values',
        'Knowing others\' values facilitates communication and reduces misunderstandings'
      ],
      examples: [
        { scenario: 'Conflict between Utilitarian leader and Social team', insight: 'The leader prioritizes efficiency and results; the team prioritizes the human impact of decisions. Solution: incorporate social impact metrics alongside business metrics.' },
        { scenario: 'Theoretical collaborator in very Utilitarian role', insight: 'May get frustrated if there\'s no time to research in depth. Create spaces for intellectual exploration within practical projects.' }
      ],
      faqs: [
        { question: 'Can values change over time?', answer: 'Yes, values evolve with significant life experiences. Career changes, parenthood, losses and major achievements can reorder value priorities.' },
        { question: 'What does it mean if my values are very different from my organization\'s?', answer: 'It can generate friction and long-term dissatisfaction. It\'s important to evaluate whether the differences are manageable or if there\'s a fundamental misalignment affecting your well-being.' },
        { question: 'Is integrity black or white?', answer: 'No. Integrity is a continuum and we all have areas where we are more or less congruent. The assessment helps identify specific areas to work on.' }
      ]
    }
  },
  'estres-resiliencia': {
    es: {
      name: 'Estrés y Resiliencia',
      fullName: 'Evaluación de Estrés y Resiliencia',
      icon: 'Activity',
      color: 'orange',
      gradient: 'from-orange-500 to-rose-600',
      bgGradient: 'from-orange-50 to-rose-50',
      duration: '12-15 minutos',
      questions: 30,
      description: 'Mide los niveles de estrés actuales, capacidad de resiliencia y factores protectores para el bienestar.',
      longDescription: `La Evaluación de Estrés y Resiliencia proporciona una fotografía integral del bienestar actual del colaborador, midiendo tanto los factores de estrés como los recursos de resiliencia que posee para afrontarlos.

El estrés no es inherentemente negativo. El "eustrés" o estrés positivo puede impulsar el rendimiento y el crecimiento. Sin embargo, el estrés crónico o excesivo (distrés) tiene efectos negativos comprobados en la salud física, mental y el desempeño laboral.

La resiliencia es la capacidad de recuperarse de adversidades y adaptarse positivamente a circunstancias difíciles. No es un rasgo fijo sino un conjunto de habilidades que pueden desarrollarse con práctica intencional.

Esta evaluación identifica factores de riesgo específicos, factores protectores y proporciona recomendaciones personalizadas para mejorar el bienestar y construir mayor resiliencia.`,
      dimensions: [
        { name: 'Estrés Laboral', color: 'bg-red-500', description: 'Nivel de presión y tensión experimentado en el ambiente de trabajo', traits: ['Carga de trabajo', 'Presión temporal', 'Demandas laborales', 'Conflictos de rol'], characteristics: 'Mide la intensidad de las demandas laborales actuales y cómo están impactando el bienestar. Incluye factores como sobrecarga, plazos, ambigüedad de rol y conflictos en el trabajo.' },
        { name: 'Capacidad de Recuperación', color: 'bg-green-500', description: 'Habilidad para recuperarse de situaciones estresantes y adversidades', traits: ['Rebote emocional', 'Adaptabilidad', 'Optimismo', 'Persistencia'], characteristics: 'Evalúa qué tan rápido y efectivamente una persona puede recuperar su equilibrio después de situaciones difíciles. Incluye flexibilidad mental y capacidad de ver oportunidades en los desafíos.' },
        { name: 'Apoyo Social', color: 'bg-blue-500', description: 'Red de relaciones que proporciona soporte emocional y práctico', traits: ['Red de apoyo', 'Conexiones significativas', 'Disponibilidad de ayuda', 'Pertenencia'], characteristics: 'Mide la calidad y disponibilidad de relaciones de apoyo. El apoyo social es uno de los factores protectores más poderosos contra el estrés.' },
        { name: 'Autorregulación Emocional', color: 'bg-purple-500', description: 'Capacidad de gestionar las propias emociones de manera saludable', traits: ['Gestión emocional', 'Calma bajo presión', 'Control de impulsos', 'Expresión saludable'], characteristics: 'Evalúa la habilidad para reconocer, entender y manejar las emociones propias de manera constructiva, especialmente en situaciones de presión.' },
        { name: 'Bienestar Físico', color: 'bg-emerald-500', description: 'Estado de salud física y hábitos que impactan la resiliencia', traits: ['Sueño', 'Ejercicio', 'Nutrición', 'Energía'], characteristics: 'Mide factores de salud física que impactan directamente la capacidad de manejar estrés. Incluye calidad de sueño, actividad física y hábitos de autocuidado.' }
      ],
      useCases: [
        { title: 'Prevención de Burnout', description: 'Identificar colaboradores en riesgo de burnout antes de que ocurra, permitiendo intervenciones preventivas oportunas.', icon: 'Activity' },
        { title: 'Programas de Bienestar', description: 'Diseñar programas de bienestar basados en las necesidades reales identificadas en los equipos.', icon: 'Heart' },
        { title: 'Retorno Post-Licencia', description: 'Evaluar la readiness de colaboradores regresando de licencias médicas o períodos de alta presión.', icon: 'Users' },
        { title: 'Coaching de Resiliencia', description: 'Identificar áreas específicas para construir mayor resiliencia a través de coaching personalizado.', icon: 'Lightbulb' }
      ],
      tips: [
        'El estrés no siempre es negativo - el "eustrés" puede impulsar rendimiento y crecimiento personal',
        'La resiliencia es desarrollable - no es un rasgo fijo con el que nacemos',
        'El apoyo social es uno de los factores protectores más poderosos - invierte en tus relaciones',
        'Pequeñas acciones consistentes (sueño, ejercicio, pausas) tienen más impacto que grandes cambios esporádicos'
      ],
      examples: [
        { scenario: 'Alto estrés laboral pero alta resiliencia y apoyo social', insight: 'Aunque bajo presión significativa, tiene recursos para afrontarlo. Monitorear para prevenir agotamiento de recursos. Considerar reducir fuentes de estrés si es posible.' },
        { scenario: 'Estrés moderado pero baja capacidad de recuperación', insight: 'Incluso niveles moderados de presión pueden acumularse sin buena capacidad de rebote. Priorizar desarrollo de habilidades de autorregulación y técnicas de recuperación.' }
      ],
      faqs: [
        { question: '¿El estrés siempre es malo?', answer: 'No. El estrés moderado y manejable (eustrés) puede mejorar el rendimiento, la motivación y el crecimiento personal. El problema es el estrés crónico o excesivo que sobrepasa los recursos de afrontamiento.' },
        { question: '¿Se puede desarrollar la resiliencia?', answer: 'Absolutamente. La resiliencia es un conjunto de habilidades que se pueden desarrollar con práctica. Técnicas como mindfulness, reestructuración cognitiva y construcción de apoyo social son efectivas.' },
        { question: '¿Qué tan frecuentemente debería evaluarme?', answer: 'Recomendamos cada 3-6 meses o después de cambios significativos (nuevo rol, reestructuración, eventos de vida importantes). Esto permite identificar tendencias y ajustar estrategias.' }
      ]
    },
    en: {
      name: 'Stress & Resilience',
      fullName: 'Stress & Resilience Assessment',
      icon: 'Activity',
      color: 'orange',
      gradient: 'from-orange-500 to-rose-600',
      bgGradient: 'from-orange-50 to-rose-50',
      duration: '12-15 minutes',
      questions: 30,
      description: 'Measures current stress levels, resilience capacity and protective factors for well-being.',
      longDescription: `The Stress & Resilience Assessment provides a comprehensive snapshot of the employee's current well-being, measuring both stress factors and the resilience resources they possess to cope with them.

Stress is not inherently negative. "Eustress" or positive stress can drive performance and growth. However, chronic or excessive stress (distress) has proven negative effects on physical health, mental health, and work performance.

Resilience is the ability to bounce back from adversity and adapt positively to difficult circumstances. It is not a fixed trait but a set of skills that can be developed with intentional practice.

This assessment identifies specific risk factors, protective factors, and provides personalized recommendations to improve well-being and build greater resilience.`,
      dimensions: [
        { name: 'Work Stress', color: 'bg-red-500', description: 'Level of pressure and tension experienced in the work environment', traits: ['Workload', 'Time pressure', 'Job demands', 'Role conflicts'], characteristics: 'Measures the intensity of current job demands and how they are impacting well-being. Includes factors such as overload, deadlines, role ambiguity and conflicts at work.' },
        { name: 'Recovery Capacity', color: 'bg-green-500', description: 'Ability to recover from stressful situations and adversity', traits: ['Emotional bounce-back', 'Adaptability', 'Optimism', 'Persistence'], characteristics: 'Evaluates how quickly and effectively a person can regain their balance after difficult situations. Includes mental flexibility and ability to see opportunities in challenges.' },
        { name: 'Social Support', color: 'bg-blue-500', description: 'Network of relationships that provides emotional and practical support', traits: ['Support network', 'Meaningful connections', 'Availability of help', 'Belonging'], characteristics: 'Measures the quality and availability of supportive relationships. Social support is one of the most powerful protective factors against stress.' },
        { name: 'Emotional Self-Regulation', color: 'bg-purple-500', description: 'Ability to manage one\'s own emotions in a healthy way', traits: ['Emotion management', 'Calm under pressure', 'Impulse control', 'Healthy expression'], characteristics: 'Evaluates the ability to recognize, understand, and manage one\'s own emotions constructively, especially in pressure situations.' },
        { name: 'Physical Well-being', color: 'bg-emerald-500', description: 'Physical health status and habits that impact resilience', traits: ['Sleep', 'Exercise', 'Nutrition', 'Energy'], characteristics: 'Measures physical health factors that directly impact the ability to handle stress. Includes sleep quality, physical activity and self-care habits.' }
      ],
      useCases: [
        { title: 'Burnout Prevention', description: 'Identify employees at risk of burnout before it occurs, allowing timely preventive interventions.', icon: 'Activity' },
        { title: 'Wellness Programs', description: 'Design wellness programs based on the real needs identified in teams.', icon: 'Heart' },
        { title: 'Post-Leave Return', description: 'Evaluate readiness of employees returning from medical leave or periods of high pressure.', icon: 'Users' },
        { title: 'Resilience Coaching', description: 'Identify specific areas to build greater resilience through personalized coaching.', icon: 'Lightbulb' }
      ],
      tips: [
        'Stress is not always negative - "eustress" can drive performance and personal growth',
        'Resilience is developable - it\'s not a fixed trait we\'re born with',
        'Social support is one of the most powerful protective factors - invest in your relationships',
        'Small consistent actions (sleep, exercise, breaks) have more impact than large sporadic changes'
      ],
      examples: [
        { scenario: 'High work stress but high resilience and social support', insight: 'Although under significant pressure, has resources to cope. Monitor to prevent resource exhaustion. Consider reducing stress sources if possible.' },
        { scenario: 'Moderate stress but low recovery capacity', insight: 'Even moderate levels of pressure can accumulate without good bounce-back capacity. Prioritize developing self-regulation skills and recovery techniques.' }
      ],
      faqs: [
        { question: 'Is stress always bad?', answer: 'No. Moderate and manageable stress (eustress) can improve performance, motivation and personal growth. The problem is chronic or excessive stress that overwhelms coping resources.' },
        { question: 'Can resilience be developed?', answer: 'Absolutely. Resilience is a set of skills that can be developed with practice. Techniques such as mindfulness, cognitive restructuring and building social support are effective.' },
        { question: 'How often should I be evaluated?', answer: 'We recommend every 3-6 months or after significant changes (new role, restructuring, major life events). This allows identifying trends and adjusting strategies.' }
      ]
    }
  },
  'pruebas-tecnicas': {
    es: {
      name: 'Pruebas Técnicas',
      fullName: 'Evaluación Técnica por Cargo',
      icon: 'FileCode',
      color: 'sky',
      gradient: 'from-sky-500 to-cyan-600',
      bgGradient: 'from-sky-50 to-cyan-50',
      duration: '25-35 minutos',
      questions: 20,
      description: 'Evalúa conocimientos técnicos específicos para más de 225 cargos con preguntas clasificadas por nivel de dificultad.',
      longDescription: `Las Pruebas Técnicas de Reclu evalúan el conocimiento específico del cargo de manera objetiva y estandarizada. Con más de 13,700 preguntas distribuidas en más de 225 posiciones diferentes, nuestro sistema selecciona automáticamente las preguntas más relevantes para el cargo que está evaluando.

Las preguntas están clasificadas en tres niveles de dificultad: Básico (15%), Intermedio (25%) y Avanzado (60%), lo que permite una evaluación precisa del nivel de expertise del candidato. Esto garantiza que no solo sepa los conceptos básicos, sino que pueda aplicarlos en situaciones complejas.

A diferencia de las evaluaciones psicométricas que miden rasgos de personalidad, las pruebas técnicas evalúan conocimiento factual y habilidades específicas del rol. Son el complemento perfecto para formar un perfil completo del candidato.`,
      dimensions: [
        { name: 'Nivel Básico', color: 'bg-green-500', description: 'Conocimientos fundamentales del área', traits: ['Conceptos clave', 'Terminología', 'Procedimientos básicos', 'Herramientas esenciales'], characteristics: '15% de las preguntas evalúan que el candidato domina los fundamentos esenciales para desempeñarse en el cargo.' },
        { name: 'Nivel Intermedio', color: 'bg-yellow-500', description: 'Aplicación práctica del conocimiento', traits: ['Resolución de problemas', 'Casos de uso', 'Mejores prácticas', 'Integración de conceptos'], characteristics: '25% de las preguntas miden la capacidad de aplicar conocimientos en situaciones prácticas del día a día.' },
        { name: 'Nivel Avanzado', color: 'bg-red-500', description: 'Expertise y dominio profundo', traits: ['Casos complejos', 'Optimización', 'Arquitectura', 'Liderazgo técnico'], characteristics: '60% de las preguntas evalúan conocimiento avanzado y capacidad de resolver problemas complejos.' }
      ],
      useCases: [
        { title: 'Filtrado de Candidatos', description: 'Identificar rápidamente a los candidatos con el nivel técnico adecuado para el cargo, ahorrando tiempo en entrevistas.', icon: 'Users' },
        { title: 'Validación de CVs', description: 'Verificar de forma objetiva las habilidades declaradas en el currículum del candidato.', icon: 'FileText' },
        { title: 'Benchmarking de Equipo', description: 'Evaluar el nivel técnico actual de tu equipo para identificar brechas y planificar capacitación.', icon: 'BarChart3' },
        { title: 'Promociones Internas', description: 'Evaluar candidatos internos de forma objetiva para ascensos o cambios de rol técnico.', icon: 'Briefcase' }
      ],
      tips: [
        'Combina la prueba técnica con evaluaciones psicométricas para un perfil completo',
        'Las preguntas se seleccionan automáticamente según el cargo específico',
        'Los resultados muestran fortalezas y áreas de mejora por categoría técnica',
        'El tiempo promedio por pregunta indica no solo conocimiento sino confianza'
      ],
      examples: [
        { scenario: 'Candidato con 90% en básico e intermedio pero 50% en avanzado', insight: 'Tiene sólidos fundamentos pero necesita desarrollo para roles senior. Excelente para posiciones mid-level con mentoring.' },
        { scenario: 'Candidato con alto rendimiento en avanzado pero bajo en básico', insight: 'Posible especialista que ha olvidado fundamentos o ha saltado etapas. Verificar en entrevista técnica presencial.' }
      ],
      faqs: [
        { question: '¿Cuántas preguntas tiene la evaluación?', answer: 'Cada evaluación técnica consta de 20 preguntas seleccionadas específicamente para el cargo. La distribución es: 3 básicas (15%), 5 intermedias (25%) y 12 avanzadas (60%).' },
        { question: '¿Qué cargos cubren las pruebas?', answer: 'Cubrimos más de 225 cargos en tecnología, administración, finanzas, marketing, RRHH, ventas, ingeniería, diseño, legal y más. El sistema selecciona preguntas específicas para cada puesto.' },
        { question: '¿Se pueden personalizar las preguntas?', answer: 'Las preguntas están estandarizadas para garantizar comparabilidad entre candidatos. Sin embargo, puedes seleccionar el cargo específico que mejor se ajuste a tu vacante.' }
      ]
    },
    en: {
      name: 'Technical Tests',
      fullName: 'Position-Based Technical Assessment',
      icon: 'FileCode',
      color: 'sky',
      gradient: 'from-sky-500 to-cyan-600',
      bgGradient: 'from-sky-50 to-cyan-50',
      duration: '25-35 minutes',
      questions: 20,
      description: 'Evaluates specific technical knowledge for 225+ positions with questions classified by difficulty level.',
      longDescription: `Reclu's Technical Tests evaluate position-specific knowledge objectively and in a standardized way. With over 13,700 questions distributed across more than 225 different positions, our system automatically selects the most relevant questions for the position you're evaluating.

Questions are classified into three difficulty levels: Basic (15%), Intermediate (25%), and Advanced (60%), allowing for precise assessment of the candidate's expertise level. This ensures they not only know basic concepts but can apply them in complex situations.

Unlike psychometric assessments that measure personality traits, technical tests evaluate factual knowledge and role-specific skills. They're the perfect complement to form a complete candidate profile.`,
      dimensions: [
        { name: 'Basic Level', color: 'bg-green-500', description: 'Fundamental knowledge of the area', traits: ['Key concepts', 'Terminology', 'Basic procedures', 'Essential tools'], characteristics: '15% of questions evaluate that the candidate masters the essential fundamentals to perform in the role.' },
        { name: 'Intermediate Level', color: 'bg-yellow-500', description: 'Practical application of knowledge', traits: ['Problem solving', 'Use cases', 'Best practices', 'Concept integration'], characteristics: '25% of questions measure the ability to apply knowledge in practical day-to-day situations.' },
        { name: 'Advanced Level', color: 'bg-red-500', description: 'Deep expertise and mastery', traits: ['Complex cases', 'Optimization', 'Architecture', 'Technical leadership'], characteristics: '60% of questions evaluate advanced knowledge and ability to solve complex problems.' }
      ],
      useCases: [
        { title: 'Candidate Filtering', description: 'Quickly identify candidates with the appropriate technical level for the position, saving interview time.', icon: 'Users' },
        { title: 'CV Validation', description: 'Objectively verify the skills declared in the candidate\'s resume.', icon: 'FileText' },
        { title: 'Team Benchmarking', description: 'Assess your team\'s current technical level to identify gaps and plan training.', icon: 'BarChart3' },
        { title: 'Internal Promotions', description: 'Objectively evaluate internal candidates for promotions or technical role changes.', icon: 'Briefcase' }
      ],
      tips: [
        'Combine technical tests with psychometric assessments for a complete profile',
        'Questions are automatically selected based on the specific position',
        'Results show strengths and improvement areas by technical category',
        'Average time per question indicates not only knowledge but confidence'
      ],
      examples: [
        { scenario: 'Candidate with 90% in basic and intermediate but 50% in advanced', insight: 'Has solid fundamentals but needs development for senior roles. Excellent for mid-level positions with mentoring.' },
        { scenario: 'Candidate with high performance in advanced but low in basic', insight: 'Possible specialist who has forgotten fundamentals or skipped stages. Verify in in-person technical interview.' }
      ],
      faqs: [
        { question: 'How many questions does the assessment have?', answer: 'Each technical assessment consists of 20 questions specifically selected for the position. Distribution is: 3 basic (15%), 5 intermediate (25%), and 12 advanced (60%).' },
        { question: 'What positions do the tests cover?', answer: 'We cover over 225 positions in technology, administration, finance, marketing, HR, sales, engineering, design, legal, and more. The system selects specific questions for each position.' },
        { question: 'Can questions be customized?', answer: 'Questions are standardized to ensure comparability between candidates. However, you can select the specific position that best fits your vacancy.' }
      ]
    }
  }
};

export default function EvaluationDetailClient({ slug }: EvaluationDetailClientProps) {
  const { language, t } = useLanguage();
  
  const evaluationLangs = evaluationsData[slug];
  if (!evaluationLangs) {
    return <div className="p-8 text-center">{language === 'es' ? 'Evaluación no encontrada' : 'Evaluation not found'}</div>;
  }
  
  const evaluation = evaluationLangs[language];
  const Icon = iconMap[evaluation.icon] || Target;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="pt-20 pb-4 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-indigo-600">{t('evaluaciones.footer.home')}</Link>
            <span className="text-gray-400">/</span>
            <Link href="/evaluaciones" className="text-gray-500 hover:text-indigo-600">{t('evaluaciones.footer.evaluations')}</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{evaluation.name}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className={`py-16 bg-gradient-to-br ${evaluation.bgGradient}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1">
              <Link href="/evaluaciones" className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4 text-sm">
                <ArrowLeft className="w-4 h-4" />
                {t('evaluaciones.detail.backTo')}
              </Link>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${evaluation.gradient} flex items-center justify-center shadow-xl`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    {evaluation.duration}
                  </Badge>
                  <Badge variant="secondary">
                    <FileText className="w-3 h-3 mr-1" />
                    {evaluation.questions} {t('evaluaciones.detail.questions')}
                  </Badge>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                {evaluation.fullName}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {evaluation.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth/signup">
                  <Button size="lg" className={`bg-gradient-to-r ${evaluation.gradient}`}>
                    {t('evaluaciones.detail.startEval')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Long Description */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('evaluaciones.detail.whatIs')} {evaluation.name}?</h2>
          <div className="prose prose-lg text-gray-600 whitespace-pre-line">
            {evaluation.longDescription}
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('evaluaciones.detail.dimensions')}</h2>
            <p className="text-xl text-gray-600">{t('evaluaciones.detail.dimensionsSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evaluation.dimensions.map((dim: any, idx: number) => (
              <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-4 h-4 rounded-full ${dim.color}`}></div>
                    <h3 className="font-bold text-gray-900">{dim.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{dim.description}</p>
                  <p className="text-sm text-gray-500 mb-3">{dim.characteristics}</p>
                  <div className="flex flex-wrap gap-1">
                    {dim.traits.map((trait: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('evaluaciones.detail.useCases')}</h2>
            <p className="text-xl text-gray-600">{t('evaluaciones.detail.useCasesPrefix')} {evaluation.name}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {evaluation.useCases.map((useCase: any, idx: number) => {
              const UseCaseIcon = iconMap[useCase.icon] || Target;
              return (
                <Card key={idx} className={`border-0 shadow-lg bg-gradient-to-br ${evaluation.bgGradient}`}>
                  <CardContent className="p-6">
                    <UseCaseIcon className={`w-10 h-10 text-${evaluation.color}-600 mb-4`} />
                    <h3 className="font-bold text-gray-900 mb-2">{useCase.title}</h3>
                    <p className="text-sm text-gray-600">{useCase.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('evaluaciones.detail.examples')}</h2>
            <p className="text-xl text-gray-600">{t('evaluaciones.detail.examplesSubtitle')}</p>
          </div>
          <div className="space-y-6">
            {evaluation.examples.map((example: any, idx: number) => (
              <Card key={idx} className={`border-0 shadow-lg bg-gradient-to-r ${evaluation.bgGradient}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${evaluation.gradient} flex items-center justify-center flex-shrink-0`}>
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{example.scenario}</h3>
                      <p className="text-gray-700">{example.insight}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('evaluaciones.detail.tips')}</h2>
            <p className="text-xl text-gray-600">{t('evaluaciones.detail.tipsPrefix')} {evaluation.name}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {evaluation.tips.map((tip: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('evaluaciones.detail.faqs')}</h2>
            <p className="text-xl text-gray-600">{t('evaluaciones.detail.faqsPrefix')} {evaluation.name}</p>
          </div>
          <div className="space-y-4">
            {evaluation.faqs.map((faq: any, idx: number) => (
              <Card key={idx} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-20 bg-gradient-to-r ${evaluation.gradient} text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Icon className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('evaluaciones.detail.startWith')} {evaluation.name} {t('evaluaciones.detail.today')}
          </h2>
          <p className="text-xl text-white/80 mb-8">
            {t('evaluaciones.detail.createAccount')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 px-8">
                {t('evaluaciones.createFreeAccount')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/evaluaciones">
              <Button size="lg" className="bg-white/20 text-white hover:bg-white/30 border border-white/30 px-8">
                {t('evaluaciones.detail.seeOther')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Reclu</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">{t('evaluaciones.footer.home')}</Link>
              <Link href="/evaluaciones" className="hover:text-white transition-colors">{t('evaluaciones.footer.evaluations')}</Link>
              <Link href="/terms" className="hover:text-white transition-colors">{t('evaluaciones.footer.terms')}</Link>
            </div>
            <p className="text-sm text-gray-500">© 2026 Reclu. {t('evaluaciones.footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
