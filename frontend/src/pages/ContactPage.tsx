import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock submission
    setTimeout(() => {
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setLoading(false);
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="page-title">Biz bilan bog'laning</h1>
        <p className="page-subtitle">Savollaringiz bormi? Biz sizga yordam berishga tayyormiz!</p>

        <div className="contact-content">
          <div className="contact-info">
            <Card className="info-card">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3>Manzil</h3>
              <p>Toshkent sh., Amir Temur ko'chasi, 123</p>
            </Card>

            <Card className="info-card">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3>Telefon</h3>
              <p>+998 90 123 45 67</p>
              <p>+998 91 234 56 78</p>
            </Card>

            <Card className="info-card">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Email</h3>
              <p>info@thechef.uz</p>
              <p>reservation@thechef.uz</p>
            </Card>

            <Card className="info-card">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Ish vaqti</h3>
              <p>Dushanba - Yakshanba</p>
              <p>10:00 - 23:00</p>
            </Card>
          </div>

          <Card className="contact-form-card">
            <h2>Xabar yuborish</h2>
            
            {success && (
              <div className="success-message">
                ✓ Xabaringiz yuborildi! Tez orada javob beramiz.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <Input
                label="Ismingiz"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                label="Telefon"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <Input
                label="Xabar"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={5}
                required
              />

              <Button type="submit" disabled={loading} fullWidth>
                {loading ? 'Yuborilmoqda...' : 'Yuborish'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
