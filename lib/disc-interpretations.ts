export interface DiscInterpretation {
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  motivators: string[];
  stressors: string[];
  communication: string[];
  idealEnvironment: string[];
}

export function getDiscInterpretations(t: (key: string) => string): Record<string, DiscInterpretation> {
  return {
    D: {
      title: t('analytics.disc.dominant'),
      description: t('analytics.disc.dominant.desc'),
      strengths: [
        t('analytics.disc.d.strengths.1'),
        t('analytics.disc.d.strengths.2'),
        t('analytics.disc.d.strengths.3'),
        t('analytics.disc.d.strengths.4'),
        t('analytics.disc.d.strengths.5'),
        t('analytics.disc.d.strengths.6'),
      ],
      challenges: [
        t('analytics.disc.d.challenges.1'),
        t('analytics.disc.d.challenges.2'),
        t('analytics.disc.d.challenges.3'),
        t('analytics.disc.d.challenges.4'),
        t('analytics.disc.d.challenges.5'),
      ],
      motivators: [
        t('analytics.disc.d.motivators.1'),
        t('analytics.disc.d.motivators.2'),
        t('analytics.disc.d.motivators.3'),
        t('analytics.disc.d.motivators.4'),
        t('analytics.disc.d.motivators.5'),
      ],
      stressors: [
        t('analytics.disc.d.stressors.1'),
        t('analytics.disc.d.stressors.2'),
        t('analytics.disc.d.stressors.3'),
        t('analytics.disc.d.stressors.4'),
        t('analytics.disc.d.stressors.5'),
      ],
      communication: [
        t('analytics.disc.d.communication.1'),
        t('analytics.disc.d.communication.2'),
        t('analytics.disc.d.communication.3'),
        t('analytics.disc.d.communication.4'),
        t('analytics.disc.d.communication.5'),
      ],
      idealEnvironment: [
        t('analytics.disc.d.environment.1'),
        t('analytics.disc.d.environment.2'),
        t('analytics.disc.d.environment.3'),
        t('analytics.disc.d.environment.4'),
        t('analytics.disc.d.environment.5'),
      ],
    },
    I: {
      title: t('analytics.disc.influential'),
      description: t('analytics.disc.influential.desc'),
      strengths: [
        t('analytics.disc.i.strengths.1'),
        t('analytics.disc.i.strengths.2'),
        t('analytics.disc.i.strengths.3'),
        t('analytics.disc.i.strengths.4'),
        t('analytics.disc.i.strengths.5'),
        t('analytics.disc.i.strengths.6'),
      ],
      challenges: [
        t('analytics.disc.i.challenges.1'),
        t('analytics.disc.i.challenges.2'),
        t('analytics.disc.i.challenges.3'),
        t('analytics.disc.i.challenges.4'),
        t('analytics.disc.i.challenges.5'),
      ],
      motivators: [
        t('analytics.disc.i.motivators.1'),
        t('analytics.disc.i.motivators.2'),
        t('analytics.disc.i.motivators.3'),
        t('analytics.disc.i.motivators.4'),
        t('analytics.disc.i.motivators.5'),
      ],
      stressors: [
        t('analytics.disc.i.stressors.1'),
        t('analytics.disc.i.stressors.2'),
        t('analytics.disc.i.stressors.3'),
        t('analytics.disc.i.stressors.4'),
        t('analytics.disc.i.stressors.5'),
      ],
      communication: [
        t('analytics.disc.i.communication.1'),
        t('analytics.disc.i.communication.2'),
        t('analytics.disc.i.communication.3'),
        t('analytics.disc.i.communication.4'),
        t('analytics.disc.i.communication.5'),
      ],
      idealEnvironment: [
        t('analytics.disc.i.environment.1'),
        t('analytics.disc.i.environment.2'),
        t('analytics.disc.i.environment.3'),
        t('analytics.disc.i.environment.4'),
        t('analytics.disc.i.environment.5'),
      ],
    },
    S: {
      title: t('analytics.disc.steady'),
      description: t('analytics.disc.steady.desc'),
      strengths: [
        t('analytics.disc.s.strengths.1'),
        t('analytics.disc.s.strengths.2'),
        t('analytics.disc.s.strengths.3'),
        t('analytics.disc.s.strengths.4'),
        t('analytics.disc.s.strengths.5'),
        t('analytics.disc.s.strengths.6'),
      ],
      challenges: [
        t('analytics.disc.s.challenges.1'),
        t('analytics.disc.s.challenges.2'),
        t('analytics.disc.s.challenges.3'),
        t('analytics.disc.s.challenges.4'),
        t('analytics.disc.s.challenges.5'),
      ],
      motivators: [
        t('analytics.disc.s.motivators.1'),
        t('analytics.disc.s.motivators.2'),
        t('analytics.disc.s.motivators.3'),
        t('analytics.disc.s.motivators.4'),
        t('analytics.disc.s.motivators.5'),
      ],
      stressors: [
        t('analytics.disc.s.stressors.1'),
        t('analytics.disc.s.stressors.2'),
        t('analytics.disc.s.stressors.3'),
        t('analytics.disc.s.stressors.4'),
        t('analytics.disc.s.stressors.5'),
      ],
      communication: [
        t('analytics.disc.s.communication.1'),
        t('analytics.disc.s.communication.2'),
        t('analytics.disc.s.communication.3'),
        t('analytics.disc.s.communication.4'),
        t('analytics.disc.s.communication.5'),
      ],
      idealEnvironment: [
        t('analytics.disc.s.environment.1'),
        t('analytics.disc.s.environment.2'),
        t('analytics.disc.s.environment.3'),
        t('analytics.disc.s.environment.4'),
        t('analytics.disc.s.environment.5'),
      ],
    },
    C: {
      title: t('analytics.disc.conscientious'),
      description: t('analytics.disc.conscientious.desc'),
      strengths: [
        t('analytics.disc.c.strengths.1'),
        t('analytics.disc.c.strengths.2'),
        t('analytics.disc.c.strengths.3'),
        t('analytics.disc.c.strengths.4'),
        t('analytics.disc.c.strengths.5'),
        t('analytics.disc.c.strengths.6'),
      ],
      challenges: [
        t('analytics.disc.c.challenges.1'),
        t('analytics.disc.c.challenges.2'),
        t('analytics.disc.c.challenges.3'),
        t('analytics.disc.c.challenges.4'),
        t('analytics.disc.c.challenges.5'),
      ],
      motivators: [
        t('analytics.disc.c.motivators.1'),
        t('analytics.disc.c.motivators.2'),
        t('analytics.disc.c.motivators.3'),
        t('analytics.disc.c.motivators.4'),
        t('analytics.disc.c.motivators.5'),
      ],
      stressors: [
        t('analytics.disc.c.stressors.1'),
        t('analytics.disc.c.stressors.2'),
        t('analytics.disc.c.stressors.3'),
        t('analytics.disc.c.stressors.4'),
        t('analytics.disc.c.stressors.5'),
      ],
      communication: [
        t('analytics.disc.c.communication.1'),
        t('analytics.disc.c.communication.2'),
        t('analytics.disc.c.communication.3'),
        t('analytics.disc.c.communication.4'),
        t('analytics.disc.c.communication.5'),
      ],
      idealEnvironment: [
        t('analytics.disc.c.environment.1'),
        t('analytics.disc.c.environment.2'),
        t('analytics.disc.c.environment.3'),
        t('analytics.disc.c.environment.4'),
        t('analytics.disc.c.environment.5'),
      ],
    },
  };
}
