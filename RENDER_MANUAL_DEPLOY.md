# 🚀 Render'da Qo'lda Deploy Qilish

## ⚠️ Avtomatik deploy ishlamayapti!

Render'da qo'lda deploy qilish kerak.

---

## 📋 QADAMLAR:

### 1. Render Dashboard'ga kiring

```
https://dashboard.render.com
```

### 2. Frontend Service'ni oching

1. **Services** ro'yxatidan `the-chef-cafe-uz-qi96` ni toping
2. Service nomiga bosing

### 3. Manual Deploy qiling

1. Yuqori o'ng burchakda **"Manual Deploy"** tugmasini bosing
2. **"Deploy latest commit"** ni tanlang
3. **"Deploy"** tugmasini bosing

### 4. Deploy jarayonini kuzating

1. **"Events"** tab'iga o'ting
2. Deploy holati ko'rinadi:
   - 🔵 **In Progress** - Deploy qilinmoqda
   - 🟢 **Live** - Tayyor!
   - 🔴 **Failed** - Xatolik

3. **"Logs"** tab'ida build jarayonini ko'ring

---

## ⏱️ Kutish vaqti: 3-5 daqiqa

Deploy jarayoni:
1. ✅ GitHub'dan kod olish
2. 🔄 Dependencies o'rnatish (npm install)
3. 🔄 Build qilish (npm run build)
4. 🔄 Deploy qilish
5. ✅ Tayyor!

---

## 🎯 Deploy tugagandan keyin:

### Sahifani tekshiring:
```
https://the-chef-cafe-uz-qi96.onrender.com
```

**Tekshirish ro'yxati**:
- [ ] Sahifa ochilmoqdami?
- [ ] Cheksiz reload yo'qmi?
- [ ] Login sahifasi ochilmoqdami?
- [ ] Register ishlayaptimi?
- [ ] Login ishlayaptimi?

---

## 🔧 Avtomatik Deploy'ni Yoqish (Keyinroq)

Agar avtomatik deploy kerak bo'lsa:

### Render Dashboard'da:

1. Frontend service'ni oching
2. **Settings** → **Build & Deploy**
3. **Auto-Deploy** ni **Yes** ga o'zgartiring
4. **Branch** ni `main` ga o'zgartiring
5. **Save Changes** bosing

Keyin har safar GitHub'ga push qilganingizda avtomatik deploy bo'ladi.

---

## 📸 Screenshot Qo'llanma:

### 1. Render Dashboard
```
Dashboard → Services → the-chef-cafe-uz-qi96
```

### 2. Manual Deploy tugmasi
```
Yuqori o'ng burchak → Manual Deploy → Deploy latest commit
```

### 3. Deploy holati
```
Events tab → Deploy status
Logs tab → Build logs
```

---

## 🐛 Xatolik bo'lsa:

### Build Failed:
1. **Logs** tab'ini oching
2. Xatolik xabarini o'qing
3. Xatolikni tuzating
4. GitHub'ga push qiling
5. Qayta Manual Deploy qiling

### Deploy Failed:
1. **Events** tab'ida xatolikni ko'ring
2. Environment Variables'ni tekshiring
3. Qayta deploy qiling

---

## ✅ HOZIR QILING:

1. 🌐 Render Dashboard'ga kiring: https://dashboard.render.com
2. 🔍 Frontend service'ni toping: `the-chef-cafe-uz-qi96`
3. 🚀 **Manual Deploy** → **Deploy latest commit** bosing
4. ⏱️ 3-5 daqiqa kuting
5. ✅ Sahifani tekshiring: https://the-chef-cafe-uz-qi96.onrender.com

---

**Vaqt**: 2026-02-04
**Status**: ⏳ Qo'lda deploy qilish kerak
