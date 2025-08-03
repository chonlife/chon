import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector.tsx';
import './PersonalityTest.css';
import { scrollToNextQuestion, scrollToFirstQuestionOfNextPage } from './ScrollUtils.ts';
import questionnaireApi from '../../api/questionnaire.ts';
import { Question, QuestionSection, QuestionnaireType, questionsMenu, QuestionMenu, questions } from './questionnaires.ts';
import IdentitySelection, { IdentityType } from './IdentitySelection.tsx';
import QuestionsSection from './QuestionsSection.tsx';
import Results from '../Results/Results.tsx';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

type TestStep = 'intro' | 'identity' | 'privacy' | 'questionnaire' | 'results';

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
  value: string;
  tags?: string[];
}

const PersonalityTest = ({ onWhiteThemeChange, onHideUIChange }: PersonalityTestProps) => {
  const { t, language } = useLanguage();
  const location = useLocation();
  // Always start at intro
  const [step, setStep] = useState<TestStep>('intro');
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [selectedIdentity, setSelectedIdentity] = useState<QuestionnaireType | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [workedInCoporate, setWorkedInCoporate] = useState<boolean>(false);
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
  
  // 从本地存储加载答案数据
  useEffect(() => {
    const savedAnswers = localStorage.getItem('chon_personality_answers');
    const savedStep = localStorage.getItem('chon_personality_step');
    const savedIdentity = localStorage.getItem('chon_personality_identity');
    const savedUserChoice = localStorage.getItem('chon_personality_user_choice');
    
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
    
    // Only set non-intro steps from storage
    if (savedStep && savedStep !== 'intro' && isValidStep(savedStep)) {
      setStep(savedStep as TestStep);
    } else {
      setStep('intro'); // Explicitly set to intro if no valid saved step
    }
    
    if (savedIdentity) {
      setSelectedIdentity(JSON.parse(savedIdentity) as QuestionnaireType);
    }
    
    if (savedUserChoice) {
      setUserChoice(savedUserChoice);
    }
  }, []);
  
  // 验证步骤值是否有效
  const isValidStep = (step: string): boolean => {
    return ['intro', 'identity', 'privacy', 'questionnaire', 'results'].includes(step);
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
  
  // Save step to localStorage, but never save 'intro'
  useEffect(() => {
    if (step !== 'intro') {
      localStorage.setItem('chon_personality_step', step);
    }
  }, [step]);
  
  // Load saved answers and other data
  useEffect(() => {
    const savedAnswers = localStorage.getItem('chon_personality_answers');
    const savedIdentity = localStorage.getItem('chon_personality_identity');
    const savedUserChoice = localStorage.getItem('chon_personality_user_choice');
    
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
    
    // Always start at intro
    setStep('intro');
    
    if (savedIdentity) {
      setSelectedIdentity(JSON.parse(savedIdentity) as QuestionnaireType);
    }
    
    if (savedUserChoice) {
      setUserChoice(savedUserChoice);
    }
  }, []);
  
  // 保存身份选择到本地存储
  useEffect(() => {
    if (selectedIdentity) {
      localStorage.setItem('chon_personality_identity', JSON.stringify(selectedIdentity));
    }
  }, [selectedIdentity]);
  
  // 保存用户选择到本地存储
  useEffect(() => {
    if (userChoice) {
      localStorage.setItem('chon_personality_user_choice', userChoice);
    }
  }, [userChoice]);

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
      // If other is selected, clear any previous selection
      setSelectedIdentity(selectedIdentity === 'other' ? null : 'other');
    } else if (identity === 'mother' || identity === 'corporate') {
      if (selectedIdentity === 'both') {
        // If both is selected, clicking one should keep the other selected
        setSelectedIdentity(identity === 'mother' ? 'corporate' : 'mother');
      } else if (selectedIdentity === identity) {
        // Unselect if clicking the same option
        setSelectedIdentity(null);
      } else if ((selectedIdentity === 'mother' && identity === 'corporate') || 
                 (selectedIdentity === 'corporate' && identity === 'mother')) {
        // If selecting the other option when one is already selected, set to both
        setSelectedIdentity('both');
      } else {
        // Select the new option
        setSelectedIdentity(identity);
      }
    }
  };

  const handleIdentityContinue = () => {
    if (!selectedIdentity) {
      return;
    }
    setStep('privacy');
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
    setAnswers({
      ...currentAnswers,
      [question.id]: {
        value: optionId
      }
    });
    
    // Add branching logic for specific question (e.g., question 6)
    if (question.id === 6) {
      setHasBranchingQuestion(true);
      if (optionId === 'A') { // Yes
        setBranchingPath('yes-path');
      } else if (optionId === 'B') { // No
        setBranchingPath('no-path');
      }
    }
    
    // Add new feature: auto-scroll to next question
    setTimeout(() => {
      scrollToNextQuestion(question.id);
    }, 100);
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
    setAnswers({
      ...currentAnswers,
      [question.id]: {
        value,
        tags: question.tags
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
      questionnaireApi.saveAllQuestionResponses(answers, selectedIdentity)
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
    localStorage.removeItem('chon_personality_user_choice');
    localStorage.removeItem('tagStats');
    
    // Reset all state and go directly to identity
    setAnswers({});
    setSelectedIdentity(null);
    setUserChoice(null);
    setCurrentSection(0);
    setStep('identity');
  };

  // Continue test from saved progress
  const continueTest = () => {
    const savedStep = localStorage.getItem('chon_personality_step');
    if (savedStep && savedStep !== 'intro' && isValidStep(savedStep)) {
      setStep(savedStep as TestStep);
    } else {
      setStep('identity');
    }
  };

  // Modify renderIntroContent to add debug logging
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
            </div>
            
            <div className="test-buttons">
              {hasCompletedQuestionnaire() ? (
                <>
                  <button 
                    className="begin-test-button" 
                    onClick={() => setStep('results')}
                    lang={language}
                  >
                    {t.intro.viewResult}
                  </button>
                  <button 
                    className="restart-test-button" 
                    onClick={clearTestData}
                    lang={language}
                  >
                    {t.intro.restartTest}
                  </button>
                </>
              ) : hasInProgressQuestionnaire() ? (
                <>
                  <button 
                    className="begin-test-button" 
                    onClick={continueTest}
                    lang={language}
                  >
                    {t.intro.continueTest}
                  </button>
                  <button 
                    className="restart-test-button" 
                    onClick={clearTestData}
                    lang={language}
                  >
                    {t.intro.restartTest}
                  </button>
                </>
              ) : (
                <button 
                  className="begin-test-button" 
                  onClick={handleBeginTest}
                  lang={language}
                >
                  {t.intro.beginTest}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  // Render the identity selection UI
  const renderIdentitySelection = () => {
    return (
      <IdentitySelection
        selectedIdentity={selectedIdentity}
        onIdentitySelect={handleIdentitySelect}
        onContinue={handleIdentityContinue}
      />
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
      if (answer.tags) {
        let score: number;
        if (['A', 'B', 'C', 'D', 'E'].includes(answer.value)) {
          const scoreMap: Record<string, number> = {'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5};
          score = scoreMap[answer.value] || 0;
        } else {
          score = parseInt(answer.value, 10) || 0;
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

  const renderPrivacyStatement = () => {
    
    // 添加换行的隐私文本 - 英文版本
    const privacyTextEn = "Your information will only be used for verification purposes and to formulate your CHON personality test.\n\n" +
      "It will not be shared, disclosed, or used for any other purpose.\n\n" +
      "We are committed to protecting your privacy and ensuring the security of your data.";
    
    // 中文版本的隐私文本 - 优化中文段落结构
    const privacyTextZh = "您的信息将仅用于验证目的和制定您的 CHON 性格测试。\n\n" +
      "您的信息不会被共享、披露或用于任何其他目的。\n\n" +
      "我们重视您的隐私，并承诺保护您的数据安全。";
    
    // Add class based on selectedIdentity
    const privacyClass = selectedIdentity === 'mother' ? 'mother-privacy' : 'other-privacy';
    
    return (
      <div className={`privacy-statement ${privacyClass}`} lang={language} style={{ overflowX: 'hidden', maxWidth: '100%' }}>
        <p className="privacy-text" lang={language} style={{ whiteSpace: 'pre-line' }}>
          {language === 'en' 
            ? privacyTextEn
            : privacyTextZh
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
      case 'privacy':
        return renderPrivacyStatement();
      case 'questionnaire':
        if (selectedIdentity) {
          return renderQuestionsSection(selectedIdentity, currentSection);
        }
        return null;
      case 'results':
        return <Results />;
      default:
        return null;
    }
  };

  return (
    <>
      {step === 'results' ? (
        <Results />
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