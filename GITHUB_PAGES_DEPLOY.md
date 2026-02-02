# GitHub Pages Deploy - Qisqa Yo'riqnoma

## ⚠️ MUHIM: GitHub Pages Cheklovlari

GitHub Pages **faqat frontend**ni host qiladi:
- ✅ Dizayn ko'rinadi
- ❌ Login/Register ishlamaydi
- ❌ Menu ma'lumotlari yuklanmaydi  
- ❌ Backend API'lar ishlamaydi

**Tavsiya**: To'liq funksional loyiha uchun Vercel + Railway ishlatish yaxshiroq!

---

## 🚀 GitHub Pages Deploy Qilish

### 1. Repository Settings'ga Kiring

1. GitHub'da repository'ni oching: https://github.com/xudoyorkholov-bit/the-chef-cafe
2. "Settings" tabiga o'ting
3. Chap menuda "Pages" ni tanlang

### 2. GitHub Actions'ni Yoqing

1. "Source" qismida: **GitHub Actions** ni tanlang
2. "Configure" tugmasini bosing (Static HTML uchun)
3. Quyidagi kodni joylashtiring:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
      
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      
      - name: Build
        run: |
          cd frontend
          npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./frontend/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

4. "Commit changes" ni bosing

### 3. Deploy Kutish

1. "Actions" tabiga o'ting
2. Deploy jarayonini kuzating (2-3 daqiqa)
3. Tayyor bo'lganda: `https://xudoyorkholov-bit.github.io/the-chef-cafe/`

---

## 🎯 To'liq Funksional Loyiha (Tavsiya)

GitHub Pages o'rniga **Vercel + Railway** ishlatish:

### Vercel (Frontend):
1. https://vercel.com/login - GitHub bilan kiring
2. "New Project" > `the-chef-cafe` ni import qiling
3. **Root Directory**: `frontend` ⚠️ (MUHIM!)
4. Deploy!
5. **Natija**: `https://the-chef-cafe.vercel.app`

### Railway (Backend):
1. https://railway.app/ - GitHub bilan kiring
2. "New Project" > `the-chef-cafe` ni tanlang
3. "Add MongoDB" ni bosing
4. Environment variables qo'shing:
   ```
   NODE_ENV=production
   JWT_SECRET=your-secret-key
   PORT=5000
   ```
5. Deploy!

### Ulash:
Vercel'da Environment Variable qo'shing:
```
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 📊 Taqqoslash

| Xususiyat | GitHub Pages | Vercel + Railway |
|-----------|--------------|------------------|
| Frontend | ✅ | ✅ |
| Backend | ❌ | ✅ |
| Database | ❌ | ✅ |
| PWA O'rnatish | ⚠️ Cheklangan | ✅ To'liq |
| Login/Register | ❌ | ✅ |
| Narx | Bepul | Bepul |
| Sozlash | Oson | Juda Oson |

---

## ✅ Xulosa

**GitHub Pages**: Faqat dizaynni ko'rsatish uchun yaxshi
**Vercel + Railway**: To'liq ishlaydigan loyiha uchun eng yaxshi variant!

Qaysi variantni tanlaysiz?
