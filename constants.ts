
import { User, RoleDefinition, RoleType, AIApp, AppType, Transaction, Product, KnowledgeItem, SystemPermission, SettlementRecord, Task, SubscriptionRequest, AppUsageRecord, Institution, ServiceProvider } from './types';

export const SYSTEM_PERMISSIONS: {id: SystemPermission, label: string}[] = [
  { id: 'MANAGE_ACCOUNT', label: '账号管理' },
  { id: 'VIEW_FINANCE', label: '财务查看' },
  { id: 'MANAGE_DATA', label: '数据维护' },
  { id: 'VIEW_DATA', label: '数据浏览' },
];

export const MOCK_ROLES: RoleDefinition[] = [
  {
    id: 'role-admin',
    name: '超级管理员',
    description: '拥有系统所有权限，可管理人员与财务。',
    type: RoleType.ADMIN,
    appIds: ['app-1', 'app-2', 'app-3', 'app-4'],
    permissions: ['MANAGE_ACCOUNT', 'VIEW_FINANCE', 'MANAGE_DATA', 'VIEW_DATA'],
  },
  {
    id: 'role-doctor',
    name: '咨询师',
    description: '负责客户美学设计、面诊咨询与项目规划。',
    type: RoleType.STAFF,
    appIds: ['app-1', 'app-2', 'app-3'], // Face scan + SCRM + 3D body
    permissions: ['VIEW_DATA'],
  },
  {
    id: 'role-individual',
    name: '个人账号',
    description: '个人执业者或独立用户。',
    type: RoleType.INDIVIDUAL,
    appIds: ['app-1'],
    permissions: ['VIEW_DATA', 'VIEW_FINANCE'],
  },
  {
    id: 'role-provider',
    name: '服务商',
    description: 'AI应用开发者与供应商，管理应用发布与收益。',
    type: RoleType.SERVICE_PROVIDER,
    appIds: [],
    permissions: ['VIEW_FINANCE'],
  },
  {
    id: 'role-platform',
    name: '美沃斯平台',
    description: '平台方管理员，负责应用审核与机构管理。',
    type: RoleType.PLATFORM_ADMIN,
    appIds: [],
    permissions: ['MANAGE_ACCOUNT', 'VIEW_FINANCE', 'MANAGE_DATA'],
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: '张总',
    phone: '13800000001',
    roleId: 'role-admin',
    avatar: 'https://picsum.photos/id/64/100/100',
    dataScope: 'ALL',
    extraAppIds: [],
    extraPermissions: [],
  },
  {
    id: 'u2',
    name: '李咨询',
    phone: '13800000002',
    roleId: 'role-doctor',
    avatar: 'https://picsum.photos/id/65/100/100',
    dataScope: 'ASSIGNED',
    extraAppIds: ['app-4'], // Supplement: Post-op care app
    extraPermissions: ['MANAGE_DATA'], 
  },
  {
    id: 'u4',
    name: '陈医生(个人)',
    phone: '13800000004',
    roleId: 'role-individual',
    avatar: 'https://picsum.photos/id/68/100/100',
    dataScope: 'ASSIGNED',
    extraAppIds: [],
    extraPermissions: [],
  },
  {
    id: 'u5',
    name: 'VideoAI 科技',
    phone: '13800000005',
    roleId: 'role-provider',
    avatar: 'https://picsum.photos/id/60/100/100',
    dataScope: 'ASSIGNED',
    extraAppIds: [],
    extraPermissions: [],
  },
  {
    id: 'u6',
    name: '美沃斯官方',
    phone: '13800000006',
    roleId: 'role-platform',
    avatar: 'https://picsum.photos/id/1011/100/100',
    dataScope: 'ALL',
    extraAppIds: [],
    extraPermissions: [],
  },
];

export const MOCK_INSTITUTIONS: Institution[] = [
    { id: 'inst-1', name: '成都华美紫馨医学美容医院', contactPerson: '王院长', phone: '13800138000', city: '成都', status: 'ACTIVE', joinDate: '2023-01-15' },
    { id: 'inst-2', name: '上海第九人民医院(整复外科)', contactPerson: '李主任', phone: '13911112222', city: '上海', status: 'ACTIVE', joinDate: '2023-03-22' },
    { id: 'inst-3', name: '北京丽都医疗美容医院', contactPerson: '张总', phone: '13788889999', city: '北京', status: 'PENDING', joinDate: '2023-10-25' },
    { id: 'inst-4', name: '深圳美莱医疗美容', contactPerson: '陈经理', phone: '13666667777', city: '深圳', status: 'ACTIVE', joinDate: '2023-05-10' },
];

