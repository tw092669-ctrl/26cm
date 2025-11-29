import { Product } from '../types';

// Helper to convert CSV/TSV to Products
export const parseSheetData = (values: string[][]): Partial<Product>[] => {
  if (!values || values.length === 0) return [];

  // Assuming headers are in the first row, or we map by index
  // Order: Name, Brand, Capacity, Type, Diameter, Environment, Size, Price
  
  // Skip header if it looks like a header
  const startIdx = (values[0][0] === '產品名稱' || values[0][0] === 'Name') ? 1 : 0;

  return values.slice(startIdx).map((row): Partial<Product> | null => {
    // Basic validation
    if (!row[0]) return null;

    return {
      name: row[0],
      brand: row[1] || '',
      capacity: row[2] || '',
      type: row[3] || '',
      diameter: row[4] || '',
      environment: row[5] || '',
      size: row[6] || '',
      price: row[7] ? Number(row[7].replace(/[^0-9.]/g, '')) : 0,
    };
  }).filter((p): p is Partial<Product> => p !== null);
};

export const fetchSheetData = async (apiKey: string, spreadsheetId: string, range: string) => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.error?.message || 'Failed to fetch Google Sheet data');
  }

  const data = await response.json();
  return data.values;
};

export const formatForClipboard = (products: Product[]) => {
  const headers = ['產品名稱', '品牌', '能力', '種類', '管徑', '環境', '尺寸', '價格'];
  const rows = products.map(p => [
    p.name,
    p.brand,
    p.capacity,
    p.type,
    p.diameter,
    p.environment,
    p.size,
    p.price
  ]);

  const tsv = [
    headers.join('\t'),
    ...rows.map(r => r.join('\t'))
  ].join('\n');

  return tsv;
};
