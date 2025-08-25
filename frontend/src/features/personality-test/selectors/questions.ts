import { questionsMenu } from "../data/menu";
import { Question, QuestionMenu, QuestionnaireType, QuestionSection, StoredAnswer } from "../types/question";
import { TestStep, isValidStep } from "../../../pages/PersonalityTest/PersonalityTest";

const getTotalQuestions = (menu: QuestionMenu): number => {
    return menu.sections.reduce((acc, section) => acc + section.questions.length, 0);
  };
  
// 计算问卷进度
export const calculatedQuestionnaireProgress = (menu: QuestionMenu, storedAnswers: Record<number, StoredAnswer>) => {
    // For "both" option, calculate progress based on active questionnaire
    const answeredCount = Object.keys(storedAnswers).length;
    const total = getTotalQuestions(menu);
    return total > 0 ? (answeredCount / total) * 100 : 0;
};

// check for in-progress questionnaire
export const hasInProgressQuestionnaire = (): boolean => {
    const savedStep = localStorage.getItem('chon_personality_step');
    return savedStep !== null && savedStep !== 'intro' && isValidStep(savedStep as TestStep);
};

// check for completed questionnaire
export const hasCompletedQuestionnaire = (): boolean => {
    const savedStep = localStorage.getItem('chon_personality_step');
    return savedStep === 'results';
};

const getMenuByIdentity = (identity: QuestionnaireType): QuestionMenu | null => {
    return questionsMenu.find(m => m.identity === identity) || null;
};

export const getSectionByIndex = (
    identity: QuestionnaireType,
    index: number
): QuestionSection | null => {
    const menu = getMenuByIdentity(identity);
    if (!menu) return null;
    return menu.sections[index] ?? null;
};

export const isQuestionAnswered = (
    questionId: number,
    storedAnswers: Record<number, StoredAnswer>
): boolean => {
    return storedAnswers[questionId] !== undefined;
};

export const findFirstIncompleteSection = (
    identity: QuestionnaireType,
    storedAnswers: Record<number, StoredAnswer>
): number => {
    const menu = getMenuByIdentity(identity);
    if (!menu) return 0;
    for (let i = 0; i < menu.sections.length; i += 1) {
      const sec = menu.sections[i];
      const allAnswered = sec.questions.every(qid => isQuestionAnswered(qid, storedAnswers));
      if (!allAnswered) return i;
    }
    // If everything answered, point to last section
    return Math.max(0, menu.sections.length - 1);
};

export const findFirstUnansweredQuestionInSection = (
    section: QuestionSection,
    storedAnswers: Record<number, StoredAnswer>
): number | null => {
    const target = section.questions.find(qid => !isQuestionAnswered(qid, storedAnswers));
    return target ?? null;
};

// Helpers for handling multiple choice answers
export const getOptionById = (question: Question, optionId: string) => {
    const qAny: any = question as any;
    return qAny.options?.find((o: any) => o.id === optionId);
};

export const computeNextAnswersForMultipleChoice = (
    question: Question,
    optionId: string,
    currentAnswers: Record<number, StoredAnswer>
  ): { updatedAnswers: Record<number, StoredAnswer>; isMultiSelect: boolean } => {
    const isMulti = question.type === 'multiple-choice' && (question as any).multiSelect;
    if (isMulti) {
      const prev = currentAnswers[question.id]?.value;
      const prevArray: string[] = Array.isArray(prev) ? prev : [];
      const nextArray = prevArray.includes(optionId)
        ? prevArray.filter(v => v !== optionId)
        : [...prevArray, optionId];

      if (nextArray.length === 0) {
        const newAnswers = { ...currentAnswers };
        delete newAnswers[question.id];
        return { updatedAnswers: newAnswers, isMultiSelect: true };
      }
      return {
        updatedAnswers: {
          ...currentAnswers,
          [question.id]: { value: nextArray }
        },
        isMultiSelect: true
      };
    }
    // Single select default
    return {
      updatedAnswers: {
        ...currentAnswers,
        [question.id]: { value: optionId }
      },
      isMultiSelect: false
    };
  };