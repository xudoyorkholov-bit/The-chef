import React, { useEffect, useState } from 'react';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../api/menu';
import { galleryApi } from '../../api/gallery';
import type { MenuItem, GalleryImage } from '../../types';
import './AdminMenu.css';

interface MenuFormData {
  name: string;
  name_ru: string;
  description: string;
  description_ru: string;
  price: string;
  category: 'food' | 'beverage';
  image_url: string;
  available: boolean;
}

const AdminMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [formData, setFormData] = useState<MenuFormData>({
    name: '',
    name_ru: '',
    description: '',
    description_ru: '',
    price: '',
    category: 'food',
    image_url: '',
    available: true,
  });

  const categories = [
    { value: 'all', label: 'Barchasi' },
    { value: 'food', label: 'Taomlar' },
    { value: 'beverage', label: 'Ichimliklar' },
  ];

  useEffect(() => {
    loadMenuItems();
    loadGalleryImages();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const items = await getMenuItems();
      console.log('Yuklangan menyu elementlari:', items);
      setMenuItems(items);
    } catch (error) {
      console.error('Menyu elementlarini yuklashda xatolik:', error);
      showNotification('Menyu elementlarini yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadGalleryImages = async () => {
    try {
      const images = await galleryApi.getAll();
      setGalleryImages(images);
    } catch (error) {
      console.error('Galereya rasmlarini yuklashda xatolik:', error);
    }
  };

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        name_ru: item.name_ru || '',
        description: item.description,
        description_ru: item.description_ru || '',
        price: item.price.toString(),
        category: item.category,
        image_url: item.image_url,
        available: item.available,
      });
      setPreviewUrl(item.image_url);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        name_ru: '',
        description: '',
        description_ru: '',
        price: '',
        category: 'food',
        image_url: '',
        available: true,
      });
      setPreviewUrl('');
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      // Upload to your backend - remove /api from URL since we're adding /upload
      const apiBaseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
      const response = await fetch(`${apiBaseUrl}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || 'Rasm yuklashda xatolik');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Rasm yuklashda xatolik:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image_url;

      // Validate that an image is selected
      if (!selectedFile && !imageUrl) {
        showNotification('Iltimos rasm tanlang!', 'error');
        return;
      }

      // If a new file is selected, upload it first
      if (selectedFile) {
        setUploading(true);
        try {
          imageUrl = await uploadImage(selectedFile);
        } catch (error) {
          showNotification('Rasm yuklashda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.', 'error');
          return;
        } finally {
          setUploading(false);
        }
      }

      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        image_url: imageUrl,
      };

      if (editingItem) {
        await updateMenuItem(editingItem.id, itemData);
      } else {
        await createMenuItem(itemData);
      }

      await loadMenuItems();
      handleCloseModal();
      showNotification(
        editingItem ? '✓ Taom muvaffaqiyatli yangilandi!' : '✓ Taom muvaffaqiyatli qo\'shildi!',
        'success'
      );
    } catch (error: any) {
      console.error('Menyu elementini saqlashda xatolik:', error);
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Xatolik yuz berdi';
      showNotification(`Xatolik: ${errorMessage}. Iltimos qaytadan urinib ko'ring.`, 'error');
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    setFormData({ ...formData, image_url: imageUrl });
    setIsGalleryModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMenuItem(id);
      await loadMenuItems();
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
      showNotification('✓ Taom muvaffaqiyatli o\'chirildi!', 'success');
    } catch (error) {
      console.error('Menyu elementini o\'chirishda xatolik:', error);
      showNotification('Taomni o\'chirishda xatolik yuz berdi', 'error');
    }
  };

  const handleOpenDeleteModal = (item: MenuItem) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  if (loading) {
    return (
      <div className="admin-menu">
        <div className="loading-spinner">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="admin-menu">
      {showToast && (
        <div className={`toast-notification ${toastType}`}>
          {toastMessage}
        </div>
      )}
      <div className="admin-menu-header">
        <div>
          <h1 className="admin-menu-title">Menyu boshqaruvi</h1>
          <p className="admin-menu-subtitle">Restoran menyusini boshqaring</p>
        </div>
        <button className="btn-add-menu" onClick={() => handleOpenModal()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Yangi taom qo'shish
        </button>
      </div>

      <div className="menu-filters">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredItems.map((item) => {
          // Construct full image URL
          const getImageUrl = (url: string) => {
            if (!url) return 'https://via.placeholder.com/300x200?text=Rasm+yo%27q';
            if (url.startsWith('http')) return url;
            // Remove /api from the URL for static files
            const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
            return `${baseUrl}${url}`;
          };

          return (
            <div key={item.id} className="menu-card">
              <div className="menu-card-image">
                <img 
                  src={getImageUrl(item.image_url)} 
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error('Rasm yuklanmadi:', item.image_url);
                    target.src = 'https://via.placeholder.com/300x200?text=Rasm+topilmadi';
                  }}
                />
                <div className={`menu-card-status ${item.available ? 'available' : 'unavailable'}`}>
                  {item.available ? 'Mavjud' : 'Mavjud emas'}
                </div>
              </div>
            <div className="menu-card-content">
              <div className="menu-card-header">
                <h3 className="menu-card-title">{item.name}</h3>
                <span className="menu-card-category">{getCategoryLabel(item.category)}</span>
              </div>
              <p className="menu-card-description">{item.description}</p>
              <div className="menu-card-footer">
                <span className="menu-card-price">{item.price.toLocaleString()} so'm</span>
                <div className="menu-card-actions">
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => handleOpenModal(item)}
                    title="Tahrirlash"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleOpenDeleteModal(item)}
                    title="O'chirish"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>Hech qanday menyu elementi topilmadi</p>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Menyu elementini tahrirlash' : 'Yangi taom qo\'shish'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nomi (O'zbekcha) *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nomi (Ruscha)</label>
                  <input
                    type="text"
                    value={formData.name_ru}
                    onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tavsif (O'zbekcha) *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tavsif (Ruscha)</label>
                <textarea
                  value={formData.description_ru}
                  onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Narxi (so'm) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    min="0"
                    step="1000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Kategoriya *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    required
                  >
                    <option value="food">Taomlar</option>
                    <option value="beverage">Ichimliklar</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Rasm *</label>
                <div className="image-selector">
                  {previewUrl && (
                    <div className="selected-image-preview">
                      <img 
                        src={previewUrl.startsWith('data:') || previewUrl.startsWith('http') ? previewUrl : `${import.meta.env.VITE_API_URL.replace('/api', '')}${previewUrl}`} 
                        alt="Tanlangan rasm" 
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload" className="btn-select-image">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2"/>
                      <path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {previewUrl ? 'Rasmni o\'zgartirish' : 'Rasm tanlash'}
                  </label>
                  {selectedFile && (
                    <p className="file-name">{selectedFile.name}</p>
                  )}
                </div>
              </div>

              <div className="form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  />
                  <span>Mavjud</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn-submit" disabled={uploading}>
                  {uploading ? 'Yuklanmoqda...' : editingItem ? 'Saqlash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isGalleryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsGalleryModalOpen(false)}>
          <div className="modal-content gallery-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Galereyadan rasm tanlang</h2>
              <button className="modal-close" onClick={() => setIsGalleryModalOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="gallery-grid">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="gallery-item"
                  onClick={() => handleSelectImage(image.image_url)}
                >
                  <img src={image.image_url} alt={image.title} />
                  <div className="gallery-item-overlay">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            {galleryImages.length === 0 && (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2"/>
                  <path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Galereyada rasmlar yo'q</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isDeleteModalOpen && deletingItem && (
        <div className="modal-overlay" onClick={handleCloseDeleteModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="delete-modal-title">Taomni o'chirish</h2>
            <p className="delete-modal-message">
              <strong>{deletingItem.name}</strong> taomini o'chirmoqchimisiz?<br/>
              Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="delete-modal-actions">
              <button 
                type="button" 
                className="btn-cancel-delete" 
                onClick={handleCloseDeleteModal}
              >
                Bekor qilish
              </button>
              <button 
                type="button" 
                className="btn-confirm-delete" 
                onClick={() => handleDelete(deletingItem.id)}
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
