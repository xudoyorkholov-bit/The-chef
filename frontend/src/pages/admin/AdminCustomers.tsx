import React, { useEffect, useState } from 'react';
import { usersApi } from '../../api/users';
import type { User } from '../../types';
import './AdminCustomers.css';

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Mijozlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Noma\'lum';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Noma\'lum';
      
      return date.toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Noma\'lum';
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? 'Admin' : 'Mijoz';
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? '#8b5cf6' : '#3b82f6';
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.full_name && customer.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.phone && customer.phone.includes(searchTerm));
    
    const matchesRole = filterRole === 'all' || customer.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="admin-customers">
        <div className="loading-spinner">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="admin-customers">
      <div className="admin-customers-header">
        <div>
          <h1 className="admin-customers-title">Mijozlar</h1>
          <p className="admin-customers-subtitle">Ro'yxatdan o'tgan foydalanuvchilar</p>
        </div>
      </div>

      <div className="customers-controls">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Ism, email yoki telefon bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="customers-filters">
          <button 
            className={`filter-btn ${filterRole === 'all' ? 'active' : ''}`}
            onClick={() => setFilterRole('all')}
          >
            Barchasi ({customers.length})
          </button>
          <button 
            className={`filter-btn ${filterRole === 'customer' ? 'active' : ''}`}
            onClick={() => setFilterRole('customer')}
          >
            Mijozlar ({customers.filter(c => c.role === 'customer').length})
          </button>
          <button 
            className={`filter-btn ${filterRole === 'admin' ? 'active' : ''}`}
            onClick={() => setFilterRole('admin')}
          >
            Adminlar ({customers.filter(c => c.role === 'admin').length})
          </button>
        </div>
      </div>

      <div className="customers-grid">
        {filteredCustomers.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2"/>
              <circle cx="9" cy="7" r="4" strokeWidth="2"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeWidth="2"/>
            </svg>
            <p>Mijozlar topilmadi</p>
          </div>
        ) : (
          filteredCustomers.map(customer => (
            <div key={customer.id} className="customer-card">
              <div className="customer-card-header">
                <div className="customer-avatar">
                  {(customer.full_name || customer.username).charAt(0).toUpperCase()}
                </div>
                <span 
                  className="customer-role-badge"
                  style={{ backgroundColor: getRoleColor(customer.role) }}
                >
                  {getRoleBadge(customer.role)}
                </span>
              </div>

              <div className="customer-card-body">
                <h3 className="customer-name">{customer.full_name || customer.username}</h3>
                <p className="customer-username">@{customer.username}</p>

                <div className="customer-info">
                  <div className="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2"/>
                      <path d="M22 6l-10 7L2 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{customer.email}</span>
                  </div>

                  {customer.phone && (
                    <div className="info-row">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeWidth="2"/>
                      </svg>
                      <span>{customer.phone}</span>
                    </div>
                  )}

                  <div className="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Ro'yxatdan o'tgan: {formatDate(customer.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
