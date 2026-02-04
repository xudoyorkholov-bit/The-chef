import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

interface AdminSidebarProps {
  isOpen: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
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
      path: '/admin/reservations',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/>
          <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Rezervatsiyalar'
    },
    {
      path: '/admin/messages',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Xabarlar'
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
    }
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="admin-sidebar-header">
        <h2 className="admin-sidebar-logo">The Chef</h2>
        <span className="admin-sidebar-subtitle">Admin Panel</span>
      </div>

      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `admin-nav-item ${isActive ? 'active' : ''}`
            }
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