export const MOCK_SERVICE_PROVIDERS: ServiceProvider[] = [
    { 
        id: 'sp-1', 
        name: 'VideoAI 科技', 
        contactPerson: '周杰', 
        phone: '18600001111', 
        email: 'contact@videoai.com',
        description: '专注于短视频内容生成的AI技术公司，服务超过500家MCN机构。',
        status: 'APPROVED',
        joinDate: '2023-09-01'
    },
    { 
        id: 'sp-2', 
        name: 'Crisalix', 
        contactPerson: 'David Lee', 
        phone: '13500002222', 
        email: 'support@crisalix.cn',
        description: '全球领先的3D医美模拟成像技术提供商。',
        status: 'APPROVED',
        joinDate: '2023-08-15'
    },
    { 
        id: 'sp-3', 
        name: 'EffiSchedule', 
        contactPerson: '刘敏', 
        phone: '13900003333', 
        email: 'hi@effischedule.io',
        description: '提供智能医疗排班解决方案，优化资源配置。',
        status: 'PENDING',
        joinDate: '2023-10-20'
    },
    { 
        id: 'sp-4', 
        name: 'CareAI Tech', 
        contactPerson: '张伟', 
        phone: '13700004444', 
        email: 'bd@careai.com',
        description: '专注于术后护理与并发症预警的大模型应用。',
        status: 'APPROVED',
        joinDate: '2023-09-10'
    }
];

