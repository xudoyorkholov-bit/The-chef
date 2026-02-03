# Render.com Deployment Guide

## ✅ Backend muvaffaqiyatli deploy qilindi!
**Backend URL:** https://the-chef-cafe-qe0b.onrender.com

## 📝 Keyingi qadamlar:

### 1. Backend Environment Variables (Render.com Dashboard)

Render.com dashboard'ga kiring va backend service'ga quyidagi environment variable'ni qo'shing:

```
CORS_ORIGIN=https://the-chef-cafe-frontend.onrender.com
```

**Qanday qo'shish:**
1. https://dashboard.render.com ga kiring
2. `the-chef-cafe-backend` service'ni tanlang
3. "Environment" tab'ga o'ting
4. "Add Environment Variable" tugmasini bosing
5. Key: `CORS_ORIGIN`
6. Value: `https://the-chef-cafe-frontend.onrender.com`
7. "Save Changes" tugmasini bosing

### 2. O'zgarishlarni GitHub'ga push qiling

```bash
git add .
git commit -m "Update backend URL and CORS settings for production deployment"
git push origin main
```

### 3. Frontend deploy bo'lishini kuting

GitHub'ga push qilganingizdan keyin, Render.com avtomatik ravishda:
- Backend'ni qayta deploy qiladi (CORS sozlamalari bilan)
- Frontend'ni deploy qiladi

### 4. Deploy holatini tekshiring

**Backend:** https://the-chef-cafe-qe0b.onrender.com/health
**Frontend:** https://the-chef-cafe-frontend.onrender.com (deploy bo'lgandan keyin)

## 🔧 O'zgartirilgan fayllar:

1. ✅ `backend/src/server.ts` - CORS'ga frontend URL qo'shildi
2. ✅ `frontend/.env.production` - Backend URL yangilandi
3. ✅ `render.yaml` - Ikkala service uchun to'g'ri URL'lar

## 🚀 Deploy jarayoni:

1. Backend allaqachon ishlayapti ✅
2. Environment variable qo'shing (yuqoridagi ko'rsatma)
3. GitHub'ga push qiling
4. Frontend avtomatik deploy bo'ladi
5. Tayyor! 🎉

## 🔍 Muammolarni hal qilish:

Agar CORS xatosi bo'lsa:
- Render.com'da `CORS_ORIGIN` environment variable to'g'ri qo'shilganini tekshiring
- Backend service'ni manual ravishda qayta deploy qiling

Agar frontend API'ga ulanmasa:
- `frontend/.env.production` faylida backend URL to'g'riligini tekshiring
- Browser console'da xatolarni ko'ring
