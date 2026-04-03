import { JOB_POSITIONS, JobPosition, JOB_CATEGORIES } from './job-positions';

export interface GeneratedQuestion {
  questionText: string;
  questionTextEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionAEn: string;
  optionBEn: string;
  optionCEn: string;
  optionDEn: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  categoryEn: string;
}

const LLM_API_URL = 'https://api.abacus.ai/v1/chat/completions';

// Question categories with translations
const QUESTION_CATEGORIES = {
  TECHNICAL_KNOWLEDGE: { es: 'Conocimientos Técnicos', en: 'Technical Knowledge' },
  PROBLEM_SOLVING: { es: 'Resolución de Problemas', en: 'Problem Solving' },
  DECISION_MAKING: { es: 'Toma de Decisiones', en: 'Decision Making' },
  BEST_PRACTICES: { es: 'Mejores Prácticas', en: 'Best Practices' },
  PRACTICAL_CASES: { es: 'Casos Prácticos', en: 'Practical Cases' },
};

export async function generateQuestionsForPosition(
  jobPositionId: string,
  count: number = 20
): Promise<GeneratedQuestion[]> {
  const position = JOB_POSITIONS.find(p => p.id === jobPositionId);
  
  if (!position) {
    throw new Error(`Job position not found: ${jobPositionId}`);
  }

  const categoryInfo = JOB_CATEGORIES[position.category];
  
  try {
    // Generate questions in Spanish first
    const spanishQuestions = await generateQuestionsBatch(position, categoryInfo, count, 'es');
    
    // Then generate English translations
    const bilingualQuestions = await translateQuestionsToEnglish(spanishQuestions, position);
    
    // Validate we have enough unique questions
    if (bilingualQuestions.length < count) {
      console.warn(`Only generated ${bilingualQuestions.length} questions, expected ${count}`);
    }
    
    return bilingualQuestions;
  } catch (error) {
    console.error('Error generating questions:', error);
    // Return fallback questions if LLM fails
    return generateFallbackQuestions(position, count);
  }
}

