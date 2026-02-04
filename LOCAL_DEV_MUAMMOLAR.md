# 🔧 Local Development Muammolarini Hal Qilish

## ❌ Sizda ko'rinayotgan xatoliklar:

1. ✅ **FIXED**: `manifest.json` Syntax error - HAL QILINDI
2. ⚠️ **WebSocket connection failed** - Dev server ishlamayapti
3. ⚠️ **localhost:3003 connection refused** - Server to'xtatilgan
4. ⚠️ **404 errors on API calls** - Noto'g'ri URL

---

## 🚀 HAL QILISH QADAMLARI

### 1. Backend serverni ishga tushiring

Terminal ochib, backend papkasiga o'ting:

```bash
cd backend
npm install
npm run dev
```

Backend `http://localhost:5000` da ishga tushadi.

### 2. Frontend serverni ishga tushiring

Yangi terminal ochib, frontend papkasiga o'ting:

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:3003` da ishga tushadi.

### 3. Browser'ni yangilang

1. Browser'dagi sahifani yoping
2. Cache'ni tozalang: `Ctrl + Shift + Delete`
3. Yangi tab ochib: `http://localhost:3003`

---

## 🔍 XATOLIKLARNI TUSHUNISH

### ❌ "localhost:3003 connection refused"

**Sabab**: Frontend dev server ishlamayapti

**Yechim**:
```bash
cd frontend
npm run dev
```

### ❌ "404 on /api/auth/login"

**Sabab**: Backend server ishlamayapti yoki noto'g'ri URL

**Yechim**:
1. Backend serverni ishga tushiring:
   ```bash
   cd backend
   npm run dev
   ```

2. `.env` faylini tekshiring:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

### ❌ "manifest.json Syntax error"

**Sabab**: Fayl yo'q edi

**Yechim**: ✅ Men yaratdim - `frontend/public/manifest.json`

---

## 📋 TO'LIQ ISHGA TUSHIRISH

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```

Kutilayotgan natija:
```
Server running on port 5000
MongoDB connected successfully
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

Kutilayotgan natija:
```
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:3003/
```

### Browser:
```
http://localhost:3003
```

---

## 🔧 ENVIRONMENT VARIABLES

### Local Development (`.env`):
```bash
VITE_API_URL=http://localhost:5000/api
```

### Production (`.env.production`):
```bash
VITE_API_URL=https://the-chef-caffe-2jwq.onrender.com/api
```

**MUHIM**: Local'da ishlayotganingizda `.env` ishlatiladi, production'da `.env.production` ishlatiladi.

---

## ✅ TEKSHIRISH

### 1. Backend ishlayaptimi?
```bash
curl http://localhost:5000/api/health
```

Yoki browser'da: `http://localhost:5000/api/health`

Javob:
```json
{"status":"ok","message":"Server is running"}
```

### 2. Frontend ishlayaptimi?
Browser'da: `http://localhost:3003`

Sahifa ochilishi kerak.

### 3. API so'rovlar ishlayaptimi?
1. Frontend'da Login sahifasiga o'ting
2. F12 bosing (Developer Tools)
3. Network tab'ini oching
4. Login qiling
5. `/api/auth/login` so'rovi ko'rinishi kerak

---

## 🐛 YANA HAM MUAMMO BO'LSA?

### Cache'ni tozalang:
```bash
cd frontend
rm -rf node_modules
rm -rf dist
rm -rf .vite
npm install
npm run dev
```

### Port band bo'lsa:
```bash
# Windows'da port 3003'ni bo'shatish
netstat -ano | findstr :3003
taskkill /PID <PID_NUMBER> /F

# Port 5000'ni bo'shatish
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### MongoDB ulanmasa:
1. MongoDB Atlas'ga kiring
2. Network Access → `0.0.0.0/0` qo'shing
3. Database User → Username/password tekshiring
4. `backend/.env` faylida `MONGODB_URI` to'g'ri ekanligini tekshiring

---

## 📱 PRODUCTION'GA DEPLOY QILISH

Local'da hammasi ishlasa, production'ga deploy qiling:

### 1. GitHub'ga push qiling:
```bash
git add .
git commit -m "Fixed manifest.json and environment variables"
git push origin main
```

### 2. Render'da deploy qiling:
- Backend: Manual Deploy → Deploy latest commit
- Frontend: Manual Deploy → Deploy latest commit

### 3. Production URL'larni tekshiring:
- Frontend: https://the-chef-cafe-uz-qi96.onrender.com
- Backend: https://the-chef-caffe-2jwq.onrender.com/api/health

---

## 🎯 QISQACHA

1. ✅ `manifest.json` yaratildi
2. ⚠️ Backend serverni ishga tushiring: `cd backend && npm run dev`
3. ⚠️ Frontend serverni ishga tushiring: `cd frontend && npm run dev`
4. ✅ Browser'da `http://localhost:3003` oching
5. ✅ Hammasi ishlasa, GitHub'ga push qiling va Render'da deploy qiling

---

**Oxirgi yangilanish**: 2026-02-04
