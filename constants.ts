import { LevelCost, MainRank, Character } from './types';

// Main Battle Logic
export const MAIN_BATTLE_COSTS: LevelCost[] = [
  { level: 1, cost: 2, cumulativeCost: 2, chengCost: 10, cumulativeChengCost: 10, rank: MainRank.GOLD, label: "金1" },
  { level: 2, cost: 4, cumulativeCost: 6, chengCost: 20, cumulativeChengCost: 30, rank: MainRank.GOLD, label: "金2" },
  { level: 3, cost: 6, cumulativeCost: 12, chengCost: 30, cumulativeChengCost: 60, rank: MainRank.GOLD, label: "金3" },
  { level: 4, cost: 8, cumulativeCost: 20, chengCost: 40, cumulativeChengCost: 100, rank: MainRank.GOLD, label: "金4" },
  { level: 5, cost: 10, cumulativeCost: 30, chengCost: 50, cumulativeChengCost: 150, rank: MainRank.GOLD, label: "金5" },
  { level: 6, cost: 10, cumulativeCost: 40, chengCost: 60, cumulativeChengCost: 210, rank: MainRank.RED, label: "紅1" },
  { level: 7, cost: 15, cumulativeCost: 55, chengCost: 80, cumulativeChengCost: 290, rank: MainRank.RED, label: "紅2" },
  { level: 8, cost: 20, cumulativeCost: 75, chengCost: 100, cumulativeChengCost: 390, rank: MainRank.RED, label: "紅3" },
  { level: 9, cost: 25, cumulativeCost: 100, chengCost: 120, cumulativeChengCost: 510, rank: MainRank.RED, label: "紅4" },
  { level: 10, cost: 30, cumulativeCost: 130, chengCost: 140, cumulativeChengCost: 650, rank: MainRank.RED, label: "紅5" },
  { level: 11, cost: 40, cumulativeCost: 170, chengCost: 200, cumulativeChengCost: 850, rank: MainRank.ETERNAL, label: "永恆1" },
  { level: 12, cost: 45, cumulativeCost: 215, chengCost: 220, cumulativeChengCost: 1070, rank: MainRank.ETERNAL, label: "永恆2" },
  { level: 13, cost: 50, cumulativeCost: 265, chengCost: 240, cumulativeChengCost: 1310, rank: MainRank.ETERNAL, label: "永恆3" },
  { level: 14, cost: 55, cumulativeCost: 320, chengCost: 260, cumulativeChengCost: 1570, rank: MainRank.ETERNAL, label: "永恆4" },
  { level: 15, cost: 60, cumulativeCost: 380, chengCost: 280, cumulativeChengCost: 1850, rank: MainRank.ETERNAL, label: "永恆5" },
];

// Skill Logic
export const SKILL_COSTS: LevelCost[] = [
  { level: 1, cost: 0, cumulativeCost: 0, chengCost: 0, cumulativeChengCost: 0, label: "特技1" },
  { level: 2, cost: 0, cumulativeCost: 0, chengCost: 10, cumulativeChengCost: 10, label: "特技2" },
  { level: 3, cost: 0, cumulativeCost: 0, chengCost: 10, cumulativeChengCost: 20, label: "特技3" },
  { level: 4, cost: 5, cumulativeCost: 5, chengCost: 20, cumulativeChengCost: 40, label: "特技4" },
  { level: 5, cost: 5, cumulativeCost: 10, chengCost: 30, cumulativeChengCost: 70, label: "特技5" },
  { level: 6, cost: 10, cumulativeCost: 20, chengCost: 30, cumulativeChengCost: 100, label: "特技6" },
  { level: 7, cost: 10, cumulativeCost: 30, chengCost: 30, cumulativeChengCost: 130, label: "特技7" },
  { level: 8, cost: 10, cumulativeCost: 40, chengCost: 40, cumulativeChengCost: 170, label: "特技8" },
  { level: 9, cost: 10, cumulativeCost: 50, chengCost: 40, cumulativeChengCost: 210, label: "特技9" },
  { level: 10, cost: 20, cumulativeCost: 70, chengCost: 50, cumulativeChengCost: 260, label: "特技10" },
  { level: 11, cost: 30, cumulativeCost: 100, chengCost: 80, cumulativeChengCost: 340, label: "特技11" },
  { level: 12, cost: 40, cumulativeCost: 140, chengCost: 100, cumulativeChengCost: 440, label: "特技12" },
  { level: 13, cost: 40, cumulativeCost: 180, chengCost: 100, cumulativeChengCost: 540, label: "特技13" },
  { level: 14, cost: 50, cumulativeCost: 230, chengCost: 120, cumulativeChengCost: 660, label: "特技14" },
  { level: 15, cost: 50, cumulativeCost: 280, chengCost: 120, cumulativeChengCost: 780, label: "特技15" },
  { level: 16, cost: 50, cumulativeCost: 330, chengCost: 200, cumulativeChengCost: 980, label: "特技16" },
  { level: 17, cost: 50, cumulativeCost: 380, chengCost: 200, cumulativeChengCost: 1180, label: "特技17" },
  { level: 18, cost: 50, cumulativeCost: 430, chengCost: 200, cumulativeChengCost: 1380, label: "特技18" },
];

