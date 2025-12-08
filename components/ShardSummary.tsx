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
    { name: '主戰', value: usedMain, color: '#f59e0b' }, // Amber-500
    { name: '特技', value: usedSkill, color: '#3b82f6' }, // Blue-500
    { name: '剩餘', value: remaining, color: '#374151' }, // Gray-700
  ];

  return (
    <div className="bg-gray-850 rounded-2xl p-6 border border-gray-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
      
      {/* Text Stats */}
      <div className="flex-1 space-y-6 w-full">
        <div>
            <h2 className="text-lg font-medium text-gray-300 mb-4">碎片分配概況</h2>
            <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border-l-4 border-amber-500">
                    <span className="text-gray-400">主戰消耗</span>
                    <span className="text-xl font-bold text-amber-400">{usedMain}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border-l-4 border-blue-500">
                    <span className="text-gray-400">特技消耗</span>
                    <span className="text-xl font-bold text-blue-400">{usedSkill}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border-l-4 border-gray-600">
                    <span className="text-gray-400">剩餘可用</span>
                    <span className={`text-xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-gray-300'}`}>{remaining}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full md:w-64 h-64 relative flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
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
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                itemStyle={{ color: '#e5e7eb' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-gray-500">總計</span>
            <span className="text-2xl font-bold text-white">{usedMain + usedSkill}</span>
        </div>
      </div>
    </div>
  );
};
