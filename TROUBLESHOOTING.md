# Muammolarni Hal Qilish / Troubleshooting

## PWA O'rnatish Muammosi (Ilova o'rnatilmayapti)

### Muammo Belgilari:
- "O'rnatish" tugmasini bosganda ilova o'rnatilmayapti
- Faqat qo'lda o'rnatish ko'rsatmalari chiqmoqda
- Brauzerda o'rnatish belgisi ko'rinmayapti

### Yechim:

#### 1. PWA O'rnatish Shartlari
PWA avtomatik o'rnatish uchun quyidagi shartlar bajarilishi kerak:

**✅ HTTPS yoki localhost**
- Development: `http://localhost:3000` - ✅ Ishlaydi
- Production: `https://yourdomain.com` - ✅ Ishlaydi
- HTTP (production): `http://yourdomain.com` - ❌ Ishlamaydi

**✅ Service Worker ro'yxatdan o'tgan**
1. Brauzerda F12 bosing
2. "Application" tabiga o'ting
3. "Service Workers" ni tanlang
4. Service Worker "activated" holatida bo'lishi kerak

**✅ Manifest fayli to'g'ri**
1. F12 > Application > Manifest
2. Barcha maydonlar to'ldirilgan bo'lishi kerak
3. Ikonlar yuklanganini tekshiring

**✅ Foydalanuvchi saytda ma'lum vaqt o'tkazgan**
- Chrome kamida 30 soniya kutadi
- Foydalanuvchi sahifada faol bo'lishi kerak (scroll, click)

#### 2. Development Rejimida Test Qilish

**Variant 1: Chrome DevTools**
```
1. F12 bosing
2. Application > Manifest
3. "Add to home screen" tugmasini bosing
```

**Variant 2: Chrome Flags**
```
1. chrome://flags/#bypass-app-banner-engagement-checks
2. "Enabled" qiling
3. Brauzerini qayta ishga tushiring
```

**Variant 3: Vite PWA Dev Mode**
Vite config'da `devOptions.enabled: true` bo'lishi kerak (allaqachon yoqilgan).

#### 3. Production Rejimida Test Qilish

**Build va Preview:**
```bash
cd frontend
npm run build
npm run preview
```

Keyin `http://localhost:4173` da ochib test qiling.

#### 4. Service Worker Muammosi

**Service Worker ni qayta ro'yxatdan o'tkazish:**
```
1. F12 > Application > Service Workers
2. "Unregister" tugmasini bosing
3. Sahifani yangilang (F5)
4. Service Worker avtomatik qayta ro'yxatdan o'tadi
```

**Service Worker ni to'liq tozalash:**
```
1. F12 > Application > Storage
2. "Clear site data" tugmasini bosing
3. Sahifani yangilang
```

#### 5. Brauzer Qo'llab-quvvatlashi

**✅ Qo'llab-quvvatlaydigan brauzerlar:**
- Chrome (Android, Desktop)
- Edge (Desktop)
- Samsung Internet (Android)
- Safari (iOS 16.4+)

**❌ Qo'llab-quvvatlamaydigan:**
- Firefox (Desktop) - faqat Android'da
- Safari (iOS 16.3 va pastroq)

#### 6. Qo'lda O'rnatish

Agar avtomatik o'rnatish ishlamasa, qo'lda o'rnatish mumkin:

**Android (Chrome):**
```
1. Brauzer menyusini oching (⋮)
2. "Add to Home Screen" ni tanlang
3. "Install" tugmasini bosing
```

**iOS (Safari):**
```
1. Share tugmasini bosing (⬆️)
2. "Add to Home Screen" ni tanlang
3. "Add" tugmasini bosing
```

**Desktop (Chrome):**
```
1. Manzil satrida o'rnatish belgisini (⬇️) bosing
YOKI
2. Brauzer menyusidan (⋮) "Install The Chef" ni tanlang
```

#### 7. Diagnostika

**Console loglarini tekshirish:**
```javascript
// F12 > Console da quyidagi kodni yozing:
console.log('Service Worker:', 'serviceWorker' in navigator);
console.log('Standalone:', window.matchMedia('(display-mode: standalone)').matches);
```

