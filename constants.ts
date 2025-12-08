import { LevelCost, MainRank, Character } from './types';

// Main Battle Logic
export const MAIN_BATTLE_COSTS: LevelCost[] = [
  { level: 1, cost: 2, cumulativeCost: 2, rank: MainRank.GOLD, label: "金1" },
  { level: 2, cost: 4, cumulativeCost: 6, rank: MainRank.GOLD, label: "金2" },
  { level: 3, cost: 6, cumulativeCost: 12, rank: MainRank.GOLD, label: "金3" },
  { level: 4, cost: 8, cumulativeCost: 20, rank: MainRank.GOLD, label: "金4" },
  { level: 5, cost: 10, cumulativeCost: 30, rank: MainRank.GOLD, label: "金5" },
  { level: 6, cost: 10, cumulativeCost: 40, rank: MainRank.RED, label: "紅1" },
  { level: 7, cost: 15, cumulativeCost: 55, rank: MainRank.RED, label: "紅2" },
  { level: 8, cost: 20, cumulativeCost: 75, rank: MainRank.RED, label: "紅3" },
  { level: 9, cost: 25, cumulativeCost: 100, rank: MainRank.RED, label: "紅4" },
  { level: 10, cost: 30, cumulativeCost: 130, rank: MainRank.RED, label: "紅5" },
  { level: 11, cost: 40, cumulativeCost: 170, rank: MainRank.ETERNAL, label: "永恆1" },
  { level: 12, cost: 45, cumulativeCost: 215, rank: MainRank.ETERNAL, label: "永恆2" },
  { level: 13, cost: 50, cumulativeCost: 265, rank: MainRank.ETERNAL, label: "永恆3" },
  { level: 14, cost: 55, cumulativeCost: 320, rank: MainRank.ETERNAL, label: "永恆4" },
  { level: 15, cost: 60, cumulativeCost: 380, rank: MainRank.ETERNAL, label: "永恆5" },
];

// Skill Logic
export const SKILL_COSTS: LevelCost[] = [
  { level: 1, cost: 0, cumulativeCost: 0, label: "特技1" },
  { level: 2, cost: 0, cumulativeCost: 0, label: "特技2" },
  { level: 3, cost: 0, cumulativeCost: 0, label: "特技3" },
  { level: 4, cost: 5, cumulativeCost: 5, label: "特技4" },
  { level: 5, cost: 5, cumulativeCost: 10, label: "特技5" },
  { level: 6, cost: 10, cumulativeCost: 20, label: "特技6" },
  { level: 7, cost: 10, cumulativeCost: 30, label: "特技7" },
  { level: 8, cost: 10, cumulativeCost: 40, label: "特技8" },
  { level: 9, cost: 10, cumulativeCost: 50, label: "特技9" },
  { level: 10, cost: 20, cumulativeCost: 70, label: "特技10" },
  { level: 11, cost: 30, cumulativeCost: 100, label: "特技11" },
  { level: 12, cost: 40, cumulativeCost: 140, label: "特技12" },
  { level: 13, cost: 40, cumulativeCost: 180, label: "特技13" },
  { level: 14, cost: 50, cumulativeCost: 230, label: "特技14" },
  { level: 15, cost: 50, cumulativeCost: 280, label: "特技15" },
  { level: 16, cost: 50, cumulativeCost: 330, label: "特技16" },
  { level: 17, cost: 50, cumulativeCost: 380, label: "特技17" },
  { level: 18, cost: 50, cumulativeCost: 430, label: "特技18" },
];

export const MAX_MAIN_LEVEL = 15;
export const MAX_SKILL_LEVEL = 18;
export const MIN_SKILL_LEVEL = 3;

export const AVAILABLE_CHARACTERS: Character[] = [
  { id: 'pink', name: '天之球', iconChar: '粉', color: '#ec4899', textColor: '#ffffff' },
  { id: 'white', name: '藍色星球', iconChar: '白', color: '#f3f4f6', textColor: '#1f2937' },
  { id: 'purple', name: '秋日影', iconChar: '紫', color: '#a855f7', textColor: '#ffffff' },
  { id: 'yellow', name: '鬧雜街道', iconChar: '黃', color: '#eab308', textColor: '#ffffff' },
  { id: 'black', name: '輕飄飄時間', iconChar: '黑', color: '#1f2937', textColor: '#ffffff' },
];

// --- Multiplier Helpers ---

export const getMainMultiplier = (level: number): number => {
  if (level <= 0) return 0;
  if (level <= 4) return 400; // Gold 1-4
  if (level <= 9) return 520; // Gold 5 - Red 4
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