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

- **記帳**：分別記錄「進貨支出」（品項、分類、數量、單位、金額）與「收款收入」（客戶、金額、付款方式：現金／匯款／Line Pay／月結）。今日紀錄可直接「編輯」或「刪除」，輸入錯誤隨時修改。
- **庫存盤點**：每筆進貨支出會自動出現在這裡，可依分類篩選、用「+ / −」快速調整目前庫存數量，不需要的品項可直接刪除。
- **分類品項**：管理常用材料的分類與單位；在記帳頁輸入品項時會自動帶出建議。
- **統計**：查看每月支出／收入／淨利，以及近 6 個月趨勢圖。
- **待辦電話**：記錄剛接到的生意電話，安排處理時間，避免遺漏。

**資料會自動存進瀏覽器的 localStorage**，重新整理網頁、關掉分頁再打開都不會遺失。只有在清除瀏覽器資料（清除瀏覽紀錄/Cookie）或換一台裝置、換一個瀏覽器時才會消失。如果之後想要跨裝置同步或多人共用，可以再串接後端資料庫（例如 Supabase、Firebase）。
