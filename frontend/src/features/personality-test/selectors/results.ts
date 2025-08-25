import { StoredAnswer } from "../types/question";
import { TagStats } from "../types/answer";

// Calculate final statistics for each tag
export const calculateTagResults = (answers: Record<number, StoredAnswer>) => {
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


// 导出结果的函数，可以在需要导出用户结果时调用
export const exportResults = (answers: Record<number, StoredAnswer>) => {
    const tagResults = calculateTagResults(answers);
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

// 获取标签统计数据
export const getTagStats = (): Record<string, any> => {
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