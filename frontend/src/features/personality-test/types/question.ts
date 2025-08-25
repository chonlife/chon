export type QuestionType = 'multiple-choice' | 'text-input' | 'scale-question';
export type QuestionnaireType = 'mother' | 'corporate' | 'other' | 'both';

interface BaseQuestion {
  id: number;
  textEn: string;
  textZh: string;
  textLifeEn?: string;
  textLifeZh?: string;
  textCorporateEn?: string;
  textCorporateZh?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: Option[];
  multiSelect?: boolean;
}

export interface ScaleQuestion extends BaseQuestion {
  type: 'scale-question';
  scaleLabels: ScaleLabels;
  tags?: string[];
  tagsMale?: string[];
  tagsFemale?: string[];
}

export interface TextInputQuestion extends BaseQuestion {
  type: 'text-input';
}

export interface Option {
  id: string;
  textEn: string;
  textZh: string;
}

export interface ScaleLabels {
  minEn: string;
  minZh: string;
  maxEn: string;
  maxZh: string;
}

export type Question = MultipleChoiceQuestion | ScaleQuestion | TextInputQuestion;

export interface QuestionMenu {
  identity: QuestionnaireType;
  sections: QuestionSection[];
}

export interface QuestionSection {
  sectionId: number;
  sectionTitleEn: string;
  sectionTitleZh: string;
  sectionLifeTitleEn?: string;
  sectionLifeTitleZh?: string;
  questions: number[];
}