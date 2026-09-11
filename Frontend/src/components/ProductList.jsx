import React, { useEffect, useState } from 'react';
import API from '../api/axios';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/product')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Ошибка загрузки товаров:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка товаров...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Каталог товаров</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p><strong>Цена:</strong> {p.price} ₴</p>
          </div>
        ))}
      </div>
    </div>
  );
}