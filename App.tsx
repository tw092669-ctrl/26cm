import React, { useState, useMemo, useEffect } from 'react';
import { 
  MAIN_BATTLE_COSTS, 
  SKILL_COSTS, 
  MAX_MAIN_LEVEL, 
  MAX_SKILL_LEVEL, 
  MIN_SKILL_LEVEL,
  MAIN_CHARACTERS,
  SKILL_CHARACTERS,
  getMainMultiplier,
  getSkillMultiplier
} from './constants';
import { MainRank, Character } from './types';
import { StatControl } from './components/StatControl';
import { ShardSummary } from './components/ShardSummary';
import { CharacterSelector } from './components/CharacterSelector';
import { Swords, Zap, AlertTriangle, TrendingUp, Calculator, Lock, Unlock, Sparkles } from 'lucide-react';

interface SelectorState {
  isOpen: boolean;
  type: 'main' | 'skill' | null;
  index: number;
}

const CHARACTER_EFFECTS: Record<string, string> = {
  'pink1': "攜帶來自不同樂隊成員的特技，使覺醒擁有不同效果",
  'white1': "當角色未造成爆擊和技巧時，下次傷害爆擊/技巧提高5%，可疊加，直到造成爆擊或技巧重置",
  'black1': "覺醒開始和覺醒結束時嘲諷場上所有敵人，持續10秒；覺醒期間受到的傷害額外降低20%",
  'purple1': "覺醒期間每秒為我方成員恢復最大生命值4%的固定生命值(如果場上有其他麥樂獸造成治療，則「秋日影」治療效果不生效)",
  'yellow1': "本場戰鬥中任意時間(包括未覺醒)成功打斷或驅散首領敵人，造成的傷害額外提高40%，持續到戰鬥結束，不可疊加",
};

