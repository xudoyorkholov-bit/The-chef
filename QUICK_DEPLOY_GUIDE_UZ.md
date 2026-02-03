# Tez Deploy Qilish Qo'llanmasi

## 🎯 Backend allaqachon deploy qilingan
✅ **Backend URL:** https://the-chef-caffe-2jwq.onrender.com

## 🚀 Frontend Deploy Qilish (5 daqiqa)

### 1. Render.com'ga kiring
- https://render.com
- GitHub bilan login qiling

### 2. New Static Site yarating
- **New +** → **Static Site**
- Repository'ni tanlang

### 3. Sozlamalar:
```
Name: the-chef-cafe-frontend
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: frontend/dist
```

### 4. Environment Variables:
```
VITE_API_URL = https://the-chef-caffe-2jwq.onrender.com/api
NODE_VERSION = 18
```

### 5. Create Static Site
- Deploy boshlandi!
- 3-5 daqiqa kuting

### 6. Frontend URL oling
Masalan: `https://the-chef-cafe-frontend.onrender.com`

### 7. Backend CORS yangilash
Backend service → Environment → `CORS_ORIGIN` ga frontend URL'ni qo'shing

### 8. Backend'ni qayta deploy qiling
Manual Deploy → Deploy latest commit

## ✅ Tayyor!
Frontend va backend ishlayapti!

---

**Batafsil qo'llanma:** `RENDER_FRONTEND_DEPLOY_UZ.md` faylini o'qing
