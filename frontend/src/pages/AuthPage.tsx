import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import './AuthPage.css';

type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    phone: '+998',
    password: '',
    confirmPassword: '',
    full_name: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    
    // If user tries to delete +998, prevent it
    if (value.length < 4 || !value.startsWith('+998')) {
      setFormData({
        ...formData,
        phone: '+998'
      });
      return;
    }
    
    // Extract only the digits after +998
    const afterPrefix = value.substring(4);
    const digits = afterPrefix.replace(/\D/g, '');
    
    // Limit to 9 digits
    const limitedDigits = digits.substring(0, 9);
    
    // Format: +998 90 123 45 67
    let formatted = '+998';
    if (limitedDigits.length > 0) {
      formatted += ' ' + limitedDigits.substring(0, 2);
    }
    if (limitedDigits.length > 2) {
      formatted += ' ' + limitedDigits.substring(2, 5);
    }
    if (limitedDigits.length > 5) {
      formatted += ' ' + limitedDigits.substring(5, 7);
    }
    if (limitedDigits.length > 7) {
      formatted += ' ' + limitedDigits.substring(7, 9);
    }
    
    setFormData({
      ...formData,
      phone: formatted
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate phone number (should be +998 XX XXX XX XX)
    const phoneDigits = formData.phone.replace(/\D/g, '').substring(3); // Remove +998
    
    // Validate phone number length
    if (phoneDigits.length < 9) {
      setError('To\'liq telefon raqamini kiriting');
      return;
    }

    if (mode === 'register') {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Parollar mos kelmaydi');
        return;
      }

      // Validate password length
      if (formData.password.length < 6) {
        setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
        return;
      }
    }

    setIsLoading(true);

    try {
      // Use the formatted phone directly (already has +998)
      const fullPhone = formData.phone.replace(/\s/g, ''); // Remove spaces
      
      if (mode === 'login') {
        // Login with phone number as username
        await login({
          username: fullPhone,
          password: formData.password
        });
      } else {
        // Register with phone as username and email
        await register({
          username: fullPhone,
          email: fullPhone.replace('+', '') + '@thechef.uz', // Generate email from phone
          password: formData.password,
          phone: fullPhone,
          full_name: formData.full_name || undefined
        });
      }
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 
        (mode === 'login' ? 'Telefon raqam yoki parol noto\'g\'ri' : 'Ro\'yxatdan o\'tish amalga oshmadi');
      setError(errorMessage);
      // Don't clear the form data on error - keep user's input
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setFormData({
      phone: '+998',
      password: '',
      confirmPassword: '',
      full_name: ''
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-logo">The Chef</h1>
            <p className="auth-subtitle">
              {mode === 'login' ? 'Xush kelibsiz!' : 'Yangi hisob yarating'}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setError('');
              }}
              type="button"
            >
              Kirish
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setMode('register');
                setError('');
              }}
              type="button"
            >
              Ro'yxatdan o'tish
            </button>
          </div>


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Telefon raqami *"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
              placeholder="+998 90 123 45 67"
            />

            {mode === 'register' && (
              <Input
                label="To'liq ism"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="To'liq ismingizni kiriting"
              />
            )}

            <Input
              label="Parol *"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={mode === 'login' ? 'Parolingizni kiriting' : 'Parolingizni kiriting (kamida 6 ta belgi)'}
            />

            {mode === 'register' && (
              <Input
                label="Parolni tasdiqlang *"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Parolingizni qayta kiriting"
              />
            )}

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Yuklanmoqda...' : (mode === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish')}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              {mode === 'login' ? 'Hisobingiz yo\'qmi?' : 'Hisobingiz bormi?'}{' '}
              <button onClick={switchMode} className="auth-switch-btn" type="button">
                {mode === 'login' ? 'Ro\'yxatdan o\'tish' : 'Kirish'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
