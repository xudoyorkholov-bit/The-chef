# Render.com'da Loyihani To'liq Sozlash Qo'llanmasi

## 📋 Sizning URL'laringiz

- **Frontend URL**: https://the-chef-cafe-uz-qi96.onrender.com
- **Backend URL**: https://the-chef-caffe-2jwq.onrender.com

## ⚠️ Topilgan Muammo

Backend URL'ingizda xatolik bor: `https://the-chef-caffe-2jwq.onrender.com/api`
Bu URL noto'g'ri yozilgan (caffe o'rniga cafe bo'lishi kerak).

---

## 🔧 1. BACKEND SOZLASH (Render Dashboard)

### 1.1. Backend Service'ga kiring
1. Render.com'ga kiring: https://dashboard.render.com
2. Backend service'ingizni toping: `the-chef-caffe-2jwq`
3. Service sahifasiga kiring

### 1.2. Environment Variables'ni tekshiring

**Settings** → **Environment Variables** bo'limiga o'ting va quyidagilarni tekshiring:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/the-chef-db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=https://the-chef-cafe-uz-qi96.onrender.com
```

**MUHIM**: 
- `MONGODB_URI` - MongoDB Atlas'dagi cluster URL'ingiz
- `JWT_SECRET` - Xavfsiz maxfiy kalit (kamida 32 belgi)
- `FRONTEND_URL` - Frontend URL'ingiz (CORS uchun)

### 1.3. Build & Deploy Settings

**Settings** bo'limida:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

### 1.4. Manual Deploy

Agar o'zgarishlar bo'lsa:
1. **Manual Deploy** → **Deploy latest commit** tugmasini bosing
2. Deploy jarayonini kuzating (Logs bo'limida)

---

## 🎨 2. FRONTEND SOZLASH (Render Dashboard)

### 2.1. Frontend Service'ga kiring
1. Render.com'ga kiring
2. Frontend service'ingizni toping: `the-chef-cafe-uz-qi96`
3. Service sahifasiga kiring

### 2.2. Environment Variables'ni sozlang

**Settings** → **Environment Variables** bo'limida:

```
VITE_API_URL=https://the-chef-caffe-2jwq.onrender.com/api
```

**DIQQAT**: Backend URL'ingiz to'g'ri ekanligini tekshiring!

### 2.3. Build & Deploy Settings

**Settings** bo'limida:

- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Root Directory**: `frontend`

### 2.4. Manual Deploy

1. **Manual Deploy** → **Deploy latest commit** tugmasini bosing
2. Deploy jarayonini kuzating

---

## 🔄 3. GITHUB'DAN YANGILASH

Agar GitHub'dan avtomatik deploy qilmoqchi bo'lsangiz:

### 3.1. Backend uchun
```bash
cd backend
git add .
git commit -m "Backend yangilandi"
git push origin main
```

### 3.2. Frontend uchun
```bash
cd frontend
git add .
git commit -m "Frontend yangilandi"
git push origin main
```

Render avtomatik ravishda yangi commit'larni deploy qiladi.

---

## 🧪 4. TEKSHIRISH

### 4.1. Backend'ni tekshirish

Browser'da ochib ko'ring:
```
https://the-chef-caffe-2jwq.onrender.com/api/health
```

Javob:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### 4.2. Frontend'ni tekshirish

Browser'da ochib ko'ring:
```
https://the-chef-cafe-uz-qi96.onrender.com
```

Sahifa ochilishi va backend bilan bog'lanishi kerak.

### 4.3. Browser Console'ni tekshiring

1. Frontend sahifasini oching
2. F12 bosing (Developer Tools)
3. **Console** tab'iga o'ting
4. Xatoliklar bormi tekshiring

Agar `CORS error` yoki `Network error` ko'rsatsa:
- Backend'dagi `FRONTEND_URL` to'g'ri ekanligini tekshiring
- Backend qayta deploy qiling

---

## 🐛 5. MUAMMOLARNI HAL QILISH

### Muammo 1: "Cannot connect to backend"

**Yechim**:
1. Backend URL to'g'ri yozilganligini tekshiring
2. Backend service ishlab turganligini tekshiring (Render dashboard)
3. Backend logs'ni ko'ring: **Logs** bo'limida

### Muammo 2: "CORS Error"

**Yechim**:
1. Backend'dagi `FRONTEND_URL` environment variable to'g'ri ekanligini tekshiring
2. Backend'ni qayta deploy qiling
3. `backend/src/server.ts` faylida CORS sozlamalari to'g'ri ekanligini tekshiring

### Muammo 3: "MongoDB connection failed"

**Yechim**:
1. MongoDB Atlas'da:
   - Network Access: `0.0.0.0/0` qo'shilganligini tekshiring
   - Database User: Username va password to'g'ri ekanligini tekshiring
2. Backend'dagi `MONGODB_URI` to'g'ri ekanligini tekshiring
3. Backend logs'da xatolik xabarini o'qing

### Muammo 4: "Build failed"

**Yechim**:
1. Render logs'da xatolikni o'qing
2. Local'da build qilib ko'ring:
   ```bash
   cd backend
   npm install
   npm run build
   ```
3. Xatoliklarni tuzating va qayta push qiling

---

## 📱 6. PRODUCTION CHECKLIST

Deploy qilishdan oldin tekshiring:

### Backend
- [ ] `MONGODB_URI` to'g'ri va ishlamoqda
- [ ] `JWT_SECRET` xavfsiz va uzun (32+ belgi)
- [ ] `FRONTEND_URL` to'g'ri frontend URL
- [ ] `NODE_ENV=production`
- [ ] Build muvaffaqiyatli
- [ ] Health endpoint ishlayapti

### Frontend
- [ ] `VITE_API_URL` to'g'ri backend URL
- [ ] Build muvaffaqiyatli
- [ ] Sahifa ochilmoqda
- [ ] API so'rovlari ishlayapti
- [ ] Console'da xatolik yo'q

### MongoDB Atlas
- [ ] Network Access: `0.0.0.0/0` qo'shilgan
- [ ] Database User yaratilgan
- [ ] Connection string to'g'ri

---

## 🚀 7. KEYINGI QADAMLAR

1. **Backend'ni tekshiring**: Logs'da xatolik bormi?
2. **Frontend'ni tekshiring**: Sahifa ochilmoqdami?
3. **API'ni test qiling**: Login, menu, orders ishlayaptimi?
4. **MongoDB'ni tekshiring**: Ma'lumotlar saqlanmoqdami?

---

## 📞 YORDAM

Agar muammo hal bo'lmasa:

1. **Backend Logs**: Render dashboard → Backend service → Logs
2. **Frontend Logs**: Render dashboard → Frontend service → Logs
3. **Browser Console**: F12 → Console tab
4. **Network Tab**: F12 → Network tab (API so'rovlarini ko'rish)

---

## 🔗 Foydali Havolalar

- Render Dashboard: https://dashboard.render.com
- MongoDB Atlas: https://cloud.mongodb.com
- Frontend URL: https://the-chef-cafe-uz-qi96.onrender.com
- Backend URL: https://the-chef-caffe-2jwq.onrender.com

---

**Oxirgi yangilanish**: 2026-02-03
