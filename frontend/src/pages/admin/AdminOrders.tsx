import React, { useEffect, useState } from 'react';
import { ordersApi } from '../../api/orders';
import audioAnnouncementService from '../../services/audioAnnouncementService';
import { useLanguage } from '../../context/LanguageContext';
import './AdminOrders.css';

interface OrderItem {
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  delivery_address?: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [previousOrderCount, setPreviousOrderCount] = useState(0);
  const { language } = useLanguage();

  // Oddiy uzunroq xabar ovozi (4 sekund)
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Birinchi signal (baland va uzun)
      const oscillator1 = audioContext.createOscillator();
      const gainNode1 = audioContext.createGain();
      oscillator1.connect(gainNode1);
      gainNode1.connect(audioContext.destination);
      oscillator1.frequency.value = 800; // Baland chastota
      oscillator1.type = 'sine';
      gainNode1.gain.setValueAtTime(0.8, audioContext.currentTime);
      gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
      oscillator1.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 2);

      // Ikkinchi signal (baland va uzun)
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      oscillator2.frequency.value = 800;
      oscillator2.type = 'sine';
      gainNode2.gain.setValueAtTime(0, audioContext.currentTime + 2.2);
      gainNode2.gain.setValueAtTime(0.8, audioContext.currentTime + 2.3);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 4.3);
      oscillator2.start(audioContext.currentTime + 2.2);
      oscillator2.stop(audioContext.currentTime + 4.3);
      
      console.log('🔔 Yangi buyurtma - uzun signal ovozi (4 sekund)');
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      // setLoading ni olib tashladik - faqat birinchi yuklanishda loading ko'rsatiladi
      const data = await ordersApi.getAll();
      
      // Yangi buyurtma kelganini tekshirish
      if (previousOrderCount > 0 && data.length > previousOrderCount) {
        playNotificationSound();
      }
      
      setPreviousOrderCount(data.length);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    // Birinchi marta yuklash
    const initialLoad = async () => {
      try {
        setLoading(true);
        const data = await ordersApi.getAll();
        setPreviousOrderCount(data.length);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
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
  }, []); // Bo'sh dependency array - faqat mount vaqtida ishga tushadi

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Noma\'lum';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Noma\'lum';
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const timeStr = date.toLocaleTimeString('uz-UZ', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      if (date.toDateString() === today.toDateString()) {
        return `Bugun, ${timeStr}`;
      } else if (date.toDateString() === yesterday.toDateString()) {
        return `Kecha, ${timeStr}`;
      } else {
        return date.toLocaleString('uz-UZ', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      return 'Noma\'lum';
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Noma\'lum';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Noma\'lum';
      
      return date.toLocaleTimeString('uz-UZ', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return 'Noma\'lum';
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      await fetchOrders(); // Darhol yangilash
      
      // Announce order number when status changes to ready or completed
      const order = orders.find(o => o.id === orderId);
      if (order && order.order_number && (newStatus === 'delivering' || newStatus === 'completed')) {
        try {
          // Use language from context: 'uz' -> 'uz-UZ', 'ru' -> 'ru-RU'
          const langCode = language === 'ru' ? 'ru-RU' : 'uz-UZ';
          await audioAnnouncementService.announce(order.order_number, langCode);
        } catch (error) {
          console.error('Audio announcement error:', error);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Status yangilashda xatolik');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      delivering: '#8b5cf6',
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Kutilmoqda',
      confirmed: 'Qabul qilindi',
      delivering: 'Yo\'lda',
      completed: 'Yetib keldi',
      cancelled: 'Bekor qilindi'
    };
    return texts[status] || status;
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="admin-orders">
        <div className="loading-spinner">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <div>
          <h1 className="admin-orders-title">Buyurtmalar</h1>
          <p className="admin-orders-subtitle">Barcha buyurtmalarni boshqaring</p>
        </div>
      </div>

      <div className="orders-filters">
        <button 
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          Barchasi ({orders.length})
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          Kutilmoqda ({orders.filter(o => o.status === 'pending').length})
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('confirmed')}
        >
          Qabul qilindi ({orders.filter(o => o.status === 'confirmed').length})
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'delivering' ? 'active' : ''}`}
          onClick={() => setFilterStatus('delivering')}
        >
          Yo'lda ({orders.filter(o => o.status === 'delivering').length})
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}
        >
          Yetib keldi ({orders.filter(o => o.status === 'completed').length})
        </button>
      </div>

      <div className="orders-grid">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2h-3" strokeWidth="2"/>
              <rect x="9" y="2" width="6" height="4" rx="1" strokeWidth="2"/>
            </svg>
            <p>Buyurtmalar topilmadi</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h3 className="order-number">#{order.order_number}</h3>
                  <p className="order-date">
                    {formatDateTime(order.created_at)}
                  </p>
                </div>
                <span 
                  className="order-status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="order-customer-info">
                <div className="info-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2"/>
                    <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                  </svg>
                  <span>{order.customer_name || 'Noma\'lum'}</span>
                </div>
                <div className="info-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeWidth="2"/>
                  </svg>
                  <span>{order.customer_phone || 'Noma\'lum'}</span>
                </div>
                {order.delivery_address && (
                  <div className="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeWidth="2"/>
                      <circle cx="12" cy="10" r="3" strokeWidth="2"/>
                    </svg>
                    <span>{order.delivery_address}</span>
                  </div>
                )}
              </div>

              <div className="order-items">
                <h4>Mahsulotlar:</h4>
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="order-item">
                    <span className="item-name">{item.menu_item_name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">{item.price.toLocaleString()} so'm</span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="order-footer-top">
                  <div className="order-time-info">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Buyurtma vaqti: {formatTime(order.created_at)}</span>
                  </div>
                  <div className="order-total">
                    <span>Jami:</span>
                    <strong>{order.total.toLocaleString()} so'm</strong>
                  </div>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Kutilmoqda</option>
                  <option value="confirmed">Qabul qilindi</option>
                  <option value="delivering">Yo'lda</option>
                  <option value="completed">Yetib keldi</option>
                  <option value="cancelled">Bekor qilindi</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
