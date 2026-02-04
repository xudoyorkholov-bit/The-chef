# Requirements Document

## Introduction

Admin panel - bu restoran administratorlari uchun maxsus interfeys bo'lib, ular orqali menyu, buyurtmalar, rezervatsiyalar, xabarlar va galereyani boshqarish mumkin. Admin panel faqat admin rolga ega foydalanuvchilar uchun ochiq bo'ladi.

## Glossary

- **Admin**: Tizimda admin rolga ega foydalanuvchi
- **Dashboard**: Admin panelning asosiy sahifasi, statistika va umumiy ma'lumotlar ko'rsatiladigan joy
- **CRUD**: Create, Read, Update, Delete - ma'lumotlarni yaratish, o'qish, yangilash va o'chirish operatsiyalari
- **Menu Management**: Menyu mahsulotlarini boshqarish
- **Order Management**: Buyurtmalarni boshqarish
- **Reservation Management**: Rezervatsiyalarni boshqarish

## Requirements

### Requirement 1

**User Story:** Admin sifatida, men admin panelga kirish uchun admin roli bilan tizimga kirishim kerak.

#### Acceptance Criteria

1. WHEN admin roli bo'lmagan foydalanuvchi admin panelga kirishga urinsa THEN tizim uni asosiy sahifaga yo'naltirishi kerak
2. WHEN admin roli bilan foydalanuvchi tizimga kirsa THEN tizim admin panel tugmasini ko'rsatishi kerak
3. WHEN admin admin panel tugmasini bossa THEN tizim admin panel sahifasiga o'tishi kerak

### Requirement 2

**User Story:** Admin sifatida, men dashboard'da asosiy statistikani ko'rishim kerak.

#### Acceptance Criteria

1. WHEN admin dashboard sahifasini ochsa THEN tizim jami buyurtmalar sonini ko'rsatishi kerak
2. WHEN admin dashboard sahifasini ochsa THEN tizim jami rezervatsiyalar sonini ko'rsatishi kerak
3. WHEN admin dashboard sahifasini ochsa THEN tizim jami xabarlar sonini ko'rsatishi kerak
4. WHEN admin dashboard sahifasini ochsa THEN tizim jami menyu mahsulotlari sonini ko'rsatishi kerak

### Requirement 3

**User Story:** Admin sifatida, men menyu mahsulotlarini boshqarishim (qo'shish, tahrirlash, o'chirish) kerak.

#### Acceptance Criteria

1. WHEN admin menyu boshqaruv sahifasini ochsa THEN tizim barcha menyu mahsulotlarini ro'yxatda ko'rsatishi kerak
2. WHEN admin yangi mahsulot qo'shish tugmasini bossa THEN tizim yangi mahsulot qo'shish formasini ko'rsatishi kerak
3. WHEN admin mahsulot ma'lumotlarini to'ldirib saqlasa THEN tizim yangi mahsulotni ma'lumotlar bazasiga qo'shishi kerak
4. WHEN admin mavjud mahsulotni tahrirlash tugmasini bossa THEN tizim tahrirlash formasini ko'rsatishi kerak
5. WHEN admin mahsulotni o'chirish tugmasini bossa THEN tizim tasdiqlash oynasini ko'rsatishi va tasdiqlangandan keyin mahsulotni o'chirishi kerak

### Requirement 4

**User Story:** Admin sifatida, men buyurtmalarni ko'rish va ularning holatini o'zgartirishim kerak.

#### Acceptance Criteria

1. WHEN admin buyurtmalar sahifasini ochsa THEN tizim barcha buyurtmalarni ro'yxatda ko'rsatishi kerak
2. WHEN admin buyurtma tafsilotlarini ko'rish tugmasini bossa THEN tizim buyurtma tafsilotlarini ko'rsatishi kerak
3. WHEN admin buyurtma holatini o'zgartirsa THEN tizim yangi holatni ma'lumotlar bazasiga saqlashi kerak
4. WHEN admin buyurtmalarni filtrlash imkoniyatidan foydalansa THEN tizim faqat tanlangan holatdagi buyurtmalarni ko'rsatishi kerak

### Requirement 5

**User Story:** Admin sifatida, men rezervatsiyalarni ko'rish va ularni tasdiqlash/rad etishim kerak.

#### Acceptance Criteria

1. WHEN admin rezervatsiyalar sahifasini ochsa THEN tizim barcha rezervatsiyalarni ro'yxatda ko'rsatishi kerak
2. WHEN admin rezervatsiyani tasdiqlash tugmasini bossa THEN tizim rezervatsiya holatini "confirmed" ga o'zgartirishi kerak
3. WHEN admin rezervatsiyani rad etish tugmasini bossa THEN tizim rezervatsiya holatini "cancelled" ga o'zgartirishi kerak
4. WHEN admin rezervatsiya tafsilotlarini ko'rsa THEN tizim mijoz ma'lumotlari va rezervatsiya vaqtini ko'rsatishi kerak

### Requirement 6

**User Story:** Admin sifatida, men mijozlardan kelgan xabarlarni ko'rish va ularga javob berishim kerak.

#### Acceptance Criteria

1. WHEN admin xabarlar sahifasini ochsa THEN tizim barcha xabarlarni ro'yxatda ko'rsatishi kerak
2. WHEN admin xabarni ochsa THEN tizim xabar tafsilotlarini ko'rsatishi kerak
3. WHEN admin xabarni o'qilgan deb belgilasa THEN tizim xabar holatini yangilashi kerak
4. WHEN admin xabarni o'chirsa THEN tizim xabarni ma'lumotlar bazasidan o'chirishi kerak

### Requirement 7

**User Story:** Admin sifatida, men galereyaga rasm qo'shish va o'chirishim kerak.

#### Acceptance Criteria

1. WHEN admin galereya boshqaruv sahifasini ochsa THEN tizim barcha rasmlarni ko'rsatishi kerak
2. WHEN admin yangi rasm yuklash tugmasini bossa THEN tizim fayl tanlash oynasini ochishi kerak
3. WHEN admin rasm yuklasa THEN tizim rasmni serverga saqlashi va ma'lumotlar bazasiga qo'shishi kerak
4. WHEN admin rasmni o'chirsa THEN tizim rasmni serverdan va ma'lumotlar bazasidan o'chirishi kerak

### Requirement 8

**User Story:** Admin sifatida, men admin paneldan chiqish va asosiy saytga qaytishim mumkin bo'lishi kerak.

#### Acceptance Criteria

1. WHEN admin "Asosiy saytga qaytish" tugmasini bossa THEN tizim uni asosiy sahifaga yo'naltirishi kerak
2. WHEN admin "Chiqish" tugmasini bossa THEN tizim uni tizimdan chiqarishi va login sahifasiga yo'naltirishi kerak
