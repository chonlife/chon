import { cardsData } from "../features/personality-test/data/characters";

// Shared archetype utilities: types, data, tag mapping, and matching logic

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

export interface TagTranslations {
  en: string;
  zh: string;
}

export const tagLabels: Record<string, TagTranslations> = {
  selfAwareness: { en: 'Self Awareness', zh: '自我意识' },
  dedication: { en: 'Dedication', zh: '奉献精神' },
  socialIntelligence: { en: 'Social Intelligence', zh: '社交情商' },
  emotionalRegulation: { en: 'Emotional Regulation', zh: '情绪调节' },
  objectivity: { en: 'Objectivity', zh: '客观能力' },
  coreEndurance: { en: 'Core Endurance', zh: '核心耐力' }
};

// Chinese label to English key mapping for tagStats structure
export const tagMapping: Record<string, string> = {
  '自我意识': 'selfAwareness',
  '奉献精神': 'dedication',
  '社交情商': 'socialIntelligence',
  '情绪调节': 'emotionalRegulation',
  '客观能力': 'objectivity',
  '核心耐力': 'coreEndurance'
};

// Question 25 option to character ID mapping for tie-breaking
export const question25CharacterMapping: Record<string, string> = {
  'A': 'prometheus',  // Redistribute corporate shares
  'B': 'wukong',      // Create 72 versions of yourself
  'C': 'odin',        // Omnipotent prophet
  'D': 'venus',       // Divine product allure
  'E': 'nuwa',        // Reconstruct economic system
  'F': 'athena'       // Strategic advantage
};

export function mapTagStatsToScores(tagStats: Record<string, any> | null | undefined): Record<string, number> {
  const userScores: Record<string, number> = {};
  if (!tagStats || typeof tagStats !== 'object') return userScores;
  Object.keys(tagStats).forEach(tag => {
    const data = (tagStats as any)[tag];
    if (data && typeof data.scorePercentage === 'number') {
      const key = tagMapping[tag] || tag;
      userScores[key] = data.scorePercentage;
    }
  });
  return userScores;
}

// Helper function to get user's question 25 answer from localStorage
function getQuestion25Answer(): string | null {
  try {
    const answers = localStorage.getItem('chon_personality_answers');
    if (!answers) return null;
    const parsedAnswers = JSON.parse(answers);
    const question25Answer = parsedAnswers[25];
    return question25Answer?.value || null;
  } catch (error) {
    console.error('Error reading question 25 answer:', error);
    return null;
  }
}

export function findBestMatch(
  userScores: Record<string, number>,
  allCards: CardData[] = cardsData
): { sortedCards: CardData[]; bestMatch: CardData } {
  const charactersWithScores = allCards.map((card, index) => {
    let matchScore = 0;
    Object.entries(card.tagRanges).forEach(([tag, range]) => {
      const userScore = userScores[tag];
      if (userScore !== undefined) {
        if (userScore >= range[0] && userScore <= range[1]) {
          matchScore += 1;
        } else {
          const distanceToRange = Math.min(
            Math.abs(userScore - range[0]),
            Math.abs(userScore - range[1])
          );
          matchScore += Math.max(0, 1 - (distanceToRange / 100));
        }
      }
    });
    return { card, index, matchScore };
  });

  // Sort by match score first
  const sortedCharacters = charactersWithScores.sort((a, b) => b.matchScore - a.matchScore);
  
  // Handle ties using question 25 preference
  const topScore = sortedCharacters[0].matchScore;
  const tiedCharacters = sortedCharacters.filter(char => char.matchScore === topScore);
  
  let bestMatch = sortedCharacters[0].card;
  
  // If there's a tie, try to break it using question 25
  if (tiedCharacters.length > 1) {
    const question25Answer = getQuestion25Answer();
    if (question25Answer && question25CharacterMapping[question25Answer]) {
      const preferredCharacterId = question25CharacterMapping[question25Answer];
      const preferredCharacter = tiedCharacters.find(char => char.card.id === preferredCharacterId);
      
      if (preferredCharacter) {
        bestMatch = preferredCharacter.card;
        // Move the preferred character to the front of the sorted list
        const otherCharacters = sortedCharacters.filter(char => char.card.id !== preferredCharacterId);
        sortedCharacters.splice(0, sortedCharacters.length, preferredCharacter, ...otherCharacters);
      }
    }
  }
  
  const sortedCards = sortedCharacters.map(item => item.card);
  return { sortedCards, bestMatch };
}


