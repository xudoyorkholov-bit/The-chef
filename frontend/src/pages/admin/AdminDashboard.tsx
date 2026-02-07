import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { ordersApi } from '../../api/orders';
import { messagesApi } from '../../api/messages';
import { menuApi } from '../../api/menu';

interface DashboardStats {
  totalOrders: number;
  totalMessages: number;
  totalMenuItems: number;
  recentOrders: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  date: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalMessages: 0,
    totalMenuItems: 0,
    recentOrders: 0,
    pendingOrders: 0,
  });
  const [recentOrdersList, setRecentOrdersList] = useState<RecentOrder[]>([]);
  const [pendingOrdersList, setPendingOrdersList] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Barcha ma'lumotlarni parallel ravishda olish
        const [orders, messages, menuItems] = await Promise.all([
          ordersApi.getAll(),
          messagesApi.getAll(),
          menuApi.getAll()
        ]);

        // Oxirgi 24 soat ichidagi buyurtmalar
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const recentOrders = orders.filter(order => 
          new Date(order.date) > oneDayAgo
        );

        // Kutilayotgan buyurtmalar
        const pendingOrders = orders.filter(order => 
          order.status === 'pending' || order.status === 'confirmed'
        );

        // O'qilmagan xabarlar
        const unreadMessages = messages.filter(msg => !msg.read);

        setStats({
          totalOrders: orders.length,
          totalMessages: unreadMessages.length,
          totalMenuItems: menuItems.length,
          recentOrders: recentOrders.length,
          pendingOrders: pendingOrders.length,
        });

        // Oxirgi 3 ta buyurtmani ko'rsatish
        setRecentOrdersList(
          orders
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
        );

        // Kutilayotgan 3 ta buyurtmani ko'rsatish
        setPendingOrdersList(pendingOrders.slice(0, 3));

      } catch (error) {
        console.error('Dashboard ma\'lumotlarini yuklashda xato:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Kutilmoqda';
      case 'confirmed': return 'Tasdiqlandi';
      case 'delivering': return 'Yetkazilmoqda';
      case 'completed': return 'Tayyor';
      case 'cancelled': return 'Bekor qilindi';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'delivering': return 'status-processing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hozir';
    if (diffMins < 60) return `${diffMins} daqiqa oldin`;
    if (diffHours < 24) return `${diffHours} soat oldin`;
    return `${diffDays} kun oldin`;
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Yuklanmoqda...</h1>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Jami buyurtmalar',
      value: stats.totalOrders,
      change: `+${stats.recentOrders}`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2h-3" strokeWidth="2"/>
          <rect x="9" y="2" width="6" height="4" rx="1" strokeWidth="2"/>
          <path d="M9 12h6M9 16h6" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      color: 'blue',
    },
    {
      title: 'Yangi xabarlar',
      value: stats.totalMessages,
      change: `${stats.totalMessages} ta`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'purple',
    },
    {
      title: 'Menyu elementlari',
      value: stats.totalMenuItems,
      change: `${stats.totalMenuItems} ta`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'orange',
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Restoran statistikasi va umumiy ma'lumotlar</p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('uz-UZ', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className={`stat-card stat-card-${card.color}`}>
            <span className="stat-card-change">{card.change}</span>
            <div className="stat-card-header">
              <div className="stat-card-icon">{card.icon}</div>
            </div>
            <div className="stat-card-body">
              <h3 className="stat-card-value">{card.value}</h3>
              <p className="stat-card-title">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">So'nggi buyurtmalar</h2>
            <span className="card-badge">{stats.recentOrders} ta yangi</span>
          </div>
          <div className="card-content">
            <div className="activity-list">
              {recentOrdersList.length > 0 ? (
                recentOrdersList.map((order) => (
                  <div key={order.id} className="activity-item">
                    <div className={`activity-icon ${
                      order.status === 'completed' ? 'activity-icon-green' :
                      order.status === 'delivering' ? 'activity-icon-blue' :
                      'activity-icon-orange'
                    }`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2h-3" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">Buyurtma #{order.orderNumber}</p>
                      <p className="activity-time">{getTimeAgo(order.date)}</p>
                    </div>
                    <span className={`activity-status ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  Hozircha buyurtmalar yo'q
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Kutilayotgan buyurtmalar</h2>
            <span className="card-badge">{stats.pendingOrders} ta</span>
          </div>
          <div className="card-content">
            <div className="activity-list">
              {pendingOrdersList.length > 0 ? (
                pendingOrdersList.map((order) => (
                  <div key={order.id} className="activity-item">
                    <div className="activity-icon activity-icon-orange">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2h-3" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">Buyurtma #{order.orderNumber}</p>
                      <p className="activity-time">{getTimeAgo(order.date)}</p>
                    </div>
                    <span className={`activity-status ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  Kutilayotgan buyurtmalar yo'q
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
