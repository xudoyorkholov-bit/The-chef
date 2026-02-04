# Requirements Document

## Introduction

Foydalanuvchi profil ma'lumotlarini (ism, telefon raqam, parol) yangilaganda, o'zgarishlar backend ma'lumotlar bazasiga saqlanmayapti. Foydalanuvchi hisobdan chiqib, yangilangan ma'lumotlar bilan qayta kirishga uringanida "nomer yoki parol xato" xatosi ko'rsatilmoqda. Bu muammo foydalanuvchi tajribasiga salbiy ta'sir ko'rsatadi va tizimga ishonchni pasaytiradi.

## Glossary

- **User**: Tizimda ro'yxatdan o'tgan va autentifikatsiya qilingan foydalanuvchi
- **Profile**: Foydalanuvchining shaxsiy ma'lumotlari (ism, telefon, parol, rasm)
- **Backend**: Server tomonidagi dastur qismi
- **Frontend**: Mijoz tomonidagi dastur qismi (brauzer)
- **Repository**: Ma'lumotlar bazasi bilan ishlash uchun abstraksiya qatlami
- **Service**: Biznes logikasini amalga oshiruvchi qatlam
- **Controller**: HTTP so'rovlarini qayta ishlovchi qatlam
- **Password Hash**: Parolning shifrlangan ko'rinishi

## Requirements

### Requirement 1

**User Story:** Foydalanuvchi sifatida, men profilimda ismimni o'zgartirishim va yangi ism bilan tizimga kirishim mumkin bo'lishi kerak.

#### Acceptance Criteria

1. WHEN foydalanuvchi profil sahifasida ismini o'zgartirsa THEN tizim yangi ismni backend ma'lumotlar bazasiga saqlashi kerak
2. WHEN foydalanuvchi profilni yangilagandan keyin hisobdan chiqsa va qayta kirsa THEN tizim yangilangan ismni ko'rsatishi kerak
3. WHEN foydalanuvchi ismni bo'sh qoldirsa THEN tizim xato xabarini ko'rsatishi va yangilashni rad etishi kerak

### Requirement 2

**User Story:** Foydalanuvchi sifatida, men profilimda telefon raqamimni o'zgartirishim va yangi raqam bilan tizimga kirishim mumkin bo'lishi kerak.

#### Acceptance Criteria

1. WHEN foydalanuvchi profil sahifasida telefon raqamini o'zgartirsa THEN tizim yangi telefon raqamini backend ma'lumotlar bazasiga saqlashi kerak
2. WHEN foydalanuvchi telefon raqamini yangilagandan keyin hisobdan chiqsa THEN tizim yangilangan telefon raqami bilan kirishga ruxsat berishi kerak
3. WHEN foydalanuvchi noto'g'ri formatdagi telefon raqamini kiritsa THEN tizim xato xabarini ko'rsatishi va yangilashni rad etishi kerak

### Requirement 3

**User Story:** Foydalanuvchi sifatida, men profilimda parolimni o'zgartirishim va yangi parol bilan tizimga kirishim mumkin bo'lishi kerak.

#### Acceptance Criteria

1. WHEN foydalanuvchi profil sahifasida parolini o'zgartirsa THEN tizim yangi parolni xeshlangan holda backend ma'lumotlar bazasiga saqlashi kerak
2. WHEN foydalanuvchi parolni yangilagandan keyin hisobdan chiqsa THEN tizim yangilangan parol bilan kirishga ruxsat berishi kerak
3. WHEN foydalanuvchi parol maydonini o'zgartirmasa (masalan "********" qolsa) THEN tizim parolni yangilamasligi kerak
4. WHEN foydalanuvchi 6 ta belgidan kam parol kiritsa THEN tizim xato xabarini ko'rsatishi va yangilashni rad etishi kerak
5. WHEN foydalanuvchi yangi parol bilan tizimga kirsa THEN tizim eski parolni qabul qilmasligi kerak

### Requirement 4

**User Story:** Foydalanuvchi sifatida, men bir vaqtning o'zida bir nechta profil ma'lumotlarini (ism, telefon, parol) o'zgartirishim mumkin bo'lishi kerak.

#### Acceptance Criteria

1. WHEN foydalanuvchi bir vaqtning o'zida ism, telefon va parolni o'zgartirsa THEN tizim barcha o'zgarishlarni backend ma'lumotlar bazasiga saqlashi kerak
2. WHEN foydalanuvchi faqat ba'zi maydonlarni o'zgartirsa THEN tizim faqat o'zgartirilgan maydonlarni yangilashi kerak
3. WHEN yangilash jarayonida xatolik yuz bersa THEN tizim foydalanuvchiga tushunarli xato xabarini ko'rsatishi kerak

### Requirement 5

**User Story:** Tizim sifatida, men foydalanuvchi ma'lumotlarini yangilashda ma'lumotlar yaxlitligini ta'minlashim kerak.

#### Acceptance Criteria

1. WHEN parol yangilanayotganda THEN tizim parolni bcrypt algoritmi bilan xeshlashi kerak
2. WHEN foydalanuvchi ma'lumotlari yangilanayotganda THEN tizim yangilangan ma'lumotlarni darhol ma'lumotlar bazasiga yozishi kerak
3. WHEN yangilash muvaffaqiyatli bo'lsa THEN tizim foydalanuvchiga muvaffaqiyat xabarini ko'rsatishi kerak
4. WHEN yangilash muvaffaqiyatsiz bo'lsa THEN tizim ma'lumotlar bazasini oldingi holatga qaytarishi kerak
