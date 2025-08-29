import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector.tsx';
import './PersonalityTest.css';
import { scrollToNextQuestion, scrollToFirstQuestionOfNextPage, scrollToQuestion, scrollToPageTop } from './ScrollUtils.ts';
import questionnaireApi from '../../api/questionnaire.ts';
import { Question, QuestionSection, QuestionnaireType, QuestionMenu, StoredAnswer } from '../../features/personality-test/types/question.ts';
import { questionsMenu } from '../../features/personality-test/data/menu.ts';
import IdentitySelection, { IdentityType, CorporateRole } from './identity/IdentitySelection.tsx';
import QuestionsSection from './questions/QuestionsSection.tsx';
import Results from './results-new/Results.tsx';
import AccountSignup from '../Signup/AccountSignup.tsx';
import IntroSection from './intro/IntroSection.tsx';
import PrivacyStatement from './privacy/PrivacyStatement.tsx';
import TopActions from './components/TopActions.tsx';
import { findFirstIncompleteSection, findFirstUnansweredQuestionInSection, getSectionByIndex, getOptionById, computeNextAnswersForMultipleChoice, calculatedQuestionnaireProgress, hasInProgressQuestionnaire, hasCompletedQuestionnaire } from '../../features/personality-test/selectors/questions.ts';
import { calculateTagResults } from '../../features/personality-test/selectors/results.ts';

export const VALID_TEST_STEPS = ['intro', 'identity', 'privacy', 'questionnaire', 'results', 'account'] as const;
export type TestStep = typeof VALID_TEST_STEPS[number];
export const isValidStep = (step: string): step is TestStep => {
  return VALID_TEST_STEPS.includes(step as TestStep);
};

interface PersonalityTestProps {
  onWhiteThemeChange?: (isWhite: boolean) => void;
  onHideUIChange?: (shouldHide: boolean) => void;
  onViewportRestrictionChange?: (shouldRestrict: boolean) => void;
}

