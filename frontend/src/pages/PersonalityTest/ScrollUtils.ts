/**
 * 滚动到下一个问题元素
 * @param currentQuestionId 当前问题的ID
 */
export const scrollToNextQuestion = (currentQuestionId: number): void => {
  // Get all question elements currently in the DOM
  const questions = document.querySelectorAll('[id^="question-"]');
  const questionElements = Array.from(questions);
  
  // Find the current question's index in the DOM order
  const currentIndex = questionElements.findIndex(
    el => el.id === `question-${currentQuestionId}`
  );
  
  // If found and not the last question, get the next element
  if (currentIndex !== -1 && currentIndex < questionElements.length - 1) {
    const nextQuestionElement = questionElements[currentIndex + 1];
    
    // Scroll to the next question with a small delay to ensure DOM updates
    setTimeout(() => {
      nextQuestionElement?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }, 50);
  } else if (currentIndex !== -1 && currentIndex === questionElements.length - 1) {
    // This is the last question in the section, scroll to continue button if not visible
    scrollToContinueButtonIfNeeded();
  }
};

/**
 * 检查Continue或Finish按钮是否在视口中可见
 */
const isContinueButtonVisible = (): boolean => {
  // Look for either the next button (Continue) or finish button
  const continueButton = document.querySelector('.question-navigation .next-button, .question-navigation .finish-button');
  if (!continueButton) return false;
  
  const rect = continueButton.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  return rect.top >= 0 && rect.bottom <= windowHeight;
};

/**
 * 如果Continue或Finish按钮不可见，则滚动到它
 */
export const scrollToContinueButtonIfNeeded = (): void => {
  setTimeout(() => {
    if (!isContinueButtonVisible()) {
      // Look for either the next button (Continue) or finish button
      const continueButton = document.querySelector('.question-navigation .next-button, .question-navigation .finish-button');
      if (continueButton) {
        continueButton.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
      }
    }
  }, 100);
};

/**
 * 滚动到页面顶部
 */
export const scrollToPageTop = (): void => {
  window.scrollTo({ 
    top: 0, 
    behavior: 'smooth' 
  });
};

/**
 * 滚动到下一页的第一个问题
 * 先滚动到页面顶部，然后在短暂延迟后滚动到第一个问题
 */
export const scrollToFirstQuestionOfNextPage = (): void => {
  // 先滚动到页面顶部
  scrollToPageTop();
  
  // 延迟后尝试查找并滚动到页面上的第一个问题
  setTimeout(() => {
    // 查找页面上可见的第一个问题元素
    const questions = document.querySelectorAll('[id^="question-"]');
    if (questions.length > 0) {
      // 尝试获取当前页面上的第一个问题
      const firstQuestion = questions[0];
      if (firstQuestion) {
        firstQuestion.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
        return;
      }
      
      // 备选方案：找到视口内的第一个问题
      const firstVisibleQuestion = Array.from(questions).find(elem => {
        const rect = elem.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });
      
      if (firstVisibleQuestion) {
        firstVisibleQuestion.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    }
  }, 500); // 500ms延迟，确保页面已切换
};

/**
 * 滚动到下一个section的开始位置
 * 直接平滑滚动到section容器，让用户看到section标题
 */
export const scrollToSectionStart = (): void => {
  // 延迟后直接滚动到当前section容器，避免双重滚动造成的停顿
  setTimeout(() => {
    // 查找页面上的section容器
    const sectionContainer = document.querySelector('[id^="section-"]');
    if (sectionContainer) {
      // 直接滚动到section开始位置，单次平滑动画
      sectionContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, 200); // 较短延迟，确保DOM已更新但避免长时间等待
}; 

/**
 * 滚动到指定问题元素
 * @param questionId 目标问题的ID
 */
export const scrollToQuestion = (questionId: number): void => {
  // 使用小延迟确保DOM渲染完成
  setTimeout(() => {
    const el = document.getElementById(`question-${questionId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
};