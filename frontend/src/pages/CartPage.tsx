import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ordersApi } from '../api/orders';
import Button from '../components/Button';
import './CartPage.css';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [isOrdering, setIsOrdering] = useState(false);

  const handleOrder = async () => {
    setIsOrdering(true);
    
    try {
      // Backend'ga buyurtma yuborish
      const orderData = {
        items: cartItems.map(item => ({
          menu_item_id: item.id,
          menu_item_name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: getTotalPrice()
      };
      
      console.log('Sending order data:', JSON.stringify(orderData, null, 2));
      
      const response = await ordersApi.create(orderData);
      console.log('Order created successfully:', response);
      
      // Savatni tozalash
      clearCart();
      setIsOrdering(false);
      
      // Buyurtmalar sahifasiga o'tish
      navigate('/orders');
    } catch (error: any) {
      console.error('Buyurtma yaratishda xatolik:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setIsOrdering(false);
      
      const errorMessage = error.response?.data?.error?.message || 
                          error.message || 
                          'Buyurtma yaratishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.';
      alert(errorMessage);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="page-title">{t('cart.title')}</h1>
          
          <div className="cart-empty">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2>{t('cart.empty')}</h2>
            <p>{t('menu.title')}</p>
            <Link to="/menu">
              <Button>{t('menu.title')}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">{t('cart.title')}</h1>
        
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image_url} alt={item.name} className="item-image" />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <p className="item-price">{item.price.toLocaleString()} so'm</p>
              </div>
              <div className="item-actions">
                <div className="item-quantity">
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  {t('cart.remove')}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <div className="summary-row">
            <span>{t('cart.total')}:</span>
            <span className="summary-total">{getTotalPrice().toLocaleString()} so'm</span>
          </div>
          <div className="summary-actions">
            <Button fullWidth onClick={handleOrder} disabled={isOrdering}>
              {isOrdering ? 'Yuborilmoqda...' : t('cart.checkout')}
            </Button>
            <button className="clear-cart-btn" onClick={clearCart}>
              {t('cart.empty')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