const PersonalityTest = ({ onWhiteThemeChange, onHideUIChange, onViewportRestrictionChange }: PersonalityTestProps) => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  // Always start at intro
  const [step, setStep] = useState<TestStep>('intro');
  const [userIntroChoice, setUserIntroChoice] = useState<string | null>(null);
  const [selectedIdentity, setSelectedIdentity] = useState<QuestionnaireType | null>(null);
  const [gender, setGender] = useState<string>('Female');
  const [workedInCoporate, setWorkedInCoporate] = useState<boolean>(true);
  const [currentSection, setCurrentSection] = useState<number>(0);
  // Update answers type to store more information
  const [answers, setAnswers] = useState<Record<number, StoredAnswer>>({});
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  const [selectedRole, setSelectedRole] = useState<CorporateRole | null>(null);
  const initializedSectionRef = useRef<boolean>(false);
  const hasMountedAnswersRef = useRef<boolean>(false);
  const hasMountedSectionRef = useRef<boolean>(false);

  /* =============== Effects =============== */
  // 从本地存储加载初始数据（合并初始化）
  useEffect(() => {
    const savedAnswers = localStorage.getItem('chon_personality_answers');
    const savedStep = localStorage.getItem('chon_personality_step');
    const savedIdentity = localStorage.getItem('chon_personality_identity');
    const savedUserIntroChoice = localStorage.getItem('chon_personality_user_intro_choice');
    const savedSection = localStorage.getItem('chon_personality_section');

    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers);
        setAnswers(parsed);
      } catch {}
    }

    if (savedIdentity) {
      try {
        setSelectedIdentity(JSON.parse(savedIdentity) as QuestionnaireType);
      } catch {}
    }

    if (savedUserIntroChoice) {
      setUserIntroChoice(savedUserIntroChoice);
    }

    // 恢复 section 索引（若无则保持 0，稍后根据答案计算）
    if (savedSection) {
      const parsedSection = parseInt(savedSection, 10);
      if (!Number.isNaN(parsedSection)) {
        setCurrentSection(parsedSection);
      }
    }

    // 仅在存在有效的保存步骤时恢复，否则保持在 intro
    if (savedStep && savedStep !== 'intro' && isValidStep(savedStep)) {
      setStep(savedStep as TestStep);
    } else {
      setStep('intro');
    }
  }, []);
  
  // 保存答案到本地存储（跳过首次挂载，避免覆盖已保存数据）
  useEffect(() => {
    if (!hasMountedAnswersRef.current) {
      hasMountedAnswersRef.current = true;
      return;
    }
    localStorage.setItem('chon_personality_answers', JSON.stringify(answers));
    if (Object.keys(answers).length > 0) {
      setShowSaveIndicator(true);
      const timer = setTimeout(() => {
        setShowSaveIndicator(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [answers]);
  
  // Save step to localStorage, but never save 'intro'
  useEffect(() => {
    if (step !== 'intro') {
      localStorage.setItem('chon_personality_step', step);
    }
  }, [step]);
  
  // 持久化当前 section 索引（跳过首次挂载，避免覆盖已保存数据）
  useEffect(() => {
    if (!hasMountedSectionRef.current) {
      hasMountedSectionRef.current = true;
      return;
    }
    localStorage.setItem('chon_personality_section', String(currentSection));
  }, [currentSection]);

  // 从答案派生性别与是否在企业工作（用于文案与标签）
  useEffect(() => {
    const sexAnswer = answers[1]?.value;
    if (typeof sexAnswer === 'string') {
      if (sexAnswer === 'A') setGender('Female');
      if (sexAnswer === 'B') setGender('Male');
    }

    const corpAnswer = answers[4]?.value; // Q4: Yes/No => A/B
    if (typeof corpAnswer === 'string') {
      if (corpAnswer === 'A') setWorkedInCoporate(true);
      if (corpAnswer === 'B') setWorkedInCoporate(false);
    }
  }, [answers]);

  // 进入问卷或切换分区时，滚动到第一个未完成题目（不在回答变更时触发）
  useEffect(() => {
    if (step !== 'questionnaire' || !selectedIdentity) return;
    if (!initializedSectionRef.current) {
      const savedSectionStr = localStorage.getItem('chon_personality_section');
      if (!savedSectionStr) {
        const firstIncomplete = findFirstIncompleteSection(selectedIdentity, answers);
        setCurrentSection(firstIncomplete);
      } else {
        const parsed = parseInt(savedSectionStr, 10);
        if (!Number.isNaN(parsed)) {
          setCurrentSection(parsed);
        }
      }
      initializedSectionRef.current = true;
    }

    // 滚动定位（基于最新的 currentSection 与 answers）
    const section = getSectionByIndex(selectedIdentity, currentSection);
    const targetQ = section ? findFirstUnansweredQuestionInSection(section, answers) : null;
    if (targetQ != null) {
      scrollToQuestion(targetQ);
    } else if (section && section.questions.length > 0) {
      scrollToQuestion(section.questions[0]);
    }
  }, [step, selectedIdentity, currentSection]);
  
  // 保存身份选择到本地存储
  useEffect(() => {
    if (selectedIdentity) {
      localStorage.setItem('chon_personality_identity', JSON.stringify(selectedIdentity));
    }
  }, [selectedIdentity]);
  
  // 保存用户选择到本地存储
  useEffect(() => {
    if (userIntroChoice) {
      localStorage.setItem('chon_personality_user_intro_choice', userIntroChoice);
    }
  }, [userIntroChoice]);

  // Load saved role from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('chon_personality_role');
    if (savedRole) {
      setSelectedRole(JSON.parse(savedRole) as CorporateRole);
    }
  }, []);

  // Save role to localStorage
  useEffect(() => {
    if (selectedRole) {
      localStorage.setItem('chon_personality_role', JSON.stringify(selectedRole));
    } else {
      localStorage.removeItem('chon_personality_role');
    }
  }, [selectedRole]);

  // Update white theme state when step changes
  useEffect(() => {
    if (onWhiteThemeChange) {
      const isWhiteTheme = step === 'privacy' || step === 'questionnaire';
      onWhiteThemeChange(isWhiteTheme);
      
      // Remove hormone-related style customization since those pages no longer exist
        const existingStyle = document.getElementById('hormone-style');
        if (existingStyle) {
          existingStyle.remove();
      }
    }
    
    // 根据步骤决定是否隐藏UI元素
    if (onHideUIChange) {
      const shouldHideUI = step === 'privacy' || step === 'questionnaire';
      onHideUIChange(shouldHideUI);
    }

    // 根据步骤决定是否限制viewport缩放
    if (onViewportRestrictionChange) {
      const shouldRestrictViewport = step === 'privacy' || step === 'questionnaire';
      onViewportRestrictionChange(shouldRestrictViewport);
    }
  }, [step, onWhiteThemeChange, onHideUIChange, onViewportRestrictionChange]);

  // 在组件挂载或step变为'intro'时进行初始化
  useEffect(() => {
    if (step === 'intro') {
      // 重置userIntroChoice，确保用户每次回到intro页面时都会看到选项
      setUserIntroChoice(null);
    }
  }, [step]);


  /* =============== Handlers =============== */
  // Handlers for intro section
  const handleIntroOptionClick = (choice: string) => {
    setUserIntroChoice(choice);
    
    // Save intro choice with user ID
    questionnaireApi.saveIntroChoice(choice)
      .catch(error => {
        console.error('Error saving intro choice:', error);
      });
  };

  const handleIntroBeginTest = () => {
    setStep('identity');
  };

  // Handlers for identity section
  const handleIdentitySelect = (identity: IdentityType) => {
    if (identity === 'other') {
      setSelectedIdentity(selectedIdentity === 'other' ? null : 'other');
      setSelectedRole(null); // Clear role when selecting 'other'
    } else if (identity === 'mother' || identity === 'corporate') {
      if (selectedIdentity === 'both') {
        setSelectedIdentity(identity === 'mother' ? 'corporate' : 'mother');
        // Keep role if switching to corporate, clear if switching to mother
        if (identity === 'mother') {
          setSelectedRole(null);
        }
      } else if (selectedIdentity === identity) {
        setSelectedIdentity(null);
        if (identity === 'corporate') {
          setSelectedRole(null); // Clear role when unselecting corporate
        }
      } else if ((selectedIdentity === 'mother' && identity === 'corporate') || 
                 (selectedIdentity === 'corporate' && identity === 'mother')) {
        setSelectedIdentity('both');
      } else {
        setSelectedIdentity(identity);
        if (identity !== 'corporate') {
          setSelectedRole(null); // Clear role when not selecting corporate
        }
      }
    }
  };

  const handleCorporateRoleSelect = (role: CorporateRole | null) => {
    setSelectedRole(role);
  };

  const handleIdentityContinue = () => {
    // Only allow continue if a role is selected when corporate is selected
    const isCorporate = selectedIdentity === 'corporate' || selectedIdentity === 'both';
    if (!selectedIdentity || (isCorporate && !selectedRole)) {
      return;
    }
    // Ensure privacy page starts at top
    scrollToPageTop();
    setStep('privacy');
  };

  // Handlers for privacy section
  const handlePrivacyContinue = () => {
    // 设置为问卷步骤
    setStep('questionnaire');
    
    // 通知父组件需要设置白色主题和隐藏UI
    if (onWhiteThemeChange) {
      onWhiteThemeChange(true);
    }
    
    if (onHideUIChange) {
      onHideUIChange(true);
    }
  };

  // Handlers for questionnaire section
  // Handle answer selection for multiple choice questions
  const handleMultipleChoiceAnswer = (question: Question, optionId: string) => {
    const currentAnswers = answers;
    updateGenderIfApplicable(question, optionId);
    updateCorporateIfApplicable(question, optionId);

    const { updatedAnswers, isMultiSelect } = computeNextAnswersForMultipleChoice(
      question,
      optionId,
      currentAnswers
    );
    setAnswers(updatedAnswers);

    // Auto-scroll only for single-select
    if (!isMultiSelect) {
      setTimeout(() => {
        scrollToNextQuestion(question.id);
      }, 100);
    }
  };

  // Handle text input for free text questions
  const handleTextAnswer = (question: Question, text: string) => {
    const currentAnswers = answers;
    // Only update answer when there's text content
    if (text.trim()) {
      setAnswers({
        ...currentAnswers,
        [question.id]: {
          value: text
        }
      });
    } else {
      // Remove the answer if text is empty to accurately track progress
      const newAnswers = {...currentAnswers};
      delete newAnswers[question.id];
      setAnswers(newAnswers);
    }
  };

  // Handle scale question answer
  const handleScaleAnswer = (question: Question, value: string, identity: QuestionnaireType | null) => {
    if (!identity || question.type !== 'scale-question') {
      return;
    }
    const currentAnswers = answers;
    // Choose gender-specific tags if available
    const qAny: any = question as any;
    const effectiveTags: string[] | undefined =
      gender === 'Male' && Array.isArray(qAny.tagsMale) ? qAny.tagsMale
      : gender === 'Female' && Array.isArray(qAny.tagsFemale) ? qAny.tagsFemale
      : qAny.tags;
    setAnswers({
      ...currentAnswers,
      [question.id]: {
        value,
        tags: effectiveTags
      }
    });
    
    // Auto-scroll to next question
    setTimeout(() => {
      scrollToNextQuestion(question.id);
    }, 100);
  };

  const updateGenderIfApplicable = (question: Question, optionId: string) => {
    if (question.id !== 1) return;
    const opt: any = getOptionById(question, optionId);
    const en = (opt?.textEn || '').toLowerCase();
    const zh = opt?.textZh || '';
    const isFemale = en.includes('female') || zh.includes('女');
    const isMale = en.includes('male') || zh.includes('男');
    if (isFemale) setGender('Female');
    if (isMale) setGender('Male');
  };

  const updateCorporateIfApplicable = (question: Question, optionId: string) => {
    if (![2, 4].includes(question.id)) return;
    const opt: any = getOptionById(question, optionId);
    const en = (opt?.textEn || '').toLowerCase();
    const zh = opt?.textZh || '';
    const isYes = en.includes('yes') || zh.includes('是');
    const isNo = en.includes('no') || zh.includes('否');
    if (isYes) setWorkedInCoporate(true);
    if (isNo) setWorkedInCoporate(false);
  };

  const handleNextQuestionSection = () => {
    setCurrentSection(currentSection + 1);
  }

  const handleBackQuestionSection = () => {
    setCurrentSection(currentSection - 1);
  }

  // 完成问卷并跳转到结果页面的函数
  const finishQuestionnaire = () => {
    // Calculate final results
    calculateTagResults(answers);
    setStep('results');
    if (selectedIdentity) {
      questionnaireApi
        .saveAllQuestionResponses(answers, selectedIdentity, selectedRole)
        .catch(() => {});
    }
  };

  // Save & Exit button on questionnaire screens only
  const handleSaveAndExit = () => {
    try {
      // Ensure latest values are saved
      localStorage.setItem('chon_personality_step', 'questionnaire');
      localStorage.setItem('chon_personality_answers', JSON.stringify(answers));
      if (selectedIdentity) {
        localStorage.setItem('chon_personality_identity', JSON.stringify(selectedIdentity));
      }
      if (selectedRole) {
        localStorage.setItem('chon_personality_role', JSON.stringify(selectedRole));
      }
      localStorage.setItem('chon_personality_section', String(currentSection));
    } catch (e) {
      // swallow
    }
    navigate('/');
  };

  // Restart button (replaces Exit) on questionnaire/privacy screens
  const handleRestart = (e?: React.MouseEvent) => {
    const confirmRestart = window.confirm(
      language === 'en'
        ? 'Restart the test? All progress will be cleared.'
        : '重新开始测试？所有进度将被清除。'
    );
    if (!confirmRestart) {
      e?.preventDefault();
      return;
    }
    handleClearTestData();
  };

  const handleClearTestData = () => {
    localStorage.removeItem('chon_personality_answers');
    localStorage.removeItem('chon_personality_step');
    localStorage.removeItem('chon_personality_identity');
    localStorage.removeItem('chon_personality_user_intro_choice');
    localStorage.removeItem('chon_personality_role');
    localStorage.removeItem('chon_personality_section');
    localStorage.removeItem('tagStats');
    
    // Reset all state and go directly to identity
    setAnswers({});
    setSelectedIdentity(null);
    setSelectedRole(null);
    setUserIntroChoice(null);
    setCurrentSection(0);
    setStep('intro');
  };

  /* =============== Render =============== */
  const renderQuestionsSection = (identity: QuestionnaireType, currentSection: number) => {
    const menu = questionsMenu.find(menu => menu.identity === identity) || null;
    if (!menu) {
      return null;
    }
    const progress = calculatedQuestionnaireProgress(menu, answers);
    let section: QuestionSection | null = null;
    if (currentSection < menu.sections.length) {
      section = menu.sections[currentSection];
      const showBack = currentSection > 0;
      const showNext = currentSection < menu.sections.length - 1;
      const showFinish = currentSection === menu.sections.length - 1;
      return (
        <QuestionsSection 
          key={section.sectionId} 
          section={section}
          language={language}
          identity={selectedIdentity}
          progress={progress}
          showBack={showBack}
          showNext={showNext}
          showFinish={showFinish}
          currentAnswers={answers}
          workedInCorporate={workedInCoporate}
          onMultipleChoice={handleMultipleChoiceAnswer}
          onTextInput={handleTextAnswer}
          onScale={handleScaleAnswer}
          onNext={handleNextQuestionSection}
          onBack={handleBackQuestionSection}
          onFinish={finishQuestionnaire}
          scrollToFirstQuestionOfNextPage={scrollToFirstQuestionOfNextPage}
        />
      )
    }
    return null;
  }

  // Render content based on step
  const renderContent = () => {
    switch (step) {
      case 'intro':
        return (
          <IntroSection 
            userIntroChoice={userIntroChoice}
            onOptionClick={handleIntroOptionClick}
            onBeginTest={handleIntroBeginTest}
          />
        );
      case 'identity':
        return (
          <IdentitySelection
            selectedIdentity={selectedIdentity}
            selectedRole={selectedRole}
            onIdentitySelect={handleIdentitySelect}
            onCorporateRoleSelect={handleCorporateRoleSelect}
            onContinue={handleIdentityContinue}
          />
        );
      case 'privacy':
        return (
          <PrivacyStatement
            selectedIdentity={selectedIdentity}
            onContinue={handlePrivacyContinue}
          />
        );
      case 'questionnaire':
        if (selectedIdentity) {
          return renderQuestionsSection(selectedIdentity, currentSection);
        }
        return null;
      case 'results':
        return <Results onCreateAccount={() => setStep('account')} onRestart={() => handleRestart()} />;
      case 'account':
        return (
          <AccountSignup
            language={language}
            answers={answers}
            onCancel={() => setStep('results')}
            onSuccess={() => {
              // After successful signup, keep them on results or home
              setStep('results');
            }}
          />
        );
      default:
        return null;
    }
  };

  // Only white theme steps should have no-header class
  const containerClass = step === 'privacy' || step === 'questionnaire'
  ? 'personality-test-container no-header' 
  : 'personality-test-container';

  return (
    <>
      {step === 'results' ? (
        <Results onCreateAccount={() => setStep('account')} onRestart={() => handleRestart()} />
      ) : (
        <main className={containerClass} lang={language}>
          
          {showSaveIndicator && (
            <div className="save-indicator">
              {language === 'en' ? 'Progress saved' : '进度已保存'}
            </div>
          )}
        
          {step !== 'privacy' && step !== 'questionnaire' && (
            <>
              <div className="molecule-background"></div>
              <div className="hexagon-pattern"></div>
            </>
          )}
          
      {/* Show top actions (Restart; Save & Exit on questionnaire) */}
      {(step === 'privacy' || step === 'questionnaire') && (
        <TopActions 
          step={step}
          language={language}
          onRestart={handleRestart}
          onSaveAndExit={handleSaveAndExit}
        />
      )}
          
          {renderContent()}
          
          {/* Only show LanguageSelector when not in questionnaire or privacy screens */}
          {step !== 'privacy' && step !== 'questionnaire' && <LanguageSelector />}
        </main>
      )}
    </>
  );
};

export default PersonalityTest; 