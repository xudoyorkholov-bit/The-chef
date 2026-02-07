import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/Button';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

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
    </div>
  );
};

export default HomePage;
