import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserListPage from './pages/UserListPage';
import { useAppSelector } from './hooks/useAppSelector';

const App: React.FC = () => {
  const token = useAppSelector((s) => s.auth.token);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? '/users' : '/login'} replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/users" element={token ? <UserListPage /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<div style={{ padding: 24 }}>404 - Not Found</div>} />
    </Routes>
  );
};

export default App;