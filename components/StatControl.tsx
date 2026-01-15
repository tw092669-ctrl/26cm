import React from 'react';
import { Plus, Minus, Lock, Repeat, Star } from 'lucide-react';
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
  mainBonus?: number; // Main battle bonus number (+2, +4, +6, +7, +8)
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
  synergyBonusCount = 0,
  mainBonus
}) => {
  
  // Extract just the number or short text for the badge
  const badgeText = currentLevelLabel.replace("Lv ", "");

  return (
    <div className={`flex flex-col items-center w-full ${isMain ? 'max-w-none lg:max-w-[280px]' : ''}`}>
      
      {/* Title - Use visibility:hidden for Main to preserve exact spacing of the text node */}
      <h3 className={`text-coffee-600 font-extrabold mb-1 lg:mb-2 text-xs sm:text-sm lg:text-base text-center min-h-[1.25rem] ${isMain ? 'invisible' : ''}`}>
        {title}
      </h3>

      {/* Avatar Container */}
      <div className="relative mb-2 lg:mb-3 group">
        
        {/* Main Avatar Circle - Responsive Sizing */}
        <button 
          onClick={onIconClick}
          className={`relative rounded-full overflow-hidden shadow-soft transition-transform hover:scale-105 active:scale-95 bg-gradient-to-br from-gray-100 to-gray-200 border-2 lg:border-4 hover:shadow-card
            ${isMain 
              ? 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-ui-gold shadow-[0_0_15px_rgba(255,183,77,0.4)]' 
              : 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-ui-teal/60'
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
        
        {/* Main Battle Bonus Badge - Positioned below avatar like in the image */}
        {isMain && mainBonus && (
          <div className="absolute -bottom-1 lg:-bottom-2 left-1/2 transform -translate-x-1/2 z-30 bg-gradient-to-br from-ui-coral to-ui-pink text-white font-black text-xs lg:text-base px-2 lg:px-3 py-1 lg:py-1.5 rounded-full shadow-soft border-2 border-white">
            +{mainBonus}
          </div>
        )}

        {/* Change Icon (Blue Circle with Arrows) */}
        <button 
            onClick={onIconClick}
            className="absolute top-0 right-0 lg:top-1 lg:right-1 z-10 bg-gradient-to-br from-ui-blue to-ui-teal hover:from-ui-teal hover:to-ui-blue text-white rounded-full p-1 lg:p-1.5 shadow-soft border lg:border-2 border-white transition-all"
            title="更換角色"
        >
            <Repeat className="w-3 h-3 lg:w-3.5 lg:h-3.5" strokeWidth={3} />
        </button>

        {/* Level Badge for Skills only (positioned absolutely) */}
        {!isMain && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20 flex flex-col items-center w-full">
            <div className="bg-rank-badge text-white font-extrabold text-xs lg:text-base px-2 lg:px-3 py-0.5 rounded-full border lg:border-2 border-white shadow-md min-w-[2.5rem] lg:min-w-[3.5rem] text-center">
              {badgeText}
            </div>
          </div>
        )}
      </div>

      {/* Stars for Main Battle - Between avatar and name */}
      {isMain && (
        <div className="flex justify-center mb-1 lg:mb-2">
          {(() => {
            const levelNum = parseInt(badgeText.match(/\d+/)?.[0] || '0');
            const rankType = badgeText.includes('金') ? 'gold' : badgeText.includes('紅') ? 'red' : 'eternal';
            const bgColors = {
              gold: 'bg-cream-100',
              red: 'bg-cream-100',
              eternal: 'bg-cream-100'
            };
            return (
              <div className={`flex gap-1 px-2.5 py-1.5 rounded-full ${bgColors[rankType]} border border-cream-300 shadow-md`}>
                {[...Array(levelNum)].map((_, i) => {
                  if (rankType === 'eternal') {
                    return (
                      <svg key={i} className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id={`star-eternal-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{stopColor: '#a855f7', stopOpacity: 1}} />
                            <stop offset="50%" style={{stopColor: '#facc15', stopOpacity: 1}} />
                            <stop offset="100%" style={{stopColor: '#fef08a', stopOpacity: 1}} />
                          </linearGradient>
                        </defs>
                        <path d="M12 5L14.5 9.5L12 11L9.5 9.5L12 5Z M12 13L14.5 14.5L12 19L9.5 14.5L12 13Z M14.5 9.5L19 12L14.5 14.5L13 12L14.5 9.5Z M9.5 14.5L5 12L9.5 9.5L9.5 14.5Z M9.5 9.5L14.5 9.5L14.5 14.5L9.5 14.5Z" fill={`url(#star-eternal-${i})`} stroke="#000" strokeWidth="0.8" strokeLinejoin="round" />
                      </svg>
                    );
                  } else if (rankType === 'gold') {
                    return (
                      <svg key={i} className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id={`star-gold-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{stopColor: '#fef08a', stopOpacity: 1}} />
                            <stop offset="100%" style={{stopColor: '#ca8a04', stopOpacity: 1}} />
                          </linearGradient>
                        </defs>
                        <path d="M12 5L14.5 9.5L12 11L9.5 9.5L12 5Z M12 13L14.5 14.5L12 19L9.5 14.5L12 13Z M14.5 9.5L19 12L14.5 14.5L13 12L14.5 9.5Z M9.5 14.5L5 12L9.5 9.5L9.5 14.5Z M9.5 9.5L14.5 9.5L14.5 14.5L9.5 14.5Z" fill={`url(#star-gold-${i})`} stroke="#000" strokeWidth="0.8" strokeLinejoin="round" />
                      </svg>
                    );
                  } else {
                    return (
                      <svg key={i} className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id={`star-red-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{stopColor: '#fecaca', stopOpacity: 1}} />
                            <stop offset="100%" style={{stopColor: '#dc2626', stopOpacity: 1}} />
                          </linearGradient>
                        </defs>
                        <path d="M12 5L14.5 9.5L12 11L9.5 9.5L12 5Z M12 13L14.5 14.5L12 19L9.5 14.5L12 13Z M14.5 9.5L19 12L14.5 14.5L13 12L14.5 9.5Z M9.5 14.5L5 12L9.5 9.5L9.5 14.5Z M9.5 9.5L14.5 9.5L14.5 14.5L9.5 14.5Z" fill={`url(#star-red-${i})`} stroke="#000" strokeWidth="0.8" strokeLinejoin="round" />
                      </svg>
                    );
                  }
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* Spacer for badge overflow - Only for skills */}
      {!isMain && <div className="h-3 lg:h-4"></div>}

      {/* Character Name & Bonuses */}
      <div className={`text-center w-full min-h-[2.5rem] lg:min-h-[3rem] ${isMain ? 'mb-0 lg:mb-2' : 'mb-3 lg:mb-2'}`}>
        <div className={`font-extrabold text-coffee-800 truncate px-1 ${isMain ? 'text-sm lg:text-2xl' : 'text-xs lg:text-lg'}`}>
            {character ? character.name : (showCharacterName ? "未選擇" : title)}
        </div>
        {/* Bonus Indicators */}
        <div className="flex gap-0.5 lg:gap-1 justify-center mt-0.5 lg:mt-1 min-h-[1rem] lg:min-h-[1.25rem]">
            {eternalBonusActive && (
                <span className="bg-green-100 text-green-600 text-[10px] lg:text-xs font-extrabold px-1 lg:px-1.5 rounded-full border border-green-200 flex items-center">
                    +1
                </span>
            )}
            {synergyBonusCount > 0 && (
                <span className="bg-yellow-100 text-yellow-600 text-[10px] lg:text-xs font-extrabold px-1 lg:px-1.5 rounded-full border border-yellow-200 flex items-center">
                    +{synergyBonusCount}
                </span>
            )}
        </div>
      </div>

      {/* Multiplier (Subtle) */}
      <div className="text-xs lg:text-sm text-coffee-400 mb-1 lg:mb-3 font-mono bg-cream-100 px-1.5 py-0.5 rounded h-[1.25rem] lg:h-[1.5rem] flex items-center justify-center font-bold">
          {Math.round(multiplier)}%
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-0.5 lg:gap-2 bg-gradient-to-r from-cream-100 to-cream-50 p-1 lg:p-1.5 rounded-full border-2 border-cream-200 shadow-soft w-full justify-between max-w-[100px] lg:max-w-none h-[2rem] lg:h-[2.5rem]">
        <button
          onClick={onDecrease}
          disabled={!canDecrease}
          className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
            canDecrease 
              ? 'bg-white text-ui-coral shadow-soft hover:bg-ui-coral/10 border-2 border-ui-coral/20 hover:border-ui-coral/40' 
              : 'bg-transparent text-gray-300 cursor-not-allowed'
          }`}
        >
          <Minus className="w-3 h-3 lg:w-4 lg:h-4" strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center flex-1 min-w-0">
            <span className="text-[10px] lg:text-xs text-coffee-400 uppercase leading-none scale-90 lg:scale-100 font-extrabold">COST</span>
            <span className={`text-sm lg:text-base font-extrabold font-mono leading-tight ${nextCost !== null ? (canIncrease ? 'text-coffee-800' : 'text-red-500') : 'text-gray-400'}`}>
                {nextCost !== null ? nextCost : '-'}
            </span>
        </div>

        <button
          onClick={onIncrease}
          disabled={!canIncrease}
          className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
            canIncrease 
              ? 'bg-gradient-to-br from-ui-gold to-amber-400 text-white shadow-soft hover:shadow-card border-2 border-amber-300' 
              : 'bg-gray-100 text-gray-300 cursor-not-allowed border-2 border-gray-200'
          }`}
        >
          {nextCost === null ? <Lock className="w-3 h-3 lg:w-3.5 lg:h-3.5" /> : <Plus className="w-3 h-3 lg:w-4 lg:h-4" strokeWidth={3} />}
        </button>
      </div>

      {/* Used Cost (Subtle) */}
      <div className="mt-1 lg:mt-2 text-[10px] lg:text-xs text-coffee-400 h-[0.875rem] lg:h-[1rem] flex items-center justify-center font-bold">
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