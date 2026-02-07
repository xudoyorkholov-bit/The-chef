import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  user: any;
  onLogout: () => void;
  onBackToSite: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose, user, onLogout, onBackToSite }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round"/>
          <rect x="14" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round"/>
          <rect x="14" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round"/>
          <rect x="3" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Dashboard'
    },
    {
      path: '/admin/menu',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Menyu'
    },
    {
      path: '/admin/orders',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2h-3" strokeWidth="2"/>
          <rect x="9" y="2" width="6" height="4" rx="1" strokeWidth="2"/>
          <path d="M9 12h6M9 16h6" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Buyurtmalar'
    },
    {
      path: '/admin/testimonials',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Mijozlar fikri'
    },
    {
      path: '/admin/gallery',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2"/>
          <path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Galereya'
    },
    {
      path: '/admin/customers',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2"/>
          <circle cx="9" cy="7" r="4" strokeWidth="2"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeWidth="2"/>
        </svg>
      ),
      label: 'Mijozlar'
    }
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-header-content">
          <div className="admin-sidebar-logo-section">
            <h2 className="admin-sidebar-logo">The Chef</h2>
            <span className="admin-sidebar-subtitle">Admin Panel</span>
          </div>
          <button 
            className="admin-settings-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title="Sozlamalar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" strokeWidth="2"/>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        {isDropdownOpen && (
          <div className="admin-dropdown-menu">
            <div className="admin-dropdown-user">
              <div className="admin-dropdown-avatar">
                {(user?.full_name || user?.username || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="admin-dropdown-user-info">
                <div className="admin-dropdown-name">{user?.full_name || user?.username}</div>
                <div className="admin-dropdown-role">Admin</div>
              </div>
            </div>
            
            <div className="admin-dropdown-divider"></div>
            
            <div className="admin-dropdown-section">
              <div className="admin-dropdown-section-title">Sozlamalar</div>
              <button 
                className="admin-dropdown-item"
                onClick={() => {
                  // TODO: Parol o'zgartirish modali
                  console.log('Parol o\'zgartirish');
                  setIsDropdownOpen(false);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Parol o'zgartirish</span>
              </button>
              
              <button 
                className="admin-dropdown-item"
                onClick={() => {
                  // TODO: Telefon raqam o'zgartirish modali
                  console.log('Telefon raqam o\'zgartirish');
                  setIsDropdownOpen(false);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Telefon raqam</span>
              </button>
            </div>
            
            <div className="admin-dropdown-divider"></div>
            
            <button 
              className="admin-dropdown-item"
              onClick={() => {
                onBackToSite();
                setIsDropdownOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Asosiy sayt</span>
            </button>
            
            <button 
              className="admin-dropdown-item admin-dropdown-item-danger"
              onClick={() => {
                onLogout();
                setIsDropdownOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Chiqish</span>
            </button>
          </div>
        )}
      </div>

      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `admin-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={() => {
              if (onClose) {
                onClose();
              }
            }}
          >
            <span className="admin-nav-icon">{item.icon}</span>
            <span className="admin-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
