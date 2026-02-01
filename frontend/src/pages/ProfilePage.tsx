import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';
import { usersApi } from '../api/users';
import './ProfilePage.css';

// Get API URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

interface UserInfo {
  name: string;
  phone: string;
  password: string;
  address: string;
}

interface Address {
  id: number;
  title: string;
  fullAddress: string;
  isDefault: boolean;
}

interface PaymentCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault: boolean;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  
  // Get API URL from environment or construct from window.location
  const getApiUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      return apiUrl.replace('/api', '');
    }
    // Fallback: use current host with port 5000
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:5000`;
  };
  
  const API_BASE_URL = getApiUrl();
  
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: user?.full_name || user?.username || 'Mehmon',
    phone: user?.phone || '+998 90 123 45 67',
    password: '********',
    address: 'Toshkent, O\'zbekiston'
  });
  const [editedInfo, setEditedInfo] = useState<UserInfo>(userInfo);
  
  // Load addresses from localStorage with user-specific key
  const [addresses, setAddresses] = useState<Address[]>(() => {
    if (!user?.id) return [];
    const saved = localStorage.getItem(`userAddresses_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newAddress, setNewAddress] = useState({ title: '', fullAddress: '' });
  
  // Load payment cards from user data (backend)
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
  
  const [newCard, setNewCard] = useState({ cardNumber: '', cardHolder: '', expiryDate: '' });
  
  const [notifications, setNotifications] = useState(true);
  
  // Format card number: 1234 5678 9012 3456
  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 16 digits
    const limitedDigits = digits.substring(0, 16);
    
    // Add space every 4 digits
    let formatted = '';
    for (let i = 0; i < limitedDigits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += limitedDigits[i];
    }
    
    return formatted;
  };
  
  // Update userInfo when user data changes
  useEffect(() => {
    if (user) {
      const updatedInfo = {
        name: user.full_name || user.username || 'Mehmon',
        phone: user.phone || '+998 90 123 45 67',
        password: '********',
        address: 'Toshkent, O\'zbekiston'
      };
      setUserInfo(updatedInfo);
      setEditedInfo(updatedInfo);
      
      // Set profile picture URL from user context
      console.log('User profile picture URL:', user.profile_picture_url);
      setProfileImageUrl(user.profile_picture_url || null);
      
      // Load user-specific addresses
      const savedAddresses = localStorage.getItem(`userAddresses_${user.id}`);
      setAddresses(savedAddresses ? JSON.parse(savedAddresses) : []);
      
      // Load payment cards from user data (backend)
      if (user.payment_methods && user.payment_methods.length > 0) {
        console.log('Loading payment methods from user:', user.payment_methods);
        const cards = user.payment_methods.map(pm => ({
          id: pm.id,
          cardNumber: pm.cardNumber,
          cardHolder: pm.cardHolder,
          expiryDate: pm.expiryDate,
          isDefault: pm.isDefault
        }));
        console.log('Mapped cards:', cards);
        setPaymentCards(cards);
      } else {
        setPaymentCards([]);
      }
    }
  }, [user]);

  // Save addresses to localStorage with user-specific key
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`userAddresses_${user.id}`, JSON.stringify(addresses));
    }
  }, [addresses, user?.id]);

  // Payment cards are now saved to backend, not localStorage

  const handleMenuClick = (menuItem: string) => {
    if (menuItem === t('profile.personalInfo')) {
      setEditedInfo(userInfo);
      setShowPersonalInfoModal(true);
    } else if (menuItem === t('profile.addresses')) {
      setShowAddressModal(true);
    } else if (menuItem === t('profile.payment')) {
      setShowPaymentModal(true);
    } else if (menuItem === t('profile.settings')) {
      setShowSettingsModal(true);
    } else {
      alert(`${menuItem} - Tez orada ishga tushadi!`);
    }
  };

  const handleSavePersonalInfo = async () => {
    try {
      // Save to backend
      await usersApi.updateProfile({
        full_name: editedInfo.name,
        phone: editedInfo.phone
      });
      
      // Update local state
      setUserInfo(editedInfo);
      setShowPersonalInfoModal(false);
      setToastMessage(t('toast.saved'));
      setShowToast(true);
      
      // Refresh user data
      const updatedProfile = await usersApi.getProfile();
      updateUser(updatedProfile);
    } catch (error) {
      console.error('Error saving personal info:', error);
      setToastMessage('Ma\'lumotlarni saqlashda xatolik yuz berdi');
      setShowToast(true);
    }
  };

  const handleAddAddress = () => {
    if (newAddress.title && newAddress.fullAddress) {
      const address: Address = {
        id: Date.now(),
        title: newAddress.title,
        fullAddress: newAddress.fullAddress,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, address]);
      setNewAddress({ title: '', fullAddress: '' });
      setToastMessage(t('toast.addressAdded'));
      setShowToast(true);
    }
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    setToastMessage(t('toast.addressDeleted'));
    setShowToast(true);
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    setToastMessage(t('toast.defaultChanged'));
    setShowToast(true);
  };

  const handleAddCard = async () => {
    if (newCard.cardNumber && newCard.cardHolder && newCard.expiryDate) {
      try {
        // Remove spaces from card number for processing
        const cleanCardNumber = newCard.cardNumber.replace(/\s/g, '');
        
        // Validate card number length
        if (cleanCardNumber.length !== 16) {
          setToastMessage('Karta raqami 16 ta raqamdan iborat bo\'lishi kerak');
          setShowToast(true);
          return;
        }
        
        // Mask the card number: 1234 **** **** 5678
        const maskedNumber = cleanCardNumber.slice(0, 4) + ' **** **** ' + cleanCardNumber.slice(-4);
        const cardId = Date.now().toString();
        
        // Save to backend
        await usersApi.addPaymentMethod({
          id: cardId,
          cardNumber: maskedNumber,
          cardHolder: newCard.cardHolder.toUpperCase(),
          expiryDate: newCard.expiryDate,
          isDefault: paymentCards.length === 0
        });
        
        // Update local state
        const card: PaymentCard = {
          id: cardId,
          cardNumber: maskedNumber,
          cardHolder: newCard.cardHolder.toUpperCase(),
          expiryDate: newCard.expiryDate,
          isDefault: paymentCards.length === 0,
        };
        setPaymentCards([...paymentCards, card]);
        setNewCard({ cardNumber: '', cardHolder: '', expiryDate: '' });
        setToastMessage(t('toast.cardAdded'));
        setShowToast(true);
        
        // Refresh user data
        const updatedProfile = await usersApi.getProfile();
        updateUser(updatedProfile);
      } catch (error) {
        console.error('Error adding card:', error);
        setToastMessage('Karta qo\'shishda xatolik yuz berdi');
        setShowToast(true);
      }
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      // Delete from backend
      await usersApi.deletePaymentMethod(id);
      
      // Update local state
      setPaymentCards(paymentCards.filter(card => card.id !== id));
      setToastMessage(t('toast.cardDeleted'));
      setShowToast(true);
      
      // Refresh user data
      const updatedProfile = await usersApi.getProfile();
      updateUser(updatedProfile);
    } catch (error) {
      console.error('Error deleting card:', error);
      setToastMessage('Kartani o\'chirishda xatolik yuz berdi');
      setShowToast(true);
    }
  };

  const handleSetDefaultCard = async (id: string) => {
    try {
      // Update on backend
      await usersApi.updatePaymentMethod(id, true);
      
      // Update local state
      setPaymentCards(paymentCards.map(card => ({
        ...card,
        isDefault: card.id === id
      })));
      setToastMessage(t('toast.defaultCardChanged'));
      setShowToast(true);
      
      // Refresh user data
      const updatedProfile = await usersApi.getProfile();
      updateUser(updatedProfile);
    } catch (error) {
      console.error('Error setting default card:', error);
      setToastMessage('Asosiy kartani o\'zgartirishda xatolik yuz berdi');
      setShowToast(true);
    }
  };

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setEditedInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageChange = (lang: 'uz' | 'ru') => {
    setLanguage(lang);
    setToastMessage(t('toast.languageChanged'));
    setShowToast(true);
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    setToastMessage(!notifications ? t('toast.notificationsOn') : t('toast.notificationsOff'));
    setShowToast(true);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      setShowSettingsModal(false);
      setToastMessage(t('toast.loggedOut'));
      setShowToast(true);
      setTimeout(() => {
        navigate('/auth');
      }, 1000);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowSettingsModal(false);
      setToastMessage(t('toast.loggedOut'));
      setShowToast(true);
      setTimeout(() => {
        navigate('/auth');
      }, 1000);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setToastMessage(t('toast.photoError'));
      setShowToast(true);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToastMessage(t('toast.photoError'));
      setShowToast(true);
      return;
    }

    setIsUploadingImage(true);
    try {
      console.log('Uploading profile picture...');
      const response = await usersApi.uploadProfilePicture(file);
      console.log('Upload response:', response);
      
      // Update local state immediately
      setProfileImageUrl(response.profile_picture_url);
      
      // Update user context with new profile picture
      const updatedUser = await usersApi.getProfile();
      console.log('Updated user data:', updatedUser);
      if (updatedUser) {
        updateUser(updatedUser);
      }
      
      setToastMessage(t('toast.photoUploaded'));
      setShowToast(true);
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      console.error('Error details:', errorMessage);
      setToastMessage(t('toast.photoError'));
      setShowToast(true);
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteProfilePicture = async () => {
    try {
      console.log('Deleting profile picture...');
      await usersApi.deleteProfilePicture();
      
      // Update local state immediately
      setProfileImageUrl(null);
      
      // Update user context
      const updatedUser = await usersApi.getProfile();
      console.log('Updated user data after delete:', updatedUser);
      if (updatedUser) {
        updateUser(updatedUser);
      }
      
      setToastMessage(t('toast.photoDeleted'));
      setShowToast(true);
    } catch (error: any) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      console.error('Error details:', errorMessage);
      setToastMessage(t('toast.photoError'));
      setShowToast(true);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-title-row">
          <h1 className="page-title">{t('profile.title')}</h1>
          <button className="logout-icon-btn" onClick={handleLogoutClick} title="Chiqish">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
        
        <div className="profile-header">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div className="profile-avatar" onClick={handleProfilePictureClick} style={{ cursor: 'pointer', position: 'relative' }}>
            {profileImageUrl ? (
              <img 
                src={`${API_BASE_URL}${profileImageUrl}`} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => {
                  console.error('Image load error:', profileImageUrl);
                  console.error('Full URL:', `${API_BASE_URL}${profileImageUrl}`);
                  // If image fails to load, show default avatar
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
            {isUploadingImage && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                Yuklanmoqda...
              </div>
            )}
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: 'var(--primary-color)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </div>
          </div>
          <h2>{user?.full_name || user?.username || userInfo.name}</h2>
          <p>{user?.phone || userInfo.phone}</p>
        </div>

        <div className="profile-menu">
          <Card className="menu-item" onClick={() => handleMenuClick(t('profile.personalInfo'))}>
            <div className="menu-item-content">
              <div className="menu-icon-wrapper">
                <svg className="menu-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span>{t('profile.personalInfo')}</span>
            </div>
          </Card>

          <Card className="menu-item" onClick={() => handleMenuClick(t('profile.addresses'))}>
            <div className="menu-item-content">
              <div className="menu-icon-wrapper">
                <svg className="menu-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <span>{t('profile.addresses')}</span>
            </div>
          </Card>

          <Card className="menu-item" onClick={() => handleMenuClick(t('profile.payment'))}>
            <div className="menu-item-content">
              <div className="menu-icon-wrapper">
                <svg className="menu-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>
              <span>{t('profile.payment')}</span>
            </div>
          </Card>

          <Card className="menu-item" onClick={() => handleMenuClick(t('profile.settings'))}>
            <div className="menu-item-content">
              <div className="menu-icon-wrapper">
                <svg className="menu-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
              </div>
              <span>{t('profile.settings')}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Shaxsiy ma'lumotlar modali */}
      <Modal
        isOpen={showPersonalInfoModal}
        onClose={() => setShowPersonalInfoModal(false)}
        title={t('profile.personalInfo')}
      >
        <div className="personal-info-form">
          {/* Profile Picture Section */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              margin: '0 auto 15px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #f0f0f0',
              cursor: 'pointer',
              position: 'relative'
            }} onClick={handleProfilePictureClick}>
              {profileImageUrl ? (
                <img 
                  src={`${API_BASE_URL}${profileImageUrl}`} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    console.error('Modal image load error:', profileImageUrl);
                    console.error('Full URL:', `${API_BASE_URL}${profileImageUrl}`);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  background: 'linear-gradient(135deg, #ff0000, #ff4444)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
              {isUploadingImage && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px'
                }}>
                  Yuklanmoqda...
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleProfilePictureClick}
                disabled={isUploadingImage}
                style={{
                  padding: '8px 16px',
                  background: isUploadingImage ? '#ccc' : 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  cursor: isUploadingImage ? 'not-allowed' : 'pointer'
                }}
              >
                {profileImageUrl ? t('personal.changePhoto') : t('personal.uploadPhoto')}
              </button>
              {profileImageUrl && (
                <button
                  type="button"
                  onClick={handleDeleteProfilePicture}
                  disabled={isUploadingImage}
                  style={{
                    padding: '8px 16px',
                    background: isUploadingImage ? '#ccc' : '#fee',
                    color: isUploadingImage ? '#999' : '#dc3545',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: isUploadingImage ? 'not-allowed' : 'pointer'
                  }}
                >
                  {t('personal.deletePhoto')}
                </button>
              )}
            </div>
          </div>

          <div className="form-row">
            <Input
              label={t('personal.name')}
              name="name"
              value={editedInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('personal.namePlaceholder')}
            />
          </div>
          
          <div className="form-row">
            <Input
              label={t('personal.phone')}
              name="phone"
              type="tel"
              value={editedInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={t('personal.phonePlaceholder')}
            />
          </div>
          
          <div className="form-row">
            <Input
              label={t('personal.password')}
              name="password"
              type="password"
              value={editedInfo.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder={t('personal.passwordPlaceholder')}
            />
          </div>
          
          <div className="form-row">
            <Input
              label={t('personal.address')}
              name="address"
              value={editedInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder={t('personal.addressPlaceholder')}
            />
          </div>
          
          <div className="form-actions">
            <Button fullWidth onClick={handleSavePersonalInfo}>
              {t('personal.save')}
            </Button>
            <Button 
              fullWidth 
              variant="secondary"
              onClick={() => setShowPersonalInfoModal(false)}
            >
              {t('personal.cancel')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Manzillarim modali */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title={t('address.title')}
      >
        <div className="addresses-container">
          {addresses.map((address) => (
            <div key={address.id} className="address-card">
              <div className="address-header">
                <h4>{address.title}</h4>
                {address.isDefault && <span className="default-badge">{t('address.default')}</span>}
              </div>
              <p className="address-text">{address.fullAddress}</p>
              <div className="address-actions">
                {!address.isDefault && (
                  <button 
                    className="address-btn address-btn-default"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    {t('address.setDefault')}
                  </button>
                )}
                <button 
                  className="address-btn address-btn-delete"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  {t('address.delete')}
                </button>
              </div>
            </div>
          ))}
          
          <div className="add-address-form">
            <h4>{t('address.addNew')}</h4>
            <Input
              label={t('address.name')}
              name="addressTitle"
              value={newAddress.title}
              onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
              placeholder={t('address.namePlaceholder')}
            />
            <Input
              label={t('address.fullAddress')}
              name="addressFull"
              value={newAddress.fullAddress}
              onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
              placeholder={t('address.addressPlaceholder')}
            />
            <Button fullWidth onClick={handleAddAddress}>
              {t('address.add')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* To'lov usullari modali */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={t('payment.title')}
      >
        <div className="addresses-container">
          {paymentCards.map((card) => (
            <div key={card.id} className="payment-card">
              <div className="card-chip">
                <svg viewBox="0 0 48 48" fill="none">
                  <rect x="4" y="8" width="32" height="24" rx="4" fill="#FFD700"/>
                  <rect x="8" y="12" width="8" height="6" rx="1" fill="#FFA500"/>
                </svg>
              </div>
              <div className="card-number">{card.cardNumber}</div>
              <div className="card-details">
                <div>
                  <div className="card-label">{t('payment.owner')}</div>
                  <div className="card-holder">{card.cardHolder}</div>
                </div>
                <div>
                  <div className="card-label">{t('payment.validThru')}</div>
                  <div className="card-expiry">{card.expiryDate}</div>
                </div>
              </div>
              {card.isDefault && <span className="default-badge card-badge">{t('address.default')}</span>}
              <div className="address-actions">
                {!card.isDefault && (
                  <button 
                    className="address-btn address-btn-default"
                    onClick={() => handleSetDefaultCard(card.id)}
                  >
                    {t('address.setDefault')}
                  </button>
                )}
                <button 
                  className="address-btn address-btn-delete"
                  onClick={() => handleDeleteCard(card.id)}
                >
                  {t('address.delete')}
                </button>
              </div>
            </div>
          ))}
          
          <div className="add-address-form">
            <h4>{t('payment.addNew')}</h4>
            <Input
              label={t('payment.cardNumber')}
              name="cardNumber"
              value={newCard.cardNumber}
              onChange={(e) => setNewCard({ ...newCard, cardNumber: formatCardNumber(e.target.value) })}
              placeholder={t('payment.cardNumberPlaceholder')}
            />
            <Input
              label={t('payment.cardHolder')}
              name="cardHolder"
              value={newCard.cardHolder}
              onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
              placeholder={t('payment.cardHolderPlaceholder')}
            />
            <Input
              label={t('payment.expiry')}
              name="expiryDate"
              value={newCard.expiryDate}
              onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
              placeholder={t('payment.expiryPlaceholder')}
            />
            <Button fullWidth onClick={handleAddCard}>
              {t('address.add')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Sozlamalar modali */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title={t('settings.title')}
      >
        <div className="settings-container">
          <div className="settings-section">
            <h4 className="settings-section-title">{t('settings.language')}</h4>
            <div className="settings-options">
              <button
                className={`settings-option ${language === 'uz' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('uz')}
              >
                <span>{t('settings.uzbek')}</span>
                {language === 'uz' && (
                  <svg className="check-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                )}
              </button>
              <button
                className={`settings-option ${language === 'ru' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('ru')}
              >
                <span>{t('settings.russian')}</span>
                {language === 'ru' && (
                  <svg className="check-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h4 className="settings-section-title">{t('settings.notifications')}</h4>
            <div className="settings-toggle">
              <span>{t('settings.pushNotifications')}</span>
              <button
                className={`toggle-switch ${notifications ? 'active' : ''}`}
                onClick={handleNotificationsToggle}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>
          </div>

          <div className="settings-section">
            <Button fullWidth variant="danger" onClick={handleLogout}>
              {t('settings.logout')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Chiqish tasdiqlash modali */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Chiqish"
      >
        <div className="logout-confirmation">
          <p className="logout-message">Profildan chiqmoqchimisiz?</p>
          <div className="logout-actions">
            <Button fullWidth onClick={confirmLogout} variant="danger">
              Ha, chiqish
            </Button>
            <Button 
              fullWidth 
              variant="secondary"
              onClick={() => setShowLogoutModal(false)}
            >
              Yo'q, bekor qilish
            </Button>
          </div>
        </div>
      </Modal>

      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default ProfilePage;
