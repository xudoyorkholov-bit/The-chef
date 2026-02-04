import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const hasRedirected = useRef(false);

  // Reset redirect flag when location changes
  useEffect(() => {
    hasRedirected.current = false;
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#667eea'
      }}>
        Yuklanmoqda...
      </div>
    );
  }

  if (!isAuthenticated && !hasRedirected.current) {
    hasRedirected.current = true;
    return <Navigate to="/auth" replace />;
  }

  if (!isAuthenticated) {
    // Prevent multiple redirects
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
