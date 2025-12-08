import React, { useState, useMemo, useEffect } from 'react';
import { 
  MAIN_BATTLE_COSTS, 
  SKILL_COSTS, 
  MAX_MAIN_LEVEL, 
  MAX_SKILL_LEVEL, 
  MIN_SKILL_LEVEL,
  getMainMultiplier,
  getSkillMultiplier
} from './constants';
import { MainRank, Character } from './types';
import { StatControl } from './components/StatControl';
import { ShardSummary } from './components/ShardSummary';
import { CharacterSelector } from './components/CharacterSelector';
import { Swords, Zap, AlertTriangle, TrendingUp, Calculator, Lock, Unlock } from 'lucide-react';

interface SelectorState {
  isOpen: boolean;
  type: 'main' | 'skill' | null;
  index: number;
}

const App: React.FC = () => {
  // Mode State
  const [isFreeMode, setIsFreeMode] = useState<boolean>(false);

  // Shard State
  const [totalShards, setTotalShards] = useState<number>(300);
  const [inputValue, setInputValue] = useState<string>("300");
  
  // Level State
  const [mainLevel, setMainLevel] = useState<number>(0);
  const [skillLevels, setSkillLevels] = useState<number[]>([3, 3, 3]);

  const [mainCharacter, setMainCharacter] = useState<Character | null>(null);
  const [skillCharacters, setSkillCharacters] = useState<(Character | null)[]>([null, null, null]);

  const [selector, setSelector] = useState<SelectorState>({ isOpen: false, type: null, index: 0 });

  // --- Cost Calculations ---

  const currentMainCost = useMemo(() => {
    if (mainLevel === 0) return 0;
    return MAIN_BATTLE_COSTS[mainLevel - 1].cumulativeCost;
  }, [mainLevel]);

  const currentTotalSkillCost = useMemo(() => {
    return skillLevels.reduce((total, level) => {
      return total + SKILL_COSTS[level - 1].cumulativeCost;
    }, 0);
  }, [skillLevels]);

  // Auto-calculate total shards in Free Mode
  useEffect(() => {
    if (isFreeMode) {
      const sum = currentMainCost + currentTotalSkillCost;
      setTotalShards(sum);
      setInputValue(sum.toString());
    }
  }, [isFreeMode, currentMainCost, currentTotalSkillCost]);

  const remainingShards = totalShards - currentMainCost - currentTotalSkillCost;

  // In Free Mode, we ignore the budget constraint
  const nextMainCost = mainLevel < MAX_MAIN_LEVEL ? MAIN_BATTLE_COSTS[mainLevel].cost : null;
  const canIncreaseMain = nextMainCost !== null && (isFreeMode || remainingShards >= nextMainCost);
  const canDecreaseMain = mainLevel > 0;

  // --- Input Handling ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFreeMode) return; // Read-only in free mode
    
    const val = e.target.value;
    setInputValue(val);
    
    if (val === '') {
      setTotalShards(0);
    } else {
      const parsed = parseInt(val);
      setTotalShards(isNaN(parsed) ? 0 : Math.max(0, parsed));
    }
  };

  // --- Multiplier & Bonus Calculations ---

  // 1. Eternal 5 Bonus: If Main Battle is Level 15 (Eternal 5), all skills get +1
  const isEternalBonusActive = mainLevel === 15;

  // 2. Skill Synergy Bonus:
  // Condition: Main Battle must be at least Level 8 (Red 3) to activate this synergy.
  // Rule:
  // - A skill receives a bonus ONLY from other skills that have a STRICTLY HIGHER level than itself.
  // - EXCEPTION: If both skills are Level 18, they buff each other (+3).
  // - Level 16 source -> +1
  // - Level 17 source -> +2
  // - Level 18 source -> +3
  // - The bonus is NOT cumulative; it takes the MAXIMUM bonus provided by any single eligible higher-level skill.
  const isSynergyUnlocked = mainLevel >= 8;

  const getSynergyBonus = (selfIndex: number) => {
    if (!isSynergyUnlocked) return 0;

    const myLevel = skillLevels[selfIndex];
    let maxBonus = 0;

    skillLevels.forEach((otherLevel, index) => {
      if (index === selfIndex) return;

      let potentialBonus = 0;
      if (otherLevel >= 18) {
        potentialBonus = 3;
      } else if (otherLevel >= 17) {
        potentialBonus = 2;
      } else if (otherLevel >= 16) {
        potentialBonus = 1;
      }
      
      if (potentialBonus > 0) {
        // Apply Bonus if:
        // 1. The provider is strictly higher level than the receiver
        // 2. OR both are at max level (18)
        if (otherLevel > myLevel) {
           maxBonus = Math.max(maxBonus, potentialBonus);
        } else if (otherLevel === 18 && myLevel === 18) {
           maxBonus = Math.max(maxBonus, potentialBonus);
        }
      }
    });
    return maxBonus;
  };

  // Calculate Effective Levels and Multipliers
  const mainMultiplier = getMainMultiplier(mainLevel);
  
  const skillData = skillLevels.map((baseLevel, index) => {
    const eternalBonus = isEternalBonusActive ? 1 : 0;
    const synergyBonus = getSynergyBonus(index);
    
    // Effective level for multiplier calculation only (not cost)
    const effectiveLevel = baseLevel + eternalBonus + synergyBonus;
    const multiplier = getSkillMultiplier(effectiveLevel);
    
    return {
      baseLevel,
      effectiveLevel,
      multiplier,
      eternalBonus,
      synergyBonus
    };
  });

  const totalMultiplier = mainMultiplier + skillData.reduce((acc, s) => acc + s.multiplier, 0);

  // --- Helpers ---

  const getMainLabel = () => {
    if (mainLevel === 0) return "無";
    return MAIN_BATTLE_COSTS[mainLevel - 1].label || `Lv ${mainLevel}`;
  };

  const getMainRankColor = () => {
    if (mainLevel === 0) return "text-gray-500";
    const rank = MAIN_BATTLE_COSTS[mainLevel - 1].rank;
    switch (rank) {
      case MainRank.GOLD: return "text-rank-gold";
      case MainRank.RED: return "text-rank-red";
      case MainRank.ETERNAL: return "text-rank-eternal";
      default: return "text-gray-400";
    }
  };

  const getMainBorderColor = () => {
     if (mainLevel === 0) return "border-gray-700";
     const rank = MAIN_BATTLE_COSTS[mainLevel - 1].rank;
     switch (rank) {
       case MainRank.GOLD: return "border-amber-500/50 shadow-amber-900/20";
       case MainRank.RED: return "border-red-500/50 shadow-red-900/20";
       case MainRank.ETERNAL: return "border-purple-500/50 shadow-purple-900/20";
       default: return "border-gray-700";
     }
  }

  const updateSkillLevel = (index: number, delta: number) => {
    setSkillLevels(prev => {
      const newLevels = [...prev];
      const newLevel = newLevels[index] + delta;
      
      if (newLevel < MIN_SKILL_LEVEL || newLevel > MAX_SKILL_LEVEL) {
        return prev;
      }
      
      newLevels[index] = newLevel;
      return newLevels;
    });
  };

  const openSelector = (type: 'main' | 'skill', index: number = 0) => {
    setSelector({ isOpen: true, type, index });
  };

  const closeSelector = () => {
    setSelector(prev => ({ ...prev, isOpen: false }));
  };

  const handleCharacterSelect = (char: Character) => {
    if (selector.type === 'main') {
      setMainCharacter(char);
    } else if (selector.type === 'skill') {
      setSkillCharacters(prev => {
        const newChars = [...prev];
        newChars[selector.index] = char;
        return newChars;
      });
    }
    closeSelector();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Reorganized for Desktop Layout */}
        <header className="flex flex-col gap-6 border-b border-gray-800 pb-6">
          
          {/* Title - Centered on Mobile, Left on Desktop */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              五代麥樂獸拼圖配點
            </h1>
            <p className="text-gray-500 mt-1">計算最佳的主戰與特技等級分配</p>
          </div>
          
          {/* Controls Toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            
            {/* LEFT: Free Mode Toggle */}
            <div className="w-full md:w-auto flex justify-center md:justify-start order-1">
              <button
                onClick={() => setIsFreeMode(!isFreeMode)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all w-full md:w-auto ${
                  isFreeMode 
                    ? 'bg-purple-900/30 border-purple-500/50 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'
                }`}
              >
                {isFreeMode ? <Unlock size={18} /> : <Lock size={18} />}
                <span className="font-medium whitespace-nowrap">自由配點</span>
              </button>
            </div>

            {/* CENTER: Total Multiplier Display */}
            <div className="w-full md:w-auto flex justify-center order-2">
              <div className="bg-blue-900/20 border border-blue-500/30 px-6 py-3 rounded-xl flex items-center justify-center gap-3 w-full md:w-auto">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <p className="text-xs text-blue-300 uppercase font-bold tracking-wider">總倍率加成</p>
                    <p className="text-2xl font-mono font-bold text-white shadow-glow text-center">{totalMultiplier}%</p>
                </div>
              </div>
            </div>

            {/* RIGHT: Shard Input */}
            <div className="w-full md:w-auto flex justify-center md:justify-end order-3">
               <div className={`flex items-center justify-center sm:justify-end gap-4 p-4 rounded-xl border shadow-inner transition-colors w-full md:w-auto ${
                isFreeMode ? 'bg-purple-900/10 border-purple-900/30' : 'bg-gray-900 border-gray-800'
              }`}>
                <div className="text-center sm:text-right w-full">
                  <label htmlFor="shardInput" className="block text-xs text-gray-400 uppercase font-bold mb-1 flex items-center justify-center sm:justify-end gap-1">
                    {isFreeMode ? (
                       <>
                         <Calculator size={12} /> 自動計算總和
                       </>
                    ) : "擁有總碎片量"}
                  </label>
                  <div className="relative flex justify-center sm:justify-end">
                    <input
                      id="shardInput"
                      type="text"
                      inputMode="numeric"
                      value={inputValue}
                      readOnly={isFreeMode}
                      onChange={handleInputChange}
                      placeholder="0"
                      className={`w-32 bg-gray-800 text-2xl font-mono font-bold border rounded-lg py-1 px-3 outline-none text-center sm:text-right transition-all ${
                        isFreeMode 
                          ? 'text-purple-300 border-purple-500/30 bg-purple-900/20 cursor-default' 
                          : 'text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Warning if over budget (Only show in Normal Mode) */}
        {!isFreeMode && remainingShards < 0 && (
           <div className="bg-red-900/20 border border-red-800/50 text-red-200 p-4 rounded-lg flex items-center gap-3 animate-pulse">
             <AlertTriangle className="w-5 h-5 text-red-500" />
             <span>碎片不足！你需要額外 {Math.abs(remainingShards)} 個碎片來維持當前配置。</span>
           </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <StatControl
            title="主戰等級"
            icon={<Swords size={20} />}
            currentLevelLabel={getMainLabel()}
            currentCost={currentMainCost}
            nextCost={nextMainCost}
            canIncrease={canIncreaseMain}
            canDecrease={canDecreaseMain}
            onIncrease={() => setMainLevel(prev => prev + 1)}
            onDecrease={() => setMainLevel(prev => prev - 1)}
            colorClass={getMainRankColor()}
            rankColor={getMainBorderColor()}
            description="提升主戰階段 (金 -> 紅 -> 永恆)"
            character={mainCharacter}
            onIconClick={() => openSelector('main')}
            showCharacterName={true}
            // Multiplier props
            multiplier={mainMultiplier}
          />

          {skillLevels.map((level, index) => {
            const data = skillData[index];
            const currentCost = SKILL_COSTS[level - 1].cumulativeCost;
            const nextCost = level < MAX_SKILL_LEVEL ? SKILL_COSTS[level].cost : null;
            
            // In Free Mode, allow increase if not max level. In Normal Mode, check budget.
            const canIncrease = nextCost !== null && (isFreeMode || remainingShards >= nextCost);
            const canDecrease = level > MIN_SKILL_LEVEL;

            const isWarning = !isSynergyUnlocked && level >= 16;

            return (
              <StatControl
                key={`skill-${index}`}
                title={`特技 ${index + 1}`}
                icon={<Zap size={20} />}
                currentLevelLabel={`Lv ${level}`}
                currentCost={currentCost}
                nextCost={nextCost}
                canIncrease={canIncrease}
                canDecrease={canDecrease}
                onIncrease={() => updateSkillLevel(index, 1)}
                onDecrease={() => updateSkillLevel(index, -1)}
                colorClass="text-blue-400"
                rankColor="border-blue-500/30 shadow-blue-900/10"
                description={
                  isWarning
                    ? <span className="text-white font-bold text-base">需主戰紅3以上觸發加成</span>
                    : `特技 ${index + 1} 等級 (基礎 Lv3)`
                }
                character={skillCharacters[index]}
                onIconClick={() => openSelector('skill', index)}
                showCharacterName={false}
                // Multiplier props
                multiplier={data.multiplier}
                eternalBonusActive={data.eternalBonus > 0}
                synergyBonusCount={data.synergyBonus}
              />
            );
          })}

        </div>

        <ShardSummary 
          totalLimit={totalShards}
          usedMain={currentMainCost}
          usedSkill={currentTotalSkillCost}
        />

        {/* Reference Data Table */}
        <div className="mt-12 border-t border-gray-800 pt-8">
            <h3 className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-widest">階段參考表</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-800">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-900">
                        <tr>
                            <th className="px-6 py-3">階段</th>
                            <th className="px-6 py-3">累計碎片</th>
                            <th className="px-6 py-3">該級成本</th>
                            <th className="px-6 py-3">倍率</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MAIN_BATTLE_COSTS.map((m) => (
                            <tr key={`main-${m.level}`} className="bg-gray-850 border-b border-gray-800 hover:bg-gray-800">
                                <td className={`px-6 py-2 font-medium ${
                                    m.rank === MainRank.GOLD ? 'text-rank-gold' : 
                                    m.rank === MainRank.RED ? 'text-rank-red' : 'text-rank-eternal'
                                }`}>
                                    {m.label}
                                </td>
                                <td className="px-6 py-2">{m.cumulativeCost}</td>
                                <td className="px-6 py-2">{m.cost}</td>
                                <td className="px-6 py-2 font-mono text-gray-300">{getMainMultiplier(m.level)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="text-center text-gray-600 text-sm font-medium pb-8">
          程式製作_by26
        </div>

      </div>

      <CharacterSelector 
        isOpen={selector.isOpen}
        onClose={closeSelector}
        onSelect={handleCharacterSelect}
        title={selector.type === 'main' ? '選擇主戰麥樂獸' : `選擇特技 ${selector.index + 1} 麥樂獸`}
      />
    </div>
  );
};

export default App;