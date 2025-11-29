
export interface Product {
  id: string;
  name: string;
  brand: string;
  capacity: string;
  type: string;
  diameter: string;
  environment: string;
  size: string;
  price: number;
  updatedAt: number;
}

export interface CategoryOptions {
  brands: string[];
  capacities: string[];
  types: string[];
  diameters: string[];
  environments: string[];
  sizes: string[];
}

export type ItemColors = Record<string, string>;

export interface GoogleSheetConfig {
  apiKey: string;
  spreadsheetId: string;
  range: string;
}

export enum SheetSyncStatus {
  IDLE = 'IDLE',
  SYNCING = 'SYNCING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
