# ⚡ Render'da Tezkor Sozlash

## 🎯 Sizning URL'laringiz
- **Frontend**: https://the-chef-cafe-uz-qi96.onrender.com
- **Backend**: https://the-chef-caffe-2jwq.onrender.com

## ⚠️ MUHIM ESLATMA
Agar local'da ishlayotgan bo'lsangiz, avval serverlarni ishga tushiring:
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`

To'liq qo'llanma: `LOCAL_DEV_MUAMMOLAR.md` faylini o'qing

---

## 🔧 BACKEND SOZLASH (5 daqiqa)

### 1. Render.com'ga kiring
👉 https://dashboard.render.com

### 2. Backend service'ni oching
`the-chef-caffe-2jwq` → **Settings** → **Environment Variables**

### 3. Quyidagi o'zgaruvchilarni qo'shing/tekshiring:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/the-chef-db
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
FRONTEND_URL=https://the-chef-cafe-uz-qi96.onrender.com
```

### 4. Deploy qiling
**Manual Deploy** → **Deploy latest commit**

---

## 🎨 FRONTEND SOZLASH (3 daqiqa)

### 1. Frontend service'ni oching
`the-chef-cafe-uz-qi96` → **Settings** → **Environment Variables**

### 2. Backend URL'ni qo'shing:

```bash
VITE_API_URL=https://the-chef-caffe-2jwq.onrender.com/api
```

### 3. Deploy qiling
**Manual Deploy** → **Deploy latest commit**

---

## ✅ TEKSHIRISH

### Backend:
```
https://the-chef-caffe-2jwq.onrender.com/api/health
```
Javob: `{"status":"ok"}`

### Frontend:
```
https://the-chef-cafe-uz-qi96.onrender.com
```
Sahifa ochilishi kerak

---

## 🐛 Xatolik bo'lsa?

### CORS Error:
- Backend'dagi `FRONTEND_URL` to'g'ri ekanligini tekshiring
- Backend'ni qayta deploy qiling

### MongoDB Error:
- MongoDB Atlas → Network Access → `0.0.0.0/0` qo'shing
- `MONGODB_URI` to'g'ri ekanligini tekshiring

### Build Error:
- Render Logs'ni o'qing
- Local'da `npm run build` qilib ko'ring

---

## 📋 MONGODB ATLAS SOZLASH

### 1. Network Access
- MongoDB Atlas'ga kiring
- **Network Access** → **Add IP Address**
- `0.0.0.0/0` qo'shing (Allow access from anywhere)

### 2. Database User
- **Database Access** → **Add New Database User**
- Username va password yarating
- **Built-in Role**: `Read and write to any database`

### 3. Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/the-chef-db
```

---

## 🚀 TAYYOR!

Endi ilovangiz ishlashi kerak:
1. ✅ Backend API ishlayapti
2. ✅ Frontend sahifa ochilmoqda
3. ✅ MongoDB'ga ulanmoqda
4. ✅ Login/Register ishlayapti

---

**To'liq qo'llanma**: `RENDER_SOZLASH_QOLLANMA.md` faylini o'qing
