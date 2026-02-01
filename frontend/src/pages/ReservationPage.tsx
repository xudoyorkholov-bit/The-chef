import React, { useState } from 'react';
import { reservationApi } from '../api/reservations';
import { CreateReservationRequest } from '../types';
import { useLanguage } from '../context/LanguageContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import './ReservationPage.css';

const ReservationPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<CreateReservationRequest>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    reservation_date: '',
    reservation_time: '',
    party_size: 2,
    special_requests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'party_size' ? parseInt(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Ism kiritish majburiy';
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email kiritish majburiy';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Noto\'g\'ri email formati';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Telefon raqam kiritish majburiy';
    }

    if (!formData.reservation_date) {
      newErrors.reservation_date = 'Sana kiritish majburiy';
    }

    if (!formData.reservation_time) {
      newErrors.reservation_time = 'Vaqt kiritish majburiy';
    }

    if (formData.party_size < 1) {
      newErrors.party_size = 'Odamlar soni kamida 1 bo\'lishi kerak';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      await reservationApi.create(formData);
      setSuccess(true);
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        reservation_date: '',
        reservation_time: '',
        party_size: 2,
        special_requests: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setErrors({ submit: 'Bron qilishda xatolik. Iltimos, qayta urinib ko\'ring.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-page">
      <div className="container">
        <div className="reservation-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="page-title">Bron qilish</h1>
        <p className="page-subtitle">Stol band qilish uchun ma'lumotlaringizni kiriting</p>
        
        <div className="reservation-content">
          <Card className="reservation-form-card">
            {success && (
              <div className="success-message">
                ✓ Bron muvaffaqiyatli yaratildi! Tez orada siz bilan bog'lanamiz.
              </div>
            )}

            <form onSubmit={handleSubmit} className="reservation-form">
              <Input
                label="To'liq ism"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                error={errors.customer_name}
                required
              />

              <Input
                label="Email"
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                error={errors.customer_email}
                required
              />

              <Input
                label="Telefon"
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                error={errors.customer_phone}
                required
              />

              <Input
                label="Sana"
                type="date"
                name="reservation_date"
                value={formData.reservation_date}
                onChange={handleChange}
                error={errors.reservation_date}
                required
              />

              <Input
                label="Vaqt"
                type="time"
                name="reservation_time"
                value={formData.reservation_time}
                onChange={handleChange}
                error={errors.reservation_time}
                required
              />

              <Input
                label="Odamlar soni"
                type="number"
                name="party_size"
                value={formData.party_size.toString()}
                onChange={handleChange}
                error={errors.party_size}
                required
              />

              <Input
                label="Maxsus so'rovlar"
                name="special_requests"
                value={formData.special_requests || ''}
                onChange={handleChange}
                multiline
                rows={4}
              />

              {errors.submit && <p className="error-message">{errors.submit}</p>}

              <Button type="submit" disabled={loading} fullWidth>
                {loading ? 'Yuborilmoqda...' : 'Bron qilish'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
