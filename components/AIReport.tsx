import React, { useState } from 'react';
import { Project } from '../types';
import { generateProjectReport } from '../services/geminiService';
import { Sparkles, Loader2, FileText, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  project: Project;
}

const AIReport: React.FC<Props> = ({ project }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (project.monthlyData.length === 0) {
      setReport("暂无数据可用于生成报告，请先添加月度销售数据。");
      return;
    }
    setLoading(true);
    const result = await generateProjectReport(project);
    setReport(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-indigo-900 text-lg">AI 月度智能分析</h3>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-white text-indigo-600 text-sm font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {report ? '重新生成' : '生成分析报告'}
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 min-h-[150px] border border-indigo-100/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-indigo-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm">正在分析项目表现...</p>
          </div>
        ) : report ? (
          <div className="prose prose-sm prose-indigo max-w-none text-slate-700">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8 text-indigo-300">
            <FileText className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm text-center max-w-xs">
              点击生成按钮，基于当前销售数据和活动记录，创建专业的月度总结报告。
            </p>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-indigo-400">
         <span>由 Gemini 2.5 Flash 提供支持</span>
         {report && <span>支持 Markdown 格式</span>}
      </div>
    </div>
  );
};

export default AIReport;