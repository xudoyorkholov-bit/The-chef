# Deploy Qilish Buyruqlari

## 1. O'zgarishlarni GitHub'ga yuklash

```bash
git add .
git commit -m "Configure backend URL and CORS for production deployment"
git push origin main
```

## 2. Backend avtomatik qayta deploy bo'ladi
- Render GitHub'dagi o'zgarishlarni ko'radi
- Avtomatik ravishda backend'ni qayta deploy qiladi
- 3-5 daqiqa kutish kerak

## 3. Backend'da CORS sozlash (Render Dashboard)

1. Render.com → Backend Service
2. Environment → `CORS_ORIGIN` variable'ni qo'shing yoki yangilang
3. Value: Frontend URL (deploy qilgandan keyin olinadi)
4. Save Changes

## 4. Frontend deploy qilish

`RENDER_FRONTEND_DEPLOY_UZ.md` yoki `QUICK_DEPLOY_GUIDE_UZ.md` faylini o'qing va qadamma-qadam bajaring.

## 5. Tekshirish

### Backend tekshirish:
```
https://the-chef-caffe-2jwq.onrender.com/api/menu
```

### Frontend tekshirish:
Brauzerda frontend URL'ni oching va:
- Menu sahifasini tekshiring
- Login qilishga harakat qiling
- Buyurtma berishni sinab ko'ring

## Muammo bo'lsa:

1. Backend logs'ni tekshiring (Render dashboard)
2. Frontend console'ni tekshiring (Browser DevTools)
3. CORS xatoligi bo'lsa - backend CORS sozlamalarini tekshiring
4. API xatoligi bo'lsa - backend logs'ni o'qing
