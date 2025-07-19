import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector.tsx';
import './PersonalityTest.css';
import BothQuestionnaire from './BothQuestionnaire.tsx';
import { scrollToNextQuestion, scrollToFirstQuestionOfNextPage } from './ScrollUtils.ts';
import questionnaireApi, { prepareQuestionResponses, QuestionResponse } from '../../api/questionnaire.ts';
import { questionnaires, Question, QuestionType, QuestionnaireType, QuestionnaireContext } from './questionnaires.ts';
import QuestionBlock from './QuestionBlock';
import QuestionNavigation from './QuestionNavigation';
import ProgressBar from './ProgressBar';
import QuestionnaireSwitcher from './QuestionnaireSwitcher';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

type IdentityType = 'mother' | 'corporate' | 'both' | 'other';
type CorporateRole = 
  | 'founder' 
  | 'board_member' 
  | 'c_suite_executive' 
  | 'president' 
  | 'managing_director'
  | 'partner'
  | 'vice_president'
  | 'director'
  | 'senior_manager';
type TestStep = 'intro' | 'identity' | 'corporate_role' | 'privacy' | 'questionnaire';

interface PersonalityTestProps {
  onWhiteThemeChange?: (isWhite: boolean) => void;
  onHideUIChange?: (shouldHide: boolean) => void;
}

