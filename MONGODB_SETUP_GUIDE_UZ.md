# MongoDB Atlas Setup - To'liq Qo'llanma

## 1-QADAM: MongoDB Atlas Akkauntini Yaratish

### 1.1 Ro'yxatdan o'tish
1. Brauzeringizda ochng: **https://www.mongodb.com/cloud/atlas/register**
2. Ro'yxatdan o'tish uchun 3 ta variant:
   - **Google** akkaunt bilan
   - **GitHub** akkaunt bilan  
   - **Email** va parol bilan

3. Agar email bilan ro'yxatdan o'tsangiz:
   - Email manzilingizni kiriting
   - Parol yarating (kamida 8 ta belgi)
   - "Create your Atlas account" tugmasini bosing
   - Emailingizga kelgan tasdiqlash havolasini bosing

### 1.2 Dastlabki Ma'lumotlarni To'ldirish
1. Savolnomani to'ldiring:
   - **Goal**: "Learn MongoDB" yoki "Build a new application" tanlang
   - **What kind of application**: "Web Application" tanlang
   - **Preferred language**: "JavaScript" tanlang
   - "Finish" tugmasini bosing

---

## 2-QADAM: Bepul Cluster Yaratish

### 2.1 Cluster Sozlamalari
1. **"Create a deployment"** yoki **"Build a Database"** tugmasini bosing

2. **Deployment Type** tanlang:
   - **M0 (FREE)** ni tanlang ✅
   - Bu bepul va sizning loyihangiz uchun yetarli

3. **Cloud Provider & Region** tanlang:
   - **Provider**: AWS (tavsiya qilinadi)
   - **Region**: Eng yaqin regionni tanlang:
     - **Singapore** (ap-southeast-1) - O'zbekiston uchun eng yaqin
     - Yoki **Frankfurt** (eu-central-1)
   - "Create Deployment" tugmasini bosing

4. **Kutish**: 1-3 daqiqa cluster yaratiladi ⏳

---

## 3-QADAM: Database Foydalanuvchisi Yaratish

### 3.1 Username va Password
Cluster yaratilgandan keyin avtomatik oyna ochiladi:

1. **Security Quickstart** oynasida:
   - **Username** kiriting: `thechef_admin` (yoki o'zingiz xohlagan nom)
   - **Password** kiriting: Kuchli parol yarating
   - ⚠️ **MUHIM**: Parolni yozib qo'ying! Keyin kerak bo'ladi
   - "Create Database User" tugmasini bosing

2. Agar oyna ochilmasa:
   - Chap menuda **"Database Access"** ni bosing
   - **"Add New Database User"** tugmasini bosing
   - Username va parol kiriting
   - **Database User Privileges**: "Read and write to any database" tanlang
   - "Add User" tugmasini bosing

---

## 4-QADAM: Network Access Sozlash

### 4.1 IP Manzilni Qo'shish
1. Chap menuda **"Network Access"** ni bosing
2. **"Add IP Address"** tugmasini bosing
3. **Ikkita variant**:

   **Variant A: Barcha IP'larni ruxsat berish** (oson, lekin kamroq xavfsiz):
   - "Allow Access from Anywhere" tugmasini bosing
   - IP Address: `0.0.0.0/0` avtomatik qo'yiladi
   - "Confirm" tugmasini bosing

   **Variant B: Faqat Render.com IP'larini ruxsat berish** (xavfsizroq):
   - Render.com'ning IP manzillarini qo'shing
   - Yoki hozircha Variant A'ni ishlating, keyin o'zgartirish mumkin

---

## 5-QADAM: Connection String Olish

### 5.1 Connection String'ni Nusxalash
1. Chap menuda **"Database"** ni bosing (yoki **"Clusters"**)
2. Clusteringiz yonida **"Connect"** tugmasini bosing
3. **"Connect your application"** ni tanlang
4. **Driver** va **Version** tekshiring:
   - Driver: **Node.js** 
   - Version: **5.5 or later** (yoki eng yangi)
5. **Connection string**'ni ko'rasiz:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **"Copy"** tugmasini bosing 📋

### 5.2 Connection String'ni To'g'rilash
Connection string'da `<username>` va `<password>` o'rniga o'z ma'lumotlaringizni qo'ying:

**Misol:**
- Username: `thechef_admin`
- Password: `MySecurePass123`

**Asl string:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**To'g'rilangan string:**
```
mongodb+srv://thechef_admin:MySecurePass123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

⚠️ **DIQQAT**: 
- Parolda maxsus belgilar (`@`, `:`, `/`, `?`, `#`, `[`, `]`) bo'lsa, ularni URL encode qilish kerak
- Masalan: `@` → `%40`, `:` → `%3A`

### 5.3 Database Nomini Qo'shish
Connection string'ga database nomini qo'shing:

```
mongodb+srv://thechef_admin:MySecurePass123@cluster0.xxxxx.mongodb.net/thechef?retryWrites=true&w=majority
```

`/thechef` - bu sizning database nomingiz (o'zingiz xohlagan nom bo'lishi mumkin)

---

## 6-QADAM: Connection String'ni Saqlash

### 6.1 Xavfsiz Saqlash
Connection string'ni quyidagi joylarga saqlang:

1. **Lokal ishlab chiqish uchun** - `backend/.env` fayliga:
   ```env
   MONGODB_URI=mongodb+srv://thechef_admin:MySecurePass123@cluster0.xxxxx.mongodb.net/thechef?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here_change_this
   PORT=5000
   NODE_ENV=development
   ```

2. **Render.com deploy uchun** - Environment Variables'ga:
   - Render.com dashboard'da
   - Service Settings → Environment
   - `MONGODB_URI` = (connection string)

---

## 7-QADAM: Ulanishni Tekshirish

### 7.1 Lokal Tekshirish
Backend papkasida:

```bash
cd backend
npm install
npm run dev
```

Agar muvaffaqiyatli bo'lsa, konsolda ko'rasiz:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### 7.2 Xatolik Bo'lsa
Agar xatolik bo'lsa:
- ❌ "Authentication failed" - Username yoki parol noto'g'ri
- ❌ "Connection timeout" - IP manzil ruxsat berilmagan
- ❌ "Invalid connection string" - String formati noto'g'ri

---

## 8-QADAM: Database'ni Ko'rish

### 8.1 MongoDB Atlas Dashboard
1. Chap menuda **"Database"** ni bosing
2. Clusteringiz yonida **"Browse Collections"** tugmasini bosing
3. Database'laringizni va collection'laringizni ko'rasiz

### 8.2 Dastlabki Ma'lumotlar
Backend ishga tushgandan keyin avtomatik yaratiladi:
- `users` collection
- `menuitems` collection
- `reservations` collection
- `messages` collection
- va boshqalar...

---

## QISQACHA XULOSA

✅ **Tayyor bo'lishi kerak bo'lgan narsalar:**

1. MongoDB Atlas akkaunt
2. Bepul M0 cluster
3. Database user (username + password)
4. Network Access (0.0.0.0/0 yoki Render IP)
5. Connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/thechef?retryWrites=true&w=majority
   ```

---

## KEYINGI QADAM

Connection string'ni olgandan keyin:
1. Menga connection string'ni bering
2. Men uni loyihangizga qo'shaman
3. GitHub'ga push qilamiz
4. Render.com'da deploy qilamiz
5. Saytingiz to'liq ishlaydi! 🎉

---

## YORDAM KERAKMI?

Agar qayerdadir tushunmagan bo'lsangiz yoki xatolik yuz bersa:
- Screenshot oling
- Menga yuboring
- Men yordam beraman! 😊
