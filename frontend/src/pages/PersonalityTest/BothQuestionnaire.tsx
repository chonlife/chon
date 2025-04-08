import React from 'react';

// 不使用严格的类型检查，改用更宽松的类型以适应所有问题类型
interface QuestionBase {
  id: number;
  type: string;
  textEn: string;
  textZh: string;
  options?: { id: string; textEn: string; textZh: string; }[];
  scaleLabels?: { 
    minEn: string;
    minZh: string;
    maxEn: string;
    maxZh: string;
  };
  tags?: string[];
}

// Define option type to fix 'any' type issues
interface OptionType {
  id: string;
  textEn: string;
  textZh: string;
}

interface BothQuestionnaireProps {
  language: string;
  getCurrentAnswers: () => Record<number, string>;
  handleMultipleChoiceAnswer: (questionId: number, optionId: string) => void;
  handleTextAnswer: (questionId: number, text: string) => void;
  handleScaleAnswer: (questionId: number, value: string) => void;
  showFirstPage: boolean;
  showSecondPage: boolean;
  showThirdPage: boolean;
  showFourthPage: boolean;
  showFifthPage: boolean;
  showSixthPage: boolean;
  setShowFirstPage: (value: boolean) => void;
  setShowSecondPage: (value: boolean) => void;
  setShowThirdPage: (value: boolean) => void;
  setShowFourthPage: (value: boolean) => void;
  setShowFifthPage: (value: boolean) => void;
  setShowSixthPage: (value: boolean) => void;
  scrollToFirstQuestionOfNextPage: () => void;
  calculatedQuestionnaireProgress: () => number;
  finishQuestionnaire: () => void;
}

