
import React, { useState } from 'react';
import { CategoryOptions, ItemColors, GoogleSheetConfig, SheetSyncStatus } from '../types';
import { Plus, Trash2, X, Palette, Database, FileDown, FileUp, Save, Eye } from 'lucide-react';

interface SettingsProps {
  options: CategoryOptions;
  itemColors: ItemColors;
  sheetConfig: GoogleSheetConfig;
  syncStatus: SheetSyncStatus;
  onOptionsChange: (newOptions: CategoryOptions) => void;
  onColorChange: (item: string, color: string) => void;
  onConfigChange: (config: GoogleSheetConfig) => void;
  onImportSheet: () => void;
  onExportSheet: () => void;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<keyof CategoryOptions, string> = {
  brands: '品牌',
  capacities: '能力',
  types: '種類',
  diameters: '管徑',
  environments: '環境',
  sizes: '尺寸'
};

const Settings: React.FC<SettingsProps> = ({ 
  options, itemColors, sheetConfig, syncStatus,
  onOptionsChange, onColorChange, onConfigChange, onImportSheet, onExportSheet, onClose 
}) => {
  const [activeTab, setActiveTab] = useState<keyof CategoryOptions | 'sheet'>('brands');
  const [newItem, setNewItem] = useState('');
  const [showKey, setShowKey] = useState(false);

  const keys: (keyof CategoryOptions)[] = [
    'brands', 'capacities', 'types', 'diameters', 'environments', 'sizes'
  ];

  const handleAdd = () => {
    if (!newItem.trim() || activeTab === 'sheet') return;
    const currentList = options[activeTab];
    if (currentList.includes(newItem)) return;

    onOptionsChange({
      ...options,
      [activeTab]: [...currentList, newItem]
    });
    setNewItem('');
  };

  const handleDelete = (itemToDelete: string) => {
    if (activeTab === 'sheet') return;
    
    // Add confirmation dialog
    if (window.confirm(`確定要刪除選項「${itemToDelete}」嗎？\n此動作無法復原。`)) {
      onOptionsChange({
        ...options,
        [activeTab]: options[activeTab].filter(item => item !== itemToDelete)
      });
    }
  };

  const handleConfigUpdate = (key: keyof GoogleSheetConfig, value: string) => {
    onConfigChange({
      ...sheetConfig,
      [key]: value
    });
  };

  const renderSheetSettings = () => (
    <div className="flex flex-col h-full overflow-y-auto pr-2 space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
        <h4 className="font-bold mb-1 flex items-center gap-2">
          <Database size={16} /> Google 試算表整合
        </h4>
        <p>請設定您的 API Key 與試算表 ID 以啟用同步功能。</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Google Sheets API Key</label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={sheetConfig.apiKey}
              onChange={(e) => handleConfigUpdate('apiKey', e.target.value)}
              placeholder="輸入您的 API Key"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none pr-10"
            />
            <button 
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Spreadsheet ID (試算表 ID)</label>
          <input
            type="text"
            value={sheetConfig.spreadsheetId}
            onChange={(e) => handleConfigUpdate('spreadsheetId', e.target.value)}
            placeholder="例如: 1BxiMVs0XRA5nFMdKb..."
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">工作表名稱 (Sheet Name)</label>
          <input
            type="text"
            value={sheetConfig.range}
            onChange={(e) => handleConfigUpdate('range', e.target.value)}
            placeholder="例如: Sheet1 或 工作表1"
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <p className="text-xs text-gray-400">請確保試算表欄位順序為：名稱、品牌、能力、種類、管徑、環境、尺寸、價格。</p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <label className="text-xs font-semibold text-gray-500 uppercase block mb-3">操作動作</label>
        <div className="flex gap-3">
          <button
            onClick={onImportSheet}
            disabled={syncStatus === 'SYNCING' || !sheetConfig.apiKey || !sheetConfig.spreadsheetId}
            className={`flex-1 py-2 px-4 rounded-lg border font-medium flex items-center justify-center gap-2 transition-colors
              ${syncStatus === 'SYNCING' ? 'bg-gray-100 text-gray-400' : 'bg-white border-primary-600 text-primary-600 hover:bg-primary-50'}
            `}
          >
            {syncStatus === 'SYNCING' ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <FileDown size={18} />
            )}
            匯入資料
          </button>

          <button
            onClick={onExportSheet}
            className="flex-1 py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <FileUp size={18} />
            複製格式 (匯出)
          </button>
        </div>
        {syncStatus === 'SUCCESS' && <p className="text-green-600 text-xs mt-2 text-center">同步成功！</p>}
        {syncStatus === 'ERROR' && <p className="text-red-500 text-xs mt-2 text-center">同步失敗，請檢查設定。</p>}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">系統設定</h2>
            <p className="text-sm text-gray-500">管理分類選項與資料連結</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-1/3 bg-gray-50 border-r border-gray-100 overflow-y-auto flex flex-col">
            <div className="p-2">
              <span className="text-xs font-bold text-gray-400 px-2 uppercase">分類項目</span>
            </div>
            {keys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors
                  ${activeTab === key ? 'bg-white text-primary-600 border-l-4 border-primary-600' : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                {CATEGORY_LABELS[key]}
              </button>
            ))}
            
            <div className="mt-4 p-2 border-t border-gray-200">
               <span className="text-xs font-bold text-gray-400 px-2 uppercase">資料庫</span>
            </div>
            <button
                onClick={() => setActiveTab('sheet')}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2
                  ${activeTab === 'sheet' ? 'bg-white text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                <Database size={16} />
                資料同步
            </button>
          </div>

          {/* Content Area */}
          <div className="w-2/3 p-6 flex flex-col bg-white">
            {activeTab === 'sheet' ? (
              renderSheetSettings()
            ) : (
              <>
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder={`新增 ${CATEGORY_LABELS[activeTab as keyof CategoryOptions]}...`}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  <button
                    onClick={handleAdd}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus size={18} />
                    新增
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                  {options[activeTab as keyof CategoryOptions].length === 0 ? (
                    <div className="text-center text-gray-400 py-8">找不到項目，請新增！</div>
                  ) : (
                    options[activeTab as keyof CategoryOptions].map((item) => (
                      <div key={item} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                        <span 
                          className="text-gray-700 font-medium transition-colors"
                          style={{ color: itemColors[item] }}
                        >
                          {item}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <label className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md cursor-pointer transition-colors relative" title="更改字體顏色">
                            <input
                              type="color"
                              value={itemColors[item] || '#000000'}
                              onChange={(e) => onColorChange(item, e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <Palette size={16} />
                          </label>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="刪除"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
