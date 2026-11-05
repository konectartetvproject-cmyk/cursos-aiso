import { CorporateProgram } from '../types';

export const corporatePrograms: CorporateProgram[] = [
  {
    id: "oratoria-corporativa",
    title: "Oratoria y Comunicación Efectiva",
    subtitle: "Programa Profundo para Equipos y Líderes",
    duration: "6 Clases completas",
    format: "Programa presencial integral",
    pricePerPerson: 100,
    targetAudience: "Ejecutivos, equipos de ventas, directores y portavoces corporativos",
    description: "Un programa profundo diseñado para erradicar el miedo escénico y dotar a los profesionales de técnicas de persuasión, estructuración de mensajes y proyección vocal.",
    points: [
      "Estructuración de discursos persuasivos.",
      "Manejo del lenguaje corporal y modulación vocal.",
      "Impacto en presentaciones y reuniones de alto nivel."
    ]
  },
  {
    id: "liderazgo-estrategico",
    title: "Liderazgo Estratégico",
    subtitle: "Habilidades Directivas y Gestión de Equipos",
    duration: "Taller intensivo",
    format: "Taller práctico intensivo",
    pricePerPerson: 40,
    targetAudience: "Gerentes, jefes de departamento, coordinadores y líderes de proyecto",
    description: "Enfocado en desarrollar habilidades directivas para gestionar equipos de alto rendimiento, tomar decisiones asertivas bajo presión y gestionar el cambio dentro de la organización.",
    points: [
      "Técnicas de motivación y desarrollo de equipos.",
      "Resolución de conflictos y negociación.",
      "Gestión del cambio organizacional."
    ]
  },
  {
    id: "atencion-servicio",
    title: "Atención al Cliente y Calidad de Servicio",
    subtitle: "Experiencias de Cliente Excepcionales",
    duration: "Taller intensivo",
    format: "Taller práctico intensivo",
    pricePerPerson: 40,
    targetAudience: "Fuerza de ventas, personal de atención, soporte y ejecutivos de cuenta",
    description: "Capacitación orientada a crear experiencias de cliente excepcionales, fidelizar a los consumidores y manejar situaciones críticas con profesionalismo y empatía.",
    points: [
      "Protocolos de atención con excelencia.",
      "Manejo de clientes difíciles y resolución de quejas.",
      "Estrategias de fidelización a largo plazo."
    ]
  }
];

export const corporateGeneralInfo = {
  title: "Formación Corporativa Integral de Alto Impacto",
  institution: "Academia AISO",
  institutionFull: "Academia Internacional de Oratoria Social",
  whyInvestTitle: "¿Por qué invertir en la formación de su equipo?",
  whyInvestText: "El éxito de una empresa se fundamenta en la capacidad de su talento humano para comunicarse con claridad, liderar con propósito y brindar una experiencia memorable al cliente. En Academia AISO, transformamos el potencial de su equipo en resultados tangibles, impulsando la productividad, mejorando el clima laboral y aumentando directamente las ventas a través de herramientas prácticas y de aplicación inmediata.",
  methodologyTitle: "Nuestra Metodología",
  methodologyText: "Utilizamos un enfoque de aprendizaje inmersivo y altamente práctico. Sabemos que cada empresa es única, por lo que nuestra metodología se adapta completamente a las necesidades específicas, cultura y objetivos de su organización. A través de dinámicas, simulaciones de casos reales y retroalimentación constante, garantizamos que lo aprendido en el aula se traslade directamente al puesto de trabajo.",
  modalities: [
    {
      title: "Formación In-Company",
      badge: "Cobertura Nacional",
      description: "Nos trasladamos a las instalaciones de su empresa, sin importar la ubicación. Contamos con disponibilidad de facilitadores altamente capacitados para dictar clases en todo el territorio nacional."
    },
    {
      title: "Instalaciones AISO",
      badge: "Caracas y Valencia",
      description: "Si prefiere un ambiente externo para sacar a su equipo de la rutina, ponemos a su disposición nuestras cómodas instalaciones ubicadas en Caracas (C.C. Millennium Mall) y Valencia (Auditorio AISO en Urb. La Viña)."
    }
  ],
  locations: "Sedes: Caracas y Valencia | Cobertura Nacional In-Company",
  quoteNotice: "Contáctenos para solicitar una propuesta volumétrica o un plan de capacitación integral que agrupe varios programas para distintos departamentos de su empresa."
};
