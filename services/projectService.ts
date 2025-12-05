import { Project, ProjectStatus, MonthlyData } from '../types';

const STORAGE_KEY = 'pharma_projects_v1';

// Seed data for the initial projects (Chinese Context)
const SEED_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: '心血管-立普妥专项推广',
    manufacturer: '辉瑞制药 (Pfizer)',
    products: '阿托伐他汀钙片 (立普妥), 络活喜',
    startDate: '2023-01-01',
    status: ProjectStatus.Active,
    description: '针对核心城市三甲医院的心血管产品线深度分销与学术推广协助。',
    monthlyData: [
      { month: '2023-08', actualSales: 120000, targetSales: 110000, hospitalCoverage: 45, activities: '北京KOL学术研讨会' },
      { month: '2023-09', actualSales: 115000, targetSales: 115000, hospitalCoverage: 48, activities: '区域销售代表培训' },
      { month: '2023-10', actualSales: 130000, targetSales: 120000, hospitalCoverage: 50, activities: '新增2家三甲医院进药' },
    ]
  },
  {
    id: 'p2',
    name: '神经科-新药上市项目',
    manufacturer: '诺华制药 (Novartis)',
    products: '依瑞奈尤单抗, 芬戈莫德',
    startDate: '2023-03-15',
    status: ProjectStatus.Active,
    description: '协助神经内科新特药的市场准入与早期患者主要渠道铺货。',
    monthlyData: [
      { month: '2023-08', actualSales: 50000, targetSales: 60000, hospitalCoverage: 12, activities: '新药上市发布会' },
      { month: '2023-09', actualSales: 58000, targetSales: 65000, hospitalCoverage: 15, activities: '各省招标挂网跟进' },
      { month: '2023-10', actualSales: 70000, targetSales: 70000, hospitalCoverage: 20, activities: '城市学术沙龙' },
    ]
  },
  {
    id: 'p3',
    name: '肿瘤-生物制剂DTP项目',
    manufacturer: '罗氏制药 (Roche)',
    products: '利妥昔单抗, 贝伐珠单抗',
    startDate: '2022-11-01',
    status: ProjectStatus.Active,
    description: '肿瘤生物制剂的DTP药房专项配送与患者管理服务。',
    monthlyData: [
      { month: '2023-09', actualSales: 450000, targetSales: 400000, hospitalCoverage: 80, activities: '全国肿瘤年会展台支持' },
      { month: '2023-10', actualSales: 460000, targetSales: 420000, hospitalCoverage: 82, activities: '患者援助项目(PAP)优化' },
    ]
  },
  {
    id: 'p4',
    name: '糖尿病-基层市场扩面',
    manufacturer: '赛诺菲 (Sanofi)',
    products: '甘精胰岛素, 二甲双胍缓释片',
    startDate: '2023-02-01',
    status: ProjectStatus.Active,
    description: '针对二三线城市及县域市场的广覆盖推广计划。',
    monthlyData: []
  },
  {
    id: 'p5',
    name: '呼吸科-OTC连锁合作',
    manufacturer: '葛兰素史克 (GSK)',
    products: '辅舒良, 舒利迭',
    startDate: '2023-06-01',
    status: ProjectStatus.Pending,
    description: '与大型连锁药店建立战略合作，提升呼吸类产品OTC份额。',
    monthlyData: []
  },
  {
    id: 'p6',
    name: '皮肤科-特药专家维护',
    manufacturer: '强生 (J&J)',
    products: '乌司奴单抗, 润肤剂系列',
    startDate: '2023-01-20',
    status: ProjectStatus.Active,
    description: '皮肤科专家学术网络建设与维护。',
    monthlyData: []
  },
  {
    id: 'p7',
    name: '消化科-针剂院内配送',
    manufacturer: '武田制药 (Takeda)',
    products: '泮托拉唑针剂, 维得利珠单抗',
    startDate: '2023-04-10',
    status: ProjectStatus.Active,
    description: '医院静脉输液产品的供应链优化与库存管理。',
    monthlyData: []
  },
  {
    id: 'p8',
    name: '免疫-疫苗冷链物流',
    manufacturer: '艾伯维 (AbbVie)',
    products: '修美乐, 瑞福',
    startDate: '2023-05-05',
    status: ProjectStatus.Active,
    description: '生物制剂与疫苗的冷链物流保障项目。',
    monthlyData: []
  },
  {
    id: 'p9',
    name: '骨科-高值耗材集采',
    manufacturer: '史赛克 (Stryker)',
    products: '膝关节假体, 骨水泥',
    startDate: '2023-07-01',
    status: ProjectStatus.Active,
    description: '应对国家高值医用耗材集中采购的配送服务落地。',
    monthlyData: []
  }
];

export const getProjects = (): Project[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PROJECTS));
    return SEED_PROJECTS;
  }
  return JSON.parse(stored);
};

export const saveProject = (project: Project): void => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === project.id);
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const updateProject = (updatedProject: Project): void => {
  saveProject(updatedProject);
};

export const addMonthlyData = (projectId: string, data: MonthlyData): void => {
  const projects = getProjects();
  const project = projects.find(p => p.id === projectId);
  if (project) {
    // Check if month already exists, update if so
    const monthIndex = project.monthlyData.findIndex(m => m.month === data.month);
    if (monthIndex >= 0) {
      project.monthlyData[monthIndex] = data;
    } else {
      project.monthlyData.push(data);
      // Sort by date
      project.monthlyData.sort((a, b) => a.month.localeCompare(b.month));
    }
    saveProject(project);
  }
};

export const createNewProject = (name: string, manufacturer: string, products: string, description: string): Project => {
  const newProject: Project = {
    id: `p${Date.now()}`,
    name,
    manufacturer,
    products,
    startDate: new Date().toISOString().split('T')[0],
    status: ProjectStatus.Active,
    description,
    monthlyData: []
  };
  saveProject(newProject);
  return newProject;
};