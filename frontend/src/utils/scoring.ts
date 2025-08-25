import { questions } from '../features/personality-test/data/questions.ts';
import { Question, ScaleQuestion } from '../features/personality-test/types/question';

export interface TagStats {
  userScore: number;
  totalPossibleScore: number;
  scorePercentage: number;
  averageScore: number;
  answeredQuestions: number;
}

const ALL_TAGS = ['自我意识', '奉献精神', '社交情商', '情绪调节', '客观能力', '核心耐力'];

function parseScore(value: string): number {
  const letterToScore: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, E: 5 };
  if (letterToScore[value] !== undefined) return letterToScore[value];
  const asNum = parseInt(value, 10);
  return Number.isFinite(asNum) ? asNum : 0;
}

function getGenderFromAnswers(answers: Record<number, { value: string | string[] }>): 'female' | 'male' | 'unknown' {
  const v = answers[1]?.value;
  const scalar = Array.isArray(v) ? (v[0] || '') : (v || '');
  if (scalar === 'A') return 'female';
  if (scalar === 'B') return 'male';
  return 'unknown';
}

export function calculateTagStatsFromLocalAnswers(): Record<string, TagStats> | null {
  try {
    const raw = localStorage.getItem('chon_personality_answers');
    if (!raw) return null;
    const stored = JSON.parse(raw) as Record<number, { value: string | string[] }>; 
    if (!stored || Object.keys(stored).length === 0) return null;

    const gender = getGenderFromAnswers(stored);
    const stats: Record<string, TagStats> = {};
    ALL_TAGS.forEach(tag => {
      stats[tag] = { userScore: 0, totalPossibleScore: 0, scorePercentage: 0, averageScore: 0, answeredQuestions: 0 };
    });

    // Only consider scale questions that have tags
    questions.forEach((q: Question) => {
      if (q.type !== 'scale-question') return;
      const sq = q as ScaleQuestion;
      const answered = stored[q.id];
      if (!answered) return;

      const valueStr = Array.isArray(answered.value) ? '' : (answered.value as string);
      const score = parseScore(valueStr);
      if (score <= 0) return;

      const candidateTags = ((): string[] | undefined => {
        if (sq.tags && sq.tags.length) return sq.tags;
        if (gender === 'female' && sq.tagsFemale && sq.tagsFemale.length) return sq.tagsFemale;
        if (gender === 'male' && sq.tagsMale && sq.tagsMale.length) return sq.tagsMale;
        return undefined;
      })();

      if (!candidateTags || candidateTags.length === 0) return;

      candidateTags.forEach(tag => {
        if (!stats[tag]) return; // ignore tags outside our six canonical ones
        stats[tag].userScore += score;
        stats[tag].totalPossibleScore += 5; // max per question is 5
        stats[tag].answeredQuestions += 1;
      });
    });

    ALL_TAGS.forEach(tag => {
      const t = stats[tag];
      t.scorePercentage = t.totalPossibleScore > 0 ? Math.min(100, Number(((t.userScore / t.totalPossibleScore) * 100).toFixed(2))) : 0;
      t.averageScore = t.answeredQuestions > 0 ? Number((t.userScore / t.answeredQuestions).toFixed(2)) : 0;
    });

    localStorage.setItem('tagStats', JSON.stringify(stats));
    return stats;
  } catch (_) {
    return null;
  }
}

export function getOrComputeTagStats(): Record<string, TagStats> | null {
  const saved = localStorage.getItem('tagStats');
  if (saved) {
    try {
      return JSON.parse(saved) as Record<string, TagStats>;
    } catch (_) {
      // fall through to compute
    }
  }
  return calculateTagStatsFromLocalAnswers();
}


