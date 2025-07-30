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
        block: 'center'
      });
    }, 50);
  }
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
          block: 'center'
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
          block: 'center'
        });
      }
    }
  }, 500); // 500ms延迟，确保页面已切换
}; 