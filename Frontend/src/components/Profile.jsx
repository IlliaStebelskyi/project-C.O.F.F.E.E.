import React, { useEffect, useState } from 'react';
import API from '../api/axios';

export default function Profile() {
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phoneNumber: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/user/profile') // или '/user/me' в зависимости от вашего контроллера
      .then((res) => setProfile(res.data))
      .catch((err) => console.error('Ошибка загрузки профиля:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put('/user/profile', profile);
      setMessage('Профиль успешно обновлен!');
    } catch (err) {
      setMessage('Ошибка при сохранении профиля');
    }
  };

  if (loading) return <div>Загрузка профиля...</div>;

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto' }}>
      <h2>Профиль пользователя</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя:</label>
          <input
            type="text"
            value={profile.firstName || ''}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
          />
        </div>
        <div>
          <label>Фамилия:</label>
          <input
            type="text"
            value={profile.lastName || ''}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
          />
        </div>
        <div>
          <label>Телефон:</label>
          <input
            type="text"
            value={profile.phoneNumber || ''}
            onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
          />
        </div>
        <div>
          <label>Адрес:</label>
          <input
            type="text"
            value={profile.address || ''}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Сохранить</button>
      </form>
    </div>
  );
}