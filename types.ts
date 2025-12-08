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
  iconChar: string; // The character displayed in the SVG icon (e.g., "粉", "白")
  color: string; // Hex code for background/theme
  textColor: string;
}