import React, { useEffect, useState, useMemo } from 'react';
import { testimonialsApi, Testimonial } from '../../api/testimonials';
import './AdminTestimonials.css';

type FilterStatus = 'all' | 'approved' | 'pending' | 'rejected';
type SortBy = 'date-desc' | 'date-asc' | 'rating-desc' | 'rating-asc';

const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date-desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await testimonialsApi.getAll();
      setTestimonials(data);
    } catch (error) {
      console.error('Fikrlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrlangan va saralangan fikrlar
  const filteredAndSortedTestimonials = useMemo(() => {
    let filtered = testimonials;

    // Status bo'yicha filtrlash
    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    // Qidiruv
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.user_name.toLowerCase().includes(query) ||
        t.comment.toLowerCase().includes(query)
      );
    }

    // Saralash
    const sorted = [...filtered];
    switch (sortBy) {
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-asc':
        sorted.sort((a, b) => a.rating - b.rating);
        break;
    }

    return sorted;
  }, [testimonials, filterStatus, searchQuery, sortBy]);

  // Statistika
  const stats = useMemo(() => {
    const total = testimonials.length;
    const approved = testimonials.filter(t => t.status === 'approved').length;
    const pending = testimonials.filter(t => t.status === 'pending').length;
    const rejected = testimonials.filter(t => t.status === 'rejected').length;
    const avgRating = total > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / total).toFixed(1)
      : '0.0';

    return { total, approved, pending, rejected, avgRating };
  }, [testimonials]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    try {
      await testimonialsApi.updateStatus(id, newStatus);
      await fetchTestimonials();
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Statusni o\'zgartirishda xatolik:', error);
      alert('Statusni o\'zgartirishda xatolik');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Fikrni o\'chirmoqchimisiz?')) return;
    
    try {
      await testimonialsApi.delete(id);
      await fetchTestimonials();
      setSelectedIds(new Set());
    } catch (error) {
      console.error('O\'chirishda xatolik:', error);
      alert('O\'chirishda xatolik');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`${selectedIds.size} ta fikrni tasdiqlaysizmi?`)) return;

    try {
      await Promise.all(
        Array.from(selectedIds).map(id => testimonialsApi.updateStatus(id, 'approved'))
      );
      await fetchTestimonials();
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Bulk approve error:', error);
      alert('Tasdiqlashda xatolik');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`${selectedIds.size} ta fikrni o'chirmoqchimisiz?`)) return;

    try {
      await Promise.all(
        Array.from(selectedIds).map(id => testimonialsApi.delete(id))
      );
      await fetchTestimonials();
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('O\'chirishda xatolik');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedTestimonials.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedTestimonials.map(t => t.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={i < rating ? '#fbbf24' : 'none'}
        stroke={i < rating ? '#fbbf24' : '#d1d5db'}
        strokeWidth="2"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { label: 'Tasdiqlangan', color: '#10b981' },
      pending: { label: 'Kutilmoqda', color: '#f59e0b' },
      rejected: { label: 'Rad etilgan', color: '#ef4444' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className="status-badge" style={{ backgroundColor: config.color }}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="admin-testimonials">
        <div className="loading-spinner">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="admin-testimonials">
      <div className="admin-testimonials-header">
        <div>
          <h1 className="admin-testimonials-title">Mijozlar fikri</h1>
          <p className="admin-testimonials-subtitle">Mijozlar fikrlarini boshqaring</p>
        </div>
      </div>

      {/* Statistika */}
      <div className="stats-grid">
        <div 
          className={`stat-card clickable ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Jami fikrlar</div>
          </div>
        </div>

        <div 
          className={`stat-card clickable ${filterStatus === 'approved' ? 'active' : ''}`}
          onClick={() => setFilterStatus('approved')}
        >
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats.approved}</div>
            <div className="stat-label">Tasdiqlangan</div>
          </div>
        </div>

        <div 
          className={`stat-card clickable ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ca8a04">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Kutilmoqda</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef9c3' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats.avgRating}</div>
            <div className="stat-label">O'rtacha reyting</div>
          </div>
        </div>
      </div>

      {/* Filtrlash va qidiruv */}
      <div className="filters-section">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Mijoz ismi yoki fikr matni bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Barchasi ({testimonials.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('approved')}
          >
            Tasdiqlangan ({stats.approved})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Kutilmoqda ({stats.pending})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilterStatus('rejected')}
          >
            Rad etilgan ({stats.rejected})
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="sort-select"
        >
          <option value="date-desc">Yangi birinchi</option>
          <option value="date-asc">Eski birinchi</option>
          <option value="rating-desc">Yuqori reyting</option>
          <option value="rating-asc">Past reyting</option>
        </select>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="bulk-actions">
          <span className="bulk-count">{selectedIds.size} ta tanlandi</span>
          <button onClick={handleBulkApprove} className="bulk-btn approve">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
            </svg>
            Tasdiqlash
          </button>
          <button onClick={handleBulkDelete} className="bulk-btn delete">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2"/>
            </svg>
            O'chirish
          </button>
          <button onClick={() => setSelectedIds(new Set())} className="bulk-btn cancel">
            Bekor qilish
          </button>
        </div>
      )}

      {/* Barchasini tanlash */}
      {filteredAndSortedTestimonials.length > 0 && (
        <div className="select-all-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedIds.size === filteredAndSortedTestimonials.length}
              onChange={toggleSelectAll}
            />
            <span>Barchasini tanlash</span>
          </label>
        </div>
      )}

      <div className="testimonials-grid">
        {filteredAndSortedTestimonials.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="2"/>
            </svg>
            <p>Fikrlar topilmadi</p>
          </div>
        ) : (
          filteredAndSortedTestimonials.map(testimonial => (
            <div key={testimonial.id} className={`testimonial-card ${selectedIds.has(testimonial.id) ? 'selected' : ''}`}>
              <div className="testimonial-card-header">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(testimonial.id)}
                    onChange={() => toggleSelect(testimonial.id)}
                  />
                </label>
                <div className="testimonial-header-info">
                  <h3 className="testimonial-name">{testimonial.user_name}</h3>
                  <div className="testimonial-rating">{renderStars(testimonial.rating)}</div>
                </div>
                {getStatusBadge(testimonial.status)}
              </div>

              <p className="testimonial-comment">{testimonial.comment}</p>

              <div className="testimonial-card-footer">
                <span className="testimonial-date">{formatDate(testimonial.created_at)}</span>
                <div className="testimonial-actions">
                  <button
                    onClick={() => handleToggleStatus(testimonial.id, testimonial.status)}
                    className={`action-btn ${testimonial.status === 'approved' ? 'approved' : ''}`}
                    title={testimonial.status === 'approved' ? 'Bosh sahifadan yashirish' : 'Bosh sahifaga chiqarish'}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={testimonial.status === 'approved' ? 'currentColor' : 'none'} stroke="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="action-btn delete"
                    title="O'chirish"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;
