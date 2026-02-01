import React, { useState } from 'react';
import './GalleryPage.css';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
}

const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const categories = ['all', 'food', 'interior', 'events'];
  const categoryNames: Record<string, string> = {
    all: 'Barchasi',
    food: 'Taomlar',
    interior: 'Interer',
    events: 'Tadbirlar'
  };

  const images: GalleryImage[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      title: 'Restoran interyeri',
      category: 'interior'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      title: 'Zamonaviy dizayn',
      category: 'interior'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
      title: 'Yangi salat',
      category: 'food'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
      title: 'Baliq taomi',
      category: 'food'
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80',
      title: 'Go\'sht taomi',
      category: 'food'
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
      title: 'Shirinlik',
      category: 'food'
    },
    {
      id: '7',
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
      title: 'Maxsus tadbir',
      category: 'events'
    },
    {
      id: '8',
      url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
      title: 'To\'y marosimi',
      category: 'events'
    }
  ];

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="gallery-page">
      <div className="container">
        <h1 className="page-title">Galereya</h1>
        <p className="page-subtitle">Bizning restoran va taomlarimiz</p>

        <div className="gallery-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {categoryNames[category]}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filteredImages.map(image => (
            <div
              key={image.id}
              className="gallery-item"
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.url} alt={image.title} />
              <div className="gallery-overlay">
                <h3>{image.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="gallery-modal" onClick={() => setSelectedImage(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedImage(null)}>
                ×
              </button>
              <img src={selectedImage.url} alt={selectedImage.title} />
              <h3>{selectedImage.title}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
