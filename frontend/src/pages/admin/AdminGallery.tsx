import React, { useEffect, useState } from 'react';
import { galleryApi } from '../../api/gallery';
import type { GalleryImage } from '../../types';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';
import './AdminGallery.css';

const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await galleryApi.getAll();
      setImages(data.sort((a, b) => a.display_order - b.display_order));
    } catch (error) {
      console.error('Rasmlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingImage) {
        // Update existing image
        await galleryApi.update(editingImage.id, { title: formData.title });
        await loadImages();
      } else {
        // Create new image
        if (!formData.image) {
          alert('Iltimos, rasm tanlang');
          return;
        }
        
        const data = new FormData();
        data.append('title', formData.title);
        data.append('image', formData.image);
        
        console.log('Rasm yuborilmoqda...', {
          title: formData.title,
          imageSize: formData.image.size,
          imageType: formData.image.type
        });
        
        const result = await galleryApi.create(data);
        console.log('Rasm muvaffaqiyatli yuklandi:', result);
        await loadImages();
      }
      
      handleCloseModal();
    } catch (error: any) {
      console.error('Rasmni saqlashda xatolik:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert(`Rasmni saqlashda xatolik yuz berdi: ${error.response?.data?.error?.message || error.message}`);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({ title: image.title, image: null });
    setPreviewUrl(image.image_url);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Rasmni o\'chirmoqchimisiz?')) return;
    
    try {
      await galleryApi.delete(id);
      await loadImages();
    } catch (error) {
      console.error('Rasmni o\'chirishda xatolik:', error);
      alert('Rasmni o\'chirishda xatolik yuz berdi');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingImage(null);
    setFormData({ title: '', image: null });
    setPreviewUrl('');
  };

  if (loading) {
    return (
      <div className="admin-gallery">
        <div className="loading-spinner">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="admin-gallery">
      <div className="gallery-header">
        <div>
          <h1 className="gallery-title">Galereya</h1>
          <p className="gallery-subtitle">
            Restoran rasmlari va fotogalereya boshqaruvi
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Yangi rasm qo'shish
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
            <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2"/>
            <polyline points="21 15 16 10 5 21" strokeWidth="2"/>
          </svg>
          <p>Hali rasmlar qo'shilmagan</p>
          <Button onClick={() => setShowModal(true)}>
            Birinchi rasmni qo'shish
          </Button>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map((image) => (
            <div key={image.id} className="gallery-card">
              <div className="gallery-image-wrapper">
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="gallery-image"
                />
                <div className="gallery-overlay">
                  <button
                    className="overlay-btn overlay-btn-edit"
                    onClick={() => handleEdit(image)}
                    title="Tahrirlash"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className="overlay-btn overlay-btn-delete"
                    onClick={() => handleDelete(image.id)}
                    title="O'chirish"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3 6 5 6 21 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="gallery-card-content">
                <h3 className="gallery-card-title">{image.title}</h3>
                <p className="gallery-card-date">
                  {new Date(image.created_at).toLocaleDateString('uz-UZ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingImage ? 'Rasmni tahrirlash' : 'Yangi rasm qo\'shish'}
      >
        <form onSubmit={handleSubmit} className="gallery-form">
          <Input
            label="Rasm nomi"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Masalan: Restoran interyeri"
          />

          <div className="form-group">
            <label className="form-label">
              Rasm {!editingImage && <span className="required">*</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
              required={!editingImage}
            />
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Bekor qilish
            </Button>
            <Button type="submit">
              {editingImage ? 'Saqlash' : 'Qo\'shish'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminGallery;
