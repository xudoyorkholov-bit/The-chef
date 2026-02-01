# Service Worker Muammosini Hal Qilish

## Muammo
Service Worker API so'rovlarini to'sib qo'ymoqda va `net::ERR_FAILED` xatosi bermoqda.

## Yechim

### 1-usul: Brauzer konsolida ishga tushiring

Telefon yoki kompyuterda brauzer konsolini oching va quyidagi kodni kiriting:

```javascript
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
  console.log('Service Workers o\'chirildi');
  location.reload();
});
```

### 2-usul: Brauzer sozlamalaridan

1. Chrome/Edge: Settings → Privacy and security → Site settings → View permissions and data stored across sites
2. Saytingizni toping (localhost:3001 yoki 192.168.100.18:3001)
3. "Clear data" bosing
4. Sahifani yangilang

### 3-usul: Incognito/Private mode

Yangi incognito/private window ochib, saytni u yerda oching.

## Keyin

Service Worker o'chirilgandan keyin sahifani yangilang va qayta kirish qiling.
