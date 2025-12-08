import React from 'react';
import { ChevronUp, ChevronDown, Lock, Edit2 } from 'lucide-react';
import { Character } from '../types';

interface StatControlProps {
  title: string;
  currentLevelLabel: string;
  currentCost: number;
  nextCost: number | null;
  canIncrease: boolean;
  canDecrease: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  colorClass: string;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  rankColor?: string;
  
  character?: Character | null;
  onIconClick?: () => void;
  showCharacterName?: boolean;

  // New props for Multipliers and Bonuses
  multiplier: number;
  eternalBonusActive?: boolean; // Green +1
  synergyBonusCount?: number;   // Yellow +1
}

const getCharacterImageUrl = (char: Character) => {
  const svg = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${char.color}" rx="20" />
      <text x="50" y="55" font-family="sans-serif" font-size="28" font-weight="bold" fill="${char.textColor}" text-anchor="middle" dominant-baseline="middle">${char.iconChar}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

export const StatControl: React.FC<StatControlProps> = ({
  title,
  currentLevelLabel,
  currentCost,
  nextCost,
  canIncrease,
  canDecrease,
  onIncrease,
  onDecrease,
  colorClass,
  icon,
  description,
  rankColor = "border-gray-700",
  character,
  onIconClick,
  showCharacterName = false,
  multiplier,
  eternalBonusActive = false,
  synergyBonusCount = 0
}) => {
  return (
    <div className={`relative bg-gray-850 rounded-xl p-6 border ${rankColor} shadow-lg transition-all duration-300`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          
          {/* Interactive Icon Area */}
          <button 
            onClick={onIconClick}
            className="group relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="點擊更換圖片"
          >
            {character ? (
              <img 
                src={getCharacterImageUrl(character)} 
                alt={character.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-700">
                {icon}
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
               <Edit2 size={20} className="text-white" />
            </div>
          </button>

          <div className="flex flex-col">
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</h3>
            
            {showCharacterName && character && (
              <span className="text-sm font-bold text-white mb-1 px-2 py-0.5 bg-gray-800 rounded-md w-fit">
                {character.name}
              </span>
            )}

            <div className="flex items-center gap-2 flex-wrap">
                <div className={`text-2xl font-bold ${colorClass} leading-tight`}>
                    {currentLevelLabel}
                </div>
                {/* Bonuses */}
                {eternalBonusActive && (
                    <span className="bg-green-500/20 text-green-400 border border-green-500/50 text-xs font-bold px-1.5 py-0.5 rounded">
                        +1
                    </span>
                )}
                {synergyBonusCount > 0 && (
                    <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-xs font-bold px-1.5 py-0.5 rounded">
                        +{synergyBonusCount}
                    </span>
                )}
            </div>
            
            {/* Multiplier Display */}
            <div className="text-sm font-mono text-gray-300 mt-1">
                倍率: <span className="text-white font-bold">{multiplier}%</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">已消耗</p>
          <p className="text-xl font-mono font-medium text-white">{currentCost}</p>
        </div>
      </div>
      
      <div className="mb-4 min-h-[1.5rem] flex items-center">
        {description && (
           typeof description === 'string' 
             ? <p className="text-xs text-gray-500">{description}</p> 
             : description
        )}
      </div>

      <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-1.5 border border-gray-700">
        <button
          onClick={onDecrease}
          disabled={!canDecrease}
          className={`p-3 rounded-md flex items-center justify-center transition-colors ${
            canDecrease 
              ? 'bg-gray-750 hover:bg-gray-700 text-white' 
              : 'bg-transparent text-gray-600 cursor-not-allowed'
          }`}
        >
          <ChevronDown size={20} />
        </button>

        <div className="flex flex-col items-center flex-1 px-4">
          <span className="text-xs text-gray-500 uppercase">升級所需</span>
          <span className={`font-mono font-bold ${nextCost !== null ? (canIncrease ? 'text-white' : 'text-red-400') : 'text-gray-600'}`}>
            {nextCost !== null ? nextCost : 'MAX'}
          </span>
        </div>

        <button
          onClick={onIncrease}
          disabled={!canIncrease}
          className={`p-3 rounded-md flex items-center justify-center transition-colors ${
            canIncrease 
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          {nextCost === null ? <Lock size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>
    </div>
  );
};