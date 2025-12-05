import React, { useState, useEffect } from 'react';
import { Project, MonthlyData, ProjectStatus } from './types';
import { getProjects, addMonthlyData } from './services/projectService';
import ProjectCard from './components/ProjectCard';
import DataEntryModal from './components/DataEntryModal';
import AddProjectModal from './components/AddProjectModal';
import EditProjectModal from './components/EditProjectModal';
import AIReport from './components/AIReport';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  ChevronLeft, 
  TrendingUp, 
  Users, 
  Target,
  BarChart2,
  Pill,
  Pencil,
  Search,
  Filter
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// Mapping for status display
const statusMap: Record<string, string> = {
  [ProjectStatus.Active]: '进行中',
  [ProjectStatus.Pending]: '待定',
  [ProjectStatus.Completed]: '已完成'
};

// Main App Component
const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'All'>('All');

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const refreshProjects = () => {
    setProjects(getProjects());
  };

  const handleSaveData = (data: MonthlyData) => {
    if (selectedProjectId) {
      addMonthlyData(selectedProjectId, data);
      refreshProjects();
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Filter projects logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.products && p.products.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // --- Views ---

  // 1. Dashboard View
  const DashboardView = () => {
    const totalProjects = projects.length;
    
    // Calculate aggregate metrics (based on ALL projects, not just filtered)
    const totalSales = projects.reduce((acc, p) => {
      const last = p.monthlyData[p.monthlyData.length - 1];
      return acc + (last ? last.actualSales : 0);
    }, 0);

    const totalTarget = projects.reduce((acc, p) => {
      const last = p.monthlyData[p.monthlyData.length - 1];
      return acc + (last ? last.targetSales : 0);
    }, 0);

    const overallAchievement = totalTarget > 0 ? (totalSales / totalTarget) * 100 : 0;

    // Data for overview chart (Top 5 projects by Sales)
    const chartData = projects
      .map(p => {
        const last = p.monthlyData[p.monthlyData.length - 1];
        return {
          name: p.name.length > 8 ? p.name.substring(0, 8) + '...' : p.name,
          sales: last ? last.actualSales : 0,
          target: last ? last.targetSales : 0
        };
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">总览</h1>
            <p className="text-slate-500 mt-1">欢迎回来。您目前共管理 {totalProjects} 个项目。</p>
          </div>
          <button 
            onClick={() => setIsAddProjectModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm self-start md:self-auto"
          >
            <PlusCircle size={18} /> 新增项目
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Target size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">本月整体达成率</p>
                <p className="text-2xl font-bold text-slate-800">{overallAchievement.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">本月总销售额</p>
                <p className="text-2xl font-bold text-slate-800">¥{(totalSales / 10000).toFixed(2)}万</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">合作厂家数</p>
                <p className="text-2xl font-bold text-slate-800">{new Set(projects.map(p => p.manufacturer)).size}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Projects Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6">销售Top 5项目 (本月)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  cursor={{fill: '#f1f5f9'}}
                />
                <Legend formatter={(value) => value === 'sales' ? '实际销售' : value === 'target' ? '目标' : value} />
                <Bar dataKey="sales" name="实际销售" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="target" name="目标" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Grid & Filters */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="font-bold text-xl text-slate-800">所有项目列表</h3>
            
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="搜索项目、厂家或品种..." 
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <select
                  className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none appearance-none bg-white w-full md:w-auto"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'All')}
                >
                  <option value="All">所有状态</option>
                  <option value={ProjectStatus.Active}>进行中</option>
                  <option value={ProjectStatus.Pending}>待定</option>
                  <option value={ProjectStatus.Completed}>已完成</option>
                </select>
              </div>
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(p => (
                <ProjectCard key={p.id} project={p} onClick={() => setSelectedProjectId(p.id)} />
              ))}
            </div>
          ) : (
             <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
               <p>没有找到匹配的项目</p>
               <button 
                 onClick={() => {setSearchTerm(''); setStatusFilter('All');}} 
                 className="mt-2 text-teal-600 font-medium hover:underline"
                >
                  清除筛选条件
                </button>
             </div>
          )}
        </div>
      </div>
    );
  };

  // 2. Project Detail View
  const ProjectDetailView = () => {
    if (!selectedProject) return null;

    return (
      <div className="space-y-8 animate-fade-in">
        {/* Navigation & Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
             <button 
              onClick={() => setSelectedProjectId(null)} 
              className="flex items-center text-slate-500 hover:text-teal-600 transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" /> 返回仪表盘
            </button>
            
            <button
               onClick={() => setIsEditProjectModalOpen(true)}
               className="text-slate-400 hover:text-teal-600 flex items-center gap-1 text-sm transition-colors"
            >
               <Pencil size={14} /> 编辑项目信息
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-800">{selectedProject.name}</h1>
                <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full uppercase tracking-wide">
                  {statusMap[selectedProject.status]}
                </span>
              </div>
              <p className="text-slate-500 text-lg mb-2">{selectedProject.manufacturer}</p>
              
              <div className="flex items-start gap-2 text-slate-600 bg-white p-3 rounded-lg border border-slate-200 shadow-sm inline-block max-w-xl">
                 <Pill className="text-teal-500 shrink-0 mt-1" size={18} />
                 <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">覆盖品种</span>
                    <span className="font-medium">{selectedProject.products || "未指定品种"}</span>
                 </div>
              </div>
              
              <p className="text-slate-600 mt-4 max-w-2xl">{selectedProject.description}</p>
            </div>
            
            <button 
              onClick={() => setIsDataModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all font-medium whitespace-nowrap"
            >
              <PlusCircle size={20} /> 更新进度
            </button>
          </div>
        </div>

        {/* AI Report Section */}
        <AIReport project={selectedProject} />

        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <BarChart2 className="text-teal-500" size={20}/> 销售趋势
            </h3>
          </div>
          {selectedProject.monthlyData.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedProject.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Legend formatter={(value) => value === 'actualSales' ? '实际销售' : '目标'} />
                  <Line type="monotone" dataKey="actualSales" name="实际销售" stroke="#0d9488" strokeWidth={3} dot={{r: 4, fill: '#0d9488'}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="targetSales" name="目标" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              暂无历史数据。点击“更新进度”添加数据。
            </div>
          )}
        </div>

        {/* History Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-800">月度历史数据</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                 <tr>
                   <th className="px-6 py-4">月份</th>
                   <th className="px-6 py-4">销售额 / 目标</th>
                   <th className="px-6 py-4">达成率</th>
                   <th className="px-6 py-4">覆盖医院</th>
                   <th className="px-6 py-4">关键活动</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {selectedProject.monthlyData.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="px-6 py-8 text-center text-slate-400">暂无数据记录。</td>
                   </tr>
                 ) : (
                   [...selectedProject.monthlyData].reverse().map((data, idx) => {
                     const rate = data.targetSales > 0 ? (data.actualSales / data.targetSales) * 100 : 0;
                     return (
                       <tr key={idx} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 font-medium text-slate-800">{data.month}</td>
                         <td className="px-6 py-4 text-slate-600">
                           <div className="flex flex-col">
                             <span className="font-semibold">¥{data.actualSales.toLocaleString()}</span>
                             <span className="text-xs text-slate-400">目标: ¥{data.targetSales.toLocaleString()}</span>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                             rate >= 100 ? 'bg-green-100 text-green-700' : 
                             rate >= 80 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                           }`}>
                             {rate.toFixed(1)}%
                           </span>
                         </td>
                         <td className="px-6 py-4 text-slate-600">
                           <div className="flex items-center gap-2">
                             <Users size={16} className="text-slate-400"/>
                             {data.hospitalCoverage} 家
                           </div>
                         </td>
                         <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate" title={data.activities}>
                           {data.activities || '-'}
                         </td>
                       </tr>
                     );
                   })
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white font-bold text-xl">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={18} />
            </div>
            医药项目通
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          <button 
            onClick={() => setSelectedProjectId(null)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              !selectedProjectId ? 'bg-teal-600 text-white' : 'hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={20} />
            仪表盘
          </button>
          <div className="pt-4 pb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            活跃项目 ({projects.length})
          </div>
          <div className="space-y-0.5 overflow-y-auto max-h-[60vh]">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedProjectId === p.id ? 'bg-slate-800 text-teal-400' : 'hover:bg-slate-800'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${p.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className="truncate text-left flex-1">{p.name}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
              PM
            </div>
            <div>
              <p className="text-sm font-medium text-white">项目经理</p>
              <p className="text-xs text-slate-500">医药商业部</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {selectedProjectId ? <ProjectDetailView /> : <DashboardView />}
        </div>
      </main>

      {/* Modals */}
      <DataEntryModal 
        isOpen={isDataModalOpen} 
        onClose={() => setIsDataModalOpen(false)} 
        onSave={handleSaveData}
        projectName={selectedProject?.name || ''}
      />

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onProjectAdded={(newProject) => {
          refreshProjects();
          setSelectedProjectId(newProject.id); // Go to new project
        }}
      />

      {selectedProject && (
        <EditProjectModal
          isOpen={isEditProjectModalOpen}
          onClose={() => setIsEditProjectModalOpen(false)}
          project={selectedProject}
          onProjectUpdated={refreshProjects}
        />
      )}
    </div>
  );
};

export default App;