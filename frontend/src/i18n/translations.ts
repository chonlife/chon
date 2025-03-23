type Languages = 'en' | 'zh';

interface Translation {
  navigation: {
    home: string;
    personalityTest: string;
    contact: string;
    login: string;
  };
  home: {
    motherhood: {
      title: string;
      asset: string;
      carbonBasedLives: string;
      paragraph: string;
    };
    empowerment: {
      dontEmpower: string;
      corporateWorld: string;
      love: string;
      paragraph: string;
    };
    about: {
      weAre: string;
      paragraph: string;
      percentage: string;
    };
    cta: string;
  };
  intro: {
    question: string;
    yes: string;
    no: string;
    agree: string;
    disagree: string;
    progressDescription: string;
    beginTest: string;
  };
  personalityTest: {
    title: string;
    description: string;
    content: string;
    identity: {
      title: string;
      mother: string;
      corporate: string;
      both: string;
      other: string;
    };
  };
  contact: {
    title: string;
    description: string;
    form: {
      name: string;
      email: string;
      message: string;
      send: string;
    };
    prototype: {
      text: string;
    };
    expertise: {
      text: string;
    };
    skills: {
      text: string;
    };
    buttons: {
      fund: string;
      join: string;
      collaborate: string;
    };
  };
  login: {
    title: string;
    comingSoon: string;
  };
}

export type TranslationsType = Record<Languages, Translation>;

const translations: TranslationsType = {
  en: {
    navigation: {
      home: 'HOME',
      personalityTest: 'PERSONALITY TEST',
      contact: 'CONTACT US',
      login: 'LOGIN',
    },
    home: {
      motherhood: {
        title: 'MOTHERHOOD',
        asset: 'ASSET',
        carbonBasedLives: 'ALL CARBON-BASED LIVES',
        paragraph: 'We aim to recognize and transform <strong>MOTHERHOOD</strong> as an <strong>ASSET</strong> for corporation to build a more humanitarian corporate environment for <strong>ALL CARBON-BASED LIVES</strong>.',
      },
      empowerment: {
        dontEmpower: 'We don\'t empower mothers.',
        corporateWorld: 'CORPORATE WORLD',
        love: 'LOVE',
        paragraph: 'We empower the <strong>CORPORATE WORLD</strong> to embrace the presence of motherhood with scientific and effective strategies to build a world with more <strong>LOVE</strong> for all lives that have a mother.',
      },
      about: {
        weAre: 'We are <strong>CHON</strong>',
        paragraph: 'derived from Carbon (C), Hydrogen (H), Oxygen (O), and Nitrogen (N), the four elements that make up <strong>95%</strong> of the human body.',
        percentage: '95%'
      },
      cta: 'I\'M A CARBON-BASED LIFE →',
    },
    intro: {
      question: '<span style="color: #F0BDC0">Mothers</span> are natural leaders.',
      yes: 'YES',
      no: 'NO',
      agree: 'Agree',
      disagree: 'Disagree',
      progressDescription: 'This represents the percentage of people who agree versus disagree with this statement.',
      beginTest: 'BEGIN MY CHON PERSONALITY TEST →',
    },
    personalityTest: {
      title: 'Personality Test',
      description: 'Coming soon: Discover how you can contribute to a more inclusive corporate environment for mothers.',
      content: 'Our test is being developed to help corporations understand how to better integrate mothers into the workplace.',
      identity: {
        title: 'I AM',
        mother: 'MOTHER',
        corporate: 'Senior manager, director, vice president,\npartner, managing director, president,\nC-suite executives, Board of Directors, Founders, etc.',
        both: 'MOTHER + CORPORATE LEADER',
        other: 'Not a robot and not yet one of the above'
      }
    },
    contact: {
      title: 'Contact Us',
      description: 'Interested in creating a more inclusive environment for mothers in your corporation?',
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        send: 'Send Message',
      },
      prototype: {
        text: "As we focus on developing our prototype, we are not actively seeking outside funding at this time. If you are interested in funding our venture or business collaborations, please select the appropriate form below, and we will reach out when the time is appropriate."
      },
      expertise: {
        text: "We are actively looking for individuals who share a love for humankind and possess specialized expertise in computer science, including software engineering, natural language processing, and machine learning."
      },
      skills: {
        text: "Additionally, we welcome those with strong visuospatial and abstract logical thinking skills, whether it's group theory, topology, abstract algebra, LEGO or Rubik's Cube."
      },
      buttons: {
        fund: "FUND →",
        join: "JOIN →",
        collaborate: "COLLABORATE →"
      }
    },
    login: {
      title: 'Login',
      comingSoon: 'Login page coming soon...',
    },
  },
  zh: {
    navigation: {
      home: '首页',
      personalityTest: '性格测试',
      contact: '联系我们',
      login: '登录',
    },
    home: {
      motherhood: {
        title: '母亲这一身份',
        asset: '资产',
        carbonBasedLives: '所有碳基生命',
        paragraph: '我们的目标是认识并转变<strong>母亲这一身份</strong>为企业的一项<strong>资产</strong>，从而为<strong>所有碳基生命</strong>营造更人性化的企业环境。',
      },
      empowerment: {
        dontEmpower: '我们不赋能母亲。',
        corporateWorld: '企业界',
        love: '爱',
        paragraph: '我们赋能<strong>企业界</strong>，以科学和高效的策略拥抱母亲的力量，为所有有母亲的生命建立一个更有<strong>爱</strong>的世界。',
      },
      about: {
        weAre: '我们是<strong>CHON</strong>',
        paragraph: '源于碳(C)、氢(H)、氧(O)、和氮(N)，占据人体<strong>95%</strong>的这四种元素。',
        percentage: '95%'
      },
      cta: '我是碳基生命 →',
    },
    intro: {
      question: '<span style="color: #F0BDC0">母亲</span>是天生的领导者。',
      yes: '是',
      no: '否',
      agree: '同意',
      disagree: '不同意',
      progressDescription: '这表示同意与不同意该说法的人群比例。',
      beginTest: '开始我的CHON性格测试 →',
    },
    personalityTest: {
      title: '性格测试',
      description: '即将推出：探索如何为母亲创造更包容的企业环境。',
      content: '我们正在开发测试，帮助企业更好地理解如何将母亲融入工作场所。',
      identity: {
        title: '我是',
        mother: '母亲',
        corporate: '高级经理、总监、副总经理、\n合伙人、董事总经理、总裁、\nC级行政主管、董事会成员、企业创始人等',
        both: '母亲 + 企业领导者',
        other: '不是机器人及上述人员'
      }
    },
    contact: {
      title: '联系我们',
      description: '有兴趣在您的企业中为母亲创造更包容的环境吗？',
      form: {
        name: '姓名',
        email: '邮箱',
        message: '留言',
        send: '发送消息',
      },
      prototype: {
        text: "由于我们专注于开发产品模型，目前我们并不主动寻找外部融资。如果您有兴趣投资我们或者对业务合作感兴趣，请选择下面相应的选项，我们将在合适的时候与您联系。"
      },
      expertise: {
        text: "我们正在积极寻找热爱人类并拥有计算机科学专业知识——包括软件开发、自然语言处理和机器学习——的人加入我们的团队。"
      },
      skills: {
        text: "此外，我们也欢迎那些具有很强的视觉空间和抽象逻辑思维能力的人才，不论是群论、拓扑学、抽象代数、乐高还是魔方。"
      },
      buttons: {
        fund: "投资 →",
        join: "加入 →",
        collaborate: "合作 →"
      }
    },
    login: {
      title: '登录',
      comingSoon: '登录页面即将上线...',
    },
  },
};

export default translations; 