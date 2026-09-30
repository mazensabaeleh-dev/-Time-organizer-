
import React, { useState } from 'react';
import { Subject, SubjectNature } from '../types';

interface Props {
  onAdd: (subject: Subject) => void;
  subjects: Subject[];
  onRemove: (id: string) => void;
}

const SubjectInput: React.FC<Props> = ({ onAdd, subjects, onRemove }) => {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState(3);
  const [nature, setNature] = useState<SubjectNature>(SubjectNature.Intense);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      name,
      priority,
      nature,
      estimatedHours: 2
    });
    setName('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-md">📚</span>
        إضافة المواد الدراسية
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المادة</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="مثال: الرياضيات، الفيزياء..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الأولوية (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">طبيعة المادة</label>
            <select
              value={nature}
              onChange={(e) => setNature(e.target.value as SubjectNature)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none bg-white"
            >
              {Object.values(SubjectNature).map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          أضف المادة
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {subjects.map(s => (
          <div key={s.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div>
              <span className="font-bold text-gray-800">{s.name}</span>
              <span className="mr-2 text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-100">{s.nature}</span>
            </div>
            <button 
              onClick={() => onRemove(s.id)}
              className="text-red-400 hover:text-red-600 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectInput;
