import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Перенаправлення з головної сторінки на /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Маршрут форми авторизації та реєстрації */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Маршрут особистого кабінету */}
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Будь-яка невідома адреса перенаправляє на /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}