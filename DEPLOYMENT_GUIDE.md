# 🚀 Deployment Guide - The Chef Restaurant

## GitHub'ga Push Qilish

### Variant 1: GitHub Desktop (Eng Oson)

1. **GitHub Desktop yuklab oling**: https://desktop.github.com/
2. GitHub Desktop'ni oching
3. "Add Existing Repository" ni tanlang
4. Loyihangiz papkasini tanlang: `C:\Users\user\Desktop\the chef cafe`
5. "Publish repository" tugmasini bosing
6. Repository nomini kiriting: `the-chef`
7. "Publish Repository" ni bosing

### Variant 2: Personal Access Token (Terminal)

1. **GitHub'da Token yarating**:
   - GitHub.com'ga kiring
   - Settings > Developer settings > Personal access tokens > Tokens (classic)
   - "Generate new token (classic)" ni bosing
   - Nomini kiriting: `the-chef-deployment`
   - Quyidagi ruxsatlarni belgilang:
     - ✅ `repo` (barcha repo ruxsatlari)
   - "Generate token" ni bosing
   - **Token'ni nusxalab oling** (faqat bir marta ko'rsatiladi!)

2. **Terminal'da push qiling**:
```bash
# Token bilan push qilish
git push https://YOUR_TOKEN@github.com/shavqiddinovich87-ops/the-chef.git main
```

### Variant 3: SSH Key (Xavfsizroq)

1. **SSH key yarating**:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Enter bosing (default location)
# Parol kiriting (ixtiyoriy)
```

2. **SSH key'ni GitHub'ga qo'shing**:
```bash
# Public key'ni ko'rsatish
type %USERPROFILE%\.ssh\id_ed25519.pub
```
   - GitHub.com > Settings > SSH and GPG keys > New SSH key
   - Key'ni joylashtiring va saqlang

3. **Remote URL'ni o'zgartiring**:
```bash
git remote set-url origin git@github.com:shavqiddinovich87-ops/the-chef.git
git push -u origin main
```

---

## 🌐 Frontend Deploy (Vercel - Tavsiya Etiladi)

### Vercel bilan Deploy

**Nima uchun Vercel?**
- ✅ Bepul HTTPS
- ✅ Avtomatik PWA qo'llab-quvvatlash
- ✅ Tez deploy
- ✅ GitHub bilan integratsiya

**Qadamlar:**

1. **Vercel akkaunt yarating**: https://vercel.com/signup
   - GitHub akkauntingiz bilan kiring

2. **Loyihani import qiling**:
   - "Add New Project" ni bosing
   - GitHub repository'ni tanlang: `the-chef`
   - "Import" ni bosing

3. **Sozlamalar**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables qo'shing**:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
   (Backend deploy qilgandan keyin yangilang)

5. **Deploy tugmasini bosing!**

6. **Natija**:
   - Sizga URL beriladi: `https://the-chef-xyz.vercel.app`
   - Har safar GitHub'ga push qilganingizda avtomatik yangilanadi
   - HTTPS avtomatik ishlaydi
   - PWA o'rnatish avtomatik ishlaydi! 🎉

---

## 🔧 Backend Deploy (Railway - Tavsiya Etiladi)

### Railway bilan Deploy

**Nima uchun Railway?**
- ✅ Bepul MongoDB
- ✅ Bepul HTTPS
- ✅ Oson sozlash
- ✅ GitHub bilan integratsiya

**Qadamlar:**

1. **Railway akkaunt yarating**: https://railway.app/
   - GitHub akkauntingiz bilan kiring

2. **Yangi loyiha yarating**:
   - "New Project" > "Deploy from GitHub repo"
   - `the-chef` repository'ni tanlang

3. **Backend service qo'shing**:
   - "Add Service" > "GitHub Repo"
   - Root Directory: `backend`

4. **MongoDB qo'shing**:
   - "New" > "Database" > "Add MongoDB"
   - Connection string avtomatik yaratiladi

5. **Environment Variables**:
   Railway avtomatik `MONGODB_URI` ni qo'shadi. Qo'shimcha qo'shing:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this
   PORT=5000
   ```

6. **Build sozlamalari**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

7. **Deploy!**
   - Railway avtomatik deploy qiladi
   - URL: `https://your-backend.railway.app`

8. **Frontend'ni yangilang**:
   - Vercel'da `VITE_API_URL` ni yangilang
   - Railway backend URL'ni kiriting

---

## 🎯 Alternative: Netlify (Frontend)

1. **Netlify akkaunt**: https://netlify.com
2. "Add new site" > "Import from Git"
3. Repository tanlang
4. Sozlamalar:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Environment variables qo'shing
6. Deploy!

---

## 🎯 Alternative: Render (Backend)

1. **Render akkaunt**: https://render.com
2. "New" > "Web Service"
3. Repository tanlang
4. Sozlamalar:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Environment variables qo'shing
6. Deploy!

---

## ✅ Deploy Tekshirish

### Frontend Tekshirish:
1. Vercel URL'ni oching
2. F12 > Application > Manifest - to'g'ri ko'rinishi kerak
3. F12 > Application > Service Workers - "activated" bo'lishi kerak
4. Chrome address bar'da o'rnatish belgisi (⬇️) paydo bo'lishi kerak
5. "O'rnatish" tugmasini bosing - ilova o'rnatilishi kerak! 🎉

### Backend Tekshirish:
1. Railway URL'ni oching: `https://your-backend.railway.app/api/health`
2. JSON response qaytishi kerak
3. MongoDB ulanganini tekshiring

### PWA Tekshirish:
1. Chrome DevTools > Lighthouse
2. "Progressive Web App" testini ishga tushiring
3. 90+ ball olish kerak

---

## 🔄 Yangilanishlar

Har safar GitHub'ga push qilganingizda:
- Vercel avtomatik frontend'ni yangilaydi
- Railway avtomatik backend'ni yangilaydi
- PWA foydalanuvchilarga avtomatik yangilanadi

---

## 🆘 Muammolar

### "Permission denied" xatosi
- GitHub Desktop ishlatib ko'ring (eng oson)
- Yoki Personal Access Token yarating

### PWA o'rnatilmayapti
- HTTPS ishlaganini tekshiring (Vercel avtomatik beradi)
- Service Worker ro'yxatdan o'tganini tekshiring
- Manifest fayli to'g'ri yuklanganini tekshiring

### Backend ulanmayapti
- CORS sozlamalarini tekshiring
- Environment variables to'g'ri kiritilganini tekshiring
- MongoDB connection string to'g'ri ekanligini tekshiring

---

## 📱 Natija

Deploy qilgandan keyin:
- ✅ HTTPS bilan ishlaydi
- ✅ PWA sifatida o'rnatiladi
- ✅ Offline ishlaydi
- ✅ Tez yuklaydi
- ✅ Mobile-friendly
- ✅ Production-ready

**Muvaffaqiyatli deploy! 🎉**
