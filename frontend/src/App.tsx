import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import InstallPrompt from './components/InstallPrompt';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import ReservationPage from './pages/ReservationPage';
import TestimonialsPage from './pages/TestimonialsPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import InstallGuidePage from './pages/InstallGuidePage';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  // Service worker cleanup - only run once
  useEffect(() => {
    const hasCleanedUp = sessionStorage.getItem('sw-cleaned');
    
    if (!hasCleanedUp) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            console.log('Unregistering service worker:', registration);
            registration.unregister();
          });
        });
      }
      
      // Clear all caches
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            console.log('Deleting cache:', cacheName);
            caches.delete(cacheName);
          });
        });
      }
      
      sessionStorage.setItem('sw-cleaned', 'true');
    }
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <InstallPrompt />
            <Routes>
              {/* Public route */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Admin routes */}
              <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
              <Route path="/admin/menu" element={<AdminRoute><AdminLayout><div>Menu Management</div></AdminLayout></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminLayout><div>Orders Management</div></AdminLayout></AdminRoute>} />
              <Route path="/admin/reservations" element={<AdminRoute><AdminLayout><div>Reservations Management</div></AdminLayout></AdminRoute>} />
              <Route path="/admin/messages" element={<AdminRoute><AdminLayout><div>Messages Management</div></AdminLayout></AdminRoute>} />
              <Route path="/admin/gallery" element={<AdminRoute><AdminLayout><div>Gallery Management</div></AdminLayout></AdminRoute>} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Layout><HomePage /></Layout></ProtectedRoute>} />
              <Route path="/menu" element={<ProtectedRoute><Layout><MenuPage /></Layout></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Layout><OrdersPage /></Layout></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Layout><CartPage /></Layout></ProtectedRoute>} />
              <Route path="/reservations" element={<ProtectedRoute><Layout><ReservationPage /></Layout></ProtectedRoute>} />
              <Route path="/testimonials" element={<ProtectedRoute><Layout><TestimonialsPage /></Layout></ProtectedRoute>} />
              <Route path="/gallery" element={<ProtectedRoute><Layout><GalleryPage /></Layout></ProtectedRoute>} />
              <Route path="/contact" element={<ProtectedRoute><Layout><ContactPage /></Layout></ProtectedRoute>} />
              <Route path="/install-guide" element={<ProtectedRoute><Layout><InstallGuidePage /></Layout></ProtectedRoute>} />
              
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
