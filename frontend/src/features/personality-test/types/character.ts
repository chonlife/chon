export interface CardData {
    id: string;
    name: {
      en: string;
      zh: string;
    };
    title: {
      en: string;
      zh: string;
    };
    description: {
      en: string;
      zh: string;
    };
    mythology: {
      en: string;
      zh: string;
    };
    tagRanges: {
      selfAwareness: [number, number];
      dedication: [number, number];
      socialIntelligence: [number, number];
      emotionalRegulation: [number, number];
      objectivity: [number, number];
      coreEndurance: [number, number];
    };
    image: string;
  }