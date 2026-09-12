import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import type { LoginRequestDto, RegisterRequestDto } from '../types/auth';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isLogin) {
        const res = await authApi.login({ email, password });
        const token = res.token || res.accessToken || (res as unknown as string);
        localStorage.setItem('token', token);
        navigate('/profile');
      } else {
        await authApi.register({ email, password });
        setMessage('Реєстрація пройшла успішно! Тепер можете увійти.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Помилка виконання запиту');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '450px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>☕ Coffee Shop</h2>

      {message && (
        <p style={{ color: message.includes('Помилка') ? 'red' : 'green', textAlign: 'center' }}>
          {message}
        </p>
      )}

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
  );
}