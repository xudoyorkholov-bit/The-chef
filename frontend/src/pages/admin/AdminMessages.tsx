import React, { useEffect, useState } from 'react';
import { messagesApi } from '../../api/messages';
import type { ContactMessage } from '../../types';
import './AdminMessages.css';

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messagesApi.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Xabarlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await messagesApi.markAsRead(id);
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Xabarni o\'qilgan deb belgilashda xatolik:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xabarni o\'chirmoqchimisiz?')) return;
    
    try {
      await messagesApi.delete(id);
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (error) {
      console.error('Xabarni o\'chirishda xatolik:', error);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.read;
    if (filter === 'read') return msg.read;
    return true;
  });

  const unreadCount = messages.filter(msg => !msg.read).length;

  if (loading) {
    return (
      <div className="admin-messages">
        <div className="loading-spinner">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="admin-messages">
      <div className="messages-header">
        <div>
          <h1 className="messages-title">Xabarlar</h1>
          <p className="messages-subtitle">
            Foydalanuvchilardan kelgan xabarlar va murojaatlar
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="unread-badge">
            {unreadCount} ta o'qilmagan
          </div>
        )}
      </div>

      <div className="messages-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Barchasi ({messages.length})
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          O'qilmagan ({unreadCount})
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          O'qilgan ({messages.length - unreadCount})
        </button>
      </div>

      <div className="messages-list">
        {filteredMessages.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="2"/>
            </svg>
            <p>Xabarlar topilmadi</p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`message-card ${!message.read ? 'unread' : ''}`}
            >
              <div className="message-header">
                <div className="message-user-info">
                  <div className="message-avatar">
                    {message.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="message-name">{message.name}</h3>
                    <p className="message-date">
                      {new Date(message.created_at).toLocaleString('uz-UZ')}
                    </p>
                  </div>
                </div>
                {!message.read && (
                  <span className="unread-indicator">Yangi</span>
                )}
              </div>

              <div className="message-contact-info">
                <div className="contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2"/>
                    <polyline points="22,6 12,13 2,6" strokeWidth="2"/>
                  </svg>
                  <span>{message.email}</span>
                </div>
                {message.phone && (
                  <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeWidth="2"/>
                    </svg>
                    <span>{message.phone}</span>
                  </div>
                )}
              </div>

              <div className="message-content">
                <p>{message.message}</p>
              </div>

              <div className="message-actions">
                {!message.read && (
                  <button
                    className="action-btn action-btn-primary"
                    onClick={() => handleMarkAsRead(message.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    O'qilgan
                  </button>
                )}
                <button
                  className="action-btn action-btn-danger"
                  onClick={() => handleDelete(message.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="3 6 5 6 21 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  O'chirish
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
