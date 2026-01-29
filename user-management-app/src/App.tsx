import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserListPage from './pages/UserListPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { useAppSelector } from './hooks/useAppSelector';
import { useAppDispatch } from './hooks/useAppDispatch';
import { loadStoredAuth } from './store/authSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((s) => s.auth);

  useEffect(() => {
    // Try to load stored authentication on app start
    dispatch(loadStoredAuth());
  }, [dispatch]);

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/users' : '/login'} replace />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/users" replace /> : <LoginPage />} />
      <Route path="/users" element={isAuthenticated ? <UserListPage /> : <Navigate to="/login" replace />} />
      <Route path="/analytics" element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<div style={{ padding: 24 }}>404 - Not Found</div>} />
    </Routes>
  );
};

export default App;