async function generateQuestionsBatch(
  position: JobPosition,
  categoryInfo: { name: string },
  count: number,
  language: 'es' | 'en'
): Promise<Partial<GeneratedQuestion>[]> {
  const prompt = buildPrompt(position, categoryInfo, count, language);
  
  const response = await fetch(LLM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet',
      messages: [
        {
          role: 'system',
          content: language === 'es' 
            ? `Eres un experto en recursos humanos y evaluación de talento técnico. Tu tarea es crear preguntas de evaluación técnica MUY ESPECÍFICAS y PROFESIONALES para puestos de trabajo. Las preguntas deben:
1. Ser altamente específicas para el cargo indicado
2. Evaluar conocimientos prácticos y aplicados del puesto
3. Incluir escenarios de trabajo reales
4. Tener 4 opciones donde SOLO UNA es correcta
5. Las opciones incorrectas deben ser plausibles pero claramente erróneas para un profesional
6. NO repetir preguntas ni conceptos
7. Cubrir diferentes aspectos del cargo

Responde SIEMPRE en formato JSON válido sin texto adicional.`
            : `You are an expert in HR and technical talent evaluation. Your task is to create HIGHLY SPECIFIC and PROFESSIONAL technical assessment questions for job positions. Questions must:
1. Be highly specific to the indicated role
2. Evaluate practical, applied knowledge of the position
3. Include real work scenarios
4. Have 4 options where ONLY ONE is correct
5. Incorrect options must be plausible but clearly wrong to a professional
6. NOT repeat questions or concepts
7. Cover different aspects of the role

ALWAYS respond in valid JSON format without additional text.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 12000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('LLM API error:', errorText);
    throw new Error('Failed to generate questions from LLM');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No content in LLM response');
  }

  return parseQuestionsFromResponse(content);
}

async function translateQuestionsToEnglish(
  spanishQuestions: Partial<GeneratedQuestion>[],
  position: JobPosition
): Promise<GeneratedQuestion[]> {
  const prompt = buildTranslationPrompt(spanishQuestions, position);
  
  try {
    const response = await fetch(LLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in HR and technical content. Translate the following technical evaluation questions from Spanish to English. Maintain:
1. Technical accuracy
2. Professional tone
3. The SAME answer letter (A, B, C, D) must remain correct after translation
4. Preserve difficulty levels and categories

Respond ONLY with valid JSON format.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 12000,
      }),
    });

    if (!response.ok) {
      console.error('Translation API error');
      // Return questions with placeholder English text
      return spanishQuestions.map(q => ({
        ...q,
        questionTextEn: q.questionText || '',
        optionAEn: q.optionA || '',
        optionBEn: q.optionB || '',
        optionCEn: q.optionC || '',
        optionDEn: q.optionD || '',
        categoryEn: getCategoryEnglish(q.category || ''),
      } as GeneratedQuestion));
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No translation content');
    }

    const translations = parseTranslationsFromResponse(content);
    
    // Merge Spanish and English
    return spanishQuestions.map((sq, index) => {
      const translation = translations[index] || {};
      return {
        questionText: sq.questionText || '',
        questionTextEn: translation.questionTextEn || sq.questionText || '',
        optionA: sq.optionA || '',
        optionB: sq.optionB || '',
        optionC: sq.optionC || '',
        optionD: sq.optionD || '',
        optionAEn: translation.optionAEn || sq.optionA || '',
        optionBEn: translation.optionBEn || sq.optionB || '',
        optionCEn: translation.optionCEn || sq.optionC || '',
        optionDEn: translation.optionDEn || sq.optionD || '',
        correctAnswer: sq.correctAnswer || 'A',
        difficulty: sq.difficulty || 'MEDIUM',
        category: sq.category || 'Conocimientos Técnicos',
        categoryEn: translation.categoryEn || getCategoryEnglish(sq.category || ''),
      } as GeneratedQuestion;
    });
  } catch (error) {
    console.error('Translation error:', error);
    // Return with placeholder translations
    return spanishQuestions.map(q => ({
      ...q,
      questionTextEn: q.questionText || '',
      optionAEn: q.optionA || '',
      optionBEn: q.optionB || '',
      optionCEn: q.optionC || '',
      optionDEn: q.optionD || '',
      categoryEn: getCategoryEnglish(q.category || ''),
    } as GeneratedQuestion));
  }
}

function getCategoryEnglish(spanishCategory: string): string {
  const mapping: Record<string, string> = {
    'Conocimientos Técnicos': 'Technical Knowledge',
    'Resolución de Problemas': 'Problem Solving',
    'Toma de Decisiones': 'Decision Making',
    'Mejores Prácticas': 'Best Practices',
    'Casos Prácticos': 'Practical Cases',
    'Conocimientos Específicos': 'Specific Knowledge',
    'Habilidades del Cargo': 'Job Skills',
    'Normativas y Regulaciones': 'Regulations & Compliance',
    'Herramientas y Tecnología': 'Tools & Technology',
    'Gestión de Proyectos': 'Project Management',
    'Comunicación Profesional': 'Professional Communication',
    'Análisis y Datos': 'Analysis & Data',
    'Liderazgo': 'Leadership',
    'Trabajo en Equipo': 'Teamwork',
    'Atención al Cliente': 'Customer Service',
  };
  return mapping[spanishCategory] || 'Technical Knowledge';
}

function buildPrompt(position: JobPosition, categoryInfo: { name: string }, count: number, language: 'es' | 'en'): string {
  // Distribution: 15% easy, 25% medium, 60% hard
  const easyCount = Math.round(count * 0.15);
  const mediumCount = Math.round(count * 0.25);
  const hardCount = count - easyCount - mediumCount;

  if (language === 'es') {
    return `Genera exactamente ${count} preguntas ÚNICAS de evaluación técnica para el cargo de "${position.title}" en la categoría "${categoryInfo.name}".

INFORMACIÓN DEL CARGO:
- Título: ${position.title}
- Categoría: ${categoryInfo.name}
- Subcategoría: ${position.subcategory}
- Palabras clave relacionadas: ${position.keywords.join(', ')}
- Sinónimos del cargo: ${position.synonyms.join(', ')}

DISTRIBUCIÓN DE DIFICULTAD (obligatoria - énfasis en preguntas difíciles):
- ${easyCount} preguntas FÁCILES (EASY): Conceptos básicos, definiciones fundamentales (15%)
- ${mediumCount} preguntas INTERMEDIAS (MEDIUM): Aplicación práctica, escenarios comunes (25%)
- ${hardCount} preguntas DIFÍCILES (HARD): Casos complejos, decisiones críticas, situaciones avanzadas (60%)

CATEGORÍAS A CUBRIR (distribuir equitativamente):
1. Conocimientos Técnicos - Fundamentos y teoría del cargo
2. Resolución de Problemas - Cómo abordar desafíos típicos
3. Toma de Decisiones - Criterios y prioridades profesionales
4. Mejores Prácticas - Estándares de la industria y metodologías
5. Casos Prácticos - Escenarios reales de trabajo

REQUISITOS CRÍTICOS:
1. CADA PREGUNTA DEBE SER ÚNICA - No repetir conceptos ni situaciones
2. Las preguntas deben ser MUY ESPECÍFICAS para "${position.title}", no genéricas
3. Incluir terminología técnica real del campo
4. Las 4 opciones deben ser plausibles pero SOLO UNA correcta
5. Las opciones incorrectas deben ser errores comunes que un profesional experimentado identificaría
6. Contextualizar con situaciones laborales reales

FORMATO JSON ESTRICTO (no incluir texto fuera del JSON):
{
  "questions": [
    {
      "questionText": "Pregunta completa y específica aquí",
      "optionA": "Primera opción",
      "optionB": "Segunda opción",
      "optionC": "Tercera opción",
      "optionD": "Cuarta opción",
      "correctAnswer": "A",
      "difficulty": "EASY",
      "category": "Conocimientos Técnicos"
    }
  ]
}

Genera las ${count} preguntas ÚNICAS ahora:`;
  } else {
    return `Generate exactly ${count} UNIQUE technical evaluation questions for the "${position.title}" position in the "${categoryInfo.name}" category.

JOB INFORMATION:
- Title: ${position.title}
- Category: ${categoryInfo.name}
- Subcategory: ${position.subcategory}
- Related keywords: ${position.keywords.join(', ')}
- Job synonyms: ${position.synonyms.join(', ')}

DIFFICULTY DISTRIBUTION (mandatory - emphasis on hard questions):
- ${easyCount} EASY questions: Basic concepts, fundamental definitions (15%)
- ${mediumCount} MEDIUM questions: Practical application, common scenarios (25%)
- ${hardCount} HARD questions: Complex cases, critical decisions, advanced situations (60%)

CATEGORIES TO COVER (distribute evenly):
1. Technical Knowledge - Job fundamentals and theory
2. Problem Solving - How to approach typical challenges
3. Decision Making - Professional criteria and priorities
4. Best Practices - Industry standards and methodologies
5. Practical Cases - Real work scenarios

CRITICAL REQUIREMENTS:
1. EACH QUESTION MUST BE UNIQUE - Do not repeat concepts or situations
2. Questions must be VERY SPECIFIC to "${position.title}", not generic
3. Include real technical terminology from the field
4. All 4 options must be plausible but ONLY ONE correct
5. Incorrect options should be common errors that an experienced professional would identify
6. Contextualize with real work situations

STRICT JSON FORMAT (do not include text outside the JSON):
{
  "questions": [
    {
      "questionText": "Complete and specific question here",
      "optionA": "First option",
      "optionB": "Second option",
      "optionC": "Third option",
      "optionD": "Fourth option",
      "correctAnswer": "A",
      "difficulty": "EASY",
      "category": "Technical Knowledge"
    }
  ]
}

Generate the ${count} UNIQUE questions now:`;
  }
}

function buildTranslationPrompt(questions: Partial<GeneratedQuestion>[], position: JobPosition): string {
  const questionsJson = JSON.stringify(questions.map((q, i) => ({
    index: i,
    questionText: q.questionText,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    category: q.category,
    correctAnswer: q.correctAnswer,
  })), null, 2);

  return `Translate the following ${questions.length} technical evaluation questions for the "${position.title}" position from Spanish to English.

IMPORTANT:
1. Maintain technical accuracy - use proper English technical terminology
2. Keep the SAME correct answer letter (the correct answer must remain the same option)
3. Preserve the meaning and difficulty level
4. Use professional HR/recruitment language

QUESTIONS TO TRANSLATE:
${questionsJson}

RESPOND WITH THIS EXACT JSON FORMAT:
{
  "translations": [
    {
      "index": 0,
      "questionTextEn": "English question text",
      "optionAEn": "English option A",
      "optionBEn": "English option B",
      "optionCEn": "English option C",
      "optionDEn": "English option D",
      "categoryEn": "English category name"
    }
  ]
}

Translate all ${questions.length} questions now:`;
}

function parseQuestionsFromResponse(content: string): Partial<GeneratedQuestion>[] {
  try {
    let jsonStr = content;
    
    // If wrapped in markdown code blocks, extract it
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    
    // Try to find JSON object in the string
    const startIdx = jsonStr.indexOf('{');
    const endIdx = jsonStr.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
      jsonStr = jsonStr.slice(startIdx, endIdx + 1);
    }

    const parsed = JSON.parse(jsonStr);
    const questions = parsed.questions || parsed;

    if (!Array.isArray(questions)) {
      throw new Error('Questions is not an array');
    }

    // Validate and deduplicate questions
    const seenQuestions = new Set<string>();
    const uniqueQuestions: Partial<GeneratedQuestion>[] = [];

    for (const q of questions) {
      const questionKey = (q.questionText || q.question || '').toLowerCase().trim();
      if (questionKey && !seenQuestions.has(questionKey)) {
        seenQuestions.add(questionKey);
        uniqueQuestions.push({
          questionText: q.questionText || q.question || '',
          optionA: q.optionA || q.options?.[0] || '',
          optionB: q.optionB || q.options?.[1] || '',
          optionC: q.optionC || q.options?.[2] || '',
          optionD: q.optionD || q.options?.[3] || '',
          correctAnswer: validateAnswer(q.correctAnswer || q.correct || 'A'),
          difficulty: validateDifficulty(q.difficulty || 'MEDIUM'),
          category: q.category || 'Conocimientos Técnicos',
        });
      }
    }

    return uniqueQuestions;
  } catch (error) {
    console.error('Error parsing questions:', error);
    throw new Error('Failed to parse LLM response');
  }
}

function parseTranslationsFromResponse(content: string): Array<{
  index: number;
  questionTextEn: string;
  optionAEn: string;
  optionBEn: string;
  optionCEn: string;
  optionDEn: string;
  categoryEn: string;
}> {
  try {
    let jsonStr = content;
    
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    
    const startIdx = jsonStr.indexOf('{');
    const endIdx = jsonStr.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
      jsonStr = jsonStr.slice(startIdx, endIdx + 1);
    }

    const parsed = JSON.parse(jsonStr);
    return parsed.translations || [];
  } catch (error) {
    console.error('Error parsing translations:', error);
    return [];
  }
}

function validateAnswer(answer: string): 'A' | 'B' | 'C' | 'D' {
  const normalized = answer.toUpperCase().trim();
  if (['A', 'B', 'C', 'D'].includes(normalized)) {
    return normalized as 'A' | 'B' | 'C' | 'D';
  }
  return 'A';
}

function validateDifficulty(difficulty: string): 'EASY' | 'MEDIUM' | 'HARD' {
  const normalized = difficulty.toUpperCase().trim();
  if (['EASY', 'MEDIUM', 'HARD'].includes(normalized)) {
    return normalized as 'EASY' | 'MEDIUM' | 'HARD';
  }
  return 'MEDIUM';
}

function generateFallbackQuestions(position: JobPosition, count: number): GeneratedQuestion[] {
  const categoryInfo = JOB_CATEGORIES[position.category];
  const questions: GeneratedQuestion[] = [];
  
  // Generate 20+ fallback questions specific to common job types
  const templates = getFallbackTemplates(position, categoryInfo);
  
  // Distribution: 15% easy (3), 25% medium (5), 60% hard (12) for 20 questions
  const easyCount = Math.round(count * 0.15);
  const mediumCount = Math.round(count * 0.25);
  
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    // First 3 easy, next 5 medium, remaining 12 hard
    const difficulty: 'EASY' | 'MEDIUM' | 'HARD' = i < easyCount ? 'EASY' : i < (easyCount + mediumCount) ? 'MEDIUM' : 'HARD';
    
    questions.push({
      questionText: template.questionText.replace('{TITLE}', position.title).replace('{CATEGORY}', categoryInfo.name),
      questionTextEn: template.questionTextEn.replace('{TITLE}', position.title).replace('{CATEGORY}', categoryInfo.name),
      optionA: template.optionA,
      optionB: template.optionB,
      optionC: template.optionC,
      optionD: template.optionD,
      optionAEn: template.optionAEn,
      optionBEn: template.optionBEn,
      optionCEn: template.optionCEn,
      optionDEn: template.optionDEn,
      correctAnswer: template.correctAnswer,
      difficulty,
      category: template.category,
      categoryEn: template.categoryEn,
    });
  }
  
  return questions;
}

function getFallbackTemplates(position: JobPosition, categoryInfo: { name: string }): GeneratedQuestion[] {
  return [
    {
      questionText: `¿Cuál es la principal responsabilidad de un/a {TITLE} en el área de {CATEGORY}?`,
      questionTextEn: `What is the main responsibility of a {TITLE} in the {CATEGORY} area?`,
      optionA: 'Planificar, ejecutar y supervisar las actividades del área de manera efectiva',
      optionAEn: 'Plan, execute and supervise area activities effectively',
      optionB: 'Realizar únicamente tareas administrativas básicas',
      optionBEn: 'Perform only basic administrative tasks',
      optionC: 'Delegar todas las responsabilidades a subordinados',
      optionCEn: 'Delegate all responsibilities to subordinates',
      optionD: 'Enfocarse exclusivamente en la documentación',
      optionDEn: 'Focus exclusively on documentation',
      correctAnswer: 'A',
      difficulty: 'EASY',
      category: 'Conocimientos Básicos',
      categoryEn: 'Basic Knowledge',
    },
    {
      questionText: `¿Qué competencia es más crítica para desempeñarse exitosamente como {TITLE}?`,
      questionTextEn: `What competency is most critical to perform successfully as a {TITLE}?`,
      optionA: 'Conocimiento técnico especializado y capacidad de análisis',
      optionAEn: 'Specialized technical knowledge and analytical capacity',
      optionB: 'Únicamente habilidades de comunicación verbal',
      optionBEn: 'Only verbal communication skills',
      optionC: 'Experiencia exclusiva en ventas',
      optionCEn: 'Exclusive sales experience',
      optionD: 'Conocimientos básicos de ofimática',
      optionDEn: 'Basic office software knowledge',
      correctAnswer: 'A',
      difficulty: 'EASY',
      category: 'Habilidades del Cargo',
      categoryEn: 'Job Skills',
    },
    {
      questionText: `Al enfrentar un problema complejo en su área, ¿cuál debería ser el primer paso de un/a {TITLE}?`,
      questionTextEn: `When facing a complex problem in your area, what should be the first step for a {TITLE}?`,
      optionA: 'Analizar la situación, identificar la causa raíz y evaluar opciones de solución',
      optionAEn: 'Analyze the situation, identify the root cause and evaluate solution options',
      optionB: 'Escalar inmediatamente el problema sin intentar solucionarlo',
      optionBEn: 'Immediately escalate the problem without attempting to solve it',
      optionC: 'Ignorar el problema esperando que se resuelva solo',
      optionCEn: 'Ignore the problem hoping it will resolve itself',
      optionD: 'Culpar a otros departamentos por la situación',
      optionDEn: 'Blame other departments for the situation',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Resolución de Problemas',
      categoryEn: 'Problem Solving',
    },
    {
      questionText: `¿Cómo debe manejar un/a {TITLE} un conflicto con un colega o stakeholder?`,
      questionTextEn: `How should a {TITLE} handle a conflict with a colleague or stakeholder?`,
      optionA: 'Buscar una solución colaborativa mediante diálogo profesional y enfocado en resultados',
      optionAEn: 'Seek a collaborative solution through professional dialogue focused on results',
      optionB: 'Evitar completamente a la persona involucrada',
      optionBEn: 'Completely avoid the person involved',
      optionC: 'Escalar directamente a recursos humanos sin intentar resolver',
      optionCEn: 'Directly escalate to HR without attempting to resolve',
      optionD: 'Confrontar públicamente al colega en una reunión',
      optionDEn: 'Publicly confront the colleague in a meeting',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Trabajo en Equipo',
      categoryEn: 'Teamwork',
    },
    {
      questionText: `¿Cuál es la mejor práctica para la gestión del tiempo en el rol de {TITLE}?`,
      questionTextEn: `What is the best practice for time management in the {TITLE} role?`,
      optionA: 'Priorizar tareas según urgencia e importancia, usando métodos de planificación efectivos',
      optionAEn: 'Prioritize tasks by urgency and importance, using effective planning methods',
      optionB: 'Atender todas las solicitudes en orden de llegada sin priorizar',
      optionBEn: 'Address all requests in order of arrival without prioritizing',
      optionC: 'Trabajar únicamente en tareas que son personalmente interesantes',
      optionCEn: 'Work only on tasks that are personally interesting',
      optionD: 'Delegar todas las tareas urgentes a otros',
      optionDEn: 'Delegate all urgent tasks to others',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Mejores Prácticas',
      categoryEn: 'Best Practices',
    },
    {
      questionText: `Cuando se presenta una situación que requiere una decisión urgente, ¿qué debe considerar un/a {TITLE}?`,
      questionTextEn: `When a situation requiring an urgent decision arises, what should a {TITLE} consider?`,
      optionA: 'Evaluar el impacto en stakeholders, recursos disponibles y alineación con objetivos estratégicos',
      optionAEn: 'Evaluate impact on stakeholders, available resources and alignment with strategic objectives',
      optionB: 'Tomar la primera opción disponible sin análisis',
      optionBEn: 'Take the first available option without analysis',
      optionC: 'Postergar la decisión indefinidamente',
      optionCEn: 'Postpone the decision indefinitely',
      optionD: 'Consultar únicamente con colegas cercanos ignorando datos',
      optionDEn: 'Consult only with close colleagues ignoring data',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Toma de Decisiones',
      categoryEn: 'Decision Making',
    },
    {
      questionText: `¿Cómo debe un/a {TITLE} comunicar resultados negativos a la dirección?`,
      questionTextEn: `How should a {TITLE} communicate negative results to management?`,
      optionA: 'Presentar los hechos con claridad, analizar las causas y proponer un plan de acción correctivo',
      optionAEn: 'Present the facts clearly, analyze the causes and propose a corrective action plan',
      optionB: 'Ocultar la información negativa el mayor tiempo posible',
      optionBEn: 'Hide the negative information as long as possible',
      optionC: 'Minimizar la importancia de los resultados',
      optionCEn: 'Minimize the importance of the results',
      optionD: 'Culpar a factores externos sin proponer soluciones',
      optionDEn: 'Blame external factors without proposing solutions',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Comunicación Profesional',
      categoryEn: 'Professional Communication',
    },
    {
      questionText: `En un proyecto con múltiples stakeholders, ¿cómo debe un/a {TITLE} gestionar las expectativas?`,
      questionTextEn: `In a project with multiple stakeholders, how should a {TITLE} manage expectations?`,
      optionA: 'Establecer comunicación clara, definir alcance realista y mantener actualizaciones periódicas',
      optionAEn: 'Establish clear communication, define realistic scope and maintain periodic updates',
      optionB: 'Prometer todo lo que soliciten sin evaluar viabilidad',
      optionBEn: 'Promise everything requested without evaluating feasibility',
      optionC: 'Ignorar a los stakeholders de menor jerarquía',
      optionCEn: 'Ignore stakeholders of lower hierarchy',
      optionD: 'Comunicarse únicamente al final del proyecto',
      optionDEn: 'Communicate only at the end of the project',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Gestión de Proyectos',
      categoryEn: 'Project Management',
    },
    {
      questionText: `¿Qué indicadores debe monitorear principalmente un/a {TITLE} para evaluar su desempeño?`,
      questionTextEn: `What indicators should a {TITLE} primarily monitor to evaluate their performance?`,
      optionA: 'KPIs alineados con objetivos estratégicos, métricas de calidad y eficiencia',
      optionAEn: 'KPIs aligned with strategic objectives, quality and efficiency metrics',
      optionB: 'Únicamente el número de horas trabajadas',
      optionBEn: 'Only the number of hours worked',
      optionC: 'La cantidad de reuniones atendidas',
      optionCEn: 'The number of meetings attended',
      optionD: 'Solo la satisfacción personal con el trabajo',
      optionDEn: 'Only personal satisfaction with work',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Análisis y Datos',
      categoryEn: 'Analysis & Data',
    },
    {
      questionText: `¿Cómo debe un/a {TITLE} mantenerse actualizado en su área profesional?`,
      questionTextEn: `How should a {TITLE} stay updated in their professional area?`,
      optionA: 'Participar en capacitaciones, seguir tendencias del sector y aplicar aprendizaje continuo',
      optionAEn: 'Participate in training, follow industry trends and apply continuous learning',
      optionB: 'Confiar únicamente en la experiencia acumulada',
      optionBEn: 'Rely only on accumulated experience',
      optionC: 'Esperar a que la empresa proporcione toda la formación',
      optionCEn: 'Wait for the company to provide all training',
      optionD: 'Leer únicamente noticias generales ocasionalmente',
      optionDEn: 'Only occasionally read general news',
      correctAnswer: 'A',
      difficulty: 'EASY',
      category: 'Mejores Prácticas',
      categoryEn: 'Best Practices',
    },
    // Add more fallback questions for variety
    {
      questionText: `¿Cuál es el enfoque correcto para la documentación de procesos como {TITLE}?`,
      questionTextEn: `What is the correct approach to process documentation as a {TITLE}?`,
      optionA: 'Mantener documentación actualizada, clara y accesible para el equipo',
      optionAEn: 'Maintain updated, clear and accessible documentation for the team',
      optionB: 'Documentar solo cuando sea obligatorio por auditoría',
      optionBEn: 'Document only when required by audit',
      optionC: 'Guardar la información solo en correos electrónicos',
      optionCEn: 'Store information only in emails',
      optionD: 'Confiar en la memoria del equipo',
      optionDEn: 'Rely on team memory',
      correctAnswer: 'A',
      difficulty: 'EASY',
      category: 'Mejores Prácticas',
      categoryEn: 'Best Practices',
    },
    {
      questionText: `Ante un error cometido en su trabajo, ¿cómo debe actuar un/a {TITLE}?`,
      questionTextEn: `When a mistake is made in their work, how should a {TITLE} act?`,
      optionA: 'Reconocer el error, analizar la causa, implementar corrección y prevenir recurrencia',
      optionAEn: 'Acknowledge the error, analyze the cause, implement correction and prevent recurrence',
      optionB: 'Ocultar el error esperando que nadie lo note',
      optionBEn: 'Hide the error hoping no one notices',
      optionC: 'Culpar a otros por el error cometido',
      optionCEn: 'Blame others for the error made',
      optionD: 'Minimizar la importancia del error ante superiores',
      optionDEn: 'Minimize the importance of the error to superiors',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Resolución de Problemas',
      categoryEn: 'Problem Solving',
    },
    {
      questionText: `¿Cómo debe un/a {TITLE} priorizar cuando tiene múltiples tareas urgentes?`,
      questionTextEn: `How should a {TITLE} prioritize when having multiple urgent tasks?`,
      optionA: 'Evaluar impacto, deadline y recursos, luego crear un plan de ejecución ordenado',
      optionAEn: 'Evaluate impact, deadline and resources, then create an ordered execution plan',
      optionB: 'Trabajar en todas simultáneamente sin terminar ninguna',
      optionBEn: 'Work on all simultaneously without completing any',
      optionC: 'Elegir solo las tareas más fáciles de completar',
      optionCEn: 'Choose only the easiest tasks to complete',
      optionD: 'Esperar a que otros tomen las decisiones',
      optionDEn: 'Wait for others to make the decisions',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Toma de Decisiones',
      categoryEn: 'Decision Making',
    },
    {
      questionText: `¿Qué debe hacer un/a {TITLE} al recibir feedback negativo sobre su trabajo?`,
      questionTextEn: `What should a {TITLE} do when receiving negative feedback about their work?`,
      optionA: 'Escuchar activamente, reflexionar objetivamente y desarrollar un plan de mejora',
      optionAEn: 'Listen actively, reflect objectively and develop an improvement plan',
      optionB: 'Defender su posición sin considerar el feedback',
      optionBEn: 'Defend their position without considering the feedback',
      optionC: 'Ignorar el feedback si proviene de alguien con menos experiencia',
      optionCEn: 'Ignore feedback if it comes from someone with less experience',
      optionD: 'Tomar el feedback como ataque personal',
      optionDEn: 'Take the feedback as a personal attack',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Comunicación Profesional',
      categoryEn: 'Professional Communication',
    },
    {
      questionText: `¿Cómo debe un/a {TITLE} manejar información confidencial?`,
      questionTextEn: `How should a {TITLE} handle confidential information?`,
      optionA: 'Seguir protocolos de seguridad, compartir solo con autorizados y documentar accesos',
      optionAEn: 'Follow security protocols, share only with authorized persons and document access',
      optionB: 'Compartir libremente con colegas de confianza',
      optionBEn: 'Share freely with trusted colleagues',
      optionC: 'Guardar copias personales por seguridad',
      optionCEn: 'Keep personal copies for security',
      optionD: 'Discutir abiertamente en espacios comunes',
      optionDEn: 'Discuss openly in common spaces',
      correctAnswer: 'A',
      difficulty: 'EASY',
      category: 'Normativas y Regulaciones',
      categoryEn: 'Regulations & Compliance',
    },
    {
      questionText: `En una situación de cambio organizacional, ¿cuál es el rol de un/a {TITLE}?`,
      questionTextEn: `In an organizational change situation, what is the role of a {TITLE}?`,
      optionA: 'Ser agente de cambio, comunicar beneficios y apoyar la transición del equipo',
      optionAEn: 'Be a change agent, communicate benefits and support team transition',
      optionB: 'Resistir el cambio hasta que sea absolutamente necesario',
      optionBEn: 'Resist change until absolutely necessary',
      optionC: 'Esperar instrucciones sin tomar iniciativa',
      optionCEn: 'Wait for instructions without taking initiative',
      optionD: 'Criticar abiertamente los cambios frente al equipo',
      optionDEn: 'Openly criticize changes in front of the team',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Liderazgo',
      categoryEn: 'Leadership',
    },
    {
      questionText: `¿Cómo debe un/a {TITLE} colaborar con otros departamentos?`,
      questionTextEn: `How should a {TITLE} collaborate with other departments?`,
      optionA: 'Mantener comunicación proactiva, entender sus necesidades y buscar sinergias',
      optionAEn: 'Maintain proactive communication, understand their needs and seek synergies',
      optionB: 'Trabajar de forma aislada para evitar conflictos',
      optionBEn: 'Work in isolation to avoid conflicts',
      optionC: 'Competir por recursos sin colaborar',
      optionCEn: 'Compete for resources without collaborating',
      optionD: 'Comunicarse solo cuando hay problemas',
      optionDEn: 'Communicate only when there are problems',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Trabajo en Equipo',
      categoryEn: 'Teamwork',
    },
    {
      questionText: `¿Cuál es la mejor estrategia para un/a {TITLE} al presentar una propuesta a la dirección?`,
      questionTextEn: `What is the best strategy for a {TITLE} when presenting a proposal to management?`,
      optionA: 'Preparar análisis de costo-beneficio, anticipar objeciones y presentar alternativas',
      optionAEn: 'Prepare cost-benefit analysis, anticipate objections and present alternatives',
      optionB: 'Presentar solo los aspectos positivos de la propuesta',
      optionBEn: 'Present only the positive aspects of the proposal',
      optionC: 'Solicitar aprobación sin documentación de respaldo',
      optionCEn: 'Request approval without supporting documentation',
      optionD: 'Presionar para aprobación inmediata sin dar tiempo de análisis',
      optionDEn: 'Push for immediate approval without allowing analysis time',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Comunicación Profesional',
      categoryEn: 'Professional Communication',
    },
    {
      questionText: `¿Qué debe hacer un/a {TITLE} para garantizar la calidad de su trabajo?`,
      questionTextEn: `What should a {TITLE} do to ensure the quality of their work?`,
      optionA: 'Implementar revisiones sistemáticas, seguir estándares y solicitar retroalimentación',
      optionAEn: 'Implement systematic reviews, follow standards and request feedback',
      optionB: 'Entregar rápido asumiendo que otros corregirán errores',
      optionBEn: 'Deliver quickly assuming others will correct errors',
      optionC: 'Revisar solo cuando se lo soliciten específicamente',
      optionCEn: 'Review only when specifically requested',
      optionD: 'Confiar en que la experiencia evita errores',
      optionDEn: 'Trust that experience prevents errors',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Mejores Prácticas',
      categoryEn: 'Best Practices',
    },
    {
      questionText: `Ante recursos limitados, ¿cómo debe actuar un/a {TITLE}?`,
      questionTextEn: `When faced with limited resources, how should a {TITLE} act?`,
      optionA: 'Optimizar uso de recursos, priorizar actividades críticas y comunicar restricciones',
      optionAEn: 'Optimize resource use, prioritize critical activities and communicate constraints',
      optionB: 'Solicitar más recursos sin intentar optimizar',
      optionBEn: 'Request more resources without attempting to optimize',
      optionC: 'Reducir calidad para cumplir con los plazos',
      optionCEn: 'Reduce quality to meet deadlines',
      optionD: 'Quejarse sin proponer alternativas',
      optionDEn: 'Complain without proposing alternatives',
      correctAnswer: 'A',
      difficulty: 'HARD',
      category: 'Gestión de Proyectos',
      categoryEn: 'Project Management',
    },
  ];
}

export function getPositionById(jobPositionId: string): JobPosition | undefined {
  return JOB_POSITIONS.find(p => p.id === jobPositionId);
}

export function getAllPositions(): JobPosition[] {
  return JOB_POSITIONS;
}