const App: React.FC = () => {
  // Mode State
  const [isFreeMode, setIsFreeMode] = useState<boolean>(true);

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
    return skillLevels.reduce((total, level, index) => {
      // If the character is Gen 4 (id='gen4'), it costs 0
      if (skillCharacters[index]?.id === 'gen4') return total;
      return total + SKILL_COSTS[level - 1].cumulativeCost;
    }, 0);
  }, [skillLevels, skillCharacters]);

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
  const isEternalBonusActive = mainLevel === 15;
  const isSynergyUnlocked = mainLevel >= 8;

  const getSynergyBonus = (selfIndex: number) => {
    if (!isSynergyUnlocked) return 0;

    const myLevel = skillLevels[selfIndex];
    let maxBonus = 0;

    skillLevels.forEach((otherLevel, index) => {
      if (index === selfIndex) return;

      // Gen 4 does not participate in synergy as a provider (independent)
      if (skillCharacters[index]?.id === 'gen4') return;

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
    const char = skillCharacters[index];
    const isGen4 = char?.id === 'gen4';

    const eternalBonus = isEternalBonusActive ? 1 : 0;
    
    // Gen 4 does not receive synergy bonuses
    const synergyBonus = isGen4 ? 0 : getSynergyBonus(index);
    
    // Effective level for multiplier calculation only (not cost)
    const effectiveLevel = baseLevel + eternalBonus + synergyBonus;
    
    let multiplier;
    if (isGen4) {
      // Gen 4 Formula: 55% + (Level - 1) * 12%
      // Level 1 = 55%, Level 19 = 271%
      multiplier = 55 + (effectiveLevel - 1) * 12;
    } else {
      multiplier = getSkillMultiplier(effectiveLevel);
    }
    
    return {
      baseLevel,
      effectiveLevel,
      multiplier,
      eternalBonus,
      synergyBonus,
      isGen4
    };
  });

  const totalMultiplier = mainMultiplier + skillData.reduce((acc, s) => acc + s.multiplier, 0);

  // --- Dynamic Effects Logic ---
  const currentEffects = useMemo(() => {
    if (!mainCharacter) return [];
    
    const list = [];
    const baseEffect = CHARACTER_EFFECTS[mainCharacter.id];
    if (baseEffect) {
      list.push({ text: baseEffect, type: 'base' });
    } else {
      list.push({ text: "暫無詳細效果說明", type: 'base' });
    }

    const activeSkillIds = skillCharacters.map(s => s?.id).filter(Boolean);

    // Dynamic effects for Pink1 (天之球)
    if (mainCharacter.id === 'pink1') {
      if (activeSkillIds.includes('white2')) {
        list.push({ text: "覺醒結束時結算覺醒期間對當前目標累計造成傷害的15%，造成1次額外範圍傷害", type: 'combo' });
      }
      if (activeSkillIds.includes('black2')) {
        list.push({ text: "造成傷害時有15%概率追加1次等額傷害", type: 'combo' });
      }
      if (activeSkillIds.includes('purple2')) {
        list.push({ text: "覺醒持續時間延長5秒", type: 'combo' });
      }
      if (activeSkillIds.includes('yellow2')) {
        list.push({ text: "覺醒充能時間縮短10秒", type: 'combo' });
      }
    }

    // Dynamic effects for White1 (藍色星球)
    if (mainCharacter.id === 'white1') {
      if (activeSkillIds.includes('white2')) {
        list.push({ text: '增益效果改為只有"巧爆"傷害出現時才重置', type: 'combo' });
      }
      if (activeSkillIds.includes('pink2')) {
        list.push({ text: '自身造成"巧爆"傷害提高30%', type: 'combo' });
      }
    }

    // Dynamic effects for Yellow1 (嘈雜街道)
    if (mainCharacter.id === 'yellow1') {
      if (activeSkillIds.includes('pink2')) {
        list.push({ text: '增益由不可疊加變為最多可疊加4層', type: 'combo' });
      }
    }

    // Dynamic effects for Purple1 (秋日影)
    if (mainCharacter.id === 'purple1') {
      if (activeSkillIds.includes('white2')) {
        list.push({ text: '增益效果改為只有“巧爆”傷害出現時才重置', type: 'combo' });
      }
      if (activeSkillIds.includes('pink2')) {
        list.push({ text: '覺醒持續超過5秒後，能夠主動點擊覺醒按鈕關閉覺醒，並根據剩餘時間百分比返還充能進度', type: 'combo' });
      }
    }

    // Dynamic effects for Black1 (輕飄飄時間)
    if (mainCharacter.id === 'black1') {
      if (activeSkillIds.includes('white2')) {
        list.push({ text: '增益效果改為只有“巧爆”傷害出現時才重置', type: 'combo' });
      }
      if (activeSkillIds.includes('pink2')) {
        list.push({ text: '開啟覺醒激活「狂熱鼓點」：我方成員累計對當前目標造成600次傷害後，接下來20秒內，我方成員造成傷害額外提高15%', type: 'combo' });
      }
    }

    return list;
  }, [mainCharacter, skillCharacters]);

  // --- Helpers ---

  const getMainLabel = () => {
    if (mainLevel === 0) return "無";
    return MAIN_BATTLE_COSTS[mainLevel - 1].label || `Lv ${mainLevel}`;
  };

  const getMainRankColor = () => {
    // Kept for prop compatibility, though StatControl now handles styling internally
    return "";
  };

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

  // Determine which list to show in the selector
  const getSelectorCharacters = () => {
    if (selector.type === 'main') return MAIN_CHARACTERS;
    if (selector.type === 'skill') return SKILL_CHARACTERS;
    return [];
  };

  return (
    <div className="min-h-screen bg-cream-50 text-coffee-800 p-2 sm:p-4 md:p-8 font-sans selection:bg-amber-200">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-8">
        
        {/* Header */}
        <header className="flex flex-col gap-4 sm:gap-6 border-b-2 border-cream-300 pb-4 sm:pb-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-coffee-800 tracking-tight">
              五代麥樂獸拼圖配點
            </h1>
            <p className="text-xs sm:text-base text-coffee-600 mt-1">計算最佳的主戰與特技等級分配</p>
          </div>
          
          {/* Controls Toolbar */}
          <div className="grid grid-cols-2 gap-3 w-full md:flex md:flex-row md:items-center md:justify-between md:gap-4">
            
            {/* 1. Free Mode Toggle */}
            {/* Desktop: Order 1 (Left), Mobile: Order 2 (Bottom Left) */}
            <div className="order-2 md:order-1 col-span-1 flex justify-start w-full md:w-auto">
              <button
                onClick={() => setIsFreeMode(!isFreeMode)}
                className={`flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full border-2 transition-all w-full md:w-auto font-bold text-xs sm:text-base ${
                  isFreeMode 
                    ? 'bg-purple-100 border-purple-400 text-purple-700 shadow-sm' 
                    : 'bg-white border-cream-300 text-coffee-400 hover:bg-cream-100'
                }`}
              >
                {isFreeMode ? <Unlock size={14} className="sm:w-4 sm:h-4" /> : <Lock size={14} className="sm:w-4 sm:h-4" />}
                <span className="whitespace-nowrap">自由配點</span>
              </button>
            </div>

            {/* 2. Total Multiplier Display */}
            {/* Desktop: Order 2 (Center), Mobile: Order 1 (Top Full Width) */}
            <div className="order-1 md:order-2 col-span-2 flex justify-center w-full md:w-auto">
              <div className="bg-white border-2 border-blue-200 px-4 py-2 sm:px-6 rounded-full flex items-center justify-center gap-2 sm:gap-3 w-full md:w-auto shadow-sm">
                <div className="p-1 sm:p-1.5 bg-blue-100 rounded-full text-blue-500">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                    <span className="text-[10px] sm:text-xs text-blue-400 uppercase font-bold tracking-wider block leading-none">總倍率</span>
                    <span className="text-lg sm:text-xl font-mono font-bold text-blue-600 leading-none">{Math.round(totalMultiplier)}%</span>
                </div>
              </div>
            </div>

            {/* 3. Shard Input */}
            {/* Desktop: Order 3 (Right), Mobile: Order 3 (Bottom Right) */}
            <div className="order-3 md:order-3 col-span-1 flex justify-end w-full md:w-auto">
               <div className={`flex items-center justify-center sm:justify-end gap-1 sm:gap-3 p-1 sm:p-2 pr-3 sm:pr-4 rounded-full border-2 transition-colors w-full md:w-auto ${
                isFreeMode ? 'bg-purple-50 border-purple-200' : 'bg-white border-cream-300'
              }`}>
                <div className="text-right flex items-center gap-1 sm:gap-3 justify-between w-full md:w-auto">
                  <label htmlFor="shardInput" className="text-[10px] sm:text-xs text-coffee-400 uppercase font-bold pl-1 sm:pl-3 flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                    {isFreeMode ? (
                       <>
                         <Calculator size={12} className="sm:hidden" />
                         <Calculator size={14} className="hidden sm:block" /> 
                         <span className="hidden xs:inline">自動</span>
                       </>
                    ) : "碎片"}
                  </label>
                  <input
                    id="shardInput"
                    type="text"
                    inputMode="numeric"
                    value={inputValue}
                    readOnly={isFreeMode}
                    onChange={handleInputChange}
                    className={`w-16 sm:w-24 text-base sm:text-xl font-mono font-bold outline-none text-right bg-transparent transition-all ${
                      isFreeMode 
                        ? 'text-purple-600 cursor-default' 
                        : 'text-coffee-800 border-b-2 border-transparent focus:border-amber-400'
                    }`}
                  />
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Warning if over budget */}
        {!isFreeMode && remainingShards < 0 && (
           <div className="bg-red-50 border border-red-200 text-red-700 p-3 sm:p-4 rounded-xl flex items-center gap-3 animate-pulse shadow-sm text-sm sm:text-base">
             <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
             <span className="font-medium">碎片不足！需要額外 {Math.abs(remainingShards)} 個碎片。</span>
           </div>
        )}

        {/* Main Game Interface Area - Unified Row for Mobile */}
        <div className="flex flex-row gap-2 lg:gap-6 items-stretch">
          
          {/* LEFT: Main Battle Panel (Yellow Theme) */}
          <div className="w-[27%] lg:w-1/3 flex flex-col">
              <div className="bg-cream-100 border lg:border-2 border-cream-300 rounded-xl lg:rounded-3xl p-1.5 lg:p-6 flex flex-col items-center justify-start lg:justify-center relative overflow-hidden shadow-card h-full lg:min-h-[300px]">
                {/* Decorative Background (Reduced on mobile) */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-50"></div>
                <div className="hidden lg:block absolute -top-10 -left-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-30"></div>
                
                {/* Title - Force flex-row on mobile to match Skills height and alignment */}
                <h2 className="relative z-10 text-amber-600 font-bold mb-1 lg:mb-4 flex flex-row items-center justify-center gap-1 lg:gap-2 uppercase tracking-widest text-[8px] lg:text-sm text-center">
                    <Swords className="w-3 h-3 lg:w-4 lg:h-4" /> 
                    <span>主戰</span>
                </h2>

                <div className="relative z-10 w-full flex justify-center">
                    <StatControl
                        title="主戰等級"
                        currentLevelLabel={getMainLabel()}
                        currentCost={currentMainCost}
                        nextCost={nextMainCost}
                        canIncrease={canIncreaseMain}
                        canDecrease={canDecreaseMain}
                        onIncrease={() => setMainLevel(prev => prev + 1)}
                        onDecrease={() => setMainLevel(prev => prev - 1)}
                        colorClass={getMainRankColor()}
                        icon={<Swords className="w-6 h-6 lg:w-8 lg:h-8" />}
                        character={mainCharacter}
                        onIconClick={() => openSelector('main')}
                        showCharacterName={true}
                        isMain={true}
                        multiplier={mainMultiplier}
                    />
                </div>
              </div>
          </div>

          {/* RIGHT: Skills Panel (White Theme) */}
          <div className="w-[73%] lg:w-2/3 flex flex-col">
            <div className="bg-white border lg:border-2 border-cream-300 rounded-xl lg:rounded-3xl p-1.5 lg:p-6 shadow-card h-full">
                <h2 className="text-coffee-400 font-bold mb-1 lg:mb-6 flex items-center gap-1 lg:gap-2 uppercase tracking-widest text-[8px] lg:text-sm ml-1 lg:ml-2">
                    <Zap className="w-3 h-3 lg:w-4 lg:h-4" /> 支援
                </h2>
                
                {/* Always 3 columns (Horizontal layout on mobile) */}
                <div className="grid grid-cols-3 gap-1 sm:gap-4 lg:gap-8">
                    {skillLevels.map((level, index) => {
                        const data = skillData[index];
                        const isGen4 = data.isGen4;
                        
                        let currentCost, nextCost;
                        
                        if (isGen4) {
                            currentCost = 0;
                            nextCost = level < MAX_SKILL_LEVEL ? 0 : null;
                        } else {
                            currentCost = SKILL_COSTS[level - 1].cumulativeCost;
                            nextCost = level < MAX_SKILL_LEVEL ? SKILL_COSTS[level].cost : null;
                        }
                        
                        const canIncrease = nextCost !== null && (isFreeMode || isGen4 || remainingShards >= nextCost);
                        const canDecrease = level > MIN_SKILL_LEVEL;
                        const isWarning = !isSynergyUnlocked && level >= 16;
                        
                        // Custom description/warning for Gen 4
                        let description = isWarning ? <span className="text-red-500 text-[8px] lg:text-xs font-bold block">需紅3</span> : null;
                        if (isGen4) {
                            description = <span className="text-blue-500 text-[8px] lg:text-xs font-bold block">獨立計算</span>;
                        }

                        return (
                        <div key={`skill-${index}`} className="flex justify-center">
                            <StatControl
                                title={`特技 ${index + 1}`}
                                currentLevelLabel={`Lv ${level}`}
                                currentCost={currentCost}
                                nextCost={nextCost}
                                canIncrease={canIncrease}
                                canDecrease={canDecrease}
                                onIncrease={() => updateSkillLevel(index, 1)}
                                onDecrease={() => updateSkillLevel(index, -1)}
                                colorClass="text-blue-500"
                                icon={<Zap className="w-5 h-5 lg:w-6 lg:h-6" />}
                                description={description}
                                character={skillCharacters[index]}
                                onIconClick={() => openSelector('skill', index)}
                                showCharacterName={true}
                                multiplier={data.multiplier}
                                eternalBonusActive={data.eternalBonus > 0}
                                synergyBonusCount={data.synergyBonus}
                            />
                        </div>
                        );
                    })}
                </div>
            </div>
          </div>

        </div>

        {/* Effect Section */}
        <div className="bg-white border lg:border-2 border-cream-300 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-card transition-all">
           <h3 className="text-coffee-600 font-bold mb-2 flex items-center gap-2 text-sm lg:text-base">
              <Sparkles className="w-4 h-4 text-ui-gold" fill="#FBBF24" /> 
              <span>效果</span>
           </h3>
           <div className={`text-sm lg:text-base font-medium ${mainCharacter ? 'text-coffee-800' : 'text-coffee-400 italic'}`}>
             {!mainCharacter ? (
               "請選擇主戰麥樂獸以查看效果"
             ) : (
                <div className="space-y-2">
                  {currentEffects.map((effect, i) => (
                    <div key={i} className={`flex items-start gap-2 ${effect.type === 'combo' ? 'text-blue-600' : ''}`}>
                       {effect.type === 'combo' && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                       <span>{effect.text}</span>
                    </div>
                  ))}
                </div>
             )}
           </div>
        </div>

        <ShardSummary 
          totalLimit={totalShards}
          usedMain={currentMainCost}
          usedSkill={currentTotalSkillCost}
        />

        {/* Reference Data Table */}
        <div className="mt-8 border-t border-cream-300 pt-8 hidden sm:block">
            <h3 className="text-coffee-400 text-sm font-bold mb-4 uppercase tracking-widest text-center">階段參考表</h3>
            <div className="overflow-x-auto rounded-2xl border border-cream-300 shadow-sm">
                <table className="w-full text-sm text-left text-coffee-600 bg-white">
                    <thead className="text-xs text-coffee-500 uppercase bg-cream-100">
                        <tr>
                            <th className="px-6 py-3 font-bold">階段</th>
                            <th className="px-6 py-3 font-bold">累計碎片</th>
                            <th className="px-6 py-3 font-bold">該級成本</th>
                            <th className="px-6 py-3 font-bold">倍率</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MAIN_BATTLE_COSTS.map((m) => (
                            <tr key={`main-${m.level}`} className="border-b border-cream-100 hover:bg-cream-50">
                                <td className={`px-6 py-2 font-bold ${
                                    m.rank === MainRank.GOLD ? 'text-amber-500' : 
                                    m.rank === MainRank.RED ? 'text-red-500' : 'text-purple-500'
                                }`}>
                                    {m.label}
                                </td>
                                <td className="px-6 py-2">{m.cumulativeCost}</td>
                                <td className="px-6 py-2">{m.cost}</td>
                                <td className="px-6 py-2 font-mono text-coffee-400">{getMainMultiplier(m.level)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="text-center text-coffee-400 text-xs sm:text-sm font-medium pb-8">
          程式製作_by26
        </div>

      </div>

      <CharacterSelector 
        isOpen={selector.isOpen}
        onClose={closeSelector}
        onSelect={handleCharacterSelect}
        title={selector.type === 'main' ? '選擇主戰麥樂獸' : `選擇特技 ${selector.index + 1} 麥樂獸`}
        characters={getSelectorCharacters()}
      />
    </div>
  );
};

export default App;