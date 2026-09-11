import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Автоматично додаємо JWT-токен у заголовки запитів
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  
  // Поля форми авторизації/реєстрації
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Дані профілю
  const [profile, setProfile] = useState<any>(null);
  const [message, setMessage] = useState('');

  // Завантаження профілю, якщо користувач увійшов
  useEffect(() => {
    if (token) {
      API.get('/User/me')
        .then((res) => setProfile(res.data))
        .catch(() => {
          setMessage('Сесія закінчилася. Будь ласка, увійдіть знову.');
          handleLogout();
        });
    }
  }, [token]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    const endpoint = isLogin ? '/Auth/login' : '/Auth/register';
    try {
      const res = await API.post(endpoint, { email, password });
      
      if (isLogin) {
        const jwtToken = res.data.token || res.data.accessToken || res.data;
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        setMessage('Успішний вхід!');
      } else {
        setMessage('Реєстрація пройшла успішно! Тепер можете увійти.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Помилка виконання запиту');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setProfile(null);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '450px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>☕ Coffee Shop</h2>

      {message && (
        <p style={{ color: message.includes('Помилка') || message.includes('закінчилася') ? 'red' : 'green', textAlign: 'center' }}>
          {message}
        </p>
      )}

      {!token ? (
        <div>
          <h3>{isLogin ? 'Вхід до акаунту' : 'Реєстрація'}</h3>
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="email"
              placeholder="Електронна пошта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button type="submit" style={{ padding: '10px', backgroundColor: '#6F4E37', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {isLogin ? 'Увійти' : 'Зареєструватися'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            {isLogin ? 'Немає акаунту?' : 'Вже є акаунт?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isLogin ? 'Зареєструватися' : 'Увійти'}
            </button>
          </p>
        </div>
      ) : (
        <div>
          <h3>Особистий кабінет</h3>
          {profile ? (
            <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
              {JSON.stringify(profile, null, 2)}
            </pre>
          ) : (
            <p>Завантаження даних профілю...</p>
          )}

          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '10px', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '15px' }}
          >
            Вийти з акаунту
          </button>
        </div>
      )}
    </div>
  );
}