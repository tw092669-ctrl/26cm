
import React, { useState, useEffect } from 'react';
import { Product, CategoryOptions } from '../types';
import { Sparkles, Save, X, Trash2 } from 'lucide-react';
import { suggestAttributes } from '../services/geminiService';

interface ProductFormProps {
  initialData?: Product;
  options: CategoryOptions;
  onSave: (product: Product) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, options, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    ...initialData
  });
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof Product, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAiFill = async () => {
    if (!formData.name) return;
    setIsAiLoading(true);
    try {
      const suggestions = await suggestAttributes(formData.name, options);
      setFormData(prev => ({
        ...prev,
        ...suggestions
      }));
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for older browsers or non-secure contexts
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate name and price (allow price = 0)
    if (!formData.name) return;
    if (formData.price == null || Number.isNaN(Number(formData.price))) return;

    const product: Product = {
      id: initialData?.id || generateId(),
      updatedAt: Date.now(),
      name: formData.name,
      price: Number(formData.price),
      brand: formData.brand || options.brands[0] || '',
      capacity: formData.capacity || options.capacities[0] || '',
      type: formData.type || options.types[0] || '',
      diameter: formData.diameter || options.diameters[0] || '',
      environment: formData.environment || options.environments[0] || '',
      size: formData.size || options.sizes[0] || '',
    };
    onSave(product);
  };

  const renderSelect = (label: string, field: keyof Product, list: string[]) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select
          value={formData[field] as string || ''}
          onChange={(e) => handleChange(field, e.target.value)}
          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-primary-500 outline-none text-gray-700"
        >
          <option value="" disabled>請選擇{label}</option>
          {list.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? '編輯產品' : '新增產品'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto no-scrollbar space-y-6">
          
          {/* Main Info */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">產品名稱</label>
              <div className="flex gap-2">
                <input
                  required
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="例如：不鏽鋼高壓閥門"
                  className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAiFill}
                  disabled={isAiLoading || !formData.name}
                  className={`p-3 rounded-lg text-white transition-all flex items-center justify-center gap-2
                    ${isAiLoading || !formData.name ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-lg'}
                  `}
                  title="使用 AI 自動填寫"
                >
                  {isAiLoading ? <span className="animate-spin text-xl">⟳</span> : <Sparkles size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-400">提示：輸入名稱並點擊星號按鈕以自動填入分類。</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">價格 ($)</label>
              <input
                required
                type="number"
                min="0"
                value={formData.price ?? ''}
                onChange={(e) => handleChange('price', e.target.value === '' ? 0 : Number(e.target.value))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          <div className="h-px bg-gray-100 my-4" />

          {/* Grid for Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderSelect('品牌', 'brand', options.brands)}
            {renderSelect('種類', 'type', options.types)}
            {renderSelect('能力', 'capacity', options.capacities)}
            {renderSelect('管徑', 'diameter', options.diameters)}
            {renderSelect('環境', 'environment', options.environments)}
            {renderSelect('尺寸', 'size', options.sizes)}
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            取消
          </button>
          {initialData && (
             <button
              type="button"
              onClick={() => {
                 if (confirm('確定要刪除此產品嗎？')) {
                    onDelete(initialData.id);
                 }
              }}
              className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-lg transition-colors flex items-center justify-center"
              title="刪除"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="flex-[2] py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-lg shadow-primary-500/30 transition-all flex justify-center items-center gap-2"
          >
            <Save size={18} />
            儲存產品
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
