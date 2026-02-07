import React, { useState, useEffect } from 'react';
import { menuApi } from '../api/menu';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/Loader';
import './MenuPage.css';

// Mock data for when backend is not available
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Caesar Salad',
    description: 'Yangi romaine salat, parmesan pishloq va krutonlar bilan',
    price: 45000,
    category: 'appetizer',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Bruschetta',
    description: 'Qovurilgan non pomidor, sarimsoq va rayhon bilan',
    price: 35000,
    category: 'appetizer',
    image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Qovurilgan Losos',
    description: 'Yangi Atlantik losos limon yog\' sousi bilan',
    price: 95000,
    category: 'main',
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Ribeye Steak',
    description: 'Premium 350g ribeye sarimsoq yog\' bilan',
    price: 125000,
    category: 'main',
    image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Tiramisu',
    description: 'Klassik italyan deserti qahva va mascarpone bilan',
    price: 32000,
    category: 'dessert',
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Shokoladli Lava Kek',
    description: 'Issiq shokolad keki eritilgan o\'rtasi bilan',
    price: 35000,
    category: 'dessert',
    image_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Yangi Limonad',
    description: 'Uyda tayyorlangan limonad yalpiz bilan',
    price: 18000,
    category: 'beverage',
    image_url: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400&q=80',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Espresso',
    description: 'Boy italyan espresso',
    price: 15000,
    category: 'beverage',
    image_url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const MenuPage: React.FC = () => {
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const categories = ['all', 'food', 'beverage'];
  const categoryNames: Record<string, string> = {
    all: t('menu.all'),
    food: t('menu.food'),
    beverage: t('menu.beverages')
  };

  // Map original categories to new simplified categories
  const categoryMapping: Record<string, string> = {
    appetizer: 'food',
    main: 'food',
    dessert: 'food',
    beverage: 'beverage'
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const data = await menuApi.getAll();
      setMenuItems(data);
    } catch (err) {
      console.warn('Backend not available, using mock data:', err);
      // Use mock data if backend is not available
      setMenuItems(mockMenuItems);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => categoryMapping[item.category] === selectedCategory);

  const groupedItems = filteredItems.reduce((acc, item) => {
    const mappedCategory = categoryMapping[item.category];
    if (!acc[mappedCategory]) {
      acc[mappedCategory] = [];
    }
    acc[mappedCategory].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Sort categories: food first, then beverage
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    const order = { food: 0, beverage: 1 };
    return (order[a as keyof typeof order] || 999) - (order[b as keyof typeof order] || 999);
  });

  const handleAddToCart = (item: MenuItem) => {
    console.log('Adding to cart:', item);
    try {
      addToCart(item);
      console.log('Successfully added to cart');
      const itemName = language === 'ru' && item.name_ru ? item.name_ru : item.name;
      setToastMessage(`${itemName} ${t('menu.addToCart').toLowerCase()}!`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="menu-page">
      {showToast && (
        <div className="toast-notification">
          <span>✓</span> {toastMessage}
        </div>
      )}
      <div className="container">
        <h1 className="page-title">{t('menu.title')}</h1>
        
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {categoryNames[category]}
            </button>
          ))}
        </div>

        {sortedCategories.map((category) => {
          const items = groupedItems[category];
          return (
            <div key={category} className="menu-category">
              <h2 className="category-title">
                {categoryNames[category]}
              </h2>
              <div className="menu-grid">
                {items.map(item => {
                const itemName = language === 'ru' && item.name_ru ? item.name_ru : item.name;
                const itemDescription = language === 'ru' && item.description_ru ? item.description_ru : item.description;
                
                // Construct full image URL
                const getImageUrl = (url: string) => {
                  if (!url) return 'https://via.placeholder.com/300x200?text=Rasm+yo%27q';
                  if (url.startsWith('http')) return url;
                  // Remove /api from the URL for static files
                  const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
                  return `${baseUrl}${url}`;
                };
                
                return (
                  <div key={item.id} className="menu-item">
                    {item.image_url && (
                      <img 
                        src={getImageUrl(item.image_url)} 
                        alt={itemName} 
                        className="menu-item-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.error('Rasm yuklanmadi:', item.image_url);
                          target.src = 'https://via.placeholder.com/300x200?text=Rasm+topilmadi';
                        }}
                      />
                    )}
                    <div className="menu-item-content">
                      <h3 className="menu-item-name">{itemName}</h3>
                      <p className="menu-item-description">{itemDescription}</p>
                      <p className="menu-item-price">{item.price.toLocaleString()} so'm</p>
                    </div>
                    <button 
                      className="order-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      {t('menu.addToCart')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
};

export default MenuPage;
