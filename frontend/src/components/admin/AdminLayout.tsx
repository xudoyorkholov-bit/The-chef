import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleBackToSite = () => {
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={isSidebarOpen} />
      
      <div className={`admin-main ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <div className="admin-header-left">
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
          </div>
          
          <div className="admin-header-right">
            <span className="admin-user-name">{user?.full_name || user?.username}</span>
            <button 
              className="admin-btn admin-btn-secondary"
              onClick={handleBackToSite}
            >
              Asosiy saytga qaytish
            </button>
            <button 
              className="admin-btn admin-btn-danger"
              onClick={handleLogout}
            >
              Chiqish
            </button>
          </div>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
