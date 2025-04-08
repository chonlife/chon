/**
 * 滚动到下一个问题元素
 * @param currentQuestionId 当前问题的ID
 */
export const scrollToNextQuestion = (currentQuestionId: number): void => {
  // 计算下一个问题的ID
  const nextQuestionId = currentQuestionId + 1;
  
  // 尝试获取下一个问题元素
  let nextQuestionElement = document.getElementById(`question-${nextQuestionId}`);
  
  // 如果找不到下一个ID的问题，尝试查找页面上可见的后续问题
  if (!nextQuestionElement) {
    const questions = document.querySelectorAll('[id^="question-"]');
    const questionIds = Array.from(questions).map(el => {
      const id = el.id.replace('question-', '');
      return parseInt(id);
    });
    
    // 找到比当前ID大的最小ID
    const nextIds = questionIds.filter(id => id > currentQuestionId).sort((a, b) => a - b);
    if (nextIds.length > 0) {
      nextQuestionElement = document.getElementById(`question-${nextIds[0]}`);
    }
  }
  
  // 如果找到下一个问题元素，滚动到该元素
  if (nextQuestionElement) {
    // 使用一个小延迟确保DOM已更新
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