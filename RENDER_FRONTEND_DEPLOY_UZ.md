# Frontend Render'da Deploy Qilish Qo'llanmasi

Bu qo'llanma The Chef Restaurant frontend ilovasini Render platformasida deploy qilish jarayonini batafsil tushuntiradi.

## 📋 Talab qilinadigan narsalar

- ✅ GitHub repository (kod GitHub'da bo'lishi kerak)
- ✅ Render.com account (bepul)
- ✅ Backend allaqachon deploy qilingan: `https://the-chef-caffe-2jwq.onrender.com`

## 🚀 1-Qadam: Render.com'ga kirish

1. [Render.com](https://render.com) saytiga kiring
2. GitHub account bilan login qiling
3. Dashboard'ga o'ting

## 🔧 2-Qadam: Yangi Static Site yaratish

### A. New Service yaratish

1. Dashboard'da **"New +"** tugmasini bosing
2. **"Static Site"** ni tanlang
3. GitHub repository'ingizni tanlang

### B. Asosiy sozlamalar

**Service nomi:**
```
the-chef-cafe-frontend
```
yoki o'zingiz xohlagan nom

**Branch:**
```
main
```
(yoki sizning asosiy branch'ingiz)

**Root Directory:**
```
frontend
```

**Build Command:**
```bash
npm install && npm run build
```

**Publish Directory:**
```
frontend/dist
```

## 🌍 3-Qadam: Environment Variables sozlash

Frontend uchun backend URL'ini ko'rsatish kerak:

**Environment Variables** bo'limida:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://the-chef-caffe-2jwq.onrender.com/api` |
| `NODE_VERSION` | `18` |

### Qo'shish usuli:
1. **"Advanced"** bo'limini oching
2. **"Add Environment Variable"** tugmasini bosing
3. Key va Value'larni kiriting
4. **"Add"** tugmasini bosing

## 🎯 4-Qadam: Deploy qilish

1. Barcha sozlamalarni tekshiring
2. **"Create Static Site"** tugmasini bosing
3. Render avtomatik ravishda deploy qilishni boshlaydi

### Deploy jarayoni:
- ⏳ Build boshlandi...
- 📦 Dependencies o'rnatilmoqda...
- 🔨 Build qilinmoqda...
- 🚀 Deploy qilinmoqda...
- ✅ Deploy tugadi!

Bu jarayon 3-5 daqiqa davom etadi.

## 🔗 5-Qadam: URL olish

Deploy tugagandan keyin:

1. Sizga URL beriladi, masalan:
   ```
   https://the-chef-cafe-frontend.onrender.com
   ```

2. Bu URL'ni backend'da CORS uchun qo'shish kerak

## 🔄 6-Qadam: Backend CORS yangilash

Backend'da frontend URL'ini qo'shish kerak:

### A. Render Dashboard'da backend service'ni oching

1. Backend service'ingizni tanlang
2. **"Environment"** bo'limiga o'ting
3. `CORS_ORIGIN` variable'ni yangilang:

```
https://the-chef-cafe-frontend.onrender.com
```

### B. Backend'ni qayta deploy qiling

1. **"Manual Deploy"** → **"Deploy latest commit"**
2. Yoki GitHub'ga yangi commit push qiling

## ✅ 7-Qadam: Tekshirish

### Frontend tekshirish:
1. Frontend URL'ini brauzerda oching
2. Sahifa to'g'ri yuklanishini tekshiring

### Backend bilan bog'lanish tekshirish:
1. Menu sahifasini oching
2. Taomlar ro'yxati ko'rinishi kerak
3. Login qilishga harakat qiling
4. Agar CORS xatoligi bo'lsa, backend CORS sozlamalarini tekshiring

### API tekshirish:
Backend ishlayotganini tekshirish:
```
https://the-chef-caffe-2jwq.onrender.com/api/menu
```

## 🔧 Muammolarni hal qilish

### 1. "Failed to fetch" xatoligi

**Sabab:** CORS sozlanmagan

**Yechim:**
- Backend'da `CORS_ORIGIN` to'g'ri sozlanganligini tekshiring
- Backend'ni qayta deploy qiling

### 2. "404 Not Found" sahifada

**Sabab:** React Router sozlanmagan

**Yechim:**
Frontend'da `_redirects` fayli yarating:
```
frontend/public/_redirects
```

Ichiga qo'shing:
```
/*    /index.html   200
```

### 3. Environment variables ishlamayapti

**Sabab:** Build vaqtida o'qilmagan

**Yechim:**
- Render dashboard'da environment variables to'g'ri kiritilganligini tekshiring
- Manual deploy qiling

### 4. Build xatoligi

**Sabab:** Dependencies yoki kod xatoligi

**Yechim:**
- Build logs'ni o'qing
- Local'da `npm run build` ishlatib tekshiring
- Xatoliklarni tuzating va qayta push qiling

## 📱 PWA sozlamalari

Agar PWA (Progressive Web App) sifatida ishlashini istasangiz:

1. `frontend/public` papkasida `manifest.json` mavjudligini tekshiring
2. Service Worker sozlanganligini tekshiring
3. HTTPS orqali ishlayotganligini tekshiring (Render avtomatik HTTPS beradi)

## 🔄 Avtomatik Deploy

Har safar GitHub'ga push qilganingizda avtomatik deploy bo'lishi uchun:

1. Render dashboard'da service'ni oching
2. **"Settings"** → **"Build & Deploy"**
3. **"Auto-Deploy"** yoqilganligini tekshiring

Endi har safar `main` branch'ga push qilsangiz, avtomatik deploy bo'ladi!

## 📊 Monitoring

### Logs ko'rish:
1. Service'ni oching
2. **"Logs"** tab'ga o'ting
3. Real-time logs ko'ring

### Deploy history:
1. **"Events"** tab'da barcha deploy'larni ko'ring
2. Har bir deploy'ning statusini tekshiring

## 💰 Narxlar

**Free Tier:**
- ✅ Static site bepul
- ✅ 100GB bandwidth/oy
- ✅ Avtomatik HTTPS
- ✅ Custom domain qo'shish mumkin

## 🎉 Tayyor!

Endi sizning frontend va backend ham Render'da ishlayapti:

- **Frontend:** https://the-chef-cafe-frontend.onrender.com
- **Backend:** https://the-chef-caffe-2jwq.onrender.com
- **API:** https://the-chef-caffe-2jwq.onrender.com/api

Foydalanuvchilar frontend URL'idan foydalanib ilovangizga kirishlari mumkin!

## 📞 Yordam

Agar muammo bo'lsa:
- Render documentation: https://render.com/docs
- Render community: https://community.render.com
- GitHub Issues: Repository'ingizda issue oching
