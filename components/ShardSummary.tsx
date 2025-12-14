import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Character } from '../types';

interface ShardSummaryProps {
  totalLimit: number;
  usedMain: number;
  usedSkill: number;
  mainCharacter: Character | null;
  skillCharacters: (Character | null)[];
  skillCosts: number[];
}

export const ShardSummary: React.FC<ShardSummaryProps> = ({
  totalLimit,
  usedMain,
  usedSkill,
  mainCharacter,
  skillCharacters,
  skillCosts
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'characters'>('characters');
  const remaining = Math.max(0, totalLimit - usedMain - usedSkill);
  
  // Calculate character shard totals
  const characterShardStats = useMemo(() => {
    const colorGroups: Record<string, { main: Character | null, skill: Character | null, total: number, mainCount: number, skillCount: number }> = {};
    
    // Map character IDs to color groups
    const getColorGroup = (id: string | undefined) => {
      if (!id) return null;
      if (id.includes('pink')) return 'pink';
      if (id.includes('white')) return 'white';
      if (id.includes('black')) return 'black';
      if (id.includes('purple')) return 'purple';
      if (id.includes('yellow')) return 'yellow';
      return null;
    };
    
    // Add main character
    if (mainCharacter) {
      const color = getColorGroup(mainCharacter.id);
      if (color) {
        if (!colorGroups[color]) {
          colorGroups[color] = { main: null, skill: null, total: 0, mainCount: usedMain, skillCount: 0 };
        }
        colorGroups[color].main = mainCharacter;
        colorGroups[color].total += usedMain;
        colorGroups[color].mainCount = usedMain;
      }
    }
    
    // Add skill characters with their actual costs
    skillCharacters.forEach((char, index) => {
      if (char) {
        const color = getColorGroup(char.id);
        if (color) {
          if (!colorGroups[color]) {
            colorGroups[color] = { main: null, skill: null, total: 0, mainCount: 0, skillCount: 0 };
          }
          colorGroups[color].skill = char;
          const skillCost = skillCosts[index] || 0;
          colorGroups[color].total += skillCost;
          colorGroups[color].skillCount += skillCost;
        }
      }
    });
    
    // Convert to array and sort by total
    return Object.entries(colorGroups)
      .map(([color, data]) => ({ color, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [mainCharacter, skillCharacters, usedMain, skillCosts]);
  
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
            {/* Tab Header */}
            <div className="flex gap-2 mb-4 border-b border-cream-200">
              <button
                onClick={() => setActiveTab('characters')}
                className={`px-4 py-2 font-bold transition-colors ${
                  activeTab === 'characters'
                    ? 'text-coffee-800 border-b-2 border-amber-500'
                    : 'text-coffee-400 hover:text-coffee-600'
                }`}
              >
                角色統計
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 font-bold transition-colors ${
                  activeTab === 'summary'
                    ? 'text-coffee-800 border-b-2 border-amber-500'
                    : 'text-coffee-400 hover:text-coffee-600'
                }`}
              >
                分配概況
              </button>
            </div>
            
            {activeTab === 'characters' ? (
              <div className="space-y-3">
                {characterShardStats.length > 0 ? (
                  characterShardStats.map((group) => (
                    <div key={group.color} className="flex items-center justify-between p-3 bg-cream-50 rounded-lg border-l-4" style={{ borderLeftColor: group.main?.color || group.skill?.color || '#D6D3D1' }}>
                      <div className="flex items-center gap-2">
                        {/* Character Icons */}
                        <div className="flex items-center -space-x-2">
                          {group.main && (
                            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                              <img src={group.main.imageUrl} alt={group.main.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          {group.skill && (
                            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                              <img src={group.skill.imageUrl} alt={group.skill.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                        {/* Names */}
                        <div className="flex flex-col">
                          <span className="text-coffee-800 font-bold text-sm">
                            {group.main?.name || group.skill?.name}
                          </span>
                          {group.main && group.skill && (
                            <span className="text-coffee-400 text-xs">
                              主戰: {Math.round(group.mainCount)} | 特技: {Math.round(group.skillCount)}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Total */}
                      <span 
                        className="text-xl font-bold" 
                        style={{ 
                          color: group.main?.color || group.skill?.color || '#5D4037',
                          ...(((group.main?.color || group.skill?.color) === '#f3f4f6') && {
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3), -1px -1px 2px rgba(0,0,0,0.3), 1px -1px 2px rgba(0,0,0,0.3), -1px 1px 2px rgba(0,0,0,0.3)'
                          })
                        }}
                      >
                        {Math.round(group.total)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-coffee-400 py-8">
                    尚未選擇角色
                  </div>
                )}
              </div>
            ) : (
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
            )}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full md:w-64 h-64 relative flex-shrink-0 flex items-center justify-center">
        <PieChart width={256} height={256}>
          <Pie
            data={data}
            cx={128}
            cy={128}
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
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-coffee-400">總計</span>
            <span className="text-2xl font-bold text-coffee-800">{usedMain + usedSkill}</span>
        </div>
      </div>
    </div>
  );
};