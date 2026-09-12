import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi';

export default function ProfilePage() {
  // Объявляем тип прямо здесь, без отдельной строки import
  const [profile, setProfile] = useState<import('../types/user').UserProfileDto | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    userApi.getProfile()
      .then((data) => setProfile(data))
      .catch(() => {
        setError('Сесія закінчилася. Будь ласка, увійдіть знову.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '450px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>☕ Особистий кабінет</h2>

      {error ? (
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      ) : profile ? (
        <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
          {JSON.stringify(profile, null, 2)}
        </pre>
      ) : (
        <p style={{ textAlign: 'center' }}>Завантаження даних профілю...</p>
      )}

      <button
        onClick={handleLogout}
        style={{ width: '100%', padding: '10px', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '15px' }}
      >
        Вийти з акаунту
      </button>
    </div>
  );
}