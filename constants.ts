import { CategoryOptions } from './types';

export const INITIAL_OPTIONS: CategoryOptions = {
  brands: ['日立', '國際', '三菱重工', '金鼎', '華菱'],
  capacities: ['壁掛型', '埋入型', '窗型', '落地型'],
  types: ['管材', '閥門', '連接器', '感測器', '控制器'],
  diameters: ['2分3分', '2分4分', '2分5分', '3分5分', '3分6分'],
  environments: ['冷專', '冷暖'],
  sizes: ['小', '中', '大', '特大', '客製化'],
};

export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: '工業用不鏽鋼管',
    brand: '建速',
    capacity: '重型',
    type: '管材',
    diameter: '2 英寸',
    environment: '室外',
    size: '大',
    price: 1200,
    updatedAt: Date.now(),
  },
  {
    id: '2',
    name: '智慧流量感測器',
    brand: '科技巨人',
    capacity: '標準',
    type: '感測器',
    diameter: '1/2 英寸',
    environment: '室內',
    size: '小',
    price: 3500,
    updatedAt: Date.now(),
  },
];