export const MAX_MAIN_LEVEL = 15;
export const MAX_SKILL_LEVEL = 18;
export const MIN_SKILL_LEVEL = 3;

// Defined Main Battle Characters
export const MAIN_CHARACTERS: Character[] = [
  { id: 'pink1', name: '天之球', imageUrl: 'https://i.meee.com.tw/UczHGFs.png', color: '#ec4899', textColor: '#ffffff' },
  { id: 'white1', name: '藍色星球', imageUrl: 'https://i.meee.com.tw/rRMxPEQ.png', color: '#f3f4f6', textColor: '#1f2937' },
  { id: 'black1', name: '輕飄飄時間', imageUrl: 'https://i.meee.com.tw/02pZEoj.png', color: '#1f2937', textColor: '#ffffff' },
  { id: 'purple1', name: '秋日影', imageUrl: 'https://i.meee.com.tw/MFkgY7C.png', color: '#a855f7', textColor: '#ffffff' },
  { id: 'yellow1', name: '嘈雜街道', imageUrl: 'https://i.meee.com.tw/EeoOZvq.png', color: '#eab308', textColor: '#ffffff' },
];

// Defined Skill Characters
export const SKILL_CHARACTERS: Character[] = [
  { id: 'pink2', name: '終抵繁星', imageUrl: 'https://i.meee.com.tw/xkRS7gy.png', color: '#ec4899', textColor: '#ffffff' },
  { id: 'white2', name: '搖滾與孤獨', imageUrl: 'https://i.meee.com.tw/81upJ5k.png', color: '#f3f4f6', textColor: '#1f2937' },
  { id: 'black2', name: '別叫我女士', imageUrl: 'https://i.meee.com.tw/YScEkhT.png', color: '#1f2937', textColor: '#ffffff' },
  { id: 'purple2', name: '我們的詩', imageUrl: 'https://i.meee.com.tw/lSBh3c2.png', color: '#a855f7', textColor: '#ffffff' },
  { id: 'yellow2', name: '無藥可救', imageUrl: 'https://i.meee.com.tw/b2RTzEi.png', color: '#eab308', textColor: '#ffffff' },
  { id: 'gen4', name: '4代', imageUrl: 'https://i.meee.com.tw/HNeZeC9.png', color: '#60A5FA', textColor: '#ffffff' },
];

// --- Multiplier Helpers ---

export const getMainMultiplier = (level: number): number => {
  if (level <= 0) return 0;
  if (level <= 5) return 400; // Gold 1-5
  if (level <= 9) return 520; // Red 1-4
  if (level === 10) return 640; // Red 5
  if (level <= 12) return 700; // Eternal 1-2
  return 760; // Eternal 3-5 (Level 13, 14, 15)
};

export const getSkillMultiplier = (effectiveLevel: number): number => {
  if (effectiveLevel <= 0) return 0;
  // Base 95%, +25% per level
  // Formula: 95 + (Level - 1) * 25
  return 95 + (effectiveLevel - 1) * 25;
};