import React, { useState } from 'react';
import { Project } from '../types';
import { createNewProject } from '../services/projectService';
import { X, Plus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: (project: Project) => void;
}

const AddProjectModal: React.FC<Props> = ({ isOpen, onClose, onProjectAdded }) => {
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [products, setProducts] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = createNewProject(name, manufacturer, products, description);
    onProjectAdded(newProject);
    setName('');
    setManufacturer('');
    setProducts('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">新增项目</h3>
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
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="例如：心血管新药上市推广"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">上游厂家</label>
            <input
              type="text"
              required
              value={manufacturer}
              onChange={e => setManufacturer(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="例如：辉瑞制药"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">覆盖品种</label>
            <input
              type="text"
              required
              value={products}
              onChange={e => setProducts(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="例如：阿托伐他汀, 氯吡格雷"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">项目描述</label>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
              rows={3}
              placeholder="简要描述项目背景、目标和范围..."
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex justify-center items-center gap-2"
            >
              <Plus size={18} /> 创建项目
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;