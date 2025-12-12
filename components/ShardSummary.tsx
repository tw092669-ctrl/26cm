import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ShardSummaryProps {
  totalLimit: number;
  usedMain: number;
  usedSkill: number;
}

export const ShardSummary: React.FC<ShardSummaryProps> = ({
  totalLimit,
  usedMain,
  usedSkill
}) => {
  const remaining = Math.max(0, totalLimit - usedMain - usedSkill);
  
  const data = [
    { name: '主戰', value: usedMain, color: '#F59E0B' }, // Amber-500
    { name: '特技', value: usedSkill, color: '#60A5FA' }, // Blue-400
    { name: '剩餘', value: remaining, color: '#D6D3D1' }, // Stone-300
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
      
      {/* Text Stats */}
      <div className="flex-1 space-y-6 w-full">
        <div>
            <h2 className="text-lg font-bold text-coffee-800 mb-4">碎片分配概況</h2>
            <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-cream-50 rounded-lg border-l-4 border-amber-500">
                    <span className="text-coffee-600 font-medium">主戰消耗</span>
                    <span className="text-xl font-bold text-amber-500">{usedMain}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-cream-50 rounded-lg border-l-4 border-blue-400">
                    <span className="text-coffee-600 font-medium">特技消耗</span>
                    <span className="text-xl font-bold text-blue-500">{usedSkill}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-cream-50 rounded-lg border-l-4 border-stone-400">
                    <span className="text-coffee-600 font-medium">剩餘可用</span>
                    <span className={`text-xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-stone-500'}`}>{remaining}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full md:w-64 h-64 relative flex-shrink-0 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
                formatter={(value: number) => [value, '碎片']}
                contentStyle={{ backgroundColor: '#FFF', borderColor: '#EAD6A8', color: '#5D4037', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#5D4037', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-coffee-400">總計</span>
            <span className="text-2xl font-bold text-coffee-800">{usedMain + usedSkill}</span>
        </div>
      </div>
    </div>
  );
};