import React from 'react';
import AppLayout from './layout/AppLayout.jsx';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
};

export default ProtectedRoute;