export const MOCK_APPS: AIApp[] = [
  // 1. 获客引流
  {
    id: 'app-xhs',
    name: '小红书爆文生成器',
    description: '一键生成小红书风格的医美种草文案，支持多图自动配文。',
    fullDescription: '专为医美行业定制的内容生成引擎。深度学习百万篇小红书爆款笔记，精准把握"变美"、"避雷"、"测评"等流量密码。支持上传案例图自动生成对应风格的文案，内置违禁词检测，确保合规引流。',
    type: AppType.OFFICIAL,
    icon: 'megaphone',
    category: '获客引流',
    status: 'active',
    auditStatus: 'APPROVED',
    publishStatus: 'PUBLISHED',
    integrationType: 'API_EMBEDDED',
    rating: 4.7,
    provider: '美沃斯营销实验室',
    documentation: '<p>本产品支持<strong>一键生成</strong>小红书风格文案。</p><ul><li>上传图片自动分析</li><li>支持多种语气风格</li></ul>',
    attachments: ['使用手册_v1.0.pdf'],
    screenshots: ['https://picsum.photos/id/10/800/600', 'https://picsum.photos/id/11/800/600'],
    features: [
      { title: '风格迁移', description: '支持"干货科普"、"情感共鸣"等多种文案风格切换。' },
      { title: '热点追踪', description: '实时抓取医美行业热搜关键词，辅助选题。' }
    ],
    pricing: [
        { id: 'p0', name: '7天免费试用', type: 'TRIAL', model: 'SUBSCRIPTION', priceMonth: 0, features: ['全功能体验', '限时7天'] },
        { id: 'p1', name: '流量版', type: 'SUBSCRIPTION', model: 'SUBSCRIPTION', priceMonth: 199, priceYear: 1999, features: ['每日50篇文案'] }
    ],
    reviews: [],
    trialUsed: false
  },
  {
    id: 'app-video',
    name: '短视频脚本引擎',
    description: '针对抖音/快手平台的口播脚本创作，提升完播率。',
    fullDescription: '基于短视频黄金前3秒法则设计的脚本生成工具。提供"医生IP"、"探店体验"、"避雷科普"等多种模板。',
    type: AppType.THIRD_PARTY,
    icon: 'clapperboard',
    category: '获客引流',
    status: 'inactive',
    auditStatus: 'PENDING',
    publishStatus: 'UNPUBLISHED',
    integrationType: 'API_EMBEDDED',
    rating: 4.5,
    provider: 'VideoAI 科技',
    documentation: '<p>短视频脚本引擎使用指南...</p>',
    attachments: [],
    screenshots: ['https://picsum.photos/id/20/800/600'],
    features: [{ title: '分镜设计', description: '自动生成分镜描述与拍摄建议。' }],
    pricing: [
        { id: 'p0', name: '3天快速体验', type: 'TRIAL', model: 'SUBSCRIPTION', priceMonth: 0, features: ['生成5个脚本', '限时3天'] },
        { id: 'p1', name: '标准版', type: 'SUBSCRIPTION', model: 'SUBSCRIPTION', priceMonth: 299, priceYear: 2999, features: ['无限脚本'] }
    ],
    reviews: [],
    trialUsed: false
  },

  // 2. 咨询转化
  {
    id: 'app-1',
    name: 'AI面部智能诊断',
    description: '基于深度学习的面部特征分析，一键生成整形方案建议。',
    fullDescription: '采用美沃斯独家研发的Face-X深度学习算法，识别面部128个关键特征点。结合亚洲人审美标准数据库，自动生成涵盖皮肤、轮廓、五官的综合诊断报告，并智能推荐适合的医美项目组合。支持3D模拟预览，极大提升咨询转化率。',
    type: AppType.OFFICIAL,
    icon: 'scan-face',
    category: '咨询转化',
    status: 'active',
    auditStatus: 'APPROVED',
    publishStatus: 'PUBLISHED',
    integrationType: 'API_EMBEDDED',
    rating: 4.9,
    provider: '美沃斯技术实验室',
    documentation: '<h3>产品优势</h3><p>识别面部128个关键特征点...</p>',
    attachments: ['技术白皮书.pdf', '操作指引.mp4'],
    screenshots: ['https://picsum.photos/id/30/800/600', 'https://picsum.photos/id/31/800/600'],
    features: [
      { title: '秒级面诊', description: '上传照片，3秒内生成专业诊断报告。' },
      { title: '项目连带', description: '智能关联商品库，自动生成治疗方案。' },
      { title: '老化模拟', description: '预测未来5-10年衰老趋势，辅助抗衰教育。' }
    ],
    pricing: [
      { id: 'p1', name: '基础版', type: 'SUBSCRIPTION', model: 'SUBSCRIPTION', priceMonth: 0, features: ['每月50次诊断', '基础报告'] },
      { id: 'p2', name: '专业版', type: 'SUBSCRIPTION', model: 'SEAT', priceMonth: 299, priceYear: 2999, includedSeats: 1, features: ['无限次诊断', '3D模拟', '高清报告导出'] }
    ],
    reviews: [
      { id: 'r1', user: '成都华美', rating: 5, date: '2023-10-15', content: '咨询师的神器，客单价提升了30%。' }
    ],
    trialUsed: true // Assume already used for this active app
  },
  {
    id: 'app-3',
    name: '3D身形模拟器',
    description: '第三方顶级体型模拟服务，支持吸脂/隆胸效果预览。',
    fullDescription: '由硅谷Crisalix提供技术支持，专注于身体塑形效果模拟。支持全身扫描建模，直观展示隆胸、吸脂术后效果。支持VR眼镜佩戴体验，让求美者身临其境感受术后改变。',
    type: AppType.THIRD_PARTY,
    icon: 'box',
    category: '咨询转化',
    status: 'trial',
    auditStatus: 'APPROVED',
    publishStatus: 'PUBLISHED',
    integrationType: 'EXTERNAL_LINK',
    rating: 4.5,
    provider: 'Crisalix',
    documentation: '<p>需要配合专业3D扫描设备使用...</p>',
    attachments: ['设备兼容列表.xlsx'],
    screenshots: ['https://picsum.photos/id/40/800/600'],
    features: [
        { title: 'VR体验', description: '支持VR设备，沉浸式看效果。' },
        { title: '精准测量', description: '误差小于0.5cm的体积测量。' }
    ],
    pricing: [
        { id: 'p1', name: '按次付费', type: 'SUBSCRIPTION', model: 'USAGE', pricePerUnit: 50, unitName: '次', features: ['单次模拟', '云端存储7天'] },
        { id: 'p2', name: '百次资源包', type: 'SUBSCRIPTION', model: 'RESOURCE_PACK', packPrice: 4000, packQuota: 100, unitName: '次', features: ['平均40元/次', '永久有效'] }
    ],
    reviews: [
        { id: 'r2', user: '上海九院李医生', rating: 4, date: '2023-09-20', content: '效果很逼真，但是加载速度稍微有点慢。' }
    ],
    trialUsed: true
  },

  // 3. 运营管理
  {
    id: 'app-2',
    name: '美沃斯SCRM助手',
    description: '智能客户分层与自动回访话术生成，提升复购率。',
    fullDescription: '深度打通机构HIS系统，自动分析客户画像。利用NLP技术生成高情商回访话术，支持微信生态自动触达。独创的客户生命周期管理模型，精准预测客户流失风险并预警。',
    type: AppType.OFFICIAL,
    icon: 'users',
    category: '运营管理',
    status: 'active',
    auditStatus: 'APPROVED',
    publishStatus: 'PUBLISHED',
    integrationType: 'API_EMBEDDED',
    rating: 4.8,
    provider: '美沃斯数据中心',
    documentation: '<p>SCRM 接入说明...</p>',
    attachments: [],
    screenshots: [],
    features: [
        { title: '智能标签', description: '自动根据消费记录打标，如"高净值"、"沉睡客"。' },
        { title: 'AI话术', description: '针对不同场景自动生成催约、关怀话术。' }
    ],
    pricing: [
        { id: 'p1', name: '企业版', type: 'SUBSCRIPTION', model: 'SUBSCRIPTION', priceYear: 999, features: ['全渠道接入', '私有化部署'] }
    ],
    reviews: [],
    trialUsed: false
  },
  {
    id: 'app-schedule',
    name: '智能排班助手',
    description: '基于预约量预测的智能医生/手术室排期工具。',
    fullDescription: '告别Excel手工排班。系统根据历史预约数据预测未来流量，自动生成医生与手术室的最优排班方案，最大化资源利用率，减少客户等待时间。',
    type: AppType.THIRD_PARTY,
    icon: 'calendar',
    category: '运营管理',
    status: 'inactive',
    auditStatus: 'PENDING',
    publishStatus: 'UNPUBLISHED',
    integrationType: 'PURE_API',
    rating: 4.3,
    provider: 'EffiSchedule',
    documentation: '<p>API 接口文档 v2.0</p>',
    attachments: ['API_Spec.yaml'],
    screenshots: [],
    features: [
        { title: '冲突检测', description: '自动检测医生请假与手术安排冲突。' }
    ],
    pricing: [
        { id: 'p0', name: '7天免费试用', type: 'TRIAL', model: 'SUBSCRIPTION', priceMonth: 0, features: ['体验版', '限时7天'] },
        { id: 'p1', name: '基础版', type: 'SUBSCRIPTION', model: 'SEAT', priceMonth: 199, includedSeats: 1, features: ['5个排班资源'] },
        { id: 'p2', name: '科室版 (5人)', type: 'SUBSCRIPTION', model: 'SEAT', priceYear: 4999, includedSeats: 5, features: ['适合小型科室'] }
    ],
    reviews: [],
    trialUsed: false
  },

  // 4. 治疗执行
  {
    id: 'app-record',
    name: '治疗记录AI助理',
    description: '语音转文字，自动生成标准化的治疗/手术记录。',
    fullDescription: '医生在治疗过程中只需口述，AI自动过滤杂音并转换为标准医学术语的病历记录。支持光电治疗参数自动抓取（需设备支持），极大减轻医生书写负担。',
    type: AppType.OFFICIAL,
    icon: 'clipboard-list',
    category: '治疗执行',
    status: 'inactive',
    auditStatus: 'REJECTED',
    publishStatus: 'UNPUBLISHED',
    integrationType: 'API_EMBEDDED',
    rating: 4.6,
    provider: '美沃斯技术实验室',
    documentation: '<p>语音指令集...</p>',
    attachments: [],
    screenshots: [],
    features: [
        { title: '语音录入', description: '识别率98%的医学语音识别。' },
        { title: '合规检查', description: '自动检查病历书写是否符合卫健委规范。' }
    ],
    pricing: [
        { id: 'p0', name: '7天免费试用', type: 'TRIAL', model: 'SUBSCRIPTION', priceMonth: 0, features: ['无限语音时长', '限时7天'] },
        { id: 'p1', name: '专业版', type: 'SUBSCRIPTION', model: 'SEAT', priceMonth: 399, includedSeats: 1, features: ['无限语音时长'] }
    ],
    reviews: [],
    trialUsed: false
  },

  // 5. 术后服务
  {
    id: 'app-4',
    name: '术后AI陪护',
    description: '24小时智能解答术后护理问题，降低客诉风险。',
    fullDescription: '基于大语言模型的医疗垂直领域微调版本。7x24小时在线解答术后红肿、疼痛、饮食禁忌等常见问题。遇到高风险关键词（如"感染"、"出血"）自动触发人工预警，保障医疗安全。',
    type: AppType.THIRD_PARTY,
    icon: 'message-circle-heart',
    category: '术后服务',
    status: 'inactive',
    auditStatus: 'APPROVED',
    publishStatus: 'UNPUBLISHED',
    integrationType: 'API_EMBEDDED',
    rating: 4.2,
    provider: 'CareAI Tech',
    documentation: '<p>护理知识库配置说明...</p>',
    attachments: [],
    screenshots: [],
    features: [
        { title: '风险预警', description: '识别术后并发症征兆，及时通知医生。' },
        { title: '多模态交互', description: '支持发送伤口照片进行初步AI识别。' }
    ],
    pricing: [
        { id: 'p1', name: '标准版', type: 'SUBSCRIPTION', model: 'SUBSCRIPTION', priceMonth: 500, priceYear: 5000, features: ['服务100位术后客户'] }
    ],
    reviews: [],
    trialUsed: false
  },

  // 6. 复购增购
  {
    id: 'app-repurchase',
    name: '私域复购引擎',
    description: '基于治疗周期的智能复购提醒与优惠券发放。',
    fullDescription: '精准计算肉毒素、玻尿酸等项目的代谢周期，在效果衰退前自动触发温馨提醒。结合客户消费能力，智能推荐关联品项优惠券，实现自动化复购闭环。',
    type: AppType.OFFICIAL,
    icon: 'refresh-ccw',
    category: '复购增购',
    status: 'inactive',
    auditStatus: 'PENDING',
    publishStatus: 'UNPUBLISHED',
    integrationType: 'API_EMBEDDED',
    rating: 4.8,
    provider: '美沃斯营销实验室',
    documentation: '<p>营销策略配置指南...</p>',
    attachments: [],
    screenshots: [],
    features: [
        { title: '周期管理', description: '内置主流医美项目代谢周期模型。' }
    ],
    pricing: [
        { id: 'p0', name: '14天免费试用', type: 'TRIAL', model: 'SUBSCRIPTION', priceMonth: 0, features: ['触达100人次', '限时14天'] },
        { id: 'p1', name: '增长版', type: 'SUBSCRIPTION', model: 'RESOURCE_PACK', packPrice: 499, packQuota: 1000, unitName: '人次', features: ['单价0.5元/人次'] }
    ],
    reviews: [],
    trialUsed: false
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2023-10-25 14:30', appName: 'AI面部智能诊断', user: '李咨询', amount: -5.00, type: 'consumption' },
  { id: 't2', date: '2023-10-25 10:15', appName: 'AI面部智能诊断', user: '李咨询', amount: -5.00, type: 'consumption' },
  { id: 't3', date: '2023-10-24 16:00', appName: '系统充值', user: '张总', amount: 5000.00, type: 'recharge' },
  { id: 't4', date: '2023-10-24 09:20', appName: '3D身形模拟器', user: '李咨询', amount: -20.00, type: 'consumption' },
  { id: 't5', date: '2023-10-23 11:45', appName: '美沃斯SCRM助手', user: '李咨询', amount: -2.50, type: 'consumption' },
];

export const MOCK_SETTLEMENTS: SettlementRecord[] = [
    { id: 's1', month: '2023-09', totalAmount: 12500.00, status: 'SETTLED', dueDate: '2023-10-30' },
    { id: 's2', month: '2023-10', totalAmount: 3245.50, status: 'PENDING', dueDate: '2023-11-30' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: '保妥适(Botox) 100u', sku: 'INJ-BTX-100', category: '注射美容', syncSource: 'API', lastSync: '10分钟前' },
  { id: 'p2', name: '乔雅登极致', sku: 'INJ-JUV-ULT', category: '玻尿酸', syncSource: 'MANUAL', lastSync: '2023-10-20' },
  { id: 'p3', name: 'M22王者之冠', sku: 'DEV-M22', category: '光电仪器', syncSource: 'IMPORT', lastSync: '2023-10-01' },
];

export const MOCK_KNOWLEDGE: KnowledgeItem[] = [
  { id: 'k1', title: '肉毒素除皱原理标准话术', category: 'EFFICACY', tags: ['除皱', '肉毒'], lastUpdated: '2023-10-01' },
  { id: 'k2', title: '超声炮术后红肿处理SOP', category: 'SYMPTOM', tags: ['抗衰', '术后'], lastUpdated: '2023-09-15' },
  { id: 'k3', title: '皮秒激光适应症百科', category: 'DEVICE', tags: ['祛斑', '美白'], lastUpdated: '2023-08-20' },
];

export const MOCK_TASKS: Task[] = [
    { id: 'task-1', appName: 'AI面部智能诊断', action: '生成深度诊断报告', status: 'PROCESSING', time: '1分钟前', user: '李咨询' },
    { id: 'task-2', appName: '美沃斯SCRM助手', action: '批量生成回访话术', status: 'COMPLETED', time: '10分钟前', user: '李咨询' },
    { id: 'task-3', appName: '3D身形模拟器', action: '胸部整形模拟渲染', status: 'COMPLETED', time: '30分钟前', user: '李咨询' },
    { id: 'task-4', appName: 'AI面部智能诊断', action: '快速面诊分析', status: 'FAILED', time: '1小时前', user: '张总' },
    { id: 'task-5', appName: '术后AI陪护', action: '异常红肿识别预警', status: 'COMPLETED', time: '2小时前', user: '李咨询' },
];

export const MOCK_SUBSCRIPTION_REQUESTS: SubscriptionRequest[] = [
    { id: 'req-1', userId: 'u2', userName: '李咨询', userAvatar: 'https://picsum.photos/id/65/100/100', appId: 'app-xhs', appName: '小红书爆文生成器', requestDate: '2023-10-26 09:30', status: 'PENDING' },
    { id: 'req-2', userId: 'u2', userName: '李咨询', userAvatar: 'https://picsum.photos/id/65/100/100', appId: 'app-video', appName: '短视频脚本引擎', requestDate: '2023-10-25 14:20', status: 'APPROVED' },
];

export const MOCK_USAGE_RECORDS: AppUsageRecord[] = [
    { id: 'rec-1', appId: 'app-1', appName: 'AI面部智能诊断', userId: 'u2', date: '2023-10-26 10:30', actionType: '面部检测', resultSummary: '客户王女士(34岁)面部衰老程度II级检测报告', status: 'SUCCESS' },
    { id: 'rec-2', appId: 'app-1', appName: 'AI面部智能诊断', userId: 'u2', date: '2023-10-26 09:15', actionType: '模拟整形', resultSummary: '鼻综合术后效果模拟渲染图_v2', status: 'SUCCESS' },
    { id: 'rec-3', appId: 'app-3', appName: '3D身形模拟器', userId: 'u2', date: '2023-10-25 16:40', actionType: '身形扫描', resultSummary: '腰腹环吸体积测算报告', status: 'SUCCESS' },
    { id: 'rec-4', appId: 'app-2', appName: '美沃斯SCRM助手', userId: 'u2', date: '2023-10-25 11:20', actionType: '话术生成', resultSummary: '针对[高净值]客户的重阳节回访话术', status: 'SUCCESS' },
    { id: 'rec-5', appId: 'app-1', appName: 'AI面部智能诊断', userId: 'u4', date: '2023-10-26 14:00', actionType: '面部检测', resultSummary: '客户张小姐检测失败：光线过暗', status: 'FAILED' },
    { id: 'rec-6', appId: 'app-xhs', appName: '小红书爆文生成器', userId: 'u4', date: '2023-10-26 13:10', actionType: '文案生成', resultSummary: '热玛吉抗衰科普小红书笔记', status: 'SUCCESS' },
];
