import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ordersApi } from '../../api/orders';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // Kompyuterda doim ochiq, telefonda yopiq
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [newOrderNumber, setNewOrderNumber] = useState<string>('');
  const [showNotification, setShowNotification] = useState(false);
  const [lastOrderIds, setLastOrderIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Birinchi yuklashda buyurtmalarni olish
    const initOrders = async () => {
      try {
        const data = await ordersApi.getAll();
        setLastOrderIds(new Set(data.map((o: any) => o.id)));
        console.log('Initial orders loaded:', data.length);
      } catch (error) {
        console.error('Error initializing orders:', error);
      }
    };

    initOrders();

    // Har 3 sekundda yangi buyurtmalarni tekshirish
    const interval = setInterval(async () => {
      try {
        const data = await ordersApi.getAll();
        
        // Yangi buyurtmalarni topish
        setLastOrderIds((prevIds) => {
          const newOrders = data.filter((order: any) => !prevIds.has(order.id));
          
          if (newOrders.length > 0) {
            console.log('New orders found:', newOrders.length);
            // Faqat eng yangi buyurtmani ko'rsatish
            const latestOrder = newOrders[0] as any;
            setNewOrderNumber(latestOrder.order_number);
            setShowNotification(true);
            
            // Ovozli bildirishnoma
            playNotificationSound();
            
            // Buyurtma raqamini ovozda aytish
            speakOrderNumber(latestOrder.order_number);
            
            // Bildirishnomani 5 sekunddan keyin yashirish
            setTimeout(() => {
              setShowNotification(false);
            }, 5000);
          }
          
          return new Set(data.map((o: any) => o.id));
        });
      } catch (error) {
        console.error('Error checking for new orders:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []); // Bo'sh dependency array - faqat bir marta ishga tushadi

  const playNotificationSound = () => {
    try {
      // Web Audio API bilan balandroq bildirishnoma ovozi
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Birinchi tovush - yuqori va balandroq
      const oscillator1 = audioContext.createOscillator();
      const gainNode1 = audioContext.createGain();
      
      oscillator1.connect(gainNode1);
      gainNode1.connect(audioContext.destination);
      
      oscillator1.frequency.value = 1000; // Yuqoriroq tovush
      oscillator1.type = 'sine';
      
      gainNode1.gain.setValueAtTime(0.6, audioContext.currentTime); // Balandroq (60%)
      gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator1.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.3);
      
      // Ikkinchi tovush - pastroq va balandroq
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      
      oscillator2.frequency.value = 750; // Pastroq tovush
      oscillator2.type = 'sine';
      
      gainNode2.gain.setValueAtTime(0.6, audioContext.currentTime + 0.2); // Balandroq
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator2.start(audioContext.currentTime + 0.2);
      oscillator2.stop(audioContext.currentTime + 0.5);
      
      console.log('Notification sound played');
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  const speakOrderNumber = (orderNumber: string) => {
    try {
      // Web Speech API bilan buyurtma raqamini aytish
      if ('speechSynthesis' in window) {
        // Oldingi ovozlarni to'xtatish
        window.speechSynthesis.cancel();
        
        // 0.6 soniya kutish - signal ovozi tugagandan keyin
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance();
          utterance.text = `Buyurtma ${orderNumber} keldi`;
          utterance.lang = 'uz-UZ'; // O'zbek tili
          utterance.rate = 0.9; // Tezlik (biroz sekinroq)
          utterance.pitch = 1.1; // Balandlik
          utterance.volume = 1.0; // Maksimal ovoz (100%)
          
          window.speechSynthesis.speak(utterance);
          console.log('Speaking order number:', orderNumber);
        }, 600);
      } else {
        console.log('Speech synthesis not supported');
      }
    } catch (error) {
      console.error('Error speaking order number:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleBackToSite = () => {
    navigate('/');
  };

  return (
    <div className="admin-layout">
      {showNotification && (
        <div className="global-order-notification">
          <div className="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 01-3.46 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <strong>Yangi buyurtma!</strong>
              <p>Buyurtma #{newOrderNumber} keldi</p>
            </div>
          </div>
        </div>
      )}

      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
        onBackToSite={handleBackToSite}
      />
      
      <div className={`admin-main ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <h1 className="admin-title">Admin Panel</h1>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
