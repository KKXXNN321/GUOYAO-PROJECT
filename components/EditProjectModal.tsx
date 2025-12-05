import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { updateProject } from '../services/projectService';
import { X, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onProjectUpdated: () => void;
}

const EditProjectModal: React.FC<Props> = ({ isOpen, onClose, project, onProjectUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    products: '',
    description: ''
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        manufacturer: project.manufacturer,
        products: project.products || '',
        description: project.description
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...project,
      ...formData
    };
    updateProject(updated);
    onProjectUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">编辑项目信息</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">项目名称</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">上游厂家</label>
            <input
              type="text"
              required
              value={formData.manufacturer}
              onChange={e => setFormData({...formData, manufacturer: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">覆盖品种</label>
            <input
              type="text"
              required
              value={formData.products}
              onChange={e => setFormData({...formData, products: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="例如：阿托伐他汀, 氯吡格雷"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">项目描述</label>
            <textarea
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
              rows={3}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex justify-center items-center gap-2"
            >
              <Save size={18} /> 保存更改
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;