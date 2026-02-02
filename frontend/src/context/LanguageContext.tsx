import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'uz' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uz: {
    // Header
    'header.home': 'Bosh sahifa',
    'header.menu': 'Menyu',
    'header.gallery': 'Galereya',
    'header.reservation': 'Bron qilish',
    'header.contact': 'Aloqa',
    'header.testimonials': 'Fikrlar',
    
    // Bottom Nav
    'nav.home': 'Bosh sahifa',
    'nav.menu': 'Menyu',
    'nav.orders': 'Buyurtmalar',
    'nav.profile': 'Profil',
    
    // Profile Page
    'profile.title': 'Profil',
    'profile.personalInfo': "Shaxsiy ma'lumotlar",
    'profile.addresses': 'Manzillarim',
    'profile.payment': "To'lov usullari",
    'profile.settings': 'Sozlamalar',
    'profile.help': 'Yordam',
    
    // Personal Info
    'personal.name': 'Ism',
    'personal.phone': 'Telefon',
    'personal.password': 'Parol',
    'personal.address': 'Manzil',
    'personal.save': 'Saqlash',
    'personal.cancel': 'Bekor qilish',
    'personal.namePlaceholder': 'Ismingizni kiriting',
    'personal.phonePlaceholder': '+998 90 123 45 67',
    'personal.passwordPlaceholder': 'Parolingizni kiriting',
    'personal.addressPlaceholder': 'Manzilingizni kiriting',
    'personal.uploadPhoto': 'Rasm yuklash',
    'personal.changePhoto': 'Rasmni o\'zgartirish',
    'personal.deletePhoto': 'Rasmni o\'chirish',
    
    // Addresses
    'address.title': 'Manzillarim',
    'address.default': 'Asosiy',
    'address.setDefault': 'Asosiy qilish',
    'address.delete': "O'chirish",
    'address.addNew': "Yangi manzil qo'shish",
    'address.name': 'Nomi',
    'address.fullAddress': "To'liq manzil",
    'address.namePlaceholder': 'Masalan: Uy, Ish',
    'address.addressPlaceholder': "Ko'cha, uy raqami",
    'address.add': "Qo'shish",
    
    // Payment
    'payment.title': "To'lov usullari",
    'payment.addNew': "Yangi karta qo'shish",
    'payment.cardNumber': 'Karta raqami',
    'payment.cardHolder': 'Karta egasi',
    'payment.expiry': 'Amal qilish muddati',
    'payment.cardNumberPlaceholder': '8600 1234 5678 9012',
    'payment.cardHolderPlaceholder': 'ISM FAMILIYA',
    'payment.expiryPlaceholder': 'MM/YY',
    'payment.owner': 'Egasi',
    'payment.validThru': 'Amal qilish',
    
    // Settings
    'settings.title': 'Sozlamalar',
    'settings.language': 'Til',
    'settings.uzbek': "O'zbek tili",
    'settings.russian': 'Русский язык',
    'settings.notifications': 'Bildirishnomalar',
    'settings.pushNotifications': 'Push bildirishnomalar',
    'settings.logout': 'Tizimdan chiqish',
    
    // Toast Messages
    'toast.saved': "✓ Ma'lumotlar muvaffaqiyatli saqlandi!",
    'toast.addressAdded': "✓ Manzil qo'shildi!",
    'toast.addressDeleted': "✓ Manzil o'chirildi!",
    'toast.defaultChanged': "✓ Asosiy manzil o'zgartirildi!",
    'toast.cardAdded': "✓ Karta qo'shildi!",
    'toast.cardDeleted': "✓ Karta o'chirildi!",
    'toast.defaultCardChanged': "✓ Asosiy karta o'zgartirildi!",
    'toast.languageChanged': "✓ Til o'zgartirildi!",
    'toast.notificationsOn': "✓ Bildirishnomalar yoqildi!",
    'toast.notificationsOff': "✓ Bildirishnomalar o'chirildi!",
    'toast.loggedOut': "✓ Tizimdan muvaffaqiyatli chiqdingiz!",
    'toast.photoUploaded': "✓ Rasm muvaffaqiyatli yuklandi!",
    'toast.photoDeleted': "✓ Rasm o'chirildi!",
    'toast.photoError': "✗ Rasm yuklashda xatolik!",
    
    // Menu Page
    'menu.title': 'Menyu',
    'menu.all': 'Barchasi',
    'menu.food': 'Taomlar',
    'menu.beverages': 'Ichimliklar',
    'menu.addToCart': 'Savatga qo\'shish',
    
    // Cart Page
    'cart.title': 'Savat',
    'cart.empty': 'Savat bo\'sh',
    'cart.total': 'Jami',
    'cart.checkout': 'Buyurtma berish',
    'cart.remove': 'O\'chirish',
    
    // Orders Page
    'orders.title': 'Buyurtmalar',
    'orders.empty': 'Buyurtmalar yo\'q',
    'orders.status': 'Holat',
    'orders.date': 'Sana',
    'orders.total': 'Jami',
    
    // Home Page
    'home.welcome': 'Xush kelibsiz',
    'home.description': 'Eng mazali taomlar',
    'home.heroTitle': 'The Chef ga xush kelibsiz',
    'home.heroSubtitle': 'Ehtiyotkorlik bilan tayyorlangan taomlarimiz bilan oshpazlik san\'atidan bahramand bo\'ling',
    'home.viewMenu': 'Menyuni ko\'rish',
    'home.makeReservation': 'Bron qilish',
    'home.amazingFood': 'Ajoyib taomlar',
    'home.amazingFoodDesc': 'Eng sifatli mahsulotlar va innovatsion retseptlardan tayyorlangan menyumizni kashf eting',
    'home.skilledChefs': 'Malakali oshpazlar',
    'home.skilledChefsDesc': 'Bizning iste\'dodli jamoamiz har bir taomga ko\'p yillik tajribani olib keladi',
    'home.elegantAmbiance': 'Nafis muhit',
    'home.elegantAmbianceDesc': 'Go\'zal dizayn qilingan ovqatlanish xonamizda taomdan bahramand bo\'ling',
    'home.whyChooseUs': 'Nega bizni tanlaysiz?',
    'home.whyChooseUsDesc': 'Biz har bir mehmonimizga unutilmas tajriba taqdim etamiz',
    'home.freshIngredients': 'Yangi mahsulotlar',
    'home.freshIngredientsDesc': 'Biz faqat eng yangi va sifatli mahsulotlardan foydalanamiz',
    'home.fastDelivery': 'Tez yetkazib berish',
    'home.fastDeliveryDesc': 'Buyurtmangizni tez va issiq holda yetkazib beramiz',
    'home.excellentService': 'A\'lo xizmat',
    'home.excellentServiceDesc': 'Bizning jamoamiz sizga eng yaxshi xizmatni ko\'rsatadi',
    'home.affordablePrices': 'Qulay narxlar',
    'home.affordablePricesDesc': 'Sifatli taomlarni hamyonbop narxlarda taklif etamiz',
    'home.customerReviews': 'Mijozlar fikri',
    'home.customerReviewsDesc': 'Bizning mehmonlarimiz nima deyishadi',
    'home.reviewText': '"Ajoyib taomlar va a\'lo xizmat! Har safar bu yerga kelishni yoqtiraman. Oshpazlar haqiqatan ham professional. Menyu juda xilma-xil va har bir taom o\'ziga xos ta\'mga ega. Ayniqsa, ularning maxsus salatini juda yaxshi ko\'raman. Xizmat ko\'rsatish tezkor va do\'stona. Muhit juda qulay va oilaviy. Narxlar ham juda mos."',
    'home.reviewAuthor': 'Aziza Karimova',
    'home.regularCustomer': 'Doimiy mijoz',
    'home.viewAllReviews': 'Barcha fikrlarni ko\'rish',
    
    // Footer
    'footer.description': 'Oshpazlik san\'atidan bahramand bo\'ling. Biz har bir taomni muhabbat bilan tayyorlaymiz.',
    'footer.quickLinks': 'Tezkor havolalar',
    'footer.contact': 'Aloqa',
    'footer.workingHours': 'Ish vaqti',
    'footer.mondayToSunday': 'Dushanba - Yakshanba',
    'footer.holidays': 'Bayramlar',
    'footer.allRightsReserved': 'Barcha huquqlar himoyalangan.',
    'footer.privacyPolicy': 'Maxfiylik siyosati',
    'footer.termsOfService': 'Foydalanish shartlari',
    
    // Reservation Page
    'reservation.pageTitle': 'Bron qilish',
    'reservation.pageSubtitle': 'Stol band qilish uchun ma\'lumotlaringizni kiriting',
    'reservation.fullName': 'To\'liq ism',
    'reservation.email': 'Email',
    'reservation.phone': 'Telefon',
    'reservation.date': 'Sana',
    'reservation.time': 'Vaqt',
    'reservation.partySize': 'Odamlar soni',
    'reservation.specialRequests': 'Maxsus so\'rovlar',
    'reservation.submit': 'Bron qilish',
    'reservation.submitting': 'Yuborilmoqda...',
    'reservation.success': '✓ Bron muvaffaqiyatli yaratildi! Tez orada siz bilan bog\'lanamiz.',
    'reservation.errorName': 'Ism kiritish majburiy',
    'reservation.errorEmail': 'Email kiritish majburiy',
    'reservation.errorEmailInvalid': 'Noto\'g\'ri email formati',
    'reservation.errorPhone': 'Telefon raqam kiritish majburiy',
    'reservation.errorDate': 'Sana kiritish majburiy',
    'reservation.errorTime': 'Vaqt kiritish majburiy',
    'reservation.errorPartySize': 'Odamlar soni kamida 1 bo\'lishi kerak',
    'reservation.errorSubmit': 'Bron qilishda xatolik. Iltimos, qayta urinib ko\'ring.',
    
    // Contact Page
    'contact.pageTitle': 'Biz bilan bog\'laning',
    'contact.pageSubtitle': 'Savollaringiz bormi? Biz sizga yordam berishga tayyormiz!',
    'contact.address': 'Manzil',
    'contact.addressText': 'Toshkent sh., Amir Temur ko\'chasi, 123',
    'contact.phoneText': '+998 90 123 45 67',
    'contact.phoneText2': '+998 91 234 56 78',
    'contact.emailText': 'info@thechef.uz',
    'contact.emailText2': 'reservation@thechef.uz',
    'contact.workingHoursText': 'Dushanba - Yakshanba',
    'contact.workingHoursTime': '10:00 - 23:00',
    'contact.sendMessage': 'Xabar yuborish',
    'contact.yourName': 'Ismingiz',
    'contact.yourEmail': 'Email',
    'contact.yourPhone': 'Telefon',
    'contact.yourMessage': 'Xabar',
    'contact.sendButton': 'Yuborish',
    'contact.sending': 'Yuborilmoqda...',
    'contact.success': '✓ Xabaringiz yuborildi! Tez orada javob beramiz.',
    
    // Gallery Page
    'gallery.pageTitle': 'Galereya',
    'gallery.pageSubtitle': 'Bizning restoran va taomlarimiz',
    'gallery.all': 'Barchasi',
    'gallery.food': 'Taomlar',
    'gallery.interior': 'Interer',
    'gallery.events': 'Tadbirlar',
    
    // Testimonials Page
    'testimonials.pageTitle': 'Mijozlar fikrlari',
    'testimonials.pageSubtitle': 'Bizning mehmonlarimizning haqiqiy fikrlari va tajribalari',
    
    // Testimonial Form
    'testimonial.writeReview': 'Fikr bildirish',
    'testimonial.rating': 'Baho',
    'testimonial.comment': 'Fikringiz',
    'testimonial.commentPlaceholder': 'Bizning restoran haqida fikringizni yozing...',
    'testimonial.submit': 'Yuborish',
    'testimonial.submitting': 'Yuborilmoqda...',
    'testimonial.success': '✓ Fikringiz muvaffaqiyatli yuborildi! Moderatsiyadan o\'tgandan keyin ko\'rsatiladi.',
    'testimonial.error': '✗ Fikr yuborishda xatolik yuz berdi',
    'testimonial.commentRequired': '✗ Fikr maydoni bo\'sh bo\'lmasligi kerak',
    'testimonial.commentTooShort': '✗ Fikr kamida 10 ta belgidan iborat bo\'lishi kerak',
    'testimonial.loginRequired': '✗ Fikr bildirish uchun tizimga kiring',
    'testimonial.noReviews': 'Hozircha fikrlar yo\'q. Birinchi bo\'lib fikr bildiring!',
  },
  ru: {
    // Header
    'header.home': 'Главная',
    'header.menu': 'Меню',
    'header.gallery': 'Галерея',
    'header.reservation': 'Бронирование',
    'header.contact': 'Контакты',
    'header.testimonials': 'Отзывы',
    
    // Bottom Nav
    'nav.home': 'Главная',
    'nav.menu': 'Меню',
    'nav.orders': 'Заказы',
    'nav.profile': 'Профиль',
    
    // Profile Page
    'profile.title': 'Профиль',
    'profile.personalInfo': 'Личные данные',
    'profile.addresses': 'Мои адреса',
    'profile.payment': 'Способы оплаты',
    'profile.settings': 'Настройки',
    'profile.help': 'Помощь',
    
    // Personal Info
    'personal.name': 'Имя',
    'personal.phone': 'Телефон',
    'personal.password': 'Пароль',
    'personal.address': 'Адрес',
    'personal.save': 'Сохранить',
    'personal.cancel': 'Отмена',
    'personal.namePlaceholder': 'Введите ваше имя',
    'personal.phonePlaceholder': '+998 90 123 45 67',
    'personal.passwordPlaceholder': 'Введите пароль',
    'personal.addressPlaceholder': 'Введите адрес',
    'personal.uploadPhoto': 'Загрузить фото',
    'personal.changePhoto': 'Изменить фото',
    'personal.deletePhoto': 'Удалить фото',
    
    // Addresses
    'address.title': 'Мои адреса',
    'address.default': 'Основной',
    'address.setDefault': 'Сделать основным',
    'address.delete': 'Удалить',
    'address.addNew': 'Добавить новый адрес',
    'address.name': 'Название',
    'address.fullAddress': 'Полный адрес',
    'address.namePlaceholder': 'Например: Дом, Работа',
    'address.addressPlaceholder': 'Улица, номер дома',
    'address.add': 'Добавить',
    
    // Payment
    'payment.title': 'Способы оплаты',
    'payment.addNew': 'Добавить новую карту',
    'payment.cardNumber': 'Номер карты',
    'payment.cardHolder': 'Владелец карты',
    'payment.expiry': 'Срок действия',
    'payment.cardNumberPlaceholder': '8600 1234 5678 9012',
    'payment.cardHolderPlaceholder': 'ИМЯ ФАМИЛИЯ',
    'payment.expiryPlaceholder': 'ММ/ГГ',
    'payment.owner': 'Владелец',
    'payment.validThru': 'Действителен до',
    
    // Settings
    'settings.title': 'Настройки',
    'settings.language': 'Язык',
    'settings.uzbek': "O'zbek tili",
    'settings.russian': 'Русский язык',
    'settings.notifications': 'Уведомления',
    'settings.pushNotifications': 'Push уведомления',
    'settings.logout': 'Выйти',
    
    // Toast Messages
    'toast.saved': '✓ Данные успешно сохранены!',
    'toast.addressAdded': '✓ Адрес добавлен!',
    'toast.addressDeleted': '✓ Адрес удален!',
    'toast.defaultChanged': '✓ Основной адрес изменен!',
    'toast.cardAdded': '✓ Карта добавлена!',
    'toast.cardDeleted': '✓ Карта удалена!',
    'toast.defaultCardChanged': '✓ Основная карта изменена!',
    'toast.languageChanged': '✓ Язык изменен!',
    'toast.notificationsOn': '✓ Уведомления включены!',
    'toast.notificationsOff': '✓ Уведомления выключены!',
    'toast.loggedOut': '✓ Вы успешно вышли из системы!',
    'toast.photoUploaded': '✓ Фото успешно загружено!',
    'toast.photoDeleted': '✓ Фото удалено!',
    'toast.photoError': '✗ Ошибка при загрузке фото!',
    
    // Menu Page
    'menu.title': 'Меню',
    'menu.all': 'Все',
    'menu.food': 'Блюда',
    'menu.beverages': 'Напитки',
    'menu.addToCart': 'В корзину',
    
    // Cart Page
    'cart.title': 'Корзина',
    'cart.empty': 'Корзина пуста',
    'cart.total': 'Итого',
    'cart.checkout': 'Оформить заказ',
    'cart.remove': 'Удалить',
    
    // Orders Page
    'orders.title': 'Заказы',
    'orders.empty': 'Нет заказов',
    'orders.status': 'Статус',
    'orders.date': 'Дата',
    'orders.total': 'Итого',
    
    // Home Page
    'home.welcome': 'Добро пожаловать',
    'home.description': 'Самые вкусные блюда',
    'home.heroTitle': 'Добро пожаловать в The Chef',
    'home.heroSubtitle': 'Наслаждайтесь кулинарным искусством с нашими тщательно приготовленными блюдами',
    'home.viewMenu': 'Посмотреть меню',
    'home.makeReservation': 'Забронировать',
    'home.amazingFood': 'Потрясающие блюда',
    'home.amazingFoodDesc': 'Откройте для себя наше меню, приготовленное из лучших ингредиентов и инновационных рецептов',
    'home.skilledChefs': 'Опытные повара',
    'home.skilledChefsDesc': 'Наша талантливая команда привносит многолетний опыт в каждое блюдо',
    'home.elegantAmbiance': 'Элегантная атмосфера',
    'home.elegantAmbianceDesc': 'Наслаждайтесь едой в нашем красиво оформленном зале',
    'home.whyChooseUs': 'Почему выбирают нас?',
    'home.whyChooseUsDesc': 'Мы предоставляем незабываемый опыт каждому нашему гостю',
    'home.freshIngredients': 'Свежие продукты',
    'home.freshIngredientsDesc': 'Мы используем только самые свежие и качественные продукты',
    'home.fastDelivery': 'Быстрая доставка',
    'home.fastDeliveryDesc': 'Доставим ваш заказ быстро и в горячем виде',
    'home.excellentService': 'Отличный сервис',
    'home.excellentServiceDesc': 'Наша команда предоставит вам лучший сервис',
    'home.affordablePrices': 'Доступные цены',
    'home.affordablePricesDesc': 'Предлагаем качественные блюда по доступным ценам',
    'home.customerReviews': 'Отзывы клиентов',
    'home.customerReviewsDesc': 'Что говорят наши гости',
    'home.reviewText': '"Потрясающие блюда и отличный сервис! Мне нравится приходить сюда каждый раз. Повара действительно профессионалы. Меню очень разнообразное, и каждое блюдо имеет свой уникальный вкус. Особенно люблю их фирменный салат. Обслуживание быстрое и дружелюбное. Атмосфера очень уютная и семейная. Цены тоже очень приемлемые."',
    'home.reviewAuthor': 'Азиза Каримова',
    'home.regularCustomer': 'Постоянный клиент',
    'home.viewAllReviews': 'Посмотреть все отзывы',
    
    // Footer
    'footer.description': 'Наслаждайтесь кулинарным искусством. Мы готовим каждое блюдо с любовью.',
    'footer.quickLinks': 'Быстрые ссылки',
    'footer.contact': 'Контакты',
    'footer.workingHours': 'Часы работы',
    'footer.mondayToSunday': 'Понедельник - Воскресенье',
    'footer.holidays': 'Праздники',
    'footer.allRightsReserved': 'Все права защищены.',
    'footer.privacyPolicy': 'Политика конфиденциальности',
    'footer.termsOfService': 'Условия использования',
    
    // Reservation Page
    'reservation.pageTitle': 'Бронирование',
    'reservation.pageSubtitle': 'Введите ваши данные для бронирования столика',
    'reservation.fullName': 'Полное имя',
    'reservation.email': 'Email',
    'reservation.phone': 'Телефон',
    'reservation.date': 'Дата',
    'reservation.time': 'Время',
    'reservation.partySize': 'Количество гостей',
    'reservation.specialRequests': 'Особые пожелания',
    'reservation.submit': 'Забронировать',
    'reservation.submitting': 'Отправка...',
    'reservation.success': '✓ Бронирование успешно создано! Мы свяжемся с вами в ближайшее время.',
    'reservation.errorName': 'Имя обязательно',
    'reservation.errorEmail': 'Email обязателен',
    'reservation.errorEmailInvalid': 'Неверный формат email',
    'reservation.errorPhone': 'Телефон обязателен',
    'reservation.errorDate': 'Дата обязательна',
    'reservation.errorTime': 'Время обязательно',
    'reservation.errorPartySize': 'Количество гостей должно быть не менее 1',
    'reservation.errorSubmit': 'Ошибка при бронировании. Пожалуйста, попробуйте снова.',
    
    // Contact Page
    'contact.pageTitle': 'Свяжитесь с нами',
    'contact.pageSubtitle': 'Есть вопросы? Мы готовы помочь!',
    'contact.address': 'Адрес',
    'contact.addressText': 'г. Ташкент, ул. Амира Темура, 123',
    'contact.phoneText': '+998 90 123 45 67',
    'contact.phoneText2': '+998 91 234 56 78',
    'contact.emailText': 'info@thechef.uz',
    'contact.emailText2': 'reservation@thechef.uz',
    'contact.workingHoursText': 'Понедельник - Воскресенье',
    'contact.workingHoursTime': '10:00 - 23:00',
    'contact.sendMessage': 'Отправить сообщение',
    'contact.yourName': 'Ваше имя',
    'contact.yourEmail': 'Email',
    'contact.yourPhone': 'Телефон',
    'contact.yourMessage': 'Сообщение',
    'contact.sendButton': 'Отправить',
    'contact.sending': 'Отправка...',
    'contact.success': '✓ Ваше сообщение отправлено! Мы ответим в ближайшее время.',
    
    // Gallery Page
    'gallery.pageTitle': 'Галерея',
    'gallery.pageSubtitle': 'Наш ресторан и блюда',
    'gallery.all': 'Все',
    'gallery.food': 'Блюда',
    'gallery.interior': 'Интерьер',
    'gallery.events': 'Мероприятия',
    
    // Testimonials Page
    'testimonials.pageTitle': 'Отзывы клиентов',
    'testimonials.pageSubtitle': 'Реальные отзывы и впечатления наших гостей',
    
    // Testimonial Form
    'testimonial.writeReview': 'Оставить отзыв',
    'testimonial.rating': 'Оценка',
    'testimonial.comment': 'Ваш отзыв',
    'testimonial.commentPlaceholder': 'Напишите ваш отзыв о нашем ресторане...',
    'testimonial.submit': 'Отправить',
    'testimonial.submitting': 'Отправка...',
    'testimonial.success': '✓ Ваш отзыв успешно отправлен! Он будет опубликован после модерации.',
    'testimonial.error': '✗ Ошибка при отправке отзыва',
    'testimonial.commentRequired': '✗ Поле отзыва не должно быть пустым',
    'testimonial.commentTooShort': '✗ Отзыв должен содержать минимум 10 символов',
    'testimonial.loginRequired': '✗ Войдите в систему, чтобы оставить отзыв',
    'testimonial.noReviews': 'Пока нет отзывов. Будьте первым!',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'uz';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.uz] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