**Network loglarini tekshirish:**
```
1. F12 > Network
2. Sahifani yangilang
3. manifest.json va service worker fayllarini qidiring
4. Status 200 bo'lishi kerak
```

#### 8. Keng Tarqalgan Xatolar

**"beforeinstallprompt" event ishlamayapti:**
- Sabab: Brauzer PWA shartlarini qoniqtirmagan
- Yechim: Yuqoridagi shartlarni tekshiring

**Service Worker xatosi:**
- Sabab: Service Worker ro'yxatdan o'tmagan
- Yechim: Console'da xatolarni tekshiring

**Manifest xatosi:**
- Sabab: manifest.json noto'g'ri
- Yechim: F12 > Application > Manifest da xatolarni ko'ring

## Auth Muammosi (Ro'yxatdan o'tish/Kirish ishlamayapti)

### Muammo Belgilari:
- "Ro'yxatdan o'tish amalga oshmadi"
- "Telefon raqam yoki parol noto'g'ri"
- Backend loglarida hech qanday request ko'rinmayapti

### Yechim:

#### 1. Brauzer Cache ni Tozalash
1. Brauzerda `Ctrl + Shift + R` (Windows) yoki `Cmd + Shift + R` (Mac) bosing
2. Yoki Developer Tools (F12) ni oching va "Disable cache" ni yoqing

#### 2. To'g'ri URL ni Tekshirish
Frontend qaysi portda ishlaganini tekshiring:
- Agar `http://localhost:3000/` - bu to'g'ri
- Agar `http://localhost:3001/` - bu ham to'g'ri

#### 3. Backend Ishlaganini Tekshirish
Terminal da backend loglarini ko'ring:
```
✅ MongoDB connected successfully
📊 Database: the_chef_restaurant
```

#### 4. Test User bilan Kirish
Seed script ishga tushirilgan bo'lsa, quyidagi ma'lumotlar bilan kiring:
- **Username**: `admin`
- **Password**: `admin123`

**MUHIM**: Telefon raqam o'rniga `admin` yozing!

#### 5. Network Xatolarini Tekshirish
1. Brauzerda F12 bosing
2. "Network" tabiga o'ting
3. Login/Register tugmasini bosing
4. Qizil rangdagi xatolarni qidiring

Agar `ERR_CONNECTION_REFUSED` ko'rsangiz:
- Backend ishlamayapti, qayta ishga tushiring:
  ```bash
  cd backend
  npm run dev
  ```

Agar `CORS error` ko'rsangiz:
- Backend CORS sozlamalari noto'g'ri

#### 6. Portlarni Tekshirish
```bash
# Backend port 5000 da ishlaganini tekshiring
netstat -ano | findstr :5000

# Frontend port 3000 yoki 3001 da ishlaganini tekshiring
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

#### 7. Environment Variables
Frontend `.env` faylini tekshiring:
```
VITE_API_URL=http://localhost:5000/api
```

#### 8. Oxirgi Yechim - Hamma Narsani Qayta Ishga Tushirish
```bash
# 1. Barcha jarayonlarni to'xtatish
# Ctrl+C backend va frontend terminallarida

# 2. Port 5000 ni tozalash
netstat -ano | findstr :5000
taskkill /F /PID <PID_RAQAMI>

# 3. Backend ni qayta ishga tushirish
cd backend
npm run dev

# 4. Frontend ni qayta ishga tushirish (yangi terminal)
cd frontend
npm run dev

# 5. Brauzerda hard refresh
Ctrl + Shift + R
```

## Umumiy Maslahatlar

### MongoDB Ulanish Muammosi
Agar MongoDB ulanmasa:
```bash
# MongoDB ishlaganini tekshiring
# MongoDB Compass yoki mongosh bilan ulanib ko'ring
mongosh mongodb://localhost:27017/the_chef_restaurant
```

### Port Band Bo'lsa
```bash
# Portni band qilgan jarayonni topish
netstat -ano | findstr :5000

# Jarayonni to'xtatish
taskkill /F /PID <PID_RAQAMI>
```

### Dependencies Muammosi
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## Yordam Kerakmi?

Agar muammo hal bo'lmasa:
1. Backend terminal loglarini screenshot qiling
2. Frontend brauzer console (F12) ni screenshot qiling
3. Network tab (F12) dagi xatolarni screenshot qiling
