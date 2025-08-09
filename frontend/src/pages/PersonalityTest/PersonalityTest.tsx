import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector.tsx';
import './PersonalityTest.css';
import { scrollToNextQuestion, scrollToFirstQuestionOfNextPage, scrollToQuestion } from './ScrollUtils.ts';
import questionnaireApi from '../../api/questionnaire.ts';
import { Question, QuestionSection, QuestionnaireType, questionsMenu, QuestionMenu } from './questionnaires.ts';
import IdentitySelection, { IdentityType, CorporateRole } from './IdentitySelection.tsx';
import QuestionsSection from './QuestionsSection.tsx';
import Results from '../Results/Results.tsx';
import AccountSignup from '../Signup/AccountSignup.tsx';
import IntroSection from './IntroSection.tsx';
import PrivacyStatement from './PrivacyStatement.tsx';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

type TestStep = 'intro' | 'identity' | 'privacy' | 'questionnaire' | 'results' | 'account';

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

// Add interface for stored answer
export interface StoredAnswer {
  value: string | string[];
  tags?: string[];
}

const PersonalityTest = ({ onWhiteThemeChange, onHideUIChange }: PersonalityTestProps) => {
  const { t, language } = useLanguage();
  const location = useLocation();
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
  // Remove loading from state
  const [introStats, setIntroStats] = useState({
    yesCount: 0,
    noCount: 0,
    yesPercentage: 65
  });

  const [selectedRole, setSelectedRole] = useState<CorporateRole | null>(null);
  const initializedSectionRef = useRef<boolean>(false);
  const hasMountedAnswersRef = useRef<boolean>(false);
  const hasMountedSectionRef = useRef<boolean>(false);

  // Add interface definition
  interface TagStats {
    userScore: number;
    totalPossibleScore: number;
    scorePercentage: number;
    averageScore: number;
    answeredQuestions: number;
  }

  // Helpers: sections and progress
  const getMenuByIdentity = (identity: QuestionnaireType): QuestionMenu | null => {
    return questionsMenu.find(m => m.identity === identity) || null;
  };

  const getSectionByIndex = (
    identity: QuestionnaireType,
    index: number
  ): QuestionSection | null => {
    const menu = getMenuByIdentity(identity);
    if (!menu) return null;
    return menu.sections[index] ?? null;
  };

  const isQuestionAnswered = (
    questionId: number,
    storedAnswers: Record<number, StoredAnswer>
  ): boolean => {
    return storedAnswers[questionId] !== undefined;
  };

  const findFirstIncompleteSection = (
    identity: QuestionnaireType,
    storedAnswers: Record<number, StoredAnswer>
  ): number => {
    const menu = getMenuByIdentity(identity);
    console.log("menu", menu);
    if (!menu) return 0;
    for (let i = 0; i < menu.sections.length; i += 1) {
      const sec = menu.sections[i];
      const allAnswered = sec.questions.every(qid => isQuestionAnswered(qid, storedAnswers));
      if (!allAnswered) return i;
    }
    // If everything answered, point to last section
    return Math.max(0, menu.sections.length - 1);
  };

  const findFirstUnansweredQuestionInSection = (
    section: QuestionSection,
    storedAnswers: Record<number, StoredAnswer>
  ): number | null => {
    const target = section.questions.find(qid => !isQuestionAnswered(qid, storedAnswers));
    return target ?? null;
  };

  const renderQuestionsSection = (identity: QuestionnaireType, currentSection: number) => {
    const menu = questionsMenu.find(menu => menu.identity === identity) || null;
    if (!menu) {
      return null;
    }
    const progress = calculatedQuestionnaireProgress(menu);
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

  const handleNextQuestionSection = () => {
    setCurrentSection(currentSection + 1);
  }

  const handleBackQuestionSection = () => {
    setCurrentSection(currentSection - 1);
  }
  
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
  
  // 验证步骤值是否有效
  const isValidStep = (step: string): boolean => {
    return ['intro', 'identity', 'privacy', 'questionnaire', 'results', 'account'].includes(step);
  };
  
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
  }, [step, onWhiteThemeChange, onHideUIChange]);

  // 添加获取intro统计数据的函数
  const fetchIntroStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/intro-stats`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update UI with the stats
      setIntroStats({
        yesCount: data.yes_count,
        noCount: data.no_count,
        yesPercentage: data.yes_percentage
      });
      
    } catch (error) {
      // Keep current stats on error
    }
  };

  // 在用户选择yes/no后获取最新统计数据
  useEffect(() => {
    if (userIntroChoice) {
      // 稍微延迟，让后端有时间更新数据
      const timer = setTimeout(() => {
        fetchIntroStats();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [userIntroChoice]);

  // 在组件挂载或step变为'intro'时进行初始化
  useEffect(() => {
    if (step === 'intro') {
      // 重置userIntroChoice，确保用户每次回到intro页面时都会看到选项
      setUserIntroChoice(null);
      
      // 同时预加载统计数据，但不会影响UI显示
      fetchIntroStats();
    }
  }, [step]);

  const handleOptionClick = (choice: string) => {
    setUserIntroChoice(choice);
    
    // Save intro choice with user ID
    questionnaireApi.saveIntroChoice(choice)
      .catch(error => {
        console.error('Error saving intro choice:', error);
      });
  };
  
  const handleBeginTest = () => {
    setStep('identity');
  };

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

  const handleRoleSelect = (role: CorporateRole | null) => {
    setSelectedRole(role);
  };

  const handleIdentityContinue = () => {
    // Only allow continue if a role is selected when corporate is selected
    const isCorporate = selectedIdentity === 'corporate' || selectedIdentity === 'both';
    if (!selectedIdentity || (isCorporate && !selectedRole)) {
      return;
    }
    setStep('privacy');
  };

  // Helpers for handling multiple choice answers
  const getOptionById = (question: Question, optionId: string) => {
    const qAny: any = question as any;
    return qAny.options?.find((o: any) => o.id === optionId);
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

  const computeNextAnswersForMultipleChoice = (
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

  // 完成问卷并跳转到结果页面的函数
  const finishQuestionnaire = () => {
    // Calculate final results
    calculateTagResults();
    
    if (selectedIdentity) {
      // Save all responses at once with the new format
      questionnaireApi.saveAllQuestionResponses(answers, selectedIdentity, selectedRole)
        .then(() => {
          setStep('results');
        })
        .catch((error) => {
          setStep('results');
        });
    }
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

  const getTotalQuestions = (menu: QuestionMenu): number => {
    return menu.sections.reduce((acc, section) => acc + section.questions.length, 0);
  };
  
    // 计算问卷进度
  const calculatedQuestionnaireProgress = (menu: QuestionMenu) => {
    // For "both" option, calculate progress based on active questionnaire
    const answeredCount = Object.keys(answers).length;
    const total = getTotalQuestions(menu);
    return total > 0 ? (answeredCount / total) * 100 : 0;
  };

  // Add check for in-progress questionnaire
  const hasInProgressQuestionnaire = (): boolean => {
    const savedStep = localStorage.getItem('chon_personality_step');
    return savedStep !== null && savedStep !== 'intro' && isValidStep(savedStep as TestStep);
  };

  // Add check for completed questionnaire
  const hasCompletedQuestionnaire = (): boolean => {
    const savedStep = localStorage.getItem('chon_personality_step');
    return savedStep === 'results';
  };

  // Add function to clear all test data
  const clearTestData = () => {
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
    setStep('identity');
  };

  // Continue test from saved progress
  const continueTest = () => {
    const savedStep = localStorage.getItem('chon_personality_step');
    if (savedStep && savedStep !== 'intro' && isValidStep(savedStep)) {
      const nextStep = savedStep as TestStep;
      setStep(nextStep);
      if (nextStep === 'questionnaire') {
        // 恢复或计算 section（滚动逻辑由 effect 处理）
        const savedSectionStr = localStorage.getItem('chon_personality_section');
        const savedSection = savedSectionStr ? parseInt(savedSectionStr, 10) : NaN;
        if (!Number.isNaN(savedSection)) {
          setCurrentSection(savedSection);
        } else if (selectedIdentity) {
          const firstIncomplete = findFirstIncompleteSection(selectedIdentity, answers);
          setCurrentSection(firstIncomplete);
        }
      }
    } else {
      setStep('identity');
    }
  };

  // Calculate final statistics for each tag
  const calculateTagResults = () => {
    const tagStats: Record<string, TagStats> = {};
    const allTags = ['自我意识', '奉献精神', '社交情商', '情绪调节', '客观能力', '核心耐力'];
    
    // Initialize stats for each tag
    allTags.forEach(tag => {
      tagStats[tag] = {
        userScore: 0,
        totalPossibleScore: 0,
        scorePercentage: 0,
        averageScore: 0,
        answeredQuestions: 0
      };
    });

    // Calculate stats using stored answers
    Object.entries(answers).forEach(([questionId, answer]) => {
      // Resolve tags considering gender-specific fields if available
      const qid = Number(questionId);
      // We don't have direct access to question meta here; tags are saved on answer for scale questions only.
      // Extend: if answer.tags exists, optionally override with gender-specific tags stored in a hidden convention
      // For current code path, inject gender-specific tags at save time in handleScaleAnswer below.
      if (answer.tags) {
        let score: number;
        const valueStr = Array.isArray(answer.value) ? '' : (answer.value as string);
        if (['A', 'B', 'C', 'D', 'E'].includes(valueStr)) {
          const scoreMap: Record<string, number> = {'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5};
          score = scoreMap[valueStr] || 0;
        } else {
          score = parseInt(valueStr, 10) || 0;
        }

        if (score > 0) {
          answer.tags.forEach(tag => {
            if (tagStats[tag]) {
              tagStats[tag].userScore += score;
              tagStats[tag].totalPossibleScore += 5; // Max score is 5
              tagStats[tag].answeredQuestions += 1;
            }
          });
        }
      }
    });

    // Calculate percentages and averages
    allTags.forEach(tag => {
      const stats = tagStats[tag];
      stats.scorePercentage = stats.totalPossibleScore > 0 
        ? Math.min(100, Number(((stats.userScore / stats.totalPossibleScore) * 100).toFixed(2))) 
        : 0;
      stats.averageScore = stats.answeredQuestions > 0 
        ? Number((stats.userScore / stats.answeredQuestions).toFixed(2)) 
        : 0;
    });

    // Save the final stats
    localStorage.setItem('tagStats', JSON.stringify(tagStats));
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



  // 导出结果的函数，可以在需要导出用户结果时调用
  const exportResults = () => {
    const tagResults = calculateTagResults();
    const allAnswers = answers;
    
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

  // Render content based on step
  const renderContent = () => {
    switch (step) {
      case 'intro':
        return (
          <IntroSection 
            userIntroChoice={userIntroChoice}
            introStats={introStats}
            hasCompletedQuestionnaire={hasCompletedQuestionnaire}
            hasInProgressQuestionnaire={hasInProgressQuestionnaire}
            onOptionClick={handleOptionClick}
            onBeginTest={handleBeginTest}
            onContinueTest={continueTest}
            onClearTestData={clearTestData}
            onSetResultsStep={() => setStep('results')}
          />
        );
      case 'identity':
        return (
          <IdentitySelection
            selectedIdentity={selectedIdentity}
            selectedRole={selectedRole}
            onIdentitySelect={handleIdentitySelect}
            onRoleSelect={handleRoleSelect}
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
        return <Results onCreateAccount={() => setStep('account')} />;
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

  return (
    <>
      {step === 'results' ? (
        <Results onCreateAccount={() => setStep('account')} />
      ) : (
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
      )}
    </>
  );
};

export default PersonalityTest; 