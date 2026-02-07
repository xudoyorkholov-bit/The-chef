import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi, Order } from '../api/orders';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import './OrdersPage.css';

const OrdersPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Birinchi marta yuklash
    const initialLoad = async () => {
      try {
        setLoading(true);
        const data = await ordersApi.getAll();
        setOrders(data);
      } catch (error) {
        console.error('Buyurtmalarni yuklashda xatolik:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initialLoad();
    
    // Har 5 sekundda buyurtmalarni yangilash (jimgina, loading ko'rsatmasdan)
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      // setLoading(true) ni olib tashladik - faqat birinchi yuklanishda loading ko'rsatiladi
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Buyurtmalarni yuklashda xatolik:', error);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { uz: string; ru: string }> = {
      pending: { uz: 'Kutilmoqda', ru: 'Ожидается' },
      confirmed: { uz: 'Qabul qilindi', ru: 'Принято' },
      delivering: { uz: 'Yo\'lda', ru: 'В пути' },
      completed: { uz: 'Yetib keldi', ru: 'Доставлено' },
      cancelled: { uz: 'Bekor qilindi', ru: 'Отменено' }
    };
    return statusMap[status]?.[language] || status;
  };

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <h1 className="page-title">{t('orders.title')}</h1>
          
          <div className="orders-empty">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2>{t('orders.empty')}</h2>
            <p>{language === 'uz' ? 'Siz hali buyurtma bermagansiz' : 'Вы еще не сделали заказ'}</p>
            <Link to="/menu">
              <Button>{t('menu.title')}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="page-title">{t('orders.title')}</h1>
        
        <div className="orders-list">
          {orders.map(order => (
            <Card key={order.id} className={`order-card status-${order.status}`}>
              <div className="order-header">
                <span className="order-number">{language === 'uz' ? 'Buyurtma' : 'Заказ'} {order.orderNumber}</span>
                <span className={`order-status ${order.status}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="order-items">
                {order.items && order.items.map((item, index) => (
                  <p key={index}>
                    {item.menu_item_name} x {item.quantity} - {(item.price * item.quantity).toLocaleString()} so'm
                  </p>
                ))}
              </div>
              
              <div className="order-footer">
                <span className="order-date">{new Date(order.date).toLocaleDateString(language === 'uz' ? 'uz-UZ' : 'ru-RU')}</span>
                <span className="order-total">{order.total.toLocaleString()} so'm</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
