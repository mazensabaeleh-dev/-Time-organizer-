
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Subject } from '../types';

interface Props {
  subjects: Subject[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics: React.FC<Props> = ({ subjects }) => {
  const data = subjects.map(s => ({
    name: s.name,
    value: s.priority * 20, // Simplified visualization
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">تحليل توزيع الجهد</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-64">
          <p className="text-xs text-center text-gray-400 mb-2">نسبة التركيز حسب المادة</p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64">
          <p className="text-xs text-center text-gray-400 mb-2">أولوية المواد (مستوى الجهد)</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {subjects.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
            <span className="text-sm text-gray-600 font-medium">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
