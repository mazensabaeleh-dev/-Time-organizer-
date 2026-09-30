
import React from 'react';
import { StudyTip } from '../types';

interface Props {
  tips: StudyTip[];
}

const Tips: React.FC<Props> = ({ tips }) => {
  if (tips.length === 0) return null;

  return (
    <section className="mt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="bg-yellow-100 text-yellow-600 p-1.5 rounded-md">💡</span>
        نصائح ذكية لمذاكرة أفضل
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                {tip.category}
              </span>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">{tip.title}</h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              {tip.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tips;
