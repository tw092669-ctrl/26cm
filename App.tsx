
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Plus, Settings as SettingsIcon, Download, FileSpreadsheet, 
  Image as ImageIcon, Trash2, Database, Grid, List as ListIcon 
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { Product, CategoryOptions, ItemColors, GoogleSheetConfig, SheetSyncStatus } from './types';
import { INITIAL_OPTIONS, MOCK_PRODUCTS } from './constants';
import { fetchSheetData, parseSheetData, formatForClipboard } from './services/googleSheetService';
import Settings from './components/Settings';
import ProductForm from './components/ProductForm';

// --- Utility Functions ---
const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

const App: React.FC = () => {
  // --- State ---
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('products', MOCK_PRODUCTS));
  const [options, setOptions] = useState<CategoryOptions>(() => loadFromStorage('options', INITIAL_OPTIONS));
  const [itemColors, setItemColors] = useState<ItemColors>(() => loadFromStorage('itemColors', {}));
  
  // Sheet Config State
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>(() => loadFromStorage('sheetConfig', {
    apiKey: '',
    spreadsheetId: '',
    range: 'Sheet1'
  }));
  const [sheetSyncStatus, setSheetSyncStatus] = useState<SheetSyncStatus>(SheetSyncStatus.IDLE);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // View Config
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Refs
  const exportRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    saveToStorage('products', products);
  }, [products]);

  useEffect(() => {
    saveToStorage('options', options);
  }, [options]);

  useEffect(() => {
    saveToStorage('itemColors', itemColors);
  }, [itemColors]);

  useEffect(() => {
    saveToStorage('sheetConfig', sheetConfig);
  }, [sheetConfig]);

  // --- Handlers ---
  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [product, ...prev]);
    }
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('您確定要刪除此產品嗎？')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      // Close form if open and deleting the current product
      if (editingProduct?.id === id) {
        setIsFormOpen(false);
        setEditingProduct(undefined);
      }
    }
  };

  const handleColorChange = (item: string, color: string) => {
    setItemColors(prev => ({
      ...prev,
      [item]: color
    }));
  };

  // --- Google Sheet Handlers ---
  const handleImportSheet = async () => {
    if (!sheetConfig.apiKey || !sheetConfig.spreadsheetId) return;
    
    setSheetSyncStatus(SheetSyncStatus.SYNCING);
    try {
      const rows = await fetchSheetData(sheetConfig.apiKey, sheetConfig.spreadsheetId, sheetConfig.range);
      const newProducts = parseSheetData(rows);
      
      const fullProducts = newProducts.map(p => ({
        id: crypto.randomUUID(),
        updatedAt: Date.now(),
        name: p.name || '未命名',
        brand: p.brand || '',
        capacity: p.capacity || '',
        type: p.type || '',
        diameter: p.diameter || '',
        environment: p.environment || '',
        size: p.size || '',
        price: p.price || 0,
      }));

      if (fullProducts.length > 0) {
        setProducts(prev => [...prev, ...fullProducts]);
        
        // Auto-update options
        const newOptions = { ...options };
        fullProducts.forEach(p => {
          if (p.brand && !newOptions.brands.includes(p.brand)) newOptions.brands.push(p.brand);
          if (p.capacity && !newOptions.capacities.includes(p.capacity)) newOptions.capacities.push(p.capacity);
          if (p.type && !newOptions.types.includes(p.type)) newOptions.types.push(p.type);
          if (p.diameter && !newOptions.diameters.includes(p.diameter)) newOptions.diameters.push(p.diameter);
          if (p.environment && !newOptions.environments.includes(p.environment)) newOptions.environments.push(p.environment);
          if (p.size && !newOptions.sizes.includes(p.size)) newOptions.sizes.push(p.size);
        });
        setOptions(newOptions);
      }
      
      setSheetSyncStatus(SheetSyncStatus.SUCCESS);
      setTimeout(() => setSheetSyncStatus(SheetSyncStatus.IDLE), 3000);
    } catch (error) {
      console.error(error);
      setSheetSyncStatus(SheetSyncStatus.ERROR);
    }
  };

  const handleExportSheet = () => {
    const text = formatForClipboard(products);
    navigator.clipboard.writeText(text).then(() => {
      alert("資料已複製到剪貼簿！\n請開啟 Google 試算表並貼上 (Ctrl+V)。");
    });
  };

  // --- Export Features ---
  const handleExportImage = async () => {
    if (!exportRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(exportRef.current, { backgroundColor: '#f8fafc' });
      const link = document.createElement('a');
      link.download = `inventory-snapshot-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed', error);
      alert('圖檔匯出失敗。');
    }
  };

  const handleExportCSV = () => {
    const headers = ['產品名稱', '品牌', '能力', '種類', '管徑', '環境', '尺寸', '價格'];
    const rows = products.map(p => [
      p.name, p.brand, p.capacity, p.type, p.diameter, p.environment, p.size, p.price
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.type.toLowerCase().includes(lowerQuery)
    );
  }, [products, searchQuery]);

  // --- Render ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Navbar / Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                IM
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800 hidden sm:block">
                InventoryMaster
              </h1>
            </div>

            {/* Search Bar - Center Sticky */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all duration-200 sm:text-sm"
                  placeholder="搜尋產品..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full hidden sm:block"
                title="切換檢視"
              >
                {viewMode === 'grid' ? <ListIcon size={20} /> : <Grid size={20} />}
              </button>
              
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative"
                title="系統設定"
              >
                <SettingsIcon size={20} />
              </button>

              <button
                onClick={() => { setEditingProduct(undefined); setIsFormOpen(true); }}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full font-medium shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 active:scale-95"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">新增產品</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">產品列表</h2>
            <p className="text-sm text-slate-500">
              顯示 {filteredProducts.length} 個項目
            </p>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
             <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all whitespace-nowrap"
            >
              <FileSpreadsheet size={16} className="text-green-600" />
              匯出 CSV
            </button>
            <button 
              onClick={handleExportImage}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all whitespace-nowrap"
            >
              <ImageIcon size={16} className="text-purple-600" />
              匯出圖檔
            </button>
          </div>
        </div>

        {/* Product Grid/List - The "Exportable" Area */}
        <div ref={exportRef} className={`p-1 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-4'}`}>
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className={`group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative ${viewMode === 'list' ? 'flex flex-row items-center p-4' : 'flex flex-col'}`}
            >
              {/* Product Card Content */}
              <div className={`flex-1 ${viewMode === 'list' ? 'flex items-center gap-6' : 'p-5'}`}>
                
                {/* Header/Title Area */}
                <div className={viewMode === 'list' ? 'w-1/4' : 'mb-4'}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span 
                        className="inline-block px-2 py-1 text-[10px] font-bold tracking-wider uppercase text-primary-600 bg-primary-50 rounded-md mb-2"
                        style={{ color: itemColors[product.brand] }}
                      >
                        {product.brand}
                      </span>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Attributes Grid */}
                <div className={`${viewMode === 'list' ? 'flex-1 grid grid-cols-4 gap-4' : 'grid grid-cols-2 gap-y-3 gap-x-2 text-sm'}`}>
                  
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">種類</span>
                    <span className="text-slate-700 font-medium" style={{ color: itemColors[product.type] }}>
                      {product.type}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">尺寸</span>
                    <span className="text-slate-700 font-medium" style={{ color: itemColors[product.size] }}>
                      {product.size}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">管徑</span>
                    <span className="text-slate-700 font-medium" style={{ color: itemColors[product.diameter] }}>
                      {product.diameter}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">能力</span>
                    <span className="text-slate-700 font-medium" style={{ color: itemColors[product.capacity] }}>
                      {product.capacity}
                    </span>
                  </div>
                  {viewMode !== 'list' && (
                     <div className="flex flex-col col-span-2 mt-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] uppercase text-slate-400 font-semibold">環境</span>
                      <span className="text-slate-700 font-medium flex items-center gap-1" style={{ color: itemColors[product.environment] }}>
                        {product.environment}
                      </span>
                    </div>
                  )}
                </div>

                {/* Price (Footer in Grid) */}
                <div className={`${viewMode === 'list' ? 'w-32 text-right' : 'mt-4 pt-4 border-t border-slate-100 flex justify-between items-center'}`}>
                  <span className="text-2xl font-bold text-slate-900">${product.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Overlay (Only visible on hover/focus) */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-slate-100">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setEditingProduct(product); 
                    setIsFormOpen(true); 
                  }}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                  title="編輯"
                >
                  <SettingsIcon size={16} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProduct(product.id);
                  }}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                  title="刪除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="text-slate-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-slate-900">找不到產品</h3>
              <p className="text-slate-500 mt-1">請嘗試調整搜尋條件或新增產品。</p>
              <button 
                onClick={() => { setSearchQuery(''); setIsFormOpen(true); }}
                className="mt-4 text-primary-600 font-medium hover:underline"
              >
                新增產品
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Dialogs */}
      {isSettingsOpen && (
        <Settings 
          options={options} 
          itemColors={itemColors}
          sheetConfig={sheetConfig}
          syncStatus={sheetSyncStatus}
          onConfigChange={setSheetConfig}
          onImportSheet={handleImportSheet}
          onExportSheet={handleExportSheet}
          onOptionsChange={setOptions} 
          onColorChange={handleColorChange}
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}

      {isFormOpen && (
        <ProductForm 
          initialData={editingProduct} 
          options={options} 
          onSave={handleSaveProduct} 
          onDelete={handleDeleteProduct}
          onClose={() => { setIsFormOpen(false); setEditingProduct(undefined); }} 
        />
      )}
    </div>
  );
};

export default App;
