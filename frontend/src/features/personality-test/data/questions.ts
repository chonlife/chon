import { Question } from "../types/question";

export const questions: Question[] = [
    {
      id: 1,
      type: 'multiple-choice',
      textEn: "What’s your biological sex?",
      textZh: "您的生理性别是什么？",
      options: [
        { id: 'A', textEn: 'Female', textZh: '女' },
        { id: 'B', textEn: 'Male', textZh: '男' }
      ]
    },
    {
      id: 2,
      type: 'multiple-choice',
      textEn: "What is your age range?",
      textZh: "您的年龄是？",
      options: [
        { id: 'A', textEn: 'Under 18', textZh: '18岁以下' },
        { id: 'B', textEn: '18–24', textZh: '18–24' },
        { id: 'C', textEn: '25–34', textZh: '25–34' },
        { id: 'D', textEn: '35–44', textZh: '35–44' },
        { id: 'E', textEn: '45–54', textZh: '45–54' },
        { id: 'F', textEn: '55–64', textZh: '55–64' },
        { id: 'G', textEn: '65 or above', textZh: '65岁及以上' }
      ]
    },
    {
      id: 3,
      type: 'text-input',
      textEn: "Where are you currently based?",
      textZh: "您目前所在的国家或地区是？"
    },
    {
      id: 4,
      type: 'multiple-choice',
      textEn: "Have you worked in a for-profit corporate setting, currently or in the past?",
      textZh: "您目前或过去是否曾在营利性企业环境中工作过？",
      options: [
        { id: 'A', textEn: 'Yes', textZh: '是' },
        { id: 'B', textEn: 'No', textZh: '否' }
      ]
    },
    {
      id: 5,
      type: 'multiple-choice',
      textEn: 'How would you describe your racial or ethnic background?',
      textZh: '您如何描述您的种族或民族背景？',
      options: [
        { id: 'A', textEn: 'African descent', textZh: '非洲裔' },
        { id: 'B', textEn: 'White / European descent', textZh: '白人/欧洲裔' },
        { id: 'C', textEn: 'Asian', textZh: '亚裔/亚洲人' },
        { id: 'D', textEn: 'Hispanic / Latino / Latin American', textZh: '西班牙裔/拉丁美洲裔' },
        { id: 'E', textEn: 'Middle Eastern / North African', textZh: '中东人/北非人' },
        { id: 'F', textEn: 'Indigenous peoples / Pacific Islander', textZh: '原住民/太平洋岛民' },
        { id: 'G', textEn: 'Mixed / Multiracial', textZh: '混血/多民族' },
        { id: 'H', textEn: 'Other', textZh: '其他' },
        { id: 'I', textEn: 'Prefer not to say', textZh: '不愿回答' }
      ]
    },
    
    {
      id: 6,
      type: 'text-input',
      textEn: 'Please enter your professional contact to allow us to verify your identity.',
      textZh: '请输入您的职业联系方式，以便验证身份。'
    },
    
    {
      id: 7,
      type: 'multiple-choice',
      textEn: 'How long have you been in a managerial or leadership role?',
      textZh: '您在管理或领导岗位上有多少年的工作经验？',
      options: [
        { id: 'A', textEn: '1–3 years', textZh: '1–3 年' },
        { id: 'B', textEn: '4–6 years', textZh: '4–6 年' },
        { id: 'C', textEn: '7–9 years', textZh: '7–9 年' },
        { id: 'D', textEn: '10+ years', textZh: '10 年以上' }
      ]
    },
    
    {
      id: 8,
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
      id: 9,
      type: 'multiple-choice',
      textEn: "What is your company's total employee headcount?",
      textZh: '贵公司的员工总人数是多少？',
      options: [
        { id: 'A', textEn: 'Fewer than 50', textZh: '少于 50 人' },
        { id: 'B', textEn: '50–249', textZh: '50–249' },
        { id: 'C', textEn: '250–999', textZh: '250–999' },
        { id: 'D', textEn: '1,000–9,999', textZh: '1,000–9,999' },
        { id: 'E', textEn: '10,000–50,000', textZh: '10,000–50,000' },
        { id: 'F', textEn: '50,000 or more', textZh: '50,000及以上' }
      ]
    },
    {
      id: 10,
      type: 'multiple-choice',
      textEn: 'What is the approximate annual revenue of your company?',
      textZh: '贵公司的年营业收入大约是多少？',
      options: [
        { id: 'A', textEn: 'Less than $1 million', textZh: '少于500万' },
        { id: 'B', textEn: '$1–10 million', textZh: '500–5,000万' },
        { id: 'C', textEn: '$10–50 million', textZh: '5,000–5亿' },
        { id: 'D', textEn: '$50–500 million', textZh: '5亿–50亿' },
        { id: 'E', textEn: '$500 million–$5 billion', textZh: '50亿–500亿' },
        { id: 'F', textEn: 'Over $10 billion', textZh: '超过500亿' }
      ]
    },
    
    {
      id: 11,
      type: 'multiple-choice',
      textEn: 'What is the approximate size of your span of control?',
      textZh: '您的管理规模是多少？',
      options: [
        { id: 'A', textEn: '1–5 people', textZh: '1–5人' },
        { id: 'B', textEn: '6–20 people', textZh: '6–20人' },
        { id: 'C', textEn: '20–50 people', textZh: '20–50人' },
        { id: 'D', textEn: '50+ people', textZh: '50人以上' }
      ]
    },
  
    {
      id: 12,
      type: 'scale-question',
      textEn: "What’s the decision-making structure in your company?",
      textZh: "您如何描述贵公司的决策体系？",
      scaleLabels: {
        minEn: 'Highly centralized',
        minZh: '高度集中化',
        maxEn: 'Flexibly adaptive',
        maxZh: '灵活变通'
      }
    },
    
    {
      id: 13,
      type: 'scale-question',
      textEn: "What should be the primary basis of authority in your company?",
      textZh: "贵司的决策权应该如何决定？",
      tags: ['客观能力'],
      scaleLabels: {
        minEn: 'Policies & Command',
        minZh: '政策和指挥',
        maxEn: 'Individual’s ability',
        maxZh: '个人能力'
      }
    },
    
    {
      id: 14,
      type: 'scale-question',
      textEn: "How well-organized is your team structure?",
      textZh: "您的团队结构有多高效？",
      tags: ['客观能力', '核心耐力'],
      scaleLabels: {
        minEn: 'Not organized',
        minZh: '缺乏组织性',
        maxEn: 'Very well-organized',
        maxZh: '组织性强'
      }
    },
    
    {
      id: 15,
      type: 'scale-question',
      textEn: "What’s your team’s level of communication and collaboration?",
      textZh: "您的团队的沟通与协作水平如何？",
      tags: ['客观能力', '社交情商'],
      scaleLabels: {
        minEn: 'Very poor – Lack communication & efficiency',
        minZh: '非常差 — 缺乏沟通和效率',
        maxEn: 'Excellent – Great communication & efficiency',
        maxZh: '非常好 — 极好的沟通并高效'
      }
    },
    
    {
      id: 16,
      type: 'scale-question',
      textEn: "What’s your experience in establishing trust with business partners?",
      textZh: "您与客户建立信任的经历如何？",
      tags: ['社交情商'],
      scaleLabels: {
        minEn: 'Very poor – significant challenges',
        minZh: '非常差 – 极大挑战',
        maxEn: 'Excellent – effective and trusted',
        maxZh: '非常好 – 有效、可信'
      }
    },
    
    {
      id: 17,
      type: 'scale-question',
      textEn: "Is your team effective at understanding client or market needs?",
      textZh: "贵司在理解客户或市场方面如何？",
      tags: ['社交情商'],
      scaleLabels: {
        minEn: 'Very poor – insufficient understanding',
        minZh: '非常差 – 不充分了解',
        maxEn: 'Excellent – exceeds expectations',
        maxZh: '非常好 – 超出预期'
      }
    },
  
    {
      id: 18,
      type: 'scale-question',
      textEn: 'Is responsibility important in business projects?',
      textZh: '责任感对于商业项目重要吗？',
      tags: ['客观能力', '奉献精神'],
      scaleLabels: {
        minEn: 'Not important at all',
        minZh: '完全不重要',
        maxEn: 'Extremely important',
        maxZh: '极其重要'
      }
    },
    
    {
      id: 19,
      type: 'scale-question',
      textEn: 'Are empathy and communication important in business relationships?',
      textZh: '同理心和沟通能力在商业关系中重要吗？',
      tags: ['奉献精神', '社交情商'],
      scaleLabels: {
        minEn: 'Not important at all',
        minZh: '完全不重要',
        maxEn: 'Extremely important',
        maxZh: '极其重要'
      }
    },
    
    {
      id: 20,
      type: 'scale-question',
      textEn: 'Does your company value “soft skills” of responsibility, empathy, and communication?',
      textZh: '贵司认可软实力（例如责任心、同理心、沟通能力）吗？',
      textLifeEn: 'Does your team value “soft skills” of responsibility, empathy, and communication?',
      textLifeZh: '您所在的团队是否认可责任心、同理心、沟通能力等软实力？',
      tags: ['奉献精神'],
      scaleLabels: {
        minEn: 'Not recognized at all',
        minZh: '完全不认可',
        maxEn: 'Highly recognized and utilized',
        maxZh: '高度认可和利用'
      }
    },
    
    {
      id: 21,
      type: 'scale-question',
      textEn: 'Are men and women equally supported in balancing work and family?',
      textZh: '男性和女性是否在平衡工作与家庭方面得到了同等支持？',
      tagsMale: ['客观能力'],
      tagsFemale: ['自我意识'],
      scaleLabels: {
        minEn: 'No, one is significantly less supported',
        minZh: '不是，其一得到的很少同等支持',
        maxEn: 'Yes, equally supported',
        maxZh: '是的，两种性别都得到了平等支持'
      }
    },
    
    {
      id: 22,
      type: 'scale-question',
      textEn: 'Is providing support and social bonding for working mothers important?',
      textZh: '为职场母亲提供情感支持和社交重要吗？',
      tagsMale: ['奉献精神'],
      tagsFemale: ['自我意识'],
      scaleLabels: {
        minEn: 'Not important at all',
        minZh: '完全不重要',
        maxEn: 'Very important',
        maxZh: '非常重要'
      }
    },
    
    {
      id: 23,
      type: 'scale-question',
      textEn: 'How is your company’s current support for working mothers?',
      textZh: '贵司在您的一线领导下目前对职场母亲的支持程度是？',
      tagsMale: ['奉献精神'],
      tagsFemale: ['自我意识'],
      scaleLabels: {
        minEn: 'Not supportive at all',
        minZh: '完全不支持',
        maxEn: 'Highly supportive',
        maxZh: '高度支持'
      }
    },
    
    {
      id: 24,
      type: 'scale-question',
      textEn: 'Do you use technology within your team?',
      textZh: '您在团队里会常用科技工具吗？',
      scaleLabels: {
        minEn: 'Not at all',
        minZh: '完全不使用',
        maxEn: 'Very effectively',
        maxZh: '非常有效地使用'
      }
    },  
  
    {
      id: 25,
      type: 'multiple-choice',
      textEn: 'For the personality test result, we ask you to imagine yourself as the god or goddess of the business world. If you could change or create one thing, what would it be?',
      textZh: '关于性格测试结果，我们请您将自己想象成商界的创造神。如果您可以创造或改变以下任何一件事，您会选择什么？',
      options: [
        { id: 'A', textEn: 'Redistribute all corporate shares so that every individual owns a piece of every business', textZh: '重新分配公司股份，让每个人都能在每家企业中分一杯羹' },
        { id: 'B', textEn: 'Create 72 versions of yourself, each mastering a different industry', textZh: '创造72个化身，每个精通一个不同的行业' },
        { id: 'C', textEn: 'Transform into an omnipotent prophet that predicts and controls moves of everyone in the business world', textZh: '化身为全知预言家，精准预测并控制商业世界中每个人的行动' },
        { id: 'D', textEn: 'Imbue every product with divine allure, making it irresistible to all', textZh: '赋予所有产品神圣吸引力，让所有人都无法抗拒' },
        { id: 'E', textEn: 'Reconstruct the entire economic system to achieve absolute perfection and sustainability', textZh: '重塑所有经济体系，实现绝对完美与可持续发展' },
        { id: 'F', textEn: 'Ensure that no matter what happens, I can always come up with a plan to stay ahead and outmaneuver my competitors', textZh: '确保无论发生什么，我永远有策略超越我的竞争对手' }
      ]
    },
    
    {
      id: 26,
      type: 'scale-question',
      textEn: 'Does logical thinking address emotional and life concerns?',
      textZh: '逻辑思维是否解决情感和生活问题？',
      tags: ['客观能力', '情绪调节'],
      scaleLabels: {
        minEn: 'Not well - no link with emotions',
        minZh: '完全不行 – 毫无关系',
        maxEn: 'Extremely well - very effective',
        maxZh: '非常好 – 极其有效'
      }
    },
    
    {
      id: 27,
      type: 'scale-question',
      textEn: 'Do self-love and care for others require objective reasoning?',
      textZh: '自爱和关爱他人是否需要客观思维支持？',
      tags: ['客观能力'],
      scaleLabels: {
        minEn: 'Strongly disagree',
        minZh: '非常不需要',
        maxEn: 'Strongly agree',
        maxZh: '非常需要'
      }
    },
    
    {
      id: 28,
      type: 'scale-question',
      textEn: 'How valuable are you staying updated with the professional field?',
      textZh: '了解行业领域信息对您来说有多大价值？',
      textNonMotherEn: 'How valuable are working mothers staying updated with the professional field?',
      textNoneMotherZh: '职场母亲了解行业领域信息有多大价值？',
      textLifeEn: 'How valuable are you staying updated with interested fields?',
      textLifeZh: '了解感兴趣的领域信息对您来说有多大价值？',
      tags: ['奉献精神'],
      scaleLabels: {
        minEn: 'Not valuable',
        minZh: '毫无价值',
        maxEn: 'Extremely valuable',
        maxZh: '极具价值'
      }
    },
    
    {
      id: 29,
      type: 'scale-question',
      textEn: 'How valuable are you posting and accessing new business deals?',
      textZh: '发布和获取商业合作对您来说有多大价值？',
      textNonMotherEn: 'How valuable are working mothers posting and accessing new business deals?',
      textNoneMotherZh: '职场母亲发布和获取商业合作有多大价值？',
      textLifeEn: 'How valuable are you sharing your life and exploring new opportunities?',
      textLifeZh: '您分享生活和探索新机会有多大价值？',
      tags: ['奉献精神'],
      scaleLabels: {
        minEn: 'Not valuable',
        minZh: '毫无价值',
        maxEn: 'Highly valuable',
        maxZh: '极具价值'
      }
    },
    
    {
      id: 30,
      type: 'scale-question',
      textEn: 'How valuable are you sharing maternal experiences and emotional support?',
      textZh: '分享育儿经验、提供情感支持对您来说有多大价值？',
      textNonMotherEn: 'How valuable are working mothers sharing maternal experiences and emotional support?',
      textNoneMotherZh: '职场母亲分享育儿经验、提供情感支持有多大价值？',
      tags: ['奉献精神'],
      scaleLabels: {
        minEn: 'Not valuable',
        minZh: '毫无价值',
        maxEn: 'Extremely beneficial',
        maxZh: '极其有益'
      }
    },
    
    {
      id: 31,
      type: 'scale-question',
      textEn: 'How valuable are healthcare professionals’ medical advice for you?',
      textZh: '外部医疗专业人士提供医学建议有多大价值？',
      textNonMotherEn: 'How valuable are healthcare professionals’ medical advice for working mothers?',
      textNoneMotherZh: '外部医疗专业人士为职场母亲提供医学建议有多大价值？',
      tags: ['奉献精神'],
      scaleLabels: {
        minEn: 'Not valuable',
        minZh: '毫无价值',
        maxEn: 'Extremely valuable',
        maxZh: '极具价值'
      }
    },
    
    {
      id: 32,
      type: 'scale-question',
      textEn: 'How valuable are visuospatial and logical training?',
      textZh: '视觉空间与逻辑训练有多大价值？',
      tags: ['客观能力'],
      scaleLabels: {
        minEn: 'Not valuable',
        minZh: '毫无价值',
        maxEn: 'Extremely valuable',
        maxZh: '极具价值'
      }
    },
    
    {
      id: 33,
      type: 'scale-question',
      textEn: 'How engaging are self-customized kids’ avatars and tokens for interactions?',
      textZh: '促进互动的自定义儿童虚拟形象和代币有多大吸引力？',
      tags: ['社交情商'],
      scaleLabels: {
        minEn: 'Not engaging',
        minZh: '毫无价值',
        maxEn: 'Very engaging',
        maxZh: '极具价值'
      }
    },
    
    {
      id: 34,
      type: 'scale-question',
      textEn: 'How important is mentorship matching for mothers of the same industry?',
      textZh: '一个将业内母亲“导师匹配”的功能有多大重要性？',
      tags: ['社交情商'],
      scaleLabels: {
        minEn: 'Not important',
        minZh: '不重要',
        maxEn: 'Extremely important',
        maxZh: '非常重要'
      }
    },
    
    {
      id: 35,
      type: 'scale-question',
      textEn: 'How valuable is a company-specific AI for working mothers?',
      textZh: '一个为每家公司定制的职场母亲专用人工智能模型有多大价值？',
      tags: ['奉献精神'],
      scaleLabels: {
        minEn: 'Not valuable',
        minZh: '毫无价值',
        maxEn: 'Extremely valuable',
        maxZh: '极具价值'
      }
    },
    
    {
      id: 36,
      type: 'scale-question',
      textEn: 'How will AI support working parents in the next 5–10 years?',
      textZh: '未来5–10年内，人工智能怎么支持职场父母？',
      tags: ['客观能力'],
      scaleLabels: {
        minEn: 'AI brings new challenges ahead',
        minZh: '带来全新挑战',
        maxEn: 'AI revolutionizes support for parents',
        maxZh: '革新对父母的支持'
      }
    },
    
    {
      id: 37,
      type: 'scale-question',
      textEn: 'How will incorporating motherhood improve client relationships?',
      textZh: '母亲这一身份的加入如何改善客户关系？',
      tags: ['情绪管理'],
      scaleLabels: {
        minEn: 'Not effective',
        minZh: '毫无价值',
        maxEn: 'Extremely effective',
        maxZh: '极具价值'
      }
    },
    
    {
      id: 38,
      type: 'scale-question',
      textEn: 'Is a confidential child health-related record needed to verify mothers’ identity?',
      textZh: '是否需要一份与儿童健康相关的保密记录来核实母亲的身份？',
      tags: ['客观能力'],
      scaleLabels: {
        minEn: 'Strongly oppose – utterly invasive',
        minZh: '强烈反对 – 侵犯隐私',
        maxEn: 'Strongly support – ensures safety and trust',
        maxZh: '强烈支持 – 保障安全的基础'
      }
    },
    
    {
      id: 39,
      type: 'scale-question',
      textEn: 'Does misuse by unintended users negatively affect trust?',
      textZh: '非目标用户滥用该平台是否会对信任度产生负面影响？',
      tags: ['客观能力'],
      scaleLabels: {
        minEn: 'Definitely no – no trust risk',
        minZh: '绝对不 – 完全无风险',
        maxEn: 'Definitely yes – severely undermines trust',
        maxZh: '绝对会 – 严重破坏信任'
      }
    },
    
    {
      id: 40,
      type: 'scale-question',
      textEn: 'Should companies verify through HR that this platform is used by mothers only?',
      textZh: '公司是否应通过人力资源部门核实该平台仅供母亲使用？',
      tags: ['自我意识'],
      scaleLabels: {
        minEn: 'Strongly oppose',
        minZh: '强烈反对',
        maxEn: 'Strongly support',
        maxZh: '强烈支持'
      }
    },
    
    {
      id: 41,
      type: 'scale-question',
      textEn: 'How important are mothers’ empathy and selflessness in leadership?',
      textZh: '母亲的同理心与无私对领导力有多重要？',
      tags: ['社交情商'],
      scaleLabels: {
        minEn: 'Not important at all',
        minZh: '完全不重要',
        maxEn: 'Extremely important',
        maxZh: '非常重要'
      }
    },
    
    {
      id: 42,
      type: 'scale-question',
      textEn: 'How important are mothers’ resilience and perseverance in leadership?',
      textZh: '母亲的韧性和毅力对领导力有多重要？',
      tags: ['核心耐力'],
      scaleLabels: {
        minEn: 'Not important at all',
        minZh: '完全不重要',
        maxEn: 'Extremely important',
        maxZh: '非常重要'
      }
    },
    
    {
      id: 43,
      type: 'scale-question',
      textEn: 'How important are mothers’ communication and listening in leadership?',
      textZh: '母亲的沟通与倾听能力对领导力有多重要？',
      tags: ['社交情商'],
      scaleLabels: {
        minEn: 'Not important at all',
        minZh: '完全不重要',
        maxEn: 'Extremely important',
        maxZh: '非常重要'
      }
    },
    
    {
      id: 44,
      type: 'scale-question',
      textEn: 'How important are mothers’ responsibility and accountability in leadership?',
      textZh: '母亲的责任感和担当对工作有多重要？',
      tags: ['客观能力', '奉献精神'],
      scaleLabels: {
        minEn: 'Not important at all',
        minZh: '完全不重要',
        maxEn: 'Extremely important',
        maxZh: '非常重要'
      }
    },
    
    {
      id: 45,
      type: 'scale-question',
      textEn: 'Have you resolved challenges balancing leadership responsibilities with caregiving?',
      textZh: '您是否解决过平衡领导责任与照护他人之间的挑战？',
      tags: ['客观能力', '核心耐力'],
      scaleLabels: {
        minEn: 'Never',
        minZh: '从未',
        maxEn: 'Yes, frequently',
        maxZh: '经常'
      }
    },
    
    {
      id: 46,
      type: 'scale-question',
      textEn: 'Has becoming a parent (or caregiver) influenced your leadership style?',
      textZh: '成为家长或照顾者对您的工作处事风格有多大影响？',
      tags: ['奉献精神'],
      scaleLabels: {
        minEn: 'No influence',
        minZh: '无影响',
        maxEn: 'Significantly changed it for the better',
        maxZh: '显著地使之更好'
      }
    },
    
    {
      id: 47,
      type: 'scale-question',
      textEn: 'How does motherhood impact leadership effectiveness in the workplace?',
      textZh: '母亲身份如何影响职场中的领导效果？',
      tags: ['奉献精神'],
      scaleLabels: {
        minEn: 'Negatively',
        minZh: '负面影响',
        maxEn: 'Positively',
        maxZh: '正面影响'
      }
    },
    
    {
      id: 48,
      type: 'scale-question',
      textEn: 'How does your company integrate mothers’ leadership qualities into its pipeline?',
      textZh: '您所在的公司如何在建设中包括母亲的领导力特质？',
      tags: ['奉献精神'],
      scaleLabels: {
        minEn: 'Poorly',
        minZh: '做得不好',
        maxEn: 'Very well',
        maxZh: '做得很好'
      }
    },
    
    {
      id: 49,
      type: 'scale-question',
      textEn: 'Do you pay attention to the emotional well-being of working mothers?',
      textZh: '您是否关注职场母亲的情绪状态？',
      tags: ['社交情商'],
      scaleLabels: {
        minEn: 'Not at all – I don’t pay attention to this',
        minZh: '完全不关注',
        maxEn: 'Very much – I actively offer support',
        maxZh: '非常关注 – 主动提供支持'
      }
    },
    
    {
      id: 50,
      type: 'scale-question',
      textEn: 'Do you recognize when a mother employee experiences emotional difficulties?',
      textZh: '您是否能识别职场母亲情绪方面的困难？',
      tags: ['奉献精神', '情绪调节'],
      scaleLabels: {
        minEn: 'Not equipped at all – I never consider this',
        minZh: '完全无准备 – 从未考虑',
        maxEn: 'Very equipped – I can identify and address it appropriately',
        maxZh: '准备充分 – 能识别并妥善处理'
      }
    },
    
    {
      id: 51,
      type: 'scale-question',
      textEn: 'Does your mother’s role influence your understanding of leadership in childhood?',
      textZh: '您的母亲是否影响了您童年时期对领导力的认知？',
      tags: ['自我意识'],
      scaleLabels: {
        minEn: 'Not at all',
        minZh: '完全没有',
        maxEn: 'Very strongly',
        maxZh: '非常强烈'
      }
    },
    
    {
      id: 52,
      type: 'text-input',
      textEn: 'How many children do you have or are expecting to have?',
      textZh: '您有或预计有多少个孩子？'
    },
    
    {
      id: 53,
      type: 'multi-select',
      textEn: 'During which weeks of your pregnancy did you experience noticeable morning sickness? (Select all that apply)',
      textZh: '在怀孕的哪些周数期间，您经历了明显的妊娠反应？（可多选）',
      options: [
        { id: 'A', textEn: 'I did not experience noticeable morning sickness', textZh: '我没有经历明显的妊娠反应' },
        { id: 'B', textEn: 'Weeks 4–8', textZh: '第4至第8周' },
        { id: 'C', textEn: 'Weeks 9-12', textZh: '第9至第12周' },
        { id: 'D', textEn: 'Weeks 13-20', textZh: '第13至第20周' },
        { id: 'E', textEn: 'Weeks 21-28', textZh: '第21至第28周' },
        { id: 'F', textEn: 'Weeks 29-36', textZh: '第29至第36周' },
        { id: 'G', textEn: 'Weeks 37-40', textZh: '第37至第40周' },
        { id: 'H', textEn: 'I can\'t remember', textZh: '我记不清了' }
      ],
      independentSelect: ['A']
    },
    
    {
      id: 54,
      type: 'text-input',
      textEn: 'What was your youngest child’s birth weight?',
      textZh: '您最小胎宝宝的出生体重是多少？'
    },
    
    {
      id: 55,
      type: 'multiple-choice',
      textEn: 'How long was your maternity leave? (If applicable)',
      textZh: '您的产假有多长时间？（如有的话）',
      options: [
        { id: 'A', textEn: '<8 weeks', textZh: '少于8周' },
        { id: 'B', textEn: '8–14 weeks', textZh: '8–14周' },
        { id: 'C', textEn: '15–26 weeks', textZh: '15–26周' },
        { id: 'D', textEn: '27–52 weeks', textZh: '27–52周' },
        { id: 'E', textEn: '>1 year', textZh: '超过1年' }
      ]
    },
    
    {
      id: 56,
      type: 'multiple-choice',
      textEn: 'Did you receive postpartum care services?',
      textZh: '您是否接受了产后护理或入住了月子中心？',
      options: [
        { id: 'A', textEn: 'No', textZh: '否' },
        { id: 'E', textEn: 'Yes', textZh: '是' }
      ]
    },
    
    {
      id: 57,
      type: 'text-input',
      textEn: 'Postpartum emotion in one word',
      textZh: '一个词形容您的产后状态'
    },
    
    {
      id: 58,
      type: 'text-input',
      textEn: 'Motherhood experience in one word',
      textZh: '一个词形容您作为母亲的状态'
    },
    
    {
      id: 59,
      type: 'scale-question',
      textEn: 'How involved are you with your previous social life from work?',
      textZh: '自己与以往工作的社交联系程度如何？',
      textLifeEn: 'How involved are you with your previous social life?',
      textLifeZh: '自己与以往的社交联系程度如何？',
      tags: ['社交情商'],
      scaleLabels: {
        minEn: 'Not involved at all',
        minZh: '完全不参与',
        maxEn: 'Very involved',
        maxZh: '非常投入'
      }
    },
    
    {
      id: 60,
      type: 'scale-question',
      textEn: 'How well does your work arrangement support your needs?',
      textZh: '您的工作安排对您有多大支持作用？',
      textLifeEn: 'How well does your life arrangement support your needs?',
      textLifeZh: '您的生活安排对您有多大支持作用？',
      scaleLabels: {
        minEn: 'Not supportive at all',
        minZh: '完全不支持',
        maxEn: 'Extremely supportive',
        maxZh: '非常支持'
      }
    },
    
    {
      id: 61,
      type: 'scale-question',
      textEn: 'How connected are you to your professional identity?',
      textZh: '您对自己的职业身份感有多强？',
      textLifeEn: 'How connected are you to your personal identity?',
      textLifeZh: '您对自己的个人身份感有多强？',
      tags: ['自我意识'],
      scaleLabels: {
        minEn: 'Not connected – motherhood is full priority',
        minZh: '完全不强 – 母亲角色优先',
        maxEn: 'Very connected – profession is important',
        maxZh: '非常强 – 职业身份很重要'
      }
    },
    
    {
      id: 62,
      type: 'scale-question',
      textEn: 'How has motherhood impacted your career progression?',
      textZh: '母亲身份对您的职业发展或晋升机会有何影响？',
      textLifeEn: 'How has motherhood impacted your personal development?',
      textLifeZh: '母亲身份对您的个人发展有何影响？',
      scaleLabels: {
        minEn: 'Very negative – significantly hindered',
        minZh: '非常负面 – 明显阻碍',
        maxEn: 'Very positive – enhanced opportunities',
        maxZh: '非常积极 – 提升机会'
      }
    },
    
    {
      id: 63,
      type: 'scale-question',
      textEn: 'How is your work-life balance supported by your company?',
      textZh: '您的工作与生活平衡如何被贵司支持？',
      textLifeEn: 'How is your life balance supported by your community?',
      textLifeZh: '您的生活平衡如何被社区支持？',
      tags: ['自我意识'],
      scaleLabels: {
        minEn: 'Not capable of being supported',
        minZh: '完全不能被支持',
        maxEn: 'Extremely supported',
        maxZh: '非常能被支持'
      }
    },
    
    {
      id: 64,
      type: 'scale-question',
      textEn: 'How has motherhood influenced your leadership style?',
      textZh: '成为母亲如何影响您的领导风格？',
      tags: ['情绪调节'],
      scaleLabels: {
        minEn: 'Negative',
        minZh: '消极影响',
        maxEn: 'Positive',
        maxZh: '积极影响'
      }
    },
    
    {
      id: 65,
      type: 'scale-question',
      textEn: 'How has motherhood influenced your resilience against stress?',
      textZh: '成为母亲如何影响您的抗压能力？',
      tags: ['核心耐力', '情绪调节'],
      scaleLabels: {
        minEn: 'Much less – harder to manage stress now',
        minZh: '更难应对压力',
        maxEn: 'Much more – strengthened my resilience',
        maxZh: '增强了我的韧性'
      }
    },
    
    {
      id: 66,
      type: 'scale-question',
      textEn: 'How motivated do you feel to pursue career growth?',
      textZh: '您职业发展的动力有多强？',
      textLifeEn: 'How motivated do you feel to pursue personal growth?',
      textLifeZh: '您个人发展的动力有多强？',
      tags: ['核心耐力'],
      scaleLabels: {
        minEn: 'Not motivated at all',
        minZh: '完全没有',
        maxEn: 'Very motivated',
        maxZh: '非常强'
      }
    },
    
    {
      id: 67,
      type: 'scale-question',
      textEn: 'How satisfied are you with your work-life balance?',
      textZh: '您对您的工作与生活平衡满意吗？',
      textLifeEn: 'How satisfied are you with your life balance?',
      textLifeZh: '您对您的生活平衡满意吗？',
      tags: ['自我意识'],
      scaleLabels: {
        minEn: 'Very dissatisfied',
        minZh: '非常不满意',
        maxEn: 'Very satisfied',
        maxZh: '非常满意'
      }
    },
    
    {
      id: 68,
      type: 'scale-question',
      textEn: 'Are your needs as a mother taken into account during workplace decisions?',
      textZh: '您作为母亲的需求是否在职场决策中被考虑到？',
      textLifeEn: 'Are your needs as a mother taken into account during community decisions?',
      textLifeZh: '您作为母亲的需求是否在社区决策中被考虑到？',
      tags: ['自我意识'],
      scaleLabels: {
        minEn: 'Never – completely overlooked',
        minZh: '从未 – 完全未被考虑',
        maxEn: 'Always – consistently considered',
        maxZh: '总是 – 经常被考虑'
      }
    },
    
    {
      id: 69,
      type: 'scale-question',
      textEn: 'How connected do you feel with other mothers through your work?',
      textZh: '您在工作中与其他母亲的联系如何？',
      textLifeEn: 'How connected do you feel with other mothers through your life?',
      textLifeZh: '您在生活与其他母亲的联系如何？',
      tags: ['社交情商'],
      scaleLabels: {
        minEn: 'Very disconnected — no connection',
        minZh: '完全没有联系',
        maxEn: 'Very connected – strong networks',
        maxZh: '联系紧密 – 有很强的网络'
      }
    },
    
    {
      id: 70,
      type: 'scale-question',
      textEn: 'Do you want to connect with other mothers through your profession?',
      textZh: '您是否想在工作中与其他职场母亲建立联系？',
      textLifeEn: 'Do you want to connect with other mothers through your lifestyle?',
      textLifeZh: '您是否想在生活与其他母亲建立联系？',
      tags: ['社交情商'],
      scaleLabels: {
        minEn: 'Never',
        minZh: '从不',
        maxEn: 'Always',
        maxZh: '经常'
      }
    },
    
    {
      id: 71,
      type: 'scale-question',
      textEn: 'How valuable is showcasing your previous work?',
      textZh: '展示您以往的工作有多大价值？',
      tags: ['自我意识'],
      scaleLabels: {
        minEn: 'Not valuable at all',
        minZh: '毫无价值',
        maxEn: 'Extremely valuable',
        maxZh: '极具价值'
      }
    },
    
    {
      id: 72,
      type: 'scale-question',
      textEn: 'How helpful is cognitive ability to enhance your problem-solving abilities?',
      textZh: '更强的认知能力对于提升您的解决问题能力有多大帮助？',
      tags: ['客观能力'],
      scaleLabels: {
        minEn: 'Not helpful at all',
        minZh: '完全无帮助',
        maxEn: 'Extremely helpful',
        maxZh: '非常有帮助'
      }
    },
    
    {
      id: 73,
      type: 'scale-question',
      textEn: 'Are you prepared for motherhood beforehand?',
      textZh: '您成为母亲前心理准备如何？',
      tags: ['核心耐力'],
      scaleLabels: {
        minEn: 'Not prepared at all',
        minZh: '完全没有准备',
        maxEn: 'Very prepared',
        maxZh: '准备非常充分'
      }
    },
    
    {
      id: 74,
      type: 'scale-question',
      textEn: 'Did motherhood change your personal values?',
      textZh: '母亲身份是否改变了个人价值？',
      tags: ['自我意识'],
      scaleLabels: {
        minEn: 'No change',
        minZh: '没有改变',
        maxEn: 'Completely',
        maxZh: '完全改变'
      }
    },
    
    {
      id: 75,
      type: 'scale-question',
      textEn: 'Does your family or community support you in motherhood?',
      textZh: '在成为母亲的过程中，家人或社群对您支持吗？',
      tags: ['社交情商'],
      scaleLabels: {
        minEn: 'Not supported at all',
        minZh: '完全没有支持',
        maxEn: 'Extremely supported',
        maxZh: '非常支持'
      }
    },
    
    {
      id: 76,
      type: 'scale-question',
      textEn: 'Did motherhood bring emotional fulfillment to your life?',
      textZh: '母亲身份是否为您带来了情感满足？',
      tags: ['奉献精神'],
      scaleLabels: {
        minEn: 'No emotion at all',
        minZh: '完全没有支持',
        maxEn: 'Extremely fulfilling',
        maxZh: '非常满足'
      }
    },
    
    {
      id: 77,
      type: 'scale-question',
      textEn: 'Did motherhood make you more emotionally strong?',
      textZh: '母亲身份让你情绪上更坚强了吗？',
      tags: ['情绪调节', '核心耐力'],
      scaleLabels: {
        minEn: 'Much weaker',
        minZh: '明显减弱',
        maxEn: 'Much stronger',
        maxZh: '显著增强'
      }
    },
    
    {
      id: 78,
      type: 'scale-question',
      textEn: 'Did motherhood change your ability to set boundaries?',
      textZh: '母亲身份是否影响了您设定边界的能力？',
      tags: ['自我意识'],
      scaleLabels: {
        minEn: 'Significantly weakened',
        minZh: '显著减弱',
        maxEn: 'Improved greatly',
        maxZh: '显著提升'
      }
    },
    
    {
      id: 79,
      type: 'scale-question',
      textEn: 'Do you feel pressured to meet external expectations of motherhood?',
      textZh: '您是否感受到外界对母亲身份的期待压力？',
      tags: ['自我意识'],
      scaleLabels: {
        minEn: 'Never',
        minZh: '从不',
        maxEn: 'Always',
        maxZh: '总是'
      }
    },
    
    {
      id: 80,
      type: 'scale-question',
      textEn: 'Are you satisfied with the balance between mother and self?',
      textZh: '您对母亲身份与自我之间的平衡是否满意？',
      tags: ['自我意识'],
      scaleLabels: {
        minEn: 'Very dissatisfied',
        minZh: '非常不满意',
        maxEn: 'Very satisfied',
        maxZh: '非常满意'
      }
    },
    
    {
      id: 81,
      type: 'scale-question',
      textEn: 'Does your company foster professional growth and well-being?',
      textZh: '贵司是否同时重视职业发展和身心健康？',
      textLifeEn: 'Does your team support both professional growth and overall well-being?',
      textLifeZh: '您的团队是否支持职业发展和身心健康？',
      tags: ['自我意识'],
      scaleLabels: {
        minEn: 'Not supportive at all',
        minZh: '完全不重视',
        maxEn: 'Very supportive',
        maxZh: '非常重视'
      }
    },
    
    {
      id: 82,
      type: 'scale-question',
      textEn: 'Do you build meaningful relationships through work?',
      textZh: '您在工作中是否有建立有意义的关系的机会？',
      textLifeEn: 'Do you build meaningful relationships through teamwork?',
      textLifeZh: '您在团队工作中是否有建立有意义的关系的机会？',
      tags: ['社交情商'],
      scaleLabels: {
        minEn: 'None – mostly isolated interactions',
        minZh: '没有 – 多为孤立互动',
        maxEn: 'A lot – strong connections',
        maxZh: '很多 – 多为良好关系'
      }
    },
    
    {
      id: 83,
      type: 'scale-question',
      textEn: 'Do you experience acts of kindness in work?',
      textZh: '您在工作中是否感受到他人的善意之举？',
      tags: ['奉献精神'],
      scaleLabels: {
        minEn: 'Never',
        minZh: '从未',
        maxEn: 'Very frequently',
        maxZh: '非常频繁'
      }
    },
    
    {
      id: 84,
      type: 'scale-question',
      textEn: 'Do you support or care for colleagues?',
      textZh: '您是否会给予同事支持或关心？',
      textLifeEn: 'Do you support or care for teammates?',
      textLifeZh: '您是否会给予团队成员支持或关心？',
      tags: ['奉献精神'],
      scaleLabels: {
        minEn: 'Do not engage in offering support',
        minZh: '基本不提供支持',
        maxEn: 'Frequently offer support',
        maxZh: '经常主动给予支持'
      }
    },
    
    {
      id: 85,
      type: 'scale-question',
      textEn: 'Do you feel recognized and valued by your team?',
      textZh: '您是否在团队中感觉到被认可？',
      tags: ['自我意识'],
      scaleLabels: {
        minEn: 'Never',
        minZh: '几乎从未被认可',
        maxEn: 'Always',
        maxZh: '总是被认可'
      }
    },
    
    {
      id: 86,
      type: 'scale-question',
      textEn: 'Does your company promote collaboration based on trust and respect?',
      textZh: '贵司是否鼓励基于信任与相互尊重的合作？',
      textLifeEn: 'Does your team promote collaboration based on trust and respect?',
      textLifeZh: '您的团队是否鼓励基于信任与相互尊重的合作？',
      tags: ['客观能力', '奉献精神'],
      scaleLabels: {
        minEn: 'Does not at all',
        minZh: '几乎没有',
        maxEn: 'Strongly across all levels',
        maxZh: '在所有层面都出色'
      }
    },
    
    {
      id: 87,
      type: 'scale-question',
      textEn: 'Could you reach out to colleagues or managers when facing challenges?',
      textZh: '面对困难或需要帮助时，您能否与同事或上级沟通？',
      textLifeEn: 'Could you reach out to teammates when facing challenges?',
      textLifeZh: '面对困难或需要帮助时，您能否与团队成员沟通？',
      tags: ['社交情商', '情绪调节'],
      scaleLabels: {
        minEn: 'Very uncomfortable',
        minZh: '很不愿意',
        maxEn: 'Very comfortable',
        maxZh: '非常自然'
      }
    },
    
    {
      id: 88,
      type: 'scale-question',
      textEn: 'Is a people-centered work culture important?',
      textZh: '以人为本的企业文化是否重要？',
      textLifeEn: 'Is a people-centered team culture important?',
      textLifeZh: '以人为本的工作团队文化是否重要？',
      tags: ['社交情商'],
      scaleLabels: {
        minEn: 'Not important at all',
        minZh: '几乎不重要',
        maxEn: 'Extremely important',
        maxZh: '非常重要'
      }
    },
    
    {
      id: 89,
      type: 'scale-question',
      textEn: 'Do you feel motivated by a sense of belonging or team care?',
      textZh: '您是否因团队归属感或同事关怀提升工作积极性？',
      textLifeEn: 'Do you feel motivated by a sense of belonging or team care?',
      textLifeZh: '您是否因团队归属感或团队成员关怀提升工作积极性？',
      tags: ['情绪调节'],
      scaleLabels: {
        minEn: 'Never',
        minZh: '从未',
        maxEn: 'Very often',
        maxZh: '经常'
      }
    },
  ];