import React from 'react';
import { Plus, Minus, Lock, Repeat } from 'lucide-react';
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
  rankColor?: string; // Not used in new design but kept for compatibility
  
  character?: Character | null;
  onIconClick?: () => void;
  showCharacterName?: boolean;
  isMain?: boolean; // New prop to distinguish Main Battle style

  // New props for Multipliers and Bonuses
  multiplier: number;
  eternalBonusActive?: boolean; // Green +1
  synergyBonusCount?: number;   // Yellow +1
}

export const StatControl: React.FC<StatControlProps> = ({
  title,
  currentLevelLabel,
  currentCost,
  nextCost,
  canIncrease,
  canDecrease,
  onIncrease,
  onDecrease,
  icon,
  description,
  character,
  onIconClick,
  showCharacterName = false,
  isMain = false,
  multiplier,
  eternalBonusActive = false,
  synergyBonusCount = 0
}) => {
  
  // Extract just the number or short text for the badge
  const badgeText = currentLevelLabel.replace("Lv ", "");

  return (
    <div className={`flex flex-col items-center w-full ${isMain ? 'max-w-none lg:max-w-[280px]' : ''}`}>
      
      {/* Title - Use visibility:hidden for Main to preserve exact spacing of the text node */}
      <h3 className={`text-coffee-600 font-bold mb-1 lg:mb-2 text-[10px] sm:text-xs lg:text-sm text-center min-h-[1.25rem] ${isMain ? 'invisible' : ''}`}>
        {title}
      </h3>

      {/* Avatar Container */}
      <div className="relative mb-2 lg:mb-3 group">
        
        {/* Main Avatar Circle - Responsive Sizing */}
        <button 
          onClick={onIconClick}
          className={`relative rounded-full overflow-hidden shadow-card transition-transform hover:scale-105 active:scale-95 bg-gray-200 border-2 lg:border-4 
            ${isMain 
              ? 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-ui-gold shadow-[0_0_10px_rgba(251,191,36,0.3)] lg:shadow-[0_0_15px_rgba(251,191,36,0.4)]' 
              : 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-yellow-400'
            }`}
        >
          {character ? (
            <img 
              src={character.imageUrl}
              alt={character.name} 
              className="w-full h-full object-cover"
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                {/* Scale icon inside properly */}
                <div className="scale-75 lg:scale-100">
                    {icon}
                </div>
             </div>
          )}
          
          {/* Main Battle "Glow" effect behind character if active */}
          {isMain && (
             <div className="absolute inset-0 rounded-full border-2 lg:border-4 border-white/30 pointer-events-none"></div>
          )}
        </button>

        {/* Change Icon (Blue Circle with Arrows) */}
        <button 
            onClick={onIconClick}
            className="absolute top-0 right-0 lg:top-1 lg:right-1 z-10 bg-blue-400 hover:bg-blue-500 text-white rounded-full p-1 lg:p-1.5 shadow-md border lg:border-2 border-white transition-colors"
            title="更換角色"
        >
            <Repeat className="w-3 h-3 lg:w-3.5 lg:h-3.5" strokeWidth={3} />
        </button>

        {/* Level Badge */}
        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20 flex flex-col items-center w-full`}>
           {isMain ? (
               // Diamond shape for Main
               <div className="relative flex items-center justify-center">
                   <div className="bg-rank-badge text-white font-bold text-xs lg:text-base px-2 lg:px-3 py-0.5 rounded-md lg:rounded-lg border lg:border-2 border-white shadow-md min-w-[2rem] lg:min-w-[3rem] text-center transform rotate-0">
                       {badgeText}
                   </div>
               </div>
           ) : (
               // Pill shape for Skills
               <div className="bg-rank-badge text-white font-bold text-[10px] lg:text-sm px-2 lg:px-3 py-0.5 rounded-full border lg:border-2 border-white shadow-md min-w-[2.5rem] lg:min-w-[3.5rem] text-center">
                   {badgeText}
               </div>
           )}
        </div>
      </div>

      {/* Spacer for badge overflow */}
      <div className={`${isMain ? 'h-4 lg:h-6' : 'h-3 lg:h-4'}`}></div>

      {/* Character Name & Bonuses */}
      <div className="text-center mb-1 lg:mb-2 w-full">
        <div className={`font-bold text-coffee-800 truncate px-1 ${isMain ? 'text-xs lg:text-xl' : 'text-[10px] lg:text-base'}`}>
            {character ? character.name : (showCharacterName ? "未選擇" : title)}
        </div>
        {/* Bonus Indicators */}
        <div className="flex gap-0.5 lg:gap-1 justify-center mt-0.5 lg:mt-1 h-4 lg:h-5">
            {eternalBonusActive && (
                <span className="bg-green-100 text-green-600 text-[8px] lg:text-[10px] font-bold px-1 lg:px-1.5 rounded-full border border-green-200 flex items-center">
                    +1
                </span>
            )}
            {synergyBonusCount > 0 && (
                <span className="bg-yellow-100 text-yellow-600 text-[8px] lg:text-[10px] font-bold px-1 lg:px-1.5 rounded-full border border-yellow-200 flex items-center">
                    +{synergyBonusCount}
                </span>
            )}
        </div>
      </div>

      {/* Multiplier (Subtle) */}
      <div className="text-[10px] lg:text-xs text-coffee-400 mb-1 lg:mb-3 font-mono bg-cream-100 px-1.5 py-0.5 rounded">
          {multiplier}%
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-0.5 lg:gap-2 bg-cream-100 p-1 lg:p-1.5 rounded-full border border-cream-300 shadow-inner w-full justify-between max-w-[100px] lg:max-w-none">
        <button
          onClick={onDecrease}
          disabled={!canDecrease}
          className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
            canDecrease 
              ? 'bg-white text-coffee-600 shadow-sm hover:bg-gray-50 border border-gray-200' 
              : 'bg-transparent text-gray-300 cursor-not-allowed'
          }`}
        >
          <Minus className="w-3 h-3 lg:w-4 lg:h-4" strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center flex-1 min-w-0">
            <span className="text-[8px] lg:text-[10px] text-coffee-400 uppercase leading-none scale-90 lg:scale-100">COST</span>
            <span className={`text-xs lg:text-sm font-bold font-mono leading-tight ${nextCost !== null ? (canIncrease ? 'text-coffee-800' : 'text-red-500') : 'text-gray-400'}`}>
                {nextCost !== null ? nextCost : '-'}
            </span>
        </div>

        <button
          onClick={onIncrease}
          disabled={!canIncrease}
          className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
            canIncrease 
              ? 'bg-ui-gold text-white shadow-sm hover:bg-amber-400 border border-amber-300' 
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          {nextCost === null ? <Lock className="w-3 h-3 lg:w-3.5 lg:h-3.5" /> : <Plus className="w-3 h-3 lg:w-4 lg:h-4" strokeWidth={3} />}
        </button>
      </div>

      {/* Used Cost (Subtle) */}
      <div className="mt-1 lg:mt-2 text-[8px] lg:text-[10px] text-coffee-400">
         已用: {currentCost}
      </div>

      {/* Extra Description (e.g. Warning) */}
      {description && (
          <div className="mt-1 text-center leading-tight">
              {description}
          </div>
      )}

    </div>
  );
};