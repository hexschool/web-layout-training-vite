# 網頁切版直播班 Vite 範例 - Bootstrap 版本

## Node.js 版本
  - 專案的 Node.js 版本需為 v16 以上
  - 查看自己版本指令：`node -v`


## 指令列表
- `npm install` - 初次下載該範例專案後，需要使用 npm install 來安裝套件
- `npm run dev` - 執行開發模式
  - 若沒有自動開啟瀏覽器，可嘗試手動在瀏覽器上輸入
    `http://localhost:5173/<專案名稱>/pages/index.html`
- `npm run build` - 執行編譯模式（不會開啟瀏覽器）


## 資料夾結構
  - assets # 靜態資源放置處
    - images # 圖片放置處
    - scss # SCSS 的樣式放置處

  - layout # ejs 模板放置處
  - pages # 頁面放置處

- JavaScript 程式碼可寫在 main.js 檔案

### 注意事項
- 已將 pages 資料夾內的 index.html 預設為首頁，建議不要任意修改 index.html 的檔案名稱
- .gitignore 檔案是用來忽略掉不該上傳到 GitHub 的檔案（例如 node_modules），請不要移除 .gitignore

## 開發模式的監聽
vite 專案執行開發模式 `npm run dev` 後即會自動監聽，不需要使用 `Live Sass Compiler` 的 `Watch SCSS` 功能


## 部署 gh-pages 流程說明
### Windows 版本
1. 在 GitHub 建立一個新的 Repository

2. 打開本地專案 vite.config.js 檔案，可以看見 `base: '/deploy-test/'` 這行程式碼，請將 deploy-test 替換成自己的專案名稱。例如：我在上方第一步建立的新 Repository 專案名稱取名為 homework，那麼 `base: '/deploy-test/'` 就要改為 `base: '/homework/'`

3. 使用 VS Code 打開本地專案 deploy.sh 檔案，將第 17 行的程式碼最前方的「#」符號移除，並將「<>」內的內容改為自己的 GitHub  帳號以及自己的專案名稱。範例：假如我的 GitHub 帳號是「john」，Repository 專案名稱是 「homework」那麼就將這行
`# git push -f https://github.com/<你的 GitHub 帳號>/<你的 Repository 的名稱> main:gh-pages`
改為
`git push -f https://github.com/john/homework main:gh-pages`
（注意：最前方的「#」符號需要移除，才能打開註解來順利執行）

4. 移除第 19 行的程式碼
 `git push -f https://github.com/amanoizumi/deploy-test main:gh-pages`


5. 完成以上操作後就可以開始部署，部署前請務必先將原始碼上傳到 GitHub Repository 也就是初始化 GitHub，因此通常第一步驟會在專案終端機輸入以下指令
```cmd
git init # 若已經初始化過就可以不用輸入
git add .
git commit -m 'first commit'
git branch -M main
git remote add origin [GitHub Repositories Url]
git push -u origin main // 僅限第一次輸入，往後只需要輸入 git push
```

6. 初始化完畢後，在本地電腦的專案資料夾，使用滑鼠雙擊 deploy.sh 後即會開始自動部署 gh-pages
