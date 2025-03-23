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
      question: '<span class="highlight">Mothers</span> are natural leaders.',
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
      question: '<span class="highlight">母亲</span>是天生的领导者。',
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
    },
    login: {
      title: '登录',
      comingSoon: '登录页面即将上线...',
    },
  },
};

export default translations; 