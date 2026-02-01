import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/Button';
import Toast from '../components/Toast';
import './HomePage.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for appinstalled event
    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      
      // Ilova o'rnatilganda muvaffaqiyatli xabar ko'rsatamiz
      const successMessage = language === 'uz'
        ? "🎉 Ajoyib! Ilova muvaffaqiyatli o'rnatildi! Endi uni bosh ekraningizdan ochishingiz mumkin."
        : language === 'ru'
        ? "🎉 Отлично! Приложение успешно установлено! Теперь вы можете открыть его с главного экрана."
        : "🎉 Great! App installed successfully! You can now open it from your home screen.";
      
      setToastMessage(successMessage);
      setToastType('success');
      setShowToast(true);
    };

    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    // Agar deferredPrompt mavjud bo'lsa, uni ishlatamiz
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          const successMessage = language === 'uz'
            ? "🎉 Ajoyib! Ilova o'rnatilmoqda... Bir necha soniya kuting."
            : language === 'ru'
            ? "🎉 Отлично! Приложение устанавливается... Подождите несколько секунд."
            : "🎉 Great! App is installing... Please wait a few seconds.";
          
          setToastMessage(successMessage);
          setToastType('success');
          setShowToast(true);
          
          // appinstalled event avtomatik ravishda isInstalled ni true qiladi
        } else {
          const cancelMessage = language === 'uz'
            ? "O'rnatish bekor qilindi. Xohlasangiz keyinroq o'rnatishingiz mumkin."
            : language === 'ru'
            ? "Установка отменена. Вы можете установить позже."
            : "Installation cancelled. You can install later.";
          
          setToastMessage(cancelMessage);
          setToastType('info');
          setShowToast(true);
        }
        
        setDeferredPrompt(null);
        return;
      } catch (error) {
        console.error('Install error:', error);
        const errorMessage = language === 'uz'
          ? "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
          : language === 'ru'
          ? "❌ Произошла ошибка. Пожалуйста, попробуйте снова."
          : "❌ An error occurred. Please try again.";
        
        setToastMessage(errorMessage);
        setToastType('error');
        setShowToast(true);
      }
    } else {
      // Agar deferredPrompt yo'q bo'lsa, qo'lda o'rnatish yo'lini ko'rsatamiz
      const infoMessage = language === 'uz'
        ? "📱 Ilovani o'rnatish uchun:\n\n1. Chrome brauzerida ochilganligiga ishonch hosil qiling\n2. Manzil satrida o'rnatish belgisini (⬇️) bosing\nYOKI\n3. Brauzer menyusidan (⋮) 'Bosh ekranga qo'shish' ni tanlang"
        : language === 'ru'
        ? "📱 Чтобы установить приложение:\n\n1. Убедитесь, что открыто в Chrome\n2. Нажмите значок установки (⬇️) в адресной строке\nИЛИ\n3. Выберите 'Добавить на главный экран' в меню браузера (⋮)"
        : "📱 To install the app:\n\n1. Make sure you're using Chrome\n2. Tap the install icon (⬇️) in the address bar\nOR\n3. Select 'Add to Home Screen' from browser menu (⋮)";
      
      setToastMessage(infoMessage);
      setToastType('info');
      setShowToast(true);
    }
  };

  const handleSecondButtonClick = () => {
    navigate('/gallery');
  };
  
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{t('home.heroTitle')}</h1>
            <p className="hero-subtitle">
              {t('home.heroSubtitle')}
            </p>
            <div className="hero-buttons">
              <Link to="/menu">
                <Button>{t('home.viewMenu')}</Button>
              </Link>
              <Button variant="secondary" onClick={handleSecondButtonClick}>
                {language === 'uz' ? 'Galereya' : language === 'ru' ? 'Галерея' : 'Gallery'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3>{t('home.amazingFood')}</h3>
              <p>{t('home.amazingFoodDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3>{t('home.skilledChefs')}</h3>
              <p>{t('home.skilledChefsDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3>{t('home.elegantAmbiance')}</h3>
              <p>{t('home.elegantAmbianceDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-choose-us">
        <div className="container">
          <h2 className="section-title">{t('home.whyChooseUs')}</h2>
          <p className="section-subtitle">{t('home.whyChooseUsDesc')}</p>
          <div className="why-grid">
            <div className="why-item">
              <div className="why-number">01</div>
              <h3>{t('home.freshIngredients')}</h3>
              <p>{t('home.freshIngredientsDesc')}</p>
            </div>
            <div className="why-item">
              <div className="why-number">02</div>
              <h3>{t('home.fastDelivery')}</h3>
              <p>{t('home.fastDeliveryDesc')}</p>
            </div>
            <div className="why-item">
              <div className="why-number">03</div>
              <h3>{t('home.excellentService')}</h3>
              <p>{t('home.excellentServiceDesc')}</p>
            </div>
            <div className="why-item">
              <div className="why-number">04</div>
              <h3>{t('home.affordablePrices')}</h3>
              <p>{t('home.affordablePricesDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {!isInstalled && (
        <section className="pwa-banner">
          <div className="container">
            <div className="pwa-banner-content">
              <div className="pwa-banner-icon">
                📱
              </div>
              <div className="pwa-banner-text">
                <h3>
                  {language === 'uz' ? "Ilovani Telefoningizga O'rnating!" : 
                   language === 'ru' ? "Установите Приложение на Телефон!" : 
                   "Install App on Your Phone!"}
                </h3>
                <p>
                  {language === 'uz' ? "Tezroq kirish, offline ishlash va ko'proq imkoniyatlar!" : 
                   language === 'ru' ? "Быстрый доступ, работа офлайн и больше возможностей!" : 
                   "Faster access, offline mode and more features!"}
                </p>
              </div>
              <div className="pwa-banner-action">
                <Button onClick={handleInstallClick}>
                  {language === 'uz' ? "O'rnatish" : 
                   language === 'ru' ? "Установить" : 
                   "Install"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">{t('home.customerReviews')}</h2>
          <p className="section-subtitle">{t('home.customerReviewsDesc')}</p>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                {t('home.reviewText')}
              </p>
              <div className="testimonial-author">
                <strong>{t('home.reviewAuthor')}</strong>
                <span>{t('home.regularCustomer')}</span>
              </div>
            </div>
          </div>
          <div className="testimonials-cta">
            <Link to="/testimonials">
              <Button>{t('home.viewAllReviews')}</Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={8000}
      />
    </div>
  );
};

export default HomePage;
