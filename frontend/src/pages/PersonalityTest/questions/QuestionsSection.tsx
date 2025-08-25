import React from 'react';
import { Question, QuestionnaireType, questions, QuestionSection } from '../questionnaires';
import { StoredAnswer } from '../PersonalityTest';
import QuestionBlock from './QuestionBlock';
import ProgressBar from './ProgressBar';
import '../PersonalityTest.css';
import QuestionNavigation from './QuestionNavigation';

interface QuestionsSectionProps {
  section: QuestionSection;
  progress: number;
  showBack: boolean;
  showNext: boolean;
  showFinish: boolean;
  language: string;
  identity: QuestionnaireType | null;
  workedInCorporate: boolean;
  currentAnswers: Record<number, StoredAnswer>;
  onMultipleChoice: (question: Question, optionId: string) => void;
  onTextInput: (question: Question, text: string) => void;
  onScale: (question: Question, value: string, identity: QuestionnaireType | null) => void;
  scrollToFirstQuestionOfNextPage: () => void;
  onNext: () => void;
  onBack: () => void;
  onFinish: () => void;
}

const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  section,
  progress,
  showBack,
  showNext,
  showFinish,
  language,
  identity,
  workedInCorporate,
  currentAnswers,
  onMultipleChoice,
  onTextInput,
  onScale,
  scrollToFirstQuestionOfNextPage,
  onNext,
  onBack,
  onFinish,
}) => {

  // Get the actual questions for this section from the questions array
  const sectionQuestions = section.questions
    .map(questionId => questions.find(q => q.id === questionId))
    .filter((q): q is Question => q !== undefined);

  // Check if all required questions in the section have been answered
  const areAllQuestionsAnswered = () => {
    const sectionQuestions = section.questions
      .map(questionId => questions.find(q => q.id === questionId))
      .filter((q): q is Question => q !== undefined);

    // Count how many questions have answers
    const answeredCount = sectionQuestions.reduce((count, question) => {
      return currentAnswers[question.id] ? count + 1 : count;
    }, 0);

    // All questions must be answered to proceed
    return answeredCount === sectionQuestions.length;
  };

  return (
    <div className="questionnaire-content">
      {/* Progress bar */}
      <ProgressBar progress={progress} />

      {/* Render questions */}
      <div className="first-page-questions">
        {/* Render section title if it exists */}
        {(section.sectionTitleEn || section.sectionTitleZh) && (
            <h1 className="section-title">
            {language === 'en'
              ? (!workedInCorporate && section.sectionLifeTitleEn ? section.sectionLifeTitleEn : section.sectionTitleEn)
              : (!workedInCorporate && section.sectionLifeTitleZh ? section.sectionLifeTitleZh : section.sectionTitleZh)}
            </h1>
        )}
        {sectionQuestions.map((question) => (
          <QuestionBlock
            key={question.id}
            question={question}
            currentAnswer={currentAnswers[question.id]}
            language={language}
            identity={identity}
            workedInCorporate={workedInCorporate}
            onMultipleChoice={onMultipleChoice}
            onTextInput={onTextInput}
            onScale={onScale}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <QuestionNavigation
        showBack={showBack}
        showNext={showNext}
        showFinish={showFinish}
        onBack={() => {
          if (showBack) {
            onBack();
            scrollToFirstQuestionOfNextPage();
          }
        }}
        onNext={() => {
          if (showNext) {
            onNext();
            scrollToFirstQuestionOfNextPage();
          }
        }}
        onFinish={onFinish}
        nextDisabled={!areAllQuestionsAnswered()}
        finishDisabled={!areAllQuestionsAnswered()}
        backLabel={language === 'en' ? 'Back' : '返回'}
        nextLabel={language === 'en' ? 'Continue' : '继续'}
        finishLabel={language === 'en' ? 'Finish' : '完成'}
      />
    </div>
  );
};

export default QuestionsSection; 