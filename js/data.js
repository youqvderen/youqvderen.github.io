const quizConfig = {
    title: "发现你的真实人格",
    subtitle: "基于心理学研究的趣味性格测试",
    icon: "🎯",
    
    dimensions: {
        E: { name: '外向性', color: '#6366f1', desc: '从外部世界获取能量' },
        I: { name: '内向性', color: '#8b5cf6', desc: '从内心世界获取能量' },
        S: { name: '实感型', color: '#10b981', desc: '关注具体事实和细节' },
        N: { name: '直觉型', color: '#f59e0b', desc: '关注模式和可能性' },
        T: { name: '思考型', color: '#3b82f6', desc: '基于逻辑客观决策' },
        F: { name: '情感型', color: '#ec4899', desc: '基于价值观和感受决策' },
        J: { name: '判断型', color: '#14b8a6', desc: '喜欢计划和结构' },
        P: { name: '知觉型', color: '#f97316', desc: '喜欢灵活和开放' }
    },

    questions: [
        {
            text: "周末到了，你更倾向于如何度过？",
            options: [
                { text: "和朋友们聚会，去热闹的地方", scores: { E: 3, I: 0 } },
                { text: "在家看书或看电影，享受独处", scores: { E: 0, I: 3 } },
                { text: "偶尔出门，但更喜欢小圈子", scores: { E: 1, I: 2 } },
                { text: "取决于当时的心情", scores: { E: 2, I: 1 } }
            ]
        },
        {
            text: "面对一个新的项目，你通常会？",
            options: [
                { text: "先制定详细计划和步骤", scores: { J: 3, P: 0 } },
                { text: "边做边看，灵活调整", scores: { J: 0, P: 3 } },
                { text: "有个大致方向就开始", scores: { J: 1, P: 2 } },
                { text: "找相关资料研究透彻再动手", scores: { J: 2, P: 1 } }
            ]
        },
        {
            text: "你更信任哪种信息？",
            options: [
                { text: "具体的事实和数据", scores: { S: 3, N: 0 } },
                { text: "直觉和第六感", scores: { S: 0, N: 3 } },
                { text: "经验证的理论", scores: { S: 2, N: 1 } },
                { text: "创新的想法和可能性", scores: { S: 1, N: 2 } }
            ]
        },
        {
            text: "做决策时，你更重视？",
            options: [
                { text: "逻辑和客观分析", scores: { T: 3, F: 0 } },
                { text: "他人的感受和和谐", scores: { T: 0, F: 3 } },
                { text: "公平和原则", scores: { T: 2, F: 1 } },
                { text: "价值观和意义", scores: { T: 1, F: 2 } }
            ]
        },
        {
            text: "在社交场合中，你通常？",
            options: [
                { text: "主动与陌生人交谈", scores: { E: 3, I: 0 } },
                { text: "等待别人来找你", scores: { E: 0, I: 3 } },
                { text: "和熟悉的朋友在一起", scores: { E: 1, I: 2 } },
                { text: "观察周围的人和事", scores: { E: 2, I: 1 } }
            ]
        },
        {
            text: "你更喜欢的工作方式是？",
            options: [
                { text: "按部就班，有明确流程", scores: { J: 3, P: 0 } },
                { text: "自由灵活，随机应变", scores: { J: 0, P: 3 } },
                { text: "有截止日期但过程自由", scores: { J: 2, P: 1 } },
                { text: "有框架但允许创新", scores: { J: 1, P: 2 } }
            ]
        },
        {
            text: "你更关注？",
            options: [
                { text: "当下的现实和细节", scores: { S: 3, N: 0 } },
                { text: "未来的可能性和大局", scores: { S: 0, N: 3 } },
                { text: "过去的经验和教训", scores: { S: 2, N: 1 } },
                { text: "潜在的机会和趋势", scores: { S: 1, N: 2 } }
            ]
        },
        {
            text: "朋友遇到困难时，你会？",
            options: [
                { text: "帮他分析问题找解决方案", scores: { T: 3, F: 0 } },
                { text: "先倾听和安慰他的情绪", scores: { T: 0, F: 3 } },
                { text: "提供实际的帮助", scores: { T: 2, F: 1 } },
                { text: "陪伴他度过难关", scores: { T: 1, F: 2 } }
            ]
        },
        {
            text: "你的能量主要来自？",
            options: [
                { text: "与他人互动和交流", scores: { E: 3, I: 0 } },
                { text: "独处和反思", scores: { E: 0, I: 3 } },
                { text: "完成有挑战的任务", scores: { E: 2, I: 1 } },
                { text: "创造性的活动", scores: { E: 1, I: 2 } }
            ]
        },
        {
            text: "对于日程安排，你倾向于？",
            options: [
                { text: "提前规划好每一天", scores: { J: 3, P: 0 } },
                { text: "随性而为，看心情", scores: { J: 0, P: 3 } },
                { text: "重要事项固定，其他灵活", scores: { J: 2, P: 1 } },
                { text: "有清单但不严格遵循", scores: { J: 1, P: 2 } }
            ]
        },
        {
            text: "学习新事物时，你更喜欢？",
            options: [
                { text: "实用的技能和知识", scores: { S: 3, N: 0 } },
                { text: "抽象的理论和概念", scores: { S: 0, N: 3 } },
                { text: "通过实践来学习", scores: { S: 2, N: 1 } },
                { text: "探索背后的原理", scores: { S: 1, N: 2 } }
            ]
        },
        {
            text: "在团队中，你通常扮演？",
            options: [
                { text: "理性的分析者", scores: { T: 3, F: 0 } },
                { text: "团队的协调者", scores: { T: 0, F: 3 } },
                { text: "执行者", scores: { T: 2, F: 1 } },
                { text: "创意的提供者", scores: { T: 1, F: 2 } }
            ]
        }
    ],

    results: {
        'ESTJ': {
            title: '总经理型',
            icon: '👔',
            desc: '你是天生的管理者，注重效率和结果。你务实、果断，善于组织资源和人员达成目标。你的可靠和责任感让团队信任你，但记得偶尔也要放松，接纳不同的工作方式。',
            tags: ['高效', '务实', '可靠']
        },
        'ESFJ': {
            title: '执政官型',
            icon: '🤝',
            desc: '你是温暖友善的协调者，重视和谐与人际关系。你乐于助人，善于照顾他人感受，是朋友圈里的"知心大哥/大姐"。你的同理心让你受欢迎，但也要学会设立边界。',
            tags: ['热心', '体贴', '受欢迎']
        },
        'ISTJ': {
            title: '物流师型',
            icon: '📋',
            desc: '你是严谨可靠的执行者，重视传统和秩序。你做事有条理，注重细节和准确性，是值得信赖的伙伴。你的责任心强，但偶尔也要尝试跳出舒适区，接受新的可能性。',
            tags: ['严谨', '负责', '传统']
        },
        'ISFJ': {
            title: '守卫者型',
            icon: '🛡️',
            desc: '你是安静专注的守护者，默默付出，关心他人。你有很强的记忆力，重视承诺和责任。你的体贴让人温暖，但不要忽视自己的需求，学会为自己发声。',
            tags: ['守护', '专注', '温暖']
        },
        'ENTJ': {
            title: '指挥官型',
            icon: '👑',
            desc: '你是天生的领导者，充满魅力和自信。你善于制定战略，推动变革，追求卓越。你的远见和决断力让人佩服，但要注意倾听他人意见，培养耐心。',
            tags: ['领导', '战略', '魅力']
        },
        'ENTP': {
            title: '辩论家型',
            icon: '⚡',
            desc: '你是机智创新的思想家，喜欢挑战和辩论。你思维敏捷，充满好奇心，总能提出新颖的观点。你的创造力无穷，但要学会专注，把想法付诸实践。',
            tags: ['创新', '机智', '好奇']
        },
        'INTJ': {
            title: '建筑师型',
            icon: '🧠',
            desc: '你是独立思考的战略家，追求完美和知识。你有长远的规划能力，善于解决复杂问题。你的洞察力深刻，但要记得情感也是生活的重要部分。',
            tags: ['战略', '独立', '完美']
        },
        'INTP': {
            title: '逻辑学家型',
            icon: '🔬',
            desc: '你是好奇的分析师，热爱理论和逻辑。你追求真理，喜欢探索事物本质。你的客观理性令人钦佩，但偶尔也要关注现实应用和人际互动。',
            tags: ['逻辑', '分析', '真理']
        }
    },

    hiddenTypes: {
        'XXXX': {
            title: '天选之人',
            icon: '👾',
            desc: '你打破了所有常规！这种极其罕见的结果说明你拥有独特的平衡能力，能在各种极端之间自由切换。你是不被定义的存在，拥有无限可能。',
            condition: 'allEqual',
            priority: 100
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = quizConfig;
}
