export type ResultLanguage = 'es' | 'en';

type Pair = [string, number];

function toNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : Number(value || 0);
}

function topAndBottom(entries: Pair[]) {
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  return {
    top: sorted[0] || null,
    second: sorted[1] || null,
    bottom: sorted[sorted.length - 1] || null,
  };
}

function avg(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function joinTwo(items: string[]) {
  return items.filter(Boolean).slice(0, 2).join(' y ');
}

export function getExecutiveReading(type: string, result: any, language: ResultLanguage): string {
  const es = language === 'es';

  switch (type) {
    case 'driving-forces': {
      const pairs: Pair[] = [
        ['Intelectual', toNumber(result.intelectualPercentile)],
        ['Instintivo', toNumber(result.instintivoPercentile)],
        ['Práctico', toNumber(result.practicoPercentile)],
        ['Altruista', toNumber(result.altruistaPercentile)],
        ['Armonioso', toNumber(result.armoniosoPercentile)],
        ['Objetivo', toNumber(result.objetivoPercentile)],
        ['Benevolente', toNumber(result.benevoloPercentile)],
        ['Intencional', toNumber(result.intencionalPercentile)],
        ['Dominante', toNumber(result.dominantePercentile)],
        ['Colaborativo', toNumber(result.colaborativoPercentile)],
        ['Estructurado', toNumber(result.estructuradoPercentile)],
        ['Receptivo', toNumber(result.receptivoPercentile)],
      ];
      const { top, second } = topAndBottom(pairs);
      const topMotivator = Array.isArray(result.primaryMotivators) && result.primaryMotivators.length > 0
        ? String(result.primaryMotivators[0])
        : null;
      const gap = top && second ? Math.abs(top[1] - second[1]) : 0;

      if (!top) {
        return es
          ? 'Lectura no disponible. No hay suficientes datos motivacionales para interpretar el perfil.'
          : 'Reading unavailable. There is not enough motivational data to interpret the profile.';
      }

      if (top[1] >= 70 && gap >= 12) {
        return es
          ? `Predomina ${top[0]} con claridad, lo que sugiere decisiones y prioridades guiadas por ese motor. ${topMotivator ? `Además, ${topMotivator.toLowerCase()} aparece como una motivación principal.` : ''}`.trim()
          : `${top[0]} clearly predominates, suggesting decisions and priorities guided by that drive. ${topMotivator ? `In addition, ${topMotivator.toLowerCase()} appears as a primary motivator.` : ''}`.trim();
      }

      if (gap < 10) {
        return es
          ? `El perfil muestra un balance entre ${top[0]}${second ? ` y ${second[0]}` : ''}, por lo que puede alternar prioridades según el contexto.` 
          : `The profile shows a balance between ${top[0]}${second ? ` and ${second[0]}` : ''}, so priorities can shift depending on context.`;
      }

      return es
        ? `Hay una orientación principal hacia ${top[0]}, con un respaldo secundario que complementa el perfil.`
        : `There is a primary orientation toward ${top[0]}, with a secondary drive that complements the profile.`;
    }

    case 'eq': {
      const dimensions: Pair[] = [
        ['Autoconciencia', toNumber(result.selfAwarenessPercentile)],
        ['Autorregulación', toNumber(result.selfRegulationPercentile)],
        ['Motivación', toNumber(result.motivationPercentile)],
        ['Empatía', toNumber(result.empathyPercentile)],
        ['Habilidades sociales', toNumber(result.socialSkillsPercentile)],
      ];
      const { top, bottom } = topAndBottom(dimensions);
      const score = toNumber(result.totalScore || result.totalEQPercentile || avg(dimensions.map(([, value]) => value)));

      if (score >= 80) {
        return es
          ? `La inteligencia emocional es muy sólida. Sobresale ${top?.[0] || 'una dimensión clave'}, mientras ${bottom?.[0] || 'otra dimensión'} marca el punto de refuerzo natural.`
          : `Emotional intelligence is very strong. ${top?.[0] || 'one key dimension'} stands out, while ${bottom?.[0] || 'another dimension'} marks the natural area to reinforce.`;
      }
      if (score >= 60) {
        return es
          ? `El perfil emocional es consistente. Hay base positiva y ${top?.[0] || 'una dimensión'} destaca, con oportunidad de fortalecer ${bottom?.[0] || 'otra dimensión'}.`
          : `The emotional profile is consistent. There is a positive base and ${top?.[0] || 'one dimension'} stands out, with room to strengthen ${bottom?.[0] || 'another dimension'}.`;
      }
      if (score >= 40) {
        return es
          ? `La inteligencia emocional está en desarrollo. ${top?.[0] || 'La dimensión más fuerte'} aporta estabilidad, pero conviene reforzar ${bottom?.[0] || 'la dimensión más baja'} para ganar consistencia.`
          : `Emotional intelligence is developing. ${top?.[0] || 'The strongest dimension'} adds stability, but ${bottom?.[0] || 'the lowest dimension'} should be reinforced to gain consistency.`;
      }
      return es
        ? `El perfil emocional requiere atención. Conviene priorizar desarrollo en ${bottom?.[0] || 'las dimensiones más bajas'} antes de exigir escenarios de alta presión.`
        : `The emotional profile requires attention. It is advisable to prioritize development in ${bottom?.[0] || 'the lowest dimensions'} before demanding high-pressure scenarios.`;
    }

    case 'dna': {
      const categories: Pair[] = [
        ['Pensamiento', toNumber(result.thinkingCategoryScore)],
        ['Comunicación', toNumber(result.communicationCategoryScore)],
        ['Liderazgo', toNumber(result.leadershipCategoryScore)],
        ['Resultados', toNumber(result.resultsCategoryScore)],
        ['Relaciones', toNumber(result.relationshipCategoryScore)],
      ];
      const { top, bottom } = topAndBottom(categories);
      const score = toNumber(result.totalDNAPercentile);

      if (score >= 80) {
        return es
          ? `El perfil DNA es excepcional. Destaca ${top?.[0] || 'una categoría'} como fortaleza central y mantiene un estándar alto en el resto del mapa de competencias.`
          : `The DNA profile is exceptional. ${top?.[0] || 'A category'} stands out as a central strength and the rest of the competency map stays at a high standard.`;
      }
      if (score >= 60) {
        return es
          ? `El perfil DNA es competente y estable. ${top?.[0] || 'La categoría principal'} impulsa el desempeño, mientras ${bottom?.[0] || 'otra categoría'} sugiere un espacio claro de mejora.`
          : `The DNA profile is competent and stable. ${top?.[0] || 'The leading category'} drives performance, while ${bottom?.[0] || 'another category'} suggests a clear improvement area.`;
      }
      if (score >= 40) {
        return es
          ? `El DNA muestra desarrollo mixto. Hay señales útiles en ${top?.[0] || 'la dimensión más fuerte'}, pero conviene reforzar ${bottom?.[0] || 'la más débil'} para ganar consistencia.`
          : `DNA shows mixed development. There are useful signals in ${top?.[0] || 'the strongest dimension'}, but ${bottom?.[0] || 'the weakest one'} should be reinforced for consistency.`;
      }
      return es
        ? `El perfil DNA requiere una revisión más profunda. La brecha entre competencias principales y de apoyo sugiere una necesidad clara de desarrollo.`
        : `The DNA profile requires a deeper review. The gap between core and support competencies suggests a clear development need.`;
    }

    case 'acumen': {
      const categories: Pair[] = [
        ['Externa', toNumber(result.externalClarityScore)],
        ['Interna', toNumber(result.internalClarityScore)],
        ['Otros', toNumber(result.understandingOthersClarity)],
        ['Práctico', toNumber(result.practicalThinkingClarity)],
        ['Sistémico', toNumber(result.systemsJudgmentClarity)],
        ['Autoconocimiento', toNumber(result.senseOfSelfClarity)],
        ['Dirección', toNumber(result.selfDirectionClarity)],
        ['Rol', toNumber(result.roleAwarenessClarity)],
      ];
      const { top, bottom } = topAndBottom(categories);
      const score = toNumber(result.totalAcumenScore);

      if (score >= 80) {
        return es
          ? `El nivel de acumen es alto y consistente. ${top?.[0] || 'La dimensión más fuerte'} refleja claridad sobresaliente, mientras el mapa general mantiene buen equilibrio.`
          : `The acumen level is high and consistent. ${top?.[0] || 'The strongest dimension'} reflects outstanding clarity, while the overall map remains well balanced.`;
      }
      if (score >= 60) {
        return es
          ? `El perfil muestra buena claridad cognitiva. ${top?.[0] || 'La dimensión más fuerte'} impulsa la lectura general y ${bottom?.[0] || 'otra dimensión'} marca el refuerzo natural.`
          : `The profile shows good cognitive clarity. ${top?.[0] || 'The strongest dimension'} drives the overall reading and ${bottom?.[0] || 'another dimension'} marks the natural reinforcement point.`;
      }
      if (score >= 40) {
        return es
          ? `El acumen está en desarrollo. Hay señales útiles en ${top?.[0] || 'la mejor dimensión'}, pero conviene reforzar ${bottom?.[0] || 'la más baja'} para ganar consistencia.`
          : `Acumen is developing. There are useful signals in ${top?.[0] || 'the strongest dimension'}, but ${bottom?.[0] || 'the lowest one'} should be reinforced for consistency.`;
      }
      return es
        ? `La claridad cognitiva requiere apoyo. El perfil sugiere priorizar habilidades de entendimiento, juicio y dirección antes de roles de alta complejidad.`
        : `Cognitive clarity needs support. The profile suggests prioritizing understanding, judgment and direction skills before high-complexity roles.`;
    }

    case 'values': {
      const integrity = toNumber(result.integrityScore || result.totalValuesScore || 0);
      const authenticity = toNumber(result.authenticityScore || 0);
      const consistency = toNumber(result.consistencyScore || 0);
      const values: Pair[] = [
        ['Teórico', toNumber(result.teoricoPercentile)],
        ['Utilitario', toNumber(result.utilitarioPercentile)],
        ['Estético', toNumber(result.esteticoPercentile)],
        ['Social', toNumber(result.socialPercentile)],
        ['Individual', toNumber(result.individualistaPercentile)],
        ['Tradicional', toNumber(result.tradicionalPercentile)],
      ];
      const { top, bottom } = topAndBottom(values);

      if (integrity >= 80 && authenticity >= 80) {
        return es
          ? `El perfil de valores es muy coherente y auténtico. ${top?.[0] || 'El valor dominante'} predomina con fuerza, y la alineación ética general es alta.`
          : `The values profile is very coherent and authentic. ${top?.[0] || 'The dominant value'} prevails strongly, and the overall ethical alignment is high.`;
      }
      if (integrity >= 60) {
        return es
          ? `Existe una base ética sólida. ${top?.[0] || 'El valor principal'} marca la orientación, aunque ${bottom?.[0] || 'otro valor'} sugiere un espacio de ajuste fino.`
          : `There is a solid ethical base. ${top?.[0] || 'The main value'} defines the orientation, although ${bottom?.[0] || 'another value'} suggests a fine-tuning area.`;
      }
      if (authenticity >= consistency && authenticity >= 50) {
        return es
          ? `El perfil expresa autenticidad, pero la coherencia con las decisiones puede fluctuar según el contexto. Conviene alinear prioridades con mayor claridad.`
          : `The profile shows authenticity, but decision consistency can fluctuate depending on context. Priorities should be aligned more clearly.`;
      }
      return es
        ? `La lectura sugiere revisar el encaje entre valores declarados y decisiones cotidianas para ganar mayor coherencia.`
        : `The reading suggests reviewing the fit between declared values and daily decisions to gain greater consistency.`;
    }

    case 'stress': {
      const stress = toNumber(result.nivelEstresGeneral || result.generalStressLevel || 0);
      const resilience = toNumber(result.indiceResiliencia || result.resilienceIndex || 0);
      const adaptation = toNumber(result.capacidadAdaptacion || 0);
      const dimensions: Pair[] = [
        ['Estrés laboral', toNumber(result.estresLaboralScore || result.workStress)],
        ['Manejo emocional', toNumber(result.manejoEmocionalScore || result.emotionalManagement)],
        ['Recuperación', toNumber(result.capacidadRecuperacionScore || result.recoveryCapacity)],
        ['Apoyo social', toNumber(result.apoyoSocialScore || result.socialSupport)],
        ['Afrontamiento', toNumber(result.estrategiasAfrontamientoScore || result.copingStrategies)],
      ];
      const { top, bottom } = topAndBottom(dimensions);

      if (stress >= 70 && resilience < 50) {
        return es
          ? `El nivel de estrés es alto y la resiliencia aún necesita soporte. Conviene priorizar recuperación, apoyo y manejo de carga antes de aumentar la exigencia.`
          : `Stress is high and resilience still needs support. It is advisable to prioritize recovery, support and workload management before increasing demands.`;
      }
      if (stress <= 40 && resilience >= 60) {
        return es
          ? `La persona maneja bien la presión. La resiliencia y la adaptación sostienen el perfil, con ${top?.[0] || 'una dimensión fuerte'} como apoyo adicional.`
          : `The person manages pressure well. Resilience and adaptation support the profile, with ${top?.[0] || 'one strong dimension'} as additional support.`;
      }
      if (stress >= 50 && resilience >= 60) {
        return es
          ? `Hay presión relevante, pero la resiliencia ayuda a sostener el desempeño. ${bottom?.[0] || 'La dimensión más baja'} conviene fortalecer para estabilizar el perfil.`
          : `There is relevant pressure, but resilience helps sustain performance. ${bottom?.[0] || 'The lowest dimension'} should be strengthened to stabilize the profile.`;
      }
      return es
        ? `El perfil está en zona de vigilancia: la carga actual es manejable, pero conviene reforzar recuperación y afrontamiento para evitar desgaste.`
        : `The profile is in a watch zone: the current load is manageable, but recovery and coping should be reinforced to avoid burnout.`;
    }

    case 'technical': {
      const score = toNumber(result.totalScore || 0);
      const easy = toNumber(result.easyTotal) > 0 ? (toNumber(result.easyCorrect) / toNumber(result.easyTotal)) * 100 : null;
      const medium = toNumber(result.mediumTotal) > 0 ? (toNumber(result.mediumCorrect) / toNumber(result.mediumTotal)) * 100 : null;
      const hard = toNumber(result.hardTotal) > 0 ? (toNumber(result.hardCorrect) / toNumber(result.hardTotal)) * 100 : null;
      const categoryEntries = Object.entries(result.categoryScores || {}).map(([label, value]) => [label, toNumber(value)] as Pair).sort(([, a], [, b]) => b - a);
      const top = categoryEntries[0];
      const bottom = categoryEntries[categoryEntries.length - 1];
      const performance = result.performanceLevel || '';
      const strongHard = typeof hard === 'number' && hard >= 65;
      const weakHard = typeof hard === 'number' && hard < 45;

      if (score >= 80 && strongHard) {
        return es
          ? `Desempeño sobresaliente. La base técnica es consistente y además se sostiene en preguntas complejas. ${top ? `Destaca ${top[0]} como fortaleza principal.` : ''}`
          : `Outstanding performance. The technical base is consistent and it also holds up on complex questions. ${top ? `${top[0]} stands out as the main strength.` : ''}`;
      }
      if (score >= 60) {
        return es
          ? `Desempeño sólido. La persona resuelve bien lo esencial; ${weakHard ? 'la complejidad alta requiere refuerzo.' : 'la complejidad está razonablemente controlada.'} ${top ? `La mejor señal aparece en ${top[0]}.` : ''}`
          : `Solid performance. The person handles the essentials well; ${weakHard ? 'high complexity needs reinforcement.' : 'complexity is reasonably under control.'} ${top ? `The strongest signal appears in ${top[0]}.` : ''}`;
      }
      if (score >= 40) {
        return es
          ? `Desempeño en desarrollo. Hay comprensión parcial, pero conviene reforzar fundamentos y revisar ${bottom ? bottom[0] : 'las áreas más débiles'} antes de asumir mayor complejidad.`
          : `Developing performance. There is partial understanding, but it is advisable to reinforce fundamentals and review ${bottom ? bottom[0] : 'the weakest areas'} before taking on more complexity.`;
      }
      return es
        ? `Desempeño bajo. Conviene validar fundamentos, revisar vacíos técnicos y acompañar con entrenamiento antes de avanzar.`
        : `Low performance. It is advisable to validate fundamentals, review technical gaps and provide training before moving forward.`;
    }

    default:
      return es
        ? 'La lectura ejecutiva no está disponible para este tipo de resultado.'
        : 'Executive reading is not available for this result type.';
  }
}

export function getTechnicalExecutiveReading(result: any, language: ResultLanguage): string {
  return getExecutiveReading('technical', result, language);
}