// MetaTags Component for Mobile Optimization
const MetaTags = () => {
  React.useEffect(() => {
    // Ensure the viewport meta tag is set correctly for this page
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Cleanup function to restore the original meta tag when component unmounts
    return () => {
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, []);
  
  return null;
};

const PersonalityTest = ({ onWhiteThemeChange, onHideUIChange }: PersonalityTestProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate(); // 添加导航钩子
  const location = useLocation();
  const [step, setStep] = useState<TestStep>('intro');
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [selectedIdentities, setSelectedIdentities] = useState<Set<IdentityType>>(new Set());
  const [corporateRole, setCorporateRole] = useState<CorporateRole | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showFirstPage, setShowFirstPage] = useState(true);
  const [showSecondPage, setShowSecondPage] = useState(false);
  const [showThirdPage, setShowThirdPage] = useState(false);
  const [showFourthPage, setShowFourthPage] = useState(false);
  const [showFifthPage, setShowFifthPage] = useState(false);
  const [showSixthPage, setShowSixthPage] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  // 替换静态百分比为动态状态
  const [introStats, setIntroStats] = useState({
    yesCount: 0,
    noCount: 0,
    yesPercentage: 65, // 默认值，将被API数据替换
    loading: true
  });
  // Add state to track current questionnaire type
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<QuestionnaireType | null>(null);
  // Add state to track secondary questionnaire for "both" option
  const [secondaryQuestionnaire, setSecondaryQuestionnaire] = useState<QuestionnaireType | null>(null);
  // Add state to track if we're showing the primary or secondary questionnaire
  const [showingPrimaryQuestionnaire, setShowingPrimaryQuestionnaire] = useState(true);
  // Add state to track primary answers separately from secondary
  const [primaryAnswers, setPrimaryAnswers] = useState<Record<number, string>>({});
  const [secondaryAnswers, setSecondaryAnswers] = useState<Record<number, string>>({});
  // 添加标签得分计算相关的状态
  const [tagScores, setTagScores] = useState<Record<string, Record<number, number>>>();
  
  // Add new state for branch tracking after the existing state declarations
  const [branchingPath, setBranchingPath] = useState<'default' | 'yes-path' | 'no-path'>('default');
  const [hasBranchingQuestion, setHasBranchingQuestion] = useState(false);
  
  // Add interface definition
  interface TagStats {
    userScore: number;
    totalPossibleScore: number;
    scorePercentage: number;
    averageScore: number;
    answeredQuestions: number;
  }

  // Helper to get current questionnaire
  const getCurrentQuestionnaire = (): QuestionnaireContext | null => {
    // When both mother and corporate are selected
    if (selectedIdentities.has('mother') && selectedIdentities.has('corporate')) {
      if (showingPrimaryQuestionnaire) {
        return activeQuestionnaire ? questionnaires[activeQuestionnaire] : null;
      } else {
        return secondaryQuestionnaire ? questionnaires[secondaryQuestionnaire] : null;
      }
    }
    
    // Single selection case
    return activeQuestionnaire ? questionnaires[activeQuestionnaire] : null;
  };

  // Helper to get current questions
  const getCurrentQuestions = (): Question[] => {
    return getCurrentQuestionnaire()?.questions || [];
  };
  
  // Helper to get total questions count
  const getTotalQuestions = (): number => {
    return getCurrentQuestionnaire()?.totalQuestions || 0;
  };
  
  // 从本地存储加载答案数据
  useEffect(() => {
    const savedAnswers = localStorage.getItem('chon_personality_answers');
    const savedStep = localStorage.getItem('chon_personality_step');
    const savedIdentities = localStorage.getItem('chon_personality_identities');
    const savedUserChoice = localStorage.getItem('chon_personality_user_choice');
    const savedShowFirstPage = localStorage.getItem('chon_personality_show_first_page');
    const savedShowSecondPage = localStorage.getItem('chon_personality_show_second_page');
    const savedShowThirdPage = localStorage.getItem('chon_personality_show_third_page');
    const savedShowFourthPage = localStorage.getItem('chon_personality_show_fourth_page');
    const savedShowFifthPage = localStorage.getItem('chon_personality_show_fifth_page');
    const savedShowSixthPage = localStorage.getItem('chon_personality_show_sixth_page');
    
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
    
    if (savedStep && isValidStep(savedStep)) {
      setStep(savedStep as TestStep);
    }
    
    if (savedIdentities) {
      setSelectedIdentities(new Set(JSON.parse(savedIdentities)));
    }
    
    if (savedUserChoice) {
      setUserChoice(savedUserChoice);
    }
    
    if (savedShowFirstPage) {
      setShowFirstPage(savedShowFirstPage === 'true');
    }
    
    if (savedShowSecondPage) {
      setShowSecondPage(savedShowSecondPage === 'true');
    }
    
    if (savedShowThirdPage) {
      setShowThirdPage(savedShowThirdPage === 'true');
    }
    
    if (savedShowFourthPage) {
      setShowFourthPage(savedShowFourthPage === 'true');
    }
    
    if (savedShowFifthPage) {
      setShowFifthPage(savedShowFifthPage === 'true');
    }
    
    if (savedShowSixthPage) {
      setShowSixthPage(savedShowSixthPage === 'true');
    }
  }, []);
  
  // 验证步骤值是否有效
  const isValidStep = (step: string): boolean => {
    return ['intro', 'identity', 'privacy', 'questionnaire'].includes(step);
  };
  
  // 保存答案到本地存储
  useEffect(() => {
    localStorage.setItem('chon_personality_answers', JSON.stringify(answers));
    if (Object.keys(answers).length > 0) {
      setShowSaveIndicator(true);
      const timer = setTimeout(() => {
        setShowSaveIndicator(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [answers]);
  
  // 保存当前步骤到本地存储
  useEffect(() => {
    localStorage.setItem('chon_personality_step', step);
  }, [step]);
  
  // 保存身份选择到本地存储
  useEffect(() => {
    localStorage.setItem('chon_personality_identities', JSON.stringify(Array.from(selectedIdentities)));
  }, [selectedIdentities]);
  
  // 保存用户选择到本地存储
  useEffect(() => {
    if (userChoice) {
      localStorage.setItem('chon_personality_user_choice', userChoice);
    }
  }, [userChoice]);
  
  // 保存问题索引和页面状态到本地存储
  useEffect(() => {
    localStorage.setItem('chon_personality_show_first_page', showFirstPage.toString());
    localStorage.setItem('chon_personality_show_second_page', showSecondPage.toString());
    localStorage.setItem('chon_personality_show_third_page', showThirdPage.toString());
    localStorage.setItem('chon_personality_show_fourth_page', showFourthPage.toString());
    localStorage.setItem('chon_personality_show_fifth_page', showFifthPage.toString());
    localStorage.setItem('chon_personality_show_sixth_page', showSixthPage.toString());
  }, [showFirstPage, showSecondPage, showThirdPage, showFourthPage, showFifthPage, showSixthPage]);

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
  }, [step, onWhiteThemeChange, onHideUIChange]);

  // 添加获取intro统计数据的函数
  const fetchIntroStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/intro-stats`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      
      // 只有在用户已经做出选择时，才更新UI显示
      setIntroStats({
        yesCount: data.yes_count,
        noCount: data.no_count,
        yesPercentage: data.yes_percentage,
        loading: false
      });
      
      console.log("Fetched intro stats:", data);
    } catch (error) {
      console.error("Error fetching intro stats:", error);
      setIntroStats(prev => ({...prev, loading: false}));
    }
  };

  // 在用户选择yes/no后获取最新统计数据
  useEffect(() => {
    if (userChoice) {
      // 稍微延迟，让后端有时间更新数据
      const timer = setTimeout(() => {
        fetchIntroStats();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [userChoice]);

  // 在组件挂载或step变为'intro'时进行初始化
  useEffect(() => {
    if (step === 'intro') {
      // 重置userChoice，确保用户每次回到intro页面时都会看到选项
      setUserChoice(null);
      
      // 同时预加载统计数据，但不会影响UI显示
      fetchIntroStats();
    }
  }, [step]);

  const handleOptionClick = (choice: string) => {
    setUserChoice(choice);
    
    // 实时保存intro choice到后端
    questionnaireApi.saveIntroChoice(choice);
    // 设置loading状态，等待数据更新
    setIntroStats(prev => ({...prev, loading: true}));
  };
  
  const handleBeginTest = () => {
    setStep('identity');
  };

  const handleIdentitySelect = (identity: IdentityType) => {
    // Create a new set to save selected identities
    const newSelectedIdentities = new Set(selectedIdentities);

    // If 'other' is selected, clear all other selections
    if (identity === 'other') {
      if (newSelectedIdentities.has('other')) {
        newSelectedIdentities.delete('other');
      } else {
        newSelectedIdentities.clear();
        newSelectedIdentities.add('other');
        setActiveQuestionnaire('other');
      }
      setCorporateRole(null); // Reset corporate role
    } else if (identity === 'corporate') {
      if (newSelectedIdentities.has('corporate')) {
        newSelectedIdentities.delete('corporate');
        setCorporateRole(null); // Reset corporate role when unselecting corporate
      } else {
        newSelectedIdentities.delete('other');
        newSelectedIdentities.add('corporate');
        setActiveQuestionnaire('corporate');
      }
    } else {
      // Handle mother/both selection
      if (newSelectedIdentities.has(identity)) {
        newSelectedIdentities.delete(identity);
      } else {
        newSelectedIdentities.delete('other');
        newSelectedIdentities.add(identity);
      }
      setCorporateRole(null); // Reset corporate role for other identities
    }

    // Update active questionnaire based on selections
    if (newSelectedIdentities.has('mother') && newSelectedIdentities.has('corporate')) {
      setActiveQuestionnaire('both');
    } else if (newSelectedIdentities.has('mother')) {
      setActiveQuestionnaire('mother');
    } else if (newSelectedIdentities.has('corporate')) {
      setActiveQuestionnaire('corporate');
    } else if (newSelectedIdentities.has('other')) {
      setActiveQuestionnaire('other');
    } else {
      setActiveQuestionnaire(null);
    }

    setSelectedIdentities(newSelectedIdentities);
  };

  const handleContinue = () => {
    if (selectedIdentities.size === 0) {
      return;
    }

    // If corporate is selected alone (not part of 'both'), go to role selection
    if (selectedIdentities.has('corporate') && !selectedIdentities.has('mother')) {
      setStep('corporate_role');
      return;
    }

    // Set active questionnaire type based on selected identity
    if (selectedIdentities.has('mother') && selectedIdentities.has('corporate')) {
      setActiveQuestionnaire('both');
      setSecondaryQuestionnaire(null);
    } else if (selectedIdentities.has('mother')) {
      setActiveQuestionnaire('mother');
      setSecondaryQuestionnaire(null);
    } else if (selectedIdentities.has('corporate')) {
      setActiveQuestionnaire('corporate');
      setSecondaryQuestionnaire(null);
    } else if (selectedIdentities.has('other')) {
      setActiveQuestionnaire('other');
      setSecondaryQuestionnaire(null);
    }

    // Proceed to privacy statement
    setStep('privacy');
  };

  const handlePrivacyContinue = () => {
    // 确保所有页面状态初始化
    setShowFirstPage(true);
    setShowSecondPage(false);
    setShowThirdPage(false);
    setShowFourthPage(false);
    setShowFifthPage(false);
    setShowSixthPage(false);
    
    // 如果是both类型，初始化primary和secondary答案容器
    if (activeQuestionnaire === 'both') {
      setPrimaryAnswers({});
      setSecondaryAnswers({});
      setShowingPrimaryQuestionnaire(true);
    }
    
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

  const isIdentitySelected = (identity: IdentityType): boolean => {
    return selectedIdentities.has(identity);
  };

  // Handle answer selection for multiple choice questions
  const handleMultipleChoiceAnswer = (questionId: number, optionId: string) => {
    const currentAnswers = getCurrentAnswers();
    setCurrentAnswers({
      ...currentAnswers,
      [questionId]: optionId
    });
    
    // Add branching logic for specific question (e.g., question 6)
    if (questionId === 6) {
      setHasBranchingQuestion(true);
      if (optionId === 'A') { // Yes
        setBranchingPath('yes-path');
      } else if (optionId === 'B') { // No
        setBranchingPath('no-path');
      }
    }
    
    // Update tag scores
    updateTagScores(questionId, optionId);
    
    // Add new feature: auto-scroll to next question
    setTimeout(() => {
      scrollToNextQuestion(questionId);
    }, 100);
  };

  // Handle text input for free text questions
  const handleTextAnswer = (questionId: number, text: string) => {
    const currentAnswers = getCurrentAnswers();
    // Only update answer when there's text content
    if (text.trim()) {
      setCurrentAnswers({
        ...currentAnswers,
        [questionId]: text
      });
    } else {
      // Remove the answer if text is empty to accurately track progress
      const newAnswers = {...currentAnswers};
      delete newAnswers[questionId];
      setCurrentAnswers(newAnswers);
    }
  };

  // Handle scale question answer
  const handleScaleAnswer = (questionId: number, value: string) => {
    const currentAnswers = getCurrentAnswers();
    setCurrentAnswers({
      ...currentAnswers,
      [questionId]: value
    });
    
    // Update tag scores
    updateTagScores(questionId, value);
    
    // Add new feature: auto-scroll to next question
    setTimeout(() => {
      scrollToNextQuestion(questionId);
    }, 100);
  };

  // Helper to get current answers based on which questionnaire is active
  const getCurrentAnswers = (): Record<number, string> => {
    // When both mother and corporate are selected or 'both' questionnaire is active
    if ((selectedIdentities.has('mother') && selectedIdentities.has('corporate')) || activeQuestionnaire === 'both') {
      return showingPrimaryQuestionnaire ? primaryAnswers : secondaryAnswers;
    }
    return answers;
  };

  // Helper to set current answers based on which questionnaire is active
  const setCurrentAnswers = (newAnswers: Record<number, string>) => {
    // When both mother and corporate are selected or 'both' questionnaire is active
    if ((selectedIdentities.has('mother') && selectedIdentities.has('corporate')) || activeQuestionnaire === 'both') {
      if (showingPrimaryQuestionnaire) {
        setPrimaryAnswers(newAnswers);
      } else {
        setSecondaryAnswers(newAnswers);
      }
    } else {
      setAnswers(newAnswers);
    }
  };

  // Add a method to switch between questionnaires for "both" type
  const switchQuestionnaire = () => {
    if ((selectedIdentities.has('mother') && selectedIdentities.has('corporate')) || activeQuestionnaire === 'both') {
      setShowingPrimaryQuestionnaire(!showingPrimaryQuestionnaire);
      // Reset question index when switching
      setShowFirstPage(true);
      setShowSecondPage(false);
      setShowThirdPage(false);
      // Reset all page visibility states
      setShowFourthPage(false);
      setShowFifthPage(false);
      setShowSixthPage(false);
    }
  };

  const renderQuestionnaireContent = () => {
    if (!activeQuestionnaire) return null;
    const questions = getCurrentQuestions();
    if (!questions || questions.length === 0) return null;

    switch (activeQuestionnaire) {
      case 'mother':
        return renderMotherQuestionnaire(questions);
      case 'corporate':
        return renderCorporateQuestionnaire(questions);
      case 'other':
        return renderOtherQuestionnaire(questions);
      case 'both':
        return renderBothQuestionnaire(questions);
      default:
        return null;
    }
  };

  const renderMotherQuestionnaire = (questions: Question[]) => {
    // Helper function to get questions based on branching logic
    const getQuestionsForCurrentPage = (startIndex: number, endIndex: number) => {
      if (!hasBranchingQuestion || startIndex < 6) {
        // Before branching question, show all questions normally
        return questions.slice(startIndex, endIndex);
      }

      if (startIndex === 6) {
        // Include branching question
        return questions.slice(6, 7);
      }

      if (branchingPath === 'yes-path') {
        // Questions for "yes" path (e.g., 7-10)
        return questions.slice(7, 11);
      }

      if (branchingPath === 'no-path') {
        // Questions for "no" path (e.g., 11-13)
        return questions.slice(11, 14);
      }

      // After branching paths converge (e.g., from question 14 onwards)
      if (startIndex >= 14) {
        return questions.slice(startIndex, endIndex);
      }

      return [];
    };

    return (
      <div className="questionnaire-content mother-questionnaire" lang={language}>
        {/* Progress bar */}
        <ProgressBar progress={calculatedQuestionnaireProgress()} />
        
        {/* Show switcher for "both" option */}
        {(selectedIdentities.has('mother') && selectedIdentities.has('corporate')) || activeQuestionnaire === 'both' ? (
          <QuestionnaireSwitcher
            isPrimaryActive={showingPrimaryQuestionnaire}
            onSwitch={switchQuestionnaire}
            primaryLabel={language === 'en' ? 'Mother Questionnaire' : '母亲问卷'}
            secondaryLabel={language === 'en' ? 'Corporate Questionnaire' : '企业问卷'}
          />
        ) : null}
        
        {/* 母亲问卷分页内容 */}
        {
          showFirstPage ? (
            // 第1页: 根据分支逻辑获取问题
            <div className="first-page-questions first-page-true">
              {getQuestionsForCurrentPage(0, 10).map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  currentAnswer={getCurrentAnswers()[question.id]}
                  language={language}
                  onMultipleChoice={handleMultipleChoiceAnswer}
                  onTextInput={handleTextAnswer}
                  onScale={handleScaleAnswer}
                />
              ))}
              
              {/* 母亲问卷第一页导航按钮 */}
              <QuestionNavigation
                showBack={false}
                showNext={true}
                onBack={() => {
                  setShowFirstPage(false);
                  setShowThirdPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                onNext={() => {
                  setShowFirstPage(false);
                  setShowThirdPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                nextDisabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 1 && parseInt(id) <= 8).length < 8}
                backLabel={language === 'en' ? 'Back' : '返回'}
                nextLabel={language === 'en' ? 'Continue' : '继续'}
              />
            </div>
          ) : showThirdPage ? (
            // 第2页: 根据分支逻辑获取问题
            <div className="first-page-questions">
              <h1 className="section-title">
                {language === 'en' 
                  ? 'I. About Work-Life Balance' 
                  : 'I. 关于工作与生活的平衡'}
              </h1>
              
              {getQuestionsForCurrentPage(10, 23).map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  currentAnswer={getCurrentAnswers()[question.id]}
                  language={language}
                  onMultipleChoice={handleMultipleChoiceAnswer}
                  onTextInput={handleTextAnswer}
                  onScale={handleScaleAnswer}
                />
              ))}
              
              <QuestionNavigation
                showBack={true}
                showNext={true}
                onBack={() => {
                  setShowThirdPage(false);
                  setShowFirstPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                onNext={() => {
                  setShowThirdPage(false);
                  setShowFourthPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                nextDisabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 9 && parseInt(id) <= 21).length < 13}
                backLabel={language === 'en' ? 'Back' : '返回'}
                nextLabel={language === 'en' ? 'Continue' : '继续'}
              />
            </div>
          ) : showFourthPage ? (
            // 第3页: ID 22-35，标题"II. About Us, CHON / 关于我们"
            <div className="first-page-questions">
              <h1 className="section-title">
                {language === 'en' 
                  ? 'II. About Us, CHON' 
                  : 'II. 关于我们'}
              </h1>
              
              {getQuestionsForCurrentPage(23, 37).map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  currentAnswer={getCurrentAnswers()[question.id]}
                  language={language}
                  onMultipleChoice={handleMultipleChoiceAnswer}
                  onTextInput={handleTextAnswer}
                  onScale={handleScaleAnswer}
                />
              ))}
              
              <QuestionNavigation
                showBack={true}
                showNext={true}
                onBack={() => {
                  setShowFourthPage(false);
                  setShowThirdPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                onNext={() => {
                  setShowFourthPage(false);
                  setShowFifthPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                nextDisabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 22 && parseInt(id) <= 35).length < 14}
                backLabel={language === 'en' ? 'Back' : '返回'}
                nextLabel={language === 'en' ? 'Continue' : '继续'}
              />
            </div>
          ) : showFifthPage ? (
            // 第4页: ID 36-48，标题"III. About Motherhood"
            <div className="first-page-questions">
              <h1 className="section-title">
                {language === 'en' 
                  ? 'III. About Motherhood' 
                  : 'III. 关于母亲'}
              </h1>
              
              {getQuestionsForCurrentPage(37, 50).map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  currentAnswer={getCurrentAnswers()[question.id]}
                  language={language}
                  onMultipleChoice={handleMultipleChoiceAnswer}
                  onTextInput={handleTextAnswer}
                  onScale={handleScaleAnswer}
                />
              ))}
              
              <QuestionNavigation
                showBack={true}
                showNext={false}
                showFinish={true}
                onBack={() => {
                  setShowFifthPage(false);
                  setShowFourthPage(true);
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                onFinish={finishQuestionnaire}
                finishDisabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 36 && parseInt(id) <= 48).length < 13}
                backLabel={language === 'en' ? 'Back' : '返回'}
                finishLabel={language === 'en' ? 'Finish' : '完成'}
              />
            </div>
          ) : null
        }
      </div>
    );
  };

  const renderCorporateQuestionnaire = (questions: Question[]) => {
    return (
      <div className="questionnaire-content corporate-questionnaire" lang={language}>
        {/* Progress bar */}
        <ProgressBar progress={calculatedQuestionnaireProgress()} />
        
        {/* Show switcher for "both" option */}
        {(selectedIdentities.has('mother') && selectedIdentities.has('corporate')) || activeQuestionnaire === 'both' ? (
          <QuestionnaireSwitcher
            isPrimaryActive={showingPrimaryQuestionnaire}
            onSwitch={switchQuestionnaire}
            primaryLabel={language === 'en' ? 'Mother Questionnaire' : '母亲问卷'}
            secondaryLabel={language === 'en' ? 'Corporate Questionnaire' : '企业问卷'}
          />
        ) : null}
        
        {/* 企业问卷分页内容 */}
        {
          showFirstPage ? (
            // 第1页: ID 1-12，无标题
            <div className="first-page-questions first-page-true">
              {questions.slice(0, 12).map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  currentAnswer={getCurrentAnswers()[question.id]}
                  language={language}
                  onMultipleChoice={handleMultipleChoiceAnswer}
                  onTextInput={handleTextAnswer}
                  onScale={handleScaleAnswer}
                />
              ))}
              
              <QuestionNavigation
                showBack={false}
                showNext={true}
                onBack={() => {
                  setShowFirstPage(false);
                  setShowSecondPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                onNext={() => {
                  setShowFirstPage(false);
                  setShowSecondPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                nextDisabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 1 && parseInt(id) <= 7).length < 7}
                backLabel={language === 'en' ? 'Back' : '返回'}
                nextLabel={language === 'en' ? 'Continue' : '继续'}
              />
            </div>
          ) : showSecondPage ? (
            // 第2页: ID 8-21，标题"I. 关于您的领导力 / About Your Leadership"
            <div className="first-page-questions">
              <h1 className="section-title">
                {language === 'en' 
                  ? 'I. About Your Leadership' 
                  : 'I. 关于您的领导力'}
              </h1>
              
              {questions.slice(12, 26).map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  currentAnswer={getCurrentAnswers()[question.id]}
                  language={language}
                  onMultipleChoice={handleMultipleChoiceAnswer}
                  onTextInput={handleTextAnswer}
                  onScale={handleScaleAnswer}
                />
              ))}
              
              <QuestionNavigation
                showBack={true}
                showNext={true}
                onBack={() => {
                  setShowSecondPage(false);
                  setShowFirstPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                onNext={() => {
                  setShowSecondPage(false);
                  setShowThirdPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                nextDisabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 8 && parseInt(id) <= 21).length < 14}
                backLabel={language === 'en' ? 'Back' : '返回'}
                nextLabel={language === 'en' ? 'Continue' : '继续'}
              />
            </div>
          ) : showThirdPage ? (
            // 第3页: ID 22-36，标题"II. About Us, CHON / 关于我们"
            <div className="first-page-questions">
              <h1 className="section-title">
                {language === 'en' 
                  ? 'II. About Us, CHON' 
                  : 'II. 关于我们'}
              </h1>
              
              {questions.slice(26, 41).map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  currentAnswer={getCurrentAnswers()[question.id]}
                  language={language}
                  onMultipleChoice={handleMultipleChoiceAnswer}
                  onTextInput={handleTextAnswer}
                  onScale={handleScaleAnswer}
                />
              ))}
              
              <QuestionNavigation
                showBack={true}
                showNext={true}
                onBack={() => {
                  setShowThirdPage(false);
                  setShowSecondPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                onNext={() => {
                  setShowThirdPage(false);
                  setShowFourthPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                nextDisabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 22 && parseInt(id) <= 36).length < 15}
                backLabel={language === 'en' ? 'Back' : '返回'}
                nextLabel={language === 'en' ? 'Continue' : '继续'}
              />
            </div>
          ) : showFourthPage ? (
            // 第4页: ID 37-47，标题"III. About Motherhood 关于母亲"
            <div className="first-page-questions">
              <h1 className="section-title">
                {language === 'en' 
                  ? 'III. About Motherhood' 
                  : 'III. 关于母亲'}
              </h1>
              
              {questions.slice(41, 52).map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  currentAnswer={getCurrentAnswers()[question.id]}
                  language={language}
                  onMultipleChoice={handleMultipleChoiceAnswer}
                  onTextInput={handleTextAnswer}
                  onScale={handleScaleAnswer}
                />
              ))}
              
              <QuestionNavigation
                showBack={true}
                showNext={false}
                showFinish={true}
                onBack={() => {
                  setShowFourthPage(false);
                  setShowThirdPage(true);
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                onFinish={finishQuestionnaire}
                finishDisabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 32 && parseInt(id) <= 42).length < 11}
                backLabel={language === 'en' ? 'Back' : '返回'}
                finishLabel={language === 'en' ? 'Finish' : '完成'}
              />
            </div>
          ) : null
        }
      </div>
    );
  };

  const renderOtherQuestionnaire = (questions: Question[]) => {
    return (
      <div className="questionnaire-content other-questionnaire" lang={language}>
        {/* Progress bar */}
        <ProgressBar progress={calculatedQuestionnaireProgress()} />
        
        {/* 其他问卷分页内容 */}
        {
          showFirstPage ? (
            // 第1页: ID 1-4，无标题
            <div className="first-page-questions first-page-true">
              {questions.slice(0, 4).map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  currentAnswer={getCurrentAnswers()[question.id]}
                  language={language}
                  onMultipleChoice={handleMultipleChoiceAnswer}
                  onTextInput={handleTextAnswer}
                  onScale={handleScaleAnswer}
                />
              ))}
              
              <QuestionNavigation
                showBack={false}
                showNext={true}
                onBack={() => {
                  setShowFirstPage(false);
                  setShowSecondPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                onNext={() => {
                  setShowFirstPage(false);
                  setShowSecondPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                nextDisabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 1 && parseInt(id) <= 4).length < 4}
                backLabel={language === 'en' ? 'Back' : '返回'}
                nextLabel={language === 'en' ? 'Continue' : '继续'}
              />
            </div>
          ) : showSecondPage ? (
            // 第2页: ID 5-15，标题"I. About Professional Work / 关于职业工作"
            <div className="first-page-questions">
              <h1 className="section-title">
                {language === 'en' 
                  ? 'I. About Professional Work' 
                  : 'I. 关于职业工作'}
              </h1>
              
              {questions.slice(4, 15).map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  currentAnswer={getCurrentAnswers()[question.id]}
                  language={language}
                  onMultipleChoice={handleMultipleChoiceAnswer}
                  onTextInput={handleTextAnswer}
                  onScale={handleScaleAnswer}
                />
              ))}
              
              <QuestionNavigation
                showBack={true}
                showNext={true}
                onBack={() => {
                  setShowSecondPage(false);
                  setShowFirstPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                onNext={() => {
                  setShowSecondPage(false);
                  setShowThirdPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                nextDisabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 5 && parseInt(id) <= 15).length < 11}
                backLabel={language === 'en' ? 'Back' : '返回'}
                nextLabel={language === 'en' ? 'Continue' : '继续'}
              />
            </div>
          ) : showThirdPage ? (
            // 第3页: ID 16-30，标题"II. About Us, CHON / 关于我们"
            <div className="first-page-questions">
              <h1 className="section-title">
                {language === 'en' 
                  ? 'II. About Us, CHON' 
                  : 'II. 关于我们'}
              </h1>
              
              {questions.slice(15, 30).map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  currentAnswer={getCurrentAnswers()[question.id]}
                  language={language}
                  onMultipleChoice={handleMultipleChoiceAnswer}
                  onTextInput={handleTextAnswer}
                  onScale={handleScaleAnswer}
                />
              ))}
              
              <QuestionNavigation
                showBack={true}
                showNext={true}
                onBack={() => {
                  setShowThirdPage(false);
                  setShowSecondPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                onNext={() => {
                  setShowThirdPage(false);
                  setShowFourthPage(true);
                  // 添加自动滚动功能
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                nextDisabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 16 && parseInt(id) <= 30).length < 15}
                backLabel={language === 'en' ? 'Back' : '返回'}
                nextLabel={language === 'en' ? 'Continue' : '继续'}
              />
            </div>
          ) : showFourthPage ? (
            // 第4页: ID 31-41，标题"III. About Motherhood / 关于母亲"
            <div className="first-page-questions">
              <h1 className="section-title">
                {language === 'en' 
                  ? 'III. About Motherhood' 
                  : 'III. 关于母亲'}
              </h1>
              
              {questions.slice(30, 41).map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  currentAnswer={getCurrentAnswers()[question.id]}
                  language={language}
                  onMultipleChoice={handleMultipleChoiceAnswer}
                  onTextInput={handleTextAnswer}
                  onScale={handleScaleAnswer}
                />
              ))}
              
              <QuestionNavigation
                showBack={true}
                showNext={false}
                showFinish={true}
                onBack={() => {
                  setShowFourthPage(false);
                  setShowThirdPage(true);
                  setTimeout(scrollToFirstQuestionOfNextPage, 100);
                }}
                onFinish={finishQuestionnaire}
                finishDisabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 31 && parseInt(id) <= 41).length < 11}
                backLabel={language === 'en' ? 'Back' : '返回'}
                finishLabel={language === 'en' ? 'Finish' : '完成'}
              />
            </div>
          ) : null
        }
      </div>
    );
  };

  const renderBothQuestionnaire = (questions: Question[]) => {
    return (
      <BothQuestionnaire
        language={language}
        getCurrentAnswers={getCurrentAnswers}
        handleMultipleChoiceAnswer={handleMultipleChoiceAnswer}
        handleTextAnswer={handleTextAnswer}
        handleScaleAnswer={handleScaleAnswer}
        showFirstPage={showFirstPage}
        showSecondPage={showSecondPage}
        showThirdPage={showThirdPage}
        showFourthPage={showFourthPage}
        showFifthPage={showFifthPage}
        showSixthPage={showSixthPage}
        setShowFirstPage={setShowFirstPage}
        setShowSecondPage={setShowSecondPage}
        setShowThirdPage={setShowThirdPage}
        setShowFourthPage={setShowFourthPage}
        setShowFifthPage={setShowFifthPage}
        setShowSixthPage={setShowSixthPage}
        scrollToFirstQuestionOfNextPage={scrollToFirstQuestionOfNextPage}
        calculatedQuestionnaireProgress={calculatedQuestionnaireProgress}
        finishQuestionnaire={finishQuestionnaire}
      />
    );
  };

  // 完成问卷并跳转到结果页面的函数
  const finishQuestionnaire = () => {
    // 计算结果并保存
    calculateTagResults();
    
    // 准备提交到后端的回答数据
    let allResponses: QuestionResponse[] = [];
    
    if (activeQuestionnaire === 'both') {
      // 对于'both'问卷，收集主要和次要回答
      const primaryQuestions = questionnaires.both.questions;
      const primaryResponses = prepareQuestionResponses('both', primaryQuestions, primaryAnswers);
      const secondaryResponses = prepareQuestionResponses('both', primaryQuestions, secondaryAnswers);
      
      allResponses = [...primaryResponses, ...secondaryResponses];
    } else if (activeQuestionnaire) {
      // 对于单一问卷
      const questions = questionnaires[activeQuestionnaire].questions;
      const currentQuestionnaire = questionnaires[activeQuestionnaire];
      // 使用uniqueIdMapping（如果存在）
      allResponses = prepareQuestionResponses(
        activeQuestionnaire, 
        questions, 
        answers,
        currentQuestionnaire.uniqueIdMapping
      );
    }
    
    // 一次性保存所有回答
    questionnaireApi.saveAllQuestionResponses(allResponses)
      .then(() => {
        // 保存成功后跳转到结果页面
        navigate('/results');
      })
      .catch((error) => {
        console.error('Error during questionnaire completion:', error);
        // 即使保存失败，仍然跳转到结果页面
        navigate('/results');
      });
  };

  // Exit button that appears only on questionnaire and privacy screens
  const handleExit = (e: React.MouseEvent) => {
    // 添加确认对话框
    const confirmExit = window.confirm(
      language === 'en' 
        ? 'Are you sure you want to exit? All progress will be lost.'
        : '确定要退出吗？所有进度将会丢失。'
    );
    
    if (!confirmExit) {
      e.preventDefault(); // 阻止导航
      return;
    }
    
    // 清空所有localStorage数据
    localStorage.clear();
    
    console.log('已清空所有测试数据');
  };

  const exitButton = (
    <div className="exit-actions">
      <Link to="/" className="exit-button" lang={language} onClick={handleExit}>
        {language === 'en' ? '← Exit' : '← 退出'}
      </Link>
    </div>
  );

  // Only white theme steps should have no-header class
  const containerClass = step === 'privacy' || step === 'questionnaire' 
    ? 'personality-test-container no-header' 
    : 'personality-test-container';

  // 计算问卷进度
  const calculatedQuestionnaireProgress = () => {
    // For "both" option, calculate progress based on active questionnaire
    const answeredCount = Object.keys(getCurrentAnswers()).length;
    const total = getTotalQuestions();
    return total > 0 ? (answeredCount / total) * 100 : 0;
  };

  // 在intro页面确保显示问题和选项
  const renderIntroContent = () => {
    const wrappedQuestion = `<span lang="${language}">${language === 'en' ? t.intro.question : '母亲是天生的领导者。'}</span>`;
    
    return (
      <div className="intro-content" lang={language}>
        <h1 className="intro-question" 
            dangerouslySetInnerHTML={{ __html: wrappedQuestion }}
            lang={language}>
        </h1>
        
        {!userChoice ? (
          <div className="test-options" lang={language}>
            <button 
              className="test-option-button"
              onClick={() => handleOptionClick('yes')}
              lang={language}
            >
              {t.intro.yes}
            </button>
            <button 
              className="test-option-button"
              onClick={() => handleOptionClick('no')}
              lang={language}
            >
              {t.intro.no}
            </button>
          </div>
        ) : (
          <>
            <div className="progress-container" lang={language}>
              <div className="percentage-labels" lang={language}>
                <span className="agree-label" lang={language}>
                  {t.intro.agree} ({introStats.yesPercentage}%)
                </span>
                <span className="disagree-label" lang={language}>
                  {t.intro.disagree} ({100 - introStats.yesPercentage}%)
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${introStats.yesPercentage}%` }}
                ></div>
              </div>
              {introStats.loading && (
                <div className="loading-indicator">
                  {language === 'en' ? 'Loading stats...' : '加载统计数据...'}
                </div>
              )}
            </div>
            
            <button 
              className="begin-test-button" 
              onClick={handleBeginTest}
              lang={language}
            >
              {t.intro.beginTest}
            </button>
          </>
        )}
      </div>
    );
  };

  // Render the identity selection UI
  const renderIdentitySelection = () => {
    return (
      <div className="identity-selection" lang={language}>
        <h1 className="identity-title" lang={language}>{t.personalityTest.identity.title}</h1>
        
        <div 
          className={`option-container ${isIdentitySelected('mother') ? 'selected' : ''}`}
          onClick={() => handleIdentitySelect('mother')}
        >
          <div className="identity-checkbox" onClick={(e) => { e.stopPropagation(); handleIdentitySelect('mother'); }}></div>
          <div 
            className={`identity-option mother ${isIdentitySelected('mother') ? 'selected' : ''}`}
            lang={language}
          >
            <p lang={language}>{t.personalityTest.identity.mother}</p>
          </div>
        </div>
        
        <div 
          className={`option-container ${isIdentitySelected('corporate') ? 'selected' : ''}`}
          onClick={() => handleIdentitySelect('corporate')}
        >
          <div className="identity-checkbox" onClick={(e) => { e.stopPropagation(); handleIdentitySelect('corporate'); }}></div>
          <div 
            className={`identity-option corporate ${isIdentitySelected('corporate') ? 'selected' : ''}`}
            lang={language}
          >
            <p lang={language}>
              {(language === 'en' 
                ? `Corporate Manager`
                : `企业管理人员`
              ).split('\n').map((line, index, arr) => (
                <React.Fragment key={index}>
                  {line}
                  {index < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
        
        <div 
          className={`option-container ${isIdentitySelected('other') ? 'selected' : ''}`}
          onClick={() => handleIdentitySelect('other')}
        >
          <div 
            className={`identity-option other ${isIdentitySelected('other') ? 'selected' : ''}`}
            lang={language}
          >
            <p lang={language}>{t.personalityTest.identity.other}</p>
          </div>
        </div>

        <button 
          className="continue-button"
          onClick={handleContinue}
          disabled={selectedIdentities.size === 0}
          lang={language}
        >
          {language === 'en' ? 'CONTINUE →' : '继续 →'}
        </button>
      </div>
    );
  };

  const renderCorporateRoleSelection = () => {
    const roles = [
      { id: 'founder', en: 'Founder', zh: '创始人' },
      { id: 'board_member', en: 'Board Member', zh: '董事会成员' },
      { id: 'c_suite_executive', en: 'C-Suite Executive', zh: '首席执行官' },
      { id: 'president', en: 'President', zh: '总裁' },
      { id: 'managing_director', en: 'Managing Director', zh: '董事总经理' },
      { id: 'partner', en: 'Partner', zh: '合伙人' },
      { id: 'vice_president', en: 'Vice President', zh: '副总裁' },
      { id: 'director', en: 'Director', zh: '总监' },
      { id: 'senior_manager', en: 'Senior Manager', zh: '高级经理' }
    ];

    return (
      <div className="identity-selection" lang={language}>
        <h1 className="identity-title" lang={language}>
          {language === 'en' ? 'Select Your Role' : '选择您的角色'}
        </h1>
        
        {roles.map(role => (
          <div 
            key={role.id}
            className={`option-container ${corporateRole === role.id ? 'selected' : ''}`}
            onClick={() => setCorporateRole(role.id as CorporateRole)}
          >
            <div 
              className="identity-checkbox" 
              onClick={(e) => { 
                e.stopPropagation(); 
                setCorporateRole(role.id as CorporateRole); 
              }}
            ></div>
            <div 
              className={`identity-option corporate ${corporateRole === role.id ? 'selected' : ''}`}
              lang={language}
            >
              <p lang={language}>
                {language === 'en' ? role.en : role.zh}
              </p>
            </div>
          </div>
        ))}

        <button 
          className="continue-button"
          onClick={() => setStep('privacy')}
          disabled={!corporateRole}
          lang={language}
        >
          {language === 'en' ? 'CONTINUE →' : '继续 →'}
        </button>
      </div>
    );
  };

  // 在多个地方复用的问题文本渲染函数
  const renderQuestionText = (question: Question) => {
    return (
      <h2 className="question-text">
        {language === 'en' ? question.textEn : question.textZh}
        {/* 标签不再前端显示，但数据仍保留在question对象中用于后续分析 */}
      </h2>
    );
  };

  // When user answers a question, update tag scores
  const updateTagScores = (questionId: number, value: string) => {
    const question = getCurrentQuestions().find(q => q.id === questionId);
    if (!question || !question.tags || question.tags.length === 0) return;
    
    console.log(`处理问题 ${questionId} 的回答，值: ${value}, 类型: ${question.type}, tags: ${question.tags}`);
    
    // Calculate score for this question
    let score: number;
    if (question.type === 'scale-question') {
      if (['A', 'B', 'C', 'D', 'E'].includes(value)) {
        const scoreMap: Record<string, number> = {'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5};
        score = scoreMap[value] || 0;
      } else {
        score = parseInt(value, 10) || 0;
      }
    } else {
      score = 0;
    }

    // Update score for each tag this question belongs to
    const newTagScores = {...tagScores};
    question.tags.forEach(tag => {
      if (!newTagScores[tag]) {
        newTagScores[tag] = {};
      }
      // Store score by question ID to avoid counting multiple times
      newTagScores[tag][questionId] = score;
    });
    
    setTagScores(newTagScores);
    localStorage.setItem('tagScores', JSON.stringify(newTagScores));
    calculateAndSaveTagStats(newTagScores);
  };

  // Calculate final statistics for each tag
  const calculateAndSaveTagStats = (currentTagScores: Record<string, Record<number, number>>) => {
    const tagStats: Record<string, TagStats> = {};
    const allTags = ['自我意识', '奉献精神', '社交情商', '情绪调节', '客观能力', '核心耐力'];
    
    // Count questions per tag
    const tagQuestionCounts: Record<string, number> = {};
    const questions = getCurrentQuestions();
    
    questions.forEach(question => {
      if (question.type === 'scale-question' && question.tags) {
        question.tags.forEach(tag => {
          if (!tagQuestionCounts[tag]) {
            tagQuestionCounts[tag] = 0;
          }
          tagQuestionCounts[tag] += 1;
        });
      }
    });
    
    // Calculate stats for each tag
    allTags.forEach(tag => {
      const questionScores = currentTagScores[tag] || {};
      const scores = Object.values(questionScores).filter(score => score > 0);
      const userScore = scores.reduce((sum, score) => sum + score, 0);
      const answeredQuestions = scores.length;
      const totalPossibleScore = tagQuestionCounts[tag] * 5; // Each question max score is 5
      
      const scorePercentage = totalPossibleScore > 0 
        ? Math.min(100, Number(((userScore / totalPossibleScore) * 100).toFixed(2))) 
        : 0;
      const averageScore = answeredQuestions > 0 
        ? Number((userScore / answeredQuestions).toFixed(2)) 
        : 0;
      
      tagStats[tag] = {
        userScore,
        totalPossibleScore,
        scorePercentage,
        averageScore,
        answeredQuestions
      };
    });
    
    localStorage.setItem('tagStats', JSON.stringify(tagStats));
    console.log('==== 标签得分统计 ====');
    console.table(tagStats);
    
    return tagStats;
  };

  // 获取标签统计数据
  const getTagStats = (): Record<string, any> => {
    const savedStats = localStorage.getItem('tagStats');
    if (savedStats) {
      try {
        return JSON.parse(savedStats);
      } catch (e) {
        console.error('Error parsing saved tag statistics:', e);
        return {};
      }
    }
    return {};
  };

  // 在useEffect中添加从localStorage读取标签得分和统计数据的代码
  useEffect(() => {
    // 定义所有标签
    const allTags = ['自我意识', '奉献精神', '社交情商', '情绪调节', '客观能力', '核心耐力'];
    const loadedTagScores: Record<string, Record<number, number>> = {};
    
    // 从问题分数映射中加载标签分数
    allTags.forEach(tag => {
      const savedMap = localStorage.getItem(`questionScores_${tag}`);
      if (savedMap) {
        try {
          const questionScoreMap = JSON.parse(savedMap);
          // 将问题分数映射的值填入数组
          loadedTagScores[tag] = questionScoreMap;
          console.log(`成功加载标签 ${tag} 的问题分数映射:`, questionScoreMap);
        } catch (e) {
          console.error(`解析标签 ${tag} 的问题分数映射出错:`, e);
          loadedTagScores[tag] = {};
        }
      } else {
        // 尝试从旧格式加载
        const savedTagScores = localStorage.getItem('tagScores');
        if (savedTagScores) {
          try {
            const parsedScores = JSON.parse(savedTagScores);
            if (parsedScores[tag]) {
              loadedTagScores[tag] = parsedScores[tag];
            } else {
              loadedTagScores[tag] = {};
            }
          } catch (e) {
            console.error('解析旧格式标签分数出错:', e);
            loadedTagScores[tag] = {};
          }
        }
      }
    });
    
    // 设置加载的标签分数
    if (Object.keys(loadedTagScores).length > 0) {
      setTagScores(loadedTagScores);
      console.log('成功加载所有标签分数:', loadedTagScores);
      
      // 如果有标签分数但没有统计数据，重新计算一次
      if (!localStorage.getItem('tagStats')) {
        calculateAndSaveTagStats(loadedTagScores);
      }
    }
  }, []);

  // 计算每个标签的总分和平均分
  const calculateTagResults = () => {
    const results: Record<string, {total: number, average: number, count: number}> = {};
    
    if (tagScores) {
      Object.entries(tagScores).forEach(([tag, scores]) => {
        // 过滤掉0分(未计分的多选题)
        const validScores = Object.values(scores).filter(score => score > 0);
        const total = validScores.reduce((sum, score) => sum + score, 0);
        const count = validScores.length;
        const average = count > 0 ? total / count : 0;
        
        results[tag] = {
          total,
          average,
          count
        };
      });
    }
    
    return results;
  };

  // 导出结果的函数，可以在需要导出用户结果时调用
  const exportResults = () => {
    const tagResults = calculateTagResults();
    const allAnswers = {
      primary: primaryAnswers,
      secondary: secondaryAnswers
    };
    
    // 在这里你可以加入导出逻辑，例如发送到服务器或下载为文件
    console.log('Tag Results:', tagResults);
    console.log('All Answers:', allAnswers);
    
    // 示例：将结果转换为JSON并下载
    const resultsBlob = new Blob(
      [JSON.stringify({ tagResults, allAnswers }, null, 2)], 
      { type: 'application/json' }
    );
    
    const url = URL.createObjectURL(resultsBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personality_test_results_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderPrivacyStatement = () => {
    const currentQuestionnaire = getCurrentQuestionnaire();
    
    if (!currentQuestionnaire) {
      return null;
    }
    
    // 根据问卷类型添加相应的CSS类
    const privacyClass = currentQuestionnaire.type === 'other' ? 'other-privacy' : 'mother-privacy';
    
    // 添加换行的隐私文本 - 英文版本
    const privacyTextEn = "Your information will only be used for verification purposes and to formulate your CHON personality test.\n\n" +
      "It will not be shared, disclosed, or used for any other purpose.\n\n" +
      "We are committed to protecting your privacy and ensuring the security of your data.";
    
    // 中文版本的隐私文本 - 优化中文段落结构
    const privacyTextZh = "您的信息将仅用于验证目的和制定您的 CHON 性格测试。\n\n" +
      "您的信息不会被共享、披露或用于任何其他目的。\n\n" +
      "我们重视您的隐私，并承诺保护您的数据安全。";
    
    return (
      <div className={`privacy-statement ${privacyClass}`} lang={language} style={{ overflowX: 'hidden', maxWidth: '100%' }}>
        <p className="privacy-text" lang={language} style={{ whiteSpace: 'pre-line' }}>
          {language === 'en' 
            ? currentQuestionnaire.privacyStatement?.contentEn || privacyTextEn
            : currentQuestionnaire.privacyStatement?.contentZh || privacyTextZh
          }
        </p>
        <button 
          className="privacy-continue"
          onClick={handlePrivacyContinue}
          lang={language}
        >
          <span>{language === 'en' ? 'CONTINUE' : '继续'}</span>
          <span className="continue-arrow">→</span>
        </button>
      </div>
    );
  };

  // Render content based on step
  const renderContent = () => {
    switch (step) {
      case 'intro':
        return renderIntroContent();
      case 'identity':
        return renderIdentitySelection();
      case 'corporate_role':
        return renderCorporateRoleSelection();
      case 'privacy':
        return renderPrivacyStatement();
      case 'questionnaire':
        return renderQuestionnaireContent();
      default:
        return null;
    }
  };

  return (
    <main className={containerClass} lang={language}>
      <MetaTags />
      
      {showSaveIndicator && (
        <div className="save-indicator">
          {language === 'en' ? 'Progress saved' : '进度已保存'}
        </div>
      )}
      
      {/* 只为非母亲问卷页面显示背景 */}
      {step !== 'privacy' && step !== 'questionnaire' && (
        <>
          <div className="molecule-background"></div>
          <div className="hexagon-pattern"></div>
        </>
      )}
      
      {/* Show exit button at the top left corner for questionnaire and privacy screens */}
      {(step === 'privacy' || step === 'questionnaire') && exitButton}
      
      {renderContent()}
      
      {/* Only show LanguageSelector when not in questionnaire or privacy screens */}
      {step !== 'privacy' && step !== 'questionnaire' && <LanguageSelector />}
    </main>
  );
};

export default PersonalityTest; 