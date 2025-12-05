import React from 'react';
import { Project, ProjectStatus } from '../types';
import { Package, Pill } from 'lucide-react';

interface Props {
  project: Project;
  onClick: () => void;
}

const statusMap: Record<string, string> = {
  [ProjectStatus.Active]: '进行中',
  [ProjectStatus.Pending]: '待定',
  [ProjectStatus.Completed]: '已完成'
};

const ProjectCard: React.FC<Props> = ({ project, onClick }) => {
  const latestMonth = project.monthlyData.length > 0 ? project.monthlyData[project.monthlyData.length - 1] : null;
  
  const achievementRate = latestMonth && latestMonth.targetSales > 0
    ? Math.round((latestMonth.actualSales / latestMonth.targetSales) * 100)
    : 0;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 cursor-pointer hover:shadow-md transition-all hover:border-teal-400 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="bg-teal-50 p-2 rounded-lg">
          <Package className="w-6 h-6 text-teal-600" />
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          project.status === ProjectStatus.Active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {statusMap[project.status] || project.status}
        </span>
      </div>
      
      <h3 className="font-bold text-slate-800 text-lg mb-1 truncate" title={project.name}>{project.name}</h3>
      <p className="text-slate-500 text-sm mb-3">{project.manufacturer}</p>
      
      {/* Products Section */}
      <div className="flex items-start gap-1.5 mb-4 text-xs text-slate-600 bg-slate-50 p-2 rounded-md">
         <Pill size={14} className="mt-0.5 text-teal-500 shrink-0" />
         <span className="line-clamp-2" title={project.products}>{project.products || "暂无品种信息"}</span>
      </div>

      <div className="mt-auto">
        {latestMonth ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">上月数据 ({latestMonth.month})</span>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                    达成率 {achievementRate}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-teal-600">
                    {latestMonth.actualSales.toLocaleString()} / {latestMonth.targetSales.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-teal-100">
                <div style={{ width: `${Math.min(achievementRate, 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center text-slate-400 text-sm h-12 bg-slate-50 rounded-lg justify-center border border-dashed border-slate-200">
            暂无数据记录
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;