import React, { useState } from 'react';
import { MonthlyData } from '../types';
import { X, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MonthlyData) => void;
  projectName: string;
}

const DataEntryModal: React.FC<Props> = ({ isOpen, onClose, onSave, projectName }) => {
  const [formData, setFormData] = useState<MonthlyData>({
    month: new Date().toISOString().slice(0, 7), // Default to current YYYY-MM
    actualSales: 0,
    targetSales: 0,
    hospitalCoverage: 0,
    activities: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">更新项目进度</h3>
            <p className="text-sm text-slate-500">录入项目数据: {projectName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">月份</label>
              <input
                type="month"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">覆盖医院数</label>
              <input
                type="number"
                min="0"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                value={formData.hospitalCoverage || ''}
                onChange={(e) => setFormData({ ...formData, hospitalCoverage: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">实际销售额 (¥)</label>
              <input
                type="number"
                min="0"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                value={formData.actualSales || ''}
                onChange={(e) => setFormData({ ...formData, actualSales: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">目标销售额 (¥)</label>
              <input
                type="number"
                min="0"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                value={formData.targetSales || ''}
                onChange={(e) => setFormData({ ...formData, targetSales: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">关键活动与备注</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"
              placeholder="例如：举办了3场区域学术会议，与连锁药店A完成了谈判..."
              value={formData.activities}
              onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2"
            >
              <Save size={18} />
              保存记录
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataEntryModal;