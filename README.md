<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 五代麥樂獸拼圖配點工具

這是一個基於 React + TypeScript + Vite 構建的麥樂獸拼圖配點計算工具，可協助玩家規劃角色屬性配置。

## 功能特色

- 🎮 角色選擇與屬性管理
- 📊 即時數據視覺化
- 🎯 智能配點建議
- 📱 響應式設計，支援多種裝置

## 技術棧

- **框架**: React 19.2.1
- **語言**: TypeScript 5.8.2
- **構建工具**: Vite 6.2.0
- **UI 組件**: Lucide React
- **圖表**: Recharts
- **樣式**: Tailwind CSS

## 本地開發

### 前置需求

- Node.js 18+ 
- npm 或 yarn

### 安裝步驟

1. 克隆儲存庫：
   ```bash
   git clone https://github.com/tw092669-ctrl/26cm.git
   cd 26cm
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 設定環境變數（如需要）：
   在根目錄創建 `.env.local` 文件並設定 `GEMINI_API_KEY`

4. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

5. 在瀏覽器中打開 `http://localhost:3000`

## 打包部署

### 構建生產版本

```bash
npm run build
```

構建完成後，產物會生成在 `dist` 目錄。

### 預覽生產版本

```bash
npm run preview
```

### GitHub Pages 部署

專案已配置為可直接部署到 GitHub Pages。

**快速部署**：
```bash
npm run deploy
```

或使用 GitHub Actions 自動部署（推送到 main 分支即可）。

詳細部署說明請參考 [DEPLOYMENT.md](DEPLOYMENT.md)

## 專案結構

```
26cm/
├── components/          # React 組件
│   ├── CharacterSelector.tsx
│   ├── ShardSummary.tsx
│   └── StatControl.tsx
├── App.tsx             # 主應用組件
├── index.tsx           # 應用入口
├── constants.ts        # 常量定義
├── types.ts            # TypeScript 類型定義
├── vite.config.ts      # Vite 配置
├── tailwind.config.js  # Tailwind 配置
├── postcss.config.js   # PostCSS 配置
└── package.json        # 專案依賴

```

## 授權

MIT License

## 相關連結

- AI Studio App: https://ai.studio/apps/drive/1OlHarFO0cPCX8pEenR4CI7cU-3dhlVls