const BothQuestionnaire: React.FC<BothQuestionnaireProps> = ({
  language,
  getCurrentAnswers,
  handleMultipleChoiceAnswer,
  handleTextAnswer,
  handleScaleAnswer,
  showFirstPage,
  showSecondPage,
  showThirdPage,
  showFourthPage,
  showFifthPage,
  showSixthPage,
  setShowFirstPage,
  setShowSecondPage,
  setShowThirdPage,
  setShowFourthPage,
  setShowFifthPage,
  setShowSixthPage,
  scrollToFirstQuestionOfNextPage,
  calculatedQuestionnaireProgress,
  finishQuestionnaire
}) => {
  // Helper function to render question text
  const renderQuestionText = (question: any) => {
    return (
      <h2 className="question-text">
        {language === 'en' ? question.textEn : question.textZh}
      </h2>
    );
  };

  // Questions for Page 1 (Corporate background)
  const page1Questions: any[] = [
    {
      id: 1,
      type: 'multiple-choice',
      textEn: 'What is your current / most recent job position?',
      textZh: '您目前的职位名称是什么？',
      options: [
        { id: 'A', textEn: 'Senior Manager', textZh: '高级经理' },
        { id: 'B', textEn: 'Director', textZh: '总监' },
        { id: 'C', textEn: 'Vice President', textZh: '副总裁' },
        { id: 'D', textEn: 'Managing Director', textZh: '董事总经理' },
        { id: 'E', textEn: 'Partner', textZh: '合伙人' },
        { id: 'F', textEn: 'President', textZh: '总裁' },
        { id: 'G', textEn: 'C-suite Executives (CEO, CFO, COO, etc)', textZh: 'C级高管 (CEO, CFO, COO等)' },
        { id: 'H', textEn: 'Board of Directors', textZh: '董事会成员' }
      ]
    },
    {
      id: 2,
      type: 'text-input',
      textEn: 'What is your professional contact (e.g., email, LinkedIn)?',
      textZh: '请问您的职业联系方式是什么（例如：邮箱、领英）？',
    },
    {
      id: 3,
      type: 'multiple-choice',
      textEn: 'Which industry or business sector does your company operate in?',
      textZh: '贵公司属于哪个行业或业务领域？',
      options: [
        { id: 'A', textEn: 'Consumer Goods & Retail', textZh: '消费品和零售' },
        { id: 'B', textEn: 'Education & Business Professional Services', textZh: '教育和商业专业服务' },
        { id: 'C', textEn: 'Energy & Utilities', textZh: '能源和公用事业' },
        { id: 'D', textEn: 'Entertainment & Media', textZh: '娱乐和媒体' },
        { id: 'E', textEn: 'Financial Services', textZh: '金融服务' },
        { id: 'F', textEn: 'Government, Nonprofits & Public Services', textZh: '政府、非营利和公共服务' },
        { id: 'G', textEn: 'Healthcare & Pharmaceuticals', textZh: '医疗保健和制药' },
        { id: 'H', textEn: 'Industrial Production & Manufacturing', textZh: '工业生产和制造' },
        { id: 'I', textEn: 'Real Estate & Construction', textZh: '房地产和建筑' },
        { id: 'J', textEn: 'Technology & Telecommunications', textZh: '技术和电信' },
        { id: 'K', textEn: 'Transportation & Logistics', textZh: '运输和物流' }
      ]
    },
    {
      id: 4,
      type: 'multiple-choice',
      textEn: 'How many years of experience do you have in a managerial or leadership role?',
      textZh: '您在管理或领导岗位上有多少年的工作经验？',
      options: [
        { id: 'A', textEn: '1-3 years', textZh: '1-3年' },
        { id: 'B', textEn: '4-6 years', textZh: '4-6年' },
        { id: 'C', textEn: '7-9 years', textZh: '7-9年' },
        { id: 'D', textEn: '10+ years', textZh: '10年以上' }
      ]
    },
    {
      id: 5,
      type: 'text-input',
      textEn: 'What is the approximate size of your direct span of control?',
      textZh: '您的直接管理团队规模是多少？',
    },
    {
      id: 6,
      type: 'text-input',
      textEn: 'What is the approximate size of your indirect span of control?',
      textZh: '您间接管理多少人？',
    },
    {
      id: 7,
      type: 'text-input',
      textEn: 'How would you describe the overall reporting structure look like within your team in ten words?',
      textZh: '请在十字以内描述您团队中的整体报告结构',
    }
  ];

  // Questions for Page 2 (Mother background)
  const page2Questions: any[] = [
    {
      id: 8,
      type: 'multiple-choice',
      textEn: 'How many children do you have or are expecting to have?',
      textZh: '您有或预计有多少个孩子？',
      options: [
        { id: 'A', textEn: '1', textZh: '1 个' },
        { id: 'B', textEn: '2', textZh: '2 个' },
        { id: 'C', textEn: '3', textZh: '3 个' },
        { id: 'D', textEn: '4 or more', textZh: '4 个或更多' },
      ]
    },
    {
      id: 9,
      type: 'text-input',
      textEn: 'Which hospital did you use for prenatal care services?',
      textZh: '您在哪家医院进行了产检服务？',
    },
    {
      id: 10,
      type: 'multiple-choice',
      textEn: 'How many trimesters did you experience noticeable morning sickness?',
      textZh: '您经历了几个妊娠期有明显的孕吐反应？',
      options: [
        { id: 'A', textEn: 'None', textZh: '无' },
        { id: 'B', textEn: '1 trimester', textZh: '1个妊娠期' },
        { id: 'C', textEn: '2 trimesters', textZh: '2个妊娠期' },
        { id: 'D', textEn: 'Entire pregnancy', textZh: '整个孕期' },
      ]
    },
    {
      id: 11,
      type: 'text-input',
      textEn: 'What was your youngest child\'s birth weight?',
      textZh: '您第一胎宝宝的出生体重是多少？',
    },
    {
      id: 12,
      type: 'multiple-choice',
      textEn: 'How long was your maternity leave?',
      textZh: '您的产假有多长时间？',
      options: [
        { id: 'A', textEn: 'Less than 1 month', textZh: '少于 1 个月' },
        { id: 'B', textEn: '1-3 months', textZh: '1-3 个月' },
        { id: 'C', textEn: '3-6 months', textZh: '3-6 个月' },
        { id: 'D', textEn: 'More than 6 months', textZh: '6 个月以上' },
      ]
    },
    {
      id: 13,
      type: 'multiple-choice',
      textEn: 'Did you receive postpartum care or stay at a postpartum center?',
      textZh: '您是否接受了产后护理或入住了月子中心？',
      options: [
        { id: 'A', textEn: 'Yes', textZh: '是' },
        { id: 'B', textEn: 'No', textZh: '否' },
      ]
    },
    {
      id: 14,
      type: 'text-input',
      textEn: 'How would you describe your postpartum emotions in ten words?',
      textZh: '您能用十个词形容您的产后状态吗？',
    },
    {
      id: 15,
      type: 'text-input',
      textEn: 'How would you describe your motherhood experience in ten words?',
      textZh: '您能用十个词形容您作为母亲的状态吗？',
    }
  ];

  // Questions for Page 3 (Leadership)
  const page3Questions: any[] = [
    {
      id: 16,
      type: 'scale-question',
      textEn: 'How would you describe the decision-making structure in your organization?',
      textZh: '您如何描述贵公司决策体系的运作方式？',
      scaleLabels: {
        minEn: 'Highly centralized',
        minZh: '高度集中化',
        maxEn: 'Flexibly adaptive',
        maxZh: '灵活变通'
      }
    },
    {
      id: 17,
      type: 'scale-question',
      textEn: 'In your opinion, what should be the primary basis of decision-making authority in your organization?',
      textZh: '在您看来，贵司的决策权应该主要基于什么？',
      scaleLabels: {
        minEn: 'Rigid policies & Top-down command',
        minZh: '严格的政策和自上而下的指挥',
        maxEn: 'Entirely based on individual\'s ability',
        maxZh: '完全基于个人能力'
      },
      tags: ['客观能力']
    },
    {
      id: 18,
      type: 'scale-question',
      textEn: 'How well-organized would you say your team structure is under your leadership?',
      textZh: '您认为在您的领导下，您的团队结构有多有序和高效？',
      scaleLabels: {
        minEn: 'Not organized',
        minZh: '缺乏组织性',
        maxEn: 'Very well-organized',
        maxZh: '组织性非常强'
      },
      tags: ['客观能力', '核心耐力']
    },
    {
      id: 19,
      type: 'scale-question',
      textEn: 'How would you rate your team\'s level of communication and collaboration under your leadership?',
      textZh: '您认为在您的领导下，您的团队的沟通与协作水平如何？',
      scaleLabels: {
        minEn: 'Very poor – Lack communication & efficiency',
        minZh: '非常差 —— 缺乏沟通和效率',
        maxEn: 'Excellent – Great communication & efficiency',
        maxZh: '非常好 —— 极好的沟通和效率'
      },
      tags: ['客观能力', '社交情商']
    },
    {
      id: 20,
      type: 'scale-question',
      textEn: 'How would you rate your experience in communicating and establishing trust with clients or business partners?',
      textZh: '您如何评价自己在与客户或业务伙伴沟通及建立信任方面的经验？',
      scaleLabels: {
        minEn: 'Very poor – significant challenges',
        minZh: '非常差 – 极大挑战',
        maxEn: 'Excellent – effective and trusted',
        maxZh: '非常好 – 有效、可信'
      },
      tags: ['社交情商']
    },
    {
      id: 21,
      type: 'scale-question',
      textEn: 'How effective do you believe your organization is at understanding client or market needs?',
      textZh: '您认为贵司在理解客户或市场需求方面的效果如何？',
      scaleLabels: {
        minEn: 'Very poor – insufficient understanding',
        minZh: '非常差 – 不充分了解',
        maxEn: 'Excellent – exceeds expectations',
        maxZh: '非常好 – 超出预期'
      },
      tags: ['社交情商']
    },
    {
      id: 22,
      type: 'scale-question',
      textEn: 'How important do you think responsibility is in building successful business projects?',
      textZh: '您认为责任感对商业项目的成功有多重要？',
      scaleLabels: {
        minEn: 'Not important at all',
        minZh: '完全不重要',
        maxEn: 'Extremely important',
        maxZh: '极其重要'
      },
      tags: ['客观能力', '奉献精神']
    },
    {
      id: 23,
      type: 'scale-question',
      textEn: 'How important do you think empathy and communication are in building successful business relationships?',
      textZh: '您认为同理心和沟通能力在建立成功的商业关系中有多重要？',
      scaleLabels: {
        minEn: 'Not important at all',
        minZh: '完全不重要',
        maxEn: 'Extremely important',
        maxZh: '极其重要'
      },
      tags: ['奉献精神', '社交情商']
    },
    {
      id: 24,
      type: 'scale-question',
      textEn: 'How would you describe the current recognition and utilization of the "soft skills" of kindness, responsibility, empathy, and communication in your company?',
      textZh: '您如何描述贵司目前对"软实力"（善良、责任心、同理心、沟通能力）的认可和使用情况？',
      scaleLabels: {
        minEn: 'Not recognized at all',
        minZh: '完全不认可',
        maxEn: 'Highly recognized and utilized',
        maxZh: '高度认可和利用'
      },
      tags: ['奉献精神']
    },
    {
      id: 25,
      type: 'scale-question',
      textEn: 'Do you think men and women are equally supported in your industry when it comes to balancing work and family?',
      textZh: '在您的行业中, 您认为男性和女性是否在平衡工作与家庭方面得到了同等支持？',
      scaleLabels: {
        minEn: 'No, one is significantly less supported',
        minZh: '不是，其一得到的很少同等支持',
        maxEn: 'Yes, equally supported',
        maxZh: '是的，两种性别都得到了平等支持'
      },
      tags: ['自我意识']
    },
    {
      id: 26,
      type: 'scale-question',
      textEn: 'In your opinion, how important is it for your organization to provide resources in the form of support and social bonding for working mothers?',
      textZh: '在您看来，公司为职场母亲提供情感支持和社交的资源有多重要？',
      scaleLabels: {
        minEn: 'Not important at all',
        minZh: '完全不重要',
        maxEn: 'Very important',
        maxZh: '非常重要'
      },
      tags: ['奉献精神', '自我意识']
    },
    {
      id: 27,
      type: 'scale-question',
      textEn: 'How would you describe your organization\'s current approach to supporting working mothers under your leadership?',
      textZh: '您如何描述贵司在您的领导下目前对职场母亲的支持程度？',
      scaleLabels: {
        minEn: 'Not supportive at all',
        minZh: '完全不支持',
        maxEn: 'Highly supportive with clear policies and resources',
        maxZh: '高度支持，有明确的政策和资源'
      },
      tags: ['奉献精神', '自我意识']
    },
    {
      id: 28,
      type: 'scale-question',
      textEn: 'How effectively do you use technology to support collaboration and productivity within your team?',
      textZh: '您在团队协作和生产力提升方面对科技的使用程度如何？',
      scaleLabels: {
        minEn: 'Not at all',
        minZh: '完全不使用',
        maxEn: 'Very effectively',
        maxZh: '非常有效地使用'
      },
      tags: ['客观能力']
    },
    {
      id: 29,
      type: 'multiple-choice',
      textEn: 'If you were the god or goddess of the business world and could change or create one thing from the following, what would it be?',
      textZh: '如果您是商业世界的创造神，并且可以创造或改变以下任何一件事，您会选择什么？',
      options: [
        { id: 'A', textEn: 'Redistribute corporate shares so that every individual owns a piece of every business', textZh: '重新分配公司股份，让每个人都能在每家企业中分一杯羹' },
        { id: 'B', textEn: 'Create 72 versions of yourself, each mastering a different industry', textZh: '创造72个化身，每个精通一个不同的行业' },
        { id: 'C', textEn: 'Transform into an all-knowing prophet that oversees and predicts moves of everyone in the business world', textZh: '化身为全知预言家，精准观测并预测商业世界中每个人的行动' },
        { id: 'D', textEn: 'Imbue every product with divine allure, making it irresistible to all', textZh: '赋予所有产品神圣吸引力，让所有人都无法抗拒' },
        { id: 'E', textEn: 'Reconstruct the entire economic system to achieve absolute perfection and sustainability', textZh: '重塑所有经济体系，实现绝对完美与可持续发展' },
        { id: 'F', textEn: 'Ensure that no matter what happens, my business always stays ahead and outmaneuvers my competitors', textZh: '确保无论发生什么，我的企业始终超越我的竞争对手' }
      ]
    },
  ];

  // Questions for Page 4 (Work-Life Balance)
  const page4Questions: any[] = [
    {
      id: 30,
      type: 'scale-question',
      textEn: 'How involved do you feel you are with your previous social life from work after pregnancy?',
      textZh: '您觉得怀孕后自己与以往工作的社交联系程度如何？',
      scaleLabels: {
        minEn: 'Not involved at all',
        minZh: '完全未参与',
        maxEn: 'Very involved',
        maxZh: '非常投入'
      },
      tags: ['社交情商']
    },
    {
      id: 31,
      type: 'scale-question',
      textEn: 'How well does your work arrangement after pregnancy support your needs as a working mother?',
      textZh: '您怀孕后的工作安排对作为职场母亲的您有多大支持作用？',
      scaleLabels: {
        minEn: 'Not supportive at all',
        minZh: '完全不支持',
        maxEn: 'Extremely supportive',
        maxZh: '非常支持'
      }
    },
    {
      id: 32,
      type: 'scale-question',
      textEn: 'How connected do you feel to your professional identity since becoming a mother?',
      textZh: '自成为母亲后，您对自己的职业身份感有多强？',
      scaleLabels: {
        minEn: 'Not connected – motherhood is full priority',
        minZh: '完全不强 – 母亲角色优先',
        maxEn: 'Very connected – profession is important',
        maxZh: '非常强 – 职业身份很重要'
      },
      tags: ['自我意识']
    },
    {
      id: 33,
      type: 'scale-question',
      textEn: 'How has motherhood impacted your career progression or promotion opportunities?',
      textZh: '母亲身份对您的职业发展或晋升机会有何影响？',
      scaleLabels: {
        minEn: 'Very negative – significantly hindered',
        minZh: '非常负面 – 明显阻碍',
        maxEn: 'Very positive – enhanced opportunities',
        maxZh: '非常积极 – 提升机会'
      }
    },
    {
      id: 34,
      type: 'scale-question',
      textEn: 'How capable are you with the current support your employer provides in balancing work and motherhood?',
      textZh: '您如何评价您运用公司提供的兼顾工作和育儿的支持的能力？',
      scaleLabels: {
        minEn: 'Not capable of being supported',
        minZh: '完全不能被支持',
        maxEn: 'Extremely supported',
        maxZh: '非常能被支持'
      },
      tags: ['自我意识']
    },
    {
      id: 35,
      type: 'scale-question',
      textEn: 'How has motherhood influenced your leadership or management style at work?',
      textZh: '母亲身份如何影响了您在工作中的领导或管理风格？',
      scaleLabels: {
        minEn: 'Negative – worse at communication',
        minZh: '消极影响 – 降低沟通能力',
        maxEn: 'Positive – better at communication',
        maxZh: '积极影响 – 提升沟通能力'
      },
      tags: ['情绪调节']
    },
    {
      id: 36,
      type: 'scale-question',
      textEn: 'How effective are you at managing work-related stress since becoming a mother?',
      textZh: '自成为母亲后，您应对工作压力的能力如何？',
      scaleLabels: {
        minEn: 'Much less – harder to manage stress now',
        minZh: '更低效 – 更难应对压力',
        maxEn: 'Much more – strengthened my resilience',
        maxZh: '更有效 – 增强了韧性'
      },
      tags: ['核心耐力', '情绪调节']
    },
    {
      id: 37,
      type: 'scale-question',
      textEn: 'How motivated do you feel to pursue career growth since becoming a mother?',
      textZh: '自成为母亲后，您在职业发展方面的动力有多强？',
      scaleLabels: {
        minEn: 'Not motivated at all',
        minZh: '完全没有',
        maxEn: 'Very motivated',
        maxZh: '非常强'
      },
      tags: ['核心耐力']
    },
    {
      id: 38,
      type: 'scale-question',
      textEn: 'How would your satisfaction level with your ability to maintain work-life balance be?',
      textZh: '您对您目前工作与生活平衡的能力感到满意吗？',
      scaleLabels: {
        minEn: 'Very dissatisfied',
        minZh: '非常不满意',
        maxEn: 'Very satisfied',
        maxZh: '非常满意'
      },
      tags: ['自我意识']
    },
    {
      id: 39,
      type: 'scale-question',
      textEn: 'How often do you feel your needs as a mother are taken into account during important workplace decisions?',
      textZh: '在重要的职场决策中，您觉得作为职场母亲的需求被考虑的频率如何？',
      scaleLabels: {
        minEn: 'Never – completely overlooked',
        minZh: '从未 – 完全未被考虑',
        maxEn: 'Always – consistently considered',
        maxZh: '总是 – 经常被考虑'
      },
      tags: ['自我意识']
    },
    {
      id: 40,
      type: 'scale-question',
      textEn: 'How connected do you feel with other mothers through your work?',
      textZh: '您在工作中与其他母亲的联系如何？',
      scaleLabels: {
        minEn: 'Very disconnected — no connection',
        minZh: '非常弱 – 没有联系',
        maxEn: 'Very connected – strong networks',
        maxZh: '非常强 – 紧密网络'
      },
      tags: ['社交情商']
    },
    {
      id: 41,
      type: 'scale-question',
      textEn: 'Are you actively seeking more opportunities to connect with other mothers through your profession?',
      textZh: '您是否主动在工作中寻求更多与其他职场母亲建立联系的机会？',
      scaleLabels: {
        minEn: 'Never',
        minZh: '从不',
        maxEn: 'Always',
        maxZh: '经常'
      },
      tags: ['社交情商']
    }
  ];

  // Questions for Page 5 (About CHON)
  const page5Questions: any[] = [
    {
      id: 42,
      type: 'scale-question',
      textEn: 'How well do you think enhanced abstract logical thinking would address emotional and life concerns?',
      textZh: '您认为加强抽象逻辑思维对解决情感和生活问题有多大帮助？',
      scaleLabels: {
        minEn: 'Not well - No link with emotions',
        minZh: '完全不行 – 毫无关系',
        maxEn: 'Extremely well - Very effective',
        maxZh: '非常好 – 极其有效'
      },
      tags: ['客观能力', '情绪调节']
    },
    {
      id: 43,
      type: 'scale-question',
      textEn: 'To what extent do you believe that true self-love and the ability to care for others require strong objective reasoning to navigate challenges in life?',
      textZh: '你认为真正的自爱和关爱他人的能力在多大程度上需要强大的客观思维来解决生活中的挑战？',
      scaleLabels: {
        minEn: 'Strongly disagree',
        minZh: '非常不同意',
        maxEn: 'Strongly agree',
        maxZh: '非常同意'
      }
    },
    {
      id: 44,
      type: 'scale-question',
      textEn: 'How valuable do you find having a professional page within the app to showcase your previous work?',
      textZh: '您觉得在应用内拥有一个用于展示以往工作的职业页面有多大价值？',
      scaleLabels: {
        minEn: 'Not valuable at all',
        minZh: '完全没有价值',
        maxEn: 'Extremely valuable',
        maxZh: '非常有价值'
      },
      tags: ['自我意识']
    },
    {
      id: 45,
      type: 'scale-question',
      textEn: 'How likely are you to use this app to share completed projects or achievements for deal sourcing or client acquisition?',
      textZh: '您有多大可能使用该应用分享完成的商业项目或工作成就，以寻找合作机会或获取客户？',
      scaleLabels: {
        minEn: 'Very unlikely',
        minZh: '完全不可能',
        maxEn: 'Very likely',
        maxZh: '非常可能'
      },
      tags: ['客观能力']
    },
    {
      id: 46,
      type: 'scale-question',
      textEn: 'How valuable would you find a feature that helps working mothers stay updated with trends and knowledge in their professional field?',
      textZh: '您认为一个帮助职场母亲了解其行业领域最新动态的功能有多大用处？',
      scaleLabels: {
        minEn: 'Not valuable',
        minZh: '毫无价值 – 毫无益处',
        maxEn: 'Extremely valuable',
        maxZh: '极具价值 – 职业发展必备'
      },
      tags: ['奉献精神']
    },
    {
      id: 47,
      type: 'scale-question',
      textEn: 'How likely are you to use the forum to connect with other mothers for emotional or medical support?',
      textZh: '您有多大可能使用该论坛与其他母亲建立联系，获取情感或医疗方面的支持？',
      scaleLabels: {
        minEn: 'Very unlikely',
        minZh: '完全不可能',
        maxEn: 'Very likely',
        maxZh: '非常可能'
      },
      tags: ['社交情商']
    },
    {
      id: 48,
      type: 'scale-question',
      textEn: 'How valuable do you think this forum could be in helping you feel less isolated as a working mother?',
      textZh: '您认为该论坛在帮助您增进作为职场母亲与别人连接方面有多大价值？',
      scaleLabels: {
        minEn: 'Not valuable at all',
        minZh: '完全没有价值',
        maxEn: 'Extremely valuable',
        maxZh: '非常有价值'
      },
      tags: ['自我意识', '社交情商']
    },
    {
      id: 49,
      type: 'scale-question',
      textEn: 'How motivated are you to use visuospatial and logical training modules within the app to strengthen abstract cognitive skills?',
      textZh: '您有多大动力使用应用内的视觉空间和逻辑训练模块？',
      scaleLabels: {
        minEn: 'Not motivated at all',
        minZh: '完全没有动力',
        maxEn: 'Very motivated',
        maxZh: '非常有动力'
      },
      tags: ['客观能力']
    },
    {
      id: 50,
      type: 'scale-question',
      textEn: 'How helpful do you think cognitive training would be in enhancing your problem-solving abilities?',
      textZh: '您认为抽象逻辑训练对提升您解决问题的能力有多大帮助？',
      scaleLabels: {
        minEn: 'Not helpful at all',
        minZh: '完全无帮助',
        maxEn: 'Extremely helpful',
        maxZh: '非常有帮助'
      },
      tags: ['客观能力']
    },
    {
      id: 51,
      type: 'scale-question',
      textEn: 'How engaging do you think it would be to create and interact with a self-designed electronic child avatar in your personal profile?',
      textZh: '您觉得在个人主页中创建并与自定义的"电子小孩"虚拟形象互动的这个功能有多大吸引力？',
      scaleLabels: {
        minEn: 'Not engaging at all',
        minZh: '完全无吸引力',
        maxEn: 'Very engaging',
        maxZh: '非常有吸引力'
      },
      tags: ['社交情商']
    },
    {
      id: 52,
      type: 'scale-question',
      textEn: 'How would you evaluate a company-specific AI model offering work-related productivity features for you and other mothers?',
      textZh: '您如何看待一个专门为每家公司定制的职场母亲专用人工智能模型？',
      scaleLabels: {
        minEn: 'Not valuable – completely unnecessary',
        minZh: '毫无必要 – 完全不需要',
        maxEn: 'Extremely helpful – enhances efficiency',
        maxZh: '极具价值 – 提升效率'
      },
      tags: ['客观能力']
    },
    {
      id: 53,
      type: 'scale-question',
      textEn: 'How do you feel about requiring you to submit a confidential child health-related record to verify that you and other users are active caregivers?',
      textZh: '您如何看待要求您在使用本应用程序之前提交与儿童健康相关的保密记录，以证实您是孩子的照顾者？',
      scaleLabels: {
        minEn: 'Strongly oppose – utterly invasive',
        minZh: '强烈反对 - 违反隐私',
        maxEn: 'Strongly support – ensures safety and trust',
        maxZh: '强烈支持 - 保障安全的基础'
      },
      tags: ['客观能力']
    },
    {
      id: 54,
      type: 'scale-question',
      textEn: 'Do you believe misuse by unintended users (including your partner accessing accounts without permission) could negatively affect trust in the app?',
      textZh: '您认为如果有非目标用户滥用该平台（包括您的生活伴侣未经允许访问账户等情况），是否会对用户对本应用的信任度产生负面影响？',
      scaleLabels: {
        minEn: 'Definitely no – no trust risk',
        minZh: '绝对不 – 完全无风险',
        maxEn: 'Definitely yes – severely undermines trust',
        maxZh: '绝对会 – 严重破坏信任'
      }
    },
    {
      id: 55,
      type: 'scale-question',
      textEn: 'How do you feel about your company occasionally verifying through HR that business updates and activities posted on this platform are genuinely by yourself and other mother users, not others misusing their accounts?',
      textZh: '您如何看待由公司人力资源部门核查平台上的业务更新和动态确实由目标用户本人发布，而非他人滥用账户？',
      scaleLabels: {
        minEn: 'Strongly oppose',
        minZh: '强烈反对',
        maxEn: 'Strongly support',
        maxZh: '强烈支持'
      },
      tags: ['自我意识']
    }
  ];

  // Questions for Page 6 (About Motherhood)
  const page6Questions: any[] = [
    {
      id: 56,
      type: 'scale-question',
      textEn: 'How prepared did you feel for motherhood before becoming a mother?',
      textZh: '在成为母亲之前，您觉得自己对母亲这一角色的准备程度如何？',
      scaleLabels: {
        minEn: 'Not prepared at all',
        minZh: '完全没有准备',
        maxEn: 'Very prepared',
        maxZh: '非常充分'
      },
      tags: ['核心耐力']
    },
    {
      id: 57,
      type: 'scale-question',
      textEn: 'How much has motherhood changed your personal values or priorities?',
      textZh: '母亲身份对您的个人价值观或人生优先事项改变有多大？',
      scaleLabels: {
        minEn: 'No change',
        minZh: '没有改变',
        maxEn: 'Completely',
        maxZh: '完全改变'
      },
      tags: ['自我意识']
    },
    {
      id: 58,
      type: 'scale-question',
      textEn: 'How supported do you feel by your family or community in your motherhood journey?',
      textZh: '在做母亲的过程中，您觉得家人或社群对您的支持程度如何？',
      scaleLabels: {
        minEn: 'Not supported at all',
        minZh: '完全没有支持',
        maxEn: 'Extremely supported',
        maxZh: '非常支持'
      },
      tags: ['社交情商']
    },
    {
      id: 59,
      type: 'scale-question',
      textEn: 'How confident are you in your ability to balance motherhood with your personal goals (e.g., hobbies, self-care)?',
      textZh: '您在平衡母亲角色与个人目标方面有多大信心？',
      scaleLabels: {
        minEn: 'Not confident at all',
        minZh: '完全没有信心',
        maxEn: 'Very confident',
        maxZh: '非常有信心'
      },
      tags: ['自我意识']
    },
    {
      id: 60,
      type: 'scale-question',
      textEn: 'How much emotional fulfillment has motherhood brought to your life?',
      textZh: '母亲身份为您的生活带来了多少情感满足感？',
      scaleLabels: {
        minEn: 'No emotion at all',
        minZh: '完全没有情感',
        maxEn: 'Extremely fulfilling',
        maxZh: '非常满足'
      },
      tags: ['奉献精神']
    },
    {
      id: 61,
      type: 'scale-question',
      textEn: 'How much do you feel that motherhood has made you more resilient or emotionally strong?',
      textZh: '母亲身份是否让您变得更有韧性或情绪更强大？',
      scaleLabels: {
        minEn: 'Much weaker',
        minZh: '明显减弱',
        maxEn: 'Much stronger',
        maxZh: '显著增强'
      },
      tags: ['情绪调节', '核心耐力']
    },
    {
      id: 62,
      type: 'scale-question',
      textEn: 'How has motherhood affected your ability to set boundaries (e.g., with work, family, or friends) in life?',
      textZh: '母亲身份对您设定边界（如与工作、家庭或朋友）能力的影响如何？',
      scaleLabels: {
        minEn: 'Significantly weakened',
        minZh: '显著减弱',
        maxEn: 'Improved greatly',
        maxZh: '显著提升'
      },
      tags: ['自我意识']
    },
    {
      id: 63,
      type: 'scale-question',
      textEn: 'How often do you feel pressure to meet external expectations of motherhood (e.g., societal, cultural, or family expectations)?',
      textZh: '您多久感受到来自外界对母亲角色（如社会、文化或家庭）的期待压力？',
      scaleLabels: {
        minEn: 'Never',
        minZh: '从不',
        maxEn: 'Always',
        maxZh: '总是'
      },
      tags: ['自我意识']
    },
    {
      id: 64,
      type: 'scale-question',
      textEn: 'How satisfied are you with the balance between your motherhood role and your sense of self outside of being a mother?',
      textZh: '您对自己平衡母亲这一身份与作为母亲之外的自我身份有多满意？',
      scaleLabels: {
        minEn: 'Very dissatisfied',
        minZh: '非常不满意',
        maxEn: 'Very satisfied',
        maxZh: '非常满意'
      },
      tags: ['自我意识']
    },
    {
      id: 65,
      type: 'scale-question',
      textEn: 'How important is it for you to connect with other mothers who share similar experiences?',
      textZh: '与有类似经历的其他母亲建立联系对您来说有多重要？',
      scaleLabels: {
        minEn: 'Not important at all',
        minZh: '完全不重要',
        maxEn: 'Extremely important',
        maxZh: '非常重要'
      },
      tags: ['社交情商']
    },
    {
      id: 66,
      type: 'scale-question',
      textEn: 'How much do you feel that your own mother\'s role influenced your early understanding of leadership or responsibility?',
      textZh: '您认为您的母亲在多大程度上影响了童年时期您对领导力或责任感的认知？',
      scaleLabels: {
        minEn: 'Not at all',
        minZh: '没有影响',
        maxEn: 'Very strongly',
        maxZh: '非常深远'
      },
      tags: ['自我意识']
    }
  ];

  return (
    <div className="questionnaire-content both-questionnaire" lang={language}>
      {/* Progress bar */}
      <div className="question-progress-container">
        <div className="question-progress-bar">
          <div 
            className="question-progress-fill" 
            style={{ width: `${calculatedQuestionnaireProgress()}%` }}
          ></div>
        </div>
      </div>
      
      {/* Page 1 - Corporate background */}
      {showFirstPage && (
        <div className="first-page-questions first-page-true">
          {page1Questions.map((question) => (
            <div key={question.id} id={`question-${question.id}`} className="question-container">
              {renderQuestionText(question)}
              
              {question.type === 'multiple-choice' && (
                <div className="answer-options">
                  {question.options?.map((option: OptionType) => (
                    <div 
                      key={option.id}
                      className={`answer-option ${getCurrentAnswers()[question.id] === option.id ? 'selected' : ''}`}
                      onClick={() => handleMultipleChoiceAnswer(question.id, option.id)}
                    >
                      <p>{option.id}) {language === 'en' ? option.textEn : option.textZh}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'text-input' && (
                <div className="text-input-container">
                  <input
                    type="text"
                    className="text-answer-input"
                    value={getCurrentAnswers()[question.id] || ''}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
                  />
                </div>
              )}
            </div>
          ))}
          
          <div className="question-navigation">
            <button 
              className="nav-button next-button"
              onClick={() => {
                setShowFirstPage(false);
                setShowSecondPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
              disabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 1 && parseInt(id) <= 7).length < 7}
            >
              {language === 'en' ? 'Continue' : '继续'}
            </button>
          </div>
        </div>
      )}

      {/* Page 2 - Mother Background */}
      {showSecondPage && (
        <div className="first-page-questions">
          {page2Questions.map((question) => (
            <div key={question.id} id={`question-${question.id}`} className="question-container">
              {renderQuestionText(question)}
              
              {question.type === 'multiple-choice' && (
                <div className="answer-options">
                  {question.options?.map((option: OptionType) => (
                    <div 
                      key={option.id}
                      className={`answer-option ${getCurrentAnswers()[question.id] === option.id ? 'selected' : ''}`}
                      onClick={() => handleMultipleChoiceAnswer(question.id, option.id)}
                    >
                      <p>{option.id}) {language === 'en' ? option.textEn : option.textZh}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'text-input' && (
                <div className="text-input-container">
                  <input
                    type="text"
                    className="text-answer-input"
                    value={getCurrentAnswers()[question.id] || ''}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
                  />
                </div>
              )}
            </div>
          ))}
          
          <div className="question-navigation">
            <button 
              className="nav-button prev-button"
              onClick={() => {
                setShowSecondPage(false);
                setShowFirstPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
            >
              {language === 'en' ? 'Back' : '返回'}
            </button>
            
            <button 
              className="nav-button next-button"
              onClick={() => {
                setShowSecondPage(false);
                setShowThirdPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
              disabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 8 && parseInt(id) <= 15).length < 8}
            >
              {language === 'en' ? 'Continue' : '继续'}
            </button>
          </div>
        </div>
      )}

      {/* Page 3 - Leadership */}
      {showThirdPage && (
        <div className="first-page-questions">
          <h1 className="section-title">
            {language === 'en' 
              ? 'I. About Your Leadership' 
              : 'I. 关于您的领导力'}
          </h1>
          
          {page3Questions.map((question) => (
            <div key={question.id} id={`question-${question.id}`} className="question-container">
              {renderQuestionText(question)}
              
              {question.type === 'multiple-choice' && (
                <div className="answer-options">
                  {question.options?.map((option: OptionType) => (
                    <div 
                      key={option.id}
                      className={`answer-option ${getCurrentAnswers()[question.id] === option.id ? 'selected' : ''}`}
                      onClick={() => handleMultipleChoiceAnswer(question.id, option.id)}
                    >
                      <p>{option.id}) {language === 'en' ? option.textEn : option.textZh}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'text-input' && (
                <div className="text-input-container">
                  <input
                    type="text"
                    className="text-answer-input"
                    value={getCurrentAnswers()[question.id] || ''}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
                  />
                </div>
              )}
              
              {question.type === 'scale-question' && (
                <div className="scale-question-container">
                  <div className="scale-labels-wrapper">
                    <div className="scale-options">
                      {['1', '2', '3', '4', '5'].map((value) => (
                        <div 
                          key={value}
                          className={`scale-option ${getCurrentAnswers()[question.id] === value ? 'selected' : ''}`}
                          onClick={() => handleScaleAnswer(question.id, value)}
                        >
                          <div className="scale-circle"></div>
                          <span className="scale-value">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="scale-extreme-labels">
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.minEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.minZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.maxEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.maxZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="question-navigation">
            <button 
              className="nav-button prev-button"
              onClick={() => {
                setShowThirdPage(false);
                setShowSecondPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
            >
              {language === 'en' ? 'Back' : '返回'}
            </button>
            
            <button 
              className="nav-button next-button"
              onClick={() => {
                setShowThirdPage(false);
                setShowFourthPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
              disabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 16 && parseInt(id) <= 29).length < 14}
            >
              {language === 'en' ? 'Continue' : '继续'}
            </button>
          </div>
        </div>
      )}

      {/* Page 4 - Work-Life Balance */}
      {showFourthPage && (
        <div className="first-page-questions">
          <h1 className="section-title">
            {language === 'en' 
              ? 'II. About Work-Life Balance' 
              : 'II. 关于工作与生活的平衡'}
          </h1>
          
          {page4Questions.map((question) => (
            <div key={question.id} id={`question-${question.id}`} className="question-container">
              {renderQuestionText(question)}
              
              {question.type === 'multiple-choice' && (
                <div className="answer-options">
                  {question.options?.map((option: OptionType) => (
                    <div 
                      key={option.id}
                      className={`answer-option ${getCurrentAnswers()[question.id] === option.id ? 'selected' : ''}`}
                      onClick={() => handleMultipleChoiceAnswer(question.id, option.id)}
                    >
                      <p>{option.id}) {language === 'en' ? option.textEn : option.textZh}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'text-input' && (
                <div className="text-input-container">
                  <input
                    type="text"
                    className="text-answer-input"
                    value={getCurrentAnswers()[question.id] || ''}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
                  />
                </div>
              )}
              
              {question.type === 'scale-question' && (
                <div className="scale-question-container">
                  <div className="scale-labels-wrapper">
                    <div className="scale-options">
                      {['1', '2', '3', '4', '5'].map((value) => (
                        <div 
                          key={value}
                          className={`scale-option ${getCurrentAnswers()[question.id] === value ? 'selected' : ''}`}
                          onClick={() => handleScaleAnswer(question.id, value)}
                        >
                          <div className="scale-circle"></div>
                          <span className="scale-value">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="scale-extreme-labels">
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.minEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.minZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.maxEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.maxZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="question-navigation">
            <button 
              className="nav-button prev-button"
              onClick={() => {
                setShowFourthPage(false);
                setShowThirdPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
            >
              {language === 'en' ? 'Back' : '返回'}
            </button>
            
            <button 
              className="nav-button next-button"
              onClick={() => {
                setShowFourthPage(false);
                setShowFifthPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
              disabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 30 && parseInt(id) <= 41).length < 12}
            >
              {language === 'en' ? 'Continue' : '继续'}
            </button>
          </div>
        </div>
      )}

      {/* Page 5 - About CHON */}
      {showFifthPage && (
        <div className="first-page-questions">
          <h1 className="section-title">
            {language === 'en' 
              ? 'III. About Us, CHON' 
              : 'III. 关于我们'}
          </h1>
          
          {page5Questions.map((question) => (
            <div key={question.id} id={`question-${question.id}`} className="question-container">
              {renderQuestionText(question)}
              
              {question.type === 'multiple-choice' && (
                <div className="answer-options">
                  {question.options?.map((option: OptionType) => (
                    <div 
                      key={option.id}
                      className={`answer-option ${getCurrentAnswers()[question.id] === option.id ? 'selected' : ''}`}
                      onClick={() => handleMultipleChoiceAnswer(question.id, option.id)}
                    >
                      <p>{option.id}) {language === 'en' ? option.textEn : option.textZh}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'text-input' && (
                <div className="text-input-container">
                  <input
                    type="text"
                    className="text-answer-input"
                    value={getCurrentAnswers()[question.id] || ''}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
                  />
                </div>
              )}
              
              {question.type === 'scale-question' && (
                <div className="scale-question-container">
                  <div className="scale-labels-wrapper">
                    <div className="scale-options">
                      {['1', '2', '3', '4', '5'].map((value) => (
                        <div 
                          key={value}
                          className={`scale-option ${getCurrentAnswers()[question.id] === value ? 'selected' : ''}`}
                          onClick={() => handleScaleAnswer(question.id, value)}
                        >
                          <div className="scale-circle"></div>
                          <span className="scale-value">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="scale-extreme-labels">
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.minEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.minZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.maxEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.maxZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="question-navigation">
            <button 
              className="nav-button prev-button"
              onClick={() => {
                setShowFifthPage(false);
                setShowFourthPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
            >
              {language === 'en' ? 'Back' : '返回'}
            </button>
            
            <button 
              className="nav-button next-button"
              onClick={() => {
                setShowFifthPage(false);
                setShowSixthPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
              disabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 42 && parseInt(id) <= 55).length < 14}
            >
              {language === 'en' ? 'Continue' : '继续'}
            </button>
          </div>
        </div>
      )}

      {/* Page 6 - About Motherhood */}
      {showSixthPage && (
        <div className="first-page-questions">
          <h1 className="section-title">
            {language === 'en' 
              ? 'IV. About Motherhood' 
              : 'IV. 关于母亲'}
          </h1>
          
          {page6Questions.map((question) => (
            <div key={question.id} id={`question-${question.id}`} className="question-container">
              {renderQuestionText(question)}
              
              {question.type === 'multiple-choice' && (
                <div className="answer-options">
                  {question.options?.map((option: OptionType) => (
                    <div 
                      key={option.id}
                      className={`answer-option ${getCurrentAnswers()[question.id] === option.id ? 'selected' : ''}`}
                      onClick={() => handleMultipleChoiceAnswer(question.id, option.id)}
                    >
                      <p>{option.id}) {language === 'en' ? option.textEn : option.textZh}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'text-input' && (
                <div className="text-input-container">
                  <input
                    type="text"
                    className="text-answer-input"
                    value={getCurrentAnswers()[question.id] || ''}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
                  />
                </div>
              )}
              
              {question.type === 'scale-question' && (
                <div className="scale-question-container">
                  <div className="scale-labels-wrapper">
                    <div className="scale-options">
                      {['1', '2', '3', '4', '5'].map((value) => (
                        <div 
                          key={value}
                          className={`scale-option ${getCurrentAnswers()[question.id] === value ? 'selected' : ''}`}
                          onClick={() => handleScaleAnswer(question.id, value)}
                        >
                          <div className="scale-circle"></div>
                          <span className="scale-value">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="scale-extreme-labels">
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.minEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.minZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.maxEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.maxZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="question-navigation">
            <button 
              className="nav-button prev-button"
              onClick={() => {
                setShowSixthPage(false);
                setShowFifthPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
            >
              {language === 'en' ? 'Back' : '返回'}
            </button>
            
            <button 
              className="nav-button finish-button"
              onClick={() => {
                finishQuestionnaire();
              }}
              disabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 56 && parseInt(id) <= 66).length < 11}
            >
              {language === 'en' ? 'Finish' : '完成'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BothQuestionnaire; 