import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import './Questionnaires.css';

function Profile() {
  const location = useLocation();
  const skinType = location.state?.skinType || 'unknown';
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`/api/products/${skinType}`);
      const data = await res.json();
      setProducts(data);
    };

    if (skinType !== 'unknown') fetchProducts();
  }, [skinType]);

  const toggleProduct = (productId, usage_time) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: usage_time
    }));
  };

  const handleSubmit = async () => {
    for (const [productId, usage_time] of Object.entries(selectedProducts)) {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, usage_time }),
      });
    }

    alert("Schedule saved!");
  };

  return (
    <div className="questionnaire" style={{ backgroundColor: '#f0ede5', minHeight: '100vh' }}>
      <Navbar />
      <div className="questionnaire-inner">
        <h2 className="questionnaire-title">👤 Your Profile</h2>
        <p>Your skin type is: <strong>{skinType}</strong></p>

        <h3 style={{ marginTop: '2rem' }}>Recommended Products:</h3>
        {products.map((p) => (
          <div key={p.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <p><strong>{p.name}</strong> ({p.type})</p>
            <img src={`/images/${p.image_url}`} alt={p.name} width="100" style={{ borderRadius: '8px' }} />

            <select onChange={(e) => toggleProduct(p.id, e.target.value)} className="input-field" style={{ marginTop: '0.5rem' }}>
              <option value="">Choose usage time</option>
              <option value="morning">Morning</option>
              <option value="night">Night</option>
            </select>
          </div>
        ))}

        <button onClick={handleSubmit}>Save Schedule</button>
      </div>
    </div>
  );
}

export default Profile;
