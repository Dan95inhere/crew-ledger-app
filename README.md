# 工班日誌 Crew Ledger

材料進貨支出、分類品項、月收支統計、電話待辦排程 — 一站式的工班記帳工具。

## 本機開發

```bash
npm install
npm run dev
```

啟動後開啟終端機顯示的網址（預設 http://localhost:5173）。

## 建置正式版

```bash
npm run build
npm run preview
```

## 部署到 Vercel

**方式一：Vercel CLI**

```bash
npm i -g vercel
vercel
```

**方式二：GitHub 匯入**

1. 將這個資料夾推上 GitHub
2. 到 https://vercel.com/new 匯入該 repo
3. Framework Preset 選 **Vite**，其餘保持預設（Build Command: `npm run build`，Output Directory: `dist`）
4. 按 Deploy 即可

## 功能

- **記帳**：分別記錄「進貨支出」（品項、分類、數量、單位、金額）與「收款收入」
- **分類品項**：管理常用材料的分類與單位；在記帳頁輸入品項時會自動帶出建議
- **統計**：查看每月支出／收入／淨利，以及近 6 個月趨勢圖
- **待辦電話**：記錄剛接到的生意電話，安排處理時間，避免遺漏

目前資料為前端記憶體狀態（重新整理會重置），可以之後再串接資料庫或雲端同步。
