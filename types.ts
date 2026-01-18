export enum MainRank {
  NONE = 'None',
  GOLD = 'Gold',
  RED = 'Red',
  ETERNAL = 'Eternal'
}

export interface LevelCost {
  level: number;
  cost: number;
  cumulativeCost: number;
  chengCost?: number; // 澄閃閃需求
  cumulativeChengCost?: number; // 累計澄閃閃需求
  rank?: MainRank;
  label?: string;
}

export interface AppState {
  totalShards: number;
  mainLevelIndex: number; // 0 to 15
  skillLevelIndex: number; // 3 to 18 (mapped to index 0-15 internal logic or direct value)
}

export interface Character {
  id: string;
  name: string;
  imageUrl: string; // URL for the character image
  color: string; // Hex code for background/theme
  textColor: string;
}