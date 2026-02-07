import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { testimonialsApi, Testimonial } from '../api/testimonials';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Toast from '../components/Toast';
import './TestimonialsPage.css';

const TestimonialsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await testimonialsApi.getApproved();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      setToastMessage(t('testimonial.commentRequired'));
      setToastType('error');
      setShowToast(true);
      return;
    }

    if (comment.trim().length < 10) {
      setToastMessage(t('testimonial.commentTooShort'));
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await testimonialsApi.create({
        rating,
        comment: comment.trim()
      });
      
      setToastMessage(t('testimonial.success'));
      setToastType('success');
      setShowToast(true);
      setShowReviewModal(false);
      setRating(5);
      setComment('');
      
      // Reload testimonials
      loadTestimonials();
    } catch (error: any) {
      console.error('Submit review error:', error);
      setToastMessage(error.response?.data?.error || t('testimonial.error'));
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenReviewModal = () => {
    if (!isAuthenticated) {
      setToastMessage(t('testimonial.loginRequired'));
      setToastType('error');
      setShowToast(true);
      return;
    }
    setShowReviewModal(true);
  };

  const renderStars = (count: number) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  return (
    <div className="testimonials-page">
      <div className="testimonials-hero">
        <div className="container">
          <h1 className="page-title">{t('testimonials.pageTitle')}</h1>
          <p className="page-subtitle">{t('testimonials.pageSubtitle')}</p>
          <div style={{ marginTop: '20px' }}>
            <Button onClick={handleOpenReviewModal}>
              {t('testimonial.writeReview')}
            </Button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="all-testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id || testimonial._id} className="testimonial-card">
              <div className="testimonial-stars">{renderStars(testimonial.rating)}</div>
              <p className="testimonial-text">{testimonial.comment}</p>
              <div className="testimonial-author">
                <strong>{testimonial.user_name}</strong>
                <span>{new Date(testimonial.created_at).toLocaleDateString('uz-UZ')}</span>
              </div>
            </div>
          ))}
          
          {testimonials.length === 0 && (
            <div className="no-testimonials">
              <p>{t('testimonial.noReviews')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={t('testimonial.writeReview')}
      >
        <div className="review-form">
          <div className="form-group">
            <label>{t('testimonial.rating')}</label>
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>{t('testimonial.comment')}</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('testimonial.commentPlaceholder')}
              rows={5}
              maxLength={500}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              {comment.length}/500
            </small>
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <Button 
              fullWidth 
              onClick={handleSubmitReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('testimonial.submitting') : t('testimonial.submit')}
            </Button>
            <Button 
              fullWidth 
              variant="secondary"
              onClick={() => setShowReviewModal(false)}
              disabled={isSubmitting}
            >
              {t('personal.cancel')}
            </Button>
          </div>
        </div>
      </Modal>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default TestimonialsPage;
